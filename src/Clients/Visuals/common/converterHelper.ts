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
    export interface PivotedCategoryInfo {
        categories?: any[];
        categoryFormatter?: IValueFormatter;
        categoryIdentities?: DataViewScopeIdentity[];
        categoryObjects?: DataViewObjects[];
    }

    export module converterHelper {
        export function categoryIsAlsoSeriesRole(dataView: DataViewCategorical, seriesRoleName: string, categoryRoleName: string): boolean {
            if (dataView.categories && dataView.categories.length > 0) {
                // Need to pivot data if our category soure is a series role
                var category = dataView.categories[0];
                return category.source &&
                    DataRoleHelper.hasRole(category.source, seriesRoleName) &&
                    DataRoleHelper.hasRole(category.source, categoryRoleName);
            }

            return false;
        }

        export function getPivotedCategories(dataView: DataViewCategorical, formatStringProp: DataViewObjectPropertyIdentifier): PivotedCategoryInfo {
            if (dataView.categories && dataView.categories.length > 0) {
                var category = dataView.categories[0];
                var categoryValues = category.values;

                return category.values.length > 0
                    ? {
                        categories: categoryValues,
                        categoryFormatter: valueFormatter.create({
                            format: valueFormatter.getFormatString(category.source, formatStringProp),
                            value: categoryValues[0],
                            value2: categoryValues[categoryValues.length - 1],
                            // Do not use display units such as K/M/bn etc. on the x-axis.
                            // PowerView does not use units either as large ranges will make the x-axis indecipherable.
                            displayUnitSystemType: DisplayUnitSystemType.Verbose,
                        }),
                        categoryIdentities: category.identity,
                        categoryObjects: category.objects,
                    }
                    : {
                        categories: [],
                        categoryFormatter: { format: valueFormatter.format },
                    };
            }

            // For cases where the category source is just a series role, we are pivoting the data on the role which means we
            // will have no categories.
            return defaultCategories();
        }

        export function getSeriesName(source: DataViewMetadataColumn): string {
            debug.assertValue(source, 'source');

            return (source.groupName !== undefined)
                ? source.groupName
                : source.queryName;
        }

        export function getFormattedLegendLabel(source: DataViewMetadataColumn, values: DataViewValueColumns, formatStringProp: DataViewObjectPropertyIdentifier): string {
            debug.assertValue(source, 'source');
            debug.assertValue(values, 'values');

            var sourceForFormat = source;
            var nameForFormat = source.displayName;
            if (source.groupName !== undefined) {
                sourceForFormat = values.source;
                nameForFormat = source.groupName;
            }

            return valueFormatter.format(nameForFormat, valueFormatter.getFormatString(sourceForFormat, formatStringProp));
        }

        function defaultCategories(): PivotedCategoryInfo {
            return {
                categories: [null],
                categoryFormatter: { format: valueFormatter.format },
            };
        }

        export function createAxesLabels(categoryAxisProperties: DataViewObject,
            valueAxisProperties: DataViewObject,
            category: DataViewMetadataColumn,
            values: DataViewMetadataColumn[]) {
            var xAxisLabel = null;
            var yAxisLabel = null;

            if (categoryAxisProperties) {

                // Take the value only if it's there
                if (category && category.displayName) {
                    xAxisLabel = category.displayName;
                }
            }

            if (valueAxisProperties) {
                var valuesNames: string[] = [];
                
                if (values) {
                    // Take the name from the values, and make it unique because there are sometimes duplications
                    valuesNames = values.map(v => v ? v.displayName : '').filter((value, index, self) => value !== '' && self.indexOf(value) === index);
                    yAxisLabel = valueFormatter.formatListAnd(valuesNames);
                }
            }
            return { xAxisLabel: xAxisLabel, yAxisLabel: yAxisLabel };
        }

      
    }
}
