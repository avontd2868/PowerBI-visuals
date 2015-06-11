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