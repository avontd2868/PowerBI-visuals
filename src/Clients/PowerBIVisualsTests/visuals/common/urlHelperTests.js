//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbitests;
(function (powerbitests) {
    var UrlHelper = powerbi.visuals.UrlHelper;
    describe("UrlHelper isValidUrl", function () {
        var webUrlColumnMetadata = {
            name: 'webUrl',
            type: new powerbi.ValueType(powerbi.ExtendedType.WebUrl, 'WebUrl')
        };
        var textColumnMetadata = {
            name: 'text',
            type: new powerbi.ValueType(1 /* Text */, 'Text')
        };
        it('isValidUrl null', function () {
            expect(UrlHelper.isValidUrl(null, null)).toBe(false);
        });
        it('isValidUrl http', function () {
            expect(UrlHelper.isValidUrl(webUrlColumnMetadata, 'http://www.microsoft.com')).toBe(true);
        });
        it('isValidUrl https', function () {
            expect(UrlHelper.isValidUrl(webUrlColumnMetadata, 'https://www.microsoft.com')).toBe(true);
        });
        it('isValidUrl HTTPS', function () {
            expect(UrlHelper.isValidUrl(webUrlColumnMetadata, 'HTTPS://WWW.MICROSOFT.COM')).toBe(true);
        });
        it('isValidUrl dataUri', function () {
            expect(UrlHelper.isValidUrl(webUrlColumnMetadata, 'data://www.microsoft.com')).toBe(false);
        });
        it('isValidUrl not weburl', function () {
            expect(UrlHelper.isValidUrl(textColumnMetadata, 'http://www.microsoft.com')).toBe(false);
        });
    });
})(powerbitests || (powerbitests = {}));
