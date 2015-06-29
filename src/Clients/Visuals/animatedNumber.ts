//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    /** Renders a number that can be animate change in value */
    export class AnimatedNumber extends AnimatedText implements IVisual {
        private options: VisualInitOptions;

        // TODO: Remove this once all visuals have implemented update.
        private dataViews: DataView[];

        public static capabilities: VisualCapabilities = {
            objects: AnimatedText.objectDescs,
            dataViewMappings: [{
                single: { role: "Values" }
            }],
        };

        public constructor(svg?: D3.Selection) {
            super('animatedNumber');

            if (svg)
                this.svg = svg;
        }

        public init(options: VisualInitOptions) {
            this.options = options;
            var element = options.element;

            if (!this.svg)
                this.svg = d3.select(element.get(0)).append('svg');

            this.graphicsContext = this.svg.append('g');
            this.currentViewport = options.viewport;
            this.hostServices = options.host;
            this.style = options.style;
            this.updateViewportDependantProperties();
        }

        public updateViewportDependantProperties() {
            var viewport = this.currentViewport;
            this.svg.attr('width', viewport.width)
                .attr('height', viewport.height);
        }

        public update(options: VisualUpdateOptions) {
            debug.assertValue(options, 'options');

            this.currentViewport = options.viewport;
            var dataViews = this.dataViews = options.dataViews;

            if (!dataViews || !dataViews[0]) {
                return;
            }

            var dataView = dataViews[0];
            this.updateViewportDependantProperties();
            this.getMetaDataColumn(dataView);
            var newValue = dataView && dataView.single ? dataView.single.value : 0;
            if (newValue != null) {
                this.updateInternal(newValue, options.duration, true);
            }
        }

        public onDataChanged(options: VisualDataChangedOptions): void {
            // TODO: Remove onDataChanged & onResizing once all visuals have implemented update.
            this.update({
                dataViews: options.dataViews,
                duration: options.duration,
                viewport: this.currentViewport
            });
        }

        public onResizing(viewport: IViewport, duration: number): void {
            // TODO: Remove onDataChanged & onResizing once all visuals have implemented update.
            this.update({
                dataViews: this.dataViews,
                duration: duration,
                viewport: viewport
            });
        }

        public canResizeTo(viewport: IViewport): boolean {
            // Temporarily disabling resize restriction.
            return true;
        }

        private updateInternal(target: number, duration: number = 0, forceUpdate: boolean = false) {

            var start = this.value || 0;

            this.doValueTransition(
                start,
                target,
                /*displayUnitSystemType*/ null,
                this.options.animation,
                duration,
                forceUpdate);

            this.value = target;
        }
    }
}