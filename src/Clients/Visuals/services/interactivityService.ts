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
    import ArrayExtensions = jsCommon.ArrayExtensions;
    import SemanticFilter = powerbi.data.SemanticFilter;

    /** Factory method to create an IInteractivityService instance. */
    export function createInteractivityService(hostServices: IVisualHostServices): IInteractivityService {
        return new WebInteractivityService(hostServices);
    }

    /** Creates a clear an svg rect to catch clear clicks  */
    export function appendClearCatcher(selection: D3.Selection): D3.Selection {
        return selection.append("rect").classed("clearCatcher", true).attr({ width: "100%", height: "100%" });
    }

    export function dataHasSelection(data: SelectableDataPoint[]): boolean {
        for (var i = 0, ilen = data.length; i < ilen; i++) {
            if (data[i].selected)
                return true;
        }
        return false;
    }

    export interface IInteractiveVisual {
        accept(visitor: InteractivityVisitor, options: any): void;
    }

    /** Responsible for managing interactivity between the hosting visual and its peers */
    export interface IInteractivityService extends InteractivityVisitor {
        /** Clears the selection */
        clearSelection(): void;
        apply(visual: IInteractiveVisual, options: any);

        /** Sets the selected state on the given data points. */
        applySelectionStateToData(dataPoints: SelectableDataPoint[]): boolean;
    }

    export class WebInteractivityService implements IInteractivityService {
        // References
        private hostService: IVisualHostServices;
        private sendSelectionToVisual = () => { };
        private sendSelectionToLegend = () => { };
        private sendSelectionToSecondVisual = () => { };

        // Selection state
        private selectedIds: SelectionId[] = [];
        private behavior: any;
        private secondBehavior: any;

        public selectableDataPoints: SelectableDataPoint[];
        public selectableLegendDataPoints: SelectableDataPoint[];
        public secondSelectableDataPoints: SelectableDataPoint[];

        private hasColumnChart = false;

        constructor(hostServices: IVisualHostServices) {
            debug.assertValue(hostServices, 'hostServices');

            this.hostService = hostServices;
        }

        /** Sets the selected state of all selectable data points to false and invokes the behavior's select command. */
        public clearSelection(): void {
            this.clearSelectionInternal();
            this.sendSelectionToVisual();
            this.sendSelectionToLegend();
            this.sendSelectionToSecondVisual();
        }

        /** Checks whether there is at least one item selected */
        public hasSelection(): boolean {
            return this.selectedIds.length > 0;
        }

        private legendHasSelection(): boolean {
            return dataHasSelection(this.selectableLegendDataPoints);
        }

        /** Marks a data point as selected and syncs selection with the host. */
        public select(d: SelectableDataPoint, multiselect?: boolean) {
            if (multiselect === undefined)
                multiselect = d3.event.ctrlKey;

            // For highlight data points we actually want to select the non-highlight data point
            if (d.identity.highlight) {
                d = _.find(this.selectableDataPoints, (dp: SelectableDataPoint) => !dp.identity.highlight && d.identity.includes(dp.identity, /* ignoreHighlight */ true));
                debug.assertValue(d, 'Expected to find a non-highlight data point');
            }

            var id = d.identity;

            if (!id)
                return;

            var selected = !d.selected || (!multiselect && this.selectedIds.length > 1);

            // If we have a multiselect flag, we attempt a multiselect
            if (multiselect) {
                if (selected) {
                    d.selected = true;
                    this.selectedIds.push(id);
                }
                else {
                    d.selected = false;
                    this.removeId(id);
                }
            }
            // We do a single select if we didn't do a multiselect or if we find out that the multiselect is invalid.
            if (!multiselect || !this.hostService.canSelect({ data: this.selectedIds.map((value: SelectionId) => value.getSelector()) })) {
                this.clearSelectionInternal();
                if (selected) {
                    d.selected = true;
                    this.selectedIds.push(id);
                }
            }

            this.syncSelectionState();
        }

        private removeId(toRemove: SelectionId): void {
            var selectedIds = this.selectedIds;
            for (var i = selectedIds.length - 1; i > -1; i--) {
                var currentId = selectedIds[i];

                if (toRemove.includes(currentId))
                    selectedIds.splice(i, 1);
            }
        }

        public static isSelected(propertyId: DataViewObjectPropertyIdentifier, categories: DataViewCategoricalColumn, idx: number): boolean {
            return categories.objects != null
                && categories.objects[idx]
                && DataViewObjects.getValue<boolean>(categories.objects[idx], propertyId);
        }

        /** Public for UnitTesting */
        public createPropertiesToHost(filterPropertyIdentifier: DataViewObjectPropertyIdentifier): VisualObjectInstance[] {
            var properties: { [name: string]: SemanticFilter } = {};

            if (this.selectedIds.length > 0) {
                // Set the property if there is any selection
                var filter = powerbi.data.Selector.filterFromSelector(this.selectedIds.map((value: SelectionId) => value.getSelector()), false);
                properties[filterPropertyIdentifier.propertyName] = filter;
            }

            return [<VisualObjectInstance> {
                objectName: filterPropertyIdentifier.objectName,
                selector: undefined,
                properties: properties
            }];
        }

        private sendPersistPropertiesToHost(filterPropertyIdentifier: DataViewObjectPropertyIdentifier) {
            this.hostService.persistProperties(this.createPropertiesToHost(filterPropertyIdentifier));
        }

        private sendSelectToHost() {
            var host = this.hostService;
            if (host.onSelect) {
                host.onSelect({ data: this.selectedIds.filter((value: SelectionId) => value.hasIdentity()).map((value: SelectionId) => value.getSelector()) });
            }
        }

        private sendSelectionToHost(filterPropertyIdentifier?: DataViewObjectPropertyIdentifier) {
            // First set the selection, then fire the change.  This way cross-affecting changes can be applied in the correct order.
            if (filterPropertyIdentifier)
                this.sendPersistPropertiesToHost(filterPropertyIdentifier);
            this.sendSelectToHost();
        }

        private clearSelectionInternal() {
            ArrayExtensions.clear(this.selectedIds);

            var selectableDataPoints = this.selectableDataPoints;
            var selectableLegendDataPoints = this.selectableLegendDataPoints;
            var secondSelectableDataPoints = this.secondSelectableDataPoints;

            if (selectableDataPoints) {
                for (var i = selectableDataPoints.length - 1; i > -1; i--) {
                    selectableDataPoints[i].selected = false;
                }
            }

            if (secondSelectableDataPoints) {
                for (var i = secondSelectableDataPoints.length - 1; i > -1; i--) {
                    secondSelectableDataPoints[i].selected = false;
                }
            }

            if (selectableLegendDataPoints) {
                for (var i = selectableLegendDataPoints.length - 1; i > -1; i--) {
                    selectableLegendDataPoints[i].selected = false;
                }
            }
        }

        public applySelectionStateToData(dataPoints: SelectableDataPoint[]): boolean {
            var hasSelection = false;
            for (var i = 0, len = dataPoints.length; i < len; i++) {
                var dataPoint = dataPoints[i];
                dataPoint.selected = this.selectedIds.some((selectedId) => selectedId.includes(dataPoint.identity));
                if (dataPoint.selected)
                    hasSelection = true;
            }
            return hasSelection;
        }

        /**
         * Initialize the selection state based on the selection from the source.
         */
        private initAndSyncSelectionState(filterPropertyId?: DataViewObjectPropertyIdentifier): void {
            var selectableDataPoints = this.selectableDataPoints;
            var selectableLegendDataPoints = this.selectableLegendDataPoints;
            var secondSelectableDataPoints = this.secondSelectableDataPoints;
            var selectedIds = this.selectedIds;

            // If there are selectableDataPoints and the current state of the InteractivityService doesn't have anything selected, look for selectded values in the data
            if (selectableDataPoints && selectedIds.length === 0) {
                if (selectableDataPoints) {
                    for (var i = 0, len = selectableDataPoints.length; i < len; i++) {
                        if (selectableDataPoints[i].selected) {
                            selectedIds.push(selectableDataPoints[i].identity);
                        }
                    }
                }
                if (secondSelectableDataPoints) {
                    for (var i = 0, len = secondSelectableDataPoints.length; i < len; i++) {
                        if (secondSelectableDataPoints[i].selected) {
                            selectedIds.push(secondSelectableDataPoints[i].identity);
                        }
                    }
                }
                if (selectableLegendDataPoints) {
                    for (var i = 0, len = selectableLegendDataPoints.length; i < len; i++) {
                        if (selectableLegendDataPoints[i].selected) {
                            selectedIds.push(selectableLegendDataPoints[i].identity);
                        }
                    }
                }
            }
            this.syncSelectionState(filterPropertyId);
        }

        /**
         * Syncs the selection state for all data points that have the same category. Returns
         * true if the selection state was out of sync and corrections were made; false if
         * the data is already in sync with the service.
         *
         * If the data is not compatible with the current service's current selection state,
         * the state is cleared and the cleared selection is sent to the host.
         * 
         * Ignores series for now, since we don't support series selection at the moment.
         */
        private syncSelectionState(filterPropertyId?: DataViewObjectPropertyIdentifier): void {
            var selectedIds = this.selectedIds;
            var selectableDataPoints = this.selectableDataPoints;
            var selectableLegendDataPoints = this.selectableLegendDataPoints;
            var secondSelectableDataPoints = this.secondSelectableDataPoints;
            var foundMatchingId = false; // Checked only against the visual's data points; it's possible to have stuff selected in the visual that's not in the legend, but not vice-verse

            if (!selectableDataPoints)
                return;

            for (var i = 0, ilen = selectableDataPoints.length; i < ilen; i++) {
                var dataPoint = selectableDataPoints[i];
                if (selectedIds.some((value: SelectionId) => value.includes(dataPoint.identity))) {
                    if (!dataPoint.selected) {
                        dataPoint.selected = true;
                    }
                    foundMatchingId = true;
                }
                else if (dataPoint.selected) {
                    dataPoint.selected = false;
                }
            }

            if (secondSelectableDataPoints) {
                for (var i = 0, ilen = secondSelectableDataPoints.length; i < ilen; i++) {
                    var dataPoint = secondSelectableDataPoints[i];
                    if (selectedIds.some((value: SelectionId) => value.includes(dataPoint.identity))) {
                        if (!dataPoint.selected) {
                            dataPoint.selected = true;
                        }
                        foundMatchingId = true;
                    }
                    else if (dataPoint.selected) {
                        dataPoint.selected = false;
                    }
                }
            }

            if (selectableLegendDataPoints) {
                for (var i = 0, ilen = selectableLegendDataPoints.length; i < ilen; i++) {
                    var legendDataPoint = selectableLegendDataPoints[i];
                    if (selectedIds.some((value: SelectionId) => value.includes(legendDataPoint.identity))) {
                        legendDataPoint.selected = true;
                    }
                    else if (legendDataPoint.selected) {
                        legendDataPoint.selected = false;
                    }
                }
            }

            if (!foundMatchingId && selectedIds.length > 0) {
                this.clearSelectionInternal();
                this.sendSelectionToHost(filterPropertyId);
            }
        }

        public apply(visual: IInteractiveVisual, options: any) {
            visual.accept(this, options);
        }

        public visitColumnChart(options: ColumnBehaviorOptions) {
            var behavior: ColumnChartWebBehavior = this.behavior;
            if (!behavior) {
                behavior = this.behavior = new ColumnChartWebBehavior();
            }

            this.selectableDataPoints = options.datapoints;
            this.initAndSyncSelectionState();
            var bars = options.bars;
            var clearCatcher = options.clearCatcher;
            var hasHighlights = options.hasHighlights;
            var graphicsContext = options.mainGraphicsContext;

            bars.on('click', (d: SelectableDataPoint, i: number) => {
                this.select(d);
                behavior.select(this.hasSelection(), bars, graphicsContext, hasHighlights);
                this.sendSelectionToHost();
                if (this.sendSelectionToLegend)
                    this.sendSelectionToLegend();
                this.sendSelectionToSecondVisual();
            });

            clearCatcher.on('click', () => {
                this.clearSelection();
                this.sendSelectionToHost();
            });

            this.sendSelectionToVisual = () => {
                behavior.select(this.hasSelection(), bars, graphicsContext, hasHighlights);
            };

            this.hasColumnChart = true;
        }

        public visitLineChart(options: LineChartBehaviorOptions) {
            if (this.hasColumnChart) {
                this.visitLineChartCombo(options);
            }
            else {
                this.visitLineChartNoCombo(options);
            }
        }

        private visitLineChartNoCombo(options: LineChartBehaviorOptions) {
            var behavior: LineChartWebBehavior = this.behavior;
            if (!behavior) {
                behavior = this.behavior = new LineChartWebBehavior();
            }

            this.selectableDataPoints = options.dataPoints;
            this.initAndSyncSelectionState();
            var lines = options.lines;
            var interactivityLines = options.interactivityLines;
            var dots = options.dots;
            var clearCatcher = options.clearCatcher;
            var areas = options.areas;

            var clickHandler = (d: SelectableDataPoint, i: number) => {
                this.select(d);
                behavior.select(this.hasSelection(), lines, dots, areas);
                this.sendSelectionToHost();
                this.sendSelectionToLegend();
            };

            interactivityLines.on('click', clickHandler);
            dots.on('click', clickHandler);
            if (areas)
                areas.on('click', clickHandler);

            clearCatcher.on('click', () => {
                this.clearSelection();
                behavior.select(false, lines, dots, areas);
                this.sendSelectionToHost();
            });

            this.sendSelectionToVisual = () => {
                behavior.select(this.hasSelection(), lines, dots, areas);
            };
        }

        private visitLineChartCombo(options: LineChartBehaviorOptions) {
            var behavior: LineChartWebBehavior = this.secondBehavior;
            if (!behavior) {
                behavior = this.secondBehavior = new LineChartWebBehavior();
            }

            this.secondSelectableDataPoints = options.dataPoints;
            this.initAndSyncSelectionState();
            var lines = options.lines;
            var interactivityLines = options.interactivityLines;
            var dots = options.dots;
            var areas = options.areas;

            var clickHandler = (d: SelectableDataPoint, i: number) => {
                this.select(d);
                behavior.select(this.hasSelection(), lines, dots, areas);
                this.sendSelectionToHost();
                if (this.sendSelectionToLegend)
                    this.sendSelectionToLegend();
                if (this.sendSelectionToVisual)
                    this.sendSelectionToVisual();
            };

            interactivityLines.on('click', clickHandler);
            dots.on('click', clickHandler);
            if (areas)
                areas.on('click', clickHandler);

            this.sendSelectionToSecondVisual = () => {
                behavior.select(this.hasSelection(), lines, dots, areas);
            };
        }

        public visitDataDotChart(options: DataDotChartBehaviorOptions): void {
            var behavior: DataDotChartWebBehavior = this.behavior;
            if (!behavior) {
                behavior = this.behavior = new DataDotChartWebBehavior();
            }

            // TODO: share this logic with column chart?
            this.selectableDataPoints = options.datapoints;
            this.initAndSyncSelectionState();
            var dots = options.dots;
            var clearCatcher = options.clearCatcher;

            dots.on('click', (d: SelectableDataPoint, i: number) => {
                this.select(d);
                behavior.select(this.hasSelection(), dots);
                this.sendSelectionToHost();
            });

            clearCatcher.on('click', () => {
                this.clearSelection();
                behavior.select(false, dots);
                this.sendSelectionToHost();
            });

            this.sendSelectionToVisual = () => {
                behavior.select(this.hasSelection(), dots);
            };
        }

        public visitDonutChart(options: DonutBehaviorOptions) {
            var behavior: DonutChartWebBehavior = this.behavior;
            if (!behavior) {
                behavior = this.behavior = new DonutChartWebBehavior(options);
            }

            this.selectableDataPoints = options.datapoints;
            this.initAndSyncSelectionState();
            var slices = options.slices;
            var highlightSlices = options.highlightSlices;
            var clearCatcher = options.clearCatcher;
            var hasHighlights = options.hasHighlights;

            var clickHandler = (d: DonutArcDescriptor) => {
                this.select(d.data);
                behavior.select(this.hasSelection(), slices, false, hasHighlights, d.data);
                behavior.select(this.hasSelection(), highlightSlices, true, hasHighlights, d.data);
                this.sendSelectionToHost();
                this.sendSelectionToLegend();
            };

            slices.on('click', clickHandler);
            highlightSlices.on('click', clickHandler);

            slices.on('mouseover', (d: DonutArcDescriptor) => behavior.mouseOver(d.data));
            highlightSlices.on('mouseover', (d: DonutArcDescriptor) => behavior.mouseOver(d.data));

            slices.on('mouseout', (d: DonutArcDescriptor) => behavior.mouseOut(d.data));
            highlightSlices.on('mouseout', (d: DonutArcDescriptor) => behavior.mouseOut(d.data));

            clearCatcher.on('click', () => {
                this.clearSelection();
                this.sendSelectionToHost();
                this.sendSelectionToLegend();
            });

            this.sendSelectionToVisual = () => {
                behavior.select(this.hasSelection(), slices, false, hasHighlights);
                behavior.select(this.hasSelection(), highlightSlices, true, hasHighlights);
            };
        }

        public visitFunnel(options: FunnelBehaviorOptions) {
            var behavior: FunnelWebBehavior = this.behavior;
            if (!behavior) {
                behavior = this.behavior = new FunnelWebBehavior();
            }

            this.selectableDataPoints = options.datapoints;
            this.initAndSyncSelectionState();
            var bars = options.bars;
            var labels = options.labels;
            var clearCatcher = options.clearCatcher;
            var hasHighlights = options.hasHighlights;

            bars.on('click', (d: SelectableDataPoint, i: number) => {
                this.select(d);
                behavior.select(this.hasSelection(), bars, hasHighlights);
                this.sendSelectionToHost();
            });

            if (labels) {
                labels.on('click', (d: SelectableDataPoint, i: number) => {
                    this.select(d);
                    behavior.select(this.hasSelection(), bars, hasHighlights);
                    this.sendSelectionToHost();
                });
            }

            clearCatcher.on('click', () => {
                this.clearSelection();
                this.sendSelectionToHost();
            });

            this.sendSelectionToVisual = () => {
                behavior.select(this.hasSelection(), bars, hasHighlights);
            };
        }

        public visitScatterChart(options: ScatterBehaviorOptions) {
            var behavior: ScatterChartWebBehavior = this.behavior;
            if (!behavior) {
                behavior = this.behavior = new ScatterChartWebBehavior();
            }

            this.selectableDataPoints = options.data.dataPoints;
            this.initAndSyncSelectionState();
            var selection = options.dataPointsSelection;
            var clearCatcher = options.clearCatcher;

            selection.on('click', (d: SelectableDataPoint, i: number) => {
                this.select(d);
                behavior.select(this.hasSelection(), selection);
                this.sendSelectionToHost();
                this.sendSelectionToLegend();
            });

            clearCatcher.on('click', () => {
                this.clearSelection();
                this.sendSelectionToHost();
            });

            this.sendSelectionToVisual = () => {
                behavior.select(this.hasSelection(), options.dataPointsSelection);
            };
        }

        public visitTreemap(options: TreemapBehaviorOptions) {
            var behavior: TreemapWebBehavior = this.behavior;
            if (!behavior) {
                behavior = this.behavior = new TreemapWebBehavior();
            }

            this.selectableDataPoints = options.nodes;
            this.initAndSyncSelectionState();
            var shapes = options.shapes;
            var highlightShapes = options.highlightShapes;
            var labels = options.labels;
            var hasHighlights = options.hasHighlights;

            var clickHandler = (d: TreemapNode) => {
                this.select(d);
                behavior.select(this.hasSelection(), shapes, false);
                behavior.select(this.hasSelection(), highlightShapes, true);
                this.sendSelectionToHost();
                this.sendSelectionToLegend();
            };

            shapes.on('click', clickHandler);
            highlightShapes.on('click', clickHandler);

            labels.on('click', (d: SelectableDataPoint, i: number) => {
                this.select(d);
                behavior.select(this.hasSelection(), shapes, hasHighlights);
                this.sendSelectionToHost();
                this.sendSelectionToLegend();
            });

            this.sendSelectionToVisual = () => {
                behavior.select(this.hasSelection(), shapes, hasHighlights);
            };
        }

        public visitSlicer(options: SlicerBehaviorOptions) {
            var behavior: SlicerWebBehavior = this.behavior;
            if (!behavior) {
                behavior = this.behavior = new SlicerWebBehavior();
            }

            var filterPropertyId = slicerProps.filterPropertyIdentifier;
            this.selectableDataPoints = options.datapoints;
            this.initAndSyncSelectionState(filterPropertyId);
            var slicers = options.slicerItemContainers;
            var slicerItemLabels = options.slicerItemLabels;
            var slicerItemInputs = options.slicerItemInputs;
            var slicerClear = options.slicerClear;

            slicers.on("mouseover", (d: SlicerDataPoint) => {
                d.mouseOver = true;
                d.mouseOut = false;
                behavior.mouseInteractions(slicerItemLabels);
            });

            slicers.on("mouseout", (d: SlicerDataPoint) => {
                d.mouseOver = false;
                d.mouseOut = true;
                behavior.mouseInteractions(slicerItemLabels);
            });

            slicerItemLabels.on("click", (d: SelectableDataPoint) => {
                this.select(d, this.hasSelection());
                behavior.select(slicerItemLabels);
                this.sendSelectionToHost(filterPropertyId);
            });

            slicerClear.on("click", (d: SelectableDataPoint) => {
                this.clearSelection();
                behavior.clearSlicers(slicerItemLabels, slicerItemInputs);
                this.sendSelectionToHost(filterPropertyId);
            });

            this.sendSelectionToVisual = () => {
                behavior.select(slicerItemLabels);
            };

            // Always update the Slicer as it's fully repainting
            this.sendSelectionToVisual();
        }

        public visitWaterfallChart(options: WaterfallChartBehaviorOptions): void {
            var behavior: WaterfallChartWebBehavior = this.behavior;
            if (!behavior) {
                behavior = this.behavior = new WaterfallChartWebBehavior();
            }

            // TODO: share this logic with column chart?
            this.selectableDataPoints = options.datapoints;
            this.initAndSyncSelectionState();
            var bars = options.bars;
            var clearCatcher = options.clearCatcher;

            bars.on('click', (d: SelectableDataPoint, i: number) => {
                this.select(d);
                behavior.select(this.hasSelection(), bars);
                this.sendSelectionToHost();
            });

            clearCatcher.on('click', () => {
                this.clearSelection();
                this.sendSelectionToHost();
            });

            this.sendSelectionToVisual = () => {
                behavior.select(this.hasSelection(), bars);
            };
        }

        public visitMap(options: MapBehaviorOptions): void {
            var behavior: MapBehavior = this.behavior;
            if (!behavior) {
                behavior = this.behavior = new MapBehavior();
            }

            // TODO: share this logic with column chart?
            this.selectableDataPoints = options.dataPoints;
            this.initAndSyncSelectionState();
            var bubbles = options.bubbles;
            var slices = options.slices;
            var shapes = options.shapes;
            var clearCatcher = options.clearCatcher;

            var clickHandler = (d: SelectableDataPoint, i: number) => {
                this.select(d);
                behavior.select(this.hasSelection(), bubbles, slices, shapes);
                this.sendSelectionToHost();
            };

            if (bubbles) {
                bubbles.on('click', clickHandler);
            }

            if (slices) {
                slices.on('click', (d, i: number) => {
                    this.select(d.data);
                    behavior.select(this.hasSelection(), bubbles, slices, shapes);
                    this.sendSelectionToHost();
                });
            }

            if (shapes) {
                shapes.on('click', clickHandler);
            }

            clearCatcher.on('click', () => {
                this.clearSelection();
                this.sendSelectionToHost();
            });

            this.sendSelectionToVisual = () => {
                behavior.select(this.hasSelection(), bubbles, slices, shapes);
            };
        }

        public visitLegend(options: LegendBehaviorOptions): void {
            var behavior: LegendWebBehavior = new LegendWebBehavior();

            this.selectableLegendDataPoints = options.datapoints;
            this.initAndSyncSelectionState();
            var legendItems = options.legendItems;
            var legendIcons = options.legendIcons;
            var clearCatcher = options.clearCatcher;

            legendItems.on('click', (d: LegendDataPoint) => {
                this.select(d);
                behavior.select(this.legendHasSelection(), legendIcons);
                this.sendSelectionToVisual();
                this.sendSelectionToSecondVisual();
                this.sendSelectionToHost();
            });

            clearCatcher.on('click', () => {
                clearLegendSelection(true);
                this.sendSelectionToVisual();
                this.sendSelectionToSecondVisual();
            });

            this.sendSelectionToLegend = () => {
                behavior.select(this.legendHasSelection(), legendIcons);
            };

            this.sendSelectionToLegend();

            var clearLegendSelection = (sendToHost: boolean) => {
                this.clearSelection();
                behavior.select(this.legendHasSelection(), legendIcons);
                if (sendToHost)
                    this.sendSelectionToHost();
            };
        }
    };

    /** A service for the mobile client to enable & route interactions */
    export class MobileInteractivityService implements IInteractivityService {
        private behavior;

        public apply(visual: IInteractiveVisual, options: any) {
            visual.accept(this, options);
        }

        private makeDataPointsSelectable(...selection: D3.Selection[]): MobileInteractivityService {
            for (var i = 0, len = selection.length; i < len; i++) {
                var sel = selection[i];

                sel.on('click', (d: SelectableDataPoint, i: number) => {
                    this.behavior.select(true, sel, d, i);
                });
            }

            return this;
        }

        private makeRootSelectable(selection: D3.Selection): MobileInteractivityService {
            selection.on('click', (d: SelectableDataPoint, i: number) => {
                this.behavior.selectRoot();
            });

            return this;
        }

        private makeDragable(...selection: D3.Selection[]): MobileInteractivityService {
            for (var i = 0, len = selection.length; i < len; i++) {
                var sel = selection[i];

                var drag = d3.behavior.drag()
                    .on('drag', (d) => { this.behavior.drag(DragType.Drag); })
                    .on('dragend', (d) => { this.behavior.drag(DragType.DragEnd); });

                sel.call(drag);
            }

            return this;
        }

        public clearSelection(): void { }

        public applySelectionStateToData(dataPoints: SelectableDataPoint[]): boolean { return false; }

        public visitColumnChart(options: ColumnBehaviorOptions) {
            // No mobile interactions declared.
        }

        public visitLineChart(options: LineChartBehaviorOptions) {
            // Todo
        }

        public visitDataDotChart(options: DataDotChartBehaviorOptions): void {
            // No mobile interactions declared.
        }

        public visitDonutChart(options: DonutBehaviorOptions) {
            // No mobile interactions declared.
        }

        public visitFunnel(options: FunnelBehaviorOptions) {
            // No mobile interactions declared.
        }

        public visitScatterChart(options: ScatterBehaviorOptions) {
            var behavior: ScatterChartMobileBehavior = this.behavior;

            if (options.data.dataPoints.length > 0) {
                if (!behavior) {
                    behavior = this.behavior = new ScatterChartMobileBehavior();
                }

                behavior.setOptions(options);

                this
                    .makeDataPointsSelectable(options.dataPointsSelection)
                    .makeRootSelectable(options.root)
                    .makeDragable(options.root)
                    .makeDragable(options.background);

                behavior.selectRoot();
            }
        }

        public visitTreemap(options: TreemapBehaviorOptions) {
            // No mobile interactions declared.
        }

        public visitSlicer(options: SlicerBehaviorOptions) {
            // No mobile interactions declared.
        }

        public visitWaterfallChart(options: WaterfallChartBehaviorOptions): void {
            // No mobile interactions declared.
        }

        public visitMap(options: MapBehaviorOptions): void {
            // No mobile interactions declared.
        }

        public visitLegend(options: LegendBehaviorOptions): void {
            // No mobile interactions declared.
        }
    }
}