/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved. 
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *   
 *  The above copyright notice and this permission notice shall be included in 
 *  all copies or substantial portions of the Software.
 *   
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

module powerbi.data.dsr {

    import Segmentation = powerbi.data.segmentation;

    /** This is the data contract for the DataViewSource.data string, which should be JSON. */
    export interface DataViewData {
        descriptor: QueryBindingDescriptor;
        dsr: dsr.DataShapeResult;
        schemaName: string;
    }

    interface IDsrReaderStrategy {
        read(dataShapeExprs: DataShapeExpressions, dataShape: DataShape): DataView;
    }

    export function read(arg: any): DataProviderTransformResult {
        debug.assertValue(arg, 'arg');

        var dataObj: DataViewData = arg;
        if (typeof (arg) === 'string')
            dataObj = <DataViewData>JSON.parse(arg);

        return readDsr(dataObj.descriptor, dataObj.dsr, dataObj.schemaName);
    }

    // Public for testability
    export function readDsr(descriptor: QueryBindingDescriptor, dsr: DataShapeResult, schemaName: string): DataProviderTransformResult {
        debug.assertAnyValue(descriptor, 'descriptor');
        debug.assertValue(dsr, 'dsr');

        if (!dsr.DataShapes || dsr.DataShapes.length !== 1)
            return null;

        var dataShape = dsr.DataShapes[0];
        var oDataError = dataShape['odata.error'];

        if (oDataError) {
            var clientError: DsrClientError = new DsrClientError(dataShape['odata.error']);

            var result: DataProviderTransformResult = {
                error: clientError,
            };
            return result;
        }

        var dsrReaderResult: DataProviderTransformResult = {
            dataView: loadStrategy(new DsrReaderContext(descriptor.Select, schemaName)).read(descriptor.Expressions, dataShape),
        };

        if (dataShape.RestartTokens)
            dsrReaderResult.restartToken = dataShape.RestartTokens;

        if (dataShape.DataLimitsExceeded && dataShape.DataLimitsExceeded.length > 0)
            dsrReaderResult.warning = new DsrLimitsWarning(descriptor);

        return dsrReaderResult;
    }

    function loadStrategy(context: DsrReaderContext): IDsrReaderStrategy {
        debug.assertValue(context, 'context');

        var primaryDepth = 0,
            secondaryDepth = 0,
            selects = context.selects;

        for (var i = 0, len = selects.length; i < len; i++) {
            var select = selects[i];
            if (select) {
                if (select.Depth != null)
                    primaryDepth = Math.max(primaryDepth, select.Depth + 1);

                if (select.SecondaryDepth != null)
                    secondaryDepth = Math.max(secondaryDepth, select.SecondaryDepth + 1);
            }
        }

        if (secondaryDepth >= 1 && primaryDepth === 1)
            return new DsrWithPivotedColumnsStrategy(context);

        return new DsrToTreeStrategy(context);
    }

    function ensureTreeNodeValues<T>(node: DataViewTreeNode, ordinal: number): T {
        debug.assertValue(node, 'node');

        var values = node.values;
        if (!values)
            values = node.values = {};

        var value = values[ordinal];
        if (!value)
            value = values[ordinal] = {};

        return <T>value;
    }

    /** Reads the DSR into a matrix DataView.
     *
     *  Matrix data view: 
     *    > hierarchies: 
     *      - row headers are in the primary hierarchy, column headers are in the secondary hierarchy
     *      - row and column hierarchies are represented by tree of nodes
     *      - the root node's role is to hold references to the first level nodes. It's not part of the matrix layout
     *      - in case of multiple measures an extra level is added to the column hierarchy (each measure will have its header) ->
     *        there may be multiple sources on the same level (i.e. Measure Column 1, Measure Column 2)
     *      - tree nodes don't contain member calculations (e.g. subtotal), except row hierarchy leaf nodes
     *      - each node has a reference to its own metadata column
     *
     *    > values (cells):
     *      - values for cells are stored in a value collection exposed by the leaf nodes in the primary hierarchy
     *      - each value (cell) has a reference to its own metadata column
     *
     *    > totals:
     *
     */
    module DsrToMatrixParser {
        enum MemberType {
            Undetermined,
            GroupDynamic,
            MeasureStatic,
            SubtotalStatic,
            Unsupported
        }

        export function parse(
            context: DsrReaderContext,
            dataShapeExprs: DataShapeExpressions,
            dataShape: DataShape,
            metadata: DataViewMetadata): DataViewMatrix {
            debug.assertValue(context, 'context');
            debug.assertValue(dataShape, 'dataShape');
            debug.assertValue(metadata, 'metadata');

            var primaryLevelSources: DataViewHierarchyLevel[] = [],
                secondaryLevelSources: DataViewHierarchyLevel[] = [],
                measures: DataViewMetadataColumn[] = [];

            if (!processMetadata(context, primaryLevelSources, secondaryLevelSources, measures, metadata.columns))
                return null;

            // Maps the position of an intersection within a row (the index into the array) with the secondary
            // component of the aggregate index (the value in the array).
            var intersectionToSecondaryAggIdx: number[] = [];
            var secondaryRoot = parseSecondaryTree(context, secondaryLevelSources, measures.length, dataShapeExprs, dataShape, intersectionToSecondaryAggIdx);
            var primaryRoot = parsePrimaryTree(context, primaryLevelSources, dataShapeExprs, dataShape, intersectionToSecondaryAggIdx);

            var rows: DataViewHierarchy = { root: primaryRoot, levels: primaryLevelSources };
            var columns: DataViewHierarchy = { root: secondaryRoot, levels: secondaryLevelSources };

            var result: DataViewMatrix = {
                rows: rows,
                columns: columns,
                valueSources: measures
            };

            return result;
        }

        function createHierarchyLevel(metadataColumns: DataViewMetadataColumn[]): DataViewHierarchyLevel {
            debug.assertValue(metadataColumns, 'metadataColumns');

            var levels: DataViewHierarchyLevel = { sources: [] };
            for (var i = 0, ilen = metadataColumns.length; i < ilen; i++)
                levels.sources.push(metadataColumns[i]);

            return levels;
        }

        function getOrCreateColumnMetadata(context: DsrReaderContext, metadataColumns: DataViewMetadataColumn[], index: number): DataViewMetadataColumn {
            debug.assertValue(metadataColumns, 'metadataColumns');

            // Categorical parsing of the DSR adds measure metadata columns
            // which are linked to the group they belong to (they have groupName property).
            // For matrix we need separate metadata columns, 1 per measure.
            // Hence if we can't find a column, we create one ourselves.
            for (var i = 0, ilen = metadataColumns.length; i < ilen; i++) {
                var metadataColumn = metadataColumns[i];
                if (metadataColumn && metadataColumn.index === index && metadataColumn.groupName === undefined)
                    return metadataColumn;
            }

            var newMetadataColumn = context.columnMetadata(index);
            metadataColumns.push(newMetadataColumn);

            return newMetadataColumn;
        }

