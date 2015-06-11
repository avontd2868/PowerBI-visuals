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
    export interface ComboChartDataViewObjects extends DataViewObjects {
        general: ComboChartDataViewObject;
    }

    export interface ComboChartDataViewObject extends DataViewObject {
        visualType1: string;
        visualType2: string;
    }

    /** This module only supplies the capabilities for comboCharts.
     * Implementation is in cartesianChart and the various ICartesianVisual implementations.
     */
    export module ComboChart {
        export var capabilities: VisualCapabilities = {
            dataRoles: [
                {
                    name: 'Category',
                    kind: VisualDataRoleKind.Grouping,
                    displayName: data.createDisplayNameGetter('Role_ComboChart_Category'),
                }, {
                    name: 'Series',
                    kind: VisualDataRoleKind.Grouping,
                    displayName: data.createDisplayNameGetter('Role_ComboChart_Series'),
                }, {
                    name: 'Y',
                    kind: VisualDataRoleKind.Measure,
                    displayName: data.createDisplayNameGetter('Role_ComboChart_Y'),
                }, {
                    name: 'Y2',
                    kind: VisualDataRoleKind.Measure,
                    displayName: data.createDisplayNameGetter('Role_ComboChart_Y2'),
                },
            ],
            objects: {
                general: {
                    properties: {
                        formatString: {
                            type: { formatting: { formatString: true } },
                        },
                        visualType1: {
                            type: { text: true }
                        },
                        visualType2: {
                            type: { text: true }
                        },
                    },
                },
                categoryAxis: {
                    displayName: data.createDisplayNameGetter('Visual_XAxis'),
                    properties: {
                        show: {
                            displayName: data.createDisplayNameGetter('Visual_Show'),
                            type: { bool: true }
                        },
                        start: {
                            displayName: data.createDisplayNameGetter('Visual_Axis_Start'),
                            type: { numeric: true }
                        },
                        end: {
                            displayName: data.createDisplayNameGetter('Visual_Axis_End'),
                            type: { numeric: true }
                        },
                        axisType: {
                            displayName: data.createDisplayNameGetter('Visual_Axis_Type'),
                            type: { formatting: { axisType: true } }
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
                        secShow: {
                            displayName: data.createDisplayNameGetter('Visual_YAxis_ShowSecondery'),
                            type: { bool: true }
                        },
                        // TODO: 5005022 use property categories to organize Y & secondary Y properties.
                        axisLabel: {
                            displayName: data.createDisplayNameGetter('Visual_YAxis_ColumnTitle'),
                            type: { none: true }
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
                        },
                        secAxisLabel: {
                            displayName: data.createDisplayNameGetter('Visual_YAxis_LineTitle'),
                            type: { none: true }
                        },
                        secPosition: {
                            displayName: data.createDisplayNameGetter('Visual_YAxis_Position'),
                            type: { formatting: { yAxisPosition: true } }
                        },
                        secStart: {
                            displayName: data.createDisplayNameGetter('Visual_Axis_Start'),
                            type: { numeric: true }
                        },
                        secEnd: {
                            displayName: data.createDisplayNameGetter('Visual_Axis_End'),
                            type: { numeric: true }
                        },
                        secShowAxisTitle: {
                            displayName: data.createDisplayNameGetter('Visual_Axis_Title'),
                            type: { bool: true }
                        },
                        secAxisStyle: {
                            displayName: data.createDisplayNameGetter('Visual_Axis_Style'),
                            type: { formatting: { axisStyle: true } }
                        }
                    }
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
                dataPoint: {
                    displayName: data.createDisplayNameGetter('Visual_DataPoint'),
                    properties: {
                        defaultColor: {
                            displayName: data.createDisplayNameGetter('Visual_DefaultColor'),
                            type: { fill: { solid: { color: true } } }
                        },
                        showAllDataPoints: {
                            displayName: data.createDisplayNameGetter('Visual_DataPoint_Show_All'),
                            type: { bool: true }
                        },
                        fill: {
                            displayName: data.createDisplayNameGetter('Visual_Fill'),
                            type: { fill: { solid: { color: true } } }
                        },
                        fillRule: {
                            displayName: data.createDisplayNameGetter('Visual_Gradient'),
                            type: { fillRule: {} },
                            rule: {
                                inputRole: 'Gradient',
                                output: {
                                    property: 'fill',
                                    selector: ['Category'],
                                },
                            },
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
                    },
                },
            },
            dataViewMappings: [
                {
                    conditions: [
                        { 'Category': { max: 1 }, 'Series': { max: 0 } },
                        { 'Category': { max: 1 }, 'Series': { min: 1, max: 1 }, 'Y': { max: 1 } },
                    ],
                    categorical: {
                        categories: {
                            for: { in: 'Category' },
                            dataReductionAlgorithm: { top: {} }
                        },
                        values: {
                            group: {
                                by: 'Series',
                                select: [
                                    { for: { in: 'Y' } }
                                ],
                                dataReductionAlgorithm: { top: {} }
                            }
                        },
                        rowCount: { preferred: { min: 2 }, supported: { min: 0 } }
                    }
                }, {
                    conditions: [
                        { 'Category': { max: 1 }, 'Y2': { min: 1 } }
                    ],
                    categorical: {
                        categories: {
                            for: { in: 'Category' },
                            dataReductionAlgorithm: { top: {} }
                        },
                        values: {
                            select: [
                                { for: { in: 'Y2' } }
                            ],
                            dataReductionAlgorithm: { top: {} }
                        },
                        rowCount: { preferred: { min: 2 }, supported: { min: 0 } }
                    },
                }
            ],
            supportsHighlight: true,
            sorting: {
                custom: {},
            },
        };
    }

    export var comboChartProps = {
        general: {
            formatString: <DataViewObjectPropertyIdentifier>{ objectName: 'general', propertyName: 'formatString' },
        },
    };
}
