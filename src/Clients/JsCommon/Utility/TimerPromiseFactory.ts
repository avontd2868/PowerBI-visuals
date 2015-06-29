//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module jsCommon {

    export interface ITimerPromiseFactory {
        /** Returns a promise that will be resolved after the specified delayInMs. */
        create(delayInMs: number): IRejectablePromise;
    }

    /** Responsible for creating timer promises. */
    export class TimerPromiseFactory implements ITimerPromiseFactory {
        public static instance = new TimerPromiseFactory();

        public create(delayInMs: number): IRejectablePromise {
            debug.assertValue(delayInMs, 'delayInMs');
            debug.assert(delayInMs >= 0, 'delayInMs must be a positive value.');

            var deferred = $.Deferred<void>();

            window.setTimeout(
                () => deferred.resolve(),
                delayInMs);

            return deferred;
        }
    }
}