        function processMetadata(
            context: DsrReaderContext,
            primaryLevelSources: DataViewHierarchyLevel[],
            secondaryLevelSources: DataViewHierarchyLevel[],
            measures: DataViewMetadataColumn[],
            metadataColumns: DataViewMetadataColumn[]): boolean {
            debug.assertValue(metadataColumns, 'metadataColumns');

            var selects = context.selects;
            for (var i = 0, len = selects.length; i < len; i++) {
                var select = selects[i];
                if (!select)
                    continue;

                if (select.Kind === SelectKind.Measure) {
                    var measureMetadata = getOrCreateColumnMetadata(context, metadataColumns, i);
                    measures.push(measureMetadata);
                }
                else if (select.Depth != null) {
                    if (primaryLevelSources[select.Depth] != null)
                        return false;

                    primaryLevelSources[select.Depth] = createHierarchyLevel([getOrCreateColumnMetadata(context, metadataColumns, i)]);
                }
                else if (select.SecondaryDepth != null) {
                    if (secondaryLevelSources[select.SecondaryDepth] != null)
                        return false;

                    secondaryLevelSources[select.SecondaryDepth] = createHierarchyLevel([getOrCreateColumnMetadata(context, metadataColumns, i)]);
                }
            }

            if (measures.length > 1 || (measures.length > 0 && (primaryLevelSources.length === 0 || secondaryLevelSources.length === 0)))
                secondaryLevelSources.push(createHierarchyLevel(measures));

            return true;
        }

        function parsePrimaryTree(
            context: DsrReaderContext,
            levelSources: DataViewHierarchyLevel[],
            dataShapeExprs: DataShapeExpressions,
            dataShape: DataShape,
            intersectionToSecondaryAggIdx: number[]): DataViewMatrixNode {
            if (!dataShape.PrimaryHierarchy || dataShape.PrimaryHierarchy.length === 0)
                return;

            var primaryAxisGroupings: DataShapeExpressionsAxisGrouping[];
            if (dataShapeExprs && dataShapeExprs.Primary)
                primaryAxisGroupings = dataShapeExprs.Primary.Groupings;

            var maxPrimaryAggIdx = 0;
            var maxSecondaryAggIdx = 0;
            if (dataShapeExprs) {
                maxPrimaryAggIdx = getMaxAggIdx(dataShapeExprs.Primary);
                maxSecondaryAggIdx = getMaxAggIdx(dataShapeExprs.Secondary);
            }

            var measureSelects = context.selects.filter((s: SelectBinding) => s && s.Kind === SelectKind.Measure);
            return parseTree(
                context,
                levelSources,
                dataShape.PrimaryHierarchy,
                primaryAxisGroupings,
                (memberType: MemberType, instance: GroupInstance, node: DataViewMatrixNode, depth) =>
                    parseIntersections(memberType, measureSelects, instance, node, intersectionToSecondaryAggIdx, maxPrimaryAggIdx, maxSecondaryAggIdx));
        }

        function parseSecondaryTree(
            context: DsrReaderContext,
            levelSources: DataViewHierarchyLevel[],
            measureCount: number,
            dataShapeExprs: DataShapeExpressions,
            dataShape: DataShape,
            intersectionToSecondaryAggIdx: number[]): DataViewMatrixNode {

            if (!dataShape.SecondaryHierarchy || dataShape.SecondaryHierarchy.length === 0) {
                // No secondary hierarchy, populate the tree with measure headers
                var root: DataViewMatrixNode = {};
                addMeasureHeaders(root, measureCount, 0, false);

                return root;
            }

            var secondaryAxisGroupings: DataShapeExpressionsAxisGrouping[];
            if (dataShapeExprs && dataShapeExprs.Secondary)
                secondaryAxisGroupings = dataShapeExprs.Secondary.Groupings;

            return parseTree(
                context,
                levelSources,
                dataShape.SecondaryHierarchy,
                secondaryAxisGroupings,
                (memberType: MemberType, instance: GroupInstance, node: DataViewMatrixNode, depth) => {
                    if (depth < levelSources.length) {
                        if (node.isSubtotal) {
                            // Let's check the innermost level if there are multiple measures.
                            // In case of multiple measures, the subtotal member will also need multiple children (the count must match the number of measures).
                            var innermostLevelIndex = levelSources.length - 1;
                            var measureCount = levelSources[innermostLevelIndex].sources.length;
                            if (measureCount > 1)
                                addMeasureHeaders(node, measureCount, innermostLevelIndex, true);
                        }
                        else {
                            // There is still one level to populate and that's for measure headers
                            debug.assert(depth === levelSources.length - 1, 'We only support one extra level in the column hierarchy (for measures)');

                            var level = levelSources[depth];

                            addMeasureHeaders(node, level.sources.length, depth, false);
                        }
                    }

                    intersectionToSecondaryAggIdx.push(getAggIdxForNode(node));
                });
        }

        function getAggIdxForNode(node: DataViewMatrixNode): number {
            debug.assertValue(node, 'node');

            // We add one to the leaf dynamic level because the outermost subtotal represents level 0.
            // See the comment on SelectBinding.Subtotal.
            return node.isSubtotal ? node.level : node.level + 1;
        }

        function getMaxAggIdx(axis: DataShapeExpressionsAxis): number {
            debug.assertAnyValue(axis, 'axis');

            // Use length, rather than the last valid index because the outermost subtotal represents level 0
            // and the innermost group is index + 1.
            // See the comment on SelectBinding.Subtotal.
            if (axis && axis.Groupings)
                return axis.Groupings.length;

            return 0;
        }

        function computeAggIdx(
            primaryAggIdx: number,
            secondaryAggIdx: number,
            maxPrimaryAggIdx: number,
            maxSecondaryAggIdx: number): number {
            // See the comment on SelectBinding.Subtotal.
            return primaryAggIdx + ((maxSecondaryAggIdx - secondaryAggIdx) * (maxPrimaryAggIdx + 1));
        }

        function addMeasureHeaders(root: DataViewMatrixNode, count: number, depth: number, isSubtotal: boolean): void {
            root.children = [];
            for (var i = 0; i < count; i++) {
                var child: DataViewMatrixNode = { level: depth };

                // Size optimization: only set if it's not zero
                if (i > 0)
                    child.levelSourceIndex = i;

                root.children.push(child);

                if (isSubtotal)
                    child.isSubtotal = true;
            }
        }

        function parseTree(
            context: DsrReaderContext,
            levelSources: DataViewHierarchyLevel[],
            rootMembers: DataMember[],
            axisGroupings: DataShapeExpressionsAxisGrouping[],
            leafMemberCallback?: (memberType: MemberType, instance: GroupInstance, leafNode: DataViewMatrixNode, depth: number) => void): DataViewMatrixNode {
            debug.assertValue(context, 'context');

            var root: DataViewMatrixNode = {};

            parseRecursive(
                context,
                levelSources,
                root,
                rootMembers,
                axisGroupings,
                0,
                leafMemberCallback);

            return root;
        }

