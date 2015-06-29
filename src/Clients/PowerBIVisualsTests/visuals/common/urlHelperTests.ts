//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbitests {
    import UrlHelper = powerbi.visuals.UrlHelper;

    describe("UrlHelper isValidUrl",() => {
        var webUrlColumnMetadata: powerbi.DataViewMetadataColumn = {
            name: 'webUrl',
            type: new powerbi.ValueType(powerbi.ExtendedType.WebUrl, 'WebUrl')
        };

        var textColumnMetadata: powerbi.DataViewMetadataColumn = {
            name: 'text',
            type: new powerbi.ValueType(powerbi.ExtendedType.Text, 'Text')
        };

        it('isValidUrl null',() => {
            expect(UrlHelper.isValidUrl(null, null)).toBe(false);
        });

        it('isValidUrl http',() => {
            expect(UrlHelper.isValidUrl(webUrlColumnMetadata, 'http://www.microsoft.com')).toBe(true);
        });

        it('isValidUrl https',() => {
            expect(UrlHelper.isValidUrl(webUrlColumnMetadata, 'https://www.microsoft.com')).toBe(true);
        });

        it('isValidUrl HTTPS',() => {
            expect(UrlHelper.isValidUrl(webUrlColumnMetadata, 'HTTPS://WWW.MICROSOFT.COM')).toBe(true);
        });

        it('isValidUrl dataUri',() => {
            expect(UrlHelper.isValidUrl(webUrlColumnMetadata, 'data://www.microsoft.com')).toBe(false);
        });

        it('isValidUrl not weburl',() => {
            expect(UrlHelper.isValidUrl(textColumnMetadata, 'http://www.microsoft.com')).toBe(false);
        });
    });
}
