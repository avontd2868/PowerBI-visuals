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

    var BeautifiedFormat: { [x: string]: string } = {
        '0.00 %;-0.00 %;0.00 %': 'Percentage',
        '0.0 %;-0.0 %;0.0 %': 'Percentage1',
    };

    var defaultLocalizedStrings = {
        'NullValue': '(Blank)',
        'BooleanTrue': 'True',
        'BooleanFalse': 'False',
        'NaNValue': 'NaN',
        'InfinityValue': '+Infinity',
        'NegativeInfinityValue': '-Infinity',
        'Restatement_Comma': '{0}, {1}',
        'Restatement_CompoundAnd': '{0} and {1}',
        'DisplayUnitSystem_E3_LabelFormat': '{0}K',
        'DisplayUnitSystem_E3_Title': 'Thousands',
        'DisplayUnitSystem_E6_LabelFormat': '{0}M',
        'DisplayUnitSystem_E6_Title': 'Millions',
        'DisplayUnitSystem_E9_LabelFormat': '{0}bn',
        'DisplayUnitSystem_E9_Title': 'Billions',
        'DisplayUnitSystem_E12_LabelFormat': '{0}T',
        'DisplayUnitSystem_E12_Title': 'Trillions',
        'Percentage': '#,0.##%',
        'Percentage1': '#,0.#%',
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

    export class DefaultVisualHostServices implements IVisualHostServices {
        // TODO: Add locale-awareness to this host service. Currently default/english functionality only.
        public static initialize(): void {
            visuals.valueFormatter.setLocaleOptions(DefaultVisualHostServices.createLocaleOptions());
            visuals.TooltipManager.setLocalizedStrings(DefaultVisualHostServices.createTooltipLocaleOptions());
        }

        // Public for testability
        public static createLocaleOptions(): visuals.ValueFormatterLocalizationOptions {
           return {
                null: defaultLocalizedStrings['NullValue'],
                true: defaultLocalizedStrings['BooleanTrue'],
                false: defaultLocalizedStrings['BooleanFalse'],
                NaN: defaultLocalizedStrings['NaNValue'],
                infinity: defaultLocalizedStrings['InfinityValue'],
                negativeInfinity: defaultLocalizedStrings['NegativeInfinityValue'],
                beautify: format => DefaultVisualHostServices.beautify(format),
                describe: exponent => DefaultVisualHostServices.describeUnit(exponent),
                restatementComma: defaultLocalizedStrings['Restatement_Comma'],
                restatementCompoundAnd: defaultLocalizedStrings['Restatement_CompoundAnd'],
                restatementCompoundOr: defaultLocalizedStrings['Restatement_CompoundOr']
           };
        }

        public static createTooltipLocaleOptions(): powerbi.visuals.TooltipLocalizationOptions {
            return {
                highlightedValueDisplayName: defaultLocalizedStrings['Tooltip_HighlightedValueDisplayName']
            };
        }

        public getLocalizedString(stringId: string): string {
            return defaultLocalizedStrings[stringId];
        }

        // NO-OP IHostServices methods
        public onDragStart(): void { }
        public canSelect(): boolean { return false; }
        public onSelect(): void { }
        public loadMoreData(): void { }
        public persistProperties(changes: VisualObjectInstance[]): void { }
        public onCustomSort(args: CustomSortEventArgs) { }
        public getViewMode(): powerbi.ViewMode { return ViewMode.View; }
        public setWarnings(warnings: IVisualWarning[]): void { }
        public setToolbar($toolbar: JQuery): void { }

        private static beautify(format: string): string {
            var key = BeautifiedFormat[format];
            if (key)
                return defaultLocalizedStrings[key] || format;
            return format;
        }

        private static describeUnit(exponent: number): DisplayUnitSystemNames {
            var title: string = defaultLocalizedStrings["DisplayUnitSystem_E" + exponent + "_Title"];
            var format: string = defaultLocalizedStrings["DisplayUnitSystem_E" + exponent + "_LabelFormat"];

            if (title || format)
                return { title: title, format: format };
        }
    }

    export var defaultVisualHostServices: IVisualHostServices = new DefaultVisualHostServices();
} 