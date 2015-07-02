//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    import EnumExtensions = jsCommon.EnumExtensions;
    import ArrayExtensions = jsCommon.ArrayExtensions;

    export interface ColumnChartConstructorOptions {
        chartType: ColumnChartType;
        animator: IColumnChartAnimator;
        isScrollable: boolean;
        interactivityService: IInteractivityService;
    }

    export interface ColumnChartData {
        categories: any[];
        categoryFormatter: IValueFormatter;
        series: ColumnChartSeries[];
        valuesMetadata: DataViewMetadataColumn[];
        legendData: LegendData;
        hasHighlights: boolean;
        categoryMetadata: DataViewMetadataColumn;
        scalarCategoryAxis: boolean;
        labelSettings: VisualDataLabelsSettings;
        axesLabels: ChartAxesLabels;
        hasDynamicSeries: boolean;
    }

    export interface ColumnChartSeries extends CartesianSeries {
        displayName: string;
        key: string;
        index: number;
        data: ColumnChartDataPoint[];
        identity: SelectionId;
    }

    export interface ColumnChartDataPoint extends CartesianDataPoint, SelectableDataPoint, TooltipEnabledDataPoint, LabelEnabledDataPoint {
        categoryValue: number;
        /** Adjusted for 100% stacked if applicable */
        value: number;
        /** The top (column) or right (bar) of the rectangle, used for positioning stacked rectangles */
        position: number;
        valueAbsolute: number;
        /** Not adjusted for 100% stacked */
        valueOriginal: number;
        seriesIndex: number;
        categoryIndex: number;
        color: string;
        /** The original values from the highlighted rect, used in animations */
        originalValue: number;
        originalPosition: number;
        originalValueAbsolute: number;
        /** True if this data point is a highlighted portion and overflows (whether due to the highlight
          * being greater than original or of a different sign), so it needs to be thinner to accomodate. */
        drawThinner?: boolean;
        key: string;
    }

    var flagBar: number = 1 << 1;
    var flagColumn: number = 1 << 2;
    var flagClustered: number = 1 << 3;
    var flagStacked: number = 1 << 4;
    var flagStacked100: number = flagStacked | (1 << 5);

    export enum ColumnChartType {
        clusteredBar = flagBar | flagClustered,
        clusteredColumn = flagColumn | flagClustered,
        hundredPercentStackedBar = flagBar | flagStacked100,
        hundredPercentStackedColumn = flagColumn | flagStacked100,
        stackedBar = flagBar | flagStacked,
        stackedColumn = flagColumn | flagStacked,
    }

    export interface ColumnAxisOptions {
        xScale: D3.Scale.Scale;
        yScale: D3.Scale.Scale;
        seriesOffsetScale?: D3.Scale.Scale;
        columnWidth: number;
        /** Used by clustered only since categoryWidth !== columnWidth */
        categoryWidth?: number;
        isScalar: boolean;
        margin: IMargin;
    }

    export interface IColumnLayout {
        shapeLayout: {
            width: (d: ColumnChartDataPoint, i) => number;
            x: (d: ColumnChartDataPoint, i) => number;
            y: (d: ColumnChartDataPoint, i) => number;
            height: (d: ColumnChartDataPoint, i) => number;
        };
        shapeLayoutWithoutHighlights: {
            width: (d: ColumnChartDataPoint, i) => number;
            x: (d: ColumnChartDataPoint, i) => number;
            y: (d: ColumnChartDataPoint, i) => number;
            height: (d: ColumnChartDataPoint, i) => number;
        };
        zeroShapeLayout: {
            width: (d: ColumnChartDataPoint, i) => number;
            x: (d: ColumnChartDataPoint, i) => number;
            y: (d: ColumnChartDataPoint, i) => number;
            height: (d: ColumnChartDataPoint, i) => number;
    }
    }

    export interface ColumnChartContext {
        height: number;
        width: number;
        duration: number;
        margin: IMargin;
        mainGraphicsContext: D3.Selection;
        layout: CategoryLayout;
        animator: IColumnChartAnimator;
        onDragStart?: (datum: ColumnChartDataPoint) => void;
        interactivityService: IInteractivityService;
        viewportHeight: number;
        is100Pct: boolean;
    }

    export interface IColumnChartStrategy {
        setData(data: ColumnChartData): void;
        setupVisualProps(columnChartProps: ColumnChartContext): void;
        setXScale(is100Pct: boolean, forcedTickCount?: number, forcedXDomain?: any[]): IAxisProperties;
        setYScale(is100Pct: boolean, forcedTickCount?: number, forcedYDomain?: any[]): IAxisProperties;
        drawColumns(useAnimation: boolean): D3.Selection;
        selectColumn(selectedColumnIndex: number, lastSelectedColumnIndex: number): void;
        getClosestColumnIndex(x: number, y: number): number;
    }

    export interface IColumnChartConverterStrategy {
        getLegend(colors: IDataColorPalette, defaultColor?: string): LegendSeriesInfo;
        getValueBySeriesAndCategory(series: number, category: number): number;
        getMeasureNameByIndex(series: number, category: number): string;
        hasHighlightValues(series: number): boolean;
        getHighlightBySeriesAndCategory(series: number, category: number): number;
    }

    export interface LegendSeriesInfo {
        legend: LegendData;
        seriesSources: DataViewMetadataColumn[];
        seriesObjects: DataViewObjects[][];
    }

    export interface ClassAndSelector {
        class: string;
        selector: string;
    }

    var RoleNames = {
        category: 'Category',
        series: 'Series',
        y: 'Y',
    };

    /** Renders a stacked and clustered column chart */
    export class ColumnChart implements ICartesianVisual, IInteractiveVisual {
        private static ColumnChartClassName = 'columnChart';
        public static SeriesClasses: ClassAndSelector = {
            class: 'series',
            selector: '.series'
        };

        private svg: D3.Selection;
        private mainGraphicsContext: D3.Selection;
        private xAxisProperties: IAxisProperties;
        private yAxisProperties: IAxisProperties;
        private currentViewport: IViewport;
        private data: ColumnChartData;
        private style: IVisualStyle;
        private colors: IDataColorPalette;
        private chartType: ColumnChartType;
        private columnChart: IColumnChartStrategy;
        private hostService: IVisualHostServices;
        private cartesianVisualHost: ICartesianVisualHost;
        private interactivity: InteractivityOptions;
        private margin: IMargin;
        private options: CartesianVisualInitOptions;
        private lastInteractiveSelectedColumnIndex: number;
        private supportsOverflow: boolean;
        private interactivityService: IInteractivityService;
        private dataViewCat: DataViewCategorical;
        private categoryAxisType: string;
        private animator: IColumnChartAnimator;
        private isScrollable: boolean;
        private element: JQuery;
        private defaultDataPointColor: string;

        constructor(options: ColumnChartConstructorOptions) {
            debug.assertValue(options, 'options');

            var chartType = options.chartType;
            debug.assertValue(chartType, 'chartType');
            this.chartType = chartType;
            this.categoryAxisType = null;
            this.animator = options.animator;
            this.isScrollable = options.isScrollable;
            this.interactivityService = options.interactivityService;
        }

        public static customizeQuery(options: CustomizeQueryOptions): void {
            var dataViewMapping = options.dataViewMappings[0];
            if (!dataViewMapping || !dataViewMapping.categorical || !dataViewMapping.categorical.categories)
                return;

            var dataViewCategories = <data.CompiledDataViewRoleForMappingWithReduction>dataViewMapping.categorical.categories;
            var categoryItems = dataViewCategories.for.in.items;
            if (!ArrayExtensions.isUndefinedOrEmpty(categoryItems)) {
                var categoryType = categoryItems[0].type;

                var objects: DataViewObjects;
                if (dataViewMapping.metadata)
                    objects = dataViewMapping.metadata.objects;

                if (CartesianChart.getIsScalar(objects, columnChartProps.categoryAxis.axisType, categoryType))
                    dataViewCategories.dataReductionAlgorithm = { sample: {} };
            }
        }

        public static getSortableRoles(options: VisualSortableOptions): string[] {
            var dataViewMapping = options.dataViewMappings[0];
            if (!dataViewMapping || !dataViewMapping.categorical || !dataViewMapping.categorical.categories)
                return null;

            var dataViewCategories = <data.CompiledDataViewRoleForMappingWithReduction>dataViewMapping.categorical.categories;
            var categoryItems = dataViewCategories.for.in.items;
            if (!ArrayExtensions.isUndefinedOrEmpty(categoryItems)) {
                var categoryType = categoryItems[0].type;

                var objects: DataViewObjects;
                if (dataViewMapping.metadata)
                    objects = dataViewMapping.metadata.objects;

                //TODO: column chart should be sortable by X if it has scalar axis
                // But currenly it doesn't support this. Return 'category' once
                // it is supported.
                if (!CartesianChart.getIsScalar(objects, columnChartProps.categoryAxis.axisType, categoryType)) {
                    return ['Category', 'Y'];
                }
            }

            return null;
        }

        public updateVisualMetadata(x: IAxisProperties, y: IAxisProperties, margin) {
            this.xAxisProperties = x;
            this.yAxisProperties = y;
            this.margin = margin;
        }

        public init(options: CartesianVisualInitOptions) {
            this.svg = options.svg;
            this.mainGraphicsContext = this.svg.append('g').classed('columnChartMainGraphicsContext', true);

            this.style = options.style;
            this.currentViewport = options.viewport;
            this.hostService = options.host;
            this.interactivity = options.interactivity;
            this.colors = this.style.colorPalette.dataColors;
            this.cartesianVisualHost = options.cartesianHost;
            this.options = options;
            this.supportsOverflow = !EnumExtensions.hasFlag(this.chartType, flagStacked);
            var element = this.element = options.element;
            element.addClass(ColumnChart.ColumnChartClassName);

            switch (this.chartType) {
                case ColumnChartType.clusteredBar:
                    this.columnChart = new ClusteredBarChartStrategy();
                    break;
                case ColumnChartType.clusteredColumn:
                    this.columnChart = new ClusteredColumnChartStrategy();
                    break;
                case ColumnChartType.stackedBar:
                case ColumnChartType.hundredPercentStackedBar:
                    this.columnChart = new StackedBarChartStrategy();
                    break;
                case ColumnChartType.stackedColumn:
                case ColumnChartType.hundredPercentStackedColumn:
                default:
                    this.columnChart = new StackedColumnChartStrategy();
                    break;
            }
        }

        private getCategoryLayout(numCategoryValues: number, options: CalculateScaleAndDomainOptions): CategoryLayout {
            var availableWidth: number;
            if (EnumExtensions.hasFlag(this.chartType, flagBar)) {
                availableWidth = this.currentViewport.height - (this.margin.top + this.margin.bottom);
            }
            else {
                availableWidth = this.currentViewport.width - (this.margin.left + this.margin.right);
            }

            var metaDataColumn = this.data ? this.data.categoryMetadata : undefined;
            var categoryDataType: ValueType = AxisHelper.getCategoryValueType(metaDataColumn);
            var isScalar = this.data ? this.data.scalarCategoryAxis : false;
            var domain = AxisHelper.createDomain(this.data.series, categoryDataType, isScalar, options.forcedXDomain);
            return CartesianChart.getLayout(
                this.data,
                {
                    availableWidth: availableWidth,
                    categoryCount: numCategoryValues,
                    domain: domain,
                    isScalar: isScalar,
                    isScrollable: this.isScrollable
                });
        }

        public static converter(dataView: DataViewCategorical, colors: IDataColorPalette, is100PercentStacked: boolean = false, isScalar: boolean = false, supportsOverflow: boolean = false, dataViewMetadata: DataViewMetadata = null, defaultDataPointColor?: string, chartType?: ColumnChartType): ColumnChartData {
            debug.assertValue(dataView, 'dataView');
            debug.assertValue(colors, 'colors');

            var xAxisCardProperties = CartesianHelper.getCategoryAxisProperties(dataViewMetadata);  
            var valueAxisProperties = CartesianHelper.getValueAxisProperties(dataViewMetadata); 
            isScalar = CartesianHelper.isScalar(isScalar, xAxisCardProperties); 
            dataView = ColumnUtil.applyUserMinMax(isScalar, dataView, xAxisCardProperties);

            var converterStrategy = new ColumnChartConverterHelper(dataView);

            var categoryInfo = converterHelper.getPivotedCategories(dataView, columnChartProps.general.formatString);
            var categories = categoryInfo.categories,
                categoryFormatter: IValueFormatter = categoryInfo.categoryFormatter,
                categoryIdentities: DataViewScopeIdentity[] = categoryInfo.categoryIdentities,
                categoryMetadata: DataViewMetadataColumn = dataView.categories && dataView.categories.length > 0 ? dataView.categories[0].source : undefined;

            // Allocate colors
            var legendAndSeriesInfo = converterStrategy.getLegend(colors, defaultDataPointColor);
            var legend: LegendDataPoint[] = legendAndSeriesInfo.legend.dataPoints;
            var seriesSources: DataViewMetadataColumn[] = legendAndSeriesInfo.seriesSources;
            var labelSettings: VisualDataLabelsSettings = dataLabelUtils.getDefaultColumnLabelSettings();

            if (dataViewMetadata && dataViewMetadata.objects) {
                var labelsObj = <DataLabelObject>dataViewMetadata.objects['labels'];
                if (labelsObj) {
                    if (labelsObj.show !== undefined)
                        labelSettings.show = labelsObj.show;
                    if (labelsObj.color !== undefined) {
                        labelSettings.labelColor = labelsObj.color.solid.color;
                        labelSettings.overrideDefaultColor = true;
                    }
                    if (labelsObj.labelDisplayUnits !== undefined) {
                        labelSettings.displayUnits = labelsObj.labelDisplayUnits;
                    }
                    if (labelsObj.labelPrecision !== undefined) {
                        labelSettings.precision = (labelsObj.labelPrecision >= 0) ? labelsObj.labelPrecision : 0;
                    }

                }
                //TODO: retrieve formatter options by filter (not by [1])
                if (dataViewMetadata.columns && dataViewMetadata.columns.length >= 2)
                    labelSettings.formatterOptions = dataViewMetadata.columns[1];
            }

            // Determine data points
            var result = ColumnChart.createDataPoints(
                dataView,
                categories,
                categoryIdentities,
                legend,
                legendAndSeriesInfo.seriesObjects,
                converterStrategy,
                labelSettings,
                is100PercentStacked,
                isScalar,
                supportsOverflow,
                converterHelper.categoryIsAlsoSeriesRole(dataView, RoleNames.series, RoleNames.category),
                categoryInfo.categoryObjects,
                defaultDataPointColor);
            var columnSeries: ColumnChartSeries[] = result.series;

            var valuesMetadata: DataViewMetadataColumn[] = [];
            for (var j = 0, jlen = legend.length; j < jlen; j++) {
                valuesMetadata.push(seriesSources[j]);
            }
  
            var labels = converterHelper.createAxesLabels(xAxisCardProperties, valueAxisProperties, categoryMetadata, valuesMetadata);

            if (!EnumExtensions.hasFlag(chartType, flagColumn)) {
                // Replace between x and y axes
                var temp = labels.xAxisLabel;
                labels.xAxisLabel = labels.yAxisLabel;
                labels.yAxisLabel = temp;
            }

            return {
                categories: categories,
                categoryFormatter: categoryFormatter,
                series: columnSeries,
                valuesMetadata: valuesMetadata,
                legendData: legendAndSeriesInfo.legend,
                hasHighlights: result.hasHighlights,
                categoryMetadata: categoryMetadata,
                scalarCategoryAxis: isScalar,
                labelSettings: labelSettings,
                axesLabels: { x: labels.xAxisLabel, y: labels.yAxisLabel },
                hasDynamicSeries: result.hasDynamicSeries,
            };
        }

        private static createDataPoints(
            dataViewCat: DataViewCategorical,
            categories: any[],
            categoryIdentities: DataViewScopeIdentity[],
            legend: LegendDataPoint[],
            seriesObjectsList: DataViewObjects[][],
            converterStrategy: ColumnChartConverterHelper,
            labelSettings: VisualDataLabelsSettings,
            is100PercentStacked: boolean = false,
            isScalar: boolean = false,
            supportsOverflow: boolean = false,
            isCategoryAlsoSeries?: boolean,
            categoryObjectsList?: DataViewObjects[],
            defaultDataPointColor?: string): { series: ColumnChartSeries[]; hasHighlights: boolean; hasDynamicSeries: boolean; } {

            var grouped = dataViewCat && dataViewCat.values ? dataViewCat.values.grouped() : undefined;
            var categoryCount = categories.length;
            var seriesCount = legend.length;
            var columnSeries: ColumnChartSeries[] = [];

            if (seriesCount < 1 || categoryCount < 1)
                return { series: columnSeries, hasHighlights: false, hasDynamicSeries: false };

            var dvCategories = dataViewCat.categories;
            var categoryMetadata = (dvCategories && dvCategories.length > 0)
                ? dvCategories[0].source
                : null;
            var categoryType = AxisHelper.getCategoryValueType(categoryMetadata);
            var isDateTime = AxisHelper.isDateTime(categoryType);
            var baseValuesPos = [], baseValuesNeg = [];

            var rawValues: number[][] = [];
            var rawHighlightValues: number[][] = [];

            var hasDynamicSeries = !!(dataViewCat.values && dataViewCat.values.source);

            var highlightsOverflow = false; // Overflow means the highlight larger than value or the signs being different
            var hasHighlights = converterStrategy.hasHighlightValues(0);
            for (var seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
                var seriesValues = [];
                var seriesHighlightValues = [];
                for (var categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    var value = converterStrategy.getValueBySeriesAndCategory(seriesIndex, categoryIndex);
                    seriesValues[categoryIndex] = value;
                    if (hasHighlights) {
                        var highlightValue = converterStrategy.getHighlightBySeriesAndCategory(seriesIndex, categoryIndex);
                        seriesHighlightValues[categoryIndex] = highlightValue;
                        // There are two cases where we don't use overflow logic; if all are false, use overflow logic appropriate for the chart.
                        if (!((value >= 0 && highlightValue >= 0 && value >= highlightValue) || // Both positive; value greater than highlight
                            (value <= 0 && highlightValue <= 0 && value <= highlightValue))) { // Both negative; value less than highlight
                            highlightsOverflow = true;
                        }
                    }
                }
                rawValues.push(seriesValues);
                if (hasHighlights) {
                    rawHighlightValues.push(seriesHighlightValues);
                }
            }

            if (highlightsOverflow && !supportsOverflow) {
                highlightsOverflow = false;
                hasHighlights = false;
                rawValues = rawHighlightValues;
            }

            var dataPointObjects: DataViewObjects[] = categoryObjectsList,
                formatStringProp = columnChartProps.general.formatString;
            for (var seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
                var seriesDataPoints: ColumnChartDataPoint[] = [],
                    legendItem = legend[seriesIndex];
                columnSeries.push({
                    displayName: legendItem.label,
                    key: 'series' + seriesIndex,
                    index: seriesIndex,
                    data: seriesDataPoints,
                    identity: legendItem.identity,
                });

                if (seriesCount > 1)
                    dataPointObjects = seriesObjectsList[seriesIndex];

                for (var categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    if (seriesIndex === 0) {
                        baseValuesPos.push(0);
                        baseValuesNeg.push(0);
                    }

                    var value = rawValues[seriesIndex][categoryIndex];
                    if (value == null) {
                        // Optimization: Ignore null dataPoints from the fabricated category/series combination in the self cross-join.
                        // However, we must retain the first series because it is used to compute things like axis scales, and value lookups.
                        if (seriesIndex > 0)
                        continue;
                    }

                    var categoryValue = categories[categoryIndex];
                    if (isDateTime && categoryValue)
                        categoryValue = categoryValue.getTime();
                    if (isScalar && (categoryValue == null))
                        continue;

                    var multipliers: ValueMultiplers;
                    if (is100PercentStacked)
                        multipliers = StackedUtil.getStackedMultiplier(dataViewCat, categoryIndex, seriesCount, categoryCount, converterStrategy);

                    var unadjustedValue = value,
                        isNegative = value < 0;

                    if (multipliers) {
                        if (isNegative)
                            value *= multipliers.neg;
                        else
                            value *= multipliers.pos;
                    }

                    var valueAbsolute = Math.abs(value);
                    var position: number;
                    if (isNegative) {
                        position = baseValuesNeg[categoryIndex];

                        if (!isNaN(valueAbsolute))
                            baseValuesNeg[categoryIndex] -= valueAbsolute;
                    }
                    else {
                        if (!isNaN(valueAbsolute))
                            baseValuesPos[categoryIndex] += valueAbsolute;

                        position = baseValuesPos[categoryIndex];
                    }

                    var identity = SelectionId.createWithIdsAndMeasure(
                        categoryIdentities ? categoryIdentities[categoryIndex] : undefined,
                        hasDynamicSeries ? grouped[seriesIndex].identity : undefined,
                        converterStrategy.getMeasureNameByIndex(seriesIndex));

                    var rawCategoryValue = categories[categoryIndex];
                    var color = ColumnChart.getDataPointColor(legendItem, categoryIndex, dataPointObjects, defaultDataPointColor);
                    var tooltipInfo: TooltipDataItem[] = TooltipBuilder.createTooltipInfo(formatStringProp, dataViewCat.categories, rawCategoryValue, dataViewCat.values, value, null, seriesIndex);

                    var dataPoint: ColumnChartDataPoint = {
                        categoryValue: categoryValue,
                        value: value,
                        position: position,
                        valueAbsolute: valueAbsolute,
                        valueOriginal: unadjustedValue,
                        seriesIndex: seriesIndex,
                        categoryIndex: categoryIndex,
                        color: color,
                        selected: false,
                        originalValue: value,
                        originalPosition: position,
                        originalValueAbsolute: valueAbsolute,
                        identity: identity,
                        key: identity.getKey(),
                        tooltipInfo: tooltipInfo,
                        labelFill: labelSettings.overrideDefaultColor ? labelSettings.labelColor : color,                        
                    };

                    seriesDataPoints.push(dataPoint);

                    if (hasHighlights) {
                        var valueHighlight = rawHighlightValues[seriesIndex][categoryIndex];
                        var unadjustedValueHighlight = valueHighlight;

                        var highlightedTooltip: boolean = true;
                        if (valueHighlight === null) {
                            valueHighlight = 0;
                            highlightedTooltip = false;
                        }

                        if (is100PercentStacked) {
                            valueHighlight *= multipliers.pos;
                        }
                        var absoluteValueHighlight = Math.abs(valueHighlight);
                        var highlightPosition = position;

                        if (valueHighlight > 0) {
                            highlightPosition -= valueAbsolute - absoluteValueHighlight;
                        }
                        else if (valueHighlight === 0 && value > 0) {
                            highlightPosition -= valueAbsolute;
                        }

                        var highlightIdentity = SelectionId.createWithHighlight(identity);
                        var rawCategoryValue = categories[categoryIndex];
                        var highlightedValue: number = highlightedTooltip ? valueHighlight : undefined;
                        var tooltipInfo: TooltipDataItem[] = TooltipBuilder.createTooltipInfo(formatStringProp, dataViewCat.categories, rawCategoryValue, dataViewCat.values, value, null, seriesIndex, highlightedValue);

                        if (highlightedTooltip) {
                            // Override non highlighted data point
                            dataPoint.tooltipInfo = tooltipInfo;
                        }

                        var highlightDataPoint: ColumnChartDataPoint = {
                            categoryValue: categoryValue,
                            value: valueHighlight,
                            position: highlightPosition,
                            valueAbsolute: absoluteValueHighlight,
                            valueOriginal: unadjustedValueHighlight,
                            seriesIndex: seriesIndex,
                            categoryIndex: categoryIndex,
                            color: color,
                            selected: false,
                            highlight: true,
                            originalValue: value,
                            originalPosition: position,
                            originalValueAbsolute: valueAbsolute,
                            drawThinner: highlightsOverflow,
                            identity: highlightIdentity,
                            key: highlightIdentity.getKey(),
                            tooltipInfo: tooltipInfo,
                            labelFill: labelSettings.overrideDefaultColor ? labelSettings.labelColor : color,
                        };

                        seriesDataPoints.push(highlightDataPoint);
                    }
                }
            }

            return {
                series: columnSeries,
                hasHighlights: hasHighlights,
                hasDynamicSeries: hasDynamicSeries,
            };
        }

        private static getDataPointColor(
            legendItem: LegendDataPoint,
            categoryIndex: number,
            dataPointObjects?: DataViewObjects[],
            defaultDataPointColor?: string): string {
            debug.assertValue(legendItem, 'legendItem');
            debug.assertValue(categoryIndex, 'categoryIndex');
            debug.assertAnyValue(dataPointObjects, 'dataPointObjects');

            if (dataPointObjects) {
                var colorOverride = DataViewObjects.getFillColor(dataPointObjects[categoryIndex], columnChartProps.dataPoint.fill);
                if (colorOverride)
                    return colorOverride;
            }

            return legendItem.color;
        }

        public static sliceSeries(series: ColumnChartSeries[], newLength: number): ColumnChartSeries[] {
            var newSeries: ColumnChartSeries[] = [];
            if (series && series.length > 0) {
                debug.assert(series[0].data.length >= newLength, "invalid newLength");
                for (var i = 0, len = series.length; i < len; i++) {
                    var iNewSeries = newSeries[i] = Prototype.inherit(series[i]);
                    // TODO: [investigate] possible perf improvement.
                    // if data[n].categoryIndex > newLength implies data[n+1].categoryIndex > newLength
                    // then we could short circuit the filter loop.
                    iNewSeries.data = series[i].data.filter(d => d.categoryIndex < newLength);
                }
            }
            return newSeries;
        }

        public static getForcedTickValues(min: number, max: number, forcedTickCount: number): number[] {
            debug.assert(min <= max, "min must be less or equal to max");
            debug.assert(forcedTickCount >= 0, "forcedTickCount must be greater or equal to zero");
            if (forcedTickCount <= 1)
                return [];

            var tickValues = [];
            var interval = (max - min) / (forcedTickCount - 1);
            for (var i = 0; i < forcedTickCount - 1; i++) {
                tickValues.push(min + i * interval);
            }
            tickValues.push(max);

            if (tickValues.indexOf(0) === -1)
                tickValues.push(0);

            // It's not needed to sort the array here since when we pass tick value array to D3,
            // D3 does not care whether the elements in the array are in order or not.
            return tickValues;
        }

        public static getTickInterval(tickValues: number[]): number {
            if (tickValues.length === 0)
                return 0;

            if (tickValues.length === 1)
                return tickValues[0];

            tickValues.sort((a, b) => (a - b));
            return tickValues[1] - tickValues[0];
        }

        public setData(dataViews: DataView[]): void {
            debug.assertValue(dataViews, "dataViews");
            this.data = {
                categories: [],
                categoryFormatter: null,
                series: [],
                valuesMetadata: [],
                legendData: null,
                hasHighlights: false,
                categoryMetadata: null,
                scalarCategoryAxis: false,
                labelSettings: null,
                axesLabels: { x: null, y: null },
                hasDynamicSeries: false,
            };

            if (dataViews.length > 0) {
                var dataView = dataViews[0];

                if (dataView && dataView.categorical) {
                    var dataViewCat = this.dataViewCat = dataView.categorical;
                    var dvCategories = dataViewCat.categories;
                    var categoryMetadata = (dvCategories && dvCategories.length > 0)
                        ? dvCategories[0].source
                        : null;
                    var categoryType = AxisHelper.getCategoryValueType(categoryMetadata);

                    if (dataView.metadata) {
                        var objects = dataView.metadata.objects;
                        var defaultColor = DataViewObjects.getFillColor(objects, columnChartProps.dataPoint.defaultColor);
                        if (defaultColor)
                            this.defaultDataPointColor = defaultColor;
                    }

                    this.data = ColumnChart.converter(
                        dataViewCat,
                        this.colors,
                        EnumExtensions.hasFlag(this.chartType, flagStacked100),
                        CartesianChart.getIsScalar(dataView.metadata ? dataView.metadata.objects : null, columnChartProps.categoryAxis.axisType, categoryType),
                        this.supportsOverflow,
                        dataView.metadata,
                        this.defaultDataPointColor,
                        this.chartType);

                    var series = this.data.series;
                    for (var i = 0, ilen = series.length; i < ilen; i++) {
                        var currentSeries = series[i];
                        if (this.interactivityService)
                            this.interactivityService.applySelectionStateToData(currentSeries.data);
                    }
                }
            }
        }

        public calculateLegend(): LegendData {
            // if we're in interactive mode, return the interactive legend 
            if (this.interactivity && this.interactivity.isInteractiveLegend) {
                return this.createInteractiveLegendDataPoints(0);
            }
            var legendData = this.data ? this.data.legendData : null;
            var legendDataPoints = legendData ? legendData.dataPoints : [];

            if (ArrayExtensions.isUndefinedOrEmpty(legendDataPoints))
                return null;

            return legendData;
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] {
            switch (options.objectName) {
                case 'dataPoint':
                    var hasGradientRole = GradientUtils.hasGradientRole(this.dataViewCat);
                    if (!hasGradientRole) {
                        return this.enumerateDataPoints();
                    }
                    break;
                case 'labels':
                    if (EnumExtensions.hasFlag(this.chartType, flagStacked100))
                    return dataLabelUtils.enumerateDataLabels(this.data.labelSettings, false);
                    return dataLabelUtils.enumerateDataLabels(this.data.labelSettings, false, true, true);
            }
            return null;
        }

        private enumerateDataPoints(): VisualObjectInstance[] {
            var data = this.data;
            if (!data)
                return;

            var instances: VisualObjectInstance[] = [],
                seriesCount = data.series.length;

            if (seriesCount === 0)
                return instances;

            instances.push({
                objectName: 'dataPoint',
                selector: null,
                properties: {
                    defaultColor: { solid: { color: this.defaultDataPointColor || this.colors.getColor(0).value } } 
                },
            });

            if (data.hasDynamicSeries || seriesCount > 1) {
                for (var i = 0; i < seriesCount; i++) {
                    var series = data.series[i];
                    instances.push({
                        objectName: 'dataPoint',
                        displayName: series.displayName,
                        selector: ColorHelper.normalizeSelector(series.identity.getSelector()),
                        properties: {
                            fill: { solid: { color: series.data[0].color } }
                        },
                    });
                }
            }
            else {
                var singleSeriesData = data.series[0].data;
                for (var i = 0; i < singleSeriesData.length; i++) {
                    var singleSeriesDataPoints = singleSeriesData[i];
                    instances.push({
                        objectName: 'dataPoint',
                        displayName: data.categories[i],
                        selector: ColorHelper.normalizeSelector(singleSeriesDataPoints.identity.getSelector(), /*isSingleSeries*/true),
                        properties: {
                            fill: { solid: { color: singleSeriesDataPoints.color } }
                        },
                    });
                }
            }

            return instances;
        }

        public calculateAxesProperties(options: CalculateScaleAndDomainOptions): IAxisProperties[] {
            var data = this.data;
            this.currentViewport = options.viewport;
            var margin = this.margin = options.margin;

            var origCatgSize = (data && data.categories) ? data.categories.length : 0;
            var chartLayout: CategoryLayout = data ? this.getCategoryLayout(origCatgSize, options) : {
                categoryCount: 0,
                categoryThickness: CartesianChart.MinOrdinalRectThickness,
                outerPaddingRatio: CartesianChart.OuterPaddingRatio,
                isScalar: false
            };
            this.categoryAxisType = chartLayout.isScalar ? axisType.scalar : null;

            if (data && !chartLayout.isScalar && !this.isScrollable) {
                // trim data that doesn't fit on dashboard
                var catgSize = Math.min(origCatgSize, chartLayout.categoryCount);
                if (catgSize !== origCatgSize) {
                    data = Prototype.inherit(data);
                    data.series = ColumnChart.sliceSeries(data.series, data.hasHighlights ? catgSize * 2 : catgSize);
                    data.categories = data.categories.slice(0, catgSize);
                }
            }
            this.columnChart.setData(data);

            var preferredPlotArea = this.getPreferredPlotArea(chartLayout.isScalar, chartLayout.categoryCount, chartLayout.categoryThickness);

            /* preferredPlotArea would be same as currentViewport width when there is no scrollbar. 
             In that case we want to calculate the available plot area for the shapes by subtracting the margin from available viewport */
            if (preferredPlotArea.width === this.currentViewport.width) {
                preferredPlotArea.width -= (margin.left + margin.right);
            }
            preferredPlotArea.height -= (margin.top + margin.bottom);

            var is100Pct = EnumExtensions.hasFlag(this.chartType, flagStacked100); 

            // When the category axis is scrollable the height of the category axis and value axis will be different
            // The height of the value axis would be same as viewportHeight 
            var chartContext: ColumnChartContext = {
                height: preferredPlotArea.height,
                width: preferredPlotArea.width,
                duration: 0,
                hostService: this.hostService,
                mainGraphicsContext: this.mainGraphicsContext,
                margin: this.margin,
                layout: chartLayout,
                animator: this.animator,
                interactivityService: this.interactivityService,
                viewportHeight: this.currentViewport.height - (margin.top + margin.bottom),
                is100Pct: is100Pct,
            };
            this.ApplyInteractivity(chartContext);
            this.columnChart.setupVisualProps(chartContext);

            if (EnumExtensions.hasFlag(this.chartType, flagBar)) {
                var temp = options.forcedXDomain; 
                options.forcedXDomain = options.forcedYDomain;
                options.forcedYDomain = temp;                
            }

            this.xAxisProperties = this.columnChart.setXScale(is100Pct, options.forcedTickCount, options.forcedXDomain);
            this.yAxisProperties = this.columnChart.setYScale(is100Pct, options.forcedTickCount, options.forcedYDomain);
            this.xAxisProperties.axisLabel = data.axesLabels.x;
            this.yAxisProperties.axisLabel = data.axesLabels.y;

            return [this.xAxisProperties, this.yAxisProperties];
        }

        public getPreferredPlotArea(isScalar: boolean, categoryCount: number, categoryThickness: number): IViewport {
            var viewport: IViewport = {
                height: this.currentViewport.height,
                width: this.currentViewport.width
            };

            if (this.isScrollable && !isScalar) {
                var preferredWidth = CartesianChart.getPreferredCategorySpan(categoryCount, categoryThickness);
                if (EnumExtensions.hasFlag(this.chartType, flagBar)) {
                    viewport.height = Math.max(preferredWidth, viewport.height);
                }
                else
                    viewport.width = Math.max(preferredWidth, viewport.width);
            }
            return viewport;
        }

        private ApplyInteractivity(chartContext: ColumnChartContext): void {
            var interactivity = this.interactivity;
            if (interactivity) {
                if (interactivity.dragDataPoint) {
                    chartContext.onDragStart = (datum: ColumnChartDataPoint) => {
                        if (!datum.identity)
                            return;

                        this.hostService.onDragStart({
                            event: <any>d3.event,
                            data: {
                                data: datum.identity.getSelector()
                            }
                        });
                    };
                }

                if (interactivity.isInteractiveLegend) {
                    var dragMove = () => {
                        var mousePoint = d3.mouse(this.mainGraphicsContext[0][0]); // get the x and y for the column area itself
                        var x: number = mousePoint[0];
                        var y: number = mousePoint[1];
                        var index: number = this.columnChart.getClosestColumnIndex(x, y);
                        this.selectColumn(index);
                    };

                    //set click interaction on the visual
                    this.svg.on('click', dragMove);
                    //set click interaction on the background
                    d3.select(this.element.get(0)).on('click', dragMove);
                    var drag = d3.behavior.drag()
                        .origin(Object)
                        .on("drag", dragMove);
                    //set drag interaction on the visual
                    this.svg.call(drag);
                    //set drag interaction on the background
                    d3.select(this.element.get(0)).call(drag);
                }
            }
        }

        private selectColumn(indexOfColumnSelected: number, force: boolean = false): void {
            if (!force && this.lastInteractiveSelectedColumnIndex === indexOfColumnSelected) return; // same column, nothing to do here

            var legendData: LegendData = this.createInteractiveLegendDataPoints(indexOfColumnSelected);
            var legendDataPoints: LegendDataPoint[] = legendData.dataPoints;
            this.cartesianVisualHost.updateLegend(legendData);
            if (legendDataPoints.length > 0) {
                this.columnChart.selectColumn(indexOfColumnSelected, this.lastInteractiveSelectedColumnIndex);
            }
            this.lastInteractiveSelectedColumnIndex = indexOfColumnSelected;
        }

        private createInteractiveLegendDataPoints(columnIndex: number): LegendData {
            var data = this.data;
            if (!data || ArrayExtensions.isUndefinedOrEmpty(data.series))
                return { dataPoints: [] };

            var formatStringProp = columnChartProps.general.formatString;
            var legendDataPoints: LegendDataPoint[] = [];
            var category = data.categories && data.categories[columnIndex];
            var allSeries = data.series;

            for (var i = 0, len = allSeries.length; i < len; i++) {
                var dataPoint = data.series[i].data[columnIndex];
                var measure = dataPoint && dataPoint.valueOriginal;
                var valueMetadata = data.valuesMetadata[i];
                var formattedLabel = converterHelper.getFormattedLegendLabel(valueMetadata, this.dataViewCat.values, formatStringProp);

                legendDataPoints.push({
                    color: dataPoint.color,
                    icon: LegendIcon.Box,
                    label: formattedLabel,
                    category: data.categoryFormatter ? data.categoryFormatter.format(category) : category,
                    measure: valueFormatter.format(measure, valueFormatter.getFormatString(valueMetadata, formatStringProp)),
                    identity: SelectionId.createNull(),
                    selected: false
                });
            }

            return { dataPoints: legendDataPoints };
        }

        public overrideXScale(xProperties: IAxisProperties): void {
            this.xAxisProperties = xProperties;
        }

        public render(duration: number): void {
            var selection = this.columnChart.drawColumns(!!duration);
            var data = this.data;

            TooltipManager.addTooltip(selection, (d, i) => d.tooltipInfo);

            if (this.interactivityService) {
                var allDataPoints: ColumnChartDataPoint[] = [];
                for (var i = 0, ilen = data.series.length; i < ilen; i++) {
                    allDataPoints = allDataPoints.concat(data.series[i].data);
                }
                var behaviorOptions: ColumnBehaviorOptions = {
                    bars: selection,
                    datapoints: allDataPoints,
                    background: d3.select(this.element.get(0)),
                    hasHighlights: data.hasHighlights,
                };

                this.interactivityService.apply(this, behaviorOptions);
            }

            if (this.interactivity && this.interactivity.isInteractiveLegend) {
                if (this.data.series.length > 0) {
                    this.selectColumn(0, true); // start with the first column
                }
            }
            SVGUtil.flushAllD3TransitionsIfNeeded(this.options);
        }

        public onClearSelection(): void {
            if (this.interactivityService) {
                this.interactivityService.clearSelection();
            }
        }

        public accept(visitor: InteractivityVisitor, options: any): void {
            visitor.visitColumnChart(options);
        }

        public getVisualCategoryAxisIsScalar(): boolean {
            return this.data ? this.data.scalarCategoryAxis : false;
        } 
        
        public getSupportedCategoryAxisType(): string {
            var metaDataColumn = this.data ? this.data.categoryMetadata : undefined;
            var valueType = AxisHelper.getCategoryValueType(metaDataColumn);
            var isOrdinal = AxisHelper.isOrdinal(valueType);    
            return isOrdinal ? axisType.categorical : axisType.both;        
        }  
    }

    class ColumnChartConverterHelper implements IColumnChartConverterStrategy {
        private dataView: DataViewCategorical;

        constructor(dataView: DataViewCategorical) {
            this.dataView = dataView;
        }

        public getLegend(colors: IDataColorPalette, defaultColor?: string): LegendSeriesInfo {
            var legend: LegendDataPoint[] = [];
            var seriesSources: DataViewMetadataColumn[] = [];
            var seriesObjects: DataViewObjects[][] = [];
            var grouped: boolean = false;

            var colorHelper = new ColorHelper(colors, columnChartProps.dataPoint.fill, defaultColor);

            if (this.dataView && this.dataView.values) {
                var allValues = this.dataView.values;
                var valueGroups = allValues.grouped();

                var hasDynamicSeries = !!(allValues && allValues.source);

                var formatStringProp = columnChartProps.general.formatString;
                for (var valueGroupsIndex = 0, valueGroupsLen = valueGroups.length; valueGroupsIndex < valueGroupsLen; valueGroupsIndex++) {
                    var valueGroup = valueGroups[valueGroupsIndex],
                        valueGroupObjects = valueGroup.objects,
                        values = valueGroup.values;

                    for (var valueIndex = 0, valuesLen = values.length; valueIndex < valuesLen; valueIndex++) {
                        var series = values[valueIndex];
                        var source = series.source;
                        // Gradient measures do not create series.
                        if (DataRoleHelper.hasRole(source, 'Gradient') && !DataRoleHelper.hasRole(source, 'Y'))
                            continue;

                        seriesSources.push(source);
                        seriesObjects.push(series.objects);

                        var selectionId = series.identity ?
                            SelectionId.createWithIdAndMeasure(series.identity, source.queryName) :
                            SelectionId.createWithMeasure(this.getMeasureNameByIndex(valueIndex));

                        var label = converterHelper.getFormattedLegendLabel(source, allValues, formatStringProp);

                        var color = hasDynamicSeries
                            ? colorHelper.getColorForSeriesValue(valueGroupObjects || source.objects, allValues.identityFields, source.groupName)
                            : colorHelper.getColorForMeasure(valueGroupObjects || source.objects, source.queryName);

                        legend.push({
                            icon: LegendIcon.Box,
                            color: color,
                            label: label,
                            identity: selectionId,
                            selected: false,
                        });                        

                        if (series.identity && source.groupName !== undefined) {
                            grouped = true;
                        }
                    }
                }

                var dvValues = this.dataView.values;
                var legendTitle = dvValues && dvValues.source ? dvValues.source.displayName : "";
            }

            var legendData = {
                title: legendTitle,
                dataPoints: legend,
                grouped: grouped,
            };

            return {
                legend: legendData,
                seriesSources: seriesSources,
                seriesObjects: seriesObjects,
            };
        }

        public getValueBySeriesAndCategory(series: number, category: number): number {
            return this.dataView.values[series].values[category];
        }

        public getMeasureNameByIndex(index: number): string {
            return this.dataView.values[index].source.queryName;
        }

        public hasHighlightValues(series: number): boolean {
            var column = this.dataView && this.dataView.values ? this.dataView.values[series] : undefined;
            return column && !!column.highlights;
        }

        public getHighlightBySeriesAndCategory(series: number, category: number): number {
            return this.dataView.values[series].highlights[category];
        }
    }
}