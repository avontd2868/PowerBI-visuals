//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi {
    export class EtwPerfLoggerService implements ILoggerService {
        private hostData: TelemetryHostData;

        public initialize(hostData: TelemetryHostData): void {
            this.hostData = hostData;
        }

        public getType(): number {
            return LoggerServiceType.Etw;
        }

        /** Log telemetry event **/
        public logEvent(eventData: ITelemetryEvent): void {}

        /** Starts receording a timed event **/
        public startTimedEvent(eventData: ITelemetryEvent): void {
            // Check if msWriteProfilerMark is available and then raise the event
            // It is available only for IE and not for other browsers
            // Same is true for the end activity
            if (this.isProfilerAvailable()) {
                var eventToLog: any = eventData;

                var parentId: string = eventToLog.info.parentId ? eventToLog.info.parentId : '';

                var message = eventData.name + "_A:" +
                    eventData.id + "_P:" +
                    parentId + "_C:" +
                    this.hostData.sessionId + ":Begin";
                window.msWriteProfilerMark(message);
            }
        }

        /** Log a timed event **/
        public endTimedEvent(eventData: ITelemetryEvent): void  {
            if (this.isProfilerAvailable()) {
                var eventToLog: any = eventData;

                var parentId: string = eventToLog.info.parentId ? eventToLog.info.parentId : '';

                var message = eventData.name + "_A:" +
                    eventData.id + "_P:" +
                    parentId + "_C:" +
                    this.hostData.sessionId + ":End";
                window.msWriteProfilerMark(message);
            }
        }

        private isProfilerAvailable(): boolean {
            return window.msWriteProfilerMark != null;
        }
    }
}
