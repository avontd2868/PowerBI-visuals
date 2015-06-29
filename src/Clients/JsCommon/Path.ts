//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module jsCommon {

    /** Represents a path of sequential objects. */
    export class Path<T> {
        private _segments: T[];

        constructor(segments: T[]) {
            debug.assertValue(segments, 'segments');
            debug.assert(segments.length > 0, 'segments.length');

            this._segments = segments;
        }

        public getLeafSegment(): T {
            return this._segments[this._segments.length - 1];
        }

        /** Returns true if the other Path has a subset of segments of this Path, appearing the same order. */
        public isExtensionOf(other: Path<T>): boolean {
            if (this._segments.length <= other._segments.length) {
                return false;
            }

            for (var i = 0, len = other._segments.length; i < len; ++i) {
                if (this._segments[i] !== other._segments[i]) {
                    return false;
                }
            }

            return true;
        }

        /** Returns a Path with has the appended segment. */
        public extend(segment: T): Path<T> {
            return new Path(this._segments.concat([segment]));
        }
    }
}