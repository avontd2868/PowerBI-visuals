//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.telemetry {
    declare var localyticsInstrKey: string;
    declare var telemetrySessionId: string;

    export function createTelemetryHostService(): ITelemetryHostService {
        return new TelemetryHostService(
            powerbi.telemetrySamplingRules,
            powerbi.session.userInfo,
            powerbi.build,
            clusterUri,
            powerbi.telemetryConstants.pbiClientName,
            telemetrySessionId);
    }

    class TelemetryHostService implements ITelemetryHostService {
        private loggers: ILoggerService[];
        private hostData: TelemetryHostData;

        // TODO: make telemetrySamplesRates to be strong typed
        constructor(
            telemetrySamplesRates: any,
            userInfo: powerbi.session.UserInfo,
            build: string,
            cluster: string,
            clientName: string,
            sessionId: string) {

            this.loggers = TelemetryConfigurations.getDefaultLoggingCollection(telemetrySamplesRates);
            this.hostData = {
                sessionId: sessionId || '',
                client: clientName || '',
                build: build || '',
                cluster: cluster || '',
                userId: userInfo && userInfo.puid ? userInfo.puid : '00000000-0000-0000-0000-000000000000',
                isInternalUser: powerbi.session.UserInfoUtils.isInternalUser()
            };
        }

        public getLoggerServices(): ILoggerService[] {
            return this.loggers;
        }

        public getHostData(): TelemetryHostData {
            return this.hostData;
        }
    }

    export class TelemetryConfigurations {
        private static timeBetweenUploadsInMs: number = 250;
        private static timeBeforeBrowserConsideredIdleInMs: number = 1000;

        // For stage3, MSIT, Prod, DXT clusters, the configuration would come from server instead of hardcoded values here.
        private static LocalyticsStandardLoggerConfig = [
            { purpose: 'CriticalError', sampleRate: 1 },
            { purpose: 'CustomerAction', sampleRate: 1 },
            { purpose: 'Verbose', sampleRate: 0 },
            { purpose: 'Trace', sampleRate: 0 }
        ];

        private static AppInsightStandardLoggerConfig = [
            { purpose: 'CriticalError', sampleRate: 1 },
            { purpose: 'CustomerAction', sampleRate: 1 },
            { purpose: 'Verbose', sampleRate: 1 },
            { purpose: 'Trace', sampleRate: 0 }
        ];

        private static EtwStandardLoggerConfig = [
            { purpose: 'CriticalError', sampleRate: 1 },
            { purpose: 'CustomerAction', sampleRate: 1 },
            { purpose: 'Verbose', sampleRate: 1 },
            { purpose: 'Trace', sampleRate: 0 }
        ];

        public static getDefaultLoggingCollection(telemetrySamplingRates: any): Array<ILoggerService> {
            if (telemetrySamplingRates === 'standard')
                return TelemetryConfigurations.getStandardCollectionRules();
            else if (telemetrySamplingRates === 'none')
                return TelemetryConfigurations.getLogNothingCollectionRules();
            else
                return TelemetryConfigurations.getLoggingCollection(telemetrySamplingRates);
            }

        public static getLoggingCollection(telemetrySamplingRates: any): Array<ILoggerService> {
            var loggingServices: Array<ILoggerService> = new Array<ILoggerService>();
            var lKey = (typeof (localyticsInstrKey) !== 'undefined') ? localyticsInstrKey : '';

            var idleTimer = new IdleCallbackTimer(TelemetryConfigurations.timeBeforeBrowserConsideredIdleInMs, TelemetryConfigurations.timeBetweenUploadsInMs);
            if (telemetrySamplingRates) {
                if (telemetrySamplingRates.perf)
                    loggingServices.push(this.wrapLogger(telemetrySamplingRates.perf, new AutoEndingWrapper(new EtwPerfLoggerService())));
                if (telemetrySamplingRates.appInsights) {
                    loggingServices.push(this.wrapLogger(telemetrySamplingRates.appInsights, new AppInsightsV2Service(appInsights)));
                }
                if (telemetrySamplingRates.localytics)
                    loggingServices.push(this.wrapLogger(telemetrySamplingRates.localytics, new LocalyticsService(lKey, idleTimer)));
            }

            return loggingServices;
        }

        public static getStandardCollectionRules(): Array<ILoggerService> {
            var loggingServices: Array<ILoggerService> = new Array<ILoggerService>();
            var lKey = (typeof (localyticsInstrKey) !== 'undefined') ? localyticsInstrKey : '';

            var idleTimer = new IdleCallbackTimer(TelemetryConfigurations.timeBeforeBrowserConsideredIdleInMs, TelemetryConfigurations.timeBetweenUploadsInMs);
            loggingServices.push(
                this.wrapLogger(
                    TelemetryConfigurations.EtwStandardLoggerConfig,
                    new AutoEndingWrapper(new EtwPerfLoggerService())));

            loggingServices.push(
                this.wrapLogger(
                    TelemetryConfigurations.AppInsightStandardLoggerConfig,
                    new AppInsightsV2Service(appInsights)));

            loggingServices.push(
                this.wrapLogger(
                    TelemetryConfigurations.LocalyticsStandardLoggerConfig,
                    new LocalyticsService(lKey || "", idleTimer)));

            return loggingServices;
        }

        public static getLogNothingCollectionRules(): Array<ILoggerService> {
            var loggingServices: Array<ILoggerService> = new Array<ILoggerService>();
            return loggingServices;
        }

        private static wrapLogger(samplingRates: any, service: ILoggerService): ILoggerService {
            var transmissionRule = samplingRates ? new LoggerServiceRule(samplingRates) : new SendNothingRule();
            var transmissionControllerLoggingService = new LoggerServiceWrapper(service, transmissionRule);
            return transmissionControllerLoggingService;
        }
    }
}