        function parseRecursive(
            context: DsrReaderContext,
            levelSources: DataViewHierarchyLevel[],
            node: DataViewMatrixNode,
            members: DataMember[],
            axisGroupings: DataShapeExpressionsAxisGrouping[],
            depth: number,
            leafMemberCallback: (memberType: MemberType, instance: GroupInstance, leafNode: DataViewMatrixNode, depth: number) => void): void {

            debug.assertValue(context, 'context');
            debug.assertValue(levelSources, 'levelSources');
            debug.assertValue(node, 'node');
            debug.assertValue(depth, 'depth');

            if (!members)
                return;

            var selects = context.selects;

            // Iterate through members (definitions)
            for (var i = 0, ilen = members.length; i < ilen; i++) {
                var member = members[i];
                var memberType: MemberType = MemberType.Undetermined;

                // Iterate through member instances
                for (var j = 0, jlen = member.Instances.length; j < jlen; j++) {
                    var instance = member.Instances[j];

                    // Check for member type, if it's not determined yet - for certain types we need to look into the member instance.
                    // The member type must be the same for all member instances, so we only check it for the first instance
                    if (memberType === MemberType.Undetermined) {
                        var memberType = getMemberType(selects, axisGroupings, depth, member, instance);
                        if (memberType === MemberType.Unsupported)
                            break;
                    }

                    var nestedNode: Segmentation.DataViewMatrixSegmentNode = {
                        level: depth
                    };

                    // Add child
                    if (!node.children)
                        node.children = [];
                    node.children.push(nestedNode);

                    // Read group value for the node
                    if (memberType === MemberType.GroupDynamic) {
                        var value = getGroupValue(selects, instance.Calculations);
                        if (value != null)
                            nestedNode.value = value;
                    }
                    else if (memberType === MemberType.SubtotalStatic) {
                        nestedNode.isSubtotal = true;
                    }

                    if (instance.RestartFlag && instance.RestartFlag === RestartFlagKind.Merge)
                        nestedNode.isMerge = true;

                    // Read the identity of the node
                    if (axisGroupings && memberType === MemberType.GroupDynamic) {
                        node.childIdentityFields = context.readKeys(axisGroupings, depth);
                        nestedNode.identity = context.readIdentity(axisGroupings, instance, depth);
                    }

                    // Recursively read nested content
                    var nestedMembers = instance.Members;
                    if (nestedMembers && nestedMembers.length > 0) {
                        parseRecursive(
                            context,
                            levelSources,
                            nestedNode,
                            nestedMembers,
                            axisGroupings,
                            depth + 1,
                            leafMemberCallback);
                    }
                    else {
                        // Leaf member reached, call into the callback function
                        if (leafMemberCallback)
                            leafMemberCallback(memberType, instance, nestedNode, depth + 1);
                    }
                }
            }
        }

        function getGroupValue(selects: SelectBinding[], calculations: Calculation[]): any {
            debug.assertValue(selects, 'selects');
            debug.assertValue(calculations, 'calculations');

            for (var i = 0, ilen = selects.length; i < ilen; i++) {
                var select = selects[i];
                if (select && select.Value && select.Kind === SelectKind.Group) {
                    var value = DataShapeUtility.findAndParseCalculation(calculations, select.Value);

                    if (value != null)
                        return value;
                }
            }
        }

        function getMemberType(selects: SelectBinding[], axisGroupings: DataShapeExpressionsAxisGrouping[], groupDepth: number, member: DataMember, instance: GroupInstance): MemberType {
            debug.assertValue(selects, 'selects');
            debug.assertValue(member, 'member');

            // In order to determine if it's a dynamic or total member, we only need the member definition and the groupings
            if (axisGroupings && axisGroupings.length > groupDepth && member.Id != null) {
                var grouping = axisGroupings[groupDepth];
                if (member.Id === grouping.Member)
                    return MemberType.GroupDynamic;

                if (member.Id === grouping.SubtotalMember)
                    return MemberType.SubtotalStatic;
            }

            // If the member definition does not give us enough information, check the instance
            var calculations = instance.Calculations;
            if (calculations) {
                var measureFound = false;
                for (var i = 0, ilen = selects.length; i < ilen; i++) {
                    var select = selects[i];
                    if (!select)
                        continue;

                    if (DataShapeUtility.findCalculation(calculations, select.Value)) {
                        if (select.Kind === SelectKind.Group)
                            return MemberType.GroupDynamic;

                        if (!measureFound && select.Kind === SelectKind.Measure)
                            measureFound = true;
                    }
                }

                if (measureFound)
                    return MemberType.MeasureStatic;
            }

            return MemberType.Unsupported;
        }

        function readAndAddMeasureValues(
            rowMemberType: MemberType,
            measureSelects: SelectBinding[],
            calculations: Calculation[],
            node: DataViewMatrixNode,
            valueIndex: { index: number },
            secondaryAggIdx: number,
            maxPrimaryAggIdx: number,
            maxSecondaryAggIdx: number): void {
            debug.assertValue(measureSelects, 'selects');
            debug.assertValue(node, 'node');

            if (!calculations)
                return;

            var measureIndex = 0;
            for (var i = 0, ilen = measureSelects.length; i < ilen; i++) {
                var select = measureSelects[i];
                debug.assert(select.Kind === SelectKind.Measure, 'measureSelects is expected to have measure select bindings only');

                var measureValue = ensureTreeNodeValues<DataViewMatrixNodeValue>(node, valueIndex.index);
                var result: any = null;

                // Intersections are rows with calculations. If the row is a subtotal row, it can only contain subtotals,
                // however, dynamic rows can also have column subtotals.
                // If it's not a subtotal row, check for measure value.
                if (rowMemberType !== MemberType.SubtotalStatic)
                    result = DataShapeUtility.findAndParseCalculation(calculations, select.Value);

                // If there are no measure calculations or if it's a subtotal row, try to get subtotal value
                if (result == null) {
                    var primaryAggIdx = getAggIdxForNode(node);
                    var subtotal = findSubtotalValue(calculations, select, primaryAggIdx, secondaryAggIdx, maxPrimaryAggIdx, maxSecondaryAggIdx);

                    // undefined means, the value cannot be found. Null is a valid value.
                    if (subtotal !== undefined)
                        result = subtotal;
                }

                measureValue.value = result;

                // Size optimization: only set source index if it's not zero
                if (measureIndex > 0)
                    measureValue.valueSourceIndex = measureIndex;

                valueIndex.index++;
                measureIndex++;
            }
        }

