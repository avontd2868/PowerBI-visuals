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
    export interface MapBehaviorOptions {
        bubbles?: D3.Selection;
        slices?: D3.Selection;
        shapes?: D3.Selection;
        clearCatcher: D3.Selection;
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