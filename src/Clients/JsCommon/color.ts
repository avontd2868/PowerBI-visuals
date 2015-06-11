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

module jsCommon {

    export module color {
        export function rotate(rgbString: string, rotateFactor: number): string {
            if (rotateFactor === 0)
                return rgbString;

            var originalRgb = parseRgb(rgbString);
            var originalHsv = rgbToHsv(originalRgb);
            var rotatedHsv = rotateHsv(originalHsv, rotateFactor);
            var rotatedRgb = hsvToRgb(rotatedHsv);
            return rgbToHexString(rotatedRgb);
        }

        export function parseRgb(rgbString: string): RgbColor {
            Utility.throwIfNullOrEmpty(rgbString, 'RgbColor', 'parse', 'rgbString');
            Utility.throwIfNotTrue(rgbString.length === 7, 'RgbColor', 'parse', 'rgbString');

            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(rgbString);
            Utility.throwIfNullOrUndefined(result, 'RgbColor', 'parse', 'rgbString');

            return {
                R: parseInt(result[1], 16),
                G: parseInt(result[2], 16),
                B: parseInt(result[3], 16)
            };
        }

        function rgbToHsv(rgbColor: RgbColor): HsvColor {
            var s, h;
            var r = rgbColor.R / 255,
                g = rgbColor.G / 255,
                b = rgbColor.B / 255;

            var min = Math.min(r, Math.min(g, b));
            var max = Math.max(r, Math.max(g, b));

            var v = max;
            var delta = max - min;
            if (max === 0 || delta === 0) {
                // R, G, and B must be 0.0, or all the same.
                // In this case, S is 0.0, and H is undefined.
                // Using H = 0.0 is as good as any...
                s = 0;
                h = 0;
            }
            else {
                s = delta / max;
                if (r === max) {
                    // Between Yellow and Magenta
                    h = (g - b) / delta;
                }
                else if (g === max) {
                    // Between Cyan and Yellow
                    h = 2 + (b - r) / delta;
                }
                else {
                    // Between Magenta and Cyan
                    h = 4 + (r - g) / delta;
                }
            }

            // Scale h to be between 0.0 and 1.
            // This may require adding 1, if the value
            // is negative.
            h /= 6;
            if (h < 0) {
                h += 1;
            }

            return {
                H: h,
                S: s,
                V: v,
            };
        }

        export function rgbToHexString(rgbColor: RgbColor): string {
            return "#" + componentToHex(rgbColor.R) + componentToHex(rgbColor.G) + componentToHex(rgbColor.B);
        }

        function componentToHex(hexComponent: number): string {
            var hex = hexComponent.toString(16).toUpperCase();
            return hex.length === 1 ? "0" + hex : hex;
        }

        function hsvToRgb(hsvColor: HsvColor): RgbColor {
            var r, g, b;
            var h = hsvColor.H,
                s = hsvColor.S,
                v = hsvColor.V;

            if (s === 0) {
                // If s is 0, all colors are the same.
                // This is some flavor of gray.
                r = v;
                g = v;
                b = v;
            }
            else {
                var p, q, t, fractionalSector, sectorNumber, sectorPos;

                // The color wheel consists of 6 sectors.
                // Figure out which sector you//re in.
                sectorPos = h * 6;
                sectorNumber = Math.floor(sectorPos);

                // get the fractional part of the sector.
                // That is, how many degrees into the sector
                // are you?
                fractionalSector = sectorPos - sectorNumber;

                // Calculate values for the three axes
                // of the color.
                p = v * (1.0 - s);
                q = v * (1.0 - (s * fractionalSector));
                t = v * (1.0 - (s * (1 - fractionalSector)));

                // Assign the fractional colors to r, g, and b
                // based on the sector the angle is in.
                switch (sectorNumber) {
                    case 0:
                        r = v;
                        g = t;
                        b = p;
                        break;

                    case 1:
                        r = q;
                        g = v;
                        b = p;
                        break;

                    case 2:
                        r = p;
                        g = v;
                        b = t;
                        break;

                    case 3:
                        r = p;
                        g = q;
                        b = v;
                        break;

                    case 4:
                        r = t;
                        g = p;
                        b = v;
                        break;

                    case 5:
                        r = v;
                        g = p;
                        b = q;
                        break;
                }
            }

            return {
                R: Math.floor(r * 255),
                G: Math.floor(g * 255),
                B: Math.floor(b * 255),
            };
        }

        function rotateHsv(hsvColor: HsvColor, rotateFactor: number): HsvColor {
            var newH = hsvColor.H + rotateFactor;

            return {
                H: newH > 1 ? newH - 1 : newH,
                S: hsvColor.S,
                V: hsvColor.V,
            };
        }

        export function darken(color: RgbColor, diff: number): RgbColor {
            var flooredNumber = Math.floor(diff);
            return {
                R: Math.max(0, color.R - flooredNumber),
                G: Math.max(0, color.G - flooredNumber),
                B: Math.max(0, color.B - flooredNumber),
            };
        }

        export function rgbWithAlphaString(color: RgbColor, a: number): string {
            return rgbaString(color.R, color.G, color.B, a);
        }

        export function rgbString(color: RgbColor): string {
            return "rgb(" + color.R + "," + color.G + "," + color.B + ")";
        }

        export function rgbaString(r: number, g: number, b: number, a: number): string {
			return "rgba(" + r + "," + g + "," + b + "," + a + ")";
        }

        export function rgbStringToHexString(rgb: string): string {
            debug.assert(rgb.indexOf('rgb(') !== -1, "input string does not starts with('rgb(')");
            var rgbColors = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/;
            var rgbArr = rgbColors.exec(rgb);
            if (rgbArr) {
                return rgbNumbersToHexString(rgbArr[1], rgbArr[2], rgbArr[3]);
            }
            return '';
        }

        export function rgbaStringToHexString(rgba: string): string {
            debug.assert(rgba.indexOf('rgba(') !== -1, "input string does not starts with('rgba(')");
            var rgbColors = /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*(?:\.\d+)?)\)$/;
            var rgbArr = rgbColors.exec(rgba);
            if (rgbArr) {
                return rgbNumbersToHexString(rgbArr[1], rgbArr[2], rgbArr[3]);
            }
            return '';
        }

        function rgbNumbersToHexString(Red: string, Green: string, Blue: string)
        {
            var rHex = parseInt(Red, 10).toString(16);
            var gHex = parseInt(Green, 10).toString(16);
            var bHex = parseInt(Blue, 10).toString(16);
            return "#" + (rHex.length === 1 ? "0" + rHex : rHex) + (gHex.length === 1 ? "0" + gHex : gHex) + (bHex.length === 1 ? "0" + bHex : bHex);
        }

        export interface RgbColor {
            R: number;
            G: number;
            B: number;
        }

        interface HsvColor {
            H: number;
            S: number;
            V: number;
        }
    }
}