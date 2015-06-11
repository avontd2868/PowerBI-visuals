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

module powerbitests.utils {
    export module ColorUtility {
        var HexPattern = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$";
        var RGBRegex = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/;

        export function convertFromRGBorHexToHex(value: string): string {
            if (value.match(HexPattern)) {
                return value;
            }

            return rgbStringToHex(value);
        };

        function rgbStringToHex(rgb): string {
            var result, r, g, b, hex = "";

            if ((result = RGBRegex.exec(rgb))) {
                r = componentFromStr(result[1], result[2]);
                g = componentFromStr(result[3], result[4]);
                b = componentFromStr(result[5], result[6]);

                hex = "#" + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
            }

            return hex;
        };

        function componentFromStr(numStr, percent): number {
            var num = Math.max(0, parseInt(numStr, 10));

            return percent ?
                Math.floor(255 * Math.min(100, num) / 100) : Math.min(255, num);
        };
    }
} 