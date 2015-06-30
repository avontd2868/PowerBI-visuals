//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbitests;
(function (powerbitests) {
    var DataViewTransform = powerbi.data.DataViewTransform;
    var DataShapeUtility = powerbi.data.dsr.DataShapeUtility;
    var SemanticType = powerbi.data.SemanticType;
    var DataLabelUtils = powerbi.visuals.dataLabelUtils;
    var DefaultWaitForRender = 100;
    describe("dataLabelUtils Line Chart Collision Detection", function () {
        var v, element;
        var dataViewMetadata = {
            columns: [
                {
                    name: 'col1',
                    type: DataShapeUtility.describeDataType(2048 /* String */)
                },
                {
                    name: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(1 /* Number */),
                    format: '0.000'
                },
                {
                    name: 'col3',
                    isMeasure: false,
                    type: DataShapeUtility.describeDataType(4 /* DateTime */),
                    format: 'd'
                }
            ],
            objects: { labels: { show: true } },
        };
        var hostServices = powerbitests.mocks.createVisualHostServices();
        beforeEach(function () {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
            element = powerbitests.helpers.testDom('500', '150');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('lineChart').create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
            });
        });
        it('Show labels validation', function (done) {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e']
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [500000, 495000, 490000, 480000, 500000],
                            subtotal: 2465000
                        }])
                    }
                }]
            });
            setTimeout(function () {
                // No label should be hidden
                expect($('.lineChart .axisGraphicsContext .mainGraphicsContext .data-labels').length).toBe(5);
                expect($('.lineChart .axisGraphicsContext .mainGraphicsContext .data-labels').first().text()).toContain("500");
                done();
            }, DefaultWaitForRender);
        });
        it('Hide labels validation', function (done) {
            var metadataWithoutPrecision = jQuery.extend(true, {}, dataViewMetadata);
            //force ignoring label precision to take the format from the metadata, so collision detection will affect 2 labels.
            metadataWithoutPrecision.objects.labels['labelPrecision'] = null;
            v.onDataChanged({
                dataViews: [{
                    metadata: metadataWithoutPrecision,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e']
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [500000, 550000, 550000, 550000, 600000],
                            subtotal: 2750000
                        }])
                    }
                }]
            });
            setTimeout(function () {
                // One label should be hidden because it collides
                expect($('.lineChart .axisGraphicsContext .mainGraphicsContext .data-labels').length).toBe(3);
                done();
            }, DefaultWaitForRender);
        });
    });
    describe("dataLabelUtils Scatter Chart Collision Detection", function () {
        var v, element;
        var dataViewMetadata = {
            columns: [
                {
                    name: 'col1',
                    type: DataShapeUtility.describeDataType(2048 /* String */)
                },
                {
                    name: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(1 /* Number */),
                    format: '0.000'
                },
                {
                    name: 'col3',
                    isMeasure: false,
                    type: DataShapeUtility.describeDataType(4 /* DateTime */),
                    format: 'd'
                }
            ],
            objects: { categoryLabels: { show: true } },
        };
        var hostServices = powerbitests.mocks.createVisualHostServices();
        beforeEach(function () {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
            element = powerbitests.helpers.testDom('250', '200');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('scatterChart').create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
            });
        });
        it('Show labels validation', function (done) {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['First', 'Second', 'Third', 'Fourth']
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [110, 120, 130, 140],
                        }])
                    }
                }]
            });
            setTimeout(function () {
                // No label should be hidden
                expect($('.scatterChart .axisGraphicsContext .mainGraphicsContext .data-labels').length).toBe(4);
                expect($('.scatterChart .axisGraphicsContext .mainGraphicsContext .data-labels').first().text()).toBe('First');
                done();
            }, DefaultWaitForRender);
        });
        it('Hide labels validation', function (done) {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['First', 'Second', 'Third', 'Fourth', 'Fifth']
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [110, 120, 130, 140, 150],
                        }])
                    }
                }]
            });
            setTimeout(function () {
                // Two labels should be hidden because they collides
                expect($('.scatterChart .axisGraphicsContext .mainGraphicsContext .data-labels').length).toBe(3);
                done();
            }, DefaultWaitForRender);
        });
    });
    describe("dataLabelUtils Map Collision Detection", function () {
        var mockGeotaggingAnalyzerService;
        var mockDatalabelSettings = {
            show: true,
            displayUnits: 2,
            position: 0 /* Above */,
            precision: 2,
            labelColor: "#000000",
            overrideDefaultColor: false,
            formatterOptions: {},
        };
        var mockViewPort = {
            height: 150,
            width: 300
        };
        beforeEach(function () {
            var localizationService = powerbi.common.createLocalizationService();
            powerbitests.mocks.setLocale(localizationService);
            powerbi.common.localize = localizationService;
            mockGeotaggingAnalyzerService = powerbi.createGeoTaggingAnalyzerService(function (stringId) { return localizationService.get(stringId); });
        });
        afterEach(function () {
            // Clear labels
            $('.data-labels').remove();
        });
        it('Show bubble labels validation', function () {
            var mockBubbleData = [
                {
                    x: 50,
                    y: 55,
                    radius: 10,
                    fill: "#000000",
                    stroke: "2",
                    strokeWidth: 2,
                    selected: true,
                    identity: null,
                    labeltext: "Label 1",
                    showLabel: true,
                },
                {
                    x: 50,
                    y: 60,
                    radius: 10,
                    fill: "#000000",
                    stroke: "2",
                    strokeWidth: 2,
                    selected: true,
                    identity: null,
                    labeltext: "Label 2",
                    showLabel: true,
                }
            ];
            var mockLayout = DataLabelUtils.getMapLabelLayout(mockDatalabelSettings);
            var mockBubbleGraphicsContext = d3.select('body').append('svg').style("position", "absolute").append("g").classed("mapBubbles1", true);
            var result = DataLabelUtils.drawDefaultLabelsForDataPointChart(mockBubbleData, mockBubbleGraphicsContext, mockLayout, mockViewPort);
            expect(result).toBeDefined();
            expect($('.mapBubbles1 text').length).toBe(2);
        });
        it('Hide bubble labels validation', function () {
            var mockBubbleData = [
                {
                    x: 45,
                    y: 60,
                    radius: 10,
                    fill: "#000000",
                    stroke: "2",
                    strokeWidth: 2,
                    selected: true,
                    identity: null,
                    labeltext: "Label 1",
                    showLabel: true,
                },
                {
                    x: 50,
                    y: 60,
                    radius: 10,
                    fill: "#000000",
                    stroke: "2",
                    strokeWidth: 2,
                    selected: true,
                    identity: null,
                    labeltext: "Label 2",
                    showLabel: true,
                }
            ];
            var mockLayout = DataLabelUtils.getMapLabelLayout(mockDatalabelSettings);
            var mockBubbleGraphicsContext = d3.select('body').append('svg').style("position", "absolute").append("g").classed("mapBubbles2", true);
            var result = DataLabelUtils.drawDefaultLabelsForDataPointChart(mockBubbleData, mockBubbleGraphicsContext, mockLayout, mockViewPort);
            expect(result).toBeDefined();
            expect($('.mapBubbles2 text').length).toBe(1);
        });
        it('Show slice labels validation', function () {
            var mockSliceData = [
                {
                    x: 50,
                    y: 55,
                    radius: 10,
                    fill: "#000000",
                    stroke: "2",
                    strokeWidth: 2,
                    selected: true,
                    identity: null,
                    labeltext: "Label 1",
                    showLabel: true,
                    value: 20,
                },
                {
                    x: 50,
                    y: 60,
                    radius: 10,
                    fill: "#000000",
                    stroke: "2",
                    strokeWidth: 2,
                    selected: true,
                    identity: null,
                    labeltext: "Label 2",
                    showLabel: true,
                    value: 20,
                }
            ];
            var mockLayout = DataLabelUtils.getMapLabelLayout(mockDatalabelSettings);
            var mockSliceGraphicsContext = d3.select('body').append('svg').style("position", "absolute").append("g").classed("mapSlice1", true);
            var result = DataLabelUtils.drawDefaultLabelsForDataPointChart(mockSliceData, mockSliceGraphicsContext, mockLayout, mockViewPort);
            expect(result).toBeDefined();
            expect($('.mapSlice1 text').length).toBe(2);
        });
        it('Hide slice labels validation', function () {
            var mockSliceData = [
                {
                    x: 45,
                    y: 60,
                    radius: 10,
                    fill: "#000000",
                    stroke: "2",
                    strokeWidth: 2,
                    selected: true,
                    identity: null,
                    labeltext: "Label 1",
                    showLabel: true,
                    value: 20,
                },
                {
                    x: 50,
                    y: 60,
                    radius: 10,
                    fill: "#000000",
                    stroke: "2",
                    strokeWidth: 2,
                    selected: true,
                    identity: null,
                    labeltext: "Label 2",
                    showLabel: true,
                    value: 20,
                }
            ];
            var mockLayout = DataLabelUtils.getMapLabelLayout(mockDatalabelSettings);
            var mockSliceGraphicsContext = d3.select('body').append('svg').style("position", "absolute").append("g").classed("mapSlice2", true);
            var result = DataLabelUtils.drawDefaultLabelsForDataPointChart(mockSliceData, mockSliceGraphicsContext, mockLayout, mockViewPort);
            expect(result).toBeDefined();
            expect($('.mapSlice2 text').length).toBe(1);
        });
    });
    function columnChartDataLabelsShowValidation(chartType, collide) {
        var v, element;
        var dataViewMetadataThreeColumn = [
            {
                name: 'col1',
                type: DataShapeUtility.describeDataType(2048 /* String */)
            },
            {
                name: 'col2',
                isMeasure: true,
                type: DataShapeUtility.describeDataType(1 /* Number */)
            },
            {
                name: 'col3',
                isMeasure: true,
                type: DataShapeUtility.describeDataType(1 /* Number */)
            }
        ];
        function metadata(columns) {
            var metadata = {
                columns: columns,
            };
            metadata.objects = {
                labels: { show: true, color: { solid: { color: '#FF0000' } } }
            };
            return metadata;
        }
        var hostServices = powerbitests.mocks.createVisualHostServices();
        beforeEach(function () {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
            if (collide)
                element = powerbitests.helpers.testDom('100', '75');
            else
                element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin(chartType).create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
            });
        });
        it('Data Label Visibility Validation', function (done) {
            var categoryIdentities = [
                powerbitests.mocks.dataViewScopeIdentity("John Domo"),
                powerbitests.mocks.dataViewScopeIdentity("Delta Force"),
                powerbitests.mocks.dataViewScopeIdentity("Mr Bing"),
            ];
            var dataView = {
                metadata: metadata(dataViewMetadataThreeColumn),
                categorical: {
                    categories: [{
                        source: dataViewMetadataThreeColumn[0],
                        values: ['John Domo', 'Delta Force', 'Mr Bing'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadataThreeColumn[1],
                        values: [20, 20, 100],
                        subtotal: 140
                    }])
                }
            };
            v.onDataChanged({ dataViews: [dataView] });
            var labels = $('.data-labels');
            setTimeout(function () {
                if (collide)
                    switch (chartType) {
                        case 'columnChart':
                        case 'clusteredColumnChart':
                        case 'barChart':
                        case 'clusteredBarChart':
                            expect(labels.length).toBe(2);
                            break;
                        case 'hundredPercentStackedColumnChart':
                            expect(labels.length).toBe(1);
                            break;
                        case 'hundredPercentStackedBarChart':
                            expect(labels.length).toBe(0);
                            break;
                    }
                else
                    switch (chartType) {
                        case 'barChart':
                        case 'clusteredBarChart':
                            expect(labels.length).toBe(2);
                            break;
                        case 'columnChart':
                        case 'clusteredColumnChart':
                        case 'hundredPercentStackedColumnChart':
                            expect(labels.length).toBe(3);
                            break;
                        case 'hundredPercentStackedBarChart':
                            expect(labels.length).toBe(0);
                            break;
                    }
                done();
            }, DefaultWaitForRender);
        });
    }
    describe("Stacked Bar Chart show labels validation", function () { return columnChartDataLabelsShowValidation('barChart', false); });
    describe("Clustered Bar Chart show labels validation", function () { return columnChartDataLabelsShowValidation('clusteredBarChart', false); });
    describe("Hundred Percent Stacked Bar Chart show labels validation", function () { return columnChartDataLabelsShowValidation('hundredPercentStackedBarChart', false); });
    describe("Stacked Column Chart show labels validation", function () { return columnChartDataLabelsShowValidation('columnChart', false); });
    describe("Clustered Column Chart show labels validation", function () { return columnChartDataLabelsShowValidation('clusteredColumnChart', false); });
    describe("Hundred Percent Stacked Column Chart show labels validation", function () { return columnChartDataLabelsShowValidation('hundredPercentStackedColumnChart', false); });
    describe("Stacked Bar Chart hide labels validation", function () { return columnChartDataLabelsShowValidation('barChart', true); });
    describe("Clustered Bar Chart hide labels validation", function () { return columnChartDataLabelsShowValidation('clusteredBarChart', true); });
    describe("Hundred Percent Stacked Bar Chart hide labels validation", function () { return columnChartDataLabelsShowValidation('hundredPercentStackedBarChart', true); });
    describe("Stacked Column Chart hide labels validation", function () { return columnChartDataLabelsShowValidation('columnChart', true); });
    describe("Clustered Column Chart hide labels validation", function () { return columnChartDataLabelsShowValidation('clusteredColumnChart', true); });
    describe("Hundred Percent Stacked Column Chart hide labels validation", function () { return columnChartDataLabelsShowValidation('hundredPercentStackedColumnChart', true); });
    describe("dataLabelUtils Waterfall Chart Collision Detection", function () {
        var v, element;
        ;
        var DataShapeUtility = powerbi.data.dsr.DataShapeUtility;
        var SemanticType = powerbi.data.SemanticType;
        var DataViewTransform = powerbi.data.DataViewTransform;
        var localizationService = powerbi.common.createLocalizationService();
        powerbi.common.localize = localizationService;
        var values = [100, -200, 250];
        var categories = [2010, 2011, 2012];
        var categoryColumn = { name: 'year', type: DataShapeUtility.describeDataType(2048 /* String */) };
        var measureColumn = { name: 'sales', isMeasure: true, type: DataShapeUtility.describeDataType(SemanticType.Integer), objects: { general: { formatString: '$0' } } };
        var dataView = {
            categories: [{
                source: categoryColumn,
                values: categories,
            }],
            values: DataViewTransform.createValueColumns([{
                source: measureColumn,
                values: values,
            }]),
        };
        var metadata = {
            columns: [categoryColumn, measureColumn],
        };
        var data = {
            categorical: dataView,
            metadata: metadata,
        };
        beforeEach(function () {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('waterfallChart').create();
        });
        it('Show labels validation', function (done) {
            element = powerbitests.helpers.testDom('500', '500');
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
            data.metadata.objects = {
                labels: {
                    show: true,
                }
            };
            var dataChangedOptions = {
                dataViews: [data]
            };
            v.onDataChanged(dataChangedOptions);
            setTimeout(function () {
                //length should be (values+1) as it contains the total bar as well
                expect($('.mainGraphicsContext text').length).toBe(values.length + 1);
                done();
            }, DefaultWaitForRender);
        });
        it('Hide labels validation', function (done) {
            element = powerbitests.helpers.testDom('100', '100');
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
            data.metadata.objects = {
                labels: {
                    show: true,
                }
            };
            var dataChangedOptions = {
                dataViews: [data]
            };
            v.onDataChanged(dataChangedOptions);
            setTimeout(function () {
                expect($('.mainGraphicsContext text').length).toBe(2);
                done();
            }, DefaultWaitForRender);
        });
    });
    describe("dataLabelUtils tests", function () {
        beforeEach(function () {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
        });
        it('display units formatting values : Auto', function () {
            var value = 20000;
            var labelSettings = DataLabelUtils.getDefaultLabelSettings();
            labelSettings.displayUnits = 0;
            var formatter = powerbi.visuals.valueFormatter.create(DataLabelUtils.getLabelFormatterOptions(labelSettings));
            var formattedValue = formatter.format(value);
            expect(formattedValue).toBe("20000");
        });
        it('display units formatting values : K', function () {
            var value = 20000;
            var labelSettings = DataLabelUtils.getDefaultLabelSettings();
            labelSettings.displayUnits = 10000;
            var formatter = powerbi.visuals.valueFormatter.create(DataLabelUtils.getLabelFormatterOptions(labelSettings));
            var formattedValue = formatter.format(value);
            expect(formattedValue).toBe("20K");
        });
        it('display units formatting values : M', function () {
            var value = 200000;
            var labelSettings = DataLabelUtils.getDefaultLabelSettings();
            labelSettings.displayUnits = 1000000;
            var formatter = powerbi.visuals.valueFormatter.create(DataLabelUtils.getLabelFormatterOptions(labelSettings));
            var formattedValue = formatter.format(value);
            expect(formattedValue).toBe("0.2M");
        });
        it('display units formatting values : B', function () {
            var value = 200000000000;
            var labelSettings = DataLabelUtils.getDefaultLabelSettings();
            labelSettings.displayUnits = 1000000000;
            var formatter = powerbi.visuals.valueFormatter.create(DataLabelUtils.getLabelFormatterOptions(labelSettings));
            var formattedValue = formatter.format(value);
            expect(formattedValue).toBe("200bn");
        });
        it('display units formatting values : T', function () {
            var value = 200000000000;
            var labelSettings = DataLabelUtils.getDefaultLabelSettings();
            labelSettings.displayUnits = 1000000000000;
            var formatter = powerbi.visuals.valueFormatter.create(DataLabelUtils.getLabelFormatterOptions(labelSettings));
            var formattedValue = formatter.format(value);
            expect(formattedValue).toBe("0.2T");
        });
    });
    describe("dataLabelUtils Test enumerate ctegory labels", function () {
        it('test default values', function () {
            var labelSettings = DataLabelUtils.getDefaultPointLabelSettings();
            var objectsWithColor = DataLabelUtils.enumerateCategoryLabels(labelSettings, true);
            var objectsNoColor = DataLabelUtils.enumerateCategoryLabels(labelSettings, false);
            expect(objectsWithColor[0].properties['show']).toBe(false);
            expect(objectsNoColor[0].properties['show']).toBe(false);
            expect(objectsWithColor[0].properties['color']).toBe(labelSettings.labelColor);
            expect(objectsNoColor[0].properties['color']).toBeUndefined();
        });
        it('test custom values', function () {
            var labelSettings = DataLabelUtils.getDefaultPointLabelSettings();
            labelSettings.show = true;
            labelSettings.labelColor = '#FF0000';
            var objectsWithColor = DataLabelUtils.enumerateCategoryLabels(labelSettings, true);
            expect(objectsWithColor[0].properties['show']).toBe(true);
            expect(objectsWithColor[0].properties['color']).toBe('#FF0000');
        });
        it('test category labels objetcs for donut chart', function () {
            var labelSettings = DataLabelUtils.getDefaultDonutLabelSettings();
            var objectsWithColor = DataLabelUtils.enumerateCategoryLabels(labelSettings, false, true);
            expect(objectsWithColor[0].properties['show']).toBe(labelSettings.showCategory);
        });
        it('test null values', function () {
            var labelSettings = DataLabelUtils.getDefaultPointLabelSettings();
            var donutLabelSettings = DataLabelUtils.getDefaultDonutLabelSettings();
            var objectsWithColor = DataLabelUtils.enumerateCategoryLabels(null, true);
            var donutObjectsWithColor = DataLabelUtils.enumerateCategoryLabels(null, false, true);
            expect(objectsWithColor[0].properties['show']).toBe(labelSettings.show);
            expect(objectsWithColor[0].properties['color']).toBe(labelSettings.labelColor);
            expect(donutObjectsWithColor[0].properties['show']).toBe(donutLabelSettings.showCategory);
        });
    });
})(powerbitests || (powerbitests = {}));
