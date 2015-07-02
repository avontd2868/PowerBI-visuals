//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
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