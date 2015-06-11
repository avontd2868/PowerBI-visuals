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

module powerbi.data {
    import DateExtensions = jsCommon.DateExtensions;
    import StringExtensions = jsCommon.StringExtensions;

    export module PrimitiveValueEncoding {
        export function decimal(value: number): string {
            debug.assertValue(value, 'value');

            return value + 'M';
        }

        export function double(value: number): string {
            debug.assertValue(value, 'value');

            return value + 'D';
        }

        export function integer(value: number): string {
            debug.assertValue(value, 'value');

            return value + 'L';
        }

        export function dateTime(value: Date): string {
            debug.assertValue(value, 'value');
            // Currently, server doesn't support timezone. All date time data on the server don't have time zone information.
            // So, when we construct a dateTime object on the client, we will need to ignor user's time zone and force it to be UTC time.
            // When we subtract the timeZone offset, the date time object will remain the same value as you entered but dropped the local timeZone.
            var date = new Date(value.getTime() - (value.getTimezoneOffset() * 60000));
            var dateTimeString = date.toISOString();
            // If it ends with Z, we want to get rid of it, because with trailing Z, it will assume the dateTime is UTC, but we don't want any timeZone information, so
            // we will drop it.
            // Also, we need to add Prefix and Suffix to match the dsr value format for dateTime object.
            if (jsCommon.StringExtensions.endsWith(dateTimeString, 'Z'))
                dateTimeString = dateTimeString.substr(0, dateTimeString.length - 1);
            return "datetime'" + dateTimeString + "'";
        }

        export function text(value: string): string {
            debug.assertValue(value, 'value');

            return "'" + value.replace("'", "''") + "'";
        }

        export function nullEncoding(): string {
            return 'null';
        }

        export function boolean(value: boolean): string {
            return value ? 'true' : 'false';
        }

        /** Parses a typed value in a Data Shape Result. */
        export function parseValue(dsqValue: any): any {
            return parseValueHelper(dsqValue);
        }

        export function parseValueToSQExpr(dsqValue: any): SQExpr {
            return <SQExpr>parseValueHelper(dsqValue, true);
        }

        function parseValueHelper(dsqValue: any, toSQExpr?: boolean): any | SQExpr {
            if (typeof(dsqValue) === "string") {
                // Integer
                if (StringExtensions.endsWith(dsqValue, 'L')) {
                    var intValue = parseInt(dsqValue, 10);
                    return toSQExpr ? SQExprBuilder.integer(intValue, dsqValue) : intValue;
                }

                // Double precision
                if (StringExtensions.endsWith(dsqValue, 'D')) {
                    var doubleValue = parseFloatExtended(dsqValue);
                    return toSQExpr ? SQExprBuilder.double(doubleValue, dsqValue) : doubleValue;
                }

                // Decimal precision
                if (StringExtensions.endsWith(dsqValue, 'M')) {
                    var decimalValue = parseFloatExtended(dsqValue);
                    return toSQExpr ? SQExprBuilder.decimal(decimalValue, dsqValue) : decimalValue;
                }

                if (StringExtensions.endsWith(dsqValue, "'")) {
                    // String
                    if (dsqValue.charAt(0) === "'") {
                        var stringValue = dsqValue.substring(1, dsqValue.length - 1).replace("''", "'");
                        return toSQExpr ? SQExprBuilder.text(stringValue, dsqValue) : stringValue;
                    }

                    // DateTime
                    if (dsqValue.indexOf("datetime'") === 0) {
                        var isoDate = dsqValue.substring(9, dsqValue.length - 1);
                        var dateValue = DateExtensions.parseIsoDate(isoDate);
                        return toSQExpr ? SQExprBuilder.dateTime(dateValue, dsqValue) : dateValue;
                    }
                }

                // Null
                if (dsqValue === 'null')
                    return toSQExpr ? SQExprBuilder.nullConstant() : null;

                // Boolean
                if (dsqValue === 'true')
                    return toSQExpr ? SQExprBuilder.boolean(true) : true;

                if (dsqValue === 'false')
                    return toSQExpr ? SQExprBuilder.boolean(false) : false;
            }

            //The server is sending boolean dsr value as true and false instead of 'true' and 'false'.
            if (typeof (dsqValue) === "boolean") 
                return toSQExpr ? SQExprBuilder.boolean(dsqValue) : dsqValue;

            //The server is sending null dsr value as null instead of 'null'.
            if (dsqValue == null)
                return toSQExpr ? SQExprBuilder.nullConstant() : null;

            return dsqValue;
        }

        /** An extended implementation of Typescript's parseFloat which supports representations of Infinity such as 'INF'
        * used in DSR's.
        */
        function parseFloatExtended(value: string): number {
            // The mainline case is when we have a finite number, so try to parse the raw string first and then fall back
            // to checking for Infinity if we get NaN as a result.
            var rawResult = parseFloat(value);

            if (isNaN(rawResult)) {
                // Try to differentiate between Infinity and NaN. Running it through the parser again is slower than trying to
                // detect Infinity ourselves, but since this isn't the mainline case it should be ok to take the safer option
                // of the parser to catch the different cases of Infinity (e.g. positive/negative Infinity, suffixes).
                return parseFloat(value.replace('INF', 'Infinity'));
            }

            return rawResult;
        }
    }
}