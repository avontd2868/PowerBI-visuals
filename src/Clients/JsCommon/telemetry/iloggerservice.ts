//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>  
//-----------------------------------------------------------------------

module powerbi {
    /** Interface for logger service */
    export interface ILoggerService {
        /** Starts the logger and create a session. Must be called before logging events. */
        startSession(userId: string, isInternalUser: boolean, sessionId: string): void;

        /** Log telemetry event **/
        log(systemData: ISystemData, domainData: IDomainData, eventData: ITelemetryEvent): void;

        /** Starts receording a timed event **/
        startTimedEvent(systemData: ISystemData, domainData: IDomainData, eventData: ITelemetryEvent): void;

        /** Log a timed event **/
        endTimedEvent(systemData: ISystemData, domainData: IDomainData, eventData: ITelemetryEvent): void;

        /** Returns true if the logger is applicable to the current context. False, otherwise. */
        isApplicable(): boolean;
    }

    export class TransmissionController implements ILoggerService {
        private transmissionRules: ITransmissionRule[];
        private loggerService: ILoggerService;

        constructor(loggerService: ILoggerService, ...args: ITransmissionRule[]) {
            this.loggerService = loggerService;
            this.transmissionRules = args;
        }

        public startSession(userId: string, isInternalUser: boolean, sessionId: string): void {
            this.loggerService.startSession(userId, isInternalUser, sessionId);
        }

        private shouldLog(event: ITelemetryEvent): boolean {
            for (var i = 0; i < this.transmissionRules.length; i++) {
                if (this.transmissionRules[i].isOkToSend(event))
                    return true;
            }
            return false;
        }

        /** Log telemetry event **/
        public log(systemData: ISystemData, domainData: IDomainData, eventData: ITelemetryEvent): void {
            if (this.shouldLog(eventData)) {
                this.loggerService.log(systemData, domainData, eventData);
            }
        }

        /** Starts receording a timed event **/
        public startTimedEvent(systemData: ISystemData, domainData: IDomainData, eventData: ITelemetryEvent): void {
            this.loggerService.startTimedEvent(systemData, domainData, eventData);
        }

        /** Log a timed event **/
        public endTimedEvent(systemData: ISystemData, domainData: IDomainData, eventData: ITelemetryEvent): void {
            if (this.shouldLog(eventData)) {
                this.loggerService.endTimedEvent(systemData, domainData, eventData);
            }
        }

        /** Returns true if the logger is applicable to the current context. False, otherwise. */
        public isApplicable(): boolean {
            return this.loggerService.isApplicable();
        }
    }
}
