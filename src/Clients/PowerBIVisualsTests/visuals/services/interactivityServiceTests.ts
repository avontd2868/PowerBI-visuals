//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbitests {
    import SelectableDataPoint = powerbi.visuals.SelectableDataPoint;
    import SelectionId = powerbi.visuals.SelectionId;

    describe('Web interactivity service',() => {
        var interactivityService: powerbi.visuals.WebInteractivityService;

        var categoryA = mocks.dataViewScopeIdentity("A");
        var categoryB = mocks.dataViewScopeIdentity("B");

        describe('',() => {

            beforeEach(() => {
                var host = powerbitests.mocks.createVisualHostServices();
                interactivityService = new powerbi.visuals.WebInteractivityService(host);
            });

            it('selecting a single data point should set selected state',() => {
                var dataPoints: SelectableDataPoint[] = [
                    { selected: false, identity: SelectionId.createWithId(categoryA, false) },
                    { selected: true, identity: SelectionId.createWithId(categoryB, false) },
                ];

                interactivityService.selectableDataPoints = dataPoints;
                interactivityService.select(dataPoints[0], false);

                expect(dataPoints[0].selected).toBeTruthy();
                expect(dataPoints[1].selected).toBeFalsy();
            });

            it('selecting a highlighted data point should select non-highlight data point with the same id',() => {
                var dataPoints: SelectableDataPoint[] = [
                    { selected: false, identity: SelectionId.createWithId(categoryA, true) },
                    { selected: false, identity: SelectionId.createWithId(categoryA, false) },
                ];

                interactivityService.selectableDataPoints = dataPoints;
                interactivityService.select(dataPoints[0], false);

                expect(dataPoints[0].selected).toBeFalsy();
                expect(dataPoints[1].selected).toBeTruthy();
            });

            it('createPropertiesToHost: selecting a dataPoint should result in a VisualObjectInstance',() => {
                var dataPoints: SelectableDataPoint[] = [
                    { selected: false, identity: SelectionId.createWithId(categoryA, false) },
                ];

                interactivityService.selectableDataPoints = dataPoints;
                interactivityService.select(dataPoints[0], true);

                var propertyIdentifier: powerbi.DataViewObjectPropertyIdentifier = {
                    objectName: 'general',
                    propertyName: 'property'
                };

                var result = interactivityService.createPropertiesToHost(propertyIdentifier);
                expect(result.length).toBe(1);
                var firstResult = result[0];
                expect(firstResult.objectName).toBe('general');
                expect(firstResult.properties['property']).toBeDefined();
            });

            it('createPropertiesToHost: no selection should result in empty VisualObjectInstance',() => {
                var propertyIdentifier: powerbi.DataViewObjectPropertyIdentifier = {
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
} 