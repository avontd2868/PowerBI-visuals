//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

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
    }

    export interface IDataProviderHostServices {
        promiseFactory(): IPromiseFactory;
    }
}
