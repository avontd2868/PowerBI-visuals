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

module powerbi.visuals.controls {

    var UNSELECTABLE_CLASS_NAME = "unselectable";

    export function fire(eventHandlers, eventArgs) {
        if (eventHandlers) {
            for (var i = 0; i < eventHandlers.length; i++) {
                var h = eventHandlers[i];
                h(eventArgs);
            }
        }
    }
     
    export class ScrollbarButton {
        // Const
        // TODO: Move to style
        static MIN_WIDTH = 26;
        static ARROW_COLOR: string = "#404040";

        // Fields
        private _element: HTMLDivElement;
        private _polygon: SVGElement;
        private _svg: HTMLElement;
        private _owner: Scrollbar;
        private _direction: number;
        private _timerHandle: number;
        private _mouseUpWrapper: any;

        // Constructor
        constructor (owner: Scrollbar, direction: number) {
            this._owner = owner;
            this._direction = direction;
            this._timerHandle = undefined;
            this.createView();
            var that = this;
            this._element.addEventListener("mousedown", function (e) { that.onMouseDown(<MouseEvent>e); });
            $(this._element).addClass(UNSELECTABLE_CLASS_NAME);
            $(this._svg).addClass(UNSELECTABLE_CLASS_NAME);
            $(this._polygon).addClass(UNSELECTABLE_CLASS_NAME);
        }

        // Properties
        public get element(): HTMLDivElement {
            return this._element;
        }

        // Methods
        private createView(): void {
            var svgns = "http://www.w3.org/2000/svg";

            this._polygon = <SVGElement>document.createElementNS(svgns, "polygon");
            this._polygon.setAttributeNS(null, "points", "3,3 6,3 13,8 6,13 3,13 10,8");
            this._polygon.setAttributeNS(null, "fill", ScrollbarButton.ARROW_COLOR);

            this._svg = <HTMLElement>document.createElementNS(svgns, "svg");
            var svgStyle = this._svg.style;
            svgStyle.position = "absolute";
            svgStyle.left = "0px";
            svgStyle.top = "0px";
            this._svg.appendChild(this._polygon);

            this._element = <HTMLDivElement>document.createElement("div");
            this._element.className = Scrollbar.arrowClassName;
            this._element.appendChild(this._svg);

            this._owner.element.appendChild(this._element);
        }

        private onMouseDown(event: MouseEvent): void {
            var that = this;
            clearTimeout(this._timerHandle);
            if (!this._mouseUpWrapper) {
                event.cancelBubble = true;
                var that = this;
                this._mouseUpWrapper = function (event) { that.onMouseUp(event); };
                Scrollbar.addDocumentMouseUpEvent(this._mouseUpWrapper);
            }
            this._owner._scrollSmallIncrement(this._direction);
            this._owner.refresh();
            this._timerHandle = setTimeout(function () { that.onMouseDown(event); }, 100);
            if (event.preventDefault) {
                event.preventDefault(); // prevent dragging
            }
        }

        private onMouseUp(event: MouseEvent): void {
            clearTimeout(this._timerHandle);
            Scrollbar.removeDocumentMouseUpEvent(this._mouseUpWrapper);
            this._mouseUpWrapper = undefined;
        }

        public arrange(width: number, height: number, angle: number): void {
            var size = Math.min(width, height);
            var scale = size / 16;
            var x = (width - size) / 2;
            var y = (height - size) / 2;
            this._polygon.setAttributeNS(null, "transform", "translate(" + x + ", " + y + ") scale(" + scale + ") rotate(" + angle + ",8,8)");
            this._svg.setAttributeNS(null, "width", width + "px");
            this._svg.setAttributeNS(null, "height", height + "px");

            HTMLElementUtils.setElementWidth(this._element, width);
            HTMLElementUtils.setElementHeight(this._element, height);
        }
    }

