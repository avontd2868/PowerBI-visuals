//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    interface IBingNewsItemData {
        Title: string;
        Description: string;
        Date: string;
        Source: string;
        Url: string;
    }

    export class BingNews implements IVisual {
        private newsList: JQuery;
        private loadingPlaceholder: JQuery;
        private loadingPlaceholderText: JQuery;
        private currentViewport: IViewport;
        private data: IBingNewsItemData[];
        private timerId: number;
        private getLocalizedString: (stringId: string) => string;
        private isSmallTile: boolean;

        private static flipTimeInMs = 10000;
        private static smallTileHeight = 100;
        private static mediumTileHeight = 250;

        private static baseTemplate = '<div class="bingNews">' +
        '<div>' +
        '<div class="loadingPlaceholder"><div class="loadingPlaceholderText" ></div></div>' +
        '<ul class="newsList"></ul>' +
        '</div>' +
        '</div>';

        private static listItemTemplate = '<li><a target="_blank">' +
        '<div class="ms-font-m ms-font-color-neutralDark headline"></div>' +
        '<div class="ms-font-mi ms-font-color-neutralTertiary source"></div>' +
        '<div class="ms-font-mi ms-font-color-neutralSecondaryAlt snippet"></div>' +
        '</a></li>';

        public static capabilities: VisualCapabilities = {};

        public init(options: VisualInitOptions) {
            this.currentViewport = options.viewport;
            var compiledTemplate = $(BingNews.baseTemplate);
            this.newsList = compiledTemplate.find('ul.newsList');
            this.loadingPlaceholder = compiledTemplate.find('.loadingPlaceholder');
            this.loadingPlaceholderText = compiledTemplate.find('.loadingPlaceholderText');
            this.loadingPlaceholder.height(options.viewport.height);
            this.loadingPlaceholder.width(options.viewport.width);
            this.getLocalizedString = options.host.getLocalizedString;
            this.loadingPlaceholderText.text(this.getLocalizedString('Tile_LoadingText'));
            options.element.append(compiledTemplate);
            this.data = [];
        }

        public onDataChanged(options: VisualDataChangedOptions): void {
            debug.assertValue(options, 'options');

            var dataViews = options.dataViews;
            if (dataViews.length > 0) {
                var data = dataViews[0]['bingNews'];
                if (this.data !== data) {
                    this.data = data;
                    if (this.data.length > 0) {
                        this.loadingPlaceholder.hide();
                        this.updateInternal();
                    }
                    else
                        this.loadingPlaceholderText.text(this.getLocalizedString('BingNewsTile_NoResults'));
                }
            }            
        }

        public onResizing(viewport: IViewport, duration: number): void {
            if (this.currentViewport.height !== viewport.height || this.currentViewport.width !== viewport.width) {
                this.currentViewport = viewport;
                if (this.data.length > 0)
                    this.updateInternal();
                else {
                    this.loadingPlaceholder.height(viewport.height);
                    this.loadingPlaceholder.width(viewport.width);
                }
            }
        }

        private updateInternal(): void {
            if (this.timerId) {
                window.clearInterval(this.timerId);
                this.timerId = null;
            }

            if (this.currentViewport.height < BingNews.smallTileHeight) {
                this.updateInternalForSmallTile();
            }
            else {
                this.updateInternalForOtherTileSize();
            }
        }

        private updateInternalForSmallTile(): void {
            this.isSmallTile = true;
            var index = -1;

            if (this.data && this.data.length > 0) {
                index = (index + 1) % this.data.length;
                this.flipToItemAtIndex(index);

                this.timerId = window.setInterval(
                    () => {
                        var animate = this.newsList.visible() && document.visibilityState === 'visible';
                        if (animate) {
                            index = (index + 1) % this.data.length;
                            this.flipToItemAtIndex(index);
                        }
                    },
                    BingNews.flipTimeInMs);
            }
        }

        private updateInternalForOtherTileSize(): void {
            this.isSmallTile = false;
            this.newsList.empty();
            var maxNumberOfNews = this.getNumberOfNews();

            for (var i = 0; i < this.data.length && i < maxNumberOfNews; i++) {
                var newItem = this.createNewsItem(i);
                this.newsList.append(newItem);
            }
        }

        private createNewsItem(index: number): any {
            var item = this.data[index];

            if (!item)
                return;
            var date = moment(item.Date).fromNow();
            var newItem = $(BingNews.listItemTemplate);
            newItem.find('.headline').text(item.Title);
            newItem.find('.snippet').text(item.Description);
            newItem.find('.source').text(item.Source + ' - ' + date);
            newItem.find('a').attr('href', item.Url);
            return newItem;
        }

        private getNumberOfNews(): number {
            if (this.currentViewport.height > BingNews.mediumTileHeight) {
                return 7;
            }
            return 3;
        }

        private flipToItemAtIndex(index: number): void {
            var newItem = this.createNewsItem(index);

            this.newsList.velocity('transition.slideRightBigOut', () => {
                // There is a delay before velocity executes the lambda, so we need to check to make sure the tile size hasn't changed.
                if (this.isSmallTile) {
                    this.newsList.empty();
                    this.newsList.append(newItem);
                }
            }).velocity('transition.slideLeftBigIn');
        }
    }
} 