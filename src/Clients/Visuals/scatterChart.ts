//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    import color = jsCommon.color;

    export interface ScatterChartDataPoint extends SelectableDataPoint, TooltipEnabledDataPoint, LabelEnabledDataPoint {
        x: any;
        y: any;
        radius: RadiusData;
        fill: string;
        category: any;
    }

    export interface RadiusData {
        sizeMeasure: DataViewValueColumn;
        index: number;
    }

    export interface DataRange {
        minRange: number;
        maxRange: number;
        delta: number;
    }

    export interface ScatterChartData {
        xCol: DataViewMetadataColumn;
        yCol: DataViewMetadataColumn;
        dataPoints: ScatterChartDataPoint[];
        legendData: LegendData;
        axesLabels: ChartAxesLabels;
        size?: DataViewMetadataColumn;
        sizeRange: NumberRange;
        dataLabelsSettings: PointDataLabelsSettings
    }

    interface ScatterChartMeasureMetadata {
        useSeriesForColors: boolean;
        idx: {
            x?: number;
            y?: number;
            size?: number;
        };
        cols: {
            x?: DataViewMetadataColumn;
            y?: DataViewMetadataColumn;
            size?: DataViewMetadataColumn;
        };
        axesLabels: ChartAxesLabels;
    }

    interface MouseCoordinates {
        x: number;
        y: number;
    }

    export class ScatterChart implements ICartesianVisual, IInteractiveVisual {
        private static ScatterChartCircleTagName = 'circle';
        private static BubbleRadius = 3 * 2;
        public static DefaultBubbleOpacity = 0.85;
        public static DimmedBubbleOpacity = 0.4;
        // Chart Area and size range values as defined by PV charts
        private static AreaOf300By300Chart = 90000;
        private static MinSizeRange = 200;
        private static MaxSizeRange = 3000;
        private static ClassName = 'scatterChart';
        private static MainGraphicsContextClassName = 'mainGraphicsContext';

        private static DotClassName = 'dot';
        private static DotClassSelector = '.' + ScatterChart.DotClassName;

        private svg: D3.Selection;
        private element: JQuery;
        private mainGraphicsContext: D3.Selection;
        private mainGraphicsG: D3.Selection;
        private currentViewport: IViewport;
        private style: IVisualStyle;
        private data: ScatterChartData;
        private dataView: DataView;
        private host: IVisualHostServices;
        private margin: IMargin;
        private xAxisProperties: IAxisProperties;
        private yAxisProperties: IAxisProperties;
        private colors: IDataColorPalette;
        private options: VisualInitOptions;
        private interactivity: InteractivityOptions;
        private cartesianVisualHost: ICartesianVisualHost;
        private isInteractiveChart: boolean;
        private interactivityService: IInteractivityService;
        private categoryAxisProperties: DataViewObject;
        private valueAxisProperties: DataViewObject;

        private defaultDataPointColor: string;

        public init(options: CartesianVisualInitOptions) {
            this.options = options;
            var element = this.element = options.element;
            this.currentViewport = options.viewport;
            this.style = options.style;
            this.host = options.host;
            this.colors = this.style.colorPalette.dataColors;
            this.interactivity = options.interactivity;
            this.cartesianVisualHost = options.cartesianHost;
            this.isInteractiveChart = options.interactivity && options.interactivity.isInteractiveLegend;
            this.interactivityService = VisualInteractivityFactory.buildInteractivityService(options);

            element.addClass(ScatterChart.ClassName);
            var svg = this.svg = options.svg;

            this.mainGraphicsG = svg.append('g')
                .classed(ScatterChart.MainGraphicsContextClassName, true);

            this.mainGraphicsContext = this.mainGraphicsG.append('svg');
        }

        public static converter(dataView: DataView, currentViewport: IViewport, colorPalette: IDataColorPalette, interactivityService?: IInteractivityService, defaultDataPointColor?: string, categoryAxisProperties?: DataViewObject, valueAxisProperties?: DataViewObject): ScatterChartData {
            var categoryValues: any[],
                categoryFormatter: IValueFormatter,
                categoryObjects: DataViewObjects[],
                categoryIdentities: DataViewScopeIdentity[];

            var dataViewCategorical: DataViewCategorical = dataView.categorical;
            var dataViewMetadata: DataViewMetadata = dataView.metadata;

            if (dataViewCategorical.categories && dataViewCategorical.categories.length > 0) {
                categoryValues = dataViewCategorical.categories[0].values;
                categoryFormatter = valueFormatter.create({ format: valueFormatter.getFormatString(dataViewCategorical.categories[0].source, scatterChartProps.general.formatString), value: categoryValues[0], value2: categoryValues[categoryValues.length - 1] });
                categoryIdentities = dataViewCategorical.categories[0].identity;
                categoryObjects = dataViewCategorical.categories[0].objects;
            }
            else {
                categoryValues = [null];
            }

            var categories = dataViewCategorical.categories;
            var dataValues = dataViewCategorical.values;
            var hasDynamicSeries = !!dataValues.source;
            var grouped = dataValues.grouped();
            var dvSource = dataValues.source;
            var scatterMetadata = ScatterChart.getMetadata(grouped, dvSource);
            var dataLabelsSettings = dataLabelUtils.getDefaultPointLabelSettings();

            if (dataViewMetadata && dataViewMetadata.objects) {

                var objects = dataViewMetadata.objects;

                var labelsObj = objects['categoryLabels'];
                if (labelsObj) {
                    dataLabelsSettings.show = (labelsObj['show'] !== undefined) ? <boolean>labelsObj['show'] : dataLabelsSettings.show;
                    dataLabelsSettings.precision = (labelsObj['labelsPrecision'] !== undefined) ? +<string>labelsObj['labelsPrecision'] : dataLabelsSettings.precision;
                    if (labelsObj['color'] !== undefined) {
                        dataLabelsSettings.labelColor = (<Fill>labelsObj['color']).solid.color;
                        dataLabelsSettings.overrideDefaultColor = true;
                    }
                }
            }

            var dataPoints = ScatterChart.createDataPoints(
                grouped,
                scatterMetadata,
                categories,
                categoryValues,
                dvSource,
                categoryFormatter,
                categoryIdentities,
                categoryObjects,
                colorPalette,
                currentViewport,
                hasDynamicSeries,
                dataLabelsSettings,
                defaultDataPointColor);

            if (interactivityService) {
                interactivityService.applySelectionStateToData(dataPoints);
            }

            var legendItems = scatterMetadata.useSeriesForColors
                ? ScatterChart.createSeriesLegend(grouped, colorPalette, dataValues, valueFormatter.getFormatString(dvSource, scatterChartProps.general.formatString), defaultDataPointColor)
                : ScatterChart.createCategoryLegend(categoryValues, categoryFormatter, colorPalette, categoryIdentities, categories ? categories[0] : undefined, defaultDataPointColor);

            var legendTitle = dataValues && dvSource ? dvSource.displayName : "";
            if (!legendTitle) {
                legendTitle = categories && categories[0].source.displayName ? categories[0].source.displayName : "";
            }
            
            var legendData = { title: legendTitle, dataPoints: legendItems };

            var sizeRange = ScatterChart.getSizeRangeForGroups(grouped, scatterMetadata.idx.size);

            if (categoryAxisProperties && categoryAxisProperties["showAxisTitle"] !== null && categoryAxisProperties["showAxisTitle"] === false) {
                scatterMetadata.axesLabels.x = null;
            }
            if (valueAxisProperties && valueAxisProperties["showAxisTitle"] !== null && valueAxisProperties["showAxisTitle"] === false) {
                scatterMetadata.axesLabels.y = null;
            }

            return {
                xCol: scatterMetadata.cols.x,
                yCol: scatterMetadata.cols.y,
                dataPoints: dataPoints,
                legendData: legendData,
                axesLabels: scatterMetadata.axesLabels,
                hasSelection: false,
                selectedIds: [],
                size: scatterMetadata.cols.size,
                sizeRange: sizeRange,
                dataLabelsSettings: dataLabelsSettings,
            };
        }

        private static getSizeRangeForGroups(
            dataViewValueGroups: DataViewValueColumnGroup[],
            sizeColumnIndex: number): NumberRange {

            var result: NumberRange = {};
            if (dataViewValueGroups) {
                dataViewValueGroups.forEach((group) => {
                    var sizeColumn = ScatterChart.getMeasureValue(sizeColumnIndex, group.values);
                    var currentRange: NumberRange = AxisHelper.getRangeForColumn(sizeColumn);
                    if (result.min == null || result.min > currentRange.min) {
                        result.min = currentRange.min;
                    }
                    if (result.max == null || result.max < currentRange.max) {
                        result.max = currentRange.max;
                    }
                });
            }
            return result;
        }

        private static createDataPoints(
            grouped: DataViewValueColumnGroup[],
            metadata: ScatterChartMeasureMetadata,
            categories: DataViewCategoryColumn[],
            categoryValues: any[],
            dataValueSource: DataViewMetadataColumn,
            categoryFormatter: IValueFormatter,
            categoryIdentities: DataViewScopeIdentity[],
            categoryObjects: DataViewObjects[],
            colorPalette: IDataColorPalette,
            viewport: IViewport,
            hasDynamicSeries: boolean,
            labelSettings: PointDataLabelsSettings,
            defaultDataPointColor?: string): ScatterChartDataPoint[] {

            var dataPoints: ScatterChartDataPoint[] = [],
                useSeriesForColors = metadata.useSeriesForColors,
                indicies = metadata.idx,
                formatStringProp = scatterChartProps.general.formatString,
                fillProp = scatterChartProps.dataPoint.fill;

            for (var categoryIdx = 0, ilen = categoryValues.length; categoryIdx < ilen; categoryIdx++) {
                var categoryValue = categoryValues[categoryIdx];
                var color: string;
                for (var seriesIdx = 0, len = grouped.length; seriesIdx < len; seriesIdx++) {
                    var grouping = grouped[seriesIdx];
                    var seriesValues = grouping.values;
                    var measureX = ScatterChart.getMeasureValue(indicies.x, seriesValues);
                    var measureY = ScatterChart.getMeasureValue(indicies.y, seriesValues);
                    var measureSize = ScatterChart.getMeasureValue(indicies.size, seriesValues);

                    var xVal = measureX && measureX.values ? measureX.values[categoryIdx] : null;
                    var yVal = measureY && measureY.values ? measureY.values[categoryIdx] : 0;

                    var hasNullValue = (xVal == null) || (yVal == null);

                    if (hasNullValue)
                        continue;

                    if (grouping.objects) {
                        color = DataViewObjects.getFillColor(grouping.objects, fillProp);
                    }
                    else if (useSeriesForColors && categoryObjects && categoryObjects[categoryIdx] && grouped.length === 1) {
                        color = DataViewObjects.getFillColor(categoryObjects[categoryIdx], fillProp);
                    }
                    else if (!useSeriesForColors && categoryObjects && categoryObjects[grouped.length !== 1 ? seriesIdx : categoryIdx]) {
                        color = DataViewObjects.getFillColor(categoryObjects[grouped.length !== 1 ? seriesIdx : categoryIdx], fillProp);
                    }
                    else {
                        color = ScatterChart.getBubbleColor(useSeriesForColors ? seriesIdx : categoryIdx, colorPalette, defaultDataPointColor);
                    }
                    var fill: string;
                    fill = ScatterChart.getBubbleColor(useSeriesForColors ? seriesIdx : categoryIdx, colorPalette, defaultDataPointColor);

                    var identity = SelectionId.createWithIds(
                        categoryIdentities ? categoryIdentities[categoryIdx] : undefined,
                        hasDynamicSeries ? grouping.identity : undefined);

                    var seriesData: TooltipSeriesDataItem[] = [];
                    if (dataValueSource) {
                        // Dynamic series
                        seriesData.push({ value: grouping.name, metadata: { source: dataValueSource, values: [] } });
                    }
                    if (measureX) {
                        seriesData.push({ value: xVal, metadata: measureX });
                    }
                    if (measureY) {
                        seriesData.push({ value: yVal, metadata: measureY });
                    }
                    if (measureSize && measureSize.values && measureSize.values.length > 0) {
                        seriesData.push({ value: measureSize.values[categoryIdx], metadata: measureSize });
                    }

                    var tooltipInfo: TooltipDataItem[] = TooltipBuilder.createTooltipInfo(formatStringProp, categories, categoryValue, null, null, seriesData);

                    var dataPoint: ScatterChartDataPoint = {
                        x: xVal,
                        y: yVal,
                        radius: { sizeMeasure: measureSize, index: categoryIdx },
                        fill: color,
                        category: categoryFormatter ? categoryFormatter.format(categoryValue) : categoryValue,
                        selected: false,
                        identity: identity,
                        tooltipInfo: tooltipInfo,
                        labelFill: labelSettings.overrideDefaultColor ? labelSettings.labelColor : color,
                    };

                    dataPoints.push(dataPoint);
                }
            }
            return dataPoints;
        }

        private static createSeriesLegend(
            grouped: DataViewValueColumnGroup[],
            colorPalette: IDataColorPalette,
            categorical: DataViewValueColumns,
            formatString: string,
            defaultDataPointColor: string
            ): LegendDataPoint[] {

            var legendItems: LegendDataPoint[] = [];
            for (var i = 0, len = grouped.length; i < len; i++) {
                var grouping = grouped[i];
                var fill = this.getDataPointColor(categorical, colorPalette, i, defaultDataPointColor);
                legendItems.push({
                    color: fill,
                    icon: LegendIcon.Circle,
                    label: valueFormatter.format(grouping.name, formatString),
                    identity: grouping.identity ? SelectionId.createWithId(grouping.identity) : SelectionId.createNull(),
                    selected: false
                });
            }

            return legendItems;
        }

        private static createCategoryLegend(
            categoryValues: any[],
            categoryFormatter: IValueFormatter,
            colorPalette: IDataColorPalette,
            categoryIdentities: DataViewScopeIdentity[],
            categories: DataViewCategoryColumn,
            defaultDataPointColor: string
            ): LegendDataPoint[] {

            var len = categoryValues.length;
            if (len <= 1)
                return;
            var categoryIdentityLength = categoryIdentities ? categoryIdentities.length : 0;
            var color: string;
            var legendItems: LegendDataPoint[] = [];
            var fillProp = scatterChartProps.dataPoint.fill;
            for (var i = 0; i < len; i++) {
                if (categories && categories.objects && categories.objects[i]) {
                    color = DataViewObjects.getFillColor(categories.objects[i], fillProp);
                }
                else {
                    color = ScatterChart.getBubbleColor(i, colorPalette, defaultDataPointColor);
                }
                legendItems.push({
                    color: color,
                    icon: LegendIcon.Circle,
                    label: categoryFormatter ? categoryFormatter.format(categoryValues[i]) : categoryValues[i],
                    identity: categoryIdentityLength > i ? SelectionId.createWithId(categoryIdentities[i]) : SelectionId.createNull(),
                    selected: false,
                });
            }

            return legendItems;
        }

        private static getDataPointColor(categorical: DataViewValueColumns, colorPalette: IDataColorPalette, categoricalIndex, defaultDataPointColor?: string) {
            var fill: string;
            if (categorical) {
                var categoricalGrouped = categorical.grouped();
                if (categoricalGrouped) {
                    var categoricalObjects = categoricalGrouped[categoricalIndex].objects;
                    if (categoricalObjects) {
                        fill = DataViewObjects.getFillColor(categoricalObjects, scatterChartProps.dataPoint.fill);
                    }
                }
            }
            if (!fill) {
                fill = ScatterChart.getBubbleColor(categoricalIndex, colorPalette, defaultDataPointColor);
            }
            return fill;
        }

        public static getBubbleRadius(radiusData: RadiusData, sizeRange: NumberRange, viewPort: IViewport): number {
            var actualSizeDataRange = null;
            var bubblePixelAreaSizeRange = null;
            var measureSize = radiusData.sizeMeasure;

            if (!measureSize)
                return ScatterChart.BubbleRadius;

            var minSize = sizeRange.min ? sizeRange.min : 0;
            var maxSize = sizeRange.max ? sizeRange.max : 0;

            var min = Math.min(minSize, 0);
            var max = Math.max(maxSize, 0);
            actualSizeDataRange = {
                minRange: min,
                maxRange: max,
                delta: max - min
            };

            bubblePixelAreaSizeRange = ScatterChart.getBubblePixelAreaSizeRange(viewPort, ScatterChart.MinSizeRange, ScatterChart.MaxSizeRange);

            if (measureSize.values) {
                var sizeValue = measureSize.values[radiusData.index];
                if (sizeValue != null) {
                    return ScatterChart.projectSizeToPixels(sizeValue, actualSizeDataRange, bubblePixelAreaSizeRange) / 2;
                }
            }

            return ScatterChart.BubbleRadius;
        }

        public static getBubbleColor(groupIndex: number, colors: IDataColorPalette, defaultDataPointColor?: string): string {
            var dataPointColor = defaultDataPointColor || (colors.getColor(groupIndex)).value;
            var colorObject = color.parseRgb(dataPointColor);
            return color.rgbString(colorObject);
        }

        public static getMeasureValue(measureIndex: number, seriesValues: DataViewValueColumn[]): DataViewValueColumn {
            if (measureIndex >= 0)
                return seriesValues[measureIndex];

            return null;
        }

        private static getMetadata(grouped: DataViewValueColumnGroup[], source: DataViewMetadataColumn): ScatterChartMeasureMetadata {
            var xIndex = DataRoleHelper.getMeasureIndexOfRole(grouped, 'X');
            var yIndex = DataRoleHelper.getMeasureIndexOfRole(grouped, 'Y');
            var sizeIndex = DataRoleHelper.getMeasureIndexOfRole(grouped, 'Size');
            var xCol: DataViewMetadataColumn;
            var yCol: DataViewMetadataColumn;
            var sizeCol: DataViewMetadataColumn;
            var xAxisLabel = "";
            var yAxisLabel = "";

            if (grouped && grouped.length) {
                var firstGroup = grouped[0],
                    measureCount = firstGroup.values.length;

                if (!(xIndex >= 0))
                    xIndex = ScatterChart.getDefaultMeasureIndex(measureCount, yIndex, sizeIndex);
                if (!(yIndex >= 0))
                    yIndex = ScatterChart.getDefaultMeasureIndex(measureCount, xIndex, sizeIndex);
                if (!(sizeIndex >= 0))
                    sizeIndex = ScatterChart.getDefaultMeasureIndex(measureCount, xIndex, yIndex);

                if (xIndex >= 0) {
                    xCol = firstGroup.values[xIndex].source;
                    xAxisLabel = firstGroup.values[xIndex].source.displayName;
                }
                if (yIndex >= 0) {
                    yCol = firstGroup.values[yIndex].source;
                    yAxisLabel = firstGroup.values[yIndex].source.displayName;
                }
                if (sizeIndex >= 0) {
                    sizeCol = firstGroup.values[sizeIndex].source;
                }
            }

            var useSeriesForColor = (source)
                ? DataRoleHelper.hasRole(source, "Series")
                : !(sizeIndex >= 0);

            return {
                useSeriesForColors: useSeriesForColor,
                idx: {
                    x: xIndex,
                    y: yIndex,
                    size: sizeIndex,
                },
                cols: {
                    x: xCol,
                    y: yCol,
                    size: sizeCol,
                },
                axesLabels: {
                    x: xAxisLabel,
                    y: yAxisLabel
                }
            };
        }

        private static getDefaultMeasureIndex(count: number, usedIndex: number, usedIndex2: number): number {
            for (var i = 0; i < count; i++) {
                if (i !== usedIndex && i !== usedIndex2)
                    return i;
            }
        }

        public setData(dataViews: DataView[]) {
            this.data = {
                xCol: undefined,
                yCol: undefined,
                dataPoints: [],
                legendData: { dataPoints: [] },
                axesLabels: { x: '', y: '' },
                selectedIds: [],
                sizeRange: [],
                dataLabelsSettings: dataLabelUtils.getDefaultPointLabelSettings(),
            };

            if (dataViews.length > 0) {
                var dataView = dataViews[0];

                if (dataView) {
                    this.categoryAxisProperties = CartesianHelper.getCategoryAxisProperties(dataView.metadata,true);
                    this.valueAxisProperties = CartesianHelper.getValueAxisProperties(dataView.metadata,true);  
                    this.dataView = dataView;

                    if (dataView.metadata && dataView.metadata.objects) {
                        var objects = dataView.metadata.objects;
                        var defaultColor = DataViewObjects.getFillColor(objects, scatterChartProps.dataPoint.defaultColor);

                        if (defaultColor)
                            this.defaultDataPointColor = defaultColor;
                    }

                    if (dataView.categorical && dataView.categorical.values) {
                        this.data = ScatterChart.converter(dataView, this.currentViewport, this.colors, this.interactivityService, this.defaultDataPointColor, this.categoryAxisProperties, this.valueAxisProperties);
                    }

                }
            }
        }

        public calculateLegend(): LegendData {
            return this.data.legendData;
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] {
            switch (options.objectName) {
                case 'dataPoint':
                    var categoricalDataView: DataViewCategorical = this.dataView && this.dataView.categorical ? this.dataView.categorical : null;
                    var hasGradientRole = GradientUtils.hasGradientRole(categoricalDataView);
                    if (!hasGradientRole)
                    return this.enumerateDataPoints();
                case 'categoryAxis':
                    return [{
                        selector: null,
                        properties: {
                            showAxisTitle: !this.categoryAxisProperties || this.categoryAxisProperties["showAxisTitle"] == null ? true : this.categoryAxisProperties["showAxisTitle"]
                        },
                        objectName: 'categoryAxis'
                    }];   
                case 'valueAxis':
                    return [{
                        selector: null,
                        properties: {
                            showAxisTitle: !this.valueAxisProperties || this.valueAxisProperties["showAxisTitle"] == null ? true : this.valueAxisProperties["showAxisTitle"]
                        },
                        objectName: 'valueAxis'
                    }];      
                case 'categoryLabels':
                    return (this.data)
                        ? dataLabelUtils.enumerateCategoryLabels(this.data.dataLabelsSettings, true)
                        : dataLabelUtils.enumerateCategoryLabels(null, true);         
            }
        }

        private enumerateDataPoints(): VisualObjectInstance[] {
            var data = this.data;
            if (!data)
                return;

            var instances: VisualObjectInstance[] = [],
                seriesCount = data.dataPoints.length;

            instances.push({
                objectName: 'dataPoint',
                selector: null,
                properties: {
                    defaultColor: { solid: { color: this.defaultDataPointColor || this.colors.getColor(0).value } }
                },
            });

            var rbgColor: string;

            if (data.legendData.dataPoints.length === 1) {
                for (var i = 0; i < seriesCount; i++) {
                    var seriesDataPoints = data.dataPoints[i];
                    rbgColor = seriesDataPoints.fill.length !== 7 ? jsCommon.color.rgbStringToHexString(seriesDataPoints.fill) : seriesDataPoints.fill;
                    var selector = seriesDataPoints.identity.getSelector();
                    if (selector.metadata)
                        selector = { data: selector.data };
                    instances.push({
                        objectName: 'dataPoint',
                        displayName: seriesDataPoints.category,
                        selector: selector,
                        properties: {
                            fill: { solid: { color: rbgColor } }
                        },
                    });
                }
            }
            else {
                var legendDataPointLength = data.legendData.dataPoints.length;
                for (var i = 0; i < legendDataPointLength; i++) {
                    var series = data.legendData.dataPoints[i];
                    rbgColor = series.color.length !== 7 ? jsCommon.color.rgbStringToHexString(series.color) : series.color;
                    var selector = series.identity.getSelector();
                    if (selector && selector.metadata)
                        selector = { data: selector.data };
                    instances.push({
                        objectName: 'dataPoint',
                        displayName: series.label,
                        selector: selector,
                        properties: {
                            fill: { solid: { color: rbgColor } }
                        },
                    });
                }
            }
            return instances;
        }

        public calculateAxesProperties(options: CalculateScaleAndDomainOptions): IAxisProperties[] {
            var data = this.data;
            var dataPoints = data.dataPoints;
            var viewport = this.currentViewport = options.viewport;
            var margin = options.margin;

            this.currentViewport = viewport;
            this.margin = margin;

            var width = viewport.width - (margin.left + margin.right);
            var height = viewport.height - (margin.top + margin.bottom);
            var minY = 0,
                maxY = 10,
                minX = 0,
                maxX = 10;
            if (dataPoints.length > 0) {
                minY = d3.min<ScatterChartDataPoint, number>(dataPoints, d => d.y);
                maxY = d3.max<ScatterChartDataPoint, number>(dataPoints, d => d.y);
                minX = d3.min<ScatterChartDataPoint, number>(dataPoints, d => d.x);
                maxX = d3.max<ScatterChartDataPoint, number>(dataPoints, d => d.x);
            }

            var xDomain = [minX, maxX];
            var combinedXDomain = AxisHelper.combineDomain(options.forcedXDomain, xDomain);           

            this.xAxisProperties = AxisHelper.createAxis({
                pixelSpan: width,
                dataDomain: combinedXDomain,
                metaDataColumn: data.xCol,
                formatStringProp: scatterChartProps.general.formatString,
                outerPadding: 0,
                isScalar: true,
                isVertical: false,
                forcedTickCount: options.forcedTickCount,
                useTickIntervalForDisplayUnits: true,
                isCategoryAxis: true//scatter doesn't have a categorical axis, but this is needed for the pane to react correctly to the x-axis toggle one/off
            });
            this.xAxisProperties.axis.tickSize(-height, 0);
            this.xAxisProperties.axisLabel = this.data.axesLabels.x;

            var combinedDomain = AxisHelper.combineDomain(options.forcedYDomain, [minY, maxY]);

            this.yAxisProperties = AxisHelper.createAxis({
                pixelSpan: height,
                dataDomain: combinedDomain,
                metaDataColumn: data.yCol,
                formatStringProp: scatterChartProps.general.formatString,
                outerPadding: 0,
                isScalar: true,
                isVertical: true,
                forcedTickCount: options.forcedTickCount,
                useTickIntervalForDisplayUnits: true,
                isCategoryAxis: false
            });
            this.yAxisProperties.axisLabel = this.data.axesLabels.y;

            return [this.xAxisProperties, this.yAxisProperties];
        }

        public overrideXScale(xProperties: IAxisProperties): void {
            this.xAxisProperties = xProperties;
        }

        public render(duration: number): void {
            if (!this.data)
                return;

            var data = this.data;
            var dataPoints = this.data.dataPoints;

            var margin = this.margin;
            var viewport = this.currentViewport;
            var width = viewport.width - (margin.left + margin.right);
            var height = viewport.height - (margin.top + margin.bottom);
            var xScale = this.xAxisProperties.scale;
            var yScale = this.yAxisProperties.scale;

            var hasSelection = dataHasSelection(dataPoints);

            this.mainGraphicsContext.attr('width', width)
                .attr('height', height);

            var sortedData = dataPoints.sort(function (a, b) {
                return b.radius.sizeMeasure ? (b.radius.sizeMeasure.values[b.radius.index] - a.radius.sizeMeasure.values[a.radius.index]) : 0;
            });
            var dots = this.mainGraphicsContext.selectAll(ScatterChart.DotClassSelector).data(sortedData,(d: ScatterChartDataPoint) => d.identity.getKey());

            dots.enter().append(ScatterChart.ScatterChartCircleTagName)
                .classed(ScatterChart.DotClassName, true);

            dots
                .style({
                    'fill': (d: ScatterChartDataPoint) => d.fill,
                    'fill-opacity': (d: ScatterChartDataPoint) => ScatterChart.getBubbleOpacity(d, hasSelection)
                })
                .transition()
                .duration(duration)
                .attr({
                    r: (d: ScatterChartDataPoint) => { return ScatterChart.getBubbleRadius(d.radius, data.sizeRange, viewport); },
                    cx: d => xScale(d.x),
                    cy: d => yScale(d.y),
                });

            dots.exit().remove();

            if (this.data.dataLabelsSettings.show) {
                var layout = dataLabelUtils.getScatterChartLabelLayout(xScale, yScale, this.data.dataLabelsSettings, viewport, data.sizeRange);
                dataLabelUtils.drawDefaultLabelsForDataPointChart(sortedData, this.mainGraphicsContext, layout, this.currentViewport);
            }
            else {
                dataLabelUtils.cleanDataLabels(this.mainGraphicsContext);
            }

            if (this.interactivityService) {
                var options: ScatterBehaviorOptions = {
                    host: this.cartesianVisualHost,
                    root: this.svg,
                    dataPointsSelection: dots,
                    mainContext: this.mainGraphicsContext,
                    data: this.data,
                    visualInitOptions: this.options,
                    xAxisProperties: this.xAxisProperties,
                    yAxisProperties: this.yAxisProperties,
                    background: d3.select(this.element.get(0)),
                };

                this.interactivityService.apply(this, options);
            }

            TooltipManager.addTooltip(dots, (d, i) => d.tooltipInfo);

            SVGUtil.flushAllD3TransitionsIfNeeded(this.options);
        }

        public static getBubblePixelAreaSizeRange(viewPort: IViewport, minSizeRange: number, maxSizeRange: number): DataRange {
            var ratio = 1.0;
            if (viewPort.height > 0 && viewPort.width > 0) {
                var minSize = Math.min(viewPort.height, viewPort.width);
                ratio = (minSize * minSize) / ScatterChart.AreaOf300By300Chart;
            }

            var minRange = Math.round(minSizeRange * ratio);
            var maxRange = Math.round(maxSizeRange * ratio);
            return {
                minRange: minRange,
                maxRange: maxRange,
                delta: maxRange - minRange
            };
        }

        public static project(value: number, actualSizeDataRange: DataRange, bubblePixelAreaSizeRange: DataRange): number {
            if (actualSizeDataRange.delta === 0 || bubblePixelAreaSizeRange.delta === 0) {
                return (ScatterChart.rangeContains(actualSizeDataRange, value)) ? bubblePixelAreaSizeRange.minRange : null;
            }

            var relativeX = (value - actualSizeDataRange.minRange) / actualSizeDataRange.delta;
            return bubblePixelAreaSizeRange.minRange + relativeX * bubblePixelAreaSizeRange.delta;
        }

        public static projectSizeToPixels(size: number, actualSizeDataRange: DataRange, bubblePixelAreaSizeRange: DataRange): number {
            var projectedSize = 0;
            if (actualSizeDataRange) {
                // Project value on the required range of bubble area sizes
                projectedSize = bubblePixelAreaSizeRange.maxRange;
                if (actualSizeDataRange.delta !== 0) {
                    var value = Math.min(Math.max(size, actualSizeDataRange.minRange), actualSizeDataRange.maxRange);
                    projectedSize = ScatterChart.project(value, actualSizeDataRange, bubblePixelAreaSizeRange);
                }

                projectedSize = Math.sqrt(projectedSize / Math.PI) * 2;
            }

            return Math.round(projectedSize);
        }

        public static rangeContains(range: DataRange, value: number): boolean {
            return range.minRange <= value && value <= range.maxRange;
        }

        public static getBubbleOpacity(d: ScatterChartDataPoint, hasSelection: boolean): number {
            if (hasSelection && !d.selected) {
                return ScatterChart.DimmedBubbleOpacity;
            }
            return ScatterChart.DefaultBubbleOpacity;
        }

        public accept(visitor: InteractivityVisitor, options: any): void {
            visitor.visitScatterChart(options);
        }

        public onClearSelection(): void {
            if (this.interactivityService)
                this.interactivityService.clearSelection();
        }

        public getSupportedCategoryAxisType(): string {
            return axisType.scalar;
        }
    }
}
