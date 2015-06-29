//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data {
    import FederatedConceptualSchema = powerbi.data.FederatedConceptualSchema;
    import UnionExtensions = jsCommon.UnionExtensions;

    export interface CompileDataViewOptions {
        mappings: DataViewMapping[];
        queryDefn: SemanticQuery;
        queryProjections: QueryProjectionsByRole;
        schema: FederatedConceptualSchema;
        objectDescriptors?: DataViewObjectDescriptors;
        objectDefinitions?: DataViewObjectDefinitions;
    }

    export function compileDataView(options: CompileDataViewOptions): CompiledDataViewMapping[] {
        debug.assertValue(options, "options");

        var compiler = new DataViewMappingCompiler(options.queryDefn, options.queryProjections, options.schema);

        var result: CompiledDataViewMapping[] = [],
            mappings = options.mappings;
        for (var i = 0, len = mappings.length; i < len; i++)
            result.push(compiler.compileMapping(mappings[i], options.objectDescriptors, options.objectDefinitions));
        return result;
    }

    class DataViewMappingCompiler {
        private queryDefn: SemanticQuery;
        private queryProjections: QueryProjectionsByRole;
        private schema: FederatedConceptualSchema;

        constructor(queryDefn: SemanticQuery, queryProjections: QueryProjectionsByRole, schema: FederatedConceptualSchema) {
            debug.assertValue(queryDefn, 'queryDefn');
            debug.assertValue(queryProjections, 'queryProjections');
            debug.assertValue(schema, 'schema');

            this.queryDefn = queryDefn;
            this.queryProjections = queryProjections;
            this.schema = schema;
        }

        public compileMapping(
            mapping: DataViewMapping,
            objectDescriptors: DataViewObjectDescriptors,
            objectDefinitions: DataViewObjectDefinitions): CompiledDataViewMapping {
            debug.assertValue(mapping, 'mapping');
            debug.assertAnyValue(objectDescriptors, 'objectDescriptors');
            debug.assertAnyValue(objectDefinitions, 'objectDefinitions');

            var metadata = this.compileMetadata(objectDescriptors, objectDefinitions);
            var compiledMapping: CompiledDataViewMapping = {
                metadata: metadata
            };
            if (mapping.categorical)
                compiledMapping.categorical = this.compileCategorical(mapping.categorical);

            if (mapping.table)
                compiledMapping.table = this.compileTable(mapping.table);

            if (mapping.single)
                compiledMapping.single = this.compileSingle(mapping.single);

            if (mapping.tree)
                compiledMapping.tree = this.compileTree(mapping.tree);

            if (mapping.matrix)
                compiledMapping.matrix = this.compileMatrix(mapping.matrix);

            return compiledMapping;
        }

        private compileMetadata(objectDescriptors: DataViewObjectDescriptors, objectDefinitions: DataViewObjectDefinitions): CompiledDataViewMappingMetadata {
            debug.assertAnyValue(objectDescriptors, 'objectDescriptors');
            debug.assertAnyValue(objectDefinitions, 'objectDefinitions');
            
            var metadata: CompiledDataViewMappingMetadata = {};

            var objects = this.evaluateConstantMetadataObjects(objectDescriptors, objectDefinitions);
            if (objects)
                metadata.objects = objects;

            return metadata;
        }

        private evaluateConstantMetadataObjects(
            objectDescriptors: DataViewObjectDescriptors,
            objectDefinitions: DataViewObjectDefinitions): DataViewObjects {
            debug.assertAnyValue(objectDescriptors, 'objectDescriptors');
            debug.assertAnyValue(objectDefinitions, 'objectDefinitions');

            if (!objectDefinitions || !objectDescriptors)
                return;

            var objectsForAllSelectors = DataViewObjectEvaluationUtils.groupObjectsBySelector(objectDefinitions);
            if (objectsForAllSelectors.metadataOnce)
                return DataViewObjectEvaluationUtils.evaluateDataViewObjects(objectDescriptors, objectsForAllSelectors.metadataOnce.objects);
        }

        private compileCategorical(mapping: DataViewCategoricalMapping): CompiledDataViewCategoricalMapping {
            debug.assertValue(mapping, 'mapping');

            var compiled: CompiledDataViewCategoricalMapping = {};
            if (mapping.categories)
                compiled.categories = this.compileRoleMappingWithReduction(mapping.categories);

            var values = mapping.values;
            if (values) {
                var grouped = this.compileGrouped(<DataViewGroupedRoleMapping>values);
                var list = this.compileList(<DataViewListRoleMapping>values);
                var roleMapping = this.compileRoleMapping(<DataViewRoleMapping>values);

                compiled.values = UnionExtensions.mergeUnionType<CompiledDataViewRoleMapping | CompiledDataViewGroupedRoleMapping | CompiledDataViewListRoleMapping>(grouped, list, roleMapping);
            }

            return compiled;
        }

        private compileTable(mapping: DataViewTableMapping): CompiledDataViewTableMapping {
            debug.assertValue(mapping, 'mapping');

            var roleMapping = this.compileRoleMappingWithReduction(<DataViewRoleMappingWithReduction>mapping.rows);
            var listMapping = this.compileListWithReduction(<DataViewListRoleMappingWithReduction>mapping.rows);
            var rows = UnionExtensions.mergeUnionType<CompiledDataViewRoleMappingWithReduction | CompiledDataViewListRoleMappingWithReduction>(roleMapping, listMapping);

            return {
                rows: rows
            };
        }

        private compileSingle(mapping: DataViewSingleMapping): CompiledDataViewSingleMapping {
            debug.assertValue(mapping, 'mapping');

            var role = this.compileRole(mapping.role);
            return {
                role: role
            };
        }

        private compileTree(mapping: DataViewTreeMapping): CompiledDataViewTreeMapping {
            debug.assertValue(mapping, 'mapping');

            var compiled: CompiledDataViewTreeMapping = {};

            if (mapping.nodes)
                compiled.nodes = this.compileGroupingRoleMapping(mapping.nodes);

            if (mapping.values)
                compiled.values = this.compileValuesRoleMapping(mapping.values);

            return compiled;
        }

        private compileMatrix(mapping: DataViewMatrixMapping): CompiledDataViewMatrixMapping {
            debug.assertValue(mapping, 'mapping');

            var compiled: CompiledDataViewMatrixMapping = {};

            if (mapping.rows)
                compiled.rows = this.compileForWithReduction(mapping.rows);

            if (mapping.columns)
                compiled.columns = this.compileForWithReduction(mapping.columns);

            if (mapping.values)
                compiled.values = this.compileFor(mapping.values);

            return compiled;
        }

        private compileGroupingRoleMapping(mapping: DataViewGroupingRoleMapping): CompiledDataViewGroupingRoleMapping {
            debug.assertValue(mapping, 'mapping');

            if (!mapping.role)
                return;

            var role = this.compileRole(mapping.role);
            return {
                role: role
            };
        }

        private compileValuesRoleMapping(mapping: DataViewValuesRoleMapping): CompiledDataViewValuesRoleMapping {
            debug.assertValue(mapping, 'mapping');

            if (!mapping.roles)
                return;

            var roles = mapping.roles.map((item) => this.compileRole(item));
            return {
                roles: roles
            };
        }

        private compileListWithReduction(mapping: DataViewListRoleMappingWithReduction): CompiledDataViewListRoleMappingWithReduction {
            debug.assertValue(mapping, 'mapping');

            var compiled: CompiledDataViewListRoleMappingWithReduction = this.compileList(mapping);
            if (!compiled)
                return;

            if (mapping.dataReductionAlgorithm)
                compiled.dataReductionAlgorithm = this.compileReduction(mapping.dataReductionAlgorithm);

            return compiled;
        }

        private compileList(mapping: DataViewListRoleMapping): CompiledDataViewListRoleMapping {
            debug.assertValue(mapping, 'mapping');

            if (!mapping.select)
                return;
            
            var select = mapping.select.map((item) => this.compileRoleMapping(item));
            return {
                select: select
            };
        }

        private compileGrouped(mapping: DataViewGroupedRoleMapping): CompiledDataViewGroupedRoleMapping {
            debug.assertValue(mapping, 'mapping');

            if (!mapping.group)
                return;

            var byItems = this.compileRole(mapping.group.by);
            var select = mapping.group.select.map((item) => this.compileRoleMapping(item));
            var compiled: CompiledDataViewGroupedRoleMapping = {
                group: {
                    by: byItems,
                    select: select
                }
            };

            if (mapping.group.dataReductionAlgorithm)
                compiled.group.dataReductionAlgorithm = this.compileReduction(mapping.group.dataReductionAlgorithm);

            return compiled;
        }

        private compileRoleMapping(mapping: DataViewRoleMapping): CompiledDataViewRoleMapping {
            debug.assertValue(mapping, 'mapping');

            var compiledBind = this.compileBind(<DataViewRoleBindMapping>mapping);
            var compiledFor = this.compileFor(<DataViewRoleForMapping>mapping);

            return UnionExtensions.mergeUnionType<CompiledDataViewRoleMapping>(compiledBind, compiledFor);
        }

        private compileRoleMappingWithReduction(mapping: DataViewRoleMappingWithReduction): CompiledDataViewRoleMappingWithReduction {
            debug.assertValue(mapping, 'mapping');

            var compiled: CompiledDataViewRoleMappingWithReduction = this.compileRoleMapping(mapping);
            if (!compiled)
                return;

            if (mapping.dataReductionAlgorithm)
                compiled.dataReductionAlgorithm = this.compileReduction(mapping.dataReductionAlgorithm);

            return compiled;
        }

        private compileBind(mapping: DataViewRoleBindMapping): CompiledDataViewRoleBindMapping {
            debug.assertValue(mapping, 'mapping');

            if (!mapping.bind)
                return;

            var items = this.compileRole(mapping.bind.to);
            return {
                bind: {
                    to: items
                }
            };
        }

        private compileForWithReduction(mapping: DataViewRoleForMappingWithReduction): CompiledDataViewRoleForMappingWithReduction {
            debug.assertValue(mapping, 'mapping');

            var compiled: CompiledDataViewRoleForMappingWithReduction = this.compileFor(mapping);
            if (!compiled)
                return;

            if (mapping.dataReductionAlgorithm)
                compiled.dataReductionAlgorithm = this.compileReduction(mapping.dataReductionAlgorithm);

            return compiled;
        }

        private compileFor(mapping: DataViewRoleForMapping): CompiledDataViewRoleForMapping {
            debug.assertValue(mapping, 'mapping');

            if (!mapping.for)
                return;

            var items = this.compileRole(mapping.for.in);
            return {
                for: {
                    in: items
                }
            };
        }

        private compileRole(role: string): CompiledDataViewRole {
            debug.assertValue(role, 'role');

            var items: CompiledDataViewRoleItem[];
            var selects = this.queryDefn.select();
            var projections = this.queryProjections[role];
            if (!jsCommon.ArrayExtensions.isUndefinedOrEmpty(projections)) {
                items = projections.map((projection) => this.createDataViewRoleItem(selects.withName(projection.queryRef)));
            }

            return {
                role: role,
                items: items
            };
        }

        private createDataViewRoleItem(select: NamedSQExpr): CompiledDataViewRoleItem {
            debug.assertValue(select, 'select');

            var item: CompiledDataViewRoleItem = {};

            var metadata = select.expr.getMetadata(this.schema);
            if (metadata)
                item.type = metadata.type;

            return item;
        }

        private compileReduction(algorithm: ReductionAlgorithm): ReductionAlgorithm {
            debug.assertAnyValue(algorithm, 'algorithm');

            if (!algorithm)
                return;

            var compiled: ReductionAlgorithm = {};
            if (algorithm.top) {
                compiled.top = {};

                if (algorithm.top.count)
                    compiled.top.count = algorithm.top.count;
            }

            if (algorithm.bottom) {
                compiled.bottom = {};

                if (algorithm.bottom.count)
                    compiled.bottom.count = algorithm.bottom.count;
            }

            if (algorithm.sample) {
                compiled.sample= {};

                if (algorithm.sample.count)
                    compiled.sample.count = algorithm.sample.count;
            }

            if (algorithm.window) {
                compiled.window= {};

                if (algorithm.window.count)
                    compiled.window.count = algorithm.window.count;
            }

            return compiled;
        }
    }
} 