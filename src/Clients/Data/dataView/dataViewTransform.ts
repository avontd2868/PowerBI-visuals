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

module powerbi.data {
    import inherit = Prototype.inherit;
    import ArrayExtensions = jsCommon.ArrayExtensions;
    import INumberDictionary = jsCommon.INumberDictionary;

    export interface DataViewTransformApplyOptions {
        prototype: DataView;
        objectDescriptors: DataViewObjectDescriptors;
        dataViewMappings?: DataViewMapping[];
        transforms: DataViewTransformActions;
        colorAllocatorFactory: IColorAllocatorFactory;
    }

    /** Describes the Transform actions to be done to a prototype DataView. */
    export interface DataViewTransformActions {
        /** Describes transform metadata for each semantic query select item, as the arrays align, by index. */
        selects?: DataViewSelectTransform[];

        /** Describes the DataViewObject definitions. */
        objects?: DataViewObjectDefinitions;

        /** Describes the splitting of a single input DataView into multiple DataViews. */
        splits?: DataViewSplitTransform[];

        /** Describes the order of selects (referenced by query index) in each role. */
        projectionOrdering?: DataViewProjectionOrdering;
    }

    export interface DataViewSelectTransform {
        displayName?: string;
        queryName?: string;
        format?: string;
        type?: ValueType;
        roles?: { [roleName: string]: boolean };
    }

    export interface DataViewSplitTransform {
        selects: INumberDictionary<boolean>;
    }

    export interface DataViewProjectionOrdering {
        [roleName: string]: number[];
    }

    export interface MatrixTransformationContext {
        rowHierarchyRewritten: boolean;
        columnHierarchyRewritten: boolean;
        hierarchyTreesRewritten: boolean;
    }

    interface ValueRewrite<T> {
        from: T;
        to: T;
    }

    interface NumberToNumberMapping {
        [position: number]: number;
    }

    enum CategoricalDataViewTransformation {
        None,
        Pivot,
        SelfCrossJoin,
    }

    // TODO: refactor & focus DataViewTransform into a service with well-defined dependencies.
    export module DataViewTransform {
        export function apply(options: DataViewTransformApplyOptions): DataView[] {
            debug.assertValue(options, 'options');

            // TODO: Flow a context object through to capture errors/warnings about what happens here for better diagnosability.

            var prototype = options.prototype,
                objectDescriptors = options.objectDescriptors,
                dataViewMappings = options.dataViewMappings,
                transforms = options.transforms,
                colorAllocatorFactory = options.colorAllocatorFactory;

            if (!prototype)
                return transformEmptyDataView(objectDescriptors, transforms, colorAllocatorFactory);

            if (!transforms)
                return [prototype];

            var splits = transforms.splits;
            if (ArrayExtensions.isUndefinedOrEmpty(splits)) {
                return [transformDataView(prototype, objectDescriptors, dataViewMappings, transforms, colorAllocatorFactory)];
            }

            var transformedDataviews: DataView[] = [];
            for (var i = 0, len = splits.length; i < len; i++) {
                var transformed = transformDataView(prototype, objectDescriptors, dataViewMappings, transforms, colorAllocatorFactory, splits[i].selects);
                transformedDataviews.push(transformed);
            }
            return transformedDataviews;
        }

        function transformEmptyDataView(objectDescriptors: DataViewObjectDescriptors, transforms: DataViewTransformActions, colorAllocatorFactory: IColorAllocatorFactory): DataView[] {
            if (transforms && transforms.objects) {
                var emptyDataView: DataView = {
                    metadata: {
                        columns: [],
                    }
                };

                transformObjects(emptyDataView, objectDescriptors, transforms.objects, transforms.selects, colorAllocatorFactory);

                return [emptyDataView];
            }

            return [];
        }

        function transformDataView(
            prototype: DataView,
            objectDescriptors: DataViewObjectDescriptors,
            roleMappings: DataViewMapping[],
            transforms: DataViewTransformActions,
            colorAllocatorFactory: IColorAllocatorFactory,
            selectsToInclude?: INumberDictionary<boolean>): DataView {
            debug.assertValue(prototype, 'prototype');

            var transformed = inherit(prototype);
            transformed.metadata = inherit(prototype.metadata);

            transformed = transformSelects(transformed, roleMappings, transforms.selects, transforms.projectionOrdering, selectsToInclude);
            transformObjects(transformed, objectDescriptors, transforms.objects, transforms.selects, colorAllocatorFactory);

            return transformed;
        }

        function transformSelects(
            dataView: DataView,
            roleMappings: DataViewMapping[],
            selectTransforms: DataViewSelectTransform[],
            projectionOrdering?: DataViewProjectionOrdering,
            selectsToInclude?: INumberDictionary<boolean>): DataView {

            var columnRewrites: ValueRewrite<DataViewMetadataColumn>[] = [];
            if (selectTransforms) {
                dataView.metadata.columns = applyTransformsToColumns(
                    dataView.metadata.columns,
                    selectTransforms,
                    columnRewrites);
            }
            
            // NOTE: no rewrites necessary for Tree (it doesn't reference the columns)
            if (dataView.categorical) {
                dataView.categorical = applyRewritesToCategorical(dataView.categorical, columnRewrites, selectsToInclude);

                // NOTE: This is slightly DSR-specific.
                dataView = pivotIfNecessary(dataView, roleMappings);
            }

            if (dataView.matrix) {
                var matrixTransformationContext: MatrixTransformationContext = {
                    rowHierarchyRewritten: false,
                    columnHierarchyRewritten: false,
                    hierarchyTreesRewritten: false
                };
                dataView.matrix = applyRewritesToMatrix(dataView.matrix, columnRewrites, roleMappings, projectionOrdering, matrixTransformationContext);

                if (shouldPivotMatrix(dataView.matrix, roleMappings))
                    DataViewPivotMatrix.apply(dataView.matrix, matrixTransformationContext);
            }

            if (dataView.table)
                dataView.table = applyRewritesToTable(dataView.table, columnRewrites, roleMappings, projectionOrdering);

            return dataView;
        }

        function applyTransformsToColumns(
            prototypeColumns: DataViewMetadataColumn[],
            selects: DataViewSelectTransform[],
            rewrites: ValueRewrite<DataViewMetadataColumn>[]): DataViewMetadataColumn[] {
            debug.assertValue(prototypeColumns, 'columns');

            if (!selects)
                return prototypeColumns;

            var columns = inherit(prototypeColumns);

            for (var i = 0, len = prototypeColumns.length; i < len; i++) {
                var prototypeColumn = prototypeColumns[i];
                var select = selects[prototypeColumn.index];
                if (!select)
                    continue;

                var column: DataViewMetadataColumn = columns[i] = inherit(prototypeColumn);

                if (select.roles)
                    column.roles = select.roles;
                if (select.type)
                    column.type = select.type;
                column.format = getFormatForColumn(select, column);

                if (select.displayName)
                    column.displayName = select.displayName;
                if (select.queryName)
                    column.queryName = select.queryName;

                rewrites.push({
                    from: prototypeColumn,
                    to: column,
                });
            }

            return columns;
        }

