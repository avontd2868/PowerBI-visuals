//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbitests;
(function (powerbitests) {
    var DataViewTransform = powerbi.data.DataViewTransform;
    var FunnelChart = powerbi.visuals.FunnelChart;
    var DataShapeUtility = powerbi.data.dsr.DataShapeUtility;
    var SemanticType = powerbi.data.SemanticType;
    var EventType = powerbitests.helpers.ClickEventType;
    var SelectionId = powerbi.visuals.SelectionId;
    var VisualHostServices = powerbi.explore.services.VisualHostServices;
    var DefaultRenderTime = 300;
    describe("FunnelChart", function () {
        it('FunnelChart registered capabilities', function () {
            expect(powerbi.visuals.visualPluginFactory.create().getPlugin('funnel').capabilities).toBe(powerbi.visuals.funnelChartCapabilities);
        });
        it('Capabilities should include dataViewMappings', function () {
            expect(powerbi.visuals.funnelChartCapabilities.dataViewMappings).toBeDefined();
        });
        it('Capabilities should include dataRoles', function () {
            expect(powerbi.visuals.funnelChartCapabilities.dataRoles).toBeDefined();
        });
        it('Capabilities should not suppressDefaultTitle', function () {
            expect(powerbi.visuals.funnelChartCapabilities.suppressDefaultTitle).toBeUndefined();
        });
        it('FormatString property should match calculated', function () {
            expect(powerbi.data.DataViewObjectDescriptors.findFormatString(powerbi.visuals.funnelChartCapabilities.objects)).toEqual(powerbi.visuals.funnelChartProps.general.formatString);
        });
    });
    describe("FunnelChart Dataview Validation", function () {
        beforeEach(function () {
            VisualHostServices.initialize(powerbi.common.createLocalizationService());
        });
        var dataViewMetadata = {
            columns: [
                { name: 'col1' },
                { name: 'col2', isMeasure: true },
            ]
        };
        it('Check converter with multi-catagories', function () {
            var categoryIdentities = [
                powerbitests.mocks.dataViewScopeIdentity("John Domo"),
                powerbitests.mocks.dataViewScopeIdentity("Delta Force"),
                powerbitests.mocks.dataViewScopeIdentity("Jean Tablau"),
            ];
            var dataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau'],
                        identity: categoryIdentities,
                        objects: [
                            { dataPoint: { fill: { solid: { color: "#FF0000" } } } },
                            { dataPoint: { fill: { solid: { color: "#00FF00" } } } },
                            { dataPoint: { fill: { solid: { color: "#0000FF" } } } }
                        ]
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100, 200, 700]
                    }])
                }
            };
            var defaultDataPointColor = "#00FF00";
            var actualData = FunnelChart.converter(dataView, defaultDataPointColor, defaultDataPointColor);
            var selectionIds = [
                SelectionId.createWithIdAndMeasure(categoryIdentities[0], 'col2'),
                SelectionId.createWithIdAndMeasure(categoryIdentities[1], 'col2'),
                SelectionId.createWithIdAndMeasure(categoryIdentities[2], 'col2')
            ];
            var expectedData = {
                slices: [
                    {
                        value: 100,
                        label: 'John Domo',
                        identity: selectionIds[0],
                        key: selectionIds[0].getKey(),
                        selected: false,
                        categoryOrMeasureIndex: 0,
                        tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col2", value: "100" }],
                        color: "#FF0000",
                        labelFill: "#FF0000",
                        showLabel: true
                    },
                    {
                        value: 200,
                        label: 'Delta Force',
                        identity: selectionIds[1],
                        key: selectionIds[1].getKey(),
                        selected: false,
                        categoryOrMeasureIndex: 1,
                        tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col2", value: "200" }],
                        color: "#00FF00",
                        labelFill: "#00FF00",
                        showLabel: true
                    },
                    {
                        value: 700,
                        label: 'Jean Tablau',
                        identity: selectionIds[2],
                        key: selectionIds[2].getKey(),
                        selected: false,
                        categoryOrMeasureIndex: 2,
                        tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col2", value: "700" }],
                        color: "#0000FF",
                        labelFill: "#0000FF",
                        showLabel: true
                    }
                ],
                valuesMetadata: [{ name: 'col2', isMeasure: true }],
                hasHighlights: false,
                highlightsOverflow: false,
                dataLabelsSettings: powerbi.visuals.dataLabelUtils.getDefaultFunnelLabelSettings(defaultDataPointColor)
            };
            expect(actualData).toEqual(expectedData);
        });
        it('Validate highlighted tooltip', function () {
            var categoryIdentities = [
                powerbitests.mocks.dataViewScopeIdentity("John Domo"),
                powerbitests.mocks.dataViewScopeIdentity("Delta Force"),
                powerbitests.mocks.dataViewScopeIdentity("Jean Tablau"),
            ];
            var dataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau'],
                        identity: categoryIdentities,
                        objects: [
                            { dataPoint: { fill: { solid: { color: "#FF0000" } } } },
                            { dataPoint: { fill: { solid: { color: "#00FF00" } } } },
                            { dataPoint: { fill: { solid: { color: "#0000FF" } } } }
                        ]
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100, 200, 700],
                        highlights: [0, 140, 420]
                    }])
                }
            };
            var defaultDataPointColor = "#00FF00";
            var actualData = FunnelChart.converter(dataView, defaultDataPointColor, defaultDataPointColor);
            //first tooltip is regular because highlighted value is 0
            expect(actualData.slices[0].tooltipInfo).toEqual([{ displayName: "col1", value: "John Domo" }, { displayName: "col2", value: "100" }]);
            expect(actualData.slices[1].tooltipInfo).toEqual([{ displayName: "col1", value: "John Domo" }, { displayName: "col2", value: "100" }]);
            //tooltips with highlighted value
            expect(actualData.slices[2].tooltipInfo).toEqual([{ displayName: "col1", value: "Delta Force" }, { displayName: "col2", value: "200" }, { displayName: powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName, value: "140" }]);
            expect(actualData.slices[3].tooltipInfo).toEqual([{ displayName: "col1", value: "Delta Force" }, { displayName: "col2", value: "200" }, { displayName: powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName, value: "140" }]);
            expect(actualData.slices[4].tooltipInfo).toEqual([{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col2", value: "700" }, { displayName: powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName, value: "420" }]);
            expect(actualData.slices[5].tooltipInfo).toEqual([{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col2", value: "700" }, { displayName: powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName, value: "420" }]);
        });
    });
    it('Check converter with multi-category and multi-measures', function () {
        var categoryIdentities = [
            powerbitests.mocks.dataViewScopeIdentity("John Domo"),
            powerbitests.mocks.dataViewScopeIdentity("Bugs Bunny"),
        ];
        var dataViewMetadata = {
            columns: [
                { name: 'col1' },
                { name: 'col2', isMeasure: true },
                { name: 'col3', isMeasure: true }
            ]
        };
        var dataView = {
            metadata: dataViewMetadata,
            categorical: {
                categories: [{
                    source: dataViewMetadata.columns[0],
                    values: ['John Domo', 'Bugs Bunny'],
                    identity: categoryIdentities,
                    objects: [
                        { dataPoint: { fill: { solid: { color: "#FF0000" } } } },
                        { dataPoint: { fill: { solid: { color: "#00FF00" } } } }
                    ]
                }],
                values: DataViewTransform.createValueColumns([{
                    source: dataViewMetadata.columns[1],
                    values: [100, 200],
                    subtotal: 300
                }, {
                    source: dataViewMetadata.columns[2],
                    values: [300, 500],
                    subtotal: 800
                },])
            }
        };
        var defaultDataPointColor = "#00FF00";
        var actualData = FunnelChart.converter(dataView, defaultDataPointColor, defaultDataPointColor);
        var selectionIds = [
            SelectionId.createWithIdAndMeasure(categoryIdentities[0], 'col2'),
            SelectionId.createWithIdAndMeasure(categoryIdentities[1], 'col2'),
        ];
        var expectedData = {
            slices: [
                {
                    value: 400,
                    label: 'John Domo',
                    identity: selectionIds[0],
                    selected: false,
                    categoryOrMeasureIndex: 0,
                    key: selectionIds[0].getKey(),
                    tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col2", value: "400" }],
                    color: "#FF0000",
                    labelFill: "#FF0000",
                    showLabel: true
                },
                {
                    value: 700,
                    label: 'Bugs Bunny',
                    identity: selectionIds[1],
                    selected: false,
                    categoryOrMeasureIndex: 1,
                    key: selectionIds[1].getKey(),
                    tooltipInfo: [{ displayName: "col1", value: "Bugs Bunny" }, { displayName: "col2", value: "700" }],
                    color: "#00FF00",
                    labelFill: "#00FF00",
                    showLabel: true
                }
            ],
            valuesMetadata: [{ name: 'col2', isMeasure: true }, { name: 'col3', isMeasure: true }],
            hasHighlights: false,
            highlightsOverflow: false,
            dataLabelsSettings: powerbi.visuals.dataLabelUtils.getDefaultFunnelLabelSettings(defaultDataPointColor)
        };
        expect(actualData).toEqual(expectedData);
    });
    it('Check converter with single category but multi-measures', function () {
        var dataViewMetadata = {
            columns: [
                { name: 'col1' },
                { name: 'col2', isMeasure: true },
                { name: 'col3', isMeasure: true }
            ]
        };
        var dataView = {
            metadata: dataViewMetadata,
            categorical: {
                categories: [{
                    source: dataViewMetadata.columns[0],
                    values: ['John Domo']
                }],
                values: DataViewTransform.createValueColumns([{
                    source: dataViewMetadata.columns[1],
                    values: [100],
                    subtotal: 100
                }, {
                    source: dataViewMetadata.columns[2],
                    values: [300],
                    subtotal: 300
                },])
            }
        };
        var defaultDataPointColor = "#00FF00";
        var actualData = FunnelChart.converter(dataView, defaultDataPointColor, defaultDataPointColor);
        var selectionIds = [
            SelectionId.createWithMeasure("col2"),
            SelectionId.createWithMeasure("col3")
        ];
        var expectedData = {
            slices: [
                {
                    value: 100,
                    label: 'col2',
                    identity: selectionIds[0],
                    key: selectionIds[0].getKey(),
                    selected: false,
                    categoryOrMeasureIndex: 0,
                    tooltipInfo: [{ displayName: "col1", value: "col2" }, { displayName: "col2", value: "100" }],
                    color: '#00FF00',
                    labelFill: '#00FF00',
                    showLabel: true
                },
                {
                    value: 300,
                    label: 'col3',
                    identity: selectionIds[1],
                    key: selectionIds[1].getKey(),
                    selected: false,
                    categoryOrMeasureIndex: 1,
                    tooltipInfo: [{ displayName: "col1", value: "col3" }, { displayName: "col2", value: "300" }],
                    color: '#00FF00',
                    labelFill: '#00FF00',
                    showLabel: true
                }
            ],
            valuesMetadata: [dataViewMetadata.columns[1], dataViewMetadata.columns[2]],
            hasHighlights: false,
            highlightsOverflow: false,
            dataLabelsSettings: powerbi.visuals.dataLabelUtils.getDefaultFunnelLabelSettings(defaultDataPointColor)
        };
        expect(actualData).toEqual(expectedData);
    });
    it('non-categorical multi-measure tooltip values test', function () {
        var dataViewMetadata = {
            columns: [
                { name: 'a', isMeasure: true },
                { name: 'b', isMeasure: true },
                { name: 'c', isMeasure: true }
            ]
        };
        var dataView = {
            metadata: dataViewMetadata,
            categorical: {
                values: DataViewTransform.createValueColumns([
                    {
                        source: dataViewMetadata.columns[0],
                        values: [1]
                    },
                    {
                        source: dataViewMetadata.columns[1],
                        values: [2]
                    },
                    {
                        source: dataViewMetadata.columns[2],
                        values: [3]
                    }
                ])
            }
        };
        var defaultDataPointColor = "#00FF00";
        var actualData = FunnelChart.converter(dataView, defaultDataPointColor, defaultDataPointColor);
        expect(actualData.slices[0].tooltipInfo).toEqual([{ displayName: 'a', value: '1' }]);
        expect(actualData.slices[1].tooltipInfo).toEqual([{ displayName: 'b', value: '2' }]);
        expect(actualData.slices[2].tooltipInfo).toEqual([{ displayName: 'c', value: '3' }]);
    });
    describe("FunnelChart Interactivity", function () {
        var v, element;
        var hostServices;
        var dataViewMetadataCategorySeriesColumns = {
            columns: [
                { name: 'Squad', properties: { "Category": true }, type: DataShapeUtility.describeDataType(2048 /* String */) },
                { name: 'Period', properties: { "Series": true }, type: DataShapeUtility.describeDataType(1 /* Number */) },
                { name: null, groupName: '201501', isMeasure: true, properties: { "Values": true }, type: DataShapeUtility.describeDataType(1 /* Number */) },
                { name: null, groupName: '201502', isMeasure: true, properties: { "Values": true }, type: DataShapeUtility.describeDataType(1 /* Number */) },
                { name: null, groupName: '201503', isMeasure: true, properties: { "Values": true }, type: DataShapeUtility.describeDataType(1 /* Number */) }
            ]
        };
        var DefaultOpacity = "" + FunnelChart.DefaultBarOpacity;
        var DimmedOpacity = "" + FunnelChart.DimmedBarOpacity;
        var interactiveDataViewOptions = {
            dataViews: [{
                metadata: dataViewMetadataCategorySeriesColumns,
                categorical: {
                    categories: [{
                        source: dataViewMetadataCategorySeriesColumns.columns[0],
                        values: ['A', 'B'],
                        identity: [
                            powerbitests.mocks.dataViewScopeIdentity('a'),
                            powerbitests.mocks.dataViewScopeIdentity('b'),
                        ]
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataCategorySeriesColumns.columns[2],
                            values: [110, 120],
                            identity: powerbitests.mocks.dataViewScopeIdentity('201501')
                        },
                        {
                            source: dataViewMetadataCategorySeriesColumns.columns[3],
                            values: [210, 220],
                            identity: powerbitests.mocks.dataViewScopeIdentity('201502')
                        },
                        {
                            source: dataViewMetadataCategorySeriesColumns.columns[4],
                            values: [310, 320],
                            identity: powerbitests.mocks.dataViewScopeIdentity('201503')
                        }
                    ])
                }
            }]
        };
        beforeEach(function () {
            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('funnel').create();
            hostServices = powerbitests.mocks.createVisualHostServices();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { selection: true }
            });
        });
        it('funnel chart category select', function (done) {
            v.onDataChanged(interactiveDataViewOptions);
            setTimeout(function () {
                var bars = $('.funnelChart .funnelBar');
                spyOn(hostServices, 'onSelect').and.callThrough();
                bars.first().d3Click(0, 0);
                expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
                expect(bars[1].style.fillOpacity).toBe(DimmedOpacity);
                expect(hostServices.onSelect).toHaveBeenCalledWith({
                    data: [
                        {
                            data: [interactiveDataViewOptions.dataViews[0].categorical.categories[0].identity[0]]
                        }
                    ]
                });
                done();
            });
        });
        it('funnel chart category multi-select', function (done) {
            v.onDataChanged(interactiveDataViewOptions);
            setTimeout(function () {
                var bars = $('.funnelChart .funnelBar');
                spyOn(hostServices, 'onSelect').and.callThrough();
                bars.first().d3Click(0, 0);
                expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
                expect(bars[1].style.fillOpacity).toBe(DimmedOpacity);
                expect(hostServices.onSelect).toHaveBeenCalledWith({
                    data: [
                        {
                            data: [interactiveDataViewOptions.dataViews[0].categorical.categories[0].identity[0]]
                        }
                    ]
                });
                bars.last().d3Click(0, 0, 1 /* CtrlKey */);
                expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
                expect(bars[1].style.fillOpacity).toBe(DefaultOpacity);
                expect(hostServices.onSelect).toHaveBeenCalledWith({
                    data: [
                        {
                            data: [
                                interactiveDataViewOptions.dataViews[0].categorical.categories[0].identity[0],
                            ]
                        },
                        {
                            data: [
                                interactiveDataViewOptions.dataViews[0].categorical.categories[0].identity[1],
                            ]
                        }
                    ]
                });
                done();
            });
        });
        it('funnel chart external clear', function (done) {
            v.onDataChanged(interactiveDataViewOptions);
            setTimeout(function () {
                var bars = $('.funnelChart .funnelBar');
                spyOn(hostServices, 'onSelect').and.callThrough();
                bars.first().d3Click(0, 0);
                expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
                expect(bars[1].style.fillOpacity).toBe(DimmedOpacity);
                expect(hostServices.onSelect).toHaveBeenCalledWith({
                    data: [
                        {
                            data: [interactiveDataViewOptions.dataViews[0].categorical.categories[0].identity[0]]
                        }
                    ]
                });
                v.onClearSelection();
                expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
                expect(bars[1].style.fillOpacity).toBe(DefaultOpacity);
                done();
            });
        });
        it('funnel chart clear on background click', function (done) {
            v.onDataChanged(interactiveDataViewOptions);
            setTimeout(function () {
                var bars = $('.funnelChart .funnelBar');
                spyOn(hostServices, 'onSelect').and.callThrough();
                bars.first().d3Click(0, 0);
                expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
                expect(bars[1].style.fillOpacity).toBe(DimmedOpacity);
                expect(hostServices.onSelect).toHaveBeenCalledWith({
                    data: [
                        {
                            data: [interactiveDataViewOptions.dataViews[0].categorical.categories[0].identity[0]]
                        }
                    ]
                });
                var svg = element.find('svg');
                svg.first().d3Click(0, 0);
                expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
                expect(bars[1].style.fillOpacity).toBe(DefaultOpacity);
                expect(hostServices.onSelect).toHaveBeenCalledWith({
                    data: []
                });
                done();
            });
        });
    });
    describe("FunnelChart DOM Validation", function () {
        var v, element;
        var translate = 94.5078125;
        var dataViewMetadata = {
            columns: [
                { name: 'col1' },
                { name: 'col2', isMeasure: true, objects: { general: { formatString: '$0' } } },
            ]
        };
        // because of different representations of the color (rgb, hex), "going through" the browser and getting its adjusted color value
        function adjustColor(colorToAdjust) {
            var dummy = $('<div/>');
            // Set the color of the div to the color, and read it back.
            $(dummy).css('color', colorToAdjust);
            return $(dummy).css('color');
        }
        beforeEach(function () {
            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('funnel').create();
            v.init({
                element: element,
                host: powerbitests.mocks.createVisualHostServices(),
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true }
            });
        });
        it('Ensure DOM built', function (done) {
            var categoryIdentities = [
                powerbitests.mocks.dataViewScopeIdentity("John Domo"),
                powerbitests.mocks.dataViewScopeIdentity("Delta Force"),
                powerbitests.mocks.dataViewScopeIdentity("Jean Tablau"),
            ];
            var dataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100, 200, 700]
                    }])
                }
            };
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(function () {
                expect($('.funnelChart g').length).toBe(6);
                expect($('.funnelChart .axis').find('text').length).toBe(3);
                expect($('.funnelChart .innerTextGroup').find('text').length).toBe(3);
                expect($('.funnelChart .innerTextGroup').find('text').first().text()).toBe('$100');
                done();
            }, DefaultRenderTime);
        });
        it('Funnel partial highlight', function (done) {
            var categoryIdentities = [
                powerbitests.mocks.dataViewScopeIdentity("John Domo"),
                powerbitests.mocks.dataViewScopeIdentity("Delta Force"),
                powerbitests.mocks.dataViewScopeIdentity("Jean Tablau"),
            ];
            var dataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100, 200, 700],
                        highlights: [50, 140, 420],
                        subtotal: 1000
                    }])
                }
            };
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(function () {
                expect($('.funnelChart g').length).toBe(6);
                expect($('.funnelBar').length).toBe(6);
                expect($('.highlight').length).toBe(3);
                expect(+$('.highlight')[0].attributes.getNamedItem('height').value).toBeLessThan(+$('.funnelBar')[0].attributes.getNamedItem('height').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('y').value).toBeGreaterThan(+$('.funnelBar')[0].attributes.getNamedItem('y').value);
                expect($('.funnelChart .axis').find('text').length).toBe(3);
                done();
            }, DefaultRenderTime);
        });
        it('Funnel partial highlight with overflow', function (done) {
            var categoryIdentities = [
                powerbitests.mocks.dataViewScopeIdentity("John Domo"),
                powerbitests.mocks.dataViewScopeIdentity("Delta Force"),
                powerbitests.mocks.dataViewScopeIdentity("Jean Tablau"),
            ];
            var dataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100, 200, 700],
                        highlights: [150, 340, 720],
                        subtotal: 1000
                    }])
                }
            };
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(function () {
                expect($('.funnelChart g').length).toBe(6);
                expect($('.funnelBar').length).toBe(6);
                expect($('.highlight').length).toBe(3);
                expect(+$('.highlight')[0].attributes.getNamedItem('height').value).toBeGreaterThan(+$('.funnelBar')[0].attributes.getNamedItem('height').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('y').value).toBeLessThan(+$('.funnelBar')[0].attributes.getNamedItem('y').value);
                expect($('.funnelChart .axis').find('text').length).toBe(3);
                done();
            }, DefaultRenderTime);
        });
        it('Ensure Max Width is respected', function (done) {
            var categoryIdentities = [
                powerbitests.mocks.dataViewScopeIdentity("John Domo"),
                powerbitests.mocks.dataViewScopeIdentity("Delta Force"),
                powerbitests.mocks.dataViewScopeIdentity("Jean Tablau"),
            ];
            var dataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', 'Delta Force'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100, 200],
                        subtotal: 300
                    }])
                }
            };
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(function () {
                var rect = $('.funnelChart').find('rect').first();
                expect(rect.attr('width')).toBeLessThan(40);
                done();
            }, DefaultRenderTime);
        });
        it('Ensure Labels that do not fit in the bar are shown outside and are black ', function (done) {
            var categoryIdentities = [
                powerbitests.mocks.dataViewScopeIdentity("John Domo"),
                powerbitests.mocks.dataViewScopeIdentity("Delta Force"),
                powerbitests.mocks.dataViewScopeIdentity("Mr Bing"),
            ];
            var dataViewMetadataWithLabelsObject = powerbi.Prototype.inherit(dataViewMetadata);
            dataViewMetadataWithLabelsObject.objects = { labels: { labelPosition: powerbi.labelPosition.insideCenter } };
            var dataView = {
                metadata: dataViewMetadataWithLabelsObject,
                categorical: {
                    categories: [{
                        source: dataViewMetadataWithLabelsObject.columns[0],
                        values: ['John Domo', 'Delta Force', 'Mr Bing'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadataWithLabelsObject.columns[1],
                        values: [1000, 2000, 20],
                        subtotal: 3020
                    }])
                }
            };
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(function () {
                var labels = $('.funnelChart .innerTextGroup text');
                var firstBarWidth = +$('.funnelChart').find('rect').first().attr('height');
                var firstBarX = +$('.funnelChart').find('rect').first().attr('x');
                var lastBarWidth = +$('.funnelChart').find('rect').last().attr('height');
                var lastBarX = +$('.funnelChart').find('rect').last().attr('x');
                var firstBar = firstBarWidth + firstBarX - translate;
                var lastBar = lastBarWidth + lastBarX - translate;
                expect(labels.length).toBe(3);
                expect($(labels[0]).attr('x')).toEqual($(labels[1]).attr('x'));
                expect($(labels[1]).attr('x')).not.toEqual($(labels[2]).attr('x'));
                expect(adjustColor($(labels[0]).css('fill'))).toEqual(adjustColor('#FFFFFF'));
                expect(adjustColor($(labels[2]).css('fill'))).toEqual(adjustColor('#000000'));
                expect($(labels[2]).attr('x')).toBeGreaterThan(lastBar); // Check that the last label is outside
                //Check that the firts label is inside
                expect($(labels[0]).attr('x')).toBeGreaterThan(firstBarX);
                expect($(labels[0]).attr('x')).toBeLessThan(firstBar);
                done();
            }, DefaultRenderTime);
        });
        it('Ensure Labels hide when viewport forces bars to be smaller than min hight', function (done) {
            var dataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Bugs Bunny', 'Mickey Mouse', 'Donald Duck', 'VRM Jones'],
                        identity: [
                            powerbitests.mocks.dataViewScopeIdentity('John Domo'),
                            powerbitests.mocks.dataViewScopeIdentity('Delta Force'),
                            powerbitests.mocks.dataViewScopeIdentity('Bugs Bunny'),
                            powerbitests.mocks.dataViewScopeIdentity('Mickey Mouse'),
                            powerbitests.mocks.dataViewScopeIdentity('Donald Duck'),
                            powerbitests.mocks.dataViewScopeIdentity('VRM Jones'),
                        ]
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100, 200, 300, 400, 500, 600],
                        subtotal: 2100
                    }])
                }
            };
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(function () {
                expect($('.funnelChart g').length).toBe(9);
                expect($('.funnelChart .axis').find('text').length).toBe(6);
                expect($('.funnelChart .innerTextGroup text').length).toBe(6);
                v.onResizing({ height: 50, width: 100 }, 0);
                setTimeout(function () {
                    expect($('.funnelChart g').length).toBe(3);
                    expect($('.funnelChart .axis').find('text').length).toBe(0);
                    expect($('.funnelChart .innerTextGroup text').length).toBe(0);
                    done();
                }, DefaultRenderTime);
            }, DefaultRenderTime);
        });
        //Validate default labels, and validate that first bar is too long and the label is inside and white 
        it('Default labels validation', function (done) {
            var metadataWithDisplayUnits = $.extend(true, {}, dataViewMetadata);
            metadataWithDisplayUnits.objects = { labels: { labelDisplayUnits: 1000 } };
            var fontSize = '12px';
            var categoryIdentities = [
                powerbitests.mocks.dataViewScopeIdentity("John Domo"),
                powerbitests.mocks.dataViewScopeIdentity("Delta Force"),
                powerbitests.mocks.dataViewScopeIdentity("Mr Bing"),
            ];
            var dataView = {
                metadata: metadataWithDisplayUnits,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Mr Bing'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [555, 2000, 20],
                        subtotal: 2575
                    }])
                }
            };
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(function () {
                var labels = $('.funnelChart .innerTextGroup text');
                var firstBarX = +$('.funnelChart').find('rect').first().attr('x');
                var firstBarWidth = +$('.funnelChart').find('rect').first().attr('height');
                var firstBarTranslated = firstBarX - translate;
                var firstBar = firstBarTranslated + firstBarWidth;
                var lastBarWidth = +$('.funnelChart').find('rect').last().attr('height');
                var lastBarX = +$('.funnelChart').find('rect').last().attr('x');
                var lastBar = lastBarWidth + lastBarX - translate;
                expect(labels.length).toBe(3);
                expect(adjustColor($(labels[0]).css('fill'))).toEqual(adjustColor($('.funnelChart').find('rect').first().css('fill')));
                expect(adjustColor($(labels[2]).css('fill'))).toEqual(adjustColor($('.funnelChart').find('rect').last().css('fill')));
                expect($(labels[0]).css('fill-opacity')).toEqual('1');
                expect($(labels[1]).css('fill-opacity')).toEqual('1');
                expect($(labels[2]).css('fill-opacity')).toEqual('1');
                expect($(labels.first().css('font-size')).selector).toBe(fontSize);
                expect($(labels[0]).text()).toEqual('$0.56K');
                expect($(labels[2]).attr('x')).toBeGreaterThan(lastBar); // Check that the last label is outside
                expect($(labels[0]).attr('x')).toBeGreaterThan(firstBar); // Check that the last label is outside
                done();
            }, DefaultRenderTime);
        });
        it('Validate that first bar is too long and the label is inside and white ', function (done) {
            var categoryIdentities = [
                powerbitests.mocks.dataViewScopeIdentity("John Domo"),
                powerbitests.mocks.dataViewScopeIdentity("Delta Force"),
                powerbitests.mocks.dataViewScopeIdentity("Mr Bing"),
            ];
            var dataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Mr Bing'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [1555, 2000, 20],
                        subtotal: 3575
                    }])
                }
            };
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(function () {
                var labels = $('.funnelChart .innerTextGroup text');
                var firstBarX = +$('.funnelChart').find('rect').first().attr('x');
                var firstBarWidth = +$('.funnelChart').find('rect').first().attr('height');
                var firstBarTranslated = firstBarX - translate;
                var firstBar = firstBarTranslated + firstBarWidth;
                //Display unit will be displayed only when displayUnit object has value, and not by default
                expect($(labels[0]).text()).toEqual('$1555');
                //the first bar is too long then label need to be inside and white
                expect(adjustColor($(labels[0]).css('fill'))).toEqual(adjustColor('#FFFFFF'));
                //Check that the labels position is inside
                expect($(labels[0]).attr('x')).toBeGreaterThan(firstBarTranslated);
                expect($(labels[0]).attr('x')).toBeLessThan(firstBar);
                done();
            }, DefaultRenderTime);
        });
        it('Change labels position validation', function (done) {
            var dataViewMetadataWithLabelsObject = powerbi.Prototype.inherit(dataViewMetadata);
            dataViewMetadataWithLabelsObject.objects = { labels: { labelPosition: powerbi.labelPosition.insideBase } };
            var categoryIdentities = [
                powerbitests.mocks.dataViewScopeIdentity("John Domo"),
                powerbitests.mocks.dataViewScopeIdentity("Delta Force"),
                powerbitests.mocks.dataViewScopeIdentity("Mr Bing"),
            ];
            var dataView = {
                metadata: dataViewMetadataWithLabelsObject,
                categorical: {
                    categories: [{
                        source: dataViewMetadataWithLabelsObject.columns[0],
                        values: ['John Domo', 'Delta Force', 'Mr Bing'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadataWithLabelsObject.columns[1],
                        values: [1000, 2000, 2000],
                        subtotal: 5000
                    }])
                }
            };
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(function () {
                var labels = $('.funnelChart .innerTextGroup .data-labels');
                var firstBarX = +$('.funnelChart').find('rect').first().attr('x');
                var firstBarWidth = +$('.funnelChart').find('rect').first().attr('height');
                var firstBarTranslated = firstBarX - translate;
                var firstBar = firstBarTranslated + firstBarWidth;
                expect(labels.length).toBe(3);
                expect(adjustColor($(labels[0]).css('fill'))).toEqual(adjustColor('#FFFFFF'));
                expect(adjustColor($(labels[1]).css('fill'))).toEqual(adjustColor('#FFFFFF'));
                expect(adjustColor($(labels[2]).css('fill'))).toEqual(adjustColor('#FFFFFF'));
                //Check that the labels position is inside
                expect($(labels[0]).attr('x')).toBeGreaterThan(firstBarTranslated);
                expect($(labels[0]).attr('x')).toBeLessThan(firstBar);
                done();
            }, DefaultRenderTime);
        });
        it('Change labels color validation', function (done) {
            var color = '#CC0099';
            var categoryIdentities = [
                powerbitests.mocks.dataViewScopeIdentity("John Domo"),
                powerbitests.mocks.dataViewScopeIdentity("Delta Force"),
                powerbitests.mocks.dataViewScopeIdentity("Mr Bing"),
            ];
            var dataViewMetadataWithLabelsObject = powerbi.Prototype.inherit(dataViewMetadata);
            dataViewMetadataWithLabelsObject.objects = {
                labels: {
                    color: { solid: { color: '#CC0099' } }
                }
            };
            var dataView = {
                metadata: dataViewMetadataWithLabelsObject,
                categorical: {
                    categories: [{
                        source: dataViewMetadataWithLabelsObject.columns[0],
                        values: ['John Domo', 'Delta Force', 'Mr Bing'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadataWithLabelsObject.columns[1],
                        values: [1555, 2000, 20],
                        subtotal: 3575
                    }])
                }
            };
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(function () {
                var labels = $('.funnelChart .innerTextGroup text');
                expect(labels.length).toBe(3);
                expect(adjustColor($(labels[0]).css('fill'))).toEqual(adjustColor(color));
                expect(adjustColor($(labels[1]).css('fill'))).toEqual(adjustColor(color));
                expect(adjustColor($(labels[2]).css('fill'))).toEqual(adjustColor(color));
                done();
            }, DefaultRenderTime);
        });
        it('Hide labels validation', function (done) {
            var categoryIdentities = [
                powerbitests.mocks.dataViewScopeIdentity("John Domo"),
                powerbitests.mocks.dataViewScopeIdentity("Delta Force"),
                powerbitests.mocks.dataViewScopeIdentity("Mr Bing"),
            ];
            var dataViewMetadataWithLabelsObject = powerbi.Prototype.inherit(dataViewMetadata);
            dataViewMetadataWithLabelsObject.objects = { labels: { show: false } };
            var dataView = {
                metadata: dataViewMetadataWithLabelsObject,
                categorical: {
                    categories: [{
                        source: dataViewMetadataWithLabelsObject.columns[0],
                        values: ['John Domo', 'Delta Force', 'Mr Bing'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadataWithLabelsObject.columns[1],
                        values: [1555, 2000, 20],
                        subtotal: 3575
                    }])
                }
            };
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(function () {
                var labels = $('.funnelChart .innerTextGroup text');
                expect(labels.length).toBe(0);
                done();
            }, DefaultRenderTime);
        });
        it('Funnel highlighted values - validate labels', function (done) {
            var categoryIdentities = [
                powerbitests.mocks.dataViewScopeIdentity("John Domo"),
                powerbitests.mocks.dataViewScopeIdentity("Delta Force"),
                powerbitests.mocks.dataViewScopeIdentity("Jean Tablau"),
            ];
            var dataViewNoHighlights = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100, 200, 700],
                        subtotal: 1000
                    }])
                }
            };
            var dataViewHighlightsA = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100, 200, 700],
                        highlights: [50, 140, 420],
                        subtotal: 1000
                    }])
                }
            };
            var dataViewHighlightsB = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100, 200, 700],
                        highlights: [75, 40, 220],
                        subtotal: 1000
                    }])
                }
            };
            v.onDataChanged({ dataViews: [dataViewNoHighlights] });
            v.onDataChanged({ dataViews: [dataViewHighlightsA] });
            v.onDataChanged({ dataViews: [dataViewHighlightsB] });
            v.onDataChanged({ dataViews: [dataViewNoHighlights] });
            setTimeout(function () {
                var labels = $('.funnelChart .innerTextGroup text');
                expect(labels.length).toBe(3);
                expect(adjustColor($(labels[0]).css('fill'))).toEqual(adjustColor($('.funnelChart').find('rect').first().css('fill')));
                expect($(labels[0]).text()).toEqual('$100');
                expect($(labels[1]).text()).toEqual('$200');
                expect($(labels[2]).text()).toEqual('$700');
                done();
            }, DefaultRenderTime);
        });
        it('labels should support display units with no precision', function (done) {
            var categoryIdentities = [
                powerbitests.mocks.dataViewScopeIdentity("John Domo"),
                powerbitests.mocks.dataViewScopeIdentity("Delta Force"),
                powerbitests.mocks.dataViewScopeIdentity("Mr Bing"),
            ];
            var dataViewMetadataWithLabelsObject = powerbi.Prototype.inherit(dataViewMetadata);
            dataViewMetadataWithLabelsObject.objects = {
                labels: { show: true, labelDisplayUnits: 1000, labelPrecision: 0 }
            };
            var dataView = {
                metadata: dataViewMetadataWithLabelsObject,
                categorical: {
                    categories: [{
                        source: dataViewMetadataWithLabelsObject.columns[0],
                        values: ['John Domo', 'Delta Force', 'Mr Bing'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadataWithLabelsObject.columns[1],
                        values: [1555, 2000, 20],
                        subtotal: 3575
                    }])
                }
            };
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(function () {
                // Commented because TSLINT throws exception on this var: unused variable: 'labels'
                //var labels = $('.funnelChart .innerTextGroup text');
                expect($('.funnelChart .innerTextGroup text').first().text()).toBe('$2K');
                done();
            }, DefaultRenderTime);
        });
        it('labels should support display units with precision', function (done) {
            var categoryIdentities = [
                powerbitests.mocks.dataViewScopeIdentity("John Domo"),
                powerbitests.mocks.dataViewScopeIdentity("Delta Force"),
                powerbitests.mocks.dataViewScopeIdentity("Mr Bing"),
            ];
            var dataViewMetadataWithLabelsObject = powerbi.Prototype.inherit(dataViewMetadata);
            dataViewMetadataWithLabelsObject.objects = {
                labels: { show: true, labelDisplayUnits: 1000, labelPrecision: 2 }
            };
            var dataView = {
                metadata: dataViewMetadataWithLabelsObject,
                categorical: {
                    categories: [{
                        source: dataViewMetadataWithLabelsObject.columns[0],
                        values: ['John Domo', 'Delta Force', 'Mr Bing'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadataWithLabelsObject.columns[1],
                        values: [1555, 2000, 20],
                        subtotal: 3575
                    }])
                }
            };
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(function () {
                // Commented because TSLINT throws exception on this var: unused variable: 'labels'
                //var labels = $('.funnelChart .innerTextGroup text');
                expect($('.funnelChart .innerTextGroup text').first().text()).toBe('$1.56K');
                done();
            }, DefaultRenderTime);
        });
    });
    describe("funnel chart web animation", function () {
        var v, element;
        var dataViewMetadata = {
            columns: [
                { name: 'col1' },
                { name: 'col2' },
                { name: 'col3' }
            ]
        };
        beforeEach(function () {
            VisualHostServices.initialize(powerbi.common.createLocalizationService());
        });
        beforeEach(function () {
            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.visualPluginFactory.createMinerva({
                heatMap: false,
                newTable: false
            }).getPlugin('funnel').create();
            v.init({
                element: element,
                host: powerbi.explore.services.createVisualHostServices(),
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true }
            });
        });
        it('funnel highlight animation', function (done) {
            var categoryIdentities = [
                powerbitests.mocks.dataViewScopeIdentity("John Domo"),
                powerbitests.mocks.dataViewScopeIdentity("Delta Force"),
                powerbitests.mocks.dataViewScopeIdentity("Jean Tablau"),
            ];
            var dataViewNoHighlights = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100, 200, 700],
                        subtotal: 1000
                    }])
                }
            };
            var dataViewHighlightsA = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100, 200, 700],
                        highlights: [50, 140, 420],
                        subtotal: 1000
                    }])
                }
            };
            var dataViewHighlightsB = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100, 200, 700],
                        highlights: [75, 40, 220],
                        subtotal: 1000
                    }])
                }
            };
            var animator = v.animator;
            spyOn(animator, 'animate').and.callThrough();
            v.onDataChanged({ dataViews: [dataViewNoHighlights] });
            v.onDataChanged({ dataViews: [dataViewHighlightsA] });
            v.onDataChanged({ dataViews: [dataViewHighlightsB] });
            v.onDataChanged({ dataViews: [dataViewNoHighlights] });
            expect(animator).toBeTruthy();
            expect(animator.animate).toHaveBeenCalled();
            done();
        });
    });
    describe("Enumerate Objects", function () {
        var visual, element;
        var dataViewMetadata = {
            columns: [
                {
                    name: 'col1',
                    type: DataShapeUtility.describeDataType(2048 /* String */)
                },
                {
                    name: 'col2',
                    type: DataShapeUtility.describeDataType(1 /* Number */),
                    isMeasure: true
                },
                {
                    name: 'col3',
                    type: DataShapeUtility.describeDataType(1 /* Number */),
                    isMeasure: true
                }
            ]
        };
        beforeEach(function () {
            VisualHostServices.initialize(powerbi.common.createLocalizationService());
        });
        beforeEach(function () {
            element = powerbitests.helpers.testDom('500', '500');
            visual = powerbi.visuals.visualPluginFactory.create().getPlugin('funnel').create();
            visual.init({
                element: element,
                host: powerbi.explore.services.createVisualHostServices(),
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true }
            });
        });
        it('Check basic enumeration', function () {
            var dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['a', 'b', 'c']
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata.columns[1],
                                values: [100, 200, 300, 400, 500]
                            },
                            {
                                source: dataViewMetadata.columns[2],
                                values: [200, 400, 600, 800, 1000]
                            }
                        ])
                    }
                }]
            };
            visual.onDataChanged(dataChangedOptions);
            var points = visual.enumerateObjectInstances({ objectName: 'dataPoint' });
            expect(points.length).toBe(4);
            expect(points[1].displayName).toEqual('a');
            expect(points[1].properties['fill']).toBeDefined();
            expect(points[2].displayName).toEqual('b');
            expect(points[2].properties['fill']).toBeDefined();
        });
        it('enumerateObjectInstances - Gradient color', function () {
            var dataViewGradientMetadata = {
                columns: [
                    { name: 'col1' },
                    { name: 'col2', isMeasure: true },
                    { name: 'col3', isMeasure: true, roles: { 'Gradient': true } }
                ]
            };
            var colors = ["#d9f2fb", "#ff557f", "#b1eab7"];
            var objectDefinitions = [
                { dataPoint: { fill: { solid: { color: colors[0] } } } },
                { dataPoint: { fill: { solid: { color: colors[1] } } } },
                { dataPoint: { fill: { solid: { color: colors[2] } } } }
            ];
            var dataView = {
                metadata: dataViewGradientMetadata,
                categorical: {
                    categories: [{
                        source: dataViewGradientMetadata.columns[0],
                        values: ['a', 'b', 'c'],
                        objects: objectDefinitions
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewGradientMetadata.columns[1],
                            values: [100, 200, 300, 400, 500]
                        },
                        {
                            source: dataViewGradientMetadata.columns[2],
                            values: [200, 400, 600, 800, 1000]
                        }
                    ])
                }
            };
            var dataChangedOptions = {
                dataViews: [dataView]
            };
            var defaultDataPointColor = "#00FF00";
            var actualData = FunnelChart.converter(dataView, defaultDataPointColor, defaultDataPointColor);
            expect(actualData.slices[0].color).toBe(colors[0]);
            expect(actualData.slices[1].color).toBe(colors[1]);
            expect(actualData.slices[2].color).toBe(colors[2]);
        });
    });
})(powerbitests || (powerbitests = {}));
