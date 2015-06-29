//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module jsCommon {

    export interface ModalDialogCallback {
        (dialogContent: JQuery): void;
    }

    export interface ModalDialogActionCallback {
        (sender: JQuery, dialogContent: JQuery, data: any): void;
    }

    export interface DialogOptionsPair {
        label: string;
        resultValue: any;
    }

    /** The modal dialog client side control */
    export class ModalDialog {
        // Constants
        private static AnimationSpeedMs = 250;

        private static modalDialogCssClass: string = 'infonav-modalDialog';
        private static dialogTitleCssClass: string = 'infonav-dialogTitle';
        private static dialogCloseIconCssClass: string = 'infonav-dialogCloseIcon';
        private static dialogContentCssClass: string = 'infonav-dialogContent';
        private static dialogActionsCssClass: string = 'infonav-dialogActions';

        private static modalDialogClassSelector: string = '.' + ModalDialog.modalDialogCssClass;
        private static dialogTitleClassSelector: string = '.' + ModalDialog.dialogTitleCssClass;
        private static dialogCloseIconClassSelector: string = '.' + ModalDialog.dialogCloseIconCssClass;
        private static dialogContentClassSelector: string = '.' + ModalDialog.dialogContentCssClass;
        private static dialogActionsClassSelector: string = '.' + ModalDialog.dialogActionsCssClass;
        private static modalDialogContainerHostClassName: string = 'infonav-modalContainerHost';
        private static modalDialogContainerHostClassSelector: string = '.' + ModalDialog.modalDialogContainerHostClassName;

        private static ModalDialogHtml =
        '<div class="infonav-modalContainer' + (location.search.indexOf('renderAsModalDialog') !== -1 ? ' small' : '') + '">' +
        '<div class="' + ModalDialog.modalDialogCssClass + '" tabindex="-1">' +
        '<div class="infonav-dialogLayout">' +
        '<div class="' + ModalDialog.dialogTitleCssClass + '"></div>' +
        '<div class="' + ModalDialog.dialogCloseIconCssClass + '"></div>' +
        '<div class="' + ModalDialog.dialogContentCssClass + '"></div>' +
        '<div class="' + ModalDialog.dialogActionsCssClass + '"></div>' +
        '</div>' +
        '</div>' +
        '</div>';

        private static NewButtonSelector = '<input type="button"></input>';

        // Fields
        private _modalContainer: JQuery = null;
        private _modalDialogElement: JQuery = null;
        private _dialogTitle: JQuery = null;
        private _dialogCloseButton: JQuery = null;
        private _dialogContent: JQuery = null;
        private _dialogActions: JQuery = null;
        private _messageQueue = new Array();
        private _isReady = false;
        private _messageCurrentlyShown = false;

        /**
         * ModalDialog is currently used for showing initialization error messages and hence 
         * we need to be careful about what code do we put here. For example IE8 does not support 
         * generic defineProperty and thus ModalDialog or parent classes cannot contain any properties.
         */
        constructor(dialogHost?: JQuery) {
            $(document).ready(
                () => {
                    this._modalContainer = $(ModalDialog.ModalDialogHtml);
                    this._modalDialogElement = this._modalContainer.find(ModalDialog.modalDialogClassSelector);
                    this._dialogTitle = this._modalContainer.find(ModalDialog.dialogTitleClassSelector);
                    this._dialogCloseButton = this._modalContainer.find(ModalDialog.dialogCloseIconClassSelector);
                    this._dialogContent = this._modalContainer.find(ModalDialog.dialogContentClassSelector);
                    this._dialogActions = this._modalContainer.find(ModalDialog.dialogActionsClassSelector);

                    // Do not use bind here as we need this control to work in IE8 and IE8 does not support bind
                    var that = this;
                    this._dialogCloseButton.on(DOMConstants.mouseClickEventName,() => that.hideDialog());

                    if (!dialogHost) {
                        var containerHost = $(ModalDialog.modalDialogContainerHostClassSelector);
                        // Remove modal container host if it already exists
                        if (containerHost && containerHost.length > 0)
                            containerHost.remove();
                        containerHost = InJs.DomFactory.div().addClass(ModalDialog.modalDialogContainerHostClassName);
                        dialogHost = $(DOMConstants.DocumentBody).append(containerHost);
                        dialogHost = containerHost;
                    }

                    dialogHost.append(this._modalContainer);
                    this._isReady = true;

                    if (this._messageQueue.length > 0) {
                        this.showDialogInternal(this._messageQueue.shift());
                    }
                });
        }

        /**
         * Displays a dismissable message to the user
         * The only action available to the user is "Close"
         * @param messageTitle - The title of the dialog
         * @param messageText - The message to display to the user
         */
        public showMessage(messageTitle: string, messageText: string) {
            Utility.throwIfNullOrEmptyString(messageTitle, null, 'ShowMessage', 'messageTitle');
            Utility.throwIfNullOrEmptyString(messageText, null, 'ShowMessage', 'messageText');

            var actions = [];

            actions[0] = this.createButton(InJs.Strings.dialogCloseActionLabel,(sender, dialogHost) => {
                this.hideDialog();
            });

            this.pushMessage(messageTitle, messageText, null, actions, true, null);
        }

        /**
         * Displays a customizable prompt to the user
         * @param promptTitle - The tile of the prompt dialog
         * @param promptText - The message to display to the user
         * @param promptActions - An array of ModalDialogAction objects describing the possible actions in the prompt
         * @param isDismissable - Whether the dialog should include a close button
         */
        public showPrompt(promptTitle: string, promptText: string, promptActions: InJs.ModalDialogAction[], isDismissable?: boolean) {
            Utility.throwIfNullOrEmptyString(promptTitle, null, 'ShowPrompt', 'promptTitle');
            Utility.throwIfNullOrEmptyString(promptText, null, 'ShowPrompt', 'promptText');
            Utility.throwIfNullOrUndefined(promptActions, null, 'ShowPrompt', 'promptActions');

            var actionButtons = new Array<JQuery>();

            for (var i = 0; i < promptActions.length; i++) {
                var thisAction = promptActions[i];
                var cssClass = thisAction.cssClass;

                if (i === 0) {
                    cssClass = cssClass + ' primary';
                }

                actionButtons[i] = this.createButton(thisAction.labelText, thisAction.actionCallback, thisAction.data, cssClass, thisAction.disabled);
            }

            this.pushMessage(promptTitle, promptText, null, actionButtons, isDismissable, null);
        }

        /**
         * Displays an error message to the user
         * @param errorText - The message to display to the user
         * @param errorType - The type of error be displayed to the user
         * @param request - The (optional) request that triggered the error for showing additional technical details
         */
        public showError(errorText: string, errorType: TraceType, additionalErrorInfo?: ErrorInfoKeyValuePair[], afterDismissCallback?: (JQuery) => void, dialogOptions?: DialogOptionsPair[]) {
            this.showCustomError(InJs.Strings.errorDialogTitle, errorText, errorType, errorType !== TraceType.Fatal, additionalErrorInfo, afterDismissCallback, dialogOptions);
        }

        /**
         * Displays an error message to the user
         * @param errorTitle - The title to display to the user
         * @param errorText - The message to display to the user
         * @param errorType - The type of error be displayed to the user
         * @param request - The (optional) request that triggered the error for showing additional technical details
         */
        public showCustomError(errorTitle: string, errorText: string, errorType: TraceType, isDismissable: boolean, additionalErrorInfo?: ErrorInfoKeyValuePair[], afterDismissCallback?: (JQuery) => void, dialogOptions?: DialogOptionsPair[]) {
            Utility.throwIfNullOrEmptyString(errorTitle, null, 'ShowError', 'errorTitle');
            Utility.throwIfNullOrEmptyString(errorText, null, 'ShowError', 'errorText');

            var actions = new Array<JQuery>();
            if (dialogOptions) {
                dialogOptions.forEach((element, index, array) => {
                    actions.push(this.createButton(element.label,(sender, dialogHost) => {
                        this.hideDialog();
                        if ($.isFunction(afterDismissCallback)) {
                            afterDismissCallback(element.resultValue);
                        }
                    }));
                });
            } else if (errorType !== TraceType.Fatal) {
                actions[0] = this.createButton(InJs.Strings.dialogCloseActionLabel,(sender, dialogHost) => {
                    this.hideDialog();
                    if ($.isFunction(afterDismissCallback)) {
                        afterDismissCallback(0);
                    }
                });
            } else {
                actions[0] = this.createButton(InJs.Strings.dialogRefreshPageActionLabel,(sender, dialogHost) => {
                    window.location.reload();
                }, null, 'primary');
            }

            var dialogContent = $('<div/>').text(errorText);

            this.addAdditionalErrorInfo(dialogContent, additionalErrorInfo);

            this.pushMessage(errorTitle || InJs.Strings.errorDialogTitle, null, dialogContent, actions, isDismissable, null);
        }

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
        public showCustomDialog(titleText: string, dialogContent: JQuery, dialogActions: InJs.ModalDialogAction[], onDialogDisplayed: ModalDialogCallback, isDismissable?: boolean, focusOnFirstButton?: boolean) {
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
        }

        /** Hides the current contents of the modal dialog */
        public hideDialog() {
            this._modalContainer.fadeTo(ModalDialog.AnimationSpeedMs, 0,() => {
                this._modalContainer.css(CssConstants.displayProperty, CssConstants.noneValue);
                this._messageCurrentlyShown = false;
                if (this._messageQueue.length) {
                    var nextMessage = this._messageQueue.shift();
                    this.showDialogInternal(nextMessage);
                }
            });
        }

        private updatePosition(animate: boolean) {
            var modalDialogHeight = this._modalDialogElement.height();

            if (animate) {
                this._modalDialogElement.animate({ 'margin-top': (-1 * (modalDialogHeight / 2)).toString() + CssConstants.pixelUnits }, ModalDialog.AnimationSpeedMs);
            }
            else {
                this._modalDialogElement.css(CssConstants.marginTopProperty,(-1 * (modalDialogHeight / 2)).toString() + CssConstants.pixelUnits);
            }
        }

        private addAdditionalErrorInfo(dialogContent: JQuery, additionalErrorInfoKeyValuePairs?: ErrorInfoKeyValuePair[]) {
            if (additionalErrorInfoKeyValuePairs) {
                var additionalErrorInfo = $('<p />');
                for (var i = 0; i < additionalErrorInfoKeyValuePairs.length; i++) {
                    additionalErrorInfo.append(InJs.InfoNavUtility.constructErrorField(additionalErrorInfoKeyValuePairs[i].errorInfoKey, additionalErrorInfoKeyValuePairs[i].errorInfoValue));
                }

                var additionalErrorInfoContainer = InJs.InfoNavUtility.constructShowDetailsContainer(additionalErrorInfo);
                dialogContent.append($('<br />'));
                dialogContent.append(additionalErrorInfoContainer);

                dialogContent.find('.showAdditionalDetailsLink').on(DOMConstants.mouseClickEventName, e => {
                    this.updatePosition(true);
                });
            }
        }

        private pushMessage(titleText: string, messageText: string, dialogContent: JQuery, dialogButtons: JQuery[], isDismissable: boolean, onDialogDisplayed: Function, focusOnFirstButton?: boolean) {
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
        }

        private showDialogInternal(message: QueueableMessage, focusOnFirstButton?: boolean) {
            this._messageCurrentlyShown = true;

            this._dialogTitle.empty();
            this._dialogContent.empty();
            this._dialogActions.empty();

            this._dialogTitle.text(message.titleText);

            // if there was not a string message provided, render using DialogContent
            if (StringExtensions.isNullOrEmpty(message.messageText)) {
                this._dialogContent.append(message.dialogContent);
            }
            else {
                this._dialogContent.text(message.messageText);
            }

            if (message.isDismissable) {
                this._dialogCloseButton.css(CssConstants.displayProperty, CssConstants.blockValue);
            } else {
                this._dialogCloseButton.css(CssConstants.displayProperty, CssConstants.noneValue);
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

            var fadingElem = (this._modalContainer.css(CssConstants.displayProperty) === CssConstants.noneValue) ? this._modalContainer : this._modalDialogElement;

            fadingElem.fadeTo(0, 0);

            this.updatePosition(false);

            fadingElem.fadeTo(ModalDialog.AnimationSpeedMs, 1,() => {
                // Steal the focus away from whatever else is happening
                this._modalDialogElement.focus();
                var buttons = this._dialogActions.find("input");

                if (buttons.length > 0) {
                    buttons[0].focus();
                }

                if (message.onDialogDisplayed) {
                    message.onDialogDisplayed(this._dialogContent);
                }

                if (focusOnFirstButton) {
                    this._dialogContent.parent().find('.infonav-dialogActions input[type=button]:first').focus();
                }
            });
        }

        private createButton(labelText: string, action: ModalDialogActionCallback, data?: any, cssClass?: string, disabled?: boolean) {
            var button = $(ModalDialog.NewButtonSelector);
            button.attr('value', labelText);
            button.on(DOMConstants.mouseClickEventName,(e: JQueryEventObject) => {
                action(button, this._dialogContent, data);
            });

            if (cssClass) {
                button.addClass(cssClass);
            }

            if (disabled) {
                button.prop("disabled", true);
            }

            return button;
        }
    }

    class QueueableMessage {
        titleText: string = null;
        messageText: string = null;
        dialogContent: JQuery = null;
        dialogButtons: JQuery[] = null;
        onDialogDisplayed: Function = null;
        isDismissable: boolean = true;
    }
}
