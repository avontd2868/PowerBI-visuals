//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    export interface LineChartBehaviorOptions {
        dataPoints: SelectableDataPoint[];
        cats: D3.Selection;
        lines: D3.Selection;
        dots: D3.Selection;
        areas: D3.Selection;
        background: D3.Selection;
    }

    export class LineChartWebBehavior {
        public select(hasSelection: boolean, lines: D3.Selection, dots: D3.Selection, areas: D3.Selection) {
            lines.style("stroke-opacity", (d: SelectableDataPoint) => ColumnUtil.getFillOpacity(d.selected, false, hasSelection, false));
            dots.style("fill-opacity", (d: SelectableDataPoint) => ColumnUtil.getFillOpacity(d.selected, false, hasSelection, false));
            if (areas)
                areas.style("fill-opacity", (d: SelectableDataPoint) => (hasSelection && !d.selected) ? LineChart.DimmedAreaFillOpacity : LineChart.AreaFillOpacity);
        }
    }
} 