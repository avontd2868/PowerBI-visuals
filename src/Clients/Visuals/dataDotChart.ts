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

// IMPORTANT: This chart is not currently enabled in the PBI system and is under development.
module powerbi.visuals {

    export interface IDataDotChartConfiguration {
        xAxisProperties: IAxisProperties;
        yAxisProperties: IAxisProperties;
        margin: any;
    }

    export interface DataDotChartData {
        series: DataDotChartSeries;
        hasHighlights: boolean;
        hasDynamicSeries: boolean;
    }

    export interface DataDotChartSeries extends CartesianSeries {
        xCol: DataViewMetadataColumn;
        yCol: DataViewMetadataColumn;
        data: DataDotChartDataPoint[];   //overridden type of array     
    }

    export interface DataDotChartDataPoint extends CartesianDataPoint, SelectableDataPoint {
        highlight: boolean;
    }

    /* The data dot chart shows a set of circles with the data value inside them. 
     * - The circles are regularly spaced similar to column charts.
     * - The radius of all dots is the same across the chart.
     * - This is most often combined with a column chart to create the 'chicken pox' chart.
     * - If any of the data values do not fit within the circles, then the data values are hidden
     *   and the y axis for the dots is displayed instead.
     * - This chart only supports a single series of data.
     * - This chart does not display a legend.
     */
    export class DataDotChart implements ICartesianVisual, IInteractiveVisual {
        public static formatStringProp: DataViewObjectPropertyIdentifier = { objectName: 'general', propertyName: 'formatString' };
        private static ClassName = 'dataDotChart';

        private static DotClassName = 'dot';
        private static DotClassSelector = '.dot';
        private static DotColorKey = 'dataDot';

        private static DotLabelClassName = 'label';
        private static DotLabelClassSelector = '.label';
        private static DotLabelVerticalOffset = '0.4em';
        private static DotLabelTextAnchor = 'middle';

        private options: CartesianVisualInitOptions;

        // Chart properties
        private svg: D3.Selection;
        private element: JQuery;
        private mainGraphicsG: D3.Selection;
        private mainGraphicsContext: D3.Selection;
        private clearCatcher: D3.Selection;
        private currentViewport: IViewport;
        private hostService: IVisualHostServices;
        private cartesianVisualHost: ICartesianVisualHost;
        private style: IVisualStyle;
        private colors: IDataColorPalette;

        // Cartesian chart properties
        private xAxisProperties: IAxisProperties;
        private yAxisProperties: IAxisProperties;
        private margin;

        // Data properties
        private data: DataDotChartData;
        private dataViewCategorical: DataViewCategorical;
        private clippedData: DataDotChartData;

        // Interactivity properties
        private interactivityService: IInteractivityService;
        private interactivity: InteractivityOptions;

        // I support a categorical (ordinal) X with measure Y for a single series
        public static capabilities: VisualCapabilities = {
            dataRoles: [
                {
                    name: 'Category',
                    kind: VisualDataRoleKind.Grouping,
                }, {
                    name: 'Y',
                    kind: VisualDataRoleKind.Measure,
                },
            ],
            objects: {
                general: {
                    displayName: data.createDisplayNameGetter('Visual_General'),
                    properties: {
                        formatString: {
                            type: { formatting: { formatString: true } },
                        },
                    },
                },
            },
            dataViewMappings: [{
                conditions: [
                    { 'Category': { max: 1 }, 'Y': { max: 1 } }
                ],
                categorical: {
                    categories: {
                        for: { in: 'Category' },
                        dataReductionAlgorithm: { top: {} }
                    },
                    values: {
                        select: [{
                            for: { in: 'Y' },
                            dataReductionAlgorithm: { top: {} }
                        }]
                    },
                },
            }]
        };

        public init(options: CartesianVisualInitOptions): void {
            this.options = options;

            // Common properties
            this.svg = options.svg;
            this.clearCatcher = this.svg.select(".clearCatcher");
            this.mainGraphicsG = this.svg.append('g')
                .classed('dataDotChartMainGraphicsContext', true);
            this.mainGraphicsContext = this.mainGraphicsG.append('svg');
            this.currentViewport = options.viewport;
            this.hostService = options.host;
            this.cartesianVisualHost = options.cartesianHost;
            this.style = options.style;
            this.colors = this.style.colorPalette.dataColors;

            // Interactivity properties
            this.interactivityService = VisualInteractivityFactory.buildInteractivityService(options);
            this.interactivity = options.interactivity;

            var element = this.element = options.element;
            element.addClass(DataDotChart.ClassName);
            element.css('overflow', 'visible');
        }

