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

module powerbitests.tablixHelper {
    import CssConstants = jsCommon.CssConstants;
    import DataView = powerbi.DataView;

    var DefaultWaitForRender = 100;

    export interface TableCellCoordinate {
        row: number;
        col: number;
        expectedText?: string;
    }

    export interface TableCellInfo {
        cellCoordinate: TableCellCoordinate;
        clickTarget: JQuery;
        text: string;
    };

    export interface RenderTableOptions {
        visualType: string;
        data: powerbi.DataView;
        formatCallback?: (...args) => void;
        viewport?: powerbi.IViewport;
        settings?: powerbi.VisualSettings;
        redraw?: boolean;
        isFixedSize?: boolean;
        onCustomSortCallback?: (args: powerbi.CustomSortEventArgs) => void;
    };

    /** Gets the specified cell of a 'new table' visual using 0-based indices. */
    export function getTableCell(tableBody: JQuery, coordinate: TableCellCoordinate): TableCellInfo {
        var clickTargetSelector: string = '> tr:nth-child(' + (coordinate.row + 1) + ') > td:nth-child(' + (coordinate.col + 1) + ') > div';
        var textDivSelector: string = '> div';
        var clickTarget = $(clickTargetSelector, tableBody);
        expect(clickTarget).toBeInDOM();
        var textDiv = $(textDivSelector, clickTarget);
        expect(textDiv).toBeInDOM();

        return { cellCoordinate: coordinate, clickTarget: clickTarget, text: textDiv.text() };
    }

    /** Renders the table based on the options passed in. */
    export function renderNewTablix(element: JQuery, options: RenderTableOptions): JQueryPromise<powerbi.IVisual> {
        var viewport = options.viewport ? options.viewport : { height: element.height() + 200, width: element.width() + 200 };
        var data = options.data;
        var redraw = options.redraw ? options.redraw : false;
        var style = powerbi.visuals.visualStyles.create();

        element.width(viewport.width);
        element.css(CssConstants.minWidthProperty, viewport.width);
        element.css(CssConstants.maxWidthProperty, viewport.width);
        element.css(CssConstants.positionProperty, CssConstants.absoluteValue);

        var featureSwitches: powerbi.visuals.MinervaVisualFeatureSwitches = {
            heatMap: true,
            scrollableVisuals: true,
        };
        var visualPluginService = powerbi.visuals.visualPluginFactory.createMinerva(featureSwitches);
        var sortCallback = options.onCustomSortCallback ? options.onCustomSortCallback : (args: powerbi.CustomSortEventArgs) => { };
        var hostService: powerbi.IVisualHostServices = <any>{
            getLocalizedString: (stringId: string) => stringId,
            onCustomSort: sortCallback,
            loadMoreData: () => { },
            getViewMode: () => powerbi.ViewMode.View
        };

        if (options.formatCallback)
            spyOn(powerbi.visuals.valueFormatter, 'formatRaw').and.callFake(options.formatCallback);

        var v: powerbi.IVisual = visualPluginService.getPlugin(options.visualType).create();
        v.init({
            element: element,
            host: hostService,
            style: style,
            viewport: viewport,
            settings: options.settings,
            interactivity: {
                selection: true,
                overflow: options.isFixedSize ? 'hidden' : 'visible'
            }
        });

        v.onDataChanged({ dataViews: [data] });

        var promise = jsCommon.TimerPromiseFactory.instance.create(DefaultWaitForRender)
            .then(() => {
                if (redraw)
                    v.onResizing({ height: viewport.height, width: viewport.width }, 0);

                return v;
            });

        return promise;
    }

