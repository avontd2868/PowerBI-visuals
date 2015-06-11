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