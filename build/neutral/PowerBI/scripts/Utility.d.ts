/// <reference path="../../typedefs/pako/pako.d.ts" />
/// <reference path="../../typedefs/msrcrypto/msrcrypto.d.ts" />
/// <reference path="../../typedefs/jQuery/jQuery.d.ts" />
/// <reference path="../../typedefs/moment/moment.d.ts" />
/// <reference path="../../typedefs/d3/d3.d.ts" />
declare var DEBUG: boolean;
declare module powerbi {
    import IStringResourceProvider = jsCommon.IStringResourceProvider;
    interface ILocalizableError {
        getDetails(resourceProvider: IStringResourceProvider): ErrorDetails;
    }
    interface IClientError extends ILocalizableError {
        code: string;
        debugInfo?: string;
        ignorable?: boolean;
    }
    interface IClientWarning extends ILocalizableError {
        columnNameFromIndex: (index: number) => string;
    }
    class UnknownClientError implements IClientError {
        code: string;
        ignorable: boolean;
        getDetails(resourceProvider: IStringResourceProvider): ErrorDetails;
    }
    class IgnorableClientError implements IClientError {
        code: string;
        ignorable: boolean;
        getDetails(resourceProvider: IStringResourceProvider): ErrorDetails;
    }
}
declare module jsCommon {
    interface ArrayIdItems<T> extends Array<T> {
        withId(id: number): T;
    }
    interface ArrayNamedItems<T> extends Array<T> {
        withName(name: string): T;
    }
    module ArrayExtensions {
        /** Returns items that exist in target and other. */
        function intersect<T>(target: T[], other: T[]): T[];
        /** return elements exists in target but not exists in other. */
        function diff<T>(target: T[], other: T[]): T[];
        /** return an array with only the distinct items in the source. */
        function distinct<T>(source: T[]): T[];
        /** Pushes content of source onto target, for parts of course that do not already exist in target. */
        function union<T>(target: T[], source: T[]): void;
        /** Pushes value onto target, if value does not already exist in target. */
        function unionSingle<T>(target: T[], value: T): void;
        /** Returns an array with a range of items from source, including the startIndex & endIndex. */
        function range<T>(source: T[], startIndex: number, endIndex: number): T[];
        /** Returns an array that includes items from source, up to the specified count. */
        function take<T>(source: T[], count: number): T[];
        /** Returns a value indicating whether the arrays have the same values in the same sequence. */
        function sequenceEqual<T>(left: T[], right: T[], comparison: (x: T, y: T) => boolean): boolean;
        /** Returns null if the specified array is empty.  Otherwise returns the specified array. */
        function emptyToNull<T>(array: T[]): T[];
        function indexOf<T>(array: T[], predicate: (T) => boolean): number;
        function createWithId<T>(): ArrayIdItems<T>;
        function extendWithId<T>(array: {
            id: number;
        }[]): ArrayIdItems<T>;
        /** Finds and returns the first item with a matching ID. */
        function findWithId<T>(array: T[], id: number): T;
        function createWithName<T>(): ArrayNamedItems<T>;
        function extendWithName<T>(array: {
            name: string;
        }[]): ArrayNamedItems<T>;
        function findItemWithName<T>(array: T[], name: string): T;
        function indexWithName<T>(array: T[], name: string): number;
        /** Deletes all items from the array.*/
        function clear(array: any[]): void;
        function isUndefinedOrEmpty(array: any[]): boolean;
    }
}
declare module InJs {
    module DomFactory {
        function div(): JQuery;
        function span(): JQuery;
        function checkbox(): JQuery;
        function ul(): JQuery;
        function li(): JQuery;
        function button(): JQuery;
        function select(): JQuery;
        function textBox(): JQuery;
        function img(): JQuery;
        function iframe(): JQuery;
    }
}
declare module jsCommon {
    interface ModalDialogCallback {
        (dialogContent: JQuery): void;
    }
    interface ModalDialogActionCallback {
        (sender: JQuery, dialogContent: JQuery, data: any): void;
    }
    interface DialogOptionsPair {
        label: string;
        resultValue: any;
        cssClass?: string;
        disabled?: boolean;
    }
    /** The modal dialog client side control */
    class ModalDialog {
        private static AnimationSpeedMs;
        private static modalDialogCssClass;
        private static dialogTitleCssClass;
        private static dialogCloseIconCssClass;
        private static dialogContentCssClass;
        private static dialogActionsCssClass;
        private static modalDialogClassSelector;
        private static dialogTitleClassSelector;
        private static dialogCloseIconClassSelector;
        private static dialogContentClassSelector;
        private static dialogActionsClassSelector;
        private static modalDialogContainerHostClassName;
        private static modalDialogContainerHostClassSelector;
        private static ModalDialogHtml;
        private static NewButtonSelector;
        private _modalContainer;
        private _modalDialogElement;
        private _dialogTitle;
        private _dialogCloseButton;
        private _dialogContent;
        private _dialogActions;
        private _messageQueue;
        private _isReady;
        private _messageCurrentlyShown;
        private _modalDialogCustomClass;
        private _modalContainerCustomClass;
        /**
         * ModalDialog is currently used for showing initialization error messages and hence
         * we need to be careful about what code do we put here. For example IE8 does not support
         * generic defineProperty and thus ModalDialog or parent classes cannot contain any properties.
         */
        constructor(dialogHost?: JQuery);
        /**
         * Displays a dismissable message to the user
         * The only action available to the user is "Close"
         * @param messageTitle - The title of the dialog
         * @param messageText - The message to display to the user
         */
        showMessage(messageTitle: string, messageText: string): void;
        /**
         * Displays a customizable prompt to the user
         * @param promptTitle - The tile of the prompt dialog
         * @param promptText - The message to display to the user
         * @param promptActions - An array of ModalDialogAction objects describing the possible actions in the prompt
         * @param isDismissable - Whether the dialog should include a close button
         */
        showPrompt(promptTitle: string, promptText: string, promptActions: InJs.ModalDialogAction[], isDismissable?: boolean): void;
        /**
         * Displays an error message to the user
         * @param errorText - The message to display to the user
         * @param errorType - The type of error be displayed to the user
         * @param request - The (optional) request that triggered the error for showing additional technical details
         */
        showError(errorText: string, errorType: TraceType, additionalErrorInfo?: ErrorInfoKeyValuePair[], afterDismissCallback?: (JQuery) => void, dialogOptions?: DialogOptionsPair[]): void;
        /**
         * Displays an error message to the user
         * @param errorTitle - The title to display to the user
         * @param errorText - The message to display to the user
         * @param errorType - The type of error be displayed to the user
         * @param request - The (optional) request that triggered the error for showing additional technical details
         */
        showCustomError(errorTitle: string, errorText: string, errorType: TraceType, isDismissable: boolean, additionalErrorInfo?: ErrorInfoKeyValuePair[], afterDismissCallback?: (JQuery) => void, dialogOptions?: DialogOptionsPair[]): void;
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
        showCustomDialog(titleText: string, dialogContent: JQuery, dialogActions: InJs.ModalDialogAction[], onDialogDisplayed: ModalDialogCallback, isDismissable?: boolean, focusOnFirstButton?: boolean, dialogCssClass?: string, containerCssClass?: string): JQuery;
        /** Hides the current contents of the modal dialog */
        hideDialog(): void;
        private updatePosition(animate);
        private addAdditionalErrorInfo(dialogContent, additionalErrorInfoKeyValuePairs?);
        private pushMessage(titleText, messageText, dialogContent, dialogButtons, isDismissable, onDialogDisplayed, focusOnFirstButton?, dialogCssClass?, containerCssClass?);
        private showDialogInternal(message, focusOnFirstButton?);
        private createButton(labelText, action, data?, cssClass?, disabled?);
    }
}
declare module InJs {
    /** This class represents an action, bound to a button, inside a modal dialog */
    class ModalDialogAction {
        labelText: string;
        actionCallback: jsCommon.ModalDialogActionCallback;
        data: any;
        cssClass: string;
        disabled: boolean;
        constructor(labelText: string, actionCallback: jsCommon.ModalDialogActionCallback, data?: any, cssClass?: string, disabled?: boolean);
    }
}
declare module jsCommon {
    module color {
        function rotate(rgbString: string, rotateFactor: number): string;
        function parseRgb(rgbString: string): RgbColor;
        function rgbToHexString(rgbColor: RgbColor): string;
        function darken(color: RgbColor, diff: number): RgbColor;
        function rgbWithAlphaString(color: RgbColor, a: number): string;
        function rgbString(color: RgbColor): string;
        function rgbaString(r: number, g: number, b: number, a: number): string;
        function rgbStringToHexString(rgb: string): string;
        function rgbaStringToHexString(rgba: string): string;
        interface RgbColor {
            R: number;
            G: number;
            B: number;
        }
    }
}
declare module jsCommon {
    /** CSS constants */
    module CssConstants {
        var styleAttribute: string;
        var pixelUnits: string;
        var heightProperty: string;
        var widthProperty: string;
        var topProperty: string;
        var bottomProperty: string;
        var leftProperty: string;
        var rightProperty: string;
        var marginTopProperty: string;
        var marginLeftProperty: string;
        var displayProperty: string;
        var backgroundProperty: string;
        var backgroundColorProperty: string;
        var backgroundRepeatProperty: string;
        var backgroundSizeProperty: string;
        var backgroundImageProperty: string;
        var textShadowProperty: string;
        var borderTopWidthProperty: string;
        var borderBottomWidthProperty: string;
        var borderLeftWidthProperty: string;
        var borderRightWidthProperty: string;
        var fontWeightProperty: string;
        var colorProperty: string;
        var opacityProperty: string;
        var paddingLeftProperty: string;
        var paddingRightProperty: string;
        var positionProperty: string;
        var maxWidthProperty: string;
        var minWidthProperty: string;
        var overflowProperty: string;
        var cursorProperty: string;
        var visibilityProperty: string;
        var absoluteValue: string;
        var zeroPixelValue: string;
        var autoValue: string;
        var hiddenValue: string;
        var noneValue: string;
        var blockValue: string;
        var inlineBlockValue: string;
        var transparentValue: string;
        var boldValue: string;
        var visibleValue: string;
        var tableRowValue: string;
        var coverValue: string;
        var pointerValue: string;
    }
    interface ExtendedCSSProperties extends MSStyleCSSProperties {
        webkitTransform: string;
    }
}
declare module jsCommon {
    /** DOM constants */
    module DOMConstants {
        /** Integer codes corresponding to individual keys on the keyboard */
        var escKeyCode: number;
        var enterKeyCode: number;
        var tabKeyCode: number;
        var upArrowKeyCode: number;
        var downArrowKeyCode: number;
        var leftArrowKeyCode: number;
        var rightArrowKeyCode: number;
        var homeKeyCode: number;
        var endKeyCode: number;
        var backSpaceKeyCode: number;
        var deleteKeyCode: number;
        var spaceKeyCode: number;
        var shiftKeyCode: number;
        var ctrlKeyCode: number;
        var altKeyCode: number;
        var aKeyCode: number;
        var cKeyCode: number;
        var vKeyCode: number;
        var xKeyCode: number;
        var yKeyCode: number;
        var zKeyCode: number;
        /** DOM Elements */
        var DocumentBody: string;
        var Anchor: string;
        var EditableTextElements: string;
        /** DOM Attributes and values */
        var disabledAttributeOrValue: string;
        var readonlyAttributeOrValue: string;
        var styleAttribute: string;
        var hrefAttribute: string;
        var targetAttribute: string;
        var blankValue: string;
        var classAttribute: string;
        var titleAttribute: string;
        var srcAttribute: string;
        /** DOM event names */
        var contextmenuEventName: string;
        var blurEventName: string;
        var keyUpEventName: string;
        var inputEventName: string;
        var changeEventName: string;
        var cutEventName: string;
        var keyDownEventName: string;
        var mouseMoveEventName: string;
        var mouseDownEventName: string;
        var mouseEnterEventName: string;
        var mouseLeaveEventName: string;
        var mouseOverEventName: string;
        var mouseOutEventName: string;
        var mouseClickEventName: string;
        var pasteEventName: string;
        var scrollEventName: string;
        var dropEventName: string;
        var focusInEventName: string;
        var focusOutEventName: string;
        var selectEventName: string;
        var messageEventName: string;
        var loadEventName: string;
        var beforeUnload: string;
        /** Common DOM event combination names */
        var inputAndSelectEventNames: string;
    }
}
/**
 * Defines a Debug object.  Calls to any functions in this object removed by the minifier.
 * The functions within this class are not minified away, so we use the preprocessor-style
 * comments to have the minifier remove those as well.
 */
