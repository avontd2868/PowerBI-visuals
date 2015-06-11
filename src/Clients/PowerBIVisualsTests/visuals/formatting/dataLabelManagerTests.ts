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
    import IDataLabelInfo = powerbi.IDataLabelInfo;
    import ContentPositions = powerbi.ContentPositions;

    var DataLabelManager = powerbi.DataLabelManager;
    var RectOrientation = powerbi.RectOrientation;
    var OutsidePlacement = powerbi.OutsidePlacement;

    function CreateSampleDataLabelInfo(): IDataLabelInfo[] {
        var element1:  IDataLabelInfo = {
            maximumMovingDistance: 12,
            minimumMovingDistance: 2,
            anchorMargin: 3,
            anchorRectOrientation: RectOrientation.None,
            contentPosition: ContentPositions.TopCenter,
            outsidePlacement: OutsidePlacement.Disallowed,
            validContentPositions: ContentPositions.All,
            opacity: 1,
            size: {width: 45, height: 20}
        };
        var element2:  IDataLabelInfo = {
            maximumMovingDistance: 12,
            minimumMovingDistance: 2,
            anchorMargin: 3,
            anchorRectOrientation: RectOrientation.None,
            contentPosition: ContentPositions.TopCenter,
            outsidePlacement: OutsidePlacement.Disallowed,
            validContentPositions: ContentPositions.All,
            opacity: 1,
            size: {width: 45, height: 20}
        };
        var result: IDataLabelInfo[] = [];
        result.push(element1,element2);
        return result;
    }

    describe("Default Settings",() => {

        it("Check default values are true",() => {
            var labelManager = new DataLabelManager();
            var defaultSettings = labelManager.defaultSettings;
            expect(defaultSettings.anchorMargin).toBe(0);
            expect(defaultSettings.anchorRectOrientation).toBe(RectOrientation.None);
            expect(defaultSettings.contentPosition).toBe(ContentPositions.BottomCenter);
            expect(defaultSettings.maximumMovingDistance).toBe(12);
            expect(defaultSettings.minimumMovingDistance).toBe(3);
            expect(defaultSettings.opacity).toBe(1);
            expect(defaultSettings.outsidePlacement).toBe(OutsidePlacement.Disallowed);
            expect(defaultSettings.validContentPositions).toBe(ContentPositions.BottomCenter);
        });

    });

    describe("Get Label info - One value provided",() => {

        it("Get Label info",() => { 
            var labelManager = new DataLabelManager();
            var defaultSettings = labelManager.defaultSettings;
            var result: IDataLabelInfo = { minimumMovingDistance:10 };
            result = labelManager.getLabelInfo(result);

            expect(defaultSettings.minimumMovingDistance).toEqual(3);
            expect(result.minimumMovingDistance).toEqual(10);  
        });

        it("Get Label info - all values Provided",() => {
            var labelManager = new DataLabelManager();
            var defaultSettings = labelManager.defaultSettings;
            var result = CreateSampleDataLabelInfo();
            labelManager.getLabelInfo(result);

            expect(defaultSettings.anchorMargin).toEqual(0);
            expect(result[0].maximumMovingDistance).toEqual(12);
        });

        it("Get Label info - Default value should be taken",() => {
            var labelManager = new DataLabelManager();  
            var result: IDataLabelInfo = {
                maximumMovingDistance: 12,
                minimumMovingDistance: 2,
                anchorRectOrientation: RectOrientation.None,
                contentPosition: ContentPositions.TopCenter,
                outsidePlacement: OutsidePlacement.Disallowed,
                validContentPositions: ContentPositions.All,
                opacity: 1
            };
            var defaultSettings = labelManager.defaultSettings;
            labelManager.getLabelInfo(result);

            expect(defaultSettings.anchorMargin).toEqual(0);
            expect(result.anchorMargin).toEqual(0);
        });

    });

    describe("Is Valid Rect",() => {

        var rect;

        it("Is Valid Rect - Return true",() => {
            rect = { left: 150, top: 130, width: 120, height: 110 };
            var isValidRect = DataLabelManager.isValid(rect);
            expect(isValidRect).toBe(true);
        });

        it("Is Valid Rect - Negative values", () => {
            rect = { left: -150, top: -130, width: -120, height: -110 };
            var isValidRect = DataLabelManager.isValid(rect);
            expect(isValidRect).toBe(false);
        });

        it("Is Valid Rect - Empty Rect",() => {
            rect = { left: 0, top: 0, width: 0, height: 0 };
            var isValidRect = DataLabelManager.isValid(rect);
            expect(isValidRect).toBe(false);
        });

        it("Is Valid Rect - null Rect",() => {
            rect = null;
            var isValidRect = DataLabelManager.isValid(rect);
            expect(isValidRect).toBe(false);
        });
    });
}