    // Scrollbar base class
    export class Scrollbar {
        public static DefaultScrollbarWidth = "15px"; // protected
        private static ScrollbarBackgroundFirstTimeMousedownHoldDelay = 500;
        private static ScrollbarBackgroundMousedownHoldDelay = 50;

        static className = "scroll-bar-div";
        static barClassName = "scroll-bar-part-bar";
        static arrowClassName = "scroll-bar-part-arrow";

        public MIN_BAR_SIZE = 10;

        public min: number = 0;
        public max: number = 10;
        public viewMin: number = 0;
        public viewSize: number = 2;
        public smallIncrement: number = 1;

        public _onscroll: any[] = [];

        private _actualWidth: number;
        private _actualHeight: number;
        private _actualButtonWidth: number;
        private _actualButtonHeight: number;

        private _width: string;
        private _height: string;
        private _visible: boolean;

        private _element: HTMLDivElement;
        private _minButton: ScrollbarButton;
        private _maxButton: ScrollbarButton;
        private _middleBar: HTMLDivElement;

        private _timerHandle: number;
        private _screenToOffsetScale: number = 1.0;
        
        private _screenPrevMousePos: { x: number; y: number; };
        private _screenMinMousePos: number;
        private _screenMaxMousePos: number;

        private _backgroundMouseUpWrapper: any;
        private _middleBarMouseMoveWrapper: any;
        private _middleBarMouseUpWrapper: any;

        // Touch memmbers
        private _touchPanel: HTMLElement;
        private _offsetTouchStartPos: { x: number; y: number; };
        private _offsetTouchPrevPos: { x: number; y: number; };
        private _touchStarted: boolean;
        private _allowMouseDrag: boolean;

        constructor (parentElement: HTMLElement) {
            this.createView(parentElement);
            var that = this;
            this._element.addEventListener("mousedown", function (e) { that.onBackgroundMouseDown(<MouseEvent>e); });
            this._middleBar.addEventListener("mousedown", function (e) { that.onMiddleBarMouseDown(<MouseEvent>e); });
            this._timerHandle = undefined;
            this._visible = true;
            this.element["winControl"] = this;
            $(this._touchPanel).addClass(UNSELECTABLE_CLASS_NAME);
        }

        public scrollBy(delta: number) {
            this.scrollTo(this.viewMin + delta);
        }

        public scrollUp(): void {
            this.scrollBy(-this.smallIncrement);
        }

        public scrollDown(): void {
            this.scrollBy(this.smallIncrement);
        }

        public scrollPageUp(): void {
            this.scrollBy(-this.viewSize);
        }

        public scrollPageDown(): void {
            this.scrollBy(this.viewSize);
        }

        public set width(value: string) {
            this._width = value;
            this._element.style.width = value;
            this.invalidateArrange();
        }

        public get width(): string {
            return this._width;
        }

        public set height(value: string) {
            this._height = value;
            this._element.style.height = value;
            this.invalidateArrange();
        }

        public get height(): string {
            return this._height;
        }

        public refresh(): void {
            debug.assertFail("PureVirtualMethod: Scrollbar.refresh()");
        }

        public get element(): HTMLDivElement {
            return this._element;
        }

        public get maxButton(): ScrollbarButton {
            return this._maxButton;
        }

        public get middleBar(): HTMLDivElement {
            return this._middleBar;
        }

        public _scrollSmallIncrement(direction): void {  // intent to be internal
            this.scrollBy(this.smallIncrement * direction);
        }

        public get visible(): boolean {
            return this._visible;
        }

        public get isInMouseCapture(): boolean {
            return this._timerHandle !== undefined;
        }

        public show(value: boolean): void {
            this._visible = value;
            this.element.style.visibility = value ? "visible" : "hidden";
            this.invalidateArrange();
        }

        public _getMouseOffset(event: MouseEvent): { x: number; y: number; } { // protected
            if (event.offsetX !== undefined)
                return { x: event.offsetX, y: event.offsetY };
            if (event.layerX !== undefined)
                return { x: event.layerX, y: event.layerY };
            return { x: event.screenX, y: event.screenY };
        }

