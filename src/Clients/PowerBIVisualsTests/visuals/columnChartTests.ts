//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbitests {
    import DataViewSelfCrossJoin = powerbi.data.DataViewSelfCrossJoin;
    import DataViewTransform = powerbi.data.DataViewTransform;
    import ColumnChart = powerbi.visuals.ColumnChart;
    import DataShapeUtility = powerbi.data.dsr.DataShapeUtility;
    import DataViewObjects = powerbi.DataViewObjects;
    import SemanticType = powerbi.data.SemanticType;
    import ClusteredUtil = powerbi.visuals.ClusteredUtil;
    import StackedUtil = powerbi.visuals.StackedUtil;
    import ColumnUtil = powerbi.visuals.ColumnUtil;
    import AxisHelper = powerbi.visuals.AxisHelper;
    import ValueType = powerbi.ValueType;
    import SelectionId = powerbi.visuals.SelectionId;
    import PrimitiveType = powerbi.PrimitiveType;
    import Prototype = powerbi.Prototype;
    import CompiledDataViewMapping = powerbi.data.CompiledDataViewMapping;
    import CartesianChart = powerbi.visuals.CartesianChart;
    import SVGUtil = powerbi.visuals.SVGUtil;
    import AxisType = powerbi.axisType;
    import ColorUtility = powerbitests.utils.ColorUtility;
    import SQExprShortSerializer = powerbi.data.SQExprShortSerializer;

    var DefaultWaitForRender = 10;

    describe("ColumnChart",() => {
        var categoryColumn: powerbi.DataViewMetadataColumn = { name: 'year', queryName: 'selectYear', type: DataShapeUtility.describeDataType(SemanticType.String) };
        var measureColumn: powerbi.DataViewMetadataColumn = { name: 'sales', queryName: 'selectSales', isMeasure: true, type: DataShapeUtility.describeDataType(SemanticType.Integer), objects: { general: { formatString: '$0' } } };
        var measure2Column: powerbi.DataViewMetadataColumn = { name: 'tax', queryName: 'selectTax', isMeasure: true, type: DataShapeUtility.describeDataType(SemanticType.Number) };
        var measure3Column: powerbi.DataViewMetadataColumn = { name: 'profit', queryName: 'selectProfit', isMeasure: true, type: DataShapeUtility.describeDataType(SemanticType.Number) };
        var nullMeasureColumn: powerbi.DataViewMetadataColumn = { name: null, queryName: 'selectNull', isMeasure: true, type: DataShapeUtility.describeDataType(SemanticType.Number) };
        var measureWithFormatString: powerbi.DataViewMetadataColumn = { name: 'tax', queryName: 'selectTax', isMeasure: true, type: DataShapeUtility.describeDataType(SemanticType.Number), format: '$0' };

        var measureColumnDynamic1: powerbi.DataViewMetadataColumn = { name: 'sales', queryName: 'selectSales', isMeasure: true, type: DataShapeUtility.describeDataType(SemanticType.Integer), objects: { general: { formatString: '$0' } }, groupName: 'A' };
        var measureColumnDynamic2: powerbi.DataViewMetadataColumn = { name: 'sales', queryName: 'selectSales', isMeasure: true, type: DataShapeUtility.describeDataType(SemanticType.Integer), objects: { general: { formatString: '$0' } }, groupName: 'B' };
        var measureColumnDynamic1RefExpr = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'sales' });

        it('ColumnChart registered capabilities',() => {
            expect(JSON.stringify(powerbi.visuals.visualPluginFactory.create().getPlugin('columnChart').capabilities)).toBe(JSON.stringify(powerbi.visuals.getColumnChartCapabilities()));
        });

        it('ColumnChart registered customizeQuery',() => {
            expect(powerbi.visuals.visualPluginFactory.create().getPlugin('columnChart').customizeQuery).toBe(ColumnChart.customizeQuery);
        });

        it('Capabilities should include dataViewMappings',() => {
            expect(powerbi.visuals.getColumnChartCapabilities().dataViewMappings).toBeDefined();
        });

        it('Capabilities should include dataRoles',() => {
            expect(powerbi.visuals.getColumnChartCapabilities().dataRoles).toBeDefined();
        });

        it('Capabilities should not suppressDefaultTitle',() => {
            expect(powerbi.visuals.getColumnChartCapabilities().suppressDefaultTitle).toBeUndefined();
        });

        it('FormatString property should match calculated',() => {
            expect(powerbi.data.DataViewObjectDescriptors.findFormatString(powerbi.visuals.getColumnChartCapabilities().objects)).toEqual(powerbi.visuals.columnChartProps.general.formatString);
        });

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
        });

        it('CustomizeQuery scalar type, no scalar axis flag',() => {
            var objects: DataViewObjects = {
                categoryAxis: {
                    axisType: null
                }
            };
            var dataViewMapping = createCompiledDataViewMapping(ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.DateTime), objects);

            ColumnChart.customizeQuery({
                dataViewMappings: [dataViewMapping]
            });

            expect(dataViewMapping.categorical.categories.dataReductionAlgorithm).toEqual({ top: {} });
        });

        it('CustomizeQuery non-scalar type, scalar axis flag',() => {
            var objects: DataViewObjects = {
                categoryAxis: {
                    axisType: 'Scalar',
                }
            };
            var dataViewMapping = createCompiledDataViewMapping(ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text), objects);

            ColumnChart.customizeQuery({
                dataViewMappings: [dataViewMapping]
            });

            expect(dataViewMapping.categorical.categories.dataReductionAlgorithm).toEqual({ top: {} });
        });

        it('CustomizeQuery scalar type, scalar axis flag',() => {
            var objects: DataViewObjects = {
                categoryAxis: {
                    axisType: 'Scalar',
                }
            };
            var dataViewMapping = createCompiledDataViewMapping(ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.DateTime), objects);

            ColumnChart.customizeQuery({
                dataViewMappings: [dataViewMapping]
            });

            expect(dataViewMapping.categorical.categories.dataReductionAlgorithm).toEqual({ sample: {} });
        });

        it('CustomizeQuery no category',() => {
            var objects: DataViewObjects = {
                categoryAxis: {
                    axisType: 'Scalar',
                }
            };
            var dataViewMapping = createCompiledDataViewMapping(null, objects);

            ColumnChart.customizeQuery({
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
            var dataViewMapping = createCompiledDataViewMapping(null, objects);

            expect(ColumnChart.getSortableRoles({
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

            expect(ColumnChart.getSortableRoles({
                dataViewMappings: [dataViewMapping]
            })).toEqual(['Category', 'Y']);
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

        it('has positive measure',() => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            var dataView: powerbi.DataViewCategorical = {
                categories: [{
                    source: categoryColumn,
                    values: [2011, 2012],
                    identity: categoryIdentities,
                }],
                values: DataViewTransform.createValueColumns([{
                    source: measureColumn,
                    values: [100, 200]
                }])
            };
            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;

            // We should not summarize the X-axis values with DisplayUnits per-PowerView behavior, so ensure that we are using the 'Verbose' mode for the formatter.
            spyOn(powerbi.visuals.valueFormatter, 'create').and.callThrough();
            var data = ColumnChart.converter(dataView, colors);
            var selectionIds: SelectionId[] = [SelectionId.createWithIdAndMeasure(categoryIdentities[0], measureColumn.queryName), SelectionId.createWithIdAndMeasure(categoryIdentities[1], measureColumn.queryName)];

            expect(powerbi.visuals.valueFormatter.create).toHaveBeenCalledWith({ format: undefined, value: 2011, value2: 2012, displayUnitSystemType: powerbi.DisplayUnitSystemType.Verbose });
            var legendItems = data.legendData.dataPoints;
            expect(legendItems.length).toBe(1);
            expect(data.series).toEqual([{
                key: 'series0', index: 0, displayName: 'sales', identity: SelectionId.createWithMeasure("selectSales"), data: [
                    {
                        categoryValue: 2011,
                        value: 100,
                        position: 100,
                        valueAbsolute: 100,
                        valueOriginal: 100,
                        seriesIndex: 0,
                        showLabel: true,
                        labelFill: legendItems[0].color,
                        categoryIndex: 0,
                        color: legendItems[0].color,
                        selected: false,
                        originalValue: 100,
                        originalPosition: 100,
                        originalValueAbsolute: 100,
                        identity: selectionIds[0],
                        key: selectionIds[0].getKey(),
                        tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "$100" }],
                    }, {
                        categoryValue: 2012,
                        value: 200,
                        position: 200,
                        valueAbsolute: 200,
                        valueOriginal: 200,
                        seriesIndex: 0,
                        showLabel: true,
                        labelFill: legendItems[0].color,
                        categoryIndex: 1,
                        color: legendItems[0].color,
                        selected: false,
                        originalValue: 200,
                        originalPosition: 200,
                        originalValueAbsolute: 200,
                        identity: selectionIds[1],
                        key: selectionIds[1].getKey(),
                        tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "$200" }],
                    }
                ]
            }]);
            expect(AxisHelper.createValueDomain(data.series, true)).toEqual([0, 200]);
            expect(StackedUtil.calcValueDomain(data.series, /*is100Pct*/ false)).toEqual({
                min: 0,
                max: 200
            });
        });

        it('has positive measure (100%)',() => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            var dataView: powerbi.DataViewCategorical = {
                categories: [{
                    source: categoryColumn,
                    values: [2011, 2012],
                    identity: categoryIdentities,
                }],
                values: DataViewTransform.createValueColumns([{
                    source: measureColumn,
                    values: [100, 200]
                }])
            };
            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;

            var data = ColumnChart.converter(dataView, colors, true);
            var selectionIds: SelectionId[] = [
                SelectionId.createWithIdAndMeasure(categoryIdentities[0], measureColumn.queryName),
                SelectionId.createWithIdAndMeasure(categoryIdentities[1], measureColumn.queryName)];

            var legendItems = data.legendData.dataPoints;
            expect(legendItems.length).toBe(1);
            expect(data.series).toEqual([{
                key: 'series0', index: 0, displayName: 'sales', identity: SelectionId.createWithMeasure("selectSales"), data: [
                    {
                        categoryValue: 2011,
                        value: 1,
                        position: 1,
                        valueAbsolute: 1,
                        valueOriginal: 100,
                        seriesIndex: 0,
                        showLabel: true,
                        labelFill: legendItems[0].color,
                        categoryIndex: 0,
                        color: legendItems[0].color,
                        selected: false,
                        originalValue: 1,
                        originalPosition: 1,
                        originalValueAbsolute: 1,
                        identity: selectionIds[0],
                        key: selectionIds[0].getKey(),
                        tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "$1" }]
                    },
                    {
                        categoryValue: 2012,
                        value: 1,
                        position: 1,
                        valueAbsolute: 1,
                        valueOriginal: 200,
                        seriesIndex: 0,
                        showLabel: true,
                        labelFill: legendItems[0].color,
                        categoryIndex: 1,
                        color: legendItems[0].color,
                        selected: false,
                        originalValue: 1,
                        originalPosition: 1,
                        originalValueAbsolute: 1,
                        identity: selectionIds[1],
                        key: selectionIds[1].getKey(),
                        tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "$1" }]
                    }
                ]
            }]);
            expect(StackedUtil.calcValueDomain(data.series, /*is100Pct*/ true)).toEqual({
                min: 0,
                max: 1
            });
        });

        it('has positive measure - two series (100%)',() => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            var dataView: powerbi.DataViewCategorical = {
                categories: [{
                    source: categoryColumn,
                    values: [2011, 2012],
                    identity: categoryIdentities,
                }],
                values: DataViewTransform.createValueColumns([{
                    source: measureColumn,
                    values: [100, 200],
                },
                    {
                        source: measure2Column,
                        values: [60, 50],
                    }])
            };
            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;

            var data = ColumnChart.converter(dataView, colors, true);
            var selectionIds: SelectionId[] = [
                SelectionId.createWithIdAndMeasure(categoryIdentities[0], "selectSales"),
                SelectionId.createWithIdAndMeasure(categoryIdentities[1], "selectSales"),
                SelectionId.createWithIdAndMeasure(categoryIdentities[0], "selectTax"),
                SelectionId.createWithIdAndMeasure(categoryIdentities[1], "selectTax")];

            var legendItems = data.legendData.dataPoints;
            expect(legendItems.length).toBe(2);
            expect(data.series).toEqual([{
                key: 'series0', index: 0, displayName: 'sales', identity: SelectionId.createWithMeasure("selectSales"), data: [
                    {
                        categoryValue: 2011,
                        value: 0.625,
                        position: 0.625,
                        valueAbsolute: 0.625,
                        valueOriginal: 100,
                        seriesIndex: 0,
                        labelFill: legendItems[0].color,
                        showLabel: true,
                        categoryIndex: 0,
                        color: legendItems[0].color,
                        selected: false,
                        originalValue: 0.625,
                        originalPosition: 0.625,
                        originalValueAbsolute: 0.625,
                        identity: selectionIds[0],
                        key: selectionIds[0].getKey(),
                        tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "$1" }]
                    }, {
                        categoryValue: 2012,
                        value: 0.8,
                        position: 0.8,
                        valueAbsolute: 0.8,
                        valueOriginal: 200,
                        seriesIndex: 0,
                        labelFill: legendItems[0].color,
                        showLabel: true,
                        categoryIndex: 1,
                        color: legendItems[0].color,
                        selected: false,
                        originalValue: 0.8,
                        originalPosition: 0.8,
                        originalValueAbsolute: 0.8,
                        identity: selectionIds[1],
                        key: selectionIds[1].getKey(),
                        tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "$1" }]
                    }
                ]
            },
                {
                        key: 'series1', index: 1, displayName: 'tax', identity: SelectionId.createWithMeasure("selectTax"), data: [
                        {
                            categoryValue: 2011,
                            value: 0.375,
                            position: 1,
                            valueAbsolute: 0.375,
                            valueOriginal: 60,
                            seriesIndex: 1,
                            labelFill: legendItems[1].color,
                            showLabel: true,
                            categoryIndex: 0,
                            color: legendItems[1].color,
                            selected: false,
                            originalValue: 0.375,
                            originalPosition: 1,
                            originalValueAbsolute: 0.375,
                            identity: selectionIds[2],
                            key: selectionIds[2].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "tax", value: "0.375" }],
                        }, {
                            categoryValue: 2012,
                            value: 0.2,
                            position: 1,
                            valueAbsolute: 0.2,
                            valueOriginal: 50,
                            seriesIndex: 1,
                            labelFill: legendItems[1].color,
                            showLabel: true,
                            categoryIndex: 1,
                            color: legendItems[1].color,
                            selected: false,
                            originalValue: 0.2,
                            originalPosition: 1,
                            originalValueAbsolute: 0.2,
                            identity: selectionIds[3],
                            key: selectionIds[3].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "tax", value: "0.2" }],
                        }
                    ]
                }]);
            expect(StackedUtil.calcValueDomain(data.series, /*is100Pct*/ true)).toEqual({
                min: 0,
                max: 1
            });
        });

        it('has negative measure',() => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            var dataView: powerbi.DataViewCategorical = {
                categories: [{
                    source: categoryColumn,
                    values: [2011, 2012],
                    identity: categoryIdentities,
                }],
                values: DataViewTransform.createValueColumns([{
                    source: measureColumn,
                    values: [100, -200]
                }])
            };
            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;

            var data = ColumnChart.converter(dataView, colors);
            var selectionIds: SelectionId[] = [
                SelectionId.createWithIdAndMeasure(categoryIdentities[0], measureColumn.queryName),
                SelectionId.createWithIdAndMeasure(categoryIdentities[1], measureColumn.queryName)];
            var legendItems = data.legendData.dataPoints;

            expect(data.series).toEqual([{
                key: 'series0', index: 0, displayName: 'sales', identity: SelectionId.createWithMeasure("selectSales"), data: [
                    {
                        categoryValue: 2011,
                        value: 100,
                        position: 100,
                        valueAbsolute: 100,
                        valueOriginal: 100,
                        seriesIndex: 0,
                        showLabel: true,
                        labelFill: legendItems[0].color,
                        categoryIndex: 0,
                        color: legendItems[0].color,
                        selected: false,
                        originalValue: 100,
                        originalPosition: 100,
                        originalValueAbsolute: 100,
                        identity: selectionIds[0],
                        key: selectionIds[0].getKey(),
                        tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "$100" }],
                    },
                    {
                        categoryValue: 2012,
                        value: -200,
                        position: 0,
                        valueAbsolute: 200,
                        valueOriginal: -200,
                        seriesIndex: 0,
                        showLabel: true,
                        labelFill: legendItems[0].color,
                        categoryIndex: 1,
                        color: legendItems[0].color,
                        selected: false,
                        originalValue: -200,
                        originalPosition: 0,
                        originalValueAbsolute: 200,
                        identity: selectionIds[1],
                        key: selectionIds[1].getKey(),
                        tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "-$200" }],
                    }]
            }]);
            expect(AxisHelper.createValueDomain(data.series, true)).toEqual([-200, 100]);
            expect(StackedUtil.calcValueDomain(data.series, /*is100Pct*/ false)).toEqual({
                min: -200,
                max: 100
            });
        });

        it('has positive and negative measure - two series',() => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            var dataView: powerbi.DataViewCategorical = {
                categories: [{
                    source: categoryColumn,
                    values: [2011, 2012],
                    identity: categoryIdentities,
                }],
                values: DataViewTransform.createValueColumns([{
                    source: measureColumn,
                    values: [2, -2],
                },
                    {
                        source: measure2Column,
                        values: [-3, 4],
                    },
                    {
                        source: measure3Column,
                        values: [4, -3],
                    }])
            };
            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;

            var data = ColumnChart.converter(dataView, colors);
            expect(data.series[2].data[0].position).toEqual(6);
            expect(data.series[2].data[1].position).toEqual(-2);
            expect(AxisHelper.createValueDomain(data.series, true)).toEqual([-3, 4]);
            expect(StackedUtil.calcValueDomain(data.series, /*is100Pct*/ false)).toEqual({
                min: -5,
                max: 6
            });
        });

        it('has negative measure (100%)',() => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            var dataView: powerbi.DataViewCategorical = {
                categories: [{
                    source: categoryColumn,
                    values: [2011, 2012],
                    identity: categoryIdentities,
                }],
                values: DataViewTransform.createValueColumns([{
                    source: measureColumn,
                    values: [100, -200]
                }])
            };
            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;

            var data = ColumnChart.converter(dataView, colors, true);
            var selectionIds: SelectionId[] = [
                SelectionId.createWithIdAndMeasure(categoryIdentities[0], measureColumn.queryName),
                SelectionId.createWithIdAndMeasure(categoryIdentities[1], measureColumn.queryName)];
            var legendItems = data.legendData.dataPoints;
            expect(data.series).toEqual([{
                key: 'series0', index: 0, displayName: 'sales', identity: SelectionId.createWithMeasure("selectSales"), data: [
                    {
                        categoryValue: 2011,
                        value: 1,
                        position: 1,
                        valueAbsolute: 1,
                        valueOriginal: 100,
                        seriesIndex: 0,
                        showLabel: true,
                        labelFill: legendItems[0].color,
                        categoryIndex: 0,
                        color: legendItems[0].color,
                        selected: false,
                        originalValue: 1,
                        originalPosition: 1,
                        originalValueAbsolute: 1,
                        identity: selectionIds[0],
                        key: selectionIds[0].getKey(),
                        tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "$1" }],
                    }, {
                        categoryValue: 2012,
                        value: -1,
                        position: 0,
                        valueAbsolute: 1,
                        valueOriginal: -200,
                        seriesIndex: 0,
                        showLabel: true,
                        labelFill: legendItems[0].color,
                        categoryIndex: 1,
                        color: legendItems[0].color,
                        selected: false,
                        originalValue: -1,
                        originalPosition: 0,
                        originalValueAbsolute: 1,
                        identity: selectionIds[1],
                        key: selectionIds[1].getKey(),
                        tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "-$1" }],
                    }
                ]
            }]);
            expect(StackedUtil.calcValueDomain(data.series, /*is100Pct*/ true)).toEqual({
                min: -1,
                max: 1
            });
        });

        it('is missing a measure',() => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            var dataView: powerbi.DataViewCategorical = {
                categories: [{
                    source: categoryColumn,
                    values: [2011, 2012],
                    identity: categoryIdentities,
                }],
                values: DataViewTransform.createValueColumns([{
                    source: measureColumn,
                    values: [100, null]
                }])
            };
            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;

            var data = ColumnChart.converter(dataView, colors);
            var selectionIds: SelectionId[] = [
                SelectionId.createWithIdAndMeasure(categoryIdentities[0], measureColumn.queryName),
                SelectionId.createWithIdAndMeasure(categoryIdentities[1], measureColumn.queryName)];
            var legendItems = data.legendData.dataPoints;
            expect(data.series).toEqual([{
                key: 'series0', index: 0, displayName: 'sales', identity: SelectionId.createWithMeasure("selectSales"), data: [
                    {
                        categoryValue: 2011,
                        value: 100,
                        position: 100,
                        valueAbsolute: 100,
                        valueOriginal: 100,
                        seriesIndex: 0,
                        showLabel: true,
                        labelFill: legendItems[0].color,
                        categoryIndex: 0,
                        color: legendItems[0].color,
                        selected: false,
                        originalValue: 100,
                        originalPosition: 100,
                        originalValueAbsolute: 100,
                        identity: selectionIds[0],
                        key: selectionIds[0].getKey(),
                        tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "$100" }],
                    }, {
                        categoryValue: 2012,
                        value: null,
                        position: 0,
                        valueAbsolute: 0,
                        valueOriginal: null,
                        seriesIndex: 0,
                        showLabel: true,
                        labelFill: legendItems[0].color,
                        categoryIndex: 1,
                        color: legendItems[0].color,
                        selected: false,
                        originalValue: null,
                        originalPosition: 0,
                        originalValueAbsolute: 0,
                        identity: selectionIds[1],
                        key: selectionIds[1].getKey(),
                        tooltipInfo: [{ displayName: "year", value: "2012" }],
                    }
                ]
            }]);
            expect(AxisHelper.createValueDomain(data.series, true)).toEqual([0, 100]);
            expect(StackedUtil.calcValueDomain(data.series, /*is100Pct*/ false)).toEqual({
                min: 0,
                max: 100
            });
        });

        it('is missing a category',() => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity(null),
            ];
            var dataView: powerbi.DataViewCategorical = {
                categories: [{
                    source: categoryColumn,
                    values: [2011, null],
                    identity: categoryIdentities,
                }],
                values: DataViewTransform.createValueColumns([{
                    source: measureColumn,
                    values: [100, 175]
                }])
            };
            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;

            var data = ColumnChart.converter(dataView, colors);
            var selectionIds: SelectionId[] = [
                SelectionId.createWithIdAndMeasure(categoryIdentities[0], measureColumn.queryName),
                SelectionId.createWithIdAndMeasure(categoryIdentities[1], measureColumn.queryName)];
            var legendItems = data.legendData.dataPoints;
            expect(data.series).toEqual([{
                key: 'series0', index: 0, displayName: 'sales', identity: SelectionId.createWithMeasure("selectSales"), data: [
                    {
                        categoryValue: 2011,
                        value: 100,
                        position: 100,
                        valueAbsolute: 100,
                        valueOriginal: 100,
                        seriesIndex: 0,
                        showLabel: true,
                        labelFill: legendItems[0].color,
                        categoryIndex: 0,
                        color: legendItems[0].color,
                        selected: false,
                        originalValue: 100,
                        originalPosition: 100,
                        originalValueAbsolute: 100,
                        identity: selectionIds[0],
                        key: selectionIds[0].getKey(),
                        tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "$100" }],
                    },
                    {
                        categoryValue: null,
                        value: 175,
                        position: 175,
                        valueAbsolute: 175,
                        valueOriginal: 175,
                        seriesIndex: 0,
                        showLabel: true,
                        labelFill: legendItems[0].color,
                        categoryIndex: 1,
                        color: legendItems[0].color,
                        selected: false,
                        originalValue: 175,
                        originalPosition: 175,
                        originalValueAbsolute: 175,
                        identity: selectionIds[1],
                        key: selectionIds[1].getKey(),
                        tooltipInfo: [{ displayName: "year", value: "(Blank)" }, { displayName: "sales", value: "$175" }],
                    }
                ]
            }]);
            expect(AxisHelper.createValueDomain(data.series, true)).toEqual([0, 175]);
            expect(StackedUtil.calcValueDomain(data.series, /*is100Pct*/ false)).toEqual({
                min: 0,
                max: 175
            });
        });

        it('multiple measures',() => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            var dataView: powerbi.DataViewCategorical = {
                categories: [{
                    source: categoryColumn,
                    values: [2011, 2012],
                    identity: categoryIdentities,
                }],
                values: DataViewTransform.createValueColumns([
                    {
                        source: measureColumn,
                        values: [100, 200]
                    }, {
                        source: measure2Column,
                        values: [62, 55]
                    }])
            };
            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;
            var series1Color = colors.getColor(0).value;
            var series2Color = colors.getColor(1).value;

            var data = ColumnChart.converter(dataView, colors);
            var selectionIds: SelectionId[] = [
                SelectionId.createWithIdAndMeasure(categoryIdentities[0], "selectSales"),
                SelectionId.createWithIdAndMeasure(categoryIdentities[1], "selectSales"),
                SelectionId.createWithIdAndMeasure(categoryIdentities[0], "selectTax"),
                SelectionId.createWithIdAndMeasure(categoryIdentities[1], "selectTax"),
            ];
            var legendItems = data.legendData.dataPoints;
            expect(data.series).toEqual(
                [{
                    key: 'series0', index: 0, displayName: 'sales', identity: SelectionId.createWithMeasure("selectSales"), data: [
                        {
                            categoryValue: 2011,
                            value: 100,
                            position: 100,
                            valueAbsolute: 100,
                            valueOriginal: 100,
                            seriesIndex: 0,
                            showLabel: true,
                            labelFill: legendItems[0].color,
                            categoryIndex: 0,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: 100,
                            originalPosition: 100,
                            originalValueAbsolute: 100,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "$100" }],
                        },
                        {
                            categoryValue: 2012,
                            value: 200,
                            position: 200,
                            valueAbsolute: 200,
                            valueOriginal: 200,
                            seriesIndex: 0,
                            showLabel: true,
                            labelFill: legendItems[0].color,
                            categoryIndex: 1,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: 200,
                            originalPosition: 200,
                            originalValueAbsolute: 200,
                            identity: selectionIds[1],
                            key: selectionIds[1].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "$200" }],
                        }
                    ]
                },
                    {
                    key: 'series1', index: 1, displayName: 'tax', identity: SelectionId.createWithMeasure("selectTax"), data: [
                            {
                                categoryValue: 2011,
                                value: 62,
                                position: 162,
                                valueAbsolute: 62,
                                valueOriginal: 62,
                                seriesIndex: 1,
                                showLabel: true,
                                labelFill: legendItems[1].color,
                                categoryIndex: 0,
                                color: legendItems[1].color,
                                selected: false,
                                originalValue: 62,
                                originalPosition: 162,
                                originalValueAbsolute: 62,
                                identity: selectionIds[2],
                                key: selectionIds[2].getKey(),
                                tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "tax", value: "62" }],
                            },
                            {
                                categoryValue: 2012,
                                value: 55,
                                position: 255,
                                valueAbsolute: 55,
                                valueOriginal: 55,
                                seriesIndex: 1,
                                showLabel: true,
                                labelFill: legendItems[1].color,
                                categoryIndex: 1,
                                color: legendItems[1].color,
                                selected: false,
                                originalValue: 55,
                                originalPosition: 255,
                                originalValueAbsolute: 55,
                                identity: selectionIds[3],
                                key: selectionIds[3].getKey(),
                                tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "tax", value: "55" }],
                            }
                        ]
                    }]
                );
            expect(AxisHelper.createValueDomain(data.series, true)).toEqual([0, 200]);
            expect(StackedUtil.calcValueDomain(data.series, /*is100Pct*/ false)).toEqual({
                min: 0,
                max: 255
            });
            expect(legendItems).toEqual([
                { icon: LegendIcon.Box, color: series1Color, label: measureColumn.name, identity: SelectionId.createWithMeasure("selectSales"), selected: false },
                { icon: LegendIcon.Box, color: series2Color, label: measure2Column.name, identity: SelectionId.createWithMeasure("selectTax"), selected: false }
            ]);
        });

        it('converter: dynamic series',() => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            var seriesIdentities = [
                mocks.dataViewScopeIdentityWithEquality(measureColumnDynamic1RefExpr, "A"),
                mocks.dataViewScopeIdentityWithEquality(measureColumnDynamic1RefExpr, "B"),
            ];
            var dataView: powerbi.DataViewCategorical = {
                categories: [{
                    source: categoryColumn,
                    values: [2011, 2012],
                    identity: categoryIdentities,
                }],
                values: DataViewTransform.createValueColumns([
                    {
                        source: measureColumnDynamic1,
                        values: [100, 200],
                        identity: seriesIdentities[0],
                    }, {
                        source: measureColumnDynamic2,
                        values: [62, 55],
                        identity: seriesIdentities[1],
                    }],
                    [measureColumnDynamic1RefExpr])
            };
            dataView.values.source = measureColumn;

            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;
            var seriesColumnId = SQExprShortSerializer.serializeArray([measureColumnDynamic1RefExpr]);
            // Get a dummy color so the color scale for this key is shifted, so we don't accidentally get the right colors.
            var dummyColor = colors.getColorByScale(seriesColumnId , 'foo').value;
            var series1Color = colors.getColorByScale(seriesColumnId , 'A').value;
            var series2Color = colors.getColorByScale(seriesColumnId , 'B').value;

            var data = ColumnChart.converter(dataView, colors);
            var selectionIds: SelectionId[] = [
                SelectionId.createWithIdsAndMeasure(categoryIdentities[0], seriesIdentities[0], measureColumnDynamic1.queryName),
                SelectionId.createWithIdsAndMeasure(categoryIdentities[1], seriesIdentities[0], measureColumnDynamic2.queryName),
                SelectionId.createWithIdsAndMeasure(categoryIdentities[0], seriesIdentities[1], measureColumnDynamic1.queryName),
                SelectionId.createWithIdsAndMeasure(categoryIdentities[1], seriesIdentities[1], measureColumnDynamic2.queryName),
            ];
            var legendItems = data.legendData.dataPoints;
            expect(data.series).toEqual(
                [{
                    key: 'series0', index: 0, displayName: 'A', identity: SelectionId.createWithIdAndMeasure(seriesIdentities[0], measureColumnDynamic1.queryName), data: [
                        {
                            categoryValue: 2011,
                            value: 100,
                            position: 100,
                            valueAbsolute: 100,
                            valueOriginal: 100,
                            seriesIndex: 0,
                            showLabel: true,
                            labelFill: legendItems[0].color,
                            categoryIndex: 0,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: 100,
                            originalPosition: 100,
                            originalValueAbsolute: 100,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "A" }, { displayName: "sales", value: "$100" }],
                        },
                        {
                            categoryValue: 2012,
                            value: 200,
                            position: 200,
                            valueAbsolute: 200,
                            valueOriginal: 200,
                            seriesIndex: 0,
                            showLabel: true,
                            labelFill: legendItems[0].color,
                            categoryIndex: 1,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: 200,
                            originalPosition: 200,
                            originalValueAbsolute: 200,
                            identity: selectionIds[1],
                            key: selectionIds[1].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "A" }, { displayName: "sales", value: "$200" }],
                        }
                    ]
                }, {
                    key: 'series1', index: 1, displayName: 'B', identity: SelectionId.createWithIdAndMeasure(seriesIdentities[1], measureColumnDynamic2.queryName), data: [
                            {
                                categoryValue: 2011,
                                value: 62,
                                position: 162,
                                valueAbsolute: 62,
                                valueOriginal: 62,
                                seriesIndex: 1,
                                showLabel: true,
                                labelFill: legendItems[1].color,
                                categoryIndex: 0,
                                color: legendItems[1].color,
                                selected: false,
                                originalValue: 62,
                                originalPosition: 162,
                                originalValueAbsolute: 62,
                                identity: selectionIds[2],
                                key: selectionIds[2].getKey(),
                                tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "B" }, { displayName: "sales", value: "$62" }],
                            },
                            {
                                categoryValue: 2012,
                                value: 55,
                                position: 255,
                                valueAbsolute: 55,
                                valueOriginal: 55,
                                seriesIndex: 1,
                                showLabel: true,
                                labelFill: legendItems[1].color,
                                categoryIndex: 1,
                                color: legendItems[1].color,
                                selected: false,
                                originalValue: 55,
                                originalPosition: 255,
                                originalValueAbsolute: 55,
                                identity: selectionIds[3],
                                key: selectionIds[3].getKey(),
                                tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "B" }, { displayName: "sales", value: "$55" }],
                            }
                        ]
                    }]
                );

            expect(data.legendData.title).toEqual("sales");
            expect(legendItems).toEqual([
                { icon: LegendIcon.Box, color: series1Color, label: measureColumnDynamic1.groupName, identity: SelectionId.createWithIdAndMeasure(seriesIdentities[0], measureColumnDynamic1.queryName), selected: false },
                { icon: LegendIcon.Box, color: series2Color, label: measureColumnDynamic2.groupName, identity: SelectionId.createWithIdAndMeasure(seriesIdentities[1], measureColumnDynamic2.queryName), selected: false }
            ]);
        });

        it('converter: dynamic series falsy group instances',() => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            var seriesIdentities = [
                mocks.dataViewScopeIdentityWithEquality(measureColumnDynamic1RefExpr, null),
                mocks.dataViewScopeIdentityWithEquality(measureColumnDynamic1RefExpr, false),
            ];
            var measureColumnSources: powerbi.DataViewMetadataColumn[] = [
                Prototype.inherit(measureColumnDynamic1, c => c.groupName = null),
                Prototype.inherit(measureColumnDynamic2, c => c.groupName = <any>false),
            ];
            var dataView: powerbi.DataViewCategorical = {
                categories: [{
                    source: categoryColumn,
                    values: [2011, 2012],
                    identity: categoryIdentities,
                }],
                values: DataViewTransform.createValueColumns([
                    {
                        source: measureColumnSources[0],
                        values: [100, 200],
                        identity: seriesIdentities[0],
                    }, {
                        source: measureColumnSources[1],
                        values: [62, 55],
                        identity: seriesIdentities[1],
                    }],
                    [measureColumnDynamic1RefExpr])
            };
            dataView.values.source = measureColumn;

            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;
            var data = ColumnChart.converter(dataView, colors);
            var legendItems = data.legendData.dataPoints;
            expect(data.legendData.title).toEqual("sales");
            expect(legendItems).toEqual([
                { icon: LegendIcon.Box, color: legendItems[0].color, label: '(Blank)', identity: SelectionId.createWithIdAndMeasure(seriesIdentities[0], measureColumnSources[0].queryName), selected: false },
                { icon: LegendIcon.Box, color: legendItems[1].color, label: 'False', identity: SelectionId.createWithIdAndMeasure(seriesIdentities[1], measureColumnSources[1].queryName), selected: false }
            ]);
        });

        it('converter: dynamic series + fill color',() => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            var seriesIdentities = [
                mocks.dataViewScopeIdentityWithEquality(measureColumnDynamic1RefExpr, "A"),
                mocks.dataViewScopeIdentityWithEquality(measureColumnDynamic1RefExpr, "B"),
            ];
            var dataView: powerbi.DataViewCategorical = {
                categories: [{
                    source: categoryColumn,
                    values: [2011, 2012],
                    identity: categoryIdentities,
                }],
                values: DataViewTransform.createValueColumns([
                    {
                        source: measureColumnDynamic1,
                        values: [100, 200],
                        identity: seriesIdentities[0],
                    }, {
                        source: measureColumnDynamic2,
                        values: [62, 55],
                        identity: seriesIdentities[1],
                    }],
                    [measureColumnDynamic1RefExpr])
            };
            dataView.values.source = measureColumn;

            var groupedValues = dataView.values.grouped();
            groupedValues[1].objects = { dataPoint: { fill: { solid: { color: 'red' } } } };
            dataView.values.grouped = () => groupedValues;

            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;
            var data = ColumnChart.converter(dataView, colors);
            var selectionIds: SelectionId[] = [
                SelectionId.createWithIdsAndMeasure(categoryIdentities[0], seriesIdentities[0], measureColumnDynamic1.queryName),
                SelectionId.createWithIdsAndMeasure(categoryIdentities[1], seriesIdentities[0], measureColumnDynamic2.queryName),
                SelectionId.createWithIdsAndMeasure(categoryIdentities[0], seriesIdentities[1], measureColumnDynamic1.queryName),
                SelectionId.createWithIdsAndMeasure(categoryIdentities[1], seriesIdentities[1], measureColumnDynamic2.queryName),
            ];
            var legendItems = data.legendData.dataPoints;
            expect(data.series).toEqual(
                [{
                    key: 'series0', index: 0, displayName: 'A', identity: SelectionId.createWithIdAndMeasure(seriesIdentities[0], measureColumnDynamic1.queryName), data: [
                        {
                            categoryValue: 2011,
                            value: 100,
                            position: 100,
                            valueAbsolute: 100,
                            valueOriginal: 100,
                            seriesIndex: 0,
                            showLabel: true,
                            labelFill: legendItems[0].color,
                            categoryIndex: 0,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: 100,
                            originalPosition: 100,
                            originalValueAbsolute: 100,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "A" }, { displayName: "sales", value: "$100" }],
                        },
                        {
                            categoryValue: 2012,
                            value: 200,
                            position: 200,
                            valueAbsolute: 200,
                            valueOriginal: 200,
                            seriesIndex: 0,
                            showLabel: true,
                            labelFill: legendItems[0].color,
                            categoryIndex: 1,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: 200,
                            originalPosition: 200,
                            originalValueAbsolute: 200,
                            identity: selectionIds[1],
                            key: selectionIds[1].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "A" }, { displayName: "sales", value: "$200" }],
                        }
                    ]
                }, {
                    key: 'series1', index: 1, displayName: 'B', identity: SelectionId.createWithIdAndMeasure(seriesIdentities[1], measureColumnDynamic2.queryName), data: [
                            {
                                categoryValue: 2011,
                                value: 62,
                                position: 162,
                                valueAbsolute: 62,
                                valueOriginal: 62,
                                seriesIndex: 1,
                                showLabel: true,
                                labelFill: legendItems[1].color,
                                categoryIndex: 0,
                                color: legendItems[1].color,
                                selected: false,
                                originalValue: 62,
                                originalPosition: 162,
                                originalValueAbsolute: 62,
                                identity: selectionIds[2],
                                key: selectionIds[2].getKey(),
                                tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "B" }, { displayName: "sales", value: "$62" }],
                            },
                            {
                                categoryValue: 2012,
                                value: 55,
                                position: 255,
                                valueAbsolute: 55,
                                valueOriginal: 55,
                                seriesIndex: 1,
                                showLabel: true,
                                labelFill: legendItems[1].color,
                                categoryIndex: 1,
                                color: legendItems[1].color,
                                selected: false,
                                originalValue: 55,
                                originalPosition: 255,
                                originalValueAbsolute: 55,
                                identity: selectionIds[3],
                                key: selectionIds[3].getKey(),
                                tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "B" }, { displayName: "sales", value: "$55" }],
                            }
                        ]
                    }]
                );

            expect(data.legendData.title).toEqual("sales");
            expect(legendItems).toEqual([
                { icon: LegendIcon.Box, color: '#01B8AA', label: measureColumnDynamic1.groupName, identity: SelectionId.createWithIdAndMeasure(seriesIdentities[0], measureColumnDynamic1.queryName), selected: false },
                { icon: LegendIcon.Box, color: 'red', label: measureColumnDynamic2.groupName, identity: SelectionId.createWithIdAndMeasure(seriesIdentities[1], measureColumnDynamic2.queryName), selected: false }
            ]);
        });

        it('converter: dynamic series, default color',() => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            var seriesIdentities = [
                mocks.dataViewScopeIdentityWithEquality(measureColumnDynamic1RefExpr, "A"),
                mocks.dataViewScopeIdentityWithEquality(measureColumnDynamic1RefExpr, "B"),
            ];
            var dataView: powerbi.DataViewCategorical = {
                categories: [{
                    source: categoryColumn,
                    values: [2011, 2012],
                    identity: categoryIdentities,
                }],
                values: DataViewTransform.createValueColumns([
                    {
                        source: measureColumnDynamic1,
                        values: [100, 200],
                        identity: seriesIdentities[0],
                    }, {
                        source: measureColumnDynamic2,
                        values: [62, 55],
                        identity: seriesIdentities[1],
                    }],
                    [measureColumnDynamic1RefExpr])
            };
            dataView.values.source = measureColumn;

            var groupedValues = dataView.values.grouped();
            dataView.values.grouped = () => groupedValues;

            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;
            var hexDefaultColorRed = "#FF0000";
            var data = ColumnChart.converter(dataView, colors, null, null, null, null, hexDefaultColorRed);
            var selectionIds: SelectionId[] = [
                SelectionId.createWithIdsAndMeasure(categoryIdentities[0], seriesIdentities[0], measureColumnDynamic1.queryName),
                SelectionId.createWithIdsAndMeasure(categoryIdentities[1], seriesIdentities[0], measureColumnDynamic2.queryName),
                SelectionId.createWithIdsAndMeasure(categoryIdentities[0], seriesIdentities[1], measureColumnDynamic1.queryName),
                SelectionId.createWithIdsAndMeasure(categoryIdentities[1], seriesIdentities[1], measureColumnDynamic2.queryName),
            ];
            var legendItems = data.legendData.dataPoints;
            expect(data.series).toEqual(
                [{
                    key: 'series0', index: 0, displayName: 'A', identity: SelectionId.createWithIdAndMeasure(seriesIdentities[0], measureColumnDynamic1.queryName), data: [
                        {
                            categoryValue: 2011,
                            value: 100,
                            position: 100,
                            valueAbsolute: 100,
                            valueOriginal: 100,
                            seriesIndex: 0,
                            showLabel: true,
                            labelFill: hexDefaultColorRed,
                            categoryIndex: 0,
                            color: hexDefaultColorRed,
                            selected: false,
                            originalValue: 100,
                            originalPosition: 100,
                            originalValueAbsolute: 100,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "A" }, { displayName: "sales", value: "$100" }],
                        },
                        {
                            categoryValue: 2012,
                            value: 200,
                            position: 200,
                            valueAbsolute: 200,
                            valueOriginal: 200,
                            seriesIndex: 0,
                            showLabel: true,
                            labelFill: hexDefaultColorRed,
                            categoryIndex: 1,
                            color: hexDefaultColorRed,
                            selected: false,
                            originalValue: 200,
                            originalPosition: 200,
                            originalValueAbsolute: 200,
                            identity: selectionIds[1],
                            key: selectionIds[1].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "A" }, { displayName: "sales", value: "$200" }],
                        }
                    ]
                }, {
                    key: 'series1', index: 1, displayName: 'B', identity: SelectionId.createWithIdAndMeasure(seriesIdentities[1], measureColumnDynamic2.queryName), data: [
                            {
                                categoryValue: 2011,
                                value: 62,
                                position: 162,
                                valueAbsolute: 62,
                                valueOriginal: 62,
                                seriesIndex: 1,
                                showLabel: true,
                                labelFill: hexDefaultColorRed,
                                categoryIndex: 0,
                                color: hexDefaultColorRed,
                                selected: false,
                                originalValue: 62,
                                originalPosition: 162,
                                originalValueAbsolute: 62,
                                identity: selectionIds[2],
                                key: selectionIds[2].getKey(),
                                tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "B" }, { displayName: "sales", value: "$62" }],
                            },
                            {
                                categoryValue: 2012,
                                value: 55,
                                position: 255,
                                valueAbsolute: 55,
                                valueOriginal: 55,
                                seriesIndex: 1,
                                showLabel: true,
                                labelFill: hexDefaultColorRed,
                                categoryIndex: 1,
                                color: hexDefaultColorRed,
                                selected: false,
                                originalValue: 55,
                                originalPosition: 255,
                                originalValueAbsolute: 55,
                                identity: selectionIds[3],
                                key: selectionIds[3].getKey(),
                                tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "B" }, { displayName: "sales", value: "$55" }],
                            }
                        ]
                    }]
                );

            expect(legendItems).toEqual([
                { icon: LegendIcon.Box, color: hexDefaultColorRed, label: measureColumnDynamic1.groupName, identity: SelectionId.createWithIdAndMeasure(seriesIdentities[0], measureColumnDynamic1.queryName), selected: false },
                { icon: LegendIcon.Box, color: hexDefaultColorRed, label: measureColumnDynamic2.groupName, identity: SelectionId.createWithIdAndMeasure(seriesIdentities[1], measureColumnDynamic2.queryName), selected: false }
            ]);
        });

        it('converter: dynamic series, formatted color + default color',() => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            var seriesIdentities = [
                mocks.dataViewScopeIdentityWithEquality(measureColumnDynamic1RefExpr, "A"),
                mocks.dataViewScopeIdentityWithEquality(measureColumnDynamic1RefExpr, "B"),
            ];
            var dataView: powerbi.DataViewCategorical = {
                categories: [{
                    source: categoryColumn,
                    values: [2011, 2012],
                    identity: categoryIdentities,
                }],
                values: DataViewTransform.createValueColumns([
                    {
                        source: measureColumnDynamic1,
                        values: [100, 200],
                        identity: seriesIdentities[0],
                    }, {
                        source: measureColumnDynamic2,
                        values: [62, 55],
                        identity: seriesIdentities[1],
                    }],
                    [measureColumnDynamic1RefExpr])
            };
            dataView.values.source = measureColumn;

            var groupedValues = dataView.values.grouped();
            var hexGreen = "#00FF00";
            groupedValues[1].objects = { dataPoint: { fill: { solid: { color: hexGreen } } } };
            dataView.values.grouped = () => groupedValues;

            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;
            var hexDefaultColorRed = "#FF0000";
            var data = ColumnChart.converter(dataView, colors, undefined, undefined, undefined, undefined, hexDefaultColorRed);
            var selectionIds: SelectionId[] = [
                SelectionId.createWithIdsAndMeasure(categoryIdentities[0], seriesIdentities[0], measureColumnDynamic1.queryName),
                SelectionId.createWithIdsAndMeasure(categoryIdentities[1], seriesIdentities[0], measureColumnDynamic2.queryName),
                SelectionId.createWithIdsAndMeasure(categoryIdentities[0], seriesIdentities[1], measureColumnDynamic1.queryName),
                SelectionId.createWithIdsAndMeasure(categoryIdentities[1], seriesIdentities[1], measureColumnDynamic2.queryName),
            ];
            var legendItems = data.legendData.dataPoints;
            expect(data.series).toEqual(
                [{
                    key: 'series0', index: 0, displayName: 'A', identity: SelectionId.createWithIdAndMeasure(seriesIdentities[0], measureColumnDynamic1.queryName), data: [
                        {
                            categoryValue: 2011,
                            value: 100,
                            position: 100,
                            valueAbsolute: 100,
                            valueOriginal: 100,
                            seriesIndex: 0,
                            showLabel: true,
                            labelFill: hexDefaultColorRed,
                            categoryIndex: 0,
                            color: hexDefaultColorRed,
                            selected: false,
                            originalValue: 100,
                            originalPosition: 100,
                            originalValueAbsolute: 100,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "A" }, { displayName: "sales", value: "$100" }],
                        },
                        {
                            categoryValue: 2012,
                            value: 200,
                            position: 200,
                            valueAbsolute: 200,
                            valueOriginal: 200,
                            seriesIndex: 0,
                            showLabel: true,
                            labelFill: hexDefaultColorRed,
                            categoryIndex: 1,
                            color: hexDefaultColorRed,
                            selected: false,
                            originalValue: 200,
                            originalPosition: 200,
                            originalValueAbsolute: 200,
                            identity: selectionIds[1],
                            key: selectionIds[1].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "A" }, { displayName: "sales", value: "$200" }],
                        }
                    ]
                }, {
                        key: 'series1', index: 1, displayName: 'B', identity: SelectionId.createWithIdAndMeasure(seriesIdentities[1], measureColumnDynamic2.queryName), data: [
                            {
                                categoryValue: 2011,
                                value: 62,
                                position: 162,
                                valueAbsolute: 62,
                                valueOriginal: 62,
                                seriesIndex: 1,
                                showLabel: true,
                                labelFill: hexGreen,
                                categoryIndex: 0,
                                color: hexGreen,
                                selected: false,
                                originalValue: 62,
                                originalPosition: 162,
                                originalValueAbsolute: 62,
                                identity: selectionIds[2],
                                key: selectionIds[2].getKey(),
                                tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "B" }, { displayName: "sales", value: "$62" }],
                            },
                            {
                                categoryValue: 2012,
                                value: 55,
                                position: 255,
                                valueAbsolute: 55,
                                valueOriginal: 55,
                                seriesIndex: 1,
                                showLabel: true,
                                labelFill: hexGreen,
                                categoryIndex: 1,
                                color: hexGreen,
                                selected: false,
                                originalValue: 55,
                                originalPosition: 255,
                                originalValueAbsolute: 55,
                                identity: selectionIds[3],
                                key: selectionIds[3].getKey(),
                                tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "B" }, { displayName: "sales", value: "$55" }],
                            }
                        ]
                    }]
                );

            expect(legendItems).toEqual([
                { icon: LegendIcon.Box, color: hexDefaultColorRed, label: measureColumnDynamic1.groupName, identity: SelectionId.createWithIdAndMeasure(seriesIdentities[0], measureColumnDynamic1.queryName), selected: false },
                { icon: LegendIcon.Box, color: hexGreen, label: measureColumnDynamic2.groupName, identity: SelectionId.createWithIdAndMeasure(seriesIdentities[1], measureColumnDynamic2.queryName), selected: false }
            ]);
        });

        it('validate highlighted tooltip',() => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
                mocks.dataViewScopeIdentity("2013"),
            ];
            var dataView: powerbi.DataViewCategorical = {
                categories: [{
                    source: categoryColumn,
                    values: [2011, 2012, 2013],
                    identity: categoryIdentities,
                }],
                values: DataViewTransform.createValueColumns([{
                    source: measureColumn,
                    values: [100, 200, 300],
                    highlights: [null, 50, 0],
                }])
            };
            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;

            // We should not summarize the X-axis values with DisplayUnits per-PowerView behavior, so ensure that we are using the 'Verbose' mode for the formatter.
            spyOn(powerbi.visuals.valueFormatter, 'create').and.callThrough();
            var data = ColumnChart.converter(dataView, colors);
            //first tooltip is regular because highlighted value is null
            expect(data.series[0].data[0].tooltipInfo).toEqual([{ displayName: "year", value: "2011" }, { displayName: "sales", value: "$100" }]);
            expect(data.series[0].data[1].tooltipInfo).toEqual([{ displayName: "year", value: "2011" }, { displayName: "sales", value: "$100" }]);

            //tooltips with highlighted value
            expect(data.series[0].data[2].tooltipInfo).toEqual([{ displayName: "year", value: "2012" }, { displayName: "sales", value: "$200" }, { displayName: powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName, value: "$50" }]);
            expect(data.series[0].data[3].tooltipInfo).toEqual([{ displayName: "year", value: "2012" }, { displayName: "sales", value: "$200" }, { displayName: powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName, value: "$50" }]);
            
            //tooltips with highlighted value 0
            expect(data.series[0].data[4].tooltipInfo).toEqual([{ displayName: "year", value: "2013" }, { displayName: "sales", value: "$300" }, { displayName: powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName, value: "$0" }]);
            expect(data.series[0].data[5].tooltipInfo).toEqual([{ displayName: "year", value: "2013" }, { displayName: "sales", value: "$300" }, { displayName: powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName, value: "$0" }]);
        });

        it('null measures legend',() => {
            var dataView: powerbi.DataViewCategorical = {
                categories: [{
                    source: categoryColumn,
                    values: [2011, 2012]
                }],
                values: DataViewTransform.createValueColumns([
                    {
                        source: nullMeasureColumn,
                        values: [100, 200]
                    }, {
                        source: measure2Column,
                        values: [62, 55]
                    }])
            };
            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;

            var data = ColumnChart.converter(dataView, colors);
            var legendItems = data.legendData.dataPoints;
            expect(legendItems).toEqual([
                { icon: LegendIcon.Box, color: legendItems[0].color, label: powerbi.visuals.valueFormatter.format(null), identity: SelectionId.createWithMeasure(nullMeasureColumn.queryName), selected: false },
                { icon: LegendIcon.Box, color: legendItems[1].color, label: dataView.values[1].source.name, identity: SelectionId.createWithMeasure(measure2Column.queryName), selected: false },
            ]);
        });

        it('multiple measures (100%)',() => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("2010"),
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
                mocks.dataViewScopeIdentity("2013"),
            ];
            var dataView: powerbi.DataViewCategorical = {
                categories: [{
                    source: categoryColumn,
                    values: [2010, 2011, 2012, 2013],
                    identity: categoryIdentities,
                }],
                values: DataViewTransform.createValueColumns([
                    {
                        source: measureColumn,
                        values: [30, -20, 100, -300]
                    }, {
                        source: measure2Column,
                        values: [90, 50, -100, -100]
                    }])
            };
            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;

            var data = ColumnChart.converter(dataView, colors, true);
            var selectionIds: SelectionId[] = [
                SelectionId.createWithIdAndMeasure(categoryIdentities[0], "selectSales"),
                SelectionId.createWithIdAndMeasure(categoryIdentities[1], "selectSales"),
                SelectionId.createWithIdAndMeasure(categoryIdentities[2], "selectSales"),
                SelectionId.createWithIdAndMeasure(categoryIdentities[3], "selectSales"),
                SelectionId.createWithIdAndMeasure(categoryIdentities[0], "selectTax"),
                SelectionId.createWithIdAndMeasure(categoryIdentities[1], "selectTax"),
                SelectionId.createWithIdAndMeasure(categoryIdentities[2], "selectTax"),
                SelectionId.createWithIdAndMeasure(categoryIdentities[3], "selectTax"),
            ];
            var legendItems = data.legendData.dataPoints;
            expect(legendItems.length).toBe(2);
            expect(data.series).toEqual(
                [{
                    key: 'series0', index: 0, displayName: 'sales', identity: SelectionId.createWithMeasure("selectSales"), data: [
                        {
                            categoryValue: 2010,
                            value: 0.25,
                            position: 0.25,
                            valueAbsolute: 0.25,
                            valueOriginal: 30,
                            seriesIndex: 0,
                            showLabel: true,
                            labelFill: legendItems[0].color,
                            categoryIndex: 0,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: 0.25,
                            originalPosition: 0.25,
                            originalValueAbsolute: 0.25,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2010" }, { displayName: "sales", value: "$0" }],
                        }, {
                            categoryValue: 2011,
                            value: -0.2857142857142857,
                            position: 0,
                            valueAbsolute: 0.2857142857142857,
                            valueOriginal: -20,
                            seriesIndex: 0,
                            showLabel: true,
                            labelFill: legendItems[0].color,
                            categoryIndex: 1,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: -0.2857142857142857,
                            originalPosition: 0,
                            originalValueAbsolute: 0.2857142857142857,
                            identity: selectionIds[1],
                            key: selectionIds[1].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "sales", value: "-$0" }],
                        }, {
                            categoryValue: 2012,
                            value: 0.5,
                            position: 0.5,
                            valueAbsolute: 0.5,
                            valueOriginal: 100,
                            seriesIndex: 0,
                            showLabel: true,
                            labelFill: legendItems[0].color,
                            categoryIndex: 2,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: 0.5,
                            originalPosition: 0.5,
                            originalValueAbsolute: 0.5,
                            identity: selectionIds[2],
                            key: selectionIds[2].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "sales", value: "$1" }],
                        }, {
                            categoryValue: 2013,
                            value: -0.75,
                            position: 0,
                            valueAbsolute: 0.75,
                            valueOriginal: -300,
                            seriesIndex: 0,
                            showLabel: true,
                            labelFill: legendItems[0].color,
                            categoryIndex: 3,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: -0.75,
                            originalPosition: 0,
                            originalValueAbsolute: 0.75,
                            identity: selectionIds[3],
                            key: selectionIds[3].getKey(),
                            tooltipInfo: [{ displayName: "year", value: "2013" }, { displayName: "sales", value: "-$1" }],
                        }
                    ]
                }, {
                    key: 'series1', index: 1, displayName: 'tax', identity: SelectionId.createWithMeasure("selectTax"), data: [
                            {
                                categoryValue: 2010,
                                value: 0.75,
                                position: 1,
                                valueAbsolute: 0.75,
                                valueOriginal: 90,
                                seriesIndex: 1,
                                showLabel: true,
                                labelFill: legendItems[1].color,
                                categoryIndex: 0,
                                color: legendItems[1].color,
                                selected: false,
                                originalValue: 0.75,
                                originalPosition: 1,
                                originalValueAbsolute: 0.75,
                                identity: selectionIds[4],
                                key: selectionIds[4].getKey(),
                                tooltipInfo: [{ displayName: "year", value: "2010" }, { displayName: "tax", value: "0.75" }],
                            }, {
                                categoryValue: 2011,
                                value: 0.7142857142857143,
                                position: 0.7142857142857143,
                                valueAbsolute: 0.7142857142857143,
                                valueOriginal: 50,
                                seriesIndex: 1,
                                showLabel: true,
                                labelFill: legendItems[1].color,
                                categoryIndex: 1,
                                color: legendItems[1].color,
                                selected: false,
                                originalValue: 0.7142857142857143,
                                originalPosition: 0.7142857142857143,
                                originalValueAbsolute: 0.7142857142857143,
                                identity: selectionIds[5],
                                key: selectionIds[5].getKey(),
                                tooltipInfo: [{ displayName: "year", value: "2011" }, { displayName: "tax", value: "0.7142857142857143" }],
                            }, {
                                categoryValue: 2012,
                                value: -0.5,
                                position: 0,
                                valueAbsolute: 0.5,
                                valueOriginal: -100,
                                seriesIndex: 1,
                                showLabel: true,
                                labelFill: legendItems[1].color,
                                categoryIndex: 2,
                                color: legendItems[1].color,
                                selected: false,
                                originalValue: -0.5,
                                originalPosition: 0,
                                originalValueAbsolute: 0.5,
                                identity: selectionIds[6],
                                key: selectionIds[6].getKey(),
                                tooltipInfo: [{ displayName: "year", value: "2012" }, { displayName: "tax", value: "-0.5" }],
                            }, {
                                categoryValue: 2013,
                                value: -0.25,
                                position: -0.75,
                                valueAbsolute: 0.25,
                                valueOriginal: -100,
                                seriesIndex: 1,
                                showLabel: true,
                                labelFill: legendItems[1].color,
                                categoryIndex: 3,
                                color: legendItems[1].color,
                                selected: false,
                                originalValue: -0.25,
                                originalPosition: -0.75,
                                originalValueAbsolute: 0.25,
                                identity: selectionIds[7],
                                key: selectionIds[7].getKey(),
                                tooltipInfo: [{ displayName: "year", value: "2013" }, { displayName: "tax", value: "-0.25" }],
                            }
                        ]
                    }]);
            expect(StackedUtil.calcValueDomain(data.series, /*is100Pct*/ true)).toEqual({
                min: -1,
                max: 1
            });
        });

        it('no category single measure',() => {
            var dataView: powerbi.DataViewCategorical = {
                values: DataViewTransform.createValueColumns([{
                    source: measureColumn,
                    values: [100]
                }])
            };
            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;

            var data = ColumnChart.converter(dataView, colors);
            var selectionId = SelectionId.createWithMeasure(measureColumn.queryName);
            var legendItems = data.legendData.dataPoints;
            expect(legendItems.length).toBe(1);
            expect(data.series).toEqual(
                [{
                    key: 'series0', index: 0, displayName: measureColumn.name, identity: SelectionId.createWithMeasure("selectSales"), data: [
                        {
                            categoryValue: null,
                            value: 100,
                            position: 100,
                            valueAbsolute: 100,
                            valueOriginal: 100,
                            seriesIndex: 0,
                            showLabel: true,
                            labelFill: legendItems[0].color,
                            categoryIndex: 0,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: 100,
                            originalPosition: 100,
                            originalValueAbsolute: 100,
                            identity: selectionId,
                            key: selectionId.getKey(),
                            tooltipInfo: [{ displayName: "sales", value: "$100" }]
                        }
                    ]
                }]);

            expect(StackedUtil.calcValueDomain(data.series, /*is100Pct*/ false)).toEqual({
                min: 0,
                max: 100
            });
            expect(legendItems).toEqual([
                { icon: LegendIcon.Box, color: legendItems[0].color, label: measureColumn.name, identity: SelectionId.createWithMeasure("selectSales"), selected: false }
            ]);
        });

        it('no category multiple measure',() => {
            var dataView: powerbi.DataViewCategorical = {
                values: DataViewTransform.createValueColumns([
                    {
                        source: measureColumn,
                        values: [100]
                    }, {
                        source: measure2Column,
                        values: [200]
                    }])
            };
            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;

            var data = ColumnChart.converter(dataView, colors);
            var selectionIds: SelectionId[] = [
                SelectionId.createWithMeasure("selectSales"),
                SelectionId.createWithMeasure("selectTax"),
            ];
            var legendItems = data.legendData.dataPoints;
            expect(legendItems.length).toBe(2);
            expect(data.series).toEqual(
                [{
                    key: 'series0', index: 0, displayName: 'sales', identity: SelectionId.createWithMeasure("selectSales"), data: [
                        {
                            categoryValue: null,
                            value: 100,
                            position: 100,
                            valueAbsolute: 100,
                            valueOriginal: 100,
                            seriesIndex: 0,
                            showLabel: true,
                            labelFill: legendItems[0].color,
                            categoryIndex: 0,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: 100,
                            originalPosition: 100,
                            originalValueAbsolute: 100,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                            tooltipInfo: [{ displayName: "sales", value: "$100" }],
                        }
                    ]
                }, {
                    key: 'series1', index: 1, displayName: 'tax', identity: SelectionId.createWithMeasure("selectTax"), data: [
                            {
                                categoryValue: null,
                                value: 200,
                                position: 300,
                                valueAbsolute: 200,
                                valueOriginal: 200,
                                seriesIndex: 1,
                                showLabel: true,
                                labelFill: legendItems[1].color,
                                categoryIndex: 0,
                                color: legendItems[1].color,
                                selected: false,
                                originalValue: 200,
                                originalPosition: 300,
                                originalValueAbsolute: 200,
                                identity: selectionIds[1],
                                key: selectionIds[1].getKey(),
                                tooltipInfo: [{ displayName: "tax", value: "200" }],
                            }
                        ]
                    }]);

            expect(StackedUtil.calcValueDomain(data.series, /*is100Pct*/ false)).toEqual({
                min: 0,
                max: 300
            });
            expect(legendItems).toEqual([
                { icon: LegendIcon.Box, color: legendItems[0].color, label: measureColumn.name, identity: SelectionId.createWithMeasure("selectSales"), selected: false },
                { icon: LegendIcon.Box, color: legendItems[1].color, label: measure2Column.name, identity: SelectionId.createWithMeasure("selectTax"), selected: false }
            ]);
        });

        it('no category multiple measure + fill color',() => {
            var dataView: powerbi.DataViewCategorical = {
                values: DataViewTransform.createValueColumns([
                    {
                        source: {
                            name: 'sales',
                            queryName: 'selectSales',
                            isMeasure: true,
                            type: DataShapeUtility.describeDataType(SemanticType.Integer),
                            objects: {
                                general: { formatString: '$0' },
                                dataPoint: { fill: { solid: { color: 'red' } } }
                            },
                        },
                        values: [100],
                    }])
            };
            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;

            var data = ColumnChart.converter(dataView, colors);
            var selectionIds: SelectionId[] = [
                SelectionId.createWithMeasure("selectSales"),
            ];
            var legendItems = data.legendData.dataPoints;
            expect(legendItems.length).toBe(1);
            expect(data.series).toEqual(
                [{
                    key: 'series0', index: 0, displayName: 'sales', identity: SelectionId.createWithMeasure("selectSales"), data: [
                        {
                            categoryValue: null,
                            value: 100,
                            position: 100,
                            valueAbsolute: 100,
                            valueOriginal: 100,
                            seriesIndex: 0,
                            showLabel: true,
                            labelFill: 'red',
                            categoryIndex: 0,
                            color: 'red',
                            selected: false,
                            originalValue: 100,
                            originalPosition: 100,
                            originalValueAbsolute: 100,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                            tooltipInfo: [{ displayName: "sales", value: "$100" }],
                        }
                    ]
                }]);

            expect(legendItems).toEqual([
                { icon: LegendIcon.Box, color: 'red', label: measureColumn.name, identity: SelectionId.createWithMeasure("selectSales"), selected: false },
            ]);
        });

        it('category and measure + fill color',() => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("a"),
                mocks.dataViewScopeIdentity("b"),
            ];
            var dataView: powerbi.DataViewCategorical = {
                categories: [{
                    source: {
                        name: 'prod',
                        queryName: 'selectProd',
                        type: DataShapeUtility.describeDataType(SemanticType.Integer),
                    },
                    values: ['a', 'b'],
                    objects: [undefined, { dataPoint: { fill: { solid: { color: 'red' } } } }],
                    identity: categoryIdentities,
                }],
                values: DataViewTransform.createValueColumns([{
                    source: {
                        name: 'sales',
                        queryName: 'selectSales',
                        isMeasure: true,
                        type: DataShapeUtility.describeDataType(SemanticType.Integer),
                    },
                    values: [100, 150],
                }])
            };

            var data = ColumnChart.converter(dataView, powerbi.common.services.visualStyles.create().colorPalette.dataColors);
            var selectionIds: SelectionId[] = [
                SelectionId.createWithIdAndMeasure(categoryIdentities[0], "selectSales"),
                SelectionId.createWithIdAndMeasure(categoryIdentities[1], "selectSales"),
            ];
            var legendItems = data.legendData.dataPoints;
            expect(legendItems.length).toBe(1);
            expect(data.series).toEqual(
                [{
                    key: 'series0', index: 0, displayName: 'sales', identity: SelectionId.createWithMeasure("selectSales"), data: [
                        {
                            categoryValue: 'a',
                            value: 100,
                            position: 100,
                            valueAbsolute: 100,
                            valueOriginal: 100,
                            seriesIndex: 0,
                            showLabel: true,
                            labelFill: '#01B8AA',
                            categoryIndex: 0,
                            color: '#01B8AA',
                            selected: false,
                            originalValue: 100,
                            originalPosition: 100,
                            originalValueAbsolute: 100,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                            tooltipInfo: [{ displayName: "prod", value: "a" }, { displayName: "sales", value: "100" }],
                        }, {
                            categoryValue: 'b',
                            value: 150,
                            position: 150,
                            valueAbsolute: 150,
                            valueOriginal: 150,
                            seriesIndex: 0,
                            showLabel: true,
                            labelFill:'red',
                            categoryIndex: 1,
                            color: 'red',
                            selected: false,
                            originalValue: 150,
                            originalPosition: 150,
                            originalValueAbsolute: 150,
                            identity: selectionIds[1],
                            key: selectionIds[1].getKey(),
                            tooltipInfo: [{ displayName: "prod", value: "b" }, { displayName: "sales", value: "150" }],
                        }
                    ]
                }]);

            expect(legendItems).toEqual([
                { icon: 0, color: '#01B8AA', label: 'sales', identity: SelectionId.createWithMeasure("selectSales"), selected: false }
            ]);
        });

        it('Gradient measure: should not become a series',() => {
            var dataView: powerbi.DataViewCategorical = {
                categories: [{
                    source: categoryColumn,
                    values: [2011, 2012],
                    identity: [
                        mocks.dataViewScopeIdentity("2011"),
                        mocks.dataViewScopeIdentity("2012"),
                    ],
                }],
                values: DataViewTransform.createValueColumns([
                    {
                        source: Prototype.inherit(measureColumn, c => c.roles = { 'Y': true }),
                        values: [100, 200],
                    }, {
                        source: Prototype.inherit(measure2Column, c => c.roles = { 'Gradient': true }),
                        values: [75, 50],
                    }])
            };

            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;
            var data = ColumnChart.converter(dataView, colors);

            expect(data.legendData.dataPoints.length).toBe(1);
            expect(data.series.length).toBe(1);
            expect(data.series[0].data.length).toBe(2);
            expect(data.series[0].data.map(pruneColunnChartDataPoint)).toEqual([
                {
                    categoryValue: 2011,
                    value: 100,
                }, {
                    categoryValue: 2012,
                    value: 200,
                }
            ]);
        });

        it('Tooltip info formatString with measure that has no object', () => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            var dataView: powerbi.DataViewCategorical = {
                categories: [{
                    source: categoryColumn,
                    values: [2011, 2012],
                    identity: categoryIdentities,
                }],
                values: DataViewTransform.createValueColumns([{
                    source: measureWithFormatString,
                    values: [100, 200]
                }])
            };
            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;

            // We should not summarize the X-axis values with DisplayUnits per-PowerView behavior, so ensure that we are using the 'Verbose' mode for the formatter.
            spyOn(powerbi.visuals.valueFormatter, 'create').and.callThrough();
            var data = ColumnChart.converter(dataView, colors);

            expect(data.series[0].data[0].tooltipInfo).toEqual([{ displayName: "year", value: "2011" }, { displayName: "tax", value: "$100" }]);
            expect(data.series[0].data[1].tooltipInfo).toEqual([{ displayName: "year", value: "2012" }, { displayName: "tax", value: "$200" }]);
        });

        it('dataView that should pivot categories',() => {
            var metadata: powerbi.DataViewMetadata = {
                columns: [
                    { name: '', index: 0 },
                    { name: '', isMeasure: true, index: 1 },
                ]
            };
            var seriesIdentities = [
                mocks.dataViewScopeIdentity("a"),
                mocks.dataViewScopeIdentity("b"),
            ];
            var categoryColRefExpr = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'category' });
            var dataView: powerbi.DataView = {
                metadata: metadata,
                categorical: {
                    categories: [{
                        source: metadata.columns[0],
                        values: ['a', 'b'],
                        identity: seriesIdentities,
                        identityFields: [categoryColRefExpr],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: metadata.columns[1],
                            values: [100, 200]
                        }])
                }
            };
            dataView = DataViewTransform.apply({
                prototype: dataView,
                objectDescriptors: powerbi.visuals.plugins.columnChart.capabilities.objects,
                dataViewMappings: powerbi.visuals.plugins.columnChart.capabilities.dataViewMappings,
                transforms: {
                    selects: [
                        { displayName: 'col1', queryName: 'select1', roles: { 'Series': true } },
                        { displayName: 'col2', queryName: 'select2', roles: { 'Y': true } },
                    ]
                },
                colorAllocatorFactory: powerbi.visuals.createColorAllocatorFactory(),
            })[0];

            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;
            var data = ColumnChart.converter(dataView.categorical, colors);
            var selectionIds: SelectionId[] = [
                SelectionId.createWithIdAndMeasure(seriesIdentities[0], 'select2'),
                SelectionId.createWithIdAndMeasure(seriesIdentities[1], 'select2'),
            ];
            var legendItems = data.legendData.dataPoints;
            expect(legendItems.length).toBe(2);
            expect(data.series).toEqual(
                [{
                    key: 'series0', index: 0, displayName: 'a', identity: SelectionId.createWithIdAndMeasure(seriesIdentities[0], 'select2'), data: [
                        {
                            categoryValue: null,
                            value: 100,
                            position: 100,
                            valueAbsolute: 100,
                            valueOriginal: 100,
                            seriesIndex: 0,
                            showLabel: true,
                            labelFill: legendItems[0].color,
                            categoryIndex: 0,
                            color: legendItems[0].color,
                            selected: false,
                            originalValue: 100,
                            originalPosition: 100,
                            originalValueAbsolute: 100,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                            tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "100" }],
                        }
                    ]
                }, {
                    key: 'series1', index: 1, displayName: 'b', identity: SelectionId.createWithIdAndMeasure(seriesIdentities[1], 'select2'), data: [
                            {
                                categoryValue: null,
                                value: 200,
                                position: 300,
                                valueAbsolute: 200,
                                valueOriginal: 200,
                                seriesIndex: 1,
                                showLabel: true,
                                labelFill: legendItems[1].color,
                                categoryIndex: 0,
                                color: legendItems[1].color,
                                selected: false,
                                originalValue: 200,
                                originalPosition: 300,
                                originalValueAbsolute: 200,
                                identity: selectionIds[1],
                                key: selectionIds[1].getKey(),
                                tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: "col2", value: "200" }],
                            }
                        ]
                    }]);
            expect(legendItems).toEqual([
                { icon: LegendIcon.Box, color: legendItems[0].color, label: 'a', identity: selectionIds[0], selected: false },
                { icon: LegendIcon.Box, color: legendItems[1].color, label: 'b', identity: selectionIds[1], selected: false }
            ]);
        });

        it('dataView with Series & Category role that should pivot categories',() => {
            var metadata: powerbi.DataViewMetadata = {
                columns: [
                    { name: 'col1', queryName: 'selectCol1', roles: { "Series": true, "Category": true } },
                    { name: 'col2', queryName: 'selectCol2', properties: { "Y": true } },
                ]
            };

            var categoryIdentities: powerbi.DataViewScopeIdentity[] = [
                mocks.dataViewScopeIdentity('a'),
                mocks.dataViewScopeIdentity('b'),
            ];
            var categoryColRefExpr = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'col1' });
            var dataView: powerbi.DataView = DataViewSelfCrossJoin.apply({
                metadata: metadata,
                categorical: {
                    categories: [{
                        source: metadata.columns[0],
                        values: ['a', 'b'],
                        identity: categoryIdentities,
                        identityFields: [categoryColRefExpr],
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: metadata.columns[1],
                            values: [100, 200],
                        }])
                }
            });

            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;
            var series1Color = colors.getColorByScale(SQExprShortSerializer.serialize(categoryColRefExpr), 'a').value;
            var series2Color = colors.getColorByScale(SQExprShortSerializer.serialize(categoryColRefExpr), 'b').value;

            var data = ColumnChart.converter(dataView.categorical, colors, undefined, undefined, undefined, metadata);
            var selectionIds: SelectionId[] = [
                SelectionId.createWithIdAndMeasure(categoryIdentities[0], 'selectCol2'),
                SelectionId.createWithIdAndMeasure(categoryIdentities[1], 'selectCol2'),
            ];
            var legendItems = data.legendData.dataPoints;
            expect(legendItems.length).toBe(2);
            expect(legendItems.map(l => l.label)).toEqual(['a', 'b']);

            // Should get a result shaped like a diagonal matrix
            expect(data.series).toEqual(
                [{
                    key: 'series0', index: 0, displayName: 'a', identity: selectionIds[0], data: [
                        {
                            categoryValue: 'a',
                            value: 100,
                            position: 100,
                            valueAbsolute: 100,
                            valueOriginal: 100,
                            seriesIndex: 0,
                            showLabel: true,
                            labelFill: '#01B8AA',
                            categoryIndex: 0,
                            color: series1Color,
                            selected: false,
                            originalValue: 100,
                            originalPosition: 100,
                            originalValueAbsolute: 100,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                            tooltipInfo: [{ displayName: "col1", value: "a" }, { displayName: "col2", value: "100" }],
                        }, {
                            categoryValue: 'b',
                            value: null,
                            position: 0,
                            valueAbsolute: 0,
                            valueOriginal: null,
                            seriesIndex: 0,
                            showLabel: true,
                            labelFill: '#01B8AA',
                            categoryIndex: 1,
                            color: '#01B8AA',
                            selected: false,
                            originalValue: null,
                            originalPosition: 0,
                            originalValueAbsolute: 0,
                            identity: jasmine.any(Object),
                            key: jasmine.any(String),
                            tooltipInfo: [{ displayName: "col1", value: "b" }],
                        }
                    ]
                }, {
                    key: 'series1', index: 1, displayName: 'b', identity: selectionIds[1], data: [
                            {
                                categoryValue: 'b',
                                value: 200,
                                position: 200,
                                valueAbsolute: 200,
                                valueOriginal: 200,
                                seriesIndex: 1,
                                showLabel: true,
                                labelFill: '#374649',
                                categoryIndex: 1,
                                color: series2Color,
                                selected: false,
                                originalValue: 200,
                                originalPosition: 200,
                                originalValueAbsolute: 200,
                                identity: selectionIds[1],
                                key: selectionIds[1].getKey(),
                            tooltipInfo: [{ displayName: "col1", value: "b" }, { displayName: 'col2', value: '200' }],
                            }
                        ]
                    }]);
        });

        it('100% stacked -- rounding (-1)',() => {
            var selectionIds: SelectionId[] = [
                SelectionId.createWithMeasure("measure0"),
                SelectionId.createWithMeasure("measure1"),
            ];
            var data: powerbi.visuals.ColumnChartSeries[] =
                [{
                    key: '1', index: 0, displayName: 'measure0', identity: SelectionId.createNull(), data: [
                        {
                            categoryValue: 0,
                            value: -0.75,
                            position: 0,
                            valueAbsolute: 0.75,
                            valueOriginal: -0.75,
                            categoryIndex: 0,
                            seriesIndex: 0,
                            showLabel: true,
                            labelFill: 'red',
                            color: 'red',
                            selected: false,
                            originalValue: -0.75,
                            originalPosition: 0,
                            originalValueAbsolute: 0.75,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                        }
                    ]
                },
                    {
                        key: '2', index: 1, displayName: 'measure1', identity: SelectionId.createNull(), data: [
                            {
                                categoryValue: 0,
                                value: -0.25000001,
                                position: -0.75,
                                valueAbsolute: 0.25000001,
                                valueOriginal: -0.25000001,
                                categoryIndex: 0,
                                seriesIndex: 1,
                                showLabel: true,
                                labelFill: 'blue',
                                color: 'blue',
                                selected: false,
                                originalValue: -0.25000001,
                                originalPosition: -0.75,
                                originalValueAbsolute: 0.25000001,
                                identity: selectionIds[1],
                                key: selectionIds[1].getKey(),
                            }
                        ]
                    }];
            expect(StackedUtil.calcValueDomain(data, /*is100Pct*/ true)).toEqual({
                min: -1,
                max: 0
            });
        });

        it('100% stacked -- rounding (+1)',() => {
            var selectionIds: SelectionId[] = [
                SelectionId.createWithMeasure("measure0"),
                SelectionId.createWithMeasure("measure1"),
            ];
            var data: powerbi.visuals.ColumnChartSeries[] =
                [{
                    key: '1', index: 0, displayName: 'measure0', identity: SelectionId.createNull(), data: [
                        {
                            categoryValue: 0,
                            value: 0.25,
                            position: 0.25,
                            valueAbsolute: 0.25,
                            valueOriginal: 0.25,
                            categoryIndex: 0,
                            seriesIndex: 0,
                            showLabel: true,
                            labelFill: 'red',
                            color: 'red',
                            selected: false,
                            originalValue: 0.25,
                            originalPosition: 0.25,
                            originalValueAbsolute: 0.25,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                        }
                    ]
                },
                    {
                        key: '2', index: 1, displayName: 'measure1', identity: SelectionId.createNull(), data: [
                            {
                                categoryValue: 0,
                                value: 0.7500001,
                                position: 1.000001,
                                valueAbsolute: 0.75000001,
                                valueOriginal: 0.7500001,
                                categoryIndex: 0,
                                seriesIndex: 1,
                                showLabel: true,
                                labelFill: 'blue',
                                color: 'blue',
                                selected: false,
                                originalValue: 0.7500001,
                                originalPosition: 1.000001,
                                originalValueAbsolute: 0.75000001,
                                identity: selectionIds[1],
                                key: selectionIds[1].getKey(),
                            }
                        ]
                    }];
            expect(StackedUtil.calcValueDomain(data, /*is100Pct*/ true)).toEqual({
                min: 0,
                max: 1
            });
        });

        it('100% stacked -- rounding (+1 and -1)',() => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("2011"),
                mocks.dataViewScopeIdentity("2012"),
            ];
            var selectionIds: SelectionId[] = [
                SelectionId.createWithIdAndMeasure(categoryIdentities[0], "measure0"),
                SelectionId.createWithIdAndMeasure(categoryIdentities[0], "measure1"),
                SelectionId.createWithIdAndMeasure(categoryIdentities[1], "measure0"),
                SelectionId.createWithIdAndMeasure(categoryIdentities[1], "measure1"),
            ];
            var data: powerbi.visuals.ColumnChartSeries[] =
                [{
                    key: '1', index: 0, displayName: 'measure0', identity: SelectionId.createNull(), data: [
                        {
                            categoryValue: 0,
                            value: -0.75,
                            position: 0,
                            valueAbsolute: 0.75,
                            valueOriginal: -0.75,
                            categoryIndex: 0,
                            seriesIndex: 0,
                            showLabel: true,
                            color: 'red',
                            selected: false,
                            originalValue: -0.75,
                            originalPosition: 0,
                            originalValueAbsolute: 0.75,
                            identity: selectionIds[0],
                            key: selectionIds[0].getKey(),
                        },
                        {
                            categoryValue: 1,
                            value: 0.25,
                            position: 0.25,
                            valueAbsolute: 0.25,
                            valueOriginal: 0.25,
                            categoryIndex: 1,
                            seriesIndex: 0,
                            showLabel: true,
                            color: 'red',
                            selected: false,
                            originalValue: 0.25,
                            originalPosition: 0.25,
                            originalValueAbsolute: 0.25,
                            identity: selectionIds[1],
                            key: selectionIds[1].getKey(),
                        }
                    ]
                },
                    {
                        key: '2', index: 1, displayName: 'measure1', identity: SelectionId.createNull(), data: [
                            {
                                categoryValue: 0,
                                value: -0.25000001,
                                position: -0.75,
                                valueAbsolute: 0.25000001,
                                valueOriginal: -0.25000001,
                                categoryIndex: 0,
                                seriesIndex: 1,
                                showLabel: true,
                                labelFill: 'blue',
                                color: 'blue',
                                selected: false,
                                originalValue: -0.25000001,
                                originalPosition: -0.75,
                                originalValueAbsolute: 0.25000001,
                                identity: selectionIds[2],
                                key: selectionIds[2].getKey(),
                            },
                            {
                                categoryValue: 1,
                                value: 0.7500001,
                                position: 1.000001,
                                valueAbsolute: 0.75000001,
                                valueOriginal: 0.7500001,
                                categoryIndex: 1,
                                seriesIndex: 1,
                                showLabel: true,
                                labelFill: 'blue',
                                color: 'blue',
                                selected: false,
                                originalValue: 0.7500001,
                                originalPosition: 1.000001,
                                originalValueAbsolute: 0.75000001,
                                identity: selectionIds[3],
                                key: selectionIds[3].getKey(),
                            }
                        ]
                    }];
            expect(StackedUtil.calcValueDomain(data, /*is100Pct*/ true)).toEqual({
                min: -1,
                max: 1
            });
        });

        it('createValueFormatter: value (hundreds)',() => {
            var columns = [measureColumn, measure2Column];
            var min = 0,
                max = 200,
                value = 100;

            expect(ClusteredUtil.createValueFormatter(columns, max - min).format(value)).toBe('$100');
            expect(StackedUtil.createValueFormatter(columns, /*is100Pct*/ false, max - min).format(value)).toBe('$100');
        });

        it('createValueFormatter: value (millions)',() => {
            var columns = [measureColumn, measure2Column];
            var min = 0,
                max = 2e6,
                value = 1e6;

            expect(ClusteredUtil.createValueFormatter(columns, max - min).format(value)).toBe('$1M');
            expect(StackedUtil.createValueFormatter(columns, /*is100Pct*/ false, max - min).format(value)).toBe('$1M');
        });

        it('createValueFormatter: 100% stacked',() => {
            var columns = [measureColumn, measure2Column];
            var min = 0,
                max = 1,
                value = .5;

            expect(StackedUtil.createValueFormatter(columns, /*is100Pct*/ true, max - min).format(value)).toBe('50%');
        });

        var categoricalData: powerbi.visuals.ColumnChartData = {
            categories: [],
            categoryFormatter: null,
            series: [],
            valuesMetadata: [],
            legendData: { dataPoints: [] },
            hasSelection: false,
            hasHighlights: false,
            selectedIds: [],
            categoryMetadata: null,
            scalarCategoryAxis: false,
            labelSettings: null,
            axesLabels: { x: null, y: null },
        };

        var metadataColumnText: powerbi.DataViewMetadataColumn = {
            name: 'NumberCol',
            type: ValueType.fromDescriptor({ text: true })
        };

        var scalarData: powerbi.visuals.ColumnChartData = {
            categories: [1, 2, 3], //just needs to be more than 1 entry to get past a guard in getCategoryThickness
            categoryFormatter: null,
            series: [{ key: '1', index: 0, displayName: '1', identity: SelectionId.createNull(), data: [] }],
            valuesMetadata: [],
            legendData: { dataPoints: [] },
            hasSelection: false,
            hasHighlights: false,
            selectedIds: [],
            categoryMetadata: null,
            scalarCategoryAxis: true,
            labelSettings: null,
            axesLabels: { x: null, y: null },
        };

        var metadataColumnNumber: powerbi.DataViewMetadataColumn = {
            name: 'NumberCol',
            type: ValueType.fromDescriptor({ numeric: true })
        };

        var metadataColumnTime: powerbi.DataViewMetadataColumn = {
            name: 'DateCol',
            type: ValueType.fromDescriptor({ dateTime: true })
        };

        it('getLayout: no category metadata',() => {
            expect(CartesianChart.getLayout(
                categoricalData,
                {
                    availableWidth: 114,
                    categoryCount: 1,
                    domain: []
                })).toEqual({
                categoryCount: 1,
                categoryThickness: 30,
                outerPaddingRatio: 1.4,
                isScalar: false
            });
        });

        it('getLayout: text (one)',() => {
            categoricalData.categories = ['A'];
            categoricalData.categoryMetadata = metadataColumnText;
            expect(CartesianChart.getLayout(
                categoricalData,
                {
                    availableWidth: 114,
                    categoryCount: 1,
                    domain: []
                })).toEqual({
                categoryCount: 1,
                categoryThickness: 30,
                outerPaddingRatio: 1.4,
                isScalar: false
            });
        });

        it('getLayout: text (few)',() => {
            categoricalData.categories = ['A', 'B', 'C', 'D', 'E', 'F'];
            categoricalData.categoryMetadata = metadataColumnText;
            expect(CartesianChart.getLayout(
                categoricalData,
                {
                    availableWidth: 204,
                    categoryCount: 6,
                    domain: []
                })).toEqual({
                categoryCount: 6,
                categoryThickness: 30,
                outerPaddingRatio: 0.4,
                isScalar: false
            });
        });

        it('getLayout: text (too many)',() => {
            var cats = [];
            for (var i = 0, len = 200; i < len; i++) {
                cats.push(Math.round(Math.random()).toString());
            }
            categoricalData.categories = cats;
            categoricalData.categoryMetadata = metadataColumnText;
            expect(CartesianChart.getLayout(
                categoricalData,
                {
                    availableWidth: 220,
                    categoryCount: 200,
                    domain: []
                })).toEqual({
                categoryCount: 10,
                categoryThickness: 20,
                outerPaddingRatio: 0.5,
                isScalar: false
            });
        });

        it('getLayout: number (few)',() => {
            var series: powerbi.visuals.ColumnChartDataPoint[] = [];
            for (var i = 0, len = 10; i < len; i++) {
                var identity: powerbi.visuals.SelectionId = SelectionId.createWithId(mocks.dataViewScopeIdentity("" + i));
                var dataPoint: powerbi.visuals.ColumnChartDataPoint = {
                    // use pow to create x values that get farther apart (testing minInterval)
                    categoryValue: i * 10 + Math.pow(i * 10, 1.8),
                    value: i % 5,
                    position: 0,
                    valueAbsolute: i % 5,
                    valueOriginal: i % 5,
                    seriesIndex: 0,
                    showLabel: true,
                    labelFill: '#41BEE9',
                    categoryIndex: i,
                    color: '#01B8AA',
                    selected: false,
                    originalValue: i % 5,
                    originalPosition: 0,
                    originalValueAbsolute: i % 5,
                    identity: identity,
                    key: identity.getKey(),
                };
                series.push(dataPoint);
            }
            scalarData.series[0].data = series;
            scalarData.categoryMetadata = metadataColumnNumber;
            expect(CartesianChart.getLayout(
                scalarData,
                {
                    availableWidth: 100,
                    categoryCount: 10,
                    domain: [0, 6400],
                    isScalar: true
                })).toEqual({
                categoryCount: 10,
                categoryThickness: 2,
                outerPaddingRatio: 0.4,
                isScalar: true
            });
        });

        it('getLayout: number (many)',() => {
            var series: powerbi.visuals.ColumnChartDataPoint[] = [];
            for (var i = 0, len = 100; i < len; i++) {
                var identity: powerbi.visuals.SelectionId = SelectionId.createWithId(mocks.dataViewScopeIdentity("" + i));
                var dataPoint: powerbi.visuals.ColumnChartDataPoint = {
                    categoryValue: i + Math.pow(i, 1.8),
                    value: i % 5,
                    position: 0,
                    valueAbsolute: i % 5,
                    valueOriginal: i % 5,
                    seriesIndex: 0,
                    showLabel: true,
                    labelFill: '#41BEE9',
                    categoryIndex: i,
                    color: '#01B8AA',
                    selected: false,
                    originalValue: i % 5,
                    originalPosition: 0,
                    originalValueAbsolute: i % 5,
                    identity: identity,
                    key: identity.getKey(),
                };
                series.push(dataPoint);
            }
            scalarData.series[0].data = series;
            scalarData.categoryMetadata = metadataColumnNumber;
            expect(CartesianChart.getLayout(
                scalarData,
                {
                    availableWidth: 100,
                    categoryCount: 100,
                    domain: [0, 4000],
                    isScalar: true
                })).toEqual({
                categoryCount: 49,
                categoryThickness: 2,
                outerPaddingRatio: 0.4,
                isScalar: true
            });
        });

        it('getLayout: datetime',() => {
            var series: powerbi.visuals.ColumnChartDataPoint[] = [];
            for (var i = 0, len = 25; i < len; i++) {
                var identity: powerbi.visuals.SelectionId = SelectionId.createWithId(mocks.dataViewScopeIdentity("" + i));
                var dataPoint: powerbi.visuals.ColumnChartDataPoint = {
                    // use fractional pow to create x values that get closer together (testing minInterval)
                    categoryValue: new Date(2000, 1, 1).getTime() + Math.pow(i, 0.66) * 86000000,
                    value: i % 5,
                    position: 0,
                    valueAbsolute: i % 5,
                    valueOriginal: i % 5,
                    seriesIndex: 0,
                    showLabel: true,
                    labelFill: '#41BEE9',
                    categoryIndex: i,
                    color: '#01B8AA',
                    selected: false,
                    originalValue: i % 5,
                    originalPosition: 0,
                    originalValueAbsolute: i % 5,
                    identity: identity,
                    key: identity.getKey(),
                };
                series.push(dataPoint);
            }
            scalarData.series[0].data = series;
            scalarData.categoryMetadata = metadataColumnTime;
            var layout = CartesianChart.getLayout(
                scalarData,
                {
                    availableWidth: 100,
                    categoryCount: 25,
                    domain: [series[0].categoryValue, series[series.length - 1].categoryValue],
                    isScalar: true
                });
            expect(layout.categoryCount).toEqual(25);
            expect(layout.categoryThickness).toBeCloseTo(2.7, 1);
            expect(layout.isScalar).toBeTruthy();
        });

        it('getLayout: datetime with highlights',() => {
            var series: powerbi.visuals.ColumnChartDataPoint[] = [];
            var idx = 0;
            for (var i = 0, len = 10; i < len; i++) {
                var identity: powerbi.visuals.SelectionId = SelectionId.createWithId(mocks.dataViewScopeIdentity("" + i));
                idx = Math.floor(i / 2);
                var dataPoint: powerbi.visuals.ColumnChartDataPoint = {
                    // use fractional pow to create x values that get closer together (testing minInterval)
                    categoryValue: new Date(2000, 1, 1).getTime() + Math.pow(idx, 0.66) * 86000000,
                    value: i % 5,
                    position: 0,
                    valueAbsolute: i % 5,
                    valueOriginal: i % 5,
                    seriesIndex: 0,
                    showLabel: true,
                    labelFill: '#41BEE9',
                    categoryIndex: idx,
                    color: '#01B8AA',
                    selected: false,
                    originalValue: i % 5,
                    originalPosition: 0,
                    originalValueAbsolute: i % 5,
                    identity: identity,
                    key: identity.getKey(),
                };
                if (i % 2 !== 0) {
                    dataPoint.highlight = true;
                }
                series.push(dataPoint);
            }
            scalarData.series[0].data = series;
            scalarData.categoryMetadata = metadataColumnTime;
            var layout = CartesianChart.getLayout(
                scalarData,
                {
                    availableWidth: 400,
                    categoryCount: idx + 1,
                    domain: [series[0].categoryValue, series[series.length - 1].categoryValue],
                    isScalar: true
                });
            expect(layout.categoryCount).toEqual(idx + 1);
            expect(layout.categoryThickness).toBeCloseTo(61, 0);
            expect(layout.isScalar).toBeTruthy();
        });

        it('getForcedTickValues: 0 forced tick count',() => {
            var expected = [];
            var actual = ColumnChart.getForcedTickValues(0, 100, 0);
            expect(actual).toEqual(expected);
        });

        it('getForcedTickValues: 0 min',() => {
            var expected = [0, 50, 100];
            var actual = ColumnChart.getForcedTickValues(0, 100, 3);
            expect(actual).toEqual(expected);
        });

        it('getForcedTickValues: 0 max',() => {
            var expected = [-200, -150, -100, -50, 0];
            var actual = ColumnChart.getForcedTickValues(-200, 0, 5);
            expect(actual).toEqual(expected);
        });

        it('getForcedTickValues: 0 between min and max',() => {
            var expected = [-20, 40, 100, 0];
            var actual = ColumnChart.getForcedTickValues(-20, 100, 3);
            expect(actual).toEqual(expected);
        });

        it('getTickCount: 6 max tick count without forced tick count',() => {
            var valuesMetadata: powerbi.DataViewMetadataColumn[] = [];
            valuesMetadata.push(measure2Column);
            var actual = ColumnUtil.getTickCount(0, 3, valuesMetadata, 6, false);
            expect(actual).toEqual(6);
        });

        it('getTickCount: 6 max tick count with 2 forced tick count',() => {
            var valuesMetadata: powerbi.DataViewMetadataColumn[] = [];
            valuesMetadata.push(measureColumn);
            var actual = ColumnUtil.getTickCount(0, 3, valuesMetadata, 6, false, 2);
            expect(actual).toEqual(2);
        });

        it('getTickCount: 0 max tick count with 2 forced tick count',() => {
            var valuesMetadata: powerbi.DataViewMetadataColumn[] = [];
            valuesMetadata.push(measureColumn);
            var actual = ColumnUtil.getTickCount(0, 3, valuesMetadata, 0, false, 2);
            expect(actual).toEqual(0);
        });

        it('getTickInterval: empty tick value',() => {
            var tickValues = [];
            var tickInterval = ColumnChart.getTickInterval(tickValues);
            expect(tickInterval).toBe(0);
        });

        it('getTickInterval: single tick value',() => {
            var tickValues = [2.35];
            var tickInterval = ColumnChart.getTickInterval(tickValues);
            expect(tickInterval).toBe(2.35);
        });

        it('getTickInterval: sorted tick values',() => {
            var tickValues = [48000, 48500, 49000, 49500, 50000];
            var tickInterval = ColumnChart.getTickInterval(tickValues);
            expect(tickInterval).toBe(500);
        });

        it('getTickInterval: unsorted tick values',() => {
            var tickValues = [48500, 49000, 48000, 49500, 50000];
            var tickInterval = ColumnChart.getTickInterval(tickValues);
            expect(tickInterval).toBe(500);
        });
    });

    function clusterColumnChartDomValidation(interactiveChart: boolean, scalarSetting: boolean) {
        var v: powerbi.IVisual, element: JQuery;

        var dataViewMetadataTwoColumn: powerbi.DataViewMetadataColumn[] = [
            {
                name: 'col1',
                type: DataShapeUtility.describeDataType(SemanticType.String)
            }, {
                name: 'col2',
                isMeasure: true,
                type: DataShapeUtility.describeDataType(SemanticType.Number)
            }
        ];
        var dataViewMetadataThreeColumn: powerbi.DataViewMetadataColumn[] = [
            {
                name: 'col1',
                type: DataShapeUtility.describeDataType(SemanticType.String)
            },
            {
                name: 'col2',
                isMeasure: true,
                type: DataShapeUtility.describeDataType(SemanticType.Number)
            },
            {
                name: 'col3',
                isMeasure: true,
                type: DataShapeUtility.describeDataType(SemanticType.Number)
            }
        ];
        var dataViewMetadataScalarDateTime: powerbi.DataViewMetadataColumn[] = [
            {
                name: 'col1',
                type: DataShapeUtility.describeDataType(SemanticType.DateTime)
            },
            {
                name: 'col2',
                isMeasure: true,
                type: DataShapeUtility.describeDataType(SemanticType.Number)
            },
            {
                name: 'col3',
                isMeasure: true,
                type: DataShapeUtility.describeDataType(SemanticType.Number)
            }
        ];

        function metadata(columns): powerbi.DataViewMetadata {
            var categoryAxisObject: powerbi.DataViewObject = scalarSetting
                ? { axisType: 'Scalar' }
                : { axisType: 'Categorical' };

            var metadata: powerbi.DataViewMetadata = {
                columns: columns,
                objects: { categoryAxis: categoryAxisObject }
            };

            return metadata;
        }

        var hostServices = powerbitests.mocks.createVisualHostServices();

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());

            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('clusteredColumnChart').create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { isInteractiveLegend: interactiveChart },
                animation: { transitionImmediate: true },
            });
        });

        it('clustered column chart dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: metadata(dataViewMetadataThreeColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataThreeColumn[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234]
                            }, {
                                source: dataViewMetadataThreeColumn[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('rect').length).toBe(4);
                expect($('.data-labels').length).toBe(0);
                done();
            }, DefaultWaitForRender);
        });

        it('clustered column chart dom validation - datetime',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("1999/3/1"),
                mocks.dataViewScopeIdentity("1999/6/20"),
                mocks.dataViewScopeIdentity("2003/6/1"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: metadata(dataViewMetadataScalarDateTime),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataScalarDateTime[0],
                            values: [new Date(1999, 3, 1), new Date(1999, 6, 20), new Date(2003, 6, 1)],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataScalarDateTime[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234, 32]
                            }, {
                                source: dataViewMetadataScalarDateTime[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88, 44]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('rect').length).toBe(6);
                if (scalarSetting) {
                    expect(+$('rect')[1].attributes.getNamedItem('x').value).toBeCloseTo(31, 0);
                    expect(+$('rect')[1].attributes.getNamedItem('width').value).toBeCloseTo(12, 0);
                }
                else {
                    expect(+$('rect')[1].attributes.getNamedItem('x').value).toBeCloseTo(179, 0);
                    expect(+$('rect')[1].attributes.getNamedItem('width').value).toBeCloseTo(48, 0);
                }
                done();
            }, DefaultWaitForRender);
        });

        it('clustered column chart dom validation - null datetime',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("1999/3/1"),
                mocks.dataViewScopeIdentity(null),
                mocks.dataViewScopeIdentity("2003/6/1"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: metadata(dataViewMetadataScalarDateTime),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataScalarDateTime[0],
                            values: [new Date(1999, 3, 1), null, new Date(2003, 6, 1)],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataScalarDateTime[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234, 32]
                            }, {
                                source: dataViewMetadataScalarDateTime[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88, 44]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                if (scalarSetting) {
                    expect($('rect').length).toBe(4);
                    expect(+$('rect')[1].attributes.getNamedItem('x').value).toBeCloseTo(363, 0);
                    expect(+$('rect')[1].attributes.getNamedItem('width').value).toBeCloseTo(48, 0);
                }
                else {
                    expect($('rect').length).toBe(6);
                    expect(+$('rect')[1].attributes.getNamedItem('x').value).toBeCloseTo(179, 0);
                    expect(+$('rect')[1].attributes.getNamedItem('width').value).toBeCloseTo(48, 0);
                }
                done();
            }, DefaultWaitForRender);
        });

        it('clustered column chart partial highlight dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: metadata(dataViewMetadataThreeColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataThreeColumn[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [54, 204]
                            }, {
                                source: dataViewMetadataThreeColumn[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                                highlights: [6, 66]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('rect').length).toBe(8);
                expect($('.column').length).toBe(8);
                expect($('.highlight').length).toBe(4);
                expect(+$('.highlight')[0].attributes.getNamedItem('height').value)
                    .toBeLessThan(+$('.column')[0].attributes.getNamedItem('height').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('y').value)
                    .toBeGreaterThan(+$('.column')[0].attributes.getNamedItem('y').value);
                done();
            }, DefaultWaitForRender);
        });

        it('clustered column chart negative partial highlight dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: metadata(dataViewMetadataThreeColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataThreeColumn[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [-123, -234],
                                highlights: [-54, -204]
                            }, {
                                source: dataViewMetadataThreeColumn[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [-12, -88],
                                highlights: [-6, -66]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('rect').length).toBe(8);
                expect($('.column').length).toBe(8);
                expect($('.highlight').length).toBe(4);
                expect(+$('.highlight')[0].attributes.getNamedItem('height').value)
                    .toBeLessThan(+$('.column')[0].attributes.getNamedItem('height').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('y').value)
                    .toEqual(+$('.column')[0].attributes.getNamedItem('y').value);
                done();
            }, DefaultWaitForRender);
        });

        it('clustered column chart partial highlights with overflow dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: metadata(dataViewMetadataThreeColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataThreeColumn[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [157, 260]
                            }, {
                                source: dataViewMetadataThreeColumn[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                                highlights: [18, 102]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('rect').length).toBe(8);
                expect($('.column').length).toBe(8);
                expect($('.highlight').length).toBe(4);
                expect(+$('.highlight')[0].attributes.getNamedItem('height').value)
                    .toBeGreaterThan(+$('.column')[0].attributes.getNamedItem('height').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('y').value)
                    .toBeLessThan(+$('.column')[0].attributes.getNamedItem('y').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('width').value)
                    .toBeLessThan(+$('.column')[0].attributes.getNamedItem('width').value);
                done();
            }, DefaultWaitForRender);
        });

        it('clustered column chart partial highlights with positive/negative mix dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: metadata(dataViewMetadataThreeColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataThreeColumn[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [-54, -204]
                            }, {
                                source: dataViewMetadataThreeColumn[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                                highlights: [-6, -66]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('rect').length).toBe(8);
                expect($('.column').length).toBe(8);
                expect($('.highlight').length).toBe(4);
                expect(+$('.highlight')[0].attributes.getNamedItem('height').value)
                    .toBeLessThan(+$('.column')[0].attributes.getNamedItem('height').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('y').value)
                    .toBeGreaterThan(+$('.column')[0].attributes.getNamedItem('y').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('width').value)
                    .toBeLessThan(+$('.column')[0].attributes.getNamedItem('width').value);
                done();
            }, DefaultWaitForRender);
        });

        it('clustered column chart missing measure in first series to not be dropped in dom',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: metadata(dataViewMetadataThreeColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataThreeColumn[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [null, 123]
                            }, {
                                source: dataViewMetadataThreeColumn[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 23]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(4);
                expect($('rect').length).toBe(4);
                expect($('.columnChart .axisGraphicsContext .x.axis .tick').find('text').last().text()).toBe('def');
                done();
            }, DefaultWaitForRender);
        });

        it('clustered column chart missing measure dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: metadata(dataViewMetadataThreeColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataThreeColumn[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234]
                            }, {
                                source: dataViewMetadataThreeColumn[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, null]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(3);
                expect($('rect').length).toBe(3);
                expect($('.columnChart .axisGraphicsContext .x.axis .tick').find('text').last().text()).toBe('def');
                done();
            }, DefaultWaitForRender);
        });

        it('clustered column chart with near zero measures dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: metadata(dataViewMetadataThreeColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataThreeColumn[1],
                                values: [0.0001, 234]
                            }, {
                                source: dataViewMetadataThreeColumn[2],
                                values: [12, -0.0001]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(4);
                expect($('rect').length).toBe(4);
                var smallPositiveRectYValue = $('.column')[0].attributes.getNamedItem('y').value;
                var smallNegativeRectYValue = $('.column')[3].attributes.getNamedItem('y').value;
                expect(smallPositiveRectYValue).not.toEqual(smallNegativeRectYValue);
                done();
            }, DefaultWaitForRender);
        });

        it('empty clustered column chart dom validation',(done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: metadata(dataViewMetadataTwoColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn[0],
                            values: []
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn[1],
                            values: []
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.columnChart .axisGraphicsContext .x.axis .tick').length).toBe(0);
                expect($('.columnChart .axisGraphicsContext .y.axis .tick').length).toBeGreaterThan(0);
                expect($('.columnChart .axisGraphicsContext .y.axis .tick').find('text').last().text()).toBe('10');
                done();
            }, DefaultWaitForRender);
        });

        it('clustered column chart with small interval dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("a"),
                mocks.dataViewScopeIdentity("b"),
                mocks.dataViewScopeIdentity("c"),
                mocks.dataViewScopeIdentity("d"),
                mocks.dataViewScopeIdentity("e"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: metadata(dataViewMetadataTwoColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn[1],
                            values: [0.5, 2.0, 1.5, 1.0, 2.5]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.columnChart .axisGraphicsContext .x.axis .tick').length).toBeGreaterThan(0);
                expect($('.columnChart .axisGraphicsContext .y.axis .tick').length).toBeGreaterThan(0);
                expect($('.columnChart .axisGraphicsContext .y.axis .tick').find('text').last().text()).toBe('2.50');
                done();
            }, DefaultWaitForRender);
        });

        it('clustered column chart should be cleared when empty dataview is applied',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("a"),
                mocks.dataViewScopeIdentity("b"),
                mocks.dataViewScopeIdentity("c"),
                mocks.dataViewScopeIdentity("d"),
                mocks.dataViewScopeIdentity("e"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: metadata(dataViewMetadataTwoColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn[1],
                            values: [0.5, 2.0, 1.5, 1.0, 2.5]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('rect').length).toBeGreaterThan(0);

                v.onDataChanged({
                    dataViews: [{
                        metadata: metadata(dataViewMetadataTwoColumn),
                        categorical: {
                            categories: [{
                                source: dataViewMetadataTwoColumn[0],
                                values: []
                            }],
                            values: DataViewTransform.createValueColumns([])
                        }
                    }]
                });
                setTimeout(() => {
                    expect($('rect').length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        if (!interactiveChart) {
            it('legend formatting', (done) => {
                var categoryIdentities = [
                    mocks.dataViewScopeIdentity("abc"),
                    mocks.dataViewScopeIdentity("def"),
                ];

                var dataView = {
                    metadata: metadata(dataViewMetadataThreeColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataThreeColumn[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234]
                            }, {
                                source: dataViewMetadataThreeColumn[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88]
                            }])
                    }
                };

                dataView.metadata.objects = { legend: { show: true, position: 'Top' } };

                v.onDataChanged({
                    dataViews: [dataView]
                });

                setTimeout(() => {
                    expect($('.legend').attr('orientation')).toBe(LegendPosition.Top.toString());
                    //change legend position
                    dataView.metadata.objects = { legend: { show: true, position: 'Right' } };
                    v.onDataChanged({
                        dataViews: [dataView]
                    });
                    setTimeout(() => {                   
                        expect($('.legend').attr('orientation')).toBe(LegendPosition.Right.toString());                   
                        //set title
                        var testTitle = 'Test Title';
                        dataView.metadata.objects = { legend: { show: true, position: 'Right', showTitle: true, titleText: testTitle } };
                        v.onDataChanged({
                            dataViews: [dataView]
                        });
                        setTimeout(() => {                           
                            expect($('.legend').attr('orientation')).toBe(LegendPosition.Right.toString());    
                            expect($('.legendTitle').text()).toBe(testTitle);                          
                            //hide legend
                            dataView.metadata.objects = { legend: { show: false, position: 'Right' } };
                            v.onDataChanged({
                                dataViews: [dataView]
                            });
                            setTimeout(() => {                             
                                expect($('.legend').attr('orientation')).toBe(LegendPosition.None.toString());                               
                                done();
                            }, DefaultWaitForRender);
                        }, DefaultWaitForRender);
                    }, DefaultWaitForRender);
                }, DefaultWaitForRender);
            });
        }        
    }              

    describe("Clustered ColumnChart DOM validation",() => clusterColumnChartDomValidation(false, false));
    describe("Clustered ColumnChart DOM validation - Scalar",() => clusterColumnChartDomValidation(false, true));

    describe("Interactive Clustered ColumnChart DOM validation",() => clusterColumnChartDomValidation(true, false));
    describe("Interactive Clustered ColumnChart DOM validation - Scalar",() => clusterColumnChartDomValidation(true, true));

    function stackedColumnChartDomValidation(interactiveChart: boolean) {
        var v: powerbi.IVisual, element: JQuery;
        var dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    name: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                }, {
                    name: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                }
            ],
        };
        var dataViewMetadataFourColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    name: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                }, {
                    name: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Integer)
                }, {
                    name: 'col3',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                }],
        };
        var hostServices = powerbitests.mocks.createVisualHostServices();

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());

            element = powerbitests.helpers.testDom('300', '300');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('columnChart').create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { isInteractiveLegend: interactiveChart },
                animation: { transitionImmediate: true },
            });
        });

        it('single measure column chart dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 100000,
                            max: 200000,
                            subtotal: 300000,
                            values: [100000, 200000]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('rect').length).toBe(2);
                expect($('.data-labels').length).toBe(0);
                expect($('.columnChart .axisGraphicsContext .y.axis .tick').find('text').last().text()).toBe('200K');
                if (interactiveChart) expect($('.interactive-legend').length).toBe(1);
                else expect($('.legend').attr('orientation')).toBe(LegendPosition.None.toString());
                done();
            }, DefaultWaitForRender);
        });

        it('single measure column chart with too many values for view dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("a"),
                mocks.dataViewScopeIdentity("b"),
                mocks.dataViewScopeIdentity("c"),
                mocks.dataViewScopeIdentity("d"),
                mocks.dataViewScopeIdentity("e"),
                mocks.dataViewScopeIdentity("f"),
                mocks.dataViewScopeIdentity("g"),
                mocks.dataViewScopeIdentity("h"),
                mocks.dataViewScopeIdentity("i"),
                mocks.dataViewScopeIdentity("j"),
                mocks.dataViewScopeIdentity("k"),
                mocks.dataViewScopeIdentity("l"),
                mocks.dataViewScopeIdentity("m"),
                mocks.dataViewScopeIdentity("n"),
                mocks.dataViewScopeIdentity("o"),
                mocks.dataViewScopeIdentity("p"),
                mocks.dataViewScopeIdentity("q"),
                mocks.dataViewScopeIdentity("r"),
                mocks.dataViewScopeIdentity("s"),
                mocks.dataViewScopeIdentity("y"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 10,
                            max: 30,
                            subtotal: 420,
                            values: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();

                // Data should be spliced down to a smaller set that will fit inside the view
                expect($('.column').length).toBe(13);
                expect($('rect').length).toBe(13);

                // The max value in the view is ...
                expect($('.columnChart .axisGraphicsContext .y.axis .tick').find('text').last().text()).toBe('25');

                if (interactiveChart) expect($('.interactive-legend').length).toBe(1);
                else expect($('.legend').attr('orientation')).toBe(LegendPosition.None.toString());

                // now update with empty series values to test corner case where we slice the category data but have no series data
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataTwoColumn,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataTwoColumn.columns[0],
                                values: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't'],
                                identity: categoryIdentities,
                            }],
                            values: DataViewTransform.createValueColumns([])
                        }
                    }]
                });
                setTimeout(() => {
                    expect($('rect').length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it('stacked column chart dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFourColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFourColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFourColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234]
                            }, {
                                source: dataViewMetadataFourColumn.columns[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(4);
                expect($('rect').length).toBe(4);
                var legendSelector: string = interactiveChart ? '.interactive-legend' : '.legend';
                expect($(legendSelector).length).toBe(1);
                expect($(legendSelector + (interactiveChart ? ' .item' : 'Item')).length).toBe(2);
                done();
            }, DefaultWaitForRender);
        });

        it('stacked column chart with partial highlight dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFourColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFourColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFourColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [54, 204]
                            }, {
                                source: dataViewMetadataFourColumn.columns[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                                highlights: [6, 66]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('rect').length).toBe(8);
                expect($('.column').length).toBe(8);
                expect($('.highlight').length).toBe(4);
                expect(+$('.highlight')[0].attributes.getNamedItem('height').value)
                    .toBeLessThan(+$('.column')[0].attributes.getNamedItem('height').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('y').value)
                    .toBeGreaterThan(+$('.column')[0].attributes.getNamedItem('y').value);
                var legendSelector: string = interactiveChart ? '.interactive-legend' : '.legend';
                expect($(legendSelector).length).toBe(1);
                expect($(legendSelector + (interactiveChart ? ' .item' : 'Item')).length).toBe(2);
                done();
            }, DefaultWaitForRender);
        });

        it('stacked column chart with negative partial highlight dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFourColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFourColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFourColumn.columns[1],
                                min: -234,
                                max: -123,
                                subtotal: -357,
                                values: [-123, -234],
                                highlights: [-54, -204]
                            }, {
                                source: dataViewMetadataFourColumn.columns[2],
                                min: -88,
                                max: -12,
                                subtotal: -100,
                                values: [-12, -88],
                                highlights: [-6, -66]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('rect').length).toBe(8);
                expect($('.column').length).toBe(8);
                expect($('.highlight').length).toBe(4);
                expect(+$('.highlight')[0].attributes.getNamedItem('height').value)
                    .toBeLessThan(+$('.column')[0].attributes.getNamedItem('height').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('y').value)
                    .toBe(+$('.column')[0].attributes.getNamedItem('y').value);
                var legendSelector: string = interactiveChart ? '.interactive-legend' : '.legend';
                expect($(legendSelector).length).toBe(1);
                expect($(legendSelector + (interactiveChart ? ' .item' : 'Item')).length).toBe(2);
                done();
            }, DefaultWaitForRender);
        });

        it('stacked column chart with partial highlight with overflow dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFourColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFourColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFourColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [154, 274]
                            }, {
                                source: dataViewMetadataFourColumn.columns[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                                highlights: [26, 166]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('rect').length).toBe(4);
                expect($('.column').length).toBe(4);
                expect($('.highlight').length).toBe(0);
                var legendSelector: string = interactiveChart ? '.interactive-legend' : '.legend';
                expect($(legendSelector).length).toBe(1);
                expect($(legendSelector + (interactiveChart ? ' .item' : 'Item')).length).toBe(2);
                done();
            }, DefaultWaitForRender);
        });

        it('stacked column chart with partial highlight with postitive/negative mix dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFourColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFourColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFourColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [-54, -204]
                            }, {
                                source: dataViewMetadataFourColumn.columns[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                                highlights: [-6, -66]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('rect').length).toBe(4);
                expect($('.column').length).toBe(4);
                expect($('.highlight').length).toBe(0);
                var legendSelector: string = interactiveChart ? '.interactive-legend' : '.legend';
                expect($(legendSelector).length).toBe(1);
                expect($(legendSelector + (interactiveChart?' .item':'Item')).length).toBe(2);
                done();
            }, DefaultWaitForRender);
        });

        it('stacked column chart missing measure dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFourColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFourColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFourColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234]
                            }, {
                                source: dataViewMetadataFourColumn.columns[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, null]
                            }])
                    }
                }]
            });
            v.onResizing({ height: 500, width: 500 }, 0);

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(3);
                expect($('rect').length).toBe(3);
                expect($('.columnChart .axisGraphicsContext .x.axis .tick').find('text').last().text()).toBe('def');
                done();
            }, DefaultWaitForRender);
        });

        it('stacked column chart with near zero measures dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFourColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFourColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFourColumn.columns[1],
                                values: [0.0001, 234]
                            }, {
                                source: dataViewMetadataFourColumn.columns[2],
                                values: [12, -0.0001]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(4);
                expect($('rect').length).toBe(4);
                var smallPositiveRectYValue = $('.column')[0].attributes.getNamedItem('y').value;
                var smallNegativeRectYValue = $('.column')[3].attributes.getNamedItem('y').value;
                expect(smallPositiveRectYValue).not.toEqual(smallNegativeRectYValue);
                done();
            }, DefaultWaitForRender);
        });

        it('stacked column chart optimal ticks dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFourColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFourColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFourColumn.columns[1],
                                values: [1, 3]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(2);
                expect($('rect').length).toBe(2);
                expect($('.columnChart .axisGraphicsContext .y.axis .tick').length).toBe(4);
                expect($('.columnChart .axisGraphicsContext .y.axis .tick').find('text').last().text()).toBe('3');
                done();
            }, DefaultWaitForRender);
        });

        it('empty stacked column chart dom validation',(done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: []
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: []
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.columnChart .axisGraphicsContext .x.axis .tick').length).toBe(0);
                expect($('.columnChart .axisGraphicsContext .y.axis .tick').length).toBeGreaterThan(0);
                expect($('.columnChart .axisGraphicsContext .y.axis .tick').find('text').last().text()).toBe('10');
                done();
            }, DefaultWaitForRender);
        });

        it('stacked column chart with small interval dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("a"),
                mocks.dataViewScopeIdentity("b"),
                mocks.dataViewScopeIdentity("c"),
                mocks.dataViewScopeIdentity("d"),
                mocks.dataViewScopeIdentity("e"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0, 1.5, 1.0, 2.5]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.columnChart .axisGraphicsContext .x.axis .tick').length).toBeGreaterThan(0);
                expect($('.columnChart .axisGraphicsContext .y.axis .tick').length).toBeGreaterThan(0);
                expect($('.columnChart .axisGraphicsContext .y.axis .tick').find('text').last().text()).toBe('2.50');
                done();
            }, DefaultWaitForRender);
        });

        it('stacked column chart should be cleared when empty dataview is applied',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("a"),
                mocks.dataViewScopeIdentity("b"),
                mocks.dataViewScopeIdentity("c"),
                mocks.dataViewScopeIdentity("d"),
                mocks.dataViewScopeIdentity("e"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0, 1.5, 1.0, 2.5]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('rect').length).toBeGreaterThan(0);

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataTwoColumn,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataTwoColumn.columns[0],
                                values: []
                            }],
                            values: DataViewTransform.createValueColumns([])
                        }
                    }]
                });
                setTimeout(() => {
                    expect($('rect').length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });
    }

    describe("Stacked ColumnChart DOM validation",() => stackedColumnChartDomValidation(false));

    describe("Interactive Stacked ColumnChart DOM validation",() => stackedColumnChartDomValidation(true));

    function hundredPercentStackedColumnChartDomValidation(interactiveChart: boolean) {
        var v: powerbi.IVisual, element: JQuery;
        var dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    name: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                },
                {
                    name: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                }
            ],
        };
        var dataViewMetadataFourColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    name: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                },
                {
                    name: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                },
                {
                    name: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                }],
        };
        var hostServices = powerbitests.mocks.createVisualHostServices();

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());

            element = powerbitests.helpers.testDom('300', '300');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('hundredPercentStackedColumnChart').create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { isInteractiveLegend: interactiveChart },
                animation: { transitionImmediate: true },
            });
        });

        it('single measure hundred percent column chart dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFourColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFourColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataFourColumn.columns[1],
                            min: 100000,
                            max: 200000,
                            subtotal: 300000,
                            values: [100000, 200000]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(2);
                expect($('rect').length).toBe(2);
                expect($('.columnChart .axisGraphicsContext .y.axis .tick').find('text').last().text()).toBe('100%');
                done();
            }, DefaultWaitForRender);
        });

        it('single measure partial highlight hundred percent column chart dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFourColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFourColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataFourColumn.columns[1],
                            min: 100000,
                            max: 200000,
                            subtotal: 300000,
                            values: [100000, 200000],
                            highlights: [50000, 10000]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(4);
                expect($('.highlight').length).toBe(2);
                expect($('rect').length).toBe(4);
                expect(+$('.highlight')[0].attributes.getNamedItem('height').value)
                    .toBeLessThan(+$('.column')[0].attributes.getNamedItem('height').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('y').value)
                    .toBeGreaterThan(+$('.column')[0].attributes.getNamedItem('y').value);
                expect($('.columnChart .axisGraphicsContext .y.axis .tick').find('text').last().text()).toBe('100%');
                done();
            }, DefaultWaitForRender);
        });

        it('multi measure hundred percent column chart dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFourColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFourColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFourColumn.columns[1],
                                min: 100000,
                                max: 200000,
                                subtotal: 300000,
                                values: [100000, 200000]
                            }, {
                                source: dataViewMetadataFourColumn.columns[2],
                                min: 100000,
                                max: 200000,
                                subtotal: 300000,
                                values: [100000, 200000]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.column').length).toBe(4);
                expect($('rect').length).toBe(4);
                expect($('.columnChart .axisGraphicsContext .y.axis .tick').find('text').last().text()).toBe('100%');
                done();
            }, DefaultWaitForRender);
        });

        it('empty hundred percent column chart dom validation',(done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: []
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: []
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.columnChart .axisGraphicsContext .x.axis .tick').length).toBe(0);
                expect($('.columnChart .axisGraphicsContext .y.axis .tick').length).toBeGreaterThan(0);
                done();
            }, DefaultWaitForRender);
        });

        it('hundred percent column chart should be cleared when empty dataview is applied',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("a"),
                mocks.dataViewScopeIdentity("b"),
                mocks.dataViewScopeIdentity("c"),
                mocks.dataViewScopeIdentity("d"),
                mocks.dataViewScopeIdentity("e"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0, 1.5, 1.0, 2.5]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('rect').length).toBeGreaterThan(0);

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataTwoColumn,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataTwoColumn.columns[0],
                                values: []
                            }],
                            values: DataViewTransform.createValueColumns([])
                        }
                    }]
                });
                setTimeout(() => {
                    expect($('rect').length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

    }

    describe("Hundred Percent Stacked ColumnChart DOM validation",() => hundredPercentStackedColumnChartDomValidation(false));

    describe("Interactive Hundred Percent Stacked ColumnChart DOM validation",() => hundredPercentStackedColumnChartDomValidation(true));

    function stackedBarChartDomValidation(interactiveChart: boolean) {
        var v: powerbi.IVisual, element: JQuery;
        var dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    name: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                },
                {
                    name: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                }]
        };
        var dataViewMetadataFourColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    name: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                },
                {
                    name: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Integer)
                },
                {
                    name: 'col3',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                }]
        };
        var hostServices = powerbitests.mocks.createVisualHostServices();

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());

            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('barChart').create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { isInteractiveLegend: interactiveChart },
                animation: { transitionImmediate: true },
            });
        });

        it('single measure bar chart long labels dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("this is the label that never ends, it just goes on and on my friends. Some axis started rendering it not knowing what it was, and now it keeps on rendering forever just because this the label that never ends..."),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['this is the label that never ends, it just goes on and on my friends. Some axis started rendering it not knowing what it was, and now it keeps on rendering forever just because this the label that never ends...', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 100000,
                            max: 200000,
                            subtotal: 300000,
                            values: [100000, 200000]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(2);
                expect($('rect').length).toBe(2);
                expect($('.data-labels').length).toBe(0);

                // Y-axis margin should be limited to a % of the chart area, and excess text should be replaced with an ellipsis.
                expect($('.columnChart .axisGraphicsContext').attr('transform')).toBe('translate(100,8)');

                // Note: the exact text will be different depending on the environment in which the test is run, so we can't do an exact match.
                // Just check that the text is truncated with ellipses.
                var labelText = $('.columnChart .axisGraphicsContext .y.axis .tick').find('text').first().text();
                expect(labelText.length).toBeLessThan(30);
                expect(labelText.substr(labelText.length - 3)).toBe('...');

                done();
            }, DefaultWaitForRender);
        });

        it('single measure bar chart dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 100000,
                            max: 200000,
                            subtotal: 300000,
                            values: [100000, 200000]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(2);
                expect($('rect').length).toBe(2);
                expect($('.columnChart .axisGraphicsContext .x.axis .tick').find('text').last().text()).toBe('200K');
                expect($('.columnChart .axisGraphicsContext .y.axis .tick').find('text').last().text()).toBe('def');
                done();
            }, DefaultWaitForRender);
        });

        it('stacked bar chart dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFourColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFourColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFourColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234]
                            }, {
                                source: dataViewMetadataFourColumn.columns[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(4);
                expect($('rect').length).toBe(4);
                done();
            }, DefaultWaitForRender);
        });

        it('stacked bar chart partial highlight dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFourColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFourColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFourColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [54, 204]
                            }, {
                                source: dataViewMetadataFourColumn.columns[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                                highlights: [6, 66]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(8);
                expect($('.highlight').length).toBe(4);
                expect($('rect').length).toBe(8);
                expect(+$('.highlight')[0].attributes.getNamedItem('width').value)
                    .toBeLessThan(+$('.bar')[0].attributes.getNamedItem('width').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('x').value)
                    .toBe(+$('.bar')[0].attributes.getNamedItem('x').value);
                done();
            }, DefaultWaitForRender);
        });

        it('stacked bar chart negative partial highlight dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFourColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFourColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFourColumn.columns[1],
                                min: -234,
                                max: -123,
                                subtotal: -357,
                                values: [-123, -234],
                                highlights: [-54, -204]
                            }, {
                                source: dataViewMetadataFourColumn.columns[2],
                                min: -88,
                                max: -12,
                                subtotal: -100,
                                values: [-12, -88],
                                highlights: [-6, -66]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(8);
                expect($('.highlight').length).toBe(4);
                expect($('rect').length).toBe(8);
                expect(+$('.highlight')[0].attributes.getNamedItem('width').value)
                    .toBeLessThan(+$('.bar')[0].attributes.getNamedItem('width').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('x').value)
                    .toBeGreaterThan(+$('.bar')[0].attributes.getNamedItem('x').value);
                done();
            }, DefaultWaitForRender);
        });

        it('stacked bar chart partial highlight with overflow dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFourColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFourColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFourColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [154, 264]
                            }, {
                                source: dataViewMetadataFourColumn.columns[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                                highlights: [16, 166]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(4);
                expect($('rect').length).toBe(4);
                expect($('.highlight').length).toBe(0);
                done();
            }, DefaultWaitForRender);
        });

        it('stacked bar chart partial highlight with positive/negative mix dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFourColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFourColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFourColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [-54, -204]
                            }, {
                                source: dataViewMetadataFourColumn.columns[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                                highlights: [-6, -66]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(4);
                expect($('rect').length).toBe(4);
                expect($('.highlight').length).toBe(0);
                done();
            }, DefaultWaitForRender);
        });

        it('incremental render bar chart one to multiple series bar chart dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 100000,
                            max: 200000,
                            subtotal: 300000,
                            values: [100000, 200000]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(2);
                expect($('rect').length).toBe(2);
                expect($('.columnChart .axisGraphicsContext .x.axis .tick').find('text').last().text()).toBe('200K');
                expect($('.columnChart .axisGraphicsContext .y.axis .tick').find('text').last().text()).toBe('def');

                // Legend should be empty, axis should be further up to take the extra space.
                if (!interactiveChart) expect($('.legendItem')).not.toBeInDOM();
                
                // Note: depending on where the tests is run there can be a 1 pixel difference in the location of the axis
                //expect($('.columnChart .axisGraphicsContext').attr('transform')).toBe('translate(25,8)');
                //expect(helpers.isTranslateCloseTo($('.columnChart .axisGraphicsContext').attr('transform'), 25, 8)).toBe(true);

                // Update the data set so that the chart is redrawn with multiple series and a legend
                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataFourColumn,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataFourColumn.columns[0],
                                values: ['abc', 'def'],
                                identity: categoryIdentities,
                            }],
                            values: DataViewTransform.createValueColumns([
                                {
                                    source: dataViewMetadataFourColumn.columns[1],
                                    min: 123,
                                    max: 234,
                                    subtotal: 357,
                                    values: [123, 234]
                                }, {
                                    source: dataViewMetadataFourColumn.columns[2],
                                    min: 12,
                                    max: 88,
                                    subtotal: 100,
                                    values: [12, 88]
                                }])
                        }
                    }]
                });

                setTimeout(() => {
                    expect($('.columnChart')).toBeInDOM();
                    expect($('.bar').length).toBe(4);
                    expect($('rect').length).toBe(4);

                    // Legend should be visible, axis shouldn't need to move, since we use relative layout
                    var legendSelector: string = interactiveChart ? '.interactive-legend' : '.legend';
                    expect($(legendSelector)).toBeInDOM();
                    expect($(legendSelector).children.length).toBe(2);

                    //expect(helpers.isTranslateCloseTo($('.columnChart .axisGraphicsContext').attr('transform'), 28, 8)).toBe(true);

                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it('stacked bar chart missing measure dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFourColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFourColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFourColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234]
                            }, {
                                source: dataViewMetadataFourColumn.columns[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, null]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(3);
                expect($('rect').length).toBe(3);
                done();
            }, DefaultWaitForRender);
        });

        it('stacked bar chart with near zero measures dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFourColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFourColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFourColumn.columns[1],
                                values: [0.0001, 234]
                            }, {
                                source: dataViewMetadataFourColumn.columns[2],
                                values: [12, -0.0001]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(4);
                expect($('rect').length).toBe(4);
                var smallPositiveRectXValue = $('.bar')[0].attributes.getNamedItem('x').value;
                var smallNegativeRectXValue = $('.bar')[3].attributes.getNamedItem('x').value;
                expect(smallPositiveRectXValue).not.toEqual(smallNegativeRectXValue);
                done();
            }, DefaultWaitForRender);
        });

        it('stacked bar chart optimal ticks dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFourColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFourColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFourColumn.columns[1],
                                values: [1, 3]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(2);
                expect($('rect').length).toBe(2);
                expect($('.columnChart .axisGraphicsContext .x.axis .tick').length).toBe(4);
                expect($('.columnChart .axisGraphicsContext .x.axis .tick').find('text').last().text()).toBe('3');
                done();
            }, DefaultWaitForRender);
        });

        it('empty stacked bar chart dom validation',(done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: []
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: []
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.columnChart .axisGraphicsContext .y.axis .tick').length).toBe(0);
                expect($('.columnChart .axisGraphicsContext .x.axis .tick').length).toBeGreaterThan(0);
                expect($('.columnChart .axisGraphicsContext .x.axis .tick').find('text').last().text()).toBe('10');
                done();
            }, DefaultWaitForRender);
        });

        it('stacked bar chart with small interval dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("a"),
                mocks.dataViewScopeIdentity("b"),
                mocks.dataViewScopeIdentity("c"),
                mocks.dataViewScopeIdentity("d"),
                mocks.dataViewScopeIdentity("e"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0, 1.5, 1.0, 2.5]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.columnChart .axisGraphicsContext .x.axis .tick').length).toBeGreaterThan(0);
                expect($('.columnChart .axisGraphicsContext .y.axis .tick').length).toBeGreaterThan(0);
                expect($('.columnChart .axisGraphicsContext .x.axis .tick').find('text').last().text()).toBe('2.50');
                done();
            }, DefaultWaitForRender);
        });

        it('stacked bar chart should be cleared when empty dataview is applied',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("a"),
                mocks.dataViewScopeIdentity("b"),
                mocks.dataViewScopeIdentity("c"),
                mocks.dataViewScopeIdentity("d"),
                mocks.dataViewScopeIdentity("e"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0, 1.5, 1.0, 2.5]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('rect').length).toBeGreaterThan(0);

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataTwoColumn,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataTwoColumn.columns[0],
                                values: []
                            }],
                            values: DataViewTransform.createValueColumns([])
                        }
                    }]
                });
                setTimeout(() => {
                    expect($('rect').length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });
    }

    describe("Stacked BarChart DOM validation",() => stackedBarChartDomValidation(false));

    describe("Interactive Stacked BarChart DOM validation",() => stackedBarChartDomValidation(true));

    function hundredPercentStackedBarChartDomValidation(interactiveChart: boolean) {
        var v: powerbi.IVisual, element: JQuery;
        var dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    name: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                },
                {
                    name: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                }
            ],
        };
        var dataViewMetadataFourColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    name: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                },
                {
                    name: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                },
                {
                    name: 'col3',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                }]
        };
        var hostServices = powerbitests.mocks.createVisualHostServices();

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());

            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('hundredPercentStackedBarChart').create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { isInteractiveLegend: interactiveChart },
                animation: { transitionImmediate: true },
            });
        });

        it('single measure hundred percent bar chart dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFourColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFourColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataFourColumn.columns[1],
                            min: 100000,
                            max: 200000,
                            subtotal: 300000,
                            values: [100000, 200000]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(2);
                expect($('rect').length).toBe(2);
                expect($('.columnChart .axisGraphicsContext .x.axis .tick').find('text').last().text()).toBe('100%');
                done();
            }, DefaultWaitForRender);
        });

        it('single measure partial highlight hundred percent bar chart dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFourColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFourColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataFourColumn.columns[1],
                            min: 100000,
                            max: 200000,
                            subtotal: 300000,
                            values: [100000, 200000],
                            highlights: [50000, 10000]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(4);
                expect($('.highlight').length).toBe(2);
                expect($('rect').length).toBe(4);
                expect(+$('.highlight')[0].attributes.getNamedItem('width').value)
                    .toBeLessThan(+$('.bar')[0].attributes.getNamedItem('width').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('x').value)
                    .toBe(+$('.bar')[0].attributes.getNamedItem('x').value);
                expect($('.columnChart .axisGraphicsContext .x.axis .tick').find('text').last().text()).toBe('100%');
                done();
            }, DefaultWaitForRender);
        });

        it('multi measure hundred percent bar chart dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFourColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFourColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFourColumn.columns[1],
                                min: 100000,
                                max: 200000,
                                subtotal: 300000,
                                values: [100000, 200000]
                            }, {
                                source: dataViewMetadataFourColumn.columns[2],
                                min: 100000,
                                max: 200000,
                                subtotal: 300000,
                                values: [100000, 200000]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(4);
                expect($('rect').length).toBe(4);
                expect($('.columnChart .axisGraphicsContext .x.axis .tick').find('text').last().text()).toBe('100%');
                done();
            }, DefaultWaitForRender);
        });

        it('empty hundred percent bar chart dom validation',(done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: []
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: []
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.columnChart .axisGraphicsContext .y.axis .tick').length).toBe(0);
                expect($('.columnChart .axisGraphicsContext .x.axis .tick').length).toBeGreaterThan(0);
                done();
            }, DefaultWaitForRender);
        });

        it('hundred percent bar chart should be cleared when empty dataview is applied',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("a"),
                mocks.dataViewScopeIdentity("b"),
                mocks.dataViewScopeIdentity("c"),
                mocks.dataViewScopeIdentity("d"),
                mocks.dataViewScopeIdentity("e"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0, 1.5, 1.0, 2.5]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('rect').length).toBeGreaterThan(0);

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataTwoColumn,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataTwoColumn.columns[0],
                                values: []
                            }],
                            values: DataViewTransform.createValueColumns([])
                        }
                    }]
                });
                setTimeout(() => {
                    expect($('rect').length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

    }

    describe("Hundred Percent Stacked BarChart DOM validation",() => hundredPercentStackedBarChartDomValidation(false));

    describe("Interactive Hundred Percent Stacked BarChart DOM validation",() => hundredPercentStackedBarChartDomValidation(true));

    function clusterdBarChartDomValidation(interactiveChart: boolean) {
        var v: powerbi.IVisual, element: JQuery;
        var dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    name: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                },
                {
                    name: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                }
            ],
        };
        var dataViewMetadataFourColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    name: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                },
                {
                    name: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                },
                {
                    name: 'col3',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                },
                {
                    name: 'col4',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                }],
        };
        var hostServices = powerbitests.mocks.createVisualHostServices();

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());

            element = powerbitests.helpers.testDom('300', '300');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('clusteredBarChart').create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { isInteractiveLegend: interactiveChart },
                animation: { transitionImmediate: true },
            });
        });

        it('clustered bar chart dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFourColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFourColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFourColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234]
                            }, {
                                source: dataViewMetadataFourColumn.columns[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88]
                            }, {
                                source: dataViewMetadataFourColumn.columns[3],
                                min: 27,
                                max: 113,
                                subtotal: 140,
                                values: [27, 113]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(6);
                var rects = $('rect');
                expect(rects.length).toBe(6);
                expect($('.data-labels').length).toBe(0);
                expect(+rects.eq(0).attr('y')).toBeLessThan(+rects.eq(1).attr('y'));
                expect(+rects.eq(0).attr('y')).toBeLessThan(+rects.eq(2).attr('y'));
                expect(+rects.eq(0).attr('y')).toBeLessThan(+rects.eq(4).attr('y'));
                expect(+rects.eq(2).attr('y')).toBeLessThan(+rects.eq(4).attr('y'));
                done();
            }, DefaultWaitForRender);
        });

        it('clustered bar chart partial highlight dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFourColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFourColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFourColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [54, 204]
                            }, {
                                source: dataViewMetadataFourColumn.columns[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                                highlights: [6, 66]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(8);
                expect($('.highlight').length).toBe(4);
                expect($('rect').length).toBe(8);
                expect(+$('.highlight')[0].attributes.getNamedItem('width').value)
                    .toBeLessThan(+$('.bar')[0].attributes.getNamedItem('width').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('x').value)
                    .toBe(+$('.bar')[0].attributes.getNamedItem('x').value);
                done();
            }, DefaultWaitForRender);
        });

        it('clustered bar chart negative partial highlight dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFourColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFourColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFourColumn.columns[1],
                                min: -234,
                                max: -54,
                                subtotal: -357,
                                values: [-123, -234],
                                highlights: [-54, -204]
                            }, {
                                source: dataViewMetadataFourColumn.columns[2],
                                min: -88,
                                max: -12,
                                subtotal: -100,
                                values: [-12, -88],
                                highlights: [-6, -66]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(8);
                expect($('.highlight').length).toBe(4);
                expect($('rect').length).toBe(8);
                expect(+$('.highlight')[0].attributes.getNamedItem('width').value)
                    .toBeLessThan(+$('.bar')[0].attributes.getNamedItem('width').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('x').value)
                    .toBeGreaterThan(+$('.bar')[0].attributes.getNamedItem('x').value);
                done();
            }, DefaultWaitForRender);
        });

        it('clustered bar chart partial highlight with overflow dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFourColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFourColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFourColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [150, 264]
                            }, {
                                source: dataViewMetadataFourColumn.columns[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                                highlights: [18, 104]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(8);
                expect($('.highlight').length).toBe(4);
                expect($('rect').length).toBe(8);
                expect(+$('.highlight')[0].attributes.getNamedItem('width').value)
                    .toBeGreaterThan(+$('.bar')[0].attributes.getNamedItem('width').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('x').value)
                    .toBe(+$('.bar')[0].attributes.getNamedItem('x').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('height').value)
                    .toBeLessThan(+$('.bar')[0].attributes.getNamedItem('height').value);
                done();
            }, DefaultWaitForRender);
        });

        it('clustered bar chart partial highlight with postiive/negative mix dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFourColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFourColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFourColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [-54, -204]
                            }, {
                                source: dataViewMetadataFourColumn.columns[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                                highlights: [-6, -66]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(8);
                expect($('.highlight').length).toBe(4);
                expect($('rect').length).toBe(8);
                expect(+$('.highlight')[0].attributes.getNamedItem('width').value)
                    .toBeLessThan(+$('.bar')[0].attributes.getNamedItem('width').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('x').value)
                    .toBeLessThan(+$('.bar')[0].attributes.getNamedItem('x').value);
                expect(+$('.highlight')[0].attributes.getNamedItem('height').value)
                    .toBeLessThan(+$('.bar')[0].attributes.getNamedItem('height').value);
                done();
            }, DefaultWaitForRender);
        });

        it('clustered bar chart missing measure dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFourColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFourColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFourColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234]
                            }, {
                                source: dataViewMetadataFourColumn.columns[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, null]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('rect').length).toBe(3);
                expect($('.columnChart .axisGraphicsContext .y.axis .tick').find('text').last().text()).toBe('def');
                done();
            }, DefaultWaitForRender);
        });

        it('clustered bar chart with near zero measures dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataFourColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataFourColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataFourColumn.columns[1],
                                values: [0.0001, 234]
                            }, {
                                source: dataViewMetadataFourColumn.columns[2],
                                values: [12, -0.0001]
                            }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.bar').length).toBe(4);
                expect($('rect').length).toBe(4);
                var smallPositiveRectXValue = $('.bar')[0].attributes.getNamedItem('x').value;
                var smallNegativeRectXValue = $('.bar')[3].attributes.getNamedItem('x').value;
                expect(smallPositiveRectXValue).not.toEqual(smallNegativeRectXValue);
                done();
            }, DefaultWaitForRender);
        });

        it('empty clustered bar chart dom validation',(done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: []
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: []
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.columnChart .axisGraphicsContext .y.axis .tick').length).toBe(0);
                expect($('.columnChart .axisGraphicsContext .x.axis .tick').length).toBeGreaterThan(0);
                expect($('.columnChart .axisGraphicsContext .x.axis .tick').find('text').last().text()).toBe('10');
                done();
            }, DefaultWaitForRender);
        });

        it('clustered bar chart with small interval dom validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("a"),
                mocks.dataViewScopeIdentity("b"),
                mocks.dataViewScopeIdentity("c"),
                mocks.dataViewScopeIdentity("d"),
                mocks.dataViewScopeIdentity("e"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0, 1.5, 1.0, 2.5]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('.columnChart .axisGraphicsContext .x.axis .tick').length).toBeGreaterThan(0);
                expect($('.columnChart .axisGraphicsContext .y.axis .tick').length).toBeGreaterThan(0);
                expect($('.columnChart .axisGraphicsContext .x.axis .tick').find('text').last().text()).toBe('2.50');
                done();
            }, DefaultWaitForRender);
        });

        it('clustered bar chart should be cleared when empty dataview is applied',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("a"),
                mocks.dataViewScopeIdentity("b"),
                mocks.dataViewScopeIdentity("c"),
                mocks.dataViewScopeIdentity("d"),
                mocks.dataViewScopeIdentity("e"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0, 1.5, 1.0, 2.5]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('rect').length).toBeGreaterThan(0);

                v.onDataChanged({
                    dataViews: [{
                        metadata: dataViewMetadataTwoColumn,
                        categorical: {
                            categories: [{
                                source: dataViewMetadataTwoColumn.columns[0],
                                values: []
                            }],
                            values: DataViewTransform.createValueColumns([])
                        }
                    }]
                });
                setTimeout(() => {
                    expect($('rect').length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });
    }

    describe("Clustered BarChart DOM validation",() => clusterdBarChartDomValidation(false));
    describe("Interactive Clustered BarChart DOM validation",() => clusterdBarChartDomValidation(true));

    describe("Enumerate Objects",() => {
        var v: powerbi.IVisual, element: JQuery;
        var categoryColumn: powerbi.DataViewMetadataColumn = { name: 'year', queryName: 'selectYear', type: DataShapeUtility.describeDataType(SemanticType.String) };
        var measureColumn: powerbi.DataViewMetadataColumn = { name: 'sales', queryName: 'selectSales', isMeasure: true, type: DataShapeUtility.describeDataType(SemanticType.Integer), objects: { general: { formatString: '$0' } } };
        //var measure2Column: powerbi.DataViewMetadataColumn = { name: 'tax', queryName: 'selectTax', isMeasure: true, type: DataShapeUtility.describeDataType(SemanticType.Number) };
        var hostServices = powerbitests.mocks.createVisualHostServices();
        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());

            element = powerbitests.helpers.testDom('800', '800');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('columnChart').create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true }
            });
        });

        it('enumerateObjectInstances: category+measure',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("red"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: { columns: [categoryColumn, measureColumn] },
                    categorical: {
                        categories: [{
                            source: categoryColumn,
                            values: ['red', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: measureColumn,
                            min: 100000,
                            max: 200000,
                            values: [100000, 200000]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                var points = v.enumerateObjectInstances({ objectName: 'dataPoint' });
                expect(points.length).toBe(3);
                expect(points[1].displayName).toBe('red');
                expect(points[1].selector.data).toEqual([categoryIdentities[0]]);
                expect(points[1].selector.metadata).toBeUndefined();
                expect(points[2].displayName).toBe('def');

                var points = v.enumerateObjectInstances({ objectName: 'categoryAxis' });
                expect(points.length).toBe(2);
                expect(points[0].displayName).toBeUndefined();

                var points = v.enumerateObjectInstances({ objectName: 'legend' });
                expect(points.length).toBe(1);
                expect(points[0].displayName).toBeUndefined();
                expect(points[0].properties['position']).toBe('None');

                done();
            }, DefaultWaitForRender);
        });

        it('enumerateObjectInstances: Verify instances on ordinal category axis',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("red"),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: { columns: [categoryColumn, measureColumn] },
                    categorical: {
                        categories: [{
                            source: categoryColumn,
                            values: ['red', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: measureColumn,
                            min: 100000,
                            max: 200000,
                            values: [100000, 200000]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                var points = v.enumerateObjectInstances({ objectName: 'dataPoint' });
                expect(points.length).toBe(3);
                expect(points[1].displayName).toBe('red');
                expect(points[1].selector.data).toEqual([categoryIdentities[0]]);
                expect(points[1].selector.metadata).toBeUndefined();
                expect(points[2].displayName).toBe('def');

                var points = v.enumerateObjectInstances({ objectName: 'categoryAxis' });
                expect(points.length).toBe(2);
                expect(points[0].displayName).toBeUndefined();

                expect(points[0].properties['start']).toBeUndefined();
                expect(points[0].properties['end']).toBeUndefined();
                expect(points[0].properties['axisType']).toBeUndefined();

                expect(points[0].properties['show']).toBeDefined;
                expect(points[0].properties['showAxisTitle']).toBeDefined;
                expect(points[0].properties['axisStyle']).toBeDefined;

                done();
            }, DefaultWaitForRender);
        });

        it('enumerateObjectInstances: Verify instances on numerical category axis',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("5000"),
                mocks.dataViewScopeIdentity("10000"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: { columns: [measureColumn, measureColumn] },
                    categorical: {
                        categories: [{
                            source: measureColumn,
                            values: [5000, 10000],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: measureColumn,
                            min: 100000,
                            max: 200000,
                            values: [100000, 200000]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                var points = v.enumerateObjectInstances({ objectName: 'dataPoint' });
                expect(points.length).toBe(3);
                expect(points[1].displayName).toBe(5000);
                expect(points[1].selector.data).toEqual([categoryIdentities[0]]);
                expect(points[1].selector.metadata).toBeUndefined();
                expect(points[2].displayName).toBe(10000);

                var points = v.enumerateObjectInstances({ objectName: 'categoryAxis' });
                expect(points.length).toBe(2);
                expect(points[0].displayName).toBeUndefined();

                expect(points[0].properties['start']).toBeDefined();
                expect(points[0].properties['end']).toBeDefined();
                expect(points[0].properties['axisType']).toBeDefined();

                expect(points[0].properties['show']).toBeDefined;
                expect(points[0].properties['showAxisTitle']).toBeDefined;
                expect(points[0].properties['axisStyle']).toBeDefined;

                done();
            }, DefaultWaitForRender);
        });

        //it('enumerateObjectInstances: category+multi-measure',(done) => {
        //    var categoryIdentities = [
        //        mocks.dataViewScopeIdentity("red"),
        //        mocks.dataViewScopeIdentity("def"),
        //    ];
        //    v.onDataChanged({
        //        dataViews: [{
        //            metadata: { columns: [categoryColumn, measureColumn] },
        //            categorical: {
        //                categories: [{
        //                    source: categoryColumn,
        //                    values: ['red', 'def'],
        //                    identity: categoryIdentities,
        //                }],
        //                values: DataViewTransform.createValueColumns([
        //                    {
        //                        source: measureColumn,
        //                        min: 100000,
        //                        max: 200000,
        //                        values: [100000, 200000]
        //                    }, {
        //                        source: measure2Column,
        //                        min: 150,
        //                        max: 250,
        //                        values: [150, 250]
        //                    }])
        //            }
        //        }]
        //    });

        //    setTimeout(() => {
        //        var points = v.enumerateObjectInstances({ objectName: 'dataPoint' });
        //        expect(points.length).toBe(2);
        //        expect(points[0].displayName).toBe(measureColumn.name);                
        //        expect(points[1].displayName).toBe(measure2Column.name);

        //        var points = v.enumerateObjectInstances({ objectName: 'categoryAxis' });
        //        expect(points.length).toBe(1);
        //        expect(points[0].displayName).toBeUndefined();

        //        var points = v.enumerateObjectInstances({ objectName: 'legend' });
        //        expect(points.length).toBe(1);
        //        expect(points[0].displayName).toBeUndefined();
        //        expect(points[0].properties['position']).toBe('Top');

        //        done();
        //    }, DefaultWaitForRender);
        //});
    });

    describe("Column chart labels",() => {
        var v: powerbi.IVisual, element: JQuery;
        var dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    name: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                },
                {
                    name: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                }
            ],
        };
        var hostServices = powerbitests.mocks.createVisualHostServices();
        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());

            element = powerbitests.helpers.testDom('800', '800');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('columnChart').create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true }
            });
        });

        it('Check margins for long labels, when you have a few columns that do not take up the whole width, and get centered',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("this is the label that never ends, it just goes on and on my friends. Some axis started rendering it not knowing what it was, and now it keeps on rendering forever just because this the label that never ends..."),
                mocks.dataViewScopeIdentity("def"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['this is the label that never ends, it just goes on and on my friends. Some axis started rendering it not knowing what it was, and now it keeps on rendering forever just because this the label that never ends...',
                                'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 100000,
                            max: 200000,
                            subtotal: 300000,
                            values: [100000, 200000]
                        }])
                    }
                }]
            });

            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                //expect($('.columnChart .axisGraphicsContext').attr('transform')).toBe('translate(36,8)');
                done();
            }, DefaultWaitForRender);
        });
    });

    describe("BarChart Interactivity",() => {
        var v: powerbi.IVisual, element: JQuery;
        var dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    name: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                },
                {
                    name: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                }
            ],
        };
        var DefaultOpacity: string = "" + ColumnUtil.DefaultOpacity;
        var DimmedOpacity: string = "" + ColumnUtil.DimmedOpacity;

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());

            element = powerbitests.helpers.testDom('200', '300');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('barChart').create();
        });

        it('Bar chart with dragDataPoint enabled',() => {
            var hostServices = mocks.createVisualHostServices();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { dragDataPoint: true },
            });

            var dataViewScopeIdentity2 = mocks.dataViewScopeIdentity('b');
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b'],
                            identity: [
                                mocks.dataViewScopeIdentity('a'),
                                dataViewScopeIdentity2,
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0]
                        }])
                    }
                }]
            });

            var bars = element.find('.bar');
            expect(bars.length).toBe(2);

            spyOn(hostServices, 'onDragStart').and.callThrough();

            var trigger = powerbitests.helpers.getDragStartTriggerFunctionForD3(bars[1]);

            var mockEvent = {
                abc: 'def',
                stopPropagation: () => { },
            };
            trigger(mockEvent);

            expect(hostServices.onDragStart).toHaveBeenCalledWith({
                event: mockEvent,
                data: {
                    data: {
                        data: [dataViewScopeIdentity2]
                    }
                }
            });
        });

        it('Bar chart without dragDataPoint enabled',() => {
            var hostServices = mocks.createVisualHostServices();
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

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b'],
                            identity: [
                                mocks.dataViewScopeIdentity('a'),
                                mocks.dataViewScopeIdentity('b'),
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0]
                        }])
                    }
                }]
            });

            var bars = element.find('.bar');
            expect(bars.length).toBe(2);

            var trigger = powerbitests.helpers.getDragStartTriggerFunctionForD3(bars[1]);
            expect(trigger).not.toBeDefined();
        });

        it('Bar chart with selection enabled',() => {
            var hostServices = mocks.createVisualHostServices();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { selection: true },
            });

            var dataViewScopeIdentity2 = mocks.dataViewScopeIdentity('b');
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b'],
                            identity: [
                                mocks.dataViewScopeIdentity('a'),
                                dataViewScopeIdentity2,
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0]
                        }])
                    }
                }]
            });

            var bars = element.find('.bar');
            expect(bars.length).toBe(2);
            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DefaultOpacity);

            spyOn(hostServices, 'onSelect').and.callThrough();

            var trigger = powerbitests.helpers.getClickTriggerFunctionForD3(bars[1]);
            var mockEvent = {
                abc: 'def',
                stopPropagation: () => { },
            };
            trigger(mockEvent);

            expect(bars[0].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[1].style.fillOpacity).toBe(DefaultOpacity);

            expect(hostServices.onSelect).toHaveBeenCalledWith({
                data: [
                    {
                        data: [dataViewScopeIdentity2]
                    }
                ]
            });
        });

        it('Bar chart without selection enabled',() => {
            var hostServices = mocks.createVisualHostServices();
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

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b'],
                            identity: [
                                mocks.dataViewScopeIdentity('a'),
                                mocks.dataViewScopeIdentity('b'),
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0]
                        }])
                    }
                }]
            });

            var bars = element.find('.bar');
            expect(bars.length).toBe(2);

            var trigger = powerbitests.helpers.getClickTriggerFunctionForD3(bars[1]);
            expect(trigger).not.toBeDefined();
        });

        it('Bar chart multi-selection', () => {
            var hostServices = mocks.createVisualHostServices();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { selection: true },
            });

            var identities: powerbi.DataViewScopeIdentity[] = [
                mocks.dataViewScopeIdentity('a'),
                mocks.dataViewScopeIdentity('b'),
                mocks.dataViewScopeIdentity('c'),
                mocks.dataViewScopeIdentity('d'),
                mocks.dataViewScopeIdentity('e'),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: identities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0, 1.5, 1.0, 2.5]
                        }])
                    }
                }]
            });

            var bars = element.find('.bar');
            expect(bars.length).toBe(5);

            var trigger0 = powerbitests.helpers.getClickTriggerFunctionForD3(bars[0]);
            var trigger3 = powerbitests.helpers.getClickTriggerFunctionForD3(bars[3]);
            var mockEvent = {
                abc: 'def',
                ctrlKey: true,
                stopPropagation: () => { },
            };

            spyOn(hostServices, 'onSelect').and.callThrough();

            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[2].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[3].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[4].style.fillOpacity).toBe(DefaultOpacity);
            trigger0(mockEvent);
            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[2].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[3].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[4].style.fillOpacity).toBe(DimmedOpacity);
            expect(hostServices.onSelect).toHaveBeenCalledWith(
                {
                    data: [
                        {
                            data: [identities[0]]
                        }
                    ]
                });
            trigger3(mockEvent);
            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[2].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[3].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[4].style.fillOpacity).toBe(DimmedOpacity);
            expect(hostServices.onSelect).toHaveBeenCalledWith(
                {
                    data: [
                        {

                            data: [identities[0]]
                        },
                        {
                            data: [identities[3]]
                        }
                    ]
                });
            trigger0(mockEvent);
            expect(bars[0].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[1].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[2].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[3].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[4].style.fillOpacity).toBe(DimmedOpacity);
            expect(hostServices.onSelect).toHaveBeenCalledWith(
                {
                    data: [
                        {
                            data: [identities[3]]
                        }
                    ]
                });
            trigger3(mockEvent);
            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[2].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[3].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[4].style.fillOpacity).toBe(DefaultOpacity);
            expect(hostServices.onSelect).toHaveBeenCalledWith(
                {
                    data: []
                });
        });

        it('Bar chart repeated single selection',() => {
            var hostServices = mocks.createVisualHostServices();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { selection: true },
            });

            var identities: powerbi.DataViewScopeIdentity[] = [
                mocks.dataViewScopeIdentity('a'),
                mocks.dataViewScopeIdentity('b'),
                mocks.dataViewScopeIdentity('c'),
                mocks.dataViewScopeIdentity('d'),
                mocks.dataViewScopeIdentity('e'),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: identities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0, 1.5, 1.0, 2.5]
                        }])
                    }
                }]
            });

            var bars = element.find('.bar');
            expect(bars.length).toBe(5);

            var trigger0 = powerbitests.helpers.getClickTriggerFunctionForD3(bars[0]);
            var trigger3 = powerbitests.helpers.getClickTriggerFunctionForD3(bars[3]);
            var mockEvent = {
                abc: 'def',
                stopPropagation: () => { },
            };

            spyOn(hostServices, 'onSelect').and.callThrough();

            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[2].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[3].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[4].style.fillOpacity).toBe(DefaultOpacity);
            trigger0(mockEvent);
            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[2].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[3].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[4].style.fillOpacity).toBe(DimmedOpacity);
            expect(hostServices.onSelect).toHaveBeenCalledWith(
                {
                    data: [
                        {
                            data: [identities[0]]
                        }
                    ]
                });
            trigger3(mockEvent);
            expect(bars[0].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[1].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[2].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[3].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[4].style.fillOpacity).toBe(DimmedOpacity);
            expect(hostServices.onSelect).toHaveBeenCalledWith(
                {
                    data: [
                        {
                            data: [identities[3]]
                        }
                    ]
                });
            trigger3(mockEvent);
            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[2].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[3].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[4].style.fillOpacity).toBe(DefaultOpacity);
            expect(hostServices.onSelect).toHaveBeenCalledWith(
                {
                    data: []
                });
        });

        it('Bar chart single and multi selection',() => {
            var hostServices = mocks.createVisualHostServices();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { selection: true },
            });

            var identities: powerbi.DataViewScopeIdentity[] = [
                mocks.dataViewScopeIdentity('a'),
                mocks.dataViewScopeIdentity('b'),
                mocks.dataViewScopeIdentity('c'),
                mocks.dataViewScopeIdentity('d'),
                mocks.dataViewScopeIdentity('e'),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: identities,
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0, 1.5, 1.0, 2.5]
                        }])
                    }
                }]
            });

            var bars = element.find('.bar');
            expect(bars.length).toBe(5);

            var trigger0 = powerbitests.helpers.getClickTriggerFunctionForD3(bars[0]);
            var trigger1 = powerbitests.helpers.getClickTriggerFunctionForD3(bars[1]);
            var trigger3 = powerbitests.helpers.getClickTriggerFunctionForD3(bars[3]);
            var trigger4 = powerbitests.helpers.getClickTriggerFunctionForD3(bars[4]);
            var mockSingleEvent = {
                abc: 'def',
                stopPropagation: () => { },
            };
            var mockMultiEvent = {
                abc: 'def',
                ctrlKey: true,
                stopPropagation: () => { },
            };

            spyOn(hostServices, 'onSelect').and.callThrough();

            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[2].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[3].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[4].style.fillOpacity).toBe(DefaultOpacity);
            trigger0(mockSingleEvent);
            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[2].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[3].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[4].style.fillOpacity).toBe(DimmedOpacity);
            expect(hostServices.onSelect).toHaveBeenCalledWith(
                {
                    data: [
                        {
                            data: [identities[0]]
                        }
                    ]
                });
            trigger3(mockMultiEvent);
            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[2].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[3].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[4].style.fillOpacity).toBe(DimmedOpacity);
            expect(hostServices.onSelect).toHaveBeenCalledWith(
                {
                    data: [
                        {

                            data: [identities[0]]
                        },
                        {
                            data: [identities[3]]
                        }
                    ]
                });
            trigger3(mockSingleEvent);
            expect(bars[0].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[1].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[2].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[3].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[4].style.fillOpacity).toBe(DimmedOpacity);
            expect(hostServices.onSelect).toHaveBeenCalledWith(
                {
                    data: [
                        {
                            data: [identities[3]]
                        }
                    ]
                });
            trigger1(mockMultiEvent);
            expect(bars[0].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[1].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[2].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[3].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[4].style.fillOpacity).toBe(DimmedOpacity);
            expect(hostServices.onSelect).toHaveBeenCalledWith(
                {
                    data: [
                        {

                            data: [identities[3]]
                        },
                        {
                            data: [identities[1]]
                        }
                    ]
                });
            trigger4(mockSingleEvent);
            expect(bars[0].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[1].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[2].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[3].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[4].style.fillOpacity).toBe(DefaultOpacity);
            expect(hostServices.onSelect).toHaveBeenCalledWith(
                {
                    data: [
                        {
                            data: [identities[4]]
                        }
                    ]
                });
        });

        it('Bar chart external clear selection',() => {
            var hostServices = mocks.createVisualHostServices();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { selection: true },
            });

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: [
                                mocks.dataViewScopeIdentity('a'),
                                mocks.dataViewScopeIdentity('b'),
                                mocks.dataViewScopeIdentity('c'),
                                mocks.dataViewScopeIdentity('d'),
                                mocks.dataViewScopeIdentity('e'),
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0, 1.5, 1.0, 2.5]
                        }])
                    }
                }]
            });

            var bars = element.find('.bar');
            expect(bars.length).toBe(5);

            var trigger0 = powerbitests.helpers.getClickTriggerFunctionForD3(bars[0]);
            var mockSingleEvent = {
                abc: 'def',
                stopPropagation: () => { },
            };

            spyOn(hostServices, 'onSelect').and.callThrough();

            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[2].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[3].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[4].style.fillOpacity).toBe(DefaultOpacity);

            trigger0(mockSingleEvent);
            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[2].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[3].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[4].style.fillOpacity).toBe(DimmedOpacity);

            v.onClearSelection();
            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[2].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[3].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[4].style.fillOpacity).toBe(DefaultOpacity);
        });

        it('Bar clear selection on background click',() => {
            var hostServices = mocks.createVisualHostServices();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { selection: true },
            });

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c', 'd', 'e'],
                            identity: [
                                mocks.dataViewScopeIdentity('a'),
                                mocks.dataViewScopeIdentity('b'),
                                mocks.dataViewScopeIdentity('c'),
                                mocks.dataViewScopeIdentity('d'),
                                mocks.dataViewScopeIdentity('e'),
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0, 1.5, 1.0, 2.5]
                        }])
                    }
                }]
            });

            var bars = element.find('.bar');
            expect(bars.length).toBe(5);

            var trigger0 = powerbitests.helpers.getClickTriggerFunctionForD3(bars[0]);
            var mockSingleEvent = {
                abc: 'def',
                stopPropagation: () => { },
            };

            var triggerBackground = powerbitests.helpers.getClickTriggerFunctionForD3(element[0]);

            spyOn(hostServices, 'onSelect').and.callThrough();

            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[2].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[3].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[4].style.fillOpacity).toBe(DefaultOpacity);

            trigger0(mockSingleEvent);
            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[2].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[3].style.fillOpacity).toBe(DimmedOpacity);
            expect(bars[4].style.fillOpacity).toBe(DimmedOpacity);

            triggerBackground(mockSingleEvent);
            expect(bars[0].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[1].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[2].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[3].style.fillOpacity).toBe(DefaultOpacity);
            expect(bars[4].style.fillOpacity).toBe(DefaultOpacity);

            expect(hostServices.onSelect).toHaveBeenCalledWith(
                {
                    data: []
                });
        });
    });

    function columnChartInteractivity(
        chartType: string,
        columnSelector: string,
        thirdColumnXCoordinateToClick: number,
        thirdColumnYCoordinateToClick: number) {

        var hostServices = powerbitests.mocks.createVisualHostServices();
        var v: powerbi.IVisual, element: JQuery;
        var dataViewMetadata: powerbi.DataViewMetadata = {
            columns: [
                {
                    name: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                },
                {
                    name: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Integer)
                }],
        };

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
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
                interactivity: { isInteractiveLegend: true },
                animation: { transitionImmediate: true },
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

        it('Drag and click interaction validation',() => {

            // drag and click on chart (not on bar) are implemented the same
            var barChart = (<any>v).layers[0];

            spyOn(barChart, 'selectColumn').and.callThrough();

            // click on the graph, expect selectColumn to have been called
            (<any>$('.columnChartMainGraphicsContext')).d3Click(thirdColumnXCoordinateToClick, thirdColumnYCoordinateToClick);
            expect(barChart.selectColumn).toHaveBeenCalled();

            // now, instead of clicking on the graph, which can be unstable due to different user's configurations
            // we will validate that the code knows how to deal with such a click
            var selectedIndex = barChart.columnChart.getClosestColumnIndex(thirdColumnXCoordinateToClick, thirdColumnYCoordinateToClick);

            var expectedSelectedIndex = 2;
            expect(selectedIndex).toBe(expectedSelectedIndex);
        });

        it('Columns Opacity validation',(done) => {
            var barChart = (<any>v).layers[0];
            var selectedIndex = 2;
            barChart.selectColumn(selectedIndex);
            SVGUtil.flushAllD3TransitionsIfNeeded({ transitionImmediate: true });
            setTimeout(() => {
                var allRects = d3.selectAll('rect' + columnSelector);
                expect(allRects).not.toBeEmpty();
                allRects.each((data, index) => {
                    if (data.categoryIndex === selectedIndex) {
                        expect(parseFloat(($(allRects[0]).eq(index)).css('fill-opacity'))).toBeCloseTo(ColumnUtil.DefaultOpacity, 0);
                    }
                    else {
                        expect(parseFloat(($(allRects[0]).eq(index)).css('fill-opacity'))).toBeCloseTo(ColumnUtil.DimmedOpacity, 1);
                    }
                });
                done();
            }, DefaultWaitForRender);
        });

        it('Update legend is not called twice on same column',() => {
            var barChart = (<any>v).layers[0];
            var cartesianVisualHost = barChart.cartesianVisualHost;
            spyOn(cartesianVisualHost, 'updateLegend').and.callThrough();

            // first column is selected. try to select it again
            barChart.selectColumn(0);
            // update legend should not be called again
            expect(cartesianVisualHost.updateLegend).not.toHaveBeenCalled();
        });

        it('Legend validation validation',() => {
            var barChart = (<any>v).layers[0];

            // trigger select column
            barChart.selectColumn(2);

            // verify legend was changed to correct values
            var legend = $('.interactive-legend');
            var title = legend.find('.title');
            var item = legend.find('.item');
            var hoverLine = $('.interactive-hover-line');

            expect(legend.length).toBe(1);
            expect(title.text().trim()).toBe('c');

            expect(item.find('.itemName').text()).toBe('col2');
            expect(item.find('.itemMeasure').text().trim()).toBe('490000');
            expect(hoverLine.length).toBe(1);
        });
    }
    var x = 250, y = 200;
    describe("Stacked Bar Chart Interactivity",() => columnChartInteractivity('barChart', '.bar', x, y));
    describe("Clustered Bar Chart Interactivity",() => columnChartInteractivity('clusteredBarChart', '.bar', x, y));
    describe("Hundred Percent Stacked Bar Chart Interactivity",() => columnChartInteractivity('hundredPercentStackedBarChart', '.bar', x, y));
    describe("Stacked Column Chart Interactivity",() => columnChartInteractivity('columnChart', '.column', x, y));
    describe("Clustered Column Chart Interactivity",() => columnChartInteractivity('clusteredColumnChart', '.column', x, y));
    describe("Hundred Percent Stacked Column Chart Interactivity",() => columnChartInteractivity('hundredPercentStackedColumnChart', '.column', x, y));

    function columnChartWebAnimations(chartType: string) {
        var hostServices = powerbitests.mocks.createVisualHostServices();
        var v: powerbi.IVisual, element: JQuery;
        var dataViewMetadataThreeColumn: powerbi.DataViewMetadataColumn[] = [
            {
                name: 'col1',
                type: DataShapeUtility.describeDataType(SemanticType.String)
            },
            {
                name: 'col2',
                isMeasure: true,
                type: DataShapeUtility.describeDataType(SemanticType.Number)
            },
            {
                name: 'col3',
                isMeasure: true,
                type: DataShapeUtility.describeDataType(SemanticType.Number)
            }
        ];
        function metadata(columns): powerbi.DataViewMetadata {
            var metadata: powerbi.DataViewMetadata = {
                columns: columns
            };

            return metadata;
        }

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.visualPluginFactory.createMinerva({
                heatMap: false,
                newTable: false,
                scrollableVisuals: false,
            }).getPlugin(chartType).create();
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

        it('highlight Animation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
            ];
            var dataViewNoHighlights = {
                dataViews: [{
                    metadata: metadata(dataViewMetadataThreeColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataThreeColumn[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                            }, {
                                source: dataViewMetadataThreeColumn[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                            }])
                    }
                }]
            };
            var dataViewHighlightsA = {
                dataViews: [{
                    metadata: metadata(dataViewMetadataThreeColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataThreeColumn[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [54, 204],
                            }, {
                                source: dataViewMetadataThreeColumn[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                                highlights: [6, 66],
                            }])
                    }
                }]
            };
            var dataViewHighlightsB = {
                dataViews: [{
                    metadata: metadata(dataViewMetadataThreeColumn),
                    categorical: {
                        categories: [{
                            source: dataViewMetadataThreeColumn[0],
                            values: ['abc', 'def'],
                            identity: categoryIdentities,
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataThreeColumn[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234],
                                highlights: [120, 10],
                            }, {
                                source: dataViewMetadataThreeColumn[2],
                                min: 12,
                                max: 88,
                                subtotal: 100,
                                values: [12, 88],
                                highlights: [8, 20],
                            }])
                    }
                }]
            };

            var animator = <powerbi.visuals.WebColumnChartAnimator>(<CartesianChart>v).animator;
            spyOn(animator, 'animate').and.callThrough();

            v.onDataChanged(dataViewNoHighlights);
            v.onDataChanged(dataViewHighlightsA);
            v.onDataChanged(dataViewHighlightsB);
            v.onDataChanged(dataViewNoHighlights);

            expect(animator).toBeTruthy();
            expect(animator.animate).toHaveBeenCalled();

            done();
        });
    }

    describe("Stacked Bar Chart Web Animations",() => columnChartWebAnimations('barChart'));
    describe("Clustered Bar Chart Web Animations",() => columnChartWebAnimations('clusteredBarChart'));
    describe("Hundred Percent Stacked Bar Chart Web Animations",() => columnChartWebAnimations('hundredPercentStackedBarChart'));
    describe("Stacked Column Chart Web Animations",() => columnChartWebAnimations('columnChart'));
    describe("Clustered Column Chart Web Animations",() => columnChartWebAnimations('clusteredColumnChart'));
    describe("Hundred Percent Stacked Column Chart Web Animations",() => columnChartWebAnimations('hundredPercentStackedColumnChart'));

    it('tooltip has category formatted date values',() => {
        var categoryColumn: powerbi.DataViewMetadataColumn = { name: 'year', queryName: 'selectYear', type: DataShapeUtility.describeDataType(SemanticType.Date), objects: { general: { formatString: "d" } } };
        var measureColumn: powerbi.DataViewMetadataColumn = { name: 'sales', queryName: 'selectSales', isMeasure: true, type: DataShapeUtility.describeDataType(SemanticType.Integer) };

        var categoryIdentities = [
            mocks.dataViewScopeIdentity("2011"),
            mocks.dataViewScopeIdentity("2012"),
        ];

        var dataView: powerbi.DataViewCategorical = {
            categories: [{
                source: categoryColumn,
                values: [new Date(2011, 4, 31), new Date(2012, 6, 30)],
                identity: categoryIdentities,
            }],
            values: DataViewTransform.createValueColumns([{
                source: measureColumn,
                values: [100, -200]
            }])
        };
        var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;

        var data = ColumnChart.converter(dataView, colors);
        var selectionIds: SelectionId[] = [
            SelectionId.createWithIdAndMeasure(categoryIdentities[0], measureColumn.queryName),
            SelectionId.createWithIdAndMeasure(categoryIdentities[1], measureColumn.queryName)];
        var legendItems = data.legendData.dataPoints;

        expect(data.series).toEqual([{
            key: 'series0', index: 0, displayName: 'sales', identity: SelectionId.createWithMeasure("selectSales"), data: [
                {
                    categoryValue: new Date(2011, 4, 31).getTime(),
                    value: 100,
                    position: 100,
                    valueAbsolute: 100,
                    valueOriginal: 100,
                    seriesIndex: 0,
                    showLabel: true,
                    labelFill: legendItems[0].color,
                    categoryIndex: 0,
                    color: legendItems[0].color,
                    selected: false,
                    originalValue: 100,
                    originalPosition: 100,
                    originalValueAbsolute: 100,
                    identity: selectionIds[0],
                    key: selectionIds[0].getKey(),
                    tooltipInfo: [{ displayName: "year", value: "5/31/2011" }, { displayName: "sales", value: "100" }],
                },
                {
                    categoryValue: new Date(2012, 6, 30).getTime(),
                    value: -200,
                    position: 0,
                    valueAbsolute: 200,
                    valueOriginal: -200,
                    seriesIndex: 0,
                    showLabel: true,
                    labelFill: legendItems[0].color,
                    categoryIndex: 1,
                    color: legendItems[0].color,
                    selected: false,
                    originalValue: -200,
                    originalPosition: 0,
                    originalValueAbsolute: 200,
                    identity: selectionIds[1],
                    key: selectionIds[1].getKey(),
                    tooltipInfo: [{ displayName: "year", value: "7/30/2012" }, { displayName: "sales", value: "-200" }],
                }]
        }]);
        expect(AxisHelper.createValueDomain(data.series, true)).toEqual([-200, 100]);
        expect(StackedUtil.calcValueDomain(data.series, /*is100Pct*/ false)).toEqual({
            min: -200,
            max: 100
        });
    });

    function getChartWithTooManyValues(chartType: string, element: JQuery): powerbi.IVisual {
        var hostServices = powerbitests.mocks.createVisualHostServices();
        var v: powerbi.IVisual;
        var dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    name: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                }, {
                    name: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                }
            ],
        };

        v = powerbi.visuals.visualPluginFactory.createMinerva({
            heatMap: false,
            newTable: false,
            scrollableVisuals: true,
        }).getPlugin(chartType).create();

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
        var categoryIdentities = [
            mocks.dataViewScopeIdentity("a"),
            mocks.dataViewScopeIdentity("b"),
            mocks.dataViewScopeIdentity("c"),
            mocks.dataViewScopeIdentity("d"),
            mocks.dataViewScopeIdentity("e"),
            mocks.dataViewScopeIdentity("f"),
            mocks.dataViewScopeIdentity("g"),
            mocks.dataViewScopeIdentity("h"),
            mocks.dataViewScopeIdentity("i"),
            mocks.dataViewScopeIdentity("j"),
            mocks.dataViewScopeIdentity("k"),
            mocks.dataViewScopeIdentity("l"),
            mocks.dataViewScopeIdentity("m"),
            mocks.dataViewScopeIdentity("n"),
            mocks.dataViewScopeIdentity("o"),
            mocks.dataViewScopeIdentity("p"),
            mocks.dataViewScopeIdentity("q"),
            mocks.dataViewScopeIdentity("r"),
            mocks.dataViewScopeIdentity("s"),
            mocks.dataViewScopeIdentity("t"),
        ];
        v.onDataChanged({
            dataViews: [{
                metadata: dataViewMetadataTwoColumn,
                categorical: {
                    categories: [{
                        source: dataViewMetadataTwoColumn.columns[0],
                        values: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't'],
                        identity: categoryIdentities,
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadataTwoColumn.columns[1],
                        min: 10,
                        max: 29,
                        subtotal: 390,
                        values: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
                    }])
                }
            }]
        });

        return v;
    }

    function barChartScrollbarValidation(chartType: string, columnSelector: string) {
        var element: JQuery;
        var v: powerbi.IVisual;

        beforeEach(() => {
            element = powerbitests.helpers.testDom('100', '100');
            v = getChartWithTooManyValues(chartType, element);
        });

        it('DOM Validation',(done) => {
            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('rect' + columnSelector).length).toBe(20);
                expect($('rect.extent').length).toBe(1);
                expect($('rect' + columnSelector)[6].attributes.getNamedItem('y').value).toBeGreaterThan(100);
                var transform = SVGUtil.parseTranslateTransform($('.columnChart .axisGraphicsContext .y.axis .tick').last().attr('transform'));
                expect(transform.y).toBeGreaterThan(element.height());
                expect(transform.x).toBe('0');
                expect($('.brush').attr('transform')).toBe('translate(90,8)');
                expect(parseInt($('.brush .extent')[0].attributes.getNamedItem('height').value, 0)).toBeGreaterThan(8);
                expect($('.brush .extent')[0].attributes.getNamedItem('y').value).toBe('0');
                done();
            }, DefaultWaitForRender);
        });

        it('Scrollbar OnMousedown Validation',(done) => {
            var transform = SVGUtil.parseTranslateTransform($('.svgScrollable .axisGraphicsContext').first().attr('transform'));
            var cartesianChart = (<any>v);
            var brush = v['brush'];
            var brushExtent = [25, 35];
            brush.extent(brushExtent);
            cartesianChart.setMinBrush(100, 10, 4);

            setTimeout(() => {
                var scrolledTransform = SVGUtil.parseTranslateTransform($('.svgScrollable .axisGraphicsContext').first().attr('transform'));
                expect(transform.y).toBeGreaterThan(scrolledTransform.y);
                expect(scrolledTransform.y).toBeLessThan(0);
                done();
            }, DefaultWaitForRender);
        });
    }

    describe("Bar chart scrollbar",() => barChartScrollbarValidation('barChart', '.bar'));
    describe("ClusteredBarChart scrollbar",() => barChartScrollbarValidation('clusteredBarChart', '.bar'));

    function columnChartScrollbarValidation(chartType: string, columnSelector: string) {
        var element: JQuery;
        var v: powerbi.IVisual;

        beforeEach(() => {
            element = powerbitests.helpers.testDom('100', '100');
            v = getChartWithTooManyValues(chartType, element);
        });

        it('DOM Validation',(done) => {
            setTimeout(() => {
                expect($('.columnChart')).toBeInDOM();
                expect($('rect' + columnSelector).length).toBe(20);
                expect($('rect.extent').length).toBe(1);
                expect($('rect' + columnSelector)[6].attributes.getNamedItem('x').value).toBeGreaterThan(100);
                var transform = SVGUtil.parseTranslateTransform($('.columnChart .axisGraphicsContext .x.axis .tick').last().attr('transform'));
                expect(transform.y).toBe('0');
                expect(transform.x).toBeGreaterThan(element.width());
                expect($('.brush').attr('transform')).toBe('translate(22,90)');
                expect(parseInt($('.brush .extent')[0].attributes.getNamedItem('width').value, 0)).toBe(13);
                expect($('.brush .extent')[0].attributes.getNamedItem('x').value).toBe('0');
                done();
            }, DefaultWaitForRender);
        });

        it('Scrollbar On Mousedown Validation',(done) => {
            var transform = SVGUtil.parseTranslateTransform($('.svgScrollable .axisGraphicsContext').first().attr('transform'));
            var cartesianChart = (<any>v);
            var brush = v['brush'];
            var brushExtent = [25, 35];
            brush.extent(brushExtent);
            cartesianChart.setMinBrush(100, 10, 4);

            setTimeout(() => {
                var scrolledTransform = SVGUtil.parseTranslateTransform($('.svgScrollable .axisGraphicsContext').first().attr('transform'));
                expect(transform.x).toBeGreaterThan(scrolledTransform.x);
                expect(scrolledTransform.x).toBeLessThan(0);
                done();
            }, DefaultWaitForRender);
        });
    }

    describe("ColumnChart scrollbar",() => columnChartScrollbarValidation('columnChart', '.column'));
    describe("ClusteredcolumnChart Scrollbar",() => columnChartScrollbarValidation('clusteredColumnChart', '.column'));

    describe("Column chart X axis label rotation/cutoff",() => {
        var v: powerbi.IVisual, element: JQuery;
        var dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    name: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                },
                {
                    name: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                }
            ],
        };

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());

            element = powerbitests.helpers.testDom('400', '300');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('columnChart').create();
        });

        it('long label cutoff at the left edge',() => {
            var hostServices = mocks.createVisualHostServices();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { dragDataPoint: true },
            });

            var longLabelValue = 'Very very very very long label';
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: [longLabelValue, 'b', 'c', 'd'],
                            identity: [
                                mocks.dataViewScopeIdentity(longLabelValue),
                                mocks.dataViewScopeIdentity('b'),
                                mocks.dataViewScopeIdentity('c'),
                                mocks.dataViewScopeIdentity('d'),
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0, 1.0, 1.5]
                        }])
                    }
                }]
            });

            var actualLongLabelTextContent = element.find('.x.axis text')[0].textContent;
            expect(actualLongLabelTextContent).toContain("...");
        });
    });

    describe("X Axis Customization: Column Chart",() => {
        var v: powerbi.IVisual, element: JQuery;
        var hostServices = powerbitests.mocks.createVisualHostServices();
        var unitLength: number;
        var bars;
        var labels;
        var columnWidth: number;        
        var dataChangedOptions;
        var lastIndex;

        var dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    name: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                },
                {
                    name: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                },
                {
                    name: 'col3',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                },
                {
                    name: 'col4',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                }],
        };

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());

            element = powerbitests.helpers.testDom('500', '900');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('columnChart').create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { isInteractiveLegend: false },
                animation: { transitionImmediate: true },
            });
        }); 

        function setAxisType(xType: any) {
            (<any>dataViewMetadataTwoColumn.objects['categoryAxis']).axisType = xType;
            dataChangedOptions.dataViews.metadata = dataViewMetadataTwoColumn;
        };

        it('X Axis Customization: Verify Scalar and Categorical axis type',() => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("500"),
                mocks.dataViewScopeIdentity("20000"),
                mocks.dataViewScopeIdentity("10000"),
                mocks.dataViewScopeIdentity("50000"),
            ];
            dataViewMetadataTwoColumn.objects = {
                categoryAxis: {
                    show: true,
                    start: 0,
                    end: 200000,
                    axisType: AxisType.scalar,
                    showAxisTitle: true,
                    axisStyle: true
                }
            };
            dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: [50, 20000, 10000, 50000],
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 50000,
                            max: 200000,
                            subtotal: 500000,
                            values: [100000, 200000, 150000, 50000]
                        }])
                    }
                }]
            };
            v.onDataChanged(dataChangedOptions);

            bars = $('.column');
            var firstItemGap = (+bars[1].getAttribute('x') - (+bars[0].getAttribute('x') + +bars[0].getAttribute('width')));
            lastIndex = bars.length - 1;
            var lastItemGap = +bars[lastIndex].getAttribute('x') - (+bars[lastIndex - 1].getAttribute('x') + +bars[lastIndex - 1].getAttribute('width'));
            expect(firstItemGap).toBeGreaterThan(0);
            expect(lastItemGap).toBeGreaterThan(firstItemGap);

            setAxisType(AxisType.categorical);
            v.onDataChanged(dataChangedOptions);
            firstItemGap = (+bars[1].getAttribute('x') - (+bars[0].getAttribute('x') + +bars[0].getAttribute('width')));
            lastItemGap = +bars[lastIndex].getAttribute('x') - (+bars[lastIndex - 1].getAttribute('x') + +bars[lastIndex - 1].getAttribute('width'));
            expect(firstItemGap).toBeGreaterThan(0);
            expect(lastItemGap).toBeCloseTo(firstItemGap, 2);
        });

        it('Basic scale check',() => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("500"),
                mocks.dataViewScopeIdentity("2000"),
                mocks.dataViewScopeIdentity("5000"),
                mocks.dataViewScopeIdentity("10000"),
            ];
            dataViewMetadataTwoColumn.objects = {
                categoryAxis: {
                    show: true,
                    start: 0,
                    end: 100000,
                    axisType: AxisType.scalar,
                    showAxisTitle: true,
                    axisStyle: true
                }
            };
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: [500, 2000, 5000, 10000],
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 50000,
                            max: 200000,
                            subtotal: 500000,
                            values: [100000, 200000, 150000, 50000]
                        }])
                    }
                }]
            });
            bars = $('.column');
            labels = $('.x.axis').children('.tick');
            unitLength = (bars[1].getAttribute('x') - bars[0].getAttribute('x')) / 1500;
            columnWidth = bars[0].getAttribute('width');

            expect(bars[0].getAttribute('x')).toBeCloseTo(unitLength * 500, 2);
            expect(bars[1].getAttribute('x')).toBeCloseTo(unitLength * 2000, 2);
            expect(bars[2].getAttribute('x')).toBeCloseTo(unitLength * 5000, 2);
            expect(bars[3].getAttribute('x')).toBeCloseTo(unitLength * 10000, 2);

            //Verify no column overlapping
            expect(+bars[0].getAttribute('x') + +columnWidth).toBeLessThan(+bars[1].getAttribute('x'));
            expect(+bars[1].getAttribute('x') + +columnWidth).toBeLessThan(+bars[2].getAttribute('x'));
            expect(+bars[2].getAttribute('x') + +columnWidth).toBeLessThan(+bars[3].getAttribute('x'));

            //Verify begin&end labels
            expect(labels[0].textContent).toBe('0M');
            expect(labels[labels.length - 1].textContent).toBe('0.1M');
        });

        it('Big Range scale check',() => {

            var categoryIdentities = [
                mocks.dataViewScopeIdentity("50"),
                mocks.dataViewScopeIdentity("5000"),
                mocks.dataViewScopeIdentity("2000"),
                mocks.dataViewScopeIdentity("100000"),
            ];
            dataViewMetadataTwoColumn.objects = {
                categoryAxis: {
                    show: true,
                    start: 0,
                    end: 50000,
                    axisType: AxisType.scalar,
                    showAxisTitle: true,
                    axisStyle: true
                }
            };

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: [50, 20000, 10000, 50000],
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 50000,
                            max: 200000,
                            subtotal: 500000,
                            values: [100000, 200000, 150000, 50000]
                        }])
                    }
                }]
            });
            bars = $('.column');
            labels = $('.x.axis').children('.tick');
            unitLength = (bars[1].getAttribute('x') - bars[0].getAttribute('x')) / 19950;
            columnWidth = bars[0].getAttribute('width');

            expect(bars[0].getAttribute('x')).toBeCloseTo(unitLength * 50, 2);
            expect(bars[2].getAttribute('x')).toBeCloseTo(unitLength * 10000, 2);
            expect(bars[1].getAttribute('x')).toBeCloseTo(unitLength * 20000, 2);
            expect(bars[3].getAttribute('x')).toBeCloseTo(unitLength * 50000, 2);

            //Verify no column overlapping
            expect(+bars[0].getAttribute('x') + +columnWidth).toBeLessThan(+bars[2].getAttribute('x'));
            expect(+bars[2].getAttribute('x') + +columnWidth).toBeLessThan(+bars[1].getAttribute('x'));
            expect(+bars[1].getAttribute('x') + +columnWidth).toBeLessThan(+bars[3].getAttribute('x'));

            //Verify begin&end labels
            expect(labels[0].textContent).toBe('0K');
            expect(labels[labels.length - 1].textContent).toBe('50K');
        });

        it('Negative And Positive scale values check',() => {

            var categoryIdentities = [
                mocks.dataViewScopeIdentity("-50"),
                mocks.dataViewScopeIdentity("-70"),
                mocks.dataViewScopeIdentity("-40"),
                mocks.dataViewScopeIdentity("-100"),
            ];

            dataViewMetadataTwoColumn.objects = {
                categoryAxis: {
                    show: true,
                    start: -100,
                    end: 100,
                    axisType: AxisType.scalar,
                    showAxisTitle: true,
                    axisStyle: true
                }
            };

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: [-50, 0, 40, -100],
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 50000,
                            max: 200000,
                            subtotal: 500000,
                            values: [100000, 200000, 150000, 50000]
                        }])
                    }
                }]
            });
            bars = $('.column');
            labels = $('.x.axis').children('.tick');
            unitLength = (+bars[1].getAttribute('x') - +bars[0].getAttribute('x')) / 50;
            columnWidth = bars[0].getAttribute('width');

            expect(bars[0].getAttribute('x')).toBeCloseTo(unitLength * 50, 2);
            expect(bars[1].getAttribute('x')).toBeCloseTo(unitLength * 100, 2);
            expect(bars[2].getAttribute('x')).toBeCloseTo(unitLength * 140, 2);
            expect(bars[3].getAttribute('x')).toBeCloseTo(0, 2);

            //Verify no column overlapping
            expect(+bars[3].getAttribute('x') + +columnWidth).toBeLessThan(+bars[0].getAttribute('x'));
            expect(+bars[0].getAttribute('x') + +columnWidth).toBeLessThan(+bars[1].getAttribute('x'));
            expect(+bars[1].getAttribute('x') + +columnWidth).toBeLessThan(+bars[2].getAttribute('x'));

            //Verify begin&end labels
            expect(labels[0].textContent).toBe('-100');
            expect(labels[labels.length - 1].textContent).toBe('100');
        });
    });

    describe("Y Axis Customization: Column Chart",() => {
        var v: powerbi.IVisual, element: JQuery;
        var hostServices = powerbitests.mocks.createVisualHostServices();
        var bars;
        var labels;

        var dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    name: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                },
                {
                    name: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                },
                {
                    name: 'col3',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                },
                {
                    name: 'col4',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                }],
            objects: {
                valueAxis: {
                    show: true,
                    position: 'Right',
                    start: 0,
                    end: 200000,
                    showAxisTitle: true,
                    axisStyle: true
                }
            }
        };

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());

            element = powerbitests.helpers.testDom('500', '900');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('columnChart').create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { isInteractiveLegend: false },
                animation: { transitionImmediate: true },
            });
        });

        it('verify begin & end',() => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("500"),
                mocks.dataViewScopeIdentity("2000"),
                mocks.dataViewScopeIdentity("5000"),
                mocks.dataViewScopeIdentity("10000"),
            ];

            v.onDataChanged({
                    dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: [500, 2000, 5000, 10000],
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 50000,
                            max: 200000,
                            subtotal: 500000,
                            values: [100000, 200000, 150000, 50000]
                        }])
                    }
                }]
            });
            bars = $('.column');
            labels = $('.y.axis').children('.tick');

            expect(labels[0].textContent).toBe('0K');
            expect(labels[labels.length - 1].textContent).toBe('200K');
        });

        it('verify begin & end - Big Scale',() => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("500"),
                mocks.dataViewScopeIdentity("2000"),
                mocks.dataViewScopeIdentity("5000"),
                mocks.dataViewScopeIdentity("10000"),
            ];

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: [500, 2000, 50, 1000000],
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 50000,
                            max: 200000,
                            subtotal: 500000,
                            values: [100000, 1000000, 150000, 50]
                        }])
                    }
                }]
            });
            bars = $('.column');
            labels = $('.y.axis').children('.tick');

            expect(labels[0].textContent).toBe('0K');
            expect(labels[labels.length - 1].textContent).toBe('200K');
        });

        it('verify Y position change: the axis text should be further right than the axis line', () => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("500"),
                mocks.dataViewScopeIdentity("2000"),
                mocks.dataViewScopeIdentity("5000"),
                mocks.dataViewScopeIdentity("10000"),
            ];

            var dataView = {
                metadata: dataViewMetadataTwoColumn,
                categorical: {
                    categories: [{
                        source: dataViewMetadataTwoColumn.columns[0],
                        values: [500, 2000, 50, 1000000],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadataTwoColumn.columns[1],
                        min: 50000,
                        max: 200000,
                        subtotal: 500000,
                        values: [100000, 1000000, 150000, 50]
                    }])
                }
            };

            v.onDataChanged({
                dataViews: [dataView]
            });

            var yaxis = $('.y.axis');
            var yaxisLine = yaxis.find('line')[0];
            var yaxisText = yaxis.find('text')[0];

            expect(yaxisText['x']['baseVal'].getItem(0).value).toBeGreaterThan(yaxisLine['x2'].baseVal.value);

            setTimeout(() => {
                dataView.metadata.objects['valueAxis']['position'] = 'Left';
                v.onDataChanged({
                    dataViews: [dataView]
                });
                expect(yaxisText['x']['baseVal'].getItem(0).value).toBeLessThan(yaxisLine['x2'].baseVal.value);
            }, DefaultWaitForRender);
        });
    });

    describe("X Axis Customization: Bar Chart",() => {
        var v: powerbi.IVisual, element: JQuery;
        var hostServices = powerbitests.mocks.createVisualHostServices();
        var bars;
        var labels;

        var dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    name: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                },
                {
                    name: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                },
                {
                    name: 'col3',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                },
                {
                    name: 'col4',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                }],
            objects: {
                valueAxis: {
                    show: true,
                    position: true,
                    start: 0,
                    end: 200000,
                    showAxisTitle: true,
                    axisStyle: true
                }
            }
        };

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());

            element = powerbitests.helpers.testDom('500', '900');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('barChart').create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { isInteractiveLegend: false },
                animation: { transitionImmediate: true },
            });
        });

        it('verify begin & end',() => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("500"),
                mocks.dataViewScopeIdentity("2000"),
                mocks.dataViewScopeIdentity("5000"),
                mocks.dataViewScopeIdentity("10000"),
            ];

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: [500, 2000, 5000, 10000],
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 50000,
                            max: 200000,
                            subtotal: 500000,
                            values: [100000, 200000, 150000, 50000]
                        }])
                    }
                }]
            });
            bars = $('.column');
            labels = $('.x.axis').children('.tick');

            expect(labels[0].textContent).toBe('0K');
            expect(labels[labels.length - 1].textContent).toBe('200K');
        });

        it('verify begin & end - Big Range',() => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("500"),
                mocks.dataViewScopeIdentity("2000"),
                mocks.dataViewScopeIdentity("5000"),
                mocks.dataViewScopeIdentity("10000"),
            ];

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: [5, 2000, 5000, 1000000],
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 50000,
                            max: 200000,
                            subtotal: 500000,
                            values: [100000, 2000000, 150000, 50]
                        }])
                    }
                }]
            });
            bars = $('.column');
            labels = $('.x.axis').children('.tick');

            expect(labels[0].textContent).toBe('0K');
            expect(labels[labels.length - 1].textContent).toBe('200K');
        });
    });

    describe("Y Axis Customization: Bar Chart",() => {
        var v: powerbi.IVisual, element: JQuery;
        var hostServices = powerbitests.mocks.createVisualHostServices();
        var unitLength: number;
        var bars;
        var labels;
        var barHeight: number;
        var barHeightArray = [];
        var barArrayLength;        

        var dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    name: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                },
                {
                    name: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                },
                {
                    name: 'col3',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                },
                {
                    name: 'col4',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                }],
            objects: {
                categoryAxis: {
                    show: true,
                    start: 0,
                    end: 100000,
                    axisType: AxisType.scalar,
                    showAxisTitle: true,
                    axisStyle: true
                }
            }
        };

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());

            element = powerbitests.helpers.testDom('750', '500');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('barChart').create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { isInteractiveLegend: false },
                animation: { transitionImmediate: true },
            });
        });
        

        it('Basic scale check',() => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("500"),
                mocks.dataViewScopeIdentity("2000"),
                mocks.dataViewScopeIdentity("5000"),
                mocks.dataViewScopeIdentity("10000"),
            ];

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: [500, 2000, 5000, 10000],
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            min: 50000,
                            max: 200000,
                            subtotal: 500000,
                            values: [100000, 200000, 150000, 50000]
                        }])
                    }
                }]
            });
            bars = $('.bar');
            labels = $('.y.axis').children('.tick');
            barHeight = bars[0].getAttribute('height');
            barHeightArray = [];
            barArrayLength = bars.length;
            for (var i = 0; i < barArrayLength; i++) {
                barHeightArray.push(bars[i].getAttribute('y'));
            }
            barHeightArray.sort();
            unitLength = (+barHeightArray[1] - +barHeightArray[0]) / 5000;            

            //Verify begin&end labels
            expect(labels[0].textContent).toBe('0M');
            expect(labels[labels.length - 1].textContent).toBe('0.1M');
        });

    });

    describe("Bar chart legend",() => {
        var v: powerbi.IVisual, element: JQuery;
        var dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
            columns: [
                {
                    name: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                },
                {
                    name: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                }
            ],
        };
        var dataViewMetadataTwoColumnWithGroup: powerbi.DataViewMetadata = {
            columns: [
                {
                    name: 'col1',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                },
                {
                    name: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number),
                    groupName: 'group',
                },
            ],
        };

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());

            element = powerbitests.helpers.testDom('400', '300');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('barChart').create();
        });

        it('hide legend when there is only one legend and no group',() => {
            var hostServices = mocks.createVisualHostServices();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { dragDataPoint: true },
            });

            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['a', 'b', 'c', 'd'],
                            identity: [
                                mocks.dataViewScopeIdentity('a'),
                                mocks.dataViewScopeIdentity('b'),
                                mocks.dataViewScopeIdentity('c'),
                                mocks.dataViewScopeIdentity('d'),
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadataTwoColumn.columns[1],
                            values: [0.5, 2.0, 1.0, 1.5]
                        }])
                    }
                }]
            });

            var legend = element.find('.legend');
            var title = legend.find('.title');
            expect(title.length).toBe(0);
        });

        it('show legend when there is one legend and the legend is in a group',() => {
            var hostServices = mocks.createVisualHostServices();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { dragDataPoint: true },
            });

            var identities = [
                mocks.dataViewScopeIdentity('identity'),

            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumnWithGroup,
                    categorical: {
                        categories: [
                            {
                                source: dataViewMetadataTwoColumnWithGroup.columns[0],
                                values: ['a', 'b', 'c', 'd'],
                                identity: identities,
                            }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataTwoColumnWithGroup.columns[1],
                                values: [0.5, 2, 1, 1.5],
                                identity: identities[0],
                            },
                        ])
                    }
                }]
            });