    /** Runs a table sort test by first creating the table based on the specified data, then
        validating the generated headers before executing a set of clicks and validating
        the recorded sort events. */
    export function runTablixSortTest(
        element: JQuery,
        done: any,
        visualType: string,
        data: DataView,
        expectedColumnHeaders?: tablixHelper.TableCellCoordinate[],
        clicks?: tablixHelper.TableCellCoordinate[],
        expectedSorts?: powerbi.SortableFieldDescriptor[][]): void {
        var actualSorts: powerbi.SortableFieldDescriptor[][] = [];
        var sortCallback = (args: powerbi.CustomSortEventArgs) => {
            actualSorts.push(args.sortDescriptors);
        };

        var renderTablixPromise = renderNewTablix(
            element,
            {
                visualType: visualType,
                data: data,
                onCustomSortCallback: sortCallback,
            });

        renderTablixPromise.then(
                () => {
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

    export function validateMatrix(expectedValues: string[][], selector: string): void {
        var rows = $(selector);

        var result: string[][] = [];
        var errorString: string = null;

        var ilen = rows.length;
        if (ilen !== expectedValues.length)
            addError(errorString, "Actual row count " + ilen + " does not match expected number of rows " + expectedValues.length + ".");

        for (var i = 0; i < ilen; i++) {
            result[i] = [];
            var cells = rows.eq(i).find('td');
            expect(cells.height()).not.toBe(0);

            var jlen = cells.length;
            if (jlen !== expectedValues[i].length)
                addError(errorString, "Actual column count " + jlen + " in row " + i + " does not match expected number of columns " + expectedValues[i].length + ".");

            for (var j = 0; j < jlen; j++) {
                result[i][j] = cells.eq(j).text();
                if (result[i][j] !== expectedValues[i][j])
                    addError(errorString, "Actual value " + result[i][j] + " in row " + i + " and column " + j + " does not match expected value " + expectedValues[i][j] + ".");
            }
        }

        expect(errorString).toBeNull();
        expect(result).toEqual(expectedValues);
    }

    export function validateTable(expectedValues: string[][], selector: string): void {
        var rows = $(selector);

        var result: string[][] = [];
        var errorString: string = null;

        var ilen = rows.length;
        if (ilen !== expectedValues.length)
            addError(errorString, "Actual row count " + ilen + " does not match expected number of rows " + expectedValues.length + ".");

        for (var i = 0; i < ilen; i++) {
            result[i] = [];
            var cells = rows.eq(i).find('td');

            var jlen = cells.length;
            if (jlen !== expectedValues[i].length)
                addError(errorString, "Actual column count " + jlen + " in row " + i + " does not match expected number of columns " + expectedValues[i].length + ".");

            for (var j = 0; j < jlen; j++) {
                result[i][j] = cells.eq(j).text();
                if (result[i][j] !== expectedValues[i][j])
                    addError(errorString, "Actual value " + result[i][j] + " in row " + i + " and column " + j + " does not match expected value " + expectedValues[i][j] + ".");

                if (cells.eq(j).height() <= 1)
                    addError(errorString, "Actual height " + cells.eq(j).height() + " in row " + i + " and column " + j + " is expected to be > 1.");
            }
        }

        expect(errorString).toBeNull();
        expect(result).toEqual(expectedValues);
    }

    export function validateClassNames(expectedValues: string[][], selector: string, noMarginClass: string): void {
        var rows = $(selector);

        var result: string[][] = [];
        var errorString: string = null;

        var ilen = rows.length;
        if (ilen !== expectedValues.length)
            addError(errorString, "Actual row count " + ilen + " does not match expected number of rows " + expectedValues.length + ".");

        for (var i = 0; i < ilen; i++) {
            result[i] = [];
            var cells = rows.eq(i).find('td');

            var jlen = cells.length;
            if (jlen !== expectedValues[i].length)
                addError(errorString, "Actual column count " + jlen + " in row " + i + " does not match expected number of columns " + expectedValues[i].length + ".");

            for (var j = 0; j < jlen; j++) {
                result[i][j] = cells.eq(j).attr('class');
                expectedValues[i][j] = addNoMarginClass(expectedValues[i][j], noMarginClass);
                if (result[i][j] !== expectedValues[i][j])
                    addError(errorString, "Actual class name " + result[i][j] + " in row " + i + " and column " + j + " does not match expected value " + expectedValues[i][j] + ".");
            }
        }

        expect(errorString).toBeNull();
        expect(result).toEqual(expectedValues);
    }

    function addError(errorString: string, message: string): string {
        if (!errorString)
            return message;

        return errorString + "\r\n" + message;
    }

    function addNoMarginClass(classNames: string, noMarginClass: string): string {
        if (!classNames || classNames.length === 0)
            return noMarginClass;

        return classNames + ' ' + noMarginClass;
    }
}