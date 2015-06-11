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
    import EnumExtensions = jsCommon.EnumExtensions;

    var COMBOCHART_DOMAIN_OVERLAP_TRESHOLD_PERCENTAGE = 0.1;

    export enum CartesianChartType {
        Line,
        Area,
        ClusteredColumn,
        StackedColumn,
        ClusteredBar,
        StackedBar,
        HundredPercentStackedBar,
        HundredPercentStackedColumn,
        Scatter,
        ComboChart,
        DataDot,
        Waterfall,
        LineClusteredColumnCombo,
        LineStackedColumnCombo,
        DataDotClusteredColumnCombo,
        DataDotStackedColumnCombo
    }

    export interface CalculateScaleAndDomainOptions {
        viewport: IViewport;
        margin: IMargin;
        forcedTickCount?: number;
        forcedYDomain?: any[];
        forcedXDomain?: any[];
        showXLabel: boolean;
        showYLabel: boolean;
    }

    export interface MergedValueAxisResult {
        domain: number[];
        merged: boolean;
        tickCount: number;
        forceStartToZero: boolean;
    }

    export interface CartesianSmallViewPortProperties {
        hideLegendOnSmallViewPort: boolean;
        hideAxesOnSmallViewPort: boolean;
        MinHeightLegendVisible: number;
        MinHeightAxesVisible: number;
    }

    export interface CartesianConstructorOptions {
        chartType: CartesianChartType;
        isScrollable?: boolean;
        animator?: any;
        cartesianSmallViewPortProperties?: CartesianSmallViewPortProperties;
    }

    export interface ICartesianVisual {
        init(options: CartesianVisualInitOptions): void;
        setData(dataViews: DataView[]): void;
        calculateAxesProperties(options: CalculateScaleAndDomainOptions): IAxisProperties[];
        overrideXScale(xProperties: IAxisProperties): void;
        render(duration: number): void;
        calculateLegend(): LegendData;
        hasLegend(): boolean;
        onClearSelection(): void;
        enumerateObjectInstances? (options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[];
        getVisualCategoryAxisIsScalar? (): boolean;
        getSupportedCategoryAxisType? (): string;
        getPreferredPlotArea? (isScalar: boolean, categoryCount: number, categoryThickness: number): IViewport;
        setFilteredData? (startIndex: number, endIndex: number): CartesianData;
    }

    export interface CartesianDataPoint {
        categoryValue: any;
        value: number;
        categoryIndex: number;
        seriesIndex: number;
        highlight?: boolean;
    }

    export interface CartesianSeries {
        data: CartesianDataPoint[];
    }

    export interface CartesianData {
        series: CartesianSeries[];
        categoryMetadata: DataViewMetadataColumn;
        categories: any[];
        hasHighlights?: boolean;
    }

    export interface CartesianVisualInitOptions extends VisualInitOptions {
        svg: D3.Selection;
        cartesianHost: ICartesianVisualHost;
    }

    export interface ICartesianVisualHost {
        updateLegend(data: LegendData): void;
    }

    export interface ChartAxesLabels {
        x: string;
        y: string;
        y2?: string;
    }

    export enum AxisLinesVisibility {
        ShowLinesOnXAxis = 1,
        ShowLinesOnYAxis = 2,
        ShowLinesOnBothAxis = ShowLinesOnXAxis | ShowLinesOnYAxis,
    }

    export interface CategoryLayout {
        categoryCount: number;
        categoryThickness: number;
        outerPaddingRatio: number;
        isScalar?: boolean;
    }

    export interface CategoryLayoutOptions {
        availableWidth: number;
        categoryCount: number;
        domain: any;
        isScalar?: boolean;
        isScrollable?: boolean;
    }

    interface CartesianAxisProperties {
        x: IAxisProperties;
        y1: IAxisProperties;
        y2?: IAxisProperties;
        forceValueDomainStartToZero: boolean;
    }

    /** Renders a data series as a cartestian visual. */
    export class CartesianChart implements IVisual {
        public static MinOrdinalRectThickness = 20;
        public static MinScalarRectThickness = 2;
        public static OuterPaddingRatio = 0.4;
        public static InnerPaddingRatio = 0.2;

        private static ClassName = 'cartesianChart';
        private static AxisGraphicsContextClassName = 'axisGraphicsContext';
        private static MaxMarginFactor = 0.18;
        private static MinBottomMargin = 25;
        private static TopMargin = 8;
        private static LeftPadding = 10;
        private static RightPadding = 15;
        private static BottomPadding = 12;
        private static YAxisLabelPadding = 20;
        private static XAxisLabelPadding = 18;
        private static TickPaddingY = 10;
        private static TickPaddingRotatedX = 5;
        private static FontSize = 11;
        private static FontSizeString = SVGUtil.convertToPixelString(CartesianChart.FontSize);

        private axisGraphicsContext: D3.Selection;
        private xAxisGraphicsContext: D3.Selection;
        private y1AxisGraphicsContext: D3.Selection;
        private y2AxisGraphicsContext: D3.Selection;
        private element: JQuery;
        private svg: D3.Selection;
        private clearCatcher: D3.Selection;
        private margin: IMargin;
        private type: CartesianChartType;
        private hostServices: IVisualHostServices;
        private layers: ICartesianVisual[];
        private legend: ILegend;
        private legendMargins: IViewport;
        private layerLegendData: LegendData;
        private hasSetData: boolean;
        private visualInitOptions: VisualInitOptions;
        private legendObjectProperties: DataViewObject;
        private categoryAxisProperties: DataViewObject;
        private valueAxisProperties: DataViewObject;
        private cartesianSmallViewPortProperties: CartesianSmallViewPortProperties;
        private interactivityService: IInteractivityService;
        private y2AxesRendered: boolean;
        private categoryAxisHasUnitType: boolean;
        private valueAxisHasUnitType: boolean;
        private hasCategoryAxis: boolean;
        private yAxisIsCategorical: boolean;
        private secValueAxisHasUnitType: boolean;
        private yAxisOrientation: string;
        private bottomMarginLimit: number;
        private leftMarginLimit: number;
        private needRotate: boolean;
        public animator: any;

        // Scrollbar related
        private isScrollable: boolean;
        private scrollY: boolean;
        private scrollX: boolean;
        private isXScrollBarVisible: boolean;
        private isYScrollBarVisible: boolean;
        private svgScrollable: D3.Selection;
        private axisGraphicsContextScrollable: D3.Selection;
        private brushGraphicsContext: D3.Selection;
        private brushContext: D3.Selection;
        private brush: D3.Svg.Brush;
        private static ScrollBarWidth = 10;
        private static fillOpacity = 0.125;
        private duration: number;
        private brushMinExtent: number;

        // TODO: Remove onDataChanged & onResizing once all visuals have implemented update.
        private dataViews: DataView[];
        private currentViewport: IViewport;

        private static getAxisVisibility(type: CartesianChartType): AxisLinesVisibility {
            switch (type) {
                case CartesianChartType.StackedBar:
                case CartesianChartType.ClusteredBar:
                case CartesianChartType.HundredPercentStackedBar:
                    return AxisLinesVisibility.ShowLinesOnXAxis;
                case CartesianChartType.Scatter:
                    return AxisLinesVisibility.ShowLinesOnBothAxis;
                default:
                    return AxisLinesVisibility.ShowLinesOnYAxis;
            }
        }

        constructor(options: CartesianConstructorOptions) {
            this.isScrollable = false;
            if (options) {
                this.type = options.chartType;
                if (options.isScrollable)
                    this.isScrollable = options.isScrollable;
                this.animator = options.animator;
                if (options.cartesianSmallViewPortProperties) {
                    this.cartesianSmallViewPortProperties = options.cartesianSmallViewPortProperties;
                }
            }
        }

        public init(options: VisualInitOptions) {
            this.visualInitOptions = options;
            this.layers = [];

            var element = this.element = options.element;
            var viewport = this.currentViewport = options.viewport;
            this.hostServices = options.host;
            this.brush = d3.svg.brush();
            element.addClass(CartesianChart.ClassName);
            this.margin = {
                top: 1,
                right: 1,
                bottom: 1,
                left: 1
            };
            this.yAxisOrientation = yAxisPosition.left;
            this.adjustMargins(viewport);

            var axisLinesVisibility = CartesianChart.getAxisVisibility(this.type);

            var showLinesOnX = this.scrollY = EnumExtensions.hasFlag(axisLinesVisibility, AxisLinesVisibility.ShowLinesOnBothAxis) ||
                EnumExtensions.hasFlag(axisLinesVisibility, AxisLinesVisibility.ShowLinesOnXAxis);

            var showLinesOnY = this.scrollX = EnumExtensions.hasFlag(axisLinesVisibility, AxisLinesVisibility.ShowLinesOnBothAxis) ||
                EnumExtensions.hasFlag(axisLinesVisibility, AxisLinesVisibility.ShowLinesOnYAxis);

            /*
                The layout of the visual would look like :
                <svg>
                    <g>
                        <nonscrollable axis/>
                    </g>
                    <svgScrollable>
                        <g>
                            <scrollable axis/>
                        </g>
                    </svgScrollable>
                    <g xbrush/>
                </svg>                    

            */
            var svg = this.svg = d3.select(element.get(0)).append('svg');
            svg.style('position', 'absolute');

            var axisGraphicsContext = this.axisGraphicsContext = svg.append('g')
                .classed(CartesianChart.AxisGraphicsContextClassName, true);

            this.svgScrollable = svg.append('svg')
                .classed('svgScrollable', true)
                .style('overflow', 'hidden');

            var axisGraphicsContextScrollable = this.axisGraphicsContextScrollable = this.svgScrollable.append('g')
                .classed(CartesianChart.AxisGraphicsContextClassName, true);

            this.clearCatcher = appendClearCatcher(this.axisGraphicsContextScrollable);

            this.brushGraphicsContext = svg.append("g")
                .attr('class', 'x brush');

            var axisGroup = showLinesOnX ? axisGraphicsContextScrollable : axisGraphicsContext;

            this.xAxisGraphicsContext = showLinesOnX ? axisGraphicsContext.append('g').attr('class', 'x axis') : axisGraphicsContextScrollable.append('g').attr('class', 'x axis');
            this.y1AxisGraphicsContext = axisGroup.append('g').attr('class', 'y axis');
            this.y2AxisGraphicsContext = axisGroup.append('g').attr('class', 'y axis');

            this.xAxisGraphicsContext.classed('showLinesOnAxis', showLinesOnX);
            this.y1AxisGraphicsContext.classed('showLinesOnAxis', showLinesOnY);
            this.y2AxisGraphicsContext.classed('showLinesOnAxis', showLinesOnY);

            this.xAxisGraphicsContext.classed('hideLinesOnAxis', !showLinesOnX);
            this.y1AxisGraphicsContext.classed('hideLinesOnAxis', !showLinesOnY);
            this.y2AxisGraphicsContext.classed('hideLinesOnAxis', !showLinesOnY);

            if (this.type !== CartesianChartType.Waterfall) {
            this.interactivityService = VisualInteractivityFactory.buildInteractivityService(options);
            }
            this.legend = createLegend(element, options.interactivity && options.interactivity.isInteractiveLegend, this.interactivityService, this.isScrollable);

        }

        private renderAxesLabels(axisLabels: ChartAxesLabels, legendMargin: number, viewport: IViewport, hideXAxisTitle: boolean, hideYAxisTitle: boolean, hideY2AxisTitle?: boolean): void {
            this.axisGraphicsContext.selectAll('.xAxisLabel').remove();
            this.axisGraphicsContext.selectAll('.yAxisLabel').remove();

            var margin = this.margin;
            var width = viewport.width - (margin.left + margin.right);
            var height = viewport.height;
            var fontSize = CartesianChart.FontSize;
            var yAxisOrientation = this.yAxisOrientation;
            var showOnRight = yAxisOrientation === yAxisPosition.right;

            if (!hideXAxisTitle) {
            var xAxisLabel = this.axisGraphicsContext.append("text")
                .style("text-anchor", "middle")
                .text(axisLabels.x)
                .call((text: D3.Selection) => {
                text.each(function () {
                    var text = d3.select(this);
                    text.attr({
                        "class": "xAxisLabel",
                        "transform": SVGUtil.translate(width / 2, height - fontSize)
                    });
                });
            });

            xAxisLabel.call(AxisHelper.LabelLayoutStrategy.clip,
                width,
                TextMeasurementService.svgEllipsis);
            }

            if (!hideYAxisTitle) {
                var yAxisLabel = this.axisGraphicsContext.append("text")
                    .style("text-anchor", "middle")
                    .text(axisLabels.y)
                    .call((text: D3.Selection) => {
                    text.each(function () {
                        var text = d3.select(this);
                        text.attr({
                            "class": "yAxisLabel",
                            "transform": "rotate(-90)",
                            "y": showOnRight ? width + margin.right - fontSize : -margin.left,
                            "x": -((height - margin.top - legendMargin) / 2),
                            "dy": "1em"
                        });
                    });
                });

                yAxisLabel.call(AxisHelper.LabelLayoutStrategy.clip,
                    height - (margin.bottom + margin.top),
                    TextMeasurementService.svgEllipsis);
            }

            if (!hideY2AxisTitle && axisLabels.y2) {
                var y2AxisLabel = this.axisGraphicsContext.append("text")
                    .style("text-anchor", "middle")
                    .text(axisLabels.y2)
                    .call((text: D3.Selection) => {
                        text.each(function () {
                            var text = d3.select(this);
                            text.attr({
                                "class": "yAxisLabel",
                                "transform": "rotate(-90)",
                                "y": showOnRight ? -margin.left : width + margin.right - fontSize,
                                "x": -((height - margin.top - legendMargin) / 2),
                                "dy": "1em"
                            });
                        });
                    });

                y2AxisLabel.call(AxisHelper.LabelLayoutStrategy.clip,
                    height - (margin.bottom + margin.top),
                    TextMeasurementService.svgEllipsis);
        }
        }

        private adjustMargins(viewport: IViewport): void {
            var margin = this.margin;

            var width = viewport.width - (margin.left + margin.right);
            var height = viewport.height - (margin.top + margin.bottom);

            // Adjust margins if ticks are not going to be shown on either axis
            var xAxis = this.element.find('.x.axis');

            if (AxisHelper.getRecommendedNumberOfTicksForXAxis(width) === 0
                && AxisHelper.getRecommendedNumberOfTicksForYAxis(height) === 0) {
                this.margin = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                };
                xAxis.hide();
            } else {
                xAxis.show();
            }
        }

        private updateAxis(duration: number, viewport: IViewport): void {
            this.adjustMargins(viewport);
            var margin = this.margin;

            var width = viewport.width - (margin.left + margin.right);
            var height = viewport.height - (margin.top + margin.bottom);

            var yAxisOrientation = this.yAxisOrientation;
            var showOnRight = yAxisOrientation === yAxisPosition.right;

            this.xAxisGraphicsContext
                .attr('transform', SVGUtil.translate(0, height));

            this.y1AxisGraphicsContext
                .attr('transform', SVGUtil.translate(showOnRight ? 0 : width, 0));

            this.y2AxisGraphicsContext
                .attr('transform', SVGUtil.translate(showOnRight ? 0 : width, 0));

            this.svg.attr({
                'width': viewport.width,
                'height': viewport.height
            });

            this.svgScrollable.attr({
                'width': viewport.width,
                'height': viewport.height
            });

            this.svgScrollable.attr({
                'x': 0
            });

            this.axisGraphicsContext.attr('transform', SVGUtil.translate(margin.left, margin.top));
            this.axisGraphicsContextScrollable.attr('transform', SVGUtil.translate(margin.left, margin.top));

            if (this.isXScrollBarVisible) {
                this.svgScrollable.attr({
                    'x': this.margin.left
                });
                this.axisGraphicsContextScrollable.attr('transform', SVGUtil.translate(0, margin.top));
                this.svgScrollable.attr('width', width);
                this.svg.attr('width', viewport.width)
                    .attr('height', viewport.height + CartesianChart.ScrollBarWidth);
            }
            else if (this.isYScrollBarVisible) {
                this.svgScrollable.attr('height', height + margin.top);
                this.svg.attr('width', viewport.width + CartesianChart.ScrollBarWidth)
                    .attr('height', viewport.height);
            }
        }

        public static getIsScalar(objects: DataViewObjects, propertyId: DataViewObjectPropertyIdentifier, type: ValueType): boolean {
            var axisTypeValue = DataViewObjects.getValue(objects, propertyId);

            if (!objects || axisTypeValue === undefined) {
                // If we don't have anything set (Auto), show charts as Scalar if the category type is numeric or time. 
                // If we have the property, it will override the type.
                return !AxisHelper.isOrdinal(type);
            }

            // also checking type here to be in sync with AxisHelper, which ignores scalar if the type is non-numeric.
            return (axisTypeValue === axisType.scalar) && !AxisHelper.isOrdinal(type);
        }

        private populateObjectProperties(dataViews: DataView[]) {           
            if (dataViews && dataViews.length > 0) {
                var dataViewMetadata = dataViews[0].metadata;               
                
                if (dataViewMetadata) {
                    this.legendObjectProperties = DataViewObjects.getObject(dataViewMetadata.objects, 'legend', {});
                }
                else {
                    this.legendObjectProperties = {};
                }
                this.categoryAxisProperties = CartesianHelper.getCategoryAxisProperties(dataViewMetadata);
                this.valueAxisProperties = CartesianHelper.getValueAxisProperties(dataViewMetadata);
                var axisPosition = this.valueAxisProperties['position'];
                this.yAxisOrientation = axisPosition ? axisPosition.toString() : yAxisPosition.left;               
            }
        }

        public update(options: VisualUpdateOptions) {
            debug.assertValue(options, 'options');

            var dataViews = this.dataViews = options.dataViews;
            this.currentViewport = options.viewport;

            if (!dataViews) return;

            var layers = this.layers;

            if (layers.length === 0) {
                // Lazily instantiate the chart layers on the first data load.
                this.createAndInitLayers(dataViews);

                debug.assert(layers.length > 0, 'createAndInitLayers should update the layers.');
            }
            
            if (dataViews && dataViews.length > 0) {
                var warnings = getInvalidValueWarnings(
                    dataViews,
                    false /*supportsNaN*/,
                    false /*supportsNegativeInfinity*/,
                    false /*supportsPositiveInfinity*/);

                if (warnings && warnings.length > 0)
                    this.hostServices.setWarnings(warnings);

                this.populateObjectProperties(dataViews);
            }

            for (var i = 0, len = layers.length; i < len; i++) {
                layers[i].setData(getLayerData(dataViews, i, len));
            }

            // Note: interactive legend shouldn't be rendered explicitly here
            // The interactive legend is being rendered in the render method of ICartesianVisual
            if (!(this.visualInitOptions.interactivity && this.visualInitOptions.interactivity.isInteractiveLegend)) {
                this.renderLegend();
            }

            var duration: number = options.duration == null ? (this.animator ? AnimatorCommon.MinervaAnimationDuration : 0) : options.duration;
            this.render(this.hasSetData && duration);

            this.hasSetData = this.hasSetData || (dataViews && dataViews.length > 0);
        }

        // TODO: Remove onDataChanged & onResizing once all visuals have implemented update.
        public onDataChanged(options: VisualDataChangedOptions): void {
            this.update({
                dataViews: options.dataViews,
                duration: options.duration || (this.animator ? AnimatorCommon.MinervaAnimationDuration : 0),
                viewport: this.currentViewport
            });
        }

        // TODO: Remove onDataChanged & onResizing once all visuals have implemented update.
        public onResizing(viewport: IViewport, duration: number): void {
            if (this.currentViewport && (this.currentViewport.height === viewport.height && this.currentViewport.width === viewport.width)) {
                return;
            }

            this.update({
                dataViews: this.dataViews,
                duration: duration || 0,
                viewport: viewport
            });
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] {
            // TODO: Extend to all layers
            var objectInstances: VisualObjectInstance[] = [];
            var layersLength = this.layers ? this.layers.length : 0;

            if (options.objectName === 'legend') {
                if (layersLength > 0 && !this.layers[0].hasLegend())
                    return;
                var show = DataViewObject.getValue(this.legendObjectProperties, legendProps.show, this.legend.isVisible());
                var showTitle = DataViewObject.getValue(this.legendObjectProperties, legendProps.showTitle, true);
                var titleText = DataViewObject.getValue(this.legendObjectProperties, legendProps.titleText, this.layerLegendData ? this.layerLegendData.title : '');

                objectInstances.push({
                    selector: null,
                    properties: {
                        show: show,
                        position: LegendPosition[this.legend.getOrientation()],
                        showTitle: showTitle,
                        titleText: titleText
                    },
                    objectName: options.objectName
                });
                }             
            else if (options.objectName === 'categoryAxis' && this.hasCategoryAxis) {
                objectInstances = this.getCategoryAxisValues();
                    }
            else if (options.objectName === 'valueAxis') {
                objectInstances = this.getValueAxisValues();
                }        

            for (var i = 0, len = layersLength; i < len; i++) {
                var layer = this.layers[i];
                if (layer.enumerateObjectInstances) {
                    var layerInstances = layer.enumerateObjectInstances(options);
                    if (layerInstances) {
                        if (i > 0) {
                            // TODO: This removes redundant DataPoint properties that are defined by multiple layers.  We should consider a more general way to consolidate these properties.
                            if (options.objectName === 'dataPoint') {
                                var defaultColorObject = this.findObjectWithProperty(layerInstances,'defaultColor');
                                if (defaultColorObject) {
                                    var index = layerInstances.indexOf(defaultColorObject);
                                    layerInstances.splice(index, 1);
                                }

                                var showAllObject = this.findObjectWithProperty(layerInstances, 'showAllDataPoints');
                                if (showAllObject) {
                                    var index = layerInstances.indexOf(showAllObject);
                                    layerInstances.splice(index, 1);
                            }
                            }
                            //if previous layer didn't return any objects (objectInstances.length == 0) we will use this set of objects
                            else if (options.objectName === 'labels' && objectInstances.length > 0) {
                                //all settings refer to whole chart (- no data point specific ) one set of settings (-slices) is enough
                                layerInstances = [];
                            }                            
                        }

                        if (options.objectName === 'categoryAxis' || options.objectName === 'valueAxis') {
                            // override the properties
                            if (objectInstances.length > 0 && layerInstances.length > 0) {
                                objectInstances[0].properties['showAxisTitle'] = layerInstances[0].properties['showAxisTitle'];
                            }
                        }
                        else {
                            objectInstances = objectInstances.concat(layerInstances);
                        }
                    }
                }
            }
            return objectInstances;
        }

        private getCategoryAxisValues(): VisualObjectInstance[] {   
            var instances: VisualObjectInstance[] = [];
            var supportedType = axisType.both;
            var isScalar = false;

            if (this.layers && this.layers[0].getSupportedCategoryAxisType) {
                supportedType = this.layers[0].getSupportedCategoryAxisType();
                if (supportedType === axisType.scalar) {
                    isScalar = true;
            }
                else {
                    isScalar = CartesianHelper.isScalar(supportedType === axisType.both, this.categoryAxisProperties);
                }
            }

            if (!isScalar) {
                if (this.categoryAxisProperties) {
                    this.categoryAxisProperties['start'] = null;
                    this.categoryAxisProperties['end'] = null;
                }
            }

            var instance: VisualObjectInstance = {
                selector: null,
                properties: {},
                objectName: 'categoryAxis'
            };

            instance.properties['show'] = this.categoryAxisProperties && this.categoryAxisProperties['show'] != null ? this.categoryAxisProperties['show'] : true;
            if (this.yAxisIsCategorical)//in case of e.g. barChart
                instance.properties['position'] = this.valueAxisProperties && this.valueAxisProperties['position'] != null ? this.valueAxisProperties['position'] : yAxisPosition.left;
            if (supportedType === axisType.both) {
                instance.properties['axisType'] = isScalar ? axisType.scalar : axisType.categorical;
            }
            if (isScalar) {
                instance.properties['start'] = this.categoryAxisProperties ? this.categoryAxisProperties['start'] : null;
                instance.properties['end'] = this.categoryAxisProperties ? this.categoryAxisProperties['end'] : null;
            }
            instance.properties['showAxisTitle'] = this.categoryAxisProperties && this.categoryAxisProperties['showAxisTitle'] != null ? this.categoryAxisProperties['showAxisTitle'] : false;
            instances.push(instance);
            instances.push({
                selector: null,
                properties: {
                    axisStyle: this.categoryAxisProperties && this.categoryAxisProperties['axisStyle'] ? this.categoryAxisProperties['axisStyle'] : axisStyle.showTitleOnly
                },
                objectName: 'categoryAxis',
                validValues: this.categoryAxisHasUnitType ? [axisStyle.showTitleOnly, axisStyle.showUnitOnly, axisStyle.showBoth] : [axisStyle.showTitleOnly]
            });

            return instances;
        }

        //todo: wrap all these object getters and other related stuff into an interface
        private getValueAxisValues(): VisualObjectInstance[] {
            var y2AxesRendered = this.layers.length === 2 && this.y2AxesRendered;
            var instances: VisualObjectInstance[] = [];
            var instance: VisualObjectInstance = {
                selector: null,
                properties: {},
                objectName: 'valueAxis'
            };

            instance.properties['show'] = this.valueAxisProperties && this.valueAxisProperties['show'] != null ? this.valueAxisProperties['show'] : true;
            if (y2AxesRendered) {
                instance.properties['secShow'] = this.valueAxisProperties && this.valueAxisProperties['secShow'] != null ? this.valueAxisProperties['secShow'] : true;
                if (instance.properties['secShow']) {
                    instance.properties['axisLabel'] = '';//this.layers[0].getVisualType();//I will keep or remove this, depending on the decision made
                }
            }
            if (!this.yAxisIsCategorical) {
                instance.properties['position'] = this.valueAxisProperties && this.valueAxisProperties['position'] != null ? this.valueAxisProperties['position'] : yAxisPosition.left;
            }
            instance.properties['start'] = this.valueAxisProperties ? this.valueAxisProperties['start'] : null;
            instance.properties['end'] = this.valueAxisProperties ? this.valueAxisProperties['end'] : null;
            instance.properties['showAxisTitle'] = this.valueAxisProperties && this.valueAxisProperties['showAxisTitle'] != null ? this.valueAxisProperties['showAxisTitle'] : false;
            instances.push(instance);
            instances.push({
                selector: null,
                properties: {
                    axisStyle: this.valueAxisProperties && this.valueAxisProperties['axisStyle'] != null ? this.valueAxisProperties['axisStyle'] : axisStyle.showTitleOnly
                },
                objectName: 'valueAxis',
                validValues: this.valueAxisHasUnitType ? [axisStyle.showTitleOnly, axisStyle.showUnitOnly, axisStyle.showBoth] : [axisStyle.showTitleOnly]
            });

            if (y2AxesRendered && instance.properties['secShow']) {
                var secInstance: VisualObjectInstance = {
                    selector: null,
                    properties: {},
                objectName: 'valueAxis'
                };
                secInstance.properties['secAxisLabel'] = ''; //this.layers[1].getVisualType(); //I will keep or remove this, depending on the decision made                        
                secInstance.properties['secPosition'] = this.valueAxisProperties && this.valueAxisProperties['secPosition'] != null ? this.valueAxisProperties['secPosition'] : yAxisPosition.right;
                secInstance.properties['secStart'] = this.valueAxisProperties ? this.valueAxisProperties['secStart'] : null;
                secInstance.properties['secEnd'] = this.valueAxisProperties ? this.valueAxisProperties['secEnd'] : null;
                secInstance.properties['secShowAxisTitle'] = this.valueAxisProperties && this.valueAxisProperties['secShowAxisTitle'] != null ? this.valueAxisProperties['secShowAxisTitle'] : false;
                instances.push(secInstance);
                instances.push({
                    selector: null,
                    properties: {
                        secAxisStyle: this.valueAxisProperties && this.valueAxisProperties['secAxisStyle'] ? this.valueAxisProperties['secAxisStyle'] : axisStyle.showTitleOnly
                    },
                    objectName: 'valueAxis',
                    validValues: this.secValueAxisHasUnitType ? [axisStyle.showTitleOnly, axisStyle.showUnitOnly, axisStyle.showBoth] : [axisStyle.showTitleOnly]
                });
            }
            return instances;
        }

        private findObjectWithProperty(objectInstances: VisualObjectInstance[], propertyName: string): VisualObjectInstance {            
            for (var i = 0, len = objectInstances.length; i < len; i++) {
                var object = objectInstances[i];
                if (object.properties[propertyName] !== undefined) {
                    return object;
                }
            }
        }

        public onClearSelection(): void {
            if (this.hasSetData) {
                for (var i = 0, len = this.layers.length; i < len; i++) {
                    var layer = this.layers[i];
                    layer.onClearSelection();
                    layer.render(0);
                }
            }
        }

        private createAndInitLayers(dataViews: DataView[]): void {
            var objects: DataViewObjects;
            if (dataViews && dataViews.length > 0) {
                var dataViewMetadata = dataViews[0].metadata;
                if (dataViewMetadata)
                    objects = dataViewMetadata.objects;
            }

            // Create the layers
            var layers = this.layers;
            createLayers(layers, this.type, objects, this.interactivityService, this.animator, this.isScrollable);

            // Initialize the layers
            var cartesianOptions = <CartesianVisualInitOptions>Prototype.inherit(this.visualInitOptions);
            cartesianOptions.svg = this.axisGraphicsContextScrollable;
            cartesianOptions.cartesianHost = {
                updateLegend: data => this.legend.drawLegend(data, this.currentViewport),
            };

            for (var i = 0, len = layers.length; i < len; i++)
                layers[i].init(cartesianOptions);
        }

        private renderLegend(): void {
            var layers = this.layers;
            var legendData: LegendData = { title: "", dataPoints: [] };

            for (var i = 0, len = layers.length; i < len; i++) {
                this.layerLegendData = layers[i].calculateLegend();
                if (this.layerLegendData) {
                    legendData.title = i === 0 ? this.layerLegendData.title || ""
                        : legendData.title;
                    legendData.dataPoints = legendData.dataPoints.concat(this.layerLegendData.dataPoints || []);
                    if (this.layerLegendData.grouped) {
                        legendData.grouped = true;
                    }
                }
            }
            
            var legendProperties = this.legendObjectProperties;

            if (legendProperties) {
                LegendData.update(legendData, legendProperties);
                var position = <string>legendProperties[legendProps.position];

                if (position)
                    this.legend.changeOrientation(LegendPosition[position]);
            }
            else {
                this.legend.changeOrientation(LegendPosition.Top);
            }

            if ((legendData.dataPoints.length === 1 && !legendData.grouped) || this.hideLegends()) {
                legendData.dataPoints = [];
            }

            this.legend.drawLegend(legendData, this.currentViewport);
        }

        private hideLegends(): boolean {
            if (this.cartesianSmallViewPortProperties) {
                if (this.cartesianSmallViewPortProperties.hideLegendOnSmallViewPort && (this.currentViewport.height < this.cartesianSmallViewPortProperties.MinHeightLegendVisible)) {
                    return true;
                }
            }
            return false;
        }

        private addUnitTypeToAxisLabel(axes: CartesianAxisProperties): void {
            var unitType = axes.x.formatter && axes.x.formatter.displayUnit ? axes.x.formatter.displayUnit.title : null;
            this.categoryAxisHasUnitType = unitType !== null;
            if (axes.x.axisLabel && unitType) {
                if (this.categoryAxisProperties && this.categoryAxisProperties['axisStyle']) {
                    if (this.categoryAxisProperties['axisStyle'] === axisStyle.showBoth) {
                        axes.x.axisLabel = axes.x.axisLabel + ' (' + unitType + ')';
                    }
                    else if (this.categoryAxisProperties['axisStyle'] === axisStyle.showUnitOnly) {
                        axes.x.axisLabel = unitType;
                    }
                }
            }

            unitType = axes.y1.formatter && axes.y1.formatter.displayUnit ? axes.y1.formatter.displayUnit.title : null;
            this.valueAxisHasUnitType = unitType !== null;
            if (axes.y1.axisLabel && unitType) {
                if (this.valueAxisProperties && this.valueAxisProperties['axisStyle']) {
                    if (this.valueAxisProperties['axisStyle'] === axisStyle.showBoth) {
                        axes.y1.axisLabel = axes.y1.axisLabel + ' (' + unitType + ')';
                    }
                    else if (this.valueAxisProperties['axisStyle'] === axisStyle.showUnitOnly) {
                        axes.y1.axisLabel = unitType;
                    }
                }
            }

            if (axes.y2) {
                unitType = axes.y2.formatter && axes.y2.formatter.displayUnit ? axes.y2.formatter.displayUnit.title : null;
                this.secValueAxisHasUnitType = unitType !== null;
                if (axes.y2.axisLabel && unitType) {
                    if (this.valueAxisProperties && this.valueAxisProperties['secAxisStyle']) {
                        if (this.valueAxisProperties['secAxisStyle'] === axisStyle.showBoth) {
                            axes.y2.axisLabel = axes.y2.axisLabel + ' (' + unitType + ')';
                        }
                        else if (this.valueAxisProperties['secAxisStyle'] === axisStyle.showUnitOnly) {
                            axes.y2.axisLabel = unitType;
                }
            }
        }
            }
        }

        private shouldRenderSecondaryAxis(axisProperties: IAxisProperties): boolean {
            if (!this.valueAxisProperties || this.valueAxisProperties["secShow"] == null || this.valueAxisProperties["secShow"]) {
                return true;
            }

            return false;
        }

        private shouldRenderAxis(axisProperties: IAxisProperties): boolean {    
            if (!axisProperties) {
                return false;
            }

            else if (axisProperties.isCategoryAxis && (!this.categoryAxisProperties || this.categoryAxisProperties["show"] == null || this.categoryAxisProperties["show"])) {
                return true;
            }

            else if (!axisProperties.isCategoryAxis && (!this.valueAxisProperties || this.valueAxisProperties["show"] == null || this.valueAxisProperties["show"])) {
                return true;
            }

            return false;
        }

        private render(duration: number = 0): void {
            this.duration = duration;
            var legendMargins = this.legendMargins = this.legend.getMargins();
            var viewport: IViewport = {
                height: this.currentViewport.height - legendMargins.height,
                width: this.currentViewport.width - legendMargins.width
            };

            var maxMarginFactor = this.getMaxMarginFactor();
            var leftMarginLimit = this.leftMarginLimit = viewport.width * maxMarginFactor;
            var bottomMarginLimit = this.bottomMarginLimit = Math.max(CartesianChart.MinBottomMargin, viewport.height * maxMarginFactor);

            var margin = this.margin;
            // reset defaults
            margin.top = CartesianChart.TopMargin;
            margin.bottom = bottomMarginLimit;
            margin.right = 0;

            var axes = calculateAxes(this.layers, viewport, margin, this.categoryAxisProperties, this.valueAxisProperties);

            this.yAxisIsCategorical = axes.y1.isCategoryAxis;
            this.hasCategoryAxis = this.yAxisIsCategorical ? axes.y1 && axes.y1.values.length > 0 : axes.x && axes.x.values.length > 0;

            if (axes.forceValueDomainStartToZero) {
                if (!this.valueAxisProperties) {
                    this.valueAxisProperties = {};
                }
                CartesianHelper.forceValueDomainToZero(this.valueAxisProperties);
            }

            var renderXAxis = this.shouldRenderAxis(axes.x);
            var renderYAxes = this.shouldRenderAxis(axes.y1);
            var renderY2Axis = this.shouldRenderSecondaryAxis(axes.y2);
            
            var width = viewport.width - (margin.left + margin.right);

            var properties: TextProperties = {
                fontFamily: 'wf_segoe-ui_normal',
                fontSize: CartesianChart.FontSizeString,
            };

            var isScalar = false;
            var mainAxisScale;
            var preferredViewport: IViewport;
            this.isXScrollBarVisible = false;
            this.isYScrollBarVisible = false;            

            var yAxisOrientation = this.yAxisOrientation;
            var showOnRight = yAxisOrientation === yAxisPosition.right;    

            if (this.layers) {
                if (this.layers[0].getVisualCategoryAxisIsScalar)
                    isScalar = this.layers[0].getVisualCategoryAxisIsScalar();

                if (!isScalar && this.isScrollable && this.layers[0].getPreferredPlotArea) {
                    var categoryThickness = this.scrollX ? axes.x.categoryThickness : axes.y1.categoryThickness;
                    var categoryCount = this.scrollX ? axes.x.values.length : axes.y1.values.length;
                    preferredViewport = this.layers[0].getPreferredPlotArea(isScalar, categoryCount, categoryThickness);
                    if (this.scrollX && preferredViewport && preferredViewport.width > viewport.width) {
                        this.isXScrollBarVisible = true;
                        viewport.height -= CartesianChart.ScrollBarWidth;
                    }

                    if (this.scrollY && preferredViewport && preferredViewport.height > viewport.height) {
                        this.isYScrollBarVisible = true;
                        viewport.width -= CartesianChart.ScrollBarWidth;
                        width = viewport.width - (margin.left + margin.right);
                    }
                }
            }

            var needRotate = this.needRotate = AxisHelper.LabelLayoutStrategy.willRotate(
                axes.x,
                width,
                TextMeasurementService.measureSvgTextWidth,
                properties);

            var margins = AxisHelper.getTickLabelMargins(
                { width: width, height: viewport.height },
                leftMarginLimit,
                TextMeasurementService.measureSvgTextWidth,
                axes.x,
                axes.y1,
                needRotate,
                bottomMarginLimit,
                properties,
                axes.y2,
                this.isXScrollBarVisible || this.isYScrollBarVisible,
                showOnRight,
                renderXAxis,
                renderYAxes,
                renderY2Axis);            

            // We look at the y axes as main and second sides, if the y axis orientation is right so the main side is represents the right side
            var maxMainYaxisSide = showOnRight ? margins.yRight : margins.yLeft,
                maxSecondYaxisSide = showOnRight ? margins.yLeft : margins.yRight,
                xMax = margins.xMax;

            maxMainYaxisSide += CartesianChart.LeftPadding;
            if (hasMultipleYAxes(this.layers))
                maxSecondYaxisSide += CartesianChart.RightPadding;
            xMax += CartesianChart.BottomPadding;

            if (this.hideAxisLabels(legendMargins)) {
                axes.x.axisLabel = null;
                axes.y1.axisLabel = null;
                if (axes.y2) {
                    axes.y2.axisLabel = null;
            }
            }

            this.addUnitTypeToAxisLabel(axes);            

            var axisLabels: ChartAxesLabels = { x: axes.x.axisLabel, y: axes.y1.axisLabel, y2: axes.y2 ? axes.y2.axisLabel : null};
            var chartHasAxisLabels = (axisLabels.x != null) || (axisLabels.y != null || axisLabels.y2 != null);

            if (axisLabels.x != null)
                xMax += CartesianChart.XAxisLabelPadding;

            if (axisLabels.y != null)
                maxMainYaxisSide += CartesianChart.YAxisLabelPadding;

            if (axisLabels.y2 != null)
                maxSecondYaxisSide += CartesianChart.YAxisLabelPadding;

            if ((showOnRight && (maxMainYaxisSide !== margin.right || maxSecondYaxisSide !== margin.left)) ||
                (!showOnRight && (maxMainYaxisSide !== margin.left || maxSecondYaxisSide !== margin.right)) ||
                xMax !== margin.bottom || this.currentViewport.height !== viewport.height || this.isXScrollBarVisible || this.isYScrollBarVisible) {
                margin.left = showOnRight ? maxSecondYaxisSide : maxMainYaxisSide;
                margin.right = showOnRight ? maxMainYaxisSide : maxSecondYaxisSide;
                margin.bottom = xMax;
                this.margin = margin;
                axes = calculateAxes(this.layers, viewport, margin, this.categoryAxisProperties, this.valueAxisProperties);
                width = viewport.width - (margin.left + margin.right);
            }

            if (this.isXScrollBarVisible) {
                mainAxisScale = axes.x.scale;
                var brushX = this.margin.left;
                var brushY = viewport.height;
                this.renderChartWithScrollBar(mainAxisScale, brushX, brushY, preferredViewport.width, viewport, axes, width, margins, chartHasAxisLabels, axisLabels);
            }
            else if (this.isYScrollBarVisible) {
                mainAxisScale = axes.y1.scale;
                var brushX = viewport.width;
                var brushY = this.margin.top;
                this.renderChartWithScrollBar(mainAxisScale, brushX, brushY, preferredViewport.height, viewport, axes, width, margins, chartHasAxisLabels, axisLabels);
            }
            else {
                this.renderChart(mainAxisScale, axes, width, margins, chartHasAxisLabels, axisLabels, viewport);
            }

            this.updateAxis(0, viewport);

            // clear any existing brush if no scrollbar is shown
            if (!(this.isXScrollBarVisible || this.isYScrollBarVisible)) {
                this.brushGraphicsContext.selectAll("rect")
                    .remove();
            }
        }

        private hideAxisLabels(legendMargins: IViewport): boolean {
            if (this.cartesianSmallViewPortProperties) {
                if (this.cartesianSmallViewPortProperties.hideAxesOnSmallViewPort && ((this.currentViewport.height + legendMargins.height) < this.cartesianSmallViewPortProperties.MinHeightAxesVisible) && !this.visualInitOptions.interactivity.isInteractiveLegend) {
                    return true;
                }
            }
            return false;
        }

        private renderChartWithScrollBar(
            inputMainAxisScale: D3.Scale.GenericScale<any>,
            brushX: number,
            brushY: number,
            svgLength: number,
            viewport: IViewport,
            axes: CartesianAxisProperties,
            width: number,
            margins: any,
            chartHasAxisLabels: boolean,
            axisLabels: ChartAxesLabels): void {

            var mainAxisScale = <D3.Scale.OrdinalScale>inputMainAxisScale;
            var miniAxisScale = <D3.Scale.OrdinalScale>mainAxisScale.copy();
            var brush = this.brush;
            var viewportLength;
            var marginTop = this.margin.top;
            var marginLeft = this.margin.left;
            var marginRight = this.margin.right;
            var marginBottom = this.margin.bottom;
            var minExtent;

            if (this.isXScrollBarVisible) {
                viewportLength = viewport.width - (marginLeft + marginRight);
                minExtent = this.getMinExtent(svgLength, viewportLength);
                miniAxisScale.rangeBands([0, viewportLength]);
                brush.x(miniAxisScale)
                    .extent([0, minExtent]);
            }
            else {
                viewportLength = viewport.height - (marginTop + marginBottom);
                minExtent = this.getMinExtent(svgLength, viewportLength);
                miniAxisScale.rangeBands([0, viewportLength]);
                brush.y(miniAxisScale)
                    .extent([0, minExtent]);
            }

            this.brushMinExtent = minExtent;
            var viewportToSvgRatio = svgLength / viewportLength;

            brush
                .on("brush",() => window.requestAnimationFrame(() => this.onBrushed(miniAxisScale, mainAxisScale, axes, width, margins, chartHasAxisLabels, axisLabels, viewport, viewportLength)))
                .on("brushend",() => this.onBrushEnd(minExtent));

            var brushContext = this.brushContext = this.brushGraphicsContext
                .attr({
                "transform": SVGUtil.translate(brushX, brushY),
                "drag-resize-disabled": "true" /*disables resizing of the visual when dragging the scrollbar in edit mode*/
            })
                .call(brush);  /*call the brush function, causing it to create the rectangles   */              
              
            /* Disabling the zooming feature*/
            brushContext.selectAll(".resize rect")
                .remove();

            var minBrushExtent = this.setMinBrush(viewportLength, minExtent, viewportToSvgRatio);

            brushContext.select(".background")
                .style('cursor', 'pointer')
                .on("mousedown.brush",() => minBrushExtent)
                .on("touchstart.brush",() => minBrushExtent);

            brushContext.selectAll(".extent")
                .style({
                'fill-opacity': CartesianChart.fillOpacity,
                'cursor': 'hand',
            });

            if (this.isXScrollBarVisible)
                brushContext.selectAll("rect").attr("height", CartesianChart.ScrollBarWidth);
            else
                brushContext.selectAll("rect").attr("width", CartesianChart.ScrollBarWidth);

            if (mainAxisScale && miniAxisScale) {
                mainAxisScale.domain(miniAxisScale.domain());
                mainAxisScale.rangeBands([0, viewportLength]);
                this.renderChart(mainAxisScale, axes, width, margins, chartHasAxisLabels, axisLabels, viewport, miniAxisScale, brush.extent());
            }
        }

        private getMinExtent(svgLength: number, viewportLength: number): number {       
            return viewportLength * viewportLength / (svgLength);            
        }

        private onBrushEnd(minExtent: number): void {
            var brushContext = this.brushContext;
            if (this.isXScrollBarVisible) {
                brushContext.select(".extent").attr("width", minExtent);
            }
            else
                brushContext.select(".extent").attr("height", minExtent);
        }

        private onBrushed(miniAxisScale: any, mainAxisScale: any, axes: CartesianAxisProperties, width: number, margins: any, chartHasAxisLabels: boolean, axisLabels: ChartAxesLabels, viewport: IViewport, viewportLength: number): void {
            var brush = this.brush;

            if (mainAxisScale && miniAxisScale) {
                mainAxisScale.domain(miniAxisScale.domain());
                this.setBrushExtent(this.brush, viewportLength, this.brushMinExtent);
                var extent = brush.extent();                
                this.renderChart(mainAxisScale, axes, width, margins, chartHasAxisLabels, axisLabels, viewport, miniAxisScale, extent, /* animation duration */ 0);
            }
        }

        /* To show brush every time when mouse is clicked on the empty background */
        private setMinBrush(viewportLength: number, minExtent: number, viewportToSvgRatio: number): void {
            this.setBrushExtent(this.brush, viewportLength, minExtent);
        }

        private setBrushExtent(brush: D3.Svg.Brush, viewportWidth: number, minExtent: number): void {
            var extent = brush.extent();
            var width = extent[1] - extent[0];

            if (width === minExtent && extent[1] <= viewportWidth && extent[0] >= 0)
                return;

            if (width > minExtent) {
                var padding = (width - minExtent) / 2;
                extent[0] += padding;
                extent[1] -= padding;
            }

            else if (width < minExtent) {
                var padding = (minExtent - width) / 2;
                extent[0] -= padding;
                extent[1] += padding;
            }

            if (extent[0] < 0) {
                extent[0] = 0;
                extent[1] = minExtent;
            }

            else if (extent[0] > viewportWidth - minExtent) {
                extent[0] = viewportWidth - minExtent;
                extent[1] = viewportWidth;
            }

            brush.extent(extent);
        }

        private getMaxMarginFactor(): number {
            return this.visualInitOptions.style.maxMarginFactor || CartesianChart.MaxMarginFactor;
        }

        private renderChart(
            mainAxisScale: any,
            axes: CartesianAxisProperties,
            width: number,
            margins: any,
            chartHasAxisLabels: boolean,
            axisLabels: ChartAxesLabels,
            viewport: IViewport,
            miniAxisScale?: any,
            extent?: number[],
            duration: number = this.duration) {

            var bottomMarginLimit = this.bottomMarginLimit;
            var leftMarginLimit = this.leftMarginLimit;
            var needRotate = this.needRotate;       
            var layers = this.layers;

            debug.assertValue(layers, 'layers');

            // Filter data that fits viewport
            if (miniAxisScale) {
                var selected: number[];
                var data: CartesianData[] = [];

                var startValue = extent[0];
                var endValue = extent[1];
                
                var pixelStepSize = miniAxisScale(1) - miniAxisScale(0);
                var startIndex = Math.floor(startValue / pixelStepSize);
                var sliceLength = Math.ceil((endValue - startValue) / pixelStepSize);
                var endIndex = startIndex + sliceLength; //intentionally one past the end index for use with slice(start,end)

                selected = mainAxisScale.domain().slice(startIndex, endIndex); //up to but not including 'end'
                if (selected && selected.length > 0) {
                    for (var i = 0; i < layers.length; i++) {
                        data[i] = layers[i].setFilteredData(selected[0], selected[selected.length-1]+1);
                    }
                    mainAxisScale.domain(selected);

                    var dataType: ValueType = AxisHelper.getCategoryValueType(data[0].categoryMetadata);
                    var newTickValues = AxisHelper.getRecommendedTickValuesForAnOrdinalRange(sliceLength, mainAxisScale.domain());
                    var dw = new DataWrapper(data[0], false);
                    var getValueFn = (index, type) => dw.lookupXValue(index - startIndex, type);

                    var axisPropsToUpdate: IAxisProperties; 
                    if (this.isXScrollBarVisible) {
                        axisPropsToUpdate = axes.x;
                    }
                    else {
                        axisPropsToUpdate = axes.y1;
                    }

                    axisPropsToUpdate.axis.scale(mainAxisScale);
                    axisPropsToUpdate.scale(mainAxisScale);
                    axisPropsToUpdate.axis.ticks(sliceLength);
                    // set an ordinal index array, not the actual values
                    axisPropsToUpdate.axis.tickValues(selected); 
                    // this will call axes.x.axis.tickFormat() for us to convert the index to a real formatted value
                    axisPropsToUpdate.values = AxisHelper.formatAxisTickValues(axisPropsToUpdate.axis, newTickValues, axisPropsToUpdate.formatter, dataType, false, getValueFn);
                }
            }

            //hide show x-axis here
            if (this.shouldRenderAxis(axes.x)) {
                axes.x.axis.orient("bottom");
                if (needRotate)
                    axes.x.axis.tickPadding(CartesianChart.TickPaddingRotatedX);

                var xAxisGraphicsElement = this.xAxisGraphicsContext;
                if (duration) {
                    xAxisGraphicsElement
                        .transition()
                        .duration(duration)
                        .call(axes.x.axis);
                }
                else {
                    xAxisGraphicsElement.call(axes.x.axis);
                }

                xAxisGraphicsElement.selectAll('text')
                    .call(AxisHelper.LabelLayoutStrategy.rotate,
                    width,
                    bottomMarginLimit,
                    TextMeasurementService.svgEllipsis,
                    needRotate,
                    bottomMarginLimit === margins.xMax,
                    axes.x,
                    this.margin,
                    this.isXScrollBarVisible || this.isYScrollBarVisible);
            }
            else {
                this.xAxisGraphicsContext.selectAll('*').remove();
            }

            if (this.shouldRenderAxis(axes.y1)) {
                var yAxisOrientation = this.yAxisOrientation;
                var showOnRight = yAxisOrientation === yAxisPosition.right;
                axes.y1.axis
                    .tickSize(width)
                    .tickPadding(CartesianChart.TickPaddingY)
                    .orient(yAxisOrientation.toLowerCase());

                var y1AxisGraphicsElement = this.y1AxisGraphicsContext;
                if (duration) {
                    y1AxisGraphicsElement
                        .transition()
                        .duration(duration)
                        .call(axes.y1.axis);
                }
                else {
                    y1AxisGraphicsElement.call(axes.y1.axis);
                }

                if (axes.y2 && (!this.valueAxisProperties || this.valueAxisProperties['secShow'] == null || this.valueAxisProperties['secShow'])) {
                    axes.y2.axis
                        .tickPadding(CartesianChart.TickPaddingY)
                        .orient(showOnRight ? yAxisPosition.left.toLowerCase() : yAxisPosition.right.toLowerCase());

                    if (duration) {
                        this.y2AxisGraphicsContext
                            .transition()
                            .duration(duration)
                            .call(axes.y2.axis);
                    }
                    else {
                        this.y2AxisGraphicsContext.call(axes.y2.axis);
                    }
                    this.y2AxesRendered = true;
                }
                else {
                    this.y2AxisGraphicsContext.selectAll('*').remove();
                }

                if (margins.yLeft >= leftMarginLimit) {
                    y1AxisGraphicsElement.selectAll('text')
                        .call(AxisHelper.LabelLayoutStrategy.clip,
                        // Can't use padding space to render text, so subtract that from available space for ellipses calculations
                        leftMarginLimit - CartesianChart.LeftPadding,
                        TextMeasurementService.svgEllipsis);
                }
            }
            else {
                this.y1AxisGraphicsContext.selectAll('*').remove();
                this.y2AxisGraphicsContext.selectAll('*').remove();
            }
            // Axis labels
            //TODO: Add label for second Y axis for combo chart
            if (chartHasAxisLabels) {
                var hideXAxisTitle = this.categoryAxisProperties && this.categoryAxisProperties["showAxisTitle"] != null && this.categoryAxisProperties["showAxisTitle"] === false;
                var hideYAxisTitle = this.valueAxisProperties && this.valueAxisProperties["showAxisTitle"] != null && this.valueAxisProperties["showAxisTitle"] === false;
                var hideY2AxisTitle = this.valueAxisProperties && this.valueAxisProperties["secShowAxisTitle"] != null && this.valueAxisProperties["secShowAxisTitle"] === false;

                this.renderAxesLabels(axisLabels, this.legendMargins.height, viewport, hideXAxisTitle, hideYAxisTitle, hideY2AxisTitle);
            }
            else {
                this.axisGraphicsContext.selectAll('.xAxisLabel').remove();
                this.axisGraphicsContext.selectAll('.yAxisLabel').remove();
            }

            //Render chart columns            
            for (var i = 0, len = layers.length; i < len; i++)
                layers[i].render(duration);
        }

        /** Returns the actual viewportWidth if visual is not scrollable. 
        If visual is scrollable, returns the plot area needed to draw all the datapoints */
        public static getPreferredPlotArea(
            categoryCount: number,
            categoryThickness: number,
            viewport: IViewport,
            isScrollable: boolean,
            isScalar: boolean): IViewport {

            var preferredViewport: IViewport = {
                height: viewport.height,
                width: viewport.width
            };
            if (!isScalar && isScrollable) {
                var preferredWidth = CartesianChart.getPreferredCategorySpan(categoryCount, categoryThickness);
                preferredViewport.width = Math.max(preferredWidth, viewport.width);
            }
            return preferredViewport;
        }

        /** Returns preferred Category span if the visual is scrollable */
        public static getPreferredCategorySpan(categoryCount: number, categoryThickness: number): number {
            return categoryThickness * (categoryCount + (CartesianChart.OuterPaddingRatio * 2));
        }

        // public for testing access
        public static getLayout(data: ColumnChartData, options: CategoryLayoutOptions): CategoryLayout {
            var categoryCount = options.categoryCount,
                availableWidth = options.availableWidth,
                domain = options.domain,
                isScalar = !!options.isScalar,
                isScrollable = !!options.isScrollable;

            var categoryThickness = CartesianChart.getCategoryThickness(data ? data.series : null, categoryCount, availableWidth, domain, isScalar);

            // Total width of the outer padding, the padding that exist on the far right and far left of the chart.
            var totalOuterPadding = categoryThickness * CartesianChart.OuterPaddingRatio * 2;

            // visibleCategoryCount will be used to discard data that overflows on ordinal-axis charts.
            // Needed for dashboard visuals            
            var calculatedBarCount = Math.round((availableWidth - totalOuterPadding) / categoryThickness);
            var visibleCategoryCount = Math.min(calculatedBarCount, categoryCount);

            var outerPaddingRatio = CartesianChart.OuterPaddingRatio;
            if (!isScalar) {
                // use dynamic outer padding
                var oneOuterPadding = (availableWidth - (categoryThickness * visibleCategoryCount)) / 2;
                outerPaddingRatio = oneOuterPadding / categoryThickness;
            }

            // If scrollable, visibleCategoryCount will be total categories
            if (!isScalar && isScrollable)
                visibleCategoryCount = categoryCount;

            return {
                categoryCount: visibleCategoryCount,
                categoryThickness: categoryThickness,
                outerPaddingRatio: outerPaddingRatio,
                isScalar: isScalar
            };
        }

        /** Returns the thickness for each category. 
          * -For clustered charts, you still need to divide by the number of series to get column width after calling this method.
          * -For linear or time scales, category thickness accomodates for the minimum interval between consequtive points.
          * -For all types, return value has accounted for outer padding, but not inner padding
        */
        public static getCategoryThickness(seriesList: CartesianSeries[], numCategories: number, plotLength: number, domain: number[], isScalar: boolean): number {
            var thickness;
            if (numCategories < 2)
                thickness = plotLength * (1 - CartesianChart.OuterPaddingRatio);
            else if (isScalar && domain && domain.length > 1) {
                // the smallest interval defines the column width.
                var minInterval = CartesianChart.getMinInterval(seriesList);
                var domainSpan = domain[domain.length - 1] - domain[0];
                // account for outside padding
                var ratio = minInterval / (domainSpan + (minInterval * CartesianChart.OuterPaddingRatio * 2));
                thickness = plotLength * ratio;
                thickness = Math.max(thickness, CartesianChart.MinScalarRectThickness);
            }
            else {
                // Divide the available width up including outer padding (in terms of category thickness) on
                // both sides of the chart, and categoryCount categories. Reverse math:
                // availableWidth = (categoryThickness * categoryCount) + (categoryThickness * (outerPadding * 2)),
                // availableWidth = categoryThickness * (categoryCount + (outerPadding * 2)),
                // categoryThickness = availableWidth / (categoryCount + (outerpadding * 2))
                thickness = plotLength / (numCategories + (CartesianChart.OuterPaddingRatio * 2));
                thickness = Math.max(thickness, CartesianChart.MinOrdinalRectThickness);
            }
            
            // spec calls for using the whole plot area, but the max rectangle thickness is "as if there were three categories"
            // (outerPaddingRatio has the same units as '# of categories' so they can be added)
            var maxRectThickness = plotLength / (3 + (CartesianChart.OuterPaddingRatio * 2));

            if (!isScalar && numCategories >= 3)              
                return Math.max(Math.min(thickness, maxRectThickness), CartesianChart.MinOrdinalRectThickness);

            return Math.min(thickness, maxRectThickness);
        }

        private static getMinInterval(seriesList: CartesianSeries[]): number {
            var minInterval = Number.MAX_VALUE;
            if (seriesList.length > 0) {
                var series0data = seriesList[0].data.filter(d => !d.highlight);
                for (var i = 0, ilen = series0data.length - 1; i < ilen; i++) {
                    minInterval = Math.min(minInterval, Math.abs(series0data[i + 1].categoryValue - series0data[i].categoryValue));
                }
            }
            return minInterval;
        }
    }

    function createLayers(
        layers: ICartesianVisual[],
        type: CartesianChartType,
        objects: DataViewObjects,
        interactivityService: IInteractivityService,
        animator?: any,
        isScrollable: boolean = false): void {
        debug.assertValue(layers, 'layers');
        debug.assert(layers.length === 0, 'layers.length === 0');

        switch (type) {
            case CartesianChartType.Area:
                layers.push(new LineChart({
                    chartType: LineChartType.area,
                    isScrollable: isScrollable,
                    interactivityService: interactivityService,
                    animator: animator,
                }));
                return;
            case CartesianChartType.Line:
                layers.push(new LineChart({
                    chartType: LineChartType.default,
                    isScrollable: isScrollable,
                    interactivityService: interactivityService,
                    animator: animator,
                }));
                return;
            case CartesianChartType.StackedColumn:
                layers.push(new ColumnChart({
                    chartType: ColumnChartType.stackedColumn,
                    animator: <IColumnChartAnimator>animator,
                    isScrollable: isScrollable,
                    interactivityService: interactivityService
                }));
                return;
            case CartesianChartType.ClusteredColumn:
                layers.push(new ColumnChart({
                    chartType: ColumnChartType.clusteredColumn,
                    animator: <IColumnChartAnimator>animator,
                    isScrollable: isScrollable,
                    interactivityService: interactivityService
                }));
                return;
            case CartesianChartType.HundredPercentStackedColumn:
                layers.push(new ColumnChart({
                    chartType: ColumnChartType.hundredPercentStackedColumn,
                    animator: <IColumnChartAnimator>animator,
                    isScrollable: isScrollable,
                    interactivityService: interactivityService
                }));
                return;
            case CartesianChartType.StackedBar:
                layers.push(new ColumnChart({
                    chartType: ColumnChartType.stackedBar,
                    animator: <IColumnChartAnimator>animator,
                    isScrollable: isScrollable,
                    interactivityService: interactivityService
                }));
                return;
            case CartesianChartType.ClusteredBar:
                layers.push(new ColumnChart({
                    chartType: ColumnChartType.clusteredBar,
                    animator: <IColumnChartAnimator>animator,
                    isScrollable: isScrollable,
                    interactivityService: interactivityService
                }));
                return;
            case CartesianChartType.HundredPercentStackedBar:
                layers.push(new ColumnChart({
                    chartType: ColumnChartType.hundredPercentStackedBar,
                    animator: <IColumnChartAnimator>animator,
                    isScrollable: isScrollable,
                    interactivityService: interactivityService
                }));
                return;
            case CartesianChartType.Scatter:
                layers.push(new ScatterChart({ interactivityService: interactivityService }));
                return;
            case CartesianChartType.Waterfall:
                layers.push(new WaterfallChart({ isScrollable: isScrollable }));
                return;
            case CartesianChartType.ComboChart:
                // This support existing serialization of pinned combo-chart visuals
                var columnType: ColumnChartType = ColumnChartType.clusteredColumn;
                if (objects) {
                    var comboChartTypes: ComboChartDataViewObject = (<ComboChartDataViewObjects>objects).general;
                    if (comboChartTypes) {
                        switch (comboChartTypes.visualType1) {
                            case 'Column':
                                columnType = ColumnChartType.clusteredColumn;
                                break;
                            case 'ColumnStacked':
                                columnType = ColumnChartType.stackedColumn;
                                break;
                            default:
                                debug.assertFail('Unsupported cartesian chart type ' + comboChartTypes.visualType1);
                        }

                        // second visual is always LineChart (for now)
                        if (comboChartTypes.visualType2) {
                            debug.assert(comboChartTypes.visualType2 === 'Line', 'expecting a LineChart for VisualType2');
                        }
                    }
                }

                layers.push(new ColumnChart({
                    chartType: columnType,
                    animator: <IColumnChartAnimator>animator,
                    isScrollable: isScrollable,
                    interactivityService: interactivityService
                }));
                layers.push(new LineChart({ chartType: (LineChartType.default | LineChartType.lineShadow), isScrollable: isScrollable, interactivityService: interactivityService, animator: animator }));
                return;
            case CartesianChartType.DataDot:
                layers.push(new DataDotChart());
                return;
            case CartesianChartType.LineClusteredColumnCombo:
                layers.push(new ColumnChart({
                    chartType: ColumnChartType.clusteredColumn,
                    animator: <IColumnChartAnimator>animator,
                    isScrollable: isScrollable,
                    interactivityService: interactivityService
                }));
                layers.push(new LineChart({ chartType: (LineChartType.default | LineChartType.lineShadow), isScrollable: isScrollable, interactivityService: interactivityService, animator: animator }));
                return;
            case CartesianChartType.LineStackedColumnCombo:
                layers.push(new ColumnChart({
                    chartType: ColumnChartType.stackedColumn,
                    animator: <IColumnChartAnimator>animator,
                    isScrollable: isScrollable,
                    interactivityService: interactivityService
                }));
                layers.push(new LineChart({ chartType: (LineChartType.default | LineChartType.lineShadow), isScrollable: isScrollable, interactivityService: interactivityService, animator: animator }));
                return;
            case CartesianChartType.DataDotClusteredColumnCombo:
                layers.push(new ColumnChart({
                    chartType: ColumnChartType.clusteredColumn,
                    animator: <IColumnChartAnimator>animator,
                    isScrollable: isScrollable,
                    interactivityService: interactivityService
                }));
                layers.push(new DataDotChart());
                return;
            case CartesianChartType.DataDotStackedColumnCombo:
                layers.push(new ColumnChart({
                    chartType: ColumnChartType.stackedColumn,
                    animator: <IColumnChartAnimator>animator,
                    isScrollable: isScrollable,
                    interactivityService: interactivityService
                }));
                layers.push(new DataDotChart());
                return;
        }
    }

    function getLayerData(dataViews: DataView[], currentIdx: number, totalLayers: number): DataView[] {
        if (totalLayers > 1) {
            if (dataViews && dataViews.length > currentIdx)
                return [dataViews[currentIdx]];
            return [];
        }

        return dataViews;
    }

    function hasMultipleYAxes(layers: ICartesianVisual[]): boolean {
        debug.assertValue(layers, 'layers');

        return layers.length > 1;
    }

    //** Returns a boolean, that indicates if y axis title should be displayed. */
    function shouldShowYAxisLabel(layerNumber: number, valueAxisProperties: DataViewObject, yAxisWillMerge: boolean): boolean {
        return ((layerNumber === 0 && !!valueAxisProperties && !!valueAxisProperties['showAxisTitle']) ||
                (layerNumber === 1 && !yAxisWillMerge && !!valueAxisProperties && !!valueAxisProperties['secShowAxisTitle']));
    }

    function tryMergeYDomains(layers: ICartesianVisual[], visualOptions: CalculateScaleAndDomainOptions): MergedValueAxisResult {
        debug.assert(layers.length < 3, 'merging of more than 2 layers is not supported');

        var noMerge: MergedValueAxisResult = {
            domain: undefined,
            merged: false,
            tickCount: 3, //safe default for small viewports
            forceStartToZero: false
        };

        if (layers.length < 2)
            return noMerge;

        var min: number;
        var max: number;
        var minOfMax: number;
        var maxOfMin: number;

        // TODO: replace full calculateAxesProperties with just a data domain calc
        // we need to be aware of which chart require zero (column/bar) and which don't (line)
        var y1props = layers[0].calculateAxesProperties(visualOptions)[1];
        var y2props = layers[1].calculateAxesProperties(visualOptions)[1];
        var firstYDomain = y1props.scale.domain();
        var secondYDomain = y2props.scale.domain();

        if (firstYDomain[0] >= 0 && secondYDomain[0] >= 0) {
            noMerge.forceStartToZero = true;
        }

        if (y1props.values && y1props.values.length > 0 && y2props.values && y2props.values.length > 0) {
            noMerge.tickCount = Math.max(y1props.values.length, y2props.values.length);
        }

        // If domains don't intersect don't merge axis.
        if (firstYDomain[0] > secondYDomain[1] || firstYDomain[1] < secondYDomain[0])
            return noMerge;

        min = Math.min(firstYDomain[0], secondYDomain[0]);
        max = Math.max(firstYDomain[1], secondYDomain[1]);

        maxOfMin = Math.max(firstYDomain[0], secondYDomain[0]);
        minOfMax = Math.min(firstYDomain[1], secondYDomain[1]);

        var range = (max - min);

        if (range === 0) {
            return noMerge;
        }

        var intersection = Math.abs((minOfMax - maxOfMin) / range);

        // Only merge if intersection of domains greater than 10% of total range.
        if (intersection < COMBOCHART_DOMAIN_OVERLAP_TRESHOLD_PERCENTAGE)
            return noMerge;
        else
            return {
                domain: [min, max],
                merged: true,
                tickCount: noMerge.tickCount,
                forceStartToZero: false
            };
    }
    
    /** Computes the Cartesian Chart axes from the set of layers. */
    function calculateAxes(
        layers: ICartesianVisual[],
        viewport: IViewport,
        margin: IMargin,
        categoryAxisProperties: DataViewObject,
        valueAxisProperties: DataViewObject): CartesianAxisProperties {
        debug.assertValue(layers, 'layers');

        var visualOptions: CalculateScaleAndDomainOptions = {
            viewport: viewport,
            margin: margin,
            forcedXDomain: [categoryAxisProperties ? categoryAxisProperties['start'] : null, categoryAxisProperties ? categoryAxisProperties['end'] : null],
            showXLabel: false,
            showYLabel: false
        };
        
        var yAxisWillMerge = false;
        var mergeResult: MergedValueAxisResult;
        if (hasMultipleYAxes(layers)) {
            mergeResult = tryMergeYDomains(layers, visualOptions);
            yAxisWillMerge = mergeResult.merged;
            if (yAxisWillMerge) {
                visualOptions.forcedYDomain = mergeResult.domain;
            }
            else {
                visualOptions.forcedTickCount = mergeResult.tickCount;

            }
        }

        //set forcedYDomain after attempting the merge
        var forceValueDomainStartToZero = mergeResult ? mergeResult.forceStartToZero : false;
        
        visualOptions.forcedYDomain = valueAxisProperties ? [valueAxisProperties['start'], valueAxisProperties['end']] : null;

        var result: CartesianAxisProperties;
        for (var layerNumber = 0, len = layers.length; layerNumber < len; layerNumber++) {
            var currentlayer = layers[layerNumber];

            if (layerNumber === 1 && !yAxisWillMerge) {
                visualOptions.forcedYDomain = valueAxisProperties ? [valueAxisProperties['secStart'], valueAxisProperties['secEnd']] : null;
            }
            visualOptions.showXLabel = (!!categoryAxisProperties && !!categoryAxisProperties['showAxisTitle']);

            visualOptions.showYLabel = shouldShowYAxisLabel(layerNumber, valueAxisProperties, yAxisWillMerge);

            var axes = currentlayer.calculateAxesProperties(visualOptions);

            if (layerNumber === 0) {
                result = {
                    x: axes[0],                   
                    y1: axes[1],
                    forceValueDomainStartToZero: forceValueDomainStartToZero
                };
            }
            else if (axes && !result.y2) {
                if (axes[0].axis.scale().domain().length > result.x.axis.scale().domain().length) {
                    visualOptions.showYLabel = (!!valueAxisProperties && !!valueAxisProperties['showAxisTitle']);

                    var axes = currentlayer.calculateAxesProperties(visualOptions);
                    // no categories returned for the first layer, use second layer x-axis properties
                    result.x = axes[0];
                    // and 2nd value axis to be the primary
                    result.y1 = axes[1];
                }
                else {
                    // make sure all layers use the same x-axis/scale for drawing
                    currentlayer.overrideXScale(result.x);
                    if (!yAxisWillMerge)
                        result.y2 = axes[1];
                }
            }
        }

        return result;
    }
}