//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbitests;
(function (powerbitests) {
    var DataViewTransform = powerbi.data.DataViewTransform;
    var DataShapeUtility = powerbi.data.dsr.DataShapeUtility;
    var SemanticType = powerbi.data.SemanticType;
    describe("VisualFactory", function () {
        beforeEach(function () {
            powerbitests.helpers.suppressDebugAssertFailure();
            powerbi.common.localize = powerbi.common.createLocalizationService();
            powerbitests.mocks.setLocale(powerbi.common.localize);
        });
        afterEach(function () {
        });
        var dataViewMetadataTwoColumn = {
            columns: [
                {
                    name: 'col1',
                    type: DataShapeUtility.describeDataType(2048 /* String */)
                },
                {
                    name: 'col2',
                    isMeasure: true,
                    type: DataShapeUtility.describeDataType(1 /* Number */)
                }
            ],
        };
        var categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: 's', entity: 'e', column: 'col1' });
        function initVisual(v) {
            var hostServices = powerbitests.mocks.createVisualHostServices();
            var element = powerbitests.helpers.testDom('500', '500');
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                settings: undefined,
                interactivity: undefined,
                animation: undefined,
            });
        }
        function setData(v) {
            // full
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: [powerbitests.mocks.dataViewScopeIdentity('abc'), powerbitests.mocks.dataViewScopeIdentity('def')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataTwoColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234]
                            }
                        ])
                    }
                }]
            });
            // empty
            v.onDataChanged({
                dataViews: []
            });
            // no categorical
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: undefined,
                }]
            });
            // no metadata
            v.onDataChanged({
                dataViews: [{
                    metadata: undefined,
                    categorical: {
                        categories: [],
                        values: undefined,
                    }
                }]
            });
            // no categorical.values
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: [powerbitests.mocks.dataViewScopeIdentity('abc'), powerbitests.mocks.dataViewScopeIdentity('def')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: undefined,
                    }
                }]
            });
            // no categories
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: undefined,
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataTwoColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234]
                            }
                        ])
                    }
                }]
            });
            // no values.values
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ['abc', 'def'],
                            identity: [powerbitests.mocks.dataViewScopeIdentity('abc'), powerbitests.mocks.dataViewScopeIdentity('def')],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataTwoColumn.columns[1],
                                values: []
                            }
                        ])
                    }
                }]
            });
            // no categories.values
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: [],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataTwoColumn.columns[1],
                                min: 123,
                                max: 234,
                                subtotal: 357,
                                values: [123, 234]
                            }
                        ])
                    }
                }]
            });
        }
        it('VisualFactory.getVisuals - categorical - various dataViews', function () {
            var allVisuals = powerbi.visuals.visualPluginFactory.create().getVisuals();
            for (var i = 0; i < allVisuals.length; i++) {
                var vizPlugin = allVisuals[i];
                if (vizPlugin.capabilities && vizPlugin.capabilities.dataViewMappings && vizPlugin.capabilities.dataViewMappings.length > 0 && vizPlugin.capabilities.dataViewMappings[0].categorical) {
                    var v = vizPlugin.create();
                    try {
                        initVisual(v);
                        setData(v);
                    }
                    catch (e) {
                        expect(vizPlugin.name + ' : ' + e.message).toBe('passed');
                    }
                }
            }
        });
    });
})(powerbitests || (powerbitests = {}));
