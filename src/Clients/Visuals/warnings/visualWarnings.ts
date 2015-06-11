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

module powerbi.visuals {
    import IStringResourceProvider = jsCommon.IStringResourceProvider;

    export class NoMapLocationWarning implements IVisualWarning {
        public get code(): string {
            return 'NoMapLocation';
        }

        public getMessages(resourceProvider: IStringResourceProvider): IVisualErrorMessage {
            var messageKey: string = 'NoMapLocationMessage';
            var titleKey: string = 'NoMapLocationKey';
            var detailKey: string = 'NoMapLocationValue';

            var visualMessage: IVisualErrorMessage = {
                message: resourceProvider.get(messageKey),
                title: resourceProvider.get(titleKey),
                detail: resourceProvider.get(detailKey),
            };

            return visualMessage;
        }
    }

    export class SmallSlicesCulledWarning implements IVisualWarning {
        public get code(): string {
            return 'SmallSlicesCulled';
        }

        public getMessages(resourceProvider: IStringResourceProvider): IVisualErrorMessage {
            var messageKey: string = 'DsrLimitWarning_TooMuchDataMessage';
            var titleKey: string = '';
            var detailKey: string = '';

            var visualMessage: IVisualErrorMessage = {
                message: resourceProvider.get(messageKey),
                title: resourceProvider.get(titleKey),
                detail: resourceProvider.get(detailKey),
            };

            return visualMessage;
        }
    }

    export class NaNNotSupportedWarning implements IVisualWarning {
        public get code(): string {
            return 'NaNNotSupported';
        }

        public getMessages(resourceProvider: IStringResourceProvider): IVisualErrorMessage {
            var messageKey: string = 'VisualWarning_InfinityValues';

            var visualMessage: IVisualErrorMessage = {
                message: resourceProvider.get(messageKey),
                title: '',
                detail: '',
            };

            return visualMessage;
        }
    }

    export class InfinityValuesNotSupportedWarning implements IVisualWarning {
        public get code(): string {
            return 'InfinityValuesNotSupported';
        }

        public getMessages(resourceProvider: IStringResourceProvider): IVisualErrorMessage {
            var messageKey: string = 'VisualWarning_InfinityValues';

            var visualMessage: IVisualErrorMessage = {
                message: resourceProvider.get(messageKey),
                title: '',
                detail: '',
            };

            return visualMessage;
        }
    }

    export class ValuesOutOfRangeWarning implements IVisualWarning {
        public get code(): string {
            return 'ValuesOutOfRange';
        }

        public getMessages(resourceProvider: IStringResourceProvider): IVisualErrorMessage {
            var messageKey: string = 'VisualWarning_VisualizationOutOfRange';

            var visualMessage: IVisualErrorMessage = {
                message: resourceProvider.get(messageKey),
                title: '',
                detail: '',
            };

            return visualMessage;
        }
    }
}