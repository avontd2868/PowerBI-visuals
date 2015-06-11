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
    import UrlHelper = powerbi.visuals.UrlHelper;

    describe("UrlHelper isValidUrl",() => {
        var webUrlColumnMetadata: powerbi.DataViewMetadataColumn = {
            displayName: 'webUrl',
            type: new powerbi.ValueType(powerbi.ExtendedType.WebUrl, 'WebUrl')
        };

        var textColumnMetadata: powerbi.DataViewMetadataColumn = {
            displayName: 'text',
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
