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