//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    export interface ColumnChartAnimationOptions {
        viewModel: ColumnChartData;
        series: D3.UpdateSelection;
        layout: IColumnLayout;
        itemCS: ClassAndSelector;
        interactivityService: IInteractivityService;
    }

    export interface ColumnChartAnimationResult {
        failed: boolean;
        shapes: D3.UpdateSelection;
    }

    export interface IColumnChartAnimator {
        animate(options: ColumnChartAnimationOptions): ColumnChartAnimationResult;
    }

    export class WebColumnChartAnimator implements IColumnChartAnimator {
        private previousViewModel: ColumnChartData;
        private animationDuration: number = AnimatorCommon.MinervaAnimationDuration;

        public animate(options: ColumnChartAnimationOptions): ColumnChartAnimationResult {
            var result: ColumnChartAnimationResult = {
                failed: true,
                shapes: null,
            };

            var viewModel = options.viewModel;
            var previousViewModel = this.previousViewModel;

            if (!previousViewModel) {
                // This is the initial drawing of the chart, which has no special animation for now.
            }
            else if (viewModel.hasHighlights && !previousViewModel.hasHighlights) {
                result = this.animateNormalToHighlighted(options);
            }
            else if (viewModel.hasHighlights && previousViewModel.hasHighlights) {
                result = this.animateHighlightedToHighlighted(options);
            }
            else if (!viewModel.hasHighlights && previousViewModel.hasHighlights) {
                result = this.animateHighlightedToNormal(options);
            }

            this.previousViewModel = viewModel;
            return result;
        }

        private animateNormalToHighlighted(options: ColumnChartAnimationOptions): ColumnChartAnimationResult {
            var data = options.viewModel;
            var itemCS = options.itemCS;
            var shapeSelection = options.series.selectAll(itemCS.selector);
            var shapes = shapeSelection.data((d: ColumnChartSeries) => d.data, (d: ColumnChartDataPoint) => d.key);
            var hasHighlights = data.hasHighlights;

            shapes
                .enter()
                .append('rect')
                .attr("class", (d: ColumnChartDataPoint) => itemCS.class.concat(d.highlight ? " highlight" : ""))
                .attr(options.layout.shapeLayoutWithoutHighlights); // Start out at the non-highlight layout

            shapes
                .style("fill", (d: ColumnChartDataPoint) => d.color)
                .style("fill-opacity", (d: ColumnChartDataPoint) => ColumnUtil.getFillOpacity(d.selected, d.highlight, false, hasHighlights))
                .transition()
                .duration(this.animationDuration)
                .attr(options.layout.shapeLayout);

            shapes
                .exit()
                .remove();

            return {
                failed: false,
                shapes: shapes,
            };
        }

        private animateHighlightedToHighlighted(options: ColumnChartAnimationOptions): ColumnChartAnimationResult {
            var shapes = this.animateDefaultShapes(options.viewModel, options.series, options.layout, options.itemCS);
            return {
                failed: false,
                shapes: shapes,
            };
        }

        private animateHighlightedToNormal(options: ColumnChartAnimationOptions): ColumnChartAnimationResult {
            var itemCS = options.itemCS;
            var shapeSelection = options.series.selectAll(itemCS.selector);
            var endStyleApplied = false;
            var shapes = shapeSelection.data((d: ColumnChartSeries) => d.data, (d: ColumnChartDataPoint) => d.key);
            var hasSelection = options.interactivityService && (<WebInteractivityService>options.interactivityService).hasSelection();

            shapes
                .enter()
                .append('rect')
                .attr("class", (d: ColumnChartDataPoint) => itemCS.class.concat(d.highlight ? " highlight" : ""));

            shapes
                .style("fill", (d: ColumnChartDataPoint) => d.color)
                .style("fill-opacity", (d: ColumnChartDataPoint) => ColumnUtil.getFillOpacity(d.selected, d.highlight, d.selected, !d.selected))
                .transition()
                .duration(this.animationDuration)
                .attr(options.layout.shapeLayout);

            shapes
                .exit()
                .transition()
                .duration(this.animationDuration)
                .attr(hasSelection ? options.layout.zeroShapeLayout : options.layout.shapeLayoutWithoutHighlights)
                .each("end", () => {
                    if (!endStyleApplied) {
                        shapes.style("fill-opacity", (d: ColumnChartDataPoint) => ColumnUtil.getFillOpacity(d.selected, d.highlight, hasSelection, false));
                        endStyleApplied = true;
                    }
                })
                .remove();

            return {
                failed: false,
                shapes: shapes,
            };
        }

        private animateDefaultShapes(data: ColumnChartData, series: D3.UpdateSelection, layout: IColumnLayout, itemCS: ClassAndSelector): D3.UpdateSelection {
            var shapeSelection = series.selectAll(itemCS.selector);
            var shapes = shapeSelection.data((d: ColumnChartSeries) => d.data, (d: ColumnChartDataPoint) => d.key);

            shapes
                .enter()
                .append('rect')
                .attr("class", (d: ColumnChartDataPoint) => itemCS.class.concat(d.highlight ? " highlight" : ""));

            shapes
                .style("fill", (d: ColumnChartDataPoint) => d.color)
                .style("fill-opacity", (d: ColumnChartDataPoint) => ColumnUtil.getFillOpacity(d.selected, d.highlight, false, data.hasHighlights))
                .transition()
                .duration(this.animationDuration)
                .attr(layout.shapeLayout);

            shapes
                .exit()
                .remove();

            return shapes;
        }
    }
}