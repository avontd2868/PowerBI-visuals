//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module jsCommon {
    export class TraceItem {
        public type: TraceType;
        public sessionId: string;
        public requestId: string;
        public text: string;
        public timeStamp: Date;

        /** DO NOT USE for backward compability only */
        public _activityId: string;

        private static traceTypeStrings: string[] = [
            'INFORMATION',
            'VERBOSE',
            'WARNING',
            'ERROR',
            'EXPECTEDERROR',
            'UNEXPECTEDERROR',
            'FATAL',
        ];

        constructor(text: string, type: TraceType, sessionId: string, requestId?: string) {
            this.text = text;
            this.type = type;
            this.sessionId = sessionId;
            this.requestId = requestId;
            this.timeStamp = new Date();
        }

        public toString(): string {
            var sb = new StringBuilder();

            sb.append(StringExtensions.format(
                '{0} ({1}): {2}',
                TraceItem.traceTypeStrings[this.type],
                this.timeStamp.toUTCString(),
                this.text));

            if (this.requestId)
                sb.append('\n(Request id: ' + this.requestId + ')');

            return sb.toString();
        }
    }
} 