        public setData(dataViews: DataView[]): void {
            this.data = {
                series: <DataDotChartSeries>{
                    data: <DataDotChartDataPoint[]>[]
                },
                hasHighlights: false,
                hasDynamicSeries: false,
            };

            if (dataViews.length > 0) {

                // I only handle a single data view
                var dataView = dataViews[0];
                if (dataView && dataView.categorical) {

                    var dataViewCategorical = this.dataViewCategorical = dataView.categorical;
                    var dvCategories = dataViewCategorical.categories;

                    // I default to text unless there is a category type
                    var categoryType = ValueType.fromDescriptor({ text: true });
                    if (dvCategories && dvCategories.length > 0 && dvCategories[0].source && dvCategories[0].source.type)
                        categoryType = dvCategories[0].source.type;

                    this.data = DataDotChart.converter(dataView, valueFormatter.format(null));
                    if (this.interactivityService) {
                        this.interactivityService.applySelectionStateToData(this.data.series.data);
                    }
                }
            }
        }

        public calculateAxesProperties(options: CalculateScaleAndDomainOptions): IAxisProperties[] {
            this.currentViewport = options.viewport;
            this.margin = options.margin;

            var data = this.data;
            var viewport = this.currentViewport;
            var margin = this.margin;
            var series: DataDotChartSeries = data ? data.series : null;
            var seriesArray = series && series.data && series.data.length > 0 ? [series] : [];
            var categoryCount = series && series.data ? series.data.length : 0;

            // If there are highlights, then the series is 2x in length and highlights are interwoven.
            if (data.hasHighlights) {
                categoryCount = categoryCount / 2;
            }

            var width = viewport.width - (margin.left + margin.right);
            var height = viewport.height - (margin.top + margin.bottom);

            var xMetaDataColumn: DataViewMetadataColumn;
            var yMetaDataColumn: DataViewMetadataColumn;

            if (DataDotChart.hasDataPoint(series)) {
                xMetaDataColumn = series.xCol;
                yMetaDataColumn = series.yCol;
            }

            var layout = CartesianChart.getLayout(
                null,
                {
                    availableWidth: width,
                    categoryCount: categoryCount,
                    domain: null,
                    isScalar: false,
                    isScrollable: false
                });
            var outerPadding = layout.categoryThickness * CartesianChart.OuterPaddingRatio;

            // I clip data the won't fit
            this.clippedData = DataDotChart.createClippedDataIfOverflowed(data, layout.categoryCount);          

            var yDomain = AxisHelper.createValueDomain(seriesArray, /*includeZero:*/ true);

            var combinedDomain = AxisHelper.combineDomain(options.forcedYDomain, yDomain);

            this.yAxisProperties = AxisHelper.createAxis({
                pixelSpan: height,
                dataDomain: combinedDomain,
                metaDataColumn: yMetaDataColumn,
                formatStringProp: DataDotChart.formatStringProp,
                outerPadding: 0,
                isScalar: true,
                isVertical: true,
                forcedTickCount: options.forcedTickCount,
                useTickIntervalForDisplayUnits: true,
                isCategoryAxis: true
            });

            var axisType = this.xAxisProperties ? this.xAxisProperties.axisType : ValueType.fromDescriptor({ text: true });
            var xDomain = AxisHelper.createDomain(seriesArray, axisType, /*isScalar:*/ false, options.forcedXDomain);
            this.xAxisProperties = AxisHelper.createAxis({
                pixelSpan: width,
                dataDomain: xDomain,
                metaDataColumn: xMetaDataColumn,
                formatStringProp: DataDotChart.formatStringProp,
                outerPadding: outerPadding,
                isScalar: false,
                isVertical: false,
                forcedTickCount: options.forcedTickCount,
                useTickIntervalForDisplayUnits: true,
                categoryThickness: layout.categoryThickness,
                getValueFn: (index, type) => this.lookupXValue(index, type),
                isCategoryAxis: false
            });

            return [this.xAxisProperties, this.yAxisProperties];
        }

        private static createClippedDataIfOverflowed(data: DataDotChartData, categoryCount: number): DataDotChartData {                                                

            // If there are highlights, then the series is 2x in length and highlights are interwoven.
            var requiredLength = data.hasHighlights ? Math.min(data.series.data.length, categoryCount * 2) : Math.min(data.series.data.length, categoryCount);  
            
            if (requiredLength >=  data.series.data.length) {
                return data;
            }
            
            var clipped: DataDotChartData = Prototype.inherit(data);
            clipped.series = Prototype.inherit(data.series); // This prevents clipped and data from sharing the series object
            clipped.series.data = clipped.series.data.slice(0, requiredLength);                        
            return clipped;
        }        

