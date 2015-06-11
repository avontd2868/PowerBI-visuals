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

    export class TablixDimension {
        public _hierarchyNavigator: ITablixHierarchyNavigator;
        public _otherDimension; // internal

        public _owner: TablixControl; // protected
        public _binder: ITablixBinder; // protected
        public _tablixLayoutManager: internal.TablixLayoutManager; // protected
        public _layoutManager: IDimensionLayoutManager; // protected

        public model: any;

        public scrollOffset: number;
        private _scrollStep: number = 0.1;

        private _firstVisibleScrollIndex: number;
        private _scrollbar: Scrollbar;
        public _scrollItems: any[]; // protected

        constructor(tablixControl: TablixControl) {
            this._owner = tablixControl;
            this._hierarchyNavigator = tablixControl.hierarchyNavigator;
            this._binder = tablixControl.binder;
            this._tablixLayoutManager = tablixControl.layoutManager;
            this.scrollOffset = 0;
        }

        public _onStartRenderingIteration(clear: boolean): void { // The intent to be internal
            this.updateScrollPosition();
        }

        public _onEndRenderingIteration(): void { // The intent to be internal
        }

        public getValidScrollOffset(scrollOffset: number): number {
            return Math.min(Math.max(scrollOffset, 0), Math.max(this.getItemsCount() - this._scrollStep, 0));
        }

        public makeScrollOffsetValid(): void {
            this.scrollOffset = this.getValidScrollOffset(this.scrollOffset);
        }

        public getIntegerScrollOffset(): number {
            return Math.floor(this.scrollOffset);
        }

        public getFractionScrollOffset(): number {
            return this.scrollOffset - this.getIntegerScrollOffset();
        }

        public get scrollbar(): Scrollbar {
            return this._scrollbar;
        }

        public getFirstVisibleItem(level: number): any {
            return this._scrollItems[level];
        }

        public getFirstVisibleChild(item: any): any {
            return this._hierarchyNavigator.getAt(this._hierarchyNavigator.getChildren(item), this.getFirstVisibleChildIndex(item));
        }

        public getFirstVisibleChildIndex(item: any): number {
            var startItem: any = this.getFirstVisibleItem(this._hierarchyNavigator.getLevel(item) + 1);
            var firstVisibleIndex: number;

            if (startItem === undefined || (startItem !== undefined && this._hierarchyNavigator.getParent(startItem) !== item)) {
                firstVisibleIndex = 0;
            } else {
                firstVisibleIndex = this._hierarchyNavigator.getIndex(startItem);
            }
            return firstVisibleIndex;
        }

        public _initializeScrollbar(parentElement: HTMLElement, touchDiv: HTMLDivElement) { // The intent to be internal
            this._scrollbar = this._createScrollbar(parentElement);
            this._scrollbar._onscroll.push((e) => this.onScroll());

            if (touchDiv) {
                this.scrollbar.initTouch(touchDiv, true);
                touchDiv.style.setProperty("-ms-touch-action", "pinch-zoom");
            }
        }

        public getItemsCount(): number {
            return this.model ? this._hierarchyNavigator.getLeafCount(this.model) : 0;
        }

        public getDepth(): number {
            return this.model ? this._hierarchyNavigator.getDepth(this.model) : 0;
        }

        private onScroll() {
            this.scrollOffset = this._scrollbar.viewMin;
            this._owner._onScrollAsync(this);
        }

        public get otherDimension(): TablixDimension {
            return this._otherDimension;
        }

        public get layoutManager(): IDimensionLayoutManager {
            return this._layoutManager;
        }

        public _createScrollbar(parentElement: HTMLElement): Scrollbar {
            // abstract
            debug.assertFail("PureVirtualMethod: TablixDimension._createScrollbar");
            return null;
        }

        private updateScrollPosition(): void {
            this._scrollItems = [];

            if (!this.model) {
                return;
            }

            var firstVisibleScrollIndex: number = this.getIntegerScrollOffset();
            var firstVisible: any = this._hierarchyNavigator.getLeafAt(this.model, firstVisibleScrollIndex);
            if (!firstVisible) {
                return;
            }

            this._firstVisibleScrollIndex = firstVisibleScrollIndex;

            do {
                this._scrollItems[this._hierarchyNavigator.getLevel(firstVisible)] = firstVisible;
                firstVisible = this._hierarchyNavigator.getParent(firstVisible);
            } while (firstVisible !== null);
        }
    }

    export class TablixRowDimension extends TablixDimension {
        private _footer: any;

        constructor(tablixControl: TablixControl) {
            super(tablixControl);
            this._layoutManager = this._tablixLayoutManager.rowLayoutManager;
            this._footer = null;
        }

        public setFooter(footerHeader: any): void {
            this._footer = footerHeader;
            this._owner.updateFooterVisibility();
        }

        public hasFooter(): boolean {
            return (this._footer !== null);
        }

        /**
        * This method first populates the footer followed by each row and their correlating body cells from top to bottom.
        **/
        public _render() { // The intent to be internal
            var firstVisibleRowItem: any = this.getFirstVisibleItem(0);

            if (this.hasFooter()) {
                this.addFooterRowHeader(this._footer);
                this.addFooterBodyCells(this._footer);
            }

            if (firstVisibleRowItem !== undefined) {
                this.addNodes(this.model, 0, this.getDepth(), this._hierarchyNavigator.getIndex(firstVisibleRowItem));
            }
        }

        public _createScrollbar(parentElement: HTMLElement): Scrollbar {
            return new VerticalScrollbar(parentElement);
        }

        /**
        * addNodes is a recursive call (with its recursive behavior in addNode()) that will navigate
        * through the row hierarchy in DFS (Depth First Search) order and continue into a single row
        * upto its estimated edge.
        **/
        private addNodes(items: any, rowIndex: number, depth: number, firstVisibleIndex: number) {
            var count = this._hierarchyNavigator.getCount(items);

            //for loop explores children of current "items"
            for (var i = firstVisibleIndex; i < count; i++) {
                if (!this._layoutManager.needsToRealize) {
                    return;
                }

                var item = this._hierarchyNavigator.getAt(items, i);
                var cell = this.addNode(item, items, rowIndex, depth);
                rowIndex += cell.rowSpan; //next node is bumped down according cells vertical span
            }
        }

        public getFirstVisibleChildLeaf(item: any): any {
            var leaf = item;

            while (!this._hierarchyNavigator.isLeaf(leaf)) {
                leaf = this.getFirstVisibleChild(leaf);
            }

            return leaf;
        }

        private bindRowHeader(item: any, cell: ITablixCell) {
            this._binder.bindRowHeader(item, cell);
        }

        /**
        * This method can be thought of as the continuation of addNodes() as it continues the DFS (Depth First Search)
        * started from addNodes(). This function also handles ending the recursion with "_needsToRealize" being set to 
        * false.
        *
        * Once the body cells are reached, populating is done linearly with addBodyCells().
        **/
        private addNode(item: any, items: any, rowIndex: number, depth: number): ITablixCell {
            var previousCount: number;
            var rowHeaderCell: ITablixCell = this._tablixLayoutManager.getOrCreateRowHeader(item, items, rowIndex, this._hierarchyNavigator.getLevel(item));
            var match = this.rowHeaderMatch(item, rowHeaderCell);

            if (!match) {
                this._owner._unbindCell(rowHeaderCell);
                rowHeaderCell.type = TablixCellType.RowHeader;
                rowHeaderCell.item = item;
            }

            if (this._hierarchyNavigator.isLeaf(item)) {
                rowHeaderCell.colSpan = depth - this._hierarchyNavigator.getLevel(item);
                rowHeaderCell.rowSpan = 1;
                if (!match)
                    this.bindRowHeader(item, rowHeaderCell);

                this._tablixLayoutManager.onRowHeaderRealized(item, rowHeaderCell);
                this.addBodyCells(item, items, rowIndex);
            } else {
                previousCount = this._layoutManager.getRealizedItemsCount();
                this.addNodes(this._hierarchyNavigator.getChildren(item), rowIndex, depth, this.getFirstVisibleChildIndex(item));
                rowHeaderCell.colSpan = 1;
                rowHeaderCell.rowSpan = this._layoutManager.getRealizedItemsCount() - previousCount + 1;
                if (!match)
                    this.bindRowHeader(item, rowHeaderCell);
                this._tablixLayoutManager.onRowHeaderRealized(item, rowHeaderCell);
            }            

            return rowHeaderCell;
        }

        private rowHeaderMatch(item: any, cell: ITablixCell): boolean {
            var previousItem = cell.item;
            return cell.type === TablixCellType.RowHeader && previousItem && this._hierarchyNavigator.headerItemEquals(item, previousItem);
        }

        private addBodyCells(item: any, items: any, rowIndex: number) {
            var firstVisibleColumnIndex: number = this._otherDimension.getIntegerScrollOffset();
            var columnCount: number = this._otherDimension._layoutManager.getRealizedItemsCount() - this.getDepth();
            var hierarchyNavigator = this._hierarchyNavigator;
            var otherModel = this._otherDimension.model;
            var layoutManager = this._tablixLayoutManager;

            for (var i = 0; i < columnCount; i++) {
                //get column header "item" by index to pair up with row header to find corelating body cell
                var cellItem: any = hierarchyNavigator.getIntersection(item, hierarchyNavigator.getLeafAt(otherModel, firstVisibleColumnIndex + i));
                var cell: ITablixCell = layoutManager.getOrCreateBodyCell(cellItem, item, items, rowIndex, i);
                this.bindBodyCell(cellItem, cell);
                layoutManager.onBodyCellRealized(cellItem, cell);
            }
        }

        private bindBodyCell(item: any, cell: ITablixCell): void {
            var match = this.bodyCelMatch(item, cell);
            if (!match) {
                this._owner._unbindCell(cell);
                cell.type = TablixCellType.BodyCell;
                cell.item = item;

                this._binder.bindBodyCell(item, cell);
            }
        }

        private addFooterRowHeader(item: any) {
            var cell: ITablixCell = this._tablixLayoutManager.getOrCreateFooterRowHeader(item, this.model);
            cell.colSpan = this.getDepth();
            var match = this.rowHeaderMatch(item, cell);
            if (!match) {
                this._owner._unbindCell(cell);
                cell.type = TablixCellType.RowHeader;
                cell.item = item;
                this.bindRowHeader(item, cell);
                this._tablixLayoutManager.onRowHeaderFooterRealized(item, cell);
            }
        }

        private addFooterBodyCells(rowItem: any) {
            var firstVisibleColumnIndex: number = this._otherDimension.getIntegerScrollOffset();
            var columnCount: number = this._otherDimension.layoutManager.getRealizedItemsCount() - this.getDepth();
            var layoutManager = this._tablixLayoutManager;

            for (var i = 0; i < columnCount; i++) {
                //get column header "item" by index to pair up with row header to find corelating body cell
                var columnItem: any = this._hierarchyNavigator.getLeafAt(this._otherDimension.model, firstVisibleColumnIndex + i);
                //get corelating body cell and bind it
                var item: any = this._hierarchyNavigator.getIntersection(rowItem, columnItem);
                var cell: ITablixCell = layoutManager.getOrCreateFooterBodyCell(item, i);
                this.bindBodyCell(item, cell);
                layoutManager.onBodyCellFooterRealized(item, cell);
            }
        }

        private bodyCelMatch(item: any, cell: ITablixCell): boolean {
            var previousItem: any = cell.item;
            return cell.type === TablixCellType.BodyCell && previousItem && this._hierarchyNavigator.bodyCellItemEquals(item, previousItem);
        }
    }

    export class TablixColumnDimension extends TablixDimension {
        constructor(tablixControl: TablixControl) {
            super(tablixControl);
            this._layoutManager = this._tablixLayoutManager.columnLayoutManager;
        }

        public _render(): void { // The intent to be internal
            var firstVisibleColumnItem: any = this.getFirstVisibleItem(0);

            if (firstVisibleColumnItem !== undefined) {
                this.addNodes(this.model, 0, this.getDepth(), this._hierarchyNavigator.getIndex(firstVisibleColumnItem));
            }
        }

        public _createScrollbar(parentElement: HTMLElement): Scrollbar {
            var scrollbar: HorizontalScrollbar = new HorizontalScrollbar(parentElement);

            // Set smallest increment of the scrollbar to 0.2 rows
            scrollbar.smallIncrement = 0.2;

            return scrollbar;
        }

        private addNodes(items: any, columnIndex: number, depth: number, firstVisibleIndex: number): void {
            var count = this._hierarchyNavigator.getCount(items);
            for (var i = firstVisibleIndex; i < count; i++) {
                if (!this._layoutManager.needsToRealize) {
                    return;
                }
                var cell: ITablixCell = this.addNode(this._hierarchyNavigator.getAt(items, i), items, columnIndex, depth);
                columnIndex += cell.colSpan;
            }
        }

        private addNode(item: any, items: any, columnIndex: number, depth: number) {
            var cell: ITablixCell = this._tablixLayoutManager.getOrCreateColumnHeader(item, items, this._hierarchyNavigator.getLevel(item), columnIndex);

            var match = this.columnHeaderMatch(item, cell);

            if (!match) {
                this._owner._unbindCell(cell);
                cell.type = TablixCellType.ColumnHeader;
                cell.item = item;
            }

            if (this._hierarchyNavigator.isLeaf(item)) {
                cell.rowSpan = depth - this._hierarchyNavigator.getLevel(item);
            } else {
                var previousCount: number = this._layoutManager.getRealizedItemsCount();
                this.addNodes(this._hierarchyNavigator.getChildren(item), columnIndex, depth, this.getFirstVisibleChildIndex(item));
                cell.rowSpan = 1;
                cell.colSpan = this._layoutManager.getRealizedItemsCount() - previousCount + 1;
            }

            if (!match)
                this._binder.bindColumnHeader(item, cell);

            this._tablixLayoutManager.onColumnHeaderRealized(item, cell);
            return cell;
        }

        public columnHeaderMatch(item: any, cell: ITablixCell): boolean {
            var previousItem: any = cell.item;
            return cell.type === TablixCellType.ColumnHeader && previousItem && this._hierarchyNavigator.headerItemEquals(item, previousItem);
        }
    }
}