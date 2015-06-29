//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals.controls.internal {

    export interface ITablixResizeHandler {
        onStartResize(cell: TablixCell, currentX: number, currentY: number): void;
        onResize(cell: TablixCell, deltaX: number, deltaY: number): void;
        onEndResize(cell: TablixCell);
        onReset(cell: TablixCell);
    }

    /** Internal interface to abstract the tablix row/column
      */
    export interface ITablixGridItem {
        calculateSize(): void;
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
    export class TablixResizer {
        private _element: HTMLElement;
        private _handler: ITablixResizeHandler;
        private _elementMouseDownWrapper: any;
        private _elementMouseMoveWrapper: any;
        private _elementMouseOutWrapper: any;
        private _elementMouseDoubleClickOutWrapper: any;
        private _documentMouseMoveWrapper: any;
        private _documentMouseUpWrapper: any;
        private _startMousePosition: { x: number; y: number; };
        private _originalCursor: string;

        static resizeHandleSize = 4;
        static resizeCursor = "e-resize";

        constructor(element: HTMLElement, handler: ITablixResizeHandler) {
            this._element = element;
            this._handler = handler;
            this._elementMouseDownWrapper = null;
            this._elementMouseMoveWrapper = null;
            this._elementMouseOutWrapper = null;
            this._documentMouseMoveWrapper = null;
            this._documentMouseUpWrapper = null;
            this._startMousePosition = null;
            this._originalCursor = null;
        }

        static addDocumentMouseUpEvent(listener: EventListener): void {
            document.addEventListener("mouseup", listener);
        }

        static removeDocumentMouseUpEvent(listener: EventListener): void {
            document.removeEventListener("mouseup", listener);
        }

        static addDocumentMouseMoveEvent(listener: EventListener): void {
            document.addEventListener("mousemove", listener);
        }

        static removeDocumentMouseMoveEvent(listener: EventListener): void {
            document.removeEventListener("mousemove", listener);
        }

        static getMouseCoordinates(event: MouseEvent): { x: number; y: number; } {
            return { x: event.pageX, y: event.pageY };
        }

        static getMouseCoordinateDelta(previous: { x: number; y: number; }, current: { x: number; y: number; }): { x: number; y: number; } {
            return { x: current.x - previous.x, y: current.y - previous.y };
        }

        public initialize(): void {
            this._elementMouseDownWrapper = e => this.onElementMouseDown(<MouseEvent>e);
            this._element.addEventListener("mousedown", this._elementMouseDownWrapper);
            this._elementMouseMoveWrapper = e => this.onElementMouseMove(<MouseEvent>e);
            this._element.addEventListener("mousemove", this._elementMouseMoveWrapper);
            this._elementMouseOutWrapper = e => this.onElementMouseOut(<MouseEvent>e);
            this._element.addEventListener("mouseout", this._elementMouseOutWrapper);
            this._elementMouseDoubleClickOutWrapper = e => this.onElementMouseDoubleClick(<MouseEvent>e);
            this._element.addEventListener("dblclick", this._elementMouseDoubleClickOutWrapper);
        }

        public uninitialize(): void {
            this._element.removeEventListener("mousedown", this._elementMouseDownWrapper);
            this._elementMouseDownWrapper = null;
            this._element.removeEventListener("mousemove", this._elementMouseMoveWrapper);
            this._elementMouseMoveWrapper = null;
            this._element.removeEventListener("mouseout", this._elementMouseOutWrapper);
            this._elementMouseOutWrapper = null;
            this._element.removeEventListener("dblclick", this._elementMouseDoubleClickOutWrapper);
            this._elementMouseDoubleClickOutWrapper = null;
        }

        public get cell(): TablixCell {
            // abstract
            debug.assertFail("PureVirtualMethod: TablixResizer.cell");
            return null;
        }

        public get element(): HTMLElement {
            return this._element;
        }

        // Protected
        public _hotSpot(position: { x: number; y: number; }) {
            // abstract
            debug.assertFail("PureVirtualMethod: TablixResizer._hotSpot");
            return false;
        }
                
        private onElementMouseDown(event: MouseEvent): void {
            var position = TablixResizer.getMouseCoordinates(event);
            if (!this._hotSpot(position))
                return;

            if ("setCapture" in this._element) {
                this._element.setCapture();
            }

            event.cancelBubble = true;
            this._startMousePosition = position;
            this._documentMouseMoveWrapper = e => this.onDocumentMouseMove(e);
            TablixResizer.addDocumentMouseMoveEvent(this._documentMouseMoveWrapper);
            this._documentMouseUpWrapper = e => this.onDocumentMouseUp(e);
            TablixResizer.addDocumentMouseUpEvent(this._documentMouseUpWrapper);

            if (document.documentElement) {
                this._originalCursor = document.documentElement.style.cursor;
                document.documentElement.style.cursor = TablixResizer.resizeCursor;
            }
            
            this._handler.onStartResize(this.cell, this._startMousePosition.x, this._startMousePosition.y);
        }

        private onElementMouseMove(event: MouseEvent) {
            if (!this._startMousePosition) {
                if (this._hotSpot(TablixResizer.getMouseCoordinates(event))) {
                    if (this._originalCursor === null) {
                        this._originalCursor = this._element.style.cursor;
                        this._element.style.cursor = TablixResizer.resizeCursor;
                    }
                } else {
                    if (this._originalCursor !== null) {
                        this._element.style.cursor = this._originalCursor;
                        this._originalCursor = null;
                    }
                }
            }
        }

        private onElementMouseOut(event: MouseEvent) {
            if (!this._startMousePosition) {
                if (this._originalCursor !== null) {
                    this._element.style.cursor = this._originalCursor;
                    this._originalCursor = null;
                }
            }
        }

        private onElementMouseDoubleClick(event: MouseEvent) {
            if (!this._hotSpot(TablixResizer.getMouseCoordinates(event)))
                return;

            this._handler.onReset(this.cell);
        }

        private onDocumentMouseMove(event: MouseEvent): void {
            if (!this._startMousePosition)
                return;

            var delta = TablixResizer.getMouseCoordinateDelta(this._startMousePosition, TablixResizer.getMouseCoordinates(event));
            this._handler.onResize(this.cell, delta.x, delta.y);
        }

        private onDocumentMouseUp(event: MouseEvent): void {
            this._startMousePosition = null;

            if ("releaseCapture" in this._element) {
                this._element.releaseCapture();
            }

            TablixResizer.removeDocumentMouseMoveEvent(this._documentMouseMoveWrapper);
            this._documentMouseMoveWrapper = null;

            TablixResizer.removeDocumentMouseUpEvent(this._documentMouseUpWrapper);
            this._documentMouseUpWrapper = null;

            if (document.documentElement)
                document.documentElement.style.cursor = this._originalCursor;

            if (event.preventDefault)
                event.preventDefault(); // prevent other events

            this._handler.onEndResize(this.cell);
        }
    }

    export class TablixCell implements ITablixCell {
        private _horizontalOffset: number;
        private _verticalOffset: number;
        private _colSpan: number;
        private _rowSpan: number;
        private _textAlign: string;
        private _contentWidth: number;
        private _contentHeight: number;
        private _scrollable = false;

        public _column: TablixColumn; // internal
        public _row: TablixRow; // internal

        public type: TablixCellType;
        public item: any;

        public _presenter: TablixCellPresenter; // internal
        public extension: any; 

        constructor(presenter: TablixCellPresenter, extension: any, row: TablixRow) {
            this._presenter = presenter;
            this.extension = extension;
            this._presenter.initialize(this);
            this._row = row;
            this.item = null;
            this.type = null;
            this._horizontalOffset = 0;
            this._verticalOffset = 0;
            this._colSpan = 1;
            this._rowSpan = 1;
            this._contentWidth = -1;
            this._contentHeight = -1;
        }

        public get colSpan(): number {
            return this._colSpan;
        }

        public set colSpan(value: number) {
            if (this._colSpan !== value) {
                this._presenter.onColumnSpanChanged(value);
                this._colSpan = value;
            }
        }

        public get rowSpan(): number {
            return this._rowSpan;
        }

        public set rowSpan(value: number) {
            if (this._rowSpan !== value) {
                this._presenter.onRowSpanChanged(value);
                this._rowSpan = value;
            }
        }

        public get textAlign(): string {
            return this._textAlign;
        }

        public set textAlign(value: string) {
            if (value != this._textAlign) {
                this._presenter.onTextAlignChanged(value);
                this._textAlign = value;
            }
        }

        public get horizontalOffset(): number {
            return this._horizontalOffset;
        }

        public get verticalOffset(): number {
            return this._verticalOffset;
        }

        private isScrollable(): boolean {
            return this._scrollable;
        }

        public clear(): void {
            if (this.isScrollable()) {
                this.initializeScrolling();
            }

            this._presenter.onClear();
            this.setContentWidth(-1);
            this.setContentHeight(-1);
        }

        private initializeScrolling() {
            this._presenter.onInitializeScrolling();
            this._horizontalOffset = 0;
            this._verticalOffset = 0;
            this.setContentWidth(-1);
            this.setContentHeight(-1);
        }

        public prepare(scrollable: boolean): void {
            if (this.isScrollable())
                this.initializeScrolling();

            this._scrollable = scrollable;
        }

        public scrollVertically(height: number, offset: number): void {
            if (!this.isScrollable()) {
                return;
            }

            var offsetInPixels: number = -height * offset;
            this._verticalOffset = offsetInPixels;
            this._presenter.onVerticalScroll(height, offsetInPixels);
            this.setContentHeight(height + offsetInPixels);
        }

        public scrollHorizontally(width: number, offset: number) {
            if (!this.isScrollable()) {
                return;
            }

            var offsetInPixels = -width * offset;
            this._horizontalOffset = offsetInPixels;
            this._presenter.onHorizontalScroll(width, offsetInPixels);
            this.setContentWidth(width + offsetInPixels);
        }

        public setContentWidth(value: number): void {
            if (value === this._contentWidth)
                return;

            this._contentWidth = value;
            this._presenter.onContentWidthChanged(value);
        }

        public setContentHeight(value: number): void {
            if (value === this._contentHeight)
                return;

            this._contentHeight = value;
            this._presenter.onContentHeightChanged(value);
        }

        public enableHorizontalResize(enable: boolean, handler: ITablixResizeHandler): void {
            this._presenter.enableHorizontalResize(enable, handler);
        }
    }

    export class TablixColumn implements ITablixGridItem {
        public _realizedColumnHeaders: TablixCell[];  // internal
        public _realizedCornerCells: TablixCell[];    // internal
        public _realizedRowHeaders: TablixCell[];     // internal
        public _realizedBodyCells: TablixCell[];      // internal
        private _items: any[];
        private _itemType: TablixCellType;
        private _footerCell: TablixCell;

        private _contentWidth: number;
        private _width: number;
        private _sizeFixed: boolean;

        private _aligningWidth: number;
        private _fixedToAligningWidth: boolean; // move to base class to have it for both rows and columns

        private _presenter: TablixColumnPresenter;

        constructor(presenter: TablixColumnPresenter) {
            this._presenter = presenter;
            this._presenter.initialize(this);
            this.initialize();
            this._contentWidth = -1;
            this._width = -1;
            this._sizeFixed = false;
            this._aligningWidth = -1;
            this._fixedToAligningWidth = false
            this._items = [];
            this._itemType = null;
            this._footerCell = null;
        }

        private getType(): TablixCellType {
            if (this._realizedCornerCells.length > 0)
                return TablixCellType.CornerCell;

            return TablixCellType.ColumnHeader;
        }

        private getColumnHeadersOrCorners(): TablixCell[] {
            if (this._realizedCornerCells.length > 0)
                return this._realizedCornerCells;

            return this._realizedColumnHeaders;
        }

        private columnHeadersOrCornersEqual(newType: TablixCellType, headers: TablixCell[], hierarchyNavigator: ITablixHierarchyNavigator): boolean {
            if (this._items.length !== headers.length)
                return false;

            var count = this._items.length;

            for (var i = 0; i < count; i++) {
                if (!this.columnHeaderOrCornerEquals(this._itemType, this._items[i], newType, headers[i].item, hierarchyNavigator))
                    return false;
            }

            return true;
        }

        public get itemType(): TablixCellType {
            return this._itemType;
        }

        public getLeafItem(): any {
            if (this._items.length === 0)
                return null;

            return this._items[this._items.length - 1];
        }

        public columnHeaderOrCornerEquals(type1: TablixCellType, item1: any, type2: TablixCellType, item2: any, hierarchyNavigator: ITablixHierarchyNavigator): boolean{
            if (type1 !== type2)
                return false;

            if (type1 === TablixCellType.CornerCell) {
                if (!hierarchyNavigator.cornerCellItemEquals(item1, item2))
                    return false;
            } else {
                if (!hierarchyNavigator.headerItemEquals(item1, item2))
                    return false;
            }

            return true;
        }

        public OnLeafRealized(hierarchyNavigator: ITablixHierarchyNavigator): void {
            // if the headers/corner have changed we should clear the column size to accomodate for the new content
            var type = this.getType();
            var columnHeadersOrCorners = this.getColumnHeadersOrCorners();

            if (this.columnHeadersOrCornersEqual(type, columnHeadersOrCorners, hierarchyNavigator)) {
                this.clearSpanningCellsWidth(this._realizedColumnHeaders);
            }
            else {
                var count = columnHeadersOrCorners.length;
                this._items = [];

                for (var i = 0; i < count; i++) {
                    this._items.push(columnHeadersOrCorners[i].item);
                }

                this._itemType = type;
                this.clearSize();
            }
        }

        private clearSpanningCellsWidth(cells: TablixCell[]): void {
            var count = cells.length;
            for (var i = 0; i < cells.length; i++) {
                var cell = cells[i];
                if (cell.colSpan > 1) {
                    cell.setContentWidth(-1);
                }
            }
        }

        public initialize(): void {
            this._realizedRowHeaders = [];
            this._realizedColumnHeaders = [];
            this._realizedCornerCells = [];
            this._realizedBodyCells = [];
        }

        public addCornerCell(cell: TablixCell) {
            cell._column = this;
            this._realizedCornerCells.push(cell);
            cell.setContentWidth(this._contentWidth);
        }

        public addRowHeader(cell: TablixCell) {
            cell._column = this;
            this._realizedRowHeaders.push(cell);
            cell.setContentWidth(this._contentWidth);
        }

        public addColumnHeader(cell: TablixCell, isLeaf: boolean) {
            cell._column = this;
            this._realizedColumnHeaders.push(cell);
            if (isLeaf) {
                cell.setContentWidth(this._contentWidth);
            }
        }

        public addBodyCell(cell: TablixCell) {
            cell._column = this;
            this._realizedBodyCells.push(cell);
            cell.setContentWidth(this._contentWidth);
        }

        public set footer(footerCell: TablixCell) {
            this._footerCell = footerCell;
            footerCell._column = this;
            footerCell.setContentWidth(this._contentWidth);
        }

        public get footer(): TablixCell {
            return this._footerCell;
        }
                
        public resize(width: number): void {
            if (width === this.getContentContextualWidth())
                return;

            this._contentWidth = width;
            this.setContentWidth(this._contentWidth);
            this._sizeFixed = true;
            this._fixedToAligningWidth = false;
            this._aligningWidth = -1;
        }

        public fixSize(): void {
            var shouldAlign: boolean = this._aligningWidth !== -1;
            var switched: boolean = shouldAlign !== this._fixedToAligningWidth;

            if ((this._sizeFixed && !switched && !shouldAlign))
                return;

            if (this._aligningWidth === -1) {
                this._contentWidth += 1; // to avoid the ellipsis to appear (Issue with IE)
                this.setContentWidth(this._contentWidth);
            }
            else {
                this.setContentWidth(this._aligningWidth);
            }

            this._sizeFixed = true;
            this._fixedToAligningWidth = this._aligningWidth !== -1;
        }

        public clearSize(): void {
            this._contentWidth = -1;
            this.setContentWidth(this._contentWidth);
            this._sizeFixed = false;
        }

        public getContentContextualWidth(): number {
            return this._contentWidth;
        }

        public getCellIContentContextualWidth(cell: TablixCell): number {
            return this._presenter.getCellContentWidth(cell);
        }

        public getCellSpanningWidthWithScrolling(cell: ITablixCell, tablixGrid: TablixGrid): number {
            var width = this.getContextualWidth() + this.getScrollingOffset();

            if (cell.colSpan > 1) {
                var index = this.getIndex(tablixGrid);
                var columns = tablixGrid.realizedColumns;
                for (var i = 1; i < cell.colSpan; i++)
                    width += columns[i + index].getContextualWidth();
            }

            return width;
        }

        public getScrollingOffset(): number {
            var offset = 0;

            if (this._realizedColumnHeaders.length > 0)
                offset = this._realizedColumnHeaders[this._realizedColumnHeaders.length - 1].horizontalOffset;

            return offset;
        }

        public getContextualWidth(): number {
            if (this._width === -1 || this._contentWidth === -1)
                this._width = this._presenter.getWidth();

            return this._width;
        }

        public calculateSize(): void {
            if (this._sizeFixed)
                return;

            var contentWidth: number = 0;
            var count = this._realizedColumnHeaders.length;

            for (var i = 0; i < count; i++) {
                var cell: TablixCell = this._realizedColumnHeaders[i];
                if (cell.colSpan === 1)
                    contentWidth = Math.max(contentWidth, this._presenter.getCellContentWidth(cell));
            }

            count = this._realizedRowHeaders.length;

            for (var i = 0; i < count; i++) {
                var cell: TablixCell = this._realizedRowHeaders[i];
                if (cell.colSpan === 1)
                    contentWidth = Math.max(contentWidth, this._presenter.getCellContentWidth(cell));
            }

            count = this._realizedCornerCells.length;

            for (var i = 0; i < count; i++) {
                contentWidth = Math.max(contentWidth, this._presenter.getCellContentWidth(this._realizedCornerCells[i]));
            }

            count = this._realizedBodyCells.length;

            for (var i = 0; i < count; i++) {
                contentWidth = Math.max(contentWidth, this._presenter.getCellContentWidth(this._realizedBodyCells[i]));
            }

            if (this._footerCell !== null) {
                if (this._footerCell.colSpan === 1)
                    contentWidth = Math.max(contentWidth, this._presenter.getCellContentWidth(this._footerCell));
            }

            this._contentWidth = contentWidth;
        }

        public setAligningContextualWidth(size: number): void {
            this._aligningWidth = size;
        }

        public getAligningContextualWidth(): number {
            return this._aligningWidth;
        }

        private setContentWidth(value: number): void {
            var count = this._realizedColumnHeaders.length;

            for (var i = 0; i < count; i++) {
                var cell: TablixCell = this._realizedColumnHeaders[i];
                if (cell.colSpan === 1)
                    cell.setContentWidth(value);
            }

            count = this._realizedRowHeaders.length;

            for (var i = 0; i < count; i++) {
                var cell: TablixCell = this._realizedRowHeaders[i];
                if (cell.colSpan === 1)
                    cell.setContentWidth(value);
            }

            count = this._realizedCornerCells.length;

            for (var i = 0; i < count; i++) {
                this._realizedCornerCells[i].setContentWidth(value);
            }

            count = this._realizedBodyCells.length;

            for (var i = 0; i < count; i++) {
                this._realizedBodyCells[i].setContentWidth(value);
            }

            if (this._footerCell !== null) {
                if (this._footerCell.colSpan === 1)
                    this._footerCell.setContentWidth(value);
            }

            this._width = -1; // invalidate the cell width
        }

        public getTablixCell(): TablixCell {
            var realizedCells: TablixCell[] = this._realizedColumnHeaders.length > 0 ? this._realizedColumnHeaders : this._realizedCornerCells;
            //Debug.assert(realizedCells.length !== 0, "At least on header should have been realized");
            return realizedCells[realizedCells.length - 1];
        }

        public getIndex(grid: TablixGrid): number {
            return grid.realizedColumns.indexOf(this);
        }

        public getHeaders(): TablixCell[] {
            return this._realizedColumnHeaders;
        }

        public getOtherDimensionHeaders(): TablixCell[] {
            return this._realizedRowHeaders;
        }

        public getCellContextualSpan(cell: TablixCell): number {
            return cell.colSpan;
        }

        public getOtherDimensionOwner(cell: TablixCell): ITablixGridItem {
            return cell._row;
        }
    }

    export class TablixRow implements ITablixGridItem {
        private _allocatedCells: TablixCell[];

        public _realizedRowHeaders: TablixCell[]; // internal
        public _realizedColumnHeaders: TablixCell[]; // internal
        public _realizedBodyCells: TablixCell[]; // internal
        public _realizedCornerCells: TablixCell[]; // internal

        private _realizedCellsCount: number;
        private _heightFixed: boolean;
        private _contentHeight = -1;
        private _height: number;

        private _presenter: TablixRowPresenter;

        constructor(presenter: TablixRowPresenter) {
            this._presenter = presenter;
            this._presenter.initialize(this);
            this._allocatedCells = [];
            this._heightFixed = false;
            this._contentHeight = -1;
            this._height = -1;
        }

        public initialize(): void {
            this._realizedRowHeaders = [];
            this._realizedBodyCells = [];
            this._realizedCornerCells = [];
            this._realizedColumnHeaders = [];
            this._realizedCellsCount = 0;
        }

        public get presenter(): TablixRowPresenter {
            return this._presenter;
        }
                
        public releaseUnusedCells(owner: TablixControl) {
            this.releaseCells(owner, this._realizedCellsCount);
        }

        public releaseAllCells(owner: TablixControl) {
            this.releaseCells(owner, 0);
        }

        private releaseCells(owner: TablixControl, startIndex: number): void {
            var cells: TablixCell[] = this._allocatedCells;
            var length = cells.length;

            for (var i = startIndex; i < length; i++) {
                var cell = cells[i];
                owner._unbindCell(cell);
                cell.clear();
            }
        }

        public moveScrollableCellsToEnd(count: number): void {
            var frontIndex: number = Math.max(this._realizedRowHeaders.length, this._realizedCornerCells.length);

            for (var i = frontIndex; i < frontIndex + count; i++) {
                var cell = this._allocatedCells[i];
                this._presenter.onRemoveCell(cell);
                this._presenter.onAppendCell(cell);
                this._allocatedCells.push(cell);
            }

            this._allocatedCells.splice(frontIndex, count);
        }

        public moveScrollableCellsToStart(count: number): void {
            var frontIndex: number = Math.max(this._realizedRowHeaders.length, this._realizedCornerCells.length);

            for (var i = frontIndex; i < frontIndex + count; i++) {
                var cell = this._allocatedCells.pop();
                this._presenter.onRemoveCell(cell);
                this._presenter.onInsertCellBefore(cell, this._allocatedCells[frontIndex]);
                this._allocatedCells.splice(frontIndex, 0, cell);
            }
        }

        public getOrCreateCornerCell(column: TablixColumn): TablixCell {
            var cell: TablixCell = this.getOrCreateCell();
            cell.prepare(false);
            column.addCornerCell(cell);
            this._realizedCornerCells.push(cell);
            cell.setContentHeight(this._contentHeight);
            return cell;
        }

        public getOrCreateRowHeader(column: TablixColumn, scrollable: boolean, leaf: boolean): TablixCell {
            var cell: TablixCell = this.getOrCreateCell();
            cell.prepare(scrollable);
            column.addRowHeader(cell);
            this._realizedRowHeaders.push(cell);
            if (leaf)
                cell.setContentHeight(this._contentHeight);
            return cell;
        }

        public getOrCreateColumnHeader(column: TablixColumn, scrollable: boolean, leaf: boolean): TablixCell {
            var cell: TablixCell = this.getOrCreateCell();
            cell.prepare(scrollable);
            column.addColumnHeader(cell, leaf);
            this._realizedColumnHeaders.push(cell);
            cell.setContentHeight(this._contentHeight);
            return cell;
        }

        public getOrCreateBodyCell(column: TablixColumn, scrollable: boolean): TablixCell {
            var cell: TablixCell = this.getOrCreateCell();
            cell.prepare(scrollable);
            column.addBodyCell(cell);
            this._realizedBodyCells.push(cell);
            cell.setContentHeight(this._contentHeight);
            return cell;
        }

        public getOrCreateFooterRowHeader(column: TablixColumn): TablixCell {
            var cell: TablixCell = this.getOrCreateCell();
            cell.prepare(false);
            column.footer = cell;
            this._realizedRowHeaders.push(cell);
            cell.setContentHeight(this._contentHeight);
            return cell;
        }

        public getOrCreateFooterBodyCell(column: TablixColumn, scrollable: boolean): TablixCell {
            var cell: TablixCell = this.getOrCreateCell();
            cell.prepare(scrollable);
            column.footer = cell;
            this._realizedBodyCells.push(cell);
            cell.setContentHeight(this._contentHeight);
            return cell;
        }

        public getRowHeaderLeafIndex(): number {
            var index = -1;
            var count = this._allocatedCells.length;
            for (var i = 0; i < count; i++) {
                if (this._allocatedCells[i].type !== TablixCellType.RowHeader)
                    break;
                index++;
            }

            return index;
        }

        public getAllocatedCellAt(index: number) {
            return this._allocatedCells[index];
        }

        public moveCellsBy(delta: number) {
            if (this._allocatedCells.length === 0)
                return;

            if (delta > 0) {
                var refCell = this._allocatedCells[0];
                for (var i = 0; i < delta; i++) {
                    var cell: TablixCell = this.createCell(this);
                    this._presenter.onInsertCellBefore(cell, refCell);
                    this._allocatedCells.unshift(cell);
                    refCell = cell;
                }
            }
            else {
                delta = -delta;
                for (var i = 0; i < delta; i++) {
                    this._presenter.onRemoveCell(this._allocatedCells[i]);
                }
                this._allocatedCells.splice(0, delta);
            }
        }

        public getRealizedCellCount() {
            return this._realizedCellsCount;
        }

        public getRealizedHeadersCount(): number {
            return this._realizedRowHeaders.length;
        }

        public getRealizedHeaderAt(index: number) {
            return this._realizedRowHeaders[index];
        }

        public getTablixCell(): TablixCell {
            var realizedCells: TablixCell[];

            if (this._realizedRowHeaders.length > 0) {
                realizedCells = this._realizedRowHeaders;
            } else if (this._realizedCornerCells.length > 0) {
                realizedCells = this._realizedCornerCells;
            } else {
                realizedCells = this._realizedColumnHeaders;
            }

            //Debug.assert(realizedCells.length !== 0, "At least on header should have been realized");
            return realizedCells[realizedCells.length - 1];
        }

        public getOrCreateEmptySpaceCell(): TablixCell {
            var cell: TablixCell = this._allocatedCells[this._realizedCellsCount];
            if (cell === undefined) {
                cell = this.createCell(this);
                this._allocatedCells[this._realizedCellsCount] = cell;
                this._presenter.onAppendCell(cell);
            }
            return cell;
        }

        private createCell(row: TablixRow): TablixCell {
            var presenter = this._presenter.createCellPresenter();
            return new TablixCell(presenter, presenter, this);
        }

        private getOrCreateCell(): TablixCell {
            var cell: TablixCell = this._allocatedCells[this._realizedCellsCount];
            if (cell === undefined) {
                cell = this.createCell(this);
                this._allocatedCells[this._realizedCellsCount] = cell;
                this._presenter.onAppendCell(cell);
            } else {
                cell.colSpan = 1;
                cell.rowSpan = 1;
            }

            this._realizedCellsCount = this._realizedCellsCount + 1;
            return cell;
        }

        public fixSize(): void {
            if (this.sizeFixed())
                return;

            this.setContentHeight();
            this._heightFixed = true;
        }

        private clearSize(): void {
            this._contentHeight = -1;
            this.setContentHeight();
            this._heightFixed = false;
        }

        public getContentContextualWidth(): number {
            return this._contentHeight;
        }

        public getCellIContentContextualWidth(cell: TablixCell): number {
            return this.presenter.getCellContentHeight(cell);
        }

        public getCellSpanningHeight(cell: ITablixCell, tablixGrid: TablixGrid): number {
            var height = this.getContextualWidth();

            if (cell.rowSpan > 1) {
                var index = this.getIndex(tablixGrid);
                var rows = tablixGrid.realizedRows;
                for (var i = 1; i < cell.rowSpan; i++)
                    height += rows[i + index].getContextualWidth();
            }

            return height;
        }

        public getContextualWidth(): number {
            if (this._height === -1 || this._contentHeight === -1)
                this._height = this._presenter.getHeight();

            return this._height;
        }

        public sizeFixed(): boolean {
            return this._heightFixed;
        }

        public calculateSize(): void {
            if (this._heightFixed)
                return;

            var contentHeight: number = 0;
            var count = this._realizedRowHeaders.length;

            for (var i = 0; i < count; i++) {
                var cell: TablixCell = this._realizedRowHeaders[i];
                if (cell.rowSpan === 1)
                    contentHeight = Math.max(contentHeight, this._presenter.getCellContentHeight(cell));
            }

            count = this._realizedCornerCells.length;

            for (var i = 0; i < count; i++) {
                contentHeight = Math.max(contentHeight, this._presenter.getCellContentHeight(this._realizedCornerCells[i]));
            }

            count = this._realizedColumnHeaders.length;

            for (var i = 0; i < count; i++) {
                var cell: TablixCell = this._realizedColumnHeaders[i];
                if (cell.rowSpan === 1)
                    contentHeight = Math.max(contentHeight, this._presenter.getCellContentHeight(cell));
            }

            count = this._realizedBodyCells.length;

            for (var i = 0; i < count; i++) {
                contentHeight = Math.max(contentHeight, this._presenter.getCellContentHeight(this._realizedBodyCells[i]));
            }

            this._contentHeight = contentHeight;
        }

        public setAligningContextualWidth(size: number): void {
            // TODO should be implemented when we support variable row heights
        }

        public getAligningContextualWidth(): number {
            // TODO should be implemented when we support variable row heights
            return -1;
        }

        private setContentHeight(): void {
            var count = this._realizedRowHeaders.length;

            for (var i = 0; i < count; i++) {
                var cell: TablixCell = this._realizedRowHeaders[i];
                if (cell.rowSpan)
                    cell.setContentHeight(this._contentHeight);
            }

            count = this._realizedCornerCells.length;

            for (var i = 0; i < count; i++) {
                this._realizedCornerCells[i].setContentHeight(this._contentHeight);
            }

            count = this._realizedColumnHeaders.length;

            for (var i = 0; i < count; i++) {
                var cell: TablixCell = this._realizedColumnHeaders[i];
                if (cell.rowSpan === 1)
                    cell.setContentHeight(this._contentHeight);
            }

            count = this._realizedBodyCells.length;

            for (var i = 0; i < count; i++) {
                this._realizedBodyCells[i].setContentHeight(this._contentHeight);
            }

            this._height = -1;
        }

        public getIndex(grid: TablixGrid): number {
            return grid.realizedRows.indexOf(this);
        }

        public getHeaders(): TablixCell[] {
            return this._realizedRowHeaders;
        }

        public getOtherDimensionHeaders(): TablixCell[] {
            return this._realizedColumnHeaders;
        }

        public getCellContextualSpan(cell: TablixCell): number {
            return cell.rowSpan;
        }

        public getOtherDimensionOwner(cell: TablixCell): ITablixGridItem {
            return cell._column;
        }
    }

    export class TablixGrid {
        private _owner: TablixControl;

        private _rows: TablixRow[];
        private _realizedRows: TablixRow[];

        private _columns: TablixColumn[];
        private _realizedColumns: TablixColumn[];

        private _footerRow: TablixRow;

        private _emptySpaceHeaderCell: TablixCell;
        private _emptyFooterSpaceCell: TablixCell;

        public _presenter: TablixGridPresenter; // internal

        private _fillColumnsProportionally: boolean;

        constructor(presenter: TablixGridPresenter) {
            this._presenter = presenter;
            this._footerRow = null;
        }
            
        public initialize(owner: TablixControl, gridHost: HTMLElement, footerHost: HTMLElement) {
            this._owner = owner;
            this._presenter.initialize(this, gridHost, footerHost, owner);
            this.fillColumnsProportionally = false;
            this._realizedRows = [];
            this._realizedColumns = [];
            this._emptySpaceHeaderCell = null;
            this._emptyFooterSpaceCell = null;
        }

        public set fillColumnsProportionally(value: boolean) {
            if (this._fillColumnsProportionally === value)
                return;

            this._fillColumnsProportionally = value;
            this._presenter.onFillColumnsProportionallyChanged(value);
        }

        public get fillColumnsProportionally(): boolean {
            return this._fillColumnsProportionally;
        }

        public get realizedColumns(): TablixColumn[] {
            return this._realizedColumns;
        }

        public get realizedRows(): TablixRow[] {
            return this._realizedRows;
        }

        public get footerRow(): TablixRow {
            return this._footerRow;
        }

        public get emptySpaceHeaderCell(): TablixCell {
            return this._emptySpaceHeaderCell;
        }

        public get emptySpaceFooterCell(): TablixCell {
            return this._emptyFooterSpaceCell;
        }

        public ShowEmptySpaceCells(rowSpan: number, width: number): void {
            if (this._realizedRows.length === 0) 
                return;
            
            if (this._realizedRows.length !== 0 && !this._emptySpaceHeaderCell) {
                this._emptySpaceHeaderCell = this._realizedRows[0].getOrCreateEmptySpaceCell();
                this._emptySpaceHeaderCell.rowSpan = rowSpan;
                this._emptySpaceHeaderCell.colSpan = 1;
                this._emptySpaceHeaderCell.setContentWidth(width);
            }

            if (this._footerRow && (this._emptyFooterSpaceCell === null)) {
                this._emptyFooterSpaceCell = this._footerRow.getOrCreateEmptySpaceCell();
                this._emptyFooterSpaceCell.rowSpan = 1;
                this._emptyFooterSpaceCell.colSpan = 1;
                this._emptyFooterSpaceCell.setContentWidth(width);
            }
        }

        public HideEmptySpaceCells(): void {
            if (this._emptySpaceHeaderCell) {
                this._emptySpaceHeaderCell.clear();
                this._emptySpaceHeaderCell = null;
            }

            if (this._emptyFooterSpaceCell) {
                this._emptyFooterSpaceCell.clear();
                this._emptyFooterSpaceCell = null;
            }
        }

        public onStartRenderingIteration(clear: boolean): void {
            this.initializeRows(clear);
            this.initializeColumns(clear);
        }

        public onEndRenderingIteration(): void {
            var rows: TablixRow[] = this._rows;
            if (rows !== undefined) {
                var rowCount = rows.length;
                for (var i = 0; i < rowCount; i++) {
                    rows[i].releaseUnusedCells(this._owner);
                }
            }

            if (this._footerRow) {
                this._footerRow.releaseUnusedCells(this._owner);
            }
        }

        public onStartRenderingSession(): void {

        }

        public onEndRenderingSession(): void {
        }

        public getOrCreateRow(rowIndex: number): TablixRow {
            var currentRow: TablixRow = this._rows[rowIndex];
            if (currentRow === undefined) {
                currentRow = new TablixRow(this._presenter.createRowPresenter());
                currentRow.initialize();
                this._presenter.onAppendRow(currentRow);
                this._rows[rowIndex] = currentRow;
            }

            if (this._realizedRows[rowIndex] === undefined) {
                this._realizedRows[rowIndex] = currentRow;
            }

            return currentRow;
        }

        public getOrCreateFootersRow(): TablixRow {
            if (this._footerRow === null) {
                this._footerRow = new TablixRow(this._presenter.createRowPresenter());
                this._footerRow.initialize();
                this._presenter.onAddFooterRow(this._footerRow);
            }
            return this._footerRow;
        }

        public moveRowsToEnd(moveFromIndex: number, count: number) {
            for (var i = 0; i < count; i++) {
                var row = this._rows[i + moveFromIndex];
                debug.assertValue(row, "Invalid Row Index");
                this._presenter.onRemoveRow(row);
                this._presenter.onAppendRow(row);
                this._rows.push(row);
            }

            this._rows.splice(moveFromIndex, count);
        }

        public moveRowsToStart(moveToIndex: number, count: number) {
            var refRow = this._rows[moveToIndex];
            debug.assertValue(refRow, "Invalid Row Index");

            for (var i = 0; i < count; i++) {
                var row = this._rows.pop();
                this._presenter.onRemoveRow(row);
                this._presenter.onInsertRowBefore(row, refRow);
                this._rows.splice(moveToIndex + i, 0, row);
            }
        }

        public moveColumnsToEnd(moveFromIndex: number, count: number) {
            var firstCol: number = this._rows[0]._realizedCornerCells.length;
            var leafStartDepth: number = Math.max(this._columns[firstCol]._realizedColumnHeaders.length - 1, 0);

            for (var i = leafStartDepth; i < this._rows.length; i++) {
                this._rows[i].moveScrollableCellsToEnd(count);
            }

            for (var i = 0; i < count; i++) {
                var column = this._columns[i + moveFromIndex];
                //Debug.assertValue(column, "Invalid Column Index");
                this._columns.push(column);
            }

            this._columns.splice(moveFromIndex, count);
        }

        public moveColumnsToStart(moveToIndex: number, count: number) {
            var firstCol: number = this._rows[0]._realizedCornerCells.length;
            var leafStartDepth: number = Math.max(this._columns[firstCol]._realizedColumnHeaders.length - 1, 0);

            for (var i = leafStartDepth; i < this._rows.length; i++) {
                this._rows[i].moveScrollableCellsToStart(count);
            }

            var refColumn = this._columns[moveToIndex];
            //Debug.assertValue(refColumn, "Invalid Column Index");

            for (var i = 0; i < count; i++) {
                var column = this._columns.pop();
                this._columns.splice(moveToIndex + i, 0, column);
            }
        }

        public getOrCreateColumn(columnIndex: number): TablixColumn {
            var currentColumn: TablixColumn = this._columns[columnIndex];
            if (currentColumn === undefined) {
                currentColumn = new TablixColumn(this._presenter.createColumnPresenter());
                this._columns[columnIndex] = currentColumn;
            }

            if (this._realizedColumns[columnIndex] === undefined) {
                this._realizedColumns[columnIndex] = currentColumn;
            }

            return currentColumn;
        }

        private initializeColumns(clear: boolean): void {
            if (this._columns === undefined || clear) {
                this._columns = [];
            }

            var length: number = this._columns.length;

            for (var i = 0; i < length; i++) {
                this._columns[i].initialize();
            }

            this._realizedColumns = [];
        }

        private initializeRows(clear: boolean): void {
            //make sure rowDimension confirms it and it's not null in the grid
            var hasFooter: boolean = this._owner.rowDimension.hasFooter() && (this._footerRow !== null);

            if (clear) {
                var rows: TablixRow[] = this._rows;
                if (rows) {
                    var length = rows.length;
                    for (var i = 0; i < length; i++) {
                        rows[i].releaseAllCells(this._owner);
                    }

                    if (hasFooter) 
                        this._footerRow.releaseAllCells(this._owner);
                    
                    this._presenter.onClear();
                    this._footerRow = null;
                    this._rows = null;
                }
            }

            this._realizedRows = [];

            if (!this._rows) {
                this._rows = [];
            }

            var rows: TablixRow[] = this._rows;
            var length: number = rows.length;

            for (var i = 0; i < length; i++) {
                rows[i].initialize();
            }

            if (hasFooter) {
                if (!this._footerRow) {
                    this.getOrCreateFootersRow();
                }
                this._footerRow.initialize();
            }
        }
                
        public getWidth(): number {
            return this._presenter.getWidth();
        }

        public getHeight(): number {
            return this._presenter.getHeight();
        }
    }
}