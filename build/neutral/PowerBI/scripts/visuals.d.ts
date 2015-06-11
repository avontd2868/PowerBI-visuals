/// <reference path="../../typedefs/d3/d3.d.ts" />
/// <reference path="../../Data/obj/data.d.ts" />
/// <reference path="../../typedefs/jquery-visible/jquery-visible.d.ts" />
/// <reference path="../../typedefs/jQuery/jQuery.d.ts" />
/// <reference path="../../typedefs/jquery-datatables/jquery.dataTables.d.ts" />
/// <reference path="../../typedefs/microsoftMaps/Microsoft.Maps.d.ts" />
/// <reference path="../../typedefs/moment/moment.d.ts" />
/// <reference path="../../JsCommon/obj/utility.d.ts" />
/// <reference path="../../typedefs/velocity/velocity-animate.d.ts" />
/// <reference path="../../typedefs/lodash/lodash.d.ts" />
/// <reference path="../../typedefs/quill/quill.d.ts" />
declare module powerbi.visuals {
    module visualStyles {
        function create(dataColors?: IDataColorPalette): IVisualStyle;
    }
}
declare module powerbi.visuals {
    module AnimatorCommon {
        var MinervaAnimationDuration: number;
    }
    /** We just need to have a non-null animator to allow axis animations in cartesianChart .
      * Use this temporarily for Line/Scatter until we add more animations (MinervaPlugins only).
      */
    class NullAnimator {
        animate(options: any): any;
    }
}
declare module powerbi.visuals {
    interface ColumnChartAnimationOptions {
        viewModel: ColumnChartData;
        series: D3.UpdateSelection;
        layout: IColumnLayout;
        itemCS: ClassAndSelector;
        interactivityService: IInteractivityService;
        labelGraphicsContext: D3.Selection;
        labelLayout: ILabelLayout;
        viewPort: IViewport;
    }
    interface ColumnChartAnimationResult {
        failed: boolean;
        shapes: D3.UpdateSelection;
        dataLabels: D3.UpdateSelection;
    }
    interface IColumnChartAnimator {
        animate(options: ColumnChartAnimationOptions): ColumnChartAnimationResult;
    }
    class WebColumnChartAnimator implements IColumnChartAnimator {
        private previousViewModel;
        private animationDuration;
        animate(options: ColumnChartAnimationOptions): ColumnChartAnimationResult;
        private animateNormalToHighlighted(options);
        private animateHighlightedToHighlighted(options);
        private animateHighlightedToNormal(options);
        private animateDefaultShapes(data, series, layout, itemCS);
        private animateDefaultDataLabels(options);
    }
}
declare module powerbi.visuals {
    interface DonutChartAnimationOptions {
        viewModel: DonutData;
        graphicsContext: D3.Selection;
        colors: IDataColorPalette;
        layout: DonutLayout;
        sliceWidthRatio: number;
        radius: number;
        viewport: IViewport;
        interactivityService: IInteractivityService;
    }
    interface DonutChartAnimationResult {
        failed: boolean;
        shapes: D3.UpdateSelection;
        highlightShapes: D3.UpdateSelection;
    }
    interface IDonutChartAnimator {
        animate(options: DonutChartAnimationOptions): DonutChartAnimationResult;
    }
    class WebDonutChartAnimator implements IDonutChartAnimator {
        private previousViewModel;
        private animationDuration;
        animate(options: DonutChartAnimationOptions): DonutChartAnimationResult;
        private animateNormalToHighlighted(options);
        private animateHighlightedToHighlighted(options);
        private animateHighlightedToNormal(options);
        private animateDefaultShapes(options);
        private animateDefaultHighlightShapes(options);
    }
}
declare module powerbi.visuals {
    interface FunnelAnimationOptions {
        viewModel: FunnelData;
        interactivityService: IInteractivityService;
        layout: IFunnelLayout;
        axisGraphicsContext: D3.Selection;
        shapeGraphicsContext: D3.Selection;
        labelGraphicsContext: D3.Selection;
        axisOptions: FunnelAxisOptions;
        slicesWithoutHighlights: FunnelSlice[];
        labelLayout: ILabelLayout;
    }
    interface FunnelAnimationResult {
        failed: boolean;
        shapes: D3.UpdateSelection;
        dataLabels: D3.UpdateSelection;
    }
    interface IFunnelAnimator {
        animate(options: FunnelAnimationOptions): FunnelAnimationResult;
    }
    class WebFunnelAnimator implements IFunnelAnimator {
        private previousViewModel;
        private animationDuration;
        animate(options: FunnelAnimationOptions): FunnelAnimationResult;
        private animateNormalToHighlighted(options);
        private animateHighlightedToHighlighted(options);
        private animateHighlightedToNormal(options);
        private animateDefaultAxis(graphicsContext, axisOptions);
        private animateDefaultShapes(data, slices, graphicsContext, layout);
        private animateDefaultDataLabels(options);
    }
}
declare module powerbi.visuals {
    interface TreemapAnimationOptions {
        viewModel: TreemapData;
        nodes: D3.Layout.GraphNode[];
        highlightNodes: D3.Layout.GraphNode[];
        labeledNodes: D3.Layout.GraphNode[];
        shapeGraphicsContext: D3.Selection;
        labelGraphicsContext: D3.Selection;
        interactivityService: IInteractivityService;
    }
    interface TreemapAnimationResult {
        failed: boolean;
        shapes: D3.UpdateSelection;
        highlightShapes: D3.UpdateSelection;
        labels: D3.UpdateSelection;
    }
    interface ITreemapAnimator {
        animate(options: TreemapAnimationOptions): TreemapAnimationResult;
    }
    class WebTreemapAnimator implements ITreemapAnimator {
        previousViewModel: TreemapData;
        animationDuration: number;
        animate(options: TreemapAnimationOptions): TreemapAnimationResult;
        private animateNormalToHighlighted(options);
        private animateHighlightedToHighlighted(options);
        private animateHighlightedToNormal(options);
        private animateDefaultShapes(context, nodes, hasSelection, hasHighlights);
        private animateDefaultHighlightShapes(context, nodes, hasSelection, hasHighlights);
        private animateDefaultLabels(context, nodes);
    }
}
declare module powerbi.visuals {
    interface ColumnBehaviorOptions {
        datapoints: SelectableDataPoint[];
        bars: D3.Selection;
        clearCatcher: D3.Selection;
        hasHighlights: boolean;
    }
    class ColumnChartWebBehavior {
        select(hasSelection: boolean, selection: D3.Selection, hasHighlights: boolean): void;
    }
}
declare module powerbi.visuals {
    interface DataDotChartBehaviorOptions {
        datapoints: SelectableDataPoint[];
        dots: D3.Selection;
        clearCatcher: D3.Selection;
    }
    class DataDotChartWebBehavior {
        select(hasSelection: boolean, selection: D3.Selection): void;
    }
}
declare module powerbi.visuals {
    interface DonutBehaviorOptions {
        datapoints: SelectableDataPoint[];
        slices: D3.Selection;
        highlightSlices: D3.Selection;
        clearCatcher: D3.Selection;
        allowDrilldown: boolean;
        visual: DonutChart;
        hasHighlights: boolean;
        svg: D3.Selection;
    }
    class DonutChartWebBehavior {
        private allowDrilldown;
        private isDrilled;
        private visual;
        private svg;
        constructor(options: DonutBehaviorOptions);
        select(hasSelection: boolean, selection: D3.Selection, highlighted: boolean, hasHighlights: boolean, data?: DonutDataPoint): void;
        mouseOver(data: DonutDataPoint): void;
        mouseOut(data: DonutDataPoint): void;
        private setDataLabelStyle(data, dimmed);
    }
}
declare module powerbi.visuals {
    interface FunnelBehaviorOptions {
        datapoints: SelectableDataPoint[];
        bars: D3.Selection;
        labels: D3.Selection;
        clearCatcher: D3.Selection;
        hasHighlights: boolean;
    }
    class FunnelWebBehavior {
        select(hasSelection: boolean, selection: D3.Selection, hasHighlights: boolean): void;
    }
}
declare module powerbi.visuals {
    interface LineChartBehaviorOptions {
        dataPoints: SelectableDataPoint[];
        lines: D3.Selection;
        shadows: D3.Selection;
        dots: D3.Selection;
        areas: D3.Selection;
        clearCatcher: D3.Selection;
    }
    class LineChartWebBehavior {
        select(hasSelection: boolean, lines: D3.Selection, dots: D3.Selection, areas: D3.Selection): void;
    }
}
declare module powerbi.visuals {
    interface MapBehaviorOptions {
        bubbles?: D3.Selection;
        slices?: D3.Selection;
        shapes?: D3.Selection;
        clearCatcher: D3.Selection;
        dataPoints: SelectableDataPoint[];
    }
    class MapBehavior {
        select(hasSelection: boolean, bubbles: D3.Selection, slices: D3.Selection, shapes: D3.Selection): void;
    }
}
declare module powerbi.visuals {
    enum DragType {
        Drag = 0,
        DragEnd = 1,
    }
    interface ScatterBehaviorOptions {
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
    class ScatterChartWebBehavior {
        select(hasSelection: boolean, datapoints: D3.Selection): void;
    }
    class ScatterChartMobileBehavior {
        private static CrosshairClassName;
        private static ScatterChartCircleTagName;
        private static DotClassName;
        private static DotClassSelector;
        private static Horizontal;
        private static Vertical;
        private host;
        private mainGraphicsContext;
        private data;
        private crosshair;
        private crosshairHorizontal;
        private crosshairVertical;
        private lastDotIndex;
        private xAxisProperties;
        private yAxisProperties;
        setOptions(options: ScatterBehaviorOptions): void;
        select(hasSelection: boolean, datapoints: D3.Selection, dataPoint: SelectableDataPoint, index: number): void;
        selectRoot(): void;
        drag(t: DragType): void;
        private onDrag();
        private onClick();
        private getMouseCoordinates();
        private selectDotByIndex(index);
        private selectDot(dotIndex);
        private moveCrosshairToIndexDot(index);
        private moveCrosshairToXY(x, y);
        private drawCrosshair(addTo, x, y, width, height);
        private findClosestDotIndex(x, y);
        private updateLegend(dotIndex);
        private createLegendDataPoints(dotIndex);
    }
}
declare module powerbi.visuals {
    interface SlicerBehaviorOptions {
        datapoints: SlicerDataPoint[];
        slicerItemContainers: D3.Selection;
        slicerItemLabels: D3.Selection;
        slicerItemInputs: D3.Selection;
        slicerClear: D3.Selection;
    }
    class SlicerWebBehavior {
        select(selectionLabels: D3.Selection): void;
        mouseInteractions(selectionLabels: D3.Selection): void;
        clearSlicers(selectionLabels: D3.Selection, slicerItemInputs: D3.Selection): void;
    }
}
declare module powerbi.visuals {
    interface LegendBehaviorOptions {
        datapoints: LegendDataPoint[];
        legendItems: D3.Selection;
        legendIcons: D3.Selection;
        clearCatcher: D3.Selection;
    }
    class LegendWebBehavior {
        private static selectedLegendColor;
        select(hasSelection: boolean, legendIcons: D3.Selection): void;
    }
}
declare module powerbi.visuals {
    interface TreemapBehaviorOptions {
        shapes: D3.Selection;
        highlightShapes: D3.Selection;
        labels: D3.Selection;
        nodes: TreemapNode[];
        hasHighlights: boolean;
    }
    class TreemapWebBehavior {
        select(hasSelection: boolean, datapoints: D3.Selection, hasHighlights: boolean): void;
    }
}
declare module powerbi.visuals {
    interface WaterfallChartBehaviorOptions {
        datapoints: SelectableDataPoint[];
        bars: D3.Selection;
        clearCatcher: D3.Selection;
    }
    class WaterfallChartWebBehavior {
        select(hasSelection: boolean, selection: D3.Selection): void;
    }
}
declare module powerbi.visuals {
    interface VisualConfig {
        visualType: string;
        projections: data.QueryProjectionsByRole[];
        config?: any;
    }
}
declare module powerbi.visuals {
    interface IAxisProperties {
        scale: D3.Scale.GenericScale<any>;
        axis: D3.Svg.Axis;
        values: any[];
        graphicsContext?: D3.Selection;
        axisType: ValueType;
        formatter: IValueFormatter;
        axisLabel: string;
        isCategoryAxis: boolean;
        xLabelMaxWidth?: number;
        /** (optional) the width/height of each category on the axis*/
        categoryThickness?: number;
        outerPadding?: number;
    }
    interface IMargin {
        top: number;
        bottom: number;
        left: number;
        right: number;
    }
    interface CreateAxisOptions {
        /** the dimension length for the axis, in pixels */
        pixelSpan: number;
        /** the data domain. [min, max] for a scalar axis, or [1...n] index array for ordinal */
        dataDomain: number[];
        /** the DataViewMetadataColumn will be used for dataType and tick value formatting */
        metaDataColumn: DataViewMetadataColumn;
        /** identifies the property for the format string */
        formatStringProp: DataViewObjectPropertyIdentifier;
        /** outerPadding to be applied to the axis */
        outerPadding: number;
        /** indicates if this is the category axis */
        isCategoryAxis?: boolean;
        /** if true and the dataType is numeric or dateTime, create a linear axis, else create an ordinal axis */
        isScalar?: boolean;
        /** (optional) the scale is inverted for a vertical axis, and different optimizations are made for tick labels */
        isVertical?: boolean;
        /** (optional) for visuals that do not need zero (e.g. column/bar) use tickInterval */
        useTickIntervalForDisplayUnits?: boolean;
        /** (optional) combo charts can override the tick count to align y1 and y2 grid lines */
        forcedTickCount?: number;
        /** (optional) callback for looking up actual values from indices, used when formatting tick labels */
        getValueFn?: (index: number, type: ValueType) => any;
        /** (optional) the width/height of each category on the axis*/
        categoryThickness?: number;
    }
    interface CreateScaleResult {
        scale: D3.Scale.GenericScale<any>;
        bestTickCount: number;
    }
    module AxisHelper {
        function getRecommendedNumberOfTicksForXAxis(availableWidth: number): number;
        function getRecommendedNumberOfTicksForYAxis(availableWidth: number): number;
        /** Get the best number of ticks based on minimum value, maximum value, measure metadata and max tick count.
          * @min - The minimum of the data domain.
          * @max - The maximum of the data domain.
          * @valuesMetadata - The measure metadata array.
          * @maxTickCount - The max count of intervals.
          * @is100Pct - Whether this is 100 percent chart.
          */
        function getBestNumberOfTicks(min: number, max: number, valuesMetadata: DataViewMetadataColumn[], maxTickCount: number, isDateTime?: boolean): number;
        function hasNonIntegerData(valuesMetadata: DataViewMetadataColumn[]): boolean;
        function getRecommendedTickValues(maxTicks: number, scale: D3.Scale.GenericScale<any>, axisType: ValueType, isScalar: boolean): any[];
        function getRecommendedTickValuesForAnOrdinalRange(maxTicks: number, labels: string[]): string[];
        function getRecommendedTickValuesForALinearRange(maxTicks: number, scale: D3.Scale.GenericScale<any>): number[];
        function normalizeLinearDomain(domain: NumberRange): NumberRange;
        function getMargin(availableWidth: number, availableHeight: number, xMargin: number, yMargin: number): IMargin;
        function getTickLabelMargins(viewport: IViewport, leftMarginLimit: number, textMeasurer: (textProperties) => number, xAxisProperties: IAxisProperties, y1AxisProperties: IAxisProperties, rotateX: boolean, maxHeight: number, properties: TextProperties, y2AxisProperties?: IAxisProperties, scrollbarVisible?: boolean, showOnRight?: boolean, renderXAxis?: boolean, renderYAxes?: boolean, renderY2Axis?: boolean): {
            xMax: number;
            yLeft: number;
            yRight: number;
        };
        function columnDataTypeHasValue(dataType: ValueType): boolean;
        function createOrdinalType(): ValueType;
        function isOrdinal(type: ValueType): boolean;
        function isOrdinalScale(scale: any): boolean;
        function isDateTime(type: ValueType): boolean;
        function invertScale(scale: any, x: any): any;
        function extent(scale: any): number[];
        function invertOrdinalScale(scale: D3.Scale.OrdinalScale, x: number): any;
        function getOrdinalScaleClosestDataPointIndex(scale: D3.Scale.OrdinalScale, x: number): number;
        function diffScaled(scale: D3.Scale.GenericScale<any>, value1: any, value2: any): number;
        function createDomain(data: CartesianSeries[], axisType: ValueType, isScalar: boolean, forcedScalarDomain: any[]): number[];
        function ensureValuesInRange(values: number[], min: number, max: number): number[];
        /** Gets the ValueType of a category column, defaults to Text if the type is not present. */
        function getCategoryValueType(metadataColumn: DataViewMetadataColumn): ValueType;
        /**
         * Create a D3 axis including scale. Can be vertical or horizontal, and either datetime, numeric, or text.
         * @param {CreateAxisOptions} options the properties used to create the axis
         */
        function createAxis(options: CreateAxisOptions): IAxisProperties;
        function createScale(options: CreateAxisOptions): CreateScaleResult;
        function formatAxisTickValues(axis: D3.Svg.Axis, tickValues: any[], formatter: IValueFormatter, dataType: ValueType, isScalar: boolean, getValueFn?: (index: number, type: ValueType) => any): any[];
        /**
         * createValueDomain - creates a [min,max] from your Cartiesian data values
         * @param {CartesianSeries[]} data the series array of CartesianDataPoints
         * @param {boolean} includeZero columns and bars includeZero, line and scatter do not.
         */
        function createValueDomain(data: CartesianSeries[], includeZero: boolean): number[];
        module LabelLayoutStrategy {
            function willRotate(axisProperties: IAxisProperties, availableWidth: number, textMeasurer: ITextAsSVGMeasurer, properties: TextProperties): boolean;
            var DefaultRotation: {
                sine: number;
                cosine: number;
                tangent: number;
                transform: string;
                dy: string;
            };
            var DefaultRotationWithScrollbar: {
                sine: number;
                cosine: number;
                tangent: number;
                transform: string;
                dy: string;
            };
            function rotate(text: D3.Selection, availableWidth: number, maxBottomMargin: number, svgEllipsis: (textElement: SVGTextElement, maxWidth: number) => void, needRotate: boolean, needEllipsis: boolean, axisProperties: IAxisProperties, margin: IMargin, scrollbarVisible: boolean): void;
            function clip(text: D3.Selection, availableWidth: number, svgEllipsis: (textElement: SVGTextElement, maxWidth: number) => void): void;
        }
        module ToolTip {
            function createCallout(): JQuery;
            function clearCallout(callout: JQuery): void;
            function renderCallout(callout: JQuery, x: number, rangeEnd: number, leftMargin: number): void;
        }
        function createOrdinalScale(pixelSpan: number, dataDomain: any[], outerPaddingRatio?: number): D3.Scale.OrdinalScale;
        function createLinearScale(pixelSpan: number, dataDomain: any[], outerPadding?: number, niceCount?: number): D3.Scale.LinearScale;
        function getRangeForColumn(sizeColumn: DataViewValueColumn): NumberRange;
        function combineDomain(forcedDomain: any[], domain: any[]): any[];
        function scaleShouldClamp(combinedDomain: any[], domain: any[]): boolean;
        function normalizeNonFiniteNumber(value: number): number;
    }
}
declare module powerbi.visuals {
    module CartesianHelper {
        function getCategoryAxisProperties(dataViewMetadata: DataViewMetadata, axisTitleOnByDefault?: boolean): DataViewObject;
        function getValueAxisProperties(dataViewMetadata: DataViewMetadata, axisTitleOnByDefault?: boolean): DataViewObject;
        function forceValueDomainToZero(valueAxisProperties: DataViewObject): void;
        function isScalar(isScalar: boolean, xAxisCardProperties: DataViewObject): boolean;
    }
}
declare module powerbi.visuals {
    class ColorHelper {
        private fillProp;
        private defaultDataPointColor;
        private colors;
        constructor(colors: IDataColorPalette, fillProp: DataViewObjectPropertyIdentifier, defaultDataPointColor?: string);
        /**
         * Gets the color for the given series value. If no explicit color or default color has been set then the color is
         */
        getColorForSeriesValue(objects: DataViewObjects, fieldIds: powerbi.data.SQExpr[], value: string): string;
        /** Gets the color for the given measure. */
        getColorForMeasure(objects: DataViewObjects, queryName: string): string;
        static normalizeSelector(selector: data.Selector, isSingleSeries?: boolean): data.Selector;
    }
}
declare module powerbi.visuals {
    module ColumnUtil {
        var DimmedOpacity: number;
        var DefaultOpacity: number;
        function getTickCount(min: number, max: number, valuesMetadata: DataViewMetadataColumn[], maxTickCount: number, is100Pct: boolean, forcedTickCount?: number): number;
        function applyUserMinMax(isScalar: boolean, dataView: DataViewCategorical, xAxisCardProperties: DataViewObject): DataViewCategorical;
        function transformDomain(dataView: DataViewCategorical, min: DataViewPropertyValue, max: DataViewPropertyValue): DataViewCategorical;
        function getCategoryAxis(data: ColumnChartData, size: number, layout: CategoryLayout, isVertical: boolean, forcedXMin?: DataViewPropertyValue, forcedXMax?: DataViewPropertyValue): IAxisProperties;
        function applyInteractivity(columns: D3.Selection, onDragStart: any): void;
        function getFillOpacity(selected: boolean, highlight: boolean, hasSelection: boolean, hasPartialHighlights: boolean): number;
        function getClosestColumnIndex(coordinate: number, columnsCenters: number[]): number;
        function setChosenColumnOpacity(mainGraphicsContext: D3.Selection, columnGroupSelector: string, selectedColumnIndex: number, lastColumnIndex: number): void;
        function drawSeries(data: ColumnChartData, graphicsContext: D3.Selection, axisOptions: ColumnAxisOptions): D3.UpdateSelection;
        function drawDefaultShapes(data: ColumnChartData, series: D3.UpdateSelection, layout: IColumnLayout, itemCS: ClassAndSelector): D3.UpdateSelection;
        function drawDefaultLabels(series: D3.UpdateSelection, context: D3.Selection, layout: ILabelLayout, viewPort: IViewport, isAnimator?: boolean, animationDuration?: number): D3.UpdateSelection;
        function normalizeInfinityInScale(scale: D3.Scale.GenericScale<any>): void;
    }
    module ClusteredUtil {
        function createValueFormatter(valuesMetadata: DataViewMetadataColumn[], interval: number): IValueFormatter;
        function clearColumns(mainGraphicsContext: D3.Selection, itemCS: ClassAndSelector): void;
    }
    interface ValueMultiplers {
        pos: number;
        neg: number;
    }
    module StackedUtil {
        function getSize(scale: D3.Scale.GenericScale<any>, size: number): number;
        function calcValueDomain(data: ColumnChartSeries[], is100pct: boolean): NumberRange;
        function getValueAxis(data: ColumnChartData, is100Pct: boolean, size: number, scaleRange: number[], forcedTickCount?: number, forcedYDomain?: any[]): IAxisProperties;
        function createValueFormatter(valuesMetadata: DataViewMetadataColumn[], is100Pct: boolean, interval: number): IValueFormatter;
        function getStackedMultiplier(dataView: DataViewCategorical, rowIdx: number, seriesCount: number, categoryCount: number, converterStrategy: IColumnChartConverterStrategy): ValueMultiplers;
        function clearColumns(mainGraphicsContext: D3.Selection, itemCS: ClassAndSelector): void;
    }
    class DataWrapper {
        private data;
        private isScalar;
        constructor(columnChartData: CartesianData, isScalar: boolean);
        lookupXValue(index: number, type: ValueType): any;
    }
}
declare module powerbi.visuals {
    interface PivotedCategoryInfo {
        categories?: any[];
        categoryFormatter?: IValueFormatter;
        categoryIdentities?: DataViewScopeIdentity[];
        categoryObjects?: DataViewObjects[];
    }
    module converterHelper {
        function categoryIsAlsoSeriesRole(dataView: DataViewCategorical, seriesRoleName: string, categoryRoleName: string): boolean;
        function getPivotedCategories(dataView: DataViewCategorical, formatStringProp: DataViewObjectPropertyIdentifier): PivotedCategoryInfo;
        function getSeriesName(source: DataViewMetadataColumn): string;
        function getFormattedLegendLabel(source: DataViewMetadataColumn, values: DataViewValueColumns, formatStringProp: DataViewObjectPropertyIdentifier): string;
        function createAxesLabels(categoryAxisProperties: DataViewObject, valueAxisProperties: DataViewObject, category: DataViewMetadataColumn, values: DataViewMetadataColumn[]): {
            xAxisLabel: any;
            yAxisLabel: any;
        };
    }
}
declare module powerbi.visuals {
    enum PointLabelPosition {
        Above = 0,
        Bellow = 1,
    }
    interface PointDataLabelsSettings extends VisualDataLabelsSettings {
        position: PointLabelPosition;
    }
    interface VisualDataLabelsSettings {
        show: boolean;
        displayUnits?: number;
        showCategory?: boolean;
        position?: any;
        precision?: number;
        labelColor: string;
        overrideDefaultColor: boolean;
        formatterOptions: ValueFormatterOptions;
    }
    interface LabelEnabledDataPoint {
        labelX?: number;
        labelY?: number;
        labelFill?: string;
        labeltext?: string;
    }
    interface ILabelLayout {
        labelText: (d: any) => string;
        labelLayout: {
            y: (d: any, i: number) => number;
            x: (d: any, i: number) => number;
        };
        filter: (d: any) => boolean;
        style: {};
    }
    interface DataLabelObject extends DataViewObject {
        show: boolean;
        color: Fill;
        labelDisplayUnits: number;
        labelPrecision?: number;
        labelPosition: any;
    }
    module dataLabelUtils {
        var labelMargin: number;
        var maxLabelWidth: number;
        var defaultColumnLabelMargin: number;
        var defaultColumnHalfLabelHeight: number;
        var LabelTextProperties: TextProperties;
        var defaultLabelColor: string;
        var defaultInsideLabelColor: string;
        var hundredPercentFormat: string;
        function getDefaultLabelSettings(show?: boolean, labelColor?: string): VisualDataLabelsSettings;
        function getDefaultTreemapLabelSettings(): VisualDataLabelsSettings;
        function getDefaultColumnLabelSettings(isLabelPositionInside: boolean): VisualDataLabelsSettings;
        function getDefaultPointLabelSettings(): PointDataLabelsSettings;
        function getDefaultDonutLabelSettings(): VisualDataLabelsSettings;
        function drawDefaultLabelsForDataPointChart(data: any[], context: D3.Selection, layout: ILabelLayout, viewport: IViewport, isAnimator?: boolean, animationDuration?: number): D3.UpdateSelection;
        function drawDefaultLabelsForFunnelChart(data: any[], context: D3.Selection, layout: ILabelLayout, isAnimator?: boolean, animationDuration?: number): D3.UpdateSelection;
        function cleanDataLabels(context: D3.Selection): void;
        function getLabelFormattedText(label: string | number, maxWidth?: number, format?: string): string;
        function getMapLabelLayout(labelSettings: PointDataLabelsSettings): ILabelLayout;
        function getColumnChartLabelLayout(data: ColumnChartData, labelLayoutXY: any, isColumn: boolean, isHundredPercent: boolean, axisFormatter: IValueFormatter): ILabelLayout;
        function getScatterChartLabelLayout(xScale: D3.Scale.GenericScale<any>, yScale: D3.Scale.GenericScale<any>, labelSettings: PointDataLabelsSettings, viewport: IViewport, sizeRange: NumberRange): ILabelLayout;
        function getLineChartLabelLayout(xScale: D3.Scale.GenericScale<any>, yScale: D3.Scale.GenericScale<any>, labelSettings: PointDataLabelsSettings, isScalar: boolean): ILabelLayout;
        function getFunnelChartLabelLayout(data: FunnelData, axisOptions: FunnelAxisOptions, innerTextHeightDelta: number, textMinimumPadding: number, labelSettings: VisualDataLabelsSettings, currentViewport: IViewport): ILabelLayout;
        function enumerateDataLabels(dataLabelsSettings: VisualDataLabelsSettings, withPosition: boolean, withPrecision?: boolean, withDisplayUnit?: boolean): VisualObjectInstance[];
        function enumerateCategoryLabels(dataLabelsSettings: VisualDataLabelsSettings, withFill: boolean, isDonutChart?: boolean): VisualObjectInstance[];
        function getDefaultFunnelLabelSettings(defaultColor?: string): VisualDataLabelsSettings;
        function getLabelFormatterOptions(labelSetting: VisualDataLabelsSettings, formatOverride?: string, value2?: number): ValueFormatterOptions;
    }
}
declare module powerbi.visuals {
    module DataRoleHelper {
        function getMeasureIndexOfRole(grouped: DataViewValueColumnGroup[], roleName: string, defaultIndexIfNoRole?: number): number;
        function hasRole(column: DataViewMetadataColumn, name: string): boolean;
    }
}
declare module powerbi.visuals {
    interface InteractivityVisitor {
        visitColumnChart(options: ColumnBehaviorOptions): any;
        visitDataDotChart(options: DataDotChartBehaviorOptions): any;
        visitDonutChart(options: DonutBehaviorOptions): any;
        visitFunnel(options: FunnelBehaviorOptions): any;
        visitLegend(options: LegendBehaviorOptions): any;
        visitMap(options: MapBehaviorOptions): any;
        visitScatterChart(options: ScatterBehaviorOptions): any;
        visitSlicer(options: SlicerBehaviorOptions): any;
        visitTreemap(options: TreemapBehaviorOptions): any;
        visitWaterfallChart(options: WaterfallChartBehaviorOptions): any;
        visitLegend(options: LegendBehaviorOptions): any;
        visitLineChart(options: LineChartBehaviorOptions): any;
    }
    interface SelectableDataPoint {
        selected: boolean;
        identity: SelectionId;
    }
    module VisualInteractivityFactory {
        function buildInteractivityService(options: VisualInitOptions): IInteractivityService;
    }
}
declare module powerbi.visuals {
    import DataView = powerbi.DataView;
    function showWarningMessageIfAnyInvalidValues(dataViews: DataView[], hostServices: IVisualHostServices, supportsNaN: boolean, supportsNegativeInfinity: boolean, supportsPositiveInfinity: boolean): void;
    class InvalidDataValuesChecker {
        private supportsNaN;
        private supportsNegativeInfinity;
        private supportsPositiveInfinity;
        private hasNaN;
        private hasNegativeInfinity;
        private hasPositiveInfinity;
        private hasOutOfRange;
        private hostService;
        constructor(hostService: IVisualHostServices, supportsNaN: boolean, supportsNegativeInfinity: boolean, supportsPositiveInfinity: boolean);
        showWarningMessage(dataViews: DataView[]): void;
        private loadWarningStatus(dataViews);
    }
}
declare module powerbi.visuals {
    interface IListView {
        data(data: any[], dataIdFunction: (d) => {}): IListView;
        rowHeight(rowHeight: number): IListView;
        viewport(viewport: IViewport): IListView;
        render(sizeChanged: boolean, resetScrollbarPosition?: boolean): void;
        empty(): void;
    }
    module ListViewFactory {
        function createHTMLListView(options: any): IListView;
        function createSVGListView(options: any): IListView;
    }
    interface ListViewOptions {
        enter: (selection: D3.Selection) => void;
        exit: (selection: D3.Selection) => void;
        update: (selection: D3.Selection) => void;
        loadMoreData: () => void;
        baseContainer: D3.Selection;
        rowHeight: number;
        viewport: IViewport;
    }
}
declare module powerbi.visuals {
    import Selector = powerbi.data.Selector;
    /**
     * A combination of identifiers used to uniquely identify
     * data points and their bound geometry.
     */
    class SelectionId {
        private selector;
        private key;
        highlight: boolean;
        constructor(selector: Selector, highlight: boolean);
        equals(other: SelectionId): boolean;
        /** Checks equality against other for all identifiers existing in this */
        includes(other: SelectionId, ignoreHighlight?: boolean): boolean;
        getKey(): string;
        /** Temporary workaround since a few things currently rely on this, but won't need to. */
        hasIdentity(): boolean;
        getSelector(): Selector;
        static createNull(highlight?: boolean): SelectionId;
        static createWithId(id: DataViewScopeIdentity, highlight?: boolean): SelectionId;
        static createWithMeasure(measureId: string, highlight?: boolean): SelectionId;
        static createWithIdAndMeasure(id: DataViewScopeIdentity, measureId: string, highlight?: boolean): SelectionId;
        static createWithIds(id1: DataViewScopeIdentity, id2: DataViewScopeIdentity, highlight?: boolean): SelectionId;
        static createWithIdsAndMeasure(id1: DataViewScopeIdentity, id2: DataViewScopeIdentity, measureId: string, highlight?: boolean): SelectionId;
        static createWithHighlight(original: SelectionId): SelectionId;
        private static idArray(id1, id2);
    }
}
declare module powerbi.visuals {
    module shapes {
        interface IPoint {
            x: number;
            y: number;
        }
        module Point {
            function offset(point: IPoint, offsetX: number, offsetY: number): IPoint;
            function equals(point: IPoint, other: IPoint): boolean;
            function clone(point: IPoint): IPoint;
            function toString(point: IPoint): string;
            function serialize(point: IPoint): string;
            function getDistance(point: IPoint, other: IPoint): number;
            function equalWithPrecision(point1: IPoint, point2: IPoint): boolean;
            function parsePoint(value: any, defaultValue?: IPoint): IPoint;
        }
        interface ISize {
            width: number;
            height: number;
        }
        module Size {
            function isEmpty(size: ISize): boolean;
            function equals(size: ISize, other: ISize): boolean;
            function clone(size: ISize): ISize;
            function inflate(size: ISize, padding: IThickness): ISize;
            function deflate(size: ISize, padding: IThickness): ISize;
            function combine(size: ISize, other: ISize): ISize;
            function toRect(size: ISize): IRect;
            function toString(size: ISize): string;
            function equal(size1: ISize, size2: ISize): boolean;
            function equalWithPrecision(size1: ISize, size2: ISize): boolean;
            function parseSize(value: any, defaultValue?: ISize): ISize;
        }
        interface IRect {
            left: number;
            top: number;
            width: number;
            height: number;
        }
        module Rect {
            function getOffset(rect: IRect): IPoint;
            function getSize(rect: IRect): ISize;
            function setSize(rect: IRect, value: ISize): void;
            function right(rect: IRect): number;
            function bottom(rect: IRect): number;
            function topLeft(rect: IRect): IPoint;
            function topRight(rect: IRect): IPoint;
            function bottomLeft(rect: IRect): IPoint;
            function bottomRight(rect: IRect): IPoint;
            function equals(rect: IRect, other: IRect): boolean;
            function clone(rect: IRect): IRect;
            function toString(rect: IRect): string;
            function offset(rect: IRect, offsetX: number, offsetY: number): IRect;
            function inflate(rect: IRect, padding: IThickness): IRect;
            function deflate(rect: IRect, padding: IThickness): IRect;
            function inflateBy(rect: IRect, padding: number): IRect;
            function deflateBy(rect: IRect, padding: number): IRect;
            function getClosestPoint(rect: IRect, x: number, y: number): IPoint;
            function equal(rect1: IRect, rect2: IRect): boolean;
            function equalWithPrecision(rect1: IRect, rect2: IRect): boolean;
            function isEmpty(rect: IRect): boolean;
            function containsPoint(rect: IRect, point: IPoint): boolean;
            function isIntersecting(rect1: IRect, rect2: IRect): boolean;
            function intersect(rect1: IRect, rect2: IRect): IRect;
            function combine(rect1: IRect, rect2: IRect): IRect;
            function parseRect(value: any, defaultValue?: IRect): IRect;
        }
        interface IThickness {
            top: number;
            left: number;
            right: number;
            bottom: number;
        }
        module Thickness {
            function inflate(thickness: IThickness, other: IThickness): IThickness;
            function getWidth(thickness: IThickness): number;
            function getHeight(thickness: IThickness): number;
            function clone(thickness: IThickness): IThickness;
            function equals(thickness: IThickness, other: IThickness): boolean;
            function flipHorizontal(thickness: IThickness): void;
            function flipVertical(thickness: IThickness): void;
            function toString(thickness: IThickness): string;
            function toCssString(thickness: IThickness): string;
            function isEmpty(thickness: IThickness): boolean;
            function equal(thickness1: IThickness, thickness2: IThickness): boolean;
            function equalWithPrecision(thickness1: IThickness, thickness2: IThickness): boolean;
            function parseThickness(value: any, defaultValue?: IThickness, resetValue?: any): IThickness;
        }
        interface IVector {
            x: number;
            y: number;
        }
        module Vector {
            function isEmpty(vector: IVector): boolean;
            function equals(vector: IVector, other: IPoint): boolean;
            function clone(vector: IVector): IVector;
            function toString(vector: IVector): string;
            function getLength(vector: IVector): number;
            function getLengthSqr(vector: IVector): number;
            function scale(vector: IVector, scalar: number): IVector;
            function normalize(vector: IVector): IVector;
            function rotate90DegCW(vector: IVector): IVector;
            function rotate90DegCCW(vector: IVector): IVector;
            function rotate(vector: IVector, angle: number): IVector;
            function equal(vector1: IVector, vector2: IVector): boolean;
            function equalWithPrecision(vector1: IVector, vector2: IVector): boolean;
            function add(vect1: IVector, vect2: IVector): IVector;
            function subtract(vect1: IVector, vect2: IVector): IVector;
            function dotProduct(vect1: IVector, vect2: IVector): number;
            function getDeltaVector(p0: IPoint, p1: IPoint): IVector;
        }
    }
}
declare module powerbi.visuals {
    /**
     * Contains functions/constants to aid in SVG manupilation.
    */
    module SVGUtil {
        /**
         * very small values, when stringified, may be converted to scientific notation and cause a temporarily
         * invalid attribute or style property value. For example, the number 0.0000001 is converted to the string "1e-7".
         * This is particularly noticeable when interpolating opacity values. To avoid scientific notation,
         * start or end the transition at 1e-6, which is the smallest value that is not stringified in exponential notation.
        */
        var AlmostZero: number;
        /**
         * Creates a translate string for use with the SVG transform call.
        */
        function translate(x: number, y: number): string;
        /**
         * Creates a translateX string for use with the SVG transform call.
        */
        function translateXWithPixels(x: number): string;
        function translateWithPixels(x: number, y: number): string;
        /**
         * Creates a translate + rotate string for use with the SVG transform call.
        */
        function translateAndRotate(x: number, y: number, px: number, py: number, angle: number): string;
        /**
         * Forces all D3 transitions to complete.
         * Normally, zero-delay transitions are executed after an instantaneous delay (<10ms).
         * This can cause a brief flicker if the browser renders the page twice: once at the end of the first event loop,
         * then again immediately on the first timer callback. By flushing the timer queue at the end of the first event loop,
         * you can run any zero-delay transitions immediately and avoid the flicker.
         *
         * These flickers are noticable on IE, and with a large number of webviews(not recommend you ever do this) on iOS.
         */
        function flushAllD3Transitions(): void;
        /**
         * Wrapper for flushAllD3Transitions.
         */
        function flushAllD3TransitionsIfNeeded(options: VisualInitOptions | AnimationOptions): void;
        /**
         * There is a known bug in IE10 that causes cryptic crashes for SVG elements with a null 'd' attribute:
         * https://github.com/mbostock/d3/issues/1737
        */
        function ensureDAttribute(pathElement: D3.D3Element): void;
        /**
         * In IE10, it is possible to return SVGPoints with NaN members
        */
        function ensureValidSVGPoint(point: SVGPoint): void;
        /**
         * Parse the Transform string with value 'translate(x,y)'
         * In Chrome for the translate(position) string the delimiter is a comma and in IE it is a space so checking for both
        */
        function parseTranslateTransform(input: string): {
            x: string;
            y: string;
        };
        /**
         * Appends 'px' to the end of number value for use as pixel string in styles
        */
        function convertToPixelString(value: number): string;
    }
}
declare module powerbi.visuals {
    /**
     * Contains functions/constants to aid in text manupilation.
    */
    module TextUtil {
        /**
         * remove breaking spaces from given string and replace by none breaking space (&nbsp)
        */
        function removeBreakingSpaces(str: string): string;
    }
}
declare module powerbi.visuals {
    module UrlHelper {
        function isValidUrl(columnItem: DataViewMetadataColumn, value: string): boolean;
    }
}
declare module powerbi.visuals {
    interface GradientSettings {
        diverging: boolean;
        minColor: any;
        midColor?: any;
        maxColor: any;
        minValue?: number;
        midValue?: number;
        maxValue?: number;
    }
    module GradientUtils {
        import DataViewObjectPropertyDefinition = powerbi.data.DataViewObjectPropertyDefinition;
        function shouldShowGradient(visualConfig: any): boolean;
        function getUpdatedGradientSettings(gradientObject: data.DataViewObjectDefinitions): GradientSettings;
        function getGradientMeasureIndex(dataViewCategorical: DataViewCategorical): number;
        function hasGradientRole(dataViewCategorical: DataViewCategorical): boolean;
        function getDefaultGradientSettings(): GradientSettings;
        function getDefaultFillRuleDefinition(): DataViewObjectPropertyDefinition;
        function updateFillRule(propertyName: string, propertyValue: any, definitions: powerbi.data.DataViewObjectDefinitions): void;
        function getGradientSettings(baseFillRule: FillRuleDefinition): GradientSettings;
        function getFillRule(objectDefinitions: data.DataViewObjectDefinitions): FillRuleDefinition;
        function getGradientSettingsFromRule(fillRule: FillRuleDefinition): GradientSettings;
    }
}
declare module powerbi.visuals {
    module visualBackgroundHelper {
        function getDefaultColor(): string;
        function getDefaultTransparency(): number;
        function getDefaultShow(): boolean;
        function getDefaultValues(): {
            color: string;
            transparency: number;
            show: boolean;
        };
    }
}
declare module powerbi {
    import shapes = powerbi.visuals.shapes;
    /** Defines possible content positions.  */
    enum ContentPositions {
        /** Content position is not defined. */
        None = 0,
        /** Content aligned top left. */
        TopLeft = 1,
        /** Content aligned top center. */
        TopCenter = 2,
        /** Content aligned top right. */
        TopRight = 4,
        /** Content aligned middle left. */
        MiddleLeft = 8,
        /** Content aligned middle center. */
        MiddleCenter = 16,
        /** Content aligned middle right. */
        MiddleRight = 32,
        /** Content aligned bottom left. */
        BottomLeft = 64,
        /** Content aligned bottom center. */
        BottomCenter = 128,
        /** Content aligned bottom right. */
        BottomRight = 256,
        /** Content is placed inside the bounding rectangle in the center. */
        InsideCenter = 512,
        /** Content is placed inside the bounding rectangle at the base. */
        InsideBase = 1024,
        /** Content is placed inside the bounding rectangle at the end. */
        InsideEnd = 2048,
        /** Content is placed outside the bounding rectangle at the base. */
        OutsideBase = 4096,
        /** Content is placed outside the bounding rectangle at the end. */
        OutsideEnd = 8192,
        /** Content supports all possible positions. */
        All,
    }
    /**
    * Rectangle orientation. Rectangle orientation is used to define vertical or horizontal orientation
    * and starting/ending side of the rectangle.
    */
    enum RectOrientation {
        /** Rectangle with no specific orientation. */
        None = 0,
        /** Vertical rectangle with base at the bottom. */
        VerticalBottomTop = 1,
        /** Vertical rectangle with base at the top. */
        VerticalTopBottom = 2,
        /** Horizontal rectangle with base at the left. */
        HorizontalLeftRight = 3,
        /** Horizontal rectangle with base at the right. */
        HorizontalRightLeft = 4,
    }
    /**
    * Defines if panel elements are allowed to be positioned
    * outside of the panel boundaries.
    */
    enum OutsidePlacement {
        /** Elements can be positioned outside of the panel. */
        Allowed = 0,
        /** Elements can not be positioned outside of the panel. */
        Disallowed = 1,
        /** Elements can be partially outside of the panel. */
        Partial = 2,
    }
    /**
    * Defines an interface for information needed for default label positioning. Used in DataLabelsPanel.
    * Note the question marks: none of the elements are mandatory.
    */
    interface IDataLabelSettings {
        /** Distance from the anchor point. */
        anchorMargin?: number;
        /** Orientation of the anchor rectangle. */
        anchorRectOrientation?: RectOrientation;
        /** Preferable position for the label.  */
        contentPosition?: ContentPositions;
        /** Defines the rules if the elements can be positioned outside panel bounds. */
        outsidePlacement?: OutsidePlacement;
        /** Defines the valid positions if repositionOverlapped is true. */
        validContentPositions?: ContentPositions;
        /** Defines maximum moving distance to reposition an element. */
        minimumMovingDistance?: number;
        /** Defines minimum moving distance to reposition an element. */
        maximumMovingDistance?: number;
        /** Opacity effect of the label. Use it for dimming.  */
        opacity?: number;
    }
    /**
    * Defines an interface for information needed for label positioning.
    * None of the elements are mandatory, but at least anchorPoint OR anchorRect is needed.
    */
    interface IDataLabelInfo extends IDataLabelSettings {
        /** The point to which label is anchored.  */
        anchorPoint?: shapes.IPoint;
        /** The rectangle to which label is anchored. */
        anchorRect?: shapes.IRect;
        /** Disable label rendering and processing. */
        hideLabel?: boolean;
        /**
        * Defines the visibility rank. This will not be processed by arrange phase,
        * but can be used for preprocessing the hideLabel value.
        */
        visibilityRank?: number;
        /** Defines the starting offset from AnchorRect. */
        offset?: number;
        /** Defines the callout line data. It is calculated and used during processing. */
        callout?: {
            start: shapes.IPoint;
            end: shapes.IPoint;
        };
        /** Source of the label. */
        source?: any;
        size?: shapes.ISize;
    }
    /**  Interface for label rendering. */
    interface IDataLabelRenderer {
        renderLabelArray(labels: IArrangeGridElementInfo[]): void;
    }
    /** Interface used in internal arrange structures. */
    interface IArrangeGridElementInfo {
        element: IDataLabelInfo;
        rect: shapes.IRect;
    }
    /**
    * Arranges label elements using the anchor point or rectangle. Collisions
    * between elements can be automatically detected and as a result elements
    * can be repositioned or get hidden.
    */
    class DataLabelManager {
        private _size;
        movingStep: number;
        hideOverlapped: boolean;
        static DefaultAnchorMargin: number;
        static DefaultMaximumMovingDistance: number;
        static DefaultMinimumMovingDistance: number;
        static InflateAmount: number;
        private _defaultSettings;
        /**
        * Initializes a new instance of the DataLabelsPanel class.
        * @constructor
        */
        constructor();
        defaultSettings: IDataLabelSettings;
        /** Arranges the lables position and visibility*/
        hideCollidedLabels(viewport: IViewport, data: any[], layout: any): powerbi.visuals.LabelEnabledDataPoint[];
        /**
        * Merges the label element info with the panel element info and returns correct label info.
        * @param {ILabelElementInfo} source The label info.
        * @return {ILabelElementInfo}
        */
        getLabelInfo(source: IDataLabelInfo): IDataLabelInfo;
        /**
        * (Private) Calculates element position using anchor point..
        */
        private calculateContentPositionFromPoint(anchorPoint, contentPosition, contentSize, offset);
        /** (Private) Calculates element position using anchor rect. */
        private calculateContentPositionFromRect(anchorRect, anchorRectOrientation, contentPosition, contentSize, offset);
        /** (Private) Calculates element inside center position using anchor rect. */
        private handleInsideCenterPosition(anchorRectOrientation, contentSize, anchorRect, offset);
        /** (Private) Calculates element inside end position using anchor rect. */
        private handleInsideEndPosition(anchorRectOrientation, contentSize, anchorRect, offset);
        /** (Private) Calculates element inside base position using anchor rect. */
        private handleInsideBasePosition(anchorRectOrientation, contentSize, anchorRect, offset);
        /** (Private) Calculates element outside end position using anchor rect. */
        private handleOutsideEndPosition(anchorRectOrientation, contentSize, anchorRect, offset);
        /** (Private) Calculates element outside base position using anchor rect. */
        private handleOutsideBasePosition(anchorRectOrientation, contentSize, anchorRect, offset);
        /**  (Private) Calculates element position. */
        private calculateContentPosition(anchoredElementInfo, contentPosition, contentSize, offset);
        /** (Private) Check for collisions. */
        private hasCollisions(arrangeGrid, info, position, size);
        static isValid(rect: shapes.IRect): boolean;
    }
    /**
    * Utility class to speed up the conflict detection by collecting the arranged items in the DataLabelsPanel.
    */
    class DataLabelArrangeGrid {
        private _grid;
        private _cellSize;
        private _rowCount;
        private _colCount;
        private static ARRANGEGRID_MIN_COUNT;
        private static ARRANGEGRID_MAX_COUNT;
        /**
        * Creates new ArrangeGrid.
        * @param {DataLabelManager} manager The owner data labels.
        * @param {shapes.ISize} size The available size
        */
        constructor(size: shapes.ISize, elements: any[], layout: powerbi.visuals.ILabelLayout);
        /**
        * Register a new label element.
        * @param {ILabelElement} element The label element to register.
        * @param {shapes.IRect} rect The label element position rectangle.
        */
        add(element: IDataLabelInfo, rect: shapes.IRect): void;
        /**
        * Checks for conflict of given rectangle in registered elements.
        * @param {shapes.IRect} rect The rectengle to check.
        * @return {Boolean} True if conflict is detected.
        */
        hasConflict(rect: shapes.IRect): boolean;
        /**
        * Calculates the number of rows or columns in a grid
        * @param {number} step is the largest label size (width or height)
        * @param {number} length is the grid size (width or height)
        * @param {number} minCount is the minimum allowed size
        * @param {number} maxCount is the maximum allowed size
        * @return {number} the number of grid rows or columns
        */
        private getGridRowColCount(step, length, minCount, maxCount);
        /**
        * Returns the grid index of a given recangle
        * @param {shapes.IRect} rect The rectengle to check.
        * @return {shapes.IThickness} grid index as a thickness object.
        */
        private getGridIndexRect(rect);
    }
}
declare module powerbi {
    /** Repreasents the sequence of the dates/times */
    class DateTimeSequence {
        private static MIN_COUNT;
        private static MAX_COUNT;
        min: Date;
        max: Date;
        unit: DateTimeUnit;
        sequence: Date[];
        interval: number;
        intervalOffset: number;
        /** Creates new instance of the DateTimeSequence */
        constructor(unit: DateTimeUnit);
        /** Add a new Date to a sequence.
          * @param x - date to add
          */
        add(date: Date): void;
        /** Extends the sequence to cover new date range
          * @param min - new min to be covered by sequence
          * @param max - new max to be covered by sequence
          */
        extendToCover(min: Date, max: Date): void;
        /** Move the sequence to cover new date range
          * @param min - new min to be covered by sequence
          * @param max - new max to be covered by sequence
          */
        moveToCover(min: Date, max: Date): void;
        /** Calculate a new DateTimeSequence
          * @param dataMin - Date representing min of the data range
          * @param dataMax - Date representing max of the data range
          * @param expectedCount - expected number of intervals in the sequence
          * @param unit - of the intervals in the sequence
          */
        static calculate(dataMin: Date, dataMax: Date, expectedCount: number, unit?: DateTimeUnit): DateTimeSequence;
        static calculateYears(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence;
        static calculateMonths(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence;
        static calculateWeeks(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence;
        static calculateDays(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence;
        static calculateHours(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence;
        static calculateMinutes(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence;
        static calculateSeconds(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence;
        static calculateMilliseconds(dataMin: Date, dataMax: Date, expectedCount: number): DateTimeSequence;
        private static fromNumericSequence(date, sequence, unit);
        private static addInterval(value, interval, unit);
        private static getDelta(min, max, unit);
        static getIntervalUnit(min: Date, max: Date, maxCount: number): DateTimeUnit;
    }
    /** DateUtils module provides DateTimeSequence with set of additional date manipulation routines */
    module DateUtils {
        /** Adds a specified number of years to the provided date.
          * @param date - date value
          * @param yearDelta - number of years to add
          */
        function addYears(date: Date, yearDelta: number): Date;
        /** Adds a specified number of months to the provided date.
          * @param date - date value
          * @param monthDelta - number of months to add
          */
        function addMonths(date: Date, monthDelta: number): Date;
        /** Adds a specified number of weeks to the provided date.
          * @param date - date value
          * @param weekDelta - number of weeks to add
          */
        function addWeeks(date: Date, weeks: number): Date;
        /** Adds a specified number of days to the provided date.
          * @param date - date value
          * @param dayDelta - number of days to add
          */
        function addDays(date: Date, days: number): Date;
        /** Adds a specified number of hours to the provided date.
          * @param date - date value
          * @param hours - number of hours to add
          */
        function addHours(date: Date, hours: number): Date;
        /** Adds a specified number of minutes to the provided date.
          * @param date - date value
          * @param minutes - number of minutes to add
          */
        function addMinutes(date: Date, minutes: number): Date;
        /** Adds a specified number of seconds to the provided date.
          * @param date - date value
          * @param seconds - number of seconds to add
          */
        function addSeconds(date: Date, seconds: number): Date;
        /** Adds a specified number of milliseconds to the provided date.
          * @param date - date value
          * @param milliseconds - number of milliseconds to add
          */
        function addMilliseconds(date: Date, milliseconds: number): Date;
    }
}
declare module powerbi {
    class DisplayUnit {
        value: number;
        title: string;
        labelFormat: string;
        applicableRangeMin: number;
        applicableRangeMax: number;
        project(value: number): number;
        reverseProject(value: number): number;
        isApplicableTo(value: number): boolean;
    }
    class DisplayUnitSystem {
        static UNSUPPORTED_FORMATS: RegExp;
        units: DisplayUnit[];
        displayUnit: DisplayUnit;
        private _unitBaseValue;
        constructor(units?: DisplayUnit[]);
        title: string;
        update(value: number): void;
        private findApplicableDisplayUnit(value);
        format(value: number, format: string, decimals?: number): string;
        private formatHelper(value, projectedValue, labelFormat, format, decimals?);
        /** Formats a single value by choosing an appropriate base for the DisplayUnitSystem before formatting. */
        formatSingleValue(value: number, format: string, decimals?: number): string;
        private shouldUseValuePrecision(value);
        private removeFractionIfNecessary(formatString);
    }
    /** Provides a unit system that is defined by formatting in the model, and is suitable for visualizations shown in single number visuals in explore mode. */
    class NoDisplayUnitSystem extends DisplayUnitSystem {
        constructor();
    }
    /** Provides a unit system that creates a more concise format for displaying values. This is suitable for most of the cases where
        we are showing values (chart axes) and as such it is the default unit system. */
    class DefaultDisplayUnitSystem extends DisplayUnitSystem {
        private static _units;
        private static _scientificBigNumbersBoundary;
        constructor(unitLookup: (exponent: number) => DisplayUnitSystemNames);
        format(data: number, format: string, decimals?: number): string;
        private isScientific(value);
        static reset(): void;
        private static getUnits(unitLookup);
    }
    /** Provides a unit system that creates a more concise format for displaying values, but only allows showing a unit if we have at least
        one of those units (e.g. 0.9M is not allowed since it's less than 1 million). This is suitable for cases such as dashboard tiles
        where we have restricted space but do not want to show partial units. */
    class WholeUnitsDisplayUnitSystem extends DisplayUnitSystem {
        private static _units;
        constructor(unitLookup: (exponent: number) => DisplayUnitSystemNames);
        static reset(): void;
        private static getUnits(unitLookup);
    }
    interface DisplayUnitSystemNames {
        title: string;
        format: string;
    }
}
declare module powerbi {
    class NumericSequence {
        private static MIN_COUNT;
        private static MAX_COUNT;
        private _maxAllowedMargin;
        private _canExtendMin;
        private _canExtendMax;
        interval: number;
        intervalOffset: number;
        min: number;
        max: number;
        precision: number;
        sequence: number[];
        static calculate(range: NumericSequenceRange, expectedCount: number, maxAllowedMargin?: number, minPower?: number, useZeroRefPoint?: boolean, steps?: number[]): NumericSequence;
        /** Calculates the sequence of int numbers which are mapped to the multiples of the units grid.
          * @min - The minimum of the range.
          * @max - The maximum of the range.
          * @maxCount - The max count of intervals.
          * @steps - array of intervals.
          */
        static calculateUnits(min: number, max: number, maxCount: number, steps: number[]): NumericSequence;
        trimMinMax(min: number, max: number): void;
    }
}
declare module powerbi {
    class NumericSequenceRange {
        private static DEFAULT_MAX;
        private static MIN_SUPPORTED_DOUBLE;
        private static MAX_SUPPORTED_DOUBLE;
        min: number;
        max: number;
        includeZero: boolean;
        forcedSingleStop: number;
        hasDataRange: boolean;
        hasFixedMin: boolean;
        hasFixedMax: boolean;
        private _ensureIncludeZero();
        private _ensureNotEmpty();
        private _ensureDirection();
        getSize(): number;
        shrinkByStep(range: NumericSequenceRange, step: number): void;
        static calculate(dataMin: number, dataMax: number, fixedMin?: number, fixedMax?: number, includeZero?: boolean): NumericSequenceRange;
        static calculateDataRange(dataMin: number, dataMax: number, includeZero?: boolean): NumericSequenceRange;
        static calculateFixedRange(fixedMin: number, fixedMax: number, includeZero?: boolean): NumericSequenceRange;
    }
    module ValueUtil {
        function hasValue(value: any): boolean;
    }
}
declare module powerbi.visuals {
    /** Formats the value using provided format expression and culture
    * @param value - value to be formatted and converted to string.
    * @param format - format to be applied if the number shouldn't be abbreviated.
    * If the number should be abbreviated this string is checked for special characters like $ or % if any
    */
    interface ICustomValueFormatter {
        (value: any, format?: string): string;
    }
    interface ValueFormatterOptions {
        /** The format string to use. */
        format?: string;
        /** The data value. */
        value?: any;
        /** The data value. */
        value2?: any;
        /** The number of ticks. */
        tickCount?: any;
        /** The display unit system to use */
        displayUnitSystemType?: DisplayUnitSystemType;
        /** True if we are formatting single values in isolation (e.g. card), as opposed to multiple values with a common base (e.g. chart axes) */
        formatSingleValues?: boolean;
        /** True if we want to trim off unnecessary zeroes after the decimal and remove a space before the % symbol */
        allowFormatBeautification?: boolean;
        /** Specifies the maximum number of decimal places to show*/
        precision?: number;
    }
    interface IValueFormatter {
        format(value: any): string;
        displayUnit?: DisplayUnit;
    }
    /** Captures all locale-specific options used by the valueFormatter. */
    interface ValueFormatterLocalizationOptions {
        null: string;
        true: string;
        false: string;
        NaN: string;
        Infinity: string;
        NegativeInfinity: string;
        /** Returns a beautified form the given format string. */
        beautify(format: string): string;
        /** Returns an object describing the given exponent in the current language. */
        describe(exponent: number): DisplayUnitSystemNames;
        restatementComma: string;
        restatementCompoundAnd: string;
        restatementCompoundOr: string;
    }
    module valueFormatter {
        function getLocalizedString(stringId: string): string;
        function getFormatMetadata(format: string): powerbi.NumberFormat.NumericFormatMetadata;
        function setLocaleOptions(options: ValueFormatterLocalizationOptions): void;
        function createDefaultFormatter(formatString: string, allowFormatBeautification?: boolean): IValueFormatter;
        /** Creates an IValueFormatter to be used for a range of values. */
        function create(options: ValueFormatterOptions): IValueFormatter;
        function format(value: any, format?: string, allowFormatBeautification?: boolean): string;
        function formatRaw(value: any, format?: string): string;
        function getFormatString(column: DataViewMetadataColumn, formatStringProperty: DataViewObjectPropertyIdentifier, suppressTypeFallback?: boolean): string;
        function formatListAnd(strings: string[]): string;
        function formatListOr(strings: string[]): string;
        function getDisplayUnits(displayUnitSystemType: DisplayUnitSystemType): DisplayUnit[];
    }
}
declare module powerbi.visuals {
    function createColorAllocatorFactory(): IColorAllocatorFactory;
}
declare module powerbi.visuals {
    /** Factory method to create an IInteractivityService instance. */
    function createInteractivityService(hostServices: IVisualHostServices): IInteractivityService;
    /** Creates a clear an svg rect to catch clear clicks  */
    function appendClearCatcher(selection: D3.Selection): D3.Selection;
    function dataHasSelection(data: SelectableDataPoint[]): boolean;
    interface IInteractiveVisual {
        accept(visitor: InteractivityVisitor, options: any): void;
    }
    /** Responsible for managing interactivity between the hosting visual and its peers */
    interface IInteractivityService extends InteractivityVisitor {
        /** Clears the selection */
        clearSelection(): void;
        apply(visual: IInteractiveVisual, options: any): any;
        /** Sets the selected state on the given data points. */
        applySelectionStateToData(dataPoints: SelectableDataPoint[]): boolean;
    }
    class WebInteractivityService implements IInteractivityService {
        private hostService;
        private sendSelectionToVisual;
        private sendSelectionToLegend;
        private sendSelectionToSecondVisual;
        private selectedIds;
        private behavior;
        private secondBehavior;
        selectableDataPoints: SelectableDataPoint[];
        selectableLegendDataPoints: SelectableDataPoint[];
        secondSelectableDataPoints: SelectableDataPoint[];
        private hasColumnChart;
        constructor(hostServices: IVisualHostServices);
        /** Sets the selected state of all selectable data points to false and invokes the behavior's select command. */
        clearSelection(): void;
        /** Checks whether there is at least one item selected */
        hasSelection(): boolean;
        private legendHasSelection();
        /** Marks a data point as selected and syncs selection with the host. */
        select(d: SelectableDataPoint, multiselect?: boolean): void;
        private removeId(toRemove);
        static isSelected(propertyId: DataViewObjectPropertyIdentifier, categories: DataViewCategoricalColumn, idx: number): boolean;
        /** Public for UnitTesting */
        createPropertiesToHost(filterPropertyIdentifier: DataViewObjectPropertyIdentifier): VisualObjectInstance[];
        private sendPersistPropertiesToHost(filterPropertyIdentifier);
        private sendSelectToHost();
        private sendSelectionToHost(filterPropertyIdentifier?);
        private clearSelectionInternal();
        applySelectionStateToData(dataPoints: SelectableDataPoint[]): boolean;
        /**
         * Initialize the selection state based on the selection from the source.
         */
        private initAndSyncSelectionState(filterPropertyId?);
        /**
         * Syncs the selection state for all data points that have the same category. Returns
         * true if the selection state was out of sync and corrections were made; false if
         * the data is already in sync with the service.
         *
         * If the data is not compatible with the current service's current selection state,
         * the state is cleared and the cleared selection is sent to the host.
         *
         * Ignores series for now, since we don't support series selection at the moment.
         */
        private syncSelectionState(filterPropertyId?);
        apply(visual: IInteractiveVisual, options: any): void;
        visitColumnChart(options: ColumnBehaviorOptions): void;
        visitLineChart(options: LineChartBehaviorOptions): void;
        private visitLineChartNoCombo(options);
        private visitLineChartCombo(options);
        visitDataDotChart(options: DataDotChartBehaviorOptions): void;
        visitDonutChart(options: DonutBehaviorOptions): void;
        visitFunnel(options: FunnelBehaviorOptions): void;
        visitScatterChart(options: ScatterBehaviorOptions): void;
        visitTreemap(options: TreemapBehaviorOptions): void;
        visitSlicer(options: SlicerBehaviorOptions): void;
        visitWaterfallChart(options: WaterfallChartBehaviorOptions): void;
        visitMap(options: MapBehaviorOptions): void;
        visitLegend(options: LegendBehaviorOptions): void;
    }
    /** A service for the mobile client to enable & route interactions */
    class MobileInteractivityService implements IInteractivityService {
        private behavior;
        apply(visual: IInteractiveVisual, options: any): void;
        private makeDataPointsSelectable(...selection);
        private makeRootSelectable(selection);
        private makeDragable(...selection);
        clearSelection(): void;
        applySelectionStateToData(dataPoints: SelectableDataPoint[]): boolean;
        visitColumnChart(options: ColumnBehaviorOptions): void;
        visitLineChart(options: LineChartBehaviorOptions): void;
        visitDataDotChart(options: DataDotChartBehaviorOptions): void;
        visitDonutChart(options: DonutBehaviorOptions): void;
        visitFunnel(options: FunnelBehaviorOptions): void;
        visitScatterChart(options: ScatterBehaviorOptions): void;
        visitTreemap(options: TreemapBehaviorOptions): void;
        visitSlicer(options: SlicerBehaviorOptions): void;
        visitWaterfallChart(options: WaterfallChartBehaviorOptions): void;
        visitMap(options: MapBehaviorOptions): void;
        visitLegend(options: LegendBehaviorOptions): void;
    }
}
declare module powerbi.visuals.BI.Services {
    import GeocodeQuery = GeocodingManager.GeocodeQuery;
    import IGeocodeCoordinate = GeocodingManager.IGeocodeCoordinate;
    interface IGeocodingCache {
        getCoordinates(query: GeocodeQuery): IGeocodeCoordinate;
        registerCoordinates(query: GeocodeQuery, coordinate: IGeocodeCoordinate): void;
    }
    function createGeocodingCache(maxCacheSize: number, maxCacheSizeOverflow: number): IGeocodingCache;
}
declare module powerbi.visuals {
    interface IVisualPluginService {
        getPlugin(type: string): IVisualPlugin;
        getVisuals(): IVisualPlugin[];
        capabilities(type: string): VisualCapabilities;
    }
    interface MinervaVisualFeatureSwitches {
        newTable: boolean;
        heatMap: boolean;
        dataDotChartEnabled?: boolean;
        devToolsEnabled?: boolean;
    }
    interface SmallViewPortProperties {
        cartesianSmallViewPortProperties: CartesianSmallViewPortProperties;
        gaugeSmallViewPortProperties: GaugeSmallViewPortProperties;
    }
    module visualPluginFactory {
        class VisualPluginService implements IVisualPluginService {
            private _plugins;
            constructor();
            /** Gets metadata for all registered. */
            getVisuals(): IVisualPlugin[];
            getPlugin(type: string): IVisualPlugin;
            capabilities(type: string): VisualCapabilities;
        }
        class MinervaVisualPluginService extends VisualPluginService {
            private featureSwitches;
            private visualPlugins;
            constructor(featureSwitches: MinervaVisualFeatureSwitches);
            getVisuals(): IVisualPlugin[];
            private addCustomVisualizations(convertibleVisualTypes);
            getPlugin(type: string): IVisualPlugin;
        }
        class DashboardPluginService extends VisualPluginService {
            private featureSwitches;
            private visualPlugins;
            constructor(featureSwitches: MinervaVisualFeatureSwitches);
            getPlugin(type: string): IVisualPlugin;
        }
        class MobileVisualPluginService extends VisualPluginService {
            private visualPlugins;
            private smallViewPortProperties;
            static MinHeightLegendVisible: number;
            static MinHeightAxesVisible: number;
            static MinHeightGaugeSideNumbersVisible: number;
            static GaugeMarginsOnSmallViewPort: number;
            constructor(smallViewPortProperties?: SmallViewPortProperties);
            getPlugin(type: string): IVisualPlugin;
        }
        function create(): IVisualPluginService;
        function createMinerva(featureSwitches: MinervaVisualFeatureSwitches): IVisualPluginService;
        function createDashboard(featureSwitches: MinervaVisualFeatureSwitches): IVisualPluginService;
        function createMobile(smallViewPortProperties?: SmallViewPortProperties): IVisualPluginService;
    }
}
declare module powerbi.visuals.controls {
    function fire(eventHandlers: any, eventArgs: any): void;
    class ScrollbarButton {
        static MIN_WIDTH: number;
        static ARROW_COLOR: string;
        private _element;
        private _polygon;
        private _svg;
        private _owner;
        private _direction;
        private _timerHandle;
        private _mouseUpWrapper;
        constructor(owner: Scrollbar, direction: number);
        element: HTMLDivElement;
        private createView();
        private onMouseDown(event);
        private onMouseUp(event);
        arrange(width: number, height: number, angle: number): void;
    }
    class Scrollbar {
        static DefaultScrollbarWidth: string;
        private static ScrollbarBackgroundFirstTimeMousedownHoldDelay;
        private static ScrollbarBackgroundMousedownHoldDelay;
        static className: string;
        static barClassName: string;
        static arrowClassName: string;
        MIN_BAR_SIZE: number;
        min: number;
        max: number;
        viewMin: number;
        viewSize: number;
        smallIncrement: number;
        _onscroll: any[];
        private _actualWidth;
        private _actualHeight;
        private _actualButtonWidth;
        private _actualButtonHeight;
        private _width;
        private _height;
        private _visible;
        private _element;
        private _minButton;
        private _maxButton;
        private _middleBar;
        private _timerHandle;
        private _screenToOffsetScale;
        private _screenPrevMousePos;
        private _screenMinMousePos;
        private _screenMaxMousePos;
        private _backgroundMouseUpWrapper;
        private _middleBarMouseMoveWrapper;
        private _middleBarMouseUpWrapper;
        private _touchPanel;
        private _offsetTouchStartPos;
        private _offsetTouchPrevPos;
        private _touchStarted;
        private _allowMouseDrag;
        constructor(parentElement: HTMLElement);
        scrollBy(delta: number): void;
        scrollUp(): void;
        scrollDown(): void;
        scrollPageUp(): void;
        scrollPageDown(): void;
        width: string;
        height: string;
        refresh(): void;
        element: HTMLDivElement;
        maxButton: ScrollbarButton;
        middleBar: HTMLDivElement;
        _scrollSmallIncrement(direction: any): void;
        visible: boolean;
        isInMouseCapture: boolean;
        show(value: boolean): void;
        _getMouseOffset(event: MouseEvent): {
            x: number;
            y: number;
        };
        _getOffsetXDelta(event: MouseEvent): number;
        _getOffsetYDelta(event: MouseEvent): number;
        _getOffsetXTouchDelta(event: MouseEvent): number;
        _getOffsetYTouchDelta(event: MouseEvent): number;
        initTouch(panel: HTMLElement, allowMouseDrag?: boolean): void;
        onTouchStart(e: any): void;
        onTouchMove(e: any): void;
        onTouchEnd(e: any): void;
        onTouchMouseDown(e: MouseEvent): void;
        _getOffsetTouchDelta(e: MouseEvent): number;
        onTouchMouseMove(e: MouseEvent): void;
        onTouchMouseUp(e: MouseEvent, bubble?: boolean): void;
        registerElementForMouseWheelScrolling(element: HTMLElement): void;
        private createView(parentElement);
        private scrollTo(pos);
        _scrollByPage(event: MouseEvent): void;
        _getRunningSize(net: boolean): number;
        _getOffsetDelta(event: MouseEvent): number;
        private scroll(event);
        actualWidth: number;
        actualHeight: number;
        actualButtonWidth: number;
        actualButtonHeight: number;
        arrange(): void;
        _calculateButtonWidth(): number;
        _calculateButtonHeight(): number;
        _getMinButtonAngle(): number;
        _getMaxButtonAngle(): number;
        _setMaxButtonPosition(): void;
        invalidateArrange(): void;
        private onHoldBackgroundMouseDown(event);
        private onBackgroundMouseDown(event);
        private onBackgroundMouseUp(event);
        private getPinchZoomY();
        private onMiddleBarMouseDown(event);
        private onMiddleBarMouseMove(event);
        private onMiddleBarMouseUp(event);
        _getScreenContextualLeft(element: HTMLElement): number;
        _getScreenContextualRight(element: HTMLElement): number;
        private onMouseWheel(e);
        private onFireFoxMouseWheel(e);
        private mouseWheel(delta);
        _getScreenMousePos(event: MouseEvent): any;
        static addDocumentMouseUpEvent(func: any): void;
        static removeDocumentMouseUpEvent(func: any): void;
        static addDocumentMouseMoveEvent(func: any): void;
        static removeDocumentMouseMoveEvent(func: any): void;
    }
    class HorizontalScrollbar extends Scrollbar {
        constructor(parentElement: HTMLElement);
        _calculateButtonWidth(): number;
        _calculateButtonHeight(): number;
        _getMinButtonAngle(): number;
        _getMaxButtonAngle(): number;
        _setMaxButtonPosition(): void;
        refresh(): void;
        show(visible: boolean): void;
        _scrollByPage(event: MouseEvent): void;
        _getRunningSize(net: boolean): number;
        _getOffsetDelta(event: MouseEvent): number;
        _getOffsetTouchDelta(e: MouseEvent): number;
        _getScreenContextualLeft(element: HTMLElement): number;
        _getScreenContextualRight(element: HTMLElement): number;
        _getScreenMousePos(event: MouseEvent): number;
    }
    class VerticalScrollbar extends Scrollbar {
        constructor(parentElement: HTMLElement);
        _calculateButtonWidth(): number;
        _calculateButtonHeight(): number;
        _getMinButtonAngle(): number;
        _getMaxButtonAngle(): number;
        _setMaxButtonPosition(): void;
        refresh(): void;
        show(visible: boolean): void;
        _scrollByPage(event: MouseEvent): void;
        _getRunningSize(net: boolean): number;
        _getOffsetDelta(event: MouseEvent): number;
        _getOffsetTouchDelta(e: MouseEvent): number;
        _getScreenContextualLeft(element: HTMLElement): number;
        _getScreenContextualRight(element: HTMLElement): number;
        _getScreenMousePos(event: MouseEvent): number;
    }
}
declare module powerbi.visuals.controls.internal {
    interface ITablixResizeHandler {
        onStartResize(cell: TablixCell, currentX: number, currentY: number): void;
        onResize(cell: TablixCell, deltaX: number, deltaY: number): void;
        onEndResize(cell: TablixCell): any;
        onReset(cell: TablixCell): any;
    }
    /** Internal interface to abstract the tablix row/column
      */
    interface ITablixGridItem {
        calculateSize(): void;
        resize(size: number): void;
        fixSize(): void;
        /**
          In case the parent column/row header size is bigger than the sum of the children, the size of the last item is adjusted to compensate the difference
          */
        setAligningContextualWidth(size: number): void;
        getAligningContextualWidth(): number;
        getContextualWidth(): number;
        getContentContextualWidth(): number;
        getIndex(grid: TablixGrid): number;
        getHeaders(): TablixCell[];
        getOtherDimensionHeaders(): TablixCell[];
        getOtherDimensionOwner(cell: TablixCell): ITablixGridItem;
        getCellIContentContextualWidth(cell: TablixCell): number;
        getCellContextualSpan(cell: TablixCell): number;
    }
    /** This class is responsible for tablix header resizing
      */
    class TablixResizer {
        private _element;
        private _handler;
        private _elementMouseDownWrapper;
        private _elementMouseMoveWrapper;
        private _elementMouseOutWrapper;
        private _elementMouseDoubleClickOutWrapper;
        private _documentMouseMoveWrapper;
        private _documentMouseUpWrapper;
        private _startMousePosition;
        private _originalCursor;
        static resizeHandleSize: number;
        static resizeCursor: string;
        constructor(element: HTMLElement, handler: ITablixResizeHandler);
        static addDocumentMouseUpEvent(listener: EventListener): void;
        static removeDocumentMouseUpEvent(listener: EventListener): void;
        static addDocumentMouseMoveEvent(listener: EventListener): void;
        static removeDocumentMouseMoveEvent(listener: EventListener): void;
        static getMouseCoordinates(event: MouseEvent): {
            x: number;
            y: number;
        };
        static getMouseCoordinateDelta(previous: {
            x: number;
            y: number;
        }, current: {
            x: number;
            y: number;
        }): {
            x: number;
            y: number;
        };
        initialize(): void;
        uninitialize(): void;
        cell: TablixCell;
        element: HTMLElement;
        _hotSpot(position: {
            x: number;
            y: number;
        }): boolean;
        private onElementMouseDown(event);
        private onElementMouseMove(event);
        private onElementMouseOut(event);
        private onElementMouseDoubleClick(event);
        private onDocumentMouseMove(event);
        private onDocumentMouseUp(event);
    }
    class TablixCell implements ITablixCell {
        private _horizontalOffset;
        private _verticalOffset;
        private _colSpan;
        private _rowSpan;
        private _textAlign;
        private _contentWidth;
        private _contentHeight;
        private _scrollable;
        _column: TablixColumn;
        _row: TablixRow;
        type: TablixCellType;
        item: any;
        _presenter: TablixCellPresenter;
        extension: any;
        constructor(presenter: TablixCellPresenter, extension: any, row: TablixRow);
        colSpan: number;
        rowSpan: number;
        textAlign: string;
        horizontalOffset: number;
        verticalOffset: number;
        private isScrollable();
        clear(): void;
        private initializeScrolling();
        prepare(scrollable: boolean): void;
        scrollVertically(height: number, offset: number): void;
        scrollHorizontally(width: number, offset: number): void;
        setContentWidth(value: number): void;
        setContentHeight(value: number): void;
        enableHorizontalResize(enable: boolean, handler: ITablixResizeHandler): void;
    }
    class TablixColumn implements ITablixGridItem {
        _realizedColumnHeaders: TablixCell[];
        _realizedCornerCells: TablixCell[];
        _realizedRowHeaders: TablixCell[];
        _realizedBodyCells: TablixCell[];
        private _items;
        private _itemType;
        private _footerCell;
        private _contentWidth;
        private _width;
        private _sizeFixed;
        private _aligningWidth;
        private _fixedToAligningWidth;
        private _presenter;
        private _owner;
        constructor(presenter: TablixColumnPresenter);
        initialize(owner: TablixGrid): void;
        owner: TablixGrid;
        private getType();
        private getColumnHeadersOrCorners();
        private columnHeadersOrCornersEqual(newType, headers, hierarchyNavigator);
        itemType: TablixCellType;
        getLeafItem(): any;
        columnHeaderOrCornerEquals(type1: TablixCellType, item1: any, type2: TablixCellType, item2: any, hierarchyNavigator: ITablixHierarchyNavigator): boolean;
        OnLeafRealized(hierarchyNavigator: ITablixHierarchyNavigator): void;
        private clearSpanningCellsWidth(cells);
        addCornerCell(cell: TablixCell): void;
        addRowHeader(cell: TablixCell): void;
        addColumnHeader(cell: TablixCell, isLeaf: boolean): void;
        addBodyCell(cell: TablixCell): void;
        footer: TablixCell;
        resize(width: number): void;
        fixSize(): void;
        clearSize(): void;
        getContentContextualWidth(): number;
        getCellIContentContextualWidth(cell: TablixCell): number;
        getCellSpanningWidthWithScrolling(cell: ITablixCell, tablixGrid: TablixGrid): number;
        getScrollingOffset(): number;
        getContextualWidth(): number;
        calculateSize(): void;
        setAligningContextualWidth(size: number): void;
        getAligningContextualWidth(): number;
        private setContentWidth(value);
        getTablixCell(): TablixCell;
        getIndex(grid: TablixGrid): number;
        getHeaders(): TablixCell[];
        getOtherDimensionHeaders(): TablixCell[];
        getCellContextualSpan(cell: TablixCell): number;
        getOtherDimensionOwner(cell: TablixCell): ITablixGridItem;
    }
    class TablixRow implements ITablixGridItem {
        private _allocatedCells;
        _realizedRowHeaders: TablixCell[];
        _realizedColumnHeaders: TablixCell[];
        _realizedBodyCells: TablixCell[];
        _realizedCornerCells: TablixCell[];
        private _realizedCellsCount;
        private _heightFixed;
        private _contentHeight;
        private _height;
        private _presenter;
        private _owner;
        constructor(presenter: TablixRowPresenter);
        initialize(owner: TablixGrid): void;
        presenter: TablixRowPresenter;
        owner: TablixGrid;
        releaseUnusedCells(owner: TablixControl): void;
        releaseAllCells(owner: TablixControl): void;
        private releaseCells(owner, startIndex);
        moveScrollableCellsToEnd(count: number): void;
        moveScrollableCellsToStart(count: number): void;
        getOrCreateCornerCell(column: TablixColumn): TablixCell;
        getOrCreateRowHeader(column: TablixColumn, scrollable: boolean, leaf: boolean): TablixCell;
        getOrCreateColumnHeader(column: TablixColumn, scrollable: boolean, leaf: boolean): TablixCell;
        getOrCreateBodyCell(column: TablixColumn, scrollable: boolean): TablixCell;
        getOrCreateFooterRowHeader(column: TablixColumn): TablixCell;
        getOrCreateFooterBodyCell(column: TablixColumn, scrollable: boolean): TablixCell;
        getRowHeaderLeafIndex(): number;
        getAllocatedCellAt(index: number): TablixCell;
        moveCellsBy(delta: number): void;
        getRealizedCellCount(): number;
        getRealizedHeadersCount(): number;
        getRealizedHeaderAt(index: number): TablixCell;
        getTablixCell(): TablixCell;
        getOrCreateEmptySpaceCell(): TablixCell;
        private createCell(row);
        private getOrCreateCell();
        resize(height: number): void;
        fixSize(): void;
        getContentContextualWidth(): number;
        getCellIContentContextualWidth(cell: TablixCell): number;
        getCellSpanningHeight(cell: ITablixCell, tablixGrid: TablixGrid): number;
        getContextualWidth(): number;
        sizeFixed(): boolean;
        calculateSize(): void;
        setAligningContextualWidth(size: number): void;
        getAligningContextualWidth(): number;
        private setContentHeight();
        getIndex(grid: TablixGrid): number;
        getHeaders(): TablixCell[];
        getOtherDimensionHeaders(): TablixCell[];
        getCellContextualSpan(cell: TablixCell): number;
        getOtherDimensionOwner(cell: TablixCell): ITablixGridItem;
    }
    class TablixGrid {
        private _owner;
        private _rows;
        private _realizedRows;
        private _columns;
        private _realizedColumns;
        private _footerRow;
        private _emptySpaceHeaderCell;
        private _emptyFooterSpaceCell;
        _presenter: TablixGridPresenter;
        private _fillColumnsProportionally;
        constructor(presenter: TablixGridPresenter);
        initialize(owner: TablixControl, gridHost: HTMLElement, footerHost: HTMLElement): void;
        owner: TablixControl;
        fillColumnsProportionally: boolean;
        realizedColumns: TablixColumn[];
        realizedRows: TablixRow[];
        footerRow: TablixRow;
        emptySpaceHeaderCell: TablixCell;
        emptySpaceFooterCell: TablixCell;
        ShowEmptySpaceCells(rowSpan: number, width: number): void;
        HideEmptySpaceCells(): void;
        onStartRenderingIteration(clear: boolean): void;
        onEndRenderingIteration(): void;
        onStartRenderingSession(): void;
        onEndRenderingSession(): void;
        getOrCreateRow(rowIndex: number): TablixRow;
        getOrCreateFootersRow(): TablixRow;
        moveRowsToEnd(moveFromIndex: number, count: number): void;
        moveRowsToStart(moveToIndex: number, count: number): void;
        moveColumnsToEnd(moveFromIndex: number, count: number): void;
        moveColumnsToStart(moveToIndex: number, count: number): void;
        getOrCreateColumn(columnIndex: number): TablixColumn;
        private initializeColumns(clear);
        private initializeRows(clear);
        getWidth(): number;
        getHeight(): number;
    }
}
declare module powerbi.visuals.controls.internal {
    class TablixDomResizer extends TablixResizer {
        private _cell;
        constructor(cell: TablixCell, element: HTMLElement, handler: ITablixResizeHandler);
        cell: TablixCell;
        _hotSpot(position: {
            x: number;
            y: number;
        }): boolean;
    }
    class TablixCellPresenter {
        static _noMarginsStyle: HTMLStyleElement;
        static _noMarginsStyleName: string;
        static _dragResizeDisabledAttributeName: string;
        private _owner;
        private _tableCell;
        private _contentElement;
        private _contentHost;
        private _contentHostStyle;
        private _containerStyle;
        private _resizer;
        constructor(fitProportionally: boolean, layoutKind: TablixLayoutKind);
        initialize(owner: TablixCell): void;
        owner: TablixCell;
        registerTableCell(tableCell: HTMLTableCellElement): void;
        tableCell: HTMLTableCellElement;
        contentElement: HTMLElement;
        contentHost: HTMLElement;
        registerClickHandler(handler: (e: MouseEvent) => any): void;
        unregisterClickHandler(): void;
        onContentWidthChanged(value: number): void;
        onContentHeightChanged(height: number): void;
        onColumnSpanChanged(value: number): void;
        onRowSpanChanged(value: number): void;
        onTextAlignChanged(value: string): void;
        onClear(): void;
        onHorizontalScroll(width: number, offset: number): void;
        onVerticalScroll(height: number, offset: number): void;
        onInitializeScrolling(): void;
        setContentHostStyle(style: string): void;
        setContainerStyle(style: string): void;
        clearContainerStyle(): void;
        enableHorizontalResize(enable: boolean, handler: ITablixResizeHandler): void;
        static addNoMarginStyle(): void;
        disableDragResize(): void;
    }
    class TablixRowPresenter {
        private _row;
        private _tableRow;
        private _fitProportionally;
        constructor(fitProportionally: boolean);
        initialize(row: TablixRow): void;
        createCellPresenter(layoutKind: controls.TablixLayoutKind): TablixCellPresenter;
        registerRow(tableRow: HTMLTableRowElement): void;
        onAppendCell(cell: TablixCell): void;
        onInsertCellBefore(cell: TablixCell, refCell: TablixCell): void;
        onRemoveCell(cell: TablixCell): void;
        getHeight(): number;
        getCellHeight(cell: ITablixCell): number;
        getCellContentHeight(cell: ITablixCell): number;
        tableRow: HTMLTableRowElement;
    }
    class DashboardRowPresenter extends TablixRowPresenter {
        private _gridPresenter;
        constructor(gridPresenter: DashboardTablixGridPresenter, fitProportionally: boolean);
        getCellHeight(cell: ITablixCell): number;
        getCellContentHeight(cell: ITablixCell): number;
    }
    class CanvasRowPresenter extends TablixRowPresenter {
        getCellHeight(cell: ITablixCell): number;
        getCellContentHeight(cell: ITablixCell): number;
    }
    class TablixColumnPresenter {
        protected _column: TablixColumn;
        initialize(column: TablixColumn): void;
        getWidth(): number;
        getCellWidth(cell: ITablixCell): number;
        getCellContentWidth(cell: ITablixCell): number;
    }
    class DashboardColumnPresenter extends TablixColumnPresenter {
        private _gridPresenter;
        constructor(gridPresenter: DashboardTablixGridPresenter);
        getCellWidth(cell: ITablixCell): number;
        getCellContentWidth(cell: ITablixCell): number;
    }
    class CanvasColumnPresenter extends TablixColumnPresenter {
        getCellWidth(cell: ITablixCell): number;
        getCellContentWidth(cell: ITablixCell): number;
    }
    class TablixGridPresenter {
        protected _table: HTMLTableElement;
        protected _owner: TablixGrid;
        private _footerTable;
        constructor();
        initialize(owner: TablixGrid, gridHost: HTMLElement, footerHost: HTMLElement, control: TablixControl): void;
        getWidth(): number;
        getHeight(): number;
        getScreenToCssRatioX(): number;
        getScreenToCssRatioY(): number;
        createRowPresenter(): TablixRowPresenter;
        createColumnPresenter(): TablixColumnPresenter;
        onAppendRow(row: TablixRow): void;
        onInsertRowBefore(row: TablixRow, refRow: TablixRow): void;
        onRemoveRow(row: TablixRow): void;
        onAddFooterRow(row: TablixRow): void;
        onClear(): void;
        onFillColumnsProportionallyChanged(value: boolean): void;
    }
    class DashboardTablixGridPresenter extends TablixGridPresenter {
        private _sizeComputationManager;
        constructor(sizeComputationManager: SizeComputationManager);
        createRowPresenter(): TablixRowPresenter;
        createColumnPresenter(): TablixColumnPresenter;
        sizeComputationManager: SizeComputationManager;
        getWidth(): number;
        getHeight(): number;
    }
    class CanvasTablixGridPresenter extends TablixGridPresenter {
        createRowPresenter(): TablixRowPresenter;
        createColumnPresenter(): TablixColumnPresenter;
        getWidth(): number;
        getHeight(): number;
    }
}
declare module powerbi.visuals.controls.internal {
    /** Base class for Tablix realization manager
      */
    class TablixDimensionRealizationManager {
        private _realizedLeavesCount;
        private _adjustmentFactor;
        private _itemsToRealizeCount;
        private _itemsEstimatedContextualWidth;
        private _binder;
        constructor(binder: ITablixBinder);
        _getOwner(): DimensionLayoutManager;
        binder: ITablixBinder;
        adjustmentFactor: number;
        itemsToRealizeCount: number;
        itemsEstimatedContextualWidth: number;
        onStartRenderingIteration(): void;
        onEndRenderingIteration(gridContextualWidth: number, filled: boolean): void;
        onEndRenderingSession(): void;
        onCornerCellRealized(item: any, cell: ITablixCell): void;
        onHeaderRealized(item: any, cell: ITablixCell, leaf: boolean): void;
        needsToRealize: boolean;
        _getEstimatedItemsToRealizeCount(): void;
        _getSizeAdjustment(gridContextualWidth: number): number;
    }
    /** DOM implementation for Row Tablix realization manager
      */
    class RowRealizationManager extends TablixDimensionRealizationManager {
        private _owner;
        owner: RowLayoutManager;
        _getOwner(): DimensionLayoutManager;
        _getEstimatedItemsToRealizeCount(): void;
        private estimateRowsToRealizeCount();
        getEstimatedRowHierarchyWidth(): number;
        private updateRowHiearchyEstimatedWidth(items, firstVisibleIndex, levels);
        _getSizeAdjustment(gridContextualWidth: number): number;
    }
    /** DOM implementation for Column Tablix realization manager
      */
    class ColumnRealizationManager extends TablixDimensionRealizationManager {
        private _owner;
        owner: ColumnLayoutManager;
        _getOwner(): DimensionLayoutManager;
        _getEstimatedItemsToRealizeCount(): void;
        private rowRealizationManager;
        private getEstimatedRowHierarchyWidth();
        private estimateColumnsToRealizeCount(rowHierarchyWidth);
        _getSizeAdjustment(gridContextualWidth: number): number;
    }
    class RowWidths {
        items: RowWidth[];
        leafCount: any;
        constructor();
    }
    class RowWidth {
        maxLeafWidth: number;
        maxNonLeafWidth: number;
    }
}
declare module powerbi.visuals.controls.internal {
    /** This class is used for layouts that don't or cannot
        rely on DOM measurements.  Instead they compute all required
        widths and heights and store it in this structure. */
    class SizeComputationManager {
        private static DashboardCellPaddingLeft;
        private static DashboardCellPaddingRight;
        private static DashboardRowHeight;
        private _viewport;
        private _columnCount;
        private _cellWidth;
        private _cellHeight;
        visibleWidth: number;
        visibleHeight: number;
        gridWidth: number;
        gridHeight: number;
        rowHeight: number;
        cellWidth: number;
        cellHeight: number;
        contentWidth: number;
        contentHeight: number;
        updateColumnCount(columnCount: number): void;
        updateViewport(viewport: IViewport): void;
        private computeColumnWidth(totalColumnCount);
        private fitToColumnCount(desiredColumnCount, totalColumnCount);
    }
    class DimensionLayoutManager implements IDimensionLayoutManager {
        static _pixelPrecision: number;
        static _scrollOffsetPrecision: number;
        _grid: TablixGrid;
        _gridOffset: number;
        protected _contextualWidthToFill: number;
        private _owner;
        private _realizationManager;
        private _alignToEnd;
        private _lastScrollOffset;
        private _isScrolling;
        private _fixedSizeEnabled;
        private _done;
        private _measureEnabled;
        constructor(owner: TablixLayoutManager, grid: TablixGrid, realizationManager: TablixDimensionRealizationManager);
        owner: TablixLayoutManager;
        realizationManager: TablixDimensionRealizationManager;
        fixedSizeEnabled: boolean;
        onCornerCellRealized(item: any, cell: ITablixCell, leaf: boolean): void;
        onHeaderRealized(item: any, cell: ITablixCell, leaf: any): void;
        needsToRealize: boolean;
        getVisibleSizeRatio(): number;
        alignToEnd: boolean;
        done: boolean;
        _requiresMeasure(): boolean;
        startScrollingSession(): void;
        endScrollingSession(): void;
        isScrolling(): boolean;
        isResizing(): boolean;
        getOtherHierarchyContextualHeight(): number;
        _isAutoSized(): boolean;
        onStartRenderingSession(): void;
        onEndRenderingSession(): void;
        /**
        *   Implementing classes must override this to send dimentions to TablixControl
        **/
        _sendDimensionsToControl(): void;
        measureEnabled: boolean;
        getFooterContextualWidth(): number;
        onStartRenderingIteration(clear: boolean, contextualWidth: number): void;
        allItemsRealized: boolean;
        onEndRenderingIteration(): void;
        private getScrollDeltaWithinPage();
        private swapElements();
        _getRealizedItems(): ITablixGridItem[];
        getRealizedItemsCount(): number;
        _moveElementsToBottom(moveFromIndex: number, count: any): void;
        _moveElementsToTop(moveToIndex: number, count: any): void;
        isScrollingWithinPage(): boolean;
        getGridContextualWidth(): number;
        private updateScrollbar(gridContextualWidth);
        getViewSize(gridContextualWidth: number): number;
        isScrollableHeader(item: any, items: any, index: number): boolean;
        reachedEnd(): boolean;
        scrollBackwardToFill(gridContextualWidth: number): number;
        private getItemContextualWidth(index);
        private getItemContextualWidthWithScrolling(index);
        getSizeWithScrolling(size: number, index: number): number;
        getGridContextualWidthFromItems(): number;
        private getMeaurementError(gridContextualWidth);
        private scrollForwardToAlignEnd(gridContextualWidth);
        dimension: TablixDimension;
        otherLayoutManager: DimensionLayoutManager;
        contextualWidthToFill: number;
        getGridScale(): number;
        otherScrollbarContextualWidth: number;
        getActualContextualWidth(gridContextualWidth: number): number;
        protected canScroll(gridContextualWidth: number): boolean;
        calculateSizes(): void;
        protected _calculateSize(item: ITablixGridItem): void;
        calculateContextualWidths(): void;
        calculateSpans(): void;
        updateNonScrollableItemsSpans(): void;
        updateScrollableItemsSpans(): void;
        fixSizes(): void;
        private updateSpans(otherRealizedItem, cells);
        private updateLastChildSize(spanningCell, item, totalSpanSize);
    }
    class ResizeState {
        item: any;
        itemType: TablixCellType;
        column: TablixColumn;
        startColumnWidth: number;
        resizingDelta: number;
        animationFrame: number;
        scale: number;
        constructor(column: TablixColumn, width: number, scale: number);
    }
    class ColumnLayoutManager extends DimensionLayoutManager implements ITablixResizeHandler {
        static minColumnWidth: number;
        private _resizeState;
        constructor(owner: TablixLayoutManager, grid: TablixGrid, realizationManager: ColumnRealizationManager);
        dimension: TablixDimension;
        isResizing(): boolean;
        fillProportionally: boolean;
        getGridScale(): number;
        otherScrollbarContextualWidth: number;
        _getRealizedItems(): ITablixGridItem[];
        _moveElementsToBottom(moveFromIndex: number, count: any): void;
        _moveElementsToTop(moveToIndex: number, count: any): void;
        _requiresMeasure(): boolean;
        getGridContextualWidth(): number;
        private getFirstVisibleColumn();
        _isAutoSized(): boolean;
        applyScrolling(): void;
        private scroll(firstVisibleColumn, width, offset);
        private scrollCells(cells, width, offset);
        private scrollBodyCells(rows, width, offset);
        onStartResize(cell: TablixCell, currentX: number, currentY: number): void;
        onResize(cell: TablixCell, deltaX: number, deltaY: number): void;
        onEndResize(cell: TablixCell): void;
        onReset(cell: TablixCell): void;
        updateItemToResizeState(realizedColumns: TablixColumn[]): void;
        private performResizing();
        /**
        *   Sends column related data (pixel size, column count, etc) to TablixControl
        **/
        _sendDimensionsToControl(): void;
        getEstimatedHeaderWidth(label: string, headerIndex: number): number;
        getEstimatedBodyCellWidth(content: string): number;
    }
    class DashboardColumnLayoutManager extends ColumnLayoutManager {
        getEstimatedHeaderWidth(label: string, headerIndex: number): number;
        getEstimatedBodyCellWidth(content: string): number;
        protected canScroll(gridContextualWidth: number): boolean;
        protected _calculateSize(item: ITablixGridItem): void;
        private ignoreColumn(headerIndex);
    }
    class CanvasColumnLayoutManager extends ColumnLayoutManager {
        getEstimatedHeaderWidth(label: string, headerIndex: number): number;
        getEstimatedBodyCellWidth(content: string): number;
        protected canScroll(gridContextualWidth: number): boolean;
        protected _calculateSize(item: ITablixGridItem): void;
    }
    class RowLayoutManager extends DimensionLayoutManager {
        constructor(owner: TablixLayoutManager, grid: TablixGrid, realizationManager: RowRealizationManager);
        dimension: TablixDimension;
        getGridScale(): number;
        otherScrollbarContextualWidth: number;
        startScrollingSession(): void;
        _getRealizedItems(): ITablixGridItem[];
        _moveElementsToBottom(moveFromIndex: number, count: any): void;
        _moveElementsToTop(moveToIndex: number, count: any): void;
        _requiresMeasure(): boolean;
        getGridContextualWidth(): number;
        private getFirstVisibleRow();
        _isAutoSized(): boolean;
        applyScrolling(): void;
        private scroll(firstVisibleRow, height, offset);
        private scrollCells(cells, height, offset);
        getFooterContextualWidth(): number;
        calculateContextualWidths(): void;
        fixSizes(): void;
        /**
        *   Sends row related data (pixel size, column count, etc) to TablixControl
        **/
        _sendDimensionsToControl(): void;
        getEstimatedHeaderWidth(label: string, headerIndex: number): number;
    }
    class DashboardRowLayoutManager extends RowLayoutManager {
        getEstimatedHeaderWidth(label: string, headerIndex: number): number;
        protected canScroll(gridContextualWidth: number): boolean;
        protected _calculateSize(item: ITablixGridItem): void;
        private getHeaderWidth(headerIndex);
    }
    class CanvasRowLayoutManager extends RowLayoutManager {
        getEstimatedHeaderWidth(label: string, headerIndex: number): number;
        protected canScroll(gridContextualWidth: number): boolean;
        protected _calculateSize(item: ITablixGridItem): void;
    }
    class TablixLayoutManager {
        protected _owner: TablixControl;
        protected _container: HTMLElement;
        protected _columnLayoutManager: ColumnLayoutManager;
        protected _rowLayoutManager: RowLayoutManager;
        private _binder;
        private _scrollingDimension;
        private _gridHost;
        private _footersHost;
        private _grid;
        private _allowHeaderResize;
        constructor(binder: ITablixBinder, grid: TablixGrid, columnLayoutManager: ColumnLayoutManager, rowLayoutManager: RowLayoutManager);
        initialize(owner: TablixControl): void;
        owner: TablixControl;
        binder: ITablixBinder;
        getTablixClassName(): string;
        getLayoutKind(): TablixLayoutKind;
        getOrCreateColumnHeader(item: any, items: any, rowIndex: number, columnIndex: number): ITablixCell;
        getOrCreateRowHeader(item: any, items: any, rowIndex: number, columnIndex: number): ITablixCell;
        getOrCreateCornerCell(item: any, rowLevel: number, columnLevel: number): ITablixCell;
        getOrCreateBodyCell(cellItem: any, rowItem: any, rowItems: any, rowIndex: number, columnIndex: number): ITablixCell;
        getOrCreateFooterBodyCell(cellItem: any, columnIndex: number): ITablixCell;
        getOrCreateFooterRowHeader(item: any, items: any): ITablixCell;
        getVisibleWidth(): number;
        getVisibleHeight(): number;
        updateColumnCount(rowDimension: TablixRowDimension, columnDimension: TablixColumnDimension): void;
        updateViewport(viewport: IViewport): void;
        getEstimatedRowHeight(): number;
        getCellWidth(cell: ITablixCell): number;
        getContentWidth(cell: ITablixCell): number;
        /**
        * This call makes room for parent header cells where neccessary. Since HTML cells that span vertically displace other rows,
        * room has to be made for spanning headers that leave an exiting row to enter the new row that it starts from and removed when
        * returning to an entering row.
        **/
        private alignRowHeaderCells(item, currentRow);
        grid: TablixGrid;
        rowLayoutManager: DimensionLayoutManager;
        columnLayoutManager: DimensionLayoutManager;
        protected showEmptySpaceHeader(): boolean;
        onStartRenderingSession(scrollingDimension: TablixDimension, parentElement: HTMLElement): void;
        onEndRenderingSession(): void;
        onStartRenderingIteration(clear: boolean): void;
        onEndRenderingIteration(): boolean;
        onCornerCellRealized(item: any, cell: ITablixCell): void;
        onRowHeaderRealized(item: any, cell: ITablixCell): void;
        onRowHeaderFooterRealized(item: any, cell: ITablixCell): void;
        onColumnHeaderRealized(item: any, cell: ITablixCell): void;
        onBodyCellRealized(item: any, cell: ITablixCell): void;
        onBodyCellFooterRealized(item: any, cell: ITablixCell): void;
        setAllowHeaderResize(value: boolean): void;
        enableCellHorizontalResize(isLeaf: boolean, cell: TablixCell): void;
        getEstimatedTextWidth(label: string): number;
        measureSampleText(parentElement: HTMLElement): void;
    }
    class DashboardTablixLayoutManager extends TablixLayoutManager {
        private _sizeComputationManager;
        constructor(binder: ITablixBinder, sizeComputationManager: SizeComputationManager, grid: TablixGrid, rowRealizationManager: RowRealizationManager, columnRealizationManager: ColumnRealizationManager);
        static createLayoutManager(binder: ITablixBinder): DashboardTablixLayoutManager;
        getTablixClassName(): string;
        getLayoutKind(): TablixLayoutKind;
        protected showEmptySpaceHeader(): boolean;
        measureSampleText(parentElement: HTMLElement): void;
        getVisibleWidth(): number;
        getVisibleHeight(): number;
        getCellWidth(cell: ITablixCell): number;
        getContentWidth(cell: ITablixCell): number;
        getEstimatedTextWidth(label: string): number;
        updateColumnCount(rowDimension: TablixRowDimension, columnDimension: TablixColumnDimension): void;
        updateViewport(viewport: IViewport): void;
        getEstimatedRowHeight(): number;
    }
    class CanvasTablixLayoutManager extends TablixLayoutManager {
        private characterWidth;
        private characterHeight;
        constructor(binder: ITablixBinder, grid: TablixGrid, rowRealizationManager: RowRealizationManager, columnRealizationManager: ColumnRealizationManager);
        static createLayoutManager(binder: ITablixBinder): CanvasTablixLayoutManager;
        getTablixClassName(): string;
        getLayoutKind(): TablixLayoutKind;
        measureSampleText(parentElement: HTMLElement): void;
        protected showEmptySpaceHeader(): boolean;
        getVisibleWidth(): number;
        getVisibleHeight(): number;
        getCellWidth(cell: ITablixCell): number;
        getContentWidth(cell: ITablixCell): number;
        getEstimatedTextWidth(text: string): number;
        updateColumnCount(rowDimension: TablixRowDimension, columnDimension: TablixColumnDimension): void;
        updateViewport(viewport: IViewport): void;
        getEstimatedRowHeight(): number;
    }
}
declare module powerbi.visuals.controls {
    module HTMLElementUtils {
        function clearChildren(element: HTMLElement): void;
        function setElementTop(element: HTMLElement, top: number): void;
        function setElementLeft(element: HTMLElement, left: number): void;
        function setElementHeight(element: HTMLElement, height: number): void;
        function setElementWidth(element: HTMLElement, width: number): void;
        function getElementWidth(element: HTMLElement): number;
        function getElementHeight(element: HTMLElement): number;
        function isAutoSize(size: number): boolean;
        function getAccumulatedScale(element: HTMLElement): number;
        function getScale(element: any): number;
    }
}
declare module powerbi.visuals.controls.internal {
    module TablixUtils {
        function createTable(): HTMLTableElement;
        function createDiv(): HTMLDivElement;
        function appendATagToBodyCell(value: string, cell: controls.ITablixCell): void;
    }
}
declare module powerbi.visuals.controls {
    interface ITablixHierarchyNavigator {
        /**
        * Returns the depth of a hierarchy.
        *
        * @param hierarchy: Object representing the hierarchy.
        */
        getDepth(hierarchy: any): number;
        /**
        * Returns the leaf count of a hierarchy.
        *
        * @param hierarchy: Object representing the hierarchy.
        */
        getLeafCount(hierarchy: any): number;
        /**
        * Returns the leaf member of a hierarchy at the specified index.
        *
        * @param hierarchy: Object representing the hierarchy.
        * @param index: Index of leaf member.
        */
        getLeafAt(hierarchy: any, index: number): any;
        /**
        * Returns the specified hierarchy member parent.
        *
        * @param item: Hierarchy member.
        */
        getParent(item: any): any;
        /**
        * Returns the index of the hierarchy member relative to its parent.
        *
        * @param item: Hierarchy member.
        */
        getIndex(item: any): number;
        /**
        * Checks whether a hierarchy member is a leaf.
        *
        * @param item: Hierarchy member.
        */
        isLeaf(item: any): boolean;
        isRowHierarchyLeaf(cornerItem: any): boolean;
        isColumnHierarchyLeaf(cornerItem: any): boolean;
        /**
        * Checks whether a hierarchy member is the last item within its parent.
        *
        * @param item: Hierarchy member.
        * @param items: A collection of hierarchy members.
        */
        isLastItem(item: any, items: any): boolean;
        /**
        * Gets the children members of a hierarchy member.
        *
        * @param item: Hierarchy member.
        */
        getChildren(item: any): any;
        /**
        * Gets the members count in a specified collection.
        *
        * @param item: Hierarchy member.
        */
        getCount(items: any): number;
        /**
        * Gets the member at the specified index.
        *
        * @param items: A collection of hierarchy members.
        * @param index: Index of member to return.
        */
        getAt(items: any, index: number): any;
        /**
        * Gets the hierarchy member level.
        *
        * @param item: Hierarchy member.
        */
        getLevel(item: any): number;
        /**
        * Returns the intersection between a row and a column item.
        *
        * @param rowItem: A row member.
        * @param columnItem: A column member.
        */
        getIntersection(rowItem: any, columnItem: any): any;
        /**
        * Returns the corner cell between a row and a column level.
        *
        * @param rowLevel: A level in the row hierarchy.
        * @param columnLevel: A level in the column hierarchy.
        */
        getCorner(rowLevel: number, columnLevel: number): any;
        headerItemEquals(item1: any, item2: any): boolean;
        bodyCellItemEquals(item1: any, item2: any): boolean;
        cornerCellItemEquals(item1: any, item2: any): boolean;
    }
}
declare module powerbi.visuals.controls {
    interface ITablixBinder {
        onStartRenderingSession(): void;
        onEndRenderingSession(): void;
        /**  Binds the row hierarchy member to the DOM element. */
        bindRowHeader(item: any, cell: ITablixCell): void;
        unbindRowHeader(item: any, cell: ITablixCell): void;
        /**  Binds the column hierarchy member to the DOM element. */
        bindColumnHeader(item: any, cell: ITablixCell): void;
        unbindColumnHeader(item: any, cell: ITablixCell): void;
        /**  Binds the intersection between a row and a column hierarchy member to the DOM element. */
        bindBodyCell(item: any, cell: ITablixCell): void;
        unbindBodyCell(item: any, cell: ITablixCell): void;
        /**  Binds the corner cell to the DOM element. */
        bindCornerCell(item: any, cell: ITablixCell): void;
        unbindCornerCell(item: any, cell: ITablixCell): void;
        bindEmptySpaceHeaderCell(cell: ITablixCell): void;
        unbindEmptySpaceHeaderCell(cell: ITablixCell): void;
        bindEmptySpaceFooterCell(cell: ITablixCell): void;
        unbindEmptySpaceFooterCell(cell: ITablixCell): void;
        /**  Measurement Helper */
        getHeaderLabel(item: any): string;
        getCellContent(item: any): string;
        hasRowGroups(): boolean;
    }
}
declare module powerbi.visuals.controls {
    enum TablixCellType {
        CornerCell = 0,
        RowHeader = 1,
        ColumnHeader = 2,
        BodyCell = 3,
    }
    interface ITablixCell {
        type: TablixCellType;
        item: any;
        colSpan: number;
        rowSpan: number;
        textAlign: string;
        extension: any;
    }
    interface IDimensionLayoutManager {
        measureEnabled: boolean;
        getRealizedItemsCount(): number;
        needsToRealize: boolean;
    }
}
declare module powerbi.visuals.controls {
    interface TablixRenderArgs {
        rowScrollOffset?: number;
        columnScrollOffset?: number;
        scrollingDimension?: TablixDimension;
    }
    interface GridDimensions {
        rowCount?: number;
        columnCount?: number;
        rowHierarchyWidth?: number;
        rowHierarchyHeight?: number;
        rowHierarchyContentHeight?: number;
        columnHierarchyWidth?: number;
        columnHierarchyHeight?: number;
        footerHeight?: number;
    }
    enum TablixLayoutKind {
        Canvas = 0,
        DashboardTile = 1,
    }
    interface TablixOptions {
        interactive?: boolean;
        enableTouchSupport?: boolean;
    }
    class TablixControl {
        private static UnitOfMeasurement;
        private static MouseWheelRange;
        private _hierarchyNavigator;
        private _binder;
        private _columnDimension;
        private _rowDimension;
        private _layoutManager;
        private _container;
        private _mainDiv;
        private _footerDiv;
        private _scrollbarWidth;
        private _fixSizedClassName;
        private _touchManager;
        private _columnTouchDelegate;
        private _rowTouchDelegate;
        private _bodyTouchDelegate;
        private _footerTouchDelegate;
        private _touchInterpreter;
        private _footerTouchInterpreter;
        private _gridDimensions;
        private _lastRenderingArgs;
        private _autoSizeWidth;
        private _autoSizeHeight;
        private _viewport;
        private _maxWidth;
        private _maxHeight;
        private _minWidth;
        private _minHeight;
        private _options;
        private _isTouchEnabled;
        private _renderIterationCount;
        constructor(hierarchyNavigator: ITablixHierarchyNavigator, layoutManager: internal.TablixLayoutManager, binder: ITablixBinder, parentDomElement: HTMLElement, options: TablixOptions);
        private InitializeTouchSupport();
        private InitializeScrollbars();
        container: HTMLElement;
        contentHost: HTMLElement;
        footerHost: HTMLElement;
        className: string;
        hierarchyNavigator: ITablixHierarchyNavigator;
        binder: ITablixBinder;
        autoSizeWidth: boolean;
        autoSizeHeight: boolean;
        maxWidth: number;
        viewport: IViewport;
        maxHeight: number;
        minWidth: number;
        minHeight: number;
        scrollbarWidth: number;
        updateModels(resetScrollOffsets: boolean, rowModel?: any, columnModel?: any): void;
        updateColumnDimensions(rowHierarchyWidth: number, columnHierarchyWidth: number, count: number): void;
        updateRowDimensions(columnHierarchyHeight: number, rowHierarchyHeight: number, rowHierarchyContentHeight: number, count: number, footerHeight: any): void;
        private updateTouchDimensions();
        private onMouseWheel(e);
        private onFireFoxMouseWheel(e);
        private mouseWheel(delta);
        layoutManager: internal.TablixLayoutManager;
        columnDimension: TablixColumnDimension;
        rowDimension: TablixRowDimension;
        refresh(clear: boolean): void;
        _onScrollAsync(dimension: TablixDimension): void;
        private performPendingScroll(dimension);
        private updateHorizontalPosition();
        updateFooterVisibility(): void;
        private updateVerticalPosition();
        private alreadyRendered(scrollingDimension);
        private render(clear, scrollingDimension);
        private updateContainerDimensions();
        private cornerCellMatch(item, cell);
        private renderCorner();
        _unbindCell(cell: ITablixCell): void;
        private onTouchEvent(args);
        private addFixedSizeClassNameIfNeeded();
        private removeFixSizedClassName();
    }
}
declare module powerbi.visuals.controls {
    class TablixDimension {
        _hierarchyNavigator: ITablixHierarchyNavigator;
        _otherDimension: any;
        _owner: TablixControl;
        _binder: ITablixBinder;
        _tablixLayoutManager: internal.TablixLayoutManager;
        _layoutManager: IDimensionLayoutManager;
        model: any;
        scrollOffset: number;
        private _scrollStep;
        private _firstVisibleScrollIndex;
        private _scrollbar;
        _scrollItems: any[];
        constructor(tablixControl: TablixControl);
        _onStartRenderingIteration(clear: boolean): void;
        _onEndRenderingIteration(): void;
        getValidScrollOffset(scrollOffset: number): number;
        makeScrollOffsetValid(): void;
        getIntegerScrollOffset(): number;
        getFractionScrollOffset(): number;
        scrollbar: Scrollbar;
        getFirstVisibleItem(level: number): any;
        getFirstVisibleChild(item: any): any;
        getFirstVisibleChildIndex(item: any): number;
        _initializeScrollbar(parentElement: HTMLElement, touchDiv: HTMLDivElement): void;
        getItemsCount(): number;
        getDepth(): number;
        private onScroll();
        otherDimension: TablixDimension;
        layoutManager: IDimensionLayoutManager;
        _createScrollbar(parentElement: HTMLElement): Scrollbar;
        private updateScrollPosition();
    }
    class TablixRowDimension extends TablixDimension {
        private _footer;
        constructor(tablixControl: TablixControl);
        setFooter(footerHeader: any): void;
        hasFooter(): boolean;
        /**
        * This method first populates the footer followed by each row and their correlating body cells from top to bottom.
        **/
        _render(): void;
        _createScrollbar(parentElement: HTMLElement): Scrollbar;
        /**
        * addNodes is a recursive call (with its recursive behavior in addNode()) that will navigate
        * through the row hierarchy in DFS (Depth First Search) order and continue into a single row
        * upto its estimated edge.
        **/
        private addNodes(items, rowIndex, depth, firstVisibleIndex);
        getFirstVisibleChildLeaf(item: any): any;
        private bindRowHeader(item, cell);
        /**
        * This method can be thought of as the continuation of addNodes() as it continues the DFS (Depth First Search)
        * started from addNodes(). This function also handles ending the recursion with "_needsToRealize" being set to
        * false.
        *
        * Once the body cells are reached, populating is done linearly with addBodyCells().
        **/
        private addNode(item, items, rowIndex, depth);
        private rowHeaderMatch(item, cell);
        private addBodyCells(item, items, rowIndex);
        private bindBodyCell(item, cell);
        private addFooterRowHeader(item);
        private addFooterBodyCells(rowItem);
        private bodyCelMatch(item, cell);
    }
    class TablixColumnDimension extends TablixDimension {
        constructor(tablixControl: TablixControl);
        _render(): void;
        _createScrollbar(parentElement: HTMLElement): Scrollbar;
        private addNodes(items, columnIndex, depth, firstVisibleIndex);
        private addNode(item, items, columnIndex, depth);
        columnHeaderMatch(item: any, cell: ITablixCell): boolean;
    }
}
declare module powerbi.visuals.controls {
    /**
    *   This class represents the touch region of the column headers (this can also apply to footer/total).
    *   This class is reponsible for interpreting gestures in terms of pixels to changes in column position.
    *
    *   Unlike the table body, this can only scroll in one direction.
    */
    class ColumnTouchDelegate implements TouchUtils.ITouchHandler, TouchUtils.IPixelToItem {
        /** _dimension: used to termine if the touch event is within bounds */
        private _dimension;
        /** _averageSize: average pixel width of columns in table*/
        private _averageSize;
        /** _tablixControl: used for 'firing' a scroll event following a received gesture*/
        private _tablixControl;
        /** _handlers: stores the event handler of TablixControl for scroll events*/
        private _handlers;
        /**
        * @param region: location and area of the touch region in respect to its HTML element
        */
        constructor(region: TouchUtils.Rectangle);
        dimension: TouchUtils.Rectangle;
        /**
        * Sets the amount of columns to be shifted per delta in pixels.
        *
        * @param: xRatio column to pixel ratio (# columns / # pixels)
        */
        setScrollDensity(xRatio: number): void;
        /**
        * @param x: X location from upper left of listened HTML element.
        * @param y: Y location from upper left of listened HTML element.
        * @param w: Width of area to listen for events.
        * @param h: Height of area to listen for events.
        */
        resize(x: number, y: number, width: number, height: number): void;
        /**
        * @see: IPixelToItem
        */
        getPixelToItem(x: number, y: number, dx: number, dy: number, down: boolean): TouchUtils.TouchEvent;
        /**
        * Fires event to Tablix Control to scroll with the event passed from the TouchManager.
        *
        * @param e: event recieved from touch manager.
        */
        touchEvent(e: TouchUtils.TouchEvent): void;
        /**
        * Asigns handler for scrolling when scroll event is fired.
        *
        * @param tablixObj: TablixControl that's handling the fired event.
        * @param handlerCall: The call to be made (EXAMPLE: handlerCall = object.method;).
        */
        setHandler(tablixObj: TablixControl, handlerCall: (args: any[]) => void): void;
    }
    /**
    *   This class represents the touch region of the row headers (left or right side aligned).
    *   This class is reponsible for interpreting gestures in terms of pixels to changes in row position.
    *
    *   Unlike the table body, this can only scroll in one direction.
    */
    class RowTouchDelegate implements TouchUtils.ITouchHandler, TouchUtils.IPixelToItem {
        /** _dimension: used to termine if the touch event is within bounds */
        private _dimension;
        /** _averageSize: average pixel height of rows in table*/
        private _averageSize;
        /** _tablixControl: used for 'firing' a scroll event following a recieved gesture*/
        private _tablixControl;
        /** _handlers: stores the event handler of TablixControl for scroll events*/
        private _handlers;
        /**
        * @param region: location and area of the touch region in respect to its HTML element
        */
        constructor(region: TouchUtils.Rectangle);
        dimension: TouchUtils.Rectangle;
        /**
        * Sets the amount of rows to be shifted per delta in pixels.
        *
        * @param: yRatio row to pixel ratio (# rows / # pixels)
        */
        setScrollDensity(yRatio: number): void;
        /**
        * @param x: X location from upper left of listened HTML element.
        * @param y: Y location from upper left of listened HTML element.
        * @param w: Width of area to listen for events.
        * @param h: Height of area to listen for events.
        */
        resize(x: number, y: number, width: number, height: number): void;
        /**
        * @see: IPixelToItem
        */
        getPixelToItem(x: number, y: number, dx: number, dy: number, down: boolean): TouchUtils.TouchEvent;
        /**
        * Fires event to Tablix Control to scroll with the event passed from the TouchManager.
        *
        * @param e: event recieved from touch manager.
        */
        touchEvent(e: TouchUtils.TouchEvent): void;
        /**
        * Asigns handler for scrolling when scroll event is fired.
        *
        * @param tablixObj: TablixControl that's handling the fired event.
        * @param handlerCall: The call to be made (EXAMPLE: handlerCall = object.method;).
        */
        setHandler(tablixObj: TablixControl, handlerCall: (args: any[]) => void): void;
    }
    /**
    *   This class represents the touch region covering the body of the table.
    *   This class is reponsible for interpreting gestures in terms of pixels to
    *   changes in row and column position.
    */
    class BodyTouchDelegate implements TouchUtils.ITouchHandler, TouchUtils.IPixelToItem {
        private static DefaultAverageSizeX;
        private static DefaultAverageSizeY;
        /** _dimension: used to termine if the touch event is within bounds */
        private _dimension;
        /** _averageSizeX: average pixel width of columns in table*/
        private _averageSizeX;
        /** _averageSizeY: average pixel height of rows in table*/
        private _averageSizeY;
        /** _tablixControl: used for 'firing' a scroll event following a recieved gesture*/
        private _tablixControl;
        /** _handlers: stores the event handler of TablixControl for scroll events*/
        private _handlers;
        /**
        * @param region: location and area of the touch region in respect to its HTML element
        */
        constructor(region: TouchUtils.Rectangle);
        /**
        * @return: returns the dimentions of the region this delegate listens to.
        */
        dimension: TouchUtils.Rectangle;
        /**
        * Sets the amount of rows and columns to be shifted per delta in pixels.
        *
        * @param: xRatio column to pixel ratio (# columns / # pixels)
        * @param: yRatio row to pixel ratio (# rows / # pixels)
        */
        setScrollDensity(xRatio: number, yRatio: number): void;
        /**
        * @param x: X location from upper left of listened HTML element.
        * @param y: Y location from upper left of listened HTML element.
        * @param w: Width of area to listen for events.
        * @param h: Height of area to listen for events.
        */
        resize(x: number, y: number, width: number, height: number): void;
        /**
        * @see: IPixelToItem
        */
        getPixelToItem(x: number, y: number, dx: number, dy: number, down: boolean): TouchUtils.TouchEvent;
        /**
        * Fires event to Tablix Control to scroll with the event passed from the TouchManager.
        *
        * @param e: event recieved from touch manager.
        */
        touchEvent(e: TouchUtils.TouchEvent): void;
        /**
        * Asigns handler for scrolling when scroll event is fired.
        *
        * @param tablixObj: TablixControl that's handling the fired event.
        * @param handlerCall: The call to be made (EXAMPLE: handlerCall = object.method;).
        */
        setHandler(tablixObj: TablixControl, handlerCall: (args: any[]) => void): void;
    }
}
declare module powerbi.visuals.controls.TouchUtils {
    class Point {
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        offset(offsetX: number, offsetY: number): void;
    }
    class Rectangle extends Point {
        width: number;
        height: number;
        constructor(x?: number, y?: number, width?: number, height?: number);
        point: Point;
        contains(p: Point): boolean;
        static contains(rect: Rectangle, p: Point): boolean;
        static isEmpty(rect: Rectangle): boolean;
    }
    enum SwipeDirection {
        /** Vertical: swipe gesture moves along the y-axis at an angle within an established threshold*/
        Vertical = 0,
        /** Horizontal: swipe gesture moves along the x-axis at an angle within an established threshold*/
        Horizontal = 1,
        /** FreeForm: swipe gesture does not stay within the thresholds of either x or y-axis*/
        FreeForm = 2,
    }
    enum MouseButton {
        NoClick = 0,
        LeftClick = 1,
        RightClick = 2,
        CenterClick = 3,
    }
    /**
    *   Interface serves as a way to convert pixel point to any needed unit of
    *   positioning over two axises such as row/column positioning.
    */
    interface IPixelToItem {
        getPixelToItem(x: number, y: number, dx: number, dy: number, down: boolean): TouchEvent;
    }
    /**
    *   Interface for listening to a simple touch event that's abstracted away
    *   from any platform specific traits.
    */
    interface ITouchHandler {
        touchEvent(e: TouchEvent): void;
    }
    /**
    *   A simple touch event class that's abstracted away from any platform specific traits.
    */
    class TouchEvent {
        /** _x: x-axis (not neccessarily in pixels (see IPixelToItem)) */
        private _x;
        /** _y: y-axis (not neccessarily in pixels (see IPixelToItem)) */
        private _y;
        /** _dx: delta of x-axis (not neccessarily in pixels (see IPixelToItem)) */
        private _dx;
        /** _dy: delta of y-axis (not neccessarily in pixels (see IPixelToItem)) */
        private _dy;
        /** _isMouseDown: determines if the mouse button is pressed*/
        private _isMouseDown;
        /**
        * @param x: X location of mouse.
        * @param y: Y location of mouse.
        * @param isMouseDown: indicates if the mouse button is held down or a finger press on screen.
        * @param dx: (optional) the change in x of the gesture.
        * @param dy: (optional) the change in y of the gesture.
        */
        constructor(x: number, y: number, isMouseDown: boolean, dx?: number, dy?: number);
        x: number;
        y: number;
        dx: number;
        dy: number;
        /**
        * @return: returns a boolean indicating if the mouse button is held down.
        */
        isMouseDown: boolean;
    }
    /**
    *   This interface defines the datamembers stored for each touch region.
    */
    interface ITouchHandlerSet {
        handler: ITouchHandler;
        region: Rectangle;
        lastPoint: TouchEvent;
        converter: IPixelToItem;
    }
    /**
    *   This class "listens" to the TouchEventInterpreter  to recieve touch events and sends it to all
    *   "Touch Delegates" with  TouchRegions that contain the mouse event. Prior to sending off the
    *   event, its position is put in respect to the delegate's TouchRegion and converted to the appropriate
    *   unit (see IPixelToItem).
    */
    class TouchManager {
        /** _touchList: list of touch regions and their correlating data memebers */
        private _touchList;
        /** _scrollThreshold: boolean to enable thresholds for fixing to an axis when scrolling*/
        private _scrollThreshold;
        /** _lockThreshold: boolean to enable locking to an axis when gesture is fixed to an axis*/
        private _lockThreshold;
        /** _swipeDirection: the current direction of the swipe*/
        private _swipeDirection;
        /** _matchingDirectionCount: the count of consecutive events match the current swipe direction*/
        private _matchingDirectionCount;
        /** _lastEvent: the last recieved mouse event*/
        private _lastEvent;
        /**
        * The default behavior is to enable thresholds and lock to axis.
        */
        constructor();
        lastEvent: TouchEvent;
        /**
        * @param region: rectangle indicating the locations of the touch region.
        * @param handler: handler for recieved touch events.
        * @param converter: converts from pixels to the wanted item of measure (rows, columns, etc).
        *                   EXAMPLE: dx -> from # of pixels to the right to # of columns moved to the right
        */
        addTouchRegion(region: Rectangle, handler: ITouchHandler, converter: IPixelToItem): void;
        /**
        * Sends a mouse up event to all regions with their last event as a mouse down event.
        */
        upAllTouches(): void;
        touchEvent(e: TouchEvent): void;
        /**
        * @param e: position of event used to find touched regions
        * @return: Returns an array of regions that contain the event point.
        */
        private _findRegions(e);
        /**
        * @return: Returns an array of regions that contain a mouse down event. (see ITouchHandlerSet.lastPoint)
        */
        private _getActive();
    }
    /**
    *   This class is responsible for establishing connections to handle touch events
    *   and to interpret those events so they're compatible with the touch abstractions.
    *
    *   Touch events with platform specific handles should be done here.
    */
    class TouchEventInterpreter {
        /** _touchPanel: HTML element that touch events are drawn from. */
        private _touchPanel;
        /** _allowMouseDrag: boolean enabling mouse drag. */
        private _allowMouseDrag;
        /** _manager: touch events are interpreted and passed on this manager. */
        private _manager;
        /** _scale: see TablixLayoutManager */
        private _scale;
        /** _touchReferencePoint: used for mouse location when a secondary div is used along side the primary with this one being the primary. */
        private _touchReferencePoint;
        /** Rectangle containing the targeted Div */
        private _rect;
        private _documentMouseMoveWrapper;
        private _documentMouseUpWrapper;
        constructor(manager: TouchManager);
        initTouch(panel: HTMLElement, touchReferencePoint?: HTMLElement, allowMouseDrag?: boolean): void;
        private getXYByClient(event);
        onTouchStart(e: any): void;
        onTouchMove(e: any): void;
        onTouchEnd(e: any): void;
        onTouchMouseDown(e: MouseEvent): void;
        onTouchMouseMove(e: MouseEvent): void;
        onTouchMouseUp(e: MouseEvent, bubble?: boolean): void;
    }
}
declare module powerbi.visuals {
    interface AnimatedTextConfigurationSettings {
        align?: string;
        maxFontSize?: number;
    }
    /** Base class for values that are animated when resized */
    class AnimatedText {
        static formatStringProp: DataViewObjectPropertyIdentifier;
        protected static objectDescs: data.DataViewObjectDescriptors;
        private name;
        svg: D3.Selection;
        graphicsContext: D3.Selection;
        currentViewport: IViewport;
        value: any;
        hostServices: IVisualHostServices;
        style: IVisualStyle;
        visualConfiguration: AnimatedTextConfigurationSettings;
        metaDataColumn: DataViewMetadataColumn;
        private mainText;
        constructor(name: string);
        getMetaDataColumn(dataView: DataView): void;
        getAdjustedFontHeight(availableWidth: number, textToMeasure: string, seedFontHeight: number): number;
        private getAdjustedFontHeightCore(nodeToMeasure, availableWidth, seedFontHeight, iteration);
        clear(): void;
        doValueTransition(startValue: any, endValue: any, displayUnitSystemType: DisplayUnitSystemType, animationOptions: AnimationOptions, duration: number, forceUpdate: boolean): void;
        getSeedFontHeight(boundingWidth: number, boundingHeight: number): number;
        getTranslateX(width: number): number;
        getTranslateY(height: number): number;
        getTextAnchor(): string;
        protected getFormatString(column: DataViewMetadataColumn): string;
    }
}
declare module powerbi.visuals {
    /** Renders a number that can be animate change in value */
    class AnimatedNumber extends AnimatedText implements IVisual {
        private options;
        private dataViews;
        static capabilities: VisualCapabilities;
        constructor(svg?: D3.Selection);
        init(options: VisualInitOptions): void;
        updateViewportDependantProperties(): void;
        update(options: VisualUpdateOptions): void;
        onDataChanged(options: VisualDataChangedOptions): void;
        onResizing(viewport: IViewport, duration: number): void;
        canResizeTo(viewport: IViewport): boolean;
        private updateInternal(target, duration?, forceUpdate?);
    }
}
declare module powerbi.visuals {
    class BingNews implements IVisual {
        private newsList;
        private loadingPlaceholder;
        private loadingPlaceholderText;
        private currentViewport;
        private data;
        private timerId;
        private getLocalizedString;
        private isSmallTile;
        private static flipTimeInMs;
        private static smallTileHeight;
        private static mediumTileHeight;
        private static baseTemplate;
        private static listItemTemplate;
        static capabilities: VisualCapabilities;
        init(options: VisualInitOptions): void;
        onDataChanged(options: VisualDataChangedOptions): void;
        onResizing(viewport: IViewport, duration: number): void;
        private updateInternal();
        private updateInternalForSmallTile();
        private updateInternalForOtherTileSize();
        private createNewsItem(index);
        private getNumberOfNews();
        private flipToItemAtIndex(index);
    }
}
declare module powerbi.visuals {
    enum CartesianChartType {
        Line = 0,
        Area = 1,
        ClusteredColumn = 2,
        StackedColumn = 3,
        ClusteredBar = 4,
        StackedBar = 5,
        HundredPercentStackedBar = 6,
        HundredPercentStackedColumn = 7,
        Scatter = 8,
        ComboChart = 9,
        DataDot = 10,
        Waterfall = 11,
        LineClusteredColumnCombo = 12,
        LineStackedColumnCombo = 13,
        DataDotClusteredColumnCombo = 14,
        DataDotStackedColumnCombo = 15,
    }
    interface CalculateScaleAndDomainOptions {
        viewport: IViewport;
        margin: IMargin;
        forcedTickCount?: number;
        forcedYDomain?: any[];
        forcedXDomain?: any[];
    }
    interface MergedValueAxisResult {
        domain: number[];
        merged: boolean;
        tickCount: number;
        forceStartToZero: boolean;
    }
    interface CartesianSmallViewPortProperties {
        hideLegendOnSmallViewPort: boolean;
        hideAxesOnSmallViewPort: boolean;
        MinHeightLegendVisible: number;
        MinHeightAxesVisible: number;
    }
    interface CartesianConstructorOptions {
        chartType: CartesianChartType;
        isScrollable?: boolean;
        animator?: any;
        cartesianSmallViewPortProperties?: CartesianSmallViewPortProperties;
    }
    interface ICartesianVisual {
        init(options: CartesianVisualInitOptions): void;
        setData(dataViews: DataView[]): void;
        calculateAxesProperties(options: CalculateScaleAndDomainOptions): IAxisProperties[];
        overrideXScale(xProperties: IAxisProperties): void;
        render(duration: number): void;
        calculateLegend(): LegendData;
        hasLegend(): boolean;
        onClearSelection(): void;
        enumerateObjectInstances?(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[];
        getVisualCategoryAxisIsScalar?(): boolean;
        getSupportedCategoryAxisType?(): string;
        getPreferredPlotArea?(isScalar: boolean, categoryCount: number, categoryThickness: number): IViewport;
        setFilteredData?(startIndex: number, endIndex: number): CartesianData;
    }
    interface CartesianDataPoint {
        categoryValue: any;
        value: number;
        categoryIndex: number;
        seriesIndex: number;
        highlight?: boolean;
    }
    interface CartesianSeries {
        data: CartesianDataPoint[];
    }
    interface CartesianData {
        series: CartesianSeries[];
        categoryMetadata: DataViewMetadataColumn;
        categories: any[];
        hasHighlights?: boolean;
    }
    interface CartesianVisualInitOptions extends VisualInitOptions {
        svg: D3.Selection;
        cartesianHost: ICartesianVisualHost;
    }
    interface ICartesianVisualHost {
        updateLegend(data: LegendData): void;
    }
    interface ChartAxesLabels {
        x: string;
        y: string;
    }
    enum AxisLinesVisibility {
        ShowLinesOnXAxis = 1,
        ShowLinesOnYAxis = 2,
        ShowLinesOnBothAxis,
    }
    interface CategoryLayout {
        categoryCount: number;
        categoryThickness: number;
        outerPaddingRatio: number;
        isScalar?: boolean;
    }
    interface CategoryLayoutOptions {
        availableWidth: number;
        categoryCount: number;
        domain: any;
        isScalar?: boolean;
        isScrollable?: boolean;
    }
    /** Renders a data series as a cartestian visual. */
    class CartesianChart implements IVisual {
        static MinOrdinalRectThickness: number;
        static MinScalarRectThickness: number;
        static OuterPaddingRatio: number;
        static InnerPaddingRatio: number;
        private static ClassName;
        private static AxisGraphicsContextClassName;
        private static MaxMarginFactor;
        private static MinBottomMargin;
        private static TopMargin;
        private static LeftPadding;
        private static RightPadding;
        private static BottomPadding;
        private static YAxisLabelPadding;
        private static XAxisLabelPadding;
        private static TickPaddingY;
        private static TickPaddingRotatedX;
        private static FontSize;
        private static FontSizeString;
        private axisGraphicsContext;
        private xAxisGraphicsContext;
        private y1AxisGraphicsContext;
        private y2AxisGraphicsContext;
        private element;
        private svg;
        private clearCatcher;
        private margin;
        private type;
        private hostServices;
        private layers;
        private legend;
        private legendMargins;
        private layerLegendData;
        private hasSetData;
        private visualInitOptions;
        private legendObjectProperties;
        private categoryAxisProperties;
        private valueAxisProperties;
        private cartesianSmallViewPortProperties;
        private interactivityService;
        private y2AxesRendered;
        private categoryAxisHasUnitType;
        private valueAxisHasUnitType;
        private yAxisOrientation;
        private bottomMarginLimit;
        private leftMarginLimit;
        private needRotate;
        animator: any;
        private isScrollable;
        private scrollY;
        private scrollX;
        private isXScrollBarVisible;
        private isYScrollBarVisible;
        private svgScrollable;
        private axisGraphicsContextScrollable;
        private brushGraphicsContext;
        private brushContext;
        private brush;
        private static ScrollBarWidth;
        private static fillOpacity;
        private duration;
        private brushMinExtent;
        private dataViews;
        private currentViewport;
        private static getAxisVisibility(type);
        constructor(options: CartesianConstructorOptions);
        init(options: VisualInitOptions): void;
        private renderAxesLabels(axisLabels, legendMargin, viewport, hideXAxisTitle, hideYAxisTitle);
        private adjustMargins(viewport);
        private updateAxis(duration, viewport);
        static getIsScalar(objects: DataViewObjects, propertyId: DataViewObjectPropertyIdentifier, type: ValueType): boolean;
        private populateObjectProperties(dataViews);
        update(options: VisualUpdateOptions): void;
        onDataChanged(options: VisualDataChangedOptions): void;
        onResizing(viewport: IViewport, duration: number): void;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[];
        private getCategoryAxisValues();
        private getValueAxisValues();
        private findObjectWithProperty(objectInstances, propertyName);
        onClearSelection(): void;
        private createAndInitLayers(dataViews);
        private renderLegend();
        private hideLegends();
        private addUnitTypeToAxisLabel(axes);
        private shouldRenderSecondaryAxis(axisProperties);
        private shouldRenderAxis(axisProperties);
        private render(duration?);
        private hideAxisLabels(legendMargins);
        private renderChartWithScrollBar(mainAxisScale, brushX, brushY, svgLength, viewport, axes, width, margins, chartHasAxisLabels, axisLabels);
        private getMinExtent(svgLength, viewportLength);
        private onBrushEnd(minExtent);
        private onBrushed(miniAxisScale, mainAxisScale, axes, width, margins, chartHasAxisLabels, axisLabels, viewport, viewportLength);
        private setMinBrush(viewportLength, minExtent, viewportToSvgRatio);
        private setBrushExtent(brush, viewportWidth, minExtent);
        private getMaxMarginFactor();
        private renderChart(mainAxisScale, axes, width, margins, chartHasAxisLabels, axisLabels, viewport, miniAxisScale?, extent?, duration?);
        /** Returns the actual viewportWidth if visual is not scrollable.
        If visual is scrollable, returns the plot area needed to draw all the datapoints */
        static getPreferredPlotArea(categoryCount: number, categoryThickness: number, viewport: IViewport, isScrollable: boolean, isScalar: boolean): IViewport;
        /** Returns preferred Category span if the visual is scrollable */
        static getPreferredCategorySpan(categoryCount: number, categoryThickness: number): number;
        static getLayout(data: ColumnChartData, options: CategoryLayoutOptions): CategoryLayout;
        /** Returns the thickness for each category.
          * -For clustered charts, you still need to divide by the number of series to get column width after calling this method.
          * -For linear or time scales, category thickness accomodates for the minimum interval between consequtive points.
          * -For all types, return value has accounted for outer padding, but not inner padding
        */
        static getCategoryThickness(seriesList: CartesianSeries[], numCategories: number, plotLength: number, domain: number[], isScalar: boolean): number;
        private static getMinInterval(seriesList);
    }
}
declare module powerbi.visuals {
    function getColumnChartCapabilities(transposeAxes?: boolean): VisualCapabilities;
    var columnChartProps: {
        dataPoint: {
            defaultColor: DataViewObjectPropertyIdentifier;
            fill: DataViewObjectPropertyIdentifier;
            showAllDataPoints: DataViewObjectPropertyIdentifier;
        };
        general: {
            formatString: DataViewObjectPropertyIdentifier;
        };
        categoryAxis: {
            axisType: DataViewObjectPropertyIdentifier;
        };
    };
}
declare module powerbi.visuals {
    interface ColumnChartConstructorOptions {
        chartType: ColumnChartType;
        animator: IColumnChartAnimator;
        isScrollable: boolean;
        interactivityService: IInteractivityService;
    }
    interface ColumnChartData extends CartesianData {
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
        defaultDataPointColor?: string;
        showAllDataPoints?: boolean;
        hasSelection: boolean;
    }
    interface ColumnChartSeries extends CartesianSeries {
        displayName: string;
        key: string;
        index: number;
        data: ColumnChartDataPoint[];
        identity: SelectionId;
    }
    interface ColumnChartDataPoint extends CartesianDataPoint, SelectableDataPoint, TooltipEnabledDataPoint, LabelEnabledDataPoint {
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
    enum ColumnChartType {
        clusteredBar,
        clusteredColumn,
        hundredPercentStackedBar,
        hundredPercentStackedColumn,
        stackedBar,
        stackedColumn,
    }
    interface ColumnAxisOptions {
        xScale: D3.Scale.Scale;
        yScale: D3.Scale.Scale;
        seriesOffsetScale?: D3.Scale.Scale;
        columnWidth: number;
        /** Used by clustered only since categoryWidth !== columnWidth */
        categoryWidth?: number;
        isScalar: boolean;
        margin: IMargin;
    }
    interface IColumnLayout {
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
        };
    }
    interface ColumnChartContext {
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
    interface IColumnChartStrategy {
        setData(data: ColumnChartData): void;
        setupVisualProps(columnChartProps: ColumnChartContext): void;
        setXScale(is100Pct: boolean, forcedTickCount?: number, forcedXDomain?: any[]): IAxisProperties;
        setYScale(is100Pct: boolean, forcedTickCount?: number, forcedYDomain?: any[]): IAxisProperties;
        drawColumns(useAnimation: boolean): D3.Selection;
        selectColumn(selectedColumnIndex: number, lastSelectedColumnIndex: number): void;
        getClosestColumnIndex(x: number, y: number): number;
    }
    interface IColumnChartConverterStrategy {
        getLegend(colors: IDataColorPalette, defaultColor?: string): LegendSeriesInfo;
        getValueBySeriesAndCategory(series: number, category: number): number;
        getMeasureNameByIndex(series: number, category: number): string;
        hasHighlightValues(series: number): boolean;
        getHighlightBySeriesAndCategory(series: number, category: number): number;
    }
    interface LegendSeriesInfo {
        legend: LegendData;
        seriesSources: DataViewMetadataColumn[];
        seriesObjects: DataViewObjects[][];
    }
    interface ClassAndSelector {
        class: string;
        selector: string;
    }
    /** Renders a stacked and clustered column chart */
    class ColumnChart implements ICartesianVisual, IInteractiveVisual {
        private static ColumnChartClassName;
        static SeriesClasses: ClassAndSelector;
        private svg;
        private clearCatcher;
        private mainGraphicsContext;
        private xAxisProperties;
        private yAxisProperties;
        private currentViewport;
        private data;
        private style;
        private colors;
        private chartType;
        private columnChart;
        private hostService;
        private cartesianVisualHost;
        private interactivity;
        private margin;
        private options;
        private lastInteractiveSelectedColumnIndex;
        private supportsOverflow;
        private interactivityService;
        private dataViewCat;
        private categoryAxisType;
        private animator;
        private isScrollable;
        private element;
        constructor(options: ColumnChartConstructorOptions);
        static customizeQuery(options: CustomizeQueryOptions): void;
        static getSortableRoles(options: VisualSortableOptions): string[];
        updateVisualMetadata(x: IAxisProperties, y: IAxisProperties, margin: any): void;
        init(options: CartesianVisualInitOptions): void;
        private getCategoryLayout(numCategoryValues, options);
        static converter(dataView: DataViewCategorical, colors: IDataColorPalette, is100PercentStacked?: boolean, isScalar?: boolean, supportsOverflow?: boolean, dataViewMetadata?: DataViewMetadata, chartType?: ColumnChartType): ColumnChartData;
        private static createDataPoints(dataViewCat, categories, categoryIdentities, legend, seriesObjectsList, converterStrategy, labelSettings, is100PercentStacked?, isScalar?, supportsOverflow?, isCategoryAlsoSeries?, categoryObjectsList?, defaultDataPointColor?);
        private static getDataPointColor(legendItem, categoryIndex, dataPointObjects?);
        static sliceSeries(series: ColumnChartSeries[], endIndex: number, startIndex?: number): ColumnChartSeries[];
        static getForcedTickValues(min: number, max: number, forcedTickCount: number): number[];
        static getTickInterval(tickValues: number[]): number;
        setData(dataViews: DataView[]): void;
        calculateLegend(): LegendData;
        hasLegend(): boolean;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[];
        private enumerateDataPoints();
        calculateAxesProperties(options: CalculateScaleAndDomainOptions): IAxisProperties[];
        getPreferredPlotArea(isScalar: boolean, categoryCount: number, categoryThickness: number): IViewport;
        private ApplyInteractivity(chartContext);
        private selectColumn(indexOfColumnSelected, force?);
        private createInteractiveLegendDataPoints(columnIndex);
        overrideXScale(xProperties: IAxisProperties): void;
        render(duration: number): void;
        onClearSelection(): void;
        accept(visitor: InteractivityVisitor, options: any): void;
        getVisualCategoryAxisIsScalar(): boolean;
        getSupportedCategoryAxisType(): string;
        setFilteredData(startIndex: number, endIndex: number): CartesianData;
    }
}
declare module powerbi.visuals {
    class ClusteredColumnChartStrategy implements IColumnChartStrategy {
        private static classes;
        private data;
        private graphicsContext;
        private seriesOffsetScale;
        private width;
        private height;
        private margin;
        private xProps;
        private yProps;
        private categoryLayout;
        private viewportHeight;
        private columnsCenters;
        private columnSelectionLineHandle;
        private animator;
        private interactivityService;
        setupVisualProps(columnChartProps: ColumnChartContext): void;
        setData(data: ColumnChartData): void;
        setXScale(is100Pct: boolean, forcedTickCount?: number, forcedXDomain?: any[]): IAxisProperties;
        setYScale(is100Pct: boolean, forcedTickCount?: number, forcedYDomain?: any[]): IAxisProperties;
        drawColumns(useAnimation: boolean): D3.Selection;
        selectColumn(selectedColumnIndex: number, lastSelectedColumnIndex: number): void;
        getClosestColumnIndex(x: number, y: number): number;
        /** Get the chart's columns centers (x value) */
        private getColumnsCenters();
        private moveHandle(selectedColumnIndex);
        static getLayout(data: ColumnChartData, axisOptions: ColumnAxisOptions): IColumnLayout;
        private getLabelLayoutXY(axisOptions);
    }
    class ClusteredBarChartStrategy implements IColumnChartStrategy {
        private static classes;
        private data;
        private graphicsContext;
        private seriesOffsetScale;
        private width;
        private height;
        private margin;
        private xProps;
        private yProps;
        private categoryLayout;
        private viewportHeight;
        private barsCenters;
        private columnSelectionLineHandle;
        private animator;
        private interactivityService;
        setupVisualProps(barChartProps: ColumnChartContext): void;
        setData(data: ColumnChartData): void;
        setYScale(is100Pct: boolean, forcedTickCount?: number, forcedYDomain?: any[]): IAxisProperties;
        setXScale(is100Pct: boolean, forcedTickCount?: number, forcedXDomain?: any[]): IAxisProperties;
        drawColumns(useAnimation: boolean): D3.Selection;
        selectColumn(selectedColumnIndex: number, lastSelectedColumnIndex: number): void;
        getClosestColumnIndex(x: number, y: number): number;
        /** Get the chart's columns centers (y value) */
        private getBarsCenters();
        private moveHandle(selectedColumnIndex);
        static getLayout(data: ColumnChartData, axisOptions: ColumnAxisOptions): IColumnLayout;
        private getLabelLayoutXY(axisOptions);
    }
}
declare module powerbi.visuals {
    class StackedColumnChartStrategy implements IColumnChartStrategy {
        private static classes;
        private data;
        private graphicsContext;
        private width;
        height: number;
        private margin;
        private xProps;
        private yProps;
        private categoryLayout;
        private columnsCenters;
        private columnSelectionLineHandle;
        private animator;
        private interactivityService;
        private viewportHeight;
        setupVisualProps(columnChartProps: ColumnChartContext): void;
        setData(data: ColumnChartData): void;
        setXScale(is100Pct: boolean, forcedTickCount?: number, forcedXDomain?: any[]): IAxisProperties;
        setYScale(is100Pct: boolean, forcedTickCount?: number, forcedYDomain?: any[]): IAxisProperties;
        drawColumns(useAnimation: boolean): D3.Selection;
        selectColumn(selectedColumnIndex: number, lastSelectedColumnIndex: number): void;
        getClosestColumnIndex(x: number, y: number): number;
        /** Get the chart's columns centers (x value) */
        private getColumnsCenters();
        private moveHandle(selectedColumnIndex);
        static getLayout(data: ColumnChartData, axisOptions: ColumnAxisOptions): IColumnLayout;
        private getLabelLayoutXY(axisOptions);
        private getLabelLayoutY(d, is100Pct, scaledY0, yScale);
    }
    class StackedBarChartStrategy implements IColumnChartStrategy {
        private static classes;
        private data;
        private graphicsContext;
        private width;
        height: number;
        private margin;
        private xProps;
        private yProps;
        private categoryLayout;
        private barsCenters;
        private columnSelectionLineHandle;
        private animator;
        private interactivityService;
        private viewportHeight;
        setupVisualProps(barChartProps: ColumnChartContext): void;
        setData(data: ColumnChartData): void;
        setYScale(is100Pct: boolean, forcedTickCount?: number, forcedYDomain?: any[]): IAxisProperties;
        setXScale(is100Pct: boolean, forcedTickCount?: number, forcedXDomain?: any[]): IAxisProperties;
        drawColumns(useAnimation: boolean): D3.Selection;
        selectColumn(selectedColumnIndex: number, lastInteractiveSelectedColumnIndex: number): void;
        getClosestColumnIndex(x: number, y: number): number;
        /** Get the chart's columns centers (y value) */
        private getBarsCenters();
        private moveHandle(selectedColumnIndex);
        static getLayout(data: ColumnChartData, axisOptions: ColumnAxisOptions): IColumnLayout;
        private getLabelLayoutXY(axisOptions);
    }
}
declare module powerbi.visuals {
    interface ComboChartDataViewObjects extends DataViewObjects {
        general: ComboChartDataViewObject;
    }
    interface ComboChartDataViewObject extends DataViewObject {
        visualType1: string;
        visualType2: string;
    }
    /** This module only supplies the capabilities for comboCharts.
     * Implementation is in cartesianChart and the various ICartesianVisual implementations.
     */
    module ComboChart {
        var capabilities: VisualCapabilities;
    }
    var comboChartProps: {
        general: {
            formatString: DataViewObjectPropertyIdentifier;
        };
    };
}
declare module powerbi.visuals {
    class DataColorPalette implements IDataColorPalette {
        private palettes;
        private colors;
        private defaultColors;
        /**
        * Colors used for sentiment visuals, e.g. KPI, Gauge. Since this is only a temporary implementation which will
        * eventually be superseded by conditional formatting, we don't declare them as part of the theme and instead
        * use a hardcoded color scheme here until conditional formatting is ready.
        */
        private sentimentColors;
        private basePickerColors;
        /**
         * Creates a DataColorPalette using the given theme, or the default theme.
         */
        constructor(colors?: IColorInfo[]);
        getColor(key: any): IColorInfo;
        getColorByScale(scaleKey: string, key: string): IColorInfo;
        getSentimentColors(): IColorInfo[];
        getBasePickerColors(): IColorInfo[];
    }
}
declare module powerbi.visuals {
    interface IDataDotChartConfiguration {
        xAxisProperties: IAxisProperties;
        yAxisProperties: IAxisProperties;
        margin: any;
    }
    interface DataDotChartData {
        series: DataDotChartSeries;
        hasHighlights: boolean;
        hasDynamicSeries: boolean;
    }
    interface DataDotChartSeries extends CartesianSeries {
        xCol: DataViewMetadataColumn;
        yCol: DataViewMetadataColumn;
        data: DataDotChartDataPoint[];
    }
    interface DataDotChartDataPoint extends CartesianDataPoint, SelectableDataPoint {
        highlight: boolean;
    }
    class DataDotChart implements ICartesianVisual, IInteractiveVisual {
        static formatStringProp: DataViewObjectPropertyIdentifier;
        private static ClassName;
        private static DotClassName;
        private static DotClassSelector;
        private static DotColorKey;
        private static DotLabelClassName;
        private static DotLabelClassSelector;
        private static DotLabelVerticalOffset;
        private static DotLabelTextAnchor;
        private options;
        private svg;
        private element;
        private mainGraphicsG;
        private mainGraphicsContext;
        private clearCatcher;
        private currentViewport;
        private hostService;
        private cartesianVisualHost;
        private style;
        private colors;
        private xAxisProperties;
        private yAxisProperties;
        private margin;
        private data;
        private dataViewCategorical;
        private clippedData;
        private interactivityService;
        private interactivity;
        static capabilities: VisualCapabilities;
        init(options: CartesianVisualInitOptions): void;
        setData(dataViews: DataView[]): void;
        calculateAxesProperties(options: CalculateScaleAndDomainOptions): IAxisProperties[];
        private static createClippedDataIfOverflowed(data, categoryCount);
        private static hasDataPoint(series);
        private lookupXValue(index, type);
        overrideXScale(xProperties: IAxisProperties): void;
        render(duration: number): void;
        calculateLegend(): LegendData;
        hasLegend(): boolean;
        private createLegendDataPoints(columnIndex);
        onClearSelection(): void;
        static converter(dataView: DataView, blankCategoryValue: string): DataDotChartData;
        accept(visitor: InteractivityVisitor, options: any): void;
    }
}
declare module powerbi.visuals {
    var donutChartCapabilities: VisualCapabilities;
    var donutChartProps: {
        general: {
            formatString: DataViewObjectPropertyIdentifier;
        };
        dataPoint: {
            fill: DataViewObjectPropertyIdentifier;
        };
        legend: {
            show: DataViewObjectPropertyIdentifier;
            position: DataViewObjectPropertyIdentifier;
            showTitle: DataViewObjectPropertyIdentifier;
            titleText: DataViewObjectPropertyIdentifier;
        };
    };
}
declare module powerbi.visuals {
    interface DonutConstructorOptions {
        slicingEnabled?: boolean;
        sliceWidthRatio?: number;
        animator?: IDonutChartAnimator;
        isScrollable?: boolean;
    }
    /** Used because data points used in D3 pie layouts are placed within a container with pie information */
    interface DonutArcDescriptor extends D3.Layout.ArcDescriptor {
        data: DonutDataPoint;
    }
    interface DonutDataPoint extends SelectableDataPoint, TooltipEnabledDataPoint {
        measure: number;
        measureFormat?: string;
        percentage: number;
        highlightRatio: number;
        label: string;
        index: number;
        /** Data points that may be drilled into */
        internalDataPoints?: DonutDataPoint[];
        isLabelOverlapping?: boolean;
        color: string;
        labelColor: string;
    }
    interface DonutData {
        dataPointsToDeprecate: DonutDataPoint[];
        dataPoints: DonutArcDescriptor[];
        legendData: LegendData;
        hasHighlights: boolean;
        suppressLabels?: boolean;
        dataLabelsSettings: VisualDataLabelsSettings;
        legendObjectProperties?: DataViewObject;
    }
    interface DonutLayout {
        fontSize: string;
        shapeLayout: {
            d: (d: DonutArcDescriptor) => string;
        };
        highlightShapeLayout: {
            d: (d: DonutArcDescriptor) => string;
        };
        zeroShapeLayout: {
            d: (d: DonutArcDescriptor) => string;
        };
        categoryLabelTextOverlap: (d: DonutArcDescriptor) => void;
    }
    /** Renders a donut chart */
    class DonutChart implements IVisual, IInteractiveVisual {
        private static ClassName;
        private static InteractiveLegendClassName;
        private static InteractiveLegendArrowClassName;
        private static UpdateAnimationDuration;
        private static OuterArcRadiusRatio;
        private static InnerArcRadiusRatio;
        private static FontsizeThreshold;
        private static SmallFontSize;
        private static NormalFontSize;
        private static InteractiveLegendContainerHeight;
        private static OpaqueOpacity;
        private static SemiTransparentOpacity;
        private static defaultSliceWidthRatio;
        private static sliceClass;
        private static sliceHighlightClass;
        static EffectiveZeroValue: number;
        static PolylineOpacity: number;
        private sliceWidthRatio;
        private svg;
        private mainGraphicsContext;
        private clearCatcher;
        private legendContainer;
        private interactiveLegendArrow;
        private parentViewport;
        private currentViewport;
        private formatter;
        private data;
        private pie;
        private arc;
        private outerArc;
        private radius;
        private previousRadius;
        private key;
        private colors;
        private style;
        private drilled;
        private allowDrilldown;
        private options;
        private isInteractive;
        private interactivityState;
        private chartRotationAnimationDuration;
        private slicingEnabled;
        private interactivityService;
        private legend;
        private hasSetData;
        private isScrollable;
        private hostService;
        /** Public for testing */
        animator: IDonutChartAnimator;
        constructor(options?: DonutConstructorOptions);
        static converter(dataView: DataView, slicingEnabled: boolean, colors: IDataColorPalette, suppressLabels?: boolean): DonutData;
        init(options: VisualInitOptions): void;
        onDataChanged(options: VisualDataChangedOptions): void;
        onResizing(viewport: IViewport, duration: number): void;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[];
        private enumerateDataPoints();
        private enumerateLegend();
        setInteractiveChosenSlice(sliceIndex: number): void;
        private calculateRadius();
        private initViewportDependantProperties(duration?);
        private mergeDatasets(first, second);
        private updateInternal(data, duration?);
        private renderLegend();
        private addInteractiveLegendArrow();
        private calculateSliceAngles();
        private assignInteractions(slices, highlightSlices, data);
        setDrilldown(selection?: DonutDataPoint): void;
        private assignInteractiveChartInteractions(slice);
        private getAngleFromDragEvent();
        private interactiveDragStart();
        private interactiveDragMove();
        private interactiveDragEnd();
        private addSliceLabels(data, was, is, duration?);
        private static midAngle(d);
        accept(visitor: InteractivityVisitor, options: any): void;
        private updateInternalToMove(data, duration?);
        static drawDefaultShapes(graphicsContext: D3.Selection, donutData: DonutData, layout: DonutLayout, colors: IDataColorPalette, radius: number, defaultColor?: string): D3.UpdateSelection;
        static drawDefaultHighlightShapes(graphicsContext: D3.Selection, donutData: DonutData, layout: DonutLayout, colors: IDataColorPalette, radius: number): D3.UpdateSelection;
        static drawDefaultCategoryLabels(graphicsContext: D3.Selection, donutData: DonutData, layout: DonutLayout, sliceWidthRatio: number, radius: number, viewport: IViewport): void;
        private static drawDefaultCategoryLabelText(graphicsContext, donutDataPoints, layout, radius, viewport, outerArc);
        onClearSelection(): void;
        private static drawDefaultCategoryLabelLines(graphicsContext, donutDataPoints, radius, sliceWidthRatio, arc, outerArc);
        static getLayout(radius: number, sliceWidthRatio: number, viewport: IViewport): DonutLayout;
        private static getHighlightRadius(radius, sliceWidthRatio, highlightRatio);
    }
}
declare module powerbi.visuals {
    var filledMapCapabilities: VisualCapabilities;
}
declare module powerbi.visuals {
    var funnelChartCapabilities: VisualCapabilities;
    var funnelChartProps: {
        general: {
            formatString: DataViewObjectPropertyIdentifier;
        };
        dataPoint: {
            defaultColor: DataViewObjectPropertyIdentifier;
            fill: DataViewObjectPropertyIdentifier;
        };
    };
}
declare module powerbi.visuals {
    interface FunnelChartConstructorOptions {
        animator: IFunnelAnimator;
    }
    interface FunnelSlice extends SelectableDataPoint, TooltipEnabledDataPoint, LabelEnabledDataPoint {
        value: number;
        label: string;
        key: string;
        categoryOrMeasureIndex: number;
        highlight?: boolean;
        highlightValue?: number;
        color: string;
    }
    interface FunnelData {
        slices: FunnelSlice[];
        valuesMetadata: DataViewMetadataColumn[];
        hasHighlights: boolean;
        highlightsOverflow: boolean;
        dataLabelsSettings: VisualDataLabelsSettings;
    }
    interface FunnelAxisOptions {
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
    interface IFunnelLayout {
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
    class FunnelChart implements IVisual, IInteractiveVisual {
        static DefaultBarOpacity: number;
        static DimmedBarOpacity: number;
        static InnerTextClassName: string;
        private static VisualClassName;
        private static BarToSpaceRatio;
        private static MaxBarWidth;
        private static MinBarThickness;
        private static LabelFunnelPadding;
        private static InnerTextMinimumPadding;
        private static InnerTextHeightDelta;
        private static InnerTextGroupClassName;
        private static StandardTextProperties;
        private static OverflowingHighlightWidthRatio;
        private static TickPadding;
        private static InnerTickSize;
        private svg;
        private funnelGraphicsContext;
        private clearCatcher;
        private axisGraphicsContext;
        private labelGraphicsContext;
        private currentViewport;
        private colors;
        private data;
        private hostServices;
        private margin;
        private options;
        private interactivityService;
        private defaultDataPointColor;
        private dataViews;
        animator: IFunnelAnimator;
        constructor(options?: FunnelChartConstructorOptions);
        static converter(dataView: DataView, colors: IDataColorPalette, defaultDataPointColor?: string): FunnelData;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[];
        private enumerateDataPoints();
        init(options: VisualInitOptions): void;
        private updateViewportProperties();
        update(options: VisualUpdateOptions): void;
        onDataChanged(options: VisualDataChangedOptions): void;
        onResizing(viewport: IViewport, duration: number): void;
        private getMaxLeftMargin(labels, properties);
        private updateInternal(useAnimation);
        private setUpAxis();
        accept(visitor: InteractivityVisitor, options: any): void;
        onClearSelection(): void;
        static getLayout(data: FunnelData, axisOptions: FunnelAxisOptions): IFunnelLayout;
        static drawDefaultAxis(graphicsContext: D3.Selection, axisOptions: FunnelAxisOptions): void;
        static drawDefaultShapes(data: FunnelData, slices: FunnelSlice[], graphicsContext: D3.Selection, layout: IFunnelLayout, colors: IDataColorPalette): D3.UpdateSelection;
    }
}
declare module powerbi.visuals {
    interface GaugeData extends TooltipEnabledDataPoint {
        percent: number;
        adjustedTotal: number;
        total: number;
        metadataColumn: DataViewMetadataColumn;
        targetSettings: GaugeTargetSettings;
    }
    interface GaugeTargetSettings {
        min: number;
        max: number;
        target: number;
    }
    interface GaugeTargetData extends GaugeTargetSettings {
        total: number;
        tooltipItems: TooltipSeriesDataItem[];
    }
    interface GaugeSmallViewPortProperties {
        hideGaugeSideNumbersOnSmallViewPort: boolean;
        smallGaugeMarginsOnSmallViewPort: boolean;
        MinHeightGaugeSideNumbersVisible: number;
        GaugeMarginsOnSmallViewPort: number;
    }
    interface GaugeVisualProperties {
        radius: number;
        innerRadiusOfArc: number;
        innerRadiusFactor: number;
        left: number;
        top: number;
        height: number;
        width: number;
        margin: IMargin;
        transformString: string;
    }
    interface AnimatedNumberProperties {
        transformString: string;
        viewport: IViewport;
    }
    interface GaugeConstructorOptions {
        gaugeSmallViewPortProperties?: GaugeSmallViewPortProperties;
    }
    /** Renders a number that can be animate change in value */
    class Gauge implements IVisual {
        private static MIN_VALUE;
        private static MAX_VALUE;
        private static MinDistanceFromBottom;
        private static MinWidthForTargetLabel;
        private static DefaultTopBottomMargin;
        private static DefaultLeftRightMargin;
        private static ReducedLeftRightMargin;
        private static DEFAULT_MAX;
        private static DEFAULT_MIN;
        private static VisualClassName;
        private static DefaultStyleProperties;
        private static DefaultTargetSettings;
        private static InnerRadiusFactor;
        private static KpiBandDistanceFromMainArc;
        private static MainGaugeGroupElementName;
        private static LabelText;
        private static TargetConnector;
        private static TargetText;
        static formatStringProp: DataViewObjectPropertyIdentifier;
        private svg;
        private mainGraphicsContext;
        private currentViewport;
        private element;
        private style;
        private data;
        private color;
        private backgroundArc;
        private foregroundArc;
        private kpiArcs;
        private kpiArcPaths;
        private foregroundArcPath;
        private backgroundArcPath;
        private targetLine;
        private targetConnector;
        private targetText;
        private options;
        private lastAngle;
        private margin;
        private animatedNumberGrapicsContext;
        private animatedNumber;
        private settings;
        private targetSettings;
        private gaugeVisualProperties;
        private gaugeSmallViewPortProperties;
        private showTargetLabel;
        private hostService;
        private dataViews;
        constructor(options?: GaugeConstructorOptions);
        static capabilities: VisualCapabilities;
        init(options: VisualInitOptions): void;
        update(options: VisualUpdateOptions): void;
        onDataChanged(options: VisualDataChangedOptions): void;
        onResizing(viewport: IViewport, duration: number): void;
        onStyleChanged(newStyle: IVisualStyle): void;
        private static getValidSettings(targetData);
        private static getGaugeData(dataView);
        static converter(dataView: DataView): GaugeData;
        static getMetaDataColumn(dataView: DataView): DataViewMetadataColumn;
        private initKpiBands();
        private updateKpiBands(radius, innerRadiusFactor, tString, kpiAngleAttr);
        private removeTargetElements();
        private updateTargetLine(radius, innerRadius, left, top);
        getAnimatedNumberProperties(radius: number, innerRadiusFactor: number, top: number, left: number): AnimatedNumberProperties;
        getGaugeVisualProperties(): GaugeVisualProperties;
        drawViewPort(drawOptions: GaugeVisualProperties): void;
        private createTicks(total);
        private updateInternal(duration?);
        private updateVisualStyles();
        private updateVisualConfigurations();
        private appendTextAlongArc(ticks, radius, height, width, margin);
        private truncateTextIfNeeded(text, positionX, onRight);
        private appendTargetTextAlongArc(radius, height, width, margin);
        private arcTween(transition, arr);
        private showMinMaxLabelsOnBottom();
        private setMargins();
        private showSideNumbersLabelText();
    }
}
declare module powerbi.visuals {
    interface ImageDataViewObjects extends DataViewObjects {
        general: ImageDataViewObject;
    }
    interface ImageDataViewObject extends DataViewObject {
        imageUrl: string;
    }
    class ImageVisual implements IVisual {
        static capabilities: VisualCapabilities;
        private element;
        init(options: VisualInitOptions): void;
        onDataChanged(options: VisualDataChangedOptions): void;
        onResizing(viewport: IViewport, duration: number): void;
    }
}
declare module powerbi {
    import DataViewObjectDescriptors = powerbi.data.DataViewObjectDescriptors;
    import DataViewObjectDescriptor = powerbi.data.DataViewObjectDescriptor;
    import DisplayNameGetter = powerbi.data.DisplayNameGetter;
    import Selector = powerbi.data.Selector;
    import IStringResourceProvider = jsCommon.IStringResourceProvider;
    /**
     * Represents a visualization displayed within an application (PowerBI dashboards, ad-hoc reporting, etc.).
     * This interface does not make assumptions about the underlying JS/HTML constructs the visual uses to render itself.
     */
    interface IVisual {
        /**
         * Initializes an instance of the IVisual.
         *
         * @param options: Initialization options for the visual.
         */
        init(options: VisualInitOptions): void;
        /** Notifies the visual that it is being destroyed, and to do any cleanup necessary (such as unsubscribing event handlers). */
        destroy?(): any;
        /**
         * Notifies the IVisual of an update (data, viewmode, size change).
         */
        update?(options: VisualUpdateOptions): void;
        /**
         * Notifies the IVisual to resize.
         *
         * @param finalViewport: This is the viewport that the visual will eventually be resized to.
         * @param duration: This is the duration, in milliseconds, of the animation that is starting right after the execution of this function.
         */
        onResizing(finalViewport: IViewport, duration: number): void;
        /**
         * Notifies the IVisual of new data being provided.
         * This is an optional method that can be omitted if the visual is in charge of providing its own data.
         */
        onDataChanged?(options: VisualDataChangedOptions): void;
        /** Notifies the IVisual of changes to the color, font, theme, and style related values that the visual should use. */
        onStyleChanged?(newStyle: IVisualStyle): void;
        /** Notifies the IVisual to change view mode if applicable. */
        onViewModeChanged?(viewMode: ViewMode): void;
        /** Notifies the IVisual to clear any selection. */
        onClearSelection?(): void;
        /** Notifies the IVisual to select the specified object. */
        onSelectObject?(object: VisualObjectInstance): void;
        /** Gets a value indicating whether the IVisual can be resized to the given viewport. */
        canResizeTo?(viewport: IViewport): boolean;
        /**
         * Gets the set of objects that the visual is currently displaying.
         *
         * @param objectName: Name of the object, as defined in the VisualCapabilities.
         */
        enumerateObjectInstances?(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[];
    }
    interface IVisualPlugin {
        /** The name of the plugin.  Must match the property name in powerbi.visuals. */
        name: string;
        /** The css style of this visual. Must match the style name in ExploreUI/styles/sprites.less */
        class?: string;
        /** The key for the watermark style of this visual. Must match the id name in ExploreUI/views/svg/visualsWatermarks.svg */
        watermarkKey?: string;
        /** The key for to the localized tooltip of this visual */
        title?: string;
        /** Declares the capabilities for this IVisualPlugin type. */
        capabilities?: VisualCapabilities;
        /** Function to call to create the visual. */
        create: IVisualFactoryMethod;
        /**
          * Function to allow the visual to influence query generation. Called each time a query is generated
          * so the visual can translate its state into options understood by the query generator.
          */
        customizeQuery?: CustomizeQueryMethod;
        getSortableRoles?: (visualSortableOptions?: VisualSortableOptions) => string[];
    }
    /** Factory method for an IVisual.  This factory method should be registered on the powerbi.visuals object. */
    interface IVisualFactoryMethod {
        (): IVisual;
    }
    /** Parameters available to a CustomizeQueryMethod */
    interface CustomizeQueryOptions {
        /**
         * The data view mapping for this visual with some additional information. CustomizeQueryMethod implementations
         * are expected to edit this in-place.
         */
        dataViewMappings: data.CompiledDataViewMapping[];
    }
    /** Parameters available to a sortable visual candidate */
    interface VisualSortableOptions {
        dataViewMappings: data.CompiledDataViewMapping[];
    }
    /** An imperative way for a visual to influence query generation beyond just its declared capabilities. */
    interface CustomizeQueryMethod {
        (options: CustomizeQueryOptions): void;
    }
    /** Defines the visual filtering capability for a particular filter kind. */
    interface VisualFilterMapping {
        /** Specifies what data roles are used to control the filter semantics for this filter kind. */
        targetRoles: string[];
    }
    /**
     * Defines the visual filtering capabilities for various filter kinds.
       By default all visuals support attribute filters and measure filters in their innermost scope.
    */
    interface VisualFilterMappings {
        measureFilter?: VisualFilterMapping;
    }
    /** Defines the capabilities of an IVisual. */
    interface VisualCapabilities {
        /** Defines what roles the visual expects, and how those roles should be populated.  This is useful for visual generation/editing. */
        dataRoles?: VisualDataRole[];
        /** Defines the set of objects supported by this IVisual. */
        objects?: DataViewObjectDescriptors;
        /** Defines how roles that the visual understands map to the DataView.  This is useful for query generation. */
        dataViewMappings?: DataViewMapping[];
        /** Defines how filters are understood by the visual. This is used by query generation */
        filterMappings?: VisualFilterMappings;
        /** Indicates whether cross-highlight is supported by the visual. This is useful for query generation. */
        supportsHighlight?: boolean;
        /** Indicates whether sorting is supported by the visual. This is useful for query generation */
        sorting?: VisualSortingCapabilities;
        /** Indicates whether a default title should be displayed.  Visuals with self-describing layout can omit this. */
        suppressDefaultTitle?: boolean;
    }
    /** Defines the data roles understood by the IVisual. */
    interface VisualDataRole {
        /** Unique name for the VisualDataRole. */
        name: string;
        /** Indicates the kind of role.  This value is used to build user interfaces, such as a field well. */
        kind: VisualDataRoleKind;
        displayName?: DisplayNameGetter;
        /** Indicates the preferred ValueTypes to be used in this data role.  This is used by authoring tools when adding fields into the visual. */
        preferredTypes?: ValueTypeDescriptor[];
    }
    /** Defines the visual sorting capability. */
    interface VisualSortingCapabilities {
        /** When specified, indicates that the IVisual wants default sorting behavior. */
        default?: {};
        /** When specified, indicates that the IVisual wants to control sort interactivity. */
        custom?: {};
        /** When specified, indicates sorting that is inherently implied by the IVisual.  This is useful to automatically sort. */
        implicit?: VisualImplicitSorting;
    }
    /** Defines implied sorting behaviour for an IVisual. */
    interface VisualImplicitSorting {
        clauses: VisualImplicitSortingClause[];
    }
    interface VisualImplicitSortingClause {
        role: string;
        direction: data.QuerySortDirection;
    }
    enum VisualDataRoleKind {
        /** Indicates that the role should be bound to something that evaluates to a grouping of values. */
        Grouping = 0,
        /** Indicates that the role should be bound to something that evaluates to a single value in a scope. */
        Measure = 1,
        /** Indicates that the role can be bound to either Grouping or Measure. */
        GroupingOrMeasure = 2,
    }
    /** Defines the capabilities of an IVisual. */
    interface VisualInitOptions {
        /** The DOM element the visual owns. */
        element: JQuery;
        /** The set of services provided by the visual hosting layer. */
        host: IVisualHostServices;
        /** Style information. */
        style: IVisualStyle;
        /** The initial viewport size. */
        viewport: IViewport;
        /** The visual settings stored by the host. These values are provided to the visual upon its initialization. */
        settings?: VisualSettings;
        /** Animation options. */
        animation?: AnimationOptions;
        /** Interactivity options. */
        interactivity?: InteractivityOptions;
    }
    interface VisualUpdateOptions {
        viewport: IViewport;
        dataViews: DataView[];
        duration: number;
        viewMode?: ViewMode;
    }
    interface VisualDataChangedOptions {
        dataViews: DataView[];
        /** Optional duration of animation transition. */
        duration?: number;
        /** Indicates what type of update has been performed on the data.
        The default operation kind is Create.*/
        operationKind?: VisualDataChangeOperationKind;
    }
    enum VisualDataChangeOperationKind {
        Create = 0,
        Append = 1,
    }
    interface EnumerateVisualObjectInstancesOptions {
        objectName: string;
    }
    interface VisualSettings {
        DisplayUnitSystemType?: DisplayUnitSystemType;
        version?: number;
    }
    interface CustomSortEventArgs {
        sortDescriptors: SortableFieldDescriptor[];
    }
    interface SortableFieldDescriptor {
        queryName: string;
        sortDirection?: data.QuerySortDirection;
    }
    enum ViewMode {
        View = 0,
        Edit = 1,
    }
    interface IVisualErrorMessage {
        message: string;
        title: string;
        detail: string;
    }
    interface IVisualWarning {
        code: string;
        getMessages(resourceProvider: IStringResourceProvider): IVisualErrorMessage;
    }
    /** Defines behavior for IVisual interaction with the host environment. */
    interface IVisualHostServices {
        /** Returns the localized form of a string. */
        getLocalizedString(stringId: string): string;
        /** Notifies of a DragStart event. */
        onDragStart(args: DragEventArgs): void;
        /** Gets a value indicating whether the given selection is valid. */
        canSelect(args: SelectEventArgs): boolean;
        /** Notifies of a data point being selected. */
        onSelect(args: SelectEventArgs): void;
        /** Notifies of a visual object being selected. */
        onSelectObject?(args: SelectObjectEventArgs): void;
        /** Notifies that properties of the IVisual have changed. */
        persistProperties(changes: VisualObjectInstance[]): void;
        /** Requests more data to be loaded. */
        loadMoreData(): void;
        /** Notification to sort on the specified column */
        onCustomSort(args: CustomSortEventArgs): void;
        /** Indicates which view mode the host is in. */
        getViewMode(): ViewMode;
        /** Notify any warning that happened during update of the visual. */
        setWarnings(clientWarnings: IVisualWarning[]): void;
        /** Sets a toolbar on the host. */
        setToolbar($selector: JQuery): void;
    }
    interface IViewport {
        height: number;
        width: number;
    }
    /** Animation options for visuals. */
    interface AnimationOptions {
        /** Indicates whether all transition frames should be flushed immediately, effectively "disabling" any visual transitions. */
        transitionImmediate: boolean;
    }
    /** Interactivity options for visuals. */
    interface InteractivityOptions {
        /** Indicates that dragging of data points should be permitted. */
        dragDataPoint?: boolean;
        /** Indicates that data points should be selectable. */
        selection?: boolean;
        /** Indicates that the chart and the legend are interactive */
        isInteractiveLegend?: boolean;
        /** Indicates overflow behavior. Values are CSS oveflow strings */
        overflow?: string;
    }
    interface VisualDragPayload extends DragPayload {
        data?: Selector;
        field?: {};
    }
    interface DragEventArgs {
        event: DragEvent;
        data: VisualDragPayload;
    }
    interface SelectEventArgs {
        data: Selector[];
    }
    interface SelectObjectEventArgs {
        object: DataViewObjectDescriptor;
    }
    interface VisualObjectInstance {
        /** The name of the object (as defined in VisualCapabilities). */
        objectName: string;
        /** A display name for the object instance. */
        displayName?: string;
        /** The set of property values for this object.  Some of these properties may be defaults provided by the IVisual. */
        properties?: {
            [propertyName: string]: DataViewPropertyValue;
        };
        /** The selector that identifies this object. */
        selector: Selector;
        /** Defines the constrained set of valid values for a property. */
        validValues?: string[];
    }
}
declare module powerbi {
    interface IVisualStyle {
        colorPalette: IColorPalette;
        isHighContrast: boolean;
        titleText: ITextStyle;
        subTitleText: ITextStyle;
        labelText: ITextStyle;
        maxMarginFactor?: number;
    }
    interface ITextStyle extends IStyleInfo {
        fontFace?: string;
        fontSize?: string;
        fontWeight?: string;
        color: IColorInfo;
    }
    interface IColorPalette {
        background?: IColorInfo;
        foreground?: IColorInfo;
        positive?: IColorInfo;
        negative?: IColorInfo;
        separator?: IColorInfo;
        selection?: IColorInfo;
        dataColors: IDataColorPalette;
    }
    interface IDataColorPalette {
        /** Gets a color based for the specified key value. */
        getColor(key: any): IColorInfo;
        getColorByScale(scaleKey: string, key: string): IColorInfo;
        /** Gets the set of sentiment colors used for visuals such as KPIs
        * Note: This is only a temporary API so that we can have reasonable color schemes for KPIs
        * and gauges until the conditional formatting feature is implemented.
        */
        getSentimentColors(): IColorInfo[];
        getBasePickerColors(): IColorInfo[];
    }
    interface IColorInfo extends IStyleInfo {
        value: string;
    }
    interface IStyleInfo {
        className?: string;
    }
}
declare module powerbi {
    module SettingsUtil {
        function copyCommonSettings(settings: VisualSettings): VisualSettings;
    }
}
declare module powerbi.visuals {
    var lineChartCapabilities: VisualCapabilities;
    var lineChartProps: {
        general: {
            formatString: DataViewObjectPropertyIdentifier;
        };
        dataPoint: {
            defaultColor: DataViewObjectPropertyIdentifier;
            fill: DataViewObjectPropertyIdentifier;
        };
        categoryAxis: {
            axisType: DataViewObjectPropertyIdentifier;
        };
    };
}
declare module powerbi.visuals {
    interface LineChartConstructorOptions {
        isScrollable: boolean;
        chartType?: LineChartType;
        interactivityService?: IInteractivityService;
        animator?: NullAnimator;
    }
    interface ILineChartConfiguration {
        xAxisProperties: IAxisProperties;
        yAxisProperties: IAxisProperties;
        margin: any;
    }
    interface LineChartData extends CartesianData {
        series: LineChartSeries[];
        isScalar?: boolean;
        dataLabelsSettings: PointDataLabelsSettings;
        axesLabels: ChartAxesLabels;
        defaultDataPointColor?: string;
        showAllDataPoints?: boolean;
        hasDynamicSeries?: boolean;
        hasSelection: boolean;
    }
    interface LineChartSeries extends CartesianSeries, SelectableDataPoint {
        key: string;
        lineIndex: number;
        color: string;
        xCol: DataViewMetadataColumn;
        yCol: DataViewMetadataColumn;
        data: LineChartDataPoint[];
    }
    interface LineChartDataPoint extends CartesianDataPoint, TooltipEnabledDataPoint, SelectableDataPoint, LabelEnabledDataPoint {
        categoryValue: any;
        value: number;
        categoryIndex: number;
        seriesIndex: number;
        key: string;
    }
    enum LineChartType {
        default = 1,
        area = 2,
        smooth = 4,
        lineShadow = 8,
    }
    /** Renders a data series as a line visual. */
    class LineChart implements ICartesianVisual, IInteractiveVisual {
        private static ClassName;
        private static MainGraphicsContextClassName;
        private static CategoryClassName;
        private static CategoryClassSelector;
        private static CategoryValuePoint;
        private static CategoryAreaClassName;
        private static CategoryAreaClassSelector;
        private static HorizontalShift;
        private static CircleRadius;
        private static PathElementName;
        private static CircleElementName;
        private static CircleClassName;
        private static LineElementName;
        static AreaFillOpacity: number;
        static DimmedAreaFillOpacity: number;
        private isInteractiveChart;
        private isScrollable;
        private element;
        private mainGraphicsContext;
        private clearCatcher;
        private mainGraphicsSVG;
        private toolTipContext;
        private options;
        private dataViewCat;
        private colors;
        private host;
        private data;
        private clippedData;
        private lineType;
        private xAxisProperties;
        private yAxisProperties;
        private margin;
        private currentViewport;
        private selectionCircles;
        private dragHandle;
        private hoverLine;
        private lastInteractiveSelectedColumnIndex;
        private interactivityService;
        private animator;
        static customizeQuery(options: CustomizeQueryOptions): void;
        static getSortableRoles(options: VisualSortableOptions): string[];
        static converter(dataView: DataView, blankCategoryValue: string, colors: IDataColorPalette, isScalar: boolean, interactivityService?: IInteractivityService): LineChartData;
        private static getColor(colorHelper, hasDynamicSeries, values, grouped, seriesIndex, groupedIdentity);
        constructor(options: LineChartConstructorOptions);
        init(options: CartesianVisualInitOptions): void;
        setData(dataViews: DataView[]): void;
        calculateLegend(): LegendData;
        hasLegend(): boolean;
        setFilteredData(startIndex: number, endIndex: number): CartesianData;
        calculateAxesProperties(options: CalculateScaleAndDomainOptions): IAxisProperties[];
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[];
        private enumerateDataPoints();
        overrideXScale(xProperties: IAxisProperties): void;
        onClearSelection(): void;
        render(duration: number): void;
        private renderNew(duration);
        private renderOld(duration);
        static getTooltipInfoByPointX(lineChart: LineChart, pointData: any, pointX: number): TooltipDataItem[];
        getVisualCategoryAxisIsScalar(): boolean;
        getSupportedCategoryAxisType(): string;
        getPreferredPlotArea(isScalar: boolean, categoryCount: number, categoryThickness: number): IViewport;
        private getCategoryCount(origCatgSize);
        private getAvailableWidth();
        private getAvailableHeight();
        private static sliceSeries(series, newLength, startIndex?);
        private extraLineShift();
        private hasDataPoint(series);
        private lookupXValue(index, type);
        private getXValue(d);
        /**
          * This checks to see if a data point is isolated, which means
          * the previous and next data point are both null.
          */
        private shouldDrawCircle(d, i);
        selectColumn(columnIndex: number, force?: boolean): void;
        private setHoverLine(chartX);
        private getChartX(columnIndex);
        private findIndex(x);
        private findClosestXAxisIndex(currentX, xAxisValues);
        private getPosition(x, pathElement);
        private createLegendDataPoints(columnIndex);
        accept(visitor: InteractivityVisitor, options: any): void;
    }
}
declare module powerbi.visuals {
    interface IPoint {
        x: number;
        y: number;
    }
    class Point implements IPoint {
        x: number;
        y: number;
        constructor(x?: number, y?: number);
    }
    interface IRect {
        left: number;
        top: number;
        width: number;
        height: number;
    }
    class Rect implements IRect {
        left: number;
        top: number;
        width: number;
        height: number;
        constructor(left?: number, top?: number, width?: number, height?: number);
    }
    interface I2DTransformMatrix {
        m00: number;
        m01: number;
        m02: number;
        m10: number;
        m11: number;
        m12: number;
    }
    /** Transformation matrix math wrapper */
    class Transform {
        private _inverse;
        matrix: I2DTransformMatrix;
        constructor(m?: I2DTransformMatrix);
        applyToPoint(point: IPoint): IPoint;
        applyToRect(rect: Rect): IRect;
        translate(xOffset: number, yOffset: number): void;
        scale(xScale: number, yScale: number): void;
        rotate(angleInRadians: number): void;
        add(other: Transform): void;
        getInverse(): Transform;
    }
    function createTranslateMatrix(xOffset: number, yOffset: number): I2DTransformMatrix;
    function createScaleMatrix(xScale: number, yScale: number): I2DTransformMatrix;
    function createRotationMatrix(angleInRads: number): I2DTransformMatrix;
    function createInverseMatrix(m: I2DTransformMatrix): I2DTransformMatrix;
    class MapPolygonInfo {
        private _locationRect;
        private _baseRect;
        private _currentRect;
        constructor();
        reCalc(mapControl: Microsoft.Maps.Map, width: number, height: number): void;
        scale: number;
        transform: Transform;
        outherTransform: Transform;
        setViewBox(svg: SVGSVGElement): void;
        innerTransform: Transform;
        transformToString(transform: Transform): string;
    }
}
declare module powerbi.visuals.BI.Services.GeocodingManager {
    var Settings: {
        MaxBingRequest: number;
        MaxCacheSize: number;
        MaxCacheSizeOverflow: number;
        BingKey: string;
        BingUrl: string;
        BingUrlGeodata: string;
        UseDoubleArrayGeodataResult: boolean;
        UseDoubleArrayDequeueTimeout: number;
    };
    interface BingAjaxService {
        (url: string, settings: JQueryAjaxSettings): any;
    }
    var safeCharacters: string;
    var BingAjaxCall: BingAjaxService;
    var CategoryTypes: {
        Address: string;
        City: string;
        Continent: string;
        CountryRegion: string;
        County: string;
        Longitude: string;
        Latitude: string;
        Place: string;
        PostalCode: string;
        StateOrProvince: string;
    };
    var CategoryTypeArray: string[];
    function isCategoryType(value: string): boolean;
    var BingEntities: {
        Continent: string;
        Sovereign: string;
        CountryRegion: string;
        AdminDivision1: string;
        AdminDivision2: string;
        PopulatedPlace: string;
        Postcode: string;
        Postcode1: string;
        Neighborhood: string;
        Address: string;
    };
    interface ILocation {
        latitude: number;
        longitude: number;
    }
    interface ILocationRect {
        northWest: ILocation;
        southEast: ILocation;
    }
    interface GeocodeCallback {
        (error: Error, coordinate: IGeocodeCoordinate): void;
    }
    interface IGeocodeQuery {
        query: string;
        category: string;
        levelOfDetail?: number;
        longitude?: number;
        latitude?: number;
    }
    interface IGeocodeBoundaryPolygon {
        nativeBing: string;
        geographic?: Float64Array;
        geographicBounds?: Microsoft.Maps.LocationRect;
        absolute?: Float64Array;
        absoluteBounds?: Rect;
        absoluteString?: string;
    }
    interface IGeocodeCoordinate {
        latitude?: number;
        longitude?: number;
        locations?: IGeocodeBoundaryPolygon[];
    }
    class GeocodeQuery implements IGeocodeQuery {
        query: string;
        category: string;
        key: string;
        private _cacheHits;
        constructor(query?: string, category?: string);
        incrementCacheHit(): void;
        getCacheHits(): number;
        getBingEntity(): string;
        getUrl(): string;
    }
    class GeocodeBoundaryQuery extends GeocodeQuery {
        latitude: number;
        longitude: number;
        levelOfDetail: number;
        maxGeoData: number;
        constructor(latitude: number, longitude: number, category: any, levelOfDetail: any, maxGeoData?: number);
        getBingEntity(): string;
        getUrl(): string;
    }
    function geocodeCore(geocodeQuery: GeocodeQuery): any;
    function geocode(query: string, category?: string): any;
    function geocodeBoundary(latitude: number, longitude: number, category?: string, levelOfDetail?: number, maxGeoData?: number): any;
    function reset(): void;
}
declare module powerbi.visuals.BI.Services.MapServices {
    var MinAllowedLatitude: number;
    var MaxAllowedLatitude: number;
    var MinAllowedLongitude: number;
    var MaxAllowedLongitude: number;
    var TileSize: number;
    var MaxLevelOfDetail: number;
    var MinLevelOfDetail: number;
    var MaxAutoZoomLevel: number;
    var DefaultLevelOfDetail: number;
    var WorkerErrorName: string;
    function clip(n: number, minValue: number, maxValue: number): number;
    function getMapSize(levelOfDetail: number): number;
    function latLongToPixelXYArray(latLongArray: Float64Array, levelOfDetail: number): Float64Array;
    function pointArrayToString(array: Float64Array): any;
    function pointArrayToArray(array: Float64Array): number[];
    function getLocationBoundaries(latLongArray: Float64Array): Microsoft.Maps.LocationRect;
    function parseEncodedSpatialValueArray(value: any): Float64Array;
    function calcGeoData(data: powerbi.visuals.BI.Services.GeocodingManager.IGeocodeCoordinate): void;
    function latLongToPixelXY(latitude: number, longitude: number, levelOfDetail: number): powerbi.visuals.Point;
    function locationToPixelXY(location: Microsoft.Maps.Location, levelOfDetail: number): powerbi.visuals.Point;
    function locationRectToRectXY(locationRect: Microsoft.Maps.LocationRect, levelOfDetail: number): powerbi.visuals.Rect;
    function pixelXYToLocation(pixelX: number, pixelY: number, levelOfDetail: number): Microsoft.Maps.Location;
}
declare module powerbi.visuals {
    enum LegendIcon {
        Box = 0,
        Circle = 1,
        Line = 2,
    }
    enum LegendPosition {
        Top = 0,
        Bottom = 1,
        Right = 2,
        Left = 3,
        None = 4,
    }
    interface LegendPosition2D {
        textPosition?: Point;
        glyphPosition?: Point;
    }
    interface LegendDataPoint extends SelectableDataPoint, LegendPosition2D {
        label: string;
        color: string;
        icon: LegendIcon;
        category?: string;
        measure?: any;
        iconOnlyOnLabel?: boolean;
        tooltip?: string;
    }
    interface LegendData {
        title?: string;
        dataPoints: LegendDataPoint[];
        grouped?: boolean;
    }
    var legendProps: {
        show: string;
        position: string;
        titleText: string;
        showTitle: string;
    };
    function createLegend(legendParentElement: JQuery, interactive: boolean, interactivityService: IInteractivityService, isScrollable?: boolean, legendPosition?: LegendPosition): ILegend;
    interface ILegend {
        getMargins(): IViewport;
        isVisible(): boolean;
        changeOrientation(orientation: LegendPosition): void;
        getOrientation(): LegendPosition;
        drawLegend(data: LegendData, viewport: IViewport): any;
        /**
         * Reset the legend by clearing it
         */
        reset(): void;
    }
    function getIconClass(iconType: LegendIcon): string;
    function getLabelMaxSize(currentViewport: IViewport, numItems: number, hasTitle: boolean): string;
    module LegendData {
        function update(legendData: LegendData, legendObject: DataViewObject): void;
    }
}
declare module powerbi.visuals {
    var mapCapabilities: VisualCapabilities;
    var mapProps: {
        general: {
            formatString: DataViewObjectPropertyIdentifier;
        };
        dataPoint: {
            defaultColor: DataViewObjectPropertyIdentifier;
            fill: DataViewObjectPropertyIdentifier;
            showAllDataPoints: DataViewObjectPropertyIdentifier;
        };
        legend: {
            show: DataViewObjectPropertyIdentifier;
            position: DataViewObjectPropertyIdentifier;
            showTitle: DataViewObjectPropertyIdentifier;
            titleText: DataViewObjectPropertyIdentifier;
        };
    };
}
declare module powerbi.visuals {
    interface MapConstructionOptions {
        filledMap?: boolean;
    }
    interface MapDataPoint {
        geocodingQuery: string;
        location?: Microsoft.Maps.Location;
        cachedLocation?: Microsoft.Maps.Location;
        paths?: powerbi.visuals.BI.Services.GeocodingManager.IGeocodeBoundaryPolygon[];
        value: number;
        radius?: number;
        seriesInfo: MapSeriesInfo;
        categoryIdentity: DataViewScopeIdentity;
        categoryValue: string;
    }
    interface MapPieSlice {
        value: number;
        index: number;
        fill: string;
        stroke: string;
        seriesId: DataViewScopeIdentity;
    }
    interface MapSeriesInfo {
        sizeValuesForGroup: MapPieSlice[];
        latitude?: number;
        longitude?: number;
    }
    interface MapData {
        bubbleData?: MapBubble[];
        sliceData?: MapSlice[][];
        shapeData?: MapShape[];
    }
    interface MapVisualDataPoint extends TooltipEnabledDataPoint, SelectableDataPoint, LabelEnabledDataPoint {
        x: number;
        y: number;
        radius: number;
        fill: string;
        stroke: string;
        strokeWidth: number;
    }
    interface MapBubble extends MapVisualDataPoint {
    }
    interface MapSlice extends MapVisualDataPoint {
        value: number;
        startAngle?: number;
        endAngle?: number;
    }
    interface MapShape extends TooltipEnabledDataPoint, SelectableDataPoint {
        path: string;
        fill: string;
        stroke: string;
        strokeWidth: number;
        key: string;
    }
    interface IMapDataPointRenderer {
        init(mapControl: Microsoft.Maps.Map): void;
        beginDataPointUpdate(geocodingCategory: string, dataPointCount: number): void;
        addDataPoint(dataPoint: MapDataPoint): void;
        getDataPointCount(): number;
        converter(viewPort: IViewport, dataView: DataView, interactivityService: IInteractivityService, labelSettings: PointDataLabelsSettings): MapData;
        updateInternal(data: MapData): MapBehaviorOptions;
        getDataPointPadding(): number;
        clearDataPoints(): void;
    }
    interface DataViewMetadataAutoGeneratedColumn extends DataViewMetadataColumn {
        /** Indicates that the column was added manually. */
        isAutoGeneratedColumn?: boolean;
    }
    class MapOneD3DataPointRenderer implements IMapDataPointRenderer {
        private mapControl;
        private values;
        private maxDataPointRadius;
        private svg;
        private clearCatcher;
        private bubbleGraphicsContext;
        private sliceGraphicsContext;
        private sliceLayout;
        private arc;
        private dataLabelsSettings;
        constructor();
        init(mapControl: Microsoft.Maps.Map): void;
        addDataPoint(dataPoint: MapDataPoint): void;
        clearDataPoints(): void;
        getDataPointCount(): number;
        getDataPointPadding(): number;
        private clearMaxDataPointRadius();
        private setMaxDataPointRadius(dataPointRadius);
        beginDataPointUpdate(geocodingCategory: string, dataPointCount: number): void;
        getDefaultMap(geocodingCategory: string, dataPointCount: number): void;
        converter(viewPort: IViewport, dataView: DataView, interactivityService: IInteractivityService, labelSettings: PointDataLabelsSettings): MapData;
        updateInternal(data: MapData): MapBehaviorOptions;
    }
    interface FilledMapParams {
        level: number;
        maxPolygons: number;
        strokeWidth: number;
    }
    class MapShapeDataPointRenderer implements IMapDataPointRenderer {
        private mapControl;
        private svg;
        private clearCatcher;
        private geocodingCategory;
        private dataPointCount;
        private polygonInfo;
        private viewport;
        private values;
        private shapeGraphicsContext;
        private maxShapeDimension;
        static getFilledMapParams(category: string, dataCount: number): FilledMapParams;
        static buildPaths(locations: visuals.BI.Services.GeocodingManager.IGeocodeBoundaryPolygon[]): visuals.BI.Services.GeocodingManager.IGeocodeBoundaryPolygon[];
        constructor();
        init(mapControl: Microsoft.Maps.Map): void;
        beginDataPointUpdate(geocodingCategory: string, dataPointCount: number): void;
        addDataPoint(dataPoint: MapDataPoint): void;
        clearDataPoints(): void;
        getDataPointCount(): number;
        converter(viewport: IViewport, dataView: DataView, interactivityService?: IInteractivityService): MapData;
        updateInternal(data: MapData): MapBehaviorOptions;
        private clearMaxShapeDimension();
        private setMaxShapeDimension(width, height);
        getDataPointPadding(): number;
    }
    interface SimpleRange {
        min: number;
        max: number;
    }
    class Map implements IVisual, IInteractiveVisual {
        currentViewport: IViewport;
        private pendingGeocodingRender;
        private mapControl;
        private minLongitude;
        private maxLongitude;
        private minLatitude;
        private maxLatitude;
        private valueScale;
        private style;
        private colors;
        private dataPointRenderer;
        private geocodingCategory;
        private legend;
        private legendHeight;
        private legendData;
        private element;
        private dataView;
        private dataLabelsSettings;
        private static MapContainer;
        static StrokeDarkenColorValue: number;
        private interactivityService;
        private defaultDataPointColor;
        private showAllDataPoints;
        private hasDynamicSeries;
        private geoTaggingAnalyzerService;
        private enableGeoShaping;
        private host;
        constructor(options: MapConstructionOptions);
        init(options: VisualInitOptions): void;
        private addDataPoint(dataPoint);
        private scheduleRedraw();
        private enqueueGeoCode(dataPoint);
        private enqueueGeoCodeAndGeoShape(dataPoint, params);
        private enqueueGeoShape(dataPoint, params);
        private getOptimumLevelOfDetail(width, height);
        private getViewCenter(levelOfDetail);
        private resetBounds();
        private updateBounds(latitude, longitude);
        static legendObject(dataView: DataView): DataViewObject;
        static isLegendHidden(dataView: DataView): boolean;
        static legendPosition(dataView: DataView): LegendPosition;
        static isShowLegendTitle(dataView: DataView): boolean;
        private legendTitle();
        private renderLegend(legendData);
        static calculateGroupSizes(categorical: DataViewCategorical, grouped: DataViewValueColumnGroup[], groupSizeTotals: number[], sizeMeasureIndex: number, currentValueScale: SimpleRange): SimpleRange;
        static createMapDataPoint(group: string, value: number, seriesInfo: MapSeriesInfo, radius: number, colors: IDataColorPalette, categoryIdentity: DataViewScopeIdentity): MapDataPoint;
        static calculateSeriesLegend(grouped: DataViewValueColumnGroup[], groupIndex: number, sizeMeasureIndex: number, colors: IDataColorPalette, defaultDataPointColor?: string, seriesSource?: data.SQExpr[]): LegendDataPoint[];
        static calculateSeriesInfo(grouped: DataViewValueColumnGroup[], groupIndex: number, sizeMeasureIndex: number, longitudeMeasureIndex: number, latitudeMeasureIndex: number, colors: IDataColorPalette, defaultDataPointColor?: string, objectsDefinitions?: DataViewObjects[], seriesSource?: data.SQExpr[]): MapSeriesInfo;
        private static getOptionalMeasure(seriesValues, measureIndex, groupIndex, defaultValue);
        static calculateRadius(range: SimpleRange, rangeDiff: number, value?: number): number;
        static getGeocodingCategory(categorical: DataViewCategorical, geoTaggingAnalyzerService: IGeoTaggingAnalyzerService): string;
        static hasSizeField(values: DataViewValueColumns, defaultIndexIfNoRole?: number): boolean;
        static createDefaultValueColumns(categorical: DataViewCategorical): DataViewValueColumns;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[];
        private enumerateDataPoints();
        static enumerateLegend(dataView: DataView, legend: ILegend, legendTitle: string): VisualObjectInstance[];
        onDataChanged(options: VisualDataChangedOptions): void;
        /** Public for UnitTests */
        static showLocationMissingWarningIfNecessary(dataView: powerbi.DataView): IVisualWarning[];
        onResizing(viewport: IViewport, duration: number): void;
        private initialize(container);
        private onViewChanged();
        private getMapViewPort();
        private updateInternal();
        private updateOffsets();
        accept(visitor: InteractivityVisitor, options: any): void;
        onClearSelection(): void;
        private clearDataPoints();
    }
}
declare module powerbi.visuals {
    interface CardItemData {
        caption: string;
        details: string;
    }
    interface CardData {
        title?: string;
        cardItemsData: CardItemData[];
    }
    class MultiRowCard implements IVisual {
        private currentViewport;
        private options;
        private dataView;
        private style;
        private element;
        private listView;
        private cardHeight;
        private cardWidth;
        private columnWidth;
        private maxCardsDisplayed;
        private cardItemContainerHeight;
        private isCardWrapped;
        /** This includes card height with margin that will be passed to list view. */
        private cardHeightTotal;
        private settings;
        private dataModel;
        private interactivity;
        private isInteractivityOverflowHidden;
        private waitingForData;
        private cardHasTitle;
        private isSingleRowCard;
        private isSingleValueCard;
        static formatStringProp: DataViewObjectPropertyIdentifier;
        private static multiRowCardClass;
        private static Card;
        private static Title;
        private static CardItemContainer;
        private static Caption;
        private static Details;
        private static SmallTileWidth;
        private static MediumTileWidth;
        private static LargeTileWidth;
        /** Cards have specific styling so defined inline styles and also to support theming and improve performance */
        private static DefaultStyle;
        static capabilities: VisualCapabilities;
        init(options: VisualInitOptions): void;
        onDataChanged(options: VisualDataChangedOptions): void;
        onResizing(viewport: IViewport, duration: number): void;
        static converter(dataView: DataView, columnCount: number, maxCards: number, isDashboardVisual?: boolean): CardData[];
        private updateInternal(resetScrollbarPosition?);
        private initializeCardRowSelection();
        /**
        * This contains the card column wrapping logic
        * Determines how many columns can be shown per each row inside a Card
        * To place the fields evenly along the card, the width of each card item is calculated based on the available viewport width
        */
        private setCardDimensions();
        private calculateCardDimensions(viewport, cardRowColumnCount, maxCardColumns, maxCards);
        private getPixelString(value);
        private onLoadMoreData();
        private getTotalCardHeight(cardHeight);
    }
}
declare module powerbi.visuals {
    /** Renders an interactive partiion map visual from hierarchy data */
    class PartitionMap implements IVisual {
        private static ClassName;
        private static TransitionAnimationDuration;
        private static MinTextHeight;
        private svg;
        private currentViewport;
        private style;
        private colors;
        private data;
        private element;
        static capabilities: VisualCapabilities;
        init(options: VisualInitOptions): void;
        onDataChanged(options: VisualDataChangedOptions): void;
        onResizing(viewport: IViewport, duration: number): void;
        private updateInternal(animationDuration?);
        private transform(d, ky);
        private click(d, w, h, x, y, g);
        private static convertTreeNodeToGraphNode(node);
        private converter(data);
    }
}
declare module powerbi.visuals {
    /** Represents a rich text box that supports view & edit mode. */
    class RichTextbox implements IVisual {
        private editor;
        private element;
        private host;
        private viewPort;
        private readOnly;
        private paragraphs;
        static capabilities: VisualCapabilities;
        init(options: VisualInitOptions): void;
        onResizing(viewport: IViewport, duration: number): void;
        onDataChanged(options: VisualDataChangedOptions): void;
        destroy(): void;
        onViewModeChanged(viewMode: ViewMode): void;
        setSelection(start: number, end: number): void;
        private refreshView();
        private saveContents();
        private updateSize();
        private static convertDeltaToParagraphs(contents);
        private static convertParagraphsToHtml(paragraphs);
        private static convertParagraphsToOps(paragraphs);
        private static convertFormatAttributesToTextStyle(attributes);
    }
    module RichText {
        var defaultFont: string;
        var defaultFontSize: string;
        function getFontFamily(font: string): string;
        class QuillWrapper {
            private editor;
            private $editorDiv;
            private $toolbarDiv;
            private $container;
            private dependenciesLoaded;
            private localizationProvider;
            private host;
            private static textChangeThrottle;
            private static formatUrlThrottle;
            static loadQuillResources: boolean;
            private static quillJsFiles;
            private static quillCssFiles;
            private QuillPackage;
            initialized: boolean;
            readOnly: boolean;
            textChanged: (delta, source) => void;
            constructor(readOnly: boolean, host: IVisualHostServices);
            getElement(): JQuery;
            getToolbar(): JQuery;
            getContents(): quill.Delta;
            setContents(contents: quill.Delta | quill.Op[]): void;
            resize(viewport: IViewport): void;
            setReadOnly(readOnly: boolean): void;
            formatUrls(): void;
            setSelection(start: number, end: number): void;
            getSelection(): quill.Range;
            private rebuildQuillEditor();
            private onTextChanged(delta, source);
        }
    }
}
declare module powerbi.visuals {
    var scatterChartCapabilities: VisualCapabilities;
    var scatterChartProps: {
        general: {
            formatString: DataViewObjectPropertyIdentifier;
        };
        dataPoint: {
            defaultColor: DataViewObjectPropertyIdentifier;
            fill: DataViewObjectPropertyIdentifier;
        };
    };
}
declare module powerbi.visuals {
    interface ScatterChartConstructorOptions {
        interactivityService: IInteractivityService;
    }
    interface ScatterChartDataPoint extends SelectableDataPoint, TooltipEnabledDataPoint, LabelEnabledDataPoint {
        x: any;
        y: any;
        radius: RadiusData;
        fill: string;
        category: string;
    }
    interface RadiusData {
        sizeMeasure: DataViewValueColumn;
        index: number;
    }
    interface DataRange {
        minRange: number;
        maxRange: number;
        delta: number;
    }
    interface ScatterChartData {
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
    class ScatterChart implements ICartesianVisual, IInteractiveVisual {
        private static ScatterChartCircleTagName;
        private static BubbleRadius;
        static DefaultBubbleOpacity: number;
        static DimmedBubbleOpacity: number;
        private static AreaOf300By300Chart;
        private static MinSizeRange;
        private static MaxSizeRange;
        private static ClassName;
        private static MainGraphicsContextClassName;
        private static DotClassName;
        private static DotClassSelector;
        private svg;
        private element;
        private mainGraphicsContext;
        private clearCatcher;
        private mainGraphicsG;
        private currentViewport;
        private style;
        private data;
        private dataView;
        private host;
        private margin;
        private xAxisProperties;
        private yAxisProperties;
        private colors;
        private options;
        private interactivity;
        private cartesianVisualHost;
        private isInteractiveChart;
        private interactivityService;
        private categoryAxisProperties;
        private valueAxisProperties;
        constructor(options: ScatterChartConstructorOptions);
        init(options: CartesianVisualInitOptions): void;
        static converter(dataView: DataView, currentViewport: IViewport, colorPalette: IDataColorPalette, interactivityService?: IInteractivityService, categoryAxisProperties?: DataViewObject, valueAxisProperties?: DataViewObject): ScatterChartData;
        private static getSizeRangeForGroups(dataViewValueGroups, sizeColumnIndex);
        private static createDataPoints(dataValues, metadata, categories, categoryValues, categoryFormatter, categoryIdentities, categoryObjects, colorPalette, viewport, hasDynamicSeries, labelSettings, defaultDataPointColor?);
        private static createSeriesLegend(dataValues, colorPalette, categorical, formatString, defaultDataPointColor);
        static getBubbleRadius(radiusData: RadiusData, sizeRange: NumberRange, viewPort: IViewport): number;
        static getMeasureValue(measureIndex: number, seriesValues: DataViewValueColumn[]): DataViewValueColumn;
        private static getMetadata(grouped, source);
        private static getDefaultMeasureIndex(count, usedIndex, usedIndex2);
        setData(dataViews: DataView[]): void;
        calculateLegend(): LegendData;
        hasLegend(): boolean;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[];
        private enumerateDataPoints();
        calculateAxesProperties(options: CalculateScaleAndDomainOptions): IAxisProperties[];
        overrideXScale(xProperties: IAxisProperties): void;
        render(duration: number): void;
        static getBubblePixelAreaSizeRange(viewPort: IViewport, minSizeRange: number, maxSizeRange: number): DataRange;
        static project(value: number, actualSizeDataRange: DataRange, bubblePixelAreaSizeRange: DataRange): number;
        static projectSizeToPixels(size: number, actualSizeDataRange: DataRange, bubblePixelAreaSizeRange: DataRange): number;
        static rangeContains(range: DataRange, value: number): boolean;
        static getBubbleOpacity(d: ScatterChartDataPoint, hasSelection: boolean): number;
        accept(visitor: InteractivityVisitor, options: any): void;
        onClearSelection(): void;
        getSupportedCategoryAxisType(): string;
    }
}
declare module powerbi.visuals {
    var slicerCapabilities: VisualCapabilities;
    var slicerProps: {
        selectedPropertyIdentifier: DataViewObjectPropertyIdentifier;
        filterPropertyIdentifier: DataViewObjectPropertyIdentifier;
        formatString: DataViewObjectPropertyIdentifier;
    };
}
declare module powerbi.visuals {
    interface SlicerData {
        categorySourceName: string;
        formatString: string;
        slicerDataPoints: SlicerDataPoint[];
    }
    interface SlicerDataPoint extends SelectableDataPoint {
        value: string;
        mouseOver: boolean;
        mouseOut: boolean;
    }
    interface SlicerVisualSettingsExtension extends VisualSettings {
        slicerSettings: SlicerSettings;
    }
    interface SlicerSettings {
        header: {
            height: number;
        };
        headerText: {
            marginLeft: number;
            marginTop: number;
        };
        slicerBody: {
            marginTop: number;
            marginBottom: number;
        };
        slicerText: {
            color: string;
            hoverColor: string;
            selectionColor: string;
            marginLeft: number;
        };
        slicerItemContainer: {
            height: number;
            marginLeft: number;
        };
        clear: {
            width: number;
            totalMargin: number;
        };
    }
    class Slicer implements IVisual {
        private element;
        private currentViewport;
        private dataView;
        private slicerContainer;
        private slicerHeader;
        private slicerBody;
        private listView;
        private slicerData;
        private settings;
        private interactivityService;
        private hostServices;
        private static clearTextKey;
        private waitingForData;
        private static Container;
        private static Header;
        private static HeaderText;
        private static Body;
        private static ItemContainer;
        private static LabelText;
        private static Input;
        private static Clear;
        static DefaultStyleProperties: SlicerSettings;
        static converter(dataView: DataView): SlicerData;
        init(options: VisualInitOptions): void;
        onDataChanged(options: VisualDataChangedOptions): void;
        onResizing(finalViewport: IViewport, duration: number): void;
        accept(visitor: InteractivityVisitor, options: any): void;
        private updateInternal(resetScrollbarPosition?);
        private initContainer();
        private onLoadMoreData();
        private getSlicerBodyViewport(currentViewport);
        private getSlicerHeaderTextWidth();
    }
}
declare module powerbi.visuals {
    class SunburstChart implements IVisual {
        private static ClassName;
        private svg;
        private context;
        private labelContext;
        private percentageLabel;
        private breadcrumbLabel;
        private arc;
        private currentViewport;
        private style;
        private data;
        private totalSize;
        private enableHoverBehaviour;
        private hostService;
        private temp;
        constructor();
        static capabilities: VisualCapabilities;
        init(options: VisualInitOptions): void;
        onDataChanged(options: VisualDataChangedOptions): void;
        onResizing(viewport: IViewport, duration: number): void;
        private updateInternal();
        private onMouseOver(node);
        private onMouseLeave(node);
        private static getOpacityForNode(node);
        private static getAncestors(node);
    }
}
declare module powerbi.visuals {
    enum TableColumnSizePolicy {
        Auto = 0,
        FixedColumns4 = 1,
        FixedColumns5 = 2,
        FixedColumns7 = 3,
    }
    interface TableDataViewObjects extends DataViewObjects {
        general: TableDataViewObject;
    }
    interface TableDataViewObject extends DataViewObject {
        totals: boolean;
    }
    class Table implements IVisual {
        private static Styles;
        static formatStringProp: DataViewObjectPropertyIdentifier;
        static padding: number;
        static scrollbarPadClass: string;
        private static dateDataType;
        private static MaxCountForDashboard;
        private element;
        private currentViewport;
        private style;
        private dataView;
        private formatter;
        private columnSizePolicy;
        private columnCount;
        private getLocalizedString;
        private dataTable;
        static capabilities: VisualCapabilities;
        static getSortableRoles(): string[];
        static getTableColumnSizePolicy(newViewport: IViewport): TableColumnSizePolicy;
        init(options: VisualInitOptions): void;
        destroy(): void;
        onResizing(finalViewport: IViewport, duration: number): void;
        onDataChanged(options: VisualDataChangedOptions): void;
        private updateViewport(newViewport);
        private adjustRowAndColumnSizes(onComplete?);
        private synchronizeTableColumns();
        private modifyTableHeight(height);
        /** Returns the width that is available in the viewport after padding is taken into account
        */
        private getAvailableViewportWidth(rawViewportWidth, columnCount);
        private applyColumnSizePolicy(newViewport);
        private fitToColumnCount(columnCount, newViewport);
        private updateInternal();
        private dataTableOptions(table, dataView, tableDataRows, canUpdateQuery);
        private calculateDataTableHeight();
        private createTotalsRow(dataView);
        private createOptions(col);
        private onHeader(header);
        private onFooter(footer, totals, columnMetadata);
        private formatCell(formatter, td, column, data);
        private shouldShowTotals();
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[];
    }
}
declare module powerbi.visuals {
    interface DataViewVisualTable extends DataViewTable {
        visualRows?: DataViewVisualTableRow[];
    }
    interface DataViewVisualTableRow {
        index: number;
        values: any[];
    }
    interface TableDataAdapter {
        update(table: DataViewTable): void;
    }
    interface TableCell {
        value: string;
        isMeasure: boolean;
        isTotal: boolean;
        isBottomMost: boolean;
        showUrl: boolean;
    }
    interface TableTotal {
        totalCells: any[];
    }
    class TableHierarchyNavigator implements controls.ITablixHierarchyNavigator, TableDataAdapter {
        private tableDataView;
        private formatter;
        constructor(tableDataView: DataViewVisualTable, formatter: ICustomValueFormatter);
        /** Returns the depth of a hierarchy. */
        getDepth(hierarchy: any): number;
        /** Returns the leaf count of a hierarchy. */
        getLeafCount(hierarchy: any): number;
        /** Returns the leaf member of a hierarchy at a specified index. */
        getLeafAt(hierarchy: any, index: number): any;
        /** Returns the specified hierarchy member parent. */
        getParent(item: any): any;
        /** Returns the index of the hierarchy member relative to its parent. */
        getIndex(item: any): number;
        private isRow(item);
        private getColumnIndex(item);
        /** Checks whether a hierarchy member is a leaf. */
        isLeaf(item: any): boolean;
        isRowHierarchyLeaf(cornerItem: any): boolean;
        isColumnHierarchyLeaf(cornerItem: any): boolean;
        /** Checks whether a hierarchy member is the last item within its parent. */
        isLastItem(item: any, items: any): boolean;
        /** Gets the children members of a hierarchy member. */
        getChildren(item: any): any;
        /** Gets the members count in a specified collection. */
        getCount(items: any): number;
        /** Gets the member at the specified index. */
        getAt(items: any, index: number): any;
        /** Gets the hierarchy member level. */
        getLevel(item: any): number;
        /** Returns the intersection between a row and a column item. */
        getIntersection(rowItem: any, columnItem: DataViewMetadataColumn): TableCell;
        /** Returns the corner cell between a row and a column level. */
        getCorner(rowLevel: number, columnLevel: number): any;
        headerItemEquals(item1: any, item2: any): boolean;
        bodyCellItemEquals(item1: any, item2: any): boolean;
        cornerCellItemEquals(item1: any, item2: any): boolean;
        update(table: DataViewVisualTable): void;
        private static getIndex(items, item);
    }
    interface TableBinderOptions {
        onBindRowHeader?(item: any): void;
        onColumnHeaderClick?(queryName: string): void;
    }
    class TableBinder implements controls.ITablixBinder {
        private static columnHeaderClassName;
        private static rowClassName;
        private static lastRowClassName;
        private static footerClassName;
        private static numericCellClassName;
        private static nonBreakingSpace;
        private options;
        constructor(options: TableBinderOptions);
        onStartRenderingSession(): void;
        onEndRenderingSession(): void;
        bindRowHeader(item: any, cell: controls.ITablixCell): void;
        unbindRowHeader(item: any, cell: controls.ITablixCell): void;
        bindColumnHeader(item: DataViewMetadataColumn, cell: controls.ITablixCell): void;
        unbindColumnHeader(item: any, cell: controls.ITablixCell): void;
        bindBodyCell(item: TableCell, cell: controls.ITablixCell): void;
        unbindBodyCell(item: TableCell, cell: controls.ITablixCell): void;
        bindCornerCell(item: any, cell: controls.ITablixCell): void;
        unbindCornerCell(item: any, cell: controls.ITablixCell): void;
        bindEmptySpaceHeaderCell(cell: controls.ITablixCell): void;
        unbindEmptySpaceHeaderCell(cell: controls.ITablixCell): void;
        bindEmptySpaceFooterCell(cell: controls.ITablixCell): void;
        unbindEmptySpaceFooterCell(cell: controls.ITablixCell): void;
        getHeaderLabel(item: DataViewMetadataColumn): string;
        getCellContent(item: any): string;
        hasRowGroups(): boolean;
        private ensureHeight(item, cell);
    }
    class TableNew implements IVisual {
        static formatStringProp: DataViewObjectPropertyIdentifier;
        private static preferredLoadMoreThreshold;
        private element;
        private currentViewport;
        private style;
        private formatter;
        private isInteractive;
        private getLocalizedString;
        private dataView;
        private hostServices;
        private tablixControl;
        private hierarchyNavigator;
        private waitingForData;
        private lastAllowHeaderResize;
        static capabilities: VisualCapabilities;
        static customizeQuery(options: CustomizeQueryOptions): void;
        static getSortableRoles(): string[];
        init(options: VisualInitOptions): void;
        static converter(table: DataViewTable): DataViewVisualTable;
        onResizing(finalViewport: IViewport, duration: number): void;
        onDataChanged(options: VisualDataChangedOptions): void;
        private updateViewport(newViewport);
        private refreshControl(clear);
        private getLayoutKind();
        private createControl(dataNavigator);
        private updateInternal(dataView);
        private createTotalsRow(dataView);
        private shouldShowTotals(dataView);
        private static shouldShowTotals(objects);
        private onBindRowHeader(item);
        private onColumnHeaderClick(queryName);
        needsMoreData(item: any): boolean;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[];
        private shouldAllowHeaderResize();
        private verifyHeaderResize();
    }
}
declare module powerbi.visuals {
    /** Extension of the Matrix node for Matrix visual*/
    interface MatrixVisualNode extends DataViewMatrixNode {
        /** Index of the node in its parent's children collection
        NOTE: for size optimization, we could also look this item up in the parent's children collection, but we may need to pay the perf penalty */
        index?: number;
        /** Global index of the node as a leaf node. If the node is not a leaf, the value is undefined */
        leafIndex?: number;
        /** Parent of the node. Undefined for outermost nodes (children of the one root node) */
        parent?: MatrixVisualNode;
    }
    interface MatrixCornerItem {
        metadata: DataViewMetadataColumn;
        isColumnHeaderLeaf: boolean;
        isRowHeaderLeaf: boolean;
    }
    interface MatrixVisualBodyItem {
        content: any;
        isSubtotal: boolean;
    }
    /** Interface for refreshing Matrix Data View */
    interface MatrixDataAdapter {
        update(dataViewMatrix?: DataViewMatrix): void;
        updateRows(): void;
    }
    interface MatrixDataViewObjects extends DataViewObjects {
        general: MatrixDataViewObject;
    }
    interface MatrixDataViewObject extends DataViewObject {
        rowSubtotals: boolean;
        columnSubtotals: boolean;
    }
    interface IMatrixHierarchyNavigator extends controls.ITablixHierarchyNavigator, MatrixDataAdapter {
        getDataViewMatrix(): DataViewMatrix;
        getDepth(hierarchy: MatrixVisualNode[]): number;
        getLeafCount(hierarchy: MatrixVisualNode[]): number;
        getLeafAt(hierarchy: MatrixVisualNode[], index: number): any;
        getLeafIndex(item: MatrixVisualNode): number;
        getParent(item: MatrixVisualNode): MatrixVisualNode;
        getIndex(item: MatrixVisualNode): number;
        isLeaf(item: MatrixVisualNode): boolean;
        isRowHierarchyLeaf(item: any): boolean;
        isColumnHierarchyLeaf(item: any): boolean;
        isLastItem(item: MatrixVisualNode, items: MatrixVisualNode[]): boolean;
        getChildren(item: MatrixVisualNode): MatrixVisualNode[];
        getCount(items: MatrixVisualNode[]): number;
        getAt(items: MatrixVisualNode[], index: number): MatrixVisualNode;
        getLevel(item: MatrixVisualNode): number;
        getIntersection(rowItem: MatrixVisualNode, columnItem: MatrixVisualNode): MatrixVisualBodyItem;
        getCorner(rowLevel: number, columnLevel: number): MatrixCornerItem;
        headerItemEquals(item1: MatrixVisualNode, item2: MatrixVisualNode): boolean;
    }
    /** Factory method used by unit tests */
    function createMatrixHierarchyNavigator(matrix: DataViewMatrix, formatter: ICustomValueFormatter): IMatrixHierarchyNavigator;
    interface MatrixBinderOptions {
        onBindRowHeader?(item: MatrixVisualNode): void;
        totalLabel?: string;
        onColumnHeaderClick?(queryName: string): void;
    }
    class MatrixBinder implements controls.ITablixBinder {
        private static headerClassName;
        private static columnHeaderLeafClassName;
        private static rowHeaderLeafClassName;
        private static rowHeaderStaticLeafClassName;
        private static bodyCellClassName;
        private static totalClassName;
        private static nonBreakingSpace;
        private hierarchyNavigator;
        private options;
        constructor(hierarchyNavigator: IMatrixHierarchyNavigator, options: MatrixBinderOptions);
        onStartRenderingSession(): void;
        onEndRenderingSession(): void;
        bindRowHeader(item: MatrixVisualNode, cell: controls.ITablixCell): void;
        unbindRowHeader(item: any, cell: controls.ITablixCell): void;
        bindColumnHeader(item: MatrixVisualNode, cell: controls.ITablixCell): void;
        unbindColumnHeader(item: MatrixVisualNode, cell: controls.ITablixCell): void;
        bindBodyCell(item: MatrixVisualBodyItem, cell: controls.ITablixCell): void;
        unbindBodyCell(item: MatrixVisualBodyItem, cell: controls.ITablixCell): void;
        private registerColumnHeaderClickHandler(columnMetadata, cell);
        private unregisterColumnHeaderClickHandler(cell);
        bindCornerCell(item: MatrixCornerItem, cell: controls.ITablixCell): void;
        unbindCornerCell(item: MatrixCornerItem, cell: controls.ITablixCell): void;
        bindEmptySpaceHeaderCell(cell: controls.ITablixCell): void;
        unbindEmptySpaceHeaderCell(cell: controls.ITablixCell): void;
        bindEmptySpaceFooterCell(cell: controls.ITablixCell): void;
        unbindEmptySpaceFooterCell(cell: controls.ITablixCell): void;
        getHeaderLabel(item: MatrixVisualNode): string;
        getCellContent(item: MatrixVisualBodyItem): string;
        hasRowGroups(): boolean;
        private static getNodeLabel(node);
        private bindHeader(item, cell, metadata, overwriteSubtotalLabel?);
        /** Returns the column metadata of the column that needs to be sorted for the specified matrix corner node.
            Returns null if the specified corner node does not represent a sortable header. */
        private getSortableCornerColumnMetadata(item);
        private getRowHeaderMetadata(item);
        private getColumnHeaderMetadata(item);
        private getHierarchyMetadata(hierarchy, level);
        /** Returns the column metadata of the column that needs to be sorted for the specified header node.
            Returns null if the specified header node does not represent a sortable header. */
        private getSortableHeaderColumnMetadata(item);
    }
    class Matrix implements IVisual {
        static formatStringProp: DataViewObjectPropertyIdentifier;
        private static preferredLoadMoreThreshold;
        static TotalLabel: string;
        private element;
        private currentViewport;
        private style;
        private dataView;
        private formatter;
        private isInteractive;
        private hostServices;
        private hierarchyNavigator;
        private waitingForData;
        private tablixControl;
        private lastAllowHeaderResize;
        static capabilities: VisualCapabilities;
        static customizeQuery(options: CustomizeQueryOptions): void;
        static getSortableRoles(): string[];
        init(options: VisualInitOptions): void;
        onResizing(finalViewport: IViewport, duration: number): void;
        onDataChanged(options: VisualDataChangedOptions): void;
        private updateViewport(newViewport);
        private refreshControl(clear);
        private getLayoutKind();
        private createControl(matrixNavigator);
        private updateInternal();
        private onBindRowHeader(item);
        private onColumnHeaderClick(queryName);
        needsMoreData(item: MatrixVisualNode): boolean;
        private static shouldShowRowSubtotals(objects);
        private static shouldShowColumnSubtotals(objects);
        private getMatrixDataViewObjects();
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[];
        private shouldAllowHeaderResize();
        private verifyHeaderResize();
    }
}
declare module powerbi.visuals {
    interface TextRunStyle {
        fontFamily?: string;
        fontSize?: string;
        fontStyle?: string;
        fontWeight?: string;
        textDecoration?: string;
    }
    interface TextRunContext {
        textStyle?: TextRunStyle;
        url?: string;
        value: string;
    }
    interface ParagraphContext {
        horizontalTextAlignment?: string;
        textRuns: TextRunContext[];
    }
    interface TextboxDataViewObjects extends DataViewObjects {
        general: TextboxDataViewObject;
    }
    interface TextboxDataViewObject extends DataViewObject {
        paragraphs: ParagraphContext[];
    }
    class Textbox implements IVisual {
        static capabilities: VisualCapabilities;
        private element;
        private static translateFontFamily(fontFamily);
        init(options: VisualInitOptions): void;
        onResizing(viewport: IViewport, duration: number): void;
        onDataChanged(options: VisualDataChangedOptions): void;
    }
}
declare module powerbi.visuals {
    var treemapCapabilities: VisualCapabilities;
    var treemapProps: {
        general: {
            formatString: DataViewObjectPropertyIdentifier;
        };
        dataPoint: {
            fill: DataViewObjectPropertyIdentifier;
        };
        legend: {
            show: DataViewObjectPropertyIdentifier;
            position: DataViewObjectPropertyIdentifier;
            showTitle: DataViewObjectPropertyIdentifier;
            titleText: DataViewObjectPropertyIdentifier;
        };
    };
}
declare module powerbi.visuals {
    interface TreemapConstructorOptions {
        animator: ITreemapAnimator;
        isScrollable: boolean;
    }
    interface TreemapData {
        root: TreemapNode;
        hasHighlights: boolean;
        legendData: LegendData;
        dataLabelsSettings: VisualDataLabelsSettings;
        legendObjectProperties?: DataViewObject;
    }
    interface TreemapNode extends D3.Layout.GraphNode, SelectableDataPoint, TooltipEnabledDataPoint, LabelEnabledDataPoint {
        key: any;
        highlightMultiplier?: number;
        color: string;
        highlightedTooltipInfo?: TooltipDataItem[];
    }
    interface ITreemapLayout {
        shapeClass: (d: TreemapNode) => string;
        shapeLayout: {
            x: (d: TreemapNode) => number;
            y: (d: TreemapNode) => number;
            width: (d: TreemapNode) => number;
            height: (d: TreemapNode) => number;
        };
        highlightShapeClass: (d: TreemapNode) => string;
        highlightShapeLayout: {
            x: (d: TreemapNode) => number;
            y: (d: TreemapNode) => number;
            width: (d: TreemapNode) => number;
            height: (d: TreemapNode) => number;
        };
        zeroShapeLayout: {
            x: (d: TreemapNode) => number;
            y: (d: TreemapNode) => number;
            width: (d: TreemapNode) => number;
            height: (d: TreemapNode) => number;
        };
        labelClass: (d: TreemapNode) => string;
        labelLayout: {
            x: (d: TreemapNode) => number;
            y: (d: TreemapNode) => number;
        };
        labelText: (d: TreemapNode) => string;
    }
    /** Renders an interactive treemap visual from categorical data */
    class Treemap implements IVisual, IInteractiveVisual {
        static DimmedShapeOpacity: number;
        private static ClassName;
        static LabelsClassName: string;
        static MajorLabelClassName: string;
        static MinorLabelClassName: string;
        static ShapesClassName: string;
        static TreemapNodeClassName: string;
        static RootNodeClassName: string;
        static ParentGroupClassName: string;
        static NodeGroupClassName: string;
        static HighlightNodeClassName: string;
        private static TextMargin;
        private static MinorLabelTextSize;
        private static MinTextWidthForMinorLabel;
        private static MinorLabelTextProperties;
        private static MajorLabelTextSize;
        private static MinTextWidthForMajorLabel;
        private static MajorLabelTextProperties;
        private svg;
        private treemap;
        private shapeGraphicsContext;
        private labelGraphicsContext;
        private currentViewport;
        private parentViewport;
        private legend;
        private data;
        private style;
        private colors;
        private element;
        private options;
        private isScrollable;
        private hostService;
        animator: ITreemapAnimator;
        private interactivityService;
        private dataViews;
        static layout: ITreemapLayout;
        constructor(options?: TreemapConstructorOptions);
        init(options: VisualInitOptions): void;
        /** Public for testing purposes */
        static converter(dataView: DataView, colors: IDataColorPalette, labelSettings: VisualDataLabelsSettings, interactivityService: IInteractivityService, legendObjectProperties?: DataViewObject): TreemapData;
        private static getValuesFromCategoricalDataView(data, hasHighlights);
        update(options: VisualUpdateOptions): void;
        onDataChanged(options: VisualDataChangedOptions): void;
        onResizing(viewport: IViewport, duration: number): void;
        onClearSelection(): void;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[];
        private enumerateDataPoints(data);
        private enumerateLegend(data);
        private static checkValueForShape(value);
        private initViewportDependantProperties(duration?);
        private static isMajorLabel(node);
        private static hasChildrenWithIdentity(node);
        private static canDisplayLabel(node);
        private static createLabelForShape(node);
        static getFill(d: TreemapNode, isHighlightRect: boolean): string;
        static getFillOpacity(d: TreemapNode, hasSelection: boolean, hasHighlights: boolean, isHighlightRect: boolean): string;
        private updateInternal(useAnimation?, duration?);
        private renderLegend();
        accept(visitor: InteractivityVisitor, options: any): void;
        private static getNodeClass(d, highlight?);
        private static createTreemapShapeLayout(isHighlightRect?);
        private static createTreemapZeroShapeLayout();
        static drawDefaultShapes(context: D3.Selection, nodes: D3.Layout.GraphNode[], hasSelection: boolean, hasHighlights: boolean): D3.UpdateSelection;
        static drawDefaultHighlightShapes(context: D3.Selection, nodes: D3.Layout.GraphNode[], hasSelection: boolean, hasHighlights: boolean): D3.UpdateSelection;
        static drawDefaultLabels(context: D3.Selection, nodes: D3.Layout.GraphNode[], labelSettings: VisualDataLabelsSettings): D3.UpdateSelection;
    }
}
declare module powerbi.visuals {
    interface CardVisualSettingsExtension extends VisualSettings {
        cardSettings?: CardSettings;
    }
    interface CardSettings {
    }
    interface CardStyle {
        card: {
            maxFontSize: number;
        };
        label: {
            fontSize: number;
            color: string;
            height: number;
        };
        value: {
            fontSize: number;
            color: string;
            fontFamily: string;
        };
    }
    interface CardConstructorOptions {
        isScrollable?: boolean;
    }
    class Card extends AnimatedText implements IVisual {
        private static cardClassName;
        private static Label;
        private static Value;
        static DefaultStyle: CardStyle;
        private toolTip;
        private animationOptions;
        private displayUnitSystemType;
        private isScrollable;
        private labelContext;
        constructor(options?: CardConstructorOptions);
        static capabilities: VisualCapabilities;
        init(options: VisualInitOptions): void;
        private convertSettings(settings);
        onDataChanged(options: VisualDataChangedOptions): void;
        onResizing(viewport: IViewport, duration: number): void;
        private updateViewportProperties();
        getAdjustedFontHeight(availableWidth: number, textToMeasure: string, seedFontHeight: number): number;
        private updateInternal(target, duration?, forceUpdate?);
        private updateTooltip(target);
    }
}
declare module powerbi.visuals {
    import IStringResourceProvider = jsCommon.IStringResourceProvider;
    class NoMapLocationWarning implements IVisualWarning {
        code: string;
        getMessages(resourceProvider: IStringResourceProvider): IVisualErrorMessage;
    }
    class NaNNotSupportedWarning implements IVisualWarning {
        code: string;
        getMessages(resourceProvider: IStringResourceProvider): IVisualErrorMessage;
    }
    class InfinityValuesNotSupportedWarning implements IVisualWarning {
        code: string;
        getMessages(resourceProvider: IStringResourceProvider): IVisualErrorMessage;
    }
    class ValuesOutOfRangeWarning implements IVisualWarning {
        code: string;
        getMessages(resourceProvider: IStringResourceProvider): IVisualErrorMessage;
    }
}
declare module powerbi.visuals {
    var waterfallChartCapabilities: VisualCapabilities;
    var waterfallChartProps: {
        sentimentColors: {
            increaseFill: DataViewObjectPropertyIdentifier;
            decreaseFill: DataViewObjectPropertyIdentifier;
            totalFill: DataViewObjectPropertyIdentifier;
        };
    };
}
declare module powerbi.visuals {
    interface WaterfallChartData {
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
        hasSelection: boolean;
    }
    interface WaterfallChartDataPoint extends CartesianDataPoint, SelectableDataPoint, TooltipEnabledDataPoint, LabelEnabledDataPoint {
        position: number;
        color: string;
        highlight: boolean;
        key: string;
    }
    interface WaterfallChartConstructorOptions {
        isScrollable: boolean;
    }
    interface WaterfallChartSentimentColors {
        increaseFill: Fill;
        decreaseFill: Fill;
        totalFill: Fill;
    }
    interface WaterfallLayout extends CategoryLayout, ILabelLayout {
        categoryWidth: number;
    }
    class WaterfallChart implements ICartesianVisual, IInteractiveVisual {
        static formatStringProp: DataViewObjectPropertyIdentifier;
        private static WaterfallClassName;
        private static MainGraphicsContextClassName;
        private static IncreaseLabel;
        private static DecreaseLabel;
        private static TotalLabel;
        private static CategoryValueClasses;
        private static WaterfallConnectorClasses;
        private static defaultTotalColor;
        private svg;
        private mainGraphicsContext;
        private mainGraphicsSVG;
        private clearCatcher;
        private xAxisProperties;
        private yAxisProperties;
        private currentViewport;
        private data;
        private element;
        private isScrollable;
        private clippedData;
        private style;
        private colors;
        private hostServices;
        private cartesianVisualHost;
        private interactivity;
        private margin;
        private options;
        private interactivityService;
        private layout;
        private static showTotal;
        constructor(options: WaterfallChartConstructorOptions);
        init(options: CartesianVisualInitOptions): void;
        static converter(dataView: DataViewCategorical, palette: IDataColorPalette, hostServices: IVisualHostServices, dataLabelSettings: VisualDataLabelsSettings, sentimentColors: WaterfallChartSentimentColors, interactivityService: IInteractivityService, dataViewMetadata: DataViewMetadata): WaterfallChartData;
        setData(dataViews: DataView[]): void;
        enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[];
        private enumerateSentimentColors();
        calculateLegend(): LegendData;
        hasLegend(): boolean;
        private static createClippedDataIfOverflowed(data, renderableDataCount);
        calculateAxesProperties(options: CalculateScaleAndDomainOptions): IAxisProperties[];
        private static lookupXValue(data, index, type);
        static getXAxisCreationOptions(data: WaterfallChartData, width: number, layout: CategoryLayout, options: CalculateScaleAndDomainOptions): CreateAxisOptions;
        static getYAxisCreationOptions(data: WaterfallChartData, height: number, options: CalculateScaleAndDomainOptions): CreateAxisOptions;
        getPreferredPlotArea(isScalar: boolean, categoryCount: number, categoryThickness: number): IViewport;
        getVisualCategoryAxisIsScalar(): boolean;
        overrideXScale(xProperties: IAxisProperties): void;
        setFilteredData(startIndex: number, endIndex: number): any;
        private createRects(data);
        private createConnectors(data);
        render(duration: number): void;
        onClearSelection(): void;
        accept(visitor: InteractivityVisitor, options: any): void;
        getSupportedCategoryAxisType(): string;
        private static getRectTop(scale, pos, value);
        private getAvailableWidth();
        private getAvailableHeight();
        private getSentimentColorsFromObjects(objects);
    }
}
declare module powerbi.visuals {
    class WebChart implements IVisual {
        private static VisualClassName;
        private static AxisGraphicsContextClassName;
        private static MainGraphicsContextClassName;
        private currentViewport;
        private style;
        private element;
        private data;
        private svg;
        private mainGraphicsContext;
        private axisGraphicsContext;
        private hostService;
        static capabilities: VisualCapabilities;
        init(options: VisualInitOptions): void;
        onDataChanged(options: VisualDataChangedOptions): void;
        onResizing(viewport: IViewport, duration: number): void;
        private converter(dataView);
        private updateInternal();
        private getInterimValue(chart, index, factor);
        private getLabelPosition(point, center, angle);
        private getLabelAnchor(angle);
        private translateWebPoint(chart, point, center, value, index);
        private scaleWebPoint(point, center, scaleFactor);
        private rotateWebPoint(point, center, angle);
    }
}
declare module powerbi.visuals.plugins {
    var animatedNumber: IVisualPlugin;
    var areaChart: IVisualPlugin;
    var barChart: IVisualPlugin;
    var bingNews: IVisualPlugin;
    var card: IVisualPlugin;
    var multiRowCard: IVisualPlugin;
    var clusteredBarChart: IVisualPlugin;
    var clusteredColumnChart: IVisualPlugin;
    var columnChart: IVisualPlugin;
    var comboChart: IVisualPlugin;
    var dataDotChart: IVisualPlugin;
    var dataDotClusteredColumnComboChart: IVisualPlugin;
    var dataDotStackedColumnComboChart: IVisualPlugin;
    var donutChart: IVisualPlugin;
    var funnel: IVisualPlugin;
    var gauge: IVisualPlugin;
    var hundredPercentStackedBarChart: IVisualPlugin;
    var hundredPercentStackedColumnChart: IVisualPlugin;
    var image: IVisualPlugin;
    var lineChart: IVisualPlugin;
    var lineStackedColumnComboChart: IVisualPlugin;
    var lineClusteredColumnComboChart: IVisualPlugin;
    var map: IVisualPlugin;
    var filledMap: IVisualPlugin;
    var heatMap: IVisualPlugin;
    var treemap: IVisualPlugin;
    var partitionMap: IVisualPlugin;
    var pieChart: IVisualPlugin;
    var sunburstChart: IVisualPlugin;
    var scatterChart: IVisualPlugin;
    var table: IVisualPlugin;
    var newTable: IVisualPlugin;
    var matrix: IVisualPlugin;
    var slicer: IVisualPlugin;
    var webChart: IVisualPlugin;
    var textbox: IVisualPlugin;
    var waterfallChart: IVisualPlugin;
}
declare module powerbi.visuals {
    import TouchUtils = powerbi.visuals.controls.TouchUtils;
    interface TooltipDataItem {
        displayName: string;
        value: string;
    }
    interface TooltipOptions {
        opacity: number;
        animationDuration: number;
        offsetX: number;
        offsetY: number;
    }
    interface TooltipEnabledDataPoint {
        tooltipInfo?: TooltipDataItem[];
    }
    interface TooltipCategoryDataItem {
        value?: any;
        metadata: DataViewMetadataColumn;
    }
    interface TooltipSeriesDataItem {
        value?: any;
        highlightedValue?: any;
        metadata: DataViewValueColumn;
    }
    interface TooltipLocalizationOptions {
        highlightedValueDisplayName: string;
    }
    interface TooltipEvent {
        data: any;
        index: number;
        coordinates: number[];
        elementCoordinates: number[];
        context: any;
        isTouchEvent: boolean;
    }
    class ToolTipComponent {
        tooltipOptions: TooltipOptions;
        private static DefaultTooltipOptions;
        private tooltipContainer;
        private isTooltipVisible;
        private customScreenWidth;
        private customScreenHeight;
        private static containerClassName;
        private static contentContainerClassName;
        private static arrowClassName;
        private static tooltipRowClassName;
        private static tooltipTitleCellClassName;
        private static tooltipValueCellClassName;
        static parentContainerSelector: string;
        static highlightedValueDisplayNameResorceKey: string;
        static localizationOptions: TooltipLocalizationOptions;
        constructor(tooltipOptions?: TooltipOptions);
        isTooltipComponentVisible(): boolean;
        setTestScreenSize(width: number, height: number): void;
        show(tooltipData: TooltipDataItem[], clickedArea: TouchUtils.Rectangle): void;
        move(tooltipData: TooltipDataItem[], clickedArea: TouchUtils.Rectangle): void;
        hide(): void;
        private createTooltipContainer();
        private setTooltipContent(tooltipData);
        private getTooltipPosition(clickedArea, clickedScreenArea);
        private setPosition(clickedArea);
        private setArrowPosition(clickedArea, clickedScreenArea);
        private getArrowElement();
        private getClickedScreenArea(clickedArea);
    }
    module TooltipManager {
        var ShowTooltips: boolean;
        var ToolTipInstance: ToolTipComponent;
        function addTooltip(d3Selection: D3.Selection, getTooltipInfoDelegate: (tooltipEvent: TooltipEvent) => TooltipDataItem[], reloadTooltipDataOnMouseMove?: boolean): void;
        function showDelayedTooltip(tooltipEvent: TooltipEvent, getTooltipInfoDelegate: (tooltipEvent: TooltipEvent) => TooltipDataItem[], delayInMs: number): number;
        function setLocalizedStrings(localizationOptions: TooltipLocalizationOptions): void;
    }
    module TooltipBuilder {
        function createTooltipInfo(formatStringProp: DataViewObjectPropertyIdentifier, categories: DataViewCategoryColumn[], categoryValue: any, values?: DataViewValueColumns, value?: any, seriesData?: TooltipSeriesDataItem[], seriesIndex?: number, highlightedValue?: any): TooltipDataItem[];
    }
}
