//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

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

            var keyValPair = this.getErrorKeyValueFromStatusCode(this.code, resourceProvider);
            var key = keyValPair.errorInfoKey;
            var val = keyValPair.errorInfoValue;

            // We use the localized code when it is known or when there are no details to show.
            var additionalInfo: ErrorInfoKeyValuePair[] = DsrClientError.isCodeKnown(this.code) || !azureDetails
                ? [{ errorInfoKey: key, errorInfoValue: val, }, ]
                : [];

            if (azureDetails) {
                // If there is already some data to display, then use 'More Info' as
                // the key.
                var detailsKey: string = additionalInfo.length === 0
                    ? key
                    : resourceProvider.get('DsrError_MoreInfo');

                additionalInfo.push({
                    errorInfoKey: detailsKey,
                    errorInfoValue: azureDetails,
                });
            }

            var details: ErrorDetails = {
                message: resourceProvider.get('DsrError_Message'),
                additionalErrorInfo: additionalInfo,
            };

            return details;
        }

        private getErrorKeyValueFromStatusCode(code: string, resourceProvider: IStringResourceProvider): ErrorInfoKeyValuePair {
            var key: string = resourceProvider.get('DsrError_Key');
            var val: string = resourceProvider.get('DsrError_UnknownErrorValue');

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
                case 'rsDataShapeProcessingError':
                case 'rsDataShapeQueryGenerationError':
                case 'rsDataShapeQueryTranslationError':
                case 'rsErrorExecutingCommand':
                    // These are known errors but will just get the generic text for now.
                    break;
            }

            var pair: ErrorInfoKeyValuePair = {
                errorInfoKey: key,
                errorInfoValue: val,
            };

            return pair;
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
                    return true;
                default:
                    return false;
            }
        }
    }
}