        /** Get the column format. Order of precendence is:
        * 1. Select format
        * 2. Column format
        * 3. Default PowerView policy for column type
        */
        function getFormatForColumn(select: DataViewSelectTransform, column: DataViewMetadataColumn): string {
            // TODO: we already copied the select.Format to column.format, we probably don't need this check
            if (select.format)
                return select.format;

            if (column.format)
                return column.format;

            // TODO: deprecate this, default format string logic has been added to valueFormatter
            var type = column.type;
            if (type) {
                if (type.dateTime)
                    return 'd';
                if (type.integer)
                    return 'g';
                if (type.numeric)
                    return '#,0.00';
            }

            return undefined;
        }

        // Exported for testability
        export function upgradeSettingsToObjects(settings: VisualElementSettings, objectDefns?: DataViewObjectDefinitions): DataViewObjectDefinitions {
            if (!settings)
                return;

            if (!objectDefns)
                objectDefns = {};

            for (var propertyKey in settings) {
                var propertyValue = settings[propertyKey],
                    upgradedPropertyKey: string = propertyKey,
                    upgradedPropertyValue = propertyValue,
                    objectName: string = 'general';

                switch (propertyKey) {
                    case 'hasScalarCategoryAxis':
                        // hasScalarCategoryAxis -> categoryAxis.axisType
                        objectName = 'categoryAxis';
                        upgradedPropertyKey = 'axisType';
                        upgradedPropertyValue = SQExprBuilder.text(propertyValue ? axisType.scalar : axisType.categorical);
                        break;

                    case 'Totals':
                        // Totals -> general.totals
                        upgradedPropertyKey = 'totals';
                        upgradedPropertyValue = SQExprBuilder.boolean(!!propertyValue);
                        break;

                    case 'textboxSettings':
                        // textboxSettings.paragraphs -> general.paragraphs
                        upgradedPropertyKey = 'paragraphs';
                        if (propertyValue && propertyValue.paragraphs)
                            upgradedPropertyValue = propertyValue.paragraphs;
                        break;

                    case 'VisualType1':
                        // VisualType1 -> general.visualType1
                        upgradedPropertyKey = 'visualType1';
                        upgradedPropertyValue = SQExprBuilder.text(propertyValue);
                        break;

                    case 'VisualType2':
                        // VisualType2 -> general.visualType2
                        upgradedPropertyKey = 'visualType2';
                        upgradedPropertyValue = SQExprBuilder.text(propertyValue);
                        break;

                    case 'imageVisualSettings':
                        // imageVisualSettings.imageUrl -> general.imageUrl
                        upgradedPropertyKey = 'imageUrl';
                        if (propertyValue && propertyValue.imageUrl)
                            upgradedPropertyValue = SQExprBuilder.text(propertyValue.imageUrl);
                        break;

                    default:
                        // Ignore all other properties.
                        continue;
                }

                setObjectDefinition(objectDefns, objectName, upgradedPropertyKey, upgradedPropertyValue);
            }

            return objectDefns;
        }

        function setObjectDefinition(objects: DataViewObjectDefinitions, objectName: string, propertyName: string, value: any): void {
            debug.assertValue(objects, 'objects');
            debug.assertValue(objectName, 'objectName');
            debug.assertValue(propertyName, 'propertyName');

            var objectContainer: DataViewObjectDefinition[] = objects[objectName];
            if (objectContainer === undefined)
                objectContainer = objects[objectName] = [];

            var object: DataViewObjectDefinition = objectContainer[0];
            if (object === undefined)
                object = objectContainer[0] = { properties: {} };

            object.properties[propertyName] = value;
        }

        function applyRewritesToCategorical(prototype: DataViewCategorical, columnRewrites: ValueRewrite<DataViewMetadataColumn>[], selectsToInclude?: INumberDictionary<boolean>): DataViewCategorical {
            debug.assertValue(prototype, 'prototype');
            debug.assertValue(columnRewrites, 'columnRewrites');

            var categorical = inherit(prototype);

            function override(value: { source?: DataViewMetadataColumn }) {
                var rewrittenSource = findOverride(value.source, columnRewrites);
                if (rewrittenSource) {
                    var rewritten = inherit(value);
                    rewritten.source = rewrittenSource;
                    return rewritten;
                }
            }

            var categories = Prototype.overrideArray(prototype.categories, override);
            if (categories)
                categorical.categories = categories;

            var values = Prototype.overrideArray(prototype.values, override);

            if (values) {
                if (selectsToInclude) {
                    for (var i = values.length - 1; i >= 0; i--) {
                        if (!selectsToInclude[values[i].source.index])
                            values.splice(i, 1);
                    }
                }

                if (values.source) {
                    if (selectsToInclude && !selectsToInclude[values.source.index]) {
                        values.source = undefined;
                    }
                    else {
                        var rewrittenValuesSource = findOverride(values.source, columnRewrites);
                        if (rewrittenValuesSource)
                            values.source = rewrittenValuesSource;
                    }
                }

                categorical.values = values;
                setGrouped(values);
            }

            return categorical;
        }

        function applyRewritesToTable(
            prototype: DataViewTable,
            columnRewrites: ValueRewrite<DataViewMetadataColumn>[],
            roleMappings: DataViewMapping[],
            projectionOrdering: DataViewProjectionOrdering): DataViewTable {
            debug.assertValue(prototype, 'prototype');
            debug.assertValue(columnRewrites, 'columnRewrites');

            // Don't perform this potentially expensive transform unless we actually have a table. 
            // When we switch to lazy per-visual DataView creation, we'll be able to remove this check.
            if (!roleMappings || roleMappings.length !== 1 || !roleMappings[0].table)
                return prototype;

            var table = inherit(prototype);

            // Copy the rewritten columns into the table view
            var override = (metadata: DataViewMetadataColumn) => findOverride(metadata, columnRewrites);
            var columns = Prototype.overrideArray(prototype.columns, override);
            if (columns)
                table.columns = columns;

            if (!projectionOrdering)
                return table;

            var newToOldPositions = createTableColumnPositionMapping(projectionOrdering, columnRewrites);
            if (!newToOldPositions)
                return table;

            // Reorder the columns
            var columnsClone = columns.slice(0);
            var keys = Object.keys(newToOldPositions);
            for (var i = 0, len = keys.length; i < len; i++) {
                var sourceColumn = columnsClone[newToOldPositions[keys[i]]];

                // In the case we've hit the end of our columns array, but still have position reordering keys,
                // there is a duplicate column so we will need to add a new column for the duplicate data
                if (i === columns.length)
                    columns.push(sourceColumn);
                else {
                    debug.assert(i < columns.length, 'The column index is out of range for reordering.');
                    columns[i] = sourceColumn;
                }
            }
            
            // Reorder the rows
            var rows = Prototype.overrideArray(table.rows,
                (row: any[]) => {
                    var newRow: any[] = [];
                    for (var i = 0, len = keys.length; i < len; ++i) 
                        newRow[i] = row[newToOldPositions[keys[i]]];

                    return newRow;
                });

            if (rows)
                table.rows = rows;

            return table;
        }