        public _getOffsetXDelta(event: MouseEvent): number { // protected
            return (event.screenX - this._screenPrevMousePos.x) / this._screenToOffsetScale;
        }

        public _getOffsetYDelta(event: MouseEvent): number { // protected
            return (event.screenY - this._screenPrevMousePos.y) / this._screenToOffsetScale;
        }

        public _getOffsetXTouchDelta(event: MouseEvent): number { // protected
            return this._getMouseOffset(event).x - this._offsetTouchPrevPos.x;
        }

        public _getOffsetYTouchDelta(event: MouseEvent): number { // protected
            return this._getMouseOffset(event).y - this._offsetTouchPrevPos.y;
        }

        public initTouch(panel: HTMLElement, allowMouseDrag?: boolean): void {
            this._touchPanel = panel;
            this._allowMouseDrag = allowMouseDrag === undefined ? true : allowMouseDrag;
            if ("ontouchmove" in panel) {
                panel.addEventListener("touchstart", e => this.onTouchStart(e));
                panel.addEventListener("touchmove", e => this.onTouchMove(e));
                panel.addEventListener("touchend", e => this.onTouchEnd(e));
            }
            else {
                panel.addEventListener("mousedown", e => this.onTouchMouseDown(<MouseEvent>e));
                panel.addEventListener("mousemove", e => this.onTouchMouseMove(<MouseEvent>e));
                panel.addEventListener("mouseup", e => this.onTouchMouseUp(<MouseEvent>e));
            }
        }

        public onTouchStart(e: any) {
            if (e.touches.length === 1) {
                this.onTouchMouseDown(e.touches[0]);
            }
        }

        public onTouchMove(e: any) {
            if (e.touches.length === 1) {
                if (e.preventDefault)
                    e.preventDefault();
                this.onTouchMouseMove(e.touches[0]);
            }
        }

        public onTouchEnd(e: any) {
            this.onTouchMouseUp(e.touches.length === 1 ? e.touches[0] : e, true);
        }

        public onTouchMouseDown(e: MouseEvent) {
            // except IE touch cancels mouse so not need for detection. For IE touch and mouse difference is detected by a flag.
            if (!this._allowMouseDrag &&
                e["pointerType"] === MSPointerEvent.MSPOINTER_TYPE_MOUSE) {
                return;
            }
            if ("setCapture" in this._touchPanel) {
                 this._touchPanel.setCapture(true);
            }
            this._offsetTouchPrevPos = this._offsetTouchStartPos = null; 
            this._touchStarted = true;
        }

        public _getOffsetTouchDelta(e: MouseEvent): number {
            debug.assertFail("PureVirtualMethod: Scrollbar._getOffsetTouchDelta()");
            return null;
        }

        public onTouchMouseMove(e: MouseEvent) {
            if (this._touchStarted) {
                if (!this._offsetTouchStartPos) {
                    this._offsetTouchPrevPos = this._offsetTouchStartPos = this._getMouseOffset(e);
                }

                var delta = this._getOffsetTouchDelta(e);
                if (delta !== 0) {
                    this.scrollBy(-delta / this._getRunningSize(false) * this.viewSize);
                    this._offsetTouchPrevPos = this._getMouseOffset(e);
                }
                if (e.preventDefault)
                    e.preventDefault();

                e.cancelBubble = true;
            }
        }

        public onTouchMouseUp(e: MouseEvent, bubble?: boolean) {
            if (this._touchStarted) {
                if (this._offsetTouchStartPos) {
                    var end = this._getMouseOffset(e);
                    if (!bubble && (Math.abs(this._offsetTouchStartPos.x - end.x) > 3 || Math.abs(this._offsetTouchStartPos.y - end.y) > 3)) {
                        if (e.preventDefault)
                            e.preventDefault();

                        e.cancelBubble = true;
                    }
                }
            }
            if ("releaseCapture" in this._touchPanel) {
                this._touchPanel.releaseCapture();
            }
            this._touchStarted = false;
        }

