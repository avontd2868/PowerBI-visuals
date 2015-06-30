//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbitests;
(function (powerbitests) {
    var Slicer = powerbi.visuals.Slicer;
    var DataViewTransform = powerbi.data.DataViewTransform;
    var EventType = powerbitests.helpers.ClickEventType;
    var ValueType = powerbi.ValueType;
    var SelectionId = powerbi.visuals.SelectionId;
    var DefaultWaitForRender = 100;
    describe("Slicer", function () {
        it('Slicer_registered_capabilities', function () {
            expect(powerbi.visuals.visualPluginFactory.create().getPlugin('slicer').capabilities).toBe(powerbi.visuals.slicerCapabilities);
        });
        it('Capabilities should include dataViewMapping', function () {
            expect(powerbi.visuals.slicerCapabilities.dataViewMappings).toBeDefined();
            expect(powerbi.visuals.slicerCapabilities.dataViewMappings.length).toBe(1);
        });
        it('Capabilities should have condition', function () {
            expect(powerbi.visuals.slicerCapabilities.dataViewMappings[0].conditions.length).toBe(1);
            expect(powerbi.visuals.slicerCapabilities.dataViewMappings[0].conditions[0][powerbi.visuals.slicerCapabilities.dataRoles[0].name].max).toBe(1);
        });
        it('Capabilities should include dataRoles', function () {
            expect(powerbi.visuals.slicerCapabilities.dataRoles).toBeDefined();
            expect(powerbi.visuals.slicerCapabilities.dataRoles.length).toBe(1);
        });
        it('Capabilities should suppressDefaultTitle', function () {
            expect(powerbi.visuals.slicerCapabilities.suppressDefaultTitle).toBe(true);
        });
        it('Filter property should match calculated', function () {
            expect(powerbi.data.DataViewObjectDescriptors.findFilterOutput(powerbi.visuals.slicerCapabilities.objects)).toEqual(powerbi.visuals.slicerProps.filterPropertyIdentifier);
        });
    });
    describe("Slicer DOM tests", function () {
        var v, element;
        var dataViewMetadata = {
            columns: [
                { name: 'Fruit', properties: { "Category": true }, type: ValueType.fromDescriptor({ text: true }) },
                { name: 'Price', isMeasure: true }
            ],
        };
        var dataViewCategorical = {
            categories: [{
                source: dataViewMetadata.columns[0],
                values: ['Apple', 'Orange', 'Kiwi', 'Grapes', 'Banana'],
                identity: [
                    powerbitests.mocks.dataViewScopeIdentity('Apple'),
                    powerbitests.mocks.dataViewScopeIdentity('Orange'),
                    powerbitests.mocks.dataViewScopeIdentity('Kiwi'),
                    powerbitests.mocks.dataViewScopeIdentity('Grapes'),
                    powerbitests.mocks.dataViewScopeIdentity('Banana'),
                ]
            }],
            values: DataViewTransform.createValueColumns([{
                source: dataViewMetadata.columns[1],
                values: [20, 10, 30, 15, 12]
            }]),
        };
        var dataView = {
            metadata: dataViewMetadata,
            categorical: dataViewCategorical
        };
        beforeEach(function () {
            createSlicer();
        });
        function createSlicer() {
            element = powerbitests.helpers.testDom('200', '300');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('slicer').create();
            var settings;
            v.init({
                element: element,
                host: powerbitests.mocks.createVisualHostServices(),
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                settings: settings,
            });
        }
        it('Slicer DOM Validation', function (done) {
            spyOn(powerbi.visuals.valueFormatter, 'format').and.callThrough();
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(function () {
                expect($('.slicerContainer')).toBeInDOM();
                expect($('.slicerContainer .headerText')).toBeInDOM();
                expect($('.slicerContainer .slicerHeader .clear')).toBeInDOM();
                expect($('.slicerContainer .slicerBody')).toBeInDOM();
                expect($('.slicerContainer .slicerBody .row .slicerText')).toBeInDOM();
                expect($('.slicerText').length).toBe(5);
                expect($('.slicerText').first().text()).toBe('Apple');
                expect($('.slicerText').last().text()).toBe('Banana');
                expect(powerbi.visuals.valueFormatter.format).toHaveBeenCalledWith('Apple', undefined);
                expect(powerbi.visuals.valueFormatter.format).toHaveBeenCalledWith('Orange', undefined);
                expect(powerbi.visuals.valueFormatter.format).toHaveBeenCalledWith('Kiwi', undefined);
                expect(powerbi.visuals.valueFormatter.format).toHaveBeenCalledWith('Grapes', undefined);
                expect(powerbi.visuals.valueFormatter.format).toHaveBeenCalledWith('Banana', undefined);
                // Subsequent update
                var dataView2 = {
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['Strawberry', 'Blueberry', 'Blackberry'],
                            identity: [
                                powerbitests.mocks.dataViewScopeIdentity('Strawberry'),
                                powerbitests.mocks.dataViewScopeIdentity('Blueberry'),
                                powerbitests.mocks.dataViewScopeIdentity('Blackberry'),
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [40, 25, 22]
                        }]),
                    }
                };
                v.onDataChanged({ dataViews: [dataView2] });
                setTimeout(function () {
                    expect($('.slicerContainer')).toBeInDOM();
                    expect($('.slicerContainer .headerText')).toBeInDOM();
                    expect($('.slicerContainer .slicerHeader .clear')).toBeInDOM();
                    expect($('.slicerContainer .slicerBody')).toBeInDOM();
                    expect($('.slicerContainer .slicerBody .row .slicerText')).toBeInDOM();
                    expect($('.slicerText').length).toBe(3);
                    expect($('.slicerText').first().text()).toBe('Strawberry');
                    expect($('.slicerText').last().text()).toBe('Blackberry');
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });
        it('Validate converter', function (done) {
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(function () {
                var slicerData = Slicer.converter(dataView);
                expect(slicerData.slicerDataPoints.length).toBe(5);
                var dataViewIdentities = dataView.categorical.categories[0].identity;
                var selectionIds = [
                    SelectionId.createWithId(dataViewIdentities[0]),
                    SelectionId.createWithId(dataViewIdentities[1]),
                    SelectionId.createWithId(dataViewIdentities[2]),
                    SelectionId.createWithId(dataViewIdentities[3]),
                    SelectionId.createWithId(dataViewIdentities[4]),
                ];
                var dataPoints = [
                    {
                        value: 'Apple',
                        mouseOver: false,
                        mouseOut: true,
                        identity: selectionIds[0],
                        selected: false
                    },
                    {
                        value: 'Orange',
                        mouseOver: false,
                        mouseOut: true,
                        identity: selectionIds[1],
                        selected: false
                    },
                    {
                        value: 'Kiwi',
                        mouseOver: false,
                        mouseOut: true,
                        identity: selectionIds[2],
                        selected: false
                    },
                    {
                        value: 'Grapes',
                        mouseOver: false,
                        mouseOut: true,
                        identity: selectionIds[3],
                        selected: false
                    },
                    {
                        value: 'Banana',
                        mouseOver: false,
                        mouseOut: true,
                        identity: selectionIds[4],
                        selected: false
                    }
                ];
                expect(slicerData).toEqual({ categorySourceName: 'Fruit', formatString: undefined, slicerDataPoints: dataPoints });
                done();
            }, DefaultWaitForRender);
        });
        it('Null dataView test', function (done) {
            v.onDataChanged({ dataViews: [] });
            setTimeout(function () {
                expect($('.slicerText').length).toBe(0);
                done();
            }, DefaultWaitForRender);
        });
        it('Slicer resize', function (done) {
            var viewport = {
                height: 200,
                width: 300
            };
            v.onResizing(viewport, 100);
            setTimeout(function () {
                expect($('.slicerContainer .slicerBody').first().css('height')).toBe('148px');
                expect($('.slicerContainer .slicerBody').first().css('width')).toBe('300px');
                expect($('.slicerContainer .headerText').first().css('width')).toBe('271px');
                // Next Resize
                var viewport2 = {
                    height: 150,
                    width: 150
                };
                v.onResizing(viewport2, 100);
                setTimeout(function () {
                    expect($('.slicerContainer .slicerBody').first().css('height')).toBe('98px');
                    expect($('.slicerContainer .slicerBody').first().css('width')).toBe('150px');
                    expect($('.slicerContainer .headerText').first().css('width')).toBe('121px');
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });
    });
    describe("Slicer Interactivity", function () {
        var v, element, slicers, slicerCheckboxInput;
        var hostServices;
        var dataViewMetadata = {
            columns: [
                { name: 'Fruit', properties: { "Category": true }, type: ValueType.fromDescriptor({ text: true }) },
                { name: 'Price', isMeasure: true }
            ],
        };
        var dataViewCategorical = {
            categories: [{
                source: dataViewMetadata.columns[0],
                values: ['Apple', 'Orange', 'Kiwi', 'Grapes', 'Banana'],
                identity: [
                    powerbitests.mocks.dataViewScopeIdentity('Apple'),
                    powerbitests.mocks.dataViewScopeIdentity('Orange'),
                    powerbitests.mocks.dataViewScopeIdentity('Kiwi'),
                    powerbitests.mocks.dataViewScopeIdentity('Grapes'),
                    powerbitests.mocks.dataViewScopeIdentity('Banana'),
                ]
            }],
            values: DataViewTransform.createValueColumns([{
                source: dataViewMetadata.columns[1],
                values: [20, 10, 30, 15, 12]
            }]),
        };
        var interactiveDataViewOptions = {
            dataViews: [{
                metadata: dataViewMetadata,
                categorical: dataViewCategorical
            }]
        };
        beforeEach(function () {
            element = powerbitests.helpers.testDom('200', '300');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('slicer').create();
            hostServices = powerbitests.mocks.createVisualHostServices();
            var settings;
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                settings: settings,
                interactivity: { selection: true }
            });
            v.onDataChanged(interactiveDataViewOptions);
            slicers = $('.slicerText');
            slicerCheckboxInput = $('label.slicerCheckbox').find('input');
            spyOn(hostServices, 'onSelect').and.callThrough();
        });
        it('slicer item select', function (done) {
            setTimeout(function () {
                slicers.first().d3Click(0, 0);
                expect(slicers[0].style.color).toBe('rgb(33, 33, 33)');
                expect(d3.select(slicerCheckboxInput[0]).property('checked')).toBe(true);
                expect(slicers[1].style.color).toBe('rgb(102, 102, 102)');
                expect(d3.select(slicerCheckboxInput[1]).property('checked')).toBe(false);
                expect(hostServices.onSelect).toHaveBeenCalledWith({
                    data: [
                        {
                            data: [
                                interactiveDataViewOptions.dataViews[0].categorical.categories[0].identity[0],
                            ]
                        }
                    ]
                });
                done();
            }, DefaultWaitForRender);
        });
        it('slicer item multi-select checkboxes', function (done) {
            setTimeout(function () {
                slicers.first().d3Click(0, 0);
                expect(slicers[0].style.color).toBe('rgb(33, 33, 33)');
                expect(slicers[1].style.color).toBe('rgb(102, 102, 102)');
                expect(d3.select(slicerCheckboxInput[0]).property('checked')).toBe(true);
                expect(hostServices.onSelect).toHaveBeenCalledWith({
                    data: [
                        {
                            data: [
                                interactiveDataViewOptions.dataViews[0].categorical.categories[0].identity[0],
                            ]
                        }
                    ]
                });
                slicers.last().d3Click(0, 0);
                expect(slicers[0].style.color).toBe('rgb(33, 33, 33)');
                expect(slicers[4].style.color).toBe('rgb(33, 33, 33)');
                expect(slicers[1].style.color).toBe('rgb(102, 102, 102)');
                expect(d3.select(slicerCheckboxInput[0]).property('checked')).toBe(true);
                expect(d3.select(slicerCheckboxInput[1]).property('checked')).toBe(false);
                expect(d3.select(slicerCheckboxInput[4]).property('checked')).toBe(true);
                expect(hostServices.onSelect).toHaveBeenCalledWith({
                    data: [
                        {
                            data: [
                                interactiveDataViewOptions.dataViews[0].categorical.categories[0].identity[0],
                            ]
                        },
                        {
                            data: [
                                interactiveDataViewOptions.dataViews[0].categorical.categories[0].identity[4],
                            ]
                        }
                    ]
                });
                done();
            }, DefaultWaitForRender);
        });
        it('slicer item multi-select with control key', function (done) {
            setTimeout(function () {
                slicers.first().d3Click(0, 0);
                slicers.last().d3Click(0, 0, 1 /* CtrlKey */);
                expect(slicers[0].style.color).toBe('rgb(33, 33, 33)');
                expect(slicers[4].style.color).toBe('rgb(33, 33, 33)');
                expect(slicers[1].style.color).toBe('rgb(102, 102, 102)');
                expect(d3.select(slicerCheckboxInput[0]).property('checked')).toBe(true);
                expect(d3.select(slicerCheckboxInput[1]).property('checked')).toBe(false);
                expect(d3.select(slicerCheckboxInput[4]).property('checked')).toBe(true);
                expect(hostServices.onSelect).toHaveBeenCalledWith({
                    data: [
                        {
                            data: [
                                interactiveDataViewOptions.dataViews[0].categorical.categories[0].identity[0],
                            ]
                        },
                        {
                            data: [
                                interactiveDataViewOptions.dataViews[0].categorical.categories[0].identity[4],
                            ]
                        }
                    ]
                });
                done();
            }, DefaultWaitForRender);
        });
        it('slicer item repeated selection', function (done) {
            setTimeout(function () {
                slicers.first().d3Click(0, 0);
                slicers.last().d3Click(0, 0);
                slicers.last().d3Click(0, 0);
                expect(slicers[0].style.color).toBe('rgb(33, 33, 33)');
                expect(slicers[4].style.color).toBe('rgb(102, 102, 102)');
                expect(d3.select(slicerCheckboxInput[0]).property('checked')).toBe(true);
                expect(d3.select(slicerCheckboxInput[4]).property('checked')).toBe(false);
                done();
            }, DefaultWaitForRender);
        });
        it('slicer clear', function (done) {
            setTimeout(function () {
                var clearBtn = $('.clear');
                // Slicer click
                slicers.first().d3Click(0, 0);
                slicers.last().d3Click(0, 0);
                expect(slicers[0].style.color).toBe('rgb(33, 33, 33)');
                expect(slicers[4].style.color).toBe('rgb(33, 33, 33)');
                expect(slicers[1].style.color).toBe('rgb(102, 102, 102)');
                // Slicer clear
                clearBtn.first().d3Click(0, 0);
                expect(slicers[0].style.color).toBe('rgb(102, 102, 102)');
                expect(slicers[1].style.color).toBe('rgb(102, 102, 102)');
                expect(slicers[2].style.color).toBe('rgb(102, 102, 102)');
                expect(slicers[3].style.color).toBe('rgb(102, 102, 102)');
                expect(slicers[4].style.color).toBe('rgb(102, 102, 102)');
                expect(hostServices.onSelect).toHaveBeenCalledWith({
                    data: []
                });
                done();
            }, DefaultWaitForRender);
        });
        it('slicer mouseover', function (done) {
            setTimeout(function () {
                var slicers = $('.slicerText');
                var event = document.createEvent('Event');
                event.initEvent('mouseover', true, true);
                slicers[0].dispatchEvent(event);
                expect(slicers[0].style.color).toBe('rgb(33, 33, 33)');
                expect(slicers[1].style.color).toBe('rgb(102, 102, 102)');
                expect(d3.select(slicerCheckboxInput[0]).property('checked')).toBe(false);
                done();
            }, DefaultWaitForRender);
        });
        it('slicer mouseout', function (done) {
            setTimeout(function () {
                // mouseover, mouseout
                var mouseOverEvent = document.createEvent('Event');
                mouseOverEvent.initEvent('mouseover', true, true);
                slicers[0].dispatchEvent(mouseOverEvent);
                expect(slicers[0].style.color).toBe('rgb(33, 33, 33)');
                var mouseOutEvent = document.createEvent('Event');
                mouseOutEvent.initEvent('mouseout', true, true);
                slicers[0].dispatchEvent(mouseOutEvent);
                expect(slicers[0].style.color).toBe('rgb(102, 102, 102)');
                slicers.first().d3Click(0, 0);
                expect(slicers[0].style.color).toBe('rgb(33, 33, 33)');
                var mouseOverEvent1 = document.createEvent('Event');
                mouseOverEvent1.initEvent('mouseover', true, true);
                slicers[0].dispatchEvent(mouseOverEvent1);
                expect(slicers[0].style.color).toBe('rgb(33, 33, 33)');
                var mouseOutEvent1 = document.createEvent('Event');
                mouseOutEvent1.initEvent('mouseout', true, true);
                slicers[0].dispatchEvent(mouseOutEvent1);
                expect(slicers[0].style.color).toBe('rgb(33, 33, 33)');
                done();
            }, DefaultWaitForRender);
        });
        it('slicer loadMoreData noSegment', function () {
            var listViewOptions = v['listView']['options'];
            var loadMoreSpy = spyOn(hostServices, "loadMoreData");
            listViewOptions.loadMoreData();
            expect(loadMoreSpy).not.toHaveBeenCalled();
        });
        it('slicer loadMoreData', function () {
            var metadata = {
                columns: [
                    { name: 'Fruit', properties: { "Category": true }, type: ValueType.fromDescriptor({ text: true }) },
                    { name: 'Price', isMeasure: true }
                ],
                segment: {},
            };
            var interactiveDataViewOptions = {
                dataViews: [{ metadata: metadata, categorical: dataViewCategorical }]
            };
            v.onDataChanged(interactiveDataViewOptions);
            var listViewOptions = v['listView']['options'];
            var loadMoreSpy = spyOn(hostServices, "loadMoreData");
            listViewOptions.loadMoreData();
            expect(loadMoreSpy).toHaveBeenCalled();
        });
        it('slicer loadMoreData already called', function () {
            var metadata = {
                columns: [
                    { name: 'Fruit', properties: { "Category": true }, type: ValueType.fromDescriptor({ text: true }) },
                    { name: 'Price', isMeasure: true }
                ],
                segment: {},
            };
            var interactiveDataViewOptions = {
                dataViews: [{ metadata: metadata, categorical: dataViewCategorical }]
            };
            v.onDataChanged(interactiveDataViewOptions);
            var listViewOptions = v['listView']['options'];
            var loadMoreSpy = spyOn(hostServices, "loadMoreData");
            listViewOptions.loadMoreData();
            listViewOptions.loadMoreData();
            expect(loadMoreSpy.calls.all().length).toBe(1);
        });
    });
})(powerbitests || (powerbitests = {}));
