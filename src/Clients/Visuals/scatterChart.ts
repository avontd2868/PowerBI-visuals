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

module powerbi.visuals {
    export interface ScatterChartConstructorOptions {
        interactivityService: IInteractivityService;
    }

    export interface ScatterChartDataPoint extends SelectableDataPoint, TooltipEnabledDataPoint, LabelEnabledDataPoint {
        x: any;
        y: any;
        size: any;
        radius: RadiusData;
        fill: string;
        category: string;
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
        dataLabelsSettings: PointDataLabelsSettings;
        defaultDataPointColor?: string;
        showAllDataPoints?: boolean;
        hasDynamicSeries?: boolean;
    }

    interface ScatterChartMeasureMetadata {
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
        private static DataLabelsContextClassName = 'dataLabelsContext';

        private static DotClasses: ClassAndSelector = {
            class: 'dot',
            selector: '.dot'
        };

        private svg: D3.Selection;
        private element: JQuery;
        private mainGraphicsContext: D3.Selection;
        private dataLabelsContext: D3.Selection;
        private clearCatcher: D3.Selection;
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

        constructor(options: ScatterChartConstructorOptions) {
            this.interactivityService = options.interactivityService;
        }

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

            element.addClass(ScatterChart.ClassName);
            var svg = this.svg = options.svg;
            this.clearCatcher = this.svg.select(".clearCatcher");

            this.mainGraphicsG = svg.append('g')
                .classed(ScatterChart.MainGraphicsContextClassName, true);

            this.mainGraphicsContext = this.mainGraphicsG.append('svg');
            this.dataLabelsContext = this.mainGraphicsG.append('g')
                .classed(ScatterChart.DataLabelsContextClassName, true);
        }

