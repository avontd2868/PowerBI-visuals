//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    export interface WaterfallChartBehaviorOptions {
        datapoints: SelectableDataPoint[];
        bars: D3.Selection;
        background: D3.Selection;
    }

    export class WaterfallChartWebBehavior {
        public select(hasSelection: boolean, selection: D3.Selection) {
            selection.style("fill-opacity",(d: WaterfallChartDataPoint) => ColumnUtil.getFillOpacity(d.selected, d.highlight, hasSelection, false));
        }
    }
}  