//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbitests;
(function (powerbitests) {
    var GeocodeQuery = powerbi.visuals.BI.Services.GeocodingManager.GeocodeQuery;
    describe('General GeocodeCache Tests', function () {
        var cache;
        var createGeocodingCache = powerbi.visuals.BI.Services.createGeocodingCache;
        var maxCacheSize = 3000;
        var maxCacheSizeOverflow = 100;
        beforeEach(function () {
            cache = createGeocodingCache(maxCacheSize, maxCacheSizeOverflow);
            localStorage.clear();
        });
        it('Cache Hit', function () {
            var washingtonQuery = new GeocodeQuery("Washington", "State");
            var washingtonCoord = { latitude: 10, longitude: 10 };
            var utahQuery = new GeocodeQuery("Utah", "State");
            var utahCoord = { latitude: 15, longitude: 15 };
            cache.registerCoordinates(washingtonQuery, washingtonCoord);
            cache.registerCoordinates(utahQuery, utahCoord);
            expect(cache.getCoordinates(washingtonQuery)).toEqual(washingtonCoord);
            expect(cache.getCoordinates(utahQuery)).toEqual(utahCoord);
        });
        it('Cache Miss', function () {
            var washingtonQuery = new GeocodeQuery("Washington", "State");
            var washingtonCoord = { latitude: 10, longitude: 10 };
            var utahQuery = new GeocodeQuery("Utah", "State");
            var utahCoord = { latitude: 15, longitude: 15 };
            var newYorkQuery = new GeocodeQuery("New York", "State");
            cache.registerCoordinates(washingtonQuery, washingtonCoord);
            cache.registerCoordinates(utahQuery, utahCoord);
            expect(cache.getCoordinates(newYorkQuery)).toBeFalsy();
        });
        it('Local storage hit', function () {
            var washingtonQuery = new GeocodeQuery("Washington", "State");
            var washingtonCoord = { latitude: 10, longitude: 10 };
            cache.registerCoordinates(washingtonQuery, washingtonCoord);
            var newCache = createGeocodingCache(maxCacheSize, maxCacheSizeOverflow);
            expect(newCache.getCoordinates(washingtonQuery)).toEqual(washingtonCoord);
        });
    });
})(powerbitests || (powerbitests = {}));
