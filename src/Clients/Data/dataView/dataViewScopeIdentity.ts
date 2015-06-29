//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi {
    import ArrayExtensions = jsCommon.ArrayExtensions;

    /** Encapsulates the identity of a data scope in a DataView. */
    export interface DataViewScopeIdentity {
        /** Predicate expression that identifies the scope. */
        expr: data.SQExpr;

        /** Key string that identifies the DataViewScopeIdentity to a string, which can be used for equality comparison. */
        key: string;
    }

    export module DataViewScopeIdentity {
        /** Compares the two DataViewScopeIdentity values for equality. */
        export function equals(x: DataViewScopeIdentity, y: DataViewScopeIdentity, ignoreCase?: boolean): boolean {
            // Normalize falsy to null
            x = x || null;
            y = y || null;

            if (x === y)
                return true;

            if (!x !== !y)
                return false;

            debug.assertValue(x, 'x');
            debug.assertValue(y, 'y');

            return data.SQExpr.equals(x.expr, y.expr, ignoreCase);
        }

        export function filterFromIdentity(identities: DataViewScopeIdentity[], isNot?: boolean): data.SemanticFilter {
            if (ArrayExtensions.isUndefinedOrEmpty(identities))
                return;

            var expr: data.SQExpr;
            for (var i = 0, len = identities.length; i < len; i++) {
                var identity = identities[i];

                expr = expr
                    ? powerbi.data.SQExprBuilder.or(expr, identity.expr)
                    : identity.expr;
            }

            if (expr && isNot)
                expr = powerbi.data.SQExprBuilder.not(expr);

            return powerbi.data.SemanticFilter.fromSQExpr(expr);
        }
    }

    export module data {
        import Lazy = jsCommon.Lazy;

        export function createDataViewScopeIdentity(expr: SQExpr): DataViewScopeIdentity {
            return new DataViewScopeIdentityImpl(expr);
        }

        class DataViewScopeIdentityImpl implements DataViewScopeIdentity {
            private _expr: SQExpr;
            private _key: Lazy<string>;

            public constructor(expr: SQExpr) {
                debug.assertValue(expr, 'expr');

                this._expr = expr;
                this._key = new Lazy(() => SQExprShortSerializer.serialize(expr));
            }

            public get expr(): SQExpr {
                return this._expr;
            }

            public get key(): string {
                return this._key.getValue();
            }
        }
    }
}
