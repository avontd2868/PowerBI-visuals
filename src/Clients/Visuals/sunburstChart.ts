//-----------------------------------------------------------------------
// <copyright company='Microsoft Corporation'>
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {

    export class SunburstChart implements IVisual {

        private static ClassName = 'sunburstChart';
        private svg: D3.Selection;
        private context: D3.Selection;
        private labelContext: D3.Selection;
        private percentageLabel: D3.Selection;
        private breadcrumbLabel: D3.Selection;
        private arc: D3.Svg.Arc;
        private currentViewport: IViewport;
        private style: IVisualStyle;
        private data: D3.Layout.GraphNode;
        private totalSize: number = 0;
        private enableHoverBehaviour: boolean;
        private temp;

        constructor() {
            this.enableHoverBehaviour = true;
        }

        public static capabilities: VisualCapabilities = {
            dataViewMappings: [{
                tree: {
                    depth: { min: 2 }
                }
            }],
        };

        public init(options: VisualInitOptions) {
            var element = options.element;
            if (!this.svg) {
                this.svg = d3.select(element.get(0))
                    .append('svg')
                    .attr('class', SunburstChart.ClassName);

                this.arc = d3.svg.arc()
                    .startAngle(d => d.x)
                    .endAngle(d => d.x + d.dx)
                    .innerRadius(d => Math.sqrt(d.y))
                    .outerRadius(d => Math.sqrt(d.y + d.dy));
            }

            this.currentViewport = options.viewport;
            this.style = options.style;
        }

        public onDataChanged(options: VisualDataChangedOptions): void {
            debug.assertValue(options, 'options');

            var dataViews = options.dataViews;

            // TODO: The d3 code writes to the data.  Need to revisit whether we should clone or otherwise do this efficiently & correctly.
            this.data = <D3.Layout.GraphNode>dataViews[0].tree.root;

            this.updateInternal();
        }

        public onResizing(viewport: IViewport, duration: number): void {
            this.currentViewport = viewport;
            this.updateInternal();
        }

        private updateInternal() {
            var height = this.currentViewport.height,
                width = this.currentViewport.width,
                radius = Math.min(width, height) / 2,
                svg = this.svg;

            svg.attr('width', width).attr('height', height);

            if (this.context)
                this.context.remove();

            var context = this.context = svg.append('g');

            context
                .attr('id', 'container')
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

            var labelContext = this.labelContext = context
                .append('g')
                .style('visibility', 'hidden')
                .attr('transform', 'translate(0,30)');

            this.percentageLabel = labelContext
                .append('text')
                .attr('class', 'percentageLabel')
                .style({ "text-anchor": "middle", 'fill': this.style.titleText.color.value })
                .attr('transform', 'translate(0,-25)');

            this.breadcrumbLabel = labelContext
                .append('text')
                .attr('class', 'breadcrumbLabel')
                .style({ "text-anchor": "middle", 'fill': this.style.subTitleText.color.value });

            var partition = d3.layout.partition()
                .size([2 * Math.PI, radius * radius])
                .value(d => d.value);

            var nodes = partition.nodes(this.data).filter(d => d.dx > 0.0055);
            var colors = this.style.colorPalette.dataColors;

            var path = context.data([this.data]).selectAll('path')
                .data(nodes)
                .enter().append('svg:path')
                .attr('display', d => d.depth ? null : 'none')
                .attr('d', this.arc)
                .attr('fill-rule', 'evenodd')
                .style('fill', (d: D3.Layout.GraphNode) => {
                    var node = d;

                    while (node.parent && node.parent.parent) {
                        node = node.parent;
                    }

                    return colors.getColor(node.name).value;
                })
                .style('opacity', (d: D3.Layout.GraphNode) => {
                    return SunburstChart.getOpacityForNode(d);
                })
                .on('click', d => {
                    console.log('focused ...');
                    this.temp = d;
                    $(this).focus();
                })
                .on('mouseover', d => {
                    if (this.enableHoverBehaviour) {
                        this.onMouseOver(d);
                    }
                });

            // Add the mouseleave handler to the bounding circle.
            context
                .on('mouseleave', d => {
                    if (this.enableHoverBehaviour) {
                        this.onMouseLeave(d);
                    }
                })
                .on('click', (d) => {
                    this.enableHoverBehaviour = !this.enableHoverBehaviour;
                })
                .on('focusout', () => {
                    console.log('focused out ...');
                    if (this.temp) {
                        this.onMouseLeave(this.temp);
                        this.enableHoverBehaviour = true;
                    }
                });

            // Get total size of the tree = value of root node from partition.
            this.totalSize = (<any>path.node()).__data__.value;
        }

        // Fade all but the current sequence, and show it in the breadcrumb trail.
        private onMouseOver(node: D3.Layout.GraphNode) {

            var percentage = Number((100 * node.value / this.totalSize).toPrecision(3));
            var text = percentage + '%';
            if (percentage < 0.1)
                text = '< 0.1%';

            this.percentageLabel.text(text);

            text = null;
            var r = node;
            do {
                if (text)
                    text = r.name + ' - ' + text;
                else
                    text = r.name;

                r = r.parent;
            } while (r && r.parent);

            this.breadcrumbLabel.text(text);
            this.labelContext.style('visibility', '');

            var sequenceArray = SunburstChart.getAncestors(node);

            // Fade all the segments.
            this.context.selectAll('path').style('opacity', 0.25);

            // Then highlight only those that are an ancestor of the current segment.
            this.context.selectAll('path')
                .filter(node => sequenceArray.indexOf(node) >= 0)
                .style('opacity', node => SunburstChart.getOpacityForNode(node));
        }

        // Restore everything to full opacity when moving off the visualization.
        private onMouseLeave(node: D3.Layout.GraphNode) {

            // Transition each segment to full opacity and then reactivate it.
            this.context.selectAll('path')
                .transition()
                .duration(750)
                .style('opacity', node => SunburstChart.getOpacityForNode(node));

            // hide the label
            this.labelContext
                .transition()
                .duration(750)
                .style('visibility', 'hidden');
        }

        private static getOpacityForNode(node: D3.Layout.GraphNode): number {
            return 1 / 1 - (Math.max(node.depth - 1, 0) / 7);
        }

        private static getAncestors(node) {
            var path = [];
            var current = node;
            while (current.parent) {
                path.unshift(current);
                current = current.parent;
            }
            return path;
        }
    }
}