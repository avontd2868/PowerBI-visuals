//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.data {
    export module DataViewSelfCrossJoin {
        /**
         * Returns a new DataView based on the original, with a single DataViewCategorical category that is "cross joined"
         * to itself as a value grouping.
         * This is the mathematical equivalent of taking an array and turning it into an identity matrix.
         */
        export function apply(dataView: DataView): DataView {
            debug.assertValue(dataView, 'dataView');

            if (!dataView.categorical)
                return;
            var dataViewCategorical = dataView.categorical;
            if (!dataViewCategorical.categories || dataViewCategorical.categories.length !== 1)
                return;
            if (dataViewCategorical.values && dataViewCategorical.values.source)
                return;

            return applyCategorical(dataView.metadata, dataViewCategorical);
        }

        function applyCategorical(dataViewMetadata: DataViewMetadata, dataViewCategorical: DataViewCategorical): DataView {
            debug.assertValue(dataViewMetadata, 'dataViewMetadata');
            debug.assertValue(dataViewCategorical, 'dataViewCategorical');
            debug.assertValue(dataViewCategorical.categories, 'dataViewCategorical.categories');

            dataViewMetadata = Prototype.inherit(dataViewMetadata);
            dataViewMetadata.columns = [];

            var valuesArray: DataViewValueColumn[] = dataViewCategorical.values
                ? dataViewCategorical.values.grouped()[0].values
                : [];

            var category = dataViewCategorical.categories[0],
                categoryValues = category.values,
                categoryIdentities = category.identity,
                categoryLength = categoryIdentities.length,
                crossJoinedValuesArray: DataViewValueColumn[] = [],
                nullValuesArray: any[] = createNullValues(categoryLength);

            dataViewMetadata.columns.push(category.source);

            for (var i = 0; i < categoryLength; i++) {
                var identity = categoryIdentities[i],
                    categoryValue = categoryValues[i];

                for (var j = 0, jlen = valuesArray.length; j < jlen; j++) {
                    var originalValueColumn = valuesArray[j],
                        originalHighlightValues = originalValueColumn.highlights;

                    var crossJoinedValueColumnSource = Prototype.inherit(originalValueColumn.source);
                    crossJoinedValueColumnSource.groupName = categoryValue;
                    dataViewMetadata.columns.push(crossJoinedValueColumnSource);

                    var crossJoinedValueColumn: DataViewValueColumn = {
                        source: crossJoinedValueColumnSource,
                        identity: identity,
                        values: inheritArrayWithValue(nullValuesArray, originalValueColumn.values, i),
                    };

                    if (originalHighlightValues)
                        crossJoinedValueColumn.highlights = inheritArrayWithValue(nullValuesArray, originalHighlightValues, i);

                    crossJoinedValuesArray.push(crossJoinedValueColumn);
                }
            }

            var crossJoinedValues = DataViewTransform.createValueColumns(crossJoinedValuesArray, category.identityFields);
            crossJoinedValues.source = category.source;

            return {
                metadata: dataViewMetadata,
                categorical: {
                    categories: dataViewCategorical.categories,
                    values: crossJoinedValues,
                },
            };
        }

        function createNullValues(length: number): any[] {
            debug.assertValue(length, 'length');

            var array = new Array(length);
            for (var i = 0; i < length; i++)
                array[i] = null;
            return array;
        }

        function inheritArrayWithValue(nullValues: any[], original: any[], index: number): any[] {
            var inherited = Prototype.inherit(nullValues);
            inherited[index] = original[index];

            return inherited;
        }
    }
}
