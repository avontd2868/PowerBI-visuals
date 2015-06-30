//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbitests;
(function (powerbitests) {
    var tablixHelper;
    (function (tablixHelper) {
        var CssConstants = jsCommon.CssConstants;
        var DefaultWaitForRender = 100;
        ;
        ;
        /** Gets the specified cell of a 'new table' visual using 0-based indices. */
        function getTableCell(tableBody, coordinate) {
            var clickTargetSelector = '> tr:nth-child(' + (coordinate.row + 1) + ') > td:nth-child(' + (coordinate.col + 1) + ') > div';
            var textDivSelector = '> div';
            var clickTarget = $(clickTargetSelector, tableBody);
            expect(clickTarget).toBeInDOM();
            var textDiv = $(textDivSelector, clickTarget);
            expect(textDiv).toBeInDOM();
            return { cellCoordinate: coordinate, clickTarget: clickTarget, text: textDiv.text() };
        }
        tablixHelper.getTableCell = getTableCell;
        /** Renders the table based on the options passed in. */
        function renderNewTablix(element, options) {
            var viewport = options.viewport ? options.viewport : { height: element.height() + 200, width: element.width() + 200 };
            var data = options.data;
            var redraw = options.redraw ? options.redraw : false;
            var style = powerbi.common.services.visualStyles.create();
            element.width(viewport.width);
            element.css(CssConstants.minWidthProperty, viewport.width);
            element.css(CssConstants.maxWidthProperty, viewport.width);
            element.css(CssConstants.positionProperty, CssConstants.absoluteValue);
            var featureSwitches = {
                newTable: true,
                heatMap: true,
                scrollableVisuals: true,
            };
            var visualPluginService = powerbi.visuals.visualPluginFactory.createMinerva(featureSwitches);
            var sortCallback = options.onCustomSortCallback ? options.onCustomSortCallback : function (args) {
            };
            var hostService = {
                getLocalizedString: function (stringId) { return stringId; },
                onCustomSort: sortCallback,
                loadMoreData: function () {
                },
                getViewMode: function () { return 0 /* View */; }
            };
            if (options.formatCallback)
                spyOn(powerbi.visuals.valueFormatter, 'formatRaw').and.callFake(options.formatCallback);
            var v = visualPluginService.getPlugin(options.visualType).create();
            v.init({
                element: element,
                host: hostService,
                style: style,
                viewport: viewport,
                settings: options.settings,
                interactivity: {
                    overflow: options.isFixedSize ? 'hidden' : 'visible'
                }
            });
            v.onDataChanged({ dataViews: [data] });
            var promise = jsCommon.TimerPromiseFactory.instance.create(DefaultWaitForRender).then(function () {
                if (redraw)
                    v.onResizing({ height: viewport.height, width: viewport.width }, 0);
                return v;
            });
            return promise;
        }
        tablixHelper.renderNewTablix = renderNewTablix;
        /** Runs a table sort test by first creating the table based on the specified data, then
            validating the generated headers before executing a set of clicks and validating
            the recorded sort events. */
        function runTablixSortTest(element, done, visualType, data, expectedColumnHeaders, clicks, expectedSorts) {
            var actualSorts = [];
            var sortCallback = function (args) {
                actualSorts.push(args.sortDescriptors);
            };
            var renderTablixPromise = renderNewTablix(element, {
                visualType: visualType,
                data: data,
                onCustomSortCallback: sortCallback,
            });
            renderTablixPromise.then(function () {
                var tableBody = $('.tablixContainer > div.bi-tablix > div:nth-child(1) > table.unselectable > tbody');
                expect(tableBody).toBeInDOM();
                // Validate column headers
                if (expectedColumnHeaders) {
                    for (var i = 0, len = expectedColumnHeaders.length; i < len; i++) {
                        var coordinate = expectedColumnHeaders[i];
                        var headerCell = getTableCell(tableBody, coordinate);
                        if (coordinate.expectedText)
                            expect(headerCell.text).toBe(coordinate.expectedText);
                    }
                }
                // Execute the clicks
                if (clicks) {
                    for (var i = 0, len = clicks.length; i < len; i++) {
                        var clickCoordinate = clicks[i];
                        var clickCell = getTableCell(tableBody, clickCoordinate);
                        if (clickCoordinate.expectedText)
                            expect(clickCell.text).toBe(clickCoordinate.expectedText);
                        clickCell.clickTarget.click();
                    }
                }
                // Validate the expected sorts
                if (expectedSorts) {
                    expect(expectedSorts.length).toBe(actualSorts.length);
                    for (var i = 0, len = expectedSorts.length; i < len; i++) {
                        var expectedSort = expectedSorts[i];
                        var actualSort = actualSorts[i];
                        expect(expectedSort.length).toBe(actualSort.length);
                        for (var j = 0, jlen = expectedSort.length; j < jlen; j++) {
                            var expectedField = expectedSort[j];
                            var actualField = actualSort[j];
                            expect(expectedField.queryName).toBe(actualField.queryName);
                            expect(expectedField.sortDirection).toBe(actualField.sortDirection);
                        }
                    }
                }
                done();
            });
        }
        tablixHelper.runTablixSortTest = runTablixSortTest;
    })(tablixHelper = powerbitests.tablixHelper || (powerbitests.tablixHelper = {}));
})(powerbitests || (powerbitests = {}));
