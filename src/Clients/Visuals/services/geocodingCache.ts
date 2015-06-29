//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

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