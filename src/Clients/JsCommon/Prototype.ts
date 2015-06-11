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