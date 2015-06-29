//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbitests;
(function (powerbitests) {
    var ContentPositions = powerbi.ContentPositions;
    var DataLabelManager = powerbi.DataLabelManager;
    var RectOrientation = powerbi.RectOrientation;
    var OutsidePlacement = powerbi.OutsidePlacement;
    function CreateSampleDataLabelInfo() {
        var element1 = {
            maximumMovingDistance: 12,
            minimumMovingDistance: 2,
            anchorMargin: 3,
            anchorRectOrientation: 0 /* None */,
            contentPosition: 2 /* TopCenter */,
            outsidePlacement: 1 /* Disallowed */,
            validContentPositions: ContentPositions.All,
            opacity: 1,
            size: { width: 45, height: 20 }
        };
        var element2 = {
            maximumMovingDistance: 12,
            minimumMovingDistance: 2,
            anchorMargin: 3,
            anchorRectOrientation: 0 /* None */,
            contentPosition: 2 /* TopCenter */,
            outsidePlacement: 1 /* Disallowed */,
            validContentPositions: ContentPositions.All,
            opacity: 1,
            size: { width: 45, height: 20 }
        };
        var result = [];
        result.push(element1, element2);
        return result;
    }
    describe("Default Settings", function () {
        it("Check default values are true", function () {
            var labelManager = new DataLabelManager();
            var defaultSettings = labelManager.defaultSettings;
            expect(defaultSettings.anchorMargin).toBe(0);
            expect(defaultSettings.anchorRectOrientation).toBe(0 /* None */);
            expect(defaultSettings.contentPosition).toBe(128 /* BottomCenter */);
            expect(defaultSettings.maximumMovingDistance).toBe(12);
            expect(defaultSettings.minimumMovingDistance).toBe(3);
            expect(defaultSettings.opacity).toBe(1);
            expect(defaultSettings.outsidePlacement).toBe(1 /* Disallowed */);
            expect(defaultSettings.validContentPositions).toBe(128 /* BottomCenter */);
        });
    });
    describe("Get Label info - One value provided", function () {
        it("Get Label info", function () {
            var labelManager = new DataLabelManager();
            var defaultSettings = labelManager.defaultSettings;
            var result = { minimumMovingDistance: 10 };
            result = labelManager.getLabelInfo(result);
            expect(defaultSettings.minimumMovingDistance).toEqual(3);
            expect(result.minimumMovingDistance).toEqual(10);
        });
        it("Get Label info - all values Provided", function () {
            var labelManager = new DataLabelManager();
            var defaultSettings = labelManager.defaultSettings;
            var result = CreateSampleDataLabelInfo();
            labelManager.getLabelInfo(result);
            expect(defaultSettings.anchorMargin).toEqual(0);
            expect(result[0].maximumMovingDistance).toEqual(12);
        });
        it("Get Label info - Default value should be taken", function () {
            var labelManager = new DataLabelManager();
            var result = {
                maximumMovingDistance: 12,
                minimumMovingDistance: 2,
                anchorRectOrientation: 0 /* None */,
                contentPosition: 2 /* TopCenter */,
                outsidePlacement: 1 /* Disallowed */,
                validContentPositions: ContentPositions.All,
                opacity: 1
            };
            var defaultSettings = labelManager.defaultSettings;
            labelManager.getLabelInfo(result);
            expect(defaultSettings.anchorMargin).toEqual(0);
            expect(result.anchorMargin).toEqual(0);
        });
    });
    describe("Is Valid Rect", function () {
        var rect;
        it("Is Valid Rect - Return true", function () {
            rect = { left: 150, top: 130, width: 120, height: 110 };
            var isValidRect = DataLabelManager.isValid(rect);
            expect(isValidRect).toBe(true);
        });
        it("Is Valid Rect - Negative values", function () {
            rect = { left: -150, top: -130, width: -120, height: -110 };
            var isValidRect = DataLabelManager.isValid(rect);
            expect(isValidRect).toBe(false);
        });
        it("Is Valid Rect - Empty Rect", function () {
            rect = { left: 0, top: 0, width: 0, height: 0 };
            var isValidRect = DataLabelManager.isValid(rect);
            expect(isValidRect).toBe(false);
        });
        it("Is Valid Rect - null Rect", function () {
            rect = null;
            var isValidRect = DataLabelManager.isValid(rect);
            expect(isValidRect).toBe(false);
        });
    });
})(powerbitests || (powerbitests = {}));
