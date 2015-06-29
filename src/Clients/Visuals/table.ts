//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    import CssConstants = jsCommon.CssConstants;

    export enum TableColumnSizePolicy {
        Auto,
        FixedColumns4,
        FixedColumns5,
        FixedColumns7,
    };

    export interface TableDataViewObjects extends DataViewObjects {
        general: TableDataViewObject;
    }

    export interface TableDataViewObject extends DataViewObject {
        totals: boolean;
    }

    export class Table implements IVisual {

        private static Styles = {
            th: 'ms-font-s',
            tr: 'ms-font-xs',
            numeric: 'numeric',
            total: 'total',
        };
        
        // Public for testability
        public static formatStringProp: DataViewObjectPropertyIdentifier = {
            objectName: 'general',
            propertyName: 'formatString',
        };

        // Unfortunately since we are doing manual layout, we need to hardcode the padding number here
        public static padding = 12;
        public static scrollbarPadClass = 'scrollbarPad';

        private static dateDataType = "date";
        private static MaxCountForDashboard = 23;
        private element: JQuery;
        private currentViewport: IViewport;
        private style: IVisualStyle;
        private dataView: DataView;
        private formatter: ICustomValueFormatter;
        private columnSizePolicy: TableColumnSizePolicy = null;
        private columnCount: number;
        private getLocalizedString: (stringId: string) => string;
        private dataTable: DataTables.DataTable;

        public static capabilities: VisualCapabilities = {
            dataRoles: [{
                name: 'Values',
                kind: VisualDataRoleKind.GroupingOrMeasure,
                displayName: data.createDisplayNameGetter('Role_DisplayName_Fields'),
            }],
            objects: {
                general: {
                    properties: {
                        formatString: {
                            type: { formatting: { formatString: true } },
                        },
                        totals: {
                            type: { bool: true },
                        }
                    },
                }
            },
            dataViewMappings: [{
                table: {
                    rows: {
                        for: { in: 'Values' },
                        dataReductionAlgorithm: { window: {} }
                    },
                    rowCount: { preferred: { min: 1 } }
                },
            }],
            sorting: {
                custom: {},
            },
            suppressDefaultTitle: true,
        };

        public static getSortableRoles(): string[] {
            return ['Values'];
        }

        public static getTableColumnSizePolicy(newViewport: IViewport): TableColumnSizePolicy {
            if (newViewport.width <= 250) {
                // Small
                return TableColumnSizePolicy.FixedColumns4;
            }
            else if (newViewport.width <= 510) {
                // Medium
                return TableColumnSizePolicy.FixedColumns5;
            }
            else if (newViewport.width <= 770) {
                // Large
                return TableColumnSizePolicy.FixedColumns7;
            }
            debug.assertFail("Fixed size is only for viewport up to 770px width.");
        }

        public init(options: VisualInitOptions): void {
            this.element = options.element;
            this.style = options.style;
            this.updateViewport(options.viewport);
            this.formatter = valueFormatter.formatRaw;
            this.getLocalizedString = options.host.getLocalizedString;

            var interactivity = options.interactivity;
            this.columnSizePolicy = interactivity && interactivity.overflow === 'hidden'
                ? Table.getTableColumnSizePolicy(options.viewport)
            : TableColumnSizePolicy.Auto;
        }

        public destroy(): void {
            if (this.dataTable) {
                this.dataTable.fnClearTable(false);
                this.dataTable.fnDestroy(true);
                this.dataTable = null;
            }
        }

        public onResizing(finalViewport: IViewport, duration: number): void {
            this.updateViewport(finalViewport);
        }

        public onDataChanged(options: VisualDataChangedOptions): void {
            debug.assertValue(options, 'options');

            var dataViews = options.dataViews;
            this.element.empty();

            if (dataViews && dataViews.length > 0) {
                this.dataView = dataViews[0];

                this.updateInternal();
            }
        }

        private updateViewport(newViewport: IViewport) {
            this.applyColumnSizePolicy(newViewport);
            this.currentViewport = newViewport;
            if (this.dataTable) {
                this.adjustRowAndColumnSizes();
            }
        }

        private adjustRowAndColumnSizes(onComplete?: Function) {
            if (this.columnSizePolicy === TableColumnSizePolicy.Auto) {
                this.dataTable.fnAdjustColumnSizing(false);
                this.synchronizeTableColumns();
                this.dataTable.fnDraw();
            }

            this.modifyTableHeight(this.calculateDataTableHeight());

            if (onComplete) {
                setTimeout(() => {
                    onComplete();
                }, 10);
            }
        }

        private synchronizeTableColumns() {
            // When enabling scrolling, DataTables creates *three* tables: one for each of the header, footer,
            // and body. DataTables doesn't do a good job of synchronizing these columns; we have to do this here.
            var allBodyThs = this.element.find('.dataTables_scrollBody table th');
            var allHeadThs = this.element.find('.dataTables_scrollHead table th');
            var allFootTds = this.element.find('.dataTables_scrollFoot table td');
            if (allBodyThs.length > 0 && allHeadThs.length > 0 && allFootTds.length > 0) {
                var synchronizeFooter = allBodyThs.length === allFootTds.length;
                var synchronizeHeader = allBodyThs.length === allHeadThs.length;

                if (synchronizeFooter || synchronizeHeader) {
                    for (var thidx = 0, len = allBodyThs.length; thidx < len; thidx++) {
                        var currentBodyTh = $(allBodyThs[thidx]);
                        var bodyColumnWidth = currentBodyTh.css(CssConstants.widthProperty);
                        if (synchronizeFooter)
                            $(allFootTds[thidx]).css(CssConstants.widthProperty, bodyColumnWidth);
                        if (synchronizeHeader)
                            $(allHeadThs[thidx]).css(CssConstants.widthProperty, bodyColumnWidth);
                    }
                }
            }
        }

        private modifyTableHeight(height: string) {
            // Setting the table's height is not enough. We have to update the settings
            // in the datatable as well otherwise a resize event will update the table 
            // again with the old setting
            var oSettings = this.dataTable.fnSettings();
            oSettings.oScroll.sY = this.calculateDataTableHeight();
            this.dataTable.fnDraw(true);
        }

        /** Returns the width that is available in the viewport after padding is taken into account
        */
        private getAvailableViewportWidth(rawViewportWidth: number, columnCount: number): number {
            if (columnCount < 2)
                return rawViewportWidth;

            return rawViewportWidth - (Table.padding * (columnCount - 1));
        }

        private applyColumnSizePolicy(newViewport: IViewport) {

            if (this.columnCount !== undefined &&
                this.currentViewport.width !== undefined &&
                this.columnSizePolicy !== TableColumnSizePolicy.Auto) {

                this.columnSizePolicy = Table.getTableColumnSizePolicy(newViewport);
                switch (this.columnSizePolicy) {
                    case TableColumnSizePolicy.FixedColumns4:
                        this.fitToColumnCount(4, newViewport);
                        break;
                    case TableColumnSizePolicy.FixedColumns5:
                        this.fitToColumnCount(5, newViewport);
                        break;
                    case TableColumnSizePolicy.FixedColumns7:
                        this.fitToColumnCount(7, newViewport);
                        break;
                    default:
                        debug.assertFail('Unknown column size policy');
                        break;
                }
            }

            var tableLayout = 'fixed';
            if (this.columnSizePolicy === TableColumnSizePolicy.Auto)
                tableLayout = 'auto';

            this.element.find('table').css('table-layout', tableLayout);
        }

        private fitToColumnCount(columnCount: number, newViewport: IViewport): void {
            var columnsToFit = Math.min(columnCount, this.columnCount);
            var columnWidth = Math.floor(this.getAvailableViewportWidth(newViewport.width, columnsToFit) / columnsToFit);
            this.element.find('th').css(CssConstants.widthProperty, columnWidth);
        }

        private updateInternal() {
            var dataView = this.dataView;
            var tableData = dataView.table;
            var tableDataRows = [];

            if (tableData)
                tableDataRows = <any[]>tableData.rows;

            if (this.columnSizePolicy !== TableColumnSizePolicy.Auto)
                tableDataRows.splice(Table.MaxCountForDashboard, tableDataRows.length);

            var columns = tableData ? tableData.columns : [];
            var formatter = this.formatter;

            var table = $('<table class="table"></table>');

            for (var i = 0, len = tableDataRows.length; i < len; i++) {
                var data = tableDataRows[i];
                for (var f = 0, len1 = columns.length; f < len1; f++) {
                    data[f] = formatter(data[f], valueFormatter.getFormatString(columns[f], Table.formatStringProp));
                }
            }

            this.dataTable = table.dataTable(this.dataTableOptions(
                table,
                dataView,
                tableDataRows,
                false));
        }

        private dataTableOptions(
            table: JQuery,
            dataView: DataView,
            tableDataRows: any[],
            canUpdateQuery: boolean): DataTables.Options {
            var tableContainer = $('<div class="tableContainer" />');
            tableContainer.append(table);

            var tableData = dataView.table;
            var columnMetadata = tableData ? tableData.columns : [];
            this.columnCount = columnMetadata.length;

            // Create Totals row data and footer element
            var totals = this.createTotalsRow(dataView);
            var footer = $('<tfoot/>');
            if (totals) {
                debug.assert(totals.length === columnMetadata.length, 'Totals row has the wrong number of elements');
                table.append(footer);
            }

            var isAutoColumnSize = this.columnSizePolicy === TableColumnSizePolicy.Auto;

            if (isAutoColumnSize) {
                // Since auto-sizing is asynchronous we don't want to show
                // intermediate progress to the user - hide the table and
                // show it when we are ready.
                tableContainer.css(CssConstants.visibilityProperty, 'hidden');

                // Need adequate padding to ensure scrollbar doesn't overlap the data.
                tableContainer.addClass(Table.scrollbarPadClass);
            }
            else {
                // We want the table to use up all the available space to show data, so we choose not to reserve space for the scrollbar.
                tableContainer.removeClass(Table.scrollbarPadClass);
            }

            var options: DataTables.Options = {
                aaSorting: [],        /* initial sort columns */
                bDeferRender: true,   /* lazy rendering */
                bFilter: false,       /* search feature */
                orderClasses: false,  /* highlight order column */
                bPaginate: false,     /* paging */
                bLengthChange: false, /* allow the user to change items per page */
                bInfo: false,         /* footer info */
                bAutoWidth: isAutoColumnSize,               /* must be turned off when using fixed-layout */
                bScrollCollapse: true,
                sScrollX: isAutoColumnSize ? 'true' : '',   /* scroll the table when not using fixed-layout */
                sScrollY: isAutoColumnSize ? this.calculateDataTableHeight() : '',  /* scroll the table when not using fixed-layout */
                aoColumns: columnMetadata.map(col => this.createOptions(col)),
                fnInitComplete: () => {
                    this.element.append(tableContainer);
                    this.applyColumnSizePolicy(this.currentViewport);
                    if (isAutoColumnSize)
                        setTimeout(() => { this.adjustRowAndColumnSizes(() => tableContainer.css(CssConstants.visibilityProperty, 'visible')); }, 10);
                },
                fnHeaderCallback: (header) => this.onHeader(header),
                fnFooterCallback: (foot, data, start, end, display) => this.onFooter(footer, totals, columnMetadata),
            };

            if (canUpdateQuery) {
                options.bServerSide = true;
                options.ajax = (data, callback, settings) => {
                    if (data.sort && data.sort.length > 0) {
                        console.log(data.sort);
                    }

                    callback({
                        data: tableDataRows,
                    });
                };
            }
            else {
                options.aaData = tableDataRows;
            }

            return options;
        }

        private calculateDataTableHeight(): string {
            // Get table header height from css
            var dataTableHeaderHeight = $('.tableContainer .table tr').height();
            var dataTableFooterHeight = 0;

            if (this.shouldShowTotals())
                dataTableFooterHeight = dataTableHeaderHeight;

            return (this.currentViewport.height - dataTableHeaderHeight - dataTableFooterHeight).toString();
        }

        private createTotalsRow(dataView: DataView): any[] {
            if (!this.shouldShowTotals())
                return null;

            var totalRow: any[] = null;
            var totals = dataView.table.totals;

            if (totals && totals.length > 0) {
                totalRow = [];

                // Add totals for measure columns, blank for non-measure columns unless it's the first column
                for (var i = 0, len = totals.length; i < len; ++i) {
                    var totalValue = totals[i];
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
            }

            return totalRow;
        }

        private createOptions(col: DataViewMetadataColumn): DataTables.ColumnOptions {
            var options: DataTables.ColumnOptions = {
                sTitle: col.name,
            };

            if (col.type.numeric)
                options.sClass = Table.Styles.numeric;
            
            // The options.sType allows to specify how the data for the column will be sorted 
            // DataTables is by default treating the date column type to be String. So explicity setting the ColumnType
            if (AxisHelper.isDateTime(col.type))
                options.sType = Table.dateDataType;

            return options;
        }

        private onHeader(header: {}): void {
            debug.assertValue(header, 'header');

            var th = $(header).find('th');

            th.addClass(Table.Styles.th);
        }

        private onFooter(footer: JQuery, totals: any[], columnMetadata: DataViewMetadataColumn[]): void {
            if (totals) {
                var totalRowSelector = '.' + Table.Styles.total;
                var totalRow = $(footer).find(totalRowSelector);

                // append totals row if it's not been created before
                if (totalRow.length === 0) {
                    var totalsRowElement = $('<tr/>');
                    for (var i = 0, len = totals.length; i < len; ++i) {
                        var totalElement = $('<td/>');
                        var column = columnMetadata[i];

                        totalElement.addClass(Table.Styles.tr).addClass(Table.Styles.total);
                        if (column.type.numeric)
                            totalElement.addClass(Table.Styles.numeric);

                        this.formatCell(this.formatter, totalElement, column, totals[i]);
                        totalsRowElement.append(totalElement);
                    }

                    footer.append(totalsRowElement);
                }

                // TODO: Currently we don't support dynamically changing the dataview for table.
                // Whenever user changes the QnA sentence, table gets redrawn. As long as we start
                // to support that feature, we need to update totals row based on the new data.
            }
        }

        private formatCell(
            formatter: ICustomValueFormatter,
            td: JQuery,
            column: DataViewMetadataColumn,
            data: any): void {
            debug.assertValue(td, 'td');
            debug.assertValue(formatter, 'formatter');
            debug.assertValue(column, 'column');

            var formatted = formatter(data, valueFormatter.getFormatString(column, Table.formatStringProp));
            td.text(formatted);
        }

        private shouldShowTotals(): boolean {
            var dataView = this.dataView;
            if (dataView) {
                var objects = <TableDataViewObjects>dataView.metadata.objects;
                if (objects && objects.general && objects.general.totals)
                    return true;
            }

            return false;
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[]{
            var instances: VisualObjectInstance[] = [];
            if (options.objectName === 'general') {
                instances.push({
                    selector: null,
                    properties: {
                        totals: this.shouldShowTotals(),
                    },
                    objectName: options.objectName
                });
            }
            return instances;
        }
    }
}