//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi {

    import StringExtensions = jsCommon.StringExtensions;
    import Formatting = jsCommon.Formatting;

    // ================================================================================
    // Culture interfaces.  These match the Globalize library interfaces intentionally.
    // ================================================================================
    export interface Culture {
        name: string;
        calendar: Calendar;
        calendars: CalendarDictionary;
        numberFormat: NumberFormatInfo;
    }

    export interface Calendar {
        patterns: any;
        firstDay: number;
    }

    export interface CalendarDictionary {
        [key: string]: Calendar;
    }

    export interface NumberFormatInfo {
        decimals: number;
        groupSizes: number[];
        negativeInfinity: string;
        positiveInfinity: string;
    }

    // ================================================================================
    // Formatting Encoder
    // ================================================================================
    module FormattingEncoder {
        export function preserveEscaped(format: string, specialChars: string): string {
            // Unicode U+E000 - U+F8FF is a private area and so we can use the chars from the range to encode the escaped sequences
            var length = specialChars.length;
            for (var i = 0; i < length; i++) {
                var oldText = "\\" + specialChars[i];
                var newText = String.fromCharCode(0xE000 + i);
                format = StringExtensions.replaceAll(format, oldText, newText);
            }
            return format;
        }

        export function restoreEscaped(format: string, specialChars: string): string {
            // After formatting is complete we should restore the encoded escaped chars into the unescaped chars
            var length = specialChars.length;
            for (var i = 0; i < length; i++) {
                var oldText = String.fromCharCode(0xE000 + i);
                var newText = specialChars[i];
                format = StringExtensions.replaceAll(format, oldText, newText);
            }
            return StringExtensions.replaceAll(format, "\\", "");
        }

        export function preserveLiterals(format: string, literals: string[]): string {
            // Unicode U+E000 - U+F8FF is a private area and so we can use the chars from the range to encode the escaped sequences
            format = StringExtensions.replaceAll(format, "\"", "'");
            for (var i = 0; ; i++) {
                var fromIndex = format.indexOf("'");
                if (fromIndex < 0) {
                    break;
                }
                var toIndex = format.indexOf("'", fromIndex + 1);
                if (toIndex < 0) {
                    break;
                }
                var literal = format.substring(fromIndex, toIndex + 1);
                literals.push(literal.substring(1, toIndex - fromIndex));
                var token = String.fromCharCode(0xE100 + i);
                format = format.replace(literal, token);
            }
            return format;
        }

        export function restoreLiterals(format: string, literals: string[]): string {
            var count = literals.length;
            for (var i = 0; i < count; i++) {
                var token = String.fromCharCode(0xE100 + i);
                var literal = literals[i];
                format = format.replace(token, literal);
            }
            return format;
        }
    }

    // ================================================================================
    // FormattingService
    // ================================================================================
    class FormattingService implements IFormattingService {

        _currentCultureSelector: string;
        _currentCulture: Culture;
        _dateTimeScaleFormatInfo: DateTimeScaleFormatInfo;

        public formatValue(value: any, format?: string, culture?: string): string {
            // Handle special cases
            if (value === undefined || value === null) {
                return '';
            }
            var gculture = this.getCulture(culture);

            if (DateTimeFormat.canFormat(value)) {
                // Dates
                return DateTimeFormat.format(value, format, gculture);
            } else if (NumberFormat.canFormat(value)) {
                // Numbers
                return NumberFormat.format(value, format, gculture);
            } else {
                // Other data types - return as string
                return value.toString();
            }
        }

        public format(formatWithIndexedTokens: string, args: any[], culture?: string): string {
            if (!formatWithIndexedTokens) {
                return "";
            }
            var result = formatWithIndexedTokens.replace(/({{)|(}})|{(\d+[^}]*)}/g, (match: string, left: string, right: string, argToken: string) => {
                if (left) {
                    return "{";
                } else if (right) {
                    return "}";
                } else {
                    var parts = argToken.split(":");
                    var argIndex = parseInt(parts[0], 10);
                    var argFormat = parts[1];
                    return this.formatValue(args[argIndex], argFormat, culture);
                }
                return "";
            });

            return result;
        }

        public isStandardNumberFormat(format: string): boolean {
            return NumberFormat.isStandardFormat(format);
        }

        public formatNumberWithCustomOverride(value: number, format: string, nonScientificOverrideFormat: string, culture?: string): string {
            var gculture = this.getCulture(culture);

            return NumberFormat.formatWithCustomOverride(value, format, nonScientificOverrideFormat, gculture);
        }

        public dateFormatString(unit: DateTimeUnit): string {
            return this._dateTimeScaleFormatInfo.getFormatString(unit);
        }

        /** Sets the current localization culture
          * @param cultureSelector - name of a culture: "en", "en-UK", "fr-FR" etc. (See National Language Support (NLS) for full lists. Use "default" for invariant culture).
          */
        private setCurrentCulture(cultureSelector: string): void {
            if (this._currentCultureSelector !== cultureSelector) {
                this._currentCulture = this.getCulture(cultureSelector);
                this._currentCultureSelector = cultureSelector;
                this._dateTimeScaleFormatInfo = new DateTimeScaleFormatInfo(this._currentCulture);
            }
        }

        /** Gets the culture assotiated with the specified cultureSelector ("en", "en-US", "fr-FR" etc). 
          * @param cultureSelector - name of a culture: "en", "en-UK", "fr-FR" etc. (See National Language Support (NLS) for full lists. Use "default" for invariant culture).
          * Exposing this function for testability of unsupported cultures */
        public getCulture(cultureSelector?: string): Culture {
            if (cultureSelector == null) {
                if (this._currentCulture == null) {
                    this.initialize();
                }
                return this._currentCulture;
            } else {
                var culture = Globalize.findClosestCulture(cultureSelector);
                if (!culture)
                    culture = Globalize.culture("en-US");
                return culture;
            }
        }

        // By default the Globalization module initializes to the culture/calendar provided in the language/culture URL params
        private initialize() {
            var cultureName = this.getUrlParam("language") || window["cultureInfo"] || window.navigator.userLanguage || window.navigator["language"] || Globalize.culture().name;
            this.setCurrentCulture(cultureName);
            var calendarName = this.getUrlParam("calendar");
            if (calendarName) {
                var culture = this._currentCulture;
                var c = culture.calendars[calendarName];
                if (c) {
                    culture.calendar = c;
                }
            }
        }

        private getUrlParam(name: string): string {
            var param = window.location.search.match(RegExp("[?&]" + name + "=([^&]*)"));
            return param ? param[1] : undefined;
        }
    }

    // ================================================================================
    // DateTimeFormat
    // --------------------------------------------------------------------------------
    // DateTimeFormat module contains the static methods for formatting the DateTimes. 
    // It extends the JQuery.Globalize functionality to support complete set of .NET 
    // formatting expressions for dates.
    // ================================================================================
    module DateTimeFormat {

        var _currentCachedFormat: string;
        var _currentCachedProcessedFormat: string;

        // Evaluates if the value can be formatted using the NumberFormat
        export function canFormat(value: any) {
            var result = value instanceof Date;
            return result;
        }

        // Formats the date using provided format and culture
        export function format(value: Date, format: string, culture: Culture): string {
            format = format || "G";
            var isStandard = format.length === 1;
            try {
                if (isStandard) {
                    return formatDateStandard(value, format, culture);
                } else {
                    return formatDateCustom(value, format, culture);
                }
            } catch (e) {
                return formatDateStandard(value, "G", culture);
            }
        }

        // Formats the date using standard format expression
        function formatDateStandard(value: Date, format: string, culture: Culture) {
            // In order to provide parity with .NET we have to support additional set of DateTime patterns.
            var patterns = culture.calendar.patterns;
            // Extend supported set of patterns
            ensurePatterns(culture.calendar);
            // Handle extended set of formats
            var output = Formatting.findDateFormat(value, format, culture.name);
            if (output.format.length === 1)
                format = patterns[output.format];
            else
                format = output.format;
            //need to revisit when globalization is enabled
            culture = Globalize.culture("en-US");
            return Globalize.format(output.value, format, culture);
        }

        // Formats the date using custom format expression
        function formatDateCustom(value: Date, format: string, culture: Culture): string {
            var result: string;
            var literals: string[] = [];
            format = FormattingEncoder.preserveEscaped(format, "\\dfFghHKmstyz:/%'\"");
            format = FormattingEncoder.preserveLiterals(format, literals);
            format = StringExtensions.replaceAll(format, "\"", "'");
            if (format.indexOf("F") > -1) {
                // F is not supported so we need to replace the F with f based on the milliseconds                        
                // Replace all sequences of F longer than 3 with "FFF"
                format = StringExtensions.replaceAll(format, "FFFF", "FFF");
                // Based on milliseconds update the format to use fff
                var milliseconds = value.getMilliseconds();
                if (milliseconds % 10 >= 1) {
                    format = StringExtensions.replaceAll(format, "FFF", "fff");
                }
                format = StringExtensions.replaceAll(format, "FFF", "FF");
                if ((milliseconds % 100) / 10 >= 1) {
                    format = StringExtensions.replaceAll(format, "FF", "ff");
                }
                format = StringExtensions.replaceAll(format, "FF", "F");
                if ((milliseconds % 1000) / 100 >= 1) {
                    format = StringExtensions.replaceAll(format, "F", "f");
                }
                format = StringExtensions.replaceAll(format, "F", "");
                if (format === "" || format === "%")
                    return "";
            }
            format = processCustomDateTimeFormat(format);
            result = Globalize.format(value, format, culture);
            result = localize(result, culture.calendar);
            result = FormattingEncoder.restoreLiterals(result, literals);
            result = FormattingEncoder.restoreEscaped(result, "\\dfFghHKmstyz:/%'\"");
            return result;
        }

        // Translates unsupported .NET custom format expressions to the custom expressions supported by JQuery.Globalize
        function processCustomDateTimeFormat(format: string): string {
            if (format === _currentCachedFormat) {
                return _currentCachedProcessedFormat;
            }
            _currentCachedFormat = format;
            format = Formatting.fixDateTimeFormat(format);
            _currentCachedProcessedFormat = format;
            return format;
        }

        // Localizes the time separator symbol
        function localize(value: string, dictionary: any): string {
            var timeSeparator = dictionary[":"];
            if (timeSeparator === ":") {
                return value;
            }
            var result = "";
            var count = value.length;
            for (var i = 0; i < count; i++) {
                var char = value.charAt(i);
                switch (char) {
                    case ":":
                        result += timeSeparator;
                        break;
                    default:
                        result += char;
                        break;
                }
            }
            return result;
        }

        function ensurePatterns(calendar: GlobalizeCalendar) {
            var patterns = calendar.patterns;
            if (patterns["g"] === undefined) {
                patterns["g"] = patterns["f"].replace(patterns["D"], patterns["d"]);  // Generic: Short date, short time
                patterns["G"] = patterns["F"].replace(patterns["D"], patterns["d"]);  // Generic: Short date, long time
            }
        }

    }

    // ================================================================================
    // NumberFormat
    // --------------------------------------------------------------------------------
    // NumberFormat module contains the static methods for formatting the numbers. 
    // It extends the JQuery.Globalize functionality to support complete set of .NET 
    // formatting expressions for numeric types including custom formats.
    // ================================================================================
    export module NumberFormat {

        export interface NumericFormatMetadata {
            format: string;
            hasEscapes: boolean
            hasQuotes: boolean;
            hasE: boolean;
            hasCommas: boolean;
            hasDots: boolean;
            hasPercent: boolean;
            hasPermile: boolean;
            precision: number;
            scale: number;
        }

        var _lastCustomFormatMeta: NumericFormatMetadata;

        // Evaluates if the value can be formatted using the NumberFormat
        export function canFormat(value: any) {
            var result = typeof (value) === "number";
            return result;
        }

        export function isStandardFormat(format: string): boolean {
            debug.assertValue(format, 'format');

            var standardFormatRegex = /^[a-z]\d{0,2}$/gi;  // a letter + up to 2 digits for precision specifier
            return standardFormatRegex.test(format);
        }

        // Formats the number using specified format expression and culture
        export function format(
            value: number,
            format: string,
            culture: Culture): string {
            format = format || "G";
            try {
                if (isStandardFormat(format))
                    return formatNumberStandard(value, format, culture);

                return formatNumberCustom(value, format, culture);
            } catch (e) {
                return Globalize.format(value, undefined, culture);
            }
        }

        /** Performs a custom format with a value override.  Typically used for custom formats showing scaled values. */
        export function formatWithCustomOverride(
            value: number,
            format: string,
            nonScientificOverrideFormat: string,
            culture: Culture): string {
            debug.assertValue(value, 'value');
            debug.assertValue(format, 'format');
            debug.assertValue(nonScientificOverrideFormat, 'nonScientificOverrideFormat');
            debug.assertValue(culture, 'culture');
            debug.assert(!isStandardFormat(format), 'Standard format');

            return formatNumberCustom(value, format, culture, nonScientificOverrideFormat);
        }

        // Formats the number using standard format expression
        function formatNumberStandard(value: number, format: string, culture: Culture): string {
            var result: string;
            var precision = <number>(format.length > 1 ? parseInt(format.substr(1, format.length - 1), 10) : undefined);
            var numberFormatInfo = culture.numberFormat;
            var formatChar = format.charAt(0);
            switch (formatChar) {
                case "e":
                case "E":
                    if (precision === undefined) {
                        precision = 6;
                    }
                    var mantissaDecimalDigits = StringExtensions.repeat("0", precision);
                    format = "0." + mantissaDecimalDigits + formatChar + "+000";
                    result = formatNumberCustom(value, format, culture);
                    break;
                case "f":
                case "F":
                    result = precision !== undefined ? value.toFixed(precision) : value.toFixed(numberFormatInfo.decimals);
                    result = localize(result, numberFormatInfo);
                    break;
                case "g":
                case "G":
                    var abs = Math.abs(value);
                    if (abs === 0 || (1E-4 <= abs && abs < 1E15)) {
                        // For the range of 0.0001 to 1,000,000,000,000,000 - use the normal form
                        result = precision !== undefined ? value.toPrecision(precision) : value.toString();
                    } else {
                        // Otherwise use exponential
                        result = precision !== undefined ? value.toExponential(precision) : value.toExponential();
                        result = result.replace("e", "E");
                    }
                    result = localize(result, numberFormatInfo);
                    break;
                case "r":
                case "R":
                    result = value.toString();
                    result = localize(result, numberFormatInfo);
                    break;
                case "x":
                case "X":
                    result = value.toString(16);
                    if (formatChar === "X") {
                        result = result.toUpperCase();
                    }
                    if (precision !== undefined) {
                        var actualPrecision = result.length;
                        var isNegative = value < 0;
                        if (isNegative) {
                            actualPrecision--;
                        }
                        var paddingZerosCount = precision - actualPrecision;
                        if (paddingZerosCount > 0) {
                            var paddingZeros = StringExtensions.repeat("0", paddingZerosCount);
                        }
                        if (isNegative) {
                            result = "-" + paddingZeros + result.substr(1);
                        } else {
                            result = paddingZeros + result;
                        }
                    }
                    result = localize(result, numberFormatInfo);
                    break;
                default:
                    result = Globalize.format(value, format, culture);
            }
            return result;
        }

        // Formats the number using custom format expression
        function formatNumberCustom(
            value: number,
            format: string,
            culture: Culture,
            nonScientificOverrideFormat?: string): string {
            var result: string;
            var numberFormatInfo = culture.numberFormat;
            if (isFinite(value)) {
                // Split format into positive/zero/negative patterns
                var signSpecificFormats = format.split(";");
                if (signSpecificFormats.length > 1) {
                    var negativeFormat = format;
                    var positiveFormat = format;
                    var zeroFormat = format;
                    if (signSpecificFormats.length === 2) {
                        positiveFormat = zeroFormat = signSpecificFormats[0];
                        negativeFormat = signSpecificFormats[1];
                    } else {
                        positiveFormat = signSpecificFormats[0];
                        negativeFormat = signSpecificFormats[1];
                        zeroFormat = signSpecificFormats[2];
                    }
                    // Pick a format based on the sign of value
                    if (value > 0) {
                        format = positiveFormat;
                    } else if (value === 0) {
                        format = zeroFormat;
                    } else {
                        format = negativeFormat;
                    }
                    value = Math.abs(value);
                }

                // Get format metadata
                var formatMeta = getCustomFormatMetadata(format);

                // Preserve literals and escaped chars
                if (formatMeta.hasEscapes) {
                    format = FormattingEncoder.preserveEscaped(format, "\\0#.,%‰");
                }
                var literals: string[] = [];
                if (formatMeta.hasQuotes) {
                    format = FormattingEncoder.preserveLiterals(format, literals);
                }

                // Scientific format
                if (formatMeta.hasE && !nonScientificOverrideFormat) {
                    var scientificMatch = /e[+-]*0+/gi.exec(format);
                    if (scientificMatch) {
                        // Case 2.1. Scientific custom format
                        var formatM = format.substr(0, scientificMatch.index);
                        var formatE = format.substr(scientificMatch.index + scientificMatch[0].indexOf("0"));
                        var precision = getCustomFormatPrecision(formatM, formatMeta);
                        var scale = getCustomFormatScale(formatM, formatMeta);
                        if (scale !== 1) {
                            value = value * scale;
                        }
                        var s = value.toExponential(precision);
                        var indexOfE = s.indexOf("e");
                        var mantissa = s.substr(0, indexOfE);
                        var exp = s.substr(indexOfE + 1);
                        var resultM = fuseNumberWithCustomFormat(mantissa, formatM, numberFormatInfo);
                        var resultE = fuseNumberWithCustomFormat(exp, formatE, numberFormatInfo);
                        if (resultE.charAt(0) === "+" && scientificMatch[0].charAt(1) !== "+") {
                            resultE = resultE.substr(1);
                        }
                        var e = scientificMatch[0].charAt(0);
                        result = resultM + e + resultE;
                    }
                }

                // Non scientific format
                if (result === undefined) {
                    var valueFormatted: string;
                    if (nonScientificOverrideFormat) {
                        valueFormatted = formattingService.format(nonScientificOverrideFormat, [value], culture.name);
                    } else {
                        var precision = getCustomFormatPrecision(format, formatMeta);
                        var scale = getCustomFormatScale(format, formatMeta);
                        if (scale !== 1) {
                            value = value * scale;
                        }
                        valueFormatted = toNonScientific(value, precision);
                    }
                    result = fuseNumberWithCustomFormat(valueFormatted, format, numberFormatInfo, !!nonScientificOverrideFormat);
                }
                if (formatMeta.hasQuotes) {
                    result = FormattingEncoder.restoreLiterals(result, literals);
                }
                if (formatMeta.hasEscapes) {
                    result = FormattingEncoder.restoreEscaped(result, "\\0#.,%‰");
                }

                _lastCustomFormatMeta = formatMeta;
            } else {
                return Globalize.format(value, undefined);
            }
            return result;
        }

        // Returns string with the fixed point respresentation of the number
        function toNonScientific(value: number, precision: number): string {
            var result = "";
            var precisionZeros = 0;
            // Double precision numbers support actual 15-16 decimal digits of precision.
            if (precision > 16) {
                precisionZeros = precision - 16;
                precision = 16;
            }
            var digitsBeforeDecimalPoint = Double.log10(Math.abs(value));
            if (digitsBeforeDecimalPoint < 16) {
                if (digitsBeforeDecimalPoint > 0) {
                    var maxPrecision = 16 - digitsBeforeDecimalPoint;
                    if (precision > maxPrecision) {
                        precisionZeros += precision - maxPrecision;
                        precision = maxPrecision;
                    }
                }
                result = value.toFixed(precision);
            } else if (digitsBeforeDecimalPoint === 16) {
                result = value.toFixed(0);
                precisionZeros += precision;
                if (precisionZeros > 0) {
                    result += ".";
                }
            } else { // digitsBeforeDecimalPoint > 16
                // Different browsers have different implementations of the toFixed(). 
                // In IE it returns fixed format no matter what's the number. In FF and Chrome the method returns exponential format for numbers greater than 1E21.
                // So we need to check for range and convert the to exponential with the max precision. 
                // Then we convert exponential string to fixed by removing the dot and padding with "power" zeros.
                result = value.toExponential(15);
                var indexOfE = result.indexOf("e");
                if (indexOfE > 0) {
                    var indexOfDot = result.indexOf(".");
                    var mantissa = result.substr(0, indexOfE);
                    var exp = result.substr(indexOfE + 1);
                    var powerZeros = parseInt(exp, 10) - (mantissa.length - indexOfDot - 1);
                    result = mantissa.replace(".", "") + StringExtensions.repeat("0", powerZeros);
                    if (precision > 0) {
                        result = result + "." + StringExtensions.repeat("0", precision);
                    }
                }
            }
            if (precisionZeros > 0) {
                result = result + StringExtensions.repeat("0", precisionZeros);
            }
            return result;
        }

        // Returns the formatMetadata of the format
        export function getCustomFormatMetadata(format: string): NumericFormatMetadata {
            if (_lastCustomFormatMeta !== undefined && format === _lastCustomFormatMeta.format) {
                return _lastCustomFormatMeta;
            }
            var result = {
                format: format,
                hasEscapes: false,
                hasQuotes: false,
                hasE: false,
                hasCommas: false,
                hasDots: false,
                hasPercent: false,
                hasPermile: false,
                precision: -1,
                scale: -1,
            };
            var length = format.length;
            for (var i = 0; i < length; i++) {
                var c = format.charAt(i);
                switch (c) {
                    case "\\":
                        result.hasEscapes = true;
                        break;
                    case "'":
                    case "\"":
                        result.hasQuotes = true;
                        break;
                    case "e":
                    case "E":
                        result.hasE = true;
                        break;
                    case ",":
                        result.hasCommas = true;
                        break;
                    case ".":
                        result.hasDots = true;
                        break;
                    case "%":
                        result.hasPercent = true;
                        break;
                    case "‰":
                        result.hasPermile = true;
                        break;
                }
            }
            return result;
        }

        // Returns the decimal precision of format based on the number of # and 0 chars after the decimal point
        function getCustomFormatPrecision(format: string, formatMeta: NumericFormatMetadata): number {
            if (formatMeta.precision > -1) {
                return formatMeta.precision;
            }
            var result = 0;
            if (formatMeta.hasDots) {
                var dotIndex = format.indexOf(".");
                if (dotIndex > -1) {
                    var count = format.length;
                    for (var i = dotIndex; i < count; i++) {
                        var char = format.charAt(i);
                        if (char === "#" || char === "0")
                            result++;
                    }
                    result = Math.min(19, result);
                }
            }
            formatMeta.precision = result;
            return result;
        }

        // Returns the scale factor of the format based on the "%" and scaling "," chars in the format
        function getCustomFormatScale(format: string, formatMeta: NumericFormatMetadata): number {
            if (formatMeta.scale > -1) {
                return formatMeta.scale;
            }
            var result = 1;
            if (formatMeta.hasPercent && format.indexOf("%") > -1) {
                result = result * 100;
            }
            if (formatMeta.hasPermile && format.indexOf("‰") > -1) {
                result = result * 1000;
            }
            if (formatMeta.hasCommas) {
                var dotIndex = format.indexOf(".");
                if (dotIndex === -1) {
                    dotIndex = format.length;
                }
                for (var i = dotIndex - 1; i > -1; i--) {
                    var char = format.charAt(i);
                    if (char === ",") {
                        result = result / 1000;
                    } else {
                        break;
                    }
                }
            }
            formatMeta.scale = result;
            return result;
        }

        function fuseNumberWithCustomFormat(value: string, format: string, numberFormatInfo: GlobalizeNumberFormat, suppressModifyValue?: boolean): string {
            var formatParts = format.split(".", 2);
            if (formatParts.length === 2) {
                var wholeFormat = formatParts[0];
                var fractionFormat = formatParts[1];

                var valueParts = value.split(".", 2);
                var wholeValue = valueParts[0];
                var fractionValue = valueParts.length === 2 ? valueParts[1].replace(/0+$/, "") : "";

                var wholeFormattedValue = fuseNumberWithCustomFormatLeft(wholeValue, wholeFormat, numberFormatInfo, suppressModifyValue);
                var fractionFormattedValue = fuseNumberWithCustomFormatRight(fractionValue, fractionFormat, suppressModifyValue);

                if (fractionFormattedValue.fmtOnly || fractionFormattedValue.value === "")
                    return wholeFormattedValue + fractionFormattedValue.value;

                return wholeFormattedValue + numberFormatInfo["."] + fractionFormattedValue.value;
            }
            return fuseNumberWithCustomFormatLeft(value, format, numberFormatInfo, suppressModifyValue);
        }

        function fuseNumberWithCustomFormatLeft(value: string, format: string, numberFormatInfo: GlobalizeNumberFormat, suppressModifyValue?: boolean): string {
            var groupSymbolIndex = format.indexOf(",");
            var enableGroups = groupSymbolIndex > -1 && groupSymbolIndex < Math.max(format.lastIndexOf("0"), format.lastIndexOf("#")) && numberFormatInfo[","];
            var groupDigitCount = 0;
            var groupIndex = 0;
            var groupSizes = numberFormatInfo.groupSizes || [3];
            var groupSize = groupSizes[0];
            var groupSeparator = numberFormatInfo[","];
            var sign = "";
            var firstChar = value.charAt(0);
            if (firstChar === "+" || firstChar === "-") {
                sign = numberFormatInfo[firstChar];
                value = value.substr(1);
            }
            var isZero = value === "0";
            var result = "";
            var leftBuffer = "";
            var vi = value.length - 1;
            var fmtOnly = true;
            // Iterate through format chars and replace 0 and # with the digits from the value string
            for (var fi = format.length - 1; fi > -1; fi--) {
                var formatChar = format.charAt(fi);
                switch (formatChar) {
                    case "0":
                    case "#":
                        fmtOnly = false;
                        if (leftBuffer !== "") {
                            result = leftBuffer + result;
                            leftBuffer = "";
                        }
                        if (!suppressModifyValue) {
                            if (vi > -1 || formatChar === "0") {
                                if (enableGroups) {
                                    // If the groups are enabled we'll need to keep track of the current group index and periodically insert group separator,
                                    if (groupDigitCount === groupSize) {
                                        result = groupSeparator + result;
                                        groupIndex++;
                                        if (groupIndex < groupSizes.length) {
                                            groupSize = groupSizes[groupIndex];
                                        }
                                        groupDigitCount = 1;
                                    } else {
                                        groupDigitCount++;
                                    }
                                }
                            }
                            if (vi > -1) {
                                if (isZero && formatChar === "#") {
                                    // Special case - if we need to format a zero value and the # symbol is used - we don't copy it into the result)
                                } else {
                                    result = value.charAt(vi) + result;
                                }
                                vi--;
                            } else if (formatChar !== "#") {
                                result = formatChar + result;
                            }
                        }
                        break;
                    case ",":
                        // We should skip all the , chars
                        break;
                    default:
                        leftBuffer = formatChar + leftBuffer;
                        break;
                }
            }

            // If the value didn't fit into the number of zeros provided in the format then we should insert the missing part of the value into the result
            if (!suppressModifyValue) {
                if (vi > -1 && result !== "") {
                    if (enableGroups) {
                        while (vi > -1) {
                            if (groupDigitCount === groupSize) {
                                result = groupSeparator + result;
                                groupIndex++;
                                if (groupIndex < groupSizes.length) {
                                    groupSize = groupSizes[groupIndex];
                                }
                                groupDigitCount = 1;
                            } else {
                                groupDigitCount++;
                            }
                            result = value.charAt(vi) + result;
                            vi--;
                        }
                    } else {
                        result = value.substr(0, vi + 1) + result;
                    }
                }
                // Insert sign in front of the leftBuffer and result
                return sign + leftBuffer + result;
            }

            if (fmtOnly)
                // If the format doesn't specify any digits to be displayed, then just return the format we've parsed up until now.
                return sign + leftBuffer;

            return sign + leftBuffer + value;
        }

        function fuseNumberWithCustomFormatRight(value: string, format: string, suppressModifyValue?: boolean): { value: string; fmtOnly?: boolean } {
            var vi = 0;
            var fCount = format.length;
            var vCount = value.length;
            if (suppressModifyValue) {
                debug.assert(fCount > 0, "Empty formatting string");

                if ((format.charAt(fCount - 1) !== "0") && (format.charAt(fCount - 1) !== "#"))
                    return {
                        value: value + format.charAt(fCount - 1),
                        fmtOnly: value === "",
                    };

                return {
                    value: value,
                    fmtOnly: value === "",
                };
            }

            var result = "",
                fmtOnly: boolean = true;
            for (var fi = 0; fi < fCount; fi++) {
                var formatChar = format.charAt(fi);
                if (vi < vCount) {
                    switch (formatChar) {
                        case "0":
                        case "#":
                            result += value[vi++];
                            fmtOnly = false;
                            break;
                        default:
                            result += formatChar;
                    }
                } else {
                    if (formatChar !== "#") {
                        result += formatChar;
                        fmtOnly = fmtOnly && (formatChar !== "0");
                    }
                }
            }

            return {
                value: result,
                fmtOnly: fmtOnly,
            };
        }

        function localize(value: string, dictionary: any): string {
            var plus = dictionary["+"];
            var minus = dictionary["-"];
            var dot = dictionary["."];
            var comma = dictionary[","];
            if (plus === "+" && minus === "-" && dot === "." && comma === ",") {
                return value;
            }
            var count = value.length;
            var result = "";
            for (var i = 0; i < count; i++) {
                var char = value.charAt(i);
                switch (char) {
                    case "+":
                        result = result + plus;
                        break;
                    case "-":
                        result = result + minus;
                        break;
                    case ".":
                        result = result + dot;
                        break;
                    case ",":
                        result = result + comma;
                        break;
                    default:
                        result = result + char;
                        break;
                }
            }
            return result;
        }

    }

    /** DateTimeScaleFormatInfo is used to calculate and keep the Date formats used for different units supported by the DateTimeScaleModel */
    class DateTimeScaleFormatInfo {

        // Fields
        public YearPattern: string;
        public MonthPattern: string;
        public DayPattern: string;
        public HourPattern: string;
        public MinutePattern: string;
        public SecondPattern: string;
        public MillisecondPattern: string;

        // Constructor
        /** Creates new instance of the DateTimeScaleFormatInfo class.
          * @param culture - culture which calendar info is going to be used to derive the formats.
          */
        constructor(culture: Culture) {
            var calendar: Calendar = culture.calendar;
            var patterns: any = calendar.patterns;
            var monthAbbreviations: any = calendar["months"]["namesAbbr"];
            var cultureHasMonthAbbr: boolean = monthAbbreviations && monthAbbreviations[0];
            var yearMonthPattern: string = patterns["Y"];
            var monthDayPattern: string = patterns["M"];
            var fullPattern: string = patterns["f"];
            var longTimePattern: string = patterns["T"];
            var shortTimePattern: string = patterns["t"];
            var separator: string = fullPattern.indexOf(",") > -1 ? ", " : " ";

            var hasYearSymbol: boolean = yearMonthPattern.indexOf("yyyy'") === 0 && yearMonthPattern.length > 6 && yearMonthPattern[6] === '\'';
            this.YearPattern = hasYearSymbol ? yearMonthPattern.substr(0, 7) : "yyyy";

            var yearPos: number = fullPattern.indexOf("yy");
            var monthPos: number = fullPattern.indexOf("MMMM");
            this.MonthPattern = cultureHasMonthAbbr && monthPos > -1 ? (yearPos > monthPos ? "MMM yyyy" : "yyyy MMM") : yearMonthPattern;

            this.DayPattern = cultureHasMonthAbbr ? monthDayPattern.replace("MMMM", "MMM") : monthDayPattern;

            var minutePos: number = fullPattern.indexOf("mm");
            var pmPos: number = fullPattern.indexOf("tt");
            var shortHourPattern: string = pmPos > -1 ? shortTimePattern.replace(":mm ", "") : shortTimePattern;
            this.HourPattern = yearPos < minutePos ? this.DayPattern + separator + shortHourPattern : shortHourPattern + separator + this.DayPattern;

            this.MinutePattern = shortTimePattern;

            this.SecondPattern = longTimePattern;

            this.MillisecondPattern = longTimePattern.replace("ss", "ss.fff");

            // Special cases
            switch (culture.name) {
                case "fi-FI":
                    this.DayPattern = this.DayPattern.replace("'ta'", ""); // Fix for finish 'ta' suffix for month names.
                    this.HourPattern = this.HourPattern.replace("'ta'", "");
                    break;
            }
        }

        // Methods

        /** Returns the format string of the provided DateTimeUnit.
          * @param unit - date or time unit
          */
        public getFormatString(unit: DateTimeUnit): string {
            switch (unit) {
                case DateTimeUnit.Year:
                    return this.YearPattern;
                case DateTimeUnit.Month:
                    return this.MonthPattern;
                case DateTimeUnit.Week:
                case DateTimeUnit.Day:
                    return this.DayPattern;
                case DateTimeUnit.Hour:
                    return this.HourPattern;
                case DateTimeUnit.Minute:
                    return this.MinutePattern;
                case DateTimeUnit.Second:
                    return this.SecondPattern;
                case DateTimeUnit.Millisecond:
                    return this.MillisecondPattern;
            }

            debug.assertFail('Unexpected unit: ' + unit);
        }
    }

    export var formattingService: IFormattingService = new FormattingService();
}

