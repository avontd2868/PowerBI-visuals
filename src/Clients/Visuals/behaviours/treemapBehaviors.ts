//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    export interface TreemapBehaviorOptions {
        shapes: D3.Selection;
        highlightShapes: D3.Selection;
        labels: D3.Selection;
        nodes: TreemapNode[];
        hasHighlights: boolean;
    }

    export class TreemapWebBehavior {
        public select(hasSelection: boolean, datapoints: D3.Selection, hasHighlights: boolean) {
            datapoints
                .style("fill", (d: TreemapNode) => Treemap.getFill(d, /* isHighlightRect */ false))
                .style("fill-opacity", (d: TreemapNode) => Treemap.getFillOpacity(d, hasSelection, !d.selected && hasHighlights, /* isHighlightRect */ false));
        }
    }
}