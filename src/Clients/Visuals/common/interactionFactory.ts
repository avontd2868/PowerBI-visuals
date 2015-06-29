//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

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