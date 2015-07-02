//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi {
    export interface ITextMeasurer {
        (textElement: SVGTextElement): number;
    }

    export interface ITextAsSVGMeasurer {
        (textProperties: TextProperties): number;
    }

    export interface TextProperties {
        text?: string;
        fontFamily: string;
        fontSize: string;
        fontWeight?: string;
        fontStyle?: string;
        whiteSpace?: string;
    }

    interface CanvasContext {
        font: string;
        measureText(text: string): { width: number };
    }

    interface CanvasElement extends HTMLElement {
        getContext(name: string);
    }

    export module TextMeasurementService {
        var spanElement: JQuery;
        var svgTextElement: D3.Selection;
        var canvasCtx: CanvasContext;

        /** Idempotent function for adding the elements to the DOM. */
        function ensureDOM(): void {
            if (spanElement)
                return;

            spanElement = $('<span/>');
            $('body').append(spanElement);
            svgTextElement = d3.select($('body').get(0)).append('svg').append('text');
            canvasCtx = (<CanvasElement>$('<canvas/>').get(0)).getContext("2d");
        }

        // TODO: this is not ideal - we need to pass TextProperties such as fond and size by code, while those parameters are set from css.

        /**
         * This method measures the width of the text with the given text properties
         * @param {ITextMeasurementProperties} textProperties - The text properties to use for text measurement
         */
        export function measureTextWidth(textProperties: TextProperties): number {
            ensureDOM();

            spanElement.removeAttr('style').empty().css('visibility', 'hidden');
            spanElement.text(textProperties.text).css({
                    fontFamily: textProperties.fontFamily,
                    fontSize: textProperties.fontSize,
                    fontWeight: textProperties.fontWeight,
                    fontStyle: textProperties.fontStyle,
                    whiteSpace: textProperties.whiteSpace || 'nowrap'
                });

            // The use of 'getComputedStyle' is required to get exact values of sizes, without rounding off to nearest integer
            //  The rounding off can cause a slight difference in the width, which can have undesirable effects including flickering.
            var measuredWidth = parseInt(getComputedStyle(spanElement[0]).width, 10);

            return measuredWidth;
        }

        /**
         * This method measures the width of the text with the given SVG text properties
         * @param {ITextMeasurementProperties} textProperties - The text properties to use for text measurement
         */
        export function measureSvgTextWidth(textProperties: TextProperties): number {
            ensureDOM();

            canvasCtx.font = textProperties.fontSize + ' ' + textProperties.fontFamily;
            return canvasCtx.measureText(textProperties.text).width;
        }

        /**
         * This method measures the height of the text with the given SVG text properties
         * @param {ITextMeasurementProperties} textProperties - The text properties to use for text measurement
         */
        export function measureSvgTextHeight(textProperties: TextProperties): number {
            ensureDOM();

            svgTextElement.style(null);
            svgTextElement
                .text(textProperties.text)
                .attr({
                    'visibility': 'hidden',
                    'font-family': textProperties.fontFamily,
                    'font-size': textProperties.fontSize,
                    'font-weight': textProperties.fontWeight,
                    'font-style': textProperties.fontStyle,
                    'white-space': textProperties.whiteSpace || 'nowrap'
                });

            // We're expecting the browser to give a synchronous measurement here
            return svgTextElement.node<D3.D3Element>().getBoundingClientRect().height;
        }

        /**
         * This method measures the width of the svgElement.
         * @param {SVGTextElement} element - The SVGTextElement to be measured.
         */
        export function measureSvgTextElementWidth(svgElement: SVGTextElement): number {
            return measureSvgTextWidth(getSvgMeasurementProperties(svgElement));
        }

        /**
         * This method fetches the text measurement properties of the given DOM element.
         * @param {JQuery} element - The selector for the DOM Element.
         */
        export function getMeasurementProperties(element: JQuery): TextProperties {
            return {
                text: element.val() || element.text(),
                fontFamily: element.css('font-family'),
                fontSize: element.css('font-size'),
                fontWeight: element.css('font-weight'),
                fontStyle: element.css('font-style'),
                whiteSpace: element.css('white-space')
            };
        }

        /**
         * This method fetches the text measurement properties of the given SVG text element.
         * @param {SVGTextElement} element - The SVGTextElement to be measured.
         */
        export function getSvgMeasurementProperties(svgElement: SVGTextElement): TextProperties {
            var style = window.getComputedStyle(svgElement, null);
            return {
                text: svgElement.textContent,
                fontFamily: style.fontFamily,
                fontSize: style.fontSize,
                fontWeight: style.fontWeight,
                fontStyle: style.fontStyle,
                whiteSpace: style.whiteSpace
            };
        }

        /**
         * This method returns the width of a div element
         * @param {JQuery} element: The div element
         */
        export function getDivElementWidth(element: JQuery): string {
            debug.assert(element.is('div'), 'Given element is not a div type. Cannot get width');
            return getComputedStyle(element[0]).width;
        }

        /**
        * Compares labels text size to the available size and renders ellipses when the available size is smaller
        * @param {ITextMeasurementProperties} textProperties - The text properties (including text content) to use for text measurement
        * @param maxWidth - the maximum width available for rendering the text
        */
        export function getTailoredTextOrDefault(properties: TextProperties, maxWidth: number): string {
            ensureDOM();

            var dotsString = '...';

            debug.assertValue(properties, 'properties');
            debug.assertValue(properties.text, 'properties.text');

            var strLength = properties.text.length;

            if (strLength === 0)
                return properties.text;

            var width = measureSvgTextWidth(properties);

            if (width < maxWidth)
                return properties.text;

            // Take the properties and apply them to svgTextElement
            // Then, do the binary search to figure out the substring we want
            // Set the substring on textElement argument
            var text = properties.text = dotsString + properties.text;

            var min = 1;
            var max = text.length;
            var i = 3;
            
            while (min <= max) {
                // num | 0 prefered to Math.floor(num) for performance benefits
                i = (min + max) / 2 | 0;

                properties.text = text.substr(0, i);
                width = measureSvgTextWidth(properties);

                if (maxWidth > width)
                    min = i + 1;
                else if (maxWidth < width)
                    max = i - 1;
                else
                    break;
            }

            // Since the search algorithm almost never finds an exact match,
            // it will pick one of the closest two, which could result in a
            // value bigger with than 'maxWidth' thus we need to go back by 
            // one to guarantee a smaller width than 'maxWidth'.
            properties.text = text.substr(0, i);
            width = measureSvgTextWidth(properties);
            if (width > maxWidth)
                i--;

            return text.substr(3, i - 3) + dotsString;
        }

        /**
        * Compares labels text size to the available size and renders ellipses when the available size is smaller
        * @param textElement - the SVGTextElement containing the text to render
        * @param maxWidth - the maximum width available for rendering the text
        */
        export function svgEllipsis(textElement: SVGTextElement, maxWidth: number): void {
            var properties = getSvgMeasurementProperties(textElement);
            var originalText = properties.text;
            var tailoredText = getTailoredTextOrDefault(properties, maxWidth);

            if (originalText !== tailoredText) {
                textElement.textContent = tailoredText;
            }
        }
    }
}