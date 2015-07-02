//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

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