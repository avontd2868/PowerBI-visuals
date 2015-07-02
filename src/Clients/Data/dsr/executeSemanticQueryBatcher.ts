 //-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data.dsr {
    import JsonComparer = jsCommon.JsonComparer;

    export class ExecuteSemanticQueryBatcher {
        private currentBatchDeferred: JQueryDeferred<void>;
        private maxBatches: number;
        private pending: QueuedExecution[];
        private queryExecuteCallback: (batches: QueryBatch[]) => void;
        private timerFactory: jsCommon.ITimerPromiseFactory;

        /** Creates an ExecuteSemanticQueryBatcher object that will arrange a collection of executeSemanticQueries into
        *   batches before calling you back with the batch list.
        * @param preferredMaxBatches The maximum number of batches we would prefer to have. We cannot set a hard limit
        *                            on the number of batches for multi-model scenarios because with our current server
        *                            APIs we can only specify one model per request, therefore the mininum number of
        *                            batches will be the number of distinct models in the query collection.
        *                            Note: In future when we have multi-model support, if we find that users frequently
        *                            load slides with more datasources than our preferred max we can consider adding
        *                            server endpoints that allow specifying multiple datasources.
        * @param onBatchExecute      The callback that is invoked when the ExecuteSemanticQueryBatcher is done creating
        *                            the batches.
        * @ param timerFactory       Optional factory instance for creating timers
        */
        constructor(preferredMaxBatches: number, onBatchExecute: (batches: QueryBatch[]) => void, timerFactory?: jsCommon.ITimerPromiseFactory) {
            this.maxBatches = preferredMaxBatches;
            this.queryExecuteCallback = onBatchExecute;
            this.pending = [];
            this.timerFactory = timerFactory || jsCommon.TimerPromiseFactory.instance;
        }

        /** Enqueue a query to run as part of one of the batches. The promise returned from this
            this function will be resolved when the batch runs. */
        public enqueue(queudQuery: QueuedExecution): JQueryPromise<void> {
            this.pending.push(queudQuery);
            if (!this.currentBatchDeferred) {
                // Delay the completion after a timeout of zero.  This allow currently running JS to complete
                // and potentially make more enqueue calls to be included in the current batch.
                this.currentBatchDeferred = $.Deferred<void>();
                this.timerFactory.create(0).done(() => {
                    var batches = this.createBatches();
                    this.clearPending();
                    this.queryExecuteCallback(batches);
                    this.currentBatchDeferred.resolve();
                    this.currentBatchDeferred = undefined;
                });
            }

            return this.currentBatchDeferred.promise();
        }

        public clearPending(): void {
            this.pending = [];
        }

        private createBatches(): QueryBatch[]{
            var batches: QueryBatch[] = [];
            var queriesByDataSource = this.sortQueriesByDataSource();

            if (queriesByDataSource.length >= this.maxBatches) {
                // If we have equal or more datasources than max preferred batches (connections), it's not going to be possible
                // to stay under the preferred number of connections so just submit each datasource as its own batch.
                for (var i = 0, ilen = queriesByDataSource.length; i < ilen; ++i) {
                    batches.push(this.createBatchFromDataSourceGroup(queriesByDataSource[i]));
                }
            }
            else {
                // If we have fewer datasources than max preferred batches, split out the queries for the biggest
                // datasource(s) so that we can utilize up to the max preferred number of connections.
                batches = this.splitDataSourcesIntoBatches(queriesByDataSource, this.maxBatches);
            }

            return batches;
        }

        private sortQueriesByDataSource(): QueriesByDataSource[]{
            var dataSourceGroups = [];
            var queries = this.pending;
            for (var i = 0, ilen = queries.length; i < ilen; ++i) {
                var query = queries[i];

                // Skip the queries that were cancelled
                if (!query.execution.rejected()) {
                    var dataSourceGroup = this.findDataSourceGroup(query.options.dataSource, dataSourceGroups, query.options.cacheResponseOnServer);
                    if (dataSourceGroup) {
                        dataSourceGroup.queuedExecutions.push(query);
                    }
                    else {
                        var newDataSourceGroup: QueriesByDataSource = { dataSource: <ExecuteSemanticQueryDataSource>query.options.dataSource, queuedExecutions: [query], cacheResponseOnServer: query.options.cacheResponseOnServer };
                        dataSourceGroups.push(newDataSourceGroup);
                    }
                }
            }

            return dataSourceGroups;
        }

        private findDataSourceGroup(dataSource: DataProviderDataSource, dataSourceGroups: QueriesByDataSource[], shouldCache: boolean): QueriesByDataSource {
            for (var i = 0, ilen = dataSourceGroups.length; i < ilen; ++i) {
                var dataSourceGroup = dataSourceGroups[i];
                if (JsonComparer.equals(dataSource, dataSourceGroup.dataSource) && dataSourceGroup.cacheResponseOnServer === shouldCache)
                    return dataSourceGroup;
            }

            return null;
        }

        private createBatchFromDataSourceGroup(dataSourceGroup: QueriesByDataSource): QueryBatch  {
            var commands: SemanticQueryDataShapeCommand[] = [];
            var promises: IDeferred2<DataViewData, IClientError>[] = [];
            var queuedExecutions: QueuedExecution[] = dataSourceGroup.queuedExecutions;

            for (var i = 0, ilen = queuedExecutions.length; i < ilen; ++i) {
                var query = queuedExecutions[i];
                var queryOptions = queuedExecutions[i].options;
                commands.push(<SemanticQueryDataShapeCommand>queryOptions.command);
                promises.push(query.deferred);
            }

            return {
                dataSource: dataSourceGroup.dataSource,
                commands: commands,
                promises: promises,
                cacheResponseOnServer: dataSourceGroup.cacheResponseOnServer
            };
        }

        private splitDataSourcesIntoBatches(dataSourceGroups: QueriesByDataSource[], maxBatches: number): QueryBatch[]{
            // Start off with one dataSource per batch
            var batches: QueryBatch[] = [];
            for (var i = 0, ilen = dataSourceGroups.length; i < ilen; ++i) {
                batches.push(this.createBatchFromDataSourceGroup(dataSourceGroups[i]));
            }

            // Now try to split some of the batches if possible
            batches = this.splitBatches(batches, maxBatches);

            return batches;
        }

        private splitBatches(initialBatches: QueryBatch[], maxBatches: number): QueryBatch[] {
            var batches = initialBatches.slice();
            while (batches.length < maxBatches) {
                // Find best candidate for splitting. This will be the batch with the most queries, though it needs to have
                // more than one query otherwise it cannot be split.
                var splitCandidate: QueryBatch;
                for (var i = 0, ilen = batches.length; i < ilen; ++i) {
                    var batch = batches[i];
                    if (batch.commands.length > 1) {
                        if (!splitCandidate || splitCandidate.commands.length < batch.commands.length)
                            splitCandidate = batch;
                    }
                }

                if (splitCandidate) {
                    // Split the batch into two, and then loop again
                    batches.push(this.splitBatch(splitCandidate));
                    splitCandidate = null;
                }
                else {
                    // Cannot split any of the batches, finish this function
                    return batches;
                }
            }

            return batches;
        }

        /** Splits half of the commands/promises out of the batch into a new batch. The new batch is set as the return value. */
        private splitBatch(batch: QueryBatch): QueryBatch {
            var queryCount = batch.commands.length;

            var commands: SemanticQueryDataShapeCommand[] = batch.commands.splice(queryCount / 2);
            var promises: IDeferred2<DataViewData, IClientError>[] = batch.promises.splice(queryCount / 2);

            return {
                dataSource: batch.dataSource,
                commands: commands,
                promises: promises,
                cacheResponseOnServer: batch.cacheResponseOnServer
            };
        }
    }

    interface QueriesByDataSource {
        dataSource: ExecuteSemanticQueryDataSource;
        cacheResponseOnServer: boolean;
        queuedExecutions: QueuedExecution[];
    }
}