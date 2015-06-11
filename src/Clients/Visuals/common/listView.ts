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

module powerbi.visuals {
    export interface IListView {
        data(data: any[], dataIdFunction: (d) => {}): IListView;
        rowHeight(rowHeight: number): IListView;
        viewport(viewport: IViewport): IListView;
        render(sizeChanged: boolean, resetScrollbarPosition?: boolean): void;
        empty(): void;
    }

    export module ListViewFactory {
        export function createHTMLListView(options): IListView {
            return new ListView(options, ListViewMode.HTML);
        }

        export function createSVGListView(options): IListView {
            return new ListView(options, ListViewMode.SVG);
        }
    }

    export interface ListViewOptions {
        enter: (selection: D3.Selection) => void;
        exit: (selection: D3.Selection) => void;
        update: (selection: D3.Selection) => void;
        loadMoreData: () => void;
        baseContainer: D3.Selection;
        rowHeight: number;
        viewport: IViewport;
    }

    enum ListViewMode {
        SVG,
        HTML
    }

    /**
     * A UI Virtualized List, that uses the D3 Enter, Update & Exit pattern to update rows.
     * It can create lists containing either HTML or SVG elements
     */
    class ListView implements IListView {
        private _dataIdFunction: (d: any) => {};
        private _data: any[];
        private _totalRows: number;

        private options: ListViewOptions;
        private visibleGroupContainer: D3.Selection;
        private scrollContainer: D3.Selection;
        private position: number;
        private delta: number;
        private mode: ListViewMode;
        private visibleRows: number;

        /* The value indicates the percentage of data already shown
           in the list view that triggers a loadMoreData call. */
        private static loadMoreDataThreshold = 0.8;

        public constructor(options: ListViewOptions, mode: ListViewMode) {
            this.options = options;
            this.mode = mode;

            this.options.baseContainer
                .style('overflow-y', 'auto')
                .on('scroll', () => this.render(false));
            this.scrollContainer = options.baseContainer
                .append(mode === ListViewMode.SVG ? 'svg' : 'div')
                .attr('class', 'scrollRegion');
            this.visibleGroupContainer = this.scrollContainer
                .append(mode === ListViewMode.SVG ? 'g' : 'div')
                .attr('class', 'visibleGroup');

            ListView.SetDefaultOptions(options);

            this.position = 0;
        }

        private static SetDefaultOptions(options: ListViewOptions) {
            options.rowHeight = options.rowHeight || 1;
        }

        public rowHeight(rowHeight: number): ListView {
            this.options.rowHeight = rowHeight;
            return this;
        }

        public data(data: any[], dataIdFunction: (d) => {}): IListView {
            this._data = data;
            this._dataIdFunction = dataIdFunction;
            this._totalRows = data ? data.length : 0;
            return this;
        }

        public viewport(viewport: IViewport): IListView {
            this.options.viewport = viewport;
            return this;
        }

        public empty(): void {
            this._data = [];
            this.render(false, true);
        }

        public render(sizeChanged: boolean = false, resetScrollbarPosition: boolean = false): void {
            if (!(this._data && this.options))
                return;
            var scrollTop: number;

            var options = this.options;
            var rowHeight = options.rowHeight;

            debug.assertValue(rowHeight, 'rowHeight');
            debug.assert(rowHeight > 0, 'rowHeight should be more than 0');

            if (resetScrollbarPosition) {
                this.position = 0;
                scrollTop = 0;
                $(options.baseContainer.node()).scrollTop(scrollTop);
            }
            else
                scrollTop = options.baseContainer.node().scrollTop;

            if (sizeChanged) {
                var height = options.viewport.height;
                this.visibleRows = Math.ceil(height / rowHeight) + 1;
            }

            var totalHeight = Math.max(0, (this._totalRows * rowHeight));
            this.scrollContainer
                .style('height', totalHeight + "px")
                .attr('height', totalHeight);

            var lastPosition = this.position;

            var position = this.position = Math.floor(scrollTop / rowHeight);
            this.delta = position - lastPosition;
            this.scrollToFrame(position);
        }

        private scrollToFrame(scrollPosition: number): void {
            var options = this.options;
            var visibleGroupContainer = this.visibleGroupContainer;
            var totalRows = this._totalRows;
            var rowHeight = options.rowHeight;
            var visibleRows = this.visibleRows;

            var translateY = scrollPosition * rowHeight;
            visibleGroupContainer
                .attr('transform', d => SVGUtil.translate(0, translateY))
                .style('transform', d => SVGUtil.translateWithPixels(0, translateY));

            var position0 = Math.max(0, Math.min(scrollPosition, totalRows - visibleRows + 1)),
                position1 = position0 + visibleRows;
            var rowSelection = visibleGroupContainer.selectAll(".row")
                .data(this._data.slice(position0, Math.min(position1, totalRows)), this._dataIdFunction);

            rowSelection
                .enter()
                .append('g')
                .classed('row', true)
                .call(d => options.enter(d));
            rowSelection.order();

            var rowUpdateSelection = visibleGroupContainer.selectAll('.row:not(.transitioning)');

            rowUpdateSelection.call(d => options.update(d));

            if (this.mode === ListViewMode.SVG) {
                rowUpdateSelection.each(function (d, i) {
                    var translate = SVGUtil.translate(0, i * rowHeight);
                    d3.select(this)
                        .attr('transform', d => translate)
                        .style('transform', d => translate);
                });
            }

            rowSelection
                .exit()
                .call(d => options.exit(d))
                .remove();

            if (position1 >= totalRows * ListView.loadMoreDataThreshold)
                options.loadMoreData();
        }
    }
}