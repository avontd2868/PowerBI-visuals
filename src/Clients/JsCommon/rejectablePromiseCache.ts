module powerbi {
    /** Entry in the query cache which contains a promise and reference count to the entry */
    interface RejectablePromiseCacheEntry<T> {
        /** Promise resolving to the query results */
        promise?: RejectablePromise<T>;
        /** Count of references to this entry */
        refCount: number;
        /** cached result if promise resolves */
        result?: T;
        /** modify result prior to setting results */
        updateResult? (result: T): T;
    }

    /** A structure containing a RejectablePromise and its associated deferred */
    export interface RejectablePromiseWithDeferred<T> {
        deferred: IDeferred<T>;
        promise: RejectablePromise<T>;
    }

    export interface IRejectablePromiseCacheRewiter<T> {
        rewriteKey?(key: string): string;
        rewriteResult?(result: T, key: string): T;
    }

    /**
     * @class
     * A cache of Rejectable Promises
     */
    export class RejectablePromiseCache<T> {
        /**
         * Maximum number of entries in the cache
         * Cache is cleared entirely once it reaches this limit
         */
        private static maxCacheEntries = 100;

        /** promise factory used to create promises */
        private promiseFactory: IPromiseFactory;

        /**
         * Query cache
         * This cache doesn't have a entry expiry time
         * Rejected promises will not be cached
         */
        private cache: {
            [key: string]: RejectablePromiseCacheEntry<T>
        }

        /**
         * Constructor of RejectablePromiseCache
         * @param {IPromiseFactory} promiseFactory - factory used to create promises
         */
        constructor(promiseFactory: IPromiseFactory) {
            this.cache = {};
            this.promiseFactory = promiseFactory;
        }

        /**
         * Returns the number of entries in the cache
         */
        public getEntryCount():number {
            return Object.keys(this.cache).length;
        }

        /** 
         * Indicates if there is an entry in the cache for the provided key
         * @param {string} cacheKey - Identifier of the cache entry
         */
        public hasCacheEntry(cacheKey: string): boolean {
            debug.assertValue(cacheKey, 'cacheKey');

            return !!this.getCacheEntry(cacheKey);
        }

        /**
         * Creates a cache entry associated with the provided key. If the key is already
         * pointing to a cache entry, 'undefined' is returned.
         * @param {string} cacheKey - Identifier of the cache entry
         */
        public createCacheEntry(cacheKey: string): RejectablePromiseWithDeferred<T> {
            debug.assertValue(cacheKey, 'cacheKey');

            var cacheEntry: RejectablePromiseCacheEntry<T> = this.getCacheEntry(cacheKey);
            // if cacheKey is undefined/empty string or there is a cache entry, return undefined
            if (!cacheKey || cacheEntry)
                return;
            // clear cache if it reaches max
            // do not delete them (values) as they may be pending and referenced by other objects
            if (this.getEntryCount() > RejectablePromiseCache.maxCacheEntries)
                this.cache = {};

            var promiseFactory = this.promiseFactory;
            var queryCache = this.cache;
            var deferred: IDeferred<T> = promiseFactory.defer<T>();
            var promise: RejectablePromise<T> = RejectablePromise<T>(deferred);
            var entryDeferred: IDeferred<T> = promiseFactory.defer<T>();
            var entryPromise: RejectablePromise<T> = RejectablePromise<T>(entryDeferred);
            cacheEntry = queryCache[cacheKey] = {
                promise: entryPromise,
                refCount: 0
            };
            promise.then((result: T) => {
                if (cacheEntry.updateResult)
                    result = cacheEntry.updateResult(result);
                cacheEntry.result = result;
                entryDeferred.resolve(result);
            },
                (reason?: T) => entryDeferred.reject(reason)).
                finally(() => {
                    delete cacheEntry.updateResult;
            });
            entryPromise.catch((reason?: T) => promise.reject());
            entryPromise.finally(() => {
                if (queryCache[cacheKey]) {
                    delete queryCache[cacheKey].promise;
                    // if promise is rejected, delete the cache entry to allow for future re-execution of the same query
                    if (entryPromise.rejected())
                        delete queryCache[cacheKey];
                }
            });
            return { deferred: deferred, promise: promise };
        }

        /**
         * clears the cache from the entry associated with the provided cache key
         * @param {string} cacheKey - Identifier of the cache entry
         * @param {boolean} rejectPromise - indicates of the promise should be reject. Promise is reject only if it is pending
         */
        public clearEntry(cacheKey: string, rejectPromise?: boolean): boolean {
            var cacheEntry: RejectablePromiseCacheEntry<T> = this.getCacheEntry(cacheKey);
            if (cacheEntry) {
                var cachePromise = cacheEntry.promise;
                if (rejectPromise && cachePromise) {
                    // It is sufficient to just reject the promise since
                    // reject will finally delete the cache as well (see implementation of createCacheEntry)
                    cachePromise.reject();
                } else {
                    delete this.cache[cacheKey];
                }
                return true;
            }
            return false;
        }

        /**
         * clears the cache from the entry associated with the provided cache key
         * @param {boolean} rejectPromise - indicates of promises should be reject. A Promise is reject only if it is pending
         */
        public clearAllEntries(rejectPromise?: boolean): void {
            for (var cacheKey in this.cache) {
                this.clearEntry(cacheKey, rejectPromise);
            }
        }

        /**
         * Bind a new promise to cached query results and returns the promise. Once results are available deferred is resolved
         * @param {string} cacheKey - Identifier of the cache entry
         */
        public bindCacheEntry(cacheKey: string): RejectablePromise<T> {
            debug.assertValue(cacheKey, 'cacheKey');

            var cacheEntry: RejectablePromiseCacheEntry<T> = this.getCacheEntry(cacheKey);
            // if there is no cache entry for this key, return
            if (cacheEntry === undefined)
                return;

            var deferred: IDeferred<T> = this.promiseFactory.defer<T>();
            var promise: RejectablePromise<T> = RejectablePromise<T>(deferred);

            if (cacheEntry.result) {
                deferred.resolve(cacheEntry.result);
                return promise;
            }

            var cachePromise = cacheEntry.promise;
            if (!cachePromise) {
                deferred.reject(null);
                return promise;
            }
            cacheEntry.refCount++;
            // once promise is complete, decrement the reference county
            promise.finally(() => {
                cacheEntry.refCount--;
                // if cache promise is pending and there is no one references it, it is no longer needed so reject it
                if (cacheEntry.refCount === 0 && cachePromise.pending())
                    cachePromise.reject();
            });
            // bind cache to deferred
            // once cached promise is resolved, if it is rejected, remove it from cache
            cachePromise.then(
                result => deferred.resolve(result),
                errorReason => deferred.reject(errorReason));
            return promise;
        }

        /**
         * Enumerates over cache entries and passes each to the rewriter
         * @param {IRejectablePromiseCacheRewiter} rewriter - rewriter of cache key
         * rewriter may indicate that rewrite is completed.
         */
        public rewriteAllEntries(rewriter: IRejectablePromiseCacheRewiter<T>): void {
            var keyUpdates: Array<{ oldKey: string; newKey: string }> = [];
            var hasRewriteKey = !!rewriter.rewriteKey;
            var hasRewriteResult = !!rewriter.rewriteResult;
            var queryCache = this.cache;

            for (var cacheKey in queryCache) {
                if (hasRewriteKey) {
                    var newKey = rewriter.rewriteKey(cacheKey);
                    if (newKey !== cacheKey)
                        keyUpdates.push({ oldKey: cacheKey, newKey: newKey });
                }

                if (hasRewriteResult) {
                    var entry = queryCache[cacheKey];
                    if (entry && entry.result) {
                        entry.result = rewriter.rewriteResult(entry.result, cacheKey);
                    } else {
                        entry.updateResult = (result: T) => { return rewriter.rewriteResult(result, cacheKey); };
                    }
                }
            }

            for (var i = 0, length = keyUpdates.length; i < length; i++)
                this.changeCacheKey(keyUpdates[i].oldKey, keyUpdates[i].newKey);
        }

        /**
         * Change cache Key (rekey). It will check for collision before changing the key
         * If rekey is successful, this function will return true, otherwise it will return false
         */
        private changeCacheKey(oldKey: string, newKey: string): boolean {
            //delete cache if newkey is undefined/null/emptystring
            if (!newKey) {
                return this.clearEntry(oldKey, true /*reject promise*/);
            }

            // avoid collision
            // avoid changes where oldkey is invalid
            if (this.hasCacheEntry(newKey) || !this.hasCacheEntry(oldKey))
                return false;

            var cacheEntry = this.getCacheEntry(oldKey);
            delete this.cache[oldKey];
            this.cache[newKey] = cacheEntry;
            return true;
        }

        /**
         * Gets cache entry associated with the provided key
         * @param {string} cacheKey - Identifier of the cache entry
         */
        private getCacheEntry(cacheKey: string): RejectablePromiseCacheEntry<T> {
            debug.assertValue(cacheKey, 'cacheKey');
            var entry: RejectablePromiseCacheEntry<T>;
            if (!!cacheKey &&
                (entry = this.cache[cacheKey]) &&
                (entry.promise || entry.result)) {
                return entry;
            }
            return;
        }
    }
}