        // Creates a mapping of new position to original position.
        function createTableColumnPositionMapping(
            projectionOrdering: DataViewProjectionOrdering,
            columnRewrites: ValueRewrite<DataViewMetadataColumn>[]): NumberToNumberMapping {
            var roles = Object.keys(projectionOrdering);

            debug.assert(roles.length === 1, "Tables should have exactly one role.");

            var role = roles[0],
                originalOrder = columnRewrites.map((rewrite: ValueRewrite<DataViewMetadataColumn>) => rewrite.from.index),
                newOrder = projectionOrdering[role];

            // Optimization: avoid rewriting the table if all columns are in their default positions.
            if (ArrayExtensions.sequenceEqual(originalOrder, newOrder, (x: number, y: number) => x === y))
                return;

            return createOrderMapping(originalOrder, newOrder);
        }

        function applyRewritesToMatrix(
            prototype: DataViewMatrix,
            columnRewrites: ValueRewrite<DataViewMetadataColumn>[],
            roleMappings: DataViewMapping[],
            projectionOrdering: DataViewProjectionOrdering,
            context: MatrixTransformationContext): DataViewMatrix {
            debug.assertValue(prototype, 'prototype');
            debug.assertValue(columnRewrites, 'columnRewrites');

            // Don't perform this potentially expensive transform unless we actually have a matrix. 
            // When we switch to lazy per-visual DataView creation, we'll be able to remove this check.
            if (!roleMappings || roleMappings.length !== 1 || !roleMappings[0].matrix)
                return prototype;

            var matrix = inherit(prototype);

            function override(metadata: DataViewMetadataColumn) {
                return findOverride(metadata, columnRewrites);
            }

            function overrideHierarchy(hierarchy: DataViewHierarchy): DataViewHierarchy {
                var rewrittenHierarchy: DataViewHierarchy = null;

                var newLevels = Prototype.overrideArray(
                    hierarchy.levels,
                    (level: DataViewHierarchyLevel) => {
                        var newLevel: DataViewHierarchyLevel = null;
                        var levelSources = Prototype.overrideArray(level.sources, override);
                        if (levelSources)
                            newLevel = ensureRewritten<DataViewHierarchyLevel>(newLevel, level, h => h.sources = levelSources);

                        return newLevel;
                    });
                if (newLevels)
                    rewrittenHierarchy = ensureRewritten<DataViewHierarchy>(rewrittenHierarchy, hierarchy, r => r.levels = newLevels);

                return rewrittenHierarchy;
            }

            var rows = overrideHierarchy(matrix.rows);
            if (rows) {
                matrix.rows = rows;
                context.rowHierarchyRewritten = true;
            }

            var columns = overrideHierarchy(matrix.columns);
            if (columns) {
                matrix.columns = columns;
                context.columnHierarchyRewritten = true;
            }

            var valueSources = Prototype.overrideArray(matrix.valueSources, override);
            if (valueSources) {
                matrix.valueSources = valueSources;

                // Only need to reorder if we have more than one value source
                if (projectionOrdering && valueSources.length > 1) {
                    var columnLevels = columns.levels.length;
                    if (columnLevels > 0) {
                        var newToOldPositions = createMatrixValuesPositionMapping(roleMappings[0].matrix, projectionOrdering, valueSources, columnRewrites);
                        if (newToOldPositions) {
                            var keys = Object.keys(newToOldPositions);
                            var numKeys = keys.length;

                            // Reorder the value columns
                            columns.root = DataViewPivotMatrix.cloneTree(columns.root);
                            if (columnLevels === 1)
                                reorderChildNodes(columns.root, newToOldPositions);
                            else
                                forEachNodeAtLevel(columns.root, columnLevels - 2,(node: DataViewMatrixNode) => reorderChildNodes(node, newToOldPositions));

                            // Reorder the value rows
                            matrix.rows.root = DataViewPivotMatrix.cloneTreeExecuteOnLeaf(matrix.rows.root,(node: DataViewMatrixNode) => {
                                var newValues: { [id: number]: DataViewTreeNodeValue } = {};

                                var iterations = Object.keys(node.values).length / numKeys;
                                for (var i = 0, len = iterations; i < len; i++) {
                                    var offset = i * numKeys;
                                    for (var keysIndex = 0; keysIndex < numKeys; keysIndex++)
                                        newValues[offset + keysIndex] = node.values[offset + newToOldPositions[keys[keysIndex]]];
                                }

                                node.values = newValues;
                            });

                            context.hierarchyTreesRewritten = true;
                        }
                    }
                }
            }

            return matrix;
        }

        function reorderChildNodes(node: DataViewMatrixNode, newToOldPositions: NumberToNumberMapping): void {
            var keys = Object.keys(newToOldPositions);
            var numKeys = keys.length;
            var children = node.children;

            var childrenClone = children.slice(0);
            for (var i = 0, len = numKeys; i < len; i++) {
                var sourceColumn = childrenClone[newToOldPositions[keys[i]]];

                // In the case we've hit the end of our columns array, but still have position reordering keys,
                // there is a duplicate column so we will need to add a new column for the duplicate data
                if (i === children.length)
                    children.push(sourceColumn);
                else {
                    debug.assert(i < children.length, 'The column index is out of range for reordering.');
                    children[i] = sourceColumn;
                }
            }
        }

