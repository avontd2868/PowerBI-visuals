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

    export interface SlicerData {
        categorySourceName: string;
        formatString: string;
        slicerDataPoints: SlicerDataPoint[]
    }

    export interface SlicerDataPoint extends SelectableDataPoint {
        value: string;
        mouseOver: boolean;
        mouseOut: boolean;
    }

    export interface SlicerVisualSettingsExtension extends VisualSettings {
        slicerSettings: SlicerSettings;
    }

    export interface SlicerSettings {
        header: {
            height: number;
        }
        headerText: {
            marginLeft: number;
            marginTop: number;
        }
        slicerText: {
            color: string;
            hoverColor: string;
            selectionColor: string;
            marginLeft: number;
        }
        slicerItemContainer: {
            height: number;
            marginTop: number;
            marginLeft: number;
        }
        clear: {
            width: number;
            totalMargin: number;
        }
    }

    export class Slicer implements IVisual {
        private element: JQuery;
        private currentViewport: IViewport;
        private dataView: DataView;
        private slicerContainer: D3.Selection;
        private slicerHeader: D3.Selection;
        private slicerBody: D3.Selection;
        private listView: IListView;
        private slicerData: SlicerData;
        private settings: SlicerVisualSettingsExtension;
        private interactivityService: IInteractivityService
        private hostServices: IVisualHostServices;
        private static clearTextKey = 'Slicer_Clear';
        private waitingForData: boolean;

        private static Container: ClassAndSelector = {
            class: 'slicerContainer',
            selector: '.slicerContainer'
        }
        private static Header: ClassAndSelector = {
            class: 'slicerHeader',
            selector: '.slicerHeader'
        }
        private static HeaderText: ClassAndSelector = {
            class: 'headerText',
            selector: '.headerText'
        }
        private static Body: ClassAndSelector = {
            class: 'slicerBody',
            selector: '.slicerBody'
        }
        private static ItemContainer: ClassAndSelector = {
            class: 'slicerItemContainer',
            selector: '.slicerItemContainer'
        }
        private static LabelText: ClassAndSelector = {
            class: 'slicerText',
            selector: '.slicerText'
        }
        private static Input: ClassAndSelector = {
            class: 'slicerCheckbox',
            selector: '.slicerCheckbox'
        }
        private static Clear: ClassAndSelector = {
            class: 'clear',
            selector: '.clear'
        }

        public static DefaultStyleProperties: SlicerSettings = {
            header: {
                height: 22,
            },
            headerText: {
                marginLeft: 8,
                marginTop: 0,
            },
            slicerText: {
                color: '#666666',
                hoverColor: '#212121',
                selectionColor: '#212121',
                marginLeft: 8,
            },
            slicerItemContainer: {
                height: 24,
                // The margin is assigned in the less file. This is needed for the height calculations.
                marginTop: 5,
                marginLeft: 8
            },
            clear: {
                width: 11,
                // The margins are assigned in the less file. This is needed for the width calculations.
                totalMargin: 10
            }
        }

        public static converter(dataView: DataView): SlicerData {
            var slicerData: SlicerData;
            if (dataView) {
                var dataViewCategorical = dataView.categorical;
                if (dataViewCategorical && dataViewCategorical.categories && dataViewCategorical.categories.length > 0) {
                    var categories = dataViewCategorical.categories[0];
                    var categoryValuesLen = categories && categories.values ? categories.values.length : 0;
                    var slicerDataPoints: SlicerDataPoint[] = [];

                    // Pass over the values to see if there's a positive or negative selection
                    var hasSelection: boolean = undefined;
                    for (var idx = 0; idx < categoryValuesLen; idx++) {
                        var selected = WebInteractivityService.isSelected(slicerProps.selectedPropertyIdentifier, categories, idx);
                        if (selected !== undefined) {
                            hasSelection = selected;
                            break;
                        }
                    }

                    for (var idx = 0; idx < categoryValuesLen; idx++) {
                        var categoryIdentity = categories.identity ? categories.identity[idx] : null;
                        var selectedCategory = WebInteractivityService.isSelected(slicerProps.selectedPropertyIdentifier, categories, idx);
                        if (selectedCategory === undefined && hasSelection !== undefined) {
                            selectedCategory = !hasSelection;
                        }

                        slicerDataPoints.push({
                            value: categories.values[idx],
                            mouseOver: false,
                            mouseOut: true,
                            identity: SelectionId.createWithId(categoryIdentity),
                            selected: selectedCategory
                        });
                    }
                    slicerData = {
                        categorySourceName: categories.source.displayName,
                        formatString: valueFormatter.getFormatString(categories.source, slicerProps.formatString),
                        slicerDataPoints: slicerDataPoints
                    };
                }
            }
            return slicerData;
        }

        public init(options: VisualInitOptions): void {
            this.element = options.element;
            this.currentViewport = options.viewport;
            this.interactivityService = VisualInteractivityFactory.buildInteractivityService(options);
            this.hostServices = options.host;
            var settings = this.settings = <SlicerVisualSettingsExtension>options.settings;
            if (!settings || !settings.slicerSettings) {
                settings = this.settings = options.settings = {
                    slicerSettings: Slicer.DefaultStyleProperties
                };
            }

            this.initContainer();
        }

        public onDataChanged(options: VisualDataChangedOptions): void {
            var dataViews = options.dataViews;
            debug.assertValue(dataViews, 'dataViews');

            var existingDataView = this.dataView;
            if (dataViews && dataViews.length > 0) {
                this.dataView = dataViews[0];
            }

            var resetScrollbarPosition = options.operationKind !== VisualDataChangeOperationKind.Append
                && !DataViewAnalysis.hasSameCategoryIdentity(existingDataView, this.dataView);
            this.updateInternal(resetScrollbarPosition);
            this.waitingForData = false;
        }

        public onResizing(finalViewport: IViewport, duration: number): void {
            this.currentViewport = finalViewport;
            var slicerViewport = this.getSlicerBodyViewport(this.currentViewport);
            this.slicerBody.style({
                'height': SVGUtil.convertToPixelString(slicerViewport.height),
                'width': SVGUtil.convertToPixelString(slicerViewport.width),
            });
            this.slicerHeader.select(Slicer.HeaderText.selector).style("width", this.getSlicerHeaderTextWidth());
            this.updateInternal();
        }

        public accept(visitor: InteractivityVisitor, options: any): void {
            visitor.visitSlicer(options);
        }

        private updateInternal(resetScrollbarPosition: boolean = false) {
            var data = this.slicerData = Slicer.converter(this.dataView);
            if (!data) {
                this.listView.empty();
                return;
            }

            this.listView
                .viewport(this.getSlicerBodyViewport(this.currentViewport))
                .rowHeight(this.getRowHeight())
                .data(data.slicerDataPoints, (d: SlicerDataPoint) => $.inArray(d, data.slicerDataPoints))
                .render(true, resetScrollbarPosition);
        }

        private initContainer() {
            var settings = this.settings.slicerSettings;
            var slicerBodyViewport = this.getSlicerBodyViewport(this.currentViewport);
            this.slicerContainer = d3.select(this.element.get(0)).classed(Slicer.Container.class, true);

            this.slicerHeader = this.slicerContainer.append("div").classed(Slicer.Header.class, true)
                .style('height', SVGUtil.convertToPixelString(settings.header.height));

            this.slicerHeader.append("div").classed(Slicer.HeaderText.class, true)
                .style({
                'margin-left': SVGUtil.convertToPixelString(settings.headerText.marginLeft),
                'margin-top': SVGUtil.convertToPixelString(settings.headerText.marginTop),
                'width': this.getSlicerHeaderTextWidth(),
            });

            this.slicerHeader.append("span")
                .classed(Slicer.Clear.class, true)
                .attr('title', this.hostServices.getLocalizedString(Slicer.clearTextKey));            

            this.slicerBody = this.slicerContainer.append("div").classed(Slicer.Body.class, true)
                .style({
                'height': SVGUtil.convertToPixelString(slicerBodyViewport.height),
                'width': SVGUtil.convertToPixelString(slicerBodyViewport.width)
            });

            var rowEnter = (rowSelection: D3.Selection) => {
                var labelWidth = SVGUtil.convertToPixelString(this.currentViewport.width - (settings.slicerItemContainer.marginLeft + settings.slicerText.marginLeft));
                var listItemElement = rowSelection.append("li")
                    .classed(Slicer.ItemContainer.class, true)
                    .style({
                    'height': SVGUtil.convertToPixelString(settings.slicerItemContainer.height),
                    'margin-left': SVGUtil.convertToPixelString(settings.slicerItemContainer.marginLeft),
                });

                var labelElement = listItemElement.append("label")
                    .classed(Slicer.Input.class, true);

                labelElement.append("input")
                    .attr('type', 'checkbox');

                labelElement.append("span")
                    .classed(Slicer.LabelText.class, true)
                    .style('width', labelWidth);
            };

            var rowUpdate = (rowSelection: D3.Selection) => {
                var formatString;
                if (this.slicerData) {
                    this.slicerHeader.select(Slicer.HeaderText.selector).text(this.slicerData.categorySourceName);
                    formatString = this.slicerData.formatString;
                }

                var slicerText = rowSelection.selectAll(Slicer.LabelText.selector);
                slicerText.text((d: SlicerDataPoint) => valueFormatter.format(d.value, formatString));
                if (this.interactivityService && this.slicerData && this.slicerBody) {
                    var slicerBody = this.slicerBody.attr('width', this.currentViewport.width);
                    var slicerItemContainers = slicerBody.selectAll(Slicer.ItemContainer.selector);
                    var slicerItemLabels = slicerBody.selectAll(Slicer.LabelText.selector);
                    var slicerItemInputs = slicerBody.selectAll(Slicer.Input.selector);
                    var slicerClear = this.slicerHeader.select(Slicer.Clear.selector);

                    var behaviorOptions: SlicerBehaviorOptions = {
                        datapoints: this.slicerData.slicerDataPoints,
                        slicerItemContainers: slicerItemContainers,
                        slicerItemLabels: slicerItemLabels,
                        slicerItemInputs: slicerItemInputs,
                        slicerClear: slicerClear,
                    };

                    this.interactivityService.apply(this, behaviorOptions);
                }
                rowSelection.select(Slicer.Input.selector).select('input').property('checked', (d: SlicerDataPoint) => d.selected);
            };

            var rowExit = (rowSelection: D3.Selection) => {
                rowSelection.remove();
            };

            var listViewOptions: ListViewOptions = {
                rowHeight: this.getRowHeight(),
                enter: rowEnter,
                exit: rowExit,
                update: rowUpdate,
                loadMoreData: () => this.onLoadMoreData(),
                viewport: this.getSlicerBodyViewport(this.currentViewport),
                baseContainer: this.slicerBody
            };

            this.listView = ListViewFactory.createHTMLListView(listViewOptions);
        }

        private onLoadMoreData(): void {
            if (!this.waitingForData && this.dataView.metadata && this.dataView.metadata.segment) {
                this.hostServices.loadMoreData();
                this.waitingForData = true;
            }
        }

        private getSlicerBodyViewport(currentViewport: IViewport): IViewport {
            var settings = this.settings.slicerSettings;
            var slicerBodyHeight = currentViewport.height - (settings.header.height + 1);
            return {
                height: slicerBodyHeight,
                width: currentViewport.width
            };
        }

        private getSlicerHeaderTextWidth(): string {
            var slicerSettings = this.settings.slicerSettings;
            return SVGUtil.convertToPixelString(this.currentViewport.width - (slicerSettings.headerText.marginLeft + slicerSettings.clear.width + slicerSettings.clear.totalMargin));
        }

        private getRowHeight(): number {
            var slicerItemSettings = this.settings.slicerSettings.slicerItemContainer;
            return slicerItemSettings.height;
        }
    }
}