        public registerElementForMouseWheelScrolling(element: HTMLElement): void {
            element.addEventListener("mousewheel", (e) => { this.onMouseWheel(<MouseWheelEvent>e); });
            element.addEventListener("DOMMouseScroll", (e) => { this.onFireFoxMouseWheel(<MouseWheelEvent>e); });
        }

        private createView(parentElement: HTMLElement): void {
            this._element = <HTMLDivElement>document.createElement("div");
            this._element.className = Scrollbar.className;
            this._element.setAttribute("drag-resize-disabled", "true");
            parentElement.appendChild(this._element);

            this._minButton = new ScrollbarButton(this, -1);
            this._maxButton = new ScrollbarButton(this, 1);

            this._middleBar = <HTMLDivElement>document.createElement("div");
            this._middleBar.className = Scrollbar.barClassName;
            this._element.appendChild(this._middleBar);
        }

        private scrollTo(pos: number): void {
            var viewMin = Math.min(this.max - this.viewSize, Math.max(this.min, pos));
            if (viewMin !== this.viewMin) {
                this.viewMin = viewMin;
                fire(this._onscroll, null);
            }
        }

        public _scrollByPage(event: MouseEvent): void {
            debug.assertFail("PureVirtualMethod: Scrollbar._scrollByPage()");
        }

        public _getRunningSize(net: boolean): number {
            debug.assertFail("PureVirtualMethod: Scrollbar._getRunningSize()");
            return null;
        }

        public _getOffsetDelta(event: MouseEvent): number {
            debug.assertFail("PureVirtualMethod: Scrollbar._getOffsetDelta()");
            return null;
        }

        private scroll(event: MouseEvent): void {
            var delta: number = this._getOffsetDelta(event) / this._getRunningSize(true) * (this.max - this.min);

            if (delta < 0) {
                if (this._getScreenMousePos(event) >= this._screenMaxMousePos) {
                    return;
                }
            }
            else if (delta > 0) {
                if (this._getScreenMousePos(event) <= this._screenMinMousePos) {
                    return;
                }
            }

            this.scrollBy(delta);
        }

        public get actualWidth(): number {
            if (this._actualWidth === undefined) {
                this.arrange();
            }
            return this._actualWidth;
        }

        public get actualHeight(): number {
            if (!this._actualHeight === undefined) {
                this.arrange();
            }
            return this._actualHeight;
        }

        public get actualButtonWidth(): number {
            if (!this._actualButtonWidth === undefined) {
                this.arrange();
            }
            return this._actualButtonWidth;
        }

        public get actualButtonHeight(): number {
            if (!this._actualButtonHeight === undefined) {
                this.arrange();
            }
            return this._actualButtonHeight;
        }

        public arrange(): void {
            if (!this._actualWidth) {
                this._actualWidth = this._element.offsetWidth;
                this._actualHeight = this._element.offsetHeight;
                this._actualButtonWidth = this._calculateButtonWidth();
                this._actualButtonHeight = this._calculateButtonHeight();
                this._minButton.arrange(this._actualButtonWidth, this._actualButtonHeight, this._getMinButtonAngle());
                this._maxButton.arrange(this._actualButtonWidth, this._actualButtonHeight, this._getMaxButtonAngle());
                this._setMaxButtonPosition();
            }
        }

        public _calculateButtonWidth(): number {
            debug.assertFail("PureVirtualMethod: Scrollbar._calculateButtonWidth()");
            return null;
        }

        public _calculateButtonHeight(): number {
            debug.assertFail("PureVirtualMethod: Scrollbar._calculateButtonHeight()");
            return null;
        }

        public _getMinButtonAngle(): number {
            debug.assertFail("PureVirtualMethod: Scrollbar._getMinButtonAngle()");
            return null;
        }

