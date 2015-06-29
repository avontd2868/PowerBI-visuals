//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module jsCommon {
    export interface ArrayIdItems<T> extends Array<T> {
        withId(id: number): T;
    }

    export interface ArrayNamedItems<T> extends Array<T> {
        withName(name: string): T;
    }

    export module ArrayExtensions {
        /** Returns items that exist in target and other. */
        export function intersect<T>(target: T[], other: T[]): T[] {
            var result: T[] = [];
            for (var i = target.length - 1; i >= 0; --i) {
                if (other.indexOf(target[i]) !== -1) {
                    result.push(target[i]);
                }
            }
            return result;
        }

        /** return elements exists in target but not exists in other. */
        export function diff<T>(target: T[], other: T[]): T[] {
            var result: T[] = [];
            for (var i = target.length - 1; i >= 0; --i) {
                var value: T = target[i];
                if (other.indexOf(value) === -1) {
                    result.push(value);
                }
            }
            return result;
        }

        /** return an array with only the distinct items in the source. */
        export function distinct<T>(source: T[]): T[] {
            var result: T[] = [];
            for (var i = 0, len = source.length; i < len; i++) {
                var value: T = source[i];
                if (result.indexOf(value) === -1) {
                    result.push(value);
                }
            }
            return result;
        }

        /** Pushes content of source onto target, for parts of course that do not already exist in target. */
        export function union<T>(target: T[], source: T[]): void {
            for (var i = 0, len = source.length; i < len; ++i) {
                unionSingle(target, source[i]);
            }
        }

        /** Pushes value onto target, if value does not already exist in target. */
        export function unionSingle<T>(target: T[], value: T): void {
            if (target.indexOf(value) < 0) {
                target.push(value);
            }
        }

        /** Returns an array with a range of items from source, including the startIndex & endIndex. */
        export function range<T>(source: T[], startIndex: number, endIndex: number): T[] {
            debug.assert(startIndex >= 0 && startIndex < source.length, 'startIndex is out of range.');
            debug.assert(endIndex >= 0 && endIndex < source.length, 'endIndex is out of range.');

            var result: T[] = [];
            for (var i = startIndex; i <= endIndex; ++i) {
                result.push(source[i]);
            }
            return result;
        }

        /** Returns an array that includes items from source, up to the specified count. */
        export function take<T>(source: T[], count: number): T[] {
            debug.assert(count >= 0, 'Count is negative.');
            debug.assert(count <= source.length, 'Count is too large.');

            var result: T[] = [];
            for (var i = 0; i < count; ++i) {
                result.push(source[i]);
            }
            return result;
        }

        /** Returns a value indicating whether the arrays have the same values in the same sequence. */
        export function sequenceEqual<T>(left: T[], right: T[], comparison: (x: T, y: T) => boolean): boolean {
            debug.assertValue(comparison, 'comparison');

            if (left === right) {
                return true;
            }

            if (!!left !== !!right) {
                return false;
            }

            var len = left.length;
            if (len !== right.length) {
                return false;
            }

            var i = 0;
            while (i < len && comparison(left[i], right[i])) {
                ++i;
            }

            return i === len;
        }

        /** Returns null if the specified array is empty.  Otherwise returns the specified array. */
        export function emptyToNull<T>(array: T[]): T[] {
            if (array && array.length === 0) {
                return null;
            }
            return array;
        }

        export function indexOf<T>(array: T[], predicate: (T) => boolean): number {
            debug.assertValue(array, 'array');
            debug.assertValue(predicate, 'predicate');

            for (var i = 0, len = array.length; i < len; ++i) {
                if (predicate(array[i])) {
                    return i;
                }
            }
            return -1;
        }

        export function createWithId<T>(): ArrayIdItems<T> {
            return extendWithId<T>([]);
        }

        export function extendWithId<T>(array: { id: number }[]): ArrayIdItems<T> {
            debug.assertValue(array, 'array');

            var extended: ArrayIdItems<T> = <any>array;
            extended.withId = withId;

            return extended;
        }

        /** Finds and returns the first item with a matching ID. */
        export function findWithId<T>(array: T[], id: number): T {
            for (var i = 0, len = array.length; i < len; i++) {
                var item = array[i];
                if ((<any>item).id === id)
                    return item;
            }
        }

        function withId<T>(id: number): T {
            return ArrayExtensions.findWithId<T>(this, id);
        }

        export function createWithName<T>(): ArrayNamedItems<T> {
            return extendWithName<T>([]);
        }

        export function extendWithName<T>(array: { name: string }[]): ArrayNamedItems<T> {
            debug.assertValue(array, 'array');

            var extended: ArrayNamedItems<T> = <any>array;
            extended.withName = withName;

            return extended;
        }

        export function findItemWithName<T>(array: T[], name: string): T {
            var index = indexWithName(array, name);
            if (index >= 0)
                return array[index];
        }

        export function indexWithName<T>(array: T[], name: string): number {
            for (var i = 0, len = array.length; i < len; i++) {
                var item = array[i];
                if ((<any>item).name === name)
                    return i;
            }

            return -1;
        }

        /** Finds and returns the first item with a matching name. */
        function withName<T>(name: string): T {
            var array: T[] = this;
            return findItemWithName(array, name);
        }

        /** Deletes all items from the array.*/
        export function clear(array: any[]): void {
            // Not using splice due to the array creation involved in it. 
            array.length = 0;
        }

        export function isUndefinedOrEmpty(array: any[]): boolean {
            if (!array || array.length === 0) {
                return true;
            }
            return false;
        }
    }
} 