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

module powerbitests.tableDataViewHelper {
    import TableDataViewObjects = powerbi.visuals.TableDataViewObjects;
    import ValueType = powerbi.ValueType;

    export enum ColumnType {
        Text,
        Numeric,
        NumericMeasure,
    }

    /** Create a table which contains @columnCount number of columns */
    export function getDataWithColumns(columnCount: number, numRows: number = 1, objects?: TableDataViewObjects): powerbi.DataView {
        // Generate alternating column types
        var columnTypes: ColumnType[] = [];
        for (var i = 0; i < columnCount; ++i) {
            columnTypes.push(i % 2 === 0 ? ColumnType.Numeric : ColumnType.Text);
        }

        return tableDataViewHelper.getDataWithColumnsOfType(columnTypes, false, numRows, objects);
    }

    /** Create a table which contains columns with the specified types */
    export function getDataWithColumnsOfType(columnTypes: ColumnType[], hasSubtotals: boolean, numRows: number = 1, objects?: TableDataViewObjects): powerbi.DataView {
        var columns: powerbi.DataViewMetadataColumn[] = [], rows: any[] = [], totals: any[] = [];

        for (var i = 0, len = columnTypes.length; i < len; ++i) {
            var isMeasure = columnTypes[i] === ColumnType.NumericMeasure;
            if (columnTypes[i] === ColumnType.Numeric || isMeasure) {
                columns.push({ displayName: 'numeric' + i, type: ValueType.fromDescriptor({ numeric: true }), isMeasure: isMeasure });
                rows.push(i);

                if (hasSubtotals)
                    totals.push(isMeasure ? i : null);
            }
            else {
                columns.push({ displayName: 'text' + i, type: ValueType.fromDescriptor({ numeric: false }) });
                rows.push('cell text ' + i);

                if (hasSubtotals)
                    totals.push(null);
            }
        }

        var dataViewMetadata: powerbi.DataViewMetadata = {
            columns: columns,
            objects: objects,
        };

        var rowsArray: any[] = [];
        for (var i = 0; i < numRows; i++)
            rowsArray.push(rows);

        var data: powerbi.DataView = {
            metadata: dataViewMetadata,
            table: {
                rows: rowsArray,
                columns: dataViewMetadata.columns
            },
        };

        if (totals.length > 0)
            data.table.totals = totals;

        return data;
    }

    export function dataViewObjectsTotals(totalsEnabled: boolean): powerbi.visuals.TableDataViewObjects {
        return {
            general: {
                totals: totalsEnabled,
            }
        };
    }
}