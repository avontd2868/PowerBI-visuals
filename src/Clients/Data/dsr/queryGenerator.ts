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
    import SemanticQueryDataShapeCommand = powerbi.data.SemanticQueryDataShapeCommand;

    export interface IQueryGenerator {
        run(options: QueryGeneratorOptions): QueryGeneratorResult;
    }

    export interface ISemanticQuerySerializer {
        serializeQuery(query: SemanticQuery): QueryDefinition;
        serializeFilter(filter: SemanticFilter): FilterDefinition;
    }

    export function createQueryGenerator(): IQueryGenerator {
        return new QueryGenerator(services.SemanticQuerySerializer);
    }

    export interface QueryGeneratorOptions {
        query: SemanticQuery;
        mappings: CompiledDataViewMapping[];
        projections: QueryProjectionsByRole;
        highlightFilter?: SemanticFilter;
        dataVolume?: number;
        restartToken?: RestartToken;
    }

    export interface QueryGeneratorResult {
        command: SemanticQueryDataShapeCommand;
        splits?: DataViewSplitTransform[];
    }

    export interface NameToIndex {
        [name: string]: number;
    }

    class QueryGeneratorConstants {
        public static DefaultDataVolume: number = 3;
    }

    class QueryGenerator {
        private serializer: ISemanticQuerySerializer;

        public constructor(serializer: ISemanticQuerySerializer) {
            debug.assertValue(serializer, 'serializer');

            this.serializer = serializer;
        }

        public run(options: QueryGeneratorOptions): QueryGeneratorResult {
            debug.assertValue(options, 'options');

            var query = options.query,
                mappings = options.mappings,
                highlightFilter = options.highlightFilter;

            var indicesByName = Impl.getIndicesByName(query);
            var mergedQueries = mergeMappings(mappings, options.projections, indicesByName);

            // Provide a default data volume if none was specified.
            var dataVolume = options.dataVolume;
            if (!dataVolume)
                dataVolume = QueryGeneratorConstants.DefaultDataVolume;

            var dataShapeBinding = generateDataShapeBinding(
                this.serializer,
                options.projections,
                indicesByName,
                mergedQueries.mapping,
                highlightFilter,
                dataVolume,
                options.restartToken);

            var queryDefinition = this.serializer.serializeQuery(query);

            return {
                command: {
                    Query: queryDefinition,
                    Binding: dataShapeBinding,
                },
                splits: mergedQueries.splits,
            };
        }
    }

    // Exported for testability
    export function generateDataShapeBinding(
        serializer: ISemanticQuerySerializer,
        projections: QueryProjectionsByRole,
        indicesByName: NameToIndex,
        mapping: CompiledDataViewMapping,
        highlightFilter?: SemanticFilter,
        dataVolume?: number,
        restartToken?: RestartToken): DataShapeBinding {
        var binding: DataShapeBinding = Impl.generateBaseDataShapeBinding(projections, indicesByName, mapping, dataVolume);        

        if (binding) {
            binding.Version = DataShapeBindingVersions.Version1;

            if (restartToken && binding.DataReduction && binding.DataReduction.Primary && binding.DataReduction.Primary.Window) {
                binding.DataReduction.Primary.Window.RestartTokens = restartToken;
            }

            if (highlightFilter)
                binding.Highlights = [serializer.serializeFilter(highlightFilter)];
        }

        return binding;
    }

    module Impl {
        export function generateBaseDataShapeBinding(
            projections: QueryProjectionsByRole,
            indicesByName: NameToIndex,
            mapping: CompiledDataViewMapping,
            dataVolume?: number): DataShapeBinding {
            debug.assertValue(projections, 'projections');
            debug.assertValue(indicesByName, 'indicesByName');
            debug.assertValue(mapping, 'mapping');

            if (mapping.categorical)
                return forCategorical(projections, indicesByName, mapping.categorical, dataVolume);

            if (mapping.table)
                return forTable(projections, indicesByName, mapping.table, dataVolume);

            if (mapping.matrix)
                return forMatrix(projections, indicesByName, mapping.matrix, dataVolume);
        }

        function forCategorical(
            projections: QueryProjectionsByRole,
            indicesByName: NameToIndex,
            mapping: CompiledDataViewCategoricalMapping,
            dataVolume?: number): DataShapeBinding {
            debug.assertValue(projections, 'projections');
            debug.assertValue(indicesByName, 'indicesByName');
            debug.assertValue(mapping, 'mapping');

            var result: DataShapeBinding = {
                Primary: {
                    Groupings: [{ Projections: [] }],
                }
            };

            var primaryDataReduction: DataShapeBindingDataReductionAlgorithm,
                secondaryDataReduction: DataShapeBindingDataReductionAlgorithm;

            var primaryProjections = result.Primary.Groupings[0].Projections,
                hasCategories: boolean = false;
            if (mapping.categories) {
                var categories = mapping.categories;

                pushIfAnyBind(primaryProjections, projections, indicesByName, <CompiledDataViewRoleBindMappingWithReduction>categories);
                pushIfAnyFor(primaryProjections, projections, indicesByName, <CompiledDataViewRoleForMappingWithReduction>categories);

                hasCategories = primaryProjections.length > 0;

                if (hasCategories)
                    primaryDataReduction = buildDataReductionAlgorithm(categories.dataReductionAlgorithm);
            }

            if (mapping.values) {
                var valuesGrouped = <CompiledDataViewGroupedRoleMapping>mapping.values;
                if (valuesGrouped.group) {
                    var valueGroupingProjections = projections[valuesGrouped.group.by.role];
                    if (valueGroupingProjections && valueGroupingProjections.length > 0) {
                        var visualGroupingTarget: number[];
                        if (hasCategories && !containsAllProjections(valueGroupingProjections, primaryProjections, indicesByName)) {
                            result.Secondary = {
                                Groupings: [{ Projections: [] }]
                            };
                            visualGroupingTarget = result.Secondary.Groupings[0].Projections;
                            secondaryDataReduction = buildDataReductionAlgorithm(valuesGrouped.group.dataReductionAlgorithm);
                        }
                        else {
                            // NOTE: pivot the valueGroupings from the Secondary to the Primary when there are no categories.
                            // This gives more performant queries in the backend.  Note that we invert this pivot in the DataViewTransform.
                            visualGroupingTarget = primaryProjections;
                            primaryDataReduction = buildDataReductionAlgorithm(valuesGrouped.group.dataReductionAlgorithm);
                        }

                        pushIfAny(visualGroupingTarget, valueGroupingProjections, indicesByName);
                    }

                    for (var i = 0, len = valuesGrouped.group.select.length; i < len; i++)
                        pushIfAnyRole(primaryProjections, projections, indicesByName, valuesGrouped.group.select[i]);

                    var valuesList = <CompiledDataViewListRoleMapping>mapping.values;
                    if (valuesList.select) {
                        var valuesListProjections: number[] = [];
                        pushIfAnyRole(primaryProjections, projections, indicesByName, <CompiledDataViewRoleForMapping | CompiledDataViewRoleBindMapping>mapping.values, valuesListProjections);
                        pushIfAnySelect(primaryProjections, projections, indicesByName, <CompiledDataViewListRoleMapping>mapping.values, valuesListProjections);

                        if (result.Secondary)
                            result.Secondary.Groupings[0].SuppressedProjections = valuesListProjections;
                    }
                }
                else {
                    pushIfAnyRole(primaryProjections, projections, indicesByName, <CompiledDataViewRoleForMapping | CompiledDataViewRoleBindMapping>mapping.values);
                    pushIfAnySelect(primaryProjections, projections, indicesByName, <CompiledDataViewListRoleMapping>mapping.values);
                }
            }

            buildDataReduction(result, dataVolume, primaryDataReduction, secondaryDataReduction);

            return result;
        }

        function forTable(projections: QueryProjectionsByRole, indicesByName: NameToIndex, mapping: CompiledDataViewTableMapping, dataVolume?: number): DataShapeBinding {
            debug.assertValue(projections, 'projections');
            debug.assertValue(indicesByName, 'indicesByName');
            debug.assertValue(mapping, 'mapping');

            var rows = mapping.rows;
            var primaryProjections: number[] = [];

            pushIfAnyRole(primaryProjections, projections, indicesByName, <CompiledDataViewRoleForMapping | CompiledDataViewRoleBindMapping>rows);
            pushIfAnySelect(primaryProjections, projections, indicesByName, <CompiledDataViewListRoleMapping>rows);

            if (primaryProjections.length > 0) {
                var result: DataShapeBinding = {
                    Primary: {
                        Groupings: [{ Projections: primaryProjections }],
                    }
                };

                var hasRowsRoleMapping = <CompiledDataViewRoleForMapping>rows;
                if (hasRowsRoleMapping)
                    setSubtotals(result.Primary.Groupings, hasRowsRoleMapping);

                var hasReductionAlgorithm = <HasReductionAlgorithm>rows;
                if (hasReductionAlgorithm) {
                    var reductionAlgorithm = buildDataReductionAlgorithm(hasReductionAlgorithm.dataReductionAlgorithm);
                    buildDataReduction(result, dataVolume, reductionAlgorithm);
                }

                return result;
            }
        }

        function forMatrix(projections: QueryProjectionsByRole, indicesByName: NameToIndex, mapping: CompiledDataViewMatrixMapping, dataVolume?: number): DataShapeBinding {
            debug.assertValue(projections, 'projections');
            debug.assertValue(indicesByName, 'indicesByName');
            debug.assertValue(mapping, 'mapping');

            var result: DataShapeBinding = {
                Primary: {
                    Groupings: []
                }
            };

            var primaryDataReduction: DataShapeBindingDataReductionAlgorithm,
                secondaryDataReduction: DataShapeBindingDataReductionAlgorithm;

            var primaryGroupings: DataShapeBindingAxisGrouping[] = result.Primary.Groupings,
                hasRowGroups: boolean = false,
                hasColumnGroups: boolean = false;

            if (mapping.rows) {
                pushIfAnyForWithSeparateGroup(primaryGroupings, projections, indicesByName, <CompiledDataViewRoleForMappingWithReduction>mapping.rows);
                hasRowGroups = primaryGroupings.length > 0;

                if (hasRowGroups) {
                    primaryDataReduction = buildDataReductionAlgorithm(mapping.rows.dataReductionAlgorithm);
                    setSubtotals(primaryGroupings, mapping.rows);
                }
            }

            if (mapping.columns) {
                var groupings: DataShapeBindingAxisGrouping[] = [];
                pushIfAnyForWithSeparateGroup(groupings, projections, indicesByName, <CompiledDataViewRoleForMappingWithReduction>mapping.columns);
                hasColumnGroups = groupings.length > 0;

                if (hasColumnGroups) {
                    setSubtotals(groupings, mapping.columns);

                    if (!hasRowGroups) {
                        // No primary groups, let's relocate secondary groups into the primary hierarchy and pivot hierarchies in the transformation phase
                        result.Primary.Groupings = groupings;
                        primaryDataReduction = buildDataReductionAlgorithm(mapping.columns.dataReductionAlgorithm);
                    }
                    else {
                        // Only create secondary grouping if we have groups to put there
                        result.Secondary = { Groupings: groupings };
                        secondaryDataReduction = buildDataReductionAlgorithm(mapping.columns.dataReductionAlgorithm);
                    }
                }
            }

            if (mapping.values) {
                // Get the array to store the projections.
                // If we have column groups, we can put the measures into the innermost secondary projection,
                // if there is no place for the secondary projections yet, let's create a temp array;
                // after collecting the projections, we'll check if we have anything to put there (otherewise we may end up with empty secondary projections which is an invalid input for DSQT)
                var targetGroupings: DataShapeBindingAxisGrouping[] = hasColumnGroups ?
                    (result.Secondary && result.Secondary.Groupings ? result.Secondary.Groupings : []) :
                    primaryGroupings;

                groupCount = targetGroupings.length;

                // We can put the measures into the innermost group, but if there isn't any, let's add one
                if (groupCount === 0)
                    var groupCount = targetGroupings.push({ Projections: [] });

                var innermostGroupingProjections = targetGroupings[groupCount - 1].Projections;
                var projectionsPushed = pushIfAnyRole(innermostGroupingProjections, projections, indicesByName, <CompiledDataViewRoleForMapping | CompiledDataViewRoleBindMapping > mapping.values);
                if (projectionsPushed > 0 && hasColumnGroups && !result.Secondary)
                    result.Secondary = { Groupings: targetGroupings };
            }

            buildDataReduction(result, dataVolume, primaryDataReduction, secondaryDataReduction);

            return result;
        }

        function convertSubtotalType(dataViewRoleForMapping: CompiledDataViewRoleForMapping): SubtotalType {
            switch (dataViewRoleForMapping.for.in.subtotalType) {
                case CompiledSubtotalType.Before:
                    return SubtotalType.Before;

                case CompiledSubtotalType.After:
                    return SubtotalType.After;

                case CompiledSubtotalType.None:
                    return SubtotalType.None;
            }
        }

        function setSubtotals(groupings: DataShapeBindingAxisGrouping[], dataViewRoleForMapping: CompiledDataViewRoleForMapping): void {
            var subtotal = convertSubtotalType(dataViewRoleForMapping);
            if (subtotal != null) {
                for (var i = 0, ilen = groupings.length; i < ilen; i++)
                    groupings[i].Subtotal = subtotal;
            }
        }

        export function getIndicesByName(query: SemanticQuery): NameToIndex {
            debug.assertValue(query, 'query');

            var result: NameToIndex = {},
                select = query.select();

            for (var i = 0, len = select.length; i < len; i++)
                result[select[i].name] = i;

            return result;
        }

        function containsAllProjections(
            projectionsToAdd: QueryProjection[],
            existingProjections: number[],
            indicesByName: NameToIndex): boolean {
            for (var i = 0, len = projectionsToAdd.length; i < len; i++) {
                var queryReference = projectionsToAdd[i].queryRef,
                    queryIndex = indicesByName[queryReference];

                // indices should be a unique set of query references
                if (existingProjections.indexOf(queryIndex) < 0)
                    return false;
            }

            return true;
        }

        function pushIfAnyRole(
            indices: number[],
            projections: QueryProjectionsByRole,
            indicesByName: NameToIndex,
            mapping: CompiledDataViewRoleForMapping | CompiledDataViewRoleBindMapping,
            addedProjectionIndices?: number[]): number {
            debug.assertValue(indices, 'indices');
            debug.assertValue(projections, 'projections');

            return pushIfAnyBind(indices, projections, indicesByName, <CompiledDataViewRoleBindMapping>mapping, addedProjectionIndices)
                + pushIfAnyFor(indices, projections, indicesByName, <CompiledDataViewRoleForMapping>mapping, addedProjectionIndices);
        }

        function pushIfAnyBind(
            indices: number[],
            projections: QueryProjectionsByRole,
            indicesByName: NameToIndex,
            bindMapping: CompiledDataViewRoleBindMapping,
            addedProjectionIndices?: number[]): number {
            debug.assertValue(indices, 'indices');
            debug.assertValue(projections, 'projections');

            if (bindMapping && bindMapping.bind)
                return pushIfAny(indices, projections[bindMapping.bind.to.role], indicesByName, addedProjectionIndices);

            return 0;
        }

        function pushIfAnyFor(
            indices: number[],
            projections: QueryProjectionsByRole,
            indicesByName: NameToIndex,
            forMapping: CompiledDataViewRoleForMapping,
            addedProjectionIndices?: number[]): number {
            debug.assertValue(indices, 'indices');
            debug.assertValue(projections, 'projections');

            if (forMapping && forMapping.for)
                return pushIfAny(indices, projections[forMapping.for.in.role], indicesByName, addedProjectionIndices);

            return 0;
        }

        function pushIfAnySelect(
            indices: number[],
            projections: QueryProjectionsByRole,
            indicesByName: NameToIndex,
            selectMapping: CompiledDataViewListRoleMapping,
            addedProjectionIndices?: number[]): number {
            debug.assertValue(indices, 'indices');
            debug.assertValue(projections, 'projections');

            if (selectMapping && selectMapping.select) {
                var result: number = 0;

                for (var i = 0, len = selectMapping.select.length; i < len; i++)
                    result += pushIfAnyRole(indices, projections, indicesByName, selectMapping.select[i], addedProjectionIndices);

                return result;
            }

            return 0;
        }

        function pushIfAny(
            indices: number[],
            projections: QueryProjection[],
            indicesByName: NameToIndex,
            addedProjectionIndices?: number[]): number {
            debug.assertValue(indices, 'indices');
            debug.assertValue(indicesByName, 'indicesByName');
            if (!projections)
                return 0;

            for (var i = 0, len = projections.length; i < len; i++) {
                var queryReference = projections[i].queryRef,
                    queryIndex = indicesByName[queryReference];

                // indices should be a unique set of query references
                if (indices.indexOf(queryIndex) >= 0)
                    continue;

                indices.push(queryIndex);
                if (addedProjectionIndices)
                    addedProjectionIndices.push(queryIndex);
            }

            return indices.length;
        }

        function pushIfAnyForWithSeparateGroup(
            groupings: DataShapeBindingAxisGrouping[],
            projections: QueryProjectionsByRole,
            indicesByName: NameToIndex,
            forMapping: CompiledDataViewRoleForMapping): void {
            debug.assertValue(groupings, 'groupings');
            debug.assertValue(projections, 'projections');
            debug.assertValue(indicesByName, 'indicesByName');

            if (!forMapping || !forMapping.for)
                return;

            var items = projections[forMapping.for.in.role];
            if (items) {
                for (var i = 0, len = items.length; i < len; i++) {
                    var queryReference = items[i].queryRef,
                        queryIndex = indicesByName[queryReference];

                    if (!groupings.some(g => g.Projections.indexOf(queryIndex) >= 0))
                        groupings.push({ Projections: [queryIndex] });
                }
            }
        }

        function buildDataReduction(
            binding: DataShapeBinding,
            dataVolume: number,
            primary: DataShapeBindingDataReductionAlgorithm,
            secondary?: DataShapeBindingDataReductionAlgorithm): void {
            if (!primary && !secondary)
                return;

            binding.DataReduction = {};
            if (dataVolume)
                binding.DataReduction.DataVolume = dataVolume;

            if (primary)
                binding.DataReduction.Primary = primary;

            if (secondary)
                binding.DataReduction.Secondary = secondary;
        }

        function buildDataReductionAlgorithm(reduction: ReductionAlgorithm): DataShapeBindingDataReductionAlgorithm {
            if (!reduction)
                return;

            var result: DataShapeBindingDataReductionAlgorithm;
            if (reduction.top) {
                result = {
                    Top: {}
                };

                if (reduction.top.count)
                    result.Top.Count = reduction.top.count;
            }

            if (reduction.bottom) {
                result = {
                    Bottom: {}
                };

                if (reduction.bottom.count)
                    result.Bottom.Count = reduction.bottom.count;
            }

            if (reduction.sample) {
                result = {
                    Sample: {}
                };

                if (reduction.sample.count)
                    result.Sample.Count = reduction.sample.count;
            }

            if (reduction.window) {
                result = {
                    Window: {}
                };

                if (reduction.window.count)
                    result.Window.Count = reduction.window.count;
            }

            return result;
        }
    }
}