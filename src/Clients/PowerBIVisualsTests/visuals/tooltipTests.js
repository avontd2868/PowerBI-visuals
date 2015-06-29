var powerbitests;
(function (powerbitests) {
    describe("Tooltip", function () {
        beforeEach(function () {
            powerbi.explore.services.VisualHostServices.initialize(powerbi.common.createLocalizationService());
        });
        it('Tooltip instance created', function () {
            expect(powerbi.visuals.TooltipManager.ToolTipInstance).toBeDefined();
        });
        it('Tooltip has localization options defined', function () {
            expect(powerbi.visuals.ToolTipComponent.localizationOptions).toBeDefined();
        });
    });
    describe("Tooltip DOM tests", function () {
        var d3Element;
        var tooltipInfo;
        beforeEach(function () {
            var localizationService = powerbi.common.createLocalizationService();
            powerbi.common.localize = localizationService;
            powerbi.explore.services.VisualHostServices.initialize(localizationService);
            powerbitests.helpers.suppressDebugAssertFailure();
            var element = powerbitests.helpers.testDom('500', '500');
            d3Element = d3.select("#" + element.attr("id"));
            tooltipInfo = [
                { displayName: "test", value: "111" },
                { displayName: "test", value: "111" }
            ];
            powerbi.visuals.TooltipManager.addTooltip(d3Element, function (d, i, el) {
                return tooltipInfo;
            });
        });
        it('DOM container exists', function () {
            // Show tooltip
            var clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(200, 200, 0, 0);
            powerbi.visuals.TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);
            var tooltipContainer = $('.tooltip-container');
            expect(tooltipContainer.length).toBe(1);
        });
        it('Has single instance of DOM container', function () {
            // Show tooltip
            var clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(200, 200, 0, 0);
            powerbi.visuals.TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);
            // Hide
            powerbi.visuals.TooltipManager.ToolTipInstance.hide();
            // Show
            powerbi.visuals.TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);
            // Hide
            powerbi.visuals.TooltipManager.ToolTipInstance.hide();
            // Show
            powerbi.visuals.TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);
            // Show
            powerbi.visuals.TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);
            var tooltipContainer = $('.tooltip-container');
            expect(tooltipContainer.length).toBe(1);
        });
        it('DOM two rows exist', function () {
            // Show tooltip
            var clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(200, 200, 0, 0);
            powerbi.visuals.TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);
            var tooltipRow = $('.tooltip-row');
            expect(tooltipRow.length).toBe(2);
        });
        it('DOM two title cells exist', function () {
            // Show tooltip
            var clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(200, 200, 0, 0);
            powerbi.visuals.TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);
            var tooltipTitle = $('.tooltip-title-cell');
            expect(tooltipTitle.length).toBe(2);
        });
        it('DOM two value cells exist', function () {
            // Show tooltip
            var clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(200, 200, 0, 0);
            powerbi.visuals.TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);
            var tooltipValue = $('.tooltip-value-cell');
            expect(tooltipValue.length).toBe(2);
        });
        it('DOM content container exists', function () {
            // Show tooltip
            var clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(200, 200, 0, 0);
            powerbi.visuals.TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);
            var tooltipContentContainer = $('.tooltip-content-container');
            expect(tooltipContentContainer.length).toBe(1);
        });
        it('DOM container visible', function () {
            // Show tooltip
            var clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(200, 200, 0, 0);
            powerbi.visuals.TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);
            var tooltipContainer = $('.tooltip-container');
            expect(tooltipContainer).toBeVisible();
        });
        it('DOM container is visible - Show ToolTip', function () {
            // Show tooltip
            var clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(200, 200, 0, 0);
            powerbi.visuals.TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);
            var tooltipContainerVisibility = $('.tooltip-container');
            expect(tooltipContainerVisibility).toBeVisible();
        });
        it('DOM container style Opacity is 1 - Show ToolTip', function () {
            // Show tooltip
            var clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(200, 200, 0, 0);
            powerbi.visuals.TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);
            powerbi.visuals.SVGUtil.flushAllD3Transitions();
            var tooltipContainerOpacity = $('.tooltip-container').css('opacity');
            expect(tooltipContainerOpacity).toBeCloseTo(1, 2);
        });
        it('DOM container hiden - Hide ToolTip', function (done) {
            // Show tooltip
            var clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(200, 200, 0, 0);
            powerbi.visuals.TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);
            // Hide
            powerbi.visuals.TooltipManager.ToolTipInstance.hide();
            setTimeout(function () {
                var tooltipContainer = $('.tooltip-container');
                var visibility = tooltipContainer.css("visibility");
                expect("hidden").toBe(visibility);
                done();
            }, 1000);
        });
        it('DOM container style Opacity is 1 - Hide ToolTip', function (done) {
            // Show tooltip
            var clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(200, 200, 0, 0);
            powerbi.visuals.TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);
            // Hide
            powerbi.visuals.TooltipManager.ToolTipInstance.hide();
            setTimeout(function () {
                var tooltipContainerOpacity = $('.tooltip-container').css('opacity');
                expect(tooltipContainerOpacity).toBe('0');
                done();
            }, 1000);
        });
        it('DOM arrow exists', function () {
            // Show tooltip
            var clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(200, 200, 0, 0);
            powerbi.visuals.TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);
            var tooltipContainer = $('.tooltip-container');
            var arrow = tooltipContainer.find('.arrow');
            expect(arrow.length).toBe(1);
        });
        it('DOM arrow position test', function () {
            var clickedArea;
            // Set test screen size
            powerbi.visuals.TooltipManager.ToolTipInstance.setTestScreenSize(1000, 700);
            // Show tooltip at top left of the screen
            clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(200, 200, 0, 0);
            powerbi.visuals.TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);
            var arrowClass;
            var tooltipContainer = $('.tooltip-container');
            var arrow = tooltipContainer.find('.arrow');
            arrowClass = arrow.attr('class');
            expect(arrowClass).toBe('arrow top left');
            // Hide
            powerbi.visuals.TooltipManager.ToolTipInstance.hide();
            // Show tooltip at top right of the screen
            clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(600, 100, 0, 0);
            powerbi.visuals.TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);
            arrowClass = arrow.attr('class');
            expect(arrowClass).toBe('arrow top right');
            // Hide
            powerbi.visuals.TooltipManager.ToolTipInstance.hide();
            // Show tooltip at bottom left of the screen
            clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(300, 500, 0, 0);
            powerbi.visuals.TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);
            arrowClass = arrow.attr('class');
            expect(arrowClass).toBe('arrow bottom left');
            // Hide
            powerbi.visuals.TooltipManager.ToolTipInstance.hide();
            // Show tooltip at bottom right of the screen
            clickedArea = new powerbi.visuals.controls.TouchUtils.Rectangle(700, 800, 0, 0);
            powerbi.visuals.TooltipManager.ToolTipInstance.show(tooltipInfo, clickedArea);
            arrowClass = arrow.attr('class');
            expect(arrowClass).toBe('arrow bottom right');
            // Hide
            powerbi.visuals.TooltipManager.ToolTipInstance.hide();
            // Reset test screen size
            powerbi.visuals.TooltipManager.ToolTipInstance.setTestScreenSize(null, null);
        });
    });
})(powerbitests || (powerbitests = {}));
