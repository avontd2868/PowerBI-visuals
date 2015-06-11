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
    import Lazy = jsCommon.Lazy;

    /** Defines a match against all instances of a given DataView scope. */
    export interface DataViewScopeWildcard {
        exprs: SQExpr[];
        key: string;
    }

    export module DataViewScopeWildcard {
        export function matches(wildcard: DataViewScopeWildcard, instance: DataViewScopeIdentity): boolean {
            var instanceExprs = ScopeIdentityKeyExtractor.run(instance.expr);
            if (!instanceExprs)
                return false;

            return SQExprUtils.sequenceEqual(wildcard.exprs, instanceExprs);
        }

        export function fromExprs(exprs: SQExpr[]): DataViewScopeWildcard {
            return new DataViewScopeWildcardImpl(exprs);
        }

        class DataViewScopeWildcardImpl implements DataViewScopeWildcard {
            private _exprs: SQExpr[];
            private _key: Lazy<string>;

            public constructor(exprs: SQExpr[]) {
                debug.assertValue(exprs, 'exprs');

                this._exprs = exprs;
                this._key = new Lazy(() => SQExprShortSerializer.serializeArray(exprs));
            }

            public get exprs(): SQExpr[] {
                return this._exprs;
            }

            public get key(): string {
                return this._key.getValue();
            }
        }
    }
}