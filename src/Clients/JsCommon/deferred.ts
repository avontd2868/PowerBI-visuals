/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved. 
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *   
 *  The above copyright notice and this permission notice shall be included in 
 *  all copies or substantial portions of the Software.
 *   
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

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