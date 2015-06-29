//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
/* tslint:disable:no-unused-variable */
var visual;
var powerbi;
(function (powerbi) {
    var visuals;
    (function (_visuals) {
        var runner;
        (function (runner) {
            var DataViewTransform = powerbi.data.DataViewTransform;
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
            var VisualsRunner = (function () {
                function VisualsRunner() {
                    this.rootSelector = '#itemContainer';
                    //powerbi.SingleVisualHostServices.initialize();
                    this.hostServices = null; //powerbi.createVisualHostServices();
                }
                VisualsRunner.initialize = function () {
                };
                VisualsRunner.prototype.initDataSet = function () {
                    this.dataSet = {
                        config: {
                            "visual": {
                                "visual": "lineChart",
                                "queryMetadata": {
                                    "Select": [
                                        { "Restatement": "Date", "Type": 4, "Format": "d" },
                                        { "Restatement": "DailyUsers (Ext+MS)", "Type": 3, "Format": "g" },
                                        { "Restatement": "WeeklyUsers (Ext+MS)", "Type": 3, "Format": "g" },
                                        { "Restatement": "MonthlyUsers(Ext+MS)", "Type": 3, "Format": "g" }
                                    ]
                                },
                                "heading1": "DailyUsers (Ext+MS), WeeklyUsers (Ext+MS), MonthlyUsers(Ext+MS)",
                                "heading3": "by Date",
                                "elements": [
                                    {
                                        "DataRoles": [
                                            { "Name": "Category", "Projection": 0 },
                                            { "Name": "Y", "Projection": 1 },
                                            { "Name": "Y", "Projection": 2 },
                                            { "Name": "Y", "Projection": 3 }
                                        ]
                                    }
                                ]
                            }
                        },
                        data: "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"
                    };
                };
                VisualsRunner.prototype.startup = function () {
                    this.pluginService = powerbi.visuals.visualPluginFactory.create();
                    this.colorAllocatorFactory = powerbi.visuals.createColorAllocatorFactory();
                    this.rootElement = $(this.rootSelector);
                    this.width = this.rootElement.width() - 40;
                    this.height = Math.floor(this.width * 3 / 4);
                    this.populateVisualTypeSelect();
                    this.initDataSet();
                };
                VisualsRunner.prototype.populateVisualTypeSelect = function () {
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
                VisualsRunner.prototype.onVisualTypeSelection = function (value) {
                    var plugin = this.pluginService.getPlugin(value);
                    var dataProvider = new powerbi.data.dsr.DsrDataProvider({
                        promiseFactory: powerbi.createJQueryPromiseFactory
                    }, powerbi.data.dsr.createExecuteSemanticQueryProxyHttpCommunication(this.httpService)).transform(JSON.parse(jsCommon.GzipUtility.uncompress(this.dataSet.data)));
                    this.render(plugin, dataProvider);
                };
                VisualsRunner.prototype.clear = function () {
                    this.rootElement.empty();
                };
                VisualsRunner.prototype.createViz = function () {
                    var c = $('<div/>');
                    c.height(this.height);
                    c.width(this.width);
                    c.addClass('visual');
                    c.css({
                        'background-color': 'white',
                        'padding': '10px',
                        'margin': '5px'
                    });
                    this.rootElement.append(c);
                    return c;
                };
                VisualsRunner.prototype.getElement = function () {
                    this.clear();
                    return this.createViz();
                };
                VisualsRunner.prototype.render = function (plugin, dataProvider) {
                    var v = plugin.create();
                    v.init({
                        element: this.getElement(),
                        host: this.hostServices,
                        style: visualStyle,
                        viewport: {
                            height: this.height,
                            width: this.width
                        },
                        settings: { slicingEnabled: true },
                        interactivity: { isInteractiveLegend: false, selection: false },
                        animation: { transitionImmediate: true }
                    });
                    var transformActions = DataViewTransform.createTransformActions(this.dataSet.config.visual.queryMetadata, this.dataSet.config.visual.elements, plugin.capabilities.objects, null);
                    var dataViews = DataViewTransform.apply({
                        prototype: dataProvider.dataView,
                        objectDescriptors: plugin.capabilities.objects,
                        dataViewMappings: plugin.capabilities.dataViewMappings,
                        transforms: transformActions,
                        colorAllocatorFactory: this.colorAllocatorFactory
                    });
                    v.onDataChanged({ dataViews: dataViews });
                };
                return VisualsRunner;
            })();
            runner.VisualsRunner = VisualsRunner;
        })(runner = _visuals.runner || (_visuals.runner = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
//# sourceMappingURL=app.js.map