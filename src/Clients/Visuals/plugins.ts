//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals.plugins {
    // This file registers the built-in visualizations

    export var animatedNumber: IVisualPlugin = {
        name: 'animatedNumber',
        capabilities: AnimatedNumber.capabilities,
        create: () => new AnimatedNumber()
    };

    export var areaChart: IVisualPlugin = {
        name: 'areaChart',
        watermarkKey: 'area',
        capabilities: lineChartCapabilities,
        create: () => new CartesianChart({ chartType: CartesianChartType.Area }),
        customizeQuery: LineChart.customizeQuery,
        getSortableRoles: (visualSortableOptions?: VisualSortableOptions) => ColumnChart.getSortableRoles(visualSortableOptions),
    };

    export var barChart: IVisualPlugin = {
        name: 'barChart',
        watermarkKey: 'bar',
        capabilities: getColumnChartCapabilities(true),
        create: () => new CartesianChart({ chartType: CartesianChartType.StackedBar }),
        customizeQuery: ColumnChart.customizeQuery,
        getSortableRoles: (visualSortableOptions?: VisualSortableOptions) => ColumnChart.getSortableRoles(visualSortableOptions),
    };

    export var bingNews: IVisualPlugin = {
        name: 'bingNews',
        capabilities: BingNews.capabilities,
        create: () => new BingNews()
    };

    export var card: IVisualPlugin = {
        name: 'card',
        watermarkKey: 'card',
        capabilities: Card.capabilities,
        create: () => new Card()
    };

    export var multiRowCard: IVisualPlugin = {
        name: 'multiRowCard',
        watermarkKey: 'card',
        capabilities: MultiRowCard.capabilities,
        create: () => new MultiRowCard()
    };

    export var clusteredBarChart: IVisualPlugin = {
        name: 'clusteredBarChart',
        watermarkKey: 'bar',
        capabilities: getColumnChartCapabilities(true),
        create: () => new CartesianChart({ chartType: CartesianChartType.ClusteredBar }),
        customizeQuery: ColumnChart.customizeQuery,
        getSortableRoles: (visualSortableOptions?: VisualSortableOptions) => ColumnChart.getSortableRoles(visualSortableOptions),
    };

    export var clusteredColumnChart: IVisualPlugin = {
        name: 'clusteredColumnChart',
        watermarkKey: 'column',
        capabilities: getColumnChartCapabilities(),
        create: () => new CartesianChart({ chartType: CartesianChartType.ClusteredColumn }),
        customizeQuery: ColumnChart.customizeQuery,
        getSortableRoles: (visualSortableOptions?: VisualSortableOptions) => ColumnChart.getSortableRoles(visualSortableOptions),
    };

    export var columnChart: IVisualPlugin = {
        name: 'columnChart',
        watermarkKey: 'column',
        capabilities: getColumnChartCapabilities(),
        create: () => new CartesianChart({ chartType: CartesianChartType.StackedColumn }),
        customizeQuery: ColumnChart.customizeQuery,
        getSortableRoles: (visualSortableOptions?: VisualSortableOptions) => ColumnChart.getSortableRoles(visualSortableOptions),
    };

    export var comboChart: IVisualPlugin = {
        name: 'comboChart',
        watermarkKey: 'combo',
        capabilities: ComboChart.capabilities,
        create: () => new CartesianChart({ chartType: CartesianChartType.ComboChart })
    };
    
    export var dataDotChart: IVisualPlugin = {
        name: 'dataDotChart',
        capabilities: DataDotChart.capabilities,
        create: () => new CartesianChart({ chartType: CartesianChartType.DataDot })
    };

    export var dataDotClusteredColumnComboChart: IVisualPlugin = {
        name: 'dataDotClusteredColumnComboChart',
        watermarkKey: 'combo',
        capabilities: ComboChart.capabilities,
        create: () => new CartesianChart({ chartType: CartesianChartType.DataDotClusteredColumnCombo })
    };

    export var dataDotStackedColumnComboChart: IVisualPlugin = {
        name: 'dataDotStackedColumnComboChart',
        watermarkKey: 'combo',
        capabilities: ComboChart.capabilities,
        create: () => new CartesianChart({ chartType: CartesianChartType.DataDotStackedColumnCombo })
    };

    export var donutChart: IVisualPlugin = {
        name: 'donutChart',
        watermarkKey: 'donut',
        capabilities: donutChartCapabilities,
        create: () => new DonutChart()
    };

    export var funnel: IVisualPlugin = {
        name: 'funnel',
        watermarkKey: 'funnel',
        capabilities: funnelChartCapabilities,
        create: () => new FunnelChart()
    };

    export var gauge: IVisualPlugin = {
        name: 'gauge',
        watermarkKey: 'gauge',
        capabilities: Gauge.capabilities,
        create: () => new Gauge()
    };

    export var hundredPercentStackedBarChart: IVisualPlugin = {
        name: 'hundredPercentStackedBarChart',
        watermarkKey: '100stackedbar',
        capabilities: getColumnChartCapabilities(true),
        create: () => new CartesianChart({ chartType: CartesianChartType.HundredPercentStackedBar }),
        customizeQuery: ColumnChart.customizeQuery,
        getSortableRoles: (visualSortableOptions?: VisualSortableOptions) => ColumnChart.getSortableRoles(visualSortableOptions),
    };

    export var hundredPercentStackedColumnChart: IVisualPlugin = {
        name: 'hundredPercentStackedColumnChart',
        watermarkKey: '100stackedcolumn',
        capabilities: getColumnChartCapabilities(),
        create: () => new CartesianChart({ chartType: CartesianChartType.HundredPercentStackedColumn }),
        customizeQuery: ColumnChart.customizeQuery,
        getSortableRoles: (visualSortableOptions?: VisualSortableOptions) => ColumnChart.getSortableRoles(visualSortableOptions),
    };

    export var image: IVisualPlugin = {
        name: 'image',
        capabilities: ImageVisual.capabilities,
        create: () => new ImageVisual()
    };

    export var lineChart: IVisualPlugin = {
        name: 'lineChart',
        watermarkKey: 'line',
        capabilities: lineChartCapabilities,
        create: () => new CartesianChart({ chartType: CartesianChartType.Line }),
        customizeQuery: LineChart.customizeQuery,
        getSortableRoles: (visualSortableOptions?: VisualSortableOptions) => LineChart.getSortableRoles(visualSortableOptions),
    };

    export var lineStackedColumnComboChart: IVisualPlugin = {
        name: 'lineStackedColumnComboChart',
        watermarkKey: 'combo',
        capabilities: ComboChart.capabilities,
        create: () => new CartesianChart({ chartType: CartesianChartType.LineStackedColumnCombo }),
        getSortableRoles: (visualSortableOptions?: VisualSortableOptions) => ColumnChart.getSortableRoles(visualSortableOptions),
    };

    export var lineClusteredColumnComboChart: IVisualPlugin = {
        name: 'lineClusteredColumnComboChart',
        watermarkKey: 'combo',
        capabilities: ComboChart.capabilities,
        create: () => new CartesianChart({ chartType: CartesianChartType.LineClusteredColumnCombo }),
        getSortableRoles: (visualSortableOptions?: VisualSortableOptions) => ColumnChart.getSortableRoles(visualSortableOptions),
    };

    export var map: IVisualPlugin = {
        name: 'map',
        watermarkKey: 'map',
        capabilities: mapCapabilities,
        create: () => new Map({ filledMap: false })
    };

    export var filledMap: IVisualPlugin = {
        name: 'filledMap',
        watermarkKey: 'map',
        capabilities: filledMapCapabilities,
        create: () => new Map({ filledMap: true })
    };

    export var heatMap: IVisualPlugin = {
        name: 'heatMap',
        capabilities: mapCapabilities,
        // Have the client currently show HeatMap as Map
        create: () => new Map({ filledMap: false })
    };

    export var treemap: IVisualPlugin = {
        name: 'treemap',
        watermarkKey: 'tree',
        capabilities: treemapCapabilities,
        create: () => new Treemap()
    };

    export var partitionMap: IVisualPlugin = {
        name: 'partitionMap',
        capabilities: PartitionMap.capabilities,
        create: () => new PartitionMap()
    };

    export var pieChart: IVisualPlugin = {
        name: 'pieChart',
        watermarkKey: 'pie',
        capabilities: donutChartCapabilities,
        create: () => new DonutChart({ sliceWidthRatio: 0 })
    };

    export var sunburstChart: IVisualPlugin = {
        name: 'sunburstChart',
        capabilities: SunburstChart.capabilities,
        create: () => new SunburstChart()
    };

    export var scatterChart: IVisualPlugin = {
        name: 'scatterChart',
        watermarkKey: 'scatterplot',
        capabilities: scatterChartCapabilities,
        create: () => new CartesianChart({ chartType: CartesianChartType.Scatter })
    };

    export var table: IVisualPlugin = {
        name: 'table',
        watermarkKey: 'table',
        capabilities: Table.capabilities,
        create: () => new Table(),
        getSortableRoles: (visualSortableOptions?: VisualSortableOptions) => Table.getSortableRoles(),
    };

    export var newTable: IVisualPlugin = {
        name: 'newTable',
        capabilities: TableNew.capabilities,
        create: () => new TableNew(),
        customizeQuery: TableNew.customizeQuery,
        getSortableRoles: (visualSortableOptions?: VisualSortableOptions) => TableNew.getSortableRoles(),
    };

    export var matrix: IVisualPlugin = {
        name: 'matrix',
        watermarkKey: 'matrix',
        capabilities: Matrix.capabilities,
        create: () => new Matrix(),
        customizeQuery: Matrix.customizeQuery,
        getSortableRoles: (visualSortableOptions?: VisualSortableOptions) => Matrix.getSortableRoles(),
    };

    export var slicer: IVisualPlugin = {
        name: 'slicer',
        capabilities: slicerCapabilities,
        create: () => new Slicer()
    };

    export var webChart: IVisualPlugin = {
        name: 'webChart',
        capabilities: WebChart.capabilities,
        create: () => new WebChart()
    };

    export var textbox: IVisualPlugin = {
        name: 'textbox',
        capabilities: Textbox.capabilities,
        create: () => new Textbox()
    };

    export var waterfallChart: IVisualPlugin = {
        name: 'waterfallChart',
        watermarkKey: 'waterfall',
        capabilities: waterfallChartCapabilities,
        create: () => new CartesianChart({ chartType: CartesianChartType.Waterfall })
    };
}
