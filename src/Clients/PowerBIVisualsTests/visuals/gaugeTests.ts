//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbitests {
    import DataViewTransform = powerbi.data.DataViewTransform;
    import GaugeVisual = powerbi.visuals.Gauge;
    import SVGUtil = powerbi.visuals.SVGUtil;
    var DefaultTimeout = 400;

    var sideNumbersVisibleMinHeight: number = powerbi.visuals.visualPluginFactory.MobileVisualPluginService.MinHeightGaugeSideNumbersVisible;
    var sideNumbersVisibleGreaterThanMinHeight: number = sideNumbersVisibleMinHeight + 1;
    var sideNumbersVisibleSmallerThanMinHeight: number = sideNumbersVisibleMinHeight - 1;
    var sideNumbersVisibleGreaterThanMinHeightString: string = sideNumbersVisibleGreaterThanMinHeight.toString();
    var sideNumbersVisibleSmallerThanMinHeightString: string = sideNumbersVisibleSmallerThanMinHeight.toString();
    var marginsOnSmallViewPort: number = powerbi.visuals.visualPluginFactory.MobileVisualPluginService.GaugeMarginsOnSmallViewPort;

    describe('Gauge',() => {
        it('Capabilities should include dataViewMappings',() => {
            expect(GaugeVisual.capabilities.dataViewMappings).toBeDefined();
        });

        it('Capabilities should include dataRoles',() => {
            expect(GaugeVisual.capabilities.dataRoles).toBeDefined();
        });

        it('Capabilities should not suppressDefaultTitle',() => {
            expect(GaugeVisual.capabilities.suppressDefaultTitle).toBeUndefined();
        });

        it('Capabilities should include dataRoles',() => {
            expect(GaugeVisual.capabilities.dataRoles).toBeDefined();
        });

        it('FormatString property should match calculated',() => {
            expect(powerbi.data.DataViewObjectDescriptors.findFormatString(GaugeVisual.capabilities.objects)).toEqual(GaugeVisual.formatStringProp);
        });
    });

    describe('Gauge DOM tests',() => {
        var v: powerbi.IVisual, element: JQuery;
        var hostServices = powerbitests.mocks.createVisualHostServices();
        var dataViewMetadata: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    roles: { 'Y': true },
                    isMeasure: true,
                    objects: { general: { formatString: '$0' } },
                }, {
                    displayName: 'col2',
                    roles: { 'MinValue': true },
                    isMeasure: true
                }, {
                    displayName: 'col3',
                    roles: { 'MaxValue': true },
                    isMeasure: true
                }, {
                    displayName: 'col4',
                    roles: { 'TargetValue': true },
                    isMeasure: true
                }],
            groups: [],
            measures: [0],
        };

        beforeEach(() => {
            powerbitests.helpers.suppressDebugAssertFailure();
            powerbi.common.localize = powerbi.common.createLocalizationService();
            element = powerbitests.helpers.testDom('500', '500');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('gauge').create();
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true }
            });
        });

        it('Ensure min & target dont overlap', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    single: { value: 10 },
                    categorical: {
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata.columns[0],
                                values: [10],
                            }, {
                                source: dataViewMetadata.columns[1],
                                values: [0],
                            }, {
                                source: dataViewMetadata.columns[2],
                                values: [300],
                            }, {
                                source: dataViewMetadata.columns[3],
                                values: [0],
                            }])
                    }
                }]
            });

            setTimeout(() => {
                var targetText = $('.targetText');
                var maxLabel = $($('.labelText')[0]);
                expect(targetText.length).toBe(1);

                var xyTarget = { x: targetText.attr('x'), y: targetText.attr('y') };
                var xyMaxlabel = { x: maxLabel.attr('x'), y: maxLabel.attr('y') };

                expect(xyTarget.x).not.toEqual(xyMaxlabel.x);
                expect(xyTarget.y).not.toEqual(xyMaxlabel.y);
                done();

            }, DefaultTimeout);
        });

        it('Ensure max & target dont overlap', (done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    single: { value: 10 },
                    categorical: {
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata.columns[0],
                                values: [10],
                            }, {
                                source: dataViewMetadata.columns[1],
                                values: [0],
                            }, {
                                source: dataViewMetadata.columns[2],
                                values: [300],
                            }, {
                                source: dataViewMetadata.columns[3],
                                values: [300],
                            }])
                    }
                }]
            });

            setTimeout(() => {
                var targetText = $('.targetText');
                var maxLabel = $($('.labelText')[1]);
                expect(targetText.length).toBe(1);

                var xyTarget = { x: targetText.attr('x'), y: targetText.attr('y') };
                var xyMaxlabel = { x: maxLabel.attr('x'), y: maxLabel.attr('y') };

                expect(xyTarget.x).not.toEqual(xyMaxlabel.x);
                expect(xyTarget.y).not.toEqual(xyMaxlabel.y);
                done();

            }, DefaultTimeout);
        });

        it('Check Gauge DOM',(done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    single: { value: 10 },
                    categorical: {
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata.columns[0],
                                values: [10],
                            }, {
                                source: dataViewMetadata.columns[1],
                                values: [0],
                            }, {
                                source: dataViewMetadata.columns[2],
                                values: [300],
                            }, {
                                source: dataViewMetadata.columns[3],
                                values: [200],
                            }])
                    }
                }]
            });

            setTimeout(() => {
                // Check Arc Drawn
                var backgroundArc = $('.backgroundArc');
                var foregroundArc = $('.foregroundArc');

                expect(backgroundArc.length).toBe(1);
                expect(backgroundArc.attr('d')).toBeDefined();

                expect(foregroundArc.length).toBe(1);
                expect(foregroundArc.attr('d')).toBeDefined();

                expect($('.mainText').length).toBe(1);
                expect($('.mainText').text()).toEqual('$10');

                var translateString = $('.animatedNumber').attr('transform');
                var xy = SVGUtil.parseTranslateTransform(translateString);
                expect(xy.x).toBeGreaterThan(120);
                expect(xy.y).toBeGreaterThan(220);

                done();
            }, DefaultTimeout);
        });

        it('If value less that zero, then scale should be 0-1, but number should show negative value',(done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    categorical: {
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata.columns[0],
                                values: [-25],
                            }])
                    }
                }]
            });

            setTimeout(() => {
                var backgroundArc = $('.backgroundArc');
                var foregroundArc = $('.foregroundArc');

                expect(backgroundArc.length).toBe(1);
                expect(backgroundArc.attr('d')).toBeDefined();

                expect(foregroundArc.length).toBe(1);
                expect(foregroundArc.attr('d')).toBeDefined();

                var labels = $('.labelText');

                expect(labels.length).toBe(2);
                expect($(labels[0]).text()).toEqual('$0');
                expect($(labels[1]).text()).toEqual('$1');
                expect($('.mainText').length).toBe(1);
                expect($('.mainText').text()).toEqual('-$25');
                done();

            }, DefaultTimeout);
        });

        it('Check Gauge DOM on Style Changed',(done) => {
            v.onDataChanged({
                dataViews: [{
                    metadata: dataViewMetadata,
                    single: { value: 10 },
                    categorical: {
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadata.columns[0],
                                values: [10],
                            }, {
                                source: dataViewMetadata.columns[1],
                                values: [0],
                            }, {
                                source: dataViewMetadata.columns[2],
                                values: [500],
                            }, {
                                source: dataViewMetadata.columns[3],
                                values: [200],
                            }])
                    }
                }]
            });

            var dataColors: powerbi.IDataColorPalette = new powerbi.visuals.DataColorPalette();

            v.onStyleChanged({
                titleText: {
                    color: { value: 'rgba(51,51,51,1)' }
                },
                subTitleText: {
                    color: { value: 'rgba(145,145,145,1)' }
                },
                labelText: {
                    color: {
                        value: '#008000',
                    },
                    fontSize: '11px'
                },
                colorPalette: {
                    dataColors: dataColors,
                },
                isHighContrast: false,
            });

            setTimeout(() => {
                var labels = $('.labelText');
                var color = $(labels[0]).css('fill');
                expect(color).toEqual('#008000');
                done();

            }, DefaultTimeout);
        });
    });

    describe("Gauge Data Tests",() => {

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
        });

        var dataViewMetadata: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    roles: { 'Y': true },
                    isMeasure: true,
                    objects: { general: { formatString: '$0' } },
                }, {
                    displayName: 'col2',
                    roles: { 'MinValue': true },
                    isMeasure: true
                }, {
                    displayName: 'col3',
                    roles: { 'MaxValue': true },
                    isMeasure: true
                }, {
                    displayName: 'col4',
                    roles: { 'TargetValue': true },
                    isMeasure: true
                }],
            groups: [],
            measures: [0],
        };

        var dataViewMetadataNumbers: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    roles: { 'Y': true },
                    isMeasure: true,
                    objects: { general: { formatString: '0.00' } },
                }, {
                    displayName: 'col2',
                    roles: { 'MinValue': true },
                    isMeasure: true
                }, {
                    displayName: 'col3',
                    roles: { 'MaxValue': true },
                    isMeasure: true
                }, {
                    displayName: 'col4',
                    roles: { 'TargetValue': true },
                    isMeasure: true
                }],
            groups: [],
            measures: [0],
        };

        it('Gauge registered capabilities',() => {
            expect(powerbi.visuals.visualPluginFactory.create().getPlugin('gauge').capabilities).toBe(GaugeVisual.capabilities);
        });

        it('FormatString property should match calculated',() => {
            expect(powerbi.data.DataViewObjectDescriptors.findFormatString(GaugeVisual.capabilities.objects)).toEqual(GaugeVisual.formatStringProp);
        });

        it('Gauge_greaterThanMax',() => {
            var dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                single: { value: 500 },
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadata.columns[0],
                            values: [500],
                        }, {
                            source: dataViewMetadata.columns[1],
                            values: [0],
                        }, {
                            source: dataViewMetadata.columns[2],
                            values: [300],
                        }, {
                            source: dataViewMetadata.columns[3],
                            values: [200],
                        }])
                }
            };

            expect(GaugeVisual.converter(dataView).percent).toBe(1);
        });

        it('Gauge_smallerThanMin',() => {

            var dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                single: { value: -3 },
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadata.columns[0],
                            values: [-3],
                        }, {
                            source: dataViewMetadata.columns[1],
                            values: [0],
                        }, {
                            source: dataViewMetadata.columns[2],
                            values: [300],
                        }, {
                            source: dataViewMetadata.columns[3],
                            values: [200],
                        }])
                }
            };

            expect(GaugeVisual.converter(dataView).percent).toBe(0);
        });

        it('Gauge_betweenMinMax',() => {

            var dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                single: { value: 200 },
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadata.columns[0],
                            values: [200],
                        }, {
                            source: dataViewMetadata.columns[1],
                            values: [100],
                        }, {
                            source: dataViewMetadata.columns[2],
                            values: [300],
                        }, {
                            source: dataViewMetadata.columns[3],
                            values: [200],
                        }])
                }
            };

            expect(GaugeVisual.converter(dataView).percent).toBe(0.5);
        });

        it('Gauge_Nulls',() => {

            var dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                single: { value: null },
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadata.columns[0],
                            values: [null],
                        }, {
                            source: dataViewMetadata.columns[1],
                            values: [null],
                        }, {
                            source: dataViewMetadata.columns[2],
                            values: [null],
                        }, {
                            source: dataViewMetadata.columns[3],
                            values: [null],
                        }])
                }
            };

            var data = GaugeVisual.converter(dataView);
            expect(data.percent).toBe(0);
            expect(data.targetSettings).toEqual({
                min: 0,
                max: 0,
                target: 0,
            });
        });

        it('Gauge_tooltip_work',() => {
            var dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                single: { value: 500 },
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadata.columns[0],
                            values: [10],
                        }, {
                            source: dataViewMetadata.columns[1],
                            values: [0],
                        }, {
                            source: dataViewMetadata.columns[2],
                            values: [500],
                        }, {
                            source: dataViewMetadata.columns[3],
                            values: [200],
                        }])
                }
            };

            var data = GaugeVisual.converter(dataView);
            var expectedValues = {
                percent: 0.02,
                adjustedTotal: 10,
                total: 10,
                metadataColumn: dataViewMetadata.columns[0],
                targetSettings: {
                    min: 0,
                    max: 500,
                    target: 200
                },
                tooltipInfo: [{ displayName: "col1", value: "$10" }],
            };
            expect(data).toEqual(expectedValues);
        });

        it('Gauge_Nulls_Tooltip_Data',() => {

            var dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                single: { value: null },
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadata.columns[0],
                            values: [null],
                        }, {
                            source: dataViewMetadata.columns[1],
                            values: [null],
                        }, {
                            source: dataViewMetadata.columns[2],
                            values: [null],
                        }, {
                            source: dataViewMetadata.columns[3],
                            values: [null],
                        }])
                }
            };

            var data = GaugeVisual.converter(dataView);
            var expectedValues = {
                percent: 0,
                adjustedTotal: 0,
                total: 0,
                metadataColumn: dataViewMetadata.columns[0],
                targetSettings: { min: 0, max: 0, target: 0 },
                tooltipInfo: []
            };
            expect(data).toEqual(expectedValues);
        });

        it('Gauge_betweenMinMax_Tooltip_Data',() => {

            var dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                single: { value: 200 },
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadata.columns[0],
                            values: [200],
                        }, {
                            source: dataViewMetadata.columns[1],
                            values: [100],
                        }, {
                            source: dataViewMetadata.columns[2],
                            values: [300],
                        }, {
                            source: dataViewMetadata.columns[3],
                            values: [200],
                        }])
                }
            };
            var data = GaugeVisual.converter(dataView);
            var expectedValues = {
                percent: 0.5,
                adjustedTotal: 200,
                total: 200,
                metadataColumn: {
                    displayName: 'col1',
                    roles: { Y: true },
                    isMeasure: true,
                    objects: { general: { formatString: '$0' } },
                },
                targetSettings: { min: 100, max: 300, target: 200 },
                tooltipInfo: [{ displayName: 'col1', value: '$200' }]
            };

            expect(data).toEqual(expectedValues);
        });

        describe("Gauge Rendering Tests",() => {
            var v: powerbi.IVisual, element: JQuery;
            var hostServices = powerbitests.mocks.createVisualHostServices();
            var dataViews = [{
                metadata: dataViewMetadata,
                single: { value: 10 },
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadata.columns[0],
                            values: [10],
                        }, {
                            source: dataViewMetadata.columns[1],
                            values: [0],
                        }, {
                            source: dataViewMetadata.columns[2],
                            values: [300],
                        }, {
                            source: dataViewMetadata.columns[3],
                            values: [200],
                        }])
                }
            }];

            var dataViewsWithDecimals = [{
                metadata: dataViewMetadataNumbers,
                single: { value: 10 },
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadataNumbers.columns[0],
                            values: [5.5],
                        }, {
                            source: dataViewMetadataNumbers.columns[1],
                            values: [0],
                        }, {
                            source: dataViewMetadataNumbers.columns[2],
                            values: [10],
                        }, {
                            source: dataViewMetadataNumbers.columns[3],
                            values: [6.5],
                        }])
                }
            }];

            beforeEach(() => {
                v = powerbi.visuals.visualPluginFactory.create().getPlugin('gauge').create();
                element = powerbitests.helpers.testDom('500', '500');

                v.init({
                    element: element,
                    host: hostServices,
                    style: powerbi.visuals.visualStyles.create(),
                    viewport: {
                        height: element.height(),
                        width: element.width()
                    },
                    animation: { transitionImmediate: true }
                });
            });

            it('Get_Animated_Number_Properties works',() => {
                var gauge = <GaugeVisual> v;
                var expectedNumberProperty = {
                    transformString: "translate(0.2928932188134524,0.29289321881345254)",
                    viewport: {
                        "height": 0.7071067811865475,
                        "width": 1.4142135623730951
                    }
                };

                var animatedNumberProperty = gauge.getAnimatedNumberProperties(1, 1, 1, 1);
                expect(animatedNumberProperty).toEqual(expectedNumberProperty);
            });

            it('Get_Viewport_Properties works',() => {
                var gauge = <GaugeVisual> v;
                var expectedViewPortProperty = {
                    radius: 205,
                    innerRadiusOfArc: 143.5,
                    left: 250,
                    top: 352.5,
                    height: 460,
                    width: 410,
                    margin: {
                        top: 20,
                        bottom: 20,
                        left: 45,
                        right: 45
                    },
                    transformString: "translate(250,352.5)",
                    innerRadiusFactor: 0.7
                };

                var viewPortProperty = gauge.getGaugeVisualProperties();
                expect(viewPortProperty).toEqual(expectedViewPortProperty);
            });

            it('OnDataChange calls expected methods',(done) => {
                var gauge = <GaugeVisual> v;
                spyOn(gauge, 'getGaugeVisualProperties').and.callThrough();
                spyOn(gauge, 'getAnimatedNumberProperties').and.callThrough();
                spyOn(gauge, 'drawViewPort').and.callThrough();

                gauge.onDataChanged({ dataViews: dataViews });
                setTimeout(() => {
                    expect(gauge.drawViewPort).toHaveBeenCalled();         

                    //Changing data should trigger new calls for viewport and animated number properties
                    expect(gauge.getGaugeVisualProperties).toHaveBeenCalled();
                    expect(gauge.getAnimatedNumberProperties).toHaveBeenCalled();
                    done();

                }, DefaultTimeout);
            });

            it('onResizing calls expected methods',(done) => {
                var gauge = <GaugeVisual> v;
                //Sets private data property of Gauge
                gauge.onDataChanged({ dataViews: dataViews });

                spyOn(gauge, 'getGaugeVisualProperties').and.callThrough();
                spyOn(gauge, 'getAnimatedNumberProperties').and.callThrough();
                spyOn(gauge, 'drawViewPort').and.callThrough();

                gauge.onResizing({ height: 200, width: 300 }, 0);

                setTimeout(() => {
                    expect(gauge.getGaugeVisualProperties).toHaveBeenCalled();
                    expect(gauge.getAnimatedNumberProperties).toHaveBeenCalled();
                    expect(gauge.drawViewPort).toHaveBeenCalled();

                    done();
                }, DefaultTimeout);
            });

            it('onResizing aspect ratio check',(done) => {
                var gauge = <GaugeVisual> v;
                //Sets private data property of Gauge
                gauge.onDataChanged({ dataViews: dataViews });

                gauge.onResizing({ height: 100, width: 400 }, 0);

                setTimeout(() => {
                    var foregroundArc = $('.foregroundArc');
                    var path: string = foregroundArc.attr('d');
                    // ensure the radius is correct
                    expect(path.indexOf('A60,60')).toBeGreaterThan(0);

                    done();
                }, DefaultTimeout);
            });

            it('check target has decimal values',(done) => {
                var gauge = <GaugeVisual> v;
                gauge.onDataChanged({ dataViews: dataViewsWithDecimals });
                gauge.onResizing({ height: 100, width: 400 }, 0);

                setTimeout(() => {
                    var targetText = $('.targetText').text();
                    expect(targetText).toEqual('6.50');

                    done();
                }, DefaultTimeout);
            });

            it('Gauge_default_gauge_values',() => {
                var dataView: powerbi.DataView = {
                    metadata: null,
                    single: { value: 500 },
                    categorical: null
                };

                var expectedValues = {
                    percent: 0,
                    adjustedTotal: 0,
                    total: 0,
                    metadataColumn: null,
                    targetSettings: {
                        min: 0,
                        max: 1,
                        target: undefined
                    },
                    tooltipInfo: undefined
                };

                expect(GaugeVisual.converter(dataView)).toEqual(expectedValues);
            });
        });
    });

    describe("Gauge margins tests",() => {

        it('Gauge margin test with view port sideNumbersVisibleGreaterThanMinHeightString',() => {
            var v: powerbi.IVisual = testMargins(sideNumbersVisibleGreaterThanMinHeightString, false);
            var gauge = <GaugeVisual> v;
            var expectedViewPortProperty = {
                margin: {
                    top: 20,
                    bottom: 20,
                    left: 45,
                    right: 45
                },
            };

            var viewPortProperty = gauge.getGaugeVisualProperties();
            expect(viewPortProperty.margin).toEqual(expectedViewPortProperty.margin);
        });

        it('Gauge margin test with view port sideNumbersVisibleSmallerThanMinHeightString',() => {
            var v: powerbi.IVisual = testMargins(sideNumbersVisibleSmallerThanMinHeightString, false);
            var gauge = <GaugeVisual> v;
            var expectedViewPortProperty = {
                margin: {
                    top: 20,
                    bottom: 20,
                    left: 45,
                    right: 45
                },
            };

            var viewPortProperty = gauge.getGaugeVisualProperties();
            expect(viewPortProperty.margin).toEqual(expectedViewPortProperty.margin);
        });

        it('Gauge margin test with view port sideNumbersVisibleGreaterThanMinHeightString mobile',() => {
            var v: powerbi.IVisual = testMargins(sideNumbersVisibleGreaterThanMinHeightString, true);
            var gauge = <GaugeVisual> v;
            var expectedViewPortProperty = {
                margin: {
                    top: 20,
                    bottom: 20,
                    left: 45,
                    right: 45
                },
            };

            var viewPortProperty = gauge.getGaugeVisualProperties();
            expect(viewPortProperty.margin).toEqual(expectedViewPortProperty.margin);
        });

        it('Gauge margin test with view port sideNumbersVisibleSmallerThanMinHeightString mobile',() => {
            var v: powerbi.IVisual = testMargins(sideNumbersVisibleSmallerThanMinHeightString, true);
            var gauge = <GaugeVisual> v;
            var expectedViewPortProperty = {
                margin: {
                    top: marginsOnSmallViewPort,
                    bottom: marginsOnSmallViewPort,
                    left: marginsOnSmallViewPort,
                    right: marginsOnSmallViewPort
                },
            };

            var viewPortProperty = gauge.getGaugeVisualProperties();
            expect(viewPortProperty.margin).toEqual(expectedViewPortProperty.margin);
        });
    });

    describe('Gauge side number tests',() => {

        it('Gauge margin test with view port sideNumbersVisibleSmallerThanMinHeightString mobile',(done) => {
            testSideNumbers(sideNumbersVisibleSmallerThanMinHeightString, true);

            setTimeout(() => {
                var labels = $('.labelText');

                expect(labels.length).toBe(0);
                expect($(labels[0]).text()).toEqual('');
                expect($(labels[1]).text()).toEqual('');
                done();

            }, DefaultTimeout);
        });

        it('Gauge margin test with view port sideNumbersVisibleGreaterThanMinHeightString mobile',(done) => {
            testSideNumbers(sideNumbersVisibleGreaterThanMinHeightString, true);

            setTimeout(() => {
                var labels = $('.labelText');

                expect(labels.length).toBe(2);
                expect($(labels[0]).text()).toEqual('$0');
                expect($(labels[1]).text()).toEqual('$1');
                done();

            }, DefaultTimeout);
        });

        it('Gauge margin test with view port sideNumbersVisibleSmallerThanMinHeightString',(done) => {
            testSideNumbers(sideNumbersVisibleSmallerThanMinHeightString, false);

            setTimeout(() => {
                var labels = $('.labelText');

                expect(labels.length).toBe(2);
                expect($(labels[0]).text()).toEqual('$0');
                expect($(labels[1]).text()).toEqual('$1');
                done();

            }, DefaultTimeout);
        });

        it('Gauge margin test with view port sideNumbersVisibleGreaterThanMinHeightString',(done) => {
            testSideNumbers(sideNumbersVisibleGreaterThanMinHeightString, false);

            setTimeout(() => {
                var labels = $('.labelText');

                expect(labels.length).toBe(2);
                expect($(labels[0]).text()).toEqual('$0');
                expect($(labels[1]).text()).toEqual('$1');
                done();

            }, DefaultTimeout);
        });
    });

    function testMargins(domSizeString: string, isMobile: boolean): powerbi.IVisual {
        var element: JQuery;
        var v: powerbi.IVisual;
        var hostServices = powerbitests.mocks.createVisualHostServices();

        if (isMobile) {
            v = powerbi.visuals.visualPluginFactory.createMobile().getPlugin('gauge').create();
        } else {
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('gauge').create();
        }
        element = powerbitests.helpers.testDom(domSizeString, domSizeString);

        v.init({
            element: element,
            host: hostServices,
            style: powerbi.visuals.visualStyles.create(),
            viewport: {
                height: element.height(),
                width: element.width()
            },
            animation: { transitionImmediate: true }
        });
        return v;
    }

    function testSideNumbers(domSizeString: string, isMobile: boolean) {
        var v: powerbi.IVisual, element: JQuery;
        var hostServices = powerbitests.mocks.createVisualHostServices();
        var dataViewMetadata: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: 'col1',
                    roles: { 'Y': true },
                    isMeasure: true,
                    objects: { general: { formatString: '$0' } }
                }, {
                    displayName: 'col2',
                    roles: { 'MinValue': true },
                    isMeasure: true
                }, {
                    displayName: 'col3',
                    roles: { 'MaxValue': true },
                    isMeasure: true
                }, {
                    displayName: 'col4',
                    roles: { 'TargetValue': true },
                    isMeasure: true
                }],
            groups: [],
            measures: [0],
        };
        powerbi.common.localize = powerbi.common.createLocalizationService();
        element = powerbitests.helpers.testDom(domSizeString, domSizeString);
        if (isMobile) {
            v = powerbi.visuals.visualPluginFactory.createMobile().getPlugin('gauge').create();
        } else {
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('gauge').create();
        }
        v.init({
            element: element,
            host: hostServices,
            style: powerbi.visuals.visualStyles.create(),
            viewport: {
                height: element.height(),
                width: element.width()
            },
            animation: { transitionImmediate: true }
        });
        v.onDataChanged({
            dataViews: [{
                metadata: dataViewMetadata,
                categorical: {
                    values: DataViewTransform.createValueColumns([
                        {
                            source: dataViewMetadata.columns[0],
                            values: [-25],
                        }])
                }
            }]
        });
    }
}