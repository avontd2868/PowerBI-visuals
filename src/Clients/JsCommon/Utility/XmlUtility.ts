//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module jsCommon {
    export class XmlUtility {
        private static TabCharCode: number = 0x9;
        private static NewLineCharCode: number = 0xA;
        private static CarriageReturnCharCode: number = 0xD;

        public static removeInvalidCharacters(input: string): string {
            debug.assertValue(input, 'input');

            var startIndex = 0;
            var stringBuilder;

            for (var i = 0, len = input.length; i < len; i++) {
                if (!XmlUtility.isValidXmlCharacter(input, i)) {
                    if (!stringBuilder)
                        stringBuilder = new StringBuilder();

                    if (startIndex !== i)
                        stringBuilder.append(input.substring(startIndex, i));

                    startIndex = i + 1;
                }
            }

            if (!stringBuilder)
                return input;

            if (startIndex <= input.length - 1)
                 stringBuilder.append(input.substring(startIndex, input.length));

            return stringBuilder.toString();
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