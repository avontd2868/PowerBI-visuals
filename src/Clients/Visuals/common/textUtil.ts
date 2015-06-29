//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    /**
     * Contains functions/constants to aid in text manupilation. 
    */
    export module TextUtil {
        
        /**
         * remove breaking spaces from given string and replace by none breaking space (&nbsp)
        */
        export function removeBreakingSpaces(str: string): string {
            return str.toString().replace(new RegExp(' ', 'g'), '&nbsp');
        }
    }
}