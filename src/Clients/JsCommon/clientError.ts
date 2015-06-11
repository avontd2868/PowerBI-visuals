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