;
            var title = $('.legendText');
            expect(title.length).toBe(1);
            expect(title.text()).toBe('group');
        });
    });

    function pruneColunnChartDataPoint(dataPoint: powerbi.visuals.ColumnChartDataPoint) {
        return {
            categoryValue: dataPoint.categoryValue,
            value: dataPoint.value,
        };
    }

    function columnChartDataLabelsValidation(chartType: string) {
        var v: powerbi.IVisual, element: JQuery;

        var dataViewMetadataThreeColumn: powerbi.DataViewMetadataColumn[] = [
            {
                name: 'col1',
                type: DataShapeUtility.describeDataType(SemanticType.String)
            },
            {
                name: 'col2',
                isMeasure: true,
                type: DataShapeUtility.describeDataType(SemanticType.Number)
            },
            {
                name: 'col3',
                isMeasure: true,
                type: DataShapeUtility.describeDataType(SemanticType.Number)
            }
        ];

        function metadata(columns): powerbi.DataViewMetadata {
            var metadata: powerbi.DataViewMetadata = {
                columns: columns,
            };
     
            metadata.objects = {
                labels: { show: true, color: { solid: { color: '#FF0000' } } }
            };

            return metadata;
        }

        var hostServices = powerbitests.mocks.createVisualHostServices();

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());

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

        it('Data Label Position Validation', (done) => {
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
                    values: [1000, 2000, 20],
                    subtotal: 3020
                }])
            }
        };
        v.onDataChanged({ dataViews: [dataView] });
    
            setTimeout(() => {
        var labels = $('.data-labels');
                switch (chartType) {
                    case 'barChart':
                    case 'clusteredBarChart':
                        expect(labels.length).toBe(2);
                        expect($(labels[0]).attr('y')).not.toEqual($(labels[1]).attr('y'));
                expect($(labels[0]).attr('x')).not.toEqual($(labels[1]).attr('x'));
                        break;
                    case 'columnChart':
                    case 'clusteredColumnChart':
                expect(labels.length).toBe(3);
                expect($(labels[0]).attr('x')).not.toEqual($(labels[1]).attr('x'));
                expect($(labels[1]).attr('x')).not.toEqual($(labels[2]).attr('x'));
                expect($(labels[0]).attr('y')).not.toEqual($(labels[1]).attr('y'));
                expect($(labels[1]).attr('y')).not.toEqual($(labels[2]).attr('y'));
                break;
                    case 'hundredPercentStackedColumnChart':
        expect(labels.length).toBe(3);
                    expect($(labels[0]).attr('x')).not.toEqual($(labels[1]).attr('x'));
                    expect($(labels[1]).attr('x')).not.toEqual($(labels[2]).attr('x'));
                expect($(labels[0]).attr('y')).toEqual($(labels[1]).attr('y'));
                expect($(labels[1]).attr('y')).toEqual($(labels[2]).attr('y'));
                        break;
                    case 'hundredPercentStackedBarChart':
                        expect(labels.length).toBe(0);
                }

                done();
            }, DefaultWaitForRender);
        });

        it('Data Label Position Validation negative value',(done) => {
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
                        values: [-1000, 2000, -20],
                        subtotal: 3020
                    }])
                }
            };
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                var labels = $('.data-labels');
                switch (chartType) {
                    case 'barChart':
                    case 'clusteredBarChart':
                    case 'hundredPercentStackedBarChart':
                        expect(labels.length).toBe(2);
                        expect($(labels[0]).attr('y')).not.toEqual($(labels[1]).attr('y'));
                        expect($(labels[0]).attr('x')).toEqual($(labels[1]).attr('x'));
                        break;
                    case 'columnChart':
                    case 'clusteredColumnChart':
                    case 'hundredPercentStackedColumnChart':
                        expect(labels.length).toBe(3);
                        expect($(labels[0]).attr('x')).not.toEqual($(labels[1]).attr('x'));
                        expect($(labels[1]).attr('x')).not.toEqual($(labels[2]).attr('x'));
                        expect($(labels[0]).attr('y')).not.toEqual($(labels[1]).attr('y'));
                        expect($(labels[1]).attr('y')).not.toEqual($(labels[2]).attr('y'));
                        expect($(labels[0]).attr('y')).toEqual($(labels[2]).attr('y'));
                        break;
                }

                done();
            }, DefaultWaitForRender);
        });

    }

    describe("Stacked Bar Chart Labels outsideRight",() => columnChartDataLabelsValidation('barChart'));
    describe("Clustered Bar Chart Labels outsideRight",() => columnChartDataLabelsValidation('clusteredBarChart'));
    describe("Hundred Percent Stacked Bar Chart Labels outsideRight",() => columnChartDataLabelsValidation('hundredPercentStackedBarChart'));
    describe("Stacked Column Chart Labels outsideTop",() => columnChartDataLabelsValidation('columnChart'));
    describe("Clustered Column Chart Labels outsideTop",() => columnChartDataLabelsValidation('clusteredColumnChart'));
    describe("Hundred Percent Stacked Column Chart Labels outsideTop",() => columnChartDataLabelsValidation('hundredPercentStackedColumnChart'));

    function columnChartDataLabelsVisibilityValidation(chartType: string, show: boolean) {
        var v: powerbi.IVisual, element: JQuery;

        var dataViewMetadataThreeColumn: powerbi.DataViewMetadataColumn[] = [
            {
                name: 'col1',
                type: DataShapeUtility.describeDataType(SemanticType.String)
            },
            {
                name: 'col2',
                isMeasure: true,
                type: DataShapeUtility.describeDataType(SemanticType.Number)
            },
            {
                name: 'col3',
                isMeasure: true,
                type: DataShapeUtility.describeDataType(SemanticType.Number)
            }
        ];

        function metadata(columns): powerbi.DataViewMetadata {
            var metadata: powerbi.DataViewMetadata = {
                columns: columns,
            };
     
            metadata.objects = {
                labels: { show: show, color: { solid: { color: '#FF0000' } } }
            };

            return metadata;
        }

        var hostServices = powerbitests.mocks.createVisualHostServices();

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());

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

    it('Data Label Visibility Validation',(done) => {
        var categoryIdentities = [
            mocks.dataViewScopeIdentity("John Domo"),
            mocks.dataViewScopeIdentity("Delta Force"),
        ];
        var dataView: powerbi.DataView = {
            metadata: metadata(dataViewMetadataThreeColumn),
            categorical: {
                categories: [{
                    source: dataViewMetadataThreeColumn[0],
                    values: ['John Domo', 'Delta Force',],
                    identity: categoryIdentities
                }],
                values: DataViewTransform.createValueColumns([{
                    source: dataViewMetadataThreeColumn[1],
                    values: [20, 100],
                    subtotal: 120
                }])
            }
        };
        v.onDataChanged({ dataViews: [dataView] });
    
        var labels = $('.data-labels');

        setTimeout(() => {
                
            if (show && chartType !== "hundredPercentStackedBarChart")
                expect($(labels[0]).css('fill-opacity')).toEqual('1');
            else
                expect($(labels[0]).length).toBe(0);

                done();
            }, DefaultWaitForRender);
        });
    }

    describe("Stacked Bar Chart Labels Visibility",() => columnChartDataLabelsVisibilityValidation('barChart', true));
    describe("Clustered Bar Chart Labels Visible",() => columnChartDataLabelsVisibilityValidation('clusteredBarChart',  true));
    describe("Hundred Percent Stacked Bar Chart Labels Visible",() => columnChartDataLabelsVisibilityValidation('hundredPercentStackedBarChart', true));
    describe("Stacked Column Chart Labels Visible",() => columnChartDataLabelsVisibilityValidation('columnChart', true));
    describe("Clustered Column Chart Labels Visible",() => columnChartDataLabelsVisibilityValidation('clusteredColumnChart',true));
    describe("Hundred Percent Stacked Column Chart Labels Visible",() => columnChartDataLabelsVisibilityValidation('hundredPercentStackedColumnChart',true));

    describe("Stacked Bar Chart Labels Unvisible",() => columnChartDataLabelsVisibilityValidation('barChart', false));
    describe("Clustered Bar Chart Labels Unvisible",() => columnChartDataLabelsVisibilityValidation('clusteredBarChart', false));
    describe("Hundred Percent Stacked Bar Chart Labels Unvisible",() => columnChartDataLabelsVisibilityValidation('hundredPercentStackedBarChart', false));
    describe("Stacked Column Chart Labels Unvisible",() => columnChartDataLabelsVisibilityValidation('columnChart', false));
    describe("Clustered Column Chart Labels Unvisible",() => columnChartDataLabelsVisibilityValidation('clusteredColumnChart', false));
    describe("Hundred Percent Stacked Column Chart Labels Unvisible",() => columnChartDataLabelsVisibilityValidation('hundredPercentStackedColumnChart', false));

    function columnChartDataLabelsColorValidation(chartType: string, color: string) {
        var v: powerbi.IVisual, element: JQuery;

        var dataViewMetadataThreeColumn: powerbi.DataViewMetadataColumn[] = [
            {
                name: 'col1',
                type: DataShapeUtility.describeDataType(SemanticType.String)
            },
            {
                name: 'col2',
                isMeasure: true,
                type: DataShapeUtility.describeDataType(SemanticType.Number)
            },
            {
                name: 'col3',
                isMeasure: true,
                type: DataShapeUtility.describeDataType(SemanticType.Number)
            }
        ];

        function metadata(columns): powerbi.DataViewMetadata {
            var metadata: powerbi.DataViewMetadata = {
                columns: columns,
            };

            metadata.objects = {
                labels: { show: true, color: { solid: { color: color } } }
            };

            return metadata;
        }

        var hostServices = powerbitests.mocks.createVisualHostServices();

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());

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

        it('Data Label Color Validation',(done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("John Domo"),
                mocks.dataViewScopeIdentity("Delta Force"),
            ];
            var dataView: powerbi.DataView = {
                metadata: metadata(dataViewMetadataThreeColumn),
                categorical: {
                    categories: [{
                        source: dataViewMetadataThreeColumn[0],
                        values: ['John Domo', 'Delta Force', ],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadataThreeColumn[1],
                        values: [20, 1000],
                        subtotal: 1020
                    }])
                }
            };
            v.onDataChanged({ dataViews: [dataView] });

            var labels = $('.data-labels');

            setTimeout(() => {
                if (chartType === "hundredPercentStackedBarChart")
                    expect($(labels[0]).length).toBe(0);
                else
                expect(ColorUtility.convertFromRGBorHexToHex($(labels[0]).css('fill'))).toEqual(ColorUtility.convertFromRGBorHexToHex('#ff0000'));
                done();
            }, DefaultWaitForRender);
        });
    }

    describe("Stacked Bar Chart Labels Color",() => columnChartDataLabelsColorValidation('barChart', 'rgb(255, 0, 0)'));
    describe("Clustered Bar Chart Labels Color",() => columnChartDataLabelsColorValidation('clusteredBarChart', 'rgb(255, 0, 0)'));
    describe("Hundred Percent Stacked Bar Chart Labels Color",() => columnChartDataLabelsColorValidation('hundredPercentStackedBarChart', 'rgb(255, 0, 0)'));
    describe("Stacked Column Chart Labels Color",() => columnChartDataLabelsColorValidation('columnChart', 'rgb(255, 0, 0)'));
    describe("Clustered Column Chart Labels Color",() => columnChartDataLabelsColorValidation('clusteredColumnChart', 'rgb(255, 0, 0)'));
    describe("Hundred Percent Stacked Column Chart Labels Color", () => columnChartDataLabelsColorValidation('hundredPercentStackedColumnChart', 'rgb(255, 0, 0)'));

    it('Column Chart X and Y-axis show/hide Title ', () => {

        var element = powerbitests.helpers.testDom('500', '500');
        var hostServices = powerbitests.mocks.createVisualHostServices();
            var categoryIdentities = [mocks.dataViewScopeIdentity("John Domo")];
        var v = powerbi.visuals.visualPluginFactory.create().getPlugin('columnChart').create();
        v.init({
            element: element,
            host: hostServices,
            style: powerbi.common.services.visualStyles.create(),
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
                    name: 'AxesTitleTest',
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

    function columnChartDataLabelsFormatValidation(chartType: string) {
        var v: powerbi.IVisual, element: JQuery;

        var dataViewMetadataThreeColumn: powerbi.DataViewMetadataColumn[] = [
            {
                name: 'col1',
                type: DataShapeUtility.describeDataType(SemanticType.String)
            },
            {
                name: 'col2',
                isMeasure: true,
                type: DataShapeUtility.describeDataType(SemanticType.Number)
            },
            {
                name: 'col3',
                isMeasure: true,
                type: DataShapeUtility.describeDataType(SemanticType.Number)
            }
        ];

        function metadata(columns, displayUnits: number = 0, precision: number = 0): powerbi.DataViewMetadata {
            var metadata: powerbi.DataViewMetadata = {
                columns: columns,
            };

            metadata.objects = {
                labels: { show: true, labelDisplayUnits: displayUnits, labelPrecision: precision }
            };

            return metadata;
        }

        var hostServices = powerbitests.mocks.createVisualHostServices();

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());

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

        it('labels should support display units with no precision', (done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("John Domo"),
            ];
            var dataView: powerbi.DataView = {
                metadata: metadata(dataViewMetadataThreeColumn, 1000, 0),
                categorical: {
                    categories: [{
                        source: dataViewMetadataThreeColumn[0],
                        values: ['John Domo'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadataThreeColumn[1],
                        values: [500123],
                        subtotal: 3020
                    }])
                }
            };
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                expect($('.data-labels').first().text()).toEqual('500K');
                done();
            }, DefaultWaitForRender);
        });

        it('labels should support display units with precision', (done) => {
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("John Domo"),
            ];
            var dataView: powerbi.DataView = {
                metadata: metadata(dataViewMetadataThreeColumn, 1000, 1),
                categorical: {
                    categories: [{
                        source: dataViewMetadataThreeColumn[0],
                        values: ['John Domo'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadataThreeColumn[1],
                        values: [500123],
                        subtotal: 3020
                    }])
                }
            };
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                expect($('.data-labels').first().text()).toEqual('500.1K');
                done();
            }, DefaultWaitForRender);
        });

    }

    describe("Column chart format validation", () => columnChartDataLabelsFormatValidation('columnChart'));

}
