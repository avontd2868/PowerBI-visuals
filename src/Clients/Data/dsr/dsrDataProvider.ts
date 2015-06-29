//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data.dsr {
    import ITimerPromiseFactory = jsCommon.ITimerPromiseFactory;

    export class DsrDataProvider implements IDataProvider {
        private proxy: IExecuteSemanticQueryProxy;
        private static undefinedData = 'UndefinedData';

        constructor(
            host: IDataProviderHostServices,
            communication: IExecuteSemanticQueryProxyCommunication,
            delayedResultHandler?: IExecuteSemanticQueryDelayedResultHandler,
            timerFactory?: ITimerPromiseFactory) {
            debug.assertValue(host, 'host');
            this.proxy = new ExecuteSemanticQueryProxy(host, communication, delayedResultHandler, timerFactory);
        }

        public execute(options: DataProviderExecutionOptions): RejectablePromise<DataProviderData> {
            return this.proxy.execute(options);
        }

        public transform(obj: DataProviderData): DataProviderTransformResult {
            if (obj === undefined)
                return {
                    dataView: {
                        metadata: { columns: [] },
                        error: { code: DsrDataProvider.undefinedData }
                    }
                };

            return dsr.read(obj);
        }

        public stopCommunication(): void {
            this.proxy.stopCommunication();
        }

        public resumeCommunication(): void {
            this.proxy.resumeCommunication();
        }

        public clearCache(): void {
            this.proxy.clearCache();
        }

        public rewriteCacheEntries(rewriter: data.DataProviderCacheRewriter): void {
            this.proxy.rewriteCacheEntries(<ISemanticQueryCacheRewriter>rewriter);
        }
    }
} 