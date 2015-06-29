//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

describe("DataColorPalette", function () {
    var dataColors = new powerbi.visuals.DataColorPalette();
    
    it('Check get color no duplicates until wrap-around', function () {
        // Note (param 0): Since conditional formatting is currently not supported, the datavalue param is ignored. For now the
        //                 test will pass in various objects just to make sure we don't crash. Once conditional formatting is
        //                 supported we should pass in objects that will excercise that the conditional formatting code.
        // Note (param 1): We need to support any object as the index key, since some charts will use number or string index keys

        var color0 = dataColors.getColor('test datavalue');
        expect(color0).toExist();

        var color1 = dataColors.getColor('series index N');
        expect(color1).toExist();
        expect(color0.value).not.toBe(color1.value);

        var color2 = dataColors.getColor({ seriesProperty: 'X' });
        expect(color2).toExist();
        expect(color1.value).not.toBe(color2.value);

        var color3 = dataColors.getColor(-1);
        expect(color3).toExist();
        expect(color2.value).not.toBe(color3.value);

        // Wrap around occurs after 40 (base color count) * 12 (cycles) colors currently. We should have no duplicates
        // until that point.
        var previousColor = color3;
        for (var i = 4; i < 480; ++i) {
            var nextColor = dataColors.getColor(i);
            expect(nextColor).toExist();
            expect(nextColor.value).not.toBe(previousColor.value);
            previousColor = nextColor;
        }

        // Wrap around should occur now, verify we are back to the start
        expect(dataColors.getColor('abc series')).toBe(color0);
    });

    it('Check get color same index key returns same color', function () {
        var indexKey0 = 4;
        var indexKey1 = 'pie slice 7';

        var color0_firstGet = dataColors.getColor(indexKey0);
        expect(color0_firstGet).toExist();

        var color1_firstGet = dataColors.getColor(indexKey1);
        expect(color1_firstGet).toExist();

        var color0_secondGet = dataColors.getColor(indexKey0);
        expect(color0_secondGet).toExist();
        expect(color0_secondGet.value).toBe(color0_firstGet.value);

        var color1_secondGet = dataColors.getColor(indexKey1);
        expect(color1_secondGet).toExist();
        expect(color1_firstGet.value).toBe(color1_secondGet.value);
    });

    // The Sentiment/KPI color API is just temporary until conditional formatting is avaiable, but while the API is active it needs to be tested.
    // We can remove this test once the Sentiment API is superseded by conditional formatting.
    it('Check get Sentiment color', function () {
        var sentimentColors = dataColors.getSentimentColors();

        // For now our visuals assume that there are 3 colors
        expect(sentimentColors.length).toBe(3);

        // Check for duplicates
        expect(sentimentColors[0].value).not.toBe(sentimentColors[1].value);
        expect(sentimentColors[1].value).not.toBe(sentimentColors[2].value);
        expect(sentimentColors[0].value).not.toBe(sentimentColors[2].value);
    });

    it('Check parameter colors', function () {
        var localDataColors = new powerbi.visuals.DataColorPalette([{ value: '#112233' }]);
        var firstColor = localDataColors.getColor(0);
        expect(firstColor.value).toBe('#112233');
    });
});
