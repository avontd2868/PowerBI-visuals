 //-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    import IStringResourceProvider = jsCommon.IStringResourceProvider;

    export class NoMapLocationWarning implements IVisualWarning {
        public getMessages(resourceProvider: IStringResourceProvider) {
            var visualMessage: IVisualErrorMessage = {
                message: resourceProvider.get('NoMapLocationMessage'),
                title: resourceProvider.get('NoMapLocationKey'),
                detail: resourceProvider.get('NoMapLocationVal'),
            };

            return visualMessage;
        }
    }
}