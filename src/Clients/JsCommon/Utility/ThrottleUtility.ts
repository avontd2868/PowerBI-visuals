//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module jsCommon {
     /** Responsible for throttling input function. */
    export class ThrottleUtility {
        private fn: () => void;
        private timerFactory: ITimerPromiseFactory;
        private delay: number;

        constructor(delay?: number) {
            this.timerFactory = TimerPromiseFactory.instance;
            this.delay = 0;
            if (delay) {
                this.delay = delay;
            }
        }

        public run(fn: () => void): void {
            if (!this.fn) {
                this.fn = fn;
                this.timerFactory.create(this.delay).done(() => this.timerComplete(this.fn));
            } else {
                this.fn = fn;
            }
        }

        // public for testing purpose
        public timerComplete(fn: () => void) {
            // run fn
            fn();
            
            // clear fn
            this.fn = null;
        }
    }
}