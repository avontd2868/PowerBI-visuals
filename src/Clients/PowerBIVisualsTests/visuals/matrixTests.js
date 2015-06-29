//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbitests;
(function (powerbitests) {
    var CompiledSubtotalType = powerbi.data.CompiledSubtotalType;
    var DataShapeUtility = powerbi.data.dsr.DataShapeUtility;
    var DataViewAnalysis = powerbi.DataViewAnalysis;
    var Matrix = powerbi.visuals.Matrix;
    var SemanticType = powerbi.data.SemanticType;
    var valueFormatter = powerbi.visuals.valueFormatter;
    var DefaultWaitForRender = 500;
    var dataTypeNumber = DataShapeUtility.describeDataType(1 /* Number */);
    var dataTypeString = DataShapeUtility.describeDataType(2048 /* String */);
    var dataTypeBoolean = DataShapeUtility.describeDataType(4096 /* Boolean */);
    var dataTypeWebUrl = DataShapeUtility.describeDataType(2048 /* String */, 'WebUrl');
    var rowGroupSource1 = { name: 'RowGroup1', type: dataTypeString, index: 0 };
    var rowGroupSource2 = { name: 'RowGroup2', type: dataTypeString, index: 1 };
    var rowGroupSource3 = { name: 'RowGroup3', type: dataTypeString, index: 2 };
    var rowGroupSource3formatted = { name: 'RowGroup3', type: dataTypeString, index: 2, objects: { general: { formatString: '0.0' } } };
    var rowGroupSource4 = { name: 'RowGroup4', type: dataTypeBoolean, index: 9 };
    var rowGroupSourceWebUrl = { name: 'RowGroupWebUrl', type: dataTypeWebUrl, index: 0 };
    var columnGroupSource1 = { name: 'ColGroup1', type: dataTypeString, index: 3 };
    var columnGroupSource2 = { name: 'ColGroup2', type: dataTypeString, index: 4 };
    var columnGroupSource3 = { name: 'ColGroup3', type: dataTypeString, index: 5 };
    var columnGroupSource3formatted = { name: 'ColGroup3', type: dataTypeString, index: 5, objects: { general: { formatString: '0.00' } } };
    var columnGroupSource4 = { name: 'ColGroup4', type: dataTypeBoolean, index: 10 };
    var columnGroupSourceWebUrl = { name: 'ColGroupWebUrl', type: dataTypeWebUrl, index: 0 };
    var measureSource1 = { name: 'Measure1', type: dataTypeNumber, isMeasure: true, index: 6 };
    var measureSource2 = { name: 'Measure2', type: dataTypeNumber, isMeasure: true, index: 7 };
    var measureSource3 = { name: 'Measure3', type: dataTypeNumber, isMeasure: true, index: 8 };
    // ------------
    // | Measure1 |
    // +----------|
    // |      100 |
    // ------------
    var matrixOneMeasure = {
        rows: {
            root: {
                children: [{
                    level: 0,
                    values: {
                        0: { value: 100 }
                    }
                }]
            },
            levels: []
        },
        columns: {
            root: {
                children: [{ level: 0 }]
            },
            levels: [{
                sources: [measureSource1]
            }]
        },
        valueSources: [measureSource1]
    };
    var matrixOneMeasureDataView = {
        metadata: { columns: [measureSource1] },
        matrix: matrixOneMeasure
    };
    // -----------
    // | Group A |
    // +---------|
    // |     100 |
    // -----------
    var matrixOneMeasureOneColumnGroupOneGroupInstance = {
        rows: {
            root: {
                children: [{
                    level: 0,
                    values: {
                        0: { value: 100 }
                    }
                }]
            },
            levels: []
        },
        columns: {
            root: {
                children: [
                    {
                        level: 0,
                        value: 'Group A'
                    }
                ]
            },
            levels: [{
                sources: [columnGroupSource1]
            }]
        },
        valueSources: [measureSource1]
    };
    var matrixOneMeasureOneColumnGroupOneGroupInstanceDataView = {
        metadata: { columns: [columnGroupSource1, measureSource1] },
        matrix: matrixOneMeasureOneColumnGroupOneGroupInstance
    };
    // ---------------------------
    // | http://www.validurl.com |
    // +-------------------------|
    // |     100                 |
    // ---------------------------
    var matrixOneMeasureOneColumnGroupWithUrlOneGroupInstance = {
        rows: {
            root: {
                children: [{
                    level: 0,
                    values: {
                        0: { value: 100 }
                    }
                }]
            },
            levels: []
        },
        columns: {
            root: {
                children: [
                    {
                        level: 0,
                        value: 'http://www.validurl.com'
                    }
                ]
            },
            levels: [{
                sources: [columnGroupSourceWebUrl]
            }]
        },
        valueSources: [measureSource1]
    };
    var matrixOneMeasureOneColumnGroupWithUrlOneGroupInstanceDataView = {
        metadata: { columns: [columnGroupSourceWebUrl, measureSource1] },
        matrix: matrixOneMeasureOneColumnGroupWithUrlOneGroupInstance
    };
    // ----------------------------------
    // | Measure1 | Measure2 | Measure3 |
    // +--------------------------------|
    // |      100 |      200 |      300 |
    // ----------------------------------
    var matrixThreeMeasures = {
        rows: {
            root: {
                children: [{
                    level: 0,
                    values: {
                        0: { value: 100 },
                        1: { value: 200, valueSourceIndex: 1 },
                        2: { value: 300, valueSourceIndex: 2 }
                    }
                }]
            },
            levels: []
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
    var matrixThreeMeasuresDataView = {
        metadata: { columns: [measureSource1, measureSource2, measureSource3] },
        matrix: matrixThreeMeasures
    };
    // ----------------------------------
    // |                        Group A |
    // |--------------------------------|
    // | Measure1 | Measure2 | Measure3 |
    // +--------------------------------|
    // |      100 |      200 |      300 |
    // ----------------------------------
    var matrixThreeMeasuresOneColumnGroupOneGroupInstance = {
        rows: {
            root: {
                children: [{
                    level: 0,
                    values: {
                        0: { value: 100 },
                        1: { value: 200, valueSourceIndex: 1 },
                        2: { value: 300, valueSourceIndex: 2 }
                    }
                }]
            },
            levels: []
        },
        columns: {
            root: {
                children: [
                    {
                        level: 0,
                        value: 'Group A',
                        children: [
                            { level: 1 },
                            { level: 1, levelSourceIndex: 1 },
                            { level: 1, levelSourceIndex: 2 }
                        ]
                    }
                ]
            },
            levels: [
                {
                    sources: [
                        columnGroupSource1
                    ]
                },
                {
                    sources: [
                        measureSource1,
                        measureSource2,
                        measureSource3
                    ]
                }
            ]
        },
        valueSources: [
            measureSource1,
            measureSource2,
            measureSource3
        ]
    };
    var matrixThreeMeasuresOneColumnGroupOneGroupInstanceDataView = {
        metadata: { columns: [columnGroupSource1, measureSource1, measureSource2, measureSource3] },
        matrix: matrixThreeMeasuresOneColumnGroupOneGroupInstance
    };
    // ----------------------------------------------------------------------------
    // |     RowGroup1 | RowGroup2 |   RowGroup3 | Measure1 | Measure2 | Measure3 |
    // |-----------------------------------------+--------------------------------|
    // | North America |    Canada |     Ontario |     1000 |     1001 |     1002 |
    // |               |           |----------------------------------------------|
    // |               |           |      Quebec |     1010 |     1011 |     1012 |
    // |               |----------------------------------------------------------|
    // |               |       USA |  Washington |     1100 |     1101 |     1102 |
    // |               |           |----------------------------------------------|
    // |               |           |      Oregon |     1110 |     1111 |     1112 |
    // |--------------------------------------------------------------------------|
    // | South America |    Brazil |    Amazonas |     2000 |     2001 |     2002 | 
    // |               |           |----------------------------------------------|
    // |               |           | Mato Grosso |     2010 |     2011 |     2012 |
    // |               |----------------------------------------------------------|
    // |               |     Chile |       Arica |     2100 |     2101 |     2102 |
    // |               |           |----------------------------------------------|
    // |               |           |  Parinacota |     2110 |     2111 |     2112 |
    // ----------------------------------------------------------------------------
    var matrixThreeMeasuresThreeRowGroups = {
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
    var matrixThreeMeasuresThreeRowGroupsDataView = {
        metadata: { columns: [rowGroupSource1, rowGroupSource2, rowGroupSource3], segment: {} },
        matrix: matrixThreeMeasuresThreeRowGroups
    };
    // ------------------------
    // | RowGroup1 | Measure1 |
    // |-----------+----------|
    // |   Group 1 |      100 |
    // ------------------------
    var matrixOneMeasureOneRowGroupOneGroupInstance = {
        rows: {
            root: {
                children: [{
                    level: 0,
                    value: 'Group 1',
                    values: { 0: { value: 100 } }
                }]
            },
            levels: [{ sources: [rowGroupSource1] }]
        },
        columns: {
            root: {
                children: [{ level: 0 }]
            },
            levels: [{ sources: [measureSource1] }]
        },
        valueSources: [measureSource1]
    };
    // ----------------------------------------
    // | RowGroup1                 | Measure1 |
    // |---------------------------+----------|
    // |   http://www.validurl.com |      100 |
    // ----------------------------------------
    var matrixOneMeasureOneRowGroupUrlOneGroupInstance = {
        rows: {
            root: {
                children: [{
                    level: 0,
                    value: 'http://www.validurl.com',
                    values: { 0: { value: 100 } }
                }]
            },
            levels: [{ sources: [rowGroupSourceWebUrl] }]
        },
        columns: {
            root: {
                children: [{ level: 0 }]
            },
            levels: [{ sources: [measureSource1] }]
        },
        valueSources: [measureSource1]
    };
    var matrixOneMeasureOneRowGroupUrlOneGroupInstanceDataView = {
        metadata: { columns: [], segment: {} },
        matrix: matrixOneMeasureOneRowGroupUrlOneGroupInstance
    };
    // ----------------------
    // | RowGroup1 |  Group |
    // |-----------+--------|
    // |     Group |        |
    // ----------------------
    var matrixOneRowGroupOneColumnGroupOneGroupInstance = {
        rows: {
            root: {
                children: [{
                    level: 0,
                    value: 10
                }]
            },
            levels: [{ sources: [rowGroupSource1] }]
        },
        columns: {
            root: {
                children: [{
                    level: 0,
                    value: 10
                }]
            },
            levels: [{ sources: [columnGroupSource1] }]
        },
        valueSources: []
    };
    var matrixOneRowGroupOneColumnGroupOneGroupInstanceDataView = {
        metadata: { columns: [rowGroupSource1, columnGroupSource1] },
        matrix: matrixOneRowGroupOneColumnGroupOneGroupInstance
    };
    // -------------------------------------
    // | RowGroup1 | RowGroup2 | RowGroup3 |
    // |-----------------------------------+
    // |    Africa |   Algeria |      2008 |
    // -------------------------------------
    var matrixThreeRowGroupsOneGroupInstance = {
        rows: {
            root: {
                children: [
                    {
                        level: 0,
                        value: 'Africa',
                        children: [
                            {
                                level: 1,
                                value: 'Algeria',
                                children: [
                                    {
                                        level: 2,
                                        value: 2008
                                    }
                                ]
                            }
                        ]
                    }
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
                children: []
            },
            levels: []
        },
        valueSources: []
    };
    var matrixThreeRowGroupsOneGroupInstanceDataView = {
        metadata: { columns: [rowGroupSource1, rowGroupSource2, rowGroupSource3] },
        matrix: matrixThreeRowGroupsOneGroupInstance
    };
    // -------------------------
    // | RowGroup1 | RowGroup2 |
    // |-----------------------+
    // |    Africa |           |
    // |           |-----------|
    // |           |    Angola |
    // |-----------|-----------|
    // |      Asia |     China |
    // |           |-----------|
    // |           |           |
    // |-----------|-----------|
    // |           |           |
    // -------------------------
    var matrixTwoRowGroupsWithNullValues = {
        rows: {
            root: {
                children: [
                    {
                        level: 0,
                        value: 'Africa',
                        children: [
                            {
                                level: 1
                            },
                            {
                                level: 1,
                                value: 'Angola'
                            }
                        ]
                    },
                    {
                        level: 0,
                        value: 'Asia',
                        children: [
                            {
                                level: 1,
                                value: 'China'
                            },
                            {
                                level: 1
                            }
                        ]
                    },
                    {
                        level: 0,
                        children: [
                            {
                                level: 1
                            }
                        ]
                    }
                ]
            },
            levels: [
                { sources: [rowGroupSource1] },
                { sources: [rowGroupSource2] }
            ]
        },
        columns: {
            root: {
                children: []
            },
            levels: []
        },
        valueSources: []
    };
    // -------------------------------------
    // | RowGroup1 | RowGroup2 | RowGroup3 |
    // |-----------------------------------+
    // |    Africa |   Algeria |      2008 |
    // |           |           |-----------|
    // |           |           |      2012 |
    // |           |-----------------------|
    // |           |    Angola |      2008 |
    // |           |           |-----------|
    // |           |           |      2012 |
    // |-----------|-----------|-----------|
    // |      Asia |     China |      2008 |
    // |           |           |-----------|
    // |           |           |      2012 |
    // |           |-----------|-----------|
    // |           |     India |      2008 |
    // |           |           |-----------|
    // |           |           |      2012 |
    // -------------------------------------
    var matrixThreeRowGroups = {
        rows: {
            root: {
                children: [
                    {
                        level: 0,
                        value: 'Africa',
                        children: [
                            {
                                level: 1,
                                value: 'Algeria',
                                children: [
                                    {
                                        level: 2,
                                        value: 2008
                                    },
                                    {
                                        level: 2,
                                        value: 2012
                                    }
                                ]
                            },
                            {
                                level: 1,
                                value: 'Angola',
                                children: [
                                    {
                                        level: 2,
                                        value: 2008
                                    },
                                    {
                                        level: 2,
                                        value: 2012
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        level: 0,
                        value: 'Asia',
                        children: [
                            {
                                level: 1,
                                value: 'China',
                                children: [
                                    {
                                        level: 2,
                                        value: 2008
                                    },
                                    {
                                        level: 2,
                                        value: 2012
                                    }
                                ]
                            },
                            {
                                level: 1,
                                value: 'India',
                                children: [
                                    {
                                        level: 2,
                                        value: 2008
                                    },
                                    {
                                        level: 2,
                                        value: 2012
                                    }
                                ]
                            }
                        ]
                    }
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
                children: []
            },
            levels: []
        },
        valueSources: []
    };
    // ---------------------------------------------------------
    // |                    Africa |                      Asia | 
    // |---------------------------|---------------------------|
    // |     Algeria |      Angola |       China |       India |
    // |-------------|-------------|-------------|-------------|
    // | 2008 | 2012 | 2008 | 2012 | 2008 | 2012 | 2008 | 2012 |
    // +--------------------------------------------------------
    var matrixThreeColumnGroups = {
        rows: {
            root: {
                children: []
            },
            levels: []
        },
        columns: {
            root: {
                children: [
                    {
                        level: 0,
                        value: 'Africa',
                        children: [
                            {
                                level: 1,
                                value: 'Algeria',
                                children: [
                                    {
                                        level: 2,
                                        value: 2008
                                    },
                                    {
                                        level: 2,
                                        value: 2012
                                    }
                                ]
                            },
                            {
                                level: 1,
                                value: 'Angola',
                                children: [
                                    {
                                        level: 2,
                                        value: 2008
                                    },
                                    {
                                        level: 2,
                                        value: 2012
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        level: 0,
                        value: 'Asia',
                        children: [
                            {
                                level: 1,
                                value: 'China',
                                children: [
                                    {
                                        level: 2,
                                        value: 2008
                                    },
                                    {
                                        level: 2,
                                        value: 2012
                                    }
                                ]
                            },
                            {
                                level: 1,
                                value: 'India',
                                children: [
                                    {
                                        level: 2,
                                        value: 2008
                                    },
                                    {
                                        level: 2,
                                        value: 2012
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            levels: [
                { sources: [rowGroupSource1] },
                { sources: [rowGroupSource2] },
                { sources: [rowGroupSource3] }
            ]
        },
        valueSources: []
    };
    var matrixThreeColumnGroupsDataView = {
        metadata: {
            columns: [
                rowGroupSource1,
                rowGroupSource2,
                rowGroupSource3
            ]
        },
        matrix: matrixThreeColumnGroups
    };
    // --------------------------------------------
    // |         Africa |           Asia |        |
    // |----------------|----------------|--------|
    // |       | Angola | China |        |        |
    // +-------------------------------------------
    var matrixTwoColumnGroupsWithNullValues = {
        rows: {
            root: {
                children: []
            },
            levels: []
        },
        columns: {
            root: {
                children: [
                    {
                        level: 0,
                        value: 'Africa',
                        children: [
                            {
                                level: 1,
                                identity: jasmine.any(Object)
                            },
                            {
                                level: 1,
                                value: 'Angola',
                                identity: jasmine.any(Object)
                            }
                        ]
                    },
                    {
                        level: 0,
                        value: 'Asia',
                        children: [
                            {
                                level: 1,
                                value: 'China',
                                identity: jasmine.any(Object)
                            },
                            {
                                level: 1,
                                identity: jasmine.any(Object)
                            }
                        ]
                    },
                    {
                        level: 0,
                        children: [
                            {
                                level: 1,
                                identity: jasmine.any(Object)
                            }
                        ]
                    }
                ]
            },
            levels: [
                { sources: [columnGroupSource1] },
                { sources: [columnGroupSource2] }
            ]
        },
        valueSources: []
    };
    // -----------------------------
    // | RowGroup1 | United States |
    // |-----------+---------------|
    // |      2002 |               |
    // -----------------------------
    var matrixOneRowGroupOneColumnGroupOneInstance = {
        rows: {
            root: {
                children: [
                    {
                        level: 0,
                        value: 2002
                    }
                ]
            },
            levels: [
                {
                    sources: [rowGroupSource1]
                }
            ]
        },
        columns: {
            root: {
                children: [
                    {
                        level: 0,
                        value: 'United States'
                    }
                ]
            },
            levels: [
                {
                    sources: [columnGroupSource1]
                }
            ]
        },
        valueSources: []
    };
    // -----------------------------------------
    // |           |           | ColGroup1 | B |
    // |-----------|-----------|-----------|---|
    // |           |           | ColGroup2 | b |
    // |-----------|-----------|-----------|---|
    // | RowGroup1 | RowGroup2 | RowGroup3 | 2 |
    // |-----------------------------------+---|
    // |         A |         a |         1 |   |
    // -----------------------------------------
    var matrixThreeRowGroupsThreeColumnGroupsOneInstance = {
        rows: {
            root: {
                children: [
                    {
                        level: 0,
                        value: 'A',
                        children: [
                            {
                                level: 1,
                                value: 'a',
                                children: [
                                    {
                                        level: 2,
                                        value: 1
                                    }
                                ]
                            }
                        ]
                    }
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
                    {
                        level: 0,
                        value: 'B',
                        children: [
                            {
                                level: 1,
                                value: 'b',
                                children: [
                                    {
                                        level: 2,
                                        value: 2
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            levels: [
                { sources: [columnGroupSource1] },
                { sources: [columnGroupSource2] },
                { sources: [columnGroupSource3] }
            ]
        },
        valueSources: []
    };
    // -------------------------------------------------
    // |           |           | ColGroup1 |         C |
    // |-----------|-----------|-----------|-----------|
    // |           |           | ColGroup2 |     c | d |
    // |-----------|-----------|-----------|-----------|
    // | RowGroup1 | RowGroup2 | RowGroup3 | 4 | 5 | 6 |
    // |-----------------------------------+-----------|
    // |         A |         a |         1 |   |   |   |
    // |           |           |-----------|---|---|---|
    // |           |           |         2 |   |   |   |
    // |           |-----------|-----------|---|---|---|
    // |           |         b |         3 |   |   |   |
    // -------------------------------------------------
    var matrixThreeRowGroupsThreeColumnGroups = {
        rows: {
            root: {
                children: [
                    {
                        level: 0,
                        value: 'A',
                        children: [
                            {
                                level: 1,
                                value: 'a',
                                children: [
                                    {
                                        level: 2,
                                        value: 1
                                    },
                                    {
                                        level: 2,
                                        value: 2
                                    }
                                ]
                            },
                            {
                                level: 1,
                                value: 'b',
                                children: [
                                    {
                                        level: 2,
                                        value: 3
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            levels: [
                { sources: [rowGroupSource1] },
                { sources: [rowGroupSource2] },
                { sources: [rowGroupSource3formatted] }
            ]
        },
        columns: {
            root: {
                children: [
                    {
                        level: 0,
                        value: 'C',
                        children: [
                            {
                                level: 1,
                                value: 'c',
                                children: [
                                    {
                                        level: 2,
                                        value: 4
                                    },
                                    {
                                        level: 2,
                                        value: 5
                                    }
                                ]
                            },
                            {
                                level: 1,
                                value: 'd',
                                children: [
                                    {
                                        level: 2,
                                        value: 6
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            levels: [
                { sources: [columnGroupSource1] },
                { sources: [columnGroupSource2] },
                { sources: [columnGroupSource3formatted] }
            ]
        },
        valueSources: []
    };
    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // |               |     ColGroup1 |                                                            1992 |                                                            1996 |
    // |---------------|---------------|-----------------------------------------------------------------|-----------------------------------------------------------------|
    // |               |     ColGroup2 |              Bronze |                Gold |              Silver |              Bronze |                Gold |              Silver |
    // |---------------|---------------|---------------------|---------------------|---------------------|---------------------|---------------------|---------------------|
    // |     RowGroup1 |     RowGroup2 | Measure1 | Measure2 | Measure1 | Measure2 | Measure1 | Measure2 | Measure1 | Measure2 | Measure1 | Measure2 | Measure1 | Measure2 |
    // |-------------------------------+-----------------------------------------------------------------------------------------------------------------------------------|
    // |          Asia |   South Korea |        0 |        1 |        2 |        3 |        4 |        5 |        6 |        7 |        8 |        9 |       10 |       11 |
    // |               |---------------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
    // |               |  Unified Team |       12 |       13 |       14 |       15 |       16 |       17 |       18 |       19 |       20 |       21 |       22 |          |
    // |---------------|---------------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
    // |        Europe |        France |       24 |       25 |       26 |       27 |       28 |       29 |       30 |       31 |       32 |       33 |       34 |       35 |
    // |               |---------------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
    // |               |       Germany |       36 |       37 |       38 |       39 |       40 |       41 |       42 |       43 |       44 |       45 |       46 |       47 |
    // |---------------|---------------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
    // | North America | United States |       48 |       49 |       50 |       51 |       52 |       53 |       54 |       55 |       56 |       57 |       58 |       59 |
    // |---------------|---------------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
    // |       Oceania |     Australia |       60 |       61 |       62 |       63 |       64 |       65 |       66 |       67 |       68 |       69 |       70 |       71 |
    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var matrixTwoRowGroupsTwoColumnGroupsTwoMeasures = {
        rows: {
            root: {
                children: [
                    {
                        level: 0,
                        value: 'Asia',
                        children: [
                            {
                                level: 1,
                                value: 'South Korea',
                                values: {
                                    0: { value: 0 },
                                    1: { value: 1, valueSourceIndex: 1 },
                                    2: { value: 2 },
                                    3: { value: 3, valueSourceIndex: 1 },
                                    4: { value: 4 },
                                    5: { value: 5, valueSourceIndex: 1 },
                                    6: { value: 6 },
                                    7: { value: 7, valueSourceIndex: 1 },
                                    8: { value: 8 },
                                    9: { value: 9, valueSourceIndex: 1 },
                                    10: { value: 10 },
                                    11: { value: 11, valueSourceIndex: 1 }
                                }
                            },
                            {
                                level: 1,
                                value: 'Unified Team',
                                values: {
                                    0: { value: 12 },
                                    1: { value: 13, valueSourceIndex: 1 },
                                    2: { value: 14 },
                                    3: { value: 15, valueSourceIndex: 1 },
                                    4: { value: 16 },
                                    5: { value: 17, valueSourceIndex: 1 },
                                    6: { value: 18 },
                                    7: { value: 19, valueSourceIndex: 1 },
                                    8: { value: 20 },
                                    9: { value: 21, valueSourceIndex: 1 },
                                    10: { value: 22 },
                                    11: { value: null, valueSourceIndex: 1 }
                                }
                            }
                        ]
                    },
                    {
                        level: 0,
                        value: 'Europe',
                        children: [
                            {
                                level: 1,
                                value: 'France',
                                values: {
                                    0: { value: 24 },
                                    1: { value: 25, valueSourceIndex: 1 },
                                    2: { value: 26 },
                                    3: { value: 27, valueSourceIndex: 1 },
                                    4: { value: 28 },
                                    5: { value: 29, valueSourceIndex: 1 },
                                    6: { value: 30 },
                                    7: { value: 31, valueSourceIndex: 1 },
                                    8: { value: 32 },
                                    9: { value: 33, valueSourceIndex: 1 },
                                    10: { value: 34 },
                                    11: { value: 35, valueSourceIndex: 1 }
                                }
                            },
                            {
                                level: 1,
                                value: 'Germany',
                                values: {
                                    0: { value: 36 },
                                    1: { value: 37, valueSourceIndex: 1 },
                                    2: { value: 38 },
                                    3: { value: 39, valueSourceIndex: 1 },
                                    4: { value: 40 },
                                    5: { value: 41, valueSourceIndex: 1 },
                                    6: { value: 42 },
                                    7: { value: 43, valueSourceIndex: 1 },
                                    8: { value: 44 },
                                    9: { value: 45, valueSourceIndex: 1 },
                                    10: { value: 46 },
                                    11: { value: 47, valueSourceIndex: 1 }
                                }
                            }
                        ]
                    },
                    {
                        level: 0,
                        value: 'North America',
                        children: [
                            {
                                level: 1,
                                value: 'United States',
                                values: {
                                    0: { value: 48 },
                                    1: { value: 49, valueSourceIndex: 1 },
                                    2: { value: 50 },
                                    3: { value: 51, valueSourceIndex: 1 },
                                    4: { value: 52 },
                                    5: { value: 53, valueSourceIndex: 1 },
                                    6: { value: 54 },
                                    7: { value: 55, valueSourceIndex: 1 },
                                    8: { value: 56 },
                                    9: { value: 57, valueSourceIndex: 1 },
                                    10: { value: 58 },
                                    11: { value: 59, valueSourceIndex: 1 }
                                }
                            }
                        ]
                    },
                    {
                        level: 0,
                        value: 'Oceania',
                        children: [
                            {
                                level: 1,
                                value: 'Australia',
                                values: {
                                    0: { value: 60 },
                                    1: { value: 61, valueSourceIndex: 1 },
                                    2: { value: 62 },
                                    3: { value: 63, valueSourceIndex: 1 },
                                    4: { value: 64 },
                                    5: { value: 65, valueSourceIndex: 1 },
                                    6: { value: 66 },
                                    7: { value: 67, valueSourceIndex: 1 },
                                    8: { value: 68 },
                                    9: { value: 69, valueSourceIndex: 1 },
                                    10: { value: 70 },
                                    11: { value: 71, valueSourceIndex: 1 }
                                }
                            }
                        ]
                    }
                ]
            },
            levels: [
                { sources: [rowGroupSource1] },
                { sources: [rowGroupSource2] }
            ]
        },
        columns: {
            root: {
                children: [
                    {
                        level: 0,
                        value: 1992,
                        children: [
                            {
                                level: 1,
                                name: 'Bronze',
                                children: [
                                    {
                                        level: 2
                                    },
                                    {
                                        level: 2,
                                        levelSourceIndex: 1
                                    }
                                ]
                            },
                            {
                                level: 1,
                                value: 'Gold',
                                children: [
                                    {
                                        level: 2
                                    },
                                    {
                                        level: 2,
                                        levelSourceIndex: 1
                                    }
                                ]
                            },
                            {
                                level: 1,
                                value: 'Silver',
                                children: [
                                    {
                                        level: 2
                                    },
                                    {
                                        level: 2,
                                        levelSourceIndex: 1
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        level: 0,
                        value: 1996,
                        children: [
                            {
                                level: 1,
                                value: 'Bronze',
                                children: [
                                    {
                                        level: 2
                                    },
                                    {
                                        level: 2,
                                        levelSourceIndex: 1
                                    }
                                ]
                            },
                            {
                                level: 1,
                                value: 'Gold',
                                children: [
                                    {
                                        level: 2
                                    },
                                    {
                                        level: 2,
                                        levelSourceIndex: 1
                                    }
                                ]
                            },
                            {
                                level: 1,
                                value: 'Silver',
                                children: [
                                    {
                                        level: 2
                                    },
                                    {
                                        level: 2,
                                        levelSourceIndex: 1
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            levels: [
                { sources: [columnGroupSource1] },
                { sources: [columnGroupSource2] },
                {
                    sources: [
                        measureSource1,
                        measureSource2
                    ]
                }
            ]
        },
        valueSources: [
            measureSource1,
            measureSource2
        ]
    };
    var matrixTwoRowGroupsTwoColumnGroupsTwoMeasuresDataView = {
        metadata: {
            columns: [
                rowGroupSource1,
                rowGroupSource2,
                columnGroupSource1,
                columnGroupSource2,
                measureSource1,
                measureSource2,
            ]
        },
        matrix: matrixTwoRowGroupsTwoColumnGroupsTwoMeasures
    };
    // --------------------------------------------------------------------------------------------------------------
    // |               |     ColGroup1 |                           1992 |                           1996 |    Total |
    // |---------------|---------------|--------------------------------|--------------------------------|          |
    // |     RowGroup1 |     RowGroup2 |   Silver |     Gold |    Total |   Silver |     Gold |    Total |          |
    // |---------------|---------------|----------|----------|----------|----------|----------|----------|----------|
    // |          Asia |   South Korea |        1 |        2 |        3 |        4 |        5 |        9 |       12 |
    // |               |---------------|----------|----------|----------|----------|----------|----------|----------|
    // |               |  Unified Team |       11 |       12 |       23 |       14 |       15 |       29 |       52 |
    // |               |---------------|----------|----------|----------|----------|----------|----------|----------|
    // |               |         Total |       12 |       14 |       26 |       18 |       20 |       38 |       64 |
    // |---------------|---------------|----------|----------|----------|----------|----------|----------|----------|
    // |        Europe |        France |       21 |       22 |       43 |       24 |       25 |       49 |       92 |
    // |               |---------------|----------|----------|----------|----------|----------|----------|----------|
    // |               |       Germany |       31 |       32 |       63 |       34 |       35 |       69 |      132 |
    // |               |---------------|----------|----------|----------|----------|----------|----------|----------|
    // |               |         Total |       52 |       54 |      106 |       58 |       60 |      118 |      224 |
    // |---------------|---------------|----------|----------|----------|----------|----------|----------|----------|
    // | North America | United States |       41 |       42 |       83 |       44 |       45 |       89 |      172 |
    // |               |---------------|----------|----------|----------|----------|----------|----------|----------|
    // |               |         Total |       41 |       42 |       83 |       44 |       45 |       89 |      172 |
    // |---------------|---------------|----------|----------|----------|----------|----------|----------|----------|
    // |       Oceania |     Australia |       51 |       52 |      103 |       54 |       55 |      109 |      212 |
    // |               |---------------|----------|----------|----------|----------|----------|----------|----------|
    // |               |         Total |       51 |       52 |      103 |       54 |       55 |      109 |      212 |
    // |-------------------------------|----------|----------|----------|----------|----------|----------|----------|
    // |         Total                 |      156 |      162 |      318 |      174 |      180 |      354 |      672 |
    // --------------------------------------------------------------------------------------------------------------
    var matrixTwoRowGroupsTwoColumnGroupsOneMeasureAndTotals = {
        rows: {
            root: {
                children: [
                    {
                        level: 0,
                        value: 'Asia',
                        children: [
                            {
                                level: 1,
                                value: 'South Korea',
                                values: {
                                    0: { value: 1 },
                                    1: { value: 2 },
                                    2: { value: 3 },
                                    3: { value: 4 },
                                    4: { value: 5 },
                                    5: { value: 9 },
                                    6: { value: 12 }
                                }
                            },
                            {
                                level: 1,
                                value: 'Unified Team',
                                values: {
                                    0: { value: 11 },
                                    1: { value: 12 },
                                    2: { value: 23 },
                                    3: { value: 14 },
                                    4: { value: 15 },
                                    5: { value: 29 },
                                    6: { value: 52 }
                                }
                            },
                            {
                                level: 1,
                                isSubtotal: true,
                                values: {
                                    0: { value: 12 },
                                    1: { value: 14 },
                                    2: { value: 26 },
                                    3: { value: 18 },
                                    4: { value: 20 },
                                    5: { value: 38 },
                                    6: { value: 64 }
                                }
                            }
                        ]
                    },
                    {
                        level: 0,
                        value: 'Europe',
                        children: [
                            {
                                level: 1,
                                value: 'France',
                                values: {
                                    0: { value: 21 },
                                    1: { value: 22 },
                                    2: { value: 43 },
                                    3: { value: 24 },
                                    4: { value: 25 },
                                    5: { value: 49 },
                                    6: { value: 92 }
                                }
                            },
                            {
                                level: 1,
                                value: 'Germany',
                                values: {
                                    0: { value: 31 },
                                    1: { value: 32 },
                                    2: { value: 63 },
                                    3: { value: 34 },
                                    4: { value: 35 },
                                    5: { value: 69 },
                                    6: { value: 132 }
                                }
                            },
                            {
                                level: 1,
                                isSubtotal: true,
                                values: {
                                    0: { value: 52 },
                                    1: { value: 54 },
                                    2: { value: 106 },
                                    3: { value: 58 },
                                    4: { value: 60 },
                                    5: { value: 118 },
                                    6: { value: 224 }
                                }
                            }
                        ]
                    },
                    {
                        level: 0,
                        value: 'North America',
                        children: [
                            {
                                level: 1,
                                value: 'United States',
                                values: {
                                    0: { value: 41 },
                                    1: { value: 42 },
                                    2: { value: 83 },
                                    3: { value: 44 },
                                    4: { value: 45 },
                                    5: { value: 89 },
                                    6: { value: 172 }
                                }
                            },
                            {
                                level: 1,
                                isSubtotal: true,
                                values: {
                                    0: { value: 41 },
                                    1: { value: 42 },
                                    2: { value: 83 },
                                    3: { value: 44 },
                                    4: { value: 45 },
                                    5: { value: 89 },
                                    6: { value: 172 }
                                }
                            }
                        ]
                    },
                    {
                        level: 0,
                        value: 'Oceania',
                        children: [
                            {
                                level: 1,
                                value: 'Australia',
                                values: {
                                    0: { value: 51 },
                                    1: { value: 52 },
                                    2: { value: 103 },
                                    3: { value: 54 },
                                    4: { value: 55 },
                                    5: { value: 109 },
                                    6: { value: 212 }
                                }
                            },
                            {
                                level: 1,
                                isSubtotal: true,
                                values: {
                                    0: { value: 51 },
                                    1: { value: 52 },
                                    2: { value: 103 },
                                    3: { value: 54 },
                                    4: { value: 55 },
                                    5: { value: 109 },
                                    6: { value: 212 }
                                }
                            }
                        ]
                    },
                    {
                        level: 0,
                        isSubtotal: true,
                        values: {
                            0: { value: 156 },
                            1: { value: 162 },
                            2: { value: 318 },
                            3: { value: 174 },
                            4: { value: 180 },
                            5: { value: 354 },
                            6: { value: 672 }
                        }
                    }
                ]
            },
            levels: [
                { sources: [rowGroupSource1] },
                { sources: [rowGroupSource2] }
            ]
        },
        columns: {
            root: {
                children: [
                    {
                        level: 0,
                        value: 1992,
                        children: [
                            {
                                level: 1,
                                value: 'Silver'
                            },
                            {
                                level: 1,
                                value: 'Gold'
                            },
                            {
                                level: 1,
                                isSubtotal: true
                            }
                        ]
                    },
                    {
                        level: 0,
                        value: 1996,
                        children: [
                            {
                                level: 1,
                                value: 'Silver'
                            },
                            {
                                level: 1,
                                value: 'Gold'
                            },
                            {
                                level: 1,
                                isSubtotal: true
                            }
                        ]
                    },
                    {
                        level: 0,
                        isSubtotal: true
                    }
                ]
            },
            levels: [
                { sources: [columnGroupSource1] },
                { sources: [columnGroupSource2] }
            ]
        },
        valueSources: [measureSource1]
    };
    var matrixTwoRowGroupsTwoColumnGroupsOneMeasureAndTotalsDataView = {
        metadata: {
            columns: [
                rowGroupSource1,
                rowGroupSource2,
                columnGroupSource1,
                columnGroupSource2,
                measureSource1,
            ]
        },
        matrix: matrixTwoRowGroupsTwoColumnGroupsOneMeasureAndTotals
    };
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // |               |     ColGroup1 |                                                            1992 |                                                            1996 |               Total |
    // |---------------|---------------|-----------------------------------------------------------------|-----------------------------------------------------------------|                     |
    // |               |     ColGroup2 |              Silver |                Gold |               Total |              Silver |                Gold |               Total |                     |
    // |---------------|---------------|---------------------|---------------------|---------------------|---------------------|---------------------|---------------------|---------------------|
    // |     RowGroup1 |     RowGroup2 | Measure1 | Measure2 | Measure1 | Measure2 | Measure1 | Measure2 | Measure1 | Measure2 | Measure1 | Measure2 | Measure1 | Measure2 | Measure1 | Measure2 |
    // |-------------------------------+-----------------------------------------------------------------------------------------------------------------------------------|----------|----------|
    // |          Asia |   South Korea |        0 |        1 |        2 |        3 |        2 |        4 |        6 |        7 |        8 |        9 |       14 |       16 |       16 |       20 |
    // |               |---------------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
    // |               |  Unified Team |       12 |       13 |       14 |       15 |       26 |       28 |       18 |       19 |       20 |       21 |       38 |       40 |       64 |       68 |
    // |               |---------------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
    // |               |         Total |       12 |       14 |       16 |       18 |       28 |       32 |       24 |       26 |       28 |       30 |       52 |       56 |       80 |       88 |
    // |---------------|---------------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
    // |        Europe |        France |       24 |       25 |       26 |       27 |       50 |       52 |       30 |       31 |       32 |       33 |       62 |       64 |      112 |      116 |
    // |               |---------------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
    // |               |       Germany |       36 |       37 |       38 |       39 |       74 |       76 |       42 |       43 |       44 |       45 |       86 |       88 |      160 |      164 |
    // |               |---------------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
    // |               |         Total |       60 |       62 |       64 |       66 |      124 |      128 |       72 |       74 |       76 |       78 |      148 |      152 |      272 |      280 |
    // |---------------|---------------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
    // | North America | United States |       48 |       49 |       50 |       51 |       98 |      100 |       54 |       55 |       56 |       57 |      110 |      112 |      208 |      212 |
    // |               |---------------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
    // |               |         Total |       48 |       49 |       50 |       51 |       98 |      100 |       54 |       55 |       56 |       57 |      110 |      112 |      208 |      212 |
    // |---------------|---------------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
    // |       Oceania |     Australia |       60 |       61 |       62 |       63 |      122 |      124 |       66 |       67 |       68 |       69 |      134 |      136 |      256 |      260 |
    // |               |---------------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
    // |               |         Total |       60 |       61 |       62 |       63 |      122 |      124 |       66 |       67 |       68 |       69 |      134 |      136 |      256 |      260 |
    // |-------------------------------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
    // |         Total                 |      180 |      186 |      192 |      198 |      372 |      384 |      216 |      222 |      228 |      234 |      444 |      456 |      816 |      840 |
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    var matrixTwoRowGroupsTwoColumnGroupsTwoMeasuresAndTotals = {
        rows: {
            root: {
                children: [
                    {
                        level: 0,
                        value: 'Asia',
                        children: [
                            {
                                level: 1,
                                value: 'South Korea',
                                values: {
                                    0: { value: 0 },
                                    1: { value: 1, valueSourceIndex: 1 },
                                    2: { value: 2 },
                                    3: { value: 3, valueSourceIndex: 1 },
                                    4: { value: 2 },
                                    5: { value: 4, valueSourceIndex: 1 },
                                    6: { value: 6 },
                                    7: { value: 7, valueSourceIndex: 1 },
                                    8: { value: 8 },
                                    9: { value: 9, valueSourceIndex: 1 },
                                    10: { value: 14 },
                                    11: { value: 16, valueSourceIndex: 1 },
                                    12: { value: 16 },
                                    13: { value: 20, valueSourceIndex: 1 }
                                }
                            },
                            {
                                level: 1,
                                value: 'Unified Team',
                                values: {
                                    0: { value: 12 },
                                    1: { value: 13, valueSourceIndex: 1 },
                                    2: { value: 14 },
                                    3: { value: 15, valueSourceIndex: 1 },
                                    4: { value: 26 },
                                    5: { value: 28, valueSourceIndex: 1 },
                                    6: { value: 18 },
                                    7: { value: 19, valueSourceIndex: 1 },
                                    8: { value: 20 },
                                    9: { value: 21, valueSourceIndex: 1 },
                                    10: { value: 38 },
                                    11: { value: 40, valueSourceIndex: 1 },
                                    12: { value: 64 },
                                    13: { value: 68, valueSourceIndex: 1 }
                                }
                            },
                            {
                                level: 1,
                                isSubtotal: true,
                                values: {
                                    0: { value: 12 },
                                    1: { value: 14, valueSourceIndex: 1 },
                                    2: { value: 16 },
                                    3: { value: 18, valueSourceIndex: 1 },
                                    4: { value: 28 },
                                    5: { value: 32, valueSourceIndex: 1 },
                                    6: { value: 24 },
                                    7: { value: 26, valueSourceIndex: 1 },
                                    8: { value: 28 },
                                    9: { value: 30, valueSourceIndex: 1 },
                                    10: { value: 52 },
                                    11: { value: 56, valueSourceIndex: 1 },
                                    12: { value: 80 },
                                    13: { value: 88, valueSourceIndex: 1 }
                                }
                            }
                        ]
                    },
                    {
                        level: 0,
                        value: 'Europe',
                        children: [
                            {
                                level: 1,
                                value: 'France',
                                values: {
                                    0: { value: 24 },
                                    1: { value: 25, valueSourceIndex: 1 },
                                    2: { value: 26 },
                                    3: { value: 27, valueSourceIndex: 1 },
                                    4: { value: 50 },
                                    5: { value: 52, valueSourceIndex: 1 },
                                    6: { value: 30 },
                                    7: { value: 31, valueSourceIndex: 1 },
                                    8: { value: 32 },
                                    9: { value: 33, valueSourceIndex: 1 },
                                    10: { value: 62 },
                                    11: { value: 64, valueSourceIndex: 1 },
                                    12: { value: 112 },
                                    13: { value: 116, valueSourceIndex: 1 }
                                }
                            },
                            {
                                level: 1,
                                value: 'Germany',
                                values: {
                                    0: { value: 36 },
                                    1: { value: 37, valueSourceIndex: 1 },
                                    2: { value: 38 },
                                    3: { value: 39, valueSourceIndex: 1 },
                                    4: { value: 74 },
                                    5: { value: 74, valueSourceIndex: 1 },
                                    6: { value: 42 },
                                    7: { value: 43, valueSourceIndex: 1 },
                                    8: { value: 44 },
                                    9: { value: 45, valueSourceIndex: 1 },
                                    10: { value: 86 },
                                    11: { value: 88, valueSourceIndex: 1 },
                                    12: { value: 160 },
                                    13: { value: 164, valueSourceIndex: 1 }
                                }
                            },
                            {
                                level: 1,
                                isSubtotal: true,
                                values: {
                                    0: { value: 60 },
                                    1: { value: 62, valueSourceIndex: 1 },
                                    2: { value: 64 },
                                    3: { value: 66, valueSourceIndex: 1 },
                                    4: { value: 124 },
                                    5: { value: 128, valueSourceIndex: 1 },
                                    6: { value: 72 },
                                    7: { value: 74, valueSourceIndex: 1 },
                                    8: { value: 76 },
                                    9: { value: 78, valueSourceIndex: 1 },
                                    10: { value: 148 },
                                    11: { value: 152, valueSourceIndex: 1 },
                                    12: { value: 272 },
                                    13: { value: 280, valueSourceIndex: 1 }
                                }
                            }
                        ]
                    },
                    {
                        level: 0,
                        value: 'North America',
                        children: [
                            {
                                level: 1,
                                value: 'United States',
                                values: {
                                    0: { value: 48 },
                                    1: { value: 49, valueSourceIndex: 1 },
                                    2: { value: 50 },
                                    3: { value: 51, valueSourceIndex: 1 },
                                    4: { value: 98 },
                                    5: { value: 100, valueSourceIndex: 1 },
                                    6: { value: 54 },
                                    7: { value: 55, valueSourceIndex: 1 },
                                    8: { value: 56 },
                                    9: { value: 57, valueSourceIndex: 1 },
                                    10: { value: 110 },
                                    11: { value: 112, valueSourceIndex: 1 },
                                    12: { value: 208 },
                                    13: { value: 212, valueSourceIndex: 1 }
                                }
                            },
                            {
                                level: 1,
                                isSubtotal: true,
                                values: {
                                    0: { value: 48 },
                                    1: { value: 49, valueSourceIndex: 1 },
                                    2: { value: 50 },
                                    3: { value: 51, valueSourceIndex: 1 },
                                    4: { value: 98 },
                                    5: { value: 100, valueSourceIndex: 1 },
                                    6: { value: 54 },
                                    7: { value: 55, valueSourceIndex: 1 },
                                    8: { value: 56 },
                                    9: { value: 57, valueSourceIndex: 1 },
                                    10: { value: 110 },
                                    11: { value: 112, valueSourceIndex: 1 },
                                    12: { value: 208 },
                                    13: { value: 212, valueSourceIndex: 1 }
                                }
                            }
                        ]
                    },
                    {
                        level: 0,
                        value: 'Oceania',
                        children: [
                            {
                                level: 1,
                                value: 'Australia',
                                values: {
                                    0: { value: 60 },
                                    1: { value: 61, valueSourceIndex: 1 },
                                    2: { value: 62 },
                                    3: { value: 63, valueSourceIndex: 1 },
                                    4: { value: 122 },
                                    5: { value: 124, valueSourceIndex: 1 },
                                    6: { value: 66 },
                                    7: { value: 67, valueSourceIndex: 1 },
                                    8: { value: 68 },
                                    9: { value: 69, valueSourceIndex: 1 },
                                    10: { value: 134 },
                                    11: { value: 136, valueSourceIndex: 1 },
                                    12: { value: 256 },
                                    13: { value: 260, valueSourceIndex: 1 }
                                }
                            },
                            {
                                level: 1,
                                isSubtotal: true,
                                values: {
                                    0: { value: 60 },
                                    1: { value: 61, valueSourceIndex: 1 },
                                    2: { value: 62 },
                                    3: { value: 63, valueSourceIndex: 1 },
                                    4: { value: 122 },
                                    5: { value: 124, valueSourceIndex: 1 },
                                    6: { value: 66 },
                                    7: { value: 67, valueSourceIndex: 1 },
                                    8: { value: 68 },
                                    9: { value: 69, valueSourceIndex: 1 },
                                    10: { value: 134 },
                                    11: { value: 136, valueSourceIndex: 1 },
                                    12: { value: 256 },
                                    13: { value: 260, valueSourceIndex: 1 }
                                }
                            }
                        ]
                    },
                    {
                        level: 0,
                        isSubtotal: true,
                        values: {
                            0: { value: 180 },
                            1: { value: 186, valueSourceIndex: 1 },
                            2: { value: 192 },
                            3: { value: 198, valueSourceIndex: 1 },
                            4: { value: 372 },
                            5: { value: 384, valueSourceIndex: 1 },
                            6: { value: 216 },
                            7: { value: 222, valueSourceIndex: 1 },
                            8: { value: 228 },
                            9: { value: 234, valueSourceIndex: 1 },
                            10: { value: 444 },
                            11: { value: 456, valueSourceIndex: 1 },
                            12: { value: 816 },
                            13: { value: 840, valueSourceIndex: 1 }
                        }
                    }
                ]
            },
            levels: [
                { sources: [rowGroupSource1] },
                { sources: [rowGroupSource2] }
            ]
        },
        columns: {
            root: {
                children: [
                    {
                        level: 0,
                        value: 1992,
                        children: [
                            {
                                level: 1,
                                value: 'Silver',
                                children: [
                                    {
                                        level: 2
                                    },
                                    {
                                        level: 2,
                                        levelSourceIndex: 1
                                    }
                                ]
                            },
                            {
                                level: 1,
                                value: 'Gold',
                                children: [
                                    {
                                        level: 2
                                    },
                                    {
                                        level: 2,
                                        levelSourceIndex: 1
                                    }
                                ]
                            },
                            {
                                level: 1,
                                isSubtotal: true,
                                children: [
                                    {
                                        level: 2,
                                        isSubtotal: true
                                    },
                                    {
                                        level: 2,
                                        levelSourceIndex: 1,
                                        isSubtotal: true
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        level: 0,
                        value: 1996,
                        children: [
                            {
                                level: 1,
                                value: 'Silver',
                                children: [
                                    {
                                        level: 2
                                    },
                                    {
                                        level: 2,
                                        levelSourceIndex: 1
                                    }
                                ]
                            },
                            {
                                level: 1,
                                value: 'Gold',
                                children: [
                                    {
                                        level: 2
                                    },
                                    {
                                        level: 2,
                                        levelSourceIndex: 1
                                    }
                                ]
                            },
                            {
                                level: 1,
                                isSubtotal: true,
                                children: [
                                    {
                                        level: 2,
                                        isSubtotal: true
                                    },
                                    {
                                        level: 2,
                                        levelSourceIndex: 1,
                                        isSubtotal: true
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        level: 0,
                        isSubtotal: true,
                        children: [
                            {
                                level: 2,
                                isSubtotal: true
                            },
                            {
                                level: 2,
                                levelSourceIndex: 1,
                                isSubtotal: true
                            }
                        ]
                    }
                ]
            },
            levels: [
                { sources: [columnGroupSource1] },
                { sources: [columnGroupSource2] },
                {
                    sources: [
                        measureSource1,
                        measureSource2
                    ]
                }
            ]
        },
        valueSources: [
            measureSource1,
            measureSource2
        ]
    };
    var matrixTwoRowGroupsTwoColumnGroupsTwoMeasuresAndTotalsDataView = {
        metadata: {
            columns: [
                rowGroupSource1,
                rowGroupSource2,
                columnGroupSource1,
                columnGroupSource2,
                measureSource1,
                measureSource2,
            ]
        },
        matrix: matrixTwoRowGroupsTwoColumnGroupsTwoMeasuresAndTotals
    };
    // ----------------------------
    // | RowGroup4 | true | false |
    // |-----------+--------------|
    // |      true |    1 |     2 |
    // |-----------|------|-------|
    // |     false |    3 |     4 |
    // |-----------|------|-------|
    // |           |    5 |     6 |
    // ----------------------------
    var matrixRowGroupColumnGroupWithBooleanAndNullOneMeasure = {
        rows: {
            root: {
                children: [
                    {
                        level: 0,
                        value: true,
                        values: {
                            0: { value: 1 },
                            1: { value: 2 }
                        }
                    },
                    {
                        level: 0,
                        value: false,
                        values: {
                            0: { value: 3 },
                            1: { value: 4 }
                        }
                    },
                    {
                        level: 0,
                        values: {
                            0: { value: 5 },
                            1: { value: 6 }
                        }
                    }
                ]
            },
            levels: [{ sources: [rowGroupSource4] }]
        },
        columns: {
            root: {
                children: [
                    {
                        level: 0,
                        value: true
                    },
                    {
                        level: 0,
                        value: false
                    }
                ]
            },
            levels: [{ sources: [columnGroupSource4] }]
        },
        valueSources: [measureSource1]
    };
    // ------------------------------------
    // | RowGroup4 | true | false | Total |
    // |-----------+----------------------|
    // |      true |    1 |     2 |   3   |
    // |-----------|------|-------|-------|
    // |     false |    3 |     4 |   7   |
    // |-----------|------|-------|-------|
    // |           |    5 |     6 |   11  |
    // |-----------|------|-------|-------|
    // |    Total  |    9 |    12 |   21  |
    // |----------------------------------|
    var matrixRowGroupColumnGroupWithBooleanAndNullOneMeasureBothTotals = {
        rows: {
            root: {
                children: [
                    {
                        level: 0,
                        value: true,
                        values: {
                            0: { value: 1 },
                            1: { value: 2 },
                            2: { value: 3 }
                        }
                    },
                    {
                        level: 0,
                        value: false,
                        values: {
                            0: { value: 3 },
                            1: { value: 4 },
                            2: { value: 7 }
                        }
                    },
                    {
                        level: 0,
                        values: {
                            0: { value: 5 },
                            1: { value: 6 },
                            2: { value: 11 }
                        }
                    },
                    {
                        level: 0,
                        isSubtotal: true,
                        values: {
                            0: { value: 5 },
                            1: { value: 6 },
                            2: { value: 21 }
                        }
                    }
                ]
            },
            levels: [{ sources: [rowGroupSource4] }]
        },
        columns: {
            root: {
                children: [
                    {
                        level: 0,
                        value: true
                    },
                    {
                        level: 0,
                        value: false
                    },
                    {
                        level: 0,
                        isSubtotal: true
                    }
                ]
            },
            levels: [{ sources: [columnGroupSource4] }]
        },
        valueSources: [measureSource1]
    };
    // --------------------------------------------------------------------------------------------------------------
    // |               |     ColGroup1 |                           1992 |                           1996 |    Total |
    // |---------------|---------------|--------------------------------|--------------------------------|          |
    // |     RowGroup1 |     RowGroup2 |   Silver |     Gold |    Total |   Silver |     Gold |    Total |          |
    // |---------------|---------------|----------|----------|----------|----------|----------|----------|----------|
    // |          Asia |   South Korea |        1 |        2 |        3 |        4 |        5 |        9 |       12 |
    // |               |---------------|----------|----------|----------|----------|----------|----------|----------|
    // |               |  Unified Team |       11 |       12 |       23 |       14 |       15 |       29 |       52 |
    // |               |---------------|----------|----------|----------|----------|----------|----------|----------|
    // |               |         Total |       12 |       14 |       26 |       18 |       20 |       38 |       64 |
    // |---------------|---------------|----------|----------|----------|----------|----------|----------|----------|
    // |        Europe |        France |       21 |       22 |       43 |       24 |       25 |       49 |       92 |
    // |               |---------------|----------|----------|----------|----------|----------|----------|----------|
    // |               |       Germany |       31 |       32 |       63 |       34 |       35 |       69 |      132 |
    // |               |---------------|----------|----------|----------|----------|----------|----------|----------|
    // |               |         Total |       52 |       54 |      106 |       58 |       60 |      118 |      224 |
    // |---------------|---------------|----------|----------|----------|----------|----------|----------|----------|
    // | North America | United States |       41 |       42 |       83 |       44 |       45 |       89 |      172 |
    // |               |---------------|----------|----------|----------|----------|----------|----------|----------|
    // |               |         Total |       41 |       42 |       83 |       44 |       45 |       89 |      172 |
    // |---------------|---------------|----------|----------|----------|----------|----------|----------|----------|
    // |       Oceania |     Australia |       51 |       52 |      103 |       54 |       55 |      109 |      212 |
    // |               |---------------|----------|----------|----------|----------|----------|----------|----------|
    // |               |         Total |       51 |       52 |      103 |       54 |       55 |      109 |      212 |
    // |-------------------------------|----------|----------|----------|----------|----------|----------|----------|
    // |         Total                 |      156 |      162 |      318 |      174 |      180 |      354 |      672 |
    // --------------------------------------------------------------------------------------------------------------
    var matrixTwoRowGroupsTwoColumnGroupsOneMeasureAndTotals = {
        rows: {
            root: {
                children: [
                    {
                        level: 0,
                        value: 'Asia',
                        children: [
                            {
                                level: 1,
                                value: 'South Korea',
                                values: {
                                    0: { value: 1 },
                                    1: { value: 2 },
                                    2: { value: 3 },
                                    3: { value: 4 },
                                    4: { value: 5 },
                                    5: { value: 9 },
                                    6: { value: 12 }
                                }
                            },
                            {
                                level: 1,
                                value: 'Unified Team',
                                values: {
                                    0: { value: 11 },
                                    1: { value: 12 },
                                    2: { value: 23 },
                                    3: { value: 14 },
                                    4: { value: 15 },
                                    5: { value: 29 },
                                    6: { value: 52 }
                                }
                            },
                            {
                                level: 1,
                                isSubtotal: true,
                                values: {
                                    0: { value: 12 },
                                    1: { value: 14 },
                                    2: { value: 26 },
                                    3: { value: 18 },
                                    4: { value: 20 },
                                    5: { value: 38 },
                                    6: { value: 64 }
                                }
                            }
                        ]
                    },
                    {
                        level: 0,
                        value: 'Europe',
                        children: [
                            {
                                level: 1,
                                value: 'France',
                                values: {
                                    0: { value: 21 },
                                    1: { value: 22 },
                                    2: { value: 43 },
                                    3: { value: 24 },
                                    4: { value: 25 },
                                    5: { value: 49 },
                                    6: { value: 92 }
                                }
                            },
                            {
                                level: 1,
                                value: 'Germany',
                                values: {
                                    0: { value: 31 },
                                    1: { value: 32 },
                                    2: { value: 63 },
                                    3: { value: 34 },
                                    4: { value: 35 },
                                    5: { value: 69 },
                                    6: { value: 132 }
                                }
                            },
                            {
                                level: 1,
                                isSubtotal: true,
                                values: {
                                    0: { value: 52 },
                                    1: { value: 54 },
                                    2: { value: 106 },
                                    3: { value: 58 },
                                    4: { value: 60 },
                                    5: { value: 118 },
                                    6: { value: 224 }
                                }
                            }
                        ]
                    },
                    {
                        level: 0,
                        value: 'North America',
                        children: [
                            {
                                level: 1,
                                value: 'United States',
                                values: {
                                    0: { value: 41 },
                                    1: { value: 42 },
                                    2: { value: 83 },
                                    3: { value: 44 },
                                    4: { value: 45 },
                                    5: { value: 89 },
                                    6: { value: 172 }
                                }
                            },
                            {
                                level: 1,
                                isSubtotal: true,
                                values: {
                                    0: { value: 41 },
                                    1: { value: 42 },
                                    2: { value: 83 },
                                    3: { value: 44 },
                                    4: { value: 45 },
                                    5: { value: 89 },
                                    6: { value: 172 }
                                }
                            }
                        ]
                    },
                    {
                        level: 0,
                        value: 'Oceania',
                        children: [
                            {
                                level: 1,
                                value: 'Australia',
                                values: {
                                    0: { value: 51 },
                                    1: { value: 52 },
                                    2: { value: 103 },
                                    3: { value: 54 },
                                    4: { value: 55 },
                                    5: { value: 109 },
                                    6: { value: 212 }
                                }
                            },
                            {
                                level: 1,
                                isSubtotal: true,
                                values: {
                                    0: { value: 51 },
                                    1: { value: 52 },
                                    2: { value: 103 },
                                    3: { value: 54 },
                                    4: { value: 55 },
                                    5: { value: 109 },
                                    6: { value: 212 }
                                }
                            }
                        ]
                    },
                    {
                        level: 0,
                        isSubtotal: true,
                        values: {
                            0: { value: 156 },
                            1: { value: 162 },
                            2: { value: 318 },
                            3: { value: 174 },
                            4: { value: 180 },
                            5: { value: 354 },
                            6: { value: 672 }
                        }
                    }
                ]
            },
            levels: [
                { sources: [rowGroupSource1] },
                { sources: [rowGroupSource2] }
            ]
        },
        columns: {
            root: {
                children: [
                    {
                        level: 0,
                        value: 1992,
                        children: [
                            {
                                level: 1,
                                value: 'Silver'
                            },
                            {
                                level: 1,
                                value: 'Gold'
                            },
                            {
                                level: 1,
                                isSubtotal: true
                            }
                        ]
                    },
                    {
                        level: 0,
                        value: 1996,
                        children: [
                            {
                                level: 1,
                                value: 'Silver'
                            },
                            {
                                level: 1,
                                value: 'Gold'
                            },
                            {
                                level: 1,
                                isSubtotal: true
                            }
                        ]
                    },
                    {
                        level: 0,
                        isSubtotal: true
                    }
                ]
            },
            levels: [
                { sources: [columnGroupSource1] },
                { sources: [columnGroupSource2] }
            ]
        },
        valueSources: [measureSource1]
    };
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // |               |     ColGroup1 |                                                            1992 |                                                            1996 |               Total |
    // |---------------|---------------|-----------------------------------------------------------------|-----------------------------------------------------------------|                     |
    // |               |     ColGroup2 |              Silver |                Gold |               Total |              Silver |                Gold |               Total |                     |
    // |---------------|---------------|---------------------|---------------------|---------------------|---------------------|---------------------|---------------------|---------------------|
    // |     RowGroup1 |     RowGroup2 | Measure1 | Measure2 | Measure1 | Measure2 | Measure1 | Measure2 | Measure1 | Measure2 | Measure1 | Measure2 | Measure1 | Measure2 | Measure1 | Measure2 |
    // |-------------------------------+-----------------------------------------------------------------------------------------------------------------------------------|----------|----------|
    // |          Asia |   South Korea |        0 |        1 |        2 |        3 |        2 |        4 |        6 |        7 |        8 |        9 |       14 |       16 |       16 |       20 |
    // |               |---------------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
    // |               |  Unified Team |       12 |       13 |       14 |       15 |       26 |       28 |       18 |       19 |       20 |       21 |       38 |       40 |       64 |       68 |
    // |               |---------------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
    // |               |         Total |       12 |       14 |       16 |       18 |       28 |       32 |       24 |       26 |       28 |       30 |       52 |       56 |       80 |       88 |
    // |---------------|---------------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
    // |        Europe |        France |       24 |       25 |       26 |       27 |       50 |       52 |       30 |       31 |       32 |       33 |       62 |       64 |      112 |      116 |
    // |               |---------------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
    // |               |       Germany |       36 |       37 |       38 |       39 |       74 |       76 |       42 |       43 |       44 |       45 |       86 |       88 |      160 |      164 |
    // |               |---------------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
    // |               |         Total |       60 |       62 |       64 |       66 |      124 |      128 |       72 |       74 |       76 |       78 |      148 |      152 |      272 |      280 |
    // |---------------|---------------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
    // | North America | United States |       48 |       49 |       50 |       51 |       98 |      100 |       54 |       55 |       56 |       57 |      110 |      112 |      208 |      212 |
    // |               |---------------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
    // |               |         Total |       48 |       49 |       50 |       51 |       98 |      100 |       54 |       55 |       56 |       57 |      110 |      112 |      208 |      212 |
    // |---------------|---------------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
    // |       Oceania |     Australia |       60 |       61 |       62 |       63 |      122 |      124 |       66 |       67 |       68 |       69 |      134 |      136 |      256 |      260 |
    // |               |---------------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
    // |               |         Total |       60 |       61 |       62 |       63 |      122 |      124 |       66 |       67 |       68 |       69 |      134 |      136 |      256 |      260 |
    // |-------------------------------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
    // |         Total                 |      180 |      186 |      192 |      198 |      372 |      384 |      216 |      222 |      228 |      234 |      444 |      456 |      816 |      840 |
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    var matrixTwoRowGroupsTwoColumnGroupsTwoMeasuresAndTotals = {
        rows: {
            root: {
                children: [
                    {
                        level: 0,
                        value: 'Asia',
                        children: [
                            {
                                level: 1,
                                value: 'South Korea',
                                values: {
                                    0: { value: 0 },
                                    1: { value: 1, valueSourceIndex: 1 },
                                    2: { value: 2 },
                                    3: { value: 3, valueSourceIndex: 1 },
                                    4: { value: 2 },
                                    5: { value: 4, valueSourceIndex: 1 },
                                    6: { value: 6 },
                                    7: { value: 7, valueSourceIndex: 1 },
                                    8: { value: 8 },
                                    9: { value: 9, valueSourceIndex: 1 },
                                    10: { value: 14 },
                                    11: { value: 16, valueSourceIndex: 1 },
                                    12: { value: 16 },
                                    13: { value: 20, valueSourceIndex: 1 }
                                }
                            },
                            {
                                level: 1,
                                value: 'Unified Team',
                                values: {
                                    0: { value: 12 },
                                    1: { value: 13, valueSourceIndex: 1 },
                                    2: { value: 14 },
                                    3: { value: 15, valueSourceIndex: 1 },
                                    4: { value: 26 },
                                    5: { value: 28, valueSourceIndex: 1 },
                                    6: { value: 18 },
                                    7: { value: 19, valueSourceIndex: 1 },
                                    8: { value: 20 },
                                    9: { value: 21, valueSourceIndex: 1 },
                                    10: { value: 38 },
                                    11: { value: 40, valueSourceIndex: 1 },
                                    12: { value: 64 },
                                    13: { value: 68, valueSourceIndex: 1 }
                                }
                            },
                            {
                                level: 1,
                                isSubtotal: true,
                                values: {
                                    0: { value: 12 },
                                    1: { value: 14, valueSourceIndex: 1 },
                                    2: { value: 16 },
                                    3: { value: 18, valueSourceIndex: 1 },
                                    4: { value: 28 },
                                    5: { value: 32, valueSourceIndex: 1 },
                                    6: { value: 24 },
                                    7: { value: 26, valueSourceIndex: 1 },
                                    8: { value: 28 },
                                    9: { value: 30, valueSourceIndex: 1 },
                                    10: { value: 52 },
                                    11: { value: 56, valueSourceIndex: 1 },
                                    12: { value: 80 },
                                    13: { value: 88, valueSourceIndex: 1 }
                                }
                            }
                        ]
                    },
                    {
                        level: 0,
                        value: 'Europe',
                        children: [
                            {
                                level: 1,
                                value: 'France',
                                values: {
                                    0: { value: 24 },
                                    1: { value: 25, valueSourceIndex: 1 },
                                    2: { value: 26 },
                                    3: { value: 27, valueSourceIndex: 1 },
                                    4: { value: 50 },
                                    5: { value: 52, valueSourceIndex: 1 },
                                    6: { value: 30 },
                                    7: { value: 31, valueSourceIndex: 1 },
                                    8: { value: 32 },
                                    9: { value: 33, valueSourceIndex: 1 },
                                    10: { value: 62 },
                                    11: { value: 64, valueSourceIndex: 1 },
                                    12: { value: 112 },
                                    13: { value: 116, valueSourceIndex: 1 }
                                }
                            },
                            {
                                level: 1,
                                value: 'Germany',
                                values: {
                                    0: { value: 36 },
                                    1: { value: 37, valueSourceIndex: 1 },
                                    2: { value: 38 },
                                    3: { value: 39, valueSourceIndex: 1 },
                                    4: { value: 74 },
                                    5: { value: 74, valueSourceIndex: 1 },
                                    6: { value: 42 },
                                    7: { value: 43, valueSourceIndex: 1 },
                                    8: { value: 44 },
                                    9: { value: 45, valueSourceIndex: 1 },
                                    10: { value: 86 },
                                    11: { value: 88, valueSourceIndex: 1 },
                                    12: { value: 160 },
                                    13: { value: 164, valueSourceIndex: 1 }
                                }
                            },
                            {
                                level: 1,
                                isSubtotal: true,
                                values: {
                                    0: { value: 60 },
                                    1: { value: 62, valueSourceIndex: 1 },
                                    2: { value: 64 },
                                    3: { value: 66, valueSourceIndex: 1 },
                                    4: { value: 124 },
                                    5: { value: 128, valueSourceIndex: 1 },
                                    6: { value: 72 },
                                    7: { value: 74, valueSourceIndex: 1 },
                                    8: { value: 76 },
                                    9: { value: 78, valueSourceIndex: 1 },
                                    10: { value: 148 },
                                    11: { value: 152, valueSourceIndex: 1 },
                                    12: { value: 272 },
                                    13: { value: 280, valueSourceIndex: 1 }
                                }
                            }
                        ]
                    },
                    {
                        level: 0,
                        value: 'North America',
                        children: [
                            {
                                level: 1,
                                value: 'United States',
                                values: {
                                    0: { value: 48 },
                                    1: { value: 49, valueSourceIndex: 1 },
                                    2: { value: 50 },
                                    3: { value: 51, valueSourceIndex: 1 },
                                    4: { value: 98 },
                                    5: { value: 100, valueSourceIndex: 1 },
                                    6: { value: 54 },
                                    7: { value: 55, valueSourceIndex: 1 },
                                    8: { value: 56 },
                                    9: { value: 57, valueSourceIndex: 1 },
                                    10: { value: 110 },
                                    11: { value: 112, valueSourceIndex: 1 },
                                    12: { value: 208 },
                                    13: { value: 212, valueSourceIndex: 1 }
                                }
                            },
                            {
                                level: 1,
                                isSubtotal: true,
                                values: {
                                    0: { value: 48 },
                                    1: { value: 49, valueSourceIndex: 1 },
                                    2: { value: 50 },
                                    3: { value: 51, valueSourceIndex: 1 },
                                    4: { value: 98 },
                                    5: { value: 100, valueSourceIndex: 1 },
                                    6: { value: 54 },
                                    7: { value: 55, valueSourceIndex: 1 },
                                    8: { value: 56 },
                                    9: { value: 57, valueSourceIndex: 1 },
                                    10: { value: 110 },
                                    11: { value: 112, valueSourceIndex: 1 },
                                    12: { value: 208 },
                                    13: { value: 212, valueSourceIndex: 1 }
                                }
                            }
                        ]
                    },
                    {
                        level: 0,
                        value: 'Oceania',
                        children: [
                            {
                                level: 1,
                                value: 'Australia',
                                values: {
                                    0: { value: 60 },
                                    1: { value: 61, valueSourceIndex: 1 },
                                    2: { value: 62 },
                                    3: { value: 63, valueSourceIndex: 1 },
                                    4: { value: 122 },
                                    5: { value: 124, valueSourceIndex: 1 },
                                    6: { value: 66 },
                                    7: { value: 67, valueSourceIndex: 1 },
                                    8: { value: 68 },
                                    9: { value: 69, valueSourceIndex: 1 },
                                    10: { value: 134 },
                                    11: { value: 136, valueSourceIndex: 1 },
                                    12: { value: 256 },
                                    13: { value: 260, valueSourceIndex: 1 }
                                }
                            },
                            {
                                level: 1,
                                isSubtotal: true,
                                values: {
                                    0: { value: 60 },
                                    1: { value: 61, valueSourceIndex: 1 },
                                    2: { value: 62 },
                                    3: { value: 63, valueSourceIndex: 1 },
                                    4: { value: 122 },
                                    5: { value: 124, valueSourceIndex: 1 },
                                    6: { value: 66 },
                                    7: { value: 67, valueSourceIndex: 1 },
                                    8: { value: 68 },
                                    9: { value: 69, valueSourceIndex: 1 },
                                    10: { value: 134 },
                                    11: { value: 136, valueSourceIndex: 1 },
                                    12: { value: 256 },
                                    13: { value: 260, valueSourceIndex: 1 }
                                }
                            }
                        ]
                    },
                    {
                        level: 0,
                        isSubtotal: true,
                        values: {
                            0: { value: 180 },
                            1: { value: 186, valueSourceIndex: 1 },
                            2: { value: 192 },
                            3: { value: 198, valueSourceIndex: 1 },
                            4: { value: 372 },
                            5: { value: 384, valueSourceIndex: 1 },
                            6: { value: 216 },
                            7: { value: 222, valueSourceIndex: 1 },
                            8: { value: 228 },
                            9: { value: 234, valueSourceIndex: 1 },
                            10: { value: 444 },
                            11: { value: 456, valueSourceIndex: 1 },
                            12: { value: 816 },
                            13: { value: 840, valueSourceIndex: 1 }
                        }
                    }
                ]
            },
            levels: [
                { sources: [rowGroupSource1] },
                { sources: [rowGroupSource2] }
            ]
        },
        columns: {
            root: {
                children: [
                    {
                        level: 0,
                        value: 1992,
                        children: [
                            {
                                level: 1,
                                value: 'Silver',
                                children: [
                                    {
                                        level: 2
                                    },
                                    {
                                        level: 2,
                                        levelSourceIndex: 1
                                    }
                                ]
                            },
                            {
                                level: 1,
                                value: 'Gold',
                                children: [
                                    {
                                        level: 2
                                    },
                                    {
                                        level: 2,
                                        levelSourceIndex: 1
                                    }
                                ]
                            },
                            {
                                level: 1,
                                isSubtotal: true,
                                children: [
                                    {
                                        level: 2,
                                        isSubtotal: true
                                    },
                                    {
                                        level: 2,
                                        levelSourceIndex: 1,
                                        isSubtotal: true
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        level: 0,
                        value: 1996,
                        children: [
                            {
                                level: 1,
                                value: 'Silver',
                                children: [
                                    {
                                        level: 2
                                    },
                                    {
                                        level: 2,
                                        levelSourceIndex: 1
                                    }
                                ]
                            },
                            {
                                level: 1,
                                value: 'Gold',
                                children: [
                                    {
                                        level: 2
                                    },
                                    {
                                        level: 2,
                                        levelSourceIndex: 1
                                    }
                                ]
                            },
                            {
                                level: 1,
                                isSubtotal: true,
                                children: [
                                    {
                                        level: 2,
                                        isSubtotal: true
                                    },
                                    {
                                        level: 2,
                                        levelSourceIndex: 1,
                                        isSubtotal: true
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        level: 0,
                        isSubtotal: true,
                        children: [
                            {
                                level: 2,
                                isSubtotal: true
                            },
                            {
                                level: 2,
                                levelSourceIndex: 1,
                                isSubtotal: true
                            }
                        ]
                    }
                ]
            },
            levels: [
                { sources: [columnGroupSource1] },
                { sources: [columnGroupSource2] },
                {
                    sources: [
                        measureSource1,
                        measureSource2
                    ]
                }
            ]
        },
        valueSources: [
            measureSource1,
            measureSource2
        ]
    };
    describe('Matrix', function () {
        it('Matrix registered capabilities', function () {
            expect(powerbi.visuals.visualPluginFactory.create().getPlugin('matrix').capabilities).toBe(Matrix.capabilities);
        });
        it('Capabilities should include dataViewMappings', function () {
            expect(Matrix.capabilities.dataViewMappings).toBeDefined();
        });
        it('Capabilities should include dataRoles', function () {
            expect(Matrix.capabilities.dataRoles).toBeDefined();
        });
        it('Capabilities should include row windowing', function () {
            expect(Matrix.capabilities.dataViewMappings[0].matrix.rows.dataReductionAlgorithm).toBeDefined();
        });
        it('Capabilities should allow measure only matrices', function () {
            var allowedProjections1 = {
                'Values': [{ queryRef: '0' }]
            };
            var allowedProjections2 = {
                'Values': [
                    { queryRef: '0' },
                    { queryRef: '1' },
                    { queryRef: '2' }
                ]
            };
            var dataViewMappings = Matrix.capabilities.dataViewMappings;
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections1, dataViewMappings)).toEqual(dataViewMappings);
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections2, dataViewMappings)).toEqual(dataViewMappings);
        });
        it('Capabilities should allow matrices with row groups only', function () {
            var allowedProjections1 = {
                'Rows': [{ queryRef: '0' }]
            };
            var allowedProjections2 = {
                'Rows': [
                    { queryRef: '2' },
                    { queryRef: '0' },
                    { queryRef: '1' }
                ]
            };
            var dataViewMappings = Matrix.capabilities.dataViewMappings;
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections1, dataViewMappings)).toEqual(dataViewMappings);
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections2, dataViewMappings)).toEqual(dataViewMappings);
        });
        it('Capabilities should allow matrices with row groups and arbitrary number of measures', function () {
            var allowedProjections1 = {
                'Rows': [{ queryRef: '0' }],
                'Values': [
                    { queryRef: '1' },
                    { queryRef: '2' },
                    { queryRef: '3' }
                ]
            };
            var allowedProjections2 = {
                'Rows': [
                    { queryRef: '3' },
                    { queryRef: '2' },
                    { queryRef: '1' }
                ],
                'Values': [
                    { queryRef: '0' }
                ]
            };
            var allowedProjections3 = {
                'Rows': [
                    { queryRef: '1' },
                    { queryRef: '0' }
                ],
                'Values': [
                    { queryRef: '2' },
                    { queryRef: '3' }
                ]
            };
            var allowedProjections4 = {
                'Rows': [
                    { queryRef: '0' }
                ],
                'Values': [
                    { queryRef: '1' }
                ]
            };
            var dataViewMappings = Matrix.capabilities.dataViewMappings;
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections1, dataViewMappings)).toEqual(dataViewMappings);
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections2, dataViewMappings)).toEqual(dataViewMappings);
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections3, dataViewMappings)).toEqual(dataViewMappings);
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections4, dataViewMappings)).toEqual(dataViewMappings);
        });
        it('Capabilities should allow matrices with column groups only', function () {
            var allowedProjections1 = {
                'Columns': [{ queryRef: '0' }]
            };
            var allowedProjections2 = {
                'Columns': [
                    { queryRef: '2' },
                    { queryRef: '0' },
                    { queryRef: '1' }
                ]
            };
            var dataViewMappings = Matrix.capabilities.dataViewMappings;
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections1, dataViewMappings)).toEqual(dataViewMappings);
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections2, dataViewMappings)).toEqual(dataViewMappings);
        });
        it('Capabilities should allow matrices with column groups and measures', function () {
            var allowedProjections1 = {
                'Columns': [{ queryRef: '1' }],
                'Values': [
                    { queryRef: '2' },
                    { queryRef: '3' },
                    { queryRef: '0' }
                ]
            };
            var allowedProjections2 = {
                'Columns': [
                    { queryRef: '0' },
                    { queryRef: '2' },
                    { queryRef: '1' }
                ],
                'Values': [
                    { queryRef: '3' }
                ]
            };
            var allowedProjections3 = {
                'Columns': [
                    { queryRef: '3' },
                    { queryRef: '2' }
                ],
                'Values': [
                    { queryRef: '0' },
                    { queryRef: '1' }
                ]
            };
            var allowedProjections4 = {
                'Columns': [
                    { queryRef: '1' }
                ],
                'Values': [
                    { queryRef: '0' }
                ]
            };
            var dataViewMappings = Matrix.capabilities.dataViewMappings;
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections1, dataViewMappings)).toEqual(dataViewMappings);
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections2, dataViewMappings)).toEqual(dataViewMappings);
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections3, dataViewMappings)).toEqual(dataViewMappings);
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections4, dataViewMappings)).toEqual(dataViewMappings);
        });
        it('Capabilities should allow matrices with row groups and arbitrary number of column groups and measures', function () {
            var allowedProjections1 = {
                'Rows': [
                    { queryRef: '0' }
                ],
                'Columns': [
                    { queryRef: '1' }
                ],
                'Values': [
                    { queryRef: '2' }
                ]
            };
            var allowedProjections2 = {
                'Rows': [
                    { queryRef: '0' },
                    { queryRef: '1' }
                ],
                'Columns': [
                    { queryRef: '2' },
                    { queryRef: '3' }
                ],
                'Values': [
                    { queryRef: '4' }
                ]
            };
            var allowedProjections3 = {
                'Rows': [
                    { queryRef: '0' },
                    { queryRef: '1' }
                ],
                'Columns': [
                    { queryRef: '2' }
                ],
                'Values': [
                    { queryRef: '3' },
                    { queryRef: '4' }
                ]
            };
            var allowedProjections4 = {
                'Rows': [
                    { queryRef: '0' }
                ],
                'Columns': [
                    { queryRef: '1' },
                    { queryRef: '2' }
                ],
                'Values': [
                    { queryRef: '3' },
                    { queryRef: '4' }
                ]
            };
            var dataViewMappings = Matrix.capabilities.dataViewMappings;
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections1, dataViewMappings)).toEqual(dataViewMappings);
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections2, dataViewMappings)).toEqual(dataViewMappings);
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections3, dataViewMappings)).toEqual(dataViewMappings);
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections4, dataViewMappings)).toEqual(dataViewMappings);
        });
        it('Capabilities should suppressDefaultTitle', function () {
            expect(Matrix.capabilities.suppressDefaultTitle).toBe(true);
        });
        it('FormatString property should match calculated', function () {
            expect(powerbi.data.DataViewObjectDescriptors.findFormatString(Matrix.capabilities.objects)).toEqual(Matrix.formatStringProp);
        });
        it('CustomizeQuery picks up enabled row subtotals', function () {
            var objects = {
                general: {
                    rowSubtotals: true,
                    columnSubtotals: false
                }
            };
            var dataViewMapping = createCompiledDataViewMapping(objects);
            Matrix.customizeQuery({
                dataViewMappings: [dataViewMapping]
            });
            expect(dataViewMapping.matrix.rows.for.in.subtotalType).toEqual(2 /* After */);
            expect(dataViewMapping.matrix.columns.for.in.subtotalType).toEqual(0 /* None */);
        });
        it('CustomizeQuery picks up enabled column subtotals', function () {
            var objects = {
                general: {
                    rowSubtotals: false,
                    columnSubtotals: true
                }
            };
            var dataViewMapping = createCompiledDataViewMapping(objects);
            Matrix.customizeQuery({
                dataViewMappings: [dataViewMapping]
            });
            expect(dataViewMapping.matrix.rows.for.in.subtotalType).toEqual(0 /* None */);
            expect(dataViewMapping.matrix.columns.for.in.subtotalType).toEqual(2 /* After */);
        });
        it('CustomizeQuery picks up enabled row and column subtotals', function () {
            var objects = {
                general: {
                    rowSubtotals: true,
                    columnSubtotals: true
                }
            };
            var dataViewMapping = createCompiledDataViewMapping(objects);
            Matrix.customizeQuery({
                dataViewMappings: [dataViewMapping]
            });
            expect(dataViewMapping.matrix.rows.for.in.subtotalType).toEqual(2 /* After */);
            expect(dataViewMapping.matrix.columns.for.in.subtotalType).toEqual(2 /* After */);
        });
        it('CustomizeQuery handles missing settings', function () {
            var dataViewMapping = createCompiledDataViewMapping();
            Matrix.customizeQuery({
                dataViewMappings: [dataViewMapping]
            });
            // Totals default to Enabled (After)
            expect(dataViewMapping.matrix.rows.for.in.subtotalType).toEqual(2 /* After */);
            expect(dataViewMapping.matrix.columns.for.in.subtotalType).toEqual(2 /* After */);
        });
        it('CustomizeQuery handles missing subtotal settings', function () {
            var objects = {
                general: {
                    rowSubtotals: undefined,
                    columnSubtotals: undefined
                }
            };
            var dataViewMapping = createCompiledDataViewMapping(objects);
            Matrix.customizeQuery({
                dataViewMappings: [dataViewMapping]
            });
            // Totals default to Enabled (After)
            expect(dataViewMapping.matrix.rows.for.in.subtotalType).toEqual(2 /* After */);
            expect(dataViewMapping.matrix.columns.for.in.subtotalType).toEqual(2 /* After */);
        });
        function createCompiledDataViewMapping(objects) {
            return {
                metadata: {
                    objects: objects
                },
                matrix: {
                    rows: {
                        for: {
                            in: { role: 'Rows', items: [] }
                        }
                    },
                    columns: {
                        for: {
                            in: { role: 'Columns', items: [] }
                        }
                    }
                }
            };
        }
    });
    describe('Tablix control tests', function () {
        it('touch disabled', function () {
            var matrix = matrixOneMeasure;
            var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
            var binder = new powerbi.visuals.MatrixBinder(navigator, {});
            var parent = document.createElement('div');
            var tablixControl = new powerbi.visuals.controls.TablixControl(navigator, binder, parent, { interactive: true, enableTouchSupport: false });
            expect(tablixControl['_touchManager']).toBeUndefined();
        });
    });
    describe('Matrix hierarchy navigator tests', function () {
        describe('getDepth', function () {
            it('returns the correct depth for an empty hierarchy', function () {
                var matrix = matrixThreeRowGroupsOneGroupInstance;
                var columnHierarchy = matrix.columns.root.children;
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getDepth(columnHierarchy)).toBe(1);
            });
            it('returns the correct depth for a measure only hierarchy', function () {
                var matrix = matrixOneMeasure;
                var columnHierarchy = matrix.columns.root.children;
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getDepth(columnHierarchy)).toBe(1);
            });
            it('returns the correct depth for group only hierarchy', function () {
                var matrix = matrixThreeMeasuresThreeRowGroups;
                var rowHierarchy = matrix.rows.root.children;
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getDepth(rowHierarchy)).toBe(3);
            });
            it('returns the correct depth for group and measure hierarchy', function () {
                var matrix = matrixTwoRowGroupsTwoColumnGroupsTwoMeasures;
                var columnHierarchy = matrix.columns.root.children;
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getDepth(columnHierarchy)).toBe(3);
            });
        });
        describe('getLeafCount', function () {
            it('returns the right leaf count for a placeholder hierarchy', function () {
                var matrix = matrixOneMeasure;
                var rowHierarchy = matrix.rows.root.children;
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getLeafCount(rowHierarchy)).toBe(1);
            });
            it('returns the right leaf count for an empty hierarchy', function () {
                var matrix = matrixThreeRowGroupsOneGroupInstance;
                var columnHierarchy = matrix.columns.root.children;
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getLeafCount(columnHierarchy)).toBe(0);
            });
            it('returns the right leaf count for a one level deep hierarchy', function () {
                var matrix = matrixOneMeasureOneRowGroupOneGroupInstance;
                var rowHierarchy = matrix.rows.root.children;
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getLeafCount(rowHierarchy)).toBe(1);
            });
            it('returns the right leaf count for a three level deep hierarchy', function () {
                var matrix = matrixTwoRowGroupsTwoColumnGroupsTwoMeasures;
                var columnHierarchy = matrix.columns.root.children;
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getLeafCount(columnHierarchy)).toBe(12);
            });
        });
        describe('getLeafAt', function () {
            it('returns the correct leaf from a placeholder hierarchy', function () {
                var matrix = matrixOneMeasureOneColumnGroupOneGroupInstance;
                var rowHierarchy = matrix.rows.root.children;
                var rowHierarchyItem = rowHierarchy[0];
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getLeafAt(rowHierarchy, 0)).toBe(rowHierarchyItem);
            });
            it('returns the correct leaf from a one level deep hierarchy', function () {
                var matrix = matrixOneMeasureOneColumnGroupOneGroupInstance;
                var columnHierarchy = matrix.columns.root.children;
                var columnHierarchyItem = columnHierarchy[0];
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getLeafAt(columnHierarchy, 0)).toBe(columnHierarchyItem);
            });
            it('returns the correct leaf from a three level deep hierarchy', function () {
                var matrix = matrixThreeMeasuresThreeRowGroups;
                var rowHierarchy = matrix.rows.root.children;
                var rowHierarchyItem = rowHierarchy[1].children[1].children[1];
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getLeafAt(rowHierarchy, 7)).toBe(rowHierarchyItem);
            });
        });
        describe('getParent', function () {
            it('returns null for outermost node in a one level deep hierarchy', function () {
                var matrix = matrixOneMeasureOneRowGroupOneGroupInstance;
                var node = matrix.columns.root.children[0];
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getParent(node)).toBeNull();
            });
            it('returns null for outermost node in a three level deep hierarchy', function () {
                var matrix = matrixThreeRowGroupsThreeColumnGroupsOneInstance;
                var node = matrix.rows.root.children[0];
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getParent(node)).toBeNull();
            });
            it('returns the correct parent for an innermost node in a three level deep hierarchy', function () {
                var matrix = matrixTwoRowGroupsTwoColumnGroupsTwoMeasures;
                var parentNode = matrix.columns.root.children[1].children[1];
                var node = parentNode.children[1];
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getParent(node)).toBe(parentNode);
            });
            it('returns the correct parent for a non-innermost node in a three level deep hierarchy', function () {
                var matrix = matrixTwoRowGroupsTwoColumnGroupsTwoMeasures;
                var parentNode = matrix.columns.root.children[0];
                var node = parentNode.children[1];
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getParent(node)).toBe(parentNode);
            });
        });
        describe('getIndex', function () {
            it('returns the correct index for outermost nodes', function () {
                var matrix = matrixTwoRowGroupsTwoColumnGroupsTwoMeasures;
                var rowHierarchy = matrix.rows.root.children;
                var rowHierarchyItem0 = rowHierarchy[0];
                var rowHierarchyItem1 = rowHierarchy[1];
                var rowHierarchyItem2 = rowHierarchy[2];
                var rowHierarchyItem3 = rowHierarchy[3];
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getIndex(rowHierarchyItem0)).toBe(0);
                expect(navigator.getIndex(rowHierarchyItem1)).toBe(1);
                expect(navigator.getIndex(rowHierarchyItem2)).toBe(2);
                expect(navigator.getIndex(rowHierarchyItem3)).toBe(3);
            });
            it('returns the correct index for innermost nodes', function () {
                var matrix = matrixThreeRowGroups;
                var rowHierarchy = matrix.rows.root.children;
                var rowHierarchyItem0 = rowHierarchy[0].children[0].children[0];
                var rowHierarchyItem1 = rowHierarchy[0].children[0].children[1];
                var rowHierarchyItemAgain0 = rowHierarchy[1].children[1].children[0];
                var rowHierarchyItemAgain1 = rowHierarchy[1].children[1].children[1];
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getIndex(rowHierarchyItem0)).toBe(0);
                expect(navigator.getIndex(rowHierarchyItem1)).toBe(1);
                expect(navigator.getIndex(rowHierarchyItemAgain0)).toBe(0);
                expect(navigator.getIndex(rowHierarchyItemAgain1)).toBe(1);
            });
            it('returns the correct index for non-innermost nodes', function () {
                var matrix = matrixThreeRowGroups;
                var rowHierarchy = matrix.rows.root.children;
                var rowHierarchyItem0 = rowHierarchy[0].children[0];
                var rowHierarchyItem1 = rowHierarchy[0].children[1];
                var rowHierarchyItemAgain0 = rowHierarchy[1].children[0];
                var rowHierarchyItemAgain1 = rowHierarchy[1].children[1];
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getIndex(rowHierarchyItem0)).toBe(0);
                expect(navigator.getIndex(rowHierarchyItem1)).toBe(1);
                expect(navigator.getIndex(rowHierarchyItemAgain0)).toBe(0);
                expect(navigator.getIndex(rowHierarchyItemAgain1)).toBe(1);
            });
        });
        describe('isLeaf', function () {
            it('returns true for nodes in a one level deep placeholder hierarchy', function () {
                var matrix = matrixThreeMeasures;
                var rowHierarchy = matrix.rows.root.children;
                var rowHierarchyItem = rowHierarchy[0];
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.isLeaf(rowHierarchyItem)).toBeTruthy();
            });
            it('returns true for nodes in a one level deep hierarchy', function () {
                var matrix = matrixOneMeasureOneRowGroupOneGroupInstance;
                var rowHierarchy = matrix.rows.root.children;
                var rowHierarchyItem = rowHierarchy[0];
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.isLeaf(rowHierarchyItem)).toBeTruthy();
            });
            it('returns true for innermost nodes in a three level deep hierarchy', function () {
                var matrix = matrixTwoRowGroupsTwoColumnGroupsTwoMeasures;
                var columnHierarchy = matrix.columns.root.children;
                var columnHierarchyItem = columnHierarchy[1].children[2].children[0];
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.isLeaf(columnHierarchyItem)).toBeTruthy();
            });
            it('returns false for outermost nodes in a three level deep hierarchy', function () {
                var matrix = matrixTwoRowGroupsTwoColumnGroupsTwoMeasures;
                var columnHierarchy = matrix.columns.root.children;
                var columnHierarchyItem = columnHierarchy[0];
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.isLeaf(columnHierarchyItem)).toBeFalsy();
            });
            it('returns false for non-innermost nodes in a three level deep hierarchy', function () {
                var matrix = matrixTwoRowGroupsTwoColumnGroupsTwoMeasures;
                var columnHierarchy = matrix.columns.root.children;
                var columnHierarchyItem = columnHierarchy[0].children[1];
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.isLeaf(columnHierarchyItem)).toBeFalsy();
            });
        });
        describe('isRowHierarchyLeaf', function () {
            // TODO
        });
        describe('isColumnHierarchyLeaf', function () {
            // TODO
        });
        describe('isLastItem', function () {
            it('returns true if the last item is the only item in the collection', function () {
                var matrix = matrixOneRowGroupOneColumnGroupOneInstance;
                var items = matrix.rows.root.children;
                var item = items[0];
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.isLastItem(item, items)).toBeTruthy();
            });
            it('returns true if the last item is the last item in its parents collection, but not on the level', function () {
                var matrix = matrixThreeMeasuresThreeRowGroups;
                var items = matrix.rows.root.children[0].children;
                var item = items[1];
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.isLastItem(item, items)).toBeTruthy();
            });
            it('returns false if the item is not the last item in its parents collection', function () {
                var matrix = matrixThreeMeasuresThreeRowGroups;
                var items = matrix.rows.root.children[1].children[1].children;
                var item = items[0];
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.isLastItem(item, items)).toBeFalsy();
            });
        });
        describe('getChildren', function () {
            it('returns undefined for leaf node', function () {
                var matrix = matrixOneMeasureOneColumnGroupOneGroupInstance;
                var node = matrix.columns.root.children[0];
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getChildren(node)).toBeUndefined();
            });
            it('returns the correct collection of children', function () {
                var matrix = matrixThreeMeasuresThreeRowGroups;
                var node = matrix.rows.root.children[0];
                var children = node.children;
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getChildren(node)).toBe(children);
            });
        });
        describe('getCount', function () {
            it('returns zero if there are no children', function () {
                var matrix = matrixThreeRowGroupsOneGroupInstance;
                var columnHierarchy = matrix.columns.root.children;
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getCount(columnHierarchy)).toBe(0);
            });
            it('returns the length of the children array', function () {
                var matrix = matrixThreeMeasuresThreeRowGroups;
                var columnHierarchy = matrix.columns.root.children;
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getCount(columnHierarchy)).toBe(3);
            });
        });
        describe('getAt', function () {
            it('returns undefined if index is out of bounds', function () {
                var matrix = matrixThreeRowGroupsOneGroupInstance;
                var columnHierarchy = matrix.columns.root.children;
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getAt(columnHierarchy, 0)).toBeUndefined();
            });
            it('returns the right node from the hierarchy', function () {
                var matrix = matrixThreeRowGroups;
                var rowHierarchy = matrix.rows.root.children;
                var node = rowHierarchy[1];
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getAt(rowHierarchy, 1)).toBe(node);
            });
            it('returns the right node from the children collection', function () {
                var matrix = matrixThreeRowGroups;
                var children = matrix.rows.root.children[0].children;
                var node = children[1];
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getAt(children, 1)).toBe(node);
            });
        });
        describe('getLevel', function () {
            it('returns undefined for root node', function () {
                var matrix = matrixThreeRowGroupsThreeColumnGroupsOneInstance;
                var rootNode = matrix.columns.root;
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getLevel(rootNode)).toBeUndefined();
            });
            it('returns zero for outermost nodes', function () {
                var matrix = matrixThreeRowGroupsThreeColumnGroupsOneInstance;
                var node = matrix.rows.root.children[0];
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getLevel(node)).toBe(0);
            });
            it('returns one for nodes on the second level', function () {
                var matrix = matrixTwoRowGroupsTwoColumnGroupsTwoMeasures;
                var nodes = matrix.rows.root.children[1].children;
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getLevel(nodes[0])).toBe(1);
                expect(navigator.getLevel(nodes[1])).toBe(1);
            });
        });
        describe('getIntersection', function () {
            it('returns values in the intersection', function () {
                var matrix = matrixThreeMeasuresThreeRowGroups;
                var rowHierarchy = matrix.rows.root.children;
                var columnHierarchy = matrix.columns.root.children;
                var level2RowItems = [
                    rowHierarchy[0].children[0],
                    rowHierarchy[0].children[1],
                    rowHierarchy[1].children[0],
                    rowHierarchy[1].children[1]
                ];
                var level3RowItems = [
                    level2RowItems[0].children[0],
                    level2RowItems[0].children[1],
                    level2RowItems[1].children[0],
                    level2RowItems[1].children[1],
                    level2RowItems[2].children[0],
                    level2RowItems[2].children[1],
                    level2RowItems[3].children[0],
                    level2RowItems[3].children[1]
                ];
                var level1ColumnItems = [
                    columnHierarchy[0],
                    columnHierarchy[1],
                    columnHierarchy[2]
                ];
                var expectedValues = [
                    ['1,000.00', '1,001.00', '1,002.00'],
                    ['1,010.00', '1,011.00', '1,012.00'],
                    ['1,100.00', '1,101.00', '1,102.00'],
                    ['1,110.00', '1,111.00', '1,112.00'],
                    ['2,000.00', '2,001.00', '2,002.00'],
                    ['2,010.00', '2,011.00', '2,012.00'],
                    ['2,100.00', '2,101.00', '2,102.00'],
                    ['2,110.00', '2,111.00', '2,112.00']
                ];
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                validateIntersections(navigator, level3RowItems, level1ColumnItems, expectedValues);
            });
            it('returns empty string if there are no measures', function () {
                var matrix = matrixThreeRowGroupsThreeColumnGroups;
                var rowHierarchy = matrix.rows.root.children;
                var rowLeaves = rowHierarchy[0].children[0].children.concat(rowHierarchy[0].children[1].children);
                var columnHierarchy = matrix.columns.root.children;
                var columnLeaves = columnHierarchy[0].children[0].children.concat(columnHierarchy[0].children[1]);
                var expectedValues = [
                    ['', '', ''],
                    ['', '', ''],
                    ['', '', '']
                ];
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                validateIntersections(navigator, rowLeaves, columnLeaves, expectedValues);
            });
            function validateIntersections(navigator, rowLeaves, columnLeaves, expectedValues) {
                var result = [];
                for (var i = 0, ilen = rowLeaves.length; i < ilen; i++) {
                    result[i] = [];
                    for (var j = 0, jlen = columnLeaves.length; j < jlen; j++)
                        result[i][j] = navigator.getIntersection(rowLeaves[i], columnLeaves[j]).content;
                }
                expect(result).toEqual(expectedValues);
            }
        });
        describe('getCorer', function () {
            it('returns empty value for the upper left cell of a 3x3 corner', function () {
                var matrix = matrixThreeRowGroupsThreeColumnGroups;
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getCorner(0, 0).metadata).toBeNull();
                expect(navigator.getCorner(0, 0).isColumnHeaderLeaf).toBeFalsy();
            });
            it('returns row header for the lower left cell of a 3x3 corner', function () {
                var matrix = matrixThreeRowGroupsThreeColumnGroups;
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getCorner(0, 2).metadata.name).toBe('RowGroup1');
                expect(navigator.getCorner(0, 2).isColumnHeaderLeaf).toBeTruthy();
            });
            it('returns column header for the upper right cell of a 3x3 corner', function () {
                var matrix = matrixThreeRowGroupsThreeColumnGroups;
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getCorner(2, 0).metadata.name).toBe('ColGroup1');
                expect(navigator.getCorner(2, 0).isColumnHeaderLeaf).toBeFalsy();
            });
            it('returns row header for the lower right cell of a 3x3 corner', function () {
                var matrix = matrixThreeRowGroupsThreeColumnGroups;
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.getCorner(2, 2).metadata.name).toBe('RowGroup3');
                expect(navigator.getCorner(2, 2).isColumnHeaderLeaf).toBeTruthy();
            });
        });
        describe('headerItemEquals', function () {
            it('returns true if the two items are the same', function () {
                var matrix = matrixOneRowGroupOneColumnGroupOneGroupInstance;
                var rowNode = matrix.rows.root.children[0];
                var columnNode = matrix.columns.root.children[0];
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.headerItemEquals(rowNode, rowNode)).toBeTruthy();
                expect(navigator.headerItemEquals(columnNode, columnNode)).toBeTruthy();
            });
            it('returns false if the two items are not same even if they have the same content', function () {
                var matrix = matrixOneRowGroupOneColumnGroupOneGroupInstance;
                var rowNode = matrix.rows.root.children[0];
                var columnNode = matrix.columns.root.children[0];
                var navigator = powerbi.visuals.createMatrixHierarchyNavigator(matrix, valueFormatter.formatRaw);
                expect(navigator.headerItemEquals(rowNode, columnNode)).toBeFalsy();
                expect(navigator.headerItemEquals(columnNode, rowNode)).toBeFalsy();
            });
        });
    });
    describe('Matrix logic', function () {
        var v;
        beforeEach(function () {
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('matrix').create();
            v.init({
                element: powerbitests.helpers.testDom('500', '500'),
                host: powerbitests.mocks.createVisualHostServices(),
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: 500,
                    width: 500
                },
                animation: { transitionImmediate: true }
            });
        });
        it('loadMoreData calls control refresh', function () {
            var nav = { updateRows: function () {
            } };
            var control = { refresh: function () {
            } };
            var navSpy = spyOn(nav, "updateRows");
            var controlSpy = spyOn(control, "refresh");
            v['hierarchyNavigator'] = nav;
            v['tablixControl'] = control;
            v.onDataChanged({
                dataViews: [matrixOneMeasureDataView],
                operationKind: 1 /* Append */
            });
            expect(navSpy).toHaveBeenCalled();
            expect(controlSpy).toHaveBeenCalled();
        });
        it('needsMoreData waitingForData', function () {
            var matrix = matrixThreeRowGroups;
            v.onDataChanged({
                dataViews: [{
                    metadata: { columns: [rowGroupSource1, rowGroupSource2, rowGroupSource3], segment: {} },
                    matrix: matrix
                }]
            });
            v['waitingForData'] = true;
            var matrixVisual = v;
            var lastLeaf = matrix.rows.root.children[1].children[1].children[1];
            var result = matrixVisual.needsMoreData(lastLeaf);
            expect(result).toBe(false);
        });
        it('needsMoreData notLeaf', function () {
            var matrix = matrixThreeRowGroups;
            v.onDataChanged({
                dataViews: [{
                    metadata: { columns: [rowGroupSource1, rowGroupSource2, rowGroupSource3], segment: {} },
                    matrix: matrix
                }]
            });
            var matrixVisual = v;
            var item = matrix.rows.root.children[1].children[1];
            var result = matrixVisual.needsMoreData(item);
            expect(result).toBe(false);
        });
        it('needsMoreData segmentComplete', function () {
            var matrix = matrixThreeRowGroups;
            v.onDataChanged({
                dataViews: [{
                    metadata: { columns: [rowGroupSource1, rowGroupSource2, rowGroupSource3] },
                    matrix: matrix
                }]
            });
            var matrixVisual = v;
            var lastLeaf = matrix.rows.root.children[1].children[1].children[1];
            var result = matrixVisual.needsMoreData(lastLeaf);
            expect(result).toBe(false);
        });
        it('needsMoreData belowThreshold', function () {
            var matrix = matrixTwoRowGroupsTwoColumnGroupsTwoMeasures;
            v.onDataChanged({
                dataViews: [matrixTwoRowGroupsTwoColumnGroupsTwoMeasuresDataView]
            });
            var matrixVisual = v;
            var leaf = matrix.rows.root.children[0].children[0];
            var result = matrixVisual.needsMoreData(leaf);
            expect(result).toBe(false);
        });
        it('needsMoreData aboveThreshold', function () {
            v.onDataChanged({
                dataViews: [matrixThreeMeasuresThreeRowGroupsDataView]
            });
            var matrixVisual = v;
            var leaf = matrixThreeMeasuresThreeRowGroups.rows.root.children[1].children[1].children[1];
            var result = matrixVisual.needsMoreData(leaf);
            expect(result).toBe(true);
        });
        it('bindRowHeader callback', function () {
            var callBackCalled = false;
            var binderOptions = { onBindRowHeader: function (item) {
                callBackCalled = true;
            } };
            var binder = new powerbi.visuals.MatrixBinder(null, binderOptions);
            binder.bindRowHeader({ name: null }, {
                type: null,
                item: null,
                colSpan: 0,
                rowSpan: 0,
                textAlign: '',
                extension: { contentHost: { textContent: null }, setContainerStyle: function (className) {
                } }
            });
            expect(callBackCalled).toBe(true);
        });
        it('unbindColumnHeader multimeasure not sortable', function () {
            var binderOptions = { onBindRowHeader: function (item) {
            }, onColumnHeaderClick: function () {
            } };
            var hierarchyNavigator = powerbi.visuals.createMatrixHierarchyNavigator(matrixTwoRowGroupsTwoColumnGroupsTwoMeasures, powerbi.visuals.valueFormatter.formatRaw);
            var binder = new powerbi.visuals.MatrixBinder(hierarchyNavigator, binderOptions);
            var unregisterCalled = false;
            binder.unbindColumnHeader({ name: null, isSubtotal: true }, {
                type: null,
                item: null,
                colSpan: 0,
                rowSpan: 0,
                textAlign: '',
                extension: {
                    contentHost: { textContent: null },
                    setContainerStyle: function (className) {
                    },
                    clearContainerStyle: function (className) {
                    },
                    unregisterClickHandler: function () {
                        unregisterCalled = true;
                    }
                }
            });
            expect(unregisterCalled).toBe(false);
        });
        it('enumerateObjectInstances general both totals off', function () {
            var matrix = matrixRowGroupColumnGroupWithBooleanAndNullOneMeasure;
            v.onDataChanged({
                dataViews: [{
                    metadata: {
                        columns: [
                            rowGroupSource4,
                            columnGroupSource4,
                            measureSource1
                        ],
                        objects: {
                            general: {
                                rowSubtotals: false,
                                columnSubtotals: false
                            }
                        }
                    },
                    matrix: matrix
                }]
            });
            var objects = v.enumerateObjectInstances({ objectName: 'general' });
            expect(objects).toEqual([{
                selector: null,
                objectName: 'general',
                properties: {
                    rowSubtotals: false,
                    columnSubtotals: false
                }
            }]);
        });
        it('enumerateObjectInstances general both totals on', function () {
            var matrix = matrixRowGroupColumnGroupWithBooleanAndNullOneMeasureBothTotals;
            v.onDataChanged({
                dataViews: [{
                    metadata: {
                        columns: [
                            rowGroupSource4,
                            columnGroupSource4,
                            measureSource1
                        ],
                        objects: {
                            general: {
                                rowSubtotals: true,
                                columnSubtotals: true
                            }
                        }
                    },
                    matrix: matrix
                }]
            });
            var objects = v.enumerateObjectInstances({ objectName: 'general' });
            expect(objects).toEqual([{
                selector: null,
                objectName: 'general',
                properties: {
                    rowSubtotals: true,
                    columnSubtotals: true
                }
            }]);
        });
        it('enumerateObjectInstances general no objects', function () {
            var matrix = matrixRowGroupColumnGroupWithBooleanAndNullOneMeasure;
            v.onDataChanged({
                dataViews: [{
                    metadata: {
                        columns: [
                            rowGroupSource4,
                            columnGroupSource4,
                            measureSource1
                        ]
                    },
                    matrix: matrix
                }]
            });
            var objects = v.enumerateObjectInstances({ objectName: 'general' });
            expect(objects).toEqual([{
                selector: null,
                objectName: 'general',
                properties: {
                    rowSubtotals: true,
                    columnSubtotals: true
                }
            }]);
        });
        it('enumerateObjectInstances general no properties', function () {
            var matrix = matrixRowGroupColumnGroupWithBooleanAndNullOneMeasureBothTotals;
            v.onDataChanged({
                dataViews: [{
                    metadata: {
                        columns: [
                            rowGroupSource4,
                            columnGroupSource4,
                            measureSource1
                        ],
                        objects: {
                            general: {}
                        }
                    },
                    matrix: matrix
                }]
            });
            var objects = v.enumerateObjectInstances({ objectName: 'general' });
            expect(objects).toEqual([{
                selector: null,
                objectName: 'general',
                properties: {
                    rowSubtotals: true,
                    columnSubtotals: true
                }
            }]);
        });
    });
    describe('Matrix DOM validation', function () {
        var v, element, EmptyHeaderCell = '\xa0', NoMarginClass = 'bi-tablix-cellNoMarginStyle', HeaderClass = 'bi-tablix-header', ColumnHeaderLeafClass = 'bi-tablix-column-header-leaf', RowHeaderLeafClass = 'bi-tablix-row-header-leaf', BodyCellClass = 'bi-matrix-body-cell', TotalClass = 'total', TableTotalLabel = 'TableTotalLabel';
        beforeEach(function () {
            powerbi.explore.services.VisualHostServices.initialize(powerbi.common.createLocalizationService());
        });
        beforeEach(function () {
            element = powerbitests.helpers.testDom('1500', '1500');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('matrix').create();
            v.init({
                element: element,
                host: powerbitests.mocks.createVisualHostServices(),
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true }
            });
        });
        function validateMatrix(expectedValues) {
            var rows = $('.bi-tablix tr');
            var result = [];
            for (var i = 0, ilen = rows.length; i < ilen; i++) {
                result[i] = [];
                var cells = rows.eq(i).find('td');
                expect(cells.height()).not.toBe(0);
                for (var j = 0, jlen = cells.length; j < jlen; j++)
                    result[i][j] = cells.eq(j).text();
            }
            expect(result).toEqual(expectedValues);
        }
        function validateClassNames(expectedValues) {
            var rows = $('.bi-tablix tr');
            var result = [];
            for (var i = 0, ilen = rows.length; i < ilen; i++) {
                result[i] = [];
                var cells = rows.eq(i).find('td');
                for (var j = 0, jlen = cells.length; j < jlen; j++)
                    result[i][j] = cells.eq(j).attr('class');
            }
            addNoMarginClass(expectedValues);
            expect(result).toEqual(expectedValues);
        }
        function addNoMarginClass(expectedValues) {
            for (var i = 0, ilen = expectedValues.length; i < ilen; i++)
                for (var j = 0, jlen = expectedValues[i].length; j < jlen; j++) {
                    var classNames = expectedValues[i][j];
                    if (classNames.length !== 0)
                        classNames += ' ';
                    classNames += NoMarginClass;
                    expectedValues[i][j] = classNames;
                }
        }
        it('1x2 matrix (value and static column header)', function (done) {
            var matrix = matrixOneMeasure;
            v.onDataChanged({
                dataViews: [matrixOneMeasureDataView]
            });
            setTimeout(function () {
                var cellValue = formatter(matrix.rows.root.children[0].values[0].value, measureSource1);
                var expectedCells = [
                    ['', measureSource1.name, ''],
                    [EmptyHeaderCell, cellValue]
                ];
                validateMatrix(expectedCells);
                var expectedClassNames = [
                    [HeaderClass, ColumnHeaderLeafClass, ''],
                    [RowHeaderLeafClass, BodyCellClass]
                ];
                validateClassNames(expectedClassNames);
                done();
            }, DefaultWaitForRender);
        });
        it('1x2 matrix (value and column header value)', function (done) {
            var matrix = matrixOneMeasureOneColumnGroupOneGroupInstance;
            v.onDataChanged({
                dataViews: [matrixOneMeasureOneColumnGroupOneGroupInstanceDataView]
            });
            setTimeout(function () {
                var headerValue = matrix.columns.root.children[0].value;
                var cellValue = formatter(matrix.rows.root.children[0].values[0].value, measureSource1);
                var expectedCells = [
                    ['', headerValue, ''],
                    [EmptyHeaderCell, cellValue]
                ];
                validateMatrix(expectedCells);
                var expectedClassNames = [
                    [HeaderClass, ColumnHeaderLeafClass, ''],
                    [RowHeaderLeafClass, BodyCellClass]
                ];
                validateClassNames(expectedClassNames);
                done();
            }, DefaultWaitForRender);
        });
        it('3x2 matrix (values and static column headers)', function (done) {
            var matrix = matrixThreeMeasures;
            v.onDataChanged({
                dataViews: [{
                    metadata: { columns: [measureSource1, measureSource2, measureSource3] },
                    matrix: matrix
                }]
            });
            setTimeout(function () {
                var cellValue1 = formatter(matrix.rows.root.children[0].values[0].value, measureSource1);
                var cellValue2 = formatter(matrix.rows.root.children[0].values[1].value, measureSource2);
                var cellValue3 = formatter(matrix.rows.root.children[0].values[2].value, measureSource3);
                var expectedCells = [
                    ['', measureSource1.name, measureSource2.name, measureSource3.name, ''],
                    [EmptyHeaderCell, cellValue1, cellValue2, cellValue3]
                ];
                validateMatrix(expectedCells);
                var expectedClassNames = [
                    [HeaderClass, ColumnHeaderLeafClass, ColumnHeaderLeafClass, ColumnHeaderLeafClass, ''],
                    [RowHeaderLeafClass, BodyCellClass, BodyCellClass, BodyCellClass]
                ];
                validateClassNames(expectedClassNames);
                done();
            }, DefaultWaitForRender);
        });
        it('3x3 matrix (values, static and value column headers)', function (done) {
            var matrix = matrixThreeMeasuresOneColumnGroupOneGroupInstance;
            v.onDataChanged({
                dataViews: [{
                    metadata: { columns: [columnGroupSource1, measureSource1, measureSource2, measureSource3] },
                    matrix: matrix
                }]
            });
            setTimeout(function () {
                var headerValue = matrix.columns.root.children[0].value;
                var cellValue1 = formatter(matrix.rows.root.children[0].values[0].value, measureSource1);
                var cellValue2 = formatter(matrix.rows.root.children[0].values[1].value, measureSource2);
                var cellValue3 = formatter(matrix.rows.root.children[0].values[2].value, measureSource3);
                var expectedCells = [
                    ['', headerValue, ''],
                    ['', measureSource1.name, measureSource2.name, measureSource3.name],
                    [EmptyHeaderCell, cellValue1, cellValue2, cellValue3]
                ];
                validateMatrix(expectedCells);
                var expectedClassNames = [
                    [HeaderClass, HeaderClass, ''],
                    [HeaderClass, ColumnHeaderLeafClass, ColumnHeaderLeafClass, ColumnHeaderLeafClass],
                    [RowHeaderLeafClass, BodyCellClass, BodyCellClass, BodyCellClass]
                ];
                validateClassNames(expectedClassNames);
                done();
            }, DefaultWaitForRender);
        });
        it('6x9 matrix (values, static column headers and row value headers)', function (done) {
            v.onDataChanged({
                dataViews: [matrixThreeMeasuresThreeRowGroupsDataView]
            });
            var matrix = matrixThreeMeasuresThreeRowGroups;
            setTimeout(function () {
                var header_1 = matrix.rows.root.children[0];
                var header_1_1 = header_1.children[0];
                var header_1_1_1 = header_1_1.children[0];
                var header_1_1_2 = header_1_1.children[1];
                var header_1_2 = header_1.children[1];
                var header_1_2_1 = header_1_2.children[0];
                var header_1_2_2 = header_1_2.children[1];
                var header_2 = matrix.rows.root.children[1];
                var header_2_1 = header_2.children[0];
                var header_2_1_1 = header_2_1.children[0];
                var header_2_1_2 = header_2_1.children[1];
                var header_2_2 = header_2.children[1];
                var header_2_2_1 = header_2_2.children[0];
                var header_2_2_2 = header_2_2.children[1];
                var cellValue1 = formatter(header_1_1_1.values[0].value, measureSource1);
                var cellValue2 = formatter(header_1_1_1.values[1].value, measureSource2);
                var cellValue3 = formatter(header_1_1_1.values[2].value, measureSource3);
                var cellValue4 = formatter(header_1_1_2.values[0].value, measureSource1);
                var cellValue5 = formatter(header_1_1_2.values[1].value, measureSource2);
                var cellValue6 = formatter(header_1_1_2.values[2].value, measureSource3);
                var cellValue7 = formatter(header_1_2_1.values[0].value, measureSource1);
                var cellValue8 = formatter(header_1_2_1.values[1].value, measureSource2);
                var cellValue9 = formatter(header_1_2_1.values[2].value, measureSource3);
                var cellValue10 = formatter(header_1_2_2.values[0].value, measureSource1);
                var cellValue11 = formatter(header_1_2_2.values[1].value, measureSource2);
                var cellValue12 = formatter(header_1_2_2.values[2].value, measureSource3);
                var cellValue13 = formatter(header_2_1_1.values[0].value, measureSource1);
                var cellValue14 = formatter(header_2_1_1.values[1].value, measureSource2);
                var cellValue15 = formatter(header_2_1_1.values[2].value, measureSource3);
                var cellValue16 = formatter(header_2_1_2.values[0].value, measureSource1);
                var cellValue17 = formatter(header_2_1_2.values[1].value, measureSource2);
                var cellValue18 = formatter(header_2_1_2.values[2].value, measureSource3);
                var cellValue19 = formatter(header_2_2_1.values[0].value, measureSource1);
                var cellValue20 = formatter(header_2_2_1.values[1].value, measureSource2);
                var cellValue21 = formatter(header_2_2_1.values[2].value, measureSource3);
                var cellValue22 = formatter(header_2_2_2.values[0].value, measureSource1);
                var cellValue23 = formatter(header_2_2_2.values[1].value, measureSource2);
                var cellValue24 = formatter(header_2_2_2.values[2].value, measureSource3);
                var expectedCells = [
                    [rowGroupSource1.name, rowGroupSource2.name, rowGroupSource3.name, measureSource1.name, measureSource2.name, measureSource3.name, ''],
                    [header_1.value, header_1_1.value, header_1_1_1.value, cellValue1, cellValue2, cellValue3],
                    [header_1_1_2.value, cellValue4, cellValue5, cellValue6],
                    [header_1_2.value, header_1_2_1.value, cellValue7, cellValue8, cellValue9],
                    [header_1_2_2.value, cellValue10, cellValue11, cellValue12],
                    [header_2.value, header_2_1.value, header_2_1_1.value, cellValue13, cellValue14, cellValue15],
                    [header_2_1_2.value, cellValue16, cellValue17, cellValue18],
                    [header_2_2.value, header_2_2_1.value, cellValue19, cellValue20, cellValue21],
                    [header_2_2_2.value, cellValue22, cellValue23, cellValue24]
                ];
                validateMatrix(expectedCells);
                var expectedClassNames = [
                    [ColumnHeaderLeafClass, ColumnHeaderLeafClass, ColumnHeaderLeafClass + ' ' + RowHeaderLeafClass, ColumnHeaderLeafClass, ColumnHeaderLeafClass, ColumnHeaderLeafClass, ''],
                    [HeaderClass, HeaderClass, RowHeaderLeafClass, BodyCellClass, BodyCellClass, BodyCellClass],
                    [RowHeaderLeafClass, BodyCellClass, BodyCellClass, BodyCellClass],
                    [HeaderClass, RowHeaderLeafClass, BodyCellClass, BodyCellClass, BodyCellClass],
                    [RowHeaderLeafClass, BodyCellClass, BodyCellClass, BodyCellClass],
                    [HeaderClass, HeaderClass, RowHeaderLeafClass, BodyCellClass, BodyCellClass, BodyCellClass],
                    [RowHeaderLeafClass, BodyCellClass, BodyCellClass, BodyCellClass],
                    [HeaderClass, RowHeaderLeafClass, BodyCellClass, BodyCellClass, BodyCellClass],
                    [RowHeaderLeafClass, BodyCellClass, BodyCellClass, BodyCellClass]
                ];
                validateClassNames(expectedClassNames);
                done();
            }, DefaultWaitForRender);
        });
        it('2x2 matrix (value, static column header and row value header)', function (done) {
            var matrix = matrixOneMeasureOneRowGroupOneGroupInstance;
            v.onDataChanged({
                dataViews: [{
                    metadata: { columns: [rowGroupSource1, measureSource1] },
                    matrix: matrix
                }]
            });
            setTimeout(function () {
                var header = matrix.rows.root.children[0];
                var cellValue = formatter(header.values[0].value, measureSource1);
                var expectedCells = [
                    [rowGroupSource1.name, measureSource1.name, ''],
                    [header.value, cellValue]
                ];
                validateMatrix(expectedCells);
                var expectedClassNames = [
                    [ColumnHeaderLeafClass + ' ' + RowHeaderLeafClass, ColumnHeaderLeafClass, ''],
                    [RowHeaderLeafClass, BodyCellClass]
                ];
                validateClassNames(expectedClassNames);
                done();
            }, DefaultWaitForRender);
        });
        it('2x2 matrix (value, column value header and row value header, empty cell)', function (done) {
            var matrix = matrixOneRowGroupOneColumnGroupOneGroupInstance;
            v.onDataChanged({
                dataViews: [matrixOneRowGroupOneColumnGroupOneGroupInstanceDataView]
            });
            setTimeout(function () {
                var columnHeader = matrix.columns.root.children[0];
                var rowHeader = matrix.rows.root.children[0];
                var expectedCells = [
                    [rowGroupSource1.name, columnHeader.value.toString(), ''],
                    [rowHeader.value.toString(), '']
                ];
                validateMatrix(expectedCells);
                done();
            }, DefaultWaitForRender);
        });
        it('3x2 matrix (static column headers and row value headers)', function (done) {
            var matrix = matrixThreeRowGroupsOneGroupInstance;
            v.onDataChanged({
                dataViews: [matrixThreeRowGroupsOneGroupInstanceDataView]
            });
            setTimeout(function () {
                var rowHeader_1 = matrix.rows.root.children[0];
                var rowHeader_1_1 = rowHeader_1.children[0];
                var rowHeader_1_1_1 = rowHeader_1_1.children[0];
                var expectedCells = [
                    [rowGroupSource1.name, rowGroupSource2.name, rowGroupSource3.name, ''],
                    [rowHeader_1.value, rowHeader_1_1.value, rowHeader_1_1_1.value.toString()]
                ];
                validateMatrix(expectedCells);
                var expectedClassNames = [
                    [ColumnHeaderLeafClass, ColumnHeaderLeafClass, ColumnHeaderLeafClass + ' ' + RowHeaderLeafClass, ''],
                    [HeaderClass, HeaderClass, RowHeaderLeafClass]
                ];
                validateClassNames(expectedClassNames);
                done();
            }, DefaultWaitForRender);
        });
        it('2x6 matrix (static column headers and row value headers including empty ones)', function (done) {
            var matrix = matrixTwoRowGroupsWithNullValues;
            v.onDataChanged({
                dataViews: [{
                    metadata: {
                        columns: [
                            rowGroupSource1,
                            rowGroupSource2
                        ]
                    },
                    matrix: matrix
                }]
            });
            setTimeout(function () {
                var header_1 = matrix.rows.root.children[0];
                var header_1_2 = header_1.children[1];
                var header_2 = matrix.rows.root.children[1];
                var header_2_1 = header_2.children[0];
                var expectedCells = [
                    [rowGroupSource1.name, rowGroupSource2.name, ''],
                    [header_1.value, EmptyHeaderCell],
                    [header_1_2.value],
                    [header_2.value, header_2_1.value],
                    [EmptyHeaderCell],
                    [EmptyHeaderCell, EmptyHeaderCell]
                ];
                validateMatrix(expectedCells);
                var expectedClassNames = [
                    [ColumnHeaderLeafClass, ColumnHeaderLeafClass + ' ' + RowHeaderLeafClass, ''],
                    [HeaderClass, RowHeaderLeafClass],
                    [RowHeaderLeafClass],
                    [HeaderClass, RowHeaderLeafClass],
                    [RowHeaderLeafClass],
                    [HeaderClass, RowHeaderLeafClass]
                ];
                validateClassNames(expectedClassNames);
                done();
            }, DefaultWaitForRender);
        });
        it('5x2 matrix (column value headers including empty ones)', function (done) {
            var matrix = matrixTwoColumnGroupsWithNullValues;
            v.onDataChanged({
                dataViews: [{
                    metadata: {
                        columns: [
                            columnGroupSource1,
                            columnGroupSource2
                        ]
                    },
                    matrix: matrix
                }]
            });
            setTimeout(function () {
                var header_1 = matrix.columns.root.children[0];
                var header_1_2 = header_1.children[1];
                var header_2 = matrix.columns.root.children[1];
                var header_2_1 = header_2.children[0];
                var expectedCells = [
                    ['', header_1.value, header_2.value, EmptyHeaderCell, ''],
                    ['', EmptyHeaderCell, header_1_2.value, header_2_1.value, EmptyHeaderCell, EmptyHeaderCell]
                ];
                validateMatrix(expectedCells);
                var expectedClassNames = [
                    [HeaderClass, HeaderClass, HeaderClass, HeaderClass, ''],
                    [HeaderClass, ColumnHeaderLeafClass, ColumnHeaderLeafClass, ColumnHeaderLeafClass, ColumnHeaderLeafClass, ColumnHeaderLeafClass]
                ];
                validateClassNames(expectedClassNames);
                done();
            }, DefaultWaitForRender);
        });
        it('3x9 matrix (static column headers and row value headers)', function (done) {
            var matrix = matrixThreeRowGroups;
            v.onDataChanged({
                dataViews: [{
                    metadata: {
                        columns: [
                            rowGroupSource1,
                            rowGroupSource2,
                            rowGroupSource3
                        ]
                    },
                    matrix: matrix
                }]
            });
            setTimeout(function () {
                var header_1 = matrix.rows.root.children[0];
                var header_1_1 = header_1.children[0];
                var header_1_1_1 = header_1_1.children[0];
                var header_1_1_2 = header_1_1.children[1];
                var header_1_2 = header_1.children[1];
                var header_1_2_1 = header_1_2.children[0];
                var header_1_2_2 = header_1_2.children[1];
                var header_2 = matrix.rows.root.children[1];
                var header_2_1 = header_2.children[0];
                var header_2_1_1 = header_2_1.children[0];
                var header_2_1_2 = header_2_1.children[1];
                var header_2_2 = header_2.children[1];
                var header_2_2_1 = header_2_2.children[0];
                var header_2_2_2 = header_2_2.children[1];
                var expectedCells = [
                    [rowGroupSource1.name, rowGroupSource2.name, rowGroupSource3.name, ''],
                    [header_1.value, header_1_1.value, header_1_1_1.value.toString()],
                    [header_1_1_2.value.toString()],
                    [header_1_2.value, header_1_2_1.value.toString()],
                    [header_1_2_2.value.toString()],
                    [header_2.value, header_2_1.value, header_2_1_1.value.toString()],
                    [header_2_1_2.value.toString()],
                    [header_2_2.value, header_2_2_1.value.toString()],
                    [header_2_2_2.value.toString()]
                ];
                validateMatrix(expectedCells);
                done();
            }, DefaultWaitForRender);
        });
        it('1x1 matrix loadMoreData', function () {
            var matrix = {
                rows: {
                    root: {
                        children: [{
                            level: 0,
                            value: '1'
                        }]
                    },
                    levels: [{ sources: [rowGroupSource1] }]
                },
                columns: {
                    root: {
                        children: []
                    },
                    levels: []
                },
                valueSources: []
            };
            v.onDataChanged({
                dataViews: [{
                    metadata: {
                        columns: [
                            rowGroupSource1
                        ]
                    },
                    matrix: matrix
                }]
            });
            var segment2 = {
                rows: {
                    root: {
                        children: [{
                            level: 0,
                            value: '2'
                        }]
                    },
                    levels: [{ sources: [rowGroupSource1] }]
                },
                columns: {
                    root: {
                        children: []
                    },
                    levels: []
                },
                valueSources: []
            };
            // Simulate a load more merge
            powerbi.data.segmentation.DataViewMerger.mergeTreeNodes(matrix.rows.root, segment2.rows.root, false);
            v.onDataChanged({
                dataViews: [{
                    metadata: {
                        columns: [
                            rowGroupSource1
                        ]
                    },
                    matrix: matrix
                }],
                operationKind: 1 /* Append */
            });
            var header1 = matrix.rows.root.children[0];
            var header2 = matrix.rows.root.children[1];
            var expectedCells = [
                [rowGroupSource1.name, ''],
                [header1.value],
                [header2.value]
            ];
            validateMatrix(expectedCells);
        });
        it('8x3 matrix (column value headers)', function (done) {
            var matrix = matrixThreeColumnGroups;
            v.onDataChanged({
                dataViews: [matrixThreeColumnGroupsDataView]
            });
            setTimeout(function () {
                var header_1 = matrix.columns.root.children[0];
                var header_1_1 = header_1.children[0];
                var header_1_1_1 = header_1_1.children[0].value.toString();
                var header_1_1_2 = header_1_1.children[1].value.toString();
                var header_1_2 = header_1.children[1];
                var header_1_2_1 = header_1_2.children[0].value.toString();
                var header_1_2_2 = header_1_2.children[1].value.toString();
                var header_2 = matrix.columns.root.children[1];
                var header_2_1 = header_2.children[0];
                var header_2_1_1 = header_2_1.children[0].value.toString();
                var header_2_1_2 = header_2_1.children[1].value.toString();
                var header_2_2 = header_2.children[1];
                var header_2_2_1 = header_2_2.children[0].value.toString();
                var header_2_2_2 = header_2_2.children[1].value.toString();
                var expectedCells = [
                    ['', header_1.value, header_2.value, ''],
                    ['', header_1_1.value, header_1_2.value, header_2_1.value, header_2_2.value],
                    ['', header_1_1_1, header_1_1_2, header_1_2_1, header_1_2_2, header_2_1_1, header_2_1_2, header_2_2_1, header_2_2_2]
                ];
                validateMatrix(expectedCells);
                done();
            }, DefaultWaitForRender);
        });
        it('6x5 matrix (column value headers and row value headers, multiple group instances, empty cells)', function (done) {
            var matrix = matrixThreeRowGroupsThreeColumnGroups;
            v.onDataChanged({
                dataViews: [{
                    metadata: {
                        columns: [
                            rowGroupSource1,
                            rowGroupSource2,
                            rowGroupSource3formatted,
                            columnGroupSource1,
                            columnGroupSource2,
                            columnGroupSource3formatted
                        ]
                    },
                    matrix: matrix
                }]
            });
            setTimeout(function () {
                var rowHeader_1 = matrix.rows.root.children[0];
                var rowHeader_1_1 = rowHeader_1.children[0];
                var rowHeaderValue_1_1_1 = formatter(rowHeader_1_1.children[0].value, rowGroupSource3formatted);
                var rowHeaderValue_1_1_2 = formatter(rowHeader_1_1.children[1].value, rowGroupSource3formatted);
                var rowHeader_1_2 = rowHeader_1.children[1];
                var rowHeaderValue_1_2_1 = formatter(rowHeader_1_2.children[0].value, rowGroupSource3formatted);
                var colHeader_1 = matrix.columns.root.children[0];
                var colHeader_1_1 = colHeader_1.children[0];
                var colHeaderValue_1_1_1 = formatter(colHeader_1_1.children[0].value, columnGroupSource3formatted);
                var colHeaderValue_1_1_2 = formatter(colHeader_1_1.children[1].value, columnGroupSource3formatted);
                var colHeader_1_2 = colHeader_1.children[1];
                var colHeaderValue_1_2_1 = formatter(colHeader_1_2.children[0].value, columnGroupSource3formatted);
                var expectedCells = [
                    ['', '', columnGroupSource1.name, colHeader_1.value, ''],
                    ['', '', columnGroupSource2.name, colHeader_1_1.value, colHeader_1_2.value],
                    [rowGroupSource1.name, rowGroupSource2.name, rowGroupSource3.name, colHeaderValue_1_1_1, colHeaderValue_1_1_2, colHeaderValue_1_2_1],
                    [rowHeader_1.value, rowHeader_1_1.value, rowHeaderValue_1_1_1, '', '', ''],
                    [rowHeaderValue_1_1_2, '', '', ''],
                    [rowHeader_1_2.value, rowHeaderValue_1_2_1, '', '', '']
                ];
                validateMatrix(expectedCells);
                done();
            }, DefaultWaitForRender);
        });
        it('3x4 matrix (boolean and null group instances)', function (done) {
            var matrix = matrixRowGroupColumnGroupWithBooleanAndNullOneMeasure;
            v.onDataChanged({
                dataViews: [{
                    metadata: {
                        columns: [
                            rowGroupSource4,
                            columnGroupSource4,
                            measureSource1
                        ]
                    },
                    matrix: matrix
                }]
            });
            setTimeout(function () {
                var colHeader1 = matrix.columns.root.children[0];
                var colHeader2 = matrix.columns.root.children[1];
                var rowHeader1 = matrix.rows.root.children[0];
                var rowHeader2 = matrix.rows.root.children[1];
                var rowHeader3 = matrix.rows.root.children[2];
                var expectedCells = [
                    [rowGroupSource4.name, colHeader1.value.toString(), colHeader2.value.toString(), ''],
                    [rowHeader1.value.toString(), formatter(rowHeader1.values[0].value, measureSource1), formatter(rowHeader1.values[1].value, measureSource1)],
                    [rowHeader2.value.toString(), formatter(rowHeader2.values[0].value, measureSource1), formatter(rowHeader2.values[1].value, measureSource1)],
                    [EmptyHeaderCell, formatter(rowHeader3.values[0].value, measureSource1), formatter(rowHeader3.values[1].value, measureSource1)]
                ];
                validateMatrix(expectedCells);
                done();
            }, DefaultWaitForRender);
        });
        it('Matrix with row and column subtotals', function (done) {
            var matrix = matrixRowGroupColumnGroupWithBooleanAndNullOneMeasureBothTotals;
            v.onDataChanged({
                dataViews: [{
                    metadata: {
                        columns: [
                            rowGroupSource4,
                            columnGroupSource4,
                            measureSource1
                        ],
                        objects: {
                            general: {
                                rowSubtotals: true,
                                columnSubtotals: true
                            }
                        }
                    },
                    matrix: matrix
                }]
            });
            setTimeout(function () {
                var colHeader1 = matrix.columns.root.children[0];
                var colHeader2 = matrix.columns.root.children[1];
                var rowHeader1 = matrix.rows.root.children[0];
                var rowHeader2 = matrix.rows.root.children[1];
                var rowHeader3 = matrix.rows.root.children[2];
                var rowHeader4 = matrix.rows.root.children[3];
                var expectedCells = [
                    [rowGroupSource4.name, colHeader1.value.toString(), colHeader2.value.toString(), TableTotalLabel, ''],
                    [rowHeader1.value.toString(), formatter(rowHeader1.values[0].value, measureSource1), formatter(rowHeader1.values[1].value, measureSource1), formatter(rowHeader1.values[2].value, measureSource1)],
                    [rowHeader2.value.toString(), formatter(rowHeader2.values[0].value, measureSource1), formatter(rowHeader2.values[1].value, measureSource1), formatter(rowHeader2.values[2].value, measureSource1)],
                    [EmptyHeaderCell, formatter(rowHeader3.values[0].value, measureSource1), formatter(rowHeader3.values[1].value, measureSource1), formatter(rowHeader3.values[2].value, measureSource1)],
                    [TableTotalLabel, formatter(rowHeader4.values[0].value, measureSource1), formatter(rowHeader4.values[1].value, measureSource1), formatter(rowHeader4.values[2].value, measureSource1)]
                ];
                validateMatrix(expectedCells);
                var expectedClassNames = [
                    [ColumnHeaderLeafClass + ' ' + RowHeaderLeafClass, ColumnHeaderLeafClass, ColumnHeaderLeafClass, ColumnHeaderLeafClass + ' ' + TotalClass, ''],
                    [RowHeaderLeafClass, BodyCellClass, BodyCellClass, BodyCellClass + ' ' + TotalClass],
                    [RowHeaderLeafClass, BodyCellClass, BodyCellClass, BodyCellClass + ' ' + TotalClass],
                    [RowHeaderLeafClass, BodyCellClass, BodyCellClass, BodyCellClass + ' ' + TotalClass],
                    [RowHeaderLeafClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass],
                ];
                validateClassNames(expectedClassNames);
                done();
            }, DefaultWaitForRender);
        });
        it('Matrix with multiple row and column group hierarchy levels, one measure with subtotals', function (done) {
            var matrix = matrixTwoRowGroupsTwoColumnGroupsOneMeasureAndTotals;
            v.onDataChanged({
                dataViews: [{
                    metadata: {
                        columns: [
                            rowGroupSource1,
                            rowGroupSource2,
                            columnGroupSource1,
                            columnGroupSource2,
                            measureSource1
                        ],
                        objects: {
                            general: {
                                rowSubtotals: true,
                                columnSubtotals: true
                            }
                        }
                    },
                    matrix: matrix
                }]
            });
            setTimeout(function () {
                var colHeader1 = matrix.columns.root.children[0];
                var colHeader2 = matrix.columns.root.children[1];
                var colHeader1_1 = matrix.columns.root.children[0].children[0];
                var colHeader1_2 = matrix.columns.root.children[0].children[1];
                var colHeader2_1 = matrix.columns.root.children[1].children[0];
                var colHeader2_2 = matrix.columns.root.children[1].children[1];
                var rowHeader1 = matrix.rows.root.children[0];
                var rowHeader2 = matrix.rows.root.children[1];
                var rowHeader3 = matrix.rows.root.children[2];
                var rowHeader4 = matrix.rows.root.children[3];
                var rowHeadert = matrix.rows.root.children[4];
                var rowHeader1_1 = matrix.rows.root.children[0].children[0];
                var rowHeader1_2 = matrix.rows.root.children[0].children[1];
                var rowHeader1_t = matrix.rows.root.children[0].children[2];
                var rowHeader2_1 = matrix.rows.root.children[1].children[0];
                var rowHeader2_2 = matrix.rows.root.children[1].children[1];
                var rowHeader2_t = matrix.rows.root.children[1].children[2];
                var rowHeader3_1 = matrix.rows.root.children[2].children[0];
                var rowHeader3_t = matrix.rows.root.children[2].children[1];
                var rowHeader4_1 = matrix.rows.root.children[3].children[0];
                var rowHeader4_t = matrix.rows.root.children[3].children[1];
                var expectedCells = [
                    ['', columnGroupSource1.name, colHeader1.value.toString(), colHeader2.value.toString(), TableTotalLabel, ''],
                    [rowGroupSource1.name, rowGroupSource2.name, colHeader1_1.value.toString(), colHeader1_2.value.toString(), TableTotalLabel, colHeader2_1.value.toString(), colHeader2_2.value.toString(), TableTotalLabel],
                    [rowHeader1.value.toString(), rowHeader1_1.value.toString(), formatter(rowHeader1_1.values[0].value, measureSource1), formatter(rowHeader1_1.values[1].value, measureSource1), formatter(rowHeader1_1.values[2].value, measureSource1), formatter(rowHeader1_1.values[3].value, measureSource1), formatter(rowHeader1_1.values[4].value, measureSource1), formatter(rowHeader1_1.values[5].value, measureSource1), formatter(rowHeader1_1.values[6].value, measureSource1)],
                    [rowHeader1_2.value.toString(), formatter(rowHeader1_2.values[0].value, measureSource1), formatter(rowHeader1_2.values[1].value, measureSource1), formatter(rowHeader1_2.values[2].value, measureSource1), formatter(rowHeader1_2.values[3].value, measureSource1), formatter(rowHeader1_2.values[4].value, measureSource1), formatter(rowHeader1_2.values[5].value, measureSource1), formatter(rowHeader1_2.values[6].value, measureSource1)],
                    [TableTotalLabel, formatter(rowHeader1_t.values[0].value, measureSource1), formatter(rowHeader1_t.values[1].value, measureSource1), formatter(rowHeader1_t.values[2].value, measureSource1), formatter(rowHeader1_t.values[3].value, measureSource1), formatter(rowHeader1_t.values[4].value, measureSource1), formatter(rowHeader1_t.values[5].value, measureSource1), formatter(rowHeader1_t.values[6].value, measureSource1)],
                    [rowHeader2.value.toString(), rowHeader2_1.value.toString(), formatter(rowHeader2_1.values[0].value, measureSource1), formatter(rowHeader2_1.values[1].value, measureSource1), formatter(rowHeader2_1.values[2].value, measureSource1), formatter(rowHeader2_1.values[3].value, measureSource1), formatter(rowHeader2_1.values[4].value, measureSource1), formatter(rowHeader2_1.values[5].value, measureSource1), formatter(rowHeader2_1.values[6].value, measureSource1)],
                    [rowHeader2_2.value.toString(), formatter(rowHeader2_2.values[0].value, measureSource1), formatter(rowHeader2_2.values[1].value, measureSource1), formatter(rowHeader2_2.values[2].value, measureSource1), formatter(rowHeader2_2.values[3].value, measureSource1), formatter(rowHeader2_2.values[4].value, measureSource1), formatter(rowHeader2_2.values[5].value, measureSource1), formatter(rowHeader2_2.values[6].value, measureSource1)],
                    [TableTotalLabel, formatter(rowHeader2_t.values[0].value, measureSource1), formatter(rowHeader2_t.values[1].value, measureSource1), formatter(rowHeader2_t.values[2].value, measureSource1), formatter(rowHeader2_t.values[3].value, measureSource1), formatter(rowHeader2_t.values[4].value, measureSource1), formatter(rowHeader2_t.values[5].value, measureSource1), formatter(rowHeader2_t.values[6].value, measureSource1)],
                    [rowHeader3.value.toString(), rowHeader3_1.value.toString(), formatter(rowHeader3_1.values[0].value, measureSource1), formatter(rowHeader3_1.values[1].value, measureSource1), formatter(rowHeader3_1.values[2].value, measureSource1), formatter(rowHeader3_1.values[3].value, measureSource1), formatter(rowHeader3_1.values[4].value, measureSource1), formatter(rowHeader3_1.values[5].value, measureSource1), formatter(rowHeader3_1.values[6].value, measureSource1)],
                    [TableTotalLabel, formatter(rowHeader3_t.values[0].value, measureSource1), formatter(rowHeader3_t.values[1].value, measureSource1), formatter(rowHeader3_t.values[2].value, measureSource1), formatter(rowHeader3_t.values[3].value, measureSource1), formatter(rowHeader3_t.values[4].value, measureSource1), formatter(rowHeader3_t.values[5].value, measureSource1), formatter(rowHeader3_t.values[6].value, measureSource1)],
                    [rowHeader4.value.toString(), rowHeader4_1.value.toString(), formatter(rowHeader4_1.values[0].value, measureSource1), formatter(rowHeader4_1.values[1].value, measureSource1), formatter(rowHeader4_1.values[2].value, measureSource1), formatter(rowHeader4_1.values[3].value, measureSource1), formatter(rowHeader4_1.values[4].value, measureSource1), formatter(rowHeader4_1.values[5].value, measureSource1), formatter(rowHeader4_1.values[6].value, measureSource1)],
                    [TableTotalLabel, formatter(rowHeader4_t.values[0].value, measureSource1), formatter(rowHeader4_t.values[1].value, measureSource1), formatter(rowHeader4_t.values[2].value, measureSource1), formatter(rowHeader4_t.values[3].value, measureSource1), formatter(rowHeader4_t.values[4].value, measureSource1), formatter(rowHeader4_t.values[5].value, measureSource1), formatter(rowHeader4_t.values[6].value, measureSource1)],
                    [TableTotalLabel, formatter(rowHeadert.values[0].value, measureSource1), formatter(rowHeadert.values[1].value, measureSource1), formatter(rowHeadert.values[2].value, measureSource1), formatter(rowHeadert.values[3].value, measureSource1), formatter(rowHeadert.values[4].value, measureSource1), formatter(rowHeadert.values[5].value, measureSource1), formatter(rowHeadert.values[6].value, measureSource1)]
                ];
                var expectedClassNames = [
                    [HeaderClass, RowHeaderLeafClass, HeaderClass, HeaderClass, ColumnHeaderLeafClass + ' ' + TotalClass, ''],
                    [ColumnHeaderLeafClass, ColumnHeaderLeafClass + ' ' + RowHeaderLeafClass, ColumnHeaderLeafClass, ColumnHeaderLeafClass, ColumnHeaderLeafClass + ' ' + TotalClass, ColumnHeaderLeafClass, ColumnHeaderLeafClass, ColumnHeaderLeafClass + ' ' + TotalClass],
                    [HeaderClass, RowHeaderLeafClass, BodyCellClass, BodyCellClass, BodyCellClass + ' ' + TotalClass, BodyCellClass, BodyCellClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass],
                    [RowHeaderLeafClass, BodyCellClass, BodyCellClass, BodyCellClass + ' ' + TotalClass, BodyCellClass, BodyCellClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass],
                    [RowHeaderLeafClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass],
                    [HeaderClass, RowHeaderLeafClass, BodyCellClass, BodyCellClass, BodyCellClass + ' ' + TotalClass, BodyCellClass, BodyCellClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass],
                    [RowHeaderLeafClass, BodyCellClass, BodyCellClass, BodyCellClass + ' ' + TotalClass, BodyCellClass, BodyCellClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass],
                    [RowHeaderLeafClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass],
                    [HeaderClass, RowHeaderLeafClass, BodyCellClass, BodyCellClass, BodyCellClass + ' ' + TotalClass, BodyCellClass, BodyCellClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass],
                    [RowHeaderLeafClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass],
                    [HeaderClass, RowHeaderLeafClass, BodyCellClass, BodyCellClass, BodyCellClass + ' ' + TotalClass, BodyCellClass, BodyCellClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass],
                    [RowHeaderLeafClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass],
                    [RowHeaderLeafClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass],
                ];
                validateClassNames(expectedClassNames);
                validateMatrix(expectedCells);
                done();
            }, DefaultWaitForRender);
        });
        it('Matrix with multiple row and column group hierarchy levels, two measures with subtotals', function (done) {
            var matrix = matrixTwoRowGroupsTwoColumnGroupsTwoMeasuresAndTotals;
            v.onDataChanged({
                dataViews: [{
                    metadata: {
                        columns: [
                            rowGroupSource1,
                            rowGroupSource2,
                            columnGroupSource1,
                            columnGroupSource2,
                            measureSource1,
                            measureSource2
                        ],
                        objects: {
                            general: {
                                rowSubtotals: true,
                                columnSubtotals: true
                            }
                        }
                    },
                    matrix: matrix
                }]
            });
            setTimeout(function () {
                var colHeader1 = matrix.columns.root.children[0];
                var colHeader2 = matrix.columns.root.children[1];
                var colHeader1_1 = matrix.columns.root.children[0].children[0];
                var colHeader1_2 = matrix.columns.root.children[0].children[1];
                var colHeader2_1 = matrix.columns.root.children[1].children[0];
                var colHeader2_2 = matrix.columns.root.children[1].children[1];
                var rowHeader1 = matrix.rows.root.children[0];
                var rowHeader2 = matrix.rows.root.children[1];
                var rowHeader3 = matrix.rows.root.children[2];
                var rowHeader4 = matrix.rows.root.children[3];
                var rowHeadert = matrix.rows.root.children[4];
                var rowHeader1_1 = matrix.rows.root.children[0].children[0];
                var rowHeader1_2 = matrix.rows.root.children[0].children[1];
                var rowHeader1_t = matrix.rows.root.children[0].children[2];
                var rowHeader2_1 = matrix.rows.root.children[1].children[0];
                var rowHeader2_2 = matrix.rows.root.children[1].children[1];
                var rowHeader2_t = matrix.rows.root.children[1].children[2];
                var rowHeader3_1 = matrix.rows.root.children[2].children[0];
                var rowHeader3_t = matrix.rows.root.children[2].children[1];
                var rowHeader4_1 = matrix.rows.root.children[3].children[0];
                var rowHeader4_t = matrix.rows.root.children[3].children[1];
                var expectedCells = [
                    ['', columnGroupSource1.name, colHeader1.value.toString(), colHeader2.value.toString(), TableTotalLabel, ''],
                    ['', columnGroupSource2.name, colHeader1_1.value.toString(), colHeader1_2.value.toString(), TableTotalLabel, colHeader2_1.value.toString(), colHeader2_2.value.toString(), TableTotalLabel],
                    [rowGroupSource1.name, rowGroupSource2.name, measureSource1.name, measureSource2.name, measureSource1.name, measureSource2.name, measureSource1.name, measureSource2.name, measureSource1.name, measureSource2.name, measureSource1.name, measureSource2.name, measureSource1.name, measureSource2.name, measureSource1.name, measureSource2.name],
                    [rowHeader1.value.toString(), rowHeader1_1.value.toString(), formatter(rowHeader1_1.values[0].value, measureSource1), formatter(rowHeader1_1.values[1].value, measureSource1), formatter(rowHeader1_1.values[2].value, measureSource1), formatter(rowHeader1_1.values[3].value, measureSource1), formatter(rowHeader1_1.values[4].value, measureSource1), formatter(rowHeader1_1.values[5].value, measureSource1), formatter(rowHeader1_1.values[6].value, measureSource1), formatter(rowHeader1_1.values[7].value, measureSource1), formatter(rowHeader1_1.values[8].value, measureSource1), formatter(rowHeader1_1.values[9].value, measureSource1), formatter(rowHeader1_1.values[10].value, measureSource1), formatter(rowHeader1_1.values[11].value, measureSource1), formatter(rowHeader1_1.values[12].value, measureSource1), formatter(rowHeader1_1.values[13].value, measureSource1)],
                    [rowHeader1_2.value.toString(), formatter(rowHeader1_2.values[0].value, measureSource1), formatter(rowHeader1_2.values[1].value, measureSource1), formatter(rowHeader1_2.values[2].value, measureSource1), formatter(rowHeader1_2.values[3].value, measureSource1), formatter(rowHeader1_2.values[4].value, measureSource1), formatter(rowHeader1_2.values[5].value, measureSource1), formatter(rowHeader1_2.values[6].value, measureSource1), formatter(rowHeader1_2.values[7].value, measureSource1), formatter(rowHeader1_2.values[8].value, measureSource1), formatter(rowHeader1_2.values[9].value, measureSource1), formatter(rowHeader1_2.values[10].value, measureSource1), formatter(rowHeader1_2.values[11].value, measureSource1), formatter(rowHeader1_2.values[12].value, measureSource1), formatter(rowHeader1_2.values[13].value, measureSource1)],
                    [TableTotalLabel, formatter(rowHeader1_t.values[0].value, measureSource1), formatter(rowHeader1_t.values[1].value, measureSource1), formatter(rowHeader1_t.values[2].value, measureSource1), formatter(rowHeader1_t.values[3].value, measureSource1), formatter(rowHeader1_t.values[4].value, measureSource1), formatter(rowHeader1_t.values[5].value, measureSource1), formatter(rowHeader1_t.values[6].value, measureSource1), formatter(rowHeader1_t.values[7].value, measureSource1), formatter(rowHeader1_t.values[8].value, measureSource1), formatter(rowHeader1_t.values[9].value, measureSource1), formatter(rowHeader1_t.values[10].value, measureSource1), formatter(rowHeader1_t.values[11].value, measureSource1), formatter(rowHeader1_t.values[12].value, measureSource1), formatter(rowHeader1_t.values[13].value, measureSource1)],
                    [rowHeader2.value.toString(), rowHeader2_1.value.toString(), formatter(rowHeader2_1.values[0].value, measureSource1), formatter(rowHeader2_1.values[1].value, measureSource1), formatter(rowHeader2_1.values[2].value, measureSource1), formatter(rowHeader2_1.values[3].value, measureSource1), formatter(rowHeader2_1.values[4].value, measureSource1), formatter(rowHeader2_1.values[5].value, measureSource1), formatter(rowHeader2_1.values[6].value, measureSource1), formatter(rowHeader2_1.values[7].value, measureSource1), formatter(rowHeader2_1.values[8].value, measureSource1), formatter(rowHeader2_1.values[9].value, measureSource1), formatter(rowHeader2_1.values[10].value, measureSource1), formatter(rowHeader2_1.values[11].value, measureSource1), formatter(rowHeader2_1.values[12].value, measureSource1), formatter(rowHeader2_1.values[13].value, measureSource1)],
                    [rowHeader2_2.value.toString(), formatter(rowHeader2_2.values[0].value, measureSource1), formatter(rowHeader2_2.values[1].value, measureSource1), formatter(rowHeader2_2.values[2].value, measureSource1), formatter(rowHeader2_2.values[3].value, measureSource1), formatter(rowHeader2_2.values[4].value, measureSource1), formatter(rowHeader2_2.values[5].value, measureSource1), formatter(rowHeader2_2.values[6].value, measureSource1), formatter(rowHeader2_2.values[7].value, measureSource1), formatter(rowHeader2_2.values[8].value, measureSource1), formatter(rowHeader2_2.values[9].value, measureSource1), formatter(rowHeader2_2.values[10].value, measureSource1), formatter(rowHeader2_2.values[11].value, measureSource1), formatter(rowHeader2_2.values[12].value, measureSource1), formatter(rowHeader2_2.values[13].value, measureSource1)],
                    [TableTotalLabel, formatter(rowHeader2_t.values[0].value, measureSource1), formatter(rowHeader2_t.values[1].value, measureSource1), formatter(rowHeader2_t.values[2].value, measureSource1), formatter(rowHeader2_t.values[3].value, measureSource1), formatter(rowHeader2_t.values[4].value, measureSource1), formatter(rowHeader2_t.values[5].value, measureSource1), formatter(rowHeader2_t.values[6].value, measureSource1), formatter(rowHeader2_t.values[7].value, measureSource1), formatter(rowHeader2_t.values[8].value, measureSource1), formatter(rowHeader2_t.values[9].value, measureSource1), formatter(rowHeader2_t.values[10].value, measureSource1), formatter(rowHeader2_t.values[11].value, measureSource1), formatter(rowHeader2_t.values[12].value, measureSource1), formatter(rowHeader2_t.values[13].value, measureSource1)],
                    [rowHeader3.value.toString(), rowHeader3_1.value.toString(), formatter(rowHeader3_1.values[0].value, measureSource1), formatter(rowHeader3_1.values[1].value, measureSource1), formatter(rowHeader3_1.values[2].value, measureSource1), formatter(rowHeader3_1.values[3].value, measureSource1), formatter(rowHeader3_1.values[4].value, measureSource1), formatter(rowHeader3_1.values[5].value, measureSource1), formatter(rowHeader3_1.values[6].value, measureSource1), formatter(rowHeader3_1.values[7].value, measureSource1), formatter(rowHeader3_1.values[8].value, measureSource1), formatter(rowHeader3_1.values[9].value, measureSource1), formatter(rowHeader3_1.values[10].value, measureSource1), formatter(rowHeader3_1.values[11].value, measureSource1), formatter(rowHeader3_1.values[12].value, measureSource1), formatter(rowHeader3_1.values[13].value, measureSource1)],
                    [TableTotalLabel, formatter(rowHeader3_t.values[0].value, measureSource1), formatter(rowHeader3_t.values[1].value, measureSource1), formatter(rowHeader3_t.values[2].value, measureSource1), formatter(rowHeader3_t.values[3].value, measureSource1), formatter(rowHeader3_t.values[4].value, measureSource1), formatter(rowHeader3_t.values[5].value, measureSource1), formatter(rowHeader3_t.values[6].value, measureSource1), formatter(rowHeader3_t.values[7].value, measureSource1), formatter(rowHeader3_t.values[8].value, measureSource1), formatter(rowHeader3_t.values[9].value, measureSource1), formatter(rowHeader3_t.values[10].value, measureSource1), formatter(rowHeader3_t.values[11].value, measureSource1), formatter(rowHeader3_t.values[12].value, measureSource1), formatter(rowHeader3_t.values[13].value, measureSource1)],
                    [rowHeader4.value.toString(), rowHeader4_1.value.toString(), formatter(rowHeader4_1.values[0].value, measureSource1), formatter(rowHeader4_1.values[1].value, measureSource1), formatter(rowHeader4_1.values[2].value, measureSource1), formatter(rowHeader4_1.values[3].value, measureSource1), formatter(rowHeader4_1.values[4].value, measureSource1), formatter(rowHeader4_1.values[5].value, measureSource1), formatter(rowHeader4_1.values[6].value, measureSource1), formatter(rowHeader4_1.values[7].value, measureSource1), formatter(rowHeader4_1.values[8].value, measureSource1), formatter(rowHeader4_1.values[9].value, measureSource1), formatter(rowHeader4_1.values[10].value, measureSource1), formatter(rowHeader4_1.values[11].value, measureSource1), formatter(rowHeader4_1.values[12].value, measureSource1), formatter(rowHeader4_1.values[13].value, measureSource1)],
                    [TableTotalLabel, formatter(rowHeader4_t.values[0].value, measureSource1), formatter(rowHeader4_t.values[1].value, measureSource1), formatter(rowHeader4_t.values[2].value, measureSource1), formatter(rowHeader4_t.values[3].value, measureSource1), formatter(rowHeader4_t.values[4].value, measureSource1), formatter(rowHeader4_t.values[5].value, measureSource1), formatter(rowHeader4_t.values[6].value, measureSource1), formatter(rowHeader4_t.values[7].value, measureSource1), formatter(rowHeader4_t.values[8].value, measureSource1), formatter(rowHeader4_t.values[9].value, measureSource1), formatter(rowHeader4_t.values[10].value, measureSource1), formatter(rowHeader4_t.values[11].value, measureSource1), formatter(rowHeader4_t.values[12].value, measureSource1), formatter(rowHeader4_t.values[13].value, measureSource1)],
                    [TableTotalLabel, formatter(rowHeadert.values[0].value, measureSource1), formatter(rowHeadert.values[1].value, measureSource1), formatter(rowHeadert.values[2].value, measureSource1), formatter(rowHeadert.values[3].value, measureSource1), formatter(rowHeadert.values[4].value, measureSource1), formatter(rowHeadert.values[5].value, measureSource1), formatter(rowHeadert.values[6].value, measureSource1), formatter(rowHeadert.values[7].value, measureSource1), formatter(rowHeadert.values[8].value, measureSource1), formatter(rowHeadert.values[9].value, measureSource1), formatter(rowHeadert.values[10].value, measureSource1), formatter(rowHeadert.values[11].value, measureSource1), formatter(rowHeadert.values[12].value, measureSource1), formatter(rowHeadert.values[13].value, measureSource1)]
                ];
                validateMatrix(expectedCells);
                var expectedClassNames = [
                    [HeaderClass, RowHeaderLeafClass, HeaderClass, HeaderClass, HeaderClass + ' ' + TotalClass, ''],
                    [HeaderClass, RowHeaderLeafClass, HeaderClass, HeaderClass, HeaderClass + ' ' + TotalClass, HeaderClass, HeaderClass, HeaderClass + ' ' + TotalClass],
                    [ColumnHeaderLeafClass, ColumnHeaderLeafClass + ' ' + RowHeaderLeafClass, ColumnHeaderLeafClass, ColumnHeaderLeafClass, ColumnHeaderLeafClass, ColumnHeaderLeafClass, ColumnHeaderLeafClass + ' ' + TotalClass, ColumnHeaderLeafClass + ' ' + TotalClass, ColumnHeaderLeafClass, ColumnHeaderLeafClass, ColumnHeaderLeafClass, ColumnHeaderLeafClass, ColumnHeaderLeafClass + ' ' + TotalClass, ColumnHeaderLeafClass + ' ' + TotalClass, ColumnHeaderLeafClass + ' ' + TotalClass, ColumnHeaderLeafClass + ' ' + TotalClass],
                    [HeaderClass, RowHeaderLeafClass, BodyCellClass, BodyCellClass, BodyCellClass, BodyCellClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass, BodyCellClass, BodyCellClass, BodyCellClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass],
                    [RowHeaderLeafClass, BodyCellClass, BodyCellClass, BodyCellClass, BodyCellClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass, BodyCellClass, BodyCellClass, BodyCellClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass],
                    [RowHeaderLeafClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass],
                    [HeaderClass, RowHeaderLeafClass, BodyCellClass, BodyCellClass, BodyCellClass, BodyCellClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass, BodyCellClass, BodyCellClass, BodyCellClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass],
                    [RowHeaderLeafClass, BodyCellClass, BodyCellClass, BodyCellClass, BodyCellClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass, BodyCellClass, BodyCellClass, BodyCellClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass],
                    [RowHeaderLeafClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass],
                    [HeaderClass, RowHeaderLeafClass, BodyCellClass, BodyCellClass, BodyCellClass, BodyCellClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass, BodyCellClass, BodyCellClass, BodyCellClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass],
                    [RowHeaderLeafClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass],
                    [HeaderClass, RowHeaderLeafClass, BodyCellClass, BodyCellClass, BodyCellClass, BodyCellClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass, BodyCellClass, BodyCellClass, BodyCellClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass],
                    [RowHeaderLeafClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass],
                    [RowHeaderLeafClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass, BodyCellClass + ' ' + TotalClass],
                ];
                validateClassNames(expectedClassNames);
                done();
            }, DefaultWaitForRender);
        });
        it('Verify Interactivity modes', function (done) {
            // Pick a matrix that exceeds the viewport
            v.init({
                element: element,
                host: powerbitests.mocks.createVisualHostServices(),
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { isInteractiveLegend: false }
            });
            v.onDataChanged({
                dataViews: [matrixTwoRowGroupsTwoColumnGroupsTwoMeasuresDataView]
            });
            setTimeout(function () {
                var scrollbars = $('.bi-tablix .scroll-bar-div');
                var verticalScrollbar = scrollbars.eq(0);
                var horizontalScrollbar = scrollbars.eq(1);
                // Check Style
                expect(verticalScrollbar.css("width")).toBe("0px");
                expect(horizontalScrollbar.css("height")).toBe("0px");
                // Check Values
                expect(verticalScrollbar.width()).toBe(0);
                expect(horizontalScrollbar.height()).toBe(0);
                done();
            }, DefaultWaitForRender);
        });
        function formatter(value, source) {
            return valueFormatter.formatRaw(value, valueFormatter.getFormatString(source, Matrix.formatStringProp));
        }
    });
    describe("Matrix sort validation", function () {
        var element;
        beforeEach(function (done) {
            powerbitests.helpers.suppressDebugAssertFailure();
            element = powerbitests.helpers.testDom('1800', '1800');
            done();
        });
        it('matrix with single measure', function (done) {
            // Clicking on the measure will result in a sort event
            var data = matrixOneMeasureDataView;
            var expectedColumnHeaders = [{ row: 0, col: 1, expectedText: "Measure1" }];
            var clicks = [{ row: 0, col: 1 }, { row: 1, col: 1 }];
            var expectedSorts = [];
            powerbitests.tablixHelper.runTablixSortTest(element, done, "matrix", data, expectedColumnHeaders, clicks, expectedSorts);
        });
        it('matrix with one measure and one column group', function (done) {
            // Clicking on a column group (even if there is only a single instance) will not result in a sort event
            var data = matrixOneMeasureOneColumnGroupOneGroupInstanceDataView;
            var expectedColumnHeaders = [{ row: 0, col: 1, expectedText: "Group A" }];
            var clicks = [{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 0, col: 1 }];
            var expectedSorts = [];
            powerbitests.tablixHelper.runTablixSortTest(element, done, "matrix", data, expectedColumnHeaders, clicks, expectedSorts);
        });
        it('matrix with three measures', function (done) {
            // Clicking on any measure will result in a sort event
            var data = matrixThreeMeasuresDataView;
            var expectedColumnHeaders = [{ row: 0, col: 1, expectedText: "Measure1" }, { row: 0, col: 2, expectedText: "Measure2" }, { row: 0, col: 3, expectedText: "Measure3" }];
            var clicks = [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }];
            var expectedSorts = [];
            powerbitests.tablixHelper.runTablixSortTest(element, done, "matrix", data, expectedColumnHeaders, clicks, expectedSorts);
        });
        it('matrix with three measures under one column group', function (done) {
            // Clicking on any column group or any measure underneath it will not result in a sort event
            var data = matrixThreeMeasuresOneColumnGroupOneGroupInstanceDataView;
            var expectedColumnHeaders = [{ row: 0, col: 1, expectedText: "Group A" }, { row: 1, col: 1, expectedText: "Measure1" }, { row: 1, col: 2, expectedText: "Measure2" }, { row: 1, col: 3, expectedText: "Measure3" }];
            var clicks = [{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }];
            var expectedSorts = [];
            powerbitests.tablixHelper.runTablixSortTest(element, done, "matrix", data, expectedColumnHeaders, clicks, expectedSorts);
        });
        it('matrix with three measures and three row groups', function (done) {
            // Clicking on any row group or any measure will result in a sort event
            var data = matrixThreeMeasuresThreeRowGroupsDataView;
            var expectedColumnHeaders = [
                { row: 0, col: 0, expectedText: "RowGroup1" },
                { row: 0, col: 1, expectedText: "RowGroup2" },
                { row: 0, col: 2, expectedText: "RowGroup3" },
                { row: 0, col: 3, expectedText: "Measure1" },
                { row: 0, col: 4, expectedText: "Measure2" },
                { row: 0, col: 5, expectedText: "Measure3" }
            ];
            var clicks = [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }, { row: 0, col: 5 }];
            var expectedSorts = [
                [{ queryName: "RowGroup1" }],
                [{ queryName: "RowGroup2" }],
                [{ queryName: "RowGroup3" }],
                [{ queryName: "Measure1" }],
                [{ queryName: "Measure2" }],
                [{ queryName: "Measure3" }]
            ];
            powerbitests.tablixHelper.runTablixSortTest(element, done, "matrix", data, expectedColumnHeaders, clicks, expectedSorts);
        });
        it('matrix with one row group and one column group', function (done) {
            // Clicking on the row group will result in a sort event; clicking on the column group will not
            var data = matrixOneRowGroupOneColumnGroupOneGroupInstanceDataView;
            var expectedColumnHeaders = [
                { row: 0, col: 0, expectedText: "RowGroup1" },
                { row: 0, col: 1, expectedText: "10" }
            ];
            var clicks = [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }];
            var expectedSorts = [
                [{ queryName: "RowGroup1" }],
            ];
            powerbitests.tablixHelper.runTablixSortTest(element, done, "matrix", data, expectedColumnHeaders, clicks, expectedSorts);
        });
        it('matrix with one row group and one column group', function (done) {
            // Clicking on any row group will result in a sort event
            var data = matrixThreeRowGroupsOneGroupInstanceDataView;
            var expectedColumnHeaders = [
                { row: 0, col: 0, expectedText: "RowGroup1" },
                { row: 0, col: 1, expectedText: "RowGroup2" },
                { row: 0, col: 2, expectedText: "RowGroup3" }
            ];
            var clicks = [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }];
            var expectedSorts = [
                [{ queryName: "RowGroup1" }],
                [{ queryName: "RowGroup2" }],
                [{ queryName: "RowGroup3" }],
            ];
            powerbitests.tablixHelper.runTablixSortTest(element, done, "matrix", data, expectedColumnHeaders, clicks, expectedSorts);
        });
        it('matrix with three column groups', function (done) {
            // Clicking on any column group will not result in a sort event
            var data = matrixThreeColumnGroupsDataView;
            var expectedColumnHeaders = [
                { row: 0, col: 1, expectedText: "Africa" },
                { row: 0, col: 2, expectedText: "Asia" },
                { row: 1, col: 1, expectedText: "Algeria" },
                { row: 1, col: 2, expectedText: "Angola" },
                { row: 1, col: 3, expectedText: "China" },
                { row: 1, col: 4, expectedText: "India" },
                { row: 2, col: 1, expectedText: "2008" },
                { row: 2, col: 2, expectedText: "2012" },
                { row: 2, col: 3, expectedText: "2008" },
                { row: 2, col: 4, expectedText: "2012" },
                { row: 2, col: 5, expectedText: "2008" },
                { row: 2, col: 6, expectedText: "2012" },
                { row: 2, col: 7, expectedText: "2008" },
                { row: 2, col: 8, expectedText: "2012" },
            ];
            var clicks = [
                { row: 0, col: 1 },
                { row: 0, col: 2 },
                { row: 1, col: 1 },
                { row: 1, col: 2 },
                { row: 1, col: 3 },
                { row: 1, col: 4 },
                { row: 2, col: 1 },
                { row: 2, col: 2 },
                { row: 2, col: 3 },
                { row: 2, col: 4 },
                { row: 2, col: 5 },
                { row: 2, col: 6 },
                { row: 2, col: 7 },
                { row: 2, col: 8 },
            ];
            var expectedSorts = [];
            powerbitests.tablixHelper.runTablixSortTest(element, done, "matrix", data, expectedColumnHeaders, clicks, expectedSorts);
        });
        it('matrix with two row groups, two column groups and two measures', function (done) {
            // Clicking on any row group will result in a sort event, clicking on any column group or measure column will not result in a sort event
            var data = matrixTwoRowGroupsTwoColumnGroupsTwoMeasuresDataView;
            var expectedColumnHeaders = [
                { row: 0, col: 1, expectedText: "ColGroup1" },
                { row: 0, col: 2, expectedText: "1992" },
                { row: 0, col: 3, expectedText: "1996" },
                { row: 1, col: 1, expectedText: "ColGroup2" },
                { row: 1, col: 2, expectedText: "Bronze" },
                { row: 1, col: 3, expectedText: "Gold" },
                { row: 1, col: 4, expectedText: "Silver" },
                { row: 1, col: 5, expectedText: "Bronze" },
                { row: 1, col: 6, expectedText: "Gold" },
                { row: 1, col: 7, expectedText: "Silver" },
                { row: 2, col: 0, expectedText: "RowGroup1" },
                { row: 2, col: 1, expectedText: "RowGroup2" },
                { row: 2, col: 2, expectedText: "Measure1" },
                { row: 2, col: 3, expectedText: "Measure2" },
                { row: 2, col: 4, expectedText: "Measure1" },
                { row: 2, col: 5, expectedText: "Measure2" },
                { row: 2, col: 6, expectedText: "Measure1" },
                { row: 2, col: 7, expectedText: "Measure2" },
                { row: 2, col: 8, expectedText: "Measure1" },
                { row: 2, col: 9, expectedText: "Measure2" },
                { row: 2, col: 10, expectedText: "Measure1" },
                { row: 2, col: 11, expectedText: "Measure2" },
                { row: 2, col: 12, expectedText: "Measure1" }
            ];
            var clicks = [
                { row: 0, col: 1 },
                { row: 0, col: 2 },
                { row: 0, col: 3 },
                { row: 1, col: 1 },
                { row: 1, col: 2 },
                { row: 1, col: 3 },
                { row: 1, col: 4 },
                { row: 1, col: 5 },
                { row: 1, col: 6 },
                { row: 1, col: 7 },
                { row: 2, col: 0 },
                { row: 2, col: 1 },
                { row: 2, col: 2 },
                { row: 2, col: 3 },
                { row: 2, col: 4 },
                { row: 2, col: 5 },
                { row: 2, col: 6 },
                { row: 2, col: 7 },
                { row: 2, col: 8 },
                { row: 2, col: 9 },
                { row: 2, col: 10 },
                { row: 2, col: 11 },
                { row: 2, col: 12 },
            ];
            var expectedSorts = [
                [{ queryName: "RowGroup1" }],
                [{ queryName: "RowGroup2" }]
            ];
            powerbitests.tablixHelper.runTablixSortTest(element, done, "matrix", data, expectedColumnHeaders, clicks, expectedSorts);
        });
        it('matrix with two row groups, two column groups and one measure with totals', function (done) {
            // Clicking on any row group will result in a sort event, clicking on any column group or measure column will not result in a sort event; clicking on the column grand total will result in a sort (by measure)
            var data = matrixTwoRowGroupsTwoColumnGroupsOneMeasureAndTotalsDataView;
            var expectedColumnHeaders = [
                { row: 0, col: 1, expectedText: "ColGroup1" },
                { row: 0, col: 2, expectedText: "1992" },
                { row: 0, col: 3, expectedText: "1996" },
                { row: 0, col: 4, expectedText: Matrix.TotalLabel },
                { row: 1, col: 0, expectedText: "RowGroup1" },
                { row: 1, col: 1, expectedText: "RowGroup2" },
                { row: 1, col: 2, expectedText: "Silver" },
                { row: 1, col: 3, expectedText: "Gold" },
                { row: 1, col: 4, expectedText: Matrix.TotalLabel },
                { row: 1, col: 5, expectedText: "Silver" },
                { row: 1, col: 6, expectedText: "Gold" },
                { row: 1, col: 7, expectedText: Matrix.TotalLabel },
            ];
            var clicks = [
                { row: 0, col: 1 },
                { row: 0, col: 2 },
                { row: 0, col: 3 },
                { row: 0, col: 4 },
                { row: 1, col: 0 },
                { row: 1, col: 1 },
                { row: 1, col: 2 },
                { row: 1, col: 3 },
                { row: 1, col: 4 },
                { row: 1, col: 5 },
                { row: 1, col: 6 },
                { row: 1, col: 7 },
            ];
            var expectedSorts = [
                [{ queryName: "Measure1" }],
                [{ queryName: "RowGroup1" }],
                [{ queryName: "RowGroup2" }]
            ];
            powerbitests.tablixHelper.runTablixSortTest(element, done, "matrix", data, expectedColumnHeaders, clicks, expectedSorts);
        });
        it('matrix with two row groups, two column groups and two measures with totals', function (done) {
            // Clicking on any row group will result in a sort event, clicking on any column group or measure column will not result in a sort event; clicking on the column grand total will result in a sort (by measure)
            var data = matrixTwoRowGroupsTwoColumnGroupsTwoMeasuresAndTotalsDataView;
            var expectedColumnHeaders = [
                { row: 0, col: 1, expectedText: "ColGroup1" },
                { row: 0, col: 2, expectedText: "1992" },
                { row: 0, col: 3, expectedText: "1996" },
                { row: 0, col: 4, expectedText: Matrix.TotalLabel },
                { row: 1, col: 1, expectedText: "ColGroup2" },
                { row: 1, col: 2, expectedText: "Silver" },
                { row: 1, col: 3, expectedText: "Gold" },
                { row: 1, col: 4, expectedText: Matrix.TotalLabel },
                { row: 1, col: 5, expectedText: "Silver" },
                { row: 1, col: 6, expectedText: "Gold" },
                { row: 1, col: 7, expectedText: Matrix.TotalLabel },
                { row: 2, col: 0, expectedText: "RowGroup1" },
                { row: 2, col: 1, expectedText: "RowGroup2" },
                { row: 2, col: 2, expectedText: "Measure1" },
                { row: 2, col: 3, expectedText: "Measure2" },
                { row: 2, col: 4, expectedText: "Measure1" },
                { row: 2, col: 5, expectedText: "Measure2" },
                { row: 2, col: 6, expectedText: "Measure1" },
                { row: 2, col: 7, expectedText: "Measure2" },
                { row: 2, col: 8, expectedText: "Measure1" },
                { row: 2, col: 9, expectedText: "Measure2" },
                { row: 2, col: 10, expectedText: "Measure1" },
                { row: 2, col: 11, expectedText: "Measure2" },
                { row: 2, col: 12, expectedText: "Measure1" },
                { row: 2, col: 13, expectedText: "Measure2" },
                { row: 2, col: 14, expectedText: "Measure1" },
                { row: 2, col: 15, expectedText: "Measure2" }
            ];
            var clicks = [
                { row: 0, col: 1 },
                { row: 0, col: 2 },
                { row: 0, col: 3 },
                { row: 0, col: 4 },
                { row: 1, col: 1 },
                { row: 1, col: 2 },
                { row: 1, col: 3 },
                { row: 1, col: 4 },
                { row: 1, col: 5 },
                { row: 1, col: 6 },
                { row: 1, col: 7 },
                { row: 2, col: 0 },
                { row: 2, col: 1 },
                { row: 2, col: 2 },
                { row: 2, col: 3 },
                { row: 2, col: 4 },
                { row: 2, col: 5 },
                { row: 2, col: 6 },
                { row: 2, col: 7 },
                { row: 2, col: 8 },
                { row: 2, col: 9 },
                { row: 2, col: 10 },
                { row: 2, col: 11 },
                { row: 2, col: 12 },
                { row: 2, col: 13 },
                { row: 2, col: 14 },
                { row: 2, col: 15 },
            ];
            var expectedSorts = [
                [{ queryName: "RowGroup1" }],
                [{ queryName: "RowGroup2" }],
                [{ queryName: "Measure1" }],
                [{ queryName: "Measure2" }]
            ];
            powerbitests.tablixHelper.runTablixSortTest(element, done, "matrix", data, expectedColumnHeaders, clicks, expectedSorts);
        });
        it('matrix with columnGroup url', function (done) {
            var data = matrixOneMeasureOneColumnGroupWithUrlOneGroupInstanceDataView;
            var renderTablixPromise = powerbitests.tablixHelper.renderNewTablix(element, {
                visualType: 'matrix',
                data: data
            });
            renderTablixPromise.then(function () {
                var tableBody = $('.tablixContainer > div.bi-tablix > div:nth-child(1) > table.unselectable > tbody');
                expect(tableBody).toBeInDOM();
                var cellInfo = powerbitests.tablixHelper.getTableCell(tableBody, { row: 0, col: 1 });
                var aTag = $('> div > a', cellInfo.clickTarget);
                expect(aTag.length).toBe(1);
                expect(aTag.text()).toBe('http://www.validurl.com');
                expect(aTag.attr('href')).toBe('http://www.validurl.com');
                expect(aTag.attr('title')).toBe('http://www.validurl.com');
                done();
            });
        });
        it('matrix with rowGroup url', function (done) {
            var data = matrixOneMeasureOneRowGroupUrlOneGroupInstanceDataView;
            var renderTablixPromise = powerbitests.tablixHelper.renderNewTablix(element, {
                visualType: 'matrix',
                data: data
            });
            renderTablixPromise.then(function () {
                var tableBody = $('.tablixContainer > div.bi-tablix > div:nth-child(1) > table.unselectable > tbody');
                expect(tableBody).toBeInDOM();
                var cellInfo = powerbitests.tablixHelper.getTableCell(tableBody, { row: 1, col: 0 });
                var aTag = $('> div > a', cellInfo.clickTarget);
                expect(aTag.length).toBe(1);
                expect(aTag.text()).toBe('http://www.validurl.com');
                expect(aTag.attr('href')).toBe('http://www.validurl.com');
                expect(aTag.attr('title')).toBe('http://www.validurl.com');
                done();
            });
        });
    });
})(powerbitests || (powerbitests = {}));
