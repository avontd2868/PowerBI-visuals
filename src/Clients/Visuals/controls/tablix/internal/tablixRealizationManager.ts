//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals.controls.internal {

    /** Base class for Tablix realization manager
      */
    export class TablixDimensionRealizationManager {
        private _owner: DimensionLayoutManager;
        private _realizedLeavesCount: number;
        private _adjustmentFactor: number;
        private _itemsToRealizeCount: number;
        private _itemsEstimatedContextualWidth: number;
        private _binder: ITablixBinder;

        constructor(binder: ITablixBinder) {
            this._binder = binder;
            this._adjustmentFactor = 1;
        }

        public set owner(value: DimensionLayoutManager) {
            this._owner = value;
        }

        public get owner(): DimensionLayoutManager {
            return this._owner;
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
            if (this._owner.measureEnabled && !this._owner.done) {
                this._calculateItemsToRealize();
            }
            this._realizedLeavesCount = 0;
        }

        public onEndRenderingIteration(gridContextualWidth: number, filled: boolean): void {
            if (!filled && !this._owner.allItemsRealized)
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

        public _calculateItemsToRealize(): void {
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
        public _calculateItemsToRealize(): void {
            this.calculateRowsToRealizeCount();
        }

        private calculateRowsToRealizeCount(): void {
            debug.assertValue(this.owner, 'owner');

            if (!this.owner.dimension.model) {
                this.itemsToRealizeCount = 0;
                return;
            }

            if (this.owner.alignToEnd)
                this.itemsToRealizeCount = this.owner.dimension.getItemsCount() - this.owner.dimension.getIntegerScrollOffset() + 1;
            else
                this.itemsToRealizeCount = Math.ceil((this.owner.contextualWidthToFill / (this.binder.getEstimatedRowHeight() * this.adjustmentFactor)) + this.owner.dimension.getFractionScrollOffset()) - this.owner.otherLayoutManager.dimension.getDepth() + 1;
        }

        public calculateEstimatedHierarchyWidth(): number {
            if (!this.owner.dimension.model || this.owner.dimension.getItemsCount() === 0)
                return 0;

            var levels: RowWidths = new RowWidths();
            this.updateRowHiearchyEstimatedWidth(this.owner.dimension.model, this.owner.dimension._hierarchyNavigator.getIndex(this.owner.dimension.getFirstVisibleItem(0)), levels);

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
            var hierarchyNavigator: ITablixHierarchyNavigator = this.owner.owner.owner.hierarchyNavigator;
            var binder: ITablixBinder = this.binder;
            var length = hierarchyNavigator.getCount(items);

            for (var i = firstVisibleIndex; i < length; i++) {
                if (levels.leafCount === this.itemsToRealizeCount)
                    return;
                var item: any = hierarchyNavigator.getAt(items, i);
                var itemWidth = binder.getEstimatedRowHeaderWidth(item);
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
                    this.updateRowHiearchyEstimatedWidth(hierarchyNavigator.getChildren(item), this.owner.dimension.getFirstVisibleChildIndex(item), levels);
                }
            }
        }

        public _getSizeAdjustment(gridContextualWidth: number): number {
            return gridContextualWidth / ((this.owner.getRealizedItemsCount() - this.owner.dimension.getFractionScrollOffset()) * this.binder.getEstimatedRowHeight());
        }
    }

    /** DOM implementation for Column Tablix realization manager
      */
    export class ColumnRealizationManager extends TablixDimensionRealizationManager {
        public _calculateItemsToRealize(): void {
            this.calculateColumnsToRealizeCount(this.getEstimatedRowHierarchyWidth());
        }

        private get rowRealizationManager(): RowRealizationManager {
            return <RowRealizationManager>this.owner.otherLayoutManager.realizationManager;
        }

        private getEstimatedRowHierarchyWidth(): number {
            if (this.owner.otherLayoutManager.done)
                return this.owner.getOtherHierarchyContextualHeight();

            return this.rowRealizationManager.calculateEstimatedHierarchyWidth() * this.adjustmentFactor;
        }

        private calculateColumnsToRealizeCount(rowHierarchyWidth: number): void {
            var widthToFill: number = this.owner.contextualWidthToFill - rowHierarchyWidth;

            if (!this.owner.dimension.model || Double.lessOrEqualWithPrecision(widthToFill, 0, DimensionLayoutManager._pixelPrecision)) {
                this.itemsToRealizeCount = 0;
                return;
            }

            var binder: ITablixBinder = this.binder;
            var hierarchyNavigator: ITablixHierarchyNavigator = this.owner.owner.owner.hierarchyNavigator;

            var startColumnIndex: number = this.owner.dimension.getIntegerScrollOffset();
            var endColumnIndex: number = this.owner.dimension.getItemsCount();
            this.itemsEstimatedContextualWidth = 0;

            var startRowIndex: number = this.owner.otherLayoutManager.dimension.getIntegerScrollOffset();
            var endRowIndex = Math.min(startRowIndex + this.rowRealizationManager.itemsToRealizeCount, this.owner.otherLayoutManager.dimension.getItemsCount() - 1);

            if (this.owner.alignToEnd) {
                this.itemsToRealizeCount = endColumnIndex - startColumnIndex;
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
                    visibleSizeRatio = this.owner.getVisibleSizeRatio();
                }
                else {
                    visibleSizeRatio = 1;
                }

                var columnMember: any = hierarchyNavigator.getLeafAt(this.owner.dimension.model, i);
                maxWidth = Math.max(maxWidth, binder.getEstimatedColumnHeaderWidth(columnMember));

                for (var j = startRowIndex; j < endRowIndex; j++) {
                    var intersection = hierarchyNavigator.getIntersection(hierarchyNavigator.getLeafAt(this.owner.otherLayoutManager.dimension.model, j), columnMember);
                    maxWidth = Math.max(maxWidth, binder.getEstimatedBodyCellWidth(intersection));
                }

                this.itemsEstimatedContextualWidth += maxWidth * visibleSizeRatio * this.adjustmentFactor;
            }

            this.itemsToRealizeCount = endColumnIndex - startColumnIndex;
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