0; //-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbitests;
(function (powerbitests) {
    var ColorConvertor = powerbitests.utils.ColorUtility.convertFromRGBorHexToHex;
    var DataShapeUtility = powerbi.data.dsr.DataShapeUtility;
    var DataViewTransform = powerbi.data.DataViewTransform;
    var DonutChart = powerbi.visuals.DonutChart;
    var SelectionId = powerbi.visuals.SelectionId;
    var SemanticType = powerbi.data.SemanticType;
    var donutColors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;
    var DefaultWaitForRender = 10;
    describe("DonutChart", function () {
        var dataViewMetadata = {
            columns: [
                { name: 'col1' },
                { name: 'col2', isMeasure: true }
            ]
        };
        var dataViewMetadata3Measure = {
            columns: [
                { name: 'col1', isMeasure: true },
                { name: 'col2', isMeasure: true },
                { name: 'col3', isMeasure: true }
            ]
        };
        var dataViewMetadata1Category2Measure = {
            columns: [
                { name: 'col1' },
                { name: 'col2', isMeasure: true },
                { name: 'col3', isMeasure: true }
            ]
        };
        var dataViewMetadata1Category2MeasureWithFormat = {
            columns: [
                { name: 'col1' },
                { name: 'col2', isMeasure: true, objects: { general: { formatString: "\$#,0;(\$#,0);\$#,0" } } },
                { name: 'col3', isMeasure: true }
            ]
        };
        var categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'p' });
        beforeEach(function () {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
        });
        it('DonutChart registered capabilities', function () {
            expect(powerbi.visuals.visualPluginFactory.create().getPlugin('donutChart').capabilities).toBe(powerbi.visuals.donutChartCapabilities);
        });
        it('Capabilities should not suppressDefaultTitle', function () {
            expect(powerbi.visuals.donutChartCapabilities.suppressDefaultTitle).toBeUndefined();
        });
        it('Donutchart preferred capabilities requires at least 2 row', function () {
            var dataViewWithSingleRow = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['a'],
                        identity: [powerbitests.mocks.dataViewScopeIdentity('a')]
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100],
                        subtotal: 100
                    }])
                }
            };
            var dataViewWithTwoRows = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['a', 'b'],
                        identity: [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b')]
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
        describe("Data Labels", function () {
            var v;
            var element;
            var dataViewMetadata = {
                columns: [
                    {
                        name: 'col1',
                        type: DataShapeUtility.describeDataType(2048 /* String */)
                    },
                    {
                        name: 'col2',
                        isMeasure: true,
                        type: DataShapeUtility.describeDataType(SemanticType.Integer)
                    }
                ],
            };
            beforeEach(function () {
                powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
            });
            beforeEach(function () {
                element = powerbitests.helpers.testDom('500', '500');
                v = powerbi.visuals.visualPluginFactory.createMinerva({
                    heatMap: false,
                    newTable: false,
                    dataDotChartOverride: false
                }).getPlugin('donutChart').create();
                v.init({
                    element: element,
                    host: powerbitests.mocks.createVisualHostServices(),
                    style: powerbi.common.services.visualStyles.create(),
                    viewport: {
                        height: element.height(),
                        width: element.width()
                    },
                    animation: { transitionImmediate: true },
                });
            });
            it('Show the correct text - measure and category', function (done) {
                var dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true },
                    categoryLabels: { show: true }
                };
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [100, 200, 700],
                            }])
                        }
                    }]
                });
                setTimeout(function () {
                    var labels = element.find('.donutChart .labels').find('text');
                    expect($(labels[0]).text()).toBe("a 100");
                    expect($(labels[1]).text()).toBe("b 200");
                    expect($(labels[2]).text()).toBe("c 700");
                    done();
                }, DefaultWaitForRender);
            });
            it('Show the correct text - measure with display units and no precision', function (done) {
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
                                identity: [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [12345, 15533, 776],
                            }])
                        }
                    }]
                });
                setTimeout(function () {
                    var labels = element.find('.donutChart .labels').find('text');
                    expect($(labels[0]).text()).toBe("a 12K");
                    expect($(labels[1]).text()).toBe("b 16K");
                    expect($(labels[2]).text()).toBe("c 1K");
                    done();
                }, DefaultWaitForRender);
            });
            it('Show the correct text - measure with display units and precision', function (done) {
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
                                identity: [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [12345, 15533, 776],
                            }])
                        }
                    }]
                });
                setTimeout(function () {
                    var labels = element.find('.donutChart .labels').find('text');
                    expect($(labels[0]).text()).toBe("a 0.012M");
                    expect($(labels[1]).text()).toBe("b 0.016M");
                    expect($(labels[2]).text()).toBe("c 0.001M");
                    done();
                }, DefaultWaitForRender);
            });
            it('Show the correct text - measure', function (done) {
                var dataViewMetadataWithLabels = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabels.objects = {
                    labels: { show: true },
                    categoryLabels: { show: false }
                };
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabels,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabels.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [100, 200, 700],
                            }])
                        }
                    }]
                });
                setTimeout(function () {
                    var labels = element.find('.donutChart .labels').find('text');
                    expect($(labels[0]).text()).toBe("100");
                    expect($(labels[1]).text()).toBe("200");
                    expect($(labels[2]).text()).toBe("700");
                    done();
                }, DefaultWaitForRender);
            });
            it('Show the correct text - category', function (done) {
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
                                identity: [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [100, 200, 700],
                            }])
                        }
                    }]
                });
                setTimeout(function () {
                    var labels = element.find('.donutChart .labels').find('text');
                    expect($(labels[0]).text()).toBe("a");
                    expect($(labels[1]).text()).toBe("b");
                    expect($(labels[2]).text()).toBe("c");
                    done();
                }, DefaultWaitForRender);
            });
            it('No data labels', function (done) {
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
                                identity: [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [100, 200, 700],
                            }])
                        }
                    }]
                });
                setTimeout(function () {
                    var label = element.find('.donutChart .labels').find('text');
                    expect($(label[0]).length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            });
            it('Verify data labels - default style', function (done) {
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
                                identity: [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [100, 200, 700],
                            }])
                        }
                    }]
                });
                setTimeout(function () {
                    var labels = element.find('.donutChart .labels').find('text');
                    var fill = $(labels[0]).css('fill');
                    expect(ColorConvertor(fill)).toBe(ColorConvertor(color));
                    expect($(labels[0]).css('opacity')).toBe(opacity);
                    expect($(labels[0]).css('font-size')).toBe(fontSize);
                    done();
                }, DefaultWaitForRender);
            });
            it('Verify data labels - changing measure color', function (done) {
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
                                identity: [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [100, 200, 700],
                            }])
                        }
                    }]
                });
                setTimeout(function () {
                    var labels = element.find('.donutChart .labels').find('text');
                    var fill = $(labels[0]).css('fill');
                    expect(ColorConvertor(fill)).toBe(ColorConvertor(color.solid.color));
                    done();
                }, DefaultWaitForRender);
            });
            it('Verify data labels - changing category color', function (done) {
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
                                identity: [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [100, 200, 700],
                            }])
                        }
                    }]
                });
                setTimeout(function () {
                    var labels = element.find('.donutChart .labels').find('text');
                    var fill = $(labels[0]).css('fill');
                    expect(ColorConvertor(fill)).toBe(ColorConvertor(color.solid.color));
                    done();
                }, DefaultWaitForRender);
            });
            it('Long data labels', function (done) {
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
                                identity: [powerbitests.mocks.dataViewScopeIdentity('abcdefghijklmnopqrstuvwxyz'), powerbitests.mocks.dataViewScopeIdentity('01234567890123456789'), powerbitests.mocks.dataViewScopeIdentity('abcdefg'), powerbitests.mocks.dataViewScopeIdentity('d'), powerbitests.mocks.dataViewScopeIdentity('e')],
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
                setTimeout(function () {
                    var labels = element.find('.donutChart .labels').find('text');
                    expect($(labels[0]).text()).toContain("...");
                    expect($(labels[1]).text()).toContain("...");
                    expect($(labels[2]).text()).toBe("abcdefg");
                    expect($(labels[3]).text()).toBe("d");
                    expect($(labels[4]).text()).toBe("e");
                    done();
                }, DefaultWaitForRender);
            });
            it('Data lables with null', function (done) {
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
                                identity: [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabels.columns[1],
                                values: [100, 200, 700],
                            }])
                        }
                    }]
                });
                setTimeout(function () {
                    var labels = element.find('.donutChart .labels').find('text');
                    expect(labels.length).toBe(3);
                    done();
                }, DefaultWaitForRender);
            });
        });
        describe('converter', function () {
            var categoryIdentities = [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')];
            it('empty', function () {
                var dataView = {
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
                var actualData = DonutChart.converter(dataView, true, donutColors);
                var expectSlices = {
                    dataPointsToDeprecate: [],
                    dataPoints: [],
                    legendData: { title: "", dataPoints: [] },
                    hasHighlights: false,
                    dataLabelsSettings: powerbi.visuals.dataLabelUtils.getDefaultDonutLabelSettings(),
                    legendObjectProperties: undefined
                };
                expect(actualData).toEqual(expectSlices);
            });
            it('categorical, with slicing', function () {
                var dataView = {
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
                var actualData = DonutChart.converter(dataView, true, donutColors);
                var selectionIds = categoryIdentities.map(function (categoryId) { return SelectionId.createWithId(categoryId); });
                var categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(dataView.categorical.categories[0].identityFields);
                // Get a dummy color so the color scale for this key is shifted, so we don't accidentally get the right colors.
                var dummyColor = donutColors.getColorByScale(categoryColumnId, 'foo').value;
                var sliceColors = [
                    donutColors.getColorByScale(categoryColumnId, 'a').value,
                    donutColors.getColorByScale(categoryColumnId, 'b').value,
                    donutColors.getColorByScale(categoryColumnId, 'c').value,
                ];
                var expectSlices = [
                    {
                        identity: selectionIds[0],
                        measure: -300,
                        value: 0.3,
                        index: 0,
                        label: 'a',
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "-300" }],
                        color: sliceColors[0],
                    },
                    {
                        identity: selectionIds[1],
                        measure: 0,
                        value: 0.0,
                        index: 1,
                        label: 'b',
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "0" }],
                        color: sliceColors[1],
                    },
                    {
                        identity: selectionIds[2],
                        measure: 700,
                        value: 0.7,
                        index: 2,
                        label: 'c',
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "700" }],
                        color: sliceColors[2],
                    }
                ].map(buildDataPoint);
                expect(actualData.dataPoints.map(function (value) { return value.data; })).toEqual(expectSlices);
                // Legend
                expect(actualData.legendData.title).toBe('col1');
                expect(actualData.legendData.dataPoints[0].label).toBe('a');
            });
            it('categorical, no slicing', function () {
                var dataView = {
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
                var actualData = DonutChart.converter(dataView, false, donutColors);
                var selectionIds = categoryIdentities.map(function (categoryId) { return SelectionId.createWithId(categoryId); });
                var categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(dataView.categorical.categories[0].identityFields);
                // Get a dummy color so the color scale for this key is shifted, so we don't accidentally get the right colors.
                var dummyColor = donutColors.getColorByScale(categoryColumnId, 'foo').value;
                var sliceColors = [
                    donutColors.getColorByScale(categoryColumnId, 'a').value,
                    donutColors.getColorByScale(categoryColumnId, 'b').value,
                    donutColors.getColorByScale(categoryColumnId, 'c').value,
                ];
                var expectSlices = [
                    {
                        identity: selectionIds[0],
                        measure: -300,
                        value: 0.3,
                        index: 0,
                        label: 'a',
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "-300" }],
                        color: sliceColors[0],
                    },
                    {
                        identity: selectionIds[1],
                        measure: 0,
                        value: 0.0,
                        index: 1,
                        label: 'b',
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "0" }],
                        color: sliceColors[1]
                    },
                    {
                        identity: selectionIds[2],
                        measure: 700,
                        value: 0.7,
                        index: 2,
                        label: 'c',
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "700" }],
                        color: sliceColors[2],
                    }
                ].map(buildDataPoint);
                expect(actualData.dataPoints.map(function (value) { return value.data; })).toEqual(expectSlices);
                // Legend
                expect(actualData.legendData.title).toBe('col1');
                expect(actualData.legendData.dataPoints[0].label).toBe('a');
            });
            it('category and series, with slicing', function () {
                var dataView = {
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
                            identity: powerbitests.mocks.dataViewScopeIdentity('foo'),
                        }, {
                            source: dataViewMetadata1Category2Measure.columns[2],
                            values: [-300, 300, -50],
                            identity: powerbitests.mocks.dataViewScopeIdentity('bar'),
                        }])
                    },
                    metadata: dataViewMetadata1Category2Measure,
                };
                var actualData = DonutChart.converter(dataView, true, donutColors);
                var legendIds = categoryIdentities.map(function (categoryId) { return SelectionId.createWithId(categoryId); });
                var categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(dataView.categorical.categories[0].identityFields);
                // Get a dummy color so the color scale for this key is shifted, so we don't accidentally get the right colors.
                var dummyColor = donutColors.getColorByScale(categoryColumnId, 'foo').value;
                var sliceColors = [
                    donutColors.getColorByScale(categoryColumnId, 'a').value,
                    donutColors.getColorByScale(categoryColumnId, 'b').value,
                    donutColors.getColorByScale(categoryColumnId, 'c').value,
                ];
                var expectSlices = [
                    {
                        identity: SelectionId.createWithIds(categoryIdentities[0], dataView.categorical.values[0].identity),
                        measure: -200,
                        value: 0.2,
                        index: 0,
                        label: 'a',
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "-200" }],
                        color: sliceColors[0],
                    },
                    {
                        identity: SelectionId.createWithIds(categoryIdentities[0], dataView.categorical.values[1].identity),
                        measure: -300,
                        value: 0.3,
                        index: 0,
                        label: 'a',
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "-300" }],
                        color: sliceColors[0],
                    },
                    {
                        identity: SelectionId.createWithIds(categoryIdentities[1], dataView.categorical.values[0].identity),
                        measure: 0,
                        value: 0.0,
                        index: 1,
                        label: 'b',
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "0" }],
                        color: sliceColors[1],
                    },
                    {
                        identity: SelectionId.createWithIds(categoryIdentities[1], dataView.categorical.values[1].identity),
                        measure: 300,
                        value: 0.3,
                        index: 1,
                        label: 'b',
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "300" }],
                        color: sliceColors[1],
                    },
                    {
                        identity: SelectionId.createWithIds(categoryIdentities[2], dataView.categorical.values[0].identity),
                        measure: 150,
                        value: 0.15,
                        index: 2,
                        label: 'c',
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "150" }],
                        color: sliceColors[2],
                    },
                    {
                        identity: SelectionId.createWithIds(categoryIdentities[2], dataView.categorical.values[1].identity),
                        measure: -50,
                        value: 0.05,
                        index: 2,
                        label: 'c',
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "-50" }],
                        color: sliceColors[2],
                    }
                ].map(buildDataPoint);
                expect(actualData.dataPoints.map(function (value) { return value.data; })).toEqual(expectSlices);
                // Legend
                expect(actualData.legendData.title).toBe('');
                expect(actualData.legendData.dataPoints.length).toBe(3);
                expect(actualData.legendData.dataPoints[0].label).toBe('a');
                expect(actualData.legendData.dataPoints[1].label).toBe('b');
                expect(actualData.legendData.dataPoints[2].label).toBe('c');
            });
            it('categorical, no slicing, formatted color', function () {
                var hexGreen = "#00FF00";
                var dataView = {
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
                var actualData = DonutChart.converter(dataView, false, donutColors);
                var selectionIds = categoryIdentities.map(function (categoryId) { return SelectionId.createWithId(categoryId); });
                var categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(dataView.categorical.categories[0].identityFields);
                // Get a dummy color so the color scale for this key is shifted, so we don't accidentally get the right colors.
                var dummyColor = donutColors.getColorByScale(categoryColumnId, 'foo').value;
                var sliceColors = [
                    donutColors.getColorByScale(categoryColumnId, 'a').value,
                    hexGreen,
                    donutColors.getColorByScale(categoryColumnId, 'c').value,
                ];
                var expectSlices = [
                    {
                        identity: selectionIds[0],
                        measure: -300,
                        value: 0.3,
                        index: 0,
                        label: 'a',
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "-300" }],
                        color: sliceColors[0],
                    },
                    {
                        identity: selectionIds[1],
                        measure: 0,
                        value: 0.0,
                        index: 1,
                        label: 'b',
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "0" }],
                        color: sliceColors[1],
                    },
                    {
                        identity: selectionIds[2],
                        measure: 700,
                        value: 0.7,
                        index: 2,
                        label: 'c',
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "700" }],
                        color: sliceColors[2],
                    }
                ].map(buildDataPoint);
                expect(actualData.dataPoints.map(function (value) { return value.data; })).toEqual(expectSlices);
                // Legend
                expect(actualData.legendData.title).toBe('col1');
                expect(actualData.legendData.dataPoints[0].label).toBe('a');
            });
            it('categorical multi-measure, no slicing', function () {
                var dataView = {
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2MeasureWithFormat.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: categoryIdentities,
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata1Category2MeasureWithFormat.columns[1],
                                values: [-200, null, 150]
                            },
                            {
                                source: dataViewMetadata1Category2MeasureWithFormat.columns[2],
                                values: [-300, 300, -50]
                            }
                        ])
                    },
                    metadata: dataViewMetadata1Category2MeasureWithFormat,
                };
                var actualData = DonutChart.converter(dataView, false, donutColors);
                var selectionIds = categoryIdentities.map(function (categoryId) { return SelectionId.createWithId(categoryId); });
                var categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(dataView.categorical.categories[0].identityFields);
                // Get a dummy color so the color scale for this key is shifted, so we don't accidentally get the right colors.
                var dummyColor = donutColors.getColorByScale(categoryColumnId, 'foo').value;
                var sliceColors = [
                    donutColors.getColorByScale(categoryColumnId, 'a').value,
                    donutColors.getColorByScale(categoryColumnId, 'b').value,
                    donutColors.getColorByScale(categoryColumnId, 'c').value,
                ];
                var expectSlices = [
                    {
                        identity: selectionIds[0],
                        measure: -500,
                        measureFormat: "\$#,0;(\$#,0);\$#,0",
                        label: 'a',
                        value: 0.5,
                        index: 0,
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "($500)" }],
                        color: sliceColors[0],
                    },
                    {
                        identity: selectionIds[1],
                        label: 'b',
                        measure: 300,
                        measureFormat: "\$#,0;(\$#,0);\$#,0",
                        value: 0.3,
                        index: 1,
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "$300" }],
                        color: sliceColors[1],
                    },
                    {
                        identity: selectionIds[2],
                        measure: 100,
                        measureFormat: "\$#,0;(\$#,0);\$#,0",
                        label: 'c',
                        value: 0.2,
                        index: 2,
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "$100" }],
                        color: sliceColors[2],
                    }
                ].map(buildDataPoint);
                expect(actualData.dataPoints.map(function (value) { return value.data; })).toEqual(expectSlices);
                // Legend
                expect(actualData.legendData.title).toBe('col1');
                expect(actualData.legendData.dataPoints[0].label).toBe('a');
            });
            it('categorical multi-measure, with slicing', function () {
                var dataView = {
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
                var actualData = DonutChart.converter(dataView, true, donutColors);
                var categorySelectionIds = categoryIdentities.map(function (id) { return SelectionId.createWithId(id); });
                var categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(dataView.categorical.categories[0].identityFields);
                // Get a dummy color so the color scale for this key is shifted, so we don't accidentally get the right colors.
                var dummyColor = donutColors.getColorByScale(categoryColumnId, 'foo').value;
                var sliceColors = [
                    donutColors.getColorByScale(categoryColumnId, 'a').value,
                    donutColors.getColorByScale(categoryColumnId, 'b').value,
                    donutColors.getColorByScale(categoryColumnId, 'c').value,
                ];
                var expectSlices = [
                    {
                        identity: SelectionId.createWithIdAndMeasure(categoryIdentities[0], 'col2'),
                        measure: -200,
                        label: 'a',
                        value: 0.2,
                        index: 0,
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "-200" }],
                        color: sliceColors[0],
                    },
                    {
                        identity: SelectionId.createWithIdAndMeasure(categoryIdentities[0], 'col3'),
                        measure: -300,
                        label: 'a',
                        value: 0.3,
                        index: 0,
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "-300" }],
                        color: sliceColors[0],
                    },
                    {
                        identity: SelectionId.createWithIdAndMeasure(categoryIdentities[1], 'col2'),
                        measure: 0,
                        label: 'b',
                        value: 0,
                        index: 1,
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "0" }],
                        color: sliceColors[1],
                    },
                    {
                        identity: SelectionId.createWithIdAndMeasure(categoryIdentities[1], 'col3'),
                        measure: 300,
                        label: 'b',
                        value: 0.3,
                        index: 1,
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "300" }],
                        color: sliceColors[1],
                    },
                    {
                        identity: SelectionId.createWithIdAndMeasure(categoryIdentities[2], 'col2'),
                        label: 'c',
                        measure: 150,
                        value: 0.15,
                        index: 2,
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "150" }],
                        color: sliceColors[2],
                    },
                    {
                        identity: SelectionId.createWithIdAndMeasure(categoryIdentities[2], 'col3'),
                        label: 'c',
                        measure: -50,
                        value: 0.05,
                        index: 2,
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "-50" }],
                        color: sliceColors[2],
                    }
                ].map(buildDataPoint);
                expect(actualData.dataPoints.map(function (value) { return value.data; })).toEqual(expectSlices);
                // Legend
                expect(actualData.legendData.title).toBe('');
                expect(actualData.legendData.dataPoints.length).toBe(3);
                expect(actualData.legendData.dataPoints[0].label).toBe('a');
                expect(actualData.legendData.dataPoints[1].label).toBe('b');
                expect(actualData.legendData.dataPoints[2].label).toBe('c');
            });
            it('non-categorical multi-measure, with slicing', function () {
                var dataView = {
                    categorical: {
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata3Measure.columns[0],
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
                var actualData = DonutChart.converter(dataView, true, donutColors);
                var selectionIds = dataViewMetadata3Measure.columns.map(function (c) { return SelectionId.createWithMeasure(c.name); });
                var sliceColors = [
                    donutColors.getColor(0).value,
                    donutColors.getColor(1).value,
                    donutColors.getColor(2).value,
                ];
                var expectSlices = [
                    {
                        identity: selectionIds[0],
                        label: 'col1',
                        measure: 200,
                        value: 0.2,
                        index: 0,
                        tooltipInfo: [{ displayName: "col1", value: "200" }],
                        color: sliceColors[0],
                    },
                    {
                        identity: selectionIds[1],
                        label: 'col2',
                        measure: -300,
                        value: 0.3,
                        index: 1,
                        tooltipInfo: [{ displayName: "col2", value: "-300" }],
                        color: sliceColors[1],
                    },
                    {
                        identity: selectionIds[2],
                        label: 'col3',
                        measure: 500,
                        value: 0.5,
                        index: 2,
                        tooltipInfo: [{ displayName: "col3", value: "500" }],
                        color: sliceColors[2],
                    }
                ].map(buildDataPoint);
                expect(actualData.dataPoints.map(function (value) { return value.data; })).toEqual(expectSlices);
                // Legend
                expect(actualData.legendData.title).toBe('');
                expect(actualData.legendData.dataPoints[0].label).toBe('col1');
            });
            it('non-categorical single-measure, with slicing', function () {
                var dataView = {
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
                var actualData = DonutChart.converter(dataView, true, donutColors);
                var selectionIds = dataViewMetadata3Measure.columns.map(function (c) { return SelectionId.createWithMeasure(c.name); });
                var sliceColors = [donutColors.getColor(0).value];
                var expectSlices = [
                    {
                        identity: selectionIds[0],
                        label: 'col1',
                        measure: 200,
                        value: 1.0,
                        index: 0,
                        tooltipInfo: [{ displayName: "col1", value: "200" }],
                        color: sliceColors[0],
                    }
                ].map(buildDataPoint);
                expect(actualData.dataPoints.map(function (value) { return value.data; })).toEqual(expectSlices);
                // Legend
                expect(actualData.legendData.title).toBe('');
                expect(actualData.legendData.dataPoints[0].label).toBe('col1');
            });
            it('non-categorical series', function () {
                var dataView = {
                    categorical: {
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata3Measure.columns[0],
                                values: [200],
                                identity: powerbitests.mocks.dataViewScopeIdentity('col1'),
                            },
                            {
                                source: dataViewMetadata3Measure.columns[1],
                                values: [300],
                                identity: powerbitests.mocks.dataViewScopeIdentity('col2'),
                            }
                        ], [categoryColumnRef])
                    },
                    metadata: dataViewMetadata,
                };
                dataView.categorical.values.source = dataViewMetadata[1];
                var actualData = DonutChart.converter(dataView, true, donutColors);
                var selectionIds = dataView.categorical.values.map(function (c) { return SelectionId.createWithId(c.identity); });
                var columnRefId = powerbi.data.SQExprShortSerializer.serializeArray([categoryColumnRef]);
                var sliceColors = [
                    donutColors.getColorByScale(columnRefId, 'col1').value,
                    donutColors.getColorByScale(columnRefId, 'col2').value,
                ];
                var expectSlices = [
                    {
                        identity: selectionIds[0],
                        label: 'col1',
                        measure: 200,
                        value: 0.4,
                        index: 0,
                        tooltipInfo: [{ displayName: "col1", value: "200" }],
                        color: sliceColors[0],
                    },
                    {
                        identity: selectionIds[1],
                        label: 'col2',
                        measure: 300,
                        value: 0.6,
                        index: 1,
                        tooltipInfo: [{ displayName: "col2", value: "300" }],
                        color: sliceColors[1],
                    }
                ].map(buildDataPoint);
                expect(actualData.dataPoints.map(function (value) { return value.data; })).toEqual(expectSlices);
                // Legend
                expect(actualData.legendData.title).toBe('');
                expect(actualData.legendData.dataPoints[0].label).toBe('col1');
                expect(actualData.legendData.dataPoints[1].label).toBe('col2');
            });
            it('with highlights', function () {
                // categorical, no slicing
                var dataView = {
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
                                highlights: [-100, null, 10],
                            },
                            {
                                source: dataViewMetadata1Category2MeasureWithFormat.columns[2],
                                values: [-300, 300, -50],
                                highlights: [-150, 75, 50],
                            }
                        ]),
                    },
                    metadata: null,
                };
                var actualData = DonutChart.converter(dataView, false, donutColors);
                var selectionIds = categoryIdentities.map(function (categoryId) { return SelectionId.createWithId(categoryId); });
                var categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(dataView.categorical.categories[0].identityFields);
                // Get a dummy color so the color scale for this key is shifted, so we don't accidentally get the right colors.
                var dummyColor = donutColors.getColorByScale(categoryColumnId, 'foo').value;
                var sliceColors = [
                    donutColors.getColorByScale(categoryColumnId, 'a').value,
                    donutColors.getColorByScale(categoryColumnId, 'b').value,
                    donutColors.getColorByScale(categoryColumnId, 'c').value,
                ];
                var expectSlices = [
                    {
                        identity: selectionIds[0],
                        measure: -500,
                        measureFormat: "\$#,0;(\$#,0);\$#,0",
                        label: 'a',
                        value: 0.5,
                        highlightRatio: 0.5,
                        index: 0,
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "($500)" }, { displayName: powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName, value: "($250)" }],
                        color: sliceColors[0],
                    },
                    {
                        identity: selectionIds[1],
                        label: 'b',
                        measure: 300,
                        measureFormat: "\$#,0;(\$#,0);\$#,0",
                        value: 0.3,
                        highlightRatio: 0.25,
                        index: 1,
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "$300" }, { displayName: powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName, value: "$75" }],
                        color: sliceColors[1],
                    },
                    {
                        identity: selectionIds[2],
                        measure: 100,
                        measureFormat: "\$#,0;(\$#,0);\$#,0",
                        label: 'c',
                        value: 0.2,
                        highlightRatio: 0.3,
                        index: 2,
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "$100" }, { displayName: powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName, value: "$30" }],
                        color: sliceColors[2],
                    }
                ].map(buildDataPoint);
                expect(actualData.dataPoints.map(function (value) { return value.data; })).toEqual(expectSlices);
            });
            //valide tooltip on highlighted values, the first tooptip is regular because highlighted value is 0, another tooltips are highlighted tooltips 
            it('with highlights - tooltip validation', function () {
                // categorical, no slicing
                var dataView = {
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
                            },
                            {
                                source: dataViewMetadata1Category2MeasureWithFormat.columns[2],
                                values: [-300, 300, -50],
                                highlights: [0, 75, 50],
                            }
                        ]),
                    },
                    metadata: null,
                };
                var actualData = DonutChart.converter(dataView, false, donutColors);
                //regular tooltip
                expect(actualData.dataPoints[0].data.tooltipInfo).toEqual([{ displayName: "col1", value: "a" }, { displayName: "col2", value: "($500)" }]);
                //tooltips with highlighted values
                expect(actualData.dataPoints[1].data.tooltipInfo).toEqual([{ displayName: "col1", value: "b" }, { displayName: "col2", value: "$300" }, { displayName: powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName, value: "$75" }]);
                expect(actualData.dataPoints[2].data.tooltipInfo).toEqual([{ displayName: "col1", value: "c" }, { displayName: "col2", value: "$100" }, { displayName: powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName, value: "$30" }]);
            });
            it('with highlights that overflow', function () {
                // categorical, no slicing
                var dataView = {
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
                                highlights: [-100, null, 250],
                            },
                            {
                                source: dataViewMetadata1Category2MeasureWithFormat.columns[2],
                                values: [-300, 300, -50],
                                highlights: [-150, 75, 50],
                            }
                        ]),
                    },
                    metadata: null,
                };
                var actualData = DonutChart.converter(dataView, false, donutColors);
                var selectionIds = categoryIdentities.map(function (categoryId) { return SelectionId.createWithId(categoryId); });
                var categoryColumnId = powerbi.data.SQExprShortSerializer.serializeArray(dataView.categorical.categories[0].identityFields);
                // Get a dummy color so the color scale for this key is shifted, so we don't accidentally get the right colors.
                var dummyColor = donutColors.getColorByScale(categoryColumnId, 'foo').value;
                var sliceColors = [
                    donutColors.getColorByScale(categoryColumnId, 'a').value,
                    donutColors.getColorByScale(categoryColumnId, 'b').value,
                    donutColors.getColorByScale(categoryColumnId, 'c').value,
                ];
                var expectSlices = [
                    {
                        identity: selectionIds[0],
                        measure: -250,
                        measureFormat: "\$#,0;(\$#,0);\$#,0",
                        label: 'a',
                        value: 0.4,
                        highlightRatio: 1.0,
                        index: 0,
                        tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "($250)" }, { displayName: powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName, value: "($250)" }],
                        color: sliceColors[0],
                    },
                    {
                        identity: selectionIds[1],
                        label: 'b',
                        measure: 75,
                        measureFormat: "\$#,0;(\$#,0);\$#,0",
                        value: 0.12,
                        highlightRatio: 1.0,
                        index: 1,
                        tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "$75" }, { displayName: powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName, value: "$75" }],
                        color: sliceColors[1],
                    },
                    {
                        identity: selectionIds[2],
                        measure: 300,
                        measureFormat: "\$#,0;(\$#,0);\$#,0",
                        label: 'c',
                        value: 0.48,
                        highlightRatio: 1.0,
                        index: 2,
                        tooltipInfo: [{ displayName: "col1", value: "c" }, { displayName: "col2", value: "$300" }, { displayName: powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName, value: "$300" }],
                        color: sliceColors[2],
                    }
                ].map(buildDataPoint);
                expect(actualData.dataPoints.map(function (value) { return value.data; })).toEqual(expectSlices);
            });
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
            var actualData = DonutChart.converter(dataView, false, donutColors);
            expect(actualData.dataPoints[0].data.tooltipInfo).toEqual([{ displayName: 'a', value: '1' }]);
            expect(actualData.dataPoints[1].data.tooltipInfo).toEqual([{ displayName: 'b', value: '2' }]);
            expect(actualData.dataPoints[2].data.tooltipInfo).toEqual([{ displayName: 'c', value: '3' }]);
        });
        function buildDataPoint(data) {
            return {
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
    function pieChartDomValidation(interactiveChart, hasLegendObject) {
        var v, element;
        var hostServices = powerbitests.mocks.createVisualHostServices();
        var dataViewMetadataTwoColumn = {
            columns: [
                {
                    name: 'col1',
                    type: DataShapeUtility.describeDataType(2048 /* String */)
                },
                {
                    name: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(1 /* Number */)
                }
            ],
        };
        if (hasLegendObject) {
            dataViewMetadataTwoColumn.objects = { legend: { show: true } };
        }
        else {
            dataViewMetadataTwoColumn.objects = undefined;
        }
        var dataViewMetadata1Category2Measure = {
            columns: [
                { name: 'col1' },
                { name: 'col2', isMeasure: true },
                { name: 'col3', isMeasure: true }
            ]
        };
        if (hasLegendObject) {
            dataViewMetadata1Category2Measure.objects = { legend: { show: true } };
        }
        else {
            dataViewMetadata1Category2Measure.objects = undefined;
        }
        var categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'p' });
        beforeEach(function () {
            powerbi.common.localize = powerbi.common.createLocalizationService();
            powerbitests.mocks.setLocale(powerbi.common.localize);
            element = powerbitests.helpers.testDom('500', '500');
            if (interactiveChart)
                v = powerbi.visuals.visualPluginFactory.create().getPlugin('pieChart').create();
            else
                v = powerbi.visuals.visualPluginFactory.createMinerva({
                    heatMap: false,
                    newTable: false,
                }).getPlugin('pieChart').create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { isInteractiveLegend: interactiveChart, selection: true },
                animation: { transitionImmediate: true }
            });
        });
        it('pie chart dom validation', function (done) {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                        }])
                    }
                }]
            });
            setTimeout(function () {
                expect($('.donutChart')).toBeInDOM();
                expect($('.donutChart .slice').length).toBe(3);
                done();
            }, DefaultWaitForRender);
        });
        it('pie chart dom validation with partial highlights', function (done) {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')],
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
            setTimeout(function () {
                expect($('.donutChart')).toBeInDOM();
                var dimmedOpacity = interactiveChart ? 0.6 : powerbi.visuals.ColumnUtil.DimmedOpacity;
                var slices = $('.donutChart .slice');
                expect(slices.length).toBe(3);
                slices.each(function (i, element) { return expect(parseFloat($(element).css('fill-opacity'))).toBeCloseTo(dimmedOpacity, 0); });
                var highlightSlices = $('.donutChart .slice-highlight');
                expect(highlightSlices.length).toBe(3);
                highlightSlices.each(function (i, element) { return expect(parseFloat($(element).css('fill-opacity'))).toBeCloseTo(powerbi.visuals.ColumnUtil.DefaultOpacity, 2); });
                done();
            }, DefaultWaitForRender);
        });
        it('pie chart should clear dom validation', function (done) {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                        }])
                    }
                }]
            });
            setTimeout(function () {
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
                setTimeout(function () {
                    expect($('.donutChart')).toBeInDOM();
                    expect($('.donutChart .slice').length).toBe(0);
                    if (interactiveChart)
                        expect($('.legend-item').length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });
        it('pie chart dom validation with slices', function (done) {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata1Category2Measure,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata1Category2Measure.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata1Category2Measure.columns[1],
                                values: [200, 100, 150]
                            },
                            {
                                source: dataViewMetadata1Category2Measure.columns[2],
                                values: [300, 200, 50]
                            }
                        ])
                    }
                }]
            });
            setTimeout(function () {
                expect($('.donutChart')).toBeInDOM();
                if (interactiveChart)
                    expect($('.donutChart .slice').length).toBe(3);
                else
                    expect($('.donutChart .slice').length).toBe(6);
                done();
            }, DefaultWaitForRender);
        });
        it('pie chart dom validation with normal slices', function (done) {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [300, 300, 400],
                        }])
                    }
                }]
            });
            setTimeout(function () {
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
        it('pie chart label dom validation with thin slices', function (done) {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [5, 5, 990],
                        }])
                    }
                }]
            });
            setTimeout(function () {
                expect($('.donutChart')).toBeInDOM();
                // lines are not present on interactive legend mode, and currently if regular legend is on we hide labels
                if (!interactiveChart && !hasLegendObject) {
                    expect($('.donutChart polyline').length).toBe(3);
                }
                done();
            }, DefaultWaitForRender * 2);
        });
        it('pie chart with duplicate labels dom validation', function (done) {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['abc', 'abc', 'abc'],
                            identity: [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [100, 200, 700],
                        }])
                    }
                }]
            });
            setTimeout(function () {
                expect($('.donutChart')).toBeInDOM();
                expect($('.donutChart .slice').length).toBe(3);
                if (!interactiveChart && !hasLegendObject) {
                    expect($('.donutChart polyline').length).toBe(3);
                    expect($('.donutChart .labels text').length).toBe(3);
                }
                done();
            }, DefaultWaitForRender);
        });
        it('pie chart dom validation with very long labels', function (done) {
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
                            identity: [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumnLabels.columns[1],
                            values: [300, 300, 400],
                        }])
                    }
                }]
            });
            setTimeout(function () {
                expect($('.donutChart')).toBeInDOM();
                var labels = $('.labels').find('text');
                for (var i = 0; i < labels.length; i++) {
                    var text = $(labels[i]).text().substr(-3);
                    expect(text).toEqual('...');
                }
                done();
            }, DefaultWaitForRender);
        });
        it('pie chart opacity validation with overlapping slices', function (done) {
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
                            identity: [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c'), powerbitests.mocks.dataViewScopeIdentity('d')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [1, 1, 5, 90],
                        }])
                    }
                }]
            });
            setTimeout(function () {
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
        it('pie chart radius calculation validation', function (done) {
            // spy on calculateRadius() method
            var pieChart = v;
            spyOn(pieChart, 'calculateRadius').and.callThrough();
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['abc', 'def', 'ghi', 'jkl'],
                            identity: [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c'), powerbitests.mocks.dataViewScopeIdentity('d')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [2, 3, 4, 90],
                        }])
                    }
                }]
            });
            setTimeout(function () {
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
        it('pie chart slice select', function (done) {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')],
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
            var pieChart = v;
            if (interactiveChart) {
                var interactivityState = pieChart.interactivityState;
                var pieLegend = interactivityState.interactiveLegend;
                spyOn(pieChart, 'setInteractiveChosenSlice').and.callThrough();
                spyOn(pieLegend, 'updateLegend').and.callThrough();
            }
            // Click the first slice
            sliceToClick.d3Click();
            setTimeout(function () {
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
                var svg = $('.donutChart');
                svg.d3Click();
                setTimeout(function () {
                    slices.each(function () {
                        expect(parseFloat($(this).css('fill-opacity'))).toBe(1);
                    });
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });
        it('pie chart selecting a slice triggers select', function () {
            if (interactiveChart) {
                // not applicable to interactive charts
                return;
            }
            var identities = [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')];
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
            $(slices[sliceToClick]).d3Click();
            expect(onSelectSpy).toHaveBeenCalled();
            expect(onSelectSpy.calls.argsFor(0)[0].data[0]).toEqual({ data: [identities[sliceToClick]] });
        });
        it('pie chart highlighted slice select', function (done) {
            if (interactiveChart) {
                // not applicable to interactive charts
                done();
                return;
            }
            var identities = [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')];
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
            sliceToClick.d3Click();
            setTimeout(function () {
                expect($('.donutChart .slice').length).toBe(3);
                expect(parseFloat(sliceToClick.css('fill-opacity'))).toBe(1);
                otherSlices.each(function () {
                    expect(parseFloat($(this).css('fill-opacity'))).toBeLessThan(1);
                });
                done();
            }, DefaultWaitForRender);
        });
        it('pie chart selecting a highlighted slice triggers select', function () {
            if (interactiveChart) {
                // not applicable to interactive charts
                return;
            }
            var identities = [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')];
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
            $(slices[sliceToClick]).d3Click();
            expect(onSelectSpy).toHaveBeenCalled();
            expect(onSelectSpy.calls.argsFor(0)[0].data[0]).toEqual({ data: [identities[sliceToClick]] });
        });
        it('pie chart slice multi-select', function (done) {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')],
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
            var pieChart = v;
            if (interactiveChart) {
                var interactivityState = pieChart.interactivityState;
                var pieLegend = interactivityState.interactiveLegend;
                spyOn(pieChart, 'setInteractiveChosenSlice').and.callThrough();
                spyOn(pieLegend, 'updateLegend').and.callThrough();
            }
            // Click the first slice, then the second with ctrl key
            slicesToClick.eq(0).d3Click();
            slicesToClick.eq(1).d3Click(0, 0, 1 /* CtrlKey */);
            setTimeout(function () {
                expect($('.donutChart .slice').length).toBe(3);
                if (interactiveChart) {
                    slicesToClickIndex.forEach(function (i) {
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
                var svg = $('.donutChart');
                svg.d3Click();
                setTimeout(function () {
                    slices.each(function () {
                        expect(parseFloat($(this).css('fill-opacity'))).toBe(1);
                    });
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });
        it('pie chart legend interactivity', function () {
            if (!interactiveChart) {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataTwoColumn,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataTwoColumn.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')],
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
                    icons.first().d3Click(0, 0);
                    setTimeout(function () {
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
            it('legend formatting', function (done) {
                var dataView = {
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')],
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
                setTimeout(function () {
                    expect($('.donutChart')).toBeInDOM();
                    expect($('.donutChart .slice').length).toBe(3);
                    if (hasLegendObject) {
                        expect($('.legend').attr('orientation')).toBe(0 /* Top */.toString());
                    }
                    //change legend position
                    dataView.metadata.objects = { legend: { show: true, position: 'Right' } };
                    v.onDataChanged({
                        dataViews: [dataView]
                    });
                    setTimeout(function () {
                        expect($('.donutChart')).toBeInDOM();
                        expect($('.donutChart .slice').length).toBe(3);
                        if (hasLegendObject) {
                            expect($('.legend').attr('orientation')).toBe(2 /* Right */.toString());
                        }
                        //set title
                        var testTitle = 'Test Title';
                        dataView.metadata.objects = { legend: { show: true, position: 'Right', showTitle: true, titleText: testTitle } };
                        v.onDataChanged({
                            dataViews: [dataView]
                        });
                        setTimeout(function () {
                            expect($('.donutChart')).toBeInDOM();
                            if (hasLegendObject) {
                                expect($('.legend').attr('orientation')).toBe(2 /* Right */.toString());
                                expect($('.legendTitle').text()).toBe(testTitle);
                            }
                            //hide legend
                            dataView.metadata.objects = { legend: { show: false, position: 'Right' } };
                            v.onDataChanged({
                                dataViews: [dataView]
                            });
                            setTimeout(function () {
                                expect($('.donutChart')).toBeInDOM();
                                if (hasLegendObject) {
                                    expect($('.legend').attr('orientation')).toBe(4 /* None */.toString());
                                }
                                done();
                            }, DefaultWaitForRender);
                        }, DefaultWaitForRender);
                    }, DefaultWaitForRender);
                }, DefaultWaitForRender);
            });
        }
    }
    describe("PieChart DOM validation", function () { return pieChartDomValidation(false, false); });
    describe("PieChart DOM validation - with legend", function () { return pieChartDomValidation(false, true); });
    describe("Interactive PieChart DOM validation", function () { return pieChartDomValidation(true, false); });
    describe("Pie Chart Interactivity", function () {
        var v, element;
        var hostServices = powerbitests.mocks.createVisualHostServices();
        var dataViewMetadataTwoColumn = {
            columns: [
                {
                    name: 'col1',
                    type: DataShapeUtility.describeDataType(2048 /* String */)
                },
                {
                    name: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(1 /* Number */)
                }
            ],
        };
        beforeEach(function () {
            powerbi.common.localize = powerbi.common.createLocalizationService();
            powerbitests.mocks.setLocale(powerbi.common.localize);
            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('pieChart').create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { isInteractiveLegend: true },
                animation: { transitionImmediate: true },
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
                            identity: [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')],
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
        it('legend structure', function (done) {
            setTimeout(function () {
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
        it('slice drag', function (done) {
            function setD3Event(x, y) {
                var event = document.createEvent('MouseEvents');
                event.sourceEvent = {
                    type: 'mouseEvent',
                    pageX: x,
                    pageY: y,
                    stopPropagation: function () {
                    },
                };
                d3.event = event;
            }
            var pieChart = v;
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
            expect(powerbi.visuals.SVGUtil.translateAndRotate.calls.first().args[4]).toBe(currentRotation + 180); // first call to rotate (mathches dragMove) should rotate the chart by 180 degrees
            expect(pieChart.setInteractiveChosenSlice).toHaveBeenCalledWith(2);
            done();
        });
        function swipeTest(swipeLeft, expectedSliceIndex, done) {
            var pieChart = v;
            var interactivityState = pieChart.interactivityState;
            var pieLegend = interactivityState.interactiveLegend;
            spyOn(pieChart, 'setInteractiveChosenSlice').and.callThrough();
            spyOn(pieLegend, 'updateLegend').and.callThrough();
            // drag on the legend
            pieLegend.dragLegend(swipeLeft);
            setTimeout(function () {
                expect(pieChart.setInteractiveChosenSlice).toHaveBeenCalledWith(expectedSliceIndex);
                expect(pieLegend.updateLegend).toHaveBeenCalledWith(expectedSliceIndex);
                expect($('.donutChart').length).toBe(1);
                expect($('.donutLegend').length).toBe(1);
                expect($('.legend-item').length).toBe(3);
                expect($('.donutChart .slice').length).toBe(3);
                done();
            }, DefaultWaitForRender);
        }
        it('legend items swipe right', function (done) { return swipeTest(false, 2, done); }); // swiping right - exepecting to get the last slice index
        it('legend items swipe left', function (done) { return swipeTest(true, 1, done); }); // swiping left - exepecting to get the second slice index
        function rotateValidation(swipeLeft, done) {
            var pieChart = v;
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
            setTimeout(function () {
                // items should be rotated
                var rotatedLegendItems = $('.legend-item');
                if (swipeLeft) {
                    expect(rotatedLegendItems.eq(0).attr('data-legend-index')).toBe('0');
                    expect(rotatedLegendItems.eq(1).attr('data-legend-index')).toBe('1');
                    expect(rotatedLegendItems.eq(2).attr('data-legend-index')).toBe('2');
                }
                else {
                    expect(rotatedLegendItems.eq(0).attr('data-legend-index')).toBe('1');
                    expect(rotatedLegendItems.eq(1).attr('data-legend-index')).toBe('2');
                    expect(rotatedLegendItems.eq(2).attr('data-legend-index')).toBe('0');
                }
                done();
            }, DefaultWaitForRender);
        }
        it('legend items are rotated correctly when swiping right', function (done) { return rotateValidation(false, done); });
        it('legend items are rotated correctly when swiping left', function (done) { return rotateValidation(true, done); });
    });
    describe("Enumerate Objects", function () {
        var v, element;
        var dataViewMetadataTwoColumn = {
            columns: [
                {
                    name: 'col1',
                    type: DataShapeUtility.describeDataType(2048 /* String */)
                },
                {
                    name: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(1 /* Number */)
                }
            ],
        };
        var categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'p' });
        beforeEach(function () {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
        });
        beforeEach(function () {
            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('donutChart').create();
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
        it('Check enumeration for categorical', function (done) {
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
                            identity: [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')],
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
        it('Check enumeration for category and series', function (done) {
            var dataViewMetadata1Category2Measure = {
                columns: [
                    { name: 'col1' },
                    { name: 'col2', isMeasure: true },
                    { name: 'col3', isMeasure: true }
                ]
            };
            var categoryIdentities = [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')];
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
                            identity: powerbitests.mocks.dataViewScopeIdentity('foo'),
                        }, {
                            source: dataViewMetadata1Category2Measure.columns[2],
                            values: [-300, 300, -50],
                            identity: powerbitests.mocks.dataViewScopeIdentity('bar'),
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
    });
    describe("Pie Chart Web Animation", function () {
        var v, element;
        var hostServices = powerbitests.mocks.createVisualHostServices();
        var dataViewMetadataTwoColumn = {
            columns: [
                {
                    name: 'col1',
                    type: DataShapeUtility.describeDataType(2048 /* String */)
                },
                {
                    name: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(1 /* Number */)
                }
            ],
        };
        var categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'p' });
        beforeEach(function () {
            powerbi.common.localize = powerbi.common.createLocalizationService();
            powerbitests.mocks.setLocale(powerbi.common.localize);
            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.visualPluginFactory.createMinerva({
                heatMap: false,
                newTable: false,
            }).getPlugin('pieChart').create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { selection: true },
                animation: { transitionImmediate: true }
            });
        });
        it('pie chart partial highlight animations', function (done) {
            var dataViewsNoHighlights = {
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c'],
                            identity: [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')],
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
                            identity: [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')],
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
                            identity: [powerbitests.mocks.dataViewScopeIdentity('a'), powerbitests.mocks.dataViewScopeIdentity('b'), powerbitests.mocks.dataViewScopeIdentity('c')],
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
            setTimeout(function () {
                var svgInit = $('.donutChart');
                var initialHeight = svgInit.attr('height'), initialWidth = svgInit.attr('width');
                var animator = v.animator;
                spyOn(animator, 'animate').and.callThrough();
                v.onDataChanged(dataViewsHighlightsA);
                v.onDataChanged(dataViewsHighlightsB);
                v.onDataChanged(dataViewsNoHighlights);
                expect(animator).toBeTruthy();
                expect(animator.animate).toHaveBeenCalled();
                setTimeout(function () {
                    var svg = $('.donutChart');
                    expect(svg).toBeInDOM();
                    expect(svg.attr('height')).toBe(initialHeight);
                    expect(svg.attr('width')).toBe(initialWidth);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });
    });
})(powerbitests || (powerbitests = {}));
