//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbitests.mocks {
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