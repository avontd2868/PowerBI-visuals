//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbitests;
(function (powerbitests) {
    var ArrayExtensions = jsCommon.ArrayExtensions;
    var CssConstants = jsCommon.CssConstants;
    var data = powerbi.data;
    var DataShapeUtility = powerbi.data.dsr.DataShapeUtility;
    var DataViewAnalysis = powerbi.DataViewAnalysis;
    var DataViewTransform = powerbi.data.DataViewTransform;
    var SemanticType = powerbi.data.SemanticType;
    var SQExprBuilder = powerbi.data.SQExprBuilder;
    var Treemap = powerbi.visuals.Treemap;
    var SelectionId = powerbi.visuals.SelectionId;
    var VisualHostServices = powerbi.explore.services.VisualHostServices;
    var DefaultWaitForRender = 500;
    var dataViewMetadataCategorySeriesColumns = {
        columns: [
            { name: 'Squad', queryName: 'select0', properties: { "Category": true }, type: DataShapeUtility.describeDataType(2048 /* String */) },
            { name: 'Period', queryName: 'select1', properties: { "Series": true }, type: DataShapeUtility.describeDataType(1 /* Number */) },
            { name: null, queryName: 'select2', groupName: '201501', isMeasure: true, properties: { "Values": true }, type: DataShapeUtility.describeDataType(1 /* Number */) },
            { name: null, queryName: 'select2', groupName: '201502', isMeasure: true, properties: { "Values": true }, type: DataShapeUtility.describeDataType(1 /* Number */) },
            { name: null, queryName: 'select2', groupName: '201503', isMeasure: true, properties: { "Values": true }, type: DataShapeUtility.describeDataType(1 /* Number */) }
        ]
    };
    var dataViewMetadataCategoryColumn = {
        columns: [
            { name: 'Genre', queryName: 'select0', properties: { "Category": true }, type: DataShapeUtility.describeDataType(2048 /* String */) },
            { name: 'TotalSales', queryName: 'select1', isMeasure: true, properties: { "Values": true }, type: DataShapeUtility.describeDataType(1 /* Number */) }
        ]
    };
    var dataViewMetadataCategoryColumnAndLongText = {
        columns: [
            { name: 'Category group', queryName: 'select0', properties: { "Category": true }, type: DataShapeUtility.describeDataType(2048 /* String */) },
            { name: 'Measure with long name', queryName: 'select1', isMeasure: true, properties: { "Values": true }, type: DataShapeUtility.describeDataType(1 /* Number */) },
            { name: 'Measure', queryName: 'select2', isMeasure: true, properties: { "Values": true }, type: DataShapeUtility.describeDataType(1 /* Number */) }
        ]
    };
    var dataViewMetadataCategoryAndMeasures = {
        columns: [
            { name: 'Area', queryName: 'select0', properties: { "Category": true }, type: DataShapeUtility.describeDataType(2048 /* String */) },
            { name: 'BugsFiled', queryName: 'select1', isMeasure: true, properties: { "Values": true }, type: DataShapeUtility.describeDataType(1 /* Number */) },
            { name: 'BugsFixed', queryName: 'select2', isMeasure: true, properties: { "Values": true }, type: DataShapeUtility.describeDataType(1 /* Number */) }
        ]
    };
    describe("Treemap", function () {
        var categoryColumn = { name: 'year', queryName: 'select0', type: DataShapeUtility.describeDataType(2048 /* String */) };
        var measureColumn = { name: 'sales', queryName: 'select1', isMeasure: true, type: DataShapeUtility.describeDataType(SemanticType.Integer) };
        it('Treemap registered capabilities', function () {
            expect(powerbi.visuals.visualPluginFactory.create().getPlugin('treemap').capabilities).toBe(powerbi.visuals.treemapCapabilities);
        });
        it('Capabilities should include dataViewMappings', function () {
            expect(powerbi.visuals.treemapCapabilities.dataViewMappings).toBeDefined();
        });
        it('Capabilities should include dataRoles', function () {
            expect(powerbi.visuals.treemapCapabilities.dataRoles).toBeDefined();
        });
        it('Capabilities should include objects', function () {
            expect(powerbi.visuals.treemapCapabilities.objects).toBeDefined();
        });
        it('FormatString property should match calculated', function () {
            expect(powerbi.data.DataViewObjectDescriptors.findFormatString(powerbi.visuals.treemapCapabilities.objects)).toEqual(powerbi.visuals.treemapProps.general.formatString);
        });
        it('preferred capability does not support zero rows', function () {
            var dataViewMetadata = {
                columns: [
                    { name: 'Year' },
                    { name: 'Value', isMeasure: true }
                ]
            };
            var dataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: []
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: measureColumn,
                        values: []
                    }])
                }
            };
            expect(DataViewAnalysis.supports(dataView, powerbi.visuals.treemapCapabilities.dataViewMappings[0], true)).toBe(false);
        });
        it('preferred capability does not support one row', function () {
            var dataViewMetadata = {
                columns: [
                    { name: 'Year' },
                    { name: 'Value', isMeasure: true }
                ]
            };
            var dataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: categoryColumn,
                        values: [2012, 2013]
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: measureColumn,
                        values: [200]
                    }])
                }
            };
            expect(DataViewAnalysis.supports(dataView, powerbi.visuals.treemapCapabilities.dataViewMappings[0], true)).toBe(false);
        });
        it('Capabilities should only allow one measure if there are group and detail', function () {
            var allowedProjections = {
                'Group': [{ queryRef: '0' }],
                'Details': [{ queryRef: '1' }],
                'Values': [{ queryRef: '2' }]
            };
            var disallowedProjections1 = {
                'Group': [{ queryRef: '0' }],
                'Details': [{ queryRef: '1' }],
                'Values': [
                    { queryRef: '2' },
                    { queryRef: '3' }
                ]
            };
            var disallowedProjections2 = {
                'Group': [{ queryRef: '0' }],
                'Details': [{ queryRef: '1' }],
                'Values': [
                    { queryRef: '2' },
                    { queryRef: '3' },
                    { queryRef: '4' }
                ]
            };
            var dataViewMappings = powerbi.visuals.treemapCapabilities.dataViewMappings;
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections, dataViewMappings)).toEqual(dataViewMappings);
            expect(DataViewAnalysis.chooseDataViewMappings(disallowedProjections1, dataViewMappings)).toBe(null);
            expect(DataViewAnalysis.chooseDataViewMappings(disallowedProjections2, dataViewMappings)).toBe(null);
        });
        it('Capabilities should only allow one measure if is a detail group', function () {
            var allowedProjections = {
                'Details': [{ queryRef: '1' }],
                'Values': [{ queryRef: '0' }]
            };
            var disallowedProjections = {
                'Details': [{ queryRef: '1' }],
                'Values': [
                    { queryRef: '2' },
                    { queryRef: '0' }
                ]
            };
            var dataViewMappings = powerbi.visuals.treemapCapabilities.dataViewMappings;
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections, dataViewMappings)).toEqual(dataViewMappings);
            expect(DataViewAnalysis.chooseDataViewMappings(disallowedProjections, dataViewMappings)).toBe(null);
        });
        it('Capabilities should allow multiple measures if there is no detail group', function () {
            var allowedProjections1 = {
                'Group': [{ queryRef: '2' }],
                'Values': [
                    { queryRef: '1' },
                    { queryRef: '0' }
                ]
            };
            var allowedProjections2 = {
                'Group': [{ queryRef: '1' }],
                'Values': [
                    { queryRef: '2' },
                    { queryRef: '0' },
                    { queryRef: '3' }
                ]
            };
            var allowedProjections3 = {
                'Group': [{ queryRef: '1' }],
                'Values': [{ queryRef: '0' }]
            };
            var allowedProjections4 = {
                'Values': [
                    { queryRef: '0' },
                    { queryRef: '1' }
                ]
            };
            var dataViewMappings = powerbi.visuals.treemapCapabilities.dataViewMappings;
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections1, dataViewMappings)).toEqual(dataViewMappings);
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections2, dataViewMappings)).toEqual(dataViewMappings);
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections3, dataViewMappings)).toEqual(dataViewMappings);
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections4, dataViewMappings)).toEqual(dataViewMappings);
        });
        it('Capabilities should not allow multiple category groups', function () {
            var disallowedProjections1 = {
                'Group': [
                    { queryRef: '0' },
                    { queryRef: '1' }
                ]
            };
            var disallowedProjections2 = {
                'Group': [
                    { queryRef: '0' },
                    { queryRef: '1' }
                ],
                'Values': [{ queryRef: '2' }]
            };
            var disallowedProjections3 = {
                'Group': [
                    { queryRef: '0' },
                    { queryRef: '1' }
                ],
                'Details': [{ queryRef: '2' }],
                'Values': [{ queryRef: '3' }]
            };
            var dataViewMappings = powerbi.visuals.treemapCapabilities.dataViewMappings;
            expect(DataViewAnalysis.chooseDataViewMappings(disallowedProjections1, dataViewMappings)).toBe(null);
            expect(DataViewAnalysis.chooseDataViewMappings(disallowedProjections2, dataViewMappings)).toBe(null);
            expect(DataViewAnalysis.chooseDataViewMappings(disallowedProjections3, dataViewMappings)).toBe(null);
        });
        it('Capabilities should not allow multiple detail groups', function () {
            var disallowedProjections1 = {
                'Details': [
                    { queryRef: '0' },
                    { queryRef: '1' }
                ]
            };
            var disallowedProjections2 = {
                'Details': [
                    { queryRef: '0' },
                    { queryRef: '1' }
                ],
                'Values': [{ queryRef: '2' }]
            };
            var disallowedProjections3 = {
                'Group': [{ queryRef: '0' }],
                'Details': [
                    { queryRef: '1' },
                    { queryRef: '2' }
                ],
                'Values': [{ queryRef: '3' }]
            };
            var dataViewMappings = powerbi.visuals.treemapCapabilities.dataViewMappings;
            expect(DataViewAnalysis.chooseDataViewMappings(disallowedProjections1, dataViewMappings)).toBe(null);
            expect(DataViewAnalysis.chooseDataViewMappings(disallowedProjections2, dataViewMappings)).toBe(null);
            expect(DataViewAnalysis.chooseDataViewMappings(disallowedProjections3, dataViewMappings)).toBe(null);
        });
        it('Capabilities should allow one category and/or one detail groups', function () {
            var allowedProjections1 = {
                'Group': [{ queryRef: '0' }]
            };
            var allowedProjections2 = {
                'Detail': [{ queryRef: '0' }]
            };
            var allowedProjections3 = {
                'Group': [{ queryRef: '0' }],
                'Detail': [{ queryRef: '1' }]
            };
            var allowedProjections4 = {
                'Values': [{ queryRef: '0' }]
            };
            var dataViewMappings = powerbi.visuals.treemapCapabilities.dataViewMappings;
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections1, dataViewMappings)).toEqual(dataViewMappings);
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections2, dataViewMappings)).toEqual(dataViewMappings);
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections3, dataViewMappings)).toEqual(dataViewMappings);
            expect(DataViewAnalysis.chooseDataViewMappings(allowedProjections4, dataViewMappings)).toEqual(dataViewMappings);
        });
    });
    describe("treemap data labels validation", function () {
        var v, element;
        beforeEach(function () {
            VisualHostServices.initialize(powerbi.common.createLocalizationService());
            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('treemap').create();
            v.init({
                element: element,
                host: powerbi.explore.services.createVisualHostServices(),
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true }
            });
        });
        it('labels should be visible by default', function (done) {
            var dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                powerbitests.mocks.dataViewScopeIdentity('The Nuthatches'),
                                powerbitests.mocks.dataViewScopeIdentity('Skylarks'),
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501'))
                            },
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201502'))
                            },
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201503'))
                            }
                        ])
                    }
                }]
            };
            dataChangedOptions.dataViews[0].categorical.values.source = dataViewMetadataCategorySeriesColumns.columns[1];
            v.onDataChanged(dataChangedOptions);
            setTimeout(function () {
                expect($('.treemap .labels .minorLabel').css('opacity')).toBe('1');
                expect($('.treemap .labels .majorLabel').css('opacity')).toBe('1');
                done();
            }, DefaultWaitForRender);
        });
        it('labels should be visible', function (done) {
            dataViewMetadataCategorySeriesColumns.objects = { labels: { show: true } };
            var dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                powerbitests.mocks.dataViewScopeIdentity('The Nuthatches'),
                                powerbitests.mocks.dataViewScopeIdentity('Skylarks'),
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501'))
                            },
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201502'))
                            },
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201503'))
                            }
                        ])
                    }
                }]
            };
            dataChangedOptions.dataViews[0].categorical.values.source = dataViewMetadataCategorySeriesColumns.columns[1];
            v.onDataChanged(dataChangedOptions);
            setTimeout(function () {
                expect($('.treemap .labels .minorLabel').css('opacity')).toBe('1');
                expect($('.treemap .labels .majorLabel').css('opacity')).toBe('1');
                done();
            }, DefaultWaitForRender);
        });
        it('labels should be hidden', function (done) {
            dataViewMetadataCategorySeriesColumns.objects = { labels: { show: false } };
            var dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                powerbitests.mocks.dataViewScopeIdentity('The Nuthatches'),
                                powerbitests.mocks.dataViewScopeIdentity('Skylarks'),
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501'))
                            },
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201502'))
                            },
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201503'))
                            }
                        ])
                    }
                }]
            };
            dataChangedOptions.dataViews[0].categorical.values.source = dataViewMetadataCategorySeriesColumns.columns[1];
            v.onDataChanged(dataChangedOptions);
            setTimeout(function () {
                expect($('.treemap .labels .minorLabel').css('opacity')).toBe('0');
                expect($('.treemap .labels .majorLabel').css('opacity')).toBe('0');
                done();
            }, DefaultWaitForRender);
        });
        it('labels color should changed from settings', function (done) {
            var colorRgb = 'rgb(120,110,100)';
            dataViewMetadataCategorySeriesColumns.objects = {
                labels: {
                    color: { solid: { color: colorRgb } },
                    show: true
                }
            };
            var dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                powerbitests.mocks.dataViewScopeIdentity('The Nuthatches'),
                                powerbitests.mocks.dataViewScopeIdentity('Skylarks'),
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501'))
                            },
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201502'))
                            },
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201503'))
                            }
                        ])
                    }
                }]
            };
            dataChangedOptions.dataViews[0].categorical.values.source = dataViewMetadataCategorySeriesColumns.columns[1];
            v.onDataChanged(dataChangedOptions);
            setTimeout(function () {
                var minorActualColor = $('.treemap .labels .minorLabel').css('fill').replace(/\ /g, "");
                var majorActualColor = $('.treemap .labels .majorLabel').css('fill').replace(/\ /g, "");
                //convert the actual color to rgb format if target browser returns hex format
                minorActualColor = (minorActualColor[0] === '#') ? jsCommon.color.rgbString(jsCommon.color.parseRgb(minorActualColor)) : minorActualColor;
                majorActualColor = (majorActualColor[0] === '#') ? jsCommon.color.rgbString(jsCommon.color.parseRgb(majorActualColor)) : majorActualColor;
                expect(minorActualColor).toBe(colorRgb);
                expect(majorActualColor).toBe(colorRgb);
                done();
            }, DefaultWaitForRender);
        });
    });
    describe("Enumerate Objects", function () {
        var v, element;
        beforeEach(function () {
            VisualHostServices.initialize(powerbi.common.createLocalizationService());
        });
        beforeEach(function () {
            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('treemap').create();
            v.init({
                element: element,
                host: powerbi.explore.services.createVisualHostServices(),
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true }
            });
        });
        it('Check basic enumeration', function (done) {
            var dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                powerbitests.mocks.dataViewScopeIdentity('The Nuthatches'),
                                powerbitests.mocks.dataViewScopeIdentity('Skylarks'),
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501'))
                            },
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201502'))
                            },
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201503'))
                            }
                        ])
                    }
                }]
            };
            dataChangedOptions.dataViews[0].categorical.values.source = dataViewMetadataCategorySeriesColumns.columns[1];
            v.onDataChanged(dataChangedOptions);
            setTimeout(function () {
                var points = v.enumerateObjectInstances({ objectName: 'dataPoint' });
                //length is 3 because of the default color instance
                expect(points.length).toBe(3);
                expect(points[1].displayName).toEqual('The Nuthatches');
                expect(points[1].properties['fill']).toBeDefined();
                expect(points[2].displayName).toEqual('Skylarks');
                expect(points[2].properties['fill']).toBeDefined();
                done();
            }, DefaultWaitForRender);
        });
    });
    function treemapDomValidation(hasLegendObject) {
        var v, element;
        if (hasLegendObject) {
            dataViewMetadataCategorySeriesColumns.objects = { legend: { show: true } };
        }
        else {
            dataViewMetadataCategorySeriesColumns.objects = undefined;
        }
        beforeEach(function () {
            VisualHostServices.initialize(powerbi.common.createLocalizationService());
        });
        beforeEach(function () {
            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('treemap').create();
            v.init({
                element: element,
                host: powerbi.explore.services.createVisualHostServices(),
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true }
            });
        });
        it('treemap categories and series dom validation', function (done) {
            var dataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                powerbitests.mocks.dataViewScopeIdentity('The Nuthatches'),
                                powerbitests.mocks.dataViewScopeIdentity('Skylarks'),
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501'))
                            },
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201502'))
                            },
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201503'))
                            }
                        ])
                    }
                }]
            };
            dataChangedOptions.dataViews[0].categorical.values.source = dataViewMetadataCategorySeriesColumns.columns[1];
            v.onDataChanged(dataChangedOptions);
            var renderLegend = dataViewMetadataCategorySeriesColumns.objects && dataViewMetadataCategorySeriesColumns.objects['legend'];
            setTimeout(function () {
                expect($('.treemap .shapes .rootNode').length).toBe(1);
                expect($('.treemap .shapes .parentGroup').length).toBe(2);
                expect($('.treemap .shapes .nodeGroup').length).toBe(6);
                expect($('.treemap .labels .majorLabel').length).toBe(2);
                expect($('.treemap .labels .majorLabel').last().text()).toBe('Skylarks');
                expect($('.treemap .labels .minorLabel').length).toBe(6);
                expect($('.treemap .labels .minorLabel').last().text()).toBe('201503');
                if (renderLegend) {
                    expect($('.legend .item').length).toBe(2);
                    expect($('.legend .item').first().text()).toBe('The Nuthatches');
                    expect($('.legend .title').text()).toBe('Squad');
                }
                done();
            }, DefaultWaitForRender);
        });
        it('treemap categories and series onDataChanged dom validation', function (done) {
            var initialDataViews = [{
                metadata: dataViewMetadataCategorySeriesColumns,
                categorical: {
                    categories: [{
                        source: dataViewMetadataCategorySeriesColumns.columns[0],
                        values: ['The Nuthatches', 'Skylarks'],
                        identity: [
                            powerbitests.mocks.dataViewScopeIdentity('a'),
                            powerbitests.mocks.dataViewScopeIdentity('b'),
                        ]
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataCategorySeriesColumns.columns[2],
                            values: [110, 120],
                            identity: powerbitests.mocks.dataViewScopeIdentity('201501')
                        },
                        {
                            source: dataViewMetadataCategorySeriesColumns.columns[3],
                            values: [210, 220],
                            identity: powerbitests.mocks.dataViewScopeIdentity('201502')
                        },
                        {
                            source: dataViewMetadataCategorySeriesColumns.columns[4],
                            values: [310, 320],
                            identity: powerbitests.mocks.dataViewScopeIdentity('201503')
                        }
                    ])
                }
            }];
            initialDataViews[0].categorical.values.source = dataViewMetadataCategorySeriesColumns.columns[1];
            var updatedMetadata = {
                columns: [
                    { name: 'Squad', properties: { "Category": true }, type: DataShapeUtility.describeDataType(2048 /* String */) },
                    { name: 'Period', properties: { "Series": true }, type: DataShapeUtility.describeDataType(1 /* Number */) },
                    { name: null, groupName: '201503', isMeasure: true, properties: { "Y": true }, type: DataShapeUtility.describeDataType(1 /* Number */) },
                    { name: null, groupName: '201504', isMeasure: true, properties: { "Y": true }, type: DataShapeUtility.describeDataType(1 /* Number */) }
                ]
            };
            var updatedDataViews = [{
                metadata: updatedMetadata,
                categorical: {
                    categories: [{
                        source: updatedMetadata.columns[0],
                        values: ['The Nuthatches', 'OddOneOut'],
                        identity: [
                            powerbitests.mocks.dataViewScopeIdentity('a'),
                            powerbitests.mocks.dataViewScopeIdentity('b'),
                        ]
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: updatedMetadata.columns[2],
                            values: [210, 220],
                            identity: powerbitests.mocks.dataViewScopeIdentity('201503')
                        },
                        {
                            source: updatedMetadata.columns[3],
                            values: [310, 320],
                            identity: powerbitests.mocks.dataViewScopeIdentity('201504')
                        }
                    ])
                }
            }];
            updatedDataViews[0].categorical.values.source = dataViewMetadataCategorySeriesColumns.columns[1];
            v.onDataChanged({ dataViews: initialDataViews });
            var renderLegend = dataViewMetadataCategorySeriesColumns.objects && dataViewMetadataCategorySeriesColumns.objects['legend'];
            setTimeout(function () {
                expect($('.treemap .shapes .rootNode').length).toBe(1);
                expect($('.treemap .shapes .parentGroup').length).toBe(2);
                expect($('.treemap .shapes .nodeGroup').length).toBe(6);
                expect($('.treemap .labels .majorLabel').length).toBe(2);
                expect($('.treemap .labels .majorLabel').last().text()).toBe('Skylarks');
                expect($('.treemap .labels .minorLabel').length).toBe(6);
                expect($('.treemap .labels .minorLabel').last().text()).toBe('201503');
                if (renderLegend) {
                    expect($('.legend .item').length).toBe(2);
                    expect($('.legend .item').first().text()).toBe('The Nuthatches');
                    expect($('.legend .item').last().text()).toBe('Skylarks');
                    expect($('.legend .title').text()).toBe('Squad');
                }
                v.onDataChanged({ dataViews: updatedDataViews });
                setTimeout(function () {
                    expect($('.treemap .shapes .rootNode').length).toBe(1);
                    expect($('.treemap .shapes .parentGroup').length).toBe(2);
                    expect($('.treemap .shapes .nodeGroup').length).toBe(4);
                    expect($('.treemap .labels .majorLabel').length).toBe(2);
                    expect($('.treemap .labels .majorLabel').last().text()).toBe('OddOneOut');
                    expect($('.treemap .labels .minorLabel').length).toBe(4);
                    expect($('.treemap .labels .minorLabel').last().text()).toBe('201504');
                    if (renderLegend) {
                        expect($('.legend .item').first().text()).toBe('The Nuthatches');
                        expect($('.legend .item').last().text()).toBe('OddOneOut');
                        expect($('.legend .title').text()).toBe('Squad');
                    }
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });
        it('treemap categories and series onResize from small to medium tile dom validation', function (done) {
            var onDataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                powerbitests.mocks.dataViewScopeIdentity('a'),
                                powerbitests.mocks.dataViewScopeIdentity('b'),
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                identity: powerbitests.mocks.dataViewScopeIdentity('201501')
                            },
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                identity: powerbitests.mocks.dataViewScopeIdentity('201502')
                            },
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                identity: powerbitests.mocks.dataViewScopeIdentity('201503')
                            }
                        ])
                    }
                }]
            };
            onDataChangedOptions.dataViews[0].categorical.values.source = dataViewMetadataCategorySeriesColumns.columns[1];
            v.onDataChanged(onDataChangedOptions);
            v.onResizing({
                height: 100,
                width: 200
            }, 0);
            setTimeout(function () {
                expect($('.treemap .shapes .rootNode').length).toBe(1);
                expect($('.treemap .shapes .parentGroup').length).toBe(2);
                expect($('.treemap .shapes .nodeGroup').length).toBe(6);
                expect($('.treemap .labels .majorLabel').length).toBe(2);
                expect($('.treemap .labels .minorLabel').length).toBe(4);
                v.onResizing({ height: 300, width: 300 }, 0);
                setTimeout(function () {
                    expect($('.treemap .shapes .rootNode').length).toBe(1);
                    expect($('.treemap .shapes .parentGroup').length).toBe(2);
                    expect($('.treemap .shapes .nodeGroup').length).toBe(6);
                    expect($('.treemap .labels .majorLabel').length).toBe(2);
                    expect($('.treemap .labels .minorLabel').length).toBe(6);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });
        it('treemap categories and measure dom validation', function (done) {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataCategoryColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategoryColumn.columns[0],
                            values: ['Drama', 'Comedy', 'Documentary'],
                            identity: [
                                powerbitests.mocks.dataViewScopeIdentity('a'),
                                powerbitests.mocks.dataViewScopeIdentity('b'),
                                powerbitests.mocks.dataViewScopeIdentity('c'),
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategoryColumn.columns[1],
                                values: [110, 120, 130]
                            }
                        ])
                    }
                }]
            });
            setTimeout(function () {
                expect($('.treemap .shapes .rootNode').length).toBe(1);
                expect($('.treemap .shapes .parentGroup').length).toBe(3);
                expect($('.treemap .shapes .nodeGroup').length).toBe(0);
                expect($('.treemap .labels .majorLabel').length).toBe(3);
                expect($('.treemap .labels .majorLabel').last().text()).toBe('Documentary');
                expect($('.treemap .labels .minorLabel').length).toBe(0);
                done();
            }, DefaultWaitForRender);
        });
        it('treemap categories and measure with highlights dom validation', function (done) {
            var categoryIdentities = [
                powerbitests.mocks.dataViewScopeIdentity("Drama"),
                powerbitests.mocks.dataViewScopeIdentity("Comedy"),
                powerbitests.mocks.dataViewScopeIdentity("Documentary"),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataCategoryColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategoryColumn.columns[0],
                            values: ['Drama', 'Comedy', 'Documentary'],
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategoryColumn.columns[1],
                                values: [110, 120, 130],
                                highlights: [60, 80, 20]
                            }
                        ])
                    }
                }]
            });
            setTimeout(function () {
                expect($('.treemap .shapes .rootNode').length).toBe(1);
                expect($('.treemap .shapes .parentGroup').length).toBe(6);
                expect($('.treemap .shapes .nodeGroup').length).toBe(0);
                expect($('.treemap .shapes .parentGroup.treemapNodeHighlight').length).toBe(3);
                expect($('.treemap .shapes .nodeGroup.treemapNodeHighlight').length).toBe(0);
                expect($('.treemap .labels .majorLabel').length).toBe(3);
                expect($('.treemap .labels .majorLabel').last().text()).toBe('Documentary');
                expect($('.treemap .labels .minorLabel').length).toBe(0);
                done();
            }, DefaultWaitForRender);
        });
        it('treemap categories and measure with overflowing highlights dom validation', function (done) {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataCategoryColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategoryColumn.columns[0],
                            values: ['Drama', 'Comedy', 'Documentary'],
                            identity: [
                                powerbitests.mocks.dataViewScopeIdentity('a'),
                                powerbitests.mocks.dataViewScopeIdentity('b'),
                                powerbitests.mocks.dataViewScopeIdentity('c'),
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategoryColumn.columns[1],
                                values: [110, 120, 130],
                                highlights: [140, 160, 135]
                            }
                        ])
                    }
                }]
            });
            setTimeout(function () {
                expect($('.treemap .shapes .rootNode').length).toBe(1);
                expect($('.treemap .shapes .parentGroup').length).toBe(3);
                expect($('.treemap .shapes .nodeGroup').length).toBe(0);
                expect($('.treemap .shapes .parentGroup.treemapNodeHighlight').length).toBe(0);
                expect($('.treemap .shapes .nodeGroup.treemapNodeHighlight').length).toBe(0);
                expect($('.treemap .labels .majorLabel').length).toBe(3);
                expect($('.treemap .labels .majorLabel').last().text()).toBe('Documentary');
                expect($('.treemap .labels .minorLabel').length).toBe(0);
                done();
            }, DefaultWaitForRender);
        });
        it('treemap categories and measures with highlights dom validation', function (done) {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataCategoryAndMeasures,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategoryAndMeasures.columns[0],
                            values: ['Front end', 'Back end'],
                            identity: [
                                powerbitests.mocks.dataViewScopeIdentity('f'),
                                powerbitests.mocks.dataViewScopeIdentity('b'),
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategoryAndMeasures.columns[1],
                                values: [110, 120],
                                highlights: [60, 60]
                            },
                            {
                                source: dataViewMetadataCategoryAndMeasures.columns[2],
                                values: [210, 220],
                                highlights: [140, 200]
                            }
                        ])
                    }
                }]
            });
            setTimeout(function () {
                expect($('.treemap .shapes .rootNode').length).toBe(1);
                expect($('.treemap .shapes .parentGroup').length).toBe(2);
                expect($('.treemap .shapes .nodeGroup').length).toBe(8);
                expect($('.treemap .shapes .parentGroup.treemapNodeHighlight').length).toBe(0);
                expect($('.treemap .shapes .nodeGroup.treemapNodeHighlight').length).toBe(4);
                expect($('.treemap .labels .majorLabel').length).toBe(2);
                expect($('.treemap .labels .majorLabel').last().text()).toBe('Back end');
                expect($('.treemap .labels .minorLabel').length).toBe(4);
                done();
            }, DefaultWaitForRender);
        });
        it('treemap categories and measure onDataChanged dom validation', function (done) {
            var initialDataViews = [{
                metadata: dataViewMetadataCategoryColumn,
                categorical: {
                    categories: [{
                        source: dataViewMetadataCategoryColumn.columns[0],
                        values: ['Drama', 'Comedy', 'Documentary'],
                        identity: [
                            powerbitests.mocks.dataViewScopeIdentity('a'),
                            powerbitests.mocks.dataViewScopeIdentity('b'),
                            powerbitests.mocks.dataViewScopeIdentity('c'),
                        ]
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataCategoryColumn.columns[1],
                            values: [110, 120, 130]
                        }
                    ])
                }
            }];
            var updatedDataViews = [{
                metadata: dataViewMetadataCategoryColumn,
                categorical: {
                    categories: [{
                        source: dataViewMetadataCategoryColumn.columns[0],
                        values: ['Comedy', 'Documentary'],
                        identity: [
                            powerbitests.mocks.dataViewScopeIdentity('b'),
                            powerbitests.mocks.dataViewScopeIdentity('c'),
                        ]
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataCategoryColumn.columns[1],
                            values: [120, 130]
                        }
                    ])
                }
            }];
            v.onDataChanged({ dataViews: initialDataViews });
            setTimeout(function () {
                expect($('.treemap .shapes .rootNode').length).toBe(1);
                expect($('.treemap .shapes .parentGroup').length).toBe(3);
                expect($('.treemap .shapes .nodeGroup').length).toBe(0);
                expect($('.treemap .labels .majorLabel').length).toBe(3);
                expect($('.treemap .labels .majorLabel').first().text()).toBe('Drama');
                expect($('.treemap .labels .minorLabel').length).toBe(0);
                v.onDataChanged({ dataViews: updatedDataViews });
                setTimeout(function () {
                    expect($('.treemap .shapes .rootNode').length).toBe(1);
                    expect($('.treemap .shapes .parentGroup').length).toBe(2);
                    expect($('.treemap .shapes .nodeGroup').length).toBe(0);
                    expect($('.treemap .labels .majorLabel').length).toBe(2);
                    expect($('.treemap .labels .majorLabel').first().text()).toBe('Comedy');
                    expect($('.treemap .labels .minorLabel').length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });
        it('treemap categories and measure onResize from small to medium tile dom validation', function (done) {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataCategoryColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategoryColumn.columns[0],
                            values: ['Drama', 'Comedy', 'Documentary'],
                            identity: [
                                powerbitests.mocks.dataViewScopeIdentity('a'),
                                powerbitests.mocks.dataViewScopeIdentity('b'),
                                powerbitests.mocks.dataViewScopeIdentity('c'),
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategoryColumn.columns[1],
                                values: [110, 120, 130]
                            }
                        ])
                    }
                }]
            });
            v.onResizing({
                height: 100,
                width: 200
            }, 0);
            setTimeout(function () {
                expect($('.treemap .shapes .rootNode').length).toBe(1);
                expect($('.treemap .shapes .parentGroup').length).toBe(3);
                expect($('.treemap .shapes .nodeGroup').length).toBe(0);
                expect($('.treemap .labels .majorLabel').length).toBe(3);
                expect($('.treemap .labels .minorLabel').length).toBe(0);
                v.onResizing({ height: 300, width: 300 }, 0);
                setTimeout(function () {
                    expect($('.treemap .shapes .rootNode').length).toBe(1);
                    expect($('.treemap .shapes .parentGroup').length).toBe(3);
                    expect($('.treemap .shapes .nodeGroup').length).toBe(0);
                    expect($('.treemap .labels .majorLabel').length).toBe(3);
                    expect($('.treemap .labels .minorLabel').length).toBe(0);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });
        it('treemap category and measure labeling validation', function (done) {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataCategoryColumnAndLongText,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategoryColumnAndLongText.columns[0],
                            values: ['Very very long value'],
                            identity: [
                                powerbitests.mocks.dataViewScopeIdentity('a'),
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategoryColumnAndLongText.columns[1],
                                values: [100]
                            },
                            {
                                source: dataViewMetadataCategoryColumnAndLongText.columns[2],
                                values: [100]
                            }
                        ])
                    }
                }]
            });
            v.onResizing({
                height: 12,
                width: 100
            }, 0);
            setTimeout(function () {
                expect($('.treemap .shapes .rootNode').length).toBe(1);
                expect($('.treemap .shapes .parentGroup').length).toBe(1);
                expect($('.treemap .shapes .nodeGroup').length).toBe(2);
                expect($('.treemap .labels .majorLabel').length).toBe(0);
                expect($('.treemap .labels .minorLabel').length).toBe(0);
                v.onResizing({ height: 24, width: 100 }, 0);
                setTimeout(function () {
                    expect($('.treemap .shapes .rootNode').length).toBe(1);
                    expect($('.treemap .shapes .parentGroup').length).toBe(1);
                    expect($('.treemap .shapes .nodeGroup').length).toBe(2);
                    expect($('.treemap .labels .majorLabel').length).toBe(1);
                    expect($('.treemap .labels .minorLabel').length).toBe(0);
                    expect($('.treemap .labels .majorLabel').first().text().length).toBeGreaterThan(0);
                    v.onResizing({ height: 32, width: 200 }, 0);
                    setTimeout(function () {
                        expect($('.treemap .shapes .rootNode').length).toBe(1);
                        expect($('.treemap .shapes .parentGroup').length).toBe(1);
                        expect($('.treemap .shapes .nodeGroup').length).toBe(2);
                        expect($('.treemap .labels .majorLabel').length).toBe(1);
                        expect($('.treemap .labels .minorLabel').length).toBe(0);
                        expect($('.treemap .labels .majorLabel').first().text().length).toBeGreaterThan(0);
                        v.onResizing({ height: 64, width: 200 }, 0);
                        setTimeout(function () {
                            expect($('.treemap .shapes .rootNode').length).toBe(1);
                            expect($('.treemap .shapes .parentGroup').length).toBe(1);
                            expect($('.treemap .shapes .nodeGroup').length).toBe(2);
                            expect($('.treemap .labels .majorLabel').length).toBe(1);
                            expect($('.treemap .labels .majorLabel').first().text().length).toBeGreaterThan(0);
                            expect($('.treemap .labels .minorLabel').length).toBe(2);
                            expect($('.treemap .labels .minorLabel').first().text().length).toBeGreaterThan(0);
                            expect($('.treemap .labels .minorLabel').last().text().length).toBeGreaterThan(0);
                            done();
                        }, DefaultWaitForRender);
                    }, DefaultWaitForRender);
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });
        if (hasLegendObject) {
            it('legend formatting', function (done) {
                var dataView = {
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                powerbitests.mocks.dataViewScopeIdentity('The Nuthatches'),
                                powerbitests.mocks.dataViewScopeIdentity('Skylarks'),
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501'))
                            },
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201502'))
                            },
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201503'))
                            }
                        ])
                    }
                };
                dataView.categorical.values.source = dataViewMetadataCategorySeriesColumns.columns[1];
                dataView.metadata.objects = { legend: { show: true } };
                v.onDataChanged({
                    dataViews: [dataView]
                });
                setTimeout(function () {
                    expect($('.legend.legendTopBottom')).toBeInDOM();
                    //change legend position
                    dataView.metadata.objects = { legend: { show: true, position: 'Right' } };
                    v.onDataChanged({
                        dataViews: [dataView]
                    });
                    setTimeout(function () {
                        expect($('.legend.legendLeftRight')).toBeInDOM();
                        //set title
                        var testTitle = 'Test Title';
                        dataView.metadata.objects = { legend: { show: true, position: 'Right', showTitle: true, titleText: testTitle } };
                        v.onDataChanged({
                            dataViews: [dataView]
                        });
                        setTimeout(function () {
                            expect($('.legend.legendLeftRight')).toBeInDOM();
                            expect($('.title').text()).toBe(testTitle);
                            //hide legend
                            dataView.metadata.objects = { legend: { show: false, position: 'Right' } };
                            v.onDataChanged({
                                dataViews: [dataView]
                            });
                            setTimeout(function () {
                                expect($('.legend')).not.toBeInDOM();
                                done();
                            }, DefaultWaitForRender);
                        }, DefaultWaitForRender);
                    }, DefaultWaitForRender);
                }, DefaultWaitForRender);
            });
        }
    }
    ;
    describe("Treemap DOM validation", function () { return treemapDomValidation(false); });
    describe("Treemap DOM validation - with legend", function () { return treemapDomValidation(true); });
    describe("treemap web animation", function () {
        var v, element;
        beforeEach(function () {
            VisualHostServices.initialize(powerbi.common.createLocalizationService());
        });
        beforeEach(function () {
            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.visualPluginFactory.createMinerva({
                heatMap: false,
                newTable: false
            }).getPlugin('treemap').create();
            v.init({
                element: element,
                host: powerbi.explore.services.createVisualHostServices(),
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true }
            });
        });
        it('treemap highlight animation', function (done) {
            var noHighlightsDataViews = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                powerbitests.mocks.dataViewScopeIdentity('The Nuthatches'),
                                powerbitests.mocks.dataViewScopeIdentity('Skylarks'),
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501'))
                            },
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201502'))
                            },
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201503'))
                            }
                        ])
                    }
                }]
            };
            noHighlightsDataViews.dataViews[0].categorical.values.source = dataViewMetadataCategorySeriesColumns.columns[1];
            var highlightsDataViewsA = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                powerbitests.mocks.dataViewScopeIdentity('The Nuthatches'),
                                powerbitests.mocks.dataViewScopeIdentity('Skylarks'),
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                highlights: [60, 70],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501'))
                            },
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                highlights: [160, 170],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201502'))
                            },
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                highlights: [260, 270],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201503'))
                            }
                        ])
                    }
                }]
            };
            highlightsDataViewsA.dataViews[0].categorical.values.source = dataViewMetadataCategorySeriesColumns.columns[1];
            var highlightsDataViewsB = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['The Nuthatches', 'Skylarks'],
                            identity: [
                                powerbitests.mocks.dataViewScopeIdentity('The Nuthatches'),
                                powerbitests.mocks.dataViewScopeIdentity('Skylarks'),
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                highlights: [20, 10],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201501'))
                            },
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                highlights: [120, 110],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201502'))
                            },
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                highlights: [220, 210],
                                identity: data.createDataViewScopeIdentity(SQExprBuilder.text('201503'))
                            }
                        ])
                    }
                }]
            };
            highlightsDataViewsB.dataViews[0].categorical.values.source = dataViewMetadataCategorySeriesColumns.columns[1];
            v.onDataChanged(noHighlightsDataViews);
            setTimeout(function () {
                var svgInit = $('.treemap');
                var initialHeight = svgInit.attr('height'), initialWidth = svgInit.attr('width');
                var animator = v.animator;
                spyOn(animator, 'animate').and.callThrough();
                v.onDataChanged(highlightsDataViewsA);
                v.onDataChanged(highlightsDataViewsB);
                v.onDataChanged(noHighlightsDataViews);
                expect(animator).toBeTruthy();
                expect(animator.animate).toHaveBeenCalled();
                setTimeout(function () {
                    var svg = $('.treemap');
                    expect(svg).toBeInDOM();
                    expect(svg.attr('height')).toBe(initialHeight);
                    expect(svg.attr('width')).toBe(initialWidth);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });
    });
    describe("treemap interactivity", function () {
        var v, element;
        var hostServices;
        var defaultOpacity = '';
        var dimmedOpacity = Treemap.DimmedShapeOpacity.toString();
        beforeEach(function () {
            VisualHostServices.initialize(powerbi.common.createLocalizationService());
        });
        beforeEach(function () {
            element = powerbitests.helpers.testDom('500', '500');
            hostServices = powerbitests.mocks.createVisualHostServices();
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('treemap').create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: { selection: true }
            });
        });
        it('treemap categories and series - single select', function (done) {
            var categoryIdentities = [
                powerbitests.mocks.dataViewScopeIdentity('a'),
                powerbitests.mocks.dataViewScopeIdentity('b'),
            ];
            var seriesIdentities = [
                powerbitests.mocks.dataViewScopeIdentity('201501'),
                powerbitests.mocks.dataViewScopeIdentity('201502'),
                powerbitests.mocks.dataViewScopeIdentity('201503'),
            ];
            var onDataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['A', 'B'],
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                identity: seriesIdentities[0]
                            },
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                identity: seriesIdentities[1]
                            },
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                identity: seriesIdentities[2]
                            }
                        ])
                    }
                }]
            };
            onDataChangedOptions.dataViews[0].categorical.values.source = dataViewMetadataCategorySeriesColumns.columns[1];
            v.onDataChanged(onDataChangedOptions);
            setTimeout(function () {
                var rootShape = $('.treemap .shapes .rootNode');
                var shapes = $('.treemap .shapes .parentGroup');
                var nestedShapes = $('.treemap .shapes .nodeGroup');
                spyOn(hostServices, 'onSelect').and.callThrough();
                // Select a major label
                $('.majorLabel').first().d3Click(0, 0);
                expect(rootShape[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[1].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[1].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[2].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[3].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[4].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[5].style.fillOpacity).toBe(dimmedOpacity);
                expect(hostServices.onSelect).toHaveBeenCalledWith({
                    data: [
                        {
                            data: [categoryIdentities[0]]
                        }
                    ]
                });
                $('.majorLabel').first().d3Click(0, 0);
                // Select the first nested shape
                $('.nodeGroup').first().d3Click(0, 0);
                expect(rootShape[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[1].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[1].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[2].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[3].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[4].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[5].style.fillOpacity).toBe(dimmedOpacity);
                expect(hostServices.onSelect).toHaveBeenCalledWith({
                    data: [
                        {
                            data: [categoryIdentities[0], seriesIdentities[0]]
                        }
                    ]
                });
                // Select the last minor label
                $('.minorLabel').last().d3Click(0, 0);
                expect(rootShape[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[1].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[0].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[1].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[2].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[3].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[4].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[5].style.fillOpacity).toBe(defaultOpacity);
                expect(hostServices.onSelect).toHaveBeenCalledWith({
                    data: [
                        {
                            data: [categoryIdentities[1], seriesIdentities[2]]
                        }
                    ]
                });
                $('.minorLabel').last().d3Click(0, 0);
                expect(rootShape[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[1].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[1].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[2].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[3].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[4].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[5].style.fillOpacity).toBe(defaultOpacity);
                expect(hostServices.onSelect).toHaveBeenCalledWith({ data: [] });
                done();
            }, DefaultWaitForRender);
        });
        it('treemap categories and measures - single click on category node (parent shape must be selectable)', function (done) {
            var identities = [
                powerbitests.mocks.dataViewScopeIdentity('f'),
                powerbitests.mocks.dataViewScopeIdentity('b'),
            ];
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataCategoryAndMeasures,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategoryAndMeasures.columns[0],
                            values: ['Front end', 'Back end'],
                            identity: identities
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategoryAndMeasures.columns[1],
                                values: [110, 120]
                            },
                            {
                                source: dataViewMetadataCategoryAndMeasures.columns[2],
                                values: [210, 220]
                            }
                        ])
                    }
                }]
            });
            setTimeout(function () {
                var rootShape = $('.treemap .shapes .rootNode');
                var shapes = $('.treemap .shapes .parentGroup');
                var nestedShapes = $('.treemap .shapes .nodeGroup');
                expect(shapes[0].style.fill).toBe(CssConstants.noneValue);
                expect(shapes[1].style.fill).toBe(CssConstants.noneValue);
                expect(nestedShapes[0].style.fill).not.toBe(CssConstants.noneValue);
                expect(nestedShapes[1].style.fill).not.toBe(CssConstants.noneValue);
                expect(nestedShapes[2].style.fill).not.toBe(CssConstants.noneValue);
                expect(nestedShapes[3].style.fill).not.toBe(CssConstants.noneValue);
                spyOn(hostServices, 'onSelect').and.callThrough();
                // Select the shape for the second category instance
                $('.parentGroup').last().d3Click(0, 0);
                expect(rootShape[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[1].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[0].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[1].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[2].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[3].style.fillOpacity).toBe(defaultOpacity);
                expect(hostServices.onSelect).toHaveBeenCalledWith({
                    data: [
                        {
                            data: [identities[1]]
                        }
                    ]
                });
                done();
            }, DefaultWaitForRender);
        });
        // Disabling due to changes in how we handle selection breaking the preservation of selection across data view changes.  Bug filed as #4904881
        /*it('treemap categories and series onDataChanged - single click on old and new shapes', (done) => {
            var categoryIdentities: powerbi.DataViewScopeIdentity[] = [
                mocks.dataViewScopeIdentity('a'),
                mocks.dataViewScopeIdentity('b'),
            ];

            var initialDataViews: DataView[] = [{
                metadata: dataViewMetadataCategorySeriesColumns,
                categorical: {
                    categories: [{
                        source: dataViewMetadataCategorySeriesColumns.columns[0],
                        values: ['A', 'B'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataCategorySeriesColumns.columns[2],
                            values: [110, 120],
                            identity: mocks.dataViewScopeIdentity('201501'),
                        }, {
                            source: dataViewMetadataCategorySeriesColumns.columns[3],
                            values: [210, 220],
                            identity: mocks.dataViewScopeIdentity('201502'),
                        }, {
                            source: dataViewMetadataCategorySeriesColumns.columns[4],
                            values: [310, 320],
                            identity: mocks.dataViewScopeIdentity('201503'),
                        }])
                }
            }];
            initialDataViews[0].categorical.values.source = dataViewMetadataCategorySeriesColumns.columns[1];
            var updatedMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { name: 'Squad', properties: { "Category": true }, type: DataShapeUtility.describeDataType(SemanticType.String) },
                    { name: 'Period', properties: { "Series": true }, type: DataShapeUtility.describeDataType(SemanticType.Number) },
                    { name: '201503', isMeasure: true, properties: { "Y": true }, type: DataShapeUtility.describeDataType(SemanticType.Number) },
                    { name: '201504', isMeasure: true, properties: { "Y": true }, type: DataShapeUtility.describeDataType(SemanticType.Number) }
                ]
            };
            var updatedDataViewsSeriesIdentities: powerbi.DataViewScopeIdentity[] = [
                mocks.dataViewScopeIdentity('201503'),
                mocks.dataViewScopeIdentity('201504'),
            ];
            var updatedDataViews: DataView[] = [{
                metadata: updatedMetadata,
                categorical: {
                    categories: [{
                        source: updatedMetadata.columns[0],
                        values: ['A', 'B'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: updatedMetadata.columns[2],
                            values: [210, 220],
                            identity: updatedDataViewsSeriesIdentities[0],
                        }, {
                            source: updatedMetadata.columns[3],
                            values: [310, 320],
                            identity: updatedDataViewsSeriesIdentities[1],
                        }])
                }
            }];
            updatedDataViews[0].categorical.values.source = dataViewMetadataCategorySeriesColumns.columns[1];

            v.onDataChanged({ dataViews: initialDataViews });

            setTimeout(() => {
                var rootShape = $('.treemap .shapes .rootNode');
                var shapes = $('.treemap .shapes .parentGroup');
                var nestedShapes = $('.treemap .shapes .nodeGroup');

                spyOn(hostServices, 'onSelect').and.callThrough();

                // Make a selection
                (<any>$('.majorLabel')).first().d3Click(0, 0);
                expect(rootShape[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[1].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[1].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[2].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[3].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[4].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[5].style.fillOpacity).toBe(dimmedOpacity);

                // Change data
                v.onDataChanged({ dataViews: updatedDataViews });
                setTimeout(() => {
                    shapes = $('.treemap .shapes .parentGroup');
                    nestedShapes = $('.treemap .shapes .nodeGroup');

                    expect(rootShape[0].style.fillOpacity).toBe(defaultOpacity);
                    expect(shapes[0].style.fillOpacity).toBe(defaultOpacity);
                    expect(shapes[1].style.fillOpacity).toBe(defaultOpacity);
                    expect(nestedShapes[0].style.fillOpacity).toBe(defaultOpacity);
                    expect(nestedShapes[1].style.fillOpacity).toBe(dimmedOpacity);
                    expect(nestedShapes[2].style.fillOpacity).toBe(defaultOpacity);
                    expect(nestedShapes[3].style.fillOpacity).toBe(dimmedOpacity);

                    // Select a new shape
                    (<any>$('.nodeGroup')).last().d3Click(0, 0);
                    expect(rootShape[0].style.fillOpacity).toBe(defaultOpacity);
                    expect(shapes[0].style.fillOpacity).toBe(defaultOpacity);
                    expect(shapes[1].style.fillOpacity).toBe(defaultOpacity);
                    expect(nestedShapes[0].style.fillOpacity).toBe(dimmedOpacity);
                    expect(nestedShapes[1].style.fillOpacity).toBe(defaultOpacity);
                    expect(nestedShapes[2].style.fillOpacity).toBe(dimmedOpacity);
                    expect(nestedShapes[3].style.fillOpacity).toBe(defaultOpacity);
                    expect(hostServices.onSelect).toHaveBeenCalledWith(
                        {
                            data: [categoryIdentities[1]]
                        });

                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        }); */
        it('treemap categories and series - selection across resize', function (done) {
            var categoryIdentities = [
                powerbitests.mocks.dataViewScopeIdentity('a'),
                powerbitests.mocks.dataViewScopeIdentity('b'),
            ];
            var seriesIdentities = [
                powerbitests.mocks.dataViewScopeIdentity('201501'),
                powerbitests.mocks.dataViewScopeIdentity('201502'),
                powerbitests.mocks.dataViewScopeIdentity('201503'),
            ];
            var onDataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['A', 'B'],
                            identity: categoryIdentities
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                identity: seriesIdentities[0]
                            },
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                identity: seriesIdentities[1]
                            },
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                identity: seriesIdentities[2]
                            }
                        ])
                    }
                }]
            };
            onDataChangedOptions.dataViews[0].categorical.values.source = dataViewMetadataCategorySeriesColumns.columns[1];
            v.onDataChanged(onDataChangedOptions);
            setTimeout(function () {
                var rootShape = $('.treemap .shapes .rootNode');
                var shapes = $('.treemap .shapes .parentGroup');
                var nestedShapes = $('.treemap .shapes .nodeGroup');
                spyOn(hostServices, 'onSelect').and.callThrough();
                // Select a major label
                $('.majorLabel').first().d3Click(0, 0);
                expect(rootShape[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[1].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[1].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[2].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[3].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[4].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[5].style.fillOpacity).toBe(dimmedOpacity);
                expect(hostServices.onSelect).toHaveBeenCalledWith({
                    data: [
                        {
                            data: [categoryIdentities[0]]
                        }
                    ]
                });
                v.onResizing({ width: 300, height: 300 }, 0);
                setTimeout(function () {
                    // Select a major label
                    expect(rootShape[0].style.fillOpacity).toBe(defaultOpacity);
                    expect(shapes[0].style.fillOpacity).toBe(defaultOpacity);
                    expect(shapes[1].style.fillOpacity).toBe(defaultOpacity);
                    expect(nestedShapes[0].style.fillOpacity).toBe(defaultOpacity);
                    expect(nestedShapes[1].style.fillOpacity).toBe(defaultOpacity);
                    expect(nestedShapes[2].style.fillOpacity).toBe(defaultOpacity);
                    expect(nestedShapes[3].style.fillOpacity).toBe(dimmedOpacity);
                    expect(nestedShapes[4].style.fillOpacity).toBe(dimmedOpacity);
                    expect(nestedShapes[5].style.fillOpacity).toBe(dimmedOpacity);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });
        it('treemap external clear selection ', function (done) {
            var categoryIdentities = [
                powerbitests.mocks.dataViewScopeIdentity('a'),
                powerbitests.mocks.dataViewScopeIdentity('b'),
            ];
            var seriesIdentities = [
                powerbitests.mocks.dataViewScopeIdentity('201501'),
                powerbitests.mocks.dataViewScopeIdentity('201502'),
                powerbitests.mocks.dataViewScopeIdentity('201503'),
            ];
            var onDataChangedOptions = {
                dataViews: [{
                    metadata: dataViewMetadataCategorySeriesColumns,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataCategorySeriesColumns.columns[0],
                            values: ['A', 'B'],
                            identity: [
                                categoryIdentities[0],
                                categoryIdentities[1],
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[2],
                                values: [110, 120],
                                identity: seriesIdentities[0]
                            },
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[3],
                                values: [210, 220],
                                identity: seriesIdentities[1]
                            },
                            {
                                source: dataViewMetadataCategorySeriesColumns.columns[4],
                                values: [310, 320],
                                identity: seriesIdentities[2]
                            }
                        ])
                    }
                }]
            };
            onDataChangedOptions.dataViews[0].categorical.values.source = dataViewMetadataCategorySeriesColumns.columns[1];
            v.onDataChanged(onDataChangedOptions);
            setTimeout(function () {
                var rootShape = $('.treemap .shapes .rootNode');
                var shapes = $('.treemap .shapes .parentGroup');
                var nestedShapes = $('.treemap .shapes .nodeGroup');
                spyOn(hostServices, 'onSelect').and.callThrough();
                $('.nodeGroup').first().d3Click(0, 0);
                expect(rootShape[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[1].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[1].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[2].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[3].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[4].style.fillOpacity).toBe(dimmedOpacity);
                expect(nestedShapes[5].style.fillOpacity).toBe(dimmedOpacity);
                expect(hostServices.onSelect).toHaveBeenCalledWith({
                    data: [
                        {
                            data: [categoryIdentities[0], seriesIdentities[0]]
                        }
                    ]
                });
                v.onClearSelection();
                expect(rootShape[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(shapes[1].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[0].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[1].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[2].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[3].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[4].style.fillOpacity).toBe(defaultOpacity);
                expect(nestedShapes[5].style.fillOpacity).toBe(defaultOpacity);
                done();
            }, DefaultWaitForRender);
        });
    });
    describe("treemap converter validation", function () {
        beforeEach(function () {
            VisualHostServices.initialize(powerbi.common.createLocalizationService());
        });
        it('treemap dataView multi measure', function () {
            var metadata = {
                columns: [
                    { name: 'EventCount', isMeasure: true, properties: { "Y": true }, type: DataShapeUtility.describeDataType(1 /* Number */) },
                    { name: 'MedalCount', isMeasure: true, properties: { "Y": true }, type: DataShapeUtility.describeDataType(1 /* Number */) }
                ]
            };
            var dataView = {
                metadata: metadata,
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: metadata.columns[0],
                            values: [110]
                        },
                        {
                            source: metadata.columns[1],
                            values: [210]
                        }
                    ])
                }
            };
            var dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;
            var treeMapData = Treemap.converter(dataView, colors, dataLabelSettings, null);
            var rootNode = treeMapData.root;
            var selectionIds = [
                SelectionId.createWithMeasure("EventCount"),
                SelectionId.createWithMeasure("MedalCount"),
            ];
            var nodes = rootNode.children;
            expect(nodes.length).toBe(2);
            expect(nodes[0].name).toBe('EventCount');
            expect(nodes[0].size).toBe(110);
            expect(nodes[0].children).not.toBeDefined();
            expect(nodes[0].key).toBe(selectionIds[0].getKey());
            expect(nodes[1].name).toBe('MedalCount');
            expect(nodes[1].size).toBe(210);
            expect(nodes[1].children).not.toBeDefined();
            expect(nodes[1].key).toBe(selectionIds[1].getKey());
            var shapeColors = nodes.map(function (n) { return n.color; });
            expect(shapeColors).toEqual(ArrayExtensions.distinct(shapeColors));
            // Legend
            expect(treeMapData.legendData.title).toBe('');
            expect(treeMapData.legendData.dataPoints[0].label).toBe('EventCount');
        });
        it('treemap dataView multi measure with null values', function () {
            var metadata = {
                columns: [
                    { name: 'EventCount', isMeasure: true, properties: { "Y": true }, type: DataShapeUtility.describeDataType(1 /* Number */) },
                    { name: 'MedalCount', isMeasure: true, properties: { "Y": true }, type: DataShapeUtility.describeDataType(1 /* Number */) }
                ]
            };
            var dataView = {
                metadata: metadata,
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: metadata.columns[0],
                            values: [110]
                        },
                        {
                            source: metadata.columns[1],
                            values: [null]
                        }
                    ])
                }
            };
            var dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;
            var treeMapData = Treemap.converter(dataView, colors, dataLabelSettings, null);
            var rootNode = treeMapData.root;
            var selectionIds = [
                SelectionId.createWithMeasure("EventCount"),
                SelectionId.createWithMeasure("MedalCount"),
            ];
            var nodes = rootNode.children;
            expect(nodes.length).toBe(1);
            expect(nodes[0].name).toBe('EventCount');
            expect(nodes[0].size).toBe(110);
            expect(nodes[0].children).not.toBeDefined();
            expect(nodes[0].key).toBe(selectionIds[0].getKey());
            // Legend
            expect(treeMapData.legendData.title).toBe('');
            expect(treeMapData.legendData.dataPoints[0].label).toBe('EventCount');
        });
        it('treemap dataView multi category multi measure', function () {
            var metadata = {
                columns: [
                    { name: 'Continent', queryName: 'select0', properties: { "Category": true }, type: DataShapeUtility.describeDataType(2048 /* String */) },
                    { name: 'EventCount', queryName: 'select1', isMeasure: true, properties: { "Y": true }, type: DataShapeUtility.describeDataType(1 /* Number */) },
                    { name: 'MedalCount', queryName: 'select2', isMeasure: true, properties: { "Y": true }, type: DataShapeUtility.describeDataType(1 /* Number */) }
                ]
            };
            var categoryIdentities = [
                powerbitests.mocks.dataViewScopeIdentity('a'),
                powerbitests.mocks.dataViewScopeIdentity('b'),
                powerbitests.mocks.dataViewScopeIdentity('c'),
                powerbitests.mocks.dataViewScopeIdentity('d'),
                powerbitests.mocks.dataViewScopeIdentity('e'),
            ];
            var dataView = {
                metadata: metadata,
                categorical: {
                    categories: [{
                        source: metadata.columns[0],
                        values: ['Africa', 'Asia', 'Australia', 'Europe', 'North America'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: metadata.columns[1],
                            values: [110, 120, 130, 140, 150]
                        },
                        {
                            source: metadata.columns[2],
                            values: [210, 220, 230, 240, 250]
                        }
                    ])
                }
            };
            var dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;
            var treeMapData = Treemap.converter(dataView, colors, dataLabelSettings, null);
            var rootNode = treeMapData.root;
            var selectionIds = categoryIdentities.map(function (categoryId) { return SelectionId.createWithId(categoryId); });
            var nodes = rootNode.children;
            expect(nodes.length).toBe(5);
            var node = nodes[0];
            expect(node.name).toBe('Africa');
            expect(node.size).toBe(320);
            expect(node.children).toBeDefined();
            expect(node.children.length).toBe(2);
            expect(node.key).toBe(selectionIds[0].getKey());
            node = nodes[1];
            expect(node.name).toBe('Asia');
            expect(node.size).toBe(340);
            expect(node.children).toBeDefined();
            expect(node.children.length).toBe(2);
            expect(node.key).toBe(selectionIds[1].getKey());
            node = nodes[2];
            expect(node.name).toBe('Australia');
            expect(node.size).toBe(360);
            expect(node.children).toBeDefined();
            expect(node.children.length).toBe(2);
            expect(node.key).toBe(selectionIds[2].getKey());
            node = nodes[3];
            expect(node.name).toBe('Europe');
            expect(node.size).toBe(380);
            expect(node.children).toBeDefined();
            expect(node.children.length).toBe(2);
            expect(node.key).toBe(selectionIds[3].getKey());
            node = nodes[4];
            expect(node.name).toBe('North America');
            expect(node.size).toBe(400);
            expect(node.children).toBeDefined();
            expect(node.children.length).toBe(2);
            expect(node.key).toBe(selectionIds[4].getKey());
            var childIds = [
                SelectionId.createWithIdAndMeasure(categoryIdentities[4], 'select1'),
                SelectionId.createWithIdAndMeasure(categoryIdentities[4], 'select2'),
            ];
            var childNode = node.children[0];
            expect(childNode.name).toBe('EventCount');
            expect(childNode.size).toBe(150);
            expect(childNode.children).not.toBeDefined();
            expect(childNode.key).toBe(childIds[0].getKey());
            expect(childNode.color).toBe(node.color);
            childNode = node.children[1];
            expect(childNode.name).toBe('MedalCount');
            expect(childNode.size).toBe(250);
            expect(childNode.children).not.toBeDefined();
            expect(childNode.key).toBe(childIds[1].getKey());
            expect(childNode.color).toBe(node.color);
            var shapeColors = nodes.map(function (n) { return n.color; });
            expect(shapeColors).toEqual(ArrayExtensions.distinct(shapeColors));
            // Legend
            expect(treeMapData.legendData.title).toBe('Continent');
            expect(treeMapData.legendData.dataPoints[0].label).toBe('Africa');
        });
        it('treemap dataView multi series one measure', function () {
            var metadata = {
                columns: [
                    { name: 'Year', properties: { "Series": true }, type: DataShapeUtility.describeDataType(2048 /* String */) },
                    { name: 'MedalCount', isMeasure: true, properties: { "Y": true }, type: DataShapeUtility.describeDataType(1 /* Number */) }
                ]
            };
            var categoryIdentities = [
                powerbitests.mocks.dataViewScopeIdentity('a'),
                powerbitests.mocks.dataViewScopeIdentity('b'),
                powerbitests.mocks.dataViewScopeIdentity('c'),
            ];
            var dataView = {
                metadata: metadata,
                categorical: {
                    categories: [{
                        source: metadata.columns[0],
                        values: ['2004', '2008', '2012'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: metadata.columns[1],
                            values: [110, 120, 130]
                        }
                    ])
                }
            };
            var dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;
            var treeMapData = Treemap.converter(dataView, colors, dataLabelSettings, null);
            var rootNode = treeMapData.root;
            var selectionIds = [
                SelectionId.createWithId(categoryIdentities[0]),
                SelectionId.createWithId(categoryIdentities[2]),
            ];
            var nodes = rootNode.children;
            expect(nodes.length).toBe(3);
            expect(nodes[0].name).toBe('2004');
            expect(nodes[0].size).toBe(110);
            expect(nodes[0].children).not.toBeDefined();
            expect(nodes[0].key).toBe(selectionIds[0].getKey());
            expect(nodes[2].name).toBe('2012');
            expect(nodes[2].size).toBe(130);
            expect(nodes[2].children).not.toBeDefined();
            expect(nodes[2].key).toBe(selectionIds[1].getKey());
            var shapeColors = nodes.map(function (n) { return n.color; });
            expect(shapeColors).toEqual(ArrayExtensions.distinct(shapeColors));
            // Legend
            expect(treeMapData.legendData.title).toBe('Year');
            expect(treeMapData.legendData.dataPoints[0].label).toBe('2004');
        });
        it('treemap dataView multi category/series', function () {
            var metadata = {
                columns: [
                    { name: 'Continent', properties: { "Category": true }, type: DataShapeUtility.describeDataType(2048 /* String */) },
                    { name: 'Year', properties: { "Series": true }, type: DataShapeUtility.describeDataType(1 /* Number */) },
                    { name: null, groupName: '2004', isMeasure: true, properties: { "Y": true }, type: DataShapeUtility.describeDataType(1 /* Number */) },
                    { name: null, groupName: '2008', isMeasure: true, properties: { "Y": true }, type: DataShapeUtility.describeDataType(1 /* Number */) },
                    { name: null, groupName: '2012', isMeasure: true, properties: { "Y": true }, type: DataShapeUtility.describeDataType(1 /* Number */) }
                ]
            };
            var categoryIdentities = [
                powerbitests.mocks.dataViewScopeIdentity('a'),
                powerbitests.mocks.dataViewScopeIdentity('b'),
                powerbitests.mocks.dataViewScopeIdentity('c'),
                powerbitests.mocks.dataViewScopeIdentity('d'),
                powerbitests.mocks.dataViewScopeIdentity('e'),
            ];
            var seriesIdentities = [
                powerbitests.mocks.dataViewScopeIdentity(2004),
                powerbitests.mocks.dataViewScopeIdentity(2008),
                powerbitests.mocks.dataViewScopeIdentity(2012),
            ];
            var dataView = {
                metadata: metadata,
                categorical: {
                    categories: [{
                        source: metadata.columns[0],
                        values: ['Africa', 'Asia', 'Australia', 'Europe', 'North America'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: metadata.columns[2],
                            values: [110, 120, 130, 140, 150],
                            identity: seriesIdentities[0]
                        },
                        {
                            source: metadata.columns[3],
                            values: [210, 220, 230, 240, 250],
                            identity: seriesIdentities[1]
                        },
                        {
                            source: metadata.columns[4],
                            values: [310, 320, 330, 340, 350],
                            identity: seriesIdentities[2]
                        }
                    ])
                }
            };
            dataView.categorical.values.source = metadata.columns[1];
            var dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;
            var treeMapData = Treemap.converter(dataView, colors, dataLabelSettings, null);
            var rootNode = treeMapData.root;
            var selectionIds = [
                SelectionId.createWithId(categoryIdentities[0]),
                SelectionId.createWithId(categoryIdentities[4]),
                SelectionId.createWithIds(categoryIdentities[4], seriesIdentities[2]),
            ];
            var nodes = rootNode.children;
            expect(nodes.length).toBe(5);
            expect(nodes[0].name).toBe('Africa');
            expect(nodes[0].size).toBe(630);
            expect(nodes[0].children).toBeDefined();
            expect(nodes[0].children.length).toBe(3);
            expect(nodes[0].key).toBe(selectionIds[0].getKey());
            var lastNode = nodes[4];
            expect(lastNode.name).toBe('North America');
            expect(lastNode.size).toBe(750);
            expect(lastNode.children).toBeDefined();
            expect(lastNode.children.length).toBe(3);
            expect(lastNode.key).toBe(selectionIds[1].getKey());
            var childNodes = lastNode.children;
            expect(childNodes[2].name).toBe('2012');
            expect(childNodes[2].size).toBe(350);
            expect(childNodes[2].children).not.toBeDefined();
            expect(childNodes[2].key).toBe(selectionIds[2].getKey());
            childNodes.forEach(function (n) { return expect(n.color).toBe(lastNode.color); });
            var shapeColors = nodes.map(function (n) { return n.color; });
            expect(shapeColors).toEqual(ArrayExtensions.distinct(shapeColors));
            // Legend
            expect(treeMapData.legendData.title).toBe('Continent');
            expect(treeMapData.legendData.dataPoints[0].label).toBe('Africa');
        });
        it('treemap dataView multi category/series with null values', function () {
            var metadata = {
                columns: [
                    { name: 'Continent', properties: { "Category": true }, type: DataShapeUtility.describeDataType(2048 /* String */) },
                    { name: 'Year', properties: { "Series": true }, type: DataShapeUtility.describeDataType(1 /* Number */) },
                    { name: null, groupName: '2004', isMeasure: true, properties: { "Y": true }, type: DataShapeUtility.describeDataType(1 /* Number */) },
                    { name: null, groupName: '2008', isMeasure: true, properties: { "Y": true }, type: DataShapeUtility.describeDataType(1 /* Number */) },
                    { name: null, groupName: '2012', isMeasure: true, properties: { "Y": true }, type: DataShapeUtility.describeDataType(1 /* Number */) }
                ]
            };
            var categoryIdentities = [
                powerbitests.mocks.dataViewScopeIdentity(null),
                powerbitests.mocks.dataViewScopeIdentity('b'),
                powerbitests.mocks.dataViewScopeIdentity('c'),
                powerbitests.mocks.dataViewScopeIdentity('d'),
                powerbitests.mocks.dataViewScopeIdentity('e'),
            ];
            var seriesIdentities = [
                powerbitests.mocks.dataViewScopeIdentity(2004),
                powerbitests.mocks.dataViewScopeIdentity(2008),
                powerbitests.mocks.dataViewScopeIdentity(2012),
            ];
            var dataView = {
                metadata: metadata,
                categorical: {
                    categories: [{
                        source: metadata.columns[0],
                        values: [null, 'Asia', 'Australia', 'Europe', 'North America'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: metadata.columns[2],
                            values: [null, 120, 130, 140, null],
                            identity: seriesIdentities[0]
                        },
                        {
                            source: metadata.columns[3],
                            values: [210, 220, null, 240, null],
                            identity: seriesIdentities[1]
                        },
                        {
                            source: metadata.columns[4],
                            values: [null, 320, 330, 340, null],
                            identity: seriesIdentities[2]
                        }
                    ])
                }
            };
            var dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;
            var treeMapData = Treemap.converter(dataView, colors, dataLabelSettings, null);
            var rootNode = treeMapData.root;
            var nodes = rootNode.children;
            expect(nodes.length).toBe(4);
            expect(nodes[0].name).toBe(null);
            expect(nodes[0].size).toBe(210);
            expect(nodes[0].children).toBeDefined();
            expect(nodes[0].children.length).toBe(1);
            expect(nodes[0].key).toBe(SelectionId.createWithId(categoryIdentities[0]).getKey());
            var shapeColors = nodes.map(function (n) { return n.color; });
            expect(shapeColors).toEqual(ArrayExtensions.distinct(shapeColors));
            // Legend
            expect(treeMapData.legendData.title).toBe('Continent');
            expect(treeMapData.legendData.dataPoints[0].label).toBe(null);
            expect(treeMapData.legendData.dataPoints[1].label).toBe('Asia');
        });
        it('treemap dataView multi category/series with null values tooltip data test', function () {
            var metadata = {
                columns: [
                    { name: 'Continent', properties: { "Category": true }, type: DataShapeUtility.describeDataType(2048 /* String */) },
                    { name: 'Year', properties: { "Series": true }, type: DataShapeUtility.describeDataType(1 /* Number */) },
                    { name: null, groupName: '2004', isMeasure: true, properties: { "Y": true }, type: DataShapeUtility.describeDataType(1 /* Number */) },
                    { name: null, groupName: '2008', isMeasure: true, properties: { "Y": true }, type: DataShapeUtility.describeDataType(1 /* Number */) },
                    { name: null, groupName: '2012', isMeasure: true, properties: { "Y": true }, type: DataShapeUtility.describeDataType(1 /* Number */) }
                ]
            };
            var categoryIdentities = [
                powerbitests.mocks.dataViewScopeIdentity(null),
                powerbitests.mocks.dataViewScopeIdentity('b'),
                powerbitests.mocks.dataViewScopeIdentity('c'),
                powerbitests.mocks.dataViewScopeIdentity('d'),
                powerbitests.mocks.dataViewScopeIdentity('e'),
            ];
            var seriesIdentities = [
                powerbitests.mocks.dataViewScopeIdentity(2004),
                powerbitests.mocks.dataViewScopeIdentity(2008),
                powerbitests.mocks.dataViewScopeIdentity(2012),
            ];
            var dataView = {
                metadata: metadata,
                categorical: {
                    categories: [{
                        source: metadata.columns[0],
                        values: [null, 'Asia', 'Australia', 'Europe', 'North America'],
                        identity: categoryIdentities
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: metadata.columns[2],
                            values: [null, 120, 130, 140, null],
                            identity: seriesIdentities[0]
                        },
                        {
                            source: metadata.columns[3],
                            values: [210, 220, null, 240, null],
                            identity: seriesIdentities[1]
                        },
                        {
                            source: metadata.columns[4],
                            values: [null, 320, 330, 340, null],
                            identity: seriesIdentities[2]
                        }
                    ])
                }
            };
            var dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;
            var rootNode = Treemap.converter(dataView, colors, dataLabelSettings, null).root;
            var node1 = rootNode.children[0];
            var node11 = rootNode.children[0].children[0];
            var node2 = rootNode.children[1];
            var node3 = rootNode.children[2];
            var node4 = rootNode.children[3];
            expect(node1.tooltipInfo).toEqual([{ displayName: "Continent", value: "(Blank)" }]);
            expect(node11.tooltipInfo).toEqual([{ displayName: "Continent", value: "(Blank)" }, { displayName: null, value: "210" }]);
            expect(node2.tooltipInfo).toEqual([{ displayName: "Continent", value: "Asia" }, { displayName: null, value: "120" }]);
            expect(node3.tooltipInfo).toEqual([{ displayName: "Continent", value: "Australia" }, { displayName: null, value: "130" }]);
            expect(node4.tooltipInfo).toEqual([{ displayName: "Continent", value: "Europe" }, { displayName: null, value: "140" }]);
        });
        it('treemap non-categorical multi-measure tooltip values test', function () {
            var dataViewMetadata = {
                columns: [
                    { name: 'a', isMeasure: true },
                    { name: 'b', isMeasure: true },
                    { name: 'c', isMeasure: true }
                ]
            };
            var dataView = {
                metadata: dataViewMetadata,
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadata.columns[0],
                            values: [1]
                        },
                        {
                            source: dataViewMetadata.columns[1],
                            values: [2]
                        },
                        {
                            source: dataViewMetadata.columns[2],
                            values: [3]
                        }
                    ])
                }
            };
            var dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;
            var rootNode = Treemap.converter(dataView, colors, dataLabelSettings, null).root;
            var node1 = rootNode.children[0];
            var node2 = rootNode.children[1];
            var node3 = rootNode.children[2];
            expect(node1.tooltipInfo).toEqual([{ displayName: 'a', value: '1' }]);
            expect(node2.tooltipInfo).toEqual([{ displayName: 'b', value: '2' }]);
            expect(node3.tooltipInfo).toEqual([{ displayName: 'c', value: '3' }]);
        });
        it('treemap dataView multi measure', function () {
            var metadata = {
                columns: [
                    { name: 'EventCount', queryName: 'select1', isMeasure: true, properties: { "Y": true }, type: DataShapeUtility.describeDataType(1 /* Number */) },
                    { name: 'MedalCount', queryName: 'select2', isMeasure: true, properties: { "Y": true }, type: DataShapeUtility.describeDataType(1 /* Number */) }
                ]
            };
            var dataView = {
                metadata: metadata,
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: metadata.columns[0],
                            values: [110]
                        },
                        {
                            source: metadata.columns[1],
                            values: [210]
                        }
                    ])
                }
            };
            var dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;
            var treeMapData = Treemap.converter(dataView, colors, dataLabelSettings, null);
            var rootNode = treeMapData.root;
            var selectionIds = metadata.columns.map(function (measure) { return SelectionId.createWithMeasure(measure.name); });
            var nodes = rootNode.children;
            expect(nodes.length).toBe(2);
            var node = nodes[0];
            expect(node.name).toBe('EventCount');
            expect(node.size).toBe(110);
            expect(node.children).not.toBeDefined();
            expect(node.key).toBe(selectionIds[0].getKey());
            node = nodes[1];
            expect(node.name).toBe('MedalCount');
            expect(node.size).toBe(210);
            expect(node.children).not.toBeDefined();
            expect(node.key).toBe(selectionIds[1].getKey());
            var shapeColors = nodes.map(function (n) { return n.color; });
            expect(shapeColors).toEqual(ArrayExtensions.distinct(shapeColors));
            // Legend
            expect(treeMapData.legendData.title).toBe('');
            expect(treeMapData.legendData.dataPoints[0].label).toBe('EventCount');
            expect(treeMapData.legendData.dataPoints[1].label).toBe('MedalCount');
        });
        it('treemap dataView single measure', function () {
            var metadata = {
                columns: [
                    { name: 'EventCount', queryName: 'select1', isMeasure: true, properties: { "Y": true }, type: DataShapeUtility.describeDataType(1 /* Number */) }
                ]
            };
            var dataView = {
                metadata: metadata,
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: metadata.columns[0],
                            values: [110]
                        }
                    ])
                }
            };
            var dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;
            var treeMapData = Treemap.converter(dataView, colors, dataLabelSettings, null);
            var rootNode = treeMapData.root;
            var selectionIds = metadata.columns.map(function (measure) { return SelectionId.createWithMeasure(measure.name); });
            var nodes = rootNode.children;
            expect(nodes.length).toBe(1);
            var node = nodes[0];
            expect(node.name).toBe('EventCount');
            expect(node.size).toBe(110);
            expect(node.children).not.toBeDefined();
            expect(node.key).toBe(selectionIds[0].getKey());
            var shapeColors = nodes.map(function (n) { return n.color; });
            expect(shapeColors).toEqual(ArrayExtensions.distinct(shapeColors));
            // Legend
            expect(treeMapData.legendData.title).toBe('');
            expect(treeMapData.legendData.dataPoints[0].label).toBe('EventCount');
        });
        it("treemap categories and measures with highlights tooltip data test", function () {
            var dataView = {
                metadata: dataViewMetadataCategoryAndMeasures,
                categorical: {
                    categories: [{
                        source: dataViewMetadataCategoryAndMeasures.columns[0],
                        values: ['Front end', 'Back end'],
                        identity: [
                            powerbitests.mocks.dataViewScopeIdentity('f'),
                            powerbitests.mocks.dataViewScopeIdentity('b'),
                        ]
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataCategoryAndMeasures.columns[1],
                            values: [110, 120],
                            highlights: [60, 60]
                        },
                        {
                            source: dataViewMetadataCategoryAndMeasures.columns[2],
                            values: [210, 220],
                            highlights: [140, 200]
                        }
                    ])
                }
            };
            var dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;
            var rootNode = Treemap.converter(dataView, colors, dataLabelSettings, null).root;
            var node1 = rootNode.children[0].children[0];
            var node2 = rootNode.children[0].children[1];
            var node3 = rootNode.children[1].children[0];
            var node4 = rootNode.children[1].children[1];
            expect(node1.tooltipInfo).toEqual([{ displayName: "Area", value: "Front end" }, { displayName: "BugsFiled", value: "110" }]);
            expect(node1.highlightedTooltipInfo).toEqual([{ displayName: "Area", value: "Front end" }, { displayName: "BugsFiled", value: "110" }, { displayName: powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName, value: "60" }]);
            expect(node2.tooltipInfo).toEqual([{ displayName: "Area", value: "Front end" }, { displayName: "BugsFixed", value: "210" }]);
            expect(node2.highlightedTooltipInfo).toEqual([{ displayName: "Area", value: "Front end" }, { displayName: "BugsFixed", value: "210" }, { displayName: powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName, value: "140" }]);
            expect(node3.tooltipInfo).toEqual([{ displayName: "Area", value: "Back end" }, { displayName: "BugsFiled", value: "120" }]);
            expect(node3.highlightedTooltipInfo).toEqual([{ displayName: "Area", value: "Back end" }, { displayName: "BugsFiled", value: "120" }, { displayName: powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName, value: "60" }]);
            expect(node4.tooltipInfo).toEqual([{ displayName: "Area", value: "Back end" }, { displayName: "BugsFixed", value: "220" }]);
            expect(node4.highlightedTooltipInfo).toEqual([{ displayName: "Area", value: "Back end" }, { displayName: "BugsFixed", value: "220" }, { displayName: powerbi.visuals.ToolTipComponent.localizationOptions.highlightedValueDisplayName, value: "200" }]);
        });
        it("treemap categories and measures default color test", function () {
            var dataView = {
                metadata: dataViewMetadataCategoryAndMeasures,
                categorical: {
                    categories: [{
                        source: dataViewMetadataCategoryAndMeasures.columns[0],
                        values: ['Front end', 'Back end'],
                        identity: [
                            powerbitests.mocks.dataViewScopeIdentity('f'),
                            powerbitests.mocks.dataViewScopeIdentity('b'),
                        ]
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataCategoryAndMeasures.columns[1],
                            values: [110, 120],
                            highlights: [60, 60]
                        },
                        {
                            source: dataViewMetadataCategoryAndMeasures.columns[2],
                            values: [210, 220],
                            highlights: [140, 200]
                        }
                    ])
                }
            };
            var dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;
            var hexDefaultColorRed = "#FF0000";
            var rootNode = Treemap.converter(dataView, colors, dataLabelSettings, null, hexDefaultColorRed).root;
            var node1 = rootNode.children[0];
            var node2 = rootNode.children[1];
            expect(node1.color).toEqual(hexDefaultColorRed);
            expect(node2.color).toEqual(hexDefaultColorRed);
        });
        it("treemap categories and measures default color and formatted color test", function () {
            var hexGreen = "#00FF00";
            var dataView = {
                metadata: dataViewMetadataCategoryAndMeasures,
                categorical: {
                    categories: [{
                        source: dataViewMetadataCategoryAndMeasures.columns[0],
                        values: ['Front end', 'Back end'],
                        objects: [
                            undefined,
                            { dataPoint: { fill: { solid: { color: hexGreen } } } }
                        ],
                        identity: [
                            powerbitests.mocks.dataViewScopeIdentity('f'),
                            powerbitests.mocks.dataViewScopeIdentity('b'),
                        ]
                    }],
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataCategoryAndMeasures.columns[1],
                            values: [110, 120],
                            highlights: [60, 60]
                        },
                        {
                            source: dataViewMetadataCategoryAndMeasures.columns[2],
                            values: [210, 220],
                            highlights: [140, 200]
                        }
                    ])
                }
            };
            var dataLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();
            var colors = powerbi.common.services.visualStyles.create().colorPalette.dataColors;
            var defaultColorRed = "#FF0000";
            var rootNode = Treemap.converter(dataView, colors, dataLabelSettings, null, defaultColorRed).root;
            var node1 = rootNode.children[0];
            var node2 = rootNode.children[1];
            expect(node1.color).toEqual(defaultColorRed);
            expect(node2.color).toEqual(hexGreen);
        });
    });
})(powerbitests || (powerbitests = {}));