        function parseIntersections(
            rowMemberType: MemberType,
            measureSelects: SelectBinding[],
            instance: GroupInstance,
            node: DataViewMatrixNode,
            intersectionToSecondaryAggIdx: number[],
            maxPrimaryAggIdx: number,
            maxSecondaryAggIdx: number): void {
            debug.assertValue(instance, 'instance');
            debug.assertValue(node, 'node');
            debug.assertValue(intersectionToSecondaryAggIdx, 'intersectionToSecondaryAggIdx');

            var intersections = instance.Intersections;

            // NOTE: this variable is used as a passed by ref index
            var valueIndex = { index: 0 };

            if (intersections) {
                for (var i = 0, ilen = intersections.length; i < ilen; i++) {
                    if (intersections[i].Calculations) {
                        var secondaryAggIdx = intersectionToSecondaryAggIdx[i];
                        readAndAddMeasureValues(rowMemberType, measureSelects, intersections[i].Calculations, node, valueIndex, secondaryAggIdx, maxPrimaryAggIdx, maxSecondaryAggIdx);
                    }
                }
            }
            else {
                readAndAddMeasureValues(rowMemberType, measureSelects, instance.Calculations, node, valueIndex, /* secondaryAggIdx */ 0, maxPrimaryAggIdx, maxSecondaryAggIdx);
            }
        }

        /** Finds subtotal value among the calculations. If there is none, this method returns undefined. 
            Note, that value can be null as well as a sum of null measure values. */
        function findSubtotalValue(
            calculations: Calculation[],
            select: SelectBinding,
            primaryAggIdx: number,
            secondaryAggIdx: number,
            maxPrimaryAggIdx: number,
            maxSecondaryAggIdx: number): any {
            var subtotals = select.Subtotal;
            if (subtotals) {
                var AggIdx = computeAggIdx(primaryAggIdx, secondaryAggIdx, maxPrimaryAggIdx, maxSecondaryAggIdx);
                if (AggIdx < subtotals.length) {
                    return DataShapeUtility.findAndParseCalculation(calculations, subtotals[AggIdx]);
                }
            }

            return undefined;
        }
    }

    /** Reads the DSR into a tree DataView, and derives the other data views from the tree, on a best effort basis. */
    class DsrToTreeStrategy implements IDsrReaderStrategy {
        private _context: DsrReaderContext;

        constructor(context: DsrReaderContext) {
            debug.assertValue(context, 'context');

            this._context = context;
        }

        public read(dataShapeExprs: DataShapeExpressions, dataShape: DataShape): DataView {
            debug.assertValue(dataShape, 'dataShape');

            var metadata: DataViewMetadata = this.readMetadata(dataShape.IsComplete);
            var dataView: DataView = {
                metadata: metadata
            };

            var root = this.parseTree(dataShapeExprs, dataShape);

            debug.assertValue(root, 'root');
            dataView.tree = { root: root };

            var categorical = this.categorize(metadata, root);
            if (categorical)
                dataView.categorical = categorical;

            var single = this.createSingleValue(metadata, root);
            if (single)
                dataView.single = single;

            var table = this.createTable(metadata, root);
            if (table)
                dataView.table = table;

            var matrix = DsrToMatrixParser.parse(this._context, dataShapeExprs, dataShape, dataView.metadata);
            if (matrix)
                dataView.matrix = matrix;

            return dataView;
        }

        private readMetadata(isComplete: boolean): DataViewMetadata {
            var metadata: DataViewMetadata = {
                columns: [],
            };

            var context = this._context,
                selects = context.selects;
            for (var i = 0, len = selects.length; i < len; i++) {
                var select = selects[i];
                if (!select)
                    continue;

                var columnMetadata = context.columnMetadata(i);
                metadata.columns.push(columnMetadata);
            }

            if (!isComplete)
                metadata.segment = {};

            return metadata;
        }

        private parseTree(dataShapeExprs: DataShapeExpressions, dataShape: DataShape): DataViewTreeNode {
            var root: DataViewTreeNode = {};

            var aggregateCalcs: Calculation[] = dataShape.Calculations || DsrToTreeStrategy.getFirstInstanceCalcs(dataShape.PrimaryHierarchy[0]),
                dynamicMember: DataMember;

            dynamicMember = DataShapeUtility.getTopLevelPrimaryDynamicMember(dataShape, dataShapeExprs, true /*useTopLevelCalculations*/);

            var primaryAxisGroupings: DataShapeExpressionsAxisGrouping[];
            if (dataShapeExprs && dataShapeExprs.Primary)
                primaryAxisGroupings = dataShapeExprs.Primary.Groupings;

            this.parseRecursive(
                root,
                aggregateCalcs,
                dynamicMember,
                primaryAxisGroupings,
                0);

            return root;
        }

        private parseRecursive(
            node: DataViewTreeNode,
            aggregateCalcs: Calculation[],
            dynamicMember: DataMember,
            primaryAxisGroupings: DataShapeExpressionsAxisGrouping[],
            depth: number): void {

            debug.assertValue(node, 'node');
            debug.assertValue(depth, 'depth');

            var context = this._context;

            // Read the Aggregate values, if available, from the static DataMember.
            if (aggregateCalcs)
                this.parseValues(context.selects, node, aggregateCalcs, depth);

            if (dynamicMember) {
                // Read the Detail values
                var dynamicMemberInstances = dynamicMember.Instances,
                    dynamicMemberInstancesLength = dynamicMemberInstances.length,
                    aggregator: TreeNodeValueAggregateComputer;

                if (dynamicMemberInstancesLength) {
                    node.children = [];

                    // NOTE: We currently only need to compute the client-side min/max for categorical charts, so we need only compute it at the root node.
                    // We can expand this as needed in the future.
                    if (depth === 0)
                        aggregator = TreeNodeValueAggregateComputer.create(node, context.selects);
                }

                if (primaryAxisGroupings) {
                    node.childIdentityFields = context.readKeys(primaryAxisGroupings, depth);
                }

                for (var i = 0; i < dynamicMemberInstancesLength; i++) {
                    var instance = dynamicMemberInstances[i];

                    var nestedNode: Segmentation.DataViewTreeSegmentNode = {};
                    node.children.push(nestedNode);

                    if (instance.RestartFlag && instance.RestartFlag === RestartFlagKind.Merge)
                        nestedNode.isMerge = true;

                    this.parseValues(context.selects, nestedNode, instance.Calculations, depth, aggregator);

                    if (primaryAxisGroupings) {
                        nestedNode.identity = context.readIdentity(primaryAxisGroupings, instance, depth);
                    }

                    // Recursively read nested content
                    var nestedMembers = instance.Members;
                    if (nestedMembers && nestedMembers.length) {
                        var dynamicChild = DataShapeUtility.getDynamicMember(nestedMembers, primaryAxisGroupings, depth + 1);
                        this.parseRecursive(
                            nestedNode,
                            DsrToTreeStrategy.getFirstInstanceCalcs(nestedMembers[0]),
                            dynamicChild,
                            primaryAxisGroupings,
                            depth + 1);
                    }
                }

                if (aggregator)
                    aggregator.complete();
            }
        }

        private static getFirstInstanceCalcs(member: DataMember): Calculation[] {
            if (member.Instances.length > 0)
                return member.Instances[0].Calculations;
            return null;
        }