        public _getMaxButtonAngle(): number {
            debug.assertFail("PureVirtualMethod: Scrollbar._getMaxButtonAngle()");
            return null;
        }

        public _setMaxButtonPosition() {
            debug.assertFail("PureVirtualMethod: Scrollbar._setMaxButtonPosition()");
        }

        public invalidateArrange() {
            this._actualWidth = undefined;
            this._actualHeight = undefined;
            this._actualButtonWidth = undefined;
            this._actualButtonHeight = undefined;
        }
        
        private onHoldBackgroundMouseDown(event: MouseEvent): void {
            var holdDelay = this._timerHandle ? 
                            Scrollbar.ScrollbarBackgroundMousedownHoldDelay :
                            Scrollbar.ScrollbarBackgroundFirstTimeMousedownHoldDelay;
            this._timerHandle = setTimeout(() => {
                this.onBackgroundMouseDown(event);
            }, holdDelay);
        }

        private onBackgroundMouseDown(event: MouseEvent): void {
            var that = this;
            clearTimeout(this._timerHandle);
            if (!this._backgroundMouseUpWrapper) {
                event.cancelBubble = true;
                this._backgroundMouseUpWrapper = function (event) { that.onBackgroundMouseUp(event); };
                Scrollbar.addDocumentMouseUpEvent(this._backgroundMouseUpWrapper);
            }
            this._scrollByPage(event);
            this.refresh();
            this.onHoldBackgroundMouseDown(event);
            if (event.preventDefault)
                event.preventDefault(); // prevent dragging
        }

        private onBackgroundMouseUp(event: MouseEvent): void {
            clearTimeout(this._timerHandle);
            this._timerHandle = undefined;
            Scrollbar.removeDocumentMouseUpEvent(this._backgroundMouseUpWrapper);
            this._backgroundMouseUpWrapper = undefined;
        }

        private getPinchZoomY(): number {
            return document.documentElement.clientHeight / window.innerHeight;
        }

        private onMiddleBarMouseDown(event: MouseEvent): void {
            event.cancelBubble = true;
            this._screenPrevMousePos = { x: event.screenX, y: event.screenY };
            this._screenMinMousePos = this._getScreenMousePos(event) - (this._getScreenContextualLeft(this._middleBar) - this._getScreenContextualRight(this._minButton.element));
            this._screenMaxMousePos = this._getScreenMousePos(event) + (this._getScreenContextualLeft(this._maxButton.element) - this._getScreenContextualRight(this._middleBar));
            this._screenToOffsetScale = HTMLElementUtils.getAccumulatedScale(this.element) * this.getPinchZoomY();
            var that = this;
            this._middleBarMouseMoveWrapper = function (e) { that.onMiddleBarMouseMove(e); };
            Scrollbar.addDocumentMouseMoveEvent(this._middleBarMouseMoveWrapper);
            this._middleBarMouseUpWrapper = function (e) { that.onMiddleBarMouseUp(e); };
            Scrollbar.addDocumentMouseUpEvent(this._middleBarMouseUpWrapper);
            if (event.preventDefault)
                event.preventDefault(); // prevent dragging
        }

        private onMiddleBarMouseMove(event: MouseEvent): void {
            if (!this._screenPrevMousePos) {
                return;
            }
            this.scroll(event);
            this.refresh();
            this._screenPrevMousePos = { x: event.screenX, y: event.screenY };
        }

        private onMiddleBarMouseUp(event: MouseEvent): void {
            this._screenPrevMousePos = undefined;
            Scrollbar.removeDocumentMouseMoveEvent(this._middleBarMouseMoveWrapper);
            this._middleBarMouseMoveWrapper = undefined;
            Scrollbar.removeDocumentMouseUpEvent(this._middleBarMouseUpWrapper);
            this._middleBarMouseUpWrapper = undefined;
            if (event.preventDefault)
                event.preventDefault(); // prevent other events
        }

