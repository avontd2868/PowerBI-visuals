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
    export interface DonutBehaviorOptions {
        datapoints: SelectableDataPoint[];
        slices: D3.Selection;
        highlightSlices: D3.Selection;
        clearCatcher: D3.Selection;
        allowDrilldown: boolean;
        visual: DonutChart;
        hasHighlights: boolean;
        svg: D3.Selection;
    }

    export class DonutChartWebBehavior {
        private allowDrilldown: boolean;
        private isDrilled: boolean;
        private visual: DonutChart;
        private svg: D3.Selection;

        constructor(options: DonutBehaviorOptions) {
            this.allowDrilldown = options.allowDrilldown;
            this.visual = options.visual;
            this.svg = options.clearCatcher;
            this.isDrilled = false;
        }

        public select(hasSelection: boolean, selection: D3.Selection, highlighted: boolean, hasHighlights: boolean, data?: DonutDataPoint): void {
            if (hasSelection && this.allowDrilldown) {
                // If we are not already drilled down then drill down into this data
                var dataToShow = !this.isDrilled ? data : undefined;
                this.visual.setDrilldown(dataToShow);
                this.isDrilled = !this.isDrilled;
            }
            else {
                selection.style("fill-opacity", (d: DonutArcDescriptor) => ColumnUtil.getFillOpacity(d.data.selected, highlighted, !highlighted && hasSelection, !d.data.selected && hasHighlights));
            }
        }

        public mouseOver(data: DonutDataPoint): void {
            this.setDataLabelStyle(data, false);
        }

        public mouseOut(data: DonutDataPoint): void {
            this.setDataLabelStyle(data, true);
        }

        private setDataLabelStyle(data: DonutDataPoint, dimmed: boolean) {
            var text = this.svg
                .selectAll('text')
                .filter((d: DonutArcDescriptor) => d.data.identity.getKey() === data.identity.getKey());

            var polyline = this.svg
                .selectAll('polyline')
                .filter((d: DonutArcDescriptor) => d.data.identity.getKey() === data.identity.getKey());

            // Hide the label if it is dimmed and overlapping another slice label
            text.style('opacity', (d: DonutArcDescriptor) => (dimmed && d.data.isLabelOverlapping) ? 0 : 1);
            polyline.style('opacity', (d: DonutArcDescriptor) => (dimmed && d.data.isLabelOverlapping) ? 0 : DonutChart.PolylineOpacity);
        }
    }
}  