        private parseValues(
            selects: SelectBinding[],
            node: DataViewTreeNode,
            calculations: Calculation[],
            depth: number,
            aggregator?: TreeNodeValueAggregateComputer): void {
            debug.assertValue(node, 'node');
            debug.assertValue(calculations, 'calculations');

            for (var i = 0, len = selects.length; i < len; i++) {
                var select = selects[i];

                if (!select)
                    continue;

                if (select.Subtotal) {
                    var id = select.Subtotal[depth];
                    if (id) {
                        var value = DataShapeUtility.findAndParseCalculation(calculations, id);
                        if (value !== undefined)
                            ensureTreeNodeValues<DataViewTreeNodeMeasureValue>(node, i).subtotal = value;
                    }
                }

                if (select.Max) {
                    var id = select.Max[depth];
                    if (id) {
                        var value = DataShapeUtility.findAndParseCalculation(calculations, id);
                        if (value !== undefined)
                            ensureTreeNodeValues<DataViewTreeNodeMeasureValue>(node, i).max = value;
                    }
                }

                if (select.Min) {
                    var id = select.Min[depth];
                    if (id) {
                        var value = DataShapeUtility.findAndParseCalculation(calculations, id);
                        if (value !== undefined)
                            ensureTreeNodeValues<DataViewTreeNodeMeasureValue>(node, i).min = value;
                    }
                }

                if (select.Count) {
                    var id = select.Count[depth];
                    if (id) {
                        var value = DataShapeUtility.findAndParseCalculation(calculations, id);
                        if (value !== undefined)
                            ensureTreeNodeValues<DataViewTreeNodeGroupValue>(node, i).count = value;
                    }
                }
                if (select.Value) {
                    var value = DataShapeUtility.findAndParseCalculation(calculations, select.Value);
                    if (value !== undefined) {
                        if (select.Kind === SelectKind.Group) {
                            node.name = value;
                        }
                        else {
                            node.value = value;
                            if (aggregator)
                                aggregator.add(i, value);
                        }

                        ensureTreeNodeValues<DataViewTreeNodeGroupValue>(node, i).value = value;
                    }
                }
                if (select.Highlight) {
                    var highlight = DataShapeUtility.findAndParseCalculation(calculations, select.Highlight.Value);
                    if (highlight !== undefined) {
                        ensureTreeNodeValues<DataViewTreeNodeMeasureValue>(node, i).highlight = highlight;
                    }
                }
            }
        }

        private categorize(metadata: DataViewMetadata, root: DataViewTreeNode): DataViewCategorical {
            debug.assertValue(metadata, 'metadata');

            if (DataViewAnalysis.countGroups(metadata.columns) > 1)
                return null;

            var view: DataViewCategorical = {},
                categoryColumn: DataViewMetadataColumn,
                categoryIdx: number;

            for (var j = 0, jlen = metadata.columns.length; j < jlen; j++) {
                var metadataColumn = metadata.columns[j];

                if (!metadataColumn.isMeasure) {
                    categoryColumn = metadataColumn;
                    categoryIdx = metadataColumn.index;
                    continue;
                }

                var column: DataViewValueColumn = {
                    source: metadataColumn,
                    values: []
                };

                this.populateMeasureData(root, column, metadataColumn.index);

                if (!view.values)
                    view.values = DataViewTransform.createValueColumns();
                view.values.push(column);
            }

            if (categoryColumn) {
                var nodes = root.children;
                var category: DataViewCategoryColumn = { source: categoryColumn, values: [] };
                var categoryIdentity: DataViewScopeIdentity[];

                if (nodes) {
                    for (var i = 0, ilen = nodes.length; i < ilen; i++) {
                        var node = <Segmentation.DataViewTreeSegmentNode>nodes[i];

                        category.values.push(node.values[categoryIdx].value);
                        this.writeCategoricalValues(metadata, node, view.values);

                        if (node.identity) {
                            if (!categoryIdentity)
                                categoryIdentity = [];

                            categoryIdentity.push(node.identity);
                        }

                        if (node.isMerge) {
                            var viewSegment: Segmentation.DataViewCategoricalSegment = <Segmentation.DataViewCategoricalSegment>view;
                            viewSegment.lastMergeIndex = i;
                        }
                    }
                }

                if (categoryIdentity)
                    category.identity = categoryIdentity;
                if (root.childIdentityFields)
                    category.identityFields = root.childIdentityFields;
                view.categories = [category];
            }
            else {
                this.writeCategoricalValues(metadata, root, view.values);
            }

            return view;
        }

        private createTable(metadata: DataViewMetadata, root: DataViewTreeNode): DataViewTable {
            debug.assertValue(metadata, 'metadata');

            var maxDepth: number;
            var selects = this._context.selects;
            for (var i = 0, len = selects.length; i < len; i++) {
                var select = selects[i];
                if (!select)
                    continue;

                var depth = selects[i].Depth;
                if (depth >= 0)
                    maxDepth = Math.max(depth, maxDepth || 0);
            }
            if (maxDepth > 0) {
                // This would be lossy -- it ignores groups below the top level.
                return null;
            }

            var lastMergeIndex;

            var rows: any[] = [],
                selectsLength = selects.length,
                identity: DataViewScopeIdentity[];

            if (maxDepth >= 0) {
                var nodes = root.children;

                if (nodes) {
                    for (var i = 0, ilen = nodes.length; i < ilen; i++) {
                        var node = <Segmentation.DataViewTreeSegmentNode>nodes[i];
                        this.toTableRow(node, selectsLength, rows);

                        if (node.isMerge)
                            lastMergeIndex = i;

                        if (node.identity) {
                            if (!identity)
                                identity = [];

                            identity.push(node.identity);
                        }
                    }
                }
            }
            else {
                debug.assert(DataViewAnalysis.countGroups(metadata.columns) === 0, 'groups.length=0');
                this.toTableRow(root, selectsLength, rows);
            }

            var totals = this.toTotals(root, selectsLength);

            var table: DataViewTable = { rows: rows, columns: metadata.columns };
            if (identity)
                table.identity = identity;

            if (totals)
                table.totals = totals;

            if (lastMergeIndex >= 0) {
                var tableSegment: Segmentation.DataViewTableSegment = <Segmentation.DataViewTableSegment>table;
                tableSegment.lastMergeIndex = lastMergeIndex;
            }

            return table;
        }

        private toTableRow(node: DataViewTreeNode, selectsLength: number, rows: any[]): void {
            var row: any[] = [];
            for (var j = 0; j < selectsLength; j++) {
                var nodeValue = node.values[j];

                if (!nodeValue)
                    continue;

                row.push(nodeValue.value);
            }
            rows.push(row);
        }

        private toTotals(root: DataViewTreeNode, selectsLength: number): any[] {
            var totals = [];
            var values = root.values;

            // Since we insert empty values into the array if a total is not found, we need to keep track of whether
            // we had at least one valid total in the DataView so that for the case where there are no valid totals
            // we can leave the totals property undefined instead of a big array of empty values.
            var hasAtLeastOneTotal: boolean = false;

            if (values) {
                var selects = this._context.selects;
                for (var j = 0; j < selectsLength; j++) {
                    // Null selects will not output anything into the row data, so we need to skip those here to ensure
                    // the totals and row data arrays stay in sync
                    if (!selects[j])
                        continue;

                    var measureData = <DataViewTreeNodeMeasureValue>values[j];

                    var subtotal = (measureData) ? measureData.subtotal : null;
                    hasAtLeastOneTotal = hasAtLeastOneTotal || (subtotal != null);
                    totals.push(subtotal);
                }
            }

            return hasAtLeastOneTotal ? totals : null;
        }

