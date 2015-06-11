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
    import DataShapeUtility = powerbi.data.dsr.DataShapeUtility;
    import SemanticType = powerbi.data.SemanticType;
    import DataViewTransform = powerbi.data.DataViewTransform;
    import IVisualWarning = powerbi.IVisualWarning;

    describe('InvalidDataValuesCheckerTests', () => {
        var categoryValues = ['a', 'b', 'c', 'd', 'e'];
        var categoryIdentities = categoryValues.map(n => mocks.dataViewScopeIdentity(n));
        var dataViewMetadata: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'stringColumn',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                },
                {
                    displayName: 'numberColumn',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number),
                    format: '0.000'
                },
                {
                    displayName: 'dateTimeColumn',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.DateTime)
                }
            ]
        };

        function getDataViewForValueWarning(values: number[]) {
            var dataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: categoryValues,
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: values,
                    }])
                }
            };

            return dataView;
        }

        it('empty values does not display a warning all supported.', () => {
            var dataView = getDataViewForValueWarning([]);
            var warnings: IVisualWarning[] = powerbi.visuals.getInvalidValueWarnings(
                [dataView],
                true,
                true,
                true);

            expect(warnings.length).toBe(0);
        });

        it('empty values does not display a warning none supported.', () => {
            var dataView = getDataViewForValueWarning([]);
            var warnings: IVisualWarning[] = powerbi.visuals.getInvalidValueWarnings(
                [dataView],
                false,
                false,
                false);

            expect(warnings.length).toBe(0);
        });

        it('single value does not display a warning all supported.', () => {
            var dataView = getDataViewForValueWarning([300]);
            var warnings: IVisualWarning[] = powerbi.visuals.getInvalidValueWarnings(
                [dataView],
                true,
                true,
                true);

            expect(warnings.length).toBe(0);
        });

        it('single value does not display a warning none supported.', () => {
            var dataView = getDataViewForValueWarning([300]);
            var warnings: IVisualWarning[] = powerbi.visuals.getInvalidValueWarnings(
                [dataView],
                false,
                false,
                false);

            expect(warnings.length).toBe(0);
        });

        it('NaN value does not display a warning when supported.', () => {
            var dataView = getDataViewForValueWarning([NaN]);
            var warnings: IVisualWarning[] = powerbi.visuals.getInvalidValueWarnings(
                [dataView],
                true,
                true,
                true);

            expect(warnings.length).toBe(0);
        });

        it('NaN value does not display a warning when others not supported.', () => {
            var dataView = getDataViewForValueWarning([NaN]);
            var warnings: IVisualWarning[] = powerbi.visuals.getInvalidValueWarnings(
                [dataView],
                true,
                false,
                false);

            expect(warnings.length).toBe(0);
        });

        it('NaN value displays a warning when not supported.', () => {
            var dataView = getDataViewForValueWarning([NaN]);
            var warnings: IVisualWarning[] = powerbi.visuals.getInvalidValueWarnings(
                [dataView],
                false,
                false,
                false);

            expect(warnings.length).toBe(1);
            expect(warnings[0].code).toBe('NaNNotSupported');
        });

        it('NaN value displays a warning when not supported but others are supported.', () => {
            var dataView = getDataViewForValueWarning([NaN]);
            var warnings: IVisualWarning[] = powerbi.visuals.getInvalidValueWarnings(
                [dataView],
                false,
                true,
                true);

            expect(warnings.length).toBe(1);
            expect(warnings[0].code).toBe('NaNNotSupported');
        });

        it('Negative infinity value does not display a warning when supported.', () => {
            var dataView = getDataViewForValueWarning([Number.NEGATIVE_INFINITY]);
            var warnings: IVisualWarning[] = powerbi.visuals.getInvalidValueWarnings(
                [dataView],
                true,
                true,
                true);

            expect(warnings.length).toBe(0);
        });

        it('Negative infinity value does not display a warning when others not supported.', () => {
            var dataView = getDataViewForValueWarning([Number.NEGATIVE_INFINITY]);
            var warnings: IVisualWarning[] = powerbi.visuals.getInvalidValueWarnings(
                [dataView],
                false,
                true,
                false);

            expect(warnings.length).toBe(0);
        });

        it('Negative infinity value displays a warning when not supported.', () => {
            var dataView = getDataViewForValueWarning([Number.NEGATIVE_INFINITY]);
            var warnings: IVisualWarning[] = powerbi.visuals.getInvalidValueWarnings(
                [dataView],
                false,
                false,
                false);

            expect(warnings.length).toBe(1);
            var i: number = 0;
            expect(warnings[i++].code).toBe('InfinityValuesNotSupported');
        });

        it('Negative infinity value displays a warning when not supported but others are supported.', () => {
            var dataView = getDataViewForValueWarning([Number.NEGATIVE_INFINITY]);
            var warnings: IVisualWarning[] = powerbi.visuals.getInvalidValueWarnings(
                [dataView],
                true,
                false,
                true);

            expect(warnings.length).toBe(1);
            expect(warnings[0].code).toBe('InfinityValuesNotSupported');
        });

        it('Positive infinity value does not display a warning when supported.', () => {
            var dataView = getDataViewForValueWarning([Number.POSITIVE_INFINITY]);
            var warnings: IVisualWarning[] = powerbi.visuals.getInvalidValueWarnings(
                [dataView],
                true,
                true,
                true);

            expect(warnings.length).toBe(0);
        });

        it('Positive infinity value does not display a warning when others not supported.', () => {
            var dataView = getDataViewForValueWarning([Number.POSITIVE_INFINITY]);
            var warnings: IVisualWarning[] = powerbi.visuals.getInvalidValueWarnings(
                [dataView],
                false,
                false,
                true);

            expect(warnings.length).toBe(0);
        });

        it('Postive infinity value displays a warning when not supported.', () => {
            var dataView = getDataViewForValueWarning([Number.POSITIVE_INFINITY]);
            var warnings: IVisualWarning[] = powerbi.visuals.getInvalidValueWarnings(
                [dataView],
                false,
                false,
                false);

            expect(warnings.length).toBe(1);
            expect(warnings[0].code).toBe('InfinityValuesNotSupported');
        });

        it('Positive infinity value displays a warning when not supported but others are supported.', () => {
            var dataView = getDataViewForValueWarning([Number.POSITIVE_INFINITY]);
            var warnings: IVisualWarning[] = powerbi.visuals.getInvalidValueWarnings(
                [dataView],
                true,
                true,
                false);

            expect(warnings.length).toBe(1);
            expect(warnings[0].code).toBe('InfinityValuesNotSupported');
        });

        it('Out of range value displays a warning when others are supported.', () => {
            var dataView = getDataViewForValueWarning([1e301]);
            var warnings: IVisualWarning[] = powerbi.visuals.getInvalidValueWarnings(
                [dataView],
                true,
                true,
                true);

            expect(warnings.length).toBe(1);
            expect(warnings[0].code).toBe('ValuesOutOfRange');
        });

        it('Negative out of range value displays a warning when others are supported.', () => {
            var dataView = getDataViewForValueWarning([-27e300]);
            var warnings: IVisualWarning[] = powerbi.visuals.getInvalidValueWarnings(
                [dataView],
                true,
                true,
                true);

            expect(warnings.length).toBe(1);
            expect(warnings[0].code).toBe('ValuesOutOfRange');
        });

        it('Out of range value displays a warning when others are not supported.', () => {
            var dataView = getDataViewForValueWarning([1e301]);
            var warnings: IVisualWarning[] = powerbi.visuals.getInvalidValueWarnings(
                [dataView],
                false,
                false,
                false);

            expect(warnings.length).toBe(1);
            expect(warnings[0].code).toBe('ValuesOutOfRange');
        });

        it('Negative out of range value displays a warning when others are not supported.', () => {
            var dataView = getDataViewForValueWarning([1e301]);
            var warnings: IVisualWarning[] = powerbi.visuals.getInvalidValueWarnings(
                [dataView],
                false,
                false,
                false);

            expect(warnings.length).toBe(1);
            expect(warnings[0].code).toBe('ValuesOutOfRange');
        });

        it('NaN and infinity sends warning for both when all not supported', () => {
            var dataView = getDataViewForValueWarning([NaN, Number.POSITIVE_INFINITY]);
            var warnings: IVisualWarning[] = powerbi.visuals.getInvalidValueWarnings(
                [dataView],
                false,
                false,
                false);

            expect(warnings.length).toBe(2);
            var i: number = 0;
            expect(warnings[i++].code).toBe('NaNNotSupported');
            expect(warnings[i++].code).toBe('InfinityValuesNotSupported');
        });

        it('NaN and infinity and out of range sends warning for all when all not supported', () => {
            var dataView = getDataViewForValueWarning([NaN, Number.POSITIVE_INFINITY, 1e301]);
            var warnings: IVisualWarning[] = powerbi.visuals.getInvalidValueWarnings(
                [dataView],
                false,
                false,
                false);

            expect(warnings.length).toBe(3);
            var i: number = 0;
            expect(warnings[i++].code).toBe('NaNNotSupported');
            expect(warnings[i++].code).toBe('InfinityValuesNotSupported');
            expect(warnings[i++].code).toBe('ValuesOutOfRange');
        });

        it('NaN and infinity and out of range sends warning for all when all not supported has no duplications', () => {
            var dataView = getDataViewForValueWarning([NaN, Number.POSITIVE_INFINITY, NaN, 1e301]);
            var warnings: IVisualWarning[] = powerbi.visuals.getInvalidValueWarnings(
                [dataView],
                false,
                false,
                false);

            expect(warnings.length).toBe(3);
            var index: number = 0;
            expect(warnings[index++].code).toBe('NaNNotSupported');
            expect(warnings[index++].code).toBe('InfinityValuesNotSupported');
            expect(warnings[index++].code).toBe('ValuesOutOfRange');
        });

        it('NaN and infinity and out of range sends warning for all when Infinity supported has no infinity warning', () => {
            var dataView = getDataViewForValueWarning([NaN, Number.POSITIVE_INFINITY, NaN, 1e301]);
            var warnings: IVisualWarning[] = powerbi.visuals.getInvalidValueWarnings(
                [dataView],
                false,
                true,
                true);

            expect(warnings.length).toBe(2);
            var index: number = 0;
            expect(warnings[index++].code).toBe('NaNNotSupported');
            expect(warnings[index++].code).toBe('ValuesOutOfRange');
        });

        it('NaN and infinity and out of range sends warning for all with good values at the beginning', () => {
            var dataView = getDataViewForValueWarning([100, 200, 300, 400, NaN, Number.POSITIVE_INFINITY, NaN, 1e301]);
            var warnings: IVisualWarning[] = powerbi.visuals.getInvalidValueWarnings(
                [dataView],
                false,
                false,
                false);

            expect(warnings.length).toBe(3);
            var index: number = 0;
            expect(warnings[index++].code).toBe('NaNNotSupported');
            expect(warnings[index++].code).toBe('InfinityValuesNotSupported');
            expect(warnings[index++].code).toBe('ValuesOutOfRange');
        });

        it('NaN and infinity and out of range sends warning for all with good values throughout', () => {
            var dataView = getDataViewForValueWarning([100, 200, NaN, 300, Number.POSITIVE_INFINITY, NaN, 400, 1e301, 500]);
            var warnings: IVisualWarning[] = powerbi.visuals.getInvalidValueWarnings(
                [dataView],
                false,
                false,
                false);

            expect(warnings.length).toBe(3);
            var index: number = 0;
            expect(warnings[index++].code).toBe('NaNNotSupported');
            expect(warnings[index++].code).toBe('InfinityValuesNotSupported');
            expect(warnings[index++].code).toBe('ValuesOutOfRange');
        });

        it('Multiple dataViews both good does not show a warning', () => {
            var dataView = getDataViewForValueWarning([100, 200, 500]);
            var dataView2 = getDataViewForValueWarning([200, 300, 400]);
            var warnings: IVisualWarning[] = powerbi.visuals.getInvalidValueWarnings(
                [dataView, dataView2],
                false,
                false,
                false);

            expect(warnings.length).toBe(0);
        });

        it('Multiple dataviews first has invalid shows warnings', () => {
            var dataView = getDataViewForValueWarning([100, 200, NaN, ]);
            var dataView2 = getDataViewForValueWarning([100, 200, 300]);
            var warnings: IVisualWarning[] = powerbi.visuals.getInvalidValueWarnings(
                [dataView, dataView2],
                false,
                false,
                false);

            expect(warnings.length).toBe(1);
            var index: number = 0;
            expect(warnings[index++].code).toBe('NaNNotSupported');
        });

        it('Multiple datasets last has invalid values shows warnings', () => {
            var dataView = getDataViewForValueWarning([100, 200, 300, 400]);
            var dataView2 = getDataViewForValueWarning([100, 200, NaN, 300, Number.POSITIVE_INFINITY, NaN, 400, 1e301, 500]);
            var warnings: IVisualWarning[] = powerbi.visuals.getInvalidValueWarnings(
                [dataView, dataView2],
                false,
                false,
                false);

            expect(warnings.length).toBe(3);
            var index: number = 0;
            expect(warnings[index++].code).toBe('NaNNotSupported');
            expect(warnings[index++].code).toBe('InfinityValuesNotSupported');
            expect(warnings[index++].code).toBe('ValuesOutOfRange');
        });

        it('Multiple dataViews both have invalid values shows correct warning', () => {
            var dataView = getDataViewForValueWarning([100, 200, Number.NaN, 300, Number.POSITIVE_INFINITY, NaN, 400, 1e301, 500]);
            var dataView2 = getDataViewForValueWarning([Number.NEGATIVE_INFINITY, Number.NaN, 300, 1e301]);
            var warnings: IVisualWarning[] = powerbi.visuals.getInvalidValueWarnings(
                [dataView, dataView2],
                false,
                false,
                false);

            expect(warnings.length).toBe(3);
            var index: number = 0;
            expect(warnings[index++].code).toBe('NaNNotSupported');
            expect(warnings[index++].code).toBe('InfinityValuesNotSupported');
            expect(warnings[index++].code).toBe('ValuesOutOfRange');
        });

        it('Multiple dataViews both have invalid values not overlapping shows correct warning', () => {
            var dataView = getDataViewForValueWarning([100, 200, 300, Number.POSITIVE_INFINITY, 400, 1e301, 500]);
            var dataView2 = getDataViewForValueWarning([Number.NEGATIVE_INFINITY, Number.NaN, 300]);
            var warnings: IVisualWarning[] = powerbi.visuals.getInvalidValueWarnings(
                [dataView, dataView2],
                false,
                false,
                false);

            expect(warnings.length).toBe(3);
            var index: number = 0;
            expect(warnings[index++].code).toBe('NaNNotSupported');
            expect(warnings[index++].code).toBe('InfinityValuesNotSupported');
            expect(warnings[index++].code).toBe('ValuesOutOfRange');
        });
    });
} 