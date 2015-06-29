//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data {
    /** Serializes SQExpr in a form optimized in-memory comparison, but not intended for storage on disk. */
    export module SQExprShortSerializer {
        export function serialize(expr: SQExpr): string {
            return JSON.stringify(expr.accept(SQExprSerializer.instance));
        }

        export function serializeArray(exprs: SQExpr[]): string {
            var str = '[';
            for (var i = 0, len = exprs.length; i < len; i++) {
                if (i > 0)
                    str += ',';
                str += SQExprShortSerializer.serialize(exprs[i]);
            }
            return str + ']';
        }

        /** Responsible for serializing an SQExpr into a comparable string. */
        class SQExprSerializer extends DefaultSQExprVisitor<{}> {
            public static instance: SQExprSerializer = new SQExprSerializer();

            public visitColumnRef(expr: SQColumnRefExpr): {} {
                return {
                    col: {
                        s: expr.source.accept(this),
                        r: expr.ref,
                    }
                };
            }

            public visitMeasureRef(expr: SQMeasureRefExpr): {} {
                return {
                    measure: {
                        s: expr.source.accept(this),
                        r: expr.ref,
                    }
                };
            }

            public visitAggr(expr: SQAggregationExpr): {} {
                return {
                    agg: {
                        a: expr.arg.accept(this),
                        f: expr.func,
                    }
                };
            }

            public visitEntity(expr: SQEntityExpr): {} {
                debug.assertValue(expr, 'expr');
                debug.assertValue(expr.entity, 'expr.entity');

                return {
                    e: expr.entity
                };
            }

            public visitAnd(expr: SQAndExpr): {} {
                debug.assertValue(expr, 'expr');

                return {
                    and: {
                        l: expr.left.accept(this),
                        r: expr.right.accept(this),
                    }
                };
            }

            public visitCompare(expr: SQCompareExpr): {} {
                debug.assertValue(expr, 'expr');

                return {
                    comp: {
                        k: expr.kind,
                        l: expr.left.accept(this),
                        r: expr.right.accept(this),
                    }
                };
            }

            public visitConstant(expr: SQConstantExpr): {} {
                debug.assertValue(expr, 'expr');

                return {
                    const: {
                        t: expr.type.primitiveType,
                        v: expr.value,
                    }
                };
            }

            public visitDefault(expr: SQExpr): {} {
                debug.assertFail('Unexpected expression type found in DataViewScopeIdentity.');

                return;
            }
        }
    }
}