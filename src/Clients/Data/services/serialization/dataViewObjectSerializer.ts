//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data.services {
    export module wireContracts {
        export interface DataViewObjectDefinitions {
            [objectName: string]: DataViewObjectDefinition[];
        }

        export interface DataViewObjectDefinition {
            selector?: Selector;
            properties: DataViewObjectPropertyDefinitions;
        }

        export interface Selector {
            data?: DataRepetitionSelector[];
            metadata?: string;
            id?: string;
        }

        export interface DataRepetitionSelector {
            scopeId?: data.QueryExpressionContainer;
            wildcard?: data.QueryExpressionContainer[];
        }

        export interface DataViewObjectPropertyDefinitions {
            [name: string]: DataViewObjectPropertyDefinition | {}[];
        }

        export interface Expr {
            expr: data.QueryExpressionContainer;
        }

        export interface DataViewObjectPropertyDefinition {
            expr?: data.QueryExpressionContainer;
            fill?: FillDefinition;
            fillRule?: FillRuleDefinition;
            filter?: FilterDefinition;
        }

        export type FillDefinition = FillGeneric < Expr>;
        export type FillRuleDefinition = FillRuleGeneric < Expr, Expr>;
    }

    export module DataViewObjectSerializer {
        interface ParsedTypeDescriptor {
            value?: ValueType;
            structural?: StructuralTypeDescriptor;
        }

        export function deserializeObjects(input: wireContracts.DataViewObjectDefinitions, descriptors: DataViewObjectDescriptors): DataViewObjectDefinitions {
            debug.assertAnyValue(input, 'input');

            if (!input || !descriptors)
                return;

            var result: DataViewObjectDefinitions = {};

            for (var objectName in input) {
                var descriptor = descriptors[objectName];
                if (!descriptor)
                    continue;

                var objectEntries = input[objectName],
                    resultEntries: DataViewObjectDefinition[] = result[objectName] = [];

                for (var i = 0, len = objectEntries.length; i < len; i++)
                    resultEntries.push(deserializeObject(objectEntries[i], descriptor));
            }

            return result;
        }

        function deserializeObject(input: wireContracts.DataViewObjectDefinition, descriptor: DataViewObjectDescriptor): DataViewObjectDefinition {
            debug.assertAnyValue(input, 'input');

            if (!input)
                return;

            var result: DataViewObjectDefinition = {
                properties: deserializeObjectProperties(input.properties, descriptor.properties),
            };

            var selector = deserializeSelector(input.selector);
            if (selector)
                result.selector = selector;

            return result;
        }

        function deserializeSelector(input: wireContracts.Selector): Selector {
            debug.assertAnyValue(input, 'input');

            if (!input)
                return;

            var result: Selector = {};

            if (input.data)
                result.data = input.data.map(v => deserializeDataRepetitionSelector(v));
            if (input.metadata)
                result.metadata = input.metadata;
            if (input.id)
                result.id = input.id;

            return result;
        }

        function deserializeDataRepetitionSelector(input: wireContracts.DataRepetitionSelector): DataRepetitionSelector {
            debug.assertValue(input, 'input');

            if (input.scopeId)
                return createDataViewScopeIdentity(SemanticQuerySerializer.deserializeExpr(input.scopeId));
            if (input.wildcard)
                return DataViewScopeWildcard.fromExprs(input.wildcard.map(SemanticQuerySerializer.deserializeExpr));
        }

        function deserializeObjectProperties(input: wireContracts.DataViewObjectPropertyDefinitions, descriptors: DataViewObjectPropertyDescriptors): DataViewObjectPropertyDefinitions {
            debug.assertAnyValue(input, 'input');

            if (!input)
                return;

            var result: DataViewObjectPropertyDefinitions = {};

            for (var propertyName in input) {
                var propertyValue = deserializeObjectProperty(<DataViewObjectPropertyDefinition>input[propertyName], descriptors[propertyName]);

                // TODO: Trace/telemetry when parse fails.
                if (propertyValue !== undefined)
                    result[propertyName] = propertyValue;
            }

            return result;
        }

        function deserializeObjectProperty(input: wireContracts.DataViewObjectPropertyDefinition, descriptor: DataViewObjectPropertyDescriptor): DataViewObjectPropertyDefinition {
            debug.assertAnyValue(input, 'input');
            debug.assertAnyValue(descriptor, 'descriptor');

            if (!descriptor)
                return;

            var type = parseType(descriptor.type);
            if (type.value)
                return deserializePropertyValueType(<wireContracts.Expr>input, type.value);

            return deserializePropertyStructuralType(input, type.structural);
        }

        function deserializePropertyValueType(input: wireContracts.Expr, type: ValueType): SQExpr {
            debug.assertValue(type, 'type');

            if (type.primitiveType !== undefined) {
                if (input.expr)
                    return SemanticQuerySerializer.deserializeExpr(input.expr);
            }
        }

        function deserializePropertyStructuralType(input: wireContracts.DataViewObjectPropertyDefinition, type: StructuralTypeDescriptor): DataViewObjectPropertyDefinition {
            debug.assertValue(type, 'type');

            if (type.fill && type.fill.solid && type.fill.solid.color && input) {
                var fillDefn = (<wireContracts.FillDefinition>input);
                return {
                    solid: { color: deserializePropertyValueType(fillDefn.solid.color, ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text)) }
                };
            }

            if (type.fillRule) {
                var fillRuleDefinition = (<wireContracts.FillRuleDefinition>input);
                var deserializedFillRuleDefinition = getParsedFillRule(fillRuleDefinition, deserializePropertyValueType);

                if (deserializedFillRuleDefinition) {
                    return deserializedFillRuleDefinition;
                }
            }

            if (type.filter && input && input.filter)
                return SemanticQuerySerializer.deserializeFilter(input.filter);

            return <any>input;
        }

        export function serializeObjects(contract: DataViewObjectDefinitions, descriptors: DataViewObjectDescriptors): wireContracts.DataViewObjectDefinitions {
            debug.assertAnyValue(contract, 'contract');
            debug.assertAnyValue(descriptors, 'descriptors');

            if (!contract || !descriptors)
                return;

            var result: wireContracts.DataViewObjectDefinitions = {};

            for (var objectName in contract) {
                var descriptor = descriptors[objectName];

                // TODO: Trace/telemetry when serialize fails.
                if (!descriptor)
                    continue;

                var objectEntries = contract[objectName],
                    resultEntries: wireContracts.DataViewObjectDefinition[] = result[objectName] = [];

                for (var i = 0, len = objectEntries.length; i < len; i++)
                    resultEntries.push(serializeObject(objectEntries[i], descriptor));
            }

            return result;
        }

        function serializeObject(contract: DataViewObjectDefinition, descriptor: DataViewObjectDescriptor): wireContracts.DataViewObjectDefinition {
            debug.assertAnyValue(contract, 'contract');
            debug.assertValue(descriptor, 'descriptor');

            if (!contract)
                return;

            var properties = serializeObjectProperties(contract.properties, descriptor.properties);
            if (!properties)
                return;

            var result: wireContracts.DataViewObjectDefinition = {
                properties: properties,
            };

            var selector = serializeSelector(contract.selector);
            if (selector)
                result.selector = selector;

            return result;
        }

        function serializeSelector(contract: Selector): wireContracts.Selector {
            debug.assertAnyValue(contract, 'contract');

            if (!contract)
                return;

            var result: wireContracts.Selector = {};

            if (contract.data)
                result.data = contract.data.map(v => serializeDataRepetitionSelector(v));

            if (contract.metadata)
                result.metadata = contract.metadata;

            if (contract.id)
                result.id = contract.id;

            return result;
        }

        function serializeDataRepetitionSelector(contract: DataRepetitionSelector): wireContracts.DataRepetitionSelector {
            debug.assertValue(contract, 'contract');

            var scopeId = <DataViewScopeIdentity>contract;
            if (scopeId.expr) {
                return {
                    scopeId: SemanticQuerySerializer.serializeExpr(scopeId.expr),
                };
            }

            var wildcard = <DataViewScopeWildcard>contract;
            if (wildcard.exprs) {
                return {
                    wildcard: wildcard.exprs.map(SemanticQuerySerializer.serializeExpr)
                };
            }
        }

        function serializeObjectProperties(contract: DataViewObjectPropertyDefinitions, descriptors: DataViewObjectPropertyDescriptors): wireContracts.DataViewObjectPropertyDefinitions {
            debug.assertAnyValue(contract, 'contract');
            debug.assertValue(descriptors, 'descriptors');

            if (!contract)
                return;

            var result: wireContracts.DataViewObjectPropertyDefinitions = {};

            for (var propertyName in contract) {
                var propertyValue = serializeObjectProperty(contract[propertyName], descriptors[propertyName]);

                // TODO: Trace/telemetry when serialize fails.
                if (propertyValue !== undefined)
                    result[propertyName] = propertyValue;
            }

            return result;
        }

        function serializeObjectProperty(contract: DataViewObjectPropertyDefinition, descriptor: DataViewObjectPropertyDescriptor): wireContracts.DataViewObjectPropertyDefinition {
            debug.assertAnyValue(contract, 'contract');
            debug.assertAnyValue(descriptor, 'descriptor');

            if (!descriptor)
                return;

            var type = parseType(descriptor.type);
            if (type.value)
                return serializePropertyValueType(contract, type.value);

            return serializePropertyStructuralType(contract, type.structural);
        }

        function serializePropertyValueType(contract: DataViewObjectPropertyDefinition, type: ValueType): wireContracts.Expr {
            debug.assertValue(type, 'type');

            if (type.primitiveType !== undefined) {
                if (contract instanceof SQExpr) {
                    return {
                        expr: SemanticQuerySerializer.serializeExpr(<SQExpr>contract)
                    };
                }
            }
        }

        function serializePropertyStructuralType(contract: DataViewObjectPropertyDefinition, type: StructuralTypeDescriptor): wireContracts.DataViewObjectPropertyDefinition {
            debug.assertValue(type, 'type');

            if (type.fill && type.fill.solid && type.fill.solid.color && contract) {
                var fillDefn = (<FillDefinition>contract);
                return {
                    solid: { color: serializePropertyValueType(fillDefn.solid.color, ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text)) }
                };
            }

            if (type.fillRule) {
                var fillRuleDefinition= (<FillRuleDefinition>contract);
                var serializedFillRuleDefinition = getParsedFillRule(fillRuleDefinition, serializePropertyValueType);

                if (serializedFillRuleDefinition) {
                    return serializedFillRuleDefinition;
                }
            }

            if (type.filter && contract)
                return { filter: SemanticQuerySerializer.serializeFilter(<SemanticFilter>contract) };

            return <any>contract;
        }

        function parseType(typeDescriptor: DataViewObjectPropertyTypeDescriptor): ParsedTypeDescriptor {
            debug.assertValue(typeDescriptor, 'typeDescriptor');

            var valueType = ValueType.fromDescriptor(typeDescriptor);

            if (valueType.primitiveType !== PrimitiveType.Null)
                return { value: valueType };

            return {
                structural: <StructuralTypeDescriptor>typeDescriptor
            };
        }

        function getParsedFillRule(fillRuleDefn: any, serializationDelegate: (input: any, type: any) => any): any {

            if (fillRuleDefn.linearGradient2) {

                var gradient = fillRuleDefn.linearGradient2;
                var linearGradient2: LinearGradient2Generic<wireContracts.Expr, wireContracts.Expr> = {
                    max: {
                        color: serializationDelegate(gradient.max.color, ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text))
                    },
                    min: {
                        color: serializationDelegate(gradient.min.color, ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text))
                    }
                };

                if (gradient.max.value) {
                    linearGradient2.max.value = serializationDelegate(gradient.max.value, ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double));
                }
                if (gradient.min.value) {
                    linearGradient2.min.value = serializationDelegate(gradient.min.value, ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double));
                }

                return {
                    linearGradient2: linearGradient2
                };
            }

            if (fillRuleDefn.linearGradient3) {

                var gradient = fillRuleDefn.linearGradient3;
                var linearGradient3: LinearGradient3Generic<wireContracts.Expr, wireContracts.Expr> = {
                    max: {
                        color: serializationDelegate(gradient.max.color, ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text))
                    },
                    mid: {
                        color: serializationDelegate(gradient.mid.color, ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text))
                    },
                    min: {
                        color: serializationDelegate(gradient.min.color, ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text))
                    }
                };

                if (gradient.max.value) {
                    linearGradient3.max.value = serializationDelegate(gradient.max.value, ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double));
                }
                if (gradient.mid.value) {
                    linearGradient3.mid.value = serializationDelegate(gradient.mid.value, ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double));
                }
                if (gradient.min.value) {
                    linearGradient3.min.value = serializationDelegate(gradient.min.value, ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double));
                }

                return {
                    linearGradient3: linearGradient3
                };
            }

            return null;
        }
    }
} 