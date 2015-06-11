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
    export enum DragType {
        Drag,
        DragEnd
    }

    interface MouseCoordinates {
        x: number;
        y: number;
    }

    export interface ScatterBehaviorOptions {
        host: ICartesianVisualHost;
        root: D3.Selection;
        mainContext: D3.Selection;
        background: D3.Selection;
        clearCatcher: D3.Selection;
        dataPointsSelection: D3.Selection;
        data: ScatterChartData;
        visualInitOptions: VisualInitOptions;
        xAxisProperties: IAxisProperties;
        yAxisProperties: IAxisProperties;
    }

    export class ScatterChartWebBehavior {
        public select(hasSelection: boolean, datapoints: D3.Selection) {
            datapoints.style("fill-opacity", (d: ScatterChartDataPoint) => d.size != null ? ScatterChart.getBubbleOpacity(d, hasSelection) : 0);
            datapoints.style("stroke-opacity",(d: ScatterChartDataPoint) => ScatterChart.getBubbleOpacity(d, hasSelection));
        }
    }

    export class ScatterChartMobileBehavior {
        private static CrosshairClassName = 'crosshair';
        private static ScatterChartCircleTagName = 'circle';
        private static DotClassName = 'dot';
        private static DotClassSelector = '.' + ScatterChartMobileBehavior.DotClassName;

        private static Horizontal: ClassAndSelector = {
            class: 'horizontal',
            selector: '.horizontal'
        };
        private static Vertical: ClassAndSelector = {
            class: 'vertical',
            selector: '.vertical'
        };

        private host: ICartesianVisualHost;
        private mainGraphicsContext: D3.Selection;
        private data: ScatterChartData;
        private crosshair: D3.Selection;
        private crosshairHorizontal: D3.Selection;
        private crosshairVertical: D3.Selection;
        private lastDotIndex: number;
        private xAxisProperties: IAxisProperties;
        private yAxisProperties: IAxisProperties;

        public setOptions(options: ScatterBehaviorOptions) {
            this.data = options.data;
            this.mainGraphicsContext = options.mainContext;
            this.xAxisProperties = options.xAxisProperties;
            this.yAxisProperties = options.yAxisProperties;
            this.host = options.host;
        }

        public select(hasSelection: boolean, datapoints: D3.Selection, dataPoint: SelectableDataPoint, index: number) {
            this.selectDotByIndex(index);
        }

        public selectRoot() {
            var marker = jsCommon.PerformanceUtil.create('selectRoot');
            this.onClick();
            marker.end();
        }

        public drag(t: DragType) {
            switch (t) {
                case DragType.Drag:
                    this.onDrag();
                    break;
                case DragType.DragEnd:
                    this.onClick();
                    break;
                default:
                    debug.assertFail('Unknown Drag Type');
            }
        }

        private onDrag(): void {
            //find the current x and y position
            var xy = this.getMouseCoordinates();
            //move the crosshair to the current position
            this.moveCrosshairToXY(xy.x, xy.y);
            //update the style and the legend of the dots
            var selectedIndex = this.findClosestDotIndex(xy.x, xy.y);
            this.selectDot(selectedIndex);
            this.updateLegend(selectedIndex);
        }

        private onClick(): void {
            //find the current x and y position
            var xy = this.getMouseCoordinates();
            var selectedIndex = this.findClosestDotIndex(xy.x, xy.y);
            this.selectDotByIndex(selectedIndex);
        }

        private getMouseCoordinates(): MouseCoordinates {
            var mainGfxContext = this.mainGraphicsContext;
            // select (0,0) in cartesian coordinates
            var x = 0;
            var y = parseInt(mainGfxContext.attr('height'), 10);
            y = y || 0;

            try {
                var mouse = d3.mouse(mainGfxContext.node());
                x = mouse[0];
                y = mouse[1];
            } catch(e){ 
            }

            return { x: x, y: y, };
        }

        private selectDotByIndex(index: number): void {
            this.selectDot(index);
            this.moveCrosshairToIndexDot(index);
            this.updateLegend(index);
        }

        private selectDot(dotIndex: number): void {
            var root = this.mainGraphicsContext;

            root.selectAll(ScatterChartMobileBehavior.ScatterChartCircleTagName + ScatterChartMobileBehavior.DotClassSelector).classed({ selected: false, notSelected: true });
            root.selectAll(ScatterChartMobileBehavior.ScatterChartCircleTagName + ScatterChartMobileBehavior.DotClassSelector).filter((d, i) => {
                var dataPoints = this.data.dataPoints;
                debug.assert(dataPoints.length > dotIndex, "dataPoints length:" + dataPoints.length + "is smaller than index:" + dotIndex);
                var currentPoint: ScatterChartDataPoint = dataPoints[dotIndex];
                return (d.x === currentPoint.x) && (d.y === currentPoint.y);
            }).classed({ selected: true, notSelected: false });
        }

        private moveCrosshairToIndexDot(index: number): void {
            var dataPoints = this.data.dataPoints;
            var root = this.mainGraphicsContext;

            debug.assert(dataPoints.length > index, "dataPoints length:" + dataPoints.length + "is smaller than index:" + index);
            var x = this.xAxisProperties.scale(dataPoints[index].x);
            var y = this.yAxisProperties.scale(dataPoints[index].y);
            if (this.crosshair == null) {
                var width = +root.attr('width');
                var height = +root.attr('height');
                this.crosshair = this.drawCrosshair(root, x, y, width, height);
                this.crosshairHorizontal = this.crosshair.select(ScatterChartMobileBehavior.Horizontal.selector);
                this.crosshairVertical = this.crosshair.select(ScatterChartMobileBehavior.Vertical.selector);
            } else {
                this.moveCrosshairToXY(x, y);
            }
        }

        private moveCrosshairToXY(x: number, y: number): void {
            this.crosshairHorizontal.attr({ y1: y, y2: y });
            this.crosshairVertical.attr({ x1: x, x2: x });
        }

        private drawCrosshair(addTo: D3.Selection, x: number, y: number, width: number, height: number): D3.Selection {
            var crosshair = addTo.append("g");
            crosshair.classed(ScatterChartMobileBehavior.CrosshairClassName, true);
            crosshair.append('line').classed(ScatterChartMobileBehavior.Horizontal.class, true).attr({ x1: 0, x2: width, y1: y, y2: y });
            crosshair.append('line').classed(ScatterChartMobileBehavior.Vertical.class, true).attr({ x1: x, x2: x, y1: height, y2: 0 });
            return crosshair;
        }

        private findClosestDotIndex(x: number, y: number): number {
            var selectedIndex = -1;
            var minDistance = Number.MAX_VALUE;
            var dataPoints = this.data.dataPoints;
            var xAxisPropertiesScale = this.xAxisProperties.scale;
            var yAxisPropertiesScale = this.yAxisProperties.scale;
            for (var i in dataPoints) {
                var currentPoint: ScatterChartDataPoint = dataPoints[i];
                var circleX = xAxisPropertiesScale(currentPoint.x);
                var circleY = yAxisPropertiesScale(currentPoint.y);
                var horizontalDistance = circleX - x;
                var verticalDistance = circleY - y;
                var distanceSqrd = (horizontalDistance * horizontalDistance) + (verticalDistance * verticalDistance);
                if (minDistance === Number.MAX_VALUE) {
                    selectedIndex = i;
                    minDistance = distanceSqrd;
                }
                else if (minDistance && minDistance > distanceSqrd) {
                    selectedIndex = i;
                    minDistance = distanceSqrd;
                }
            }
            return selectedIndex;
        }

        private updateLegend(dotIndex: number): void {
            if (this.lastDotIndex == null || this.lastDotIndex !== dotIndex) {//update the legend only if the data change.
                var legendItems = this.createLegendDataPoints(dotIndex);
                this.host.updateLegend(legendItems);
                this.lastDotIndex = dotIndex;
            }
        }

        private createLegendDataPoints(dotIndex: number): LegendData {
            var formatStringProp = scatterChartProps.general.formatString;
            var legendItems = [];
            var data = this.data;
            debug.assert(data.dataPoints.length > dotIndex, "dataPoints length:" + data.dataPoints.length + "is smaller than index:" + dotIndex);
            var point = data.dataPoints[dotIndex];
            //set the title of the legend to be the category or radius or group or blank
            var blank = valueFormatter.format(null);
            var title = blank;
            var legendData = data.legendData;
            debug.assertValue(legendData, "legendData");
            debug.assertValue(legendData.dataPoints, "legendData");
            var legendDataPoints = legendData.dataPoints;
            if (point.category !== blank) {
                title = point.category;
            } else if (point.radius.sizeMeasure != null) {
                title = valueFormatter.format(point.radius.sizeMeasure.source.groupName);
            } else if (legendDataPoints.length >= dotIndex && legendDataPoints[dotIndex].label !== blank) {
                title = legendDataPoints[dotIndex].label;
            }
            if (data.xCol != null) {
                legendItems.push({
                    category: title,
                    color: point.fill,
                    icon: LegendIcon.Box,
                    label: valueFormatter.format(this.data.axesLabels.x),
                    measure: valueFormatter.format(point.x, valueFormatter.getFormatString(data.xCol, formatStringProp)),
                    iconOnlyOnLabel: true
                });
            }
            if (data.yCol !== undefined && data.yCol !== null) {
                legendItems.push({
                    category: title,
                    color: point.fill,
                    icon: LegendIcon.Box,
                    label: valueFormatter.format(data.axesLabels.y),
                    measure: valueFormatter.format(point.y, valueFormatter.getFormatString(data.yCol, formatStringProp)),
                    iconOnlyOnLabel: true
                });
            }
            if (data.size !== undefined && data.size !== null) {
                legendItems.push({
                    category: title,
                    color: point.fill,
                    icon: LegendIcon.Box,
                    label: valueFormatter.format(data.size.displayName),
                    measure: valueFormatter.format(point.radius.sizeMeasure.values[point.radius.index], valueFormatter.getFormatString(data.size, formatStringProp)),
                    iconOnlyOnLabel: true
                });
            }

            return {dataPoints: legendItems };
        }
    }
} 