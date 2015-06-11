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

module powerbi.visuals.sampleData {

    import DataViewTransform = powerbi.data.DataViewTransform;
    import DataShapeUtility = powerbi.data.dsr.DataShapeUtility;
    import SemanticType = powerbi.data.SemanticType;

    // predefined data views for different Powre BI visualization elements
    var dataViewForVisual = {
        'default': [createDefaultDataView()],
        'gauge': [createGaugeDataView()],
        'table': [createTableDataView()],
        'matrix': [createMatrixThreeMeasuresThreeRowGroupsDataView()],
        'image': [createImageDataView()],
        'treemap': [createTreeMapDataView()],
        'textbox': [createTextBoxDataView()],
        'cheerMeter': [createCheerMeterDataView()],
        'comboChart': createComboChart(),
        'dataDotClusteredColumnComboChart': createComboChart(),
        'dataDotStackedColumnComboChart': createComboChart(),
        'lineStackedColumnComboChart': createComboChart(),
        'lineClusteredColumnComboChart': createComboChart(),
        
    }

    /**
     * Returns sample data view for a visualization element specified.
     */
    export function getVisualizationData(pluginName: string): DataView[] {

        
        if (pluginName in dataViewForVisual) {
            return dataViewForVisual[pluginName];
        }

        return dataViewForVisual.default;
    }

