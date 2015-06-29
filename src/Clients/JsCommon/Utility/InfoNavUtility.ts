//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module InJs {

    export class InfoNavUtility {

        // Error Templates
        // TODO: Move Error Templating code to a shared control
        private static infonavAdditionalErrorClass = 'infonav-additionalError';
        private static infonavShowAdditionalErrorClass = 'infonav-showAdditionalError';
        private static infoNavErrorInfoFieldTemplate: string =
        '<div class="infonav-errorInfoItem">' +
        '<span class="infonav-errorInfoHeader">{FieldTitle}</span>' +
        '<span class="infonav-errorInfoText">{FieldValue}</span>' +
        '</div>';

        /**
         * Create an Error Information Block
         * @param statusCode - The status code to display
         * @param errorType - The optional error string to display
         * @param activityId - The activity id
         * @param requestId - The request id
         * @param timeStamp - The timestamp
         */
        public static constructAdditionalErrorInfoBlock(statusCode: string, errorType: string, activityId: string, requestId: string, timeStamp: Date, scriptError?: ScriptErrorInfo): JQuery {
            var additionalErrorInfo = $('<p />');
            if (!jsCommon.StringExtensions.isNullOrEmpty(statusCode)) {
                var errorCode = statusCode;
                if (!jsCommon.StringExtensions.isNullOrEmpty(errorType)) {
                    errorCode = jsCommon.StringExtensions.format(Strings.infoNavErrorCodeTemplate, statusCode, errorType);
                }
                additionalErrorInfo.append(InfoNavUtility.constructErrorField(Strings.errorCodeText, errorCode));
            }
            if (!jsCommon.StringExtensions.isNullOrEmpty(activityId)) {
                additionalErrorInfo.append(InfoNavUtility.constructErrorField(Strings.errorActivityIdText, activityId));
            }
            if (!jsCommon.StringExtensions.isNullOrEmpty(requestId)) {
                additionalErrorInfo.append(InfoNavUtility.constructErrorField(Strings.errorRequestIdText, requestId));
            }
            if (scriptError) {
                if (scriptError.sourceUrl) {
                    additionalErrorInfo.append(InfoNavUtility.constructErrorField(Strings.errorSourceFileText, scriptError.sourceUrl));
                }
                if (scriptError.lineNumber) {
                    additionalErrorInfo.append(InfoNavUtility.constructErrorField(Strings.errorLineNumberText, scriptError.lineNumber.toString()));
                }
                if (scriptError.columnNumber) {
                    additionalErrorInfo.append(InfoNavUtility.constructErrorField(Strings.errorColumnNumberText, scriptError.columnNumber.toString()));
                }
                if (scriptError.stack) {
                    additionalErrorInfo.append(InfoNavUtility.constructErrorField(Strings.errorStackTraceText, scriptError.stack));
                }
            }
            if (!timeStamp) {
                timeStamp = new Date();
            }
            additionalErrorInfo.append(InfoNavUtility.constructErrorField(Strings.errorTimestampText, timeStamp.toString()));
            return additionalErrorInfo;
        }

        /**
         * Create a container that can show additional error info when a user clicks a show details link
         * @param additionalErrorInfo - The additional error info to display
         * @returns The container
         */
        public static constructShowDetailsContainer(additionalErrorInfo: JQuery) {
            var additionalErrorInfoContainer = $('<div />');
            var showDetailsLink = $('<a class="showAdditionalDetailsLink" href=\'javascript:\' />');
            showDetailsLink.addClass(InfoNavUtility.infonavShowAdditionalErrorClass);
            showDetailsLink.text(Strings.showDetailsText);

            showDetailsLink.on(jsCommon.DOMConstants.mouseClickEventName,(e: JQueryEventObject) => {
                additionalErrorInfoContainer.find(jsCommon.Utility.createClassSelector(InfoNavUtility.infonavShowAdditionalErrorClass)).remove();
                additionalErrorInfoContainer.find(jsCommon.Utility.createClassSelector(InfoNavUtility.infonavAdditionalErrorClass)).css(jsCommon.CssConstants.displayProperty, jsCommon.CssConstants.blockValue);
            });

            additionalErrorInfo.css(jsCommon.CssConstants.displayProperty, jsCommon.CssConstants.noneValue);
            additionalErrorInfo.addClass(InfoNavUtility.infonavAdditionalErrorClass);
            additionalErrorInfoContainer.append(showDetailsLink);
            additionalErrorInfoContainer.append(additionalErrorInfo);

            return additionalErrorInfoContainer;
        }

        /**
         * Helper method to construct an error field
         * @param fieldTitle - The title of the field
         * @param fieldValue - The value for the field
         * @returns An html fragment for the error field
         */
        public static constructErrorField(fieldTitle: string, fieldValue: string): JQuery {
            var retValue = $(InfoNavUtility.infoNavErrorInfoFieldTemplate.replace('{FieldTitle}', fieldTitle));
            retValue.find('.infonav-errorInfoText').multiline(fieldValue);

            return retValue;
        }
    }
}