        // Creates a mapping of new position to original position.
        function createMatrixValuesPositionMapping(
            matrixMapping: DataViewMatrixMapping,
            projectionOrdering: DataViewProjectionOrdering,
            valueSources: DataViewMetadataColumn[],
            columnRewrites: ValueRewrite<DataViewMetadataColumn>[]): NumberToNumberMapping {
            var role = matrixMapping.values.for.in;

            function matchValueSource(columnRewrite: ValueRewrite<DataViewMetadataColumn>) {
                for (var i = 0, len = valueSources.length; i < len; i++) {
                    var valueSource = valueSources[i];
                    if (valueSource === columnRewrite.to)
                        return columnRewrite;
                }
            }

            var valueRewrites: ValueRewrite<DataViewMetadataColumn>[] = [];
            for (var i = 0, len = columnRewrites.length; i < len; i++) {
                var columnRewrite = columnRewrites[i];
                if (matchValueSource(columnRewrite))
                    valueRewrites.push(columnRewrite);
            }

            var newOrder = projectionOrdering[role];
            var originalOrder = valueRewrites.map((rewrite: ValueRewrite<DataViewMetadataColumn>) => rewrite.from.index);

            // Optimization: avoid rewriting the matrix if all leaf nodes are in their default positions.
            if (ArrayExtensions.sequenceEqual(originalOrder, newOrder,(x: number, y: number) => x === y))
                return;

            return createOrderMapping(originalOrder, newOrder);
        }

        function createOrderMapping(originalOrder: number[], newOrder: number[]): NumberToNumberMapping {
            var mapping: NumberToNumberMapping = {};
            for (var i = 0, len = newOrder.length; i < len; ++i) {
                var newPosition = newOrder[i];
                mapping[i] = originalOrder.indexOf(newPosition);
            }

            return mapping;
        }

        function forEachNodeAtLevel(node: DataViewMatrixNode, targetLevel: number, callback: (node: DataViewMatrixNode) => void): void {
            if (node.level === targetLevel) {
                callback(node);
                return;
            }

            var children = node.children;
            if (children && children.length > 0) {
                for (var i = 0, ilen = children.length; i < ilen; i++)
                    forEachNodeAtLevel(children[i], targetLevel, callback);
            }
        }

        function findOverride(source: DataViewMetadataColumn, columnRewrites: ValueRewrite<DataViewMetadataColumn>[]): DataViewMetadataColumn {
            for (var i = 0, len = columnRewrites.length; i < len; i++) {
                var columnRewrite = columnRewrites[i];
                if (columnRewrite.from === source)
                    return columnRewrite.to;
            }
        }

        function ensureRewritten<T>(rewritten: T, prototype: T, callback?: (rewritten: T) => void): T {
            if (!rewritten)
                rewritten = inherit(prototype);

            if (callback)
                callback(rewritten);

            return rewritten;
        }

        function transformObjects(
            dataView: DataView,
            objectDescriptors: DataViewObjectDescriptors,
            objectDefinitions: DataViewObjectDefinitions,
            selectTransforms: DataViewSelectTransform[],
            colorAllocatorFactory: IColorAllocatorFactory): void {
            debug.assertValue(dataView, 'dataView');
            debug.assertAnyValue(objectDescriptors, 'objectDescriptors');
            debug.assertAnyValue(objectDefinitions, 'objectDefinitions');
            debug.assertAnyValue(selectTransforms, 'selectTransforms');
            debug.assertValue(colorAllocatorFactory, 'colorAllocatorFactory');

            if (!objectDescriptors)
                return;

            var objectsForAllSelectors = DataViewObjectEvaluationUtils.groupObjectsBySelector(objectDefinitions);
            if (selectTransforms)
                DataViewObjectEvaluationUtils.addDefaultFormatString(objectsForAllSelectors, objectDescriptors, dataView.metadata.columns, selectTransforms);

            var metadataOnce = objectsForAllSelectors.metadataOnce;
            var dataObjects = objectsForAllSelectors.data;
            if (metadataOnce)
                evaluateMetadataObjects(dataView, objectDescriptors, metadataOnce.objects, dataObjects, colorAllocatorFactory);

            var metadataObjects = objectsForAllSelectors.metadata;
            if (metadataObjects) {
                for (var i = 0, len = metadataObjects.length; i < len; i++) {
                    var metadataObject = metadataObjects[i];
                    evaluateMetadataRepetition(dataView, objectDescriptors, metadataObject.selector, metadataObject.objects);
                }
            }

            for (var i = 0, len = dataObjects.length; i < len; i++) {
                var dataObject = dataObjects[i];
                evaluateDataRepetition(dataView, objectDescriptors, dataObject.selector, dataObject.rules, dataObject.objects);
            }

            if (objectsForAllSelectors.userDefined) {
                // TODO: Implement this.
            }
        }

        /** Evaluates and sets properties on the DataView metadata. */
        function evaluateMetadataObjects(
            dataView: DataView,
            objectDescriptors: DataViewObjectDescriptors,
            objectDefns: DataViewNamedObjectDefinition[],
            dataObjects: DataViewObjectDefinitionsForSelectorWithRule[],
            colorAllocatorFactory: IColorAllocatorFactory): void {
            debug.assertValue(dataView, 'dataView');
            debug.assertValue(objectDescriptors, 'objectDescriptors');
            debug.assertValue(objectDefns, 'objectDefns');
            debug.assertValue(dataObjects, 'dataObjects');
            debug.assertValue(colorAllocatorFactory, 'colorAllocatorFactory');

            var objects = DataViewObjectEvaluationUtils.evaluateDataViewObjects(objectDescriptors, objectDefns);
            if (objects) {
                dataView.metadata.objects = objects;

                for (var objectName in objects) {
                    var object: DataViewObject = objects[objectName],
                        objectDesc = objectDescriptors[objectName];

                    for (var propertyName in object) {
                        var propertyDesc = objectDesc.properties[propertyName],
                            ruleDesc = propertyDesc.rule;
                        if (!ruleDesc)
                            continue;

                        var definition = createRuleEvaluationInstance(
                            dataView,
                            colorAllocatorFactory,
                            ruleDesc,
                            objectName,
                            object[propertyName],
                            propertyDesc.type);
                        if (!definition)
                            continue;

                        dataObjects.push(definition);
                    }
                }
            }
        }

        function createRuleEvaluationInstance(
            dataView: DataView,
            colorAllocatorFactory: IColorAllocatorFactory,
            ruleDesc: DataViewObjectPropertyRuleDescriptor,
            objectName: string,
            propertyValue: DataViewPropertyValue,
            ruleType: StructuralTypeDescriptor): DataViewObjectDefinitionsForSelectorWithRule {
            debug.assertValue(dataView, 'dataView');
            debug.assertValue(colorAllocatorFactory, 'colorAllocatorFactory');
            debug.assertValue(ruleDesc, 'ruleDesc');
            debug.assertValue(propertyValue, 'propertyValue');
            debug.assertValue(ruleType, 'ruleType');

            var ruleOutput = ruleDesc.output;
            if (!ruleOutput)
                return;

            var selectorToCreate = findSelectorForRuleInput(dataView, ruleOutput.selector);

            if (ruleType.fillRule)
                return createRuleEvaluationInstanceFillRule(dataView, colorAllocatorFactory, ruleDesc, selectorToCreate, objectName, <FillRule>propertyValue);

            if (ruleType.filter)
                return createRuleEvaluationInstanceFilter(dataView, ruleDesc, selectorToCreate, objectName, <SemanticFilter>propertyValue);
        }

