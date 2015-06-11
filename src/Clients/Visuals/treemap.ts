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
    import CssConstants = jsCommon.CssConstants;
    import StringExtensions = jsCommon.StringExtensions;

    export interface TreemapConstructorOptions {
        animator: ITreemapAnimator;
        isScrollable: boolean;
    }

    export interface TreemapData {
        root: TreemapNode;
        hasHighlights: boolean;
        legendData: LegendData;
        dataLabelsSettings: VisualDataLabelsSettings;
        legendObjectProperties?: DataViewObject;
    }

    // Treemap node (we extend D3 node (GraphNode) because treemap layout methods rely on the type).
    export interface TreemapNode extends D3.Layout.GraphNode, SelectableDataPoint, TooltipEnabledDataPoint, LabelEnabledDataPoint {
        key: any;
        highlightMultiplier?: number;
        color: string;
        highlightedTooltipInfo?: TooltipDataItem[];
    }

    interface TreemapRawData {
        values: number[][];
        highlights?: number[][];
        highlightsOverflow?: boolean;
    }

    export interface ITreemapLayout {
        shapeClass: (d: TreemapNode) => string;
        shapeLayout: {
            x: (d: TreemapNode) => number;
            y: (d: TreemapNode) => number;
            width: (d: TreemapNode) => number;
            height: (d: TreemapNode) => number;
        };
        highlightShapeClass: (d: TreemapNode) => string;
        highlightShapeLayout: {
            x: (d: TreemapNode) => number;
            y: (d: TreemapNode) => number;
            width: (d: TreemapNode) => number;
            height: (d: TreemapNode) => number;
        };
        zeroShapeLayout: {
            x: (d: TreemapNode) => number;
            y: (d: TreemapNode) => number;
            width: (d: TreemapNode) => number;
            height: (d: TreemapNode) => number;
        };
        labelClass: (d: TreemapNode) => string;
        labelLayout: {
            x: (d: TreemapNode) => number;
            y: (d: TreemapNode) => number;
        };
        labelText: (d: TreemapNode) => string;
    }

    // Todo: move to shared location
    interface DataPointObject extends DataViewObject {
        fill: Fill;
    }

    /** Renders an interactive treemap visual from categorical data */
    export class Treemap implements IVisual, IInteractiveVisual {
        public static DimmedShapeOpacity = 0.4;

        private static ClassName = 'treemap';
        public static LabelsClassName = "labels";
        public static MajorLabelClassName = 'majorLabel';
        public static MinorLabelClassName = 'minorLabel';
        public static ShapesClassName = "shapes";
        public static TreemapNodeClassName = "treemapNode";
        public static RootNodeClassName = 'rootNode';
        public static ParentGroupClassName = 'parentGroup';
        public static NodeGroupClassName = 'nodeGroup';
        public static HighlightNodeClassName = 'treemapNodeHighlight';
        private static TextMargin = 5;
        private static MinorLabelTextSize = 10;
        private static MinTextWidthForMinorLabel = 18;
        private static MinorLabelTextProperties: TextProperties = {
            fontFamily: 'wf_segoe-ui_normal',
            fontSize: Treemap.MinorLabelTextSize + 'px'
        };
        private static MajorLabelTextSize = 12;
        private static MinTextWidthForMajorLabel = 22;
        private static MajorLabelTextProperties: TextProperties = {
            fontFamily: 'wf_segoe-ui_normal',
            fontSize: Treemap.MajorLabelTextSize + 'px'
        };

        private svg: D3.Selection;
        private treemap: D3.Layout.TreeMapLayout;
        private shapeGraphicsContext: D3.Selection;
        private labelGraphicsContext: D3.Selection;
        // TODO: Remove this once all visuals have implemented update.
        private currentViewport: IViewport;
        private legend: ILegend;

        private data: TreemapData;
        private style: IVisualStyle;
        private colors: IDataColorPalette;
        private element: JQuery;
        private options: VisualInitOptions;
        private isScrollable: boolean;
        private hostService: IVisualHostServices;

        /* Public for testing */
        public animator: ITreemapAnimator;
        private interactivityService: IInteractivityService;

        // TODO: Remove this once all visuals have implemented update.
        private dataViews: DataView[];

        public static layout: ITreemapLayout = {
            shapeClass: (d) => Treemap.getNodeClass(d, false),
            shapeLayout: Treemap.createTreemapShapeLayout(false),
            highlightShapeClass: (d) => Treemap.getNodeClass(d, true),
            highlightShapeLayout: Treemap.createTreemapShapeLayout(true),
            zeroShapeLayout: Treemap.createTreemapZeroShapeLayout(),
            labelClass: (d) => Treemap.isMajorLabel(d) ? Treemap.MajorLabelClassName : Treemap.MinorLabelClassName,
            labelLayout: {
                x: (d) => d.x + Treemap.TextMargin,
                y: (d) => {
                    if (Treemap.isMajorLabel(d))
                        return d.y + Treemap.TextMargin + Treemap.MajorLabelTextSize;

                    return d.y + d.dy - Treemap.TextMargin;
                },
            },
            labelText: (d) => Treemap.createLabelForShape(d),
        }

        constructor(options?: TreemapConstructorOptions) {
            if (options && options.animator) {
                this.animator = options.animator;
                this.isScrollable = options.isScrollable ? options.isScrollable : false;
            }
        }

        public init(options: VisualInitOptions): void {
            this.options = options;
            var element = options.element;

            // Ensure viewport is empty on init
            element.empty();

            this.svg = d3.select(element.get(0))
                .append('svg')
                .style('position','absolute')
                .classed(Treemap.ClassName, true);
            this.shapeGraphicsContext = this.svg
                .append('g')
                .classed(Treemap.ShapesClassName, true);
            this.labelGraphicsContext = this.svg
                .append('g')
                .classed(Treemap.LabelsClassName, true);

            this.element = element;

            // avoid deep copy
            this.currentViewport = {
                height: options.viewport.height,
                width: options.viewport.width,
            };

            this.style = options.style;

            this.treemap = d3.layout.treemap()
                .sticky(false)
                .sort((a, b) => a.size - b.size)
                .value((d) => d.size)
                .round(false);

            this.interactivityService = VisualInteractivityFactory.buildInteractivityService(options);
            this.legend = createLegend(element, options.interactivity && options.interactivity.isInteractiveLegend, this.interactivityService, this.isScrollable);
            this.colors = this.style.colorPalette.dataColors;

            this.hostService = options.host;
        }

        /** Public for testing purposes */
        public static converter(dataView: DataView, colors: IDataColorPalette, labelSettings: VisualDataLabelsSettings, interactivityService: IInteractivityService, legendObjectProperties?: DataViewObject): TreemapData {
            var rootNode: TreemapNode = {
                key: "root",
                name: "root",
                children: [],
                selected: false,
                highlightMultiplier: 0,
                identity: SelectionId.createNull(),
                color: undefined,
            };
            var allNodes: TreemapNode[] = [];
            var hasHighlights: boolean;
            var legendDataPoints: LegendDataPoint[] = [];
            var legendTitle = "";
            var legendData: LegendData = { title: legendTitle, dataPoints: legendDataPoints };
            var colorHelper = new ColorHelper(colors, treemapProps.dataPoint.fill);

            if (dataView && dataView.metadata && dataView.metadata.objects) {
                var labelsObj = <DataLabelObject>dataView.metadata.objects['labels'];

                if (labelsObj) {
                    labelSettings.show = (labelsObj.show !== undefined) ? labelsObj.show : labelSettings.show;
                    labelSettings.labelColor = (labelsObj.color !== undefined) ? labelsObj.color.solid.color : labelSettings.labelColor;
                }
            }

            if (dataView && dataView.categorical && dataView.categorical.values) {
                var data = dataView.categorical;
                var valueColumns = data.values;
                hasHighlights = !!(valueColumns.length > 0 && valueColumns[0].highlights);

                var formatStringProp = treemapProps.general.formatString;
                var result = Treemap.getValuesFromCategoricalDataView(data, hasHighlights);
                var values = result.values;
                var highlights = result.highlights;
                if (result.highlightsOverflow) {
                    hasHighlights = false;
                    values = highlights;
                }

                var grouped = valueColumns.grouped();
                var isMultiSeries = grouped && grouped.length > 0 && grouped[0].values && grouped[0].values.length > 1;
                var hasDynamicSeries = !!valueColumns.source;

                if ((data.categories == null) && values) {
                    // No categories, sliced by series and measures
                    for (var i = 0, ilen = values[0].length; i < ilen; i++) {
                        var value = values[0][i];
                        if (!Treemap.checkValueForShape(value))
                            continue;
                        var valueColumn = valueColumns[i];
                        var nodeName = converterHelper.getFormattedLegendLabel(valueColumn.source, valueColumns, formatStringProp);

                        var identity = hasDynamicSeries
                            ? SelectionId.createWithId(valueColumns[i].identity)
                            : SelectionId.createWithMeasure(valueColumns[i].source.queryName);

                        var key = identity.getKey();

                        var color = hasDynamicSeries
                            ? colorHelper.getColorForSeriesValue(valueColumn.objects && valueColumn.objects[0], data.values.identityFields, converterHelper.getSeriesName(valueColumn.source))
                            : colorHelper.getColorForMeasure(valueColumn.source.objects, valueColumn.source.queryName);

                        var highlightedValue = hasHighlights && highlight !== 0 ? highlight : undefined;
                        var categorical = dataView.categorical;
                        var valueIndex: number = i;
                        var tooltipInfo: TooltipDataItem[] = TooltipBuilder.createTooltipInfo(formatStringProp, categorical.categories, nodeName, categorical.values, value, null, valueIndex);
                        var highlightedTooltipInfo: TooltipDataItem[];

                        if (highlightedValue !== undefined) {
                            highlightedTooltipInfo = TooltipBuilder.createTooltipInfo(formatStringProp, categorical.categories, nodeName, categorical.values, value, null, valueIndex, highlightedValue);
                        }

                        var node: TreemapNode = {
                            key: key,
                            name: nodeName,
                            size: value,
                            color: color,
                            selected: false,
                            identity: identity,
                            tooltipInfo: tooltipInfo,
                            highlightedTooltipInfo: highlightedTooltipInfo,
                        };
                        if (hasHighlights && highlights) {
                            node.highlightMultiplier = value ? highlights[0][i] / value : 0;
                        }
                        rootNode.children.push(node);
                        allNodes.push(node);
                        legendDataPoints.push({
                            label: nodeName,
                            color: color,
                            icon: LegendIcon.Box,
                            identity: identity,
                            selected: false
                        });
                    }
                }
                else if (data.categories && data.categories.length > 0) {
                    // Create the first level from categories
                    var categoryColumn = data.categories[0];
                    var valueColumnCount = valueColumns.length;

                    legendTitle = categoryColumn.source ? categoryColumn.source.displayName : "";

                    for (var i = 0, ilen = values.length; i < ilen; i++) {
                        var categoryIdentity = categoryColumn.identity ? categoryColumn.identity[i] : undefined;
                        var identity = categoryIdentity ? SelectionId.createWithId(categoryIdentity) : SelectionId.createNull();
                        var key = identity.getKey();

                        var objects = categoryColumn.objects && categoryColumn.objects[i];

                        var color = colorHelper.getColorForSeriesValue(objects, categoryColumn.identityFields, categoryColumn.values[i]);

                        var categoryValue = valueFormatter.format(categoryColumn.values[i], valueFormatter.getFormatString(categoryColumn.values[i], formatStringProp));
                        var value = values[i][0];
                        var highlightedValue = hasHighlights && highlights ? highlights[i][0] : undefined;
                        var categorical = dataView.categorical;
                        var tooltipInfo: TooltipDataItem[] = TooltipBuilder.createTooltipInfo(formatStringProp, categorical.categories, categoryValue, categorical.values, value);
                        var highlightedTooltipInfo: TooltipDataItem[];

                        if (highlightedValue !== undefined) {
                            highlightedTooltipInfo = TooltipBuilder.createTooltipInfo(formatStringProp, categorical.categories, categoryValue, categorical.values, value, null, 0, highlightedValue);
                        }

                        var node: TreemapNode = {
                            key: key,
                            name: categoryValue,
                            color: color,
                            selected: false,
                            identity: identity,
                            tooltipInfo: tooltipInfo,
                            highlightedTooltipInfo: highlightedTooltipInfo,
                        };

                        legendDataPoints.push({
                            label: categoryValue,
                            color: color,
                            icon: LegendIcon.Box,
                            identity: identity,
                            selected: false
                        });

                        var total = 0;
                        var highlightTotal = 0; // Used if omitting second level

                        // Do not add second level if it's one and only one data point per shape and it's not a group value
                        // e.g. Category/Series group plus only one Value field
                        var omitSecondLevel = valueColumnCount === 1 && (valueColumns[0].source.groupName == null);
                        var currentValues = values[i];

                        for (var j = 0, jlen = currentValues.length; j < jlen; j++) {
                            var valueColumn = valueColumns[j];
                            var value = currentValues[j];
                            var highlight: number;

                            if (!Treemap.checkValueForShape(value))
                                continue;

                            total += value;

                            if (hasHighlights) {
                                highlight = highlights[i][j];
                                highlightTotal += highlight;
                            }

                            if (!omitSecondLevel) {
                                var childName: string = null;

                                // Create key to ensure shape uniqueness
                                var childKey = {
                                    parentId: node.key,
                                    nodeId: undefined
                                };
                                if (isMultiSeries) {
                                    // Measure: use name and index
                                    childKey.nodeId = { name: childName, index: j };
                                    childName = valueColumn.source.displayName;
                                }
                                else {
                                    // Series group instance
                                    childKey.nodeId = valueColumn.identity.key;
                                    childName = valueColumn.source.groupName;
                                }

                                var childIdentity: SelectionId = SelectionId.createWithIdsAndMeasure(
                                    categoryIdentity,
                                    hasDynamicSeries ? valueColumn.identity : undefined,
                                    isMultiSeries ? valueColumn.source.queryName : undefined);

                                var highlightedValue = hasHighlights && highlight !== 0 ? highlight : undefined;
                                var categorical = dataView.categorical;
                                var tooltipInfo: TooltipDataItem[] = TooltipBuilder.createTooltipInfo(formatStringProp, categorical.categories, categoryValue, categorical.values, value, null, j);
                                var highlightedTooltipInfo: TooltipDataItem[];

                                if (highlightedValue !== undefined) {
                                    highlightedTooltipInfo = TooltipBuilder.createTooltipInfo(formatStringProp, categorical.categories, categoryValue, categorical.values, value, null, j, highlightedValue);
                                }

                                var childNode: TreemapNode = {
                                    key: childIdentity.getKey(),
                                    name: childName,
                                    size: value,
                                    color: color,
                                    selected: false,
                                    identity: childIdentity,
                                    tooltipInfo: tooltipInfo,
                                    highlightedTooltipInfo: highlightedTooltipInfo,
                                };
                                if (hasHighlights)
                                    childNode.highlightMultiplier = value ? highlight / value : 0;
                                if (node.children == null)
                                    node.children = [];

                                node.children.push(childNode);
                                allNodes.push(childNode);
                            }
                        }

                        if (Treemap.checkValueForShape(total)) {
                            node.size = total;
                            rootNode.children.push(node);
                            allNodes.push(node);
                        }
                        if (hasHighlights)
                            node.highlightMultiplier = total ? highlightTotal / total : 0;
                    }
                }
            }

            if (interactivityService) {
                interactivityService.applySelectionStateToData(allNodes);
            }

            legendData = { title: legendTitle, dataPoints: legendDataPoints };

            return { root: rootNode, hasHighlights: hasHighlights, legendData: legendData, dataLabelsSettings: labelSettings, legendObjectProperties: legendObjectProperties };
        }

        private static getValuesFromCategoricalDataView(data: DataViewCategorical, hasHighlights: boolean): TreemapRawData {
            var valueColumns = data.values;
            var categoryValueCount: number;
            if (valueColumns && (data.categories == null)) {
                categoryValueCount = 1; // We only get the first value out of each valueColumn since we don't have a category
            }
            else if (valueColumns && data.categories && data.categories.length > 0) {
                categoryValueCount = data.categories[0].values.length;
            }

            var values: number[][] = [];
            var highlights: number[][] = [];
            for (var i = 0; i < categoryValueCount; i++) {
                values.push([]);
                if (hasHighlights)
                    highlights.push([]);
            }

            var highlightsOverflow: boolean;
            for (var j = 0; j < valueColumns.length; j++) {
                var valueColumn = valueColumns[j];
                for (var i = 0; i < categoryValueCount; i++) {
                    var value = valueColumn.values[i];
                    values[i].push(value);
                    if (hasHighlights) {
                        var highlight = valueColumn.highlights[i];
                        if (!highlight)
                            highlight = 0;
                        highlights[i].push(highlight);
                        if (highlight > value)
                            highlightsOverflow = true;
                    }
                }
            }

            return {
                values: values,
                highlights: hasHighlights ? highlights : undefined,
                highlightsOverflow: hasHighlights ? highlightsOverflow : undefined
            };
        }

        public update(options: VisualUpdateOptions) {
            debug.assertValue(options, 'options');

            var dataViews = this.dataViews = options.dataViews;
            this.currentViewport = options.viewport;
            var labelSettings = dataLabelUtils.getDefaultTreemapLabelSettings();
            var legendObjectProperties = null;

            if (dataViews && dataViews.length > 0 && dataViews[0].categorical) {
                var dataView = dataViews[0];
                var dataViewMetadata = dataView.metadata;
                var objects: DataViewObjects;
                if (dataViewMetadata)
                    objects = dataViewMetadata.objects;

                if (objects) {
                    legendObjectProperties = objects['legend'];
                }

                this.data = Treemap.converter(dataView, this.colors, labelSettings, this.interactivityService, legendObjectProperties);

                var warnings = getInvalidValueWarnings(
                    dataViews,
                    false /*supportsNaN*/,
                    false /*supportsNegativeInfinity*/,
                    false /*supportsPositiveInfinity*/);

                if (warnings && warnings.length > 0)
                    this.hostService.setWarnings(warnings);
            }
            else {
                var rootNode: TreemapNode = {
                    key: "root",
                    name: "root",
                    children: [],
                    selected: false,
                    highlightMultiplier: 0,
                    identity: SelectionId.createNull(),
                    color: undefined,
                };
                var legendData: LegendData = { title: "", dataPoints: [] };
                var treeMapData: TreemapData = {
                    root: rootNode,
                    hasHighlights: false,
                    legendData: legendData,
                    dataLabelsSettings: labelSettings,
                };
                this.data = treeMapData;           
            }

            var duration: number = options.duration == null ? (this.animator ? AnimatorCommon.MinervaAnimationDuration : 0) : options.duration;

            this.updateInternal(!!duration, duration);
        }

        // TODO: Remove this once all visuals have implemented update.
        public onDataChanged(options: VisualDataChangedOptions): void {
            this.update({
                duration: options.duration || (this.animator ? AnimatorCommon.MinervaAnimationDuration : 0),
                dataViews: options.dataViews,
                viewport: this.currentViewport
            });
        }

        // TODO: Remove this once all visuals have implemented update.
        public onResizing(viewport: IViewport, duration: number): void {
            this.update({
                duration: duration || 0,
                dataViews: this.dataViews,
                viewport: viewport
            });
        }

        public onClearSelection(): void {
            if (this.interactivityService)
                this.interactivityService.clearSelection();
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] {
            var data = this.data;
            if (!data)
                return;

            var objectName = options.objectName;
            switch (objectName) {
                case 'dataPoint':
                    var dataViewCat: DataViewCategorical = this.dataViews && this.dataViews.length > 0 && this.dataViews[0] && this.dataViews[0].categorical;
                    var hasGradientRole = GradientUtils.hasGradientRole(dataViewCat);
                    if (!hasGradientRole)
                        return this.enumerateDataPoints(data);
                    break;
                case 'legend':
                    return this.enumerateLegend(data);
                case 'labels':
                    return dataLabelUtils.enumerateDataLabels(this.data.dataLabelsSettings, false);
            }
        }

        private enumerateDataPoints(data: TreemapData): VisualObjectInstance[] {
            var rootChildren = data.root.children;
            if (_.isEmpty(rootChildren))
                return;

            var instances: VisualObjectInstance[] = [];           

            for (var y = 0; y < rootChildren.length; y++) {
                var treemapNode = <TreemapNode>rootChildren[y];
                instances.push({
                    displayName: treemapNode.name,
                    selector: treemapNode.identity.getSelector(),
                    properties: {
                        fill: { solid: { color: treemapNode.color } }
                    },
                    objectName: 'dataPoint'
                });
            }

            return instances;
        }

        private enumerateLegend(data: TreemapData): VisualObjectInstance[] {
            var legendObjectProperties: DataViewObjects = { legend: data.legendObjectProperties};

            var show = DataViewObjects.getValue(legendObjectProperties, treemapProps.legend.show, this.legend.isVisible());
            var showTitle = DataViewObjects.getValue(legendObjectProperties, treemapProps.legend.showTitle, true);
            var titleText = DataViewObjects.getValue(legendObjectProperties, treemapProps.legend.titleText, this.data.legendData.title);

            return [{
                selector: null,
                objectName: 'legend',
                properties: {
                    show: show,
                    position: LegendPosition[this.legend.getOrientation()],
                    showTitle: showTitle,
                    titleText: titleText
                }
            }];
        }

        private static checkValueForShape(value: any): boolean {
            if (!value)
                return false;

            return value > 0;
        }

        private calculateTreemapSize(): IViewport {
            var legendMargins = this.legend.getMargins();
            return {
                height: this.currentViewport.height - legendMargins.height,
                width: this.currentViewport.width - legendMargins.width
            };
        }

        private initViewportDependantProperties(duration: number = 0): void {
            
            var viewport = this.calculateTreemapSize();

            this.svg.attr({
                width: viewport.width,
                height: viewport.height
            });

            SVGUtil.flushAllD3TransitionsIfNeeded(this.options);
        }

        private static isMajorLabel(node: D3.Layout.GraphNode): boolean {
            return node.depth === 1;
        }

        private static hasChildrenWithIdentity(node: D3.Layout.GraphNode): boolean {
            var children = node.children;
            if (!children)
                return false;

            var count = children.length;
            if (count === 0)
                return false;

            for (var i = count - 1; i >= 0; i--) {
                if ((<TreemapNode>children[i]).identity.hasIdentity())
                    return true;
            }

            return false;
        }

        private static canDisplayLabel(node: D3.Layout.GraphNode): boolean {
            // Only display labels for level 1 and 2
            if (node.depth < 1 || node.depth > 2)
                return false;

            if (StringExtensions.isNullOrEmpty(node.name))
                return false;

            var availableWidth = node.dx - Treemap.TextMargin * 2;
            var isMajorLabel = Treemap.isMajorLabel(node);
            var minTextWidth = isMajorLabel ? Treemap.MinTextWidthForMajorLabel : Treemap.MinTextWidthForMinorLabel;

            // Check if the room is enough for text with or without ellipse
            if (availableWidth < minTextWidth)
                return false;

            var textHeight = isMajorLabel ? Treemap.MajorLabelTextSize : Treemap.MinorLabelTextSize;
            var textHeightWithMargin = textHeight + Treemap.TextMargin * 2;

            // Check if the shape is high enough for label
            if (node.dy < textHeightWithMargin)
                return false;

            if (node.depth === 2) {
                var parent = node.parent;
                var roomTop = Math.max(parent.y + Treemap.MajorLabelTextSize + Treemap.TextMargin * 2, node.y);

                // Parent's label needs the room
                if (node.y + node.dy - roomTop < textHeightWithMargin)
                    return false;
            }

            return true;
        }

        private static createLabelForShape(node: D3.Layout.GraphNode): string {
            var baseTextProperties = Treemap.isMajorLabel(node) ? Treemap.MajorLabelTextProperties : Treemap.MinorLabelTextProperties;
            var textProperties: powerbi.TextProperties = {
                text: node.name,
                fontFamily: baseTextProperties.fontFamily,
                fontSize: baseTextProperties.fontSize
            };

            return TextMeasurementService.getTailoredTextOrDefault(textProperties, node.dx - Treemap.TextMargin * 2);
        }

        public static getFill(d: TreemapNode, isHighlightRect: boolean): string {
            // NOTE: only painted shapes will catch click event. We either paint children or their parent but not both.

            // If it's a leaf with no category, parent will be painted instead (and support interactivity)
            if (d.depth > 1 && !d.identity.hasIdentity() && !isHighlightRect)
                return CssConstants.noneValue;

            // If it's not a leaf and it has children with a category, children will be painted
            if (Treemap.hasChildrenWithIdentity(d))
                return CssConstants.noneValue;

            return d.color;
        }

        public static getFillOpacity(d: TreemapNode, hasSelection: boolean, hasHighlights: boolean, isHighlightRect: boolean): string {
            if (hasHighlights) {
                if (isHighlightRect)
                    return null;
                return Treemap.DimmedShapeOpacity.toString();
            }

            if (!hasSelection || d.selected)
                return null;

            // Parent node is selected (as an optimization, we only check below level 1 because root node cannot be selected anyway)
            if (d.depth > 1 && (<TreemapNode>d.parent).selected)
                return null;

            // It's a parent node with interactive children, fall back to default opacity
            if (Treemap.hasChildrenWithIdentity(d))
                return null;

            return Treemap.DimmedShapeOpacity.toString();
        }

        private updateInternal(useAnimation: boolean = true, duration: number = 0): void {
            var data = this.data;
            var hasHighlights = data && data.hasHighlights;
            var labelSettings = data ? data.dataLabelsSettings : null;

            if (!(this.options.interactivity && this.options.interactivity.isInteractiveLegend) && this.data) {
                this.renderLegend();
            }

            this.initViewportDependantProperties(duration);
            var viewport = this.calculateTreemapSize();

            this.treemap.size([viewport.width, viewport.height]);

            // Shapes are drawn for all nodes
            var nodes = (data && data.root) ? this.treemap.nodes(data.root) : [];
            // Highlight shapes are drawn only for nodes with non-null/undefed highlightMultipliers that have no children
            var highlightNodes = nodes.filter((value: TreemapNode) => value.highlightMultiplier != null && (!value.children || value.children.length === 0));
            // Labels are drawn only for nodes that can display labels
            var labeledNodes = labelSettings.show? nodes.filter((d) => Treemap.canDisplayLabel(d)) : [];

            var shapes: D3.UpdateSelection;
            var highlightShapes: D3.UpdateSelection;
            var labels: D3.UpdateSelection;
            var result: TreemapAnimationResult;
            if (this.animator && useAnimation) {
                var options: TreemapAnimationOptions = {
                    viewModel: data,
                    nodes: nodes,
                    highlightNodes: highlightNodes,
                    labeledNodes: labeledNodes,
                    shapeGraphicsContext: this.shapeGraphicsContext,
                    labelGraphicsContext: this.labelGraphicsContext,
                    interactivityService: this.interactivityService,
                };
                result = this.animator.animate(options);
                shapes = result.shapes;
                highlightShapes = result.highlightShapes;
                labels = result.labels;
            }
            if (!this.animator || !useAnimation || result.failed) {
                var hasSelection = nodes.some((value: TreemapNode) => value.selected);
                var shapeGraphicsContext = this.shapeGraphicsContext;
                shapes = Treemap.drawDefaultShapes(shapeGraphicsContext, nodes, hasSelection, hasHighlights);
                highlightShapes = Treemap.drawDefaultHighlightShapes(shapeGraphicsContext, highlightNodes, hasSelection, hasHighlights);
                labels = Treemap.drawDefaultLabels(this.labelGraphicsContext, labeledNodes, labelSettings);
            }

            if (this.interactivityService) {
                var behaviorOptions: TreemapBehaviorOptions = {
                    labels: labels,
                    shapes: shapes,
                    highlightShapes: highlightShapes,
                    nodes: <TreemapNode[]>nodes,
                    hasHighlights: data.hasHighlights,
                };

                this.interactivityService.apply(this, behaviorOptions);
            }

            TooltipManager.addTooltip(shapes, (tooltipEvent: TooltipEvent) => tooltipEvent.data.tooltipInfo);
            TooltipManager.addTooltip(highlightShapes, (tooltipEvent: TooltipEvent) => tooltipEvent.data.highlightedTooltipInfo);

            SVGUtil.flushAllD3TransitionsIfNeeded(this.options);
        }

        private renderLegend(): void {
            var legendObjectProperties = this.data.legendObjectProperties;
            if (legendObjectProperties) {
                var legendData = this.data.legendData;
                LegendData.update(legendData, legendObjectProperties);
                var position = <string>legendObjectProperties[legendProps.position];
                if (position)
                    this.legend.changeOrientation(LegendPosition[position]);

                this.legend.drawLegend(legendData, this.currentViewport);
            } else {
                // TODO: Draw should be the only API. Visuals should only call that with orientation, props, etc 
                // instead of managing state. Will follow up with another change.
                this.legend.changeOrientation(LegendPosition.Top);
                this.legend.drawLegend({dataPoints: []}, this.currentViewport);
            }
        }

        public accept(visitor: InteractivityVisitor, options: any): void {
            visitor.visitTreemap(options);
        }

        private static getNodeClass(d: TreemapNode, highlight?: boolean): string {
            var nodeClass: string;
            switch (d.depth) {
                case 1:
                    nodeClass = Treemap.ParentGroupClassName;
                    break;
                case 2:
                    nodeClass = Treemap.NodeGroupClassName;
                    break;
                case 0:
                    nodeClass = Treemap.RootNodeClassName;
                    break;
                default:
                    debug.assertFail('Treemap only supports 2 levels maxiumum');
            }
            nodeClass += " " + (highlight ? Treemap.HighlightNodeClassName : Treemap.TreemapNodeClassName);
            return nodeClass;
        }

        private static createTreemapShapeLayout(isHighlightRect = false) {
            return {
                x: (d: TreemapNode) => d.x,
                y: (d: TreemapNode) => d.y + (isHighlightRect ? d.dy * (1 - d.highlightMultiplier) : 0),
                width: (d: TreemapNode) => Math.max(0, d.dx),
                height: (d: TreemapNode) => Math.max(0, d.dy * (isHighlightRect ? d.highlightMultiplier : 1)),
            };
        }

        private static createTreemapZeroShapeLayout() {
            return {
                x: (d: TreemapNode) => d.x,
                y: (d: TreemapNode) => d.y + d.dy,
                width: (d: TreemapNode) => Math.max(0, d.dx),
                height: (d: TreemapNode) => 0,
            };
        }

        public static drawDefaultShapes(context: D3.Selection, nodes: D3.Layout.GraphNode[], hasSelection: boolean, hasHighlights: boolean): D3.UpdateSelection {
            var isHighlightShape = false;
            var shapes = context.selectAll('.' + Treemap.TreemapNodeClassName)
                .data(nodes, (d: TreemapNode) => d.key);

            shapes.enter().append('rect')
                .attr('class', Treemap.layout.shapeClass);

            shapes
                .style("fill", (d: TreemapNode) => Treemap.getFill(d, isHighlightShape))
                .style("fill-opacity", (d: TreemapNode) => Treemap.getFillOpacity(d, hasSelection, hasHighlights, isHighlightShape))
                .attr(Treemap.layout.shapeLayout);

            shapes.exit().remove();

            return shapes;
        }

        public static drawDefaultHighlightShapes(context: D3.Selection, nodes: D3.Layout.GraphNode[], hasSelection: boolean, hasHighlights: boolean): D3.UpdateSelection {
            var isHighlightShape = true;
            var highlightShapes = context.selectAll('.' + Treemap.HighlightNodeClassName)
                .data(nodes, (d) => d.key + "highlight");

            highlightShapes.enter().append('rect')
                .attr('class', Treemap.layout.highlightShapeClass);

            highlightShapes
                .style("fill", (d: TreemapNode) => Treemap.getFill(d, isHighlightShape))
                .style("fill-opacity", (d: TreemapNode) => Treemap.getFillOpacity(d, hasSelection, hasHighlights, isHighlightShape))
                .attr(Treemap.layout.highlightShapeLayout);

            highlightShapes.exit().remove();
            return highlightShapes;
        }

        public static drawDefaultLabels(context: D3.Selection, nodes: D3.Layout.GraphNode[], labelSettings: VisualDataLabelsSettings): D3.UpdateSelection {

            var labels = context
                .selectAll('text')
                .data(nodes, (d: TreemapNode) => d.key);

            labels.enter().append('text')
                .attr('class', Treemap.layout.labelClass);

            labels.attr(Treemap.layout.labelLayout)
                .text(Treemap.layout.labelText)
                .style('fill', () => labelSettings.labelColor);

            labels.exit().remove();
            return labels;
        }
    }
}