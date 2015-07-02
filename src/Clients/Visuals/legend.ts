//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    import DOMFactory = InJs.DomFactory;

    export enum LegendIcon {
        Box,
        Circle,
        Line
    }

    export enum LegendPosition {
        Top,
        Bottom,
        Right,
        Left,
        None,
    }

    export interface LegendPosition2D {
        textPosition?: Point;
        glyphPosition?: Point;
    }

    export interface LegendDataPoint extends SelectableDataPoint, LegendPosition2D {
        label: string;
        color: string;
        icon: LegendIcon;
        category?: string;
        measure?: any;
        iconOnlyOnLabel?: boolean;
        tooltip?: string;
    }

    export interface LegendData {
        title?: string;
        dataPoints: LegendDataPoint[];
        grouped?: boolean;
    }

    export var legendProps = {
        show: 'show',
        position: 'position',
        titleText: 'titleText',
        showTitle: 'showTitle',
    };

    export function createLegend(legendParentElement: JQuery, interactive: boolean,
        interactivityService: IInteractivityService,
        isScrollable: boolean = false,
        legendPosition: LegendPosition = LegendPosition.Top): ILegend {
        if (interactive) return new CartesianChartInteractiveLegend(legendParentElement);
        else return new SVGLegend(legendParentElement, legendPosition, interactivityService, isScrollable);
    }

    export interface ILegend {
        getMargins(): IViewport;

        isVisible(): boolean;
        changeOrientation(orientation: LegendPosition): void;
        getOrientation(): LegendPosition;
        drawLegend(data: LegendData, viewport: IViewport);
        /**
         * Reset the legend by clearing it
         */
        reset(): void;
    }

    export function getIconClass(iconType: LegendIcon): string {
        switch (iconType) {
            case LegendIcon.Circle:
                return 'icon circle';
            case LegendIcon.Box:
                return 'icon tall';
            case LegendIcon.Line:
                return 'icon short';
            default:
                debug.assertFail('Invalid Chart type: ' + iconType);
        }
    }

    export function getLabelMaxSize(currentViewport: IViewport, numItems: number, hasTitle: boolean): string {
        var viewportWidth = currentViewport.width;
        var smallTileWidth = 250;
        var mediumTileWidth = 490;
        var largeTileWidth = 750;
        var tileMargins = 20;
        var legendMarkerWidth = 28;
        var legendItems;

        if (numItems < 1)
            return '48px';

        if (viewportWidth <= smallTileWidth) {
            legendItems = hasTitle ? 4 : 3;
            //Max width based on minimum number of items design of 3 i.e. '48px' or 4 (with title) - '29px' max-width at least   
            return Math.floor((smallTileWidth - tileMargins - (legendMarkerWidth * legendItems)) / Math.min(numItems, legendItems)) + 'px';
        }

        if (viewportWidth <= mediumTileWidth) {
            legendItems = hasTitle ? 6 : 5;
            //Max width based on minimum number of items design of 5 i.e. '66px' or 6 (with title) - '50px' max-width at least  
            return Math.floor((mediumTileWidth - tileMargins - (legendMarkerWidth * legendItems)) / Math.min(numItems, legendItems)) + 'px';
        }

        if (viewportWidth <= largeTileWidth) {
            legendItems = hasTitle ? 8 : 7;
            //Max width based on minimum number of items design of 7 i.e. '76px' or 8 (with title) - '63px' max-width at least
            return Math.floor((largeTileWidth - tileMargins - (legendMarkerWidth * legendItems)) / Math.min(numItems, legendItems)) + 'px';
        }

        //Wide viewport
        legendItems = hasTitle ? 10 : 9;
        return Math.floor((viewportWidth - tileMargins - (legendMarkerWidth * legendItems)) / Math.min(numItems, legendItems)) + 'px';
    }

    interface TitleLayout {
        x: number;
        y: number;
        text: string;
        width: number;
    }

    interface LegendLayout {
        dataPoints: LegendDataPoint[];
        title: TitleLayout;
    }

    class SVGLegend implements ILegend {
        private orientation: LegendPosition;
        private viewport: IViewport;
        private parentViewport: IViewport;
        private svg: D3.Selection;
        private element: JQuery;
        private interactivityService: IInteractivityService;

        private static LegendIconRadius = 5;
        private static MaxTextLength = 60;
        private static MaxTitleLength = 80;
        private static TextAndIconPadding = 5;
        private static TitlePadding = 15;
        private static LegendEdgeMariginWidth = 10;
        private static LegendMaxWidthFactor = 0.3;
        private static TopLegendHeight = 24;

        private static LegendTextProperties: TextProperties = {
            fontFamily: 'wf_segoe-ui_normal',
            fontSize: '11px'
        };

        private static LegendTitleTextProperties: TextProperties = {
            fontFamily: 'wf_segoe-ui_Semibold',
            fontSize: '11px'
        };

        private static LegendItem: ClassAndSelector = {
            class: 'legendItem',
            selector: '.legendItem'
        };

        private static LegendText: ClassAndSelector = {
            class: 'legendText',
            selector: '.legendText'
        }

        private static LegendIcon: ClassAndSelector = {
            class: 'legendIcon',
            selector: '.legendIcon'
        }

        private static LegendTitle: ClassAndSelector = {
            class: 'legendTitle',
            selector: '.legendTitle'
        }

        constructor(
            element: JQuery,
            legendPosition: LegendPosition,
            interactivityService: IInteractivityService,
            isScrollable: boolean) {

            this.svg = d3.select(element.get(0)).insert('svg', ':first-child');
            this.svg.style('display', 'inherit');
            this.svg.classed('legend', true);
            this.interactivityService = interactivityService;
            this.element = element;
            this.changeOrientation(legendPosition);
            this.parentViewport = { height: 0, width: 0 };
            this.calculateViewport();
            this.updateLayout();
        }

        private updateLayout() {
            var viewport = this.viewport;
            var orientation = this.orientation;
            this.svg
                .attr({
                'height': viewport.height || (orientation === LegendPosition.None ? 0 : this.parentViewport.height),
                'width': viewport.width || (orientation === LegendPosition.None ? 0 : this.parentViewport.width)
            });
            this.svg.style({
                'float': this.getFloat(),
                'position': orientation === LegendPosition.Bottom ? 'absolute' : '',
                'bottom': orientation === LegendPosition.Bottom ? '0px' : '',
            });
        }

        private calculateViewport(): void {
            switch (this.orientation) {
                case LegendPosition.Top:
                case LegendPosition.Bottom:
                    this.viewport = { height: SVGLegend.TopLegendHeight, width: 0 };
                    return;
                case LegendPosition.Right:
                case LegendPosition.Left:
                    this.viewport = { height: 0, width: this.parentViewport.width * SVGLegend.LegendMaxWidthFactor }
                    return;

                case LegendPosition.None:
                    this.viewport = { height: 0, width: 0 };
            }
        }

        private getFloat(): string { 
            switch (this.orientation) {
                case LegendPosition.Right: 
                    return 'right';
                case LegendPosition.Left:
                    return 'left';
                default: return '';
            }
        }

        public accept(visitor: InteractivityVisitor, options: any): void {
            visitor.visitLegend(options);
        }

        public getMargins(): IViewport {
            return this.viewport;
        }

        public isVisible(): boolean {
            return this.viewport.height > 0 || this.viewport.width > 0;
        }

        public changeOrientation(orientation: LegendPosition): void {
            if (orientation) {
                this.orientation = orientation;
            } else {
                this.orientation = LegendPosition.Top
            }
            this.svg.attr('orientation', orientation);
        }

        public getOrientation(): LegendPosition {
            return this.orientation;
        }

        public drawLegend(data: LegendData, viewport: IViewport): void {
            var marker = jsCommon.PerformanceUtil.create('drawLegend');
            this.parentViewport = viewport;
            //var dataPoints = data.dataPoints;

            if (data.dataPoints.length === 0) {
                this.changeOrientation(LegendPosition.None);
            }

            if (this.getOrientation() === LegendPosition.None) {
                data.dataPoints = [];
            }

            // Adding back the workaround for Legend Left/Right position for Map
            var mapControl = this.element.children(".mapControl");
            if (mapControl.length > 0 && !this.isTopOrBottom(this.orientation)) {
                mapControl.css("display", "inline-block");
            }

            this.calculateViewport();

            var layout = this.calculateLayout(data);
            var titleLayout = layout.title;
            var titleData = titleLayout ? [titleLayout] : [];

            var legendTitle = this.svg
                .selectAll(SVGLegend.LegendTitle.selector)
                .data(titleData);

            legendTitle.enter()
                .append('text')
                .style({
                    'font-size': SVGLegend.LegendTitleTextProperties.fontSize,
                    'font-family': SVGLegend.LegendTitleTextProperties.fontFamily
                })
                .classed(SVGLegend.LegendTitle.class, true);

            legendTitle
                .text((d: TitleLayout)=> d.text)
                .attr( {
                    'x': (d: TitleLayout) => d.x,
                    'y': (d: TitleLayout) => d.y
                });

            legendTitle.exit().remove();


            var dataPointsLayout = layout.dataPoints;

            var legendItems = this.svg
                .selectAll(SVGLegend.LegendItem.selector)
                .data(dataPointsLayout,(d: LegendDataPoint) => d.label + d.color);

            var itemsEnter = legendItems.enter()
                .append('g')
                .classed(SVGLegend.LegendItem.class, true);

            itemsEnter
                .append('circle')
                .classed(SVGLegend.LegendIcon.class, true);

            itemsEnter.append('title');

            itemsEnter
                .append('text')
                .classed(SVGLegend.LegendText.class, true)
                .style({
                    'font-size': SVGLegend.LegendTextProperties.fontSize,
                    'font-family': SVGLegend.LegendTextProperties.fontFamily
                });

            legendItems
                .select(SVGLegend.LegendIcon.selector)
                .attr({
                    'cx': (d: LegendDataPoint, i) => d.glyphPosition.x,
                    'cy': (d: LegendDataPoint) => d.glyphPosition.y,
                    'r': SVGLegend.LegendIconRadius,
                })
                .style('fill',(d: LegendDataPoint) => {
                    return d.color;
                });

            legendItems
                .select('title')
                .text((d: LegendDataPoint) => d.tooltip);

            legendItems
                .select(SVGLegend.LegendText.selector)
                .attr({
                    'x': (d: LegendDataPoint) => d.textPosition.x,
                    'y': (d: LegendDataPoint) => d.textPosition.y,
                })
                .text((d: LegendDataPoint) => d.label);

            if (this.interactivityService) {
                var iconsSelection = legendItems.select(SVGLegend.LegendIcon.selector);
                var behaviorOptions: LegendBehaviorOptions = {
                    datapoints: dataPointsLayout,
                    legendItems: legendItems,
                    legendIcons: iconsSelection,
                    visualContainer: d3.select(this.element.get(0))
                };

                this.interactivityService.apply(this, behaviorOptions);
            }

            legendItems.exit().remove();
            
            this.updateLayout();
            marker.end();
        }

        private calculateTitleLayout(title: string): TitleLayout {
            var width = 0;
            var hasTitle = !jsCommon.StringExtensions.isNullOrEmpty(title);

            if (hasTitle) {
                var properties = SVGLegend.LegendTextProperties;
                var text = properties.text = title;
                var width = TextMeasurementService.measureSvgTextWidth(properties);
                if (width > SVGLegend.MaxTitleLength) {
                    text = TextMeasurementService.getTailoredTextOrDefault(
                        properties,
                        this.isTopOrBottom(this.orientation)
                            ? SVGLegend.MaxTitleLength
                            : this.parentViewport.width * SVGLegend.LegendMaxWidthFactor);
                    width = SVGLegend.MaxTitleLength;
                };

                width += SVGLegend.TitlePadding;

                return {
                    x: 0,
                    y: 0,
                    text: text,
                    width: width
                };
            }
            return null;

        }
        /** Performs layout offline for optimal perfomance */
        private calculateLayout(data: LegendData): LegendLayout{

            if (data.dataPoints.length === 0) {
                return {
                    dataPoints: [],
                    title: null,
                }
            }

            var dataPoints = data.dataPoints;
            var title = this.calculateTitleLayout(data.title);

            var copy: LegendDataPoint[] = $.extend(true, [], dataPoints);

            if (this.isTopOrBottom(this.orientation))
                return {
                    dataPoints: this.calculateHorizontalLayout(copy, title),
                    title: title
                };
            return {
                dataPoints: this.calculateVerticalLayout(copy, title),
                title: title
            };
        }

        public calculateHorizontalLayout(dataPoints: LegendDataPoint[], title: TitleLayout): LegendDataPoint[]{
            var fixedTextShift = SVGLegend.LegendIconRadius + SVGLegend.TextAndIconPadding;
            var fixedIconShift = 11;
            var fixedTextShift = fixedIconShift + 4;
            var totalSpaceOccupiedThusFar = 0;
            var iconTotalItemPadding = SVGLegend.LegendIconRadius * 2 + SVGLegend.TextAndIconPadding * 3;

            if (title) {
                totalSpaceOccupiedThusFar = title.width;
                title.y = fixedTextShift;
            }

            // This bit expands the max lengh if there are only a few items
            // so longer labels can potentially get more space, and not be
            // ellipsed. 
            var dataPointLength = dataPoints.length;
            var parentWidth = this.parentViewport.width;
            var maxTextLength = dataPointLength > 0
                ? (((parentWidth - totalSpaceOccupiedThusFar) - (iconTotalItemPadding * dataPointLength)) / dataPointLength) | 0
                : 0;
            maxTextLength = maxTextLength > SVGLegend.MaxTextLength ? maxTextLength : SVGLegend.MaxTextLength;
           
            for (var i = 0; i < dataPointLength; i++){
                var dp = dataPoints[i];

                dp.glyphPosition = {
                    x: totalSpaceOccupiedThusFar + SVGLegend.LegendIconRadius,
                    y: fixedIconShift
                };

                dp.textPosition = {
                    x: totalSpaceOccupiedThusFar + fixedTextShift,
                    y: fixedTextShift
                };

                var properties = SVGLegend.LegendTextProperties;
                properties.text = dp.label;
                dp.tooltip = dp.label;

                var width = TextMeasurementService.measureSvgTextWidth(properties);
                var spaceTakenByItem = 0;
                if (width < maxTextLength) {
                    spaceTakenByItem = iconTotalItemPadding + width;
                } else {
                    var text = TextMeasurementService.getTailoredTextOrDefault(
                        properties,
                        maxTextLength);
                    dp.label = text;
                    spaceTakenByItem = iconTotalItemPadding + maxTextLength;
                }
                
                totalSpaceOccupiedThusFar += spaceTakenByItem;

                if (totalSpaceOccupiedThusFar > parentWidth) {
                    dataPoints.length = i; // fast trim
                    break;
                }
            }

            return dataPoints;
        }

        public calculateVerticalLayout(dataPoints: LegendDataPoint[], title: TitleLayout): LegendDataPoint[]{
            var verticalLegendHeight = 20;
            var spaceNeededByTitle = 15;
            var totalSpaceOccupiedThusFar = verticalLegendHeight;
            var extraShiftForTextAlignmentToIcon = 4;
            var fixedHorizontalIconShift = SVGLegend.TextAndIconPadding  + SVGLegend.LegendIconRadius;
            var fixedHorizontalTextShift = SVGLegend.LegendIconRadius + SVGLegend.TextAndIconPadding + fixedHorizontalIconShift;
            var maxHorizotalSpaceAvaliable = this.parentViewport.width * SVGLegend.LegendMaxWidthFactor
                - fixedHorizontalTextShift - SVGLegend.LegendEdgeMariginWidth;
            var maxHorizontalSpaceUsed = 0;
            var parentHeight = this.parentViewport.height;

            if (title) {
                totalSpaceOccupiedThusFar += spaceNeededByTitle;
                title.x = SVGLegend.TextAndIconPadding;
                title.y = spaceNeededByTitle;
                maxHorizontalSpaceUsed = title.width || 0;
            }

            for (var i = 0, len = dataPoints.length; i < len; i++) {
                var dp = dataPoints[i];

                dp.glyphPosition = {
                    x: fixedHorizontalIconShift,
                    y: totalSpaceOccupiedThusFar
                };

                dp.textPosition = {
                    x: fixedHorizontalTextShift,
                    y: totalSpaceOccupiedThusFar + extraShiftForTextAlignmentToIcon
                }

                var properties = SVGLegend.LegendTextProperties;
                properties.text = dp.label;
                dp.tooltip = dp.label;

                // TODO: [PERF] Get rid of this extra measurement, and modify
                // getTailoredTextToReturnWidth + Text
                var width = TextMeasurementService.measureSvgTextWidth(properties);
                if (width > maxHorizontalSpaceUsed) {
                    maxHorizontalSpaceUsed = width;
                }

                if (width > maxHorizotalSpaceAvaliable) {
                    var text = TextMeasurementService.getTailoredTextOrDefault(
                        properties,
                        maxHorizotalSpaceAvaliable);
                    dp.label = text;
                }

                totalSpaceOccupiedThusFar += verticalLegendHeight;

                if (totalSpaceOccupiedThusFar > parentHeight) {
                    dataPoints.length = i; // fast trim
                    break;
                }
            }

            if ((maxHorizontalSpaceUsed + fixedHorizontalTextShift) < maxHorizotalSpaceAvaliable) {
                this.viewport.width = Math.ceil(maxHorizontalSpaceUsed + fixedHorizontalTextShift + SVGLegend.LegendEdgeMariginWidth);
            } else {
                this.viewport.width = Math.ceil(this.parentViewport.width * SVGLegend.LegendMaxWidthFactor);
            }

            return dataPoints;
        }

        private isTopOrBottom(orientation: LegendPosition) {
            switch (orientation) {
                case LegendPosition.Top:
                case LegendPosition.Bottom:
                    return true;
                default:
                    return false;
            }
        }

        public reset(): void {
            // Intentionally left blank. 
        }
    }

    class CartesianChartInteractiveLegend implements ILegend {
        private static LegendHeight = 65;
        private static LegendContainerClass = 'interactive-legend';
        private static LegendTitleClass = 'title';
        private static LegendTitleCssClass = '.title';
        private static LegendItem = 'item';
        private static legendPlaceSelector = '\u25A0';
        private static legendIconClass = 'icon';
        private static legendColorCss = 'color';
        private static legendItemNameClass = 'itemName';
        private static legendItemMeasureClass = 'itemMeasure';
        private element: JQuery;
        private legendContainerDiv: D3.Selection;

        constructor(element: JQuery) {
            this.element = element;
        }

        public static getIconClass(chartType: LegendIcon): string {
            switch (chartType) {
                case LegendIcon.Circle:
                case LegendIcon.Box:
                case LegendIcon.Line:
                    return 'icon';
                default:
                    debug.assertFail('Invalid Chart type: ' + chartType);
            }
        }

        public getMargins(): IViewport {
            return {
                height: CartesianChartInteractiveLegend.LegendHeight,
                width: 0
            };
        }

        public drawLegend(legendData: LegendData) {
            debug.assertValue(legendData, 'legendData');
            var data = legendData.dataPoints;
            debug.assertValue(data, 'dataPoints');
            if (data.length < 1) return;
            var legendContainerDiv = this.legendContainerDiv;
            if (!legendContainerDiv) {
                if (!data.length) return;
                var divToPrepend = $('<div></div>')
                    .height(this.getMargins().height)
                    .addClass(CartesianChartInteractiveLegend.LegendContainerClass);
                // Prepending, as legend should always be on topmost visual.
                this.element.prepend(divToPrepend);
                this.legendContainerDiv = legendContainerDiv = d3.select(divToPrepend.get(0));
            }

            // Construct the legend title and items.
            this.drawTitle(data);
            this.drawLegendItems(data);
        }

        public reset(): void {
            if (this.legendContainerDiv) {
                this.legendContainerDiv.remove();
                this.legendContainerDiv = null;
            }
        }

        public isVisible(): boolean {
            return true;
        }

        public changeOrientation(orientation: LegendPosition) {
            // Not supported
        }

        public getOrientation(): LegendPosition {
            return LegendPosition.Top;
        }

        /**
         * Draw the legend title
         */
        private drawTitle(data: LegendDataPoint[]): void {
            debug.assert(data && data.length > 0, 'data is null or empty');
            var titleDiv: D3.Selection = this.legendContainerDiv.selectAll('div.' + CartesianChartInteractiveLegend.LegendTitleClass);
            var item: D3.UpdateSelection = titleDiv.data([data[0]]);

            // Enter
            var itemEnter: D3.EnterSelection = item.enter();
            var titleDivEnter: D3.Selection = itemEnter.append('div').attr('class', CartesianChartInteractiveLegend.LegendTitleClass);
            titleDivEnter
                .filter((d: LegendDataPoint) => d.iconOnlyOnLabel)
                .append('span')
                .attr('class', CartesianChartInteractiveLegend.legendIconClass)
                .html(CartesianChartInteractiveLegend.legendPlaceSelector);
            titleDivEnter.append('span');

            // Update
            item.filter((d: LegendDataPoint) => d.iconOnlyOnLabel)
                .select('span.' + CartesianChartInteractiveLegend.legendIconClass)
                .style(CartesianChartInteractiveLegend.legendColorCss, (d: LegendDataPoint) => d.color)
            item.select('span:last-child').text((d: LegendDataPoint) => d.category);
        }

        /**
         * Draw the legend items
         */
        private drawLegendItems(data: LegendDataPoint[]): void {
            // Add Mesaures - the items of the category in the legend
            this.ensureLegendTableCreated();
            var dataPointsMatrix: LegendDataPoint[][] = CartesianChartInteractiveLegend.splitArrayToOddEven(data);
            var legendItemsContainer: D3.UpdateSelection = this.legendContainerDiv.select('tbody').selectAll('tr').data(dataPointsMatrix);

            // trs is table rows. 
            // there are two table rows.
            // the order of insertion to the legend table is:
            // Even data points got inserted into the 1st line
            // Odd data points got inserted into the 2nd line
            // ----------------------------
            // | value0 | value 2 | value 4
            // ----------------------------
            // | value1 | value 3 | 
            // ----------------------------
            // 

            // Enter
            var legendItemsEnter: D3.EnterSelection = legendItemsContainer.enter();
            var rowEnter: D3.Selection = legendItemsEnter.append('tr');
            var cellEnter: D3.Selection = rowEnter.selectAll('td')
                .data((d: LegendDataPoint[]) => d, (d: LegendDataPoint) => d.label)
                .enter()
                .append('td').attr('class', CartesianChartInteractiveLegend.LegendItem);
            var cellSpanEnter: D3.Selection = cellEnter.append('span');
            cellSpanEnter.filter((d: LegendDataPoint) => !d.iconOnlyOnLabel)
                .append('span')
                .html(CartesianChartInteractiveLegend.legendPlaceSelector)
                .attr('class', CartesianChartInteractiveLegend.legendIconClass)
                .style('color', (d: LegendDataPoint) => d.color)
                .attr('white-space', 'nowrap');
            cellSpanEnter.append('span').attr('class', CartesianChartInteractiveLegend.legendItemNameClass);
            cellSpanEnter.append('span').attr('class', CartesianChartInteractiveLegend.legendItemMeasureClass);

            // Update
            var legendCells: D3.UpdateSelection = legendItemsContainer.selectAll('td').data((d: LegendDataPoint[]) => d, (d: LegendDataPoint) => d.label);
            legendCells.select('span.' + CartesianChartInteractiveLegend.legendItemNameClass).html((d: LegendDataPoint) => powerbi.visuals.TextUtil.removeBreakingSpaces(d.label));
            legendCells.select('span.' + CartesianChartInteractiveLegend.legendItemMeasureClass).html((d: LegendDataPoint) => '&nbsp;' + d.measure);

            // Exit
            legendCells.exit().remove();
        }

        /**
         * Ensure legend table is created and set horizontal pan gestures on it
         */
        private ensureLegendTableCreated(): void {
            if (this.legendContainerDiv.select('div table').empty()) {
                var legendTable: D3.Selection = this.legendContainerDiv.append('div').append('table');
                legendTable.style('table-layout', 'fixed').append('tbody');
                // Setup Pan Gestures of the legend
                this.setPanGestureOnLegend(legendTable);
            }
        }

        /**
         * Set Horizontal Pan gesture for the legend
         */
        private setPanGestureOnLegend(legendTable: D3.Selection): void {
            var viewportWidth: number = $(this.legendContainerDiv.select('div:nth-child(2)')[0]).width();
            var xscale: D3.Scale.LinearScale = d3.scale.linear().domain([0, viewportWidth]).range([0, viewportWidth]);
            var zoom: D3.Behavior.Zoom = d3.behavior.zoom()
                .scaleExtent([1, 1]) // disable scaling
                .x(xscale)
                .on("zoom", () => {
                    // horizontal pan is valid only in case the legend items width are bigger than the viewport width
                    if ($(legendTable[0]).width() > viewportWidth) {
                        var t: number[] = zoom.translate();
                        var tx: number = t[0];
                        var ty: number = t[1];
                        tx = Math.min(tx, 0);
                        tx = Math.max(tx, viewportWidth - $(legendTable[0]).width());
                        zoom.translate([tx, ty]);
                        legendTable.style("transform", () => {
                            return SVGUtil.translateXWithPixels(tx);
                        });
                    }
                });
            legendTable.call(zoom);
        }

        /**
         * Split legend data points array into odd and even arrays
         * Even array will be the legend first line and Odd array will be the 2nd legend line 
         */
        private static splitArrayToOddEven(data: LegendDataPoint[]): LegendDataPoint[][] {
            var oddData: LegendDataPoint[] = [];
            var evenData: LegendDataPoint[] = [];
            for (var i = 0; i < data.length; ++i) {
                if (i % 2 == 0) {
                    evenData.push(data[i]);
                }
                else {
                    oddData.push(data[i]);
                }
            }
            return [evenData, oddData];
        }
    }

    export module LegendData {
        export function update(legendData: LegendData, legendObject: DataViewObject): void {
            debug.assertValue(legendData, 'legendData');
            debug.assertValue(legendObject, 'legendObject');

            if (legendObject[legendProps.show] === false)
                legendData.dataPoints = [];

            if (legendObject[legendProps.showTitle] === false)
                legendData.title = "";
            else if (legendObject[legendProps.titleText]) {
                legendData.title = <string>legendObject[legendProps.titleText];
            }
        }
    }
}
