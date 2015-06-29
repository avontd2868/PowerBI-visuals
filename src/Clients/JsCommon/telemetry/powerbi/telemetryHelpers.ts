//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi {
    export function getHashCode(inputStr: string): number {
        var hash = 0, i, chrCode, len;
        if (inputStr.length === 0) return hash;

        var lowerInputString: string = inputStr.toLowerCase();
        for (i = 0, len = lowerInputString.length; i < len; i++) {
            chrCode = lowerInputString.charCodeAt(i);
            hash = ((hash << 5) - hash) + chrCode;
            hash |= 0;
        }
        return hash;
    }
}
