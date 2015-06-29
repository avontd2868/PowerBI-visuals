//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module jsCommon {
    export module UnionExtensions {
        /** 
         * Merges objects representing parts of a union type into a single object.
         * arg1 may be modified during the merge. 
         */
        export function mergeUnionType<TResult>(arg1: any, arg2: any, arg3?: any): TResult {
            if (!arg1 && !arg2 && !arg3)
                return;

            // In most cases, our union types are used in a mutually exclusive way,
            // so only one object will be populated.
            if (arg1 && !arg2 && !arg3)
                return arg1;

            if (!arg1 && arg2 && !arg3)
                return arg2;

            if (!arg1 && !arg2 && arg3)
                return arg3;

            return $.extend(arg1, arg2, arg3);
        }
    }
} 