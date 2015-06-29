//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

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
