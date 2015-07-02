if (typeof DEBUG === 'undefined')
    DEBUG = true;
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
// This is a directive that tells the Ajax minifier to remove all calls to this namespace.
// http://ajaxmin.codeplex.com/wikipage?title=Preprocessor
///#DEBUG=debug
// IMPORTANT: Order matters in this file, think of it as loading a sequence of interdependant js files.
/// <reference path="..\typedefs\buildConstants.ts" />
/// <reference path="..\ModernCop.ts" /> 
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var UnknownClientError = (function () {
        function UnknownClientError() {
        }
        Object.defineProperty(UnknownClientError.prototype, "code", {
            get: function () {
                return 'UnknownClientError';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UnknownClientError.prototype, "ignorable", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        UnknownClientError.prototype.getDetails = function (resourceProvider) {
            var details = {
                message: resourceProvider.get('ClientError_UnknownClientErrorValue'),
                additionalErrorInfo: [{ errorInfoKey: resourceProvider.get('ClientError_UnknownClientErrorKey'), errorInfoValue: resourceProvider.get('ClientError_UnknownClientErrorValue'), }],
            };
            return details;
        };
        return UnknownClientError;
    })();
    powerbi.UnknownClientError = UnknownClientError;
    var IgnorableClientError = (function () {
        function IgnorableClientError() {
        }
        Object.defineProperty(IgnorableClientError.prototype, "code", {
            get: function () {
                return 'IgnorableClientError';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IgnorableClientError.prototype, "ignorable", {
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
        IgnorableClientError.prototype.getDetails = function (resourceProvider) {
            var details = {
                message: '',
                additionalErrorInfo: [],
            };
            return details;
        };
        return IgnorableClientError;
    })();
    powerbi.IgnorableClientError = IgnorableClientError;
})(powerbi || (powerbi = {}));
///<reference path="../../typedefs/pako/pako.d.ts"/>
///<reference path="../../typedefs/msrcrypto/msrcrypto.d.ts"/>
///<reference path="../../typedefs/jQuery/jQuery.d.ts"/>
///<reference path="../../typedefs/moment/moment.d.ts"/>
///<reference path="../../typedefs/d3/d3.d.ts"/> 
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var jsCommon;
(function (jsCommon) {
    var ArrayExtensions;
    (function (ArrayExtensions) {
        /** Returns items that exist in target and other. */
        function intersect(target, other) {
            var result = [];
            for (var i = target.length - 1; i >= 0; --i) {
                if (other.indexOf(target[i]) !== -1) {
                    result.push(target[i]);
                }
            }
            return result;
        }
        ArrayExtensions.intersect = intersect;
        /** return elements exists in target but not exists in other. */
        function diff(target, other) {
            var result = [];
            for (var i = target.length - 1; i >= 0; --i) {
                var value = target[i];
                if (other.indexOf(value) === -1) {
                    result.push(value);
                }
            }
            return result;
        }
        ArrayExtensions.diff = diff;
        /** return an array with only the distinct items in the source. */
        function distinct(source) {
            var result = [];
            for (var i = 0, len = source.length; i < len; i++) {
                var value = source[i];
                if (result.indexOf(value) === -1) {
                    result.push(value);
                }
            }
            return result;
        }
        ArrayExtensions.distinct = distinct;
        /** Pushes content of source onto target, for parts of course that do not already exist in target. */
        function union(target, source) {
            for (var i = 0, len = source.length; i < len; ++i) {
                unionSingle(target, source[i]);
            }
        }
        ArrayExtensions.union = union;
        /** Pushes value onto target, if value does not already exist in target. */
        function unionSingle(target, value) {
            if (target.indexOf(value) < 0) {
                target.push(value);
            }
        }
        ArrayExtensions.unionSingle = unionSingle;
        /** Returns an array with a range of items from source, including the startIndex & endIndex. */
        function range(source, startIndex, endIndex) {
            debug.assert(startIndex >= 0 && startIndex < source.length, 'startIndex is out of range.');
            debug.assert(endIndex >= 0 && endIndex < source.length, 'endIndex is out of range.');
            var result = [];
            for (var i = startIndex; i <= endIndex; ++i) {
                result.push(source[i]);
            }
            return result;
        }
        ArrayExtensions.range = range;
        /** Returns an array that includes items from source, up to the specified count. */
        function take(source, count) {
            debug.assert(count >= 0, 'Count is negative.');
            debug.assert(count <= source.length, 'Count is too large.');
            var result = [];
            for (var i = 0; i < count; ++i) {
                result.push(source[i]);
            }
            return result;
        }
        ArrayExtensions.take = take;
        /** Returns a value indicating whether the arrays have the same values in the same sequence. */
        function sequenceEqual(left, right, comparison) {
            debug.assertValue(comparison, 'comparison');
            if (left === right) {
                return true;
            }
            if (!!left !== !!right) {
                return false;
            }
            var len = left.length;
            if (len !== right.length) {
                return false;
            }
            var i = 0;
            while (i < len && comparison(left[i], right[i])) {
                ++i;
            }
            return i === len;
        }
        ArrayExtensions.sequenceEqual = sequenceEqual;
        /** Returns null if the specified array is empty.  Otherwise returns the specified array. */
        function emptyToNull(array) {
            if (array && array.length === 0) {
                return null;
            }
            return array;
        }
        ArrayExtensions.emptyToNull = emptyToNull;
        function indexOf(array, predicate) {
            debug.assertValue(array, 'array');
            debug.assertValue(predicate, 'predicate');
            for (var i = 0, len = array.length; i < len; ++i) {
                if (predicate(array[i])) {
                    return i;
                }
            }
            return -1;
        }
        ArrayExtensions.indexOf = indexOf;
        function createWithId() {
            return extendWithId([]);
        }
        ArrayExtensions.createWithId = createWithId;
        function extendWithId(array) {
            debug.assertValue(array, 'array');
            var extended = array;
            extended.withId = withId;
            return extended;
        }
        ArrayExtensions.extendWithId = extendWithId;
        /** Finds and returns the first item with a matching ID. */
        function findWithId(array, id) {
            for (var i = 0, len = array.length; i < len; i++) {
                var item = array[i];
                if (item.id === id)
                    return item;
            }
        }
        ArrayExtensions.findWithId = findWithId;
        function withId(id) {
            return ArrayExtensions.findWithId(this, id);
        }
        function createWithName() {
            return extendWithName([]);
        }
        ArrayExtensions.createWithName = createWithName;
        function extendWithName(array) {
            debug.assertValue(array, 'array');
            var extended = array;
            extended.withName = withName;
            return extended;
        }
        ArrayExtensions.extendWithName = extendWithName;
        function findItemWithName(array, name) {
            var index = indexWithName(array, name);
            if (index >= 0)
                return array[index];
        }
        ArrayExtensions.findItemWithName = findItemWithName;
        function indexWithName(array, name) {
            for (var i = 0, len = array.length; i < len; i++) {
                var item = array[i];
                if (item.name === name)
                    return i;
            }
            return -1;
        }
        ArrayExtensions.indexWithName = indexWithName;
        /** Finds and returns the first item with a matching name. */
        function withName(name) {
            var array = this;
            return findItemWithName(array, name);
        }
        /** Deletes all items from the array.*/
        function clear(array) {
            // Not using splice due to the array creation involved in it. 
            array.length = 0;
        }
        ArrayExtensions.clear = clear;
        function isUndefinedOrEmpty(array) {
            if (!array || array.length === 0) {
                return true;
            }
            return false;
        }
        ArrayExtensions.isUndefinedOrEmpty = isUndefinedOrEmpty;
    })(ArrayExtensions = jsCommon.ArrayExtensions || (jsCommon.ArrayExtensions = {}));
})(jsCommon || (jsCommon = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var DomFactory;
    (function (DomFactory) {
        function div() {
            return $('<div/>');
        }
        DomFactory.div = div;
        function span() {
            return $('<span/>');
        }
        DomFactory.span = span;
        function checkbox() {
            return $('<input type="checkbox"/>');
        }
        DomFactory.checkbox = checkbox;
        function ul() {
            return $('<ul/>');
        }
        DomFactory.ul = ul;
        function li() {
            return $('<li/>');
        }
        DomFactory.li = li;
        function button() {
            return $('<input type="button"/>');
        }
        DomFactory.button = button;
        function select() {
            return $('<select/>');
        }
        DomFactory.select = select;
        function textBox() {
            return $('<input type="text"/>');
        }
        DomFactory.textBox = textBox;
        function img() {
            return $('<img/>');
        }
        DomFactory.img = img;
        function iframe() {
            return $('<iframe/>');
        }
        DomFactory.iframe = iframe;
    })(DomFactory = InJs.DomFactory || (InJs.DomFactory = {}));
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var jsCommon;
(function (jsCommon) {
    /** The modal dialog client side control */
    var ModalDialog = (function () {
        /**
         * ModalDialog is currently used for showing initialization error messages and hence
         * we need to be careful about what code do we put here. For example IE8 does not support
         * generic defineProperty and thus ModalDialog or parent classes cannot contain any properties.
         */
        function ModalDialog(dialogHost) {
            var _this = this;
            // Fields
            this._modalContainer = null;
            this._modalDialogElement = null;
            this._dialogTitle = null;
            this._dialogCloseButton = null;
            this._dialogContent = null;
            this._dialogActions = null;
            this._messageQueue = new Array();
            this._isReady = false;
            this._messageCurrentlyShown = false;
            $(document).ready(function () {
                _this._modalContainer = $(ModalDialog.ModalDialogHtml);
                _this._modalDialogElement = _this._modalContainer.find(ModalDialog.modalDialogClassSelector);
                _this._dialogTitle = _this._modalContainer.find(ModalDialog.dialogTitleClassSelector);
                _this._dialogCloseButton = _this._modalContainer.find(ModalDialog.dialogCloseIconClassSelector);
                _this._dialogContent = _this._modalContainer.find(ModalDialog.dialogContentClassSelector);
                _this._dialogActions = _this._modalContainer.find(ModalDialog.dialogActionsClassSelector);
                // Do not use bind here as we need this control to work in IE8 and IE8 does not support bind
                var that = _this;
                _this._dialogCloseButton.on(jsCommon.DOMConstants.mouseClickEventName, function () { return that.hideDialog(); });
                if (!dialogHost) {
                    var containerHost = $(ModalDialog.modalDialogContainerHostClassSelector);
                    // Remove modal container host if it already exists
                    if (containerHost && containerHost.length > 0)
                        containerHost.remove();
                    containerHost = InJs.DomFactory.div().addClass(ModalDialog.modalDialogContainerHostClassName);
                    dialogHost = $(jsCommon.DOMConstants.DocumentBody).append(containerHost);
                    dialogHost = containerHost;
                }
                dialogHost.append(_this._modalContainer);
                _this._isReady = true;
                if (_this._messageQueue.length > 0) {
                    _this.showDialogInternal(_this._messageQueue.shift());
                }
            });
        }
        /**
         * Displays a dismissable message to the user
         * The only action available to the user is "Close"
         * @param messageTitle - The title of the dialog
         * @param messageText - The message to display to the user
         */
        ModalDialog.prototype.showMessage = function (messageTitle, messageText) {
            var _this = this;
            jsCommon.Utility.throwIfNullOrEmptyString(messageTitle, null, 'ShowMessage', 'messageTitle');
            jsCommon.Utility.throwIfNullOrEmptyString(messageText, null, 'ShowMessage', 'messageText');
            var actions = [];
            actions[0] = this.createButton(InJs.Strings.dialogCloseActionLabel, function (sender, dialogHost) {
                _this.hideDialog();
            });
            this.pushMessage(messageTitle, messageText, null, actions, true, null);
        };
        /**
         * Displays a customizable prompt to the user
         * @param promptTitle - The tile of the prompt dialog
         * @param promptText - The message to display to the user
         * @param promptActions - An array of ModalDialogAction objects describing the possible actions in the prompt
         * @param isDismissable - Whether the dialog should include a close button
         */
        ModalDialog.prototype.showPrompt = function (promptTitle, promptText, promptActions, isDismissable) {
            jsCommon.Utility.throwIfNullOrEmptyString(promptTitle, null, 'ShowPrompt', 'promptTitle');
            jsCommon.Utility.throwIfNullOrEmptyString(promptText, null, 'ShowPrompt', 'promptText');
            jsCommon.Utility.throwIfNullOrUndefined(promptActions, null, 'ShowPrompt', 'promptActions');
            var actionButtons = new Array();
            for (var i = 0; i < promptActions.length; i++) {
                var thisAction = promptActions[i];
                var cssClass = thisAction.cssClass;
                if (i === 0) {
                    cssClass = cssClass + ' primary';
                }
                actionButtons[i] = this.createButton(thisAction.labelText, thisAction.actionCallback, thisAction.data, cssClass, thisAction.disabled);
            }
            this.pushMessage(promptTitle, promptText, null, actionButtons, isDismissable, null);
        };
        /**
         * Displays an error message to the user
         * @param errorText - The message to display to the user
         * @param errorType - The type of error be displayed to the user
         * @param request - The (optional) request that triggered the error for showing additional technical details
         */
        ModalDialog.prototype.showError = function (errorText, errorType, additionalErrorInfo, afterDismissCallback, dialogOptions) {
            this.showCustomError(InJs.Strings.errorDialogTitle, errorText, errorType, errorType !== 6 /* Fatal */, additionalErrorInfo, afterDismissCallback, dialogOptions);
        };
        /**
         * Displays an error message to the user
         * @param errorTitle - The title to display to the user
         * @param errorText - The message to display to the user
         * @param errorType - The type of error be displayed to the user
         * @param request - The (optional) request that triggered the error for showing additional technical details
         */
        ModalDialog.prototype.showCustomError = function (errorTitle, errorText, errorType, isDismissable, additionalErrorInfo, afterDismissCallback, dialogOptions) {
            var _this = this;
            jsCommon.Utility.throwIfNullOrEmptyString(errorTitle, null, 'ShowError', 'errorTitle');
            jsCommon.Utility.throwIfNullOrEmptyString(errorText, null, 'ShowError', 'errorText');
            var actions = new Array();
            if (dialogOptions) {
                dialogOptions.forEach(function (element, index, array) {
                    actions.push(_this.createButton(element.label, function (sender, dialogHost) {
                        _this.hideDialog();
                        if ($.isFunction(afterDismissCallback)) {
                            afterDismissCallback(element.resultValue);
                        }
                    }));
                });
            }
            else if (errorType !== 6 /* Fatal */) {
                actions[0] = this.createButton(InJs.Strings.dialogCloseActionLabel, function (sender, dialogHost) {
                    _this.hideDialog();
                    if ($.isFunction(afterDismissCallback)) {
                        afterDismissCallback(0);
                    }
                });
            }
            else {
                actions[0] = this.createButton(InJs.Strings.dialogRefreshPageActionLabel, function (sender, dialogHost) {
                    window.location.reload();
                }, null, 'primary');
            }
            var dialogContent = $('<div/>').text(errorText);
            this.addAdditionalErrorInfo(dialogContent, additionalErrorInfo);
            this.pushMessage(errorTitle || InJs.Strings.errorDialogTitle, null, dialogContent, actions, isDismissable, null);
        };
        /**
         * Displays a custom message to the user
         * @param titleText - The tile of the custom dialog
         * @param messageContent - The html element to display to the user
         * @param dialogActions - An array of ModalDialogAction objects describing the possible actions in the prompt
         * @param onDialogDisplayed - Callback invoked when the modal dialog is displayed
         * @param isDismissable - Whether the dialog is dismissable
         * @param focusOnFirstButton - Whether to focus on the first button after the dialog presents
         * @returns The host element for the dialog
         */
        ModalDialog.prototype.showCustomDialog = function (titleText, dialogContent, dialogActions, onDialogDisplayed, isDismissable, focusOnFirstButton, dialogCssClass) {
            if (dialogCssClass) {
                this._modalDialogElement.addClass(dialogCssClass);
                this._modalDialogCustomClass = dialogCssClass;
            }
            var actionsButtons = [];
            for (var i = 0; i < dialogActions.length; i++) {
                var thisAction = dialogActions[i];
                var cssClass = thisAction.cssClass;
                if (i === 0) {
                    cssClass = cssClass + ' primary';
                }
                actionsButtons[i] = this.createButton(thisAction.labelText, thisAction.actionCallback, thisAction.data, cssClass, thisAction.disabled);
            }
            this.pushMessage(titleText, null, dialogContent, actionsButtons, isDismissable, onDialogDisplayed, focusOnFirstButton);
            return this._dialogContent;
        };
        /** Hides the current contents of the modal dialog */
        ModalDialog.prototype.hideDialog = function () {
            var _this = this;
            this._modalContainer.fadeTo(ModalDialog.AnimationSpeedMs, 0, function () {
                _this._modalContainer.css(jsCommon.CssConstants.displayProperty, jsCommon.CssConstants.noneValue);
                _this._modalDialogElement.removeClass(_this._modalDialogCustomClass);
                _this._messageCurrentlyShown = false;
                if (_this._messageQueue.length) {
                    var nextMessage = _this._messageQueue.shift();
                    _this.showDialogInternal(nextMessage);
                }
            });
        };
        ModalDialog.prototype.updatePosition = function (animate) {
            var modalDialogHeight = this._modalDialogElement.height();
            if (animate) {
                this._modalDialogElement.animate({ 'margin-top': (-1 * (modalDialogHeight / 2)).toString() + jsCommon.CssConstants.pixelUnits }, ModalDialog.AnimationSpeedMs);
            }
            else {
                this._modalDialogElement.css(jsCommon.CssConstants.marginTopProperty, (-1 * (modalDialogHeight / 2)).toString() + jsCommon.CssConstants.pixelUnits);
            }
        };
        ModalDialog.prototype.addAdditionalErrorInfo = function (dialogContent, additionalErrorInfoKeyValuePairs) {
            var _this = this;
            if (additionalErrorInfoKeyValuePairs) {
                var additionalErrorInfo = $('<p />');
                for (var i = 0; i < additionalErrorInfoKeyValuePairs.length; i++) {
                    additionalErrorInfo.append(InJs.InfoNavUtility.constructErrorField(additionalErrorInfoKeyValuePairs[i].errorInfoKey, additionalErrorInfoKeyValuePairs[i].errorInfoValue));
                }
                var additionalErrorInfoContainer = InJs.InfoNavUtility.constructShowDetailsContainer(additionalErrorInfo);
                dialogContent.append($('<br />'));
                dialogContent.append(additionalErrorInfoContainer);
                dialogContent.find('.showAdditionalDetailsLink').on(jsCommon.DOMConstants.mouseClickEventName, function (e) {
                    _this.updatePosition(true);
                });
            }
        };
        ModalDialog.prototype.pushMessage = function (titleText, messageText, dialogContent, dialogButtons, isDismissable, onDialogDisplayed, focusOnFirstButton) {
            if (typeof isDismissable === 'undefined') {
                isDismissable = true;
            }
            var nextMessage = new QueueableMessage();
            nextMessage.titleText = titleText;
            nextMessage.messageText = messageText;
            nextMessage.dialogContent = dialogContent;
            nextMessage.dialogButtons = dialogButtons;
            nextMessage.onDialogDisplayed = onDialogDisplayed;
            nextMessage.isDismissable = isDismissable;
            this._messageQueue.push(nextMessage);
            if (!this._messageCurrentlyShown && this._isReady) {
                this.showDialogInternal(this._messageQueue.shift(), focusOnFirstButton);
            }
        };
        ModalDialog.prototype.showDialogInternal = function (message, focusOnFirstButton) {
            var _this = this;
            this._messageCurrentlyShown = true;
            this._dialogTitle.empty();
            this._dialogContent.empty();
            this._dialogActions.empty();
            this._dialogTitle.text(message.titleText);
            // if there was not a string message provided, render using DialogContent
            if (jsCommon.StringExtensions.isNullOrEmpty(message.messageText)) {
                this._dialogContent.append(message.dialogContent);
            }
            else {
                this._dialogContent.text(message.messageText);
            }
            if (message.isDismissable) {
                this._dialogCloseButton.css(jsCommon.CssConstants.displayProperty, jsCommon.CssConstants.blockValue);
            }
            else {
                this._dialogCloseButton.css(jsCommon.CssConstants.displayProperty, jsCommon.CssConstants.noneValue);
            }
            if (message.dialogButtons.length > 0) {
                this._dialogActions.show();
                for (var i = 0; i < message.dialogButtons.length; i++) {
                    this._dialogActions.append(message.dialogButtons[i]);
                }
            }
            else {
                this._dialogActions.hide();
            }
            var fadingElem = (this._modalContainer.css(jsCommon.CssConstants.displayProperty) === jsCommon.CssConstants.noneValue) ? this._modalContainer : this._modalDialogElement;
            fadingElem.fadeTo(0, 0);
            this.updatePosition(false);
            fadingElem.fadeTo(ModalDialog.AnimationSpeedMs, 1, function () {
                // Steal the focus away from whatever else is happening
                _this._modalDialogElement.focus();
                var buttons = _this._dialogActions.find("input");
                if (buttons.length > 0) {
                    buttons[0].focus();
                }
                if (message.onDialogDisplayed) {
                    message.onDialogDisplayed(_this._dialogContent);
                }
                if (focusOnFirstButton) {
                    _this._dialogContent.parent().find('.infonav-dialogActions input[type=button]:first').focus();
                }
            });
        };
        ModalDialog.prototype.createButton = function (labelText, action, data, cssClass, disabled) {
            var _this = this;
            var button = $(ModalDialog.NewButtonSelector);
            button.attr('value', labelText);
            button.on(jsCommon.DOMConstants.mouseClickEventName, function (e) {
                action(button, _this._dialogContent, data);
            });
            if (cssClass) {
                button.addClass(cssClass);
            }
            if (disabled) {
                button.prop("disabled", true);
            }
            return button;
        };
        // Constants
        ModalDialog.AnimationSpeedMs = 250;
        ModalDialog.modalDialogCssClass = 'infonav-modalDialog';
        ModalDialog.dialogTitleCssClass = 'infonav-dialogTitle';
        ModalDialog.dialogCloseIconCssClass = 'infonav-dialogCloseIcon';
        ModalDialog.dialogContentCssClass = 'infonav-dialogContent';
        ModalDialog.dialogActionsCssClass = 'infonav-dialogActions';
        ModalDialog.modalDialogClassSelector = '.' + ModalDialog.modalDialogCssClass;
        ModalDialog.dialogTitleClassSelector = '.' + ModalDialog.dialogTitleCssClass;
        ModalDialog.dialogCloseIconClassSelector = '.' + ModalDialog.dialogCloseIconCssClass;
        ModalDialog.dialogContentClassSelector = '.' + ModalDialog.dialogContentCssClass;
        ModalDialog.dialogActionsClassSelector = '.' + ModalDialog.dialogActionsCssClass;
        ModalDialog.modalDialogContainerHostClassName = 'infonav-modalContainerHost';
        ModalDialog.modalDialogContainerHostClassSelector = '.' + ModalDialog.modalDialogContainerHostClassName;
        ModalDialog.ModalDialogHtml = '<div class="infonav-modalContainer' + (location.search.indexOf('renderAsModalDialog') !== -1 ? ' small' : '') + '">' + '<div class="' + ModalDialog.modalDialogCssClass + '" tabindex="-1">' + '<div class="infonav-dialogLayout">' + '<div class="' + ModalDialog.dialogTitleCssClass + '"></div>' + '<div class="' + ModalDialog.dialogCloseIconCssClass + '"></div>' + '<div class="' + ModalDialog.dialogContentCssClass + '"></div>' + '<div class="' + ModalDialog.dialogActionsCssClass + '"></div>' + '</div>' + '</div>' + '</div>';
        ModalDialog.NewButtonSelector = '<input type="button"></input>';
        return ModalDialog;
    })();
    jsCommon.ModalDialog = ModalDialog;
    var QueueableMessage = (function () {
        function QueueableMessage() {
            this.titleText = null;
            this.messageText = null;
            this.dialogContent = null;
            this.dialogButtons = null;
            this.onDialogDisplayed = null;
            this.isDismissable = true;
        }
        return QueueableMessage;
    })();
})(jsCommon || (jsCommon = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** This class represents an action, bound to a button, inside a modal dialog */
    var ModalDialogAction = (function () {
        function ModalDialogAction(labelText, actionCallback, data, cssClass, disabled) {
            this.labelText = labelText;
            this.actionCallback = actionCallback;
            this.data = data;
            this.cssClass = cssClass;
            this.disabled = !!disabled;
        }
        return ModalDialogAction;
    })();
    InJs.ModalDialogAction = ModalDialogAction;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var jsCommon;
(function (jsCommon) {
    var color;
    (function (_color) {
        function rotate(rgbString, rotateFactor) {
            if (rotateFactor === 0)
                return rgbString;
            var originalRgb = parseRgb(rgbString);
            var originalHsv = rgbToHsv(originalRgb);
            var rotatedHsv = rotateHsv(originalHsv, rotateFactor);
            var rotatedRgb = hsvToRgb(rotatedHsv);
            return rgbToHexString(rotatedRgb);
        }
        _color.rotate = rotate;
        function parseRgb(rgbString) {
            jsCommon.Utility.throwIfNullOrEmpty(rgbString, 'RgbColor', 'parse', 'rgbString');
            jsCommon.Utility.throwIfNotTrue(rgbString.length === 7, 'RgbColor', 'parse', 'rgbString');
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(rgbString);
            jsCommon.Utility.throwIfNullOrUndefined(result, 'RgbColor', 'parse', 'rgbString');
            return {
                R: parseInt(result[1], 16),
                G: parseInt(result[2], 16),
                B: parseInt(result[3], 16)
            };
        }
        _color.parseRgb = parseRgb;
        function rgbToHsv(rgbColor) {
            var s, h;
            var r = rgbColor.R / 255, g = rgbColor.G / 255, b = rgbColor.B / 255;
            var min = Math.min(r, Math.min(g, b));
            var max = Math.max(r, Math.max(g, b));
            var v = max;
            var delta = max - min;
            if (max === 0 || delta === 0) {
                // R, G, and B must be 0.0, or all the same.
                // In this case, S is 0.0, and H is undefined.
                // Using H = 0.0 is as good as any...
                s = 0;
                h = 0;
            }
            else {
                s = delta / max;
                if (r === max) {
                    // Between Yellow and Magenta
                    h = (g - b) / delta;
                }
                else if (g === max) {
                    // Between Cyan and Yellow
                    h = 2 + (b - r) / delta;
                }
                else {
                    // Between Magenta and Cyan
                    h = 4 + (r - g) / delta;
                }
            }
            // Scale h to be between 0.0 and 1.
            // This may require adding 1, if the value
            // is negative.
            h /= 6;
            if (h < 0) {
                h += 1;
            }
            return {
                H: h,
                S: s,
                V: v,
            };
        }
        function rgbToHexString(rgbColor) {
            return "#" + componentToHex(rgbColor.R) + componentToHex(rgbColor.G) + componentToHex(rgbColor.B);
        }
        _color.rgbToHexString = rgbToHexString;
        function componentToHex(hexComponent) {
            var hex = hexComponent.toString(16).toUpperCase();
            return hex.length === 1 ? "0" + hex : hex;
        }
        function hsvToRgb(hsvColor) {
            var r, g, b;
            var h = hsvColor.H, s = hsvColor.S, v = hsvColor.V;
            if (s === 0) {
                // If s is 0, all colors are the same.
                // This is some flavor of gray.
                r = v;
                g = v;
                b = v;
            }
            else {
                var p, q, t, fractionalSector, sectorNumber, sectorPos;
                // The color wheel consists of 6 sectors.
                // Figure out which sector you//re in.
                sectorPos = h * 6;
                sectorNumber = Math.floor(sectorPos);
                // get the fractional part of the sector.
                // That is, how many degrees into the sector
                // are you?
                fractionalSector = sectorPos - sectorNumber;
                // Calculate values for the three axes
                // of the color.
                p = v * (1.0 - s);
                q = v * (1.0 - (s * fractionalSector));
                t = v * (1.0 - (s * (1 - fractionalSector)));
                switch (sectorNumber) {
                    case 0:
                        r = v;
                        g = t;
                        b = p;
                        break;
                    case 1:
                        r = q;
                        g = v;
                        b = p;
                        break;
                    case 2:
                        r = p;
                        g = v;
                        b = t;
                        break;
                    case 3:
                        r = p;
                        g = q;
                        b = v;
                        break;
                    case 4:
                        r = t;
                        g = p;
                        b = v;
                        break;
                    case 5:
                        r = v;
                        g = p;
                        b = q;
                        break;
                }
            }
            return {
                R: Math.floor(r * 255),
                G: Math.floor(g * 255),
                B: Math.floor(b * 255),
            };
        }
        function rotateHsv(hsvColor, rotateFactor) {
            var newH = hsvColor.H + rotateFactor;
            return {
                H: newH > 1 ? newH - 1 : newH,
                S: hsvColor.S,
                V: hsvColor.V,
            };
        }
        function darken(color, diff) {
            var flooredNumber = Math.floor(diff);
            return {
                R: Math.max(0, color.R - flooredNumber),
                G: Math.max(0, color.G - flooredNumber),
                B: Math.max(0, color.B - flooredNumber),
            };
        }
        _color.darken = darken;
        function rgbWithAlphaString(color, a) {
            return rgbaString(color.R, color.G, color.B, a);
        }
        _color.rgbWithAlphaString = rgbWithAlphaString;
        function rgbString(color) {
            return "rgb(" + color.R + "," + color.G + "," + color.B + ")";
        }
        _color.rgbString = rgbString;
        function rgbaString(r, g, b, a) {
            return "rgba(" + r + "," + g + "," + b + "," + a + ")";
        }
        _color.rgbaString = rgbaString;
        function rgbStringToHexString(rgb) {
            debug.assert(rgb.indexOf('rgb(') !== -1, "input string does not starts with('rgb(')");
            var rgbColors = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/;
            var rgbArr = rgbColors.exec(rgb);
            if (rgbArr) {
                return rgbNumbersToHexString(rgbArr[1], rgbArr[2], rgbArr[3]);
            }
            return '';
        }
        _color.rgbStringToHexString = rgbStringToHexString;
        function rgbaStringToHexString(rgba) {
            debug.assert(rgba.indexOf('rgba(') !== -1, "input string does not starts with('rgba(')");
            var rgbColors = /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*(?:\.\d+)?)\)$/;
            var rgbArr = rgbColors.exec(rgba);
            if (rgbArr) {
                return rgbNumbersToHexString(rgbArr[1], rgbArr[2], rgbArr[3]);
            }
            return '';
        }
        _color.rgbaStringToHexString = rgbaStringToHexString;
        function rgbNumbersToHexString(Red, Green, Blue) {
            var rHex = parseInt(Red, 10).toString(16);
            var gHex = parseInt(Green, 10).toString(16);
            var bHex = parseInt(Blue, 10).toString(16);
            return "#" + (rHex.length === 1 ? "0" + rHex : rHex) + (gHex.length === 1 ? "0" + gHex : gHex) + (bHex.length === 1 ? "0" + bHex : bHex);
        }
    })(color = jsCommon.color || (jsCommon.color = {}));
})(jsCommon || (jsCommon = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var jsCommon;
(function (jsCommon) {
    /** CSS constants */
    var CssConstants;
    (function (CssConstants) {
        CssConstants.styleAttribute = 'style';
        CssConstants.pixelUnits = 'px';
        CssConstants.heightProperty = 'height';
        CssConstants.widthProperty = 'width';
        CssConstants.topProperty = 'top';
        CssConstants.bottomProperty = 'bottom';
        CssConstants.leftProperty = 'left';
        CssConstants.rightProperty = 'right';
        CssConstants.marginTopProperty = 'margin-top';
        CssConstants.marginLeftProperty = 'margin-left';
        CssConstants.displayProperty = 'display';
        CssConstants.backgroundProperty = 'background';
        CssConstants.backgroundColorProperty = 'background-color';
        CssConstants.backgroundRepeatProperty = 'background-repeat';
        CssConstants.backgroundSizeProperty = 'background-size';
        CssConstants.backgroundImageProperty = 'background-image';
        CssConstants.textShadowProperty = 'text-shadow';
        CssConstants.borderTopWidthProperty = 'border-top-width';
        CssConstants.borderBottomWidthProperty = 'border-bottom-width';
        CssConstants.borderLeftWidthProperty = 'border-left-width';
        CssConstants.borderRightWidthProperty = 'border-right-width';
        CssConstants.fontWeightProperty = 'font-weight';
        CssConstants.colorProperty = 'color';
        CssConstants.opacityProperty = 'opacity';
        CssConstants.paddingLeftProperty = 'padding-left';
        CssConstants.paddingRightProperty = 'padding-right';
        CssConstants.positionProperty = 'position';
        CssConstants.maxWidthProperty = 'max-width';
        CssConstants.minWidthProperty = 'min-width';
        CssConstants.overflowProperty = 'overflow';
        CssConstants.cursorProperty = 'cursor';
        CssConstants.visibilityProperty = 'visibility';
        CssConstants.absoluteValue = 'absolute';
        CssConstants.zeroPixelValue = '0px';
        CssConstants.autoValue = 'auto';
        CssConstants.hiddenValue = 'hidden';
        CssConstants.noneValue = 'none';
        CssConstants.blockValue = 'block';
        CssConstants.inlineBlockValue = 'inline-block';
        CssConstants.transparentValue = 'transparent';
        CssConstants.boldValue = 'bold';
        CssConstants.visibleValue = 'visible';
        CssConstants.tableRowValue = 'table-row';
        CssConstants.coverValue = 'cover';
        CssConstants.pointerValue = 'pointer';
    })(CssConstants = jsCommon.CssConstants || (jsCommon.CssConstants = {}));
})(jsCommon || (jsCommon = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var jsCommon;
(function (jsCommon) {
    /** DOM constants */
    var DOMConstants;
    (function (DOMConstants) {
        /** Integer codes corresponding to individual keys on the keyboard */
        DOMConstants.escKeyCode = 27;
        DOMConstants.enterKeyCode = 13;
        DOMConstants.tabKeyCode = 9;
        DOMConstants.upArrowKeyCode = 38;
        DOMConstants.downArrowKeyCode = 40;
        DOMConstants.leftArrowKeyCode = 37;
        DOMConstants.rightArrowKeyCode = 39;
        DOMConstants.homeKeyCode = 36;
        DOMConstants.endKeyCode = 35;
        DOMConstants.backSpaceKeyCode = 8;
        DOMConstants.deleteKeyCode = 46;
        DOMConstants.spaceKeyCode = 32;
        DOMConstants.shiftKeyCode = 16;
        DOMConstants.ctrlKeyCode = 17;
        DOMConstants.altKeyCode = 18;
        DOMConstants.aKeyCode = 65;
        DOMConstants.cKeyCode = 67;
        DOMConstants.vKeyCode = 86;
        DOMConstants.xKeyCode = 88;
        DOMConstants.yKeyCode = 89;
        DOMConstants.zKeyCode = 90;
        /** DOM Elements */
        DOMConstants.DocumentBody = 'body';
        DOMConstants.Anchor = 'a';
        DOMConstants.EditableTextElements = 'input, textarea, select';
        /** DOM Attributes and values */
        DOMConstants.disabledAttributeOrValue = 'disabled';
        DOMConstants.readonlyAttributeOrValue = 'readonly';
        DOMConstants.styleAttribute = 'style';
        DOMConstants.hrefAttribute = 'href';
        DOMConstants.targetAttribute = 'target';
        DOMConstants.blankValue = '_blank';
        DOMConstants.classAttribute = 'class';
        DOMConstants.titleAttribute = 'title';
        DOMConstants.srcAttribute = 'src';
        /** DOM event names */
        DOMConstants.contextmenuEventName = 'contextmenu';
        DOMConstants.blurEventName = 'blur';
        DOMConstants.keyUpEventName = 'keyup';
        DOMConstants.inputEventName = 'input';
        DOMConstants.changeEventName = 'change';
        DOMConstants.cutEventName = 'cut';
        DOMConstants.keyDownEventName = 'keydown';
        DOMConstants.mouseMoveEventName = 'mousemove';
        DOMConstants.mouseDownEventName = 'mousedown';
        DOMConstants.mouseEnterEventName = 'mouseenter';
        DOMConstants.mouseLeaveEventName = 'mouseleave';
        DOMConstants.mouseOverEventName = 'mouseover';
        DOMConstants.mouseOutEventName = 'mouseout';
        DOMConstants.mouseClickEventName = 'click';
        DOMConstants.pasteEventName = 'paste';
        DOMConstants.scrollEventName = 'scroll';
        DOMConstants.dropEventName = 'drop';
        DOMConstants.focusInEventName = 'focusin';
        DOMConstants.focusOutEventName = 'focusout';
        DOMConstants.selectEventName = 'select';
        DOMConstants.messageEventName = 'message';
        DOMConstants.loadEventName = 'load';
        DOMConstants.beforeUnload = 'beforeunload';
        /** Common DOM event combination names */
        DOMConstants.inputAndSelectEventNames = 'input, select';
    })(DOMConstants = jsCommon.DOMConstants || (jsCommon.DOMConstants = {}));
})(jsCommon || (jsCommon = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
/**
 * Defines a Debug object.  Calls to any functions in this object removed by the minifier.
 * The functions within this class are not minified away, so we use the preprocessor-style
 * comments to have the minifier remove those as well.
 */
///#DEBUG
var debug;
(function (debug) {
    debug.assertFailFunction;
    /** Asserts that the condition is true, fails otherwise. */
    function assert(condition, message) {
        if (condition !== true) {
            assertFail(message || ('condition: ' + condition));
        }
    }
    debug.assert = assert;
    /** Asserts that the value is neither null nor undefined, fails otherwise. */
    function assertValue(value, message) {
        if (value === null || value === undefined) {
            assertFail(message || ('condition: ' + value));
        }
    }
    debug.assertValue = assertValue;
    /** Makes no assertion on the given value.  This is documentation/placeholder that a value is possibly null or undefined (unlike assertValue).  */
    function assertAnyValue(value, message) {
    }
    debug.assertAnyValue = assertAnyValue;
    function assertFail(message) {
        (debug.assertFailFunction || alert)('Debug Assert failed: ' + message);
    }
    debug.assertFail = assertFail;
})(debug || (debug = {}));
///#ENDDEBUG
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    /** Instantiates a RejectablePromise that wraps the given Deferred object. */
    function RejectablePromise2(deferred) {
        return new RejectablePromiseImpl(deferred);
    }
    powerbi.RejectablePromise2 = RejectablePromise2;
    function RejectablePromise(deferred) {
        return new RejectablePromiseImpl(deferred);
    }
    powerbi.RejectablePromise = RejectablePromise;
    /** enumeration of promise states */
    var promiseState;
    (function (promiseState) {
        promiseState[promiseState["pending"] = 0] = "pending";
        promiseState[promiseState["resolved"] = 1] = "resolved";
        promiseState[promiseState["rejected"] = 2] = "rejected";
    })(promiseState || (promiseState = {}));
    var RejectablePromiseImpl = (function () {
        function RejectablePromiseImpl(deferred) {
            var _this = this;
            debug.assertValue(deferred, 'deferred');
            this.deferred = deferred;
            this.state = 0 /* pending */;
            deferred.promise.then(function () { return _this.state = 1 /* resolved */; }, function () { return _this.state = 2 /* rejected */; });
        }
        /**
         * Regardless of when the promise was or will be resolved or rejected, then calls one of the success or error callbacks asynchronously as soon as the result is available. The callbacks are called with a single argument: the result or rejection reason. Additionally, the notify callback may be called zero or more times to provide a progress indication, before the promise is resolved or rejected.
         * This method returns a new promise which is resolved or rejected via the return value of the successCallback, errorCallback.
         */
        RejectablePromiseImpl.prototype.then = function (successCallback, errorCallback) {
            return this.deferred.promise.then(successCallback, errorCallback);
        };
        /** Shorthand for promise.then(null, errorCallback) */
        RejectablePromiseImpl.prototype.catch = function (callback) {
            return this.deferred.promise.catch(callback);
        };
        /**
         * Allows you to observe either the fulfillment or rejection of a promise, but to do so without modifying the final value. This is useful to release resources or do some clean-up that needs to be done whether the promise was rejected or resolved. See the full specification for more information.
         * Because finally is a reserved word in JavaScript and reserved keywords are not supported as property names by ES3, you'll need to invoke the method like promise['finally'](callback) to make your code IE8 and Android 2.x compatible.
         */
        RejectablePromiseImpl.prototype.finally = function (callback) {
            return this.deferred.promise.finally(callback);
        };
        /**
         * Indicates if a promise is resolved.
         */
        RejectablePromiseImpl.prototype.resolved = function () {
            return this.state === 1 /* resolved */;
        };
        /**
         * Indicates if a promise is rejected.
         */
        RejectablePromiseImpl.prototype.rejected = function () {
            return this.state === 2 /* rejected */;
        };
        /**
         * Indicates if a promise is pending. A promise is pending if it is not rejected or resolved.
         */
        RejectablePromiseImpl.prototype.pending = function () {
            return this.state === 0 /* pending */;
        };
        /**
         * Rejects a pending promise
         */
        RejectablePromiseImpl.prototype.reject = function (reason) {
            if (this.pending()) {
                this.deferred.reject(reason);
                this.state = 2 /* rejected */;
            }
        };
        return RejectablePromiseImpl;
    })();
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var jsCommon;
(function (jsCommon) {
    /** Extensions to Date class */
    var DateExtensions;
    (function (DateExtensions) {
        var datePrefix = '/Date(';
        var dateSuffix = ')\/';
        /** Formats the date, omitting the time portion, if midnight. */
        function formatAbsolute(date) {
            debug.assertValue(date, 'date');
            if (DateExtensions.isMidnight(date)) {
                return date.toLocaleDateString();
            }
            return date.toLocaleString();
        }
        DateExtensions.formatAbsolute = formatAbsolute;
        /** Formats the date, preferably showing the elapsed time if possible, falling back on an absolute date. */
        function formatPretty(date) {
            debug.assertValue(date, 'date');
            if (DateExtensions.isMomentPresent()) {
                return moment(date).fromNow();
            }
            return formatAbsolute(date);
        }
        DateExtensions.formatPretty = formatPretty;
        var milisecondsPerHour = 3600 * 1000;
        var millisecondsPerDay = 24 * milisecondsPerHour;
        /** Gets a value indicating whether the specified date has a midnight time portion. */
        function isMidnight(date) {
            debug.assertValue(date, 'date');
            return (date.getTime() % millisecondsPerDay) === 0;
        }
        DateExtensions.isMidnight = isMidnight;
        /** returns the number of elapsed seconds from a given date to now. */
        function elapsedToNow(date, units) {
            debug.assertValue(date, 'date');
            var from = moment(date);
            return (moment().diff(from, units));
        }
        DateExtensions.elapsedToNow = elapsedToNow;
        /** Returns whether moment is present */
        function isMomentPresent() {
            return typeof moment !== 'undefined';
        }
        DateExtensions.isMomentPresent = isMomentPresent;
        /**
         * Parses an ISO 8601 formatted date string and creates a Date object.
         * If timezone information is not present in the date the local timezone will be assumed.
         */
        function parseIsoDate(isoDate) {
            debug.assert(isMomentPresent(), 'Moment.js should be loaded for parseIsoDate.');
            return moment(isoDate).toDate();
        }
        DateExtensions.parseIsoDate = parseIsoDate;
        function parseUtcDate(isoDate) {
            debug.assert(isMomentPresent(), 'Moment.js should be loaded for parseIsoDate.');
            return moment.utc(isoDate).toDate();
        }
        DateExtensions.parseUtcDate = parseUtcDate;
        function fromNow(date) {
            return moment(date).fromNow();
        }
        DateExtensions.fromNow = fromNow;
        function serializeDate(date) {
            debug.assertValue(date, 'date');
            return datePrefix + date.getTime().toString() + dateSuffix;
        }
        DateExtensions.serializeDate = serializeDate;
        function deserializeDate(data) {
            jsCommon.Utility.throwIfNullOrEmptyString(data, null, 'deserializeDate', 'Cannot deserialize empty string');
            jsCommon.Utility.throwIfNotTrue(data.indexOf(datePrefix) === 0 && jsCommon.StringExtensions.endsWith(data, dateSuffix), null, 'deserializeDate', 'Cannot deserialize empty string');
            if (DateExtensions.isMomentPresent()) {
                // Prefer to use moment, which has a more complete implementation.
                var parsedValue = moment(data);
                jsCommon.Utility.throwIfNotTrue(parsedValue.isValid(), null, 'deserializeDate', 'parsedValue.isValid must be true');
                return parsedValue.toDate();
            }
            var ticksString = data.substring(datePrefix.length, data.length - dateSuffix.length);
            jsCommon.Utility.throwIfNotTrue(/^\-?\d+$/.test(ticksString), null, 'deserializeDate', 'Cannot deserialize invalid date');
            var ticksValue = parseInt(ticksString, 10);
            jsCommon.Utility.throwIfNotTrue(!isNaN(ticksValue), null, 'deserializeDate', 'Cannot deserialize invalid date');
            return new Date(ticksValue);
        }
        DateExtensions.deserializeDate = deserializeDate;
        function tryDeserializeDate(data) {
            try {
                return deserializeDate(data);
            }
            catch (e) {
            }
        }
        DateExtensions.tryDeserializeDate = tryDeserializeDate;
    })(DateExtensions = jsCommon.DateExtensions || (jsCommon.DateExtensions = {}));
})(jsCommon || (jsCommon = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
// File: Common\DataTypes\Double.str
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    /** Class Double contains a set of constants and precision based utility methods for dealing with doubles and their decimal garbage in the javascript */
    var Double;
    (function (Double) {
        // Constants
        Double.MIN_VALUE = -Number.MAX_VALUE;
        Double.MAX_VALUE = Number.MAX_VALUE;
        Double.MIN_EXP = -308;
        Double.MAX_EXP = 308;
        Double.EPSILON = 1E-323;
        Double.DEFAULT_PRECISION = 0.0001;
        Double.DEFAULT_PRECISION_IN_DECIMAL_DIGITS = 12;
        Double.LOG_E_10 = Math.log(10);
        Double.POSITIVE_POWERS = [
            1E0,
            1E1,
            1E2,
            1E3,
            1E4,
            1E5,
            1E6,
            1E7,
            1E8,
            1E9,
            1E10,
            1E11,
            1E12,
            1E13,
            1E14,
            1E15,
            1E16,
            1E17,
            1E18,
            1E19,
            1E20,
            1E21,
            1E22,
            1E23,
            1E24,
            1E25,
            1E26,
            1E27,
            1E28,
            1E29,
            1E30,
            1E31,
            1E32,
            1E33,
            1E34,
            1E35,
            1E36,
            1E37,
            1E38,
            1E39,
            1E40,
            1E41,
            1E42,
            1E43,
            1E44,
            1E45,
            1E46,
            1E47,
            1E48,
            1E49,
            1E50,
            1E51,
            1E52,
            1E53,
            1E54,
            1E55,
            1E56,
            1E57,
            1E58,
            1E59,
            1E60,
            1E61,
            1E62,
            1E63,
            1E64,
            1E65,
            1E66,
            1E67,
            1E68,
            1E69,
            1E70,
            1E71,
            1E72,
            1E73,
            1E74,
            1E75,
            1E76,
            1E77,
            1E78,
            1E79,
            1E80,
            1E81,
            1E82,
            1E83,
            1E84,
            1E85,
            1E86,
            1E87,
            1E88,
            1E89,
            1E90,
            1E91,
            1E92,
            1E93,
            1E94,
            1E95,
            1E96,
            1E97,
            1E98,
            1E99,
            1E100,
            1E101,
            1E102,
            1E103,
            1E104,
            1E105,
            1E106,
            1E107,
            1E108,
            1E109,
            1E110,
            1E111,
            1E112,
            1E113,
            1E114,
            1E115,
            1E116,
            1E117,
            1E118,
            1E119,
            1E120,
            1E121,
            1E122,
            1E123,
            1E124,
            1E125,
            1E126,
            1E127,
            1E128,
            1E129,
            1E130,
            1E131,
            1E132,
            1E133,
            1E134,
            1E135,
            1E136,
            1E137,
            1E138,
            1E139,
            1E140,
            1E141,
            1E142,
            1E143,
            1E144,
            1E145,
            1E146,
            1E147,
            1E148,
            1E149,
            1E150,
            1E151,
            1E152,
            1E153,
            1E154,
            1E155,
            1E156,
            1E157,
            1E158,
            1E159,
            1E160,
            1E161,
            1E162,
            1E163,
            1E164,
            1E165,
            1E166,
            1E167,
            1E168,
            1E169,
            1E170,
            1E171,
            1E172,
            1E173,
            1E174,
            1E175,
            1E176,
            1E177,
            1E178,
            1E179,
            1E180,
            1E181,
            1E182,
            1E183,
            1E184,
            1E185,
            1E186,
            1E187,
            1E188,
            1E189,
            1E190,
            1E191,
            1E192,
            1E193,
            1E194,
            1E195,
            1E196,
            1E197,
            1E198,
            1E199,
            1E200,
            1E201,
            1E202,
            1E203,
            1E204,
            1E205,
            1E206,
            1E207,
            1E208,
            1E209,
            1E210,
            1E211,
            1E212,
            1E213,
            1E214,
            1E215,
            1E216,
            1E217,
            1E218,
            1E219,
            1E220,
            1E221,
            1E222,
            1E223,
            1E224,
            1E225,
            1E226,
            1E227,
            1E228,
            1E229,
            1E230,
            1E231,
            1E232,
            1E233,
            1E234,
            1E235,
            1E236,
            1E237,
            1E238,
            1E239,
            1E240,
            1E241,
            1E242,
            1E243,
            1E244,
            1E245,
            1E246,
            1E247,
            1E248,
            1E249,
            1E250,
            1E251,
            1E252,
            1E253,
            1E254,
            1E255,
            1E256,
            1E257,
            1E258,
            1E259,
            1E260,
            1E261,
            1E262,
            1E263,
            1E264,
            1E265,
            1E266,
            1E267,
            1E268,
            1E269,
            1E270,
            1E271,
            1E272,
            1E273,
            1E274,
            1E275,
            1E276,
            1E277,
            1E278,
            1E279,
            1E280,
            1E281,
            1E282,
            1E283,
            1E284,
            1E285,
            1E286,
            1E287,
            1E288,
            1E289,
            1E290,
            1E291,
            1E292,
            1E293,
            1E294,
            1E295,
            1E296,
            1E297,
            1E298,
            1E299,
            1E300,
            1E301,
            1E302,
            1E303,
            1E304,
            1E305,
            1E306,
            1E307,
            1E308
        ];
        Double.NEGATIVE_POWERS = [
            1E0,
            1E-1,
            1E-2,
            1E-3,
            1E-4,
            1E-5,
            1E-6,
            1E-7,
            1E-8,
            1E-9,
            1E-10,
            1E-11,
            1E-12,
            1E-13,
            1E-14,
            1E-15,
            1E-16,
            1E-17,
            1E-18,
            1E-19,
            1E-20,
            1E-21,
            1E-22,
            1E-23,
            1E-24,
            1E-25,
            1E-26,
            1E-27,
            1E-28,
            1E-29,
            1E-30,
            1E-31,
            1E-32,
            1E-33,
            1E-34,
            1E-35,
            1E-36,
            1E-37,
            1E-38,
            1E-39,
            1E-40,
            1E-41,
            1E-42,
            1E-43,
            1E-44,
            1E-45,
            1E-46,
            1E-47,
            1E-48,
            1E-49,
            1E-50,
            1E-51,
            1E-52,
            1E-53,
            1E-54,
            1E-55,
            1E-56,
            1E-57,
            1E-58,
            1E-59,
            1E-60,
            1E-61,
            1E-62,
            1E-63,
            1E-64,
            1E-65,
            1E-66,
            1E-67,
            1E-68,
            1E-69,
            1E-70,
            1E-71,
            1E-72,
            1E-73,
            1E-74,
            1E-75,
            1E-76,
            1E-77,
            1E-78,
            1E-79,
            1E-80,
            1E-81,
            1E-82,
            1E-83,
            1E-84,
            1E-85,
            1E-86,
            1E-87,
            1E-88,
            1E-89,
            1E-90,
            1E-91,
            1E-92,
            1E-93,
            1E-94,
            1E-95,
            1E-96,
            1E-97,
            1E-98,
            1E-99,
            1E-100,
            1E-101,
            1E-102,
            1E-103,
            1E-104,
            1E-105,
            1E-106,
            1E-107,
            1E-108,
            1E-109,
            1E-110,
            1E-111,
            1E-112,
            1E-113,
            1E-114,
            1E-115,
            1E-116,
            1E-117,
            1E-118,
            1E-119,
            1E-120,
            1E-121,
            1E-122,
            1E-123,
            1E-124,
            1E-125,
            1E-126,
            1E-127,
            1E-128,
            1E-129,
            1E-130,
            1E-131,
            1E-132,
            1E-133,
            1E-134,
            1E-135,
            1E-136,
            1E-137,
            1E-138,
            1E-139,
            1E-140,
            1E-141,
            1E-142,
            1E-143,
            1E-144,
            1E-145,
            1E-146,
            1E-147,
            1E-148,
            1E-149,
            1E-150,
            1E-151,
            1E-152,
            1E-153,
            1E-154,
            1E-155,
            1E-156,
            1E-157,
            1E-158,
            1E-159,
            1E-160,
            1E-161,
            1E-162,
            1E-163,
            1E-164,
            1E-165,
            1E-166,
            1E-167,
            1E-168,
            1E-169,
            1E-170,
            1E-171,
            1E-172,
            1E-173,
            1E-174,
            1E-175,
            1E-176,
            1E-177,
            1E-178,
            1E-179,
            1E-180,
            1E-181,
            1E-182,
            1E-183,
            1E-184,
            1E-185,
            1E-186,
            1E-187,
            1E-188,
            1E-189,
            1E-190,
            1E-191,
            1E-192,
            1E-193,
            1E-194,
            1E-195,
            1E-196,
            1E-197,
            1E-198,
            1E-199,
            1E-200,
            1E-201,
            1E-202,
            1E-203,
            1E-204,
            1E-205,
            1E-206,
            1E-207,
            1E-208,
            1E-209,
            1E-210,
            1E-211,
            1E-212,
            1E-213,
            1E-214,
            1E-215,
            1E-216,
            1E-217,
            1E-218,
            1E-219,
            1E-220,
            1E-221,
            1E-222,
            1E-223,
            1E-224,
            1E-225,
            1E-226,
            1E-227,
            1E-228,
            1E-229,
            1E-230,
            1E-231,
            1E-232,
            1E-233,
            1E-234,
            1E-235,
            1E-236,
            1E-237,
            1E-238,
            1E-239,
            1E-240,
            1E-241,
            1E-242,
            1E-243,
            1E-244,
            1E-245,
            1E-246,
            1E-247,
            1E-248,
            1E-249,
            1E-250,
            1E-251,
            1E-252,
            1E-253,
            1E-254,
            1E-255,
            1E-256,
            1E-257,
            1E-258,
            1E-259,
            1E-260,
            1E-261,
            1E-262,
            1E-263,
            1E-264,
            1E-265,
            1E-266,
            1E-267,
            1E-268,
            1E-269,
            1E-270,
            1E-271,
            1E-272,
            1E-273,
            1E-274,
            1E-275,
            1E-276,
            1E-277,
            1E-278,
            1E-279,
            1E-280,
            1E-281,
            1E-282,
            1E-283,
            1E-284,
            1E-285,
            1E-286,
            1E-287,
            1E-288,
            1E-289,
            1E-290,
            1E-291,
            1E-292,
            1E-293,
            1E-294,
            1E-295,
            1E-296,
            1E-297,
            1E-298,
            1E-299,
            1E-300,
            1E-301,
            1E-302,
            1E-303,
            1E-304,
            1E-305,
            1E-306,
            1E-307,
            1E-308,
            1E-309,
            1E-310,
            1E-311,
            1E-312,
            1E-313,
            1E-314,
            1E-315,
            1E-316,
            1E-317,
            1E-318,
            1E-319,
            1E-320,
            1E-321,
            1E-322,
            1E-323,
            1E-324
        ];
        // Methods
        /** Returns powers of 10. Unlike the Math.pow this function produces no decimal garbage.
          * @param exp - exponent
          */
        function pow10(exp) {
            debug.assertValue(exp, "exp");
            // Positive & zero
            if (exp >= 0) {
                if (exp < Double.POSITIVE_POWERS.length) {
                    return Double.POSITIVE_POWERS[exp];
                }
                else {
                    return Infinity;
                }
            }
            // Negative
            exp = -exp;
            if (exp > 0 && exp < Double.NEGATIVE_POWERS.length) {
                return Double.NEGATIVE_POWERS[exp];
            }
            else {
                return 0;
            }
        }
        Double.pow10 = pow10;
        /** Returns the 10 base logarithm of the number. Unlike Math.log function this produces integer results with no decimal garbage.
          * @param value - positive value or zero
          */
        function log10(val) {
            debug.assert(val >= 0, "val");
            // Fast Log10() algorithm 
            if (val > 1 && val < 1E16) {
                if (val < 1E8) {
                    if (val < 1E4) {
                        if (val < 1E2) {
                            if (val < 1E1) {
                                return 0;
                            }
                            else {
                                return 1;
                            }
                        }
                        else {
                            if (val < 1E3) {
                                return 2;
                            }
                            else {
                                return 3;
                            }
                        }
                    }
                    else {
                        if (val < 1E6) {
                            if (val < 1E5) {
                                return 4;
                            }
                            else {
                                return 5;
                            }
                        }
                        else {
                            if (val < 1E7) {
                                return 6;
                            }
                            else {
                                return 7;
                            }
                        }
                    }
                }
                else {
                    if (val < 1E12) {
                        if (val < 1E10) {
                            if (val < 1E9) {
                                return 8;
                            }
                            else {
                                return 9;
                            }
                        }
                        else {
                            if (val < 1E11) {
                                return 10;
                            }
                            else {
                                return 11;
                            }
                        }
                    }
                    else {
                        if (val < 1E14) {
                            if (val < 1E13) {
                                return 12;
                            }
                            else {
                                return 13;
                            }
                        }
                        else {
                            if (val < 1E15) {
                                return 14;
                            }
                            else {
                                return 15;
                            }
                        }
                    }
                }
            }
            if (val > 1E-16 && val < 1) {
                if (val < 1E-8) {
                    if (val < 1E-12) {
                        if (val < 1E-14) {
                            if (val < 1E-15) {
                                return -16;
                            }
                            else {
                                return -15;
                            }
                        }
                        else {
                            if (val < 1E-13) {
                                return -14;
                            }
                            else {
                                return -13;
                            }
                        }
                    }
                    else {
                        if (val < 1E-10) {
                            if (val < 1E-11) {
                                return -12;
                            }
                            else {
                                return -11;
                            }
                        }
                        else {
                            if (val < 1E-9) {
                                return -10;
                            }
                            else {
                                return -9;
                            }
                        }
                    }
                }
                else {
                    if (val < 1E-4) {
                        if (val < 1E-6) {
                            if (val < 1E-7) {
                                return -8;
                            }
                            else {
                                return -7;
                            }
                        }
                        else {
                            if (val < 1E-5) {
                                return -6;
                            }
                            else {
                                return -5;
                            }
                        }
                    }
                    else {
                        if (val < 1E-2) {
                            if (val < 1E-3) {
                                return -4;
                            }
                            else {
                                return -3;
                            }
                        }
                        else {
                            if (val < 1E-1) {
                                return -2;
                            }
                            else {
                                return -1;
                            }
                        }
                    }
                }
            }
            // JS Math provides only natural log function so we need to calc the 10 base logarithm:
            // logb(x) = logk(x)/logk(b); 
            var log10 = Math.log(val) / Double.LOG_E_10;
            return Double.floorWithPrecision(log10);
        }
        Double.log10 = log10;
        /** Returns a power of 10 representing precision of the number based on the number of meaningfull decimal digits.
          * For example the precision of 56,263.3767 with the 6 meaningfull decimal digit is 0.1
          * @param x - value
          * @param decimalDigits - how many decimal digits are meaningfull
          */
        function getPrecision(x, decimalDigits) {
            if (decimalDigits === undefined) {
                decimalDigits = Double.DEFAULT_PRECISION_IN_DECIMAL_DIGITS;
            }
            else {
                debug.assert(decimalDigits >= 0, "decimalDigits");
            }
            if (!x) {
                return undefined;
            }
            var exp = Double.log10(Math.abs(x));
            if (exp < Double.MIN_EXP) {
                return 0;
            }
            var precisionExp = Math.max(exp - decimalDigits, -Double.NEGATIVE_POWERS.length + 1);
            return Double.pow10(precisionExp);
        }
        Double.getPrecision = getPrecision;
        /** Checks if a delta between 2 numbers is less than provided precision.
          * @param x - one value
          * @param y - another value
          * @param precision - precision value
          */
        function equalWithPrecision(x, y, precision) {
            precision = applyDefault(precision, Double.DEFAULT_PRECISION);
            debug.assert(precision >= 0, "precision");
            return x === y || Math.abs(x - y) < precision;
        }
        Double.equalWithPrecision = equalWithPrecision;
        /** Checks if a first value is less than another taking into account the loose precision based equality.
          * @param x - one value
          * @param y - another value
          * @param precision - precision value
          */
        function lessWithPrecision(x, y, precision) {
            precision = applyDefault(precision, Double.DEFAULT_PRECISION);
            debug.assert(precision >= 0, "precision");
            return x < y && Math.abs(x - y) > precision;
        }
        Double.lessWithPrecision = lessWithPrecision;
        /** Checks if a first value is less or equal than another taking into account the loose precision based equality.
          * @param x - one value
          * @param y - another value
          * @param precision - precision value
          */
        function lessOrEqualWithPrecision(x, y, precision) {
            precision = applyDefault(precision, Double.DEFAULT_PRECISION);
            debug.assert(precision >= 0, "precision");
            return x < y || Math.abs(x - y) < precision;
        }
        Double.lessOrEqualWithPrecision = lessOrEqualWithPrecision;
        /** Checks if a first value is greater than another taking into account the loose precision based equality.
          * @param x - one value
          * @param y - another value
          * @param precision - precision value
          */
        function greaterWithPrecision(x, y, precision) {
            precision = applyDefault(precision, Double.DEFAULT_PRECISION);
            debug.assert(precision >= 0, "precision");
            return x > y && Math.abs(x - y) > precision;
        }
        Double.greaterWithPrecision = greaterWithPrecision;
        /** Checks if a first value is greater or equal to another taking into account the loose precision based equality.
          * @param x - one value
          * @param y - another value
          * @param precision - precision value
          */
        function greaterOrEqualWithPrecision(x, y, precision) {
            precision = applyDefault(precision, Double.DEFAULT_PRECISION);
            debug.assert(precision >= 0, "precision");
            return x > y || Math.abs(x - y) < precision;
        }
        Double.greaterOrEqualWithPrecision = greaterOrEqualWithPrecision;
        /** Floors the number unless it's withing the precision distance from the higher int.
          * @param x - one value
          * @param precision - precision value
          */
        function floorWithPrecision(x, precision) {
            precision = applyDefault(precision, Double.DEFAULT_PRECISION);
            debug.assert(precision >= 0, "precision");
            var roundX = Math.round(x);
            if (Math.abs(x - roundX) < precision) {
                return roundX;
            }
            else {
                return Math.floor(x);
            }
        }
        Double.floorWithPrecision = floorWithPrecision;
        /** Ciels the number unless it's withing the precision distance from the lower int.
          * @param x - one value
          * @param precision - precision value
          */
        function ceilWithPrecision(x, precision) {
            precision = applyDefault(precision, Double.DEFAULT_PRECISION);
            debug.assert(precision >= 0, "precision");
            var roundX = Math.round(x);
            if (Math.abs(x - roundX) < precision) {
                return roundX;
            }
            else {
                return Math.ceil(x);
            }
        }
        Double.ceilWithPrecision = ceilWithPrecision;
        /** Floors the number to the provided precision. For example 234,578 floored to 1,000 precision is 234,000.
          * @param x - one value
          * @param precision - precision value
          */
        function floorToPrecision(x, precision) {
            precision = applyDefault(precision, Double.DEFAULT_PRECISION);
            debug.assert(precision >= 0, "precision");
            if (precision === 0 || x === 0) {
                return x;
            }
            //Precision must be a Power of 10
            return Math.floor(x / precision) * precision;
        }
        Double.floorToPrecision = floorToPrecision;
        /** Ciels the number to the provided precision. For example 234,578 floored to 1,000 precision is 235,000.
          * @param x - one value
          * @param precision - precision value
          */
        function ceilToPrecision(x, precision) {
            precision = applyDefault(precision, Double.DEFAULT_PRECISION);
            debug.assert(precision >= 0, "precision");
            if (precision === 0 || x === 0) {
                return x;
            }
            //Precision must be a Power of 10
            return Math.ceil(x / precision) * precision;
        }
        Double.ceilToPrecision = ceilToPrecision;
        /** Rounds the number to the provided precision. For example 234,578 floored to 1,000 precision is 235,000.
          * @param x - one value
          * @param precision - precision value
          */
        function roundToPrecision(x, precision) {
            precision = applyDefault(precision, Double.DEFAULT_PRECISION);
            debug.assert(precision >= 0, "precision");
            if (precision === 0 || x === 0) {
                return x;
            }
            //Precision must be a Power of 10
            var result = Math.round(x / precision) * precision;
            var decimalDigits = Math.round(Double.log10(Math.abs(x)) - Double.log10(precision)) + 1;
            if (decimalDigits > 0 && decimalDigits < 16) {
                result = parseFloat(result.toPrecision(decimalDigits));
            }
            return result;
        }
        Double.roundToPrecision = roundToPrecision;
        /** Returns the value making sure that it's restricted to the provided range.
          * @param x - one value
          * @param min - range min boundary
          * @param max - range max boundary
          */
        function ensureInRange(x, min, max) {
            debug.assert(min <= max, "min must be less or equal to max");
            if (x === undefined || x === null) {
                return x;
            }
            if (x < min) {
                return min;
            }
            if (x > max) {
                return max;
            }
            return x;
        }
        Double.ensureInRange = ensureInRange;
        /** Rounds the value - this method is actually faster than Math.round - used in the graphics utils.
          * @param x - value to round
          */
        function round(x) {
            debug.assert(x >= 0, "x must be greater or equal to 0");
            return (0.5 + x) << 0;
        }
        Double.round = round;
        /** Projects the value from the source range into the target range.
          * @param value - value to project
          * @param fromMin - minimum of the source range
          * @param fromMax - maximum of the source range
          * @param toMin - minimum of the target range
          * @param toMax - maximum of the target range
          */
        function project(value, fromMin, fromSize, toMin, toSize) {
            if (fromSize === 0 || toSize === 0) {
                if (fromMin <= value && value <= fromMin + fromSize) {
                    return toMin;
                }
                else {
                    return NaN;
                }
            }
            var relativeX = (value - fromMin) / fromSize;
            var projectedX = toMin + relativeX * toSize;
            return projectedX;
        }
        Double.project = project;
        /** Removes decimal noise
          * @param value - value to be processed
          */
        function removeDecimalNoise(value) {
            return roundToPrecision(value, getPrecision(value));
        }
        Double.removeDecimalNoise = removeDecimalNoise;
        /** Checks whether the number is integer
          * @param value - value to be checked
          */
        function isInteger(value) {
            return value !== null && value % 1 === 0;
        }
        Double.isInteger = isInteger;
    })(Double = powerbi.Double || (powerbi.Double = {}));
    function applyDefault(value, defaultValue) {
        return value !== undefined ? value : defaultValue;
    }
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
// <copyright company='Microsoft Corporation'>
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var jsCommon;
(function (jsCommon) {
    var Errors;
    (function (Errors) {
        function infoNavAppAlreadyPresent() {
            return {
                name: 'infoNavAppAlreadyPresent',
                message: 'Cannot initialize embedded scenario when the InfoNav App is already present in this context',
                stack: getExceptionStackTrace()
            };
        }
        Errors.infoNavAppAlreadyPresent = infoNavAppAlreadyPresent;
        function invalidOperation(message) {
            return {
                name: 'invalidOperation',
                message: message,
                stack: getExceptionStackTrace()
            };
        }
        Errors.invalidOperation = invalidOperation;
        function argument(argumentName, message) {
            return {
                name: 'invalidArgumentError',
                argument: argumentName,
                message: message,
                stack: getExceptionStackTrace()
            };
        }
        Errors.argument = argument;
        function argumentNull(argumentName) {
            return {
                name: 'argumentNull',
                argument: argumentName,
                message: 'Argument was null',
                stack: getExceptionStackTrace()
            };
        }
        Errors.argumentNull = argumentNull;
        function argumentUndefined(argumentName) {
            return {
                name: 'argumentUndefined',
                argument: argumentName,
                message: 'Argument was undefined',
                stack: getExceptionStackTrace()
            };
        }
        Errors.argumentUndefined = argumentUndefined;
        function argumentOutOfRange(argumentName) {
            return {
                name: 'argumentOutOfRange',
                argument: argumentName,
                message: 'Argument was out of range',
                stack: getExceptionStackTrace()
            };
        }
        Errors.argumentOutOfRange = argumentOutOfRange;
        function pureVirtualMethodException(className, methodName) {
            return {
                name: 'pureVirtualMethodException',
                message: 'This method must be overriden by the derived class:' + className + '.' + methodName,
                stack: getExceptionStackTrace()
            };
        }
        Errors.pureVirtualMethodException = pureVirtualMethodException;
        function notImplementedException(message) {
            return {
                name: 'notImplementedException',
                message: message,
                stack: getExceptionStackTrace()
            };
        }
        Errors.notImplementedException = notImplementedException;
        function getExceptionStackTrace() {
            return getStackTrace(2);
        }
    })(Errors = jsCommon.Errors || (jsCommon.Errors = {}));
    /**
    * getStackTrace - Captures the stack trace, if available.
    * It optionally takes the number of frames to remove from the stack trace.
    * By default, it removes the last frame to consider the calling type's
    * constructor and the temporary error used to capture the stack trace (below).
    * More levels can be requested as needed e..g. when an error is created
    * from a helper method. <Min requirement: IE10, Chrome, Firefox, Opera>
    */
    function getStackTrace(leadingFramesToRemove) {
        if (leadingFramesToRemove === void 0) { leadingFramesToRemove = 1; }
        var stackTrace, stackSegments;
        try {
            throw new Error();
        }
        catch (error) {
            stackTrace = error.stack;
            if (stackTrace != null) {
                stackSegments = stackTrace.split('\n');
                stackSegments.splice(1, leadingFramesToRemove);
                // Finally
                stackTrace = stackSegments.join('\n');
            }
        }
        return stackTrace;
    }
    jsCommon.getStackTrace = getStackTrace;
})(jsCommon || (jsCommon = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var jsCommon;
(function (jsCommon) {
    var Formatting;
    (function (Formatting) {
        var _regexCache;
        /** Translate .NET format into something supported by jQuery.Globalize
         */
        function findDateFormat(value, format, cultureName) {
            switch (format) {
                case "m":
                    // Month + day
                    format = "M";
                    break;
                case "O":
                case "o":
                    // Roundtrip
                    format = "yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff'0000'";
                    break;
                case "R":
                case "r":
                    // RFC1123 pattern - - time must be converted to UTC before formatting 
                    value = new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), value.getUTCHours(), value.getUTCMinutes(), value.getUTCSeconds(), value.getUTCMilliseconds());
                    format = "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'";
                    break;
                case "s":
                    // Sortable - should use invariant culture
                    format = "S";
                    break;
                case "u":
                    // Universal sortable - should convert to UTC before applying the "yyyy'-'MM'-'dd HH':'mm':'ss'Z' format.
                    value = new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), value.getUTCHours(), value.getUTCMinutes(), value.getUTCSeconds(), value.getUTCMilliseconds());
                    format = "yyyy'-'MM'-'dd HH':'mm':'ss'Z'";
                    break;
                case "U":
                    // Universal full - the pattern is same as F but the time must be converted to UTC before formatting
                    value = new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), value.getUTCHours(), value.getUTCMinutes(), value.getUTCSeconds(), value.getUTCMilliseconds());
                    format = "F";
                    break;
                case "y":
                case "Y":
                    switch (cultureName) {
                        case "default":
                        case "en":
                        case "en-US":
                            format = "MMMM, yyyy"; // Fix the default year-month pattern for english
                            break;
                        default:
                            format = "Y";
                    }
                    break;
            }
            return { value: value, format: format };
        }
        Formatting.findDateFormat = findDateFormat;
        /** Translates unsupported .NET custom format expressions to the custom expressions supported by JQuery.Globalize
         */
        function fixDateTimeFormat(format) {
            // Fix for the "K" format (timezone): 
            //The js dates don't have a kind property so we'll support only local kind which is equavalent to zzz format.
            format = format.replace(/%K/g, "zzz");
            format = format.replace(/K/g, "zzz");
            format = format.replace(/fffffff/g, "fff0000");
            format = format.replace(/ffffff/g, "fff000");
            format = format.replace(/fffff/g, "fff00");
            format = format.replace(/ffff/g, "fff0");
            // Fix for the 5 digit year: "yyyyy" format. 
            //The Globalize doesn't support dates greater than 9999 so we replace the "yyyyy" with "0yyyy".
            format = format.replace(/yyyyy/g, "0yyyy");
            // Fix for the 3 digit year: "yyy" format. 
            //The Globalize doesn't support this formatting so we need to replace it with the 4 digit year "yyyy" format.
            format = format.replace(/(^y|^)yyy(^y|$)/g, "yyyy");
            if (!_regexCache) {
                // Creating Regexes for cases "Using single format specifier" 
                //- http://msdn.microsoft.com/en-us/library/8kb3ddd4.aspx#UsingSingleSpecifiers
                // This is not supported from The Globalize.
                // The case covers all single "%" lead specifier (like "%d" but not %dd) 
                // The cases as single "%d" are filtered in if the bellow.
                // (?!S) where S is the specifier make sure that we only one symbol for specifier.
                _regexCache = ["d", "f", "F", "g", "h", "H", "K", "m", "M", "s", "t", "y", "z", ":", "/"].map(function (s) {
                    return { r: new RegExp("\%" + s + "(?!" + s + ")", "g"), s: s };
                });
            }
            if (format.indexOf("%") !== -1 && format.length > 2) {
                for (var i = 0; i < _regexCache.length; i++) {
                    format = format.replace(_regexCache[i].r, _regexCache[i].s);
                }
            }
            return format;
        }
        Formatting.fixDateTimeFormat = fixDateTimeFormat;
    })(Formatting = jsCommon.Formatting || (jsCommon.Formatting = {}));
})(jsCommon || (jsCommon = {}));
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
$.fn.multiline = function (text) {
    this.text(text);
    this.html(this.html().replace(/\n/g, '<br/>'));
    return this;
};
$.fn.togglePanelControl = function () {
    return this.each(function () {
        $(this).addClass("ui-accordion ui-accordion-icons ui-widget ui-helper-reset").find(".accordionHeader").addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-top ui-corner-bottom").hover(function () {
            $(this).toggleClass("ui-state-hover");
        }).prepend('<span class="ui-icon ui-icon-triangle-1-e"></span>').click(function () {
            $(this).toggleClass("ui-accordion-header-active ui-state-active ui-state-default ui-corner-bottom").find("> .ui-icon").toggleClass("ui-icon-triangle-1-e ui-icon-triangle-1-s").end().next().slideToggle();
            return false;
        }).next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom").hide();
    });
};
var jsCommon;
(function (jsCommon) {
    var JQueryConstants;
    (function (JQueryConstants) {
        JQueryConstants.VisibleSelector = ':visible';
    })(JQueryConstants = jsCommon.JQueryConstants || (jsCommon.JQueryConstants = {}));
})(jsCommon || (jsCommon = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var jsCommon;
(function (jsCommon) {
    /** Represents a lazily instantiated value. */
    var Lazy = (function () {
        function Lazy(factoryMethod) {
            jsCommon.Utility.throwIfNullOrUndefined(factoryMethod, this, 'constructor', 'factoryMethod');
            this._factoryMethod = factoryMethod;
        }
        Lazy.prototype.getValue = function () {
            if (this._factoryMethod !== null) {
                this._value = this._factoryMethod();
                // Optimization: Release the factoryMethod, as it could be holding a large object graph.
                this._factoryMethod = null;
            }
            return this._value;
        };
        return Lazy;
    })();
    jsCommon.Lazy = Lazy;
})(jsCommon || (jsCommon = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var jsCommon;
(function (jsCommon) {
    /** Represents a path of sequential objects. */
    var Path = (function () {
        function Path(segments) {
            debug.assertValue(segments, 'segments');
            debug.assert(segments.length > 0, 'segments.length');
            this._segments = segments;
        }
        Path.prototype.getLeafSegment = function () {
            return this._segments[this._segments.length - 1];
        };
        /** Returns true if the other Path has a subset of segments of this Path, appearing the same order. */
        Path.prototype.isExtensionOf = function (other) {
            if (this._segments.length <= other._segments.length) {
                return false;
            }
            for (var i = 0, len = other._segments.length; i < len; ++i) {
                if (this._segments[i] !== other._segments[i]) {
                    return false;
                }
            }
            return true;
        };
        /** Returns a Path with has the appended segment. */
        Path.prototype.extend = function (segment) {
            return new Path(this._segments.concat([segment]));
        };
        return Path;
    })();
    jsCommon.Path = Path;
})(jsCommon || (jsCommon = {}));
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
var powerbi;
(function (powerbi) {
    var Prototype;
    (function (Prototype) {
        /** Returns a new object with the provided obj as its prototype. */
        function inherit(obj, extension) {
            debug.assertValue(obj, 'obj');
            function wrapCtor() {
            }
            ;
            wrapCtor.prototype = obj;
            var inherited = new wrapCtor();
            if (extension)
                extension(inherited);
            return inherited;
        }
        Prototype.inherit = inherit;
        /**
         * Uses the provided callback function to selectively replace contents in the provided array, and returns
         * a new array with those values overriden.
         * Returns undefined if no overrides are necessary.
         */
        function overrideArray(prototype, override) {
            if (!prototype)
                return;
            var overwritten;
            for (var i = 0, len = prototype.length; i < len; i++) {
                var value = override(prototype[i]);
                if (value) {
                    if (!overwritten)
                        overwritten = inherit(prototype);
                    overwritten[i] = value;
                }
            }
            return overwritten;
        }
        Prototype.overrideArray = overrideArray;
    })(Prototype = powerbi.Prototype || (powerbi.Prototype = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var jsCommon;
(function (jsCommon) {
    /**
     *  Utility class to manupilate the search query string in a Url.
     *  Note: search query string has to begin with '?'
     */
    var QueryStringUtil = (function () {
        function QueryStringUtil() {
        }
        /** Remove a given query from the query */
        QueryStringUtil.clearQueryString = function (queryField) {
            var queries = QueryStringUtil.parseQueryString();
            delete queries[queryField];
            return QueryStringUtil.rebuildQueryString(queries);
        };
        /**
         * Add or update existing query field to new value
         * Note: queryField and queryValue do not need to be encoded
         */
        QueryStringUtil.addOrUpdateQueryString = function (queryField, queryValue) {
            var queries = QueryStringUtil.parseQueryString();
            queries[queryField] = queryValue;
            return QueryStringUtil.rebuildQueryString(queries);
        };
        /**
         * Returns the value of a URL parameter
         * @param key - The key of the URL parameter
         * @returns The (decoded) value of the URL parameter
         */
        QueryStringUtil.getQueryStringValue = function (key) {
            var queries = QueryStringUtil.parseQueryString();
            return queries[key];
        };
        /**
         * Parse the search query string into key/value pairs
         * Note: both key and value are decoded.
         */
        QueryStringUtil.parseQueryString = function (queryString) {
            if (queryString === void 0) { queryString = window.location.search; }
            var queryStringDictionary = {};
            var search = queryString;
            if (!jsCommon.StringExtensions.isNullOrEmpty(search) && search.substr(0, 1) === '?') {
                // skip the '?'
                var pairs = search.substr(1).split("&");
                for (var i = 0; i < pairs.length; i++) {
                    var keyValuePair = pairs[i].split("=");
                    queryStringDictionary[decodeURIComponent(keyValuePair[0])] = decodeURIComponent(keyValuePair[1]);
                }
            }
            return queryStringDictionary;
        };
        /**
         * Reconstruct the search string based on the key/value pair of individual query.
         * Note: both query field and query value will be encoded in the returned value.
         */
        QueryStringUtil.rebuildQueryString = function (queries) {
            var queryString = "";
            var isEmpty = true;
            for (var queryField in queries) {
                if (!isEmpty) {
                    queryString += '&';
                }
                queryString += encodeURIComponent(queryField);
                if (queries[queryField]) {
                    queryString += '=' + encodeURIComponent(queries[queryField]);
                }
                isEmpty = false;
            }
            if (!isEmpty) {
                queryString = '?' + queryString;
            }
            return queryString;
        };
        QueryStringUtil.OriginClientActivityIdParameterName = 'caid';
        QueryStringUtil.OriginRootActivityIdParameterName = 'raid';
        QueryStringUtil.OriginActivityIdParameterName = 'aid';
        return QueryStringUtil;
    })();
    jsCommon.QueryStringUtil = QueryStringUtil;
})(jsCommon || (jsCommon = {}));
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
var jsCommon;
(function (jsCommon) {
    /**
     * This StringBuilder was ported from MicrosoftAjax.js (https://ajax.aspnetcdn.com/ajax/3.5/MicrosoftAjax.debug.js)
     * and is used for serialization of objects for interop with PowerView.
     */
    var StringBuilder = (function () {
        /** Creates a new instance of StringBuilder */
        function StringBuilder(initialText) {
            this._parts = new Array();
            if (initialText) {
                this._parts.push(initialText);
            }
        }
        StringBuilder.prototype.append = function (text) {
            if (text) {
                this._parts[this._parts.length] = text;
            }
        };
        StringBuilder.prototype.appendLine = function (text) {
            if (text) {
                this._parts[this._parts.length] = text + '\r\n';
            }
            else {
                this._parts[this._parts.length] = '\r\n';
            }
        };
        StringBuilder.prototype.clear = function () {
            this._parts = new Array();
        };
        StringBuilder.prototype.isEmpty = function () {
            return this._parts.length === 0 || this.toString('') === '';
        };
        StringBuilder.prototype.toString = function (separator) {
            var result = this._parts.join(separator || '');
            return result;
        };
        return StringBuilder;
    })();
    jsCommon.StringBuilder = StringBuilder;
})(jsCommon || (jsCommon = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    /** Holder for UI strings until Localization is implemented */
    var Strings;
    (function (Strings) {
        /** Date time format which will be localized. */
        Strings.dateTimeFormat = "M/d/yyyy h:mm tt";
        /** Title for error displayed when an error occurs on the server during Interpret */
        Strings.serverErrorTitleText = "Sorry, something went wrong";
        /** Detailed message for error displayed when an error occurs on the server during Interpret */
        Strings.serverErrorDetailsText = "Please try your query again. If the error continues please contact your system administrator.";
        /** Detailed message for error displayed when a timeout occurs during Interpret */
        Strings.serverTimeoutDetailsText = "There was a timeout processing your request. Please try again. If the error continues please contact your system administrator.";
        /** Detailed message for error displayed when invalid semantic query exception is raised */
        Strings.serverReloadDetailsText = "There was a mismatch in the metadata. This usually occurs when the data on the server has been updated. Please refresh the browser and try your query again.";
        /** Template for the Error Code displayed on a server error (when a Power BI Q&A error is present). */
        Strings.infoNavErrorCodeTemplate = "{0} ({1})";
        /** Template for error message including an activity id. */
        Strings.infoNavErrorWithActivityIdTemplate = "{0} (Activity Id: {1})";
        /** The display title for the error field containing an error code */
        Strings.errorCodeText = "Error Code";
        /** The display title for the error field containing an activity id */
        Strings.errorActivityIdText = "Activity Id";
        /** The display title for the error field containing an request id */
        Strings.errorRequestIdText = "Request Id";
        /** The display title for the error field containing a line number */
        Strings.errorLineNumberText = "Line number";
        /** The display title for the error field containing a column number */
        Strings.errorColumnNumberText = "Column number";
        /** The display title for the error field containing a stack trace */
        Strings.errorStackTraceText = "Stack trace";
        /** The display title for the error field containing a source file */
        Strings.errorSourceFileText = "Source file";
        /** The display title for the error field containing a timestamp */
        Strings.errorTimestampText = "Time";
        /** The call stack for an error. */
        Strings.errorCallStackText = "Call stack";
        /** Title displayed when no results are found for a query */
        Strings.emptyResultTitleText = "Sorry, I wasn't able to find a good answer.";
        /** Description displayed when no results are found for a query */
        Strings.emptyResultDescriptionText = "";
        /** Link text displayed to show additional error details */
        Strings.showDetailsText = "Show technical details";
        /** Label for showing more visualization types */
        Strings.showMoreVisualizationsLabel = "show more";
        /** Label for showing less visualization types */
        Strings.showFewerVisualizationsLabel = "show fewer";
        /** Label for stacked bar chart visualization type. */
        Strings.stackedBarChartVisualizationsLabel = "bar chart";
        /** Label for clustered bar chart visualization type. */
        Strings.clusteredBarChartVisualizationsLabel = "clustered bar chart";
        /** Label for 100% percent bar chart visualization type. */
        Strings.hundredPercentBarChartVisualizationsLabel = "100% stacked bar chart";
        /** Label for column chart visualization type. */
        Strings.stackedColumnChartVisualizationsLabel = "column chart";
        /** Label for clustered column chart visualization type. */
        Strings.clusteredColumnChartVisualizationsLabel = "clustered column chart";
        /** Label for 100% percent column chart visualization type. */
        Strings.hundredPercentColumnChartVisualizationsLabel = "100% stacked column chart";
        /** Label for scatter chart visualization type. */
        Strings.scatterChartVisualizationsLabel = "scatter chart";
        /** Label for line chart visualization type. */
        Strings.lineChartVisualizationsLabel = "line chart";
        /** Label for line chart visualization type. */
        Strings.pieChartVisualizationsLabel = "pie chart";
        /** Label for map visualization type. */
        Strings.mapVisualizationsLabel = "map";
        /** Label for matrix visualization type. */
        Strings.matrixVisualizationsLabel = "matrix";
        /** Label for table visualization type. */
        Strings.tableVisualizationsLabel = "table";
        /** Label for card visualization type. */
        Strings.cardVisualizationsLabel = "card";
        /** Label for the settings link within our SharePoint app */
        Strings.sharePointAppSettingsLinkLabel = "Settings";
        /** Label for the add samples link within our SharePoint app */
        Strings.sharePointAppAddSamplesLinkLabel = "Add sample data...";
        /** Title for the settings pane within our SharePoint app */
        Strings.sharePointAppSettingsPaneTitle = "Settings";
        /** Label for the button that closes the Settings pane inside our SharePoint app */
        Strings.sharePointAppCloseSettingsPaneButtonLabel = "Close";
        /** The error message displayed when a user attempts to add a workbook using an invalid url */
        Strings.sharePointSettingsInvalidModelUrlLabel = "Please enter a valid URL";
        /** The information message displayed to the user while a workbook is being loaded */
        Strings.sharePointSettingsRetrievingModelLabel = "Looking for a workbook at the given URL...";
        /** The message displayed to the user to publish the a workbook*/
        Strings.sharePointSettingsModelNeedsPublishingLabel = "Your workbook needs to be enabled for web viewing before it can be searched with Power BI Q&A.";
        /** The error message displayed to the user when there was a problem retrieving the specified workbook */
        Strings.sharePointSettingsModelRetrievalFailedLabel = "There was a problem retrieving the specified workbook";
        /** The error message displayed to the user when there was a problem removing the specified workbook */
        Strings.sharePointSettingsModelRemovalFailedLabel = "There was a problem removing the specified workbook";
        /** The error message displayed to the user when an already existing workbook has been specified */
        Strings.sharePointSettingsDuplicateModelSpecifiedLabel = "The specified workbook has already been added";
        /** The title for the Models section of the Settings page */
        Strings.sharePointSettingsModelsSectionTitleLabel = "Models";
        /** The message displayed to the user while the list of workbooks is retrieved in the settings pane */
        Strings.sharePointSettingsModelsLoadingLabel = "Please wait...";
        /** The title for the dialog used to add new workbooks inside the SharePoint settings pane */
        Strings.sharePointSettingsAddModelDialogTitle = "Add workbook";
        /** The label for the button used to add a new workbook inside the SharePoint settings pane */
        Strings.sharePointSettingsAddModelBtnLabel = "Add workbook...";
        /** The description text for the add workbook dialog */
        Strings.sharePointSettingsAddModelDialogText = "To add a new workbook, enter the workbook's URL in the box below and click 'Add'.";
        /** The label for the button used to add a new workbook inside the SharePoint settings pane */
        Strings.sharePointSettingsAddModelDialogAddActionLabel = "Add";
        /** The label for the button used to remove an individual workbook inside the SharePoint settings pane */
        Strings.sharePointSettingsRemoveModelBtnLabel = "Remove";
        /** The title text for the confirmation dialog used to remove workbooks inside the SharePoint settings pane */
        Strings.sharePointSettingsRemoveModelDialogTitle = "Are you sure you want to remove this workbook?";
        /** The text for the dialog used to remove workbooks inside the SharePoint settings pane */
        Strings.sharePointSettingsRemoveModelDialogText = "This will remove {0} from the list of workbooks.";
        /** The label for the column containing workbook names inside the SharePoint settings pane */
        Strings.sharePointSettingsModelNameColumnLabel = "Workbook Name";
        /** The label for the column containing workbook URLs inside the SharePoint settings pane */
        Strings.sharePointSettingsModelUrlColumnLabel = "URL";
        /** The label for the column containing workbook status descriptions inside the SharePoint settings pane */
        Strings.sharePointSettingsModelStatusColumnLabel = "Status";
        /** The message displayed to the user when the Models control is unable to initialize */
        Strings.sharePointSettingsModelsLoadFailedLabel = "We were unable to load the list of workbooks at this time, please try again later";
        /** The message displayed to the user whent the BI Center app is not installed */
        Strings.sharePointSettingsBICenterAppNotInstalled = "Please install the BI Center app to configure Power BI Q&A";
        /** The message displayed to the user when the BI Center app is in error state */
        Strings.sharePointSettingsBICenterAppErrorInstallation = "Please fix the status of BI Center app to configure Power BI Q&A";
        /** The first paragraph of the description text for the Models section of the SharePoint settings page */
        Strings.sharePointSettingsModelsSectionFirstParagraghText = "These are the workbooks that Power BI Q&A will use when querying for results.";
        /** The second paragraph of the description text for the Models section of the SharePoint settings page */
        Strings.sharePointSettingsModelsSectionSecondParagraghText = "To add a workbook, click on the 'Add workbook...' button below. Similarly, you may remove previously added workbooks by clicking the Remove button for the corresponding workbook.";
        /** The message displayed when there is an error in adding a model */
        Strings.sharePointSettingsAddModelErrorText = "The add operation failed. Error: {0}";
        /** The following represent the possible status values for a Power BI Q&A workbook within the Settings Page */
        Strings.sharePointSettingsModelStatusNoneLabel = "None";
        Strings.sharePointSettingsModelStatusValidatingLabel = "Validating";
        Strings.sharePointSettingsModelStatusPublishingLabel = "Publishing";
        Strings.sharePointSettingsModelStatusDeletePendingLabel = "Deleting";
        Strings.sharePointSettingsModelStatusPublishSuccessfulLabel = "Published";
        /** The following represent the possible error code status for a Power BI Q&A workbook when publishing */
        Strings.sharePointSettingsModelPublishErrorNone = "None";
        Strings.sharePointSettingsModelPublishMissingError = "Workbook does not contain a model";
        Strings.sharePointSettingsModelPublishAboveLimitError = "Workbook size without model is above size limit";
        Strings.sharePointSettingsModelPublishXmlaError = "Xmla operation exception was thrown";
        Strings.sharePointSettingsModelNotPublishedError = "The workbook is not published";
        Strings.sharePointSettingsModelPublishCheckoutError = "Workbook in this checkout type is already being processed";
        Strings.sharePointSettingsModelPublishUnknownError = "Unknown error";
        /** Add workbook error: URL is not a SharePoint URL */
        Strings.addModelNonSharePointUrlError = "This is not a SharePoint URL. You must provide the URL of an Excel workbook in the current SharePoint site.";
        /** Add workbook error: URL is in sharepoint but we can’t resolve the document IDs (doesn’t exist) */
        Strings.addModelSharePointDocumentNotFoundError = "No document exists for this URL. You must provide the URL of an Excel workbook in the current SharePoint site.";
        /** Add workbook error: URL is not a workbook */
        Strings.addModelSharePointInvalidUrlError = "This URL is not an Excel workbook. You must provide the URL of an Excel workbook in the current SharePoint site.";
        /** Add workbook error: URL is not in this site */
        Strings.addModelSharePointUrlNotInCurrentSiteError = "This Excel workbook is not stored in the same site as the Power BI Q&A application is installed in.  You must provide the URL of an Excel workbook in the current SharePoint site.";
        /** Add workbook error: Initial PUT to add the workbook fails */
        Strings.addModelOperationFailedError = "The workbook could not be added at this time.  Please try again.  If the problem persists, please contact support.";
        /** Add workbook error: Add workbook is disallowed */
        Strings.addModelDisallowedError = "The workbook could not be added since it is disallowed by the server.";
        /** The text for the link to be appended to SharePoint add workbook errors */
        Strings.addModelErrorHelpLinkText = "Find out more about adding workbooks";
        /** The text for the error indicating that the app could not load the workbooks list from the server */
        Strings.sharePointAppLoadModelsErrorText = "There was a problem accessing the current set of workbooks. Refresh the page to try again.  If the problem persists, please contact support.";
        /** The title text for the message indicating that no workbooks have been configured for Power BI Q&A */
        Strings.sharePointAppNoModelsConfiguredTitle = "You need to set up Power BI Q&A";
        /** The message text for the message indicating that no workbooks have been configured for Power BI Q&A */
        Strings.sharePointAppNoModelsConfiguredMessage = "You need to choose the workbooks to search before you can start asking questions using Power BI Q&A.";
        /** The title text for the message indicating that no workbooks have been configured for Power BI Q&A */
        Strings.sharePointAppNoModelsConfiguredUserTitle = "Oops, not ready yet";
        /** The message text for the message indicating that no workbooks have been configured for Power BI Q&A */
        Strings.sharePointAppNoModelsConfiguredUserMessage = "No workbooks have been set up for Power BI Q&A. Contact a site owner to set up the site.";
        /** The label for the button shown on the no models configured dialog */
        Strings.sharePointAppNoModelsActionLabel = "Go to settings...";
        /** The message text for the message indicating that no workbooks have been configured for Power BI Q&A */
        Strings.sharePointSettingsAccessDeniedMessage = "You do not have permission to manage the Power BI Q&A application for this site.  Only Site Owners or users with the manage site permission level can manage the Power BI Q&A application.";
        /** The label for the button used to cancel an action inside a dialog */
        Strings.dialogCancelActionLabel = "Cancel";
        /** The label for the button used to close a dialog */
        Strings.dialogCloseActionLabel = "Close";
        /** The label for the dialog button used to send */
        Strings.dialogSendActionLabel = "Send";
        /** The label for the dialog button used to refresh the page in case of a fatal error */
        Strings.dialogRefreshPageActionLabel = "Refresh Page";
        /** The label for the dialog button used to go back to Power BI Portal */
        Strings.dialogGoBackActionLabel = "Go Back";
        /** The title for the error dialogs within the app */
        Strings.errorDialogTitle = "oops, something went wrong";
        /** The text for the dialog shown upon encountering a fatal error */
        Strings.fatalErrorDialogText = "The page could not be loaded at this time.  Refresh the page to try again.  If the problem persists, please contact support.";
        /** The text for the dialog shown upon encountering an unsupported url error */
        Strings.unsupportedUrlMessageText = "The URL of this page has changed. Please return to SharePoint to get the latest URL.";
        /** The title of the warning shown when a workbook is missing a linguistic schema */
        Strings.linguisticSchemaWarningTitle = "Get better search results";
        /** The template for a single workbook linguistic schema warning */
        Strings.linguisticSchemaSingleWorkbookWarningTemplate = "{WorkbookLink} will return better results if you add language information to the workbook.";
        /** The template for a single workbook linguistic schema warning */
        Strings.linguisticSchemaMultipleWorkbookWarningTemplate = "{WorkbookLink} and other workbooks will return better results if you add language information to the workbooks.";
        /** The link for showing more info about the linguistic schema warning */
        Strings.linguisticSchemaWarningMoreInfoLink = "Learn about language modeling";
        /** The label for the link allowing the user to open the current workbook in a new browser tab */
        Strings.refinementPaneOpenWorkbookLabel = "Open workbook";
        /** The format for the last modified date displayed in the refinement pane */
        Strings.refinementPaneLastModifiedDateFormat = "MMM' 'd', 'yyyy' at 'h':'mmtt";
        /** The title of the window notifying the user that they are running on an unsupported browser */
        Strings.unsupportedBrowserMessageTitle = "Unsupported browser detected";
        /** The contents of the window notifying the user that they are running on an unsupported browser */
        Strings.unsupportedBrowserMessageText = "Power BI Q&A requires Internet Explorer 10 or higher, please upgrade your browser and try again";
        /** The message in the suggestion dropdown allowing the user to specify the meaning of an unrecognized term */
        Strings.modelingClarifyTermCommand = "Help us understand what {term} means";
        /** The message in the suggestion dropdown allowing the user to change how the system understands a recognized term */
        Strings.modelingAddSynonymTermCommand = "Change how {term} is being understood";
        /** The message displayed to the user when they have selected a term that has no associated phrasing templates */
        Strings.modelingTermHasNoTemplates = "Sorry, we don't have any suggestions for the term you selected";
        /** The display string for the modeling template allowing the user to declare a global synonym for a selection */
        Strings.modelingSynonymTemplateDisplayText = "the same as";
        /** The error message shown when the user is navigating away with pending add models */
        Strings.pendingAddModelOperationsText = "There are pending publish operations.";
        /** Text displayed beside the show collage button. */
        Strings.showCollageText = "See some other questions we do have answers for...";
        /** Text displayed when silverlight is not available. */
        Strings.silverlightInstallRequiredText = "Power BI Q&A requires Silverlight 5. Click here to Install Silverlight";
        /** Notification title displayed when a request has timed out due to workbooks not being loaded. */
        Strings.workbooksLoadingTimeoutTitle = "Please wait";
        /** Notification text displayed when a request has timed out . */
        Strings.workbooksLoadingTimeoutText = "Contacting Power BI Q&A service...";
        /** Text displayed when a request has timed out. */
        Strings.interpretRetryMaxCountExceededMessageText = "There was a timeout executing your query. Please try again later. If the problem persists, contact your administrator.";
        /** The title text for the message indicating that sample workbooks are not configured Power BI Q&A */
        Strings.sharePointAppNoSamplesTitle = "We've been making some great changes to our sample workbooks";
        /** The message text for the message indicating that sample workbooks are not configured Power BI Q&A */
        Strings.sharePointAppNoSamplesMessage = "Go back to the Power BI page, click the settings gear in the top right corner and click add sample data to update your samples.";
        /** The text branding to be shown at the top of application page */
        Strings.powerBIChromeBrandingText = 'Power BI for Office 365';
        /** The text shown when the user doesn't have valid SharePoint Context token while requesting the App Page or call GetAppMetaData for interpret */
        Strings.notAuthenticatedErrorMessage = "You need to sign in before we can show you this page.  Click the Refresh Page button to continue.";
        /** The text for the error when there are any problems with accessing the service, either an expired access token or invalid short-lived PowerBI token*/
        Strings.tokenInvalidOrExpiredErrorText = "We couldn’t connect to Power BI right now.";
        /** The title text for the dialog prompt that is raised when the token has expired */
        Strings.connectionExpiredTitleText = 'Connection expired';
        /** The title text for the help viewer control */
        Strings.helpViewerControlTitleText = 'ABOUT THIS DATA';
        /** The title text for the feedback section inside the help viewer control */
        Strings.helpViewerFeedbackBannerTitle = 'Learn More. Give Feedback.';
        /** The text content for the feedback section inside the help viewer control */
        Strings.helpViewerFeedbackBannerText = 'We\'re working to improve Power BI Q&A. Share feedback and learn more about what\'s coming next.';
        /** The caption text for the help viewer control letting the user know that there is no help content available for the current model */
        Strings.helpViewerHelpUnavailableCaptionText = 'We\'re sorry, there is no help content available at this time.';
        /** The caption text for the help viewer control letting the user know that a help page is being loaded */
        Strings.helpViewerHelpLoadingCaptionText = 'Looking for content...';
        /** The text of the link allowing the user to return to the Power BI site */
        Strings.backToBISiteLinkText = 'Back to Power BI Site';
        /** The text of the link allowing the user to return to display the featured questions set */
        Strings.showFeaturedQuestionsLinkText = 'Show Featured Questions';
        /** The text of the link allowing the user to copy a link to the current result to their clipboard */
        Strings.copyResultLinkText = 'Copy URL';
        /** The text of the link allowing the user to send an email with the link to the current result URL */
        Strings.shareResultLinkText = 'Share';
        /** The subject line for the share result email */
        Strings.shareResultEmailSubjectText = 'Check out this data insight';
        /** The body for the share result email */
        Strings.shareResultEmailBodyTemplateText = '{0}\r\rDiscovered with Power BI Q&A';
        /** The notification text for when the user copies a result URL to their clipboard */
        Strings.resultLinkCopiedNotificationText = 'A link to this result was copied to the clipboard.';
        /** Collage item editor: the tile of the editor dialog when editing a new item */
        Strings.CollageItemEditorAddItemTitle = 'Feature a question';
        /** Collage item editor: the tile of the editor dialog when editing an existing item */
        Strings.CollageItemEditorEditItemTitle = 'Edit featured question';
        /** Collage item editor: The tile of the form region used to input an utterance */
        Strings.CollageItemEditorUtteranceFormRegionTitle = 'Type a question';
        /** Collage item editor: Placeholder on text input field for user utterance */
        Strings.CollageItemEditorUtteranceInputPlaceholder = 'Enter your question...';
        /** Collage item editor: Caption on text input field for user utterance */
        Strings.CollageItemEditorUtteranceInputCaption = 'You can ask anything about the workbooks currently available on the site';
        /** Collage item editor: Caption on text input field for user utterance when the dialog is busy finding an answer */
        Strings.CollageItemEditorUtteranceInputSearchingCaption = 'We\'re trying to find an answer to your question...';
        /** Collage item editor: Caption on text input field for user utterance when the dialog is busy finding an answer */
        Strings.CollageItemEditorUtteranceInputNoResultsCaption = 'We\'re sorry, we couldn\'t find an answer to your question';
        /** Collage item editor: Caption on text input field for user utterance when the dialog has found an answer */
        Strings.CollageItemEditorUtteranceInputResultFoundCaption = 'We\'ve found an answer to your question!';
        /** Collage item editor: Label for checkbox determining whether the user provided utterance should be featured on the Power BI site */
        Strings.CollageItemEditorFeatureOnPowerBICheckboxCaption = 'Show on the Power BI site home page';
        /** Collage item editor: The tile of the form region in which the user can pick the size of the tile for the featured question */
        Strings.CollageItemEditorTileSizeFormRegionTitle = 'Tile size';
        /** Collage item editor: The caption for the radio button allowing the user to select a small tile size */
        Strings.CollageItemEditorTileSizeSmallCaption = 'Small';
        /** Collage item editor: The caption for the radio button allowing the user to select a large tile size */
        Strings.CollageItemEditorTileSizeLargeCaption = 'Large';
        /** Collage item editor: The title of the form region in which the user can pick from one of the predetermined tile colors */
        Strings.CollageItemEditorTileColorRegionTitle = 'Background color';
        /** Collage item editor: The title of the form region in which the user can pick from one of the predetermined tile backgrounds */
        Strings.CollageItemEditorTileIconRegionTitle = 'Background icon';
        /** Collage item editor: The title of the form region in which the user can provide a custom image url for the tile background */
        Strings.CollageItemCustomImageRegionTitle = 'Background image';
        /** Collage item editor: The text placeholder for the input field allowing the user to specify a custom image url */
        Strings.CollageItemCustomImageUrlInputPlaceholder = 'Enter image URL here (optional)';
        /** Collage item editor: The caption telling the user the best size for external images */
        Strings.CollageItemCustomImageUrlCaption = 'For best results use an image that is 250 pixels wide or larger';
        /** Collage item editor: The caption telling the user we're trying to load the specified image */
        Strings.CollageItemCustomImageUrlLoadingCaption = 'Loading image...';
        /** Collage item editor: The caption telling the user we couldn't load an image from the specified url */
        Strings.CollageItemCustomImageUrlLoadErrorCaption = 'We\'re sorry, we couldn\'t find an image at the specified location';
        /** Collage item editor: The caption telling the user they entered an invalid url */
        Strings.CollageItemCustomImageUrlBadAddressCaption = 'Please enter a valid URL';
        /** Collage item editor: The caption telling the user loaded an image from the specified url */
        Strings.CollageItemCustomImageUrlSuccessCaption = 'Image loaded successfully';
        /** Collage item editor: The title of the form region in which users can see the item being created */
        Strings.CollageItemEditorPreviewRegionTitle = 'Preview';
        /** Collage item editor: The label for the button allowing users to save their work */
        Strings.CollageItemEditorSaveBtnTxt = 'Save';
        /** Collage item editor: The label for the button allowing users to close the editor without saving their work */
        Strings.CollageItemEditorCancelBtnTxt = 'Cancel';
        /** Collage item control: The title of the message letting the user know they have reached the max number of possible items */
        Strings.CollageControlMaxNumberOfItemsMessageTitle = 'Maximum number of featured questions reached';
        /** Collage item control: The text of the message letting the user know they have reached the max number of possible items */
        Strings.CollageControlMaxNumberOfItemsMessageText = 'You have reached the maximum number of featured questions that can be displayed. Please remove some questions to continue';
        /** The title of the dialog asking the user to confirm whether they want to remove a featured question from the collage */
        Strings.CollageDeleteItemDialogTitle = 'Remove Featured Question';
        /** The text content of the dialog asking the user to confirm whether they want to remove a featured question from the collage */
        Strings.CollageDeleteItemDialogText = 'Are you sure you want to permanently remove this featured question?';
        /** The description of the pulldown list allowing the user to switch between result sources */
        Strings.ModelSelectionControlPulldownDescriptionText = 'results from';
        /** The text used inside a buton when asking the user a yes/no question/prompt */
        Strings.YesDialogOption = 'Yes';
        /** The text used inside a buton when asking the user a yes/no question/prompt */
        Strings.NoDialogOption = 'No';
        /** The text tile in the main help page*/
        Strings.mainHelpPageTitle = 'Q&A';
        /** The text description in the main help page*/
        Strings.mainHelpPageDescription = 'Power BI Q&A makes it easy for anyone to discover and explore their data.';
        /** The text of workbook list title in the main help page*/
        Strings.mainHelpPageWorkbookListTitle = 'Workbooks';
        /** The text description in the model help page*/
        Strings.modelHelpPageDescription = 'Here are some examples of questions you could ask about this workbook.';
        /** The text of question list title in the model help page*/
        Strings.modelHelpPageQuestionListTitle = 'Featured questions';
        /** The text of add featured question on help page*/
        Strings.helpPageAddFeaturedQuestion = 'add featured question';
        /** The text of featured questions on help page*/
        Strings.helpPageFeaturedQuestions = 'featured questions';
        /** The text of empty list on help page*/
        Strings.helpPageNoItemsListed = 'no items listed';
        /** The tooltip for the button which allows users to flag utterances */
        Strings.flagUtteranceTooltip = 'Flag the result of this question as not helpful.';
        /** The tooltip for the user feedback button which allows users to rate answers */
        Strings.utteranceFeedbackTooltip = 'Help improve Q&A';
        /** The title for the user feedback dialog which allows users to rate answers */
        Strings.utteranceFeedbackDialogTitle = 'Q&A Feedback';
        /** The prompt for the user feedback dialog which allows users to rate answers */
        Strings.utteranceFeedbackDialogPrompt = 'Please rate how well Q&A helped find data to answer your question.';
        /** A feedback option, displayed in the dialog which allows users to rate answers */
        Strings.utteranceFeedbackResultBad = 'Way Off';
        /** A feedback option, displayed in the dialog which allows users to rate answers */
        Strings.utteranceFeedbackResultMedium = 'Got Close';
        /** A feedback option, displayed in the dialog which allows users to rate answers */
        Strings.utteranceFeedbackResultGood = 'Great';
        /** The error text for the model selection control if one or more sources fail to load */
        Strings.modelSelectionHasErrors = 'Some workbooks did not load successfully';
    })(Strings = InJs.Strings || (InJs.Strings = {}));
})(InJs || (InJs = {}));
var powerbi;
(function (powerbi) {
    /**
     * @class
     * A cache of Rejectable Promises
     */
    var RejectablePromiseCache = (function () {
        /**
         * Constructor of RejectablePromiseCache
         * @param {IPromiseFactory} promiseFactory - factory used to create promises
         */
        function RejectablePromiseCache(promiseFactory) {
            this.cache = {};
            this.promiseFactory = promiseFactory;
        }
        /**
         * Returns the number of entries in the cache
         */
        RejectablePromiseCache.prototype.getEntryCount = function () {
            return Object.keys(this.cache).length;
        };
        /**
         * Indicates if there is an entry in the cache for the provided key
         * @param {string} cacheKey - Identifier of the cache entry
         */
        RejectablePromiseCache.prototype.hasCacheEntry = function (cacheKey) {
            debug.assertValue(cacheKey, 'cacheKey');
            return !!this.getCacheEntry(cacheKey);
        };
        /**
         * Creates a cache entry associated with the provided key. If the key is already
         * pointing to a cache entry, 'undefined' is returned.
         * @param {string} cacheKey - Identifier of the cache entry
         */
        RejectablePromiseCache.prototype.createCacheEntry = function (cacheKey) {
            debug.assertValue(cacheKey, 'cacheKey');
            var cacheEntry = this.getCacheEntry(cacheKey);
            // if cacheKey is undefined/empty string or there is a cache entry, return undefined
            if (!cacheKey || cacheEntry)
                return;
            // clear cache if it reaches max
            // do not delete them (values) as they may be pending and referenced by other objects
            if (this.getEntryCount() > RejectablePromiseCache.maxCacheEntries)
                this.cache = {};
            var promiseFactory = this.promiseFactory;
            var queryCache = this.cache;
            var deferred = promiseFactory.defer();
            var promise = powerbi.RejectablePromise(deferred);
            var entryDeferred = promiseFactory.defer();
            var entryPromise = powerbi.RejectablePromise(entryDeferred);
            cacheEntry = queryCache[cacheKey] = {
                promise: entryPromise,
                refCount: 0
            };
            promise.then(function (result) {
                if (cacheEntry.updateResult)
                    result = cacheEntry.updateResult(result);
                cacheEntry.result = result;
                entryDeferred.resolve(result);
            }, function (reason) { return entryDeferred.reject(reason); }).finally(function () {
                delete cacheEntry.updateResult;
            });
            entryPromise.catch(function (reason) { return promise.reject(); });
            entryPromise.finally(function () {
                if (queryCache[cacheKey]) {
                    delete queryCache[cacheKey].promise;
                    // if promise is rejected, delete the cache entry to allow for future re-execution of the same query
                    if (entryPromise.rejected())
                        delete queryCache[cacheKey];
                }
            });
            return { deferred: deferred, promise: promise };
        };
        /**
         * clears the cache from the entry associated with the provided cache key
         * @param {string} cacheKey - Identifier of the cache entry
         * @param {boolean} rejectPromise - indicates of the promise should be reject. Promise is reject only if it is pending
         */
        RejectablePromiseCache.prototype.clearEntry = function (cacheKey, rejectPromise) {
            var cacheEntry = this.getCacheEntry(cacheKey);
            if (cacheEntry) {
                var cachePromise = cacheEntry.promise;
                if (rejectPromise && cachePromise) {
                    // It is sufficient to just reject the promise since
                    // reject will finally delete the cache as well (see implementation of createCacheEntry)
                    cachePromise.reject();
                }
                else {
                    delete this.cache[cacheKey];
                }
                return true;
            }
            return false;
        };
        /**
         * clears the cache from the entry associated with the provided cache key
         * @param {boolean} rejectPromise - indicates of promises should be reject. A Promise is reject only if it is pending
         */
        RejectablePromiseCache.prototype.clearAllEntries = function (rejectPromise) {
            for (var cacheKey in this.cache) {
                this.clearEntry(cacheKey, rejectPromise);
            }
        };
        /**
         * Bind a new promise to cached query results and returns the promise. Once results are available deferred is resolved
         * @param {string} cacheKey - Identifier of the cache entry
         */
        RejectablePromiseCache.prototype.bindCacheEntry = function (cacheKey) {
            debug.assertValue(cacheKey, 'cacheKey');
            var cacheEntry = this.getCacheEntry(cacheKey);
            // if there is no cache entry for this key, return
            if (cacheEntry === undefined)
                return;
            var deferred = this.promiseFactory.defer();
            var promise = powerbi.RejectablePromise(deferred);
            if (cacheEntry.result) {
                deferred.resolve(cacheEntry.result);
                return promise;
            }
            var cachePromise = cacheEntry.promise;
            if (!cachePromise) {
                deferred.reject(null);
                return promise;
            }
            cacheEntry.refCount++;
            // once promise is complete, decrement the reference county
            promise.finally(function () {
                cacheEntry.refCount--;
                // if cache promise is pending and there is no one references it, it is no longer needed so reject it
                if (cacheEntry.refCount === 0 && cachePromise.pending())
                    cachePromise.reject();
            });
            // bind cache to deferred
            // once cached promise is resolved, if it is rejected, remove it from cache
            cachePromise.then(function (result) { return deferred.resolve(result); }, function (errorReason) { return deferred.reject(errorReason); });
            return promise;
        };
        /**
         * Enumerates over cache entries and passes each to the rewriter
         * @param {IRejectablePromiseCacheRewiter} rewriter - rewriter of cache key
         * rewriter may indicate that rewrite is completed.
         */
        RejectablePromiseCache.prototype.rewriteAllEntries = function (rewriter) {
            var keyUpdates = [];
            var hasRewriteKey = !!rewriter.rewriteKey;
            var hasRewriteResult = !!rewriter.rewriteResult;
            var queryCache = this.cache;
            for (var cacheKey in queryCache) {
                if (hasRewriteKey) {
                    var newKey = rewriter.rewriteKey(cacheKey);
                    if (newKey !== cacheKey)
                        keyUpdates.push({ oldKey: cacheKey, newKey: newKey });
                }
                if (hasRewriteResult) {
                    var entry = queryCache[cacheKey];
                    if (entry && entry.result) {
                        entry.result = rewriter.rewriteResult(entry.result, cacheKey);
                    }
                    else {
                        entry.updateResult = function (result) {
                            return rewriter.rewriteResult(result, cacheKey);
                        };
                    }
                }
            }
            for (var i = 0, length = keyUpdates.length; i < length; i++)
                this.changeCacheKey(keyUpdates[i].oldKey, keyUpdates[i].newKey);
        };
        /**
         * Change cache Key (rekey). It will check for collision before changing the key
         * If rekey is successful, this function will return true, otherwise it will return false
         */
        RejectablePromiseCache.prototype.changeCacheKey = function (oldKey, newKey) {
            //delete cache if newkey is undefined/null/emptystring
            if (!newKey) {
                return this.clearEntry(oldKey, true);
            }
            // avoid collision
            // avoid changes where oldkey is invalid
            if (this.hasCacheEntry(newKey) || !this.hasCacheEntry(oldKey))
                return false;
            var cacheEntry = this.getCacheEntry(oldKey);
            delete this.cache[oldKey];
            this.cache[newKey] = cacheEntry;
            return true;
        };
        /**
         * Gets cache entry associated with the provided key
         * @param {string} cacheKey - Identifier of the cache entry
         */
        RejectablePromiseCache.prototype.getCacheEntry = function (cacheKey) {
            debug.assertValue(cacheKey, 'cacheKey');
            var entry;
            if (!!cacheKey && (entry = this.cache[cacheKey]) && (entry.promise || entry.result)) {
                return entry;
            }
            return;
        };
        /**
         * Maximum number of entries in the cache
         * Cache is cleared entirely once it reaches this limit
         */
        RejectablePromiseCache.maxCacheEntries = 100;
        return RejectablePromiseCache;
    })();
    powerbi.RejectablePromiseCache = RejectablePromiseCache;
})(powerbi || (powerbi = {}));
//----------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
//----------------------------------------------------------------
var jsCommon;
(function (jsCommon) {
    var doc = document, headElement = doc.head, firstScriptInHeadElement = headElement.getElementsByTagName('script')[0], linkElement = doc.createElement('link'), scriptElement = doc.createElement('script'), styleSheetLoaded = [], javaScriptFilesLoaded = [], javaScriptFilesLoading = [];
    linkElement.setAttribute('rel', 'stylesheet');
    function requires(dependency, to) {
        if (to === void 0) { to = function () {
        }; }
        loadStyleSheets(dependency.cssFiles || []);
        var scriptsToRun = dependency.javaScriptFilesWithCallback || [];
        if (dependency.javaScriptFiles) {
            for (var i = 0, len = dependency.javaScriptFiles.length; i < len; ++i) {
                scriptsToRun.push({ javascriptFile: dependency.javaScriptFiles[i] });
            }
        }
        loadJavaScriptFiles(scriptsToRun, to);
    }
    jsCommon.requires = requires;
    // Private Helpers
    function loadStyleSheets(hrefList) {
        hrefList.forEach(function (href) {
            if (styleSheetLoaded.indexOf(href) === -1) {
                styleSheetLoaded.push(href);
                loadStyleSheet(href);
            }
        });
    }
    function loadJavaScriptFiles(scripts, callback) {
        var loadingCount = scripts.length, parsingCount = loadingCount, sourceCodeList = [];
        function parseIfLoadingComplete() {
            if (!--loadingCount) {
                parseJavaScriptSourceCodes(scripts, sourceCodeList);
            }
        }
        function makeCallbackIfParsingComplete() {
            if (!--parsingCount) {
                callback();
            }
        }
        scripts.forEach(function (script, index) {
            var file = script.javascriptFile;
            if (javaScriptFilesLoaded.indexOf(file) === -1) {
                if (file in javaScriptFilesLoading) {
                    javaScriptFilesLoading[file].push(function () {
                        parseIfLoadingComplete();
                        makeCallbackIfParsingComplete();
                    });
                }
                else {
                    javaScriptFilesLoading[file] = [function () {
                        makeCallbackIfParsingComplete();
                    }];
                    if (isExternalUrl(file)) {
                        sourceCodeList[index] = script;
                        parseIfLoadingComplete();
                    }
                    else {
                        loadJavaScriptSourceCode(file, function (sourceCode) {
                            sourceCodeList[index] = { javascriptFile: sourceCode };
                            parseIfLoadingComplete();
                        });
                    }
                }
            }
            else {
                parseIfLoadingComplete();
                makeCallbackIfParsingComplete();
            }
        });
    }
    function loadStyleSheet(href) {
        var link = linkElement.cloneNode();
        link.href = href;
        if (firstScriptInHeadElement) {
            headElement.insertBefore(link, firstScriptInHeadElement);
        }
        else {
            headElement.appendChild(link);
        }
    }
    function loadJavaScriptSourceCode(src, onload) {
        webGet(src, function () {
            onload(this.responseText);
        });
    }
    function parseJavaScript(script, onComplete) {
        if (onComplete === void 0) { onComplete = function () {
        }; }
        if (!script) {
            onComplete();
            return;
        }
        var sourceCodeOrFileName = script.javascriptFile;
        var targetCallback = onComplete;
        if (script.onLoadCallback) {
            var promiseAsCallback = function () {
                script.onLoadCallback().then(onComplete);
            };
            targetCallback = promiseAsCallback;
        }
        isExternalUrl(sourceCodeOrFileName) ? loadExternalJavaScriptFile(sourceCodeOrFileName, targetCallback) : parseInternalJavaScriptCode(sourceCodeOrFileName, targetCallback);
    }
    function parseInternalJavaScriptCode(sourceCode, onComplete) {
        if (onComplete === void 0) { onComplete = function () {
        }; }
        var script;
        if (sourceCode) {
            script = scriptElement.cloneNode();
            script.setAttribute('type', 'text/javascript');
            script.innerHTML = sourceCode;
            headElement.appendChild(script);
        }
        setTimeout(onComplete, 0);
    }
    function loadExternalJavaScriptFile(src, onload) {
        var script;
        if (src) {
            script = scriptElement.cloneNode();
            script.setAttribute('src', src);
            script.setAttribute('charset', 'utf-8');
            script.onload = onload;
            headElement.appendChild(script);
        }
    }
    function parseJavaScriptSourceCodes(scripts, sourceCodeList) {
        asyncLoop(sourceCodeList, parseJavaScript, function () {
            scripts.forEach(function (script) {
                var file = script.javascriptFile;
                var listeners = javaScriptFilesLoading[file];
                if (listeners) {
                    listeners.forEach(function (listener) {
                        listener();
                    });
                }
                delete javaScriptFilesLoading[file];
                if (javaScriptFilesLoaded.indexOf(file) === -1) {
                    javaScriptFilesLoaded.push(file);
                }
            });
        });
    }
    function webGet(src, onload, onerror) {
        var xhr = new XMLHttpRequest();
        try {
            xhr.open('GET', src, true);
            xhr.onload = onload;
            xhr.onerror = onerror;
            xhr.send(null);
        }
        catch (e) {
        }
    }
    function isExternalUrl(url) {
        var origin = location.protocol + '//' + location.host + '/';
        return /^http[s]?:\/\/.+/i.test(url) && url.indexOf(origin) !== 0;
    }
    function _() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
    }
    function asyncSteps() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (args.length === 0) {
            return;
        }
        var steps = [], i = args.length;
        while (i--) {
            (function (j) {
                steps[j] = function () {
                    args[j](steps[j + 1] || _);
                };
            })(i);
        }
        steps[0]();
    }
    function asyncLoop(enumerable, func, callback) {
        var steps = [], i = 0, len = enumerable.length;
        for (; i < len - 1; i++) {
            (function (i) {
                steps[i] = function (next) {
                    func(enumerable[i], next);
                };
            }(i));
        }
        steps[len - 1] = function (next) {
            func(enumerable[len - 1], callback);
        };
        asyncSteps.apply(null, steps);
    }
})(jsCommon || (jsCommon = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    powerbi.CategoryTypes = {
        Address: "Address",
        City: "City",
        Continent: "Continent",
        CountryRegion: "Country",
        County: "County",
        Longitude: "Longitude",
        Latitude: "Latitude",
        Place: "Place",
        PostalCode: "PostalCode",
        StateOrProvince: "StateOrProvince"
    };
    function createGeoTaggingAnalyzerService(getLocalized) {
        return new GeoTaggingAnalyzerService(getLocalized);
    }
    powerbi.createGeoTaggingAnalyzerService = createGeoTaggingAnalyzerService;
    var GeoTaggingAnalyzerService = (function () {
        function GeoTaggingAnalyzerService(getLocalized) {
            this.GeotaggingString_VRMBackCompat_CountryRegion = "CountryRegion";
            this.GeotaggingString_VRMBackCompat_StateOrProvince = "StateOrProvince";
            this.GeotaggingString_Continent = getLocalized("GeotaggingString_Continent").toLowerCase();
            this.GeotaggingString_Continents = getLocalized("GeotaggingString_Continents").toLowerCase();
            this.GeotaggingString_Country = getLocalized("GeotaggingString_Country").toLowerCase();
            this.GeotaggingString_Countries = getLocalized("GeotaggingString_Countries").toLowerCase();
            this.GeotaggingString_State = getLocalized("GeotaggingString_State").toLowerCase();
            this.GeotaggingString_States = getLocalized("GeotaggingString_States").toLowerCase();
            this.GeotaggingString_City = getLocalized("GeotaggingString_City").toLowerCase();
            this.GeotaggingString_Cities = getLocalized("GeotaggingString_Cities").toLowerCase();
            this.GeotaggingString_Town = getLocalized("GeotaggingString_Town").toLowerCase();
            this.GeotaggingString_Towns = getLocalized("GeotaggingString_Towns").toLowerCase();
            this.GeotaggingString_Province = getLocalized("GeotaggingString_Province").toLowerCase();
            this.GeotaggingString_Provinces = getLocalized("GeotaggingString_Provinces").toLowerCase();
            this.GeotaggingString_County = getLocalized("GeotaggingString_County").toLowerCase();
            this.GeotaggingString_Counties = getLocalized("GeotaggingString_Counties").toLowerCase();
            this.GeotaggingString_Village = getLocalized("GeotaggingString_Village").toLowerCase();
            this.GeotaggingString_Villages = getLocalized("GeotaggingString_Villages").toLowerCase();
            this.GeotaggingString_Post = getLocalized("GeotaggingString_Post").toLowerCase();
            this.GeotaggingString_Zip = getLocalized("GeotaggingString_Zip").toLowerCase();
            this.GeotaggingString_Code = getLocalized("GeotaggingString_Code").toLowerCase();
            this.GeotaggingString_Place = getLocalized("GeotaggingString_Place").toLowerCase();
            this.GeotaggingString_Places = getLocalized("GeotaggingString_Places").toLowerCase();
            this.GeotaggingString_Address = getLocalized("GeotaggingString_Address").toLowerCase();
            this.GeotaggingString_Addresses = getLocalized("GeotaggingString_Addresses").toLowerCase();
            this.GeotaggingString_Street = getLocalized("GeotaggingString_Street").toLowerCase();
            this.GeotaggingString_Streets = getLocalized("GeotaggingString_Streets").toLowerCase();
            this.GeotaggingString_Longitude = getLocalized("GeotaggingString_Longitude").toLowerCase();
            this.GeotaggingString_Longitude_Short = getLocalized("GeotaggingString_Longitude_Short").toLowerCase();
            this.GeotaggingString_Latitude = getLocalized("GeotaggingString_Latitude").toLowerCase();
            this.GeotaggingString_Latitude_Short = getLocalized("GeotaggingString_Latitude_Short").toLowerCase();
            this.GeotaggingString_PostalCode = getLocalized("GeotaggingString_PostalCode").toLowerCase();
            this.GeotaggingString_PostalCodes = getLocalized("GeotaggingString_PostalCodes").toLowerCase();
            this.GeotaggingString_ZipCode = getLocalized("GeotaggingString_ZipCode").toLowerCase();
            this.GeotaggingString_ZipCodes = getLocalized("GeotaggingString_ZipCodes").toLowerCase();
            this.GeotaggingString_Territory = getLocalized("GeotaggingString_Territory").toLowerCase();
            this.GeotaggingString_Territories = getLocalized("GeotaggingString_Territories").toLowerCase();
        }
        GeoTaggingAnalyzerService.prototype.isLongitudeOrLatitude = function (fieldRefName) {
            return this.isLongitude(fieldRefName) || this.isLatitude(fieldRefName);
        };
        GeoTaggingAnalyzerService.prototype.isGeographic = function (fieldRefName) {
            return this.isLongitudeOrLatitude(fieldRefName) || this.isGeocodable(fieldRefName);
        };
        GeoTaggingAnalyzerService.prototype.isGeocodable = function (fieldRefName) {
            return this.isAddress(fieldRefName) || this.isCity(fieldRefName) || this.isContinent(fieldRefName) || this.isCountry(fieldRefName) || this.isCounty(fieldRefName) || this.isStateOrProvince(fieldRefName) || this.isPlace(fieldRefName) || this.isPostalCode(fieldRefName) || this.isTerritory(fieldRefName);
        };
        GeoTaggingAnalyzerService.prototype.isAddress = function (fieldRefName) {
            return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
                this.GeotaggingString_Address,
                this.GeotaggingString_Addresses,
                this.GeotaggingString_Street,
                this.GeotaggingString_Streets
            ]);
        };
        GeoTaggingAnalyzerService.prototype.isPlace = function (fieldRefName) {
            return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
                this.GeotaggingString_Place,
                this.GeotaggingString_Places
            ]);
        };
        GeoTaggingAnalyzerService.prototype.isCity = function (fieldRefName) {
            return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
                this.GeotaggingString_City,
                this.GeotaggingString_Cities,
                this.GeotaggingString_Town,
                this.GeotaggingString_Towns,
                this.GeotaggingString_Village,
                this.GeotaggingString_Villages
            ]);
        };
        GeoTaggingAnalyzerService.prototype.isStateOrProvince = function (fieldRefName) {
            return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
                this.GeotaggingString_State,
                this.GeotaggingString_States,
                this.GeotaggingString_Province,
                this.GeotaggingString_Provinces,
                this.GeotaggingString_VRMBackCompat_StateOrProvince,
            ]);
        };
        GeoTaggingAnalyzerService.prototype.isCountry = function (fieldRefName) {
            return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
                this.GeotaggingString_Country,
                this.GeotaggingString_Countries,
                this.GeotaggingString_VRMBackCompat_CountryRegion
            ]);
        };
        GeoTaggingAnalyzerService.prototype.isCounty = function (fieldRefName) {
            return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
                this.GeotaggingString_County,
                this.GeotaggingString_Counties
            ]);
        };
        GeoTaggingAnalyzerService.prototype.isContinent = function (fieldRefName) {
            return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
                this.GeotaggingString_Continent,
                this.GeotaggingString_Continents
            ]);
        };
        GeoTaggingAnalyzerService.prototype.isPostalCode = function (fieldRefName) {
            var result = (GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
                this.GeotaggingString_Post,
                this.GeotaggingString_Zip
            ]) && GeoTaggingAnalyzerService.hasMatches(fieldRefName, [this.GeotaggingString_Code])) || GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
                this.GeotaggingString_PostalCode,
                this.GeotaggingString_PostalCodes,
                this.GeotaggingString_ZipCode,
                this.GeotaggingString_ZipCodes
            ]);
            //Check again for strings without whitespace
            if (!result) {
                var whiteSpaceRegexPattern = new RegExp('\s');
                result = GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
                    this.GeotaggingString_PostalCode.replace(whiteSpaceRegexPattern, ''),
                    this.GeotaggingString_PostalCodes.replace(whiteSpaceRegexPattern, ''),
                    this.GeotaggingString_ZipCode.replace(whiteSpaceRegexPattern, ''),
                    this.GeotaggingString_ZipCodes.replace(whiteSpaceRegexPattern, '')
                ]);
            }
            return result;
        };
        GeoTaggingAnalyzerService.prototype.isLongitude = function (fieldRefName) {
            return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
                this.GeotaggingString_Longitude,
                this.GeotaggingString_Longitude_Short
            ]);
        };
        GeoTaggingAnalyzerService.prototype.isLatitude = function (fieldRefName) {
            return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
                this.GeotaggingString_Latitude,
                this.GeotaggingString_Latitude_Short
            ]);
        };
        GeoTaggingAnalyzerService.prototype.isTerritory = function (fieldRefName) {
            return GeoTaggingAnalyzerService.hasMatches(fieldRefName, [
                this.GeotaggingString_Territory,
                this.GeotaggingString_Territories
            ]);
        };
        GeoTaggingAnalyzerService.hasMatches = function (fieldName, possibleMatches) {
            var value = fieldName.toLowerCase();
            for (var i = 0, len = possibleMatches.length; i < len; i++) {
                var possibleMatch = possibleMatches[i];
                if (value.indexOf(possibleMatch) > -1)
                    return true;
            }
            return false;
        };
        GeoTaggingAnalyzerService.prototype.getFieldType = function (fieldName) {
            if (fieldName == null)
                return undefined;
            if (this.isLatitude(fieldName))
                return powerbi.CategoryTypes.Latitude;
            if (this.isLongitude(fieldName))
                return powerbi.CategoryTypes.Longitude;
            if (this.isPostalCode(fieldName))
                return powerbi.CategoryTypes.PostalCode;
            if (this.isAddress(fieldName))
                return powerbi.CategoryTypes.Address;
            if (this.isPlace(fieldName))
                return powerbi.CategoryTypes.Place;
            if (this.isCity(fieldName))
                return powerbi.CategoryTypes.City;
            if (this.isCountry(fieldName))
                return powerbi.CategoryTypes.CountryRegion;
            if (this.isCounty(fieldName))
                return powerbi.CategoryTypes.County;
            if (this.isStateOrProvince(fieldName))
                return powerbi.CategoryTypes.StateOrProvince;
            if (this.isContinent(fieldName))
                return powerbi.CategoryTypes.Continent;
            return undefined;
        };
        return GeoTaggingAnalyzerService;
    })();
    powerbi.GeoTaggingAnalyzerService = GeoTaggingAnalyzerService;
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    function createJQueryPromiseFactory() {
        return new JQueryPromiseFactory();
    }
    powerbi.createJQueryPromiseFactory = createJQueryPromiseFactory;
    /**
     * jQuery-based implementation of IPromiseFactory.
     * This is useful for cases when Angular is not present, or when immediate promise resolving (not tied to Angular digest cycle) is desired.
     */
    var JQueryPromiseFactory = (function () {
        function JQueryPromiseFactory() {
        }
        JQueryPromiseFactory.prototype.defer = function () {
            return new JQueryDeferredWrapper($.Deferred());
        };
        JQueryPromiseFactory.prototype.reject = function (reason) {
            var deferred = this.defer();
            deferred.reject(reason);
            return deferred.promise;
        };
        JQueryPromiseFactory.prototype.resolve = function (value) {
            var deferred = this.defer();
            deferred.resolve(value);
            return deferred.promise;
        };
        return JQueryPromiseFactory;
    })();
    /** Implements IDeferred via a wrapped a jQuery Deferred. */
    var JQueryDeferredWrapper = (function () {
        function JQueryDeferredWrapper(deferred) {
            debug.assertValue(deferred, 'deferred');
            this.deferred = deferred;
            this.promise = new JQueryPromiseWrapper(deferred.promise());
        }
        JQueryDeferredWrapper.prototype.resolve = function (value) {
            this.deferred.resolve(value);
        };
        JQueryDeferredWrapper.prototype.reject = function (reason) {
            this.deferred.reject(reason);
        };
        return JQueryDeferredWrapper;
    })();
    /** Implements IDeferred via a wrapped a jQuery Promise. */
    var JQueryPromiseWrapper = (function () {
        function JQueryPromiseWrapper(promise) {
            debug.assertValue(promise, 'promise');
            this.promise = promise;
        }
        JQueryPromiseWrapper.prototype.then = function (a, b) {
            return new JQueryPromiseWrapper(this.promise.then(JQueryPromiseWrapper.wrapCallback(a), JQueryPromiseWrapper.wrapCallback(b)));
        };
        JQueryPromiseWrapper.prototype.catch = function (callback) {
            return this.then(null, callback);
        };
        JQueryPromiseWrapper.prototype.finally = function (callback) {
            this.promise.always(JQueryPromiseWrapper.wrapCallback(callback));
            return this;
        };
        /** Wraps a callback, which may return a IPromise. */
        JQueryPromiseWrapper.wrapCallback = function (callback) {
            if (callback)
                return function (arg) {
                    var value = callback(arg);
                    // If the callback returns a Promise, unwrap that to allow jQuery to chain.
                    if (value instanceof JQueryPromiseWrapper)
                        return value.promise;
                    return value;
                };
            return callback;
        };
        return JQueryPromiseWrapper;
    })();
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var LocalStorageService = (function () {
        function LocalStorageService() {
        }
        LocalStorageService.prototype.getData = function (key) {
            try {
                if (localStorage) {
                    return JSON.parse(localStorage[key]);
                }
            }
            catch (exception) {
            }
            return null;
        };
        LocalStorageService.prototype.setData = function (key, data) {
            try {
                if (localStorage) {
                    localStorage[key] = JSON.stringify(data);
                }
            }
            catch (e) {
            }
        };
        return LocalStorageService;
    })();
    powerbi.localStorageService = new LocalStorageService();
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    var TextMeasurementService;
    (function (TextMeasurementService) {
        var spanElement;
        var svgTextElement;
        var canvasCtx;
        /** Idempotent function for adding the elements to the DOM. */
        function ensureDOM() {
            if (spanElement)
                return;
            spanElement = $('<span/>');
            $('body').append(spanElement);
            svgTextElement = d3.select($('body').get(0)).append('svg').append('text');
            canvasCtx = $('<canvas/>').get(0).getContext("2d");
        }
        // TODO: this is not ideal - we need to pass TextProperties such as fond and size by code, while those parameters are set from css.
        /**
         * This method measures the width of the text with the given text properties
         * @param {ITextMeasurementProperties} textProperties - The text properties to use for text measurement
         */
        function measureTextWidth(textProperties) {
            ensureDOM();
            spanElement.removeAttr('style').empty().css('visibility', 'hidden');
            spanElement.text(textProperties.text).css({
                fontFamily: textProperties.fontFamily,
                fontSize: textProperties.fontSize,
                fontWeight: textProperties.fontWeight,
                fontStyle: textProperties.fontStyle,
                whiteSpace: textProperties.whiteSpace || 'nowrap'
            });
            // The use of 'getComputedStyle' is required to get exact values of sizes, without rounding off to nearest integer
            //  The rounding off can cause a slight difference in the width, which can have undesirable effects including flickering.
            var measuredWidth = parseInt(getComputedStyle(spanElement[0]).width, 10);
            return measuredWidth;
        }
        TextMeasurementService.measureTextWidth = measureTextWidth;
        /**
         * This method measures the width of the text with the given SVG text properties
         * @param {ITextMeasurementProperties} textProperties - The text properties to use for text measurement
         */
        function measureSvgTextWidth(textProperties) {
            ensureDOM();
            canvasCtx.font = textProperties.fontSize + ' ' + textProperties.fontFamily;
            return canvasCtx.measureText(textProperties.text).width;
        }
        TextMeasurementService.measureSvgTextWidth = measureSvgTextWidth;
        /**
         * This method measures the height of the text with the given SVG text properties
         * @param {ITextMeasurementProperties} textProperties - The text properties to use for text measurement
         */
        function measureSvgTextHeight(textProperties) {
            ensureDOM();
            svgTextElement.style(null);
            svgTextElement.text(textProperties.text).attr({
                'visibility': 'hidden',
                'font-family': textProperties.fontFamily,
                'font-size': textProperties.fontSize,
                'font-weight': textProperties.fontWeight,
                'font-style': textProperties.fontStyle,
                'white-space': textProperties.whiteSpace || 'nowrap'
            });
            // We're expecting the browser to give a synchronous measurement here
            return svgTextElement.node().getBoundingClientRect().height;
        }
        TextMeasurementService.measureSvgTextHeight = measureSvgTextHeight;
        /**
         * This method measures the width of the svgElement.
         * @param {SVGTextElement} element - The SVGTextElement to be measured.
         */
        function measureSvgTextElementWidth(svgElement) {
            return measureSvgTextWidth(getSvgMeasurementProperties(svgElement));
        }
        TextMeasurementService.measureSvgTextElementWidth = measureSvgTextElementWidth;
        /**
         * This method fetches the text measurement properties of the given DOM element.
         * @param {JQuery} element - The selector for the DOM Element.
         */
        function getMeasurementProperties(element) {
            return {
                text: element.val() || element.text(),
                fontFamily: element.css('font-family'),
                fontSize: element.css('font-size'),
                fontWeight: element.css('font-weight'),
                fontStyle: element.css('font-style'),
                whiteSpace: element.css('white-space')
            };
        }
        TextMeasurementService.getMeasurementProperties = getMeasurementProperties;
        /**
         * This method fetches the text measurement properties of the given SVG text element.
         * @param {SVGTextElement} element - The SVGTextElement to be measured.
         */
        function getSvgMeasurementProperties(svgElement) {
            var style = window.getComputedStyle(svgElement, null);
            return {
                text: svgElement.textContent,
                fontFamily: style.fontFamily,
                fontSize: style.fontSize,
                fontWeight: style.fontWeight,
                fontStyle: style.fontStyle,
                whiteSpace: style.whiteSpace
            };
        }
        TextMeasurementService.getSvgMeasurementProperties = getSvgMeasurementProperties;
        /**
         * This method returns the width of a div element
         * @param {JQuery} element: The div element
         */
        function getDivElementWidth(element) {
            debug.assert(element.is('div'), 'Given element is not a div type. Cannot get width');
            return getComputedStyle(element[0]).width;
        }
        TextMeasurementService.getDivElementWidth = getDivElementWidth;
        /**
        * Compares labels text size to the available size and renders ellipses when the available size is smaller
        * @param {ITextMeasurementProperties} textProperties - The text properties (including text content) to use for text measurement
        * @param maxWidth - the maximum width available for rendering the text
        */
        function getTailoredTextOrDefault(properties, maxWidth) {
            ensureDOM();
            var dotsString = '...';
            debug.assertValue(properties, 'properties');
            debug.assertValue(properties.text, 'properties.text');
            var strLength = properties.text.length;
            if (strLength === 0)
                return properties.text;
            var width = measureSvgTextWidth(properties);
            if (width < maxWidth)
                return properties.text;
            // Take the properties and apply them to svgTextElement
            // Then, do the binary search to figure out the substring we want
            // Set the substring on textElement argument
            var text = properties.text = dotsString + properties.text;
            var min = 1;
            var max = text.length;
            var i = 3;
            while (min <= max) {
                // num | 0 prefered to Math.floor(num) for performance benefits
                i = (min + max) / 2 | 0;
                properties.text = text.substr(0, i);
                width = measureSvgTextWidth(properties);
                if (maxWidth > width)
                    min = i + 1;
                else if (maxWidth < width)
                    max = i - 1;
                else
                    break;
            }
            // Since the search algorithm almost never finds an exact match,
            // it will pick one of the closest two, which could result in a
            // value bigger with than 'maxWidth' thus we need to go back by 
            // one to guarantee a smaller width than 'maxWidth'.
            properties.text = text.substr(0, i);
            width = measureSvgTextWidth(properties);
            if (width > maxWidth)
                i--;
            return text.substr(3, i - 3) + dotsString;
        }
        TextMeasurementService.getTailoredTextOrDefault = getTailoredTextOrDefault;
        /**
        * Compares labels text size to the available size and renders ellipses when the available size is smaller
        * @param textElement - the SVGTextElement containing the text to render
        * @param maxWidth - the maximum width available for rendering the text
        */
        function svgEllipsis(textElement, maxWidth) {
            var properties = getSvgMeasurementProperties(textElement);
            var originalText = properties.text;
            var tailoredText = getTailoredTextOrDefault(properties, maxWidth);
            if (originalText !== tailoredText) {
                textElement.textContent = tailoredText;
            }
        }
        TextMeasurementService.svgEllipsis = svgEllipsis;
    })(TextMeasurementService = powerbi.TextMeasurementService || (powerbi.TextMeasurementService = {}));
})(powerbi || (powerbi = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var jsCommon;
(function (jsCommon) {
    var UnionExtensions;
    (function (UnionExtensions) {
        /**
         * Merges objects representing parts of a union type into a single object.
         * arg1 may be modified during the merge.
         */
        function mergeUnionType(arg1, arg2, arg3) {
            if (!arg1 && !arg2 && !arg3)
                return;
            // In most cases, our union types are used in a mutually exclusive way,
            // so only one object will be populated.
            if (arg1 && !arg2 && !arg3)
                return arg1;
            if (!arg1 && arg2 && !arg3)
                return arg2;
            if (!arg1 && !arg2 && arg3)
                return arg3;
            return $.extend(arg1, arg2, arg3);
        }
        UnionExtensions.mergeUnionType = mergeUnionType;
    })(UnionExtensions = jsCommon.UnionExtensions || (jsCommon.UnionExtensions = {}));
})(jsCommon || (jsCommon = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var InJs;
(function (InJs) {
    var InfoNavUtility = (function () {
        function InfoNavUtility() {
        }
        /**
         * Create an Error Information Block
         * @param statusCode - The status code to display
         * @param errorType - The optional error string to display
         * @param activityId - The activity id
         * @param requestId - The request id
         * @param timeStamp - The timestamp
         */
        InfoNavUtility.constructAdditionalErrorInfoBlock = function (statusCode, errorType, activityId, requestId, timeStamp, scriptError) {
            var additionalErrorInfo = $('<p />');
            if (!jsCommon.StringExtensions.isNullOrEmpty(statusCode)) {
                var errorCode = statusCode;
                if (!jsCommon.StringExtensions.isNullOrEmpty(errorType)) {
                    errorCode = jsCommon.StringExtensions.format(InJs.Strings.infoNavErrorCodeTemplate, statusCode, errorType);
                }
                additionalErrorInfo.append(InfoNavUtility.constructErrorField(InJs.Strings.errorCodeText, errorCode));
            }
            if (!jsCommon.StringExtensions.isNullOrEmpty(activityId)) {
                additionalErrorInfo.append(InfoNavUtility.constructErrorField(InJs.Strings.errorActivityIdText, activityId));
            }
            if (!jsCommon.StringExtensions.isNullOrEmpty(requestId)) {
                additionalErrorInfo.append(InfoNavUtility.constructErrorField(InJs.Strings.errorRequestIdText, requestId));
            }
            if (scriptError) {
                if (scriptError.sourceUrl) {
                    additionalErrorInfo.append(InfoNavUtility.constructErrorField(InJs.Strings.errorSourceFileText, scriptError.sourceUrl));
                }
                if (scriptError.lineNumber) {
                    additionalErrorInfo.append(InfoNavUtility.constructErrorField(InJs.Strings.errorLineNumberText, scriptError.lineNumber.toString()));
                }
                if (scriptError.columnNumber) {
                    additionalErrorInfo.append(InfoNavUtility.constructErrorField(InJs.Strings.errorColumnNumberText, scriptError.columnNumber.toString()));
                }
                if (scriptError.stack) {
                    additionalErrorInfo.append(InfoNavUtility.constructErrorField(InJs.Strings.errorStackTraceText, scriptError.stack));
                }
            }
            if (!timeStamp) {
                timeStamp = new Date();
            }
            additionalErrorInfo.append(InfoNavUtility.constructErrorField(InJs.Strings.errorTimestampText, timeStamp.toString()));
            return additionalErrorInfo;
        };
        /**
         * Create a container that can show additional error info when a user clicks a show details link
         * @param additionalErrorInfo - The additional error info to display
         * @returns The container
         */
        InfoNavUtility.constructShowDetailsContainer = function (additionalErrorInfo) {
            var additionalErrorInfoContainer = $('<div />');
            var showDetailsLink = $('<a class="showAdditionalDetailsLink" href=\'javascript:\' />');
            showDetailsLink.addClass(InfoNavUtility.infonavShowAdditionalErrorClass);
            showDetailsLink.text(InJs.Strings.showDetailsText);
            showDetailsLink.on(jsCommon.DOMConstants.mouseClickEventName, function (e) {
                additionalErrorInfoContainer.find(jsCommon.Utility.createClassSelector(InfoNavUtility.infonavShowAdditionalErrorClass)).remove();
                additionalErrorInfoContainer.find(jsCommon.Utility.createClassSelector(InfoNavUtility.infonavAdditionalErrorClass)).css(jsCommon.CssConstants.displayProperty, jsCommon.CssConstants.blockValue);
            });
            additionalErrorInfo.css(jsCommon.CssConstants.displayProperty, jsCommon.CssConstants.noneValue);
            additionalErrorInfo.addClass(InfoNavUtility.infonavAdditionalErrorClass);
            additionalErrorInfoContainer.append(showDetailsLink);
            additionalErrorInfoContainer.append(additionalErrorInfo);
            return additionalErrorInfoContainer;
        };
        /**
         * Helper method to construct an error field
         * @param fieldTitle - The title of the field
         * @param fieldValue - The value for the field
         * @returns An html fragment for the error field
         */
        InfoNavUtility.constructErrorField = function (fieldTitle, fieldValue) {
            var retValue = $(InfoNavUtility.infoNavErrorInfoFieldTemplate.replace('{FieldTitle}', fieldTitle));
            retValue.find('.infonav-errorInfoText').multiline(fieldValue);
            return retValue;
        };
        // Error Templates
        // TODO: Move Error Templating code to a shared control
        InfoNavUtility.infonavAdditionalErrorClass = 'infonav-additionalError';
        InfoNavUtility.infonavShowAdditionalErrorClass = 'infonav-showAdditionalError';
        InfoNavUtility.infoNavErrorInfoFieldTemplate = '<div class="infonav-errorInfoItem">' + '<span class="infonav-errorInfoHeader">{FieldTitle}</span>' + '<span class="infonav-errorInfoText">{FieldValue}</span>' + '</div>';
        return InfoNavUtility;
    })();
    InJs.InfoNavUtility = InfoNavUtility;
})(InJs || (InJs = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var jsCommon;
(function (jsCommon) {
    /** Represents a batch of operations that can accumulate, and then be invoked together. */
    var DeferredBatch = (function () {
        function DeferredBatch(operation, timerFactory, maxBatchSize) {
            debug.assertValue(operation, 'operation');
            this._operation = operation;
            this._timerFactory = timerFactory || jsCommon.TimerPromiseFactory.instance;
            this._batches = [];
            if (maxBatchSize) {
                this._maxBatchSize = maxBatchSize;
                this._batchSize = 0;
            }
        }
        /** Returns a promise of future invocation of the batch. */
        DeferredBatch.prototype.enqueue = function () {
            var _this = this;
            var current = this._batches, currentBatch;
            ++this._batchSize;
            if (current.length === 0) {
                currentBatch = $.Deferred();
                current.push(currentBatch);
                // Delay the completion after a timeout of zero.  This allow currently running JS to complete
                // and potentially make more enqueue calls to be included in the current batch.
                this._timerFactory.create(0).done(function () { return _this.completeBatches(); });
            }
            else if (this._maxBatchSize && this._batchSize >= this._maxBatchSize) {
                // We've reached the maximum batch size
                this._batchSize = 0;
                currentBatch = $.Deferred();
                current.push(currentBatch);
            }
            else {
                // This batch still has space, reuse it
                currentBatch = current[current.length - 1];
            }
            return currentBatch.promise();
        };
        DeferredBatch.prototype.completeBatches = function () {
            var batch;
            while (batch = this._batches.pop())
                this.completeBatch(batch);
        };
        DeferredBatch.prototype.completeBatch = function (batch) {
            this._operation().done(function (r) { return batch.resolve(r); }).fail(function (r) { return batch.reject(r); });
        };
        return DeferredBatch;
    })();
    jsCommon.DeferredBatch = DeferredBatch;
})(jsCommon || (jsCommon = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var jsCommon;
(function (jsCommon) {
    /** Responsible for throttling input function. */
    var ThrottleUtility = (function () {
        function ThrottleUtility(delay) {
            this.timerFactory = jsCommon.TimerPromiseFactory.instance;
            this.delay = 0;
            if (delay) {
                this.delay = delay;
            }
        }
        ThrottleUtility.prototype.run = function (fn) {
            var _this = this;
            if (!this.fn) {
                this.fn = fn;
                this.timerFactory.create(this.delay).done(function () { return _this.timerComplete(_this.fn); });
            }
            else {
                this.fn = fn;
            }
        };
        // public for testing purpose
        ThrottleUtility.prototype.timerComplete = function (fn) {
            // run fn
            fn();
            // clear fn
            this.fn = null;
        };
        return ThrottleUtility;
    })();
    jsCommon.ThrottleUtility = ThrottleUtility;
})(jsCommon || (jsCommon = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var jsCommon;
(function (jsCommon) {
    /** Responsible for creating timer promises. */
    var TimerPromiseFactory = (function () {
        function TimerPromiseFactory() {
        }
        TimerPromiseFactory.prototype.create = function (delayInMs) {
            debug.assertValue(delayInMs, 'delayInMs');
            debug.assert(delayInMs >= 0, 'delayInMs must be a positive value.');
            var deferred = $.Deferred();
            window.setTimeout(function () { return deferred.resolve(); }, delayInMs);
            return deferred;
        };
        TimerPromiseFactory.instance = new TimerPromiseFactory();
        return TimerPromiseFactory;
    })();
    jsCommon.TimerPromiseFactory = TimerPromiseFactory;
})(jsCommon || (jsCommon = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var jsCommon;
(function (jsCommon) {
    /** Http Status code we are interested */
    (function (HttpStatusCode) {
        HttpStatusCode[HttpStatusCode["OK"] = 200] = "OK";
        HttpStatusCode[HttpStatusCode["BadRequest"] = 400] = "BadRequest";
        HttpStatusCode[HttpStatusCode["Unauthorized"] = 401] = "Unauthorized";
        HttpStatusCode[HttpStatusCode["Forbidden"] = 403] = "Forbidden";
        HttpStatusCode[HttpStatusCode["RequestEntityTooLarge"] = 413] = "RequestEntityTooLarge";
    })(jsCommon.HttpStatusCode || (jsCommon.HttpStatusCode = {}));
    var HttpStatusCode = jsCommon.HttpStatusCode;
    /** Other HTTP Constants */
    var HttpConstants;
    (function (HttpConstants) {
        HttpConstants.ApplicationOctetStream = 'application/octet-stream';
        HttpConstants.MultiPartFormData = 'multipart/form-data';
    })(HttpConstants = jsCommon.HttpConstants || (jsCommon.HttpConstants = {}));
    /** Extensions to String class */
    var StringExtensions;
    (function (StringExtensions) {
        function format() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var s = args[0];
            if (isNullOrUndefinedOrWhiteSpaceString(s))
                return s;
            for (var i = 0; i < args.length - 1; i++) {
                var reg = new RegExp("\\{" + i + "\\}", "gm");
                s = s.replace(reg, args[i + 1]);
            }
            return s;
        }
        StringExtensions.format = format;
        /** Compares two strings for equality, ignoring case. */
        function equalIgnoreCase(a, b) {
            return StringExtensions.normalizeCase(a) === StringExtensions.normalizeCase(b);
        }
        StringExtensions.equalIgnoreCase = equalIgnoreCase;
        function startsWithIgnoreCase(a, b) {
            var normalizedSearchString = StringExtensions.normalizeCase(b);
            return StringExtensions.normalizeCase(a).indexOf(normalizedSearchString) === 0;
        }
        StringExtensions.startsWithIgnoreCase = startsWithIgnoreCase;
        /** Normalizes case for a string.  Used by equalIgnoreCase method. */
        function normalizeCase(value) {
            Utility.throwIfNullOrUndefined(value, StringExtensions, 'normalizeCase', 'value');
            return value.toUpperCase();
        }
        StringExtensions.normalizeCase = normalizeCase;
        /** Is string null or empty or undefined? */
        function isNullOrEmpty(value) {
            return (value == null) || (value.length === 0);
        }
        StringExtensions.isNullOrEmpty = isNullOrEmpty;
        /** Returns true if the string is null, undefined, empty, or only includes white spaces */
        function isNullOrUndefinedOrWhiteSpaceString(str) {
            return StringExtensions.isNullOrEmpty(str) || StringExtensions.isNullOrEmpty(str.trim());
        }
        StringExtensions.isNullOrUndefinedOrWhiteSpaceString = isNullOrUndefinedOrWhiteSpaceString;
        /**
         * Returns a value indicating whether the str contains any whitespace.
         */
        function containsWhitespace(str) {
            Utility.throwIfNullOrUndefined(str, this, 'containsWhitespace', 'str');
            var expr = /\s/;
            return expr.test(str);
        }
        StringExtensions.containsWhitespace = containsWhitespace;
        /**
         * Returns a value indicating whether the str is a whitespace string.
         */
        function isWhitespace(str) {
            Utility.throwIfNullOrUndefined(str, this, 'isWhitespace', 'str');
            return str.trim() === '';
        }
        StringExtensions.isWhitespace = isWhitespace;
        /** Returns the string with any trailing whitespace from str removed. */
        function trimTrailingWhitespace(str) {
            Utility.throwIfNullOrUndefined(str, this, 'trimTrailingWhitespace', 'str');
            return str.replace(/\s+$/, '');
        }
        StringExtensions.trimTrailingWhitespace = trimTrailingWhitespace;
        /** Returns the string with any leading and trailing whitespace from str removed. */
        function trimWhitespace(str) {
            Utility.throwIfNullOrUndefined(str, this, 'trimWhitespace', 'str');
            return str.replace(/^\s+/, '').replace(/\s+$/, '');
        }
        StringExtensions.trimWhitespace = trimWhitespace;
        /** Returns length difference between the two provided strings */
        function getLengthDifference(left, right) {
            Utility.throwIfNullOrUndefined(left, this, 'getLengthDifference', 'left');
            Utility.throwIfNullOrUndefined(right, this, 'getLengthDifference', 'right');
            return Math.abs(left.length - right.length);
        }
        StringExtensions.getLengthDifference = getLengthDifference;
        /** Repeat char or string several times.
          * @param char The string to repeat.
          * @param count How many times to repeat the string.
          */
        function repeat(char, count) {
            var result = "";
            for (var i = 0; i < count; i++) {
                result += char;
            }
            return result;
        }
        StringExtensions.repeat = repeat;
        /** Replace all the occurrences of the textToFind in the text with the textToReplace
          * @param text The original string.
          * @param textToFind Text to find in the original string
          * @param textToReplace New text replacing the textToFind
          */
        function replaceAll(text, textToFind, textToReplace) {
            if (!textToFind)
                return text;
            var pattern = textToFind.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1');
            return text.replace(new RegExp(pattern, 'g'), textToReplace);
        }
        StringExtensions.replaceAll = replaceAll;
        /** Returns a name that is not specified in the values. */
        function findUniqueName(usedNames, baseName) {
            debug.assertValue(usedNames, 'usedNames');
            debug.assertValue(baseName, 'baseName');
            // Find a unique name
            var i = 0, uniqueName;
            do {
                uniqueName = baseName + (i++);
            } while (usedNames[uniqueName]);
            return uniqueName;
        }
        StringExtensions.findUniqueName = findUniqueName;
    })(StringExtensions = jsCommon.StringExtensions || (jsCommon.StringExtensions = {}));
    /** Script#: The general utility class */
    var Utility = (function () {
        function Utility() {
        }
        /**
         * Ensures the specified value is not null or undefined. Throws a relevent exception if it is.
         * @param value - The value to check
         * @param context - The context from which the check originated
         * @param methodName - The name of the method that initiated the check
         * @param parameterName - The parameter name of the value to check
         */
        Utility.throwIfNullOrUndefined = function (value, context, methodName, parameterName) {
            if (value === null) {
                Utility.throwException(jsCommon.Errors.argumentNull(Utility.getComponentName(context) + methodName + '.' + parameterName));
            }
            else if (typeof (value) === Utility.Undefined) {
                Utility.throwException(jsCommon.Errors.argumentUndefined(Utility.getComponentName(context) + methodName + '.' + parameterName));
            }
        };
        /**
         * Ensures the specified value is not null, undefined or empty. Throws a relevent exception if it is.
         * @param value - The value to check
         * @param context - The context from which the check originated
         * @param methodName - The name of the method that initiated the check
         * @param parameterName - The parameter name of the value to check
         */
        Utility.throwIfNullOrEmpty = function (value, context, methodName, parameterName) {
            Utility.throwIfNullOrUndefined(value, context, methodName, parameterName);
            if (!value.length) {
                Utility.throwException(jsCommon.Errors.argumentOutOfRange(Utility.getComponentName(context) + methodName + '.' + parameterName));
            }
        };
        /**
         * Ensures the specified string is not null, undefined or empty. Throws a relevent exception if it is.
         * @param value - The value to check
         * @param context - The context from which the check originated
         * @param methodName - The name of the method that initiated the check
         * @param parameterName - The parameter name of the value to check
         */
        Utility.throwIfNullOrEmptyString = function (value, context, methodName, parameterName) {
            Utility.throwIfNullOrUndefined(value, context, methodName, parameterName);
            if (value.length < 1) {
                Utility.throwException(jsCommon.Errors.argumentOutOfRange(Utility.getComponentName(context) + methodName + '.' + parameterName));
            }
        };
        /**
         * Ensures the specified value is not null, undefined, whitespace or empty. Throws a relevent exception if it is.
         * @param value - The value to check
         * @param context - The context from which the check originated
         * @param methodName - The name of the method that initiated the check
         * @param parameterName - The parameter name of the value to check
         */
        Utility.throwIfNullEmptyOrWhitespaceString = function (value, context, methodName, parameterName) {
            Utility.throwIfNullOrUndefined(value, context, methodName, parameterName);
            if (StringExtensions.isNullOrUndefinedOrWhiteSpaceString(value)) {
                Utility.throwException(jsCommon.Errors.argumentOutOfRange(Utility.getComponentName(context) + methodName + '.' + parameterName));
            }
        };
        /**
         * Ensures the specified condition is true. Throws relevant exception if it isn't.
         * @param condition - The condition to check
         * @param context - The context from which the check originated
         * @param methodName - The name of the method that initiated the check
         * @param parameterName - The parameter name against which the condition is checked
         */
        Utility.throwIfNotTrue = function (condition, context, methodName, parameterName) {
            if (!condition) {
                Utility.throwException(jsCommon.Errors.argument(parameterName, Utility.getComponentName(context) + methodName + '.' + parameterName));
            }
        };
        /**
         * Checks whether the provided value is a 'string'.
         * @param value - The value to test
         */
        Utility.isString = function (value) {
            return ((typeof value) === 'string');
        };
        /**
         * Checks whether the provided value is a 'boolean'.
         * @param value - The value to test
         */
        Utility.isBoolean = function (value) {
            return ((typeof value) === 'boolean');
        };
        /**
         * Checks whether the provided value is a 'number'.
         * @param value - The value to test
         */
        Utility.isNumber = function (value) {
            return ((typeof value) === 'number');
        };
        /**
         * Checks whether the provided value is a Date instance.
         * @param value - The value to test
         */
        Utility.isDate = function (value) {
            return Utility.isObject(value) && (value instanceof Date);
        };
        /**
         * Checks whether the provided value is an 'object'.
         * @param value - The value to test
         */
        Utility.isObject = function (value) {
            return (value != null) && ((typeof value) === 'object');
        };
        /**
         * Checks whether the provided value is null or undefined.
         * @param value - The value to test
        */
        Utility.isNullOrUndefined = function (value) {
            return (value === null) || (typeof (value) === Utility.Undefined);
        };
        /**
         * Combine a base url and a path
         * @param baseUrl - The base url
         * @param path - The path to add on to the base url
         * @returns The combined url
         */
        Utility.urlCombine = function (baseUrl, path) {
            Utility.throwIfNullOrUndefined(baseUrl, null, "urlCombine", "baseUrl");
            Utility.throwIfNullOrUndefined(path, null, "urlCombine", "path");
            // should any of the components be empty, fail gracefuly - this is important when using the test page
            if (StringExtensions.isNullOrUndefinedOrWhiteSpaceString(path)) {
                return baseUrl;
            }
            if (StringExtensions.isNullOrUndefinedOrWhiteSpaceString(baseUrl)) {
                return path;
            }
            var finalUrl = baseUrl;
            if (finalUrl.charAt(finalUrl.length - 1) === '/') {
                if (path.charAt(0) === '/')
                    path = path.slice(1);
            }
            else {
                if (path.charAt(0) !== '/')
                    path = '/' + path;
            }
            return finalUrl + path;
        };
        Utility.getAbsoluteUri = function (path) {
            Utility.throwIfNullOrUndefined(path, null, "getAbsoluteUri", "path");
            var url = path;
            // Make absolute
            if (url && url.indexOf('http') === -1) {
                url = Utility.urlCombine(clusterUri, url);
            }
            return url;
        };
        Utility.getStaticResourceUri = function (path) {
            Utility.throwIfNullOrUndefined(path, null, "getStaticResourceUri", "path");
            var url = path;
            // Make absolute
            if (url && url.indexOf('http') === -1) {
                url = jsCommon.Utility.urlCombine(Utility.staticContentLocation, url);
            }
            return url;
        };
        Utility.getComponentName = function (context) {
            return !context ? '' : (typeof context).toString() + '.';
        };
        Utility.throwException = function (e) {
            jsCommon.Trace.error(StringExtensions.format("Throwing exception: {0}", JSON.stringify(e)), e.stack != null ? false : true);
            throw e;
        };
        Utility.createClassSelector = function (className) {
            Utility.throwIfNullOrEmptyString(className, null, 'CreateClassSelector', 'className');
            return '.' + className;
        };
        Utility.createIdSelector = function (id) {
            Utility.throwIfNullOrEmptyString(id, null, 'CreateIdSelector', 'id');
            return '#' + id;
        };
        /**
         * Creates a client-side Guid string
         * This code is based on the guid implementation in sp.js
         * @returns A string representation of a Guid
         */
        Utility.generateGuid = function () {
            var result = '';
            for (var i = 0; i < 32; i++) {
                var value = Math.floor(Math.random() * 16);
                switch (i) {
                    case 8:
                    case 12:
                    case 16:
                    case 20:
                        result += '-';
                        break;
                }
                result += value.toString(16);
            }
            return result;
        };
        /**
         * Generates a random 7 character string that is used as a connection group name
         * @returns A random connection group name
         */
        Utility.generateConnectionGroupName = function () {
            var name = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < 7; i++)
                name += possible.charAt(Math.floor(Math.random() * possible.length));
            return name;
        };
        /**
         * Try extract a cookie from <paramref name="cookie"/> identified by key <paramref name="key"/>
         */
        Utility.getCookieValue = function (key) {
            // the cookie is of the format <key1=value1>; <key2=value2>. Split by ';', then by '=' 
            // to search for the key
            var keyValuePairs = document.cookie.split(';');
            for (var i = 0; i < keyValuePairs.length; i++) {
                var keyValue = keyValuePairs[i];
                var split = keyValue.split('=');
                if (split.length > 0 && split[0].trim() === key) {
                    return keyValue.substr(keyValue.indexOf('=') + 1);
                }
            }
            return null;
        };
        /**
         * Extracts the protocol://hostname section of a url
         * @param url - The URL from which to extract the section
         * @returns The protocol://hostname portion of the given URL
         */
        Utility.getDomainForUrl = function (url) {
            var hrefObject = Utility.getHrefObjectFromUrl(url);
            return hrefObject.prop('protocol') + '//' + hrefObject.prop('hostname');
        };
        /**
         * Extracts the hostname and absolute path sections of a url
         * @param url - The URL from which to extract the section
         * @returns The hostname and absolute path portion of the given URL
         */
        Utility.getHostNameForUrl = function (url) {
            var hrefObject = Utility.getHrefObjectFromUrl(url);
            return Utility.urlCombine(hrefObject.prop('hostname'), hrefObject.prop('pathname'));
        };
        /**
        * Return the original url with query string stripped.
        * @param url - The URL from which to extract the section
        * @returns the original url with query string stripped.
        */
        Utility.getUrlWithoutQueryString = function (url) {
            var hrefObject = Utility.getHrefObjectFromUrl(url);
            return hrefObject.prop('protocol') + '//' + Utility.urlCombine(hrefObject.prop('host'), hrefObject.prop('pathname'));
        };
        /**
         * Extracts the protocol section of a url
         * @param url - The URL from which to extract the section
         * @returns The protocol for the current URL
         */
        Utility.getProtocolFromUrl = function (url) {
            return Utility.getHrefObjectFromUrl(url).prop('protocol').replace(':', '');
        };
        /**
         * Returns a formatted href object from a URL
         * @param url - The URL used to generate the object
         * @returns A jQuery object with the url
         */
        Utility.getHrefObjectFromUrl = function (url) {
            var aObject = $('<a>');
            aObject = aObject.prop('href', url);
            return aObject;
        };
        /**
         * Converts a WCF representation of a dictionary to a JavaScript dictionary
         * @param wcfDictionary - The WCF dictionary to convert
         * @returns The native JavaScript representation of this dictionary
         */
        Utility.convertWcfToJsDictionary = function (wcfDictionary) {
            // convert the WCF JSON representation of a dictionary
            // to JS dictionary.
            // WCF representation: [{"Key": Key, "Value": Value}..]
            // JS representation: [Key: Value ..]
            var result = {};
            for (var i = 0; i < wcfDictionary.length; i++) {
                var keyValuePair = wcfDictionary[i];
                result[keyValuePair['Key']] = keyValuePair['Value'];
            }
            return result;
        };
        Utility.getDateFromWcfJsonString = function (jsonDate, fromUtcMilliseconds) {
            if (StringExtensions.isNullOrEmpty(jsonDate)) {
                return null;
            }
            var begIndex = jsonDate.indexOf('(');
            var endIndex = jsonDate.indexOf(')');
            if (begIndex !== -1 && endIndex !== -1) {
                var milliseconds = parseInt(jsonDate.substring(begIndex + 1, endIndex), 10);
                if (fromUtcMilliseconds) {
                    return new Date(milliseconds);
                }
                else {
                    var retValue = new Date(0);
                    retValue.setUTCMilliseconds(milliseconds);
                    return retValue;
                }
            }
            return null;
        };
        /**
         * Get the outer html of the given jquery object
         * @param content - The jquery object
         * @returns The entire html representation of the object
         */
        Utility.getOuterHtml = function (content) {
            return $('<div>').append(content).html();
        };
        /**
         * Comparison Method: Compares two integer numbers
         * @param a - An integer value
         * @param b - An integer value
         * @returns The comparison result
         */
        Utility.compareInt = function (a, b) {
            return a - b;
        };
        /**
          Return the index of the smallest value in a numerical array
          @param a - A numeric array
          @returns - The index of the smallest value in the array
         */
        Utility.getIndexOfMinValue = function (a) {
            var retValue = 0;
            var currentMinValue = a[0];
            for (var i = 0; i < a.length; i++) {
                if (a[i] < currentMinValue) {
                    currentMinValue = a[i];
                    retValue = i;
                }
            }
            return retValue;
        };
        /**
          Tests whether a URL is valid
          @param url - The url to be tested
          @returns - Whether the provided url is valid
        */
        Utility.isValidUrl = function (url) {
            return !StringExtensions.isNullOrEmpty(url) && (StringExtensions.startsWithIgnoreCase(url, 'http://') || StringExtensions.startsWithIgnoreCase(url, 'https://'));
        };
        /**
          Extracts a url from a background image attribute in the format of: url('www.foobar.com/image.png')
          @param url - The value of the background-image attribute
          @returns - The extracted url
        */
        Utility.extractUrlFromCssBackgroundImage = function (input) {
            return input.replace(/"/g, "").replace(/url\(|\)$/ig, "");
        };
        /**
         Downloads a content string as a file
         @param content - Content stream
         @param fileName - File name to use
        */
        Utility.saveAsFile = function (content, fileName) {
            var contentBlob = new Blob([content], { type: HttpConstants.ApplicationOctetStream });
            var url = window['webkitURL'] || URL;
            var urlLink = url.createObjectURL(contentBlob);
            var fileNameLink = fileName || urlLink;
            // IE support, use msSaveOrOpenBlob API
            if (window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(contentBlob, fileNameLink);
                return;
            }
            // WebKit-based browser support requires generating an anchor tag with
            // download attribute set to blob store and triggering a click event to invoke 
            // a download to file action
            var hyperlink = document.createElement('a');
            hyperlink.href = urlLink;
            hyperlink.target = '_blank';
            hyperlink['download'] = fileNameLink;
            document.body.appendChild(hyperlink);
            hyperlink.click();
            document.body.removeChild(hyperlink);
        };
        /**
         * Helper method to get the simple type name from a typed object
         * @param obj - The typed object
         * @returns The simple type name for the object
         */
        Utility.getType = function (obj) {
            Utility.throwIfNullEmptyOrWhitespaceString(obj.__type, this, 'getType', 'obj');
            var parts = obj.__type.split(":");
            if (parts.length !== 2) {
                jsCommon.Errors.argument("obj.__type", "Type String not in expected format [Type]#[Namespace]: " + obj.__type);
            }
            if (parts[1] !== Utility.TypeNamespace) {
                jsCommon.Errors.argument("obj.__type", "Type Namespace not expected: " + parts[1]);
            }
            return parts[0];
        };
        /**
         * check if an element supports a specific event type
         * @param eventName - The name of the event
         * @param element - The element to test for event support
         * @returns Whether the even is supported on the provided element
         */
        Utility.isEventSupported = function (eventName, element) {
            eventName = 'on' + eventName;
            var isSupported = (eventName in element);
            if (!isSupported) {
                // if we can't use setAttribute try a generic element
                if (!element.setAttribute) {
                    element = document.createElement('div');
                }
                if (element.setAttribute && element.removeAttribute) {
                    element.setAttribute(eventName, '');
                    isSupported = typeof element[eventName] === 'function';
                    // if the property was created - remove it
                    if (typeof element[eventName] !== 'undefined') {
                        element[eventName] = null;
                    }
                    element.removeAttribute(eventName);
                }
            }
            element = null;
            return isSupported;
        };
        Utility.toPixel = function (pixelAmount) {
            Utility.throwIfNullOrUndefined(pixelAmount, this, "toPixel", "pixelAmount");
            return pixelAmount.toString() + jsCommon.CssConstants.pixelUnits;
        };
        Utility.getPropertyCount = function (object) {
            Utility.throwIfNullOrUndefined(object, this, "getPropertyCount", "object");
            return Object.getOwnPropertyNames(object).length;
        };
        /**
         * check if an element supports a specific event type
         * @param filePath - file path
         * @returns file extension
         */
        Utility.getFileExtension = function (filePath) {
            if (filePath) {
                var index = filePath.lastIndexOf('.');
                if (index >= 0)
                    return filePath.substr(index + 1);
            }
            return '';
        };
        /**
         *
         * This method indicates whether window.clipboardData is supported.
         * For example, clipboard support for Windows Store apps is currently disabled
         * since window.clipboardData is unsupported (it raises access denied error)
         * since clipboard in Windows Store is being achieved through Windows.ApplicationModel.DataTransfer.Clipboard class
         */
        Utility.canUseClipboard = function () {
            return (typeof MSApp === "undefined");
        };
        Utility.is64BitOperatingSystem = function () {
            return navigator.userAgent.indexOf("WOW64") !== -1 || navigator.userAgent.indexOf("Win64") !== -1;
        };
        Utility.parseNumber = function (value, defaultValue) {
            if (value === null)
                return null;
            if (value === undefined)
                return defaultValue;
            var result = Number(value);
            if (isFinite(result))
                return result;
            if (isNaN(result) && !(typeof value === "number" || value === "NaN"))
                return defaultValue;
            return result;
        };
        Utility.TypeNamespace = 'http://schemas.microsoft.com/sqlbi/2013/01/NLRuntimeService';
        Utility.JsonContentType = 'application/json';
        Utility.JpegContentType = 'image/jpeg';
        Utility.XJavascriptContentType = 'application/x-javascript';
        Utility.JsonDataType = 'json';
        Utility.BlobDataType = 'blob';
        Utility.HttpGetMethod = 'GET';
        Utility.HttpPostMethod = 'POST';
        Utility.HttpPutMethod = 'PUT';
        Utility.HttpDeleteMethod = 'DELETE';
        Utility.HttpContentTypeHeader = 'Content-Type';
        Utility.HttpAcceptHeader = 'Accept';
        Utility.Undefined = 'undefined';
        Utility.staticContentLocation = window.location.protocol + '//' + window.location.host;
        return Utility;
    })();
    jsCommon.Utility = Utility;
    var VersionUtility = (function () {
        function VersionUtility() {
        }
        /**
         * Compares 2 version strings
         * @param versionA - The first version string
         * @param versionB - The second version string
         * @returns A result for the comparison
         */
        VersionUtility.compareVersions = function (versionA, versionB) {
            var a = versionA.split('.').map(parseFloat);
            var b = versionB.split('.').map(parseFloat);
            var versionParts = Math.max(a.length, b.length);
            for (var i = 0; i < versionParts; i++) {
                var partA = a[i] || 0;
                var partB = b[i] || 0;
                if (partA > partB)
                    return 1;
                if (partA < partB)
                    return -1;
            }
            return 0;
        };
        return VersionUtility;
    })();
    jsCommon.VersionUtility = VersionUtility;
    var PerformanceUtil;
    (function (PerformanceUtil) {
        var PerfMarker = (function () {
            function PerfMarker(name) {
                this._name = name;
                this._start = PerfMarker.begin(name);
            }
            PerfMarker.begin = function (name) {
                if (window.performance === undefined || performance.mark === undefined)
                    return;
                if (console.time) {
                    console.time(name);
                }
                name = 'Begin ' + name;
                performance.mark(name);
                return name;
            };
            PerfMarker.prototype.end = function () {
                if (window.performance === undefined || performance.mark === undefined || performance.measure === undefined)
                    return;
                var name = this._name;
                var end = 'End ' + name;
                performance.mark(end);
                performance.measure(name, this._start, end);
                if (console.timeEnd) {
                    console.timeEnd(name);
                }
            };
            return PerfMarker;
        })();
        PerformanceUtil.PerfMarker = PerfMarker;
        function create(name) {
            return new PerfMarker(name);
        }
        PerformanceUtil.create = create;
    })(PerformanceUtil = jsCommon.PerformanceUtil || (jsCommon.PerformanceUtil = {}));
    var GzipUtility;
    (function (GzipUtility) {
        /**
         * Uncompresses after decoding string
         * @param encoded - A gzipped and Base64 encoded string
         * @returns Decoded and uncompressed string
         */
        function uncompress(encoded) {
            if (encoded) {
                try {
                    var decoded = atob(encoded);
                    var uncompressed = pako.inflate(decoded, { to: 'string' });
                    return uncompressed;
                }
                catch (e) {
                    var msg = 'Error while uncompressing TileData: {0}';
                    jsCommon.Trace.error(StringExtensions.format(msg, JSON.stringify(e)), e.stack != null ? false : true);
                }
            }
            return null;
        }
        GzipUtility.uncompress = uncompress;
        /**
         * Compress and then Base64-encode the string
         * @param data - String to be gzipped and Base64 encoded
         * @returns Compressed and Base64-encoded string
         */
        function compress(data) {
            if (data) {
                try {
                    var compressed = pako.gzip(data, { to: 'string' });
                    var encoded = btoa(compressed);
                    return encoded;
                }
                catch (e) {
                    jsCommon.Trace.error(StringExtensions.format('Error while compressing TileData: {0}', JSON.stringify(e)), e.stack != null ? false : true);
                    return null;
                }
            }
            return null;
        }
        GzipUtility.compress = compress;
    })(GzipUtility = jsCommon.GzipUtility || (jsCommon.GzipUtility = {}));
    var DeferUtility;
    (function (DeferUtility) {
        /**
        * Wraps a callback and returns a new function
        * The function can be called many times but the callback
        * will only be executed once on the next frame.
        * Use this to throttle big UI updates and access to DOM
        */
        function deferUntilNextFrame(callback) {
            var _this = this;
            var isWaiting, args, context;
            if (!window.requestAnimationFrame) {
                window.requestAnimationFrame = function (func) { return setTimeout(func, 1000 / 50); };
            }
            return function () {
                if (!isWaiting) {
                    isWaiting = true;
                    args = arguments;
                    context = _this;
                    window.requestAnimationFrame(function () {
                        isWaiting = false;
                        callback.apply(context, args);
                    });
                }
            };
        }
        DeferUtility.deferUntilNextFrame = deferUntilNextFrame;
    })(DeferUtility = jsCommon.DeferUtility || (jsCommon.DeferUtility = {}));
    var EncryptionContext = (function () {
        function EncryptionContext(message, publicKey, entropy, callbackFunction) {
            this.rsaMaxLength = 85; // Max length supported by msrcrypto.js RSA-OAEP algorithm
            this.rsaEncryptedLength = 128;
            this.callback = callbackFunction;
            this.plainTextBytes = this.toUTF8Array(message);
            this.publicKey = publicKey;
            this.entropy = entropy;
            this.segments = Math.ceil(this.plainTextBytes.length / this.rsaMaxLength);
            this.currentSegment = 0;
            this.encryptedBytes = new Uint8Array(this.segments * this.rsaEncryptedLength);
        }
        EncryptionContext.prototype.RSAEncrypt = function () {
            var _this = this;
            var supportedPublicKey = this.toSupportedRSAPublicKey(this.publicKey);
            var publicKeyBytes = this.toSupportedArray(supportedPublicKey);
            msrCrypto.subtle.forceSync = true;
            if (msrCrypto.initPrng) {
                msrCrypto.initPrng(this.entropy);
            }
            var keyOperation = msrCrypto.subtle.importKey("jwk", publicKeyBytes, { name: "RSA-OAEP", hash: { name: "sha-1" } });
            keyOperation.oncomplete = function (e) { return _this.rsaPublicKeyImportComplete(e); };
        };
        EncryptionContext.generateEntropy = function () {
            var entropy = [];
            for (var i = 0; i < 48; i++) {
                entropy.push(Math.floor(Math.random() * 256));
            }
            return entropy;
        };
        EncryptionContext.prototype.rsaPublicKeyImportComplete = function (e) {
            // Results are returned with the event 'e' on the target property.
            // This key handle is used to represent the key in crypto operations
            // it does not contain any key data.  If you want see the key data call KeyExport
            this.publicKeyHandle = e.target.result;
            this.rsaEncryption();
        };
        EncryptionContext.prototype.rsaEncryption = function () {
            var _this = this;
            // Now that we have a public key, we can encrypt our data
            var cryptoOperation = msrCrypto.subtle.encrypt({ name: "RSA-OAEP", hash: { name: "sha-1" } }, this.publicKeyHandle, this.plainTextBytes.subarray(this.currentSegment * this.rsaMaxLength, (this.currentSegment + 1) * this.rsaMaxLength));
            cryptoOperation.oncomplete = function (e) { return _this.rsaEncryptionSegmentComplete(e); };
        };
        EncryptionContext.prototype.rsaEncryptionSegmentComplete = function (e) {
            this.encryptedBytes.set(new Uint8Array(e.target.result), this.currentSegment * this.rsaEncryptedLength);
            this.currentSegment++;
            if (this.currentSegment < this.segments) {
                this.rsaEncryption();
            }
            else {
                this.callback(this.arrayToBase64String(this.encryptedBytes));
            }
        };
        EncryptionContext.prototype.toSupportedRSAPublicKey = function (publicKey) {
            return '{ \
                "kty" : "RSA", \
                "extractable" : true, \
                "n" : "' + publicKey + '", \
                "e" : "AQAB" \
            }';
        };
        EncryptionContext.prototype.arrayToBase64String = function (bytes) {
            var binaryString = '';
            var len = bytes.length;
            for (var i = 0; i < len; i++) {
                binaryString += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binaryString);
        };
        EncryptionContext.prototype.toSupportedArray = function (data) {
            // does this browser support Typed Arrays?
            var typedArraySupport = (typeof Uint8Array !== "undefined");
            // get the data type of the parameter
            var dataType = Object.prototype.toString.call(data);
            dataType = dataType.substring(8, dataType.length - 1);
            switch (dataType) {
                case "Array":
                    return typedArraySupport ? new Uint8Array(data) : data;
                case "ArrayBuffer":
                    return new Uint8Array(data);
                case "Uint8Array":
                    return data;
                case "Uint16Array":
                case "Uint32Array":
                    return new Uint8Array(data);
                case "String":
                    var dataLength = data.length;
                    var newArray = typedArraySupport ? new Uint8Array(dataLength) : new Array(dataLength);
                    for (var i = 0; i < dataLength; i++) {
                        newArray[i] = data.charCodeAt(i);
                    }
                    return newArray;
                default:
                    throw new Error("toSupportedArray : unsupported data type " + dataType);
            }
        };
        EncryptionContext.prototype.toUTF8Array = function (str) {
            var utf8 = [];
            for (var i = 0; i < str.length; i++) {
                var charcode = str.charCodeAt(i);
                if (charcode < 0x80)
                    utf8.push(charcode);
                else if (charcode < 0x800) {
                    utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
                }
                else if (charcode < 0xd800 || charcode >= 0xe000) {
                    utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
                }
                else {
                    i++;
                    // UTF-16 encodes 0x10000-0x10FFFF by
                    // subtracting 0x10000 and splitting the
                    // 20 bits of 0x0-0xFFFFF into two halves
                    charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
                    utf8.push(0xf0 | (charcode >> 18), 0x80 | ((charcode >> 12) & 0x3f), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
                }
            }
            var utf8Uint8Array = new Uint8Array(utf8.length);
            utf8Uint8Array.set(utf8, 0);
            return utf8Uint8Array;
        };
        return EncryptionContext;
    })();
    jsCommon.EncryptionContext = EncryptionContext;
})(jsCommon || (jsCommon = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var jsCommon;
(function (jsCommon) {
    /** Extensions for Enumerations. */
    var EnumExtensions;
    (function (EnumExtensions) {
        /** Gets a value indicating whether the value has the bit flags set. */
        function hasFlag(value, flag) {
            debug.assert(!!flag, 'flag must be specified and nonzero.');
            return (value & flag) === flag;
        }
        EnumExtensions.hasFlag = hasFlag;
        // According to the TypeScript Handbook, this is safe to do.
        function toString(enumType, value) {
            return enumType[value];
        }
        EnumExtensions.toString = toString;
    })(EnumExtensions = jsCommon.EnumExtensions || (jsCommon.EnumExtensions = {}));
    /** Extensions to String class */
    var StringExtensions;
    (function (StringExtensions) {
        /** Checks if a string ends with a sub-string */
        function endsWith(str, suffix) {
            debug.assertValue(str, 'str');
            debug.assertValue(suffix, 'suffix');
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        }
        StringExtensions.endsWith = endsWith;
    })(StringExtensions = jsCommon.StringExtensions || (jsCommon.StringExtensions = {}));
    var LogicExtensions;
    (function (LogicExtensions) {
        function XOR(a, b) {
            return (a || b) && !(a && b);
        }
        LogicExtensions.XOR = XOR;
    })(LogicExtensions = jsCommon.LogicExtensions || (jsCommon.LogicExtensions = {}));
    var JsonComparer;
    (function (JsonComparer) {
        /** Performs JSON-style comparison of two objects. */
        function equals(x, y) {
            if (x === y)
                return true;
            return JSON.stringify(x) === JSON.stringify(y);
        }
        JsonComparer.equals = equals;
    })(JsonComparer = jsCommon.JsonComparer || (jsCommon.JsonComparer = {}));
})(jsCommon || (jsCommon = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var jsCommon;
(function (jsCommon) {
    var XmlUtility = (function () {
        function XmlUtility() {
        }
        XmlUtility.removeInvalidCharacters = function (input) {
            debug.assertValue(input, 'input');
            var startIndex = 0;
            var stringBuilder;
            for (var i = 0, len = input.length; i < len; i++) {
                if (!XmlUtility.isValidXmlCharacter(input, i)) {
                    if (!stringBuilder)
                        stringBuilder = new jsCommon.StringBuilder();
                    if (startIndex !== i)
                        stringBuilder.append(input.substring(startIndex, i));
                    startIndex = i + 1;
                }
            }
            if (!stringBuilder)
                return input;
            if (startIndex <= input.length - 1)
                stringBuilder.append(input.substring(startIndex, input.length));
            return stringBuilder.toString();
        };
        /**
         * Checks whether character at the provided index is a valid xml character as per
         * XML 1.0 specification: http://www.w3.org/TR/xml/#charsets
         */
        XmlUtility.isValidXmlCharacter = function (input, index) {
            debug.assertValue(input, 'input');
            debug.assertValue(index, 'index');
            debug.assert(index < input.length, 'index < input.length');
            var charCode = input.charCodeAt(index);
            return charCode === XmlUtility.TabCharCode || charCode === XmlUtility.NewLineCharCode || charCode === XmlUtility.CarriageReturnCharCode || (charCode >= 0x20 && charCode <= 0xD7FF) || (charCode >= 0xE000 && charCode <= 0xFFFD) || (charCode >= 0x10000 && charCode <= 0x10FFFF);
        };
        XmlUtility.TabCharCode = 0x9;
        XmlUtility.NewLineCharCode = 0xA;
        XmlUtility.CarriageReturnCharCode = 0xD;
        return XmlUtility;
    })();
    jsCommon.XmlUtility = XmlUtility;
})(jsCommon || (jsCommon = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var jsCommon;
(function (jsCommon) {
    var TraceItem = (function () {
        function TraceItem(text, type, sessionId, requestId) {
            this.text = text;
            this.type = type;
            this.sessionId = sessionId;
            this.requestId = requestId;
            this.timeStamp = new Date();
        }
        TraceItem.prototype.toString = function () {
            var sb = new jsCommon.StringBuilder();
            sb.append(jsCommon.StringExtensions.format('{0} ({1}): {2}', TraceItem.traceTypeStrings[this.type], this.timeStamp.toUTCString(), this.text));
            if (this.requestId)
                sb.append('\n(Request id: ' + this.requestId + ')');
            return sb.toString();
        };
        TraceItem.traceTypeStrings = [
            'INFORMATION',
            'VERBOSE',
            'WARNING',
            'ERROR',
            'EXPECTEDERROR',
            'UNEXPECTEDERROR',
            'FATAL',
        ];
        return TraceItem;
    })();
    jsCommon.TraceItem = TraceItem;
})(jsCommon || (jsCommon = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var jsCommon;
(function (jsCommon) {
    var ConsoleTracer = (function () {
        function ConsoleTracer() {
        }
        ConsoleTracer.prototype.logTrace = function (trace) {
            if (DEBUG) {
                switch (trace.type) {
                    case 0 /* Information */:
                        console.info(trace.toString());
                        break;
                    case 5 /* UnexpectedError */:
                    case 3 /* Error */:
                    case 6 /* Fatal */:
                        console.error(trace.toString());
                        break;
                    case 4 /* ExpectedError */:
                    case 2 /* Warning */:
                        console.warn(trace.toString());
                        break;
                    case 1 /* Verbose */:
                        console.log(trace.toString());
                        break;
                    default:
                        console.log(trace.toString());
                        break;
                }
            }
        };
        return ConsoleTracer;
    })();
    jsCommon.ConsoleTracer = ConsoleTracer;
    var Trace;
    (function (Trace) {
        var traceMaxCount = 1000;
        var traces = new Array(traceMaxCount);
        var lastTraceIndex = -1;
        var defaultListener = new ConsoleTracer();
        var listeners = new Array(defaultListener);
        /** Trace a warning. Please ensure that no PII is being logged.*/
        function warning(text, requestId) {
            debug.assertValue(text, 'text');
            logTraceInternal(new jsCommon.TraceItem(text, 2 /* Warning */, requestId));
        }
        Trace.warning = warning;
        /** Trace an error. Please ensure that no PII is being logged.*/
        function error(text, includeStackTrace, requestId) {
            debug.assertValue(text, 'text');
            if (includeStackTrace)
                text = jsCommon.StringExtensions.format("{0}.\nStack:\n{1}", text, jsCommon.getStackTrace());
            logTraceInternal(new jsCommon.TraceItem(text, 3 /* Error */, requestId));
        }
        Trace.error = error;
        /** Trace an information. Please ensure that no PII is being logged.*/
        function verbose(text, requestId) {
            debug.assertValue(text, 'text');
            logTraceInternal(new jsCommon.TraceItem(text, 1 /* Verbose */, requestId));
        }
        Trace.verbose = verbose;
        function addListener(listener) {
            debug.assertValue(listener, 'listener');
            listeners.push(listener);
        }
        Trace.addListener = addListener;
        function removeListener(listener) {
            debug.assertValue(listener, 'listener');
            var index = listeners.indexOf(listener);
            if (index >= 0)
                listeners.splice(index, 1);
        }
        Trace.removeListener = removeListener;
        function resetListeners() {
            listeners = new Array(defaultListener);
        }
        Trace.resetListeners = resetListeners;
        function reset() {
            lastTraceIndex = -1;
        }
        Trace.reset = reset;
        function getTraces() {
            if (lastTraceIndex < 0)
                return;
            var result = new Array(lastTraceIndex + 1);
            for (var i = 0; i <= lastTraceIndex; i++)
                result[i] = traces[i];
            return result;
        }
        Trace.getTraces = getTraces;
        /** used for unit-test only */
        function disableDefaultListener() {
            removeListener(defaultListener);
        }
        Trace.disableDefaultListener = disableDefaultListener;
        function enableDefaultListener() {
            addListener(defaultListener);
        }
        Trace.enableDefaultListener = enableDefaultListener;
        function logTraceInternal(trace) {
            if ((lastTraceIndex + 1) >= traceMaxCount)
                reset();
            traces[++lastTraceIndex] = trace;
            for (var i = 0, len = listeners.length; i < len; i++)
                listeners[i].logTrace(trace);
        }
    })(Trace = jsCommon.Trace || (jsCommon.Trace = {}));
})(jsCommon || (jsCommon = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var jsCommon;
(function (jsCommon) {
    /** The types of possible traces within the system, this aligns to the traces available in Cloud Platform */
    (function (TraceType) {
        TraceType[TraceType["Information"] = 0] = "Information";
        TraceType[TraceType["Verbose"] = 1] = "Verbose";
        TraceType[TraceType["Warning"] = 2] = "Warning";
        TraceType[TraceType["Error"] = 3] = "Error";
        TraceType[TraceType["ExpectedError"] = 4] = "ExpectedError";
        TraceType[TraceType["UnexpectedError"] = 5] = "UnexpectedError";
        TraceType[TraceType["Fatal"] = 6] = "Fatal";
    })(jsCommon.TraceType || (jsCommon.TraceType = {}));
    var TraceType = jsCommon.TraceType;
})(jsCommon || (jsCommon = {}));
//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbi;
(function (powerbi) {
    (function (HttpStatusCode) {
        HttpStatusCode[HttpStatusCode["AngularCancelOrTimeout"] = 0] = "AngularCancelOrTimeout";
        HttpStatusCode[HttpStatusCode["OK"] = 200] = "OK";
        HttpStatusCode[HttpStatusCode["BadRequest"] = 400] = "BadRequest";
        HttpStatusCode[HttpStatusCode["Unauthorized"] = 401] = "Unauthorized";
        HttpStatusCode[HttpStatusCode["Forbidden"] = 403] = "Forbidden";
        HttpStatusCode[HttpStatusCode["NotFound"] = 404] = "NotFound";
        HttpStatusCode[HttpStatusCode["RequestTimeout"] = 408] = "RequestTimeout";
        HttpStatusCode[HttpStatusCode["RequestEntityTooLarge"] = 413] = "RequestEntityTooLarge";
    })(powerbi.HttpStatusCode || (powerbi.HttpStatusCode = {}));
    var HttpStatusCode = powerbi.HttpStatusCode;
})(powerbi || (powerbi = {}));
//----------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
//----------------------------------------------------------------
/// <reference path="requires.ts" />
var jsCommon;
(function (jsCommon) {
    // JavaScript files
    var JQueryUI = 'https://ajax.aspnetcdn.com/ajax/jquery.ui/1.10.3/jquery-ui.min.js';
    var JQueryUII18n = 'https://ajax.aspnetcdn.com/ajax/jquery.ui/1.10.3/i18n/jquery-ui-i18n.min.js';
    var Globalize = 'https://ajax.aspnetcdn.com/ajax/globalize/0.1.1/globalize.js';
    var MSMapcontrol = 'https://ecn.dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=7.0&s=1&onscriptload=globalMapControlLoaded';
    // CSS Stylesheets
    var JQueryUICss = 'https://ajax.aspnetcdn.com/ajax/jquery.ui/1.10.3/themes/base/jquery-ui.css';
    // Map loading logic
    var MSMapcontrolLoaded = false;
    var WaitForMSMapLoad = null;
    var PowerViewPackage = {
        javaScriptFiles: [
            JQueryUI,
            JQueryUII18n,
            Globalize,
            powerbi.build + '/externals/globalize.cultures.js',
            powerbi.build + '/externals/pv/webclient.js'
        ],
        cssFiles: [
            JQueryUICss,
            powerbi.build + '/externals/pv/Styles/_all.css'
        ],
        javaScriptFilesWithCallback: [
            { javascriptFile: MSMapcontrol, onLoadCallback: waitForMapControlLoaded }
        ]
    };
    function ensurePowerView(action) {
        if (action === void 0) { action = function () {
        }; }
        jsCommon.requires(PowerViewPackage, action);
    }
    jsCommon.ensurePowerView = ensurePowerView;
    var MapPackage = {
        javaScriptFilesWithCallback: [
            { javascriptFile: MSMapcontrol, onLoadCallback: waitForMapControlLoaded }
        ]
    };
    function ensureMap(action) {
        jsCommon.requires(MapPackage, action);
    }
    jsCommon.ensureMap = ensureMap;
    function mapControlLoaded() {
        MSMapcontrolLoaded = true;
        if (WaitForMSMapLoad) {
            WaitForMSMapLoad.resolve();
            WaitForMSMapLoad = undefined;
        }
    }
    jsCommon.mapControlLoaded = mapControlLoaded;
    function waitForMapControlLoaded() {
        var task;
        if (!MSMapcontrolLoaded) {
            task = WaitForMSMapLoad = $.Deferred();
        }
        else {
            task = $.Deferred();
            task.resolve();
        }
        return task.promise();
    }
    jsCommon.waitForMapControlLoaded = waitForMapControlLoaded;
})(jsCommon || (jsCommon = {}));
/* tslint:disable:no-unused-variable */
var globalMapControlLoaded = function () {
    // Map requires a function in the global namespace to callback once loaded
    jsCommon.mapControlLoaded();
};
//# sourceMappingURL=Utility.js.map