        public _getScreenContextualLeft(element: HTMLElement): number {
            debug.assertFail("PureVirtualMethod: Scrollbar._getScreenContextualLeft()");
            return null;
        }

        public _getScreenContextualRight(element: HTMLElement): number {
            debug.assertFail("PureVirtualMethod: Scrollbar._getScreenContextualRight()");
            return null;
        }

        private onMouseWheel(e: MouseWheelEvent): void {
            if (e.wheelDelta) {
                this.mouseWheel(e.wheelDelta);
            }
        }

        private onFireFoxMouseWheel(e: MouseWheelEvent): void {
            if (e.detail) {
                this.mouseWheel(-e.detail);
            }
        }

        private mouseWheel(delta: number): void {
            if (this.visible) {
                this.scrollBy(-delta / 120 * this.smallIncrement);
            }
        }

        public _getScreenMousePos(event: MouseEvent) {
            debug.assertFail("PureVirtualMethod: Scrollbar._getScreenMousePos()");
            return null;
        }

        static addDocumentMouseUpEvent(func: any): void {
            document.addEventListener("mouseup", func);
        }

        static removeDocumentMouseUpEvent(func: any): void {
            document.removeEventListener("mouseup", func);
        }

        static addDocumentMouseMoveEvent(func): void {
            document.addEventListener("mousemove", func);
        }

        static removeDocumentMouseMoveEvent(func): void {
            document.removeEventListener("mousemove", func);
        }
    }

    // Horizontal Scrollbar
    export class HorizontalScrollbar extends Scrollbar {
        constructor (parentElement: HTMLElement) {
            super(parentElement);
            this.height = Scrollbar.DefaultScrollbarWidth;
        }

        public _calculateButtonWidth() {
            return Math.min(this.actualWidth / 2, Math.max(this.actualHeight, ScrollbarButton.MIN_WIDTH));
        }

        public _calculateButtonHeight() {
            return this.actualHeight;
        }

        public _getMinButtonAngle(): number {
            return -180;
        }

        public _getMaxButtonAngle(): number {
            return 0;
        }

        public _setMaxButtonPosition() {
            HTMLElementUtils.setElementLeft(this.maxButton.element, this.actualWidth - this.actualButtonWidth);
        }

        public refresh(): void {
            this.arrange();
            var runningSize = this.actualWidth - this.actualButtonWidth * 2 - 2;
            var barSize = this.viewSize / (this.max - this.min) * runningSize;
            if (barSize < this.MIN_BAR_SIZE) {
                runningSize -= this.MIN_BAR_SIZE - barSize;
                barSize = this.MIN_BAR_SIZE;
            }
            if (runningSize < 0) {
                runningSize = 0;
                barSize = 0;
            }
            barSize = Math.min(barSize, runningSize);
            var barPos = this.viewMin / (this.max - this.min) * runningSize;
            HTMLElementUtils.setElementWidth(this.middleBar, barSize);
            HTMLElementUtils.setElementHeight(this.middleBar, this.actualHeight);
            HTMLElementUtils.setElementLeft(this.middleBar, this.actualButtonWidth + 1 + barPos);
        }

        public show(visible: boolean): void {
            if (visible === this.visible)
                return;

            super.show(visible);
            if (visible) {
                this.element.style.height = this.height;
            }
            else {
                HTMLElementUtils.setElementHeight(this.element, 0);
            }
        }

        public _scrollByPage(event: MouseEvent): void {
            var left = this.middleBar.offsetLeft;
            var right = left + this.middleBar.offsetWidth;
            var x = (event.offsetX === undefined) ? event.layerX : event.offsetX;
            if (x > right) {
                this.scrollPageDown();
            } else if (x < left) {
                this.scrollPageUp();
            }
        }
                    
        public _getRunningSize(net: boolean): number {
            var result = this.actualWidth;
            if (net) {
                var barMinPos = this.actualButtonWidth + 1;
                result -= barMinPos * 2;
                var barSize = result * (this.viewSize / (this.max - this.min));
                if (barSize < this.MIN_BAR_SIZE)
                    result -= this.MIN_BAR_SIZE - barSize;
            }
            return result;
        }

