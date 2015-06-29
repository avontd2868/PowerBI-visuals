//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {

    export interface DataViewVisualTable extends DataViewTable {
        visualRows?: DataViewVisualTableRow[];
    }

    export interface DataViewVisualTableRow {
        index: number;
        values: any[];
    }

    export interface TableDataAdapter {
        update(table: DataViewTable): void;
    }

    export interface TableCell {
        value: string;
        isMeasure: boolean;
        isTotal: boolean;
        isBottomMost: boolean;
        showUrl: boolean;
    }

    export interface TableTotal {
        totalCells: any[];
    }

    export class TableHierarchyNavigator implements controls.ITablixHierarchyNavigator, TableDataAdapter {

        private tableDataView: DataViewVisualTable;
        private formatter: ICustomValueFormatter;

        constructor(tableDataView: DataViewVisualTable, formatter: ICustomValueFormatter) {
            debug.assertValue(tableDataView, 'tableDataView');
            debug.assertValue(formatter, 'formatter');

            this.tableDataView = tableDataView;
            this.formatter = formatter;
        }

        /** Returns the depth of a hierarchy. */
        public getDepth(hierarchy: any): number {
            return 1;
        }

        /** Returns the leaf count of a hierarchy. */
        public getLeafCount(hierarchy: any): number {
            return hierarchy.length;
        }

        /** Returns the leaf member of a hierarchy at a specified index. */
        public getLeafAt(hierarchy: any, index: number): any {
            return hierarchy[index];
        }

        /** Returns the specified hierarchy member parent. */
        public getParent(item: any): any {
            return null;
        }

        /** Returns the index of the hierarchy member relative to its parent. */
        public getIndex(item: any): number {
            if (this.isRow(item))
                return (<DataViewVisualTableRow>item).index;

            return this.getColumnIndex(item);
        }

        private isRow(item: any) {
            var row = <DataViewVisualTableRow>item;
            return row.index !== undefined && row.values !== undefined;
        }

        private getColumnIndex(item: any): number {
            return TableHierarchyNavigator.getIndex(this.tableDataView.columns, item);
        }

        /** Checks whether a hierarchy member is a leaf. */
        public isLeaf(item: any): boolean {
            return true;
        }

        public isRowHierarchyLeaf(cornerItem: any): boolean {
            return false;
        }

        public isColumnHierarchyLeaf(cornerItem: any): boolean {
            return true;
        }

        /** Checks whether a hierarchy member is the last item within its parent. */
        public isLastItem(item: any, items: any): boolean {
            return false;
        }

        /** Gets the children members of a hierarchy member. */
        public getChildren(item: any): any {
            return null;
        }

        /** Gets the members count in a specified collection. */
        public getCount(items: any): number {
            return items.length;
        }

        /** Gets the member at the specified index. */
        public getAt(items: any, index: number): any {
            return items[index];
        }

        /** Gets the hierarchy member level. */
        public getLevel(item: any): number {
            return 0;
        }

        /** Returns the intersection between a row and a column item. */
        public getIntersection(rowItem: any, columnItem: DataViewMetadataColumn): TableCell {
            var value: any;
            var isTotal: boolean = false;
            var isBottomMost: boolean = false;
            var columnIndex = TableHierarchyNavigator.getIndex(this.tableDataView.columns, columnItem);

            var totalRow = <TableTotal>rowItem;
            if (totalRow.totalCells != null) {
                isTotal = true;
                value = totalRow.totalCells[columnIndex];
            }
            else {
                var bottomRow = this.tableDataView.visualRows[this.tableDataView.visualRows.length - 1];
                isBottomMost = bottomRow === rowItem;
                value = (<DataViewVisualTableRow>rowItem).values[columnIndex];
            }

            var formattedValue = this.formatter(value, valueFormatter.getFormatString(columnItem, TableNew.formatStringProp));

            return {
                value: formattedValue,
                isMeasure: columnItem.isMeasure,
                isTotal: isTotal,
                isBottomMost: isBottomMost,
                showUrl: UrlHelper.isValidUrl(columnItem, formattedValue)
            };
        }

        /** Returns the corner cell between a row and a column level. */
        public getCorner(rowLevel: number, columnLevel: number): any {
            return null;
        }

        public headerItemEquals(item1: any, item2: any): boolean {
            return (item1 === item2);
        }

        public bodyCellItemEquals(item1: any, item2: any): boolean {
            return (item1 === item2);
        }

        public cornerCellItemEquals(item1: any, item2: any): boolean {
            // Should not be called as we don't return any corner items for table
            return true;
        }

        public update(table: DataViewVisualTable): void {
            this.tableDataView = table;
        }

        private static getIndex(items: any[], item: any): number {
            for (var index = 0, len = items.length; index < len; index++) {

                // For cases when the item was re-created during the DataTransformation phase,
                // we check for the item's index to verify equality.
                var arrayItem = items[index];
                if (arrayItem.index != null && item.index != null && arrayItem.index === item.index) {
                    return index;
                }
                else {
                    if (item === items[index])
                        return index;
                }
            }

            return -1;
        }
    }

    export interface TableBinderOptions {
        onBindRowHeader? (item: any): void;
        onColumnHeaderClick? (queryName: string): void;
    }

    // Public for testability
    export class TableBinder implements controls.ITablixBinder {

        private static columnHeaderClassName = 'bi-table-column-header';
        private static rowClassName = 'bi-table-row';
        private static lastRowClassName = 'bi-table-last-row';
        private static footerClassName = 'bi-table-footer';
        private static numericCellClassName = 'bi-table-cell-numeric';
        private static nonBreakingSpace = '&nbsp;';

        private characterWidth: number;
        private characterHeight: number;

        private options: TableBinderOptions;

        constructor(options: TableBinderOptions) {
            this.options = options;
        }

        public onStartRenderingSession(parentElement: HTMLElement): void {
            // TODO: Use TextMeasurementService once the DOM methods are fixed (they are not working right now)
            if (parentElement) {
                var textDiv = controls.internal.TablixUtils.createDiv();
                textDiv.style.cssFloat = 'left';
                parentElement.appendChild(textDiv);
                this.measureSampleText(textDiv);
                parentElement.removeChild(textDiv);
            }
        }

        public onEndRenderingSession(): void {
        }

        // Row Header
        public bindRowHeader(item: any, cell: controls.ITablixCell): void {
            this.ensureHeight(item, cell);
            if (this.options.onBindRowHeader)
                this.options.onBindRowHeader(item);
        }

        public unbindRowHeader(item: any, cell: controls.ITablixCell): void {
        }

        // Column Header
        public bindColumnHeader(item: DataViewMetadataColumn, cell: controls.ITablixCell): void {
            cell.extension.setContainerStyle(TableBinder.columnHeaderClassName);
            cell.extension.disableDragResize();
            cell.extension.contentHost.textContent = item.name;

            if (this.options.onColumnHeaderClick) {
                var handler = (e: MouseEvent) => {
                    this.options.onColumnHeaderClick(item.queryName ? item.queryName : item.name);
                };
                cell.extension.registerClickHandler(handler);
            }
        }

        public unbindColumnHeader(item: any, cell: controls.ITablixCell): void {
            cell.extension.clearContainerStyle();
            cell.extension.contentHost.textContent = '';

            if (this.options.onColumnHeaderClick) {
                cell.extension.unregisterClickHandler();
            }
        }

        // Body Cell
        public bindBodyCell(item: TableCell, cell: controls.ITablixCell): void {
            if (item.showUrl)
                controls.internal.TablixUtils.appendATagToBodyCell(item.value, cell);
            else
                cell.extension.contentHost.textContent = item.value;

            var classNames = item.isTotal ?
                TableBinder.footerClassName :
                item.isBottomMost ? TableBinder.lastRowClassName : TableBinder.rowClassName;

            if (item.isMeasure)
                classNames += ' ' + TableBinder.numericCellClassName;

            cell.extension.setContainerStyle(classNames);
        }

        public unbindBodyCell(item: TableCell, cell: controls.ITablixCell): void {
            cell.extension.clearContainerStyle();
            cell.extension.contentHost.textContent = '';
        }

        // Corner Cell
        public bindCornerCell(item: any, cell: controls.ITablixCell): void {
        }

        public unbindCornerCell(item: any, cell: controls.ITablixCell): void {
        }

        public bindEmptySpaceHeaderCell(cell: controls.ITablixCell): void {
            // Not needed for Table
        }

        public unbindEmptySpaceHeaderCell(cell: controls.ITablixCell): void {
            // Not needed for Table
        }

        public bindEmptySpaceFooterCell(cell: controls.ITablixCell): void {
            // Not needed for Table
        }

        public unbindEmptySpaceFooterCell(cell: controls.ITablixCell): void {
            // Not needed for Table
        }

        // Measurement Helper
        public getEstimatedRowHeaderWidth(item: DataViewMetadataColumn): number {
            return 0;
        }

        public getEstimatedColumnHeaderWidth(item: DataViewMetadataColumn): number {
            return this.getEstimatedTextWidth(item.name);
        }

        public getEstimatedBodyCellWidth(item: any): number {
            return this.getEstimatedTextWidth(item);
        }

        public getEstimatedRowHeight(): number {
            return this.characterHeight;
        }

        private getEstimatedTextWidth(text: string): number {
            return text ? text.length * this.characterWidth : 0;
        }

        private measureSampleText(parentDiv: HTMLDivElement): void {
            var textNode = document.createTextNode("a");
            parentDiv.appendChild(textNode);

            this.characterWidth = controls.HTMLElementUtils.getElementWidth(parentDiv);
            this.characterHeight = controls.HTMLElementUtils.getElementHeight(parentDiv);

            parentDiv.removeChild(textNode);
        }

        private ensureHeight(item: any, cell: controls.ITablixCell) {
            if (!item.values)
                return;

            var count = item.values.length;
            if (count === 0)
                return;

            var allValuesEmpty = true;
            for (var i: number = 0; i < count; i++) {
                if (item.values[i]) {
                    allValuesEmpty = false;
                    break;
                }
            }

            // In order to maintain the height of the row when the values are null or empty
            // we set the innerHTML to be a nonBreakingSpace. The nonBreakingSpace does not
            // show up in the visual because for actual cell content we use the textContent property instead.
            if (allValuesEmpty)
                cell.extension.contentHost.innerHTML = TableBinder.nonBreakingSpace;
        }
    }

    export class TableNew implements IVisual {

        public static formatStringProp: DataViewObjectPropertyIdentifier = { objectName: 'general', propertyName: 'formatString' };
        private static preferredLoadMoreThreshold: number = 0.8;

        private element: JQuery;
        private currentViewport: IViewport;
        private style: IVisualStyle;
        private formatter: ICustomValueFormatter;
        private isInteractive: boolean;
        private getLocalizedString: (stringId: string) => string;
        private dataView: DataView;
        private hostServices: IVisualHostServices;

        private tablixControl: controls.TablixControl;
        private hierarchyNavigator: TableHierarchyNavigator;
        private waitingForData: boolean;
        private lastAllowHeaderResize: boolean = true;

        public static capabilities: VisualCapabilities = {
            dataRoles: [{
                name: 'Values',
                kind: VisualDataRoleKind.GroupingOrMeasure
            }],
            objects: {
                general: {
                    displayName: data.createDisplayNameGetter('Visual_General'),
                    properties: {
                        formatString: {
                            type: { formatting: { formatString: true } },
                        },
                        totals: {
                            type: { bool: true },
                            displayName: data.createDisplayNameGetter('Visual_Totals')
                        }
                    },
                }
            },
            dataViewMappings: [{
                table: {
                    rows: {
                        for: { in: 'Values' },
                        dataReductionAlgorithm: { window: { count: 100 } }
                    },
                    rowCount: { preferred: { min: 1 } }
                },
            }],
            sorting: {
                custom: {},
            },
            suppressDefaultTitle: true,
        };

        public static customizeQuery(options: CustomizeQueryOptions): void {
            var dataViewMapping = options.dataViewMappings[0];
            if (!dataViewMapping || !dataViewMapping.table || !dataViewMapping.metadata)
                return;

            var dataViewTableRows: data.CompiledDataViewRoleForMapping = <data.CompiledDataViewRoleForMapping>dataViewMapping.table.rows;

            var objects: TableDataViewObjects = <TableDataViewObjects>dataViewMapping.metadata.objects;
            dataViewTableRows.for.in.subtotalType = TableNew.shouldShowTotals(objects) ? data.CompiledSubtotalType.Before : data.CompiledSubtotalType.None;
        }

        public static getSortableRoles(): string[] {
            return ['Values'];
        }

        public init(options: VisualInitOptions): void {
            this.element = options.element;
            this.style = options.style;
            this.updateViewport(options.viewport);
            this.formatter = valueFormatter.formatRaw;
            this.isInteractive = options.interactivity && options.interactivity.selection != null;
            this.getLocalizedString = options.host.getLocalizedString;
            this.hostServices = options.host;
        }

        /*Public for testability*/
        public static converter(table: DataViewTable): DataViewVisualTable {
            debug.assertValue(table, 'table');
            debug.assertValue(table.rows, 'table.rows');

            var visualTable = Prototype.inherit<DataViewVisualTable>(table);
            visualTable.visualRows = [];

            for (var i: number = 0; i < table.rows.length; i++) {
                var visualRow: DataViewVisualTableRow = {
                    index: i,
                    values: table.rows[i]
                };
                visualTable.visualRows.push(visualRow);
            }

            return visualTable;
        }

        public onResizing(finalViewport: IViewport, duration: number): void {
            this.updateViewport(finalViewport);
        }

        public onDataChanged(options: VisualDataChangedOptions): void {
            debug.assertValue(options, 'options');

            var dataViews = options.dataViews;

            if (dataViews && dataViews.length > 0) {
                this.dataView = dataViews[0];
                if (options.operationKind === VisualDataChangeOperationKind.Append) {
                    var visualTable = TableNew.converter(this.dataView.table);
                    this.hierarchyNavigator.update(visualTable);
                    this.tablixControl.rowDimension.model = visualTable.visualRows;
                    this.tablixControl.refresh(false);
                } else {
                    this.updateInternal(this.dataView);
                }
            }

            this.waitingForData = false;
        }

        private updateViewport(newViewport: IViewport) {
            this.currentViewport = newViewport;

            if (this.tablixControl) {
                this.tablixControl.width = this.currentViewport.width;
                this.tablixControl.height = this.currentViewport.height;
                this.verifyHeaderResize();
                this.tablixControl.refresh(false);
            }
        }

        private createControl(dataNavigator: TableHierarchyNavigator): controls.TablixControl {
            var tableBinderOptions: TableBinderOptions = {
                onBindRowHeader: (item: any) => this.onBindRowHeader(item),
                onColumnHeaderClick: (queryName: string) => this.onColumnHeaderClick(queryName),
            };
            var tableBinder = new TableBinder(tableBinderOptions);

            // Create Host element
            var tablixContainer = document.createElement('div');
            tablixContainer.className = "tablixContainer";
            this.element.append(tablixContainer);

            var tablixOptions: controls.TablixOptions = {
                interactive: this.isInteractive,
                enableTouchSupport: false
            };

            return new controls.TablixControl(dataNavigator, tableBinder, tablixContainer, tablixOptions);
        }

        private updateInternal(dataView: DataView) {

            var visualTable = TableNew.converter(dataView.table);
            if (!this.tablixControl) {
                var dataNavigator = new TableHierarchyNavigator(visualTable, this.formatter);
                this.hierarchyNavigator = dataNavigator;

                // Create the control
                this.tablixControl = this.createControl(dataNavigator);
            }
            else {
                this.hierarchyNavigator.update(visualTable);
            }

            this.verifyHeaderResize();
            this.tablixControl.columnDimension.model = visualTable.columns;
            this.tablixControl.rowDimension.model = visualTable.visualRows;

            var totals = this.createTotalsRow(dataView);
            this.tablixControl.rowDimension.setFooter(totals);

            this.tablixControl.width = this.currentViewport.width;
            this.tablixControl.height = this.currentViewport.height;

            this.tablixControl.rowDimension.scrollOffset = 0;
            this.tablixControl.columnDimension.scrollOffset = 0;

            // Render
            // We need the layout for the DIV to be done so that the control can measure items correctly.
            setTimeout(() => {
                // Render
                this.tablixControl.refresh(true);
            }, 0);
        }

        private createTotalsRow(dataView: DataView): TableTotal {
            if (!this.shouldShowTotals(dataView))
                return null;

            var totals = dataView.table.totals;
            if (!totals || totals.length === 0)
                return null;

            var totalRow: any[] = [];
            var columns = dataView.table.columns;

            // Add totals for measure columns, blank for non-measure columns unless it's the first column
            for (var i = 0, len = columns.length; i < len; ++i) {
                var column = columns[i];

                var totalValue = totals[column.index];
                if (totalValue != null) {
                    totalRow.push(totalValue);
                }
                else {
                    // If the first column is a non-measure column, we put 'Total' as the text similar to PV.
                    // Note that if the first column is a measure column we don't render any Total text at
                    // all, once again similar to PV.
                    totalRow.push((i === 0) ? this.getLocalizedString('TableTotalLabel') : '');
                }
            }

            return <TableTotal>{ totalCells: totalRow };
        }

        private shouldShowTotals(dataView: DataView): boolean {
            var objects = <TableDataViewObjects>dataView.metadata.objects;
            return TableNew.shouldShowTotals(objects);
        }

        private static shouldShowTotals(objects: TableDataViewObjects): boolean {
            if (objects && objects.general)
                return objects.general.totals !== false;

            // Totals are enabled by default
            return true;
        }

        private onBindRowHeader(item: any): void {
            if (this.needsMoreData(item)) {
                this.hostServices.loadMoreData();
                this.waitingForData = true;
            }
        }

        private onColumnHeaderClick(queryName: string) {
            var sortDescriptors: SortableFieldDescriptor[] = [{
                queryName: queryName,
            }];
            var args: CustomSortEventArgs = {
                sortDescriptors: sortDescriptors
            };
            this.hostServices.onCustomSort(args);
        }

        /* Public for testability */
        public needsMoreData(item: any): boolean {
            if (this.waitingForData || !this.dataView.metadata || !this.dataView.metadata.segment)
                return false;

            var leafCount = this.tablixControl.rowDimension.getItemsCount();
            var loadMoreThreshold = leafCount * TableNew.preferredLoadMoreThreshold;

            return this.hierarchyNavigator.getIndex(item) >= loadMoreThreshold;
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] {
            var instances: VisualObjectInstance[] = [];
            if (options.objectName === 'general') {
                instances.push({
                    selector: null,
                    properties: {
                        totals: this.shouldShowTotals(this.dataView),
                    },
                    objectName: options.objectName
                });
            }
            return instances;
        }

        private shouldAllowHeaderResize(): boolean {
            return this.hostServices.getViewMode() === ViewMode.Edit;
        }

        private verifyHeaderResize() {
            var currentAllowHeaderResize = this.shouldAllowHeaderResize();
            if (currentAllowHeaderResize !== this.lastAllowHeaderResize) {
                this.lastAllowHeaderResize = currentAllowHeaderResize;
                this.tablixControl.layoutManager.setAllowHeaderResize(currentAllowHeaderResize);
            }
        }
    }
}