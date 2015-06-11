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

module powerbitests {
    var DataRoleHelper = powerbi.visuals.DataRoleHelper;
    import DataViewTransform = powerbi.data.DataViewTransform;

    describe("dataRoleHelper tests",() => {
        it('getMeasureIndexOfRole with roles validation',() => {
            var dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'col1' },
                    { displayName: 'col2', isMeasure: true, roles: { "Size": true } },
                    { displayName: 'col3', isMeasure: true, roles: { "X": true } },
                    { displayName: 'col4', isMeasure: true, roles: { "Y": true } }
                ]
            };
            var dataView: powerbi.DataView = {
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

        it('getMeasureIndexOfRole without roles validation',() => {
            var dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'col1' },
                    { displayName: 'col2', isMeasure: true },
                    { displayName: 'col3', isMeasure: true },
                    { displayName: 'col4', isMeasure: true }
                ]
            };
            var dataView: powerbi.DataView = {
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

        it('getMeasureIndexOfRole without roles validation with default',() => {
            var dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'col1' },
                    { displayName: 'col2', isMeasure: true },
                    { displayName: 'col3', isMeasure: true },
                    { displayName: 'col4', isMeasure: true }
                ]
            };
            var dataView: powerbi.DataView = {
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

        it('getMeasureIndexOfRole without roles validation with default too few measures',() => {
            var dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'col1' },
                    { displayName: 'col2', isMeasure: true },
                ]
            };
            var dataView: powerbi.DataView = {
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

        it('hasRoleInDataView',() => {
            var dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'col1', roles: { 'Series': true } },
                    { displayName: 'col2', isMeasure: true, roles: { "Size": true } },
                ]
            };
            var dataView: powerbi.DataView = {
                metadata: dataViewMetadata
            };
            expect(DataRoleHelper.hasRoleInDataView(dataView, 'Series')).toBe(true);
            expect(DataRoleHelper.hasRoleInDataView(dataView, 'Category')).toBe(false);
        });
    });
}