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
    export interface TreemapAnimationOptions {
        viewModel: TreemapData;
        nodes: D3.Layout.GraphNode[];
        highlightNodes: D3.Layout.GraphNode[];
        labeledNodes: D3.Layout.GraphNode[];
        shapeGraphicsContext: D3.Selection;
        labelGraphicsContext: D3.Selection;
        interactivityService: IInteractivityService;
    }

    export interface TreemapAnimationResult {
        failed: boolean;
        shapes: D3.UpdateSelection;
        highlightShapes: D3.UpdateSelection;
        labels: D3.UpdateSelection;
    }

    export interface ITreemapAnimator {
        animate(options: TreemapAnimationOptions): TreemapAnimationResult;
    }

    export class WebTreemapAnimator implements ITreemapAnimator {
        previousViewModel: TreemapData;
        animationDuration: number = AnimatorCommon.MinervaAnimationDuration;

        public animate(options: TreemapAnimationOptions): TreemapAnimationResult {
            var result: TreemapAnimationResult = {
                failed: true,
                shapes: null,
                highlightShapes: null,
                labels: null,
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

        private animateNormalToHighlighted(options: TreemapAnimationOptions): TreemapAnimationResult {
            var hasSelection = false;
            var hasHighlights = true;

            var shapes = this.animateDefaultShapes(options.shapeGraphicsContext, options.nodes, hasSelection, hasHighlights);

            var highlightShapes = options.shapeGraphicsContext.selectAll('.' + Treemap.HighlightNodeClassName)
                .data(options.highlightNodes, (d: TreemapNode) => d.key + "highlight");

            highlightShapes.enter().append('rect')
                .attr('class', Treemap.layout.highlightShapeClass)
                .attr(Treemap.layout.shapeLayout); // Start using the normal shape layout

            highlightShapes
                .style("fill", (d: TreemapNode) => Treemap.getFill(d, true))
                .style("fill-opacity", (d: TreemapNode) => Treemap.getFillOpacity(d, hasSelection, hasHighlights, true))
                .transition()
                .duration(this.animationDuration)
                .attr(Treemap.layout.highlightShapeLayout); // Animate to the highlighted positions

            highlightShapes.exit().remove();
            var labeledNodes = options.viewModel.dataLabelsSettings.show? options.labeledNodes : [];
            var labels = this.animateDefaultLabels(options.labelGraphicsContext, labeledNodes);

            return {
                failed: false,
                labels: labels,
                shapes: shapes,
                highlightShapes: highlightShapes,
            };
        }

        private animateHighlightedToHighlighted(options: TreemapAnimationOptions): TreemapAnimationResult {
            var hasSelection = false;
            var hasHighlights = true;

            var shapes = this.animateDefaultShapes(options.shapeGraphicsContext, options.nodes, hasSelection, hasHighlights);

            options.shapeGraphicsContext.selectAll('.' + Treemap.HighlightNodeClassName)
                .data(options.highlightNodes, (d: TreemapNode) => d.key + "highlight");

            var highlightShapes = this.animateDefaultHighlightShapes(options.shapeGraphicsContext, options.highlightNodes, hasSelection, hasHighlights);

            var labeledNodes = options.viewModel.dataLabelsSettings.show ? options.labeledNodes : [];
            var labels = this.animateDefaultLabels(options.labelGraphicsContext, labeledNodes);

            return {
                failed: false,
                labels: labels,
                shapes: shapes,
                highlightShapes: highlightShapes,
            };
        }

        private animateHighlightedToNormal(options: TreemapAnimationOptions): TreemapAnimationResult {
            var hasSelection = options.interactivityService ? (<WebInteractivityService>options.interactivityService).hasSelection() : false;

            var shapes = options.shapeGraphicsContext.selectAll('.' + Treemap.TreemapNodeClassName)
                .data(options.nodes, (d: TreemapNode) => d.key);

            shapes.enter().append('rect')
                .attr('class', Treemap.layout.shapeClass);

            shapes
                .transition()
                .duration(this.animationDuration)
                .style("fill", (d: TreemapNode) => Treemap.getFill(d, false))
                .style("fill-opacity", (d: TreemapNode) => ColumnUtil.getFillOpacity(d.selected, false, d.selected, !d.selected))
                .attr(Treemap.layout.shapeLayout);

            shapes.exit().remove();

            var highlightShapes = options.shapeGraphicsContext.selectAll('.' + Treemap.HighlightNodeClassName)
                .data(options.nodes, (d: TreemapNode) => d.key + "highlight");

            highlightShapes.enter().append('rect')
                .attr('class', Treemap.layout.highlightShapeClass);

            highlightShapes
                .style("fill", (d: TreemapNode) => Treemap.getFill(d, true))
                .style("fill-opacity", (d: TreemapNode) => ColumnUtil.getFillOpacity(d.selected, true, d.selected, !d.selected))
                .transition()
                .duration(this.animationDuration)
                .attr(hasSelection ? Treemap.layout.zeroShapeLayout : Treemap.layout.shapeLayout) // Animate to the normal shape layout or zero shape layout depending on whether we have a selection or not
                .each("end", (d: TreemapNode, i: number) => {
                    if (i === 0) {
                        shapes.style("fill-opacity", (d: TreemapNode) => ColumnUtil.getFillOpacity(d.selected, false, hasSelection, false));
                        highlightShapes.remove(); // Then remove highlight shapes and set normal shapes to non-highlighted opacities.
                    }
                });

            highlightShapes.exit().remove();

            var labeledNodes = options.viewModel.dataLabelsSettings.show ? options.labeledNodes : [];
            var labels = this.animateDefaultLabels(options.labelGraphicsContext, labeledNodes);

            return {
                failed: false,
                labels: labels,
                shapes: shapes,
                highlightShapes: highlightShapes,
            };
        }

        private animateDefaultShapes(context: D3.Selection, nodes: D3.Layout.GraphNode[], hasSelection: boolean, hasHighlights: boolean): D3.UpdateSelection {
            var isHighlightShape = false;
            var shapes = context.selectAll('.' + Treemap.TreemapNodeClassName)
                .data(nodes, (d: TreemapNode) => d.key);

            shapes.enter().append('rect')
                .attr('class', Treemap.layout.shapeClass);

            shapes
                .transition()
                .duration(this.animationDuration)
                .style("fill", (d: TreemapNode) => Treemap.getFill(d, isHighlightShape))
                .style("fill-opacity", (d: TreemapNode) => Treemap.getFillOpacity(d, hasSelection, hasHighlights, isHighlightShape))
                .attr(Treemap.layout.shapeLayout);

            shapes.exit().remove();

            return shapes;
        }

        private animateDefaultHighlightShapes(context: D3.Selection, nodes: D3.Layout.GraphNode[], hasSelection: boolean, hasHighlights: boolean): D3.UpdateSelection {
            var isHighlightShape = true;
            var highlightShapes = context.selectAll('.' + Treemap.HighlightNodeClassName)
                .data(nodes, (d) => d.key + "highlight");

            highlightShapes.enter().append('rect')
                .attr('class', Treemap.layout.highlightShapeClass);

            highlightShapes
                .transition()
                .duration(this.animationDuration)
                .style("fill", (d: TreemapNode) => Treemap.getFill(d, isHighlightShape))
                .style("fill-opacity", (d: TreemapNode) => Treemap.getFillOpacity(d, hasSelection, hasHighlights, isHighlightShape))
                .attr(Treemap.layout.highlightShapeLayout);

            highlightShapes.exit().remove();
            return highlightShapes;
        }

        private animateDefaultLabels(context: D3.Selection, nodes: D3.Layout.GraphNode[]): D3.UpdateSelection {
            var labels = context
                .selectAll('text')
                .data(nodes, (d: TreemapNode) => d.key);

            labels.enter().append('text')
                .attr('class', Treemap.layout.labelClass);

            labels
                .transition()
                .duration(this.animationDuration)
                .attr(Treemap.layout.labelLayout)
                .text(Treemap.layout.labelText);

            labels.exit().remove();
            return labels;
        }
    }
}