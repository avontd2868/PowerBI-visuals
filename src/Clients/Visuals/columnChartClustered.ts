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
    export class ClusteredColumnChartStrategy implements IColumnChartStrategy {
        private static classes = {
            item: {
                class: 'column',
                selector: '.column',
            },
        };

        private data: ColumnChartData;
        private graphicsContext: ColumnChartContext;
        private seriesOffsetScale: D3.Scale.OrdinalScale;
        private width: number;
        private height: number;
        private margin: IMargin;
        private xProps: IAxisProperties;
        private yProps: IAxisProperties;
        private categoryLayout: CategoryLayout;
        private viewportHeight: number

        private columnsCenters: number[];
        private columnSelectionLineHandle: D3.Selection;
        private animator: IColumnChartAnimator;
        private interactivityService: IInteractivityService;

        public setupVisualProps(columnChartProps: ColumnChartContext): void {
            this.graphicsContext = columnChartProps;
            this.margin = columnChartProps.margin;
            this.width = this.graphicsContext.width;
            this.height = this.graphicsContext.height;
            this.categoryLayout = columnChartProps.layout;
            this.animator = columnChartProps.animator;
            this.interactivityService = columnChartProps.interactivityService;
            this.viewportHeight = columnChartProps.viewportHeight;
        }

        public setData(data: ColumnChartData) {
            this.data = data;
        }

        public setXScale(is100Pct: boolean, forcedTickCount?: number, forcedXDomain?: any[]): IAxisProperties {
            var width = this.width;

            var forcedXMin, forcedXMax;

            if (forcedXDomain && forcedXDomain.length === 2) {
                forcedXMin = forcedXDomain[0];
                forcedXMax = forcedXDomain[1];
            }

            var props = this.xProps = ColumnUtil.getCategoryAxis(
                this.data,
                width,
                this.categoryLayout,
                false,
                forcedXMin,
                forcedXMax);

            // create clustered offset scale
            var seriesLength = this.data.series.length;
            var columnWidth = (this.categoryLayout.categoryThickness * (1 - CartesianChart.InnerPaddingRatio)) / seriesLength;
            this.seriesOffsetScale = d3.scale.ordinal()
                .domain(this.data.series.map(s => s.index))
                .rangeBands([0, seriesLength * columnWidth]);

            props.xLabelMaxWidth = this.categoryLayout.isScalar ? (width / props.values.length) : this.categoryLayout.categoryThickness;

            return props;
        }

        public setYScale(is100Pct: boolean, forcedTickCount?: number, forcedYDomain?: any[]): IAxisProperties {
            debug.assert(!is100Pct, 'Cannot have 100% clustered chart.');

            var height = this.viewportHeight;
            var valueDomain = AxisHelper.createValueDomain(this.data.series, true);
            var maxTickCount = AxisHelper.getRecommendedNumberOfTicksForYAxis(height);
            var bestTickCount = ColumnUtil.getTickCount(valueDomain[0], valueDomain[1], this.data.valuesMetadata, maxTickCount, is100Pct, forcedTickCount);
            var normalizedRange = AxisHelper.normalizeLinearDomain({ min: valueDomain[0], max: valueDomain[1] });
            valueDomain = [normalizedRange.min, normalizedRange.max];
           
            var combinedDomain = AxisHelper.combineDomain(forcedYDomain, valueDomain);

            var yScale = d3.scale.linear()
                .range([height, 0])
                .domain(combinedDomain)
                .nice(bestTickCount || undefined)
                .clamp(AxisHelper.scaleShouldClamp(combinedDomain, valueDomain));

            ColumnUtil.normalizeInfinityInScale(yScale);

            var yTickValues: any[] = AxisHelper.getRecommendedTickValuesForALinearRange(bestTickCount, yScale);

            var yAxis = d3.svg.axis()
                .scale(yScale)
                .tickValues(yTickValues);

            var yInterval = ColumnChart.getTickInterval(yTickValues);
            var yFormatter = ClusteredUtil.createValueFormatter(
                this.data.valuesMetadata,
                yInterval);
            yAxis.tickFormat(yFormatter.format);

            var values = yTickValues.map((d: ColumnChartDataPoint) => yFormatter.format(d));

            var yProps = this.yProps = {
                axis: yAxis,
                scale: yScale,
                formatter: yFormatter,
                values: values,
                axisType: ValueType.fromDescriptor({ text: true }),
                axisLabel: null,
                isCategoryAxis: false
            };

            return yProps;
        }

        public drawColumns(useAnimation: boolean): D3.Selection {
            var data = this.data;
            debug.assertValue(data, 'data could not be null or undefined');

            this.columnsCenters = null; // invalidate the columnsCenters so that will be calculated again

            var categoryWidth = (this.categoryLayout.categoryThickness * (1 - CartesianChart.InnerPaddingRatio));
            var columnWidth = categoryWidth / data.series.length;
            var axisOptions: ColumnAxisOptions = {
                columnWidth: columnWidth,
                categoryWidth: categoryWidth,
                xScale: this.xProps.scale,
                yScale: this.yProps.scale,
                seriesOffsetScale: this.seriesOffsetScale,
                isScalar: this.categoryLayout.isScalar,
                margin: this.margin,
            };
            var clusteredColumnLayout = ClusteredColumnChartStrategy.getLayout(data, axisOptions);
            var dataLabelSettings = data.labelSettings;
            var dataLabelLayout = null;
            if (dataLabelSettings != null) {
                dataLabelLayout = dataLabelUtils.getColumnChartLabelLayout(data, this.getLabelLayoutXY(axisOptions, dataLabelSettings), true, false, this.yProps.formatter, axisOptions);
            }

            var result: ColumnChartAnimationResult;
            var shapes: D3.UpdateSelection;
            var series = ColumnUtil.drawSeries(data, this.graphicsContext.mainGraphicsContext, axisOptions);
            if (this.animator && useAnimation) {
                result = this.animator.animate({
                    viewModel: data,
                    series: series,
                    layout: clusteredColumnLayout,
                    itemCS: ClusteredColumnChartStrategy.classes.item,
                    interactivityService: this.interactivityService,
                    labelGraphicsContext: this.graphicsContext.mainGraphicsContext,
                    labelLayout: dataLabelLayout,
                    viewPort: { height: this.height, width: this.width }
                });
                shapes = result.shapes;
            }
            if (!this.animator || !useAnimation || result.failed) {
                shapes = ColumnUtil.drawDefaultShapes(data, series, clusteredColumnLayout, ClusteredColumnChartStrategy.classes.item, !this.animator);
                if (dataLabelLayout !== null) {
                    if (dataLabelSettings.show) {
                        ColumnUtil.drawDefaultLabels(series, this.graphicsContext.mainGraphicsContext, dataLabelLayout, { height: this.height, width: this.width });
                }
                    else {
                        dataLabelUtils.cleanDataLabels(this.graphicsContext.mainGraphicsContext);
                    }
                }
            }

            ColumnUtil.applyInteractivity(shapes, this.graphicsContext.onDragStart);

            return shapes;
        }

        public selectColumn(selectedColumnIndex: number, lastSelectedColumnIndex: number): void {
            ColumnUtil.setChosenColumnOpacity(this.graphicsContext.mainGraphicsContext, ClusteredColumnChartStrategy.classes.item.selector, selectedColumnIndex, lastSelectedColumnIndex);
            this.moveHandle(selectedColumnIndex);
        }

        public getClosestColumnIndex(x: number, y: number): number {
            return ColumnUtil.getClosestColumnIndex(x, this.getColumnsCenters());
        }

        /** Get the chart's columns centers (x value) */
        private getColumnsCenters(): number[] {
            if (!this.columnsCenters) { // lazy creation
                var categoryWidth: number = this.categoryLayout.categoryThickness * (1 - CartesianChart.InnerPaddingRatio);
                // use the axis scale and first series data to get category centers
                if (this.data.series.length > 0) {
                    var xScaleOffset = 0;
                    if (!this.categoryLayout.isScalar)
                        xScaleOffset = categoryWidth / 2;
                    var firstSeries = this.data.series[0];
                    this.columnsCenters = firstSeries.data.map(d => this.xProps.scale(this.categoryLayout.isScalar ? d.categoryValue : d.categoryIndex) + xScaleOffset);
                }
            }
            return this.columnsCenters;
        }

        private moveHandle(selectedColumnIndex: number) {
            var columnCenters = this.getColumnsCenters();
            var x = columnCenters[selectedColumnIndex];

            if (!this.columnSelectionLineHandle) {
                var handle = this.columnSelectionLineHandle = this.graphicsContext.mainGraphicsContext.append('g');
                handle.append('line')
                    .classed('interactive-hover-line', true)
                    .attr({
                    x1: x,
                    x2: x,
                    y1: 0,
                    y2: this.height,
                });

                handle.append('circle')
                    .attr({
                    cx: x,
                    cy: this.height,
                    r: '6px',
                })
                    .classed('drag-handle', true);
            }
            else {
                var handle = this.columnSelectionLineHandle;
                handle.select('line').attr({ x1: x, x2: x });
                handle.select('circle').attr({ cx: x });
            }
        }

        public static getLayout(data: ColumnChartData, axisOptions: ColumnAxisOptions): IColumnLayout {
            var columnWidth = axisOptions.columnWidth;
            var halfColumnWidth = 0.5 * columnWidth;
            var quarterColumnWidth = halfColumnWidth / 2;
            var isScalar = axisOptions.isScalar;
            var xScale = axisOptions.xScale;
            var yScale = axisOptions.yScale;
            var seriesOffsetScale = axisOptions.seriesOffsetScale;
            var scaledY0 = yScale(0);
            var xScaleOffset = 0;

            if (isScalar)
                xScaleOffset = axisOptions.categoryWidth / 2;

            return {
                shapeLayout: {
                    width: (d: ColumnChartDataPoint) => d.drawThinner ? halfColumnWidth : columnWidth,
                    x: (d: ColumnChartDataPoint) => xScale(isScalar ? d.categoryValue : d.categoryIndex) + seriesOffsetScale(d.seriesIndex) - xScaleOffset + (d.drawThinner ? quarterColumnWidth : 0),
                    y: (d: ColumnChartDataPoint) => scaledY0 + AxisHelper.diffScaled(yScale, Math.max(0, d.value), 0),
                    height: (d: ColumnChartDataPoint) => Math.abs(AxisHelper.diffScaled(yScale, 0, d.value)),
                },
                shapeLayoutWithoutHighlights: {
                    width: (d: ColumnChartDataPoint) => columnWidth,
                    x: (d: ColumnChartDataPoint) => xScale(isScalar ? d.categoryValue : d.categoryIndex) + seriesOffsetScale(d.seriesIndex) - xScaleOffset,
                    y: (d: ColumnChartDataPoint) => scaledY0 + AxisHelper.diffScaled(yScale, Math.max(0, d.originalValue), 0),
                    height: (d: ColumnChartDataPoint) => Math.abs(AxisHelper.diffScaled(yScale, 0, d.originalValue)),
                },
                zeroShapeLayout: {
                    width: (d: ColumnChartDataPoint) => d.drawThinner ? halfColumnWidth : columnWidth,
                    x: (d: ColumnChartDataPoint) => xScale(isScalar ? d.categoryValue : d.categoryIndex) + seriesOffsetScale(d.seriesIndex) - xScaleOffset + (d.drawThinner ? quarterColumnWidth : 0),
                    y: (d: ColumnChartDataPoint) => scaledY0,
                    height: (d: ColumnChartDataPoint) => 0,
                },
            };
    }

        private getLabelLayoutXY(axisOptions: ColumnAxisOptions, labelSettings: VisualDataLabelsSettings): any {
            var columnWidth = axisOptions.columnWidth;
            var halfColumnWidth = 0.5 * columnWidth;
            var quarterColumnWidth = halfColumnWidth / 2;
            var isScalar = axisOptions.isScalar;
            var xScale = axisOptions.xScale;
            var yScale = axisOptions.yScale;
            var seriesOffsetScale = axisOptions.seriesOffsetScale;
            var xScaleOffset = 0;
            var scaledY0 = yScale(0);

            if (isScalar)
                xScaleOffset = axisOptions.categoryWidth / 2;

            return {
                x: (d: ColumnChartDataPoint) => xScale(isScalar ? d.categoryValue : d.categoryIndex) + seriesOffsetScale(d.seriesIndex) - xScaleOffset + (d.drawThinner ? quarterColumnWidth : 0) + halfColumnWidth,
                y: (d: ColumnChartDataPoint) => {
                    var outsidePosition = scaledY0 + AxisHelper.diffScaled(yScale, Math.max(0, d.value), 0) - dataLabelUtils.defaultColumnLabelMargin;
                    var insidePosition = scaledY0 + AxisHelper.diffScaled(yScale, Math.max(0, d.value), 0) / 2 - dataLabelUtils.defaultColumnLabelMargin;
                     // Try to honor the position, but if the label doesn't fit where specified, then swap the position.
                    if (outsidePosition <= 0) {
                        // Inside position, if color didn't override, then the color is white
                        d.labelFill = labelSettings.overrideDefaultColor ? d.labelFill : dataLabelUtils.defaultInsideLabelColor;
                        return insidePosition;
                    }
                    return outsidePosition;
                    
                },
            };
    }
    }

    export class ClusteredBarChartStrategy implements IColumnChartStrategy {
        private static classes = {
            item: {
                class: 'bar',
                selector: '.bar'
            },
        };

        private data: ColumnChartData;
        private graphicsContext: ColumnChartContext;
        private seriesOffsetScale: D3.Scale.OrdinalScale;
        private width: number;
        private height: number;
        private margin: IMargin;
        private xProps: IAxisProperties;
        private yProps: IAxisProperties;
        private categoryLayout: CategoryLayout;
        private viewportHeight: number;

        private barsCenters: number[];
        private columnSelectionLineHandle: D3.Selection;
        private animator: IColumnChartAnimator;
        private interactivityService: IInteractivityService;

        public setupVisualProps(barChartProps: ColumnChartContext): void {
            this.graphicsContext = barChartProps;
            this.margin = barChartProps.margin;
            this.width = this.graphicsContext.width;
            this.height = this.graphicsContext.height;
            this.categoryLayout = barChartProps.layout;
            this.animator = barChartProps.animator;
            this.interactivityService = barChartProps.interactivityService;
            this.viewportHeight = barChartProps.viewportHeight;
        }

        public setData(data: ColumnChartData) {
            this.data = data;
        }

        public setYScale(is100Pct: boolean, forcedTickCount?: number, forcedYDomain?: any[]): IAxisProperties {
            var height = this.height;
            var forcedYMin, forcedYMax;

            if (forcedYDomain && forcedYDomain.length === 2) {
                forcedYMin = forcedYDomain[0];
                forcedYMax = forcedYDomain[1];
            }

            var props = this.yProps = ColumnUtil.getCategoryAxis(
                this.data,
                height,
                this.categoryLayout,
                true,
                forcedYMin,
                forcedYMax
                );

            // create clustered offset scale
            var seriesLength = this.data.series.length;
            var columnWidth = (this.categoryLayout.categoryThickness * (1 - CartesianChart.InnerPaddingRatio)) / seriesLength;
            this.seriesOffsetScale = d3.scale.ordinal()
                .domain(this.data.series.map(s => s.index))
                .rangeBands([0, seriesLength * columnWidth]);

            return props;
        }

        public setXScale(is100Pct: boolean, forcedTickCount?: number, forcedXDomain?: any[]): IAxisProperties {
            debug.assert(!is100Pct, 'Cannot have 100% clustered chart.');
            debug.assert(forcedTickCount === undefined, 'Cannot have clustered bar chart as combo chart.');            

            var width = this.width;
            var height = this.viewportHeight;

            var valueDomain = AxisHelper.createValueDomain(this.data.series, true);
            var bestTickCount = AxisHelper.getBestNumberOfTicks(valueDomain[0], valueDomain[1], this.data.valuesMetadata, AxisHelper.getRecommendedNumberOfTicksForXAxis(width));
            var normalizedRange = AxisHelper.normalizeLinearDomain({ min: valueDomain[0], max: valueDomain[1] });
            valueDomain = [normalizedRange.min, normalizedRange.max];

            var combinedDomain = AxisHelper.combineDomain(forcedXDomain, valueDomain);

            var xScale = d3.scale.linear()
                .range([0, width])
                .domain(combinedDomain)
                .nice(bestTickCount || undefined)
                .clamp(AxisHelper.scaleShouldClamp(combinedDomain, valueDomain));

            ColumnUtil.normalizeInfinityInScale(xScale);

            var xTickValues: any[] = AxisHelper.getRecommendedTickValuesForALinearRange(bestTickCount, xScale);

            var xAxis = d3.svg.axis()
                .scale(xScale)
                .tickSize(-height, 0)
                .tickValues(xTickValues);

            var xInterval = ColumnChart.getTickInterval(xTickValues);
            var xFormatter = ClusteredUtil.createValueFormatter(
                this.data.valuesMetadata,
                xInterval);
            xAxis.tickFormat(xFormatter.format);

            var values = xTickValues.map((d: ColumnChartDataPoint) => xFormatter.format(d));

            var xProps = this.xProps = {
                axis: xAxis,
                scale: xScale,
                formatter: xFormatter,
                values: values,
                axisType: ValueType.fromDescriptor({ numeric: true }),
                axisLabel: null,
                isCategoryAxis: false
            };

            return xProps;
        }

        public drawColumns(useAnimation: boolean): D3.Selection {
            var data = this.data;
            debug.assertValue(data, 'data could not be null or undefined');

            this.barsCenters = null; // invalidate the columnsCenters so that will be calculated again

            var categoryWidth = (this.categoryLayout.categoryThickness * (1 - CartesianChart.InnerPaddingRatio));
            var columnWidth = categoryWidth / data.series.length;
            var axisOptions: ColumnAxisOptions = {
                columnWidth: columnWidth,
                categoryWidth: categoryWidth,
                xScale: this.xProps.scale,
                yScale: this.yProps.scale,
                seriesOffsetScale: this.seriesOffsetScale,
                isScalar: this.categoryLayout.isScalar,
                margin: this.margin,
            };
            var clusteredBarLayout = ClusteredBarChartStrategy.getLayout(data, axisOptions);
            var dataLabelSettings = data.labelSettings;
            var dataLabelLayout = null;
            if (dataLabelSettings != null) {
                dataLabelLayout = dataLabelUtils.getColumnChartLabelLayout(data, this.getLabelLayoutXY(axisOptions,this.width, dataLabelSettings), false, false, this.xProps.formatter, axisOptions);
            }

            var result: ColumnChartAnimationResult;
            var shapes: D3.UpdateSelection;
            var series = ColumnUtil.drawSeries(data, this.graphicsContext.mainGraphicsContext, axisOptions);
            if (this.animator && useAnimation) {
                result = this.animator.animate({
                    viewModel: data,
                    series: series,
                    layout: clusteredBarLayout,
                    itemCS: ClusteredBarChartStrategy.classes.item,
                    interactivityService: this.interactivityService,
                    labelGraphicsContext: this.graphicsContext.mainGraphicsContext,
                    labelLayout: dataLabelLayout,
                    viewPort: { height: this.height, width: this.width }
                });
                shapes = result.shapes;
            }
            if (!this.animator || !useAnimation || result.failed) {
                shapes = ColumnUtil.drawDefaultShapes(data, series, clusteredBarLayout, ClusteredBarChartStrategy.classes.item, !this.animator);
                if (dataLabelLayout !== null) {
                    if (dataLabelSettings.show) {
                        ColumnUtil.drawDefaultLabels(series, this.graphicsContext.mainGraphicsContext, dataLabelLayout, { height: this.height, width: this.width });
                }
                    else {
                        dataLabelUtils.cleanDataLabels(this.graphicsContext.mainGraphicsContext);
                    }
            }
            }

            ColumnUtil.applyInteractivity(shapes, this.graphicsContext.onDragStart);

            return shapes;
        }

        public selectColumn(selectedColumnIndex: number, lastSelectedColumnIndex: number): void {
            ColumnUtil.setChosenColumnOpacity(this.graphicsContext.mainGraphicsContext, ClusteredBarChartStrategy.classes.item.selector, selectedColumnIndex, lastSelectedColumnIndex);
            this.moveHandle(selectedColumnIndex);
        }

        public getClosestColumnIndex(x: number, y: number): number {
            return ColumnUtil.getClosestColumnIndex(y, this.getBarsCenters());
        }

        /** Get the chart's columns centers (y value) */
        private getBarsCenters(): number[] {
            if (!this.barsCenters) { // lazy creation
                var barWidth: number = this.categoryLayout.categoryThickness * (1 - CartesianChart.InnerPaddingRatio);
                // use the axis scale and first series data to get category centers
                if (this.data.series.length > 0) {
                    var yScaleOffset = 0;
                    if (!this.categoryLayout.isScalar)
                        yScaleOffset = barWidth / 2;
                    var firstSeries = this.data.series[0];
                    this.barsCenters = firstSeries.data.map(d => this.yProps.scale(this.categoryLayout.isScalar ? d.categoryValue : d.categoryIndex) + yScaleOffset);
                }
            }
            return this.barsCenters;
        }

        private moveHandle(selectedColumnIndex: number) {
            var barCenters = this.getBarsCenters();
            var y = barCenters[selectedColumnIndex];

            if (!this.columnSelectionLineHandle) {
                var handle = this.columnSelectionLineHandle = this.graphicsContext.mainGraphicsContext.append('g');
                handle.append('line')
                    .classed('interactive-hover-line', true)
                    .attr({
                    x1: 0,
                    x2: this.width,
                    y1: y,
                    y2: y,
                });
                handle.append('circle')
                    .attr({
                    cx: 0,
                    cy: y,
                    r: '6px',
                })
                    .classed('drag-handle', true);
            }
            else {
                var handle = this.columnSelectionLineHandle;
                handle.select('line').attr({ y1: y, y2: y });
                handle.select('circle').attr({ cy: y });
            }
        }

        public static getLayout(data: ColumnChartData, axisOptions: ColumnAxisOptions): IColumnLayout {
            var columnWidth = axisOptions.columnWidth;
            var halfColumnWidth = 0.5 * columnWidth;
            var quarterColumnWidth = halfColumnWidth / 2;
            var isScalar = axisOptions.isScalar;
            var xScale = axisOptions.xScale;
            var yScale = axisOptions.yScale;
            var seriesOffsetScale = axisOptions.seriesOffsetScale;
            var scaledX0 = xScale(0);
            var xScaleOffset = 0;

            if (isScalar)
                xScaleOffset = axisOptions.categoryWidth / 2;

            return {
                shapeLayout: {
                    width: (d: ColumnChartDataPoint) => Math.abs(AxisHelper.diffScaled(xScale, 0, d.value)),
                    x: (d: ColumnChartDataPoint) => scaledX0 + AxisHelper.diffScaled(xScale, Math.min(0, d.value), 0),
                    y: (d: ColumnChartDataPoint) => yScale(isScalar ? d.categoryValue : d.categoryIndex) + seriesOffsetScale(d.seriesIndex) - xScaleOffset + (d.drawThinner ? quarterColumnWidth : 0),
                    height: (d: ColumnChartDataPoint) => d.drawThinner ? halfColumnWidth : columnWidth,
                },
                shapeLayoutWithoutHighlights: {
                    width: (d: ColumnChartDataPoint) => Math.abs(AxisHelper.diffScaled(xScale, 0, d.originalValue)),
                    x: (d: ColumnChartDataPoint) => scaledX0 + AxisHelper.diffScaled(xScale, Math.min(0, d.originalValue), 0),
                    y: (d: ColumnChartDataPoint) => yScale(isScalar ? d.categoryValue : d.categoryIndex) + seriesOffsetScale(d.seriesIndex) - xScaleOffset,
                    height: (d: ColumnChartDataPoint) => columnWidth,
                },
                zeroShapeLayout: {
                    width: (d: ColumnChartDataPoint) => 0,
                    x: (d: ColumnChartDataPoint) => scaledX0 + AxisHelper.diffScaled(xScale, Math.min(0, d.value), 0),
                    y: (d: ColumnChartDataPoint) => yScale(isScalar ? d.categoryValue : d.categoryIndex) + seriesOffsetScale(d.seriesIndex) - xScaleOffset + (d.drawThinner ? quarterColumnWidth : 0),
                    height: (d: ColumnChartDataPoint) => d.drawThinner ? halfColumnWidth : columnWidth,
                },
            };
        }

        private getLabelLayoutXY(axisOptions: ColumnAxisOptions, visualWidth: number, labelSettings: VisualDataLabelsSettings): any{
            var columnWidth = axisOptions.columnWidth;
            var halfColumnWidth = 0.5 * columnWidth;
            var quarterColumnWidth = halfColumnWidth / 2;
            var isScalar = axisOptions.isScalar;
            var xScale = axisOptions.xScale;
            var yScale = axisOptions.yScale;
            var seriesOffsetScale = axisOptions.seriesOffsetScale;
            var xScaleOffset = 0;
            var scaledX0 = xScale(0);

            if (isScalar)
                xScaleOffset = axisOptions.categoryWidth / 2;

            return {
                x: (d: ColumnChartDataPoint) => {
                    var properties: TextProperties = {
                        text: d.labeltext,
                        fontFamily: dataLabelUtils.LabelTextProperties.fontFamily,
                        fontSize: dataLabelUtils.LabelTextProperties.fontSize,
                        fontWeight: dataLabelUtils.LabelTextProperties.fontWeight,
                    };
                    var textWidth = TextMeasurementService.measureSvgTextWidth(properties);
                    var outsidePosition = scaledX0 + AxisHelper.diffScaled(xScale, Math.max(0, d.value), 0) + dataLabelUtils.defaultColumnLabelMargin;

                    // Try to honor the position, but if the label doesn't fit where specified, then swap the position.
                    if (outsidePosition + textWidth > visualWidth) {
                        // Inside position, if color didn't override, then the color is white
                        d.labelFill = labelSettings.overrideDefaultColor ? d.labelFill : dataLabelUtils.defaultInsideLabelColor;
                        return scaledX0 + AxisHelper.diffScaled(xScale, Math.max(0, d.value), 0) / 2 - (textWidth / 2);
                    }
                    return outsidePosition;
                },
                y: (d: ColumnChartDataPoint) => yScale(isScalar ? d.categoryValue : d.categoryIndex) + seriesOffsetScale(d.seriesIndex) - xScaleOffset + (d.drawThinner ? quarterColumnWidth : 0) + halfColumnWidth + dataLabelUtils.defaultColumnHalfLabelHeight,
            };                                         
        }

    }
} 
