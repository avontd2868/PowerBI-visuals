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
    export class StackedColumnChartStrategy implements IColumnChartStrategy {
        private static classes = {
            item: {
                class: 'column',
                selector: '.column'
            },
            highlightItem: {
                class: 'highlightColumn',
                selector: '.highlightColumn'
            },
        };

        private data: ColumnChartData;
        private graphicsContext: ColumnChartContext;
        private width: number; height: number;
        private margin: IMargin;
        private xProps: IAxisProperties;
        private yProps: IAxisProperties;
        private categoryLayout: CategoryLayout;
        private columnsCenters: number[];
        private columnSelectionLineHandle: D3.Selection;
        private animator: IColumnChartAnimator;
        private interactivityService: IInteractivityService;
        private viewportHeight: number

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

            props.xLabelMaxWidth = this.categoryLayout.isScalar ? (width / props.values.length) : this.categoryLayout.categoryThickness;

            return props;
        }

        public setYScale(is100Pct: boolean, forcedTickCount?: number, forcedYDomain?: any[]): IAxisProperties {
            var height = this.viewportHeight;
            var yProps = this.yProps = StackedUtil.getValueAxis(
                this.data,
                is100Pct,
                height,
                [height, 0],
                forcedTickCount,
                forcedYDomain);

            return yProps;
        }

        public drawColumns(useAnimation: boolean): D3.Selection {
            var data = this.data;
            debug.assertValue(data, 'data should not be null or undefined');

            this.columnsCenters = null; // invalidate the columnsCenters so that will be calculated again

            var axisOptions: ColumnAxisOptions = {
                columnWidth: this.categoryLayout.categoryThickness * (1 - CartesianChart.InnerPaddingRatio),
                xScale: this.xProps.scale,
                yScale: this.yProps.scale,
                isScalar: this.categoryLayout.isScalar,
                margin: this.margin,
            };
            var stackedColumnLayout = StackedColumnChartStrategy.getLayout(data, axisOptions);
            var dataLabelSettings = data.labelSettings;
            var dataLabelLayout = null;
            if (dataLabelSettings != null) {
                dataLabelLayout = dataLabelUtils.getColumnChartLabelLayout(data, this.getLabelLayoutXY(axisOptions, dataLabelSettings), true, this.graphicsContext.is100Pct, this.yProps.formatter, axisOptions);
            }

            var result: ColumnChartAnimationResult;
            var shapes: D3.UpdateSelection;
            var series = ColumnUtil.drawSeries(data, this.graphicsContext.mainGraphicsContext, axisOptions);
            if (this.animator && useAnimation) {
                result = this.animator.animate({
                    viewModel: data,
                    series: series,
                    layout: stackedColumnLayout,
                    itemCS: StackedColumnChartStrategy.classes.item,
                    interactivityService: this.interactivityService,
                    labelGraphicsContext: this.graphicsContext.mainGraphicsContext,
                    labelLayout: dataLabelLayout,
                    viewPort: { height: this.height, width: this.width }
            });
                shapes = result.shapes;
            }
            if (!this.animator || !useAnimation || result.failed) {
                shapes = ColumnUtil.drawDefaultShapes(data, series, stackedColumnLayout, StackedColumnChartStrategy.classes.item, !this.animator);
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
            ColumnUtil.setChosenColumnOpacity(this.graphicsContext.mainGraphicsContext, StackedColumnChartStrategy.classes.item.selector, selectedColumnIndex, lastSelectedColumnIndex);
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
            var isScalar = axisOptions.isScalar;
            var xScale = axisOptions.xScale;
            var yScale = axisOptions.yScale;
            var scaledY0 = yScale(0);
            var xScaleOffset = 0;

            if (isScalar)
                xScaleOffset = columnWidth / 2;

            return {
                shapeLayout: {
                    width: (d: ColumnChartDataPoint, i) => columnWidth,
                    x: (d: ColumnChartDataPoint, i) => xScale(isScalar ? d.categoryValue : d.categoryIndex) - xScaleOffset,
                    y: (d: ColumnChartDataPoint, i) => scaledY0 + AxisHelper.diffScaled(yScale, d.position, 0),
                    height: (d: ColumnChartDataPoint, i) => StackedUtil.getSize(yScale, d.valueAbsolute)
                },
                shapeLayoutWithoutHighlights: {
                    width: (d: ColumnChartDataPoint, i) => columnWidth,
                    x: (d: ColumnChartDataPoint, i) => xScale(isScalar ? d.categoryValue : d.categoryIndex) - xScaleOffset,
                    y: (d: ColumnChartDataPoint, i) => scaledY0 + AxisHelper.diffScaled(yScale, d.originalPosition, 0),
                    height: (d: ColumnChartDataPoint, i) => StackedUtil.getSize(yScale, d.originalValueAbsolute)
                },
                zeroShapeLayout: {
                    width: (d: ColumnChartDataPoint, i) => columnWidth,
                    x: (d: ColumnChartDataPoint, i) => xScale(isScalar ? d.categoryValue : d.categoryIndex) - xScaleOffset,
                    y: (d: ColumnChartDataPoint, i) => scaledY0 + AxisHelper.diffScaled(yScale, d.position, 0) + StackedUtil.getSize(yScale, d.valueAbsolute),
                    height: (d: ColumnChartDataPoint, i) => 0
                },
            };
        }

        private getLabelLayoutXY(axisOptions: ColumnAxisOptions, labelSettings: VisualDataLabelsSettings): any {
            var columnWidth = axisOptions.columnWidth;
            var halfColumnWidth = 0.5 * columnWidth;
            var isScalar = axisOptions.isScalar;
            var xScale = axisOptions.xScale;
            var yScale = axisOptions.yScale;
            var xScaleOffset = 0;
            var scaledY0 = yScale(0);
            var is100Pct = this.graphicsContext.is100Pct;
            var labelLayoutY = this.getLabelLayoutY;

            if (isScalar)
                xScaleOffset = halfColumnWidth;

            return {
                x: (d: ColumnChartDataPoint) => xScale(isScalar ? d.categoryValue : d.categoryIndex) - xScaleOffset + halfColumnWidth,
                y: (d: ColumnChartDataPoint) => labelLayoutY(d, is100Pct, scaledY0, yScale, labelSettings)
            };
        }

        private getLabelLayoutY(d: ColumnChartDataPoint, is100Pct: boolean, scaledY0: number, yScale: D3.Scale.Scale, labelSettings: VisualDataLabelsSettings): number {
            var insidePosition = scaledY0 + AxisHelper.diffScaled(yScale, d.position, 0) + StackedUtil.getSize(yScale, d.valueAbsolute) / 2 + dataLabelUtils.defaultColumnHalfLabelHeight;
            var outsidePosition = scaledY0 + AxisHelper.diffScaled(yScale, d.position, 0) - dataLabelUtils.defaultColumnLabelMargin;
                                
            //Hundrand-percent label position is center by default, and labels on stacked bar that are not last series
            if (is100Pct || !d.lastSeries)
                return insidePosition;
            // Try to honor the position, but if the label doesn't fit where specified, then swap the position.
            if (outsidePosition <= 0) {
                // Inside position, if color didn't override, then the color is white
                d.labelFill = labelSettings.overrideDefaultColor ? d.labelFill : dataLabelUtils.defaultInsideLabelColor;
                return insidePosition;
            }
            return outsidePosition;
        }
    }

    export class StackedBarChartStrategy implements IColumnChartStrategy {
        private static classes = {
            item: {
                class: 'bar',
                selector: '.bar'
            },
            highlightItem: {
                class: 'highlightBar',
                selector: '.highlightBar'
            },
        };

        private data: ColumnChartData;
        private graphicsContext: ColumnChartContext;
        private width: number; height: number;
        private margin: IMargin;
        private xProps: IAxisProperties;
        private yProps: IAxisProperties;
        private categoryLayout: CategoryLayout;
        private barsCenters: number[];
        private columnSelectionLineHandle: D3.Selection;
        private animator: IColumnChartAnimator;
        private interactivityService: IInteractivityService;
        private viewportHeight: number;

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
                forcedYMax);

            return props;
        }

        public setXScale(is100Pct: boolean, forcedTickCount?: number, forcedXDomain?: any[]): IAxisProperties {
            debug.assert(forcedTickCount === undefined, 'Cannot have stacked bar chart as combo chart.');

            var height = this.viewportHeight;
           
            var xProps = this.xProps = StackedUtil.getValueAxis(
                this.data,
                is100Pct,
                this.width,
                [0, this.width],
                undefined,
                forcedXDomain);

            xProps.axis.tickSize(-height, 0);

            return xProps;
        }

        public drawColumns(useAnimation: boolean): D3.Selection {
            var data = this.data;
            debug.assertValue(data, 'data should not be null or undefined');

            this.barsCenters = null; // invalidate the barsCenters so that will be calculated again

            var axisOptions: ColumnAxisOptions = {
                columnWidth: this.categoryLayout.categoryThickness * (1 - CartesianChart.InnerPaddingRatio),
                xScale: this.xProps.scale,
                yScale: this.yProps.scale,
                isScalar: this.categoryLayout.isScalar,
                margin: this.margin,
            };
            var stackedBarLayout = StackedBarChartStrategy.getLayout(data, axisOptions);
            var dataLabelSettings = data.labelSettings;
            var dataLabelLayout = null;
            if (dataLabelSettings != null) {
                dataLabelLayout = dataLabelUtils.getColumnChartLabelLayout(data, this.getLabelLayoutXY(axisOptions, this.width, dataLabelSettings), false, this.graphicsContext.is100Pct, this.xProps.formatter, axisOptions);
            }

            var result: ColumnChartAnimationResult;
            var shapes: D3.UpdateSelection;
            var series = ColumnUtil.drawSeries(data, this.graphicsContext.mainGraphicsContext, axisOptions);
            if (this.animator && useAnimation) {
                result = this.animator.animate({
                    viewModel: data,
                    series: series,
                    layout: stackedBarLayout,
                    itemCS: StackedBarChartStrategy.classes.item,
                    interactivityService: this.interactivityService,
                    labelGraphicsContext: this.graphicsContext.mainGraphicsContext,
                    labelLayout: dataLabelLayout,
                    viewPort: { height: this.height, width: this.width }
            });
                shapes = result.shapes;
            }
            if (!this.animator || !useAnimation || result.failed) {
                shapes = ColumnUtil.drawDefaultShapes(data, series, stackedBarLayout, StackedBarChartStrategy.classes.item, !this.animator);
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

        public selectColumn(selectedColumnIndex: number, lastInteractiveSelectedColumnIndex: number): void {
            ColumnUtil.setChosenColumnOpacity(this.graphicsContext.mainGraphicsContext, StackedBarChartStrategy.classes.item.selector, selectedColumnIndex, lastInteractiveSelectedColumnIndex);
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
                    y2: y
                });
                handle.append('circle')
                    .classed('drag-handle', true)
                    .attr({
                    cx: 0,
                    cy: y,
                    r: '6px',
                });

            }
            else {
                var handle = this.columnSelectionLineHandle;
                handle.select('line').attr({ y1: y, y2: y });
                handle.select('circle').attr({ cy: y });
            }
        }

        public static getLayout(data: ColumnChartData, axisOptions: ColumnAxisOptions): IColumnLayout {
            var columnWidth = axisOptions.columnWidth;
            var isScalar = axisOptions.isScalar;
            var xScale = axisOptions.xScale;
            var yScale = axisOptions.yScale;
            var scaledX0 = xScale(0);
            var xScaleOffset = 0;

            if (isScalar)
                xScaleOffset = columnWidth / 2;

            return {
                shapeLayout: {
                    width: (d: ColumnChartDataPoint, i) => -StackedUtil.getSize(xScale, d.valueAbsolute),
                    x: (d: ColumnChartDataPoint, i) => scaledX0 + AxisHelper.diffScaled(xScale, d.position - d.valueAbsolute, 0),
                    y: (d: ColumnChartDataPoint, i) => yScale(isScalar ? d.categoryValue : d.categoryIndex) - xScaleOffset,
                    height: (d: ColumnChartDataPoint, i) => columnWidth,
                },
                shapeLayoutWithoutHighlights: {
                    width: (d: ColumnChartDataPoint, i) => -StackedUtil.getSize(xScale, d.originalValueAbsolute),
                    x: (d: ColumnChartDataPoint, i) => scaledX0 + AxisHelper.diffScaled(xScale, d.originalPosition - d.originalValueAbsolute, 0),
                    y: (d: ColumnChartDataPoint, i) => yScale(isScalar ? d.categoryValue : d.categoryIndex) - xScaleOffset,
                    height: (d: ColumnChartDataPoint, i) => columnWidth,
                },
                zeroShapeLayout: {
                    width: (d: ColumnChartDataPoint, i) => 0,
                    x: (d: ColumnChartDataPoint, i) => scaledX0 + AxisHelper.diffScaled(xScale, d.position - d.valueAbsolute, 0),
                    y: (d: ColumnChartDataPoint, i) => yScale(isScalar ? d.categoryValue : d.categoryIndex) - xScaleOffset,
                    height: (d: ColumnChartDataPoint, i) => columnWidth,
                },
            };
        }

        private getLabelLayoutXY(axisOptions: ColumnAxisOptions, visualWidth: number, labelSettings: VisualDataLabelsSettings): any {
            var columnWidth = axisOptions.columnWidth;
            var halfColumnWidth = 0.5 * columnWidth;
            var isScalar = axisOptions.isScalar;
            var xScale = axisOptions.xScale;
            var yScale = axisOptions.yScale;
            var xScaleOffset = 0;
            var scaledX0 = xScale(0);
            var is100Pct = this.graphicsContext.is100Pct;

            if (isScalar)
                xScaleOffset = halfColumnWidth;

            return {
                x: (d: ColumnChartDataPoint) => {
                        var properties: TextProperties = {
                            text: d.labeltext,
                            fontFamily: dataLabelUtils.LabelTextProperties.fontFamily,
                            fontSize: dataLabelUtils.LabelTextProperties.fontSize,
                            fontWeight: dataLabelUtils.LabelTextProperties.fontWeight,
                        };
                        var textWidth = TextMeasurementService.measureSvgTextWidth(properties);
                    var insidePosition = scaledX0 + Math.abs(AxisHelper.diffScaled(xScale, 0, d.originalValue)) +
                            AxisHelper.diffScaled(xScale, d.position - d.valueAbsolute, 0) + StackedUtil.getSize(xScale, d.valueAbsolute) / 2 - (textWidth / 2);
                    var outsidePosition = scaledX0 + Math.abs(AxisHelper.diffScaled(xScale, 0, d.originalValue)) +
                        AxisHelper.diffScaled(xScale, d.position - d.valueAbsolute, 0) + dataLabelUtils.defaultColumnLabelMargin;
                    //Hundrand-percent label position is center by default, and labels on stacked bar that are not last series
                    if (is100Pct || !d.lastSeries)
                        return insidePosition;

                    // Try to honor the position, but if the label doesn't fit where specified, then swap the position.
                    if (outsidePosition + textWidth > visualWidth) {
                        // Inside position, if color didn't override, then the color is white
                        d.labelFill = labelSettings.overrideDefaultColor ? d.labelFill : dataLabelUtils.defaultInsideLabelColor;
                        return insidePosition;
                    }

                       
                    return outsidePosition;
                }                ,
                y: (d: ColumnChartDataPoint) => yScale(isScalar ? d.categoryValue : d.categoryIndex) - xScaleOffset + halfColumnWidth + dataLabelUtils.defaultColumnHalfLabelHeight,
            };
        }
    }
} 