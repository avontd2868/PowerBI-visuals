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
    export class XmlUtility {
        private static TabCharCode: number = 0x9;
        private static NewLineCharCode: number = 0xA;
        private static CarriageReturnCharCode: number = 0xD;

        public static removeInvalidCharacters(input: string): string {
            debug.assertValue(input, 'input');

            var startIndex = 0;
            var resultString;

            for (var i = 0, len = input.length; i < len; i++) {
                if (!XmlUtility.isValidXmlCharacter(input, i)) {
                    if (typeof resultString === 'undefined')
                        resultString = '';

                    if (startIndex !== i)
                        resultString += input.substring(startIndex, i);

                    startIndex = i + 1;
                }
            }

            if (typeof resultString === 'undefined')
                return input;

            if (startIndex <= input.length - 1)
                resultString += input.substring(startIndex, input.length);

            return resultString;
        }

        /**
         * Checks whether character at the provided index is a valid xml character as per
         * XML 1.0 specification: http://www.w3.org/TR/xml/#charsets
         */
        public static isValidXmlCharacter(input: string, index: number): boolean {
            debug.assertValue(input, 'input');
            debug.assertValue(index, 'index');
            debug.assert(index < input.length, 'index < input.length');

            var charCode = input.charCodeAt(index);

            return charCode === XmlUtility.TabCharCode ||
                charCode === XmlUtility.NewLineCharCode ||
                charCode === XmlUtility.CarriageReturnCharCode ||
                (charCode >= 0x20 && charCode <= 0xD7FF) ||
                (charCode >= 0xE000 && charCode <= 0xFFFD) ||
                (charCode >= 0x10000 && charCode <= 0x10FFFF);
        }
    }
}