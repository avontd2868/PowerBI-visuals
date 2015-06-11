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
    export class NumericSequence {
        private static MIN_COUNT: number = 1;
        private static MAX_COUNT: number = 1000;

        private _maxAllowedMargin: number;
        private _canExtendMin: boolean;
        private _canExtendMax: boolean;

        public interval: number;
        public intervalOffset: number;
        public min: number;
        public max: number;
        public precision: number;
        public sequence: number[];

        public static calculate (range: NumericSequenceRange, expectedCount: number, maxAllowedMargin?: number, minPower?: number, useZeroRefPoint?: boolean, steps?: number[]): NumericSequence {
            debug.assertValue(range, "range");
            debug.assert(expectedCount === undefined || (expectedCount >= NumericSequence.MIN_COUNT && expectedCount <= NumericSequence.MAX_COUNT), "expectedCount");
            debug.assert(minPower === undefined|| (minPower >= Double.MIN_EXP && minPower <= Double.MAX_EXP), "minPower");
            debug.assert(maxAllowedMargin === undefined|| (maxAllowedMargin >= 0), "maxAllowedMargin");

            var result = new NumericSequence();

            if (expectedCount === undefined)
                expectedCount = 10;
            else
                expectedCount = Double.ensureInRange(expectedCount, NumericSequence.MIN_COUNT, NumericSequence.MAX_COUNT);
            if (minPower === undefined)
                minPower = Double.MIN_EXP;
            if (useZeroRefPoint === undefined)
                useZeroRefPoint = false;
            if (maxAllowedMargin === undefined)
                maxAllowedMargin = 1;
            if (steps === undefined)
                steps = [1, 2, 5];

            // Handle single stop case
            if (range.forcedSingleStop) {
                result.interval = range.getSize();
                result.intervalOffset = result.interval - (range.forcedSingleStop - range.min);
                result.min = range.min;
                result.max = range.max;
                result.sequence = [range.forcedSingleStop];
                return result;
            }

            var interval = 0;
            var min = 0;
            var max = 9;
            var canExtendMin = maxAllowedMargin > 0 && !range.hasFixedMin;
            var canExtendMax = maxAllowedMargin > 0 && !range.hasFixedMax;

            var size = range.getSize();
            var exp = Double.log10(size);

            // Account for Exp of steps
            var stepExp = Double.log10(steps[0]);
            exp = exp - stepExp;

            // Account for MaxCount
            var expectedCountExp = Double.log10(expectedCount);
            exp = exp - expectedCountExp;

            // Account for MinPower
            exp = Math.max(exp, minPower - stepExp + 1);

            // Create array of "good looking" numbers
            if (interval !== 0) {
                // If explicit interval is defined - use it instead of the steps array.
                var power = Double.pow10(exp);
                var roundMin = Double.floorToPrecision(range.min, power);
                var roundMax = Double.ceilToPrecision(range.max, power);
                var roundRange = NumericSequenceRange.calculateFixedRange(roundMin, roundMax);

                roundRange.shrinkByStep(range, interval);
                min = roundRange.min;
                max = roundRange.max;
                var count = Math.floor(roundRange.getSize() / interval);
            }
            else {
                // No interval defined -> find optimal interval
                var dexp;
                for (dexp = 0; dexp < 3; dexp++) {
                    var e = exp + dexp;
                    var power = Double.pow10(e);

                    var roundMin = Double.floorToPrecision(range.min, power);
                    var roundMax = Double.ceilToPrecision(range.max, power);

                    // Go throught the steps array looking for the smallest step that produces the right interval count.
                    var stepsCount = steps.length;
                    var stepPower = Double.pow10(e - 1);
                    for (var i = 0; i < stepsCount; i++) {
                        var step = steps[i] * stepPower;
                        var roundRange = NumericSequenceRange.calculateFixedRange(roundMin, roundMax, useZeroRefPoint);
                        roundRange.shrinkByStep(range, step);

                        // If the range is based on Data we might need to extend it to provide nice data margins.
                        if (canExtendMin && range.min === roundRange.min && maxAllowedMargin >= 1)
                            roundRange.min -= step;
                        if (canExtendMax && range.max === roundRange.max && maxAllowedMargin >= 1)
                            roundRange.max += step;

                        // Count the intervals
                        count = Double.ceilWithPrecision(roundRange.getSize() / step);

                        if (count <= expectedCount || (dexp === 2 && i === stepsCount - 1) || (expectedCount === 1 && count === 2 && (step > range.getSize() || (range.min < 0 && range.max > 0 && step * 2 >= range.getSize())))) {
                            interval = step;
                            min = roundRange.min;
                            max = roundRange.max;
                            break;
                        }
                    }

                    // Increase the scale power until the interval is found
                    if (interval !== 0)
                        break;
                }
            }

            // Avoid extreme count cases (>1000 ticks)
            if (count > expectedCount * 32 || count > NumericSequence.MAX_COUNT) {
                count = Math.min(expectedCount * 32, NumericSequence.MAX_COUNT);
                interval = (max - min) / count;
            }

            result.min = min;
            result.max = max;
            result.interval = interval;
            result.intervalOffset = min - range.min;
            result._maxAllowedMargin = maxAllowedMargin;
            result._canExtendMin = canExtendMin;
            result._canExtendMax = canExtendMax;

            // Fill in the Sequence
            var precision = Double.getPrecision(interval, 0);
            result.precision = precision;

            var sequence = [];

            var x = Double.roundToPrecision(min, precision);
            sequence.push(x);
            for (var i = 0; i < count; i++) {
                x = Double.roundToPrecision(x + interval, precision);
                sequence.push(x);
            }
            
            result.sequence = sequence;

            result.trimMinMax(range.min, range.max);

            return result;
        }

        /** Calculates the sequence of int numbers which are mapped to the multiples of the units grid. 
          * @min - The minimum of the range.
          * @max - The maximum of the range.
          * @maxCount - The max count of intervals.
          * @steps - array of intervals.
          */
        public static calculateUnits(min: number, max: number, maxCount: number, steps: number[]): NumericSequence {
            // Initialization actions
            maxCount = Double.ensureInRange(maxCount, NumericSequence.MIN_COUNT, NumericSequence.MAX_COUNT);
            if (min === max) {
                max = min + 1;
            }
            var stepCount = 0;
            var step = 0;

            // Calculate step
            for (var i = 0; i < steps.length; i++)
            {
                step = steps[i];
                var maxStepCount = Double.ceilWithPrecision(max / step);
                var minStepCount = Double.floorWithPrecision(min / step);
                stepCount = maxStepCount - minStepCount;
                    
                if (stepCount <= maxCount) {
                    break;
                }
            }

            // Calculate the offset
            var offset = -min;
            offset = offset % step;

            // Create sequence
            var result = new NumericSequence();
            result.sequence = [];
            for (var x = min + offset; ; x += step)
            {
                result.sequence.push(x);
                if (x >= max)
                    break;
            }
            result.interval = step;
            result.intervalOffset = offset;
            result.min = result.sequence[0];
            result.max = result.sequence[result.sequence.length - 1];
            return result;
        }

        public trimMinMax(min: number, max: number): void {        
            var minMargin = (min - this.min) / this.interval;
            var maxMargin = (this.max - max) / this.interval;
            var marginPrecision = 0.001;

            if (!this._canExtendMin || (minMargin > this._maxAllowedMargin && minMargin > marginPrecision)) {
                this.min = min;
            }

            if (!this._canExtendMax || (maxMargin > this._maxAllowedMargin && maxMargin > marginPrecision)) {
                this.max = max;
            }
        }
    }
}