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
    import TooltipBuilder = powerbi.visuals.TooltipBuilder;
    import TooltipManager = powerbi.visuals.TooltipManager;
    import TooltipEvent = powerbi.visuals.TooltipEvent;
    import ValueType = powerbi.ValueType;
    import SVGUtil = powerbi.visuals.SVGUtil;

    describe("Tooltip", () => {

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
        });

        it('Tooltip instance created', () => {
            expect(TooltipManager.ToolTipInstance).toBeDefined();
        });

        it('Tooltip has localization options defined', () => {
            expect(powerbi.visuals.ToolTipComponent.localizationOptions).toBeDefined();
        });
    });

    describe("Tooltip DOM tests",() => {
        var element: JQuery;
        var d3Element: D3.Selection;
        var tooltipInfo: powerbi.visuals.TooltipDataItem[];
        //var timerCallback: jasmine.Spy;

        beforeEach(() => {
            var localizationService: powerbi.common.ILocalizationService = powerbi.common.createLocalizationService();
            powerbi.common.localize = localizationService;
            powerbitests.mocks.setLocale(localizationService);

            //timerCallback = jasmine.createSpy("timerCallback");
            //jasmine.clock().install();

            createDomElement();
        });

        afterEach(function () {
            //jasmine.clock().uninstall();
        });

        it('DOM container exists',() => {

            // Show tooltip
            var clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(200, 200, 0, 0);
            TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);

            var tooltipContainer = $('.tooltip-container');
            expect(tooltipContainer.length).toBe(1);
        });

        it('Has single instance of DOM container',() => {

            // Show tooltip
            var clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(200, 200, 0, 0);
            TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);

            // Hide
            hideTooltip();

            // Show
            TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);

            // Hide
            hideTooltip();

            // Show
            TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);

            // Show
            TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);

            var tooltipContainer = $('.tooltip-container');
            expect(tooltipContainer.length).toBe(1);
        });

        it('DOM two rows exist',() => {

            // Show tooltip
            var clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(200, 200, 0, 0);
            TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);

            var tooltipRow = $('.tooltip-row');

            expect(tooltipRow.length).toBe(2);
        });

        it('DOM two title cells exist',() => {

            // Show tooltip
            var clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(200, 200, 0, 0);
            TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);

            var tooltipTitle = $('.tooltip-title-cell');

            expect(tooltipTitle.length).toBe(2);
        });

        it('DOM two value cells exist',() => {

            // Show tooltip
            var clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(200, 200, 0, 0);
            TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);

            var tooltipValue = $('.tooltip-value-cell');

            expect(tooltipValue.length).toBe(2);
        });

        it('DOM content container exists',() => {

            // Show tooltip
            var clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(200, 200, 0, 0);
            TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);

            var tooltipContentContainer = $('.tooltip-content-container');
            expect(tooltipContentContainer.length).toBe(1);
        });

        it('DOM container visible',() => {

            // Show tooltip
            var clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(200, 200, 0, 0);
            TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);

            var tooltipContainer = $('.tooltip-container');
            expect(tooltipContainer).toBeVisible();
        });

        it('DOM container is visible - Show ToolTip',() => {

            // Show tooltip
            var clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(200, 200, 0, 0);
            TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);

            var tooltipContainerVisibility = $('.tooltip-container');
            expect(tooltipContainerVisibility).toBeVisible();
        });

        it('DOM container style Opacity is 1 - Show ToolTip',() => {

            // Show tooltip
            var clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(200, 200, 0, 0);
            TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);

            powerbi.visuals.SVGUtil.flushAllD3Transitions();

            var tooltipContainerOpacity = $('.tooltip-container').css('opacity');
            expect(tooltipContainerOpacity).toBeCloseTo(1, 2);
        });

        it('DOM container hiden - Hide ToolTip',() => {

            // Show tooltip
            var clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(200, 200, 0, 0);
            TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);
            // Hide
            hideTooltip();

            var tooltipContainer = $('.tooltip-container');
            var visibility = tooltipContainer.css("visibility");
            expect("hidden").toBe(visibility);
        });

        it('DOM container style Opacity is 1 - Hide ToolTip',() => {

            // Show tooltip
            var clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(200, 200, 0, 0);
            TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);
            // Hide
            hideTooltip();

            var tooltipContainerOpacity = $('.tooltip-container').css('opacity');
            expect(tooltipContainerOpacity).toBe('0');
        });

        it('DOM arrow exists', () => {
            // Show tooltip
            var clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(200, 200, 0, 0);
            TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);

            var tooltipContainer = $('.tooltip-container');
            var arrow = tooltipContainer.find('.arrow');
            expect(arrow.length).toBe(1);
        });

        it('DOM arrow position test', () => {
            var clickedArea: powerbi.visuals.controls.TouchUtils.Rectangle;

            // Set test screen size
            TooltipManager.ToolTipInstance.setTestScreenSize(1000, 700);

            // Show tooltip at top left of the screen
            clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(200, 200, 0, 0);
            TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);

            var arrowClass: string;
            var tooltipContainer = $('.tooltip-container');
            var arrow = tooltipContainer.find('.arrow');
            
            arrowClass = arrow.attr('class');
            expect(arrowClass).toBe('arrow top left');

            // Hide
            hideTooltip();

            // Show tooltip at top right of the screen
            clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(600, 100, 0, 0);
            TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);

            arrowClass = arrow.attr('class');
            expect(arrowClass).toBe('arrow top right');

            // Hide
            hideTooltip();

            // Show tooltip at bottom left of the screen
            clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(300, 500, 0, 0);
            TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);

            arrowClass = arrow.attr('class');
            expect(arrowClass).toBe('arrow bottom left');

            // Hide
            hideTooltip();

            // Show tooltip at bottom right of the screen
            clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(700, 800, 0, 0);
            TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);

            arrowClass = arrow.attr('class');
            expect(arrowClass).toBe('arrow bottom right');

            // Hide
            hideTooltip();

            // Reset test screen size
            TooltipManager.ToolTipInstance.setTestScreenSize(null, null);
        });

        it("Should invoke mouseover event.", function () {
            var spyEvent = spyOnEvent('#item', 'mouseover');
            hideTooltip();
            emulateShowTooltip();

            expect('mouseover').toHaveBeenTriggeredOn('#item');
            expect(spyEvent).toHaveBeenTriggered();
        });

        it('tooltip is visible after 200ms',(done) => {
            hideTooltip();

            var tooltipEvent = getMockTooltipEvent();
            TooltipManager.showDelayedTooltip(tooltipEvent, getMockTooltipData, 500);

            setTimeout(() => {
                var visibility = getTooltipVisibility();
                expect(visibility).toEqual('hidden');
                done();
            }, 200);
        });

        it('tooltip is visible after 500ms',(done) => {
            hideTooltip();

            var tooltipEvent = getMockTooltipEvent();
            TooltipManager.showDelayedTooltip(tooltipEvent, getMockTooltipData, 500);

            setTimeout(() => {
                var visibility = getTooltipVisibility();
                expect(visibility).toEqual('visible');
                done();
            }, 513);
        });

        function getMockTooltipEvent(): TooltipEvent {
            return {
                data: null,
                index: 0,
                coordinates: [10, 10],
                elementCoordinates: [2, 2],
                context: this,
                isTouchEvent: false
            };
        }

        function getMockTooltipData(tooltipEvent: TooltipEvent): powerbi.visuals.TooltipDataItem[] {
            return [
                { displayName: "test 1", value: "111" },
                { displayName: "test 2", value: "222" }
            ];
        }

        function emulateShowTooltip() {
            // Fire mouseover event
            var evt: any = document.createEvent("MouseEvents");
            evt.initMouseEvent("mouseover", true, true, window, 1, 2, 2, 2, 2, false, false, false, false, 0, null);
            d3Element.node().dispatchEvent(evt);
        }

        function getTooltipVisibility() {
            var tooltipContainer = $('.tooltip-container');
            return tooltipContainer.length > 0 ? tooltipContainer.css("visibility") : "hidden";
        }

        function hideTooltip() {
            TooltipManager.ToolTipInstance.hide();
            SVGUtil.flushAllD3Transitions();
        }

        function createDomElement() {
            if (element) {
                // remove existing one
                element.remove();
            }

            element = powerbitests.helpers.testDom('500', '500');
            d3Element = d3.select("#" + element.attr("id"));

            tooltipInfo = [
                { displayName: "test 1", value: "111" },
                { displayName: "test 2", value: "222" }
            ];

            TooltipManager.addTooltip(d3Element, getMockTooltipData);
        }
    });

    describe("Tooltip Builder tests",() => {
        it('createTooltipInfo: category & measure',() => {
            var columns: powerbi.DataViewMetadataColumn[] = [
                {
                    displayName: 'cat',
                    type: ValueType.fromDescriptor({ text: true })
                }, {
                    displayName: 'val',
                    isMeasure: true,
                    type: ValueType.fromDescriptor({ numeric: true })
                },
            ];
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
                mocks.dataViewScopeIdentity("ghi")];
            var dataView: powerbi.DataView = {
                metadata: { columns: columns },
                categorical: {
                    categories: [{
                        source: columns[0],
                        values: ['abc', 'def', 'ghi'],
                        identity: categoryIdentities,
                        identityFields: [],
                    }],
                    values: powerbi.data.DataViewTransform.createValueColumns([
                        {
                            source: columns[1],
                            values: [123.321, 234.789, 456.001],
                        }])
                }
            };

            var tooltipInfo = TooltipBuilder.createTooltipInfo(
                null,
                dataView.categorical.categories,
                'abc',
                dataView.categorical.values,
                123.321,
                [{ value: 123.321, metadata: dataView.categorical.values[0] }],
                0);

            expect(tooltipInfo).toEqual([
                { displayName: 'cat', value: 'abc' },
                { displayName: 'val', value: '123.321' }]);
        });

        it('createTooltipInfo: category, series & measure',() => {
            var columns: powerbi.DataViewMetadataColumn[] = [
                {
                    displayName: 'cat',
                    type: ValueType.fromDescriptor({ text: true })
                }, {
                    displayName: 'ser',
                    type: ValueType.fromDescriptor({ text: true }),
                }, {
                    displayName: 'val',
                    isMeasure: true,
                    type: ValueType.fromDescriptor({ numeric: true }),
                    groupName: 'ser1',
                },
            ];
            var dataView: powerbi.DataView = {
                metadata: { columns: columns },
                categorical: {
                    categories: [{
                        source: columns[0],
                        values: ['abc', 'def'],
                        identity: [mocks.dataViewScopeIdentity("abc"), mocks.dataViewScopeIdentity("def")],
                    }],
                    values: powerbi.data.DataViewTransform.createValueColumns([
                        {
                            source: columns[2],
                            values: [123, 234],
                            identity: mocks.dataViewScopeIdentity("ABC"),
                        }, {
                            source: columns[2],
                            values: [345, 456],
                            identity: mocks.dataViewScopeIdentity("DEF"),
                        }])
                }
            };
            dataView.categorical.values.source = columns[1];

            var tooltipInfo = TooltipBuilder.createTooltipInfo(
                null,
                dataView.categorical.categories,
                'abc',
                dataView.categorical.values,
                123.321,
                [{ value: 123.321, metadata: dataView.categorical.values[0] }],
                0);

            expect(tooltipInfo).toEqual([
                { displayName: 'cat', value: 'abc' },
                { displayName: 'ser', value: 'ser1' },
                { displayName: 'val', value: '123.321' }]);
        });

        it('createTooltipInfo: self cross-joined category & measure',() => {
            var columns: powerbi.DataViewMetadataColumn[] = [
                {
                    displayName: 'cat',
                    type: ValueType.fromDescriptor({ text: true })
                }, {
                    displayName: 'val',
                    isMeasure: true,
                    type: ValueType.fromDescriptor({ numeric: true })
                },
            ];
            var categoryIdentities = [
                mocks.dataViewScopeIdentity("abc"),
                mocks.dataViewScopeIdentity("def"),
                mocks.dataViewScopeIdentity("ghi")];
            var dataView = powerbi.data.DataViewSelfCrossJoin.apply({
                metadata: { columns: columns },
                categorical: {
                    categories: [{
                        source: columns[0],
                        values: ['abc', 'def', 'ghi'],
                        identity: categoryIdentities,
                        identityFields: [],
                    }],
                    values: powerbi.data.DataViewTransform.createValueColumns([
                        {
                            source: columns[1],
                            values: [123.321, 234.789, 456.001],
                        }])
                }
            });

            var tooltipInfo = TooltipBuilder.createTooltipInfo(
                null,
                dataView.categorical.categories,
                'abc',
                dataView.categorical.values,
                123.321);

            expect(tooltipInfo).toEqual([
                { displayName: 'cat', value: 'abc' },
                { displayName: 'val', value: '123.321' }]);
        });
    });
}