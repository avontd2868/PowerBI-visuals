//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi {
    export function createJQueryPromiseFactory(): IPromiseFactory {
        return new JQueryPromiseFactory();
    }

    /**
     * jQuery-based implementation of IPromiseFactory.
     * This is useful for cases when Angular is not present, or when immediate promise resolving (not tied to Angular digest cycle) is desired.
     */
    class JQueryPromiseFactory implements IPromiseFactory {
        public defer<TSuccess, TError>(): IDeferred2<TSuccess, TError> {
            return new JQueryDeferredWrapper($.Deferred());
        }

        public reject<TError>(reason?: TError): IPromise2<any, TError> {
            var deferred = this.defer();
            deferred.reject(reason);
            return deferred.promise;
        }

        public resolve<TSuccess>(value: TSuccess): IPromise2<TSuccess, any> {
            var deferred = this.defer();
            deferred.resolve(value);
            return deferred.promise;
        }
    }

    /** Implements IDeferred via a wrapped a jQuery Deferred. */
    class JQueryDeferredWrapper<TSuccess, TError> implements IDeferred2<TSuccess, TError> {
        public promise: IPromise2<TSuccess, TError>;
        private deferred: JQueryDeferred<any>;

        constructor(deferred: JQueryDeferred<any>) {
            debug.assertValue(deferred, 'deferred');

            this.deferred = deferred;
            this.promise = new JQueryPromiseWrapper(deferred.promise());
        }

        public resolve(value: TSuccess| IPromise<any>): void {
            this.deferred.resolve(value);
        }

        public reject(reason?: TError): void {
            this.deferred.reject(reason);
        }
    }

    /** Implements IDeferred via a wrapped a jQuery Promise. */
    class JQueryPromiseWrapper<TSuccess, TError> implements IPromise2<TSuccess, TError> {
        private promise: JQueryPromise<any>;

        constructor(promise: JQueryPromise<any>) {
            debug.assertValue(promise, 'promise');

            this.promise = promise;
        }

        public then(a: (arg: any) => any, b: (arg: any) => any): IPromise2<any, any> {
            return new JQueryPromiseWrapper(
                this.promise.then(
                    JQueryPromiseWrapper.wrapCallback(a),
                    JQueryPromiseWrapper.wrapCallback(b)));
        }

        public catch(callback): IPromise2<any, any> {
            return this.then(null, callback);
        }

        public finally(callback): IPromise2<any, any> {
            this.promise.always(
                JQueryPromiseWrapper.wrapCallback(callback));
            return this;
        }

        /** Wraps a callback, which may return a IPromise. */
        private static wrapCallback(callback: (arg: any) => any): (arg: any) => any {
            if (callback)
                return arg => {
                    var value = callback(arg);

                    // If the callback returns a Promise, unwrap that to allow jQuery to chain.
                    if (value instanceof JQueryPromiseWrapper)
                        return (<JQueryPromiseWrapper<any, any>>value).promise;

                    return value;
                };

            return callback;
        }
    }
}
 