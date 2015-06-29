//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module InJs {
    /** This class represents an action, bound to a button, inside a modal dialog */
    export class ModalDialogAction {
        public labelText: string;
        public actionCallback: jsCommon.ModalDialogActionCallback;
        public data: any;
        public cssClass: string;
        public disabled: boolean;

        constructor(labelText: string, actionCallback: jsCommon.ModalDialogActionCallback, data?: any, cssClass?: string, disabled?: boolean) {
            this.labelText = labelText;
            this.actionCallback = actionCallback;
            this.data = data;
            this.cssClass = cssClass;
            this.disabled = !!disabled;
        }
    }
}