        function createRuleEvaluationInstanceFillRule(
            dataView: DataView,
            colorAllocatorFactory: IColorAllocatorFactory,
            ruleDesc: DataViewObjectPropertyRuleDescriptor,
            selectorToCreate: Selector,
            objectName: string,
            propertyValue: FillRule): DataViewObjectDefinitionsForSelectorWithRule {
            debug.assertValue(dataView, 'dataView');
            debug.assertValue(colorAllocatorFactory, 'colorAllocatorFactory');
            debug.assertValue(ruleDesc, 'ruleDesc');
            debug.assertValue(selectorToCreate, 'selectorToCreate');
            debug.assertValue(propertyValue, 'propertyValue');

            var colorAllocator: IColorAllocator;
            if (propertyValue.linearGradient2)
                colorAllocator = createColorAllocatorLinearGradient2(dataView, colorAllocatorFactory, ruleDesc, propertyValue, propertyValue.linearGradient2);
            else if (propertyValue.linearGradient3)
                colorAllocator = createColorAllocatorLinearGradient3(dataView, colorAllocatorFactory, ruleDesc, propertyValue, propertyValue.linearGradient3);

            if (!colorAllocator)
                return;

            var rule = new ColorRuleEvaluation(ruleDesc.inputRole, colorAllocator);
            var fillRuleProperties: DataViewObjectPropertyDefinitions = {};
            fillRuleProperties[ruleDesc.output.property] = {
                solid: { color: rule }
            };

            return {
                selector: selectorToCreate,
                rules: [rule],
                objects: [{
                    name: objectName,
                    properties: fillRuleProperties,
                }]
            };
        }

        function createColorAllocatorLinearGradient2(
            dataView: DataView,
            colorAllocatorFactory: IColorAllocatorFactory,
            ruleDesc: DataViewObjectPropertyRuleDescriptor,
            propertyValueFillRule: FillRule,
            linearGradient2: LinearGradient2): IColorAllocator {
            debug.assertValue(dataView, 'dataView');
            debug.assertValue(colorAllocatorFactory, 'colorAllocatorFactory');
            debug.assertValue(ruleDesc, 'ruleDesc');
            debug.assertValue(linearGradient2, 'linearGradient2');

            var linearGradient2 = propertyValueFillRule.linearGradient2;
            if (linearGradient2.min.value === undefined ||
                linearGradient2.max.value === undefined) {
                var inputRange = findRuleInputColumnNumberRange(dataView, ruleDesc.inputRole);
                if (!inputRange)
                    return;

                if (linearGradient2.min.value === undefined)
                    linearGradient2.min.value = inputRange.min;
                if (linearGradient2.max.value === undefined)
                    linearGradient2.max.value = inputRange.max;
            }

            return colorAllocatorFactory.linearGradient2(propertyValueFillRule.linearGradient2);
        }

        function createColorAllocatorLinearGradient3(
            dataView: DataView,
            colorAllocatorFactory: IColorAllocatorFactory,
            ruleDesc: DataViewObjectPropertyRuleDescriptor,
            propertyValueFillRule: FillRule,
            linearGradient3: LinearGradient3): IColorAllocator {
            debug.assertValue(dataView, 'dataView');
            debug.assertValue(colorAllocatorFactory, 'colorAllocatorFactory');
            debug.assertValue(ruleDesc, 'ruleDesc');
            debug.assertValue(linearGradient3, 'linearGradient3');

            var linearGradient3 = propertyValueFillRule.linearGradient3;
            if (linearGradient3.min.value === undefined ||
                linearGradient3.mid.value === undefined ||
                linearGradient3.max.value === undefined) {
                var inputRange = findRuleInputColumnNumberRange(dataView, ruleDesc.inputRole);
                if (!inputRange)
                    return;

                if (linearGradient3.min.value === undefined) {
                    linearGradient3.min.value = inputRange.min;
                }
                if (linearGradient3.max.value === undefined) {
                    linearGradient3.max.value = inputRange.max;
                }
                if (linearGradient3.mid.value === undefined) {
                    var midValue: number = (linearGradient3.max.value + linearGradient3.min.value) / 2;
                    linearGradient3.mid.value = midValue;
                }
            }

            return colorAllocatorFactory.linearGradient3(propertyValueFillRule.linearGradient3);
        }

        function createRuleEvaluationInstanceFilter(
            dataView: DataView,
            ruleDesc: DataViewObjectPropertyRuleDescriptor,
            selectorToCreate: Selector,
            objectName: string,
            propertyValue: SemanticFilter): DataViewObjectDefinitionsForSelectorWithRule {
            debug.assertValue(dataView, 'dataView');
            debug.assertValue(ruleDesc, 'ruleDesc');
            debug.assertValue(selectorToCreate, 'selectorToCreate');
            debug.assertValue(propertyValue, 'propertyValue');

            // NOTE: This is not right -- we ought to discover the keys from an IN operator expression to avoid additional dependencies.
            if (!dataView.categorical || !dataView.categorical.categories || dataView.categorical.categories.length !== 1)
                return;
            var identityFields = dataView.categorical.categories[0].identityFields;
            if (!identityFields)
                return;
            
            var scopeIds = SQExprConverter.asScopeIdsContainer(propertyValue, identityFields);
            if (!scopeIds)
                return;

            var rule = new FilterRuleEvaluation(scopeIds);
            var properties: DataViewObjectPropertyDefinitions = {};
            properties[ruleDesc.output.property] = rule;

            return {
                selector: selectorToCreate,
                rules: [rule],
                objects: [{
                    name: objectName,
                    properties: properties,
                }]
            };
        }

        function evaluateDataRepetition(
            dataView: DataView,
            objectDescriptors: DataViewObjectDescriptors,
            selector: Selector,
            rules: RuleEvaluation[],
            objectDefns: DataViewNamedObjectDefinition[]): void {
            debug.assertValue(dataView, 'dataView');
            debug.assertValue(objectDescriptors, 'objectDescriptors');
            debug.assertValue(selector, 'selector');
            debug.assertAnyValue(rules, 'rules');
            debug.assertValue(objectDefns, 'objectDefns');

            var containsWildcard = Selector.containsWildcard(selector);

            var dataViewCategorical = dataView.categorical;
            if (dataViewCategorical) {
                var selectorMatched: boolean = false;

                // 1) Match against categories
                selectorMatched = evaluateDataRepetitionCategoricalCategory(dataViewCategorical, objectDescriptors, selector, rules, containsWildcard, objectDefns) || selectorMatched;

                // 2) Match against valueGrouping
                selectorMatched = evaluateDataRepetitionCategoricalValueGrouping(dataViewCategorical, objectDescriptors, selector, rules, containsWildcard, objectDefns) || selectorMatched;

                if (selectorMatched)
                    return;
            }

            // If we made it here, nothing matched the selector.  Consider capturing this in a diagnostics/context object to help debugging.
        }

