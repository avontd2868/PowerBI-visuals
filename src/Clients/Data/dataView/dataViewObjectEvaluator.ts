//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data {
    /** Responsible for evaluating object property expressions to be applied at various scopes in a DataView. */
    export module DataViewObjectEvaluator {
        var colorValueType: ValueType = ValueType.fromDescriptor({ formatting: { color: true } });
        var numericType: ValueType = ValueType.fromDescriptor({ numeric: true });

        export function run(
            objectDescriptor: DataViewObjectDescriptor,
            propertyDefinitions: DataViewObjectPropertyDefinitions): DataViewObject {
            debug.assertAnyValue(objectDescriptor, 'objectDescriptor');
            debug.assertValue(propertyDefinitions, 'propertyDefinitions');

            if (!objectDescriptor)
                return;

            var object: DataViewObject,
                propertyDescriptors = objectDescriptor.properties;
            for (var propertyName in propertyDefinitions) {
                var propertyDefinition = propertyDefinitions[propertyName],
                    propertyDescriptor = propertyDescriptors[propertyName];

                if (!propertyDescriptor)
                    continue;

                var propertyValue = evaluateProperty(propertyDescriptor, propertyDefinition);
                if (propertyValue === undefined)
                    continue;

                if (!object)
                    object = {};
                object[propertyName] = propertyValue;
            }

            return object;
        }

        // Exported for testability
        export function evaluateProperty(
            propertyDescriptor: DataViewObjectPropertyDescriptor,
            propertyDefinition: DataViewObjectPropertyDefinition) {
            debug.assertValue(propertyDescriptor, 'propertyDescriptor');
            debug.assertValue(propertyDefinition, 'propertyDefinition');

            var value = evaluateValue(<any>propertyDefinition, ValueType.fromDescriptor(propertyDescriptor.type));
            if (value !== undefined || (propertyDefinition instanceof RuleEvaluation))
                return value;

            var structuralType = <StructuralTypeDescriptor>propertyDescriptor.type;
            var valueFill = evaluateFill(<FillDefinition>propertyDefinition, structuralType);
            if (valueFill)
                return valueFill;

            var valueFillRule = evaluateFillRule(<FillRuleDefinition>propertyDefinition, structuralType);
            if (valueFillRule)
                return valueFillRule;

            return propertyDefinition;
        }

        function evaluateFill(fillDefn: FillDefinition, type: StructuralTypeDescriptor) {
            var fillType = type.fill;
            if (!fillType)
                return;

            if (fillType && fillType.solid && fillType.solid.color && fillDefn.solid) {
                return {
                    solid: {
                        color: evaluateValue(fillDefn.solid.color, ValueType.fromExtendedType(ExtendedType.Color)),
                    }
                };
            }
        }

        function evaluateFillRule(fillRuleDefn: FillRuleDefinition, type: StructuralTypeDescriptor): any {
            if (!type.fillRule)
                return;

            if (fillRuleDefn.linearGradient2) {
                var linearGradient2 = fillRuleDefn.linearGradient2;
                return {
                    linearGradient2: {
                        min: evaluateColorStop(linearGradient2.min),
                        max: evaluateColorStop(linearGradient2.max),
                    }
                };
            }

            if (fillRuleDefn.linearGradient3) {
                var linearGradient3 = fillRuleDefn.linearGradient3;
                return {
                    linearGradient3: {
                        min: evaluateColorStop(linearGradient3.min),
                        mid: evaluateColorStop(linearGradient3.mid),
                        max: evaluateColorStop(linearGradient3.max),
                    }
                };
            }
        }

        function evaluateColorStop(colorStop: RuleColorStopDefinition): RuleColorStop {
            debug.assertValue(colorStop, 'colorStop');

            var step: RuleColorStop = {
                color: evaluateValue(colorStop.color, colorValueType),
            };

            var value = evaluateValue(colorStop.value, numericType);
            if (value)
                step.value = value;

            return step;
        }

        function evaluateValue(definition: SQExpr | RuleEvaluation, valueType: ValueType): any {
            if (definition instanceof SQExpr)
                return ExpressionEvaluator.evaluate(<SQExpr>definition, valueType);

            if (definition instanceof RuleEvaluation)
                return (<RuleEvaluation>definition).evaluate();
        }

        /** Responsible for evaluating SQExprs into values. */
        class ExpressionEvaluator extends DefaultSQExprVisitorWithArg<any, ValueType> {
            private static instance: ExpressionEvaluator = new ExpressionEvaluator();

            public static evaluate(expr: SQExpr, type: ValueType): any {
                if (expr == null)
                    return;

                return expr.accept(ExpressionEvaluator.instance, type);
            }

            public visitConstant(expr: SQConstantExpr, type: ValueType): any {
                // TODO: We should coerce/respect property type.
                // NOTE: There shouldn't be a need to coerce color strings, since the UI layers can handle that directly.
                return expr.value;
            }
        }
    }
} 
