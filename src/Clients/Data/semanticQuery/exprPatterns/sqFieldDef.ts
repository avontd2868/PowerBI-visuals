//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data {

    /** Represents a simplified table aggregate/column/column aggregate reference within a SQ. */
    export interface SQFieldDef {
        schema: string;
        entity: string;
        column?: string;
        measure?: string;
        aggregate?: data.QueryAggregateFunction;
        entityVar?: string;
    }

    export module SQExprConverter {
        export function asSQFieldDef(sqExpr: SQExpr): SQFieldDef {
            return sqExpr.accept(SQFieldDefinitionBuilder.instance);
        }
    }

    export module SQExprBuilder {
        export function fieldDef(fieldDef: SQFieldDef): SQExpr {
            return wrapAggr(fieldDef)
                || wrapColumn(fieldDef)
                || wrapMeasure(fieldDef)
                || wrapEntity(fieldDef);
        }

        function wrapAggr(fieldDef: SQFieldDef): SQExpr {
            var aggr = fieldDef.aggregate;
            if (aggr !== undefined) {
                var expr = wrapColumn(fieldDef) || wrapEntity(fieldDef);
                if (expr)
                    return aggregate(expr, aggr);
               
            }
        }

        function wrapColumn(fieldDef: SQFieldDef): SQExpr {
            var column = fieldDef.column;
            if (column) {
                var entityExpr = wrapEntity(fieldDef);
                if (entityExpr)
                    return columnRef(entityExpr, column);
            }
        }

        function wrapMeasure(fieldDef: SQFieldDef): SQExpr {
            var measure = fieldDef.measure;
            if (measure) {
                var entityExpr = wrapEntity(fieldDef);
                if (entityExpr)
                    return measureRef(entityExpr, measure);
            }
        }

        function wrapEntity(fieldDef: SQFieldDef): SQExpr {
            return entity(fieldDef.schema, fieldDef.entity, fieldDef.entityVar);
        }
    }

    class SQFieldDefinitionBuilder extends DefaultSQExprVisitor<SQFieldDef> {
        public static instance: SQFieldDefinitionBuilder = new SQFieldDefinitionBuilder();

        public visitColumnRef(expr: SQColumnRefExpr): SQFieldDef {
            var sourceRef: SQFieldDef = expr.source.accept(this);
            if (sourceRef) {
                sourceRef.column = expr.ref;
                return sourceRef;
            }
        }

        public visitMeasureRef(expr: SQMeasureRefExpr): SQFieldDef {
            var sourceRef: SQFieldDef = expr.source.accept(this);
            if (sourceRef) {
                sourceRef.measure = expr.ref;
                return sourceRef;
            }
        }

        public visitAggr(expr: SQAggregationExpr): SQFieldDef {
            var sourceRef: SQFieldDef = expr.arg.accept(this);
            if (sourceRef) {
                sourceRef.aggregate = expr.func;
                return sourceRef;
            }
        }

        public visitEntity(expr: SQEntityExpr): SQFieldDef {
            var fieldDef: SQFieldDef = {
                schema: expr.schema,
                entity: expr.entity
            };
            if (expr.variable)
                fieldDef.entityVar = expr.variable;

            return fieldDef;
        }
    }
}
 