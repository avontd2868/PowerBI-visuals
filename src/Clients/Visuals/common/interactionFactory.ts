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
    export interface InteractivityVisitor {
        visitColumnChart(options: ColumnBehaviorOptions);
        visitDataDotChart(options: DataDotChartBehaviorOptions);
        visitDonutChart(options: DonutBehaviorOptions);
        visitFunnel(options: FunnelBehaviorOptions);
        visitLegend(options: LegendBehaviorOptions);
        visitMap(options: MapBehaviorOptions);
        visitScatterChart(options: ScatterBehaviorOptions);
        visitSlicer(options: SlicerBehaviorOptions);
        visitTreemap(options: TreemapBehaviorOptions);
        visitWaterfallChart(options: WaterfallChartBehaviorOptions);
        visitLegend(options: LegendBehaviorOptions);
        visitLineChart(options: LineChartBehaviorOptions);
    }

    export interface SelectableDataPoint {
        selected: boolean;
        identity: SelectionId;
    }

    export module VisualInteractivityFactory {
        export function buildInteractivityService(options: VisualInitOptions): IInteractivityService {
            if (options.interactivity && options.interactivity.selection) {
                return createInteractivityService(options.host);
            } else if (options.interactivity && options.interactivity.isInteractiveLegend) {
                return new MobileInteractivityService();
            }
            // For hosts that don't have interactivity like the dashboard
            return null;
        }
    }
}