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

module jsCommon {

    /**
     *  Utility class to manupilate the search query string in a Url.
     *  Note: search query string has to begin with '?'
     */
    export class QueryStringUtil {
        public static OriginClientActivityIdParameterName = 'caid';
        public static OriginRootActivityIdParameterName = 'raid';
        public static OriginActivityIdParameterName = 'aid';

        /** Remove a given query from the query */
        public static clearQueryString(queryField: string): string {
            var queries = QueryStringUtil.parseQueryString();
            delete queries[queryField];
            return QueryStringUtil.rebuildQueryString(queries);
        }

        /** 
         * Add or update existing query field to new value
         * Note: queryField and queryValue do not need to be encoded
         */
        public static addOrUpdateQueryString(queryField: string, queryValue: string): string {
            var queries = QueryStringUtil.parseQueryString();
            queries[queryField] = queryValue;

            return QueryStringUtil.rebuildQueryString(queries);
        }

        /**
         * Returns the value of a URL parameter
         * @param key - The key of the URL parameter
         * @returns The (decoded) value of the URL parameter
         */
        public static getQueryStringValue(key: string): string {
            var queries: { [key: string]: string; } = QueryStringUtil.parseQueryString();
            return queries[key]; 
        }

        /** 
         * Parse the search query string into key/value pairs 
         * Note: both key and value are decoded.
         */
        public static parseQueryString(queryString: string = window.location.search): { [key: string]: string; } {
            var queryStringDictionary: { [key: string]: string; } = {};
            var search = queryString;

            if (!StringExtensions.isNullOrEmpty(search) && search.substr(0, 1) === '?') {
                // skip the '?'
                var pairs = search.substr(1).split("&");
                for (var i = 0; i < pairs.length; i++) {
                    var keyValuePair = pairs[i].split("=");
                    queryStringDictionary[decodeURIComponent(keyValuePair[0])] = decodeURIComponent(keyValuePair[1]);
                }
            }

            return queryStringDictionary;
        }

        /** 
         * Reconstruct the search string based on the key/value pair of individual query.
         * Note: both query field and query value will be encoded in the returned value.
         */
        public static rebuildQueryString(queries: { [key: string]: string; }): string {
            var queryString = "";
            var isEmpty = true;

            for (var queryField in queries) {
                if (!isEmpty) {
                    queryString += '&';
                }
                queryString += encodeURIComponent(queryField);

                if (queries[queryField]) {
                    queryString += '=' + encodeURIComponent(queries[queryField]);
                }
                isEmpty = false;
            }

            if (!isEmpty) {
                queryString = '?' + queryString;
            }

            return queryString;
        }
    }
}