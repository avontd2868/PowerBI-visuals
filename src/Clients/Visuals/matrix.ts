//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    
    /** Extension of the Matrix node for Matrix visual*/
    export interface MatrixVisualNode extends DataViewMatrixNode {
        /** Index of the node in its parent's children collection
        NOTE: for size optimization, we could also look this item up in the parent's children collection, but we may need to pay the perf penalty */
        index?: number;

        /** Global index of the node as a leaf node. If the node is not a leaf, the value is undefined */
        leafIndex?: number;

        /** Parent of the node. Undefined for outermost nodes (children of the one root node) */
        parent?: MatrixVisualNode;
    }

    export interface MatrixCornerItem {
        metadata: DataViewMetadataColumn;
        isColumnHeaderLeaf: boolean;
        isRowHeaderLeaf: boolean;
    }

    export interface MatrixVisualBodyItem {
        content: any;
        isSubtotal: boolean;
    }

    /** Interface for refreshing Matrix Data View */
    export interface MatrixDataAdapter {
        update(dataViewMatrix?: DataViewMatrix): void;
        updateRows(): void;
    }

    export interface MatrixDataViewObjects extends DataViewObjects {
        general: MatrixDataViewObject;
    }

    export interface MatrixDataViewObject extends DataViewObject {
        rowSubtotals: boolean;
        columnSubtotals: boolean;
    }

    export interface IMatrixHierarchyNavigator extends controls.ITablixHierarchyNavigator, MatrixDataAdapter {
        getDataViewMatrix(): DataViewMatrix;
        getDepth(hierarchy: MatrixVisualNode[]): number;
        getLeafCount(hierarchy: MatrixVisualNode[]): number;
        getLeafAt(hierarchy: MatrixVisualNode[], index: number): any;
        getLeafIndex(item: MatrixVisualNode): number;
        getParent(item: MatrixVisualNode): MatrixVisualNode;
        getIndex(item: MatrixVisualNode): number;
        isLeaf(item: MatrixVisualNode): boolean;
        isRowHierarchyLeaf(item: any): boolean;
        isColumnHierarchyLeaf(item: any): boolean;
        isLastItem(item: MatrixVisualNode, items: MatrixVisualNode[]): boolean;
        getChildren(item: MatrixVisualNode): MatrixVisualNode[];
        getCount(items: MatrixVisualNode[]): number;
        getAt(items: MatrixVisualNode[], index: number): MatrixVisualNode;
        getLevel(item: MatrixVisualNode): number;
        getIntersection(rowItem: MatrixVisualNode, columnItem: MatrixVisualNode): MatrixVisualBodyItem;
        getCorner(rowLevel: number, columnLevel: number): MatrixCornerItem;
        headerItemEquals(item1: MatrixVisualNode, item2: MatrixVisualNode): boolean;
    }

    var RoleNames = {
        rows: 'Rows',
        columns: 'Columns',
        values: 'Values',
    };

    interface MatrixHierarchy extends DataViewHierarchy {
        leafNodes?: MatrixVisualNode[];
    }

    /** Factory method used by unit tests */
    export function createMatrixHierarchyNavigator(matrix: DataViewMatrix, formatter: ICustomValueFormatter): IMatrixHierarchyNavigator {
        return new MatrixHierarchyNavigator(matrix, formatter);
    }

    class MatrixHierarchyNavigator implements IMatrixHierarchyNavigator {

        private matrix: DataViewMatrix;
        private rowHierarchy: MatrixHierarchy;
        private columnHierarchy: MatrixHierarchy;
        private formatter: ICustomValueFormatter;

        constructor(matrix: DataViewMatrix, formatter: ICustomValueFormatter) {
            this.matrix = matrix;
            this.rowHierarchy = MatrixHierarchyNavigator.wrapMatrixHierarchy(matrix.rows);
            this.columnHierarchy = MatrixHierarchyNavigator.wrapMatrixHierarchy(matrix.columns);
            this.formatter = formatter;

            this.update();
        }

        /** Returns the data view matrix. */
        public getDataViewMatrix(): DataViewMatrix {
            return this.matrix;
        }

        /** Returns the depth of a hierarchy. */
        public getDepth(hierarchy: MatrixVisualNode[]): number {
            var matrixHierarchy = this.getMatrixHierarchy(hierarchy);
            if (matrixHierarchy)
                return Math.max(matrixHierarchy.levels.length, 1);

            return 1;
        }

        /** Returns the leaf count of a hierarchy. */
        public getLeafCount(hierarchy: MatrixVisualNode[]): number {
            var matrixHierarchy = this.getMatrixHierarchy(hierarchy);
            if (matrixHierarchy)
                return matrixHierarchy.leafNodes.length;

            debug.assertFail('Hierarchy cannot be found');
            return 0;
        }

        /** Returns the leaf member of a hierarchy at a specified index. */
        public getLeafAt(hierarchy: MatrixVisualNode[], index: number): MatrixVisualNode {
            var matrixHierarchy = this.getMatrixHierarchy(hierarchy);
            if (matrixHierarchy)
                return matrixHierarchy.leafNodes[index];

            return null;
        }

        /** Returns the leaf index of the visual node. */
        public getLeafIndex(item: MatrixVisualNode): number {
            debug.assertValue(item, 'item');

            return item.leafIndex;
        }

        /** Returns the specified hierarchy member parent. */
        public getParent(item: MatrixVisualNode): MatrixVisualNode {
            debug.assertValue(item, 'item');

            // Return null for outermost nodes
            if (item.level === 0)
                return null;

            return item.parent;
        }

        /** Returns the index of the hierarchy member relative to its parent. */
        public getIndex(item: MatrixVisualNode): number {
            debug.assertValue(item, 'item');

            return item.index;
        }

        /** Checks whether a hierarchy member is a leaf. */
        public isLeaf(item: MatrixVisualNode): boolean {
            debug.assertValue(item, 'item');

            return !item.children || item.children.length === 0;
        }

        public isRowHierarchyLeaf(item: MatrixCornerItem): boolean {
            return true;
        }

        public isColumnHierarchyLeaf(item: MatrixCornerItem): boolean {
            return false;
        }

        /** Checks whether a hierarchy member is the last item within its parent. */
        public isLastItem(item: MatrixVisualNode, items: MatrixVisualNode[]): boolean {
            debug.assertValue(item, 'item');

            return items[items.length - 1] === item;
        }

        /** Gets the children members of a hierarchy member. */
        public getChildren(item: MatrixVisualNode): MatrixVisualNode[] {
            debug.assertValue(item, 'item');

            return item.children;
        }

        /** Gets the members count in a specified collection. */
        public getCount(items: MatrixVisualNode[]): number {
            debug.assertValue(items, 'items');

            return items.length;
        }

        /** Gets the member at the specified index. */
        public getAt(items: MatrixVisualNode[], index: number): MatrixVisualNode {
            debug.assertValue(items, 'items');

            return items[index];
        }

        /** Gets the hierarchy member level. */
        public getLevel(item: MatrixVisualNode): number {
            debug.assertValue(item, 'item');

            return item.level;
        }

        /** Returns the intersection between a row and a column item. */
        public getIntersection(rowItem: MatrixVisualNode, columnItem: MatrixVisualNode): MatrixVisualBodyItem {
            debug.assertValue(rowItem, 'rowItem');
            debug.assertValue(columnItem, 'columnItem');

            var isSubtotalItem = rowItem.isSubtotal === true || columnItem.isSubtotal === true;

            if (!rowItem.values)
                return {
                    content: '',
                    isSubtotal: isSubtotalItem,
                };

            var intersection = <DataViewMatrixNodeValue>(rowItem.values[columnItem.leafIndex]);
            if (!intersection)
                return {
                    content: '',
                    isSubtotal: isSubtotalItem,
                };

            var formatString = valueFormatter.getFormatString(this.matrix.valueSources[intersection.valueSourceIndex ? intersection.valueSourceIndex : 0], Matrix.formatStringProp);
            var formattedValue = this.formatter(intersection.value, formatString);

            return {
                content: formattedValue,
                isSubtotal: isSubtotalItem,
            };
        }

        /** Returns the corner cell between a row and a column level. */
        public getCorner(rowLevel: number, columnLevel: number): MatrixCornerItem {
            debug.assert(rowLevel >= 0, 'rowLevel');
            debug.assert(columnLevel >= 0, 'columnLevel');

            var columnLevels = this.columnHierarchy.levels;
            var rowLevels = this.rowHierarchy.levels;

            if (columnLevel === columnLevels.length - 1 || columnLevels.length === 0) {
                var levelSource = rowLevels[rowLevel];
                if (levelSource)
                    return {
                        metadata: levelSource.sources[0],
                        isColumnHeaderLeaf: true,
                        isRowHeaderLeaf: rowLevel === rowLevels.length - 1,
                    };
            }

            if (rowLevel === rowLevels.length - 1) {
                var levelSource = columnLevels[columnLevel];
                if (levelSource)
                    return {
                        metadata: levelSource.sources[0],
                        isColumnHeaderLeaf: false,
                        isRowHeaderLeaf: true,
                    };
            }

            return {
                metadata: null,
                isColumnHeaderLeaf: false,
                isRowHeaderLeaf: false,
            };
        }

        public headerItemEquals(item1: MatrixVisualNode, item2: MatrixVisualNode): boolean {
            return (item1 === item2);
        }

        public bodyCellItemEquals(item1: MatrixVisualBodyItem, item2: MatrixVisualBodyItem): boolean {
            return (item1 === item2);
        }

        public cornerCellItemEquals(item1: any, item2: any): boolean {
            return (item1 === item2);
        }

        public update(): void {
            this.updateHierarchy(this.rowHierarchy);
            this.updateHierarchy(this.columnHierarchy);

            MatrixHierarchyNavigator.updateStaticColumnHeaders(this.columnHierarchy);
        }

        public updateRows(): void {
            this.updateHierarchy(this.rowHierarchy);
        }

        private static wrapMatrixHierarchy(hierarchy: DataViewHierarchy): MatrixHierarchy {
            var matrixHierarchy = Prototype.inherit<MatrixHierarchy>(hierarchy);
            matrixHierarchy.leafNodes = [];

            return matrixHierarchy;
        }

        private updateHierarchy(hierarchy: MatrixHierarchy): void {
            if (hierarchy.leafNodes.length > 0)
                hierarchy.leafNodes.length = 0;

            if (hierarchy.root.children)
                this.updateRecursive(hierarchy, hierarchy.root.children, null, hierarchy.leafNodes);
        }

        private updateRecursive(hierarchy: MatrixHierarchy, nodes: MatrixVisualNode[], parent: MatrixVisualNode, cache: MatrixVisualNode[]): void {
            var level: DataViewHierarchyLevel;
            for (var i = 0, ilen = nodes.length; i < ilen; i++) {
                var node = nodes[i];
                if (parent)
                    node.parent = parent;

                if (!level)
                    level = hierarchy.levels[node.level];

                if (level) {
                    var source = level.sources[node.levelSourceIndex ? node.levelSourceIndex : 0];
                    var formatString = valueFormatter.getFormatString(source, Matrix.formatStringProp);
                    if (formatString)
                        node.name = this.formatter(node.value, formatString);
                }

                node.index = i;
                if (node.children && node.children.length > 0) {
                    this.updateRecursive(hierarchy, node.children, node, cache);
                }
                else {
                    node.leafIndex = cache.length;
                    cache.push(node);
                }
            }
        }

        private static updateStaticColumnHeaders(columnHierarchy: MatrixHierarchy): void {
            var columnLeafNodes = columnHierarchy.leafNodes;
            if (columnLeafNodes && columnLeafNodes.length > 0) {
                var columnLeafSources = columnHierarchy.levels[columnLeafNodes[0].level].sources;

                for (var i = 0, ilen = columnLeafNodes.length; i < ilen; i++) {
                    var columnLeafNode = columnLeafNodes[i];

                    // Static leaf may need to get label from it's definition
                    if (!columnLeafNode.identity && columnLeafNode.value === undefined) {
                        // We make distincion between null and undefined. Null can be considered as legit value, undefined means we need to fall back to metadata
                        var source = columnLeafSources[columnLeafNode.levelSourceIndex ? columnLeafNode.levelSourceIndex : 0];
                        if (source)
                            columnLeafNode.name = source.name;
                    }
                }
            }
        }

        private getMatrixHierarchy(rootNodes: MatrixVisualNode[]): MatrixHierarchy {
            var rowHierarchyRootNodes = this.rowHierarchy.root.children;
            if (rowHierarchyRootNodes && rootNodes === rowHierarchyRootNodes)
                return this.rowHierarchy;

            var columnHierarchyRootNodes = this.columnHierarchy.root.children;
            if (columnHierarchyRootNodes && rootNodes === columnHierarchyRootNodes)
                return this.columnHierarchy;

            return null;
        }
    }

    export interface MatrixBinderOptions {
        onBindRowHeader? (item: MatrixVisualNode): void;
        totalLabel?: string;
        onColumnHeaderClick? (queryName: string): void;
    }

    export class MatrixBinder implements controls.ITablixBinder {

        private static headerClassName = "bi-tablix-header";
        private static columnHeaderLeafClassName = "bi-tablix-column-header-leaf";
        private static rowHeaderLeafClassName = "bi-tablix-row-header-leaf";
        private static bodyCellClassName = "bi-matrix-body-cell";
        private static totalClassName = "total";
        private static nonBreakingSpace = '&nbsp;';

        private characterWidth: number;
        private characterHeight: number;

        private hierarchyNavigator: IMatrixHierarchyNavigator;
        private options: MatrixBinderOptions;

        constructor(hierarchyNavigator: IMatrixHierarchyNavigator, options: MatrixBinderOptions) {

            // We pass the hierarchy navigator in here because it is the object that will
            // survive data changes and gets updated with the latest data view.
            this.hierarchyNavigator = hierarchyNavigator;
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
        public bindRowHeader(item: MatrixVisualNode, cell: controls.ITablixCell): void {
            var styleClasses: string;

            var isLeaf = !item.children || item.children.length === 0;
            if (isLeaf)
                styleClasses = MatrixBinder.rowHeaderLeafClassName;
            else
                styleClasses = MatrixBinder.headerClassName;

            if (item.isSubtotal)
                styleClasses += ' ' + MatrixBinder.totalClassName;

            cell.extension.setContainerStyle(styleClasses);

            this.bindHeader(item, cell, this.getRowHeaderMetadata(item));

            if (this.options.onBindRowHeader)
                this.options.onBindRowHeader(item);
        }

        public unbindRowHeader(item: any, cell: controls.ITablixCell): void {
            cell.extension.clearContainerStyle();
            controls.HTMLElementUtils.clearChildren(cell.extension.contentHost);
        }

        // Column Header
        public bindColumnHeader(item: MatrixVisualNode, cell: controls.ITablixCell): void {
            var styleClasses: string;
            var overwriteTotalLabel = false;

            var isLeaf = !item.children || item.children.length === 0;
            if (isLeaf) {
                styleClasses = MatrixBinder.columnHeaderLeafClassName;

                var sortableHeaderColumnMetadata = this.getSortableHeaderColumnMetadata(item);
                if (sortableHeaderColumnMetadata) {
                    this.registerColumnHeaderClickHandler(sortableHeaderColumnMetadata, cell);
                }

                // Overwrite only if the there are subtotal siblings (like in the multimeasure case), which means ALL siblings are subtotals.
                if (item.isSubtotal && item.parent && item.parent.children.length > 1 && (<MatrixVisualNode>item.parent.children[0]).isSubtotal)
                    overwriteTotalLabel = true;
            }
            else {
                styleClasses = MatrixBinder.headerClassName;
            }

            if (item.isSubtotal)
                styleClasses += ' ' + MatrixBinder.totalClassName;

            cell.extension.setContainerStyle(styleClasses);
            cell.extension.disableDragResize();

            this.bindHeader(item, cell, this.getColumnHeaderMetadata(item), overwriteTotalLabel);
        }

        public unbindColumnHeader(item: MatrixVisualNode, cell: controls.ITablixCell): void {
            cell.extension.clearContainerStyle();
            cell.extension.contentHost.textContent = '';

            var sortableHeaderColumnMetadata = this.getSortableHeaderColumnMetadata(item);
            if (sortableHeaderColumnMetadata) {
                this.unregisterColumnHeaderClickHandler(cell);
            }
        }

        // Body Cell
        public bindBodyCell(item: MatrixVisualBodyItem, cell: controls.ITablixCell): void {
            var styleClasses = MatrixBinder.bodyCellClassName;

            if (item.isSubtotal)
                styleClasses += ' ' + MatrixBinder.totalClassName;

            cell.extension.setContainerStyle(styleClasses);
            cell.extension.contentHost.textContent = item.content;
        }

        public unbindBodyCell(item: MatrixVisualBodyItem, cell: controls.ITablixCell): void {
            cell.extension.clearContainerStyle();
            cell.extension.contentHost.textContent = '';
        }

        private registerColumnHeaderClickHandler(columnMetadata: DataViewMetadataColumn, cell: controls.ITablixCell) {
            if (this.options.onColumnHeaderClick) {
                var handler = (e: MouseEvent) => {
                    this.options.onColumnHeaderClick(columnMetadata.queryName ? columnMetadata.queryName : columnMetadata.name);
                };
                cell.extension.registerClickHandler(handler);
            }
        }

        private unregisterColumnHeaderClickHandler(cell: controls.ITablixCell) {
            if (this.options.onColumnHeaderClick) {
                cell.extension.unregisterClickHandler();
            }
        }

        // Corner Cell
        public bindCornerCell(item: MatrixCornerItem, cell: controls.ITablixCell): void {
            var styleClasses: string;

            if (item.isColumnHeaderLeaf) {
                styleClasses = MatrixBinder.columnHeaderLeafClassName;
                var cornerHeaderMetadata = this.getSortableCornerColumnMetadata(item);
                if (cornerHeaderMetadata)
                    this.registerColumnHeaderClickHandler(cornerHeaderMetadata, cell);
            }

            if (item.isRowHeaderLeaf) {
                if (styleClasses)
                    styleClasses += ' ';
                else
                    styleClasses = '';

                styleClasses += MatrixBinder.rowHeaderLeafClassName;
            }

            if (styleClasses)
                cell.extension.setContainerStyle(styleClasses);
            else
                cell.extension.setContainerStyle(MatrixBinder.headerClassName);

            cell.extension.disableDragResize();
            cell.extension.contentHost.textContent = item.metadata ? item.metadata.name : '';
        }

        public unbindCornerCell(item: MatrixCornerItem, cell: controls.ITablixCell): void {
            cell.extension.clearContainerStyle();
            cell.extension.contentHost.textContent = '';

            if (item.isColumnHeaderLeaf) {
                this.unregisterColumnHeaderClickHandler(cell);
        }
        }

        public bindEmptySpaceHeaderCell(cell: controls.ITablixCell): void {
        }

        public unbindEmptySpaceHeaderCell(cell: controls.ITablixCell): void {
        }

        public bindEmptySpaceFooterCell(cell: controls.ITablixCell): void {
        }

        public unbindEmptySpaceFooterCell(cell: controls.ITablixCell): void {
        }

        // Measurement Helper
        public getEstimatedRowHeaderWidth(item: MatrixVisualNode): number {
            return this.getEstimatedHeaderWidth(item);
        }

        public getEstimatedColumnHeaderWidth(item: MatrixVisualNode): number {
            return this.getEstimatedHeaderWidth(item);
        }

        public getEstimatedBodyCellWidth(item: MatrixVisualBodyItem): number {
            return this.getEstimatedTextWidth(item.content);
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

        private getEstimatedHeaderWidth(item: MatrixVisualNode): number {
            var label = MatrixBinder.getNodeLabel(item);
            if (label)
                return this.getEstimatedTextWidth(label);

            return 0;
        }

        private static getNodeLabel(node: MatrixVisualNode): string {
            // Return formatted value
            if (node.name)
                return node.name;

            // Return unformatted value (fallback case)
            if (node.value != null)
                return node.value.toString();

            return '';
        }

        private bindHeader(item: MatrixVisualNode, cell: controls.ITablixCell, metadata: DataViewMetadataColumn, overwriteSubtotalLabel?: boolean): void {
            if (item.isSubtotal && !overwriteSubtotalLabel) {
                cell.extension.contentHost.textContent = this.options.totalLabel;
                return;
            }

            var value = MatrixBinder.getNodeLabel(item);
            if (!value) {
                // just to maintain the height of the row in case all realized cells are nulls
                cell.extension.contentHost.innerHTML = MatrixBinder.nonBreakingSpace;
                return;
            }

            if (metadata && UrlHelper.isValidUrl(metadata, value)) {
                controls.internal.TablixUtils.appendATagToBodyCell(item.value, cell);
            }
            else 
                cell.extension.contentHost.textContent = value;
        }

        /** Returns the column metadata of the column that needs to be sorted for the specified matrix corner node.
            Returns null if the specified corner node does not represent a sortable header. */
        private getSortableCornerColumnMetadata(item: MatrixCornerItem): DataViewMetadataColumn {
            if (!item.isColumnHeaderLeaf)
                return null;

            return item.metadata;
        }

        private getRowHeaderMetadata(item: MatrixVisualNode): DataViewMetadataColumn {
            if (!this.hierarchyNavigator || !item)
                return;

            var dataView = this.hierarchyNavigator.getDataViewMatrix();

            if (!dataView || !dataView.rows)
                return;

            return this.getHierarchyMetadata(dataView.rows, item.level);
        }

        private getColumnHeaderMetadata(item: MatrixVisualNode): DataViewMetadataColumn {
            if (!this.hierarchyNavigator || !item)
                return;

            var dataView = this.hierarchyNavigator.getDataViewMatrix();
            if (!dataView || !dataView.columns)
                return;

            return this.getHierarchyMetadata(dataView.columns, item.level);
        }

        private getHierarchyMetadata(hierarchy: DataViewHierarchy, level: number): DataViewMetadataColumn {
            if (!hierarchy || !hierarchy.levels || hierarchy.levels.length < level)
                return;

            var levelInfo = hierarchy.levels[level];
            if (!levelInfo || !levelInfo.sources || levelInfo.sources.length === 0)
                return;

            // This assumes the source will always be the first item in the array of sources.
            return levelInfo.sources[0];
        }

        /** Returns the column metadata of the column that needs to be sorted for the specified header node.
            Returns null if the specified header node does not represent a sortable header. */
        private getSortableHeaderColumnMetadata(item: MatrixVisualNode): DataViewMetadataColumn {

            var dataView = this.hierarchyNavigator.getDataViewMatrix();

            // If there are no row groups, sorting is not supported (as it does not make sense).
            if (!dataView.rows || !dataView.rows.levels || dataView.rows.levels.length === 0)
                return null;

            // Note that the measures establish a level as well, so need to subtract 1
            var columnGroupCount = dataView.columns ? dataView.columns.levels.length - 1 : 0;

            var valueIndex: number = -1;
            if (columnGroupCount === 0) {
                // Matrices without column groups, support sorting on all columns (which are then measure columns).
                valueIndex = item.levelSourceIndex;
            }
            else if (item.isSubtotal) {
                // Matrices with column groups support sorting only on the column grand total.
                var isMultiMeasure: boolean = dataView.valueSources && dataView.valueSources.length > 1;

                if (isMultiMeasure) {
                    // In the multi-measure case we need to check if the parent's level is 0 in order
                    // to determine whether this is the column grand total.  The cells are layed out such
                    // that the clickable cells are at the innermost level, but the parent for the column
                    // grand total will have level 0.
                    if (item.parent && item.parent.level === 0)
                        valueIndex = item.levelSourceIndex;
                }
                else {
                    // In the single-measure case we can directly check the level of the subtotal to
                    // detect the column grand total (at level 0).
                    if (item.level === 0)
                        valueIndex = item.levelSourceIndex;
                }
            }

            if (valueIndex !== -1) {
                // NOTE: if the valueIndex is undefined it implicitly means that it is 0 based on the 
                //       visual node contract
                valueIndex = valueIndex ? valueIndex : 0;
                return dataView.valueSources[valueIndex];
            }

            return null;
        }
    }

    export class Matrix implements IVisual {
        public static formatStringProp: DataViewObjectPropertyIdentifier = { objectName: 'general', propertyName: 'formatString' };
        private static preferredLoadMoreThreshold: number = 0.8;

        // DEVNOTE: public only for testing
        public static TotalLabel = 'TableTotalLabel';

        private element: JQuery;
        private currentViewport: IViewport;
        private style: IVisualStyle;
        private dataView: DataView;
        private formatter: ICustomValueFormatter;
        private isInteractive: boolean;
        private hostServices: IVisualHostServices;
        private hierarchyNavigator: IMatrixHierarchyNavigator;        
        private waitingForData: boolean;
        private tablixControl: controls.TablixControl;
        private lastAllowHeaderResize: boolean = true;

        public static capabilities: VisualCapabilities = {
            dataRoles: [
                {
                    name: RoleNames.rows,
                    kind: VisualDataRoleKind.Grouping
                }, {
                    name: RoleNames.columns,
                    kind: VisualDataRoleKind.Grouping
                }, {
                    name: RoleNames.values,
                    kind: VisualDataRoleKind.Measure
                }
            ],
            objects: {
                general: {
                    displayName: data.createDisplayNameGetter('Visual_General'),
                    properties: {
                        formatString: {
                            type: { formatting: { formatString: true } },
                        },
                        rowSubtotals: {
                            type: { bool: true },
                            displayName: data.createDisplayNameGetter('Visual_RowTotals')
                        },
                        columnSubtotals: {
                            type: { bool: true },
                            displayName: data.createDisplayNameGetter('Visual_ColumnTotals')
                        }
                    },
                }
            },
            dataViewMappings: [{
                conditions: [
                    { 'Rows': { max: 0 }, 'Columns': { max: 0 }, 'Values': { min: 1 } },
                    { 'Rows': { min: 1 }, 'Columns': { min: 0 }, 'Values': { min: 0 } },
                    { 'Rows': { min: 0 }, 'Columns': { min: 1 }, 'Values': { min: 0 } }
                ],
                matrix: {
                    rows: {
                        for: { in: 'Rows' },
                        /* Explicitly override the server data reduction to make it appropriate for matrix. */
                        dataReductionAlgorithm: { window: { count: 100 } }
                    },
                    columns: {
                        for: { in: 'Columns' },
                        /* Explicitly override the server data reduction to make it appropriate for matrix. */
                        dataReductionAlgorithm: { top: { count: 100 } }
                    },
                    values: {
                        for: { in: 'Values' }
                    }
                }
            }],
            filterMappings: {
                measureFilter: {
                    targetRoles: [RoleNames.rows]
                }
            },
            sorting: {
                custom: {},
            },
            suppressDefaultTitle: true,
        };

        public static customizeQuery(options: CustomizeQueryOptions): void {
            var dataViewMapping = options.dataViewMappings[0];
            if (!dataViewMapping || !dataViewMapping.matrix || !dataViewMapping.metadata)
                return;

            var dataViewMatrix: data.CompiledDataViewMatrixMapping = <data.CompiledDataViewMatrixMapping>dataViewMapping.matrix;

            var objects: MatrixDataViewObjects = <MatrixDataViewObjects>dataViewMapping.metadata.objects;
            dataViewMatrix.rows.for.in.subtotalType = Matrix.shouldShowRowSubtotals(objects) ? data.CompiledSubtotalType.After : data.CompiledSubtotalType.None;
            dataViewMatrix.columns.for.in.subtotalType = Matrix.shouldShowColumnSubtotals(objects) ? data.CompiledSubtotalType.After : data.CompiledSubtotalType.None;
        }

        public static getSortableRoles(): string[] {
            return ['Rows', 'Values'];
        }

        public init(options: VisualInitOptions): void {
            this.element = options.element;
            this.style = options.style;
            this.updateViewport(options.viewport);
            this.formatter = valueFormatter.formatRaw;
            this.isInteractive = options.interactivity && options.interactivity.selection != null;
            this.hostServices = options.host;
        }

        public onResizing(finalViewport: IViewport, duration: number): void {
            this.updateViewport(finalViewport);
        }

        public onDataChanged(options: VisualDataChangedOptions): void {
            debug.assertValue(options, 'options');

            if (options.dataViews && options.dataViews.length > 0) {
                this.dataView = options.dataViews[0];

                if (options.operationKind === VisualDataChangeOperationKind.Append) {
                    this.hierarchyNavigator.updateRows();
                    this.tablixControl.refresh(false);
                } else {
                    this.updateInternal();
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

        private createControl(matrixNavigator: IMatrixHierarchyNavigator): controls.TablixControl {
            var matrixBinderOptions: MatrixBinderOptions = {
                onBindRowHeader: (item: MatrixVisualNode) => { this.onBindRowHeader(item); },
                totalLabel: this.hostServices.getLocalizedString(Matrix.TotalLabel),
                onColumnHeaderClick: (queryName: string) => this.onColumnHeaderClick(queryName),
            };
            var matrixBinder = new MatrixBinder(this.hierarchyNavigator, matrixBinderOptions);

            var tablixContainer = document.createElement('div');
            tablixContainer.className = "tablixContainer";
            this.element.append(tablixContainer);

            var tablixOptions: controls.TablixOptions = {
                interactive: this.isInteractive,
                enableTouchSupport: false
            };

            return new controls.TablixControl(matrixNavigator, matrixBinder, tablixContainer, tablixOptions);
        }

        private updateInternal() {
            var dataView = this.dataView;

            if (!this.tablixControl) {
                var matrixNavigator = createMatrixHierarchyNavigator(dataView.matrix, this.formatter);
                this.hierarchyNavigator = matrixNavigator;

                // Create the control
                this.tablixControl = this.createControl(matrixNavigator);
            }
            else {
                this.hierarchyNavigator.update(dataView.matrix);
            }

            this.verifyHeaderResize();
            this.tablixControl.columnDimension.model = dataView.matrix.columns.root.children;
            this.tablixControl.rowDimension.model = dataView.matrix.rows.root.children;

            this.tablixControl.width = this.currentViewport.width;
            this.tablixControl.height = this.currentViewport.height;

            this.tablixControl.rowDimension.scrollOffset = 0;
            this.tablixControl.columnDimension.scrollOffset = 0;

            // We need the layout for the DIV to be done so that the control can measure items correctly.
            setTimeout(() => {
                // Render
                this.tablixControl.refresh(true);
            }, 0);
        }

        private onBindRowHeader(item: MatrixVisualNode): void {
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
        public needsMoreData(item: MatrixVisualNode): boolean {
            if (this.waitingForData || !this.hierarchyNavigator.isLeaf(item) || !this.dataView.metadata || !this.dataView.metadata.segment)
                return false;

            var leafCount = this.tablixControl.rowDimension.getItemsCount();
            var loadMoreThreshold = leafCount * Matrix.preferredLoadMoreThreshold;

            return this.hierarchyNavigator.getLeafIndex(item) >= loadMoreThreshold;
        }

        private static shouldShowRowSubtotals(objects: MatrixDataViewObjects): boolean {
            if (objects && objects.general)
                return objects.general.rowSubtotals !== false;

            // By default, totals are enabled
            return true;
        }

        private static shouldShowColumnSubtotals(objects: MatrixDataViewObjects): boolean {
            if (objects && objects.general)
                return objects.general.columnSubtotals !== false;

            // By default, totals are enabled
            return true;
        }

        private getMatrixDataViewObjects(): MatrixDataViewObjects {
            if (this.dataView && this.dataView.metadata && this.dataView.metadata.objects)
                return <MatrixDataViewObjects>this.dataView.metadata.objects;
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] {
            var instances: VisualObjectInstance[] = [];
            if (options.objectName === 'general') {
                var objects = this.getMatrixDataViewObjects();

                instances.push({
                    selector: null,
                    properties: {
                        rowSubtotals: Matrix.shouldShowRowSubtotals(objects),
                        columnSubtotals: Matrix.shouldShowColumnSubtotals(objects)
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