//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals.controls.TouchUtils {

    export class Point {
        public x: number;
        public y: number;

        constructor(x?: number, y?: number) {
            this.x = x || 0;
            this.y = y || 0;
        }

        public offset(offsetX: number, offsetY: number) {
            this.x += offsetX;
            this.y += offsetY;
        }
    }

    export class Rectangle extends Point {
        public width: number;
        public height: number;

        constructor(x?: number, y?: number, width?: number, height?: number) {
            super(x, y);
            this.width = width || 0;
            this.height = height || 0;
        }

        get point(): Point {
            return new Point(this.x, this.y);
        }

        public contains(p: Point): boolean {
            return Rectangle.contains(this, p);
        }

        public static contains(rect: Rectangle, p: Point): boolean {
            if (p && !Rectangle.isEmpty(rect)) {
                return rect.x <= p.x && p.x < rect.x + rect.width && rect.y <= p.y && p.y < rect.y + rect.height;
            }
            return false;
        }

        public static isEmpty(rect: Rectangle): boolean {
            return !(rect !== undefined && rect.width >= 0 && rect.height >= 0);
        }
    }

    export enum SwipeDirection {
        /** Vertical: swipe gesture moves along the y-axis at an angle within an established threshold*/
        Vertical,
        /** Horizontal: swipe gesture moves along the x-axis at an angle within an established threshold*/
        Horizontal,
        /** FreeForm: swipe gesture does not stay within the thresholds of either x or y-axis*/
        FreeForm
    }

    export enum MouseButton {
        NoClick = 0,
        LeftClick = 1,
        RightClick = 2,
        CenterClick = 3
    }

    /** 
    *   Interface serves as a way to convert pixel point to any needed unit of
    *   positioning over two axises such as row/column positioning.
    */
    export interface IPixelToItem {

        getPixelToItem(x: number, y: number, dx: number, dy: number, down: boolean): TouchEvent;
    }

    /**
    *   Interface for listening to a simple touch event that's abstracted away
    *   from any platform specific traits.
    */
    export interface ITouchHandler {
        touchEvent(e: TouchEvent): void;
    }

    /** 
    *   A simple touch event class that's abstracted away from any platform specific traits.
    */
    export class TouchEvent {
        /** _x: x-axis (not neccessarily in pixels (see IPixelToItem)) */
        private _x: number;
        /** _y: y-axis (not neccessarily in pixels (see IPixelToItem)) */
        private _y: number;
        /** _dx: delta of x-axis (not neccessarily in pixels (see IPixelToItem)) */
        private _dx: number;
        /** _dy: delta of y-axis (not neccessarily in pixels (see IPixelToItem)) */
        private _dy: number;
        /** _isMouseDown: determines if the mouse button is pressed*/
        private _isMouseDown: boolean;

        /** 
        * @param x: X location of mouse.
        * @param y: Y location of mouse.
        * @param isMouseDown: indicates if the mouse button is held down or a finger press on screen.
        * @param dx: (optional) the change in x of the gesture.
        * @param dy: (optional) the change in y of the gesture.
        */
        constructor(x: number, y: number, isMouseDown: boolean, dx?: number, dy?: number) {
            this._x = x;
            this._y = y;
            this._isMouseDown = isMouseDown;
            this._dx = dx || 0;
            this._dy = dy || 0;
        }

        public get x(): number {
            return this._x;
        }

        public get y(): number {
            return this._y;
        }

        public get dx(): number {
            return this._dx;
        }

        public get dy(): number {
            return this._dy;
        }

        /**
        * @return: returns a boolean indicating if the mouse button is held down.
        */
        public get isMouseDown(): boolean {
            return this._isMouseDown;
        }
    }

    /**
    *   This interface defines the datamembers stored for each touch region.
    */
    export interface ITouchHandlerSet {
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
    export class TouchManager {
        /** _touchList: list of touch regions and their correlating data memebers */
        private _touchList: ITouchHandlerSet[];
        /** _scrollThreshold: boolean to enable thresholds for fixing to an axis when scrolling*/
        private _scrollThreshold: boolean;
        /** _lockThreshold: boolean to enable locking to an axis when gesture is fixed to an axis*/
        private _lockThreshold: boolean;
        /** _swipeDirection: the current direction of the swipe*/
        private _swipeDirection: SwipeDirection;
        /** _matchingDirectionCount: the count of consecutive events match the current swipe direction*/
        private _matchingDirectionCount: number;
        /** _lastEvent: the last recieved mouse event*/
        private _lastEvent: TouchEvent;

        /**
        * The default behavior is to enable thresholds and lock to axis.
        */
        constructor() {
            this._touchList = [];
            this._swipeDirection = SwipeDirection.FreeForm;
            this._matchingDirectionCount = 0;

            this._lockThreshold = true;
            this._scrollThreshold = true;
            this._lastEvent = new TouchEvent(0, 0, false);
        }

        public get lastEvent(): TouchEvent {
            return this._lastEvent;
        }

        /**
        * @param region: rectangle indicating the locations of the touch region.
        * @param handler: handler for recieved touch events.
        * @param converter: converts from pixels to the wanted item of measure (rows, columns, etc).
        *                   EXAMPLE: dx -> from # of pixels to the right to # of columns moved to the right
        */
        public addTouchRegion(region: Rectangle, handler: ITouchHandler, converter: IPixelToItem): void {
            var item: ITouchHandlerSet = <ITouchHandlerSet> {
                lastPoint: new TouchEvent(0, 0, false),
                handler: handler,
                region: region,
                converter: converter
            };

            this._touchList = this._touchList.concat([item]);
        }

        /**
        * Sends a mouse up event to all regions with their last event as a mouse down event.
        */
        public upAllTouches(): void {
            var eventPoint: TouchEvent;
            var length: number;

            length = this._touchList.length;
            for (var i = 0; i < length; i++) {
                if (this._touchList[i].lastPoint.isMouseDown) {
                    eventPoint = this._touchList[i].converter.getPixelToItem(this._touchList[i].lastPoint.x,
                                                                             this._touchList[i].lastPoint.y,
                                                                             0, 0, false);
                    this._touchList[i].handler.touchEvent(eventPoint);
                }

                this._touchList[i].lastPoint = new TouchEvent(this._touchList[i].lastPoint.x,
                                                           this._touchList[i].lastPoint.y, false);
            }

            this._lastEvent = new TouchEvent(0, 0, false);
        }

        public touchEvent(e: TouchEvent): void {
            var list: ITouchHandlerSet[];
            var length: number;

            var x: number = 0;
            var y: number = 0;
            var dx: number = 0;
            var dy: number = 0;
            var angle: number = 0;

            var eventPoint: TouchEvent = null;

            //assume there are already regions in the middle of a drag event and get those regions
            list = this._getActive();

            //if this is the start of a mouse drag event, repopulate the list with touched regions
            if (!this._lastEvent.isMouseDown && e.isMouseDown) {
                list = this._findRegions(e);
            }

            //determine the delta values and update last event (delta ignored on first mouse down event)
            dx = this._lastEvent.x - e.x;
            dy = this._lastEvent.y - e.y;
            this._lastEvent = new TouchEvent(e.x, e.y, e.isMouseDown, dx, dy);

            //go through the list
            length = list.length;
            for (var i = 0; i < length; i++) {
                x = e.x - list[i].region.point.x;
                y = e.y - list[i].region.point.y;

                //is this in the middle of a drag?
                if (list[i].lastPoint.isMouseDown && e.isMouseDown) {
                    dx = x - list[i].lastPoint.x;
                    dy = y - list[i].lastPoint.y;

                    //calculate the absolute angle from the horizontal axis
                    angle = Math.abs(180 / Math.PI * Math.atan(dy / dx));

                    if (this._scrollThreshold) {
                        //is the gesture already locked? (6 prior events within the threshold)
                        if (this._lockThreshold && (this._matchingDirectionCount > 5)) {
                            if (this._swipeDirection === SwipeDirection.Horizontal) {
                                dy = 0;
                            }
                            else if (this._swipeDirection === SwipeDirection.Vertical) {
                                dx = 0;
                            }
                        }
                        else {
                            //is it within the horizontal threshold?
                            if (angle < 20) {
                                dy = 0;
                                if (this._swipeDirection === SwipeDirection.Horizontal) {
                                    this._matchingDirectionCount++;
                                }
                                else {
                                    this._matchingDirectionCount = 1;
                                    this._swipeDirection = SwipeDirection.Horizontal;
                                }
                            }
                            else {
                                //calculate the absolute angle from the vertical axis
                                angle = Math.abs(180 / Math.PI * Math.atan(dx / dy));

                                //is it within the horizontal threshold?
                                if (angle < 20) {
                                    dx = 0;

                                    if (this._swipeDirection === SwipeDirection.Vertical) {
                                        this._matchingDirectionCount++;
                                    }
                                    else {
                                        this._matchingDirectionCount = 1;
                                        this._swipeDirection = SwipeDirection.Vertical;
                                    }
                                }
                                else {
                                    if (this._swipeDirection === SwipeDirection.FreeForm) {
                                        this._matchingDirectionCount++;
                                    }
                                    else {
                                        this._swipeDirection = SwipeDirection.FreeForm;
                                        this._matchingDirectionCount = 1;
                                    }
                                }
                            }
                        }
                    }
                }

                else {
                    dx = 0;
                    dy = 0;
                    this._swipeDirection = SwipeDirection.FreeForm;
                    this._matchingDirectionCount = 0;
                }

                list[i].lastPoint = new TouchEvent(x, y, e.isMouseDown, dx, dy);

                eventPoint = list[i].converter.getPixelToItem(x, y, dx, dy, e.isMouseDown);
                list[i].handler.touchEvent(eventPoint);
            }
        }

        /**
        * @param e: position of event used to find touched regions
        * @return: Returns an array of regions that contain the event point.
        */
        private _findRegions(e: TouchEvent): ITouchHandlerSet[] {
            var list: ITouchHandlerSet[] = [];
            var length: number;

            length = this._touchList.length;
            for (var i = 0; i < length; i++) {
                if (this._touchList[i].region.contains(new Point(e.x, e.y))) {
                    list = list.concat([this._touchList[i]]);
                }
            }

            return list;
        }

        /**
        * @return: Returns an array of regions that contain a mouse down event. (see ITouchHandlerSet.lastPoint)
        */
        private _getActive(): ITouchHandlerSet[] {
            var list: ITouchHandlerSet[] = [];
            var length: number;

            length = this._touchList.length;
            for (var i = 0; i < length; i++) {
                if (this._touchList[i].lastPoint.isMouseDown) {
                    list = list.concat([this._touchList[i]]);
                }
            }

            return list;
        }
    }

    /**
    *   This class is responsible for establishing connections to handle touch events
    *   and to interpret those events so they're compatible with the touch abstractions.
    *
    *   Touch events with platform specific handles should be done here.
    */
    export class TouchEventInterpreter {
        /** _touchPanel: HTML element that touch events are drawn from. */
        private _touchPanel: HTMLElement;
        /** _allowMouseDrag: boolean enabling mouse drag. */
        private _allowMouseDrag: boolean;
        /** _manager: touch events are interpreted and passed on this manager. */
        private _manager: TouchManager;
        /** _scale: see TablixLayoutManager */
        private _scale: number;
        /** _touchReferencePoint: used for mouse location when a secondary div is used along side the primary with this one being the primary. */
        private _touchReferencePoint: HTMLElement;
        /** Rectangle containing the targeted Div */
        private _rect: ClientRect;

        private _documentMouseMoveWrapper: any;
        private _documentMouseUpWrapper: any;

        constructor(manager: TouchManager) {
            this._manager = manager;
            this._allowMouseDrag = true;
            this._touchPanel = null;
            this._scale = 1;
            this._documentMouseMoveWrapper = null;
            this._documentMouseUpWrapper = null;
        }

        public initTouch(panel: HTMLElement, touchReferencePoint?: HTMLElement, allowMouseDrag?: boolean): void {
            panel.style.setProperty("-ms-touch-action", "pinch-zoom");

            this._touchReferencePoint = touchReferencePoint;

            this._touchPanel = panel;
            this._allowMouseDrag = allowMouseDrag === undefined ? true : allowMouseDrag;
            if ("ontouchmove" in panel) {
                panel.addEventListener("touchstart", e => this.onTouchStart(e));
                panel.addEventListener("touchend", e => this.onTouchEnd(e));
            }
            else
            {
                panel.addEventListener("mousedown", e => this.onTouchMouseDown(<MouseEvent>e));
                panel.addEventListener("mouseup", e => this.onTouchMouseUp(<MouseEvent>e));
            }
        }

        private getXYByClient(event: MouseEvent): Point {
            var rect: any = this._rect;
            var x: number = rect.left;
            var y: number = rect.top;

            // Fix for Safari
            if (window["scrollX"] !== undefined) {
                x += window["scrollX"];
                y += window["scrollY"];
            }

            var point: Point = new Point(0, 0);
            point.offset(event.pageX - x, event.pageY - y);

            return point;
        }

        public onTouchStart(e: any): void {
            if (e.touches.length === 1) {
                e.cancelBubble = true;
                this.onTouchMouseDown(e.touches[0]);
            }
        }

        public onTouchMove(e: any): void {
            if (e.touches.length === 1) {
                if (e.preventDefault) {
                    e.preventDefault();
                }

                this.onTouchMouseMove(e.touches[0]);
            }
        }

        public onTouchEnd(e: any): void {
            this.onTouchMouseUp(e.touches.length === 1 ? e.touches[0] : e, true);
        }

        public onTouchMouseDown(e: MouseEvent): void {
            this._scale = HTMLElementUtils.getAccumulatedScale(this._touchPanel);

            //any prior touch scrolling that produced a selection outside Tablix will prevent the next touch scroll (1262519)
            document.getSelection().removeAllRanges();

            this._rect = (this._touchReferencePoint ? this._touchReferencePoint : this._touchPanel).getBoundingClientRect();

            if ("ontouchmove" in this._touchPanel) {
                this._documentMouseMoveWrapper = e => this.onTouchMove(e);
                document.addEventListener("touchmove", this._documentMouseMoveWrapper);
                this._documentMouseUpWrapper = e => this.onTouchEnd(e);
                document.addEventListener("touchend", this._documentMouseUpWrapper);
            }
            else {
                this._documentMouseMoveWrapper = e => this.onTouchMouseMove(e);
                document.addEventListener("mousemove", this._documentMouseMoveWrapper);
                this._documentMouseUpWrapper = e => this.onTouchMouseUp(e);
                document.addEventListener("mouseup", this._documentMouseUpWrapper);
            }

            if ("setCapture" in this._touchPanel) {
                this._touchPanel.setCapture();
            }
        }
        
        public onTouchMouseMove(e: MouseEvent): void {
            var event: TouchEvent;
            var point: Point;

            var validMouseDragEvent: boolean = (this._rect !== null) && (e.which !== MouseButton.NoClick);

            // Ignore events that are not part of a drag event
            if (!validMouseDragEvent)
                return;

            point = this.getXYByClient(e);
            event = new TouchEvent(point.x / this._scale, point.y / this._scale, validMouseDragEvent);

            this._manager.touchEvent(event);

            if (e.preventDefault)
                e.preventDefault();
            else if ("returnValue" in e) //some browsers missing preventDefault() may still use this instead
                e["returnValue"] = false;
        }

        public onTouchMouseUp(e: MouseEvent, bubble?: boolean): void {
            this._rect = null;

            this._manager.upAllTouches();

            if ("releaseCapture" in this._touchPanel) {
                this._touchPanel.releaseCapture();
            }

            if (this._documentMouseMoveWrapper === null)
                return;

            if ("ontouchmove" in this._touchPanel) {
                document.removeEventListener("touchmove", this._documentMouseMoveWrapper);
                document.removeEventListener("touchend", this._documentMouseUpWrapper);
            }
            else {
                document.removeEventListener("mousemove", this._documentMouseMoveWrapper);
                document.removeEventListener("mouseup", this._documentMouseUpWrapper);
            }

            this._documentMouseMoveWrapper = null;
            this._documentMouseUpWrapper = null;
        }
    }
}