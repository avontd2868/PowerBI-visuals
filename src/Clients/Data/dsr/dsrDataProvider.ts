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