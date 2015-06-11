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
    export interface DonutChartAnimationOptions {
        viewModel: DonutData;
        graphicsContext: D3.Selection;
        colors: IDataColorPalette;
        layout: DonutLayout;
        sliceWidthRatio: number;
        radius: number;
        viewport: IViewport;
        interactivityService: IInteractivityService;
    }

    export interface DonutChartAnimationResult {
        failed: boolean;
        shapes: D3.UpdateSelection;
        highlightShapes: D3.UpdateSelection;
    }

    export interface IDonutChartAnimator {
        animate(options: DonutChartAnimationOptions): DonutChartAnimationResult;
    }

    export class WebDonutChartAnimator implements IDonutChartAnimator {
        private previousViewModel: DonutData;
        private animationDuration: number = AnimatorCommon.MinervaAnimationDuration;

        public animate(options: DonutChartAnimationOptions): DonutChartAnimationResult {
            var result: DonutChartAnimationResult = {
                failed: true,
                shapes: null,
                highlightShapes: null,
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

        private animateNormalToHighlighted(options: DonutChartAnimationOptions): DonutChartAnimationResult {
            var shapes = this.animateDefaultShapes(options);

            var highlightShapes = options.graphicsContext.select('.slices')
                .selectAll('path.slice-highlight')
                .data(options.viewModel.dataPoints.filter((value: DonutArcDescriptor) => value.data.highlightRatio != null), (d: DonutArcDescriptor) => d.data.identity.getKey());

            highlightShapes.enter()
                .insert('path')
                .classed('slice-highlight', true)
                .each(function (d) { this._current = d; });

            highlightShapes
                .style('fill', (d: DonutArcDescriptor) => d.data.color ? d.data.color : options.colors.getColor(d.data.identity.getKey()).value)
                .style('fill-opacity', (d: DonutArcDescriptor) => ColumnUtil.getFillOpacity(d.data.selected, true, false, options.viewModel.hasHighlights))
                .attr(options.layout.shapeLayout)  // Start at the non-highlight layout, then transition to the highlight layout.
                .transition()
                .duration(this.animationDuration)
                .attr(options.layout.highlightShapeLayout);

            highlightShapes.exit()
                .remove();

            DonutChart.drawDefaultCategoryLabels(options.graphicsContext, options.viewModel, options.layout, options.sliceWidthRatio, options.radius, options.viewport);

            return {
                failed: false,
                shapes: shapes,
                highlightShapes: highlightShapes,
            };
        }

        private animateHighlightedToHighlighted(options: DonutChartAnimationOptions): DonutChartAnimationResult {
            var shapes = this.animateDefaultShapes(options);

            var highlightShapes = this.animateDefaultHighlightShapes(options);

            DonutChart.drawDefaultCategoryLabels(options.graphicsContext, options.viewModel, options.layout, options.sliceWidthRatio, options.radius, options.viewport);

            return {
                failed: false,
                shapes: shapes,
                highlightShapes: highlightShapes,
            };
        }

        private animateHighlightedToNormal(options: DonutChartAnimationOptions): DonutChartAnimationResult {
            var hasSelection = options.interactivityService && (<WebInteractivityService>options.interactivityService).hasSelection();
            var endStylesApplied = false;

            var shapes = options.graphicsContext.select('.slices')
                .selectAll('path.slice')
                .data(options.viewModel.dataPoints, (d: DonutArcDescriptor) => d.data.identity.getKey());

            shapes.enter()
                .insert('path')
                .classed('slice', true)
                .each(function (d) { this._current = d; });

            // For any slice that is selected we want to keep showing it as dimmed (partially highlighted). After the highlight animation
            // finishes we will set the opacity based on the selection state.
            shapes
                .style('fill', (d: DonutArcDescriptor) => d.data.color ? d.data.color : options.colors.getColor(d.data.identity.getKey()).value)
                .style('fill-opacity', (d: DonutArcDescriptor) => ColumnUtil.getFillOpacity(d.data.selected, false, d.data.selected, !d.data.selected))
                .transition()
                .duration(this.animationDuration)
                .attr(options.layout.shapeLayout);

            shapes.exit()
                .remove();

            var highlightShapes = options.graphicsContext.select('.slices')
                .selectAll('path.slice-highlight')
                .data(options.viewModel.dataPoints.filter((value: DonutArcDescriptor) => value.data.highlightRatio != null), (d: DonutArcDescriptor) => d.data.identity.getKey());

            highlightShapes.enter()
                .insert('path')
                .classed('slice-highlight', true)
                .each(function (d) { this._current = d; });

            highlightShapes
                .style('fill', (d: DonutArcDescriptor) => d.data.color ? d.data.color : options.colors.getColor(d.data.identity.getKey()).value)
                .style('fill-opacity', (d: DonutArcDescriptor) => ColumnUtil.getFillOpacity(false, true, false, true))
                .transition()
                .duration(this.animationDuration)
                .attr(hasSelection ? options.layout.zeroShapeLayout : options.layout.shapeLayout)  // Transition to the non-highlight layout
                .each("end", (d: DonutArcDescriptor) => {
                    if (!endStylesApplied) {
                        shapes.style("fill-opacity", (d: DonutArcDescriptor) => ColumnUtil.getFillOpacity(d.data.selected, false, hasSelection, false));
                        highlightShapes.remove(); // Then remove highlight shapes and set normal shapes to non-highlighted opacities.
                        endStylesApplied = true;
                    }
                });

            highlightShapes.exit()
                .remove();

            DonutChart.drawDefaultCategoryLabels(options.graphicsContext, options.viewModel, options.layout, options.sliceWidthRatio, options.radius, options.viewport);

            return {
                failed: false,
                shapes: shapes,
                highlightShapes: highlightShapes,
            };
        }

        private animateDefaultShapes(options: DonutChartAnimationOptions): D3.UpdateSelection {
            var shapes = options.graphicsContext.select('.slices')
                .selectAll('path.slice')
                .data(options.viewModel.dataPoints, (d: DonutArcDescriptor) => d.data.identity.getKey());

            shapes.enter()
                .insert('path')
                .classed('slice', true)
                .each(function (d) { this._current = d; });

            shapes
                .style('fill', (d: DonutArcDescriptor) => d.data.color ? d.data.color : options.colors.getColor(d.data.identity.getKey()).value)
                .style('fill-opacity', (d: DonutArcDescriptor) => ColumnUtil.getFillOpacity(d.data.selected, false, false, options.viewModel.hasHighlights))
                .transition()
                .duration(this.animationDuration)
                .attr(options.layout.shapeLayout);

            shapes.exit()
                .remove();

            return shapes;
        }

        private animateDefaultHighlightShapes(options: DonutChartAnimationOptions): D3.UpdateSelection {
            var highlightShapes = options.graphicsContext.select('.slices')
                .selectAll('path.slice-highlight')
                .data(options.viewModel.dataPoints.filter((value: DonutArcDescriptor) => value.data.highlightRatio != null), (d: DonutArcDescriptor) => d.data.identity.getKey());

            highlightShapes.enter()
                .insert('path')
                .classed('slice-highlight', true)
                .each(function (d) { this._current = d; });

            highlightShapes
                .style('fill', (d: DonutArcDescriptor) => d.data.color ? d.data.color : options.colors.getColor(d.data.identity.getKey()).value)
                .style('fill-opacity', (d: DonutArcDescriptor) => ColumnUtil.getFillOpacity(d.data.selected, true, false, options.viewModel.hasHighlights))
                .transition()
                .duration(this.animationDuration)
                .attr(options.layout.highlightShapeLayout);

            highlightShapes.exit()
                .remove();

            return highlightShapes;
        }
    }
} 