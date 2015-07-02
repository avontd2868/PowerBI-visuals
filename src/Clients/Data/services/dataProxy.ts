//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data {
    import JsonComparer = jsCommon.JsonComparer;
    import ITimerPromiseFactory = jsCommon.ITimerPromiseFactory;
    import TimerPromiseFactory = jsCommon.TimerPromiseFactory;

    export interface IExecutableDataProxy {
        /** Enqueues a query for execution.  Callers may cancel this execution by rejecting the returned promise. */
        execute(options: DataProxyQueryExecutionOptions): QueryExecutionPromise;
    }

    /** Responsible for running, batching, and query cancellation. */
    export interface IDataProxy extends IExecutableDataProxy {
        stopCommunication(providerType: string): void;
        resumeCommunication(providerType: string): void;
        clearCache(providerType: string): void;
        rewriteCacheEntries(providerType: string, rewriter: data.DataProviderCacheRewriter): void;
    }

    export interface DataProxyQueryExecutionResult {
        dataViewSource?: contracts.DataViewSource;
        dataProviderResult?: DataProviderTransformResult;
        errorFactory?: IClientError;
    }

    export interface QueryExecutionPromise extends RejectablePromise2<DataProxyQueryExecutionResult, IClientError> {
    }

    export interface ISingleExecutionDataProxy extends IExecutableDataProxy{
    }

    export interface DataProxyQueryExecutionOptions {
        type: string;
        query: DataProviderExecutionOptions;
    }

    /** Factory method to create an IDataProxy instance. */
    export function createDataProxy(
        promiseFactory: IPromiseFactory,
        dataProviderFactory: IDataProviderFactory): IDataProxy {
        return new DataProxy(promiseFactory, dataProviderFactory);
    }

    /** Factory interface for creating ISingleExecutionDataProxy. */
    export interface ISingleExecutionDataProxyFactory {
        create(): ISingleExecutionDataProxy;
    }

    /** Factory method to create an ISingleExecutableDataProxy. */
    export function createSingleExecutableDataProxy(
        dataProxy: IDataProxy,
        promiseFactory: IPromiseFactory,
        timerFactory: ITimerPromiseFactory): ISingleExecutionDataProxy {
        return new SingleExecutionDataProxy(dataProxy, promiseFactory, timerFactory);
    }

    interface DataProviderWrappers {
        [type: string]: DataProviderWrapper;
    }

    class DataProxy implements IDataProxy {
        private providerHost: IDataProviderHostServices;
        private dataProviderFactory: IDataProviderFactory;
        private dataProviders: DataProviderWrappers;

        constructor(promiseFactory: IPromiseFactory, dataProviderFactory: IDataProviderFactory) {
            this.providerHost = {
                promiseFactory: () => promiseFactory,
            };
            this.dataProviderFactory = dataProviderFactory;
            this.dataProviders = {};
        }

        public execute(options: DataProxyQueryExecutionOptions): QueryExecutionPromise {
            debug.assertValue(options, 'options');

            var provider = this.getProvider(options.type);
            return provider.execute(options.query);
        }

        private getProvider(type: string): DataProviderWrapper {
            var provider = this.dataProviders[type];
            if (provider)
                return provider;

            var plugin = this.dataProviderFactory.getPlugin(type);
            if (plugin)
                return this.dataProviders[type] = new DataProviderWrapper(plugin, this.providerHost.promiseFactory(), this.providerHost);
        }

        public stopCommunication(providerType: string): void {
            var provider = this.getProvider(providerType);
                provider.stopCommunication();
                
        }

        public resumeCommunication(providerType: string): void {
            var provider = this.getProvider(providerType);
                provider.resumeCommunication();
                
        }

        public clearCache(providerType: string): void {
            var provider = this.getProvider(providerType);
                provider.clearCache();
                
        }

        public rewriteCacheEntries(providerType: string, rewriter: data.DataProviderCacheRewriter): void {
            var provider = this.getProvider(providerType);
            provider.rewriteCacheEntries(rewriter);
        }
    }

    class SingleExecutionDataProxy implements ISingleExecutionDataProxy {
        private proxy: IDataProxy;
        private promiseFactory: IPromiseFactory;
        private timerFactory: ITimerPromiseFactory;
        // data related to the last call to execute function
        private lastExecute: {
            query: DataProxyQueryExecutionOptions;
            deferred: IDeferred2<DataProxyQueryExecutionResult, IClientError>;
            promise: RejectablePromise2<DataProxyQueryExecutionResult, IClientError>;
        };
        private queuedExecution: boolean;

        constructor(proxy: IDataProxy, promiseFactory: IPromiseFactory, timerFactory?: ITimerPromiseFactory) {
            this.proxy = proxy;
            this.promiseFactory = promiseFactory;
            this.timerFactory = timerFactory || TimerPromiseFactory.instance;
        }

        public execute(options: DataProxyQueryExecutionOptions): QueryExecutionPromise {

            var previousExecution = this.lastExecute;
            if (previousExecution && previousExecution.promise.pending()) {
                if (JsonComparer.equals(options, previousExecution.query))
                    return previousExecution.promise;

                // Simply reject this promise with an ignorable error since no message should be shown.
                this.lastExecute.promise.reject(new IgnorableClientError());
            }

            var deferred = this.promiseFactory.defer<DataProxyQueryExecutionResult>();
            var promise = RejectablePromise2<DataProxyQueryExecutionResult, IClientError>(deferred);
            var currentExecution = this.lastExecute = {
                query: options,
                deferred: deferred,
                promise: promise
            };

            if (!this.queuedExecution) {
                this.queuedExecution = true;
                // Delay the completion after a timeout of zero.  This allow currently running JS to complete
                this.timerFactory.create(0).done(() => {
                    this.queuedExecution = false;

                    var execution = this.lastExecute;
                    var proxyPromise = this.proxy.execute(execution.query);
                    proxyPromise.then(
                        result => execution.deferred.resolve(result),
                        reason => execution.deferred.reject(reason));

                    // reject the proxy promise if caller reject the execution promise
                    execution.promise.catch(() => proxyPromise.reject());
                });
            }

            // Clear the last execution after completion.
            promise.finally(() => {
                if (currentExecution === this.lastExecute)
                    this.lastExecute = undefined;
            });

            return promise;
        }
    }

    class DataProviderWrapper {
        private name: string;
        private promiseFactory: IPromiseFactory;
        private provider: IDataProvider;

        constructor(plugin: IDataProviderPlugin, promiseFactory: IPromiseFactory, host: IDataProviderHostServices) {
            debug.assertValue(plugin, 'plugin');
            debug.assertValue(promiseFactory, 'promiseFactory');
            debug.assertValue(host, 'host');

            this.name = plugin.name;
            this.promiseFactory = promiseFactory;
            this.provider = plugin.create(host);
        }

        /**
         * Retrieves data through an IDataProvider.
         * 1) Calls the provider execute method when specified
         * 2) Otherwise, it calls simply converts the argument to the dataView.
         */
        public execute(options: DataProviderExecutionOptions): QueryExecutionPromise {
            debug.assertValue(options, 'options');

            var dataViewDeferred = this.promiseFactory.defer<DataProxyQueryExecutionResult, IClientError>();

            var provider = this.provider;
            if (provider.execute) {
                // (1)
                var providerExecution = provider.execute(options);

                dataViewDeferred.promise.catch(() => providerExecution.reject(new InvalidDataResponseClientError()));

                providerExecution.then(
                    data => {
                        if (data) {
                            var transformed = this.transform(data);

                            if (transformed.error) {
                                dataViewDeferred.reject(transformed.error);
                            }

                            dataViewDeferred.resolve({ dataProviderResult: transformed, dataViewSource: { data: data } });
                        }
                        else {
                            dataViewDeferred.reject(new InvalidDataFormatClientError());
                        }
                    },
                    error => {
                        dataViewDeferred.reject(error);
                });

                var promise = RejectablePromise2<DataProxyQueryExecutionResult, IClientError>(dataViewDeferred);
                // if promise is rejected, reject the provider execution
                promise.catch(error => providerExecution.reject(error || new InvalidDataResponseClientError()));
                return promise;
            }
            else {
                // (2)
                if (options.command)
                    dataViewDeferred.resolve({ dataProviderResult: this.transform(options.command) });
                else
                    dataViewDeferred.reject();
            }

            return RejectablePromise2<DataProxyQueryExecutionResult, IClientError>(dataViewDeferred);
        }

        public stopCommunication(): void {
            var provider = this.provider;
            if(provider.stopCommunication)
                provider.stopCommunication();
        }

        public resumeCommunication(): void {
            var provider = this.provider;
            if(provider.resumeCommunication)
                provider.resumeCommunication();
        }

        public clearCache(): void {
            var provider = this.provider;
            if(provider.clearCache)
                provider.clearCache();
        }

        public rewriteCacheEntries(rewriter: data.DataProviderCacheRewriter): void {
            var provider = this.provider;
            if(provider.rewriteCacheEntries)
                provider.rewriteCacheEntries(rewriter);
        }

        private transform(data: DataProviderData): DataProviderTransformResult {
            var provider = this.provider;
            if (provider.transform)
                return provider.transform(data);

            // When the IDataProvider does not implement its own transform implementation, we will provide one.
            var defaultDataView: DataView = {
                metadata: { columns: [] },
            };
            defaultDataView[this.name] = data;

            return { dataView: defaultDataView };
        }
    }
}