 //-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    export interface FunnelAnimationOptions {
        viewModel: FunnelData;
        interactivityService: IInteractivityService;
        layout: IFunnelLayout;
        axisGraphicsContext: D3.Selection;
        shapeGraphicsContext: D3.Selection;
        labelGraphicsContext: D3.Selection;
        axisOptions: FunnelAxisOptions;
        slicesWithoutHighlights: FunnelSlice[];
        labelLayout: ILabelLayout; 
    }

    export interface FunnelAnimationResult {
        failed: boolean;
        shapes: D3.UpdateSelection;
        dataLabels: D3.UpdateSelection;
    }

    export interface IFunnelAnimator {
        animate(options: FunnelAnimationOptions): FunnelAnimationResult;
    }

    export class WebFunnelAnimator implements IFunnelAnimator {
        private previousViewModel: FunnelData;
        private animationDuration: number = AnimatorCommon.MinervaAnimationDuration;

        public animate(options: FunnelAnimationOptions): FunnelAnimationResult {
            var result: FunnelAnimationResult = {
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

        private animateNormalToHighlighted(options: FunnelAnimationOptions): FunnelAnimationResult {
            var data = options.viewModel;
            var layout = options.layout;
            var hasHighlights = true;
            var hasSelection = false;

            this.animateDefaultAxis(options.axisGraphicsContext, options.axisOptions);

            var shapes = options.shapeGraphicsContext.selectAll('rect').data(data.slices, (d: FunnelSlice) => d.key);

            shapes.enter()
                .append('rect')
                .attr("class", (d: FunnelSlice) => d.highlight ? "funnelBar highlight" : "funnelBar")
                .attr(layout.shapeLayoutWithoutHighlights); // Start by laying out all rectangles ignoring highlights

            shapes
                .style("fill", (d: FunnelSlice) => d.color)
                .style("fill-opacity", (d: FunnelSlice) => ColumnUtil.getFillOpacity(d.selected, d.highlight, hasSelection, hasHighlights))
                .transition()
                .duration(this.animationDuration)
                .attr(layout.shapeLayout); // Then transition to the layout that uses highlights

            shapes.exit().remove();

            var dataLabels: D3.UpdateSelection = this.animateDefaultDataLabels(options);

            return {
                failed: false,
                shapes: shapes,
                dataLabels: dataLabels,
            };
        }

        private animateHighlightedToHighlighted(options: FunnelAnimationOptions): FunnelAnimationResult {
            var data = options.viewModel;
            var layout = options.layout;

            this.animateDefaultAxis(options.axisGraphicsContext, options.axisOptions);

            // Simply animate to the new shapes.
            var shapes = this.animateDefaultShapes(data, data.slices, options.shapeGraphicsContext, layout);
            var dataLabels: D3.UpdateSelection = this.animateDefaultDataLabels(options);

            return {
                failed: false,
                shapes: shapes,
                dataLabels: dataLabels,
            };
        }

        private animateHighlightedToNormal(options: FunnelAnimationOptions): FunnelAnimationResult {
            var data = options.viewModel;
            var layout = options.layout;
            var hasHighlights = true;
            var hasSelection = options.interactivityService ? (<WebInteractivityService>options.interactivityService).hasSelection() : false;

            this.animateDefaultAxis(options.axisGraphicsContext, options.axisOptions);

            var shapes = options.shapeGraphicsContext.selectAll('rect').data(data.slices, (d: FunnelSlice) => d.key);
            var endStyleApplied = false;

            shapes.enter()
                .append('rect')
                .attr("class", (d: FunnelSlice) => d.highlight ? "funnelBar highlight" : "funnelBar");

            shapes
                .style("fill",(d: FunnelSlice) => d.color)
                .style("fill-opacity", (d: FunnelSlice) => ColumnUtil.getFillOpacity(d.selected, d.highlight, false, hasHighlights))
                .transition()
                .duration(this.animationDuration)
                .attr(layout.shapeLayoutWithoutHighlights); // Transition to layout without highlights

            var exitShapes = shapes.exit();

            exitShapes
                .transition()
                .duration(this.animationDuration)
                .attr(hasSelection ? layout.zeroShapeLayout : layout.shapeLayoutWithoutHighlights) // Transition to layout without highlights
                .each("end", (d: TreemapNode, i: number) => {
                    if (!endStyleApplied) {
                        shapes.style("fill-opacity", (d: FunnelSlice) => ColumnUtil.getFillOpacity(d.selected, d.highlight, hasSelection, false));
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

        private animateDefaultAxis(graphicsContext: D3.Selection, axisOptions: FunnelAxisOptions): void {
            var xScaleForAxis = d3.scale.ordinal()
                .domain(axisOptions.categoryLabels)
                .rangeBands([axisOptions.rangeStart, axisOptions.rangeEnd], axisOptions.barToSpaceRatio);
            var xAxis = d3.svg.axis()
                .scale(xScaleForAxis)
                .orient("right");
            graphicsContext.classed('axis', true)
                .transition()
                .duration(this.animationDuration)
                .attr('transform', SVGUtil.translate(0, axisOptions.margin.top))
                .call(xAxis);
        }

        private animateDefaultShapes(data: FunnelData, slices: FunnelSlice[], graphicsContext: D3.Selection, layout: IFunnelLayout): D3.UpdateSelection {
            var hasHighlights = data.hasHighlights;
            var shapes = graphicsContext.selectAll('rect').data(slices, (d: FunnelSlice) => d.key);

            shapes.enter()
                .append('rect')
                .attr("class", (d: FunnelSlice) => d.highlight ? "funnelBar highlight" : "funnelBar");

            shapes
                .style("fill", (d: FunnelSlice) => d.color)
                .style("fill-opacity", d => (d: FunnelSlice) => ColumnUtil.getFillOpacity(d.selected, d.highlight, false, hasHighlights))
                .transition()
                .duration(this.animationDuration)
                .attr(layout.shapeLayout);

            shapes.exit().remove();

            return shapes;
        }

        private animateDefaultDataLabels(options: FunnelAnimationOptions): D3.UpdateSelection {
            var dataLabels: D3.UpdateSelection;

            if (options.viewModel.dataLabelsSettings.show) {
                dataLabels = dataLabelUtils.drawDefaultLabelsForFunnelChart(options.slicesWithoutHighlights, options.labelGraphicsContext, options.labelLayout, true, this.animationDuration);
            }
            else {
                dataLabelUtils.cleanDataLabels(options.labelGraphicsContext);
            }

            return dataLabels;
        }
    }
}