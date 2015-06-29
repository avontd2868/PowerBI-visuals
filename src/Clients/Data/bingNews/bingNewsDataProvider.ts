//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data.bingNews {

    interface BingNewsDataProviderCommand {
        searchKey: string;
    }

    var bingSearchAuth = 'Basic ' + btoa(':Y0WB2f1urF4djkQzlvn0Jd6pcg/Y03fofJTGjlGMx8c=');

    export class BingNewsDataProvider implements IDataProvider {
        private promiseFactory: IPromiseFactory;
        private httpService: IHttpService;
        private cachedResults = {};

        constructor(host: IDataProviderHostServices, httpService: IHttpService) {
            debug.assertValue(host, 'host');
            debug.assertValue(httpService, 'httpService');

            this.promiseFactory = host.promiseFactory();
            this.httpService = httpService;
        }

        public execute(options: DataProviderExecutionOptions): RejectablePromise<DataProviderData> {
            var searchKey: string = (<BingNewsDataProviderCommand>options.command).searchKey;
            if (!searchKey)
                return;

            var deferred = this.promiseFactory.defer<DataProviderData>();

            var cachedResults = this.cachedResults;
            if (options.allowCache && searchKey in cachedResults) {
                deferred.resolve(cachedResults[searchKey]);
            }
            else {
                this.httpService.get<any>(
                    'https://api.datamarket.azure.com/Bing/Search/News?$format=json&NewsSortBy=%27Date%27&Query=%27' + encodeURIComponent(searchKey) + '%27',
                    {
                        headers: { Authorization: bingSearchAuth },
                        responseType: 'json',
                    }).then(
                    response => {
                        var results = response.data.d.results;
                        cachedResults[searchKey] = results;

                        deferred.resolve(results);
                    },
                    response => deferred.reject());
            }

            return RejectablePromise(deferred);
        }
    }
}