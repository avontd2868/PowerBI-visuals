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

module powerbi.data {
    /** Represents a data provider. */
    export interface IDataProvider {
        /** Executes a query, with a promise of completion.  The response object should be compatible with the transform implementation. */
        execute? (options: DataProviderExecutionOptions): RejectablePromise2<DataProviderData, IClientError>;

        /** Transforms the given data into a DataView.  When this function is not specified, the data is put on a property on the DataView. */
        transform? (obj: DataProviderData): DataProviderTransformResult;

        /** Stops all future communication and reject and pending communication  */
        stopCommunication? (): void;

        /** Resumes communication which enables future requests */
        resumeCommunication? (): void;

        /** Clear cache */
        clearCache? (): void;

        /** rewriteCacheEntries */
        rewriteCacheEntries? (rewriter: DataProviderCacheRewriter): void;
    }

    export interface DataProviderTransformResult {
        dataView?: DataView;
        restartToken?: RestartToken;
        error?: IClientError;
        warning?: IClientWarning;
    }

    export interface RestartToken {
    }

    /** Represents a custom data provider plugin, to be registered in the powerbi.data.plugins object. */
    export interface IDataProviderPlugin {
        /** The name of this plugin. */
        name: string;
        
        /** Factory method for the IDataProvider. */
        create(hostServices: IDataProviderHostServices): IDataProvider;
    }

    /** Represents a query command defined by an IDataProvider. */
    export interface DataProviderCommand {
        // This interface is intentionally empty, as plugins define their own data structure.
    }

    /** Represents a data source defined by an IDataProvider. */
    export interface DataProviderDataSource {
        // This interface is intentionally empty, as plugins define their own data structure.
    }

    /** Represents arbitrary data defined by an IDataProvider. */
    export interface DataProviderData {
        // This interface is intentionally empty, as plugins define their own data structure.
    }

    /** Represents cacheRewriter that will rewrite the cache of provider as defined by an IDataProvider. */
    export interface DataProviderCacheRewriter {
        // This interface is intentionally empty, as plugins define their own data structure.
    }

    export interface DataProviderExecutionOptions {
        dataSource?: DataProviderDataSource;
        command: DataProviderCommand;
        allowCache?: boolean;
        cacheResponseOnServer?: boolean;
    }

    export interface IDataProviderHostServices {
        promiseFactory(): IPromiseFactory;
    }
}
