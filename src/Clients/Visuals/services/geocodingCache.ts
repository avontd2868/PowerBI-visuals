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

module powerbi.visuals.BI.Services {
    import GeocodeQuery = GeocodingManager.GeocodeQuery;
    import IGeocodeCoordinate = GeocodingManager.IGeocodeCoordinate;

    interface IGeocodePair {
        query: GeocodeQuery;
        coordinate: IGeocodeCoordinate;
    }

    export interface IGeocodingCache {
        getCoordinates(query: GeocodeQuery): IGeocodeCoordinate;
        registerCoordinates(query: GeocodeQuery, coordinate: IGeocodeCoordinate): void;
    }

    export function createGeocodingCache(maxCacheSize: number, maxCacheSizeOverflow: number): IGeocodingCache {
        return new GeocodingCache(maxCacheSize, maxCacheSizeOverflow);
    }

    class GeocodingCache implements IGeocodingCache {
        private geocodeCache: { [key: string]: IGeocodePair; };
        private maxCacheSize: number;
        private maxCacheSizeOverflow: number;

        constructor(maxCacheSize: number, maxCacheSizeOverflow: number) {
            this.geocodeCache = {};
            this.maxCacheSize = maxCacheSize;
            this.maxCacheSizeOverflow = maxCacheSizeOverflow;
        }

        /** Retrieves the coordinate for the key from the cache, returning undefined on a cache miss */
        public getCoordinates(query: GeocodeQuery): IGeocodeCoordinate {
            // Check in-memory cache
            var pair = this.geocodeCache[query.key];
            if (pair) {
                pair.query.incrementCacheHit();
                return pair.coordinate;
            }
            // Check local storage cache
            pair = localStorageService.getData(query.key);
            if (pair) {
                this.registerInMemory(query, pair.coordinate);
                return pair.coordinate;
            }
            return undefined;
        }

        /** Registers the query and coordinate to the cache */
        public registerCoordinates(query: GeocodeQuery, coordinate: IGeocodeCoordinate): void {
            this.registerInMemory(query, coordinate);
            this.registerInStorage(query, coordinate);
        }

        private registerInMemory(query: GeocodeQuery, coordinate: IGeocodeCoordinate): void {
            var geocodeCache = this.geocodeCache;
            var keys = Object.keys(geocodeCache);
            var cacheSize = keys.length;
            var maxCacheSize = this.maxCacheSize;

            if (keys.length > (maxCacheSize + this.maxCacheSizeOverflow)) {

                var sortedKeys = keys.sort((a: string, b: string) => {
                    var ca = geocodeCache[a].query.getCacheHits();
                    var cb = geocodeCache[b].query.getCacheHits();
                    return ca < cb ? -1 : (ca > cb ? 1 : 0);
                });

                for (var i = 0; i < (cacheSize - maxCacheSize); i++) {
                    geocodeCache[sortedKeys[i]] = undefined;
                }
            }

            geocodeCache[query.key] = { query: query, coordinate: coordinate };
        }

        private registerInStorage(query: GeocodeQuery, coordinate: IGeocodeCoordinate): void {
            localStorageService.setData(query.key, { query: query, coordinate: coordinate });
        }
    }
}