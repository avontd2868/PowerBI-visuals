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

module powerbi.visuals.controls.internal {

    /** Base class for Tablix realization manager
      */
    export class TablixDimensionRealizationManager {
        private _realizedLeavesCount: number;
        private _adjustmentFactor: number;
        private _itemsToRealizeCount: number;
        private _itemsEstimatedContextualWidth: number;
        private _binder: ITablixBinder;

        constructor(binder: ITablixBinder) {
            this._binder = binder;
            this._adjustmentFactor = 1;
        }

        public _getOwner(): DimensionLayoutManager {
            debug.assertFail("PureVirtualMethod: DimensionLayoutManager.getOwner");
            return null;
        }

        public get binder(): ITablixBinder {
            return this._binder;
        }

        public get adjustmentFactor(): number {
            return this._adjustmentFactor;
        }

        public get itemsToRealizeCount(): number {
            return this._itemsToRealizeCount;
        }

        public set itemsToRealizeCount(count: number) {
            this._itemsToRealizeCount = count;
        }

        public get itemsEstimatedContextualWidth(): number {
            return this._itemsEstimatedContextualWidth;
        }

        public set itemsEstimatedContextualWidth(contextualWidth: number) {
            this._itemsEstimatedContextualWidth = contextualWidth;
        }

        public onStartRenderingIteration(): void {
            var owner = this._getOwner();
            if (owner.measureEnabled && !owner.done) {
                this._getEstimatedItemsToRealizeCount();
            }
            this._realizedLeavesCount = 0;
        }

        public onEndRenderingIteration(gridContextualWidth: number, filled: boolean): void {
            if (!filled && !this._getOwner().allItemsRealized)
                this._adjustmentFactor *= this._getSizeAdjustment(gridContextualWidth);
        }

        public onEndRenderingSession(): void {
            this._adjustmentFactor = 1;
        }

        public onCornerCellRealized(item: any, cell: ITablixCell): void {
        }
        
        public onHeaderRealized(item: any, cell: ITablixCell, leaf: boolean): void {
            if (leaf) {
                this._realizedLeavesCount++;
            }
        }

        public get needsToRealize(): boolean {
            return this._realizedLeavesCount < this._itemsToRealizeCount;
        }

        public _getEstimatedItemsToRealizeCount(): void {
            debug.assertFail("PureVirtualMethod: TablixDimensionRealizationManager._calculateItemsToRealize");
        }

        public _getSizeAdjustment(gridContextualWidth: number): number {
            debug.assertFail("PureVirtualMethod: TablixDimensionRealizationManager._getSizeAdjustment");
            return 1;
        }
    }

    /** DOM implementation for Row Tablix realization manager
      */
    export class RowRealizationManager extends TablixDimensionRealizationManager {
        private _owner: RowLayoutManager;

        public set owner(owner: RowLayoutManager) {
            this._owner = owner;
        }

        public _getOwner(): DimensionLayoutManager {
            return this._owner;
        }

        public _getEstimatedItemsToRealizeCount(): void {
            this.estimateRowsToRealizeCount();
        }

        private estimateRowsToRealizeCount(): void {
            debug.assertValue(this._owner, '_owner');

            if (!this._owner.dimension.model) {
                this.itemsToRealizeCount = 0;
                return;
            }

            if (this._owner.alignToEnd)
                this.itemsToRealizeCount = this._owner.dimension.getItemsCount() - this._owner.dimension.getIntegerScrollOffset() + 1;
            else
                this.itemsToRealizeCount = Math.ceil((this._owner.contextualWidthToFill / (this._owner.owner.getEstimatedRowHeight() * this.adjustmentFactor)) + this._owner.dimension.getFractionScrollOffset()) - this._owner.otherLayoutManager.dimension.getDepth() + 1;
        }

        public getEstimatedRowHierarchyWidth(): number {
            if (!this._owner.dimension.model || this._owner.dimension.getItemsCount() === 0)
                return 0;

            var levels: RowWidths = new RowWidths();
            this.updateRowHiearchyEstimatedWidth(this._owner.dimension.model, this._owner.dimension._hierarchyNavigator.getIndex(this._owner.dimension.getFirstVisibleItem(0)), levels);

            var levelsArray: RowWidth[] = levels.items;
            var levelCount: number = levelsArray.length;

            var width = 0;

            for (var i = 0; i < levelCount; i++) {
                var level = levelsArray[i];

                if (level.maxNonLeafWidth !== 0)
                    width += level.maxNonLeafWidth;
                else
                    width += level.maxLeafWidth;
            }

            return width;
        }

