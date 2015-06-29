//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    export interface LegendBehaviorOptions {
        datapoints: LegendDataPoint[];
        legendItems: D3.Selection;
        legendIcons: D3.Selection;
        visualContainer: D3.Selection;
    }

    export class LegendWebBehavior {
        private static selectedLegendColor = '#A6A6A6';
        public select(hasSelection: boolean, legendIcons: D3.Selection) {
            if (hasSelection) {
                legendIcons.style({
                    'fill': (d: LegendDataPoint) => {
                        if (!d.selected)
                            return LegendWebBehavior.selectedLegendColor;   
                        else
                            return d.color;
                    }
                });
            }
            else {
                legendIcons.style({
                    'fill': (d: LegendDataPoint) => {
                        return d.color;
                    }
                });
            }
        }
    }
}