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

    export module DataRoleHelper {
        export function getMeasureIndexOfRole(grouped: DataViewValueColumnGroup[], roleName: string, defaultIndexIfNoRole?: number): number {
            if (grouped && grouped.length > 0) {
                var firstGroup = grouped[0];
                if (firstGroup.values && firstGroup.values.length > 0) {
                    for (var i = 0, len = firstGroup.values.length; i < len; ++i) {
                        var value = firstGroup.values[i];
                        if (value && value.source) {
                            if (hasRole(value.source, roleName))
                                return i;

                            if (len > defaultIndexIfNoRole)
                                return defaultIndexIfNoRole;
                        }
                    }
                }
            }
            return -1;
        }

        export function hasRole(column: DataViewMetadataColumn, name: string): boolean {
            var roles = column.roles;
            return roles && roles[name];
        }

        export function hasRoleInDataView(dataView: DataView, name: string): boolean {
            return dataView != null
                && dataView.metadata != null
                && dataView.metadata.columns
                && _.any(dataView.metadata.columns, c => c.roles && c.roles[name] !== undefined);
        }
    }
}
