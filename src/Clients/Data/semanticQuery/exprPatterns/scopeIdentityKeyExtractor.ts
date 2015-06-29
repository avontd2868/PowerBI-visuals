//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data {
    import ArrayExtensions = jsCommon.ArrayExtensions;

    /** Recognizes DataViewScopeIdentity expression trees to extract comparison keys. */
    export module ScopeIdentityKeyExtractor {
        export function run(expr: SQExpr): SQExpr[] {
            var extractor = new KeyExtractorImpl();
            expr.accept(extractor);

            if (extractor.malformed)
                return null;

            return ArrayExtensions.emptyToNull(extractor.keys);
        }

        /** Recognizes expressions of the form:
          * 1) Equals(ColRef, Constant)
          * 2) And(Equals(ColRef1, Constant1), Equals(ColRef2, Constant2))
          */
        class KeyExtractorImpl extends DefaultSQExprVisitor<void> {
            public keys: SQExpr[] = [];
            public malformed: boolean;

            public visitAnd(expr: SQAndExpr): void {
                expr.left.accept(this);
                expr.right.accept(this);
            }

            public visitCompare(expr: SQCompareExpr): void {
                if (expr.kind !== QueryComparisonKind.Equal) {
                    this.visitDefault(expr);
                    return;
                }

                expr.left.accept(this);
                expr.right.accept(this);
            }

            public visitColumnRef(expr: SQColumnRefExpr): void {
                this.keys.push(expr);
            }

            public visitConstant(expr: SQConstantExpr): void {
                // Do nothing -- comparison against constants is expected.
            }

            public visitDefault(expr: SQExpr): void {
                this.malformed = true;
            }
        }
    }
}