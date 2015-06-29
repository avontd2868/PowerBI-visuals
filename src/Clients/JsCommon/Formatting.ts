//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
module jsCommon {

    export module Formatting {

        interface IRegexInt {
            // Regex for replace.
            r: RegExp;
            // The string to replace.
            s: string;
        }

        var _regexCache: IRegexInt[];

        /** Translate .NET format into something supported by jQuery.Globalize
         */
        export function findDateFormat(value: Date, format: string, cultureName: string)
        {
            switch (format) {
                case "m":
                    // Month + day
                    format = "M";
                    break;
                case "O":
                case "o":
                    // Roundtrip
                    format = "yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff'0000'";
                    break;
                case "R":
                case "r":
                    // RFC1123 pattern - - time must be converted to UTC before formatting 
                    value = new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), value.getUTCHours(), value.getUTCMinutes(), value.getUTCSeconds(), value.getUTCMilliseconds());
                    format = "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'";
                    break;
                case "s":
                    // Sortable - should use invariant culture
                    format = "S";
                    break;
                case "u":
                    // Universal sortable - should convert to UTC before applying the "yyyy'-'MM'-'dd HH':'mm':'ss'Z' format.
                    value = new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), value.getUTCHours(), value.getUTCMinutes(), value.getUTCSeconds(), value.getUTCMilliseconds());
                    format = "yyyy'-'MM'-'dd HH':'mm':'ss'Z'";
                    break;
                case "U":
                    // Universal full - the pattern is same as F but the time must be converted to UTC before formatting
                    value = new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), value.getUTCHours(), value.getUTCMinutes(), value.getUTCSeconds(), value.getUTCMilliseconds());
                    format = "F";
                    break;
                case "y":
                case "Y":
                    // Year and month
                    switch (cultureName) {
                        case "default":
                        case "en":
                        case "en-US":
                            format = "MMMM, yyyy"; // Fix the default year-month pattern for english
                            break;
                        default:
                            format = "Y"; // For other cultures - use the localized pattern
                    }
                    break;
              }
              return { value: value, format: format };
        }
         
        /** Translates unsupported .NET custom format expressions to the custom expressions supported by JQuery.Globalize
         */
        export function fixDateTimeFormat(format: string): string {
            // Fix for the "K" format (timezone): 
            //The js dates don't have a kind property so we'll support only local kind which is equavalent to zzz format.
            format = format.replace(/%K/g, "zzz");                   
            format = format.replace(/K/g, "zzz");
            format = format.replace(/fffffff/g, "fff0000");
            format = format.replace(/ffffff/g, "fff000");
            format = format.replace(/fffff/g, "fff00");
            format = format.replace(/ffff/g, "fff0");
            // Fix for the 5 digit year: "yyyyy" format. 
            //The Globalize doesn't support dates greater than 9999 so we replace the "yyyyy" with "0yyyy".
            format = format.replace(/yyyyy/g, "0yyyy");             
            // Fix for the 3 digit year: "yyy" format. 
            //The Globalize doesn't support this formatting so we need to replace it with the 4 digit year "yyyy" format.
            format = format.replace(/(^y|^)yyy(^y|$)/g, "yyyy");    

            if (!_regexCache) {
                // Creating Regexes for cases "Using single format specifier" 
                //- http://msdn.microsoft.com/en-us/library/8kb3ddd4.aspx#UsingSingleSpecifiers
                // This is not supported from The Globalize.
                // The case covers all single "%" lead specifier (like "%d" but not %dd) 
                // The cases as single "%d" are filtered in if the bellow.
                // (?!S) where S is the specifier make sure that we only one symbol for specifier.
                _regexCache = ["d", "f", "F", "g", "h", "H", "K", "m", "M", "s", "t", "y", "z", ":", "/"].map((s) => {
                    return { r: new RegExp("\%" + s + "(?!" + s + ")", "g"), s: s };
                });
            }

            if (format.indexOf("%") !== -1 && format.length > 2) {
                for (var i = 0; i < _regexCache.length; i++) {
                    format = format.replace(_regexCache[i].r, _regexCache[i].s);
                }
            }
            return format;
        }

    }

}