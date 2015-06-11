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
    export interface ColumnChartAnimationOptions {
        viewModel: ColumnChartData;
        series: D3.UpdateSelection;
        layout: IColumnLayout;
        itemCS: ClassAndSelector;
        interactivityService: IInteractivityService;
        labelGraphicsContext: D3.Selection;
        labelLayout: ILabelLayout; 
        viewPort: IViewport;
    }

    export interface ColumnChartAnimationResult {
        failed: boolean;
        shapes: D3.UpdateSelection;
        dataLabels: D3.UpdateSelection;
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
                dataLabels: null,
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

            var dataLabels: D3.UpdateSelection = this.animateDefaultDataLabels(options);

            return {
                failed: false,
                shapes: shapes,
                dataLabels: dataLabels,
            };
        }

        private animateHighlightedToHighlighted(options: ColumnChartAnimationOptions): ColumnChartAnimationResult {
            var shapes = this.animateDefaultShapes(options.viewModel, options.series, options.layout, options.itemCS);
            var dataLabels: D3.UpdateSelection = this.animateDefaultDataLabels(options);

            return {
                failed: false,
                shapes: shapes,
                dataLabels: dataLabels,
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

            var dataLabels: D3.UpdateSelection = this.animateDefaultDataLabels(options);

            return {
                failed: false,
                shapes: shapes,
                dataLabels: dataLabels,
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

        private animateDefaultDataLabels(options: ColumnChartAnimationOptions): D3.UpdateSelection {
            var dataLabels: D3.UpdateSelection;

            if (options.viewModel.labelSettings.show) {
                dataLabels = ColumnUtil.drawDefaultLabels(options.series, options.labelGraphicsContext, options.labelLayout, options.viewPort, true, this.animationDuration);
            }
            else {
                dataLabelUtils.cleanDataLabels(options.labelGraphicsContext);
            }

            return dataLabels;
        }
    }
}