//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data {

    export interface FilterValueScopeIdsContainer {
            isNot: boolean;
            scopeIds: DataViewScopeIdentity[];
        }

    export module SQExprConverter {
        export function asScopeIdsContainer(filter: SemanticFilter, fieldSQExprs: SQExpr[]): FilterValueScopeIdsContainer {
            debug.assertValue(filter, 'filter');
            debug.assertValue(fieldSQExprs, 'fieldSQExprs');
            debug.assert(fieldSQExprs.length === 1, 'There should be exactly 1 field expression.');

            var filterItems = filter.conditions();
            debug.assert(filterItems.length === 1, 'There should be exactly 1 filter expression.');
            var filterItem = filterItems[0];
            if (filterItem) {
                var visitor = new FilterScopeIdsCollectorVisitor(fieldSQExprs[0]);
                if (filterItem.accept(visitor))
                    return visitor.getResult();
            }
        }

        /** Gets a comparand value from the given DataViewScopeIdentity. */
        export function getFirstComparandValue(identity: DataViewScopeIdentity): any {
            debug.assertValue(identity, 'identity');

            var comparandExpr = identity.expr.accept(new FindComparandVisitor());
            if (comparandExpr)
                return comparandExpr.value;
        }
    }

    /** Collect filter values from simple semantic filter that is similar to 'is any of' or 'is not any of', getResult() returns a collection of scopeIds.**/
    class FilterScopeIdsCollectorVisitor extends DefaultSQExprVisitor<boolean>{
        private isRoot: boolean;
        private isNot: boolean;
        private valueExprs: SQExpr[];
        private fieldExpr: SQExpr;

        constructor(fieldSQExpr: SQExpr) {
            super();
            this.isRoot = true;
            this.isNot = false;
            this.valueExprs = [];
            // Need to drop the entityVar before create the scopeIdentity. The ScopeIdentity created on the client is used to
            // compare the ScopeIdentity came from the server. But server doesn't have the entity variable concept, so we will
            // need to drop it in order to use JsonComparer.
            this.fieldExpr = SQExprBuilder.removeEntityVariables(fieldSQExpr);
        }

        public getResult(): FilterValueScopeIdsContainer {
            debug.assertValue(this.fieldExpr, 'fieldExpr');            

            var valueExprs = this.valueExprs,
                scopeIds: DataViewScopeIdentity[] = [];
            for (var i = 0, len = valueExprs.length; i < len; i++) {
                scopeIds.push(FilterScopeIdsCollectorVisitor.getScopeIdentity(this.fieldExpr, valueExprs[i]));
            }

            return {
                isNot: this.isNot,
                scopeIds: scopeIds,
            };
        }

        private static getScopeIdentity(fieldExpr: SQExpr, valueExpr: SQExpr): DataViewScopeIdentity {
            debug.assertValue(valueExpr, 'valueExpr');
            debug.assertValue(fieldExpr, 'fieldExpr');

            return createDataViewScopeIdentity(SQExprBuilder.equal(fieldExpr, valueExpr));
        }

        public visitOr(expr: SQOrExpr): boolean {
            this.isRoot = false;
            return expr.left.accept(this) && expr.right.accept(this);
        }

        public visitNot(expr: SQNotExpr): boolean {
            if (!this.isRoot)
                return this.unsupportedSQExpr();

            this.isNot = true;
            return expr.arg.accept(this);
        }

        public visitConstant(expr: SQConstantExpr): boolean {
            if (this.isRoot && expr.type.primitiveType === PrimitiveType.Null)
                return this.unsupportedSQExpr();

            this.valueExprs.push(expr);            
            return true;
        }

        public visitCompare(expr: SQCompareExpr): boolean {
            this.isRoot = false;

            if (expr.kind !== QueryComparisonKind.Equal)
                return this.unsupportedSQExpr();

            return expr.left.accept(this) && expr.right.accept(this);
        }

        public visitColumnRef(expr: SQColumnRefExpr): boolean {
            if (this.isRoot)
                return this.unsupportedSQExpr();
            var fixedExpr = SQExprBuilder.removeEntityVariables(expr);
            return SQExpr.equals(this.fieldExpr, fixedExpr);
        }

        public visitDefault(expr: SQExpr): boolean {
            return this.unsupportedSQExpr();
        }

        private unsupportedSQExpr(): boolean {
            return false;
        }
    }

    class FindComparandVisitor extends DefaultSQExprVisitor<SQConstantExpr> {
        public visitAnd(expr: SQAndExpr): SQConstantExpr {
            return expr.left.accept(this) || expr.right.accept(this);
        }

        public visitCompare(expr: SQCompareExpr): SQConstantExpr {
            if (expr.kind === QueryComparisonKind.Equal) {
                if (expr.right instanceof SQConstantExpr)
                    return <SQConstantExpr>expr.right;
                if (expr.left instanceof SQConstantExpr)
                    return <SQConstantExpr>expr.left;
            }
        }
    }
}
