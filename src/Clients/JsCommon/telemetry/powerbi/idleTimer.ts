//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

/* tslint:disable:no-unused-variable */
module powerbi {

    export interface ITimer {
        setTimeout(callback: any, period: number, arg: any): any;
        setInterval(callback: any, period: number, arg: any): any;
        clearTimeout(id: any): void;
        clearInterval(id: any): void;
    }

    export class DefaultTimer implements ITimer {
        public setTimeout(callback: any, period: number, arg: any): any {
            return setTimeout(callback, period, arg);
        }

        public setInterval(callback: any, period: number, arg: any): any {
            return setInterval(callback, period, arg);
        }

        public clearTimeout(id: any): void {
            clearTimeout(id);
        }

        public clearInterval(id: any): void {
            clearInterval(id);
        }
    }

    export interface IIdleCallbackTimer {
        addCallback(fn: () => void);
        removeCallback(fn: () => void);
    }

    export class IdleCallbackTimer implements IIdleCallbackTimer {
        private pollingDelay: number;
        private callbackDelay: number;

        public callbacks: any[] = [];

        private timer: ITimer;
        private isIdle: boolean = false;
        private idleTimer: any;
        private startedIdle: any;

        private callbackTimer: any;

        public constructor(pollingDelay: number, callbackDelay: number, timer?: ITimer) {
            var self = this;
            this.timer = timer !== undefined ? timer : new DefaultTimer();

            this.pollingDelay = pollingDelay;
            this.callbackDelay = callbackDelay;

            var doc = $(document);
            doc.on('click', null, self, this.somethingJustHappenedCallback);
            doc.on('dblclick', null, self, this.somethingJustHappenedCallback);
            doc.on('input', null, self, this.somethingJustHappenedCallback);
            doc.on('keydown', null, self, this.somethingJustHappenedCallback);
            doc.on('mouseenter', null, self, this.somethingJustHappenedCallback);
            doc.on('mousemove', null, self, this.somethingJustHappenedCallback);
            doc.on('scroll', null, self, this.somethingJustHappenedCallback);

            // Trigger timers
            this.somethingJustHappened(self);
        }

        private somethingJustHappenedCallback(event: any) {
            event.data.somethingJustHappened(event.data);
        }

        private somethingJustHappened(self) {
            var timeStamp = new Date().getTime();
            self.startedIdle = timeStamp;

            self.timer.clearTimeout(self.idleTimer);
            self.timer.clearInterval(self.callbackTimer);

            self.idleTimer = self.timer.setTimeout(self.idleTimerCallback, self.pollingDelay, self);
        }

        private idleTimerCallback(self) {
            self.callback(self);
            self.callbackTimer = self.timer.setInterval(self.callback, self.callbackDelay, self);
        }

        public addCallback(fn: () => void) {
            this.removeCallback(fn);
            this.callbacks.push(fn);
        }

        public removeCallback(fn: () => void) {
            for (var i = this.callbacks.length - 1; i >= 0; i--) {
                if (this.callbacks[i] === fn) {
                    this.callbacks.splice(i, 1);
                }
            }
        }

        private callback(self) {
            for (var i = 0; i < self.callbacks.length; i++) {
                self.callbacks[i]();
            }
        }
    }
}