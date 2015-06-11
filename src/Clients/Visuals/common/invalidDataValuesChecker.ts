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

module powerbi.visuals {
    import DataView = powerbi.DataView;

    export function getInvalidValueWarnings(
        dataViews: DataView[],
        supportsNaN: boolean,
        supportsNegativeInfinity: boolean,
        supportsPositiveInfinity: boolean): IVisualWarning[] {

        var checker: InvalidDataValuesChecker = new InvalidDataValuesChecker(
            supportsNaN /*supportsNaN*/,
            supportsNegativeInfinity /*supportsNegativeInfinity*/,
            supportsPositiveInfinity /*supportsPositiveInfinity*/);

        // Show a warning if necessary.
        return checker.getWarningMessages(dataViews);
    }

    class InvalidDataValuesChecker {
        private supportsNaN: boolean;
        private supportsNegativeInfinity: boolean;
        private supportsPositiveInfinity: boolean;

        private hasNaN: boolean;
        private hasNegativeInfinity: boolean;
        private hasPositiveInfinity: boolean;
        private hasOutOfRange: boolean;

        constructor(supportsNaN: boolean, supportsNegativeInfinity: boolean, supportsPositiveInfinity: boolean) {
            this.supportsNaN = supportsNaN;
            this.supportsNegativeInfinity = supportsNegativeInfinity;
            this.supportsPositiveInfinity = supportsPositiveInfinity;
        }

        public getWarningMessages(dataViews: DataView[]): IVisualWarning[] {
            this.loadWarningStatus(dataViews);

            var warnings: IVisualWarning[] = [];
            if (this.hasNaN && !this.supportsNaN) {
                warnings.push(new NaNNotSupportedWarning());
            }

            if ((this.hasNegativeInfinity && !this.supportsNegativeInfinity)
                || (this.hasPositiveInfinity && !this.supportsPositiveInfinity)) {
                warnings.push(new InfinityValuesNotSupportedWarning());
            }

            if (this.hasOutOfRange) {
                warnings.push(new ValuesOutOfRangeWarning());
            }

            return warnings;
        }

        private loadWarningStatus(dataViews: DataView[]) {
            this.hasNaN = false;
            this.hasNegativeInfinity = false;
            this.hasOutOfRange = false;
            this.hasPositiveInfinity = false;

            for (var k: number = 0; k < dataViews.length; k++) {
                var dataView = dataViews[k];
                var values = dataView && dataView.categorical && dataView.categorical.values
                    ? dataView.categorical.values
                    : null;

                if (!values)
                    return;

                var valueLength = values.length;
                for (var i: number = 0; i < valueLength; i++) {
                    var value = values[i];

                    if (value.values) {
                        var valueValueLength = value.values.length;
                        for (var j: number = 0; j < valueValueLength; j++) {
                            var v = value.values[j];

                            if (isNaN(v))
                                this.hasNaN = true;
                            else if (v === Number.POSITIVE_INFINITY)
                                this.hasPositiveInfinity = true;
                            else if (v === Number.NEGATIVE_INFINITY)
                                this.hasNegativeInfinity = true;
                            else if (v < -1e300 || v > 1e300)
                                this.hasOutOfRange = true;
                        }
                    }
                }
            }
        }
    }
} 