        private writeCategoricalValues(metadata: DataViewMetadata, node: DataViewTreeNode, values: DataViewValueColumn[]): void {
            var columns = metadata.columns;
            var idx = 0;
            for (var j = 0, jlen = columns.length; j < jlen; j++) {
                var column = columns[j];
                if (!column.isMeasure)
                    continue;

                var nodeValues = <DataViewTreeNodeMeasureValue>node.values[column.index];
                var measureValues = values[idx++];

                measureValues.values.push(nodeValues.value);

                if (nodeValues.highlight !== undefined) {
                    if (!measureValues.highlights)
                        measureValues.highlights = [];

                    measureValues.highlights.push(nodeValues.highlight);
                }
            }
        }

        private populateMeasureData(node: DataViewTreeNode, column: DataViewValueColumn, index: number): void {
            debug.assertValue(node, 'node');

            if (!node.values)
                return;

            var measureData = <DataViewTreeNodeMeasureValue>node.values[index];
            if (measureData) {
                if (measureData.min !== undefined)
                    column.min = measureData.min;
                if (measureData.max !== undefined)
                    column.max = measureData.max;
                if (measureData.subtotal !== undefined)
                    column.subtotal = measureData.subtotal;
                if (measureData.maxLocal !== undefined)
                    column.maxLocal = measureData.maxLocal;
                if (measureData.minLocal !== undefined)
                    column.minLocal = measureData.minLocal;
            }
        }

        private createSingleValue(metadata: DataViewMetadata, root: DataViewTreeNode): DataViewSingle {
            debug.assertValue(metadata, 'metadata');
            debug.assertValue(root, 'root');

            if (root.values) {

                var columns = metadata.columns,
                    measureColumn: DataViewMetadataColumn = null;

                for (var j = 0, jlen = columns.length; j < jlen; j++) {
                    if (!columns[j].isMeasure)
                        continue;

                    if (measureColumn)
                        return null;

                    measureColumn = columns[j];
                }

                if (!measureColumn)
                    return null;

                var measureValues = (<DataViewTreeNodeMeasureValue>root.values[measureColumn.index]);
                if (!measureValues)
                    return null;

                var value = DataViewAnalysis.countGroups(metadata.columns) === 0
                    ? measureValues.value
                    : measureValues.subtotal;

                if (value === undefined)
                    return null;

                return {
                    value: value
                };
            }
            return null;
        }
    }

    class DsrWithPivotedColumnsStrategy implements IDsrReaderStrategy {
        private _context: DsrReaderContext;
        private _categorySelects: SelectBinding[];
        private _measureSelects: SelectBinding[];
        private _primaryMeasureSelects: SelectBinding[];
        private _secondarySelects: SelectBinding[];
        private _secondaryDepth: number;
        private _categoryColumn: DataViewMetadataColumn;
        private _seriesColumn: DataViewMetadataColumn;

        constructor(context: DsrReaderContext) {
            debug.assertValue(context, 'context');

            this._context = context;
            this._categorySelects = [];
            this._primaryMeasureSelects = [];
            this._measureSelects = [];
            this._secondarySelects = [];
            this._categoryColumn = null;
            this._seriesColumn = null;
        }

        public read(dataShapeExprs: DataShapeExpressions, dataShape: DataShape): DataView {
            debug.assertValue(dataShape, 'dataShape');

            var dataView: DataView = {
                metadata: this.readMetadata(dataShape.IsComplete)
            };

            var categorical = this.categorize(dataShape, dataView.metadata, dataShapeExprs);
            if (categorical)
                dataView.categorical = categorical;

            var matrix = DsrToMatrixParser.parse(this._context, dataShapeExprs, dataShape, dataView.metadata);
            if (matrix)
                dataView.matrix = matrix;

            return dataView;
        }

        private readMetadata(isComplete: boolean): DataViewMetadata {
            var metadata: DataViewMetadata = {
                columns: [],
            };

            var context = this._context,
                selects = context.selects;
            for (var i = 0, len = selects.length; i < len; i++) {
                var select = selects[i];
                if (!select)
                    continue;

                if (select.Kind === SelectKind.Measure) {
                    if (select.Depth === 0)
                        this._primaryMeasureSelects.push(select);
                    else
                        this._measureSelects.push(select);
                    continue;
                }

                debug.assert(select.Kind === SelectKind.Group, 'Unexpected Select.Kind');

                var columnMetadata = context.columnMetadata(i);
                metadata.columns.push(columnMetadata);

                if (select.SecondaryDepth >= 0) {
                    // Secondary hierarchy is pivoted onto columns and considered as measure values.
                    this._secondarySelects.push(select);
                    this._secondaryDepth = Math.max(this._secondaryDepth || 0, select.SecondaryDepth);
                    this._seriesColumn = columnMetadata;
                }
                else {
                    this._categoryColumn = columnMetadata;
                    this._categorySelects.push(select);
                }
            }

            if (!isComplete)
                metadata.segment = {};

            return metadata;
        }

        private categorize(dataShape: DataShape, metadata: DataViewMetadata, dataShapeExprs: DataShapeExpressions): DataViewCategorical {
            debug.assertValue(dataShape, 'dataShape');
            debug.assertValue(metadata, 'metadata');

            if (this._secondaryDepth !== 0 || this._categorySelects.length !== 1 || this._measureSelects.length < 1)
                return null;

            var primaryAxisGroupings: DataShapeExpressionsAxisGrouping[];
            var secondaryAxisGroupings: DataShapeExpressionsAxisGrouping[];
            if (dataShapeExprs) {
                if (dataShapeExprs.Primary)
                    primaryAxisGroupings = dataShapeExprs.Primary.Groupings;
                if (dataShapeExprs.Secondary)
                    secondaryAxisGroupings = dataShapeExprs.Secondary.Groupings;
            }

            var secondaryDynamicTopLevel = DataShapeUtility.getTopLevelSecondaryDynamicMember(dataShape, dataShapeExprs);
            var values = this.readColumnsFromSecondary(secondaryDynamicTopLevel, metadata, secondaryAxisGroupings, dataShape.Calculations);

            var primaryDynamicTopLevel = DataShapeUtility.getTopLevelPrimaryDynamicMember(dataShape, dataShapeExprs);
            var categoriesResult = this.readCategoriesAndValues(primaryDynamicTopLevel, metadata, values, primaryAxisGroupings);

            var result: powerbi.data.segmentation.DataViewCategoricalSegment = {
                categories: categoriesResult.categories,
                values: values,
            };

            if (categoriesResult.lastMergeIndex !== undefined)
                result.lastMergeIndex = categoriesResult.lastMergeIndex;

            return result;
        }

