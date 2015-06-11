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
    import WaterfallChart = powerbi.visuals.WaterfallChart;
    import DataShapeUtility = powerbi.data.dsr.DataShapeUtility;
    import SemanticType = powerbi.data.SemanticType;
    import DataViewTransform = powerbi.data.DataViewTransform;
    import SVGUtil = powerbi.visuals.SVGUtil;

    var DefaultWaitForRender = 10;

    describe('WaterfallChart',() => {
        var localizationService: powerbi.common.ILocalizationService = powerbi.common.createLocalizationService();
        powerbi.common.localize = localizationService;
        powerbitests.mocks.setLocale(localizationService);

        var viewport: powerbi.IViewport = {
            height: 500,
            width: 500,
        };
        var cartesianHost = {
            updateLegend: data => dummyDrawLegend(data, viewport),
        };
        var svg = d3.select($('<svg/>').get(0));
        var style = powerbi.visuals.visualStyles.create();
        var initOptions: powerbi.visuals.CartesianVisualInitOptions = {
            element: powerbitests.helpers.testDom('500', '500'),
            host: mocks.createVisualHostServices(),
            style: style,
            viewport: viewport,
            //settings:,
            //animation:,
            //interactivity:,
            svg: svg,
            cartesianHost: cartesianHost,
        };

        var categoryColumn: powerbi.DataViewMetadataColumn = { displayName: 'year', type: DataShapeUtility.describeDataType(SemanticType.String) };
        var measureColumn: powerbi.DataViewMetadataColumn = { displayName: 'sales', isMeasure: true, type: DataShapeUtility.describeDataType(SemanticType.Integer), objects: { general: { formatString: '$0' } } };
        var colors = style.colorPalette.dataColors;

        describe('axes', () => {
            
            var hostServices: IVisualHostServices;
            var v;

            beforeEach(() => {
                var element = powerbitests.helpers.testDom('500', '500');
                hostServices = mocks.createVisualHostServices();
                v = powerbi.visuals.visualPluginFactory.create().getPlugin('waterfallChart').create();
                v.init({
                    element: element,
                    host: hostServices,
                    style: powerbi.visuals.visualStyles.create(),
                    viewport: {
                        height: element.height(),
                        width: element.width()
                    },
                    interactivity: { isInteractiveLegend: false },
                    animation: { transitionImmediate: true },
                });
            });

            function getDataViewFromValues(values: number[]): any {
                var categoryIdentities = [mocks.dataViewScopeIdentity("John Domo")];
                var dataViewMetadataOneColumn: powerbi.DataViewMetadata = {
                    columns: [
                        {
                            displayName: 'AxesTitleTest',
                            type: DataShapeUtility.describeDataType(SemanticType.Number)
                        }],
                    objects: {
                        categoryAxis: {
                            showAxisTitle: true
                        },
                        valueAxis: {
                            showAxisTitle: true
                        }
                    }
                };

                var dataView = {
                    metadata: dataViewMetadataOneColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataOneColumn.columns[0],
                            values: [500, 2000, 5000, 10000],
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataOneColumn.columns[0],
                            values: values,
                            subtotal: 1020
                        }])
                    }
                };

                return dataView;
            }

            it('NaN in values shows a warning', () => {
                var dataView = getDataViewFromValues([200, NaN]);
                var warningSpy = jasmine.createSpy('warning');
                hostServices.setWarnings = warningSpy;

                v.onDataChanged({ dataViews: [dataView] });

                expect(warningSpy).toHaveBeenCalled();
                expect(warningSpy.calls.count()).toBe(1);
                expect(warningSpy.calls.argsFor(0)[0][0].code).toBe('NaNNotSupported');
            });

            it('Negative Infinity in values shows a warning', () => {
                var dataView = getDataViewFromValues([200, Number.NEGATIVE_INFINITY]);
                var warningSpy = jasmine.createSpy('warning');
                hostServices.setWarnings = warningSpy;

                v.onDataChanged({ dataViews: [dataView] });

                expect(warningSpy).toHaveBeenCalled();
                expect(warningSpy.calls.count()).toBe(1);
                expect(warningSpy.calls.argsFor(0)[0][0].code).toBe('InfinityValuesNotSupported');
            });

            it('Postive Infinity in values shows a warning', () => {
                var dataView = getDataViewFromValues([200, Number.POSITIVE_INFINITY]);
                var warningSpy = jasmine.createSpy('warning');
                hostServices.setWarnings = warningSpy;

                v.onDataChanged({ dataViews: [dataView] });

                expect(warningSpy).toHaveBeenCalled();
                expect(warningSpy.calls.count()).toBe(1);
                expect(warningSpy.calls.argsFor(0)[0][0].code).toBe('InfinityValuesNotSupported');
            });

            it('Value out of range in values shows a warning', () => {
                var dataView = getDataViewFromValues([200, -1e301]);
                var warningSpy = jasmine.createSpy('warning');
                hostServices.setWarnings = warningSpy;

                v.onDataChanged({ dataViews: [dataView] });

                expect(warningSpy).toHaveBeenCalled();
                expect(warningSpy.calls.count()).toBe(1);
                expect(warningSpy.calls.argsFor(0)[0][0].code).toBe('ValuesOutOfRange');
            });

            it('All okay in values shows a warning', () => {
                var dataView = getDataViewFromValues([200, 300]);
                var warningSpy = jasmine.createSpy('warning');
                hostServices.setWarnings = warningSpy;

                v.onDataChanged({ dataViews: [dataView] });

                expect(warningSpy).not.toHaveBeenCalled();
            });

            it('Waterfall Chart X and Y-axis show/hide Title ', () => {

            var element = powerbitests.helpers.testDom('500', '500');
            var hostServices = mocks.createVisualHostServices();
            var categoryIdentities = [mocks.dataViewScopeIdentity("John Domo")];
                var v = powerbi.visuals.visualPluginFactory.create().getPlugin('waterfallChart').create();
                v.init({
                    element: element,
                    host: hostServices,
                    style: powerbi.visuals.visualStyles.create(),
                    viewport: {
                        height: element.height(),
                        width: element.width()
                    },
                    interactivity: { isInteractiveLegend: false },
                    animation: { transitionImmediate: true },
                });
                var dataViewMetadataOneColumn: powerbi.DataViewMetadata = {
                    columns: [
                        {
                            displayName: 'AxesTitleTest',
                            type: DataShapeUtility.describeDataType(SemanticType.Number)
                        }],
                    objects: {
                        categoryAxis: {
                            showAxisTitle: true
                        },
                        valueAxis: {
                            showAxisTitle: true
                        }
                    }
                };

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataOneColumn,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataOneColumn.columns[0],
                                values: [500, 2000, 5000, 10000],
                                identity: categoryIdentities
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataOneColumn.columns[0],
                                values: [20, 1000],
                                subtotal: 1020
                            }])
                        }
                    }]
                });
                expect($('.xAxisLabel').first().text()).toBe('AxesTitleTest');
                expect($('.yAxisLabel').first().text()).toBe('AxesTitleTest');

                dataViewMetadataOneColumn.objects = {
                    categoryAxis: {
                        showAxisTitle: false
                    },
                    valueAxis: {
                        showAxisTitle: false
                    }
                };

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataOneColumn,
                    }]
                });
                expect($('.xAxisLabel').length).toBe(0);
                expect($('.yAxisLabel').length).toBe(0);
            });
        });

        describe('capabilities',() => {
            it('should include dataViewMappings',() => {
                expect(powerbi.visuals.waterfallChartCapabilities.dataViewMappings).toBeDefined();
            });

            it('should include dataRoles',() => {
                expect(powerbi.visuals.waterfallChartCapabilities.dataRoles).toBeDefined();
            });

            it('should not support highlight',() => {
                expect(powerbi.visuals.waterfallChartCapabilities.supportsHighlight).toBeUndefined();
            });

            it('FormatString property should match calculated',() => {
                expect(powerbi.data.DataViewObjectDescriptors.findFormatString(powerbi.visuals.waterfallChartCapabilities.objects)).toEqual(WaterfallChart.formatStringProp);
            });

            it('should register capabilities', () => {
                var pluginFactory = powerbi.visuals.visualPluginFactory.create();
                var plugin = pluginFactory.getPlugin('waterfallChart');
                expect(plugin).toBeDefined();
                expect(plugin.capabilities).toBe(powerbi.visuals.waterfallChartCapabilities);
            });
        });

        describe('data converter', () => {
            var colors = style.colorPalette.dataColors;

            var values = [100, -200, 250];
            var positions = [0, 100, -100, 0];  // The last position represents the total and is always 0.
            var categories = [2010, 2011, 2012];
            var posMax = 150;
            var posMin = -100;
            var total = 150;
            var dataView: powerbi.DataViewCategorical = {
                categories: [{
                    source: categoryColumn,
                    values: categories,
                }],
                values: DataViewTransform.createValueColumns([{
                    source: measureColumn,
                    values: values,
                }])
            };
            var dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            var sentimentColors = <powerbi.visuals.WaterfallChartSentimentColors> {
                increaseFill: <powerbi.Fill> {
                    solid: { color: "#FF0000" }
                },
                decreaseFill: <powerbi.Fill> {
                    solid: { color: "#00FF00" }
                },
                totalFill: <powerbi.Fill> {
                    solid: { color: "#0000FF" }
                },
            };
            var data = WaterfallChart.converter(dataView, colors, initOptions.host, dataLabelSettings, sentimentColors, null, null);
            var dataPoints = data.series[0].data;
            
            it('legend should have 3 items', () => {
                expect(data.legend.dataPoints.length).toBe(3);  // Gain, Loss, Total
            });

            it('has correct positions', () => {
                expect(dataPoints.map(d => d.position)).toEqual(positions);
                expect(data.positionMin).toBe(posMin);
                expect(data.positionMax).toBe(posMax);
            });

            it('has correct values', () => {
                expect(dataPoints.map(d => d.value)).toEqual(values.concat(total));
                expect(data.positionMin).toBe(posMin);
                expect(data.positionMax).toBe(posMax);
            });

            it('gain/loss colors match legend', () => {
                var gainLegend = data.legend.dataPoints[0];
                var lossLegend = data.legend.dataPoints[1];
                expect(dataPoints[0].color).toBe(gainLegend.color);  // first value is a gain
                expect(dataPoints[1].color).toBe(lossLegend.color);  // second value is a loss
            });

            it('should have no highlights', () => {
                expect(dataPoints.some(d => d.highlight)).toBe(false);
                expect(data.hasHighlights).toBe(false);
            });

            it('should have no selected data points', () => {
                expect(dataPoints.some(d => d.selected)).toBe(false);
            });

            it('tooltip data', () => {
                expect(dataPoints[0].tooltipInfo).toEqual([{ displayName: 'year', value: '2010' }, { displayName: 'sales', value: '$100' }]);
                expect(dataPoints[1].tooltipInfo).toEqual([{ displayName: 'year', value: '2011' }, { displayName: 'sales', value: '-$200' }]);
                expect(dataPoints[2].tooltipInfo).toEqual([{ displayName: 'year', value: '2012' }, { displayName: 'sales', value: '$250' }]);
                expect(dataPoints[3].tooltipInfo).toEqual([{ displayName: 'year', value: 'Waterfall_TotalLabel' }, { displayName: 'sales', value: '$150' }]);
            });
        });

        describe('setData', () => {
            var values = [100, -200, 250];
            var categories = [2010, 2011, 2012];
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

            var sentimentColors = colors.getSentimentColors();
            var gainFillHex = sentimentColors[2].value;
            var lossFillHex = sentimentColors[0].value;
           
            var metadata: powerbi.DataViewMetadata = {
                columns: [categoryColumn, measureColumn]
            };

            var data: powerbi.DataView = {
                categorical: dataView,
                metadata: metadata,
            };

            var chart: WaterfallChart;
            beforeEach(() => {
                chart = new WaterfallChart({ isScrollable: false });
                chart.init(initOptions);
            });

            it('sentiment colors should be set from data object', () => {
                data.metadata.objects = {
                    sentimentColors: {
                        increseFill: { solid: { color: gainFillHex } },
                        decreaseFill: { solid: { color: lossFillHex } }
                    }
                };

                chart.setData([data]);      
                var legendData = chart.calculateLegend();
                expect(legendData.dataPoints[0].color).toBe(gainFillHex);
                expect(legendData.dataPoints[1].color).toBe(lossFillHex);
            });

            it('should clear data if passed empty array', () => {
                chart.setData([data]);
                expect(chart.calculateLegend().dataPoints.length).not.toBe(0);

                chart.setData([]);
                expect(chart.calculateLegend().dataPoints.length).toBe(0);
            });
        });

        describe("Scrollbar", () => {
            var v: powerbi.IVisual, element: JQuery;
            var values = [500000, 495000, 490000, 480000, 500000, 500000, 500000, 500000, 500000];
            var categories = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
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
                columns: [categoryColumn, measureColumn]
            };

            var data: powerbi.DataView = {
                categorical: dataView,
                metadata: metadata,
            };

            beforeEach(() => {
                element = powerbitests.helpers.testDom('150', '50');
                v = powerbi.visuals.visualPluginFactory.createMinerva({
                    heatMap: false,
                    scrollableVisuals: true,
                }).getPlugin('waterfallChart').create();

                v.init({
                    element: element,
                    host: mocks.createVisualHostServices(),
                    style: powerbi.visuals.visualStyles.create(),
                    viewport: {
                        height: element.height(),
                        width: element.width()
                    },
                    svg: svg,
                    cartesianHost: cartesianHost,
                });

                v.onDataChanged({
                    dataViews: [data]
                });
            });

            it('DOM Validation', (done) => {
                setTimeout(() => {
                    expect($('.waterfallChart')).toBeInDOM();
                    expect($('rect.extent').length).toBe(1);
                    var transform = $('.waterfallChart .axisGraphicsContext .x.axis .tick').last().attr('transform');
                    var xTranslate = SVGUtil.parseTranslateTransform(transform).x;
                    var brushTransform = SVGUtil.parseTranslateTransform($('.brush').first().attr('transform'));
                    expect(xTranslate).toBeLessThan(element.width());
                    expect(brushTransform.x).toBe('19');
                    expect(brushTransform.y).toBe('116');
                    expect(parseInt($('.brush .extent')[0].attributes.getNamedItem('width').value, 0)).toBeGreaterThan(1);
                    expect($('.brush .extent')[0].attributes.getNamedItem('x').value).toBe('0');
                    done();
                }, DefaultWaitForRender);
            });

            it('Tooltip Data Validation', () => {

                var dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();                
                var gainFillHex = "#FF0000";
                var lossFillHex = "#00FF00";
                var totalFillHex = "#0000FF";
                var sentimentColors = <powerbi.visuals.WaterfallChartSentimentColors> {
                    increaseFill: { solid: { color: gainFillHex } },
                    decreaseFill: { solid: { color: lossFillHex } },
                    totalFill: { solid: { color: totalFillHex } }
                };
               
                var data = WaterfallChart.converter(dataView, colors, initOptions.host, dataLabelSettings, sentimentColors, null, null);
                var dataPoints = data.series[0].data;

                expect(dataPoints[0].tooltipInfo).toEqual([{ displayName: 'year', value: 'a' }, { displayName: 'sales', value: '$500000' }]);
                expect(dataPoints[1].tooltipInfo).toEqual([{ displayName: 'year', value: 'b' }, { displayName: 'sales', value: '$495000' }]);
                expect(dataPoints[2].tooltipInfo).toEqual([{ displayName: 'year', value: 'c' }, { displayName: 'sales', value: '$490000' }]);
                expect(dataPoints[3].tooltipInfo).toEqual([{ displayName: 'year', value: 'd' }, { displayName: 'sales', value: '$480000' }]);
                expect(dataPoints[4].tooltipInfo).toEqual([{ displayName: 'year', value: 'e' }, { displayName: 'sales', value: '$500000' }]);
                expect(dataPoints[5].tooltipInfo).toEqual([{ displayName: 'year', value: 'f' }, { displayName: 'sales', value: '$500000' }]);
                expect(dataPoints[6].tooltipInfo).toEqual([{ displayName: 'year', value: 'g' }, { displayName: 'sales', value: '$500000' }]);
                expect(dataPoints[7].tooltipInfo).toEqual([{ displayName: 'year', value: 'h' }, { displayName: 'sales', value: '$500000' }]);
                expect(dataPoints[8].tooltipInfo).toEqual([{ displayName: 'year', value: 'i' }, { displayName: 'sales', value: '$500000' }]);
                expect(dataPoints[9].tooltipInfo).toEqual([{ displayName: 'year', value: 'Waterfall_TotalLabel' }, { displayName: 'sales', value: '$4465000' }]);
            });
        });

        describe("data labels validation", () => {
            var v: powerbi.IVisual, element: JQuery;;

            var values = [100, -200, 250];
            var categories = [2010, 2011, 2012];
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("2010"),
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];

            var dataView: powerbi.DataViewCategorical = {
                categories: [{
                    source: categoryColumn,
                    values: categories,
                    identity: categoryIdentities,
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
                element = powerbitests.helpers.testDom('500', '500');
                v = powerbi.visuals.visualPluginFactory.create().getPlugin('waterfallChart').create();
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
            });

            it('verify labels in DOM', (done) => {
                data.metadata.objects = {
                    labels: {
                        show: true,
                        labelPrecision: 0,
                    }
                };
                var dataChangedOptions = {
                    dataViews: [data]
                };

                v.onDataChanged(dataChangedOptions);

                setTimeout(() => {

                    expect($('.dataLabelsSVG text')).toBeInDOM();
                    expect($('.dataLabelsSVG text').first().text()).toBe(values[0].toString());
                    // Two last labels are hidden due to collision detection
                    expect($('.dataLabelsSVG text').last().text()).toBe(values[1].toString());
                    done();
                }, DefaultWaitForRender);
            });

            it('labels should be visible', (done) => {
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

            it('labels should be hidden', (done) => {
                data.metadata.objects = {
                    labels: {
                        show: false,
                    }
                };
                var dataChangedOptions = {
                    dataViews: [data]
                };

                v.onDataChanged(dataChangedOptions);

                setTimeout(() => {
                    expect($('.dataLabelsSVG text').length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            });

            it('labels should support display units with no precision', (done) => {
                data.metadata.objects = {
                    labels: {
                        show: true,
                        labelDisplayUnits: 1000,
                        labelPrecision: 0
                    }
                };
                var dataChangedOptions = {
                    dataViews: [data]
                };

                v.onDataChanged(dataChangedOptions);

                setTimeout(() => {
                    expect($('.dataLabelsSVG text').first().text()).toBe('0K');
                    done();
                }, DefaultWaitForRender);
            });

            it('labels should support display units with precision', (done) => {
                data.metadata.objects = {
                    labels: {
                        show: true,
                        labelDisplayUnits: 1000,
                        labelPrecision: 1
                    }
                };
                var dataChangedOptions = {
                    dataViews: [data]
                };

                v.onDataChanged(dataChangedOptions);

                setTimeout(() => {
                    expect($('.dataLabelsSVG text').first().text()).toBe('0.1K');
                    done();
                }, DefaultWaitForRender);
            });

            it('label color should be overriden', (done) => {

                var expectedColor = 'rgb(80,90,100)';

                data.metadata.objects = {
                    labels: {
                        show: true,
                        color: { solid: { color: expectedColor } }
                    }
                };
                var dataChangedOptions = {
                    dataViews: [data]
                };

                v.onDataChanged(dataChangedOptions);

                setTimeout(() => {
                    var actualColor = $('.dataLabelsSVG text').css('fill').replace(/\ /g, "");
                    actualColor = (actualColor[0] === '#') ? jsCommon.color.rgbString(jsCommon.color.parseRgb(actualColor)) : actualColor;

                    expect(actualColor).toBe(expectedColor);

                    done();
                }, DefaultWaitForRender);
            });

            it('label color should be same as rect color', (done) => {

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
                    var rects = $('rect.column');
                    var texts = $('.mainGraphicsContext text');

                    for (var i = 0, len = texts.length; i < len; i++) {
                        var rectColor = $(rects[i]).css('fill').replace(/\ /g, "");
                        var textColor = $(texts[i]).css('fill').replace(/\ /g, "");

                        expect(rectColor).toBe(textColor);
                    }
                    done();
                }, DefaultWaitForRender);
            });

            it('labels color should be same as sentiments color', (done) => {
                var totalSentimentColor = 'rgb(1,2,3)';
                var increaseSentimentColors = 'rgb(4,5,6)';
                var decreaseSentimentColors = 'rgb(7,8,9)';

                data.metadata.objects = {
                    labels: {
                        show: true,
                    },
                    sentimentColors: {
                        totalFill: { solid: { color: totalSentimentColor } },
                        increaseFill: { solid: { color: increaseSentimentColors } },
                        decreaseFill: { solid: { color: decreaseSentimentColors } },
                    }
                };
                var dataChangedOptions = {
                    dataViews: [data]
                };

                v.onDataChanged(dataChangedOptions);

                setTimeout(() => {
                    var texts = $('.dataLabelsSVG text');

                    var increaseTextColor = texts.first().css('fill').replace(/\ /g, "");
                    var decreaseTextColor = $(texts[1]).css('fill').replace(/\ /g, "");

                    var rgbIncreaseTextColor = (increaseTextColor[0] === '#') ? jsCommon.color.rgbString(jsCommon.color.parseRgb(increaseTextColor)) : increaseTextColor;
                    var rgbDecreaseTextColor = (decreaseTextColor[0] === '#') ? jsCommon.color.rgbString(jsCommon.color.parseRgb(decreaseTextColor)) : decreaseTextColor;

                    expect(rgbIncreaseTextColor).toBe(increaseSentimentColors);
                    expect(rgbDecreaseTextColor).toBe(decreaseSentimentColors);

                    done();
                }, DefaultWaitForRender);
            });
           
        });

        describe("Enumerate Objects", () => {
            var v: powerbi.IVisual, element: JQuery;;

            var values = [100, -200, 250];
            var categories = [2010, 2011, 2012];

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
                element = powerbitests.helpers.testDom('500', '500');
                v = powerbi.visuals.visualPluginFactory.create().getPlugin('waterfallChart').create();
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
            });

            it('enumerateObjectInstances should include labels with empty data',() => {
                v.onDataChanged({ dataViews: [] });

                verifyLabels();
            });

            it('enumerateObjectInstances should include labels', () => {
                var dataChangedOptions = {
                    dataViews: [data]
                };
                
                v.onDataChanged(dataChangedOptions);

                verifyLabels();
            });

            it('enumerateObjectInstances should include sentiment colors with empty data',() => {
                v.onDataChanged({ dataViews: [] });

                verifyColors();
            });

            it('enumerateObjectInstances should include sentiment colors',() => {
                var dataChangedOptions = {
                    dataViews: [data]
                };

                v.onDataChanged(dataChangedOptions);

                verifyColors();
            });

            function verifyColors() {
                var points = v.enumerateObjectInstances({ objectName: 'sentimentColors' });

                expect(points.length).toBe(1);
                expect(points[0].properties['increaseFill']).toBeDefined();
                expect(points[0].properties['decreaseFill']).toBeDefined();
                expect(points[0].properties['totalFill']).toBeDefined();
            };
            
            function verifyLabels() {
                var points = v.enumerateObjectInstances({ objectName: 'labels' });
                var defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();

                expect(points.length).toBe(1);
                expect(points[0].properties).toBeDefined();

                var properties = points[0].properties;

                expect(properties['color']).toBe(defaultLabelSettings.labelColor);
                expect(properties['show']).toBe(false);
                expect(properties['labelPrecision']).toBe(defaultLabelSettings.precision);
                expect(properties['labelDisplayUnits']).toBe(defaultLabelSettings.displayUnits);
            }
        });

        // TODO: add DOM tests when the visual matches the spec.
    });

    function dummyDrawLegend(data: powerbi.visuals.LegendDataPoint[], viewport: powerbi.IViewport) {
    }
}