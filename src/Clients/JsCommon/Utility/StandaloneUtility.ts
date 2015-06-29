//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module jsCommon {
    // NOTE: this file includes standalone utilities that should have no dependencies on external libraries, including jQuery.

    /** Interface to help define objects indexed by number to a particular type. */
    export interface INumberDictionary<T> {
        [key: number]: T;
    }

    /** Interface to help define objects indexed by name to a particular type. */
    export interface IStringDictionary<T> {
        [key: string]: T;
    }

    /** Extensions for Enumerations. */
    export module EnumExtensions {
        /** Gets a value indicating whether the value has the bit flags set. */
        export function hasFlag(value: number, flag: number): boolean {
            debug.assert(!!flag, 'flag must be specified and nonzero.');

            return (value & flag) === flag;
        }
        
        // According to the TypeScript Handbook, this is safe to do.
        export function toString(enumType: any, value: number): string {
            return enumType[value];
        }
    }

    /** Extensions to String class */
    export module StringExtensions {
        /** Checks if a string ends with a sub-string */
        export function endsWith(str: string, suffix: string): boolean {
            debug.assertValue(str, 'str');
            debug.assertValue(suffix, 'suffix');

            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        }
    }

    export module LogicExtensions {
        export function XOR(a: boolean, b: boolean): boolean {
            return (a || b) && !(a && b);
        }
    }

    export module JsonComparer {
        /** Performs JSON-style comparison of two objects. */
        export function equals<T>(x: T, y: T): boolean {
            if (x === y)
                return true;

            return JSON.stringify(x) === JSON.stringify(y);
        }
    }
} 