//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module jsCommon {
    /**
     * This StringBuilder was ported from MicrosoftAjax.js (https://ajax.aspnetcdn.com/ajax/3.5/MicrosoftAjax.debug.js)
     * and is used for serialization of objects for interop with PowerView.
     */
    export class StringBuilder {
        private _parts: string[];

        /** Creates a new instance of StringBuilder */
        constructor(initialText?: string) {
            this._parts = new Array<string>();
            if (initialText) {
                this._parts.push(initialText);
            }
        }

        public append(text: string): void {
            if (text) {
                this._parts[this._parts.length] = text;
            }
        }

        public appendLine(text: string): void {
            if (text) {
                this._parts[this._parts.length] = text + '\r\n';
            }
            else {
                this._parts[this._parts.length] = '\r\n';
            }
        }

        public clear(): void {
            this._parts = new Array<string>();
        }

        public isEmpty(): boolean {
            return this._parts.length === 0 || this.toString('') === '';
        }

        public toString(separator?: string): string {
            var result = this._parts.join(separator || '');
            return result;
        }
    }
}