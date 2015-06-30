//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbitests;
(function (powerbitests) {
    var mocks;
    (function (mocks) {
        var SQExprBuilder = powerbi.data.SQExprBuilder;
        var BeautifiedFormat = {
            '0.00 %;-0.00 %;0.00 %': 'Percentage',
        };
        var TelemetryCallbackMock = (function () {
            function TelemetryCallbackMock() {
            }
            TelemetryCallbackMock.prototype.target = function () {
                TelemetryCallbackMock.callbackCalls++;
            };
            TelemetryCallbackMock.callbackCalls = 0;
            return TelemetryCallbackMock;
        })();
        mocks.TelemetryCallbackMock = TelemetryCallbackMock;
        ;
        var MockIdleCallbackTimer = (function () {
            function MockIdleCallbackTimer() {
                this.callbacks = [];
            }
            MockIdleCallbackTimer.prototype.addCallback = function (fn) {
                this.removeCallback(fn);
                this.callbacks.push(fn);
            };
            MockIdleCallbackTimer.prototype.removeCallback = function (fn) {
                for (var i = this.callbacks.length - 1; i >= 0; i--) {
                    if (this.callbacks[i] === fn) {
                        this.callbacks.splice(i, 1);
                    }
                }
            };
            MockIdleCallbackTimer.prototype.callback = function (times) {
                for (var i = 0; i < times; i++) {
                    for (var j = 0; j < this.callbacks.length; j++) {
                        this.callbacks[j]();
                    }
                }
            };
            return MockIdleCallbackTimer;
        })();
        mocks.MockIdleCallbackTimer = MockIdleCallbackTimer;
        var LocalyticsMock = (function () {
            function LocalyticsMock() {
            }
            LocalyticsMock.prototype.load = function (appId) {
                LocalyticsMock.localyticsCalls++;
            };
            LocalyticsMock.prototype.tagEvent = function (event, properties) {
                LocalyticsMock.localyticsCalls++;
                LocalyticsMock.tagEventCalls.push({
                    event: event,
                    properties: properties
                });
            };
            LocalyticsMock.prototype.tagScreen = function (screenName) {
                LocalyticsMock.localyticsCalls++;
            };
            LocalyticsMock.prototype.setCustomDimension = function (id, name) {
                LocalyticsMock.localyticsCalls++;
            };
            LocalyticsMock.prototype.setCustomerId = function (customerId) {
                LocalyticsMock.localyticsCalls++;
            };
            LocalyticsMock.prototype.open = function () {
                LocalyticsMock.localyticsCalls++;
            };
            LocalyticsMock.localyticsCalls = 0;
            LocalyticsMock.tagEventCalls = [];
            return LocalyticsMock;
        })();
        mocks.LocalyticsMock = LocalyticsMock;
        var AppInsightsV2Mock = (function () {
            function AppInsightsV2Mock() {
                this.trackPageViewTimes = 0;
                this.trackEventTimes = 0;
                this.trackEventLastActivityName = null;
                this.trackEventLastAdditionalData = {
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
            }
            AppInsightsV2Mock.prototype.trackPageView = function () {
                this.trackPageViewTimes++;
            };
            AppInsightsV2Mock.prototype.trackEvent = function (activityName, additionalData) {
                this.trackEventTimes++;
                this.trackEventLastActivityName = activityName;
                this.trackEventLastAdditionalData = additionalData;
            };
            return AppInsightsV2Mock;
        })();
        mocks.AppInsightsV2Mock = AppInsightsV2Mock;
        mocks.DefaultLoggerMockType = 1;
        var LoggerMock = (function () {
            function LoggerMock(loggerType) {
                this.logCalls = [];
                this.startTimedEventCalls = [];
                this.endTimedEventCalls = [];
                if (typeof loggerType === undefined)
                    this.loggerType = mocks.DefaultLoggerMockType;
                else
                    this.loggerType = loggerType;
            }
            LoggerMock.prototype.getType = function () {
                return this.loggerType;
            };
            LoggerMock.prototype.initialize = function (hostData) {
                this.hostData = hostData;
            };
            LoggerMock.prototype.logEvent = function (eventData) {
                this.logCalls.push({
                    eventData: eventData
                });
            };
            LoggerMock.prototype.startTimedEvent = function (eventData) {
                this.startTimedEventCalls.push({
                    eventData: eventData
                });
            };
            LoggerMock.prototype.endTimedEvent = function (eventData) {
                this.endTimedEventCalls.push({
                    eventData: eventData
                });
            };
            return LoggerMock;
        })();
        mocks.LoggerMock = LoggerMock;
        var NoWaitTimer = (function () {
            function NoWaitTimer() {
            }
            NoWaitTimer.prototype.setTimeout = function (callback, period, arg) {
                callback(arg);
                return 0;
            };
            NoWaitTimer.prototype.setInterval = function (callback, period, arg) {
                callback(arg);
                return 0;
            };
            NoWaitTimer.prototype.clearTimeout = function (id) {
            };
            NoWaitTimer.prototype.clearInterval = function (id) {
            };
            return NoWaitTimer;
        })();
        mocks.NoWaitTimer = NoWaitTimer;
        var WaitForeverTimer = (function () {
            function WaitForeverTimer() {
            }
            WaitForeverTimer.prototype.setTimeout = function (callback, period, arg) {
                return 0;
            };
            WaitForeverTimer.prototype.setInterval = function (callback, period, arg) {
                return 0;
            };
            WaitForeverTimer.prototype.clearTimeout = function (id) {
            };
            WaitForeverTimer.prototype.clearInterval = function (id) {
            };
            return WaitForeverTimer;
        })();
        mocks.WaitForeverTimer = WaitForeverTimer;
        var MockTimerPromiseFactory = (function () {
            function MockTimerPromiseFactory() {
            }
            MockTimerPromiseFactory.prototype.create = function (delayInMs) {
                if (!this.deferred) {
                    this.deferred = $.Deferred();
                }
                return this.deferred;
            };
            MockTimerPromiseFactory.prototype.resolveCurrent = function () {
                expect(this.deferred).toBeDefined();
                // Note: we need to read the current deferred field into a local var and null out the member before
                // we call resolve, just in case one of timer callbacks recursively creates another timer.
                var deferred = this.deferred;
                this.deferred = undefined;
                deferred.resolve();
            };
            MockTimerPromiseFactory.prototype.reject = function () {
                expect(this.deferred).toBeDefined();
                // Note: we need to read the current deferred field into a local var and null out the member before
                // we call reject, just in case one of timer callbacks recursively creates another timer.
                var deferred = this.deferred;
                this.deferred = undefined;
                deferred.reject();
            };
            MockTimerPromiseFactory.prototype.expectNoTimers = function () {
                expect(this.deferred).not.toBeDefined();
            };
            MockTimerPromiseFactory.prototype.hasPendingTimers = function () {
                return !!this.deferred;
            };
            return MockTimerPromiseFactory;
        })();
        mocks.MockTimerPromiseFactory = MockTimerPromiseFactory;
        var MockTelemetryHostService = (function () {
            function MockTelemetryHostService() {
                this.logger = new LoggerMock();
            }
            MockTelemetryHostService.prototype.getLoggerServices = function () {
                return [this.logger];
            };
            MockTelemetryHostService.prototype.getHostData = function () {
                return {
                    sessionId: 'SessionID',
                    client: 'clientName',
                    build: 'build',
                    cluster: 'clusterUri',
                    userId: 'userId',
                    isInternalUser: true
                };
            };
            return MockTelemetryHostService;
        })();
        mocks.MockTelemetryHostService = MockTelemetryHostService;
        mocks.MockTelemetryEvent = function (eventName, parentId, category, optionalAttributes) {
            return {
                name: eventName,
                category: category,
                time: Date.now(),
                id: jsCommon.Utility.generateGuid(),
                getFormattedInfoObject: function () {
                    return $.extend({}, {
                        parentId: parentId
                    }, optionalAttributes);
                },
                info: $.extend({}, {
                    parentId: parentId
                }, optionalAttributes)
            };
        };
        function createVisualHostServices() {
            return {
                getLocalizedString: function (stringId) { return stringId; },
                onDragStart: function () {
                },
                canSelect: function () { return true; },
                onSelect: function () {
                },
                loadMoreData: function () {
                },
                persistProperties: function () {
                },
                onCustomSort: function (args) {
                },
                getViewMode: function () { return 0 /* View */; },
                setWarnings: function (warnings) {
                },
                setToolbar: function ($toolbar) {
                },
            };
        }
        mocks.createVisualHostServices = createVisualHostServices;
        function createLocalizationService() {
            return {
                currentLanguageLocale: "",
                getOptional: function (id) { return id; },
                ensureLocalization: function (action) {
                },
                format: function (id) {
                    var args = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args[_i - 1] = arguments[_i];
                    }
                    return id;
                },
                formatValue: function (arg) { return arg; },
            };
        }
        mocks.createLocalizationService = createLocalizationService;
        var MockTraceListener = (function () {
            function MockTraceListener() {
            }
            MockTraceListener.prototype.logTrace = function (trace) {
                this.trace = trace;
            };
            return MockTraceListener;
        })();
        mocks.MockTraceListener = MockTraceListener;
        function dataViewScopeIdentity(fakeValue) {
            var expr = constExpr(fakeValue);
            return powerbi.data.createDataViewScopeIdentity(expr);
        }
        mocks.dataViewScopeIdentity = dataViewScopeIdentity;
        function dataViewScopeIdentityWithEquality(keyExpr, fakeValue) {
            return powerbi.data.createDataViewScopeIdentity(powerbi.data.SQExprBuilder.equal(keyExpr, constExpr(fakeValue)));
        }
        mocks.dataViewScopeIdentityWithEquality = dataViewScopeIdentityWithEquality;
        function constExpr(fakeValue) {
            if (fakeValue === null)
                return SQExprBuilder.nullConstant();
            if (fakeValue === true || fakeValue === false)
                return SQExprBuilder.boolean(fakeValue);
            return (typeof (fakeValue) === 'number') ? powerbi.data.SQExprBuilder.double(fakeValue) : powerbi.data.SQExprBuilder.text(fakeValue);
        }
        var MockVisualWarning = (function () {
            function MockVisualWarning() {
            }
            MockVisualWarning.prototype.getMessages = function (resourceProvider) {
                var details = {
                    message: MockVisualWarning.Message,
                    title: 'key',
                    detail: 'val',
                };
                return details;
            };
            MockVisualWarning.Message = 'Warning';
            return MockVisualWarning;
        })();
        mocks.MockVisualWarning = MockVisualWarning;
        function setLocale(localize) {
            debug.assertValue(localize, 'localize');
            setLocaleOptions(localize);
            setLocalizedStrings(localize);
        }
        mocks.setLocale = setLocale;
        function setLocaleOptions(localize) {
            var valueFormatterLocalizationOptions = createLocaleOptions(localize);
            powerbi.visuals.valueFormatter.setLocaleOptions(valueFormatterLocalizationOptions);
        }
        function setLocalizedStrings(localize) {
            var tooltipLocalizationOptions = createTooltipLocaleOptions(localize);
            powerbi.visuals.TooltipManager.setLocalizedStrings(tooltipLocalizationOptions);
        }
        function createLocaleOptions(localize) {
            return {
                null: localize.get('NullValue'),
                true: localize.get('BooleanTrue'),
                false: localize.get('BooleanFalse'),
                beautify: function (format) { return beautify(localize, format); },
                describe: function (exponent) { return describeUnit(localize, exponent); },
                restatementComma: powerbi.visuals.valueFormatter.getLocalizedString('RestatementComma'),
                restatementCompoundAnd: powerbi.visuals.valueFormatter.getLocalizedString('RestatementCompoundAnd')
            };
        }
        function createTooltipLocaleOptions(localize) {
            return {
                highlightedValueDisplayName: localize.get(powerbi.visuals.ToolTipComponent.highlightedValueDisplayNameResorceKey)
            };
        }
        function beautify(localize, format) {
            if (format) {
                var regEx = RegExp('\\.0* %', 'g');
                format = format.replace(regEx, '.00 %');
            }
            var key = BeautifiedFormat[format];
            if (key)
                return localize.getOptional(key) || format;
            return format;
        }
        function describeUnit(localize, exponent) {
            var title = localize.getOptional("DisplayUnitSystem_E" + exponent + "_Title");
            var format = localize.getOptional("DisplayUnitSystem_E" + exponent + "_LabelFormat");
            if (title || format)
                return { title: title, format: format };
        }
    })(mocks = powerbitests.mocks || (powerbitests.mocks = {}));
})(powerbitests || (powerbitests = {}));
