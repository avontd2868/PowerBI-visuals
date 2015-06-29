//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data {
    export class FilterRuleEvaluation extends RuleEvaluation {
        private selection: FilterValueScopeIdsContainer;

        constructor(scopeIds: FilterValueScopeIdsContainer) {
            debug.assertValue(scopeIds, 'scopeIds');

            super();
            this.selection = scopeIds;
        }

        public evaluate(): any {
            var currentScopeId = this.scopeId,
                selectedScopeIds = this.selection.scopeIds;
            for (var i = 0, len = selectedScopeIds.length; i < len; i++) {
                if (DataViewScopeIdentity.equals(currentScopeId, selectedScopeIds[i]))
                    return !this.selection.isNot;
            }
        }
    }
}