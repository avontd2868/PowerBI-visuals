module powerbitests {
    import TooltipBuilder = powerbi.visuals.TooltipBuilder;
    import TooltipManager = powerbi.visuals.TooltipManager;
    import ValueType = powerbi.ValueType;

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
        var d3Element: D3.Selection;
        var tooltipInfo: powerbi.visuals.TooltipDataItem[];

        beforeEach(() => {
            var localizationService: powerbi.common.ILocalizationService = powerbi.common.createLocalizationService();
            powerbi.common.localize = localizationService;
            powerbitests.mocks.setLocale(localizationService);

            powerbitests.helpers.suppressDebugAssertFailure();

            var element = powerbitests.helpers.testDom('500', '500');
            d3Element = d3.select("#" + element.attr("id"));

            tooltipInfo = [
                { displayName: "test", value: "111" },
                { displayName: "test", value: "111" }
            ];

            TooltipManager.addTooltip(d3Element,(d: any, i: number, el?: any) => {
                return tooltipInfo;
            });

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
            TooltipManager.ToolTipInstance.hide();

            // Show
            TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);

            // Hide
            TooltipManager.ToolTipInstance.hide();

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

        it('DOM container hiden - Hide ToolTip',(done) => {

            // Show tooltip
            var clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(200, 200, 0, 0);
            TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);
            // Hide
            TooltipManager.ToolTipInstance.hide();
            setTimeout(() => {
                var tooltipContainer = $('.tooltip-container');
                var visibility = tooltipContainer.css("visibility");
                expect("hidden").toBe(visibility);
                done();
            }, 1000);
        });

        it('DOM container style Opacity is 1 - Hide ToolTip',(done) => {

            // Show tooltip
            var clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(200, 200, 0, 0);
            TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);
            // Hide
            TooltipManager.ToolTipInstance.hide();
            setTimeout(() => {
                var tooltipContainerOpacity = $('.tooltip-container').css('opacity');
                expect(tooltipContainerOpacity).toBe('0');
                done();
            }, 1000);
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
            TooltipManager.ToolTipInstance.hide();

            // Show tooltip at top right of the screen
            clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(600, 100, 0, 0);
            TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);

            arrowClass = arrow.attr('class');
            expect(arrowClass).toBe('arrow top right');

            // Hide
            TooltipManager.ToolTipInstance.hide();

            // Show tooltip at bottom left of the screen
            clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(300, 500, 0, 0);
            TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);

            arrowClass = arrow.attr('class');
            expect(arrowClass).toBe('arrow bottom left');

            // Hide
            TooltipManager.ToolTipInstance.hide();

            // Show tooltip at bottom right of the screen
            clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(700, 800, 0, 0);
            TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);

            arrowClass = arrow.attr('class');
            expect(arrowClass).toBe('arrow bottom right');

            // Hide
            TooltipManager.ToolTipInstance.hide();

            // Reset test screen size
            TooltipManager.ToolTipInstance.setTestScreenSize(null, null);
        });
    });

    describe("Tooltip Builder tests",() => {
        it('createTooltipInfo: category & measure',() => {
            var columns: powerbi.DataViewMetadataColumn[] = [
                {
                    name: 'cat',
                    type: ValueType.fromDescriptor({ text: true })
                }, {
                    name: 'val',
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
                    name: 'cat',
                    type: ValueType.fromDescriptor({ text: true })
                }, {
                    name: 'ser',
                    type: ValueType.fromDescriptor({ text: true }),
                }, {
                    name: 'val',
                    isMeasure: true,
                    type: ValueType.fromDescriptor({ numeric: true }),
                    groupName: 'ser1',
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
                    name: 'cat',
                    type: ValueType.fromDescriptor({ text: true })
                }, {
                    name: 'val',
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