        function evaluateDataRepetitionCategoricalCategory(
            dataViewCategorical: DataViewCategorical,
            objectDescriptors: DataViewObjectDescriptors,
            selector: Selector,
            rules: RuleEvaluation[],
            containsWildcard: boolean,
            objectDefns: DataViewNamedObjectDefinition[]): boolean {
            debug.assertValue(dataViewCategorical, 'dataViewCategorical');
            debug.assertValue(objectDescriptors, 'objectDescriptors');
            debug.assertValue(selector, 'selector');
            debug.assertAnyValue(rules, 'rules');
            debug.assertValue(containsWildcard, 'containsWildcard');
            debug.assertValue(objectDefns, 'objectDefns');

            if (!dataViewCategorical.categories || dataViewCategorical.categories.length === 0)
                return;

            var targetColumn = findSelectedCategoricalColumn(dataViewCategorical, selector);
            if (!targetColumn)
                return;

            var identities = targetColumn.identities,
                foundMatch: boolean,
                matchedRules: { rule: RuleEvaluation; inputValues: any[] }[];

            if (!identities)
                return;

            debug.assert(targetColumn.column.values.length === identities.length, 'Column length mismatch');

            for (var i = 0, len = identities.length; i < len; i++) {
                var identity = identities[i];

                if (containsWildcard || Selector.matchesData(selector, [identity])) {
                    // Set the context for any rules.
                    if (rules) {
                        if (!matchedRules)
                            matchedRules = matchRulesToDataViewCategorical(rules, dataViewCategorical);

                        for (var ruleIdx = 0, ruleLen = matchedRules.length; ruleIdx < ruleLen; ruleIdx++) {
                            var matchedRule = matchedRules[ruleIdx];
                            matchedRule.rule.setContext(identity, matchedRule.inputValues ? matchedRule.inputValues[i] : undefined);
                        }
                    }

                    var objects = DataViewObjectEvaluationUtils.evaluateDataViewObjects(objectDescriptors, objectDefns);
                    if (objects) {
                        // TODO: This mutates the DataView -- the assumption is that prototypal inheritance has already occurred.  We should
                        // revisit this, likely when we do lazy evaluation of DataView.
                        if (!targetColumn.column.objects) {
                            targetColumn.column.objects = [];
                            targetColumn.column.objects.length = len;
                        }
                        targetColumn.column.objects[i] = objects;
                    }

                    if (!containsWildcard)
                        return true;

                    foundMatch = true;
                }
            }

            return foundMatch;
        }

        function matchRulesToDataViewCategorical(
            rules: RuleEvaluation[],
            dataViewCategorical: DataViewCategorical): { rule: RuleEvaluation; inputValues: any[] }[]{
            var result: { rule: RuleEvaluation; inputValues: any[] }[] = [];

            for (var i = 0, len = rules.length; i < len; i++) {
                var rule = rules[i],
                    inputColumn = findRuleInputCategoricalColumn(dataViewCategorical, rule.inputRole);

                var inputValues: any[];
                if (inputColumn)
                    inputValues = inputColumn.values;

                result.push({
                    rule: rule,
                    inputValues: inputValues,
                });
            }

            return result;
        }

        function evaluateDataRepetitionCategoricalValueGrouping(
            dataViewCategorical: DataViewCategorical,
            objectDescriptors: DataViewObjectDescriptors,
            selector: Selector,
            rules: RuleEvaluation[],
            containsWildcard: boolean,
            objectDefns: DataViewNamedObjectDefinition[]): boolean {
            debug.assertValue(dataViewCategorical, 'dataViewCategorical');
            debug.assertValue(objectDescriptors, 'objectDescriptors');
            debug.assertValue(selector, 'selector');
            debug.assertAnyValue(rules, 'rules');
            debug.assertValue(containsWildcard, 'containsWildcard');
            debug.assertValue(objectDefns, 'objectDefns');

            var dataViewCategoricalValues = dataViewCategorical.values;
            if (!dataViewCategoricalValues || !dataViewCategoricalValues.identityFields)
                return;

            if (!Selector.matchesKeys(selector, [dataViewCategoricalValues.identityFields]))
                return;

            var valuesGrouped = dataViewCategoricalValues.grouped();
            if (!valuesGrouped)
                return;

            var foundMatch: boolean;
            for (var i = 0, len = valuesGrouped.length; i < len; i++) {
                var valueGroup = valuesGrouped[i];
                if (containsWildcard || Selector.matchesData(selector, [valueGroup.identity])) {
                    var objects = DataViewObjectEvaluationUtils.evaluateDataViewObjects(objectDescriptors, objectDefns);
                    if (objects) {
                        // TODO: This mutates the DataView -- the assumption is that prototypal inheritance has already occurred.  We should
                        // revisit this, likely when we do lazy evaluation of DataView.
                        valueGroup.objects = objects;
                        setGrouped(dataViewCategoricalValues, valuesGrouped);
                    }

                    if (!containsWildcard)
                        return true;

                    foundMatch = true;
                }
            }

            return foundMatch;
        }

        function evaluateMetadataRepetition(
            dataView: DataView,
            objectDescriptors: DataViewObjectDescriptors,
            selector: Selector,
            objectDefns: DataViewNamedObjectDefinition[]): void {
            debug.assertValue(dataView, 'dataView');
            debug.assertValue(objectDescriptors, 'objectDescriptors');
            debug.assertValue(selector, 'selector');
            debug.assertValue(objectDefns, 'objectDefns');

            // TODO: This mutates the DataView -- the assumption is that prototypal inheritance has already occurred.  We should
            // revisit this, likely when we do lazy evaluation of DataView.
            var columns = dataView.metadata.columns,
                metadataId = selector.metadata;
            for (var i = 0, len = columns.length; i < len; i++) {
                var column = columns[i];
                if (column.queryName === metadataId) {
                    var objects = DataViewObjectEvaluationUtils.evaluateDataViewObjects(objectDescriptors, objectDefns);
                    if (objects)
                        column.objects = objects;
                }
            }
        }

