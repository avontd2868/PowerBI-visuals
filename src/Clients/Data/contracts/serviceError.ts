//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data {
    import IStringResourceProvider = jsCommon.IStringResourceProvider;

    export interface ServiceError {
        statusCode: number;
        // Message and stack trace should only be sent in non-production environments.
        message?: string;
        stackTrace?: string;
        errorDetails?: PowerBIErrorDetail[];
    }

    export interface PowerBIErrorDetail {
        code: string;
        detail: PowerBIErrorDetailValue;
    }

    export interface PowerBIErrorDetailValue {
        type: PowerBIErrorResourceType;
        value: string;
    }

    export enum PowerBIErrorResourceType {
        ResourceCodeReference = 0,
        EmbeddedString = 1,
    }

    export enum ServiceErrorStatusCode {
        GeneralError = 0,
        CsdlFetching = 1,
        CsdlConvertXmlToConceptualSchema = 2,
        CsdlCreateClientSchema = 3,
        ExecuteSemanticQueryError = 4,
        ExecuteSemanticQueryInvalidStreamFormat = 5,
    }

    export class ServiceErrorToClientError implements IClientError {
        private m_serviceError: ServiceError;
        private static codeName = 'ServiceErrorToClientError';

        public get code(): string {
            return ServiceErrorToClientError.codeName;
        }

        public get ignorable(): boolean {
            return false;
        }

        constructor(serviceError: ServiceError) {
            this.m_serviceError = serviceError;
        }

        public getDetails(resourceProvider: IStringResourceProvider): ErrorDetails {
            var errorDetails: ErrorDetails = PowerBIErrorDetailHelper.GetDetailsFromServerErrorStatusCode(resourceProvider, this.m_serviceError.statusCode);

            PowerBIErrorDetailHelper.addAdditionalInfo(errorDetails, this.m_serviceError.errorDetails, resourceProvider);

            return errorDetails;
        }
    }

    export class PowerBIErrorDetailHelper {
        private static serverErrorPrefix = "ServerError_";
        public static addAdditionalInfo(errorDetails: ErrorDetails, pbiErrorDetails: data.PowerBIErrorDetail[], localize: IStringResourceProvider): ErrorDetails {
            if (pbiErrorDetails) {
                for (var i = 0; i < pbiErrorDetails.length; i++) {
                    var element = pbiErrorDetails[i];
                    var additionErrorInfoKeyValuePair = {
                        errorInfoKey: localize.get(PowerBIErrorDetailHelper.serverErrorPrefix + element.code),
                        errorInfoValue: element.detail.type === data.PowerBIErrorResourceType.ResourceCodeReference ? localize.get(PowerBIErrorDetailHelper.serverErrorPrefix + element.detail.value) : element.detail.value
                    };

                    errorDetails.additionalErrorInfo.push(additionErrorInfoKeyValuePair);
                }
            }
            return errorDetails;
        }

        public static GetDetailsFromServerErrorStatusCode(localize: IStringResourceProvider, statusCode: number): ErrorDetails {
            // TODO: Localize
            var message: string = "";
            var key: string = "";
            var val: string = "";

            switch (statusCode) {
                case ServiceErrorStatusCode.CsdlConvertXmlToConceptualSchema:
                    message = localize.get('ServiceError_ModelCannotLoad');
                    key = localize.get('ServiceError_ModelConvertFailureKey');
                    val = localize.get('ServiceError_ModelConvertFailureValue');
                    break;
                case ServiceErrorStatusCode.CsdlCreateClientSchema:
                    message = localize.get('ServiceError_ModelCannotLoad');
                    key = localize.get('ServiceError_ModelCreationFailureKey');
                    val = localize.get('ServiceError_ModelCreationFailureValue');
                    break;
                case ServiceErrorStatusCode.CsdlFetching:
                    message = localize.get('ServiceError_ModelCannotLoad');
                    key = localize.get('ServiceError_ModelFetchingFailureKey');
                    val = localize.get('ServiceError_ModelFetchingFailureValue');
                    break;
                case ServiceErrorStatusCode.ExecuteSemanticQueryError:
                    message = localize.get('ServiceError_CannotLoadVisual');
                    key = localize.get('ServiceError_ExecuteSemanticQueryErrorKey');
                    val = localize.get('ServiceError_ExecuteSemanticQueryErrorValue');
                    break;
                case ServiceErrorStatusCode.ExecuteSemanticQueryInvalidStreamFormat:
                    message = localize.get('ServiceError_CannotLoadVisual');
                    key = localize.get('ServiceError_ExecuteSemanticQueryInvalidStreamFormatKey');
                    val = localize.get('ServiceError_ExecuteSemanticQueryInvalidStreamFormatValue');
                    break;
                case ServiceErrorStatusCode.GeneralError:
                default:
                    message = localize.get('ServiceError_GeneralError');
                    key = localize.get('ServiceError_GeneralErrorKey');
                    val = localize.get('ServiceError_GeneralErrorValue');
                    break;
            }

            var additionalInfo: ErrorInfoKeyValuePair[] = [];
            additionalInfo.push({ errorInfoKey: key, errorInfoValue: val, });

            var errorDetails: ErrorDetails = {
                message: message,
                additionalErrorInfo: additionalInfo,
            };

            return errorDetails;
        }
    }
} 