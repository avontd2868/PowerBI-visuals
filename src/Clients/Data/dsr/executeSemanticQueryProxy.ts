//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data.dsr {
    import ITimerPromiseFactory = jsCommon.ITimerPromiseFactory;
    import SemanticQueryDataShapeCommand = data.SemanticQueryDataShapeCommand;

    export interface ExecuteSemanticQueryDataSource {
        schemaName: string;
        securityToken?: string;
        vsName?: string;
        dbName?: string;
        modelId?: number;
    }

    /** Defines the atomic query execution options. */
    export interface IExecuteSemanticQueryProxyCommunication {
        execute(commands: SemanticQueryDataShapeCommand[], dataSource: ExecuteSemanticQueryDataSource): IPromise<ExecuteSemanticQueryResult>;
    }

    export interface IExecuteSemanticQueryProxy {
        execute(options: DataProviderExecutionOptions): RejectablePromise<DataProviderData>;
        stopCommunication(): void;
        resumeCommunication(): void;
        rewriteCacheEntries(rewriter: ISemanticQueryCacheRewriter): void;
        clearCache(): void;
    }

    export function createExecuteSemanticQueryProxyHttpCommunication(httpService: IHttpService): IExecuteSemanticQueryProxyCommunication {
        return new ExecuteSemanticQueryProxyHttpCommunication(httpService);
    }

    export interface QueuedExecution {
        options: DataProviderExecutionOptions;
        deferred: IDeferred2<DataViewData, IClientError>;
        execution: RejectablePromise2<DataView, IClientError>;
    }

    export interface QueryBatch {
        dataSource: ExecuteSemanticQueryDataSource;
        commands: powerbi.data.SemanticQueryDataShapeCommand[];
        promises: IDeferred2<DataViewData, IClientError>[];
    }

    export interface ExecuteSemanticQueryRequest {
        semanticQueryDataShapeCommands: powerbi.data.SemanticQueryDataShapeCommand[];
        databaseName: string;
        virtualServerName: string;
        modelId: number;
    }

    export interface ExecuteSemanticQueryResult {
        jobIds: string[];
        results: QueryResultWrapperWithJobId[];
    }

    export interface QueryResultWrapperWithJobId {
        jobId: string;
        result: QueryResultWrapper;
    }

    export interface QueryResultWrapper {
        data?: QueryResultData;
        asyncResult?: QueryResultAsyncPlaceholder;
        error?: ServiceError;
    }

    export interface QueryResultData {
        descriptor: QueryBindingDescriptor;
        dsr: dsr.DataShapeResult;
    }

    export interface QueryResultAsyncPlaceholder {
    }

    export interface IExecuteSemanticQueryDelayedResultHandler {
        registerDelayedResult(jobId: string, deferred: IDeferred2<DataViewData, IClientError>, schemaName: string): void;
        setQueryResolver(resolver: IExecuteSemanticQueryDelayedResultResolver): void;
    }

    export interface IExecuteSemanticQueryDelayedResultResolver {
        resolveDelayedQuery(jobId: string, deferred: IDeferred2<data.dsr.DataViewData, IClientError>, schemaName: string): void;
    }

    export interface ISemanticQueryCacheRewriter {
        rewriteCacheKey?(cacheKey: CacheKeyObject): CacheKeyObject;
        rewriteCacheResult? (result: DataViewData): DataViewData;
    }

    export interface CacheKeyObject {
        dbName: string;
        vsName: string;
        schemaName: string;
        command: powerbi.data.DataProviderCommand;
    }

    export class ExecuteSemanticQueryProxy implements IExecuteSemanticQueryProxy {
        private static defaultPreferredMaxConnections: number = 4;
        private promiseFactory: IPromiseFactory;
        private communication: IExecuteSemanticQueryProxyCommunication;
        private delayedResultHandler: IExecuteSemanticQueryDelayedResultHandler;
        private batcher: ExecuteSemanticQueryBatcher;
        private isCommunicationStopped: boolean;
        private queryCache: RejectablePromiseCache<DataProviderData>;
        private pausedQueries: QueuedExecution[];

        constructor(
            host: IDataProviderHostServices,
            communication: IExecuteSemanticQueryProxyCommunication,
            delayedResultHandler?: IExecuteSemanticQueryDelayedResultHandler,
            timerFactory?: ITimerPromiseFactory,
            preferredMaxConnections: number = ExecuteSemanticQueryProxy.defaultPreferredMaxConnections) {
            debug.assertValue(host, 'host');

            this.promiseFactory = host.promiseFactory();
            this.communication = communication;
            this.delayedResultHandler = delayedResultHandler ? delayedResultHandler : new DefaultDelayedQueryResultHandler();
            this.batcher = new ExecuteSemanticQueryBatcher(preferredMaxConnections, (batches: QueryBatch[]) => {
                for (var i = 0, ilen = batches.length; i < ilen; ++i)
                    this.executeBatch(batches[i]);
            },
            timerFactory);

            this.queryCache = new RejectablePromiseCache(this.promiseFactory);
        }

        public execute(options: DataProviderExecutionOptions): RejectablePromise2<DataProviderData, IClientError> {
            var deferred = this.promiseFactory.defer<DataProviderData>();
            var execution = RejectablePromise2<DataProviderData, IClientError>(deferred);

            if (options.dataSource) {
                var cacheKey = this.generateCacheKey(options);
                if (this.queryCache.hasCacheEntry(cacheKey))
                    return this.queryCache.bindCacheEntry(cacheKey);

                // If there is no cache entry, create one
                // and batch the query for execution
                var deferredPromise = this.queryCache.createCacheEntry(cacheKey);

                var queuedExecution: QueuedExecution = {
                    options: options,
                    deferred: deferredPromise.deferred,
                    execution: deferredPromise.promise,
                };

                if (this.isCommunicationStopped) {
                    this.pausedQueries = this.pausedQueries || [];
                    this.pausedQueries.push(queuedExecution);
                } else {
                    this.batcher.enqueue(queuedExecution);
                }

                return this.queryCache.bindCacheEntry(cacheKey);
            }
            else {
                // When there is no dataSource, we will use the command directly as the DSR source.
                deferred.resolve(options.command);
            }

            return execution;
        }

        /**
        * Stops all future communication and reject and pending communication
        */
        public stopCommunication(): void {
            //Stop future communication
            this.isCommunicationStopped = true;
        }

        /**
        * Resumes communication which enables future requests
        */
        public resumeCommunication(): void {
            this.isCommunicationStopped = false;
            var pausedQueries = this.pausedQueries;
            if (!pausedQueries)
                return;
            for (var i = 0, length = pausedQueries.length; i < length; i++) {
                var queuedExecution: QueuedExecution = pausedQueries[i];
                if (queuedExecution.execution.pending())
                    this.batcher.enqueue(queuedExecution);
        }
            this.pausedQueries = undefined;
            }

        /**
         * Updates cache entries using an updater object. If a cache entry is affected by the update
         * it is either re-written or cleared
         * @param {ICacheUpdater} updater - updates the cache entry
         * queryCache {RejectablePromiseCache<DataProviderData>} queryCache
         */
        public rewriteCacheEntries(
            rewriter: ISemanticQueryCacheRewriter): void {
            rewriteSemanticQueryCacheEntries(rewriter, this.queryCache);
        }

        /**
         * Clear all cache entries
         */
        public clearCache() {
            this.queryCache.clearAllEntries();
        }

        /**
        * Generates key used to access query cache based on the provided options
        * @param {DataProviderExecutionOptions} options - Properties of this object are used to generate cache key
        */
        private generateCacheKey(options: DataProviderExecutionOptions): string {
            if (options.dataSource) {
                var dataSource = <ExecuteSemanticQueryDataSource>options.dataSource;
                var objectKey: CacheKeyObject = {
                    dbName: dataSource.dbName,
                    vsName: dataSource.vsName,
                    schemaName: dataSource.schemaName,
                    command: options.command
                };
                return cacheKeyObjectToString(objectKey);
            }
            return;
        }

        private executeBatch(batch: QueryBatch): void {
            debug.assertValue(batch, 'batch');
            debug.assert(batch.commands.length === batch.promises.length, 'Commands & promises sizes must match.');

            var promises = batch.promises;
            var schemaName = batch.dataSource.schemaName;

            this.communication.execute(batch.commands, batch.dataSource)
                .then(
                result => this.onSuccess(result, promises, schemaName),
                result => this.onError(promises));
        }

        private onSuccess(result: ExecuteSemanticQueryResult, executions: IDeferred2<DataViewData, IClientError>[], schemaName: string): void {
            debug.assertValue(result, 'result');
            debug.assertValue(executions, 'executions');
            debug.assert(result.jobIds.length === executions.length, 'Results & promises sizes must match');

            // The list of jobIds should match the order the queries were sent out. We'll need to resolve the results via the jobId
            // as they can potentially be streamed back in any order (first query to complete on the backend starts streaming first).
            var jobIds = result.jobIds;
            var jobIdToExecution: { [index: string]: IDeferred2<DataViewData, IClientError> }  = {};
            for (var i = 0, ilen = executions.length; i < ilen; ++i) {
                jobIdToExecution[jobIds[i]] = executions[i];
            }

            var results = result.results;
            for (var i = 0, ilen = results.length; i < ilen; ++i) {
                var queryResultWithJobId = results[i];
                var queryResult = queryResultWithJobId.result;
                var execution = jobIdToExecution[queryResultWithJobId.jobId];

                var data = queryResult.data;
                var error = queryResult.error;

                if (data) {
                    var dsrData: DataViewData = {
                        descriptor: data.descriptor,
                        dsr: data.dsr,
                        schemaName: schemaName,
                    };

                    execution.resolve(dsrData);
                }
                else if (error) {
                    var errorFactory = new ServiceErrorToClientError(error);
                    execution.reject(errorFactory);
                }
                else if (queryResult.asyncResult) {
                    // If we're communicating with a server proxy that might return delayed results asynchronously, we must have a
                    // a valid delayedResultHandler registered in order to collect the delayed result later on.
                    this.delayedResultHandler.registerDelayedResult(queryResultWithJobId.jobId, execution, schemaName);
            }
        }
        }

        private onError<T, U>(executions: IDeferred2<T, U>[]): void {
            debug.assertValue(executions, 'executions');

            for (var i = 0, len = executions.length; i < len; i++) {
                executions[i].reject();
            }
        }
            }

    /**
     * Updates cache entries using an updater object. If a cache entry is affected by the update
     * it is either re-written or cleared
     * @param {ICacheUpdater} updater - updates the cache entry
     * queryCache {RejectablePromiseCache<DataProviderData>} queryCache
     */
    export function rewriteSemanticQueryCacheEntries(
    rewriter: ISemanticQueryCacheRewriter,
    queryCache: RejectablePromiseCache <DataProviderData>): void {

        var cacheRewriter: IRejectablePromiseCacheRewiter<DataProviderData> = {};

        if (rewriter.rewriteCacheKey)
            cacheRewriter.rewriteKey = (cacheKey: string) => {
                var objectKey: CacheKeyObject = <CacheKeyObject>JSON.parse(cacheKey);
                var newKey = rewriter.rewriteCacheKey(objectKey);
                if (newKey !== objectKey)
                    return cacheKeyObjectToString(newKey);
                return cacheKey;
            };

        if (rewriter.rewriteCacheResult)
            cacheRewriter.rewriteResult = (result: DataProviderData, cacheKey: string) => {
                var objectKey: CacheKeyObject = <CacheKeyObject>JSON.parse(cacheKey);
                var data = <QueryResultData>result;
                var rewrittenResult = rewriter.rewriteCacheResult({
                    descriptor: data.descriptor,
                    dsr: data.dsr,
                    schemaName: objectKey.schemaName
                });
                return <QueryResultData>{ descriptor: rewrittenResult.descriptor, dsr: rewrittenResult.dsr };
            };

        queryCache.rewriteAllEntries(cacheRewriter);
    }

    /**
     * stringifies a cacheKey object
     * @param {ICacheKeyObject} objectKey
     */
    function cacheKeyObjectToString(objectKey: CacheKeyObject): string {
        return objectKey && JSON.stringify(objectKey);
        }

    class ExecuteSemanticQueryProxyHttpCommunication implements IExecuteSemanticQueryProxyCommunication {
        private static uri: string = '/explore/querydata';
        private httpService: IHttpService;

        constructor(httpService: IHttpService) {
            debug.assertValue(httpService, 'httpService');

            this.httpService = httpService;
        }

        public execute(commands: SemanticQueryDataShapeCommand[], dataSource: ExecuteSemanticQueryDataSource): IPromise<ExecuteSemanticQueryResult> {
            var requestOptions = this.httpService.powerbiRequestOptions();
            var executeSemanticQueryRequest: ExecuteSemanticQueryRequest = {
                semanticQueryDataShapeCommands: commands,
                databaseName: dataSource.dbName,
                virtualServerName: dataSource.vsName,
                modelId: dataSource.modelId,
            };

            return this.httpService.post<ExecuteSemanticQueryResult>(ExecuteSemanticQueryProxyHttpCommunication.uri, executeSemanticQueryRequest, requestOptions).then(
                result => result.data);
        }
    }

    /** Default stub class for IExecuteSemanticQueryDelayedResultHandler. Any apps that support delayed query result scenarios
        need to provide their own implementation of this handler, so that appropriate logic can be invoked when a query result
        returns with an async placeholder instead of data or an error. */
    class DefaultDelayedQueryResultHandler implements IExecuteSemanticQueryDelayedResultHandler {
        registerDelayedResult(jobId: string, deferred: IDeferred2<DataViewData, IClientError>, schemaName: string): void {
            debug.assertFail('Apps that want to support delayed query results need to specify an IExecuteSemanticQueryDelayedResultHandler implementation');

            // Reject the promise so that consumers don't end up waiting for a result that will never come
            deferred.reject(new UnknownClientError());
        }

        setQueryResolver(resolver: IExecuteSemanticQueryDelayedResultResolver): void {
            // No-op
        }
    }
}