        private readColumnsFromSecondary(
            secondaryMember: DataMember,
            metadata: DataViewMetadata,
            secondaryAxisGroupings: DataShapeExpressionsAxisGrouping[],
            aggregateCalculations: Calculation[]): DataViewValueColumns {
            debug.assertValue(secondaryMember, 'secondaryMember');
            debug.assertValue(metadata, 'metadata');

            var valueIdentityFields: SQExpr[],
                context = this._context;
            if (secondaryAxisGroupings)
                valueIdentityFields = context.readKeys(secondaryAxisGroupings, /*depth*/ 0);

            var values: DataViewValueColumns = DataViewTransform.createValueColumns([], valueIdentityFields),
                allSelects = context.selects,
                measureSelectsLen = this._measureSelects.length;

            var instances = secondaryMember.Instances,
                instanceCount = instances.length;
            if (instanceCount) {
                for (var i = 0; i < instanceCount; i++) {
                    var instance = instances[i],
                        calcs = instance.Calculations,
                        identity: DataViewScopeIdentity;

                    if (secondaryAxisGroupings)
                        identity = context.readIdentity(secondaryAxisGroupings, instance, /*depth*/ 0);

                    for (var j = 0, jlen = this._secondarySelects.length; j < jlen; j++) {
                        var secondarySelect = this._secondarySelects[j],
                            label = DataShapeUtility.findAndParseCalculation(calcs, secondarySelect.Value);
                        for (var k = 0; k < measureSelectsLen; k++) {
                            // Create the metadata column
                            var measureSelect = this._measureSelects[k];
                            var columnMetadata = context.columnMetadata(allSelects.indexOf(measureSelect));

                            if (label !== undefined)
                                columnMetadata.groupName = label;

                            metadata.columns.push(columnMetadata);

                            // Create the value column
                            var column: DataViewValueColumn = {
                                source: columnMetadata,
                                values: []
                            };

                            if (identity)
                                column.identity = identity;

                            this.addColumnAggregates(aggregateCalculations, measureSelect, column);
                            values.push(column);
                        }
                    }
                }
            }
            else {
                // No primary group instances were returned, so add some placeholders.
                for (var k = 0; k < measureSelectsLen; k++) {
                    // Create the metadata column
                    var measureSelect = this._measureSelects[k];
                    var columnMetadata = context.columnMetadata(allSelects.indexOf(measureSelect));

                    metadata.columns.push(columnMetadata);

                    // Create the value column
                    var column: DataViewValueColumn = {
                        source: columnMetadata,
                        values: []
                    };

                    this.addColumnAggregates(aggregateCalculations, measureSelect, column);
                    values.push(column);
                }
            }

            for (var k = 0, klen = this._primaryMeasureSelects.length; k < klen; k++) {
                // Create the metadata column
                var primaryMeasureSelect = this._primaryMeasureSelects[k];
                var columnMetadata = context.columnMetadata(allSelects.indexOf(primaryMeasureSelect));
                metadata.columns.push(columnMetadata);

                // Create the value column
                var column: DataViewValueColumn = {
                    source: columnMetadata,
                    values: []
                };

                values.push(column);
            }

            if (this._seriesColumn) {
                values.source = this._seriesColumn;
            }

            return values;
        }

        private addColumnAggregates(calcs: Calculation[], measureSelect: SelectBinding, column: DataViewValueColumn) {
            if (calcs) {
                if (measureSelect.Max) {
                    column.max = DataShapeUtility.findAndParseCalculation(calcs, measureSelect.Max[0]);
                }

                if (measureSelect.Min) {
                    column.min = DataShapeUtility.findAndParseCalculation(calcs, measureSelect.Min[0]);
                }
            }
        }

        private readCategoriesAndValues(
            primaryMember: DataMember,
            metadata: DataViewMetadata,
            values: DataViewValueColumn[],
            primaryAxisGroupings: DataShapeExpressionsAxisGrouping[]): { categories: DataViewCategoricalColumn[]; lastMergeIndex: number } {
            debug.assertValue(primaryMember, 'primaryMember');
            debug.assertValue(values, 'values');

            var categorySelectIdx = 0,
                context = this._context,
                select = this._categorySelects[categorySelectIdx],
                category: DataViewCategoryColumn = {
                    source: this._categoryColumn,
                    values: [],
                },
                instances = primaryMember.Instances,
                identities: DataViewScopeIdentity[];

            if (primaryAxisGroupings) {
                identities = category.identity = [];
                category.identityFields = context.readKeys(primaryAxisGroupings, /*depth*/ 0);
            }

            var primaryMeasureSelects = this._primaryMeasureSelects;
            var lastMergeIndex: number;

            for (var i = 0, len = instances.length; i < len; i++) {
                var instance = instances[i];

                if (instance.RestartFlag === RestartFlagKind.Merge)
                    lastMergeIndex = i;

                category.values.push(DataShapeUtility.findAndParseCalculation(instance.Calculations, select.Value));

                if (identities)
                    identities.push(context.readIdentity(primaryAxisGroupings, instance, /*depth*/ 0));

                var intersections = instance.Intersections,
                    valueIdx = 0;
                for (var j = 0, jlen = intersections.length; j < jlen; j++) {
                    var calculations = intersections[j].Calculations;
                    for (var k = 0, klen = this._measureSelects.length; k < klen; k++) {
                        var measureSelect = this._measureSelects[k];
                        var value = DataShapeUtility.findAndParseCalculation(calculations, measureSelect.Value);

                        // If the value does not belong to the measure, it's from a subtotal column (already skipped), skip it.
                        // NOTE: null is a valid value
                        if (value === undefined)
                            continue;

                        var valueCol = values[valueIdx++];
                        valueCol.values.push(value);

                        if (measureSelect.Highlight) {
                            if (!valueCol.highlights)
                                valueCol.highlights = [];

                            var value = DataShapeUtility.findAndParseCalculation(calculations, measureSelect.Highlight.Value);
                            valueCol.highlights.push(value);
                        }
                    }
                }

                for (var j = 0, jlen = primaryMeasureSelects.length; j < jlen; j++) {
                    var measureSelect = primaryMeasureSelects[j];
                    var value = DataShapeUtility.findAndParseCalculation(instance.Calculations, measureSelect.Value);
                    var valueCol = values[valueIdx++];
                    valueCol.values.push(value);

                    if (measureSelect.Highlight) {
                        if (!valueCol.highlights)
                            valueCol.highlights = [];

                        var value = DataShapeUtility.findAndParseCalculation(calculations, measureSelect.Highlight.Value);
                        valueCol.highlights.push(value);
                    }
                }
            }

            return { categories: [category], lastMergeIndex: lastMergeIndex };
        }
    }

    interface KeyExprCacheItem {
        axisGroupings: DataShapeExpressionsAxisGrouping[];
        exprs: SQExpr[][];
    }

    class DsrReaderContext {
        public selects: SelectBinding[];
        private schema: string;
        private cacheItems: KeyExprCacheItem[];

        constructor(selects: SelectBinding[], schemaName: string) {
            debug.assertValue(selects, 'selects');
            debug.assertAnyValue(schemaName, 'schemaName');

            this.selects = selects;
            this.schema = schemaName;
            this.cacheItems = [];
        }

