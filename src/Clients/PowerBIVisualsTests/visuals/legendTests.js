var LegendIcon = powerbi.visuals.LegendIcon;
var LegendPosition = powerbi.visuals.LegendPosition;
var DefaultWaitForRender = 10;
describe("legendChart DOM validation", function () {
    var element;
    var viewport;
    var legend;
    var colorStyle = 'background-color: {0};';
    var defaultLegendHeight = 31;
    var scrollMargin = 15;
    var defaultLegendWidth = 300 * 0.3;
    var interactivityService;
    var hostServices;
    beforeEach(function () {
        powerbi.common.localize = powerbi.common.createLocalizationService();
    });
    beforeEach(function () {
        element = powerbitests.helpers.testDom('500', '500');
        hostServices = powerbitests.mocks.createVisualHostServices();
        interactivityService = powerbi.visuals.createInteractivityService(hostServices);
        legend = powerbi.visuals.createLegend(element, false, interactivityService);
        viewport = {
            height: element.height(),
            width: element.width()
        };
    });
    it('legend dom validation one legend item count validation', function (done) {
        var legendData = [
            {
                label: 'California',
                color: 'red',
                icon: 2 /* Line */,
                identity: powerbi.visuals.SelectionId.createNull(),
                selected: false
            }
        ];
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(function () {
            expect($('.label').length).toBe(1);
            expect($('.item').length).toBe(1);
            expect($('.legendTopBottom').length).toBe(1);
            done();
        }, DefaultWaitForRender);
    });
    it('legend dom validation three legend items count validation', function (done) {
        var legendData = [
            { label: 'California', color: 'red', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Texas', color: 'blue', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Washington', color: 'green', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
        ];
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(function () {
            expect($('.label').length).toBe(3);
            expect($('.item').length).toBe(3);
            expect($('.legendTopBottom').length).toBe(1);
            done();
        }, DefaultWaitForRender);
    });
    it('legend dom validation incremental build', function (done) {
        // Draw the legend once with the 3 states
        var initialData = [
            { label: 'California', color: 'red', icon: 0 /* Box */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Texas', color: 'blue', icon: 0 /* Box */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Washington', color: 'green', icon: 0 /* Box */, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
        ];
        legend.drawLegend({ dataPoints: initialData }, viewport);
        setTimeout(function () {
            validateLegendDOM(initialData);
            // Draw the legend against with a new state at the start
            var legendData = [
                { label: 'Alaska', color: 'red', icon: 0 /* Box */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
                { label: 'California', color: 'blue', icon: 0 /* Box */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
                { label: 'Texas', color: 'green', icon: 0 /* Box */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
                { label: 'Washington', color: 'orange', icon: 0 /* Box */, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
            ];
            legend.reset();
            legend.drawLegend({ dataPoints: legendData }, viewport);
            setTimeout(function () {
                validateLegendDOM(legendData);
                done();
            }, DefaultWaitForRender);
        }, DefaultWaitForRender);
    });
    it('legend dom validation three legend items first item text', function (done) {
        var legendData = [
            { label: 'California', color: 'red', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Texas', color: 'blue', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Washington', color: 'green', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
        ];
        legend.reset();
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(function () {
            expect($('.label').first().text()).toBe('California');
            done();
        }, DefaultWaitForRender);
    });
    it('legend dom validation three legend items last item text', function (done) {
        var legendData = [
            { label: 'California', color: 'red', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Texas', color: 'blue', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Washington', color: 'green', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
        ];
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(function () {
            expect($('.label').last().text()).toBe('Washington');
            done();
        }, DefaultWaitForRender);
    });
    it('legend dom validation three legend items colors count', function (done) {
        var legendData = [
            { label: 'California', color: 'red', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Texas', color: 'blue', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Washington', color: 'green', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
        ];
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(function () {
            expect($('.icon.short').length).toBe(3);
            done();
        }, DefaultWaitForRender);
    });
    it('legend dom validation three legend items colors', function (done) {
        var legendData = [
            { label: 'California', color: 'rgb(255, 0, 0)', icon: 0 /* Box */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Texas', color: 'rgb(0, 0, 255)', icon: 0 /* Box */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Washington', color: 'rgb(0, 255, 0)', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
        ];
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(function () {
            var items = $('.icon.tall');
            expect(items.first().css('background-color')).toBe('rgb(255, 0, 0)');
            expect(items.last().css('background-color')).toBe('rgb(0, 0, 255)');
            var itemsCombo = $('.icon.short');
            expect(itemsCombo.last().css('background-color')).toBe('rgb(0, 255, 0)');
            done();
        }, DefaultWaitForRender);
    });
    it('legend dom validation right render validation', function (done) {
        var svgElement = $('<svg/>').addClass("columnChart");
        element.append(svgElement);
        legend = powerbi.visuals.createLegend(element, false, interactivityService, false, 2 /* Right */);
        var legendData = [
            { label: 'California', color: 'red', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
        ];
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(function () {
            expect($('.item').length).toBe(0);
            expect($('.verticalItem').length).toBe(1);
            expect($('.legendTopBottom').length).toBe(0);
            expect($('.legendLeftRight').length).toBe(1);
            expect(element.children().first().get(0).tagName).toBe("SVG");
            expect(element.children().last().get(0).tagName).toBe("DIV");
            expect(element.children().last().css('width')).toBe("90px");
            expect($('.legendLeftRight').first().height()).toBe(element.height());
            done();
        }, DefaultWaitForRender);
    });
    it('legend dom validation left render validation', function (done) {
        var svgElement = $('<svg/>').addClass("columnChart");
        element.append(svgElement);
        legend = powerbi.visuals.createLegend(element, false, interactivityService, false, 3 /* Left */);
        var legendData = [
            { label: 'California', color: 'red', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
        ];
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(function () {
            expect($('.item').length).toBe(0);
            expect($('.verticalItem').length).toBe(1);
            expect($('.legendTopBottom').length).toBe(0);
            expect($('.legendLeftRight').length).toBe(1);
            expect(element.children().first().get(0).tagName).toBe("DIV");
            expect(element.children().last().get(0).tagName).toBe("SVG");
            done();
        }, DefaultWaitForRender);
    });
    it('legend dom validation bottom render validation', function (done) {
        var svgElement = $('<svg/>').addClass("columnChart");
        element.append(svgElement);
        legend = powerbi.visuals.createLegend(element, false, interactivityService, false, 1 /* Bottom */);
        var legendData = [
            { label: 'California', color: 'red', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
        ];
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(function () {
            expect($('.label').length).toBe(1);
            expect($('.item').length).toBe(1);
            expect($('.verticalItem').length).toBe(0);
            expect($('.legendTopBottom').length).toBe(1);
            expect($('.legendLeftRight').length).toBe(0);
            expect(element.children().first().get(0).tagName).toBe("SVG");
            expect(element.children().last().get(0).tagName).toBe("DIV");
            expect(element.children().last().css('width')).toBe("500px");
            expect(element.children().last().css('height')).toBe("20px");
            done();
        }, DefaultWaitForRender);
    });
    it('legend dom validation top render validation', function (done) {
        var svgElement = $('<svg/>').addClass("columnChart");
        element.append(svgElement);
        legend = powerbi.visuals.createLegend(element, false, interactivityService);
        var legendData = [
            { label: 'California', color: 'red', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
        ];
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(function () {
            expect($('.label').length).toBe(1);
            expect($('.item').length).toBe(1);
            expect($('.verticalItem').length).toBe(0);
            expect($('.legendTopBottom').length).toBe(1);
            expect($('.legendLeftRight').length).toBe(0);
            expect(element.children().first().get(0).tagName).toBe("DIV");
            expect(element.children().last().get(0).tagName).toBe("SVG");
            expect($('.legend').children().length).toBe(1);
            done();
        }, DefaultWaitForRender);
    });
    it('legend dom validation top render scrollMargin validation', function (done) {
        var svgElement = $('<svg/>').addClass("columnChart");
        element.append(svgElement);
        legend = powerbi.visuals.createLegend(element, false, interactivityService, true, 0 /* Top */);
        var legendData = [
            { label: 'California', color: 'red', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
        ];
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(function () {
            expect($('.label').length).toBe(1);
            expect($('.item').length).toBe(1);
            expect($('.legendTopBottom').length).toBe(1);
            expect(legend.getMargins().height).toBe(defaultLegendHeight + scrollMargin);
            done();
        }, DefaultWaitForRender);
    });
    it('legend top/bottom render data slice validation no title', function (done) {
        var svgElement = $('<svg/>').addClass("columnChart");
        element.append(svgElement);
        legend = powerbi.visuals.createLegend(element, false, interactivityService, false, 0 /* Top */);
        var legendData = getLegendData();
        viewport = {
            height: 150,
            width: 250
        };
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(function () {
            expect($('.item').length).toBe(3);
            // Bigger viewport
            viewport = {
                height: 500,
                width: 500
            };
            legend.reset();
            legend.drawLegend({ dataPoints: legendData }, viewport);
            setTimeout(function () {
                expect($('.item').length).toBe(6);
                done();
            }, DefaultWaitForRender);
        }, DefaultWaitForRender);
    });
    it('legend top/bottom render data slice validation with title', function (done) {
        var svgElement = $('<svg/>').addClass("columnChart");
        element.append(svgElement);
        legend = powerbi.visuals.createLegend(element, false, interactivityService, false, 1 /* Bottom */);
        var legendData = getLegendData();
        viewport = {
            height: 150,
            width: 250
        };
        legend.drawLegend({ title: "States", dataPoints: legendData }, viewport);
        setTimeout(function () {
            expect($('.item').length).toBe(2);
            done();
        }, DefaultWaitForRender);
    });
    it('legend left/right render data slice validation no title', function (done) {
        var svgElement = $('<svg/>').addClass("columnChart");
        element.append(svgElement);
        legend = powerbi.visuals.createLegend(element, false, interactivityService, false, 3 /* Left */);
        var legendData = getLegendData();
        viewport = {
            height: 150,
            width: 250
        };
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(function () {
            expect($('.verticalItem').length).toBe(7);
            // Bigger viewport
            viewport = {
                height: 500,
                width: 500
            };
            legend.reset();
            legend.drawLegend({ dataPoints: legendData }, viewport);
            setTimeout(function () {
                expect($('.verticalItem').length).toBe(10);
                done();
            }, DefaultWaitForRender);
        }, DefaultWaitForRender);
    });
    it('legend left/right render data slice validation with title', function (done) {
        var svgElement = $('<svg/>').addClass("columnChart");
        element.append(svgElement);
        legend = powerbi.visuals.createLegend(element, false, interactivityService, false, 2 /* Right */);
        var legendData = getLegendData();
        viewport = {
            height: 150,
            width: 250
        };
        legend.drawLegend({ title: "States", dataPoints: legendData }, viewport);
        setTimeout(function () {
            expect($('.verticalItem').length).toBe(6);
            done();
        }, DefaultWaitForRender);
    });
    it('legend getIconClass Circle', function () {
        expect(powerbi.visuals.getIconClass(1 /* Circle */)).toBe('icon circle');
    });
    it('legend getIconClass Box', function () {
        expect(powerbi.visuals.getIconClass(0 /* Box */)).toBe('icon tall');
    });
    it('legend getIconClass Line', function () {
        expect(powerbi.visuals.getIconClass(2 /* Line */)).toBe('icon short');
    });
    it('legend getMargins empty', function () {
        expect(legend.getMargins().height).toBe(0);
        expect(legend.getMargins().width).toBe(0);
    });
    it('legend getMargins no data', function () {
        legend.drawLegend({ dataPoints: [] }, viewport);
        expect(legend.getMargins().height).toBe(0);
        expect(legend.getMargins().width).toBe(0);
    });
    it('legend getMargins data top position', function () {
        legend.drawLegend({
            dataPoints: [
                { label: 'California', color: 'rgb(255, 0, 0)', icon: 1 /* Circle */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
                { label: 'Texas', color: 'rgb(0, 0, 255)', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
                { label: 'Washington', color: 'rgb(0, 255, 0)', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
            ]
        }, viewport);
        expect(legend.getMargins().height).toBe(defaultLegendHeight);
        expect(legend.getMargins().width).toBe(0);
    });
    it('legend getMargins data bottom position', function () {
        legend = powerbi.visuals.createLegend(element, false, interactivityService, false, 1 /* Bottom */);
        legend.drawLegend({
            dataPoints: [
                { label: 'California', color: 'rgb(255, 0, 0)', icon: 1 /* Circle */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
                { label: 'Texas', color: 'rgb(0, 0, 255)', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
                { label: 'Washington', color: 'rgb(0, 255, 0)', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
            ]
        }, viewport);
        expect(legend.getMargins().width).toBe(0);
        expect(legend.getMargins().height).toBe(defaultLegendHeight);
    });
    it('legend getMargins data right position', function () {
        legend = powerbi.visuals.createLegend(element, false, interactivityService, false, 2 /* Right */);
        legend.drawLegend({
            dataPoints: [
                { label: 'California', color: 'rgb(255, 0, 0)', icon: 1 /* Circle */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
                { label: 'Texas', color: 'rgb(0, 0, 255)', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
                { label: 'Washington', color: 'rgb(0, 255, 0)', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
            ]
        }, viewport);
        expect(legend.getMargins().width).toBe(defaultLegendWidth);
        expect(legend.getMargins().height).toBe(0);
    });
    it('legend getMargins data left position', function () {
        legend = powerbi.visuals.createLegend(element, false, interactivityService, false, 2 /* Right */);
        legend.drawLegend({
            dataPoints: [
                { label: 'California', color: 'rgb(255, 0, 0)', icon: 1 /* Circle */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
                { label: 'Texas', color: 'rgb(0, 0, 255)', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
                { label: 'Washington', color: 'rgb(0, 255, 0)', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
            ]
        }, viewport);
        expect(legend.getMargins().width).toBe(defaultLegendWidth);
        expect(legend.getMargins().height).toBe(0);
    });
    it('legend getMargins one data point', function () {
        legend.drawLegend({
            dataPoints: [
                { label: 'California', color: 'rgb(255, 0, 0)', icon: 1 /* Circle */, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
            ]
        }, viewport);
        expect(legend.getMargins().height).toBe(defaultLegendHeight);
        expect(legend.getMargins().width).toBe(0);
    });
    it('legend getMargins right position resize greater than max ', function () {
        var legendData = {
            dataPoints: [
                { label: 'California', color: 'rgb(255, 0, 0)', icon: 1 /* Circle */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
                { label: 'Texas', color: 'rgb(0, 0, 255)', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
                { label: 'Washington', color: 'rgb(0, 255, 0)', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
            ]
        };
        var viewport = {
            height: 500,
            width: 305
        };
        legend = powerbi.visuals.createLegend(element, false, interactivityService, false, 2 /* Right */);
        legend.drawLegend(legendData, viewport);
        expect(legend.getMargins().width).toBe(defaultLegendWidth);
        expect(legend.getMargins().height).toBe(0);
    });
    it('legend getMargins right position resize between min and max ', function () {
        var legendData = [
            { label: 'California', color: 'rgb(255, 0, 0)', icon: 1 /* Circle */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Texas', color: 'rgb(0, 0, 255)', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Washington', color: 'rgb(0, 255, 0)', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
        ];
        var viewport = {
            height: 500,
            width: 150
        };
        legend = powerbi.visuals.createLegend(element, false, interactivityService, false, 2 /* Right */);
        legend.drawLegend({ dataPoints: legendData }, viewport);
        expect(legend.getMargins().width).toBe(45);
        expect(legend.getMargins().height).toBe(0);
    });
    it('legend getMargins right position resize less than min', function () {
        var legendData = [
            { label: 'California', color: 'rgb(255, 0, 0)', icon: 1 /* Circle */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Texas', color: 'rgb(0, 0, 255)', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Washington', color: 'rgb(0, 255, 0)', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
        ];
        var viewport = {
            height: 300,
            width: 88
        };
        legend = powerbi.visuals.createLegend(element, false, interactivityService, false, 2 /* Right */);
        legend.drawLegend({ dataPoints: legendData }, viewport);
        expect(legend.getMargins().width).toBe(0);
        expect(legend.getMargins().height).toBe(0);
    });
    it('legend getMargins bottom position resize less than min', function () {
        var legendData = [
            { label: 'California', color: 'rgb(255, 0, 0)', icon: 1 /* Circle */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Texas', color: 'rgb(0, 0, 255)', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Washington', color: 'rgb(0, 255, 0)', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
        ];
        var viewport = {
            height: 300,
            width: 88
        };
        legend = powerbi.visuals.createLegend(element, false, interactivityService, false, 1 /* Bottom */);
        legend.drawLegend({ dataPoints: legendData }, viewport);
        expect(legend.getMargins().width).toBe(0);
        expect(legend.getMargins().height).toBe(defaultLegendHeight);
    });
    it('legend right position title ', function () {
        var legendData = [
            { label: 'California', color: 'rgb(255, 0, 0)', icon: 1 /* Circle */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Texas', color: 'rgb(0, 0, 255)', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Washington', color: 'rgb(0, 255, 0)', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
        ];
        var viewport = {
            height: 500,
            width: 500
        };
        legend = powerbi.visuals.createLegend(element, false, interactivityService, false, 2 /* Right */);
        legend.drawLegend({ title: "Right Data", dataPoints: legendData }, viewport);
        expect($('.verticalItem').length).toBe(3);
        expect($('.legendLeftRight').length).toBe(1);
        expect($('.legend .title').length).toBe(1);
        expect($('.legend .title').text()).toBe('Right Data');
        expect($('.legend .title').css('display')).toBe('block');
    });
    it('legend top position title ', function () {
        var legendData = [
            { label: 'California', color: 'rgb(255, 0, 0)', icon: 1 /* Circle */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Texas', color: 'rgb(0, 0, 255)', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Washington', color: 'rgb(0, 255, 0)', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
        ];
        var viewport = {
            height: 500,
            width: 500
        };
        legend = powerbi.visuals.createLegend(element, false, interactivityService);
        legend.drawLegend({ title: "Top Data", dataPoints: legendData }, viewport);
        expect($('.item').length).toBe(3);
        expect($('.legendTopBottom').length).toBe(1);
        expect($('.legend .title').length).toBe(1);
        expect($('.legend .title').text()).toBe('Top Data');
        expect($('.legend .title').css('display')).toBe('inline-block');
    });
    it('legend interactivity test ', function () {
        var scopeId1 = powerbitests.mocks.dataViewScopeIdentity('California');
        var scopeId2 = powerbitests.mocks.dataViewScopeIdentity('Texas');
        var scopeId3 = powerbitests.mocks.dataViewScopeIdentity('Washington');
        var legendData = [
            { label: 'California', color: 'rgb(255, 0, 0)', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createWithId(scopeId1), selected: false },
            { label: 'Texas', color: 'rgb(0, 0, 255)', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createWithId(scopeId2), selected: false },
            { label: 'Washington', color: 'rgb(0, 255, 0)', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createWithId(scopeId3), selected: false }
        ];
        var viewport = {
            height: 500,
            width: 500
        };
        legend = powerbi.visuals.createLegend(element, false, interactivityService);
        legend.drawLegend({ title: "Top Data", dataPoints: legendData }, viewport);
        var icons = $('.icon.short');
        spyOn(hostServices, 'onSelect').and.callThrough();
        // Click first legend
        icons.first().d3Click(0, 0);
        expect(icons[0].style.backgroundColor).toBe('rgb(255, 0, 0)');
        expect(icons[1].style.backgroundColor).toBe('rgb(166, 166, 166)');
        expect(icons[2].style.backgroundColor).toBe('rgb(166, 166, 166)');
        // Control + Click legend item, should just select current and clear others
        icons.last().d3Click(0, 0, 1 /* CtrlKey */);
        expect(icons[0].style.backgroundColor).toBe('rgb(166, 166, 166)');
        expect(icons[1].style.backgroundColor).toBe('rgb(166, 166, 166)');
        expect(icons[2].style.backgroundColor).toBe('rgb(0, 255, 0)');
        // Click the container should clear the legend selection
        element.first().d3Click(0, 0);
        expect(icons[0].style.backgroundColor).toBe('rgb(255, 0, 0)');
        expect(icons[1].style.backgroundColor).toBe('rgb(0, 0, 255)');
        expect(icons[2].style.backgroundColor).toBe('rgb(0, 255, 0)');
    });
    function validateLegendDOM(expectedData) {
        var len = expectedData.length;
        var labels = $('.label');
        expect(labels.length).toBe(len);
        // Assuming all icons are lines for now.
        var icons = $('.icon.tall');
        expect(icons.length).toBe(len);
        for (var i = 0; i < len; ++i) {
            var expectedDatum = expectedData[i];
            expect($(labels.get(i)).text()).toBe(expectedDatum.label);
            expect($(icons.get(i)).attr('style').trim()).toBe(jsCommon.StringExtensions.format(colorStyle, expectedDatum.color));
        }
    }
    function getLegendData() {
        var legendData = [
            { label: 'California', color: 'red', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Washington', color: 'green', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Idaho', color: 'brown', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Alaska', color: 'white', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Montana', color: 'black', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Nevada', color: 'blue', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'New York', color: 'pink', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Texas', color: 'purple', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Louisiana', color: 'yellow', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Florida', color: 'orange', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
        ];
        return legendData;
    }
});
describe("interactive legend DOM validation", function () {
    var element;
    var viewport;
    var legend;
    var colorStyle = 'color: {0};';
    var defaultLegendHeight = 65;
    var interactivityService;
    beforeEach(function () {
        powerbi.common.localize = powerbi.common.createLocalizationService();
    });
    beforeEach(function () {
        element = powerbitests.helpers.testDom('500', '500');
        var hostServices = powerbitests.mocks.createVisualHostServices();
        interactivityService = powerbi.visuals.createInteractivityService(hostServices);
        legend = powerbi.visuals.createLegend(element, true, interactivityService);
    });
    it('legend dom validation one legend item count validation', function (done) {
        var legendData = [
            { category: 'state', label: 'California', color: 'red', icon: 2 /* Line */, measure: 5, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
        ];
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(function () {
            expect($('.interactive-legend .title').length).toBe(1);
            expect($('.interactive-legend .item').length).toBe(1);
            done();
        }, DefaultWaitForRender);
    });
    it('legend dom validation three legend items count validation', function (done) {
        var legendData = [
            { category: 'state', label: 'California', color: 'red', icon: 2 /* Line */, measure: 5, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { category: 'state', label: 'Texas', color: 'blue', icon: 2 /* Line */, measure: 10, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { category: 'state', label: 'Washington', color: 'green', icon: 2 /* Line */, measure: 15, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
        ];
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(function () {
            expect($('.interactive-legend .title').length).toBe(1);
            expect($('.interactive-legend .item').length).toBe(3);
            done();
        }, DefaultWaitForRender);
    });
    it('legend dom validation incremental build', function (done) {
        // Draw the legend once with the 3 states
        var initialData = [
            { category: 'state', label: 'California', color: 'red', icon: 0 /* Box */, measure: 5, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { category: 'state', label: 'Texas', color: 'blue', icon: 0 /* Box */, measure: 10, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { category: 'state', label: 'Washington', color: 'green', icon: 0 /* Box */, measure: 15, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
        ];
        legend.drawLegend({ dataPoints: initialData }, viewport);
        setTimeout(function () {
            validateLegendDOM(initialData);
            // Draw the legend against with a new state at the start
            var legendData = [
                { category: 'state', label: 'Alaska', color: 'red', icon: 0 /* Box */, measure: 0, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
                { category: 'state', label: 'California', color: 'blue', icon: 0 /* Box */, measure: 5, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
                { category: 'state', label: 'Texas', color: 'green', icon: 0 /* Box */, measure: 10, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
                { category: 'state', label: 'Washington', color: 'orange', icon: 0 /* Box */, measure: 15, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            ];
            legend.reset();
            legend.drawLegend({ dataPoints: legendData }, viewport);
            setTimeout(function () {
                validateLegendDOM(legendData);
                done();
            }, DefaultWaitForRender);
        }, DefaultWaitForRender);
    });
    it('legend dom validation three legend items first item name and measure', function (done) {
        var legendData = [
            { category: 'state', label: 'Alaska', color: 'red', icon: 0 /* Box */, measure: 0, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { category: 'state', label: 'California', color: 'blue', icon: 0 /* Box */, measure: 5, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { category: 'state', label: 'Texas', color: 'green', icon: 0 /* Box */, measure: 10, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
        ];
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(function () {
            expect($('.interactive-legend .title').text()).toBe(legendData[0].category);
            expect($('.interactive-legend .item').first().find('.itemName').text().trim()).toBe('Alaska');
            expect($('.interactive-legend .item').first().find('.itemMeasure').text().trim()).toBe('0');
            done();
        }, DefaultWaitForRender);
    });
    it('legend dom validation three legend items last item name and measure', function (done) {
        var legendData = [
            { category: 'state', label: 'Alaska', color: 'red', icon: 0 /* Box */, measure: 0, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { category: 'state', label: 'California', color: 'blue', icon: 0 /* Box */, measure: 5, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { category: 'state', label: 'Texas', color: 'green', icon: 0 /* Box */, measure: 10, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
        ];
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(function () {
            expect($('.interactive-legend .title').text()).toBe(legendData[0].category);
            // last item is actually the second item since values should be placed in a two-row table.
            expect($('.interactive-legend .item').last().find('.itemName').text().trim()).toBe('California');
            expect($('.interactive-legend .item').last().find('.itemMeasure').text().trim()).toBe('5');
            done();
        }, DefaultWaitForRender);
    });
    it('legend dom validation three legend items colors count', function (done) {
        var legendData = [
            { category: 'state', label: 'Alaska', color: 'red', icon: 0 /* Box */, measure: 0, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { category: 'state', label: 'California', color: 'blue', icon: 0 /* Box */, measure: 5, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { category: 'state', label: 'Texas', color: 'green', icon: 0 /* Box */, measure: 10, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
        ];
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(function () {
            expect($('.interactive-legend .icon').length).toBe(3);
            done();
        }, DefaultWaitForRender);
    });
    // Legend Height tests - legend height is constant regardless of data.
    it('legend getHeight empty', function () {
        expect(legend.getMargins().height).toBe(defaultLegendHeight);
    });
    it('legend getHeight no data', function () {
        legend.drawLegend({ dataPoints: [] }, viewport);
        expect(legend.getMargins().height).toBe(defaultLegendHeight);
    });
    it('legend getHeight data', function () {
        legend.drawLegend({
            dataPoints: [
                { category: 'state', label: 'Alaska', color: 'red', icon: 0 /* Box */, measure: 0, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
                { category: 'state', label: 'California', color: 'blue', icon: 0 /* Box */, measure: 5, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
                { category: 'state', label: 'Texas', color: 'green', icon: 0 /* Box */, measure: 10, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            ]
        }, viewport);
        expect(legend.getMargins().height).toBe(defaultLegendHeight);
    });
    it('legend getHeight one data point', function () {
        legend.drawLegend({
            dataPoints: [
                { category: 'state', label: 'Alaska', color: 'red', icon: 0 /* Box */, measure: 0, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            ]
        }, viewport);
        expect(legend.getMargins().height).toBe(defaultLegendHeight);
    });
    function validateLegendDOM(expectedData) {
        var len = expectedData.length;
        var items = $('.interactive-legend .item');
        expect($('.interactive-legend .title').length).toBe(1);
        expect(items.length).toBe(len);
        var icons = $('.interactive-legend .icon');
        expect(icons.length).toBe(len);
        // items are returned from the table, first row and then second row.
        // rearrage it to match the way the legend outputs it: by columns.
        var rearrangedItems = [];
        var rearrangedIcons = [];
        for (var i = 0; i < len; i = i + 2) {
            rearrangedItems.push($(items.get(i)));
            rearrangedIcons.push($(icons.get(i)));
        }
        for (var i = 1; i < len; i = i + 2) {
            rearrangedItems.push($(items.get(i)));
            rearrangedIcons.push($(icons.get(i)));
        }
        for (var i = 0; i < len; ++i) {
            var expectedDatum = expectedData[i];
            var item = rearrangedItems[i];
            var icon = rearrangedIcons[i];
            expect(item.find('.itemName').text()).toBe(expectedDatum.label);
            expect(item.find('.itemMeasure').text().trim()).toBe(expectedDatum.measure.toString());
            expect(icon.attr('style').trim()).toBe(jsCommon.StringExtensions.format(colorStyle, expectedDatum.color));
        }
    }
    it('legend dom validation legend label max width large tile', function (done) {
        var legend;
        element = powerbitests.helpers.testDom('500', '500');
        legend = powerbi.visuals.createLegend(element, false, interactivityService);
        viewport = {
            height: element.height(),
            width: element.width()
        };
        var legendData = [
            { label: 'California', color: 'red', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Texas', color: 'blue', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Washington', color: 'green', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
        ];
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(function () {
            expect($('.label').first().css('max-width')).toBe('178px');
            done();
        }, DefaultWaitForRender);
    });
    it('legend dom validation legend label max width small tile', function (done) {
        var legend;
        element = powerbitests.helpers.testDom('150', '250');
        legend = powerbi.visuals.createLegend(element, false, interactivityService);
        viewport = {
            height: element.height(),
            width: element.width()
        };
        var legendData = [
            { label: 'California', color: 'red', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Texas', color: 'blue', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Washington', color: 'green', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
        ];
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(function () {
            expect($('.label').first().css('max-width')).toBe('48px');
            done();
        }, DefaultWaitForRender);
    });
    it('legend dom validation legend label max width medium tile', function (done) {
        var legend;
        element = powerbitests.helpers.testDom('350', '480');
        legend = powerbi.visuals.createLegend(element, false, interactivityService);
        viewport = {
            height: element.height(),
            width: element.width()
        };
        var legendData = [
            { label: 'California', color: 'red', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Texas', color: 'blue', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Washington', color: 'green', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
        ];
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(function () {
            expect($('.label').first().css('max-width')).toBe('110px');
            done();
        }, DefaultWaitForRender);
    });
    it('legend dom validation legend count medium tile', function (done) {
        var legend;
        legend = powerbi.visuals.createLegend(element, false, interactivityService);
        element = powerbitests.helpers.testDom('350', '480');
        viewport = {
            height: element.height(),
            width: element.width()
        };
        var legendData = [
            { label: 'California', color: 'red', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Texas', color: 'blue', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Washington', color: 'green', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Oregon', color: 'purple', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'New york', color: 'cyan', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Chicago', color: 'yellow', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Nevada', color: 'black', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Arizona', color: 'darkred', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Florida', color: 'darksalmon', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Hawaii', color: 'crimson', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
        ];
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(function () {
            expect($('.label').length).toBeLessThan(11);
            done();
        }, DefaultWaitForRender);
    });
    it('legend dom validation legend label max width medium tile', function (done) {
        var legend;
        element = powerbitests.helpers.testDom('350', '480');
        legend = powerbi.visuals.createLegend(element, false, interactivityService);
        viewport = {
            height: element.height(),
            width: element.width()
        };
        var legendData = [
            { label: 'California', color: 'red', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Texas', color: 'blue', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Washington', color: 'green', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Oregon', color: 'purple', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'New york', color: 'cyan', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Chicago', color: 'yellow', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Nevada', color: 'black', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Arizona', color: 'darkred', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Florida', color: 'darksalmon', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Hawaii', color: 'crimson', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
        ];
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(function () {
            expect($('.label').first().css('max-width')).toBe('66px');
            done();
        }, DefaultWaitForRender);
    });
});
