//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data.dsr {
    export interface MergedMappings {
        mapping: CompiledDataViewMapping;
        splits?: DataViewSplitTransform[];
    }

    export function mergeMappings(
        mappings: CompiledDataViewMapping[],
        projections: QueryProjectionsByRole,
        indicesByName: NameToIndex): MergedMappings {
        debug.assertValue(mappings, 'mappings');

        var mappingsLength = mappings.length;
        if (mappingsLength === 1)
            return { mapping: mappings[0] };

        var mapping: CompiledDataViewMapping,
            splits: DataViewSplitTransform[] = [];

        for (var i = 0; i < mappingsLength; i++) {
            var currentMapping = mappings[i];

            // NOTE: merging is only currently implemented against categorical DataView, because this is the only
            // thing that currently needs it. In the future, can implement more surface area here as needed.
            if (!currentMapping.categorical)
                return;

            if (i === 0) {
                mapping = {
                    metadata: currentMapping.metadata,
                    categorical: {},
                };
            }
            Impl.mergeCategorical(mapping.categorical, currentMapping.categorical);

            splits.push(Impl.createSplit(projections, indicesByName, currentMapping.categorical));
        }

        return {
            mapping: mapping,
            splits: splits,
        };
    }

    module Impl {
        export function mergeCategorical(target: CompiledDataViewCategoricalMapping, source: CompiledDataViewCategoricalMapping): void {
            if (source.categories) {
                if (target.categories) {
                    debug.assert(jsCommon.JsonComparer.equals(target.categories, source.categories), 'target.categories & source.categories must match when multiple mappings are used.');
                }
                else {
                    target.categories = source.categories;
                }
            }

            if (source.values) {
                var targetValues = target.values;
                if (!targetValues)
                    targetValues = target.values = <any>{};

                var sourceValues = source.values,
                    sourceValuesGrouping = (<CompiledDataViewGroupedRoleMapping>sourceValues).group;

                pushRolesToTargetList(<CompiledDataViewListRoleMapping>targetValues, <CompiledDataViewRoleBindMapping | CompiledDataViewRoleForMapping>sourceValues);
                pushArrayRolesToTargetList(<CompiledDataViewListRoleMapping>targetValues,(<CompiledDataViewListRoleMapping>sourceValues).select);
                if (sourceValuesGrouping) {
                    var targetValuesGrouping = (<CompiledDataViewGroupedRoleMapping>target.values).group;
                    if (targetValuesGrouping) {
                        pushArrayRolesToTargetList(targetValuesGrouping, sourceValuesGrouping.select);
                    }
                    else {
                        (<CompiledDataViewGroupedRoleMapping>target.values).group = {
                            select: sourceValuesGrouping.select.concat([]),
                            by: sourceValuesGrouping.by,
                            dataReductionAlgorithm: sourceValuesGrouping.dataReductionAlgorithm,
                        };
                    }
                }
            }
        }

        function pushRolesToTargetList(targetValues: CompiledDataViewListRoleMapping, sourceValues: CompiledDataViewRoleMapping): void {
            if ((<CompiledDataViewRoleBindMapping>sourceValues).bind || (<CompiledDataViewRoleForMapping>sourceValues).for) {
                if (!targetValues.select)
                    targetValues.select = [];
                targetValues.select.push(sourceValues);
            }
        }

        function pushArrayRolesToTargetList(targetValues: CompiledDataViewListRoleMapping, select: CompiledDataViewRoleMapping[]): void {
            if (!select)
                return;

            if (!targetValues.select)
                targetValues.select = [];
            Array.prototype.push.apply(targetValues.select, select);
        }

        export function createSplit(
            projections: QueryProjectionsByRole,
            indicesByName: NameToIndex,
            mapping: CompiledDataViewCategoricalMapping): DataViewSplitTransform {
            var result: DataViewSplitTransform = { selects: {} };

            if (mapping.categories) {
                var categories = mapping.categories;

                splitIfAnyBind(result, projections, indicesByName, <CompiledDataViewRoleBindMappingWithReduction>categories);
                splitIfAnyFor(result, projections, indicesByName, <CompiledDataViewRoleForMappingWithReduction>categories);
            }

            if (mapping.values) {
                var valuesGrouped = <CompiledDataViewGroupedRoleMapping>mapping.values;
                if (valuesGrouped.group) {
                    var valueGroupingProjections = projections[valuesGrouped.group.by.role];
                    splitIfAny(result, valueGroupingProjections, indicesByName);

                    for (var i = 0, len = valuesGrouped.group.select.length; i < len; i++)
                        splitIfAnyRole(result, projections, indicesByName, valuesGrouped.group.select[i]);
                }
                else {
                    splitIfAnyRole(result, projections, indicesByName, <CompiledDataViewRoleForMapping | CompiledDataViewRoleBindMapping>mapping.values);
                    splitIfAnySelect(result, projections, indicesByName, <CompiledDataViewListRoleMapping>mapping.values);
                }
            }

            return result;
        }

        function splitIfAnyBind(
            split: DataViewSplitTransform,
            projections: QueryProjectionsByRole,
            indicesByName: NameToIndex,
            bindMapping: CompiledDataViewRoleBindMapping): void {
            debug.assertValue(split, 'split');
            debug.assertValue(projections, 'projections');

            if (bindMapping && bindMapping.bind)
                return splitIfAny(split, projections[bindMapping.bind.to.role], indicesByName);
        }

        function splitIfAnyFor(
            split: DataViewSplitTransform,
            projections: QueryProjectionsByRole,
            indicesByName: NameToIndex,
            forMapping: CompiledDataViewRoleForMapping): void {
            debug.assertValue(split, 'split');
            debug.assertValue(projections, 'projections');

            if (forMapping && forMapping.for)
                return splitIfAny(split, projections[forMapping.for.in.role], indicesByName);
        }

        function splitIfAnySelect(
            split: DataViewSplitTransform,
            projections: QueryProjectionsByRole,
            indicesByName: NameToIndex,
            selectMapping: CompiledDataViewListRoleMapping): void {
            debug.assertValue(split, 'split');
            debug.assertValue(projections, 'projections');

            if (selectMapping && selectMapping.select) {
                for (var i = 0, len = selectMapping.select.length; i < len; i++)
                    splitIfAnyRole(split, projections, indicesByName, selectMapping.select[i]);
            }
        }

        function splitIfAnyRole(
            split: DataViewSplitTransform,
            projections: QueryProjectionsByRole,
            indicesByName: NameToIndex,
            mapping: CompiledDataViewRoleForMapping | CompiledDataViewRoleBindMapping): void {
            debug.assertValue(split, 'split');
            debug.assertValue(projections, 'projections');

            splitIfAnyBind(split, projections, indicesByName, <CompiledDataViewRoleBindMapping>mapping);
            splitIfAnyFor(split, projections, indicesByName, <CompiledDataViewRoleForMapping>mapping);
        }

        function splitIfAny(
            split: DataViewSplitTransform,
            projections: QueryProjection[],
            indicesByName: NameToIndex): void {
            debug.assertValue(split, 'split');
            debug.assertValue(indicesByName, 'indicesByName');
            if (!projections)
                return;

            var isAlreadyIncluded: Array<boolean> = [];

            for (var i = 0, len = projections.length; i < len; i++) {
                var queryReference = projections[i].queryRef,
                    queryIndex = indicesByName[queryReference];

                // indices should be a unique set of query references
                if (isAlreadyIncluded[queryIndex])
                    continue;

                split.selects[queryIndex] = true;
                isAlreadyIncluded[queryIndex] = true;
            }
        }
    }
}