        private static hasDataPoint(series: DataDotChartSeries): boolean {
            return (series && series.data && series.data.length > 0);
        }

        private lookupXValue(index: number, type: ValueType): any {
            var data = this.clippedData;

            var isDateTime = AxisHelper.isDateTime(type);
            if (isDateTime)
                return new Date(index);

            if (data && data.series) {
                var seriesData = data.series.data;

                if (seriesData) {
                    var dataAtIndex = seriesData[index];
                    if (dataAtIndex) {
                        return dataAtIndex.categoryValue;
                    }
                }
            }

            return index;
        }

        public overrideXScale(xProperties: IAxisProperties): void {
            this.xAxisProperties = xProperties;
        }

        public render(duration: number): void {
            var data = this.clippedData;
            var dataPoints = data.series.data;
            var hasHighlights = data.hasHighlights;

            var margin = this.margin;
            var viewport = this.currentViewport;
            var width = viewport.width - (margin.left + margin.right);
            var height = viewport.height - (margin.top + margin.bottom);
            var xScale = <D3.Scale.OrdinalScale>this.xAxisProperties.scale;
            var yScale = this.yAxisProperties.scale;
            var dotWidth = this.xAxisProperties.categoryThickness * (1 - CartesianChart.InnerPaddingRatio);
            var dotRadius = dotWidth / 2;
            var dotColor = this.colors.getColor(DataDotChart.DotColorKey);

            var hasSelection = dataHasSelection(dataPoints);

            this.mainGraphicsContext.attr('width', width)
                .attr('height', height);

            var dots = this.mainGraphicsContext.selectAll(DataDotChart.DotClassSelector).data(dataPoints, d => d.identity.getKey());

            dots.enter()
                .append('circle')
                .classed(DataDotChart.DotClassName, true);

            dots
                .style({ 'fill': dotColor.value })
                .style('fill-opacity', (d: DataDotChartDataPoint) => ColumnUtil.getFillOpacity(d.selected, d.highlight, hasSelection, hasHighlights))
                .classed('null-value',(d: DataDotChartDataPoint) => d.value === null)
                .attr({
                    r: (d: DataDotChartDataPoint) => dotRadius,
                    cx: d => xScale(d.categoryIndex) + dotRadius,
                    cy: d => yScale(d.value)
                });

            dots.exit().remove();

            var dotLabels = this.mainGraphicsContext.selectAll(DataDotChart.DotLabelClassSelector).data(dataPoints, d => d.identity.getKey());

            dotLabels.enter()
                .append('text')
                .classed(DataDotChart.DotLabelClassName, true)
                .attr({
                    'text-anchor': DataDotChart.DotLabelTextAnchor,
                    dy: DataDotChart.DotLabelVerticalOffset
                });
            
            dotLabels
                .classed('null-value',(d: DataDotChartDataPoint) => d.value === null)
                .classed('overflowed', false)
                .attr({
                    x: d => xScale(d.categoryIndex) + dotRadius,
                    y: d => yScale(d.value)
                })
                .text(d => this.yAxisProperties.formatter.format(d.value));
                     
            var overflowed = false;
            dotLabels
                .each(function () {
                // jQuery fails to properly inspect SVG class elements, the $('<div>') notation works around it.
                if (!overflowed && !$("<div>").addClass($(this).attr("class")).hasClass("null-value")) {
                    var width = TextMeasurementService.measureSvgTextElementWidth(this);
                    if (width > dotWidth) {
                        dotLabels.classed('overflowed', true);
                        overflowed = true;
                    }
                }
            });           

            dotLabels.exit().remove();            

            if (this.interactivityService) {
                var behaviorOptions: DataDotChartBehaviorOptions = {
                    dots: dots,
                    datapoints: dataPoints,
                    clearCatcher: this.clearCatcher,
                };

                this.interactivityService.apply(this, behaviorOptions);
            }        

            // This should always be the last line in the render code.
            SVGUtil.flushAllD3TransitionsIfNeeded(this.options);
        }

        public calculateLegend(): LegendData {
            return this.createLegendDataPoints(0); // start with index 0
        }

        public hasLegend(): boolean {
            return this.data && this.data.hasDynamicSeries;
        }

