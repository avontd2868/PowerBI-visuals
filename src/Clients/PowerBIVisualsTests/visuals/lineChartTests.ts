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
    import AxisType = powerbi.axisType;
    import ColorUtility = powerbitests.utils.ColorUtility;
    import CompiledDataViewMapping = powerbi.data.CompiledDataViewMapping;
    import DataShapeUtility = powerbi.data.dsr.DataShapeUtility;
    import DataViewObjects = powerbi.DataViewObjects;
    import DataViewPivotCategorical = powerbi.data.DataViewPivotCategorical;
    import DataViewTransform = powerbi.data.DataViewTransform;
    import LineChart = powerbi.visuals.LineChart;
    import PrimitiveType = powerbi.PrimitiveType;
    import SVGUtil = powerbi.visuals.SVGUtil;
    import SelectionId = powerbi.visuals.SelectionId;
    import SemanticType = powerbi.data.SemanticType;
    import ValueType = powerbi.ValueType;

    var DefaultWaitForRender = 10;

    describe("LineChart Dataview Validation", () => {
        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
        });

        var blankCategoryValue = '(Blank)';
        var dataViewMetadata: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    queryName: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.String),
                },
                {
                    displayName: 'col2',
                    queryName: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                },
                {
                    displayName: 'col3',
                    queryName: 'col3',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                },
                {
                    displayName: 'col4',
                    queryName: 'col4',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                },
            ]
        };
        var categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'col1' });

        var hostServices = powerbitests.mocks.createVisualHostServices();
        var colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

        it('LineChart registered capabilities', () => {
            expect(powerbi.visuals.visualPluginFactory.create().getPlugin('lineChart').capabilities).toBe(powerbi.visuals.lineChartCapabilities);
        });

        it('LineChart registered customizeQuery', () => {
            expect(powerbi.visuals.visualPluginFactory.create().getPlugin('lineChart').customizeQuery).toBe(LineChart.customizeQuery);
        });

        it('Capabilities should include dataViewMappings', () => {
            expect(powerbi.visuals.lineChartCapabilities.dataViewMappings).toBeDefined();
        });

        it('Capabilities should include dataRoles', () => {
            expect(powerbi.visuals.lineChartCapabilities.dataRoles).toBeDefined();
        });

        it('Capabilities should not suppressDefaultTitle', () => {
            expect(powerbi.visuals.lineChartCapabilities.suppressDefaultTitle).toBeUndefined();
        });

        it('FormatString property should match calculated',() => {
            expect(powerbi.data.DataViewObjectDescriptors.findFormatString(powerbi.visuals.lineChartCapabilities.objects)).toEqual(powerbi.visuals.lineChartProps.general.formatString);
        });

        it('CustomizeQuery picks sample based on data type',() => {
            var objects: DataViewObjects = {
                categoryAxis: {}
            };
            var dataViewMapping = createCompiledDataViewMapping(ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.DateTime), objects);

            LineChart.customizeQuery({
                dataViewMappings: [dataViewMapping]
            });

            expect(dataViewMapping.categorical.categories.dataReductionAlgorithm).toEqual({ sample: {} });
        });

        it('CustomizeQuery picks top based on data type', () => {
            var objects: DataViewObjects = {
                categoryAxis: {}
            };
            var dataViewMapping = createCompiledDataViewMapping(ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text), objects);

            LineChart.customizeQuery({
                dataViewMappings: [dataViewMapping]
            });

            expect(dataViewMapping.categorical.categories.dataReductionAlgorithm).toEqual({ top: {} });
        });

        it('CustomizeQuery no category', () => {
            var objects: DataViewObjects = {
                categoryAxis: {}
            };
            var dataViewMapping = createCompiledDataViewMapping(null, objects);

            LineChart.customizeQuery({
                dataViewMappings: [dataViewMapping]
            });

            expect(dataViewMapping.categorical.categories.dataReductionAlgorithm).toEqual({ top: {} });
        });

        it('CustomizeQuery explicit scalar axis on non-scalar type', () => {
            var objects: DataViewObjects = {
                categoryAxis: {
                    axisType: 'Scalar'
                }
            };
            var dataViewMapping = createCompiledDataViewMapping(ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text), objects);

            LineChart.customizeQuery({
                dataViewMappings: [dataViewMapping]
            });

            expect(dataViewMapping.categorical.categories.dataReductionAlgorithm).toEqual({ top: {} });
        });

        it('CustomizeQuery explicit categorical axis on scalar type', () => {
            var objects: DataViewObjects = {
                categoryAxis: {
                    axisType: 'Scalar'
                }
            };
            var dataViewMapping = createCompiledDataViewMapping(ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text), objects);

            LineChart.customizeQuery({
                dataViewMappings: [dataViewMapping]
            });

            expect(dataViewMapping.categorical.categories.dataReductionAlgorithm).toEqual({ top: {} });
        });

        it('Sortable roles with scalar axis',() => {
            var objects: DataViewObjects = {
                categoryAxis: {
                    axisType: 'Scalar',
                }
            };
            var dataViewMapping = createCompiledDataViewMapping(ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.DateTime), objects);

            expect(LineChart.getSortableRoles({
                dataViewMappings: [dataViewMapping]
            })).toBeNull();
        });

        it('Sortable roles with categorical axis',() => {
            var objects: DataViewObjects = {
                categoryAxis: {
                    axisType: 'Categorical',
                }
            };
            var dataViewMapping = createCompiledDataViewMapping(ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.DateTime), objects);

            expect(LineChart.getSortableRoles({
                dataViewMappings: [dataViewMapping]
            })).toEqual([ 'Category' ]);
        });

        function createCompiledDataViewMapping(categoryType: ValueType, objects?: DataViewObjects): CompiledDataViewMapping {
            var categoryItems: powerbi.data.CompiledDataViewRoleItem[] = [];
            if (categoryType)
                categoryItems.push({ type: categoryType });

            return {
                metadata: {
                    objects: objects
                },
                categorical: {
                    categories: {
                        for: {
                            in: { role: 'Category', items: categoryItems }
                        },
                        dataReductionAlgorithm: { top: {} }
                    },
                    values: {
                        group: {
                            by: { role: 'Series', items: [{ type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text) }] },
                            select: [
                                { for: { in: { role: 'Y', items: [{ type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Integer) }] } } }
                            ],
                            dataReductionAlgorithm: { top: {} }
                        }
                    }
                }
            };
        }

        it('Check convert empty + fill color', () => {
            var metadata: powerbi.DataViewMetadata = {
                columns: [
                    dataViewMetadata.columns[0],
                    powerbi.Prototype.inherit(dataViewMetadata.columns[1], c => c.objects = { dataPoint: { fill: { solid: { color: '#41BEE0' } } } }),
                ]
            };
            var dataView: powerbi.DataView = {
                metadata: metadata,
                categorical: {
                    categories: [{
                        source: metadata.columns[0],
                        values: [],
                        objects: [{ dataPoint: { fill: { solid: { color: '#41BEE0' } } } }]
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: metadata.columns[1],
                        values: [],
                        subtotal: 0
                    }])
                }
            };
            var selectionId = SelectionId.createWithMeasure('col2');
            var key = selectionId.getKey();
            var actualData = LineChart.converter(dataView, blankCategoryValue, colors, false);
            expect(actualData.series).toEqual([{
                    key: key,
                    lineIndex: 0,
                    color: '#41BEE0',
                    xCol: dataView.metadata.columns[0],
                    yCol: dataView.metadata.columns[1],
                    data: [],
                    selected: false,
                    identity: SelectionId.createWithMeasure('col2'),
                }]);
            });

        it('Check convert categorical + fill color',() => {
            var seriesColor = '#41BEE0';
            var metadata: powerbi.DataViewMetadata = {
                columns: [
                    dataViewMetadata.columns[0],
                    powerbi.Prototype.inherit(dataViewMetadata.columns[1], c => c.objects = { dataPoint: { fill: { solid: { color: seriesColor } } } }),
                ]
            };
            var dataView: powerbi.DataView = {
                metadata: metadata,
                categorical: {
                    categories: [{
                        source: metadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau'],
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: metadata.columns[1],
                        values: [100, 200, 700],
                        subtotal: 1000
                    }])
                }
            };
            var selectionId = SelectionId.createWithMeasure('col2');
            var key = selectionId.getKey();

            var actualData = LineChart.converter(dataView, blankCategoryValue, colors, false).series;
            var expectedData: powerbi.visuals.LineChartSeries[] =
                [{
                    key: key,
                    lineIndex: 0,
                    color: seriesColor,
                    xCol: dataView.metadata.columns[0],
                    yCol: dataView.metadata.columns[1],
                    data: [
                        {
                            categoryValue: 'John Domo',
                            value: 100,
                            categoryIndex: 0,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col2", value: "100" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 0 }),
                            labelFill: seriesColor,
                        },
                        {
                            categoryValue: 'Delta Force',
                            value: 200,
                            categoryIndex: 1,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col2", value: "200" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 1 }),
                            labelFill: seriesColor,
                        },
                        {
                            categoryValue: 'Jean Tablau',
                            value: 700,
                            categoryIndex: 2,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col2", value: "700" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 2 }),
                            labelFill: seriesColor,
                        },
                    ],
                    identity: SelectionId.createWithMeasure('col2'),
                    selected: false,
                }];

            expect(actualData).toEqual(expectedData);
        });

        it('Check convert categorical + default color', () => {
            var dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau']                        
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100, 200, 700],
                        subtotal: 1000
                    }])
                }
            };
            var selectionId = SelectionId.createWithMeasure('col2');
            var key = selectionId.getKey();
            var hexDefaultColorRed = "#FF0000";
            dataView.metadata.objects = {
                dataPoint: { defaultColor: { solid: { color: hexDefaultColorRed } } }
            };
            var actualData = LineChart.converter(dataView, blankCategoryValue, colors, false, null).series;
            var expectedData: powerbi.visuals.LineChartSeries[] =
                [{
                    key: key,
                    lineIndex: 0,
                    color: hexDefaultColorRed,
                    xCol: dataView.metadata.columns[0],
                    yCol: dataView.metadata.columns[1],
                    data: [
                        {
                            categoryValue: 'John Domo',
                            value: 100,
                            categoryIndex: 0,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col2", value: "100" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 0 }),
                            labelFill: hexDefaultColorRed,
                        },
                        {
                            categoryValue: 'Delta Force',
                            value: 200,
                            categoryIndex: 1,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col2", value: "200" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 1 }),
                            labelFill: hexDefaultColorRed,
                        },
                        {
                            categoryValue: 'Jean Tablau',
                            value: 700,
                            categoryIndex: 2,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col2", value: "700" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 2 }),
                            labelFill: hexDefaultColorRed,
                        },
                    ],
                    identity: SelectionId.createWithMeasure('col2'),
                    selected: false,
                }];

            expect(actualData).toEqual(expectedData);
        });

        it('Check convert categorical multi-series + fill colors', () => {  
            var seriesId1 = SelectionId.createWithMeasure('col2');
            var seriesKey1 = seriesId1.getKey();
            var seriesId2 = SelectionId.createWithMeasure('col3');
            var seriesKey2 = seriesId2.getKey();
            var seriesId3 = SelectionId.createWithMeasure('col4');
            var seriesKey3 = seriesId3.getKey();
                    
            var seriesColors = [
                '#41BEE0',
                '#41BEE1',
                '#41BEE2',
            ];
                    
            var metadata: powerbi.DataViewMetadata = {
                columns: [
                    dataViewMetadata.columns[0],
                    powerbi.Prototype.inherit(dataViewMetadata.columns[1], c => c.objects = { dataPoint: { fill: { solid: { color: seriesColors[0] } } } }),
                    powerbi.Prototype.inherit(dataViewMetadata.columns[2], c => c.objects = { dataPoint: { fill: { solid: { color: seriesColors[1] } } } }),
                    powerbi.Prototype.inherit(dataViewMetadata.columns[3], c => c.objects = { dataPoint: { fill: { solid: { color: seriesColors[2] } } } }),
                ]
            };
            var dataView: powerbi.DataView = {
                metadata: metadata,
                categorical: {
                    categories: [{
                        source: metadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau'],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: metadata.columns[1],
                            values: [100, 200, 700],
                        }, {
                            source: metadata.columns[2],
                            values: [700, 100, 200],
                        }, {
                            source: metadata.columns[3],
                            values: [200, 700, 100],
                        }])

                },
            };
            dataView.categorical.values.source = metadata.columns[4];
            var actualData = LineChart.converter(dataView, blankCategoryValue, colors, false).series;
            var expectedData: powerbi.visuals.LineChartSeries[] =
                [
                    {
                        key: seriesKey1,
                        lineIndex: 0,
                        color: seriesColors[0],
                        xCol: dataView.metadata.columns[0],
                        yCol: dataView.metadata.columns[1],
                        data: [
                            {
                                categoryValue: 'John Domo', value: 100,
                                categoryIndex: 0,
                                seriesIndex: 0,
                                tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col2", value: "100" }],
                                identity: seriesId1,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey1, catIdx: 0 }),
                                labelFill: seriesColors[0],
                            },
                            {
                                categoryValue: 'Delta Force',
                                value: 200,
                                categoryIndex: 1,
                                seriesIndex: 0,
                                tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col2", value: "200" }],
                                identity: seriesId1,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey1, catIdx: 1 }),
                                labelFill: seriesColors[0],
                            },
                            {
                                categoryValue: 'Jean Tablau',
                                value: 700,
                                categoryIndex: 2,
                                seriesIndex: 0,
                                tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col2", value: "700" }],
                                identity: seriesId1,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey1, catIdx: 2 }),
                                labelFill: seriesColors[0],
                            },
                        ],
                        identity: seriesId1,
                        selected: false
                    },
                    {
                        key: seriesKey2,
                        lineIndex: 1,
                        color: seriesColors[1],
                        xCol: dataView.metadata.columns[0],
                        yCol: dataView.metadata.columns[2],
                        data: [
                            {
                                categoryValue: 'John Domo',
                                value: 700,
                                categoryIndex: 0,
                                seriesIndex: 1,
                                tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col3", value: "700" }],
                                identity: seriesId2,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey2, catIdx: 0 }),
                                labelFill: seriesColors[1],
                            },
                            {
                                categoryValue: 'Delta Force',
                                value: 100,
                                categoryIndex: 1,
                                seriesIndex: 1,
                                tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col3", value: "100" }],
                                identity: seriesId2,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey2, catIdx: 1 }),
                                labelFill: seriesColors[1],
                            },
                            {
                                categoryValue: 'Jean Tablau',
                                value: 200,
                                categoryIndex: 2,
                                seriesIndex: 1,
                                tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col3", value: "200" }],
                                identity: seriesId2,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey2, catIdx: 2 }),
                                labelFill: seriesColors[1],
                            },
                        ],
                        identity: seriesId2,
                        selected: false
                    },
                    {
                        key: seriesKey3,
                        lineIndex: 2,
                        color: seriesColors[2],
                        xCol: dataView.metadata.columns[0],
                        yCol: dataView.metadata.columns[3],
                        data: [
                            {
                                categoryValue: 'John Domo',
                                value: 200,
                                categoryIndex: 0,
                                seriesIndex: 2,
                                tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col4", value: "200" }],
                                identity: seriesId3,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey3, catIdx: 0 }),
                                labelFill: seriesColors[2],
                            },
                            {
                                categoryValue: 'Delta Force',
                                value: 700,
                                categoryIndex: 1,
                                seriesIndex: 2,
                                tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col4", value: "700" }],
                                identity: seriesId3,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey3, catIdx: 1 }),
                                labelFill: seriesColors[2],
                            },
                            {
                                categoryValue: 'Jean Tablau',
                                value: 100,
                                categoryIndex: 2,
                                seriesIndex: 2,
                                tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col4", value: "100" }],
                                identity: seriesId3,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey3, catIdx: 2 }),
                                labelFill: seriesColors[2],
                            },
                        ],
                        identity: seriesId3,
                        selected: false,
                    },
                ];

            expect(actualData).toEqual(expectedData);
        });

        it('Check convert categorical multi-series',() => {
            var seriesId1 = SelectionId.createWithMeasure('col2');
            var seriesKey1 = seriesId1.getKey();
            var seriesId2 = SelectionId.createWithMeasure('col3');
            var seriesKey2 = seriesId2.getKey();
            var seriesId3 = SelectionId.createWithMeasure('col4');
            var seriesKey3 = seriesId3.getKey();
            dataViewMetadata.objects = undefined;
            var dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau']
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadata.columns[1],
                            values: [100, 200, 700],
                        }, {
                            source: dataViewMetadata.columns[2],
                            values: [700, 100, 200],
                        }, {
                            source: dataViewMetadata.columns[3],
                            values: [200, 700, 100],
                        }]),
                },
            };

            var seriesColors = [
                colors.getColor(dataViewMetadata.columns[1].queryName).value,
                colors.getColor(dataViewMetadata.columns[2].queryName).value,
                colors.getColor(dataViewMetadata.columns[3].queryName).value,
            ];

            var actualData = LineChart.converter(dataView, blankCategoryValue, colors, false).series;
            var expectedData: powerbi.visuals.LineChartSeries[] =
                [
                    {
                        key: seriesKey1,
                        lineIndex: 0,
                        color: seriesColors[0],
                        xCol: dataView.metadata.columns[0],
                        yCol: dataView.metadata.columns[1],
                        data: [
                            {
                                categoryValue: 'John Domo', value: 100,
                                categoryIndex: 0,
                                seriesIndex: 0,
                                tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col2", value: "100" }],
                                identity: seriesId1,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey1, catIdx: 0 }),
                                labelFill: seriesColors[0],
                            },
                            {
                                categoryValue: 'Delta Force',
                                value: 200,
                                categoryIndex: 1,
                                seriesIndex: 0,
                                tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col2", value: "200" }],
                                identity: seriesId1,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey1, catIdx: 1 }),
                                labelFill: seriesColors[0],
                            },
                            {
                                categoryValue: 'Jean Tablau',
                                value: 700,
                                categoryIndex: 2,
                                seriesIndex: 0,
                                tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col2", value: "700" }],
                                identity: seriesId1,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey1, catIdx: 2 }),
                                labelFill: seriesColors[0],
                            },
                        ],
                        identity: seriesId1,
                        selected: false
                    },
                    {
                        key: seriesKey2,
                        lineIndex: 1,
                        color: seriesColors[1],
                        xCol: dataView.metadata.columns[0],
                        yCol: dataView.metadata.columns[2],
                        data: [
                            {
                                categoryValue: 'John Domo',
                                value: 700,
                                categoryIndex: 0,
                                seriesIndex: 1,
                                tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col3", value: "700" }],
                                identity: seriesId2,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey2, catIdx: 0 }),
                                labelFill: seriesColors[1],
                            },
                            {
                                categoryValue: 'Delta Force',
                                value: 100,
                                categoryIndex: 1,
                                seriesIndex: 1,
                                tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col3", value: "100" }],
                                identity: seriesId2,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey2, catIdx: 1 }),
                                labelFill: seriesColors[1],
                            },
                            {
                                categoryValue: 'Jean Tablau',
                                value: 200,
                                categoryIndex: 2,
                                seriesIndex: 1,
                                tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col3", value: "200" }],
                                identity: seriesId2,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey2, catIdx: 2 }),
                                labelFill: seriesColors[1],
                            },
                        ],
                        identity: seriesId2,
                        selected: false
                    },
                    {
                        key: seriesKey3,
                        lineIndex: 2,
                        color: seriesColors[2],
                        xCol: dataView.metadata.columns[0],
                        yCol: dataView.metadata.columns[3],
                        data: [
                            {
                                categoryValue: 'John Domo',
                                value: 200,
                                categoryIndex: 0,
                                seriesIndex: 2,
                                tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col4", value: "200" }],
                                identity: seriesId3,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey3, catIdx: 0 }),
                                labelFill: seriesColors[2],
                            },
                            {
                                categoryValue: 'Delta Force',
                                value: 700,
                                categoryIndex: 1,
                                seriesIndex: 2,
                                tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col4", value: "700" }],
                                identity: seriesId3,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey3, catIdx: 1 }),
                                labelFill: seriesColors[2],
                            },
                            {
                                categoryValue: 'Jean Tablau',
                                value: 100,
                                categoryIndex: 2,
                                seriesIndex: 2,
                                tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col4", value: "100" }],
                                identity: seriesId3,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey3, catIdx: 2 }),
                                labelFill: seriesColors[2],
                            },
                        ],
                        identity: seriesId3,
                        selected: false,
                    },
                ];

            expect(actualData).toEqual(expectedData);
        });

        it('Check convert categorical multi-series + default color + fill color', () => {
            var seriesId1 = SelectionId.createWithMeasure('col2');
            var seriesKey1 = seriesId1.getKey();
            var seriesId2 = SelectionId.createWithMeasure('col3');
            var seriesKey2 = seriesId2.getKey();
            var seriesId3 = SelectionId.createWithMeasure('col4');
            var seriesKey3 = seriesId3.getKey();

            var series1Color = '#41BEE0';
            var hexDefaultColorRed = "FF0000";

            var metadata: powerbi.DataViewMetadata = {
                columns: [
                    dataViewMetadata.columns[0],
                    powerbi.Prototype.inherit(dataViewMetadata.columns[1], c => c.objects = { dataPoint: { fill: { solid: { color: series1Color } } } }),
                    dataViewMetadata.columns[2],
                    dataViewMetadata.columns[3],
                ],
            };
            metadata.objects = {
                dataPoint: { defaultColor: { solid: { color: hexDefaultColorRed } } }
            };
            var dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultPointLabelSettings();
            dataLabelSettings.formatterOptions = metadata.columns[1];
            var dataView: powerbi.DataView = {
                metadata: metadata,
                categorical: {
                    categories: [{
                        source: metadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau'],
                        objects: [{ dataPoint: { fill: { solid: { color: series1Color } } } },
                            undefined,
                            undefined]
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: metadata.columns[1],
                            values: [100, 200, 700],
                        }, {
                            source: metadata.columns[2],
                            values: [700, 100, 200],
                        }, {
                            source: metadata.columns[3],
                            values: [200, 700, 100],
                        }])

                },
            };
            dataView.categorical.values.source = metadata.columns[4];
            var hexDefaultColorRed = "FF0000";
            var actualData = LineChart.converter(dataView, blankCategoryValue, colors, false, null).series;
            var expectedData: powerbi.visuals.LineChartSeries[] =
                [
                    {
                        key: seriesKey1,
                        lineIndex: 0,
                        color: series1Color,
                        xCol: metadata.columns[0],
                        yCol: metadata.columns[1],
                        data: [
                            {
                                categoryValue: 'John Domo', value: 100,
                                categoryIndex: 0,
                                seriesIndex: 0,
                                tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col2", value: "100" }],
                                identity: seriesId1,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey1, catIdx: 0 }),
                                labelFill: series1Color,
                            },
                            {
                                categoryValue: 'Delta Force',
                                value: 200,
                                categoryIndex: 1,
                                seriesIndex: 0,
                                tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col2", value: "200" }],
                                identity: seriesId1,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey1, catIdx: 1 }),
                                labelFill: series1Color,
                            },
                            {
                                categoryValue: 'Jean Tablau',
                                value: 700,
                                categoryIndex: 2,
                                seriesIndex: 0,
                                tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col2", value: "700" }],
                                identity: seriesId1,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey1, catIdx: 2 }),
                                labelFill: series1Color,
                            },
                        ],
                        identity: seriesId1,
                        selected: false
                    },
                    {
                        key: seriesKey2,
                        lineIndex: 1,
                        color: hexDefaultColorRed,
                        xCol: metadata.columns[0],
                        yCol: metadata.columns[2],
                        data: [
                            {
                                categoryValue: 'John Domo',
                                value: 700,
                                categoryIndex: 0,
                                seriesIndex: 1,
                                tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col3", value: "700" }],
                                identity: seriesId2,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey2, catIdx: 0 }),
                                labelFill: hexDefaultColorRed,
                            },
                            {
                                categoryValue: 'Delta Force',
                                value: 100,
                                categoryIndex: 1,
                                seriesIndex: 1,
                                tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col3", value: "100" }],
                                identity: seriesId2,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey2, catIdx: 1 }),
                                labelFill: hexDefaultColorRed,
                            },
                            {
                                categoryValue: 'Jean Tablau',
                                value: 200,
                                categoryIndex: 2,
                                seriesIndex: 1,
                                tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col3", value: "200" }],
                                identity: seriesId2,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey2, catIdx: 2 }),
                                labelFill: hexDefaultColorRed,
                            },
                        ],
                        identity: seriesId2,
                        selected: false
                    },
                    {
                        key: seriesKey3,
                        lineIndex: 2,
                        color: hexDefaultColorRed,
                        xCol: metadata.columns[0],
                        yCol: metadata.columns[3],
                        data: [
                            {
                                categoryValue: 'John Domo',
                                value: 200,
                                categoryIndex: 0,
                                seriesIndex: 2,
                                tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col4", value: "200" }],
                                identity: seriesId3,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey3, catIdx: 0 }),
                                labelFill: hexDefaultColorRed,
                            },
                            {
                                categoryValue: 'Delta Force',
                                value: 700,
                                categoryIndex: 1,
                                seriesIndex: 2,
                                tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col4", value: "700" }],
                                identity: seriesId3,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey3, catIdx: 1 }),
                                labelFill: hexDefaultColorRed,
                            },
                            {
                                categoryValue: 'Jean Tablau',
                                value: 100,
                                categoryIndex: 2,
                                seriesIndex: 2,
                                tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col4", value: "100" }],
                                identity: seriesId3,
                                selected: false,
                                key: JSON.stringify({ ser: seriesKey3, catIdx: 2 }),
                                labelFill: hexDefaultColorRed,
                            },
                        ],
                        identity: seriesId3,
                        selected: false,
                    },
                ];

            expect(actualData).toEqual(expectedData);
        });

        it('Check convert non-category multi-measure + fill colors',() => {
            var seriesColors = [
                '#41BEE0',
                '#41BEE1',
            ];

            var metadata: powerbi.DataViewMetadata = {
                columns: [
                    powerbi.Prototype.inherit(dataViewMetadata.columns[0], c => c.objects = { dataPoint: { fill: { solid: { color: seriesColors[0] } } } }),
                    powerbi.Prototype.inherit(dataViewMetadata.columns[1], c => c.objects = { dataPoint: { fill: { solid: { color: seriesColors[1] } } } }),
                ]
            };
            var dataView: powerbi.DataView = {
                metadata: metadata,
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: metadata.columns[0],
                            values: [100],
                        }, {
                            source: metadata.columns[1],
                            values: [200],
                        }])
                }
            };
            var ids = [SelectionId.createWithMeasure('col1'), SelectionId.createWithMeasure('col2')];
            var keys = [ids[0].getKey(), ids[1].getKey()];
            var actualData = LineChart.converter(dataView, blankCategoryValue, colors, false).series;
            var expectSlices: powerbi.visuals.LineChartSeries[] =
                [
                    {
                        key: keys[0],
                        lineIndex: 0,
                        color: seriesColors[0],
                        xCol: undefined,
                        yCol: dataView.metadata.columns[0],
                        data: [
                            {
                                categoryValue: blankCategoryValue,
                                value: 100,
                                categoryIndex: 0,
                                seriesIndex: 0,
                                tooltipInfo: [{ displayName: "col1", value: "100" }],
                                identity: ids[0],
                                selected: false,
                                key: JSON.stringify({ ser: keys[0], catIdx: 0 }),
                                labelFill: seriesColors[0],
                            }
                        ],
                        identity: ids[0],
                        selected: false,
                    },
                    {
                        key: keys[1],
                        lineIndex: 1,
                        color: seriesColors[1],
                        xCol: undefined,
                        yCol: dataView.metadata.columns[1],
                        data: [
                            {
                                categoryValue: blankCategoryValue,
                                value: 200,
                                categoryIndex: 0,
                                seriesIndex: 1,
                                tooltipInfo: [{ displayName: "col2", value: "200" }],
                                identity: ids[1],
                                selected: false,
                                key: JSON.stringify({ ser: keys[1], catIdx: 0 }),
                                labelFill: seriesColors[1],
                            }
                        ],
                        identity: ids[1], 
                        selected: false 
                    }
                ];

            expect(actualData).toEqual(expectSlices);
        });

        it('Check convert date time', () => {
            var dateTimeColumnsMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'Date', queryName: 'Date', type: ValueType.fromDescriptor({ dateTime: true }) },
                    { displayName: 'PowerBI Customers', queryName: 'PowerBI Customers', isMeasure: true }]
            };

            var dataView: powerbi.DataView = {
                metadata: dateTimeColumnsMetadata,
                categorical: {
                    categories: [{
                        source: dateTimeColumnsMetadata.columns[0],
                        values: [new Date('2014/9/25'), new Date('2014/12/12'), new Date('2015/9/25')],
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dateTimeColumnsMetadata.columns[1],
                        values: [8000, 20000, 1000000],
                    }])
                }
            };
            var selectionId = SelectionId.createWithMeasure('PowerBI Customers');
            var key = selectionId.getKey();
            var actualData = LineChart.converter(dataView, blankCategoryValue, colors, true).series;
            var seriesColor = colors.getColor(dateTimeColumnsMetadata.columns[1].queryName).value;

            var expectedData: powerbi.visuals.LineChartSeries[] =
                [{
                    key: key,
                    lineIndex: 0,
                    color: seriesColor,
                    xCol: dataView.metadata.columns[0],
                    yCol: dataView.metadata.columns[1],
                    data: [
                        {
                            categoryValue: new Date('2014/9/25').getTime(),
                            value: 8000,
                            categoryIndex: 0,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "Date", value: "9/25/2014 12:00:00 AM" }, { displayName: "PowerBI Customers", value: "8000" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 0 }),
                            labelFill: seriesColor,
                        },
                        {
                            categoryValue: new Date('2014/12/12').getTime(),
                            value: 20000,
                            categoryIndex: 1,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "Date", value: "12/12/2014 12:00:00 AM" }, { displayName: "PowerBI Customers", value: "20000" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 1 }),
                            labelFill: seriesColor,
                        },
                        {
                            categoryValue: new Date('2015/9/25').getTime(),
                            value: 1000000,
                            categoryIndex: 2,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "Date", value: "9/25/2015 12:00:00 AM" }, { displayName: "PowerBI Customers", value: "1000000" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 2 }),
                            labelFill: seriesColor,
                        },
                    ],
                    identity: selectionId,
                    selected: false 
                }];

            expect(actualData).toEqual(expectedData);
        });

        it('Check convert datetime category with null category value', () => {
            var dateTimeColumnsMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'Date', queryName: 'Date', type: ValueType.fromDescriptor({ dateTime: true }) },
                    { displayName: 'PowerBI Customers', queryName: 'PowerBI Customers', isMeasure: true }]
            };

            var dataView: powerbi.DataView = {
                metadata: dateTimeColumnsMetadata,
                categorical: {
                    categories: [{
                        source: dateTimeColumnsMetadata.columns[0],
                        values: [null, new Date('2014/9/25'), new Date('2014/12/12'), new Date('2015/9/25')]
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dateTimeColumnsMetadata.columns[1],
                        values: [30000, 8000, 20000, 1000000],
                    }])
                }
            };
            var selectionId = SelectionId.createWithMeasure('PowerBI Customers');
            var key = selectionId.getKey();
            var actualData = LineChart.converter(dataView, blankCategoryValue, colors, true).series;
            var seriesColor = colors.getColor(dateTimeColumnsMetadata.columns[1].queryName).value;

            var expectedData: powerbi.visuals.LineChartSeries[] = 
                [{
                    key: key,
                    lineIndex: 0,
                    color: seriesColor,
                    xCol: dataView.metadata.columns[0],
                    yCol: dataView.metadata.columns[1],
                    data: [
                        {
                            categoryValue: new Date('2014/9/25').getTime(),
                            value: 8000,
                            categoryIndex: 1,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "Date", value: "9/25/2014 12:00:00 AM" }, { displayName: "PowerBI Customers", value: "8000" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 1 }),
                            labelFill: seriesColor,
                        },
                        {
                            categoryValue: new Date('2014/12/12').getTime(),
                            value: 20000,
                            categoryIndex: 2,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "Date", value: "12/12/2014 12:00:00 AM" }, { displayName: "PowerBI Customers", value: "20000" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 2 }),
                            labelFill: seriesColor,
                        },
                        {
                            categoryValue: new Date('2015/9/25').getTime(),
                            value: 1000000,
                            categoryIndex: 3,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "Date", value: "9/25/2015 12:00:00 AM" }, { displayName: "PowerBI Customers", value: "1000000" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 3 }),
                            labelFill: seriesColor,
                        },
                    ],
                    identity: selectionId,
                    selected: false,                    
                }];

            expect(actualData).toEqual(expectedData);
        });

        it('Check convert categorical with null category value', () => {
            var dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', null, 'Delta Force', 'Jean Tablau']
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100, 300, 200, 700],
                        subtotal: 1300
                    }])
                }
            };
            var selectionId = SelectionId.createWithMeasure('col2');
            var key = selectionId.getKey();
            var actualData = LineChart.converter(dataView, blankCategoryValue, colors, false).series;
            var seriesColor = colors.getColor(dataViewMetadata.columns[1].queryName).value;

            var expectedData: powerbi.visuals.LineChartSeries[] =
                [{
                    key: key,
                    lineIndex: 0,
                    color: seriesColor,
                    xCol: dataView.metadata.columns[0],
                    yCol: dataView.metadata.columns[1],
                    data: [
                        {
                            categoryValue: 'John Domo',
                            value: 100,
                            categoryIndex: 0,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col2", value: "100" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 0 }),
                            labelFill: seriesColor,
                        },
                        {
                            categoryValue: null,
                            value: 300,
                            categoryIndex: 1,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "(Blank)" }, { displayName: "col2", value: "300" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 1 }),
                            labelFill: seriesColor,
                        },
                        {
                            categoryValue: 'Delta Force',
                            value: 200,
                            categoryIndex: 2,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col2", value: "200" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 2 }),
                            labelFill: seriesColor,
                        },
                        {
                            categoryValue: 'Jean Tablau',
                            value: 700,
                            categoryIndex: 3,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col2", value: "700" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 3 }),
                            labelFill: seriesColor,
                        },
                    ],
                    identity: selectionId,
                selected: false,
                }];

            expect(actualData).toEqual(expectedData);
        });

        it('Check convert categorical with positive infinity value',() => {
            var dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau']
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100, Number.POSITIVE_INFINITY, 700],
                        subtotal: 800
                    }])
                }
            };
            var selectionId = SelectionId.createWithMeasure('col2');
            var key = selectionId.getKey();
            var actualData = LineChart.converter(dataView, blankCategoryValue, colors, false).series;
            var seriesColor = colors.getColor(dataViewMetadata.columns[1].queryName).value;

            var expectedData: powerbi.visuals.LineChartSeries[] = 
                [{
                    key: key,
                    lineIndex: 0,
                    color: seriesColor,
                    xCol: dataView.metadata.columns[0],
                    yCol: dataView.metadata.columns[1],
                    data: [
                        {
                            categoryValue: 'John Domo',
                            value: 100,
                            categoryIndex: 0,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col2", value: "100" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 0 }),
                            labelFill: seriesColor,
                        },
                        {
                            categoryValue: 'Delta Force',
                            value: Number.MAX_VALUE,
                            categoryIndex: 1,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col2", value: "1.7976931348623157E+308" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 1 }),
                            labelFill: seriesColor,
                        },
                        {
                            categoryValue: 'Jean Tablau',
                            value: 700,
                            categoryIndex: 2,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col2", value: "700" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 2 }),
                            labelFill: seriesColor,
                        },
                    ],
                    identity: selectionId,
                    selected: false,
                }];

            expect(actualData).toEqual(expectedData);
        });

        it('Check convert categorical with negative infinity value',() => {
            var dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau']
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100, Number.NEGATIVE_INFINITY, 700],
                        subtotal: 800
                    }])
                }
            };
            var selectionId = SelectionId.createWithMeasure('col2');
            var key = selectionId.getKey();
            var actualData = LineChart.converter(dataView, blankCategoryValue, colors, false).series;
            var seriesColor = colors.getColor(dataViewMetadata.columns[1].queryName).value;

            var expectedData: powerbi.visuals.LineChartSeries[] =
                [{
                    key: key,
                    lineIndex: 0,
                    color: seriesColor,
                    xCol: dataView.metadata.columns[0],
                    yCol: dataView.metadata.columns[1],
                    data: [
                        {
                            categoryValue: 'John Domo',
                            value: 100,
                            categoryIndex: 0,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col2", value: "100" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 0 }),
                            labelFill: seriesColor,
                        },
                        {
                            categoryValue: 'Delta Force',
                            value: -Number.MAX_VALUE,
                            categoryIndex: 1,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "Delta Force" }, { displayName: "col2", value: "-1.7976931348623157E+308" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 1 }),
                            labelFill: seriesColor,
                        },
                        {
                            categoryValue: 'Jean Tablau',
                            value: 700,
                            categoryIndex: 2,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col2", value: "700" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 2 }),
                            labelFill: seriesColor,
                        },
                    ],
                    identity: selectionId,
                    selected: false,
                }];

            expect(actualData).toEqual(expectedData);
        });

        it('Check convert categorical with NaN value',() => {
            var dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['John Domo', 'Delta Force', 'Jean Tablau']
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100, Number.NaN, 700],
                        subtotal: 800
                    }])
                }
            };
            var selectionId = SelectionId.createWithMeasure('col2');
            var key = selectionId.getKey();
            var actualData = LineChart.converter(dataView, blankCategoryValue, colors, false).series;
            var seriesColor = colors.getColor(dataViewMetadata.columns[1].queryName).value;

            var expectedData: powerbi.visuals.LineChartSeries[] = 
                [{
                    key: key,
                    lineIndex: 0,
                    color: seriesColor,
                    xCol: dataView.metadata.columns[0],
                    yCol: dataView.metadata.columns[1],
                    data: [
                        {
                            categoryValue: 'John Domo',
                            value: 100,
                            categoryIndex: 0,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "John Domo" }, { displayName: "col2", value: "100" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 0 }),
                            labelFill: seriesColor,
                        },
                        {
                            categoryValue: 'Delta Force',
                            value: null,
                            categoryIndex: 1,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "Delta Force" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 1 }),
                            labelFill: seriesColor,
                        },
                        {
                            categoryValue: 'Jean Tablau',
                            value: 700,
                            categoryIndex: 2,
                            seriesIndex: 0,
                            tooltipInfo: [{ displayName: "col1", value: "Jean Tablau" }, { displayName: "col2", value: "700" }],
                            identity: selectionId,
                            selected: false,
                            key: JSON.stringify({ ser: key, catIdx: 2 }),
                            labelFill: seriesColor,
                        },
                    ],
                    identity: selectionId,
                    selected: false,
                }];

            expect(actualData).toEqual(expectedData);
        });

        function lineChartDomValidation(interactiveChart: boolean, minerva: boolean) {
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
                        objects: { general: { formatString: '0.000' } },
                    },
                    {
                        displayName: 'col3',
                        isMeasure: false,
                        type: DataShapeUtility.describeDataType(SemanticType.DateTime),
                        objects: { general: { formatString: 'd' } },
                    }],
            };
            var dataViewMetadataWithScalarObject = powerbi.Prototype.inherit(dataViewMetadata);
            dataViewMetadataWithScalarObject.objects = { categoryAxis: { scalar: true } };

            beforeEach(() => {
                powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
                element = powerbitests.helpers.testDom('500', '500');
                v = minerva ?
                powerbi.visuals.visualPluginFactory.createMinerva({
                    heatMap: false,
                    scrollableVisuals: true,
                }).getPlugin('lineChart').create() :
                    powerbi.visuals.visualPluginFactory.create().getPlugin('lineChart').create();
                v.init({
                    element: element,
                    host: hostServices,
                    style: powerbi.visuals.visualStyles.create(),
                    viewport: {
                        height: element.height(),
                        width: element.width()
                    },
                    animation: { transitionImmediate: true },
                    interactivity: { isInteractiveLegend: interactiveChart },
                });
            });

            function getOptionsForValuesWarning(values: number[]) {
                var options = {
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: ['a', 'b', 'c', 'd', 'e']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: values,
                                subtotal: 246500
                            }])
                        }
                    }]
                };
                return options;
            }

            it('NaN in values shows a warning', (done) => {
                var warningSpy = jasmine.createSpy('warning');
                hostServices.setWarnings = warningSpy;

                var options = getOptionsForValuesWarning([NaN, 495000, 490000, 480000, 500000]);
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

                var options = getOptionsForValuesWarning([Number.NEGATIVE_INFINITY, 495000, 490000, 480000, 500000]);
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

                var options = getOptionsForValuesWarning([Number.POSITIVE_INFINITY, 495000, 490000, 480000, 500000]);
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

                var options = getOptionsForValuesWarning([-1e301, 495000, 490000, 480000, 500000]);
                v.onDataChanged(options);

                setTimeout(() => {
                    expect(warningSpy).toHaveBeenCalled();
                    expect(warningSpy.calls.count()).toBe(1);
                    expect(warningSpy.calls.argsFor(0)[0][0].code).toBe('ValuesOutOfRange');
                    done();
                }, DefaultWaitForRender);
            });

            it('All okay in values does not show a warning', (done) => {
                var warningSpy = jasmine.createSpy('warning');
                hostServices.setWarnings = warningSpy;

                var options = getOptionsForValuesWarning([480000, 495000, 490000, 480000, 500000]);
                v.onDataChanged(options);

                setTimeout(() => {
                    expect(warningSpy).not.toHaveBeenCalled();
                    done();
                }, DefaultWaitForRender);
            });

            it('line chart dom validation', (done) => {
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
                                subtotal: 246500
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    expect($('.lineChart .axisGraphicsContext .x.axis .tick').length).toBeGreaterThan(0);
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').length).toBeGreaterThan(0);
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').find('text').first().text()).toBe('480K');
                    done();
                }, DefaultWaitForRender);
            });

            it('verify viewport when filtering data', (done) => {

                // Clone in order to keep the original as it is
                var dataViewMeta = _.clone(dataViewMetadata);
                dataViewMeta.objects = {
                    categoryAxis: {
                        show: true,
                        start: 490001,
                        end: 495001,
                        axisType: AxisType.scalar,
                        showAxisTitle: true,
                        axisStyle: true
                    }
                };

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
                                subtotal: 246500
                            }])
                        }
                    }]
                });

                var svgBox = $('.mainGraphicsContext').parent()[0].getBoundingClientRect();

                if (interactiveChart) {
                    setTimeout(() => {
                        expect(svgBox.height).toBeCloseTo(405, 0);
                        expect(svgBox.width).toBeCloseTo(384, 0);
                        done();
                    }, DefaultWaitForRender);
                }
                else {
                    setTimeout(() => {
                        expect(svgBox.height).toBeCloseTo(470, 0);
                        expect(svgBox.width).toBeCloseTo(384, 0);
                        done();
                    }, DefaultWaitForRender);
                }
            });

            it('ensure line chart is cleared when an empty dataview is applied', (done) => {
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
                                subtotal: 246500
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    var catCount = $('.lineChart').find('.line').length;
                    expect(catCount).toBe(1);
                    v.onDataChanged({
                        dataViews: [{
                            metadata: dataViewMetadata,
                            categorical: {
                                categories: [{
                                    source: dataViewMetadata.columns[0],
                                    values: []
                                }],
                                values: DataViewTransform.createValueColumns([])
                            }
                        }]
                    });
                    setTimeout(() => {
                        var catCountNew = $('.lineChart').find('.line').length;
                        expect(catCountNew).toBe(0);
                        done();
                    }, DefaultWaitForRender);
                }, DefaultWaitForRender);
            });

            it('line chart check if date time axis has margin allocated in DOM', (done) => {
                var dateTimeColumnsMetadata: powerbi.DataViewMetadata = {
                    columns: [
                        { displayName: 'Date', type: ValueType.fromDescriptor({ dateTime: true }) },
                        { displayName: 'PowerBI Customers', isMeasure: true }]
                };

                var dataView: powerbi.DataView = {
                    metadata: dateTimeColumnsMetadata,
                    categorical: {
                        categories: [{
                            source: dateTimeColumnsMetadata.columns[0],
                            values: [new Date('2014/9/25'), new Date('2014/12/12'), new Date('2015/9/25')]
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dateTimeColumnsMetadata.columns[1],
                            values: [8000, 20000, 1000000],
                        }])
                    }
                };

                v.onDataChanged({ dataViews: [dataView] });

                setTimeout(() => {
                    var ticks = $('.lineChart .axisGraphicsContext .x.axis .tick text');
                    expect(ticks.length).toBe(6);
                    var expectedValues = [
                        'Nov 2014',
                        'Jan 2015',
                        'Mar 2015',
                        'May 2015',
                        'Jul 2015',
                        'Sep 2015'];

                    for (var i = 0; i < 0; i++) {
                        var tick = $(ticks[i]).text();
                        var tickDate = new Date(tick).toUTCString();
                        var expectedDate = new Date(expectedValues[i]).toUTCString();
                        expect(tickDate).toEqual(expectedDate);
                    }
                    done();
                }, DefaultWaitForRender);
            });

            it('Line chart with an undefined domain', (done) => {
                var dateTimeColumnsMetadata: powerbi.DataViewMetadata = {
                    columns: [
                        { displayName: 'Date', type: ValueType.fromDescriptor({ dateTime: true }) },
                        { displayName: 'PowerBI Fans', isMeasure: true }]
                };

                var dataView: powerbi.DataView = {
                    metadata: dateTimeColumnsMetadata,
                    categorical: {
                        categories: [{
                            source: dateTimeColumnsMetadata.columns[0],
                            values: []
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dateTimeColumnsMetadata.columns[1],
                            values: [],
                        }])
                    }
                };

                v.onDataChanged({ dataViews: [dataView] });

                setTimeout(() => {
                    expect($('.lineChart .axisGraphicsContext .x.axis .tick').length).toBeGreaterThan(0);
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').length).toBeGreaterThan(0);
                    done();
                }, DefaultWaitForRender);

            });

            it('line chart with small interval dom validation', (done) => {
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
                                values: [1.000, 0.995, 0.990, 0.985, 0.995],
                                subtotal: 4.965
                            }])
                        }
                    }]
                });

                setTimeout(() => {
                    expect($('.lineChart .axisGraphicsContext .x.axis .tick').length).toBeGreaterThan(0);
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').length).toBeGreaterThan(0);
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').find('text').first().text()).toBe('0.985');
                    done();
                }, DefaultWaitForRender);
            });

            it('line chart validate auto margin', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: ['ReallyLongValuesSoYouRotate1', 'ReallyLongValuesSoYouRotate2', 'ReallyLongValuesSoYouRotate3', 'ReallyLongValuesSoYouRotate4', 'ReallyLongValuesSoYouRotate5']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: [50000, 49500, 49000, 48000, 50000],
                                subtotal: 246500
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    var yTranslate = parseFloat($('.lineChart .axisGraphicsContext .x.axis').attr('transform').split(',')[1].replace('(', ''));
                    var xTranslate = parseFloat($('.lineChart .axisGraphicsContext .y.axis').attr('transform').split(',')[0].split('(')[1]);
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
                                    values: [0, 1, 2, 3, 4],
                                    subtotal: 246500
                                }])
                            }
                        }]
                    });
                    setTimeout(() => {
                        var newYTranslate = parseFloat($('.lineChart .axisGraphicsContext .x.axis').attr('transform').split(',')[1].replace('(', ''));
                        var newXTranslate = parseFloat($('.lineChart .axisGraphicsContext .y.axis').attr('transform').split(',')[0].split('(')[1]);
                        expect(yTranslate).toBeLessThan(newYTranslate);
                        expect(xTranslate).toBeLessThan(newXTranslate);
                        done();
                    }, DefaultWaitForRender);
                }, DefaultWaitForRender);
            });

            it('line chart multi-series dom validation', (done) => {
                var metadata: powerbi.DataViewMetadata = {
                    columns: [
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
                        }]
                };

                var seriesIdentities = [
                    mocks.dataViewScopeIdentity('col2'),
                    mocks.dataViewScopeIdentity('col3'),
                ];

                var measureColumn: powerbi.DataViewMetadataColumn = { displayName: 'sales', isMeasure: true, type: DataShapeUtility.describeDataType(SemanticType.Integer) };
                var col3Ref = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'sales' });

                var valueColumns = DataViewTransform.createValueColumns([
                    {
                        source: metadata.columns[1],
                        values: [110, 120, 130, 140, 150],
                        identity: seriesIdentities[0],
                    }, {
                        source: metadata.columns[2],
                        values: [210, 220, 230, 240, 250],
                        identity: seriesIdentities[1],
                    }],
                    [col3Ref]);
                valueColumns.source = measureColumn;

                v.onDataChanged({
                    dataViews: [{
                        metadata: metadata,
                        categorical: {
                            categories: [{
                                source: metadata.columns[0],
                                values: ['a', 'b', 'c', 'd', 'e'],
                                identityFields: [categoryColumnRef],
                            }],
                            values: valueColumns
                        }
                    }]
                });

                setTimeout(() => {
                    var lines = $('.lineChart .mainGraphicsContext .line');
                    expect(lines.length).toEqual(2);
                    var lineOne = $(lines.get(0)).attr('style');
                    expect(lineOne).toBeDefined();
                    var lineTwo = $(lines.get(1)).attr('style');
                    expect(lineTwo).toBeDefined();
                    if (!interactiveChart)
                        expect($('.legendTitle').text()).toBe('sales');
                    done();
                }, DefaultWaitForRender);
            });

            it('line chart with nulls dom validation', (done) => {
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
                                values: [0, 10, null, 15, 5],
                                subtotal: 20
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    expect($('.lineChart .mainGraphicsContext .line')[0].getAttribute('d')).toBeDefined();
                    done();
                }, DefaultWaitForRender);
            });

            it('Regression Test: Ensure chart does not miraculously shrink with data updates', (done) => {
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
                                values: [1, 2, 3, 4, 5],
                                subtotal: 15
                            },
                                {
                                    source: dataViewMetadata.columns[1],
                                    values: [1, 2, 3, 4, 5],
                                    subtotal: 15
                                }])
                        }
                    }]
                });
               
                setTimeout(() => {
                    var svg = $('.lineChart svg');
                    var height = svg.height();

                    //expect(svg.length).toBe(3);

                    for (var i = 0; i < 5; i++) {
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
                                        values: [1, 2, 3, 4, 5],
                                        subtotal: 15
                                    },
                                        {
                                            source: dataViewMetadata.columns[1],
                                            values: [1, 2, 3, 4, 6],
                                            subtotal: 16
                                        }])
                                }
                            }]
                        });
                    }

                    setTimeout(function () {
                        var newHeight = $('.lineChart svg').height();
                        expect(newHeight).toBe(height);
                        done();
                    }, DefaultWaitForRender);

                }, DefaultWaitForRender);
            });

            it('line chart with null points dom validation (in the middle)', (done) => {
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
                                values: [null, 10, null, 15, null],
                                subtotal: 15
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    var dots = $('.dot');
                    expect(dots.length).toBe(minerva ? 2 : 5);
                    var visibleDots = dots.filter('[r^="4"]');
                    expect(visibleDots.length).toBe(2);
                    done();
                }, DefaultWaitForRender);
            });

            it('line chart with null points dom validation (first and last)', (done) => {
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
                                values: [10, null, 5, null, 15],
                                subtotal: 15
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    var dots = $('.dot');
                    expect(dots.length).toBe(minerva ? 3 : 5);
                    var visibleDots = dots.filter('[r^="4"]');
                    expect(visibleDots.length).toBe(3);
                    done();
                }, DefaultWaitForRender);
            });

            it('line chart with null points dom validation (first and last) - scalar does not draw dots', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithScalarObject,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[2],
                                values: [new Date("2014/1/1"), new Date("2014/2/1"), new Date("2014/3/1"), new Date("2014/4/1"), new Date("2014/5/1")]
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: [10, null, 5, null, 15],
                                subtotal: 15
                            }])
                        },
                    }]
                });
                setTimeout(() => {
                    var dots = $('.dot').filter('[r^="4"]');
                    expect(dots.length).toBe(0);
                    var lines = $('.lineChart .mainGraphicsContext .line');
                    expect(lines.length).toBe(1);
                    done();
                }, DefaultWaitForRender);
            });

            it('ensure selection circle is removed from dom when series is dropped', (done) => {
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
                                values: [null, 10, null, 15, null],
                                subtotal: 15
                            },
                                {
                                    source: dataViewMetadata.columns[1],
                                    values: [null, 10, null, 15, null],
                                    subtotal: 15
                                }])
                        }
                    }]
                });
                setTimeout(() => {
                    var dots = $('.selection-circle');
                    expect(dots.length).toBe(minerva ? 0 : 2);
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
                                    values: [null, 10, null, 15, null],
                                    subtotal: 15
                                }])
                            }
                        }]
                    });
                    setTimeout(() => {
                        var dots = $('.selection-circle');
                        expect(dots.length).toBe(minerva ? 0 : 1);
                        done();
                    }, DefaultWaitForRender);
                }, DefaultWaitForRender);
            });

            it('line chart non-category multi-measure dom validation', (done) => {
                var metadata: powerbi.DataViewMetadata = {
                    columns: [
                        { displayName: 'col1', isMeasure: true, type: DataShapeUtility.describeDataType(SemanticType.Number) },
                        { displayName: 'col2', isMeasure: true, type: DataShapeUtility.describeDataType(SemanticType.Number) }
                    ]
                };
                v.onDataChanged({
                    dataViews: [{
                        metadata: metadata,
                        categorical: {
                            values: DataViewTransform.createValueColumns([
                                {
                                    source: dataViewMetadata.columns[0],
                                    values: [100]
                                }, {
                                    source: dataViewMetadata.columns[1],
                                    values: [200]
                                }])
                        }
                    }]
                });
                setTimeout(() => {
                    if (!minerva) {
                        expect($('.lineChart .hover-line .selection-circle').length).toEqual(2);
                        expect($('.lineChart .hover-line .selection-circle:eq(0)').attr('r')).toEqual('4');
                        expect($('.lineChart .hover-line .selection-circle:eq(1)').attr('r')).toEqual('4');
                    }
                    done();
                }, DefaultWaitForRender);
            });

            it('line chart series only dom validation', (done) => {
                var metadata: powerbi.DataViewMetadata = {
                    columns: [
                        {
                            displayName: 'col1',
                            properties: { Series: true },
                            type: DataShapeUtility.describeDataType(SemanticType.String)
                        },
                        {
                            displayName: 'col2',
                            properties: { Y: true },
                            type: DataShapeUtility.describeDataType(SemanticType.Integer)
                        }
                    ]
                };
                v.onDataChanged({
                    dataViews: [DataViewPivotCategorical.apply({
                        metadata: metadata,
                        categorical: {
                            categories: [{
                                source: metadata.columns[0],
                                values: ['a', 'b', 'c'],
                                identity: [
                                    mocks.dataViewScopeIdentity('a'),
                                    mocks.dataViewScopeIdentity('b'),
                                    mocks.dataViewScopeIdentity('c'),
                                ],
                                identityFields: [categoryColumnRef],
                            }],
                            values: DataViewTransform.createValueColumns([
                                {
                                    source: dataViewMetadata.columns[1],
                                    values: [1, 2, 3]
                                }])
                        }
                    })]
                });
                setTimeout(() => {                    
                    if (!minerva) {
                        expect($('.lineChart .hover-line .selection-circle').length).toEqual(3);
                        expect($('.lineChart .hover-line .selection-circle:eq(0)').attr('r')).toEqual('4');
                        expect($('.lineChart .hover-line .selection-circle:eq(1)').attr('r')).toEqual('4');
                        expect($('.lineChart .hover-line .selection-circle:eq(2)').attr('r')).toEqual('4');
                    }
                    done();
                }, DefaultWaitForRender);
            });

            it('empty line chart dom validation', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: []
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: []
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    expect($('.lineChart .axisGraphicsContext .x.axis .tick').length).toBe(0);
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').length).toBeGreaterThan(0);
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').find('text').last().text()).toBe('10');
                    done();
                }, DefaultWaitForRender);
            });

            it('line chart with single point dom validation', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: ['a']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: [4]
                            }])
                        }
                    }]
                });
                setTimeout(() => {    
                    var dots = $('.dot');              
                    expect(dots.length).toBe(1);

                    var visibleDots = dots.filter('[r^="4"]');
                    expect(visibleDots.length).toBe(1);

                    if (!minerva) {
                        expect($('.lineChart .hover-line .selection-circle').length).toEqual(1);
                        expect($('.lineChart .hover-line .selection-circle:eq(0)').attr('r')).toEqual('4');
                    }
                    
                    expect($('.lineChart .axisGraphicsContext .x.axis .tick').length).toBe(1);
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').length).toBeGreaterThan(0);
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').find('text').last().text()).toBe('5');
                    done();
                }, DefaultWaitForRender);
            });

            it('line chart does not show less ticks dom validation', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: ['a', 'b']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: [26.125, 26.125]
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').length).toBeGreaterThan(1);
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').find('text').last().text()).toBe('30');
                    done();
                }, DefaultWaitForRender);
            });

            it('line chart shows less ticks dom validation', (done) => {
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

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: ['a', 'b']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: [5, 5]
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').length).toBe(3);
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').find('text').last().text()).toBe('6');
                    done();
                }, DefaultWaitForRender);
            });

            it('line chart on small tile shows at least two tick lines dom validation', (done) => {
                v.onResizing({
                    height: 101,
                    width: 226
                }, 0);
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: ['a', 'b', 'c']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: [0.1495, 0.15, 0.1633]
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').length).toBeGreaterThan(1);
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').find('text').first().text()).toBe('0.150');
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').find('text').last().text()).toBe('0.160');
                    done();
                }, DefaultWaitForRender);
            });
        }

        describe("lineChart DOM validation", () => lineChartDomValidation(false, false));

        describe("interactive lineChart DOM validation", () => lineChartDomValidation(true, false));

        describe("minerva lineChart DOM validation", () => lineChartDomValidation(false, true));

        function areaChartDomValidation(interactiveChart: boolean) {
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
                        type: DataShapeUtility.describeDataType(SemanticType.Number)
                    }]
            };

            beforeEach(() => {
                element = powerbitests.helpers.testDom('500', '500');
                v = powerbi.visuals.visualPluginFactory.create().getPlugin('areaChart').create();
                v.init({
                    element: element,
                    host: hostServices,
                    style: powerbi.visuals.visualStyles.create(),
                    viewport: {
                        height: element.height(),
                        width: element.width()
                    },
                    animation: { transitionImmediate: true },
                    interactivity: { isInteractiveLegend: interactiveChart },
                });
            });

            it('check area rendered', (done) => {
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
                                values: [50000, 49500, 49000, 48000, 50000],
                                subtotal: 246500
                            }])
                        }
                    }]
                });

                setTimeout(() => {
                    expect($('.cat')).toBeDefined();
                    expect($('.catArea')).toBeDefined();
                    done();
                }, DefaultWaitForRender);
            });

            it('check linear scale with big interval renders', (done) => {
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
                                subtotal: 246500
                            }])
                        }
                    }]
                });

                setTimeout(() => {
                    expect($('.cat')).toBeDefined();
                    expect($('.catArea')).toBeDefined();
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').find('text').first().text()).toBe('480K');
                    done();
                }, DefaultWaitForRender);
            });

            it('check linear scale with small interval renders', (done) => {
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
                                values: [1.000, 0.995, 0.990, 0.985, 0.995],
                                subtotal: 4.965
                            }])
                        }
                    }]
                });

                setTimeout(() => {
                    expect($('.cat')).toBeDefined();
                    expect($('.catArea')).toBeDefined();
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').find('text').first().text()).toBe('0.98');
                    done();
                }, DefaultWaitForRender);
            });

            it('empty areaChart dom validation', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: []
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: []
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    expect($('.lineChart .axisGraphicsContext .x.axis .tick').length).toBe(0);
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').length).toBeGreaterThan(0);
                    expect($('.lineChart .axisGraphicsContext .y.axis .tick').find('text').last().text()).toBe('10');
                    done();
                }, DefaultWaitForRender);
            });
        }

        describe("areaChart DOM validation", () => areaChartDomValidation(false));

        describe("interactive areaChart DOM validation", () => areaChartDomValidation(true));

        //Data Labels
        function lineChartDataLabelsValidation(interactiveChart: boolean) {
            
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
                    },
                    {
                        displayName: 'col3',
                        isMeasure: false,
                        type: DataShapeUtility.describeDataType(SemanticType.DateTime),
                        format: 'd'
                    }],
            };

            var colors = powerbi.visuals.visualStyles.create().colorPalette.dataColors;

            var dataViewMetadataWithLabelsOnObject = powerbi.Prototype.inherit(dataViewMetadata);
            dataViewMetadataWithLabelsOnObject.objects = { labels: { show: true, labelPrecision: 0 } };

            var dataViewMetadataWithLabelsOffObject = powerbi.Prototype.inherit(dataViewMetadata);
            dataViewMetadataWithLabelsOffObject.objects = { labels: { show: false } };

            var dataViewMetadataWithDisplayUnitsObject = powerbi.Prototype.inherit(dataViewMetadata);
            dataViewMetadataWithDisplayUnitsObject.objects = { labels: { show: true, labelDisplayUnits: 1000, labelPrecision: 0 } };

            var dataViewMetadataWithDisplayUnitsAndPrecisionObject = powerbi.Prototype.inherit(dataViewMetadata);
            dataViewMetadataWithDisplayUnitsAndPrecisionObject.objects = { labels: { show: true, labelDisplayUnits: 1000, labelPrecision: 1 } };

            beforeEach(() => {
                powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
                element = powerbitests.helpers.testDom('500', '500');
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
                    interactivity: { isInteractiveLegend: interactiveChart },
                });
            });

            it('line chart show labels validation', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabelsOnObject,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabelsOnObject.columns[0],
                                values: ['a', 'b', 'c', 'd', 'e']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabelsOnObject.columns[1],
                                values: [500000, 495000, 490000, 480000, 500000],
                                subtotal: 246500
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    expect($('.lineChart .axisGraphicsContext .dataLabelsSVG .data-labels').length).toBeGreaterThan(0);
                    // First and last labels are hidden due to collision detection
                    expect($('.lineChart .axisGraphicsContext .dataLabelsSVG .data-labels').first().text()).toBe('495000');
                    done();
                }, DefaultWaitForRender);
            });

            it('line chart labels style validation', (done) => {
                var selectionId = SelectionId.createWithMeasure('col1');
                var key = selectionId.getKey();

                var color = colors.getColor(key).value;
                var opacity = '1';

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabelsOnObject,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabelsOnObject.columns[0],
                                values: ['a', 'b', 'c', 'd', 'e']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabelsOnObject.columns[1],
                                values: [500000, 495000, 490000, 480000, 500000],
                                subtotal: 246500
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    var fill = $('.lineChart .axisGraphicsContext .dataLabelsSVG .data-labels').first().css('fill');
                    expect(ColorUtility.convertFromRGBorHexToHex(fill)).toBe(ColorUtility.convertFromRGBorHexToHex(color).toLowerCase());
                    expect($('.lineChart .axisGraphicsContext .dataLabelsSVG .data-labels').first().css('fill-opacity')).toBe(opacity);
                    done();
                }, DefaultWaitForRender);
            });
            
            it('line chart labels custom style validation', (done) => {

                var color = { solid: { color: "rgb(255, 0, 0)" } }; // Red

                var dataViewMetadataWithLabelsFillObject = powerbi.Prototype.inherit(dataViewMetadata);
                dataViewMetadataWithLabelsFillObject.objects = { labels: { show: true, color: color } };

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabelsFillObject,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataWithLabelsFillObject.columns[0],
                                values: ['a', 'b', 'c', 'd', 'e']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabelsFillObject.columns[1],
                                values: [500000, 495000, 490000, 480000, 500000],
                                subtotal: 246500
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    var fill = $('.lineChart .axisGraphicsContext .dataLabelsSVG .data-labels').first().css('fill');
                    expect(ColorUtility.convertFromRGBorHexToHex(fill)).toBe(ColorUtility.convertFromRGBorHexToHex(color.solid.color));
                    done();
                }, DefaultWaitForRender);
            });

            it('line chart hide labels validation', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabelsOffObject,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: ['a', 'b', 'c', 'd', 'e']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabelsOffObject.columns[1],
                                values: [500000, 495000, 490000, 480000, 500000],
                                subtotal: 246500
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    expect($('.lineChart .axisGraphicsContext .dataLabelsSVG .data-labels').length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            });

            it('labels should support display units with no precision', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithDisplayUnitsObject,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: ['a', 'b', 'c', 'd', 'e']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabelsOffObject.columns[1],
                                values: [500123, 495000, 490000, 480000, 500000],
                                subtotal: 246500
                            }])
                        }
                    }]
                });

                setTimeout(() => {
                    expect($('.lineChart .axisGraphicsContext .dataLabelsSVG .data-labels').first().text()).toBe('500K');
                    done();
                }, DefaultWaitForRender);
            });

            it('labels should support display units with precision', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithDisplayUnitsAndPrecisionObject,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: ['a', 'b', 'c', 'd', 'e']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabelsOffObject.columns[1],
                                values: [500123, 495000, 490000, 480000, 500000],
                                subtotal: 246500
                            }])
                        }
                    }]
                });

                setTimeout(() => {
                    expect($('.lineChart .axisGraphicsContext .dataLabelsSVG .data-labels').first().text()).toBe('500.1K');
                    done();
                }, DefaultWaitForRender);
            });

            //multi series
            it('line chart data labels multi-series', (done) => {
                var seriesScopeIdentities = [mocks.dataViewScopeIdentity('col2'), mocks.dataViewScopeIdentity('col3')];
                var metadata: powerbi.DataViewMetadata = {
                    columns: [
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
                        }]
                };
                metadata.objects = { labels: { show: true } };
                var ids = [SelectionId.createWithMeasure('col1'), SelectionId.createWithMeasure('col2')];
                var keys = [ids[0].getKey(), ids[1].getKey()];

                var color0 = colors.getColor(keys[0]).value;
                var color1 = colors.getColor(keys[1]).value;

                var measureColumn: powerbi.DataViewMetadataColumn = { displayName: 'sales', isMeasure: true, type: DataShapeUtility.describeDataType(SemanticType.Integer) };
                var measureColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'sales' });
                var valueColumns = DataViewTransform.createValueColumns([
                    {
                        source: metadata.columns[1],
                        values: [110, 120, 130, 140, 150],
                        identity: seriesScopeIdentities[0],
                    }, {
                        source: metadata.columns[2],
                        values: [210, 220, 230, 240, 250],
                        identity: seriesScopeIdentities[1],
                    }],
                    [measureColumnRef]);
                valueColumns.source = measureColumn;
                v.onDataChanged({
                    dataViews: [{
                        metadata: metadata,
                        categorical: {
                            categories: [{
                                source: metadata.columns[0],
                                values: ['a', 'b', 'c', 'd', 'e'],
                                identityFields: [categoryColumnRef],
                            }],
                            values: valueColumns
                        }
                    }]
                });

                setTimeout(() => {
                    var fill0 = $('.lineChart .axisGraphicsContext .dataLabelsSVG .data-labels').first().css('fill');
                    expect(ColorUtility.convertFromRGBorHexToHex(fill0)).toBe(ColorUtility.convertFromRGBorHexToHex(color0).toLowerCase());

                    var fill1 = $('.lineChart .axisGraphicsContext .dataLabelsSVG .data-labels').last().css('fill');
                    expect(ColorUtility.convertFromRGBorHexToHex(fill1)).toBe(ColorUtility.convertFromRGBorHexToHex(color1).toLowerCase());

                    done();
                }, DefaultWaitForRender);

            });

            it('line chart data labels multi-series to one series', (done) => {
                var seriesScopeIdentities = [mocks.dataViewScopeIdentity('col2'), mocks.dataViewScopeIdentity('col3')];
                var metadata: powerbi.DataViewMetadata = {
                    columns: [
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
                        }]
                };
                metadata.objects = { labels: { show: true } };
                var ids = [SelectionId.createWithMeasure('col1'), SelectionId.createWithMeasure('col2')];
                var keys = [ids[0].getKey(), ids[1].getKey()];

                var color0 = colors.getColor(keys[0]).value;

                var measureColumn: powerbi.DataViewMetadataColumn = { displayName: 'sales', isMeasure: true, type: DataShapeUtility.describeDataType(SemanticType.Integer) };
                var measureColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'sales' });
                var valueColumns = DataViewTransform.createValueColumns([
                    {
                        source: metadata.columns[1],
                        values: [110, 120, 130, 140, 150],
                        identity: seriesScopeIdentities[0],
                    }, {
                        source: metadata.columns[2],
                        values: [210, 220, 230, 240, 250],
                        identity: seriesScopeIdentities[1],
                    }],
                    [measureColumnRef]);
                valueColumns.source = measureColumn;
                v.onDataChanged({
                    dataViews: [{
                        metadata: metadata,
                        categorical: {
                            categories: [{
                                source: metadata.columns[0],
                                values: ['a', 'b', 'c', 'd', 'e'],
                                identityFields: [categoryColumnRef],
                            }],
                            values: valueColumns
                        }
                    }]
                });

                //to one series
                var valueColumns2 = DataViewTransform.createValueColumns([
                    {
                        source: metadata.columns[1],
                        values: [110, 120, 130, 140, 150],
                        identity: seriesScopeIdentities[0],
                    }],
                    [measureColumnRef]);
                valueColumns2.source = measureColumn;
                v.onDataChanged({
                    dataViews: [{
                        metadata: metadata,
                        categorical: {
                            categories: [{
                                source: metadata.columns[0],
                                values: ['a', 'b', 'c', 'd', 'e'],
                                identityFields: [categoryColumnRef],
                            }],
                            values: valueColumns2
                        }
                    }]
                });

                setTimeout(() => {
                    var fill0 = $('.lineChart .axisGraphicsContext .dataLabelsSVG .data-labels').first().css('fill');
                    expect(ColorUtility.convertFromRGBorHexToHex(fill0)).toBe(ColorUtility.convertFromRGBorHexToHex(color0).toLowerCase());

                    var fill1 = $('.lineChart .axisGraphicsContext .dataLabelsSVG .data-labels').last().css('fill');
                    expect(ColorUtility.convertFromRGBorHexToHex(fill1)).toBe(ColorUtility.convertFromRGBorHexToHex(color0).toLowerCase());

                    done();
                }, DefaultWaitForRender);

            });

            it('line chart with nulls dom validation', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabelsOnObject,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: ['a', 'b', 'c', 'd', 'e']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: [null, 10, null, 15, null],
                                subtotal: 20
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    // One label is hidden due to collision detection
                    expect($('.lineChart .axisGraphicsContext .dataLabelsSVG .data-labels').length).toBe(1);
                    done();
                }, DefaultWaitForRender);
            });

            it('change line chart dom data label validation', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabelsOnObject,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: ['a', 'b', 'c', 'd', 'e']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadataWithLabelsOnObject.columns[1],
                                values: [500000, 495000, 490000, 480000, 500000],
                            }])
                        }
                    }]
                });

                setTimeout(() => {
                    expect($('.lineChart .axisGraphicsContext .dataLabelsSVG .data-labels').length).toBe(3);
                    // First and last labels are hidden due to collision detection
                    expect($('.lineChart .axisGraphicsContext .dataLabelsSVG .data-labels').first().text()).toBe('495000');

                    v.onDataChanged({
                        dataViews: [{
                            metadata: dataViewMetadataWithLabelsOnObject,
                            categorical: {
                                categories: [{
                                    source: dataViewMetadata.columns[0],
                                    values: ['q', 'w', 'r', 't']
                                }],
                                values: DataViewTransform.createValueColumns([{
                                    source: dataViewMetadataWithLabelsOnObject.columns[1],
                                    values: [400, 500, 300, 200],
                                }])
                            }
                        }]
                    });

                    setTimeout(() => {
                        // One label is hidden due to collision detection
                        expect($('.lineChart .axisGraphicsContext .dataLabelsSVG .data-labels').length).toBe(3);
                        expect($('.lineChart .axisGraphicsContext .dataLabelsSVG .data-labels').first().text()).toBe('400');
                        done();
                    }, DefaultWaitForRender);
                }, DefaultWaitForRender);
            });

            it('line chart non-category multi-measure dom data label validation', (done) => {
                var metadata: powerbi.DataViewMetadata = {
                    columns: [
                        { displayName: 'col1', isMeasure: true, type: DataShapeUtility.describeDataType(SemanticType.Number) },
                        { displayName: 'col2', isMeasure: true, type: DataShapeUtility.describeDataType(SemanticType.Number) }
                    ]
                };
                metadata.objects = { labels: { show: true } };
                v.onDataChanged({
                    dataViews: [{
                        metadata: metadata,
                        categorical: {
                            values: DataViewTransform.createValueColumns([
                                {
                                    source: dataViewMetadata.columns[0],
                                    values: [100]
                                }, {
                                    source: dataViewMetadata.columns[1],
                                    values: [200]
                                }])
                        }
                    }]
                });
                setTimeout(() => {
                    // One label is hidden due to collision detection
                    expect($('.lineChart .axisGraphicsContext .dataLabelsSVG .data-labels').length).toBe(1);
                    done();
                }, DefaultWaitForRender);
            });

            //empty dom
            it('empty line chart dom data labels validation', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabelsOnObject,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: []
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: []
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    expect($('.lineChart .axisGraphicsContext .dataLabelsSVG .data-labels').length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            });

            //One point
            it('line chart with single point dom data label validation', (done) => {
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataWithLabelsOnObject,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: ['a']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: [4]
                            }])
                        }
                    }]
                });
                setTimeout(() => {
                    expect($('.lineChart .axisGraphicsContext .dataLabelsSVG .data-labels').text()).toBe('4');
                    done();
                }, DefaultWaitForRender);
            });

        }

        describe("lineChart Data Labels validation", () => lineChartDataLabelsValidation(false));

        describe("interactive lineChart Data Labels validation", () => lineChartDataLabelsValidation(true));
    });

    describe("Line Chart Legend Formatting", () => {
        var hostServices = powerbitests.mocks.createVisualHostServices();
        var v: powerbi.IVisual, element: JQuery;
        var dataViewMetadata: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    format: 'd',
                    type: DataShapeUtility.describeDataType(SemanticType.Date)
                }, {
                    displayName: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                }],
        };

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
            element = powerbitests.helpers.testDom('500', '500');
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
                interactivity: { isInteractiveLegend: true },
            });

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: [new Date("Thu Dec 18 2014 00:08:00"),
                                new Date("Thu Dec 19 2014 00:20:00"),
                                new Date("Thu Dec 20 2014 00:11:00")]
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [500000, 495000, 490000],
                            subtotal: 246500
                        }])
                    }
                }]
            });
        });

        it('verify legend formatted as date', () => {
            // verify legend was changed to correct values
            var legend = $('.interactive-legend');
            var title = legend.find('.title');

            expect(legend.length).toBe(1);
            expect(title.text().trim()).toBe('12/18/2014');
        });
    });

    describe("Line Chart Interactivity", () => {
        var hostServices = powerbitests.mocks.createVisualHostServices();
        var v: powerbi.IVisual, element: JQuery;
        var dataViewMetadata: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                }, {
                    displayName: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Integer)
                }],
            objects: {
                labels: {
                    show: true,
                    labelPrecision: 0,
                }
            }
        };

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
            element = powerbitests.helpers.testDom('500', '500');
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
                interactivity: { isInteractiveLegend: true },
            });

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
                            subtotal: 246500
                        }])
                    }
                }]
            });
        });

        it('line chart drag and click interaction validation', () => {
            var lineChart = (<any>v).layers[0];

            var mainGraphicsContext: any = $('.mainGraphicsContext');
            expect(mainGraphicsContext.length).toBe(1);
            // instead of clicking on the graph, which can be unstable due to different user's configurations
            // we will validate that the code knows how to deal with such a click
            var calculatedIndex = lineChart.findIndex(250);
            expect(calculatedIndex).toBe(2);
        });

        it('select column validation', () => {
            var lineChart = (<any>v).layers[0];

            spyOn(lineChart, 'setHoverLine').and.callThrough();;

            // trigger select column
            lineChart.selectColumn(2);

            // verify legend was changed to correct values
            var legend = $('.interactive-legend');
            var title = legend.find('.title');
            var item = legend.find('.item');
            var hoverLine = $('.hover-line');

            expect(legend.length).toBe(1);
            expect(title.text().trim()).toBe('c');

            expect(item.find('.itemName').text()).toBe('col2');
            expect(item.find('.itemMeasure').text().trim()).toBe('490000');
            expect(lineChart.setHoverLine).toHaveBeenCalled();
            var arg = lineChart.setHoverLine.calls ? lineChart.setHoverLine.calls.allArgs()[0][0] : 193;
            expect(Math.floor(arg) === 192 || arg === 193).toBeTruthy();
            expect(hoverLine.length).toBe(1);
        });
    });

    describe("Line Chart Interactivity - Creation", () => {
        var hostServices = powerbitests.mocks.createVisualHostServices();
        var v: powerbi.IVisual, element: JQuery;
        var dataViewMetadata: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                }, {
                    displayName: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                }],
        };

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
            element = powerbitests.helpers.testDom('500', '500');
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
                interactivity: { isInteractiveLegend: true },
            });

            // Invoke onDataChange to force creation of chart layers.
            v.onDataChanged({ dataViews: [] });
        });

        it('select column validation', () => {
            var lineChart = (<any>v).layers[0];

            spyOn(lineChart, 'selectColumn').and.callThrough();

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
                            subtotal: 246500
                        }])
                    }
                }]
            });

            var hoverLine = $('.hover-line');

            expect(lineChart.selectColumn).toHaveBeenCalledWith(0, true);
            expect(hoverLine.length).toBe(1);
        });
    });

    describe("Enumerate Objects", () => {
        var v: powerbi.IVisual, element: JQuery;
        var dataViewMetadata: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                }, {
                    displayName: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                },
                {
                    displayName: 'col3',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                },
                {
                    displayName: 'col4',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                }],
        };
        
        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
        });

        beforeEach(() => {
            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('lineChart').create();

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

        it('Check basic enumeration', (done) => {
            var dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['a', 'b', 'c'],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata.columns[1],
                                values: [100, 200, 300, 400, 500]
                            }, {
                                source: dataViewMetadata.columns[2],
                                values: [200, 400, 600, 800, 1000]
                            }, {
                                source: dataViewMetadata.columns[3],
                                values: [1, 2, 3, 4, 5]
                            }])
                    }
                }]
            };

            v.onDataChanged(dataChangedOptions);

            setTimeout(() => {
                var points = v.enumerateObjectInstances({ objectName: 'dataPoint' });
                expect(points.length).toBe(3);
                expect(points[0].displayName).toEqual('col2');
                expect(points[0].properties['fill']).toBeDefined();
                expect(points[1].displayName).toEqual('col3');
                expect(points[1].properties['fill']).toBeDefined();
                done();
            }, DefaultWaitForRender);
        });
    });

    describe("Line Chart Scrollbar Validation",() => {
        var hostServices = powerbitests.mocks.createVisualHostServices();
        var v: powerbi.IVisual, element: JQuery;
        var dataViewMetadata: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                }, {
                    displayName: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Integer)
                }],
        };

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
            element = powerbitests.helpers.testDom('150', '50');
            v = powerbi.visuals.visualPluginFactory.createMinerva({
                heatMap: false,
                scrollableVisuals: true,
            }).getPlugin('lineChart').create();

            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { isInteractiveLegend: true },
            });

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [500000, 495000, 490000, 480000, 500000, 500000, 500000, 500000, 500000],
                            subtotal: 246500
                        }])
                    }
                }]
            });
        });

        it('Line Chart Scrollbar DOM Validation', (done) => {
            setTimeout(() => {
                expect($('.lineChart')).toBeInDOM();
                expect($('rect.extent').length).toBe(1);
                var transform = SVGUtil.parseTranslateTransform($('.lineChart .axisGraphicsContext .x.axis .tick').last().attr('transform'));
                expect(transform.x).toBeLessThan(element.width());
                expect($('.brush').first().attr('transform').split(',')[0].split('(')[1]).toBe('19');
                expect($('.brush').first().attr('transform').split(',')[1].split(')')[0]).toBe('75');
                expect(parseInt($('.brush .extent')[0].attributes.getNamedItem('width').value, 0)).toBeGreaterThan(1);
                expect($('.brush .extent')[0].attributes.getNamedItem('x').value).toBe('0');
                done();
            }, DefaultWaitForRender);
        });

        describe("xAxis Validations",() => {
            var path;
            var points: powerbitests.helpers.Point[];
            var gap;
            var lastIndex;
            var v: powerbi.IVisual, element: JQuery;
            var dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    {
                        displayName: 'col1',
                        type: DataShapeUtility.describeDataType(SemanticType.Number)
                    }, {
                        displayName: 'col2',
                        isMeasure: true,
                        type: DataShapeUtility.describeDataType(SemanticType.Number)
                    },
                    {
                        displayName: 'col3',
                        isMeasure: true,
                        type: DataShapeUtility.describeDataType(SemanticType.Number)
                    }],
            };
            var nonNumericDataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    {
                        displayName: 'col1',
                        type: DataShapeUtility.describeDataType(SemanticType.String)
                    }, {
                        displayName: 'col2',
                        isMeasure: true,
                        type: DataShapeUtility.describeDataType(SemanticType.Number)
                    },
                    {
                        displayName: 'col3',
                        isMeasure: true,
                        type: DataShapeUtility.describeDataType(SemanticType.Number)
                    }],
            };

            beforeEach(() => {
                powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
            });

            beforeEach(() => {
                element = powerbitests.helpers.testDom('500', '500');
                v = powerbi.visuals.visualPluginFactory.create().getPlugin('lineChart').create();

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

            function setAxis(xType: any) { //TODO: Change it, to only set Axis values
                points = [];
                dataViewMetadata.objects = {
                    categoryAxis: {
                        show: true,
                        start: 0,
                        end: 25,
                        axisType: xType,
                        showAxisTitle: true,
                        axisStyle: true
                    }
                };
                var dataChangedOptions = {
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: [1, 2, 5, 10, 20],
                            }],
                            values: DataViewTransform.createValueColumns([
                                {
                                    source: dataViewMetadata.columns[1],
                                    values: [100, 200, 300, 400, 500]
                                }, {
                                    source: dataViewMetadata.columns[2],
                                    values: [200, 400, 600, 800, 1000]
                                }])
                        }
                    }]
                };

                v.onDataChanged(dataChangedOptions);

                path = $('.line').first().attr('d');
                var dots = path.split('L');
                dots[0] = dots[0].substr(1);

                for (var i = 0; i < dots.length; i++) {
                    var strPoint = dots[i].split(',');
                    var point: powerbitests.helpers.Point = { x: strPoint[0], y: strPoint[1] };
                    points.push(point);
                }

                gap = +points[1].x - +points[0].x;
                lastIndex = points.length - 1;
            }

            it('Category vs Scalar Check',() => {

                setAxis(AxisType.scalar);

                expect(+points[lastIndex].x - +points[lastIndex - 1].x).toBeGreaterThan(gap);

                setAxis(AxisType.categorical);

                expect(+points[lastIndex].x - +points[lastIndex - 1].x).toBeCloseTo(gap, 2);
            });

            it('enumerateObjectInstances: Verify instances on ordinal category axis',() => {

                dataViewMetadata.objects = {
                    categoryAxis: {
                        show: true,
                        start: 0,
                        end: 25,
                        axisType: AxisType.scalar,
                        showAxisTitle: true,
                        axisStyle: true
                    }
                };

                v.onDataChanged({
                    dataViews: [{
                        metadata: nonNumericDataViewMetadata,
                        categorical: {
                            categories: [{
                                source: nonNumericDataViewMetadata.columns[0],
                                values: ['a', 'b', 'c', 'd', 'e']
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: nonNumericDataViewMetadata.columns[1],
                                values: [1, 2, 3, 4, 5],
                                subtotal: 15
                            },
                                {
                                    source: nonNumericDataViewMetadata.columns[1],
                                    values: [1, 2, 3, 4, 5],
                                    subtotal: 15
                                }])
                        }
                    }]
                });
                var points = v.enumerateObjectInstances({ objectName: 'categoryAxis' });

                expect(points[0].properties['start']).toBeUndefined();
                expect(points[0].properties['end']).toBeUndefined();
                expect(points[0].properties['axisType']).toBeUndefined();

                expect(points[0].properties['show']).toBeDefined;
                expect(points[0].properties['showAxisTitle']).toBeDefined;
                expect(points[0].properties['axisStyle']).toBeDefined;
            });

            it('enumerateObjectInstances: Verify instances on numerical category axis',() => {

                dataViewMetadata.objects = {
                    categoryAxis: {
                        show: true,
                        start: 0,
                        end: 25,
                        axisType: AxisType.scalar,
                        showAxisTitle: true,
                        axisStyle: true
                    }
                };

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadata,
                        categorical: {
                            categories: [{
                                source: dataViewMetadata.columns[0],
                                values: [1, 2, 3, 4, 5]
                            }],
                            values: DataViewTransform.createValueColumns([{
                                source: dataViewMetadata.columns[1],
                                values: [1, 2, 3, 4, 5],
                                subtotal: 15
                            },
                                {
                                    source: dataViewMetadata.columns[1],
                                    values: [1, 2, 3, 4, 5],
                                    subtotal: 15
                                }])
                        }
                    }]
                });
                var points = v.enumerateObjectInstances({ objectName: 'categoryAxis' });

                expect(points[0].properties['start']).toBeDefined();
                expect(points[0].properties['end']).toBeDefined();
                expect(points[0].properties['axisType']).toBeDefined();

                expect(points[0].properties['show']).toBeDefined;
                expect(points[0].properties['showAxisTitle']).toBeDefined;
                expect(points[0].properties['axisStyle']).toBeDefined;
            });
        });
    });

    describe("Area Chart Scrollbar Validation",() => {
        var hostServices = powerbitests.mocks.createVisualHostServices();
        var v: powerbi.IVisual, element: JQuery;
        var dataViewMetadata: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                }, {
                    displayName: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Integer)
                }],
        };

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
            element = powerbitests.helpers.testDom('150', '50');
            v = powerbi.visuals.visualPluginFactory.createMinerva({
                heatMap: false,
                scrollableVisuals: true,
            }).getPlugin('areaChart').create();

            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { isInteractiveLegend: true },
            });

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [500000, 495000, 490000, 480000, 500000, 500000, 500000, 500000, 500000],
                            subtotal: 246500
                        }])
                    }
                }]
            });
        });

        it('Area Chart Scrollbar DOM Validation',(done) => {
            setTimeout(() => {
                expect($('.catArea')).toBeInDOM();
                expect($('rect.extent').length).toBe(1);
                var transform = SVGUtil.parseTranslateTransform($('.lineChart .axisGraphicsContext .x.axis .tick').last().attr('transform'));
                expect(transform.x).toBeLessThan(element.width());
                expect($('.brush').first().attr('transform').split(',')[0].split('(')[1]).toBe('19');
                expect($('.brush').first().attr('transform').split(',')[1].split(')')[0]).toBe('75');
                expect(parseInt($('.brush .extent')[0].attributes.getNamedItem('width').value, 0)).toBeGreaterThan(1);
                expect($('.brush .extent')[0].attributes.getNamedItem('x').value).toBe('0');
                done();
            }, DefaultWaitForRender);
        });
    });

    describe("Line Chart Tooltips", () => {
        var hostServices = powerbitests.mocks.createVisualHostServices();
        var v: powerbi.IVisual, element: JQuery;

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
            element = powerbitests.helpers.testDom('500', '500');
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
                interactivity: { isInteractiveLegend: true },
            });

            // Invoke onDataChange to force creation of chart layers.
            v.onDataChanged({ dataViews: [] });
        });

        it('Scalar xAxis - closest data point', () => {
            var dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    {
                        displayName: 'col1',
                        type: DataShapeUtility.describeDataType(SemanticType.Number)
                    }, {
                        displayName: 'col2',
                        isMeasure: true,
                        type: DataShapeUtility.describeDataType(SemanticType.Number)
                    }],
            };
            var categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'col1' });
            var lineChart = (<any>v).layers[0];

            spyOn(lineChart, 'selectColumn').and.callThrough();

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: [2001, 2002, 2003, 2004, 2005],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [500000, 495000, 490000, 480000, 500000],
                            subtotal: 246500
                        }])
                    }
                }]
            });

            var lineChart = (<any>v).layers[0];
            var pointX: number = 10; 
            var dataPoint = lineChart.data.series[0];
            var tooltipInfo: powerbi.visuals.TooltipDataItem[] = LineChart.getTooltipInfoByPointX(lineChart, dataPoint, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: '2001' }, { displayName: 'col2', value: '500000' }]);

            pointX = 120;
            tooltipInfo = LineChart.getTooltipInfoByPointX(lineChart, dataPoint, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: '2002' }, { displayName: 'col2', value: '495000' }]);

            pointX = 303;
            tooltipInfo = LineChart.getTooltipInfoByPointX(lineChart, dataPoint, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: '2004' }, { displayName: 'col2', value: '480000' }]);

            pointX = 450;
            tooltipInfo = LineChart.getTooltipInfoByPointX(lineChart, dataPoint, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: '2005' }, { displayName: 'col2', value: '500000' }]);
        });

        it('Scalar xAxis, multi series - closest data point', () => {
            var dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    {
                        displayName: 'col1',
                        type: DataShapeUtility.describeDataType(SemanticType.Number)
                    }, {
                        displayName: 'col2',
                        isMeasure: true,
                        type: DataShapeUtility.describeDataType(SemanticType.Number)
                    },
                    {
                        displayName: 'col3',
                        type: DataShapeUtility.describeDataType(SemanticType.Number),
                        isMeasure: true
                    }],
            };

            var seriesIdentities = [
                mocks.dataViewScopeIdentity('col2'),
                mocks.dataViewScopeIdentity('col3'),
            ];

            var measureColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'col2' });

            var valueColumns = DataViewTransform.createValueColumns([
                {
                    source: dataViewMetadata.columns[1],
                    values: [500000, 495000, 490000, 480000, 500000],
                    identity: seriesIdentities[0],
                }, {
                    source: dataViewMetadata.columns[2],
                    values: [null, null, 490000, 480000, 500000],
                    identity: seriesIdentities[1],
                }],
                [measureColumnRef]);
            valueColumns.source = dataViewMetadata.columns[2];

            var dataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: [2001, 2002, 2003, 2004, 2005]
                    }],
                    values: valueColumns
                }
            };

            var lineChart = (<any>v).layers[0];

            spyOn(lineChart, 'selectColumn').and.callThrough();

            v.onDataChanged({
                dataViews: [dataView]
            });
            
            var pointX: number = 10;
            var dataPoint = lineChart.data.series[0];
            var tooltipInfo: powerbi.visuals.TooltipDataItem[] = LineChart.getTooltipInfoByPointX(lineChart, dataPoint, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: '2001' }, { displayName: 'col3', value: '(Blank)' }, { displayName: 'col2', value: '500000' }]);

            pointX = 120;
            tooltipInfo = LineChart.getTooltipInfoByPointX(lineChart, dataPoint, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: '2002' }, { displayName: 'col3', value: '(Blank)' }, { displayName: 'col2', value: '495000' }]);

            pointX = 303;
            tooltipInfo = LineChart.getTooltipInfoByPointX(lineChart, dataPoint, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: '2004' }, { displayName: 'col3', value: '(Blank)' }, { displayName: 'col2', value: '480000' }]);

            pointX = 450;
            tooltipInfo = LineChart.getTooltipInfoByPointX(lineChart, dataPoint, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: '2005' }, { displayName: 'col3', value: '(Blank)' }, { displayName: 'col2', value: '500000' }]);
        });

        it('Line Chart X and Y-axis show/hide Title ', () => {

            var element = powerbitests.helpers.testDom('500', '500');
            var hostServices = powerbitests.mocks.createVisualHostServices();
            var categoryIdentities = [mocks.dataViewScopeIdentity("John Domo")];
            var v = powerbi.visuals.visualPluginFactory.create().getPlugin('lineChart').create();
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

        it('Non scalar xAxis - closest data point', () => {
            var dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    {
                        displayName: 'col1',
                        type: DataShapeUtility.describeDataType(SemanticType.String)
                    }, {
                        displayName: 'col2',
                        isMeasure: true,
                        type: DataShapeUtility.describeDataType(SemanticType.Number)
                    }],
            };
            var lineChart = (<any>v).layers[0];

            spyOn(lineChart, 'selectColumn').and.callThrough();

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
                            subtotal: 246500
                        }])
                    }
                }]
            });

            var lineChart = (<any>v).layers[0];
            var pointX: number = 10;
            var dataPoint = lineChart.data.series[0];
            var tooltipInfo: powerbi.visuals.TooltipDataItem[] = LineChart.getTooltipInfoByPointX(lineChart, dataPoint, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: 'a' }, { displayName: 'col2', value: '500000' }]);

            pointX = 120;
            tooltipInfo = LineChart.getTooltipInfoByPointX(lineChart, dataPoint, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: 'b' }, { displayName: 'col2', value: '495000' }]);

            pointX = 303;
            tooltipInfo = LineChart.getTooltipInfoByPointX(lineChart, dataPoint, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: 'd' }, { displayName: 'col2', value: '480000' }]);

            pointX = 450;
            tooltipInfo = LineChart.getTooltipInfoByPointX(lineChart, dataPoint, pointX);
            expect(tooltipInfo).toEqual([{ displayName: 'col1', value: 'e' }, { displayName: 'col2', value: '500000' }]);
        });
    });
}