//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

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
                : source.displayName;
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

            if (categoryAxisProperties && categoryAxisProperties["showAxisTitle"]) {

                // Take the value only if it's there
                if (category && category.displayName) {
                    xAxisLabel = category.displayName;
                }
            }

            if (valueAxisProperties && valueAxisProperties["showAxisTitle"]) {
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