        private createLegendDataPoints(columnIndex: number): LegendData {
            var data = this.data;
            if (!data)
                return null;

            var series = data.series;
            var seriesData = series.data;

            var legendDataPoints: LegendDataPoint[] = [];
            var category: any;

            var axisType = this.xAxisProperties ? this.xAxisProperties.axisType : ValueType.fromDescriptor({ text: true });

            // Category will be the same for all series. This is an optimization.
            if (data.series && data.series.data) {
                var firstDataPoint: DataDotChartDataPoint = data.series.data[0];
                category = firstDataPoint && this.lookupXValue(firstDataPoint.categoryValue, axisType);
            }

            // Create a legend data point for the specified column                
            if (series.yCol) {

                var formatStringProp = DataDotChart.formatStringProp;
                var lineDataPoint = seriesData[columnIndex];
                var measure = lineDataPoint && lineDataPoint.value;

                var label = converterHelper.getFormattedLegendLabel(series.yCol, this.dataViewCategorical.values, formatStringProp);

                var dotColor = this.colors.getColor(DataDotChart.DotColorKey);
                var dataViewCategoricalValues = this.dataViewCategorical.values;
                var identity = dataViewCategoricalValues && dataViewCategoricalValues.length > columnIndex ? dataViewCategoricalValues[columnIndex].identity : null;
                legendDataPoints.push({
                    color: dotColor.value,
                    icon: LegendIcon.Line,
                    label: label,
                    category: valueFormatter.format(category, valueFormatter.getFormatString(series.xCol, formatStringProp)),
                    measure: valueFormatter.format(measure, valueFormatter.getFormatString(series.yCol, formatStringProp)),
                    identity: identity ? SelectionId.createWithId(identity) : SelectionId.createNull(),
                    selected: false
                });
            }

            return { dataPoints: legendDataPoints };
        }

        public onClearSelection(): void {
            if (this.interactivityService)
                this.interactivityService.clearSelection();

            // cartesianChart handles calling render again.
        }

        public static converter(dataView: DataView, blankCategoryValue: string): DataDotChartData {
            var categorical = dataView.categorical;

            var category: DataViewCategoryColumn = categorical.categories && categorical.categories.length > 0
                ? categorical.categories[0]
                : {
                    source: undefined,
                    values: [blankCategoryValue],
                    identity: undefined
                };

            var categoryType: ValueType = AxisHelper.getCategoryValueType(category.source);
            var isDateTime = AxisHelper.isDateTime(categoryType);
            var categoryValues = category.values;

            // I only handle a single series
            if (categorical.values) {
                var measure = categorical.values[0];

                var hasHighlights: boolean = !!measure.highlights;

                var dataPoints: DataDotChartDataPoint[] = [];
                for (var categoryIndex = 0, len = measure.values.length; categoryIndex < len; categoryIndex++) {
                    
                    debug.assert(!category.identity || categoryIndex < category.identity.length, 'Category identities is smaller than category values.');

                    // I create the identity from the category.  If there is no category, then I use the measure name to create identity
                    var identity = category.identity ? SelectionId.createWithId(category.identity[categoryIndex]) : SelectionId.createWithMeasure(measure.source.queryName);

                    var categoryValue = categoryValues[categoryIndex];

                    dataPoints.push({
                        categoryValue: isDateTime && categoryValue ? categoryValue.getTime() : categoryValue,
                        value: measure.values[categoryIndex],
                        categoryIndex: categoryIndex,
                        seriesIndex: 0,
                        selected: false,
                        identity: identity,
                        highlight: false
                    });

                    if (hasHighlights) {

                        var highlightIdentity = SelectionId.createWithHighlight(identity);
                        var highlightValue = measure.highlights[categoryIndex];

                        dataPoints.push({
                            categoryValue: isDateTime && categoryValue ? categoryValue.getTime() : categoryValue,
                            value: highlightValue,
                            categoryIndex: categoryIndex,
                            seriesIndex: 0,
                            selected: false,
                            identity: highlightIdentity,
                            highlight: true
                        });
                }
                }

                return {
                    series: {
                        xCol: category.source,
                        yCol: measure.source,
                        data: dataPoints
                    },
                    hasHighlights: hasHighlights,
                    hasDynamicSeries: true,
                };
            }

            return {
                series: <DataDotChartSeries>{
                    data: <DataDotChartDataPoint[]>[]
                },
                hasHighlights: false,
                hasDynamicSeries: false,
            };
        }

        public accept(visitor: InteractivityVisitor, options: any): void {
            debug.assertValue(visitor, 'visitor');

            visitor.visitDataDotChart(options);
        }
    }
} 