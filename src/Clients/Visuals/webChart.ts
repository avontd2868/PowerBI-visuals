//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {

    import Point = D3.Geom.Point;

    interface MeasureData {
        name: string;
        minValue: number;
        maxValue: number;
        firstInstanceValue: number;
        secondInstanceValue?: number;
    }

    interface WebChartData {
        measureData: MeasureData[];
    }

    export class WebChart implements IVisual {
        private static VisualClassName = 'webChart';
        private static AxisGraphicsContextClassName = 'axisGraphicsContext';
        private static MainGraphicsContextClassName = 'mainGraphicsContext';

        private currentViewport: IViewport;
        private style: IVisualStyle;
        private element: JQuery;
        private data: WebChartData;
        private svg: D3.Selection;
        private mainGraphicsContext: D3.Selection;
        private axisGraphicsContext: D3.Selection;

        public static capabilities: VisualCapabilities = {
            dataRoles: [
                {
                    name: 'Category',
                    kind: VisualDataRoleKind.Grouping,
                }, {
                    name: 'Y',
                    kind: VisualDataRoleKind.Measure,
                }
            ],
        };

        public init(options: VisualInitOptions) {
            this.element = options.element;
            this.currentViewport = options.viewport;
            this.style = options.style;
        }

        public onDataChanged(options: VisualDataChangedOptions): void {
            debug.assertValue(options, 'options');

            var dataViews = options.dataViews;

            // TODO: The d3 code writes to the data.  Need to revisit whether we should clone or otherwise do this efficiently & correctly.
            this.data = this.converter(dataViews[0]);

            this.updateInternal();
        }

        public onResizing(viewport: IViewport, duration: number): void {
            this.currentViewport = viewport;
            this.updateInternal();
        }

        private converter(dataView: DataView): WebChartData {
            var measureCount = dataView.categorical.categories[0].values.length;
            var measureData: MeasureData[] = [];
            var measure1 = dataView.categorical.values[0];
            var measure2 = dataView.categorical.values[1];

            for (var i = 0; i < measureCount; i++) {
                measureData.push({
                    name: dataView.categorical.categories[0].values[i],
                    minValue: measure1.min,
                    maxValue: measure1.max,
                    firstInstanceValue: measure1.values[i],
                    secondInstanceValue: measure2.values[i],
                });

            }

            var chart: WebChartData = {
                measureData: measureData
            };

            return chart;
        }

        private updateInternal() {
            var chart = this.data;
            var height = this.currentViewport.height;
            var width = this.currentViewport.width;
            var element = this.element;
            var borderPaddingVertical = height * .16;
            var borderPaddingHorizontal = width * .16;
            var verticalRange = height - borderPaddingVertical * 2;
            var horizontalRange = width - borderPaddingHorizontal * 2;

            var centerPoint: Point = {
                x: borderPaddingHorizontal + horizontalRange / 2,
                y: borderPaddingVertical + verticalRange / 2,
            };
            var topPoint: Point = {
                x: borderPaddingHorizontal + horizontalRange / 2,
                y: borderPaddingVertical,
            };

            var outerWebShape = d3.svg.line()
                .x((d: number, i) => this.translateWebPoint(chart, topPoint, centerPoint, d, i).x)
                .y((d: number, i) => this.translateWebPoint(chart, topPoint, centerPoint, d, i).y);

            var innerWebLine = d3.svg.line()
                .x((angle: number, i) => i === 0 ? centerPoint.x : this.rotateWebPoint(topPoint, centerPoint, angle).x)
                .y((angle: number, i) => i === 0 ? centerPoint.y : this.rotateWebPoint(topPoint, centerPoint, angle).y);

            if (!this.svg) {
                this.svg = d3.select(element.get(0)).append('svg');
                element.addClass(WebChart.VisualClassName);
            }

            var svg = this.svg;

            if (this.axisGraphicsContext)
                this.axisGraphicsContext.remove();

            this.axisGraphicsContext = svg.append('g')
                .classed(WebChart.AxisGraphicsContextClassName, true);

            if (this.mainGraphicsContext)
                this.mainGraphicsContext.remove();

            this.mainGraphicsContext = svg.append('g')
                .classed(WebChart.MainGraphicsContextClassName, true);

            // Outer web shape
            var axisInput = chart.measureData.map(d => d.maxValue).concat([chart.measureData[0].maxValue]);
            this.axisGraphicsContext.append('path')
                .attr('d', outerWebShape(axisInput))
                .classed('webChartAxis', true);
            this.axisGraphicsContext.append('path')
                .attr('d', outerWebShape(axisInput.map((v, i) => this.getInterimValue(chart, i, 2 / 3))))
                .classed('webChartAxis', true);
            this.axisGraphicsContext.append('path')
                .attr('d', outerWebShape(axisInput.map((v, i) => this.getInterimValue(chart, i, 1 / 3))))
                .classed('webChartAxis', true);

            // Inner web lines
            for (var i = 0, len = chart.measureData.length; i < len; i++) {
                this.axisGraphicsContext.append('path')
                    .attr('d', innerWebLine([0, i * 2 * Math.PI / len]))
                    .classed('webChartAxis', true);

                this.axisGraphicsContext.append('svg:text')
                    .text(chart.measureData[i].name)
                    .classed('webChartTitleLabel', true)
                    .attr('x', this.getLabelPosition(topPoint, centerPoint, i * 2 * Math.PI / len).x)
                    .attr('y', this.getLabelPosition(topPoint, centerPoint, i * 2 * Math.PI / len).y)
                    .attr('text-anchor', this.getLabelAnchor(i * 2 * Math.PI / len));

                this.axisGraphicsContext.append('svg:text')
                    .text(chart.measureData[i].firstInstanceValue + ' vs. ' + chart.measureData[i].secondInstanceValue)
                    .classed('webChartValueLabel', true)
                    .attr('x', this.getLabelPosition(topPoint, centerPoint, i * 2 * Math.PI / len).x)
                    .attr('y', this.getLabelPosition(topPoint, centerPoint, i * 2 * Math.PI / len).y + 14)
                    .attr('text-anchor', this.getLabelAnchor(i * 2 * Math.PI / len));
            }

            // Data groups
            this.mainGraphicsContext.append('path')
                .attr('d', outerWebShape(chart.measureData.map(d => d.firstInstanceValue).concat(chart.measureData[0].firstInstanceValue)))
                .classed('firstInstance', true);
            this.mainGraphicsContext.append('path')
                .attr('d', outerWebShape(chart.measureData.map(d => d.secondInstanceValue).concat(chart.measureData[0].secondInstanceValue)))
                .classed('secondInstance', true);
        }

        private getInterimValue(chart: WebChartData, index: number, factor: number): number {
            index = index % chart.measureData.length;

            var result = chart.measureData[index].minValue + factor * (chart.measureData[index].maxValue - chart.measureData[index].minValue);
            return result;
        }

        private getLabelPosition(point: Point, center: Point, angle: number): Point {
            var rotatedPoint = this.rotateWebPoint(point, center, angle);
            var scaledPoint = this.scaleWebPoint(rotatedPoint, center, 1.1);
            if (angle === 0)
                scaledPoint.y = scaledPoint.y - 14;

            return scaledPoint;
        }

        private getLabelAnchor(angle: number): string {
            if (angle === 0 || angle === Math.PI)
                return 'middle';

            if (angle < Math.PI)
                return 'start';

            return 'end';
        }

        private translateWebPoint(chart: WebChartData, point: Point, center: Point, value: number, index: number): Point {
            var measureCount = chart.measureData.length;
            index = index % measureCount;
            var minValue = chart.measureData[index].minValue;
            var scaleFactor = (value - minValue) / (chart.measureData[index].maxValue - minValue);

            var result = this.scaleWebPoint(
                this.rotateWebPoint(point, center, index * 2 * Math.PI / measureCount),
                center,
                scaleFactor);

            return result;
        }

        private scaleWebPoint(point: Point, center: Point, scaleFactor: number): Point {
            var x = (point.x - center.x) * scaleFactor + center.x;
            var y = (point.y - center.y) * scaleFactor + center.y;

            var result: Point = {
                x: x,
                y: y
            };

            return result;
        }

        private rotateWebPoint(point: Point, center: Point, angle: number): Point {
            var x = (point.x - center.x) * Math.cos(angle) - (point.y - center.y) * Math.sin(angle) + center.x;
            var y = (point.x - center.x) * Math.sin(angle) + (point.y - center.y) * Math.cos(angle) + center.y;

            var result: Point = {
                x: x,
                y: y
            };

            return result;
        }
    }
}