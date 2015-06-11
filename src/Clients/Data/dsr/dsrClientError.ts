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

module powerbi {
    import IStringResourceProvider = jsCommon.IStringResourceProvider;
    import ODataError = powerbi.data.dsr.ODataError;
    import AdditionalErrorMessage = powerbi.data.dsr.AdditionalErrorMessage;

    export class DsrClientError implements IClientError {
        private oDataError: ODataError;
        private oDataCode: string;

        public get code(): string {
            return this.oDataCode;
        }

        public get ignorable(): boolean {
            return false;
        }
        
        constructor(oDataError: ODataError) {
            this.oDataError = oDataError;

            this.oDataCode = this.parseCode();
        }

        public getDetails(resourceProvider: IStringResourceProvider): ErrorDetails {
            // Convert the oDataError into a client error. Use a localized client error
            // when it is a known error code; otherwise use the azure details field. If
            // the code is not known and there are no azure details, then just use the
            // simple localized text.

            var values = this.oDataError['azure:values'];

            var azureDetails: string = null;
            if (values) {
                for (var i = 0; i < values.length; i++) {
                    if (values[i].details) {
                        azureDetails = values[i].details;
                        break;
                    }
                }
            }

            var details = DsrClientError.getErrorDetailsFromStatusCode(this.code, resourceProvider);
            var key = details.additionalErrorInfo[0].errorInfoKey;

            // When the code is unknown and the details  message is available, use it
            // instead of the localized message.
            if (!DsrClientError.isCodeKnown(this.code) && azureDetails)
                details.additionalErrorInfo = [];

            if (azureDetails) {
                // If the additionalErrorInfo already has text to display, then use
                // 'More Info' as the key.
                var detailsKey: string = details.additionalErrorInfo.length === 0
                    ? key
                    : resourceProvider.get('DsrError_MoreInfo');

                details.additionalErrorInfo.push({
                    errorInfoKey: detailsKey,
                    errorInfoValue: azureDetails,
                });
            }

            return details;
        }

        private static getErrorDetailsFromStatusCode(code: string, resourceProvider: IStringResourceProvider): ErrorDetails {
            var key: string = resourceProvider.get('DsrError_Key');
            var val: string = resourceProvider.get('DsrError_UnknownErrorValue');
            var message: string = resourceProvider.get('DsrError_Message');

            switch (code) {
                case 'ErrorLoadingModel':
                    key = resourceProvider.get('DsrError_LoadingModelKey');
                    val = resourceProvider.get('DsrError_LoadingModelValue');
                    break;
                case 'InvalidDataShapeNoOutputData':
                    val = resourceProvider.get('DsrError_InvalidDataShapeValue');
                    break;
                case 'InvalidUnconstrainedJoin':
                    key = resourceProvider.get('DsrError_InvalidUnconstrainedJoinKey');
                    val = resourceProvider.get('DsrError_InvalidUnconstrainedJoinValue');
                    break;
                case 'ModelUnavailable':
                    val = resourceProvider.get('DsrError_ModelUnavailableValue');
                    break;
                case 'OverlappingKeysOnOppositeHierarchies':
                    key = resourceProvider.get('DsrError_OverlappingKeysKey');
                    val = resourceProvider.get('DsrError_OverlappingKeysValue');
                    break;
                case 'rsQueryMemoryLimitExceeded':
                case 'rsQueryTimeoutExceeded':
                    key = resourceProvider.get('DsrError_ResourcesExceededKey');
                    val = resourceProvider.get('DsrError_ResourcesExceededValue');
                    message = resourceProvider.get('DsrError_ResourcesExceededMessage');
                    break;
                case 'rsDataShapeProcessingError':
                case 'rsDataShapeQueryGenerationError':
                case 'rsDataShapeQueryTranslationError':
                case 'rsErrorExecutingCommand':
                    // These are known errors but will just get the generic text for now.
                    break;
            }

            var details: ErrorDetails = {
                message: message,
                additionalErrorInfo: [{
                    errorInfoKey: key,
                    errorInfoValue: val
                }],
            };

            return details;
        }

        private parseCode(): string {
            var code: string = this.oDataError.code;

            var values = this.oDataError['azure:values'];
            var additionalMessages: AdditionalErrorMessage[] = [];
            if (values) {
                for (var i = 0; i < values.length; i++) {
                    if (values[i].additionalMessages) {
                        additionalMessages = values[i].additionalMessages;
                    }
                }
            }

            if (additionalMessages.length > 0) {
                for (var i = 0; i < additionalMessages.length; i++) {
                    if (DsrClientError.isCodeKnown(additionalMessages[i].Code)) {
                        code = additionalMessages[i].Code;
                    }
                }
            }

            return code;
        }

        private static isCodeKnown(code: string): boolean {
            switch (code) {
                case 'ErrorLoadingModel':
                case 'InvalidDataShapeNoOutputData':
                case 'InvalidUnconstrainedJoin':
                case 'ModelUnavailable':
                case 'OverlappingKeysOnOppositeHierarchies':
                case 'rsQueryMemoryLimitExceeded':
                case 'rsQueryTimeoutExceeded':
                    return true;
                default:
                    return false;
            }
        }
    }
}