//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    export interface CardItemData {
        caption: string;
        details: string;
    }

    export interface CardData {
        title?: string;
        cardItemsData: CardItemData[];
    }

    interface MultiRowCardStyle {
        card: {
            bottomBorderWidth: number;
            leftBorderWidth: number;
            borderStyle: string;
            leftBorderColor: string;
            borderColor: string;
            bottomPadding: number;
            topPadding: number;
            leftPadding: number;
            color: string;
            marginBottom: number;
        }
        title: {
            height: number;
            marginBottom: number;
        }
        cardItemContainer: {
            marginRight: number;
            maxWidth: number;
            topPadding: number;
            topPaddingCanvas: number;
        }
        caption: {
            height: number;
            fontSize: number;
            color: string;
        }
        details: {
            height: number;
            fontSize: number;
            color: string;
        }
        scrollbar: {
            padding: number;
        }
        cardItems: {
            maxItemsSmallTile: number;
            maxItemsMediumTile: number;
            maxItemsLargeTile: number;
        }
        cardRowColumns: {
            maxRowColumnsSmallTile: number;
            maxRowColumnsMediumTile: number;
            maxRowColumnsLargeTile: number;
        }
        cards: {
            maxCardsSmallTile: number;
            maxCardsMediumTile: number;
            maxCardsLargeTile: number;
        }
    }

    export class MultiRowCard implements IVisual {
        private currentViewport: IViewport;
        private options: VisualInitOptions;
        private dataView: DataView;
        private cardStack: JQuery;
        private style: IVisualStyle;
        private element: JQuery;
        private listView: IListView;
        private cardHeight: number;
        private cardWidth: number;
        private columnWidth: number;
        private maxCardsDisplayed: number;
        private cardItemContainerHeight: number
        private isCardWrapped: boolean = false;
        /** This includes card height with margin that will be passed to list view. */
        private cardHeightTotal: number;
        private settings: MultiRowCardStyle;
        private dataModel: CardData[];
        private interactivity: InteractivityOptions;
        private isInteractivityOverflowHidden: boolean = false;
        private waitingForData: boolean;
        private cardHasTitle: boolean;
        private isSingleRowCard: boolean;
        private isSingleValueCard: boolean;

        // Public for testability
        public static formatStringProp: DataViewObjectPropertyIdentifier = {
            objectName: 'general',
            propertyName: 'formatString',
        };
        private static multiRowCardClass = 'multiRowCard';
        private static Card: ClassAndSelector = {
            class: 'card',
            selector: '.card'
        };

        private static Title: ClassAndSelector = {
            class: 'title',
            selector: '.title'
        };

        private static CardItemContainer: ClassAndSelector = {
            class: 'cardItemContainer',
            selector: '.cardItemContainer'
        };

        private static Caption: ClassAndSelector = {
            class: 'caption',
            selector: '.caption'
        };

        private static Details: ClassAndSelector = {
            class: 'details',
            selector: '.details'
        };

        private static SmallTileWidth = 250;
        private static MediumTileWidth = 490;
        private static LargeTileWidth = 750;

        /** Cards have specific styling so defined inline styles and also to support theming and improve performance */
        private static DefaultStyle: MultiRowCardStyle = {
            card: {
                bottomBorderWidth: 1,
                leftBorderWidth: 3,
                borderStyle: 'solid',
                leftBorderColor: '#A6A6A6',
                borderColor: '#C8C8C8',
                bottomPadding: 5,
                leftPadding: 10,
                topPadding: 5,
                color: '#767676',
                marginBottom: 20
            },
            title: {
                height: 37,
                marginBottom: 5,
            },
            cardItemContainer: {
                marginRight: 20,
                maxWidth: 100,
                topPadding: 5,
                topPaddingCanvas: 7
            },
            caption: {
                height: 20,
                fontSize: 14,
                color: '#333333'
            },
            details: {
                height: 16,
                fontSize: 12,
                color: '#A6A6A6'
            },
            scrollbar: {
                padding: 8
            },
            cardItems: {
                maxItemsSmallTile: 4,
                maxItemsMediumTile: 6,
                maxItemsLargeTile: 6
            },
            cardRowColumns: {
                maxRowColumnsSmallTile: 2,
                maxRowColumnsMediumTile: 3,
                maxRowColumnsLargeTile: 6
            },
            cards: {
                maxCardsSmallTile: 1,
                maxCardsMediumTile: 3,
                maxCardsLargeTile: 8
            }
        }

        public static capabilities: VisualCapabilities = {
            dataRoles: [
                {
                    name: 'Values',
                    kind: VisualDataRoleKind.GroupingOrMeasure,
                    displayName: data.createDisplayNameGetter('Role_DisplayName_Fields'),
                }
            ],
            objects: {
                general: {
                    properties: {
                        formatString: {
                            type: { formatting: { formatString: true } },
                        },
                    },
                }
            },
            dataViewMappings: [{
                table: {
                    rows: {
                        for: { in: 'Values' },
                        dataReductionAlgorithm: { window: {} }
                    },
                    rowCount: { preferred: { min: 1 } }
                },
            }],
            suppressDefaultTitle: true,
        };

        public init(options: VisualInitOptions) {
            debug.assertValue(options, 'options');
            this.options = options;
            this.style = options.style;
            var viewport = this.currentViewport = options.viewport;
            var interactivity = this.interactivity = options.interactivity;

            if (interactivity && interactivity.overflow === 'hidden')
                this.isInteractivityOverflowHidden = true;

            this.settings = MultiRowCard.DefaultStyle;

            var multiRowCardDiv = $('<div/>').addClass(MultiRowCard.multiRowCardClass);
            options.element.append(multiRowCardDiv);
            var element = this.element = multiRowCardDiv;
            element.css('height', this.getPixelString(viewport.height));

            this.initializeCardRowSelection();
        }

        public onDataChanged(options: VisualDataChangedOptions): void {
            debug.assertValue(options, 'options');

            var dataViews = options.dataViews;
            if (dataViews && dataViews.length > 0) {
                this.dataView = dataViews[0];
            }

            var resetScrollbarPosition = options.operationKind !== VisualDataChangeOperationKind.Append;
            this.updateInternal(resetScrollbarPosition);
            this.waitingForData = false;
        }

        public onResizing(viewport: IViewport, duration: number): void {
            var viewport = this.currentViewport = viewport;
            this.element.css('height', this.getPixelString(viewport.height));
            this.updateInternal();
        }

        public static converter(dataView: DataView, columnCount: number, maxCards: number, isDashboardVisual: boolean = false): CardData[] {
            var details: CardData[] = [];
            var tableDataRows = dataView.table.rows;
            var columnMetadata: DataViewMetadataColumn[] = dataView.table.columns;

            var formatter = valueFormatter.formatRaw;
            for (var i = 0, len = maxCards; i < len; i++) {
                var row = tableDataRows[i];
                var isValuePromoted: boolean = undefined;
                var title: string = undefined;
                var cardData: CardItemData[] = [];
                for (var j = 0; j < columnCount; j++) {
                    var column = columnMetadata[j];
                    var columnCaption: string = formatter(row[j], valueFormatter.getFormatString(column, MultiRowCard.formatStringProp));
                    
                    // The columnDetail represents column name. In card the column name is shown as details
                    var columnDetail: string = columnMetadata[j].displayName;

                    //Title is shown only on Canvas and only if there is one Category field.
                    if (!isDashboardVisual && !column.type.numeric) {
                        if (isValuePromoted === undefined) {
                            isValuePromoted = true;
                            title = columnCaption;
                        }
                        else if (isValuePromoted) {
                            isValuePromoted = false;
                        }
                    }
                    cardData.push({
                        caption: columnCaption,
                        details: columnDetail,
                    });
                }
                details.push({
                    title: isValuePromoted ? title : undefined,
                    cardItemsData: isValuePromoted ? cardData.filter((d: CardItemData) => d.caption !== title) : cardData

                });
            }
            return details;
        }

        private updateInternal(resetScrollbarPosition: boolean = false) {
            var dataView = this.dataView;
            if (!(dataView && dataView.metadata && dataView.table && dataView.table.rows && dataView.table.rows.length > 0 && dataView.table.columns && dataView.table.columns.length > 0)) {
                this.listView.empty();
                return;
            }

            this.setCardDimensions();
            var cardHeightTotal = this.cardHeightTotal;
            var dataModel = this.dataModel;

            debug.assertValue(cardHeightTotal, 'cardHeightTotal');
            debug.assert(cardHeightTotal > 0, 'cardHeightTotal should be more than 0');

            this.listView
                .viewport(this.currentViewport)
                .rowHeight(cardHeightTotal)
                .data(dataModel,(d: CardData) => dataModel.indexOf(d))
                .render(true, resetScrollbarPosition);
        }

        private initializeCardRowSelection() {
            var settings = this.settings;
            var cardHeightTotal = this.cardHeightTotal;
            var rowHeight = this.cardHeight;
            var isDashboardVisual = this.isInteractivityOverflowHidden;
            var cardRowTitle: string;

            var rowEnter = (rowSelection: D3.Selection) => {
                var cardRow = rowSelection
                    .append("div")
                    .style({
                    'color': settings.card.color,
                    'overflow-y': 'hidden',
                    'box-sizing': 'border-box',
                })
                    .classed(MultiRowCard.Card.class, true)

                // The card top padding is not needed when card items are wrapped as top padding is added to each carditemcontainer when wrapped
                if (isDashboardVisual) {
                    cardRow.style('padding-top', this.isCardWrapped ? '0px' : this.getPixelString(settings.card.topPadding));
                }
                else {
                    cardRow
                        .style({
                        'border-left': this.getPixelString(settings.card.leftBorderWidth) + " " + settings.card.borderStyle,
                        'border-left-color': settings.card.leftBorderColor,
                        'padding-left': this.getPixelString(settings.card.leftPadding)
                    })

                    if (this.cardHasTitle) {
                        cardRow.append("div").classed(MultiRowCard.Title.class, true)
                            .style({
                            'height': this.getPixelString(settings.title.height),
                            'margin-bottom': this.isCardWrapped ? '0px' : this.getPixelString(settings.title.marginBottom),
                        });
                    }
                }

                var cardItem = cardRow
                    .selectAll(MultiRowCard.CardItemContainer.selector)
                    .data((d: CardData) => d.cardItemsData)
                    .enter()
                    .append('div')
                    .classed(MultiRowCard.CardItemContainer.class, true)
                    .style({
                    'box-sizing': 'border-box',
                    'height': this.getPixelString(this.cardItemContainerHeight),
                    'margin-right': this.isSingleValueCard ? '0px' : this.getPixelString(settings.cardItemContainer.marginRight),
                    'float': 'left',
                    // If card is wrapped, padding is added to the itemcontainer as top padding so we don't have to add the bottom padding to the title
                    'padding-top': this.isCardWrapped ? (isDashboardVisual ? this.getPixelString(settings.cardItemContainer.topPadding) : this.getPixelString(settings.cardItemContainer.topPaddingCanvas)) : '0px'
                });

                cardItem
                    .append('div')
                    .classed(MultiRowCard.Caption.class, true)
                    .style({
                    'height': this.getPixelString(settings.caption.height),
                    'font-size': this.getPixelString(settings.caption.fontSize),
                    'color': settings.caption.color,
                    'text-align': 'left',
                    'white-space': 'nowrap',
                    'text-overflow': 'ellipsis',
                    'overflow': 'hidden'
                });

                cardItem
                    .append('div')
                    .classed(MultiRowCard.Details.class, true)
                    .style({
                    'height': this.getPixelString(settings.details.height),
                    'font-size': this.getPixelString(settings.details.fontSize),
                    'color': settings.details.color,
                    'text-align': 'left',
                    'white-space': 'nowrap',
                    'text-overflow': 'ellipsis',
                    'overflow': 'hidden'
                });
            };

            var rowUpdate = (rowSelection: D3.Selection) => {
                rowHeight = this.cardHeight;

                if (!isDashboardVisual && this.cardHasTitle)
                    rowSelection.selectAll(MultiRowCard.Title.selector).text((d: CardData) => d.title);

                var cardSelection = rowSelection.selectAll(MultiRowCard.Card.selector)
                    .style({
                    'height': this.getPixelString(rowHeight),
                    'width': this.getPixelString(this.cardWidth)
                });

                var cardItemContainerWidth = this.isSingleValueCard ? this.columnWidth : this.columnWidth - settings.cardItemContainer.marginRight;
                cardSelection
                    .selectAll(MultiRowCard.CardItemContainer.selector)
                    .style("width", this.getPixelString(cardItemContainerWidth));

                cardSelection
                    .selectAll(MultiRowCard.Caption.selector).text((d: CardItemData) => d.caption);

                cardSelection
                    .selectAll(MultiRowCard.Details.selector).text((d: CardItemData) => d.details);

                // The last card styling is different in the dashboard 
                if (isDashboardVisual) {
                    var dataModel = this.dataModel;

                    if (dataModel && dataModel.length > 0)
                        cardSelection = cardSelection.filter((d: CardData) => d !== dataModel[dataModel.length - 1]);

                    cardSelection
                        .style({
                        'border-bottom-style': settings.card.borderStyle,
                        'border-bottom-width': this.getPixelString(settings.card.bottomBorderWidth),
                        'border-bottom-color': settings.card.borderColor,
                        'padding-bottom': this.getPixelString(settings.card.bottomPadding),
                    });
                }

                cardSelection
                    .style('margin-bottom', isDashboardVisual ? '0px' : (this.isSingleRowCard ? '0px' : this.getPixelString(settings.card.marginBottom)));
            };

            var rowExit = (rowSelection: D3.Selection) => {
                rowSelection.remove();
            };

            var listViewOptions: ListViewOptions = {
                rowHeight: cardHeightTotal,
                enter: rowEnter,
                exit: rowExit,
                update: rowUpdate,
                loadMoreData: () => this.onLoadMoreData(),
                viewport: this.currentViewport,
                baseContainer: d3.select(this.element.get(0))
            };

            this.listView = ListViewFactory.createHTMLListView(listViewOptions);
        }

        /**
        * This contains the card column wrapping logic
        * Determines how many columns can be shown per each row inside a Card
        * To place the fields evenly along the card, the width of each card item is calculated based on the available viewport width
        */
        private setCardDimensions(): void {
            var dataView = this.dataView;
            debug.assertValue(dataView, 'dataView');

            var columnMetadata: DataViewMetadataColumn[] = dataView.table.columns;
            var tableRows: any[][] = dataView.table.rows;
            var viewport = this.currentViewport;
            var settings = this.settings;
            var cardRowColumnCount: number = 0;
            var interactivity = this.interactivity;
            var maxCardColumns = cardRowColumnCount = columnMetadata.length;
            var viewportWidth = viewport.width;
            this.cardHasTitle = false;

            if (this.isInteractivityOverflowHidden) {
                if (viewportWidth <= MultiRowCard.SmallTileWidth) {
                    cardRowColumnCount = Math.min(settings.cardRowColumns.maxRowColumnsSmallTile, cardRowColumnCount);
                    maxCardColumns = Math.min(settings.cardItems.maxItemsSmallTile, maxCardColumns);
                }

                else if (viewportWidth <= MultiRowCard.MediumTileWidth) {
                    cardRowColumnCount = Math.min(settings.cardRowColumns.maxRowColumnsMediumTile, cardRowColumnCount);
                    maxCardColumns = Math.min(settings.cardItems.maxItemsMediumTile, maxCardColumns);
                }

                else if (viewportWidth <= MultiRowCard.LargeTileWidth) {
                    cardRowColumnCount = Math.min(settings.cardRowColumns.maxRowColumnsLargeTile, cardRowColumnCount);
                    maxCardColumns = Math.min(settings.cardItems.maxItemsLargeTile, maxCardColumns);
                }

                this.calculateCardDimensions(viewport, cardRowColumnCount, maxCardColumns, tableRows.length);
                this.dataModel = MultiRowCard.converter(dataView, maxCardColumns, this.maxCardsDisplayed, this.isInteractivityOverflowHidden);
            }
            else {
                var dataModel = this.dataModel = MultiRowCard.converter(dataView, maxCardColumns, tableRows.length);
                maxCardColumns = 0;

                if (dataModel && dataModel.length > 0) {
                    maxCardColumns = dataModel[0].cardItemsData ? dataModel[0].cardItemsData.length : 0;
                    this.cardHasTitle = dataModel[0].title ? true : false;
                    this.isSingleRowCard = dataModel.length === 1 ? true : false;
                }
                this.calculateCardDimensions(viewport, maxCardColumns, maxCardColumns, dataModel.length);
                if (this.cardHasTitle) {
                    var cardHeight = this.cardHeight += settings.title.height + (this.isCardWrapped ? 0 : settings.title.marginBottom);
                    this.cardHeightTotal = this.getTotalCardHeight(cardHeight);
                }
            }
        }

        private calculateCardDimensions(viewport: IViewport, cardRowColumnCount: number, maxCardColumns: number, maxCards: number): void {
            var settings = this.settings;
            var isDashboardVisual = this.isInteractivityOverflowHidden;
            var cardWidth = viewport.width - settings.scrollbar.padding;
            var cardRowColumnCountDisplayed = cardRowColumnCount;
            var cardItemContainerHeight = settings.caption.height + settings.details.height;
            var isCardWrapped = false;

            if (!isDashboardVisual)
                cardWidth -= (settings.card.leftBorderWidth + settings.card.leftPadding);

            var columnWidth = cardWidth / cardRowColumnCount;

            if (cardRowColumnCount === maxCardColumns) {
                columnWidth = Math.max(columnWidth, settings.cardItemContainer.maxWidth);

                columnWidth = Math.min(columnWidth, cardWidth);

                cardRowColumnCountDisplayed = Math.floor(cardWidth / columnWidth);
            }

            this.isSingleValueCard = cardRowColumnCountDisplayed === 1;

            var totalRowsDisplayed = Math.ceil(maxCardColumns / cardRowColumnCountDisplayed);

            if (totalRowsDisplayed > 1) {
                cardItemContainerHeight += (isDashboardVisual ? settings.cardItemContainer.topPadding : settings.cardItemContainer.topPaddingCanvas);
                columnWidth = cardWidth / cardRowColumnCountDisplayed;
                isCardWrapped = true;
            }

            var cardHeight = Math.ceil(totalRowsDisplayed * cardItemContainerHeight);
            if (isDashboardVisual) {
                cardHeight += settings.card.bottomBorderWidth + settings.card.bottomPadding + settings.card.topPadding;
            }
            var cardHeightTotal = cardHeight;

            if (isDashboardVisual) {
                maxCards = Math.min(Math.floor(viewport.height / cardHeight), maxCards);
            }
            else {
                cardHeightTotal = this.getTotalCardHeight(cardHeight);
                cardWidth += settings.card.leftBorderWidth + settings.card.leftPadding;
            }

            this.cardHeight = cardHeight;
            this.columnWidth = columnWidth;
            this.cardWidth = cardWidth;
            this.cardHeightTotal = cardHeightTotal;
            this.maxCardsDisplayed = maxCards;
            this.cardItemContainerHeight = cardItemContainerHeight;
            this.isCardWrapped = isCardWrapped;
        }

        private getPixelString(value: number): string {
            return value + "px";
        }

        private onLoadMoreData(): void {
            if (!this.waitingForData && this.dataView.metadata && this.dataView.metadata.segment) {
                this.options.host.loadMoreData();
                this.waitingForData = true;
            }
        }

        private getTotalCardHeight(cardHeight: number): number {
            return cardHeight + (this.isSingleRowCard ? 0 : this.settings.card.marginBottom);
        }
    }
}
