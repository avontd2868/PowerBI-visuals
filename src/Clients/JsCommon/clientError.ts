//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi {
    import IStringResourceProvider = jsCommon.IStringResourceProvider;

    export interface ILocalizableError {
        getDetails(resourceProvider: IStringResourceProvider): ErrorDetails;
    }

    export interface IClientError extends ILocalizableError {
        code: string;
        debugInfo?: string;
        ignorable?: boolean;
    }

    export interface IClientWarning extends ILocalizableError {
        columnNameFromIndex: (index: number) => string;
    }

    export class UnknownClientError implements IClientError {
        public get code(): string {
            return 'UnknownClientError';
        }
        public get ignorable(): boolean {
            return false;
        }

        public getDetails(resourceProvider: IStringResourceProvider): ErrorDetails {
            var details: ErrorDetails = {
                message: resourceProvider.get('ClientError_UnknownClientErrorValue'),
                additionalErrorInfo: [{ errorInfoKey: resourceProvider.get('ClientError_UnknownClientErrorKey'), errorInfoValue: resourceProvider.get('ClientError_UnknownClientErrorValue'), }],
            };

            return details;
        }
    }

    export class IgnorableClientError implements IClientError {
        public get code(): string {
            return 'IgnorableClientError';
        }
        public get ignorable(): boolean {
            return true;
        }

        public getDetails(resourceProvider: IStringResourceProvider): ErrorDetails {
            var details: ErrorDetails = {
                message: '',
                additionalErrorInfo: [],
            };

            return details;
        }
    }
}  