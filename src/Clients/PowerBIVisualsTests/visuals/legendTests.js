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
            expect($('.legendItem').length).toBe(1);
            expect($('.legendText').length).toBe(1);
            expect($('.legendIcon').length).toBe(1);
            done();
        }, DefaultWaitForRender);
    });
    it('legend dom validation three legend items count validation', function (done) {
        var legendData = [
            { label: 'California', color: '#ff0000', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Texas', color: '#0000ff', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Washington', color: '00ff00', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
        ];
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(function () {
            expect($('.legendItem').length).toBe(3);
            expect($('.legendText').length).toBe(3);
            expect($('.legendIcon').length).toBe(3);
            done();
        }, DefaultWaitForRender);
    });
    it('legend dom validation incremental build', function (done) {
        // Draw the legend once with the 3 states
        var initialData = [
            { label: 'California', color: '#fff000', icon: 0 /* Box */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Texas', color: '#ff00ff', icon: 0 /* Box */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Washington', color: '#fff000', icon: 0 /* Box */, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
        ];
        legend.drawLegend({ dataPoints: initialData }, viewport);
        setTimeout(function () {
            validateLegendDOM(initialData);
            // Draw the legend against with a new state at the start
            var legendData = [
                { label: 'Alaska', color: '#fff000', icon: 0 /* Box */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
                { label: 'California', color: '#fff00d', icon: 0 /* Box */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
                { label: 'Texas', color: '#fffe00', icon: 0 /* Box */, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
                { label: 'Washington', color: '#0000dd', icon: 0 /* Box */, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
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
            expect($('.legendText').first().text()).toBe('California');
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
            expect($('.legendText').last().text()).toBe('Washington');
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
            expect($('.legendIcon').length).toBe(3);
            done();
        }, DefaultWaitForRender);
    });
    it('legend with title', function () {
        var legendData = getLotsOfLegendData();
        legend.drawLegend({ dataPoints: legendData, title: 'states' }, viewport);
        powerbi.visuals.SVGUtil.flushAllD3Transitions();
        expect($('.legendTitle').length).toBe(1);
    });
    it('legend no title', function () {
        var legendData = getLotsOfLegendData();
        legend.drawLegend({ dataPoints: legendData }, viewport);
        powerbi.visuals.SVGUtil.flushAllD3Transitions();
        expect($('.legendTitle').length).toBe(0);
    });
    it('legend Top & horizontal trim', function () {
        var legendData = getLotsOfLegendData();
        legend.changeOrientation(0 /* Top */);
        legend.drawLegend({ dataPoints: legendData }, { height: 100, width: 1000 });
        powerbi.visuals.SVGUtil.flushAllD3Transitions();
        expect($('.legendItem').length).toBeGreaterThan(5);
        expect($('.legendItem').length).toBeLessThan(52);
    });
    it('legend Bottom & horizontal trim', function () {
        var legendData = getLotsOfLegendData();
        legend.changeOrientation(1 /* Bottom */);
        legend.drawLegend({ dataPoints: legendData }, { height: 100, width: 1000 });
        powerbi.visuals.SVGUtil.flushAllD3Transitions();
        expect($('.legendItem').length).toBeGreaterThan(5);
        expect($('.legendItem').length).toBeLessThan(52);
    });
    it('legend Left & vertical trim', function () {
        var legendData = getLotsOfLegendData();
        legend.changeOrientation(3 /* Left */);
        legend.drawLegend({ dataPoints: legendData }, { height: 200, width: 1000 });
        powerbi.visuals.SVGUtil.flushAllD3Transitions();
        expect($('.legendItem').length).toBeGreaterThan(5);
        expect($('.legendItem').length).toBeLessThan(52);
    });
    it('legend Right & vertical trim', function () {
        var legendData = getLotsOfLegendData();
        legend.changeOrientation(2 /* Right */);
        legend.drawLegend({ dataPoints: legendData }, { height: 200, width: 1000 });
        powerbi.visuals.SVGUtil.flushAllD3Transitions();
        expect($('.legendItem').length).toBeGreaterThan(5);
        expect($('.legendItem').length).toBeLessThan(52);
    });
    it('Intelligent Layout: Low label count should result in longer max-width', function () {
        var legendData = [{
            label: 'Really long label, but i have the space to show',
            color: 'red',
            icon: 2 /* Line */,
            identity: powerbi.visuals.SelectionId.createNull(),
            selected: false
        }];
        legend.changeOrientation(0 /* Top */);
        legend.drawLegend({ dataPoints: legendData }, { height: 100, width: 1000 });
        powerbi.visuals.SVGUtil.flushAllD3Transitions();
        expect($('.legendItem').length).toBe(1);
        expect($($('.legendText')[0]).text()).not.toContain('...');
    });
    it('Intelligent Layout: Lots of small labels should get compacted in horizontal layout', function () {
        var legendData = getLotsOfLegendData();
        legend.changeOrientation(0 /* Top */);
        legend.drawLegend({ dataPoints: legendData }, { height: 100, width: 1000 });
        powerbi.visuals.SVGUtil.flushAllD3Transitions();
        expect($('.legendItem').length).toBe(25);
    });
    it('Intelligent Layout: If labels in horizontal layout have small widths, width of legend should be small', function () {
        var legendData = getLotsOfLegendData();
        legend.changeOrientation(2 /* Right */);
        legend.drawLegend({ dataPoints: legendData }, { height: 100, width: 1000 });
        powerbi.visuals.SVGUtil.flushAllD3Transitions();
        expect(legend.getMargins().width).toBeLessThan(200);
    });
    it('Intelligent Layout: If labels in horizontal layout have large widths, width of legend should be 30% of viewport', function () {
        var legendData = [{
            label: 'I am a really long label, but you should not allow me to take more than 300px',
            color: 'red',
            icon: 2 /* Line */,
            identity: powerbi.visuals.SelectionId.createNull(),
            selected: false
        }];
        legend.changeOrientation(2 /* Right */);
        legend.drawLegend({ dataPoints: legendData }, { height: 100, width: 1000 });
        powerbi.visuals.SVGUtil.flushAllD3Transitions();
        expect(legend.getMargins().width).toBe(300);
    });
    it('legend interactivity test ', function () {
        var scopeId1 = powerbitests.mocks.dataViewScopeIdentity('California');
        var scopeId2 = powerbitests.mocks.dataViewScopeIdentity('Texas');
        var scopeId3 = powerbitests.mocks.dataViewScopeIdentity('Washington');
        var legendData = [
            { label: 'California', color: '#ff0000', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createWithId(scopeId1), selected: false },
            { label: 'Texas', color: '#0000ff', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createWithId(scopeId2), selected: false },
            { label: 'Washington', color: '#00ff00', icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createWithId(scopeId3), selected: false }
        ];
        var viewport = {
            height: 500,
            width: 500
        };
        legend = powerbi.visuals.createLegend(element, false, interactivityService);
        legend.drawLegend({ title: "Top Data", dataPoints: legendData }, viewport);
        var icons = $('.legendIcon');
        spyOn(hostServices, 'onSelect').and.callThrough();
        // Click first legend
        icons.first().d3Click(0, 0);
        expect(icons[0].style.fill).toBe('#ff0000');
        expect(icons[1].style.fill).toBe('#a6a6a6');
        expect(icons[2].style.fill).toBe('#a6a6a6');
        // Control + Click legend item, should just select current and clear others
        icons.last().d3Click(0, 0, 1 /* CtrlKey */);
        expect(icons[0].style.fill).toBe('#a6a6a6');
        expect(icons[1].style.fill).toBe('#a6a6a6');
        expect(icons[2].style.fill).toBe('#00ff00');
        // Click the container should clear the legend selection
        element.first().d3Click(0, 0);
        expect(icons[0].style.fill).toBe('#ff0000');
        expect(icons[1].style.fill).toBe('#0000ff');
        expect(icons[2].style.fill).toBe('#00ff00');
    });
    function validateLegendDOM(expectedData) {
        var len = expectedData.length;
        var labels = $('.legendText');
        expect(labels.length).toBe(len);
        var icons = $('.legendIcon');
        expect(icons.length).toBe(len);
        for (var i = 0; i < len; ++i) {
            var expectedDatum = expectedData[i];
            expect($(labels.get(i)).text()).toBe(expectedDatum.label);
            expect($(icons.get(i)).css('fill')).toBe(expectedDatum.color);
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
    function getLotsOfLegendData() {
        var states = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY', 'AE', 'AA', 'AP'];
        var colors = d3.scale.category20c();
        var legendData = [];
        for (var i = 0; i < states.length; i++) {
            legendData.push({ label: states[i], color: colors(i), icon: 2 /* Line */, identity: powerbi.visuals.SelectionId.createNull(), selected: false });
        }
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
});
