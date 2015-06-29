///<reference path="../../CloudUX/obj/CloudUX.d.ts"/>
///<reference path="../../typedefs/d3/d3.d.ts"/>
///<reference path="../../Data/obj/data.d.ts"/>
///<reference path="../../typedefs/jQuery/jQuery.d.ts"/>
///<reference path="../../typedefs/jQuery/jqueryui.d.ts"/>
///<reference path="../../typedefs/moment/moment.d.ts"/>
///<reference path="../../JsCommon/obj/utility.d.ts"/>
///<reference path="../../Visuals/obj/visuals.d.ts"/>
///<reference path="../../typedefs/velocity/velocity-animate.d.ts"/>
// -----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// -----------------------------------------------------------------------
/// <disable>JS2025.InsertSpaceBeforeCommentText,JS2027.PunctuateCommentsCorrectly,JS2076.IdentifierIsMiscased,JS3085.VariableDeclaredMultipleTimes, JS3116.PreviousDeclarationWasHere, JS2074.IdentifierNameIsMisspelled, JS2030.FollowKeywordsWithSpace, JS2023.UseDoubleQuotesForStringLiterals, JS2028.UseCPlusPlusStyleComments, JS2026.CapitalizeComments, JS2008.DoNotUseCookies, JS2005.UseShortFormInitializations, JS2064.SpecifyNewWhenCallingConstructor, JS2024.DoNotQuoteObjectLiteralPropertyNames, JS2043.RemoveDebugCode, JS3045.MissingInputFile</disable>
/// <dictionary target='comment'>args,aspx,autocompletion,enqueue,Firefox,Hardcoded,interdependant,Kinda,Moderncop,Nav,param,params,powerview, secweb, serializer, sharepoint, silverlight, src, stylesheet, theming, untokenized, Xmla </dictionary>
// ModernCop Rules and Settings - Disabling some non critical warnings that we currently have per:
// http://secweb01/MSEC/Tools/Lists/MSEC%20Tool%20Errors%20and%20Warnings/AllItems.aspx?FilterField1=Tool&FilterValue1=Moderncop
/// <disable>JS2085.EnableStrictMode</disable>
// Justification: The violation is that strict mode is enabled for global scope, which could lead
// to unexpected behavior if the target JS file of this project is concatenated with other JS files.
// The target JS file of this project is not concatenated with other files.
"use strict";
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** Exception types */
    var Exceptions;
    (function (Exceptions) {
        var UnsupportedBrowserException = (function () {
            function UnsupportedBrowserException() {
            }
            return UnsupportedBrowserException;
        })();
        Exceptions.UnsupportedBrowserException = UnsupportedBrowserException;
        var MissingDependencyException = (function () {
            function MissingDependencyException(missingDependency) {
                this._message = MissingDependencyException._messagePattern + missingDependency;
            }
            MissingDependencyException.prototype.toString = function () {
                return this._message;
            };
            MissingDependencyException._messagePattern = "Missing required dependency: ";
            return MissingDependencyException;
        })();
        Exceptions.MissingDependencyException = MissingDependencyException;
        var UnknownStorageException = (function () {
            function UnknownStorageException() {
            }
            return UnknownStorageException;
        })();
        Exceptions.UnknownStorageException = UnknownStorageException;
    })(Exceptions = InJs.Exceptions || (InJs.Exceptions = {}));
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var TraceType = jsCommon.TraceType;
    /* The modal dialog control wrapper for the InfoNav project, which registers with the event bridge */
    var ModalDialog = (function () {
        function ModalDialog(dialogHost, connectionGroup, modalDialog) {
            this._modalDialog = null;
            if (modalDialog) {
                this._modalDialog = modalDialog;
            }
            else {
                this._modalDialog = new jsCommon.ModalDialog(dialogHost);
            }
            if (connectionGroup) {
                this.registerOnConnectionGroup(connectionGroup);
            }
        }
        ModalDialog.prototype.registerOnConnectionGroup = function (connectionGroup) {
            debug.assertValue(connectionGroup, 'connectionGroup');
            connectionGroup.bridge.attach(InJs.Events.ShowMessageEventName, ModalDialog.bridge_ShowMessage, this);
            connectionGroup.bridge.attach(InJs.Events.ShowPromptEventName, ModalDialog.bridge_ShowPrompt, this);
            connectionGroup.bridge.attach(InJs.Events.ShowErrorEventName, ModalDialog.bridge_ShowError, this);
            connectionGroup.bridge.attach(InJs.Events.ShowCustomDialogEventName, ModalDialog.bridge_ShowCustomDialog, this);
            connectionGroup.bridge.attach(InJs.Events.HideDialogEventName, ModalDialog.bridge_HideDialog, this);
        };
        ModalDialog.prototype.unregisterFromConnectionGroup = function (connectionGroup) {
            // Unsubscribe from all event bridge events
            debug.assertValue(connectionGroup, 'connectionGroup');
            connectionGroup.bridge.detach(InJs.Events.ShowMessageEventName, ModalDialog.bridge_ShowMessage);
            connectionGroup.bridge.detach(InJs.Events.ShowPromptEventName, ModalDialog.bridge_ShowPrompt);
            connectionGroup.bridge.detach(InJs.Events.ShowErrorEventName, ModalDialog.bridge_ShowError);
            connectionGroup.bridge.detach(InJs.Events.ShowCustomDialogEventName, ModalDialog.bridge_ShowCustomDialog);
            connectionGroup.bridge.detach(InJs.Events.HideDialogEventName, ModalDialog.bridge_HideDialog);
        };
        ModalDialog.bridge_ShowMessage = function (e, eventArgs) {
            var self = e.data;
            InJs.Utility.throwIfNullOrUndefined(eventArgs, self, 'Bridge_ShowMessage', 'eventArgs');
            self._onShowMessage(eventArgs);
        };
        ModalDialog.bridge_ShowPrompt = function (e, eventArgs) {
            var self = e.data;
            InJs.Utility.throwIfNullOrUndefined(eventArgs, self, 'Bridge_ShowPrompt', 'eventArgs');
            self._onShowPrompt(eventArgs);
        };
        ModalDialog.bridge_ShowError = function (e, eventArgs) {
            var self = e.data;
            InJs.Utility.throwIfNullOrUndefined(eventArgs, self, 'Bridge_ShowError', 'eventArgs');
            self._onShowError(eventArgs);
        };
        ModalDialog.bridge_ShowCustomDialog = function (e, eventArgs) {
            var self = e.data;
            InJs.Utility.throwIfNullOrUndefined(eventArgs, self, 'Bridge_ShowCustomDialog', 'eventArgs');
            self._onShowCustomDialog(eventArgs);
        };
        ModalDialog.bridge_HideDialog = function (e) {
            var self = e.data;
            self._onHideDialog();
        };
        ModalDialog.prototype._onShowMessage = function (eventArgs) {
            this.showMessage(eventArgs.messageTitle, eventArgs.messageText);
        };
        ModalDialog.prototype._onShowPrompt = function (eventArgs) {
            this.showPrompt(eventArgs.promptTitle, eventArgs.promptText, eventArgs.promptActions, eventArgs.isDismissable);
        };
        ModalDialog.prototype._onShowError = function (eventArgs) {
            this.showError(eventArgs.errorText, eventArgs.errorType, eventArgs.request, eventArgs.scriptError);
        };
        ModalDialog.prototype._onShowCustomDialog = function (eventArgs) {
            this.showCustomDialog(eventArgs.titleText, eventArgs.dialogContent, eventArgs.dialogActions, eventArgs.onDialogDisplayed, eventArgs.isDismissable);
        };
        ModalDialog.prototype._onHideDialog = function () {
            this.hideDialog();
        };
        /**
         * Displays a dismissable message to the user
         * The only action available to the user is "Close"
         * @param messageTitle - The title of the dialog
         * @param messageText - The message to display to the user
         */
        ModalDialog.prototype.showMessage = function (messageTitle, messageText) {
            this._modalDialog.showMessage(messageTitle, messageText);
        };
        /**
         * Displays a customizable prompt to the user
         * @param promptTitle - The tile of the prompt dialog
         * @param promptText - The message to display to the user
         * @param promptActions - An array of ModalDialogAction objects describing the possible actions in the prompt
         * @param isDismissable - Whether the dialog should include a close button
         */
        ModalDialog.prototype.showPrompt = function (promptTitle, promptText, promptActions, isDismissable) {
            this._modalDialog.showPrompt(promptTitle, promptText, promptActions, isDismissable);
        };
        /**
         * Displays an error message to the user
         * @param errorText - The message to display to the user
         * @param errorType - The type of error be displayed to the user
         * @param request - The (optional) request that triggered the error for showing additional technical details
         */
        ModalDialog.prototype.showError = function (errorText, errorType, request, scriptError, connectionGroup) {
            InJs.Utility.throwIfNullOrEmptyString(errorText, null, 'ShowError', 'errorText');
            if (connectionGroup) {
                var requestId = null;
                if (request)
                    requestId = InJs.HttpUtility.getRequestId(request);
                connectionGroup.telemetryService.notifyUserGotError(6 /* IMDE */, new InJs.UserGotErrorEventArgs(errorType ? TraceType[errorType] : '', errorText, requestId));
            }
            var additionalErrorInfo = this.constructAdditionalErrorInfoKeyValuePairs(InJs.AppManager.current.activityId, request, scriptError);
            this._modalDialog.showError(errorText, errorType, additionalErrorInfo);
            var traceText = errorText;
            if (scriptError) {
                if (scriptError.sourceUrl) {
                    traceText += ', at file ' + scriptError.sourceUrl;
                }
                if (scriptError.lineNumber) {
                    traceText += ', line number ' + scriptError.lineNumber.toString();
                }
                if (scriptError.columnNumber) {
                    traceText += ', column number ' + scriptError.columnNumber.toString();
                }
            }
            InJs.Tracing.error(traceText);
        };
        /**
         * Displays a custom message to the user
         * @param titleText - The tile of the custom dialog
         * @param messageContent - The html element to display to the user
         * @param dialogActions - An array of ModalDialogAction objects describing the possible actions in the prompt
         * @param onDialogDisplayed - Callback invoked when the modal dialog is displayed
         * @param isDismissable - Whether the dialog is dismissable
         * @returns The host element for the dialog
         */
        ModalDialog.prototype.showCustomDialog = function (titleText, dialogContent, dialogActions, onDialogDisplayed, isDismissable) {
            return this._modalDialog.showCustomDialog(titleText, dialogContent, dialogActions, onDialogDisplayed, isDismissable);
        };
        /** Hides the current contents of the modal dialog */
        ModalDialog.prototype.hideDialog = function () {
            this._modalDialog.hideDialog();
        };
        ModalDialog.prototype.constructAdditionalErrorInfoKeyValuePairs = function (activityId, request, scriptError) {
            var requestId;
            var errorType;
            var statusCode;
            var errorKeyValuePair;
            var additionalErrorInfo;
            additionalErrorInfo = [];
            if (request) {
                statusCode = request.status.toString();
                errorType = InJs.HttpUtility.getErrorInfo(request);
                requestId = InJs.HttpUtility.getRequestId(request);
                if (!InJs.StringExtensions.isNullOrEmpty(statusCode)) {
                    var errorCode = statusCode;
                    if (!InJs.StringExtensions.isNullOrEmpty(errorType)) {
                        errorCode = InJs.StringExtensions.format(InJs.Strings.infoNavErrorCodeTemplate, statusCode, errorType);
                        errorKeyValuePair = {
                            errorInfoKey: InJs.Strings.errorCodeText,
                            errorInfoValue: errorCode
                        };
                        additionalErrorInfo.push(errorKeyValuePair);
                    }
                }
                if (!InJs.StringExtensions.isNullOrEmpty(requestId)) {
                    errorKeyValuePair = {
                        errorInfoKey: InJs.Strings.errorRequestIdText,
                        errorInfoValue: requestId
                    };
                    additionalErrorInfo.push(errorKeyValuePair);
                }
            }
            if (!InJs.StringExtensions.isNullOrEmpty(activityId)) {
                errorKeyValuePair = {
                    errorInfoKey: InJs.Strings.errorActivityIdText,
                    errorInfoValue: activityId
                };
                additionalErrorInfo.push(errorKeyValuePair);
            }
            if (scriptError) {
                if (scriptError.sourceUrl) {
                    errorKeyValuePair = {
                        errorInfoKey: InJs.Strings.errorSourceFileText,
                        errorInfoValue: scriptError.sourceUrl
                    };
                    additionalErrorInfo.push(errorKeyValuePair);
                }
                if (scriptError.lineNumber) {
                    errorKeyValuePair = {
                        errorInfoKey: InJs.Strings.errorLineNumberText,
                        errorInfoValue: scriptError.lineNumber.toString()
                    };
                    additionalErrorInfo.push(errorKeyValuePair);
                }
                if (scriptError.columnNumber) {
                    errorKeyValuePair = {
                        errorInfoKey: InJs.Strings.errorColumnNumberText,
                        errorInfoValue: scriptError.columnNumber.toString()
                    };
                    additionalErrorInfo.push(errorKeyValuePair);
                }
                if (scriptError.stack) {
                    errorKeyValuePair = {
                        errorInfoKey: InJs.Strings.errorStackTraceText,
                        errorInfoValue: scriptError.stack
                    };
                    additionalErrorInfo.push(errorKeyValuePair);
                }
            }
            errorKeyValuePair = {
                errorInfoKey: InJs.Strings.errorTimestampText,
                errorInfoValue: new Date().toString()
            };
            additionalErrorInfo.push(errorKeyValuePair);
            return additionalErrorInfo;
        };
        return ModalDialog;
    })();
    InJs.ModalDialog = ModalDialog;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var BrowserUtility = (function () {
        function BrowserUtility() {
        }
        /**
         * Used during initialization. If returns false a ModalDialog will be displayed on the
         * messaging target as specified by the particular connection group.
         */
        BrowserUtility.isBrowserSupported = function () {
            // Note that IE9 will be dismissed by not supporting CORS. We could technically work around that but still 
            // there are issues with the QuestionBox which does not work properly in IE9 (e.g. unrecognized terms or term selection)
            return (BrowserUtility.browserSupportsEssentials() && BrowserUtility.supportsFunctionBind() && BrowserUtility.supportsCors());
        };
        /** Used while interpreting the script. If returns false a ModalDialog will be displayed on the body. */
        BrowserUtility.browserSupportsEssentials = function () {
            return BrowserUtility.supportsDefineProperty();
        };
        /**
         * Get the current version of IE
         * @returns The version of Internet Explorer or a 0 (indicating the use of another browser).
         */
        BrowserUtility.getInternetExplorerVersion = function () {
            var retValue = 0;
            if (navigator.appName === 'Microsoft Internet Explorer' || window.navigator.userAgent.indexOf('MSIE') >= 0) {
                var re = new RegExp('MSIE ([0-9]{1,}[\\.0-9]{0,})');
                var result = re.exec(window.navigator.userAgent);
                if (result) {
                    retValue = parseFloat(result[1]);
                }
            }
            return retValue;
        };
        /**
         * Get the current version of Opera
         * @returns The version of Opera or a 0 (indicating the use of another browser).
         */
        BrowserUtility.getOperaVersion = function () {
            if (navigator.userAgent.indexOf('Opera/') > -1) {
                return parseFloat(navigator.appVersion);
            }
        };
        /**
         * IE8 will fail this check. Without this function available we cannot even load the script.
         * This is because we compile our script expecting support for ECMA Script 5.
         */
        BrowserUtility.supportsDefineProperty = function () {
            if (!Object.defineProperty)
                return false;
            try {
                var customObject = {};
                var propertyDescriptor = { get: function () {
                    return true;
                }, enumerable: true, configurable: false };
                Object.defineProperty(customObject, "customProperty", propertyDescriptor);
                return true;
            }
            catch (e) {
                return false;
            }
        };
        /** IE8 will fail this check */
        BrowserUtility.supportsFunctionBind = function () {
            return Function.prototype.bind ? true : false;
        };
        /** IE9 will fail this check */
        BrowserUtility.supportsCors = function () {
            return $.support.cors;
        };
        return BrowserUtility;
    })();
    InJs.BrowserUtility = BrowserUtility;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
/**
 * This code is meant to execute as the interpreter is making its way through the client code on script load and identify issues
 * and/or missing features that would prevent us from even loading our script. The problem with this is that we don't have the target
 * container and thus have to bind the modal dialog to the body possibly covering the site navigation etc. That is why only problems
 * that will completely break our script functionality should be included in here
 */
if (!InJs.BrowserUtility.browserSupportsEssentials()) {
    // At this point we don't have a connection group or a tag to hook up messaging to but we know that nothing 
    // will actually run since the essentials are missing (e.g. IE9) which means we have to show this message on the body
    window.onload = function () {
        var unsupportedBrowserDialog = new InJs.ModalDialog($('body'));
        unsupportedBrowserDialog.showPrompt(InJs.Strings.unsupportedBrowserMessageTitle, InJs.Strings.unsupportedBrowserMessageText, [], false);
    };
}
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** The Collage item editor control used to construct/edit CollageItems */
    var CollageItemEditorTemplateProvider = (function () {
        function CollageItemEditorTemplateProvider() {
            this._controlRootTemplate = '<div class="collageItemEditorLayout">' + '<div class="layoutMain">' + '<div class="layoutLeft">' + '<div class="editorSection">' + '<div class="title">{utteranceSectionTitle}</div>' + '<input id="utterance" type="text" placeholder="{utteranceInputPlaceholder}">' + '<div class="utteranceCaption caption">{utteranceInputCaption}</div>' + '<div class="featuredQuestionLevelChoice">' + '<input type="checkbox" name="featuredQuestionLevel" id="isTopLevel" name="isTopLevel">' + '<label for="isTopLevel">{featureOnPowerBICaption}</label>' + '</div>' + '</div>' + '<div class="editorSection">' + '<div class="title">{tileSizeSectionTitle}</div>' + '<div class="sizePicker">' + '<input type="radio" name="itemSize" id="small" value="0" checked>' + '<label for="small">{tileSizeSmallCaption}</label>' + '<input type="radio" name="itemSize" id="large" value="1">' + '<label for="large">{tileSizeLargeCaption}</label>' + '</div>' + '</div>' + '<div class="editorSection">' + '<div class="title">{tileColorSectionTitle}</div>' + '<div class="visualPicker bgColorPicker">' + '<input type="radio" name="itemColor" id="light-blue" value="0" checked>' + '<label for="light-blue"><div class="colorSample light-blue"></div></label>' + '<input type="radio" name="itemColor" id="blue" value="1">' + '<label for="blue"><div class="colorSample blue"></div></label>' + '<input type="radio" name="itemColor" id="green" value="2">' + '<label for="green"><div class="colorSample green"></div></label>' + '<input type="radio" name="itemColor" id="orange" value="3">' + '<label for="orange"><div class="colorSample orange"></div></label>' + '<input type="radio" name="itemColor" id="red" value="4">' + '<label for="red"><div class="colorSample red"></div></label>' + '<input type="radio" name="itemColor" id="gray" value="5">' + '<label for="gray"><div class="colorSample gray"></div></label>' + '</div>' + '</div>' + '<div class="editorSection">' + '<div class="title">{tileIconSectionTitle}</div>' + '<div class="visualPicker bgIconPicker">' + '<input type="radio" name="itemIcon" id="general" value="1" checked>' + '<label for="general"><div class="iconSample general"></div></label>' + '<input type="radio" name="itemIcon" id="generalChart" value="5">' + '<label for="generalChart"><div class="iconSample generalChart"></div></label>' + '<input type="radio" name="itemIcon" id="favorite" value="8">' + '<label for="favorite"><div class="iconSample favorite"></div></label>' + '<input type="radio" name="itemIcon" id="columnChart" value="3">' + '<label for="columnChart"><div class="iconSample columnChart"></div></label>' + '<input type="radio" name="itemIcon" id="lineChart" value="4">' + '<label for="lineChart"><div class="iconSample lineChart"></div></label>' + '<input type="radio" name="itemIcon" id="pieChart" value="6">' + '<label for="pieChart"><div class="iconSample pieChart"></div></label>' + '<input type="radio" name="itemIcon" id="number" value="7">' + '<label for="number"><div class="iconSample number"></div></label>' + '<input type="radio" name="itemIcon" id="money" value="2">' + '<label for="money"><div class="iconSample money"></div></label>' + '</div>' + '</div>' + '<div class="editorSection">' + '<div class="title">{tileCustomImageSectionTitle}</div>' + '<input id="bgImgUrl" type="text" spellcheck="false" autocomplete="off" maxlength="500" placeholder="{cusomtImageUrlInputPlaceholder}">' + '<div class="bgImgUrlCaption caption">{cusomtImageUrlInputCaption}</div>' + '</div>' + '</div>' + '<div class="layoutRight">' + '<div class="previewHost">' + '<div class="editorSection previewSection">' + '<div class="title">{previewRegionTitle}</div>' + '<div class="collageItemContainer"></div>' + '</div>' + '</div>' + '</div>' + '</div>' + '<div class="editorActions">' + '<input id="saveBtn" type="button" value="{saveBtnText}" disabled>' + '<input id="cancelBtn" type="button" value="{cancelBtnText}">' + '</div>';
        }
        Object.defineProperty(CollageItemEditorTemplateProvider.prototype, "controlTemplate", {
            get: function () {
                var formattedTemplate = this._controlRootTemplate.replace('{utteranceSectionTitle}', InJs.Strings.CollageItemEditorUtteranceFormRegionTitle).replace('{utteranceInputPlaceholder}', InJs.Strings.CollageItemEditorUtteranceInputPlaceholder).replace('{utteranceInputCaption}', InJs.Strings.CollageItemEditorUtteranceInputCaption).replace('{featureOnPowerBICaption}', InJs.Strings.CollageItemEditorFeatureOnPowerBICheckboxCaption).replace('{tileSizeSectionTitle}', InJs.Strings.CollageItemEditorTileSizeFormRegionTitle).replace('{tileSizeSmallCaption}', InJs.Strings.CollageItemEditorTileSizeSmallCaption).replace('{tileSizeLargeCaption}', InJs.Strings.CollageItemEditorTileSizeLargeCaption).replace('{tileColorSectionTitle}', InJs.Strings.CollageItemEditorTileColorRegionTitle).replace('{tileIconSectionTitle}', InJs.Strings.CollageItemEditorTileIconRegionTitle).replace('{tileCustomImageSectionTitle}', InJs.Strings.CollageItemCustomImageRegionTitle).replace('{cusomtImageUrlInputPlaceholder}', InJs.Strings.CollageItemCustomImageUrlInputPlaceholder).replace('{cusomtImageUrlInputCaption}', InJs.Strings.CollageItemCustomImageUrlCaption).replace('{previewRegionTitle}', InJs.Strings.CollageItemEditorPreviewRegionTitle).replace('{saveBtnText}', InJs.Strings.CollageItemEditorSaveBtnTxt).replace('{cancelBtnText}', InJs.Strings.CollageItemEditorCancelBtnTxt);
                return $(formattedTemplate);
            },
            enumerable: true,
            configurable: true
        });
        return CollageItemEditorTemplateProvider;
    })();
    InJs.CollageItemEditorTemplateProvider = CollageItemEditorTemplateProvider;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** This is the template base class for all client JavaScript controls */
    var ClientControl = (function () {
        function ClientControl(templateProvider) {
            this._templateProvider = null;
            this._templateProvider = templateProvider;
        }
        Object.defineProperty(ClientControl.prototype, "templateProvider", {
            get: function () {
                return this._templateProvider;
            },
            enumerable: true,
            configurable: true
        });
        return ClientControl;
    })();
    InJs.ClientControl = ClientControl;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var CollageItemSize;
(function (CollageItemSize) {
    CollageItemSize[CollageItemSize["Small"] = 0] = "Small";
    CollageItemSize[CollageItemSize["Big"] = 1] = "Big";
})(CollageItemSize || (CollageItemSize = {}));
var CollageItemImage;
(function (CollageItemImage) {
    CollageItemImage[CollageItemImage["None"] = 0] = "None";
    CollageItemImage[CollageItemImage["General"] = 1] = "General";
    CollageItemImage[CollageItemImage["Money"] = 2] = "Money";
    CollageItemImage[CollageItemImage["ColumnChart"] = 3] = "ColumnChart";
    CollageItemImage[CollageItemImage["LineChart"] = 4] = "LineChart";
    CollageItemImage[CollageItemImage["GeneralChart"] = 5] = "GeneralChart";
    CollageItemImage[CollageItemImage["PieChart"] = 6] = "PieChart";
    CollageItemImage[CollageItemImage["Number"] = 7] = "Number";
    CollageItemImage[CollageItemImage["Favorite"] = 8] = "Favorite";
    CollageItemImage[CollageItemImage["Add"] = 9] = "Add";
})(CollageItemImage || (CollageItemImage = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
/** The types used for phrasing templates */
var ServerTemplateTypes;
(function (ServerTemplateTypes) {
    ServerTemplateTypes.StaticItem = "StaticItem";
    ServerTemplateTypes.ConstantSlotItem = "ConstantSlotItem";
    ServerTemplateTypes.SelectionSlotItem = "SelectionSlotItem";
    ServerTemplateTypes.EntitySlotValue = "EntitySlotValue";
    ServerTemplateTypes.EdmPropertySlotValue = "EdmPropertySlotValue";
    ServerTemplateTypes.StringSlotValue = "StringSlotValue";
    ServerTemplateTypes.InputSlotValue = "InputSlotValue";
})(ServerTemplateTypes || (ServerTemplateTypes = {}));
/** Enumeration of phrasing types for templates. */
var PhrasingType;
(function (PhrasingType) {
    PhrasingType[PhrasingType["AdjectivePhrasing"] = 0] = "AdjectivePhrasing";
    PhrasingType[PhrasingType["AttributePhrasing"] = 1] = "AttributePhrasing";
    PhrasingType[PhrasingType["VerbPhrasing"] = 2] = "VerbPhrasing";
})(PhrasingType || (PhrasingType = {}));
/** Enumeration of posible Entry Types for EntrySlotValues. */
var InputType;
(function (InputType) {
    InputType[InputType["Integer"] = 0] = "Integer";
    InputType[InputType["Number"] = 1] = "Number";
    InputType[InputType["String"] = 2] = "String";
})(InputType || (InputType = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    (function (ModelLinguisticRelationshipConditionOperator) {
        ModelLinguisticRelationshipConditionOperator[ModelLinguisticRelationshipConditionOperator["Equals"] = 0] = "Equals";
        ModelLinguisticRelationshipConditionOperator[ModelLinguisticRelationshipConditionOperator["GreaterThan"] = 1] = "GreaterThan";
        ModelLinguisticRelationshipConditionOperator[ModelLinguisticRelationshipConditionOperator["LessThan"] = 2] = "LessThan";
        ModelLinguisticRelationshipConditionOperator[ModelLinguisticRelationshipConditionOperator["GreaterThanOrEquals"] = 3] = "GreaterThanOrEquals";
        ModelLinguisticRelationshipConditionOperator[ModelLinguisticRelationshipConditionOperator["LessThanOrEquals"] = 4] = "LessThanOrEquals";
    })(InJs.ModelLinguisticRelationshipConditionOperator || (InJs.ModelLinguisticRelationshipConditionOperator = {}));
    var ModelLinguisticRelationshipConditionOperator = InJs.ModelLinguisticRelationshipConditionOperator;
    (function (LinguisticItemSource) {
        LinguisticItemSource[LinguisticItemSource["User"] = 0] = "User";
        LinguisticItemSource[LinguisticItemSource["Generated"] = 1] = "Generated";
        LinguisticItemSource[LinguisticItemSource["Deleted"] = 2] = "Deleted";
    })(InJs.LinguisticItemSource || (InJs.LinguisticItemSource = {}));
    var LinguisticItemSource = InJs.LinguisticItemSource;
    /** Defines semantic data types. */
    (function (SemanticType) {
        SemanticType[SemanticType["None"] = 0x0] = "None";
        SemanticType[SemanticType["Number"] = 0x1] = "Number";
        SemanticType[SemanticType["Integer"] = SemanticType.Number + 0x2] = "Integer";
        SemanticType[SemanticType["DateTime"] = 0x4] = "DateTime";
        SemanticType[SemanticType["Time"] = 0x08] = "Time";
        SemanticType[SemanticType["Date"] = SemanticType.DateTime + 0x10] = "Date";
        SemanticType[SemanticType["Month"] = SemanticType.Integer + 0x20] = "Month";
        SemanticType[SemanticType["Year"] = SemanticType.Integer + 0x40] = "Year";
        SemanticType[SemanticType["YearAndMonth"] = 0x80] = "YearAndMonth";
        SemanticType[SemanticType["MonthAndDay"] = 0x100] = "MonthAndDay";
        SemanticType[SemanticType["Decade"] = SemanticType.Integer + 0x200] = "Decade";
        SemanticType[SemanticType["YearAndWeek"] = 0x400] = "YearAndWeek";
        SemanticType[SemanticType["String"] = 0x800] = "String";
        SemanticType[SemanticType["Boolean"] = 0x1000] = "Boolean";
        SemanticType[SemanticType["Table"] = 0x2000] = "Table";
        SemanticType[SemanticType["Range"] = 0x4000] = "Range";
    })(InJs.SemanticType || (InJs.SemanticType = {}));
    var SemanticType = InJs.SemanticType;
    /** Represents relationship multiplicity. */
    (function (ConceptualMultiplicity) {
        ConceptualMultiplicity[ConceptualMultiplicity["ZeroOrOne"] = 0] = "ZeroOrOne";
        ConceptualMultiplicity[ConceptualMultiplicity["One"] = 1] = "One";
        ConceptualMultiplicity[ConceptualMultiplicity["Many"] = 2] = "Many";
    })(InJs.ConceptualMultiplicity || (InJs.ConceptualMultiplicity = {}));
    var ConceptualMultiplicity = InJs.ConceptualMultiplicity;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InterpretWarnings;
(function (InterpretWarnings) {
    InterpretWarnings[InterpretWarnings["None"] = 0x0] = "None";
    InterpretWarnings[InterpretWarnings["LinguisticSchemaAutoGenerated"] = 0x1] = "LinguisticSchemaAutoGenerated";
    InterpretWarnings[InterpretWarnings["LinguisticSchemaNotAvailable"] = 0x2] = "LinguisticSchemaNotAvailable";
    InterpretWarnings[InterpretWarnings["LinguisticSchemaIsStillLoading"] = 0x4] = "LinguisticSchemaIsStillLoading";
    InterpretWarnings[InterpretWarnings["InvalidDataModel"] = 0x8] = "InvalidDataModel";
    InterpretWarnings[InterpretWarnings["DataRetrievalFailed"] = 0x10] = "DataRetrievalFailed";
    InterpretWarnings[InterpretWarnings["DataRetrievalSkipped"] = 0x20] = "DataRetrievalSkipped";
    InterpretWarnings[InterpretWarnings["DuplicateExecuteSemanticQuery"] = 0x40] = "DuplicateExecuteSemanticQuery";
})(InterpretWarnings || (InterpretWarnings = {}));
var InterpretRequestOptions;
(function (InterpretRequestOptions) {
    InterpretRequestOptions[InterpretRequestOptions["Data"] = 0x1] = "Data";
    InterpretRequestOptions[InterpretRequestOptions["QueryMetadata"] = 0x2] = "QueryMetadata";
    InterpretRequestOptions[InterpretRequestOptions["VisualConfiguration"] = 0x4] = "VisualConfiguration";
})(InterpretRequestOptions || (InterpretRequestOptions = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var PowerViewMethods = (function () {
    function PowerViewMethods() {
    }
    PowerViewMethods.getPowerViewClearInterpretVisualizationMethod = function () {
        var method = {};
        method.__type = PowerViewMethods.PowerViewClearInterpretVisualizationMethodName;
        return method;
    };
    PowerViewMethods.getPowerViewApplyInterpretResultMethod = function (result, parentActivityId) {
        var method = {};
        method.__type = PowerViewMethods.PowerViewApplyInterpretResultMethodName;
        method.InteractionActivityId = parentActivityId;
        method.Result = result;
        return method;
    };
    PowerViewMethods.getPowerViewSetSecurityTokenMethod = function (SecurityToken) {
        var method = {};
        method.__type = PowerViewMethods.PowerViewSetSecurityTokenMethodName;
        method.SecurityToken = SecurityToken;
        return method;
    };
    PowerViewMethods.getPowerViewSetVisualizationTypeMethod = function (visualizationType) {
        var method = {};
        method.__type = PowerViewMethods.PowerViewSetVisualizationTypeMethodName;
        method.VisualizationType = visualizationType;
        return method;
    };
    PowerViewMethods.getPowerViewSetProgressIndicatorVisibilityMethod = function (visible) {
        var method = {};
        method.__type = PowerViewMethods.PowerViewSetProgressIndicatorVisibilityMethodName;
        method.Visible = visible;
        return method;
    };
    PowerViewMethods.getPowerViewSetReportSizeMethod = function (width, height) {
        var method = {};
        method.__type = PowerViewMethods.PowerViewSetReportSizeMethodName;
        method.Width = width;
        method.Height = height;
        return method;
    };
    PowerViewMethods.getPowerViewSetAllowGeocodingMethod = function (allowGeocoding) {
        var method = {};
        method.__type = PowerViewMethods.PowerViewSetAllowGeocodingMethodName;
        method.AllowGeocoding = allowGeocoding;
        return method;
    };
    PowerViewMethods.InteractiveReportNamespace = 'http://schemas.microsoft.com/sqlserver/reporting/2012/01/InteractiveReport';
    PowerViewMethods.PowerViewApplyInterpretResultMethodName = 'ApplyInterpretResultMethod:' + PowerViewMethods.InteractiveReportNamespace;
    PowerViewMethods.PowerViewClearInterpretVisualizationMethodName = 'ClearInterpretVisualizationMethod:' + PowerViewMethods.InteractiveReportNamespace;
    PowerViewMethods.PowerViewSetVisualizationTypeMethodName = 'SetVisualizationTypeMethod:' + PowerViewMethods.InteractiveReportNamespace;
    PowerViewMethods.PowerViewSetProgressIndicatorVisibilityMethodName = 'SetProgressIndicatorVisibilityMethod:' + PowerViewMethods.InteractiveReportNamespace;
    PowerViewMethods.PowerViewSetSecurityTokenMethodName = 'SetSecurityTokenMethod:' + PowerViewMethods.InteractiveReportNamespace;
    PowerViewMethods.PowerViewSetHostMethodName = 'SetHostMethod:' + PowerViewMethods.InteractiveReportNamespace;
    PowerViewMethods.PowerViewSetReportSizeMethodName = 'SetReportSizeMethod:' + PowerViewMethods.InteractiveReportNamespace;
    PowerViewMethods.PowerViewSetAllowGeocodingMethodName = 'SetAllowGeocodingMethod:' + PowerViewMethods.InteractiveReportNamespace;
    return PowerViewMethods;
})();
var PowerViewCallbackMethods = (function () {
    function PowerViewCallbackMethods() {
    }
    PowerViewCallbackMethods.InteractiveReportNamespace = 'http://schemas.microsoft.com/sqlserver/reporting/2012/01/InteractiveReport';
    /* Callback method name doesn't have namespace appended and this is due to the fact that callback methods specify the names in the object,
     * whereas for powerviewmethods we use the __type to detect the method (which requires the namespace)
    */
    PowerViewCallbackMethods.InitializedMethodName = 'Initialized';
    PowerViewCallbackMethods.AvailableVisualizationTypesMethodName = 'AvailableVisualizationTypes';
    PowerViewCallbackMethods.PowerViewErrorMethodName = 'PowerViewError';
    PowerViewCallbackMethods.FieldExplorerOpenedMethodName = 'FieldExplorerOpened';
    PowerViewCallbackMethods.FieldExplorerClosedMethodName = 'FieldExplorerClosed';
    PowerViewCallbackMethods.FilterPaneOpenedMethodName = 'FilterPaneOpened';
    PowerViewCallbackMethods.FilterPaneClosedMethodName = 'FilterPaneClosed';
    PowerViewCallbackMethods.PowerViewActivityCompletedMethodName = 'ActivityCompleted';
    PowerViewCallbackMethods.PinVisualMethodName = 'PinVisual';
    return PowerViewCallbackMethods;
})();
/**
 * Visualization Type values.
 * Needs to stay in sync with the equivalent SL VisualizationType.
 */
var VisualizationType;
(function (VisualizationType) {
    VisualizationType[VisualizationType["Table"] = 0] = "Table";
    VisualizationType[VisualizationType["Map"] = 1] = "Map";
    VisualizationType[VisualizationType["Matrix"] = 2] = "Matrix";
    VisualizationType[VisualizationType["Card"] = 3] = "Card";
    VisualizationType[VisualizationType["LineChart"] = 4] = "LineChart";
    VisualizationType[VisualizationType["PieChart"] = 5] = "PieChart";
    VisualizationType[VisualizationType["ScatterChart"] = 6] = "ScatterChart";
    VisualizationType[VisualizationType["ClusteredBarChart"] = 7] = "ClusteredBarChart";
    VisualizationType[VisualizationType["StackedBarChart"] = 8] = "StackedBarChart";
    VisualizationType[VisualizationType["HundredPercentStackedBarChart"] = 9] = "HundredPercentStackedBarChart";
    VisualizationType[VisualizationType["ClusteredColumnChart"] = 10] = "ClusteredColumnChart";
    VisualizationType[VisualizationType["StackedColumnChart"] = 11] = "StackedColumnChart";
    VisualizationType[VisualizationType["HundredPercentStackedColumnChart"] = 12] = "HundredPercentStackedColumnChart";
    VisualizationType[VisualizationType["ClusteredComboChart"] = 13] = "ClusteredComboChart";
    VisualizationType[VisualizationType["StackedComboChart"] = 14] = "StackedComboChart";
    VisualizationType[VisualizationType["HundredPercentComboChart"] = 15] = "HundredPercentComboChart";
    VisualizationType[VisualizationType["FunnelChart"] = 16] = "FunnelChart";
    VisualizationType[VisualizationType["Treemap"] = 17] = "Treemap";
    VisualizationType[VisualizationType["SunburstChart"] = 18] = "SunburstChart";
    VisualizationType[VisualizationType["ColorFilledMap"] = 19] = "ColorFilledMap";
    VisualizationType[VisualizationType["DonutChart"] = 20] = "DonutChart";
    VisualizationType[VisualizationType["CircularTreemap"] = 21] = "CircularTreemap";
    VisualizationType[VisualizationType["HeatMap"] = 22] = "HeatMap";
    VisualizationType[VisualizationType["WaterfallChart"] = 23] = "WaterfallChart";
    VisualizationType[VisualizationType["RoseChart"] = 24] = "RoseChart";
    VisualizationType[VisualizationType["NetworkMap"] = 25] = "NetworkMap";
    VisualizationType[VisualizationType["StackedArea"] = 26] = "StackedArea";
    VisualizationType[VisualizationType["HundredPercentStackedArea"] = 27] = "HundredPercentStackedArea";
    VisualizationType[VisualizationType["SmoothLineChart"] = 28] = "SmoothLineChart";
    VisualizationType[VisualizationType["MultiRowCard"] = 29] = "MultiRowCard";
    VisualizationType[VisualizationType["Gauge"] = 30] = "Gauge";
    VisualizationType[VisualizationType["ComboChart"] = 31] = "ComboChart";
    VisualizationType[VisualizationType["Max"] = 32] = "Max";
})(VisualizationType || (VisualizationType = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var SPTokenState;
(function (SPTokenState) {
    SPTokenState[SPTokenState["None"] = 0] = "None";
    SPTokenState[SPTokenState["AccessDenied"] = 1] = "AccessDenied";
    SPTokenState[SPTokenState["Failed"] = 2] = "Failed";
    SPTokenState[SPTokenState["Loaded"] = 3] = "Loaded";
})(SPTokenState || (SPTokenState = {}));
var UpdateModelFailCause;
(function (UpdateModelFailCause) {
    UpdateModelFailCause[UpdateModelFailCause["GetSiteFailed"] = 0] = "GetSiteFailed";
    UpdateModelFailCause[UpdateModelFailCause["GetDocumentFailed"] = 1] = "GetDocumentFailed";
    UpdateModelFailCause[UpdateModelFailCause["AddModelFailed"] = 2] = "AddModelFailed";
    UpdateModelFailCause[UpdateModelFailCause["AddModelDisallowed"] = 3] = "AddModelDisallowed";
    UpdateModelFailCause[UpdateModelFailCause["DeleteModelFailed"] = 4] = "DeleteModelFailed";
})(UpdateModelFailCause || (UpdateModelFailCause = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** Enumeration representing language LCIDs. */
    var LanguageIdentifier;
    (function (LanguageIdentifier) {
        /** English - USA */
        LanguageIdentifier.en_US = 'en-US';
    })(LanguageIdentifier = InJs.LanguageIdentifier || (InJs.LanguageIdentifier = {}));
    (function (TokenMatchKind) {
        /** Indicates no match (currently not generated by AS). */
        TokenMatchKind[TokenMatchKind["NoMatch"] = 0] = "NoMatch";
        /** Indicates that the <see cref="IToken.TokenValue"/> was matched. */
        TokenMatchKind[TokenMatchKind["OriginalValueMatch"] = 1] = "OriginalValueMatch";
        /** Indicates that the <see cref="ISpellCorrectedToken"/> correction suggestion was matched. */
        TokenMatchKind[TokenMatchKind["SpellCorrectedMatch"] = 2] = "SpellCorrectedMatch";
        /** Indicates that the <see cref="IStemmerToken"/> stem was matched. */
        TokenMatchKind[TokenMatchKind["StemmedMatch"] = 3] = "StemmedMatch";
        /** Indicates that the synonym of the original term was matched. */
        TokenMatchKind[TokenMatchKind["SynonymMatch"] = 4] = "SynonymMatch";
    })(InJs.TokenMatchKind || (InJs.TokenMatchKind = {}));
    var TokenMatchKind = InJs.TokenMatchKind;
    /** Part of Speech token type information. */
    (function (PosTagKind) {
        /** Missing POS Tag */
        PosTagKind[PosTagKind["None"] = 0x00] = "None";
        /** Coordination Conjunction */
        PosTagKind[PosTagKind["CC"] = 0x01] = "CC";
        /** Cardinal Number */
        PosTagKind[PosTagKind["CD"] = 0x02] = "CD";
        /** Determiner */
        PosTagKind[PosTagKind["DT"] = 0x03] = "DT";
        /** Existential */
        PosTagKind[PosTagKind["EX"] = 0x04] = "EX";
        /** Foreign Word */
        PosTagKind[PosTagKind["FW"] = 0x05] = "FW";
        /** Preposition or Subordinating Conjunction */
        PosTagKind[PosTagKind["IN"] = 0x06] = "IN";
        /** Flag for any of the <c>JJx</c> tag kinds. */
        PosTagKind[PosTagKind["AnyJJ"] = 0x0100] = "AnyJJ";
        /** Adjective */
        PosTagKind[PosTagKind["JJ"] = 0x0101] = "JJ";
        /** Adjective Comparative */
        PosTagKind[PosTagKind["JJR"] = 0x0102] = "JJR";
        /** Adjective Superlative */
        PosTagKind[PosTagKind["JJS"] = 0x0103] = "JJS";
        /** List Item Marker */
        PosTagKind[PosTagKind["LS"] = 0x07] = "LS";
        /** Modal */
        PosTagKind[PosTagKind["MD"] = 0x08] = "MD";
        /** Flag for any of the <c>NNx</c> tag kinds. */
        PosTagKind[PosTagKind["AnyNN"] = 0x0200] = "AnyNN";
        /** Noun, Singular or Mass */
        PosTagKind[PosTagKind["NN"] = 0x0201] = "NN";
        /** Noun, Plural */
        PosTagKind[PosTagKind["NNS"] = 0x0202] = "NNS";
        /** Proper Noun Singular */
        PosTagKind[PosTagKind["NNP"] = 0x0203] = "NNP";
        /** Proper Noun Plural */
        PosTagKind[PosTagKind["NNPS"] = 0x0204] = "NNPS";
        /** Pre-determiner */
        PosTagKind[PosTagKind["PDT"] = 0x09] = "PDT";
        /** Possessive Ending */
        PosTagKind[PosTagKind["POS"] = 0x10] = "POS";
        /** Flag for any of the <c>PRPx</c> tag kinds. */
        PosTagKind[PosTagKind["AnyPRP"] = 0x0400] = "AnyPRP";
        /** Personal Pronoun */
        PosTagKind[PosTagKind["PRP"] = 0x0401] = "PRP";
        /** Possessive Pronoun */
        PosTagKind[PosTagKind["PRP_S"] = 0x0402] = "PRP_S";
        /** Flag for any of the <c>RBx</c> tag kinds. */
        PosTagKind[PosTagKind["AnyRB"] = 0x0800] = "AnyRB";
        /** Adverb */
        PosTagKind[PosTagKind["RB"] = 0x0801] = "RB";
        /** Adverb Comparative */
        PosTagKind[PosTagKind["RBR"] = 0x0802] = "RBR";
        /** Adverb Superlative */
        PosTagKind[PosTagKind["RBS"] = 0x0803] = "RBS";
        /** Particle */
        PosTagKind[PosTagKind["RP"] = 0x11] = "RP";
        /** Symbol */
        PosTagKind[PosTagKind["SYM"] = 0x12] = "SYM";
        /** to word */
        PosTagKind[PosTagKind["TO"] = 0x13] = "TO";
        /** Interjection */
        PosTagKind[PosTagKind["UH"] = 0x14] = "UH";
        /** Flag for any of the <c>VBx</c> tag kinds. */
        PosTagKind[PosTagKind["AnyVB"] = 0x1000] = "AnyVB";
        /** Verb Base Form */
        PosTagKind[PosTagKind["VB"] = 0x1001] = "VB";
        /** Verb Past Tense */
        PosTagKind[PosTagKind["VBD"] = 0x1002] = "VBD";
        /** Verb Gerund or Present Participle */
        PosTagKind[PosTagKind["VBG"] = 0x1003] = "VBG";
        /** Verb Past Participle */
        PosTagKind[PosTagKind["VBN"] = 0x1004] = "VBN";
        /** Verb non-3rd Person Singular Present */
        PosTagKind[PosTagKind["VBP"] = 0x1005] = "VBP";
        /** Verb 3rd Person Singular Present */
        PosTagKind[PosTagKind["VBZ"] = 0x1006] = "VBZ";
        /** Wh-Determiner */
        PosTagKind[PosTagKind["WDT"] = 0x15] = "WDT";
        /** Flag for any of the <c>WPx</c> tag kinds. */
        PosTagKind[PosTagKind["AnyWP"] = 0x2000] = "AnyWP";
        /** Wh-Pronoun */
        PosTagKind[PosTagKind["WP"] = 0x2001] = "WP";
        /** Possessive Wh-Pronoun */
        PosTagKind[PosTagKind["WP_S"] = 0x2002] = "WP_S";
        /** Wh-Adverb */
        PosTagKind[PosTagKind["WRB"] = 0x16] = "WRB";
    })(InJs.PosTagKind || (InJs.PosTagKind = {}));
    var PosTagKind = InJs.PosTagKind;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    (function (UtteranceFlags) {
        /** Utterance was not flagged in any way */
        UtteranceFlags[UtteranceFlags["None"] = 0] = "None";
        /** Utterance result was empty */
        UtteranceFlags[UtteranceFlags["ResultIsEmpty"] = 1 << 0] = "ResultIsEmpty";
        /** The user explicitly flagged this utterance */
        UtteranceFlags[UtteranceFlags["User"] = 1 << 1] = "User";
    })(InJs.UtteranceFlags || (InJs.UtteranceFlags = {}));
    var UtteranceFlags = InJs.UtteranceFlags;
    /** This enum should be kept in sync with the server code version at $/Sql/CloudBI/AS/src/InfoNav/InfoNavServiceContracts/Usage/UtteranceFeedback.cs */
    (function (UtteranceFeedback) {
        /** No utterance feedback was given. */
        UtteranceFeedback[UtteranceFeedback["None"] = 0] = "None";
        /** Utterance was flagged as wrong. */
        UtteranceFeedback[UtteranceFeedback["Bad"] = 1] = "Bad";
        /** Utterance was flagged as partially correct. */
        UtteranceFeedback[UtteranceFeedback["Medium"] = 2] = "Medium";
        /** Utterance was flagged as good. */
        UtteranceFeedback[UtteranceFeedback["Good"] = 3] = "Good";
    })(InJs.UtteranceFeedback || (InJs.UtteranceFeedback = {}));
    var UtteranceFeedback = InJs.UtteranceFeedback;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    (function (LinguisticSchemaFormat) {
        LinguisticSchemaFormat[LinguisticSchemaFormat["JSON"] = 1] = "JSON";
        LinguisticSchemaFormat[LinguisticSchemaFormat["XML"] = 2] = "XML";
    })(InJs.LinguisticSchemaFormat || (InJs.LinguisticSchemaFormat = {}));
    var LinguisticSchemaFormat = InJs.LinguisticSchemaFormat;
    (function (GetModelingMetadataRequestOptions) {
        GetModelingMetadataRequestOptions[GetModelingMetadataRequestOptions["Default"] = 0] = "Default";
        GetModelingMetadataRequestOptions[GetModelingMetadataRequestOptions["IncludeConceptualSchema"] = 1] = "IncludeConceptualSchema";
    })(InJs.GetModelingMetadataRequestOptions || (InJs.GetModelingMetadataRequestOptions = {}));
    var GetModelingMetadataRequestOptions = InJs.GetModelingMetadataRequestOptions;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    (function (ModelCommitOperationPhase) {
        ModelCommitOperationPhase[ModelCommitOperationPhase["NotStarted"] = 0] = "NotStarted";
        ModelCommitOperationPhase[ModelCommitOperationPhase["CloneDB"] = 2] = "CloneDB";
        ModelCommitOperationPhase[ModelCommitOperationPhase["AlterDB"] = 4] = "AlterDB";
        ModelCommitOperationPhase[ModelCommitOperationPhase["StreamWorkbook"] = 8] = "StreamWorkbook";
        ModelCommitOperationPhase[ModelCommitOperationPhase["SaveWorkbook"] = 16] = "SaveWorkbook";
        ModelCommitOperationPhase[ModelCommitOperationPhase["PublishWorkbook"] = 32] = "PublishWorkbook";
        ModelCommitOperationPhase[ModelCommitOperationPhase["Complete"] = ModelCommitOperationPhase.PublishWorkbook << 1] = "Complete";
        ModelCommitOperationPhase[ModelCommitOperationPhase["Error"] = ModelCommitOperationPhase.Complete << 1] = "Error";
        ModelCommitOperationPhase[ModelCommitOperationPhase["ETagMismatch"] = ModelCommitOperationPhase.Complete << 2] = "ETagMismatch";
    })(InJs.ModelCommitOperationPhase || (InJs.ModelCommitOperationPhase = {}));
    var ModelCommitOperationPhase = InJs.ModelCommitOperationPhase;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    (function (LinguisticSchemaWarnings) {
        LinguisticSchemaWarnings[LinguisticSchemaWarnings["None"] = 0] = "None";
        LinguisticSchemaWarnings[LinguisticSchemaWarnings["NotAvailable"] = 0x1] = "NotAvailable";
        LinguisticSchemaWarnings[LinguisticSchemaWarnings["StillLoading"] = 0x2] = "StillLoading";
        LinguisticSchemaWarnings[LinguisticSchemaWarnings["InvalidDataModel"] = 0x4] = "InvalidDataModel";
        LinguisticSchemaWarnings[LinguisticSchemaWarnings["InvalidLanguage"] = 0x8] = "InvalidLanguage";
    })(InJs.LinguisticSchemaWarnings || (InJs.LinguisticSchemaWarnings = {}));
    var LinguisticSchemaWarnings = InJs.LinguisticSchemaWarnings;
    (function (CheckoutType) {
        CheckoutType[CheckoutType["CheckedIn"] = 0x0] = "CheckedIn";
        CheckoutType[CheckoutType["CheckedOut"] = 0x1] = "CheckedOut";
    })(InJs.CheckoutType || (InJs.CheckoutType = {}));
    var CheckoutType = InJs.CheckoutType;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    (function (WorkbookOperationPhase) {
        WorkbookOperationPhase[WorkbookOperationPhase["None"] = 0x00000000] = "None";
        WorkbookOperationPhase[WorkbookOperationPhase["PermissionsValidatedSuccessfully"] = 0x00000002] = "PermissionsValidatedSuccessfully";
        WorkbookOperationPhase[WorkbookOperationPhase["WorkbookValidation"] = 0x00000004] = "WorkbookValidation";
        WorkbookOperationPhase[WorkbookOperationPhase["CreatingEmptyDb"] = 0x00000008] = "CreatingEmptyDb";
        WorkbookOperationPhase[WorkbookOperationPhase["UploadingModel"] = 0x00000010] = "UploadingModel";
        WorkbookOperationPhase[WorkbookOperationPhase["PendingDelete"] = 0x00000040] = "PendingDelete";
        WorkbookOperationPhase[WorkbookOperationPhase["FailedPublish"] = 0x0000080] = "FailedPublish";
        WorkbookOperationPhase[WorkbookOperationPhase["ModifyDataConnectionsTable"] = 0x0000100] = "ModifyDataConnectionsTable";
        WorkbookOperationPhase[WorkbookOperationPhase["SuccessPublishWithThumbnailPending"] = 0x0000200] = "SuccessPublishWithThumbnailPending";
        WorkbookOperationPhase[WorkbookOperationPhase["PendingModelUpdate"] = 0x0000400] = "PendingModelUpdate";
        WorkbookOperationPhase[WorkbookOperationPhase["SuccessPublish"] = 0x8000000] = "SuccessPublish";
    })(InJs.WorkbookOperationPhase || (InJs.WorkbookOperationPhase = {}));
    var WorkbookOperationPhase = InJs.WorkbookOperationPhase;
    (function (PublishErrorCode) {
        PublishErrorCode[PublishErrorCode["None"] = 0x0] = "None";
        PublishErrorCode[PublishErrorCode["ModelIsMissing"] = 0x1] = "ModelIsMissing";
        PublishErrorCode[PublishErrorCode["AboveSizeLimit"] = 0x2] = "AboveSizeLimit";
        PublishErrorCode[PublishErrorCode["XmlaError"] = 0x3] = "XmlaError";
        PublishErrorCode[PublishErrorCode["WorkbookWasDeletedOrNotPublished"] = 0x4] = "WorkbookWasDeletedOrNotPublished";
        PublishErrorCode[PublishErrorCode["BeingProcessed"] = 0x5] = "BeingProcessed";
        PublishErrorCode[PublishErrorCode["EtagMismatch"] = 0x6] = "EtagMismatch";
        PublishErrorCode[PublishErrorCode["EncryptionOrBadFileFormat"] = 0x7] = "EncryptionOrBadFileFormat";
        PublishErrorCode[PublishErrorCode["PowerViewSlOperationTimedOut"] = 0x8] = "PowerViewSlOperationTimedOut";
        PublishErrorCode[PublishErrorCode["InvalidThumbnail"] = 0x9] = "InvalidThumbnail";
        PublishErrorCode[PublishErrorCode["WorkbookContainsMalformedUri"] = 0xA] = "WorkbookContainsMalformedUri";
        PublishErrorCode[PublishErrorCode["RdlValidationFailed"] = 0xB] = "RdlValidationFailed";
        PublishErrorCode[PublishErrorCode["RdlValidationFailedBadFile"] = 0xC] = "RdlValidationFailedBadFile";
        PublishErrorCode[PublishErrorCode["RdlValidationFailedSharedDataSourcesNotAllowed"] = 0xD] = "RdlValidationFailedSharedDataSourcesNotAllowed";
        PublishErrorCode[PublishErrorCode["RdlValidationFailedNotSupportedDataExtension"] = 0xE] = "RdlValidationFailedNotSupportedDataExtension";
        PublishErrorCode[PublishErrorCode["RdlValidationFailedPromptForCredentialsDataSourcesNotAllowed"] = 0xF] = "RdlValidationFailedPromptForCredentialsDataSourcesNotAllowed";
        PublishErrorCode[PublishErrorCode["RdlValidationFailedCustomReportItemsNotAllowed"] = 0x10] = "RdlValidationFailedCustomReportItemsNotAllowed";
        PublishErrorCode[PublishErrorCode["RdlValidationFailedCodeSegmentsNotAllowed"] = 0x11] = "RdlValidationFailedCodeSegmentsNotAllowed";
        PublishErrorCode[PublishErrorCode["RdlValidationFailedEmbeddedSubReportsNotAllowed"] = 0x12] = "RdlValidationFailedEmbeddedSubReportsNotAllowed";
        PublishErrorCode[PublishErrorCode["DownloadDocumentFromIrmEnabledDocumentLibrary"] = 0x13] = "DownloadDocumentFromIrmEnabledDocumentLibrary";
        PublishErrorCode[PublishErrorCode["RdlTestDataSourceConnectionsFailure"] = 0x14] = "RdlTestDataSourceConnectionsFailure";
        PublishErrorCode[PublishErrorCode["UnknownError"] = 0xFF] = "UnknownError";
    })(InJs.PublishErrorCode || (InJs.PublishErrorCode = {}));
    var PublishErrorCode = InJs.PublishErrorCode;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /**
     * Represents a directed graph of items of type TVertex.
     * Edges in the graph may be annotated with custom TEdgeData.
     */
    var DirectedGraph = (function () {
        function DirectedGraph(keyFunc) {
            debug.assertValue(keyFunc, 'keyFunc');
            this._keyFunc = keyFunc;
            this._verticies = {};
        }
        /** Gets vertices originating FROM the given vertex.  May return undefined. */
        DirectedGraph.prototype.getEdgesFromVertex = function (vertex) {
            var key = this._keyFunc(vertex);
            return this._verticies[key];
        };
        /** Adds an edge connecting fromVertex to toVertex, with the given metadata. */
        DirectedGraph.prototype.addEdge = function (fromVertex, toVertex, data) {
            var key = this._keyFunc(fromVertex), edges = this._verticies[key];
            if (!edges) {
                edges = this._verticies[key] = [];
            }
            for (var i = 0, len = edges.length; i < len; ++i) {
                var edge = edges[i];
                if (toVertex === edge.toVertex) {
                    InJs.Utility.throwIfNotTrue(edge.data === data, 'Conflicting edge has already been added.', 'addEdge', 'toVertex');
                    // This edge already exists, skip it.
                    return;
                }
            }
            edges.push({
                toVertex: toVertex,
                data: data,
            });
        };
        return DirectedGraph;
    })();
    InJs.DirectedGraph = DirectedGraph;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var HttpUtility = (function () {
        function HttpUtility() {
        }
        HttpUtility.setCommonRequestHeaders = function (request) {
            var requestId = InJs.Utility.generateGuid();
            request.requestId = requestId;
            request.setRequestHeader(HttpUtility.HttpActivityIdHeader, InJs.AppManager.current.activityId);
            request.setRequestHeader(HttpUtility.HttpRequestIdHeader, requestId);
            return requestId;
        };
        HttpUtility.getErrorInfo = function (request) {
            return request.getResponseHeader(HttpUtility.HttpInfoNavErrorInfoHeader);
        };
        HttpUtility.getRequestId = function (request) {
            var infoNavRequest = request;
            if (!infoNavRequest || !infoNavRequest.requestId)
                return null;
            return infoNavRequest.requestId;
        };
        HttpUtility.isForbiddenOrUnauthorized = function (status) {
            return status === 403 /* Forbidden */ || status === 401 /* Unauthorized */;
        };
        HttpUtility.HttpSpoContextTokenHeader = 'X-AS-SpoContextToken';
        HttpUtility.HttpCloudBIAccessTokenHeader = 'X-SAAS-DatabaseAccessToken';
        HttpUtility.HttpInfoNavSpAccessTokenHeader = 'X-AS-InfoNavSPAccessToken';
        HttpUtility.HttpAuthorizationHeader = 'Authorization';
        HttpUtility.HttpActivityIdHeader = 'ActivityId';
        HttpUtility.HttpRequestIdHeader = 'RequestId';
        HttpUtility.HttpInfoNavErrorInfoHeader = 'X-InfoNav-Error-Info';
        return HttpUtility;
    })();
    InJs.HttpUtility = HttpUtility;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    (function (AjaxCallSettings) {
        AjaxCallSettings[AjaxCallSettings["Default"] = 0] = "Default";
        /** Indicates that the AJAX call should not set the dataType option (usually because the server call doesn't have a response payload). */
        AjaxCallSettings[AjaxCallSettings["SuppressResponseDataType"] = 1] = "SuppressResponseDataType";
    })(InJs.AjaxCallSettings || (InJs.AjaxCallSettings = {}));
    var AjaxCallSettings = InJs.AjaxCallSettings;
    var AjaxUtility;
    (function (AjaxUtility) {
        var operationTimeoutMs = 60000;
        // TODO - Refactor interpretation calls to use ajax utility
        // TODO - Deprecate this method and use callService instead, and have callers use the returned promise for their callbacks.
        /**
         * Calls a service in the gateway from the client
         * @param clusterUri - The InfoNavHost to use
         * @param serviceGroup - The service group of the service to call, e.g. interpretation, modeling, etc.
         * @param serviceName - The service endpoint name
         * @param successHandler - The success handler function callback
         * @param failureHandler - The failure handler function callback
         * @param token - The token to use for authentication
         * @param httpMethod - The HTTP method to use, one of POST/GET/PUT
         * @param requestObject - The request object for POST request
         * @param routes - The routes for the service endpoint
         * @param params - The query parameters to use for GET requests
         */
        function callServiceWithCallbacks(clusterUri, serviceGroup, serviceName, successHandler, failureHandler, token, httpMethod, requestObject, routes, params) {
            if (requestObject === void 0) { requestObject = null; }
            if (routes === void 0) { routes = null; }
            if (params === void 0) { params = null; }
            debug.assertValue(clusterUri, 'clusterUri');
            debug.assertValue(successHandler, 'successHandler');
            debug.assertValue(failureHandler, 'failureHandler');
            var options = {
                type: httpMethod,
                url: buildUri(clusterUri, serviceGroup, serviceName, routes ? routes.join('/') : ''),
                timeout: operationTimeoutMs,
                contentType: InJs.Utility.JsonContentType,
                accepts: InJs.Utility.JsonContentType,
                dataType: InJs.Utility.JsonDataType,
            };
            if (requestObject) {
                var payload = { 'request': requestObject };
                options.data = JSON.stringify(payload);
            }
            if (params) {
                options.data = params;
            }
            var result = doAjax(serviceName, token, options);
            result.done(function (result, textStatus, request) {
                successHandler(requestObject, result, request);
            });
            result.fail(function (request, textStatus, error) {
                failureHandler(request);
            });
            return result;
        }
        AjaxUtility.callServiceWithCallbacks = callServiceWithCallbacks;
        /**
         * Calls a service in the gateway, returning a promise for its completion.
         * @param clusterUri - The InfoNavHost to use
         * @param serviceGroup - The service group of the service to call, e.g. interpretation, modeling, etc.
         * @param serviceName - The service endpoint name
         * @param token - The token to use for authentication
         * @param httpMethod - The HTTP method to use, one of POST/GET/PUT
         * @param settings - The Ajax settings for the request.
         * @param data - The data payload for the request.
         * @param additionalUrlParams - Any additional content of the URL to include after the serviceName.
         */
        function callService(clusterUri, serviceGroup, serviceName, token, httpMethod, data, settings, additionalUrlParams) {
            if (settings === void 0) { settings = 0 /* Default */; }
            debug.assertValue(clusterUri, 'clusterUri');
            debug.assertValue(serviceGroup, 'serviceGroup');
            debug.assertValue(serviceName, 'serviceName');
            debug.assertValue(token, 'token');
            debug.assertValue(httpMethod, 'httpMethod');
            var requestId = '';
            var options = {
                type: httpMethod,
                url: buildUri(clusterUri, serviceGroup, serviceName, additionalUrlParams),
                timeout: operationTimeoutMs,
                contentType: InJs.Utility.JsonContentType,
                accepts: InJs.Utility.JsonContentType,
                data: data ? JSON.stringify(data) : data,
            };
            if (!InJs.EnumExtensions.hasFlag(settings, 1 /* SuppressResponseDataType */)) {
                options.dataType = InJs.Utility.JsonDataType;
            }
            return doAjax(serviceName, token, options);
        }
        AjaxUtility.callService = callService;
        function buildUri(clusterUri, serviceGroup, serviceName, additionalUrlParams) {
            debug.assertValue(clusterUri, 'clusterUri');
            debug.assertValue(serviceGroup, 'serviceGroup');
            debug.assertValue(serviceName, 'serviceName');
            return InJs.Utility.urlCombine(clusterUri, '/infonav/' + serviceGroup + '/' + serviceName + '/' + (additionalUrlParams || ''));
        }
        /**
         * Performs an AJAX call to a service, including logging.
         * @param serviceName - The service endpoint name
         * @param token - The token to use for authentication
         * @param options - The pre-populated JQueryAjaxSettings for this request.
         */
        function doAjax(serviceName, token, options) {
            debug.assertValue(serviceName, 'serviceName');
            debug.assertValue(token, 'token');
            debug.assertValue(options, 'options');
            var requestId = '';
            debug.assert(options.beforeSend === undefined, 'options.beforeSend must be unset, as it is being overwritten.');
            options.beforeSend = function (request) {
                InJs.HttpUtility.setCommonRequestHeaders(request);
                request.setRequestHeader(token.tokenHeader, token.tokenValue);
                request.setRequestHeader(InJs.Utility.HttpAcceptHeader, InJs.Utility.JsonContentType);
                requestId = request.requestId;
                InJs.Tracing.verbose('Executing ' + serviceName + ' service', requestId);
            };
            debug.assert(options.success === undefined, 'options.success must be unset, as it is being overwritten.');
            options.success = function () {
                InJs.Tracing.verbose('Success executing ' + serviceName, requestId);
            };
            debug.assert(options.error === undefined, 'options.error must be unset, as it is being overwritten.');
            options.error = function (request, textStatus) {
                InJs.Tracing.verbose('Error executing ' + serviceName + ': ' + textStatus, requestId);
            };
            return $.ajax(options);
        }
    })(AjaxUtility = InJs.AjaxUtility || (InJs.AjaxUtility = {}));
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /**
     * This serializer is the only part we still require from MicrosoftAjax.js (https://ajax.aspnetcdn.com/ajax/3.5/MicrosoftAjax.debug.js)
     * for serialization of objects for interop with PowerView.
     */
    var JavaScriptSerializer = (function () {
        function JavaScriptSerializer() {
        }
        /** Static constructor for JavScriptSerializer */
        JavaScriptSerializer.staticConstructor = function () {
            var replaceChars = ['\\u0000', '\\u0001', '\\u0002', '\\u0003', '\\u0004', '\\u0005', '\\u0006', '\\u0007', '\\b', '\\t', '\\n', '\\u000b', '\\f', '\\r', '\\u000e', '\\u000f', '\\u0010', '\\u0011', '\\u0012', '\\u0013', '\\u0014', '\\u0015', '\\u0016', '\\u0017', '\\u0018', '\\u0019', '\\u001a', '\\u001b', '\\u001c', '\\u001d', '\\u001e', '\\u001f'];
            JavaScriptSerializer._charsToEscape[0] = '\\';
            JavaScriptSerializer._charsToEscapeRegExs['\\'] = new RegExp('\\\\', 'g');
            JavaScriptSerializer._escapeChars['\\'] = '\\\\';
            JavaScriptSerializer._charsToEscape[1] = '"';
            JavaScriptSerializer._charsToEscapeRegExs['"'] = new RegExp('"', 'g');
            JavaScriptSerializer._escapeChars['"'] = '\\"';
            for (var i = 0; i < 32; i++) {
                var c = String.fromCharCode(i);
                JavaScriptSerializer._charsToEscape[i + 2] = c;
                JavaScriptSerializer._charsToEscapeRegExs[c] = new RegExp(c, 'g');
                JavaScriptSerializer._escapeChars[c] = replaceChars[i];
            }
        };
        JavaScriptSerializer.serializeBooleanWithBuilder = function (value, stringBuilder) {
            InJs.Utility.throwIfNullOrUndefined(stringBuilder, this, 'serializeBoolean', 'stringBuilder');
            stringBuilder.append(value.toString());
        };
        JavaScriptSerializer.serializeNumberWithBuilder = function (value, stringBuilder) {
            InJs.Utility.throwIfNullOrUndefined(stringBuilder, this, 'serializeBoolean', 'stringBuilder');
            InJs.Utility.throwIfNotTrue(isFinite(value), this, 'serializeNumber', 'isFinite(value)');
            stringBuilder.append(String(value));
        };
        JavaScriptSerializer.serializeStringWithBuilder = function (value, stringBuilder) {
            InJs.Utility.throwIfNullOrUndefined(stringBuilder, this, 'serializeBoolean', 'stringBuilder');
            stringBuilder.append('"');
            if (JavaScriptSerializer._escapeRegEx.test(value)) {
                if (value.length < 128) {
                    value = value.replace(JavaScriptSerializer._escapeRegExGlobal, function (x) {
                        return JavaScriptSerializer._escapeChars[x];
                    });
                }
                else {
                    for (var i = 0; i < 34; i++) {
                        var c = JavaScriptSerializer._charsToEscape[i];
                        if (value.indexOf(c) !== -1) {
                            if (InJs.BrowserUtility.getInternetExplorerVersion() || InJs.BrowserUtility.getOperaVersion()) {
                                value = value.split(c).join(JavaScriptSerializer._escapeChars[c]);
                            }
                            else {
                                value = value.replace(JavaScriptSerializer._charsToEscapeRegExs[c], JavaScriptSerializer._escapeChars[c]);
                            }
                        }
                    }
                }
            }
            stringBuilder.append(value);
            stringBuilder.append('"');
        };
        JavaScriptSerializer.serializeWithBuilder = function (value, stringBuilder, sort, prevObjects) {
            var i;
            switch (typeof value) {
                case 'object':
                    if (value) {
                        if (prevObjects) {
                            for (var j = 0; j < prevObjects.length; j++) {
                                if (prevObjects[j] === value) {
                                    InJs.Utility.throwException(InJs.Errors.invalidOperation('Cannot serialize objects with cycle'));
                                }
                            }
                        }
                        else {
                            prevObjects = new Array();
                        }
                        try {
                            prevObjects.push(value);
                            if (value instanceof Array) {
                                stringBuilder.append('[');
                                for (i = 0; i < value.length; ++i) {
                                    if (i > 0) {
                                        stringBuilder.append(',');
                                    }
                                    JavaScriptSerializer.serializeWithBuilder(value[i], stringBuilder, false, prevObjects);
                                }
                                stringBuilder.append(']');
                            }
                            else {
                                if (value instanceof Date) {
                                    stringBuilder.append('"\\/Date(');
                                    stringBuilder.append(value.getTime());
                                    stringBuilder.append(')\\/"');
                                    break;
                                }
                                var properties = [];
                                var propertyCount = 0;
                                for (var name in value) {
                                    if (name.substr(0, 1) === '$') {
                                        continue;
                                    }
                                    if (name === JavaScriptSerializer._serverTypeFieldName && propertyCount !== 0) {
                                        properties[propertyCount++] = properties[0];
                                        properties[0] = name;
                                    }
                                    else {
                                        properties[propertyCount++] = name;
                                    }
                                }
                                if (sort)
                                    properties.sort();
                                stringBuilder.append('{');
                                var needComma = false;
                                for (i = 0; i < propertyCount; i++) {
                                    var propertyValue = value[properties[i]];
                                    if (typeof propertyValue !== 'undefined' && typeof propertyValue !== 'function') {
                                        if (needComma) {
                                            stringBuilder.append(',');
                                        }
                                        else {
                                            needComma = true;
                                        }
                                        JavaScriptSerializer.serializeWithBuilder(properties[i], stringBuilder, sort, prevObjects);
                                        stringBuilder.append(':');
                                        JavaScriptSerializer.serializeWithBuilder(propertyValue, stringBuilder, sort, prevObjects);
                                    }
                                }
                                stringBuilder.append('}');
                            }
                        }
                        finally {
                            prevObjects.splice(prevObjects.length - 1, 1);
                        }
                    }
                    else {
                        stringBuilder.append('null');
                    }
                    break;
                case 'number':
                    JavaScriptSerializer.serializeNumberWithBuilder(value, stringBuilder);
                    break;
                case 'string':
                    JavaScriptSerializer.serializeStringWithBuilder(value, stringBuilder);
                    break;
                case 'boolean':
                    JavaScriptSerializer.serializeBooleanWithBuilder(value, stringBuilder);
                    break;
                default:
                    stringBuilder.append('null');
                    break;
            }
        };
        JavaScriptSerializer.serialize = function (value) {
            var stringBuilder = new InJs.StringBuilder();
            JavaScriptSerializer.serializeWithBuilder(value, stringBuilder, false);
            return stringBuilder.toString();
        };
        JavaScriptSerializer.deserialize = function (data, secure) {
            InJs.Utility.throwIfNullOrUndefined(data, this, 'deserialize', 'Cannot deserialize empty string');
            InJs.Utility.throwIfNotTrue(data.length > 0, this, 'deserialize', 'Cannot deserialize empty string');
            try {
                // First double escape date expressions because JSON.parse will remove the regular escaping
                var dataWithFixedDates = data.replace(JavaScriptSerializer._dateRegEx, '$1\"\\\\/Date($2)\\\\/\"');
                // Then capture date expression and convert them to Date objects as eval did previously
                var result = JSON.parse(dataWithFixedDates, function (key, value) {
                    if (InJs.Utility.isString(value)) {
                        var match = JavaScriptSerializer._isolatedDateRegEx.test(value);
                        if (match)
                            return JavaScriptSerializer.deserializeMSAjaxDate(value);
                    }
                    return value;
                });
                return result;
            }
            catch (e) {
                InJs.Utility.throwException(InJs.Errors.invalidOperation('Cannot deserialize invalid JSON'));
            }
        };
        JavaScriptSerializer.deserializeMSAjaxDate = function (data) {
            // MicrosoftAjax.js deserializer will replace '\/Date(1234567890)\/', '\/Date(1234567890-0800)\/' or '\/Date(1234567890x)\/' 
            // expressions with new Date(1234567890) stripping the zone information and then use eval on these. This is not ideal because 
            // we are losing time zone information but this implementation adheres to that as it it meant to replicate it without the use of
            // eval. 
            var timeString = data.substring(JavaScriptSerializer._msAjaxDatePrefix.length, data.length - JavaScriptSerializer._dateSuffix.length - 1);
            var time = parseInt(timeString);
            return new Date(time);
        };
        /** Converts the specified string, obtained from .NET JSON Serializer, into a JavaScript Date.  Throws on invalid input. */
        JavaScriptSerializer.deserializeDate = function (data) {
            return jsCommon.DateExtensions.deserializeDate(data);
        };
        JavaScriptSerializer.serializeDate = function (date) {
            InJs.Utility.throwIfNullOrUndefined(date, this, 'serializeDate', 'Cannot serialize empty date');
            return jsCommon.DateExtensions.serializeDate(date);
        };
        JavaScriptSerializer._charsToEscapeRegExs = [];
        JavaScriptSerializer._charsToEscape = [];
        JavaScriptSerializer._dateRegEx = new RegExp('(^|[^\\\\])\\"\\\\/Date\\((-?[0-9]+)(?:[a-zA-Z]|(?:\\+|-)[0-9]{4})?\\)\\\\/\\"', 'g');
        JavaScriptSerializer._isolatedDateRegEx = new RegExp('\\\\/Date\\((-?[0-9]+)(?:[a-zA-Z]|(?:\\+|-)[0-9]{4})?\\)\\\\/');
        JavaScriptSerializer._msAjaxDatePrefix = '\\/Date(';
        JavaScriptSerializer._datePrefix = '/Date(';
        JavaScriptSerializer._dateSuffix = ')\/';
        JavaScriptSerializer._escapeChars = {};
        JavaScriptSerializer._escapeRegEx = new RegExp('["\\\\\\x00-\\x1F]', 'i');
        JavaScriptSerializer._escapeRegExGlobal = new RegExp('["\\\\\\x00-\\x1F]', 'g');
        JavaScriptSerializer._jsonRegEx = new RegExp('[^,:{}\\[\\]0-9.\\-+Eaeflnr-u \\n\\r\\t]', 'g');
        JavaScriptSerializer._jsonStringRegEx = new RegExp('"(\\\\.|[^"\\\\])*"', 'g');
        JavaScriptSerializer._serverTypeFieldName = '__type';
        return JavaScriptSerializer;
    })();
    InJs.JavaScriptSerializer = JavaScriptSerializer;
    JavaScriptSerializer.staticConstructor();
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var ArrayExtensions = jsCommon.ArrayExtensions;
    var InterpretResultUtility;
    (function (InterpretResultUtility) {
        function parseInterpret(results) {
            if (ArrayExtensions.isUndefinedOrEmpty(results)) {
                console.log("No interpret result returned.");
                return;
            }
            var readers = [];
            for (var i = 0, len = results.length; i < len; ++i) {
                var interpretResult = results[i], utterance = interpretResult.utterance;
                if (interpretResult.completedUtterance)
                    utterance = interpretResult.completedUtterance.Text;
                var data = readInterpret(utterance, interpretResult.source);
                if (!data)
                    continue;
                readers.push(data);
            }
            return ArrayExtensions.emptyToNull(readers);
        }
        InterpretResultUtility.parseInterpret = parseInterpret;
        function createSimpleUtteranceData(utterance) {
            return {
                utterance: utterance,
                restatement: null,
                queryDefn: null,
                configs: null,
                queryDescriptor: null,
                dataViewSource: null,
                queryMetadata: null,
                virtualServerName: null,
                databaseName: null
            };
        }
        InterpretResultUtility.createSimpleUtteranceData = createSimpleUtteranceData;
        /** Attempts to create a data reader by parsing an Interpret Result, returning null if parsing fails. */
        function readInterpret(utterance, interpretResult) {
            debug.assertValue(interpretResult, 'interpretResult');
            var command = interpretResult.Command;
            if (!command)
                return null;
            var queryMetadata = command.QueryMetadata;
            // TODO: Remove this when Athena is turned on permanently and server no longer returns Select metadata for backward compatibility
            if (!queryMetadata)
                queryMetadata = interpretResult.QueryMetadata;
            else if (!queryMetadata.Select && interpretResult.QueryMetadata)
                queryMetadata.Select = interpretResult.QueryMetadata.Select;
            var bindingJson = command.Binding, dsrJson = command.Data, dataViewSource = null, queryDescriptor = null, dsr = null;
            // if data exist, both binding and dsr needs to exist as well..
            if (dsrJson) {
                if (!bindingJson)
                    return;
                queryDescriptor = JSON.parse(bindingJson);
                dsr = JSON.parse(dsrJson);
                if (!dsr)
                    return;
                dataViewSource = {
                    data: {
                        descriptor: queryDescriptor,
                        dsr: dsr,
                    }
                };
            }
            return {
                utterance: utterance,
                restatement: interpretResult.Restatement,
                queryDefn: command.Query,
                queryDescriptor: queryDescriptor,
                queryMetadata: queryMetadata,
                configs: command.VisualConfigurations,
                dataViewSource: dataViewSource,
                virtualServerName: interpretResult.VirtualServerName,
                databaseName: interpretResult.DatabaseName,
            };
        }
    })(InterpretResultUtility = powerbi.InterpretResultUtility || (powerbi.InterpretResultUtility = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    // TODO 4320755: remove this class once we replace all the code to use jsCommon's Tracing. 
    var Tracing = (function () {
        function Tracing() {
        }
        Object.defineProperty(Tracing, "Traces", {
            get: function () {
                Tracing.initializeListener();
                return jsCommon.Trace.getTraces();
            },
            enumerable: true,
            configurable: true
        });
        Tracing.warning = function (text, requestId) {
            Tracing.initializeListener();
            jsCommon.Trace.warning(text, requestId);
        };
        Tracing.error = function (text, requestId) {
            Tracing.initializeListener();
            jsCommon.Trace.error(text, false, requestId);
        };
        Tracing.verbose = function (text, requestId) {
            Tracing.initializeListener();
            jsCommon.Trace.verbose(text, requestId);
        };
        Tracing.initializeListener = function () {
            if (!Tracing.listenerInitialized) {
                jsCommon.Trace.addListener(new TraceListener());
                Tracing.listenerInitialized = true;
            }
        };
        Tracing.listenerInitialized = false;
        return Tracing;
    })();
    InJs.Tracing = Tracing;
    var TraceListener = (function () {
        function TraceListener() {
        }
        TraceListener.prototype.logTrace = function (trace) {
            // Make sure the AppManager was already initialized before attempting to retrieve the current activityId
            if (InJs.AppManager && InJs.AppManager.current)
                trace._activityId = InJs.AppManager.current.activityId;
        };
        return TraceListener;
    })();
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    InJs.CssConstants = jsCommon.CssConstants;
    InJs.DOMConstants = jsCommon.DOMConstants;
    InJs.StringExtensions = jsCommon.StringExtensions;
    InJs.Utility = jsCommon.Utility;
    InJs.StringBuilder = jsCommon.StringBuilder;
    InJs.DateExtensions = jsCommon.DateExtensions;
    InJs.EnumExtensions = jsCommon.EnumExtensions;
    InJs.Errors = jsCommon.Errors;
    InJs.QueryStringUtil = jsCommon.QueryStringUtil;
    InJs.HttpStatusCode = jsCommon.HttpStatusCode;
    InJs.HttpConstants = jsCommon.HttpConstants;
    InJs.VersionUtility = jsCommon.VersionUtility;
    InJs.XmlUtility = jsCommon.XmlUtility;
    InJs.JQueryConstants = jsCommon.JQueryConstants;
    InJs.ArrayExtensions = jsCommon.ArrayExtensions;
    InJs.DeferredBatch = jsCommon.DeferredBatch;
    InJs.TimerPromiseFactory = jsCommon.TimerPromiseFactory;
    /**
     * The ApplicationManager takes care of dependency checking, binding extension methods and other setup management.
     * It is also used for creating groups.
     */
    var AppManager = (function () {
        function AppManager() {
            this._connectionGroups = {};
            // Make sure this isn't invoked explicitly
            if (AppManager._current)
                InJs.Utility.throwException(InJs.Errors.invalidOperation('AppManager is an implicit singleton and cannot be instantiated explicitly'));
            // Hosting page provides the load start time through a global variable for
            // telemetry purposes. If no value is provided we'll assume that start time
            // is when the interpreter starts going through our script.
            this._pageLoadStartTime = window[AppManager._pageLoadStartTimeVariableName] ? window[AppManager._pageLoadStartTimeVariableName] : (new Date()).getTime();
            var originClientActivityId = InJs.QueryStringUtil.getQueryStringValue(InJs.QueryStringUtil.OriginClientActivityIdParameterName);
            this._activityId = originClientActivityId ? originClientActivityId : InJs.Utility.generateGuid();
            InJs.Tracing.verbose('Client activity id is ' + this._activityId);
            // We need to initialize the origin while the script is being loaded and also
            // create the app widget to create groups etc.
            this._initializeOrigin();
            this._defineAppWidgets();
        }
        Object.defineProperty(AppManager, "current", {
            get: function () {
                return AppManager._current;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppManager.prototype, "activityId", {
            /** Activity id per application lifetime */
            get: function () {
                return this.getActivityId();
            },
            enumerable: true,
            configurable: true
        });
        AppManager.prototype.getActivityId = function () {
            return this._activityId;
        };
        /** Hook for PBI.com to redefine activityId definition, to ensure consistent session across InfoNav and PBI */
        AppManager.setGetActivityIdImpl = function (func) {
            AppManager.prototype.getActivityId = func;
        };
        Object.defineProperty(AppManager.prototype, "pageLoadStartTime", {
            /** Time when the page started loading */
            get: function () {
                return this._pageLoadStartTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppManager.prototype, "initialClusterUri", {
            /** Initial cluster URI provided by the hosting page used for retrieving app or group metadata */
            get: function () {
                return clusterUri;
            },
            enumerable: true,
            configurable: true
        });
        /** Creates or retrieves a StandaloneCloudConnectionGroup */
        AppManager.prototype.standaloneGroup = function (options) {
            this._ensureInitialized();
            this._verifyOptions(options);
            var standaloneOptions = $.extend({}, options, { isUserAdmin: false, isRuntimeModelingEnabled: false });
            return this._ensureConnectionGroup(options.name, function () {
                return new InJs.StandaloneCloudConnectionGroup(standaloneOptions);
            });
        };
        /** Creates or retrieves a new PowerBIConnectionGroup */
        AppManager.prototype.powerBIGroup = function (options) {
            try {
                this._ensureInitialized();
                this._verifyOptions(options);
                return this._ensureConnectionGroup(options.name, function () {
                    return new InJs.PowerBIConnectionGroup(options);
                });
            }
            catch (e) {
                this._handleInitializationExceptions(e, options.modalDialog);
            }
        };
        AppManager.prototype._verifyOptions = function (options) {
            if (!options) {
                InJs.Utility.throwException(InJs.Errors.invalidOperation('The required parameter "options" was not provided'));
                return null;
            }
            else if (!InJs.Utility.isString(options.name)) {
                InJs.Utility.throwException(InJs.Errors.invalidOperation('The required option "name" expects a string value'));
                return null;
            }
        };
        AppManager.prototype._ensureInitialized = function () {
            if (AppManager.current._initialized)
                return;
            AppManager.current._initialize();
        };
        /** Internal API to initialize the originUri while loading the script */
        AppManager.prototype._initializeOrigin = function () {
            // Get the full uri of the script
            var scriptElements = document.getElementsByTagName('script');
            var currentScriptElement = scriptElements[scriptElements.length - 1];
            // Parse out the host
            var parser = document.createElement('a');
            parser.href = currentScriptElement.src;
            this._originUri = parser.protocol + '//' + parser.host;
        };
        /** Internal API to check/download dependencies, perform global setup etc. */
        AppManager.prototype._initialize = function () {
            // Let's first check for all dependencies so that we can start using jquery
            this._checkDependencies();
            // TODO - 2129732: Remove this when we remove the resizing hooks to the app
            // Until we refactor hosts into simple options let's just create an EmbeddedApp
            // since some parts of our code rely on its existence
            if (!InJs.InfoNavApp.current) {
                InJs.InfoNavApp._current = new InJs.EmbeddedInfoNavApp();
            }
            else {
                InJs.Utility.throwException(InJs.Errors.invalidOperation('An app already exists in this context'));
            }
            // We need to have the origin uri initialized at this point
            if (!this._originUri)
                InJs.Utility.throwException(InJs.Errors.invalidOperation('The originUri is expected to be initialized at this point'));
            // Bind JQuery extension methods now
            this._defineJQueryWidgets();
            this._initialized = true;
        };
        /**
         * Internal API to check wheteher all required JavaScript dependencies are present
         */
        AppManager.prototype._checkDependencies = function () {
            // TODO - 2138425: If JQuery is currently missing we'll never get here as ModalDialog and
            // NotificationControl global initializers will fail
            var jQueryVar = window[AppManager._jQueryVarName];
            if (!jQueryVar || InJs.VersionUtility.compareVersions(AppManager._minimumRequiredJQueryVersion, jQuery.fn.jquery) > 0)
                InJs.Utility.throwException(new InJs.Exceptions.MissingDependencyException('jQuery version ' + AppManager._minimumRequiredJQueryVersion));
            // Check Silverlight dependency so we throw appropriate error for embeddability against old InfoNav code (Crescent)
            var silverlightVar = window[AppManager._silverlightVarName];
            if (!silverlightVar && typeof powerbi['session'] === 'undefined')
                InJs.Utility.throwException(new InJs.Exceptions.MissingDependencyException('silverlight.js'));
        };
        AppManager.prototype._defineAppWidgets = function () {
            window[AppManager._appApiRoot] = this;
        };
        AppManager.prototype._defineJQueryWidgets = function () {
            InJs.WidgetFactory.defineJQueryWidget(AppManager._infoNavQuestionBoxWidgetName, function (hostElement, options) {
                return new InJs.QuestionBox.QuestionBoxControl(hostElement, options);
            });
            var originUri = this._originUri;
            InJs.WidgetFactory.defineJQueryWidget(AppManager._infoNavVisualizerWidgetName, function (hostElement, options) {
                return new InJs.PowerViewSilverlightControl(hostElement, options, originUri + '/ReportServer');
            });
        };
        /**
         * Ensures that the specified group exists
         * @param name - The name of the connection group
         * @returns The newly created connection group
         */
        AppManager.prototype._ensureConnectionGroup = function (name, constructor) {
            InJs.Utility.throwIfNullOrUndefined(name, this, '_ensureConnectionGroup', 'name');
            InJs.Utility.throwIfNullOrUndefined(constructor, this, '_ensureConnectionGroup', 'constructor');
            var connectionGroup = this._connectionGroups[name];
            if (!connectionGroup)
                this._connectionGroups[name] = connectionGroup = constructor();
            return connectionGroup;
        };
        AppManager.prototype._handleInitializationExceptions = function (e, modalDialogService) {
            if (e instanceof InJs.Exceptions.UnsupportedBrowserException) {
                modalDialogService.showPrompt(InJs.Strings.unsupportedBrowserMessageTitle, InJs.Strings.unsupportedBrowserMessageText, [], false);
            }
            else {
                modalDialogService.showError(InJs.Strings.fatalErrorDialogText, 6 /* Fatal */);
            }
        };
        // Implicit AppManager singleton has to be initialized while the script is loading
        AppManager._pageLoadStartTimeVariableName = 'infoNavPageLoadStartTime';
        AppManager._appApiRoot = 'infonav';
        AppManager._current = new AppManager();
        AppManager._jQueryVarName = 'jQuery';
        AppManager._silverlightVarName = 'Silverlight';
        AppManager._minimumRequiredJQueryVersion = '1.9.1';
        AppManager._infoNavQuestionBoxWidgetName = 'infonavQuestionBox';
        AppManager._infoNavVisualizerWidgetName = 'infonavVisualizer';
        return AppManager;
    })();
    InJs.AppManager = AppManager;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** Declares base class for all InfoNav enabled applications */
    var InfoNavApp = (function () {
        function InfoNavApp() {
            // Check browser support
            if (!InJs.BrowserUtility.isBrowserSupported()) {
                throw new InJs.Exceptions.UnsupportedBrowserException();
            }
        }
        Object.defineProperty(InfoNavApp, "current", {
            /** The currently loaded InfoNav application */
            get: function () {
                return this._current;
            },
            enumerable: true,
            configurable: true
        });
        /** Event to be fired upon application resize */
        InfoNavApp.prototype.add_resize = function (handler, data) {
            $(this).on(InfoNavApp.ResizeEventName, data, handler);
        };
        InfoNavApp.prototype.remove_resize = function (handler) {
            $(this).off(InfoNavApp.ResizeEventName, handler);
        };
        InfoNavApp.prototype.raiseResizeEvent = function () {
            $(this).trigger(InfoNavApp.ResizeEventName);
        };
        /** Refreshes the layout on window resize or on control visibility changed */
        InfoNavApp.prototype.refreshLayout = function () {
            InJs.Utility.throwException(InJs.Errors.pureVirtualMethodException("InfoNavApp", "refreshLayout"));
        };
        InfoNavApp.ResizeEventName = 'resize';
        return InfoNavApp;
    })();
    InJs.InfoNavApp = InfoNavApp;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var InJs;
(function (InJs) {
    var TraceType = jsCommon.TraceType;
    /** Declares base class for all InfoNav enabled applications */
    var StandaloneInfoNavApp = (function (_super) {
        __extends(StandaloneInfoNavApp, _super);
        function StandaloneInfoNavApp() {
            if (StandaloneInfoNavApp._currentStandalone) {
                InJs.Utility.throwException(InJs.Errors.invalidOperation('Standalone app already exists in this context'));
            }
            // In standalone apps we have a single modal dialog and notification control that bind to the body
            this._modalDialog = new InJs.ModalDialog($('body'));
            this._notificationControl = new InJs.Notifications.NotificationControl($('body'));
            _super.call(this);
            this.attachErrorHandler();
            StandaloneInfoNavApp._currentStandalone = this;
        }
        Object.defineProperty(StandaloneInfoNavApp, "currentStandalone", {
            get: function () {
                return StandaloneInfoNavApp._currentStandalone;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StandaloneInfoNavApp.prototype, "modalDialog", {
            get: function () {
                return this._modalDialog;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StandaloneInfoNavApp.prototype, "notificationControl", {
            get: function () {
                return this._notificationControl;
            },
            enumerable: true,
            configurable: true
        });
        StandaloneInfoNavApp.prototype.handleIninitalizationExceptions = function (e) {
            if (e instanceof InJs.Exceptions.UnsupportedBrowserException) {
                this.modalDialog.showPrompt(InJs.Strings.unsupportedBrowserMessageTitle, InJs.Strings.unsupportedBrowserMessageText, [], false);
            }
            else {
                this.modalDialog.showError(InJs.Strings.fatalErrorDialogText, 6 /* Fatal */);
            }
        };
        StandaloneInfoNavApp.prototype.attachErrorHandler = function () {
            var _this = this;
            window.onerror = function (message, source, lineNumber, columnNumber, errorObj) {
                var errorInfo = {};
                errorInfo.message = JSON.stringify(message);
                // get extended error information, available in Chrome - this is implemented per HTML5 standards
                if (errorObj && errorObj.message && errorObj.stack) {
                    errorInfo.message = errorObj.message;
                    errorInfo.stack = errorObj.stack;
                }
                // Notes: 
                // - It is also possible to access the stack in IE via arguments.caller.callee.However, this is disallowed in strict mode.
                // - Firefox currently supports no such mechanism
                errorInfo.sourceUrl = source;
                errorInfo.lineNumber = lineNumber;
                errorInfo.columnNumber = columnNumber;
                _this.modalDialog.showError(errorInfo.message, 5 /* UnexpectedError */, null, errorInfo);
                return true;
            };
        };
        return StandaloneInfoNavApp;
    })(InJs.InfoNavApp);
    InJs.StandaloneInfoNavApp = StandaloneInfoNavApp;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    // TODO - 2129732: Remove this when we remove InfoNavApp.current concept
    var EmbeddedInfoNavApp = (function (_super) {
        __extends(EmbeddedInfoNavApp, _super);
        /** Creates a new instance of EmbeddedInfoNavApp */
        function EmbeddedInfoNavApp() {
            var _this = this;
            _super.call(this);
            $(window).resize(function (e) {
                _this.refreshLayout();
            });
        }
        EmbeddedInfoNavApp.prototype.refreshLayout = function () {
            this.raiseResizeEvent();
        };
        return EmbeddedInfoNavApp;
    })(InJs.InfoNavApp);
    InJs.EmbeddedInfoNavApp = EmbeddedInfoNavApp;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** Represents a an InfoNav app controller */
    var InfoNavController = (function () {
        /** Creates a new instance of InfoNavController */
        function InfoNavController() {
            this._options = {};
        }
        Object.defineProperty(InfoNavController.prototype, "options", {
            /** Gets the controller options */
            get: function () {
                return this._options;
            },
            enumerable: true,
            configurable: true
        });
        /** Sets the controller options */
        InfoNavController.prototype.setOptions = function (options) {
            InJs.Utility.throwIfNullOrUndefined(options, this, 'setOptions', 'options');
            for (var optionName in options) {
                this.setOption(optionName, options[optionName]);
            }
        };
        /** Sets a single controller option */
        InfoNavController.prototype.setOption = function (optionName, value) {
            InJs.Utility.throwIfNullOrUndefined(optionName, this, 'setOptions', 'optionName');
            if (value === InJs.Utility.Undefined)
                InJs.Utility.throwException(InJs.Errors.invalidOperation('Cannot set a controller option to ' + InJs.Utility.Undefined));
            this._options[optionName] = value;
        };
        /** Adds a controller operation */
        InfoNavController.prototype._defineOperation = function (operationDefinition) {
            if (this[operationDefinition.name])
                InJs.Utility.throwException(InJs.Errors.invalidOperation('The operation "' + operationDefinition.name + '" already exists on this controller'));
            this[operationDefinition.name] = operationDefinition.callback;
        };
        /** Adds controller option */
        InfoNavController.prototype._defineOption = function (optionDefinition, options, isReadOnly) {
            InJs.Utility.throwIfNullOrUndefined(optionDefinition, this, '_defineOption', 'optionDefinition');
            InJs.Utility.throwIfNullOrUndefined(options, this, '_defineOption', 'options');
            if (this._options[optionDefinition.name]) {
                InJs.Utility.throwException(InJs.Errors.invalidOperation('The option "' + optionDefinition.name + '" already exists on this controller'));
            }
            Object.defineProperty(this._options, optionDefinition.name, {
                get: optionDefinition.getter,
                set: optionDefinition.setter,
                enumerable: true,
                configurable: isReadOnly,
            });
            // Only undefined means the default/explicit option value was not provided
            var value = options[optionDefinition.name];
            var isRequiredOption = (optionDefinition.defaultValue === undefined);
            if (isRequiredOption) {
                if (value === undefined) {
                    InJs.Utility.throwException(InJs.Errors.invalidOperation('Required option "' + optionDefinition.name + '" was not provided'));
                }
                else {
                    this.setOption(optionDefinition.name, value);
                }
            }
            else {
                if (value !== undefined) {
                    this.setOption(optionDefinition.name, value);
                }
                else {
                    this.setOption(optionDefinition.name, optionDefinition.defaultValue);
                }
            }
            // If this is a read-only option seal the setter by redefinig the property
            if (isReadOnly) {
                Object.defineProperty(this._options, optionDefinition.name, {
                    get: optionDefinition.getter,
                    set: InfoNavController._optionIsReadOnlyStub,
                    enumerable: true,
                    configurable: false,
                });
            }
        };
        /** Stub that substitues the setter for read-only options */
        InfoNavController._optionIsReadOnlyStub = function (value) {
            InJs.Utility.throwException(InJs.Errors.invalidOperation('Option is read-only'));
        };
        return InfoNavController;
    })();
    InJs.InfoNavController = InfoNavController;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /**
     * Base class for all subscribers that can listen and invoke methods in InfoNavEventBridge.
     */
    var EventBridgeParticipant = (function (_super) {
        __extends(EventBridgeParticipant, _super);
        function EventBridgeParticipant(bridge) {
            _super.call(this);
            this._currentInterpretResponse = null;
            if (bridge)
                this.registerBridge(bridge);
        }
        EventBridgeParticipant.prototype.registerBridge = function (bridge) {
            if (this._bridge)
                InJs.Utility.throwException(InJs.Errors.invalidOperation('Participant is already registered on a bridge'));
            bridge.attach(InJs.Events.ConnectionGroupInvalidatedEventName, EventBridgeParticipant.bridge_ConnectionGroupInvalidated, this);
            bridge.attach(InJs.Events.ConnectionGroupReadyEventName, EventBridgeParticipant.bridge_ConnectionGroupReady, this);
            bridge.attach(InJs.Events.InterpretSuccessEventName, EventBridgeParticipant.bridge_InterpretSuccess, this);
            bridge.attach(InJs.Events.InterpretIssuedEventName, EventBridgeParticipant.bridge_InterpretIssued, this);
            bridge.attach(InJs.Events.InterpretErrorEventName, EventBridgeParticipant.bridge_InterpretError, this);
            bridge.attach(InJs.Events.InterpretRetryInProgressEventName, EventBridgeParticipant.bridge_InterpretTimedOut, this);
            bridge.attach(InJs.Events.InterpretRetryCountExceededEventName, EventBridgeParticipant.bridge_InterpretRetryCountExceeded, this);
            bridge.attach(InJs.Events.InterpretProbeInProgressEventName, EventBridgeParticipant.bridge_InterpretProbeInProgress, this);
            bridge.attach(InJs.Events.InterpretProbeSuccessEvent, EventBridgeParticipant.bridge_InterpretProbeSuccess, this);
            bridge.attach(InJs.Events.InterpretProbeErrorEventName, EventBridgeParticipant.bridge_InterpretProbeError, this);
            bridge.attach(InJs.Events.ClearInterpretResultEventName, EventBridgeParticipant.bridge_InterpretResultCleared, this);
            bridge.attach(InJs.Events.InterpretResultCacheClearedEventName, EventBridgeParticipant.bridge_InterpretResultCacheCleared, this);
            bridge.attach(InJs.Events.InterpretResultChangedEventName, EventBridgeParticipant.bridge_InterpretResultChanged, this);
            bridge.attach(InJs.Events.SetVisualizationTypeEventName, EventBridgeParticipant.bridge_SetVisualizedTypeIssued, this);
            bridge.attach(InJs.Events.AvailableVisualizationTypesReadyEventName, EventBridgeParticipant.bridge_AvailableVisualizationTypesReady, this);
            bridge.attach(InJs.Events.PowerViewErrorEventName, EventBridgeParticipant.bridge_PowerViewError, this);
            bridge.attach(InJs.Events.QuestionBoxSuggestionsDisplayedEventName, EventBridgeParticipant.bridge_QuestionBoxSuggestionsDisplayed, this);
            bridge.attach(InJs.Events.ChangeUserUtteranceEventName, EventBridgeParticipant.bridge_ChangeUserUtterance, this);
            bridge.attach(InJs.Events.UserUtteranceConfirmedEventName, EventBridgeParticipant.bridge_UserUtteranceConfirmed, this);
            bridge.attach(InJs.Events.TermSelectionChangedEventName, EventBridgeParticipant.bridge_TermSelectionChanged, this);
            bridge.attach(InJs.Events.CollageVisibilityChangedEventName, EventBridgeParticipant.bridge_CollageVisibilityChanged, this);
            bridge.attach(InJs.Events.FeaturedQuestionsUpdatedEventName, EventBridgeParticipant.bridge_FeaturedQuestionsUpdated, this);
            bridge.attach(InJs.Events.ShowMessageEventName, EventBridgeParticipant.bridge_ShowMessage, this);
            bridge.attach(InJs.Events.ShowPromptEventName, EventBridgeParticipant.bridge_ShowPrompt, this);
            bridge.attach(InJs.Events.ShowErrorEventName, EventBridgeParticipant.bridge_ShowError, this);
            bridge.attach(InJs.Events.ShowCustomDialogEventName, EventBridgeParticipant.bridge_ShowCustomDialog, this);
            bridge.attach(InJs.Events.HideDialogEventName, EventBridgeParticipant.bridge_HideDialog, this);
            bridge.attach(InJs.Events.ShowNotificationEventName, EventBridgeParticipant.bridge_ShowNotification, this);
            bridge.attach(InJs.Events.HideNotificationEventName, EventBridgeParticipant.bridge_HideNotification, this);
            this._bridge = bridge;
        };
        EventBridgeParticipant.prototype.unregisterBridge = function () {
            // Unsubscribe from all event bridge events
            if (this._bridge) {
                var bridge = this._bridge;
                bridge.detach(InJs.Events.ConnectionGroupInvalidatedEventName, EventBridgeParticipant.bridge_ConnectionGroupInvalidated);
                bridge.detach(InJs.Events.ConnectionGroupReadyEventName, EventBridgeParticipant.bridge_ConnectionGroupReady);
                bridge.detach(InJs.Events.InterpretSuccessEventName, EventBridgeParticipant.bridge_InterpretSuccess);
                bridge.detach(InJs.Events.InterpretIssuedEventName, EventBridgeParticipant.bridge_InterpretIssued);
                bridge.detach(InJs.Events.InterpretErrorEventName, EventBridgeParticipant.bridge_InterpretError);
                bridge.detach(InJs.Events.InterpretRetryInProgressEventName, EventBridgeParticipant.bridge_InterpretTimedOut);
                bridge.detach(InJs.Events.InterpretRetryCountExceededEventName, EventBridgeParticipant.bridge_InterpretRetryCountExceeded);
                bridge.detach(InJs.Events.InterpretProbeInProgressEventName, EventBridgeParticipant.bridge_InterpretProbeInProgress);
                bridge.detach(InJs.Events.InterpretProbeSuccessEvent, EventBridgeParticipant.bridge_InterpretProbeSuccess);
                bridge.detach(InJs.Events.InterpretProbeErrorEventName, EventBridgeParticipant.bridge_InterpretProbeError);
                bridge.detach(InJs.Events.ClearInterpretResultEventName, EventBridgeParticipant.bridge_InterpretResultCleared);
                bridge.detach(InJs.Events.InterpretResultCacheClearedEventName, EventBridgeParticipant.bridge_InterpretResultCacheCleared);
                bridge.detach(InJs.Events.InterpretResultChangedEventName, EventBridgeParticipant.bridge_InterpretResultChanged);
                bridge.detach(InJs.Events.SetVisualizationTypeEventName, EventBridgeParticipant.bridge_SetVisualizedTypeIssued);
                bridge.detach(InJs.Events.AvailableVisualizationTypesReadyEventName, EventBridgeParticipant.bridge_AvailableVisualizationTypesReady);
                bridge.detach(InJs.Events.PowerViewErrorEventName, EventBridgeParticipant.bridge_PowerViewError);
                bridge.detach(InJs.Events.QuestionBoxSuggestionsDisplayedEventName, EventBridgeParticipant.bridge_QuestionBoxSuggestionsDisplayed);
                bridge.detach(InJs.Events.ChangeUserUtteranceEventName, EventBridgeParticipant.bridge_ChangeUserUtterance);
                bridge.detach(InJs.Events.UserUtteranceConfirmedEventName, EventBridgeParticipant.bridge_UserUtteranceConfirmed);
                bridge.detach(InJs.Events.TermSelectionChangedEventName, EventBridgeParticipant.bridge_TermSelectionChanged);
                bridge.detach(InJs.Events.CollageVisibilityChangedEventName, EventBridgeParticipant.bridge_CollageVisibilityChanged);
                bridge.detach(InJs.Events.FeaturedQuestionsUpdatedEventName, EventBridgeParticipant.bridge_FeaturedQuestionsUpdated);
                bridge.detach(InJs.Events.ShowMessageEventName, EventBridgeParticipant.bridge_ShowMessage);
                bridge.detach(InJs.Events.ShowPromptEventName, EventBridgeParticipant.bridge_ShowPrompt);
                bridge.detach(InJs.Events.ShowErrorEventName, EventBridgeParticipant.bridge_ShowError);
                bridge.detach(InJs.Events.ShowCustomDialogEventName, EventBridgeParticipant.bridge_ShowCustomDialog);
                bridge.detach(InJs.Events.HideDialogEventName, EventBridgeParticipant.bridge_HideDialog);
                bridge.detach(InJs.Events.ShowNotificationEventName, EventBridgeParticipant.bridge_ShowNotification);
                bridge.detach(InJs.Events.HideNotificationEventName, EventBridgeParticipant.bridge_HideNotification);
                this._bridge = null;
            }
        };
        Object.defineProperty(EventBridgeParticipant.prototype, "bridge", {
            get: function () {
                return this._bridge;
            },
            enumerable: true,
            configurable: true
        });
        EventBridgeParticipant.prototype._clearCurrentInterpretResult = function () {
            this._currentInterpretResponse = null;
        };
        EventBridgeParticipant.prototype._hasInterpretResponse = function () {
            return !!this._currentInterpretResponse && this._currentInterpretResponse.result;
        };
        /** Protected methods to be overriden by implementing services and controls */
        EventBridgeParticipant.prototype._onConnectionGroupInvalidated = function () {
        };
        EventBridgeParticipant.prototype._onConnectionGroupReady = function () {
        };
        EventBridgeParticipant.prototype._onInterpretResultChanged = function (eventArgs) {
        };
        EventBridgeParticipant.prototype._onInterpretIssued = function (eventArgs) {
        };
        EventBridgeParticipant.prototype._onInterpretSuccess = function (eventArgs) {
        };
        EventBridgeParticipant.prototype._onInterpretError = function (eventArgs) {
        };
        EventBridgeParticipant.prototype._onInterpretRetryInProgress = function () {
        };
        EventBridgeParticipant.prototype._onInterpretRetryCountExceeded = function () {
        };
        EventBridgeParticipant.prototype._onInterpretProbeInProgress = function () {
        };
        EventBridgeParticipant.prototype._onInterpretProbeSuccess = function () {
        };
        EventBridgeParticipant.prototype._onInterpretProbeError = function () {
        };
        EventBridgeParticipant.prototype._onInterpretResultCleared = function (eventArgs) {
        };
        EventBridgeParticipant.prototype._onInterpretResultCacheCleared = function () {
        };
        EventBridgeParticipant.prototype._onSetVisualizationType = function (e) {
        };
        EventBridgeParticipant.prototype._onAvailableVisualizationTypesReady = function (eventArgs) {
        };
        EventBridgeParticipant.prototype._onPowerViewError = function (eventArgs) {
        };
        EventBridgeParticipant.prototype._onQuestionBoxSuggestionsDisplayed = function (eventArgs) {
        };
        EventBridgeParticipant.prototype._onChangeUserUtterance = function (eventArgs) {
        };
        EventBridgeParticipant.prototype._onUserUtteranceConfirmed = function () {
        };
        EventBridgeParticipant.prototype._onTermSelectionChanged = function (eventArgs) {
        };
        EventBridgeParticipant.prototype._onCollageVisibilityChanged = function (eventArgs) {
        };
        EventBridgeParticipant.prototype._onFeaturedQuestionsUpdated = function () {
        };
        EventBridgeParticipant.prototype._onShowMessage = function (eventArgs) {
        };
        EventBridgeParticipant.prototype._onShowPrompt = function (eventArgs) {
        };
        EventBridgeParticipant.prototype._onShowError = function (eventArgs) {
        };
        EventBridgeParticipant.prototype._onShowCustomDialog = function (eventArgs) {
        };
        EventBridgeParticipant.prototype._onHideDialog = function () {
        };
        EventBridgeParticipant.prototype._onShowNotification = function (eventArgs) {
        };
        EventBridgeParticipant.prototype._onHideNotification = function (eventArgs) {
        };
        /** Event handlers just here to avoid code duplication in every implementing class */
        EventBridgeParticipant.bridge_ConnectionGroupInvalidated = function (e) {
            var self = e.data;
            self._onConnectionGroupInvalidated();
        };
        EventBridgeParticipant.bridge_ConnectionGroupReady = function (e) {
            var self = e.data;
            self._onConnectionGroupReady();
        };
        EventBridgeParticipant.bridge_InterpretIssued = function (e, eventArgs) {
            var self = e.data;
            InJs.Utility.throwIfNullOrUndefined(eventArgs, self, 'Bridge_InterpretIssued', 'eventArgs');
            self._onInterpretIssued(eventArgs);
        };
        EventBridgeParticipant.bridge_InterpretSuccess = function (e, eventArgs) {
            var self = e.data;
            InJs.Utility.throwIfNullOrUndefined(eventArgs, self, 'Bridge_InterpretSuccess', 'eventArgs');
            self._currentInterpretResponse = eventArgs.response;
            self._onInterpretSuccess(eventArgs);
        };
        EventBridgeParticipant.bridge_InterpretError = function (e, eventArgs) {
            var self = e.data;
            InJs.Utility.throwIfNullOrUndefined(eventArgs, self, 'Bridge_InterpretError', 'eventArgs');
            var args = eventArgs;
            self._currentInterpretResponse = null;
            self._onInterpretError(args);
        };
        EventBridgeParticipant.bridge_InterpretTimedOut = function (e) {
            var self = e.data;
            self._onInterpretRetryInProgress();
        };
        EventBridgeParticipant.bridge_InterpretRetryCountExceeded = function (e) {
            var self = e.data;
            self._onInterpretRetryCountExceeded();
        };
        EventBridgeParticipant.bridge_InterpretProbeInProgress = function (e) {
            var self = e.data;
            self._onInterpretProbeInProgress();
        };
        EventBridgeParticipant.bridge_InterpretProbeSuccess = function (e) {
            var self = e.data;
            self._onInterpretProbeSuccess();
        };
        EventBridgeParticipant.bridge_InterpretProbeError = function (e) {
            var self = e.data;
            self._onInterpretProbeError();
        };
        EventBridgeParticipant.bridge_InterpretResultCleared = function (e, eventArgs) {
            var self = e.data;
            InJs.Utility.throwIfNullOrUndefined(eventArgs, self, 'Bridge_InterpretResultCleared', 'eventArgs');
            self._clearCurrentInterpretResult();
            self._onInterpretResultCleared(eventArgs);
        };
        EventBridgeParticipant.bridge_InterpretResultCacheCleared = function (e) {
            var self = e.data;
            self._onInterpretResultCacheCleared();
        };
        EventBridgeParticipant.bridge_InterpretResultChanged = function (e, eventArgs) {
            var self = e.data;
            InJs.Utility.throwIfNullOrUndefined(eventArgs, self, 'Bridge_InterpretResultChanged', 'eventArgs');
            var args = eventArgs;
            self._currentInterpretResponse = args.response;
            self._onInterpretResultChanged(args);
        };
        EventBridgeParticipant.bridge_SetVisualizedTypeIssued = function (e, eventArgs) {
            var self = e.data;
            InJs.Utility.throwIfNullOrUndefined(eventArgs, self, 'Bridge_SetVisualizedTypeIssued', 'eventArgs');
            self._onSetVisualizationType(eventArgs);
        };
        EventBridgeParticipant.bridge_AvailableVisualizationTypesReady = function (e, eventArgs) {
            var self = e.data;
            InJs.Utility.throwIfNullOrUndefined(eventArgs, self, 'Bridge_AvailableVisualizationTypesReady', 'eventArgs');
            self._onAvailableVisualizationTypesReady(eventArgs);
        };
        EventBridgeParticipant.bridge_PowerViewError = function (e, eventArgs) {
            var self = e.data;
            InJs.Utility.throwIfNullOrUndefined(eventArgs, self, 'Bridge_PowerViewError', 'eventArgs');
            self._onPowerViewError(eventArgs);
        };
        EventBridgeParticipant.bridge_QuestionBoxSuggestionsDisplayed = function (e, eventArgs) {
            var self = e.data;
            InJs.Utility.throwIfNullOrUndefined(eventArgs, self, 'Bridge_QuestionBoxSuggestionsDisplayed', 'eventArgs');
            self._onQuestionBoxSuggestionsDisplayed(eventArgs);
        };
        EventBridgeParticipant.bridge_ChangeUserUtterance = function (e, eventArgs) {
            var self = e.data;
            InJs.Utility.throwIfNullOrUndefined(eventArgs, self, 'Bridge_ChangeUserUtterance', 'eventArgs');
            self._onChangeUserUtterance(eventArgs);
        };
        EventBridgeParticipant.bridge_UserUtteranceConfirmed = function (e) {
            var self = e.data;
            self._onUserUtteranceConfirmed();
        };
        EventBridgeParticipant.bridge_TermSelectionChanged = function (e, eventArgs) {
            var self = e.data;
            InJs.Utility.throwIfNullOrUndefined(eventArgs, self, 'Bridge_TermSelectionChanged', 'eventArgs');
            self._onTermSelectionChanged(eventArgs);
        };
        EventBridgeParticipant.bridge_CollageVisibilityChanged = function (e, eventArgs) {
            var self = e.data;
            InJs.Utility.throwIfNullOrUndefined(eventArgs, self, 'Bridge_CollageVisibilityChanged', 'eventArgs');
            self._onCollageVisibilityChanged(eventArgs);
        };
        EventBridgeParticipant.bridge_FeaturedQuestionsUpdated = function (e) {
            var self = e.data;
            self._onFeaturedQuestionsUpdated();
        };
        EventBridgeParticipant.bridge_ShowMessage = function (e, eventArgs) {
            var self = e.data;
            InJs.Utility.throwIfNullOrUndefined(eventArgs, self, 'Bridge_ShowMessage', 'eventArgs');
            self._onShowMessage(eventArgs);
        };
        EventBridgeParticipant.bridge_ShowPrompt = function (e, eventArgs) {
            var self = e.data;
            InJs.Utility.throwIfNullOrUndefined(eventArgs, self, 'Bridge_ShowPrompt', 'eventArgs');
            self._onShowPrompt(eventArgs);
        };
        EventBridgeParticipant.bridge_ShowError = function (e, eventArgs) {
            var self = e.data;
            InJs.Utility.throwIfNullOrUndefined(eventArgs, self, 'Bridge_ShowError', 'eventArgs');
            self._onShowError(eventArgs);
        };
        EventBridgeParticipant.bridge_ShowCustomDialog = function (e, eventArgs) {
            var self = e.data;
            InJs.Utility.throwIfNullOrUndefined(eventArgs, self, 'Bridge_ShowCustomDialog', 'eventArgs');
            self._onShowCustomDialog(eventArgs);
        };
        EventBridgeParticipant.bridge_HideDialog = function (e) {
            var self = e.data;
            self._onHideDialog();
        };
        EventBridgeParticipant.bridge_ShowNotification = function (e, eventArgs) {
            var self = e.data;
            InJs.Utility.throwIfNullOrUndefined(eventArgs, self, 'Bridge_ShowNotification', 'eventArgs');
            self._onShowNotification(eventArgs);
        };
        EventBridgeParticipant.bridge_HideNotification = function (e, eventArgs) {
            var self = e.data;
            InJs.Utility.throwIfNullOrUndefined(eventArgs, self, 'Bridge_HideNotification', 'eventArgs');
            self._onHideNotification(eventArgs);
        };
        return EventBridgeParticipant;
    })(InJs.InfoNavController);
    InJs.EventBridgeParticipant = EventBridgeParticipant;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    (function (InfoNavTokenKind) {
        InfoNavTokenKind[InfoNavTokenKind["None"] = 0] = "None";
        InfoNavTokenKind[InfoNavTokenKind["Default"] = 1] = "Default";
        InfoNavTokenKind[InfoNavTokenKind["Management"] = 1 << 1] = "Management";
        InfoNavTokenKind[InfoNavTokenKind["SharePointOnline"] = 1 << 2] = "SharePointOnline";
        InfoNavTokenKind[InfoNavTokenKind["AAD"] = 1 << 3] = "AAD";
    })(InJs.InfoNavTokenKind || (InJs.InfoNavTokenKind = {}));
    var InfoNavTokenKind = InJs.InfoNavTokenKind;
    var InfoNavServiceConfigurationUtils;
    (function (InfoNavServiceConfigurationUtils) {
        function getSecurityToken(config) {
            return getToken(config, config.getSecurityTokenKind());
        }
        InfoNavServiceConfigurationUtils.getSecurityToken = getSecurityToken;
        function getToken(config, kind) {
            debug.assertValue(config, 'config');
            switch (kind) {
                case 1 /* Default */:
                    debug.assertValue(config.getSecurityToken(), 'config.defaultToken');
                    return {
                        tokenHeader: InJs.HttpUtility.HttpCloudBIAccessTokenHeader,
                        tokenValue: config.getSecurityToken(),
                    };
                case InfoNavTokenKind.Management:
                    debug.assertValue(config.getManagementSecurityToken(), 'config.getManagementSecurityToken()');
                    return {
                        tokenHeader: InJs.HttpUtility.HttpInfoNavSpAccessTokenHeader,
                        tokenValue: config.getManagementSecurityToken(),
                    };
                case InfoNavTokenKind.SharePointOnline:
                    debug.assertValue(config.getSpoContextToken(), 'config.getSpoContextToken()');
                    return {
                        tokenHeader: InJs.HttpUtility.HttpSpoContextTokenHeader,
                        tokenValue: config.getSpoContextToken(),
                    };
                case InfoNavTokenKind.AAD:
                    debug.assertValue(config.getSecurityToken(), 'config.defaultToken');
                    return {
                        tokenHeader: InJs.HttpUtility.HttpAuthorizationHeader,
                        tokenValue: 'Bearer ' + config.getSecurityToken(),
                    };
            }
            debug.assertFail('Unhandled InfoNavTokenKind: ' + kind);
            return null;
        }
        InfoNavServiceConfigurationUtils.getToken = getToken;
    })(InfoNavServiceConfigurationUtils = InJs.InfoNavServiceConfigurationUtils || (InJs.InfoNavServiceConfigurationUtils = {}));
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** Base class for all InfoNav services */
    var InfoNavClientService = (function (_super) {
        __extends(InfoNavClientService, _super);
        function InfoNavClientService(bridge, configurationProvider) {
            InJs.Utility.throwIfNullOrUndefined(bridge, this, 'ctor', 'configurationProvider');
            InJs.Utility.throwIfNullOrUndefined(configurationProvider, this, 'ctor', 'configurationProvider');
            _super.call(this, bridge);
            this._configurationProvider = configurationProvider;
        }
        Object.defineProperty(InfoNavClientService.prototype, "configurationProvider", {
            get: function () {
                return this._configurationProvider;
            },
            enumerable: true,
            configurable: true
        });
        return InfoNavClientService;
    })(InJs.EventBridgeParticipant);
    InJs.InfoNavClientService = InfoNavClientService;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    (function (InterpretProbeStatus) {
        InterpretProbeStatus[InterpretProbeStatus["InProgress"] = 0] = "InProgress";
        InterpretProbeStatus[InterpretProbeStatus["Success"] = 1] = "Success";
        InterpretProbeStatus[InterpretProbeStatus["Failed"] = 2] = "Failed";
    })(InJs.InterpretProbeStatus || (InJs.InterpretProbeStatus = {}));
    var InterpretProbeStatus = InJs.InterpretProbeStatus;
    var PendingInterpretRequest = (function () {
        function PendingInterpretRequest() {
            this.timedOut = false;
            this.aborted = false;
            this.activityId = null;
            this.requestId = null;
            this.request = null;
            this.executor = null;
            this.interpretActivity = null;
            // custom event handlers
            this.responseHandler = null;
        }
        return PendingInterpretRequest;
    })();
    InJs.PendingInterpretRequest = PendingInterpretRequest;
    var CachedResult = (function () {
        function CachedResult() {
            this.requestId = null;
            this.results = null;
            this.options = null;
        }
        CachedResult.prototype.containsWarning = function (warning) {
            debug.assertValue(warning, 'warning');
            var results = this.results;
            if (results && results.length) {
                for (var i = 0, ilen = results.length; i < ilen; i++) {
                    if (InJs.EnumExtensions.hasFlag(results[i].Warnings, warning))
                        return true;
                }
            }
            return false;
        };
        return CachedResult;
    })();
    InJs.CachedResult = CachedResult;
    /**
      This is the component that talks to the backend and shares the result between all client side components within the group
      TODO 1657486: Refactor to disassociate control group event propagation from core service logic
     */
    var InterpretService = (function (_super) {
        __extends(InterpretService, _super);
        function InterpretService(bridge, configurationProvider, version) {
            _super.call(this, bridge, configurationProvider);
            // JQuery Ajax Status
            this.JQueryTimedOutStatus = "timeout";
            this.JQueryAbortedStatus = "abort";
            this.MinUtteranceLength = 1;
            // 15 second timeout
            this.InterpretOperationTimeout = 15000;
            // 65 second timeout for probing request
            this.InterpretProbeOperationTimeout = 65000;
            // maximum number of concurrent Interpret requests
            this.MaxInterpretRequests = 4;
            // Maximum number of retries for linguistic schema loading warnings
            this.MaxSchemaLoadingRetryRequests = 5;
            // Maximum number of retries for when models are not yet loaded in the backend
            this.MaxTimeoutRetryRequests = 3;
            this._initialUtterance = null;
            this._initialInterpretOptions = null;
            this._initialUtteranceActivity = null;
            this._resultCache = null;
            this._defaultResultSource = null;
            this._selectedResultSource = null;
            this._currentResponse = null;
            this._version = 0;
            this._interpretRequestQueue = null;
            this._currentSchemaLoadingRetryCount = 0;
            this._currentTimeoutRetryCount = 0;
            this._probeRequestResultCache = null;
            // Keep track of whether we've tried to refresh the app metadata in order to fix
            // 'InfoNavUnableToResolveScopeErrorValue' errors.
            this._refreshAppMetadataAttempted = false;
            // In order for callees to keep track of the newest result without needing to
            // know the order of the queue, each request performed will be given not only
            // a guid but also an orderId, where the bigger the number the newer the
            // request. This allows an O(1) comparison in terms of memory and space for
            // callers to know if any request is newer compared to any other already seen.
            //
            // Note that the number is ever increasing from the start of the session, so the
            // user will theoritacally hit a cap on the total number of requests that can be
            // sent. However, the maximum contiguous number in JavaScript is 9007199254740992,
            // so even at one request per millisecond the browser could be open for 285,616 years
            // before it would reach the cap.
            this._currentOrderId = 0;
            this._interpretRequestQueue = [];
            this._interpretRequestTransientLinguisticSchemaMap = {};
            this._probeRequestResultCache = {};
            this._version = version;
            if (this.configurationProvider.getIsReady()) {
                this.onGroupReady();
            }
        }
        InterpretService.prototype._onConnectionGroupInvalidated = function () {
            this.onGroupInvalidated();
        };
        InterpretService.prototype._onConnectionGroupReady = function () {
            this.onGroupReady();
        };
        InterpretService.prototype._onInterpretResultCleared = function (eventArgs) {
            if (eventArgs.abortInterprets) {
                this.abortAllInterpretRequests(true);
            }
            if (eventArgs.clearUtterance) {
                this._initialUtterance = null;
            }
        };
        InterpretService.prototype._onInterpretResultCacheCleared = function () {
            this._resultCache = {};
            // Re-send the most recent interpret request, since the cache has changed.
            if (this._currentResponse) {
                this.interpretAsync(this._currentResponse.utterance);
            }
        };
        InterpretService.abortInterpretRequest = function (request) {
            if (request && request.executor && !request.aborted) {
                try {
                    request.aborted = true;
                    request.executor.abort();
                    InJs.Tracing.verbose('Interpret request aborted', request.requestId);
                }
                catch (e) {
                    InJs.Tracing.error('Error while aborting Interpret request', request.requestId);
                }
                finally {
                    if (request.interpretActivity && !request.interpretActivity.completed)
                        InterpretService.endInterpretActivityIfPresent(request.interpretActivity, 0 /* Unknown */, InJs.ActivityErrors.UserAborted);
                }
            }
        };
        InterpretService.isInProgressRequest = function (request) {
            return !request.aborted && request.executor.readyState !== request.executor.DONE;
        };
        Object.defineProperty(InterpretService.prototype, "interpretRequestUrl", {
            get: function () {
                return InJs.Utility.urlCombine(this.configurationProvider.getClusterUri(), InterpretService.InterpretationServicePath + InterpretService.InterpretOperationPath);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InterpretService.prototype, "interpretProbeRequestUrl", {
            get: function () {
                return InJs.Utility.urlCombine(this.configurationProvider.getClusterUri(), InterpretService.InterpretationServicePath + InterpretService.InterpretProbeOperationName);
            },
            enumerable: true,
            configurable: true
        });
        // Event raising
        InterpretService.prototype.raiseInterpretIssuedEvent = function (arg) {
            this.bridge.raise(InJs.Events.InterpretIssuedEventName, arg);
            this.bridge.raise(InJs.Events.InterpretUsageIssuedEventName, arg);
        };
        InterpretService.prototype.raiseInterpretSuccessEvent = function (arg) {
            this._selectedResultSource = null;
            arg.response.defaultResultSource = this._defaultResultSource;
            arg.response.selectedResultSource = this._selectedResultSource;
            this._currentResponse = arg.response;
            this.bridge.raise(InJs.Events.InterpretSuccessEventName, arg);
            this.bridge.raise(InJs.Events.InterpretUsageSuccessEventName, arg);
        };
        InterpretService.prototype.raiseInterpretErrorEvent = function (arg) {
            this.bridge.raise(InJs.Events.InterpretErrorEventName, arg);
        };
        InterpretService.prototype.raiseClearInterpretResultEvent = function (arg) {
            this.bridge.raise(InJs.Events.ClearInterpretResultEventName, arg);
        };
        InterpretService.prototype.raiseInterpretResultChangedEvent = function (arg) {
            this.bridge.raise(InJs.Events.InterpretResultChangedEventName, arg);
        };
        InterpretService.prototype.raiseRetryInProgress = function () {
            this.bridge.raise(InJs.Events.InterpretRetryInProgressEventName);
        };
        InterpretService.prototype.raiseInterpretRetryCountExceeded = function () {
            this.bridge.raise(InJs.Events.InterpretRetryCountExceededEventName);
        };
        InterpretService.prototype.raiseProbingRequestInProgress = function () {
            this.bridge.raise(InJs.Events.InterpretProbeInProgressEventName);
        };
        InterpretService.prototype.raiseProbingRequestSuccessEvent = function () {
            this.bridge.raise(InJs.Events.InterpretProbeSuccessEvent);
        };
        InterpretService.prototype.raiseInterpretProbeErrorEvent = function () {
            this.bridge.raise(InJs.Events.InterpretProbeErrorEventName);
        };
        InterpretService.prototype.onGroupInvalidated = function (e) {
            var self = e ? e.data : this;
            self._currentTimeoutRetryCount = 0;
            self._currentSchemaLoadingRetryCount = 0;
        };
        InterpretService.prototype.onGroupReady = function (e) {
            // create a new result cache, as the host is likely operating with a different set of model than what we started off with
            var self = e ? e.data : this;
            self._resultCache = {};
            // send a probe interpret request out to get the system warmed up
            self.issueProbeRequest();
        };
        InterpretService.prototype.onProbeRequestSuccess = function () {
            this.setProbeRequestStatus(1 /* Success */);
            this._refreshAppMetadataAttempted = false;
            this.raiseProbingRequestSuccessEvent();
            // issue the initial interpret request, if any
            if (!InJs.StringExtensions.isNullOrUndefinedOrWhiteSpaceString(this._initialUtterance)) {
                this.interpretAsync(this._initialUtterance, this._initialUtteranceActivity, null, null, this._initialInterpretOptions);
            }
        };
        InterpretService.prototype.onProbeRequestFailure = function (request) {
            this.setProbeRequestStatus(2 /* Failed */);
            this.raiseInterpretProbeErrorEvent();
            if (InJs.HttpUtility.isForbiddenOrUnauthorized(request.status)) {
                if (!this._refreshAppMetadataAttempted) {
                    this._refreshAppMetadataAttempted = true;
                    this.configurationProvider.invalidate();
                    // Don't queue up anything else as connection group will 
                    // notify us when ready which will trigger another probe
                    InJs.Tracing.verbose('Refreshing app metadata on access denied for interpret probe', request.requestId);
                }
                else {
                    InJs.Tracing.verbose('Not refreshing app metadata again on access denied for interpret probe', request.requestId);
                }
            }
            else if (this._currentTimeoutRetryCount < this.MaxTimeoutRetryRequests) {
                // notify the UI layer that there is a retry in progress, in the case the user is actually waiting for something
                if (!InJs.StringExtensions.isNullOrEmpty(this._initialUtterance)) {
                    this.raiseRetryInProgress();
                }
                // retry using the probe request - in case the user utterance was dirty
                this._currentTimeoutRetryCount++;
                this.issueProbeRequest();
                InJs.Tracing.verbose('Retrying unsuccessful probe request.', request.requestId);
            }
            else {
                this.raiseInterpretRetryCountExceeded();
                InJs.Tracing.error('Aborting initialization after probe request failures', request.requestId);
            }
        };
        InterpretService.prototype.issueProbeRequest = function () {
            this.setProbeRequestStatus(0 /* InProgress */);
            this.interpretProbeAsyncInternal();
        };
        Object.defineProperty(InterpretService.prototype, "probeRequestInProgress", {
            get: function () {
                var securityToken = this.configurationProvider.getSecurityToken();
                return this._probeRequestResultCache[securityToken] === 0 /* InProgress */;
            },
            enumerable: true,
            configurable: true
        });
        InterpretService.prototype.setProbeRequestStatus = function (status) {
            var securityToken = this.configurationProvider.getSecurityToken();
            this._probeRequestResultCache[securityToken] = status;
        };
        /**
         * Specified the default data source for future Interpret requests
         * @param dataSourceName - The default data source to select from which to provide results
         */
        InterpretService.prototype._setDefaultResultSource = function (dataSourceName) {
            this._defaultResultSource = dataSourceName;
            // Since we have UI which allows the user to change the default result source even when the current result is empty,
            // we need to check if we currently have a valid response before updating it and notifying InterpretResult listeners.
            if (this._currentResponse) {
                this._currentResponse.defaultResultSource = this._defaultResultSource;
                var args = new InJs.InterpretResultChangedEventArgs(this._currentResponse, this._currentResponse.requestId);
                this.raiseInterpretResultChangedEvent(args);
            }
        };
        /**
         * Sets both the default and currently selected data sources
         * This method allows us to notify consumers of the class of the sources being updated in a single event
         * @param selectedResultSourceName - The data source to select from the current response
         * @param defaultResultSourceName - The default data source to select for future queries
         */
        InterpretService.prototype._setResultSources = function (selectedResultSourceName, defaultResultSourceName) {
            this._defaultResultSource = defaultResultSourceName;
            this._selectedResultSource = selectedResultSourceName;
            // Since we have UI which allows the user to change the default result source even when the current result is empty,
            // we need to check if we currently have a valid response before updating it and notifying InterpretResult listeners.
            if (this._currentResponse) {
                this._currentResponse.defaultResultSource = this._defaultResultSource;
                this._currentResponse.selectedResultSource = this._selectedResultSource;
                var args = new InJs.InterpretResultChangedEventArgs(this._currentResponse, this._currentResponse.requestId);
                this.raiseInterpretResultChangedEvent(args);
            }
        };
        InterpretService.prototype.registerTransientLinguisticSchemaProvider = function (databaseName, provider) {
            InJs.Utility.throwIfNullOrUndefined(databaseName, this, 'registerTransientLinguisticSchemaProvider', 'databaseName');
            InJs.Utility.throwIfNullOrUndefined(provider, this, 'registerTransientLinguisticSchemaProvider', 'provider');
            this._interpretRequestTransientLinguisticSchemaMap[databaseName] = provider;
        };
        Object.defineProperty(InterpretService.prototype, "isInitialInterpretPending", {
            get: function () {
                return !InJs.StringExtensions.isNullOrEmpty(this._initialUtterance);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Issues an Interpret request against the Interpretation service
         * @param utterance - The utterance to be sent to the service for interpretation
         * @param successHandler - A custom success handler. The use of this will cause the result to not be propagated to subscribed client controls
         * @param errorHandler - A custom error handler, required when using a custom success handler
         * @param parentActivity - Parent activity. In case there are no custom handlers this is considered to be the answer question activity
         * @param interpretOptions - Custom options for interpret.
         */
        InterpretService.prototype.interpretAsync = function (utterance, parentActivity, successHandler, errorHandler, interpretOptions, interpretRequestScope) {
            var responseHandler = this.createInterpretResponseHandler(successHandler, errorHandler);
            var interpretActivity = null;
            if (parentActivity) {
                // Do not nest interpret activities just reuse the original one
                if (parentActivity.activityType === 24 /* ICIN */) {
                    interpretActivity = parentActivity;
                }
                else {
                    interpretActivity = parentActivity.createChildActivity(24 /* ICIN */);
                }
            }
            // Cache the user utterance if the probe is pending and send it later when the probe succeeds
            if ((!this.configurationProvider.getIsReady() && !responseHandler) || this.probeRequestInProgress) {
                InJs.Tracing.verbose("Setting Interpretation Bridge Initial Utterance: " + utterance);
                this._initialUtterance = utterance;
                this._initialInterpretOptions = interpretOptions;
                InterpretService.endInterpretActivityIfPresent(this._initialUtteranceActivity, 0 /* Unknown */, InJs.ActivityErrors.UserAborted);
                this._initialUtteranceActivity = interpretActivity;
                return interpretActivity;
            }
            this.interpretAsyncInternal(utterance, interpretActivity, responseHandler, interpretOptions, interpretRequestScope);
            return interpretActivity;
        };
        InterpretService.prototype.abortAllInterpretRequests = function (clearCurrentResult) {
            for (var i = 0; i < this._interpretRequestQueue.length; i++) {
                var request = this._interpretRequestQueue[i];
                InterpretService.abortInterpretRequest(request);
            }
            if (clearCurrentResult === true && this._currentResponse) {
                this._currentResponse = null;
            }
        };
        InterpretService.prototype.abortAllInterpretRequestsUntilSession = function (requestId) {
            for (var i = 0; i < this._interpretRequestQueue.length; i++) {
                var request = this._interpretRequestQueue[i];
                if (request.requestId === requestId) {
                    break;
                }
                InterpretService.abortInterpretRequest(request);
            }
        };
        InterpretService.prototype.createInterpretResponseHandler = function (successHandler, errorHandler) {
            var retValue = null;
            if (typeof successHandler === 'function' && typeof errorHandler === 'function') {
                retValue = { success: successHandler, error: errorHandler };
            }
            return retValue;
        };
        InterpretService.prototype.interpretProbeAsyncInternal = function () {
            var _this = this;
            var cloudBiToken = InJs.InfoNavServiceConfigurationUtils.getSecurityToken(this.configurationProvider);
            InJs.AjaxUtility.callServiceWithCallbacks(this.configurationProvider.getClusterUri(), InterpretService.Name, InterpretService.InterpretProbeOperationName, function (data, textStatus, request) {
                var results = InJs.JavaScriptSerializer.deserialize(request.responseText);
                _this.onProbeRequestSuccess();
                InJs.Tracing.verbose('Ignoring successful probe request that came back from the server.', request.requestId);
            }, function (request, textStatus, error) {
                _this.onProbeRequestFailure(request);
            }, cloudBiToken, InJs.Utility.HttpGetMethod);
            this.raiseProbingRequestInProgress();
        };
        /**
         * Issues an Interpret request against the Interpretation service
         * @param utterance - The utterance to be sent to the service for interpretation
         * @param isProbeRequest - Whether the specified utterance is a probe warm  p reque t - the result of which will not be propagated to client controls
         * @param responseHandler - A custom response handler. The use of this will cause the result to not be propagated to subscribed client controls
         * @param interpretOptions - Custom options for interpret.
         */
        InterpretService.prototype.interpretAsyncInternal = function (utterance, interpretActivity, responseHandler, interpretOptions, interpretRequestScope) {
            var _this = this;
            InJs.Utility.throwIfNullOrUndefined(utterance, this, 'InterpretAsync', 'utterance');
            // determine if this is a custom request - for which currently subscribed controls will not be notified of
            // TODO 1657486: this logic is not great, and is a good example as to why we need to separate the service and event layers in this file
            if (utterance.length <= this.MinUtteranceLength) {
                if (!responseHandler) {
                    InJs.Tracing.verbose('Clearing current interpret result as the current utterance is shorter than the minimum allowed length');
                    this.raiseClearInterpretResultEvent(new InJs.ClearInterpretResultEventArgs(false, false));
                }
                InterpretService.endInterpretActivityIfPresent(interpretActivity, 0 /* Unknown */, InJs.ActivityErrors.UtteranceTooShort);
                return;
            }
            // check to see if the result has been cached - unless we're requesting modeling templates
            var cachedResult = this.getCachedResponse(utterance, interpretOptions);
            if (cachedResult) {
                var responseFromCache = new InJs.InterpretResponse(cachedResult.requestId, utterance, cachedResult.results);
                // Abort any pending interpret requests as we will be returning a cached result
                this.abortAllInterpretRequests();
                InterpretService.endInterpretActivityIfPresent(interpretActivity, 1 /* Success */);
                var successArgs = new InJs.InterpretSuccessEventArgs(responseFromCache, InJs.ClientActivity.getParentActivityIfAny(interpretActivity), this._currentOrderId++);
                if (!responseHandler) {
                    this.raiseInterpretIssuedEvent(new InJs.InterpretIssuedEventArgs(responseFromCache.requestId, InJs.ClientActivity.getParentActivityIfAny(interpretActivity)));
                    this.raiseInterpretSuccessEvent(successArgs);
                }
                else {
                    responseHandler.success(successArgs);
                }
                InJs.Tracing.verbose('Result for request returned from cache.', cachedResult.requestId);
                return;
            }
            var request = this.constructInterpretRequest(utterance, interpretOptions, interpretRequestScope);
            var args = { request: request };
            var options = {};
            options.type = InJs.Utility.HttpPostMethod;
            options.contentType = options.accepts = InJs.Utility.JsonContentType;
            options.dataType = InJs.Utility.JsonDataType;
            options.url = this.interpretRequestUrl;
            options.timeout = this.InterpretOperationTimeout;
            // Use the custom InfoNav serializer, which handles the specific conversions
            // of data types that C# needs.
            //
            options.data = InJs.JavaScriptSerializer.serialize(args);
            var pendingRequest = new PendingInterpretRequest();
            pendingRequest.request = request;
            pendingRequest.activityId = InJs.AppManager.current.activityId;
            pendingRequest.responseHandler = responseHandler;
            pendingRequest.interpretActivity = interpretActivity;
            options.beforeSend = function (request) {
                var requestId = InJs.HttpUtility.setCommonRequestHeaders(request);
                var cloudBiToken = InJs.InfoNavServiceConfigurationUtils.getSecurityToken(_this.configurationProvider);
                request.setRequestHeader(cloudBiToken.tokenHeader, cloudBiToken.tokenValue);
                pendingRequest.requestId = requestId;
                pendingRequest.executor = request;
                request.setRequestHeader(InJs.Utility.HttpAcceptHeader, InJs.Utility.JsonContentType);
                if (!responseHandler)
                    _this.raiseInterpretIssuedEvent(new InJs.InterpretIssuedEventArgs(pendingRequest.requestId, InJs.ClientActivity.getParentActivityIfAny(interpretActivity)));
                if (interpretActivity)
                    interpretActivity.addCorrelatedProperty(new InJs.CorrelatedProperty('interpretRequestId', requestId));
                InJs.Tracing.verbose('Issued new Interpret request to server.', requestId);
            };
            options.success = function (data, textStatus, request) {
                var results = _this.deserializeResponse(request.responseText);
                if (!pendingRequest.aborted) {
                    _this.onInterpretSuccess(results, pendingRequest, interpretActivity);
                }
                else if (pendingRequest.aborted) {
                    InJs.Tracing.verbose('Ignoring aborted request that came back from the server.', pendingRequest.requestId);
                }
            };
            options.error = function (request, textStatus, error) {
                var errorType = InJs.HttpUtility.getErrorInfo(pendingRequest.executor);
                if (textStatus === _this.JQueryTimedOutStatus || errorType === InterpretService.TimeoutExceptionErrorValue) {
                    pendingRequest.timedOut = true;
                }
                else if (textStatus === _this.JQueryAbortedStatus) {
                    pendingRequest.aborted = true;
                }
                _this.onInterpretError(pendingRequest, interpretActivity);
            };
            // remove all completed, aborted, or timed out requests
            this.compressInterpretRequestQueue();
            // store this request in the queue of requests
            this._interpretRequestQueue.push(pendingRequest);
            // now invoke the request
            $.ajax(options);
        };
        InterpretService.prototype.deserializeResponse = function (responseText) {
            // NOTE: we are currently using the existence of the _version property to signify the client expectations.
            if (this._version > 0)
                return JSON.parse(responseText);
            // PowerView silverlight control is very picky about the date formats it accepts, we need to use the MicrosoftAjax serializer
            // instead of the native JSON implementation to avoid issues. Specifically the JSON implementation will remove the backslash
            // transforming "\/Date(1234567890)\/" into "/Date(1234567890)/" which cannot be consumed by PowerView.
            return InJs.JavaScriptSerializer.deserialize(responseText);
        };
        InterpretService.prototype.getCachedResponse = function (utterance, options) {
            debug.assertValue(utterance, 'utterance');
            var cachedResult = this._resultCache[utterance];
            if (!cachedResult)
                return;
            if (InJs.EnumExtensions.hasFlag(options, 1 /* Data */) && (cachedResult.containsWarning(16 /* DataRetrievalFailed */) || cachedResult.containsWarning(32 /* DataRetrievalSkipped */)))
                return null;
            if (cachedResult.options !== options)
                return null;
            return cachedResult;
        };
        InterpretService.buildTransientLinguisticSchemaMap = function (map) {
            debug.assertValue(map, 'map');
            var databases = Object.getOwnPropertyNames(map), schemas;
            for (var i = 0; i < databases.length; ++i) {
                schemas = schemas || [];
                var database = databases[i];
                schemas.push({
                    Key: database,
                    Value: map[database].getTransientLinguisticSchema(),
                });
            }
            return schemas;
        };
        /**
         * Checks if the specified request is the latest request to be sent out
         */
        InterpretService.prototype._isLastRequest = function (request) {
            return this._interpretRequestQueue.length > 0 && this._interpretRequestQueue[this._interpretRequestQueue.length - 1].requestId === request.requestId;
        };
        /**
         * Removes all requests that either completed, aborted, or timed out.
         * This is done on the main JavaScript thread and not an async thread.
         * It also aborts earlier requests if we are maxing out on the number of parallel requests.
         */
        InterpretService.prototype.compressInterpretRequestQueue = function () {
            for (var i = 0; i < this._interpretRequestQueue.length; i++) {
                if (!InterpretService.isInProgressRequest(this._interpretRequestQueue[i])) {
                    this._interpretRequestQueue.splice(i--, 1);
                }
            }
            var count = 0;
            for (var i = this._interpretRequestQueue.length; i > 0; i--) {
                var request = this._interpretRequestQueue[i - 1];
                if (InterpretService.isInProgressRequest(request)) {
                    if (++count > this.MaxInterpretRequests) {
                        InterpretService.abortInterpretRequest(request);
                    }
                }
            }
        };
        InterpretService.prototype.onInterpretSuccess = function (results, pendingRequest, interpretActivity) {
            this._currentTimeoutRetryCount = 0;
            this._refreshAppMetadataAttempted = false;
            if (results) {
                var resultsHaveSchemaLoadingWarnings = results.some(function (result, index, results) {
                    return InJs.EnumExtensions.hasFlag(result.Warnings, 4 /* LinguisticSchemaIsStillLoading */);
                });
                // If any of the results had LinguisticSchemaIsStillLoading warnings we should attempt to retry the request and
                // not propagate it do the rest of the system
                if (this._currentSchemaLoadingRetryCount < this.MaxSchemaLoadingRetryRequests && resultsHaveSchemaLoadingWarnings) {
                    // If this was the latest request enqueue it again
                    if (this._isLastRequest(pendingRequest)) {
                        this._currentSchemaLoadingRetryCount++;
                        var successHandler = pendingRequest.responseHandler ? pendingRequest.responseHandler.success : null;
                        var errorHandler = pendingRequest.responseHandler ? pendingRequest.responseHandler.error : null;
                        this.interpretAsync(pendingRequest.request.Utterance, interpretActivity, successHandler, errorHandler);
                    }
                    else if (interpretActivity && !interpretActivity.completed) {
                        InterpretService.endInterpretActivityIfPresent(interpretActivity, 0 /* Unknown */, InJs.ActivityErrors.LinguisticSchemaStillLoading);
                    }
                }
                else {
                    InterpretService.endInterpretActivityIfPresent(interpretActivity, 1 /* Success */);
                    if (!resultsHaveSchemaLoadingWarnings) {
                        // Once we get a successful result reset the retry counter
                        this._currentSchemaLoadingRetryCount = 0;
                    }
                    var response = new InJs.InterpretResponse(pendingRequest.requestId, pendingRequest.request.Utterance, results);
                    var successArgs = new InJs.InterpretSuccessEventArgs(response, InJs.ClientActivity.getParentActivityIfAny(interpretActivity), this._currentOrderId++);
                    if (pendingRequest.responseHandler) {
                        pendingRequest.responseHandler.success(successArgs);
                    }
                    else {
                        this.raiseInterpretSuccessEvent(successArgs);
                    }
                    InJs.Tracing.verbose(InJs.StringExtensions.format('Interpret request completed successfully:\n{0}', JSON.stringify(results)), pendingRequest.requestId);
                    if (!response.isEmpty(true) && !response.hasErrors() && !response.containsPhrasingTemplates()) {
                        // cache the current result
                        var cachedResult = new CachedResult();
                        cachedResult.options = pendingRequest.request.Options;
                        cachedResult.requestId = pendingRequest.requestId;
                        cachedResult.results = results;
                        this._resultCache[pendingRequest.request.Utterance] = cachedResult;
                    }
                }
            }
            this.abortAllInterpretRequestsUntilSession(pendingRequest.requestId);
        };
        InterpretService.prototype.onInterpretError = function (pendingRequest, interpretActivity) {
            if (!pendingRequest.aborted) {
                var errorType = InJs.HttpUtility.getErrorInfo(pendingRequest.executor);
                if (!this._refreshAppMetadataAttempted && this._shouldReRequestAppMetadata(pendingRequest)) {
                    // Try re-resolving the app metadata once if we got an unable to resolve interpret scope exception
                    this._refreshAppMetadataAttempted = true;
                    this.configurationProvider.invalidate();
                    // Queue up the utterance again
                    var responseHandler = pendingRequest.responseHandler;
                    var successHandler = responseHandler ? responseHandler.success : null;
                    var errorHandler = responseHandler ? responseHandler.error : null;
                    this.interpretAsync(pendingRequest.request.Utterance, interpretActivity, successHandler, errorHandler);
                }
                else {
                    // Look for a compatible result but only in case this is the main interpret flow, not from a custom component
                    // Also don't look up the cache if this is for some reson auth denied
                    var compatibleResults = this.tryGetCompatibleResultsFromCache(pendingRequest.request.Utterance);
                    if (!pendingRequest.responseHandler && !InJs.HttpUtility.isForbiddenOrUnauthorized(pendingRequest.executor.status) && compatibleResults) {
                        InJs.ClientActivity.addErrorInfoIfPresent(interpretActivity, pendingRequest.executor);
                        InterpretService.endInterpretActivityIfPresent(interpretActivity, 2 /* SuccessDespiteError */, InJs.ActivityErrors.UsingCachedAutocompleteMatchOnInterpretError);
                        var response = new InJs.InterpretResponse(pendingRequest.requestId, pendingRequest.request.Utterance, compatibleResults);
                        var successArgs = new InJs.InterpretSuccessEventArgs(response, InJs.ClientActivity.getParentActivityIfAny(interpretActivity), this._currentOrderId++);
                        this.raiseInterpretSuccessEvent(successArgs);
                        InJs.Tracing.verbose(InJs.StringExtensions.format('Interpret request failed but found a compatible result in the cache:\n{0}', JSON.stringify(compatibleResults)), pendingRequest.requestId);
                    }
                    else {
                        InJs.ClientActivity.addErrorInfoIfPresent(interpretActivity, pendingRequest.executor);
                        InterpretService.endInterpretActivityIfPresent(interpretActivity, 3 /* Error */, InJs.ActivityErrors.InterpretError);
                        var currentTime = new Date();
                        var errorArgs = new InJs.InterpretErrorEventArgs(pendingRequest.activityId, pendingRequest.requestId, pendingRequest.timedOut, pendingRequest.executor.status, errorType, currentTime, InJs.ClientActivity.getParentActivityIfAny(interpretActivity));
                        if (pendingRequest.responseHandler) {
                            pendingRequest.responseHandler.error(errorArgs);
                        }
                        else {
                            this.raiseInterpretErrorEvent(errorArgs);
                        }
                    }
                }
                InJs.Tracing.warning(InJs.StringExtensions.format('Interpret request returned an error ({0} {1})', pendingRequest.executor.status.toString(), pendingRequest.executor.statusText, pendingRequest.requestId));
            }
            this.abortAllInterpretRequestsUntilSession(pendingRequest.requestId);
        };
        InterpretService.prototype.tryGetCompatibleResultsFromCache = function (utterance) {
            // (1) Find cached utterance that is the longest match to the provided utterance.
            //     Match is a cached utterance which starts with the provided utterance or vice versa
            //     Best match is the uterance that has the closest length. In case of a tie the later 
            //     will be picked with the assumption that this is what the user was just typing
            // (2) Filter the results of the found match to the ones that match their autocomplete
            // (3) Return the filtered list if any autocompletions matched
            if (!this._resultCache)
                return null;
            // (1)
            var bestMatch;
            for (var cachedUtterance in this._resultCache) {
                if (utterance.indexOf(cachedUtterance) === 0 || cachedUtterance.indexOf(utterance) === 0) {
                    if (!bestMatch || InJs.StringExtensions.getLengthDifference(utterance, cachedUtterance) <= InJs.StringExtensions.getLengthDifference(utterance, bestMatch))
                        bestMatch = cachedUtterance;
                }
            }
            if (!bestMatch)
                return null;
            // (2)
            var bestMatchResults = this._resultCache[bestMatch].results;
            var compatibleResults = new Array();
            for (var i = 0, len = bestMatchResults.length; i < len; i++) {
                if (bestMatchResults[i].CompletedUtterance && bestMatchResults[i].CompletedUtterance.Text.indexOf(utterance) === 0)
                    compatibleResults.push(bestMatchResults[i]);
            }
            // (3)
            if (compatibleResults.length)
                return compatibleResults;
            return null;
        };
        InterpretService.prototype._shouldReRequestAppMetadata = function (pendingRequest) {
            if (this._isLastRequest(pendingRequest)) {
                if (InJs.HttpUtility.isForbiddenOrUnauthorized(pendingRequest.executor.status)) {
                    return true;
                }
                var errorType = InJs.HttpUtility.getErrorInfo(pendingRequest.executor);
                return errorType === InterpretService.InfoNavUnableToResolveScopeErrorValue;
            }
            return false;
        };
        InterpretService.endInterpretActivityIfPresent = function (interpretActivity, activityEndedWith, error) {
            if (interpretActivity)
                interpretActivity.end(activityEndedWith, error);
        };
        InterpretService.prototype.constructInterpretRequest = function (utterance, interpretOptions, interpretRequestScope) {
            var request = {
                Version: this._version,
                Utterance: utterance,
                Scope: interpretRequestScope,
                TransientLinguisticSchemaMap: InterpretService.buildTransientLinguisticSchemaMap(this._interpretRequestTransientLinguisticSchemaMap),
            };
            if (interpretOptions) {
                request.Options = interpretOptions;
                if (this._currentResponse && InJs.EnumExtensions.hasFlag(request.Options, 1 /* Data */)) {
                    var result = this._currentResponse.result;
                    if (result && !result.isEmpty(false) && !InJs.EnumExtensions.hasFlag(result.source.Warnings, 16 /* DataRetrievalFailed */)) {
                        var command = result.source.Command;
                        var visualConfigurations = command.VisualConfigurations;
                        // TODO - 3161387: visual need to tell us which visual configuration was used to display.
                        request.LastQuery = {
                            Query: command.Query,
                            Binding: visualConfigurations && visualConfigurations.length > 0 ? visualConfigurations[0].DataShapeBinding : null,
                        };
                    }
                }
            }
            return request;
        };
        InterpretService.Name = 'interpretation';
        InterpretService.InterpretationServicePath = '/infonav/' + InterpretService.Name;
        InterpretService.InterpretOperationPath = '/interpret/';
        InterpretService.InterpretProbeOperationName = 'interpretprobe';
        InterpretService.TimeoutExceptionErrorValue = 'InterpretGatewayTimeoutException';
        InterpretService.InfoNavUnableToResolveScopeErrorValue = 'InfoNavUnableToResolveScopeException';
        return InterpretService;
    })(InJs.InfoNavClientService);
    InJs.InterpretService = InterpretService;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** This component communicates with the InfoNav management service endpoint */
    var FeaturedQuestionsService = (function (_super) {
        __extends(FeaturedQuestionsService, _super);
        function FeaturedQuestionsService(bridge, configurationProvider, appCache, spSiteId, spWebId) {
            _super.call(this, bridge, configurationProvider);
            this._appCache = appCache;
            this._spSiteId = spSiteId;
            this._spWebId = spWebId;
            this._requestQueue = [];
            this._isProcessingRequest = false;
        }
        FeaturedQuestionsService.prototype.getFeaturedQuestions = function () {
            var _this = this;
            var deferred = $.Deferred();
            var options = {};
            options.type = InJs.Utility.HttpGetMethod;
            options.url = InJs.Utility.urlCombine(this.configurationProvider.getClusterUri(), '/infonav/mgmt/featuredquestions/' + this._spSiteId + '/' + this._spWebId);
            options.contentType = InJs.Utility.JsonContentType;
            var requestId = '';
            options.beforeSend = function (request) {
                InJs.HttpUtility.setCommonRequestHeaders(request);
                request.setRequestHeader(InJs.HttpUtility.HttpInfoNavSpAccessTokenHeader, _this.configurationProvider.getManagementSecurityToken());
                request.setRequestHeader(InJs.Utility.HttpAcceptHeader, InJs.Utility.JsonContentType);
                requestId = request.requestId;
                InJs.Tracing.verbose('Requesting list of current featured questions from server...', requestId);
            };
            $.ajax(options).done(function (items, textStatus, request) {
                deferred.resolve(items);
                InJs.Tracing.verbose('Successfully received list of current featured questions from server.', requestId);
                // update the item cache so the InfoNav host information is current
                var updatedCacheData = _this._appCache.getData();
                updatedCacheData.featuredQuestions = items;
                _this._appCache.updateData(updatedCacheData);
            }).fail(function (request, textStatus, errorThrown) {
                InJs.Tracing.error('Failed to retrieve list of current featured questions from server.', requestId);
                deferred.reject(textStatus);
            });
            return deferred.promise();
        };
        FeaturedQuestionsService.prototype.addFeaturedQuestion = function (item) {
            var _this = this;
            var deferred = $.Deferred();
            var payload = { featuredQuestion: item };
            var options = {};
            options.type = InJs.Utility.HttpPutMethod;
            options.url = InJs.Utility.urlCombine(this.configurationProvider.getClusterUri(), '/infonav/mgmt/featuredquestions/' + this._spSiteId + '/' + this._spWebId + '/' + item.WorkbookIdentifier.ListId + '/' + item.WorkbookIdentifier.DocumentId);
            options.contentType = InJs.Utility.JsonContentType;
            options.data = JSON.stringify(payload);
            var requestId = '';
            options.beforeSend = function (request) {
                InJs.HttpUtility.setCommonRequestHeaders(request);
                request.setRequestHeader(InJs.HttpUtility.HttpInfoNavSpAccessTokenHeader, _this.configurationProvider.getManagementSecurityToken());
                request.setRequestHeader(InJs.Utility.HttpAcceptHeader, InJs.Utility.JsonContentType);
                requestId = request.requestId;
                InJs.Tracing.verbose('Sending request for adding featured question: ' + item.Utterance, requestId);
            };
            $.ajax(options).done(function (newItemId, textStatus, request) {
                deferred.resolve(newItemId);
                InJs.Tracing.verbose('Successfully added featured question:' + item.Utterance, requestId);
            }).fail(function (request, textStatus, errorThrown) {
                deferred.reject(textStatus);
                InJs.Tracing.error('Unable to process featured question addition for :' + item.Utterance, requestId);
            });
            return deferred.promise();
        };
        FeaturedQuestionsService.prototype.updateFeaturedQuestions = function (items) {
            var _this = this;
            var deferred = $.Deferred();
            var payload = { featuredQuestions: items };
            var options = {};
            options.type = InJs.Utility.HttpPostMethod;
            options.url = InJs.Utility.urlCombine(this.configurationProvider.getClusterUri(), '/infonav/mgmt/featuredquestions/' + this._spSiteId + '/' + this._spWebId);
            options.contentType = InJs.Utility.JsonContentType;
            options.data = JSON.stringify(payload);
            var requestId = '';
            options.beforeSend = function (request) {
                InJs.HttpUtility.setCommonRequestHeaders(request);
                request.setRequestHeader(InJs.HttpUtility.HttpInfoNavSpAccessTokenHeader, _this.configurationProvider.getManagementSecurityToken());
                request.setRequestHeader(InJs.Utility.HttpAcceptHeader, InJs.Utility.JsonContentType);
                requestId = request.requestId;
                InJs.Tracing.verbose('Sending request for updating featured questions', requestId);
            };
            $.ajax(options).done(function (newItemId, textStatus, request) {
                deferred.resolve(newItemId);
                InJs.Tracing.verbose('Successfully updated featured questions', requestId);
            }).fail(function (request, textStatus, errorThrown) {
                deferred.reject(textStatus);
                InJs.Tracing.error('Unable to process featured question update', requestId);
            });
            return deferred.promise();
        };
        FeaturedQuestionsService.prototype.deleteFeaturedQuestion = function (item) {
            var _this = this;
            var deferred = $.Deferred();
            var options = {};
            options.type = InJs.Utility.HttpDeleteMethod;
            options.url = InJs.Utility.urlCombine(this.configurationProvider.getClusterUri(), '/infonav/mgmt/featuredquestions/' + this._spSiteId + '/' + this._spWebId + '/' + item.ItemId);
            var requestId = '';
            options.beforeSend = function (request) {
                InJs.HttpUtility.setCommonRequestHeaders(request);
                request.setRequestHeader(InJs.HttpUtility.HttpInfoNavSpAccessTokenHeader, _this.configurationProvider.getManagementSecurityToken());
                request.setRequestHeader(InJs.Utility.HttpAcceptHeader, InJs.Utility.JsonContentType);
                requestId = request.requestId;
                InJs.Tracing.verbose('Sending request for removing featured question: ' + item.Utterance, requestId);
            };
            $.ajax(options).done(function (newItemId, textStatus, request) {
                deferred.resolve();
                InJs.Tracing.verbose('Successfully removed featured question:' + item.Utterance, requestId);
            }).fail(function (request, textStatus, errorThrown) {
                deferred.reject(textStatus);
                InJs.Tracing.error('Unable to process featured question deletion for :' + item.Utterance, requestId);
            });
            return deferred.promise();
        };
        FeaturedQuestionsService.prototype.createWorkbookIdentifier = function (item, dataSourceProperties) {
            InJs.Utility.throwIfNullOrUndefined(dataSourceProperties, this, 'createWorkbookIdentifier', 'dataSourceProperties');
            InJs.Utility.throwIfNullOrUndefined(dataSourceProperties.sharePointDocument, this, 'createWorkbookIdentifier', 'dataSourceProperties.sharePointDocument');
            var workbookIdentifier = {
                SiteId: this._spSiteId,
                WebId: this._spWebId,
                ListId: dataSourceProperties.sharePointDocument.ListId,
                DocumentId: dataSourceProperties.sharePointDocument.DocumentId
            };
            return workbookIdentifier;
        };
        return FeaturedQuestionsService;
    })(InJs.InfoNavClientService);
    InJs.FeaturedQuestionsService = FeaturedQuestionsService;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** Responsible for interaction with the InfoNav Usage endpoint. */
    var UsageService = (function () {
        function UsageService(config) {
            debug.assertValue(config, 'config');
            this._config = config;
            this._firstUsage = true;
        }
        /** Uploads usage information. */
        UsageService.prototype.update = function (utterances) {
            debug.assertValue(utterances, 'utterances');
            debug.assert(utterances.length > 0, 'utterances.length');
            var payload = {
                UtteranceData: utterances,
            };
            if (this._firstUsage) {
                payload.FirstUsage = true;
                this._firstUsage = false;
            }
            return InJs.AjaxUtility.callService(this._config.getClusterUri(), UsageService.Name, 'update', InJs.InfoNavServiceConfigurationUtils.getToken(this._config, 1 /* Default */), InJs.Utility.HttpPostMethod, { request: payload, }, 1 /* SuppressResponseDataType */);
        };
        /** Queries the usage database with the specified command. */
        UsageService.prototype.query = function (database, command) {
            debug.assertValue(database, 'database');
            debug.assertValue(command, 'command');
            var payload = {
                VirtualServerName: database.virtualServer,
                DatabaseName: database.database,
                Command: command,
            };
            return InJs.AjaxUtility.callService(this._config.getClusterUri(), UsageService.Name, 'query', InJs.InfoNavServiceConfigurationUtils.getToken(this._config, 1 /* Default */), InJs.Utility.HttpPostMethod, { request: payload, });
        };
        UsageService.Name = 'usage';
        return UsageService;
    })();
    InJs.UsageService = UsageService;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** Class defining controller operations */
    var ControllerOperationDefinition = (function () {
        /**
         * Creates a new instance of ControllerOperationDefinition
         * @param {name} the operation name
         * @param {parameters} operation parameters
         * @param {callback} operation callback
         */
        function ControllerOperationDefinition(name, callback, parameters) {
            InJs.Utility.throwIfNullOrUndefined(name, this, 'ctor', 'name');
            InJs.Utility.throwIfNullOrUndefined(callback, this, 'ctor', 'callback');
            this._name = name;
            this._signature = this.createSignature(name, parameters);
            this._callback = this.protectOperation(callback, parameters);
        }
        /** Initializes the method signature */
        ControllerOperationDefinition.prototype.createSignature = function (name, parameters) {
            var signature = name + '(';
            if (parameters) {
                for (var i = 0, len = parameters.length; i < len; i++) {
                    signature += parameters[i].typeName;
                    if (i < parameters.length - 1) {
                        signature += ', ';
                    }
                }
            }
            signature += ')';
            return signature;
        };
        Object.defineProperty(ControllerOperationDefinition.prototype, "name", {
            /** Gets the operation name */
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ControllerOperationDefinition.prototype, "callback", {
            /** Gets the operation callback */
            get: function () {
                return this._callback;
            },
            enumerable: true,
            configurable: true
        });
        /** Wraps operation in argument length and type checks */
        ControllerOperationDefinition.prototype.protectOperation = function (callback, parameters) {
            var _this = this;
            return function () {
                if (parameters) {
                    if (arguments.length !== parameters.length) {
                        InJs.Utility.throwException(InJs.Errors.invalidOperation('Supplied parameters do not match any overload for "' + _this._signature + '"'));
                    }
                    else {
                        for (var i = 0, len = parameters.length; i < len; i++) {
                            if (!parameters[i].verifyType(arguments[i])) {
                                InJs.Utility.throwException(InJs.Errors.invalidOperation('Argument ' + i + ' type does not match target signature "' + _this._signature + '"'));
                            }
                        }
                    }
                }
                else if (arguments && arguments.length) {
                    InJs.Utility.throwException(InJs.Errors.invalidOperation('Supplied parameters do not match any overload for "' + _this._signature + '"'));
                }
                return callback.apply(_this, arguments);
            };
        };
        return ControllerOperationDefinition;
    })();
    InJs.ControllerOperationDefinition = ControllerOperationDefinition;
    /** Base class for all operation option definition types */
    var OperationOptionDefinition = (function () {
        /**
         * Creates a new instance of OperationOptionDefinition
         */
        function OperationOptionDefinition() {
            this.virtualConstructor();
        }
        /** The purpose of this method is to disallow construction of this abstract object */
        OperationOptionDefinition.prototype.virtualConstructor = function () {
            InJs.Utility.throwException(InJs.Errors.pureVirtualMethodException('OptionDefinition', 'constructor'));
        };
        Object.defineProperty(OperationOptionDefinition.prototype, "typeName", {
            /** Gets the operation option type */
            get: function () {
                InJs.Utility.throwException(InJs.Errors.pureVirtualMethodException('OptionDefinition', 'typeName'));
                return null;
            },
            enumerable: true,
            configurable: true
        });
        /** Method that will verify the provided value */
        OperationOptionDefinition.prototype.verifyType = function (value) {
            InJs.Utility.throwException(InJs.Errors.pureVirtualMethodException('OptionDefinition', 'decorateSetter'));
            return null;
        };
        return OperationOptionDefinition;
    })();
    InJs.OperationOptionDefinition = OperationOptionDefinition;
    /** Operation option definition for boolean values */
    var BooleanOperationOptionDefinition = (function (_super) {
        __extends(BooleanOperationOptionDefinition, _super);
        function BooleanOperationOptionDefinition() {
            _super.apply(this, arguments);
        }
        /** Implement to state that this is no longer an abstract class */
        BooleanOperationOptionDefinition.prototype.virtualConstructor = function () {
            // Nothing to do here
        };
        Object.defineProperty(BooleanOperationOptionDefinition.prototype, "typeName", {
            /** Gets the operation option type */
            get: function () {
                return 'boolean';
            },
            enumerable: true,
            configurable: true
        });
        /** Verifier checking that the provided value is a boolean */
        BooleanOperationOptionDefinition.prototype.verifyType = function (value) {
            return InJs.Utility.isBoolean(value);
        };
        return BooleanOperationOptionDefinition;
    })(OperationOptionDefinition);
    InJs.BooleanOperationOptionDefinition = BooleanOperationOptionDefinition;
    /** Operation option definition for string values */
    var StringOperationOptionDefinition = (function (_super) {
        __extends(StringOperationOptionDefinition, _super);
        function StringOperationOptionDefinition() {
            _super.apply(this, arguments);
        }
        /** Implement to state that this is no longer an abstract class */
        StringOperationOptionDefinition.prototype.virtualConstructor = function () {
            // Nothing to do here
        };
        Object.defineProperty(StringOperationOptionDefinition.prototype, "typeName", {
            /** Gets the operation option type */
            get: function () {
                return 'string';
            },
            enumerable: true,
            configurable: true
        });
        /** Verifier checking that the provided value is a string */
        StringOperationOptionDefinition.prototype.verifyType = function (value) {
            return InJs.Utility.isString(value);
        };
        return StringOperationOptionDefinition;
    })(OperationOptionDefinition);
    InJs.StringOperationOptionDefinition = StringOperationOptionDefinition;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** Base class for all controller option definition types */
    var ControllerOptionDefinition = (function () {
        /**
         * Creates a new instance of ControllerOptionDefinition
         * @param {name} option name
         * @param {getter} option getter method
         * @param {setter} option setter method
         * @param {defaultValue} the default value. If not provided parameter is assumed to be mandatory
         */
        function ControllerOptionDefinition(name, getter, setter, allowsNull, defaultValue) {
            this.virtualConstructor();
            InJs.Utility.throwIfNullOrEmptyString(name, this, 'ctor', 'name');
            InJs.Utility.throwIfNullOrUndefined(getter, this, 'ctor', 'getter');
            InJs.Utility.throwIfNullOrUndefined(setter, this, 'ctor', 'setter');
            this._name = name;
            this._getter = getter;
            this._setter = this.protectSetter(setter);
            this._allowsNull = allowsNull ? allowsNull : false;
            this._defaultValue = defaultValue;
        }
        Object.defineProperty(ControllerOptionDefinition.prototype, "name", {
            /** Gets the option name */
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ControllerOptionDefinition.prototype, "getter", {
            /** Gets the option getter method */
            get: function () {
                return this._getter;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ControllerOptionDefinition.prototype, "setter", {
            /** Gets the option setter method */
            get: function () {
                return this._setter;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ControllerOptionDefinition.prototype, "allowsNull", {
            /** Indicates whether the option allows null values */
            get: function () {
                return this._allowsNull;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ControllerOptionDefinition.prototype, "defaultValue", {
            /** Gets the default value */
            get: function () {
                return this._defaultValue;
            },
            enumerable: true,
            configurable: true
        });
        /** The purpose of this method is to disallow construction of this abstract object */
        ControllerOptionDefinition.prototype.virtualConstructor = function () {
            InJs.Utility.throwException(InJs.Errors.pureVirtualMethodException('OptionDefinition', 'constructor'));
        };
        /** Method that will decorate the setter with necessary type checks */
        ControllerOptionDefinition.prototype.protectSetter = function (setter) {
            InJs.Utility.throwException(InJs.Errors.pureVirtualMethodException('OptionDefinition', 'decorateSetter'));
            return null;
        };
        return ControllerOptionDefinition;
    })();
    InJs.ControllerOptionDefinition = ControllerOptionDefinition;
    /** Controller option definition for boolean values */
    var BooleanControllerOptionDefinition = (function (_super) {
        __extends(BooleanControllerOptionDefinition, _super);
        /** Creates a new instance of BooleanOptionDefinition */
        function BooleanControllerOptionDefinition(name, getter, setter, allowsNull, defaultValue) {
            _super.call(this, name, getter, setter, allowsNull, defaultValue);
        }
        /** Implement to state that this is no longer an abstract class */
        BooleanControllerOptionDefinition.prototype.virtualConstructor = function () {
            // Nothing to do here
        };
        /** Setter decorator checking that the provided value is a boolean */
        BooleanControllerOptionDefinition.prototype.protectSetter = function (setter) {
            var _this = this;
            return function (value) {
                InJs.Utility.throwIfNotTrue(InJs.Utility.isBoolean(value) || (_this.allowsNull && value === null), _this, 'setter', 'value');
                setter(value);
            };
        };
        return BooleanControllerOptionDefinition;
    })(ControllerOptionDefinition);
    InJs.BooleanControllerOptionDefinition = BooleanControllerOptionDefinition;
    /** Controller option definition for string values */
    var StringControllerOptionDefinition = (function (_super) {
        __extends(StringControllerOptionDefinition, _super);
        /** Creates a new instance of StringOptionDefinition */
        function StringControllerOptionDefinition(name, getter, setter, allowsNull, defaultValue) {
            _super.call(this, name, getter, setter, allowsNull, defaultValue);
        }
        /** Implement to state that this is no longer an abstract class */
        StringControllerOptionDefinition.prototype.virtualConstructor = function () {
            // Nothing to do here
        };
        /** Setter decorator checking that the provided value is a string */
        StringControllerOptionDefinition.prototype.protectSetter = function (setter) {
            var _this = this;
            return function (value) {
                InJs.Utility.throwIfNotTrue(InJs.Utility.isString(value) || (_this.allowsNull && value === null), _this, 'setter', 'value');
                setter(value);
            };
        };
        return StringControllerOptionDefinition;
    })(ControllerOptionDefinition);
    InJs.StringControllerOptionDefinition = StringControllerOptionDefinition;
    /** Controller option definition for ConnectionGroup values */
    var ConnectionGroupControllerOptionDefinition = (function (_super) {
        __extends(ConnectionGroupControllerOptionDefinition, _super);
        /** Creates a new instance of ConnectionGroupOptionDefinition */
        function ConnectionGroupControllerOptionDefinition(name, getter, setter, allowsNull, defaultValue) {
            _super.call(this, name, getter, setter, allowsNull, defaultValue);
        }
        /** Implement to state that this is no longer an abstract class */
        ConnectionGroupControllerOptionDefinition.prototype.virtualConstructor = function () {
            // Nothing to do here
        };
        /** Setter decorator checking that the provided value is a ConnectionGroup */
        ConnectionGroupControllerOptionDefinition.prototype.protectSetter = function (setter) {
            var _this = this;
            return function (value) {
                InJs.Utility.throwIfNotTrue((typeof value) === 'object', _this, 'setter', 'value');
                InJs.Utility.throwIfNotTrue((value instanceof InJs.ConnectionGroup) || (_this.allowsNull && value === null), _this, 'setter', 'value');
                setter(value);
            };
        };
        return ConnectionGroupControllerOptionDefinition;
    })(ControllerOptionDefinition);
    InJs.ConnectionGroupControllerOptionDefinition = ConnectionGroupControllerOptionDefinition;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** Factory for creating widgets */
    var WidgetFactory = (function () {
        function WidgetFactory() {
        }
        /** Creates a JQuery extension widget */
        WidgetFactory.defineJQueryWidget = function (widgetName, constructor) {
            InJs.Utility.throwIfNullOrEmptyString(widgetName, this, 'createController', 'widgetName');
            InJs.Utility.throwIfNullOrUndefined(constructor, this, 'createController', 'constructor');
            if ($.fn[widgetName]) {
                InJs.Utility.throwException(InJs.Errors.invalidOperation('Cannot register widget "' + name + '" because this identifier already exists on JQuery prototype'));
            }
            $.fn[widgetName] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                if (!this.length || args.length === 0) {
                    // With no arguments or no elements we'll just passtrough
                    return this;
                }
                else if (args.length === 1 && (typeof args[0] === 'object')) {
                    // If there is a single argument and it is an object the user is 
                    // trying to construct the widget
                    WidgetFactory.createController(this, widgetName, constructor, args[0]);
                    return this;
                }
                else if (args.length === 2 && args[0] === 'option' && InJs.Utility.isString(args[1])) {
                    // If there are two arguments and first is 'option' then this 
                    // is a getter and we should return the option value
                    return WidgetFactory.getWidgetControllerOption(this[0], widgetName, args[1]);
                }
                else if (args.length === 3 && args[0] === 'option' && InJs.Utility.isString(args[1])) {
                    // If there are three arguments and first is 'option' then this 
                    // is a setter and we should set an option value
                    WidgetFactory.setWidgetControllerOption(this[0], widgetName, args[1], args[2]);
                    return this;
                }
                else if (args.length > 0 && InJs.Utility.isString(args[0])) {
                    // In all other scenarios where there is at least one argument we assume 
                    // that this is a method call and the rest of the arguments are parameters
                    return WidgetFactory.invokeMethod(this[0], widgetName, args[0], args.slice(1));
                }
                else {
                    InJs.Utility.throwException(InJs.Errors.invalidOperation('Invalid parameter set provided'));
                }
            };
        };
        /** Creates a widget controller on the target element */
        WidgetFactory.createController = function (hostElement, widgetName, constructor, options) {
            InJs.Utility.throwIfNullOrUndefined(hostElement, this, 'createController', 'hostElement');
            InJs.Utility.throwIfNullOrUndefined(options, this, 'createController', 'options');
            var widgetController = hostElement[0][widgetName];
            if (widgetController) {
                if (widgetController instanceof InJs.InfoNavController) {
                    InJs.Utility.throwException(InJs.Errors.invalidOperation('Widget "' + widgetName + '" already exists on the target "' + hostElement + '" element'));
                }
                else {
                    InJs.Utility.throwException(InJs.Errors.invalidOperation('Member "' + widgetName + '" already exists on the target "' + hostElement + '" element'));
                }
            }
            hostElement[0][widgetName] = constructor(hostElement, options);
        };
        /** Gets the specified WidgetController option */
        WidgetFactory.getWidgetControllerOption = function (hostElement, widgetName, optionName) {
            var controller = WidgetFactory.getWidgetController(hostElement, widgetName);
            if (!controller.options || (controller.options[optionName] === null) || (controller.options[optionName] === undefined))
                InJs.Utility.throwException(InJs.Errors.invalidOperation('The widget "' + widgetName + '" does not have option "' + optionName + '"'));
            return controller.options[optionName];
        };
        /** Gets the specified WidgetController option */
        WidgetFactory.setWidgetControllerOption = function (hostElement, widgetName, optionName, optionValue) {
            var controller = WidgetFactory.getWidgetController(hostElement, widgetName);
            if (!controller.options || (controller.options[optionName] === null) || (controller.options[optionName] === undefined))
                InJs.Utility.throwException(InJs.Errors.invalidOperation('The widget "' + widgetName + '" does not have option "' + optionName + '"'));
            controller.options[optionName] = optionValue;
        };
        /** Invokes the specified method on the widget controller */
        WidgetFactory.invokeMethod = function (hostElement, widgetName, methodName, args) {
            var controller = WidgetFactory.getWidgetController(hostElement, widgetName);
            if (!controller[methodName])
                InJs.Utility.throwException(InJs.Errors.invalidOperation('The widget "' + widgetName + '" does not have operation "' + methodName + '"'));
            return controller[methodName].apply(this, args);
        };
        /** Retrieves the bound InterpretationClientControl controller */
        WidgetFactory.getWidgetController = function (target, widgetName) {
            InJs.Utility.throwIfNullOrUndefined(target, this, 'getController', 'target');
            var widgetController = target[widgetName];
            if (!widgetController || !(widgetController instanceof InJs.InfoNavController))
                InJs.Utility.throwException(InJs.Errors.invalidOperation('Widget "' + widgetName + '" does not exist on the target "' + target + '" element'));
            return widgetController;
        };
        return WidgetFactory;
    })();
    InJs.WidgetFactory = WidgetFactory;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /**
     * Represents a group of InfoNav client side controls and services
     * communicating with each other and a cloud service
     */
    var ConnectionGroup = (function (_super) {
        __extends(ConnectionGroup, _super);
        function ConnectionGroup(options, pageLoadActivityType) {
            var _this = this;
            _super.call(this);
            InJs.Utility.throwIfNullOrUndefined(options, this, 'ConnectionGroup', 'options');
            InJs.Utility.throwIfNullOrUndefined(options.name, this, 'ConnectionGroup', 'options.name');
            InJs.Utility.throwIfNotTrue(InJs.Utility.isString(options.name), this, 'ConnectionGroup', 'Utility.isString(options.name)');
            this._isReady = false;
            this._name = options.name;
            this._bridge = options.bridge || new InJs.InfoNavEventBridge();
            this._modalDialogService = options.modalDialog || new InJs.ModalDialog();
            this._modalDialogService.registerOnConnectionGroup(this);
            this._notificationService = options.notificationControl || new InJs.Notifications.NotificationControl();
            this._notificationService.registerOnConnectionGroup(this);
            this._interpretService = options.interpretService || new InJs.InterpretService(this._bridge, this, options.version);
            this._usageService = options.usageService || new InJs.UsageServiceContainer(this._bridge, this);
            if (options.telemetryServiceFactory) {
                this._telemetryService = options.telemetryServiceFactory.createTelemetryService(this._bridge, this);
            }
            else {
                this._telemetryService = new InJs.TelemetryService(this._bridge, this);
            }
            // BrowserHandler is an optional service that will be by default present if the 
            // browser supports HTML5 history object. Specific connection group types can also 
            // override shouldUpdateBrowserLocation to disable BrowserHandler in case it is not
            // appropriate in their scenario.
            if (this.shouldUpdateBrowserLocation())
                this._browserHandlerService = options.browserHandlerService || new InJs.BrowserHandler(this._bridge, this, this._interpretService, this.initialUtterance);
            // TODO - 2130441: This will currently only work if the QB is included as well because 
            // that's where all the utterance interpretation logic, state and error management resides.
            this._defineOperation(new InJs.ControllerOperationDefinition(ConnectionGroup.InterpretOperationName, function (utterance) {
                _this.bridge.changeUserUtterance(utterance);
            }, [
                new InJs.StringOperationOptionDefinition()
            ]));
            if (pageLoadActivityType)
                this._pageLoadActivity = this.startPageLoadActivity(pageLoadActivityType);
            var bridge = this.bridge;
            bridge.attach(InJs.Events.ChangeUserUtteranceEventName, function () { return _this.onQuestionBoxTextChanged(); });
            bridge.attach(ConnectionGroup.TextChangedEventName, function () { return _this.onQuestionBoxTextChanged(); });
            bridge.attach(InJs.Events.InterpretIssuedEventName, function (eventObject, data) {
                _this.onInterpretIssued(eventObject, data);
            });
            bridge.attach(InJs.Events.InterpretSuccessEventName, function (eventObject, data) {
                _this.onInterpretSuccess(eventObject, data);
            });
            bridge.attach(InJs.Events.InterpretErrorEventName, function (eventObject, data) {
                _this.onInterpretError(eventObject, data);
            });
            bridge.attach(InJs.Events.InterpretRetryCountExceededEventName, function (eventObject, data) {
                _this.onInterpretRetryCountExceeded(eventObject, data);
            });
            bridge.attach(InJs.Events.ConnectionGroupInvalidatedEventName, function (eventObject, data) {
                _this.onInvalidated(eventObject, data);
            });
        }
        Object.defineProperty(ConnectionGroup.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        // IInfoNavServiceConfiguration
        ConnectionGroup.prototype.getIsReady = function () {
            return this._isReady;
        };
        ConnectionGroup.prototype.getClusterUri = function () {
            InJs.Utility.throwException(InJs.Errors.pureVirtualMethodException("ConnectionGroup", "clusterUri"));
            return null;
        };
        ConnectionGroup.prototype.getSecurityToken = function () {
            InJs.Utility.throwException(InJs.Errors.pureVirtualMethodException("ConnectionGroup", "securityToken"));
            return null;
        };
        ConnectionGroup.prototype.getManagementSecurityToken = function () {
            InJs.Utility.throwException(InJs.Errors.pureVirtualMethodException("ConnectionGroup", "managementSecurityToken"));
            return null;
        };
        ConnectionGroup.prototype.getSpoContextToken = function () {
            InJs.Utility.throwException(InJs.Errors.pureVirtualMethodException("ConnectionGroup", "spoContextToken"));
            return null;
        };
        ConnectionGroup.prototype.getIsUsageReportingEnabled = function () {
            InJs.Utility.throwException(InJs.Errors.pureVirtualMethodException("ConnectionGroup", "isUsageReportingEnabled"));
            return null;
        };
        ConnectionGroup.prototype.getSecurityTokenKind = function () {
            return 1 /* Default */;
        };
        ConnectionGroup.prototype.invalidate = function (parentActivity) {
            var _this = this;
            this._isReady = false;
            this.bridge.notifyConnectionGroupInvalidated();
            var refreshMetadataActivity = this._refreshMetadataInternal(parentActivity);
            if (refreshMetadataActivity && parentActivity && parentActivity === this._pageLoadActivity) {
                refreshMetadataActivity.onCompleted(function (getAppMetadataActivity) {
                    // If we are visualizing an initial utterance then don't end the page load activity just yet
                    // but wait for the initial visualization activity to end which will end the visualization 
                    // on page load activity as well. This is done withing the QuestionBox as it is currently 
                    // responsible for processing the initial utterance
                    if (getAppMetadataActivity.activityEndResult === 1 /* Success */ && _this._visualizationOnPageLoadActivity && !_this._visualizationOnPageLoadActivity.completed) {
                        return;
                    }
                    _this._pageLoadActivity.end(getAppMetadataActivity.activityEndResult, getAppMetadataActivity.error);
                });
            }
            return refreshMetadataActivity;
        };
        Object.defineProperty(ConnectionGroup.prototype, "bridge", {
            // Always available group services - Safe to consume at any time
            get: function () {
                return this._bridge;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConnectionGroup.prototype, "interpretService", {
            get: function () {
                return this._interpretService;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConnectionGroup.prototype, "modalDialogService", {
            get: function () {
                return this._modalDialogService;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConnectionGroup.prototype, "notificationService", {
            get: function () {
                return this._notificationService;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConnectionGroup.prototype, "telemetryService", {
            get: function () {
                return this._telemetryService;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConnectionGroup.prototype, "usageService", {
            get: function () {
                return this._usageService;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConnectionGroup.prototype, "browserHandlerService", {
            // Optional group services - Consumers need to check existense before using these
            get: function () {
                return this._browserHandlerService;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConnectionGroup.prototype, "featuredQuestionsService", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        // Abstract group options and operations - Specific ConnectionGroup implementations need to provide these
        /** Implementing class refreshes metadata and invokes _raiseReadyEvent when done */
        ConnectionGroup.prototype._refreshMetadataInternal = function (parentActivity) {
            InJs.Utility.throwException(InJs.Errors.pureVirtualMethodException("ConnectionGroup", "_refreshMetadataInternal"));
            return null;
        };
        Object.defineProperty(ConnectionGroup.prototype, "appCache", {
            get: function () {
                InJs.Utility.throwException(InJs.Errors.pureVirtualMethodException("ConnectionGroup", "appCache"));
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConnectionGroup.prototype, "generalHelpPageUrl", {
            get: function () {
                InJs.Utility.throwException(InJs.Errors.pureVirtualMethodException("ConnectionGroup", "generalHelpPageUrl"));
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConnectionGroup.prototype, "globalServiceClusterUri", {
            get: function () {
                InJs.Utility.throwException(InJs.Errors.pureVirtualMethodException("ConnectionGroup", "globalServiceClusterUri"));
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConnectionGroup.prototype, "helpContentBaseUrl", {
            get: function () {
                InJs.Utility.throwException(InJs.Errors.pureVirtualMethodException("ConnectionGroup", "helpContentBaseUrl"));
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConnectionGroup.prototype, "isRuntimeModelingEnabled", {
            get: function () {
                InJs.Utility.throwException(InJs.Errors.pureVirtualMethodException("ConnectionGroup", "isRuntimeModelingEnabled"));
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConnectionGroup.prototype, "isSamplesOnlyModeEnabled", {
            get: function () {
                InJs.Utility.throwException(InJs.Errors.pureVirtualMethodException("ConnectionGroup", "isSamplesOnlyModeEnabled"));
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConnectionGroup.prototype, "isUserAdmin", {
            get: function () {
                InJs.Utility.throwException(InJs.Errors.pureVirtualMethodException("ConnectionGroup", "isUserAdmin"));
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConnectionGroup.prototype, "resourcesUrl", {
            get: function () {
                InJs.Utility.throwException(InJs.Errors.pureVirtualMethodException("ConnectionGroup", "resourcesUrl"));
                return null;
            },
            enumerable: true,
            configurable: true
        });
        ConnectionGroup.prototype.shouldUpdateBrowserLocation = function () {
            return typeof history.pushState === 'function' && typeof history.replaceState === 'function';
        };
        Object.defineProperty(ConnectionGroup.prototype, "userPermissions", {
            get: function () {
                InJs.Utility.throwException(InJs.Errors.pureVirtualMethodException("ConnectionGroup", "WebPermissions"));
                return 0 /* None */;
            },
            enumerable: true,
            configurable: true
        });
        ConnectionGroup.prototype.commitModelChanges = function () {
            InJs.Utility.throwException(InJs.Errors.pureVirtualMethodException("ConnectionGroup", "commitModelChanges"));
            return null;
        };
        ConnectionGroup.prototype.generateSampleUtterance = function (authoredRelationship, onSuccess, onError) {
            InJs.Utility.throwException(InJs.Errors.pureVirtualMethodException("ConnectionGroup", "generateSampleUtterance"));
        };
        ConnectionGroup.prototype.getCommitModelStatus = function (onSuccess, onError) {
            InJs.Utility.throwException(InJs.Errors.pureVirtualMethodException("ConnectionGroup", "getCommitModelStatus"));
        };
        ConnectionGroup.prototype.getWorkbookPublishStatus = function (onSuccess, onError) {
            InJs.Utility.throwException(InJs.Errors.pureVirtualMethodException("ConnectionGroup", "getWorkbookPublishStatus"));
        };
        ConnectionGroup.prototype.getUpdatedPublishedWorkbookETag = function () {
            InJs.Utility.throwException(InJs.Errors.pureVirtualMethodException("ConnectionGroup", "getUpdatedPublishedWorkbookETag"));
        };
        ConnectionGroup.prototype.getDataSourceProperties = function (modelName) {
            InJs.Utility.throwException(InJs.Errors.pureVirtualMethodException("ConnectionGroup", "getDataSourceProperties"));
            return null;
        };
        ConnectionGroup.prototype.getListOfDatabaseNames = function () {
            InJs.Utility.throwException(InJs.Errors.pureVirtualMethodException("ConnectionGroup", "getListOfModelNames"));
            return null;
        };
        ConnectionGroup.prototype.getModelingMetadata = function (modelingContext, onSuccess, onError) {
            InJs.Utility.throwException(InJs.Errors.pureVirtualMethodException("ConnectionGroup", "getModelingMetadata"));
        };
        Object.defineProperty(ConnectionGroup.prototype, "absoluteReportServerUrl", {
            // Defaulted group options and operations - Specific ConnectionGroup implementations have the option to customize these
            get: function () {
                return InJs.Utility.urlCombine(this.getClusterUri(), ConnectionGroup.ReportServerPath);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConnectionGroup.prototype, "autoAdjustResultsControlVerticalOffset", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConnectionGroup.prototype, "featuredQuestions", {
            get: function () {
                return new Array();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConnectionGroup.prototype, "initialClusterUri", {
            get: function () {
                return InJs.AppManager.current.initialClusterUri;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConnectionGroup.prototype, "initialUtterance", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConnectionGroup.prototype, "visualizationOnPageLoadActivity", {
            get: function () {
                return this._visualizationOnPageLoadActivity;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConnectionGroup.prototype, "isGeocodingEnabled", {
            get: function () {
                if (!this.getIsReady()) {
                    // We allow checking this flag only after the connection group is ready
                    InJs.Utility.throwException(InJs.Errors.invalidOperation("isGeocodingEnabled should be invoked after the connection group is ready"));
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        ConnectionGroup.prototype.getFeaturedQuestions = function (dbName) {
            var featuredQuestionsList = [];
            return featuredQuestionsList;
        };
        ConnectionGroup.prototype._raiseReadyEventInternal = function () {
            this._isReady = true;
            this.bridge.notifyConnectionGroupReady();
        };
        ConnectionGroup.prototype.startPageLoadActivity = function (pageLoadActivityType) {
            // Create page load activity but only make it a visualizaiton on page load activity if we 
            // have an initial utterance. Also note that we are using AppManager pageLoadStartTime as 
            // page load start time. This is ok for now since we only have a single connection group 
            // on any page but we'll need to revise this once not true.
            var parentActivityStack = this.createOriginActivityStack();
            var pageLoadActivity = this.telemetryService.createNewActivity(pageLoadActivityType, parentActivityStack, true);
            pageLoadActivity.activityStartTime = InJs.AppManager.current.pageLoadStartTime;
            if (this.initialUtterance)
                this._visualizationOnPageLoadActivity = pageLoadActivity;
            return pageLoadActivity;
        };
        ConnectionGroup.prototype.createOriginActivityStack = function () {
            var originRootActivityId = InJs.QueryStringUtil.getQueryStringValue(InJs.QueryStringUtil.OriginRootActivityIdParameterName);
            var originActivityId = InJs.QueryStringUtil.getQueryStringValue(InJs.QueryStringUtil.OriginActivityIdParameterName);
            if (!originRootActivityId && !originRootActivityId)
                return;
            var originRootActivity = this.telemetryService.createNewActivity(17 /* IAPL */, null, false);
            originRootActivity.activityId = originRootActivityId ? originRootActivityId : originActivityId;
            // This handles both if we have only parent and no root or if parent is equal to root
            if (originRootActivity.activityId === originActivityId)
                return originRootActivity;
            var originParentActivity = this.telemetryService.createNewActivity(17 /* IAPL */, originRootActivity, false);
            originParentActivity.activityId = originActivityId;
            return originParentActivity;
        };
        ConnectionGroup.prototype.clearInterpretResult = function () {
            this.bridge.clearInterpretResult(true, true);
        };
        ConnectionGroup.prototype.interpretUtterance = function (utterance) {
            debug.assertValue(utterance, 'utterance');
            this.bridge.changeUserUtterance(utterance);
        };
        /** Raises the named event with the specified event arguments. */
        ConnectionGroup.prototype.raise = function (name, args) {
            debug.assertValue(name, 'name');
            $(this).trigger(name, args);
        };
        ConnectionGroup.prototype.raisePinToDashboard = function (arg) {
            this.raise(ConnectionGroup.PinToDashboardEventName, arg);
        };
        ConnectionGroup.prototype.onQuestionBoxTextChanged = function () {
            this.raise(ConnectionGroup.UtteranceChangedEventName);
        };
        ConnectionGroup.prototype.onInterpretIssued = function (e, args) {
            this.raise(InJs.Events.InterpretIssuedEventName, args);
        };
        ConnectionGroup.prototype.onInterpretSuccess = function (e, args) {
            this.raise(InJs.Events.InterpretSuccessEventName, args);
        };
        ConnectionGroup.prototype.onInterpretError = function (e, args) {
            this.raise(InJs.Events.InterpretErrorEventName, args);
        };
        ConnectionGroup.prototype.onInterpretRetryCountExceeded = function (e, args) {
            this.raise(InJs.Events.InterpretRetryCountExceededEventName, args);
        };
        ConnectionGroup.prototype.onInvalidated = function (e, args) {
            this.raise(InJs.Events.ConnectionGroupInvalidatedEventName, args);
        };
        ConnectionGroup.UtteranceChangedEventName = 'UtteranceChangedEvent';
        ConnectionGroup.TextChangedEventName = 'TextChangedEvent';
        ConnectionGroup.PinToDashboardEventName = 'PinToDashboardEvent';
        ConnectionGroup.ReportServerPath = '/ReportServer';
        ConnectionGroup.InterpretOperationName = 'interpret';
        return ConnectionGroup;
    })(InJs.InfoNavController);
    InJs.ConnectionGroup = ConnectionGroup;
    /** Permission levels for InfoNav App */
    (function (InfoNavAppPermissions) {
        InfoNavAppPermissions[InfoNavAppPermissions["None"] = 0x0] = "None";
        InfoNavAppPermissions[InfoNavAppPermissions["Admin"] = 0x1] = "Admin";
        InfoNavAppPermissions[InfoNavAppPermissions["UserEditor"] = 0x2] = "UserEditor";
    })(InJs.InfoNavAppPermissions || (InJs.InfoNavAppPermissions = {}));
    var InfoNavAppPermissions = InJs.InfoNavAppPermissions;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var UISuggestionItem = (function () {
        function UISuggestionItem() {
        }
        Object.defineProperty(UISuggestionItem.prototype, "parts", {
            get: function () {
                return this._parts;
            },
            set: function (value) {
                this._parts = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UISuggestionItem.prototype, "text", {
            get: function () {
                var retValue = '';
                this._parts.forEach(function (part, index, parts) {
                    retValue += part.text;
                });
                return retValue;
            },
            enumerable: true,
            configurable: true
        });
        return UISuggestionItem;
    })();
    InJs.UISuggestionItem = UISuggestionItem;
    var InterpretResult = (function () {
        function InterpretResult(source, utterance) {
            debug.assertValue(source, 'source');
            debug.assertValue(utterance, 'utterance');
            this._source = source;
            this._utterance = utterance;
        }
        Object.defineProperty(InterpretResult.prototype, "alternateCompletions", {
            get: function () {
                return this._source.AlternateCompletions;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InterpretResult.prototype, "suggestionItems", {
            get: function () {
                return this._source.SuggestionItems;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InterpretResult.prototype, "suggestedPhrasingTemplates", {
            get: function () {
                return this._source.SuggestedPhrasingTemplates;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InterpretResult.prototype, "completedUtterance", {
            get: function () {
                return this._source.CompletedUtterance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InterpretResult.prototype, "warnings", {
            get: function () {
                return this._source.Warnings;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InterpretResult.prototype, "error", {
            get: function () {
                return this._source.Error;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InterpretResult.prototype, "databaseName", {
            get: function () {
                return this._source.DatabaseName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InterpretResult.prototype, "virtualServerName", {
            get: function () {
                return this._source.VirtualServerName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InterpretResult.prototype, "restatement", {
            get: function () {
                return this._source.Restatement;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InterpretResult.prototype, "utterance", {
            get: function () {
                return this._utterance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InterpretResult.prototype, "unrecognizedTerms", {
            get: function () {
                if (this._source.UnrecognizedTerms) {
                    return this._source.UnrecognizedTerms.map(function (item) { return item.TermIndex; });
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InterpretResult.prototype, "source", {
            /** The raw result from the server - this is only to be used with PowerView **/
            get: function () {
                return this._source;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Whether the result is empty
         * @param considerSuggestions - If the test should consider the presence of suggestions in the result
         * @returns Whether a result is empty
         */
        InterpretResult.prototype.isEmpty = function (considerSuggestions) {
            return !this._source.Command && (!considerSuggestions || (!this.restatement && !this.completedUtterance && (!this.alternateCompletions || !this.alternateCompletions.length) && (!this.suggestionItems || !this.suggestionItems.length)));
        };
        /**
         * Whether the result contains completion suggestions
         * @returns Whether any result contains term suggestions
         */
        InterpretResult.prototype.hasCompletionSuggestions = function () {
            return !!this._source && !!this.alternateCompletions && this.alternateCompletions.length > 0;
        };
        /**
         * Whether the result contains term suggestions
         * @returns Whether any result contains term suggestions
         */
        InterpretResult.prototype.hasTermSuggestions = function () {
            return !!this._source && !!this.suggestionItems && this.suggestionItems.length > 0;
        };
        /**
         * Gets the index of a phrasing template for a particular term inside an result
         * @param termIndex - The position of the term inside the completed utterance
         * @returns The index of the first phrasing template that matches the term or -1 if not found
         */
        InterpretResult.prototype.getPhrasingTemplateIndexForTerm = function (termIndex) {
            if (this._source && this.suggestedPhrasingTemplates && this.suggestedPhrasingTemplates.length > 0) {
                var phrasingTemplates = this.suggestedPhrasingTemplates;
                for (var i = 0; i < phrasingTemplates.length; i++) {
                    if (phrasingTemplates[i].TermIndices.indexOf(termIndex) >= 0) {
                        return i;
                    }
                }
            }
            return -1;
        };
        /** Converts a completed utterance (string, term indices) into a array of strings. */
        InterpretResult.prototype.getCompletedUtteranceAsTerms = function () {
            var queryAsTerms = new Array();
            // A result may not always have a completed utterance, for instance in the case where a LinguisticSchema is being loaded on the server
            var completedUtterance = this.completedUtterance;
            if (completedUtterance) {
                var terms = completedUtterance.Terms;
                for (var i = 0, len = terms.length; i < len; i++) {
                    queryAsTerms.push(InterpretResult.getTermText(completedUtterance, i));
                }
            }
            return queryAsTerms;
        };
        /** Returns the string value of the completedUtterance term at the specified termIndex. */
        InterpretResult.getTermText = function (completedUtterance, termIndex) {
            debug.assertValue(completedUtterance, 'completedUtterance');
            debug.assertValue(termIndex, 'termIndex');
            var text = completedUtterance.Text, completedUtteranceTerms = completedUtterance.Terms, startCharIndex = completedUtteranceTerms[termIndex].StartCharIndex, isLastTerm = termIndex === (completedUtteranceTerms.length - 1), nextTermStartCharIndex = isLastTerm ? text.length : completedUtteranceTerms[termIndex + 1].StartCharIndex;
            return text.substring(startCharIndex, nextTermStartCharIndex);
        };
        /**
         * Gets all the possible term suggestions for a given term selection from an the result
         * @param termSelection - The term selection for which to check for results
         * @returns The possible term suggestions for the given selection
         */
        InterpretResult.prototype.getTermSuggestionsForSelection = function (termSelection) {
            var suggestionsForSelection = [];
            for (var i = 0; i < this.suggestionItems.length; i++) {
                var possibleSuggestion = this.suggestionItems[i];
                if (possibleSuggestion.TermStartIndex <= termSelection.end && termSelection.start <= possibleSuggestion.TermEndIndex) {
                    suggestionsForSelection.push(possibleSuggestion);
                }
            }
            return suggestionsForSelection;
        };
        /**
         * Determines wheter a particular term (or range of terms) inside the result has suggestions
         * @param termIndex - The position of the term inside the completed utterance
         * @returns Whether the term at the specified index has suggestions
         */
        InterpretResult.prototype.hasSuggestionsForTermSelection = function (termSelection) {
            if (this._source && this.suggestionItems) {
                var suggestions = this.suggestionItems;
                for (var i = 0; i < suggestions.length; i++) {
                    if (suggestions[i].TermStartIndex <= termSelection.end && termSelection.start <= suggestions[i].TermEndIndex) {
                        return true;
                    }
                }
            }
            return false;
        };
        /**
         * Returns the set of completion suggestions for UI rendering
         * @returns A set of suggestion items to be used in UI rendering
         */
        InterpretResult.prototype.getCompletionSuggestions = function () {
            var completionSuggestions = new Array();
            if (this._source && this.completedUtterance && this.hasCompletionSuggestions()) {
                var queryAsTerms = this.getCompletedUtteranceAsTerms();
                for (var i = 0; i < this.alternateCompletions.length; i++) {
                    var completion = this.alternateCompletions[i];
                    var completionSuggestion = new UISuggestionItem();
                    completionSuggestion.parts = new Array();
                    for (var j = 0; j < completion.Items.length; j++) {
                        var completionItem = completion.Items[j];
                        if (completionItem.TermIndices) {
                            for (var k = 0; k < completionItem.TermIndices.length; k++) {
                                var replacement = {};
                                replacement.text = completionItem.Text ? completionItem.Text : queryAsTerms[completionItem.TermIndices[k]];
                                replacement.emphasize = completionItem.Text ? true : false;
                                completionSuggestion.parts.push(replacement);
                                // if we have a text replacement from the server, only iterate through the loop once (to prevent duplicate output)
                                if (completionItem.Text && k === 0)
                                    break;
                            }
                        }
                        else {
                            var insertion = {};
                            insertion.text = completionItem.Text;
                            insertion.emphasize = true;
                            completionSuggestion.parts.push(insertion);
                        }
                    }
                    completionSuggestions.push(completionSuggestion);
                }
            }
            return completionSuggestions;
        };
        /**
         * Returns the set of term suggestions to be used for UI rendering
         * @returns A set of suggestion items to be used in UI rendering
         */
        InterpretResult.prototype.getTermSuggestions = function (termSelection) {
            var termSuggestions = new Array();
            if (termSelection && this.completedUtterance && this.hasTermSuggestions()) {
                var queryAsTerms = this.getCompletedUtteranceAsTerms();
                var suggestionsForTerm = this.getTermSuggestionsForSelection(termSelection);
                for (var i = 0; i < suggestionsForTerm.length; i++) {
                    var thisSuggestion = suggestionsForTerm[i];
                    if (thisSuggestion.TermStartIndex <= termSelection.end && termSelection.start <= thisSuggestion.TermEndIndex) {
                        var termSuggestion = new UISuggestionItem();
                        termSuggestion.parts = queryAsTerms.map(function (item) {
                            var suggestionPart = {};
                            suggestionPart.text = item;
                            suggestionPart.emphasize = false;
                            return suggestionPart;
                        });
                        var replacementRangeLength = thisSuggestion.TermEndIndex - thisSuggestion.TermStartIndex + 1;
                        termSuggestion.parts.splice(thisSuggestion.TermStartIndex, replacementRangeLength, { text: thisSuggestion.SuggestedReplacement, emphasize: true });
                        termSuggestions.push(termSuggestion);
                    }
                }
            }
            return termSuggestions;
        };
        return InterpretResult;
    })();
    InJs.InterpretResult = InterpretResult;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var InterpretResponse = (function () {
        /** Construct a new object related to the response for an interpret method call. */
        function InterpretResponse(requestId, utterance, results) {
            this._requestId = requestId;
            this._utterance = utterance;
            this._results = results.map(function (item) { return new InJs.InterpretResult(item, utterance); });
        }
        Object.defineProperty(InterpretResponse.prototype, "utterance", {
            get: function () {
                return this._utterance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InterpretResponse.prototype, "requestId", {
            get: function () {
                return this._requestId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InterpretResponse.prototype, "defaultResultIndex", {
            get: function () {
                return this.getResultIndexForSource(this.defaultResultSource);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InterpretResponse.prototype, "selectedResultIndex", {
            get: function () {
                return this.getResultIndexForSource(this.selectedResultSource);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InterpretResponse.prototype, "resultIndex", {
            /** Gets the index of the top ranked result from this interpret response */
            get: function () {
                if (this.selectedResultIndex >= 0) {
                    return this.selectedResultIndex;
                }
                if (this.defaultResultIndex >= 0) {
                    return this.defaultResultIndex;
                }
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InterpretResponse.prototype, "result", {
            /** Get the top ranked result from this interpret response */
            get: function () {
                if (InJs.ArrayExtensions.isUndefinedOrEmpty(this._results)) {
                    return null;
                }
                return this._results[this.resultIndex];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InterpretResponse.prototype, "results", {
            get: function () {
                return this._results;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Whether the response contains phrasing templates
         * @returns Whether a result is empty
         */
        InterpretResponse.prototype.containsPhrasingTemplates = function () {
            for (var i = 0; i < this._results.length; i++) {
                if (this._results[i].suggestedPhrasingTemplates && this._results[i].suggestedPhrasingTemplates.length > 0) {
                    return true;
                }
            }
            return false;
        };
        /**
         * Whether the response is empty
         * @param considerSuggestions - If the test should consider the presence of suggestions in the result
         * @returns Whether a response is empty
         */
        InterpretResponse.prototype.isEmpty = function (considerSuggestions) {
            return this._results.length < 1 || this._results[0].isEmpty(considerSuggestions);
        };
        /**
         * Whether the response contains errors
         * @returns Whether any result has errors
         */
        InterpretResponse.prototype.hasErrors = function () {
            for (var i = 0; i < this._results.length; i++) {
                if (!InJs.StringExtensions.isNullOrUndefinedOrWhiteSpaceString(this._results[i].error)) {
                    return true;
                }
            }
            return false;
        };
        /**
         * Whether the utterance of the other response is linguistically equivalent to this response's utterance
         * @returns Whether the utterances are linguistically equivalent
        */
        InterpretResponse.prototype.isUtteranceLinguisticallyEquivalent = function (otherResponse) {
            return otherResponse && (otherResponse._utterance || '').trim() === (this._utterance || '').trim();
        };
        InterpretResponse.prototype.getResultIndexForSource = function (sourceName) {
            if (!InJs.StringExtensions.isNullOrUndefinedOrWhiteSpaceString(sourceName)) {
                for (var i = 0; i < this._results.length; i++) {
                    if (this._results[i].databaseName === sourceName) {
                        return i;
                    }
                }
            }
            return -1;
        };
        return InterpretResponse;
    })();
    InJs.InterpretResponse = InterpretResponse;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /**
      * Control base class, for common functionality all controls
      * such as button, textbox, radio button, image will use.
    */
    var Control = (function (_super) {
        __extends(Control, _super);
        function Control(element) {
            _super.call(this);
            if (!element) {
                element = InJs.DomFactory.div();
            }
            this._element = element;
        }
        /** Makes the host element visible, and returns a boolean to notify if the action was performed */
        Control.prototype.show = function () {
            if (!this.isVisible) {
                this._element.show();
                return true;
            }
            return false;
        };
        /** Hide the host element, and returns a boolean to notify if the action was performed */
        Control.prototype.hide = function () {
            if (this.isVisible) {
                this._element.hide();
                return true;
            }
            return false;
        };
        Object.defineProperty(Control.prototype, "isVisible", {
            get: function () {
                return this._element.is(InJs.JQueryConstants.VisibleSelector);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Control.prototype, "element", {
            /** Return the host element for the control */
            get: function () {
                return this._element;
            },
            enumerable: true,
            configurable: true
        });
        return Control;
    })(InJs.InfoNavController);
    InJs.Control = Control;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** This is the base class for all InfoNav client JavaScript controls */
    var InfoNavClientControl = (function (_super) {
        __extends(InfoNavClientControl, _super);
        function InfoNavClientControl(element, options) {
            InJs.Utility.throwIfNotTrue((options == null) || (options.group == null) || (options.group.bridge != null), this, 'ctor', 'If there is a connection group there has to be bridge too');
            _super.call(this, options && options.group ? options.group.bridge : null);
            if (!element)
                element = InJs.DomFactory.div();
            this._element = element;
            if (options) {
                this._connectionGroup = options.group;
            }
        }
        Object.defineProperty(InfoNavClientControl.prototype, "connectionGroup", {
            get: function () {
                return this._connectionGroup;
            },
            enumerable: true,
            configurable: true
        });
        InfoNavClientControl.prototype.registerOnConnectionGroup = function (connectionGroup) {
            if (!connectionGroup)
                InJs.Utility.throwException(InJs.Errors.invalidOperation('No connection group provided to register'));
            if (this._connectionGroup)
                InJs.Utility.throwException(InJs.Errors.invalidOperation('ConnectionGroup is already registered'));
            this.registerBridge(connectionGroup.bridge);
            this._connectionGroup = connectionGroup;
        };
        InfoNavClientControl.prototype.unregisterFromConnectionGroup = function () {
            this.unregisterBridge();
            this._connectionGroup = null;
        };
        Object.defineProperty(InfoNavClientControl.prototype, "element", {
            /** Returns the underlying element */
            get: function () {
                return this._element;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InfoNavClientControl.prototype, "isVisible", {
            get: function () {
                return this._element.is(':visible');
            },
            enumerable: true,
            configurable: true
        });
        /** Makes the host element visible, and returns a boolean to notify if the action was performed */
        InfoNavClientControl.prototype.show = function () {
            if (!this.isVisible) {
                this._element.show();
                // TODO - 2129732: This should not be here
                InJs.InfoNavApp.current.refreshLayout();
                return true;
            }
            return false;
        };
        /** Hide the host element, and returns a boolean to notify if the action was performed */
        InfoNavClientControl.prototype.hide = function () {
            if (this.isVisible) {
                this._element.hide();
                // TODO - 2129732: This should not be here
                InJs.InfoNavApp.current.refreshLayout();
                return true;
            }
            return false;
        };
        InfoNavClientControl.ConnectionGroupOptionName = 'group';
        return InfoNavClientControl;
    })(InJs.EventBridgeParticipant);
    InJs.InfoNavClientControl = InfoNavClientControl;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /**
     * Same as InfoNavClientControl with the difference that InfoNavConectedClientControl
     * requires presence of a connection group
     */
    var InfoNavConnectedClientControl = (function (_super) {
        __extends(InfoNavConnectedClientControl, _super);
        function InfoNavConnectedClientControl(element, options) {
            InJs.Utility.throwIfNullOrUndefined(options, this, 'ctor', 'options');
            InJs.Utility.throwIfNullOrUndefined(options.group, this, 'ctor', 'options.group');
            _super.call(this, element, options);
        }
        return InfoNavConnectedClientControl;
    })(InJs.InfoNavClientControl);
    InJs.InfoNavConnectedClientControl = InfoNavConnectedClientControl;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var controls;
    (function (controls) {
        var ArrayExtensions = jsCommon.ArrayExtensions;
        var StringExtensions = jsCommon.StringExtensions;
        var DOMFactory = InJs.DomFactory;
        var DataViewTransform = powerbi.data.DataViewTransform;
        var ActivityEndedWith = InJs.ActivityEndedWith;
        (function (QnaVisualizationState) {
            QnaVisualizationState[QnaVisualizationState["Blank"] = 0] = "Blank";
            QnaVisualizationState[QnaVisualizationState["HasNewVisual"] = 1] = "HasNewVisual";
            QnaVisualizationState[QnaVisualizationState["ErrorEmptyResult"] = 2] = "ErrorEmptyResult";
            QnaVisualizationState[QnaVisualizationState["NoReaderResult"] = 3] = "NoReaderResult";
            QnaVisualizationState[QnaVisualizationState["NoCommandResult"] = 4] = "NoCommandResult";
            QnaVisualizationState[QnaVisualizationState["QuerryErrorResult"] = 5] = "QuerryErrorResult";
            QnaVisualizationState[QnaVisualizationState["NoSecurityTokenSet"] = 6] = "NoSecurityTokenSet";
        })(controls.QnaVisualizationState || (controls.QnaVisualizationState = {}));
        var QnaVisualizationState = controls.QnaVisualizationState;
        var QnaVisualizationControl = (function (_super) {
            __extends(QnaVisualizationControl, _super);
            function QnaVisualizationControl(element, options, hostServices, dataProxy, qnaVisualizationControlDelegates, telemetryService) {
                var _this = this;
                _super.call(this, element, options);
                // Interpret requests will have orderIds that increase from 0, allowing this
                // control to know with an O(n) comparison of two requests which is the newer.
                // This value stores the known greatest to this point, so that if a new interpret
                // is seen it can be determined if it needs to be rendered or not based on
                // its orderId compared to this value.
                //
                // Initialize with -1 because the first valid orderId is 0.
                this.currentVisualOrderId = -1;
                this.hostServices = hostServices;
                this.dataProxy = dataProxy;
                this.telemetryService = telemetryService;
                this.qnaVisualizationControlDelegates = qnaVisualizationControlDelegates;
                this.isPinningEnabled = options.isPinningEnabled;
                this.hasValidVisual = false;
                debug.assertValue(this.qnaVisualizationControlDelegates, "Must pass in qnaVisualizationControlDelegates");
                debug.assertValue(this.qnaVisualizationControlDelegates.updateVisualizationState, "Must pass in a UX update handler.");
                $(window).on('resize', function () { return _this.updateVisualSize(); });
                this.visualContainer = this.element;
                if (options.isPowerBIDotCom) {
                    this.visualContainer = DOMFactory.div().prependTo(this.element);
                    this.skittlesContainer = DOMFactory.ul().addClass(QnaVisualizationControl.cssClasses.optionsMenu).append(DOMFactory.li().append('<i class="glyphicon pbi-glyph-pin" id="pinVisualBtn" title="' + this.hostServices.getLocalizedString('TutorialPopup_PinVisualTitle') + '"></i>').click(function () { return _this.pinVisualClicked(); })).appendTo(this.visualContainer);
                    this.skittlesContainer.hide();
                }
                this.currentClearId = 0;
                if (this.connectionGroup) {
                    $(this.connectionGroup).on(InJs.ConnectionGroup.UtteranceChangedEventName, function () { return _this.checkForEmptySecurityToken(); });
                }
            }
            Object.defineProperty(QnaVisualizationControl.prototype, "hasVisual", {
                /* for testability */
                get: function () {
                    return this.visualElement != null && this.currentVisual != null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QnaVisualizationControl.prototype, "areSkittlesVisible", {
                get: function () {
                    return this.skittlesContainer && this.skittlesContainer.is(':visible');
                },
                enumerable: true,
                configurable: true
            });
            QnaVisualizationControl.prototype._onInterpretSuccess = function (eventArgs) {
                // Throw away anything that is older than something that is being
                // prepared to be rendered.
                //
                // For anything that is newer, delay its rendering incase something
                // even newer will be rendered right after it.
                //
                // A special case occurs when the data retrieval skipped message
                // is sent from the server. In this case, the temporary data needs
                // to be modified to allow the previous query that actually gets the
                // data to execute successfully.
                this.clearPendingTimeouts();
                debug.assert(eventArgs.orderId >= 0, 'orderId is not valid and rendering cannot continue correctly.');
                if (this.requiresVisualization(eventArgs)) {
                    var result = eventArgs.response.result;
                    this.currentVisualOrderId = eventArgs.orderId;
                    if (this.wasDataRetrievalSkipped(result)) {
                        // In the event that the server didn't send any visualization data to
                        // save cogs, the newest visualization will be the one that is stored,
                        // so just ignore this one.
                        var visualizationActivity = this.createVisualizationActivity(eventArgs.clientActivity);
                        debug.assertValue(this.data, 'There is no cached data stored in the client.');
                        if (this.data) {
                            this.data.utterance = result.utterance;
                            this.data.configs = result.source.Command.VisualConfigurations;
                            this.processDataViewResult(this.data, this.data.dataView, true, visualizationActivity);
                            visualizationActivity.end(1 /* Success */);
                        }
                        else {
                            // if data is null that means previous interpret return empty result.
                            visualizationActivity.end(1 /* Success */, InJs.ActivityErrors.EmptyInterpretResult);
                        }
                        // Add qna metadata to the activity
                        this.addQnaControllerMetadataToActivity(eventArgs.clientActivity, eventArgs.response);
                        return;
                    }
                    this.onInterpretSuccessInternal(eventArgs);
                }
                else {
                    // Visualization is not required, so simply log some telemetry and quit.
                    var visualizationActivity = this.createVisualizationActivity(eventArgs.clientActivity);
                    visualizationActivity.end(1 /* Success */, InJs.ActivityErrors.RenderingSkippedOnClient);
                }
                // Add qna metadata to the activity
                this.addQnaControllerMetadataToActivity(eventArgs.clientActivity, eventArgs.response);
            };
            QnaVisualizationControl.prototype._onInterpretError = function (e) {
                this.updateStateAndClearVisual(5 /* QuerryErrorResult */, null);
                this.addQnaControllerMetadataToActivity(e.clientActivity);
            };
            QnaVisualizationControl.prototype.addQnaControllerMetadataToActivity = function (clientActivity, response) {
                var qnaControllerMetadataDelegate = this.qnaVisualizationControlDelegates.qnaControllerMetadataDelegate;
                if (qnaControllerMetadataDelegate)
                    qnaControllerMetadataDelegate(clientActivity, response);
            };
            QnaVisualizationControl.prototype.requiresVisualization = function (eventArgs) {
                // If the orderId is newer than any other request that hs been rendered
                // then it definitely needs to be considered for rendering.
                if (eventArgs.orderId > this.currentVisualOrderId)
                    return true;
                // Default is to assume false.
                return false;
            };
            QnaVisualizationControl.prototype.onInterpretSuccessInternal = function (eventArgs) {
                var _this = this;
                var visualizationActivity = this.createVisualizationActivity(eventArgs.clientActivity);
                this.hasValidVisual = false;
                var response = eventArgs.response;
                var result = response.result;
                var command;
                var readers;
                var reader;
                if (result) {
                    command = result.source.Command;
                    readers = powerbi.InterpretResultUtility.parseInterpret([result]);
                    debug.assert(!readers || readers.length > 0, 'readers should either be null or non-empty');
                    if (readers && readers.length > 0)
                        reader = readers[0];
                }
                var data = reader || powerbi.InterpretResultUtility.createSimpleUtteranceData(response.utterance);
                if (response.isEmpty(true) || response.result.isEmpty(true)) {
                    visualizationActivity.end(1 /* Success */, InJs.ActivityErrors.EmptyInterpretResult);
                    // Perform the callback to the container code in order to update the message UX, as that is owned on the PowerBI page.
                    this.updateStateAndClearVisual(2 /* ErrorEmptyResult */, data);
                    return;
                }
                if (!command) {
                    visualizationActivity.end(0 /* Unknown */, InJs.ActivityErrors.InterpretError);
                    // Perform the callback to the container code in order to update the message UX, as that is owned on the PowerBI page.
                    this.updateStateAndClearVisual(4 /* NoCommandResult */, data);
                    return;
                }
                if (!readers) {
                    // Perform the callback to the container code in order to update the message UX, as that is owned on the PowerBI page.
                    this.updateStateAndClearVisual(3 /* NoReaderResult */, data);
                    visualizationActivity.end(0 /* Unknown */, InJs.ActivityErrors.UnknownError);
                    return;
                }
                var dataViewSource = reader.dataViewSource;
                this.dataProxy.execute({
                    type: dataViewSource.type,
                    query: {
                        command: dataViewSource.data,
                    }
                }).then(function (dataViewResult) {
                    // check if the result contains query error.
                    var error = dataViewResult.dataProviderResult.error;
                    if (error) {
                        _this.updateStateAndClearVisual(5 /* QuerryErrorResult */, data);
                        visualizationActivity.end(3 /* Error */, StringExtensions.format(InJs.ActivityErrors.InterpretSuccessfulButContainsQueryError, error.code, 'error occurred from RS.'));
                        return;
                    }
                    // Render the data as received.
                    _this.processDataViewResult(reader, dataViewResult.dataProviderResult.dataView, false, visualizationActivity);
                    visualizationActivity.end(1 /* Success */);
                }, function (dataView) {
                    _this.updateStateAndClearVisual(5 /* QuerryErrorResult */, data);
                    visualizationActivity.end(3 /* Error */, InJs.ActivityErrors.UnexpectedVisualizationActivityEnd);
                });
            };
            QnaVisualizationControl.prototype.isDataViewSuppported = function (dataView, capabilities) {
                debug.assertValue(dataView, "dataView");
                debug.assertValue(capabilities, "capabilities");
                debug.assertValue(capabilities.dataViewMappings, "capabilities.dataViewMappings");
                var mappings = capabilities.dataViewMappings;
                for (var i = 0, len = mappings.length; i < len; i++) {
                    if (powerbi.DataViewAnalysis.supports(dataView, mappings[i], false))
                        return true;
                }
                return false;
            };
            QnaVisualizationControl.prototype.wasDataRetrievalSkipped = function (result) {
                return result && result.source.Command && InJs.EnumExtensions.hasFlag(result.source.Warnings, 32 /* DataRetrievalSkipped */);
            };
            QnaVisualizationControl.prototype.updateDataForDataRetrievalSkipped = function (result, data) {
                data.utterance = result.utterance;
                if (result.source.Command)
                    data.configs = result.source.Command.VisualConfigurations;
            };
            QnaVisualizationControl.prototype.checkForEmptySecurityToken = function () {
                // Since we short-circuit interpret if there is no security token set, interpret request will never be issues.
                // Add the following code so that error event is fired and appropriate error message is displayed to the user.
                if (InJs.StringExtensions.isNullOrUndefinedOrWhiteSpaceString(this.connectionGroup.getSecurityToken()))
                    this.updateStateAndClearVisual(6 /* NoSecurityTokenSet */);
            };
            QnaVisualizationControl.prototype.processDataViewResult = function (data, dataView, existingDataView, activity) {
                var _this = this;
                var visualConfig;
                var plugin;
                var configs = data.configs;
                if (configs.length > 0) {
                    visualConfig = configs[0];
                    plugin = this.getVisualPlugin(visualConfig.VisualizationType);
                    debug.assert(this.isDataViewSuppported(dataView, plugin.capabilities), 'The recommended visual type is not compatible with the data');
                }
                if (!plugin)
                    return;
                this.hasValidVisual = true;
                var visual = this.currentVisual;
                var visualHasChanged = !visual || this.currentPlugin !== plugin;
                // If both visual and data hasn't changed, just return
                if (!visualHasChanged && existingDataView)
                    return;
                data.visualType = plugin.name;
                activity.addCorrelatedProperty(new InJs.CorrelatedProperty(QnaVisualizationControl.TelemetryVisualizationTypeProperty, data.visualType));
                data.dataShapeBinding = visualConfig.DataShapeBinding;
                data.visualElements = visualConfig.VisualElements;
                var dataViews = DataViewTransform.apply({
                    prototype: dataView,
                    objectDescriptors: plugin.capabilities.objects,
                    dataViewMappings: plugin.capabilities.dataViewMappings,
                    transforms: DataViewTransform.createTransformActions(data.queryMetadata, visualConfig.VisualElements, plugin.capabilities.objects, null),
                    colorAllocatorFactory: powerbi.visuals.createColorAllocatorFactory(),
                });
                debug.assert(dataViews.length === 1, 'We should only have one dataView, unless we now support combo charts in QnA?');
                dataView = dataViews[0];
                data.dataView = dataView;
                this.data = data;
                window.clearTimeout(this.renderingTimerId);
                this.renderingTimerId = window.setTimeout(function () {
                    if (visualHasChanged)
                        visual = _this.changeVisual(plugin, visualConfig.VisualizationType, getVisualSettings(visualConfig.VisualElements), data);
                    visual.onDataChanged({
                        dataViews: dataViews,
                        duration: QnaVisualizationControl.AnimationDuration
                    });
                    _this.qnaVisualizationControlDelegates.updateVisualizationState(1 /* HasNewVisual */, data);
                }, QnaVisualizationControl.RenderingDelay);
            };
            QnaVisualizationControl.prototype.pinVisualClicked = function () {
                var data = this.data;
                if (data)
                    this.connectionGroup.raisePinToDashboard(data);
            };
            QnaVisualizationControl.prototype._onInterpretResultCleared = function (e) {
                this.hasValidVisual = false;
                this.updateStateAndClearVisual(0 /* Blank */);
            };
            QnaVisualizationControl.GetDisplayUnitSystemForVisualType = function (visualizationType) {
                switch (visualizationType) {
                    case 3 /* Card */:
                        // Card visualizations have a lot more space in explore mode to show full values
                        return 1 /* Verbose */;
                    default:
                        return 0 /* Default */;
                }
            };
            QnaVisualizationControl.prototype.updateStateAndClearVisual = function (state, data) {
                var _this = this;
                this.clearPendingTimeouts();
                if (state === 0 /* Blank */) {
                    // The blank state will not be delayed since this happened by a forced
                    // user action such as hitting the ESC key.
                    this.updateStateAndClearVisualInternal(state, data);
                }
                else {
                    // For all error cases actually delay showing the error because the
                    // user may continue to be typing into a valid state, and we do
                    // not want to clear the visual when going between valid states.
                    this.currentClearId = window.setTimeout(function () {
                        if (!_this.hasValidVisual)
                            _this.updateStateAndClearVisualInternal(state, data);
                    }, QnaVisualizationControl.ErrorMessageDelay);
                }
            };
            QnaVisualizationControl.prototype.clearPendingTimeouts = function () {
                if (this.currentClearId !== 0) {
                    // Indicate that there is some visual to prevent showing an error.
                    window.clearTimeout(this.currentClearId);
                    this.currentClearId = 0;
                }
            };
            QnaVisualizationControl.prototype.updateStateAndClearVisualInternal = function (state, data) {
                this.clearVisualAndDataCache();
                var sources;
                if (this._currentInterpretResponse && this._currentInterpretResponse.results)
                    sources = this._currentInterpretResponse.results.map(function (result) {
                        return { databaseName: result.databaseName, virtualServerName: result.virtualServerName };
                    });
                this.qnaVisualizationControlDelegates.updateVisualizationState(state, data, sources);
            };
            QnaVisualizationControl.prototype.clearVisualAndDataCache = function () {
                if (this.visualElement)
                    this.visualElement.remove();
                this.data = null;
                this.visualElement = null;
                this.currentVisual = null;
                if (this.skittlesContainer)
                    this.skittlesContainer.hide();
            };
            QnaVisualizationControl.prototype.changeVisual = function (plugin, visualizationType, settings, data) {
                // Remove current visual element if exists.
                if (this.visualElement) {
                    this.visualElement.remove();
                    this.visualElement = null;
                }
                var visual = this.currentVisual = plugin.create();
                this.currentPlugin = plugin;
                this.visualElement = $('<div class="visual"></div>');
                this.visualElement.hide();
                this.visualContainer.prepend(this.visualElement);
                this.setContainerStyle(plugin);
                // Qna can override the display units used by the visuals since explore mode has more space
                var displayUnitSystemType = QnaVisualizationControl.GetDisplayUnitSystemForVisualType(visualizationType);
                if (settings)
                    settings.DisplayUnitSystemType = displayUnitSystemType;
                else
                    settings = { DisplayUnitSystemType: displayUnitSystemType };
                visual.init({
                    element: this.visualElement,
                    host: this.hostServices,
                    style: this.qnaVisualizationControlDelegates.createVisualStyle ? this.qnaVisualizationControlDelegates.createVisualStyle() : QnaVisualizationControl.createVisualStyle(),
                    viewport: this.visualViewPort,
                    settings: settings,
                });
                if (this.skittlesContainer && this.isPinningEnabled && this.isPinningEnabled())
                    this.skittlesContainer.show();
                this.animateVisualElement("transition.slideLeftIn", function (visualElement) { return visualElement.show(); });
                return visual;
            };
            QnaVisualizationControl.prototype.animateVisualElement = function (transitionName, postAction) {
                if (this.visualElement) {
                    var oldVisualElement = this.visualElement;
                    debug.assertValue(oldVisualElement.velocity, "Velocity should exist in order for Q&A to transition between visuals");
                    if (oldVisualElement.velocity)
                        oldVisualElement.velocity(transitionName, QnaVisualizationControl.AnimationDuration, function () {
                            postAction(oldVisualElement);
                        });
                    else
                        postAction(oldVisualElement);
                }
            };
            QnaVisualizationControl.prototype.updateVisualSize = function () {
                if (this.currentVisual)
                    this.currentVisual.onResizing(this.visualViewPort, 0);
            };
            Object.defineProperty(QnaVisualizationControl.prototype, "visualViewPort", {
                get: function () {
                    var visualContainer = this.visualContainer;
                    return {
                        height: visualContainer.innerHeight(),
                        width: visualContainer.innerWidth() - (this.skittlesContainer ? QnaVisualizationControl.SkittlesMargin : 0),
                    };
                },
                enumerable: true,
                configurable: true
            });
            QnaVisualizationControl.prototype.setContainerStyle = function (plugin) {
                this.visualContainer.removeClass();
                this.visualContainer.addClass(QnaVisualizationControl.cssClasses.baseVisualContainer);
                switch (plugin.name) {
                    case 'card':
                        this.visualContainer.addClass(QnaVisualizationControl.cssClasses.cardContainer);
                        break;
                    case 'pieChart':
                    case 'donutChart':
                        this.visualContainer.addClass(QnaVisualizationControl.cssClasses.pieContainer);
                        break;
                    case 'treemap':
                        this.visualContainer.addClass(QnaVisualizationControl.cssClasses.treeMapContainer);
                        break;
                }
            };
            // Making this public for testabilty
            QnaVisualizationControl.prototype.getVisualPlugin = function (type) {
                var plugins = powerbi.visuals.plugins;
                switch (type) {
                    case 3 /* Card */:
                        return plugins.card;
                    case 29 /* MultiRowCard */:
                        return plugins.multiRowCard;
                    case 7 /* ClusteredBarChart */:
                        return plugins.clusteredBarChart;
                    case 10 /* ClusteredColumnChart */:
                        return plugins.clusteredColumnChart;
                    case 20 /* DonutChart */:
                        return plugins.donutChart;
                    case 16 /* FunnelChart */:
                        return plugins.funnel;
                    case 22 /* HeatMap */:
                        return plugins.heatMap;
                    case 9 /* HundredPercentStackedBarChart */:
                        return plugins.hundredPercentStackedBarChart;
                    case 12 /* HundredPercentStackedColumnChart */:
                        return plugins.hundredPercentStackedColumnChart;
                    case 4 /* LineChart */:
                        return plugins.lineChart;
                    case 1 /* Map */:
                        return plugins.map;
                    case 5 /* PieChart */:
                        return plugins.pieChart;
                    case 6 /* ScatterChart */:
                        return plugins.scatterChart;
                    case 8 /* StackedBarChart */:
                        return plugins.barChart;
                    case 11 /* StackedColumnChart */:
                        return plugins.columnChart;
                    case 0 /* Table */:
                        return plugins.table;
                    case 17 /* Treemap */:
                        return plugins.treemap;
                    case 23 /* WaterfallChart */:
                        return plugins.waterfallChart;
                    default:
                        debug.assertFail('Unsupported visual type: ' + type);
                }
                return null;
            };
            QnaVisualizationControl.createVisualStyle = function () {
                // TODO 2919991: Palette- This should be derived from the style palette for the current theme.
                var dataColors = new powerbi.visuals.DataColorPalette();
                return {
                    titleText: {
                        color: { value: 'rgba(51,51,51,1)' }
                    },
                    subTitleText: {
                        color: { value: 'rgba(145,145,145,1)' }
                    },
                    labelText: {
                        color: {
                            value: 'rgba(51,51,51,1)',
                        },
                        fontSize: '11px'
                    },
                    colorPalette: {
                        dataColors: dataColors,
                    },
                    isHighContrast: false,
                };
            };
            QnaVisualizationControl.prototype.createVisualizationActivity = function (parentActivity) {
                return this.connectionGroup.telemetryService.createNewActivity(25 /* INPV */, parentActivity);
            };
            QnaVisualizationControl.cssClasses = {
                optionsMenu: 'optionsMenu',
                baseVisualContainer: 'visualContainer',
                cardContainer: 'cardContainer',
                pieContainer: 'pieContainer',
                treeMapContainer: 'treeMapContainer',
            };
            QnaVisualizationControl.AnimationDuration = 250;
            QnaVisualizationControl.ErrorMessageDelay = 1000;
            QnaVisualizationControl.SkittlesMargin = 50;
            QnaVisualizationControl.TelemetryVisualizationTypeProperty = 'VisualizationType';
            // In order to prevent rendering a bunch of visualization requests rendering
            // is executed on a delay. This allows new requests to "override" old ones,
            // preventing extranous time from being spent on drawing multiple visuals,
            // and improves performance by not spending time rendering potentially
            // multiple visuals.
            QnaVisualizationControl.RenderingDelay = 100;
            return QnaVisualizationControl;
        })(InJs.InfoNavConnectedClientControl);
        controls.QnaVisualizationControl = QnaVisualizationControl;
        /** Reads the settings out of the specified elements. */
        function getVisualSettings(elements) {
            if (ArrayExtensions.isUndefinedOrEmpty(elements))
                return;
            return elements[0].Settings;
        }
    })(controls = powerbi.controls || (powerbi.controls = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company='Microsoft Corporation'>
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /**
     * This is the component that encapsulates logic for handling browser specific functions
     * Browser states are persisted by history.pushState and replaceState and browser navigation are handled by
     * responding to popState event.
    */
    var BrowserHandler = (function (_super) {
        __extends(BrowserHandler, _super);
        function BrowserHandler(bridge, configurationProvider, interpretService, initialUtterance) {
            _super.call(this, bridge, configurationProvider);
            /** This keeps track of whether any calls to updateBrowserLocation were */
            this._initialLocationUpdated = false;
            this._interpretService = interpretService;
            this._initialUtterance = initialUtterance;
            this._lastResult = null;
            this._updateBrowserLocationTimerId = 0;
            $(window).on('popstate', this, this.onStateChange);
        }
        Object.defineProperty(BrowserHandler.prototype, "lastResult", {
            get: function () {
                return this._lastResult;
            },
            enumerable: true,
            configurable: true
        });
        BrowserHandler.prototype.clearBrowserLocation = function () {
            this.clearUpdateBrowserLocationTimer();
            this._lastResult = null;
            var newUrl = InJs.Utility.getUrlWithoutQueryString(window.location.href);
            newUrl = InJs.Utility.urlCombine(newUrl, InJs.QueryStringUtil.clearQueryString('k'));
            if (history.state && !InJs.StringExtensions.isNullOrUndefinedOrWhiteSpaceString(history.state.utterance)) {
                InJs.Tracing.verbose('Current utterance in state is ' + history.state.utterance + ', pushing an new empty state');
                history.pushState({ utterance: '' }, document.title, newUrl);
            }
        };
        /**
         * Updates the browser's location with interpret result information to allow back/forward navigation
         */
        BrowserHandler.prototype.updateBrowserLocation = function (response) {
            InJs.Utility.throwIfNullOrUndefined(response, this, 'UpdateBrowserLocation', 'response');
            InJs.Utility.throwIfNullOrUndefined(response.result, this, 'UpdateBrowserLocation', 'response.Result');
            InJs.Utility.throwIfNullOrEmptyString(response.utterance, this, 'UpdateBrowserLocation', 'response.Utterance');
            var isInitialUtterance = !this._initialLocationUpdated && response.utterance === this._initialUtterance;
            this._initialLocationUpdated = true;
            // Don't add an additional state entry for the initial utterance
            if (isInitialUtterance)
                return;
            this.clearUpdateBrowserLocationTimer();
            var newQueryString = InJs.QueryStringUtil.addOrUpdateQueryString('k', response.utterance);
            if (this._lastResult && !InJs.StringExtensions.isNullOrEmpty(this._lastResult.restatement)) {
                // Try to detect if the current update to the location is similar to what we are
                // already showing. if so, then we should should just update existing state with
                // newer utterance.
                if (this._lastResult.restatement === response.result.restatement) {
                    InJs.Tracing.verbose('Replacing history state with utterance = ' + response.utterance);
                    history.replaceState({ utterance: response.utterance }, document.title, newQueryString);
                    this._lastResult = response.result;
                    return;
                }
            }
            if (history.state === null || history.state.utterance !== response.utterance) {
                InJs.Tracing.verbose('Pushing history with utterance = ' + response.utterance);
                history.pushState({ utterance: response.utterance }, document.title, newQueryString);
            }
            this._lastResult = response.result;
        };
        /** Updates the browser's location after a timeout */
        BrowserHandler.prototype.updateBrowserLocationAfterTimeout = function (response) {
            var _this = this;
            this.clearUpdateBrowserLocationTimer();
            this._updateBrowserLocationTimerId = window.setTimeout(function () {
                _this.updateBrowserLocation(response);
            }, BrowserHandler.UpdateBrowserLocationTimeoutInMilliseconds);
        };
        /** Clears the timeout for updating the browser's location */
        BrowserHandler.prototype.clearUpdateBrowserLocationTimer = function () {
            if (this._updateBrowserLocationTimerId > 0) {
                window.clearTimeout(this._updateBrowserLocationTimerId);
                this._updateBrowserLocationTimerId = 0;
            }
        };
        /** Event handler when the state changes. It supports back/forward navigation */
        BrowserHandler.prototype.onStateChange = function (e) {
            var self = e.data;
            // This is used to workaround a bug in Webkit based browsers, where a popstate event will fire on page load
            // We shouldn't honor popstate events unless the application has updated the browser location
            // This is tracked by Chromium issue 63040
            if (!self._initialLocationUpdated)
                return;
            self.clearUpdateBrowserLocationTimer();
            self._interpretService.abortAllInterpretRequests();
            if (history.state) {
                var utterance = history.state.utterance;
                if (!InJs.StringExtensions.isNullOrEmpty(utterance)) {
                    self.bridge.changeUserUtterance(utterance);
                    return;
                }
            }
            self._lastResult = null;
            self.bridge.clearInterpretResult(false, true);
        };
        /**
         * The timeout in ms after which the browser's location is updated
         * with the current interpret result
         */
        BrowserHandler.UpdateBrowserLocationTimeoutInMilliseconds = 1000;
        return BrowserHandler;
    })(InJs.InfoNavClientService);
    InJs.BrowserHandler = BrowserHandler;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** This class holds all configurable variables to allow InfoNav adapt different environment, such as test page */
    var Configuration = (function () {
        function Configuration() {
        }
        /** Whether the UI should start in unit test mode */
        Configuration.isUnitTest = false;
        /** The root url for the current site */
        Configuration.siteUrl = window.location.protocol + '//' + window.location.hostname;
        /** Path to find PowerView silverlight xap file */
        Configuration.xapUrl = Configuration.siteUrl + '/ReportServer';
        /** Default BI token to use */
        Configuration.biToken = null;
        return Configuration;
    })();
    InJs.Configuration = Configuration;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** Wrapper around storage for InfoNav */
    var InfoNavAppCache = (function () {
        function InfoNavAppCache(storage, appCacheKey) {
            // We can assert on appCacheKey but storage can be undefined as the point of this class is to 
            // wrap an underlying storage object that might not be available (i.e. localStorage). For the
            // storage we only assert that if available it has to be an object
            debug.assertValue(appCacheKey, 'appCacheKey');
            if (storage)
                debug.assert(InJs.Utility.isObject(storage), 'Utility.isObject(storage)');
            this._appCacheKey = appCacheKey;
            this._storage = storage;
        }
        /**
         * Get the current infonav app data
         * @returns The currently stored infonav app data
         */
        InfoNavAppCache.prototype.getData = function () {
            try {
                if (this._storage && this._storage[this._appCacheKey]) {
                    try {
                        var appData = JSON.parse(this._storage[this._appCacheKey]);
                        if (appData) {
                            return appData;
                        }
                    }
                    catch (e) {
                        // Invalid app data we will just return empty
                        InJs.Tracing.warning("Unable to parse App Cache Data: " + this._storage[this._appCacheKey]);
                    }
                }
            }
            catch (e) {
                this.traceStorageException();
            }
            return {};
        };
        /**
         * Update the current infonav app data
         * @param updatedData - The new data to save
         */
        InfoNavAppCache.prototype.updateData = function (updatedData) {
            try {
                if (this._storage) {
                    this._storage[this._appCacheKey] = JSON.stringify(updatedData);
                }
            }
            catch (e) {
                this.traceStorageException();
            }
        };
        /** Resets the contents of the current infonav app cache */
        InfoNavAppCache.prototype.reset = function () {
            try {
                if (this._storage) {
                    this._storage.removeItem(this._appCacheKey);
                }
            }
            catch (e) {
                this.traceStorageException();
            }
        };
        InfoNavAppCache.prototype.traceStorageException = function () {
            InJs.Tracing.error('Exception encountered while accessing cache storage');
        };
        return InfoNavAppCache;
    })();
    InJs.InfoNavAppCache = InfoNavAppCache;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** Wrapper around local storage for InfoNav */
    var InfoNavAppLocalCache = (function (_super) {
        __extends(InfoNavAppLocalCache, _super);
        function InfoNavAppLocalCache(appCacheKey) {
            var localStorage = undefined;
            try {
                localStorage = window.localStorage;
            }
            catch (exception) {
            }
            _super.call(this, localStorage, appCacheKey);
        }
        return InfoNavAppLocalCache;
    })(InJs.InfoNavAppCache);
    InJs.InfoNavAppLocalCache = InfoNavAppLocalCache;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** Wrapper around session storage for InfoNav */
    var InfoNavAppSessionCache = (function (_super) {
        __extends(InfoNavAppSessionCache, _super);
        function InfoNavAppSessionCache(appCacheKey) {
            _super.call(this, window.sessionStorage, appCacheKey);
        }
        return InfoNavAppSessionCache;
    })(InJs.InfoNavAppCache);
    InJs.InfoNavAppSessionCache = InfoNavAppSessionCache;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var Events;
    (function (Events) {
        Events.ConnectionGroupInvalidatedEventName = 'ConnectionGroupInvalidatedEvent';
        Events.ConnectionGroupReadyEventName = 'ConnectionGroupReadyEvent';
        Events.InterpretIssuedEventName = 'InterpretIssuedEvent';
        Events.InterpretSuccessEventName = 'InterpretSuccessEvent';
        Events.InterpretErrorEventName = 'InterpretErrorEvent';
        Events.InterpretResultChangedEventName = 'InterpretResultChangedEvent';
        Events.InterpretRetryInProgressEventName = 'InterpretRetryInProgressEvent';
        Events.InterpretRetryCountExceededEventName = 'InterpretRetryCountExceededEvent';
        Events.InterpretProbeInProgressEventName = 'InterpretProbeInProgressEvent';
        Events.InterpretProbeSuccessEvent = 'InterpretProbeSuccessEvent';
        Events.InterpretProbeErrorEventName = 'InterpretProbeErrorEvent';
        Events.ClearInterpretResultEventName = 'ClearInterpretResultEvent';
        Events.InterpretResultCacheClearedEventName = 'InterpretResultCacheClearedEvent';
        Events.AvailableVisualizationTypesReadyEventName = 'AvailableVisualizationTypesReadyEvent';
        Events.SetVisualizationTypeEventName = 'SetVisualizationTypeEvent';
        Events.ChangeUserUtteranceEventName = 'ChangeUserUtteranceEvent';
        Events.UserUtteranceConfirmedEventName = 'UserUtteranceConfirmed';
        Events.TermSelectionChangedEventName = 'TermSelectionChangedEvent';
        Events.PowerViewErrorEventName = 'PowerViewErrorEvent';
        Events.QuestionBoxSuggestionsDisplayedEventName = 'QuestionBoxSuggestionsDisplayedEvent';
        Events.CollageVisibilityChangedEventName = 'CollageVisibilityChangedEvent';
        Events.FeaturedQuestionsUpdatedEventName = 'FeaturedQuestionsUpdatedEvent';
        Events.ShowMessageEventName = 'ShowMessageEvent';
        Events.ShowPromptEventName = 'ShowPromptEvent';
        Events.ShowErrorEventName = 'ShowErrorEvent';
        Events.ShowCustomDialogEventName = 'ShowCustomDialogEvent';
        Events.HideDialogEventName = 'HideDialogEvent';
        Events.ShowNotificationEventName = 'ShowNotificationEvent';
        Events.HideNotificationEventName = 'HideNotificationEvent';
        // Events for interpret usage service
        Events.InterpretUsageIssuedEventName = 'InterpretUsageIssuedEvent';
        Events.InterpretUsageSuccessEventName = 'InterpretUsageSuccessEvent';
    })(Events = InJs.Events || (InJs.Events = {}));
    var InfoNavEventBridge = (function () {
        function InfoNavEventBridge() {
        }
        /** Attaches an event handler which fires only once for the specified event. */
        InfoNavEventBridge.prototype.attachOnce = function (name, handler, data) {
            debug.assertValue(name, 'name');
            debug.assertValue(handler, 'handler');
            $(this).off(name, data, handler);
            $(this).on(name, data, handler);
        };
        /** Attaches an event handler for the specified event. */
        InfoNavEventBridge.prototype.attach = function (name, handler, data) {
            debug.assertValue(name, 'name');
            debug.assertValue(handler, 'handler');
            $(this).on(name, data, handler);
        };
        /** Detaches an event handler from the specified event. */
        InfoNavEventBridge.prototype.detach = function (name, handler, data) {
            debug.assertValue(name, 'name');
            debug.assertValue(handler, 'handler');
            $(this).off(name, data, handler);
        };
        /** Raises the named event with the specified event arguments. */
        InfoNavEventBridge.prototype.raise = function (name, args) {
            debug.assertValue(name, 'name');
            $(this).trigger(name, args);
        };
        InfoNavEventBridge.prototype.notifyConnectionGroupInvalidated = function () {
            this.raise(Events.ConnectionGroupInvalidatedEventName);
        };
        InfoNavEventBridge.prototype.notifyConnectionGroupReady = function () {
            this.raise(Events.ConnectionGroupReadyEventName);
        };
        InfoNavEventBridge.prototype.notifyUserUtteranceConfirmed = function () {
            this.raise(Events.UserUtteranceConfirmedEventName);
        };
        InfoNavEventBridge.prototype.clearInterpretResult = function (abortInterprets, clearUtterance, hideVisualization) {
            InJs.Tracing.verbose('InfoNavEventBridge: Clearing interpret result');
            this.raise(Events.ClearInterpretResultEventName, new InJs.ClearInterpretResultEventArgs(abortInterprets, clearUtterance, hideVisualization));
        };
        InfoNavEventBridge.prototype.clearInterpretResultCache = function () {
            this.raise(Events.InterpretResultCacheClearedEventName);
        };
        InfoNavEventBridge.prototype.setVisualizationType = function (visualizationType) {
            this.raise(Events.SetVisualizationTypeEventName, new InJs.SetVisualizationTypeEventArgs(visualizationType));
        };
        InfoNavEventBridge.prototype.availableVisualizationTypesReady = function (visualizationTypes) {
            this.raise(Events.AvailableVisualizationTypesReadyEventName, new InJs.AvailableVisualizationTypesEventArgs(visualizationTypes));
        };
        InfoNavEventBridge.prototype.powerViewError = function (error) {
            this.raise(Events.PowerViewErrorEventName, new InJs.PowerViewErrorEventArgs(error));
        };
        InfoNavEventBridge.prototype.notifyQuestionBoxSuggestionsDisplayed = function (suggestionPixelOffset, animationDuration, numberOfSuggestions) {
            this.raise(Events.QuestionBoxSuggestionsDisplayedEventName, new InJs.QuestionBox.QuestionBoxSuggestionsDisplayedEventArgs(suggestionPixelOffset, animationDuration, numberOfSuggestions));
        };
        InfoNavEventBridge.prototype.notifyTermSelectionChanged = function (termSelection) {
            this.raise(Events.TermSelectionChangedEventName, new InJs.TermSelectionChangedEventArgs(termSelection));
        };
        InfoNavEventBridge.prototype.showCollage = function () {
            this.raise(Events.CollageVisibilityChangedEventName, true);
        };
        InfoNavEventBridge.prototype.hideCollage = function () {
            this.raise(Events.CollageVisibilityChangedEventName, false);
        };
        InfoNavEventBridge.prototype.notifyFeaturedQuestionsUpdated = function () {
            this.raise(Events.FeaturedQuestionsUpdatedEventName);
        };
        InfoNavEventBridge.prototype.changeUserUtterance = function (userUtterance, updateOnlyUI) {
            this.raise(Events.ChangeUserUtteranceEventName, new InJs.ChangeUserUtteranceEventArgs(userUtterance, updateOnlyUI));
        };
        InfoNavEventBridge.prototype.showMessage = function (messageTitle, messageText) {
            this.raise(Events.ShowMessageEventName, new InJs.ShowMessageEventArgs(messageTitle, messageText));
        };
        InfoNavEventBridge.prototype.showPrompt = function (promptTitle, promptText, promptActions, isDismissable) {
            this.raise(Events.ShowPromptEventName, new InJs.ShowPromptEventArgs(promptTitle, promptText, promptActions, isDismissable));
        };
        InfoNavEventBridge.prototype.showError = function (errorText, errorType, request, scriptError) {
            this.raise(Events.ShowErrorEventName, new InJs.ShowErrorEventArgs(errorText, errorType, request, scriptError));
        };
        InfoNavEventBridge.prototype.showCustomDialog = function (titleText, dialogContent, dialogActions, onDialogDisplayed, isDismissable) {
            this.raise(Events.ShowCustomDialogEventName, new InJs.ShowCustomDialogEventArgs(titleText, dialogContent, dialogActions, onDialogDisplayed, isDismissable));
        };
        InfoNavEventBridge.prototype.hideDialog = function () {
            this.raise(Events.HideDialogEventName);
        };
        InfoNavEventBridge.prototype.showNotification = function (id, title, message, closedCallback, isDismissable, dismissTimeout, iconType, officeIconId) {
            this.raise(Events.ShowNotificationEventName, new InJs.ShowNotificationEventArgs(id, title, message, closedCallback, isDismissable, dismissTimeout, iconType, officeIconId));
        };
        InfoNavEventBridge.prototype.hideNotification = function (id) {
            this.raise(Events.HideNotificationEventName, new InJs.HideNotificationEventArgs(id));
        };
        return InfoNavEventBridge;
    })();
    InJs.InfoNavEventBridge = InfoNavEventBridge;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var InterpretEventArgs = (function () {
        function InterpretEventArgs(requestId, clientActivity) {
            this.requestId = requestId;
            this.clientActivity = clientActivity;
        }
        return InterpretEventArgs;
    })();
    InJs.InterpretEventArgs = InterpretEventArgs;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var AvailableVisualizationTypesEventArgs = (function () {
        function AvailableVisualizationTypesEventArgs(visualizationTypes) {
            this._visualizationTypes = null;
            InJs.Utility.throwIfNullOrUndefined(visualizationTypes, this, 'AvailableVisualizationTypesEventArgs', 'visualizationTypes');
            this._visualizationTypes = visualizationTypes;
        }
        return AvailableVisualizationTypesEventArgs;
    })();
    InJs.AvailableVisualizationTypesEventArgs = AvailableVisualizationTypesEventArgs;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var ChangeUserUtteranceEventArgs = (function () {
        function ChangeUserUtteranceEventArgs(userUtterance, updateOnlyUI) {
            this.userUtterance = null;
            this.userUtterance = userUtterance;
            this.updateOnlyUI = !!updateOnlyUI;
        }
        return ChangeUserUtteranceEventArgs;
    })();
    InJs.ChangeUserUtteranceEventArgs = ChangeUserUtteranceEventArgs;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var ClearInterpretResultEventArgs = (function () {
        /** Creates events args for the ClearInterpretResult event
          * @param abortInterprets - Whether to abort all interprets
          * @param clearUtterance - Whether the utterance should be cleared from the question box
          * @param hideVisualization - When set, this causes the current visualization to be hidden - rather than cleared
          */
        function ClearInterpretResultEventArgs(abortInterprets, clearUtterance, hideVisualization) {
            this.abortInterprets = false;
            this.clearUtterance = false;
            this.hideVisualization = false;
            this.abortInterprets = abortInterprets;
            this.clearUtterance = clearUtterance;
            this.hideVisualization = hideVisualization;
        }
        return ClearInterpretResultEventArgs;
    })();
    InJs.ClearInterpretResultEventArgs = ClearInterpretResultEventArgs;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var HideNotificationEventArgs = (function () {
        function HideNotificationEventArgs(id) {
            this.id = null;
            this.id = id;
        }
        return HideNotificationEventArgs;
    })();
    InJs.HideNotificationEventArgs = HideNotificationEventArgs;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var InterpretErrorEventArgs = (function (_super) {
        __extends(InterpretErrorEventArgs, _super);
        function InterpretErrorEventArgs(activityId, requestId, timedOut, statusCode, infoNavError, timeStamp, clientActivity) {
            _super.call(this, requestId, clientActivity);
            this.timedOut = false;
            this.statusCode = 0;
            this.activityId = null;
            this.timeStamp = null;
            this.infoNavError = null;
            this.timedOut = timedOut;
            this.statusCode = statusCode;
            this.activityId = activityId;
            this.timeStamp = timeStamp;
            this.infoNavError = infoNavError;
        }
        return InterpretErrorEventArgs;
    })(InJs.InterpretEventArgs);
    InJs.InterpretErrorEventArgs = InterpretErrorEventArgs;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var InterpretIssuedEventArgs = (function (_super) {
        __extends(InterpretIssuedEventArgs, _super);
        function InterpretIssuedEventArgs(requestId, clientActivity) {
            _super.call(this, requestId, clientActivity);
        }
        return InterpretIssuedEventArgs;
    })(InJs.InterpretEventArgs);
    InJs.InterpretIssuedEventArgs = InterpretIssuedEventArgs;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var InterpretResultChangedEventArgs = (function (_super) {
        __extends(InterpretResultChangedEventArgs, _super);
        function InterpretResultChangedEventArgs(response, requestId, clientActivity) {
            _super.call(this, requestId, clientActivity);
            this.response = null;
            InJs.Utility.throwIfNullOrUndefined(response, this, 'InterpretResultChangedEventArgs', 'response');
            this.response = response;
        }
        return InterpretResultChangedEventArgs;
    })(InJs.InterpretEventArgs);
    InJs.InterpretResultChangedEventArgs = InterpretResultChangedEventArgs;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var InterpretSuccessEventArgs = (function (_super) {
        __extends(InterpretSuccessEventArgs, _super);
        function InterpretSuccessEventArgs(response, clientActivity, orderId) {
            _super.call(this, response.requestId, clientActivity);
            InJs.Utility.throwIfNullOrUndefined(response, this, 'InterpretSuccessEventArgs', 'response');
            this.response = response;
            this.orderId = orderId;
        }
        return InterpretSuccessEventArgs;
    })(InJs.InterpretEventArgs);
    InJs.InterpretSuccessEventArgs = InterpretSuccessEventArgs;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var PowerViewErrorEventArgs = (function () {
        function PowerViewErrorEventArgs(error) {
            this.error = null;
            InJs.Utility.throwIfNullOrUndefined(error, this, 'PowerViewErrorEventArgs', 'error');
            this.error = error;
        }
        return PowerViewErrorEventArgs;
    })();
    InJs.PowerViewErrorEventArgs = PowerViewErrorEventArgs;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var SetVisualizationTypeEventArgs = (function () {
        function SetVisualizationTypeEventArgs(visualizationType) {
            this.visualizationType = 0;
            this.visualizationType = visualizationType;
        }
        return SetVisualizationTypeEventArgs;
    })();
    InJs.SetVisualizationTypeEventArgs = SetVisualizationTypeEventArgs;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var ShowCustomDialogEventArgs = (function () {
        function ShowCustomDialogEventArgs(titleText, dialogContent, dialogActions, onDialogDisplayed, isDismissable) {
            this.titleText = null;
            this.dialogContent = null;
            this.dialogActions = null;
            this.onDialogDisplayed = null;
            this.isDismissable = null;
            this.titleText = titleText;
            this.dialogContent = dialogContent;
            this.dialogActions = dialogActions;
            this.onDialogDisplayed = onDialogDisplayed;
            this.isDismissable = isDismissable;
        }
        return ShowCustomDialogEventArgs;
    })();
    InJs.ShowCustomDialogEventArgs = ShowCustomDialogEventArgs;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var ShowErrorEventArgs = (function () {
        function ShowErrorEventArgs(errorText, errorType, request, scriptError) {
            this.errorText = null;
            this.errorType = null;
            this.request = null;
            this.scriptError = null;
            this.errorText = errorText;
            this.errorType = errorType;
            this.request = request;
            this.scriptError = scriptError;
        }
        return ShowErrorEventArgs;
    })();
    InJs.ShowErrorEventArgs = ShowErrorEventArgs;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var ShowMessageEventArgs = (function () {
        function ShowMessageEventArgs(messageTitle, messageText) {
            this.messageTitle = null;
            this.messageText = null;
            this.messageTitle = messageTitle;
            this.messageText = messageText;
        }
        return ShowMessageEventArgs;
    })();
    InJs.ShowMessageEventArgs = ShowMessageEventArgs;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var ShowNotificationEventArgs = (function () {
        function ShowNotificationEventArgs(id, title, message, closedCallback, isDismissable, dismissTimeout, iconType, officeIconId) {
            this.id = id;
            this.title = title;
            this.message = message;
            this.closedCallback = closedCallback;
            this.isDismissable = isDismissable;
            this.iconType = iconType;
            this.officeIconId = officeIconId;
            this.dismissTimeout = dismissTimeout;
        }
        return ShowNotificationEventArgs;
    })();
    InJs.ShowNotificationEventArgs = ShowNotificationEventArgs;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var ShowPromptEventArgs = (function () {
        function ShowPromptEventArgs(promptTitle, promptText, promptActions, isDismissable) {
            this.promptTitle = null;
            this.promptText = null;
            this.promptActions = null;
            this.isDismissable = null;
            this.promptTitle = promptTitle;
            this.promptText = promptText;
            this.promptActions = promptActions;
            this.isDismissable = isDismissable;
        }
        return ShowPromptEventArgs;
    })();
    InJs.ShowPromptEventArgs = ShowPromptEventArgs;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var TermSelectionChangedEventArgs = (function () {
        function TermSelectionChangedEventArgs(termSelection) {
            this.termSelection = null;
            this.termSelection = termSelection;
        }
        return TermSelectionChangedEventArgs;
    })();
    InJs.TermSelectionChangedEventArgs = TermSelectionChangedEventArgs;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var AADConnectionGroup = (function (_super) {
        __extends(AADConnectionGroup, _super);
        function AADConnectionGroup(token, options, pageLoadActivityType) {
            _super.call(this, options, pageLoadActivityType);
            this._token = token;
            this._raiseReadyEventInternal();
        }
        AADConnectionGroup.prototype.getClusterUri = function () {
            return InJs.AppManager.current.initialClusterUri;
        };
        AADConnectionGroup.prototype.getSecurityToken = function () {
            return this._token;
        };
        AADConnectionGroup.prototype.getManagementSecurityToken = function () {
            return null;
        };
        AADConnectionGroup.prototype.getSpoContextToken = function () {
            return null;
        };
        AADConnectionGroup.prototype.getIsUsageReportingEnabled = function () {
            return false;
        };
        AADConnectionGroup.prototype.getSecurityTokenKind = function () {
            return InJs.InfoNavTokenKind.AAD;
        };
        AADConnectionGroup.prototype._refreshMetadataInternal = function (parentActivity) {
            if (this._token)
                this._raiseReadyEventInternal();
            return null;
        };
        return AADConnectionGroup;
    })(InJs.ConnectionGroup);
    InJs.AADConnectionGroup = AADConnectionGroup;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var CloudConnectionGroup = (function (_super) {
        __extends(CloudConnectionGroup, _super);
        function CloudConnectionGroup(options, pageLoadActivityType) {
            _super.call(this, options, pageLoadActivityType);
            /** The root url for the current site */
            this._siteRootUrl = null;
            /** Locations for help content */
            this._generalHelpPageUrl = null;
            this._siteRootUrl = InJs.Configuration.siteUrl;
        }
        Object.defineProperty(CloudConnectionGroup.prototype, "generalHelpPageUrl", {
            get: function () {
                return this._generalHelpPageUrl;
            },
            set: function (value) {
                this._generalHelpPageUrl = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CloudConnectionGroup.prototype, "resourcesUrl", {
            get: function () {
                return InJs.Utility.urlCombine(this._siteRootUrl, '/infonav/app/Resources');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CloudConnectionGroup.prototype, "autoAdjustResultsControlVerticalOffset", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CloudConnectionGroup.prototype, "browserHandler", {
            get: function () {
                return this._browserHandler;
            },
            set: function (value) {
                this._browserHandler = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CloudConnectionGroup.prototype, "initialUtterance", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        CloudConnectionGroup.prototype.add_resize = function (handler, data) {
            $(this).on(CloudConnectionGroup.ResizeEventName, data, handler);
        };
        CloudConnectionGroup.prototype.remove_resize = function (handler) {
            $(this).off(CloudConnectionGroup.ResizeEventName, handler);
        };
        // Header used by sharepoint to return the request id.
        CloudConnectionGroup.RequestIdHeaderName = 'request-id';
        CloudConnectionGroup.BackgroundColor = 'white';
        CloudConnectionGroup.ResizeEventName = 'Resize';
        // The estimated height of an horizontal scrollbar
        CloudConnectionGroup.HorizontalScrollbarOverlapPx = 20;
        return CloudConnectionGroup;
    })(InJs.ConnectionGroup);
    InJs.CloudConnectionGroup = CloudConnectionGroup;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var StandaloneCloudConnectionGroup = (function (_super) {
        __extends(StandaloneCloudConnectionGroup, _super);
        function StandaloneCloudConnectionGroup(options) {
            _super.call(this, options);
            this._isUserAdmin = options.isUserAdmin || false;
            this._isRuntimeModelingEnabled = options.isRuntimeModelingEnabled || false;
            this._shouldUpdateBrowserLocation = options.shouldUpdateBrowserLocation || true;
            // Create an empty app cache when in standalone mode
            this._appCache = new InJs.InfoNavAppLocalCache('STANDALONE');
            this._appCache.reset();
            var biToken = StandaloneCloudConnectionGroup.getBIToken();
            if (biToken) {
                this._securityToken = biToken;
                if (this._securityToken)
                    this._raiseReadyEventInternal();
            }
            else {
                InJs.Tracing.error('Security token not present in configuration or on the hosting page');
            }
        }
        StandaloneCloudConnectionGroup.requirementsMet = function () {
            return !InJs.StringExtensions.isNullOrEmpty(StandaloneCloudConnectionGroup.getBIToken());
        };
        StandaloneCloudConnectionGroup.getBIToken = function () {
            return InJs.Configuration.biToken || window['securityToken'];
        };
        Object.defineProperty(StandaloneCloudConnectionGroup.prototype, "globalServiceClusterUri", {
            get: function () {
                // Standalone cloud host uses the initial provided cluster uri for global service
                return this.initialClusterUri;
            },
            enumerable: true,
            configurable: true
        });
        StandaloneCloudConnectionGroup.prototype.getClusterUri = function () {
            // Standalone cloud host uses the initial provided cluster uri for regular communication
            return this.initialClusterUri;
        };
        StandaloneCloudConnectionGroup.prototype.getSecurityToken = function () {
            return this._securityToken;
        };
        StandaloneCloudConnectionGroup.prototype.setSecurityToken = function (securityToken, updateTokenOnly) {
            if (updateTokenOnly === void 0) { updateTokenOnly = false; }
            if (this._securityToken !== securityToken) {
                this._securityToken = securityToken;
                if (!updateTokenOnly) {
                    this.clearInterpretResult();
                    this.invalidate();
                }
            }
        };
        StandaloneCloudConnectionGroup.prototype.getSpoContextToken = function () {
            return null;
        };
        Object.defineProperty(StandaloneCloudConnectionGroup.prototype, "isUserAdmin", {
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StandaloneCloudConnectionGroup.prototype, "isRuntimeModelingEnabled", {
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
        StandaloneCloudConnectionGroup.prototype.getIsUsageReportingEnabled = function () {
            return true;
        };
        Object.defineProperty(StandaloneCloudConnectionGroup.prototype, "isSamplesOnlyModeEnabled", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StandaloneCloudConnectionGroup.prototype, "appCache", {
            get: function () {
                return this._appCache;
            },
            enumerable: true,
            configurable: true
        });
        StandaloneCloudConnectionGroup.prototype.getDataSourceProperties = function (dbName) {
            var properties = {};
            properties.name = dbName;
            return properties;
        };
        Object.defineProperty(StandaloneCloudConnectionGroup.prototype, "generalHelpPageUrl", {
            get: function () {
                return 'https://sampleimages.blob.core.windows.net/help/InfoNavHelp.html';
            },
            enumerable: true,
            configurable: true
        });
        StandaloneCloudConnectionGroup.prototype.shouldUpdateBrowserLocation = function () {
            return this._shouldUpdateBrowserLocation && _super.prototype.shouldUpdateBrowserLocation.call(this);
        };
        Object.defineProperty(StandaloneCloudConnectionGroup.prototype, "userPermissions", {
            get: function () {
                return 0 /* None */;
            },
            enumerable: true,
            configurable: true
        });
        StandaloneCloudConnectionGroup.prototype.getListOfDatabaseNames = function () {
            var modelNameList = [];
            return modelNameList;
        };
        StandaloneCloudConnectionGroup.prototype._refreshMetadataInternal = function (parentActivity) {
            if (this._securityToken)
                this._raiseReadyEventInternal();
            return null;
        };
        return StandaloneCloudConnectionGroup;
    })(InJs.CloudConnectionGroup);
    InJs.StandaloneCloudConnectionGroup = StandaloneCloudConnectionGroup;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** Represents a group of client side controls for InfoNav's Search Vertical */
    var PowerBIConnectionGroup = (function (_super) {
        __extends(PowerBIConnectionGroup, _super);
        function PowerBIConnectionGroup(options) {
            InJs.Utility.throwIfNullOrUndefined(options, this, 'ctor', 'options');
            InJs.Utility.throwIfNullOrUndefined(options.clusterUri, this, 'ctor', 'options.clusterUri');
            InJs.Utility.throwIfNullOrEmpty(options.publicWorkbookSources, this, 'ctor', 'options.publicWorkbookSources');
            _super.call(this, options, 19 /* IEPL */);
            this._appCache = new InJs.InfoNavAppLocalCache('POWERBICACHE_' + InJs.Utility.getUrlWithoutQueryString(window.location.href));
            this._appCache.reset();
            this._clusterUri = options.clusterUri;
            this._publicWorkbookSources = options.publicWorkbookSources;
            this._isLoadingAppMetadataNotificationDisplayed = false;
            this._appMetadataLoadingNotificationTimeoutId = 0;
            this._notificationMessage = InJs.Strings.workbooksLoadingTimeoutText;
            this.invalidate(this._pageLoadActivity);
        }
        PowerBIConnectionGroup.prototype.getClusterUri = function () {
            return this._clusterUri;
        };
        PowerBIConnectionGroup.prototype.getSecurityToken = function () {
            return this._securityToken;
        };
        PowerBIConnectionGroup.prototype.getManagementSecurityToken = function () {
            InJs.Utility.throwException(InJs.Errors.invalidOperation("PublicWorkbooksConnectionGroup does not support management operations"));
            return null;
        };
        PowerBIConnectionGroup.prototype.getSpoContextToken = function () {
            return null;
        };
        PowerBIConnectionGroup.prototype.getIsUsageReportingEnabled = function () {
            return false;
        };
        Object.defineProperty(PowerBIConnectionGroup.prototype, "isUserAdmin", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PowerBIConnectionGroup.prototype, "userPermissions", {
            get: function () {
                return 0 /* None */;
            },
            enumerable: true,
            configurable: true
        });
        PowerBIConnectionGroup.prototype.shouldUpdateBrowserLocation = function () {
            return false;
        };
        Object.defineProperty(PowerBIConnectionGroup.prototype, "appCache", {
            get: function () {
                return this._appCache;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PowerBIConnectionGroup.prototype, "isRuntimeModelingEnabled", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PowerBIConnectionGroup.prototype, "isSamplesOnlyModeEnabled", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        PowerBIConnectionGroup.prototype._refreshMetadataInternal = function (parentActivity) {
            var _this = this;
            var getAppMetadataActivity = parentActivity ? parentActivity.createChildActivity(22 /* IEPT */) : this.telemetryService.createNewActivity(22 /* IEPT */);
            // should app metadata be taking a while to load, show the user a notification
            this._appMetadataLoadingNotificationTimeoutId = window.setTimeout(function () {
                _this.showAppMetadataLoadingNotification();
            }, PowerBIConnectionGroup.AppMetadataNotificationTimeoutMs);
            var options = {};
            options.type = InJs.Utility.HttpPostMethod;
            options.url = InJs.Utility.urlCombine(this.getClusterUri(), '/infonav/api/token/');
            options.contentType = InJs.Utility.JsonContentType;
            var requestData = {
                Sources: this._publicWorkbookSources,
            };
            options.data = JSON.stringify({ request: requestData });
            var requestId = '';
            options.beforeSend = function (request) {
                InJs.HttpUtility.setCommonRequestHeaders(request);
                request.setRequestHeader(InJs.Utility.HttpAcceptHeader, InJs.Utility.JsonContentType);
                request.setRequestHeader(PowerBIConnectionGroup.PowerBIHeaderName, infonavPowerBIHeader);
                requestId = request.requestId;
                InJs.Tracing.verbose('Requesting public workbooks app metadata from server...', requestId);
                getAppMetadataActivity.addCorrelatedProperty(new InJs.CorrelatedProperty('metadataRequestId', requestId));
            };
            options.success = function (metadataResult, textStatus, request) {
                _this.hideAppMetadataLoadingNotification();
                _this._securityToken = metadataResult.DatabaseAccessToken;
                _this.setAccessTokenExpiryMessage(metadataResult.LifetimeInMinutes);
                _this._raiseReadyEventInternal();
                InJs.Tracing.verbose('Successfully retrieved app metadata from server.', requestId);
                getAppMetadataActivity.end(1 /* Success */);
            };
            options.error = function (request, textStatus, error) {
                _this.hideAppMetadataLoadingNotification();
                var errorMsg = InJs.Strings.sharePointAppLoadModelsErrorText;
                if (request.status === 403 /* Forbidden */)
                    errorMsg = InJs.Strings.tokenInvalidOrExpiredErrorText;
                _this.modalDialogService.showError(errorMsg, 6 /* Fatal */, request);
                InJs.Tracing.error('Failed to retrieve app metadata from server', requestId);
                InJs.ClientActivity.addErrorInfoIfPresent(getAppMetadataActivity, request);
                getAppMetadataActivity.end(3 /* Error */, InJs.ActivityErrors.UnknownError);
            };
            $.ajax(options);
            return getAppMetadataActivity;
        };
        PowerBIConnectionGroup.prototype.showAppMetadataLoadingNotification = function () {
            if (!this._isLoadingAppMetadataNotificationDisplayed) {
                this.notificationService.showNotification(PowerBIConnectionGroup.AppMetadataLoadingNotificationId, InJs.Strings.workbooksLoadingTimeoutTitle, this._notificationMessage, null, false, 1 /* Loading */);
                this._isLoadingAppMetadataNotificationDisplayed = true;
            }
        };
        PowerBIConnectionGroup.prototype.hideAppMetadataLoadingNotification = function () {
            window.clearTimeout(this._appMetadataLoadingNotificationTimeoutId);
            if (this._isLoadingAppMetadataNotificationDisplayed) {
                this.notificationService.hideNotification(PowerBIConnectionGroup.AppMetadataLoadingNotificationId);
                this._isLoadingAppMetadataNotificationDisplayed = false;
            }
        };
        PowerBIConnectionGroup.prototype.setAccessTokenExpiryMessage = function (timeoutInMinutes) {
            var _this = this;
            window.clearTimeout(this._accessTokenExpiredNotificationId);
            var promptActions = [
                new InJs.ModalDialogAction(InJs.Strings.dialogRefreshPageActionLabel, function (sender, dialogContent) {
                    window.location.reload();
                })
            ];
            this._accessTokenExpiredNotificationId = window.setTimeout(function () {
                _this.modalDialogService.showPrompt(InJs.Strings.connectionExpiredTitleText, InJs.Strings.tokenInvalidOrExpiredErrorText, promptActions, false);
                InJs.Tracing.verbose('Token expired error raised');
            }, timeoutInMinutes * PowerBIConnectionGroup.MillisecondsInMinute);
        };
        PowerBIConnectionGroup.AppMetadataLoadingNotificationId = '6c6c6e51-0099-43ca-94d8-41be389af351';
        PowerBIConnectionGroup.AppMetadataNotificationTimeoutMs = 3000;
        PowerBIConnectionGroup.MillisecondsInMinute = 60000;
        PowerBIConnectionGroup.PowerBIHeaderName = 'X-IN-PowerBI';
        return PowerBIConnectionGroup;
    })(InJs.ConnectionGroup);
    InJs.PowerBIConnectionGroup = PowerBIConnectionGroup;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var InteractionEventArgs = (function () {
        function InteractionEventArgs(eventName) {
            this.eventName = null;
            this.eventName = eventName;
        }
        return InteractionEventArgs;
    })();
    InJs.InteractionEventArgs = InteractionEventArgs;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var StateMachine = (function () {
        function StateMachine(definition, startState, context) {
            InJs.Utility.throwIfNullOrEmptyString(startState, this, 'StateMachine.ctor', 'startDate');
            InJs.Utility.throwIfNullOrUndefined(definition, this, 'StateMachine.ctor', 'definition');
            InJs.Utility.throwIfNotTrue(startState in definition.states, this, 'StateMachine.ctor', 'context');
            this._stateMachineDefinition = definition;
            this._currentState = startState;
            this._context = context;
            this._isBusy = false;
            this._transitionQueue = [];
        }
        Object.defineProperty(StateMachine.prototype, "currentState", {
            /**
             * Gets the current state of the StateMachine.
             * When called during transition action execution, returns the state being transitioned into.
             */
            get: function () {
                return this._currentState;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Looks up and, if found, executes a transition within the current state
         * NOTE: If there are currently other transitions being performed, the requested transition will be queued
         * This method is very forgiving by design, as it is not a requirement for states to implement all possible transitions
         * @param transitionId - The ID of the transition to be executed.
         * @param transitionData - Optional data to be provided to the transition actions.
         */
        StateMachine.prototype.enqueueTransition = function (transitionId, transitionData) {
            InJs.Utility.throwIfNullOrUndefined(transitionId, this, 'enqueueTransition', 'transitionName');
            this._transitionQueue.push({
                id: transitionId,
                data: transitionData,
            });
            this.performTransitionInternal();
        };
        /** Execute the next transition in the queue (FIFO). */
        StateMachine.prototype.performTransitionInternal = function () {
            if (this._isBusy) {
                // return immediately -- the requested transition is already queued.
                return;
            }
            this._isBusy = true;
            while (this._transitionQueue.length > 0) {
                var transitionInfo = this._transitionQueue.shift(), dict = this._stateMachineDefinition.states[this._currentState];
                var transition = dict[transitionInfo.id.toString()];
                if (transition !== undefined) {
                    // Perform the transition first
                    this._currentState = transition.toState;
                    // Perform the transition actions.  These actions have access to the currentState property.
                    // NOTE: a transtion action may enqueue other transitions after it.
                    transition.executeActions(this._context, transitionInfo.data);
                }
            }
            this._isBusy = false;
        };
        return StateMachine;
    })();
    InJs.StateMachine = StateMachine;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** This class describes a state machine in terms of possible states and how to transition between these */
    var StateMachineDefinition = (function () {
        function StateMachineDefinition() {
            this._states = {};
        }
        Object.defineProperty(StateMachineDefinition.prototype, "states", {
            /** Collection of states */
            get: function () {
                return this._states;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Adds a state transition to the current state definition
         * @param fromState - The beginning/entry state of this transition
         * @param transitionName - The name of the transition
         * @param toState - The end/exit state of this transition
         * @param actions - The sequence of actions to be performed immediately after the transition
         */
        StateMachineDefinition.prototype.addTransition = function (fromState, transitionId, toState, actions) {
            InJs.Utility.throwIfNullOrEmptyString(fromState, this, 'AddTransition', 'fromState');
            InJs.Utility.throwIfNullOrUndefined(transitionId, this, 'AddTransition', 'transitionId');
            InJs.Utility.throwIfNullOrEmptyString(toState, this, 'AddTransition', 'toState');
            InJs.Utility.throwIfNullOrUndefined(actions, this, 'AddTransition', 'actions');
            var transitions = this._states[fromState];
            if (transitions === undefined) {
                this._states[fromState] = transitions = {};
            }
            transitions[transitionId.toString()] = new InJs.Transition(fromState, actions, toState);
            // Also, register the toState, for symmetry.
            if (!(toState in this._states)) {
                this._states[toState] = {};
            }
        };
        /**
         * Gets the unordered set of transitions available directly from a given startState.  Assumes the input is an enum.
         * @param stateState - the state that to consider the start point.
         * @param isTInputIntegral - indicates whether TInput is for an integral type.  Ideally the compiler could figure this out for us.
         */
        StateMachineDefinition.prototype.getTransitionsFrom = function (startState, isTInputIntegral) {
            if (isTInputIntegral === void 0) { isTInputIntegral = true; }
            InJs.Utility.throwIfNullOrEmptyString(startState, this, 'getTransitionStatesFrom', 'startState');
            InJs.Utility.throwIfNotTrue(startState in this._states, this, 'getTransitionStatesFrom', 'startState');
            var result = [], startStateInfo = this._states[startState];
            for (var transitionId in startStateInfo) {
                var transition = startStateInfo[transitionId];
                result.push(isTInputIntegral ? parseInt(transitionId) : transitionId);
            }
            return result;
        };
        return StateMachineDefinition;
    })();
    InJs.StateMachineDefinition = StateMachineDefinition;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var Transition = (function () {
        function Transition(fromState, actions, toState) {
            InJs.Utility.throwIfNullOrEmptyString(fromState, this, 'Transition.ctor', 'fromState');
            InJs.Utility.throwIfNullOrUndefined(actions, this, 'Transition.ctor', 'actions');
            InJs.Utility.throwIfNullOrEmptyString(toState, this, 'Transition.ctor', 'toState');
            this._fromState = fromState;
            this._actions = actions;
            this._toState = toState;
        }
        Object.defineProperty(Transition.prototype, "toState", {
            get: function () {
                return this._toState;
            },
            enumerable: true,
            configurable: true
        });
        Transition.prototype.executeActions = function (context, transitionData) {
            for (var i = 0; i < this._actions.length; ++i) {
                this._actions[i](context, transitionData);
            }
        };
        return Transition;
    })();
    InJs.Transition = Transition;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
// IMPORTANT: Order matters in this file, think of it as loading a sequence of interdependant js files.
/// <reference path="..\StateMachine\InteractionEvent.ts" />
/// <reference path="..\StateMachine\StateMachine.ts" />
/// <reference path="..\StateMachine\StateMachineDefinition.ts" />
/// <reference path="..\StateMachine\Transition.ts" /> 
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var QuestionBox;
    (function (QuestionBox) {
        var Constants;
        (function (Constants) {
            // The name for the interaction event - this event is used to transport state machine events to the top level control
            Constants.OnInteractionEventName = 'OnInteraction';
            // The names of the possible states within the Question Box state machine
            Constants.InactiveStateName = 'Inactive';
            Constants.TypingStateName = 'Typing';
            Constants.BrowseSuggestionsStateName = 'BrowseSuggestions';
            Constants.TermSelectionStateName = 'TermSelection';
            Constants.ModelingStateName = 'Modeling';
            // The names of the possible transition events within the Question Box state machine
            Constants.BeginSessionEventName = 'BeginSession';
            Constants.EndSessionEventName = 'EndSession';
            Constants.ClearQueryEventName = 'ClearQuery';
            Constants.ConfirmQueryEventName = 'ConfirmQuery';
            Constants.TextChangedEventName = 'TextChanged';
            Constants.CompleteQueryEventName = 'CompleteText';
            Constants.NavigateUpEventName = 'NavigateUp';
            Constants.NavigateDownEventName = 'NavigateDown';
            Constants.NavigateOutOfBoundsEventName = 'NavigateOutOfBounds';
            Constants.TextSuggestionSelectedEventName = 'TextSuggestionItemSelected';
            Constants.TextSuggestionConfirmedEventName = 'TextSuggestionConfirmed';
            Constants.SuggestionItemConfirmedEventName = 'SuggestionItemConfirmed';
            Constants.TermSelectedEventName = 'TermSelected';
            Constants.ResultReadyEventName = 'ResultReady';
            Constants.ResultChangedEventName = 'ResultChanged';
            Constants.InterpretFailedEventName = 'InterpretFailed';
            Constants.BeginModelingSessionEventName = 'BeginModelingSession';
            Constants.EndModelingSessionEventName = 'EndModelingSession';
        })(Constants = QuestionBox.Constants || (QuestionBox.Constants = {}));
    })(QuestionBox = InJs.QuestionBox || (InJs.QuestionBox = {}));
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var QuestionBox;
    (function (QuestionBox) {
        var ModelLoadingStatus;
        (function (ModelLoadingStatus) {
            ModelLoadingStatus[ModelLoadingStatus["NotStarted"] = 0] = "NotStarted";
            ModelLoadingStatus[ModelLoadingStatus["InProgress"] = 1] = "InProgress";
            ModelLoadingStatus[ModelLoadingStatus["Completed"] = 2] = "Completed";
        })(ModelLoadingStatus || (ModelLoadingStatus = {}));
        /** The Question Box client side control */
        var QuestionBoxControl = (function (_super) {
            __extends(QuestionBoxControl, _super);
            /**
             * Initializes an instance of the QuestionBoxControl class
             * @param domElement - The host element for the control
             */
            function QuestionBoxControl(element, options) {
                var _this = this;
                _super.call(this, element, options);
                /** Initializes static members of the QuestionBoxControl class */
                this._stateMachine = null;
                /** Root DOM element for this control */
                this._controlRoot = null;
                /** The Question box caret decorator */
                this._caretDecorator = null;
                /** Private field for the suggestion list within this control */
                this._suggestionList = null;
                /** Private field for the text input within this control */
                this._textInput = null;
                /** Buffer for user input store/restore operations */
                this._userInput = '';
                /** Timeout id for clearing interpret result after a delay */
                this._clearInterpretResultTimerId = 0;
                /** Whether the UI is currently showing the loading models notification */
                this._isLoadingModelsNotificationDisplayed = false;
                /** Whether the collage is currently visible */
                this._isCollageVisible = false;
                /** Timeout id for reporting on answer question activities */
                this._answerQuestionReportingTimerId = 0;
                this._placeholder = '';
                this._placeholderOnInit = '';
                this._utteranceFeedbackTooltip = '';
                this._telemetryHostName = '';
                this._interpretOptions = options.interpretRequestOptons;
                this._disableBlur = options.disableBlurOnConfirmQuery;
                this._disableNotification = options.disableNotification;
                this._telemetryHostName = options.telemetryHostName;
                this._getInterpretRequestScope = options.getInterpretRequestScope;
                // Create host for text input control
                this._controlRoot = $(QuestionBoxControl.QuestionBoxControlHtml);
                element.append(this._controlRoot);
                var questionBoxContainer = this._controlRoot.find(QuestionBoxControl.QuestionBoxControlSelector);
                this._textInput = new QuestionBox.TextInputControl(questionBoxContainer);
                this._suggestionList = new QuestionBox.SuggestionListControl(element, questionBoxContainer, { group: this.connectionGroup });
                this._textInput.add_interaction(this.interactionEventHandler, this);
                this._suggestionList.add_interaction(this.interactionEventHandler, this);
                this._caretDecorator = this._controlRoot.siblings(QuestionBoxControl.QuestionBoxCaretContainerSelector).find(QuestionBoxControl.QuestionBoxCaretSelector);
                this._stateMachine = new InJs.StateMachine(QuestionBox.QuestionBoxStateMachine.definition, QuestionBox.Constants.InactiveStateName, this);
                this._unreportedActivities = [];
                var initialUtterance = this.connectionGroup.initialUtterance;
                this._hasInteraction = false;
                if (!InJs.StringExtensions.isNullOrUndefinedOrWhiteSpaceString(initialUtterance)) {
                    this._textInput.text = initialUtterance;
                    this.interpretInternal(this.connectionGroup.visualizationOnPageLoadActivity).onCompleted(function (answerQuestionActivity) {
                        // Only end page load activity if the connection group was loaded as well. That is if we 
                        // have an initial utterance that we're visualizing as part of page load and this is
                        // cancelled before we load app metadata don't end page load just yet.
                        if (_this.connectionGroup.visualizationOnPageLoadActivity && _this.connectionGroup.getIsReady())
                            _this.connectionGroup.visualizationOnPageLoadActivity.end(answerQuestionActivity.activityEndResult, answerQuestionActivity.error);
                    });
                }
                this._textInput.focus();
                this._defineOption(new InJs.BooleanControllerOptionDefinition(QuestionBoxControl.AutocompleteOptionName, function () {
                    return _this._textInput.isAutocompleteEnabled;
                }, function (value) {
                    _this._textInput.isAutocompleteEnabled = value;
                }, false, true), options);
                this._interpretOptions = options.interpretRequestOptons;
                this.registerAppActions();
            }
            Object.defineProperty(QuestionBoxControl.prototype, "textInput", {
                // TODO: Remove these getters, we should instead declare a test hook interface to access these members
                get: function () {
                    return this._textInput;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QuestionBoxControl.prototype, "suggestionList", {
                get: function () {
                    return this._suggestionList;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QuestionBoxControl.prototype, "placeholder", {
                get: function () {
                    return this._placeholder;
                },
                set: function (value) {
                    this._placeholder = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QuestionBoxControl.prototype, "placeholderOnInit", {
                get: function () {
                    return this._placeholderOnInit;
                },
                set: function (value) {
                    this._placeholderOnInit = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QuestionBoxControl.prototype, "utteranceFeedbackTooltip", {
                get: function () {
                    return this._utteranceFeedbackTooltip;
                },
                set: function (value) {
                    this._utteranceFeedbackTooltip = value;
                    if (this._userFeedbackBtn) {
                        this._userFeedbackBtn.attr(InJs.DOMConstants.titleAttribute, value);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(QuestionBoxControl.prototype, "getLocalizedResource", {
                get: function () {
                    return this._getLocalizedResource;
                },
                set: function (value) {
                    this._getLocalizedResource = value;
                },
                enumerable: true,
                configurable: true
            });
            QuestionBoxControl.hasInteraction = function (questionBox) {
                questionBox._hasInteraction = true;
            };
            //#region State machine actions
            /**
             * Transition Action: Issue a new interpret request
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.interpret = function (questionBox) {
                questionBox.interpretInternal();
            };
            //#region State machine actions
            /**
             * Transition Action: Mark that a query has been confirmed (or in simpler
             * terms, the user typed something like enter/forward-arrow, clicked on a
             * suggestion, navigated away from the box, or some other similar action
             * that would imply he is done typing)
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.userUtteranceConfirmed = function (questionBox) {
                questionBox.userUtteranceConfirmedInternal();
            };
            /**
             * Transition Action: Clear the currently displayed interpret result in PowerView
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.clearInterpretResult = function (questionBox) {
                questionBox.clearInterpretResultInternal(true, true);
            };
            /**
             * Transition Action: Clears the contents of the user input buffer
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.clearUserInputBuffer = function (questionBox) {
                questionBox.clearUserInputBufferInternal();
            };
            /**
             * Transition Action: Stores the user input into a buffer
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.storeUserInput = function (questionBox) {
                questionBox.storeInputInternal();
            };
            /**
             * Transition Action: Restores the user input to the stored value
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.restoreUserInput = function (questionBox) {
                questionBox.restoreInputInternal();
            };
            /**
             * Transition Action: Sets the input text to the currently selected item in the suggestionsList control
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.processSuggestion = function (questionBox) {
                questionBox.connectionGroup.telemetryService.notifyUserSelectedSuggestion(11 /* IQSS */);
                if (questionBox._suggestionList.currentSelectionType === 0 /* Text */) {
                    questionBox._stateMachine.enqueueTransition(QuestionBox.Constants.TextSuggestionConfirmedEventName);
                }
                else if (questionBox._suggestionList.currentSelectionType === 1 /* RuntimeModelingAction */) {
                    questionBox.connectionGroup.interpretService.interpretAsync(questionBox._textInput.text, null, null, null, null, questionBox._getInterpretRequestScope ? questionBox._getInterpretRequestScope() : null);
                }
            };
            /**
             * Transition Action: Exits runtime modeling mode
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.exitModelingMode = function (questionBox) {
            };
            /**
             * Transition Action: Sets the input text to the currently selected item in the suggestionsList control
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.setInputTextToSelectedSuggestion = function (questionBox) {
                questionBox._textInput.setInputText(questionBox._suggestionList.currentSelectionText, false);
            };
            /**
             * Transition Action: Set the focus on the text input box
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.textInput_Focus = function (questionBox) {
                var textInput = questionBox._textInput;
                textInput.focus();
            };
            /**
             * Transition Action: unset the focus from the text input box
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.textInput_Blur = function (questionBox) {
                var textInput = questionBox._textInput;
                if (!questionBox._disableBlur)
                    textInput.blur();
            };
            /**
             * Transition Action: Clear the current term selection
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.textInput_ClearTermSelection = function (questionBox) {
                questionBox.clearTermSelectionInternal();
            };
            /**
             * Transition Action: Complete to the current autocomplete text inside the text input control
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.textInput_CompleteInput = function (questionBox) {
                questionBox.connectionGroup.telemetryService.notifyUserSelectedAutocomplete(10 /* IQSC */);
                var textInput = questionBox._textInput;
                textInput.completeInput();
            };
            /**
             * Transition Action: Clears the current autocomplete in the text input control
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.textInput_ClearAutoCompletion = function (questionBox) {
                var textInput = questionBox._textInput;
                textInput.clearAutoCompletion();
            };
            /**
             * Transition Action: Shows the current autocomplete in the text input control
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.textInput_ShowAutoCompletion = function (questionBox) {
                var textInput = questionBox._textInput;
                textInput.showAutoCompletion();
            };
            /**
             * Transition Action: Returns the text input control to a blank state
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.textInput_Clear = function (questionBox) {
                InJs.Tracing.verbose('Clearing current utterance due to user action');
                var textInput = questionBox._textInput;
                textInput.clear();
            };
            /**
             * Transition Action: Clears the current contents of the suggestion list control
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.suggestionList_Clear = function (questionBox) {
                var suggestionList = questionBox._suggestionList;
                suggestionList.clear(false);
            };
            /**
             * Transition Action: Clears the current contents of the suggestion list control, preserving the restament (if any)
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.suggestionList_ClearPreserveRestatement = function (questionBox) {
                var suggestionList = questionBox._suggestionList;
                suggestionList.clear(true);
            };
            /**
             * Transition Action: Clears the current selection within the suggestion list control
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.suggestionList_ClearSelection = function (questionBox) {
                var suggestionList = questionBox._suggestionList;
                suggestionList.clearSelection();
            };
            /**
             * Transition Action: Selects the previous item inside the suggestion list control
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.suggestionList_SelectPrevious = function (questionBox) {
                var suggestionList = questionBox._suggestionList;
                questionBox.clearTermSelectionInternal();
                suggestionList.selectPrevious();
            };
            /**
             * Transition Action: Selects the next item inside the suggestion list control
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.suggestionList_SelectNext = function (questionBox) {
                var suggestionList = questionBox._suggestionList;
                questionBox.clearTermSelectionInternal();
                suggestionList.selectNext();
            };
            /**
             * Transition Action: Triggers a manual update of the currently selected term, for cases in which the result goes out of sync
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.updateTermSelection = function (questionBox) {
                var textInput = questionBox.textInput;
                textInput.updateTermSelection();
            };
            /**
             * Transition Action: Handle selection of a term inside the utterance. And display term suggestions
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.selectTerm = function (questionBox) {
                var questionBox = questionBox;
                questionBox.selectTermInternal();
            };
            /**
             * Transition Action: Notify the connection group that the term selection has changed
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.notifyTermSelection = function (questionBox) {
                questionBox.connectionGroup.bridge.notifyTermSelectionChanged(questionBox._textInput.selection);
            };
            /**
             * Transition Action: Display result from interpret call
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.displayResult = function (questionBox) {
                questionBox.displayResultInternal();
            };
            /**
             * Transition Action: Display a regular query result from interpret call
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.displayQueryResult = function (questionBox) {
                questionBox.displayQueryResultInternal(true, true);
            };
            /**
             * Transition Action: Display a result from interpret call containing modeling data
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.displayModelingResult = function (questionBox) {
                questionBox.displayModelingResultInternal();
            };
            /**
             * Transition Action: Update result from interpret call without refreshing the UI
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.updateResult = function (questionBox) {
                questionBox.displayQueryResultInternal(false, false);
            };
            /**
             * Transition Action: Update the browser's location after a timeout
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.updateBrowserLocationAfterTimeout = function (questionBox) {
                questionBox.updateBrowserLocationInternalAfterTimeout();
            };
            /**
             * Transition Action: Update the browser's location
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.updateBrowserLocation = function (questionBox) {
                questionBox.updateBrowserLocationInternal();
            };
            /**
             * Transition Action: Clear the interpret result after a timeout
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.clearInterpretResultAfterTimeout = function (questionBox) {
                questionBox.clearInterpretResultInternalAfterTimeout();
            };
            /**
             * Transition Action: Clears the timer for clearing interpret result
             * @param questionBox - The question box instance for the transition action
             */
            QuestionBoxControl.clearClearInterpretResultTimer = function (questionBox) {
                questionBox.clearClearInterpretResultTimerInternal();
            };
            //#endregion
            /**
             * Event handler for the interpretation success event
             * @param e - Interpret success event arguments
             */
            QuestionBoxControl.prototype._onInterpretSuccess = function (e) {
                if (this._hasInterpretResponse()) {
                    this._stateMachine.enqueueTransition(QuestionBox.Constants.ResultReadyEventName);
                    this.showAppActions();
                    this.updateLoadingMessage(2 /* Completed */, 0 /* Unknown */);
                    this.setUserFeedbackBtnVisible(true);
                }
            };
            /**
             * Event handler for the interpretation error event
             * @param e - Interpret error event arguments
             */
            QuestionBoxControl.prototype._onInterpretError = function (e) {
                this.setUserFeedbackBtnVisible(false);
                this._stateMachine.enqueueTransition(QuestionBox.Constants.InterpretFailedEventName);
            };
            /**
             * Event handler for the interpret result cleared event
             * @param e - interpret result cleared event arguments
             */
            QuestionBoxControl.prototype._onInterpretResultCleared = function (e) {
                // Note that we can't just perform the Clear StateMachine transition as this will cause an infinite loop of 
                // clear events getting fired. Instead we just clear the parts manually.
                this._suggestionList.clear(!e.clearUtterance);
                InJs.Tracing.verbose('Interpret result cleared');
                if (e.clearUtterance) {
                    this._textInput.clear();
                    this.clearBrowserHandler();
                    InJs.Tracing.verbose('User utterance cleared');
                }
                if (this._textInput.hasFocus() && !this._isCollageVisible) {
                    this._suggestionList.displaySuggestions(this._textInput.text);
                }
                this.hideAppActions();
                this.setUserFeedbackBtnVisible(false);
            };
            /**
             * Event handler when the interpret result is changed due to back/forward
             * navigation. The method updates the utterance showed in the input text box and
             * performs transition to ensure proper updates to the state machine
             * @param e - interpret result changed event arguments
             */
            QuestionBoxControl.prototype._onInterpretResultChanged = function (e) {
                this._stateMachine.enqueueTransition(QuestionBox.Constants.ResultChangedEventName);
            };
            /**
             * Event handler when the user utterance needs to be changed. The method puts the
             * focus on the text input control, updates the user utterance and performs transition
             * to ensure proper updates to the state machine are made.
             * @param e - Change user utterance event arguments
             */
            QuestionBoxControl.prototype._onChangeUserUtterance = function (e) {
                this._textInput.focus();
                this._textInput.text = e.userUtterance;
                if (!e.updateOnlyUI)
                    this._stateMachine.enqueueTransition(QuestionBox.Constants.TextChangedEventName);
            };
            /**
             * Event handler when a power view error occured.
             * @param e - The power view error event args.
             */
            QuestionBoxControl.prototype._onPowerViewError = function (e) {
                this._stateMachine.enqueueTransition(QuestionBox.Constants.InterpretFailedEventName);
            };
            /**
             * Event handler for when the collage control visibility changes
             * @param isCollageVisible - Whether the collage control is visible
             */
            QuestionBoxControl.prototype._onCollageVisibilityChanged = function (isCollageVisible) {
                this._isCollageVisible = isCollageVisible;
                if (isCollageVisible) {
                    this._suggestionList.clear(true);
                }
            };
            /**
             * Event handler for when the interpretation service has timed out on a query and is retrying
             */
            QuestionBoxControl.prototype._onInterpretRetryInProgress = function () {
                this.clearInterpretResultInternal(false, false);
                this.showModelsLoadingNotification();
            };
            /**
             * Event handler for when the maximum number of retries has been exceeded for a single query
             */
            QuestionBoxControl.prototype._onInterpretRetryCountExceeded = function () {
                this.updateLoadingMessage(2 /* Completed */, 0 /* Unknown */);
                if (!this._disableNotification)
                    this.connectionGroup.bridge.showError(this.localize('InterpretRetryMaxCountExceededMessageText', InJs.Strings.interpretRetryMaxCountExceededMessageText), 5 /* UnexpectedError */);
            };
            /**
             * Event handler for when probe request is fired
             */
            QuestionBoxControl.prototype._onInterpretProbeInProgress = function () {
                this.showModelsLoadingNotification(QuestionBoxControl.ProbeInProgressNotificationDelayMs);
                this.updateLoadingMessage(1 /* InProgress */);
            };
            /**
             * Event handler for when the probe request succeeded
             */
            QuestionBoxControl.prototype._onInterpretProbeSuccess = function () {
                clearTimeout(this._modelLoadingDelayTimeoutId);
                this.updateLoadingMessage(2 /* Completed */, 1 /* Success */);
            };
            QuestionBoxControl.prototype._onConnectionGroupInvalidated = function () {
                this.updateLoadingMessage(0 /* NotStarted */);
            };
            /**
             * Event handler for when the probe request failed
             */
            QuestionBoxControl.prototype._onInterpretProbeError = function () {
                this.updateLoadingMessage(2 /* Completed */, 3 /* Error */);
            };
            QuestionBoxControl.prototype.showAppActions = function () {
                if (this._copyResultLinkBtn) {
                    this._copyResultLinkBtn.css(InJs.CssConstants.displayProperty, InJs.CssConstants.inlineBlockValue);
                }
                if (this._shareResultLinkBtn) {
                    this._shareResultLinkBtn.css(InJs.CssConstants.displayProperty, InJs.CssConstants.inlineBlockValue);
                }
                if (this._flagUtteranceBtn && this.connectionGroup.getIsUsageReportingEnabled()) {
                    this._flagUtteranceBtn.css(InJs.CssConstants.displayProperty, InJs.CssConstants.inlineBlockValue);
                }
            };
            QuestionBoxControl.prototype.hideAppActions = function () {
                if (this._copyResultLinkBtn) {
                    this._copyResultLinkBtn.css(InJs.CssConstants.displayProperty, InJs.CssConstants.noneValue);
                }
                if (this._shareResultLinkBtn) {
                    this._shareResultLinkBtn.css(InJs.CssConstants.displayProperty, InJs.CssConstants.noneValue);
                }
                if (this._flagUtteranceBtn) {
                    this._flagUtteranceBtn.css(InJs.CssConstants.displayProperty, InJs.CssConstants.noneValue);
                }
            };
            QuestionBoxControl.prototype.setUserFeedbackBtnVisible = function (visible) {
                if (this._userFeedbackBtn) {
                    this._userFeedbackBtn.css(InJs.CssConstants.displayProperty, visible && this.connectionGroup.getIsUsageReportingEnabled() ? InJs.CssConstants.inlineBlockValue : InJs.CssConstants.noneValue);
                }
            };
            QuestionBoxControl.prototype.registerAppActions = function () {
                var _this = this;
                this._shareResultLinkBtn = $('#shareResultBtn.in_navigationBtn');
                this._shareResultLinkBtn.attr(InJs.DOMConstants.titleAttribute, InJs.Strings.shareResultLinkText);
                this._shareResultLinkBtn.on(InJs.DOMConstants.mouseClickEventName, function (e) {
                    _this.connectionGroup.telemetryService.notifyUserShareResultViaEmail(16 /* ISRE */);
                });
                this._flagUtteranceBtn = $('#flagUtteranceBtn.in_navigationBtn').attr(InJs.DOMConstants.titleAttribute, InJs.Strings.flagUtteranceTooltip).on(InJs.DOMConstants.mouseClickEventName, function (e) {
                    // Clicking the flag icon for an instance of an utterance is idempotent, so we change
                    // the UI to the selected version of the icon instead of toggling.
                    if (!_this._flagUtteranceBtn.hasClass(QuestionBoxControl.SelectedIconClass)) {
                        _this._flagUtteranceBtn.addClass(QuestionBoxControl.SelectedIconClass);
                        _this.connectionGroup.usageService.setLastUtteranceAsUserFlagged();
                    }
                });
                this._userFeedbackBtn = $('#userFeedbackBtn.in_navigationBtn').attr(InJs.DOMConstants.titleAttribute, this._utteranceFeedbackTooltip || InJs.Strings.utteranceFeedbackTooltip).on(InJs.DOMConstants.mouseClickEventName, function (e) {
                    var promptActions = [
                        new InJs.ModalDialogAction(_this.localize('ModalDialog_Send', InJs.Strings.dialogSendActionLabel), function (sender, dialogContent) {
                            _this.connectionGroup.modalDialogService.hideDialog();
                            var rawValue = $("input[type='radio']:checked", dialogContent).val();
                            if (rawValue) {
                                var feedback = parseInt(rawValue);
                                _this.connectionGroup.usageService.setFeedbackForLastUtterance(feedback);
                                if (feedback === 1 /* Bad */)
                                    _this.connectionGroup.usageService.setLastUtteranceAsUserFlagged();
                            }
                        }, null, null, true),
                        new InJs.ModalDialogAction(_this.localize('ModalDialog_Cancel', InJs.Strings.dialogCancelActionLabel), function (sender, dialogContent) {
                            _this.connectionGroup.modalDialogService.hideDialog();
                        })
                    ];
                    var radioButtonContainer = InJs.DomFactory.div().addClass("utteranceFeedbackOptions");
                    var dialogContent = InJs.DomFactory.div().append(InJs.DomFactory.div().text(_this.localize('UtteranceFeedbackDialogPrompt', InJs.Strings.utteranceFeedbackDialogPrompt)), radioButtonContainer);
                    radioButtonContainer.append(QuestionBoxControl.createFeedbackRadioButton(_this.localize('UtteranceFeedbackResultGood', InJs.Strings.utteranceFeedbackResultGood), 3 /* Good */, dialogContent), QuestionBoxControl.createFeedbackRadioButton(_this.localize('UtteranceFeedbackResultMedium', InJs.Strings.utteranceFeedbackResultMedium), 2 /* Medium */, dialogContent), QuestionBoxControl.createFeedbackRadioButton(_this.localize('UtteranceFeedbackResultBad', InJs.Strings.utteranceFeedbackResultBad), 1 /* Bad */, dialogContent));
                    _this.connectionGroup.modalDialogService.showCustomDialog(_this.localize('UtteranceFeedbackDialogTitle', InJs.Strings.utteranceFeedbackDialogTitle), dialogContent, promptActions, function () {
                    }, false);
                });
                this.setUserFeedbackBtnVisible(false);
                // only initialize the copy result link button if the browser supports clipboardData
                if (InJs.Utility.canUseClipboard() && window.clipboardData && clipboardData.setData) {
                    this._copyResultLinkBtn = $('#copyResultBtn.in_navigationBtn');
                    this._copyResultLinkBtn.attr(InJs.DOMConstants.titleAttribute, InJs.Strings.copyResultLinkText);
                    this._copyResultLinkBtn.on(InJs.DOMConstants.mouseClickEventName, function (e) {
                        clipboardData.setData('text', window.location.href);
                        _this.connectionGroup.telemetryService.notifyUserCopyResultUrlToClipboard(15 /* ICRU */);
                        _this.bridge.showNotification(QuestionBoxControl.UserCopyResultUrlToClipboardNotificationId, InJs.Strings.resultLinkCopiedNotificationText, null, null, false, 2000, 2 /* Alert */);
                    });
                }
            };
            QuestionBoxControl.createFeedbackRadioButton = function (text, value, dialogContent) {
                return $('<input type="radio" name="utteranceFeedback" id="utteranceFeedback%VALUE%" value="%VALUE%" /><label for="utteranceFeedback%VALUE%">%TEXT%</label>'.replace("%TEXT%", text).replace(/%VALUE%/g, value.toString(10))).on(InJs.DOMConstants.changeEventName, function (e) {
                    // Mark "Submit" as enabled now that a radio button is checked.
                    dialogContent.parent().parent().find(".infonav-dialogActions > input").filter(":first").prop("disabled", false);
                });
            };
            QuestionBoxControl.prototype.updateShareResultLink = function (result) {
                var shareUrl = window.location.protocol + '//' + window.location.hostname + window.location.pathname + '?k=' + encodeURIComponent(result.utterance);
                var emailBody = InJs.StringExtensions.format(InJs.Strings.shareResultEmailBodyTemplateText, shareUrl);
                var linkValue = InJs.StringExtensions.format('mailto:?Subject={0}&Body={1}', encodeURIComponent(InJs.Strings.shareResultEmailSubjectText), encodeURIComponent(emailBody));
                if (this._shareResultLinkBtn) {
                    this._shareResultLinkBtn.attr(InJs.DOMConstants.hrefAttribute, linkValue);
                }
            };
            QuestionBoxControl.prototype.showModelsLoadingNotification = function (delay) {
                var _this = this;
                if (delay === void 0) { delay = 0; }
                if (this._disableNotification)
                    return;
                if (!this._isLoadingModelsNotificationDisplayed) {
                    var dialogContent = this.localize('WorkbooksLoadingTimeoutText', InJs.Strings.workbooksLoadingTimeoutText);
                    this._modelLoadingDelayTimeoutId = setTimeout(function () {
                        _this.connectionGroup.bridge.showNotification(QuestionBoxControl.ModelsLoadingNotificationId, _this.localize('WorkbooksLoadingTimeoutTitle', InJs.Strings.workbooksLoadingTimeoutTitle), dialogContent, null, false, 1 /* Loading */);
                    }, delay);
                    this._isLoadingModelsNotificationDisplayed = true;
                }
            };
            /**
             * Event handler for interaction events within the control
             * @param sender - The sender for this event
             * @param e - The interaction event arguments
             */
            QuestionBoxControl.prototype.interactionEventHandler = function (e, args) {
                var self = e.data;
                self._stateMachine.enqueueTransition(args.eventName);
                if (args.eventName === QuestionBoxControl.InternalTextChangedEventName) {
                    self.connectionGroup.bridge.raise(InJs.ConnectionGroup.TextChangedEventName);
                }
            };
            QuestionBoxControl.prototype.userUtteranceConfirmedInternal = function () {
                this.connectionGroup.bridge.notifyUserUtteranceConfirmed();
            };
            /** Issues a query to the Interpretation service using the current text input */
            QuestionBoxControl.prototype.interpretInternal = function (parentActivity) {
                // First mark that the user has interacted with the control.
                this._hasInteraction = true;
                var answerQuestionActivity = this.createAnswerQuestionActivity(parentActivity);
                var utterance = InJs.XmlUtility.removeInvalidCharacters(this._textInput.text);
                this.connectionGroup.interpretService.interpretAsync(utterance, answerQuestionActivity, null, null, this._interpretOptions, this._getInterpretRequestScope ? this._getInterpretRequestScope() : null);
                // Clear flag UI state, as utterance is changing
                if (this._flagUtteranceBtn) {
                    this._flagUtteranceBtn.removeClass(QuestionBoxControl.SelectedIconClass);
                }
                return answerQuestionActivity;
            };
            QuestionBoxControl.prototype.clearUserInputBufferInternal = function () {
                this._userInput = '';
            };
            QuestionBoxControl.prototype.storeInputInternal = function () {
                this._userInput = this._textInput.text;
                this._textInput.hideAutoCompletion();
            };
            QuestionBoxControl.prototype.restoreInputInternal = function () {
                if (this._userInput.length > 0) {
                    this._textInput.setInputText(this._userInput, false);
                    this._textInput.showAutoCompletion();
                    this._userInput = '';
                }
                if (this._hasInterpretResponse()) {
                    this._textInput.applyNLResult(this._currentInterpretResponse.result);
                }
            };
            QuestionBoxControl.prototype.displayResultInternal = function () {
                this._stateMachine.enqueueTransition(QuestionBox.Constants.ResultReadyEventName);
            };
            QuestionBoxControl.prototype.displayQueryResultInternal = function (showAutocompletion, showSuggestions, termSelection) {
                if (this._isCollageVisible || this._hasInteraction == false)
                    // Do not show the textbox dropdown and autocomplete if the collage is
                    // visible or if the user has not started interaction.
                    return;
                if (this._hasInterpretResponse()) {
                    this._suggestionList.displaySuggestions(this._textInput.text, this._currentInterpretResponse, termSelection, !showSuggestions);
                    this._textInput.applyNLResult(this._currentInterpretResponse.result, showAutocompletion);
                    this.updateShareResultLink(this._currentInterpretResponse.result);
                }
                else {
                    this._suggestionList.displaySuggestions(this._textInput.text);
                }
            };
            QuestionBoxControl.prototype.displayModelingResultInternal = function (termSelection) {
                if (this._hasInterpretResponse()) {
                    this._textInput.applyNLResult(this._currentInterpretResponse.result);
                }
            };
            QuestionBoxControl.prototype.clearTermSelectionInternal = function () {
                this._textInput.clearTermHighlights();
            };
            QuestionBoxControl.prototype.selectTermInternal = function () {
                var termSelection = this._textInput.selection;
                if (this._hasInterpretResponse() && !termSelection.isUserRangeSelection && this._currentInterpretResponse.result.hasSuggestionsForTermSelection(termSelection)) {
                    // Since the term has valid suggestions highlight the term and show the results.
                    this._textInput.highlightSelectedTerm();
                    this.displayQueryResultInternal(true, true, termSelection);
                    return;
                }
                // Getting here means that nothing was shown, so display the result without selection.
                this.displayQueryResultInternal(true, true);
            };
            /** Clears any interpret result visualized */
            QuestionBoxControl.prototype.clearInterpretResultInternal = function (abortInterprets, clearUtterance, hideVisualization) {
                InJs.Tracing.verbose('QuestionBoxControl requested clearing the current Interpret result');
                this.clearBrowserHandler();
                this.connectionGroup.bridge.clearInterpretResult(abortInterprets, clearUtterance, hideVisualization);
                this.stopAnswerQuestionReportingTimer();
            };
            /** Clears the utterance in the browser handler */
            QuestionBoxControl.prototype.clearBrowserHandler = function () {
                if (this.connectionGroup.browserHandlerService) {
                    this.connectionGroup.browserHandlerService.clearBrowserLocation();
                }
            };
            /** Clears the timeout for clearing interpret result */
            QuestionBoxControl.prototype.clearClearInterpretResultTimerInternal = function () {
                window.clearTimeout(this._clearInterpretResultTimerId);
            };
            /** Clears the interpret result after a timeout */
            QuestionBoxControl.prototype.clearInterpretResultInternalAfterTimeout = function () {
                var _this = this;
                this.clearClearInterpretResultTimerInternal();
                this._clearInterpretResultTimerId = window.setTimeout(function () {
                    if (_this._hasInterpretResponse()) {
                        _this.clearInterpretResultInternal(false, false, true);
                    }
                }, QuestionBoxControl.ClearInterpretResultTimeoutInMilliseconds);
            };
            /** Updates the browser's location by invoking InterpretationBroker */
            QuestionBoxControl.prototype.updateBrowserLocationInternal = function () {
                if (this.connectionGroup.browserHandlerService && this._hasInterpretResponse()) {
                    this.connectionGroup.browserHandlerService.updateBrowserLocation(this._currentInterpretResponse);
                }
            };
            /** Updates the browser's location after a timeout */
            QuestionBoxControl.prototype.updateBrowserLocationInternalAfterTimeout = function () {
                if (this.connectionGroup.browserHandlerService && this._hasInterpretResponse()) {
                    var response = this._currentInterpretResponse;
                    this.connectionGroup.browserHandlerService.updateBrowserLocationAfterTimeout(response);
                }
            };
            QuestionBoxControl.prototype.createAnswerQuestionActivity = function (parentActivity) {
                var _this = this;
                this.stopAnswerQuestionReportingTimer();
                var answerQuestionActivity;
                if (parentActivity) {
                    // Use parent activity reporting value
                    answerQuestionActivity = parentActivity.createChildActivity(23 /* INAQ */, parentActivity.reporting);
                }
                else {
                    // Use activity reporting timer for reporting
                    answerQuestionActivity = this.connectionGroup.telemetryService.createNewActivity(23 /* INAQ */, null, false);
                    this.startAnswerQuestionReportingTimer();
                }
                if (!InJs.StringExtensions.isNullOrEmpty(this._telemetryHostName)) {
                    var property = new InJs.CorrelatedProperty('propertyBag', 'serviceInstance=' + this._telemetryHostName);
                    answerQuestionActivity.addCorrelatedProperty(property);
                }
                this._unreportedActivities.push(answerQuestionActivity);
                answerQuestionActivity.onChildAdded(function (childActivity) {
                    // The child activity might be associated with an older activity that we no longer care about.
                    // First check that this child is associated with the current parent, which will always be the
                    // first item in _unreportedActivities.
                    if (_this._unreportedActivities.length > 0 && childActivity.parentActivityId === _this._unreportedActivities[0].activityId)
                        _this._unreportedActivities.push(childActivity);
                    else
                        InJs.Tracing.verbose("Ignoring addition of child event to non-current answer question activity " + answerQuestionActivity.activityId);
                });
                answerQuestionActivity.onChildCompleted(function (childActivity) {
                    // Transfer correlated properties since we only report on INAQs
                    answerQuestionActivity.addCorrelatedProperties(childActivity.correlatedProperties);
                    if (childActivity.activityType === 24 /* ICIN */) {
                        // We know that in case interpret succeeds there will be follow-up visualization so we 
                        // are not ending the answer question activity just yet
                        if (childActivity.activityEndResult === 1 /* Success */ || childActivity.activityEndResult === 2 /* SuccessDespiteError */)
                            return;
                        _this.endAnswerActivity(answerQuestionActivity, childActivity);
                    }
                    else if (childActivity.activityType === 25 /* INPV */) {
                        // In case visualization ends we know we're done with answering
                        _this.endAnswerActivity(answerQuestionActivity, childActivity);
                    }
                });
                return answerQuestionActivity;
            };
            QuestionBoxControl.prototype.endAnswerActivity = function (answerQuestionActivity, childActivity) {
                answerQuestionActivity.end(childActivity.activityEndResult, childActivity.error, Math.max(answerQuestionActivity.activityStartTime, childActivity.activityEndTime));
            };
            QuestionBoxControl.prototype.stopAnswerQuestionReportingTimer = function () {
                if (this._answerQuestionReportingTimerId)
                    window.clearTimeout(this._answerQuestionReportingTimerId);
                this._answerQuestionReportingTimerId = null;
                this._unreportedActivities = [];
            };
            QuestionBoxControl.prototype.startAnswerQuestionReportingTimer = function () {
                var _this = this;
                this.stopAnswerQuestionReportingTimer();
                this._answerQuestionReportingTimerId = window.setTimeout(function () {
                    for (var i = 0, len = _this._unreportedActivities.length; i < len; i++)
                        _this._unreportedActivities[i].reporting = true;
                }, QuestionBoxControl.AnswerQuestionReportingTimeout);
            };
            QuestionBoxControl.prototype.localize = function (resourceId, defaultString) {
                if (this._getLocalizedResource)
                    return this._getLocalizedResource(resourceId);
                return defaultString;
            };
            QuestionBoxControl.prototype.updateLoadingMessage = function (status, activityEndedWith) {
                switch (status) {
                    case 0 /* NotStarted */:
                        this._textInput.placeholder = '';
                        if (this._loadingActivity) {
                            this._loadingActivity.end(0 /* Unknown */);
                            this._loadingActivity = null;
                        }
                        break;
                    case 1 /* InProgress */:
                        this._textInput.placeholder = this.placeholderOnInit;
                        if (!this._loadingActivity)
                            this._loadingActivity = this.connectionGroup.telemetryService.createNewActivity(26 /* INLM */, null, true);
                        break;
                    case 2 /* Completed */:
                        this._textInput.placeholder = this.placeholder;
                        if (this._loadingActivity) {
                            if (!activityEndedWith) {
                                debug.assertFail('activityEndedWith must be set for ModelLoadingStatus.Completed');
                                activityEndedWith = 0 /* Unknown */;
                            }
                            this._loadingActivity.end(activityEndedWith);
                            this._loadingActivity = null;
                        }
                        if (this._isLoadingModelsNotificationDisplayed) {
                            this.connectionGroup.bridge.hideNotification(QuestionBoxControl.ModelsLoadingNotificationId);
                            this._isLoadingModelsNotificationDisplayed = false;
                        }
                        break;
                    default:
                        debug.assertFail('Unsupported model loading status: ' + status);
                        break;
                }
            };
            /** HTML layout for the QuestionBox control */
            QuestionBoxControl.QuestionBoxControlHtml = "<div class='infonav-questionBoxContainer'>" + "<div class='infonav-questionBoxControl'></div>" + "<div class='infonav-caretContainer'>" + "<div class='infonav-caretBorderTop'></div>" + "<div class='infonav-caret'></div>" + "</div>" + "</div>";
            /** Css class name of the control root */
            QuestionBoxControl.QuestionBoxControlSelector = '.infonav-questionBoxControl';
            /** Css class name of the caret containing div */
            QuestionBoxControl.QuestionBoxCaretContainerSelector = '.infonav-caretContainer';
            /** Css class name of the caret in the question box */
            QuestionBoxControl.QuestionBoxCaretSelector = '.infonav-caret';
            /** The timeout in ms after which the interpretation result is cleared */
            QuestionBoxControl.ClearInterpretResultTimeoutInMilliseconds = 2000;
            /** Autocomplete controller option name */
            QuestionBoxControl.AutocompleteOptionName = 'autocomplete';
            /** The timeout in ms for reporting on answer question activities */
            QuestionBoxControl.AnswerQuestionReportingTimeout = 15000;
            QuestionBoxControl.SelectedIconClass = 'selected';
            /** Id of the models loading notification */
            QuestionBoxControl.ModelsLoadingNotificationId = 'd9b1a914-b00f-4db0-9882-c7b8420fe478';
            /** Id of the copy URL to clipboard notification */
            QuestionBoxControl.UserCopyResultUrlToClipboardNotificationId = '13425f9b-7d9b-4edd-ba04-c1c179ff9460';
            /** Delay timeout for showing notification when probing request is in progress */
            QuestionBoxControl.ProbeInProgressNotificationDelayMs = 5000;
            QuestionBoxControl.InternalTextChangedEventName = 'TextChanged';
            return QuestionBoxControl;
        })(InJs.InfoNavConnectedClientControl);
        QuestionBox.QuestionBoxControl = QuestionBoxControl;
    })(QuestionBox = InJs.QuestionBox || (InJs.QuestionBox = {}));
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var QuestionBox;
    (function (QuestionBox) {
        /** State Machine definition for the Question Box client side control */
        var QuestionBoxStateMachine = (function () {
            function QuestionBoxStateMachine() {
            }
            /** Initializes static members of the QuestionBoxStateMachine */
            QuestionBoxStateMachine.staticConstructor = function () {
                QuestionBoxStateMachine.definition = new InJs.StateMachineDefinition();
                /* Inactive State */
                // Begin session transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.InactiveStateName, QuestionBox.Constants.BeginSessionEventName, QuestionBox.Constants.TypingStateName, [QuestionBox.QuestionBoxControl.hasInteraction]);
                // ClearQuery transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.InactiveStateName, QuestionBox.Constants.ClearQueryEventName, QuestionBox.Constants.TypingStateName, QuestionBoxStateMachine.clearQueryEventActions);
                // ResultReady transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.InactiveStateName, QuestionBox.Constants.ResultReadyEventName, QuestionBox.Constants.InactiveStateName, QuestionBoxStateMachine.inactiveStateResultReadyActions);
                // ResultChanged transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.InactiveStateName, QuestionBox.Constants.ResultChangedEventName, QuestionBox.Constants.InactiveStateName, QuestionBoxStateMachine.inactiveStateResultChangedActions);
                // InterpretFailed transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.InactiveStateName, QuestionBox.Constants.InterpretFailedEventName, QuestionBox.Constants.InactiveStateName, [QuestionBox.QuestionBoxControl.clearClearInterpretResultTimer]);
                // Begin modeling session transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.InactiveStateName, QuestionBox.Constants.BeginModelingSessionEventName, QuestionBox.Constants.ModelingStateName, QuestionBoxStateMachine.beginModelingSessionActions);
                // TextSuggestionConfirmedEventName transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.InactiveStateName, QuestionBox.Constants.TextSuggestionConfirmedEventName, QuestionBox.Constants.TypingStateName, QuestionBoxStateMachine.textSuggestionConfirmedActions);
                // SuggestionItemSelected transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.InactiveStateName, QuestionBox.Constants.TextSuggestionSelectedEventName, QuestionBox.Constants.TypingStateName, [QuestionBox.QuestionBoxControl.setInputTextToSelectedSuggestion]);
                // SuggestionItemConfirmedEventName transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.InactiveStateName, QuestionBox.Constants.SuggestionItemConfirmedEventName, QuestionBox.Constants.TypingStateName, QuestionBoxStateMachine.suggestionItemConfirmedActions);
                // TextChanged transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.InactiveStateName, QuestionBox.Constants.TextChangedEventName, QuestionBox.Constants.InactiveStateName, QuestionBoxStateMachine.textChangedEventActions);
                /* Typing State */
                // TextChanged transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.TypingStateName, QuestionBox.Constants.TextChangedEventName, QuestionBox.Constants.TypingStateName, QuestionBoxStateMachine.textChangedEventActions);
                // ClearQuery transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.TypingStateName, QuestionBox.Constants.ClearQueryEventName, QuestionBox.Constants.TypingStateName, QuestionBoxStateMachine.clearQueryEventActions);
                // CompleteQuery transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.TypingStateName, QuestionBox.Constants.CompleteQueryEventName, QuestionBox.Constants.TypingStateName, QuestionBoxStateMachine.completeQueryEventActions);
                // NavigateUp transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.TypingStateName, QuestionBox.Constants.NavigateUpEventName, QuestionBox.Constants.BrowseSuggestionsStateName, QuestionBoxStateMachine.navigateUpEventActions);
                // NavigateDown transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.TypingStateName, QuestionBox.Constants.NavigateDownEventName, QuestionBox.Constants.BrowseSuggestionsStateName, QuestionBoxStateMachine.navigateDownEventActions);
                // SuggestionItemConfirmedEventName transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.TypingStateName, QuestionBox.Constants.SuggestionItemConfirmedEventName, QuestionBox.Constants.TypingStateName, QuestionBoxStateMachine.suggestionItemConfirmedActions);
                // TextSuggestionConfirmedEventName transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.TypingStateName, QuestionBox.Constants.TextSuggestionConfirmedEventName, QuestionBox.Constants.TermSelectionStateName, QuestionBoxStateMachine.textSuggestionConfirmedActions);
                // EndSession transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.TypingStateName, QuestionBox.Constants.EndSessionEventName, QuestionBox.Constants.InactiveStateName, QuestionBoxStateMachine.endSessionEventTypingActions);
                // TermSelected transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.TypingStateName, QuestionBox.Constants.TermSelectedEventName, QuestionBox.Constants.TermSelectionStateName, QuestionBoxStateMachine.termSelectedActions);
                // ResultReady transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.TypingStateName, QuestionBox.Constants.ResultReadyEventName, QuestionBox.Constants.TypingStateName, QuestionBoxStateMachine.queryResultReadyEventActions);
                // ResultChanged transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.TypingStateName, QuestionBox.Constants.ResultChangedEventName, QuestionBox.Constants.TypingStateName, QuestionBoxStateMachine.resultChangedEventActions);
                // InterpretFailed transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.TypingStateName, QuestionBox.Constants.InterpretFailedEventName, QuestionBox.Constants.TypingStateName, [QuestionBox.QuestionBoxControl.clearClearInterpretResultTimer]);
                // Begin modeling session transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.TypingStateName, QuestionBox.Constants.BeginModelingSessionEventName, QuestionBox.Constants.ModelingStateName, QuestionBoxStateMachine.beginModelingSessionActions);
                /* BrowseSuggestions State */
                // Clear transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.BrowseSuggestionsStateName, QuestionBox.Constants.ClearQueryEventName, QuestionBox.Constants.TypingStateName, QuestionBoxStateMachine.clearQueryEventActions);
                // TextChanged transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.BrowseSuggestionsStateName, QuestionBox.Constants.TextChangedEventName, QuestionBox.Constants.TypingStateName, QuestionBoxStateMachine.textChangedEventActions);
                // TermSelected transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.BrowseSuggestionsStateName, QuestionBox.Constants.TermSelectedEventName, QuestionBox.Constants.TypingStateName, QuestionBoxStateMachine.termSelectedActions);
                // ConfirmQuery transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.BrowseSuggestionsStateName, QuestionBox.Constants.ConfirmQueryEventName, QuestionBox.Constants.TermSelectionStateName, QuestionBoxStateMachine.confirmQueryEventActions);
                // SuggestionItemConfirmedEventName transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.BrowseSuggestionsStateName, QuestionBox.Constants.SuggestionItemConfirmedEventName, QuestionBox.Constants.TypingStateName, QuestionBoxStateMachine.suggestionItemConfirmedActions);
                // TextSuggestionConfirmedEventName transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.BrowseSuggestionsStateName, QuestionBox.Constants.TextSuggestionConfirmedEventName, QuestionBox.Constants.TermSelectionStateName, QuestionBoxStateMachine.textSuggestionConfirmedActions);
                // TextSuggestionItemSelected transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.BrowseSuggestionsStateName, QuestionBox.Constants.TextSuggestionSelectedEventName, QuestionBox.Constants.BrowseSuggestionsStateName, [QuestionBox.QuestionBoxControl.setInputTextToSelectedSuggestion]);
                // NavigateUp transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.BrowseSuggestionsStateName, QuestionBox.Constants.NavigateUpEventName, QuestionBox.Constants.BrowseSuggestionsStateName, [QuestionBox.QuestionBoxControl.suggestionList_SelectPrevious]);
                // NavigateDown transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.BrowseSuggestionsStateName, QuestionBox.Constants.NavigateDownEventName, QuestionBox.Constants.BrowseSuggestionsStateName, [QuestionBox.QuestionBoxControl.suggestionList_SelectNext]);
                // NavigateOutOfBounds transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.BrowseSuggestionsStateName, QuestionBox.Constants.NavigateOutOfBoundsEventName, QuestionBox.Constants.TypingStateName, QuestionBoxStateMachine.navigateOutOfBoundsEventActions);
                // EndSession transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.BrowseSuggestionsStateName, QuestionBox.Constants.EndSessionEventName, QuestionBox.Constants.InactiveStateName, QuestionBoxStateMachine.endSessionBrowseSuggestionsEventActions);
                // Begin modeling session transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.BrowseSuggestionsStateName, QuestionBox.Constants.BeginModelingSessionEventName, QuestionBox.Constants.ModelingStateName, QuestionBoxStateMachine.beginModelingSessionActions);
                /* TermSelection State */
                // Clear transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.TermSelectionStateName, QuestionBox.Constants.ClearQueryEventName, QuestionBox.Constants.TypingStateName, QuestionBoxStateMachine.clearQueryEventActions);
                // TextChanged transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.TermSelectionStateName, QuestionBox.Constants.TextChangedEventName, QuestionBox.Constants.TypingStateName, QuestionBoxStateMachine.textChangedEventActions);
                // TermSelected transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.TermSelectionStateName, QuestionBox.Constants.TermSelectedEventName, QuestionBox.Constants.TypingStateName, QuestionBoxStateMachine.termSelectedActions);
                // NavigateUp transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.TermSelectionStateName, QuestionBox.Constants.NavigateUpEventName, QuestionBox.Constants.BrowseSuggestionsStateName, QuestionBoxStateMachine.navigateUpEventActions);
                // NavigateDown transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.TermSelectionStateName, QuestionBox.Constants.NavigateDownEventName, QuestionBox.Constants.BrowseSuggestionsStateName, QuestionBoxStateMachine.navigateDownEventActions);
                // TextSuggestionSelected transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.TermSelectionStateName, QuestionBox.Constants.TextSuggestionSelectedEventName, QuestionBox.Constants.TypingStateName, [QuestionBox.QuestionBoxControl.setInputTextToSelectedSuggestion]);
                // TextSuggestionConfirmedEventName transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.TermSelectionStateName, QuestionBox.Constants.TextSuggestionConfirmedEventName, QuestionBox.Constants.TypingStateName, QuestionBoxStateMachine.textSuggestionConfirmedActions);
                // SuggestionItemConfirmedEventName transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.TermSelectionStateName, QuestionBox.Constants.SuggestionItemConfirmedEventName, QuestionBox.Constants.TypingStateName, QuestionBoxStateMachine.suggestionItemConfirmedActions);
                // EndSession transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.TermSelectionStateName, QuestionBox.Constants.EndSessionEventName, QuestionBox.Constants.InactiveStateName, QuestionBoxStateMachine.endSessionBrowseSuggestionsEventActions);
                // Begin modeling session transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.TermSelectionStateName, QuestionBox.Constants.BeginModelingSessionEventName, QuestionBox.Constants.ModelingStateName, QuestionBoxStateMachine.beginModelingSessionActions);
                // ResultReady transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.TermSelectionStateName, QuestionBox.Constants.ResultReadyEventName, QuestionBox.Constants.TypingStateName, QuestionBoxStateMachine.termSelectionQueryResultReadyEventActions);
                /* Modeling State */
                // ResultReady transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.ModelingStateName, QuestionBox.Constants.ResultReadyEventName, QuestionBox.Constants.ModelingStateName, QuestionBoxStateMachine.modelingResultReadyEventActions);
                // TermSelected transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.ModelingStateName, QuestionBox.Constants.TermSelectedEventName, QuestionBox.Constants.ModelingStateName, [QuestionBox.QuestionBoxControl.notifyTermSelection]);
                // End modeling session transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.ModelingStateName, QuestionBox.Constants.EndModelingSessionEventName, QuestionBox.Constants.TypingStateName, QuestionBoxStateMachine.endModelingSessionActions);
                // TextChanged transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.ModelingStateName, QuestionBox.Constants.TextChangedEventName, QuestionBox.Constants.TypingStateName, QuestionBoxStateMachine.modelingTextChangedEventActions);
                // ClearQuery transition
                QuestionBoxStateMachine.definition.addTransition(QuestionBox.Constants.ModelingStateName, QuestionBox.Constants.ClearQueryEventName, QuestionBox.Constants.TypingStateName, QuestionBoxStateMachine.modelingClearQueryEventActions);
            };
            /** State machine definition for the QuestionBox control */
            QuestionBoxStateMachine.definition = null;
            /** Transition actions for ClearQueryEvent */
            QuestionBoxStateMachine.clearQueryEventActions = [
                QuestionBox.QuestionBoxControl.textInput_Clear,
                QuestionBox.QuestionBoxControl.suggestionList_Clear,
                QuestionBox.QuestionBoxControl.clearInterpretResult
            ];
            /** Transition actions for CompleteQueryEvent */
            QuestionBoxStateMachine.completeQueryEventActions = [
                QuestionBox.QuestionBoxControl.textInput_CompleteInput,
                QuestionBox.QuestionBoxControl.interpret,
                QuestionBox.QuestionBoxControl.userUtteranceConfirmed
            ];
            /** Transition actions for ResultReadyEvent during Inactive state */
            QuestionBoxStateMachine.inactiveStateResultReadyActions = [
                QuestionBox.QuestionBoxControl.updateResult,
                QuestionBox.QuestionBoxControl.updateBrowserLocationAfterTimeout,
                QuestionBox.QuestionBoxControl.clearClearInterpretResultTimer
            ];
            /** Transition actions for ResultChangedEvent during Inactive state */
            QuestionBoxStateMachine.inactiveStateResultChangedActions = [
                QuestionBox.QuestionBoxControl.updateResult,
                QuestionBox.QuestionBoxControl.clearClearInterpretResultTimer
            ];
            /** Transition actions for TextChangedEvent */
            QuestionBoxStateMachine.textChangedEventActions = [
                QuestionBox.QuestionBoxControl.clearUserInputBuffer,
                QuestionBox.QuestionBoxControl.interpret,
                QuestionBox.QuestionBoxControl.textInput_ClearTermSelection,
                QuestionBox.QuestionBoxControl.clearInterpretResultAfterTimeout
            ];
            /** Transition actions for NavigateUpEvent  */
            QuestionBoxStateMachine.navigateUpEventActions = [
                QuestionBox.QuestionBoxControl.storeUserInput,
                QuestionBox.QuestionBoxControl.suggestionList_SelectPrevious
            ];
            /** Transition actions for NavigateDownEvent */
            QuestionBoxStateMachine.navigateDownEventActions = [
                QuestionBox.QuestionBoxControl.storeUserInput,
                QuestionBox.QuestionBoxControl.suggestionList_SelectNext
            ];
            /** Transition actions for SuggestionItemConfirmedEvent */
            QuestionBoxStateMachine.suggestionItemConfirmedActions = [
                QuestionBox.QuestionBoxControl.processSuggestion
            ];
            /** Transition actions for TextSuggestionConfirmedEvent */
            QuestionBoxStateMachine.textSuggestionConfirmedActions = [QuestionBox.QuestionBoxControl.setInputTextToSelectedSuggestion].concat(QuestionBoxStateMachine.textChangedEventActions);
            /** Transition actions for EndSessionEvent */
            QuestionBoxStateMachine.endSessionEventActions = [
                QuestionBox.QuestionBoxControl.userUtteranceConfirmed,
                QuestionBox.QuestionBoxControl.textInput_ClearTermSelection,
                QuestionBox.QuestionBoxControl.suggestionList_ClearPreserveRestatement,
                QuestionBox.QuestionBoxControl.textInput_ShowAutoCompletion,
                QuestionBox.QuestionBoxControl.updateBrowserLocation
            ];
            /** Transition actions for endSessionEvent while browsing suggestions */
            QuestionBoxStateMachine.endSessionBrowseSuggestionsEventActions = [QuestionBox.QuestionBoxControl.restoreUserInput].concat(QuestionBoxStateMachine.endSessionEventActions);
            /** Transition actions for endSessionEvent while typing */
            QuestionBoxStateMachine.endSessionEventTypingActions = [QuestionBox.QuestionBoxControl.textInput_Blur].concat(QuestionBoxStateMachine.endSessionEventActions);
            /** Transition actions for QueryResultReadyEvent */
            QuestionBoxStateMachine.queryResultReadyEventActions = [
                QuestionBox.QuestionBoxControl.displayQueryResult,
                QuestionBox.QuestionBoxControl.updateBrowserLocationAfterTimeout,
                QuestionBox.QuestionBoxControl.clearClearInterpretResultTimer
            ];
            /** Transition actions for TermSelectionQueryResultReadyEvent */
            QuestionBoxStateMachine.termSelectionQueryResultReadyEventActions = QuestionBoxStateMachine.queryResultReadyEventActions.concat(QuestionBox.QuestionBoxControl.updateTermSelection);
            /** Transition actions for ModelingResultReadyEvent */
            QuestionBoxStateMachine.modelingResultReadyEventActions = [
                QuestionBox.QuestionBoxControl.displayModelingResult
            ];
            /** Transition actions for ResultChangedEvent */
            QuestionBoxStateMachine.resultChangedEventActions = [
                QuestionBox.QuestionBoxControl.displayResult,
                QuestionBox.QuestionBoxControl.clearClearInterpretResultTimer
            ];
            /** Transition actions for ConfirmQueryEvent */
            QuestionBoxStateMachine.confirmQueryEventActions = QuestionBoxStateMachine.textChangedEventActions.concat([QuestionBox.QuestionBoxControl.userUtteranceConfirmed]);
            /** Transition actions for NavigateOutOfBoundsEvent */
            QuestionBoxStateMachine.navigateOutOfBoundsEventActions = [
                QuestionBox.QuestionBoxControl.suggestionList_ClearSelection,
                QuestionBox.QuestionBoxControl.restoreUserInput
            ];
            /** Transition actions for TermSelectedEvent */
            QuestionBoxStateMachine.termSelectedActions = [
                QuestionBox.QuestionBoxControl.notifyTermSelection,
                QuestionBox.QuestionBoxControl.textInput_ClearTermSelection,
                QuestionBox.QuestionBoxControl.selectTerm
            ];
            /** Transition actions for BeginModelingSessionEvent */
            QuestionBoxStateMachine.beginModelingSessionActions = [
                QuestionBox.QuestionBoxControl.suggestionList_Clear
            ];
            /** Transition actions for EndModelingSessionEvent */
            QuestionBoxStateMachine.endModelingSessionActions = [
                QuestionBox.QuestionBoxControl.textInput_Focus
            ];
            /** Transition actions for ExitModelingMode */
            QuestionBoxStateMachine.exitModelingModeActions = [
                QuestionBox.QuestionBoxControl.exitModelingMode
            ];
            /** Transition actions for TextChangedEvent (in modeling mode) */
            QuestionBoxStateMachine.modelingTextChangedEventActions = QuestionBoxStateMachine.exitModelingModeActions.concat(QuestionBoxStateMachine.textChangedEventActions);
            /** Transition actions for ClearQueryEvent (in modeling mode) */
            QuestionBoxStateMachine.modelingClearQueryEventActions = QuestionBoxStateMachine.exitModelingModeActions.concat(QuestionBoxStateMachine.clearQueryEventActions);
            return QuestionBoxStateMachine;
        })();
        QuestionBox.QuestionBoxStateMachine = QuestionBoxStateMachine;
        QuestionBoxStateMachine.staticConstructor();
    })(QuestionBox = InJs.QuestionBox || (InJs.QuestionBox = {}));
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var QuestionBox;
    (function (QuestionBox) {
        var QuestionBoxSuggestionsDisplayedEventArgs = (function () {
            function QuestionBoxSuggestionsDisplayedEventArgs(totalSuggestionsPixelOffset, animationDuration, numberOfSuggestions) {
                this.totalSuggestionsPixelOffset = 0;
                this.animationDuration = 0;
                this.numberOfSuggestions = 0;
                this.animationDuration = animationDuration;
                this.totalSuggestionsPixelOffset = totalSuggestionsPixelOffset;
                this.numberOfSuggestions = numberOfSuggestions;
            }
            return QuestionBoxSuggestionsDisplayedEventArgs;
        })();
        QuestionBox.QuestionBoxSuggestionsDisplayedEventArgs = QuestionBoxSuggestionsDisplayedEventArgs;
    })(QuestionBox = InJs.QuestionBox || (InJs.QuestionBox = {}));
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var QuestionBox;
    (function (QuestionBox) {
        (function (SuggestionType) {
            SuggestionType[SuggestionType["Text"] = 0] = "Text";
            SuggestionType[SuggestionType["RuntimeModelingAction"] = 1] = "RuntimeModelingAction";
        })(QuestionBox.SuggestionType || (QuestionBox.SuggestionType = {}));
        var SuggestionType = QuestionBox.SuggestionType;
        var SuggestionListControl = (function (_super) {
            __extends(SuggestionListControl, _super);
            function SuggestionListControl(hostElement, questionBoxHost, options) {
                var _this = this;
                _super.call(this, hostElement, options);
                /** The suggestion control host element */
                this._controlRoot = null;
                /** The query suggestion inner layout element */
                this._suggestionsHostInnerLayout = null;
                /** The query suggestion list */
                this._suggestionsList = null;
                /** The question box host element */
                this._questionBoxHost = null;
                /** The current selection index within the list of suggestions */
                this._currentSelectionIndex = 0;
                /** The type of the current selection within the list of suggestions */
                this._currentSelectionType = null;
                /** The text of the current selection within the list of suggestions */
                this._currentSelectionText = null;
                var suggestionsHostId = InJs.Utility.generateGuid() + '_suggestionsHost';
                this._questionBoxHost = questionBoxHost;
                var suggestionsHostLayout = this._controlRoot = $(SuggestionListControl.SuggestionsListControlHtml);
                // append the suggestions control to the question box host's offset parent to preserve alignment
                hostElement.append(suggestionsHostLayout);
                // cache jQuery elements for Query Suggestions
                this._suggestionsHostInnerLayout = suggestionsHostLayout.find(SuggestionListControl.SuggestionsHostInnerLayoutSelector);
                this._suggestionsList = suggestionsHostLayout.find(SuggestionListControl.SuggestionsListSelector);
                // TODO - 2129732: This should not be here
                InJs.InfoNavApp.current.add_resize(function (e) {
                    _this.updateControlPosition();
                });
            }
            Object.defineProperty(SuggestionListControl.prototype, "currentSelectionType", {
                /** The type of the current selection within the list of suggestions */
                get: function () {
                    return this._currentSelectionType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SuggestionListControl.prototype, "currentSelectionText", {
                /** The text of the current selection within the list of suggestions */
                get: function () {
                    return this._currentSelectionText;
                },
                enumerable: true,
                configurable: true
            });
            /** Handler for interaction events */
            SuggestionListControl.prototype.add_interaction = function (handler, data) {
                $(this).on(QuestionBox.Constants.OnInteractionEventName, data, handler);
            };
            SuggestionListControl.prototype.remove_interaction = function (handler) {
                $(this).off(QuestionBox.Constants.OnInteractionEventName, handler);
            };
            /**
             * Displays a list of suggestions for a given user utterance
             * @param utterance - The utterance for which suggestions will be displayed
             * @param response - The InterpretResponse for the utterance
             * @param termSelection - The current term selection
             * @param showOnlyRestatement - Whether the list should only contain the restament
             * @param suggestionStrings - The context for the transition action
             */
            SuggestionListControl.prototype.displaySuggestions = function (utterance, response, termSelection, onlyShowRestatement, suggestionStrings) {
                var result = response ? response.result : null;
                var restatementAvailable = result && !InJs.StringExtensions.isNullOrUndefinedOrWhiteSpaceString(result.restatement);
                // clear the suggestion list layout to make way for new suggestions
                this._suggestionsList.empty();
                // render the restatement, if any
                if (restatementAvailable) {
                    this.renderRestatement(result);
                }
                var suggestions = new Array();
                // attempt to get suggestions for the current term selection, if any
                if (termSelection) {
                    suggestions = result.getTermSuggestions(termSelection);
                }
                else {
                    // if not in term selection  mode, attempt to retrieve suggestions from featured questions
                    if (!suggestionStrings && this.connectionGroup.featuredQuestions) {
                        var featuredQuestionsSuggestions = result ? this.connectionGroup.getFeaturedQuestions(result.databaseName) : this.connectionGroup.featuredQuestions;
                        suggestionStrings = featuredQuestionsSuggestions.map(function (item) {
                            return item.Utterance;
                        });
                    }
                    if (suggestionStrings) {
                        var additionalSuggestions = this.generateCompletionSuggestionsFromStrings(suggestionStrings, utterance);
                        suggestions = suggestions.concat(additionalSuggestions);
                    }
                    if (result) {
                        var uniqueSuggestionsFromResult = result.getCompletionSuggestions().filter(function (suggestionFromResult, suggestionFromResultIndex, suggestionsFromResult) {
                            // filter out suggestions that are already in the list
                            return !suggestions.some(function (existingSuggestion, existingSuggestionIndex, existingSuggestions) {
                                return existingSuggestion.text.toLowerCase === suggestionFromResult.text.toLowerCase;
                            });
                        });
                        suggestions = suggestions.concat(uniqueSuggestionsFromResult);
                    }
                }
                // render the set of suggestions
                if (!onlyShowRestatement) {
                    this.renderSuggestionItems(suggestions);
                    if (termSelection) {
                        this.renderTermActions(result, termSelection);
                    }
                }
                // attach event handlers to suggestion items
                if (restatementAvailable || (!onlyShowRestatement && suggestions.length > 0)) {
                    this._currentSelectionIndex = 0;
                    // attach events to suggestion items
                    this._suggestionsList.find('li[' + SuggestionListControl.ListItemDataIdAttribute + ']').on(InJs.DOMConstants.mouseEnterEventName, this, this.onSuggestionsListItemMouseEnter).on(InJs.DOMConstants.mouseDownEventName, this, this.onSuggestionMouseDown);
                    // expand the suggestions list
                    this.expandSuggestionsList();
                }
                else {
                    this.collapseSuggestionsList(false);
                }
            };
            /** Clears the current contents of the control */
            SuggestionListControl.prototype.clear = function (preserveRestatement) {
                this.clearSelection();
                this.collapseSuggestionsList(preserveRestatement);
            };
            /** Clears the current selection */
            SuggestionListControl.prototype.clearSelection = function () {
                this._currentSelectionIndex = 0;
                this._currentSelectionText = '';
            };
            /** Selects the previous item inside the suggestion list */
            SuggestionListControl.prototype.selectPrevious = function () {
                var previousSelectionIndex = this._currentSelectionIndex - 1;
                if (previousSelectionIndex === -1) {
                    previousSelectionIndex = this._suggestionsList.children('[' + SuggestionListControl.ListItemDataIdAttribute + ']').length;
                }
                this.attemptSelection(previousSelectionIndex);
            };
            /** Selects the next item inside the suggestion list */
            SuggestionListControl.prototype.selectNext = function () {
                this.attemptSelection(this._currentSelectionIndex + 1);
            };
            /**
             * Generate suggestions to be used for UI rendering from an array of strings
             * @param response - The list of strings for which UI suggestion items should be generated
             * @param utterance - The utterance to which the suggestions correspond to
             * @param returns - A list of UISuggestionItem items that can be used for UI rendering
             */
            SuggestionListControl.prototype.generateCompletionSuggestionsFromStrings = function (suggestionStrings, utterance) {
                var completionSuggestions = new Array();
                var filteredSuggestions = suggestionStrings.filter(function (item) {
                    return item.indexOf(utterance) === 0 && item.length > utterance.length;
                });
                for (var i = 0, length = filteredSuggestions.length; i < length; i++) {
                    var completionSuggestion = new InJs.UISuggestionItem();
                    completionSuggestion.parts = [];
                    completionSuggestion.parts.push({ text: utterance, emphasize: false });
                    completionSuggestion.parts.push({ text: filteredSuggestions[i].replace(utterance, ''), emphasize: true });
                    completionSuggestions.push(completionSuggestion);
                }
                return completionSuggestions;
            };
            /**
             * Outputs the restatement to the suggestion list
             * @param result - The NL interpreation result from which to display the restatement
             */
            SuggestionListControl.prototype.renderRestatement = function (result) {
                var listItemDataId = this._suggestionsList.find('li[' + SuggestionListControl.ListItemDataIdAttribute + ']').length + 1;
                var restatementListItem = $('<li></li>');
                restatementListItem.text(result.restatement);
                restatementListItem.addClass(SuggestionListControl.RestatementCssClass);
                if (SuggestionListControl.AllowRestatementSelection) {
                    restatementListItem.attr(SuggestionListControl.ListItemDataIdAttribute, listItemDataId.toString());
                }
                else {
                    restatementListItem.addClass(SuggestionListControl.DisallowedListItemCssClass);
                }
                this._suggestionsList.append(restatementListItem);
            };
            /**
             * Outputs the suggestion items to the suggestion list
             * @param result - The NL interpreation result from which to display the restatement
             */
            SuggestionListControl.prototype.renderSuggestionItems = function (suggestions) {
                var _this = this;
                var listItemDataId = this._suggestionsList.find('li[' + SuggestionListControl.ListItemDataIdAttribute + ']').length + 1;
                if (suggestions.length > 0) {
                    this._suggestionsList.append(SuggestionListControl.RestatementHorizontalRowBreak);
                }
                var suggestionListItems = suggestions.map(function (item, index) {
                    return _this.createSuggestionItemElement(item, index + listItemDataId);
                });
                this._suggestionsList.append(suggestionListItems.slice(0, SuggestionListControl.MaxSuggestionItems));
            };
            /** Creates a layout list item from an individual suggestion item */
            SuggestionListControl.prototype.createSuggestionItemElement = function (suggestion, listItemDataId) {
                var listItem = $('<li></li>');
                listItem.attr(SuggestionListControl.ListItemDataIdAttribute, listItemDataId.toString());
                var partElements = suggestion.parts.map(function (item) {
                    var partElem = $('<span/>').text(item.text);
                    if (item.emphasize) {
                        partElem.addClass(SuggestionListControl.SuggestedTermReplacementCssClass);
                    }
                    return partElem;
                });
                listItem.append(partElements);
                return listItem;
            };
            /**
             * Outputs the term actions for the selected term
             * @param result - The result of the NL intepretation
             * @param termSelection - The index of the term selection for which suggestions should be displayed
             */
            SuggestionListControl.prototype.renderTermActions = function (result, termSelection) {
                var listItemDataId = this._suggestionsList.find('li[' + SuggestionListControl.ListItemDataIdAttribute + ']').length + 1;
                if (this.connectionGroup.isUserAdmin && this.connectionGroup.isRuntimeModelingEnabled && SuggestionListControl.EnableRuntimeModeling === true) {
                    this._suggestionsList.append(SuggestionListControl.RestatementHorizontalRowBreak);
                    var queryAsTerms = result.getCompletedUtteranceAsTerms();
                    var termActionListItem = $('<li></li>');
                    var termActionElement = $('<div></div>');
                    termActionListItem.attr(SuggestionListControl.ListItemDataIdAttribute, listItemDataId.toString());
                    termActionListItem.addClass(SuggestionListControl.TermActionListItemCssClass);
                    termActionListItem.attr(SuggestionListControl.ListItemDataTypeAttribute, SuggestionListControl.TermActionItemType);
                    var modelingCommandString;
                    var modelingCommandInput = queryAsTerms.slice(termSelection.start, termSelection.end + 1).join('');
                    if (termSelection.isSingleTermSelection && result.unrecognizedTerms && result.unrecognizedTerms.indexOf(termSelection.start) >= 0) {
                        modelingCommandString = InJs.Strings.modelingClarifyTermCommand;
                    }
                    else {
                        modelingCommandString = InJs.Strings.modelingAddSynonymTermCommand;
                        if (termSelection.isUserRangeSelection) {
                            modelingCommandInput = termSelection.userRangeText;
                        }
                    }
                    var modelingCommandStrParts = modelingCommandString.split('{term}');
                    termActionElement.append("<span>" + modelingCommandStrParts[0] + "</span>");
                    termActionElement.append("<span class='" + SuggestionListControl.SuggestionTermTextCssClass + "'> " + modelingCommandInput + " </span>");
                    termActionElement.append("<span>" + modelingCommandStrParts[1] + "</span>");
                    termActionElement.addClass(SuggestionListControl.TermActionCssClass);
                    termActionListItem.append(termActionElement);
                    this._suggestionsList.append(termActionListItem);
                }
            };
            /**
             * Attempt to select an item inside the suggestion list using the provided index
             * Should the requested index be outside of the range of the list, an event will be fired to notify the parent control of this
             * @param index - The index of the item to select
             */
            SuggestionListControl.prototype.attemptSelection = function (index) {
                var _this = this;
                this._suggestionsList.children().removeClass(SuggestionListControl.ListItemSelectedCssClass);
                var newSelection = this._suggestionsList.find('[' + SuggestionListControl.ListItemDataIdAttribute + '=\'' + index + '\']');
                if (newSelection.length > 0) {
                    this._currentSelectionIndex = index;
                    var itemType = newSelection.attr(SuggestionListControl.ListItemDataTypeAttribute);
                    if (itemType === SuggestionListControl.TermActionItemType) {
                        this._currentSelectionType = 1 /* RuntimeModelingAction */;
                    }
                    else {
                        this._currentSelectionType = 0 /* Text */;
                        this._currentSelectionText = newSelection.text();
                        this.raiseOnInteractionEvent(new InJs.InteractionEventArgs(QuestionBox.Constants.TextSuggestionSelectedEventName));
                    }
                    newSelection.addClass(SuggestionListControl.ListItemSelectedCssClass);
                    window.setTimeout(function () { return _this.scrollSelectionIntoView(newSelection); }, 0);
                }
                else {
                    this._currentSelectionIndex = 0;
                    this.scrollToTop();
                    this.raiseOnInteractionEvent(new InJs.InteractionEventArgs(QuestionBox.Constants.NavigateOutOfBoundsEventName));
                }
            };
            SuggestionListControl.prototype.scrollToTop = function () {
                this._suggestionsHostInnerLayout.scrollTop(0);
            };
            SuggestionListControl.prototype.scrollSelectionIntoView = function (element) {
                // cache as many measurements as possible - this needs to be fast.
                var elementOffset = element.offset();
                var elementHeight = element.outerHeight();
                var boundingBox = this._suggestionsHostInnerLayout;
                var boundingBoxHeight = this._suggestionsHostInnerLayout.height();
                var boundingBoxOffset = boundingBox.offset();
                var isElementInBoundsUp = elementOffset.top >= boundingBoxOffset.top;
                var isElementInBoundsDown = elementOffset.top + elementHeight <= boundingBoxHeight + boundingBoxOffset.top;
                if (isElementInBoundsUp && isElementInBoundsDown)
                    return;
                // get the distance of the element from the top of the list
                var elementVerticalPosition = 0;
                element.prevAll().each(function (index, prevElem) {
                    elementVerticalPosition += $(prevElem).outerHeight();
                });
                // if the element is offscreen above the list
                if (!isElementInBoundsUp) {
                    boundingBox.scrollTop(elementVerticalPosition);
                }
                else if (!isElementInBoundsDown) {
                    boundingBox.scrollTop(elementVerticalPosition - boundingBoxHeight + elementHeight);
                }
            };
            /** Updates the position of the control relative to the parent */
            SuggestionListControl.prototype.updateControlPosition = function () {
                var questionBoxHeight = this._questionBoxHost[0].offsetHeight;
                var questionBoxWidth = this._questionBoxHost[0].offsetWidth;
                var questionBoxTopPosition = this._questionBoxHost.position().top;
                var questionBoxLeftPosition = this._questionBoxHost.position().left;
                var questionBoxMarginTop = parseInt(this._questionBoxHost.css(InJs.CssConstants.marginTopProperty));
                var questionBoxBorderBottom = parseFloat(this._questionBoxHost.css(InJs.CssConstants.borderBottomWidthProperty)) || 0;
                questionBoxBorderBottom = Math.ceil(questionBoxBorderBottom);
                var suggestionBoxTopPosition = questionBoxTopPosition + questionBoxMarginTop + questionBoxHeight - questionBoxBorderBottom;
                this._controlRoot.css(InJs.CssConstants.topProperty, suggestionBoxTopPosition.toString() + InJs.CssConstants.pixelUnits);
                this._controlRoot.css(InJs.CssConstants.leftProperty, questionBoxLeftPosition.toString() + InJs.CssConstants.pixelUnits);
                this._controlRoot.css(InJs.CssConstants.widthProperty, questionBoxWidth.toString() + InJs.CssConstants.pixelUnits);
            };
            /**
             * Raises an interaction event to be handled by a state machine
             * @param args - The interaction event arguments for this event
             */
            SuggestionListControl.prototype.raiseOnInteractionEvent = function (args) {
                $(this).trigger(QuestionBox.Constants.OnInteractionEventName, args);
            };
            /**
             * Click on query suggestion event handler
             * @param e - jQuery event arguments for this event
             */
            SuggestionListControl.prototype.onSuggestionMouseDown = function (e) {
                e.preventDefault();
                var self = e.data;
                self.attemptSelection(self._currentSelectionIndex);
                self.raiseOnInteractionEvent(new InJs.InteractionEventArgs(QuestionBox.Constants.SuggestionItemConfirmedEventName));
            };
            /**
             * Handles the mouse enter event on list items
             * @param e - The arguments for this event
             */
            SuggestionListControl.prototype.onSuggestionsListItemMouseEnter = function (e) {
                var self = e.data;
                var mouseHoverSelection = $(e.currentTarget);
                if (!mouseHoverSelection.hasClass(SuggestionListControl.DisallowedListItemCssClass)) {
                    self._suggestionsList.children().removeClass(SuggestionListControl.ListItemSelectedCssClass);
                    var mouseOverSuggestionIndex = parseInt(mouseHoverSelection.attr(SuggestionListControl.ListItemDataIdAttribute));
                    self._currentSelectionIndex = mouseOverSuggestionIndex;
                    mouseHoverSelection.addClass(SuggestionListControl.ListItemSelectedCssClass);
                }
            };
            /** Expand the suggestions list */
            SuggestionListControl.prototype.expandSuggestionsList = function () {
                var numberOfItems = this._suggestionsList.children('li').length;
                if (numberOfItems > 0) {
                    this.updateControlPosition();
                    this._controlRoot.css(InJs.CssConstants.displayProperty, InJs.CssConstants.blockValue);
                }
                else {
                    return;
                }
                var calculatedHeight = 0;
                this._suggestionsList.children().each(function (index, element) {
                    calculatedHeight += $(element).outerHeight();
                    if (index === SuggestionListControl.MaxVisibleSuggestionItems)
                        return false;
                });
                if (this.bridge) {
                    this.bridge.notifyQuestionBoxSuggestionsDisplayed(calculatedHeight, SuggestionListControl.ExpandAnimationDuration, numberOfItems);
                }
                this._suggestionsHostInnerLayout.css(InJs.CssConstants.heightProperty, calculatedHeight.toString() + InJs.CssConstants.pixelUnits).css(InJs.CssConstants.opacityProperty, '1');
                this.updateControlPosition();
            };
            /** Collapse the suggestions list */
            SuggestionListControl.prototype.collapseSuggestionsList = function (preserveRestatement) {
                var restatementElem = this._suggestionsList.find(InJs.Utility.createClassSelector(SuggestionListControl.RestatementCssClass));
                if (restatementElem.text() && preserveRestatement) {
                    this._suggestionsList.children().not(InJs.Utility.createClassSelector(SuggestionListControl.RestatementCssClass)).not(InJs.Utility.createClassSelector(SuggestionListControl.RestatementSeparatorCssClass)).remove();
                    this._suggestionsHostInnerLayout.css(InJs.CssConstants.heightProperty, this._suggestionsList.outerHeight());
                }
                else {
                    this._suggestionsList.empty();
                    this._suggestionsHostInnerLayout.css(InJs.CssConstants.heightProperty, InJs.CssConstants.zeroPixelValue);
                    this._controlRoot.css(InJs.CssConstants.displayProperty, InJs.CssConstants.noneValue);
                }
                if (this.bridge) {
                    this.bridge.notifyQuestionBoxSuggestionsDisplayed(0, SuggestionListControl.CollapseAnimationDuration, 0);
                }
            };
            // BUG 000000: temporarily disabling runtime modeling, as it currently causes an infinite request loop
            SuggestionListControl.EnableRuntimeModeling = false;
            /** HTML layout for SuggestionsListControl */
            SuggestionListControl.SuggestionsListControlHtml = "<div class='infonav-suggestionsHost'>" + "<div class='infonav-suggestionsHostInnerBorder'>" + "<div class='infonav-suggestionsHostInnerLayout'>" + "<ul class='infonav-suggestionsList'></ul>" + "</div>" + "</div>" + "<div class='infonav-caretContainer'>" + "<div class='infonav-caretBorderTop'></div>" + "<div class='infonav-caret'></div>" + "</div>" + "</div>";
            SuggestionListControl.RestatementRowItemHtml = '<div class="infonav-hr infonav-restatement_hr"/>';
            SuggestionListControl.RestatementHorizontalRowBreak = '<div class=\'infonav-hr\'/>';
            SuggestionListControl.ListItemSelectedCssClass = 'infonav-listItemSelected';
            SuggestionListControl.SuggestedTermReplacementCssClass = 'infonav-suggestedTermReplacement';
            SuggestionListControl.RestatementCssClass = 'infonav-restatement';
            SuggestionListControl.TermActionListItemCssClass = 'infonav-termActionListItem';
            SuggestionListControl.TermActionCssClass = 'infonav-termAction';
            SuggestionListControl.SuggestionTermTextCssClass = 'infonav-termText';
            SuggestionListControl.SuggestionsHostInnerLayoutSelector = '.infonav-suggestionsHostInnerLayout';
            SuggestionListControl.SuggestionsListSelector = '.infonav-suggestionsList';
            SuggestionListControl.DisallowedListItemCssClass = 'disallowed';
            SuggestionListControl.RestatementSeparatorCssClass = 'infonav-restatement_hr';
            SuggestionListControl.ListItemDataTypeAttribute = 'data-suggestionType';
            SuggestionListControl.TermActionItemType = 'termAction';
            /** Whether the user should be able to select the restatement as a suggestion in the list **/
            SuggestionListControl.AllowRestatementSelection = false;
            /** The data attribute used to index list items within the DOM layout */
            SuggestionListControl.ListItemDataIdAttribute = 'data-suggestionIndex';
            /** The maximum number of items to be presented inside the control */
            SuggestionListControl.MaxSuggestionItems = 50;
            /** The maximum size of the control (in items) */
            SuggestionListControl.MaxVisibleSuggestionItems = 4;
            /** The duration (in ms) of the expand animation */
            SuggestionListControl.ExpandAnimationDuration = 0;
            /** The duration (in ms) of the collapse animation */
            SuggestionListControl.CollapseAnimationDuration = 0;
            return SuggestionListControl;
        })(InJs.InfoNavConnectedClientControl);
        QuestionBox.SuggestionListControl = SuggestionListControl;
    })(QuestionBox = InJs.QuestionBox || (InJs.QuestionBox = {}));
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var QuestionBox;
    (function (QuestionBox) {
        var TextInputControl = (function () {
            /**
             * Initializes an instance of the TextInputControl class
             * @param element - The context for the transition action
             */
            function TextInputControl(element) {
                /** Private field for the Text property */
                this._text = '';
                /** The text input control host */
                this._controlRoot = null;
                /** The text input box container */
                this._inputBox = null;
                /** The text input autoComplete field */
                this._inputAutoComplete = null;
                /** The text input rendering layer - this allows us to apply custom formatting to user input in realtime */
                this._inputRenderer = null;
                /** The element used to display selected state on a part of the user input */
                this._inputTermSelection = null;
                /** The text input element */
                this._userInput = null;
                this._terms = null;
                this._currentResult = null;
                this._inputRenderFormatTimeoutId = 0;
                this._inputRenderFormatTimeoutMs = 250;
                /** Whether the control has a query it hasn't communicated up-stream */
                this._hasUncommitedText = true;
                /** Whether the browser supports input rendering */
                this._supportsHtml5InputRendering = false;
                /** Stores the timeout id for the current text selection event */
                this._textSelectionTimeoutId = 0;
                this._controlRoot = $(TextInputControl.TextInputControlHtml);
                this._inputBox = this._controlRoot.find(TextInputControl.InputBoxSelector);
                this._inputAutoComplete = this._controlRoot.find(TextInputControl.InputAutoCompleteSelector);
                this._inputRenderer = this._controlRoot.find(TextInputControl.InputRendererSelector);
                this._inputTermSelection = this._controlRoot.find(TextInputControl.InputTermSelectionSelector);
                this._userInput = this._controlRoot.find(TextInputControl.UserInputSelector);
                this._terms = [];
                this.bindEvents();
                element.append(this._controlRoot);
            }
            Object.defineProperty(TextInputControl.prototype, "isAutocompleteEnabled", {
                /** Indicates whether autocomplete is enabled */
                get: function () {
                    return this._isAutocompleteEnabled;
                },
                /** Sets whether autocomplete is enabled */
                set: function (value) {
                    if (!value && this._isAutocompleteEnabled)
                        this.clearAutoCompletion();
                    this._isAutocompleteEnabled = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TextInputControl.prototype, "text", {
                /** The current text within the control */
                get: function () {
                    return this._text;
                },
                /** The current text within the control */
                set: function (value) {
                    this.setInputText(value, true);
                },
                enumerable: true,
                configurable: true
            });
            TextInputControl.prototype.setInputText = function (value, setCursorAtEnd) {
                var _this = this;
                this._hasUncommitedText = true;
                this._text = value;
                this._userInput.val(this._text);
                this.renderInputText();
                this.clearAutoCompletion();
                if (setCursorAtEnd && this._text.length > 0) {
                    // Set selection happens too quickly on Gecko browsers, introducing a 0ms delay fixes this and is fairly innocuous
                    window.setTimeout(function () {
                        _this.setCursorPosition(_this._text.length);
                    }, 0);
                }
            };
            Object.defineProperty(TextInputControl.prototype, "selection", {
                get: function () {
                    return this._selection;
                },
                enumerable: true,
                configurable: true
            });
            TextInputControl.prototype.completeInput = function () {
                if (this.isAutocompleteEnabled)
                    this.text = this._inputAutoComplete.text();
            };
            TextInputControl.prototype.clearAutoCompletion = function () {
                this._inputAutoComplete.empty();
                this.setPlaceholderText();
            };
            Object.defineProperty(TextInputControl.prototype, "placeholder", {
                get: function () {
                    return this._placeholder;
                },
                // IE behaves differently than Chrome and Opera where placeholder text will be displayed until it receive focus instead of until a character is typed in (desired behavior).
                // This is a known bug in IE, so we are using levarage autocomplete element to display watermark to get consistent behavior.
                set: function (value) {
                    this._placeholder = value;
                    this.setPlaceholderText();
                },
                enumerable: true,
                configurable: true
            });
            /** clears the highlight from the currently selected term */
            TextInputControl.prototype.clearTermHighlights = function () {
                this._inputTermSelection.hide();
            };
            /** highlights the currently selected term */
            TextInputControl.prototype.highlightSelectedTerm = function () {
                this.clearTermHighlights();
                // even though IE 10 supports HTML 5 rendering, there is a mismatch in tab character width between <input> and <span>
                // this is not something that is easily corrected, as IE 10 has no support for CSS3 tab-size
                // NOTE: We don't want to completely disable HTML 5 rendering, as this only affects utterance containing tab characters
                if (InJs.BrowserUtility.getInternetExplorerVersion() > 0 && this.text.indexOf('\t') >= 0) {
                    return;
                }
                var positionTop = 0;
                var positionLeft = 0;
                var selectionHeight = 0;
                var selectionWidth = 0;
                for (var i = this._selection.start; i <= this._selection.end; i++) {
                    var selectedTermElem = this._inputRenderer.find('span[data-termindex=\'' + i + '\']');
                    selectionWidth += selectedTermElem.width();
                    if (selectedTermElem.length > 0 && i === this._selection.start) {
                        positionTop = selectedTermElem.position().top;
                        positionLeft = selectedTermElem.position().left;
                        selectionHeight = selectedTermElem.height();
                    }
                }
                this._inputTermSelection.show().css(InJs.CssConstants.topProperty, positionTop).css(InJs.CssConstants.leftProperty, positionLeft).css(InJs.CssConstants.widthProperty, selectionWidth).css(InJs.CssConstants.heightProperty, selectionHeight);
            };
            /** Sets focus on the text input control */
            TextInputControl.prototype.focus = function () {
                if (!this.hasFocus()) {
                    this._userInput.focus();
                }
            };
            TextInputControl.prototype.hasFocus = function () {
                return this._userInput.is(':focus');
            };
            /** Unsets focus from the text input control */
            TextInputControl.prototype.blur = function () {
                this._userInput.blur();
            };
            /** Clears the current query and returns the control to a blank state */
            TextInputControl.prototype.clear = function () {
                InJs.Tracing.verbose('Question box text input was cleared');
                this.text = '';
                this.clearAutoCompletion();
                this._userInput.empty();
                this._inputRenderer.empty();
                this._currentResult = null;
                this.clearTermHighlights();
                this._terms = [];
            };
            /** Handler for interaction events */
            TextInputControl.prototype.add_interaction = function (handler, data) {
                $(this).on(QuestionBox.Constants.OnInteractionEventName, data, handler);
            };
            TextInputControl.prototype.remove_interaction = function (handler) {
                $(this).off(QuestionBox.Constants.OnInteractionEventName, handler);
            };
            /**
             * Applies an interpret result to the control
             * @param result - The result to be displayed
             * @param showAutoCompletion - Whether the text autocompletion should be displayed
             */
            TextInputControl.prototype.applyNLResult = function (result, showAutoCompletion) {
                if (this._currentResult === result)
                    return;
                this._currentResult = result;
                this._terms = result.getCompletedUtteranceAsTerms();
                if (InJs.Utility.isBoolean(showAutoCompletion) && showAutoCompletion) {
                    this.setCompletionText();
                    this.showAutoCompletion();
                }
                this.renderInputText(result);
                this.trackSelectionInternal(false);
            };
            /** Updates the current term selection for a new result triggering a new term selection event **/
            TextInputControl.prototype.updateTermSelection = function () {
                this.trackSelectionInternal(true);
            };
            TextInputControl.prototype.showAutoCompletion = function () {
                if (this.isAutocompleteEnabled)
                    this._inputAutoComplete.css(InJs.CssConstants.displayProperty, InJs.CssConstants.blockValue);
            };
            TextInputControl.prototype.hideAutoCompletion = function () {
                if (this.isAutocompleteEnabled)
                    this._inputAutoComplete.css(InJs.CssConstants.displayProperty, InJs.CssConstants.noneValue);
            };
            /** Bind events to the UI */
            TextInputControl.prototype.bindEvents = function () {
                var ieVersion = InJs.BrowserUtility.getInternetExplorerVersion();
                // Check for support of the 'input' event on the user text input
                var supportsInputEvent = InJs.Utility.isEventSupported(InJs.DOMConstants.inputEventName, this._userInput.get(0));
                // IE 9 has a half baked implementation of the input event
                // make sure we're running IE 10 or higher rather than relying on the support check alone
                if (supportsInputEvent && (ieVersion === 0 || ieVersion >= 10)) {
                    // Bind to the HTML5 input event
                    this._userInput.on(InJs.DOMConstants.inputEventName, this, TextInputControl.onUserInputTextChanged);
                    // Enable input rendering, this lets us apply rich formatting as the user types
                    this.enableHtml5InputRendering();
                }
                else {
                    // Bind text input events the old way
                    this._userInput.on(InJs.DOMConstants.keyUpEventName, this, TextInputControl.onUserInputTextChanged).on(InJs.DOMConstants.changeEventName, this, TextInputControl.onUserInputTextChanged).on(InJs.DOMConstants.cutEventName, this, function (e) {
                        // The cut event fires before the text in the element is actually modified
                        window.setTimeout(function () {
                            TextInputControl.onUserInputTextChanged(e);
                        }, 10);
                    }).on(InJs.DOMConstants.pasteEventName, this, function (e) {
                        // The paste event fires before the text in the element is actually modified
                        window.setTimeout(function () {
                            TextInputControl.onUserInputTextChanged(e);
                        }, 10);
                    });
                }
                // Bind the rest of the events
                this._userInput.on(InJs.DOMConstants.keyDownEventName, this, TextInputControl.onUserInputKeyPress).on(InJs.DOMConstants.keyUpEventName, this, TextInputControl.trackSelection).on(InJs.DOMConstants.mouseClickEventName, this, TextInputControl.trackSelection).on(InJs.DOMConstants.selectEventName, this, TextInputControl.trackSelection).on(InJs.DOMConstants.focusInEventName, this, TextInputControl.onUserInputFocusIn).on(InJs.DOMConstants.focusOutEventName, this, TextInputControl.onTextInputFocusOut).on(InJs.DOMConstants.mouseClickEventName, this, TextInputControl.selectUserInput);
            };
            /**
             * Text input key press event handler
             * @param e - jQuery event arguments for this event
             */
            TextInputControl.onUserInputFocusIn = function (e) {
                var self = e.data;
                self.raiseOnInteractionEvent(new InJs.InteractionEventArgs(QuestionBox.Constants.BeginSessionEventName));
            };
            /**
             * Text input key press event handler
             * @param e - jQuery event arguments for this event
             */
            TextInputControl.onTextInputFocusOut = function (e) {
                var self = e.data;
                self.raiseOnInteractionEvent(new InJs.InteractionEventArgs(QuestionBox.Constants.EndSessionEventName));
            };
            /**
             * Text input key press event handler
             * @param e - jQuery event arguments for this event
             */
            TextInputControl.onUserInputKeyPress = function (e) {
                var self = e.data;
                // abort on modifier keys
                if (e.keyCode === InJs.DOMConstants.altKeyCode || e.keyCode === InJs.DOMConstants.ctrlKeyCode || e.keyCode === InJs.DOMConstants.shiftKeyCode)
                    return;
                // If the cursor isn't at the end of the line, we should clear autocompletion to prevent ghosting on the input text
                var currentCaretPosition = self.getSelectionEnd();
                if (currentCaretPosition !== self._userInput.val().length) {
                    self.clearAutoCompletion();
                }
                var hasInputText = !InJs.StringExtensions.isNullOrEmpty(self._inputRenderer.text());
                var keyCode = e.keyCode;
                if (keyCode === InJs.DOMConstants.enterKeyCode) {
                    e.preventDefault();
                    if (self._hasUncommitedText) {
                        self.raiseOnInteractionEvent(new InJs.InteractionEventArgs(QuestionBox.Constants.ConfirmQueryEventName));
                        self._hasUncommitedText = false;
                    }
                    else {
                        self.raiseOnInteractionEvent(new InJs.InteractionEventArgs(QuestionBox.Constants.EndSessionEventName));
                    }
                }
                else if (keyCode === InJs.DOMConstants.escKeyCode) {
                    InJs.Tracing.verbose('User initiated clearing of the current utterance via ESC key');
                    self.raiseOnInteractionEvent(new InJs.InteractionEventArgs(QuestionBox.Constants.ClearQueryEventName));
                }
                else if ((keyCode === InJs.DOMConstants.tabKeyCode || keyCode === InJs.DOMConstants.rightArrowKeyCode) && hasInputText) {
                    var currentAutocomplete = self._inputAutoComplete.text();
                    if (currentAutocomplete.length > 0) {
                        e.preventDefault();
                        self.raiseOnInteractionEvent(new InJs.InteractionEventArgs(QuestionBox.Constants.CompleteQueryEventName));
                    }
                }
                else if (keyCode === InJs.DOMConstants.upArrowKeyCode && hasInputText) {
                    e.preventDefault();
                    self.raiseOnInteractionEvent(new InJs.InteractionEventArgs(QuestionBox.Constants.NavigateUpEventName));
                }
                else if (keyCode === InJs.DOMConstants.downArrowKeyCode && hasInputText) {
                    e.preventDefault();
                    self.raiseOnInteractionEvent(new InJs.InteractionEventArgs(QuestionBox.Constants.NavigateDownEventName));
                }
            };
            /**
             * Text input key up event handler
             * @param e - jQuery event arguments for this event
             */
            TextInputControl.onUserInputTextChanged = function (e) {
                var self = e.data;
                self.renderInputText();
                self.setCompletionText();
                self.setPlaceholderText();
                // Determine if text changed
                var queryText = self._userInput.val();
                var textChanged = self.text !== queryText;
                if (textChanged) {
                    self._text = queryText;
                    // Only clear the autocompletion text if it differs from the input text
                    if (self._inputAutoComplete.text().indexOf(self._text)) {
                        self.clearAutoCompletion();
                    }
                    if (self.text.length > 0) {
                        self.raiseOnInteractionEvent(new InJs.InteractionEventArgs(QuestionBox.Constants.TextChangedEventName));
                    }
                    else if (self.text.length === 0) {
                        self.raiseOnInteractionEvent(new InJs.InteractionEventArgs(QuestionBox.Constants.ClearQueryEventName));
                    }
                    self._hasUncommitedText = false;
                }
            };
            /**
             * Tracks the cursor position as the user interacts with the query text box
             * @param e - jQuery event arguments for this event
             */
            TextInputControl.trackSelection = function (e) {
                var self = e.data;
                // Get the keyCode
                var keyCode = e.keyCode;
                if (e.type === InJs.DOMConstants.mouseClickEventName || e.type === InJs.DOMConstants.selectEventName || (e.type === InJs.DOMConstants.keyUpEventName && (keyCode === InJs.DOMConstants.leftArrowKeyCode || keyCode === InJs.DOMConstants.rightArrowKeyCode || keyCode === InJs.DOMConstants.endKeyCode || keyCode === InJs.DOMConstants.homeKeyCode))) {
                    // since we're tracking many input events here - this action should be gated by a timer, as these can be pretty spammy otherwise
                    window.clearTimeout(self._textSelectionTimeoutId);
                    self._textSelectionTimeoutId = window.setTimeout(function () {
                        self.trackSelectionInternal(true, e);
                    }, TextInputControl.textSelectionTimeoutMs);
                }
            };
            TextInputControl.prototype.trackSelectionInternal = function (raiseEvent, sourceEvent) {
                var _this = this;
                var currentSeekIndex = 0;
                var userRangeStart = this.getSelectionStart();
                var userRangeEnd = this.getSelectionEnd();
                // abort on invalid selection, this can sometimes happen in IE
                if (userRangeEnd === null || userRangeStart === null) {
                    InJs.Tracing.warning('An invalid selection event was intercepted, the source event type was ' + sourceEvent.type);
                    return;
                }
                var isUserSingleTermSelection = userRangeStart === userRangeEnd;
                var selectedTerms = [];
                for (var i = 0; i < this._terms.length; i++) {
                    var currentTerm = this._terms[i];
                    // detect hits on terms while skipping over empty terms (spaces)
                    if (currentTerm.trim().length > 0) {
                        // if we are selecting a single term, allow hit testing on the edges of terms
                        if (isUserSingleTermSelection && currentSeekIndex <= userRangeEnd && userRangeStart <= currentSeekIndex + currentTerm.length) {
                            selectedTerms.push(i);
                        }
                        else if (!isUserSingleTermSelection && currentSeekIndex < userRangeEnd && userRangeStart < currentSeekIndex + currentTerm.length) {
                            selectedTerms.push(i);
                        }
                    }
                    currentSeekIndex += currentTerm.length;
                }
                // should we have matches on terms, fire the event up to the parent control
                if (selectedTerms.length > 0) {
                    this._selection = {};
                    this._selection.start = selectedTerms[0];
                    this._selection.end = selectedTerms[selectedTerms.length - 1];
                    if (this._currentResult.suggestionItems) {
                        // get all the possible suggestions for the selected term range
                        var suggestionsForTerm = this._currentResult.suggestionItems.filter(function (item) {
                            return item.TermStartIndex <= _this._selection.end && _this._selection.start <= item.TermEndIndex;
                        });
                        // should we have any suggestions, check to see if the suggestions all correspond to a broader term range
                        if (suggestionsForTerm.length > 0) {
                            var suggestionsForRange = suggestionsForTerm.filter(function (item) {
                                return suggestionsForTerm[0].TermStartIndex === item.TermStartIndex && suggestionsForTerm[0].TermEndIndex === item.TermEndIndex;
                            });
                            // if so, expand the control selection to cover that range
                            if (suggestionsForRange.length === suggestionsForTerm.length) {
                                this._selection.start = suggestionsForTerm[0].TermStartIndex;
                                this._selection.end = suggestionsForTerm[0].TermEndIndex;
                            }
                        }
                    }
                    this._selection.text = this._terms.slice(this._selection.start, this._selection.end + 1).join('');
                    this._selection.isUserRangeSelection = !isUserSingleTermSelection;
                    this._selection.userRangeText = this._text.substring(userRangeStart, userRangeEnd);
                    this._selection.isSingleTermSelection = this._selection.start === this._selection.end;
                    if (raiseEvent) {
                        this.raiseOnInteractionEvent(new InJs.InteractionEventArgs(QuestionBox.Constants.TermSelectedEventName));
                    }
                }
            };
            /**
             * Returns the index for the beginning of the current selection
             * @returns An integer offset representing the position at the start of the current selection
             */
            TextInputControl.prototype.getSelectionStart = function () {
                var userInputElem = this._userInput.get(0);
                try {
                    return userInputElem.selectionStart;
                }
                catch (e) {
                    InJs.Tracing.error('Unable to retrieve selection end for text input box');
                    return null;
                }
            };
            /**
             * Returns the index for the end of the current selection
             * @returns An integer offset representing the position at the end of the current selection
             */
            TextInputControl.prototype.getSelectionEnd = function () {
                var userInputElem = this._userInput.get(0);
                try {
                    return userInputElem.selectionEnd;
                }
                catch (e) {
                    InJs.Tracing.error('Unable to retrieve selection end for text input box');
                    return null;
                }
            };
            /**
             * Sets the position of the text cursor within the query text box element
             */
            TextInputControl.prototype.setCursorPosition = function (position) {
                var userInputElem = this._userInput.get(0);
                userInputElem.selectionStart = userInputElem.selectionEnd = position;
            };
            /**
             * Raises an interaction event to be handled by a state machine
             * @param args - The interaction event arguments for this event
             */
            TextInputControl.prototype.raiseOnInteractionEvent = function (args) {
                $(this).trigger(QuestionBox.Constants.OnInteractionEventName, args);
            };
            /**
             * Set the auto completion text within the text input control
             * @param result - Result from call to the NL interpretation service
             */
            TextInputControl.prototype.setCompletionText = function () {
                if (this.isAutocompleteEnabled) {
                    var result = this._currentResult;
                    // remove any completion text - to prevent stale values from hanging around
                    this._inputAutoComplete.empty();
                    // There are some conditions that must be met before setting the completion text on user input:
                    // - The completed utterance must be available, and be equal/longer than the user input
                    // - The user input must be a substring of the completed utterance
                    var currentUserInput = this._userInput.val();
                    if (result && result.completedUtterance && result.completedUtterance.Text.length >= currentUserInput.length && result.completedUtterance.Text.indexOf(currentUserInput) === 0) {
                        // split the completion text in two sections:
                        // - A transparent span that matches the current user input
                        // - A lightly colored span for the actual completion
                        // this approach reduces aliasing when blending multiple layers
                        var completionText = result.completedUtterance.Text.substring(currentUserInput.length);
                        this._inputAutoComplete.empty();
                        this._inputAutoComplete.append($('<span/>').text(currentUserInput).css(InJs.CssConstants.opacityProperty, '0'));
                        this._inputAutoComplete.append($('<span/>').text(completionText));
                    }
                }
            };
            /** Performs the necessary UI modifications to allow formatted input rendering to display */
            TextInputControl.prototype.enableHtml5InputRendering = function () {
                this._supportsHtml5InputRendering = true;
                this._userInput.addClass(TextInputControl.userInputHtml5Class);
                this._inputRenderer.addClass(TextInputControl.inputRendererHtml5Class);
            };
            /**
             * Renders, and formats, the user text while typing and performing requests against the interpretation service
             * NOTE: We still need to perform this operation, even if the browser can't actually format the rendered text,
             *       as this allows us to get metrics for the text the user has typed.
             */
            TextInputControl.prototype.renderInputText = function (result) {
                var _this = this;
                if (result && result.completedUtterance) {
                    var terms = result.getCompletedUtteranceAsTerms();
                    // now that we have the array of terms, we need to trim these to the user input
                    var userTerms = [];
                    this._inputRenderer.empty();
                    var userText = this._userInput.val();
                    for (var i = 0; i < terms.length; i++) {
                        var termText = terms[i];
                        var termElem = $('<span/>');
                        if (userText.indexOf(termText) === 0) {
                            termElem.attr(TextInputControl.TermIndexDataAttribute, i);
                            // mark unrecognized terms for formatting
                            if (result.unrecognizedTerms && result.unrecognizedTerms.indexOf(i) !== -1) {
                                termElem.attr(TextInputControl.UnrecognizedTermDataAttribute, 'true');
                            }
                            termElem.text(termText);
                            this._inputRenderer.append(termElem);
                            userText = userText.replace(termText, '');
                        }
                        if (userText.length === 0) {
                            break;
                        }
                    }
                    // if there is untokenized text in the user input, emit the remainder as a single element
                    if (userText.length > 0) {
                        var remainderTextElem = $('<span/>');
                        remainderTextElem.addClass(TextInputControl.RemainderInputCssClass);
                        remainderTextElem.text(userText);
                        this._inputRenderer.append(remainderTextElem);
                    }
                    // only perform input formatting if the browser is actually capable of displaying the rendered output
                    if (this._supportsHtml5InputRendering) {
                        // even though IE 10 supports HTML 5 rendering, there is a mismatch in tab character width between <input> and <span>
                        // this is not something that is easily corrected, as IE 10 has no support for CSS3 tab-size
                        // NOTE: We don't want to completely disable HTML 5 rendering, as this only affects utterance containing tab characters
                        if (InJs.BrowserUtility.getInternetExplorerVersion() > 0 && userText.indexOf('\t') >= 0) {
                            this._userInput.removeClass(TextInputControl.userInputHtml5Class);
                            this._inputRenderer.removeClass(TextInputControl.inputRendererHtml5Class);
                        }
                        else {
                            this.enableHtml5InputRendering();
                        }
                        // apply text formatting after a short delay
                        window.clearTimeout(this._inputRenderFormatTimeoutId);
                        this._inputRenderFormatTimeoutId = window.setTimeout(function () {
                            _this.formatRenderedText();
                        }, this._inputRenderFormatTimeoutMs);
                    }
                }
                else {
                    this._inputRenderer.text(this._userInput.val());
                }
            };
            /**
             * Performs transforms/formatting on the rendered user input
             * this happens either after the user is done typing or a new Interpret result is applied
            */
            TextInputControl.prototype.formatRenderedText = function () {
                this._inputRenderer.find(TextInputControl.UnrecognizedTermsSelector).addClass(TextInputControl.UnrecognizedTermCssClass);
            };
            TextInputControl.prototype.setPlaceholderText = function () {
                var _this = this;
                var currentUserInput = this._userInput.val();
                var placeholder = this.placeholder;
                if (InJs.StringExtensions.isNullOrEmpty(currentUserInput)) {
                    window.setTimeout(function () {
                        _this._inputAutoComplete.empty();
                        _this._inputBox.scrollLeft(0);
                        _this._inputAutoComplete.append($('<span/>').text(placeholder));
                    });
                }
            };
            TextInputControl.selectUserInput = function (e) {
                // select() will change the selection range so we only want to select when empty
                // Once the user has started typing, IE's document.activeElement will remain stable.
                var self = e.data;
                if (InJs.StringExtensions.isNullOrEmpty(self._userInput.val())) {
                    self._userInput.select();
                }
            };
            TextInputControl.TextInputControlHtml = "<div class='infonav-textInputControl'>" + "<div class='infonav-textInputBox'>" + "<div class='infonav-inputAutoComplete'></div>" + "<div class='infonav-inputTermSelection'></div>" + "<div class='infonav-inputRenderer'></div>" + "<input class='infonav-userInput' type='text' spellcheck='false' autocomplete='off' maxlength='500'></input>" + "</div>" + "</div>";
            TextInputControl.ControlRootSelector = '.infonav-textInputControl';
            TextInputControl.InputBoxSelector = '.infonav-textInputBox';
            TextInputControl.InputAutoCompleteSelector = '.infonav-inputAutoComplete';
            TextInputControl.InputRendererSelector = '.infonav-inputRenderer';
            TextInputControl.UserInputSelector = '.infonav-userInput';
            TextInputControl.InputTermSelectionSelector = '.infonav-inputTermSelection';
            TextInputControl.TermIndexDataAttribute = 'data-termindex';
            TextInputControl.UnrecognizedTermDataAttribute = 'data-unrecognizedterm';
            TextInputControl.UnrecognizedTermCssClass = 'infonav-unrecognizedTerm';
            TextInputControl.RemainderInputCssClass = 'infonav-remainderInput';
            TextInputControl.UnrecognizedTermsSelector = 'span[data-unrecognizedterm]';
            TextInputControl.userInputHtml5Class = 'infonav-userInputHTML5';
            TextInputControl.inputRendererHtml5Class = 'infonav-inputRendererHTML5';
            TextInputControl.textSelectionTimeoutMs = 20;
            return TextInputControl;
        })();
        QuestionBox.TextInputControl = TextInputControl;
    })(QuestionBox = InJs.QuestionBox || (InJs.QuestionBox = {}));
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
// IMPORTANT: Order matters in this file, think of it as loading a sequence of interdependant js files.
/// <reference path="..\Controls\QuestionBox\Constants.ts" />
/// <reference path="..\Controls\QuestionBox\QuestionBoxControl.ts" />
/// <reference path="..\Controls\QuestionBox\QuestionBox.StateMachine.ts" />
/// <reference path="..\Controls\QuestionBox\QuestionBoxSuggestionsDisplayedEventArgs.ts" />
/// <reference path="..\Controls\QuestionBox\SuggestionListControl.ts" />
/// <reference path="..\Controls\QuestionBox\TextInputControl.ts" /> 
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** Input Control base class, for common functionality all input controls
      * such as button, textbox, radio button will use.
    */
    var InputControl = (function (_super) {
        __extends(InputControl, _super);
        /** Create a input control with a optional function to excecute on click */
        function InputControl(element, func) {
            _super.call(this, element);
            if (func) {
                this.onClicked(func);
            }
        }
        InputControl.prototype.onClicked = function (func) {
            this.element.on('click', func);
        };
        Object.defineProperty(InputControl.prototype, "isEnabled", {
            get: function () {
                return !this.element.is(":disabled");
            },
            set: function (value) {
                this.element.prop("disabled", !value);
            },
            enumerable: true,
            configurable: true
        });
        return InputControl;
    })(InJs.Control);
    InJs.InputControl = InputControl;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** This is a regular button(or input type="button"),
      * the purpose of this class is to allow customizations to its look and feel
      * for example we've default styled this to have a metro look/feel.
    */
    var Button = (function (_super) {
        __extends(Button, _super);
        /** Create a button with a name and a optional function to excecute on click*/
        function Button(name, element, func) {
            if (!element) {
                element = InJs.DomFactory.button();
            }
            _super.call(this, element, func);
            this.element.attr('value', name);
        }
        Button.prototype.disableButton = function (disabledLabel) {
            this.element.prop('disabled', true);
            if (disabledLabel !== undefined) {
                this.element.attr('value', disabledLabel);
            }
        };
        Button.prototype.enableButton = function (enabledLabel) {
            this.element.prop('disabled', false);
            if (enabledLabel !== undefined) {
                this.element.attr('value', enabledLabel);
            }
        };
        return Button;
    })(InJs.InputControl);
    InJs.Button = Button;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** This is a regular html Image */
    var ImageControl = (function (_super) {
        __extends(ImageControl, _super);
        /** Create an image control*/
        function ImageControl(src, altText, element) {
            if (!element) {
                element = InJs.DomFactory.img();
            }
            element.attr('src', src);
            element.attr('alt', altText);
            _super.call(this, element);
        }
        return ImageControl;
    })(InJs.Control);
    InJs.ImageControl = ImageControl;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** This is a drop down (or Select) in HTML */
    var Select = (function (_super) {
        __extends(Select, _super);
        /** Create a select */
        function Select(hasBlank, options, selectedValue, element) {
            if (!element) {
                element = InJs.DomFactory.select();
            }
            _super.call(this, element);
            if (hasBlank) {
                this.addOption('');
            }
            if (options) {
                for (var i = 0, len = options.length; i < len; i++) {
                    this.addOption(options[i]);
                }
            }
            if (selectedValue) {
                this.setSelected(selectedValue);
            }
            element.change(this.onChange.bind(this));
        }
        Select.prototype.addOptions = function (displayValue, data, isValid) {
            debug.assert(displayValue.length === data.length, 'Mismatched display values and data items to bind');
            for (var i = 0, len = displayValue.length; i < len; ++i) {
                this.addOption(displayValue[i], data[i], isValid);
            }
        };
        /** Add a dropdown menu Item */
        Select.prototype.addOption = function (value, data, isValid) {
            if (isValid === void 0) { isValid = true; }
            var option = $('<option></option>');
            option.attr('value', value);
            option.text(value);
            if (isValid) {
                option.data(Select.SelectDataItemKey, data);
            }
            option.data(Select.SelectIsOptionValidKey, isValid);
            this.element.append(option);
        };
        Select.prototype.getSelectedItem = function () {
            return this.element.find(":selected");
        };
        Select.prototype.getSelectedItemData = function () {
            return Select.getOptionData(this.element.find(":selected"));
        };
        Select.getOptionData = function (option) {
            debug.assertValue(option, 'itemData');
            return option.data(Select.SelectDataItemKey);
        };
        Select.prototype.isSelectedOptionValid = function () {
            return this.getSelectedItem().data(Select.SelectIsOptionValidKey);
        };
        /** Returns a JQuery of the options, as filtered by the predicate. */
        Select.prototype.filterOptions = function (predicate) {
            debug.assertValue(predicate, 'predicate');
            return this.element.find('option').filter(function () {
                return predicate($(this));
            });
        };
        /** Set an item to be selected */
        Select.prototype.setSelected = function (value) {
            this.filterOptions(function (element) { return element.text() === value; }).prop('selected', true);
            this.onChange();
        };
        /** Set an item to be selected, searching by the data. */
        Select.prototype.setSelectedByData = function (data) {
            this.filterOptions(function (element) { return Select.getOptionData(element) === data; }).prop('selected', true);
            this.onChange();
        };
        /** clears all values and data*/
        Select.prototype.clear = function () {
            this.element.find('option').remove();
        };
        /** Draws a red border around select to indicate error */
        Select.prototype.markSelectInError = function () {
            this.element.addClass(Select.ErrorSelectClassName);
        };
        /** Removes the red border around select that indicates error */
        Select.prototype.unmarkSelectInError = function () {
            this.element.removeClass(Select.ErrorSelectClassName);
        };
        Select.prototype.onChange = function () {
            this.isSelectedOptionValid() ? this.unmarkSelectInError() : this.markSelectInError();
        };
        Select.SelectDataItemKey = "SelectDataItemKey";
        Select.SelectIsOptionValidKey = "IsSelectOptionValidKey";
        Select.ErrorSelectClassName = "errorSelect";
        return Select;
    })(InJs.Control);
    InJs.Select = Select;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var TextBoxEventHandlerStatus;
    (function (TextBoxEventHandlerStatus) {
        TextBoxEventHandlerStatus[TextBoxEventHandlerStatus["Enabled"] = 0] = "Enabled";
        TextBoxEventHandlerStatus[TextBoxEventHandlerStatus["TemporarilyDisabled"] = 1] = "TemporarilyDisabled";
    })(TextBoxEventHandlerStatus || (TextBoxEventHandlerStatus = {}));
    /** This is a regular textbox(or input type="text") */
    var TextBox = (function (_super) {
        __extends(TextBox, _super);
        /** Create a textbox */
        function TextBox(initialText, element) {
            if (!element) {
                element = InJs.DomFactory.textBox();
            }
            _super.call(this, element);
            if (initialText) {
                this.text = initialText;
            }
        }
        TextBox.prototype.attachDataToInput = function (data) {
            this.element.data(TextBox.TextBoxDataItemKey, data);
        };
        TextBox.getAttachedData = function (element) {
            return element.data(TextBox.TextBoxDataItemKey);
        };
        TextBox.prototype.getAttachedData = function () {
            return this.element.data(TextBox.TextBoxDataItemKey);
        };
        Object.defineProperty(TextBox.prototype, "text", {
            /** returns contents of the text box */
            get: function () {
                return this.element.val();
            },
            /** sets content of the text box */
            set: function (text) {
                this.element.val(text);
            },
            enumerable: true,
            configurable: true
        });
        /** clears text box */
        TextBox.prototype.clear = function () {
            this.text = '';
        };
        TextBox.TextBoxDataItemKey = "TextBoxDataItemKey";
        TextBox.ExtraScrollBuffer = 1000;
        return TextBox;
    })(InJs.InputControl);
    InJs.TextBox = TextBox;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var RadioGroup = (function (_super) {
        __extends(RadioGroup, _super);
        /** Create a RadioGroup with a name and its items*/
        function RadioGroup(groupName, items, element) {
            if (!element) {
                element = InJs.DomFactory.div().addClass('radioGroup');
            }
            _super.call(this, element);
            element = this.element;
            this._radioGroupName = groupName;
            var inputHtml = '';
            for (var i = 0; i < items.length; i++) {
                var tempHtml = RadioGroup.RadioInputHtml.replace('%VALUE%', items[i]);
                tempHtml = tempHtml.replace('%TEXT%', items[i]);
                tempHtml = tempHtml.replace('%GRPNAME%', groupName);
                inputHtml += tempHtml;
            }
            element.append($(inputHtml));
        }
        RadioGroup.RadioInputHtml = '<input type="radio" name="%GRPNAME%" value="%VALUE%" checked>' + '<label for = "no">%TEXT%</label><br>';
        return RadioGroup;
    })(InJs.Control);
    InJs.RadioGroup = RadioGroup;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** Item to be inserted into an Accordion Control */
    var AccordionItem = (function (_super) {
        __extends(AccordionItem, _super);
        function AccordionItem(header, content, element) {
            if (!element) {
                element = $('<li class="group accordionItemGroup">' + '<div class="accordionHeader"></div>' + '<div class="accordionContent"></div>' + '</li>');
            }
            _super.call(this, element);
            element.find(AccordionItem.AccordionItemHeaderSelector).append(header);
            element.find(AccordionItem.AccordionItemContentSelector).append(content);
        }
        AccordionItem.AccordionItemHeaderSelector = '.accordionHeader';
        AccordionItem.AccordionItemContentSelector = '.accordionContent';
        AccordionItem.AccordionItemGroupSelector = '.accordionItemGroup';
        return AccordionItem;
    })(InJs.Control);
    InJs.AccordionItem = AccordionItem;
    /** Accordion Control, used for expandable lists, that only want to expand one item at a time. */
    var AccordionControl = (function (_super) {
        __extends(AccordionControl, _super);
        function AccordionControl(items, autoSort, element) {
            if (autoSort === void 0) { autoSort = true; }
            if (!element) {
                element = InJs.DomFactory.ul().addClass(AccordionControl.AccordionControlClassName);
            }
            _super.call(this, element);
            if (items) {
                for (var i = 0; i < items.length; i++) {
                    element.append(items[i].element);
                }
            }
            this._autoSort = autoSort;
            this.initializeAccordion();
        }
        /** Initialize Accordion using JQuery UI */
        AccordionControl.prototype.initializeAccordion = function () {
            if (this._autoSort) {
                this.sort();
            }
            this.element.accordion({
                header: "> li > div.accordionHeader",
                collapsible: true,
                icons: null,
                heightStyle: "content",
                beforeActivate: function (event, ui) {
                    ui.newHeader.find('span').addClass('accordionHeaderIconnActive');
                    ui.oldHeader.find('span').removeClass('accordionHeaderIconActive');
                    var oldContentElem = ui.oldPanel.find('.accordionChangeListener');
                    var newContentElem = ui.newPanel.find('.accordionChangeListener');
                    var oldAccordionContent = oldContentElem.length > 0 ? oldContentElem.data(AccordionControl.AccordionChangeListenerKey) : null;
                    var newAccordionContent = newContentElem.length > 0 ? newContentElem.data(AccordionControl.AccordionChangeListenerKey) : null;
                    if (oldAccordionContent) {
                        oldAccordionContent.accordionItemClosing();
                    }
                    if (newAccordionContent) {
                        newAccordionContent.accordionItemOpening();
                    }
                    ui.newHeader.trigger(AccordionControl.AccordionItemClickedEventName);
                },
                activate: function (event, ui) {
                    AccordionControl.autoScrollItemIntoView(ui.newHeader, ui.newPanel);
                },
                animate: false,
                active: false // all items collapsed at start
            });
            //TODO: Re-enable sort when we have the NL work done for it.
            /*.sortable({
                axis: "y",
                handle: "h3",
                stop: function (event, ui) {
                    // IE doesn't register the blur when sorting
                    // so trigger focusout handlers to remove .ui-state-focus
                    ui.item.children("h3").triggerHandler("focusout");
                }
            });*/
        };
        AccordionControl.prototype.scrollToTop = function (onComplete) {
            var viewPort = this.element.closest(AccordionControl.AccordionScrollableAreaClassSelector);
            if (viewPort.scrollTop() == 0) {
                //skip animation
                if (onComplete) {
                    onComplete();
                }
            }
            else {
                viewPort.animate({ scrollTop: 0 }, AccordionControl.AnimationDuration, onComplete);
            }
        };
        AccordionControl.autoScrollItemIntoView = function (header, panel) {
            if (header.length > 0) {
                if (header.css('display') !== 'none') {
                    var viewPort = header.closest(AccordionControl.AccordionScrollableAreaClassSelector);
                    if (viewPort.length > 0) {
                        var scrollTop = viewPort.scrollTop();
                        var top = header.position().top;
                        var viewPortHeight = viewPort.innerHeight();
                        var itemHeight = header.outerHeight(true) + panel.outerHeight(true) + AccordionControl.ItemHeightOffSet;
                        // This condition checks if card is taller than view port,
                        // in which case it scrolls to top of the card.
                        if (viewPortHeight < top + itemHeight) {
                            var newTop = scrollTop + top + itemHeight - viewPortHeight;
                            if (newTop > scrollTop + top) {
                                newTop = scrollTop + top;
                            }
                            viewPort.animate({ scrollTop: newTop });
                        }
                    }
                }
                else {
                    var viewPort = panel.closest(AccordionControl.AccordionScrollableAreaClassSelector);
                    if (viewPort.length > 0) {
                        var scrollTop = viewPort.scrollTop();
                        var top = panel.position().top;
                        var viewPortHeight = viewPort.innerHeight();
                        var itemHeight = panel.outerHeight(true) + AccordionControl.ItemHeightOffSet;
                        // This condition checks if card is taller than view port,
                        // in which case it scrolls to top of the card.
                        if (viewPortHeight < top + itemHeight) {
                            var newTop = scrollTop + top + itemHeight - viewPortHeight;
                            if (newTop > scrollTop + top) {
                                newTop = scrollTop + top;
                            }
                            viewPort.animate({ scrollTop: newTop });
                        }
                    }
                }
            }
        };
        AccordionControl.prototype.refresh = function () {
            if (this._autoSort) {
                this.sort();
            }
            this.element.accordion('refresh');
        };
        /** adds item to the accordion control */
        AccordionControl.prototype.addItem = function (item) {
            this.element.prepend(item.element);
            this.refresh();
            item.element.fadeOut(AccordionControl.AnimationDuration).fadeIn(AccordionControl.AnimationDuration);
        };
        /** collapses all items */
        AccordionControl.prototype.collapseAllItems = function () {
            this.element.find('.ui-accordion-header-active').click();
        };
        AccordionControl.prototype.sort = function () {
            var items = this.element.find('li').get();
            items.sort(function (a, b) {
                var keyA = $(a).find('div.accordionHeader').text().toLowerCase();
                var keyB = $(b).find('div.accordionHeader').text().toLowerCase();
                if (keyA < keyB)
                    return -1;
                if (keyA > keyB)
                    return 1;
                return 0;
            });
            var ul = this.element;
            $.each(items, function (i, li) {
                ul.append(li);
            });
        };
        AccordionControl.AccordionControlSelector = '.accordionControl';
        AccordionControl.AccordionControlClassName = 'accordionControl';
        AccordionControl.AccordionChangeListenerKey = 'AccordionChangeListenerKey';
        AccordionControl.AccordionItemClickedEventName = 'AccordionItemClickedEventName';
        AccordionControl.AccordionScrollableAreaClassName = 'AccordionScrollableArea';
        AccordionControl.AccordionScrollableAreaClassSelector = '.AccordionScrollableArea';
        AccordionControl.AnimationDuration = 250;
        AccordionControl.EaseInOutQuadEasingFuctionName = "easeInOutQuad";
        /*JQuery seems to reduce height by 1px if this is called before animation*/
        AccordionControl.ItemHeightOffSet = 1;
        return AccordionControl;
    })(InJs.Control);
    InJs.AccordionControl = AccordionControl;
})(InJs || (InJs = {}));
var InJs;
(function (InJs) {
    /** Collapsible side pane control */
    var CollapsiblePaneControl = (function (_super) {
        __extends(CollapsiblePaneControl, _super);
        function CollapsiblePaneControl(name, expandedWidth, element, paneContent) {
            _super.call(this, element);
            this._contentFrameHost = null;
            this._expanderBtn = null;
            this._paneCaptionTextElem = null;
            this._name = name;
            this.initialize();
            this.content = paneContent;
            var titlePaneWidth = this.element.width() + parseInt(this.element.css(InJs.CssConstants.rightProperty));
            this.element.width(expandedWidth);
            this._collapsedWidth = titlePaneWidth - expandedWidth;
            this.element.css(InJs.CssConstants.rightProperty, this._collapsedWidth);
        }
        CollapsiblePaneControl.prototype.initialize = function () {
            var _this = this;
            this.element.addClass('collapsiblePaneControl');
            this.element.append($(CollapsiblePaneControl.InnerLayoutHtml.replace('{panePulloutText}', this._name)));
            this._contentFrameHost = this.element.find('.contentFrameHost');
            this._expanderBtn = this.element.find('.expanderBtn');
            this._paneHandle = this.element.find('.paneHandle');
            this._paneCaptionTextElem = this.element.find('.paneCaption .innerText');
            this._paneHandle.on(InJs.DOMConstants.mouseClickEventName, this, function (e) { return _this.onExpanderBtnClick(e); });
            this._paneHandle.css(InJs.CssConstants.topProperty, this._contentFrameHost.height() / 2);
            this.element.on(CollapsiblePaneControl.CollapsePaneEventName, function () { return _this.collapse(); });
            this.show();
        };
        Object.defineProperty(CollapsiblePaneControl.prototype, "content", {
            /** Sets the content body of the pane */
            set: function (_content) {
                this._contentFrameHost.empty();
                this._contentFrameHost.append(_content);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollapsiblePaneControl.prototype, "isExpanded", {
            /** Whether the pane is currently expanded */
            get: function () {
                return this.element.hasClass(CollapsiblePaneControl.ExpandedClassName);
            },
            enumerable: true,
            configurable: true
        });
        /** Expands the pane */
        CollapsiblePaneControl.prototype.expand = function () {
            if (!this.isExpanded) {
                this.toggleExpansionState();
            }
        };
        /** Collapses the pane */
        CollapsiblePaneControl.prototype.collapse = function () {
            if (this.isExpanded) {
                this.toggleExpansionState();
            }
        };
        /** Registers event to call when pane is opening */
        CollapsiblePaneControl.prototype.registerPaneExpandingEvent = function (e) {
            this._expandPaneEvent = e;
        };
        /** Registers event to call when pane is closing */
        CollapsiblePaneControl.prototype.registerPaneCollapsingEvent = function (e) {
            this._collapsePaneEvent = e;
        };
        CollapsiblePaneControl.prototype.toggleExpansionState = function () {
            if (!this.isExpanded) {
                this.element.css(InJs.CssConstants.rightProperty, 0);
            }
            else {
                this.element.css(InJs.CssConstants.rightProperty, this._collapsedWidth);
            }
            this.element.toggleClass(CollapsiblePaneControl.ExpandedClassName);
        };
        /** The action to be performed when the user clicks on the expander button
            @param e - The jQuery event object
        */
        CollapsiblePaneControl.prototype.onExpanderBtnClick = function (e) {
            this.toggleExpansionState();
        };
        CollapsiblePaneControl.CollapsePaneEventName = 'CollapsePaneEvent';
        CollapsiblePaneControl.InnerLayoutHtml = '<div class="innerLayout">' + '<div class="paneHandle">' + '<div class = "expanderBtn"></div>' + '</div>' + '<div class="paneCaption"><div class="innerText"></div></div>' + '<div class="contentFrameHost">' + '</div>' + '</div>';
        CollapsiblePaneControl.ExpandedClassName = 'expanded';
        return CollapsiblePaneControl;
    })(InJs.Control);
    InJs.CollapsiblePaneControl = CollapsiblePaneControl;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** IntelliInputbox, allows you to set suggestions as they are typed, highlight errors, and set text predictions.*/
    var IntelliInputbox = (function (_super) {
        __extends(IntelliInputbox, _super);
        function IntelliInputbox(placeholderText, element) {
            if (!element) {
                element = $(IntelliInputbox.DefaultHtml);
            }
            _super.call(this, element);
            this.initializeControls();
            this.bindEvents();
            this._primaryInput.attr('placeholder', placeholderText);
        }
        IntelliInputbox.prototype.showSpinner = function () {
            this._spinner.show();
        };
        IntelliInputbox.prototype.hideSpinner = function () {
            this._spinner.hide();
        };
        Object.defineProperty(IntelliInputbox.prototype, "text", {
            /** get text inside the primary input box */
            get: function () {
                return this._primaryInput.val();
            },
            /** set text inside the primary input box */
            set: function (value) {
                this._primaryInput.val(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IntelliInputbox.prototype, "left", {
            /** gets how much the text has overflowed left */
            get: function () {
                return this._primaryInput.scrollLeft();
            },
            enumerable: true,
            configurable: true
        });
        /** items to appear as suggestions */
        IntelliInputbox.prototype.updateSuggestions = function (items) {
            this.clearSuggestions();
            if (items.length > 0) {
                this._suggestionBox.show().append(items);
                this._suggestionBox.children().addClass(IntelliInputbox.SuggestionItemClassName);
            }
        };
        IntelliInputbox.prototype.clearSuggestions = function () {
            this._suggestionBox.empty().hide();
        };
        /** returns length of text according to the textbox's formatting */
        IntelliInputbox.prototype.calculateLengthOfText = function (str) {
            return this._textMeasurer.text(str).width();
        };
        /** underline text/errors in the input box */
        IntelliInputbox.prototype.underlineTerms = function (start, end) {
            //TODO: Re-enable when image for line is added to sprite
            /*
            this._underlineRenderer.width(0);
            var mainStr: string = this._primaryInput.val();
            var totalWidth = this.calculateLengthOfText(mainStr);

            if (end <= start) {
                return; // will result in 0 width
            }

            if (start < mainStr.length) {
                var errorStr = mainStr.substr(start);
                errorStr = errorStr.trim();
                var errorWidth = this.calculateLengthOfText(errorStr);
                var startPoint = totalWidth - errorWidth;
                var finalWidth = totalWidth - startPoint;
                this._underlineRenderer.width(finalWidth);
                var left = + this._primaryInput.offset().left;
                this._underlineRenderer.css(CssConstants.leftProperty, startPoint + left);
            }*/
        };
        /** clears everything including text, predictive text, suggestions, underline */
        IntelliInputbox.prototype.clear = function () {
            this._primaryInput.val('');
            this.clearSuggestions();
            this.hideSpinner();
        };
        IntelliInputbox.prototype.initializeControls = function () {
            var element = this.element;
            this._primaryInput = element.find('.primaryInput');
            this._textMeasurer = element.find('.textMeasurer');
            this._underlineRenderer = element.find('.underlineRenderer');
            this._suggestionBox = element.find(IntelliInputbox.SuggestionBoxSelector);
            this._spinner = element.find('.spinner');
            this.hideSpinner();
            debug.assertValue(this._spinner, '_spinner');
            debug.assertValue(this._primaryInput, '_primaryInput');
            debug.assertValue(this._textMeasurer, '_textMeasurer');
            debug.assertValue(this._suggestionBox, '_suggestionBox');
        };
        IntelliInputbox.prototype.bindEvents = function () {
            var _this = this;
            this.element.focusout(this, function (e) { return _this.onFocusOut(); });
            this._primaryInput.on('propertychange keydown input paste', function (e) { return _this.onKeyPress(e); });
            this._suggestionBox.on(InJs.DOMConstants.mouseDownEventName, IntelliInputbox.SuggestionItemSelector, function (e) { return _this.onSuggestionItemClick(e); });
            this._suggestionBox.on(InJs.DOMConstants.mouseOverEventName, IntelliInputbox.SuggestionItemSelector, function (e) { return _this.onSuggestionHoverIn(e); });
            this._suggestionBox.on(InJs.DOMConstants.mouseOutEventName, IntelliInputbox.SuggestionItemSelector, function (e) { return _this.onSuggestionHoverOut(e); });
        };
        IntelliInputbox.prototype.onSuggestionItemClick = function (e) {
            this.updateSelection(this.element.find(IntelliInputbox.SelectedItemSelector), $(e.currentTarget));
            this.onSuggestionSelected(e);
        };
        IntelliInputbox.prototype.getCaretPosition = function () {
            var field = this._primaryInput.get(0);
            var caretPos = 0;
            if (field.selectionStart || field.selectionStart == '0')
                caretPos = field.selectionStart;
            return caretPos;
        };
        Object.defineProperty(IntelliInputbox.prototype, "suggestionsCount", {
            get: function () {
                return this.element.find(IntelliInputbox.SuggestionItemSelector).length;
            },
            enumerable: true,
            configurable: true
        });
        IntelliInputbox.prototype.focus = function () {
            this._primaryInput.focus();
        };
        IntelliInputbox.prototype.onSuggestionHoverIn = function (e) {
            this.updateSelection(this.element.find(IntelliInputbox.SelectedItemSelector), $(e.currentTarget));
        };
        IntelliInputbox.prototype.onSuggestionHoverOut = function (e) {
            this.updateSelection(this.element.find(IntelliInputbox.SelectedItemSelector), null);
        };
        IntelliInputbox.prototype.onSuggestionSelected = function (e) {
            var selectedItem = this.element.find(IntelliInputbox.SelectedItemSelector);
            if (selectedItem.length > 0) {
                selectedItem.trigger(IntelliInputbox.IntelliInputboxSuggestionItemSelectedEventName, [e, selectedItem]);
                return true;
            }
            return false;
        };
        IntelliInputbox.prototype.onKeyPress = function (e) {
            var code = e.keyCode;
            var previousSelection;
            switch (code) {
                case InJs.DOMConstants.downArrowKeyCode:
                    previousSelection = this._suggestionBox.find(IntelliInputbox.SelectedItemSelector);
                    var newSelection;
                    if (previousSelection.length) {
                        newSelection = previousSelection.next();
                    }
                    else {
                        // If nothing was selected before, down arrow should select the first item in the list.
                        newSelection = this._suggestionBox.find(IntelliInputbox.SuggestionItemSelector).first();
                    }
                    this.updateSelection(previousSelection, newSelection);
                    e.preventDefault();
                    break;
                case InJs.DOMConstants.upArrowKeyCode:
                    previousSelection = this._suggestionBox.find(IntelliInputbox.SelectedItemSelector);
                    var newSelection;
                    if (previousSelection.length) {
                        newSelection = previousSelection.prev();
                    }
                    else {
                        // If nothing was selected before, down arrow should select the first item in the list.
                        newSelection = this._suggestionBox.find(IntelliInputbox.SuggestionItemSelector).last();
                    }
                    this.updateSelection(previousSelection, newSelection);
                    e.preventDefault();
                    break;
                case InJs.DOMConstants.tabKeyCode:
                    e.preventDefault();
                    if (!this.onSuggestionSelected(e)) {
                        this.element.trigger(IntelliInputbox.IntelliInputboxTabPressedEventName);
                    }
                    return;
                case InJs.DOMConstants.enterKeyCode:
                    if (this.onSuggestionSelected(e)) {
                        e.preventDefault();
                    }
                    else if (this._suggestionBox.is(InJs.JQueryConstants.VisibleSelector)) {
                        this.hideSuggestions();
                        e.preventDefault();
                    }
                    return;
            }
            this.element.trigger(IntelliInputbox.IntelliInputboxUpdateEventName, e);
        };
        IntelliInputbox.prototype.updateSelection = function (previousSelection, newSelection) {
            if (previousSelection && previousSelection.length) {
                previousSelection.removeClass(IntelliInputbox.SelectedItemClassName);
            }
            if (newSelection && newSelection.length) {
                newSelection.addClass(IntelliInputbox.SelectedItemClassName);
                this.scrollSuggestionIntoView(newSelection);
            }
        };
        IntelliInputbox.prototype.onFocusOut = function () {
            this.hideSuggestions();
        };
        IntelliInputbox.prototype.hideSuggestions = function () {
            this._suggestionBox.hide();
        };
        IntelliInputbox.prototype.scrollSuggestionIntoView = function (currentElem) {
            var scrollTop = this._suggestionBox.scrollTop();
            var viewPortHeight = this._suggestionBox.innerHeight();
            var viewPortMargin = this._suggestionBox.outerHeight(true) - this._suggestionBox.innerHeight();
            var top = currentElem.position().top + viewPortMargin;
            var itemHeight = currentElem.outerHeight(true);
            if (viewPortHeight < top + itemHeight) {
                var newTop = scrollTop + top + itemHeight - viewPortHeight;
                if (newTop > scrollTop + top) {
                    newTop = scrollTop + top;
                }
                this._suggestionBox.scrollTop(newTop);
            }
            else if (top - viewPortMargin < 0) {
                var newTop = scrollTop + top - viewPortMargin;
                this._suggestionBox.scrollTop(newTop);
            }
        };
        IntelliInputbox.IntelliInputboxUpdateEventName = "IntelliInputboxUpdateEvent";
        IntelliInputbox.IntelliInputboxTabPressedEventName = "IntelliInputboxTabPressedEvent";
        IntelliInputbox.IntelliInputboxSuggestionItemSelectedEventName = "IntelliInputboxSuggestionItemSelectedEvent";
        IntelliInputbox.SelectedItemSelector = '.selectedItem';
        IntelliInputbox.SelectedItemClassName = 'selectedItem';
        IntelliInputbox.SuggestionBoxSelector = '.suggestionbox';
        IntelliInputbox.SuggestionItemClassName = 'suggestionItem';
        IntelliInputbox.SuggestionItemSelector = '.suggestionItem';
        IntelliInputbox.DefaultHtml = '<div class="intelliInputBox">' + '<div class="underlineRenderer"/>' + '<div class="spinner"/>' + '<input class="primaryInput commonInputStyle" spellcheck="false" />' + '<div class="textMeasurer commonInputStyle" hidden/>' + '<div class="suggestionbox"/>' + '</div>';
        return IntelliInputbox;
    })(InJs.InputControl);
    InJs.IntelliInputbox = IntelliInputbox;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** TogglePanel Control, used for expandable lists, that only want to expand more than one item at a time. */
    var TogglePanelControl = (function (_super) {
        __extends(TogglePanelControl, _super);
        function TogglePanelControl(items, element) {
            _super.call(this, element);
            this._hostElement = $(TogglePanelControl.DefaultHTML);
            if (items) {
                for (var i = 0, len = items.length; i < len; i++) {
                    this._hostElement.append(items[i].element);
                }
            }
            this.initializeTogglePanel();
            this.element.append(this._hostElement);
        }
        /** Initialize Toggle Panel using JQuery UI */
        TogglePanelControl.prototype.initializeTogglePanel = function () {
            this._hostElement.togglePanelControl();
        };
        TogglePanelControl.DefaultHTML = '<ul class="togglePanelControl"></ul>';
        return TogglePanelControl;
    })(InJs.Control);
    InJs.TogglePanelControl = TogglePanelControl;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var Tab = (function () {
        function Tab(name, content) {
            this._name = name;
            this._content = content;
        }
        Object.defineProperty(Tab.prototype, "content", {
            get: function () {
                return this._content;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tab.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        return Tab;
    })();
    InJs.Tab = Tab;
    /** The Tab Control is used to display content in multiple tabs, and switch between them */
    var TabControl = (function (_super) {
        __extends(TabControl, _super);
        function TabControl(tabs, element) {
            _super.call(this, element);
            this._controlRoot = $("<div class='tabcontrol'></div>");
            this._currentContent = $("<div class='currentTabContent'></div>");
            this._tabSkeleton = "<span class='tab'>%TABNAME%</span>";
            this._tabContainer = $("<div class='tabcontainer'></div>");
            this._enabled = true;
            this._controlRoot.append(this._tabContainer);
            this._controlRoot.append("<hr class = 'divider'></hr>");
            this._controlRoot.append(this._currentContent);
            this.wireEvents();
            for (var i = 0; i < tabs.length; i++) {
                this.addTab(tabs[i]);
            }
            this.element.append(this._controlRoot);
        }
        /** Adds a tab to the control. The name of the tab must be unique*/
        TabControl.prototype.addTab = function (tab) {
            this._tabContainer.append($(this._tabSkeleton.replace("%TABNAME%", tab.name)));
            tab.content.attr('contentname', tab.name);
            tab.content.addClass('hidden');
            this._currentContent.append(tab.content);
            if (this._tabContainer.children().length === 1) {
                //select first tab added
                this._tabContainer.children().click();
            }
            return true;
        };
        Object.defineProperty(TabControl.prototype, "currentContent", {
            /** gets the content currently in view */
            get: function () {
                return this._currentContent;
            },
            enumerable: true,
            configurable: true
        });
        /** updates the content for a particular tab*/
        TabControl.prototype.updateContentForTab = function (name, content) {
            // tab not found
            return false;
        };
        Object.defineProperty(TabControl.prototype, "enabled", {
            set: function (value) {
                this._enabled = value;
            },
            enumerable: true,
            configurable: true
        });
        /** Adds the container and the event delegate for all tabs */
        TabControl.prototype.wireEvents = function () {
            this._tabContainer.on("click", "span", this, function (event) {
                var self = event.data;
                if (!self._enabled) {
                    return;
                }
                var tabClicked = $(this);
                if (self._lastSelected) {
                    self._lastSelected.removeClass("tab-selected");
                }
                self._lastSelected = tabClicked;
                tabClicked.addClass("tab-selected");
                self._currentContent.children().hide();
                var tabName = tabClicked.text();
                var tab = self._currentContent.children('[contentname="' + tabName + '"]');
                tab.fadeIn();
                var tabContent = tab.data(TabControl.ITabContentKey);
                if (tabContent) {
                    tabContent.tabSelected();
                }
            });
        };
        TabControl.ITabContentKey = "ITabContentKey";
        return TabControl;
    })(InJs.Control);
    InJs.TabControl = TabControl;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
/** Enumeration of client modeling template types */
var ClientModelingTemplateType;
(function (ClientModelingTemplateType) {
    ClientModelingTemplateType[ClientModelingTemplateType["Synonym"] = 0] = "Synonym";
})(ClientModelingTemplateType || (ClientModelingTemplateType = {}));
var InJs;
(function (InJs) {
    var ServerModelingTemplate = (function () {
        function ServerModelingTemplate(source) {
            this.type = source.PhrasingType;
            this.slotItems = source.TemplateItems;
            this.termIndices = source.TermIndices;
            this.displayText = source.DisplayText;
            this.slotValues = [];
        }
        return ServerModelingTemplate;
    })();
    InJs.ServerModelingTemplate = ServerModelingTemplate;
    var ClientModelingTemplate = (function () {
        function ClientModelingTemplate(type, items, termIndices, displayText) {
            this.type = type;
            this.slotItems = items;
            this.termIndices = termIndices;
            this.displayText = displayText;
            this.slotValues = [];
        }
        return ClientModelingTemplate;
    })();
    InJs.ClientModelingTemplate = ClientModelingTemplate;
    var ClientModelingStringSlot = (function () {
        function ClientModelingStringSlot() {
        }
        ClientModelingStringSlot.prototype.contructor = function () {
        };
        return ClientModelingStringSlot;
    })();
    InJs.ClientModelingStringSlot = ClientModelingStringSlot;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** Control to select a desired slot value for the given selection template */
    var ItemSelectionControl = (function () {
        function ItemSelectionControl(parent, itemType, items, itemToString, itemFromString, allowTextInput) {
            this._controlId = null;
            this._allowTextInput = false;
            this._itemToString = null;
            this._itemFromString = null;
            // Current state of the template selection
            this._isValid = false;
            this._selectedItem = null;
            this._highlightedItemIndex = -1;
            InJs.Utility.throwIfNullOrUndefined(parent, this, 'ctor', 'parent');
            InJs.Utility.throwIfNullOrUndefined(itemType, this, 'ctor', 'itemType');
            InJs.Utility.throwIfNullOrUndefined(items, this, 'ctor', 'items');
            InJs.Utility.throwIfNullOrUndefined(itemToString, this, 'ctor', 'itemToString');
            InJs.Utility.throwIfNullOrUndefined(itemFromString, this, 'ctor', 'itemFromString');
            InJs.Utility.throwIfNullOrUndefined(allowTextInput, this, 'ctor', 'allowTextInput');
            this._parent = parent;
            this._items = items;
            this._currentItems = items;
            this._itemType = itemType;
            this._itemToString = itemToString;
            this._itemFromString = itemFromString;
            this._allowTextInput = allowTextInput;
            this.initializeControl();
        }
        /** Event that triggers when the current selection state for the control has changed */
        ItemSelectionControl.prototype.add_selectionChanged = function (handler, data) {
            $(this).on(ItemSelectionControl.SelectionChangedEventName, data, handler);
        };
        ItemSelectionControl.prototype.remove_selectionChanged = function (handler) {
            $(this).off(ItemSelectionControl.SelectionChangedEventName, handler);
        };
        /** Event that triggers when the user presses the enter key inside the control */
        ItemSelectionControl.prototype.add_enterKeyPressed = function (handler, data) {
            $(this).on(ItemSelectionControl.EnterKeyPressedEventName, data, handler);
        };
        ItemSelectionControl.prototype.remove_onEnterKeyPressed = function (handler) {
            $(this).off(ItemSelectionControl.EnterKeyPressedEventName, handler);
        };
        /** Event that triggers when the user presses the esc key inside the control */
        ItemSelectionControl.prototype.add_escKeyPressed = function (handler, data) {
            $(this).on(ItemSelectionControl.EscKeyPressedEventName, data, handler);
        };
        ItemSelectionControl.prototype.remove_onEscKeyPressed = function (handler) {
            $(this).off(ItemSelectionControl.EscKeyPressedEventName, handler);
        };
        Object.defineProperty(ItemSelectionControl.prototype, "indexMap", {
            get: function () {
                return this._indexMap;
            },
            set: function (value) {
                this._indexMap = value;
                this.updateCurrentItems();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemSelectionControl.prototype, "isValid", {
            /** Get if the current selection is valid */
            get: function () {
                return this._isValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemSelectionControl.prototype, "selectedItem", {
            /** Get the currently selected item (null if the current selection is not valid) */
            get: function () {
                return this._selectedItem;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemSelectionControl.prototype, "itemType", {
            /** Get the item type that this control is selecting the value for */
            get: function () {
                return this._itemType;
            },
            enumerable: true,
            configurable: true
        });
        /** Creates control layout rendering */
        ItemSelectionControl.prototype.initializeControl = function () {
            var _this = this;
            this._controlId = InJs.Utility.generateGuid();
            var controlLayout = $(ItemSelectionControl.SelectionControlTemplate.replace(/{controlId}/g, this._controlId));
            this._parent.append(controlLayout);
            this._controlRoot = $(controlLayout[0]);
            this._pulldown = $(controlLayout[1]);
            this._textField = this._controlRoot.find('input.textField');
            this._selectorList = this._pulldown.find('.selectorList');
            if (!this._allowTextInput) {
                this.initializeWithNoTextInput();
            }
            else {
                this.initializeWithTextInput();
            }
            this.populateItemList();
            // update the layout after the current rendering operations have completed
            window.setTimeout(function () {
                _this.updateLayout(false);
            }, 0);
        };
        /** Initializes the control with support for user text input, this functions similarly to intellisense input */
        ItemSelectionControl.prototype.initializeWithTextInput = function () {
            var _this = this;
            this._textField.on(InJs.DOMConstants.focusInEventName, function (e) {
                e.stopPropagation();
                _this._controlRoot.addClass(ItemSelectionControl.ControlFocusedCssClass);
                _this.updateLayout(true, function () {
                    _this.highlightItem(0);
                    // Perform this call after the current rendering operations have completed
                    window.setTimeout(function () {
                        $(e.currentTarget).select();
                    }, 0);
                });
            });
            $('body').on(InJs.DOMConstants.mouseDownEventName, this, this.onDocumentClick);
            this._textField.on(InJs.DOMConstants.keyDownEventName, this, ItemSelectionControl.onTextFieldKeyPress);
            this._textField.on(InJs.DOMConstants.inputEventName, this, ItemSelectionControl.onTextFieldInput);
        };
        /** Initialies the contorl without support for user text input, this mode resembles a regular dropdown box */
        ItemSelectionControl.prototype.initializeWithNoTextInput = function () {
            var _this = this;
            this._controlRoot.addClass(ItemSelectionControl.PointerCursorCssClass);
            this._textField.addClass(ItemSelectionControl.PointerCursorCssClass);
            this._textField.attr(InJs.DOMConstants.disabledAttributeOrValue, InJs.DOMConstants.disabledAttributeOrValue);
            this._textField.val(this._itemToString(this._currentItems[0], this._currentItems));
            this.updateSelectedItemValue();
            this._controlRoot.on(InJs.DOMConstants.mouseClickEventName, function (e) {
                if (_this._currentItems.length > 1) {
                    _this._controlRoot.addClass(ItemSelectionControl.ControlFocusedCssClass);
                    _this.updateLayout(true, function () {
                        _this.highlightItem(0);
                    });
                }
            });
            $('body').on(InJs.DOMConstants.mouseDownEventName, this, this.onDocumentClick);
        };
        /** Keeps track of mouse clicks in the document, and ignores those originating from the control itself */
        ItemSelectionControl.prototype.onDocumentClick = function (e) {
            var self = e.data;
            // if the click event originated from within this control, catch the event and make sure the control remains focused
            if ($(e.target).closest('[data-controlid]').attr('data-controlid') === self._controlId) {
                e.stopPropagation();
                if (self._allowTextInput) {
                    self._textField.focus();
                }
                return;
            }
            self._controlRoot.removeClass(ItemSelectionControl.ControlFocusedCssClass);
            self.hidePulldown();
        };
        /** Populates items into the list of suggestions */
        ItemSelectionControl.prototype.populateItemList = function () {
            var _this = this;
            for (var i = 0; i < this._currentItems.length; i++) {
                var itemText = this._itemToString(this._currentItems[i], this._currentItems);
                if (itemText === null)
                    continue;
                var listItem = $(ItemSelectionControl.ListItemTemplate);
                listItem.text(itemText);
                listItem.on(InJs.DOMConstants.mouseEnterEventName, function (e) {
                    _this._selectorList.children().removeClass(ItemSelectionControl.ControlHighlightedCssClass);
                    $(e.currentTarget).addClass(ItemSelectionControl.ControlHighlightedCssClass);
                    _this._highlightedItemIndex = _this._selectorList.children(InJs.JQueryConstants.VisibleSelector).index(e.currentTarget);
                });
                listItem.on(InJs.DOMConstants.mouseLeaveEventName, function (e) {
                    $(e.currentTarget).removeClass(ItemSelectionControl.ControlHighlightedCssClass);
                    _this._highlightedItemIndex = -1;
                });
                listItem.on(InJs.DOMConstants.mouseDownEventName, this, ItemSelectionControl.onItemSelected);
                this._selectorList.append(listItem);
            }
        };
        /**
         * Event handler for when the user presses a key on the text input field
         * @ params e - The JQuery event object
        */
        ItemSelectionControl.onTextFieldKeyPress = function (e) {
            var self = e.data;
            var keyCode = e.keyCode;
            if (keyCode === InJs.DOMConstants.enterKeyCode) {
                e.preventDefault();
                $(self).trigger(ItemSelectionControl.EnterKeyPressedEventName);
            }
            else if (keyCode === InJs.DOMConstants.tabKeyCode) {
                self.selectHighlightedItem();
                self.updateLayout(true);
            }
            else if (keyCode === InJs.DOMConstants.escKeyCode) {
                e.preventDefault();
                $(self).trigger(ItemSelectionControl.EscKeyPressedEventName);
            }
            else if (keyCode === InJs.DOMConstants.upArrowKeyCode) {
                e.preventDefault();
                var visibleItemCount = self._selectorList.children(InJs.JQueryConstants.VisibleSelector).length;
                if (self._highlightedItemIndex > 0 && self._highlightedItemIndex < visibleItemCount) {
                    self._highlightedItemIndex--;
                    self.highlightItem(self._highlightedItemIndex);
                }
            }
            else if (keyCode === InJs.DOMConstants.downArrowKeyCode) {
                e.preventDefault();
                var visibleItemCount = self._selectorList.children(InJs.JQueryConstants.VisibleSelector).length;
                if (self._highlightedItemIndex >= -1 && self._highlightedItemIndex < visibleItemCount - 1) {
                    self._highlightedItemIndex++;
                    self.highlightItem(self._highlightedItemIndex);
                }
            }
        };
        /**
         * Event handler for when the user makes changes to the text input field
         * @ params e - The JQuery event object
        */
        ItemSelectionControl.onTextFieldInput = function (e) {
            var self = e.data;
            self.updateLayout(true, function () {
                self.updateSelectedItemValue();
                self.highlightItem(0);
            });
        };
        /**
         * Event handler for when the user selects an item from the suggestions dropdown
         * @ params e - The JQuery event object
        */
        ItemSelectionControl.onItemSelected = function (e) {
            e.preventDefault();
            var self = e.data;
            self._textField.val($(e.currentTarget).text());
            self.updateLayout(false);
            self.updateSelectedItemValue();
        };
        /** Selects the item at the current highlighted index */
        ItemSelectionControl.prototype.selectHighlightedItem = function () {
            var highlightedItem = this._selectorList.find(InJs.Utility.createClassSelector(ItemSelectionControl.ControlHighlightedCssClass));
            if (highlightedItem.length > 0) {
                this._textField.val(highlightedItem.text());
                this.updateSelectedItemValue();
            }
        };
        /**
         * Highlights the item at the provided index
         * @params itemIndex - The index of the (visible) item to be highlighted
        */
        ItemSelectionControl.prototype.highlightItem = function (itemIndex) {
            var _this = this;
            this._selectorList.children().removeClass(ItemSelectionControl.ControlHighlightedCssClass);
            this._selectorList.children(InJs.JQueryConstants.VisibleSelector).each(function (index, element) {
                if (itemIndex === index) {
                    $(element).addClass(ItemSelectionControl.ControlHighlightedCssClass);
                    _this._highlightedItemIndex = itemIndex;
                    return false;
                }
            });
        };
        /** Shows the suggestion dropdown list */
        ItemSelectionControl.prototype.showPulldown = function () {
            var suggestionsAvailable = false;
            this._selectorList.children().each(function (index, element) {
                if ($(element).css(InJs.CssConstants.displayProperty) === InJs.CssConstants.blockValue) {
                    suggestionsAvailable = true;
                    return false;
                }
            });
            if (suggestionsAvailable) {
                this._pulldown.css(InJs.CssConstants.displayProperty, InJs.CssConstants.blockValue);
            }
            else {
                this.hidePulldown();
            }
        };
        /** Hides the suggestion dropdown list */
        ItemSelectionControl.prototype.hidePulldown = function () {
            this._pulldown.css(InJs.CssConstants.displayProperty, InJs.CssConstants.noneValue);
        };
        /**
         * Updates the control layout based on the current state of this class
         * @param makePulldownVisible - Whether this update should attempt show the suggestion pulldown (if appropriate)
         * @param callback - The method to be executed once the update is complete
        */
        ItemSelectionControl.prototype.updateLayout = function (makePulldownVisible, callback) {
            var _this = this;
            // Get the current text
            var text = this._textField.val().trim();
            var textSize = 0;
            if (this._allowTextInput) {
                // filter items based on the current text input
                if (text.length === 0) {
                    this._controlRoot.addClass(ItemSelectionControl.ControlEmptyCssClass);
                    textSize = ItemSelectionControl.EmptyControlMinWidthPx;
                    this._selectorList.children().css(InJs.CssConstants.displayProperty, InJs.CssConstants.blockValue);
                }
                else {
                    this._controlRoot.removeClass(ItemSelectionControl.ControlEmptyCssClass);
                    textSize = this.measureText(text);
                    this._selectorList.children().each(function (index, element) {
                        if ($(element).text().indexOf(_this._textField.val()) === 0 && $(element).text().length > _this._textField.val().length) {
                            $(element).css(InJs.CssConstants.displayProperty, InJs.CssConstants.blockValue);
                        }
                        else {
                            $(element).css(InJs.CssConstants.displayProperty, InJs.CssConstants.noneValue);
                        }
                    });
                }
            }
            else {
                textSize = this.measureText(text);
                this._selectorList.children().css(InJs.CssConstants.displayProperty, InJs.CssConstants.blockValue);
            }
            var dropdownWidth = 0;
            // set the appropriate dimensions for the list items
            this._selectorList.children().each(function (index, element) {
                if ($(element).css(InJs.CssConstants.displayProperty) === InJs.CssConstants.blockValue) {
                    dropdownWidth = Math.max(_this.measureText($(element).text()) + parseInt($(element).css(InJs.CssConstants.paddingLeftProperty)) + parseInt($(element).css(InJs.CssConstants.paddingRightProperty)), dropdownWidth);
                }
            });
            // now that we know all the dimensions for the layout, apply them
            this._selectorList.css(InJs.CssConstants.minWidthProperty, dropdownWidth);
            // IMPORTANT: We must provide some lead space for the user to type on, otherwise the text field will be shaky
            this._textField.width(textSize + ItemSelectionControl.TextFieldLeadSpacePx);
            this._controlRoot.width(textSize);
            this._selectorList.width(textSize + ItemSelectionControl.PulldownPaddingPx);
            if (makePulldownVisible) {
                this.showPulldown();
            }
            else {
                this.hidePulldown();
            }
            if (callback) {
                callback();
            }
        };
        /**
         * Returns a pixel measurement of the provided text string
         * @param text - The text to measure
         * @returns - The pixel width of the provided string
         */
        ItemSelectionControl.prototype.measureText = function (text) {
            var testElem = $(ItemSelectionControl.TextMeasurementElementTemplate).text(text);
            this._controlRoot.append(testElem);
            var textSize = testElem.outerWidth();
            testElem.remove();
            return textSize;
        };
        /** Updates the current item selection and fires an event notifying the selection change */
        ItemSelectionControl.prototype.updateSelectedItemValue = function () {
            this._isValid = false;
            this._selectedItem = null;
            var text = this._textField.val().trim();
            var selectedItem = this._itemFromString(text, this._currentItems);
            if (selectedItem !== null) {
                this._isValid = true;
                this._selectedItem = selectedItem;
            }
            // Trigger the selection changed event
            $(this).trigger(ItemSelectionControl.SelectionChangedEventName);
        };
        /** Update the current items that are valid for selection in this control */
        ItemSelectionControl.prototype.updateCurrentItems = function () {
            var selectedItemRemoved = true;
            if (!this._indexMap) {
                selectedItemRemoved = false;
                this._currentItems = this._items;
            }
            else {
                this._currentItems = [];
                for (var i = 0; i < this._indexMap.length; i++) {
                    var nextItem = this._items[this._indexMap[i]];
                    if (nextItem === this._selectedItem) {
                        selectedItemRemoved = false;
                    }
                    this._currentItems.push(nextItem);
                }
            }
            // Refresh the item list
            this._selectorList.empty();
            this.populateItemList();
            // If the currently selected item was removed then set the text field to the next available item
            if (this._selectedItem && selectedItemRemoved) {
                if (this._currentItems.length > 0) {
                    this._textField.val(this._itemToString(this._currentItems[0], this._currentItems));
                }
                else {
                    this._textField.val();
                }
            }
            this.updateSelectedItemValue();
            this.updateLayout(false);
        };
        ItemSelectionControl.SelectionControlTemplate = "<div class='in_itemSelectionControl' data-controlid='{controlId}'>" + "<input class='textField' autocomplete='off' spellcheck='off' maxlength='40' type='text'></input>" + "</div>" + "<div class='in_itemSelectionPulldown' data-controlid='{controlId}'>" + "<ul class='selectorList'></ul>" + "</div>";
        ItemSelectionControl.TextMeasurementElementTemplate = '<span style="position:absolute; opacity:0; white-space:nowrap;"/>';
        ItemSelectionControl.ListItemTemplate = '<li class="item"/>';
        ItemSelectionControl.EmptyControlMinWidthPx = 60;
        ItemSelectionControl.TextFieldLeadSpacePx = 15;
        ItemSelectionControl.PulldownPaddingPx = 30;
        ItemSelectionControl.SelectionChangedEventName = "selectionChanged";
        ItemSelectionControl.EnterKeyPressedEventName = "enterKeyPressed";
        ItemSelectionControl.EscKeyPressedEventName = "escKeyPressed";
        ItemSelectionControl.PointerCursorCssClass = 'in_cursorPointer';
        ItemSelectionControl.ControlHighlightedCssClass = 'highlighted';
        ItemSelectionControl.ControlFocusedCssClass = 'focused';
        ItemSelectionControl.ControlEmptyCssClass = 'empty';
        return ItemSelectionControl;
    })();
    InJs.ItemSelectionControl = ItemSelectionControl;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** Event args for phrasing (server) template value change events */
    var TemplateValuesChangedEventArgs = (function () {
        function TemplateValuesChangedEventArgs(modelingTemplate) {
            this.modelingTemplate = null;
            this.modelingTemplate = modelingTemplate;
        }
        return TemplateValuesChangedEventArgs;
    })();
    InJs.TemplateValuesChangedEventArgs = TemplateValuesChangedEventArgs;
    /** Structure describing a filled out template */
    var TemplateOptions = (function () {
        function TemplateOptions() {
            this.Values = {};
        }
        return TemplateOptions;
    })();
    InJs.TemplateOptions = TemplateOptions;
    /** Control that displays a phrasing template and allows the user to select slot values for different template slots */
    var PhrasingTemplateControl = (function () {
        function PhrasingTemplateControl(parent, template) {
            /** Keeps track of whether the current state is valid or not */
            this._lastTemplateValuesArgs = null;
            this._parent = parent;
            this._template = template;
            this._slotTemplateItems = new Array();
            this._selectionControls = new Array();
            this.initializeControl();
        }
        /** Event fired whenever the currently selected template values have changed */
        PhrasingTemplateControl.prototype.add_templateValuesChanged = function (handler, data) {
            $(this).on(PhrasingTemplateControl.TemplateValuesChangedEventName, data, handler);
        };
        PhrasingTemplateControl.prototype.remove_templateValuesChanged = function (handler) {
            $(this).off(PhrasingTemplateControl.TemplateValuesChangedEventName, handler);
        };
        /** Event fired whenever the user wishes to confirm their changes */
        PhrasingTemplateControl.prototype.add_confirmChanges = function (handler, data) {
            $(this).on(PhrasingTemplateControl.ConfirmChangesEventName, data, handler);
        };
        PhrasingTemplateControl.prototype.remove_confirmChanges = function (handler) {
            $(this).off(PhrasingTemplateControl.ConfirmChangesEventName, handler);
        };
        /** Event fired whenever the user wishes to discard their changes */
        PhrasingTemplateControl.prototype.add_discardChanges = function (handler, data) {
            $(this).on(PhrasingTemplateControl.DiscardChangesEventName, data, handler);
        };
        PhrasingTemplateControl.prototype.remove_discardChanges = function (handler) {
            $(this).off(PhrasingTemplateControl.DiscardChangesEventName, handler);
        };
        PhrasingTemplateControl.prototype.initializeControl = function () {
            var templateBase = this._parent;
            for (var i = 0; i < this._template.slotItems.length; i++) {
                var templateItem = this._template.slotItems[i];
                // Add a space between template parts
                // NL will provide a FormatString override in the future in case they want to change this behavior
                // for language scalability.
                if (i > 0)
                    templateBase.append(" ");
                if (this._template instanceof InJs.ServerModelingTemplate) {
                    switch (InJs.Utility.getType(templateItem)) {
                        case ServerTemplateTypes.StaticItem:
                            templateBase.append(this.getStaticItemSection(templateItem));
                            break;
                        case ServerTemplateTypes.ConstantSlotItem:
                            templateBase.append(this.getConstantSlotItemSection(templateItem));
                            break;
                        case ServerTemplateTypes.SelectionSlotItem:
                            templateBase.append(this.getSelectionSlotItemSection(templateItem));
                            break;
                        default:
                            InJs.Errors.invalidOperation("Unexpected Template Type: " + InJs.Utility.getType(templateItem));
                            break;
                    }
                }
                else if (this._template instanceof InJs.ClientModelingTemplate) {
                    // Add the appropriate DOM elements / control for the current items type
                    if (templateItem instanceof InJs.ClientModelingStringSlot) {
                        templateBase.append(this.getStringFreeInputSection(templateItem));
                    }
                }
            }
        };
        PhrasingTemplateControl.prototype.getStaticItemSection = function (templateItem) {
            return $(PhrasingTemplateControl.StaticSectionTemplate.replace("{DisplayText}", templateItem.DisplayText));
        };
        PhrasingTemplateControl.prototype.getConstantSlotItemSection = function (templateItem) {
            this._slotTemplateItems.push(templateItem);
            return $(PhrasingTemplateControl.StaticSectionTemplate.replace("{DisplayText}", templateItem.SlotValue.DisplayText));
        };
        PhrasingTemplateControl.prototype.getSelectionSlotItemSection = function (templateItem) {
            var selectionParent = $("<div>");
            var allowUserTextInput = !templateItem.IsSimpleSelection;
            var selectionControl = new InJs.ItemSelectionControl(selectionParent, templateItem.DisplayText ? templateItem.DisplayText : templateItem.Name, templateItem.SlotValues, PhrasingTemplateControl.slotValueToStringConverter, PhrasingTemplateControl.slotValueFromStringConverter, allowUserTextInput);
            this.addSelectionControl(selectionControl);
            return selectionParent;
        };
        PhrasingTemplateControl.prototype.getStringFreeInputSection = function (templateItem) {
            var selectionParent = $("<div>");
            var selectionControl = new InJs.ItemSelectionControl(selectionParent, '', [], function (value, values) {
                return value;
            }, function (value, values) {
                return value.length === 0 ? null : value;
            }, true);
            this.addSelectionControl(selectionControl);
            return selectionParent;
        };
        PhrasingTemplateControl.prototype.addSelectionControl = function (selectionControl) {
            selectionControl.add_selectionChanged(this.onSelectionControlSelectionChanged, this);
            selectionControl.add_enterKeyPressed(this.onSelectionControlEnterKeyPressed, this);
            selectionControl.add_escKeyPressed(this.onSelectionControlEscKeyPressed, this);
            this._selectionControls.push(selectionControl);
        };
        /** Converts a slot value to its string representation */
        PhrasingTemplateControl.slotValueToStringConverter = function (slotValue, slotValues) {
            switch (InJs.Utility.getType(slotValue)) {
                case ServerTemplateTypes.StringSlotValue:
                case ServerTemplateTypes.EntitySlotValue:
                case ServerTemplateTypes.EdmPropertySlotValue:
                    return slotValue.DisplayText;
                case ServerTemplateTypes.InputSlotValue:
                    return null;
                default:
                    InJs.Utility.throwException("Unexpected type in slotValueFromStringConverter");
                    break;
            }
        };
        /** Converts a slot value from its string representation - returning null for invalid string values */
        PhrasingTemplateControl.slotValueFromStringConverter = function (text, slotValues) {
            for (var i = 0; i < slotValues.length; i++) {
                var slotValue = slotValues[i];
                switch (InJs.Utility.getType(slotValue)) {
                    case ServerTemplateTypes.StringSlotValue:
                    case ServerTemplateTypes.EntitySlotValue:
                    case ServerTemplateTypes.EdmPropertySlotValue:
                        if (slotValue.DisplayText.localeCompare(text) === 0) {
                            return slotValue;
                        }
                        break;
                    case ServerTemplateTypes.InputSlotValue:
                        var inputSlotValue = slotValue;
                        if (slotValues.length === 1 && PhrasingTemplateControl.isValidValue(text, inputSlotValue.InputType)) {
                            inputSlotValue.Value = text;
                            return slotValue;
                        }
                        break;
                    default:
                        InJs.Utility.throwException("Unexpected type in slotValueFromStringConverter");
                        break;
                }
            }
            return null;
        };
        PhrasingTemplateControl.isValidValue = function (text, type) {
            if (text.length === 0)
                return false;
            switch (type) {
                case 2 /* String */:
                    return true;
                case 0 /* Integer */:
                    var int = parseInt(text);
                    return int !== NaN && int === parseFloat(text);
                case 1 /* Number */:
                    return parseFloat(text) !== NaN;
                default:
                    InJs.Utility.throwException("Unexpected type in isValidValue");
                    break;
            }
            return false;
        };
        PhrasingTemplateControl.prototype.onSelectionControlEnterKeyPressed = function (e) {
            var self = e.data;
            // Check if all of the selection controls are in a valid state
            var anyInvalid = self._selectionControls.some(function (sc) {
                return !sc.isValid;
            });
            if (!anyInvalid) {
                $(self).trigger(PhrasingTemplateControl.ConfirmChangesEventName);
            }
        };
        PhrasingTemplateControl.prototype.onSelectionControlEscKeyPressed = function (e) {
            var self = e.data;
            $(self).trigger(PhrasingTemplateControl.DiscardChangesEventName);
        };
        PhrasingTemplateControl.prototype.onSelectionControlSelectionChanged = function (e) {
            var self = e.data;
            var args = new TemplateValuesChangedEventArgs(self._template);
            // clear out the previous template values
            self._template.slotValues = [];
            // Check if all of the selection controls are in a valid state
            var anyInvalid = self._selectionControls.some(function (sc) {
                return !sc.isValid;
            });
            if (!anyInvalid) {
                for (var i = 0; i < self._selectionControls.length; i++) {
                    var selectionControl = self._selectionControls[i];
                    self._template.slotValues.push({ Key: selectionControl.itemType, Value: selectionControl.selectedItem });
                }
                for (var i = 0; i < self._slotTemplateItems.length; i++) {
                    var slotTemplateItem = self._slotTemplateItems[i];
                    self._template.slotValues.push({ Key: slotTemplateItem.Name, Value: slotTemplateItem.SlotValue });
                }
            }
            // Check if we have new args since the last update
            var argsString = JSON.stringify(args);
            if (argsString !== self._lastTemplateValuesArgs) {
                InJs.Tracing.verbose("Updated Template Args: " + argsString);
                self._lastTemplateValuesArgs = argsString;
                $(self).trigger(PhrasingTemplateControl.TemplateValuesChangedEventName, args);
            }
            for (var i = 0; i < self._selectionControls.length; i++) {
                var selectionControl = self._selectionControls[i];
                if (!selectionControl.isValid)
                    continue;
                var slotValue = selectionControl.selectedItem;
                if (slotValue.SlotValueFilters) {
                    for (var j = 0; j < slotValue.SlotValueFilters.length; j++) {
                        var filter = slotValue.SlotValueFilters[j];
                        var matchingControl = self._selectionControls.filter(function (control) { return control.itemType === filter.Key; })[0];
                        if (matchingControl && matchingControl.indexMap !== filter.Value) {
                            matchingControl.indexMap = filter.Value;
                        }
                    }
                }
            }
        };
        PhrasingTemplateControl.TemplateValuesChangedEventName = "templateValuesChanged";
        PhrasingTemplateControl.ConfirmChangesEventName = "confirmChanges";
        PhrasingTemplateControl.DiscardChangesEventName = "discardChanges";
        PhrasingTemplateControl.StaticSectionTemplate = "<div class='phrasingTemplateStaticSection'>{DisplayText}</div>";
        return PhrasingTemplateControl;
    })();
    InJs.PhrasingTemplateControl = PhrasingTemplateControl;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** Control that allows the user to select amongst available phrasing templates */
    var PhrasingTemplateSelectorControl = (function () {
        function PhrasingTemplateSelectorControl(parent) {
            this._layoutRoot = null;
            this._templateSelectorHost = null;
            this._templateControlHost = null;
            this._templateControl = null;
            this._templateSelectorControl = null;
            this._modelingTemplates = null;
            this._layoutRoot = $(PhrasingTemplateSelectorControl.ControlTemplate);
            this._templateSelectorHost = this._layoutRoot.find('.templateSelectorHost');
            this._templateControlHost = this._layoutRoot.find('.templateControlHost');
            parent.append(this._layoutRoot);
        }
        /** Event fired whenever the currently selected template values have changed */
        PhrasingTemplateSelectorControl.prototype.add_templateValuesChanged = function (handler, data) {
            $(this).on(InJs.PhrasingTemplateControl.TemplateValuesChangedEventName, data, handler);
        };
        PhrasingTemplateSelectorControl.prototype.remove_templateValuesChanged = function (handler, data) {
            $(this).off(InJs.PhrasingTemplateControl.TemplateValuesChangedEventName, handler);
        };
        /** Event fired whenever the user wishes to confirm their changes */
        PhrasingTemplateSelectorControl.prototype.add_confirmChanges = function (handler, data) {
            $(this).on(InJs.PhrasingTemplateControl.ConfirmChangesEventName, data, handler);
        };
        PhrasingTemplateSelectorControl.prototype.remove_confirmChanges = function (handler, data) {
            $(this).off(InJs.PhrasingTemplateControl.ConfirmChangesEventName, handler);
        };
        /** Event fired whenever the user wishes to discard their changes */
        PhrasingTemplateSelectorControl.prototype.add_discardChanges = function (handler, data) {
            $(this).on(InJs.PhrasingTemplateControl.DiscardChangesEventName, data, handler);
        };
        PhrasingTemplateSelectorControl.prototype.remove_discardChanges = function (handler, data) {
            $(this).off(InJs.PhrasingTemplateControl.DiscardChangesEventName, handler);
        };
        PhrasingTemplateSelectorControl.prototype.applyInterpretResult = function (result, termSelection) {
            if (result.completedUtterance) {
                var terms = result.getCompletedUtteranceAsTerms();
                this._layoutRoot.find('.termText').text(termSelection.text);
                // create a local representation of the modeling templates - as we also want to add client-only templates to the mix
                this._modelingTemplates = [];
                if (termSelection.isSingleTermSelection && result.suggestedPhrasingTemplates) {
                    for (var i = 0; i < result.suggestedPhrasingTemplates.length; i++) {
                        var serverTemplate = result.suggestedPhrasingTemplates.slice(i, i + 1)[0];
                        if (serverTemplate.TermIndices.indexOf(termSelection.start) >= 0) {
                            this._modelingTemplates.push(new InJs.ServerModelingTemplate(serverTemplate));
                        }
                    }
                }
                // add client-side modeling templates to the local set
                // Allow user to declare a synonym for the current selection
                this._modelingTemplates.push(new InJs.ClientModelingTemplate(0 /* Synonym */, [new InJs.ClientModelingStringSlot()], [-1], InJs.Strings.modelingSynonymTemplateDisplayText));
                this._templateSelectorControl = new InJs.ItemSelectionControl(this._templateSelectorHost, '', this._modelingTemplates, PhrasingTemplateSelectorControl.runtimeModelingTemplateToStringConverter, PhrasingTemplateSelectorControl.runtimeModelingTemplateFromStringConverter, false);
                this._templateSelectorControl.add_selectionChanged(this.onTemplateSelectorSelectionChanged, this);
                this.createTemplateControl(0);
            }
        };
        PhrasingTemplateSelectorControl.prototype.createTemplateControl = function (phrasingIndex) {
            if (this._templateControl) {
                this._templateControl.remove_templateValuesChanged(this.onTemplateValuesChanged);
                this._templateControl.remove_confirmChanges(this.onConfirmChanges);
                this._templateControl.remove_discardChanges(this.onDiscardChanges);
            }
            this._templateControlHost.empty();
            this._templateControl = new InJs.PhrasingTemplateControl(this._templateControlHost, this._modelingTemplates[phrasingIndex]);
            this._templateControl.add_templateValuesChanged(this.onTemplateValuesChanged, this);
            this._templateControl.add_confirmChanges(this.onConfirmChanges, this);
            this._templateControl.add_discardChanges(this.onDiscardChanges, this);
        };
        /** Converts a runtime modeling to its string representation */
        PhrasingTemplateSelectorControl.runtimeModelingTemplateToStringConverter = function (modelingTemplate, modelingTemplates) {
            return modelingTemplate.displayText;
        };
        /** Converts a runtime modeling template from its string representation - returning null for invalid string values */
        PhrasingTemplateSelectorControl.runtimeModelingTemplateFromStringConverter = function (text, modelingTemplates) {
            for (var i = 0; i < modelingTemplates.length; i++) {
                var modelingTemplate = modelingTemplates[i];
                if (modelingTemplate.displayText.localeCompare(text) === 0) {
                    return modelingTemplate;
                }
            }
            return null;
        };
        PhrasingTemplateSelectorControl.prototype.onTemplateValuesChanged = function (e, args) {
            var self = e.data;
            $(self).trigger(InJs.PhrasingTemplateControl.TemplateValuesChangedEventName, args);
        };
        PhrasingTemplateSelectorControl.prototype.onConfirmChanges = function (e, args) {
            var self = e.data;
            $(self).trigger(InJs.PhrasingTemplateControl.ConfirmChangesEventName, args);
        };
        PhrasingTemplateSelectorControl.prototype.onDiscardChanges = function (e, args) {
            var self = e.data;
            $(self).trigger(InJs.PhrasingTemplateControl.DiscardChangesEventName, args);
        };
        PhrasingTemplateSelectorControl.prototype.onTemplateSelectorSelectionChanged = function (e) {
            var self = e.data;
            var selectedModelingTemplate = self._templateSelectorControl.selectedItem;
            self.createTemplateControl(self._modelingTemplates.indexOf(selectedModelingTemplate));
        };
        PhrasingTemplateSelectorControl.ControlTemplate = "<div class='in_templateSelectorControl'>" + "<div class='termText'>{termText}</div>" + "<div> means </div> " + "<div class='templateSelectorHost'></div>" + "<div class='templateControlHost'></div>" + "</div>";
        return PhrasingTemplateSelectorControl;
    })();
    InJs.PhrasingTemplateSelectorControl = PhrasingTemplateSelectorControl;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** Provides management of an original transient linguistic schema plus the ability to extend it with new entries */
    var TransientLinguisticSchemaManager = (function () {
        function TransientLinguisticSchemaManager(originalSchema) {
            this._originalSchema = originalSchema;
        }
        Object.defineProperty(TransientLinguisticSchemaManager.prototype, "originalSchema", {
            /** get the original schema used to create this manager */
            get: function () {
                return this._originalSchema;
            },
            enumerable: true,
            configurable: true
        });
        /** Get a cloned version of a particular entry in the schema or create a new one if it doesn't exist
         *  @param key - the key for the schema entry
         *  @returns a new copy of the schema entry for this key
         */
        TransientLinguisticSchemaManager.prototype.getSchemaEntry = function (key) {
            var schemaEntry = null;
            for (var i = 0; i < this._originalSchema.length; i++) {
                if (this._originalSchema[i].Key === key) {
                    schemaEntry = this._originalSchema[i];
                    break;
                }
            }
            // Make a copy of the schema entry
            if (schemaEntry) {
                schemaEntry = {
                    Key: key,
                    Value: schemaEntry.Value,
                };
            }
            else {
                schemaEntry = {
                    Key: key,
                    Value: null,
                };
            }
            return schemaEntry;
        };
        /** Get a new schema with a new entry
         *  @param newEntry - the new entry to add or replace in the the linguistic schema
         *  @returns the new transient linguistic schema with the entry replaced or added
         */
        TransientLinguisticSchemaManager.prototype.getSchema = function (newEntry) {
            var newSchema = this._originalSchema.slice(0);
            var schemaIndex = newSchema.length;
            for (var i = 0; i < this._originalSchema.length; i++) {
                if (this._originalSchema[i].Key === newEntry.Key) {
                    schemaIndex = i;
                    break;
                }
            }
            newSchema[schemaIndex] = newEntry;
            return newSchema;
        };
        return TransientLinguisticSchemaManager;
    })();
    InJs.TransientLinguisticSchemaManager = TransientLinguisticSchemaManager;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    (function (ErrorType) {
        ErrorType[ErrorType["none"] = 0] = "none";
        ErrorType[ErrorType["empty"] = 1] = "empty";
        ErrorType[ErrorType["powerView"] = 2] = "powerView";
        ErrorType[ErrorType["server"] = 3] = "server";
    })(InJs.ErrorType || (InJs.ErrorType = {}));
    var ErrorType = InJs.ErrorType;
    /** This class serves as a base for both the Silverlight and HTML5 implementations of PowerView in our UX */
    var PowerViewControl = (function (_super) {
        __extends(PowerViewControl, _super);
        function PowerViewControl(element, options) {
            _super.call(this, element, options);
            // Following variables are protected members
            this._controlRoot = null;
            this._powerViewDisplayElement = null;
            this._isPowerViewReady = false;
            this._currentSecurityToken = null;
            this._currentErrorType = 0 /* none */;
            this._lastIssuedRequestId = null;
            this._emptyErrorTimerId = 0;
            this._areSuggestionsDisplayed = false;
            this._errorElement = null;
            this._currentRequestId = null;
            this._progressIndicatorVisible = false;
            this._filterPaneOpened = false;
            this._fieldExplorerOpened = false;
            this._visualizingInterpretResponse = false;
            /** Timeout id for notification to listeners that an interpret response should be visualized */
            this._visualizeInterpretResponseTimerId = 0;
            /** Timeout id for notification to listeners that the user has stopped typing */
            this._userStoppedTypingTimerId = 0;
            /** The current visualization activities. We have to maintain a list of these since there can be multiple in-progress within PowerView */
            this._pendingVisualizationActivity = null;
            this._currentVisualizationActivities = null;
            this._controlRoot = element;
            this._currentVisualizationActivities = new Array();
            // Create error div element and add it to the DOM hidden by default
            this._errorElement = $('<div />').addClass(PowerViewControl.InfonavErrorMessageClass).css(InJs.CssConstants.displayProperty, InJs.CssConstants.noneValue);
            this._controlRoot.append(this._errorElement);
        }
        /**
         * Takes a screenshot of the currently displayed visualization in the PowerView
         * @returns A base64 encoded png image of the current contents of the PowerView control
         */
        PowerViewControl.prototype.getVisualizationSnapshot = function () {
            return null;
        };
        /**
         * Called when PowerView has been initialized.
         * Note there is no protected modifier in TypeScript, we are using public but prefix the method name with underscore for protected methods.
         */
        PowerViewControl.prototype._onPowerViewReady = function () {
            this._isPowerViewReady = true;
            if (this._currentInterpretResponse) {
                this._visualizingInterpretResponse = true;
                // Before PowerView is ready we always only maintain a single visualization activity. After it is readied-up the 
                // _pendingVisualizationActivity is used to track delay-dispatched visualization requests and hence has to be cleared here
                var visualizationActivity = this._pendingVisualizationActivity;
                this._pendingVisualizationActivity = null;
                this.applyInterpretResponse(this._currentInterpretResponse, visualizationActivity, true);
            }
        };
        /**
         * Event handler for the interpretation success event
         * @param e - Interpret success event arguments
         */
        PowerViewControl.prototype._onInterpretSuccess = function (e) {
            this._currentRequestId = e.requestId;
            var visualizationActivity = this.createVisualizationActivity(e.clientActivity);
            if (this._isPowerViewReady) {
                this._visualizingInterpretResponse = true;
                this.applyInterpretResponse(e.response, visualizationActivity, true);
            }
            else {
                InJs.Tracing.verbose("Waiting for PowerView ready before applying interpret response", e.requestId);
                if (this._pendingVisualizationActivity)
                    this._pendingVisualizationActivity.end(0 /* Unknown */, InJs.ActivityErrors.NewVisualizationRequestWhileWaitingForPowerViewReady);
                this._pendingVisualizationActivity = visualizationActivity;
            }
        };
        /**
         * Event handler for the interpretation error event
         * @param e - Interpret error event arguments
         */
        PowerViewControl.prototype._onInterpretError = function (e) {
            this.showServerError(e);
        };
        PowerViewControl.prototype._onInterpretIssued = function (e) {
            var _this = this;
            // clear pending visualization timer (if any)
            window.clearTimeout(this._visualizeInterpretResponseTimerId);
            this.hideError();
            // Save the latest issued session id.
            this._lastIssuedRequestId = e.requestId;
            this.setProgressIndicatorVisibility(false);
            window.clearTimeout(this._userStoppedTypingTimerId);
            this._userStoppedTypingTimerId = window.setTimeout(function () {
                _this._userStoppedTypingTimerId = 0;
                _this.setProgressIndicatorVisibility(true);
            }, PowerViewControl.DelayBeforeNotifyingUserStoppedTyping);
        };
        PowerViewControl.prototype._onInterpretResultCleared = function (e) {
            // clear pending visualization timer (if any)
            window.clearTimeout(this._visualizeInterpretResponseTimerId);
            this.hideError();
            if (e && e.hideVisualization === true) {
                this._powerViewDisplayElement.addClass(PowerViewControl.TransparentClass);
            }
            else {
                this.clearInterpretVisualization();
            }
        };
        PowerViewControl.prototype._onInterpretResultChanged = function (e) {
            var visualizationActivity = this.createVisualizationActivity(e.clientActivity);
            if (this._isPowerViewReady) {
                this._visualizingInterpretResponse = true;
                this.applyInterpretResponse(this._currentInterpretResponse, visualizationActivity, false);
            }
            else {
                InJs.Tracing.verbose("Waiting for PowerView ready before applying interpret result", e.requestId);
                if (this._pendingVisualizationActivity)
                    this._pendingVisualizationActivity.end(0 /* Unknown */, InJs.ActivityErrors.NewVisualizationRequestWhileWaitingForPowerViewReady);
                this._pendingVisualizationActivity = visualizationActivity;
            }
        };
        PowerViewControl.prototype._onQuestionBoxSuggestionsDisplayed = function (e) {
            if (this.connectionGroup.autoAdjustResultsControlVerticalOffset) {
                InJs.Utility.throwIfNullOrUndefined(e, this, 'OnQuestionBoxSuggestionsDisplayed', 'e');
                _super.prototype._onQuestionBoxSuggestionsDisplayed.call(this, e);
                var marginTopInPixels = e.totalSuggestionsPixelOffset;
                this._controlRoot.stop().animate({ 'margin-top': marginTopInPixels }, e.animationDuration);
            }
            this._areSuggestionsDisplayed = e.numberOfSuggestions > 0;
            if (this._hasInterpretResponse()) {
                if (this._currentInterpretResponse.result.isEmpty(this._areSuggestionsDisplayed)) {
                    this.showEmptyError(true);
                }
                else {
                    this.hideEmptyError();
                }
            }
        };
        PowerViewControl.prototype._onSetVisualizationType = function (e) {
            InJs.Utility.throwIfNullOrUndefined(e, this, 'OnSetVisualizationType', 'e');
            this.setVisualizationType(e.visualizationType);
        };
        /**
         * Event handler when a PowerViewError occured.
         * @param e - The PowerViewError event args.
         */
        PowerViewControl.prototype._onPowerViewError = function (e) {
            InJs.Utility.throwIfNullOrUndefined(e, this, 'OnPowerViewError', 'e');
            var additionalErrorInfo = $('<p />');
            additionalErrorInfo.append(InJs.InfoNavUtility.constructErrorField(InJs.Strings.errorActivityIdText, e.error.ActivityId));
            additionalErrorInfo.append(InJs.InfoNavUtility.constructErrorField(InJs.Strings.errorCallStackText, e.error.CallStack));
            this.clearEmptyErrorTimer();
            if (e.error.ExceptionTypeName !== InJs.PowerViewSilverlightControl.InvalidSemanticQueryExceptionName) {
                this.showError(InJs.Strings.serverErrorTitleText, InJs.Strings.serverErrorDetailsText, additionalErrorInfo, 2);
            }
            else {
                this.showError(InJs.Strings.serverErrorTitleText, InJs.Strings.serverReloadDetailsText, additionalErrorInfo, 2);
            }
        };
        /**
         * Fixes the visualization aspect ratio when resizing the window - to avoid misalignment
         * Note there is no protected modifier in TypeScript, we are using public but prefix the method name with underscore for protected methods.
         */
        PowerViewControl.prototype._fixVisualizationAspectRatio = function () {
            if (this._controlRoot.is(':visible')) {
                this._controlRoot.width(Math.round((this._controlRoot.height() / PowerViewControl.VisualizationAspectRatioY) * PowerViewControl.VisualizationAspectRatioX));
            }
        };
        /**
         * Handles calls from Power View. Right now we are handling the AvailableVisualizationTypes callback only.
         * @param serializedCallback - SerializedCallback is an InteractiveReportCallback instance serialized.
         * Note there is no protected modifier in TypeScript, we are using public but prefix the method name with underscore for protected methods.
         */
        PowerViewControl.prototype._hostCallbackHandler = function (serializedCallback) {
            InJs.Utility.throwIfNullOrUndefined(serializedCallback, this, 'HostCallbackHandler', 'serializedCallback');
            var callback = JSON.parse(serializedCallback);
            if (this._validateCallbackArgument(callback)) {
                if (callback.MethodName === PowerViewCallbackMethods.AvailableVisualizationTypesMethodName) {
                    this.connectionGroup.bridge.availableVisualizationTypesReady(callback.Parameter);
                    var visualizationTypes = new InJs.AvailableVisualizationTypesEventArgs(callback.Parameter);
                    var targetVisualizationType = visualizationTypes._visualizationTypes[0];
                    // this only triggers upon the user asking a new question
                    if (this._visualizingInterpretResponse) {
                        if (visualizationTypes._visualizationTypes.length) {
                            this._currentVisualizationType = visualizationTypes._visualizationTypes[0];
                            this.connectionGroup.telemetryService.notifyVisualizedInterpretResult(9 /* IPVI */, new InJs.VisualizedInterpretResultEventArgs(this._currentVisualizationType));
                        }
                        this._visualizingInterpretResponse = false;
                    }
                    else if (this._currentVisualizationType !== undefined && targetVisualizationType !== undefined && this._currentVisualizationType !== targetVisualizationType) {
                        var telemetryEventArgs = new InJs.UserChangedVisualizationTypeEventArgs(this._currentVisualizationType, targetVisualizationType);
                        this.connectionGroup.telemetryService.notifyUserChangedVisualizationType(13 /* IRCV */, telemetryEventArgs);
                    }
                }
                else if (callback.MethodName === PowerViewCallbackMethods.PowerViewErrorMethodName) {
                    this.connectionGroup.bridge.powerViewError(callback.Parameter);
                    this._visualizingInterpretResponse = false;
                }
                else if (callback.MethodName === PowerViewCallbackMethods.FieldExplorerOpenedMethodName) {
                    this.connectionGroup.telemetryService.notifyUserOpenedFieldExplorer(8 /* IPOX */);
                }
                else if (callback.MethodName === PowerViewCallbackMethods.FilterPaneOpenedMethodName) {
                    this.connectionGroup.telemetryService.notifyUserOpenedFilterPane(7 /* IPOF */);
                }
                else if (callback.MethodName === PowerViewCallbackMethods.PowerViewActivityCompletedMethodName) {
                    this.handleVisualizationEndFromPowerView(callback.Parameter);
                }
                else if (callback.MethodName === PowerViewCallbackMethods.PinVisualMethodName) {
                    this.connectionGroup.raisePinToDashboard(callback.Parameter);
                }
            }
            else {
                InJs.Tracing.warning(InJs.StringExtensions.format('Unrecognized callback received: \'{0}\'', serializedCallback));
            }
        };
        PowerViewControl.prototype._dispatchToPowerView = function (method) {
            InJs.Utility.throwException(InJs.Errors.pureVirtualMethodException("PowerViewControl", "_dispatchToPowerView"));
        };
        PowerViewControl.prototype._validateCallbackArgument = function (callback) {
            if (!callback) {
                return false;
            }
            if (!("MethodName" in callback && "Namespace" in callback)) {
                return false;
            }
            if (callback.Namespace !== PowerViewCallbackMethods.InteractiveReportNamespace) {
                return false;
            }
            return true;
        };
        PowerViewControl.prototype._onCollageVisibilityChanged = function (collageShown) {
            if (collageShown) {
                this._controlRoot.addClass(PowerViewControl.TransparentClass);
            }
            else {
                this._controlRoot.removeClass(PowerViewControl.TransparentClass);
            }
        };
        PowerViewControl.prototype.applyInterpretResponse = function (response, visualizationActivity, isNewResponse) {
            var _this = this;
            InJs.Utility.throwIfNullOrUndefined(response, this, 'ApplyInterpretResult', 'response');
            InJs.Utility.throwIfNullOrUndefined(visualizationActivity, this, 'ApplyInterpretResult', 'visualizationActivity');
            if (response.isEmpty(this._areSuggestionsDisplayed) || response.result.isEmpty(this._areSuggestionsDisplayed)) {
                if (visualizationActivity)
                    visualizationActivity.end(0 /* Unknown */, InJs.ActivityErrors.EmptyInterpretResult);
                this.showEmptyError(isNewResponse);
            }
            else {
                this.hideError();
                // clear pending visualization timer (if any)
                window.clearTimeout(this._visualizeInterpretResponseTimerId);
                if (this._pendingVisualizationActivity)
                    this._pendingVisualizationActivity.end(0 /* Unknown */, InJs.ActivityErrors.NewVisualizationRequestDelayingPrevious);
                this._pendingVisualizationActivity = visualizationActivity || this.createVisualizationActivity();
                // set a new visualization timer
                this._visualizeInterpretResponseTimerId = window.setTimeout(function (interpretResponse) {
                    // set the security token on the powerview control, if it is available (and is different from our current token)
                    if (_this._currentSecurityToken !== _this.connectionGroup.getSecurityToken()) {
                        if (InJs.StringExtensions.isNullOrEmpty(_this.connectionGroup.getSecurityToken())) {
                            return;
                        }
                        _this.setSecurityToken(_this.connectionGroup.getSecurityToken());
                    }
                    _this._currentVisualizationActivities.push(_this._pendingVisualizationActivity);
                    var method = PowerViewMethods.getPowerViewApplyInterpretResultMethod(response.result.source, _this._pendingVisualizationActivity.activityId);
                    _this._pendingVisualizationActivity = null;
                    _this._dispatchToPowerView(method);
                    InJs.Tracing.verbose(InJs.StringExtensions.format('Rendering visualization for \'{0}\'', response.result.completedUtterance.Text));
                }, PowerViewControl.DelayBeforeVisualizeInterpretResponse, this._currentInterpretResponse);
            }
        };
        PowerViewControl.prototype.showServerError = function (e) {
            this.clearEmptyErrorTimer();
            var detailsText = this.getServerErrorDetailsText(e);
            var additionalErrorInfo = null;
            // Create additional error info if we got a response code and request id.
            if (e.statusCode && !InJs.StringExtensions.isNullOrEmpty(e.requestId)) {
                additionalErrorInfo = InJs.InfoNavUtility.constructAdditionalErrorInfoBlock(e.statusCode.toString(), e.infoNavError, e.activityId, e.requestId, e.timeStamp);
            }
            this.showError(InJs.Strings.serverErrorTitleText, detailsText, additionalErrorInfo, 3, e.requestId);
        };
        PowerViewControl.prototype.showEmptyError = function (useTimeout) {
            var _this = this;
            this.clearEmptyErrorTimer();
            if (useTimeout) {
                this._emptyErrorTimerId = window.setTimeout(function () {
                    _this.showEmptyErrorTimerCallback();
                }, PowerViewControl.EmptyErrorTimeout);
            }
            else {
                this.showEmptyErrorTimerCallback();
            }
        };
        PowerViewControl.prototype.showEmptyErrorTimerCallback = function () {
            // Only show the empty error if there have been no new requests to the server
            // since the current session.
            if (this._lastIssuedRequestId === this._currentRequestId) {
                this.showError(InJs.Strings.emptyResultTitleText, InJs.Strings.emptyResultDescriptionText, null, 1, this._currentRequestId);
            }
        };
        PowerViewControl.prototype.showError = function (titleText, detailsText, additionalErrorInfo, errorType, requestId) {
            var _this = this;
            // We can do this because in the current implementation the error message and the error types map 1:1
            // We should however formalize this through a directory so that we don't by mistake introduce a scenario where 
            // the message changes yet we don't update the screen
            if (this._currentErrorType !== errorType) {
                this._currentErrorType = errorType;
                this._errorElement.empty();
                this.connectionGroup.telemetryService.notifyUserGotError(1 /* IEDE */, new InJs.UserGotErrorEventArgs(errorType ? ErrorType[errorType] : '', titleText + ';' + detailsText, requestId));
                var titleElement = $('<div />');
                titleElement.addClass(PowerViewControl.TextLargeClass);
                titleElement.addClass(PowerViewControl.InfonavErrorTitleClass);
                titleElement.text(titleText);
                var detailsElement = $('<div />');
                detailsElement.text(detailsText);
                detailsElement.addClass(PowerViewControl.InfonavErrorDetailClass);
                this._errorElement.append(titleElement);
                this._errorElement.append(detailsElement);
                if (additionalErrorInfo) {
                    var additionalErrorInfoContainer = InJs.InfoNavUtility.constructShowDetailsContainer(additionalErrorInfo);
                    this._errorElement.append(additionalErrorInfoContainer);
                }
                // Only show a link to the collage if it is not empty:
                if (this.connectionGroup.featuredQuestions.length !== 0) {
                    this._errorElement.append(PowerViewControl.CollageNavigationHtml);
                    var collageTextElement = this._errorElement.find(PowerViewControl.CollageNavigationTextSelector);
                    collageTextElement.text(InJs.Strings.showCollageText);
                    collageTextElement.addClass(PowerViewControl.TextLargeClass);
                    var collageElements = this._errorElement.find(PowerViewControl.CollageNavigationElementsSelector);
                    collageElements.on(InJs.DOMConstants.mouseClickEventName, function (e) {
                        _this.connectionGroup.telemetryService.notifyUserDisplayedFeaturedQuestions(2 /* IEDF */);
                        _this.hideEmptyError();
                        _this.connectionGroup.bridge.showCollage();
                    });
                    this._errorElement.append(collageElements);
                }
                // Hide the power view element and show the error element
                // To show/hide power view element, we use "opacity" style, because if we use display style, Chrome will unload silverlight.
                // To show/hide error message element, we keep using "display" style, because UX test automation doesn't support "opacity" very well.
                this.clearInterpretVisualization();
                this._powerViewDisplayElement.addClass(PowerViewControl.TransparentClass);
                this._errorElement.css(InJs.CssConstants.displayProperty, InJs.CssConstants.blockValue);
                // Trace the error
                if (detailsText) {
                    InJs.Tracing.error(detailsText + '\n' + additionalErrorInfo);
                }
            }
        };
        PowerViewControl.prototype.hideEmptyError = function () {
            if (this._currentErrorType === 1 /* empty */) {
                this.hideError();
            }
        };
        PowerViewControl.prototype.hideError = function () {
            this._currentErrorType = 0;
            this.clearEmptyErrorTimer();
            this._powerViewDisplayElement.removeClass(PowerViewControl.TransparentClass);
            this._errorElement.css(InJs.CssConstants.displayProperty, InJs.CssConstants.noneValue);
        };
        PowerViewControl.prototype.clearEmptyErrorTimer = function () {
            if (this._emptyErrorTimerId) {
                window.clearTimeout(this._emptyErrorTimerId);
            }
        };
        PowerViewControl.prototype.getServerErrorDetailsText = function (e) {
            if (e.timedOut) {
                return InJs.Strings.serverTimeoutDetailsText;
            }
            return InJs.Strings.serverErrorDetailsText;
        };
        PowerViewControl.prototype.clearInterpretVisualization = function () {
            var method = PowerViewMethods.getPowerViewClearInterpretVisualizationMethod();
            this._dispatchToPowerView(method);
        };
        PowerViewControl.prototype.setVisualizationType = function (visualizationType) {
            var method = PowerViewMethods.getPowerViewSetVisualizationTypeMethod(visualizationType);
            this._dispatchToPowerView(method);
        };
        PowerViewControl.prototype._onUserUtteranceConfirmed = function () {
            this.setProgressIndicatorVisibility(true);
        };
        PowerViewControl.prototype.setProgressIndicatorVisibility = function (visible) {
            // There are three situations in which this method will be called:
            // 1. An interpret has just been issued - _interpretIssued will always call this with
            //    visible = false.
            // 2. This is being by _onUserUtteranceConfirmed called right after a call to 
            //    _interpretIssued. If this is the case, the last thing the user did indicated that he 
            //    was done typing.
            // 3. The user stopped typing timer id went off, in which case this is some time after the 
            //    interpret was issued. We can guarantee that no other requests have been issued after
            //    it because the timer would have been cancelled when that happened.
            if (this._progressIndicatorVisible !== visible) {
                var method = PowerViewMethods.getPowerViewSetProgressIndicatorVisibilityMethod(visible);
                this._dispatchToPowerView(method);
                this._progressIndicatorVisible = visible;
            }
        };
        PowerViewControl.prototype.setSecurityToken = function (securityToken) {
            InJs.Utility.throwIfNullOrEmptyString(securityToken, this, 'SetSecurityToken', 'securityToken');
            var method = PowerViewMethods.getPowerViewSetSecurityTokenMethod(securityToken);
            this._dispatchToPowerView(method);
            this._currentSecurityToken = securityToken;
        };
        PowerViewControl.prototype.createVisualizationActivity = function (parentActivity) {
            var visualizationActivity = this.connectionGroup.telemetryService.createNewActivity(25 /* INPV */, parentActivity);
            return visualizationActivity;
        };
        PowerViewControl.prototype.handleVisualizationEndFromPowerView = function (powerViewClientActivity) {
            var _this = this;
            if (!powerViewClientActivity)
                return;
            // Find the matching visualization activity
            var matchedIndex;
            var matchedVisualizationActivity;
            for (var i = this._currentVisualizationActivities.length - 1; i >= 0; i--) {
                if (this._currentVisualizationActivities[i].activityId === powerViewClientActivity.ActivityId) {
                    matchedIndex = i;
                    matchedVisualizationActivity = this._currentVisualizationActivities[matchedIndex];
                    break;
                }
            }
            if (!matchedVisualizationActivity) {
                InJs.Tracing.warning('Matching visualization activity for activityId=' + powerViewClientActivity.ActivityId + ' cannot be found');
                return;
            }
            // Only end activities that had a RenderEdit. If the activity does not have a RenderEdit but ended with a failure 
            // we still transfer the correlated properties from the last RenderEdit but will report this failure even if the 
            // previous RenderEdit succeeded and vice versa
            if (powerViewClientActivity.CorrelatedProperties && powerViewClientActivity.CorrelatedProperties.some(function (item) {
                return item.PropertyName === PowerViewControl.RenderEditCorrelatedPropertyName;
            })) {
                matchedVisualizationActivity.addCorrelatedProperties(powerViewClientActivity.CorrelatedProperties.map(function (item) {
                    return new InJs.CorrelatedProperty(item.PropertyName, item.PropertyValue);
                }));
                matchedVisualizationActivity.end(powerViewClientActivity.ActivityEndedWith, powerViewClientActivity.Error);
                this.cleanupVisualizationActivities(matchedIndex);
                return;
            }
            // If we don't have a RenderEdit that means the activity is reliant on the closest previous completed activity which
            // has a RenderEdit. Note that we have to handle in-progress activities as these can still end-up having a RenderEdit
            if (matchedIndex === 0) {
                InJs.Tracing.warning('No previously completed activity exists when it is expected to');
                matchedVisualizationActivity.addCorrelatedProperties(powerViewClientActivity.CorrelatedProperties.map(function (item) {
                    return new InJs.CorrelatedProperty(item.PropertyName, item.PropertyValue);
                }));
                matchedVisualizationActivity.addCorrelatedProperty(new InJs.CorrelatedProperty('originalActivityEndedWith', powerViewClientActivity.ActivityEndedWith.toString()));
                matchedVisualizationActivity.addCorrelatedProperty(new InJs.CorrelatedProperty('originalActivityError', JSON.stringify(powerViewClientActivity.Error)));
                matchedVisualizationActivity.end(0 /* Unknown */, InJs.ActivityErrors.UnexpectedVisualizationActivityEnd);
                // Don't cleanup, just need to remove this first activity as it shouldn't have gotten to this state in the first place
                this._currentVisualizationActivities.splice(0, 1);
                return;
            }
            var previousVisualizationActivity = this._currentVisualizationActivities[matchedIndex - 1];
            if (previousVisualizationActivity.completed) {
                matchedVisualizationActivity.addCorrelatedProperties(powerViewClientActivity.CorrelatedProperties.map(function (item) {
                    return new InJs.CorrelatedProperty(item.PropertyName, item.PropertyValue);
                }));
                matchedVisualizationActivity.addCorrelatedProperty(new InJs.CorrelatedProperty('delegated', 'true'));
                matchedVisualizationActivity.addCorrelatedProperties(previousVisualizationActivity.correlatedProperties);
                // Don't cleanup, just remove this one since we can be nested here. This will also has to be here to ensure that 
                // delegated visualization activities are ended towards rendered as opposed to delegated previous activities which 
                // avoids correlated property duplication
                this._currentVisualizationActivities.splice(matchedIndex, 1);
                // Since PowerView can return subsequent activities as successfull before the parent finishes processing render
                // we have to handle the case where the render edit fails. This is the purpose of activityToUseForResult to avoid
                // reporting success if what the user really sees is a failure. The end time however always have to be that of the 
                // rendering activity.
                var usePreviousForResult = this.shouldUsePreviousActivityForResult(powerViewClientActivity.ActivityEndedWith, previousVisualizationActivity.activityEndResult);
                if (usePreviousForResult) {
                    matchedVisualizationActivity.end(previousVisualizationActivity.activityEndResult, previousVisualizationActivity.error, previousVisualizationActivity.activityEndTime);
                }
                else {
                    matchedVisualizationActivity.end(powerViewClientActivity.ActivityEndedWith, powerViewClientActivity.Error, previousVisualizationActivity.activityEndTime);
                }
            }
            else {
                // This is a potential match, we have to wait until it ends
                previousVisualizationActivity.onCompleted(function (visualizationActivity) {
                    _this.handleVisualizationEndFromPowerView(powerViewClientActivity);
                });
            }
        };
        PowerViewControl.prototype.shouldUsePreviousActivityForResult = function (actualActivityResult, previousActivityResult) {
            if (actualActivityResult !== 1 /* Success */ && actualActivityResult !== 2 /* SuccessDespiteError */)
                return false;
            if (previousActivityResult !== 1 /* Success */ && previousActivityResult !== 2 /* SuccessDespiteError */)
                return true;
            if (actualActivityResult === 2 /* SuccessDespiteError */)
                return false;
            if (previousActivityResult === 2 /* SuccessDespiteError */)
                return true;
            return false;
        };
        PowerViewControl.prototype.cleanupVisualizationActivities = function (lastRenderedIndex) {
            for (var i = lastRenderedIndex - 1; i >= 0; i--) {
                if (!this._currentVisualizationActivities[i].completed) {
                    InJs.Tracing.warning('The activity should have ended as there is a newer completed visualization activity | ' + this._currentVisualizationActivities[i].toString());
                    this._currentVisualizationActivities[i].end(0 /* Unknown */, InJs.ActivityErrors.UnexpectedVisualizationActivityEnd);
                }
            }
            this._currentVisualizationActivities.splice(0, lastRenderedIndex);
        };
        PowerViewControl.InfonavErrorMessageClass = 'infonav-errorMessage';
        PowerViewControl.InfonavErrorTitleClass = 'infonav-errorTitle';
        PowerViewControl.InfonavErrorDetailClass = 'infonav-errorDetail';
        PowerViewControl.CollageNavigationTextSelector = '.collageNavigationText';
        PowerViewControl.CollageNavigationElementsSelector = '.collageNavigationElements';
        PowerViewControl.TransparentClass = 'infonav-transparent';
        PowerViewControl.EmptyErrorTimeout = 1000;
        PowerViewControl.VisualizationAspectRatioX = 4;
        PowerViewControl.VisualizationAspectRatioY = 3;
        PowerViewControl.PowerViewReportMargin = 53;
        PowerViewControl.TextLargeClass = 'ms-textLarge';
        PowerViewControl.RenderEditCorrelatedPropertyName = 'renderEditRequestId';
        PowerViewControl.RenderedActivityCorrelatedPropertiesPrefix = 'rendered_';
        PowerViewControl.CollageNavigationHtml = "<div class='collageNavigationElements'>" + "<div class='collageNavigationIcon'></div>" + "<div class='collageNavigationText'></div>" + "</div>";
        /** The timeout in ms after which an interpret response should be visualized */
        PowerViewControl.DelayBeforeVisualizeInterpretResponse = 200;
        /** The timeout in ms after which listeners will be notified that the user has stopped typing */
        PowerViewControl.DelayBeforeNotifyingUserStoppedTyping = 1000;
        return PowerViewControl;
    })(InJs.InfoNavConnectedClientControl);
    InJs.PowerViewControl = PowerViewControl;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** The Power View HTML5 client side control */
    var PowerViewHTML5Control = (function (_super) {
        __extends(PowerViewHTML5Control, _super);
        function PowerViewHTML5Control(element, options) {
            _super.call(this, element, options);
            this._powerViewIframeWindow = null;
            $(window).on('message', this, this.onMessage);
            this._powerViewDisplayElement = $(InJs.PowerViewHTML5Control.PowerViewIframeHtml);
            this._controlRoot.append(this._powerViewDisplayElement);
            this._powerViewDisplayElement.attr('src', InJs.PowerViewHTML5Control.PowerViewIframeSrcUrl);
            this._powerViewIframeWindow = this._powerViewDisplayElement[0].contentWindow;
        }
        PowerViewHTML5Control.prototype._dispatchToPowerView = function (method) {
            if (this._isPowerViewReady) {
                var powerViewMethodJson = JSON.stringify(method);
                this._powerViewIframeWindow.postMessage(powerViewMethodJson, InJs.Configuration.siteUrl);
            }
        };
        PowerViewHTML5Control.prototype.onMessage = function (e) {
            var self = e.data;
            var originalEvent = e.originalEvent;
            var callback = JSON.parse(originalEvent.data);
            if (self._validateCallbackArgument(callback)) {
                if (callback.MethodName === PowerViewCallbackMethods.InitializedMethodName) {
                    self._onPowerViewReady();
                }
                else {
                    self._hostCallbackHandler(originalEvent.data);
                }
            }
            else {
                InJs.Tracing.warning(InJs.StringExtensions.format('Unrecognized callback received: \'{0}\'', originalEvent.data));
            }
        };
        PowerViewHTML5Control.PowerViewIframeSrcUrl = '/infonav/app/resources/pv/infonavpv.html';
        PowerViewHTML5Control.PowerViewIframeHtml = '<iframe class=\'infonav-powerViewIframe\'></iframe>';
        return PowerViewHTML5Control;
    })(InJs.PowerViewControl);
    InJs.PowerViewHTML5Control = PowerViewHTML5Control;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** Script#: The Power View Silverlight client side control */
    var PowerViewSilverlightControl = (function (_super) {
        __extends(PowerViewSilverlightControl, _super);
        function PowerViewSilverlightControl(element, options, xapUrl) {
            _super.call(this, element, options);
            this._interactiveReportHandler = null;
            this._silverlightElementId = null;
            if (options.showExplorerPane == null) {
                options.showExplorerPane = true;
            }
            if (!InJs.Utility.isBoolean(options.showExplorerPane)) {
                InJs.Utility.throwException(InJs.Errors.invalidOperation('showExplorerPane parameter must be a boolean type'));
            }
            var onLoadCallback = this.createOnSilverlightLoadCallback(options.group.name);
            var interactiveReportHandlerRegistrationCallback = this.createInteractiveReportHandlerRegistrationCallback(options.group.name);
            var reportServerUrl = this.connectionGroup.absoluteReportServerUrl;
            var serverTraceLevel = InJs.QueryStringUtil.getQueryStringValue("serverTraceLevel");
            var traceLevel = 1;
            if (!!serverTraceLevel) {
                traceLevel = parseInt(serverTraceLevel);
                if (isNaN(traceLevel)) {
                    traceLevel = 1;
                }
            }
            var silverlightHtml = PowerViewSilverlightControl._silverlightHtml.replace(/{reportServerUri}/g, reportServerUrl).replace(/{serverTraceLevel}/g, traceLevel.toString()).replace(/{xapUri}/g, xapUrl).replace(/{showExplorer}/g, options.showExplorerPane.toString()).replace(/{onLoadCallback}/g, onLoadCallback).replace(/{interactiveReportHandlerRegistrationCallback}/g, interactiveReportHandlerRegistrationCallback);
            // Populate the control with the object tag containing the silverlight control
            var silverlightElem = $(silverlightHtml);
            this._silverlightElementId = this._controlRoot.attr('id') + '_pv';
            silverlightElem.attr('id', this._silverlightElementId);
            this._controlRoot.append(silverlightElem);
            PowerViewSilverlightControl.resetPowerViewControlSize();
            // Get a handle to the PowerView display element (Silverlight object) so we can show or hide it
            this._powerViewDisplayElement = this._controlRoot.find(InJs.Utility.createIdSelector(this._silverlightElementId));
            if (this.connectionGroup.getIsReady()) {
                this.updateGeocodingState();
            }
        }
        PowerViewSilverlightControl.prototype.createInteractiveReportHandlerRegistrationCallback = function (connectionGroupName) {
            var _this = this;
            var callbackIdentifier = PowerViewSilverlightControl.InteractiveReportHandlerRegistrationCallbackPrefix + connectionGroupName;
            window[callbackIdentifier] = function (interactiveReportHandler) {
                window[callbackIdentifier] = undefined;
                _this._interactiveReportHandler = interactiveReportHandler;
            };
            return callbackIdentifier;
        };
        PowerViewSilverlightControl.prototype.createOnSilverlightLoadCallback = function (connectionGroupName) {
            var _this = this;
            var callbackIdentifier = PowerViewSilverlightControl.OnLoadCallbackPrefix + connectionGroupName;
            window[callbackIdentifier] = function () {
                window[callbackIdentifier] = undefined;
                _this.onSilverlightControlReady();
            };
            return callbackIdentifier;
        };
        Object.defineProperty(PowerViewSilverlightControl.prototype, "interactiveReportHandler", {
            get: function () {
                if (!this._interactiveReportHandler)
                    InJs.Utility.throwException(InJs.Errors.invalidOperation('InteractiveReportHandler was not yet initialized'));
                return this._interactiveReportHandler;
            },
            enumerable: true,
            configurable: true
        });
        /** This is called externaly from generated js code, which is invoked by the Power View silverlight control upon load */
        PowerViewSilverlightControl.prototype.onSilverlightControlReady = function () {
            this._onPowerViewReady();
            // Power View requires a global event handler.
            var hostCallbackHandlerGlobal = 'HostCallbackHandler' + this._silverlightElementId;
            this.addGlobalFunctionForHostBackHandler(hostCallbackHandlerGlobal);
            this.interactiveReportHandler.RegisterHostCallbacksHandler(hostCallbackHandlerGlobal);
        };
        /**
         * Takes a screenshot of the currently displayed visualization in the Silverlight control
         * @returns A base64 encoded png image of the current contents of the silverlight control
         */
        PowerViewSilverlightControl.prototype.getVisualizationSnapshot = function () {
            if (this._isPowerViewReady) {
                return 'data:image/png;base64,' + this.interactiveReportHandler.GetSnapshot();
            }
            return null;
        };
        PowerViewSilverlightControl.prototype.addGlobalFunctionForHostBackHandler = function (name) {
            var _this = this;
            window[name] = function (serializedCallback) {
                _this._hostCallbackHandler(serializedCallback);
            };
        };
        PowerViewSilverlightControl.prototype._dispatchToPowerView = function (method) {
            if (this._isPowerViewReady) {
                method.CorrelationId = InJs.AppManager.current.activityId;
                // We have to use MicrosoftAjax serializer as opposed to native JSON.serialize here 
                // because the dates for PowerView need to be serialized as "\/Date(1234567890)\/" 
                // as opposed to "1997-07-16T19:20:30.45Z" which is produced by the JSON serializer.
                var json = InJs.JavaScriptSerializer.serialize(method);
                this.interactiveReportHandler.DispatchMethod(json);
            }
        };
        PowerViewSilverlightControl.prototype._onConnectionGroupReady = function () {
            this.updateGeocodingState();
        };
        PowerViewSilverlightControl.prototype._onPowerViewReady = function () {
            this._isPowerViewReady = true;
            this.updateGeocodingState();
            _super.prototype._onPowerViewReady.call(this);
        };
        /** Updates the geocoding state of the SL control based on the settings **/
        PowerViewSilverlightControl.prototype.updateGeocodingState = function () {
            if (this._isPowerViewReady && this.connectionGroup.getIsReady()) {
                var allowGeocoding = this.connectionGroup.isGeocodingEnabled;
                InJs.Tracing.verbose(InJs.StringExtensions.format('Setting geocoding to \'{0}\'', allowGeocoding ? 'true' : 'false'));
                var method = PowerViewMethods.getPowerViewSetAllowGeocodingMethod(allowGeocoding);
                this._dispatchToPowerView(method);
            }
        };
        /** Reduce the minimum width of the silverlight control when in modeling preview mode */
        PowerViewSilverlightControl.setModelingPreviewSize = function () {
            PowerViewSilverlightControl.MinControlWidth = PowerViewSilverlightControl.ModelingPreviewWidth;
        };
        /** Reset the width to full size */
        PowerViewSilverlightControl.resetPowerViewControlSize = function () {
            PowerViewSilverlightControl.MinControlWidth = PowerViewSilverlightControl.ControlFullViewWidth;
        };
        PowerViewSilverlightControl._silverlightHtml = "<object data='data:application/x-silverlight-2,' type='application/x-silverlight-2' class='infonav-powerViewSilverlightControl'>" + "<param name='source' value='{xapUri}/Microsoft.Reporting.AdHoc.Shell.Bootstrapper.xap'/>" + "<param name='onError' value='onSilverlightError' />" + "<param name='onLoad' value='{onLoadCallback}' />" + "<param name='background' value='white' />" + "<param name='windowless' value='true'/>" + "<param name='minRuntimeVersion' value='5.0.61118.0' />" + "<param name='culture' value='en-US' />" + "<param name='uiculture' value='en-US' />" + "<param name='enableHtmlAccess' value='true' />" + "<param name='enableautozoom' value ='false'/ >" + "<param name='InitParams' value='DeferredInitialization=false,ShowInfoNavExplorer={showExplorer},ReportServerUri={reportServerUri},ViewMode=InfoNavSearchVertical,SuppressCloseConfirmation=true,ServerTraceLevel={serverTraceLevel},DefaultFontFamily=Segoe UI,Fit=true,InteractiveReportHandlerRegistrationCallback={interactiveReportHandlerRegistrationCallback}' />" + "<a style='display: block; text-align: center; text-decoration: none;' href='http://go2.microsoft.com/fwlink/?LinkId=116053&v=5.0.61118.0'>" + "<img style='border-style: none;' alt='Microsoft Silverlight' src='{xapUri}/icon-silverlight.png'/>" + "<span style='display: block; margin-top: 20px;'>" + InJs.Strings.silverlightInstallRequiredText + "</span>" + "</a>" + "</object>";
        PowerViewSilverlightControl.InvalidSemanticQueryExceptionName = 'InvalidSemanticQueryException';
        PowerViewSilverlightControl._taskPaneWidth = 325;
        /** Full width in pixels for the PV control */
        PowerViewSilverlightControl.ControlFullViewWidth = 985;
        /** In modeling preview mode, we scale the PV control down to 700 pixels to allow for modeling pane on the right */
        PowerViewSilverlightControl.ModelingPreviewWidth = 700;
        PowerViewSilverlightControl.InteractiveReportHandlerRegistrationCallbackPrefix = 'infonavInteractiveReportHandlerRegistrationCallback_';
        PowerViewSilverlightControl.OnLoadCallbackPrefix = 'infonavInteractiveReportOnLoadCallback_';
        /** MinControlWidth is either ControlFullViewWidth or ModelingPreviewWidth depending on the page context, i.e. main Q&A or Modeling */
        PowerViewSilverlightControl.MinControlWidth = PowerViewSilverlightControl.ControlFullViewWidth;
        PowerViewSilverlightControl.MinControlHeight = 480;
        return PowerViewSilverlightControl;
    })(InJs.PowerViewControl);
    InJs.PowerViewSilverlightControl = PowerViewSilverlightControl;
})(InJs || (InJs = {}));
function onSilverlightError(sender, args) {
    var appSource = '';
    if (sender) {
        appSource = sender.getHost().source;
    }
    var errorType = args.errorType;
    if (errorType === 'ImageError' || errorType === 'MediaError') {
        return;
    }
    var errorCode = args.errorCode;
    if (typeof (HandleSilverlightUpgrade) !== "undefined" && HandleSilverlightUpgrade(errorCode)) {
        return;
    }
    var errorMsg = InJs.StringExtensions.format('Unhandled Error in Silverlight Application {0}\r\nCode: {1}    \r\nCategory: {2}       \r\nMessage: {3}     \r\n', appSource, errorCode, errorType, args.errorMessage);
    if (errorType === 'ParserError') {
        errorMsg += InJs.StringExtensions.format('File: {0}     \r\nLine: {1}     \r\nPosition: {2}     \r\n', args.xamlFile, args.lineNumber, args.charPosition);
    }
    else if (errorType === 'RuntimeError') {
        if (args.lineNumber) {
            errorMsg += InJs.StringExtensions.format('Line: {0}     \r\nPosition: {1}     \r\n', args.lineNumber, args.charPosition);
        }
        errorMsg += InJs.StringExtensions.format('MethodName: {0}     \n', args.methodName);
    }
    throw InJs.Errors.invalidOperation(errorMsg);
}
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var Notifications;
    (function (Notifications) {
        (function (NotificationIcon) {
            NotificationIcon[NotificationIcon["Default"] = 0] = "Default";
            NotificationIcon[NotificationIcon["Loading"] = 1] = "Loading";
            NotificationIcon[NotificationIcon["Alert"] = 2] = "Alert";
            NotificationIcon[NotificationIcon["OfficeFabric"] = 3] = "OfficeFabric";
        })(Notifications.NotificationIcon || (Notifications.NotificationIcon = {}));
        var NotificationIcon = Notifications.NotificationIcon;
        /** Simple implementation of a static notification control that can be shown and closed by the user */
        // TODO - 1918480: Implement stacking or queuing for the NotificationControl in our InfoNav app
        var NotificationControl = (function (_super) {
            __extends(NotificationControl, _super);
            function NotificationControl(notificationControlHost, options) {
                var _this = this;
                _super.call(this, notificationControlHost, options);
                this._notification = null;
                this._notificationTitle = null;
                this._notificationContent = null;
                this._notificationCloseButton = null;
                this._notificationIcon = null;
                this._closedCallback = null;
                this._currentId = null;
                $(document).ready(function () {
                    _this._notification = $(NotificationControl.NotificationControlHtml);
                    _this._notificationTitle = _this._notification.find('.infonav-notificationTitle');
                    _this._notificationContent = _this._notification.find('.infonav-notificationContent');
                    _this._notificationCloseButton = _this._notification.find('.infonav-notificationCloseButton');
                    _this._notificationIcon = _this._notification.find('.infonav-notificationIcon');
                    _this._notificationCloseButton.on(InJs.DOMConstants.mouseClickEventName, function () {
                        _this.hideNotification(_this._currentId);
                        if (_this._closedCallback) {
                            _this._closedCallback();
                        }
                    });
                    _this.element.append(_this._notification);
                    // Create host container and attach to body
                    var containerHost = $(NotificationControl.notificationContainerHostClassSelector);
                    // Remove notification container host if it already exists
                    if (containerHost && containerHost.length > 0)
                        containerHost.remove();
                    containerHost = _this.element.addClass(NotificationControl.notificationContainerHostClassSelector);
                    $(InJs.DOMConstants.DocumentBody).append(containerHost);
                });
            }
            NotificationControl.prototype._onShowNotification = function (eventArgs) {
                this.showNotification(eventArgs.id, eventArgs.title, eventArgs.message, eventArgs.closedCallback, eventArgs.isDismissable, eventArgs.dismissTimeout, eventArgs.iconType, eventArgs.officeIconId);
            };
            NotificationControl.prototype._onHideNotification = function (eventArgs) {
                this.hideNotification(eventArgs.id);
            };
            /**
             * Show a new notification
             * @param title - The title of the notification
             * @param message [string|jQuery] - The message content to show
             * @param closedCallback - A callback to call when the notification is complete
             * @param isDismissable - Whether the message can be dismissed by the user
             * @param iconType - The icon to be displayed with the notification
             * @param officeIconId - Determines the type of icon to display when iconType equals OfficeFabric (requires Fabric CSS v0.5.0 and higher)
             * param dismissTimeout - The amount of time the notification should stay on the screen for
             */
            NotificationControl.prototype.showNotification = function (id, title, message, closedCallback, isDismissable, dismissTimeout, iconType, officeIconId) {
                var _this = this;
                this._notification.removeClass(NotificationControl.TitleOnlyCssClass).removeClass(NotificationControl.MessageOnlyCssClass).removeClass(NotificationControl.DismissableCssClass).removeClass(NotificationControl.ShowIconCssClass);
                this._notificationTitle.empty();
                this._notificationContent.empty();
                this._notificationTitle.text(title);
                this._notificationCloseButton.empty();
                this._notificationIcon.removeClass(NotificationControl.LoadingIconCssClass).removeClass(NotificationControl.AlertIconCssClass).removeClass(NotificationControl.DefaultCssClass).empty();
                this._currentId = id;
                if (jsCommon.StringExtensions.isNullOrUndefinedOrWhiteSpaceString(title)) {
                    this._notification.addClass(NotificationControl.MessageOnlyCssClass);
                }
                if (!message || (typeof message === 'string' && jsCommon.StringExtensions.isNullOrUndefinedOrWhiteSpaceString(message))) {
                    this._notification.addClass(NotificationControl.TitleOnlyCssClass);
                }
                // notifications are dismissable by default
                if (typeof isDismissable === 'undefined' || isDismissable === true) {
                    this._notification.addClass(NotificationControl.DismissableCssClass);
                }
                if (iconType != null) {
                    this._notification.addClass(NotificationControl.ShowIconCssClass);
                    switch (iconType) {
                        case 1 /* Loading */:
                            this._notificationIcon.addClass(NotificationControl.LoadingIconCssClass);
                            break;
                        case 2 /* Alert */:
                            this._notificationIcon.addClass(NotificationControl.AlertIconCssClass);
                            break;
                        case 3 /* OfficeFabric */:
                            if (officeIconId) {
                                var officeIconElem = $('<i/>');
                                officeIconElem.addClass(NotificationControl.OfficeFabricIconPrefixCssClass + officeIconId);
                                this._notificationIcon.append(officeIconElem);
                            }
                            break;
                        default:
                            this._notificationIcon.addClass(NotificationControl.DefaultCssClass);
                            break;
                    }
                }
                if (typeof message === 'string') {
                    this._notificationContent.text(message);
                }
                else if (message instanceof jQuery) {
                    this._notificationContent.append(message);
                }
                this._notification.fadeTo(0, 0);
                this._notification.fadeTo(NotificationControl.AnimationSpeedMs, 1, null);
                this._closedCallback = closedCallback;
                if ((dismissTimeout != null) && dismissTimeout > 0) {
                    window.setTimeout(function () {
                        _this.hideNotification(id);
                    }, dismissTimeout);
                }
            };
            NotificationControl.prototype.hideNotification = function (id) {
                var _this = this;
                // This is in case we show two or more notifications and then call hide to ensure only
                // the last one (that is actually shown) will hide the notification control.
                if (this._currentId == id) {
                    this._notification.fadeTo(NotificationControl.AnimationSpeedMs, 0, function () {
                        // This is to ensure if we hide a notification and immediatelly show another one again
                        // we don't hide the control which would cause the new notification to remain hidden as this 
                        // callback is delayed.
                        if (_this._currentId === id) {
                            _this._notification.css(InJs.CssConstants.displayProperty, InJs.CssConstants.noneValue);
                        }
                    });
                    return true;
                }
                return false;
            };
            Object.defineProperty(NotificationControl, "animationSpeedMs", {
                get: function () {
                    return NotificationControl.AnimationSpeedMs;
                },
                enumerable: true,
                configurable: true
            });
            // Constants
            NotificationControl.AnimationSpeedMs = 250;
            NotificationControl.NotificationControlHtml = '<div class="infonav-notification">' + '<div class="infonav-notificationCloseButton"></div>' + '<div class="infonav-notificationIcon"></div>' + '<div class="infonav-notificationLayout">' + '<div class="infonav-notificationTitle"></div>' + '<div class="infonav-notificationContent"></div>' + '</div>' + '</div>';
            NotificationControl.MessageOnlyCssClass = 'messageOnly';
            NotificationControl.TitleOnlyCssClass = 'titleOnly';
            NotificationControl.DismissableCssClass = 'dismissable';
            NotificationControl.DefaultCssClass = 'default';
            NotificationControl.LoadingIconCssClass = 'loading';
            NotificationControl.AlertIconCssClass = 'alert';
            NotificationControl.ShowIconCssClass = 'showIcon';
            NotificationControl.OfficeFabricIconPrefixCssClass = 'ms-font-color-neutralSecondaryAlt ms-Icon ms-Icon--';
            NotificationControl.notificationContainerHostClassSelector = '.infonav-notificationHost';
            return NotificationControl;
        })(InJs.InfoNavClientControl);
        Notifications.NotificationControl = NotificationControl;
    })(Notifications = InJs.Notifications || (InJs.Notifications = {}));
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
// IMPORTANT: Order matters in this file, think of it as loading a sequence of interdependant js files.
/// <reference path="..\Controls\Notifications\NotificationControl.ts" /> 
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** The Model Selection client side control */
    var ModelSelectionControl = (function (_super) {
        __extends(ModelSelectionControl, _super);
        /**
         * Initializes an instance of the ModelSelectionControl class
         * @param hostElement - The host element for the control
         */
        function ModelSelectionControl(element, options) {
            _super.call(this, element, options);
            this._linguisticSchemaWarningShown = false;
            var formattedHtml = ModelSelectionControl._ModelSelectionControlHtml.replace('{modelSelectionLabel}', InJs.Strings.ModelSelectionControlPulldownDescriptionText);
            this._controlRoot = $(formattedHtml);
            this._dataSourceListContainer = this._controlRoot.find('.infonavSelect');
            this._pinBtn = this._controlRoot.find('.pinBtn');
            this._pinBtn.on(InJs.DOMConstants.mouseClickEventName, this, this.onPinDataSourceBtnClick);
            this._textMeasurementElem = this._controlRoot.find('.textMeasurementElem');
            this._errorElem = this._controlRoot.find('.modelSelectionError');
            this._errorElem.text(InJs.Strings.modelSelectionHasErrors);
            this.hide();
            element.append(this._controlRoot);
        }
        /**
         * Event handler for the interpretation success event
         * @param e - Interpret success event arguments
         */
        ModelSelectionControl.prototype._onInterpretSuccess = function (e) {
            this.applyInterpretResponse(e.response);
        };
        /**
         * Event handler for the interpret result changed event
         * @param e - interpret result changed event arguments
         */
        ModelSelectionControl.prototype._onInterpretResultChanged = function (e) {
            this.applyInterpretResponse(e.response);
        };
        ModelSelectionControl.prototype.applyInterpretResponse = function (response) {
            InJs.Utility.throwIfNullOrUndefined(response, this, 'ApplyInterpretResult', 'response');
            if (!response.isEmpty(false)) {
                this.populateDataSourceList(response);
                this.show();
            }
            // Check if any notifications should be shown
            this.showLinguisticSchemaNotification(response.results);
        };
        /**
         * Populates the data source list with items from the current response
         * @param response - The response from the interpret request
         */
        ModelSelectionControl.prototype.populateDataSourceList = function (response) {
            // we need to create a new select list every time and replace the old one at the end
            // modifying the contents of the current list whilst IE9+ is animating leads to odd visual behavior
            var currentDataSourceList = this._controlRoot.find('select');
            var newDataSourceList = $('<select />');
            var results = response.results;
            var dataSources = new Array();
            var hasErrors = false;
            for (var i = 0; i < results.length; i++) {
                var thisResult = results[i];
                var sourceProperties = this.connectionGroup.getDataSourceProperties(thisResult.databaseName);
                var dataSourceOption = $('<option />');
                dataSourceOption.attr('value', thisResult.databaseName);
                dataSourceOption.attr('datasource-index', i.toString());
                dataSourceOption.text(sourceProperties.name);
                // select the current response
                if (i === response.resultIndex) {
                    dataSourceOption.prop('selected', true);
                    this._currentWorkbookId = thisResult.databaseName;
                    this.updateDatasourceListWidth(sourceProperties.name);
                    //pinned case
                    if (i === response.defaultResultIndex) {
                        this._pinBtn.addClass('pinned');
                    }
                    else {
                        this._pinBtn.removeClass('pinned');
                    }
                }
                // Disable select options that have errors
                if (!InJs.StringExtensions.isNullOrEmpty(thisResult.error)) {
                    dataSourceOption.attr(InJs.DOMConstants.disabledAttributeOrValue, InJs.DOMConstants.disabledAttributeOrValue);
                    dataSourceOption.addClass('disabledOption');
                    hasErrors = true;
                }
                dataSources.push(dataSourceOption);
            }
            hasErrors ? this._errorElem.show() : this._errorElem.hide();
            newDataSourceList.append(dataSources);
            newDataSourceList.on('change', this, this.onDataSourceSelectChange);
            currentDataSourceList.replaceWith(newDataSourceList);
        };
        ModelSelectionControl.prototype.updateDatasourceListWidth = function (text) {
            var _this = this;
            window.setTimeout(function () {
                _this._textMeasurementElem.text(text);
                var newWidth = Math.min(ModelSelectionControl._maxModelDropdownWidthPx, _this._textMeasurementElem.width() + ModelSelectionControl._selectChevronWidthPx);
                _this._dataSourceListContainer.width(newWidth);
            }, 0);
        };
        ModelSelectionControl.prototype.onDataSourceSelectChange = function (e) {
            var self = e.data;
            var dataSourceItem = $(e.currentTarget).find(':selected');
            var dataSourceName = dataSourceItem.attr('value');
            self.updateDatasourceListWidth(dataSourceItem.text());
            var telemetryEventArgs = new InJs.UserChangedModelEventArgs(self._currentWorkbookId, dataSourceName);
            self.connectionGroup.telemetryService.notifyUserChangedModel(12 /* IRCM */, telemetryEventArgs);
            self.connectionGroup.interpretService._setResultSources(dataSourceName, '');
        };
        ModelSelectionControl.prototype.onPinDataSourceBtnClick = function (e) {
            var self = e.data;
            self._pinBtn.toggleClass('pinned');
            // the user is currently pinning a model
            if (self._pinBtn.hasClass('pinned')) {
                var dataSourceName = self._currentWorkbookId;
                self.connectionGroup.interpretService._setResultSources(dataSourceName, dataSourceName);
            }
            else {
                self.connectionGroup.interpretService._setDefaultResultSource(null);
            }
        };
        ModelSelectionControl.prototype.showLinguisticSchemaNotification = function (results) {
            var _this = this;
            // Don't show the notification if the current user isn't admin or we are already 
            // showing the warning or the warning was shown and closed in the last session
            if (!this.connectionGroup.isUserAdmin || this._linguisticSchemaWarningShown || (this.connectionGroup.appCache && this.connectionGroup.appCache.getData().wasLinguisticSchemaWarningShown)) {
                return;
            }
            var modelsWithNoLinguisticSchema = new Array();
            for (var i = 0; i < results.length; i++) {
                if ((results[i].warnings & 1)) {
                    modelsWithNoLinguisticSchema.push(results[i].databaseName);
                }
            }
            if (modelsWithNoLinguisticSchema.length > 0) {
                this._linguisticSchemaWarningShown = true;
                var modelProperties = this.connectionGroup.getDataSourceProperties(modelsWithNoLinguisticSchema[0]);
                var workbookElem;
                if (!InJs.StringExtensions.isNullOrUndefinedOrWhiteSpaceString(modelProperties.url)) {
                    workbookElem = $('<a/>');
                    workbookElem.attr(InJs.DOMConstants.hrefAttribute, modelProperties.url);
                    workbookElem.attr(InJs.DOMConstants.targetAttribute, InJs.DOMConstants.blankValue);
                }
                else {
                    workbookElem = $('<span/>');
                }
                workbookElem.text(modelProperties.name);
                var workbookLinkTemplate = modelsWithNoLinguisticSchema.length > 1 ? InJs.Strings.linguisticSchemaMultipleWorkbookWarningTemplate : InJs.Strings.linguisticSchemaSingleWorkbookWarningTemplate;
                var workbookLinkHtml = workbookLinkTemplate.replace(ModelSelectionControl._linguisticSchemaWarningWorkbookLinkPlaceholder, InJs.Utility.getOuterHtml(workbookElem));
                this.connectionGroup.bridge.showNotification(ModelSelectionControl.LinguisticSchemaWarningId, InJs.Strings.linguisticSchemaWarningTitle, $(ModelSelectionControl._linguisticSchemaWarningHtml.replace('{WarningContent}', workbookLinkHtml).replace('{WarningInfoLinkText}', InJs.Strings.linguisticSchemaWarningMoreInfoLink)), function () {
                    // Update the cache data
                    if (_this.connectionGroup.appCache) {
                        var data = _this.connectionGroup.appCache.getData();
                        data.wasLinguisticSchemaWarningShown = true;
                        _this.connectionGroup.appCache.updateData(data);
                    }
                });
            }
        };
        /** HTML layout for the refinement control */
        ModelSelectionControl._ModelSelectionControlHtml = "<div class='in_ModelSelectionControl'>" + "<div class='modelSelectionLabel'>{modelSelectionLabel}</div>" + "<div class='infonavSelect'>" + "<select></select>" + "</div>" + "<div class='pinBtn'></div>" + "<div class='textMeasurementElem'></div>" + "<div class='modelSelectionError'></div>" + "</div>";
        ModelSelectionControl._linguisticSchemaWarningWorkbookLinkPlaceholder = '{WorkbookLink}';
        ModelSelectionControl._linguisticSchemaWarningHtml = "<div>{WarningContent}</div>" + "<div><a href='http://go.microsoft.com/fwlink/?LinkID=287123' target='_blank'>{WarningInfoLinkText}</a></div>";
        ModelSelectionControl._selectChevronWidthPx = 20;
        ModelSelectionControl._maxModelDropdownWidthPx = 266;
        ModelSelectionControl.LinguisticSchemaWarningId = '88b0854b-f266-4e02-8584-3bfbab22aa48';
        return ModelSelectionControl;
    })(InJs.InfoNavConnectedClientControl);
    InJs.ModelSelectionControl = ModelSelectionControl;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    (function (CollageItemColor) {
        CollageItemColor[CollageItemColor["LightBlue"] = 0] = "LightBlue";
        CollageItemColor[CollageItemColor["Blue"] = 1] = "Blue";
        CollageItemColor[CollageItemColor["Green"] = 2] = "Green";
        CollageItemColor[CollageItemColor["Orange"] = 3] = "Orange";
        CollageItemColor[CollageItemColor["Red"] = 4] = "Red";
        CollageItemColor[CollageItemColor["Gray"] = 5] = "Gray";
    })(InJs.CollageItemColor || (InJs.CollageItemColor = {}));
    var CollageItemColor = InJs.CollageItemColor;
    var CollageItemView = (function () {
        function CollageItemView(data) {
            var _this = this;
            this._position = { x: -1, y: -1 };
            this._offset = { left: 0, top: 0 };
            this._defaultIcon = 1 /* General */;
            this._color = 1 /* Blue */;
            this._itemJson = null;
            this._isDisposed = false;
            this._layout = null;
            this._predefinedIconElem = null;
            this._userDefinedIconElem = null;
            this._textElem = null;
            // cache layout elements
            this._layout = $(CollageItemView.CollageItemHtml);
            this._predefinedIconElem = this._layout.find('.collageItemIcon.predefined');
            this._userDefinedIconElem = this._layout.find('.collageItemIcon.userDefined');
            this._textElem = this._layout.find(CollageItemView.CollageItemTextSelector);
            // populate the item
            this.source = data;
            // attach click handler for item click
            this._layout.on(InJs.DOMConstants.mouseClickEventName, function (e) {
                $(_this).trigger(CollageItemView.CollageItemClickedEventName, _this);
            });
            // attach click handler for update item action click
            this._layout.find('.editItemBtn').on(InJs.DOMConstants.mouseClickEventName, function (e) {
                e.stopPropagation();
                $(_this).trigger(CollageItemView.CollageItemUpdateActionClickedEventName, _this);
            });
            // attach click handler for delete item action click
            this._layout.find('.deleteItemBtn').on(InJs.DOMConstants.mouseClickEventName, function (e) {
                e.stopPropagation();
                $(_this).trigger(CollageItemView.CollageItemDeleteActionClickedEventName, _this);
            });
        }
        /** disposes of the item */
        CollageItemView.prototype.dispose = function () {
            var _this = this;
            this.isVisible = false;
            this._isDisposed = true;
            window.setTimeout(function () {
                _this._layout.remove();
                _this._itemJson = null;
            }, CollageItemView.Css3TransitionSpeedMs);
        };
        Object.defineProperty(CollageItemView.prototype, "source", {
            /** gets the item json source */
            get: function () {
                return this._itemJson;
            },
            /** sets the item json source */
            set: function (value) {
                this._itemJson = value;
                this.populateLayout();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollageItemView.prototype, "layout", {
            /** returns the layout element for the collage item */
            get: function () {
                return this._layout;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollageItemView.prototype, "position", {
            /** returns the position of the item */
            get: function () {
                if (this._position.x >= 0 && this._position.y >= 0) {
                    return this._position;
                }
                return null;
            },
            /** sets the position of the item */
            set: function (value) {
                // update the item data
                this._itemJson.PositionX = value.x;
                this._itemJson.PositionY = value.y;
                this._position = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollageItemView.prototype, "offset", {
            /** gets the visual offset for the item (in pixels) */
            get: function () {
                return this._offset;
            },
            /** sets the visual offset for the item (in pixels) */
            set: function (value) {
                // update the visual offset
                this._layout.css(InJs.CssConstants.leftProperty, value.left);
                this._layout.css(InJs.CssConstants.topProperty, value.top);
                this._offset = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollageItemView.prototype, "width", {
            /* the pixel width of the item */
            get: function () {
                return CollageItemView.TileWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollageItemView.prototype, "height", {
            /* the pixel height of the item */
            get: function () {
                if (this._itemJson.TileSize === 1 /* Big */) {
                    return CollageItemView.TileBigHeight;
                }
                return CollageItemView.TileSmallHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollageItemView.prototype, "isVisible", {
            /** returns whether the item is visible */
            get: function () {
                return this._layout.hasClass(CollageItemView.CollageItemVisibleClass);
            },
            /** sets the visibility of the item */
            set: function (value) {
                if (value === true) {
                    this._layout.addClass(CollageItemView.CollageItemVisibleClass);
                }
                else {
                    this._layout.removeClass(CollageItemView.CollageItemVisibleClass);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollageItemView.prototype, "backgroundImageUrl", {
            /** gets the current background image url */
            get: function () {
                // currently, this property is gated on whether there is a custom url declared in JSON
                // this could be improved by splitting out the element rendering default and custom backgrounds
                if (this._itemJson.ImageUrl && this._itemJson.ImageUrl.length > 0) {
                    return InJs.Utility.extractUrlFromCssBackgroundImage(this._userDefinedIconElem.css(InJs.CssConstants.backgroundImageProperty));
                }
                return null;
            },
            /** sets the background image of the item to a user provided url */
            set: function (value) {
                var _this = this;
                if (!InJs.StringExtensions.isNullOrEmpty(value)) {
                    var userImage = new Image();
                    // attempt to retrieve the specified image
                    userImage.onerror = function (ev) {
                        if (!_this._isDisposed) {
                            // On error to load the user provided image, default back to a predefined general image on error.
                            _this._userDefinedIconElem.hide();
                            // trigger the image load error event
                            $(_this).trigger(CollageItemView.CollageItemBackgroundImgLoadErrorEventName, _this);
                            _this._itemJson.ImageUrl = '';
                        }
                    };
                    userImage.onload = function (ev) {
                        if (!_this._isDisposed) {
                            _this._userDefinedIconElem.css(InJs.CssConstants.backgroundImageProperty, "url('" + userImage.src + "')");
                            _this._userDefinedIconElem.css(InJs.CssConstants.backgroundSizeProperty, InJs.CssConstants.coverValue);
                            _this._userDefinedIconElem.show();
                            _this._itemJson.ImageUrl = value;
                            // trigger the image loaded event
                            $(_this).trigger(CollageItemView.CollageItemBackgroundImgLoadedEventName, _this);
                        }
                    };
                    userImage.src = value;
                }
                else {
                    this._userDefinedIconElem.hide();
                    this._itemJson.ImageUrl = '';
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollageItemView.prototype, "text", {
            /** gets the text for the item */
            get: function () {
                return this._textElem.text();
            },
            /** sets the text for the item */
            set: function (value) {
                if (typeof value === "string") {
                    this._textElem.text(value);
                    this._itemJson.Utterance = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollageItemView.prototype, "defaultIcon", {
            /** gets the default icon image for the item */
            get: function () {
                return this._defaultIcon;
            },
            /** sets the default icon image for the item */
            set: function (value) {
                this._predefinedIconElem.attr('class', 'collageItemIcon predefined');
                this._predefinedIconElem.addClass(CollageItemView.getCssClassForCollageImage(value));
                this._defaultIcon = this._itemJson.DefaultImageIndex = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollageItemView.prototype, "size", {
            /** gets the size of the item */
            get: function () {
                return this._layout.hasClass(CollageItemView.CollageItemSmallClass) ? 0 /* Small */ : 1 /* Big */;
            },
            /** sets the size of the item */
            set: function (value) {
                if (value === 0 /* Small */) {
                    this._layout.addClass(CollageItemView.CollageItemSmallClass);
                }
                else {
                    this._layout.removeClass(CollageItemView.CollageItemSmallClass);
                }
                this._itemJson.TileSize = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollageItemView.prototype, "color", {
            /** gets the color of the item */
            get: function () {
                return this._color;
            },
            /** sets the color of the item */
            set: function (value) {
                var hexColor = CollageItemView.getHexColorFromCollageColorIndex(value);
                this._layout.css(InJs.CssConstants.backgroundColorProperty, hexColor);
                this._userDefinedIconElem.css(InJs.CssConstants.backgroundColorProperty, hexColor);
                this._predefinedIconElem.css(InJs.CssConstants.backgroundColorProperty, hexColor);
                this._color = value;
                this._itemJson.ThemeColorIndex = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollageItemView.prototype, "id", {
            /** gets the id of the item */
            get: function () {
                return this._itemJson.ItemId;
            },
            enumerable: true,
            configurable: true
        });
        /** Subscribes to the item clicked event */
        CollageItemView.prototype.add_onClickHandler = function (handler, data) {
            $(this).on(CollageItemView.CollageItemClickedEventName, data, handler);
        };
        /** Subscribes to the item deleted event */
        CollageItemView.prototype.add_onUpdateActionClickHandler = function (handler, data) {
            $(this).on(CollageItemView.CollageItemUpdateActionClickedEventName, data, handler);
        };
        /** Subscribes to the item deleted event */
        CollageItemView.prototype.add_onDeleteActionClickHandler = function (handler, data) {
            $(this).on(CollageItemView.CollageItemDeleteActionClickedEventName, data, handler);
        };
        /** Subscribes to the background image load error event */
        CollageItemView.prototype.add_onBackgroundImageLoadError = function (handler, data) {
            $(this).on(CollageItemView.CollageItemBackgroundImgLoadErrorEventName, data, handler);
        };
        /** Subscribes to the background image loaded event */
        CollageItemView.prototype.add_onBackgroundImageLoaded = function (handler, data) {
            $(this).on(CollageItemView.CollageItemBackgroundImgLoadedEventName, data, handler);
        };
        Object.defineProperty(CollageItemView.prototype, "isAddTile", {
            /** gets whether the item is the special add tile */
            get: function () {
                return this._defaultIcon === 9 /* Add */;
            },
            enumerable: true,
            configurable: true
        });
        /** Initializes or refreshes the item layout */
        CollageItemView.prototype.populateLayout = function () {
            var itemData = this._itemJson;
            var isSmall = itemData.TileSize === 0 /* Small */;
            var isAddTile = itemData.DefaultImageIndex === 9 /* Add */;
            this.position = { x: 0 || itemData.PositionX, y: 0 || itemData.PositionY };
            // Special handling for add tile
            if (isAddTile) {
                this.defaultIcon = 9 /* Add */;
                this.size = 0 /* Small */;
                this._layout.addClass(CollageItemView.AddCollageCssClassName);
                this._textElem.remove();
                return;
            }
            this.size = itemData.TileSize;
            // Set the tile color for the item
            this.color = itemData.ThemeColorIndex;
            this.backgroundImageUrl = itemData.ImageUrl;
            this.defaultIcon = itemData.DefaultImageIndex;
            // Finally, set the display text for the current item
            this.text = itemData.Utterance;
        };
        /** this method returns an collage image type from a css class */
        CollageItemView.getCollageImageFromCssClass = function (cssClass) {
            var matches = CollageItemView.CollageDefaultImageCssMappings.filter(function (value, index, array) {
                return value.cssClass === cssClass;
            });
            if (matches.length === 1) {
                return matches[0].imageType;
            }
            if (matches.length === 0) {
                return 5 /* GeneralChart */;
            }
            return null;
        };
        /** this method returns an collage image type from a css class */
        CollageItemView.getCssClassForCollageImage = function (imageType) {
            var matches = CollageItemView.CollageDefaultImageCssMappings.filter(function (value, index, array) {
                return value.imageType === imageType;
            });
            if (matches.length === 1) {
                return matches[0].cssClass;
            }
            if (matches.length === 0) {
                return CollageItemView.GeneralChartCollageCssClassName;
            }
            return null;
        };
        /** this method returns a hex color string from a collage color value */
        CollageItemView.getHexColorFromCollageColorIndex = function (color) {
            return CollageItemView.CollageColorMap[color];
        };
        CollageItemView.CollageItemHtml = "<div class='collageItem' >" + "<div class='collageItemLayout' > " + "<div class= 'collageItemIcon predefined'/>" + "<div class= 'collageItemIcon userDefined'/>" + "<div class='actionsContainer'>" + "<div class='actionBtn editItemBtn'></div>" + "<div class='actionBtn deleteItemBtn'></div>" + "</div>" + "<div class='collageItemTitleContainer'>" + "<span class='collageItemText'></span>" + "</div>" + "</div>" + "</div>";
        // selectors
        CollageItemView.CollageItemTextSelector = '.collageItemText';
        CollageItemView.CollageItemSelector = '.collageItem';
        CollageItemView.CollageItemVisibleClass = 'visible';
        // Predefined dimensions for item tiles
        CollageItemView.TileWidth = 250;
        CollageItemView.TileSmallHeight = 120;
        CollageItemView.TileBigHeight = 250;
        // This should be kept in sync with the css-transition declared time in InfoNav.css
        CollageItemView.Css3TransitionSpeedMs = 250;
        // CSS Classes
        CollageItemView.CollageItemSmallClass = 'small';
        CollageItemView.GeneralCollageCssClassName = 'general';
        CollageItemView.FavoriteCollageCssClassName = 'favorite';
        CollageItemView.MoneyCollageCssClassName = 'money';
        CollageItemView.ColumnChartCollageCssClassName = 'columnChart';
        CollageItemView.LineChartCollageCssClassName = 'lineChart';
        CollageItemView.GeneralChartCollageCssClassName = 'generalChart';
        CollageItemView.PieChartCollageCssClassName = 'pieChart';
        CollageItemView.NumberCollageCssClassName = 'number';
        CollageItemView.NoneCollageCssClassName = 'none';
        CollageItemView.AddCollageCssClassName = 'add';
        CollageItemView.PredefinedIconCssClassName = 'predefined';
        CollageItemView.CollageDefaultImageCssMappings = [
            { imageType: 1 /* General */, cssClass: CollageItemView.GeneralCollageCssClassName },
            { imageType: 8 /* Favorite */, cssClass: CollageItemView.FavoriteCollageCssClassName },
            { imageType: 2 /* Money */, cssClass: CollageItemView.MoneyCollageCssClassName },
            { imageType: 3 /* ColumnChart */, cssClass: CollageItemView.ColumnChartCollageCssClassName },
            { imageType: 4 /* LineChart */, cssClass: CollageItemView.LineChartCollageCssClassName },
            { imageType: 5 /* GeneralChart */, cssClass: CollageItemView.GeneralChartCollageCssClassName },
            { imageType: 6 /* PieChart */, cssClass: CollageItemView.PieChartCollageCssClassName },
            { imageType: 7 /* Number */, cssClass: CollageItemView.NumberCollageCssClassName },
            { imageType: 0 /* None */, cssClass: CollageItemView.NoneCollageCssClassName },
            { imageType: 9 /* Add */, cssClass: CollageItemView.AddCollageCssClassName }
        ];
        CollageItemView.CollageColorMap = [
            '#2C95FF',
            '#0072C6',
            '#67999A',
            '#FF9934',
            '#930B39',
            '#999999'
        ];
        CollageItemView.CollageItemClickedEventName = 'itemClicked';
        CollageItemView.CollageItemDeleteActionClickedEventName = 'itemDeleted';
        CollageItemView.CollageItemUpdateActionClickedEventName = 'itemUpdated';
        CollageItemView.CollageItemBackgroundImgLoadErrorEventName = 'backgroundImageLoadError';
        CollageItemView.CollageItemBackgroundImgLoadedEventName = 'backgroundImageLoaded';
        return CollageItemView;
    })();
    InJs.CollageItemView = CollageItemView;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** Provides a data representation for the Collage Control */
    var CollageControlModel = (function () {
        function CollageControlModel() {
            this._itemsSource = new Array();
            this._items = new Array();
        }
        Object.defineProperty(CollageControlModel.prototype, "items", {
            /** gets the current set of items in the model */
            get: function () {
                return this._items;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollageControlModel.prototype, "itemsSource", {
            /** gets the raw data for the current set of items */
            get: function () {
                return this._itemsSource;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Updates the current set of items in the model
         * @param itemsJson - The raw json items from app metadata
         * @returns - Whether the model was updated using the provided data
         */
        CollageControlModel.prototype.update = function (itemsJson) {
            var _this = this;
            var shouldUpdate = JSON.stringify(this._itemsSource) !== JSON.stringify(itemsJson) || itemsJson.length === 0;
            if (!shouldUpdate) {
                return false;
            }
            // remove duplicates items in incoming data, ensuring uniqueness by id
            itemsJson = itemsJson.filter(function (newItem, newItemIndex, newItemArray) {
                var isUnique = itemsJson.filter(function (possibleDupeItem, possibleDupeItemIndex, possibleDupeItemArray) {
                    return possibleDupeItem.ItemId === newItem.ItemId;
                }).length === 1;
                if (!isUnique) {
                    InJs.Tracing.warning('Dulicate item (id: ' + newItem.ItemId + ') found while rendering Collage');
                }
                return isUnique;
            });
            // clean up deleted items
            this._items = this._items.filter(function (existingItem, existingItemIndex, existingItemArray) {
                var itemWasDeleted = !itemsJson.some(function (newItem, newItemIndex, newItemArray) {
                    return existingItem.id === newItem.ItemId;
                });
                // remove the item from the collage
                if (itemWasDeleted) {
                    existingItem.dispose();
                }
                return !itemWasDeleted;
            });
            // handle updates and additions
            itemsJson.forEach(function (newItem, newItemIndex, newItemArray) {
                var outOfDateItem = null;
                var itemAlreadyExists = _this._items.some(function (existingItem, existingItemIndex, existingItemArray) {
                    var retValue = existingItem.id === newItem.ItemId;
                    if (retValue) {
                        outOfDateItem = existingItem;
                    }
                    return retValue;
                });
                // if we don't have the item, it is new and should be added
                if (!itemAlreadyExists) {
                    _this._items.push(new InJs.CollageItemView(newItem));
                }
                else {
                    outOfDateItem.source = newItem;
                }
            });
            this._itemsSource = itemsJson;
            return true;
        };
        return CollageControlModel;
    })();
    InJs.CollageControlModel = CollageControlModel;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /*
     * The Collage Control View
     */
    var CollageControlView = (function () {
        function CollageControlView(hostElement, connectionGroup) {
            this._controlRoot = null;
            this._controlVisibilityTimeoutId = -1;
            this._items = new Array();
            this._itemColumns = new Array();
            this._displayColumns = new Array();
            this._addTile = null;
            InJs.Utility.throwIfNullOrUndefined(connectionGroup, this, 'ctor', 'connectionGroup');
            this._controlRoot = $(CollageControlView.CollageControlHtml);
            $(hostElement).append(this._controlRoot);
            this._addTile = new InJs.CollageItemView(CollageControlView.AddTileJson);
            this._connectionGroup = connectionGroup;
        }
        Object.defineProperty(CollageControlView.prototype, "items", {
            /** gets the current set of items in the view */
            get: function () {
                return this._items;
            },
            /** sets the current set of items in the view */
            set: function (value) {
                this._items = value;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollageControlView.prototype, "itemColumns", {
            /** gets the collection of items arranged (and sorted) in columns */
            get: function () {
                return this._itemColumns;
            },
            enumerable: true,
            configurable: true
        });
        /** shows all items */
        CollageControlView.prototype.showCollageItems = function () {
            this.setCollageItemVisibility(true);
        };
        /** hides all items */
        CollageControlView.prototype.hideCollageItems = function () {
            var deferred = $.Deferred();
            this.setCollageItemVisibility(false).done(function () { return deferred.resolve(); });
            return deferred.promise();
        };
        /** returns the next available position in the view */
        CollageControlView.prototype.getNextInsertPosition = function () {
            var nextPositionX = 0;
            var nextPositionY = 0;
            var unallocatedColumns = new Array();
            this._itemColumns.forEach(function (column, index, columns) {
                if (InJs.ArrayExtensions.isUndefinedOrEmpty(column)) {
                    unallocatedColumns.push(index);
                }
            });
            if (unallocatedColumns.length > 0) {
                nextPositionX = unallocatedColumns[0];
            }
            else {
                // figure out which column is the shortest
                var columnDepths = this.getColumnDepthsInPixels();
                var targetColumnIndex = InJs.Utility.getIndexOfMinValue(columnDepths);
                var targetColumn = this._itemColumns[targetColumnIndex];
                if (targetColumn) {
                    nextPositionY = targetColumn.length;
                    nextPositionX = targetColumnIndex;
                }
            }
            return { x: nextPositionX, y: nextPositionY };
        };
        /**
          * Reconciles server item position information to match that of the currently displayed client view
          * @returns - Whether an update to the item set was necessary
          */
        CollageControlView.prototype.reconcileItemCoordinates = function () {
            var shouldReconcileCoordinates = this._displayColumns.some(function (displayColumn, displayColumnIndex, displayColumnSet) {
                return displayColumn.some(function (displayItem, displayItemIndex, displayItemSet) {
                    return !displayItem.isAddTile && displayItem.position.x !== displayColumnIndex;
                });
            });
            if (!shouldReconcileCoordinates) {
                return false;
            }
            for (var x = 0; x < this._displayColumns.length; x++) {
                var itemColumn = this._displayColumns[x];
                for (var y = 0; y < itemColumn.length; y++) {
                    var thisItem = itemColumn[y];
                    if (!thisItem.isAddTile) {
                        thisItem.position = { x: x, y: y };
                    }
                }
            }
            this.update();
            return true;
        };
        CollageControlView.prototype.add_collageItemClickHandler = function (handler, data) {
            $(this).on(CollageControlView.CollageItemClickedEventName, data, handler);
        };
        CollageControlView.prototype.add_collageItemUpdateActionClickHandler = function (handler, data) {
            $(this).on(CollageControlView.CollageItemUpdateActionClickedEventName, data, handler);
        };
        CollageControlView.prototype.add_collageItemDeleteActionClickHandler = function (handler, data) {
            $(this).on(CollageControlView.CollageItemDeleteActionClickedEventName, data, handler);
        };
        CollageControlView.prototype.add_addTileClickHandler = function (handler, data) {
            $(this).on(CollageControlView.AddTileClickedEventName, data, handler);
        };
        /** updates the view after a new set of items has been pushed */
        CollageControlView.prototype.update = function () {
            this.populateItemColumns();
            this.renderCollageItems();
            if (!this._connectionGroup.isSamplesOnlyModeEnabled && this.isUserAdmin()) {
                this._controlRoot.attr(CollageControlView.IsUserAdminAttribute, "true");
            }
            else {
                this._controlRoot.removeAttr(CollageControlView.IsUserAdminAttribute);
            }
        };
        /** populates items into columns for rendering */
        CollageControlView.prototype.populateItemColumns = function () {
            // fill the array with undefined columns, to avoid having a sparse array
            this._itemColumns = Array.apply(null, Array(3));
            for (var i = 0; i < this._items.length; i++) {
                var currentItem = this._items[i];
                // determine which column to insert the item into - if none was specified, use the next insert point
                var targetPosition = currentItem.position || this.getNextInsertPosition();
                // allocate the column, if it doesn't already exist
                if (!this._itemColumns[targetPosition.x]) {
                    this._itemColumns[targetPosition.x] = new Array();
                }
                currentItem.position = targetPosition;
                this._itemColumns[targetPosition.x].push(currentItem);
            }
            for (var i = 0; i < CollageControlView.MaxNumberOfColumns; i++) {
                if (this._itemColumns[i]) {
                    this._itemColumns[i].sort(function (a, b) {
                        return InJs.Utility.compareInt(a.position.y, b.position.y);
                    });
                }
            }
            // compress the display column set to contain only non-empty columns
            this._displayColumns = this._itemColumns.filter(function (column, columnIndex, columnSet) {
                return column && column.length > 0;
            });
            // push in the add tile in its own column (+1 the maximum number of tile columns)
            if (!this._connectionGroup.isSamplesOnlyModeEnabled && this.isUserAdmin()) {
                var addTileTargetColumn = Math.min(this._displayColumns.length, CollageControlView.MaxNumberOfColumns);
                if (!this._displayColumns[addTileTargetColumn]) {
                    this._displayColumns[addTileTargetColumn] = new Array();
                }
                this._displayColumns[addTileTargetColumn].push(this._addTile);
            }
        };
        CollageControlView.prototype.isUserAdmin = function () {
            return (this._connectionGroup.userPermissions & 2 /* UserEditor */) === 2 /* UserEditor */;
        };
        /** Appends the collection of collage items to the control while updating the position of individual items */
        CollageControlView.prototype.renderCollageItems = function () {
            for (var x = 0; x < this._displayColumns.length; x++) {
                var itemColumn = this._displayColumns[x];
                var columnDepth = 0;
                for (var y = 0; y < itemColumn.length; y++) {
                    var thisItem = itemColumn[y];
                    // if the item has not yet been added to the layout, do so
                    if (this._controlRoot.find(thisItem.layout).length === 0) {
                        this._controlRoot.append(thisItem.layout);
                        // bind to events
                        thisItem.add_onClickHandler(this.collageItem_Clicked, this);
                        thisItem.add_onDeleteActionClickHandler(this.collageItem_DeleteActionClicked, this);
                        thisItem.add_onUpdateActionClickHandler(this.collageItem_UpdateActionClicked, this);
                    }
                    var left = x * (InJs.CollageItemView.TileWidth + CollageControlView.TileSeparation);
                    var top = columnDepth;
                    thisItem.offset = { top: top, left: left };
                    columnDepth += thisItem.height + CollageControlView.TileSeparation;
                }
            }
            // update the control height
            var maxDepth = this.getColumnDepthsInPixels().sort(InJs.Utility.compareInt).reverse()[0];
            this._controlRoot.height(maxDepth);
        };
        /** gets the pixel depths of columns in the view */
        CollageControlView.prototype.getColumnDepthsInPixels = function () {
            return this._itemColumns.map(function (column, index, source) {
                var columnDepth = 0;
                if (column) {
                    column.forEach(function (item, itemIndex, itemArray) {
                        if (!item.isAddTile) {
                            columnDepth += item.height + CollageControlView.TileSeparation;
                        }
                    });
                }
                return columnDepth;
            });
        };
        /** Handler for collage item click events */
        CollageControlView.prototype.collageItem_Clicked = function (e, item) {
            var self = e.data;
            if (item.isAddTile === true) {
                $(self).trigger(CollageControlView.AddTileClickedEventName);
            }
            else {
                self._connectionGroup.telemetryService.notifyUserSelectedFeaturedQuestion(0 /* ICSF */);
            }
            $(self).trigger(CollageControlView.CollageItemClickedEventName, item.text);
        };
        /** Handler for collage item update click events */
        CollageControlView.prototype.collageItem_UpdateActionClicked = function (e, item) {
            var self = e.data;
            $(self).trigger(CollageControlView.CollageItemUpdateActionClickedEventName, item.source);
        };
        /** Handler for collage item delete click events */
        CollageControlView.prototype.collageItem_DeleteActionClicked = function (e, item) {
            var self = e.data;
            $(self).trigger(CollageControlView.CollageItemDeleteActionClickedEventName, item.source);
        };
        /** Set the visibility of all items in the collage */
        CollageControlView.prototype.setCollageItemVisibility = function (makeItemsVisible) {
            var _this = this;
            var deferred = $.Deferred();
            var currentMaxDelayMs = 0;
            for (var i = 0; i < this._items.length; i++) {
                var collageItem = this._items[i];
                var delayMs = Math.floor(Math.random() * CollageControlView.CollageItemAnimationDelayBaseMaximum) * CollageControlView.CollageItemAnimationDelayMultiplier;
                currentMaxDelayMs = Math.max(delayMs, currentMaxDelayMs);
                this.setCollageItemVisibilityDelayed(collageItem, makeItemsVisible, delayMs);
            }
            window.setTimeout(function () {
                _this.setCollageItemVisibilityDelayed(_this._addTile, true, 500);
                deferred.resolve();
            }, currentMaxDelayMs);
            return deferred.promise();
        };
        CollageControlView.prototype.setCollageItemVisibilityDelayed = function (item, isVisible, delayMs) {
            setTimeout(function () {
                item.isVisible = isVisible;
            }, delayMs);
        };
        CollageControlView.AddTileJson = {
            ItemId: "layoutGeneratedAddTile",
            Utterance: "",
            DisplayText: "",
            ImageUrl: "",
            TileSize: 0 /* Small */,
            ThemeColorIndex: 1,
            DefaultImageIndex: 9 /* Add */,
            PositionX: 3,
            PositionY: 1000
        };
        // Templates
        CollageControlView.CollageControlHtml = "<div class='in_collageControl'></div>";
        // Constants
        CollageControlView.CollageLayoutHostSelector = '#collageLayoutHost';
        CollageControlView.CollageControlSelector = '.in_collageControl';
        CollageControlView.IsUserAdminAttribute = 'data-admin';
        // Events
        CollageControlView.CollageItemClickedEventName = 'collageItemClicked';
        CollageControlView.CollageItemUpdateActionClickedEventName = 'collageItemUpdateClicked';
        CollageControlView.CollageItemDeleteActionClickedEventName = 'collageItemDeleteClicked';
        CollageControlView.AddTileClickedEventName = 'addTileClicked';
        // The number of item columns which the control can display
        CollageControlView.MaxNumberOfColumns = 3;
        // Constants used in rendering calculations.
        CollageControlView.TileSeparation = 10;
        CollageControlView.CollageItemAnimationDelayMultiplier = 100;
        CollageControlView.CollageItemAnimationDelayBaseMaximum = 5;
        /** The duration (in ms) for the fade in animation */
        CollageControlView.FadeOutAnimationDuration = 250;
        return CollageControlView;
    })();
    InJs.CollageControlView = CollageControlView;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** The Collage Control used to display CollageItemViews */
    var CollageControl = (function (_super) {
        __extends(CollageControl, _super);
        function CollageControl(element, options) {
            var _this = this;
            _super.call(this, element, options);
            // keep track of the user permission state between payloads
            this._userPermissions = 0 /* None */;
            this._view = new InJs.CollageControlView(element.get(0), this.connectionGroup);
            this._model = new InJs.CollageControlModel;
            // set default timer values
            this._showCollageOnEmptyStateTimerId = 0;
            // Handle collage item click events
            this._view.add_collageItemClickHandler(this.onCollageItemClicked, this);
            this._view.add_collageItemDeleteActionClickHandler(this.onCollageItemDeleteActionClicked, this);
            this._view.add_collageItemUpdateActionClickHandler(this.onCollageItemUpdateActionClicked, this);
            this._view.add_addTileClickHandler(this.onAddTileClicked, this);
            this._layoutHost = $('#collageLayoutHost');
            var showCollageNavButton = $('#showFeaturedQuestions.in_navigationBtn');
            if (showCollageNavButton.length > 0) {
                showCollageNavButton.on(InJs.DOMConstants.mouseClickEventName, function () {
                    _this.connectionGroup.telemetryService.notifyUserDisplayedFeaturedQuestions(5 /* ILDF */);
                    _this.connectionGroup.bridge.showCollage();
                });
                showCollageNavButton.attr(InJs.DOMConstants.titleAttribute, InJs.Strings.showFeaturedQuestionsLinkText);
            }
            this.update(this.connectionGroup.featuredQuestions);
        }
        CollageControl.prototype._onFeaturedQuestionsUpdated = function () {
            this.updateFromServer();
        };
        Object.defineProperty(CollageControl.prototype, "model", {
            /** The data model for the control */
            get: function () {
                return this._model;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollageControl.prototype, "view", {
            /** The view for the control */
            get: function () {
                return this._view;
            },
            enumerable: true,
            configurable: true
        });
        CollageControl.prototype._onConnectionGroupReady = function () {
            this.update(this.connectionGroup.featuredQuestions);
        };
        /** Hide the collage when interpret is issued. */
        CollageControl.prototype._onInterpretIssued = function (e) {
            window.clearTimeout(this._showCollageOnEmptyStateTimerId);
            // clear out the timer to the default value
            this._showCollageOnEmptyStateTimerId = 0;
            this.connectionGroup.bridge.hideCollage();
        };
        /** Handles the collage visibility changed event */
        CollageControl.prototype._onCollageVisibilityChanged = function (collageShown) {
            var _this = this;
            if (collageShown) {
                this._layoutHost.show();
                this._view.showCollageItems();
                // NOTE: Have to be careful about clearing the response, as this code could cause the beginning of the user's
                //       utterance to dissapear if this auto-fires before an interpret request is sent.
                if (this._currentInterpretResponse) {
                    InJs.Tracing.verbose('Clearing current interpret result due to the Collage being shown');
                    this.connectionGroup.bridge.clearInterpretResult(true, true);
                }
            }
            else {
                this._view.hideCollageItems().done(function () {
                    _this._layoutHost.hide();
                });
            }
        };
        /**
         * Event handler for the interpret result cleared event
         * @param e - interpret result cleared event arguments
         */
        CollageControl.prototype._onInterpretResultCleared = function (e) {
            var _this = this;
            // make sure the control is not currently displayed, and that we don't already have an active timer
            // in addition to this, only activate the time whenever the user requested to clear the utterance
            if (this.isVisible === false && e.clearUtterance === true && this._showCollageOnEmptyStateTimerId === 0) {
                this._showCollageOnEmptyStateTimerId = window.setTimeout(function () {
                    _this.connectionGroup.bridge.showCollage();
                }, CollageControl.ShowCollageOnEmptyStateTimeoutMs);
            }
        };
        /** Refreshes the currently rendered set of collage items and shows the collage */
        CollageControl.prototype.update = function (items) {
            var newItems = items || [];
            // only update if the new item payload differs from the currently displayed one, or if the user admin state changed
            if (!this._model.update(newItems) && this.connectionGroup.userPermissions === this._userPermissions) {
                return;
            }
            this._userPermissions = this.connectionGroup.userPermissions;
            // renders the current set of collage items
            this._view.items = this._model.items;
            // Show the collage if there is no initial utterance set
            if (this.isVisible && !this.connectionGroup.interpretService.isInitialInterpretPending) {
                this.connectionGroup.bridge.showCollage();
            }
        };
        CollageControl.prototype.onCollageItemClicked = function (e, utterance) {
            var self = e.data;
            self.connectionGroup.bridge.changeUserUtterance(utterance);
        };
        CollageControl.prototype.onCollageItemUpdateActionClicked = function (e, item) {
            var self = e.data;
            var collageItemEditor = new InJs.CollageItemEditor(self.connectionGroup);
            collageItemEditor.add_onSaveSuccess(self.onUserEditingCollageItemComplete, self);
            collageItemEditor.editItem(item);
        };
        CollageControl.prototype.onCollageItemDeleteActionClicked = function (e, item) {
            var self = e.data;
            var promptActions = [
                new InJs.ModalDialogAction(InJs.Strings.YesDialogOption, function (sender, dialogContent) {
                    if (item.ItemId) {
                        self.connectionGroup.featuredQuestionsService.deleteFeaturedQuestion(item).done(function () {
                            self.updateFromServer();
                        }).fail(function () {
                        });
                        self.connectionGroup.bridge.hideDialog();
                    }
                }),
                new InJs.ModalDialogAction(InJs.Strings.NoDialogOption, function (sender, dialogContent) {
                    self.connectionGroup.bridge.hideDialog();
                })
            ];
            self.connectionGroup.bridge.showPrompt(InJs.Strings.CollageDeleteItemDialogTitle, InJs.Strings.CollageDeleteItemDialogText, promptActions, true);
        };
        CollageControl.prototype.onAddTileClicked = function (e) {
            var self = e.data;
            if (self._model.items.length < CollageControl.MaxCollageItemCount) {
                var collageItemEditor = new InJs.CollageItemEditor(self.connectionGroup);
                collageItemEditor.add_onSaveSuccess(self.onUserEditingCollageItemComplete, self);
                var nextAvailablePosition = self._view.getNextInsertPosition();
                collageItemEditor.createItem(nextAvailablePosition);
                // See if the current set of items needs to be reconciled against the local coordinate system
                if (self._view.reconcileItemCoordinates() === true) {
                    var updatedItemSet = self._model.items.map(function (item, index, itemSet) {
                        return item.source;
                    });
                    self.connectionGroup.featuredQuestionsService.updateFeaturedQuestions(updatedItemSet).done(function () {
                        self.updateFromServer().done(function () {
                            // after new position info has been reconciled, update the editor information
                            var updatedInsertPosition = self._view.getNextInsertPosition();
                            collageItemEditor.item.PositionX = updatedInsertPosition.x;
                            collageItemEditor.item.PositionY = updatedInsertPosition.y;
                        });
                    });
                }
            }
            else {
                self.connectionGroup.bridge.showMessage(InJs.Strings.CollageControlMaxNumberOfItemsMessageTitle, InJs.Strings.CollageControlMaxNumberOfItemsMessageText);
            }
        };
        CollageControl.prototype.onUserEditingCollageItemComplete = function (e) {
            var self = e.data;
            self.updateFromServer();
        };
        CollageControl.prototype.updateFromServer = function () {
            var _this = this;
            var deferred = $.Deferred();
            this.connectionGroup.featuredQuestionsService.getFeaturedQuestions().done(function (items) {
                _this.update(items);
                deferred.resolve();
            }).fail(function () {
                // handle errors
                deferred.reject();
            });
            return deferred.promise();
        };
        CollageControl.MaxCollageItemCount = 50;
        CollageControl.ShowCollageOnEmptyStateTimeoutMs = 2000;
        return CollageControl;
    })(InJs.InfoNavConnectedClientControl);
    InJs.CollageControl = CollageControl;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** The Collage item editor control used to construct/edit CollageItems */
    var CollageItemEditor = (function (_super) {
        __extends(CollageItemEditor, _super);
        function CollageItemEditor(connectionGroup) {
            _super.call(this, CollageItemEditor.DefaultTemplateProvider);
            this._itemView = null;
            this._controlRoot = null;
            this._saveBtn = null;
            this._cancelBtn = null;
            this._utteranceInput = null;
            this._utteranceInputCaption = null;
            this._backgroundImgUrlInput = null;
            this._backgroundImgUrlCaption = null;
            this._connectionGroup = null;
            this._hasValidImage = false;
            this._hasValidUtterance = false;
            this._hasPendingUtterance = false;
            this._hasPendingImageLoad = false;
            this._utterance = '';
            this._backgroundImgUrl = '';
            this._itemDataSourceProperties = null;
            this._isNewItem = false;
            InJs.Utility.throwIfNullOrUndefined(connectionGroup, this, 'ctor', connectionGroup);
            this._connectionGroup = connectionGroup;
        }
        Object.defineProperty(CollageItemEditor.prototype, "item", {
            /** The item as edited by the user */
            get: function () {
                return this._itemView.source;
            },
            enumerable: true,
            configurable: true
        });
        /**
          Creates a new FeaturedQuestion item and allows the user to save it to the FeaturedQuestions service
          @param position - The position data for the newly item added
        */
        CollageItemEditor.prototype.createItem = function (position) {
            this._isNewItem = true;
            this.editItemInternal(null, position);
        };
        /**
          Opens an existing FeaturedQuestion item and allows the user to update it and save it to the FeaturedQuestions service
          NOTE: The currrent implementation will add a copy of the item to the collage - proper edit/delete support is incoming
          @param item - The item to be edited
        */
        CollageItemEditor.prototype.editItem = function (item) {
            this._isNewItem = false;
            this.editItemInternal(item);
        };
        CollageItemEditor.prototype.close = function () {
            this._connectionGroup.bridge.hideDialog();
        };
        /** Subscribes to the item saved event */
        CollageItemEditor.prototype.add_onSaveSuccess = function (handler, data) {
            $(this).on(CollageItemEditor.OnSaveSuccessEventName, data, handler);
        };
        CollageItemEditor.prototype.editItemInternal = function (item, position) {
            var _this = this;
            var baseItemJson;
            if (item) {
                baseItemJson = item;
            }
            else {
                // if no item was provided, create a copy of the base item template
                baseItemJson = JSON.parse(JSON.stringify(CollageItemEditor.BaseItemTemplateJson));
            }
            if (position) {
                baseItemJson.PositionX = position.x;
                baseItemJson.PositionY = position.y;
            }
            this._itemView = new InJs.CollageItemView(baseItemJson);
            var dialogTitle = this._isNewItem ? InJs.Strings.CollageItemEditorAddItemTitle : InJs.Strings.CollageItemEditorEditItemTitle;
            this._connectionGroup.bridge.showCustomDialog(dialogTitle, this.templateProvider.controlTemplate, [], function (dialogContent) {
                _this.initializeLayout(dialogContent, baseItemJson);
            });
        };
        CollageItemEditor.prototype.initializeLayout = function (dialogContent, baseItemJson) {
            var _this = this;
            this._controlRoot = dialogContent;
            // attach to form change events
            this._controlRoot.find('input#utterance').on('input', this, function () {
                _this.updateItem();
            });
            this._controlRoot.find('input#bgImgUrl').on('change', this, function () {
                _this.updateItem();
            });
            this._controlRoot.find('input[type!="text"]').on('change', this, function () {
                _this.updateItem(true);
            });
            // append the live collage item that will be updated
            this._controlRoot.find('.collageItemContainer').append(this._itemView.layout);
            this._itemView.isVisible = true;
            // cache elements
            this._saveBtn = this._controlRoot.find('input#saveBtn');
            this._cancelBtn = this._controlRoot.find('input#cancelBtn');
            this._backgroundImgUrlInput = this._controlRoot.find('input#bgImgUrl');
            this._utteranceInput = this._controlRoot.find('input#utterance');
            this._utteranceInputCaption = this._controlRoot.find('.utteranceCaption.caption');
            this._backgroundImgUrlCaption = this._controlRoot.find('.bgImgUrlCaption.caption');
            // bind events
            this._cancelBtn.on(InJs.DOMConstants.mouseClickEventName, function () { return _this.close(); });
            if (this._isNewItem === true) {
                this._saveBtn.on(InJs.DOMConstants.mouseClickEventName, this, this.onSaveNewItemClick);
            }
            else {
                this._saveBtn.on(InJs.DOMConstants.mouseClickEventName, this, this.onUpdateExistingItemClick);
            }
            // register handlers for background image load events
            this._itemView.add_onBackgroundImageLoaded(this.onBackgroundImageLoaded, this);
            this._itemView.add_onBackgroundImageLoadError(this.onBackgroundImageLoadError, this);
            if (this._isNewItem === false) {
                this.inputItem(baseItemJson);
                window.setTimeout(function () {
                    _this.updateItem();
                }, 0);
            }
            this._controlRoot.find('.previewHost').animate({ opacity: 1 });
        };
        CollageItemEditor.prototype.inputItem = function (item) {
            this.setUtterance(item.Utterance);
            this.setItemSize(item.TileSize);
            this.setItemColor(item.ThemeColorIndex);
            this.setDefaultImage(item.DefaultImageIndex);
            this.setIsTopLevelFeatured(item.IsFeatured);
            if (InJs.Utility.isString(item.ImageUrl) && item.ImageUrl.length > 0) {
                this.setBackgroundImageUrl(item.ImageUrl);
            }
            if (this._connectionGroup.interpretService) {
                this.issueUtterance(item.Utterance);
            }
        };
        CollageItemEditor.prototype.setUtterance = function (text) {
            var inputBox = this._controlRoot.find('input#utterance');
            inputBox.val(text);
        };
        CollageItemEditor.prototype.setIsTopLevelFeatured = function (isFeatured) {
            var desiredInput = this._controlRoot.find('input#isTopLevel');
            desiredInput.prop('checked', isFeatured);
        };
        CollageItemEditor.prototype.setItemSize = function (size) {
            var sizePicker = this._controlRoot.find('.sizePicker');
            this.selectRadioButtonByValue(sizePicker, size);
        };
        CollageItemEditor.prototype.setItemColor = function (color) {
            var colorPicker = this._controlRoot.find('.bgColorPicker');
            this.selectRadioButtonByValue(colorPicker, color);
        };
        CollageItemEditor.prototype.setDefaultImage = function (image) {
            var imagePicker = this._controlRoot.find('.bgIconPicker');
            this.selectRadioButtonByValue(imagePicker, image);
        };
        CollageItemEditor.prototype.selectRadioButtonByValue = function (selectionGroup, value) {
            var desiredInput = selectionGroup.find('input[type="radio"][value="' + value + '"]');
            desiredInput.prop('checked', true);
        };
        CollageItemEditor.prototype.setBackgroundImageUrl = function (url) {
            var inputBox = this._controlRoot.find('input#bgImgUrl');
            inputBox.val(url);
        };
        CollageItemEditor.prototype.onSaveNewItemClick = function (e) {
            var self = e.data;
            self.item.WorkbookIdentifier = self._connectionGroup.featuredQuestionsService.createWorkbookIdentifier(self.item, self._itemDataSourceProperties);
            self._connectionGroup.featuredQuestionsService.addFeaturedQuestion(self.item).done(function (newItemId) {
                self.close();
                $(self).trigger(CollageItemEditor.OnSaveSuccessEventName, self);
            }).fail(function () {
                // handle errors
            });
        };
        CollageItemEditor.prototype.onUpdateExistingItemClick = function (e) {
            var self = e.data;
            self.item.WorkbookIdentifier = self._connectionGroup.featuredQuestionsService.createWorkbookIdentifier(self.item, self._itemDataSourceProperties);
            self._connectionGroup.featuredQuestionsService.updateFeaturedQuestions([self.item]).done(function (newItemId) {
                self.close();
                $(self).trigger(CollageItemEditor.OnSaveSuccessEventName, self);
            }).fail(function () {
                // handle errors
            });
        };
        CollageItemEditor.prototype.onBackgroundImageLoadError = function (e) {
            var self = e.data;
            if (self._itemView.backgroundImageUrl) {
                self._hasValidImage = self._hasPendingImageLoad = false;
                self.validateForm();
            }
        };
        CollageItemEditor.prototype.onBackgroundImageLoaded = function (e) {
            var self = e.data;
            if (self._itemView.backgroundImageUrl) {
                self._hasValidImage = true;
                self._hasPendingImageLoad = false;
                self.validateForm();
            }
        };
        CollageItemEditor.prototype.updateItem = function (ignoreTextFields) {
            // retrieve form contents
            var utterance = this._utterance = this._utteranceInput.val();
            var backgroundImgUrl = this._backgroundImgUrl = this._backgroundImgUrlInput.val();
            var sizeIndex = parseInt(this._controlRoot.find('input[name=itemSize]:checked').val());
            var colorIndex = parseInt(this._controlRoot.find('input[name=itemColor]:checked').val());
            var defaultIconIndex = parseInt(this._controlRoot.find('input[name=itemIcon]:checked').val());
            var isFeaturedOnPowerBI = this._controlRoot.find('input[name=featuredQuestionLevel]').is(':checked');
            if (ignoreTextFields !== true) {
                this._hasValidImage = false;
                this._hasValidUtterance = false;
                if (this._connectionGroup.interpretService && this._itemView.text !== utterance && utterance.length >= CollageItemEditor.MinimumUtteranceLength) {
                    this.issueUtterance(utterance);
                }
                else if (utterance.length > CollageItemEditor.MinimumUtteranceLength) {
                    this._hasValidUtterance = true;
                    this._hasPendingUtterance = false;
                }
                else {
                    this._utteranceInputCaption.text(InJs.Strings.CollageItemEditorUtteranceInputCaption);
                }
                if (backgroundImgUrl.length === 0) {
                    this._hasValidImage = true;
                    this._itemView.backgroundImageUrl = '';
                    this._backgroundImgUrlCaption.text(InJs.Strings.CollageItemCustomImageUrlCaption);
                }
                else if (InJs.Utility.isValidUrl(backgroundImgUrl)) {
                    if (backgroundImgUrl !== this._itemView.backgroundImageUrl) {
                        this._itemView.backgroundImageUrl = backgroundImgUrl;
                        this._backgroundImgUrlCaption.text(InJs.Strings.CollageItemCustomImageUrlLoadingCaption);
                        this._hasPendingImageLoad = true;
                    }
                    else {
                        this._hasValidImage = true;
                    }
                }
                else {
                    this._backgroundImgUrlCaption.text(InJs.Strings.CollageItemCustomImageUrlBadAddressCaption);
                }
            }
            this._itemView.text = utterance;
            this._itemView.color = colorIndex;
            this._itemView.size = sizeIndex;
            this._itemView.defaultIcon = defaultIconIndex;
            this.item.IsFeatured = isFeaturedOnPowerBI;
            this.validateForm();
        };
        /** validates the current contents of the form */
        CollageItemEditor.prototype.validateForm = function () {
            this._utteranceInputCaption.removeClass(CollageItemEditor.SuccessCssClass).removeClass(CollageItemEditor.ErrorCssClass);
            this._backgroundImgUrlCaption.removeClass(CollageItemEditor.SuccessCssClass).removeClass(CollageItemEditor.ErrorCssClass);
            if (this._utterance.length >= CollageItemEditor.MinimumUtteranceLength && !this._hasPendingUtterance) {
                // Verify utterance
                if (!this._hasValidUtterance) {
                    this._utteranceInputCaption.addClass(CollageItemEditor.ErrorCssClass).text(InJs.Strings.CollageItemEditorUtteranceInputNoResultsCaption);
                }
                else {
                    this._utteranceInputCaption.addClass(CollageItemEditor.SuccessCssClass).text(InJs.Strings.CollageItemEditorUtteranceInputResultFoundCaption);
                    this.item.DisplayText = this.item.Utterance;
                }
            }
            if (this._backgroundImgUrl.length > 0 && !this._hasPendingImageLoad) {
                // Verify background image
                if (!this._hasValidImage) {
                    this._backgroundImgUrlCaption.addClass(CollageItemEditor.ErrorCssClass).text(InJs.Strings.CollageItemCustomImageUrlLoadErrorCaption);
                }
                else {
                    this._backgroundImgUrlCaption.addClass(CollageItemEditor.SuccessCssClass).text(InJs.Strings.CollageItemCustomImageUrlSuccessCaption);
                }
            }
            if (this._hasValidUtterance && this._hasValidImage) {
                this._saveBtn.removeAttr(InJs.DOMConstants.disabledAttributeOrValue);
            }
            else {
                this._saveBtn.attr(InJs.DOMConstants.disabledAttributeOrValue, InJs.DOMConstants.disabledAttributeOrValue);
            }
        };
        /** Issues a request against the interpretation service */
        CollageItemEditor.prototype.issueUtterance = function (utterance) {
            var _this = this;
            this._hasPendingUtterance = true;
            this._utteranceInputCaption.text(InJs.Strings.CollageItemEditorUtteranceInputSearchingCaption);
            this._connectionGroup.interpretService.interpretAsync(utterance, null, function (e) {
                if (e.response.isEmpty(false)) {
                    _this._hasValidUtterance = false;
                }
                else {
                    var result = e.response.result;
                    var dataSourceProperties = _this._connectionGroup.getDataSourceProperties(result.databaseName);
                    _this._itemDataSourceProperties = dataSourceProperties;
                    _this._hasValidUtterance = true;
                }
                _this._hasPendingUtterance = false;
                _this.validateForm();
            }, function (e) {
                _this._hasValidUtterance = _this._hasPendingUtterance = false;
                _this.validateForm();
            });
        };
        CollageItemEditor.DefaultTemplateProvider = new InJs.CollageItemEditorTemplateProvider();
        CollageItemEditor.OnSaveSuccessEventName = 'CollageItemEditorSuccessfulSave';
        CollageItemEditor.BaseItemTemplateJson = {
            Utterance: "",
            DisplayText: "",
            ImageUrl: "",
            TileSize: 0 /* Small */,
            ThemeColorIndex: 0,
            DefaultImageIndex: 1 /* General */,
            IsFeatured: false,
            OwnerName: "unknown"
        };
        CollageItemEditor.ErrorCssClass = 'error';
        CollageItemEditor.SuccessCssClass = 'success';
        CollageItemEditor.MinimumUtteranceLength = 3;
        return CollageItemEditor;
    })(InJs.ClientControl);
    InJs.CollageItemEditor = CollageItemEditor;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var HelpListItem = (function () {
        function HelpListItem(utterance, displayText, staticUri, databaseName) {
            this.utterance = utterance;
            this.displayText = displayText;
            this.staticUri = staticUri;
            this.databaseName = databaseName;
        }
        return HelpListItem;
    })();
    InJs.HelpListItem = HelpListItem;
    var HelpViewerControl = (function (_super) {
        __extends(HelpViewerControl, _super);
        function HelpViewerControl(element, options) {
            var _this = this;
            _super.call(this, element, options);
            this.inMainHelpPage = true;
            this._pullOutText = null;
            this._controlRoot = null;
            this._expanderBtn = null;
            this._contentFrame = null;
            this._contentFrameHost = null;
            this._paneCaptionTextElem = null;
            this._contentUnavailableTimerId = 0;
            this._controlRoot = element;
            this._controlRoot.addClass('helpViewerControl');
            var helpPaneLayout = $(HelpViewerControl.InnerLayoutHtml.replace('{panePulloutText}', InJs.Strings.helpViewerControlTitleText).replace('{feedbackBannerTitle}', InJs.Strings.helpViewerFeedbackBannerTitle).replace('{feedbackBannerText}', InJs.Strings.helpViewerFeedbackBannerText).replace('{helpForumUrl}', HelpViewerControl.HelpForumUrl));
            this._controlRoot.append(helpPaneLayout);
            this._contentFrameHost = this._controlRoot.find('.contentFrameHost');
            this._expanderBtn = this._controlRoot.find('.expanderBtn');
            this._paneCaptionTextElem = this._controlRoot.find('.paneCaption .innerText');
            this._expanderBtn.on(InJs.DOMConstants.mouseClickEventName, this, this.onExpanderBtnClick);
            this._pullOutText = this._controlRoot.find('.pullOutText');
            // Listen for events from the currently loaded help page
            window.addEventListener(InJs.DOMConstants.messageEventName, function (event) {
                _this._handleHelpViewerMessage(event);
            }, false);
            if (this.connectionGroup.getIsReady()) {
                this.onGroupReady();
            }
        }
        Object.defineProperty(HelpViewerControl.prototype, "isExpanded", {
            /** Whether the help pane is currently expanded */
            get: function () {
                return this._controlRoot.hasClass(HelpViewerControl.ExpandedClassName);
            },
            enumerable: true,
            configurable: true
        });
        HelpViewerControl.prototype._onConnectionGroupReady = function () {
            this.onGroupReady();
        };
        /**
         * Event handler for the interpretation success event
         * @param e - Interpret success event arguments
         */
        HelpViewerControl.prototype._onInterpretSuccess = function (e) {
            if (this._hasInterpretResponse()) {
                this.onResultDisplayed(e.response.result);
            }
        };
        /**
         * Event handler when the interpret result is changed due to back/forward
         * navigation or the user selecting a different data source
         * @param e - interpret result changed event arguments
         */
        HelpViewerControl.prototype._onInterpretResultChanged = function (e) {
            this.onResultDisplayed(e.response.result);
        };
        /**
         * Event handler for when the collage control visibility changes
         * @param isCollageVisible - Whether the collage control is visible
         */
        HelpViewerControl.prototype._onCollageVisibilityChanged = function (isCollageVisible) {
            if (isCollageVisible) {
                this.navigateToGeneralHelpPage();
            }
        };
        /**
         * Event handler for the interpret result cleared event
         * @param e - interpret result cleared event arguments
         */
        HelpViewerControl.prototype._onInterpretResultCleared = function (e) {
            if (!this.isExpanded) {
                this.navigateToGeneralHelpPage();
            }
        };
        /**
         * Attempts to retrive the first question related to the model in focus
         * @param model - current model in focus
        */
        HelpViewerControl.prototype.getFirstQuestionOfModel = function (modelName, defaultName) {
            var featuredQuestions = this.connectionGroup.getFeaturedQuestions(modelName);
            if (featuredQuestions && featuredQuestions.length > 0) {
                return featuredQuestions[0].Utterance;
            }
            return defaultName;
        };
        /**
         * Builds a general help page
         * @param dataSourceProperties - properties of the model
        */
        HelpViewerControl.prototype.buildGeneralHelpUserInterface = function () {
            this.inMainHelpPage = true;
            var listItems = [];
            var dbNameList = this.connectionGroup.getListOfDatabaseNames();
            for (var i = 0; i < dbNameList.length; i++) {
                var dataSourceProperties = this.connectionGroup.getDataSourceProperties(dbNameList[i]);
                if (dataSourceProperties) {
                    var firstQuestion = this.getFirstQuestionOfModel(dbNameList[i], '');
                    listItems.push(new HelpListItem(firstQuestion, dataSourceProperties.name, dataSourceProperties.helpContentUrl, dbNameList[i]));
                }
            }
            this.createHelpPaneUIWithCustomContent(HelpViewerControl.HomeBannerUri, InJs.Strings.mainHelpPageTitle, InJs.Strings.mainHelpPageDescription, InJs.Strings.mainHelpPageWorkbookListTitle, listItems, false);
            this.addEvents();
        };
        /**
         * Builds the help pane with model specific content
         * @param dataSourceProperties - properties of the model
        */
        HelpViewerControl.prototype.buildModelSpecificHelpUserInterface = function (dataSourceProperties, databaseName) {
            this.inMainHelpPage = false;
            var featuredQuestions = this.connectionGroup.getFeaturedQuestions(databaseName);
            var listItems = [];
            for (var i = 0; i < featuredQuestions.length; i++) {
                listItems.push(new HelpListItem(featuredQuestions[i].Utterance, featuredQuestions[i].DisplayText));
            }
            this.createHelpPaneUIWithCustomContent(HelpViewerControl.DefaultBannerUri, dataSourceProperties.name.replace('.xlsx', ''), InJs.Strings.modelHelpPageDescription, InJs.Strings.modelHelpPageQuestionListTitle, listItems, false);
            this.addEvents();
        };
        /**
         * Add events to items for modifying user utterance and navigation tags
        */
        HelpViewerControl.prototype.addEvents = function () {
            var _this = this;
            this._contentFrameHost.find('li[data-utterance]').on(InJs.DOMConstants.mouseClickEventName, function (e) {
                var staticUri = $(e.currentTarget).attr('static-uri');
                if (staticUri) {
                    // This is only to cater for static sample help pages.
                    // Remove this logic when we are past static help pages.
                    var utterance = $(e.currentTarget).attr('data-utterance');
                    if (!InJs.StringExtensions.isNullOrUndefinedOrWhiteSpaceString(utterance)) {
                        _this.connectionGroup.bridge.changeUserUtterance(utterance);
                    }
                    _this.navigateToUrl(staticUri);
                }
                else {
                    var utterance = $(e.currentTarget).attr('data-utterance');
                    if (InJs.StringExtensions.isNullOrUndefinedOrWhiteSpaceString(utterance)) {
                        var databaseName = $(e.currentTarget).attr('databasename');
                        if (databaseName) {
                            var dataSource = _this.connectionGroup.getDataSourceProperties(databaseName);
                            _this.buildModelSpecificHelpUserInterface(dataSource, databaseName);
                        }
                    }
                    else {
                        _this.connectionGroup.bridge.changeUserUtterance(utterance);
                    }
                }
            });
            var featuredElem = this._contentFrameHost.find(HelpViewerControl.FeaturedSelector);
            if (featuredElem) {
                featuredElem.on(InJs.DOMConstants.mouseClickEventName, function (e) {
                    _this.connectionGroup.bridge.showCollage();
                });
            }
            var addElem = this._contentFrameHost.find(HelpViewerControl.AddSelector);
            if (addElem) {
                addElem.on(InJs.DOMConstants.mouseClickEventName, function (e) {
                    var collageItemEditor = new InJs.CollageItemEditor(_this.connectionGroup);
                    collageItemEditor.add_onSaveSuccess(_this.onUserEditingCollageItemComplete, _this);
                    collageItemEditor.createItem({ x: -1, y: -1 });
                });
            }
            window.clearTimeout(this._contentUnavailableTimerId);
            this._paneCaptionTextElem.text(InJs.Strings.emptyResultDescriptionText);
        };
        /**
         * Once editing complete, refresh questions
        */
        HelpViewerControl.prototype.onUserEditingCollageItemComplete = function (e) {
            var self = e.data;
            if (self.inMainHelpPage) {
                self.connectionGroup.bridge.notifyFeaturedQuestionsUpdated();
            }
            else {
                self.connectionGroup.invalidate();
            }
        };
        /**
         * Modifies the html tags with the appropriate data
        */
        HelpViewerControl.prototype.createHelpPaneUIWithCustomContent = function (bannerUrl, reportTitle, reportDescription, listTitle, listItems, removeFeaturedQuestionsLink) {
            var html = $(HelpViewerControl.helpPaneHtmlSkeleton.replace('{BANNERURL}', bannerUrl));
            var helpList = html.find('.itemList');
            if (listItems.length === 0) {
                helpList.text(InJs.Strings.helpPageNoItemsListed);
            }
            else {
                for (var i = 0; i < listItems.length; i++) {
                    var listElem = $('<li></li>');
                    listElem.attr('data-utterance', listItems[i].utterance);
                    listElem.text(listItems[i].displayText);
                    if (listItems[i].staticUri) {
                        // This is only to cater for static sample help pages.
                        // Remove this logic when we are past static help pages.
                        listElem.attr('static-uri', listItems[i].staticUri);
                    }
                    if (listItems[i].databaseName) {
                        listElem.attr('databasename', listItems[i].databaseName);
                    }
                    helpList.append(listElem);
                }
            }
            html.find('.reportTitle').text(reportTitle);
            html.find('.description').text(reportDescription);
            html.find('.exampleQuestionsTitle').text(listTitle);
            html.find('.addText').text(InJs.Strings.helpPageAddFeaturedQuestion);
            html.find('.featuredText').text(InJs.Strings.helpPageFeaturedQuestions);
            html.find('.reportTitle').attr('title', reportTitle);
            this._contentFrameHost.empty();
            this._contentFrameHost.append(html);
            this._contentFrame = this._contentFrameHost.find('#helpPane');
            if (!this.connectionGroup.isUserAdmin) {
                this._contentFrameHost.find(HelpViewerControl.AddSelector).remove();
            }
            if (removeFeaturedQuestionsLink) {
                this._contentFrameHost.find(HelpViewerControl.FeaturedSelector).remove();
            }
        };
        /** Displays help for the specified result
            @param - The result for which we want to load help content
        */
        HelpViewerControl.prototype.onResultDisplayed = function (result) {
            var dataSource = this.connectionGroup.getDataSourceProperties(result.databaseName);
            var helpPageUrl = dataSource.helpContentUrl;
            if (helpPageUrl) {
                // If a static URL is avaliable, display that
                this.inMainHelpPage = false;
                this.navigateToUrl(helpPageUrl);
            }
            else {
                // else build a custom UI based on the data source properties
                this.buildModelSpecificHelpUserInterface(dataSource, result.databaseName);
            }
            if (result.isEmpty(false))
                return;
            var localData = this.connectionGroup.appCache.getData();
            if (!localData.dataSourceHelpData) {
                localData.dataSourceHelpData = {};
            }
            if (!localData.dataSourceHelpData[HelpViewerControl.HelpOptionsKey]) {
                localData.dataSourceHelpData[HelpViewerControl.HelpOptionsKey] = {};
            }
            if (!localData.dataSourceHelpData[HelpViewerControl.HelpOptionsKey].helpAutoShown) {
                localData.dataSourceHelpData[HelpViewerControl.HelpOptionsKey].helpAutoShown = true;
                this.expand();
            }
            this.connectionGroup.appCache.updateData(localData);
        };
        /** Expands the help viewer */
        HelpViewerControl.prototype.expand = function () {
            if (!this.isExpanded) {
                this.toggleExpansionState();
            }
        };
        /** Collapses the help viewer */
        HelpViewerControl.prototype.collapse = function () {
            if (this.isExpanded) {
                this.toggleExpansionState();
            }
        };
        HelpViewerControl.prototype.onGroupReady = function () {
            if (!InJs.StringExtensions.isNullOrEmpty(this.connectionGroup.generalHelpPageUrl)) {
                // unhide the control
                this._controlRoot.css(InJs.CssConstants.displayProperty, InJs.CssConstants.blockValue);
                // on initial load, navigate to the general help page
                this.navigateToGeneralHelpPage();
                var localData = this.connectionGroup.appCache.getData();
                // automatically expand the pane on first load
                if (!localData.firstRunHelpShown) {
                    this.expand();
                    localData.firstRunHelpShown = true;
                    this.connectionGroup.appCache.updateData(localData);
                }
            }
        };
        /** Replaces the current help content with the general help page */
        HelpViewerControl.prototype.navigateToGeneralHelpPage = function () {
            if (!InJs.StringExtensions.isNullOrEmpty(this.connectionGroup.generalHelpPageUrl)) {
                this.buildGeneralHelpUserInterface();
            }
        };
        /** Navigates to the specified URL
            @param url - The url to open inside the help viewer
        */
        HelpViewerControl.prototype.navigateToUrl = function (url) {
            var _this = this;
            window.clearTimeout(this._contentUnavailableTimerId);
            this._paneCaptionTextElem.text(InJs.Strings.helpViewerHelpLoadingCaptionText);
            this._contentUnavailableTimerId = window.setTimeout(function () {
                _this._paneCaptionTextElem.text(InJs.Strings.helpViewerHelpUnavailableCaptionText);
            }, HelpViewerControl.HelpPageLoadTimeoutMs);
            // no point in navigating to where we are already
            if (!this._contentFrame || this._contentFrame.attr('src') !== url) {
                // create a new iframe to avoid adding an extra history entry to the parent page
                if (this._contentFrame) {
                    this._contentFrame.remove();
                }
                this._contentFrame = $('<iframe class="contentFrame"></iframe>');
                this._contentFrame.attr('src', url);
                this._contentFrameHost.append(this._contentFrame);
                this._contentFrame.css(InJs.CssConstants.displayProperty, InJs.CssConstants.noneValue);
            }
        };
        /** Toggles the expansion of the help viewer pane */
        HelpViewerControl.prototype.toggleExpansionState = function () {
            // if the user is expanding the pane we have an empty result, show the general help page
            if (!this.isExpanded && (!this._hasInterpretResponse() || (this._hasInterpretResponse() && this._currentInterpretResponse.result.isEmpty(false)))) {
                this.navigateToGeneralHelpPage();
            }
            this._controlRoot.toggleClass(HelpViewerControl.ExpandedClassName);
        };
        /** The action to be performed when the user clicks on the expander button
            @param e - The jQuery event object
        */
        HelpViewerControl.prototype.onExpanderBtnClick = function (e) {
            var self = e.data;
            self.toggleExpansionState();
            if (self.isExpanded) {
                self._pullOutText.html(InJs.Strings.emptyResultDescriptionText);
            }
            else {
                self._pullOutText.html(InJs.Strings.helpViewerControlTitleText);
            }
        };
        /** Handler for message events coming from the currently loaded help page
            @param event - The event message from the help page
        */
        HelpViewerControl.prototype._handleHelpViewerMessage = function (event) {
            var messageData;
            if (event.data) {
                try {
                    messageData = JSON.parse(event.data);
                    if (messageData.sender !== 'PowerBIQnAHelpPage')
                        return;
                }
                catch (e) {
                    // invalid message data
                    return;
                }
            }
            // handle actions
            if (messageData.utterance) {
                this.connectionGroup.telemetryService.notifyUserSelectedFeaturedQuestion(4 /* IHSF */);
                this.connectionGroup.bridge.changeUserUtterance(messageData.utterance);
            }
            else if (messageData.action === HelpViewerControl.PageReadyHelpPageAction) {
                this._contentFrame.css(InJs.CssConstants.displayProperty, InJs.CssConstants.blockValue);
            }
            else if (messageData.action === HelpViewerControl.ShowCollageHelpPageAction) {
                this.connectionGroup.telemetryService.notifyUserDisplayedFeaturedQuestions(3 /* IHDF */);
                this.connectionGroup.bridge.showCollage();
            }
        };
        HelpViewerControl.HelpForumUrl = "http://go.microsoft.com/fwlink/?LinkId=390059";
        // Constants
        HelpViewerControl.InnerLayoutHtml = '<div class="innerLayout">' + '<div class="paneHandle">' + '<div class = "expanderBtn"></div>' + '<div class="title"> <span class="pullOutText">{panePulloutText}</span></div>' + '</div>' + '<div class="paneCaption"><div class="innerText"></div></div>' + '<div class="contentFrameHost" ></div>' + '<a class="feedbackContentHost" href="{helpForumUrl}" target="_blank">' + '<div class="title" >{feedbackBannerTitle}</div>' + '<div class="content" >{feedbackBannerText}</div>' + '</a>' + '</div>';
        // This animation speed should be kept in sync with the CSS3 animations for this control
        HelpViewerControl.AnimationSpeedMs = 250;
        HelpViewerControl.DefaultBannerUri = "https://sampleimages.blob.core.windows.net/imagessu11/DefaultBanner.png";
        HelpViewerControl.HomeBannerUri = "https://sampleimages.blob.core.windows.net/imagessu11/HomeBanner.png";
        HelpViewerControl.HelpOptionsKey = "HelpOptionsKey";
        // The timeout for loading individual pieces of help content
        HelpViewerControl.HelpPageLoadTimeoutMs = 3000;
        HelpViewerControl.ExpandedClassName = 'expanded';
        //selectors
        HelpViewerControl.AddSelector = '.add';
        HelpViewerControl.FeaturedSelector = '.featured';
        // Actions from help page
        HelpViewerControl.ShowCollageHelpPageAction = 'showCollage';
        HelpViewerControl.PageReadyHelpPageAction = 'pageReady';
        // Fields
        HelpViewerControl.helpPaneHtmlSkeleton = '<div id="helpPane">' + '   <div class="imageFrame" style="background:url(\'{BANNERURL}\')">' + '       <div class="cssMask"></div>' + '       <h1 class="reportTitle"></h1>' + '   </div>' + '   <h2 class="description"></h2>' + '   <h2 class="exampleQuestionsTitle"></h2>' + '   <div class="questionList"><ul class="itemList"></ul></div>' + '   <hr class="divider">' + '   <div class="add">' + '       <div class="addIcon"></div>' + '       <p class="addText"></p>' + '   </div>' + '   <div class="featured">' + '       <div class="featuredIcon"></div>' + '       <p class="featuredText"></p>' + '   </div>' + '</div>';
        return HelpViewerControl;
    })(InJs.InfoNavConnectedClientControl);
    InJs.HelpViewerControl = HelpViewerControl;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var TraceType = jsCommon.TraceType;
    /** Connection group to encapsulate all SharePoint specific logic/dependencies */
    var SharePointOnlineConnectionGroup = (function (_super) {
        __extends(SharePointOnlineConnectionGroup, _super);
        function SharePointOnlineConnectionGroup(options) {
            var _this = this;
            _super.call(this, options, 17 /* IAPL */);
            /** The dictionary mapping a db name to InfoNavModel */
            this._infoNavModelMap = null;
            this._featuredQuestionsService = null;
            this._spHostUrl = null;
            this._spHostTitle = null;
            this._spBiCenterAppProductId = null;
            this._globalServiceClusterUrl = null;
            this._securityToken = null;
            this._managementSecurityToken = null;
            this._appCache = null;
            this._sessionAppCache = null;
            this._samplesDialogElem = null;
            this._uiInitializationDeferred = true;
            this._spSiteId = null;
            this._spWebId = null;
            this._userPermissions = 0 /* None */;
            this._isRuntimeModelingEnabled = false;
            this._isSamplesOnlyEnabled = false;
            this._isSampleUpgradeAvailable = false;
            this._isUsageReportingEnabled = false;
            this._noLicensePageUrl = null;
            this._isGeocodingEnabled = false;
            this._isLoadingAppMetadataNotificationDisplayed = false;
            this._appMetadataLoadingNotificationTimeoutId = 0;
            this.uiInitializedOnce = false;
            this._spHostUrl = InJs.QueryStringUtil.getQueryStringValue(SharePointOnlineConnectionGroup._sharepointSiteUrlParamName);
            this._spHostTitle = InJs.QueryStringUtil.getQueryStringValue(SharePointOnlineConnectionGroup._sharepointSiteTitleParamName);
            if (InJs.StringExtensions.isNullOrUndefinedOrWhiteSpaceString(this._spHostUrl)) {
                this._spHostUrl = SharePointOnlineConnectionGroup.getSPHostUrlFromInfoNavShortUrl();
            }
            InJs.Utility.throwIfNullEmptyOrWhitespaceString(this._spHostUrl, this, 'ctor', 'spHostUrl');
            this._appCache = new InJs.InfoNavAppLocalCache(this._spHostUrl);
            this._sessionAppCache = new InJs.InfoNavAppSessionCache(this._spHostUrl);
            var cachedAppData = this._appCache.getData();
            if (InJs.StringExtensions.isNullOrUndefinedOrWhiteSpaceString(this._spHostTitle)) {
                if (cachedAppData) {
                    this._spHostTitle = cachedAppData.spWebTitle;
                }
            }
            if (cachedAppData) {
                this._isSamplesOnlyEnabled = cachedAppData.isSamplesOnlyEnabled;
            }
            // Listen for events from the samples dialog iframe
            window.addEventListener(InJs.DOMConstants.messageEventName, function (event) {
                _this.handleSamplesDialogMessage(event);
            }, false);
            var ajaxOptions = { cache: true };
            $.ajaxSetup(ajaxOptions);
            this.invalidate(this._pageLoadActivity);
        }
        SharePointOnlineConnectionGroup.requirementsMet = function () {
            var spHostUrl = InJs.QueryStringUtil.getQueryStringValue(SharePointOnlineConnectionGroup._sharepointSiteUrlParamName);
            var spHostTitle = InJs.QueryStringUtil.getQueryStringValue(SharePointOnlineConnectionGroup._sharepointSiteTitleParamName);
            var requirementMet = !InJs.StringExtensions.isNullOrUndefinedOrWhiteSpaceString(spHostUrl) && !InJs.StringExtensions.isNullOrUndefinedOrWhiteSpaceString(spHostTitle) && InJs.Utility.getProtocolFromUrl(spHostUrl) === SharePointOnlineConnectionGroup._httpsProtocol;
            if (!requirementMet) {
                requirementMet = SharePointOnlineConnectionGroup.isInfoNavShortUrl();
            }
            return requirementMet;
        };
        SharePointOnlineConnectionGroup.getDocumentUrl = function (model) {
            var baseUrl = InJs.Utility.getDomainForUrl(model.SharePointDocument.WebProperties.WebUri);
            var documentUrl = InJs.Utility.urlCombine(baseUrl, model.SharePointDocumentProperties.ServerRelativeUrl);
            // TODO 1219162: Consolidate URL utility methods
            // add web=1 to query string to ensure it is opened in the web app mode instead of triggering a download
            documentUrl = documentUrl + '?Web=1';
            return documentUrl;
        };
        SharePointOnlineConnectionGroup._createSamplesPageUrl = function (spSiteId, spWebId, spListId, languageLocale, regionalLocale, isFirstRun) {
            return '/sharepointpages/SPIntegration/Samples/Pages/Samples.html' + '?SpSiteId=' + spSiteId + '&SpWebId=' + spWebId + '&SpListId=' + spListId + '&languageLocale=' + languageLocale + '&regionalLocale=' + regionalLocale + '&IsFirstRun=' + isFirstRun.toString();
        };
        /**
         * Check if current request URL is an InfoNav Short URL.
         * An InfoNav Short URL follows the following syntax:
         *     https://<BI Azure Gateway URL>/infonav/app/<SPHost URL without https>[/?k=utterance]
         * For example: https://onebox.analysis.windows-int.net/infonav/app/bchildsdev.sharepoint.com
         */
        SharePointOnlineConnectionGroup.isInfoNavShortUrl = function () {
            return window.location.pathname.indexOf(SharePointOnlineConnectionGroup._infoNavAppPath) === 0 && window.location.pathname.length > SharePointOnlineConnectionGroup._infoNavAppPathLength;
        };
        Object.defineProperty(SharePointOnlineConnectionGroup.prototype, "globalServiceClusterUri", {
            get: function () {
                // GS URI is retrieved through GetAppMetadata
                return this._globalServiceClusterUrl;
            },
            enumerable: true,
            configurable: true
        });
        SharePointOnlineConnectionGroup.prototype.getClusterUri = function () {
            // Tenant-based cluster URI is included within the page
            return clusterUri;
        };
        SharePointOnlineConnectionGroup.prototype.getSecurityToken = function () {
            return this._securityToken;
        };
        SharePointOnlineConnectionGroup.prototype.getManagementSecurityToken = function () {
            return this._managementSecurityToken;
        };
        SharePointOnlineConnectionGroup.prototype.getSpoContextToken = function () {
            return securityToken;
        };
        SharePointOnlineConnectionGroup.prototype.getInfoNavModel = function (dbName) {
            if (!this._infoNavModelMap) {
                return null;
            }
            return this._infoNavModelMap[dbName.toLowerCase()];
        };
        Object.defineProperty(SharePointOnlineConnectionGroup.prototype, "spHostUrl", {
            get: function () {
                return this._spHostUrl;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SharePointOnlineConnectionGroup.prototype, "initialUtterance", {
            get: function () {
                return InJs.QueryStringUtil.getQueryStringValue('k');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SharePointOnlineConnectionGroup.prototype, "isUserAdmin", {
            get: function () {
                return InJs.EnumExtensions.hasFlag(this.userPermissions, 1 /* Admin */);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SharePointOnlineConnectionGroup.prototype, "userPermissions", {
            get: function () {
                return this._userPermissions;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SharePointOnlineConnectionGroup.prototype, "isRuntimeModelingEnabled", {
            get: function () {
                return this._isRuntimeModelingEnabled;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SharePointOnlineConnectionGroup.prototype, "isSamplesOnlyModeEnabled", {
            get: function () {
                return this._isSamplesOnlyEnabled;
            },
            enumerable: true,
            configurable: true
        });
        SharePointOnlineConnectionGroup.prototype.getIsUsageReportingEnabled = function () {
            return this._isUsageReportingEnabled;
        };
        Object.defineProperty(SharePointOnlineConnectionGroup.prototype, "featuredQuestions", {
            get: function () {
                return this.appCache.getData().featuredQuestions;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SharePointOnlineConnectionGroup.prototype, "featuredQuestionsService", {
            /** Gets the current instance of the featured questions service */
            get: function () {
                return this._featuredQuestionsService;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SharePointOnlineConnectionGroup.prototype, "isGeocodingEnabled", {
            get: function () {
                if (!this.getIsReady()) {
                    // we allow checking this flag only after the app metadata has been loaded
                    InJs.Utility.throwException(InJs.Errors.invalidOperation("isGeocodingEnabled should be invoked after host is ready"));
                }
                return this._isGeocodingEnabled;
            },
            enumerable: true,
            configurable: true
        });
        SharePointOnlineConnectionGroup.prototype.createInfoNavShortUrl = function () {
            var spHostUrlWithoutProtocol = InJs.Utility.getHostNameForUrl(this._spHostUrl);
            var output = InJs.Utility.urlCombine(this.getInfoNavAppUrl(), spHostUrlWithoutProtocol);
            var queryParts = {};
            var useHtml5PowerViewValue = InJs.QueryStringUtil.getQueryStringValue('useHtml5PowerView');
            if (useHtml5PowerViewValue && Boolean(useHtml5PowerViewValue)) {
                queryParts['useHtml5PowerView'] = 'true';
            }
            var serverTraceLevel = InJs.QueryStringUtil.getQueryStringValue('serverTraceLevel');
            if (!!serverTraceLevel) {
                queryParts['serverTraceLevel'] = serverTraceLevel;
            }
            if (!InJs.StringExtensions.isNullOrEmpty(this.initialUtterance)) {
                queryParts['k'] = this.initialUtterance;
            }
            return InJs.Utility.urlCombine(output, InJs.QueryStringUtil.rebuildQueryString(queryParts));
        };
        SharePointOnlineConnectionGroup.prototype.initializeUI = function (navBarResult) {
            var _this = this;
            var powerBIUrl = SharePointOnlineConnectionGroup.getPowerBIUrl(this._spHostUrl, siteLanguage, siteCulture);
            // CloudUX must be loaded for the following code to work
            var options = {};
            options.parentSiteTitle = InJs.Strings.powerBIChromeBrandingText;
            options.spSiteUrl = this._spHostUrl;
            options.disableTheming = true;
            options.settingsLinks = [];
            // Add the Add Samples link
            var samplesPageLink = {};
            samplesPageLink.displayName = InJs.Strings.sharePointAppAddSamplesLinkLabel;
            samplesPageLink.onClick = function () {
                _this.showSamplesDialog();
            };
            options.settingsLinks[0] = samplesPageLink;
            options.appHelpPageUrl = SharePointOnlineConnectionGroup._helpPageUrl;
            options.openLinksInNewWindow = true;
            options.onCssLoadError = function () {
                _this.modalDialogService.showError(InJs.Strings.fatalErrorDialogText, 3 /* Error */);
            };
            var spNavigation = new CloudUX.AppChrome(options, navBarResult);
            var appIconElem = $(SharePointOnlineConnectionGroup._appIconSelector);
            appIconElem.addClass(SharePointOnlineConnectionGroup._spAppIconClass);
            $('#backToParentSiteNavBtn').attr(InJs.DOMConstants.titleAttribute, InJs.Strings.backToBISiteLinkText);
            $('#backToParentSiteNavBtn').attr(InJs.DOMConstants.hrefAttribute, powerBIUrl);
            $("#appActions").delay(500).fadeIn();
        };
        SharePointOnlineConnectionGroup.prototype.showSamplesDialog = function () {
            var _this = this;
            if (this._infoNavModelMap && !this._samplesDialogElem) {
                var siteId = null;
                var webId = null;
                var listId = null;
                for (var key in this._infoNavModelMap) {
                    var model = this._infoNavModelMap[key];
                    siteId = model.SharePointDocument.WebProperties.SiteId;
                    webId = model.SharePointDocument.WebProperties.WebId;
                    listId = model.SharePointDocument.ListId;
                    break;
                }
                var samplesPageUrl = SharePointOnlineConnectionGroup._createSamplesPageUrl(siteId, webId, listId, siteLanguage, siteCulture, false);
                var samplesDialogHtml = SharePointOnlineConnectionGroup._samplesPageHtml.replace('{samplesPageUrl}', samplesPageUrl);
                this._samplesDialogElem = $(samplesDialogHtml);
                var samplesFrame = this._samplesDialogElem.find('iframe');
                samplesFrame.load(function () {
                    var initPayload = {};
                    initPayload.__command = SharePointOnlineConnectionGroup._samplesDialogInitializeAction;
                    initPayload.host = _this._spHostUrl;
                    initPayload.activityId = InJs.AppManager.current.activityId;
                    initPayload.contextToken = securityToken; // This is the page-provided SPO context token
                    initPayload.languageLocale = siteLanguage;
                    initPayload.regionalLocale = siteCulture;
                    samplesFrame.get(0).contentWindow.postMessage(JSON.stringify(initPayload), InJs.Utility.getDomainForUrl(window.location.href));
                });
                $('body').append(this._samplesDialogElem);
                this._samplesDialogElem.fadeIn(250);
            }
        };
        SharePointOnlineConnectionGroup.prototype.hideSamplesDialog = function () {
            var _this = this;
            if (this._samplesDialogElem) {
                this.invalidate();
                this._samplesDialogElem.fadeOut(250, function () {
                    _this._samplesDialogElem.remove();
                    _this._samplesDialogElem = null;
                });
            }
        };
        SharePointOnlineConnectionGroup.prototype.handleSamplesDialogMessage = function (event) {
            if (event.origin === InJs.Utility.getDomainForUrl(window.location.href)) {
                var messageData;
                if (event.data) {
                    try {
                        messageData = JSON.parse(event.data);
                    }
                    catch (e) {
                        // invalid message data
                        return;
                    }
                }
                if (messageData.action === SharePointOnlineConnectionGroup._samplesDialogCloseAction) {
                    // Close the dialog
                    this.hideSamplesDialog();
                }
            }
        };
        SharePointOnlineConnectionGroup.prototype.getDataSourceProperties = function (dbName) {
            var model = this.getInfoNavModel(dbName);
            if (model) {
                var properties = {};
                properties.name = model.Name;
                properties.url = SharePointOnlineConnectionGroup.getDocumentUrl(model);
                properties.lastModifiedTime = InJs.Utility.getDateFromWcfJsonString(model.SharePointDocumentProperties.LastModifiedTime, true);
                properties.lastModifiedBy = model.SharePointDocumentProperties.LastModifiedBy;
                properties.helpContentUrl = model.HelpContentUri;
                properties.sharePointDocument = model.SharePointDocument;
                return properties;
            }
            return null;
        };
        SharePointOnlineConnectionGroup.prototype.getFeaturedQuestions = function (dbName) {
            var featuredQuestionsForModel = null;
            var model = this.getInfoNavModel(dbName);
            if (this.featuredQuestions && model) {
                featuredQuestionsForModel = this.featuredQuestions.filter(function (featuredQuestion, featuredQuestionIndex, featuredQuestions) {
                    var workbookIdentifier = featuredQuestion.WorkbookIdentifier;
                    return workbookIdentifier.DocumentId === model.SharePointDocument.DocumentId && workbookIdentifier.ListId === model.SharePointDocument.ListId;
                });
            }
            return featuredQuestionsForModel;
        };
        SharePointOnlineConnectionGroup.prototype.getListOfDatabaseNames = function () {
            var modelNameList = [];
            for (var key in this._infoNavModelMap) {
                modelNameList.push(key);
            }
            return modelNameList;
        };
        /**
         * Return the url including /infonav/app
         *
         * Note that this should be protected; however because TypeScript does not have
         * a protected type and private makes it inaccessable, public must be used.
         */
        SharePointOnlineConnectionGroup.prototype.getInfoNavAppUrl = function () {
            var regexMatch = SharePointOnlineConnectionGroup._infoNavAppUrlTemplate.exec(window.location.href);
            if (regexMatch) {
                return regexMatch[1];
            }
            return null;
        };
        /**
         * Return the url /sharepointpages/SPIntegration/PowerBI/Pages/PowerBI.html?languageLocale={lang}&regionalLocale={region}&SPHostUrl={spHostUrl}&appWeb={appWeb}
         */
        SharePointOnlineConnectionGroup.getPowerBIUrl = function (spHostUrl, languagelocale, regionLocale) {
            return '/sharepointpages/SPIntegration/PowerBI/Pages/PowerBI.html' + '?languageLocale=' + languagelocale + '&regionalLocale=' + regionLocale + '&SPHostUrl=' + spHostUrl;
        };
        /**
         * Return the value of SP Host Url from the requested InfoNav Short URL.
         * An InfoNav Short URL follows the following syntax:
         *     https://<BI Azure Gateway URL>/infonav/app/<SPHost URL without https>[/?k=utterance]
         * For example: https://onebox.analysis.windows-int.net/infonav/app/bchildsdev.sharepoint.com
         */
        SharePointOnlineConnectionGroup.getSPHostUrlFromInfoNavShortUrl = function () {
            if (window.location.pathname.indexOf(SharePointOnlineConnectionGroup._infoNavAppPath) === 0) {
                return InJs.Utility.urlCombine(SharePointOnlineConnectionGroup._httpsProtocol + '://', window.location.pathname.substr(SharePointOnlineConnectionGroup._infoNavAppPathLength));
            }
            return null;
        };
        SharePointOnlineConnectionGroup.prototype._refreshMetadataInternal = function (parentActivity) {
            var _this = this;
            var getAppMetadataActivity = parentActivity ? parentActivity.createChildActivity(20 /* IAGM */) : this.telemetryService.createNewActivity(20 /* IAGM */);
            // In case the app metadata is cached from the BI Portal page let's use that right away and don't re-request
            var cachedAppMetadataResult = this.tryGetCachedAppMetadataResult();
            if (cachedAppMetadataResult) {
                // Clear the cached result so that it isn't reused if we need to refresh app metadata
                // or if the user refreshes their browser
                this._sessionAppCache.reset();
                this.handleSuccessfulAppMetadataResult(cachedAppMetadataResult, getAppMetadataActivity);
                return getAppMetadataActivity;
            }
            // should app metadata be taking a while to load, show the user a notification
            this._appMetadataLoadingNotificationTimeoutId = window.setTimeout(function () {
                _this.showAppMetadataLoadingNotification();
            }, SharePointOnlineConnectionGroup._appMetadataNotificationTimeoutMs);
            this._getAppMetadataInternal(this._spHostUrl, getAppMetadataActivity, function (appMetadataResult) {
                _this.handleSuccessfulAppMetadataResult(appMetadataResult, getAppMetadataActivity);
            }, function (request) {
                _this.hideAppMetadataLoadingNotification();
                var errorType = InJs.HttpUtility.getErrorInfo(request);
                if (request.status === 400 /* BadRequest */ && errorType === SharePointOnlineConnectionGroup._infoNavUserDoesNotHaveLicenseException) {
                    _this._showNoLicensePage();
                    getAppMetadataActivity.end(2 /* SuccessDespiteError */, InJs.ActivityErrors.NoLicense);
                    return;
                }
                var errorMsg = InJs.Strings.sharePointAppLoadModelsErrorText;
                if (request.status === 403 /* Forbidden */ || request.status === 401 /* Unauthorized */) {
                    errorMsg = InJs.Strings.notAuthenticatedErrorMessage;
                    getAppMetadataActivity.end(2 /* SuccessDespiteError */, InJs.ActivityErrors.NotAuthenticated);
                }
                else {
                    InJs.ClientActivity.addErrorInfoIfPresent(getAppMetadataActivity, request);
                    getAppMetadataActivity.end(3 /* Error */, InJs.ActivityErrors.UnknownError);
                }
                _this.modalDialogService.showError(errorMsg, 6 /* Fatal */, request);
            });
            return getAppMetadataActivity;
        };
        SharePointOnlineConnectionGroup.prototype.tryGetCachedAppMetadataResult = function () {
            var cachedAppMetadataResult = this._sessionAppCache.getData();
            // Session storage always returns an object so verify that at least 
            // the DatabaseAccessToken is present
            if (cachedAppMetadataResult && cachedAppMetadataResult.DatabaseAccessToken)
                return cachedAppMetadataResult;
            return null;
        };
        SharePointOnlineConnectionGroup.prototype.handleSuccessfulAppMetadataResult = function (appMetadataResult, getAppMetadataActivity) {
            this.initializeAppMetadata(appMetadataResult);
            this.hideAppMetadataLoadingNotification();
            var shouldRaiseReady = this.initializeAppHost();
            if (shouldRaiseReady)
                this._raiseReadyEventInternal();
            getAppMetadataActivity.end(1 /* Success */);
        };
        SharePointOnlineConnectionGroup.prototype.initializeAppMetadata = function (appMetadataResult) {
            this._securityToken = appMetadataResult.DatabaseAccessToken;
            this._managementSecurityToken = appMetadataResult.ManagementAccessToken;
            this._spBiCenterAppProductId = appMetadataResult.BICenterAppProductId;
            this._globalServiceClusterUrl = appMetadataResult.GlobalServiceClusterUrl;
            this._generalHelpPageUrl = appMetadataResult.GeneralHelpPageUrl;
            if (appMetadataResult.InfoNavModelMap) {
                this._infoNavModelMap = InJs.Utility.convertWcfToJsDictionary(appMetadataResult.InfoNavModelMap);
                for (var key in this._infoNavModelMap) {
                    var model = this._infoNavModelMap[key];
                    this._spSiteId = model.SharePointDocument.WebProperties.SiteId;
                    this._spWebId = model.SharePointDocument.WebProperties.WebId;
                    break;
                }
                this._featuredQuestionsService = new InJs.FeaturedQuestionsService(this.bridge, this, this.appCache, this._spSiteId, this._spWebId);
            }
            this._userPermissions = appMetadataResult.WebPermissions;
            this._isRuntimeModelingEnabled = appMetadataResult.IsRuntimeModelingEnabled;
            this._isSamplesOnlyEnabled = appMetadataResult.IsSamplesOnlyEnabled;
            this._isSampleUpgradeAvailable = appMetadataResult.IsSampleUpgradeAvailable;
            this._spHostTitle = appMetadataResult.SPWebTitle;
            this._isGeocodingEnabled = appMetadataResult.IsGeocodeResultsEnabled;
            this._isUsageReportingEnabled = appMetadataResult.IsUsageReportingEnabled;
            var currentData = this._appCache.getData();
            currentData.spWebTitle = appMetadataResult.SPWebTitle;
            currentData.featuredQuestions = appMetadataResult.FeaturedQuestions;
            currentData.isSamplesOnlyEnabled = appMetadataResult.IsSamplesOnlyEnabled;
            currentData.generalHelpPageUrl = appMetadataResult.GeneralHelpPageUrl;
            this._appCache.updateData(currentData);
            this.getO365NavBar(appMetadataResult);
        };
        /** Initializes the app host and decides whether we should issue ready event */
        SharePointOnlineConnectionGroup.prototype.initializeAppHost = function () {
            var _this = this;
            if (this._uiInitializationDeferred) {
                if (!InJs.StringExtensions.isNullOrEmpty(this.initialUtterance)) {
                    window.location.hash = encodeURIComponent(this.initialUtterance);
                }
            }
            // Do not raise the ready event if we have a null/blank token or if a sample upgrade is available in samples only mode
            if (InJs.StringExtensions.isNullOrEmpty(this.getSecurityToken()) || this._isSampleUpgradeAvailable) {
                var promptActions = [
                    new InJs.ModalDialogAction(InJs.Strings.dialogGoBackActionLabel, function (sender, dialogContent) {
                        window.location.href = SharePointOnlineConnectionGroup.getPowerBIUrl(_this._spHostUrl, siteLanguage, siteCulture);
                    })
                ];
                if (this._isSamplesOnlyEnabled) {
                    this.modalDialogService.showPrompt(InJs.Strings.sharePointAppNoSamplesTitle, InJs.Strings.sharePointAppNoSamplesMessage, promptActions, false);
                }
                else if (this._isSampleUpgradeAvailable) {
                    promptActions[1] = new InJs.ModalDialogAction(InJs.Strings.dialogCloseActionLabel, function (sender, dialogContent) {
                        _this.modalDialogService.hideDialog();
                        _this._raiseReadyEventInternal();
                    });
                    this.modalDialogService.showPrompt(InJs.Strings.sharePointAppNoSamplesTitle, InJs.Strings.sharePointAppNoSamplesMessage, promptActions, false);
                }
                else {
                    this.modalDialogService.showPrompt(InJs.Strings.sharePointAppNoModelsConfiguredTitle, InJs.Strings.sharePointAppNoModelsConfiguredMessage, promptActions, false);
                }
                return false;
            }
            else {
                return true;
            }
        };
        // Display No license page within an iframe
        SharePointOnlineConnectionGroup.prototype._showNoLicensePage = function () {
            var noLicensePageHtml = SharePointOnlineConnectionGroup._licensePageHtml.replace('{licensePageUrl}', this.noLicensePageUrl);
            $('body').append($(noLicensePageHtml));
        };
        Object.defineProperty(SharePointOnlineConnectionGroup.prototype, "noLicensePageUrl", {
            get: function () {
                if (!this._noLicensePageUrl) {
                    this._noLicensePageUrl = '/sharepointpages/SPIntegration/License/Pages/LicensePage.html?languageLocale=' + siteLanguage + '&regionalLocale=' + siteCulture;
                }
                return this._noLicensePageUrl;
            },
            set: function (value) {
                this._noLicensePageUrl = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SharePointOnlineConnectionGroup.prototype, "appCache", {
            get: function () {
                return this._appCache;
            },
            enumerable: true,
            configurable: true
        });
        SharePointOnlineConnectionGroup.prototype.showAppMetadataLoadingNotification = function () {
            if (!this._isLoadingAppMetadataNotificationDisplayed) {
                var dialogContent = InJs.Strings.workbooksLoadingTimeoutText;
                this.notificationService.showNotification(SharePointOnlineConnectionGroup.AppMetadataLoadingNotificationId, InJs.Strings.workbooksLoadingTimeoutTitle, dialogContent, null, false, 0, 1 /* Loading */);
                this._isLoadingAppMetadataNotificationDisplayed = true;
            }
        };
        SharePointOnlineConnectionGroup.prototype.hideAppMetadataLoadingNotification = function () {
            window.clearTimeout(this._appMetadataLoadingNotificationTimeoutId);
            if (this._isLoadingAppMetadataNotificationDisplayed) {
                this.notificationService.hideNotification(SharePointOnlineConnectionGroup.AppMetadataLoadingNotificationId);
                this._isLoadingAppMetadataNotificationDisplayed = false;
            }
        };
        SharePointOnlineConnectionGroup.prototype._getAppMetadataInternal = function (spHostUrl, getAppMetadataActivity, onSuccess, onError) {
            var _this = this;
            var spoContextTokenHeader = this.getSpoContextToken();
            if (InJs.StringExtensions.isNullOrUndefinedOrWhiteSpaceString(spoContextTokenHeader)) {
                // we shouldn't issue this request if the sp context token is null
                // TODO: trace and display error
                return;
            }
            var options = {};
            options.type = InJs.Utility.HttpGetMethod;
            options.url = InJs.Utility.urlCombine(this.getClusterUri(), '/infonav/mgmt/appmetadata/?SPHostUrl=' + encodeURIComponent(spHostUrl));
            options.contentType = InJs.Utility.JsonContentType;
            var requestId = '';
            options.beforeSend = function (request) {
                InJs.HttpUtility.setCommonRequestHeaders(request);
                request.setRequestHeader(InJs.HttpUtility.HttpSpoContextTokenHeader, _this.getSpoContextToken());
                request.setRequestHeader(InJs.Utility.HttpAcceptHeader, InJs.Utility.JsonContentType);
                requestId = request.requestId;
                InJs.Tracing.verbose('Requesting app metadata from server...', requestId);
                getAppMetadataActivity.addCorrelatedProperty(new InJs.CorrelatedProperty('metadataRequestId', requestId));
            };
            options.success = function (metadataResult, textStatus, request) {
                onSuccess(metadataResult);
                InJs.Tracing.verbose('Successfully retrieved app metadata from server.', requestId);
            };
            options.error = function (request, textStatus, error) {
                onError(request);
                InJs.Tracing.error('Failed to retrieve app metadata from server', requestId);
            };
            $.ajax(options);
        };
        SharePointOnlineConnectionGroup.prototype.getO365NavBar = function (appMetaData) {
            var _this = this;
            var targetCluster = appMetaData.GlobalServiceClusterUrl;
            var puid = appMetaData.Puid;
            var userPrincipalName = "";
            // login name example: i:0#.f|membership|membername@tenant.com
            var userLoginNameParts = [];
            if (appMetaData.LoginName) {
                userLoginNameParts = appMetaData.LoginName.split("|");
            }
            else {
                this.initializeUI(null);
                return;
            }
            if (userLoginNameParts.length == 3) {
                userPrincipalName = userLoginNameParts[2];
                debug.assert(!InJs.StringExtensions.isNullOrUndefinedOrWhiteSpaceString(userPrincipalName), "userPrincipalName cannot be empty");
            }
            var options = {};
            var params = [puid, userPrincipalName, 'settings', 'en-US'];
            options.type = InJs.Utility.HttpGetMethod;
            options.url = InJs.Utility.urlCombine(targetCluster, '/infonav/mgmt/o365navbar/' + params.join('/'));
            options.contentType = InJs.Utility.JsonContentType;
            var requestId = '';
            options.beforeSend = function (request) {
                InJs.HttpUtility.setCommonRequestHeaders(request);
                request.setRequestHeader(InJs.HttpUtility.HttpSpoContextTokenHeader, _this.getSpoContextToken());
                request.setRequestHeader(InJs.Utility.HttpAcceptHeader, InJs.Utility.JsonContentType);
                requestId = request.requestId;
                InJs.Tracing.verbose('Requesting O365 Nav Bar from server...', requestId);
            };
            options.success = function (result) {
                _this.loadUIElements(result);
                InJs.Tracing.verbose('Successfully retrieved the Nav Bar metadata.', requestId);
            };
            options.error = function () {
                _this.loadUIElements(null);
                InJs.Tracing.verbose('Failed to retrieved the Nav Bar metadata. Will use fallback UI instead', requestId);
            };
            $.ajax(options);
        };
        SharePointOnlineConnectionGroup.prototype.loadUIElements = function (navBarResult) {
            if (this.uiInitializedOnce)
                return;
            this.uiInitializedOnce = true;
            this.initializeUI(navBarResult);
            var shortUrl = this.createInfoNavShortUrl();
            if (window.history.replaceState) {
                window.history.replaceState({}, document.title, shortUrl);
            }
            else if (window.location.href !== shortUrl) {
                window.location.replace(shortUrl);
            }
        };
        SharePointOnlineConnectionGroup._sharepointSiteUrlParamName = 'SPHostUrl';
        SharePointOnlineConnectionGroup._sharepointSiteTitleParamName = 'SPHostTitle';
        SharePointOnlineConnectionGroup._helpPageUrl = 'http://go.microsoft.com/fwlink/?LinkId=286787';
        // SharePoint App constants
        SharePointOnlineConnectionGroup._infoNavAppPath = '/infonav/app/';
        SharePointOnlineConnectionGroup._infoNavAppPathLength = SharePointOnlineConnectionGroup._infoNavAppPath.length;
        SharePointOnlineConnectionGroup._cloudUXJsUrl = '/infonav/app/resources/CloudUX.min.js';
        SharePointOnlineConnectionGroup._spParentSiteIconUrl = '/sharepointpages/SPIntegration/PowerBI/Style/Images/Icon_PowerBI.png';
        // SharePoint CSS Classes - Used to be consistent with sharepoint theming
        SharePointOnlineConnectionGroup._spAppIconClass = 'spAppIcon';
        // The following are the places/elements from which we will attempt to retrieve a background color for the page
        SharePointOnlineConnectionGroup._contentLayoutCssClass = 'ms-pub-contentLayout';
        SharePointOnlineConnectionGroup._workspaceElementId = 's4-workspace';
        SharePointOnlineConnectionGroup._bodySelector = 'body';
        SharePointOnlineConnectionGroup._appIconSelector = '#appIcon';
        SharePointOnlineConnectionGroup._mainLayoutSelector = '#layoutMain';
        SharePointOnlineConnectionGroup._httpsProtocol = 'https';
        SharePointOnlineConnectionGroup._infoNavAppUrlTemplate = new RegExp('(.*\\/infonav\\/app\\/)');
        SharePointOnlineConnectionGroup.AppMetadataLoadingNotificationId = '1dd69400-83b3-45a4-8ac0-6aececf521a0';
        SharePointOnlineConnectionGroup._samplesPageHtml = "<div id ='publishSamplesModalContainer'>" + "<iframe id='publishSamplesFrame' src='{samplesPageUrl}'></iframe>" + "</div> ";
        SharePointOnlineConnectionGroup._licensePageHtml = '<div id="noLicenseContainer">' + '<iframe id="licensePageIFrame" class="noLicenseIFrame" src="{licensePageUrl}"/>' + '</div>';
        SharePointOnlineConnectionGroup._samplesDialogCloseAction = "SamplesDialogClose";
        SharePointOnlineConnectionGroup._samplesDialogInitializeAction = "initialize";
        SharePointOnlineConnectionGroup._infoNavUserDoesNotHaveLicenseException = 'InfoNavUserDoesNotHaveLicenseException';
        SharePointOnlineConnectionGroup._appMetadataNotificationTimeoutMs = 3000;
        return SharePointOnlineConnectionGroup;
    })(InJs.CloudConnectionGroup);
    InJs.SharePointOnlineConnectionGroup = SharePointOnlineConnectionGroup;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var ActivityErrors;
    (function (ActivityErrors) {
        // Generic
        ActivityErrors.ParentActivityEnded = 'Parent activity was ended before ending the child activity';
        ActivityErrors.UnknownError = 'Unknown error';
        // Initialization
        ActivityErrors.NoLicense = 'User does not have license';
        ActivityErrors.NotAuthenticated = 'User is not authenticated';
        // Interpret
        ActivityErrors.EmptyInterpretResult = 'Empty interpret result';
        ActivityErrors.InterpretError = 'Interpret error';
        ActivityErrors.LinguisticSchemaStillLoading = 'Linguistic schema still loading';
        ActivityErrors.RenderingSkippedOnClient = 'Newer visual is already being displayed so skipping rendering.';
        ActivityErrors.UserAborted = 'Interpret in-progress was aborted by a newer request';
        ActivityErrors.UtteranceTooShort = 'Utterance is too short';
        ActivityErrors.UsingCachedAutocompleteMatchOnInterpretError = 'Using cached result with compatible autocomplete on interpret error';
        ActivityErrors.SkippedRenderingSinceVisualIsUpToDate = 'Using previous visual since the server did not respond with a change.';
        ActivityErrors.InterpretSuccessfulButContainsQueryError = 'Interpret produced a query which resulted in an error.\nError code: {0}.\nMessage: {1}';
        // PowerView
        ActivityErrors.NewVisualizationRequestDelayingPrevious = 'New visualization request while delaying current';
        ActivityErrors.NewVisualizationRequestWhileWaitingForPowerViewReady = 'New visualization request while waiting for PowerView ready event';
        ActivityErrors.UnexpectedVisualizationActivityEnd = 'The visualization activity ended in an unexpected way';
    })(ActivityErrors = InJs.ActivityErrors || (InJs.ActivityErrors = {}));
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** Client telemetry event args for parameter-less user actions */
    var UserActionEventArgs = (function () {
        function UserActionEventArgs(userAction) {
            InJs.Utility.throwIfNullOrUndefined(userAction, 'UserActionEventArgs', 'ctor', 'userAction');
            this._userAction = userAction;
        }
        UserActionEventArgs.prototype.getRequestParams = function () {
            return [
                {
                    key: 'sourceType',
                    value: InJs.TelemetryService.SourceType,
                },
                {
                    key: 'userActionType',
                    value: InJs.UserAction[this._userAction],
                },
            ];
        };
        return UserActionEventArgs;
    })();
    InJs.UserActionEventArgs = UserActionEventArgs;
    /** Client telementry event args when visualizing an interpret result */
    var VisualizedInterpretResultEventArgs = (function () {
        function VisualizedInterpretResultEventArgs(visualizationType) {
            InJs.Utility.throwIfNullOrUndefined(visualizationType, 'VisualizedInterpretResultEventArgs', 'ctor', 'visualizationType');
            this._visualizationType = visualizationType;
        }
        VisualizedInterpretResultEventArgs.prototype.getRequestParams = function () {
            return [
                {
                    key: 'visualizationType',
                    value: VisualizationType[this._visualizationType],
                },
            ];
        };
        return VisualizedInterpretResultEventArgs;
    })();
    InJs.VisualizedInterpretResultEventArgs = VisualizedInterpretResultEventArgs;
    /** Client telementry event args for user explicitly changing the visualization type */
    var UserChangedVisualizationTypeEventArgs = (function () {
        function UserChangedVisualizationTypeEventArgs(originalVisualization, targetVisualization) {
            InJs.Utility.throwIfNullOrUndefined(originalVisualization, 'UserChangedVisualizationTypeEventArgs', 'ctor', 'originalVisualization');
            InJs.Utility.throwIfNullOrUndefined(targetVisualization, 'UserChangedVisualizationTypeEventArgs', 'ctor', 'targetVisualization');
            this._originalVisualization = originalVisualization;
            this._targetVisualization = targetVisualization;
        }
        UserChangedVisualizationTypeEventArgs.prototype.getRequestParams = function () {
            return [
                {
                    key: 'originalVisualization',
                    value: VisualizationType[this._originalVisualization],
                },
                {
                    key: 'targetVisualization',
                    value: VisualizationType[this._targetVisualization],
                },
            ];
        };
        return UserChangedVisualizationTypeEventArgs;
    })();
    InJs.UserChangedVisualizationTypeEventArgs = UserChangedVisualizationTypeEventArgs;
    /** Client telementry event args for user explicitly changing the visualization type */
    var UserChangedModelEventArgs = (function () {
        function UserChangedModelEventArgs(originalWorkbookId, targetWorkbookId) {
            InJs.Utility.throwIfNullOrUndefined(originalWorkbookId, 'UserChangedModelEventArgs', 'ctor', 'originalWorkbookId');
            InJs.Utility.throwIfNullOrUndefined(targetWorkbookId, 'UserChangedModelEventArgs', 'ctor', 'targetWorkbookId');
            this._originalWorkbookId = originalWorkbookId;
            this._targetWorkbookId = targetWorkbookId;
        }
        UserChangedModelEventArgs.prototype.getRequestParams = function () {
            return [
                {
                    key: 'originalWorkbookId',
                    value: this._originalWorkbookId,
                },
                {
                    key: 'targetWorkbookId',
                    value: this._targetWorkbookId,
                },
            ];
        };
        return UserChangedModelEventArgs;
    })();
    InJs.UserChangedModelEventArgs = UserChangedModelEventArgs;
    /** Client telementry event args for user getting a modal dialog error */
    var UserGotErrorEventArgs = (function () {
        function UserGotErrorEventArgs(errorType, errorText, requestId) {
            this._errorType = errorType;
            this._errorText = errorText;
            this._requestId = null;
            if (requestId) {
                this._requestId = requestId;
            }
        }
        UserGotErrorEventArgs.prototype.getRequestParams = function () {
            return [
                {
                    key: 'errorType',
                    value: this._errorType,
                },
                {
                    key: 'errorText',
                    value: this._errorText,
                },
                {
                    key: 'requestId',
                    value: this._requestId,
                },
            ];
        };
        return UserGotErrorEventArgs;
    })();
    InJs.UserGotErrorEventArgs = UserGotErrorEventArgs;
    /** Client telementry event args for user performing general phrasing editing in modeling. */
    var UserPhrasingEventArgs = (function () {
        function UserPhrasingEventArgs(phrasingId, phrasingType) {
            InJs.Utility.throwIfNullOrUndefined(phrasingId, 'UserAddedPhrasingEventArgs', 'ctor', 'phrasingId');
            InJs.Utility.throwIfNullOrUndefined(phrasingType, 'UserAddedPhrasingEventArgs', 'ctor', 'phrasingType');
            this._phrasingId = phrasingId;
            this._phrasingType = phrasingType;
        }
        UserPhrasingEventArgs.prototype.getRequestParams = function () {
            return [
                {
                    key: 'phrasingId',
                    value: this._phrasingId.toString(),
                },
                {
                    key: 'phrasingType',
                    value: this._phrasingType,
                },
            ];
        };
        return UserPhrasingEventArgs;
    })();
    InJs.UserPhrasingEventArgs = UserPhrasingEventArgs;
    /** Client telementry event args for user adding a new phrasing in modeling. */
    var UserPhrasingNewPhrasingEventArgs = (function (_super) {
        __extends(UserPhrasingNewPhrasingEventArgs, _super);
        function UserPhrasingNewPhrasingEventArgs(phrasingId, phrasingType, phrasingTemplate) {
            _super.call(this, phrasingId, phrasingType);
            this._phrasingTemplate = phrasingTemplate;
        }
        UserPhrasingNewPhrasingEventArgs.prototype.getRequestParams = function () {
            // Get parameters from base class and then add parameters for new phrasings
            var params = _super.prototype.getRequestParams.call(this);
            params.push({
                key: 'phrasingTemplate',
                value: this._phrasingTemplate,
            });
            return params;
        };
        return UserPhrasingNewPhrasingEventArgs;
    })(UserPhrasingEventArgs);
    InJs.UserPhrasingNewPhrasingEventArgs = UserPhrasingNewPhrasingEventArgs;
    /** Client telementry event args for user performing updates to phrases in modeling. */
    var UserPhrasingSimpleUpdateEventArgs = (function (_super) {
        __extends(UserPhrasingSimpleUpdateEventArgs, _super);
        function UserPhrasingSimpleUpdateEventArgs(phrasingId, phrasingType, updateSuccessful) {
            _super.call(this, phrasingId, phrasingType);
            this._updateSuccessful = updateSuccessful;
        }
        UserPhrasingSimpleUpdateEventArgs.prototype.getRequestParams = function () {
            // Get parameters from base class and then add parameter for whether or not the update succeeded
            var params = _super.prototype.getRequestParams.call(this);
            params.push({
                key: 'updateSuccessful',
                value: this._updateSuccessful.toString(),
            });
            return params;
        };
        return UserPhrasingSimpleUpdateEventArgs;
    })(UserPhrasingEventArgs);
    InJs.UserPhrasingSimpleUpdateEventArgs = UserPhrasingSimpleUpdateEventArgs;
    (function (UserSynonymsTargetType) {
        UserSynonymsTargetType[UserSynonymsTargetType["Table"] = 0] = "Table";
        UserSynonymsTargetType[UserSynonymsTargetType["Column"] = 1] = "Column";
    })(InJs.UserSynonymsTargetType || (InJs.UserSynonymsTargetType = {}));
    var UserSynonymsTargetType = InJs.UserSynonymsTargetType;
    /** Client telementry event args for user performing updates to synonyms for a table or column. */
    var UserSynonymsTableOrColumnUpdateEventArgs = (function () {
        function UserSynonymsTableOrColumnUpdateEventArgs(targetType, oldSynonymCount, newSynonymCount) {
            this._targetType = targetType;
            this._oldSynonymCount = oldSynonymCount;
            this._newSynonymCount = newSynonymCount;
        }
        UserSynonymsTableOrColumnUpdateEventArgs.prototype.getRequestParams = function () {
            return [
                {
                    key: 'targetType',
                    value: UserSynonymsTableOrColumnUpdateEventArgs.targetTypeToString(this._targetType),
                },
                {
                    key: 'oldSynonymCount',
                    value: this._oldSynonymCount,
                },
                {
                    key: 'newSynonymCount',
                    value: this._newSynonymCount,
                },
            ];
        };
        UserSynonymsTableOrColumnUpdateEventArgs.targetTypeToString = function (targetType) {
            switch (targetType) {
                case 0 /* Table */:
                    return "Table";
                case 1 /* Column */:
                    return "Column";
                default:
                    debug.assertFail("Unknown UserSynonymsTargetType");
                    break;
            }
            return "Unknown";
        };
        return UserSynonymsTableOrColumnUpdateEventArgs;
    })();
    InJs.UserSynonymsTableOrColumnUpdateEventArgs = UserSynonymsTableOrColumnUpdateEventArgs;
    (function (UserPhrasingRoleUpdateType) {
        UserPhrasingRoleUpdateType[UserPhrasingRoleUpdateType["Subject"] = 0] = "Subject";
        UserPhrasingRoleUpdateType[UserPhrasingRoleUpdateType["Object"] = 1] = "Object";
        UserPhrasingRoleUpdateType[UserPhrasingRoleUpdateType["IndirectObject"] = 2] = "IndirectObject";
        UserPhrasingRoleUpdateType[UserPhrasingRoleUpdateType["Name"] = 3] = "Name";
        UserPhrasingRoleUpdateType[UserPhrasingRoleUpdateType["DynamicNoun"] = 4] = "DynamicNoun";
        UserPhrasingRoleUpdateType[UserPhrasingRoleUpdateType["DynamicAdjective"] = 5] = "DynamicAdjective";
        UserPhrasingRoleUpdateType[UserPhrasingRoleUpdateType["Measure"] = 6] = "Measure";
    })(InJs.UserPhrasingRoleUpdateType || (InJs.UserPhrasingRoleUpdateType = {}));
    var UserPhrasingRoleUpdateType = InJs.UserPhrasingRoleUpdateType;
    /** Client telementry event args for user performing updates in roles for phrases in modeling. */
    var UserPhrasingRoleUpdateEventArgs = (function (_super) {
        __extends(UserPhrasingRoleUpdateEventArgs, _super);
        function UserPhrasingRoleUpdateEventArgs(phrasingId, phrasingType, updateSuccessful, roleType) {
            _super.call(this, phrasingId, phrasingType, updateSuccessful);
            this._roleType = roleType;
        }
        UserPhrasingRoleUpdateEventArgs.prototype.getRequestParams = function () {
            // Get parameters from base class and then add parameter for the type of role that was updated
            var params = _super.prototype.getRequestParams.call(this);
            params.push({
                key: 'roleType',
                value: UserPhrasingRoleUpdateEventArgs.userPhrasingRoleTypeToString(this._roleType),
            });
            return params;
        };
        UserPhrasingRoleUpdateEventArgs.userPhrasingRoleTypeToString = function (roleType) {
            switch (roleType) {
                case 0 /* Subject */:
                    return "Subject";
                case 1 /* Object */:
                    return "Object";
                case 2 /* IndirectObject */:
                    return "IndirectObject";
                case 3 /* Name */:
                    return "Name";
                case 4 /* DynamicNoun */:
                    return "DynamicNoun";
                case 5 /* DynamicAdjective */:
                    return "DynamicAdjective";
                case 6 /* Measure */:
                    return "Measure";
                default:
                    debug.assertFail("Unknown UserPhrasingRoleUpdateType");
                    break;
            }
            return "Unknown";
        };
        return UserPhrasingRoleUpdateEventArgs;
    })(UserPhrasingSimpleUpdateEventArgs);
    InJs.UserPhrasingRoleUpdateEventArgs = UserPhrasingRoleUpdateEventArgs;
    (function (UserPhrasingActionType) {
        UserPhrasingActionType[UserPhrasingActionType["Add"] = 0] = "Add";
        UserPhrasingActionType[UserPhrasingActionType["Remove"] = 1] = "Remove";
        UserPhrasingActionType[UserPhrasingActionType["Update"] = 2] = "Update";
    })(InJs.UserPhrasingActionType || (InJs.UserPhrasingActionType = {}));
    var UserPhrasingActionType = InJs.UserPhrasingActionType;
    /** Client telementry event args for user performing updates with specific action types to phrases in modeling. */
    var UserPhrasingActionTypeUpdateEventArgs = (function (_super) {
        __extends(UserPhrasingActionTypeUpdateEventArgs, _super);
        function UserPhrasingActionTypeUpdateEventArgs(phrasingId, phrasingType, updateSuccessful, actionType) {
            _super.call(this, phrasingId, phrasingType, updateSuccessful);
            this._actionType = actionType;
        }
        UserPhrasingActionTypeUpdateEventArgs.prototype.getRequestParams = function () {
            // Get parameters from base class and then add parameter for action type
            var params = _super.prototype.getRequestParams.call(this);
            params.push({
                key: 'actionType',
                value: UserPhrasingActionTypeUpdateEventArgs.userPhrasingActionTypeToString(this._actionType),
            });
            return params;
        };
        UserPhrasingActionTypeUpdateEventArgs.userPhrasingActionTypeToString = function (actionType) {
            switch (actionType) {
                case 0 /* Add */:
                    return "Add";
                case 1 /* Remove */:
                    return "Remove";
                case 2 /* Update */:
                    return "Update";
                default:
                    debug.assertFail("Unknown UserPhrasingActionType");
                    break;
            }
            return "Unknown";
        };
        return UserPhrasingActionTypeUpdateEventArgs;
    })(UserPhrasingSimpleUpdateEventArgs);
    InJs.UserPhrasingActionTypeUpdateEventArgs = UserPhrasingActionTypeUpdateEventArgs;
    /** Client telementry event args for user saving changes in modeling. */
    var SaveEventArgs = (function () {
        function SaveEventArgs() {
        }
        SaveEventArgs.prototype.getRequestParams = function () {
            return [];
        };
        return SaveEventArgs;
    })();
    InJs.SaveEventArgs = SaveEventArgs;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var ClientActivity = (function () {
        function ClientActivity(telemetryService, activityType, parentActivity, reporting) {
            debug.assertValue(telemetryService, 'telemetryService');
            debug.assertValue(activityType, 'activityType');
            this._activityId = InJs.Utility.generateGuid();
            this._activityStartTime = (new Date()).getTime();
            this._activityType = activityType;
            this._childAddedCallbacks = new Array();
            this._childCompletedCallbacks = new Array();
            this._completed = false;
            this._completedCallbacks = new Array();
            ;
            this._contentProviderType = '';
            this._ownerType = 0 /* Unknown */;
            this._correlatedProperties = new Array();
            this._unreportedCorrelatedProperties = new Array();
            this._summaryReported = false;
            this._reporting = reporting;
            this._telemetryService = telemetryService;
            this._rootActivity = parentActivity ? parentActivity._rootActivity : this;
            this._parentActivity = parentActivity ? parentActivity : this;
            if (this._parentActivity !== this) {
                $(this._parentActivity).on(ClientActivity.ActivityEndedEventName, this, this.endOnParentEnded);
                this._parentActivity.raiseChildAdded(this);
            }
            InJs.Tracing.verbose('Activity started | ' + this.toString());
        }
        Object.defineProperty(ClientActivity.prototype, "activityEndResult", {
            // Properties
            get: function () {
                return this._activityEndResult;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClientActivity.prototype, "activityEndTime", {
            get: function () {
                return this._activityEndTime;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClientActivity.prototype, "activityId", {
            get: function () {
                return this._activityId;
            },
            set: function (value) {
                debug.assertValue(value, 'value');
                this._activityId = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClientActivity.prototype, "activityStartTime", {
            get: function () {
                return this._activityStartTime;
            },
            set: function (value) {
                debug.assertValue(value, 'value');
                this._activityStartTime = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClientActivity.prototype, "activityType", {
            get: function () {
                return this._activityType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClientActivity.prototype, "completed", {
            get: function () {
                return this._completed;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClientActivity.prototype, "correlatedProperties", {
            get: function () {
                return this._correlatedProperties;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClientActivity.prototype, "error", {
            get: function () {
                return this._error;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClientActivity.prototype, "parentActivityId", {
            get: function () {
                return this._parentActivity.activityId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClientActivity.prototype, "reporting", {
            get: function () {
                return this._reporting;
            },
            set: function (value) {
                debug.assertValue(value, 'value');
                this._reporting = value;
                this.reportIfReporting();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClientActivity.prototype, "rootActivityId", {
            get: function () {
                return this._rootActivity.activityId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ClientActivity.prototype, "contentProviderType", {
            get: function () {
                return this._contentProviderType;
            },
            set: function (value) {
                debug.assertValue(value, 'value');
                this._contentProviderType = value;
            },
            enumerable: true,
            configurable: true
        });
        // Activity lifetime and public helper methods
        ClientActivity.prototype.addCorrelatedProperties = function (correlatedProperties) {
            debug.assertValue(correlatedProperties, 'correlatedProperties');
            for (var i = 0, len = correlatedProperties.length; i < len; i++) {
                this.addCorrelatedPropertyInternal(correlatedProperties[i], i === len - 1);
            }
        };
        ClientActivity.prototype.addCorrelatedProperty = function (correlatedProperty) {
            this.addCorrelatedPropertyInternal(correlatedProperty, true);
        };
        // Add the owner type to the activity
        ClientActivity.prototype.addOwnerType = function (ownerType) {
            debug.assertValue(ownerType, 'ownerType');
            this._ownerType = ownerType;
        };
        ClientActivity.addErrorInfoIfPresent = function (clientActivity, request) {
            if (clientActivity && request) {
                if (request.status)
                    clientActivity.addCorrelatedProperty(new CorrelatedProperty('statusCode', request.status.toString()));
                clientActivity.addCorrelatedProperty(new CorrelatedProperty('errorType', InJs.HttpUtility.getErrorInfo(request)));
            }
        };
        ClientActivity.prototype.createChildActivity = function (activityType, reporting) {
            debug.assertValue(activityType, 'activityType');
            var newChildActivity = new ClientActivity(this._telemetryService, activityType, this, reporting);
            return newChildActivity;
        };
        ClientActivity.prototype.end = function (result, error, activityEndTime) {
            debug.assertValue(result, 'result');
            if (this.completed) {
                InJs.Tracing.error('Attempted to end already ended activity | ' + this.toString());
                return;
            }
            this._activityEndTime = activityEndTime ? activityEndTime : (new Date()).getTime();
            this._activityEndResult = result;
            this._completed = true;
            this._error = error;
            InJs.Tracing.verbose('Activity ended with ' + ActivityEndedWith[this._activityEndResult] + ' | ' + this.toString());
            $(this).trigger(ClientActivity.ActivityEndedEventName);
            this.reportIfReporting();
            for (var i = 0, len = this._completedCallbacks.length; i < len; i++) {
                this._completedCallbacks[i](this);
            }
            if (this._parentActivity !== this)
                this._parentActivity.raiseChildCompleted(this);
        };
        ClientActivity.getParentActivityIfAny = function (clientActivity) {
            if (!clientActivity || !clientActivity._parentActivity || clientActivity._parentActivity === clientActivity)
                return null;
            return clientActivity._parentActivity;
        };
        ClientActivity.prototype.getRequestParams = function () {
            var params = new Array();
            if (this.parentActivityId !== this.activityId) {
                params.push({ key: "parentActivityId", value: this.parentActivityId });
            }
            else {
                params.push({ key: "parentActivityId", value: "00000000-0000-0000-0000-000000000000" });
            }
            var stringifiedError = "";
            if (this.error) {
                if (InJs.Utility.isString(this.error)) {
                    stringifiedError = this.error;
                }
                else {
                    stringifiedError = JSON.stringify(this.error);
                }
                stringifiedError = stringifiedError.substring(0, ClientActivity.MaxErrorLength).replace('[', '<').replace(']', '>');
            }
            params.push({ key: "howEnded", value: this._activityEndResult });
            params.push({ key: "duration", value: this._activityEndTime - this._activityStartTime });
            params.push({ key: "err", value: stringifiedError });
            params.push({ key: "contentProviderType", value: this._contentProviderType });
            params.push({ key: "ownerType", value: this._ownerType });
            return params;
        };
        ClientActivity.prototype.hasCorrelatedProperty = function (propertyName) {
            debug.assertValue(propertyName, 'propertyName');
            for (var i = 0, len = this._correlatedProperties.length; i < len; i++) {
                if (this._correlatedProperties[i].propertyName === propertyName)
                    return true;
            }
            return false;
        };
        ClientActivity.prototype.isChildOf = function (clientActivity, direct) {
            debug.assertValue(clientActivity, 'clientActivity');
            if (this._parentActivity === this)
                return false;
            if (direct)
                return this._parentActivity === clientActivity;
            return this._parentActivity === clientActivity || this._parentActivity.isChildOf(clientActivity);
        };
        ClientActivity.prototype.onChildAdded = function (childAddedCallback) {
            debug.assertValue(childAddedCallback, 'childCompletedCallback');
            this._childAddedCallbacks.push(childAddedCallback);
            return this;
        };
        ClientActivity.prototype.onChildCompleted = function (childCompletedCallback) {
            debug.assertValue(childCompletedCallback, 'childCompletedCallback');
            this._childCompletedCallbacks.push(childCompletedCallback);
            return this;
        };
        ClientActivity.prototype.onCompleted = function (completedCallback) {
            debug.assertValue(completedCallback, 'completedCallback');
            if (!this.completed) {
                this._completedCallbacks.push(completedCallback);
                return this;
            }
            completedCallback(this);
            return this;
        };
        ClientActivity.prototype.toString = function () {
            return 'Name: ' + InJs.ActivityType[this.activityType] + ' | AID: ' + this.activityId + ' | RAID: ' + this._rootActivity.activityId;
        };
        // Private helpers
        ClientActivity.prototype.addCorrelatedPropertyInternal = function (correlatedProperty, fireImmediatelyIfCompleted) {
            debug.assertValue(correlatedProperty, 'correlatedProperty');
            this._correlatedProperties.push(correlatedProperty);
            this._unreportedCorrelatedProperties.push(correlatedProperty);
            // Correlated properties after the activity ends are logged immediately
            if (this.completed && fireImmediatelyIfCompleted)
                this.reportIfReporting();
        };
        ClientActivity.prototype.endOnParentEnded = function (e) {
            var self = e.data;
            if (self.completed)
                return;
            InJs.Tracing.error('Activity not ended even though parent has | ' + self.toString());
            self.end(0 /* Unknown */, InJs.ActivityErrors.ParentActivityEnded, self._parentActivity.activityEndTime);
        };
        ClientActivity.prototype.raiseChildAdded = function (childActivity) {
            debug.assertValue(childActivity, 'childActivity');
            for (var i = 0, len = this._childAddedCallbacks.length; i < len; i++) {
                this._childAddedCallbacks[i](childActivity);
            }
            if (this._parentActivity !== this)
                this._parentActivity.raiseChildAdded(childActivity);
        };
        ClientActivity.prototype.raiseChildCompleted = function (childActivity) {
            debug.assertValue(childActivity, 'childActivity');
            for (var i = 0, len = this._childCompletedCallbacks.length; i < len; i++) {
                this._childCompletedCallbacks[i](childActivity);
            }
            if (this._parentActivity !== this)
                this._parentActivity.raiseChildCompleted(childActivity);
        };
        ClientActivity.prototype.reportIfReporting = function () {
            if (this.completed && this.reporting) {
                this.sendCorrelatedPropertiesIfAny();
                this.sendActivityCompletionSummaryIfNotReported();
            }
        };
        ClientActivity.prototype.sendActivityCompletionSummaryIfNotReported = function () {
            if (!this._summaryReported)
                this._telemetryService.fireActivityCompletionSummary(this);
            this._summaryReported = true;
        };
        ClientActivity.prototype.sendCorrelatedPropertiesIfAny = function () {
            if (this._unreportedCorrelatedProperties.length) {
                this._telemetryService.notifyActivityCorrelationProperties(this, this._unreportedCorrelatedProperties);
                this._unreportedCorrelatedProperties = new Array();
            }
        };
        ClientActivity.ActivityEndedEventName = 'ActivityEnded';
        ClientActivity.MaxErrorLength = 256;
        return ClientActivity;
    })();
    InJs.ClientActivity = ClientActivity;
    var CorrelatedProperty = (function () {
        function CorrelatedProperty(propertyName, propertyValue) {
            debug.assertValue(propertyName, 'propertyName');
            this._propertyName = propertyName;
            this._propertyValue = propertyValue ? propertyValue : '';
        }
        Object.defineProperty(CorrelatedProperty.prototype, "propertyName", {
            get: function () {
                return this._propertyName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CorrelatedProperty.prototype, "propertyValue", {
            get: function () {
                return this._propertyValue;
            },
            enumerable: true,
            configurable: true
        });
        return CorrelatedProperty;
    })();
    InJs.CorrelatedProperty = CorrelatedProperty;
    /** Client telemetry event args for activity correlated properties */
    var CorrelatedPropertiesEventArgs = (function () {
        function CorrelatedPropertiesEventArgs(correlatedProperties) {
            debug.assertValue(correlatedProperties, 'correlatedProperties');
            for (var i = 0, len = correlatedProperties.length; i < len; i++) {
                var newEntry = correlatedProperties[i].propertyName + '=' + correlatedProperties[i].propertyValue;
                if (!this._propertyBag) {
                    this._propertyBag = newEntry;
                }
                else {
                    this._propertyBag += '|' + newEntry;
                }
            }
        }
        CorrelatedPropertiesEventArgs.prototype.getRequestParams = function () {
            return [
                {
                    key: 'propertyBag',
                    value: this._propertyBag,
                },
            ];
        };
        return CorrelatedPropertiesEventArgs;
    })();
    InJs.CorrelatedPropertiesEventArgs = CorrelatedPropertiesEventArgs;
    /* Owner types */
    (function (OwnerType) {
        OwnerType[OwnerType["Unknown"] = 0] = "Unknown";
        OwnerType[OwnerType["Owner"] = 1] = "Owner";
        OwnerType[OwnerType["Shared"] = 2] = "Shared";
    })(InJs.OwnerType || (InJs.OwnerType = {}));
    var OwnerType = InJs.OwnerType;
    (function (ActivityEndedWith) {
        /** Activity has not ended yet, or its completion status is unknown. */
        ActivityEndedWith[ActivityEndedWith["Unknown"] = 0] = "Unknown";
        /** Activity completed successfully. */
        ActivityEndedWith[ActivityEndedWith["Success"] = 1] = "Success";
        /** Activity completed successfully despite having an error returned as its result. */
        ActivityEndedWith[ActivityEndedWith["SuccessDespiteError"] = 2] = "SuccessDespiteError";
        /** Activity has completed with some error. */
        ActivityEndedWith[ActivityEndedWith["Error"] = 3] = "Error";
        /** Activity has completed with some error, outside the current monitoring scope. */
        ActivityEndedWith[ActivityEndedWith["RemoteError"] = 4] = "RemoteError";
    })(InJs.ActivityEndedWith || (InJs.ActivityEndedWith = {}));
    var ActivityEndedWith = InJs.ActivityEndedWith;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    // TODO - 1679589: Unify client telemetry code with BIPortal
    var TelemetryService = (function (_super) {
        __extends(TelemetryService, _super);
        function TelemetryService(bridge, configurationProvider) {
            _super.call(this, bridge, configurationProvider);
            this._unreportedTelemetryEvents = [];
            this._telemetryEventQueueTimerId = 0;
        }
        /** Event of visualizing an interpret result */
        TelemetryService.prototype.notifyVisualizedInterpretResult = function (activityType, parameters) {
            InJs.Utility.throwIfNotTrue(this.verifyActivityType(activityType, [9 /* IPVI */]), 'Telemetry', 'notifyVisualizedInterpretResult', 'activityType');
            InJs.Utility.throwIfNullOrUndefined(parameters, 'Telemetry', 'notifyUserChangedVisualizationType', 'parameters');
            this.fireTelemetryEvent(TelemetryService.EventIds[TelemetryService.NotifyVisualizedInterpretResult], TelemetryService.NotifyVisualizedInterpretResult, activityType, null, 2 /* Information */, parameters.getRequestParams());
        };
        /** Event of user explicitly changing the visualization type */
        TelemetryService.prototype.notifyUserChangedVisualizationType = function (activityType, parameters) {
            InJs.Utility.throwIfNotTrue(this.verifyActivityType(activityType, [13 /* IRCV */]), 'Telemetry', 'notifyUserChangedVisualizationType', 'activityType');
            InJs.Utility.throwIfNullOrUndefined(parameters, 'Telemetry', 'notifyUserChangedVisualizationType', 'parameters');
            this.fireTelemetryEvent(TelemetryService.EventIds[TelemetryService.NotifyUserChangedVisualizationType], TelemetryService.NotifyUserChangedVisualizationType, activityType, null, 2 /* Information */, parameters.getRequestParams());
        };
        /** Event of user explicitly changing the selected model */
        TelemetryService.prototype.notifyUserChangedModel = function (activityType, parameters) {
            InJs.Utility.throwIfNotTrue(this.verifyActivityType(activityType, [12 /* IRCM */]), 'Telemetry', 'notifyUserChangedModel', 'activityType');
            InJs.Utility.throwIfNullOrUndefined(parameters, 'Telemetry', 'notifyUserChangedModel', 'parameters');
            this.fireTelemetryEvent(TelemetryService.EventIds[TelemetryService.NotifyUserChangedModel], TelemetryService.NotifyUserChangedModel, activityType, null, 2 /* Information */, parameters.getRequestParams());
        };
        /** Event of user getting a modal dialog error */
        TelemetryService.prototype.notifyUserGotError = function (activityType, parameters) {
            InJs.Utility.throwIfNotTrue(this.verifyActivityType(activityType, [6 /* IMDE */, 1 /* IEDE */]), 'Telemetry', 'notifyUserGotError', 'activityType');
            InJs.Utility.throwIfNullOrUndefined(parameters, 'Telemetry', 'notifyUserGotError', 'parameters');
            this.fireTelemetryEvent(TelemetryService.EventIds[TelemetryService.NotifyUserGotError], TelemetryService.NotifyUserGotError, activityType, null, 2 /* Information */, parameters.getRequestParams());
        };
        /** Event of a user going back to the collage page from an answer page */
        TelemetryService.prototype.notifyUserDisplayedFeaturedQuestions = function (activityType) {
            InJs.Utility.throwIfNotTrue(this.verifyActivityType(activityType, [5 /* ILDF */, 3 /* IHDF */, 2 /* IEDF */]), 'Telemetry', 'notifyUserDisplayedFeaturedQuestions', 'activityType');
            this.fireTelemetryEvent(TelemetryService.EventIds[TelemetryService.NotifyNewUserAction], TelemetryService.NotifyNewUserAction, activityType, null, 2 /* Information */, new InJs.UserActionEventArgs(1 /* DisplayFeaturedQuestions */).getRequestParams());
        };
        /** Event of a user selecting a featured question */
        TelemetryService.prototype.notifyUserSelectedFeaturedQuestion = function (activityType) {
            InJs.Utility.throwIfNotTrue(this.verifyActivityType(activityType, [0 /* ICSF */, 4 /* IHSF */]), 'Telemetry', 'notifyUserSelectedFeaturedQuestion', 'activityType');
            this.fireTelemetryEvent(TelemetryService.EventIds[TelemetryService.NotifyNewUserAction], TelemetryService.NotifyNewUserAction, activityType, null, 2 /* Information */, new InJs.UserActionEventArgs(0 /* SelectFeaturedQuestion */).getRequestParams());
        };
        /** Event of user selecting the autocomplete */
        TelemetryService.prototype.notifyUserSelectedAutocomplete = function (activityType) {
            InJs.Utility.throwIfNotTrue(this.verifyActivityType(activityType, [10 /* IQSC */]), 'Telemetry', 'notifyUserSelectedAutocomplete', 'activityType');
            this.fireTelemetryEvent(TelemetryService.EventIds[TelemetryService.NotifyNewUserAction], TelemetryService.NotifyNewUserAction, activityType, null, 2 /* Information */, new InJs.UserActionEventArgs(2 /* SelectAutocomplete */).getRequestParams());
        };
        /** Event of user selecting a provided suggestion item */
        TelemetryService.prototype.notifyUserSelectedSuggestion = function (activityType) {
            InJs.Utility.throwIfNotTrue(this.verifyActivityType(activityType, [11 /* IQSS */]), 'Telemetry', 'notifyUserSelectedSuggestion', 'activityType');
            this.fireTelemetryEvent(TelemetryService.EventIds[TelemetryService.NotifyNewUserAction], TelemetryService.NotifyNewUserAction, activityType, null, 2 /* Information */, new InJs.UserActionEventArgs(3 /* SelectSuggestion */).getRequestParams());
        };
        /** Event of user opening the filter pane */
        TelemetryService.prototype.notifyUserOpenedFilterPane = function (activityType) {
            InJs.Utility.throwIfNotTrue(this.verifyActivityType(activityType, [7 /* IPOF */]), 'Telemetry', 'notifyUserOpenedFilterPane', 'activityType');
            this.fireTelemetryEvent(TelemetryService.EventIds[TelemetryService.NotifyNewUserAction], TelemetryService.NotifyNewUserAction, activityType, null, 2 /* Information */, new InJs.UserActionEventArgs(4 /* OpenFilterPane */).getRequestParams());
        };
        /** Event of user opening the field explorer */
        TelemetryService.prototype.notifyUserOpenedFieldExplorer = function (activityType) {
            InJs.Utility.throwIfNotTrue(this.verifyActivityType(activityType, [8 /* IPOX */]), 'Telemetry', 'notifyUserOpenedFieldExplorer', 'activityType');
            this.fireTelemetryEvent(TelemetryService.EventIds[TelemetryService.NotifyNewUserAction], TelemetryService.NotifyNewUserAction, activityType, null, 2 /* Information */, new InJs.UserActionEventArgs(5 /* OpenFieldExplorer */).getRequestParams());
        };
        /** Event of user adding a new phrasing in modeling */
        TelemetryService.prototype.notifyUserAddedPhrasing = function (activityType, parameters) {
            InJs.Utility.throwIfNotTrue(this.verifyActivityType(activityType, [14 /* IMUP */]), 'Telemetry', 'notifyUserAddedPhrasing', 'activityType');
            this.fireTelemetryEvent(TelemetryService.EventIds[TelemetryService.NotifyUserAddedPhrasing], TelemetryService.NotifyUserAddedPhrasing, activityType, null, 2 /* Information */, parameters.getRequestParams());
        };
        /** Event of user deleting a phrasing in modeling */
        TelemetryService.prototype.notifyUserRemovedPhrasing = function (activityType, parameters) {
            InJs.Utility.throwIfNotTrue(this.verifyActivityType(activityType, [14 /* IMUP */]), 'Telemetry', 'notifyUserRemovedPhrasing', 'activityType');
            this.fireTelemetryEvent(TelemetryService.EventIds[TelemetryService.NotifyUserRemovedPhrasing], TelemetryService.NotifyUserRemovedPhrasing, activityType, null, 2 /* Information */, parameters.getRequestParams());
        };
        /** Event of user changing the subject of a phrasing in modeling */
        TelemetryService.prototype.notifyUserChangedRole = function (activityType, parameters) {
            InJs.Utility.throwIfNotTrue(this.verifyActivityType(activityType, [14 /* IMUP */]), 'Telemetry', 'notifyUserChangedRole', 'activityType');
            this.fireTelemetryEvent(TelemetryService.EventIds[TelemetryService.NotifyUserChangedRole], TelemetryService.NotifyUserChangedRole, activityType, null, 2 /* Information */, parameters.getRequestParams());
        };
        /** Event of user changing a condition of a phrasing in modeling */
        TelemetryService.prototype.notifyUserChangedCondition = function (activityType, parameters) {
            InJs.Utility.throwIfNotTrue(this.verifyActivityType(activityType, [14 /* IMUP */]), 'Telemetry', 'notifyUserChangedCondition', 'activityType');
            this.fireTelemetryEvent(TelemetryService.EventIds[TelemetryService.NotifyUserChangedCondition], TelemetryService.NotifyUserChangedCondition, activityType, null, 2 /* Information */, parameters.getRequestParams());
        };
        /** Event of user changing a preposition phrasing in modeling */
        TelemetryService.prototype.notifyUserChangedPrepPhrase = function (activityType, parameters) {
            InJs.Utility.throwIfNotTrue(this.verifyActivityType(activityType, [14 /* IMUP */]), 'Telemetry', 'notifyUserChangedPrepPhrase', 'activityType');
            this.fireTelemetryEvent(TelemetryService.EventIds[TelemetryService.NotifyUserChangedPrepPhrase], TelemetryService.NotifyUserChangedPrepPhrase, activityType, null, 2 /* Information */, parameters.getRequestParams());
        };
        /** Event of user changing phrasing synonyms in modeling */
        TelemetryService.prototype.notifyUserChangedSynonyms = function (activityType, parameters) {
            InJs.Utility.throwIfNotTrue(this.verifyActivityType(activityType, [14 /* IMUP */]), 'Telemetry', 'notifyUserChangedSynonyms', 'activityType');
            this.fireTelemetryEvent(TelemetryService.EventIds[TelemetryService.NotifyUserChangedSynonyms], TelemetryService.NotifyUserChangedSynonyms, activityType, null, 2 /* Information */, parameters.getRequestParams());
        };
        /** Event of user changing phrasin antonyms in modeling */
        TelemetryService.prototype.notifyUserChangedAntonyms = function (activityType, parameters) {
            InJs.Utility.throwIfNotTrue(this.verifyActivityType(activityType, [14 /* IMUP */]), 'Telemetry', 'notifyUserChangedAntonyms', 'activityType');
            this.fireTelemetryEvent(TelemetryService.EventIds[TelemetryService.NotifyUserChangedAntonyms], TelemetryService.NotifyUserChangedAntonyms, activityType, null, 2 /* Information */, parameters.getRequestParams());
        };
        /** Event of user changing phrasin where in modeling */
        TelemetryService.prototype.notifyUserChangedWhere = function (activityType, parameters) {
            InJs.Utility.throwIfNotTrue(this.verifyActivityType(activityType, [14 /* IMUP */]), 'Telemetry', 'notifyUserChangedWhere', 'activityType');
            this.fireTelemetryEvent(TelemetryService.EventIds[TelemetryService.NotifyUserChangedWhere], TelemetryService.NotifyUserChangedWhere, activityType, null, 2 /* Information */, parameters.getRequestParams());
        };
        /** Event of user changing phrasin when in modeling */
        TelemetryService.prototype.notifyUserChangedWhen = function (activityType, parameters) {
            InJs.Utility.throwIfNotTrue(this.verifyActivityType(activityType, [14 /* IMUP */]), 'Telemetry', 'notifyUserChangedWhen', 'activityType');
            this.fireTelemetryEvent(TelemetryService.EventIds[TelemetryService.NotifyUserChangedWhen], TelemetryService.NotifyUserChangedWhen, activityType, null, 2 /* Information */, parameters.getRequestParams());
        };
        /** Event of user saving changes in modeling */
        TelemetryService.prototype.notifyUserSaved = function (activityType, parameters) {
            InJs.Utility.throwIfNotTrue(this.verifyActivityType(activityType, [14 /* IMUP */]), 'Telemetry', 'notifyUserSaved', 'activityType');
            this.fireTelemetryEvent(TelemetryService.EventIds[TelemetryService.NotifyUserSaved], TelemetryService.NotifyUserSaved, activityType, null, 2 /* Information */, parameters.getRequestParams());
        };
        /** Event of user changing tabs in the modeling pane */
        TelemetryService.prototype.notifyUserChangeModelingTab = function (activityType, actionType) {
            InJs.Utility.throwIfNotTrue(this.verifyActivityType(activityType, [14 /* IMUP */]), 'Telemetry', 'notifyUserChangedModelingTab', 'activityType');
            this.fireTelemetryEvent(TelemetryService.EventIds[TelemetryService.NotifyNewUserAction], TelemetryService.NotifyNewUserAction, activityType, null, 2 /* Information */, new InJs.UserActionEventArgs(actionType).getRequestParams());
        };
        /** Event of user changing report types in the Usage tab */
        TelemetryService.prototype.notifyUserUsageChangeReport = function (activityType, actionType) {
            InJs.Utility.throwIfNotTrue(this.verifyActivityType(activityType, [14 /* IMUP */]), 'Telemetry', 'notifyUserChangeUsageReport', 'activityType');
            this.fireTelemetryEvent(TelemetryService.EventIds[TelemetryService.NotifyNewUserAction], TelemetryService.NotifyNewUserAction, activityType, null, 2 /* Information */, new InJs.UserActionEventArgs(actionType).getRequestParams());
        };
        /** Event of user toggling the setting for whether or not to include all models in the Usage tab */
        TelemetryService.prototype.notifyUserUsageIncludeModels = function (activityType, actionType) {
            InJs.Utility.throwIfNotTrue(this.verifyActivityType(activityType, [14 /* IMUP */]), 'Telemetry', 'notifyUserUsageIncludeModels', 'activityType');
            this.fireTelemetryEvent(TelemetryService.EventIds[TelemetryService.NotifyNewUserAction], TelemetryService.NotifyNewUserAction, activityType, null, 2 /* Information */, new InJs.UserActionEventArgs(actionType).getRequestParams());
        };
        /** Event of user clicking 'show more' to show more utterances in the Usage tab */
        TelemetryService.prototype.notifyUserUsageShowMore = function (activityType, actionType) {
            InJs.Utility.throwIfNotTrue(this.verifyActivityType(activityType, [14 /* IMUP */]), 'Telemetry', 'notifyUserUsageShowMore', 'activityType');
            this.fireTelemetryEvent(TelemetryService.EventIds[TelemetryService.NotifyNewUserAction], TelemetryService.NotifyNewUserAction, activityType, null, 2 /* Information */, new InJs.UserActionEventArgs(actionType).getRequestParams());
        };
        /** Event of user clicking an utterance in the Usage tab */
        TelemetryService.prototype.notifyUserUsageClickUtterance = function (activityType, actionType) {
            InJs.Utility.throwIfNotTrue(this.verifyActivityType(activityType, [14 /* IMUP */]), 'Telemetry', 'notifyUserUsageClickUtterance', 'activityType');
            this.fireTelemetryEvent(TelemetryService.EventIds[TelemetryService.NotifyNewUserAction], TelemetryService.NotifyNewUserAction, activityType, null, 2 /* Information */, new InJs.UserActionEventArgs(actionType).getRequestParams());
        };
        /** Event of user changing table or column synonyms in modeling */
        TelemetryService.prototype.notifyUserSynonymsTableOrColumnUpdate = function (activityType, parameters) {
            InJs.Utility.throwIfNotTrue(this.verifyActivityType(activityType, [14 /* IMUP */]), 'Telemetry', 'notifyUserSynonymsTableOrColumnUpdate', 'activityType');
            this.fireTelemetryEvent(TelemetryService.EventIds[TelemetryService.NotifyUserChangedTableOrColumnSynonyms], TelemetryService.NotifyUserChangedTableOrColumnSynonyms, activityType, null, 2 /* Information */, parameters.getRequestParams());
        };
        /** Event of user copying the current result URL to the clipboard */
        TelemetryService.prototype.notifyUserCopyResultUrlToClipboard = function (activityType) {
            InJs.Utility.throwIfNotTrue(this.verifyActivityType(activityType, [15 /* ICRU */]), 'Telemetry', 'notifyUserCopyResultUrlToClipboard', 'activityType');
            this.fireTelemetryEvent(TelemetryService.EventIds[TelemetryService.NotifyNewUserAction], TelemetryService.NotifyNewUserAction, activityType, null, 2 /* Information */, new InJs.UserActionEventArgs(7 /* CopyResultUrlToClipboard */).getRequestParams());
        };
        /** Event of user sharing the current result URL via email */
        TelemetryService.prototype.notifyUserShareResultViaEmail = function (activityType) {
            InJs.Utility.throwIfNotTrue(this.verifyActivityType(activityType, [16 /* ISRE */]), 'Telemetry', 'notifyUserShareResultViaEmail', 'activityType');
            this.fireTelemetryEvent(TelemetryService.EventIds[TelemetryService.NotifyNewUserAction], TelemetryService.NotifyNewUserAction, activityType, null, 2 /* Information */, new InJs.UserActionEventArgs(6 /* ShareResultUrlViaEmail */).getRequestParams());
        };
        TelemetryService.prototype.createNewActivity = function (activityType, parentActivity, reporting) {
            var clientActivity = new InJs.ClientActivity(this, activityType, parentActivity, reporting);
            return clientActivity;
        };
        /** API for correlating events/properties to an activity */
        TelemetryService.prototype.notifyActivityCorrelationProperties = function (clientActivity, correlatedProperties) {
            this.fireTelemetryEvent(TelemetryService.EventIds[TelemetryService.NotifyActivityCorrelationDataEvent], TelemetryService.NotifyActivityCorrelationDataEvent, clientActivity.activityType, null, 2 /* Information */, new InJs.CorrelatedPropertiesEventArgs(correlatedProperties).getRequestParams(), clientActivity.activityId, clientActivity.rootActivityId, clientActivity.activityStartTime);
        };
        /** API for activity-based telemetry */
        TelemetryService.prototype.fireActivityCompletionSummary = function (clientActivity) {
            debug.assert(clientActivity.completed, 'clientActivity.completed');
            debug.assert(clientActivity.reporting, 'clientActivity.reporting');
            this.fireTelemetryEvent(TelemetryService.EventIds[TelemetryService.FireActivityCompletionSummaryEvent], TelemetryService.FireActivityCompletionSummaryEvent, clientActivity.activityType, null, 2 /* Information */, clientActivity.getRequestParams(), clientActivity.activityId, clientActivity.rootActivityId, clientActivity.activityStartTime);
        };
        /** Private helper for verifying activity types */
        TelemetryService.prototype.verifyActivityType = function (activityType, allowedActivityTypes) {
            InJs.Utility.throwIfNullOrUndefined(allowedActivityTypes, 'Telemetry', 'verifyActivityType', 'allowedActivityTypes');
            return ActivityType[activityType] && allowedActivityTypes.indexOf(activityType) >= 0;
        };
        /** Helper for firing client telemetry events */
        TelemetryService.prototype.fireTelemetryEvent = function (eventId, eventName, activityType, message, level, parameters, activityId, rootActivityId, eventTime) {
            // The server will reject the telemetry event if any properties are missing a value
            // TODO: Use _.every once lodash is available in BI Sites or BI Sites is retired
            debug.assert(parameters.every(function (parameter) {
                return parameter.value !== undefined;
            }), 'ClientTelemetryParameter values should not be undefined');
            activityId = activityId || InJs.AppManager.current.activityId;
            rootActivityId = rootActivityId || InJs.Utility.generateGuid();
            eventTime = eventTime || (new Date()).getTime();
            var telemetryRequestData = {
                aid: activityId,
                at: ActivityType[activityType],
                caid: InJs.AppManager.current.activityId,
                el: TelemetryService.SourceType,
                id: eventId,
                l: level.toString(),
                m: message,
                n: eventName,
                p: parameters,
                raid: rootActivityId,
                t: TelemetryService.DateEnvelopeStart + eventTime + TelemetryService.DateEnvelopeEnd,
            };
            this.queueTelemetryEvent(telemetryRequestData);
        };
        /** Helper for queueing client telemetry events so that they can be sent in a batch **/
        TelemetryService.prototype.queueTelemetryEvent = function (telemetryRequestData) {
            var _this = this;
            if (this._telemetryEventQueueTimerId === 0) {
                this._telemetryEventQueueTimerId = window.setTimeout(function () {
                    _this.sendQueuedTelemetryEvents();
                    _this._telemetryEventQueueTimerId = 0;
                }, TelemetryService.TelemetryEventBatchTimeout);
            }
            InJs.Tracing.verbose('Queuing telemetry event ' + telemetryRequestData.n + ' | Activity name: ' + telemetryRequestData.at + ' | AID: ' + telemetryRequestData.aid + ' | RAID: ' + telemetryRequestData.raid);
            this._unreportedTelemetryEvents.push(telemetryRequestData);
            if (this._unreportedTelemetryEvents.length > TelemetryService.MaxTelemetryEventBatchSize) {
                InJs.Tracing.verbose('Flushing telemetry event queue due to size');
                window.clearTimeout(this._telemetryEventQueueTimerId);
                this._telemetryEventQueueTimerId = 0;
                this.sendQueuedTelemetryEvents();
            }
        };
        /** Telemetry request helper for flushing the queue and immediately sending the events to the server **/
        TelemetryService.prototype.sendQueuedTelemetryEvents = function () {
            this.sendTelemetryRequest(this._unreportedTelemetryEvents, TelemetryService.RetryCount);
            this._unreportedTelemetryEvents = [];
        };
        /** Telemetry request helper with retry logic */
        TelemetryService.prototype.sendTelemetryRequest = function (telemetryRequestData, retryCount) {
            var _this = this;
            debug.assert(telemetryRequestData && telemetryRequestData.length > 0, 'telemetryRequestData && telemetryRequestData.length > 0');
            // TODO: Use _.map once lodash is available in BI Sites or BI Sites is retired
            var serializedData = telemetryRequestData.map(function (requestData) {
                return JSON.stringify(requestData);
            }).join('\r\n');
            // Prepare and send the request itself
            var options = {
                type: InJs.Utility.HttpPostMethod,
                url: this.telemetryUrl,
                contentType: InJs.Utility.XJavascriptContentType,
                timeout: TelemetryService.TelemetryRequestTimeout,
                data: serializedData,
            };
            var requestId;
            options.beforeSend = function (request) {
                requestId = _this.formatTelemetryRequest(request);
                request.setRequestHeader(InJs.Utility.HttpAcceptHeader, InJs.Utility.JsonContentType);
                InJs.Tracing.verbose('Firing telemetry event request ' + requestId, requestId);
            };
            options.success = function (data, textStatus, request) {
                debug.assertValue(data.NumberOfSuccessfulEvents, 'data.NumberOfSuccessfulEvents');
                debug.assertValue(data.TelemetryStatusCode, 'data.TelemetryStatusCode');
                var numberOfSuccessfulEvents = data.NumberOfSuccessfulEvents;
                InJs.Tracing.verbose('Telemetry event request ' + requestId + ' logged ' + numberOfSuccessfulEvents + ' of ' + telemetryRequestData.length + ' expected event(s). Status code: ' + data.TelemetryStatusCode, requestId);
                if (numberOfSuccessfulEvents < telemetryRequestData.length) {
                    var rejectedTelemetryEvent = telemetryRequestData[numberOfSuccessfulEvents];
                    InJs.Tracing.warning('Server rejected telemetry event ' + rejectedTelemetryEvent.n + ' | Activity name: ' + rejectedTelemetryEvent.at + ' | AID: ' + rejectedTelemetryEvent.aid + ' | RAID: ' + rejectedTelemetryEvent.raid);
                    // Skip the bad event and retry with the remaining events, if there are any
                    if (telemetryRequestData.length - (numberOfSuccessfulEvents + 1) > 0) {
                        // TODO: Use _.drop once lodash is available in BI Sites or BI Sites is retired
                        var nextTelemetryRequestDataBatch = [];
                        for (var i = numberOfSuccessfulEvents + 1, len = telemetryRequestData.length; i < len; i++)
                            nextTelemetryRequestDataBatch.push(telemetryRequestData[i]);
                        _this.sendTelemetryRequest(nextTelemetryRequestDataBatch, TelemetryService.RetryCount);
                    }
                }
            };
            options.error = function (request, textStatus, error) {
                InJs.Tracing.warning('Telemetry event request ' + requestId + ' logging failed', requestId);
                if (_this.isRetriableError(request.status) && retryCount > 0) {
                    InJs.Tracing.verbose('Retrying telemetry event request ' + requestId, requestId);
                    _this.sendTelemetryRequest(telemetryRequestData, retryCount - 1);
                }
                else {
                    InJs.Tracing.error('Not retrying telemetry request ' + requestId + ' because there was a non-retriable error or we exhausted maximum number of allowed retries', requestId);
                }
            };
            $.ajax(options);
        };
        TelemetryService.prototype.formatTelemetryRequest = function (request) {
            var requestId = InJs.Utility.generateGuid();
            request.setRequestHeader(InJs.HttpUtility.HttpCloudBIAccessTokenHeader, this.configurationProvider.getSecurityToken());
            request.setRequestHeader(TelemetryService.HttpActivityIdHeader, InJs.AppManager.current.activityId);
            request.setRequestHeader(TelemetryService.HttpRequestIdHeader, requestId);
            // If we have an SPO context token add that one as well to support telemetry 
            // before we retrieve the BI token
            var spoContextToken = this.configurationProvider.getSpoContextToken();
            if (spoContextToken)
                request.setRequestHeader(InJs.HttpUtility.HttpSpoContextTokenHeader, spoContextToken);
            return requestId;
        };
        Object.defineProperty(TelemetryService.prototype, "telemetryUrl", {
            get: function () {
                return InJs.Utility.urlCombine(this.configurationProvider.getClusterUri(), TelemetryService.TelemetryEndpointPath);
            },
            enumerable: true,
            configurable: true
        });
        TelemetryService.prototype.isRetriableError = function (statusCode) {
            return statusCode !== 401 /* Unauthorized */ && statusCode !== 403 /* Forbidden */;
        };
        // Telemtry constants
        TelemetryService.TelemetryEndpointPath = 'telemetry/Telemetry';
        TelemetryService.SourceType = 'infoNav';
        TelemetryService.DateEnvelopeStart = '\/Date(';
        TelemetryService.DateEnvelopeEnd = ')\/';
        // Request constants
        TelemetryService.HttpActivityIdHeader = 'X-AS-ActivityID';
        TelemetryService.HttpRequestIdHeader = 'X-AS-RequestID';
        TelemetryService.TelemetryRequestTimeout = 5000;
        TelemetryService.TelemetryEventBatchTimeout = 30000;
        TelemetryService.MaxTelemetryEventBatchSize = 100;
        TelemetryService.RetryCount = 2;
        // Event Names
        TelemetryService.NotifyActivityCorrelationDataEvent = 'NotifyActivityCorrelationDataEvent';
        TelemetryService.FireActivityCompletionSummaryEvent = 'FireActivityCompletionSummaryEvent';
        TelemetryService.NotifyVisualizedInterpretResult = 'NotifyVisualizedInterpretResult';
        TelemetryService.NotifyUserChangedVisualizationType = 'NotifyUserChangedVisualizationType';
        TelemetryService.NotifyUserChangedModel = 'NotifyUserChangedModel';
        TelemetryService.NotifyUserGotError = 'NotifyUserGotError';
        TelemetryService.NotifyNewUserAction = 'NotifyNewUserAction';
        TelemetryService.NotifyUserAddedPhrasing = 'NotifyUserAddedPhrasing';
        TelemetryService.NotifyUserRemovedPhrasing = 'NotifyUserRemovedPhrasing';
        TelemetryService.NotifyUserReorderedPhrasing = 'NotifyUserReorderedPhrasing';
        TelemetryService.NotifyUserChangedRole = 'NotifyUserChangedRole';
        TelemetryService.NotifyUserChangedCondition = 'NotifyUserChangedCondition';
        TelemetryService.NotifyUserChangedPrepPhrase = 'NotifyUserChangedPrepPhrase';
        TelemetryService.NotifyUserChangedSynonyms = 'NotifyUserChangedSynonyms';
        TelemetryService.NotifyUserChangedAntonyms = 'NotifyUserChangedAntonyms';
        TelemetryService.NotifyUserChangedWhere = 'NotifyUserChangedWhere';
        TelemetryService.NotifyUserChangedWhen = 'NotifyUserChangedWhen';
        TelemetryService.NotifyUserSaved = 'NotifyUserSaved';
        TelemetryService.NotifyUserChangedTableOrColumnSynonyms = 'NotifyUserChangedTableOrColumnSynonyms';
        // Event IDs
        TelemetryService.EventIds = {
            NotifyActivityCorrelationDataEvent: '6282129749136568722',
            FireActivityCompletionSummaryEvent: '6994294237486268222',
            NotifyVisualizedInterpretResult: '5669266953005547207',
            NotifyUserChangedVisualizationType: '4281925833501306497',
            NotifyUserChangedModel: '8729928910078157500',
            NotifyUserGotError: '4644360672233841357',
            NotifyNewUserAction: '1785946859649747271',
            NotifyUserAddedPhrasing: '4089628018928559701',
            NotifyUserRemovedPhrasing: '3907843229528186413',
            NotifyUserReorderedPhrasing: '1486379178168147256',
            NotifyUserChangedRole: '8982531571555799151',
            NotifyUserChangedCondition: '3511819276698362970',
            NotifyUserChangedPrepPhrase: '6379214669720148016',
            NotifyUserChangedSynonyms: '8567744340581635579',
            NotifyUserChangedAntonyms: '1997279985662893587',
            NotifyUserSaved: '2131456592293043617',
            NotifyUserChangedTableOrColumnSynonyms: '3036747692433250351',
        };
        return TelemetryService;
    })(InJs.InfoNavClientService);
    InJs.TelemetryService = TelemetryService;
    /** Available Activity types */
    (function (ActivityType) {
        ActivityType[ActivityType["ICSF"] = 0] = "ICSF";
        ActivityType[ActivityType["IEDE"] = 1] = "IEDE";
        ActivityType[ActivityType["IEDF"] = 2] = "IEDF";
        ActivityType[ActivityType["IHDF"] = 3] = "IHDF";
        ActivityType[ActivityType["IHSF"] = 4] = "IHSF";
        ActivityType[ActivityType["ILDF"] = 5] = "ILDF";
        ActivityType[ActivityType["IMDE"] = 6] = "IMDE";
        ActivityType[ActivityType["IPOF"] = 7] = "IPOF";
        ActivityType[ActivityType["IPOX"] = 8] = "IPOX";
        ActivityType[ActivityType["IPVI"] = 9] = "IPVI";
        ActivityType[ActivityType["IQSC"] = 10] = "IQSC";
        ActivityType[ActivityType["IQSS"] = 11] = "IQSS";
        ActivityType[ActivityType["IRCM"] = 12] = "IRCM";
        ActivityType[ActivityType["IRCV"] = 13] = "IRCV";
        ActivityType[ActivityType["IMUP"] = 14] = "IMUP";
        ActivityType[ActivityType["ICRU"] = 15] = "ICRU";
        ActivityType[ActivityType["ISRE"] = 16] = "ISRE";
        ActivityType[ActivityType["IAPL"] = 17] = "IAPL";
        ActivityType[ActivityType["IMPL"] = 18] = "IMPL";
        ActivityType[ActivityType["IEPL"] = 19] = "IEPL";
        ActivityType[ActivityType["IAGM"] = 20] = "IAGM";
        ActivityType[ActivityType["IMMM"] = 21] = "IMMM";
        ActivityType[ActivityType["IEPT"] = 22] = "IEPT";
        ActivityType[ActivityType["INAQ"] = 23] = "INAQ";
        ActivityType[ActivityType["ICIN"] = 24] = "ICIN";
        ActivityType[ActivityType["INPV"] = 25] = "INPV";
        ActivityType[ActivityType["INLM"] = 26] = "INLM";
    })(InJs.ActivityType || (InJs.ActivityType = {}));
    var ActivityType = InJs.ActivityType;
    ;
    /** User action, matches server-side counterpart */
    (function (UserAction) {
        UserAction[UserAction["SelectFeaturedQuestion"] = 0] = "SelectFeaturedQuestion";
        UserAction[UserAction["DisplayFeaturedQuestions"] = 1] = "DisplayFeaturedQuestions";
        UserAction[UserAction["SelectAutocomplete"] = 2] = "SelectAutocomplete";
        UserAction[UserAction["SelectSuggestion"] = 3] = "SelectSuggestion";
        UserAction[UserAction["OpenFilterPane"] = 4] = "OpenFilterPane";
        UserAction[UserAction["OpenFieldExplorer"] = 5] = "OpenFieldExplorer";
        UserAction[UserAction["ShareResultUrlViaEmail"] = 6] = "ShareResultUrlViaEmail";
        UserAction[UserAction["CopyResultUrlToClipboard"] = 7] = "CopyResultUrlToClipboard";
        UserAction[UserAction["ShareResultViaEmail"] = 8] = "ShareResultViaEmail";
        UserAction[UserAction["ChangeModelingTabOverview"] = 9] = "ChangeModelingTabOverview";
        UserAction[UserAction["ChangeModelingTabSynonyms"] = 10] = "ChangeModelingTabSynonyms";
        UserAction[UserAction["ChangeModelingTabPhrasings"] = 11] = "ChangeModelingTabPhrasings";
        UserAction[UserAction["ChangeModelingTabUsage"] = 12] = "ChangeModelingTabUsage";
        UserAction[UserAction["ChangeUsageToUserSummary"] = 13] = "ChangeUsageToUserSummary";
        UserAction[UserAction["ChangeUsageToFlaggedUtterances"] = 14] = "ChangeUsageToFlaggedUtterances";
        UserAction[UserAction["ChangeUsageToUnrecognizedTerms"] = 15] = "ChangeUsageToUnrecognizedTerms";
        UserAction[UserAction["UsageUnrecognizedTermsIncludeAllModels"] = 16] = "UsageUnrecognizedTermsIncludeAllModels";
        UserAction[UserAction["UsageUnrecognizedTermsIncludeTopModelOnly"] = 17] = "UsageUnrecognizedTermsIncludeTopModelOnly";
        UserAction[UserAction["UsageShowMoreUtterancesForUser"] = 18] = "UsageShowMoreUtterancesForUser";
        UserAction[UserAction["UsageShowMoreUtterancesForUnrecognizedTerm"] = 19] = "UsageShowMoreUtterancesForUnrecognizedTerm";
        UserAction[UserAction["UsageClickedUtteranceUserReport"] = 20] = "UsageClickedUtteranceUserReport";
        UserAction[UserAction["UsageClickedUtteranceFlaggedUtteranceReport"] = 21] = "UsageClickedUtteranceFlaggedUtteranceReport";
        UserAction[UserAction["UsageClickedUtteranceUnrecognizedTermReport"] = 22] = "UsageClickedUtteranceUnrecognizedTermReport";
    })(InJs.UserAction || (InJs.UserAction = {}));
    var UserAction = InJs.UserAction;
    /** Event level, matches the server-side counterpart */
    (function (EventLevel) {
        EventLevel[EventLevel["Inherit"] = 0] = "Inherit";
        EventLevel[EventLevel["Verbose"] = 1] = "Verbose";
        EventLevel[EventLevel["Information"] = 2] = "Information";
        EventLevel[EventLevel["Warning"] = 3] = "Warning";
        EventLevel[EventLevel["Error"] = 4] = "Error";
        EventLevel[EventLevel["Critical"] = 5] = "Critical";
    })(InJs.EventLevel || (InJs.EventLevel = {}));
    var EventLevel = InJs.EventLevel;
    ;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** Responsible for capturing usages. */
    var InterpretUsageQueue = (function () {
        function InterpretUsageQueue() {
            this._pendingInterpretations = [];
        }
        /** Registers an interpretation. Returns the count of items in the queue. */
        InterpretUsageQueue.prototype.register = function (interpretation, contentProviderType, utteranceFlags, utteranceFeedback) {
            debug.assertValue(interpretation, 'interpretation');
            this._pendingInterpretations.push({
                interpretation: interpretation,
                flags: utteranceFlags || 0 /* None */,
                feedback: utteranceFeedback || 0 /* None */,
                timeStamp: new Date(),
                contentProviderType: contentProviderType
            });
            return this._pendingInterpretations.length;
        };
        /** Returns any pending usage information, and resets the pending queue. */
        InterpretUsageQueue.prototype.flushPending = function () {
            var usages = [], len = this._pendingInterpretations.length;
            if (len > 0) {
                for (var i = 0; i < len; ++i) {
                    usages.push.apply(usages, InterpretUsageQueue.convert(this._pendingInterpretations[i]));
                }
                this._pendingInterpretations = [];
            }
            return usages;
        };
        /** Set the last interpret in the queue as User Flagged. Returns true if this action is
        * successful, and false if it fails (e.g. usage data was already flushed) */
        InterpretUsageQueue.prototype.setLastUtteranceAsUserFlagged = function () {
            var len = this._pendingInterpretations.length;
            if (len > 0) {
                this._pendingInterpretations[len - 1].flags |= InJs.UtteranceFlags.User;
                return true;
            }
            return false;
        };
        InterpretUsageQueue.prototype.setFeedbackForLastUtterance = function (feedback) {
            var len = this._pendingInterpretations.length;
            if (len > 0) {
                this._pendingInterpretations[len - 1].feedback = feedback;
                return true;
            }
            return false;
        };
        InterpretUsageQueue.convert = function (pendingInterpretation) {
            debug.assertValue(pendingInterpretation, 'pendingInterpretation');
            var usages = [], utteranceFlags = pendingInterpretation.flags, interpretation = pendingInterpretation.interpretation, interpretationResults = interpretation.results, timeStamp = pendingInterpretation.timeStamp, contentProviderType = pendingInterpretation.contentProviderType, utteranceFeedback = pendingInterpretation.feedback;
            // If the user has pinned a particular data source (defaultResult), we should discard all the
            // non-pinned results.
            var defaultResultIndex = interpretation.defaultResultIndex;
            if (defaultResultIndex >= 0) {
                debug.assert(defaultResultIndex < interpretationResults.length, 'defaultResultIndex out of range');
                usages.push(this.createUsageData(interpretationResults[defaultResultIndex], utteranceFlags, utteranceFeedback, 0, timeStamp, contentProviderType));
            }
            else {
                for (var i = 0, len = interpretationResults.length; i < len; ++i) {
                    // Results are already returned in ranked order (best to worst).
                    usages.push(this.createUsageData(interpretationResults[i], utteranceFlags, utteranceFeedback, i, timeStamp, contentProviderType));
                }
            }
            return usages;
        };
        InterpretUsageQueue.createUsageData = function (interpretResult, utteranceFlags, utteranceFeedback, resultRank, clientDateTime, contentProviderType) {
            var interpretResultJson = interpretResult.source, usage = {
                Text: interpretResult.utterance,
                ResultRank: resultRank,
                Flags: utteranceFlags | InterpretUsageQueue.determineFlags(interpretResult),
                DatabaseName: interpretResultJson.DatabaseName,
                VirtualServerName: interpretResultJson.VirtualServerName,
                ClientDateTime: InJs.JavaScriptSerializer.serializeDate(clientDateTime),
                UserFeedback: utteranceFeedback,
                ContentProviderType: contentProviderType,
            };
            var completedUtterance = interpretResult.completedUtterance;
            if (completedUtterance) {
                usage.Text = completedUtterance.Text;
                var unrecognizedTermIndices = interpretResult.unrecognizedTerms;
                if (unrecognizedTermIndices && unrecognizedTermIndices.length > 0) {
                    usage.UnrecognizedTerms = InterpretUsageQueue.convertUnrecognizedTerms(unrecognizedTermIndices, completedUtterance);
                }
            }
            if (interpretResultJson.Score) {
                usage.Score = interpretResultJson.Score;
            }
            return usage;
        };
        /** Determines any automatic flags for an interpretResult. */
        InterpretUsageQueue.determineFlags = function (interpretResult) {
            debug.assertValue(interpretResult, 'interpretResult');
            var flags = 0 /* None */;
            if (!interpretResult.completedUtterance) {
                flags |= InJs.UtteranceFlags.ResultIsEmpty;
            }
            return flags;
        };
        InterpretUsageQueue.convertUnrecognizedTerms = function (unrecognizedTermsIndices, completedUtterance) {
            debug.assert(unrecognizedTermsIndices && unrecognizedTermsIndices.length > 0, 'unrecognizedTermsIndices should be non-empty');
            debug.assertValue(completedUtterance, 'completedUtterance');
            var result = [], text = completedUtterance.Text, completedUtteranceTerms = completedUtterance.Terms;
            for (var i = 0, len = unrecognizedTermsIndices.length; i < len; ++i) {
                var termIndex = unrecognizedTermsIndices[i], startCharIndex = completedUtteranceTerms[termIndex].StartCharIndex, termText = InJs.InterpretResult.getTermText(completedUtterance, termIndex);
                result.push({
                    StartIndex: startCharIndex,
                    Length: InJs.StringExtensions.trimTrailingWhitespace(termText).length,
                });
            }
            return result;
        };
        return InterpretUsageQueue;
    })();
    InJs.InterpretUsageQueue = InterpretUsageQueue;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** Responsible for listening to Interpret results and issuing usage data to the service. */
    var InterpretUsageListener = (function () {
        function InterpretUsageListener(bridge, usageService, timerFactory) {
            debug.assertValue(bridge, 'bridge');
            this._bridge = bridge;
            this._usageService = usageService;
            this._timerFactory = timerFactory || InJs.TimerPromiseFactory.instance;
            this._usages = new InJs.InterpretUsageQueue();
            this._bridge.attach(InJs.Events.InterpretUsageIssuedEventName, InterpretUsageListener.bridge_InterpretIssued, this);
            this._bridge.attach(InJs.Events.InterpretUsageSuccessEventName, InterpretUsageListener.bridge_InterpretSuccess, this);
            $(window).on(InJs.DOMConstants.beforeUnload, this, InterpretUsageListener.onBeforeUnload);
        }
        InterpretUsageListener.prototype.dispose = function () {
            if (this._userCompletionPromise) {
                this._userCompletionPromise.reject();
                this._userCompletionPromise = null;
            }
            if (this._flushPendingPromise) {
                this._flushPendingPromise.reject();
                this._flushPendingPromise = null;
            }
            this._bridge.detach(InJs.Events.InterpretUsageIssuedEventName, InterpretUsageListener.bridge_InterpretIssued);
            this._bridge.detach(InJs.Events.InterpretUsageSuccessEventName, InterpretUsageListener.bridge_InterpretSuccess);
            $(window).off(InJs.DOMConstants.beforeUnload, InterpretUsageListener.onBeforeUnload);
        };
        InterpretUsageListener.prototype.setLastUtteranceAsUserFlagged = function () {
            var flagAttemptSuccessful = this._usages.setLastUtteranceAsUserFlagged();
            if (!flagAttemptSuccessful && this._lastInterpretResponse) {
                // There is an edge case where the user could flag the utterance after
                // it's flushed to the server. Our solution for now is we'll resend the
                // utterance so that it gets logged again. Alternatives we can consider
                // in future are updating the existing utterance in the DB via text search
                // or assigning IDs to all the utterances we log in usage reporting.
                this.registerResponse(this._lastInterpretResponse, this._lastContentProviderType, InJs.UtteranceFlags.User);
                this._lastInterpretResponse = null;
                this._lastContentProviderType = null;
            }
        };
        InterpretUsageListener.prototype.setFeedbackForLastUtterance = function (feedback) {
            var flagAttemptSuccessful = this._usages.setFeedbackForLastUtterance(feedback);
            if (!flagAttemptSuccessful && this._lastInterpretResponse) {
                // There is an edge case where the user could flag the utterance after
                // it's flushed to the server. Our solution for now is we'll resend the
                // utterance so that it gets logged again. Alternatives we can consider
                // in future are updating the existing utterance in the DB via text search
                // or assigning IDs to all the utterances we log in usage reporting.
                this.registerResponse(this._lastInterpretResponse, this._lastContentProviderType, null, feedback);
                this._lastInterpretResponse = null;
                this._lastContentProviderType = null;
            }
        };
        InterpretUsageListener.bridge_InterpretIssued = function (e, eventArgs) {
            var self = e.data;
            InJs.Utility.throwIfNullOrUndefined(eventArgs, self, 'Bridge_InterpretIssued', 'eventArgs');
            self.onInterpretIssued(eventArgs);
        };
        InterpretUsageListener.prototype.onInterpretIssued = function (args) {
            var _this = this;
            // Abort any pending user completion
            if (this._userCompletionPromise) {
                this._userCompletionPromise.reject();
            }
            this._userCompletionPromise = this._timerFactory.create(InterpretUsageListener._interpretStartedDelayInMs);
            this._userCompletionPromise.done(function () { return _this.onUserCompletion(); });
        };
        InterpretUsageListener.bridge_InterpretSuccess = function (e, eventArgs) {
            var self = e.data;
            InJs.Utility.throwIfNullOrUndefined(eventArgs, self, 'Bridge_InterpretSuccess', 'eventArgs');
            self.onInterpretSuccess(eventArgs);
        };
        InterpretUsageListener.prototype.onInterpretSuccess = function (args) {
            if (this._userCompletionPromise) {
                // While we're awaiting user completion, take the most recent user response.
                this._pendingInterpretResponse = args.response;
                this._pendingContentProviderType = args.clientActivity.contentProviderType;
                return;
            }
            this.registerResponse(args.response, args.clientActivity.contentProviderType);
        };
        InterpretUsageListener.prototype.onUserCompletion = function () {
            this._userCompletionPromise = null;
            var pendingResponse = this._pendingInterpretResponse;
            var pendingContentProviderType = this._pendingContentProviderType;
            if (pendingResponse) {
                this.registerResponse(pendingResponse, pendingContentProviderType);
            }
        };
        InterpretUsageListener.prototype.registerResponse = function (interpretResponse, contentProviderType, utteranceFlags, utteranceFeedback) {
            var _this = this;
            debug.assertValue(interpretResponse, 'interpretResponse');
            // De-dupe this utterance against the last
            if (interpretResponse.isUtteranceLinguisticallyEquivalent(this._lastInterpretResponse))
                return;
            var usageCount = this._usages.register(interpretResponse, contentProviderType, utteranceFlags, utteranceFeedback);
            this._lastInterpretResponse = interpretResponse;
            this._lastContentProviderType = contentProviderType;
            if (!this._flushPendingPromise) {
                this._flushPendingPromise = this._timerFactory.create(InterpretUsageListener._flushPendingUsagesDelayInMs);
                this._flushPendingPromise.done(function () { return _this.flushPendingUsages(); });
            }
            if (usageCount >= InterpretUsageListener._usageQueueCapacity)
                this.flushPendingUsages();
        };
        InterpretUsageListener.onBeforeUnload = function (e) {
            var self = e.data;
            InJs.Utility.throwIfNullOrUndefined(self, self, 'onBeforeUnload', 'self');
            self.flushPendingUsages();
        };
        InterpretUsageListener.prototype.flushPendingUsages = function () {
            this._flushPendingPromise = null;
            var usages = this._usages.flushPending();
            if (usages.length > 0) {
                this._usageService.update(usages);
            }
        };
        InterpretUsageListener._usageQueueCapacity = 100;
        InterpretUsageListener._interpretStartedDelayInMs = 5000;
        InterpretUsageListener._flushPendingUsagesDelayInMs = 2 * 60 * 1000; // 2 Minutes
        return InterpretUsageListener;
    })();
    InJs.InterpretUsageListener = InterpretUsageListener;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** Responsible for instantiating the Usage service, and associated objects. */
    var UsageServiceContainer = (function (_super) {
        __extends(UsageServiceContainer, _super);
        function UsageServiceContainer(bridge, configurationProvider) {
            _super.call(this, bridge, configurationProvider);
            this._service = null;
            if (this.configurationProvider.getIsReady()) {
                this.onGroupReady();
            }
        }
        Object.defineProperty(UsageServiceContainer.prototype, "service", {
            /** Gets the connected UsageService, if any. */
            get: function () {
                return this._service;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UsageServiceContainer.prototype, "hasInterpretListener", {
            /** Gets a value indicating whether an InterpretUsageListener is enabled on this container. This is used by tests.*/
            get: function () {
                return !!this._interpretListener;
            },
            enumerable: true,
            configurable: true
        });
        UsageServiceContainer.prototype._onConnectionGroupReady = function () {
            this.onGroupReady();
        };
        UsageServiceContainer.prototype.setLastUtteranceAsUserFlagged = function () {
            if (this._interpretListener) {
                this._interpretListener.setLastUtteranceAsUserFlagged();
            }
        };
        UsageServiceContainer.prototype.setFeedbackForLastUtterance = function (feedback) {
            if (this._interpretListener) {
                this._interpretListener.setFeedbackForLastUtterance(feedback);
            }
        };
        UsageServiceContainer.prototype.onGroupReady = function () {
            this._service = null;
            if (this._interpretListener) {
                this._interpretListener.dispose();
                this._interpretListener = null;
            }
            this._service = new InJs.UsageService(this.configurationProvider);
            if (this.configurationProvider.getIsUsageReportingEnabled() === true)
                this._interpretListener = new InJs.InterpretUsageListener(this.bridge, this._service);
        };
        return UsageServiceContainer;
    })(InJs.InfoNavClientService);
    InJs.UsageServiceContainer = UsageServiceContainer;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
// This is a directive that tells the Ajax minifier to remove all calls to this namespace.
// http://ajaxmin.codeplex.com/wikipage?title=Preprocessor
///#DEBUG=debug
// IMPORTANT: Order matters in this file, think of it as loading a sequence of interdependant js files.
/// <reference path="..\ModernCop.ts" />
// Exception Types
/// <reference path="..\Exceptions.ts" />
// Error Handling
/// <reference path="..\Controls\ModalDialog\ModalDialog.ts" />
// IMPORTANT: This should be the first piece of executable content since it performs check for an unsupported browser.
//            Note that properties are also executable content as any property definition gets translated into Object.defineProperty call.
//            Also ModalDialog has be present before this code executes as it is used for notifying the user.
/// <reference path="..\Utility\BrowserUtility.ts" />
/// <reference path="..\UnsupportedBrowserCheck.ts" />
// Control Templates
/// <reference path="..\Controls\Collage\Templates\CollageItemEditorTemplateProvider.ts" />
/// <reference path="..\Controls\ClientControlTemplateProvider.ts" />
/// <reference path="..\Controls\ClientControl.ts" />
/// <reference path="..\DataContracts\AppInternal.ts" />
/// <reference path="..\DataContracts\FeaturedQuestion.ts"/>
/// <reference path="..\DataContracts\PhrasingTemplates.ts" />
/// <reference path="..\DataContracts\Modeling.ts" />
/// <reference path="..\DataContracts\Interpret.ts" />
/// <reference path="..\DataContracts\PowerView.ts" />
/// <reference path="..\DataContracts\Silverlight.ts" />
/// <reference path="..\DataContracts\SPIntegration.ts" />
/// <reference path="..\DataContracts\ExtractTerms.ts" />
/// <reference path="..\DataContracts\Usage.ts" />
/// <reference path="..\DataContracts\Modeling\ModelingRequest.ts" />
/// <reference path="..\DataContracts\Modeling\ModelCommitStatusResult.ts" />
/// <reference path="..\DataContracts\Modeling\ModelingMetadataResult.ts" />
/// <reference path="..\DataContracts\Modeling\SampleUtterance.ts" />
/// <reference path="..\DataContracts\Modeling\WorkbookPublishStatus.ts" />
/// <reference path="..\Utility\DirectedGraph.ts" />
/// <reference path="..\Utility\HttpUtility.ts" />
/// <reference path="..\Utility\AjaxUtility.ts" />
/// <reference path="..\Utility\JavaScriptSerializer.ts" />
/// <reference path="..\Utility\interpretResultUtility.ts" />
/// <reference path="..\Tracing\Tracing.ts" />
/// <reference path="..\AppManager.ts" />
/// <reference path="..\InfoNavApp.ts" />
/// <reference path="..\StandaloneInfoNavApp.ts" />
/// <reference path="..\Embedability\EmbeddedInfoNavApp.ts" />
/// <reference path="..\Embedability\InfoNavController.ts" />
/// <reference path="..\Embedability\EventBridgeParticipant.ts" />
/// <reference path="..\Services\InfoNavServiceConfigurationProvider.ts" />
/// <reference path="..\Services\InfoNavClientService.ts" />
/// <reference path="..\Services\InterpretService.ts" />
/// <reference path="..\Services\FeaturedQuestionsService.ts" />
/// <reference path="..\Services\UsageService.ts" />
/// <reference path="..\Embedability\ControllerOperations.ts" />
/// <reference path="..\Embedability\ControllerOptions.ts" />
/// <reference path="..\Embedability\WidgetFactory.ts" />
/// <reference path="..\Embedability\ConnectionGroup.ts" />
/// <reference path="..\DataModels\InterpretResult.ts" />
/// <reference path="..\DataModels\InterpretResponse.ts" />
/// <reference path="..\Controls\Control.ts" />
/// <reference path="..\Controls\InfoNavClientControl.ts" />
/// <reference path="..\Controls\InfoNavConnectedClientControl.ts" />
/// <reference path="..\Controls\qnaVisualizationControl.ts" />
/// <reference path="..\BrowserHandler.ts" />
/// <reference path="..\Configuration.ts" />
/// <reference path="..\InfoNavAppCache.ts" />
/// <reference path="..\InfoNavAppLocalCache.ts" />
/// <reference path="..\InfoNavAppSessionCache.ts" />
/// <reference path="..\InfoNavEventBridge.ts" />
/// <reference path="..\EventArgs\InterpretEventArgs.ts" />
/// <reference path="..\EventArgs\AvailableVisualizationTypesEventArgs.ts" />
/// <reference path="..\EventArgs\ChangeUserUtteranceEventArgs.ts" />
/// <reference path="..\EventArgs\ClearInterpretResultEventArgs.ts" />
/// <reference path="..\EventArgs\HideNotificationEventArgs.ts" />
/// <reference path="..\EventArgs\InterpretErrorEventArgs.ts" />
/// <reference path="..\EventArgs\InterpretIssuedEventArgs.ts" />
/// <reference path="..\EventArgs\InterpretResultChangedEventArgs.ts" />
/// <reference path="..\EventArgs\InterpretSuccessEventArgs.ts" />
/// <reference path="..\EventArgs\PowerViewErrorEventArgs.ts" />
/// <reference path="..\EventArgs\SetVisualizationTypeEventArgs.ts" />
/// <reference path="..\EventArgs\ShowCustomDialogEventArgs.ts" />
/// <reference path="..\EventArgs\ShowErrorEventArgs.ts" />
/// <reference path="..\EventArgs\ShowMessageEventArgs.ts" />
/// <reference path="..\EventArgs\ShowNotificationEventArgs.ts" />
/// <reference path="..\EventArgs\ShowPromptEventArgs.ts" />
/// <reference path="..\EventArgs\TermSelectionChangedEventArgs.ts" />
/// <reference path="..\Embedability\AADConnectionGroup.ts" />
/// <reference path="..\Embedability\CloudConnectionGroup.ts" />
/// <reference path="..\Embedability\StandaloneCloudConnectionGroup.ts" />
/// <reference path="..\Embedability\PowerBIConnectionGroup.ts" />
/// <reference path="InJs.StateMachine.ts" />
/// <reference path="InJs.QuestionBox.ts" />
/// <reference path="..\Controls\InputControl.ts" />
/// <reference path="..\Controls\Primitives\Button.ts" />
/// <reference path="..\Controls\Primitives\Image.ts" />
/// <reference path="..\Controls\Primitives\Select.ts" />
/// <reference path="..\Controls\Primitives\TextBox.ts" />
/// <reference path="..\Controls\Primitives\RadioGroup.ts" />
/// <reference path="..\Controls\Common\AccordionControl.ts" />
/// <reference path="..\Controls\Common\CollapsiblePaneControl.ts" />
/// <reference path="..\Controls\Common\IntelliInputBox.ts" />
/// <reference path="..\Controls\Common\TogglePanelControl.ts" />
/// <reference path="..\Controls\TabControl.ts" />
/// <reference path="..\Controls\Modeling\RuntimeModelingTemplate.ts" />
/// <reference path="..\Controls\Modeling\ItemSelectionControl.ts" />
/// <reference path="..\Controls\Modeling\PhrasingTemplateControl.ts" />
/// <reference path="..\Controls\Modeling\PhrasingTemplateSelectorControl.ts" />
/// <reference path="..\Controls\Modeling\TransientLinguisticSchemaManager.ts" />
/// <reference path="..\Controls\PowerView\PowerViewControl.ts" />
/// <reference path="..\Controls\PowerView\PowerViewHTML5Control.ts" />
/// <reference path="..\Controls\PowerView\PowerViewSilverlightControl.ts" />
/// <reference path="InJs.Notifications.ts" />
/// <reference path="..\Controls\ModelSelection\ModelSelectionControl.ts" />
/// <reference path="..\Controls\Collage\CollageItemView.ts"/>
/// <reference path="..\Controls\Collage\CollageControlModel.ts"/>
/// <reference path="..\Controls\Collage\CollageControlView.ts"/>
/// <reference path="..\Controls\Collage\CollageControl.ts"/>
/// <reference path="..\Controls\Collage\CollageItemEditor.ts"/>
/// <reference path="..\Controls\HelpViewer\HelpViewerControl.ts"/>
/// <reference path="..\SharePoint\SharePointOnlineConnectionGroup.ts" />
/// <reference path="..\Telemetry\ActivityErrors.ts" />
/// <reference path="..\Telemetry\ClientTelemetryEvents.ts" />
/// <reference path="..\Telemetry\ClientActivity.ts" />
/// <reference path="..\Telemetry\TelemetryService.ts" />
/// <reference path="..\Usage\InterpretUsageQueue.ts" />
/// <reference path="..\Usage\InterpretUsageListener.ts" />
/// <reference path="..\Usage\UsageServiceContainer.ts" />
//# sourceMappingURL=InfoNav.js.map