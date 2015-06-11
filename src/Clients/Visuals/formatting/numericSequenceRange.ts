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
    export class NumericSequenceRange {
        private static DEFAULT_MAX: number = 10;
        private static MIN_SUPPORTED_DOUBLE = -1E307;
        private static MAX_SUPPORTED_DOUBLE = 1E307;

        public min: number;
        public max: number;
        public includeZero: boolean;
        public forcedSingleStop: number;
        public hasDataRange: boolean;
        public hasFixedMin: boolean;
        public hasFixedMax: boolean;

        private _ensureIncludeZero(): void { 
            if (this.includeZero) {
                // fixed min and max has higher priority than includeZero
                if (this.min > 0 && !this.hasFixedMin) {
                    this.min = 0;
                }
                if (this.max < 0 && !this.hasFixedMax) {
                    this.max = 0;
                }
            }
        }

        private _ensureNotEmpty(): void { 
            if (this.min === this.max) {
                if (!this.min) {
                    this.min = 0;
                    this.max = NumericSequenceRange.DEFAULT_MAX;
                    this.hasFixedMin = true;
                    this.hasFixedMax = true;
                } else {
                    // We are dealing with a single data value (includeZero is not set)
                    // In order to fix the range we need to extend it in both directions by half of the interval.
                    // Interval is calculated based on the number:
                    // 1. Integers below 10,000 are extended by 0.5: so the [2006-2006] empty range is extended to [2005.5-2006.5] range and the ForsedSingleStop=2006
                    // 2. Other numbers are extended by half of their power: [700,001-700,001] => [650,001-750,001] and the ForsedSingleStop=null as we want the intervals to be calculated to cover the range.
                    var value = this.min;
                    var exp = Double.log10(Math.abs(value));
                    var step: number;
                    if (exp >= 0 && exp < 4) {
                        step = 0.5;
                        this.forcedSingleStop = value;
                    } else {
                        step = Double.pow10(exp) / 2;
                        this.forcedSingleStop = null;
                    }
                    this.min = value - step;
                    this.max = value + step;
                }
            }
        }

        private _ensureDirection() { 
            if (this.min > this.max) { 
                var temp = this.min;
                this.min = this.max;
                this.max = temp;
            }
        }

        public getSize(): number {
            return this.max - this.min;
        }

        public shrinkByStep(range: NumericSequenceRange, step: number) {
            debug.assertValue(range, "range");
            debug.assert(step > 0, "step");

            var oldCount = this.min / step;
            var newCount = range.min / step;
            var deltaCount = Math.floor(newCount - oldCount);
            this.min += deltaCount * step;

            oldCount = this.max / step;
            newCount = range.max / step;
            deltaCount = Math.ceil(newCount - oldCount);
            this.max += deltaCount * step;
        }

        public static calculate(dataMin: number, dataMax: number, fixedMin?:number, fixedMax?:number, includeZero?: boolean): NumericSequenceRange { 
            debug.assert(dataMin <= dataMax, "dataMin should be less or equal to dataMax.");
            debug.assert(!fixedMin || !fixedMax || fixedMin <= fixedMax, "fixedMin should be less or equal to fixedMax.");

            var result = new NumericSequenceRange(); 
            result.includeZero = includeZero ? true : false;
            result.hasDataRange = ValueUtil.hasValue(dataMin) && ValueUtil.hasValue(dataMax);
            result.hasFixedMin = ValueUtil.hasValue(fixedMin);
            result.hasFixedMax = ValueUtil.hasValue(fixedMax);

            dataMin = Double.ensureInRange(dataMin, NumericSequenceRange.MIN_SUPPORTED_DOUBLE, NumericSequenceRange.MAX_SUPPORTED_DOUBLE);
            dataMax = Double.ensureInRange(dataMax, NumericSequenceRange.MIN_SUPPORTED_DOUBLE, NumericSequenceRange.MAX_SUPPORTED_DOUBLE);

            // Calculate the range using the min, max, dataRange
            if (result.hasFixedMin && result.hasFixedMax) {
                result.min = fixedMin;
                result.max = fixedMax;
            } else if (result.hasFixedMin) {
                result.min = fixedMin;
                result.max = dataMax > fixedMin ? dataMax : fixedMin;
            } else if (result.hasFixedMax) {
                result.min = dataMin < fixedMax ? dataMin : fixedMax;
                result.max = fixedMax;
            } else if (result.hasDataRange) {
                result.min = dataMin;
                result.max = dataMax;
            } else {
                result.min = 0;
                result.max = 0;
            }

            result._ensureIncludeZero();
            result._ensureNotEmpty();
            result._ensureDirection();
            
            if (result.min === 0) {
                result.hasFixedMin = true; // If the range starts from zero we should prevent extending the intervals into the negative range
            } else if (result.max === 0) {
                result.hasFixedMax = true; // If the range ends at zero we should prevent extending the intervals into the positive range
            }

            return result;
        }

        public static calculateDataRange(dataMin: number, dataMax: number, includeZero?: boolean): NumericSequenceRange { 
            if (!ValueUtil.hasValue(dataMin) || !ValueUtil.hasValue(dataMax)) {
                return NumericSequenceRange.calculateFixedRange(0, NumericSequenceRange.DEFAULT_MAX);
            } else {
                return NumericSequenceRange.calculate(dataMin, dataMax, null, null, includeZero);
            }
        }

        public static calculateFixedRange(fixedMin: number, fixedMax: number, includeZero?: boolean): NumericSequenceRange { 
            debug.assertValue(fixedMin, "fixedMin");
            debug.assertValue(fixedMax, "fixedMax");

            var result = new NumericSequenceRange(); 
            result.hasDataRange = false;
            result.includeZero = includeZero;
            result.min = fixedMin;
            result.max = fixedMax;
            result._ensureIncludeZero();
            result._ensureNotEmpty();
            result._ensureDirection();
            result.hasFixedMin = true;
            result.hasFixedMax = true;

            return result;
        }
    }

    // Exported for testability
    export module ValueUtil {
        export function hasValue(value: any): boolean {
            return value !== undefined && value !== null;
        }
    }
}