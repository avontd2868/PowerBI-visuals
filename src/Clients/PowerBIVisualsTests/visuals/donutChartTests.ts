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
    import ColorConvertor = powerbitests.utils.ColorUtility.convertFromRGBorHexToHex;
    import DataShapeUtility = powerbi.data.dsr.DataShapeUtility;
    import DataViewTransform = powerbi.data.DataViewTransform;
    import DonutChart = powerbi.visuals.DonutChart;
    import DonutData = powerbi.visuals.DonutData;
    import DonutDataPoint = powerbi.visuals.DonutDataPoint;
    import SelectionId = powerbi.visuals.SelectionId;
    import SemanticType = powerbi.data.SemanticType;

    var donutColors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;
    var DefaultWaitForRender = 10;

    describe("DonutChart", () => {
        var dataViewMetadata: powerbi.DataViewMetadata = {
            columns: [
                { displayName: 'col1', queryName: 'col1' },
                { displayName: 'col2', queryName: 'col2', isMeasure: true }]
        };

        var dataViewMetadata3Measure: powerbi.DataViewMetadata = {
            columns: [
                { displayName: 'col1', queryName: 'col1', isMeasure: true },
                { displayName: 'col2', queryName: 'col2', isMeasure: true },
                { displayName: 'col3', queryName: 'col3', isMeasure: true }]
        };

        var dataViewMetadata1Category2Measure: powerbi.DataViewMetadata = {
            columns: [
                { displayName: 'col1', queryName: 'col1' },
                { displayName: 'col2', queryName: 'col2', isMeasure: true },
                { displayName: 'col3', queryName: 'col3', isMeasure: true }]
        };

        var dataViewMetadata1Category2MeasureWithFormat: powerbi.DataViewMetadata = {
            columns: [
                { displayName: 'col1', queryName: 'col1' },
                { displayName: 'col2', queryName: 'col2', isMeasure: true, objects: { general: { formatString: "\$#,0;(\$#,0);\$#,0" } } },
                { displayName: 'col3', queryName: 'col3', isMeasure: true }]
        };

        var categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'p' });

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
        });

        it('DonutChart registered capabilities', () => {
            expect(powerbi.visuals.visualPluginFactory.create().getPlugin('donutChart').capabilities).toBe(powerbi.visuals.donutChartCapabilities);
        });

        it('Capabilities should not suppressDefaultTitle', () => {
            expect(powerbi.visuals.donutChartCapabilities.suppressDefaultTitle).toBeUndefined();
        });

        it('Donutchart preferred capabilities requires at least 2 row', () => {
            var dataViewWithSingleRow: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['a'],
                        identity: [mocks.dataViewScopeIdentity('a')]
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100],
                        subtotal: 100
                    }])
                }
            };

            var dataViewWithTwoRows: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['a', 'b'],
                        identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b')]
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100, 200],
                        subtotal: 300
                    }])
                }
            };

            var plugin = powerbi.visuals.visualPluginFactory.create().getPlugin('donutChart');
            expect(powerbi.DataViewAnalysis.supports(dataViewWithSingleRow, plugin.capabilities.dataViewMappings[0], true)).toBe(false);
            expect(powerbi.DataViewAnalysis.supports(dataViewWithTwoRows, plugin.capabilities.dataViewMappings[0])).toBe(true);
        });

        describe("Data Labels", () => {
            var v: powerbi.IVisual;
            var element: JQuery;
            var hostServices = powerbitests.mocks.createVisualHostServices();
            var dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    {
                        displayName: 'col1',
                        type: DataShapeUtility.describeDataType(SemanticType.String)
                    },
                    {
                        displayName: 'col2',
                        isMeasure: true,
                        type: DataShapeUtility.describeDataType(SemanticType.Integer)
                    }],
            };

            beforeEach(() => {
                powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
            });

            beforeEach(() => {
                element = powerbitests.helpers.testDom('500', '500');
                v = powerbi.visuals.visualPluginFactory.createMinerva({
                    heatMap: false,
                    dataDotChartOverride: false
                }).getPlugin('donutChart').create();
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

            function getOptionsForValueWarning(values: number[]) {
                var dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true },
                    categoryLabels: { show: true }
                };

                var options = {
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: values,
                            }])
                        }
                    }]
                };

                return options;
            }

            it('NaN in values shows a warning', (done) => {
                var warningSpy = jasmine.createSpy('warning');
                hostServices.setWarnings = warningSpy;

                var options = getOptionsForValueWarning([300, NaN, 700]);
                v.onDataChanged(options);

                setTimeout(() => {
                    expect(warningSpy).toHaveBeenCalled();
                    expect(warningSpy.calls.count()).toBe(1);
                    expect(warningSpy.calls.argsFor(0)[0][0].code).toBe('NaNNotSupported');
                    done();
                }, DefaultWaitForRender);
            });

            it('Negative Infinity in values shows a warning', (done) => {
                var warningSpy = jasmine.createSpy('warning');
                hostServices.setWarnings = warningSpy;

                var options = getOptionsForValueWarning([300, Number.NEGATIVE_INFINITY, 700]);
                v.onDataChanged(options);

                setTimeout(() => {
                    expect(warningSpy).toHaveBeenCalled();
                    expect(warningSpy.calls.count()).toBe(1);
                    expect(warningSpy.calls.argsFor(0)[0][0].code).toBe('InfinityValuesNotSupported');
                    done();
                }, DefaultWaitForRender);
            });

            it('Positive Infinity in values shows a warning', (done) => {
                var warningSpy = jasmine.createSpy('warning');
                hostServices.setWarnings = warningSpy;

                var options = getOptionsForValueWarning([300, Number.POSITIVE_INFINITY, 700]);
                v.onDataChanged(options);

                setTimeout(() => {
                    expect(warningSpy).toHaveBeenCalled();
                    expect(warningSpy.calls.count()).toBe(1);
                    expect(warningSpy.calls.argsFor(0)[0][0].code).toBe('InfinityValuesNotSupported');
                    done();
                }, DefaultWaitForRender);
            });

            it('Out of range value in values shows a warning', (done) => {
                var warningSpy = jasmine.createSpy('warning');
                hostServices.setWarnings = warningSpy;

                var options = getOptionsForValueWarning([300, 1e301, 700]);
                v.onDataChanged(options);

                setTimeout(() => {
                    expect(warningSpy).toHaveBeenCalled();
                    expect(warningSpy.calls.count()).toBe(1);
                    expect(warningSpy.calls.argsFor(0)[0][0].code).toBe('ValuesOutOfRange');
                    done();
                }, DefaultWaitForRender);
            });

            it('All are good in values shows a warning', (done) => {
                var warningSpy = jasmine.createSpy('warning');
                hostServices.setWarnings = warningSpy;

                var options = getOptionsForValueWarning([300, 200, 700]);
                v.onDataChanged(options);

                setTimeout(() => {
                    expect(warningSpy).not.toHaveBeenCalled();
                    done();
                }, DefaultWaitForRender);
            });

            it('Show the correct text - measure and category', (done) => {

                var dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true, labelPrecision: 0 },
                    categoryLabels: { show: true }
                };
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [100, 200, 700],
                            }])
                        }
                    }]
                });

                setTimeout(() => {
                    var labels = element.find('.donutChart .labels').find('text');
                    expect($(labels[0]).text()).toBe("a 100");
                    expect($(labels[1]).text()).toBe("b 200");
                    expect($(labels[2]).text()).toBe("c 700");
                    done();
                }, DefaultWaitForRender);
            });

            it('Show the correct text - measure with display units and no precision', (done) => {

                var dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true, labelDisplayUnits: 1000, labelPrecision: 0 },
                    categoryLabels: { show: true }
                };
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [12345, 15533, 776],
                            }])
                        }
                    }]
                });

                setTimeout(() => {
                    var labels = element.find('.donutChart .labels').find('text');
                    expect($(labels[0]).text()).toBe("a 12K");
                    expect($(labels[1]).text()).toBe("b 16K");
                    expect($(labels[2]).text()).toBe("c 1K");
                    done();
                }, DefaultWaitForRender);
            });

            it('Show the correct text - measure with display units and precision', (done) => {

                var dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true, labelDisplayUnits: 1000000, labelPrecision: 3 },
                    categoryLabels: { show: true }
                };
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [12345, 15533, 776],
                            }])
                        }
                    }]
                });

                setTimeout(() => {
                    var labels = element.find('.donutChart .labels').find('text');
                    expect($(labels[0]).text()).toBe("a 0.012M");
                    expect($(labels[1]).text()).toBe("b 0.016M");
                    expect($(labels[2]).text()).toBe("c 0.001M");
                    done();
                }, DefaultWaitForRender);
            });

            it('Show the correct text - measure', (done) => {
                var dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true, labelPrecision: 0,  },
                    categoryLabels: { show: false }
                };
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [100, 200, 700],
                            }])
                        }
                    }]
                });

                setTimeout(() => {
                    var labels = element.find('.donutChart .labels').find('text');
                    expect($(labels[0]).text()).toBe("100");
                    expect($(labels[1]).text()).toBe("200");
                    expect($(labels[2]).text()).toBe("700");
                    done();
                }, DefaultWaitForRender);
            });

            it('Show the correct text - category', (done) => {
                var dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: false },
                    categoryLabels: { show: true }
                };
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [100, 200, 700],
                            }])
                        }
                    }]
                });

                setTimeout(() => {
                    var labels = element.find('.donutChart .labels').find('text');
                    expect($(labels[0]).text()).toBe("a");
                    expect($(labels[1]).text()).toBe("b");
                    expect($(labels[2]).text()).toBe("c");
                    done();
                }, DefaultWaitForRender);
            });

            it('No data labels', (done) => {
                var dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: false },
                    categoryLabels: { show: false }
                };
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [100, 200, 700],
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    var label = element.find('.donutChart .labels').find('text');
                    expect($(label[0]).length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            });

            it('Verify data labels - default style', (done) => {
                var dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true },
                    categoryLabels: { show: false }
                };

                var color = "rgb(105, 105, 105)"; // Dim Grey
                var opacity = '1';
                var fontSize = '11px';
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [100, 200, 700],
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    var labels = element.find('.donutChart .labels').find('text');
                    var fill = $(labels[0]).css('fill');
                    expect(ColorConvertor(fill)).toBe(ColorConvertor(color));
                    expect($(labels[0]).css('opacity')).toBe(opacity);
                    expect($(labels[0]).css('font-size')).toBe(fontSize);
                    done();
                }, DefaultWaitForRender);
            });

            it('Verify data labels - changing measure color', (done) => {
                var color = { solid: { color: "rgb(255, 0, 0)" } }; // Red
                var dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true, color: color },
                    categoryLabels: { show: false }
                };
                
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [100, 200, 700],
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    var labels = element.find('.donutChart .labels').find('text');
                    var fill = $(labels[0]).css('fill');
                    expect(ColorConvertor(fill)).toBe(ColorConvertor(color.solid.color));
                    done();
                }, DefaultWaitForRender);
            });

            it('Verify data labels - changing category color', (done) => {
                var color = { solid: { color: "rgb(255, 0, 0)" } }; // Red
                var dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: false, color: color },
                    categoryLabels: { show: true }
                };

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [100, 200, 700],
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    var labels = element.find('.donutChart .labels').find('text');
                    var fill = $(labels[0]).css('fill');
                    expect(ColorConvertor(fill)).toBe(ColorConvertor(color.solid.color));
                    done();
                }, DefaultWaitForRender);
            });

            it('Long data labels', (done) => {
                var dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: false },
                    categoryLabels: { show: true }
                };
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['abcdefghijklmnopqrstuvwxyz', '01234567890123456789', 'abcdefg', 'd', 'e'],
                                identity: [mocks.dataViewScopeIdentity('abcdefghijklmnopqrstuvwxyz'),
                                    mocks.dataViewScopeIdentity('01234567890123456789'),
                                    mocks.dataViewScopeIdentity('abcdefg'),
                                    mocks.dataViewScopeIdentity('d'),
                                    mocks.dataViewScopeIdentity('e')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [110, 120, 130, 140, 150],
                                subtotal: 650
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    var labels = element.find('.donutChart .labels').find('text');
                    expect($(labels[0]).text()).toContain("...");
                    expect($(labels[1]).text()).toContain("...");
                    expect($(labels[2]).text()).toBe("abcdefg");
                    expect($(labels[3]).text()).toBe("d");
                    expect($(labels[4]).text()).toBe("e");
                    done();
                }, DefaultWaitForRender);
            });

            it('Data lables with null', (done) => {
                var dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: false },
                    categoryLabels: { show: true }
                };

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [100, 200, 700],
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    var labels = element.find('.donutChart .labels').find('text');
                    expect(labels.length).toBe(3);
                    done();
                }, DefaultWaitForRender);
            });

        });

        describe('converter', () => {
            var categoryIdentities = [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')];

            it('empty', () => {

                var dataView: powerbi.DataView = {
                    categorical: {
                        categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: []
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [],
                        subtotal: 0
                    }])
                        }
                    },
                    metadata: dataViewMetadata,
                };

                var actualData = DonutChart.converter(dataView, donutColors);
                var expectSlices: DonutData = {
                    dataPointsToDeprecate: [],
                    dataPointsToEnumerate: [],
                    dataPoints: [],
                    unCulledDataPoints: [],
                    legendData: { title: "", dataPoints: [] },
                    hasHighlights: false,
                    dataLabelsSettings: powerbi.visuals.dataLabelUtils.getDefaultDonutLabelSettings(),
                    legendObjectProperties: undefined,
                    maxValue: 0,
                };
                expect(actualData).toEqual(expectSlices);
            });

            it('categorical, with slicing', () => {
                var dataView: powerbi.DataView = {
                    categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['a', 'b', 'c'],
                        identity: categoryIdentities,
                        identityFields: [categoryColumnRef],
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [-300, null, 700]
                    }])
                    },
                    metadata: dataViewMetadata,
                };
                
                var actualData = DonutChart.converter(dataView, donutColors);
                var selectionIds: SelectionId[] = categoryIdentities.map(categoryId => SelectionId.createWithId(categoryId));
                var categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(dataView.categorical.categories[0].identityFields);
                var sliceColors = [
                    donutColors.getColorByScale(categoryColumnId, 'a').value,
                    donutColors.getColorByScale(categoryColumnId, 'b').value,
                    donutColors.getColorByScale(categoryColumnId, 'c').value,
                ];
                var expectSlices: DonutDataPoint[] = [
                        {
                            identity: selectionIds[0],
                            measure: -300,
                            value: 0.3,
                            index: 0,
                            label: 'a',
                            tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "-300" }],
                            color: sliceColors[0],
                        }, {
                            identity: selectionIds[1],
                            measure: 0,
                            value: 0.0,
                            index: 1,
                            label: 'b',
                            tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "0" }],
                            color: sliceColors[1],
                        }, {
                            identity: selectionIds[2],
                            measure: 700,
                            value: 0.7,
                            index: 2,
                            label: 'c',
                            tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "700" }],
                            color: sliceColors[2],
                    }].map(buildDataPoint);

                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);

                // Legend
                expect(actualData.legendData.title).toBe('col1');
                expect(actualData.legendData.dataPoints[0].label).toBe('a');
            });

            it('categorical, no slicing', () => {
                var dataView: powerbi.DataView = {
                    categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['a', 'b', 'c'],
                        identity: categoryIdentities,
                        identityFields: [categoryColumnRef],
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [-300, null, 700]
                    }])
                    },
                    metadata: dataViewMetadata,
                };

                var actualData = DonutChart.converter(dataView, donutColors);
                var selectionIds: SelectionId[] = categoryIdentities.map(categoryId => SelectionId.createWithId(categoryId));
                var categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(dataView.categorical.categories[0].identityFields);
                var sliceColors = [
                    donutColors.getColorByScale(categoryColumnId, 'a').value,
                    donutColors.getColorByScale(categoryColumnId, 'b').value,
                    donutColors.getColorByScale(categoryColumnId, 'c').value,
                ];
                var expectSlices: DonutDataPoint[] = [
                        {
                            identity: selectionIds[0],
                            measure: -300,
                            value: 0.3,
                            index: 0,
                            label: 'a',
                            tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "-300" }],
                            color: sliceColors[0],
                        }, {
                            identity: selectionIds[1],
                            measure: 0,
                            value: 0.0,
                            index: 1,
                            label: 'b',
                            tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "0" }],
                            color: sliceColors[1]
                        }, {
                            identity: selectionIds[2],
                            measure: 700,
                            value: 0.7,
                            index: 2,
                            label: 'c',
                            tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "700" }],
                            color: sliceColors[2],
                    }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
                // Legend
                expect(actualData.legendData.title).toBe('col1');
                expect(actualData.legendData.dataPoints[0].label).toBe('a');
            });

            it('category and series, with slicing', () => {
                var dataView: powerbi.DataView = {
                    categorical: {
                    categories: [{
                        source: dataViewMetadata1Category2Measure.columns[0],
                        values: ['a', 'b', 'c'],
                        identity: categoryIdentities,
                        identityFields: [categoryColumnRef],
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata1Category2Measure.columns[1],
                        values: [-200, null, 150],
                        identity: mocks.dataViewScopeIdentity('foo'),
                    }, {
                        source: dataViewMetadata1Category2Measure.columns[2],
                        values: [-300, 300, -50],
                        identity: mocks.dataViewScopeIdentity('bar'),
                    }])
                    },
                    metadata: dataViewMetadata1Category2Measure,
                };

                var actualData = DonutChart.converter(dataView, donutColors);
                var categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(dataView.categorical.categories[0].identityFields);
                var sliceColors = [
                    donutColors.getColorByScale(categoryColumnId, 'a').value,
                    donutColors.getColorByScale(categoryColumnId, 'b').value,
                    donutColors.getColorByScale(categoryColumnId, 'c').value,
                ];
                var expectSlices: DonutDataPoint[] = [
                    {
                        identity: SelectionId.createWithIds(categoryIdentities[0], dataView.categorical.values[0].identity),
                        measure: -200,
                        value: 0.2,
                        index: 0,
                        label: 'col2',
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "-200" }],
                        color: sliceColors[0],
                    }, {
                        identity: SelectionId.createWithIds(categoryIdentities[0], dataView.categorical.values[1].identity),
                        measure: -300,
                        value: 0.3,
                        index: 0,
                        label: 'col3',
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col3", value: "-300" }],
                        color: sliceColors[0],
                    }, {
                        identity: SelectionId.createWithIds(categoryIdentities[1], dataView.categorical.values[0].identity),
                        measure: 0,
                        value: 0.0,
                        index: 1,
                        label: 'col2',
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "0" }],
                        color: sliceColors[1],
                    }, {
                        identity: SelectionId.createWithIds(categoryIdentities[1], dataView.categorical.values[1].identity),
                        measure: 300,
                        value: 0.3,
                        index: 1,
                        label: 'col3',
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col3", value: "300" }],
                        color: sliceColors[1],
                    }, {
                        identity: SelectionId.createWithIds(categoryIdentities[2], dataView.categorical.values[0].identity),
                        measure: 150,
                        value: 0.15,
                        index: 2,
                        label: 'col2',
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "150" }],
                        color: sliceColors[2],
                    }, {
                        identity: SelectionId.createWithIds(categoryIdentities[2], dataView.categorical.values[1].identity),
                        measure: -50,
                        value: 0.05,
                        index: 2,
                        label: 'col3',
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col3", value: "-50" }],
                        color: sliceColors[2],
                    }].map(buildDataPoint);

                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);

                // Legend
                expect(actualData.legendData.title).toBe('col1');
                expect(actualData.legendData.dataPoints.length).toBe(3);
                expect(actualData.legendData.dataPoints[0].label).toBe('a');
                expect(actualData.legendData.dataPoints[1].label).toBe('b');
                expect(actualData.legendData.dataPoints[2].label).toBe('c');
            });

            it('categorical, no slicing, formatted color', () => {
                var hexGreen = "#00FF00";
                var dataView: powerbi.DataView = {
                    categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['a', 'b', 'c'],
                        identity: categoryIdentities,
                        identityFields: [categoryColumnRef],
                        objects: [
                            undefined,
                            { dataPoint: { fill: { solid: { color: hexGreen } } } },
                            undefined,
                        ]
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [-300, null, 700]
                    }])
                    },
                    metadata: dataViewMetadata,
                };

                var actualData = DonutChart.converter(dataView, donutColors);
                var selectionIds: SelectionId[] = categoryIdentities.map(categoryId => SelectionId.createWithId(categoryId));
                var categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(dataView.categorical.categories[0].identityFields);
                var sliceColors = [
                    donutColors.getColorByScale(categoryColumnId, 'a').value,
                    hexGreen,
                    donutColors.getColorByScale(categoryColumnId, 'c').value,
                ];
                var expectSlices: DonutDataPoint[] = [
                    {
                        identity: selectionIds[0],
                        measure: -300,
                        value: 0.3,
                        index: 0,
                        label: 'a',
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "-300" }],
                        color: sliceColors[0],
                    }, {
                        identity: selectionIds[1],
                        measure: 0,
                        value: 0.0,
                        index: 1,
                        label: 'b',
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "0" }],
                        color: sliceColors[1],
                    }, {
                        identity: selectionIds[2],
                        measure: 700,
                        value: 0.7,
                        index: 2,
                        label: 'c',
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "700" }],
                        color: sliceColors[2],
                    }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
                // Legend
                expect(actualData.legendData.title).toBe('col1');
                expect(actualData.legendData.dataPoints[0].label).toBe('a');
            });

            it('categorical multi-measure, with slicing', () => {
                var dataView: powerbi.DataView = {
                    categorical: {
                    categories: [{
                        source: dataViewMetadata1Category2Measure.columns[0],
                        values: ['a', 'b', 'c'],
                        identity: categoryIdentities,
                        identityFields: [categoryColumnRef],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadata1Category2Measure.columns[1],
                            values: [-200, null, 150]
                        },
                        {
                            source: dataViewMetadata1Category2Measure.columns[2],
                            values: [-300, 300, -50]
                        }
                    ])
                    },
                    metadata: dataViewMetadata1Category2Measure,
                };

                var actualData = DonutChart.converter(dataView, donutColors);
                var categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(dataView.categorical.categories[0].identityFields);
                var sliceColors = [
                    donutColors.getColorByScale(categoryColumnId, 'a').value,
                    donutColors.getColorByScale(categoryColumnId, 'b').value,
                    donutColors.getColorByScale(categoryColumnId, 'c').value,
                ];
                var expectSlices: DonutDataPoint[] = [
                        {
                            identity: SelectionId.createWithIdAndMeasure(categoryIdentities[0], 'col2'),
                            measure: -200,
                            label: 'col2',
                            value: 0.2,
                            index: 0,
                            tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "-200" }],
                            color: sliceColors[0],
                        }, {
                            identity: SelectionId.createWithIdAndMeasure(categoryIdentities[0], 'col3'),
                            measure: -300,
                            label: 'col3',
                            value: 0.3,
                            index: 0,
                            tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col3", value: "-300" }],
                            color: sliceColors[0],
                        }, {
                            identity: SelectionId.createWithIdAndMeasure(categoryIdentities[1], 'col2'),
                            measure: 0,
                            label: 'col2',
                            value: 0,
                            index: 1,
                            tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "0" }],
                            color: sliceColors[1],
                        }, {
                            identity: SelectionId.createWithIdAndMeasure(categoryIdentities[1], 'col3'),
                            measure: 300,
                            label: 'col3',
                            value: 0.3,
                            index: 1,
                            tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col3", value: "300" }],
                            color: sliceColors[1],
                        }, {
                            identity: SelectionId.createWithIdAndMeasure(categoryIdentities[2], 'col2'),
                            label: 'col2',
                            measure: 150,
                            value: 0.15,
                            index: 2,
                            tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "150" }],
                            color: sliceColors[2],
                        }, {
                            identity: SelectionId.createWithIdAndMeasure(categoryIdentities[2], 'col3'),
                            label: 'col3',
                            measure: -50,
                            value: 0.05,
                            index: 2,
                            tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col3", value: "-50" }],
                            color: sliceColors[2],
                    }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
                // Legend
                expect(actualData.legendData.title).toBe('col1');
                expect(actualData.legendData.dataPoints.length).toBe(3);
                expect(actualData.legendData.dataPoints[0].label).toBe('a');
                expect(actualData.legendData.dataPoints[1].label).toBe('b');
                expect(actualData.legendData.dataPoints[2].label).toBe('c');
            });

            it('non-categorical multi-measure, with slicing',() => {
                // Explicitly set the color for the first measure.
                var columnWithColor = powerbi.Prototype.inherit(dataViewMetadata3Measure.columns[0]);
                columnWithColor.objects = { dataPoint: { fill: { solid: { color: 'red' } } } };

                var dataView: powerbi.DataView = {
                    categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: columnWithColor,
                            values: [200]
                        },
                        {
                            source: dataViewMetadata3Measure.columns[1],
                            values: [-300]
                        },
                        {
                            source: dataViewMetadata3Measure.columns[2],
                            values: [500]
                        }
                    ])
                    },
                    metadata: dataViewMetadata3Measure,
                };

                // Slicing does not come into effect for non-categorical multi-measure
                var actualData = DonutChart.converter(dataView, donutColors);
                var selectionIds = dataViewMetadata3Measure.columns.map((c) => SelectionId.createWithMeasure(c.displayName));
                var sliceColors = [
                    'red',
                    donutColors.getColor(dataViewMetadata3Measure.columns[1].queryName).value,
                    donutColors.getColor(dataViewMetadata3Measure.columns[2].queryName).value,
                ];
                var expectSlices: DonutDataPoint[] = [
                        {
                            identity: selectionIds[0],
                            label: 'col1',
                            measure: 200,
                            value: 0.2,
                            index: 0,
                            tooltipInfo: [{ displayName: "col1", value: "200" }],
                            color: sliceColors[0],
                        }, {
                            identity: selectionIds[1],
                            label: 'col2',
                            measure: -300,
                            value: 0.3,
                            index: 1,
                            tooltipInfo: [{ displayName: "col2", value: "-300" }],
                            color: sliceColors[1],
                        }, {
                            identity: selectionIds[2],
                            label: 'col3',
                            measure: 500,
                            value: 0.5,
                            index: 2,
                            tooltipInfo: [{ displayName: "col3", value: "500" }],
                            color: sliceColors[2],
                    }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
                // Legend
                expect(actualData.legendData.title).toBe('');
                expect(actualData.legendData.dataPoints[0].label).toBe('col1');
            });

            it('non-categorical single-measure, with slicing', () => {
                var dataView: powerbi.DataView = {
                    categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadata3Measure.columns[0],
                            values: [200]
                        }
                    ])
                    },
                    metadata: dataViewMetadata3Measure,
                };

                // Slicing does not come into effect for non-categorical single-measure
                var actualData = DonutChart.converter(dataView, donutColors);
                var selectionIds = dataViewMetadata3Measure.columns.map((c) => SelectionId.createWithMeasure(c.displayName));
                var sliceColors = [donutColors.getColor(dataViewMetadata3Measure.columns[0].queryName).value];
                var expectSlices: DonutDataPoint[] = [
                    {
                        identity: selectionIds[0],
                        label: 'col1',
                        measure: 200,
                        value: 1.0,
                        index: 0,
                        tooltipInfo: [{ displayName: "col1", value: "200" }],
                        color: sliceColors[0],
                    }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
                // Legend
                expect(actualData.legendData.title).toBe('');
                expect(actualData.legendData.dataPoints[0].label).toBe('col1');
            });

            it('non-categorical series',() => {
                var dataView: powerbi.DataView = {
                    categorical: {
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata3Measure.columns[0],
                                values: [200],
                                identity: mocks.dataViewScopeIdentity('col1'),
                            }, {
                                source: dataViewMetadata3Measure.columns[1],
                                values: [300],
                                identity: mocks.dataViewScopeIdentity('col2'),
                            }
                        ],
                        [categoryColumnRef])
                    },
                    metadata: dataViewMetadata,
                };
                dataView.categorical.values.source = dataViewMetadata[1];

                var actualData = DonutChart.converter(dataView, donutColors);
                var selectionIds = dataView.categorical.values.map((c) => SelectionId.createWithId(c.identity));
                var columnRefId = powerbi.data.SQExprShortSerializer.serializeArray([categoryColumnRef]);
                var sliceColors = [
                    donutColors.getColorByScale(columnRefId, 'col1').value,
                    donutColors.getColorByScale(columnRefId, 'col2').value,
                ];

                var expectSlices: DonutDataPoint[] = [
                    {
                        identity: selectionIds[0],
                        label: 'col1',
                        measure: 200,
                        value: 0.4,
                        index: 0,
                        tooltipInfo: [{ displayName: "col1", value: "200" }],
                        color: sliceColors[0],
                    }, {
                        identity: selectionIds[1],
                        label: 'col2',
                        measure: 300,
                        value: 0.6,
                        index: 1,
                        tooltipInfo: [{ displayName: "col2", value: "300" }],
                        color: sliceColors[1],
                    }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
                // Legend
                expect(actualData.legendData.title).toBe('');
                expect(actualData.legendData.dataPoints[0].label).toBe('col1');
                expect(actualData.legendData.dataPoints[1].label).toBe('col2');
            });

            it('with highlights',() => {
                // categorical, multi-measure slices, with highlights
                var dataView: powerbi.DataView = {
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata1Category2Measure.columns[1],
                                values: [-200, null, 150],
                                highlights: [-100, null, 15],
                            },
                            {
                                source: dataViewMetadata1Category2Measure.columns[2],
                                values: [-300, 300, -50],
                                highlights: [-150, 75, 50],
                            }
                        ])
                    },
                    metadata: dataViewMetadata1Category2Measure,
                };

                var actualData = DonutChart.converter(dataView, donutColors);
                var categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(dataView.categorical.categories[0].identityFields);
                var sliceColors = [
                    donutColors.getColorByScale(categoryColumnId, 'a').value,
                    donutColors.getColorByScale(categoryColumnId, 'b').value,
                    donutColors.getColorByScale(categoryColumnId, 'c').value,
                ];
                var highlightDisplayName = powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName;
                var expectSlices: DonutDataPoint[] = [
                    {
                        identity: SelectionId.createWithIdAndMeasure(categoryIdentities[0], 'col2'),
                        measure: -200,
                        label: 'col2',
                        highlightRatio: 0.5,
                        value: 0.2,
                        index: 0,
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "-200" }, { displayName: highlightDisplayName, value: "-100" }],
                        color: sliceColors[0],
                    }, {
                        identity: SelectionId.createWithIdAndMeasure(categoryIdentities[0], 'col3'),
                        measure: -300,
                        label: 'col3',
                        highlightRatio: 0.5,
                        value: 0.3,
                        index: 0,
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col3", value: "-300" }, { displayName: highlightDisplayName, value: "-150" }],
                        color: sliceColors[0],
                    }, {
                        identity: SelectionId.createWithIdAndMeasure(categoryIdentities[1], 'col2'),
                        measure: 0,
                        label: 'col2',
                        highlightRatio: 1e-9,
                        value: 0,
                        index: 1,
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "0" }],
                        color: sliceColors[1],
                    }, {
                        identity: SelectionId.createWithIdAndMeasure(categoryIdentities[1], 'col3'),
                        measure: 300,
                        label: 'col3',
                        highlightRatio: 0.25,
                        value: 0.3,
                        index: 1,
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col3", value: "300" }, { displayName: highlightDisplayName, value: "75" }],
                        color: sliceColors[1],
                    }, {
                        identity: SelectionId.createWithIdAndMeasure(categoryIdentities[2], 'col2'),
                        label: 'col2',
                        highlightRatio: 0.1,
                        measure: 150,
                        value: 0.15,
                        index: 2,
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "150" }, { displayName: highlightDisplayName, value: "15" }],
                        color: sliceColors[2],
                    }, {
                        identity: SelectionId.createWithIdAndMeasure(categoryIdentities[2], 'col3'),
                        label: 'col3',
                        highlightRatio: 1,
                        measure: -50,
                        value: 0.05,
                        index: 2,
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col3", value: "-50" }, { displayName: highlightDisplayName, value: "50" }],
                        color: sliceColors[2],
                    }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
                // Legend
                expect(actualData.legendData.title).toBe('col1');
                expect(actualData.legendData.dataPoints.length).toBe(3);
                expect(actualData.legendData.dataPoints[0].label).toBe('a');
                expect(actualData.legendData.dataPoints[1].label).toBe('b');
                expect(actualData.legendData.dataPoints[2].label).toBe('c');
            });

            //validate tooltip on highlighted values, the first tooptip is regular because highlighted value is 0, another tooltips are highlighted tooltips 
            it('with highlights - special case tooltip validation',() => {
                // categorical, multi-measure slices, zero-highlight as special case
                var dataView: powerbi.DataView = {
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata1Category2MeasureWithFormat.columns[1],
                                values: [-200, null, 150],
                                highlights: [0, null, 10],
                            }, {
                                source: dataViewMetadata1Category2MeasureWithFormat.columns[2],
                                values: [-300, 300, -50],
                                highlights: [0, 75, 50],
                            }]),
                    },
                    metadata: null,
                };

                var actualData = DonutChart.converter(dataView, donutColors);
               
                var highlightName = powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName;

                //regular tooltip
                expect(actualData.dataPoints[0].data.tooltipInfo).toEqual([{ displayName: "col1", value: "a" }, { displayName: "col2", value: "($200)" }]);
                expect(actualData.dataPoints[1].data.tooltipInfo).toEqual([{ displayName: "col1", value: "a" }, { displayName: "col3", value: "-300" }]);
                expect(actualData.dataPoints[2].data.tooltipInfo).toEqual([{ displayName: "col1", value: "b" }, { displayName: "col2", value: "$0" }]);
                //tooltips with highlighted values
                expect(actualData.dataPoints[3].data.tooltipInfo).toEqual([{ displayName: "col1", value: "b" }, { displayName: "col3", value: "300" }, { displayName: highlightName, value: "75" }]);
                expect(actualData.dataPoints[4].data.tooltipInfo).toEqual([{ displayName: "col1", value: "c" }, { displayName: "col2", value: "$150" }, { displayName: highlightName, value: "$10" }]);
                expect(actualData.dataPoints[5].data.tooltipInfo).toEqual([{ displayName: "col1", value: "c" }, { displayName: "col3", value: "-50" }, { displayName: highlightName, value: "50" }]);
            });

            //validate tooltip that tooltip info doesn't change if data and category labels are on and off 
            it('on/off data lables - tooltip validation',() => {
               
                var dataView: powerbi.DataView = {
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata1Category2MeasureWithFormat.columns[1],
                                values: [-200, 100, 150],
                            }, {
                                source: dataViewMetadata1Category2MeasureWithFormat.columns[2],
                                values: [-300, 300, -50],
                            }]),
                    },
                    metadata: null,
                };

                var tooltipInfo1 = [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "($200)" }];
                var tooltipInfo2 = [{ displayName: "col1", value: "a" }, { displayName: "col3", value: "-300" }];
                var tooltipInfo3 = [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "$100" }];
                var tooltipInfo4 = [{ displayName: "col1", value: "b" }, { displayName: "col3", value: "300" }];
                var tooltipInfo5 = [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "$150" }];
                var tooltipInfo6 = [{ displayName: "col1", value: "c" }, { displayName: "col3", value: "-50" }];
                var actualData = DonutChart.converter(dataView, donutColors);
                expect(actualData.dataPoints[0].data.tooltipInfo).toEqual(tooltipInfo1);
                expect(actualData.dataPoints[1].data.tooltipInfo).toEqual(tooltipInfo2);
                expect(actualData.dataPoints[2].data.tooltipInfo).toEqual(tooltipInfo3);
                expect(actualData.dataPoints[3].data.tooltipInfo).toEqual(tooltipInfo4);
                expect(actualData.dataPoints[4].data.tooltipInfo).toEqual(tooltipInfo5);
                expect(actualData.dataPoints[5].data.tooltipInfo).toEqual(tooltipInfo6);

                //data labels are on
                dataViewMetadata1Category2Measure.objects = {
                    labels: { show: true },
                    categoryLabels: { show: false }
                };
                actualData = DonutChart.converter(dataView, donutColors);
                expect(actualData.dataPoints[0].data.tooltipInfo).toEqual(tooltipInfo1);
                expect(actualData.dataPoints[1].data.tooltipInfo).toEqual(tooltipInfo2);
                expect(actualData.dataPoints[2].data.tooltipInfo).toEqual(tooltipInfo3);

                //data labels and category labels are on
                dataViewMetadata1Category2Measure.objects = {
                    labels: { show: true },
                    categoryLabels: { show: true }
                };
                actualData = DonutChart.converter(dataView, donutColors);
                expect(actualData.dataPoints[0].data.tooltipInfo).toEqual(tooltipInfo1);
                expect(actualData.dataPoints[1].data.tooltipInfo).toEqual(tooltipInfo2);
                expect(actualData.dataPoints[2].data.tooltipInfo).toEqual(tooltipInfo3);

                //data labels off and category labels are on
                dataViewMetadata1Category2Measure.objects = {
                    labels: { show: false },
                    categoryLabels: { show: true }
                };
                actualData = DonutChart.converter(dataView, donutColors);
                expect(actualData.dataPoints[0].data.tooltipInfo).toEqual(tooltipInfo1);
                expect(actualData.dataPoints[1].data.tooltipInfo).toEqual(tooltipInfo2);
                expect(actualData.dataPoints[2].data.tooltipInfo).toEqual(tooltipInfo3);
            });

            it('with highlights that overflow', () => {
                // categorical, no slicing - with OverFlow
                var dataView: powerbi.DataView = {
                    categorical: {
                    categories: [{
                        source: dataViewMetadata1Category2Measure.columns[0],
                        values: ['a', 'b', 'c'],
                        identity: categoryIdentities,
                        identityFields: [categoryColumnRef],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadata1Category2MeasureWithFormat.columns[1],
                            values: [-200, null, 150],
                            highlights: [-100, null, 250 /* NOTE: this highlight value > the corresponding non-highlight value */],
                        }, {
                            source: dataViewMetadata1Category2MeasureWithFormat.columns[2],
                            values: [-300, 300, -50],
                            highlights: [-150, 75, 50],
                        }]),
                    },
                    metadata: null,
                };

                var actualData = DonutChart.converter(dataView, donutColors);
                var selectionIds: SelectionId[] = categoryIdentities.map(categoryId => SelectionId.createWithId(categoryId));
                var categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(dataView.categorical.categories[0].identityFields);
                var sliceColors = [
                    donutColors.getColorByScale(categoryColumnId, 'a').value,
                    donutColors.getColorByScale(categoryColumnId, 'b').value,
                    donutColors.getColorByScale(categoryColumnId, 'c').value,
                ];
                var highlightName = powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName;
                var expectSlices: DonutDataPoint[] = [
                        {
                            identity: SelectionId.createWithIdAndMeasure(categoryIdentities[0], 'col2'),
                            measure: -100,
                            measureFormat: "\$#,0;(\$#,0);\$#,0",
                            label: 'col2',
                            value: 0.16,
                            highlightRatio: 1.0,
                            index: 0,
                            tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "($100)" }, { displayName: highlightName, value: "($100)" }],
                            color: sliceColors[0],
                        }, {
                            identity: SelectionId.createWithIdAndMeasure(categoryIdentities[0], 'col3'),
                            measure: -150,
                            measureFormat: undefined,
                            label: 'col3',
                            value: 0.24,
                            highlightRatio: 1.0,
                            index: 0,
                            tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col3", value: "-150" }, { displayName: highlightName, value: "-150" }],
                            color: sliceColors[0],
                        }, {
                            identity: SelectionId.createWithIdAndMeasure(categoryIdentities[1], 'col2'),
                            label: 'col2',
                            measure: 0,
                            measureFormat: "\$#,0;(\$#,0);\$#,0",
                            value: 0.0,
                            highlightRatio: 1.0,
                            index: 1,
                            tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "$0" }],
                            color: sliceColors[1],
                        }, {
                            identity: SelectionId.createWithIdAndMeasure(categoryIdentities[1], 'col3'),
                            label: 'col3',
                            measure: 75,
                            measureFormat: undefined,
                            value: 0.12,
                            highlightRatio: 1.0,
                            index: 1,
                            tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col3", value: "75" }, { displayName: highlightName, value: "75" }],
                            color: sliceColors[1],
                        }, {
                            identity: SelectionId.createWithIdAndMeasure(categoryIdentities[2], 'col2'),
                            measure: 250,
                            measureFormat: "\$#,0;(\$#,0);\$#,0",
                            label: 'col2',
                            value: 0.4,
                            highlightRatio: 1.0,
                            index: 2,
                            tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "$250" }, { displayName: highlightName, value: "$250" }],
                            color: sliceColors[2],
                        }, {
                            identity: SelectionId.createWithIdAndMeasure(categoryIdentities[2], 'col3'),
                            measure: 50,
                            measureFormat: undefined,
                            label: 'col3',
                            value: 0.08,
                            highlightRatio: 1.0,
                            index: 2,
                            tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col3", value: "50" }, { displayName: highlightName, value: "50" }],
                            color: sliceColors[2],
                        }].map(buildDataPoint);
                expect(actualData.dataPoints.map((value) => value.data)).toEqual(expectSlices);
            });
        });

        it('non-categorical multi-measure tooltip values test', () => {
            var dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'a', isMeasure: true },
                    { displayName: 'b', isMeasure: true },
                    { displayName: 'c', isMeasure: true }
                ]
            };

            var dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadata.columns[0],
                            values: [1],
                        },
                        {
                            source: dataViewMetadata.columns[1],
                            values: [2],
                        },
                        {
                            source: dataViewMetadata.columns[2],
                            values: [3],
                        }
                    ])
                }
            };

            var actualData = DonutChart.converter(dataView, donutColors);
            
            expect(actualData.dataPoints[0].data.tooltipInfo).toEqual([{ displayName: 'a', value: '1' }]);
            expect(actualData.dataPoints[1].data.tooltipInfo).toEqual([{ displayName: 'b', value: '2' }]);
            expect(actualData.dataPoints[2].data.tooltipInfo).toEqual([{ displayName: 'c', value: '3' }]);
        });

        function buildDataPoint(data: { identity: SelectionId; measure: number; highlightRatio?: number; measureFormat?: string; value: number; index: any; label: string; tooltipInfo?: powerbi.visuals.TooltipDataItem[]; highlightedTooltipInfo?: powerbi.visuals.TooltipDataItem[]; color?: string }): DonutDataPoint {
            return <DonutDataPoint> {
                identity: data.identity,
                measure: data.measure,
                measureFormat: data.measureFormat,
                percentage: data.value,
                index: data.index,
                label: data.label,
                selected: false,
                highlightRatio: data.highlightRatio || 0,
                tooltipInfo: data.tooltipInfo,
                color: data.color,
                labelColor: powerbi.visuals.dataLabelUtils.defaultLabelColor,
            };
        }
    });

    function pieChartDomValidation(interactiveChart: boolean, hasLegendObject: boolean) {
        var v: powerbi.IVisual, element: JQuery;
        var hostServices = mocks.createVisualHostServices();

        var dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                }, {
                    displayName: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                }
            ],
        };
        if (hasLegendObject) {
            dataViewMetadataTwoColumn.objects = { legend: { show: true } };
        }
        else {
            dataViewMetadataTwoColumn.objects = undefined;
        }

        var dataViewMetadata1Category2Measure: powerbi.DataViewMetadata = {
            columns: [
                { displayName: 'col1', queryName: 'col1' },
                { displayName: 'col2', queryName: 'col2', isMeasure: true },
                { displayName: 'col3', queryName: 'col3', isMeasure: true }]
        };
        if (hasLegendObject) {
            dataViewMetadata1Category2Measure.objects = { legend: { show: true } };
        }
        else {
            dataViewMetadata1Category2Measure.objects = undefined;
        }

        var categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'p' });

        beforeEach(() => {
            powerbi.common.localize = powerbi.common.createLocalizationService();
            powerbitests.mocks.setLocale(powerbi.common.localize);

            element = powerbitests.helpers.testDom('500', '500');
            if (interactiveChart)
                v = powerbi.visuals.visualPluginFactory.create().getPlugin('pieChart').create();
            else
                v = powerbi.visuals.visualPluginFactory.createMinerva({
                    heatMap: false,
                }).getPlugin('pieChart').create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { isInteractiveLegend: interactiveChart, selection: true },
                animation: { transitionImmediate: true }
            });
        });

        it('pie chart dom validation', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.donutChart')).toBeInDOM();
                expect($('.donutChart .slice').length).toBe(3);
                done();
            }, DefaultWaitForRender);
        });

        it('pie chart dom validation with partial highlights', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                            highlights: [50, 0, 300],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.donutChart')).toBeInDOM();

                var dimmedOpacity = interactiveChart ? 0.6 : powerbi.visuals.ColumnUtil.DimmedOpacity;
                var slices = $('.donutChart .slice');
                expect(slices.length).toBe(3);
                slices.each((i, element) =>
                    expect(parseFloat($(element).css('fill-opacity'))).toBeCloseTo(dimmedOpacity, 0)
                );

                var highlightSlices = $('.donutChart .slice-highlight');
                expect(highlightSlices.length).toBe(3);
                highlightSlices.each((i, element) =>
                    expect(parseFloat($(element).css('fill-opacity'))).toBeCloseTo(powerbi.visuals.ColumnUtil.DefaultOpacity, 2)
                    );

                done();
            }, DefaultWaitForRender);
        });

        it('pie chart should clear dom validation', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.donutChart')).toBeInDOM();
                expect($('.donutChart .slice').length).toBe(3);
                if (interactiveChart)
                    expect($('.legend-item').length).toBe(3);
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataTwoColumn,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataTwoColumn.columns[0],
                                values: [],
                                identity: [],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataTwoColumn.columns[1],
                                values: [],
                            }])
                        }
                    }]
                });

                setTimeout(() => {
                    expect($('.donutChart')).toBeInDOM();
                    expect($('.donutChart .slice').length).toBe(0);
                    if (interactiveChart)
                        expect($('.legend-item').length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it('pie chart dom validation with slices', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata1Category2Measure,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata1Category2Measure.columns[1],
                                values: [200, 100, 150]
                            }, {
                                source: dataViewMetadata1Category2Measure.columns[2],
                                values: [300, 200, 50]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.donutChart')).toBeInDOM();
                expect($('.donutChart .slice').length).toBe(6);
                done();
            }, DefaultWaitForRender);
        });

        it('pie chart dom validation with normal slices', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [300, 300, 400],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                var svg = $('.donutChart');
                expect(svg).toBeInDOM();

                // Disabling test due to instability in test infrastructure.
                //expect($('.donutChart polyline').filter(function () {
                //       return $(this).css('opacity') === '0.5'
                //    }).length).toBe(3);

                //expect(svg.attr('height')).toBe(initialHeight);
                //expect(svg.attr('width')).toBe(initialWidth);

                done();
            }, DefaultWaitForRender);
        });

        it('pie chart label dom validation with thin slices', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [5, 5, 990],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.donutChart')).toBeInDOM();
                // lines are not present on interactive legend mode, and currently if regular legend is on we hide labels
                if (!interactiveChart && !hasLegendObject) {
                    expect($('.donutChart polyline').length).toBe(3);
                }
                done();
            }, DefaultWaitForRender * 2);
        });

        it('pie chart with duplicate labels dom validation', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['abc', 'abc', 'abc'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.donutChart')).toBeInDOM();
                expect($('.donutChart .slice').length).toBe(3);
                if (!interactiveChart && !hasLegendObject) {
                    expect($('.donutChart polyline').length).toBe(3);
                    expect($('.donutChart .labels text').length).toBe(3);
                }
                done();
            }, DefaultWaitForRender);
        });

        it('pie chart dom validation with very long labels', (done) => {

            //make sure category labels on
            var dataViewMetadataTwoColumnLabels = powerbi.Prototype.inherit(dataViewMetadataTwoColumn);
            dataViewMetadataTwoColumnLabels.objects = { categoryLabels: { show: true }, labels: { show: false } };

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumnLabels,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumnLabels.columns[0],
                            values: ['John Domo Who lives far far away', 'Delta Force of the 56th Battalion', 'Jean Tablau from the silicon valley'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumnLabels.columns[1],
                            values: [300, 300, 400],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.donutChart')).toBeInDOM();
                var labels = $('.labels').find('text');
                for (var i = 0; i < labels.length; i++) {
                    var text = $(labels[i]).text().substr(-3);
                    expect(text).toEqual('...');
                }
                done();
            }, DefaultWaitForRender);
        });

        it('pie chart culling invisible slices validation', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 50, 0.000001],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.donutChart')).toBeInDOM();
                expect($('.donutChart .slice').length).toBe(interactiveChart ? 3 : 2);
                done();
            }, DefaultWaitForRender);
        });

        it('pie chart culling small slices validation', (done) => {
            spyOn(hostServices, 'setWarnings').and.callThrough();

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 50, 0.28],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.donutChart')).toBeInDOM();
                expect($('.donutChart .slice').length).toBe(interactiveChart ? 3 : 2);
                if (!interactiveChart)
                    expect(hostServices.setWarnings).toHaveBeenCalledWith([new powerbi.visuals.SmallSlicesCulledWarning()]);
                done();
            }, DefaultWaitForRender);
        });

        it('pie chart opacity validation with overlapping slices', (done) => {
            dataViewMetadataTwoColumn.objects = {
                labels: { show: false },
                categoryLabels: { show: true }
            };
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['abc', 'def', 'ghi', 'jkl'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c'), mocks.dataViewScopeIdentity('d')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [1, 1, 5, 90],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.donutChart')).toBeInDOM();
                // lines are not present on interactive legend mode, and currently if regular legend is on we hide labels
                if (!interactiveChart && !hasLegendObject) {
                    expect($('.donutChart polyline').filter(function () {
                        return $(this).css('opacity') === '0.5';
                    }).length).toBe(2);
                    expect($('.donutChart text').filter(function () {
                        return $(this).css('opacity') === '0';
                    }).length).toBe(2);
                }
                done();
            }, DefaultWaitForRender * 2);
        });

        it('pie chart radius calculation validation', (done) => {

            // spy on calculateRadius() method
            var pieChart: any = v;
            spyOn(pieChart, 'calculateRadius').and.callThrough();

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['abc', 'def', 'ghi', 'jkl'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c'), mocks.dataViewScopeIdentity('d')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [2, 3, 4, 90],
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.donutChart')).toBeInDOM();
                // verify the calculateRadius() was called during the rendering on the visual 
                expect(pieChart.calculateRadius).toHaveBeenCalled();
                // call calculateRadius() and test for the result, based on whether the chart is interactive or not
                var radiusResult = pieChart.calculateRadius();
                var height = $('.donutChart').height();
                var width = $('.donutChart').width();
                var widthOrHeight = Math.min(width, height);

                var hw = height / width;
                var denom = 2 + (1 / (1 + Math.exp(-5 * (hw - 1))));

                var expectedRadius = interactiveChart ? widthOrHeight / 2 : widthOrHeight / denom;
                expect(radiusResult).toBeCloseTo(expectedRadius, 0);
                done();
            }, DefaultWaitForRender * 2);
        });

        it('pie chart slice select', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                        }])
                    }
                }]
            });

            var slices = $('.donutChart .slice');
            var sliceToClickIndex = 1;
            var sliceToClick = $(slices[sliceToClickIndex]);
            var otherSlices = slices.not(sliceToClick);
            var renderLegend = dataViewMetadataTwoColumn.objects && dataViewMetadataTwoColumn.objects['legend'];

            slices.each(function () {
                expect(parseFloat($(this).css('fill-opacity'))).toBe(1);
            });

            var pieChart: any = v;
            if (interactiveChart) {
                var interactivityState = pieChart.interactivityState;
                var pieLegend = interactivityState.interactiveLegend;

                spyOn(pieChart, 'setInteractiveChosenSlice').and.callThrough();
                spyOn(pieLegend, 'updateLegend').and.callThrough();
            }

            // Click the first slice
            (<any>sliceToClick).d3Click();

            setTimeout(() => {
                expect($('.donutChart .slice').length).toBe(3);
                if (interactiveChart) {
                    expect(pieChart.setInteractiveChosenSlice).toHaveBeenCalledWith(sliceToClickIndex);
                    expect(pieLegend.updateLegend).toHaveBeenCalledWith(sliceToClickIndex);
                }
                else {
                    expect(parseFloat(sliceToClick.css('fill-opacity'))).toBe(1);
                    otherSlices.each(function () {
                        expect(parseFloat($(this).css('fill-opacity'))).toBeLessThan(1);
                    });

                    // Legend
                    if (renderLegend) {
                        expect($('.legend .item').length).toBe(3);
                        var icons = $('.legend .icon.tall');
                        expect(icons[sliceToClickIndex].style.backgroundColor).toBe('rgb(55, 70, 73)');
                        expect(icons[0].style.backgroundColor).toBe('rgb(166, 166, 166)');
                        expect(icons[2].style.backgroundColor).toBe('rgb(166, 166, 166)');
                    }
                }

                // Click the background
                var clearCatcher = $('.clearCatcher');
                (<any>clearCatcher).d3Click();

                setTimeout(() => {
                    slices.each(function () {
                        expect(parseFloat($(this).css('fill-opacity'))).toBe(1);
                    });
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it('pie chart selecting a slice triggers select', () => {
            if (interactiveChart) {
                // not applicable to interactive charts
                return;
            }

            var identities = [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: identities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                        }])
                    }
                }]
            });

            var onSelectSpy = spyOn(hostServices, 'onSelect');

            var slices = $('.donutChart .slice');
            var sliceToClick = 1;
            (<any>$(slices[sliceToClick])).d3Click();

            expect(onSelectSpy).toHaveBeenCalled();
            expect(onSelectSpy.calls.argsFor(0)[0].data[0]).toEqual({ data: [identities[sliceToClick]] });
        });

        it('pie chart highlighted slice select', (done) => {
            if (interactiveChart) {
                // not applicable to interactive charts
                done();
                return;
            }

            var identities = [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: identities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                            highlights: [50, 100, 350],
                        }])
                    }
                }]
            });

            var slices = $('.donutChart .slice');
            var sliceToClickIndex = 1;
            var sliceToClick = $(slices[sliceToClickIndex]);
            var otherSlices = slices.not(sliceToClick);

            // Click the first slice
            (<any>sliceToClick).d3Click();

            setTimeout(() => {
                expect($('.donutChart .slice').length).toBe(3);
                expect(parseFloat(sliceToClick.css('fill-opacity'))).toBe(1);
                otherSlices.each(function () {
                    expect(parseFloat($(this).css('fill-opacity'))).toBeLessThan(1);
                });
                done();
            }, DefaultWaitForRender);
        });

        it('pie chart selecting a highlighted slice triggers select', () => {
            if (interactiveChart) {
                // not applicable to interactive charts
                return;
            }

            var identities = [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: identities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                            highlights: [50, 100, 350],
                        }])
                    }
                }]
            });

            var onSelectSpy = spyOn(hostServices, 'onSelect');

            var slices = $('.donutChart .slice-highlight');
            var sliceToClick = 1;
            (<any>$(slices[sliceToClick])).d3Click();

            expect(onSelectSpy).toHaveBeenCalled();
            expect(onSelectSpy.calls.argsFor(0)[0].data[0]).toEqual({ data: [identities[sliceToClick]] });
        });

        it('pie chart slice multi-select', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                        }])
                    }
                }]
            });

            var slices = $('.donutChart .slice');
            var slicesToClickIndex = [1, 2];
            var slicesToClick = $(slices).slice(1, 3);
            var otherSlices = slices.not(slicesToClick);
            var renderLegend = dataViewMetadataTwoColumn.objects && dataViewMetadataTwoColumn.objects['legend'];

            slices.each(function () {
                expect(parseFloat($(this).css('fill-opacity'))).toBe(1);
            });

            var pieChart: any = v;
            if (interactiveChart) {
                var interactivityState = pieChart.interactivityState;
                var pieLegend = interactivityState.interactiveLegend;

                spyOn(pieChart, 'setInteractiveChosenSlice').and.callThrough();
                spyOn(pieLegend, 'updateLegend').and.callThrough();
            }

            // Click the first slice, then the second with ctrl key
            (<any>slicesToClick.eq(0)).d3Click();
            (<any>slicesToClick.eq(1)).d3Click(0, 0, powerbitests.helpers.ClickEventType.CtrlKey);

            setTimeout(() => {
                expect($('.donutChart .slice').length).toBe(3);
                if (interactiveChart) {
                    slicesToClickIndex.forEach((i) => {
                        expect(pieChart.setInteractiveChosenSlice).toHaveBeenCalledWith(i);
                        expect(pieLegend.updateLegend).toHaveBeenCalledWith(i);
                    });
                }
                else {
                    slicesToClick.each(function () {
                        expect(parseFloat($(this).css('fill-opacity'))).toBe(1);
                    });

                    otherSlices.each(function () {
                        expect(parseFloat($(this).css('fill-opacity'))).toBeLessThan(1);
                    });

                    // Legend
                    if (renderLegend) {
                        expect($('.legend .item').length).toBe(3);
                        var icons = $('.legend .icon.tall');
                        expect(icons[0].style.backgroundColor).toBe('rgb(166, 166, 166)');
                        expect(icons[1].style.backgroundColor).toBe('rgb(157, 73, 140)');
                        expect(icons[2].style.backgroundColor).toBe('rgb(187, 203, 80)');
                        var labels = $('.labels').find('text');
                        expect($(labels[0]).css('opacity')).toBe('0');
                        expect($(labels[1]).css('opacity')).toBe('0');
                        expect($(labels[2]).css('opacity')).toBe('0');
                    }
                    else {
                        expect($('.labels').find('text').length).toBe(3);
                    }
                }

                // Click the background
                var clearCatcher = $('.clearCatcher');
                (<any>clearCatcher).d3Click();

                setTimeout(() => {
                    slices.each(function () {
                        expect(parseFloat($(this).css('fill-opacity'))).toBe(1);
                    });
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it('pie chart legend interactivity', () => {
            if (!interactiveChart) {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataTwoColumn,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataTwoColumn.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataTwoColumn.columns[1],
                                values: [100, 200, 700],
                            }])
                        }
                    }]
                });

                // click on legend item
                var renderLegend = dataViewMetadataTwoColumn.objects && dataViewMetadataTwoColumn.objects['legend'];
                if (renderLegend) {
                    var icons = $('.legend .icon.tall');
                    var slices = $('.donutChart .slice');

                    (<any>icons.first()).d3Click(0, 0);
                    setTimeout(() => {
                        expect(icons[0].style.backgroundColor).toBe('rgb(1, 184, 170)');
                        expect(icons[1].style.backgroundColor).toBe('rgb(166, 166, 166)');
                        expect(icons[2].style.backgroundColor).toBe('rgb(166, 166, 166)');

                        expect(parseFloat(slices[0].style.fillOpacity)).toBe(1);
                        expect(parseFloat(slices[1].style.fillOpacity)).toBeLessThan(1);
                        expect(parseFloat(slices[2].style.fillOpacity)).toBeLessThan(1);
                    }, DefaultWaitForRender * 2);
                }
            }
        });

        if (hasLegendObject) {
            it('legend formatting', (done) => {
                var dataView = {
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                        }])
                    }
                };

                dataView.metadata.objects = { legend: { show: true } };

                v.onDataChanged({
                    dataViews: [dataView]
                });

                setTimeout(() => {
                    expect($('.donutChart')).toBeInDOM();
                    expect($('.donutChart .slice').length).toBe(3);
                    if (hasLegendObject) {
                        expect($('.legend').attr('orientation')).toBe(LegendPosition.Top.toString());
                    }

                    //change legend position
                    dataView.metadata.objects = { legend: { show: true, position: 'Right' } };

                    v.onDataChanged({
                        dataViews: [dataView]
                    });
                    setTimeout(() => {
                        expect($('.donutChart')).toBeInDOM();
                        expect($('.donutChart .slice').length).toBe(3);
                        if (hasLegendObject) {
                            expect($('.legend').attr('orientation')).toBe(LegendPosition.Right.toString());
                        }

                        //set title
                        var testTitle = 'Test Title'; 
                        dataView.metadata.objects = { legend: { show: true, position: 'Right', showTitle: true, titleText: testTitle } };
                        v.onDataChanged({
                            dataViews: [dataView]
                        });
                        setTimeout(() => {
                            expect($('.donutChart')).toBeInDOM();
                            if (hasLegendObject) {
                                expect($('.legend').attr('orientation')).toBe(LegendPosition.Right.toString());
                                expect($('.legendTitle').text()).toBe(testTitle);
                            }
                            //hide legend
                            dataView.metadata.objects = { legend: { show: false, position: 'Right' } };
                            v.onDataChanged({
                                dataViews: [dataView]
                            });
                            setTimeout(() => {
                                expect($('.donutChart')).toBeInDOM();
                                if (hasLegendObject) {
                                    expect($('.legend').attr('orientation')).toBe(LegendPosition.None.toString());
                                }
                                done();
                            }, DefaultWaitForRender);
                        }, DefaultWaitForRender);
                    }, DefaultWaitForRender);
                }, DefaultWaitForRender);
            });
        }               
    }

    describe("PieChart DOM validation", () => pieChartDomValidation(false, false));
    describe("PieChart DOM validation - with legend", () => pieChartDomValidation(false, true));
    describe("Interactive PieChart DOM validation", () => pieChartDomValidation(true, false));

    describe("Pie Chart Interactivity", () => {
        var v: powerbi.IVisual, element: JQuery;
        var hostServices = powerbitests.mocks.createVisualHostServices();
        var dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                }, {
                    displayName: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                }
            ],
        };

        beforeEach(() => {
            powerbi.common.localize = powerbi.common.createLocalizationService();
            powerbitests.mocks.setLocale(powerbi.common.localize);

            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('pieChart').create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { isInteractiveLegend: true },
                animation: { transitionImmediate: true }, // disable animations for testing
            });

            var dataViewMetadataTwoColumnLabels = powerbi.Prototype.inherit(dataViewMetadataTwoColumn);
            dataViewMetadataTwoColumnLabels.objects = { categoryLabels: { show: true }, labels: { show: false } };
            var categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'p' });

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumnLabels,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumnLabels.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumnLabels.columns[1],
                            values: [100, 200, 700],
                        }])
                    }
                }]
            });
        });

        it('legend structure', (done) => {
            setTimeout(() => {
                expect($('[data-legend-index=0]>.category').text()).toBe("a");
                expect($('[data-legend-index=0]>.value').text()).toBe("100");
                expect(ColorConvertor($('[data-legend-index=0]>.percentage').css('color'))).toBe(ColorConvertor($('.slice').eq(0).css('fill')));
                expect($('[data-legend-index=1]>.category').text()).toBe("b");
                expect($('[data-legend-index=1]>.value').text()).toBe("200");
                expect(ColorConvertor($('[data-legend-index=1]>.percentage').css('color'))).toBe(ColorConvertor($('.slice').eq(1).css('fill')));
                expect($('[data-legend-index=2]>.category').text()).toBe("c");
                expect($('[data-legend-index=2]>.value').text()).toBe("700");
                expect(ColorConvertor($('[data-legend-index=2]>.percentage').css('color'))).toBe(ColorConvertor($('.slice').eq(2).css('fill')));
                expect($('.donutLegend').length).toBe(1);
                expect($('.legend-item').length).toBe(3);
                expect($('.donutChart .slice').length).toBe(3);
                done();
            }, DefaultWaitForRender);
        });

        it('slice drag', (done) => {

            function setD3Event(x, y) {
                var event = <any>document.createEvent('MouseEvents');
                event.sourceEvent = {
                    type: 'mouseEvent',
                    pageX: x,
                    pageY: y,
                    stopPropagation: () => { },
                };
                d3.event = <any>event;
            }

            var pieChart: any = v;
            var interactivityState = pieChart.interactivityState;

            spyOn(powerbi.visuals.SVGUtil, 'translateAndRotate');
            spyOn(pieChart, 'setInteractiveChosenSlice').and.callThrough();
            spyOn(pieChart, 'getAngleFromDragEvent').and.callThrough();

            // simulate a drag gesture from below the center of the donut to it's upper part, 180 degrees drag.
            var centerCoordinates = interactivityState.donutCenter;
            var dragFromCoordinates = { x: centerCoordinates.x, y: centerCoordinates.y - 20 };
            var dragToCoordinates = { x: centerCoordinates.x, y: centerCoordinates.y + 20 };

            var currentRotation = pieChart.interactivityState.currentRotate; 
            // simulate dragging using setting d3.event
            setD3Event(dragFromCoordinates.x, dragFromCoordinates.y);
            pieChart.interactiveDragStart(); // call dragStart
            setD3Event(dragToCoordinates.x, dragToCoordinates.y);
            pieChart.interactiveDragMove(); // call dragMove
            pieChart.interactiveDragEnd(); // complete the drag - call dragEnd

            expect(pieChart.getAngleFromDragEvent.calls.count()).toBe(2); // angle should have been calculated twice (first for dragstart and second for dragEnd)
            expect((<any>powerbi.visuals.SVGUtil.translateAndRotate).calls.first().args[4]).toBe(currentRotation + 180); // first call to rotate (mathches dragMove) should rotate the chart by 180 degrees
            expect(pieChart.setInteractiveChosenSlice).toHaveBeenCalledWith(2);
            done();
        });

        function swipeTest(swipeLeft: boolean, expectedSliceIndex: number, done: any) {
            var pieChart: any = v;
            var interactivityState = pieChart.interactivityState;
            var pieLegend = interactivityState.interactiveLegend;

            spyOn(pieChart, 'setInteractiveChosenSlice').and.callThrough();
            spyOn(pieLegend, 'updateLegend').and.callThrough();

            // drag on the legend
            pieLegend.dragLegend(swipeLeft);
            setTimeout(() => {
                expect(pieChart.setInteractiveChosenSlice).toHaveBeenCalledWith(expectedSliceIndex);
                expect(pieLegend.updateLegend).toHaveBeenCalledWith(expectedSliceIndex);
                expect($('.donutChart').length).toBe(1);
                expect($('.donutLegend').length).toBe(1);
                expect($('.legend-item').length).toBe(3);
                expect($('.donutChart .slice').length).toBe(3);
                done();
            }, DefaultWaitForRender);
        }

        it('legend items swipe right', (done) => swipeTest(false, 2, done)); // swiping right - exepecting to get the last slice index
        it('legend items swipe left', (done) => swipeTest(true, 1, done)); // swiping left - exepecting to get the second slice index

        function rotateValidation(swipeLeft: boolean, done: any) {
            var pieChart: any = v;
            var interactivityState = pieChart.interactivityState;
            var pieLegend = interactivityState.interactiveLegend;

            spyOn(pieChart, 'setInteractiveChosenSlice').and.callThrough();
            spyOn(pieLegend, 'updateLegend').and.callThrough();

            // verify the order of the legend items, and their rotation.
            // the middle should be item 0, to the right, item 1 and to the left of item 0 is item 2.
            // meaning, DOM elements order is item2 -> item0 -> item1
            var legendItems = $('.legend-item');
            expect(legendItems.length).toEqual(3);
            expect(legendItems.eq(0).attr('data-legend-index')).toEqual('2');
            expect(legendItems.eq(1).attr('data-legend-index')).toEqual('0');
            expect(legendItems.eq(2).attr('data-legend-index')).toEqual('1');

            // drag on the legend
            pieLegend.dragLegend(swipeLeft);

            setTimeout(() => {
                // items should be rotated
                var rotatedLegendItems = $('.legend-item');
                if (swipeLeft) {
                    expect(rotatedLegendItems.eq(0).attr('data-legend-index')).toBe('0');
                    expect(rotatedLegendItems.eq(1).attr('data-legend-index')).toBe('1');
                    expect(rotatedLegendItems.eq(2).attr('data-legend-index')).toBe('2');
                } else {
                    expect(rotatedLegendItems.eq(0).attr('data-legend-index')).toBe('1');
                    expect(rotatedLegendItems.eq(1).attr('data-legend-index')).toBe('2');
                    expect(rotatedLegendItems.eq(2).attr('data-legend-index')).toBe('0');
                }
                done();
            }, DefaultWaitForRender);
        }

        it('legend items are rotated correctly when swiping right', (done) => rotateValidation(false, done));
        it('legend items are rotated correctly when swiping left', (done) => rotateValidation(true, done));
    });

    describe("Enumerate Objects", () => {
        var v: powerbi.IVisual, element: JQuery;
        var dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                }, {
                    displayName: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                }
            ],
        };
        var categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'p' });

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
        });

        beforeEach(() => {
            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('donutChart').create();

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

        it('Check enumeration for categorical', (done) => {
            dataViewMetadataTwoColumn.objects = {
                labels: { show: false },
                categoryLabels: { show: true }
            };
            var dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                        }])
                    }
                }]
            };

            v.onDataChanged(dataChangedOptions);
            var points = v.enumerateObjectInstances({ objectName: 'dataPoint' });
            expect(points.length).toBe(3);
            expect(points[0].displayName).toEqual('a');
            expect(points[0].properties['fill']).toBeDefined();
            expect(points[1].displayName).toEqual('b');
            expect(points[1].properties['fill']).toBeDefined();
            done();
        });

        it('Check enumeration for category and series', (done) => {
            var dataViewMetadata1Category2Measure: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'col1' },
                    { displayName: 'col2', isMeasure: true },
                    { displayName: 'col3', isMeasure: true }]
            };

            var categoryIdentities = [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')];
            var dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata1Category2Measure.columns[1],
                            values: [-200, null, 150],
                            identity: mocks.dataViewScopeIdentity('foo'),
                        }, {
                                source: dataViewMetadata1Category2Measure.columns[2],
                                values: [-300, 300, -50],
                                identity: mocks.dataViewScopeIdentity('bar'),
                            }])
                    }
                }]
            };

            v.onDataChanged(dataChangedOptions);

            var points = v.enumerateObjectInstances({ objectName: 'dataPoint' });
            expect(points.length).toBe(3);
            expect(points[0].displayName).toEqual('a');
            expect(points[0].properties['fill']).toBeDefined();
            expect(points[1].displayName).toEqual('b');
            expect(points[1].properties['fill']).toBeDefined();
            done();
        });

        it('Check datapoints enumeration after hiding legend', (done) => {
            var dataView = {
                metadata: dataViewMetadataTwoColumn,
                categorical: {
                    categories: [{
                        source: dataViewMetadataTwoColumn.columns[0],
                        values: ['a', 'b', 'c'],
                        identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                        identityFields: [categoryColumnRef],
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadataTwoColumn.columns[1],
                        values: [100, 200, 700],
                    }])
                }
            };

            dataView.metadata.objects = { legend: { show: false } };

            v.onDataChanged({
                dataViews: [dataView]
            });

            setTimeout(() => {
                // Check legend is hidden
                expect($('.legend').attr('orientation')).toBe(LegendPosition.None.toString());
                var points = v.enumerateObjectInstances({ objectName: 'dataPoint' });
                expect(points.length).toBe(3);
                done();
            }, DefaultWaitForRender);
        });
    });

    describe("Pie Chart Web Animation", () => {
        var v: powerbi.IVisual, element: JQuery;
        var hostServices = powerbitests.mocks.createVisualHostServices();
        var dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                }, {
                    displayName: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                }
            ],
        };
        var categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'p' });

        beforeEach(() => {
            powerbi.common.localize = powerbi.common.createLocalizationService();
            powerbitests.mocks.setLocale(powerbi.common.localize);

            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.visualPluginFactory.createMinerva({
                heatMap: false,
            }).getPlugin('pieChart').create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { selection: true },
                animation: { transitionImmediate: true }
            });
        });

        it('pie chart partial highlight animations', (done) => {
            var dataViewsNoHighlights = {
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                        }])
                    }
                }]
            };
            var dataViewsHighlightsA = {
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                            highlights: [50, 26, 560],
                        }])
                    }
                }]
            };
            var dataViewsHighlightsB = {
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [mocks.dataViewScopeIdentity('a'), mocks.dataViewScopeIdentity('b'), mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                            highlights: [20, 126, 60],
                        }])
                    }
                }]
            };

            v.onDataChanged(dataViewsNoHighlights);
            setTimeout(() => {
                var svgInit = $('.donutChart');
                var initialHeight = svgInit.attr('height'), initialWidth = svgInit.attr('width');

                var animator = <powerbi.visuals.WebDonutChartAnimator>(<DonutChart>v).animator;
                spyOn(animator, 'animate').and.callThrough();

                v.onDataChanged(dataViewsHighlightsA);
                v.onDataChanged(dataViewsHighlightsB);
                v.onDataChanged(dataViewsNoHighlights);

                expect(animator).toBeTruthy();
                expect(animator.animate).toHaveBeenCalled();

                setTimeout(() => {
                    var svg = $('.donutChart');
                    expect(svg).toBeInDOM();

                    expect(svg.attr('height')).toBe(initialHeight);
                    expect(svg.attr('width')).toBe(initialWidth);

                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });
    });
}
