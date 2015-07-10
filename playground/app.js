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
var powerbi;
(function (powerbi) {
    var visuals;
    (function (_visuals) {
        var defaultVisualHostServices = powerbi.visuals.defaultVisualHostServices;
        var dataColors = new powerbi.visuals.DataColorPalette();
        var visualStyle = {
            titleText: {
                color: { value: 'rgba(51,51,51,1)' }
            },
            subTitleText: {
                color: { value: 'rgba(145,145,145,1)' }
            },
            colorPalette: {
                dataColors: dataColors,
            },
            labelText: {
                color: {
                    value: 'rgba(51,51,51,1)',
                },
                fontSize: '11px'
            },
            isHighContrast: false,
        };
        /**
         * Demonstrates Power BI visualization elements and the way to embeed them in standalone web page.
         */
        var Playground = (function () {
            function Playground() {
            }
            // Performs sample app initialization.
            Playground.initialize = function () {
                this.populateVisualTypeSelect();
                // Wrapper function to simplify visuallization element creation when using jQuery
                $.fn.visual = function (plugin, dataView) {
                    // Step 1: Create new DOM element to represent Power BI visual
                    var element = $('<div/>');
                    element.addClass('visual');
                    element.css({
                        'background-color': 'white',
                        'padding': '10px',
                        'margin': '5px'
                    });
                    element['visible'] = function () {
                        return true;
                    };
                    this.append(element);
                    // Step 2: Instantiate Power BI visual
                    var host = $('#itemContainer');
                    var viewport = { height: host.height(), width: host.width() };
                    var visualElement = plugin.create();
                    visualElement.init({
                        element: element,
                        host: defaultVisualHostServices,
                        style: visualStyle,
                        viewport: viewport,
                        settings: { slicingEnabled: true },
                        interactivity: { isInteractiveLegend: false, selection: false },
                        animation: { transitionImmediate: true }
                    });
                    if (visualElement.update) {
                        visualElement.update({ dataViews: dataView, duration: 250, viewport: viewport });
                    }
                    else if (visualElement.onDataChanged) {
                        visualElement.onDataChanged({ dataViews: dataView });
                    }
                    return this;
                };
            };
            Playground.populateVisualTypeSelect = function () {
                var _this = this;
                var typeSelect = $('#visualTypes');
                typeSelect.append('<option value="">(none)</option>');
                var visuals = this.pluginService.getVisuals();
                for (var i = 0, len = visuals.length; i < len; i++) {
                    var visual = visuals[i];
                    typeSelect.append('<option value="' + visual.name + '">' + visual.name + '</option>');
                }
                typeSelect.change(function () { return _this.onVisualTypeSelection(typeSelect.val()); });
            };
            Playground.onVisualTypeSelection = function (plauginName) {
                $('#itemContainer').empty();
                var plugin = this.pluginService.getPlugin(plauginName);
                var sampleDataView = _visuals.sampleData.getVisualizationData(plauginName);
                $('#itemContainer').visual(plugin, sampleDataView);
            };
            // Represents sample data view used by visualization elements.
            Playground.pluginService = powerbi.visuals.visualPluginFactory.create();
            return Playground;
        })();
        _visuals.Playground = Playground;
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
//# sourceMappingURL=app.js.map
