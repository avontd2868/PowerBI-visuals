//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    export interface FunnelBehaviorOptions {
        datapoints: SelectableDataPoint[];
        bars: D3.Selection;
        labels: D3.Selection;
        background: D3.Selection;
        hasHighlights: boolean;
    }

    export class FunnelWebBehavior {
        public select(hasSelection: boolean, selection: D3.Selection, hasHighlights: boolean) {
            selection.style("fill-opacity", (d: FunnelSlice) => ColumnUtil.getFillOpacity(d.selected, d.highlight, !d.highlight && hasSelection, !d.selected && hasHighlights));
        }
    }
} 