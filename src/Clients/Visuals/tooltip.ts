//-----------------------------------------------------------------------
// <copyright company='Microsoft Corporation'>
//        Copyright (c) Microsoft Corporation.  All rights reserved. 
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {

    import TouchUtils = powerbi.visuals.controls.TouchUtils;

    export interface TooltipDataItem {
        displayName: string;
        value: string;
    }

    export interface TooltipOptions {
        opacity: number;
        animationDuration: number;
        offsetX: number;
        offsetY: number;
    }

    export interface TooltipEnabledDataPoint {
        tooltipInfo?: TooltipDataItem[];
    }

    export interface TooltipCategoryDataItem {
        value?: any;
        metadata: DataViewMetadataColumn
    }

    export interface TooltipSeriesDataItem {
        value?: any;
        highlightedValue?: any;
        metadata: DataViewValueColumn
    }

    export interface TooltipLocalizationOptions {
        highlightedValueDisplayName: string;
    }

    enum ScreenArea {
        TopLeft,
        TopRight,
        BottomRight,
        BottomLeft
    };

    export class ToolTipComponent {

        private static DefaultTooltipOptions: TooltipOptions = {
            opacity: 1,
            animationDuration: 250,
            offsetX: 10,
            offsetY: 10
        }

        private tooltipContainer: D3.Selection;
        private isTooltipVisible: boolean = false;

        private customScreenWidth: number;
        private customScreenHeight: number;

        private static containerClassName: string = "tooltip-container";
        private static contentContainerClassName: string = "tooltip-content-container";
        private static arrowClassName: string = "arrow";
        private static tooltipRowClassName: string = "tooltip-row";
        private static tooltipTitleCellClassName: string = "tooltip-title-cell";
        private static tooltipValueCellClassName: string = "tooltip-value-cell";

        public static parentContainerSelector: string = "body";
        public static highlightedValueDisplayNameResorceKey: string = "Tooltip_HighlightedValueDisplayName";
        public static localizationOptions: TooltipLocalizationOptions;

        constructor(public tooltipOptions?: TooltipOptions) {
            if (!tooltipOptions) {
                this.tooltipOptions = ToolTipComponent.DefaultTooltipOptions;
            }
        }

        // For tests only
        public setTestScreenSize(width: number, height: number) {
            this.customScreenWidth = width;
            this.customScreenHeight = height;
        }

        public show(tooltipData: TooltipDataItem[], clickedArea: TouchUtils.Rectangle) {
            this.isTooltipVisible = true;

            if (!this.tooltipContainer) {
                this.tooltipContainer = this.createTooltipContainer();
            }

            this.setTooltipContent(tooltipData);
            
            this.tooltipContainer
                .style("visibility", "visible")
                .transition()
                .duration(0) // Cancel previous transitions
                .style("opacity", this.tooltipOptions.opacity);

            this.setPosition(clickedArea);
        }

        public move(tooltipData: TooltipDataItem[], clickedArea: TouchUtils.Rectangle) {
            if (this.isTooltipVisible) {
                if (tooltipData) {
                    this.setTooltipContent(tooltipData);
                }

                this.setPosition(clickedArea);
            }
        }

        public hide() {
            if (this.isTooltipVisible) {
                this.tooltipContainer
                    .transition()
                    .duration(this.tooltipOptions.animationDuration)
                    .style("opacity", 0)
                    .each('end', function () { this.style.visibility = "hidden"; });
            }
        }

        private createTooltipContainer(): D3.Selection {
            var container: D3.Selection = d3.select(ToolTipComponent.parentContainerSelector)
                .append("div")
                .attr("class", ToolTipComponent.containerClassName);
            
            container.append("div").attr("class", ToolTipComponent.arrowClassName);
            container.append("div").attr("class", ToolTipComponent.contentContainerClassName);

            return container;
        }

        private setTooltipContent(tooltipData: TooltipDataItem[]): void {

            var rowsSelector: string = "." + ToolTipComponent.tooltipRowClassName;
            var contentContainer = this.tooltipContainer.select("." + ToolTipComponent.contentContainerClassName);

            // Clear existing content
            contentContainer.selectAll(".tooltip-row").remove();

            var tooltipRow: D3.UpdateSelection = contentContainer.selectAll(rowsSelector).data(tooltipData);
            var newRow: D3.Selection = tooltipRow.enter().append("div").attr("class", ToolTipComponent.tooltipRowClassName);
            var newTitleCell: D3.Selection = newRow.append("div").attr("class", ToolTipComponent.tooltipTitleCellClassName);
            var newValueCell: D3.Selection = newRow.append("div").attr("class", ToolTipComponent.tooltipValueCellClassName);

            newTitleCell.text(function (d: TooltipDataItem) { return d.displayName; });
            newValueCell.text(function (d: TooltipDataItem) { return d.value; });
        }

        private getTooltipPosition(clickedArea: TouchUtils.Rectangle, clickedScreenArea: ScreenArea): TouchUtils.Point {
            var tooltipContainerBounds: ClientRect = this.tooltipContainer.node().getBoundingClientRect();
            var centerPointOffset: number = Math.floor(clickedArea.width / 2);
            var offsetX: number = 0;
            var offsetY: number = 0;
            var centerPoint: TouchUtils.Point = new TouchUtils.Point(clickedArea.x + centerPointOffset, clickedArea.y + centerPointOffset);
            var arrowOffset: number = 7;

            if (clickedScreenArea === ScreenArea.TopLeft) {
                offsetX += 3 * arrowOffset + centerPointOffset;
                offsetY -= 2 * arrowOffset + centerPointOffset;
            }
            else if (clickedScreenArea === ScreenArea.TopRight) {
                offsetX -= (2 * arrowOffset + tooltipContainerBounds.width + centerPointOffset);
                offsetY -= 2 * arrowOffset + centerPointOffset;
            }
            else if (clickedScreenArea === ScreenArea.BottomLeft) {
                offsetX += 3 * arrowOffset + centerPointOffset;
                offsetY -= (tooltipContainerBounds.height - 2 * arrowOffset + centerPointOffset);
            }
            else if (clickedScreenArea === ScreenArea.BottomRight) {
                offsetX -= (2 * arrowOffset + tooltipContainerBounds.width + centerPointOffset);
                offsetY -= (tooltipContainerBounds.height - 2 * arrowOffset + centerPointOffset);
            }

            centerPoint.offset(offsetX, offsetY);

            return centerPoint;
        }

        private setPosition(clickedArea: TouchUtils.Rectangle): void {
            var clickedScreenArea: ScreenArea = this.getClickedScreenArea(clickedArea);
            var tooltipPosition: TouchUtils.Point = this.getTooltipPosition(clickedArea, clickedScreenArea);

            this.tooltipContainer.style({ "left": tooltipPosition.x + "px", "top": tooltipPosition.y + "px" });
            this.setArrowPosition(clickedArea, clickedScreenArea);
        }

        private setArrowPosition(clickedArea: TouchUtils.Rectangle, clickedScreenArea: ScreenArea): void {
            var arrow: D3.Selection = this.getArrowElement();
            var arrowClassName: string;

            if (clickedScreenArea === ScreenArea.TopLeft) {
                arrowClassName = "top left";
            }
            else if (clickedScreenArea === ScreenArea.TopRight) {
                arrowClassName = "top right";
            }
            else if (clickedScreenArea === ScreenArea.BottomLeft) {
                arrowClassName = "bottom left";
            }
            else if (clickedScreenArea === ScreenArea.BottomRight) {
                arrowClassName = "bottom right";
            }

            arrow
                .attr('class', 'arrow') // Reset all classes
                .classed(arrowClassName, true);
        }

        private getArrowElement(): D3.Selection {
            return this.tooltipContainer.select("." + ToolTipComponent.arrowClassName);
        }

        private getClickedScreenArea(clickedArea: TouchUtils.Rectangle): ScreenArea {
            var screenWidth: number = this.customScreenWidth || window.innerWidth;
            var screenHeight: number = this.customScreenHeight || window.innerHeight;
            var centerPointOffset: number = clickedArea.width / 2;
            var centerPoint: TouchUtils.Point = new TouchUtils.Point(clickedArea.x + centerPointOffset, clickedArea.y + centerPointOffset);
            var halfWidth: number = screenWidth / 2;
            var halfHeight: number = screenHeight / 2;

            if (centerPoint.x < halfWidth && centerPoint.y < halfHeight) {
                return ScreenArea.TopLeft;
            }
            else if (centerPoint.x >= halfWidth && centerPoint.y < halfHeight) {
                return ScreenArea.TopRight;
            }
            else if (centerPoint.x < halfWidth && centerPoint.y >= halfHeight) {
                return ScreenArea.BottomLeft;
            }
            else if (centerPoint.x >= halfWidth && centerPoint.y >= halfHeight) {
                return ScreenArea.BottomRight;
            }
        }
    }

    export module TooltipManager {

        export var ShowTooltips: boolean = true;
        export var ToolTipInstance: ToolTipComponent = new ToolTipComponent();
        var GlobalTooltipEventsAttached: boolean = false;

        export function addTooltip(d3Selection: D3.Selection, getTooltipInfoDelegate: (d: any, i: number, el?: any) => TooltipDataItem[], reloadTooltipDataOnMouseMove?: boolean): void {

            if (!ShowTooltips) {
                return;
            }

            debug.assertValue(d3Selection, "d3Selection");

            var rootNode = d3.select(ToolTipComponent.parentContainerSelector).node();

            var showTooltipEventHandler = (d: any, i: number, coordinates: number[], context: any, isTouchEvent: boolean) => {
                var tooltipInfo: TooltipDataItem[] = getTooltipInfoDelegate(d, i, context);
                if (tooltipInfo) {
                    var point = new TouchUtils.Point(coordinates[0], coordinates[1]);
                    if (!isTouchEvent) {
                        point.offset(0, 0);
                    }
                    var clickedArea: TouchUtils.Rectangle = getClickedArea(coordinates[0], coordinates[1], isTouchEvent);
                    ToolTipInstance.show(tooltipInfo, clickedArea);
                }
            };

            var moveTooltipEventHandler = (d, i, coordinates, context, isTouchEvent: boolean) => {
                var tooltipInfo: TooltipDataItem[];
                if (reloadTooltipDataOnMouseMove) {
                    tooltipInfo = getTooltipInfoDelegate(d, i, context);
                }
                var clickedArea: TouchUtils.Rectangle = getClickedArea(coordinates[0], coordinates[1], isTouchEvent);
                ToolTipInstance.move(tooltipInfo, clickedArea);
            };

            var hideTooltipEventHandler = () => {
                ToolTipInstance.hide();
            };

            var tooltipTimeoutReference: number;
            var tooltipTouchDelay: number = 500;
            var touchStartEventName: string = getTouchStartEventName();
            var touchEndEventName: string = getTouchEndEventName();
            var isPointerEvent: boolean = touchStartEventName === "pointerdown" || touchStartEventName === "MSPointerDown";

            // Mouse events
            d3Selection.on("mouseover", function (d, i) {
                if (canDisplayTooltip(d3.event)) {
                    var coordinates: number[] = getCoordinates(rootNode, true);
                    showTooltipEventHandler(d, i, coordinates, this, false);
                }
            });

            d3Selection.on("mouseout", function (d, i) {
                hideTooltipEventHandler();
            });

            d3Selection.on("mousemove", function (d, i) {
                if (canDisplayTooltip(d3.event)) {
                    var coordinates: number[] = getCoordinates(rootNode, true);
                    moveTooltipEventHandler(d, i, coordinates, this, false);
                }
            });
            
            // Touch events
            if (!GlobalTooltipEventsAttached) {
                // Add root container hide tooltip event
                attachGlobalEvents(touchStartEventName);
                GlobalTooltipEventsAttached = true;
            }

            d3Selection.on(touchStartEventName, function (d, i) {
                stopEventPropogation(d3.event);
                hideTooltipEventHandler();
                var coordinates: number[] = getCoordinates(rootNode, isPointerEvent);
                tooltipTimeoutReference = setTimeout(() => showTooltipEventHandler(d, i, coordinates, this, true), tooltipTouchDelay);
            });

            d3Selection.on(touchEndEventName, function (d, i) {
                if (tooltipTimeoutReference) {
                    clearTimeout(tooltipTimeoutReference);
                }
            });
        }

        export function setLocalizedStrings(localizationOptions: TooltipLocalizationOptions): void {
            ToolTipComponent.localizationOptions = localizationOptions;
        }

        function stopEventPropogation(d3Event: D3.D3Event) {
            d3Event.preventDefault();
            d3Event.stopPropagation();
        }

        function canDisplayTooltip(d3Event: any): boolean {
            var mouseEvent: MouseEvent = <MouseEvent>d3Event;
            // Check mouse buttons state
            var hasMouseButtonPressed = mouseEvent.buttons !== 0;
            return !hasMouseButtonPressed;
        }

        function getTouchStartEventName(): string {
            var eventName: string = "touchstart";

            if (window["PointerEvent"]) {
                // IE11
                eventName = "pointerdown";
            } else if (window["MSPointerEvent"]) {
                // IE10
                eventName = "MSPointerDown";
            }

            return eventName;
        }

        function getTouchEndEventName(): string {
            var eventName: string = "touchend";

            if (window["PointerEvent"]) {
                // IE11
                eventName = "pointerup";
            } else if (window["MSPointerEvent"]) {
                // IE10
                eventName = "MSPointerUp";
            }

            return eventName;
        }

        function getCoordinates(rootNode: Element, isPointerEvent: boolean): number[] {
            var coordinates: number[];

            if (isPointerEvent) {
                coordinates = d3.mouse(rootNode);
            }
            else {
                var touchCoordinates = d3.touches(rootNode);
                if (touchCoordinates && touchCoordinates.length > 0) {
                    coordinates = touchCoordinates[0];
                }
            }

            return coordinates;
        }

        function attachGlobalEvents(touchStartEventName: string): void {
            d3.select(ToolTipComponent.parentContainerSelector).on(touchStartEventName, function (d, i) {
                ToolTipInstance.hide();
            });
        }

        function getClickedArea(x: number, y: number, isTouchEvent: boolean): TouchUtils.Rectangle {
            var width: number = 0;
            var pointX: number = x;
            var pointY: number = y;

            if (isTouchEvent) {
                width = 12;
                var offset: number = width / 2;
                pointX = Math.max(x - offset, 0);
                pointY = Math.max(y - offset, 0);
            }

            return new TouchUtils.Rectangle(pointX, pointY, width, width);
        }
    }

    export module TooltipBuilder {

        // TODO: implement options bag as input parameter
        export function createTooltipInfo(
            formatStringProp: DataViewObjectPropertyIdentifier,
            categories: DataViewCategoryColumn[],
            categoryValue: any,
            values?: DataViewValueColumns,
            value?: any,
            seriesData?: TooltipSeriesDataItem[],
            seriesIndex?: number,
            highlightedValue?: any): TooltipDataItem[] {
            var categorySource: TooltipCategoryDataItem;
            var seriesSource: TooltipSeriesDataItem[] = [];
            var valuesSource: DataViewMetadataColumn = undefined;
            seriesIndex = seriesIndex | 0;
            if (categories && categories.length > 0) {
                categorySource = { value: categoryValue, metadata: categories[0].source };
            }
            if (values) {
                if (categorySource && categorySource.metadata === values.source) {
                    // Category/series on the same column -- don't repeat it value in the tooltip.
                }
                else {
                    valuesSource = values.source;
                }
            }
            if (seriesData) {
                for (var i: number = 0, len: number = seriesData.length; i < len; i++) {
                    var singleSeriesData: TooltipSeriesDataItem = seriesData[i];
                    if (categorySource && categorySource.metadata === singleSeriesData.metadata.source)
                        continue;

                    seriesSource.push({ value: singleSeriesData.value, metadata: singleSeriesData.metadata });
                }
            }
            else if (values && values.length > 0) {
                var valueColumn: DataViewValueColumn = values[seriesIndex];
                var autoGeneratedColumnMetadata: DataViewMetadataAutoGeneratedColumn = valueColumn && valueColumn.source ? <DataViewMetadataAutoGeneratedColumn>valueColumn.source : null;
                var isManuallyAddedField: boolean = autoGeneratedColumnMetadata && autoGeneratedColumnMetadata.isAutoGeneratedColumn;

                if (!isManuallyAddedField) {
                    seriesSource = [{ value: value, highlightedValue: highlightedValue, metadata: valueColumn }];
                }
            }

            var tooltipInfo: TooltipDataItem[] = createTooltipData(formatStringProp, categorySource, valuesSource, seriesSource);

            return tooltipInfo;
        }

        function createTooltipData(
            formatStringProp: DataViewObjectPropertyIdentifier,
            categoryValue: TooltipCategoryDataItem,
            valuesSource: DataViewMetadataColumn,
            seriesValues: TooltipSeriesDataItem[]): TooltipDataItem[]{

            debug.assertValue(seriesValues, "seriesSource");
            debug.assertValue(ToolTipComponent.localizationOptions, "ToolTipComponent.localizationOptions");
            debug.assertAnyValue(formatStringProp, 'formatStringProp');

            var items: TooltipDataItem[] = [];

            if (categoryValue) {
                var categoryFormattedValue: string = getFormattedValue(categoryValue.metadata, formatStringProp, categoryValue.value);
                items.push({ displayName: categoryValue.metadata.name, value: categoryFormattedValue });
            }

            if (valuesSource) {
                // Dynamic series value
                var dynamicValue: string;
                if (seriesValues.length > 0) {
                    var dynamicValueMetadata: DataViewMetadataColumn = seriesValues[0].metadata.source;
                    dynamicValue = getFormattedValue(dynamicValueMetadata, formatStringProp, dynamicValueMetadata.groupName);
                }
                items.push({ displayName: valuesSource.name, value: dynamicValue });
            }

            for (var i = 0; i < seriesValues.length; i++) {
                var seriesData = seriesValues[i];

                if (seriesData && seriesData.metadata) {
                    var seriesMetadataColumn = seriesData.metadata.source;
                    var value = seriesData.value;
                    var highlightedValue = seriesData.highlightedValue;

                    if (value || value === 0) {
                        var formattedValue: string = getFormattedValue(seriesMetadataColumn, formatStringProp, value);
                        items.push({ displayName: seriesMetadataColumn.name, value: formattedValue });
                    }

                    if (highlightedValue || highlightedValue === 0) {
                        var formattedHighlightedValue: string = getFormattedValue(seriesMetadataColumn, formatStringProp, highlightedValue);
                        var displayName = ToolTipComponent.localizationOptions.highlightedValueDisplayName;
                        items.push({ displayName: displayName, value: formattedHighlightedValue });
                    }
                }
            }

            return items;
        }

        function getFormattedValue(column: DataViewMetadataColumn, formatStringProp: DataViewObjectPropertyIdentifier, value: any) {
            var formatString: string = getFormatStringFromColumn(column, formatStringProp);
            return valueFormatter.format(value, formatString);
        }

        function getFormatStringFromColumn(column: DataViewMetadataColumn, formatStringProp: DataViewObjectPropertyIdentifier): string {
            if (column) {
                var formatString: string = valueFormatter.getFormatString(column, formatStringProp, true);
                return formatString || column.format;
            }
            return null;
        }
    }
}