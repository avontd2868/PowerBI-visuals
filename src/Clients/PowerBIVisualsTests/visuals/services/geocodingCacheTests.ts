 //-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbitests {
    import IGeocodeCache = powerbi.visuals.BI.Services.IGeocodingCache;
    import GeocodeQuery = powerbi.visuals.BI.Services.GeocodingManager.GeocodeQuery;

    describe('General GeocodeCache Tests', () => {
        var cache: IGeocodeCache;
        var createGeocodingCache = powerbi.visuals.BI.Services.createGeocodingCache;

        var maxCacheSize = 3000;
        var maxCacheSizeOverflow = 100;

        beforeEach(() => {
            cache = createGeocodingCache(maxCacheSize, maxCacheSizeOverflow);
            localStorage.clear();
        });

        it('Cache Hit', () => {
            var washingtonQuery = new GeocodeQuery("Washington", "State");
            var washingtonCoord = { latitude: 10, longitude: 10 };
            var utahQuery = new GeocodeQuery("Utah", "State");
            var utahCoord = { latitude: 15, longitude: 15 };
            cache.registerCoordinates(washingtonQuery, washingtonCoord);
            cache.registerCoordinates(utahQuery, utahCoord);

            expect(cache.getCoordinates(washingtonQuery)).toEqual(washingtonCoord);
            expect(cache.getCoordinates(utahQuery)).toEqual(utahCoord);
        });

        it('Cache Miss', () => {
            var washingtonQuery = new GeocodeQuery("Washington", "State");
            var washingtonCoord = { latitude: 10, longitude: 10 };
            var utahQuery = new GeocodeQuery("Utah", "State");
            var utahCoord = { latitude: 15, longitude: 15 };
            var newYorkQuery = new GeocodeQuery("New York", "State");
            cache.registerCoordinates(washingtonQuery, washingtonCoord);
            cache.registerCoordinates(utahQuery, utahCoord);

            expect(cache.getCoordinates(newYorkQuery)).toBeFalsy();
        });

        it('Local storage hit', () => {
            var washingtonQuery = new GeocodeQuery("Washington", "State");
            var washingtonCoord = { latitude: 10, longitude: 10 };
            cache.registerCoordinates(washingtonQuery, washingtonCoord);
            var newCache = createGeocodingCache(maxCacheSize, maxCacheSizeOverflow);

            expect(newCache.getCoordinates(washingtonQuery)).toEqual(washingtonCoord);
        });
    });
}