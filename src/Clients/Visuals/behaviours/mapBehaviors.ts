//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    export interface MapBehaviorOptions {
        bubbles?: D3.Selection;
        slices?: D3.Selection;
        shapes?: D3.Selection;
        background: D3.Selection;
        dataPoints: SelectableDataPoint[];
    }

    export class MapBehavior {
        public select(hasSelection: boolean, bubbles: D3.Selection, slices: D3.Selection, shapes: D3.Selection) {
            if (bubbles) {
                bubbles
                    .style({
                        'fill-opacity': (d: MapBubble) => ColumnUtil.getFillOpacity(d.selected, false, hasSelection, false),
                        'stroke-opacity': (d: MapBubble) => ColumnUtil.getFillOpacity(d.selected, false, hasSelection, false),
                    });
            }
            if (slices) {
                slices
                    .style({
                        "fill-opacity": (d) => ColumnUtil.getFillOpacity(d.data.selected, false, hasSelection, false),
                        "stroke-opacity": (d) => ColumnUtil.getFillOpacity(d.data.selected, false, hasSelection, false),
                    });
            }
            if (shapes) {
                shapes
                    .style({
                        "fill-opacity": (d) => ColumnUtil.getFillOpacity(d.selected, false, hasSelection, false),
                        "stroke-opacity": (d) => ColumnUtil.getFillOpacity(d.selected, false, hasSelection, false),
                    });
            }
        }
    }
}