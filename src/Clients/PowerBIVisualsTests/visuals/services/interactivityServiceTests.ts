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