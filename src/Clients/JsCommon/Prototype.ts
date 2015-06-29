//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi {
    export module Prototype {
        /** Returns a new object with the provided obj as its prototype. */
        export function inherit<T>(obj: T, extension?: (inherited: T) => void): T {
            debug.assertValue(obj, 'obj');

            function wrapCtor() { };
            wrapCtor.prototype = obj;

            var inherited = new wrapCtor();

            if (extension)
                extension(inherited);

            return inherited;
        }

        /**
         * Uses the provided callback function to selectively replace contents in the provided array, and returns
         * a new array with those values overriden.
         * Returns undefined if no overrides are necessary.
         */
        export function overrideArray<T, TArray>(prototype: TArray, override: (T) => T): TArray {
            if (!prototype)
                return;

            var overwritten: TArray;

            for (var i = 0, len = (<T[]><any>prototype).length; i < len; i++) {
                var value = override(prototype[i]);
                if (value) {
                    if (!overwritten)
                        overwritten = inherit(prototype);

                    overwritten[i] = value;
                }
            }

            return overwritten;
        }
    }
} 