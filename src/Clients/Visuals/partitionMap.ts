//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {

    /** Renders an interactive partiion map visual from hierarchy data */
    export class PartitionMap implements IVisual {
        private static ClassName = 'partitionMap';
        private static TransitionAnimationDuration = 750;
        private static MinTextHeight = 14;

        private svg: D3.Selection;
        private currentViewport: IViewport;

        private style: IVisualStyle;
        private colors: IDataColorPalette;
        private data: DataViewTree;
        private element: JQuery;

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
                this.svg = d3.select(element.get(0)).append('svg');
                element.addClass(PartitionMap.ClassName);
            }

            this.element = element;

            this.currentViewport = options.viewport;
            this.style = options.style;

            this.colors = this.style.colorPalette.dataColors;
        }

        public onDataChanged(options: VisualDataChangedOptions): void {
            debug.assertValue(options, 'options');

            var dataViews = options.dataViews;

            // TODO: The d3 code writes to the data.  Need to revisit whether we should clone or otherwise do this efficiently & correctly.
            this.data = dataViews[0].tree;

            this.updateInternal(options.duration);
        }

        public onResizing(viewport: IViewport, duration: number): void {
            this.currentViewport = viewport;
            this.updateInternal(duration);
        }

        private updateInternal(animationDuration?: number) {
            var w = this.currentViewport.width,
                h = this.currentViewport.height,
                x = d3.scale.linear().range([0, w]),
                y = d3.scale.linear().range([0, h]);

            var element = this.element;
            element.empty();

            var vis = d3.select(element.get(0))
                .append("svg:svg")
                .attr('class', PartitionMap.ClassName)
                .attr("width", w)
                .attr("height", h);

            var partition = d3.layout.partition()
                .value((d) => { return d.size; });

            var root = this.converter(this.data);

            var g = vis.selectAll("g")
                .data((<any>partition).nodes(root))
                .enter().append("svg:g")
                .attr("transform", (d) => { return "translate(" + x(d.y) + "," + y(d.x) + ")"; })
                .on("click", (d) => {
                    this.click(d, w, h, x, y, g);
                });

            var kx = w / (<any>root).dx,
                ky = h / 1;

            g.append("svg:rect")
                .attr("class", "partition")
                .attr({
                    'width': root.dy * kx,
                    'height': (d) => d.dx * ky,
                    'fill': d=> d.children ? this.colors.getColor('children').value : this.style.subTitleText.color.value
                });

            g.append("svg:text")
                .attr('class', 'label')
                .attr('dy', '.35em')
                .attr("transform", d=> this.transform(d, ky))
                .style("opacity", (d) => { return d.dx * ky > PartitionMap.MinTextHeight ? 1 : 0; })
                .text((d) => { return d.name; });
        }

        private transform(d, ky) {
            return "translate(8," + d.dx * ky / 2 + ")";
        }

        private click(d, w, h, x, y, g) {
            if (!d.children) {
                d = d.parent;
            }

            var kx = (d.y ? w - 40 : w) / (1 - d.y);
            var ky = h / d.dx;
            x.domain([d.y, 1]).range([d.y ? 40 : 0, w]);
            y.domain([d.x, d.x + d.dx]);

            var t = g.transition()
                .duration(PartitionMap.TransitionAnimationDuration)
                .attr("transform", (d) => { return "translate(" + x(d.y) + "," + y(d.x) + ")"; });

            t.select("rect")
                .attr("width", d.dy * kx)
                .attr("height", (d) => { return d.dx * ky; });

            t.select("text")
                .attr("transform", d=> this.transform(d, ky))
                .style("opacity", (d) => d.dx * ky > PartitionMap.MinTextHeight ? 1 : 0);
        }

        private static convertTreeNodeToGraphNode(node: DataViewTreeNode): D3.Layout.GraphNode {
            return {
                name: node.name,
                size: node.value,
                children: node.children ? node.children.map((nodeChild) => {
                    return PartitionMap.convertTreeNodeToGraphNode(nodeChild);
                }) : null
            };
        }

        private converter(data: DataViewTree): D3.Layout.GraphNode {
            return PartitionMap.convertTreeNodeToGraphNode(data.root);
        }
    }
}