        /** Attempts to find a column that can possibly match the selector. */
        function findSelectedCategoricalColumn(dataViewCategorical: DataViewCategorical, selector: Selector) {
            debug.assertValue(dataViewCategorical.categories[0], 'dataViewCategorical.categories[0]');

            var categoricalColumn = dataViewCategorical.categories[0];
            if (!categoricalColumn.identityFields)
                return;
            if (!Selector.matchesKeys(selector, [categoricalColumn.identityFields]))
                return;

            var identities = categoricalColumn.identity,
                targetColumn: DataViewCategoricalColumn = categoricalColumn;

            var selectedMetadataId = selector.metadata;
            if (selectedMetadataId) {
                var valueColumns = dataViewCategorical.values;
                if (valueColumns) {
                    for (var i = 0, len = valueColumns.length; i < len; i++) {
                        var valueColumn = valueColumns[i];
                        if (valueColumn.source.queryName === selectedMetadataId) {
                            targetColumn = valueColumn;
                            break;
                        }
                    }
                }
            }

            return {
                column: targetColumn,
                identities: identities,
            };
        }

        function findSelectorForRuleInput(dataView: DataView, selectorRoles: string[]): Selector {
            debug.assertValue(dataView, 'dataView');
            debug.assertValue(selectorRoles, 'selectorRoles');

            if (selectorRoles.length !== 1)
                return;

            var dataViewCategorical = dataView.categorical;
            if (!dataViewCategorical)
                return;

            var categories = dataViewCategorical.categories;
            if (!categories || categories.length !== 1)
                return;

            var categoryColumn = categories[0],
                categoryRoles = categoryColumn.source.roles,
                categoryIdentityFields = categoryColumn.identityFields;
            if (!categoryRoles || !categoryIdentityFields || !categoryRoles[selectorRoles[0]])
                return;

            return { data: [DataViewScopeWildcard.fromExprs(categoryIdentityFields)] };
        }

        function findRuleInputCategoricalColumn(dataViewCategorical: DataViewCategorical, inputRole: string): DataViewCategoricalColumn {
            debug.assertValue(dataViewCategorical, 'dataViewCategorical');

            return findRuleInputInCategoricalColumns(dataViewCategorical.values, inputRole) ||
                findRuleInputInCategoricalColumns(dataViewCategorical.categories, inputRole);
        }

        function findRuleInputInCategoricalColumns(columns: DataViewCategoricalColumn[], inputRole: string): DataViewCategoricalColumn {
            debug.assertAnyValue(columns, 'columns');

            if (!columns)
                return;

            for (var i = 0, len = columns.length; i < len; i++) {
                var column = columns[i],
                    roles = column.source.roles;
                if (!roles || !roles[inputRole])
                    continue;

                return column;
            }
        }

        /** Attempts to find the value range for the single column with the given inputRole. */
        function findRuleInputColumnNumberRange(dataView: DataView, inputRole: string): NumberRange {
            debug.assertValue(dataView, 'dataView');
            debug.assertValue(inputRole, 'inputRole');

            // NOTE: This implementation currently only supports categorical DataView, becuase that's the
            // only scenario that has custom colors, as of this writing.  This would be rewritten to be more generic
            // as required, when needed.
            var dataViewCategorical = dataView.categorical;
            if (!dataViewCategorical)
                return;

            var values = dataViewCategorical.values;
            if (!values)
                return;

            for (var i = 0, len = values.length; i < len; i++) {
                var valueCol = values[i],
                    valueColRoles = valueCol.source.roles;

                if (!valueColRoles || !valueColRoles[inputRole])
                    continue;

                var min = valueCol.min;
                if (min === undefined)
                    min = valueCol.minLocal;
                if (min === undefined)
                    continue;

                var max = valueCol.max;
                if (max === undefined)
                    max = valueCol.maxLocal;
                if (max === undefined)
                    continue;

                return { min: min, max: max };
            }
        }

        export function createTransformActions(
            queryMetadata: QueryMetadata,
            visualElements: VisualElement[],
            objectDescs: DataViewObjectDescriptors,
            objectDefns: DataViewObjectDefinitions): DataViewTransformActions {
            debug.assertAnyValue(queryMetadata, 'queryMetadata');
            debug.assertAnyValue(visualElements, 'visualElements');
            debug.assertAnyValue(objectDescs, 'objectDescs');
            debug.assertAnyValue(objectDefns, 'objectDefns');

            if ((!queryMetadata || ArrayExtensions.isUndefinedOrEmpty(queryMetadata.Select)) &&
                ArrayExtensions.isUndefinedOrEmpty(visualElements) &&
                !objectDefns)
                return;

            var transforms: DataViewTransformActions = {};
            if (queryMetadata) {
                var querySelects = queryMetadata.Select;
                if (querySelects) {
                    var transformSelects: DataViewSelectTransform[] = transforms.selects = [];
                    for (var i = 0, len = querySelects.length; i < len; i++) {
                        var selectMetadata = querySelects[i],
                            selectTransform = toTransformSelect(selectMetadata, i);
                        transformSelects.push(selectTransform);

                        if (selectTransform.format && objectDescs) {
                            debug.assert(!!selectTransform.queryName, 'selectTransform.queryName should be defined (or defaulted).');

                            var formatStringProp = DataViewObjectDescriptors.findFormatString(objectDescs);
                            if (formatStringProp) {
                                // Select Format strings are migrated into objects
                                if (!objectDefns)
                                    objectDefns = {};

                                DataViewObjectDefinitions.ensure(
                                    objectDefns,
                                    formatStringProp.objectName,
                                    { metadata: selectTransform.queryName })
                                    .properties[formatStringProp.propertyName] = SQExprBuilder.text(selectTransform.format);
                            }
                        }
                    }
                }
            }

            if (visualElements) {
                var visualElementsLength = visualElements.length;
                if (visualElementsLength > 1)
                    transforms.splits = [];

                for (var i = 0; i < visualElementsLength; i++) {
                    var visualElement = visualElements[i];

                    if (visualElement.Settings && i === 0)
                        objectDefns = upgradeSettingsToObjects(visualElement.Settings, objectDefns);

                    if (visualElement.DataRoles) {
                        if (!transforms.selects)
                            transforms.selects = [];

                        populateDataRoles(visualElement.DataRoles, transforms.selects);
                    }

                    if (transforms.splits)
                        transforms.splits.push(populateSplit(visualElement.DataRoles));
                }
            }

            if (objectDefns)
                transforms.objects = objectDefns;

            return transforms;
        }

        function toTransformSelect(select: SelectMetadata, index: number): DataViewSelectTransform {
            debug.assertValue(select, 'select');

            var result: DataViewSelectTransform = {};

            if (select.Restatement)
                result.displayName = select.Restatement;

            if (select.Name)
                result.queryName = select.Name;
            else if (!result.queryName)
                result.queryName = '$select' + index;

            if (select.Format)
                result.format = select.Format;
            if (select.Type)
                result.type = dsr.DataShapeUtility.describeDataType(select.Type, ConceptualDataCategory[select.DataCategory]);

            return result;
        }

