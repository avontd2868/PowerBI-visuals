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
    export interface FunnelChartConstructorOptions {
        animator: IFunnelAnimator;
    }

    export interface FunnelSlice extends SelectableDataPoint, TooltipEnabledDataPoint, LabelEnabledDataPoint {
        value: number;
        label: string;
        key: string;
        categoryOrMeasureIndex: number;
        highlight?: boolean;
        highlightValue?: number;
        color: string;
    }

    export interface FunnelData {
        slices: FunnelSlice[];
        valuesMetadata: DataViewMetadataColumn[];
        hasHighlights: boolean;
        highlightsOverflow: boolean;
        dataLabelsSettings: VisualDataLabelsSettings;
    }    

    export interface FunnelAxisOptions {
        maxScore: number;
        xScale: D3.Scale.OrdinalScale;
        yScale: D3.Scale.LinearScale;
        verticalRange: number;
        margin: IMargin;
        rangeStart: number;
        rangeEnd: number;
        barToSpaceRatio: number;
        hideInnerLabels: boolean;
        categoryLabels: string[];
    }

    export interface IFunnelLayout {
        shapeLayout: {
            width: (d: FunnelSlice) => number;
            height: (d: FunnelSlice) => number;
            x: (d: FunnelSlice) => number;
            y: (d: FunnelSlice) => number;
        };
        shapeLayoutWithoutHighlights: {
            width: (d: FunnelSlice) => number;
            height: (d: FunnelSlice) => number;
            x: (d: FunnelSlice) => number;
            y: (d: FunnelSlice) => number;
        };
        zeroShapeLayout: {
            width: (d: FunnelSlice) => number;
            height: (d: FunnelSlice) => number;
            x: (d: FunnelSlice) => number;
            y: (d: FunnelSlice) => number;
        };
    }

    /** Renders a funnel chart */
    export class FunnelChart implements IVisual, IInteractiveVisual {
        public static DefaultBarOpacity = 1;
        public static DimmedBarOpacity = 0.4;
        public static InnerTextClassName = 'labelSeries';
        private static VisualClassName = 'funnelChart';
        private static BarToSpaceRatio = 0.1;
        private static MaxBarWidth = 40;
        private static MinBarThickness = 12;
        private static LabelFunnelPadding = 6;
        private static InnerTextMinimumPadding = 10;
        private static InnerTextHeightDelta = 4;
        private static InnerTextGroupClassName = 'innerTextGroup';
        private static StandardTextProperties: TextProperties = {
            fontFamily: 'wf_segoe-ui_normal',
            fontSize: '12px',
        };
        private static OverflowingHighlightWidthRatio = 0.5;
        private static TickPadding = 0;
        private static InnerTickSize = 0;

        private svg: D3.Selection;
        private funnelGraphicsContext: D3.Selection;
        private clearCatcher: D3.Selection;
        private axisGraphicsContext: D3.Selection;
        private labelGraphicsContext: D3.Selection;
        private currentViewport: IViewport;
        private colors: IDataColorPalette;
        private data: FunnelData;
        private hostServices: IVisualHostServices;
        private margin: IMargin;
        private options: VisualInitOptions;
        private interactivityService: IInteractivityService;
        private defaultDataPointColor: string;
        private labelPositionObjects: string[] = [labelPosition.outsideEnd, labelPosition.insideCenter];
        // TODO: Remove onDataChanged & onResizing once all visuals have implemented update.
        private dataViews: DataView[];

        /* Public for testing */
        public animator: IFunnelAnimator;

        constructor(options?: FunnelChartConstructorOptions) {
            if (options && options.animator) {
                this.animator = options.animator;
            }
        }

        public static converter(dataView: DataView, colors: IDataColorPalette, defaultDataPointColor?: string): FunnelData {
            var slices: FunnelSlice[] = [];
            var formatStringProp = funnelChartProps.general.formatString;
            var valueMetaData = dataView.metadata ? dataView.metadata.columns.filter(d => d.isMeasure) : [];
            var categories = dataView.categorical.categories || [];
            var values = dataView.categorical.values;
            var hasHighlights = values && values[0] && !!values[0].highlights;
            var highlightsOverflow = false;
            var categorical: DataViewCategorical = dataView.categorical;
            var dataLabelsSettings: VisualDataLabelsSettings = dataLabelUtils.getDefaultFunnelLabelSettings(defaultDataPointColor);
            var colorHelper = new ColorHelper(colors, funnelChartProps.dataPoint.fill, defaultDataPointColor);

            if (dataView && dataView.metadata && dataView.metadata.objects) {
                var labelsObj = <DataLabelObject>dataView.metadata.objects['labels'];

                if (labelsObj) {
                    dataLabelsSettings.show = (labelsObj.show !== undefined) ? labelsObj.show : dataLabelsSettings.show;
                    dataLabelsSettings.position = (labelsObj.labelPosition !== undefined) ? labelsObj.labelPosition : dataLabelsSettings.position;
                    if (labelsObj.color !== undefined) {
                        dataLabelsSettings.labelColor = labelsObj.color.solid.color;
                        dataLabelsSettings.overrideDefaultColor = true;
                    }
                    if (labelsObj.labelDisplayUnits !== undefined) {
                        dataLabelsSettings.displayUnits = labelsObj.labelDisplayUnits;
                    }
                    if (labelsObj.labelPrecision !== undefined) {
                        dataLabelsSettings.precision = (labelsObj.labelPrecision >= 0) ? labelsObj.labelPrecision : 0;
                    }
                }
                dataLabelsSettings.formatterOptions = dataLabelUtils.getFormatterOptionsColumn(dataView.metadata.columns);
            }
            if (categories.length === 1 && categories[0].values.length > 1 && values) {
                var category = categories[0];
                var categoryValues = category.values;

                var categorySourceFormatString = valueFormatter.getFormatString(category.source, formatStringProp);

                for (var i = 0, ilen = categoryValues.length; i < ilen; i++) {
                    var measureName = values[0].source.queryName;
                    var identity = category.identity
                        ? SelectionId.createWithIdAndMeasure(category.identity[i], measureName)
                        : SelectionId.createWithMeasure(measureName);
                    var value = d3.sum(values.map(d => d.values[i]));
                    var formattedCategoryValue = valueFormatter.format(categoryValues[i], categorySourceFormatString);
                    var tooltipInfo: TooltipDataItem[] = TooltipBuilder.createTooltipInfo(formatStringProp, categorical.categories, formattedCategoryValue, categorical.values, value, null, 0);

                    if (hasHighlights) {
                        var highlight = d3.sum(values.map(d => d.highlights[i]));
                        if (highlight !== 0) {
                            tooltipInfo = TooltipBuilder.createTooltipInfo(formatStringProp, categorical.categories, formattedCategoryValue, categorical.values, value, null, 0, highlight);
                        }
                    }

                    // Same color for all bars
                    var color = colorHelper.getColorForMeasure(category.objects && category.objects[i], '');

                    slices.push({
                        label: formattedCategoryValue,
                        value: value,
                        categoryOrMeasureIndex: i,
                        identity: identity,
                        selected: false,
                        key: identity.getKey(),
                        tooltipInfo: tooltipInfo,
                        color: color,
                        labelFill: dataLabelsSettings.overrideDefaultColor ? dataLabelsSettings.labelColor : color,
                    });
                    if (hasHighlights) {
                        var highlightIdentity = SelectionId.createWithHighlight(identity);
                        var highlight = d3.sum(values.map(d => d.highlights[i]));
                        if (highlight > value) {
                            highlightsOverflow = true;
                        }

                        var highlightedValue = highlight !== 0 ? highlight : undefined;
                        var tooltipInfo: TooltipDataItem[] = TooltipBuilder.createTooltipInfo(formatStringProp, categorical.categories, formattedCategoryValue, categorical.values, value, null, 0, highlightedValue);

                        slices.push({
                            label: formattedCategoryValue,
                            value: value,
                            categoryOrMeasureIndex: i,
                            identity: highlightIdentity,
                            selected: false,
                            key: highlightIdentity.getKey(),
                            highlight: true,
                            highlightValue: highlight,
                            tooltipInfo: tooltipInfo,
                            color: color,
                        });
                    }
                }
            } else if (valueMetaData.length > 0 && values) {
                // Single Category Value, Multi-measures
                for (var i = 0, len = values.length; i < len; i++) {
                    var valueColumn = values[i];
                    var value = d3.sum(valueColumn.values);
                    var identity = SelectionId.createWithMeasure(valueColumn.source.queryName);
                    var categoryValue: any = valueMetaData[i].displayName;
                    var valueIndex: number = categorical.categories ? null : i;
                    var tooltipInfo: TooltipDataItem[] = TooltipBuilder.createTooltipInfo(formatStringProp, categorical.categories, categoryValue, categorical.values, value, null, valueIndex);

                    // Same color for all bars
                    var color = colorHelper.getColorForMeasure(valueColumn.source.objects, '');

                    if (hasHighlights) {
                        var highlight = d3.sum(values.map(d => d.highlights[i]));
                        if (highlight !== 0) {
                            tooltipInfo = TooltipBuilder.createTooltipInfo(formatStringProp, categorical.categories, categoryValue, categorical.values, value, null, 0, highlight);
                        }
                    }

                    slices.push({
                        label: valueMetaData[i].displayName,
                        value: value,
                        categoryOrMeasureIndex: i,
                        identity: identity,
                        selected: false,
                        key: identity.getKey(),
                        tooltipInfo: tooltipInfo,
                        color: color,
                        labelFill: dataLabelsSettings.overrideDefaultColor ? dataLabelsSettings.labelColor : color,
                    });
                    if (hasHighlights) {
                        var highlightIdentity = SelectionId.createWithHighlight(identity);
                        var highlight = d3.sum(values[i].highlights);
                        if (highlight > value) {
                            highlightsOverflow = true;
                        }
                        var highlightedValue = highlight !== 0 ? highlight : undefined;
                        var tooltipInfo: TooltipDataItem[] = TooltipBuilder.createTooltipInfo(formatStringProp, categorical.categories, categoryValue, categorical.values, value, null, 0, highlightedValue);

                        slices.push({
                            label: valueMetaData[i].displayName,
                            value: value,
                            categoryOrMeasureIndex: i,
                            identity: highlightIdentity,
                            key: highlightIdentity.getKey(),
                            selected: false,
                            highlight: true,
                            highlightValue: highlight,
                            tooltipInfo: tooltipInfo,
                            color: color,
                        });
                }
            }
            }

            return {
                slices: slices,
                valuesMetadata: valueMetaData,
                hasHighlights: hasHighlights,
                highlightsOverflow: highlightsOverflow,
                dataLabelsSettings: dataLabelsSettings,
            };
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] {
            switch (options.objectName) {
                case 'dataPoint':
                    var dataViewCat: DataViewCategorical = this.dataViews && this.dataViews.length > 0 && this.dataViews[0] && this.dataViews[0].categorical;
                    var hasGradientRole = GradientUtils.hasGradientRole(dataViewCat);
                    if (!hasGradientRole) {
                    return this.enumerateDataPoints();
                    }
                    break;
                case 'labels':
                    return dataLabelUtils.enumerateDataLabels(this.data.dataLabelsSettings, true, true, true, this.labelPositionObjects);
            }
        }

        private enumerateDataPoints(): VisualObjectInstance[] {
            var data = this.data;
            if (!data)
                return;

            var instances: VisualObjectInstance[] = [];
            var slices = data.slices;

            instances.push({
                objectName: 'dataPoint',
                selector: null,
                properties: {
                    defaultColor: { solid: { color: this.defaultDataPointColor || this.colors.getColor(0).value } }
                },
            });

            for (var i = 0; i < slices.length; i++) {
                var slice = slices[i];
                if (slice.highlight)
                    continue;

                var color = slice.color;
                var selector = slice.identity.getSelector();
                var isSingleSeries = !!selector.data;

                var dataPointInstance: VisualObjectInstance = {
                    objectName: 'dataPoint',
                    displayName: slice.label,
                    selector: ColorHelper.normalizeSelector(selector, isSingleSeries),
                    properties: {
                        fill: { solid: { color: color } }
                    },
                };

                instances.push(dataPointInstance);
            }

            return instances;
        }

        public init(options: VisualInitOptions) {
            this.options = options;
            var element = options.element;
            var svg = this.svg = d3.select(element.get(0))
                .append('svg')
                .classed(FunnelChart.VisualClassName, true);
            this.clearCatcher = appendClearCatcher(this.svg);

            this.currentViewport = options.viewport;
            this.margin = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            };
            var style = options.style;
            this.colors = style.colorPalette.dataColors;
            this.hostServices = options.host;
            this.interactivityService = VisualInteractivityFactory.buildInteractivityService(options);
            this.funnelGraphicsContext = svg.append('g');
            this.axisGraphicsContext = svg.append('g');
            var lgc = this.labelGraphicsContext = svg.append('g');
            lgc.classed(FunnelChart.InnerTextGroupClassName, true);

            this.updateViewportProperties();
        }

        private updateViewportProperties() {
            var viewport = this.currentViewport;
            this.svg.attr('width', viewport.width)
                .attr('height', viewport.height);
        }

        public update(options: VisualUpdateOptions): void {
            debug.assertValue(options, 'options');
            this.data = {
                slices: [],
                valuesMetadata: [],
                hasHighlights: false,
                highlightsOverflow: false,
                dataLabelsSettings: dataLabelUtils.getDefaultFunnelLabelSettings(),
            };

            var dataViews = this.dataViews = options.dataViews;
            this.currentViewport = options.viewport;

            if (dataViews && dataViews.length > 0) {
                var dataView = dataViews[0];

                if (dataView.metadata && dataView.metadata.objects) {
                    var defaultColor = DataViewObjects.getFillColor(dataView.metadata.objects, funnelChartProps.dataPoint.defaultColor);
                    if (defaultColor)
                        this.defaultDataPointColor = defaultColor;
                }

                if (dataView.categorical) {
                    this.data = FunnelChart.converter(dataView, this.colors, this.defaultDataPointColor);

                    if (this.interactivityService) {
                        this.interactivityService.applySelectionStateToData(this.data.slices);
                }
            }

                var warnings = getInvalidValueWarnings(
                    dataViews,
                    false /*supportsNaN*/,
                    false /*supportsNegativeInfinity*/,
                    false /*supportsPositiveInfinity*/);

                if (warnings && warnings.length > 0)
                    this.hostServices.setWarnings(warnings);
            }

            this.updateViewportProperties();
            this.updateInternal(true);
        }

        // TODO: Remove onDataChanged & onResizing once all visuals have implemented update.
        public onDataChanged(options: VisualDataChangedOptions): void {
            this.update({
                dataViews: options.dataViews,
                duration: options.duration || 0,
                viewport: this.currentViewport
            });
        }

        // TODO: Remove onDataChanged & onResizing once all visuals have implemented update.
        public onResizing(viewport: IViewport, duration: number): void {
            this.currentViewport = viewport;
            this.update({
                dataViews: this.dataViews,
                duration: duration,
                viewport: this.currentViewport
            });
        }

        private getMaxLeftMargin(labels: string[], properties: TextProperties): number {
            var max = 0;
            var textMeasurer: (textProperties) => number = TextMeasurementService.measureSvgTextWidth;
            for (var i = 0, len = labels.length; i < len; i++) {
                properties.text = labels[i];
                max = Math.max(max, textMeasurer(properties));
            }
            return max + FunnelChart.LabelFunnelPadding;
        }

        private updateInternal(useAnimation: boolean) {
            if (this.data == null)
                return;

            var data = this.data;
            var slices = data.slices;
            var slicesWithoutHighlights = slices.filter((d: FunnelSlice) => !d.highlight);

            var axisOptions = this.setUpAxis();
            var margin = axisOptions.margin;
            var verticalRange = axisOptions.verticalRange;

            var funnelContext = this.funnelGraphicsContext.attr('transform',
                SVGUtil.translateAndRotate(margin.left, margin.top, verticalRange / 2, verticalRange / 2, 90));

            this.svg.style('font-size', FunnelChart.StandardTextProperties.fontSize);
            this.svg.style('font-weight', FunnelChart.StandardTextProperties.fontWeight);
            this.svg.style('font-family', FunnelChart.StandardTextProperties.fontFamily);

            var layout = FunnelChart.getLayout(data, axisOptions);
            var labelLayout = dataLabelUtils.getFunnelChartLabelLayout(
                data,
                axisOptions,
                FunnelChart.InnerTextHeightDelta,
                FunnelChart.InnerTextMinimumPadding,
                data.dataLabelsSettings,
                this.currentViewport);
            var result: FunnelAnimationResult;
            var shapes: D3.UpdateSelection;
            var dataLabels: D3.UpdateSelection;

            if (this.animator) {
                var animationOptions: FunnelAnimationOptions = {
                    viewModel: data,
                    interactivityService: this.interactivityService,
                    layout: layout,
                    axisGraphicsContext: this.axisGraphicsContext,
                    shapeGraphicsContext: funnelContext,
                    labelGraphicsContext: this.labelGraphicsContext,
                    axisOptions: axisOptions,
                    slicesWithoutHighlights: slicesWithoutHighlights,
                    colors: this.colors,
                    labelLayout: labelLayout
                };
                result = this.animator.animate(animationOptions);
                shapes = result.shapes;
                dataLabels = result.dataLabels;
            }
            if (!this.animator || !useAnimation || result.failed) {
                FunnelChart.drawDefaultAxis(this.axisGraphicsContext, axisOptions);
                shapes = FunnelChart.drawDefaultShapes(data, slices, funnelContext, layout, this.colors);
                if (data.dataLabelsSettings.show && !axisOptions.hideInnerLabels) {
                    dataLabelUtils.drawDefaultLabelsForFunnelChart(slicesWithoutHighlights, this.labelGraphicsContext, labelLayout);
                }
                else {
                    dataLabelUtils.cleanDataLabels(this.labelGraphicsContext);
                }
            }

            if (this.interactivityService) {
                var behaviorOptions: FunnelBehaviorOptions = {
                    datapoints: slices,
                    bars: shapes,
                    labels: dataLabels,
                    clearCatcher: this.clearCatcher,
                    hasHighlights: data.hasHighlights,
                };

                this.interactivityService.apply(this, behaviorOptions);
            }

            TooltipManager.addTooltip(shapes, (tooltipEvent: TooltipEvent) => tooltipEvent.data.tooltipInfo);

            SVGUtil.flushAllD3TransitionsIfNeeded(this.options);
        }

        private setUpAxis(): FunnelAxisOptions {
            var data = this.data;
            var slices = data.slices;
            var slicesWithoutHighlights = slices.filter((d: FunnelSlice) => !d.highlight);
            var categoryLabels = slicesWithoutHighlights.map((d) => d.label);
            var hideInnerLabels = false;
            var viewport = this.currentViewport;
            var margin = this.margin;
            var horizontalRange = viewport.height - (margin.top + margin.bottom);

            if (categoryLabels.length > 0 && (horizontalRange / categoryLabels.length) < FunnelChart.MinBarThickness) {
                categoryLabels = [];
                hideInnerLabels = true;
            } else {
                var textProperties = FunnelChart.StandardTextProperties;
                margin.left = this.getMaxLeftMargin(categoryLabels, textProperties);
            }

            var verticalRange = viewport.width - (margin.left + margin.right);
            var barToSpaceRatio = FunnelChart.BarToSpaceRatio;
            var maxScore = d3.max(slices.map(d=> d.value));
            var minScore = 0;
            var rangeStart = 0;
            var rangeEnd = horizontalRange;

            if (categoryLabels.length > 0 && horizontalRange / categoryLabels.length > FunnelChart.MaxBarWidth) {
                var delta = horizontalRange - (categoryLabels.length * FunnelChart.MaxBarWidth);
                rangeStart = Math.ceil(delta / 2);
                rangeEnd = Math.ceil(horizontalRange - delta / 2);
                barToSpaceRatio = FunnelChart.BarToSpaceRatio;
            }

            var yScale = d3.scale.linear()
                .domain([minScore, maxScore])
                .range([verticalRange, 0]);
            var xScale = d3.scale.ordinal()
                .domain(d3.range(0, slicesWithoutHighlights.length))
                .rangeBands([rangeStart, rangeEnd], barToSpaceRatio);

            return {
                margin: margin,
                xScale: xScale,
                yScale: yScale,
                maxScore: maxScore,
                verticalRange: verticalRange,
                rangeStart: rangeStart,
                rangeEnd: rangeEnd,
                barToSpaceRatio: barToSpaceRatio,
                hideInnerLabels: hideInnerLabels,
                categoryLabels: categoryLabels,
            };
        }

        public accept(visitor: InteractivityVisitor, options: any): void {
            visitor.visitFunnel(options);
        }

        public onClearSelection(): void {
            if (this.interactivityService)
                this.interactivityService.clearSelection();
        }

        public static getLayout(data: FunnelData, axisOptions: FunnelAxisOptions): IFunnelLayout {
            var highlightsOverflow = data.highlightsOverflow;
            var yScale = axisOptions.yScale;
            var xScale = axisOptions.xScale;
            var maxScore = axisOptions.maxScore;
            var columnWidth = xScale.rangeBand();
            var overFlowHighlightColumnWidth = columnWidth * FunnelChart.OverflowingHighlightWidthRatio;
            var overFlowHighlightOffset = overFlowHighlightColumnWidth / 2;
            return {
                shapeLayout: {
                    width: ((d: FunnelSlice) => d.highlight && highlightsOverflow ? overFlowHighlightColumnWidth : columnWidth),
                    height: (d: FunnelSlice) => {
                        return Math.abs(yScale(d.highlight ? d.highlightValue : d.value) - yScale(0));
                    },
                    x: (d: FunnelSlice) => {
                        return xScale(d.categoryOrMeasureIndex) + (d.highlight && highlightsOverflow ? overFlowHighlightOffset : 0);
                    },
                    y: (d: FunnelSlice) => {
                        return yScale(d.highlight ? d.highlightValue : d.value) - (Math.abs(yScale(maxScore)
                            - yScale(0)) - Math.abs(yScale(d.highlight ? d.highlightValue : d.value) - yScale(0))) / 2;
                    },
                },
                shapeLayoutWithoutHighlights: {
                    width: ((d: FunnelSlice) => columnWidth),
                    height: (d: FunnelSlice) => {
                        return Math.abs(yScale(d.value) - yScale(0));
                },
                    x: (d: FunnelSlice) => {
                        return xScale(d.categoryOrMeasureIndex) + (0);
                },
                y: (d: FunnelSlice) => {
                        return yScale(d.value) - (Math.abs(yScale(maxScore)
                            - yScale(0)) - Math.abs(yScale(d.value) - yScale(0))) / 2;
                    },
                },
                zeroShapeLayout: {
                    width: ((d: FunnelSlice) => d.highlight && highlightsOverflow ? overFlowHighlightColumnWidth : columnWidth),
                    height: (d: FunnelSlice) => 0,
                    x: (d: FunnelSlice) => {
                        return xScale(d.categoryOrMeasureIndex) + (d.highlight && highlightsOverflow ? overFlowHighlightOffset : 0);
                    },
                    y: (d: FunnelSlice) => {
                        return yScale((yScale.domain()[0] + yScale.domain()[1]) / 2);
                },
                    }
            };
        }

        public static drawDefaultAxis(graphicsContext: D3.Selection, axisOptions: FunnelAxisOptions): void {
            var xScaleForAxis = d3.scale.ordinal()
                .domain(axisOptions.categoryLabels)
                .rangeBands([axisOptions.rangeStart, axisOptions.rangeEnd], axisOptions.barToSpaceRatio);
            var xAxis = d3.svg.axis()
                .scale(xScaleForAxis)
                .orient("right")
                .tickPadding(FunnelChart.TickPadding)
                .innerTickSize(FunnelChart.InnerTickSize);
            graphicsContext.classed('axis', true)
                .attr('transform', SVGUtil.translate(0, axisOptions.margin.top))
                .call(xAxis);
        }

        public static drawDefaultShapes(data: FunnelData, slices: FunnelSlice[], graphicsContext: D3.Selection, layout: IFunnelLayout, colors: IDataColorPalette): D3.UpdateSelection {
            var hasHighlights = data.hasHighlights;
            var columns = graphicsContext.selectAll('.funnelBar').data(slices, (d: FunnelSlice) => d.key);

            columns.enter()
                .append('rect')
                .attr("class", (d: FunnelSlice) => d.highlight ? "funnelBar highlight" : "funnelBar");

            columns
                .style("fill", d => {
                    return d.color;
                })
                .style("fill-opacity", d => (d: FunnelSlice) => ColumnUtil.getFillOpacity(d.selected, d.highlight, false, hasHighlights))
                .attr(layout.shapeLayout);

            columns.exit().remove();

            return columns;
                }
    }
}