        public static converter(dataView: DataView, currentViewport: IViewport, colorPalette: IDataColorPalette, interactivityService?: IInteractivityService, categoryAxisProperties?: DataViewObject, valueAxisProperties?: DataViewObject): ScatterChartData {
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

                var defaultDataPointColor = DataViewObjects.getFillColor(objects, columnChartProps.dataPoint.defaultColor);
                var showAllDataPoints = DataViewObjects.getValue<boolean>(objects, columnChartProps.dataPoint.showAllDataPoints);

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
                dataValues,
                scatterMetadata,
                categories,
                categoryValues,
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

            var legendItems = hasDynamicSeries
                ? ScatterChart.createSeriesLegend(dataValues, colorPalette, dataValues, valueFormatter.getFormatString(dvSource, scatterChartProps.general.formatString), defaultDataPointColor)
                : [];

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
                defaultDataPointColor: defaultDataPointColor,
                hasDynamicSeries: hasDynamicSeries,
                showAllDataPoints: showAllDataPoints,
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
            dataValues: DataViewValueColumns,
            metadata: ScatterChartMeasureMetadata,
            categories: DataViewCategoryColumn[],
            categoryValues: any[],
            categoryFormatter: IValueFormatter,
            categoryIdentities: DataViewScopeIdentity[],
            categoryObjects: DataViewObjects[],
            colorPalette: IDataColorPalette,
            viewport: IViewport,
            hasDynamicSeries: boolean,
            labelSettings: PointDataLabelsSettings,
            defaultDataPointColor?: string): ScatterChartDataPoint[] {

            var dataPoints: ScatterChartDataPoint[] = [],
                indicies = metadata.idx,
                formatStringProp = scatterChartProps.general.formatString,
                dataValueSource = dataValues.source,
                grouped = dataValues.grouped();

            var colorHelper = new ColorHelper(colorPalette, scatterChartProps.dataPoint.fill, defaultDataPointColor);

            for (var categoryIdx = 0, ilen = categoryValues.length; categoryIdx < ilen; categoryIdx++) {
                var categoryValue = categoryValues[categoryIdx];

                for (var seriesIdx = 0, len = grouped.length; seriesIdx < len; seriesIdx++) {
                    var grouping = grouped[seriesIdx];
                    var seriesValues = grouping.values;
                    var measureX = ScatterChart.getMeasureValue(indicies.x, seriesValues);
                    var measureY = ScatterChart.getMeasureValue(indicies.y, seriesValues);
                    var measureSize = ScatterChart.getMeasureValue(indicies.size, seriesValues);

                    var xVal = measureX && measureX.values ? measureX.values[categoryIdx] : null;
                    var yVal = measureY && measureY.values ? measureY.values[categoryIdx] : 0;
                    var size = measureSize && measureSize.values ? measureSize.values[categoryIdx] : null;

                    var hasNullValue = (xVal == null) || (yVal == null);

                    if (hasNullValue)
                        continue;

                    var color: string;
                    if (hasDynamicSeries) {
                        color = colorHelper.getColorForSeriesValue(grouping.objects, dataValues.identityFields, grouping.name);
                    }
                    else {
                        // If we have no Size measure then use a blank query name
                        var measureSource = (measureSize != null)
                            ? measureSize.source.queryName
                            : '';

                        color = colorHelper.getColorForMeasure(categoryObjects && categoryObjects[categoryIdx], measureSource);
                    }

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
                        size: size,
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
            dataValues: DataViewValueColumns,
            colorPalette: IDataColorPalette,
            categorical: DataViewValueColumns,
            formatString: string,
            defaultDataPointColor: string
            ): LegendDataPoint[] {

            var grouped = dataValues.grouped();
            var colorHelper = new ColorHelper(colorPalette, scatterChartProps.dataPoint.fill, defaultDataPointColor);

            var legendItems: LegendDataPoint[] = [];
            for (var i = 0, len = grouped.length; i < len; i++) {
                var grouping = grouped[i];
                var color = colorHelper.getColorForSeriesValue(grouping.objects, dataValues.identityFields, grouping.name);
                legendItems.push({
                    color: color,
                    icon: LegendIcon.Circle,
                    label: valueFormatter.format(grouping.name, formatString),
                    identity: grouping.identity ? SelectionId.createWithId(grouping.identity) : SelectionId.createNull(),
                    selected: false
                });
            }

            return legendItems;
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

            return {
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
                defaultDataPointColor: null,
                hasDynamicSeries: false,
            };

            if (dataViews.length > 0) {
                var dataView = dataViews[0];

                if (dataView) {
                    this.categoryAxisProperties = CartesianHelper.getCategoryAxisProperties(dataView.metadata,true);
                    this.valueAxisProperties = CartesianHelper.getValueAxisProperties(dataView.metadata,true);  
                    this.dataView = dataView;

                    if (dataView.categorical && dataView.categorical.values) {
                        this.data = ScatterChart.converter(dataView, this.currentViewport, this.colors, this.interactivityService, this.categoryAxisProperties, this.valueAxisProperties);
                    }

                }
            }
        }

        public calculateLegend(): LegendData {
            return this.data.legendData;
        }

        public hasLegend(): boolean {                      
            return this.data && this.data.hasDynamicSeries;
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] {
            switch (options.objectName) {
                case 'dataPoint':
                    var categoricalDataView: DataViewCategorical = this.dataView && this.dataView.categorical ? this.dataView.categorical : null;
                    if (!GradientUtils.hasGradientRole(categoricalDataView))
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

            if (data.hasDynamicSeries) {
            instances.push({
                objectName: 'dataPoint',
                selector: null,
                properties: {
                        defaultColor: { solid: { color: data.defaultDataPointColor || this.colors.getColor(0).value } }
                },
            });

                var showAllDataPoints = data.showAllDataPoints !== undefined ? data.showAllDataPoints : seriesCount > 1;
                instances.push({
                    objectName: 'dataPoint',
                    selector: null,
                    properties: {
                        showAllDataPoints: showAllDataPoints
                    },
                });

                if (!showAllDataPoints)
                    return instances;
            }   

            if (data.legendData.dataPoints.length === 0) {
                for (var i = 0; i < seriesCount; i++) {
                    var seriesDataPoints = data.dataPoints[i];
                    instances.push({
                        objectName: 'dataPoint',
                        displayName: seriesDataPoints.category,
                        selector: ColorHelper.normalizeSelector(seriesDataPoints.identity.getSelector(), /*isSingleSeries*/ true),
                        properties: {
                            fill: { solid: { color: seriesDataPoints.fill } }
                        },
                    });
                }
            }
            else {
                var legendDataPointLength = data.legendData.dataPoints.length;
                for (var i = 0; i < legendDataPointLength; i++) {
                    var series = data.legendData.dataPoints[i];
                    instances.push({
                        objectName: 'dataPoint',
                        displayName: series.label,
                        selector: ColorHelper.normalizeSelector(series.identity.getSelector()),
                        properties: {
                            fill: { solid: { color: series.color } }
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

            var scatterMarkers = this.drawScatterMarkers(sortedData, hasSelection, data.sizeRange, duration);

            if (this.data.dataLabelsSettings.show) {
                var layout = dataLabelUtils.getScatterChartLabelLayout(xScale, yScale, this.data.dataLabelsSettings, viewport, data.sizeRange);
                dataLabelUtils.drawDefaultLabelsForDataPointChart(dataPoints, this.dataLabelsContext, layout, this.currentViewport);
            }
            else {
                dataLabelUtils.cleanDataLabels(this.dataLabelsContext);
            }

            if (this.interactivityService) {
                var options: ScatterBehaviorOptions = {
                    host: this.cartesianVisualHost,
                    root: this.svg,
                    dataPointsSelection: scatterMarkers,
                    mainContext: this.mainGraphicsContext,
                    data: this.data,
                    visualInitOptions: this.options,
                    xAxisProperties: this.xAxisProperties,
                    yAxisProperties: this.yAxisProperties,
                    background: d3.select(this.element.get(0)),
                    clearCatcher: this.clearCatcher,
                };

                this.interactivityService.apply(this, options);
            }

            TooltipManager.addTooltip(scatterMarkers, (tooltipEvent: TooltipEvent) => tooltipEvent.data.tooltipInfo);

            SVGUtil.flushAllD3TransitionsIfNeeded(this.options);
        }

        private drawScatterMarkers(scatterData: ScatterChartDataPoint[], hasSelection: boolean, sizeRange: NumberRange, duration: number) {
            var xScale = this.xAxisProperties.scale;
            var yScale = this.yAxisProperties.scale;

            var markers = this.mainGraphicsContext.selectAll(ScatterChart.DotClasses.selector).data(scatterData, (d: ScatterChartDataPoint) => d.identity.getKey());

            markers.enter().append(ScatterChart.ScatterChartCircleTagName)
                .classed(ScatterChart.DotClasses.class, true);

            markers
                .style({
                    'stroke-opacity': (d: ScatterChartDataPoint) => ScatterChart.getBubbleOpacity(d, hasSelection),
                    'stroke-width': '1px',
                    'stroke': (d: ScatterChartDataPoint) => d.fill,
                    'fill': (d: ScatterChartDataPoint) => d.fill,
                    'fill-opacity': (d: ScatterChartDataPoint) => d.size != null ? ScatterChart.getBubbleOpacity(d, hasSelection) : 0,
                })
                .transition()
                .duration(duration)
                .attr({
                    r: (d: ScatterChartDataPoint) => ScatterChart.getBubbleRadius(d.radius, sizeRange, this.currentViewport),
                    cx: d => xScale(d.x),
                    cy: d => yScale(d.y),
                });

            markers.exit().remove();

            return markers;
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
