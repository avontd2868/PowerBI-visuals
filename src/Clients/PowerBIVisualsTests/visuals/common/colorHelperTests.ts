//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

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