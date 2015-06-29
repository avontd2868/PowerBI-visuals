//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

/** Defines the Application Insights V2 interface */
interface IAppInsightsV2 {
    trackPageView? (): void;
    trackEvent? (activityName: string, additionalData: any);
    trackTrace? (message: string, additionalData: any);
}

var appInsights: IAppInsightsV2;
declare var isTelemetryDisabled;
declare var appInsightsV2InstrKey: string;

appInsights = appInsights || {
    trackPageView(): void { },
    trackEvent(activityName: string, additionalData: any) { },
    trackTrace(message: string, additionalData: any) { },
};

module powerbi {
    export class AppInsightsV2Service implements ILoggerService {
        private appInsightsV2Service: IAppInsightsV2;
        private hostData: TelemetryHostData = null;

        constructor(appInsightsV2Service: IAppInsightsV2) {
            this.appInsightsV2Service = appInsightsV2Service;

            this.appInsightsV2Service.trackPageView();
        }

        public initialize(hostData: TelemetryHostData): void {
            debug.assert(!!hostData, 'AppInsightsV2Service initialize parameter hostData must be specified');
            this.hostData = hostData;
        }

        public getType(): number {
            return LoggerServiceType.AppInsightDeprecated;
        }

        private getCategoryOfEvent(eventData: ITelemetryEvent): string {
            // 'category' may be null - in that case default category to verbose
            var category = eventData.category ? eventData.category : TelemetryCategory.Verbose;
            return TelemetryCategory[category];
        }

        /** Log telemetry event **/
        public logEvent(eventData: ITelemetryEvent): void {
            if (eventData.category === TelemetryCategory.Trace) {
                this.trackTraceInternal(eventData.getFormattedInfoObject(), this.hostData);
            }
            else {
            var properties = $.extend({}, this.hostData, eventData.getFormattedInfoObject(), {
                id: eventData.id,
                start: (new Date(eventData.time)).toISOString(),
                // 'category' is used in the data pipeline to identify what is a customer action and what isn't
                category: this.getCategoryOfEvent(eventData)
            });

            this.trackEventInternal(eventData.name, properties);
        }
        }

        /** Starts recording a timed event **/
        public startTimedEvent(eventData: ITelemetryEvent): void { }

        /** Log a timed event **/
        public endTimedEvent(eventData: ITelemetryEvent): void {
            var properties = $.extend({}, this.hostData, eventData.getFormattedInfoObject(), {
                id: eventData.id,
                start: (new Date(eventData.time)).toISOString(),
                end: (new Date()).toISOString(),
                // 'category' is used in the data pipeline to identify what is a customer action and what isn't
                category: this.getCategoryOfEvent(eventData)
            });

            this.trackEventInternal(eventData.name, properties);
        }

        private trackEventInternal(activityName: string, properties: any): void {
            try {
                this.appInsightsV2Service.trackEvent(activityName, properties);
            } catch (e) {
                console.log("AppInsights V2 throws an except.");

                // there is a bug in AI V2 code, swallow any exception thrown from AI V2 code for now except for debug mode
                // To disable AI V2 for debugging, you can remove value for ida_AppInsightsV2InstrKey in web.config
                debug.assertFail("AppInsights V2 trackEvent throw an except: " + e);
            }
        }

        private trackTraceInternal(message: string, properties: any): void {
            try {
                this.appInsightsV2Service.trackTrace(message, properties);
            } catch (e) {
                console.log("AppInsights V2 throws an except when tracking trace.");
            }
        }
    }

    export function loadAppInsightsV2() {
        if (typeof isTelemetryDisabled !== 'undefined' && isTelemetryDisabled)
            return;

        if (typeof (appInsightsV2InstrKey) === 'undefined')
            return;

        var aiKey = (typeof (appInsightsV2InstrKey) !== 'undefined') ? appInsightsV2InstrKey : '';

        // Code provided by application insights. 
        // Has been converted to type script for better readability.

        appInsights = (function (aiConfig) {

            var appInsights: any = {
                config: aiConfig
            };

            // Assigning these to local variables allows them to be minified to save space:
            var localDocument = document;
            var localWindow = window;
            var scriptText = "script";
            var scriptElement: any = localDocument.createElement(scriptText);
            scriptElement.src = aiConfig.url || "//az416426.vo.msecnd.net/scripts/a/ai.0.js";
            localDocument.getElementsByTagName(scriptText)[0].parentNode.appendChild(scriptElement);

            // capture initial cookie
            appInsights.cookie = localDocument.cookie;

            appInsights.queue = [];

            function createLazyMethod(name) {
                // Define a temporary method that queues-up a the real method call
                appInsights[name] = function () {
                    // Capture the original arguments passed to the method
                    var originalArguments = arguments;
                    // Queue-up a call to the real method
                    appInsights.queue.push(function () {
                        // Invoke the real method with the captured original arguments
                        appInsights[name].apply(appInsights, originalArguments);
                    });
                };
            };

            var methods = ["Event", "Exception", "Metric", "PageView", "Trace"];
            while (methods.length) {
                createLazyMethod("track" + methods.pop());
            }

            // collect global errors
            if (!aiConfig.disableExceptionTracking) {
                var method = "onerror";
                createLazyMethod("_" + method);
                var originalOnError = localWindow[method];
                localWindow[method] = function (message, url, lineNumber, columnNumber, error) {
                    var handled = originalOnError && originalOnError(message, url, lineNumber, columnNumber, error);
                    if (handled !== true) {
                        appInsights["_" + method](message, url, lineNumber, columnNumber, error);
                    }

                    return handled;
                };
            }

            return appInsights;
        })({
            instrumentationKey: aiKey
        });
    }

    loadAppInsightsV2();
}
