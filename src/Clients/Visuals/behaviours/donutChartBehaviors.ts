//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    export interface DonutBehaviorOptions {
        datapoints: SelectableDataPoint[];
        slices: D3.Selection;
        highlightSlices: D3.Selection;
        background: D3.Selection;
        allowDrilldown: boolean;
        visual: DonutChart;
        hasHighlights: boolean;
    }

    export class DonutChartWebBehavior {
        private allowDrilldown: boolean;
        private isDrilled: boolean;
        private visual: DonutChart;
        private svg: D3.Selection;

        constructor(options: DonutBehaviorOptions) {
            this.allowDrilldown = options.allowDrilldown;
            this.visual = options.visual;
            this.svg = options.background;
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