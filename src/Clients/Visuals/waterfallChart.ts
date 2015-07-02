//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {

    export interface WaterfallChartData {
        categories: any[];
        dataPoints: WaterfallChartDataPoint[];
        valuesMetadata: DataViewMetadataColumn;
        legend: LegendData;
        hasHighlights: boolean;
        categoryMetadata: DataViewMetadataColumn;
        positionMax: number;
        positionMin: number;
        sentimentColors: WaterfallChartSentimentColors;
        dataLabelsSettings: VisualDataLabelsSettings;
        axesLabels: ChartAxesLabels;
    }

    export interface WaterfallChartDataPoint extends CartesianDataPoint, SelectableDataPoint, TooltipEnabledDataPoint, LabelEnabledDataPoint {
        position: number;
        color: string;
        highlight: boolean;
        key: string;
    }

    export interface WaterfallChartConstructorOptions {
        isScrollable: boolean;
    }

    export interface WaterfallChartSentimentColors {
        increaseFill: Fill;
        decreaseFill: Fill;
        totalFill: Fill;
    }

    export interface WaterfallLayout extends CategoryLayout, ILabelLayout {
        categoryWidth: number
    }

    export class WaterfallChart implements ICartesianVisual, IInteractiveVisual {
        public static formatStringProp: DataViewObjectPropertyIdentifier = { objectName: 'general', propertyName: 'formatString' };
        private static WaterfallClassName = 'waterfallChart';
        private static MainGraphicsContextClassName = 'mainGraphicsContext';
        private static IncreaseLabel = "Waterfall_IncreaseLabel";
        private static DecreaseLabel = "Waterfall_DecreaseLabel";
        private static TotalLabel = "Waterfall_TotalLabel";
        private static CategoryValueClasses: ClassAndSelector = {
            class: 'column',
            selector: '.column'
        }
        private static WaterfallConnectorClasses: ClassAndSelector = {
            class: 'waterfall-connector',
            selector: '.waterfall-connector'
        }

        private static defaultTotalColor = "#00b8aa";

        private svg: D3.Selection;
        private mainGraphicsContext: D3.Selection;
        private xAxisProperties: IAxisProperties;
        private yAxisProperties: IAxisProperties;
        private currentViewport: IViewport;
        private data: WaterfallChartData;
        private element: JQuery;
        private isScrollable: boolean;

        // If we overflowed horizontally then this holds the subset of data we should render.
        private clippedData: WaterfallChartData;

        private style: IVisualStyle;
        private colors: IDataColorPalette;
        private hostServices: IVisualHostServices;
        private cartesianVisualHost: ICartesianVisualHost;
        private interactivity: InteractivityOptions;
        private margin: IMargin;
        private options: CartesianVisualInitOptions;
        private interactivityService: IInteractivityService;
        private layout: WaterfallLayout;

        // TODO: There is an issue with showing the "total" column with dates. The logic to calculate
        // the way the axis should be shown is confused by the mix of dates and non-dates.
        private static showTotal = true;

        constructor(options: WaterfallChartConstructorOptions) {
            this.isScrollable = options.isScrollable;
        }

        public init(options: CartesianVisualInitOptions): void {
            debug.assertValue(options, 'options');

            this.svg = options.svg;
            this.style = options.style;
            this.currentViewport = options.viewport;
            this.hostServices = options.host;
            this.interactivityService = VisualInteractivityFactory.buildInteractivityService(options);
            this.interactivity = options.interactivity;
            this.cartesianVisualHost = options.cartesianHost;
            this.options = options;
            this.element = options.element;
            this.colors = this.style.colorPalette.dataColors;
            this.element.addClass(WaterfallChart.WaterfallClassName);
            this.mainGraphicsContext = this.svg
                .append('g')
                .classed(WaterfallChart.MainGraphicsContextClassName, true);
        }

        public static converter(dataView: DataViewCategorical, palette: IDataColorPalette, hostServices: IVisualHostServices, dataLabelSettings: VisualDataLabelsSettings, sentimentColors: WaterfallChartSentimentColors, interactivityService: IInteractivityService, dataViewMetadata: DataViewMetadata): WaterfallChartData {
            debug.assertValue(palette, 'palette');

            var formatStringProp = WaterfallChart.formatStringProp;
            var categoryInfo = converterHelper.getPivotedCategories(dataView, formatStringProp);
            var categories = categoryInfo.categories,
                categoryIdentities: DataViewScopeIdentity[] = categoryInfo.categoryIdentities,
                categoryMetadata: DataViewMetadataColumn = dataView.categories && dataView.categories.length > 0 ? dataView.categories[0].source : undefined;
            
            var increaseColor = sentimentColors.increaseFill.solid.color;
            var decreaseColor = sentimentColors.decreaseFill.solid.color;
            var totalColor = sentimentColors.totalFill.solid.color;

            var legend: LegendDataPoint[] = [
                {
                    label: hostServices.getLocalizedString(WaterfallChart.IncreaseLabel),
                    color: increaseColor,
                    icon: LegendIcon.Box,
                    identity: !_.isEmpty(categoryIdentities) ? SelectionId.createWithId(categoryIdentities[0]) : SelectionId.createNull(),
                    selected: false
                },
                {
                    label: hostServices.getLocalizedString(WaterfallChart.DecreaseLabel),
                    color: decreaseColor,
                    icon: LegendIcon.Box,
                    identity: !_.isEmpty(categoryIdentities) ? SelectionId.createWithId(categoryIdentities[0]) : SelectionId.createNull(),
                    selected: false
                }];

            /**
             * The position represents the starting point for each bar, for any value it is the sum of all previous values.
             * Values > 0 are considered gains, values < 0 are losses.
             */
            var pos = 0, posMin = 0, posMax = 0;
            var dataPoints: WaterfallChartDataPoint[] = [];
            var valuesMetadata: DataViewMetadataColumn = null;

            // We only support a single series.
            if (dataView.values && dataView.values.length > 0) {
                var column = dataView.values[0];
                valuesMetadata = column.source;

                for (var categoryIndex = 0, catLen = column.values.length; categoryIndex < catLen; categoryIndex++) {
                    var category = categories[categoryIndex];
                    var value = column.values[categoryIndex];
                    var identity = categoryIdentities ? SelectionId.createWithId(categoryIdentities[categoryIndex], /* highlight */ false) : SelectionId.createNull();
                    var tooltipInfo: TooltipDataItem[] = TooltipBuilder.createTooltipInfo(formatStringProp, dataView.categories, category, dataView.values, value);
                    var color = value > 0 ? increaseColor : decreaseColor;

                    // TODO: convert dates to text?

                    // TODO: support partial highlights
                    dataPoints.push({
                        value: value,
                        position: pos,
                        color: color,
                        categoryValue: category,
                        categoryIndex: categoryIndex,
                        seriesIndex: 0,
                        selected: false,
                        identity: identity,
                        highlight: false,
                        key: identity.getKey(),
                        tooltipInfo: tooltipInfo,
                        labelFill: dataLabelSettings.overrideDefaultColor ? dataLabelSettings.labelColor : color,
                    });

                    pos += value;
                    if (pos > posMax)
                        posMax = pos;
                    if (pos < posMin)
                        posMin = pos;
                }
            }

            if (WaterfallChart.showTotal) {
                var identity = SelectionId.createNull();
                var categoryValue: string = hostServices.getLocalizedString(WaterfallChart.TotalLabel);
                var tooltipInfo: TooltipDataItem[] = TooltipBuilder.createTooltipInfo(formatStringProp, dataView.categories, categoryValue, dataView.values, pos);

                dataPoints.push({
                    value: pos,
                    position: 0,
                    color: totalColor,
                    categoryValue: categoryValue,
                    categoryIndex: categoryIndex,
                    identity: identity,
                    seriesIndex: 0,
                    selected: false,
                    highlight: false,
                    key: identity.getKey(),
                    tooltipInfo: tooltipInfo,
                    labelFill: dataLabelSettings.overrideDefaultColor ? dataLabelSettings.labelColor : sentimentColors.totalFill.solid.color,
                });

                legend.push({
                    label: categoryValue,
                    color: totalColor,
                    icon: LegendIcon.Box,
                    identity: identity,
                    selected: false
                });
            }

            if (interactivityService)
                interactivityService.applySelectionStateToData(dataPoints);

            var xAxisProperties = CartesianHelper.getCategoryAxisProperties(dataViewMetadata);
            var yAxisProperties = CartesianHelper.getValueAxisProperties(dataViewMetadata);
            var valuesMetadataArray: powerbi.DataViewMetadataColumn[] = [];
            valuesMetadataArray.push(valuesMetadata);
            var axesLabels = converterHelper.createAxesLabels(xAxisProperties, yAxisProperties, categoryMetadata, valuesMetadataArray);

            return {
                categories: categories,
                categoryMetadata: categoryMetadata,
                dataPoints: dataPoints,
                valuesMetadata: valuesMetadata,
                legend: { dataPoints: legend },
                hasHighlights: false,
                positionMin: posMin,
                positionMax: posMax,
                dataLabelsSettings: dataLabelSettings,
                sentimentColors: sentimentColors,
                axesLabels: { x: axesLabels.xAxisLabel, y: axesLabels.yAxisLabel },
            };
        }

        public setData(dataViews: DataView[]): void {
            debug.assertValue(dataViews, "dataViews");

            var sentimentColors = this.getSentimentColorsFromObjects(null);

            this.data = <WaterfallChartData> {
                categories: [],
                dataPoints: [],
                valuesMetadata: null,
                legend: { dataPoints: [] },
                hasHighlights: false,
                categoryMetadata: null,
                scalarCategoryAxis: false,
                positionMax: 0,
                positionMin: 0,
                dataLabelsSettings: dataLabelUtils.getDefaultLabelSettings(),
                sentimentColors: sentimentColors,
                axesLabels: {x: null, y: null},
            };

            if (dataViews.length > 0) {
                var dataView = dataViews[0];
                if (dataView) {
                    if (dataView.metadata && dataView.metadata.objects) {
                        var objects = dataView.metadata.objects;

                        var labelsObj = <DataLabelObject>objects['labels'];
                        if (labelsObj) {
                            if (labelsObj.show !== undefined)
                                this.data.dataLabelsSettings.show = labelsObj.show;
                            if (labelsObj.color !== undefined) {
                                this.data.dataLabelsSettings.labelColor = labelsObj.color.solid.color;
                                this.data.dataLabelsSettings.overrideDefaultColor = true;
                            }
                            if (labelsObj.labelDisplayUnits !== undefined) {
                                this.data.dataLabelsSettings.displayUnits = labelsObj.labelDisplayUnits;
                            }
                            if (labelsObj.labelPrecision !== undefined) {
                                this.data.dataLabelsSettings.precision = (labelsObj.labelPrecision >= 0) ? labelsObj.labelPrecision : 0;
                            }
                        }
                        //TODO: retrieve formatter options by filter (not by [1]) 
                        if (dataView.metadata.columns && dataView.metadata.columns.length >= 2)
                            this.data.dataLabelsSettings.formatterOptions = dataView.metadata.columns[1];

                        sentimentColors = this.getSentimentColorsFromObjects(objects);
                    }

                    if (dataView.categorical) {
                        this.data = WaterfallChart.converter(dataView.categorical, this.colors, this.hostServices, this.data.dataLabelsSettings, sentimentColors, this.interactivityService, dataView.metadata);
                    }
                }
            }
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] {
            switch (options.objectName) {
                case 'sentimentColors':
                    return this.enumerateSentimentColors();
                case 'labels':
                    return dataLabelUtils.enumerateDataLabels(this.data.dataLabelsSettings, false, true, true);
            }
        }

        private enumerateSentimentColors(): VisualObjectInstance[] {
            var instances: VisualObjectInstance[] = [];

            var sentimentColors = this.data.sentimentColors;

            instances.push({
                selector: null,
                properties: {
                    increaseFill: sentimentColors.increaseFill,
                    decreaseFill: sentimentColors.decreaseFill,
                    totalFill: sentimentColors.totalFill
                },
                objectName: 'sentimentColors'
            });

            return instances;
        }

        public calculateLegend(): LegendData {
            // TODO: support interactive legend
            return this.data.legend;
        }

        private static createClippedDataIfOverflowed(data: WaterfallChartData, renderableDataCount: number): WaterfallChartData {
            var clipped: WaterfallChartData = data;

            if (data && renderableDataCount < data.dataPoints.length) {
                clipped = Prototype.inherit(data);
                clipped.dataPoints = data.dataPoints.slice(0, renderableDataCount);
                clipped.categories = data.categories.slice(0, renderableDataCount);
            }

            return clipped;
        }

        public calculateAxesProperties(options: CalculateScaleAndDomainOptions): IAxisProperties[] {
            debug.assertValue(options, 'options');

            this.currentViewport = options.viewport;
            var margin = this.margin = options.margin;
            var data = this.clippedData = this.data;

            var categoryCount = WaterfallChart.showTotal
                ? data.categories.length + 1  // +1 for the total
                : data.categories.length;

            /* preferredPlotArea would be same as currentViewport width when there is no scrollbar. 
             In that case we want to calculate the available plot area for the shapes by subtracting the margin from available viewport */
            var preferredPlotArea = this.getPreferredPlotArea(false, categoryCount, CartesianChart.MinOrdinalRectThickness);
            if (preferredPlotArea.width === this.currentViewport.width) {
                preferredPlotArea.width -= (margin.left + margin.right);
            }
            preferredPlotArea.height -= (margin.top + margin.bottom);

            var cartesianLayout = CartesianChart.getLayout(
                null,
                {
                    availableWidth: preferredPlotArea.width,
                    categoryCount: categoryCount,
                    domain: null,
                    isScalar: false,
                    isScrollable: this.isScrollable
                });

            // In the case that we have overflowed horizontally we want to clip the data and use that to calculate the axes on the dashboard.           
            if (!this.isScrollable) {
                data = this.clippedData = WaterfallChart.createClippedDataIfOverflowed(data, cartesianLayout.categoryCount);
            }

            var xAxisCreationOptions = WaterfallChart.getXAxisCreationOptions(data, preferredPlotArea.width, cartesianLayout, options);
            var yAxisCreationOptions = WaterfallChart.getYAxisCreationOptions(data, preferredPlotArea.height, options);

            var xAxisProperties = this.xAxisProperties = AxisHelper.createAxis(xAxisCreationOptions);
            var yAxisProperties = this.yAxisProperties = AxisHelper.createAxis(yAxisCreationOptions);

            var categoryWidth = this.xAxisProperties.categoryThickness * (1 - CartesianChart.InnerPaddingRatio);

            var formatter = valueFormatter.create(dataLabelUtils.getLabelFormatterOptions(this.data.dataLabelsSettings));

            this.layout = {
                categoryCount: cartesianLayout.categoryCount,
                categoryThickness: cartesianLayout.categoryThickness,
                isScalar: cartesianLayout.isScalar,
                outerPaddingRatio: cartesianLayout.outerPaddingRatio,
                categoryWidth: categoryWidth,
                labelText: (d: WaterfallChartDataPoint) => {
                    return dataLabelUtils.getLabelFormattedText(formatter.format(d.value));
                },
                labelLayout: {
                    y: (d, i) => { return WaterfallChart.getRectTop(yAxisProperties.scale, d.position, d.value) - dataLabelUtils.labelMargin; },
                    x: (d, i) => { return xAxisProperties.scale(d.categoryIndex) + (categoryWidth / 2); },
                },
                filter: (d: WaterfallChartDataPoint) => { return (d != null); },
                style: {
                    'fill': (d: WaterfallChartDataPoint) => d.labelFill
                },
            };

            this.xAxisProperties.axisLabel = data.axesLabels.x;
            this.yAxisProperties.axisLabel = data.axesLabels.y;

            return [xAxisProperties, yAxisProperties];
        }

        private static lookupXValue(data: WaterfallChartData, index: number, type: ValueType): any {
            var point = data.dataPoints[index];

            if (point && point.categoryValue) {
                if (this.showTotal && index === data.dataPoints.length - 1)
                    return point.categoryValue;
                else if (AxisHelper.isDateTime(type))
                    return new Date(point.categoryValue);
                else
                    return point.categoryValue;
            }

            return index;
        }

        public static getXAxisCreationOptions(data: WaterfallChartData, width: number, layout: CategoryLayout, options: CalculateScaleAndDomainOptions): CreateAxisOptions {
            debug.assertValue(data, 'data');
            debug.assertValue(options, 'options');

            var categoryDataType: ValueType = AxisHelper.getCategoryValueType(data.categoryMetadata);

            var series: CartesianSeries[] = [
                { data: data.dataPoints }
            ];
            var domain = AxisHelper.createDomain(series, categoryDataType, /* isScalar */ false, options.forcedXDomain);

            var categoryThickness = layout.categoryThickness;
            var outerPadding = categoryThickness * layout.outerPaddingRatio;

            return <CreateAxisOptions> {
                pixelSpan: width,
                dataDomain: domain,
                metaDataColumn: data.categoryMetadata,
                formatStringProp: WaterfallChart.formatStringProp,
                isScalar: false,
                outerPadding: outerPadding,
                categoryThickness: categoryThickness,
                getValueFn: (index, type) => WaterfallChart.lookupXValue(data, index, type),
                forcedTickCount: options.forcedTickCount,
                isCategoryAxis: true
            };
        }

        public static getYAxisCreationOptions(data: WaterfallChartData, height: number, options: CalculateScaleAndDomainOptions): CreateAxisOptions {
            debug.assertValue(data, 'data');
            debug.assertValue(options, 'options');

            var combinedDomain = AxisHelper.combineDomain(options.forcedYDomain, [data.positionMin, data.positionMax]);

            return <CreateAxisOptions> {
                pixelSpan: height,
                dataDomain: combinedDomain,
                isScalar: true,
                isVertical: true,
                metaDataColumn: data.valuesMetadata,
                formatStringProp: WaterfallChart.formatStringProp,
                outerPadding: 0,
                forcedTickCount: options.forcedTickCount,
                useTickIntervalForDisplayUnits: true,
                isCategoryAxis: false
            };
        }

        public getPreferredPlotArea(isScalar: boolean, categoryCount: number, categoryThickness: number): IViewport {
            return CartesianChart.getPreferredPlotArea(
                categoryCount,
                categoryThickness,
                this.currentViewport,
                this.isScrollable,
                isScalar);
        }

        public getVisualCategoryAxisIsScalar(): boolean {
            return false;
        }

        public overrideXScale(xProperties: IAxisProperties): void {
            this.xAxisProperties = xProperties;
        }

        private createRects(data: WaterfallChartDataPoint[]): D3.UpdateSelection {
            var mainGraphicsContext = this.mainGraphicsContext;
            var colsSelection = mainGraphicsContext.selectAll(WaterfallChart.CategoryValueClasses.selector);
            var cols = colsSelection.data(data, (d: WaterfallChartDataPoint) => d.key);

            cols
                .enter()
                .append('rect')
                .attr('class', (d: WaterfallChartDataPoint) => WaterfallChart.CategoryValueClasses.class.concat(d.highlight ? 'highlight' : ''));

            cols.exit().remove();

            return cols;
        }

        private createConnectors(data: WaterfallChartDataPoint[]): D3.UpdateSelection {
            var mainGraphicsContext = this.mainGraphicsContext;
            var connectorSelection = mainGraphicsContext.selectAll(WaterfallChart.WaterfallConnectorClasses.selector);

            var connectors = connectorSelection.data(data.slice(0, data.length - 1), (d: WaterfallChartDataPoint) => d.key);

            connectors
                .enter()
                .append('line')
                .classed(WaterfallChart.WaterfallConnectorClasses.class, true);

            connectors.exit().remove();

            return connectors;
        }

        public render(duration: number): void {
            var dataPoints = this.clippedData.dataPoints;
            var bars = this.createRects(dataPoints);
            var connectors = this.createConnectors(dataPoints);

            TooltipManager.addTooltip(bars, (d, i) => d.tooltipInfo);

            var hasSelection = dataHasSelection(dataPoints);

            var xScale = this.xAxisProperties.scale;
            var yScale = this.yAxisProperties.scale;
            var y0 = yScale(0);

            /**
             * The y-value is always at the top of the rect. If the data value is negative then we can
             * use the scaled position directly since we are drawing down. If the data value is positive
             * we have to calculate the top of the rect and use that as the y-value. Since the y-value 
             * is always the top of the rect, height should always be positive.
             */
            bars
                .style('fill', (d: WaterfallChartDataPoint) => d.color)
                .style('fill-opacity', (d: WaterfallChartDataPoint) => ColumnUtil.getFillOpacity(d.selected, d.highlight, hasSelection, this.data.hasHighlights))
                .attr('width', this.layout.categoryWidth)
                .attr('x', (d: WaterfallChartDataPoint) => xScale(d.categoryIndex))
                .attr('y', (d: WaterfallChartDataPoint) => WaterfallChart.getRectTop(yScale, d.position, d.value))
                .attr('height', (d: WaterfallChartDataPoint) => y0 - yScale(Math.abs(d.value)));

            connectors
                .attr({
                    'x1': (d: WaterfallChartDataPoint) => xScale(d.categoryIndex),
                    'y1': (d: WaterfallChartDataPoint) => yScale(d.position + d.value),
                    'x2': (d: WaterfallChartDataPoint) => xScale(d.categoryIndex + 1) + this.layout.categoryWidth,
                    'y2': (d: WaterfallChartDataPoint) => yScale(d.position + d.value),
                });

            if (this.data.dataLabelsSettings.show) {                
                dataLabelUtils.drawDefaultLabelsForDataPointChart(dataPoints, this.mainGraphicsContext, this.layout, this.currentViewport);
            } else {
                dataLabelUtils.cleanDataLabels(this.mainGraphicsContext);
            }

            if (this.interactivityService) {
                var behaviorOptions: WaterfallChartBehaviorOptions = {
                    bars: bars,
                    datapoints: dataPoints,
                    background: d3.select(this.element.get(0)),
                };

                this.interactivityService.apply(this, behaviorOptions);
            }

            // This should always be the last line in the render code.
            SVGUtil.flushAllD3TransitionsIfNeeded(this.options);
        }

        public onClearSelection(): void {
            if (this.interactivityService)
                this.interactivityService.clearSelection();
        }

        public accept(visitor: InteractivityVisitor, options: any): void {
            debug.assertValue(visitor, 'visitor');

            visitor.visitWaterfallChart(options);
        }

        public getSupportedCategoryAxisType(): string {
            return axisType.categorical;
        }

        private static getRectTop(scale: D3.Scale.GenericScale<any>, pos: number, value: number): number {
            if (value < 0)
                return scale(pos);
            else
                return scale(pos) - (scale(0) - scale(value));
        }

        private getSentimentColorsFromObjects(objects: DataViewObjects): WaterfallChartSentimentColors {
            var defaultSentimentColors = this.colors.getSentimentColors();
            var increaseColor = DataViewObjects.getFillColor(objects, waterfallChartProps.sentimentColors.increaseFill, defaultSentimentColors[2].value);
            var decreaseColor = DataViewObjects.getFillColor(objects, waterfallChartProps.sentimentColors.decreaseFill, defaultSentimentColors[0].value);
            var totalColor = DataViewObjects.getFillColor(objects, waterfallChartProps.sentimentColors.totalFill, WaterfallChart.defaultTotalColor);

            return <WaterfallChartSentimentColors> {
                increaseFill: { solid: { color: increaseColor } },
                decreaseFill: { solid: { color: decreaseColor } },
                totalFill: { solid: { color: totalColor } }
            };
        }
    }
}