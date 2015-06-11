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
    /**
     * Contains functions/constants to aid in SVG manupilation. 
    */
    export module SVGUtil {
        /** 
         * very small values, when stringified, may be converted to scientific notation and cause a temporarily 
         * invalid attribute or style property value. For example, the number 0.0000001 is converted to the string "1e-7". 
         * This is particularly noticeable when interpolating opacity values. To avoid scientific notation, 
         * start or end the transition at 1e-6, which is the smallest value that is not stringified in exponential notation.
        */
        export var AlmostZero = 1e-6;

        /**
         * Creates a translate string for use with the SVG transform call.
        */
        export function translate(x: number, y: number): string {
            debug.assertValue(x, 'x');
            debug.assertValue(y, 'y');
            return 'translate(' + x + ',' + y + ')';
        }

        /**
         * Creates a translateX string for use with the SVG transform call.
        */
        export function translateXWithPixels(x: number): string {
            debug.assertValue(x, 'x');
            return 'translateX(' + x + 'px)';
        }

        export function translateWithPixels(x: number, y: number): string {
            debug.assertValue(x, 'x');
            debug.assertValue(y, 'y');
            return 'translate(' + x + 'px,' + y + 'px)';
        }

        /**
         * Creates a translate + rotate string for use with the SVG transform call.
        */
        export function translateAndRotate(x: number, y: number, px: number, py: number, angle: number): string {
            debug.assertValue(x, 'x');
            debug.assertValue(y, 'y');
            debug.assertValue(px, 'px');
            debug.assertValue(py, 'py');
            debug.assertValue(angle, 'angle');

            return 'transform', "translate("
                + x + "," + y + ")"
                + " rotate(" + angle + "," + px + "," + py + ")";
        }

        /**
         * Forces all D3 transitions to complete.
         * Normally, zero-delay transitions are executed after an instantaneous delay (<10ms). 
         * This can cause a brief flicker if the browser renders the page twice: once at the end of the first event loop, 
         * then again immediately on the first timer callback. By flushing the timer queue at the end of the first event loop,
         * you can run any zero-delay transitions immediately and avoid the flicker.
         * 
         * These flickers are noticable on IE, and with a large number of webviews(not recommend you ever do this) on iOS.
         */
        export function flushAllD3Transitions() {
            var now = Date.now;
            Date.now = function () { return Infinity; };
            d3.timer.flush();
            Date.now = now;
        }

        /**
         * Wrapper for flushAllD3Transitions.
         */
        export function flushAllD3TransitionsIfNeeded(options: VisualInitOptions | AnimationOptions) {
            if (!options)
                return;

            var animationOptions: AnimationOptions = <AnimationOptions>options;

            var asVisualInitOptions = <VisualInitOptions>options;
            if (asVisualInitOptions.animation)
                animationOptions = asVisualInitOptions.animation;

            if (animationOptions && animationOptions.transitionImmediate) {
                flushAllD3Transitions();
            }
        }

        /**
         * There is a known bug in IE10 that causes cryptic crashes for SVG elements with a null 'd' attribute:
         * https://github.com/mbostock/d3/issues/1737
        */
        export function ensureDAttribute(pathElement: D3.D3Element) {
            if (!pathElement.getAttribute('d')) {
                pathElement.setAttribute('d', '');
            }
        }

        /**
         * In IE10, it is possible to return SVGPoints with NaN members
        */
        export function ensureValidSVGPoint(point: SVGPoint) {
            if (isNaN(point.x)) {
                point.x = 0;
            }
            if (isNaN(point.y)) {
                point.y = 0;
            }
        }

        /**
         * Parse the Transform string with value 'translate(x,y)'
         * In Chrome for the translate(position) string the delimiter is a comma and in IE it is a space so checking for both
        */
        export function parseTranslateTransform(input: string): { x: string; y: string } {
            if (!input || input.length === 0) { // Interpet falsy and empty string as a no-op translate
                return {
                    x: "0",
                    y: "0",
                };
            }
            var translateCoordinates = input.split(/[\s,]+/);

            debug.assertValue(translateCoordinates, 'translateCoordinates');
            debug.assert(translateCoordinates.length > 0, 'translate array must atleast have one value');

            var yValue = '0';
            var xValue: string;
            var xCoord = translateCoordinates[0];

            // Y coordinate is ommited in I.E if it is 0, so need to check against that
            if (translateCoordinates.length === 1) {
                // 10 refers to the length of 'translate('
                xValue = xCoord.substring(10, xCoord.length - 1);
            } else {
                var yCoord = translateCoordinates[1];
                yValue = yCoord.substring(0, yCoord.length - 1);
                // 10 refers to the length of 'translate('
                var xValue = xCoord.substring(10,xCoord.length);
            }

            return {
                x: xValue,
                y: yValue
            };
        }

        /**
         * Appends 'px' to the end of number value for use as pixel string in styles
        */
        export function convertToPixelString(value: number): string {
            return value + "px";
        }
    }
}