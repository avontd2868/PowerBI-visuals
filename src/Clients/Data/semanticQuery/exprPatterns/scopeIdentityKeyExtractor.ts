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