declare module debug {
    var assertFailFunction: {
        (message: string): void;
    };
    /** Asserts that the condition is true, fails otherwise. */
    function assert(condition: boolean, message: string): void;
    /** Asserts that the value is neither null nor undefined, fails otherwise. */
    function assertValue<T>(value: T, message: string): void;
    /** Makes no assertion on the given value.  This is documentation/placeholder that a value is possibly null or undefined (unlike assertValue).  */
    function assertAnyValue<T>(value: T, message: string): void;
    function assertFail(message: string): void;
}
declare module powerbi {
    /** Instantiates a RejectablePromise that wraps the given Deferred object. */
    function RejectablePromise2<T, E>(deferred: IDeferred2<T, E>): RejectablePromise2<T, E>;
    function RejectablePromise<T>(deferred: IDeferred<T>): RejectablePromise<T>;
}
declare module jsCommon {
    /** Extensions to Date class */
    module DateExtensions {
        /** Formats the date, omitting the time portion, if midnight. */
        function formatAbsolute(date: Date): string;
        /** Formats the date, preferably showing the elapsed time if possible, falling back on an absolute date. */
        function formatPretty(date: Date): string;
        /** Gets a value indicating whether the specified date has a midnight time portion. */
        function isMidnight(date: Date): boolean;
        /** returns the number of elapsed seconds from a given date to now. */
        function elapsedToNow(date: Date, units: string): number;
        /** Returns whether moment is present */
        function isMomentPresent(): boolean;
        /**
         * Parses an ISO 8601 formatted date string and creates a Date object.
         * If timezone information is not present in the date the local timezone will be assumed.
         */
        function parseIsoDate(isoDate: string): Date;
        function parseUtcDate(isoDate: string): Date;
        function fromNow(date: Date): string;
        function serializeDate(date: Date): string;
        function deserializeDate(data: string): Date;
        function tryDeserializeDate(data: string): Date;
    }
}
declare module powerbi {
    /** Class Double contains a set of constants and precision based utility methods for dealing with doubles and their decimal garbage in the javascript */
    module Double {
        var MIN_VALUE: number;
        var MAX_VALUE: number;
        var MIN_EXP: number;
        var MAX_EXP: number;
        var EPSILON: number;
        var DEFAULT_PRECISION: number;
        var DEFAULT_PRECISION_IN_DECIMAL_DIGITS: number;
        var LOG_E_10: number;
        var POSITIVE_POWERS: number[];
        var NEGATIVE_POWERS: number[];
        /** Returns powers of 10. Unlike the Math.pow this function produces no decimal garbage.
          * @param exp - exponent
          */
        function pow10(exp: number): number;
        /** Returns the 10 base logarithm of the number. Unlike Math.log function this produces integer results with no decimal garbage.
          * @param value - positive value or zero
          */
        function log10(val: number): number;
        /** Returns a power of 10 representing precision of the number based on the number of meaningfull decimal digits.
          * For example the precision of 56,263.3767 with the 6 meaningfull decimal digit is 0.1
          * @param x - value
          * @param decimalDigits - how many decimal digits are meaningfull
          */
        function getPrecision(x: number, decimalDigits?: number): number;
        /** Checks if a delta between 2 numbers is less than provided precision.
          * @param x - one value
          * @param y - another value
          * @param precision - precision value
          */
        function equalWithPrecision(x: number, y: number, precision?: number): boolean;
        /** Checks if a first value is less than another taking into account the loose precision based equality.
          * @param x - one value
          * @param y - another value
          * @param precision - precision value
          */
        function lessWithPrecision(x: number, y: number, precision?: number): boolean;
        /** Checks if a first value is less or equal than another taking into account the loose precision based equality.
          * @param x - one value
          * @param y - another value
          * @param precision - precision value
          */
        function lessOrEqualWithPrecision(x: number, y: number, precision?: number): boolean;
        /** Checks if a first value is greater than another taking into account the loose precision based equality.
          * @param x - one value
          * @param y - another value
          * @param precision - precision value
          */
        function greaterWithPrecision(x: number, y: number, precision?: number): boolean;
        /** Checks if a first value is greater or equal to another taking into account the loose precision based equality.
          * @param x - one value
          * @param y - another value
          * @param precision - precision value
          */
        function greaterOrEqualWithPrecision(x: number, y: number, precision?: number): boolean;
        /** Floors the number unless it's withing the precision distance from the higher int.
          * @param x - one value
          * @param precision - precision value
          */
        function floorWithPrecision(x: number, precision?: number): number;
        /** Ciels the number unless it's withing the precision distance from the lower int.
          * @param x - one value
          * @param precision - precision value
          */
        function ceilWithPrecision(x: number, precision?: number): number;
        /** Floors the number to the provided precision. For example 234,578 floored to 1,000 precision is 234,000.
          * @param x - one value
          * @param precision - precision value
          */
        function floorToPrecision(x: number, precision?: number): number;
        /** Ciels the number to the provided precision. For example 234,578 floored to 1,000 precision is 235,000.
          * @param x - one value
          * @param precision - precision value
          */
        function ceilToPrecision(x: number, precision?: number): number;
        /** Rounds the number to the provided precision. For example 234,578 floored to 1,000 precision is 235,000.
          * @param x - one value
          * @param precision - precision value
          */
        function roundToPrecision(x: number, precision?: number): number;
        /** Returns the value making sure that it's restricted to the provided range.
          * @param x - one value
          * @param min - range min boundary
          * @param max - range max boundary
          */
        function ensureInRange(x: number, min: number, max: number): number;
        /** Rounds the value - this method is actually faster than Math.round - used in the graphics utils.
          * @param x - value to round
          */
        function round(x: number): number;
        /** Projects the value from the source range into the target range.
          * @param value - value to project
          * @param fromMin - minimum of the source range
          * @param fromMax - maximum of the source range
          * @param toMin - minimum of the target range
          * @param toMax - maximum of the target range
          */
        function project(value: number, fromMin: number, fromSize: number, toMin: number, toSize: number): number;
        /** Removes decimal noise
          * @param value - value to be processed
          */
        function removeDecimalNoise(value: number): number;
        /** Checks whether the number is integer
          * @param value - value to be checked
          */
        function isInteger(value: number): boolean;
    }
}
declare module powerbi {
    interface DragPayload {
    }
}
declare module jsCommon {
    interface IError extends Error {
        stack?: string;
        argument?: string;
    }
    module Errors {
        function infoNavAppAlreadyPresent(): IError;
        function invalidOperation(message: string): IError;
        function argument(argumentName: string, message: string): IError;
        function argumentNull(argumentName: string): IError;
        function argumentUndefined(argumentName: string): IError;
        function argumentOutOfRange(argumentName: string): IError;
        function pureVirtualMethodException(className: string, methodName: string): IError;
        function notImplementedException(message: string): IError;
    }
    /**
    * getStackTrace - Captures the stack trace, if available.
    * It optionally takes the number of frames to remove from the stack trace.
    * By default, it removes the last frame to consider the calling type's
    * constructor and the temporary error used to capture the stack trace (below).
    * More levels can be requested as needed e..g. when an error is created
    * from a helper method. <Min requirement: IE10, Chrome, Firefox, Opera>
    */
    function getStackTrace(leadingFramesToRemove?: number): string;
}
declare module jsCommon {
    module Formatting {
        /** Translate .NET format into something supported by jQuery.Globalize
         */
        function findDateFormat(value: Date, format: string, cultureName: string): {
            value: Date;
            format: string;
        };
        /** Translates unsupported .NET custom format expressions to the custom expressions supported by JQuery.Globalize
         */
        function fixDateTimeFormat(format: string): string;
    }
}
declare module jsCommon {
    interface IStringResourceProvider {
        get(id: string): string;
    }
}
declare module jsCommon {
    /** Represents a promise that may be rejected by its consumer. */
    interface IRejectablePromise extends JQueryPromise<void> {
        reject(...args: any[]): void;
    }
    module JQueryConstants {
        var VisibleSelector: string;
    }
}
declare module jsCommon {
    /** Represents a lazily instantiated value. */
    class Lazy<T> {
        private _value;
        private _factoryMethod;
        constructor(factoryMethod: () => T);
        getValue(): T;
    }
}
declare module jsCommon {
    /** Represents a path of sequential objects. */
    class Path<T> {
        private _segments;
        constructor(segments: T[]);
        getLeafSegment(): T;
        /** Returns true if the other Path has a subset of segments of this Path, appearing the same order. */
        isExtensionOf(other: Path<T>): boolean;
        /** Returns a Path with has the appended segment. */
        extend(segment: T): Path<T>;
    }
}
declare module powerbi {
    /** An interface to promise/deferred, which abstracts away the underlying mechanism (e.g., Angular, jQuery, etc.). */
    interface IPromiseFactory {
        /** Creates a Deferred object which represents a task which will finish in the future. */
        defer<T>(): IDeferred<T>;
        /** Creates a Deferred object which represents a task which will finish in the future. */
        defer<TSuccess, TError>(): IDeferred2<TSuccess, TError>;
        /**
         * Creates a promise that is resolved as rejected with the specified reason. This api should be used to forward rejection in a chain of promises. If you are dealing with the last promise in a promise chain, you don't need to worry about it.
         * When comparing deferreds/promises to the familiar behavior of try/catch/throw, think of reject as the throw keyword in JavaScript. This also means that if you "catch" an error via a promise error callback and you want to forward the error to the promise derived from the current promise, you have to "rethrow" the error by returning a rejection constructed via reject.
         *
         * @param reason Constant, message, exception or an object representing the rejection reason.
         */
        reject<TError>(reason?: TError): IPromise2<any, TError>;
        /**
         * Creates a promise that is resolved with the specified value. This api should be used to forward rejection in a chain of promises. If you are dealing with the last promise in a promise chain, you don't need to worry about it.
         *
         * @param value Object representing the promise result.
         */
        resolve<TSuccess>(value?: TSuccess): IPromise2<TSuccess, any>;
    }
    /** Represents an operation, to be completed (resolve/rejected) in the future. */
    interface IPromise<T> extends IPromise2<T, T> {
    }
    /** Represents an operation, to be completed (resolve/rejected) in the future.  Success and failure types can be set independently. */
    interface IPromise2<TSuccess, TError> {
        /**
         * Regardless of when the promise was or will be resolved or rejected, then calls one of the success or error callbacks asynchronously as soon as the result is available. The callbacks are called with a single argument: the result or rejection reason. Additionally, the notify callback may be called zero or more times to provide a progress indication, before the promise is resolved or rejected.
         * This method returns a new promise which is resolved or rejected via the return value of the successCallback, errorCallback.
         */
        then<TSuccessResult, TErrorResult>(successCallback: (promiseValue: TSuccess) => IPromise2<TSuccessResult, TErrorResult>, errorCallback?: (reason: TError) => TErrorResult): IPromise2<TSuccessResult, TErrorResult>;
        /**
         * Regardless of when the promise was or will be resolved or rejected, then calls one of the success or error callbacks asynchronously as soon as the result is available. The callbacks are called with a single argument: the result or rejection reason. Additionally, the notify callback may be called zero or more times to provide a progress indication, before the promise is resolved or rejected.
         * This method returns a new promise which is resolved or rejected via the return value of the successCallback, errorCallback.
         */
        then<TSuccessResult, TErrorResult>(successCallback: (promiseValue: TSuccess) => TSuccessResult, errorCallback?: (reason: TError) => TErrorResult): IPromise2<TSuccessResult, TErrorResult>;
        /** Shorthand for promise.then(null, errorCallback) */
        catch<TErrorResult>(onRejected: (reason: any) => IPromise2<TSuccess, TErrorResult>): IPromise2<TSuccess, TErrorResult>;
        /** Shorthand for promise.then(null, errorCallback) */
        catch<TErrorResult>(onRejected: (reason: any) => TErrorResult): IPromise2<TSuccess, TErrorResult>;
        /**
         * Allows you to observe either the fulfillment or rejection of a promise, but to do so without modifying the final value. This is useful to release resources or do some clean-up that needs to be done whether the promise was rejected or resolved. See the full specification for more information.
         * Because finally is a reserved word in JavaScript and reserved keywords are not supported as property names by ES3, you'll need to invoke the method like promise['finally'](callback) to make your code IE8 and Android 2.x compatible.
         */
        finally<T, U>(finallyCallback: () => any): IPromise2<T, U>;
    }
    interface IDeferred<T> extends IDeferred2<T, T> {
    }
    interface IDeferred2<TSuccess, TError> {
        resolve(value: TSuccess): void;
        reject(reason?: TError): void;
        promise: IPromise2<TSuccess, TError>;
    }
    interface RejectablePromise2<T, E> extends IPromise2<T, E> {
        reject(reason?: E): void;
        resolved(): boolean;
        rejected(): boolean;
        pending(): boolean;
    }
    interface RejectablePromise<T> extends RejectablePromise2<T, T> {
    }
    interface IResultCallback<T> {
        (result: T, done: boolean): void;
    }
}
declare module powerbi {
    module Prototype {
        /** Returns a new object with the provided obj as its prototype. */
        function inherit<T>(obj: T, extension?: (inherited: T) => void): T;
        /**
         * Uses the provided callback function to selectively replace contents in the provided array, and returns
         * a new array with those values overriden.
         * Returns undefined if no overrides are necessary.
         */
        function overrideArray<T, TArray>(prototype: TArray, override: (T) => T): TArray;
    }
}
declare module jsCommon {
    /**
     *  Utility class to manupilate the search query string in a Url.
     *  Note: search query string has to begin with '?'
     */
    class QueryStringUtil {
        static OriginClientActivityIdParameterName: string;
        static OriginRootActivityIdParameterName: string;
        static OriginActivityIdParameterName: string;
        /** Remove a given query from the query */
        static clearQueryString(queryField: string): string;
        /**
         * Add or update existing query field to new value
         * Note: queryField and queryValue do not need to be encoded
         */
        static addOrUpdateQueryString(queryField: string, queryValue: string): string;
        /**
         * Returns the value of a URL parameter
         * @param key - The key of the URL parameter
         * @returns The (decoded) value of the URL parameter
         */
        static getQueryStringValue(key: string): string;
        /**
         * Parse the search query string into key/value pairs
         * Note: both key and value are decoded.
         */
        static parseQueryString(queryString?: string): {
            [key: string]: string;
        };
        /**
         * Reconstruct the search string based on the key/value pair of individual query.
         * Note: both query field and query value will be encoded in the returned value.
         */
        static rebuildQueryString(queries: {
            [key: string]: string;
        }): string;
    }
}
interface ScriptErrorInfo {
    message: string;
    sourceUrl: string;
    lineNumber: number;
    columnNumber: number;
    stack: string;
}
interface ErrorInfoKeyValuePair {
    errorInfoKey: string;
    errorInfoValue: string;
}
interface ErrorDetails {
    message: string;
    additionalErrorInfo: ErrorInfoKeyValuePair[];
}
declare module InJs {
    /** Holder for UI strings until Localization is implemented */
    module Strings {
        /** Date time format which will be localized. */
        var dateTimeFormat: string;
        /** Title for error displayed when an error occurs on the server during Interpret */
        var serverErrorTitleText: string;
        /** Detailed message for error displayed when an error occurs on the server during Interpret */
        var serverErrorDetailsText: string;
        /** Detailed message for error displayed when a timeout occurs during Interpret */
        var serverTimeoutDetailsText: string;
        /** Detailed message for error displayed when invalid semantic query exception is raised */
        var serverReloadDetailsText: string;
        /** Template for the Error Code displayed on a server error (when a Power BI Q&A error is present). */
        var infoNavErrorCodeTemplate: string;
        /** Template for error message including an activity id. */
        var infoNavErrorWithActivityIdTemplate: string;
        /** The display title for the error field containing an error code */
        var errorCodeText: string;
        /** The display title for the error field containing an activity id */
        var errorActivityIdText: string;
        /** The display title for the error field containing an request id */
        var errorRequestIdText: string;
        /** The display title for the error field containing a line number */
        var errorLineNumberText: string;
        /** The display title for the error field containing a column number */
        var errorColumnNumberText: string;
        /** The display title for the error field containing a stack trace */
        var errorStackTraceText: string;
        /** The display title for the error field containing a source file */
        var errorSourceFileText: string;
        /** The display title for the error field containing a timestamp */
        var errorTimestampText: string;
        /** The call stack for an error. */
        var errorCallStackText: string;
        /** Title displayed when no results are found for a query */
        var emptyResultTitleText: string;
        /** Description displayed when no results are found for a query */
        var emptyResultDescriptionText: string;
        /** Link text displayed to show additional error details */
        var showDetailsText: string;
        /** Label for showing more visualization types */
        var showMoreVisualizationsLabel: string;
        /** Label for showing less visualization types */
        var showFewerVisualizationsLabel: string;
        /** Label for stacked bar chart visualization type. */
        var stackedBarChartVisualizationsLabel: string;
        /** Label for clustered bar chart visualization type. */
        var clusteredBarChartVisualizationsLabel: string;
        /** Label for 100% percent bar chart visualization type. */
        var hundredPercentBarChartVisualizationsLabel: string;
        /** Label for column chart visualization type. */
        var stackedColumnChartVisualizationsLabel: string;
        /** Label for clustered column chart visualization type. */
        var clusteredColumnChartVisualizationsLabel: string;
        /** Label for 100% percent column chart visualization type. */
        var hundredPercentColumnChartVisualizationsLabel: string;
        /** Label for scatter chart visualization type. */
        var scatterChartVisualizationsLabel: string;
        /** Label for line chart visualization type. */
        var lineChartVisualizationsLabel: string;
        /** Label for line chart visualization type. */
        var pieChartVisualizationsLabel: string;
        /** Label for map visualization type. */
        var mapVisualizationsLabel: string;
        /** Label for matrix visualization type. */
        var matrixVisualizationsLabel: string;
        /** Label for table visualization type. */
        var tableVisualizationsLabel: string;
        /** Label for card visualization type. */
        var cardVisualizationsLabel: string;
        /** Label for the settings link within our SharePoint app */
        var sharePointAppSettingsLinkLabel: string;
        /** Label for the add samples link within our SharePoint app */
        var sharePointAppAddSamplesLinkLabel: string;
        /** Title for the settings pane within our SharePoint app */
        var sharePointAppSettingsPaneTitle: string;
        /** Label for the button that closes the Settings pane inside our SharePoint app */
        var sharePointAppCloseSettingsPaneButtonLabel: string;
        /** The error message displayed when a user attempts to add a workbook using an invalid url */
        var sharePointSettingsInvalidModelUrlLabel: string;
        /** The information message displayed to the user while a workbook is being loaded */
        var sharePointSettingsRetrievingModelLabel: string;
        /** The message displayed to the user to publish the a workbook*/
        var sharePointSettingsModelNeedsPublishingLabel: string;
        /** The error message displayed to the user when there was a problem retrieving the specified workbook */
        var sharePointSettingsModelRetrievalFailedLabel: string;
        /** The error message displayed to the user when there was a problem removing the specified workbook */
        var sharePointSettingsModelRemovalFailedLabel: string;
        /** The error message displayed to the user when an already existing workbook has been specified */
        var sharePointSettingsDuplicateModelSpecifiedLabel: string;
        /** The title for the Models section of the Settings page */
        var sharePointSettingsModelsSectionTitleLabel: string;
        /** The message displayed to the user while the list of workbooks is retrieved in the settings pane */
        var sharePointSettingsModelsLoadingLabel: string;
        /** The title for the dialog used to add new workbooks inside the SharePoint settings pane */
        var sharePointSettingsAddModelDialogTitle: string;
        /** The label for the button used to add a new workbook inside the SharePoint settings pane */
        var sharePointSettingsAddModelBtnLabel: string;
        /** The description text for the add workbook dialog */
        var sharePointSettingsAddModelDialogText: string;
        /** The label for the button used to add a new workbook inside the SharePoint settings pane */
        var sharePointSettingsAddModelDialogAddActionLabel: string;
        /** The label for the button used to remove an individual workbook inside the SharePoint settings pane */
        var sharePointSettingsRemoveModelBtnLabel: string;
        /** The title text for the confirmation dialog used to remove workbooks inside the SharePoint settings pane */
        var sharePointSettingsRemoveModelDialogTitle: string;
        /** The text for the dialog used to remove workbooks inside the SharePoint settings pane */
        var sharePointSettingsRemoveModelDialogText: string;
        /** The label for the column containing workbook names inside the SharePoint settings pane */
        var sharePointSettingsModelNameColumnLabel: string;
        /** The label for the column containing workbook URLs inside the SharePoint settings pane */
        var sharePointSettingsModelUrlColumnLabel: string;
        /** The label for the column containing workbook status descriptions inside the SharePoint settings pane */
        var sharePointSettingsModelStatusColumnLabel: string;
        /** The message displayed to the user when the Models control is unable to initialize */
        var sharePointSettingsModelsLoadFailedLabel: string;
        /** The message displayed to the user whent the BI Center app is not installed */
        var sharePointSettingsBICenterAppNotInstalled: string;
        /** The message displayed to the user when the BI Center app is in error state */
        var sharePointSettingsBICenterAppErrorInstallation: string;
        /** The first paragraph of the description text for the Models section of the SharePoint settings page */
        var sharePointSettingsModelsSectionFirstParagraghText: string;
        /** The second paragraph of the description text for the Models section of the SharePoint settings page */
        var sharePointSettingsModelsSectionSecondParagraghText: string;
        /** The message displayed when there is an error in adding a model */
        var sharePointSettingsAddModelErrorText: string;
        /** The following represent the possible status values for a Power BI Q&A workbook within the Settings Page */
        var sharePointSettingsModelStatusNoneLabel: string;
        var sharePointSettingsModelStatusValidatingLabel: string;
        var sharePointSettingsModelStatusPublishingLabel: string;
        var sharePointSettingsModelStatusDeletePendingLabel: string;
        var sharePointSettingsModelStatusPublishSuccessfulLabel: string;
        /** The following represent the possible error code status for a Power BI Q&A workbook when publishing */
        var sharePointSettingsModelPublishErrorNone: string;
        var sharePointSettingsModelPublishMissingError: string;
        var sharePointSettingsModelPublishAboveLimitError: string;
        var sharePointSettingsModelPublishXmlaError: string;
        var sharePointSettingsModelNotPublishedError: string;
        var sharePointSettingsModelPublishCheckoutError: string;
        var sharePointSettingsModelPublishUnknownError: string;
        /** Add workbook error: URL is not a SharePoint URL */
        var addModelNonSharePointUrlError: string;
        /** Add workbook error: URL is in sharepoint but we can’t resolve the document IDs (doesn’t exist) */
        var addModelSharePointDocumentNotFoundError: string;
        /** Add workbook error: URL is not a workbook */
        var addModelSharePointInvalidUrlError: string;
        /** Add workbook error: URL is not in this site */
        var addModelSharePointUrlNotInCurrentSiteError: string;
        /** Add workbook error: Initial PUT to add the workbook fails */
        var addModelOperationFailedError: string;
        /** Add workbook error: Add workbook is disallowed */
        var addModelDisallowedError: string;
        /** The text for the link to be appended to SharePoint add workbook errors */
        var addModelErrorHelpLinkText: string;
        /** The text for the error indicating that the app could not load the workbooks list from the server */
        var sharePointAppLoadModelsErrorText: string;
        /** The title text for the message indicating that no workbooks have been configured for Power BI Q&A */
        var sharePointAppNoModelsConfiguredTitle: string;
        /** The message text for the message indicating that no workbooks have been configured for Power BI Q&A */
        var sharePointAppNoModelsConfiguredMessage: string;
        /** The title text for the message indicating that no workbooks have been configured for Power BI Q&A */
        var sharePointAppNoModelsConfiguredUserTitle: string;
        /** The message text for the message indicating that no workbooks have been configured for Power BI Q&A */
        var sharePointAppNoModelsConfiguredUserMessage: string;
        /** The label for the button shown on the no models configured dialog */
        var sharePointAppNoModelsActionLabel: string;
        /** The message text for the message indicating that no workbooks have been configured for Power BI Q&A */
        var sharePointSettingsAccessDeniedMessage: string;
        /** The label for the button used to cancel an action inside a dialog */
        var dialogCancelActionLabel: string;
        /** The label for the button used to close a dialog */
        var dialogCloseActionLabel: string;
        /** The label for the dialog button used to send */
        var dialogSendActionLabel: string;
        /** The label for the dialog button used to refresh the page in case of a fatal error */
        var dialogRefreshPageActionLabel: string;
        /** The label for the dialog button used to go back to Power BI Portal */
        var dialogGoBackActionLabel: string;
        /** The title for the error dialogs within the app */
        var errorDialogTitle: string;
        /** The text for the dialog shown upon encountering a fatal error */
        var fatalErrorDialogText: string;
        /** The text for the dialog shown upon encountering an unsupported url error */
        var unsupportedUrlMessageText: string;
        /** The title of the warning shown when a workbook is missing a linguistic schema */
        var linguisticSchemaWarningTitle: string;
        /** The template for a single workbook linguistic schema warning */
        var linguisticSchemaSingleWorkbookWarningTemplate: string;
        /** The template for a single workbook linguistic schema warning */
        var linguisticSchemaMultipleWorkbookWarningTemplate: string;
        /** The link for showing more info about the linguistic schema warning */
        var linguisticSchemaWarningMoreInfoLink: string;
        /** The label for the link allowing the user to open the current workbook in a new browser tab */
        var refinementPaneOpenWorkbookLabel: string;
        /** The format for the last modified date displayed in the refinement pane */
        var refinementPaneLastModifiedDateFormat: string;
        /** The title of the window notifying the user that they are running on an unsupported browser */
        var unsupportedBrowserMessageTitle: string;
        /** The contents of the window notifying the user that they are running on an unsupported browser */
        var unsupportedBrowserMessageText: string;
        /** The message in the suggestion dropdown allowing the user to specify the meaning of an unrecognized term */
        var modelingClarifyTermCommand: string;
        /** The message in the suggestion dropdown allowing the user to change how the system understands a recognized term */
        var modelingAddSynonymTermCommand: string;
        /** The message displayed to the user when they have selected a term that has no associated phrasing templates */
        var modelingTermHasNoTemplates: string;
        /** The display string for the modeling template allowing the user to declare a global synonym for a selection */
        var modelingSynonymTemplateDisplayText: string;
        /** The error message shown when the user is navigating away with pending add models */
        var pendingAddModelOperationsText: string;
        /** Text displayed beside the show collage button. */
        var showCollageText: string;
        /** Text displayed when silverlight is not available. */
        var silverlightInstallRequiredText: string;
        /** Notification title displayed when a request has timed out due to workbooks not being loaded. */
        var workbooksLoadingTimeoutTitle: string;
        /** Notification text displayed when a request has timed out . */
        var workbooksLoadingTimeoutText: string;
        /** Text displayed when a request has timed out. */
        var interpretRetryMaxCountExceededMessageText: string;
        /** The title text for the message indicating that sample workbooks are not configured Power BI Q&A */
        var sharePointAppNoSamplesTitle: string;
        /** The message text for the message indicating that sample workbooks are not configured Power BI Q&A */
        var sharePointAppNoSamplesMessage: string;
        /** The text branding to be shown at the top of application page */
        var powerBIChromeBrandingText: string;
        /** The text shown when the user doesn't have valid SharePoint Context token while requesting the App Page or call GetAppMetaData for interpret */
        var notAuthenticatedErrorMessage: string;
        /** The text for the error when there are any problems with accessing the service, either an expired access token or invalid short-lived PowerBI token*/
        var tokenInvalidOrExpiredErrorText: string;
        /** The title text for the dialog prompt that is raised when the token has expired */
        var connectionExpiredTitleText: string;
        /** The title text for the help viewer control */
        var helpViewerControlTitleText: string;
        /** The title text for the feedback section inside the help viewer control */
        var helpViewerFeedbackBannerTitle: string;
        /** The text content for the feedback section inside the help viewer control */
        var helpViewerFeedbackBannerText: string;
        /** The caption text for the help viewer control letting the user know that there is no help content available for the current model */
        var helpViewerHelpUnavailableCaptionText: string;
        /** The caption text for the help viewer control letting the user know that a help page is being loaded */
        var helpViewerHelpLoadingCaptionText: string;
        /** The text of the link allowing the user to return to the Power BI site */
        var backToBISiteLinkText: string;
        /** The text of the link allowing the user to return to display the featured questions set */
        var showFeaturedQuestionsLinkText: string;
        /** The text of the link allowing the user to copy a link to the current result to their clipboard */
        var copyResultLinkText: string;
        /** The text of the link allowing the user to send an email with the link to the current result URL */
        var shareResultLinkText: string;
        /** The subject line for the share result email */
        var shareResultEmailSubjectText: string;
        /** The body for the share result email */
        var shareResultEmailBodyTemplateText: string;
        /** The notification text for when the user copies a result URL to their clipboard */
        var resultLinkCopiedNotificationText: string;
        /** Collage item editor: the tile of the editor dialog when editing a new item */
        var CollageItemEditorAddItemTitle: string;
        /** Collage item editor: the tile of the editor dialog when editing an existing item */
        var CollageItemEditorEditItemTitle: string;
        /** Collage item editor: The tile of the form region used to input an utterance */
        var CollageItemEditorUtteranceFormRegionTitle: string;
        /** Collage item editor: Placeholder on text input field for user utterance */
        var CollageItemEditorUtteranceInputPlaceholder: string;
        /** Collage item editor: Caption on text input field for user utterance */
        var CollageItemEditorUtteranceInputCaption: string;
        /** Collage item editor: Caption on text input field for user utterance when the dialog is busy finding an answer */
        var CollageItemEditorUtteranceInputSearchingCaption: string;
        /** Collage item editor: Caption on text input field for user utterance when the dialog is busy finding an answer */
        var CollageItemEditorUtteranceInputNoResultsCaption: string;
        /** Collage item editor: Caption on text input field for user utterance when the dialog has found an answer */
        var CollageItemEditorUtteranceInputResultFoundCaption: string;
        /** Collage item editor: Label for checkbox determining whether the user provided utterance should be featured on the Power BI site */
        var CollageItemEditorFeatureOnPowerBICheckboxCaption: string;
        /** Collage item editor: The tile of the form region in which the user can pick the size of the tile for the featured question */
        var CollageItemEditorTileSizeFormRegionTitle: string;
        /** Collage item editor: The caption for the radio button allowing the user to select a small tile size */
        var CollageItemEditorTileSizeSmallCaption: string;
        /** Collage item editor: The caption for the radio button allowing the user to select a large tile size */
        var CollageItemEditorTileSizeLargeCaption: string;
        /** Collage item editor: The title of the form region in which the user can pick from one of the predetermined tile colors */
        var CollageItemEditorTileColorRegionTitle: string;
        /** Collage item editor: The title of the form region in which the user can pick from one of the predetermined tile backgrounds */
        var CollageItemEditorTileIconRegionTitle: string;
        /** Collage item editor: The title of the form region in which the user can provide a custom image url for the tile background */
        var CollageItemCustomImageRegionTitle: string;
        /** Collage item editor: The text placeholder for the input field allowing the user to specify a custom image url */
        var CollageItemCustomImageUrlInputPlaceholder: string;
        /** Collage item editor: The caption telling the user the best size for external images */
        var CollageItemCustomImageUrlCaption: string;
        /** Collage item editor: The caption telling the user we're trying to load the specified image */
        var CollageItemCustomImageUrlLoadingCaption: string;
        /** Collage item editor: The caption telling the user we couldn't load an image from the specified url */
        var CollageItemCustomImageUrlLoadErrorCaption: string;
        /** Collage item editor: The caption telling the user they entered an invalid url */
        var CollageItemCustomImageUrlBadAddressCaption: string;
        /** Collage item editor: The caption telling the user loaded an image from the specified url */
        var CollageItemCustomImageUrlSuccessCaption: string;
        /** Collage item editor: The title of the form region in which users can see the item being created */
        var CollageItemEditorPreviewRegionTitle: string;
        /** Collage item editor: The label for the button allowing users to save their work */
        var CollageItemEditorSaveBtnTxt: string;
        /** Collage item editor: The label for the button allowing users to close the editor without saving their work */
        var CollageItemEditorCancelBtnTxt: string;
        /** Collage item control: The title of the message letting the user know they have reached the max number of possible items */
        var CollageControlMaxNumberOfItemsMessageTitle: string;
        /** Collage item control: The text of the message letting the user know they have reached the max number of possible items */
        var CollageControlMaxNumberOfItemsMessageText: string;
        /** The title of the dialog asking the user to confirm whether they want to remove a featured question from the collage */
        var CollageDeleteItemDialogTitle: string;
        /** The text content of the dialog asking the user to confirm whether they want to remove a featured question from the collage */
        var CollageDeleteItemDialogText: string;
        /** The description of the pulldown list allowing the user to switch between result sources */
        var ModelSelectionControlPulldownDescriptionText: string;
        /** The text used inside a buton when asking the user a yes/no question/prompt */
        var YesDialogOption: string;
        /** The text used inside a buton when asking the user a yes/no question/prompt */
        var NoDialogOption: string;
        /** The text tile in the main help page*/
        var mainHelpPageTitle: string;
        /** The text description in the main help page*/
        var mainHelpPageDescription: string;
        /** The text of workbook list title in the main help page*/
        var mainHelpPageWorkbookListTitle: string;
        /** The text description in the model help page*/
        var modelHelpPageDescription: string;
        /** The text of question list title in the model help page*/
        var modelHelpPageQuestionListTitle: string;
        /** The text of add featured question on help page*/
        var helpPageAddFeaturedQuestion: string;
        /** The text of featured questions on help page*/
        var helpPageFeaturedQuestions: string;
        /** The text of empty list on help page*/
        var helpPageNoItemsListed: string;
        /** The tooltip for the button which allows users to flag utterances */
        var flagUtteranceTooltip: string;
        /** The tooltip for the user feedback button which allows users to rate answers */
        var utteranceFeedbackTooltip: string;
        /** The title for the user feedback dialog which allows users to rate answers */
        var utteranceFeedbackDialogTitle: string;
        /** The prompt for the user feedback dialog which allows users to rate answers */
        var utteranceFeedbackDialogPrompt: string;
        /** A feedback option, displayed in the dialog which allows users to rate answers */
        var utteranceFeedbackResultBad: string;
        /** A feedback option, displayed in the dialog which allows users to rate answers */
        var utteranceFeedbackResultMedium: string;
        /** A feedback option, displayed in the dialog which allows users to rate answers */
        var utteranceFeedbackResultGood: string;
        /** The error text for the model selection control if one or more sources fail to load */
        var modelSelectionHasErrors: string;
    }
}
declare module powerbi {
    /** A structure containing a RejectablePromise and its associated deferred */
    interface RejectablePromiseWithDeferred<T> {
        deferred: IDeferred<T>;
        promise: RejectablePromise<T>;
    }
    interface IRejectablePromiseCacheRewiter<T> {
        rewriteKey?(key: string): string;
        rewriteResult?(result: T, key: string): T;
    }
    /**
     * @class
     * A cache of Rejectable Promises
     */
    class RejectablePromiseCache<T> {
        /**
         * Maximum number of entries in the cache
         * Cache is cleared entirely once it reaches this limit
         */
        private static maxCacheEntries;
        /** promise factory used to create promises */
        private promiseFactory;
        /**
         * Query cache
         * This cache doesn't have a entry expiry time
         * Rejected promises will not be cached
         */
        private cache;
        /**
         * Constructor of RejectablePromiseCache
         * @param {IPromiseFactory} promiseFactory - factory used to create promises
         */
        constructor(promiseFactory: IPromiseFactory);
        /**
         * Returns the number of entries in the cache
         */
        getEntryCount(): number;
        /**
         * Indicates if there is an entry in the cache for the provided key
         * @param {string} cacheKey - Identifier of the cache entry
         */
        hasCacheEntry(cacheKey: string): boolean;
        /**
         * Creates a cache entry associated with the provided key. If the key is already
         * pointing to a cache entry, 'undefined' is returned.
         * @param {string} cacheKey - Identifier of the cache entry
         */
        createCacheEntry(cacheKey: string): RejectablePromiseWithDeferred<T>;
        /**
         * clears the cache from the entry associated with the provided cache key
         * @param {string} cacheKey - Identifier of the cache entry
         * @param {boolean} rejectPromise - indicates of the promise should be reject. Promise is reject only if it is pending
         */
        clearEntry(cacheKey: string, rejectPromise?: boolean): boolean;
        /**
         * clears the cache from the entry associated with the provided cache key
         * @param {boolean} rejectPromise - indicates of promises should be reject. A Promise is reject only if it is pending
         */
        clearAllEntries(rejectPromise?: boolean): void;
        /**
         * Bind a new promise to cached query results and returns the promise. Once results are available deferred is resolved
         * @param {string} cacheKey - Identifier of the cache entry
         */
        bindCacheEntry(cacheKey: string): RejectablePromise<T>;
        /**
         * Enumerates over cache entries and passes each to the rewriter
         * @param {IRejectablePromiseCacheRewiter} rewriter - rewriter of cache key
         * rewriter may indicate that rewrite is completed.
         */
        rewriteAllEntries(rewriter: IRejectablePromiseCacheRewiter<T>): void;
        /**
         * Change cache Key (rekey). It will check for collision before changing the key
         * If rekey is successful, this function will return true, otherwise it will return false
         */
        private changeCacheKey(oldKey, newKey);
        /**
         * Gets cache entry associated with the provided key
         * @param {string} cacheKey - Identifier of the cache entry
         */
        private getCacheEntry(cacheKey);
    }
}
declare module jsCommon {
    interface IJavaScriptDependency {
        javascriptFile: string;
        onLoadCallback?: () => JQueryPromise<void>;
    }
    interface IDependency {
        javaScriptFiles?: string[];
        cssFiles?: string[];
        javaScriptFilesWithCallback?: IJavaScriptDependency[];
    }
    function requires(dependency: IDependency, to?: () => void): void;
}
declare module powerbi {
    var CategoryTypes: {
        Address: string;
        City: string;
        Continent: string;
        CountryRegion: string;
        County: string;
        Longitude: string;
        Latitude: string;
        Place: string;
        PostalCode: string;
        StateOrProvince: string;
    };
    interface IGeoTaggingAnalyzerService {
        isLongitudeOrLatitude(fieldRefName: string): boolean;
        isGeographic(fieldRefName: string): boolean;
        isGeocodable(fieldRefName: string): boolean;
        getFieldType(fieldName: string): string;
    }
    function createGeoTaggingAnalyzerService(getLocalized: (string) => string): IGeoTaggingAnalyzerService;
    class GeoTaggingAnalyzerService implements IGeoTaggingAnalyzerService {
        private GeotaggingString_Continent;
        private GeotaggingString_Continents;
        private GeotaggingString_Country;
        private GeotaggingString_Countries;
        private GeotaggingString_State;
        private GeotaggingString_States;
        private GeotaggingString_City;
        private GeotaggingString_Cities;
        private GeotaggingString_Town;
        private GeotaggingString_Towns;
        private GeotaggingString_Province;
        private GeotaggingString_Provinces;
        private GeotaggingString_County;
        private GeotaggingString_Counties;
        private GeotaggingString_Village;
        private GeotaggingString_Villages;
        private GeotaggingString_Post;
        private GeotaggingString_Zip;
        private GeotaggingString_Code;
        private GeotaggingString_Place;
        private GeotaggingString_Places;
        private GeotaggingString_Address;
        private GeotaggingString_Addresses;
        private GeotaggingString_Street;
        private GeotaggingString_Streets;
        private GeotaggingString_Longitude;
        private GeotaggingString_Longitude_Short;
        private GeotaggingString_Latitude;
        private GeotaggingString_Latitude_Short;
        private GeotaggingString_PostalCode;
        private GeotaggingString_PostalCodes;
        private GeotaggingString_ZipCode;
        private GeotaggingString_ZipCodes;
        private GeotaggingString_Territory;
        private GeotaggingString_Territories;
        private GeotaggingString_VRMBackCompat_CountryRegion;
        private GeotaggingString_VRMBackCompat_StateOrProvince;
        constructor(getLocalized: (string) => string);
        isLongitudeOrLatitude(fieldRefName: string): boolean;
        isGeographic(fieldRefName: string): boolean;
        isGeocodable(fieldRefName: string): boolean;
        private isAddress(fieldRefName);
        private isPlace(fieldRefName);
        private isCity(fieldRefName);
        private isStateOrProvince(fieldRefName);
        private isCountry(fieldRefName);
        private isCounty(fieldRefName);
        private isContinent(fieldRefName);
        private isPostalCode(fieldRefName);
        private isLongitude(fieldRefName);
        private isLatitude(fieldRefName);
        private isTerritory(fieldRefName);
        private static hasMatches(fieldName, possibleMatches);
        getFieldType(fieldName: string): string;
    }
}
declare module powerbi {
    function createJQueryPromiseFactory(): IPromiseFactory;
}
declare module powerbi {
    interface ILocalStorageService {
        getData(key: string): any;
        setData(key: string, data: any): void;
    }
    var localStorageService: ILocalStorageService;
}
declare module powerbi {
    interface ITextMeasurer {
        (textElement: SVGTextElement): number;
    }
    interface ITextAsSVGMeasurer {
        (textProperties: TextProperties): number;
    }
    interface TextProperties {
        text?: string;
        fontFamily: string;
        fontSize: string;
        fontWeight?: string;
        fontStyle?: string;
        whiteSpace?: string;
    }
    module TextMeasurementService {
        /**
         * This method measures the width of the text with the given text properties
         * @param {ITextMeasurementProperties} textProperties - The text properties to use for text measurement
         */
        function measureTextWidth(textProperties: TextProperties): number;
        /**
         * This method measures the width of the text with the given SVG text properties
         * @param {ITextMeasurementProperties} textProperties - The text properties to use for text measurement
         */
        function measureSvgTextWidth(textProperties: TextProperties): number;
        /**
         * This method measures the height of the text with the given SVG text properties
         * @param {ITextMeasurementProperties} textProperties - The text properties to use for text measurement
         */
        function measureSvgTextHeight(textProperties: TextProperties): number;
        /**
         * This method measures the width of the svgElement.
         * @param {SVGTextElement} element - The SVGTextElement to be measured.
         */
        function measureSvgTextElementWidth(svgElement: SVGTextElement): number;
        /**
         * This method fetches the text measurement properties of the given DOM element.
         * @param {JQuery} element - The selector for the DOM Element.
         */
        function getMeasurementProperties(element: JQuery): TextProperties;
        /**
         * This method fetches the text measurement properties of the given SVG text element.
         * @param {SVGTextElement} element - The SVGTextElement to be measured.
         */
        function getSvgMeasurementProperties(svgElement: SVGTextElement): TextProperties;
        /**
         * This method returns the width of a div element
         * @param {JQuery} element: The div element
         */
        function getDivElementWidth(element: JQuery): string;
        /**
        * Compares labels text size to the available size and renders ellipses when the available size is smaller
        * @param {ITextMeasurementProperties} textProperties - The text properties (including text content) to use for text measurement
        * @param maxWidth - the maximum width available for rendering the text
        */
        function getTailoredTextOrDefault(properties: TextProperties, maxWidth: number): string;
        /**
        * Compares labels text size to the available size and renders ellipses when the available size is smaller
        * @param textElement - the SVGTextElement containing the text to render
        * @param maxWidth - the maximum width available for rendering the text
        */
        function svgEllipsis(textElement: SVGTextElement, maxWidth: number): void;
    }
}
declare module jsCommon {
    module UnionExtensions {
        /**
         * Merges objects representing parts of a union type into a single object.
         * arg1 may be modified during the merge.
         */
        function mergeUnionType<TResult>(arg1: any, arg2: any, arg3?: any): TResult;
    }
}
declare module InJs {
    class InfoNavUtility {
        private static infonavAdditionalErrorClass;
        private static infonavShowAdditionalErrorClass;
        private static infoNavErrorInfoFieldTemplate;
        /**
         * Create an Error Information Block
         * @param statusCode - The status code to display
         * @param errorType - The optional error string to display
         * @param activityId - The activity id
         * @param requestId - The request id
         * @param timeStamp - The timestamp
         */
        static constructAdditionalErrorInfoBlock(statusCode: string, errorType: string, activityId: string, requestId: string, timeStamp: Date, scriptError?: ScriptErrorInfo): JQuery;
        /**
         * Create a container that can show additional error info when a user clicks a show details link
         * @param additionalErrorInfo - The additional error info to display
         * @returns The container
         */
        static constructShowDetailsContainer(additionalErrorInfo: JQuery): JQuery;
        /**
         * Helper method to construct an error field
         * @param fieldTitle - The title of the field
         * @param fieldValue - The value for the field
         * @returns An html fragment for the error field
         */
        static constructErrorField(fieldTitle: string, fieldValue: string): JQuery;
    }
}
declare module jsCommon {
    /** Represents a batch of operations that can accumulate, and then be invoked together. */
    class DeferredBatch<T> {
        private _operation;
        private _timerFactory;
        private _batches;
        private _maxBatchSize;
        private _batchSize;
        constructor(operation: () => JQueryPromise<T>, timerFactory?: ITimerPromiseFactory, maxBatchSize?: number);
        /** Returns a promise of future invocation of the batch. */
        enqueue(): JQueryPromise<T>;
        private completeBatches();
        private completeBatch(batch);
    }
}
declare module jsCommon {
    /** Responsible for throttling input function. */
    class ThrottleUtility {
        private fn;
        private timerFactory;
        private delay;
        constructor(delay?: number);
        run(fn: () => void): void;
        timerComplete(fn: () => void): void;
    }
}
declare module jsCommon {
    interface ITimerPromiseFactory {
        /** Returns a promise that will be resolved after the specified delayInMs. */
        create(delayInMs: number): IRejectablePromise;
    }
    /** Responsible for creating timer promises. */
    class TimerPromiseFactory implements ITimerPromiseFactory {
        static instance: TimerPromiseFactory;
        create(delayInMs: number): IRejectablePromise;
    }
}
declare var clusterUri: string;
declare module jsCommon {
    /** Http Status code we are interested */
    enum HttpStatusCode {
        OK = 200,
        BadRequest = 400,
        Unauthorized = 401,
        Forbidden = 403,
        RequestEntityTooLarge = 413,
    }
    /** Other HTTP Constants */
    module HttpConstants {
        var ApplicationOctetStream: string;
        var MultiPartFormData: string;
    }
    /** Extensions to String class */
    module StringExtensions {
        function format(...args: string[]): string;
        /** Compares two strings for equality, ignoring case. */
        function equalIgnoreCase(a: string, b: string): boolean;
        function startsWithIgnoreCase(a: string, b: string): boolean;
        /** Normalizes case for a string.  Used by equalIgnoreCase method. */
        function normalizeCase(value: string): string;
        /** Is string null or empty or undefined? */
        function isNullOrEmpty(value: string): boolean;
        /** Returns true if the string is null, undefined, empty, or only includes white spaces */
        function isNullOrUndefinedOrWhiteSpaceString(str: string): boolean;
        /**
         * Returns a value indicating whether the str contains any whitespace.
         */
        function containsWhitespace(str: string): boolean;
        /**
         * Returns a value indicating whether the str is a whitespace string.
         */
        function isWhitespace(str: string): boolean;
        /** Returns the string with any trailing whitespace from str removed. */
        function trimTrailingWhitespace(str: string): string;
        /** Returns the string with any leading and trailing whitespace from str removed. */
        function trimWhitespace(str: string): string;
        /** Returns length difference between the two provided strings */
        function getLengthDifference(left: string, right: string): number;
        /** Repeat char or string several times.
          * @param char The string to repeat.
          * @param count How many times to repeat the string.
          */
        function repeat(char: string, count: number): string;
        /** Replace all the occurrences of the textToFind in the text with the textToReplace
          * @param text The original string.
          * @param textToFind Text to find in the original string
          * @param textToReplace New text replacing the textToFind
          */
        function replaceAll(text: string, textToFind: string, textToReplace: string): string;
        /** Returns a name that is not specified in the values. */
        function findUniqueName(usedNames: {
            [name: string]: boolean;
        }, baseName: string): string;
    }
    /** Interface used for interacting with WCF typed objects */
    interface TypedObject {
        __type: string;
    }
    /** Script#: The general utility class */
    class Utility {
        private static TypeNamespace;
        static JsonContentType: string;
        static JpegContentType: string;
        static XJavascriptContentType: string;
        static JsonDataType: string;
        static BlobDataType: string;
        static HttpGetMethod: string;
        static HttpPostMethod: string;
        static HttpPutMethod: string;
        static HttpDeleteMethod: string;
        static HttpContentTypeHeader: string;
        static HttpAcceptHeader: string;
        static Undefined: string;
        private static staticContentLocation;
        /**
         * Ensures the specified value is not null or undefined. Throws a relevent exception if it is.
         * @param value - The value to check
         * @param context - The context from which the check originated
         * @param methodName - The name of the method that initiated the check
         * @param parameterName - The parameter name of the value to check
         */
        static throwIfNullOrUndefined(value: any, context: any, methodName: any, parameterName: any): void;
        /**
         * Ensures the specified value is not null, undefined or empty. Throws a relevent exception if it is.
         * @param value - The value to check
         * @param context - The context from which the check originated
         * @param methodName - The name of the method that initiated the check
         * @param parameterName - The parameter name of the value to check
         */
        static throwIfNullOrEmpty(value: any, context: any, methodName: string, parameterName: string): void;
        /**
         * Ensures the specified string is not null, undefined or empty. Throws a relevent exception if it is.
         * @param value - The value to check
         * @param context - The context from which the check originated
         * @param methodName - The name of the method that initiated the check
         * @param parameterName - The parameter name of the value to check
         */
        static throwIfNullOrEmptyString(value: string, context: any, methodName: string, parameterName: string): void;
        /**
         * Ensures the specified value is not null, undefined, whitespace or empty. Throws a relevent exception if it is.
         * @param value - The value to check
         * @param context - The context from which the check originated
         * @param methodName - The name of the method that initiated the check
         * @param parameterName - The parameter name of the value to check
         */
        static throwIfNullEmptyOrWhitespaceString(value: string, context: any, methodName: string, parameterName: string): void;
        /**
         * Ensures the specified condition is true. Throws relevant exception if it isn't.
         * @param condition - The condition to check
         * @param context - The context from which the check originated
         * @param methodName - The name of the method that initiated the check
         * @param parameterName - The parameter name against which the condition is checked
         */
        static throwIfNotTrue(condition: boolean, context: any, methodName: string, parameterName: string): void;
        /**
         * Checks whether the provided value is a 'string'.
         * @param value - The value to test
         */
        static isString(value: any): boolean;
        /**
         * Checks whether the provided value is a 'boolean'.
         * @param value - The value to test
         */
        static isBoolean(value: any): boolean;
        /**
         * Checks whether the provided value is a 'number'.
         * @param value - The value to test
         */
        static isNumber(value: any): boolean;
        /**
         * Checks whether the provided value is a Date instance.
         * @param value - The value to test
         */
        static isDate(value: any): boolean;
        /**
         * Checks whether the provided value is an 'object'.
         * @param value - The value to test
         */
        static isObject(value: any): boolean;
        /**
         * Checks whether the provided value is null or undefined.
         * @param value - The value to test
        */
        static isNullOrUndefined(value: any): boolean;
        /**
         * Combine a base url and a path
         * @param baseUrl - The base url
         * @param path - The path to add on to the base url
         * @returns The combined url
         */
        static urlCombine(baseUrl: string, path: string): string;
        static getAbsoluteUri(path: string): string;
        static getStaticResourceUri(path: string): string;
        static getComponentName(context: any): string;
        static throwException(e: any): void;
        static createClassSelector(className: string): string;
        static createIdSelector(id: string): string;
        /**
         * Creates a client-side Guid string
         * @returns A string representation of a Guid
         */
        static generateGuid(): string;
        /**
         * Generates a random 7 character string that is used as a connection group name
         * @returns A random connection group name
         */
        static generateConnectionGroupName(): string;
        /**
         * Try extract a cookie from <paramref name="cookie"/> identified by key <paramref name="key"/>
         */
        static getCookieValue(key: string): string;
        /**
         * Extracts the protocol://hostname section of a url
         * @param url - The URL from which to extract the section
         * @returns The protocol://hostname portion of the given URL
         */
        static getDomainForUrl(url: string): string;
        /**
         * Extracts the hostname and absolute path sections of a url
         * @param url - The URL from which to extract the section
         * @returns The hostname and absolute path portion of the given URL
         */
        static getHostNameForUrl(url: string): string;
        /**
        * Return the original url with query string stripped.
        * @param url - The URL from which to extract the section
        * @returns the original url with query string stripped.
        */
        static getUrlWithoutQueryString(url: string): string;
        /**
         * Extracts the protocol section of a url
         * @param url - The URL from which to extract the section
         * @returns The protocol for the current URL
         */
        static getProtocolFromUrl(url: string): string;
        /**
         * Returns a formatted href object from a URL
         * @param url - The URL used to generate the object
         * @returns A jQuery object with the url
         */
        static getHrefObjectFromUrl(url: string): JQuery;
        /**
         * Converts a WCF representation of a dictionary to a JavaScript dictionary
         * @param wcfDictionary - The WCF dictionary to convert
         * @returns The native JavaScript representation of this dictionary
         */
        static convertWcfToJsDictionary(wcfDictionary: any[]): {
            [index: string]: any;
        };
        static getDateFromWcfJsonString(jsonDate: string, fromUtcMilliseconds: boolean): Date;
        /**
         * Get the outer html of the given jquery object
         * @param content - The jquery object
         * @returns The entire html representation of the object
         */
        static getOuterHtml(content: JQuery): string;
        /**
         * Comparison Method: Compares two integer numbers
         * @param a - An integer value
         * @param b - An integer value
         * @returns The comparison result
         */
        static compareInt(a: number, b: number): number;
        /**
          Return the index of the smallest value in a numerical array
          @param a - A numeric array
          @returns - The index of the smallest value in the array
         */
        static getIndexOfMinValue(a: number[]): number;
        /**
          Tests whether a URL is valid
          @param url - The url to be tested
          @returns - Whether the provided url is valid
        */
        static isValidUrl(url: string): boolean;
        /**
          Extracts a url from a background image attribute in the format of: url('www.foobar.com/image.png')
          @param url - The value of the background-image attribute
          @returns - The extracted url
        */
        static extractUrlFromCssBackgroundImage(input: string): string;
        /**
         Downloads a content string as a file
         @param content - Content stream
         @param fileName - File name to use
        */
        static saveAsFile(content: any, fileName: string): void;
        /**
         * Helper method to get the simple type name from a typed object
         * @param obj - The typed object
         * @returns The simple type name for the object
         */
        static getType(obj: TypedObject): string;
        /**
         * check if an element supports a specific event type
         * @param eventName - The name of the event
         * @param element - The element to test for event support
         * @returns Whether the even is supported on the provided element
         */
        static isEventSupported(eventName: string, element: Element): boolean;
        static toPixel(pixelAmount: number): string;
        static getPropertyCount(object: any): number;
        /**
         * check if an element supports a specific event type
         * @param filePath - file path
         * @returns file extension
         */
        static getFileExtension(filePath: string): string;
        /**
         *
         * This method indicates whether window.clipboardData is supported.
         * For example, clipboard support for Windows Store apps is currently disabled
         * since window.clipboardData is unsupported (it raises access denied error)
         * since clipboard in Windows Store is being achieved through Windows.ApplicationModel.DataTransfer.Clipboard class
         */
        static canUseClipboard(): boolean;
        static is64BitOperatingSystem(): boolean;
        static parseNumber(value: any, defaultValue?: number): number;
    }
    class VersionUtility {
        /**
         * Compares 2 version strings
         * @param versionA - The first version string
         * @param versionB - The second version string
         * @returns A result for the comparison
         */
        static compareVersions(versionA: string, versionB: string): number;
    }
    module PerformanceUtil {
        class PerfMarker {
            private _name;
            private _start;
            constructor(name: string);
            private static begin(name);
            end(): void;
        }
        function create(name: string): PerfMarker;
    }
    module GzipUtility {
        /**
         * Uncompresses after decoding string
         * @param encoded - A gzipped and Base64 encoded string
         * @returns Decoded and uncompressed string
         */
        function uncompress(encoded: string): string;
        /**
         * Compress and then Base64-encode the string
         * @param data - String to be gzipped and Base64 encoded
         * @returns Compressed and Base64-encoded string
         */
        function compress(data: string): string;
    }
    module DeferUtility {
        /**
        * Wraps a callback and returns a new function
        * The function can be called many times but the callback
        * will only be executed once on the next frame.
        * Use this to throttle big UI updates and access to DOM
        */
        function deferUntilNextFrame(callback: Function): Function;
    }
    class EncryptionContext {
        private rsaMaxLength;
        private rsaEncryptedLength;
        private callback;
        private plainTextBytes;
        private publicKey;
        private entropy;
        private segments;
        private currentSegment;
        private encryptedBytes;
        private publicKeyHandle;
        constructor(message: string, publicKey: string, entropy: number[], callbackFunction: (encrypted: string) => void);
        RSAEncrypt(): void;
        static generateEntropy(): number[];
        private rsaPublicKeyImportComplete(e);
        private rsaEncryption();
        private rsaEncryptionSegmentComplete(e);
        private toSupportedRSAPublicKey(publicKey);
        private arrayToBase64String(bytes);
        private toSupportedArray(data);
        private toUTF8Array(str);
    }
}
declare module jsCommon {
    class XmlUtility {
        private static TabCharCode;
        private static NewLineCharCode;
        private static CarriageReturnCharCode;
        static removeInvalidCharacters(input: string): string;
        /**
         * Checks whether character at the provided index is a valid xml character as per
         * XML 1.0 specification: http://www.w3.org/TR/xml/#charsets
         */
        static isValidXmlCharacter(input: string, index: number): boolean;
    }
}
declare module jsCommon {
    class TraceItem {
        type: TraceType;
        sessionId: string;
        requestId: string;
        text: string;
        timeStamp: Date;
        /** DO NOT USE for backward compability only */
        _activityId: string;
        private static traceTypeStrings;
        constructor(text: string, type: TraceType, sessionId: string, requestId?: string);
        toString(): string;
    }
}
declare module jsCommon {
    /** Interface to help define objects indexed by number to a particular type. */
    interface INumberDictionary<T> {
        [key: number]: T;
    }
    /** Interface to help define objects indexed by name to a particular type. */
    interface IStringDictionary<T> {
        [key: string]: T;
    }
    /** Extensions for Enumerations. */
    module EnumExtensions {
        /** Gets a value indicating whether the value has the bit flags set. */
        function hasFlag(value: number, flag: number): boolean;
        function toString(enumType: any, value: number): string;
    }
    /** Extensions to String class */
    module StringExtensions {
        /** Checks if a string ends with a sub-string */
        function endsWith(str: string, suffix: string): boolean;
    }
    module LogicExtensions {
        function XOR(a: boolean, b: boolean): boolean;
    }
    module JsonComparer {
        /** Performs JSON-style comparison of two objects. */
        function equals<T>(x: T, y: T): boolean;
    }
}
declare module jsCommon {
    interface ITraceListener {
        logTrace(trace: TraceItem): void;
    }
    class ConsoleTracer implements ITraceListener {
        logTrace(trace: TraceItem): void;
    }
    module Trace {
        /** Trace a warning. Please ensure that no PII is being logged.*/
        function warning(text: string, requestId?: string): void;
        /** Trace an error. Please ensure that no PII is being logged.*/
        function error(text: string, includeStackTrace?: boolean, requestId?: string): void;
        /** Trace an information. Please ensure that no PII is being logged.*/
        function verbose(text: string, requestId?: string): void;
        function addListener(listener: ITraceListener): void;
        function removeListener(listener: ITraceListener): void;
        function resetListeners(): void;
        function reset(): void;
        function getTraces(): Array<TraceItem>;
        /** used for unit-test only */
        function disableDefaultListener(): void;
        function enableDefaultListener(): void;
    }
}
declare module jsCommon {
    /** The types of possible traces within the system, this aligns to the traces available in Cloud Platform */
    enum TraceType {
        Information = 0,
        Verbose = 1,
        Warning = 2,
        Error = 3,
        ExpectedError = 4,
        UnexpectedError = 5,
        Fatal = 6,
    }
}
declare module powerbi {
    var build: any;
    /**
     * Do not blindly copy ng.IRequestConfig as the idea of this interface is
     * to lessen flexibility for cleaner code. We may eventually need to add
     * properties but when we do let's think about how to impose code consistency.
     */
    interface IRequestOptions {
        params?: {
            [index: string]: string;
        };
        headers?: {
            [index: string]: string;
        };
        retryCount?: number;
        timeout?: any;
        responseType?: string;
        silentlyFailOnExpiry?: boolean;
        enableTelemetry?: boolean;
        telemetryDescription?: string;
        disableRedirectToSignupOnUnlicensedUser?: boolean;
    }
    interface IHttpResult<TContract> {
        data: TContract;
        status: HttpStatusCode;
        headers: (headerName: string) => string;
        activityId?: string;
        requestId?: string;
    }
    enum HttpStatusCode {
        AngularCancelOrTimeout = 0,
        OK = 200,
        BadRequest = 400,
        Unauthorized = 401,
        Forbidden = 403,
        NotFound = 404,
        RequestTimeout = 408,
        RequestEntityTooLarge = 413,
    }
    interface HttpPromise<TContract> extends IPromise2<IHttpResult<TContract>, IHttpResult<TContract>> {
    }
    interface IHttpService {
        get<TContract>(url: string, additionalRequestConfig: IRequestOptions): HttpPromise<TContract>;
        post<TContract>(url: string, data: any, additionalRequestConfig: IRequestOptions): HttpPromise<TContract>;
        put<TContract>(url: string, data: any, additionalRequestConfig: IRequestOptions): HttpPromise<TContract>;
        delete<TContract>(url: string, additionalRequestConfig: IRequestOptions): HttpPromise<TContract>;
        powerbiRequestOptions(): IRequestOptions;
        defaultRetryRequestOptions(): IRequestOptions;
        registerResponseCallback(callback: (success: boolean) => void): void;
        unregisterResponseCallback(callback: (success: boolean) => void): void;
    }
}
declare module jsCommon {
    function ensurePowerView(action?: () => void): void;
    function ensureMap(action: () => void): void;
    function mapControlLoaded(): void;
    function waitForMapControlLoaded(): JQueryPromise<void>;
}
declare var globalMapControlLoaded: () => void;
