//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbitests.mocks {
    import InJsUtility = jsCommon.Utility;
    import SQExprBuilder = powerbi.data.SQExprBuilder;

    var BeautifiedFormat: { [x: string]: string } = {
        '0.00 %;-0.00 %;0.00 %': 'Percentage',
    };

    export class TelemetryCallbackMock {
        public static callbackCalls: number = 0;

        public target() {
            TelemetryCallbackMock.callbackCalls++;
        }
    };

    export class MockIdleCallbackTimer implements powerbi.IIdleCallbackTimer {
        public callbacks: any[] = [];

        public addCallback(fn: () => void) {
            this.removeCallback(fn);
            this.callbacks.push(fn);
        }

        public removeCallback(fn: () => void) {
            for (var i = this.callbacks.length - 1; i >= 0; i--) {
                if (this.callbacks[i] === fn) {
                    this.callbacks.splice(i, 1);
                }
            }
        }

        public callback(times: number) {
            for (var i = 0; i < times; i++) {
                for (var j = 0; j < this.callbacks.length; j++) {
                    this.callbacks[j]();
                }
            }
        }
    }

    export class LocalyticsMock implements powerbi.ILocalytics {

        public static localyticsCalls: number = 0;

        public load(appId: string): void {
            LocalyticsMock.localyticsCalls++;
        }

        public static tagEventCalls: any[] = [];

        public tagEvent(event: string, properties: any): void {
            LocalyticsMock.localyticsCalls++;
            LocalyticsMock.tagEventCalls.push({
                event: event,
                properties: properties
            });
        }

        public tagScreen(screenName: string): void {
            LocalyticsMock.localyticsCalls++;
        }

        public setCustomDimension(id: number, name: string): void {
            LocalyticsMock.localyticsCalls++;
        }

        public setCustomerId(customerId: string): void {
            LocalyticsMock.localyticsCalls++;
        }

        public open(): void {
            LocalyticsMock.localyticsCalls++;
        }
    }

    export class AppInsightsV2Mock {
        public trackPageViewTimes: number = 0;
        public trackEventTimes: number = 0;
        public trackEventLastActivityName: string = null;
        public trackEventLastAdditionalData: any = {
            id: null,
            start: null,
            end: null,
            isInternalUser: null,
            userId: null,
            category: null,
            sessionId: null,
            client: null,
            build: null,
            cluster: null,
        };

        public trackPageView(): void {
            this.trackPageViewTimes++;
        }

        public trackEvent(activityName: string, additionalData: any): void {
            this.trackEventTimes++;
            this.trackEventLastActivityName = activityName;
            this.trackEventLastAdditionalData = additionalData;
        }
    }

    export var DefaultLoggerMockType: number = 1;

    export class LoggerMock implements powerbi.ILoggerService {
        public hostData: powerbi.TelemetryHostData;
        private loggerType: number;

        constructor(loggerType?: number) {
            if (typeof loggerType === undefined)
                this.loggerType = DefaultLoggerMockType;
            else
                this.loggerType = loggerType;
        }

        public getType(): number {
            return this.loggerType;
        }

        public initialize(hostData: powerbi.TelemetryHostData): void {
            this.hostData = hostData;
        }

        public logCalls: any[] = [];
        public logEvent(eventData: powerbi.ITelemetryEvent): void {
            this.logCalls.push({
                eventData: eventData
            });
        }

        public startTimedEventCalls: any[] = [];
        public startTimedEvent(eventData: powerbi.ITelemetryEvent): void {
            this.startTimedEventCalls.push({
                eventData: eventData
            });
        }

        public endTimedEventCalls: any[] = [];
        public endTimedEvent(eventData: powerbi.ITelemetryEvent): void {
            this.endTimedEventCalls.push({
                eventData: eventData
            });
        }
    }

    export class NoWaitTimer implements powerbi.ITimer {
        public setTimeout(callback: any, period: number, arg: any): any {
            callback(arg);
            return 0;
        }

        public setInterval(callback: any, period: number, arg: any): any {
            callback(arg);
            return 0;
        }

        public clearTimeout(id: any): void { }
        public clearInterval(id: any): void { }
    }

    export class WaitForeverTimer implements powerbi.ITimer {
        public setTimeout(callback: any, period: number, arg: any): any {
            return 0;
        }

        public setInterval(callback: any, period: number, arg: any): any {
            return 0;
        }

        public clearTimeout(id: any): void { }
        public clearInterval(id: any): void { }
    }

    export class MockTimerPromiseFactory implements jsCommon.ITimerPromiseFactory {
        public deferred: JQueryDeferred<void>;

        public create(delayInMs: number): jsCommon.IRejectablePromise {
            if (!this.deferred) {
                this.deferred = $.Deferred<void>();
            }

            return this.deferred;
        }

        public resolveCurrent(): void {
            expect(this.deferred).toBeDefined();

            // Note: we need to read the current deferred field into a local var and null out the member before
            // we call resolve, just in case one of timer callbacks recursively creates another timer.
            var deferred = this.deferred;
            this.deferred = undefined;
            deferred.resolve();
        }

        public reject(): void {
            expect(this.deferred).toBeDefined();

            // Note: we need to read the current deferred field into a local var and null out the member before
            // we call reject, just in case one of timer callbacks recursively creates another timer.
            var deferred = this.deferred;
            this.deferred = undefined;
            deferred.reject();
        }

        public expectNoTimers(): void {
            expect(this.deferred).not.toBeDefined();
        }

        public hasPendingTimers(): boolean {
            return !!this.deferred;
        }
    }

    export class MockTelemetryHostService implements powerbi.ITelemetryHostService {
        public logger: LoggerMock;

        constructor() {
            this.logger = new LoggerMock();
        }

        public getLoggerServices(): powerbi.ILoggerService[] {
            return [this.logger];
        }

        public getHostData(): powerbi.TelemetryHostData {
            return {
                sessionId: 'SessionID',
                client: 'clientName',
                build: 'build',
                cluster: 'clusterUri',
                userId: 'userId',
                isInternalUser: true
            };
        }
    }

    export var MockTelemetryEvent = function (eventName: string, parentId: string, category?: powerbi.TelemetryCategory, optionalAttributes?: any) {
        return {
            name: eventName,
            category: category,
            time: Date.now(),
            id: jsCommon.Utility.generateGuid(),
            getFormattedInfoObject: function (): any {
                return $.extend({}, {
                    parentId: parentId
                }, optionalAttributes);
            },
            info: $.extend({}, {
                parentId: parentId
            }, optionalAttributes)
        };
    };

    export function createVisualHostServices(): powerbi.IVisualHostServices {
        return {
            getLocalizedString: (stringId: string) => stringId,
            onDragStart: () => { },
            canSelect: () => true,
            onSelect: () => { },
            loadMoreData: () => { },
            persistProperties: () => { },
            onCustomSort: (args: powerbi.CustomSortEventArgs) => { },
            getViewMode: () => powerbi.ViewMode.View,
            setWarnings: (warnings: powerbi.IVisualWarning[]) => { },
            setToolbar: ($toolbar) => { },
        };
    }

    export function createLocalizationService(): any {
        return {
            currentLanguageLocale: "",
            getOptional: (id: string) => id,
            ensureLocalization: (action: () => void) => { },
            format: (id: string, ...args: any[]) => id,
            formatValue: (arg: any) => arg,
        };
    }

    export class MockTraceListener implements jsCommon.ITraceListener {
        public trace: jsCommon.TraceItem;

        public logTrace(trace: jsCommon.TraceItem): void {
            this.trace = trace;
        }
    }

    export function dataViewScopeIdentity(fakeValue: string | number | boolean): powerbi.DataViewScopeIdentity {
        var expr = constExpr(fakeValue);
        return powerbi.data.createDataViewScopeIdentity(expr);
    }

    export function dataViewScopeIdentityWithEquality(keyExpr: powerbi.data.SQExpr, fakeValue: string | number | boolean): powerbi.DataViewScopeIdentity {
        return powerbi.data.createDataViewScopeIdentity(
            powerbi.data.SQExprBuilder.equal(
                keyExpr,
                constExpr(fakeValue)));
    }

    function constExpr(fakeValue: string | number | boolean): powerbi.data.SQExpr {
        if (fakeValue === null)
            return SQExprBuilder.nullConstant();

        if (fakeValue === true || fakeValue === false)
            return SQExprBuilder.boolean(<boolean>fakeValue);

        return (typeof (fakeValue) === 'number')
            ? powerbi.data.SQExprBuilder.double(<number>fakeValue)
            : powerbi.data.SQExprBuilder.text(<string>fakeValue);
    }

    export class MockVisualWarning implements powerbi.IVisualWarning {
        public static Message: string = 'Warning';

        public getMessages(resourceProvider: jsCommon.IStringResourceProvider): powerbi.IVisualErrorMessage {
            var details: powerbi.IVisualErrorMessage = {
                message: MockVisualWarning.Message,
                title: 'key',
                detail: 'val',
            };
            return details;
        }
    }

    export function setLocale(localize: powerbi.common.ILocalizationService): void {
        debug.assertValue(localize, 'localize');

        setLocaleOptions(localize);
        setLocalizedStrings(localize);
    }

    function setLocaleOptions(localize: powerbi.common.ILocalizationService): void {
        var valueFormatterLocalizationOptions: powerbi.visuals.ValueFormatterLocalizationOptions =
            createLocaleOptions(localize);

        powerbi.visuals.valueFormatter.setLocaleOptions(valueFormatterLocalizationOptions);
    }

    function setLocalizedStrings(localize: powerbi.common.ILocalizationService): void {
        var tooltipLocalizationOptions: powerbi.visuals.TooltipLocalizationOptions =
            createTooltipLocaleOptions(localize);

        powerbi.visuals.TooltipManager.setLocalizedStrings(tooltipLocalizationOptions);
    }

    function createLocaleOptions(localize: powerbi.common.ILocalizationService): powerbi.visuals.ValueFormatterLocalizationOptions {
        return {
            null: localize.get('NullValue'),
            true: localize.get('BooleanTrue'),
            false: localize.get('BooleanFalse'),
            beautify: format => beautify(localize, format),
            describe: exponent => describeUnit(localize, exponent),
            restatementComma: powerbi.visuals.valueFormatter.getLocalizedString('RestatementComma'),
            restatementCompoundAnd: powerbi.visuals.valueFormatter.getLocalizedString('RestatementCompoundAnd')
		};
    }

    function createTooltipLocaleOptions(localize: powerbi.common.ILocalizationService): powerbi.visuals.TooltipLocalizationOptions {
        return {
            highlightedValueDisplayName: localize.get(powerbi.visuals.ToolTipComponent.highlightedValueDisplayNameResorceKey)
        };
    }

    function beautify(localize: powerbi.common.ILocalizationService, format: string): string {
        if (format) {
            var regEx = RegExp('\\.0* %', 'g');
            format = format.replace(regEx, '.00 %');
        }

        var key = BeautifiedFormat[format];

        if (key)
            return localize.getOptional(key) || format;

        return format;
    }

    function describeUnit(localize: powerbi.common.ILocalizationService, exponent: number): powerbi.DisplayUnitSystemNames {
        var title: string = localize.getOptional("DisplayUnitSystem_E" + exponent + "_Title");
        var format: string = localize.getOptional("DisplayUnitSystem_E" + exponent + "_LabelFormat");

        if (title || format)
            return { title: title, format: format };
    }

}