    function createDefaultDataView(): DataView {

        var fieldExpr = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: "table1", column: "country" });

        var categoryValues = ["Australia", "Canada", "France", "Germany", "United Kingdom", "United States"];
        var categoryIdentities = categoryValues.map(function (value) {
            var expr = powerbi.data.SQExprBuilder.equal(fieldExpr, powerbi.data.SQExprBuilder.text(value));
            return powerbi.data.createDataViewScopeIdentity(expr);
        });

        // Metadata, describes the data columns, and provides the visual with hints
        // so it can decide how to best represent the data
        var dataViewMetadata: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'Country',
                    queryName: 'Country',
                    type: powerbi.ValueType.fromDescriptor({ text: true })
                },
                {
                    displayName: 'Sales Amount (2014)',
                    isMeasure: true,
                    format: "$0,000.00",
                    queryName: 'sales1',
                    type: powerbi.ValueType.fromDescriptor({ numeric: true }),
                    objects: { dataPoint: { fill: { solid: { color: 'purple' } } } },
                },
                {
                    displayName: 'Sales Amount (2015)',
                    isMeasure: true,
                    format: "$0,000.00",
                    queryName: 'sales2',
                    type: powerbi.ValueType.fromDescriptor({ numeric: true })
                }
            ]
        };

        var columns = [
            {
                source: dataViewMetadata.columns[1],
                // Sales Amount for 2014
                values: [742731.43, 162066.43, 283085.78, 300263.49, 376074.57, 814724.34],
            },
            {
                source: dataViewMetadata.columns[2],
                // Sales Amount for 2015
                values: [123455.43, 40566.43, 200457.78, 5000.49, 320000.57, 450000.34],
            }
        ];

        var dataValues: DataViewValueColumns = DataViewTransform.createValueColumns(columns);
        var tableDataValues = categoryValues.map(function (countryName, idx) {
            return [countryName, columns[0].values[idx], columns[1].values[idx]];
        });

        return {
            metadata: dataViewMetadata,
            categorical: {
                categories: [{
                    source: dataViewMetadata.columns[0],
                    values: categoryValues,
                    identity: categoryIdentities,
                }],
                values: dataValues
            },
            table: {
                rows: tableDataValues,
                columns: dataViewMetadata.columns,
            },
            single: { value: 559.43 }
        };
    }

    function createGaugeDataView(): DataView {
        var gaugeDataViewMetadata: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    roles: { 'Y': true },
                    isMeasure: true,
                    objects: { general: { formatString: '$0' } },
                }, {
                    displayName: 'col2',
                    roles: { 'MinValue': true },
                    isMeasure: true
                }, {
                    displayName: 'col3',
                    roles: { 'MaxValue': true },
                    isMeasure: true
                }, {
                    displayName: 'col4',
                    roles: { 'TargetValue': true },
                    isMeasure: true
                }],
            groups: [],
            measures: [0],
        };

        return {
            metadata: gaugeDataViewMetadata,
            single: { value: 500 },
            categorical: {
                values: DataViewTransform.createValueColumns([
                    {
                        source: gaugeDataViewMetadata.columns[0],
                        values: [500],
                    }, {
                        source: gaugeDataViewMetadata.columns[1],
                        values: [0],
                    }, {
                        source: gaugeDataViewMetadata.columns[2],
                        values: [300],
                    }, {
                        source: gaugeDataViewMetadata.columns[3],
                        values: [200],
                    }])
            }
        };
    }

    function createImageDataView(): DataView {
        var imageBase64value = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAkFBMVEX////+/v78+/vz8e/29PLr5+Tw7etwWEdbPyzTy8Tj3trn4t78+/mTgHOsnZLCt69PMRzX0cvJwLmllYm1qJ53YE8zEQBsUj9QMR68sKZHKRREJA+aiHx+aViGcF7q5t6NeWpkSDafjoAvCwA4FgC4rKSnmJE+HAaKdWhVOCeHeG1TPi5jT0BxX1J5aFtlSznQd83pAAACIklEQVQYGZXBiVraQBiG0ff7s8BMQsJkEaNsalspXbj/u2us1Scg7TM9B64R/0X8H6FMxBPu53ePiCS6bz/qkljCfatK4hnHIxjRjPURiWjCf69AIpYIP44eRCxRdj/bBBFLkHZHh4glQbYOiGgykgoRT2QDIprIhxwRr3AJ8VTuChDvJPFPZQrijQyQuE6vTC94IUiLHMRHMnFGQmSHu+f7vkBckIDcN0PXfR7qJmR5Caj4+mnR1LN5InFGENrDYVHVLviiKIJzIWQp65uG0anCmBKu7ytvTCjNdmVwmJWqDogJEU4NIzPTG0YlCEzdAjFhDPOMP/QbryTAWFcYE4L262lfucx4l7jq0CFAtvGICeGTpN6v5svl/DTrN5t+9rB8/vR0WyMw6kfElHiYMUp8XS22/Wx1WvWbRRXESOT7RGJKrOYmE5cEIm094oxY32cISTaSkMxMYpQOHnHOcDcO443Eu9TliAtSulxjXFHuSsQHxn4ucYVAfCT8vZOIV3KYYUSznfLlgBFHZBk0S09JFOEzjM8PASQuyMQFEQpkNLPOQBITxjVJjWTkj4s6Y0oi/eIQ54QbwAzyuhtclpa8kAT17VODuCCaKgczIE2LXSnJDAj9022D+ECExy5jJEbiRVr3N3ePCeIKoXq/HnzKq9R3m+XzvMpBXCWQa7f9ZrvdbvrV/O521gbAxN+IURKGqm3brvElIxP/ImNCJi78AkZVGOZlPDldAAAAAElFTkSuQmCC';

        return {
            metadata: {
                columns: [],
                objects: { general: { imageUrl: imageBase64value } }
            }
        };
    }

    function createTableDataView(): DataView {

        var dataTypeNumber = DataShapeUtility.describeDataType(SemanticType.Number);
        var dataTypeString = DataShapeUtility.describeDataType(SemanticType.String);
        var dataTypeWebUrl = DataShapeUtility.describeDataType(SemanticType.String, 'WebUrl');


        var groupSource1: DataViewMetadataColumn = { displayName: 'group1', type: dataTypeString, index: 0 };
        var groupSource2: DataViewMetadataColumn = { displayName: 'group2', type: dataTypeString, index: 1 };
        var groupSource3: DataViewMetadataColumn = { displayName: 'group3', type: dataTypeString, index: 2 };
        var groupSourceWebUrl: DataViewMetadataColumn = { displayName: 'groupWebUrl', type: dataTypeWebUrl, index: 0 };

        var measureSource1: DataViewMetadataColumn = { displayName: 'measure1', type: dataTypeNumber, isMeasure: true, index: 3, objects: { general: { formatString: '#.0' } } };
        var measureSource2: DataViewMetadataColumn = { displayName: 'measure2', type: dataTypeNumber, isMeasure: true, index: 4, objects: { general: { formatString: '#.00' } } };
        var measureSource3: DataViewMetadataColumn = { displayName: 'measure3', type: dataTypeNumber, isMeasure: true, index: 5, objects: { general: { formatString: '#' } } };

        return {
            metadata: { columns: [groupSource1, measureSource1, groupSource2, measureSource2, groupSource3, measureSource3] },
            table: {
                columns: [groupSource1, measureSource1, groupSource2, measureSource2, groupSource3, measureSource3],
                rows: [
                    ['A', 100, 'aa', 101, 'aa1', 102],
                    ['A', 103, 'aa', 104, 'aa2', 105],
                    ['A', 106, 'ab', 107, 'ab1', 108],
                    ['B', 109, 'ba', 110, 'ba1', 111],
                    ['B', 112, 'bb', 113, 'bb1', 114],
                    ['B', 115, 'bb', 116, 'bb2', 117],
                    ['C', 118, 'cc', 119, 'cc1', 120],
                ]
            }
        };
    }

    function createMatrixThreeMeasuresThreeRowGroupsDataView(): DataView{

        var dataTypeNumber = DataShapeUtility.describeDataType(SemanticType.Number);
        var dataTypeString = DataShapeUtility.describeDataType(SemanticType.String);
        var dataTypeWebUrl = DataShapeUtility.describeDataType(SemanticType.String, 'WebUrl');

        var measureSource1: DataViewMetadataColumn = { displayName: 'measure1', type: dataTypeNumber, isMeasure: true, index: 3, objects: { general: { formatString: '#.0' } } };
        var measureSource2: DataViewMetadataColumn = { displayName: 'measure2', type: dataTypeNumber, isMeasure: true, index: 4, objects: { general: { formatString: '#.00' } } };
        var measureSource3: DataViewMetadataColumn = { displayName: 'measure3', type: dataTypeNumber, isMeasure: true, index: 5, objects: { general: { formatString: '#' } } };

        var rowGroupSource1: DataViewMetadataColumn = { displayName: 'RowGroup1', queryName: 'RowGroup1', type: dataTypeString, index: 0 };
        var rowGroupSource2: DataViewMetadataColumn = { displayName: 'RowGroup2', queryName: 'RowGroup2', type: dataTypeString, index: 1 };
        var rowGroupSource3: DataViewMetadataColumn = { displayName: 'RowGroup3', queryName: 'RowGroup3', type: dataTypeString, index: 2 };

        var matrixThreeMeasuresThreeRowGroups: DataViewMatrix = {
            rows: {
                root: {
                    children: [
                        {
                            level: 0,
                            value: 'North America',
                            children: [
                                {
                                    level: 1,
                                    value: 'Canada',
                                    children: [
                                        {
                                            level: 2,
                                            value: 'Ontario',
                                            values: {
                                                0: { value: 1000 },
                                                1: { value: 1001, valueSourceIndex: 1 },
                                                2: { value: 1002, valueSourceIndex: 2 }
                                            }
                                        },
                                        {
                                            level: 2,
                                            value: 'Quebec',
                                            values: {
                                                0: { value: 1010 },
                                                1: { value: 1011, valueSourceIndex: 1 },
                                                2: { value: 1012, valueSourceIndex: 2 }
                                            }
                                        }
                                    ]
                                },
                                {
                                    level: 1,
                                    value: 'USA',
                                    children: [
                                        {
                                            level: 2,
                                            value: 'Washington',
                                            values: {
                                                0: { value: 1100 },
                                                1: { value: 1101, valueSourceIndex: 1 },
                                                2: { value: 1102, valueSourceIndex: 2 }
                                            }
                                        },
                                        {
                                            level: 2,
                                            value: 'Oregon',
                                            values: {
                                                0: { value: 1110 },
                                                1: { value: 1111, valueSourceIndex: 1 },
                                                2: { value: 1112, valueSourceIndex: 2 }
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            level: 0,
                            value: 'South America',
                            children: [
                                {
                                    level: 1,
                                    value: 'Brazil',
                                    children: [
                                        {
                                            level: 2,
                                            value: 'Amazonas',
                                            values: {
                                                0: { value: 2000 },
                                                1: { value: 2001, valueSourceIndex: 1 },
                                                2: { value: 2002, valueSourceIndex: 2 }
                                            }
                                        },
                                        {
                                            level: 2,
                                            value: 'Mato Grosso',
                                            values: {
                                                0: { value: 2010 },
                                                1: { value: 2011, valueSourceIndex: 1 },
                                                2: { value: 2012, valueSourceIndex: 2 }
                                            }
                                        }
                                    ]
                                },
                                {
                                    level: 1,
                                    value: 'Chile',
                                    children: [
                                        {
                                            level: 2,
                                            value: 'Arica',
                                            values: {
                                                0: { value: 2100 },
                                                1: { value: 2101, valueSourceIndex: 1 },
                                                2: { value: 2102, valueSourceIndex: 2 }
                                            }
                                        },
                                        {
                                            level: 2,
                                            value: 'Parinacota',
                                            values: {
                                                0: { value: 2110 },
                                                1: { value: 2111, valueSourceIndex: 1 },
                                                2: { value: 2112, valueSourceIndex: 2 }
                                            }
                                        }
                                    ]
                                }
                            ]
                        },

                    ]
                },
                levels: [
                    { sources: [rowGroupSource1] },
                    { sources: [rowGroupSource2] },
                    { sources: [rowGroupSource3] }
                ]
            },
            columns: {
                root: {
                    children: [
                        { level: 0 },
                        { level: 0, levelSourceIndex: 1 },
                        { level: 0, levelSourceIndex: 2 }
                    ]
                },
                levels: [{
                    sources: [
                        measureSource1,
                        measureSource2,
                        measureSource3
                    ]
                }]
            },
            valueSources: [
                measureSource1,
                measureSource2,
                measureSource3
            ]
        };

        return {
            metadata: { columns: [rowGroupSource1, rowGroupSource2, rowGroupSource3], segment: {} },
            matrix: matrixThreeMeasuresThreeRowGroups
        };
    }

    function createTreeMapDataView(): DataView {
        var treeMapMetadata: powerbi.DataViewMetadata = {
            columns: [
                { displayName: 'EventCount', queryName: 'select1', isMeasure: true, properties: { "Y": true }, type: DataShapeUtility.describeDataType(SemanticType.Number) },
                { displayName: 'MedalCount', queryName: 'select2', isMeasure: true, properties: { "Y": true }, type: DataShapeUtility.describeDataType(SemanticType.Number) }
            ]
        };

        return {
            metadata: treeMapMetadata,
            categorical: {
                values: DataViewTransform.createValueColumns([
                    {
                        source: treeMapMetadata.columns[0],
                        values: [110]
                    }, {
                        source: treeMapMetadata.columns[1],
                        values: [210]
                    }])
            }
        };
    }

    function createTextBoxDataView(): DataView {

        var textBoxcontent: TextboxDataViewObject = {
            paragraphs: [{
                horizontalTextAlignment: "center",
                textRuns: [{
                    value: "Example Text",
                    textStyle: {
                        fontFamily: "Heading",
                        fontSize: "24px",
                        textDecoration: "underline",
                        fontWeight: "300",
                        fontStyle: "italic",
                        float: "left"
                    }
                }]
            }]
        };

        return {
            metadata: {
                columns: [],
                objects: { general: textBoxcontent },
            }
        };
    }

    function createCheerMeterDataView(): DataView {

        var fieldExpr = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: "table1", column: "teams" });

        var categoryValues = ["Seahawks", "49ers"];
        var categoryIdentities = categoryValues.map(function (value) {
            var expr = powerbi.data.SQExprBuilder.equal(fieldExpr, powerbi.data.SQExprBuilder.text(value));
            return powerbi.data.createDataViewScopeIdentity(expr);
        });

        var dataViewMetadata: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'Team',
                    queryName: 'Team',
                    type: powerbi.ValueType.fromDescriptor({ text: true })
                },
                {
                    displayName: 'Volume',
                    isMeasure: true,
                    queryName: 'volume1',
                    type: powerbi.ValueType.fromDescriptor({ numeric: true }),
                },
            ]
        };
        var columns = [
            {
                source: dataViewMetadata.columns[1],
                values: [90, 30],
            },
        ];

        var dataValues: DataViewValueColumns = DataViewTransform.createValueColumns(columns);

        return {
            metadata: dataViewMetadata,
            categorical: {
                categories: [{
                    source: dataViewMetadata.columns[0],
                    values: categoryValues,
                    identity: categoryIdentities,
                    objects: [
                        {
                            dataPoint: {
                                fill: {
                                    solid: {
                                        color: 'rgb(165, 172, 175)'
                                    }
                                }
                            }
                        },
                        {
                            dataPoint: {
                                fill: {
                                    solid: {
                                        color: 'rgb(175, 30, 44)'
                                    }
                                }
                            }
                        },
                    ]
                }],
                values: dataValues,
            },
        };
    }

    function createComboChart(): DataView[] {
       
        var dataView = createDefaultDataView();

        return  [dataView, dataView] ;
    }
  
 
}
