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

    var maxExponent = 24;
    var defaultScientificBigNumbersBoundary = 1E14;
    var scientificSmallNumbersBoundary = 1E-4;

    export class DisplayUnit {
        // Fields
        public value: number;
        public title: string;
        public labelFormat: string;
        public applicableRangeMin: number;
        public applicableRangeMax: number;

        // Methods
        public project(value: number): number {
            if (this.value) {
                return value / this.value;
            } else {
                return value;
            }
        }

        public reverseProject(value: number): number {
            if (this.value) {
                return value * this.value;
            } else {
                return value;
            }
        }

        public isApplicableTo(value: number): boolean {
            value = Math.abs(value);
            var precision = Double.getPrecision(value, 3);
            return Double.greaterOrEqualWithPrecision(value, this.applicableRangeMin, precision) && Double.lessWithPrecision(value, this.applicableRangeMax, precision);
        }
    }

    export class DisplayUnitSystem {

        // Constants
        static UNSUPPORTED_FORMATS = /^(p\d*)|(.*\%)|(e\d*)$/i;
        static NUMBER_FORMAT = /#|0/;

        // Fields
        public units: DisplayUnit[];
        public displayUnit: DisplayUnit;
        private _unitBaseValue: number;

        // Constructor
        constructor(units?: DisplayUnit[]) {
            this.units = units ? units : [];
        }

        // Properties
        public get title(): string {
            return this.displayUnit ? this.displayUnit.title : undefined;
        }

        // Methods
        public update(value: number): void {
            if (value === undefined)
                return;

            this._unitBaseValue = value;
            this.displayUnit = this.findApplicableDisplayUnit(value);
        }

        private findApplicableDisplayUnit(value: number): DisplayUnit {
            var count = this.units.length;
            for (var i = 0; i < count; i++) {
                var unit = this.units[i];
                if (unit.isApplicableTo(value)) {
                    return unit;
                }
            }
            return undefined;
        }

        public format(value: number, format: string, decimals?: number, trailingZeros?: boolean ): string {

            if (!DisplayUnitSystem.UNSUPPORTED_FORMATS.test(format)) {
                if (this.displayUnit) {
                    var projectedValue = this.displayUnit.project(value);
                    var nonScientificFormat = (trailingZeros)
                        ? DisplayUnitSystem.getNonScientificFormatWithPrecision(this.displayUnit.labelFormat, decimals)
                        : this.displayUnit.labelFormat;
                    return this.formatHelper(value, projectedValue, nonScientificFormat, format, decimals, trailingZeros);
                }
                if (decimals != null) {
                    if (trailingZeros && format && DisplayUnitSystem.NUMBER_FORMAT.test(format)) {
                        var formatWithPrecision = DisplayUnitSystem.getFormatWithPrecision(decimals);
                        format = format.replace(/0\.0*/g, formatWithPrecision);
                        return this.formatHelper(value, value, '', format, decimals, trailingZeros);
                    }
                    if (trailingZeros) {
                        var nonScientificFormat = DisplayUnitSystem.getNonScientificFormatWithPrecision('{0}', decimals);
                        return this.formatHelper(value, value, nonScientificFormat, format, decimals, trailingZeros);
                    }
                    return this.formatHelper(value, value, '', format, decimals, trailingZeros);
                }
            }

            format = this.removeFractionIfNecessary(format);
            return formattingService.formatValue(value, format);
        }

        private formatHelper(value: number, projectedValue: number, nonScientificFormat: string, format: string, decimals?: number, trailingZeros?: boolean) {
            var precision = (decimals != null) ? Double.pow10(decimals) : Double.getPrecision(value);
            
            var x = Double.roundToPrecision(projectedValue, precision);

            if (format && !formattingService.isStandardNumberFormat(format))
                return formattingService.formatNumberWithCustomOverride(x, format, nonScientificFormat);

            var textFormat = trailingZeros ? DisplayUnitSystem.getFormatWithPrecision(decimals) : 'G';
            var text = formattingService.formatValue(x, textFormat);
            return formattingService.format(nonScientificFormat, [text]);
        }

        private static getNonScientificFormatWithPrecision(baseFormat?: string, decimals?: number): string {
            if (!decimals || baseFormat === undefined)
                return baseFormat;

            var newFormat = "{0:" + DisplayUnitSystem.getFormatWithPrecision(decimals) + "}";

            return baseFormat.replace("{0}", newFormat);
        }

        private static getFormatWithPrecision(decimals?: number): string {
            if (decimals == null) return 'G';
            return "0." + jsCommon.StringExtensions.repeat('0',Math.abs(decimals));
        }

        /** Formats a single value by choosing an appropriate base for the DisplayUnitSystem before formatting. */
        public formatSingleValue(value: number, format: string, decimals?: number): string {
            // Change unit base to a value appropriate for this value
            this.update(this.shouldUseValuePrecision(value) ? Double.getPrecision(value, 8) : value);

            return this.format(value, format, decimals);
        }

        private shouldUseValuePrecision(value: number): boolean {
            if (this.units.length === 0)
                return true;

            // Check if the value is big enough to have a valid unit by checking against the smallest unit.
            return Math.abs(value) < this.units[0].applicableRangeMin;
        }

        private removeFractionIfNecessary(formatString: string): string {
            if (formatString) {
                if (Math.abs(this._unitBaseValue) >= 0.01) {
                    formatString = formatString.replace(/^(p\d*)$/i, "p0");
                }
                if (Math.abs(this._unitBaseValue) >= 1.0) {
                    formatString = formatString.replace(/[#0]\.[#0]+$/, "0"); // Custom number format with hash/zero fraction
                    formatString = formatString.replace(/^(n\d*)$/i, "n0");
                    formatString = formatString.replace(/^(f\d*)$/i, "f0");
                    formatString = formatString.replace(/^(c\d*)$/i, "c0");
                }
            }
            return formatString;
        }
    }

    /** Provides a unit system that is defined by formatting in the model, and is suitable for visualizations shown in single number visuals in explore mode. */
    export class NoDisplayUnitSystem extends DisplayUnitSystem {
        // Constructor
        constructor() {
            super([]);
        }
    }

    /** Provides a unit system that creates a more concise format for displaying values. This is suitable for most of the cases where
        we are showing values (chart axes) and as such it is the default unit system. */
    export class DefaultDisplayUnitSystem extends DisplayUnitSystem {
        private static _units: DisplayUnit[];
        private static _scientificBigNumbersBoundary: number;

        // Constructor
        constructor(unitLookup: (exponent: number) => DisplayUnitSystemNames) {
            super(DefaultDisplayUnitSystem.getUnits(unitLookup));
        }

        // Methods
        public format(data: number, format: string, decimals?: number, trailingZeros?: boolean): string {
            // Use scientific format outside of the range
            if (!this.displayUnit && this.isScientific(data)) {
                if (!format || format.toUpperCase().indexOf("E") < 0) {
                    format = "0.######E+0";
                }
            }
            return super.format(data, format, decimals, trailingZeros);
        }

        private isScientific(value: number): boolean {
            return value < - defaultScientificBigNumbersBoundary || value > defaultScientificBigNumbersBoundary ||
                (-scientificSmallNumbersBoundary < value && value < scientificSmallNumbersBoundary && value !== 0);
        }

        public static reset(): void {
            DefaultDisplayUnitSystem._units = null;
        }

        private static getUnits(unitLookup: (exponent: number) => DisplayUnitSystemNames): DisplayUnit[] {
            if (!DefaultDisplayUnitSystem._units) {
                DefaultDisplayUnitSystem._units = createDisplayUnits(unitLookup, (value: number, previousUnitValue: number, min: number) => {
                    // When dealing with millions/billions/trillions we need to switch to millions earlier: for example instead of showing 100K 200K 300K we should show 0.1M 0.2M 0.3M etc
                    if (value - previousUnitValue >= 1000) {
                        return value / 10;
                    }

                    return min;
                });

                // Set scientific value boundary
                DefaultDisplayUnitSystem._scientificBigNumbersBoundary = defaultScientificBigNumbersBoundary;
                for (var i = 0, len = DefaultDisplayUnitSystem._units.length; i < len; ++i) {
                    var unit = DefaultDisplayUnitSystem._units[i];
                    if (unit.applicableRangeMax > DefaultDisplayUnitSystem._scientificBigNumbersBoundary) {
                        DefaultDisplayUnitSystem._scientificBigNumbersBoundary = unit.applicableRangeMax;
                    }
                }
            }
            return DefaultDisplayUnitSystem._units;
        }
    }

    /** Provides a unit system that creates a more concise format for displaying values, but only allows showing a unit if we have at least
        one of those units (e.g. 0.9M is not allowed since it's less than 1 million). This is suitable for cases such as dashboard tiles
        where we have restricted space but do not want to show partial units. */
    export class WholeUnitsDisplayUnitSystem extends DisplayUnitSystem {
        private static _units: DisplayUnit[];

        // Constructor
        constructor(unitLookup: (exponent: number) => DisplayUnitSystemNames) {
            super(WholeUnitsDisplayUnitSystem.getUnits(unitLookup));
        }

        public static reset(): void {
            WholeUnitsDisplayUnitSystem._units = null;
        }

        private static getUnits(unitLookup: (exponent: number) => DisplayUnitSystemNames): DisplayUnit[] {
            if (!WholeUnitsDisplayUnitSystem._units) {
                WholeUnitsDisplayUnitSystem._units = createDisplayUnits(unitLookup);
            }
            return WholeUnitsDisplayUnitSystem._units;
        }
    }

    export interface DisplayUnitSystemNames {
        title: string;
        format: string;
    }

    function createDisplayUnits(unitLookup: (exponent: number) => DisplayUnitSystemNames, adjustMinBasedOnPreviousUnit?: (value: number, previousUnitValue: number, min: number) => number) {
        var units = [];
        for (var i = 3; i < maxExponent; i++) {
            var names = unitLookup(i);
            if (names)
                addUnitIfNonEmpty(units, Double.pow10(i), names.title, names.format, adjustMinBasedOnPreviousUnit);
        }

        return units;
    }

    function addUnitIfNonEmpty(
        units: DisplayUnit[],
        value: number,
        title: string,
        labelFormat: string,
        adjustMinBasedOnPreviousUnit?: (value: number, previousUnitValue: number, min: number) => number): void {
        if (title || labelFormat) {
            var min = value;

            if (units.length > 0) {
                var previousUnit = units[units.length - 1];

                if (adjustMinBasedOnPreviousUnit)
                    min = adjustMinBasedOnPreviousUnit(value, previousUnit.value, min);

                previousUnit.applicableRangeMax = min;
            }
            var unit = new DisplayUnit();
            unit.value = value;
            unit.applicableRangeMin = min;
            unit.applicableRangeMax = min * 1000;
            unit.title = title;
            unit.labelFormat = labelFormat;
            units.push(unit);
        }
    }
}