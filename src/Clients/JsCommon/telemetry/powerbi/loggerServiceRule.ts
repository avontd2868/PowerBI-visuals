//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi {
    export interface ILoggerServiceRule {
        shoudLog(event: ITelemetryEvent, loggerServiceId: number): boolean;
    }

    export class SendAllRule implements ILoggerServiceRule {
        public shoudLog(event: ITelemetryEvent, loggerServiceId: number): boolean {
            return true;
        }
    }

    export class SendNothingRule implements ILoggerServiceRule {
        public shoudLog(event: ITelemetryEvent, loggerServiceId: number): boolean {
            return false;
        }
    }

    export class LoggerServiceRule implements ILoggerServiceRule {
        private shouldLogMap: { [index: number]: boolean; };

        constructor(args: { purpose: string; sampleRate: number; }[]) {
            this.shouldLogMap = [];

            for (var i = 0; i < args.length; i++) {
                var arg = args[i];
                var purpose = arg.purpose;
                this.shouldLogMap[purpose] = arg.sampleRate >= (1 - Math.random());
            }
        }

        public shoudLog(event: ITelemetryEvent, loggerType: number): boolean {
            var loggers = event.loggers;
            if (loggers)
                return (loggers & loggerType) === loggerType;

            var use = event.category ? TelemetryCategory[event.category] : TelemetryCategory[TelemetryCategory.Verbose];
            if (this.shouldLogMap[use] !== undefined)
                return this.shouldLogMap[use];

            return false;
        }
    }
}