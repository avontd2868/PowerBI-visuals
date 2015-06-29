//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>  
//-----------------------------------------------------------------------

module powerbi {
    export class LoggerServiceWrapper implements ILoggerService {
        private rule: ILoggerServiceRule;
        private loggerService: ILoggerService;

        constructor(loggerService: ILoggerService, rule: ILoggerServiceRule) {
            this.loggerService = loggerService;
            this.rule = rule;
        }

        public initialize(hostData: TelemetryHostData): void {
            this.loggerService.initialize(hostData);
        }

        public getType(): number {
            return this.loggerService.getType();
        }

        private shouldLog(event: ITelemetryEvent): boolean {
            if (this.rule.shoudLog(event, this.getType()))
                    return true;

            return false;
        }

        /** Log telemetry event **/
        public logEvent(eventData: ITelemetryEvent): void {
            if (this.shouldLog(eventData))
                this.loggerService.logEvent(eventData);
        }

        /** Starts receording a timed event **/
        public startTimedEvent(eventData: ITelemetryEvent): void {
            this.loggerService.startTimedEvent(eventData);
        }

        /** Log a timed event **/
        public endTimedEvent(eventData: ITelemetryEvent): void {
            if (this.shouldLog(eventData))
                this.loggerService.endTimedEvent(eventData);
        }
    }
}
