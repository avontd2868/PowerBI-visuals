//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var GeocodingManager = powerbi.visuals.BI.Services.GeocodingManager;
describe("GeocodingManagerTests", function () {
    it('GeocodingManager.isCategoryType', function () {
        expect(GeocodingManager.isCategoryType(GeocodingManager.CategoryTypes.Address)).toBeTruthy();
        expect(GeocodingManager.isCategoryType(GeocodingManager.CategoryTypes.City)).toBeTruthy();
        expect(GeocodingManager.isCategoryType(GeocodingManager.CategoryTypes.Continent)).toBeTruthy();
        expect(GeocodingManager.isCategoryType("Country")).toBeTruthy(); // Country is special
        expect(GeocodingManager.isCategoryType(GeocodingManager.CategoryTypes.County)).toBeTruthy();
        expect(GeocodingManager.isCategoryType(GeocodingManager.CategoryTypes.Longitude)).toBeTruthy();
        expect(GeocodingManager.isCategoryType(GeocodingManager.CategoryTypes.Latitude)).toBeTruthy();
        expect(GeocodingManager.isCategoryType(GeocodingManager.CategoryTypes.Place)).toBeTruthy();
        expect(GeocodingManager.isCategoryType(GeocodingManager.CategoryTypes.PostalCode)).toBeTruthy();
        expect(GeocodingManager.isCategoryType(GeocodingManager.CategoryTypes.StateOrProvince)).toBeTruthy();
        expect(GeocodingManager.isCategoryType("")).toBeFalsy();
    });
});
