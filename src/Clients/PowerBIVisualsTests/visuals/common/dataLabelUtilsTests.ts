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
    import DataViewTransform = powerbi.data.DataViewTransform;
    import DataShapeUtility = powerbi.data.dsr.DataShapeUtility;
    import SemanticType = powerbi.data.SemanticType;
    import DataLabelUtils = powerbi.visuals.dataLabelUtils;

    var DefaultWaitForRender = 100;

    describe("dataLabelUtils Line Chart Collision Detection", () => {

        var v: powerbi.IVisual, element: JQuery;
        var dataViewMetadata: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                },
                {
                    displayName: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number),
                    format: '0.000'
                },
                {
                    displayName: 'col3',
                    isMeasure: false,
                    type: DataShapeUtility.describeDataType(SemanticType.DateTime),
                    format: 'd'
                }],
            objects:
            { labels: { show: true } },
        };

        var hostServices = powerbitests.mocks.createVisualHostServices();

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
            element = powerbitests.helpers.testDom('500', '150');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('lineChart').create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
            });
        });

        it('Show labels validation', (done) => {
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
            setTimeout(() => {
                // Only the top two label should be hidden
                expect($('.lineChart .axisGraphicsContext .dataLabelsSVG .data-labels').length).toBe(3);
                expect($('.lineChart .axisGraphicsContext .dataLabelsSVG .data-labels').first().text()).toContain("495");
                done();
            }, DefaultWaitForRender);
        });

        it('Hide labels validation', (done) => {
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
            setTimeout(() => {
                // Two label should be hidden because it collides
                expect($('.lineChart .axisGraphicsContext .dataLabelsSVG .data-labels').length).toBe(2);
                done();
            }, DefaultWaitForRender);
        });

        it('undefined labelSettings validation',() => {
            var labelSettings: powerbi.visuals.VisualDataLabelsSettings;
            var instance = DataLabelUtils.enumerateDataLabels(labelSettings, false);
            expect(instance).toEqual([]);
        });
    });

    describe("dataLabelUtils Scatter Chart Collision Detection", () => {

        var v: powerbi.IVisual, element: JQuery;
        var dataViewMetadata: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                },
                {
                    displayName: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number),
                    format: '0.000'
                },
                {
                    displayName: 'col3',
                    isMeasure: false,
                    type: DataShapeUtility.describeDataType(SemanticType.DateTime),
                    format: 'd'
                }],
            objects:
            { categoryLabels: { show: true } },
        };

        var hostServices = powerbitests.mocks.createVisualHostServices();

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
            element = powerbitests.helpers.testDom('250', '200');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('scatterChart').create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
            });
        });

        it('Show labels validation', (done) => {
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
            setTimeout(() => {
                // No label should be hidden
                expect($('.scatterChart .axisGraphicsContext .mainGraphicsContext .data-labels').length).toBe(4);
                expect($('.scatterChart .axisGraphicsContext .mainGraphicsContext .data-labels').first().text()).toBe('First');
                done();
            }, DefaultWaitForRender);
        });

        it('Hide labels validation', (done) => {
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
            setTimeout(() => {
                // Two labels should be hidden because they collides
                expect($('.scatterChart .axisGraphicsContext .mainGraphicsContext .data-labels').length).toBe(3);
                done();
            }, DefaultWaitForRender);
        });
    });

    describe("dataLabelUtils Map Collision Detection", () => {
        
        var mockGeotaggingAnalyzerService;
        var mockDatalabelSettings: powerbi.visuals.PointDataLabelsSettings = {
            show: true,
            displayUnits: 2,
            position: powerbi.visuals.PointLabelPosition.Above,
            precision: 2,
            labelColor: "#000000",
            overrideDefaultColor: false,
            formatterOptions: {},
        };
        var mockViewPort = {
            height: 150,
            width: 300
        };

        beforeEach(() => {
            var localizationService: powerbi.common.ILocalizationService = powerbi.common.createLocalizationService();
            powerbitests.mocks.setLocale(localizationService);
            powerbi.common.localize = localizationService;
            mockGeotaggingAnalyzerService = powerbi.createGeoTaggingAnalyzerService((stringId: string) => localizationService.get(stringId));
        });

        afterEach(() => {
            // Clear labels
            $('.data-labels').remove();
        });

        it('Show bubble labels validation', () => {
            var mockBubbleData: powerbi.visuals.MapBubble[] = [
                {
                    x: 0,
                    y: 55,
                    radius: 10,
                    fill: "#000000",
                    stroke: "2",
                    strokeWidth: 2,
                    selected: true,
                    identity: null,
                    labeltext: "Label 1",
                },
                {
                    x: 50,
                    y: 55,
                    radius: 10,
                    fill: "#000000",
                    stroke: "2",
                    strokeWidth: 2,
                    selected: true,
                    identity: null,
                    labeltext: "Label 2",
                }];

            var mockLayout: powerbi.visuals.ILabelLayout = DataLabelUtils.getMapLabelLayout(mockDatalabelSettings);

            var mockBubbleGraphicsContext: D3.Selection = d3.select('body')
                .append('svg')
                .style("position", "absolute")
                .append("g")
                .classed("mapBubbles1", true);

            var result = DataLabelUtils.drawDefaultLabelsForDataPointChart(mockBubbleData, mockBubbleGraphicsContext, mockLayout, mockViewPort);

            expect(result).toBeDefined();
            expect($('.mapBubbles1 text').length).toBe(2);
        });

        it('Hide bubble labels validation', () => {
            var mockBubbleData: powerbi.visuals.MapBubble[] = [
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
                }];

            var mockLayout: powerbi.visuals.ILabelLayout = DataLabelUtils.getMapLabelLayout(mockDatalabelSettings);

            var mockBubbleGraphicsContext: D3.Selection = d3.select('body')
                .append('svg')
                .style("position", "absolute")
                .append("g")
                .classed("mapBubbles2", true);

            var result = DataLabelUtils.drawDefaultLabelsForDataPointChart(mockBubbleData, mockBubbleGraphicsContext, mockLayout, mockViewPort);

            expect(result).toBeDefined();
            expect($('.mapBubbles2 text').length).toBe(1);
        });

        it('Show slice labels validation', () => {
            var mockSliceData: powerbi.visuals.MapSlice[] = [
                {
                    x: 0,
                    y: 55,
                    radius: 10,
                    fill: "#000000",
                    stroke: "2",
                    strokeWidth: 2,
                    selected: true,
                    identity: null,
                    labeltext: "Label 1",
                    value: 20,
                },
                {
                    x: 50,
                    y: 55,
                    radius: 10,
                    fill: "#000000",
                    stroke: "2",
                    strokeWidth: 2,
                    selected: true,
                    identity: null,
                    labeltext: "Label 2",
                    value: 20,
                }];

            var mockLayout: powerbi.visuals.ILabelLayout = DataLabelUtils.getMapLabelLayout(mockDatalabelSettings);

            var mockSliceGraphicsContext: D3.Selection = d3.select('body')
                .append('svg')
                .style("position", "absolute")
                .append("g")
                .classed("mapSlice1", true);

            var result = DataLabelUtils.drawDefaultLabelsForDataPointChart(mockSliceData, mockSliceGraphicsContext, mockLayout, mockViewPort);

            expect(result).toBeDefined();
            expect($('.mapSlice1 text').length).toBe(2);
        });

        it('Hide slice labels validation', () => {
            var mockSliceData: powerbi.visuals.MapSlice[] = [
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
                    value: 20,
                }];

            var mockLayout: powerbi.visuals.ILabelLayout = DataLabelUtils.getMapLabelLayout(mockDatalabelSettings);

            var mockSliceGraphicsContext: D3.Selection = d3.select('body')
                .append('svg')
                .style("position", "absolute")
                .append("g")
                .classed("mapSlice2", true);

            var result = DataLabelUtils.drawDefaultLabelsForDataPointChart(mockSliceData, mockSliceGraphicsContext, mockLayout, mockViewPort);

            expect(result).toBeDefined();
            expect($('.mapSlice2 text').length).toBe(1);
        });
    });

    function columnChartDataLabelsShowValidation(chartType: string, collide: boolean) {
        var v: powerbi.IVisual, element: JQuery;

        var dataViewMetadataThreeColumn: powerbi.DataViewMetadataColumn[] = [
            {
                displayName: 'col1',
                type: DataShapeUtility.describeDataType(SemanticType.String)
            },
            {
                displayName: 'col2',
                isMeasure: true,
                type: DataShapeUtility.describeDataType(SemanticType.Number)
            },
            {
                displayName: 'col3',
                isMeasure: true,
                type: DataShapeUtility.describeDataType(SemanticType.Number)
            }
        ];

        function metadata(columns): powerbi.DataViewMetadata {
            var metadata: powerbi.DataViewMetadata = {
                columns: columns,
            };

            metadata.objects = {
                labels: { show: true, labelPrecision: 0,  color: { solid: { color: '#FF0000' } } }
            };

            return metadata;
        }

        var hostServices = powerbitests.mocks.createVisualHostServices();

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());

            if (collide)
                element = powerbitests.helpers.testDom('100', '100');
            else
                element = powerbitests.helpers.testDom('500', '500');

            v = powerbi.visuals.visualPluginFactory.create().getPlugin(chartType).create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
            });
        });

        it('Data Label Visibility Validation', (done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("John Domo"),
                mocks.dataViewScopeIdentity("Delta Force"),
                mocks.dataViewScopeIdentity("Mr Bing"),
            ];
            var dataView: powerbi.DataView = {
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

            setTimeout(() => {

                if (collide)
                    switch (chartType) {
                        case 'columnChart':
                        case 'clusteredColumnChart':
                        case 'barChart':
                        case 'clusteredBarChart':                        
                            expect(labels.length).toBe(3);
                            break;
                        //Formatting support localization, 100.00% will be displayed as 100% so the label will be displayed.
                        case 'hundredPercentStackedColumnChart':
                            expect(labels.length).toBe(0);
                            break;
                        case 'hundredPercentStackedBarChart':
                            expect(labels.length).toBe(3);
                            break;
                    }
                else
                    switch (chartType) {
                        case 'columnChart':
                        case 'barChart':
                        case 'clusteredColumnChart':
                        case 'clusteredBarChart':
                            expect(labels.length).toBe(3);
                            break;                        
                        case 'hundredPercentStackedColumnChart':
                        case 'hundredPercentStackedBarChart':
                            expect(labels.length).toBe(3);
                            break;
                    }

                done();
            }, DefaultWaitForRender);
        });
    }

    describe("Stacked Bar Chart show labels validation", () => columnChartDataLabelsShowValidation('barChart', false));
    describe("Clustered Bar Chart show labels validation", () => columnChartDataLabelsShowValidation('clusteredBarChart', false));
    describe("Hundred Percent Stacked Bar Chart show labels validation", () => columnChartDataLabelsShowValidation('hundredPercentStackedBarChart', false));
    describe("Stacked Column Chart show labels validation", () => columnChartDataLabelsShowValidation('columnChart', false));
    describe("Clustered Column Chart show labels validation", () => columnChartDataLabelsShowValidation('clusteredColumnChart', false));
    describe("Hundred Percent Stacked Column Chart show labels validation", () => columnChartDataLabelsShowValidation('hundredPercentStackedColumnChart', false));

    describe("Stacked Bar Chart hide labels validation", () => columnChartDataLabelsShowValidation('barChart', true));
    describe("Clustered Bar Chart hide labels validation", () => columnChartDataLabelsShowValidation('clusteredBarChart', true));
    describe("Hundred Percent Stacked Bar Chart hide labels validation", () => columnChartDataLabelsShowValidation('hundredPercentStackedBarChart', true));
    describe("Stacked Column Chart hide labels validation", () => columnChartDataLabelsShowValidation('columnChart', true));
    describe("Clustered Column Chart hide labels validation", () => columnChartDataLabelsShowValidation('clusteredColumnChart', true));
    describe("Hundred Percent Stacked Column Chart hide labels validation", () => columnChartDataLabelsShowValidation('hundredPercentStackedColumnChart', true));

    describe("dataLabelUtils Waterfall Chart Collision Detection", () => {
        var v: powerbi.IVisual, element: JQuery;;
        var DataShapeUtility = powerbi.data.dsr.DataShapeUtility;
        var SemanticType = powerbi.data.SemanticType;
        var DataViewTransform = powerbi.data.DataViewTransform;

        var localizationService: powerbi.common.ILocalizationService = powerbi.common.createLocalizationService();
        powerbi.common.localize = localizationService;

        var values = [100, -200, 250];
        var categories = [2010, 2011, 2012];

        var categoryColumn: powerbi.DataViewMetadataColumn = { displayName: 'year', type: DataShapeUtility.describeDataType(SemanticType.String) };
        var measureColumn: powerbi.DataViewMetadataColumn = { displayName: 'sales', isMeasure: true, type: DataShapeUtility.describeDataType(SemanticType.Integer), objects: { general: { formatString: '$0' } } };

        var dataView: powerbi.DataViewCategorical = {
            categories: [{
                source: categoryColumn,
                values: categories,
            }],
            values: DataViewTransform.createValueColumns([{
                source: measureColumn,
                values: values,
            }]),
        };
        var metadata: powerbi.DataViewMetadata = {
            columns: [categoryColumn, measureColumn],
        };

        var data: powerbi.DataView = {
            categorical: dataView,
            metadata: metadata,
        };

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('waterfallChart').create();            
        });

        it('Show labels validation', (done) => {
            element = powerbitests.helpers.testDom('500', '500');

            v.init({
                element: element,
                host: powerbitests.mocks.createVisualHostServices(),
                style: powerbi.visuals.visualStyles.create(),
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

            setTimeout(() => {
                // Two last labels are hidden due to collision detection
                expect($('.dataLabelsSVG text').length).toBe(2);
                done();
            }, DefaultWaitForRender);
        });

        it('Hide labels validation', (done) => {
            element = powerbitests.helpers.testDom('120', '100');

            v.init({
                element: element,
                host: powerbitests.mocks.createVisualHostServices(),
                style: powerbi.visuals.visualStyles.create(),
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

            setTimeout(() => {
                expect($('.dataLabelsSVG text').length).toBe(2);
                done();
            }, DefaultWaitForRender);
        });
    });

    describe("dataLabelUtils tests", () => {

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
        });

        it('display units formatting values : Auto', () => {
            var value: number = 20000;
            var labelSettings: powerbi.visuals.VisualDataLabelsSettings = DataLabelUtils.getDefaultLabelSettings();
            labelSettings.displayUnits = 0;
            labelSettings.precision = 0;
            var formatter = powerbi.visuals.valueFormatter.create(DataLabelUtils.getLabelFormatterOptions(labelSettings));
            var formattedValue = formatter.format(value);
            expect(formattedValue).toBe("20000");
        });

        it('display units formatting values : K', () => {
            var value: number = 20000;
            var labelSettings: powerbi.visuals.VisualDataLabelsSettings = DataLabelUtils.getDefaultLabelSettings();
            labelSettings.displayUnits = 10000;
            labelSettings.precision = 0;
            var formatter = powerbi.visuals.valueFormatter.create(DataLabelUtils.getLabelFormatterOptions(labelSettings));
            var formattedValue = formatter.format(value);
            expect(formattedValue).toBe("20K");
        });

        it('display units formatting values : M', () => {
            var value: number = 200000;
            var labelSettings: powerbi.visuals.VisualDataLabelsSettings = DataLabelUtils.getDefaultLabelSettings();
            labelSettings.displayUnits = 1000000;
            labelSettings.precision = 1;
            var formatter = powerbi.visuals.valueFormatter.create(DataLabelUtils.getLabelFormatterOptions(labelSettings));
            var formattedValue = formatter.format(value);
            expect(formattedValue).toBe("0.2M");
        });

        it('display units formatting values : B', () => {
            var value: number = 200000000000;
            var labelSettings: powerbi.visuals.VisualDataLabelsSettings = DataLabelUtils.getDefaultLabelSettings();
            labelSettings.displayUnits = 1000000000;
            labelSettings.precision = 0;
            var formatter = powerbi.visuals.valueFormatter.create(DataLabelUtils.getLabelFormatterOptions(labelSettings));
            var formattedValue = formatter.format(value);
            expect(formattedValue).toBe("200bn");
        });

        it('display units formatting values : T', () => {
            var value: number = 200000000000;
            var labelSettings: powerbi.visuals.VisualDataLabelsSettings = DataLabelUtils.getDefaultLabelSettings();
            labelSettings.displayUnits = 1000000000000;
            labelSettings.precision = 1;
            var formatter = powerbi.visuals.valueFormatter.create(DataLabelUtils.getLabelFormatterOptions(labelSettings));
            var formattedValue = formatter.format(value);
            expect(formattedValue).toBe("0.2T");
        });
    });

    describe("dataLabelUtils Test enumerate ctegory labels", () => {

        it('test default values', () => {

            var labelSettings = DataLabelUtils.getDefaultPointLabelSettings();
            var objectsWithColor = DataLabelUtils.enumerateCategoryLabels(labelSettings, true);
            var objectsNoColor = DataLabelUtils.enumerateCategoryLabels(labelSettings, false);

            expect(objectsWithColor[0].properties['show']).toBe(false);
            expect(objectsNoColor[0].properties['show']).toBe(false);

            expect(objectsWithColor[0].properties['color']).toBe(labelSettings.labelColor);
            expect(objectsNoColor[0].properties['color']).toBeUndefined();
        });

        it('test custom values', () => {

            var labelSettings = DataLabelUtils.getDefaultPointLabelSettings();
            labelSettings.show = true;
            labelSettings.labelColor = '#FF0000';

            var objectsWithColor = DataLabelUtils.enumerateCategoryLabels(labelSettings, true);
            
            expect(objectsWithColor[0].properties['show']).toBe(true);
            expect(objectsWithColor[0].properties['color']).toBe('#FF0000');
            
        });

        it('test category labels objetcs for donut chart', () => {

            var labelSettings = DataLabelUtils.getDefaultDonutLabelSettings();
            var objectsWithColor = DataLabelUtils.enumerateCategoryLabels(labelSettings, false, true);

            expect(objectsWithColor[0].properties['show']).toBe(labelSettings.showCategory);
        });

        it('test null values', () => {

            var labelSettings = DataLabelUtils.getDefaultPointLabelSettings();
            var donutLabelSettings = DataLabelUtils.getDefaultDonutLabelSettings();

            var objectsWithColor = DataLabelUtils.enumerateCategoryLabels(null, true);
            var donutObjectsWithColor = DataLabelUtils.enumerateCategoryLabels(null, false, true);
            
            expect(objectsWithColor[0].properties['show']).toBe(labelSettings.show);
            expect(objectsWithColor[0].properties['color']).toBe(labelSettings.labelColor);

            expect(donutObjectsWithColor[0].properties['show']).toBe(donutLabelSettings.showCategory);
        });

    });
}