//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    export interface SlicerBehaviorOptions {
        datapoints: SlicerDataPoint[];
        slicerItemContainers: D3.Selection;
        slicerItemLabels: D3.Selection;
        slicerItemInputs: D3.Selection;
        slicerClear: D3.Selection;
    }

    export class SlicerWebBehavior {
        public select(selectionLabels: D3.Selection) {
            selectionLabels.style({
                'color': (d: SlicerDataPoint) => {
                    if (d.selected)
                        return Slicer.DefaultStyleProperties.slicerText.selectionColor;
                    else
                        return Slicer.DefaultStyleProperties.slicerText.color;
                }
            });
        }

        public mouseInteractions(selectionLabels: D3.Selection) {
            selectionLabels.style({
                'color': (d: SlicerDataPoint) => {
                    if (d.mouseOver)
                        return Slicer.DefaultStyleProperties.slicerText.hoverColor;

                    if (d.mouseOut) {
                        if (d.selected)
                            return Slicer.DefaultStyleProperties.slicerText.selectionColor;
                        else
                            return Slicer.DefaultStyleProperties.slicerText.color;
                    }
                }
            });
        }

        public clearSlicers(selectionLabels: D3.Selection, slicerItemInputs: D3.Selection) {
            slicerItemInputs.selectAll('input').property('checked', false);
            selectionLabels.style('color', Slicer.DefaultStyleProperties.slicerText.color);
        }
    }
}  