        public columnMetadata(selectIndex: number): DataViewMetadataColumn {
            debug.assertValue(selectIndex, 'selectIndex');

            var select = this.selects[selectIndex];
            debug.assertValue(select, 'select');

            var column: DataViewMetadataColumn = {
                displayName: '',
                index: selectIndex,
            };
            if (select.Format)
                column.format = select.Format;

            column.type = DataShapeUtility.describeDataType(select.Type, select.DataCategory);

            if (select.Kind === SelectKind.Measure)
                column.isMeasure = true;

            return column;
        }

        public readIdentity(
            axisGroupings: DataShapeExpressionsAxisGrouping[],
            instance: GroupInstance,
            depth: number): DataViewScopeIdentity {
            debug.assertValue(axisGroupings, 'axisGroupings');
            debug.assertValue(depth, 'depth');

            var keyExprs = this.readKeys(axisGroupings, depth),
                expr: SQExpr;

            var groupingKeys = axisGroupings[depth].Keys;
            for (var i = 0, len = groupingKeys.length; i < len; i++) {
                var key = groupingKeys[i],
                    calcId = key.Calc || this.selects[key.Select].Value,
                    valueExpr = DataShapeUtility.findAndParseCalculationToSQExpr(instance.Calculations, calcId);

                var exprToAdd = SQExprBuilder.equal(keyExprs[i], valueExpr);
                expr = expr
                ? SQExprBuilder.and(expr, exprToAdd)
                : exprToAdd;
            }

            return createDataViewScopeIdentity(expr);
        }

        public readKeys(axisGroupings: DataShapeExpressionsAxisGrouping[], depth: number): SQExpr[] {
            debug.assertValue(axisGroupings, 'axisGroupings');
            debug.assertValue(depth, 'depth');

            var axisCache = this.getAxisCache(axisGroupings);
            var keys = axisCache.exprs[depth];
            if (keys === undefined) {
                keys = axisCache.exprs[depth] = [];

                var groupingKeys = axisGroupings[depth].Keys;
                for (var i = 0, len = groupingKeys.length; i < len; i++)
                    keys.push(this.convertKey(groupingKeys[i]));
            }

            return keys;
        }

        private getAxisCache(axisGroupings: DataShapeExpressionsAxisGrouping[]): KeyExprCacheItem {
            debug.assertValue(axisGroupings, 'axisGroupings');

            var cacheItems = this.cacheItems;
            for (var i = 0, len = cacheItems.length; i < len; i++) {
                var item = cacheItems[i];

                if (item.axisGroupings === axisGroupings)
                    return item;
            }

            item = {
                axisGroupings: axisGroupings,
                exprs: [],
            };
            cacheItems.push(item);

            return item;
        }

        private convertKey(key: DataShapeExpressionsAxisGroupingKey): SQExpr {
            debug.assertValue(key, 'key');

            var source = key.Source;
            return SQExprBuilder.fieldDef({
                schema: this.schema,
                // TODO: Currently allow fallback to EntitySet for legacy dashboard tiles but these aren't really interchangeable
                // May need real upgrade in the future to convert EntitySet to Entity and then we can remove this.
                entity: source.Entity || (<any>source).EntitySet,
                column: source.Property,
            });
        }
    }

    /** Responsible for computing aggregates for tree nodes. */
    class TreeNodeValueAggregateComputer {
        private node: DataViewTreeNode;
        private length: number;
        private aggregators: { [index: number]: ITreeNodeValueAggregator[] };

        public static create(node: DataViewTreeNode, selects: SelectBinding[]): TreeNodeValueAggregateComputer {
            var nodeValues = node.values,
                foundAggregate = false,
                aggregators: { [index: number]: ITreeNodeValueAggregator[] } = {};
            for (var i = 0, len = selects.length; i < len; i++) {
                var select = selects[i];
                if (!select || select.Kind !== SelectKind.Measure)
                    continue;

                var valueAggregators: ITreeNodeValueAggregator[],
                    nodeMeasureValue: DataViewTreeNodeMeasureValue;
                if (nodeValues && (nodeMeasureValue = nodeValues[i])) {
                    valueAggregators = [];
                    if (nodeMeasureValue.min === undefined)
                        valueAggregators.push(new MinTreeNodeValueAggregator());
                    if (nodeMeasureValue.max === undefined)
                        valueAggregators.push(new MaxTreeNodeValueAggregator());

                    if (valueAggregators.length === 0)
                        continue;
                }
                else {
                    valueAggregators = [
                        new MinTreeNodeValueAggregator(),
                        new MaxTreeNodeValueAggregator(),
                    ];
                }

                aggregators[i] = valueAggregators;
                foundAggregate = true;
            }

            if (foundAggregate)
                return new TreeNodeValueAggregateComputer(node, len, aggregators);
        }

        constructor(node: DataViewTreeNode, length: number, aggregators: { [index: number]: ITreeNodeValueAggregator[] }) {
            debug.assertValue(node, 'node');
            debug.assertValue(length, 'length');
            debug.assertValue(aggregators, 'aggregators');

            this.node = node;
            this.length = length;
            this.aggregators = aggregators;
        }

        public add(index: number, value: any): void {
            var aggregators = this.aggregators[index];
            if (!aggregators)
                return;

            for (var i = 0, len = aggregators.length; i < len; i++)
                aggregators[i].update(value);
        }

        public complete(): void {
            var allAggregators = this.aggregators,
                node = this.node;
            for (var selectIndex = 0, len = this.length; selectIndex < len; selectIndex++) {
                var aggregators = allAggregators[selectIndex];
                if (!aggregators)
                    continue;

                for (var aggregatorIndex = 0, aggregatorsLength = aggregators.length; aggregatorIndex < aggregatorsLength; aggregatorIndex++) {
                    var aggregator = aggregators[aggregatorIndex],
                        aggregatedValue = aggregator.value();

                    if (aggregatedValue !== undefined)
                        ensureTreeNodeValues(node, selectIndex)[aggregator.name] = aggregatedValue;
                }
            }
        }
    }

    interface ITreeNodeValueAggregator {
        name: string;
        update(value: any): void;
        value(): any;
    }

    class MaxTreeNodeValueAggregator implements ITreeNodeValueAggregator {
        private current: number;

        public get name(): string {
            return 'maxLocal';
        }

        public update(value: any): void {
            if (typeof (value) !== 'number' || isNaN(value))
                return;

            var current = this.current;
            this.current = (current === undefined)
            ? value
            : Math.max(current, value);
        }

        public value(): any {
            return this.current;
        }
    }

    class MinTreeNodeValueAggregator implements ITreeNodeValueAggregator {
        private current: number;

        public get name(): string {
            return 'minLocal';
        }

        public update(value: any): void {
            if (typeof (value) !== 'number' || isNaN(value))
                return;

            var current = this.current;
            this.current = (current === undefined)
            ? value
            : Math.min(current || 0, value);
        }

        public value(): any {
            return this.current;
        }
    }
}