        public _getOffsetDelta(event: MouseEvent): number {
            return this._getOffsetXDelta(event);
        }

        public _getOffsetTouchDelta(e: MouseEvent): number {
            return this._getOffsetXTouchDelta(e);
        }

        public _getScreenContextualLeft(element: HTMLElement): number {
            return element.getBoundingClientRect().left;
        }

        public _getScreenContextualRight(element: HTMLElement): number {
            return element.getBoundingClientRect().right;
        }

        public _getScreenMousePos(event: MouseEvent) {
            return event.screenX;
        }
    }

    // Vertical Scrollbar
    export class VerticalScrollbar extends Scrollbar {
        constructor (parentElement: HTMLElement) {
            super(parentElement);
            this.width = Scrollbar.DefaultScrollbarWidth;
        }

        public _calculateButtonWidth() {
            return this.actualWidth;
        }

        public _calculateButtonHeight() {
            return Math.min(this.actualHeight / 2, Math.max(this.actualWidth, ScrollbarButton.MIN_WIDTH));
        }

        public _getMinButtonAngle(): number {
            return -90;
        }

        public _getMaxButtonAngle(): number {
            return 90;
        }

        public _setMaxButtonPosition() {
            HTMLElementUtils.setElementTop(this.maxButton.element, this.actualHeight - this.actualButtonHeight);
        }

        public refresh(): void {
            this.arrange();
            var runningSize = this.actualHeight - this.actualButtonHeight * 2 - 2;
            var barSize = this.viewSize / (this.max - this.min) * runningSize;
            if (barSize < this.MIN_BAR_SIZE) {
                runningSize -= this.MIN_BAR_SIZE - barSize;
                barSize = this.MIN_BAR_SIZE;
            }
            if (runningSize < 0) {
                runningSize = 0;
                barSize = 0;
            }
            var barPos = this.viewMin / (this.max - this.min) * runningSize;
            HTMLElementUtils.setElementWidth(this.middleBar, this.actualWidth);
            HTMLElementUtils.setElementHeight(this.middleBar, barSize);
            HTMLElementUtils.setElementTop(this.middleBar, this.actualButtonHeight + 1 + barPos);
        }

        public show(visible: boolean): void {
            if (visible === this.visible)
                return;

            super.show(visible);
            if (visible) {
                this.element.style.width = this.width;
            }
            else {
                HTMLElementUtils.setElementWidth(this.element, 0);
            }
        }

        public _scrollByPage(event: MouseEvent): void {
            var top = this.middleBar.offsetTop;
            var bottom = top + this.middleBar.offsetHeight;
            var y = (event.offsetY === undefined) ? event.layerY : event.offsetY;
            if (y > bottom) {
                this.scrollPageDown();
            } else if (y < top) {
                this.scrollPageUp();
            }
        }
                
        public _getRunningSize(net: boolean): number {
            var result = this.actualHeight;
            if (net) {
                var barMinPos = this.actualButtonHeight + 1;
                result -= barMinPos * 2;
                var barSize = result * (this.viewSize / (this.max - this.min));
                if (barSize < this.MIN_BAR_SIZE)
                    result -= this.MIN_BAR_SIZE - barSize;
            }
            return result;
        }

        public _getOffsetDelta(event: MouseEvent): number {
            return this._getOffsetYDelta(event);
        }

        public _getOffsetTouchDelta(e: MouseEvent): number {
            return this._getOffsetYTouchDelta(e);
        }

        public _getScreenContextualLeft(element: HTMLElement): number {
            return element.getBoundingClientRect().top;
        }

        public _getScreenContextualRight(element: HTMLElement): number {
            return element.getBoundingClientRect().bottom;
        }

        public _getScreenMousePos(event: MouseEvent) {
            return event.screenY;
        }
    }
}