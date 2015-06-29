//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data {
    export class RuleEvaluation {
        public scopeId: DataViewScopeIdentity;
        public inputRole: string;
        protected value: any;

        constructor(inputRole?: string) {
            debug.assertAnyValue(inputRole, 'inputRole');

            if (inputRole)
                this.inputRole = inputRole;
        }

        // TODO: This method should be removed, and instead provide a context object to evaluate that allows the implementor to pull from the context
        // (rather than pushing parts of the context into it).
        public setContext(scopeId: DataViewScopeIdentity, value: any): void {
            this.scopeId = scopeId;
            this.value = value;
        }

        public evaluate(): any {
            debug.assertFail('Abstract method RuleEvaluation.evaluate not implemented.');
        }
    }
}