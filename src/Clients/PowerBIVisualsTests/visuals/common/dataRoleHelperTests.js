//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbitests;
(function (powerbitests) {
    var DataRoleHelper = powerbi.visuals.DataRoleHelper;
    var DataViewTransform = powerbi.data.DataViewTransform;
    describe("dataRoleHelper tests", function () {
        it('getMeasureIndexOfRole with roles validation', function () {
            var dataViewMetadata = {
                columns: [
                    { name: 'col1' },
                    { name: 'col2', isMeasure: true, roles: { "Size": true } },
                    { name: 'col3', isMeasure: true, roles: { "X": true } },
                    { name: 'col4', isMeasure: true, roles: { "Y": true } }
                ]
            };
            var dataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['Montana', 'California', 'Arizona']
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [-100, 200, 700],
                        subtotal: 800
                    }, {
                        source: dataViewMetadata.columns[2],
                        values: [1, 2, 3],
                        subtotal: 6
                    }, {
                        source: dataViewMetadata.columns[3],
                        values: [4, 5, 6],
                        subtotal: 15
                    }])
                }
            };
            var grouped = dataView.categorical.values.grouped();
            var result = DataRoleHelper.getMeasureIndexOfRole(grouped, "InvalidRoleName");
            expect(result).toBe(-1);
            result = powerbi.visuals.DataRoleHelper.getMeasureIndexOfRole(grouped, "Size");
            expect(result).toBe(0);
            result = powerbi.visuals.DataRoleHelper.getMeasureIndexOfRole(grouped, "X");
            expect(result).toBe(1);
            result = powerbi.visuals.DataRoleHelper.getMeasureIndexOfRole(grouped, "Y");
            expect(result).toBe(2);
        });
        it('getMeasureIndexOfRole without roles validation', function () {
            var dataViewMetadata = {
                columns: [
                    { name: 'col1' },
                    { name: 'col2', isMeasure: true },
                    { name: 'col3', isMeasure: true },
                    { name: 'col4', isMeasure: true }
                ]
            };
            var dataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['Montana', 'California', 'Arizona']
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [-100, 200, 700],
                        subtotal: 800
                    }, {
                        source: dataViewMetadata.columns[2],
                        values: [1, 2, 3],
                        subtotal: 6
                    }, {
                        source: dataViewMetadata.columns[3],
                        values: [4, 5, 6],
                        subtotal: 15
                    }])
                }
            };
            var grouped = dataView.categorical.values.grouped();
            var result = DataRoleHelper.getMeasureIndexOfRole(grouped, "InvalidRoleName");
            expect(result).toBe(-1);
            result = powerbi.visuals.DataRoleHelper.getMeasureIndexOfRole(grouped, "Size");
            expect(result).toBe(-1);
            result = powerbi.visuals.DataRoleHelper.getMeasureIndexOfRole(grouped, "X");
            expect(result).toBe(-1);
            result = powerbi.visuals.DataRoleHelper.getMeasureIndexOfRole(grouped, "Y");
            expect(result).toBe(-1);
        });
        it('getMeasureIndexOfRole without roles validation with default', function () {
            var dataViewMetadata = {
                columns: [
                    { name: 'col1' },
                    { name: 'col2', isMeasure: true },
                    { name: 'col3', isMeasure: true },
                    { name: 'col4', isMeasure: true }
                ]
            };
            var dataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['Montana', 'California', 'Arizona']
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [-100, 200, 700],
                        subtotal: 800
                    }, {
                        source: dataViewMetadata.columns[2],
                        values: [1, 2, 3],
                        subtotal: 6
                    }, {
                        source: dataViewMetadata.columns[3],
                        values: [4, 5, 6],
                        subtotal: 15
                    }])
                }
            };
            var grouped = dataView.categorical.values.grouped();
            var result = powerbi.visuals.DataRoleHelper.getMeasureIndexOfRole(grouped, "Size", 0);
            expect(result).toBe(0);
        });
        it('getMeasureIndexOfRole without roles validation with default too few measures', function () {
            var dataViewMetadata = {
                columns: [
                    { name: 'col1' },
                    { name: 'col2', isMeasure: true },
                ]
            };
            var dataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['Montana', 'California', 'Arizona']
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [-100, 200, 700],
                        subtotal: 800
                    }])
                }
            };
            var grouped = dataView.categorical.values.grouped();
            var result = powerbi.visuals.DataRoleHelper.getMeasureIndexOfRole(grouped, "2nd measure", 1);
            expect(result).toBe(-1);
        });
    });
})(powerbitests || (powerbitests = {}));
