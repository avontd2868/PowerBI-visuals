//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi {
    // TODO: Deferred is deprecated, we should use IDeferred instead.

    /** Instantiates a Deferred object. */
    export function Deferred<T>(): Deferred<T> {
        return new DeferredImpl<T>();
    }

    /** Instantiates a RejectablePromise that wraps the given Deferred object. */
    export function RejectablePromise<T>(deferred: IDeferred<T>): RejectablePromise<T> {
        return new RejectablePromiseImpl(deferred);
    }

    class DeferredImpl<T> implements Deferred<T> {
        private successHandlers: Array<IResultCallback<T>>;
        private errorHandlers: Array<IResultCallback<T>>;
        private resultCallbacks: Array<(result: T, done: boolean) => void>;
        private results: Array<T>;
        private dones: Array<boolean>;

        constructor() {
            this.successHandlers = [];
            this.errorHandlers = [];
        }

        public success(callback: IResultCallback<T>): Promise<T> {
            this.successHandlers.push(callback);
            if (this.results) {
                for (var i = 0, len = this.results.length; i < len; i++) {
                    if (this.resultCallbacks[i] === this.resolve)
                        callback(this.results[i], this.dones[i]);
                }
            }

            return this;
        }

        public error(callback: IResultCallback<T>): Promise<T> {
            this.errorHandlers.push(callback);
            if (this.results) {
                for (var i = 0, len = this.results.length; i < len; i++) {
                    if (this.resultCallbacks[i] === this.reject)
                        callback(this.results[i], this.dones[i]);
                }
            }

            return this;
        }

        public resolve(result: T, done: boolean = true): Deferred<T> {
            if (!this.results) {
                this.resultCallbacks = [this.resolve];
                this.results = [result];
                this.dones = [done];
            }
            else {
                this.resultCallbacks.push(this.resolve);
                this.results.push(result);
                this.dones.push(done);
            }

            for (var i = 0, len = this.successHandlers.length; i < len; i++) {
                this.successHandlers[i](result, done);
            }

            return this;
        }

        public reject(result?: T, done?: boolean): Deferred<T> {
            if (done === undefined)
                done = true;

            if (!this.results) {
                this.resultCallbacks = [this.reject];
                this.results = [result];
                this.dones = [done];
            }
            else {
                this.resultCallbacks.push(this.reject);
                this.results.push(result);
                this.dones.push(done);
            }

            for (var i = 0, len = this.errorHandlers.length; i < len; i++) {
                this.errorHandlers[i](result, done);
            }

            return this;
        }
    }

    class RejectablePromiseImpl<T> implements RejectablePromise<T> {
        private isRejected: boolean;
        private isResolved: boolean;
        private deferred: IDeferred<T>;

        constructor(deferred: IDeferred<T>) {
            debug.assertValue(deferred, 'deferred');

            this.deferred = deferred;

            deferred.promise.then(() => this.isResolved = true);
        }

        public then(successCallback, errorCallback): IPromise<T> {
            return this.deferred.promise.then(successCallback, errorCallback);
        }

        public catch(callback): IPromise<T> {
            return this.deferred.promise.catch(callback);
        }

        public finally(callback): IPromise<T> {
            return this.deferred.promise.finally(callback);
        }

        public resolved(): boolean {
            return this.isResolved;
        }

        public rejected(): boolean {
            return this.isRejected;
        }

        public reject(): void {
            if (this.isRejected)
                return;

            this.isRejected = true;
            this.deferred.reject(null);
        }
    }
}