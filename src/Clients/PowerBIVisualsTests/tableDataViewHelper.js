//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbitests;
(function (powerbitests) {
    var tableDataViewHelper;
    (function (tableDataViewHelper) {
        var ValueType = powerbi.ValueType;
        (function (ColumnType) {
            ColumnType[ColumnType["Text"] = 0] = "Text";
            ColumnType[ColumnType["Numeric"] = 1] = "Numeric";
            ColumnType[ColumnType["NumericMeasure"] = 2] = "NumericMeasure";
        })(tableDataViewHelper.ColumnType || (tableDataViewHelper.ColumnType = {}));
        var ColumnType = tableDataViewHelper.ColumnType;
        /** Create a table which contains @columnCount number of columns */
        function getDataWithColumns(columnCount, numRows, objects) {
            if (numRows === void 0) { numRows = 1; }
            // Generate alternating column types
            var columnTypes = [];
            for (var i = 0; i < columnCount; ++i) {
                columnTypes.push(i % 2 === 0 ? 1 /* Numeric */ : 0 /* Text */);
            }
            return tableDataViewHelper.getDataWithColumnsOfType(columnTypes, false, numRows, objects);
        }
        tableDataViewHelper.getDataWithColumns = getDataWithColumns;
        /** Create a table which contains columns with the specified types */
        function getDataWithColumnsOfType(columnTypes, hasSubtotals, numRows, objects) {
            if (numRows === void 0) { numRows = 1; }
            var columns = [], rows = [], totals = [];
            for (var i = 0, len = columnTypes.length; i < len; ++i) {
                var isMeasure = columnTypes[i] === 2 /* NumericMeasure */;
                if (columnTypes[i] === 1 /* Numeric */ || isMeasure) {
                    columns.push({ name: 'numeric' + i, type: ValueType.fromDescriptor({ numeric: true }), isMeasure: isMeasure });
                    rows.push(i);
                    if (hasSubtotals)
                        totals.push(isMeasure ? i : null);
                }
                else {
                    columns.push({ name: 'text' + i, type: ValueType.fromDescriptor({ numeric: false }) });
                    rows.push('cell text ' + i);
                    if (hasSubtotals)
                        totals.push(null);
                }
            }
            var dataViewMetadata = {
                columns: columns,
                objects: objects,
            };
            var rowsArray = [];
            for (var i = 0; i < numRows; i++)
                rowsArray.push(rows);
            var data = {
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
        tableDataViewHelper.getDataWithColumnsOfType = getDataWithColumnsOfType;
        function dataViewObjectsTotals(totalsEnabled) {
            return {
                general: {
                    totals: totalsEnabled,
                }
            };
        }
        tableDataViewHelper.dataViewObjectsTotals = dataViewObjectsTotals;
    })(tableDataViewHelper = powerbitests.tableDataViewHelper || (powerbitests.tableDataViewHelper = {}));
})(powerbitests || (powerbitests = {}));
