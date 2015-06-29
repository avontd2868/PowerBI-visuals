//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    /** Formats the value using provided format expression and culture
    * @param value - value to be formatted and converted to string.
    * @param format - format to be applied if the number shouldn't be abbreviated.
    * If the number should be abbreviated this string is checked for special characters like $ or % if any
    */
    export interface ICustomValueFormatter {
        (value: any, format?: string): string;
    }

    export interface ValueFormatterOptions {
        /** The format string to use. */
        format?: string;

        /** The data value. */
        value?: any;

        /** The data value. */
        value2?: any;

        /** The number of ticks. */
        tickCount?: any;

        /** The display unit system to use */
        displayUnitSystemType?: DisplayUnitSystemType;

        /** True if we are formatting single values in isolation (e.g. card), as opposed to multiple values with a common base (e.g. chart axes) */
        formatSingleValues?: boolean;

        /** Specifies the maximum number of decimal places to show*/
        precision?: number;
    }

    export interface IValueFormatter {
        format(value: any): string;
        displayUnit?: DisplayUnit;
    }

    /** Captures all locale-specific options used by the valueFormatter. */
    export interface ValueFormatterLocalizationOptions {
        null: string;
        true: string;
        false: string;

        /** Returns a beautified form the given format string. */
        beautify(format: string): string;

        /** Returns an object describing the given exponent in the current language. */
        describe(exponent: number): DisplayUnitSystemNames;
        restatementComma: string;
        restatementCompoundAnd: string;
    }

    export module valueFormatter {
        import StringExtensions = jsCommon.StringExtensions;
        var BeautifiedFormat: { [x: string]: string } = {
            '0.00 %;-0.00 %;0.00 %': 'Percentage',
        };

        var defaultLocalizedStrings = {
            'NullValue': '(Blank)',
            'BooleanTrue': 'True',
            'BooleanFalse': 'False',
            'RestatementComma': '{0}, {1}',
            'RestatementCompoundAnd': '{0} and {1}',
            'DisplayUnitSystem_E3_LabelFormat': '{0}K',
            'DisplayUnitSystem_E3_Title': 'Thousands',
            'DisplayUnitSystem_E6_LabelFormat': '{0}M',
            'DisplayUnitSystem_E6_Title': 'Millions',
            'DisplayUnitSystem_E9_LabelFormat': '{0}bn',
            'DisplayUnitSystem_E9_Title': 'Billions',
            'DisplayUnitSystem_E12_LabelFormat': '{0}T',
            'DisplayUnitSystem_E12_Title': 'Trillions',
            'Percentage': '#,0.##%',
            'TableTotalLabel': 'Total',
            'Tooltip_HighlightedValueDisplayName': 'Highlighted',
            // Geotagging strings
            'GeotaggingString_Continent': 'continent',
            'GeotaggingString_Continents': 'continents',
            'GeotaggingString_Country': 'country',
            'GeotaggingString_Countries': 'countries',
            'GeotaggingString_State': 'state',
            'GeotaggingString_States': 'states',
            'GeotaggingString_City': 'city',
            'GeotaggingString_Cities': 'cities',
            'GeotaggingString_Town': 'town',
            'GeotaggingString_Towns': 'towns',
            'GeotaggingString_Province': 'province',
            'GeotaggingString_Provinces': 'provinces',
            'GeotaggingString_County': 'county',
            'GeotaggingString_Counties': 'counties',
            'GeotaggingString_Village': 'village',
            'GeotaggingString_Villages': 'villages',
            'GeotaggingString_Post': 'post',
            'GeotaggingString_Zip': 'zip',
            'GeotaggingString_Code': 'code',
            'GeotaggingString_Place': 'place',
            'GeotaggingString_Places': 'places',
            'GeotaggingString_Address': 'address',
            'GeotaggingString_Addresses': 'addresses',
            'GeotaggingString_Street': 'street',
            'GeotaggingString_Streets': 'streets',
            'GeotaggingString_Longitude': 'longitude',
            'GeotaggingString_Longitude_Short': 'lon',
            'GeotaggingString_Latitude': 'latitude',
            'GeotaggingString_Latitude_Short': 'lat',
            'GeotaggingString_PostalCode': 'postal code',
            'GeotaggingString_PostalCodes': 'postal codes',
            'GeotaggingString_ZipCode': 'zip code',
            'GeotaggingString_ZipCodes': 'zip codes',
            'GeotaggingString_Territory': 'territory',
            'GeotaggingString_Territories': 'territories',
        };

		function beautify(format: string): string {
			if (format) {
		        var regEx = RegExp('\\.0* %', 'g');
		        format = format.replace(regEx, '.00 %');
	        }
	        var key = BeautifiedFormat[format];
	        if (key)
		        return defaultLocalizedStrings[key] || format;
	        return format;
		}

	    function describeUnit(exponent: number): DisplayUnitSystemNames {
            var title: string = defaultLocalizedStrings["DisplayUnitSystem_E" + exponent + "_Title"];
            var format: string = defaultLocalizedStrings["DisplayUnitSystem_E" + exponent + "_LabelFormat"];

            if (title || format)
                return { title: title, format: format };
        }

        export function getLocalizedString(stringId: string): string {
            return defaultLocalizedStrings[stringId];
        }

        // NOTE: Define default locale options, but these can be overriden by setLocaleOptions.
        var locale: ValueFormatterLocalizationOptions = {
            null: defaultLocalizedStrings['NullValue'],
            true: defaultLocalizedStrings['BooleanTrue'],
            false: defaultLocalizedStrings['BooleanFalse'],
            beautify: format => beautify(format),
            describe: exponent => describeUnit(exponent),
            restatementComma: defaultLocalizedStrings['RestatementComma'],
            restatementCompoundAnd: defaultLocalizedStrings['RestatementCompoundAnd']
        };

        var Years = {
            max: 3000,
            min: 1000,
        };
        var MaxScaledDecimalPlaces = 2;

        export function getFormatMetadata(format: string): powerbi.NumberFormat.NumericFormatMetadata {
            return powerbi.NumberFormat.getCustomFormatMetadata(format);
        }

        export function setLocaleOptions(options: ValueFormatterLocalizationOptions): void {
            debug.assertValue(options, 'options');

            locale = options;

            DefaultDisplayUnitSystem.reset();
            WholeUnitsDisplayUnitSystem.reset();
        }

        export function createDefaultFormatter(formatString: string): IValueFormatter {
            var formatBeaut: string = locale.beautify(formatString);
            return {
                format: function (value: any): string {
                    if (value == null)
                        return locale.null;

                    return formatCore(value, formatBeaut);
                }
            };
        }

        /** Creates an IValueFormatter to be used for a range of values. */
        export function create(options: ValueFormatterOptions): IValueFormatter {
            debug.assertValue(options, 'options');

            var format = locale.beautify(options.format);

            if (shouldUseNumericDisplayUnits(options)) {
                var displayUnitSystem = createDisplayUnitSystem(options.displayUnitSystemType);

                var singleValueFormattingMode = !!options.formatSingleValues;

                displayUnitSystem.update(Math.max(Math.abs(options.value || 0), Math.abs(options.value2 || 0)));

                var forcePrecision = options.precision != null;

                var decimals: number;
                if (forcePrecision)
                    decimals = -options.precision;
                else if (displayUnitSystem.displayUnit)
                    decimals = -MaxScaledDecimalPlaces;

                return {
                    format: function (value: any): string {
                        if (value == null)
                            return locale.null;

                        if (value === true)
                            return locale.true;

                        if (value === false)
                            return locale.false;

                        if (value && !displayUnitSystem.displayUnit && Math.abs(value) < Years.min && !forcePrecision)
                            value = Double.roundToPrecision(value, Double.pow10(Double.getPrecision(value)));

                        return singleValueFormattingMode ?
                            displayUnitSystem.formatSingleValue(value, format, decimals) :
                            displayUnitSystem.format(value, format, decimals);
                    },
                    displayUnit: displayUnitSystem.displayUnit
                };
            }

            if (shouldUseDateUnits(options.value, options.value2, options.tickCount)) {
                var unit = DateTimeSequence.getIntervalUnit(options.value /* minDate */, options.value2 /* maxDate */, options.tickCount);

                return {
                    format: function (value: any): string {
                        if (value == null)
                            return locale.null;

                        var formatString = formattingService.dateFormatString(unit);
                        return formatCore(value, formatString);
                    }
                };
            }

            return createDefaultFormatter(format);
        }

        export function format(value: any, format?: string): string {
            if (value == null)
                return locale.null;

            return formatBase(value, format);
        }

        export function formatRaw(value: any, format?: string): string {
            return formatBase(value, format);
        }

        function formatBase(value: any, format?: string): string {
            return formatCore(
                value,
                locale.beautify(format));
        }

        function createDisplayUnitSystem(displayUnitSystemType?: DisplayUnitSystemType): DisplayUnitSystem {
            if (displayUnitSystemType == null)
                return new DefaultDisplayUnitSystem(locale.describe);

            switch (displayUnitSystemType) {
                case DisplayUnitSystemType.Default:
                    return new DefaultDisplayUnitSystem(locale.describe);
                case DisplayUnitSystemType.WholeUnits:
                    return new WholeUnitsDisplayUnitSystem(locale.describe);
                case DisplayUnitSystemType.Verbose:
                    return new NoDisplayUnitSystem();
                default:
                    debug.assertFail('Unknown display unit system type');
                    return new DefaultDisplayUnitSystem(locale.describe);
            }
        }

        function shouldUseNumericDisplayUnits(options: ValueFormatterOptions): boolean {
            var value = options.value;
            var value2 = options.value2;
            if ((typeof value === 'number') || (typeof value2 === 'number')) {
                if (Years.min <= value && value <= Years.max) {
                    // Avoid scaling Year values.
                    return false;
                }

                return true;
            }
        }

        function shouldUseDateUnits(value: any, value2?: any, tickCount?: number): boolean {
            return (value instanceof Date) && (value2 instanceof Date) && (tickCount !== undefined && tickCount !== null);
        }

        export function getFormatString(column: DataViewMetadataColumn, formatStringProperty: DataViewObjectPropertyIdentifier, suppressTypeFallback?: boolean): string {
            if (column) {
                if (formatStringProperty) {
                    var propertyValue = DataViewObjects.getValue<string>(column.objects, formatStringProperty);
                    if (propertyValue)
                        return propertyValue;
                }

                if (!suppressTypeFallback) {
                    var columnType = column.type;
                    if (columnType) {
                        if (columnType.dateTime)
                            return 'd';
                        if (columnType.integer)
                            return 'g';
                        if (columnType.numeric)
                            return '#,0.00';
                    }
                }
            }
        }

        // The returned string will look like 'A, B, ..., and C' 
        export function formatListAnd(strings: string[]): string {
            var result: string;

            if (!strings) {
                return null;
            }

            var length = strings.length;
            if (length > 0) {
                result = strings[0];
                var lastIndex = length - 1;
                for (var i = 1, len = lastIndex; i < len; i++) {
                    var value = strings[i];
                    result = StringExtensions.format(locale.restatementComma, result, value);
                }

                if (length > 1) {
                    var value = strings[lastIndex];
                    result = StringExtensions.format(locale.restatementCompoundAnd, result, value);
                }
            }
            else {
                result = null;
            }

            return result;
        }

        function formatCore(value: any, format: string): string {
            if (typeof value === 'boolean')
                return value ? locale.true : locale.false;

            return formattingService.formatValue(value, format);
        }
    }
}