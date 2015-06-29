//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals.controls {

    export interface TablixRenderArgs {
        rowScrollOffset?: number;
        columnScrollOffset?: number;
        scrollingDimension?: TablixDimension;
    }

    export interface GridDimensions {
        rowCount?: number;
        columnCount?: number;
        rowHierarchyWidth?: number;
        rowHierarchyHeight?: number;
        rowHierarchyContentHeight?: number;
        columnHierarchyWidth?: number;
        columnHierarchyHeight?: number;
        footerHeight?: number;
    }

    export interface TablixOptions {
        interactive?: boolean;
        enableTouchSupport?: boolean;
    }

    export class TablixControl {
        private static UnitOfMeasurement = 'px';
        private static MouseWheelRange = 120;

        private _hierarchyNavigator: ITablixHierarchyNavigator;
        private _binder: ITablixBinder;

        private _columnDimension: TablixColumnDimension;
        private _rowDimension: TablixRowDimension;
        private _layoutManager: internal.TablixLayoutManager;

        private _container: HTMLDivElement;
        private _mainDiv: HTMLDivElement;
        private _footerDiv: HTMLDivElement;

        private _scrollbarWidth = 9;
        private _fixSizedClassName = "bi-tablix-fixed-size";

        private _touchManager: TouchUtils.TouchManager;
        private _columnTouchDelegate: ColumnTouchDelegate;
        private _rowTouchDelegate: RowTouchDelegate;
        private _bodyTouchDelegate: BodyTouchDelegate;
        private _footerTouchDelegate: ColumnTouchDelegate;
        private _touchInterpreter: TouchUtils.TouchEventInterpreter;
        private _footerTouchInterpreter: TouchUtils.TouchEventInterpreter;

        private _gridDimensions: GridDimensions;
        private _lastRenderingArgs: TablixRenderArgs;

        private _autoSizeWidth: boolean;
        private _autoSizeHeight: boolean;
        private _width: number;
        private _maxWidth: number;
        private _maxHeight: number;
        private _height: number;
        private _minWidth: number;
        private _minHeight: number;

        private _options: TablixOptions;
        private _isTouchEnabled: boolean;

        private _renderIterationCount: number;

        constructor(
            hierarchyNavigator: ITablixHierarchyNavigator,
            binder: ITablixBinder,
            parentDomElement: HTMLElement,
            options: TablixOptions) {

            // Options
            this._options = options;
            var isInteractive = options.interactive;
            this._isTouchEnabled = isInteractive && options.enableTouchSupport;

            // Main Div
            this._mainDiv = internal.TablixUtils.createDiv();
            var mainDivStyle = this._mainDiv.style;
            mainDivStyle.position = "absolute";
            mainDivStyle.left = "0px";
            mainDivStyle.top = "0px";

            // Footer Div
            this._footerDiv = internal.TablixUtils.createDiv();
            var footerDivStyle = this._footerDiv.style;
            footerDivStyle.position = "absolute";
            footerDivStyle.left = "0px";

            if (this._isTouchEnabled)
                this.InitializeTouchSupport();

            this._gridDimensions = {};

            this._container = internal.TablixUtils.createDiv();
            this.className = "bi-tablix";
            this.autoSizeWidth = false;
            this.autoSizeHeight = false;

            parentDomElement.appendChild(this._container);
            this._container.addEventListener("mousewheel", (e) => { this.onMouseWheel(<MouseWheelEvent>e); });
            this._container.addEventListener("DOMMouseScroll", (e) => { this.onFireFoxMouseWheel(<MouseWheelEvent>e); });
            this._container.appendChild(this._mainDiv);
            this._container.appendChild(this._footerDiv);

            if (this._isTouchEnabled) {
                this._touchInterpreter.initTouch(this._mainDiv, null, false);
                this._footerTouchInterpreter.initTouch(this._footerDiv, this._mainDiv, false);
            }

            // Create Layout Manager
            this._layoutManager = new internal.TablixLayoutManager(
                new internal.TablixGrid(new internal.TablixGridPresenter()),
                new internal.RowRealizationManager(binder),
                new internal.ColumnRealizationManager(binder));

            this._layoutManager.initialize(this);

            this._hierarchyNavigator = hierarchyNavigator;
            this._binder = binder;

            this._columnDimension = new TablixColumnDimension(this);
            this._rowDimension = new TablixRowDimension(this);
            this._columnDimension._otherDimension = this.rowDimension;
            this._rowDimension._otherDimension = this.columnDimension;

            this.InitializeScrollbars();
            if (!isInteractive) {
                this.scrollbarWidth = 0;
            }

            this.updateHorizontalPosition();
            this.updateVerticalPosition();

            this.updateFooterVisibility();

            this._lastRenderingArgs = {};
        }

        private InitializeTouchSupport(): void {
            this._touchManager = new TouchUtils.TouchManager();
            this._touchInterpreter = new TouchUtils.TouchEventInterpreter(this._touchManager);
            this._footerTouchInterpreter = new TouchUtils.TouchEventInterpreter(this._touchManager);
            this._columnTouchDelegate = new ColumnTouchDelegate(new TouchUtils.Rectangle());
            this._rowTouchDelegate = new RowTouchDelegate(new TouchUtils.Rectangle());
            this._bodyTouchDelegate = new BodyTouchDelegate(new TouchUtils.Rectangle());
            this._footerTouchDelegate = new ColumnTouchDelegate(new TouchUtils.Rectangle());

            this._columnTouchDelegate.setHandler(this, this.onTouchEvent);
            this._rowTouchDelegate.setHandler(this, this.onTouchEvent);
            this._bodyTouchDelegate.setHandler(this, this.onTouchEvent);
            this._footerTouchDelegate.setHandler(this, this.onTouchEvent);

            this._touchManager.addTouchRegion(this._columnTouchDelegate.dimension, this._columnTouchDelegate, this._columnTouchDelegate);
            this._touchManager.addTouchRegion(this._rowTouchDelegate.dimension, this._rowTouchDelegate, this._rowTouchDelegate);
            this._touchManager.addTouchRegion(this._bodyTouchDelegate.dimension, this._bodyTouchDelegate, this._bodyTouchDelegate);
            this._touchManager.addTouchRegion(this._footerTouchDelegate.dimension, this._footerTouchDelegate, this._footerTouchDelegate);
        }

        private InitializeScrollbars(): void {
            // Row Dimension
            this._rowDimension._initializeScrollbar(this._container, null);

            var rowDimensionScrollbarStyle = this._rowDimension.scrollbar.element.style;
            rowDimensionScrollbarStyle.position = "absolute";
            rowDimensionScrollbarStyle.top = "0" + TablixControl.UnitOfMeasurement;
            rowDimensionScrollbarStyle.right = "0" + TablixControl.UnitOfMeasurement;
            this._rowDimension.scrollbar.width = this._scrollbarWidth + TablixControl.UnitOfMeasurement;

            this._rowDimension.scrollbar.show(false);

            // Column Dimension
            this._columnDimension._initializeScrollbar(this._container, null);

            var columnDimensionScrollbarStyle = this._columnDimension.scrollbar.element.style;
            columnDimensionScrollbarStyle.position = "absolute";
            columnDimensionScrollbarStyle.left = "0" + TablixControl.UnitOfMeasurement;
            columnDimensionScrollbarStyle.bottom = "0" + TablixControl.UnitOfMeasurement;
            this._columnDimension.scrollbar.height = this._scrollbarWidth + TablixControl.UnitOfMeasurement;

            this._columnDimension.scrollbar.show(false);
        }

        public get container(): HTMLElement {
            return this._container;
        }

        public get contentHost(): HTMLElement {
            return this._mainDiv;
        }

        public get footerHost(): HTMLElement {
            return this._footerDiv;
        }

        public set className(value: string) {
            this._container.className = value;
        }

        public get hierarchyNavigator(): ITablixHierarchyNavigator {
            return this._hierarchyNavigator;
        }

        public get binder(): ITablixBinder {
            return this._binder;
        }

        public get autoSizeWidth(): boolean {
            return this._autoSizeWidth;
        }

        public set autoSizeWidth(value: boolean) {
            this._autoSizeWidth = value;

            if (this._autoSizeWidth) {
                this.removeFixSizedClassName();
            } else {
                this.addFixedSizeClassNameIfNeeded();
                this._container.style.minWidth = this._container.style.maxWidth = "none";
            }
        }

        public get autoSizeHeight(): boolean {
            return this._autoSizeHeight;
        }

        public set autoSizeHeight(value: boolean) {
            this._autoSizeHeight = value;

            if (this._autoSizeHeight) {
                this.removeFixSizedClassName();
            } else {
                this.addFixedSizeClassNameIfNeeded();
                this._container.style.minHeight = this._container.style.maxHeight = "none";
            }
        }

        public get height(): number {
            return this._height;
        }

        public set height(value: number) {
            this._height = value;
            this._container.style.height = this._height + TablixControl.UnitOfMeasurement;

            this._rowDimension.scrollbar.invalidateArrange();
        }

        public get maxWidth(): number {
            return this._maxWidth;
        }

        public set maxWidth(value: number) {
            this._maxWidth = value;
            this._container.style.maxWidth = this._maxWidth + TablixControl.UnitOfMeasurement;
        }

        public get width(): number {
            return this._width;
        }

        public set width(value: number) {
            this._width = value;
            this._container.style.width = this._width + TablixControl.UnitOfMeasurement;

            this._columnDimension.scrollbar.invalidateArrange();
        }

        public get maxHeight(): number {
            return this._maxHeight;
        }

        public set maxHeight(value: number) {
            this._maxHeight = value;
            this._container.style.maxHeight = this._maxHeight + TablixControl.UnitOfMeasurement;
        }

        public get minWidth(): number {
            return this._minWidth;
        }

        public set minWidth(value: number) {
            this._minWidth = value;
            this._container.style.minWidth = this._minWidth + TablixControl.UnitOfMeasurement;
        }

        public get minHeight(): number {
            return this._minHeight;
        }

        public set minHeight(value: number) {
            this._minHeight = value;
            this._container.style.minHeight = this._minHeight + TablixControl.UnitOfMeasurement;
        }

        public set scrollbarWidth(value: number) {
            this._scrollbarWidth = value;
            this._rowDimension.scrollbar.width = this._scrollbarWidth + TablixControl.UnitOfMeasurement;
            this._columnDimension.scrollbar.height = this._scrollbarWidth + TablixControl.UnitOfMeasurement;
        }

        public updateColumnDimensions(rowHierarchyWidth: number, columnHierarchyWidth: number, count: number) {
            var gridDimensions = this._gridDimensions;

            gridDimensions.columnCount = count;
            gridDimensions.rowHierarchyWidth = rowHierarchyWidth;
            gridDimensions.columnHierarchyWidth = columnHierarchyWidth;
        }

        public updateRowDimensions(columnHierarchyHeight: number, rowHierarchyHeight: number, rowHierarchyContentHeight: number, count: number, footerHeight) {
            var gridDimensions = this._gridDimensions;

            gridDimensions.rowCount = count;
            gridDimensions.rowHierarchyHeight = rowHierarchyHeight;
            gridDimensions.rowHierarchyContentHeight = rowHierarchyContentHeight;
            gridDimensions.columnHierarchyHeight = columnHierarchyHeight;
            gridDimensions.footerHeight = footerHeight;
        }

        private updateTouchDimensions(): void {
            var gridDimensions = this._gridDimensions;

            this._columnTouchDelegate.resize(gridDimensions.rowHierarchyWidth, 0, gridDimensions.columnHierarchyWidth, gridDimensions.columnHierarchyHeight);
            this._columnTouchDelegate.setScrollDensity(gridDimensions.columnCount / gridDimensions.columnHierarchyWidth);

            this._rowTouchDelegate.resize(0, gridDimensions.columnHierarchyHeight, gridDimensions.rowHierarchyWidth, gridDimensions.rowHierarchyHeight);
            this._rowTouchDelegate.setScrollDensity(gridDimensions.rowCount / gridDimensions.rowHierarchyHeight);

            this._bodyTouchDelegate.resize(gridDimensions.rowHierarchyWidth, gridDimensions.columnHierarchyHeight,
                gridDimensions.columnHierarchyWidth, gridDimensions.rowHierarchyHeight);
            this._bodyTouchDelegate.setScrollDensity(gridDimensions.columnCount / gridDimensions.columnHierarchyWidth,
                gridDimensions.rowCount / gridDimensions.rowHierarchyHeight);

            this._footerTouchDelegate.resize(gridDimensions.rowHierarchyWidth, gridDimensions.columnHierarchyHeight + gridDimensions.rowHierarchyHeight, gridDimensions.columnHierarchyWidth, gridDimensions.footerHeight);
            this._footerTouchDelegate.setScrollDensity(gridDimensions.columnCount / gridDimensions.columnHierarchyWidth);
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
            if (delta < 0) { // fix for issue 786411 (Some machines won't have the delta as multiple of 120)
                delta = Math.min(-TablixControl.MouseWheelRange, delta);
            }
            else if (delta > 0) {
                delta = Math.max(TablixControl.MouseWheelRange, delta);
            }

            var dimension = null;

            if (this._rowDimension.scrollbar.visible) {
                dimension = this._rowDimension;
            }
            else if (this._columnDimension.scrollbar.visible) {
                dimension = this._columnDimension;
            }

            if (dimension) {
                dimension.scrollOffset -= (delta / TablixControl.MouseWheelRange) * dimension.scrollbar.smallIncrement;
                dimension.scrollOffset = Math.max(dimension.scrollOffset, 0);
                dimension.scrollbar.viewMin = dimension.scrollOffset;

                this._onScrollAsync(dimension);
            }
        }

        public get layoutManager(): internal.TablixLayoutManager {
            return this._layoutManager;
        }

        public get columnDimension(): TablixColumnDimension {
            return this._columnDimension;
        }

        public get rowDimension(): TablixRowDimension {
            return this._rowDimension;
        }

        public refresh(clear: boolean): void {
            this.render(clear, null);
        }

        public _onScrollAsync(dimension: TablixDimension): void { // The intent is to be internal
            requestAnimationFrame(() => { this.performPendingScroll(dimension); });
        }

        private performPendingScroll(dimension: TablixDimension): void {
            this.render(false, dimension);
        }

        private updateHorizontalPosition(): void {
            if (this._rowDimension.scrollbar.visible) {
                this._columnDimension.scrollbar.element.style.right = this._scrollbarWidth + TablixControl.UnitOfMeasurement;
                this._footerDiv.style.right = this._scrollbarWidth + TablixControl.UnitOfMeasurement;
                this._mainDiv.style.right = this._scrollbarWidth + TablixControl.UnitOfMeasurement;
            } else {
                this._columnDimension.scrollbar.element.style.right = "0" + TablixControl.UnitOfMeasurement;
                this._mainDiv.style.right = "0" + TablixControl.UnitOfMeasurement;
                this._footerDiv.style.right = "0" + TablixControl.UnitOfMeasurement;
            }
        }

        public updateFooterVisibility() {
            if (this._rowDimension.hasFooter() ? (this._footerDiv.style.display !== "block") : (this._footerDiv.style.display !== "none")) {
                if (this._rowDimension.hasFooter()) {
                    this._footerDiv.style.display = "block";
                } else {
                    this._footerDiv.style.display = "none";
                }
            }
        }

        private updateVerticalPosition(): void {
            var footerHeight: number = 0;

            if (this._rowDimension.hasFooter()) {
                footerHeight = this._gridDimensions.footerHeight;
            }

            var hasSpaceForFooter = this._gridDimensions.rowHierarchyContentHeight <= this._gridDimensions.rowHierarchyHeight + this._gridDimensions.footerHeight;

            if (this._columnDimension.scrollbar.visible) {
                this._rowDimension.scrollbar.element.style.bottom = this._scrollbarWidth + TablixControl.UnitOfMeasurement;
                if (!hasSpaceForFooter) {
                    this._footerDiv.style.bottom = this._scrollbarWidth + TablixControl.UnitOfMeasurement;
                    this._mainDiv.style.bottom = this._scrollbarWidth + footerHeight + TablixControl.UnitOfMeasurement;
                    this._footerDiv.style.removeProperty("top");
                }
            } else {
                this._rowDimension.scrollbar.element.style.bottom = "0" + TablixControl.UnitOfMeasurement;
                if (!hasSpaceForFooter) {
                    this._mainDiv.style.bottom = footerHeight + TablixControl.UnitOfMeasurement;
                    this._footerDiv.style.bottom = "0" + TablixControl.UnitOfMeasurement;
                    this._footerDiv.style.removeProperty("top");
                }
            }
            if (hasSpaceForFooter) {
                this._footerDiv.style.top = this._gridDimensions.rowHierarchyContentHeight + TablixControl.UnitOfMeasurement;
                this._footerDiv.style.removeProperty("bottom");
                this._mainDiv.style.removeProperty("bottom");
            }

            this._footerDiv.style.height = footerHeight + TablixControl.UnitOfMeasurement;
        }

        private alreadyRendered(scrollingDimension: TablixDimension): boolean {
            if (scrollingDimension !== this._lastRenderingArgs.scrollingDimension ||
                this.rowDimension.scrollOffset !== this._lastRenderingArgs.rowScrollOffset ||
                this.columnDimension.scrollOffset !== this._lastRenderingArgs.columnScrollOffset) {
                return false;
            }

            return true;
        }

        private render(clear: boolean, scrollingDimension: TablixDimension): void {
            // at time of rendering always ensure the scroll offset is valid
            this._columnDimension.makeScrollOffsetValid();
            this._rowDimension.makeScrollOffsetValid();

            if (clear || scrollingDimension === null) {
                this._lastRenderingArgs = {};
            } else if (this.alreadyRendered(scrollingDimension)) {
                return;
            }

            var done = false;
            this._renderIterationCount = 0;

            this._layoutManager.onStartRenderingSession(scrollingDimension);
            var binder: ITablixBinder = this._binder;
            binder.onStartRenderingSession(this._layoutManager.columnLayoutManager.measureEnabled || this._layoutManager.rowLayoutManager.measureEnabled ? this._mainDiv : null);

            var priorFooterHeight: number = this._gridDimensions.footerHeight;
            var priorRowHierarchyHeight: number = this._gridDimensions.rowHierarchyHeight;
            var priorRowHierarchyContentHeight: number = this._gridDimensions.rowHierarchyContentHeight;

            while (!done) {
                var hScrollbarVisibility = this._columnDimension.scrollbar.visible;
                var vScrollbarVisibility = this._rowDimension.scrollbar.visible;

                this._columnDimension._onStartRenderingIteration(clear);  // TODO clearing should happen only once before the loop
                this._rowDimension._onStartRenderingIteration(clear);
                this._layoutManager.onStartRenderingIteration(clear);

                // These calls add cells to the table.
                // Column needs to be rendered before rows as the row call will pair up with columns to produce the body cells.
                this.renderCorner();
                this._columnDimension._render();
                this._rowDimension._render();

                done = this._layoutManager.onEndRenderingIteration();
                this._columnDimension._onEndRenderingIteration();
                this._rowDimension._onEndRenderingIteration();

                if ((hScrollbarVisibility !== this._columnDimension.scrollbar.visible)) {
                    this.updateVerticalPosition();
                }
                if (vScrollbarVisibility !== this._rowDimension.scrollbar.visible) {
                    this.updateHorizontalPosition();
                }

                this._renderIterationCount++;
            }

            this._layoutManager.onEndRenderingSession();
            binder.onEndRenderingSession();

            if (this._isTouchEnabled)
                this.updateTouchDimensions();

            this._lastRenderingArgs.rowScrollOffset = this.rowDimension.scrollOffset;
            this._lastRenderingArgs.columnScrollOffset = this.columnDimension.scrollOffset;

            this.updateContainerDimensions();

            if (this._options.interactive) {
                this._columnDimension.scrollbar.refresh();
                this._rowDimension.scrollbar.refresh();
            }

            var lastRenderingArgs = this._lastRenderingArgs;
            lastRenderingArgs.rowScrollOffset = this.rowDimension.scrollOffset;
            lastRenderingArgs.columnScrollOffset = this.columnDimension.scrollOffset;
            lastRenderingArgs.scrollingDimension = scrollingDimension;

            if (priorFooterHeight !== this._gridDimensions.footerHeight ||
                priorRowHierarchyHeight !== this._gridDimensions.rowHierarchyHeight ||
                priorRowHierarchyContentHeight !== this._gridDimensions.rowHierarchyContentHeight) {
                this.updateVerticalPosition();
            }
        }

        private updateContainerDimensions(): void {
            var gridDimensions = this._gridDimensions;

            if (this._autoSizeWidth) {
                var vScrollBarWidth: number = this._rowDimension.scrollbar.visible ? this._scrollbarWidth : 0;
                this._container.style.width =
                gridDimensions.rowHierarchyWidth +
                gridDimensions.columnHierarchyWidth +
                vScrollBarWidth +
                TablixControl.UnitOfMeasurement;
            }

            if (this._autoSizeHeight) {
                var hScrollBarHeight: number = this._columnDimension.scrollbar.visible ? this._scrollbarWidth : 0;
                this._container.style.height =
                gridDimensions.columnHierarchyHeight +
                gridDimensions.rowHierarchyHeight +
                gridDimensions.footerHeight +
                hScrollBarHeight +
                TablixControl.UnitOfMeasurement;
            }
        }

        private cornerCellMatch(item: any, cell: ITablixCell): boolean {
            var previousItem: any = cell.item;
            return cell.type === TablixCellType.CornerCell && previousItem && this._hierarchyNavigator.cornerCellItemEquals(item, previousItem);
        }

        private renderCorner(): void {
            var columnDepth: number = this._columnDimension.getDepth();
            var rowDepth: number = this._rowDimension.getDepth();

            for (var i = 0; i < columnDepth; i++) {
                for (var j = 0; j < rowDepth; j++) {
                    var item = this._hierarchyNavigator.getCorner(j, i);
                    var cell: ITablixCell = this._layoutManager.getOrCreateCornerCell(item, j, i);
                    var match = this.cornerCellMatch(item, cell);
                    if (!match) {
                        this._unbindCell(cell);
                        cell.type = TablixCellType.CornerCell;
                        cell.item = item;

                        this._binder.bindCornerCell(item, cell);
                    }
                    this._layoutManager.onCornerCellRealized(item, cell);
                }
            }
        }

        public _unbindCell(cell: ITablixCell): void { // The intent is to be internal
            switch (cell.type) {
                case TablixCellType.BodyCell:
                    this._binder.unbindBodyCell(cell.item, cell);
                    break;
                case TablixCellType.ColumnHeader:
                    this._binder.unbindColumnHeader(cell.item, cell);
                    break;
                case TablixCellType.RowHeader:
                    this._binder.unbindRowHeader(cell.item, cell);
                    break;
                case TablixCellType.CornerCell:
                    this._binder.unbindCornerCell(cell.item, cell);
            }

            cell.item = null;
            cell.type = null;
        }

        private onTouchEvent(args: any[]): void {
            var colShift: number;
            var rowShift: number;
            var that: TablixControl;

            if ((args) && (args.length > 0)) {
                if (("_columnDimension" in args[0]) && ("_rowDimension" in args[0])) {
                    that = <TablixControl> args[0];
                    colShift = that._columnDimension.scrollbar.visible ? <number> args[1] : 0;
                    rowShift = that._rowDimension.scrollbar.visible ? <number> args[2] : 0;

                    that._columnDimension.scrollbar.viewMin = Math.max(0, that._columnDimension.scrollbar.viewMin + colShift);
                    that._columnDimension.scrollOffset = Math.max(0, that._columnDimension.scrollOffset + colShift);
                    that._rowDimension.scrollbar.viewMin = Math.max(0, that._rowDimension.scrollbar.viewMin + rowShift);
                    that._rowDimension.scrollOffset = Math.max(0, that._rowDimension.scrollOffset + rowShift);

                    if (colShift === 0) {
                        that._onScrollAsync(that._rowDimension);
                    } else if (rowShift === 0) {
                        that._onScrollAsync(that._columnDimension);
                    } else {
                        that._onScrollAsync(null);
                    }
                }
            }
        }

        private addFixedSizeClassNameIfNeeded(): void {
            if (!this._autoSizeHeight && !this._autoSizeWidth && this._container.className.indexOf(this._fixSizedClassName) === -1) {
                this._container.className += " " + this._fixSizedClassName;
            }
        }

        private removeFixSizedClassName(): void {
            this._container.className = this._container.className.replace(this._fixSizedClassName, '');
        }
    }
}