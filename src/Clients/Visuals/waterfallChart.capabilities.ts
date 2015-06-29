//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    export var waterfallChartCapabilities: VisualCapabilities = {
        dataRoles: [
            {
                name: 'Category',
                kind: VisualDataRoleKind.Grouping,
            }, {
                name: 'Y',
                kind: VisualDataRoleKind.Measure,
            }
        ],
        objects: {
            general: {
                displayName: data.createDisplayNameGetter('Visual_General'),
                properties: {
                    formatString: {
                        type: { formatting: { formatString: true } },
                    },
                },
            },
            legend: {
                displayName: data.createDisplayNameGetter('Visual_Legend'),
                properties: {
                    show: {
                        displayName: data.createDisplayNameGetter('Visual_Show'),
                        type: { bool: true }
                    },
                    position: {
                        displayName: data.createDisplayNameGetter('Visual_LegendPosition'),
                        type: { formatting: { legendPosition: true } }
                    },
                    showTitle: {
                        displayName: data.createDisplayNameGetter('Visual_LegendShowTitle'),
                        type: { bool: true }
                    },
                    titleText: {
                        displayName: data.createDisplayNameGetter('Visual_LegendTitleText'),
                        type: { text: true }
                    }
                }
            },
            labels: {
                displayName: data.createDisplayNameGetter('Visual_DataPointsLabels'),
                properties: {
                    show: {
                        displayName: data.createDisplayNameGetter('Visual_Show'),
                        type: { bool: true }
                    },
                    color: {
                        displayName: data.createDisplayNameGetter('Visual_LabelsFill'),
                        type: { fill: { solid: { color: true } } }
                    },
                    labelDisplayUnits: {
                        displayName: data.createDisplayNameGetter('Visual_DisplayUnits'),
                        type: { formatting: { labelDisplayUnits: true } }
                    },
                    labelPrecision: {
                        displayName: data.createDisplayNameGetter('Visual_Precision'),
                        type: { numeric: true }
                    },
                }
            },
            sentimentColors: {
                displayName: data.createDisplayNameGetter('Waterfall_SentimentColors'),
                properties: {
                    increaseFill: {
                        displayName: data.createDisplayNameGetter('Waterfall_IncreaseLabel'),
                        type: { fill: { solid: { color: true } } }
                    },
                    decreaseFill: {
                        displayName: data.createDisplayNameGetter('Waterfall_DecreaseLabel'),
                        type: { fill: { solid: { color: true } } }
                    },
                    totalFill: {
                        displayName: data.createDisplayNameGetter('Waterfall_TotalLabel'),
                        type: { fill: { solid: { color: true } } }
                    }
                },
            },
            categoryAxis: {
                displayName: data.createDisplayNameGetter('Visual_XAxis'),
                properties: {
                    show: {
                        displayName: data.createDisplayNameGetter('Visual_Show'),
                        type: { bool: true }
                    },
                    showAxisTitle: {
                        displayName: data.createDisplayNameGetter('Visual_Axis_Title'),
                        type: { bool: true }
                    },
                    axisStyle: {
                        displayName: data.createDisplayNameGetter('Visual_Axis_Style'),
                        type: { formatting: { axisStyle: true } }
                    }
                }
            },
            valueAxis: {
                displayName: data.createDisplayNameGetter('Visual_YAxis'),
                properties: {
                    show: {
                        displayName: data.createDisplayNameGetter('Visual_Show'),
                        type: { bool: true }
                    },
                    position: {
                        displayName: data.createDisplayNameGetter('Visual_YAxis_Position'),
                        type: { formatting: { yAxisPosition: true } }
                    },
                    start: {
                        displayName: data.createDisplayNameGetter('Visual_Axis_Start'),
                        type: { numeric: true }
                    },
                    end: {
                        displayName: data.createDisplayNameGetter('Visual_Axis_End'),
                        type: { numeric: true }
                    },
                    showAxisTitle: {
                        displayName: data.createDisplayNameGetter('Visual_Axis_Title'),
                        type: { bool: true }
                    },
                    axisStyle: {
                        displayName: data.createDisplayNameGetter('Visual_Axis_Style'),
                        type: { formatting: { axisStyle: true } }
                    }

                }
            },
        },
        dataViewMappings: [{
            conditions: [
                { 'Category': { max: 1 }, 'Y': { max: 1 } },
            ],
            categorical: {
                categories: {
                    for: { in: 'Category' }
                },
                values: {
                    select: [{ bind: { to: 'Y' } }]
                },
            },
        }],
    };

    export var waterfallChartProps = {
        sentimentColors: {
            increaseFill: <DataViewObjectPropertyIdentifier>{ objectName: 'sentimentColors', propertyName: 'increaseFill' },
            decreaseFill: <DataViewObjectPropertyIdentifier>{ objectName: 'sentimentColors', propertyName: 'decreaseFill' },
            totalFill: <DataViewObjectPropertyIdentifier>{ objectName: 'sentimentColors', propertyName: 'totalFill' },
        },
    };
}