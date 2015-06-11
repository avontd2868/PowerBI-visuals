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

/**
 * Defines a Debug object.  Calls to any functions in this object removed by the minifier.
 * The functions within this class are not minified away, so we use the preprocessor-style
 * comments to have the minifier remove those as well.
 */
///#DEBUG

module debug {

    export var assertFailFunction: {
        (message: string): void;
    };

    /** Asserts that the condition is true, fails otherwise. */
    export function assert(condition: boolean, message: string): void {
        if (condition !== true) {
            assertFail(message || ('condition: ' + condition));
        }
    }

    /** Asserts that the value is neither null nor undefined, fails otherwise. */
    export function assertValue<T>(value: T, message: string): void {
        if (value === null || value === undefined) {
            assertFail(message || ('condition: ' + value));
        }
    }

    /** Makes no assertion on the given value.  This is documentation/placeholder that a value is possibly null or undefined (unlike assertValue).  */
    export function assertAnyValue<T>(value: T, message: string): void {
    }

    export function assertFail(message: string): void {
        (assertFailFunction || alert)('Debug Assert failed: ' + message);
    }
}
///#ENDDEBUG
