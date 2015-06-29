//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbitests {
    import DataDotChart = powerbi.visuals.DataDotChart;
    import DataShapeUtility = powerbi.data.dsr.DataShapeUtility;
    import DataViewTransform = powerbi.data.DataViewTransform;    
    import SemanticType = powerbi.data.SemanticType;
    import EventType = powerbitests.helpers.ClickEventType;
    import ColumnUtil = powerbi.visuals.ColumnUtil;

    describe("Check DataDotChart capabilities",() => {

        it('DataDotChart registered capabilities',() => {
            expect(powerbi.visuals.visualPluginFactory.create().getPlugin('dataDotChart').capabilities).toBe(DataDotChart.capabilities);
        });

        it('DataDotChart capabilities should include dataRoles',() => {
            expect(DataDotChart.capabilities.dataRoles).toBeDefined();
        });

        it('DataDotChart capabilities should include dataViewMappings',() => {
            expect(DataDotChart.capabilities.dataViewMappings).toBeDefined();
        });

        it('Capabilities should not suppressDefaultTitle',() => {
            expect(DataDotChart.capabilities.suppressDefaultTitle).toBeUndefined();
        });

        it('FormatString property should match calculated',() => {
            expect(powerbi.data.DataViewObjectDescriptors.findFormatString(DataDotChart.capabilities.objects)).toEqual(DataDotChart.formatStringProp);
        });
    });

    describe("DataDotChart converter",() => {

        var blankCategoryValue = '(Blank)';

        var dataViewMetadata: powerbi.DataViewMetadata = {
            columns: [
                {
                    name: 'stringColumn',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                },
                {
                    name: 'numberColumn',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number)
                },
                {
                    name: 'dateTimeColumn',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.DateTime)
                }
            ]
        };

        it('Check converter with string categories undefined series',() => {

            var dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: []
                    }],
                    values: undefined
                }
            };

            var actualData = DataDotChart.converter(dataView, blankCategoryValue);
            expect(actualData).toBeDefined();
            expect(actualData.series).toBeDefined();
            expect(actualData.series.data).toBeDefined();
            expect(actualData.series.data.length).toEqual(0);
        });

        it('Check converter with string categories and an empty numeric series',() => {

            var dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['Cat 1', 'Cat 2', 'Cat 3']
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [],
                    }])
                }
            };

            var actualData = DataDotChart.converter(dataView, blankCategoryValue);
            expect(actualData).toEqual({
                series: {
                    xCol: dataView.metadata.columns[0],
                    yCol: dataView.metadata.columns[1],
                    data: []                    
                },
                hasHighlights: false
            });
        });

        it('Check converter with string categories and a numeric series',() => {

            var dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['Cat 1', 'Cat 2', 'Cat 3']
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100, 200, 300],
                    }])
                }
            };

            var actualData = DataDotChart.converter(dataView, blankCategoryValue);

            expect(actualData.series).toBeDefined();
            expect(actualData.series.xCol).toEqual(dataView.metadata.columns[0]);
            expect(actualData.series.yCol).toEqual(dataView.metadata.columns[1]);
            expect(actualData.series.data).toBeDefined();
            expect(actualData.series.data.length).toEqual(3);

            for (var i = 0; i < actualData.series.data.length; i++) {
                var seriesData = actualData.series.data[i];
                expect(seriesData.categoryValue).toBe(dataView.categorical.categories[0].values[i]);
                expect(seriesData.value).toBe(dataView.categorical.values[0].values[i]);
                expect(seriesData.categoryIndex).toBe(i);
                expect(seriesData.seriesIndex).toBe(0);
                expect(seriesData.selected).toBe(false);
            }
        });

        it('Check converter with empty categories and single numeric value',() => {

            var dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100],
                    }])
                }
            };

            var actualData = DataDotChart.converter(dataView, blankCategoryValue);

            expect(actualData.series).toBeDefined();
            expect(actualData.series.xCol).toBeUndefined();
            expect(actualData.series.yCol).toEqual(dataView.metadata.columns[1]);
            expect(actualData.series.data).toBeDefined();
            expect(actualData.series.data.length).toEqual(1);

            for (var i = 0; i < actualData.series.data.length; i++) {
                var seriesData = actualData.series.data[i];
                expect(seriesData.categoryValue).toBe(blankCategoryValue);
                expect(seriesData.value).toBe(dataView.categorical.values[0].values[i]);
                expect(seriesData.categoryIndex).toBe(i);
                expect(seriesData.seriesIndex).toBe(0);
                expect(seriesData.selected).toBe(false);
            }
        });

        it('Check converter with undefined categories and single numeric value',() => {

            var dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100],
                    }])
                }
            };

            var actualData = DataDotChart.converter(dataView, blankCategoryValue);

            expect(actualData.series).toBeDefined();
            expect(actualData.series.xCol).toBeUndefined();
            expect(actualData.series.yCol).toEqual(dataView.metadata.columns[1]);
            expect(actualData.series.data).toBeDefined();
            expect(actualData.series.data.length).toEqual(1);

            for (var i = 0; i < actualData.series.data.length; i++) {
                var seriesData = actualData.series.data[i];
                expect(seriesData.categoryValue).toBe(blankCategoryValue);
                expect(seriesData.value).toBe(dataView.categorical.values[0].values[i]);
                expect(seriesData.categoryIndex).toBe(i);
                expect(seriesData.seriesIndex).toBe(0);
                expect(seriesData.selected).toBe(false);
            }
        });

        it('Check converter with string categories and multiple numeric series',() => {

            var dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['Cat 1', 'Cat 2', 'Cat 3']
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100, 200, 300],
                    },
                        {
                            source: dataViewMetadata.columns[1],
                            values: [101, 201, 301],
                        },
                        {
                            source: dataViewMetadata.columns[1],
                            values: [102, 202, 302],
                        }])
                }
            };

            var actualData = DataDotChart.converter(dataView, blankCategoryValue);

            expect(actualData.series).toBeDefined();
            expect(actualData.series.xCol).toEqual(dataView.metadata.columns[0]);
            expect(actualData.series.yCol).toEqual(dataView.metadata.columns[1]);
            expect(actualData.series.data).toBeDefined();
            expect(actualData.series.data.length).toEqual(3);

            for (var i = 0; i < actualData.series.data.length; i++) {
                var seriesData = actualData.series.data[i];
                expect(seriesData.categoryValue).toBe(dataView.categorical.categories[0].values[i]);
                expect(seriesData.value).toBe(dataView.categorical.values[0].values[i]);
                expect(seriesData.categoryIndex).toBe(i);
                expect(seriesData.seriesIndex).toBe(0);
                expect(seriesData.selected).toBe(false);
            }
        });

        it('Check converter with date-time categories and a numeric series',() => {

            var dates = [new Date('2014/9/25'), new Date('2014/12/12'), new Date('2015/9/25')];

            var dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[2],
                        values: dates
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100, 200, 300],
                    }])
                }
            };

            var actualData = DataDotChart.converter(dataView, blankCategoryValue);

            expect(actualData.series).toBeDefined();
            expect(actualData.series.xCol).toEqual(dataView.metadata.columns[2]);
            expect(actualData.series.yCol).toEqual(dataView.metadata.columns[1]);
            expect(actualData.series.data).toBeDefined();
            expect(actualData.series.data.length).toEqual(3);

            for (var i = 0; i < actualData.series.data.length; i++) {
                var seriesData = actualData.series.data[i];
                expect(seriesData.categoryValue).toBe(dates[i].getTime());
                expect(seriesData.value).toBe(dataView.categorical.values[0].values[i]);
                expect(seriesData.categoryIndex).toBe(i);
                expect(seriesData.seriesIndex).toBe(0);
                expect(seriesData.selected).toBe(false);
            }
        });

        it('Check converter with date-time categories and a numeric series where category value is null',() => {

            var dates = [new Date('2014/9/25'), null, new Date('2015/9/25')];

            var dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[2],
                        values: dates
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100, 200, 300],
                    }])
                }
            };

            var actualData = DataDotChart.converter(dataView, blankCategoryValue);

            expect(actualData.series).toBeDefined();
            expect(actualData.series.xCol).toEqual(dataView.metadata.columns[2]);
            expect(actualData.series.yCol).toEqual(dataView.metadata.columns[1]);
            expect(actualData.series.data).toBeDefined();
            expect(actualData.series.data.length).toEqual(3);

            for (var i = 0; i < actualData.series.data.length; i++) {
                var seriesData = actualData.series.data[i];

                expect(seriesData.categoryValue).toBe(dates[i] ? dates[i].getTime() : null);
                expect(seriesData.value).toBe(dataView.categorical.values[0].values[i]);
                expect(seriesData.categoryIndex).toBe(i);
                expect(seriesData.seriesIndex).toBe(0);
                expect(seriesData.selected).toBe(false);
            }
        });

        it('Check converter pass string categories and a numeric series produces identities',() => {

            var identityNames = ['John Domo', 'Delta Force', 'Jean Tablau'];
            var categoryIdentities = [
                mocks.dataViewScopeIdentity(identityNames[0]),
                mocks.dataViewScopeIdentity(identityNames[1]),
                mocks.dataViewScopeIdentity(identityNames[2]),
            ];

            var dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ['Cat 1', 'Cat 2', 'Cat 3'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100, 200, 300],
                    }])
                }
            };

            var actualData = DataDotChart.converter(dataView, blankCategoryValue);

            expect(actualData.series).toBeDefined();
            expect(actualData.series.data).toBeDefined();
            expect(actualData.series.data.length).toEqual(3);

            for (var i = 0; i < actualData.series.data.length; i++) {
                var seriesData = actualData.series.data[i];
                expect(seriesData.identity).toBeDefined();
                expect(seriesData.identity.getKey()).toContain(identityNames[i]);
            }
        });

        it('Check converter passed undefined categories produces measure name identities ',() => {

            var dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100],
                    }])
                }
            };

            var actualData = DataDotChart.converter(dataView, blankCategoryValue);

            expect(actualData.series).toBeDefined();
            expect(actualData.series.data).toBeDefined();
            expect(actualData.series.data.length).toEqual(1);

            for (var i = 0; i < actualData.series.data.length; i++) {
                var seriesData = actualData.series.data[i];
                expect(seriesData.identity).toBeDefined();
                expect(seriesData.identity.getKey()).toContain(dataViewMetadata.columns[1].name);
            }
        });
    });

    describe("DataDotChart render to DOM",() => {

        var hostServices = powerbitests.mocks.createVisualHostServices();

        var v: powerbi.IVisual, element: JQuery;
        var DefaultWaitForRender = 100;

        var dataViewMetadata: powerbi.DataViewMetadata = {
            columns: [
                {
                    name: 'stringColumn',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                },
                {
                    name: 'numberColumn',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number),
                    format: '0.000'
                },
                {
                    name: 'dateTimeColumn',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.DateTime)
                }
            ]
        };

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('dataDotChart').create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { isInteractiveLegend: false }
            });
        });

        var categoryValues = ['a', 'b', 'c', 'd', 'e'];
        var categoryIdentities = categoryValues.map(n => mocks.dataViewScopeIdentity(n));

        it('Check axis in DOM',(done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: categoryValues,
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [500000, 495000, 490000, 480000, 500000],
                        }])
                    }
                }]
            });
            setTimeout(() => {
                expect($('.dataDotChart .axisGraphicsContext .x.axis .tick').length).toBeGreaterThan(0);
                expect($('.dataDotChart .axisGraphicsContext .y.axis .tick').length).toBeGreaterThan(0);
                expect($('.dataDotChart .axisGraphicsContext .y.axis .tick').find('text').first().text()).toBe('0M');
                expect($('.dataDotChart .axisGraphicsContext .y.axis .tick').find('text').last().text()).toBe('0.5M');
                done();
            }, DefaultWaitForRender);
        });

        it('Check dots in DOM',(done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: categoryValues,
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [500000, 495000, 490000, 480000, 500000],
                        }])
                    }
                }]
            });
            setTimeout(() => {
                var $dots = $('.dataDotChart .dot');
                expect($dots.length).toBe(5);

                var dotRadius = 0;
                $dots.each((index, elem) => {

                    var $elem = $(elem);

                    // I verify all dots have the same non-zero radius
                    var radius = +$elem.attr('r');
                    if (index === 0) {
                        expect(radius).toBeGreaterThan(0);
                        dotRadius = radius;
                    }
                    else {
                        expect(radius).toEqual(dotRadius);
                    }

                    expect(+$elem.attr('cx')).toBeGreaterThan(0);

                    // The first and last dots are at the top
                    if (index === 0 || index === 4) {
                        expect(+$elem.attr('cy')).toBe(0);
                    }
                    else {
                        expect(+$elem.attr('cy')).toBeGreaterThan(0);
                    }
                });

                done();
            }, DefaultWaitForRender);
        });

        it('Check dot labels in DOM',(done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: categoryValues,
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [500000, 495000, 490000, 480000, 500000],
                        }])
                    }
                }]
            });
            setTimeout(() => {
                var $labels = $('.dataDotChart .label');
                expect($labels.length).toBe(5);

                $labels.each((index, elem) => {

                    var $elem = $(elem);

                    expect(+$elem.attr('x')).toBeGreaterThan(0);

                    // The first and last dots are at the top
                    if (index === 0 || index === 4) {
                        expect(+$elem.attr('y')).toBe(0);
                    }
                    else {
                        expect(+$elem.attr('y')).toBeGreaterThan(0);
                    }
                });

                var $label1 = $($labels.get(0));
                expect($label1.text()).toBe('0.5M');

                var $label3 = $($labels.get(2));
                expect($label3.text()).toBe('0.49M');

                done();
            }, DefaultWaitForRender);
        });

        var overflowCategoryValues = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        var overflowCategoryIdentities = overflowCategoryValues.map(n => mocks.dataViewScopeIdentity(n));

        it('Check dots text overflow handled in DOM',(done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: overflowCategoryValues, //a, b, ... z
                            identity: overflowCategoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [999, 888, 777, 666, 555, 444, 333, 222, 111, 999, 888, 777, 666, 555, 444, 333, 222, 111, 999, 888, 777, 666, 555, 444, 333, 222],
                        }])
                    }
                }]
            });
            setTimeout(() => {
                var $labels = $('.dataDotChart .label');
                expect($labels.length).toBeGreaterThan(0);

                $labels.each((index, elem) => {

                    var $elem = $(elem);

                    expect($elem.attr('class')).toContain('overflowed');
                });

                done();
            }, DefaultWaitForRender);
        });

        it('Check partial highlighting dots in DOM',(done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: categoryValues,
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [500000, 495000, 490000, 480000, 500000],
                            highlights: [100000, 195000, null, 180000, 9000],
                        }])
                    }
                }]
            });
            setTimeout(() => {
                var $dots = $('.dataDotChart .dot');
                expect($dots.length).toBe(10);
                
                // I check partial highlighting
                var DefaultOpacity = "" + ColumnUtil.DefaultOpacity;
                var DimmedOpacity = "" + ColumnUtil.DimmedOpacity;

                expect($dots[0].style.fillOpacity).toBe(DimmedOpacity);
                expect($dots[1].style.fillOpacity).toBe(DefaultOpacity);
                expect($dots[2].style.fillOpacity).toBe(DimmedOpacity);
                expect($dots[3].style.fillOpacity).toBe(DefaultOpacity);
                expect($dots[4].style.fillOpacity).toBe(DimmedOpacity);
                expect($dots[5].style.fillOpacity).toBe(DefaultOpacity);
                expect($dots[6].style.fillOpacity).toBe(DimmedOpacity);
                expect($dots[7].style.fillOpacity).toBe(DefaultOpacity);
                expect($dots[8].style.fillOpacity).toBe(DimmedOpacity);
                expect($dots[9].style.fillOpacity).toBe(DefaultOpacity);                

                // I check that null value causes .null-value css
                expect($($dots[5]).attr('class')).toContain('null-value');

                done();
            }, DefaultWaitForRender);
        });
    });

    describe("DataDotChart interactivity in DOM",() => {

        var hostServices = mocks.createVisualHostServices();

        var v: powerbi.IVisual, element: JQuery;
        var DefaultWaitForRender = 100;

        var DefaultOpacity = "" + ColumnUtil.DefaultOpacity;
        var DimmedOpacity = "" + ColumnUtil.DimmedOpacity;

        var dataViewMetadata: powerbi.DataViewMetadata = {
            columns: [
                {
                    name: 'stringColumn',
                    type: DataShapeUtility.describeDataType(SemanticType.String)
                },
                {
                    name: 'numberColumn',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.Number),
                    format: '0.000'
                },
                {
                    name: 'dateTimeColumn',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(SemanticType.DateTime)
                }
            ]
        };

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('dataDotChart').create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { selection: true, isInteractiveLegend: false }
            });
        });

        var categoryValues = ['a', 'b', 'c', 'd', 'e'];
        var categoryIdentities = categoryValues.map(n => mocks.dataViewScopeIdentity(n));

        it('Check select dot',(done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: categoryValues,
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [500000, 495000, 490000, 480000, 500000],
                        }])
                    }
                }]
            });
            setTimeout(() => {

                var dots = $('.dataDotChart .dot');

                spyOn(hostServices, 'onSelect').and.callThrough();

                (<any>dots.first()).d3Click(0, 0);

                expect(dots[0].style.fillOpacity).toBe(DefaultOpacity);
                expect(dots[1].style.fillOpacity).toBe(DimmedOpacity);
                expect(dots[2].style.fillOpacity).toBe(DimmedOpacity);
                expect(dots[3].style.fillOpacity).toBe(DimmedOpacity);
                expect(dots[4].style.fillOpacity).toBe(DimmedOpacity);

                expect(hostServices.onSelect).toHaveBeenCalledWith(
                    {
                        data: [
                            {
                                data: [categoryIdentities[0]]
                            }
                        ]
                    });

                done();
            }, DefaultWaitForRender);
        });

        it('Check multi-select dot',(done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: categoryValues,
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [500000, 495000, 490000, 480000, 500000],
                        }])
                    }
                }]
            });
            setTimeout(() => {

                var dots = $('.dataDotChart .dot');

                spyOn(hostServices, 'onSelect').and.callThrough();

                (<any>dots.first()).d3Click(0, 0);
                (<any>dots.last()).d3Click(0, 0, EventType.CtrlKey);

                expect(dots[0].style.fillOpacity).toBe(DefaultOpacity);
                expect(dots[1].style.fillOpacity).toBe(DimmedOpacity);
                expect(dots[2].style.fillOpacity).toBe(DimmedOpacity);
                expect(dots[3].style.fillOpacity).toBe(DimmedOpacity);
                expect(dots[4].style.fillOpacity).toBe(DefaultOpacity);

                expect(hostServices.onSelect).toHaveBeenCalledWith(
                    {
                        data: [
                            {
                                data: [categoryIdentities[0]]
                            },
                            {
                                data: [categoryIdentities[4]]
                            }
                        ]
                    });

                done();
            }, DefaultWaitForRender);
        });

        it('Check external clear selection',(done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: categoryValues,
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [500000, 495000, 490000, 480000, 500000],
                        }])
                    }
                }]
            });
            setTimeout(() => {

                var dots = $('.dataDotChart .dot');

                spyOn(hostServices, 'onSelect').and.callThrough();

                (<any>dots.first()).d3Click(0, 0);
                (<any>dots.last()).d3Click(0, 0, EventType.CtrlKey);

                v.onClearSelection();

                expect(dots[0].style.fillOpacity).toBe(DefaultOpacity);
                expect(dots[1].style.fillOpacity).toBe(DefaultOpacity);
                expect(dots[2].style.fillOpacity).toBe(DefaultOpacity);
                expect(dots[3].style.fillOpacity).toBe(DefaultOpacity);
                expect(dots[4].style.fillOpacity).toBe(DefaultOpacity);               

                done();
            }, DefaultWaitForRender);
        });

        it('Check background-click clear selection',(done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: categoryValues,
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [500000, 495000, 490000, 480000, 500000],
                        }])
                    }
                }]
            });
            setTimeout(() => {

                var dots = $('.dataDotChart .dot');                

                (<any>dots.first()).d3Click(0, 0);
                (<any>dots.last()).d3Click(0, 0, EventType.CtrlKey);

                spyOn(hostServices, 'onSelect').and.callThrough();

                var svg = element.find('svg');
                (<any>svg.first()).d3Click(0, 0);

                expect(dots[0].style.fillOpacity).toBe(DefaultOpacity);
                expect(dots[1].style.fillOpacity).toBe(DefaultOpacity);
                expect(dots[2].style.fillOpacity).toBe(DefaultOpacity);
                expect(dots[3].style.fillOpacity).toBe(DefaultOpacity);
                expect(dots[4].style.fillOpacity).toBe(DefaultOpacity);

                expect(hostServices.onSelect).toHaveBeenCalledWith(
                    {
                        data: []
                    });

                done();
            }, DefaultWaitForRender);
        });
    });
}        
 