//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbitests;
(function (powerbitests) {
    var CompiledSubtotalType = powerbi.data.CompiledSubtotalType;
    var DataShapeUtility = powerbi.data.dsr.DataShapeUtility;
    var SemanticType = powerbi.data.SemanticType;
    var Table = powerbi.visuals.TableNew;
    var TableHierarchyNavigator = powerbi.visuals.TableHierarchyNavigator;
    var valueFormatter = powerbi.visuals.valueFormatter;
    var DefaultWaitForRender = 500;
    var dataTypeNumber = DataShapeUtility.describeDataType(1 /* Number */);
    var dataTypeString = DataShapeUtility.describeDataType(2048 /* String */);
    var dataTypeWebUrl = DataShapeUtility.describeDataType(2048 /* String */, 'WebUrl');
    var groupSource1 = { name: 'group1', type: dataTypeString, index: 0 };
    var groupSource2 = { name: 'group2', type: dataTypeString, index: 1 };
    var groupSource3 = { name: 'group3', type: dataTypeString, index: 2 };
    var groupSourceWebUrl = { name: 'groupWebUrl', type: dataTypeWebUrl, index: 0 };
    var measureSource1 = { name: 'measure1', type: dataTypeNumber, isMeasure: true, index: 3, objects: { general: { formatString: '#.0' } } };
    var measureSource2 = { name: 'measure2', type: dataTypeNumber, isMeasure: true, index: 4, objects: { general: { formatString: '#.00' } } };
    var measureSource3 = { name: 'measure3', type: dataTypeNumber, isMeasure: true, index: 5, objects: { general: { formatString: '#' } } };
    var webPluginService = new powerbi.visuals.visualPluginFactory.MinervaVisualPluginService({
        heatMap: false,
        newTable: true
    });
    var tableTotals = {
        general: {
            totals: true
        }
    };
    var tableNoTotals = {
        general: {
            totals: false
        }
    };
    var tableOneMeasure = {
        metadata: { columns: [measureSource1] },
        table: {
            columns: [measureSource1],
            rows: [
                [100]
            ]
        }
    };
    var dataViewTableOneGroup = {
        columns: [groupSource1],
        rows: [
            ['A'],
            ['B'],
            ['C']
        ]
    };
    var tableOneGroup = {
        metadata: { columns: [groupSource1] },
        table: dataViewTableOneGroup
    };
    var tableOneGroupNulls = {
        metadata: { columns: [groupSource1] },
        table: {
            columns: [groupSource1],
            rows: [
                [''],
                [null]
            ]
        }
    };
    var dataViewTableTwoGroups = {
        columns: [groupSource1, groupSource2],
        rows: [
            ['A', 'a1'],
            ['A', 'a2'],
            ['A', 'a3'],
            ['B', 'a1'],
            ['B', 'a2'],
            ['C', 'c1'],
            ['C', 'c2']
        ]
    };
    var tableTwoGroups = {
        metadata: { columns: [groupSource1, groupSource2] },
        table: dataViewTableTwoGroups
    };
    var tableTwoGroupsThreeMeasures = {
        metadata: {
            columns: [groupSource1, groupSource2, measureSource1, measureSource2, measureSource3],
            objects: tableTotals
        },
        table: {
            columns: [groupSource1, groupSource2, measureSource1, measureSource2, measureSource3],
            rows: [
                ['A', 'a1', 100, 101, 102],
                ['A', 'a2', 103, 104, 105],
                ['A', 'a3', 106, 107, 108],
                ['B', 'a1', 109, 110, 111],
                ['B', 'a2', 112, 113, 114],
                ['C', 'c1', 115, 116, 117],
                ['C', 'c2', 118, 119, 120]
            ],
            totals: [null, null, 763, 770, 777]
        }
    };
    var tableTwoGroups1MeasureNulls = {
        metadata: {
            columns: [groupSource1, groupSource2, measureSource1],
        },
        table: {
            columns: [groupSource1, groupSource2, measureSource1],
            rows: [
                ['A', 'a1', 100],
                ['', null, 103],
                ['', 'a3', 106],
                ['B', '', 112],
                [null, '', null]
            ]
        }
    };
    var tableThreeGroupsThreeMeasuresInterleaved = {
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
    var tableOneMeasureOneGroupSubtotals = {
        metadata: {
            columns: [measureSource1, groupSource1],
            objects: tableTotals
        },
        table: {
            columns: [measureSource1, groupSource1],
            rows: [
                [1, 'A'],
                [2, 'B'],
                [3, 'C']
            ],
            totals: [6, null]
        }
    };
    var tableOneMeasureOneGroup = {
        metadata: {
            columns: [measureSource1, groupSource1],
            objects: tableNoTotals
        },
        table: {
            columns: [measureSource1, groupSource1],
            rows: [
                [1, 'A'],
                [2, 'B'],
                [3, 'C']
            ]
        }
    };
    var tableWebUrl = {
        metadata: {
            columns: [groupSourceWebUrl],
            objects: tableNoTotals,
        },
        table: {
            columns: [groupSourceWebUrl],
            rows: [
                ['http://www.microsoft.com'],
                ['data:url'],
                ['https://www.microsoft.com/2'],
            ]
        }
    };
    describe('Table', function () {
        it('Table registered capabilities', function () {
            expect(webPluginService.getPlugin('table').capabilities).toEqual(Table.capabilities);
        });
        it('Capabilities should include dataViewMappings', function () {
            expect(Table.capabilities.dataViewMappings).toBeDefined();
        });
        it('Capabilities should include dataRoles', function () {
            expect(Table.capabilities.dataRoles).toBeDefined();
        });
        it('Capabilities should suppressDefaultTitle', function () {
            expect(Table.capabilities.suppressDefaultTitle).toBe(true);
        });
        it('FormatString property should match calculated', function () {
            expect(powerbi.data.DataViewObjectDescriptors.findFormatString(Table.capabilities.objects)).toEqual(Table.formatStringProp);
        });
        it('CustomizeQuery picks up enabled total', function () {
            var objects = {
                general: {
                    totals: true
                }
            };
            var dataViewMapping = createCompiledDataViewMapping(objects);
            Table.customizeQuery({
                dataViewMappings: [dataViewMapping]
            });
            var rows = dataViewMapping.table.rows;
            expect(rows.for.in.subtotalType).toEqual(1 /* Before */);
        });
        it('CustomizeQuery picks up disabled total', function () {
            var objects = {
                general: {
                    totals: false
                }
            };
            var dataViewMapping = createCompiledDataViewMapping(objects);
            powerbi.visuals.TableNew.customizeQuery({
                dataViewMappings: [dataViewMapping]
            });
            var rows = dataViewMapping.table.rows;
            expect(rows.for.in.subtotalType).toEqual(0 /* None */);
        });
        it('CustomizeQuery handles missing settings', function () {
            var dataViewMapping = createCompiledDataViewMapping();
            Table.customizeQuery({
                dataViewMappings: [dataViewMapping]
            });
            // Total should be enabled by default
            var rows = dataViewMapping.table.rows;
            expect(rows.for.in.subtotalType).toEqual(1 /* Before */);
        });
        it('CustomizeQuery handles missing subtotal settings', function () {
            var objects = {
                general: {
                    totals: undefined
                }
            };
            var dataViewMapping = createCompiledDataViewMapping(objects);
            Table.customizeQuery({
                dataViewMappings: [dataViewMapping]
            });
            // Total should be enabled by default
            var rows = dataViewMapping.table.rows;
            expect(rows.for.in.subtotalType).toEqual(1 /* Before */);
        });
        function createCompiledDataViewMapping(objects) {
            return {
                metadata: {
                    objects: objects
                },
                table: {
                    rows: {
                        for: {
                            in: { role: 'Values', items: [] }
                        }
                    }
                }
            };
        }
    });
    describe('Table hierarchy navigator tests', function () {
        function createNavigator(dataView) {
            return new TableHierarchyNavigator(dataView.table, valueFormatter.formatRaw);
        }
        describe('getDepth', function () {
            var dataView = tableTwoGroupsThreeMeasures;
            var navigator = createNavigator(dataView);
            it('returns 1 for row dimension', function () {
                expect(navigator.getDepth(dataView.table.rows)).toBe(1);
            });
            it('returns 1 for column dimension', function () {
                expect(navigator.getDepth(dataView.table.columns)).toBe(1);
            });
            it('always returns 1', function () {
                expect(navigator.getDepth(null)).toBe(1);
            });
        });
        describe('getLeafCount', function () {
            var dataView = tableThreeGroupsThreeMeasuresInterleaved;
            var navigator = createNavigator(dataView);
            it('returns the row count for row dimension', function () {
                expect(navigator.getLeafCount(dataView.table.rows)).toBe(7);
            });
            it('returns the column count for column dimension', function () {
                expect(navigator.getLeafCount(dataView.table.columns)).toBe(6);
            });
        });
        describe('getLeafAt', function () {
            it('returns the correct leaf from the row dimension', function () {
                var dataView = tableTwoGroupsThreeMeasures;
                var navigator = createNavigator(dataView);
                var rows = dataView.table.rows;
                expect(navigator.getLeafAt(rows, 0)).toBe(rows[0]);
                expect(navigator.getLeafAt(rows, 1)).toBe(rows[1]);
                expect(navigator.getLeafAt(rows, 6)).toBe(rows[6]);
            });
            it('returns the correct leaf from the column dimension', function () {
                var dataView = tableThreeGroupsThreeMeasuresInterleaved;
                var navigator = createNavigator(dataView);
                var columns = dataView.table.columns;
                expect(navigator.getLeafAt(columns, 0)).toBe(columns[0]);
                expect(navigator.getLeafAt(columns, 1)).toBe(columns[1]);
                expect(navigator.getLeafAt(columns, 5)).toBe(columns[5]);
            });
            it('returns undefined if index is out of bounds in the row dimension', function () {
                var dataView = tableOneMeasure;
                var navigator = createNavigator(dataView);
                var rows = dataView.table.rows;
                expect(navigator.getLeafAt(rows, 1)).not.toBeDefined();
            });
            it('returns undefined if index is out of bounds in the column dimension', function () {
                var dataView = tableOneMeasure;
                var navigator = createNavigator(dataView);
                var columns = dataView.table.columns;
                expect(navigator.getLeafAt(columns, 1)).not.toBeDefined();
            });
        });
        describe('getParent', function () {
            var dataView = tableTwoGroupsThreeMeasures;
            var navigator = createNavigator(dataView);
            it('returns null for column header', function () {
                var columns = dataView.table.columns;
                expect(navigator.getParent(columns[0])).toBeNull();
            });
            it('returns null for row', function () {
                var rows = dataView.table.rows;
                expect(navigator.getParent(rows[0])).toBeNull();
            });
            it('returns null in any other cases', function () {
                expect(navigator.getParent(null)).toBeNull();
            });
        });
        describe('getIndex', function () {
            it('returns the correct index for columns', function () {
                var dataView = tableThreeGroupsThreeMeasuresInterleaved;
                var navigator = createNavigator(dataView);
                var columns = dataView.table.columns;
                var column1 = columns[0];
                var column2 = columns[1];
                var column3 = columns[2];
                var column4 = columns[3];
                var column5 = columns[4];
                var column6 = columns[5];
                expect(navigator.getIndex(column1)).toBe(0);
                expect(navigator.getIndex(column2)).toBe(1);
                expect(navigator.getIndex(column3)).toBe(2);
                expect(navigator.getIndex(column4)).toBe(3);
                expect(navigator.getIndex(column5)).toBe(4);
                expect(navigator.getIndex(column6)).toBe(5);
            });
            it('returns the correct index for rows', function () {
                var dataView = tableTwoGroupsThreeMeasures;
                var navigator = createNavigator(dataView);
                var rows = dataView.table.rows;
                var row1 = { index: 0, values: rows[0] };
                var row2 = { index: 1, values: rows[1] };
                expect(navigator.getIndex(row1)).toBe(0);
                expect(navigator.getIndex(row2)).toBe(1);
            });
            it('returns -1 if cannot find column in the collection', function () {
                var dataView = tableTwoGroups;
                var navigator = createNavigator(dataView);
                var columnInAnotherTable = tableThreeGroupsThreeMeasuresInterleaved.table.columns[4];
                expect(navigator.getIndex(columnInAnotherTable)).toBe(-1);
            });
        });
        describe('isLeaf', function () {
            it('returns true for columns', function () {
                var dataView = tableThreeGroupsThreeMeasuresInterleaved;
                var navigator = createNavigator(dataView);
                var columns = dataView.table.columns;
                var column1 = columns[0];
                var column2 = columns[1];
                var column3 = columns[2];
                var column4 = columns[3];
                var column5 = columns[4];
                var column6 = columns[5];
                expect(navigator.isLeaf(column1)).toBeTruthy();
                expect(navigator.isLeaf(column2)).toBeTruthy();
                expect(navigator.isLeaf(column3)).toBeTruthy();
                expect(navigator.isLeaf(column4)).toBeTruthy();
                expect(navigator.isLeaf(column5)).toBeTruthy();
                expect(navigator.isLeaf(column6)).toBeTruthy();
            });
            it('returns true for rows', function () {
                var dataView = tableTwoGroupsThreeMeasures;
                var navigator = createNavigator(dataView);
                var rows = dataView.table.rows;
                var row1 = rows[0];
                var row2 = rows[1];
                var row3 = rows[2];
                var row4 = rows[3];
                var row5 = rows[4];
                var row6 = rows[5];
                var row7 = rows[6];
                expect(navigator.isLeaf(row1)).toBeTruthy();
                expect(navigator.isLeaf(row2)).toBeTruthy();
                expect(navigator.isLeaf(row3)).toBeTruthy();
                expect(navigator.isLeaf(row4)).toBeTruthy();
                expect(navigator.isLeaf(row5)).toBeTruthy();
                expect(navigator.isLeaf(row6)).toBeTruthy();
                expect(navigator.isLeaf(row7)).toBeTruthy();
            });
        });
        describe('getChildren', function () {
            it('returns null for column', function () {
                var dataView = tableTwoGroupsThreeMeasures;
                var navigator = createNavigator(dataView);
                var column = dataView.table.columns[3];
                expect(navigator.getChildren(column)).toBeNull();
            });
            it('returns null for row', function () {
                var dataView = tableThreeGroupsThreeMeasuresInterleaved;
                var navigator = createNavigator(dataView);
                var row = dataView.table.rows[4];
                expect(navigator.getChildren(row)).toBeNull();
            });
        });
        describe('getCount', function () {
            var dataView = tableThreeGroupsThreeMeasuresInterleaved;
            var navigator = createNavigator(dataView);
            it('returns the number of the columns for column dimension', function () {
                expect(navigator.getCount(dataView.table.columns)).toBe(dataView.table.columns.length);
            });
            it('returns the number of the rows for row dimension', function () {
                expect(navigator.getCount(dataView.table.rows)).toBe(dataView.table.rows.length);
            });
        });
        describe('getAt', function () {
            it('returns the correct item from the row dimension', function () {
                var dataView = tableTwoGroupsThreeMeasures;
                var navigator = createNavigator(dataView);
                var rows = dataView.table.rows;
                expect(navigator.getAt(rows, 0)).toBe(rows[0]);
                expect(navigator.getAt(rows, 1)).toBe(rows[1]);
                expect(navigator.getAt(rows, 6)).toBe(rows[6]);
            });
            it('returns the correct item from the column dimension', function () {
                var dataView = tableThreeGroupsThreeMeasuresInterleaved;
                var navigator = createNavigator(dataView);
                var columns = dataView.table.columns;
                expect(navigator.getAt(columns, 0)).toBe(columns[0]);
                expect(navigator.getAt(columns, 1)).toBe(columns[1]);
                expect(navigator.getAt(columns, 5)).toBe(columns[5]);
            });
            it('returns undefined if index is out of bounds in the row dimension', function () {
                var dataView = tableOneMeasure;
                var navigator = createNavigator(dataView);
                var rows = dataView.table.rows;
                expect(navigator.getAt(rows, 1)).not.toBeDefined();
            });
            it('returns undefined if index is out of bounds in the column dimension', function () {
                var dataView = tableOneMeasure;
                var navigator = createNavigator(dataView);
                var columns = dataView.table.columns;
                expect(navigator.getAt(columns, 1)).not.toBeDefined();
            });
        });
        describe('getLevel', function () {
            var dataView = tableThreeGroupsThreeMeasuresInterleaved;
            var navigator = createNavigator(dataView);
            it('returns 0 for column', function () {
                var columns = dataView.table.columns;
                expect(navigator.getLevel(columns[1])).toBe(0);
            });
            it('returns 0 for row', function () {
                var rows = dataView.table.rows;
                expect(navigator.getLevel(rows[5])).toBe(0);
            });
        });
        describe('getIntersection', function () {
            it('returns values in the intersection', function () {
                var dataView = tableThreeGroupsThreeMeasuresInterleaved;
                var visualTable = powerbi.visuals.TableNew.converter(dataView.table);
                var rows = visualTable.visualRows;
                var columns = dataView.table.columns;
                var expectedValues = [
                    ['A', '100.0', 'aa', '101.00', 'aa1', '102'],
                    ['A', '103.0', 'aa', '104.00', 'aa2', '105'],
                    ['A', '106.0', 'ab', '107.00', 'ab1', '108'],
                    ['B', '109.0', 'ba', '110.00', 'ba1', '111'],
                    ['B', '112.0', 'bb', '113.00', 'bb1', '114'],
                    ['B', '115.0', 'bb', '116.00', 'bb2', '117'],
                    ['C', '118.0', 'cc', '119.00', 'cc1', '120']
                ];
                var navigator = new TableHierarchyNavigator(visualTable, valueFormatter.formatRaw);
                validateIntersections(navigator, rows, columns, expectedValues);
            });
            it('returns weburl values', function () {
                var dataView = tableWebUrl;
                var visualTable = powerbi.visuals.TableNew.converter(dataView.table);
                var rows = visualTable.visualRows;
                var columns = dataView.table.columns;
                var navigator = new TableHierarchyNavigator(visualTable, valueFormatter.formatRaw);
                var result = [];
                for (var i = 0, ilen = rows.length; i < ilen; i++) {
                    result[i] = [];
                    for (var j = 0, jlen = columns.length; j < jlen; j++)
                        result[i][j] = navigator.getIntersection(rows[i], columns[j]).showUrl;
                }
                var expectedValues = [
                    [true],
                    [false],
                    [true],
                ];
                expect(result).toEqual(expectedValues);
            });
            function validateIntersections(navigator, rows, columns, expectedValues) {
                var result = [];
                for (var i = 0, ilen = rows.length; i < ilen; i++) {
                    result[i] = [];
                    for (var j = 0, jlen = columns.length; j < jlen; j++)
                        result[i][j] = navigator.getIntersection(rows[i], columns[j]).value;
                }
                expect(result).toEqual(expectedValues);
            }
        });
        describe('getCorner', function () {
            it('always returns null', function () {
                var dataView = tableThreeGroupsThreeMeasuresInterleaved;
                var navigator = createNavigator(dataView);
                expect(navigator.getCorner(0, 0)).toBeNull();
                expect(navigator.getCorner(10, 0)).toBeNull();
                expect(navigator.getCorner(0, 10)).toBeNull();
                expect(navigator.getCorner(10, 10)).toBeNull();
            });
        });
        describe('headerItemEquals', function () {
            it('returns true if the two items are the same', function () {
                var dataView = tableThreeGroupsThreeMeasuresInterleaved;
                var row = dataView.table.rows[0];
                var column = dataView.table.columns[0];
                var navigator = createNavigator(dataView);
                expect(navigator.headerItemEquals(row, row)).toBeTruthy();
                expect(navigator.headerItemEquals(column, column)).toBeTruthy();
            });
            it('returns false if the two items are not same', function () {
                var dataView = tableThreeGroupsThreeMeasuresInterleaved;
                var row = dataView.table.rows[0];
                var column = dataView.table.columns[0];
                var navigator = createNavigator(dataView);
                expect(navigator.headerItemEquals(row, column)).toBeFalsy();
                expect(navigator.headerItemEquals(column, row)).toBeFalsy();
            });
        });
        describe('bodyCellItemEquals', function () {
            it('returns true if the two items are the same', function () {
                var dataView = tableThreeGroupsThreeMeasuresInterleaved;
                var cell1 = dataView.table.rows[0][3];
                var navigator = createNavigator(dataView);
                expect(navigator.bodyCellItemEquals(cell1, cell1)).toBeTruthy();
            });
            it('returns false if the two items are not same', function () {
                var dataView = tableThreeGroupsThreeMeasuresInterleaved;
                var cell1 = dataView.table.rows[1][3];
                var cell2 = dataView.table.rows[2][3];
                var navigator = createNavigator(dataView);
                expect(navigator.bodyCellItemEquals(cell1, cell2)).toBeFalsy();
            });
        });
    });
    describe('Table logic', function () {
        var v, element;
        beforeEach(function () {
            element = powerbitests.helpers.testDom('500', '500');
            v = webPluginService.getPlugin('table').create();
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
        it('loadMoreData calls control refresh', function () {
            var nav = { update: function () {
            } };
            var control = { refresh: function () {
            }, rowDimension: {} };
            var navSpy = spyOn(nav, "update");
            var controlSpy = spyOn(control, "refresh");
            v['hierarchyNavigator'] = nav;
            v['tablixControl'] = control;
            v.onDataChanged({
                dataViews: [tableOneGroup],
                operationKind: 1 /* Append */
            });
            expect(navSpy).toHaveBeenCalled();
            expect(controlSpy).toHaveBeenCalled();
        });
        it('needsMoreData waitingForData', function () {
            v.onDataChanged({
                dataViews: [{
                    metadata: { columns: [groupSource1], segment: {} },
                    table: dataViewTableOneGroup
                }]
            });
            v['waitingForData'] = true;
            var tableVisual = v;
            var lastRow = dataViewTableOneGroup.rows[2];
            var result = tableVisual.needsMoreData(lastRow);
            expect(result).toBe(false);
        });
        it('needsMoreData segmentComplete', function () {
            v.onDataChanged({
                dataViews: [{
                    metadata: { columns: [groupSource1] },
                    table: dataViewTableOneGroup
                }]
            });
            var tableVisual = v;
            var lastRow = dataViewTableOneGroup.rows[2];
            var result = tableVisual.needsMoreData(lastRow);
            expect(result).toBe(false);
        });
        it('needsMoreData belowThreshold', function () {
            var table = dataViewTableTwoGroups;
            v.onDataChanged({
                dataViews: [{
                    metadata: { columns: [groupSource1, groupSource2], segment: {} },
                    table: table
                }]
            });
            var tableVisual = v;
            var lastRow = table.rows[3];
            var result = tableVisual.needsMoreData(lastRow);
            expect(result).toBe(false);
        });
        it('needsMoreData aboveThreshold', function () {
            var table = dataViewTableTwoGroups;
            v.onDataChanged({
                dataViews: [{
                    metadata: { columns: [groupSource1, groupSource2], segment: {} },
                    table: table
                }]
            });
            var tableVisual = v;
            var lastRow = { index: 6, values: table.rows[6] };
            var result = tableVisual.needsMoreData(lastRow);
            expect(result).toBe(true);
        });
        it('bindRowHeader callback', function () {
            var callBackCalled = false;
            var binderOptions = { onBindRowHeader: function (item) {
                callBackCalled = true;
            } };
            var binder = new powerbi.visuals.TableBinder(binderOptions);
            binder.bindRowHeader({ name: null }, {
                type: null,
                item: null,
                colSpan: 0,
                rowSpan: 0,
                textAlign: '',
                extension: { setContainerStyle: function () {
                } }
            });
            expect(callBackCalled).toBe(true);
        });
        it('enumerateObjectInstances general totals on', function () {
            v.onDataChanged({ dataViews: [tableOneMeasureOneGroupSubtotals] });
            var objects = v.enumerateObjectInstances({ objectName: 'general' });
            expect(objects).toEqual([{
                selector: null,
                objectName: 'general',
                properties: {
                    totals: true
                }
            }]);
        });
        it('enumerateObjectInstances general totals off', function () {
            v.onDataChanged({ dataViews: [tableOneMeasureOneGroup] });
            var objects = v.enumerateObjectInstances({ objectName: 'general' });
            expect(objects).toEqual([{
                selector: null,
                objectName: 'general',
                properties: {
                    totals: false
                }
            }]);
        });
        it('enumerateObjectInstances general no objects', function () {
            var dataView = {
                metadata: {
                    columns: [measureSource1, groupSource1]
                },
                table: {
                    columns: [measureSource1, groupSource1],
                    rows: [
                        [1, 'A'],
                        [2, 'B'],
                        [3, 'C']
                    ],
                    totals: [6, null]
                }
            };
            v.onDataChanged({ dataViews: [dataView] });
            var objects = v.enumerateObjectInstances({ objectName: 'general' });
            expect(objects).toEqual([{
                selector: null,
                objectName: 'general',
                properties: {
                    totals: true
                }
            }]);
        });
        it('enumerateObjectInstances some other object', function () {
            v.onDataChanged({ dataViews: [tableOneMeasureOneGroup] });
            var objects = v.enumerateObjectInstances({ objectName: 'some other object' });
            expect(objects).toEqual([]);
        });
    });
    describe('Table DOM validation', function () {
        var v, element, NoMarginClass = 'bi-tablix-cellNoMarginStyle', ColumnHeaderClassName = 'bi-table-column-header', RowClassName = 'bi-table-row', LastRowClassName = 'bi-table-last-row', FooterClassName = 'bi-table-footer', NumericCellClassName = ' bi-table-cell-numeric', EmptyHeaderCell = '\xa0';
        beforeEach(function () {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
            groupSource1.index = 0;
            groupSource2.index = 1;
            groupSource3.index = 2;
            measureSource1.index = 3;
            measureSource2.index = 4;
            measureSource3.index = 5;
        });
        beforeEach(function () {
            element = powerbitests.helpers.testDom('500', '500');
            v = webPluginService.getPlugin('table').create();
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
        function validateTable(expectedValues) {
            var rows = $('.bi-tablix tr');
            var result = [];
            for (var i = 0, ilen = rows.length; i < ilen; i++) {
                result[i] = [];
                var cells = rows.eq(i).find('td');
                for (var j = 0, jlen = cells.length; j < jlen; j++) {
                    result[i][j] = cells.eq(j).text();
                    expect(cells.eq(j).height() > 1);
                }
            }
            expect(result).toEqual(expectedValues);
        }
        function validateChildTag(expectedChildTag) {
            var rows = $('.bi-tablix tr');
            var result = [];
            for (var i = 0, ilen = rows.length; i < ilen; i++) {
                result[i] = [];
                var cells = rows.eq(i).find('td');
                for (var j = 0, jlen = cells.length; j < jlen; j++) {
                    var childTag = expectedChildTag[i][j];
                    if (childTag) {
                        var child = cells.eq(j).find(childTag);
                        if (child.length > 0)
                            result[i][j] = childTag;
                        else
                            result[i][j] = undefined;
                    }
                    else
                        result[i][j] = undefined;
                }
            }
            expect(result).toEqual(expectedChildTag);
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
        it('1x2 table (one measure)', function (done) {
            var dataView = tableOneMeasure;
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(function () {
                var cellValue = formatter(dataView.table.rows[0][0], measureSource1);
                var expectedCells = [
                    ['', measureSource1.name, ''],
                    ['', cellValue]
                ];
                validateTable(expectedCells);
                var expectedClassNames = [
                    ['', ColumnHeaderClassName, ''],
                    ['', LastRowClassName + NumericCellClassName]
                ];
                validateClassNames(expectedClassNames);
                done();
            }, DefaultWaitForRender);
        });
        it('1x2 table (one group null)', function (done) {
            var dataView = tableOneGroupNulls;
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(function () {
                var expectedCells = [
                    ['', groupSource1.name, ''],
                    [EmptyHeaderCell, ''],
                    [EmptyHeaderCell, '']
                ];
                validateTable(expectedCells);
                done();
            }, DefaultWaitForRender);
        });
        it('3x5 table (2 groups 1 measure nulls)', function (done) {
            var dataView = tableTwoGroups1MeasureNulls;
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(function () {
                var expectedCells = [
                    ['', groupSource1.name, groupSource2.name, measureSource1.name, ''],
                    ['', 'A', 'a1', '100.0'],
                    ['', '', '', '103.0'],
                    ['', '', 'a3', '106.0'],
                    ['', 'B', '', '112.0'],
                    [EmptyHeaderCell, '', '', '']
                ];
                validateTable(expectedCells);
                done();
            }, DefaultWaitForRender);
        });
        it('1x3 table (group instances)', function (done) {
            var dataView = tableOneGroup;
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(function () {
                var cellValue1 = formatter(dataView.table.rows[0][0], groupSource1);
                var cellValue2 = formatter(dataView.table.rows[1][0], groupSource1);
                var cellValue3 = formatter(dataView.table.rows[2][0], groupSource1);
                var expectedCells = [
                    ['', groupSource1.name, ''],
                    ['', cellValue1],
                    ['', cellValue2],
                    ['', cellValue3]
                ];
                validateTable(expectedCells);
                var expectedClassNames = [
                    ['', ColumnHeaderClassName, ''],
                    ['', RowClassName],
                    ['', RowClassName],
                    ['', LastRowClassName]
                ];
                validateClassNames(expectedClassNames);
                done();
            }, DefaultWaitForRender);
        });
        it('2x8 table (group instances)', function (done) {
            var dataView = tableTwoGroups;
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(function () {
                var cellValue1 = formatter(dataView.table.rows[0][0], groupSource1);
                var cellValue2 = formatter(dataView.table.rows[1][0], groupSource1);
                var cellValue3 = formatter(dataView.table.rows[2][0], groupSource1);
                var cellValue4 = formatter(dataView.table.rows[3][0], groupSource1);
                var cellValue5 = formatter(dataView.table.rows[4][0], groupSource1);
                var cellValue6 = formatter(dataView.table.rows[5][0], groupSource1);
                var cellValue7 = formatter(dataView.table.rows[6][0], groupSource1);
                var cellValue8 = formatter(dataView.table.rows[0][1], groupSource2);
                var cellValue9 = formatter(dataView.table.rows[1][1], groupSource2);
                var cellValue10 = formatter(dataView.table.rows[2][1], groupSource2);
                var cellValue11 = formatter(dataView.table.rows[3][1], groupSource2);
                var cellValue12 = formatter(dataView.table.rows[4][1], groupSource2);
                var cellValue13 = formatter(dataView.table.rows[5][1], groupSource2);
                var cellValue14 = formatter(dataView.table.rows[6][1], groupSource2);
                var expectedCells = [
                    ['', groupSource1.name, groupSource2.name, ''],
                    ['', cellValue1, cellValue8],
                    ['', cellValue2, cellValue9],
                    ['', cellValue3, cellValue10],
                    ['', cellValue4, cellValue11],
                    ['', cellValue5, cellValue12],
                    ['', cellValue6, cellValue13],
                    ['', cellValue7, cellValue14]
                ];
                validateTable(expectedCells);
                done();
            }, DefaultWaitForRender);
        });
        it('5x9 table (group instances and measure values) with totals', function (done) {
            var dataView = tableTwoGroupsThreeMeasures;
            measureSource1.index = 2;
            measureSource2.index = 3;
            measureSource3.index = 4;
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(function () {
                var cellValue1 = formatter(dataView.table.rows[0][2], measureSource1);
                var cellValue2 = formatter(dataView.table.rows[1][2], measureSource1);
                var cellValue3 = formatter(dataView.table.rows[2][2], measureSource1);
                var cellValue4 = formatter(dataView.table.rows[3][2], measureSource1);
                var cellValue5 = formatter(dataView.table.rows[4][2], measureSource1);
                var cellValue6 = formatter(dataView.table.rows[5][2], measureSource1);
                var cellValue7 = formatter(dataView.table.rows[6][2], measureSource1);
                var cellValue8 = formatter(dataView.table.rows[0][3], measureSource2);
                var cellValue9 = formatter(dataView.table.rows[1][3], measureSource2);
                var cellValue10 = formatter(dataView.table.rows[2][3], measureSource2);
                var cellValue11 = formatter(dataView.table.rows[3][3], measureSource2);
                var cellValue12 = formatter(dataView.table.rows[4][3], measureSource2);
                var cellValue13 = formatter(dataView.table.rows[5][3], measureSource2);
                var cellValue14 = formatter(dataView.table.rows[6][3], measureSource2);
                var cellValue15 = formatter(dataView.table.rows[0][4], measureSource3);
                var cellValue16 = formatter(dataView.table.rows[1][4], measureSource3);
                var cellValue17 = formatter(dataView.table.rows[2][4], measureSource3);
                var cellValue18 = formatter(dataView.table.rows[3][4], measureSource3);
                var cellValue19 = formatter(dataView.table.rows[4][4], measureSource3);
                var cellValue20 = formatter(dataView.table.rows[5][4], measureSource3);
                var cellValue21 = formatter(dataView.table.rows[6][4], measureSource3);
                var total1 = formatter(dataView.table.totals[2], measureSource1);
                var total2 = formatter(dataView.table.totals[3], measureSource2);
                var total3 = formatter(dataView.table.totals[4], measureSource3);
                var expectedCells = [
                    ['', groupSource1.name, groupSource2.name, measureSource1.name, measureSource2.name, measureSource3.name, ''],
                    ['', dataView.table.rows[0][0], dataView.table.rows[0][1], cellValue1, cellValue8, cellValue15],
                    ['', dataView.table.rows[1][0], dataView.table.rows[1][1], cellValue2, cellValue9, cellValue16],
                    ['', dataView.table.rows[2][0], dataView.table.rows[2][1], cellValue3, cellValue10, cellValue17],
                    ['', dataView.table.rows[3][0], dataView.table.rows[3][1], cellValue4, cellValue11, cellValue18],
                    ['', dataView.table.rows[4][0], dataView.table.rows[4][1], cellValue5, cellValue12, cellValue19],
                    ['', dataView.table.rows[5][0], dataView.table.rows[5][1], cellValue6, cellValue13, cellValue20],
                    ['', dataView.table.rows[6][0], dataView.table.rows[6][1], cellValue7, cellValue14, cellValue21],
                    ['', 'TableTotalLabel', '', total1, total2, total3, '']
                ];
                validateTable(expectedCells);
                var expectedClassNames = [
                    ['', ColumnHeaderClassName, ColumnHeaderClassName, ColumnHeaderClassName, ColumnHeaderClassName, ColumnHeaderClassName, ''],
                    ['', RowClassName, RowClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName],
                    ['', RowClassName, RowClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName],
                    ['', RowClassName, RowClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName],
                    ['', RowClassName, RowClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName],
                    ['', RowClassName, RowClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName],
                    ['', RowClassName, RowClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName, RowClassName + NumericCellClassName],
                    ['', LastRowClassName, LastRowClassName, LastRowClassName + NumericCellClassName, LastRowClassName + NumericCellClassName, LastRowClassName + NumericCellClassName],
                    ['', FooterClassName, FooterClassName, FooterClassName + NumericCellClassName, FooterClassName + NumericCellClassName, FooterClassName + NumericCellClassName, '']
                ];
                validateClassNames(expectedClassNames);
                done();
            }, DefaultWaitForRender);
        });
        it('2x5 table (group instances and measure values) with totals, total value comes first', function (done) {
            var dataView = tableOneMeasureOneGroupSubtotals;
            measureSource1.index = 0;
            groupSource1.index = 1;
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(function () {
                var cellValue1 = formatter(dataView.table.rows[0][0], measureSource1);
                var cellValue2 = formatter(dataView.table.rows[1][0], measureSource1);
                var cellValue3 = formatter(dataView.table.rows[2][0], measureSource1);
                var total = formatter(dataView.table.totals[0], measureSource1);
                var expectedCells = [
                    ['', measureSource1.name, groupSource1.name, ''],
                    ['', cellValue1, dataView.table.rows[0][1]],
                    ['', cellValue2, dataView.table.rows[1][1]],
                    ['', cellValue3, dataView.table.rows[2][1]],
                    ['', total, '', '']
                ];
                validateTable(expectedCells);
                var expectedClassNames = [
                    ['', ColumnHeaderClassName, ColumnHeaderClassName, ''],
                    ['', RowClassName + NumericCellClassName, RowClassName],
                    ['', RowClassName + NumericCellClassName, RowClassName],
                    ['', LastRowClassName + NumericCellClassName, LastRowClassName],
                    ['', FooterClassName + NumericCellClassName, FooterClassName, '']
                ];
                validateClassNames(expectedClassNames);
                done();
            }, DefaultWaitForRender);
        });
        it('2x5 table (group instances and measure values) totals on then off', function (done) {
            var dataView = tableOneMeasureOneGroupSubtotals;
            measureSource1.index = 0;
            groupSource1.index = 1;
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(function () {
                var cellValue1 = formatter(dataView.table.rows[0][0], measureSource1);
                var cellValue2 = formatter(dataView.table.rows[1][0], measureSource1);
                var cellValue3 = formatter(dataView.table.rows[2][0], measureSource1);
                var total = formatter(dataView.table.totals[0], measureSource1);
                var expectedCells = [
                    ['', measureSource1.name, groupSource1.name, ''],
                    ['', cellValue1, dataView.table.rows[0][1]],
                    ['', cellValue2, dataView.table.rows[1][1]],
                    ['', cellValue3, dataView.table.rows[2][1]],
                    ['', total, '', '']
                ];
                validateTable(expectedCells);
                // Now update with totals off
                var dataViewNoTotal = tableOneMeasureOneGroup;
                v.onDataChanged({ dataViews: [dataViewNoTotal] });
                setTimeout(function () {
                    var expectedCellsNoTotal = [
                        ['', measureSource1.name, groupSource1.name, ''],
                        ['', cellValue1, dataViewNoTotal.table.rows[0][1]],
                        ['', cellValue2, dataViewNoTotal.table.rows[1][1]],
                        ['', cellValue3, dataViewNoTotal.table.rows[2][1]]
                    ];
                    validateTable(expectedCellsNoTotal);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });
        it('1x3 table (group instances with WebUrl)', function (done) {
            var dataView = tableWebUrl;
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(function () {
                var cellValue1 = formatter(dataView.table.rows[0][0], groupSourceWebUrl);
                var cellValue2 = formatter(dataView.table.rows[1][0], groupSourceWebUrl);
                var cellValue3 = formatter(dataView.table.rows[2][0], groupSourceWebUrl);
                var expectedCells = [
                    ['', groupSourceWebUrl.name, ''],
                    ['', cellValue1],
                    ['', cellValue2],
                    ['', cellValue3]
                ];
                validateTable(expectedCells);
                var expectedClassNames = [
                    ['', ColumnHeaderClassName, ''],
                    ['', RowClassName],
                    ['', RowClassName],
                    ['', LastRowClassName]
                ];
                validateClassNames(expectedClassNames);
                var expectedChildTags = [
                    [, , ,],
                    [, 'A'],
                    [, ,],
                    [, 'A']
                ];
                validateChildTag(expectedChildTags);
                done();
            }, DefaultWaitForRender);
        });
        it('1x1 table loadMoreData', function (done) {
            var dataView = {
                metadata: { columns: [groupSource1], segment: {} },
                table: {
                    columns: [groupSource1],
                    rows: [
                        ['A'],
                        ['B'],
                        ['C']
                    ]
                }
            };
            v.onDataChanged({
                dataViews: [dataView]
            });
            var segment2 = {
                metadata: { columns: [groupSource1] },
                table: {
                    columns: [groupSource1],
                    rows: [
                        ['D'],
                        ['E']
                    ]
                }
            };
            // Simulate a load more merge
            powerbi.data.segmentation.DataViewMerger.mergeTables(dataView.table, segment2.table);
            v.onDataChanged({
                dataViews: [dataView],
                operationKind: 1 /* Append */
            });
            setTimeout(function () {
                var cellValue1 = formatter(dataView.table.rows[0][0], groupSource1);
                var cellValue2 = formatter(dataView.table.rows[1][0], groupSource1);
                var cellValue3 = formatter(dataView.table.rows[2][0], groupSource1);
                var cellValue4 = formatter(dataView.table.rows[3][0], groupSource1);
                var cellValue5 = formatter(dataView.table.rows[4][0], groupSource1);
                var expectedCells = [
                    ['', groupSource1.name, ''],
                    ['', cellValue1],
                    ['', cellValue2],
                    ['', cellValue3],
                    ['', cellValue4],
                    ['', cellValue5]
                ];
                validateTable(expectedCells);
                done();
            }, DefaultWaitForRender);
        });
        it('2x5 table reorder loadMoreData', function (done) {
            var dataView = {
                metadata: { columns: [groupSource1, groupSource2], segment: {} },
                table: {
                    columns: [groupSource1, groupSource2],
                    rows: [
                        ['A', '1'],
                        ['B', '2'],
                        ['C', '3']
                    ]
                }
            };
            v.onDataChanged({
                dataViews: [dataView]
            });
            // Simulate column reordering
            var transformedDataView = applyTransform(dataView);
            v.onDataChanged({ dataViews: [transformedDataView] });
            var segment2 = {
                metadata: { columns: [groupSource1] },
                table: {
                    columns: [groupSource1],
                    rows: [
                        ['D', '4'],
                        ['E', '5']
                    ]
                }
            };
            // Simulate a load more merge
            powerbi.data.segmentation.DataViewMerger.mergeTables(dataView.table, segment2.table);
            var transformedDataView = applyTransform(dataView);
            v.onDataChanged({
                dataViews: [transformedDataView],
                operationKind: 1 /* Append */
            });
            setTimeout(function () {
                var expectedCells = [
                    ['', groupSource2.name, groupSource1.name, ''],
                    ['', '1', 'A'],
                    ['', '2', 'B'],
                    ['', '3', 'C'],
                    ['', '4', 'D'],
                    ['', '5', 'E']
                ];
                validateTable(expectedCells);
                done();
            }, DefaultWaitForRender);
        });
        function applyTransform(dataView) {
            var transforms = {
                selects: [
                    {
                        displayName: groupSource1.name,
                        type: powerbi.ValueType.fromDescriptor({ text: true }),
                    },
                    {
                        displayName: groupSource2.name,
                        type: powerbi.ValueType.fromDescriptor({ text: true }),
                    }
                ],
                projectionOrdering: {
                    Values: [1, 0]
                }
            };
            var transformedDataView = powerbi.data.DataViewTransform.apply({
                prototype: dataView,
                objectDescriptors: null,
                transforms: transforms,
                dataViewMappings: powerbi.visuals.TableNew.capabilities.dataViewMappings,
                colorAllocatorFactory: powerbi.visuals.createColorAllocatorFactory()
            })[0];
            return transformedDataView;
        }
        function formatter(value, source) {
            return valueFormatter.formatRaw(value, valueFormatter.getFormatString(source, Table.formatStringProp, false));
        }
    });
    describe("Table sort validation", function () {
        var element;
        beforeEach(function (done) {
            powerbitests.helpers.suppressDebugAssertFailure();
            element = powerbitests.helpers.testDom('800', '800');
            done();
        });
        it('table with single measure', function (done) {
            // Clicking on the measure will result in a sort event
            var data = tableOneMeasure;
            var expectedColumnHeaders = [{ row: 0, col: 1, expectedText: "measure1" }];
            var clicks = [{ row: 0, col: 1 }, { row: 1, col: 1 }];
            var expectedSorts = [
                [{ queryName: "measure1" }]
            ];
            powerbitests.tablixHelper.runTablixSortTest(element, done, 'table', data, expectedColumnHeaders, clicks, expectedSorts);
        });
        it('table with single group', function (done) {
            // Clicking on the group header multiple times will result in multiple sort events.
            // Clicking on non-header cells will not result in sort events.
            var data = tableOneGroup;
            var expectedColumnHeaders = [{ row: 0, col: 1, expectedText: "group1" }];
            var clicks = [{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 1 }, { row: 0, col: 1 }];
            var expectedSorts = [
                [{ queryName: "group1" }],
                [{ queryName: "group1" }]
            ];
            powerbitests.tablixHelper.runTablixSortTest(element, done, 'table', data, expectedColumnHeaders, clicks, expectedSorts);
        });
        it('table with two groups', function (done) {
            // Clicking on different group headers multiple times results in a sort event for each click
            var data = tableTwoGroups;
            var expectedColumnHeaders = [{ row: 0, col: 1, expectedText: "group1" }, { row: 0, col: 2, expectedText: "group2" }];
            var clicks = [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 1 }, { row: 0, col: 2 }];
            var expectedSorts = [
                [{ queryName: "group1" }],
                [{ queryName: "group2" }],
                [{ queryName: "group1" }],
                [{ queryName: "group2" }]
            ];
            powerbitests.tablixHelper.runTablixSortTest(element, done, 'table', data, expectedColumnHeaders, clicks, expectedSorts);
        });
        it('table with two groups and three measures', function (done) {
            // Clicking on different group headers multiple times results in a sort event for each click
            var data = tableTwoGroupsThreeMeasures;
            var expectedColumnHeaders = [{ row: 0, col: 1, expectedText: "group1" }, { row: 0, col: 2, expectedText: "group2" }, { row: 0, col: 3, expectedText: "measure1" }, { row: 0, col: 4, expectedText: "measure2" }, { row: 0, col: 5, expectedText: "measure3" }];
            var clicks = [{ row: 0, col: 5 }, { row: 0, col: 2 }, { row: 0, col: 4 }, { row: 0, col: 1 }, { row: 0, col: 3 }, { row: 0, col: 1 }, { row: 0, col: 5 }];
            var expectedSorts = [
                [{ queryName: "measure3" }],
                [{ queryName: "group2" }],
                [{ queryName: "measure2" }],
                [{ queryName: "group1" }],
                [{ queryName: "measure1" }],
                [{ queryName: "group1" }],
                [{ queryName: "measure3" }]
            ];
            powerbitests.tablixHelper.runTablixSortTest(element, done, 'table', data, expectedColumnHeaders, clicks, expectedSorts);
        });
    });
})(powerbitests || (powerbitests = {}));