        function populateDataRoles(roles: DataRole[], selects: DataViewSelectTransform[]): void {
            debug.assertValue(roles, 'roles');
            debug.assertValue(selects, 'selects');

            for (var i = 0, len = roles.length; i < len; i++) {
                var role = roles[i],
                    roleProjection = role.Projection;

                var select = selects[roleProjection];
                if (select === undefined) {
                    fillArray(selects, roleProjection);
                    select = selects[roleProjection] = {};
                }

                var selectRoles = select.roles;
                if (select.roles === undefined)
                    selectRoles = select.roles = {};

                selectRoles[role.Name] = true;
            }
        }

        function fillArray(selects: DataViewSelectTransform[], length: number): void {
            debug.assertValue(selects, 'selects');
            debug.assertValue(length, 'length');

            for (var i = selects.length; i < length; i++)
                selects[i] = {};
        }

        function populateSplit(roles: DataRole[]): DataViewSplitTransform {
            debug.assertAnyValue(roles, 'roles');

            var selects: INumberDictionary<boolean> = {};
            var split: DataViewSplitTransform = {
                selects: selects
            };

            if (roles) {
                for (var i = 0, len = roles.length; i < len; i++) {
                    var role = roles[i];
                    selects[role.Projection] = true;
                }
            }

            return split;
        }

        export function createValueColumns(values: DataViewValueColumn[] = [], valueIdentityFields?: SQExpr[]): DataViewValueColumns {
            var result = <DataViewValueColumns>values;
            setGrouped(<DataViewValueColumns>values);
            
            if (valueIdentityFields)
                result.identityFields = valueIdentityFields;

            return result;
        }

        function setGrouped(values: DataViewValueColumns, groupedResult?: DataViewValueColumnGroup[]): void {
            values.grouped = groupedResult
                ? () => groupedResult
                : () => groupValues(values);
        }

        /** Group together the values with a common identity. */
        function groupValues(values: DataViewValueColumn[]): DataViewValueColumnGroup[] {
            debug.assertValue(values, 'values');

            var groups: DataViewValueColumnGroup[] = [],
                currentGroup: DataViewValueColumnGroup;

            for (var i = 0, len = values.length; i < len; i++) {
                var value = values[i];

                if (!currentGroup || currentGroup.identity !== value.identity) {
                    currentGroup = {
                        values: []
                    };

                    if (value.identity) {
                        currentGroup.identity = value.identity;

                        var source = value.source;
                        // allow null, which will be formatted as (Blank).
                        if (source.groupName !== undefined)
                            currentGroup.name = source.groupName;
                        else if (source.displayName)
                            currentGroup.name = source.displayName;
                    }

                    groups.push(currentGroup);
                }

                currentGroup.values.push(value);
            }

            return groups;
        }

        function pivotIfNecessary(dataView: DataView, dataViewMappings: DataViewMapping[]): DataView {
            debug.assertValue(dataView, 'dataView');

            var transformedDataView: DataView;
            switch (determineCategoricalTransformation(dataView.categorical, dataViewMappings)) {
                case CategoricalDataViewTransformation.Pivot:
                    transformedDataView = DataViewPivotCategorical.apply(dataView);
                    break;

                case CategoricalDataViewTransformation.SelfCrossJoin:
                    transformedDataView = DataViewSelfCrossJoin.apply(dataView);
                    break;
            }

            return transformedDataView || dataView;
        }

        function determineCategoricalTransformation(categorical: DataViewCategorical, dataViewMappings: DataViewMapping[]): CategoricalDataViewTransformation {
            if (!categorical || ArrayExtensions.isUndefinedOrEmpty(dataViewMappings))
                return;

            var categories = categorical.categories;
            if (!categories || categories.length !== 1)
                return;

            var values = categorical.values;
            if (ArrayExtensions.isUndefinedOrEmpty(values))
                return;

            if (values.grouped().some(vg => !!vg.identity))
                return;

            // If we made it here, the DataView has a single category and no valueGrouping.
            var categoryRoles = categories[0].source.roles;

            for (var i = 0, len = dataViewMappings.length; i < len; i++) {
                var roleMappingCategorical = dataViewMappings[i].categorical;
                if (!roleMappingCategorical)
                    continue;

                if (!hasRolesGrouped(categoryRoles, <DataViewGroupedRoleMapping>roleMappingCategorical.values))
                    continue;

                // If we made it here, the DataView's single category has the value grouping role.
                var categoriesMapping = roleMappingCategorical.categories;
                var hasCategoryRole =
                    hasRolesBind(categoryRoles, <DataViewRoleBindMappingWithReduction>categoriesMapping) ||
                    hasRolesFor(categoryRoles, <DataViewRoleForMappingWithReduction>categoriesMapping);

                if (hasCategoryRole)
                    return CategoricalDataViewTransformation.SelfCrossJoin;

                return CategoricalDataViewTransformation.Pivot;
            }
        }

        function shouldPivotMatrix(matrix: DataViewMatrix, dataViewMappings: DataViewMapping[]): boolean {
            if (!matrix|| ArrayExtensions.isUndefinedOrEmpty(dataViewMappings))
                return;

            var rowLevels = matrix.rows.levels;
            if (rowLevels.length < 1)
                return;

            var rows = matrix.rows.root.children;
            if (!rows || rows.length === 0)
                return;

            var rowRoles = rowLevels[0].sources[0].roles;

            for (var i = 0, len = dataViewMappings.length; i < len; i++) {
                var roleMappingMatrix = dataViewMappings[i].matrix;
                if (!roleMappingMatrix)
                    continue;

                if (!hasRolesFor(rowRoles, <DataViewRoleForMappingWithReduction>roleMappingMatrix.rows) &&
                    hasRolesFor(rowRoles, <DataViewRoleForMappingWithReduction>roleMappingMatrix.columns)) {
                    return true;
                }
            }
        }

        function hasRolesBind(roles: { [name: string]: boolean }, roleMapping: DataViewRoleBindMappingWithReduction): boolean {
            if (roles && roleMapping && roleMapping.bind)
                return roles[roleMapping.bind.to];
        }

        function hasRolesFor(roles: { [name: string]: boolean }, roleMapping: DataViewRoleForMappingWithReduction): boolean {
            if (roles && roleMapping && roleMapping.for)
                return roles[roleMapping.for.in];
        }

        function hasRolesGrouped(roles: { [name: string]: boolean }, roleMapping: DataViewGroupedRoleMapping): boolean {
            if (roles && roleMapping && roleMapping.group)
                return roles[roleMapping.group.by];
        }
    }
}
