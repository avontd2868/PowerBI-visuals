//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi {

    import shapes = powerbi.visuals.shapes;

    /** Defines possible content positions.  */
    export enum ContentPositions {

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
        All =
        TopLeft |
        TopCenter |
        TopRight |
        MiddleLeft |
        MiddleCenter |
        MiddleRight |
        BottomLeft |
        BottomCenter |
        BottomRight |
        InsideCenter |
        InsideBase |
        InsideEnd |
        OutsideBase |
        OutsideEnd,
    }

    /**
    * Rectangle orientation. Rectangle orientation is used to define vertical or horizontal orientation 
    * and starting/ending side of the rectangle.
    */
    export enum RectOrientation {
        /** Rectangle with no specific orientation. */
        None,

        /** Vertical rectangle with base at the bottom. */
        VerticalBottomTop,

        /** Vertical rectangle with base at the top. */
        VerticalTopBottom,

        /** Horizontal rectangle with base at the left. */
        HorizontalLeftRight,

        /** Horizontal rectangle with base at the right. */
        HorizontalRightLeft,
    }

    /**
    * Defines if panel elements are allowed to be positioned 
    * outside of the panel boundaries.
    */
    export enum OutsidePlacement {
        /** Elements can be positioned outside of the panel. */
        Allowed,

        /** Elements can not be positioned outside of the panel. */
        Disallowed,

        /** Elements can be partially outside of the panel. */
        Partial
    }

    /**
    * Defines an interface for information needed for default label positioning. Used in DataLabelsPanel.
    * Note the question marks: none of the elements are mandatory.
    */
    export interface IDataLabelSettings {
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
    export interface IDataLabelInfo extends IDataLabelSettings {

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
        callout?: { start: shapes.IPoint; end: shapes.IPoint; };

        /** Source of the label. */
        source?: any;

        size?: shapes.ISize;
    }

    /**  Interface for label rendering. */
    export interface IDataLabelRenderer {
        renderLabelArray(labels: IArrangeGridElementInfo[]): void;
    }

    /** Interface used in internal arrange structures. */
    export interface IArrangeGridElementInfo {
        element: IDataLabelInfo;
        rect: shapes.IRect;
    }

    /**
    * Arranges label elements using the anchor point or rectangle. Collisions
    * between elements can be automatically detected and as a result elements 
    * can be repositioned or get hidden.
    */
    export class DataLabelManager {
        private _size: shapes.ISize;
        
        public movingStep: number = 3;
        public collisionDetectionEnabled: boolean = true;
        public repositionOverlapped: boolean = true;
        public hideOverlapped: boolean = true;
        public static DefaultAnchorMargin: number = 0; // For future use
        public static DefaultMaximumMovingDistance: number = 12;
        public static DefaultMinimumMovingDistance: number = 3;
        public static InflateAmount: number = 5;

        // The global settings for all labels. 
        // They can be oweridden by each label we add into the panel, because contains same properties.
        private _defaultSettings: IDataLabelSettings = {
            anchorMargin: DataLabelManager.DefaultAnchorMargin,
            anchorRectOrientation: RectOrientation.None,
            contentPosition: ContentPositions.BottomCenter,
            outsidePlacement: OutsidePlacement.Disallowed,
            maximumMovingDistance: DataLabelManager.DefaultMaximumMovingDistance,
            minimumMovingDistance: DataLabelManager.DefaultMinimumMovingDistance,
            validContentPositions: ContentPositions.BottomCenter,
            opacity: 1
        };

        /**
        * Initializes a new instance of the DataLabelsPanel class.
        * @constructor 	
        */
        constructor() {
        }

        public get defaultSettings(): IDataLabelSettings {
            return this._defaultSettings;
        }        

        /** Arranges the lables position and visibility*/
        public hideCollidedLabels(viewport: IViewport, data: any[], layout: any): void {

            this._size = { width: viewport.width, height: viewport.height };

            // Split size into a grid
            var arrangeGrid = new DataLabelArrangeGrid(this._size, data, layout);
            
            for (var i = 0, len = data.length; i < len; i++) {

                // Set default values where properties values are undefined
                var info = this.getLabelInfo(data[i]);

                info.anchorPoint = {
                    x: layout.labelLayout.x(data[i]),
                    y: layout.labelLayout.y(data[i])
                };

                var position: shapes.IRect = this.calculateContentPosition(info, info.contentPosition, data[i].size, info.anchorMargin);

                // Check if the label needs to be moved
                position = this.adjustPosition(arrangeGrid, info, position, data[i].size);

                // Only show callout lines when label was moved further away.
                if (position !== null && (info.offset > info.anchorMargin &&
                    info.contentPosition !== ContentPositions.InsideBase &&
                    info.contentPosition !== ContentPositions.InsideCenter &&
                    info.contentPosition !== ContentPositions.InsideEnd) ||
                    info.contentPosition === ContentPositions.BottomLeft ||
                    info.contentPosition === ContentPositions.BottomRight ||
                    info.contentPosition === ContentPositions.TopLeft ||
                    info.contentPosition === ContentPositions.TopRight) {
                    var startPoint = this.getCalloutPoint(position, info.contentPosition, info.anchorRectOrientation);
                    info.callout = {
                        start: startPoint,
                        end: info.anchorPoint
                    };
                } else {
                    info.callout = null;
                }

                if (DataLabelManager.isValid(position)) {
                    data[i].labelX = position.left;
                    data[i].labelY = position.top;
                    data[i].showLabel = true;

                    // Keep track of all panel elements positions.
                    arrangeGrid.add(info, position);
                }
                else data[i].showLabel = false;
            }
        }

        /**
        * Merges the label element info with the panel element info and returns correct label info.
        * @param {ILabelElementInfo} source The label info.
        * @return {ILabelElementInfo}
        */
        public getLabelInfo(source: IDataLabelInfo): IDataLabelInfo {

            var settings = this._defaultSettings;
            source.anchorMargin = source.anchorMargin !== undefined ? source.anchorMargin : settings.anchorMargin;
            source.anchorRectOrientation = source.anchorRectOrientation !== undefined ? source.anchorRectOrientation : settings.anchorRectOrientation;
            source.contentPosition = source.contentPosition !== undefined ? source.contentPosition : settings.contentPosition;
            source.maximumMovingDistance = source.maximumMovingDistance !== undefined ? source.maximumMovingDistance : settings.maximumMovingDistance;
            source.minimumMovingDistance = source.minimumMovingDistance !== undefined ? source.minimumMovingDistance : settings.minimumMovingDistance;
            source.outsidePlacement = source.outsidePlacement !== undefined ? source.outsidePlacement : settings.outsidePlacement;
            source.validContentPositions = source.validContentPositions !== undefined ? source.validContentPositions : settings.validContentPositions;
            source.opacity = source.opacity !== undefined ? source.opacity : settings.opacity;
            source.maximumMovingDistance += source.anchorMargin;
            return source;
        }

        /**
        * (Private) Calculates element position using anchor point..
        */
        private calculateContentPositionFromPoint(anchorPoint: shapes.IPoint, contentPosition: ContentPositions, contentSize: shapes.ISize, offset: number): shapes.IRect {
            var position: shapes.IPoint = { x: 0, y: 0 };
            if (anchorPoint) {

                if (anchorPoint.x !== undefined && isFinite(anchorPoint.x)) {
                    position.x = anchorPoint.x;
                    switch (contentPosition) {
                        // D3 positions the label in the middle by default.
                        // The algorithem asumed the label was positioned in right so this is why we add/substract half width
                        case ContentPositions.TopLeft:
                        case ContentPositions.MiddleLeft:
                        case ContentPositions.BottomLeft:
                            position.x -= contentSize.width / 2.0;
                            break;

                        case ContentPositions.TopRight:
                        case ContentPositions.MiddleRight:
                        case ContentPositions.BottomRight:
                            position.x += contentSize.width / 2.0;
                            break;                        
                    }
                }

                if (anchorPoint.y !== undefined && isFinite(anchorPoint.y)) {
                    position.y = anchorPoint.y;
                    switch (contentPosition) {
                        case ContentPositions.MiddleLeft:
                        case ContentPositions.MiddleCenter:
                        case ContentPositions.MiddleRight:
                            position.y -= contentSize.height / 2.0;
                            break;
                        case ContentPositions.TopRight:
                        case ContentPositions.TopLeft:
                        case ContentPositions.TopCenter:
                            position.y -= contentSize.height;
                            break;
                    }
                }

                if (offset !== undefined && isFinite(offset)) {
                    switch (contentPosition) {
                        case ContentPositions.TopLeft:
                            position.x -= offset;
                            position.y -= offset;
                            break;
                        case ContentPositions.MiddleLeft:
                            position.x -= offset;
                            break;
                        case ContentPositions.BottomLeft:
                            position.x -= offset;
                            position.y += offset;
                            break;
                        case ContentPositions.TopCenter:
                            position.y -= offset;
                            break;
                        case ContentPositions.MiddleCenter:
                            // Offset is not applied
                            break;
                        case ContentPositions.BottomCenter:
                            position.y += offset;
                            break;
                        case ContentPositions.TopRight:
                            position.x += offset;
                            position.y -= offset;
                            break;
                        case ContentPositions.MiddleRight:
                            position.x += offset;
                            break;
                        case ContentPositions.BottomRight:
                            position.x += offset;
                            position.y += offset;
                            break;
                        default:
                            debug.assertFail("Unsupported content position.");
                            break;
                    }
                }
            }
            return { left: position.x, top: position.y, width: contentSize.width, height: contentSize.height };
        }

        /** (Private) Calculates element position using anchor rect. */
        private calculateContentPositionFromRect(anchorRect: shapes.IRect, anchorRectOrientation: RectOrientation, contentPosition: ContentPositions, contentSize: shapes.ISize, offset: number): shapes.IRect {

            switch (contentPosition) {
                case ContentPositions.InsideCenter:
                    return this.handleInsideCenterPosition(anchorRectOrientation, contentSize, anchorRect, offset);
                case ContentPositions.InsideEnd:
                    return this.handleInsideEndPosition(anchorRectOrientation, contentSize, anchorRect, offset);
                case ContentPositions.InsideBase:
                    return this.handleInsideBasePosition(anchorRectOrientation, contentSize, anchorRect, offset);
                case ContentPositions.OutsideEnd:
                    return this.handleOutsideEndPosition(anchorRectOrientation, contentSize, anchorRect, offset);
                case ContentPositions.OutsideBase:
                    return this.handleOutsideBasePosition(anchorRectOrientation, contentSize, anchorRect, offset);
                default:
                    debug.assertFail("Unsupported ContentPosition.");
            }

            return { left: 0, top: 0, width: -1, height: -1 };
        }

        /** (Private) Calculates element inside center position using anchor rect. */
        private handleInsideCenterPosition(anchorRectOrientation: RectOrientation, contentSize: shapes.ISize, anchorRect: shapes.IRect, offset: number): shapes.IRect {
            switch (anchorRectOrientation) {
                case RectOrientation.VerticalBottomTop:
                case RectOrientation.VerticalTopBottom:
                    return LocationConverter.middleVertical(contentSize, anchorRect, offset);
                case RectOrientation.HorizontalLeftRight:
                case RectOrientation.HorizontalRightLeft:
                default:
                    return LocationConverter.middleHorizontal(contentSize, anchorRect, offset);
            }
        }

        /** (Private) Calculates element inside end position using anchor rect. */
        private handleInsideEndPosition(anchorRectOrientation: RectOrientation, contentSize: shapes.ISize, anchorRect: shapes.IRect, offset: number): shapes.IRect {
            switch (anchorRectOrientation) {
                case RectOrientation.VerticalBottomTop:
                    return LocationConverter.topInside(contentSize, anchorRect, offset);
                case RectOrientation.VerticalTopBottom:
                    return LocationConverter.bottomInside(contentSize, anchorRect, offset);
                case RectOrientation.HorizontalRightLeft:
                    return LocationConverter.leftInside(contentSize, anchorRect, offset);
                case RectOrientation.HorizontalLeftRight:
                default:
                    return LocationConverter.rightInside(contentSize, anchorRect, offset);
            }
        }

        /** (Private) Calculates element inside base position using anchor rect. */
        private handleInsideBasePosition(anchorRectOrientation: RectOrientation, contentSize: shapes.ISize, anchorRect: shapes.IRect, offset: number): shapes.IRect {
            switch (anchorRectOrientation) {
                case RectOrientation.VerticalBottomTop:
                    return LocationConverter.bottomInside(contentSize, anchorRect, offset);
                case RectOrientation.VerticalTopBottom:
                    return LocationConverter.topInside(contentSize, anchorRect, offset);
                case RectOrientation.HorizontalRightLeft:
                    return LocationConverter.rightInside(contentSize, anchorRect, offset);
                case RectOrientation.HorizontalLeftRight:
                default:
                    return LocationConverter.leftInside(contentSize, anchorRect, offset);
            }
        }

        /** (Private) Calculates element outside end position using anchor rect. */
        private handleOutsideEndPosition(anchorRectOrientation: RectOrientation, contentSize: shapes.ISize, anchorRect: shapes.IRect, offset: number): shapes.IRect {
            switch (anchorRectOrientation) {
                case RectOrientation.VerticalBottomTop:
                    return LocationConverter.topOutside(contentSize, anchorRect, offset);
                case RectOrientation.VerticalTopBottom:
                    return LocationConverter.bottomOutside(contentSize, anchorRect, offset);
                case RectOrientation.HorizontalRightLeft:
                    return LocationConverter.leftOutside(contentSize, anchorRect, offset);
                case RectOrientation.HorizontalLeftRight:
                default:
                    return LocationConverter.rightOutside(contentSize, anchorRect, offset);
            }
        }

        /** (Private) Calculates element outside base position using anchor rect. */
        private handleOutsideBasePosition(anchorRectOrientation: RectOrientation, contentSize: shapes.ISize, anchorRect: shapes.IRect, offset: number): shapes.IRect {
            switch (anchorRectOrientation) {
                case RectOrientation.VerticalBottomTop:
                    return LocationConverter.bottomOutside(contentSize, anchorRect, offset);
                case RectOrientation.VerticalTopBottom:
                    return LocationConverter.topOutside(contentSize, anchorRect, offset);
                case RectOrientation.HorizontalRightLeft:
                    return LocationConverter.rightOutside(contentSize, anchorRect, offset);
                case RectOrientation.HorizontalLeftRight:
                default:
                    return LocationConverter.leftOutside(contentSize, anchorRect, offset);
            }
        }

        /**  (Private) Calculates element position. */
        private calculateContentPosition(anchoredElementInfo: IDataLabelInfo, contentPosition: ContentPositions, contentSize: shapes.ISize, offset: number): shapes.IRect {

            if (contentPosition !== ContentPositions.InsideEnd &&
                contentPosition !== ContentPositions.InsideCenter &&
                contentPosition !== ContentPositions.InsideBase &&
                contentPosition !== ContentPositions.OutsideBase &&
                contentPosition !== ContentPositions.OutsideEnd) {
                // Determine position using anchor point.
                return this.calculateContentPositionFromPoint(
                    anchoredElementInfo.anchorPoint,
                    contentPosition,
                    contentSize,
                    offset);
            }
            
            // Determine position using anchor rectangle.
            return this.calculateContentPositionFromRect(
                anchoredElementInfo.anchorRect,
                anchoredElementInfo.anchorRectOrientation,
                contentPosition,
                contentSize,
                offset);
        }

        /** (Private) Check for collisions. */
        private hasCollisions(arrangeGrid: DataLabelArrangeGrid, info: IDataLabelInfo, position: shapes.IRect, size: shapes.ISize): boolean {
            var rect = shapes.Rect;

            if (arrangeGrid.hasConflict(position)) {
                return true;
            }
            // Since we divide the height by 2 we add it back to the top of the view port so labels won't be cut off
            var intersection = { left: 0, top: position.height / 2, width: size.width, height: size.height };
            intersection = rect.inflate(intersection, { left: DataLabelManager.InflateAmount, top: 0, right: DataLabelManager.InflateAmount, bottom: 0 });

            intersection = rect.intersect(intersection, position);

            if (rect.isEmpty(intersection))
                // Empty rectangle means there is a collision
                return true;

            var lessWithPrecision = powerbi.Double.lessWithPrecision;

            switch (info.outsidePlacement) {
                // D3 positions the label in the middle by default.
                // The algorithem asumed the label was positioned in right so this is why we devide by 2 or 4
                case OutsidePlacement.Disallowed:
                    return lessWithPrecision(intersection.width, position.width) ||
                        lessWithPrecision(intersection.height, position.height / 2);

                case OutsidePlacement.Partial:
                    return lessWithPrecision(intersection.width, position.width / 2) ||
                        lessWithPrecision(intersection.height, position.height / 4);
            }
            return false;
        }

        /** (Private) Calculates and returns the callout point. */
        private getCalloutPoint(position: shapes.IRect, contentAlignment: ContentPositions, rectOrientation: RectOrientation): shapes.IPoint {

            var point = { x: position.left, y: position.top };

            switch (contentAlignment) {
                case ContentPositions.MiddleCenter:
                case ContentPositions.MiddleLeft:
                case ContentPositions.MiddleRight:
                    point.y += position.height / 2.0;
                    break;
                case ContentPositions.TopCenter:
                case ContentPositions.TopLeft:
                case ContentPositions.TopRight:
                    point.y = position.top + position.height; //.Bottom;
                    break;
                case ContentPositions.TopCenter:
                case ContentPositions.MiddleCenter:
                case ContentPositions.BottomCenter:
                    point.x += position.width / 2.0;
                    break;
                case ContentPositions.TopLeft:
                case ContentPositions.MiddleLeft:
                case ContentPositions.BottomLeft:
                    point.x = position.left + position.width; //.Right;
                    break;
            }            

            // Get callout point for the element anchored to a rectangle.
            // Callout is drawn only when content is placed outside of 
            // the anchor rectangle.
            if (contentAlignment === ContentPositions.OutsideBase) {
                switch (rectOrientation) {
                    case RectOrientation.VerticalBottomTop:
                        point = { x: position.left + position.width / 2.0, y: position.top };
                        break;
                    case RectOrientation.VerticalTopBottom:
                        point = {
                            x: position.left + position.width / 2.0,
                            y: position.top + position.height /*Bottom*/
                        };
                        break;
                    case RectOrientation.HorizontalLeftRight:
                        point = { x: position.left + position.width /*Right*/, y: position.top + position.height / 2.0 };
                        break;
                    case RectOrientation.HorizontalRightLeft:
                        point = { x: position.left, y: position.top + position.height / 2.0 };
                        break;
                }
            }
            else if (contentAlignment === ContentPositions.OutsideEnd) {
                switch (rectOrientation) {
                    case RectOrientation.VerticalBottomTop:
                        point = { x: position.left + position.width / 2.0, y: position.top + position.height /*Bottom*/};
                        break;
                    case RectOrientation.VerticalTopBottom:
                        point = { x: position.left + position.width / 2.0, y: position.top };
                        break;
                    case RectOrientation.HorizontalLeftRight:
                        point = { x: position.left, y: position.top + position.height / 2.0 };
                        break;
                    case RectOrientation.HorizontalRightLeft:
                        point = { x: position.left + position.width /*Right*/, y: position.top + position.height / 2.0 };
                        break;
                }
            }

            return point;
        }

        /**
        * (Private) Adjust the anchor position based on anchorRect by probing for collisions and moving the label arround.
        */
        private adjustAnchorRectPosition(grid: DataLabelArrangeGrid, info: IDataLabelInfo, position: shapes.IRect, contentSize: shapes.ISize): shapes.IRect {
            var anchorRect = info.anchorRect;

            if (DataLabelManager.isValid(anchorRect)) {

                // Create list of rectangle positions in the order specific to 
                // the current position.
                var contentPositions: ContentPositions[] = null;
                switch (info.contentPosition) {
                    case ContentPositions.InsideCenter:
                        contentPositions = [
                            ContentPositions.InsideCenter,
                            ContentPositions.InsideEnd,
                            ContentPositions.InsideBase,
                            ContentPositions.OutsideEnd,
                            ContentPositions.OutsideBase
                        ];
                        break;
                    case ContentPositions.InsideBase:
                        contentPositions = [
                            ContentPositions.InsideBase,
                            ContentPositions.InsideCenter,
                            ContentPositions.InsideEnd,
                            ContentPositions.OutsideBase,
                            ContentPositions.OutsideEnd
                        ];
                        break;
                    case ContentPositions.InsideEnd:
                        contentPositions = [
                            ContentPositions.InsideEnd,
                            ContentPositions.InsideCenter,
                            ContentPositions.InsideBase,
                            ContentPositions.OutsideEnd,
                            ContentPositions.OutsideBase
                        ];
                        break;
                    case ContentPositions.OutsideEnd:
                        contentPositions = [
                            ContentPositions.OutsideEnd,
                            ContentPositions.InsideEnd,
                            ContentPositions.InsideCenter,
                            ContentPositions.InsideBase,
                            ContentPositions.OutsideBase
                        ];
                        break;
                    case ContentPositions.OutsideBase:
                        contentPositions = [
                            ContentPositions.OutsideBase,
                            ContentPositions.InsideBase,
                            ContentPositions.InsideCenter,
                            ContentPositions.InsideEnd,
                            ContentPositions.OutsideEnd
                        ];
                        break;
                    default:
                        contentPositions = [
                            info.contentPosition,
                            ContentPositions.TopCenter,
                            ContentPositions.BottomCenter,
                            ContentPositions.MiddleRight,
                            ContentPositions.MiddleLeft,
                            ContentPositions.MiddleCenter
                        ];
                        break;
                }

                if (contentPositions !== null) {
                    // Loop through different content positions
                    for (var currentPositionIndex = 0, len = contentPositions.length; currentPositionIndex < len; currentPositionIndex++) {
                        // Check if this content position is valid
                        if ((info.validContentPositions & contentPositions[currentPositionIndex]) === contentPositions[currentPositionIndex]) {
                            // Set current position and adjust max/min moving distance
                            var maximum = info.maximumMovingDistance;
                            var minimum = Math.max(info.minimumMovingDistance, info.anchorMargin);
                            var checkNegativeOffset = false;

                            switch (contentPositions[currentPositionIndex]) {
                                case ContentPositions.InsideCenter:
                                    // Ignore margin when label place inside in the center
                                    minimum = info.minimumMovingDistance;

                                    // Try moving element in both dshapes.IRections
                                    checkNegativeOffset = true;

                                    // Set maximum moving distance so that element will not be placed 
                                    // outside of the anchor rectangle.
                                    if (info.anchorRectOrientation === RectOrientation.HorizontalLeftRight ||
                                        info.anchorRectOrientation === RectOrientation.HorizontalRightLeft) {
                                        maximum = (info.anchorRect.width - contentSize.width) / 2.0;
                                    }
                                    else {
                                        maximum = (info.anchorRect.height - contentSize.height) / 2.0;
                                    }

                                    break;
                                case ContentPositions.InsideBase:
                                case ContentPositions.InsideEnd:
                                    // Set maximum moving distance so that element will not be placed 
                                    // outside of the anchor rectangle.
                                    if (info.anchorRectOrientation === RectOrientation.HorizontalLeftRight ||
                                        info.anchorRectOrientation === RectOrientation.HorizontalRightLeft) {
                                        maximum = info.anchorRect.width - contentSize.width;
                                    }
                                    else {
                                        maximum = info.anchorRect.height - contentSize.height;
                                    }

                                    break;
                            }

                            // Prevent too many iteration
                            maximum = Math.min(maximum, info.maximumMovingDistance);

                            // Iterate through different offsets and try find position 
                            // that does not overlap with other elements.
                            for (var offset = minimum; powerbi.Double.lessOrEqualWithPrecision(offset, maximum); offset += this.movingStep) {
                                // Calculate new position of the label
                                var adjustedPosition = this.calculateContentPosition(
                                    info,
                                    contentPositions[currentPositionIndex],
                                    contentSize,
                                    offset);

                                // Check new position collision
                                if (!this.hasCollisions(grid, info, adjustedPosition, this._size)) {
                                    info.offset = offset;
                                    info.contentPosition = contentPositions[currentPositionIndex];
                                    return adjustedPosition;
                                }

                                // Try same position but with the negative offset
                                if (checkNegativeOffset) {
                                    adjustedPosition = this.calculateContentPosition(
                                        info,
                                        contentPositions[currentPositionIndex],
                                        contentSize,
                                        -offset);

                                    // Check new position collision
                                    if (!this.hasCollisions(grid, info, adjustedPosition, this._size)) {
                                        info.offset = offset;
                                        info.contentPosition = contentPositions[currentPositionIndex];
                                        return adjustedPosition;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return position;
        }

        /**
        * (Private) Adjust the anchor position based on anchorPoint by probing for collisions and moving the label arround.
        */
        private adjustAnchorPosition(grid: DataLabelArrangeGrid, info: IDataLabelInfo, position: shapes.IRect, contentSize: shapes.ISize): shapes.IRect {
            // If anchor point is specified try adjust position by moving element around
            // and away of the anchor point
            if (info.anchorPoint && isFinite(info.anchorPoint.x) && isFinite(info.anchorPoint.y)) {

                // Define the specific order in which we will be trying to reposition the 
                // element relative to the anchor position.                
                var contentPositions = [
                    ContentPositions.BottomCenter,
                    ContentPositions.TopCenter,
                    ContentPositions.MiddleRight,
                    ContentPositions.MiddleLeft,
                    ContentPositions.BottomRight,
                    ContentPositions.BottomLeft,
                    ContentPositions.TopRight,
                    ContentPositions.TopLeft,
                    ContentPositions.MiddleCenter
                ];

                for (var offset = Math.max(info.minimumMovingDistance, info.anchorMargin);
                    powerbi.Double.lessOrEqualWithPrecision(offset, info.maximumMovingDistance);
                    offset += this.movingStep) {
                    for (var currentPositionIndex = 0, len = contentPositions.length; currentPositionIndex < len; currentPositionIndex++) {
                        // Center label alignment should only be tried once!
                        if (contentPositions[currentPositionIndex] === ContentPositions.MiddleCenter &&
                            offset !== info.minimumMovingDistance) {
                            continue;
                        }

                        // Check if this content position is valid
                        if ((info.validContentPositions & contentPositions[currentPositionIndex]) === contentPositions[currentPositionIndex]) {

                            var adjustedPosition = this.calculateContentPosition(
                                info,
                                contentPositions[currentPositionIndex],
                                contentSize,
                                offset);

                            if (!this.hasCollisions(grid, info, adjustedPosition, this._size)) {
                                info.offset = offset;
                                info.contentPosition = contentPositions[currentPositionIndex];
                                return adjustedPosition;
                            }
                        }
                    }
                }
            }
            return position;
        }

        /**
        * (Private) Adjust the anchor position based on anchor point or anchor rectangle by probing for collisions and moving the label arround.
        */
        private adjustPosition(grid: DataLabelArrangeGrid, info: IDataLabelInfo, position: shapes.IRect, contentSize: shapes.ISize): shapes.IRect {
            
            if (!this.collisionDetectionEnabled) {
                return position;
            }

            if (!this.repositionOverlapped) {
                return position;
            }

            if (!this.hasCollisions(grid, info, position, this._size)) {
                return position;
            }

            var adjustedPosition = { left: position.left, top: position.top, width: position.width, height: position.height };
            var contentPosition = info.contentPosition;

            var equal = shapes.Rect.equal;

            if (contentPosition !== ContentPositions.InsideEnd &&
                contentPosition !== ContentPositions.InsideCenter &&
                contentPosition !== ContentPositions.InsideBase &&
                contentPosition !== ContentPositions.OutsideBase &&
                contentPosition !== ContentPositions.OutsideEnd) {
                adjustedPosition = this.adjustAnchorPosition(grid, info, position, contentSize);
                if (equal(adjustedPosition, position)) {
                    adjustedPosition = this.adjustAnchorRectPosition(grid, info, position, contentSize);
                }
            }
            else {
                adjustedPosition = this.adjustAnchorRectPosition(grid, info, position, contentSize);
                if (equal(adjustedPosition, position)) {
                    adjustedPosition = this.adjustAnchorPosition(grid, info, position, contentSize);
                }
            }

            if (equal(adjustedPosition, position) && this.hideOverlapped) {
                adjustedPosition = null;
            }

            return adjustedPosition;
        }

        public static isValid(rect: shapes.IRect): boolean {
            return !shapes.Rect.isEmpty(rect) && (rect.width > 0 && rect.height > 0);
        }
    }

    /**
    * Utility class to speed up the conflict detection by collecting the arranged items in the DataLabelsPanel. 
    */
    export class DataLabelArrangeGrid {

        private _grid: IArrangeGridElementInfo[][][] = [];
        //size of a grid cell 
        private _cellSize: shapes.ISize;
        private _rowCount: number;
        private _colCount: number;

        private static ARRANGEGRID_MIN_COUNT = 1;
        private static ARRANGEGRID_MAX_COUNT = 100;

        /**
        * Creates new ArrangeGrid.
        * @param {DataLabelManager} manager The owner data labels.
        * @param {shapes.ISize} size The available size
        */
        constructor(size: shapes.ISize, elements: any[], layout: powerbi.visuals.ILabelLayout) {
            if (size.width === 0 || size.height === 0) {
                this._cellSize = size;
                this._rowCount = this._colCount = 0;
            }

            //sets the _cell size to be twice of the Max with and Max height of the elements 
            this._cellSize = { width: 0, height: 0 };
            for (var i = 0, len = elements.length; i < len; i++) {
                var child = elements[i];

                // Fill label field
                child.labeltext = layout.labelText(child);

                var properties: TextProperties = {
                    fontFamily: powerbi.visuals.dataLabelUtils.LabelTextProperties.fontFamily,
                    fontSize: powerbi.visuals.dataLabelUtils.LabelTextProperties.fontSize,
                    fontWeight: powerbi.visuals.dataLabelUtils.LabelTextProperties.fontWeight,
                    text: child.labeltext,
                };

                child.size = {
                    width: TextMeasurementService.measureSvgTextWidth(properties),
                    height: TextMeasurementService.measureSvgTextHeight(properties),
                };
                
                var w = child.size.width * 2;
                var h = child.size.height * 2;
                if (w > this._cellSize.width)
                    this._cellSize.width = w;
                if (h > this._cellSize.height)
                    this._cellSize.height = h;
            }

            if (this._cellSize.width === 0)
                this._cellSize.width = size.width;
            if (this._cellSize.height === 0)
                this._cellSize.height = size.height;

            this._colCount = this.getGridRowColCount(this._cellSize.width, size.width, DataLabelArrangeGrid.ARRANGEGRID_MIN_COUNT, DataLabelArrangeGrid.ARRANGEGRID_MAX_COUNT);
            this._rowCount = this.getGridRowColCount(this._cellSize.height, size.height, DataLabelArrangeGrid.ARRANGEGRID_MIN_COUNT, DataLabelArrangeGrid.ARRANGEGRID_MAX_COUNT);
            this._cellSize.width = size.width / this._colCount;
            this._cellSize.height = size.height / this._rowCount;

            var grid = this._grid;
            for (var x = 0; x < this._colCount; x++) {
                grid[x] = [];
                for (var y = 0; y < this._rowCount; y++) {
                    grid[x][y] = [];
                }
            }
        }

        /**
        * Register a new label element.
        * @param {ILabelElement} element The label element to register.
        * @param {shapes.IRect} rect The label element position rectangle.
        */
        public add(element: IDataLabelInfo, rect: shapes.IRect) {
            var indexRect = this.getGridIndexRect(rect);
            var grid = this._grid;
            for (var x = indexRect.left; x < indexRect.right; x++) {
                for (var y = indexRect.top; y < indexRect.bottom; y++) {
                    grid[x][y].push({ element: element, rect: rect });
                }
            }
        }

        /**
        * Checks for conflict of given rectangle in registered elements.
        * @param {shapes.IRect} rect The rectengle to check.
        * @return {Boolean} True if conflict is detected.
        */
        public hasConflict(rect: shapes.IRect): boolean {
            var indexRect = this.getGridIndexRect(rect);
            var grid = this._grid;
            var isIntersecting = shapes.Rect.isIntersecting;

            for (var x = indexRect.left; x < indexRect.right; x++) {
                for (var y = indexRect.top; y < indexRect.bottom; y++) {
                    for (var z = 0; z < grid[x][y].length; z++) {
                        var item = grid[x][y][z];
                        if (isIntersecting(item.rect, rect)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        /**
        * Calculates the number of rows or columns in a grid
        * @param {number} step is the largest label size (width or height)
        * @param {number} length is the grid size (width or height)
        * @param {number} minCount is the minimum allowed size
        * @param {number} maxCount is the maximum allowed size
        * @return {number} the number of grid rows or columns
        */
        private getGridRowColCount(step: number, length: number, minCount: number, maxCount: number): number {
            return Math.min(Math.max(Math.ceil(length / step), minCount), maxCount);
        }

        /**
        * Returns the grid index of a given recangle
        * @param {shapes.IRect} rect The rectengle to check.
        * @return {shapes.IThickness} grid index as a thickness object.
        */
        private getGridIndexRect(rect: shapes.IRect): shapes.IThickness {
            var restrict = (n, min, max) => Math.min(Math.max(n, min), max);
            return {
                left: restrict(Math.floor(rect.left / this._cellSize.width), 0, this._colCount),
                top: restrict(Math.floor(rect.top / this._cellSize.height), 0, this._rowCount),
                right: restrict(Math.ceil((rect.left + rect.width) / this._cellSize.width), 0, this._colCount),
                bottom: restrict(Math.ceil((rect.top + rect.height) / this._cellSize.height), 0, this._rowCount)
            };
        }
    }

    /**
    * (Private) Contains methods for calculating the top-left coordinate of rectangle based on content size and anchor rect. 
    */
    module LocationConverter {

        export function topInside(size: shapes.ISize, rect: shapes.IRect, offset: number): shapes.IRect {
            return {
                left: rect.left + rect.width / 2.0 - size.width / 2.0,
                top: rect.top + offset,
                width: size.width,
                height: size.height
            };
        }

        export function bottomInside(size: shapes.ISize, rect: shapes.IRect, offset: number): shapes.IRect {
            return {
                left: rect.left + rect.width / 2.0 - size.width / 2.0,
                top: (rect.top + rect.height) - size.height - offset,
                width: size.width,
                height: size.height
            };
        }

        export function rightInside(size: shapes.ISize, rect: shapes.IRect, offset: number): shapes.IRect {
            return {
                left: (rect.left + rect.width) - size.width - offset,
                top: rect.top + rect.height / 2.0 - size.height / 2.0,
                width: size.width,
                height: size.height
            };
        }

        export function leftInside(size: shapes.ISize, rect: shapes.IRect, offset: number): shapes.IRect {
            return {
                left: rect.left + offset,
                top: rect.top + rect.height / 2.0 - size.height / 2.0,
                width: size.width,
                height: size.height
            };
        }

        export function topOutside(size: shapes.ISize, rect: shapes.IRect, offset: number): shapes.IRect {
            return {
                left: rect.left + rect.width / 2.0 - size.width / 2.0,
                top: rect.top - size.height - offset,
                width: size.width,
                height: size.height
            };
        }

        export function bottomOutside(size: shapes.ISize, rect: shapes.IRect, offset: number): shapes.IRect {
            return {
                left: rect.left + rect.width / 2.0 - size.width / 2.0,
                top: (rect.top + rect.height) + offset,
                width: size.width,
                height: size.height
            };
        }

        export function rightOutside(size: shapes.ISize, rect: shapes.IRect, offset: number): shapes.IRect {
            return {
                left: (rect.left + rect.width) + offset,
                top: rect.top + rect.height / 2.0 - size.height / 2.0,
                width: size.width,
                height: size.height
            };
        }

        export function leftOutside(size: shapes.ISize, rect: shapes.IRect, offset: number): shapes.IRect {
            return {
                left: rect.left - size.width - offset,
                top: rect.top + rect.height / 2.0 - size.height / 2.0,
                width: size.width,
                height: size.height
            };
        }

        export function middleHorizontal(size: shapes.ISize, rect: shapes.IRect, offset: number): shapes.IRect {
            return {
                left: rect.left + rect.width / 2.0 - size.width / 2.0 + offset,
                top: rect.top + rect.height / 2.0 - size.height / 2.0,
                width: size.width,
                height: size.height
            };
        }

        export function middleVertical(size: shapes.ISize, rect: shapes.IRect, offset: number): shapes.IRect {
            return {
                left: rect.left + rect.width / 2.0 - size.width / 2.0,
                top: rect.top + rect.height / 2.0 - size.height / 2.0 + offset,
                width: size.width,
                height: size.height
            };
        }
    }
}