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