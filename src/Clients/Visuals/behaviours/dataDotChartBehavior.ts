//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    export interface DataDotChartBehaviorOptions {
        datapoints: SelectableDataPoint[];
        dots: D3.Selection;
        background: D3.Selection;
    }

    export class DataDotChartWebBehavior {
        public select(hasSelection: boolean, selection: D3.Selection) {
            selection.style("fill-opacity",(d: DataDotChartDataPoint) => ColumnUtil.getFillOpacity(d.selected, d.highlight, hasSelection, false));
        }
    }
}  