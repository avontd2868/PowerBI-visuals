//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    export interface IVisualPluginService {
        getPlugin(type: string): IVisualPlugin;
        getVisuals(): IVisualPlugin[];
        capabilities(type: string): VisualCapabilities;
    }

    export interface MinervaVisualFeatureSwitches {
        newTable: boolean;
        heatMap: boolean;
        dataDotChartEnabled?: boolean;  //This feature switch enables the data-dot & column combo charts
        richTextboxEnabled?: boolean;
        devToolsEnabled?: boolean; // To show or not the custom visualizations created
    }

    export interface SmallViewPortProperties {
        cartesianSmallViewPortProperties: CartesianSmallViewPortProperties;
        gaugeSmallViewPortProperties: GaugeSmallViewPortProperties;
    }

    export module visualPluginFactory {
        export class VisualPluginService implements IVisualPluginService {
            private _plugins: jsCommon.IStringDictionary<IVisualPlugin>

            public constructor() {
                this._plugins = <any>powerbi.visuals.plugins;
            }

            /** Gets metadata for all registered. */
            public getVisuals(): IVisualPlugin[] {
                var registry = this._plugins,
                    names: string[] = Object.keys(registry);

                return names.map(name => registry[name]);
            }

            public getPlugin(type: string): IVisualPlugin {
                if (!type) {
                    return;
                }

                var plugin: IVisualPlugin = this._plugins[type];
                if (!plugin) {
                    return;
                }

                return plugin;
            }

            public capabilities(type: string): VisualCapabilities {
                var plugin = this.getPlugin(type);
                if (plugin)
                    return plugin.capabilities;
            }
        }

        function createPlugin(visualPlugins: jsCommon.IStringDictionary<IVisualPlugin>, base: IVisualPlugin, create: IVisualFactoryMethod): void {
            var visualPlugin = Prototype.inherit(base);
            visualPlugin.create = create;
            visualPlugins[base.name] = visualPlugin;
        }

        export class MinervaVisualPluginService extends VisualPluginService {
            private featureSwitches: MinervaVisualFeatureSwitches;
            private visualPlugins: jsCommon.IStringDictionary<IVisualPlugin>;

            public constructor(featureSwitches: MinervaVisualFeatureSwitches) {
                super();

                debug.assertValue(featureSwitches, 'featureSwitches');
                this.featureSwitches = featureSwitches;

                this.visualPlugins = {};
                
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.barChart,() => new CartesianChart({ chartType: CartesianChartType.StackedBar, isScrollable: true, animator: new WebColumnChartAnimator() }));
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.card,() => new Card({ isScrollable: true }));
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.clusteredBarChart,() => new CartesianChart({ chartType: CartesianChartType.ClusteredBar, isScrollable: true, animator: new WebColumnChartAnimator() }));
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.clusteredColumnChart,() => new CartesianChart({ chartType: CartesianChartType.ClusteredColumn, isScrollable: true, animator: new WebColumnChartAnimator() }));
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.columnChart,() => new CartesianChart({ chartType: CartesianChartType.StackedColumn, isScrollable: true, animator: new WebColumnChartAnimator() }));
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.dataDotClusteredColumnComboChart,() => new CartesianChart({ chartType: CartesianChartType.DataDotClusteredColumnCombo, isScrollable: true, animator: new WebColumnChartAnimator() }));
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.dataDotStackedColumnComboChart,() => new CartesianChart({ chartType: CartesianChartType.DataDotStackedColumnCombo, isScrollable: true, animator: new WebColumnChartAnimator() }));
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.donutChart,() => new DonutChart({ slicingEnabled: true, animator: new WebDonutChartAnimator(), isScrollable: true }));
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.funnel,() => new FunnelChart({ animator: new WebFunnelAnimator() }));
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.hundredPercentStackedBarChart,() => new CartesianChart({ chartType: CartesianChartType.HundredPercentStackedBar, isScrollable: true, animator: new WebColumnChartAnimator() }));
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.hundredPercentStackedColumnChart,() => new CartesianChart({ chartType: CartesianChartType.HundredPercentStackedColumn, isScrollable: true, animator: new WebColumnChartAnimator() }));
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.lineChart,() => new CartesianChart({ chartType: CartesianChartType.Line, isScrollable: true, animator: new NullAnimator() }));
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.areaChart,() => new CartesianChart({ chartType: CartesianChartType.Area, isScrollable: true, animator: new NullAnimator() }));
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.lineClusteredColumnComboChart,() => new CartesianChart({ chartType: CartesianChartType.LineClusteredColumnCombo, isScrollable: true, animator: new WebColumnChartAnimator() }));
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.lineStackedColumnComboChart,() => new CartesianChart({ chartType: CartesianChartType.LineStackedColumnCombo, isScrollable: true, animator: new WebColumnChartAnimator() }));
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.pieChart,() => new DonutChart({ slicingEnabled: true, sliceWidthRatio: 0, animator: new WebDonutChartAnimator(), isScrollable: true }));
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.scatterChart,() => new CartesianChart({ chartType: CartesianChartType.Scatter, isScrollable: true, animator: new NullAnimator() }));
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.treemap,() => new Treemap({ animator: new WebTreemapAnimator, isScrollable: true }));
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.waterfallChart, () => new CartesianChart({ chartType: CartesianChartType.Waterfall, isScrollable: true }));

                if (featureSwitches.richTextboxEnabled)
                    createPlugin(this.visualPlugins, powerbi.visuals.plugins.textbox,() => new RichTextbox());
            }

            public getVisuals(): IVisualPlugin[] {
                // Current visual types that supports visual conversion. Please don't change the orders
                // CAUTION: If you are adding new visual types, please check if you need to update the height of
                // the visual convertion pane in visualization pane as well.
                var convertibleVisualTypes = [
                    powerbi.visuals.plugins.barChart,
                    powerbi.visuals.plugins.columnChart,
                    powerbi.visuals.plugins.clusteredBarChart,                    
                    powerbi.visuals.plugins.clusteredColumnChart,
                    powerbi.visuals.plugins.hundredPercentStackedBarChart,
                    powerbi.visuals.plugins.hundredPercentStackedColumnChart,
                    powerbi.visuals.plugins.lineChart,
                    powerbi.visuals.plugins.areaChart,
                    powerbi.visuals.plugins.lineStackedColumnComboChart,
                    powerbi.visuals.plugins.lineClusteredColumnComboChart,                    
                    powerbi.visuals.plugins.waterfallChart,
                    powerbi.visuals.plugins.scatterChart,
                    powerbi.visuals.plugins.pieChart,
                    powerbi.visuals.plugins.treemap,
                    powerbi.visuals.plugins.map,
                    powerbi.visuals.plugins.table,
                    powerbi.visuals.plugins.matrix,
                    powerbi.visuals.plugins.filledMap,
                    powerbi.visuals.plugins.funnel,
                    powerbi.visuals.plugins.gauge,
                    powerbi.visuals.plugins.multiRowCard,
                    powerbi.visuals.plugins.card,
                    powerbi.visuals.plugins.slicer,
                    powerbi.visuals.plugins.donutChart,
                ];     

                if (this.featureSwitches.devToolsEnabled) {
                    this.addCustomVisualizations(convertibleVisualTypes);
                }
               
                if (this.featureSwitches.dataDotChartEnabled) {
                    convertibleVisualTypes.push(powerbi.visuals.plugins.dataDotClusteredColumnComboChart);
                    convertibleVisualTypes.push(powerbi.visuals.plugins.dataDotStackedColumnComboChart);
                }             

                return convertibleVisualTypes;
            }

            private addCustomVisualizations(convertibleVisualTypes: IVisualPlugin[]): void {
                // Read new visual from localstorage
                var unparsedVisuals = localStorage.getItem('customVisualizations');
                if (unparsedVisuals) {
                    var customVisualizationList = JSON.parse(unparsedVisuals);
                    if (customVisualizationList) {
                        var len = customVisualizationList.length;
                        for (var i = 0; i < len; i++) {
                            var pluginName = customVisualizationList[i].pluginName;
                            var plugin = this.getPlugin(pluginName);
                            // If the browser session got restarted or its a new window the plugin wont be available, so we need to add it
                            if (!plugin) {
                                var jsCode = customVisualizationList[i].javaScriptCode;
                                var script = $("<script/>", {
                                    html: jsCode + '//# sourceURL=' + pluginName + '.js\n" + "' + '//# sourceMappingURL=' + pluginName + '.js.map'
                                });

                                script.attr('pluginName', pluginName);

                                $('body').append(script);

                                var style = $("<style/>", {
                                    html: customVisualizationList[i].cssCode
                                });

                                style.attr('pluginName', pluginName);

                                $('head').append(style);

                                plugin = this.getPlugin(pluginName);
                            }
                            convertibleVisualTypes.push(plugin);
                        }
                    }
                }
            }

            public getPlugin(type: string): IVisualPlugin {

                if (this.visualPlugins[type]) {
                    return this.visualPlugins[type];
                }

                // Always use the new table for Minerva
                if (type === plugins.table.name) {
                    return super.getPlugin(plugins.newTable.name);
                }

                return super.getPlugin(type);
                }
        }

        // This plug-in service is used when displaying visuals on the dashboard
        export class DashboardPluginService extends VisualPluginService {
            private featureSwitches: MinervaVisualFeatureSwitches;
            private visualPlugins: jsCommon.IStringDictionary<IVisualPlugin>;

            public constructor(featureSwitches: MinervaVisualFeatureSwitches) {
                super();

                debug.assertValue(featureSwitches, 'featureSwitches');
                this.featureSwitches = featureSwitches;

                this.visualPlugins = {};

                // Although there are no plug-in modifications here, this service allows different parameters such as feature switches to be passed for dashboard visuals.
            }

            public getPlugin(type: string): IVisualPlugin {

                if (this.visualPlugins[type]) {
                    return this.visualPlugins[type];
                }

                if (type === plugins.table.name && this.featureSwitches.newTable) {
                    return super.getPlugin(plugins.newTable.name);
                }

                return super.getPlugin(type);
            }
        }

        export class MobileVisualPluginService extends VisualPluginService {
            private visualPlugins: jsCommon.IStringDictionary<IVisualPlugin>;
            private smallViewPortProperties;
            public static MinHeightLegendVisible = 80;
            public static MinHeightAxesVisible = 80;
            public static MinHeightGaugeSideNumbersVisible = 80;
            public static GaugeMarginsOnSmallViewPort = 10;

            public constructor(smallViewPortProperties?: SmallViewPortProperties) {
                super();

                this.smallViewPortProperties = smallViewPortProperties || {
                    CartesianSmallViewPortProperties: {
                        hideAxesOnSmallViewPort: true,
                        hideLegendOnSmallViewPort: true,
                        MinHeightLegendVisible: MobileVisualPluginService.MinHeightLegendVisible,
                        MinHeightAxesVisible: MobileVisualPluginService.MinHeightAxesVisible,
                    },
                    GaugeSmallViewPortProperties: {
                        hideGaugeSideNumbersOnSmallViewPort: true,
                        smallGaugeMarginsOnSmallViewPort: true,
                        MinHeightGaugeSideNumbersVisible: MobileVisualPluginService.MinHeightGaugeSideNumbersVisible,
                        GaugeMarginsOnSmallViewPort: MobileVisualPluginService.GaugeMarginsOnSmallViewPort,
                    }
                };

                // Disable tooltips for mobile
                TooltipManager.ShowTooltips = false;

                this.visualPlugins = {};
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.lineChart,() => new CartesianChart({ chartType: CartesianChartType.Line, cartesianSmallViewPortProperties: this.smallViewPortProperties.CartesianSmallViewPortProperties }));
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.lineClusteredColumnComboChart,() => new CartesianChart({ chartType: CartesianChartType.LineClusteredColumnCombo, cartesianSmallViewPortProperties: this.smallViewPortProperties.CartesianSmallViewPortProperties }));
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.lineStackedColumnComboChart,() => new CartesianChart({ chartType: CartesianChartType.LineStackedColumnCombo, cartesianSmallViewPortProperties: this.smallViewPortProperties.CartesianSmallViewPortProperties }));
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.scatterChart,() => new CartesianChart({ chartType: CartesianChartType.Scatter, cartesianSmallViewPortProperties: this.smallViewPortProperties.CartesianSmallViewPortProperties }));
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.gauge,() => new Gauge({ chartType: Gauge, gaugeSmallViewPortProperties: this.smallViewPortProperties.GaugeSmallViewPortProperties }));
            }

            public getPlugin(type: string): IVisualPlugin {

                if (this.visualPlugins[type]) {
                    return this.visualPlugins[type];
                }
                return super.getPlugin(type);
            }
        }

        export function create(): IVisualPluginService {
            return new VisualPluginService();
        }

        export function createMinerva(featureSwitches: MinervaVisualFeatureSwitches): IVisualPluginService {
            return new MinervaVisualPluginService(featureSwitches);
        }

        export function createDashboard(featureSwitches: MinervaVisualFeatureSwitches): IVisualPluginService {
            return new DashboardPluginService(featureSwitches);
        }

        export function createMobile(smallViewPortProperties?: SmallViewPortProperties): IVisualPluginService {
            return new MobileVisualPluginService(smallViewPortProperties);
        }
    }
}