//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data {
    import IStringResourceProvider = jsCommon.IStringResourceProvider;

    export class InvalidDataFormatClientError implements IClientError {
        public get code(): string {
            return 'InvalidDataFormat';
        }
        public get ignorable(): boolean {
            return false;
        }

        public getDetails(resourceProvider: IStringResourceProvider): ErrorDetails {
            // To avoid creating a duplicate entry the same message and key can be used from the generic cannot load visual.
            var message: string = resourceProvider.get('ServiceError_CannotLoadVisual');
            var key: string = resourceProvider.get('ServiceError_ExecuteSemanticQueryErrorKey');

            var val: string = resourceProvider.get('InvalidDataFormat_DataFormatIsInvalid');

            var details: ErrorDetails = {
                message: message,
                additionalErrorInfo: [{ errorInfoKey: key, errorInfoValue: val, }, ],
            };

            return details;
        }
    }

    export class InvalidDataResponseClientError implements IClientError {
        public get code(): string {
            return 'InvalidDataResponse';
        }
        public get ignorable(): boolean {
            return false;
        }

        public getDetails(resourceProvider: IStringResourceProvider): ErrorDetails {
            // To avoid creating a duplicate entry the same message and key can be used from the generic cannot load visual.
            var message: string = resourceProvider.get('ServiceError_CannotLoadVisual');
            var key: string = resourceProvider.get('ServiceError_ExecuteSemanticQueryErrorKey');

            var val: string = resourceProvider.get('InvalidDataResponse_ServerError');

            var details: ErrorDetails = {
                message: message,
                additionalErrorInfo: [{ errorInfoKey: key, errorInfoValue: val, }, ],
            };

            return details;
        }
    }
} 