//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
module powerbi {

    /** Enumeration of DateTimeUnits */
    export enum DateTimeUnit {
        Year,
        Month,
        Week,
        Day,
        Hour,
        Minute,
        Second,
        Millisecond,
    }

    export interface IFormattingService {
        /** Formats the value using provided format expression and culture
          * @param value - value to be formatted and converted to string.
          * @param format - format to be applied. If undefined or empty then generic format is used.        
          */
        formatValue(value: any, format?: string): string;

        /** Replaces the indexed format tokens (for example {0:c2}) in the format string with the localized formatted arguments.
         * @param formatWithIndexedTokens - format string with a set of indexed format tokens.
         * @param args - array of values which should replace the tokens in the format string.
         * @param culture - localization culture. If undefined then the current culture is used.
         */
        format(formatWithIndexedTokens: string, args: any[], culture?: string): string

        /** Gets a value indicating whether the specified format a standard numeric format specifier. */
        isStandardNumberFormat(format: string): boolean;

        /** Performs a custom format with a value override.  Typically used for custom formats showing scaled values. */
        formatNumberWithCustomOverride(value: number, format: string, nonScientificOverrideFormat: string): string;

        /** Gets the format string to use for dates in particular units. */
        dateFormatString(unit: DateTimeUnit): string;
    }
}