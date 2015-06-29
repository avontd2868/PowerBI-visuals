//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbitests;
(function (powerbitests) {
    var SelectionId = powerbi.visuals.SelectionId;
    describe('Web interactivity service', function () {
        var interactivityService;
        var categoryA = powerbitests.mocks.dataViewScopeIdentity("A");
        var categoryB = powerbitests.mocks.dataViewScopeIdentity("B");
        describe('', function () {
            beforeEach(function () {
                var host = powerbitests.mocks.createVisualHostServices();
                interactivityService = new powerbi.visuals.WebInteractivityService(host);
            });
            it('selecting a single data point should set selected state', function () {
                var dataPoints = [
                    { selected: false, identity: SelectionId.createWithId(categoryA, false) },
                    { selected: true, identity: SelectionId.createWithId(categoryB, false) },
                ];
                interactivityService.selectableDataPoints = dataPoints;
                interactivityService.select(dataPoints[0], false);
                expect(dataPoints[0].selected).toBeTruthy();
                expect(dataPoints[1].selected).toBeFalsy();
            });
            it('selecting a highlighted data point should select non-highlight data point with the same id', function () {
                var dataPoints = [
                    { selected: false, identity: SelectionId.createWithId(categoryA, true) },
                    { selected: false, identity: SelectionId.createWithId(categoryA, false) },
                ];
                interactivityService.selectableDataPoints = dataPoints;
                interactivityService.select(dataPoints[0], false);
                expect(dataPoints[0].selected).toBeFalsy();
                expect(dataPoints[1].selected).toBeTruthy();
            });
            it('createPropertiesToHost: selecting a dataPoint should result in a VisualObjectInstance', function () {
                var dataPoints = [
                    { selected: false, identity: SelectionId.createWithId(categoryA, false) },
                ];
                interactivityService.selectableDataPoints = dataPoints;
                interactivityService.select(dataPoints[0], true);
                var propertyIdentifier = {
                    objectName: 'general',
                    propertyName: 'property'
                };
                var result = interactivityService.createPropertiesToHost(propertyIdentifier);
                expect(result.length).toBe(1);
                var firstResult = result[0];
                expect(firstResult.objectName).toBe('general');
                expect(firstResult.properties['property']).toBeDefined();
            });
            it('createPropertiesToHost: no selection should result in empty VisualObjectInstance', function () {
                var propertyIdentifier = {
                    objectName: 'general',
                    propertyName: 'property'
                };
                var result = interactivityService.createPropertiesToHost(propertyIdentifier);
                expect(result.length).toBe(1);
                var firstResult = result[0];
                expect(firstResult.objectName).toBe('general');
                expect(firstResult.properties['property']).toBeUndefined();
            });
        });
    });
})(powerbitests || (powerbitests = {}));
