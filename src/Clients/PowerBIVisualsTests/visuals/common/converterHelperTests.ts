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
    describe("converterHelper tests",() => {

        it('categoryIsAlsoSeriesRole default',() => {
            var dataView = createCategoricalDataView({});
            expect(powerbi.visuals.converterHelper.categoryIsAlsoSeriesRole(dataView, 'Series', 'Category')).toBeFalsy();

            // Only a 'Series' role prevents us from using the Default strategy
            var dataView = createCategoricalDataView({ 'Category': true });
            expect(powerbi.visuals.converterHelper.categoryIsAlsoSeriesRole(dataView, 'Series', 'Category')).toBeFalsy();

            var dataView = createCategoricalDataView({ 'E === mc^2': true });
            expect(powerbi.visuals.converterHelper.categoryIsAlsoSeriesRole(dataView, 'Series', 'Category')).toBeFalsy();
        });

        it('categoryIsAlsoSeriesRole series and category',() => {
            var dataView = createCategoricalDataView({ 'Series': true, 'Category': true });
            expect(powerbi.visuals.converterHelper.categoryIsAlsoSeriesRole(dataView, 'Series', 'Category')).toBe(true);

            var dataView = createCategoricalDataView({ 'Series': true, 'F === ma': true, 'Category': true });
            expect(powerbi.visuals.converterHelper.categoryIsAlsoSeriesRole(dataView, 'Series', 'Category')).toBe(true);
        });

        it('getPivotedCategories default',() => {
            var dataView = createCategoricalDataView({});
            var categoryInfo = powerbi.visuals.converterHelper.getPivotedCategories(dataView, formatStringProp());

            // Note: Since the result includes a function property we can't perform a toEqual directly on the result, so check each part individually.
            expect(categoryInfo.categories).toEqual(['a', 'b']);
            expect(categoryInfo.categoryIdentities).toEqual([dataView.categories[0].identity[0], dataView.categories[0].identity[1]]);
        });

        it('getPivotedCategories empty categories',() => {
            var dataView = createCategoricalDataView({});

            // Empty the categories array
            dataView.categories = [];

            var categoryInfo = powerbi.visuals.converterHelper.getPivotedCategories(dataView, formatStringProp());
            validateEmptyCategoryInfo(categoryInfo);
        });

        it('getPivotedCategories empty category values',() => {
            var dataView = createCategoricalDataView({});

            // Empty the category values array
            dataView.categories[0].values = [];

            var categoryInfo = powerbi.visuals.converterHelper.getPivotedCategories(dataView, formatStringProp());
            expect(categoryInfo.categories).toEqual([]);
            expect(categoryInfo.categoryIdentities).toBeUndefined();
        });

        function validateEmptyCategoryInfo(categoryInfo: powerbi.visuals.PivotedCategoryInfo): void {
            // Note: Since the result includes a function property we can't perform a toEqual directly on the result, so check each part individually.
            expect(categoryInfo.categories).toEqual([null]);
            expect(categoryInfo.categoryIdentities).toBeUndefined();
        }

        function createCategoricalDataView(roles: { [x: string]: boolean; }): powerbi.DataViewCategorical {
            var metadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: 'col1', roles: roles },
                    { displayName: 'col2', isMeasure: true, roles: { 'Y': true } },
                ]
            };

            return {
                categories: [{
                    source: metadata.columns[0],
                    values: ['a', 'b'],
                    identity: [
                        mocks.dataViewScopeIdentity('a'),
                        mocks.dataViewScopeIdentity('b'),
                    ]
                }],
                values: powerbi.data.DataViewTransform.createValueColumns([
                    {
                        source: metadata.columns[1],
                        values: [100, 200]
                    }])
            };
        }

        function formatStringProp(): powerbi.DataViewObjectPropertyIdentifier {
            return { objectName: 'general', propertyName: 'formatString' };
        }
    });
}