        private updateRowHiearchyEstimatedWidth(items: any, firstVisibleIndex: number, levels: RowWidths) {
            var hierarchyNavigator: ITablixHierarchyNavigator = this._owner.owner.owner.hierarchyNavigator;
            var binder: ITablixBinder = this.binder;
            var length = hierarchyNavigator.getCount(items);

            for (var i = firstVisibleIndex; i < length; i++) {
                if (levels.leafCount === this.itemsToRealizeCount)
                    return;
                var item: any = hierarchyNavigator.getAt(items, i);
                var label = binder.getHeaderLabel(item);
                var itemWidth = this._owner.getEstimatedHeaderWidth(label, firstVisibleIndex);
                var isLeaf: boolean = hierarchyNavigator.isLeaf(item);
                var l: number = hierarchyNavigator.getLevel(item);

                var level = levels.items[l];
                if (!level) {
                    level = new RowWidth();
                    levels.items[l] = level;
                }

                if (isLeaf) {
                    level.maxLeafWidth = Math.max(level.maxLeafWidth, itemWidth);
                    levels.leafCount = levels.leafCount + 1;
                }
                else {
                    level.maxNonLeafWidth = Math.max(level.maxNonLeafWidth, itemWidth);
                    this.updateRowHiearchyEstimatedWidth(hierarchyNavigator.getChildren(item), this._owner.dimension.getFirstVisibleChildIndex(item), levels);
                }
            }
        }

        public _getSizeAdjustment(gridContextualWidth: number): number {
            return gridContextualWidth / ((this._owner.getRealizedItemsCount() - this._owner.dimension.getFractionScrollOffset()) * this._owner.owner.getEstimatedRowHeight());
        }
    }

    /** DOM implementation for Column Tablix realization manager
      */
    export class ColumnRealizationManager extends TablixDimensionRealizationManager {
        private _owner: ColumnLayoutManager;

        public set owner(owner: ColumnLayoutManager) {
            this._owner = owner;
        }

        public _getOwner(): DimensionLayoutManager {
            return this._owner;
        }

        public _getEstimatedItemsToRealizeCount(): void {
            this.estimateColumnsToRealizeCount(this.getEstimatedRowHierarchyWidth());
        }

        private get rowRealizationManager(): RowRealizationManager {
            return <RowRealizationManager>this._owner.otherLayoutManager.realizationManager;
        }

        private getEstimatedRowHierarchyWidth(): number {
            if (this._owner.otherLayoutManager.done)
                return this._owner.getOtherHierarchyContextualHeight();

            return this.rowRealizationManager.getEstimatedRowHierarchyWidth() * this.adjustmentFactor;
        }

        private estimateColumnsToRealizeCount(rowHierarchyWidth: number): void {
            var widthToFill: number = this._owner.contextualWidthToFill - rowHierarchyWidth;

            if (!this._owner.dimension.model || Double.lessOrEqualWithPrecision(widthToFill, 0, DimensionLayoutManager._pixelPrecision)) {
                this.itemsToRealizeCount = 0;
                return;
            }

            var binder: ITablixBinder = this.binder;
            var hierarchyNavigator: ITablixHierarchyNavigator = this._owner.owner.owner.hierarchyNavigator;

            var startColumnIndex: number = this._owner.dimension.getIntegerScrollOffset();
            var endColumnIndex: number = this._owner.dimension.getItemsCount();
            this.itemsEstimatedContextualWidth = 0;

            var startRowIndex: number = this._owner.otherLayoutManager.dimension.getIntegerScrollOffset();
            var endRowIndex = Math.min(startRowIndex + this.rowRealizationManager.itemsToRealizeCount, this._owner.otherLayoutManager.dimension.getItemsCount() - 1);
            var columnCount = endColumnIndex - startColumnIndex;

            if (this._owner.alignToEnd) {
                this.itemsToRealizeCount = columnCount;
                return;
            }

            for (var i = startColumnIndex; i < endColumnIndex; i++) {
                if (Double.greaterOrEqualWithPrecision(this.itemsEstimatedContextualWidth, widthToFill, DimensionLayoutManager._pixelPrecision)) {
                    this.itemsToRealizeCount = i - startColumnIndex;
                    return;
                }

                var maxWidth = 0;
                var visibleSizeRatio;

                if (i === startColumnIndex) {
                    visibleSizeRatio = this._owner.getVisibleSizeRatio();
                }
                else {
                    visibleSizeRatio = 1;
                }

                var columnMember: any = hierarchyNavigator.getLeafAt(this._owner.dimension.model, i);
                var label = binder.getHeaderLabel(columnMember);
                maxWidth = Math.max(maxWidth, this._owner.getEstimatedHeaderWidth(label, i));

                for (var j = startRowIndex; j < endRowIndex; j++) {
                    var intersection = hierarchyNavigator.getIntersection(hierarchyNavigator.getLeafAt(this._owner.otherLayoutManager.dimension.model, j), columnMember);
                    label = binder.getCellContent(intersection);
                    maxWidth = Math.max(maxWidth, this._owner.getEstimatedBodyCellWidth(label));
                }

                this.itemsEstimatedContextualWidth += maxWidth * visibleSizeRatio * this.adjustmentFactor;
            }

            this.itemsToRealizeCount = columnCount;
        }

        public _getSizeAdjustment(gridContextualWidth: number): number {
            return gridContextualWidth / (this.getEstimatedRowHierarchyWidth() + this.itemsEstimatedContextualWidth);
        }
    }

    export class RowWidths {
        public items: RowWidth[];
        public leafCount;

        constructor() {
            this.items = [];
            this.leafCount = 0;
        }
    }

    export class RowWidth {
        public maxLeafWidth: number = 0;
        public maxNonLeafWidth: number = 0;
    }
}