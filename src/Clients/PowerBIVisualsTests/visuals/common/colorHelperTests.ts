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
    import ColorHelper = powerbi.visuals.ColorHelper;
    import SQExprShortSerializer = powerbi.data.SQExprShortSerializer;

    describe('Color Helper',() => {
        var colorHelper: ColorHelper;
        var style: powerbi.IVisualStyle;
        var colors: powerbi.IDataColorPalette;

        var columnIdentity = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'sales' });

        beforeEach(() => {
            style = powerbi.visuals.visualStyles.create();
            colors = style.colorPalette.dataColors;
            colorHelper = new ColorHelper(colors, null);
        });

        it('getColorForSeriesValue should handle undefined identity array',() => {
            var color = colorHelper.getColorForSeriesValue(undefined, undefined, 'value');

            var expectedColor = colors.getColorByScale(SQExprShortSerializer.serializeArray([]), 'value').value;
            expect(color).toEqual(expectedColor);
        });

        it('getColorForSeriesValue should return the same color for the same series and value',() => {
            var color1 = colorHelper.getColorForSeriesValue(null, [columnIdentity], 'value');
            var color2 = colorHelper.getColorForSeriesValue(null, [columnIdentity], 'value');

            expect(color1).toEqual(color2);
        });

        // TODO: add more unit tests (Defect 5037722)
    });
} 