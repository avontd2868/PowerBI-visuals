//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
import ILegend = powerbi.visuals.ILegend;
import LegendIcon = powerbi.visuals.LegendIcon;
import LegendPosition = powerbi.visuals.LegendPosition;
import IInteractivityService = powerbi.visuals.IInteractivityService;
import IVisualHostServices = powerbi.IVisualHostServices;
var DefaultWaitForRender = 10;

describe("legendChart DOM validation", () => {
    var element: JQuery;
    var viewport: powerbi.IViewport;
    var legend: ILegend;
    var interactivityService: IInteractivityService;
    var hostServices: IVisualHostServices;

    beforeEach(() => {
        powerbi.common.localize = powerbi.common.createLocalizationService();
    });

    beforeEach(() => {
        element = powerbitests.helpers.testDom('500', '500');
        hostServices = powerbitests.mocks.createVisualHostServices();
        interactivityService = powerbi.visuals.createInteractivityService(hostServices);
        legend = powerbi.visuals.createLegend(element, false, interactivityService);
        viewport = {
            height: element.height(),
            width: element.width()
        };
    });

    it('legend dom validation one legend item count validation', (done) => {
        var legendData: powerbi.visuals.LegendDataPoint[] = [
            {
                label: 'California', color: 'red', icon: LegendIcon.Line, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
        ];
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(() => {
            expect($('.legendItem').length).toBe(1);
            expect($('.legendText').length).toBe(1);
            expect($('.legendIcon').length).toBe(1);
            done();
        }, DefaultWaitForRender);
    });

    it('legend dom validation three legend items count validation', (done) => {
        var legendData: powerbi.visuals.LegendDataPoint[] = [
            { label: 'California', color: '#ff0000', icon: LegendIcon.Line, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Texas', color: '#0000ff', icon: LegendIcon.Line, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Washington', color: '00ff00', icon: LegendIcon.Line, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
        ];
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(() => {
            expect($('.legendItem').length).toBe(3);
            expect($('.legendText').length).toBe(3);
            expect($('.legendIcon').length).toBe(3);
            done();
        }, DefaultWaitForRender);
    });

    it('legend dom validation incremental build', (done) => {
        // Draw the legend once with the 3 states
        var initialData: powerbi.visuals.LegendDataPoint[] = [
            { label: 'California', color: '#fff000', icon: LegendIcon.Box, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Texas', color: '#ff00ff', icon: LegendIcon.Box, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Washington', color: '#fff000', icon: LegendIcon.Box, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
        ];

        legend.drawLegend({ dataPoints: initialData }, viewport);
        setTimeout(() => {
            validateLegendDOM(initialData);

            // Draw the legend against with a new state at the start
            var legendData: powerbi.visuals.LegendDataPoint[] = [
                { label: 'Alaska', color: '#fff000', icon: LegendIcon.Box, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
                { label: 'California', color: '#fff00d', icon: LegendIcon.Box, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
                { label: 'Texas', color: '#fffe00', icon: LegendIcon.Box, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
                { label: 'Washington', color: '#0000dd', icon: LegendIcon.Box, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
            ];
            legend.reset();
            legend.drawLegend({ dataPoints: legendData }, viewport);
            setTimeout(() => {
                validateLegendDOM(legendData);
                done();
            }, DefaultWaitForRender);
        }, DefaultWaitForRender);
    });

    it('legend dom validation three legend items first item text', (done) => {
        var legendData: powerbi.visuals.LegendDataPoint[] = [
            { label: 'California', color: 'red', icon: LegendIcon.Line, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Texas', color: 'blue', icon: LegendIcon.Line, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Washington', color: 'green', icon: LegendIcon.Line, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
        ];
        legend.reset();
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(() => {
            expect($('.legendText').first().text()).toBe('California');
            done();
        }, DefaultWaitForRender);
    });

    it('legend dom validation three legend items last item text', (done) => {
        var legendData: powerbi.visuals.LegendDataPoint[] = [
            { label: 'California', color: 'red', icon: LegendIcon.Line, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Texas', color: 'blue', icon: LegendIcon.Line, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Washington', color: 'green', icon: LegendIcon.Line, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
        ];
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(() => {
            expect($('.legendText').last().text()).toBe('Washington');
            done();
        }, DefaultWaitForRender);
    });

    it('legend dom validation three legend items colors count', (done) => {
        var legendData: powerbi.visuals.LegendDataPoint[] = [
            { label: 'California', color: 'red', icon: LegendIcon.Line, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Texas', color: 'blue', icon: LegendIcon.Line, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { label: 'Washington', color: 'green', icon: LegendIcon.Line, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
        ];
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(() => {
            expect($('.legendIcon').length).toBe(3);
            done();
        }, DefaultWaitForRender);
    });

    it('legend with title',() => {
        var legendData = getLotsOfLegendData();
        legend.drawLegend({ dataPoints: legendData, title: 'states' }, viewport);
        powerbi.visuals.SVGUtil.flushAllD3Transitions();
        expect($('.legendTitle').length).toBe(1);
    });

    it('legend no title',() => {
        var legendData = getLotsOfLegendData();
        legend.drawLegend({ dataPoints: legendData }, viewport);
        powerbi.visuals.SVGUtil.flushAllD3Transitions();
        expect($('.legendTitle').length).toBe(0);
    });

    it('legend Top & horizontal trim',() => {
        var legendData = getLotsOfLegendData();
        legend.changeOrientation(LegendPosition.Top);
        legend.drawLegend({ dataPoints: legendData }, {height: 100, width: 1000});
        powerbi.visuals.SVGUtil.flushAllD3Transitions();
        expect($('.legendItem').length).toBeGreaterThan(5);
        expect($('.legendItem').length).toBeLessThan(52);
    });

    it('legend Bottom & horizontal trim',() => {
        var legendData = getLotsOfLegendData();
        legend.changeOrientation(LegendPosition.Bottom);
        legend.drawLegend({ dataPoints: legendData }, { height: 100, width: 1000 });
        powerbi.visuals.SVGUtil.flushAllD3Transitions();
        expect($('.legendItem').length).toBeGreaterThan(5);
        expect($('.legendItem').length).toBeLessThan(52);
    });

    it('legend Left & vertical trim',() => {
        var legendData = getLotsOfLegendData();
        legend.changeOrientation(LegendPosition.Left);
        legend.drawLegend({ dataPoints: legendData }, { height: 200, width: 1000 });
        powerbi.visuals.SVGUtil.flushAllD3Transitions();
        expect($('.legendItem').length).toBeGreaterThan(5);
        expect($('.legendItem').length).toBeLessThan(52);
    });

    it('legend Right & vertical trim',() => {
        var legendData = getLotsOfLegendData();
        legend.changeOrientation(LegendPosition.Right);
        legend.drawLegend({ dataPoints: legendData }, { height: 200, width: 1000 });
        powerbi.visuals.SVGUtil.flushAllD3Transitions();
        expect($('.legendItem').length).toBeGreaterThan(5);
        expect($('.legendItem').length).toBeLessThan(52);
    });

    it('Intelligent Layout: Low label count should result in longer max-width',() => {
        var legendData = [{
            label: 'Really long label, but i have the space to show',
            color: 'red',
            icon: LegendIcon.Line,
            identity: powerbi.visuals.SelectionId.createNull(), selected: false
        }];
        legend.changeOrientation(LegendPosition.Top);
        legend.drawLegend({ dataPoints: legendData }, { height: 100, width: 1000 });
        powerbi.visuals.SVGUtil.flushAllD3Transitions();
        expect($('.legendItem').length).toBe(1);
        expect($($('.legendText')[0]).text()).not.toContain('...');
    });

    it('Intelligent Layout: Lots of small labels should get compacted in horizontal layout',() => {
        var legendData = getLotsOfLegendData();
        legend.changeOrientation(LegendPosition.Top);
        legend.drawLegend({ dataPoints: legendData }, { height: 100, width: 1000 });
        powerbi.visuals.SVGUtil.flushAllD3Transitions();
        expect($('.legendItem').length).toBe(25);
    });

    it('Intelligent Layout: If labels in horizontal layout have small widths, width of legend should be small',() => {
        var legendData = getLotsOfLegendData();
        legend.changeOrientation(LegendPosition.Right);
        legend.drawLegend({ dataPoints: legendData }, { height: 100, width: 1000 });
        powerbi.visuals.SVGUtil.flushAllD3Transitions();
        expect(legend.getMargins().width).toBeLessThan(200);
    });

    it('Intelligent Layout: If labels in horizontal layout have large widths, width of legend should be 30% of viewport',() => {
        var legendData = [{
            label: 'I am a really long label, but you should not allow me to take more than 300px',
            color: 'red',
            icon: LegendIcon.Line,
            identity: powerbi.visuals.SelectionId.createNull(), selected: false
        }];
        legend.changeOrientation(LegendPosition.Right);
        legend.drawLegend({ dataPoints: legendData }, { height: 100, width: 1000 });
        powerbi.visuals.SVGUtil.flushAllD3Transitions();
        expect(legend.getMargins().width).toBe(300);
    });

    it('legend interactivity test ', () => {
        var scopeId1 = powerbitests.mocks.dataViewScopeIdentity('California');
        var scopeId2 = powerbitests.mocks.dataViewScopeIdentity('Texas');
        var scopeId3 = powerbitests.mocks.dataViewScopeIdentity('Washington');
        var legendData = [
            { label: 'California', color: '#ff0000', icon: LegendIcon.Line, identity: powerbi.visuals.SelectionId.createWithId(scopeId1), selected: false },
            { label: 'Texas', color: '#0000ff', icon: LegendIcon.Line, identity: powerbi.visuals.SelectionId.createWithId(scopeId2), selected: false },
            { label: 'Washington', color: '#00ff00', icon: LegendIcon.Line, identity: powerbi.visuals.SelectionId.createWithId(scopeId3), selected: false }
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
        (<any>icons.first()).d3Click(0, 0);
        expect(icons[0].style.fill).toBe('#ff0000');
        expect(icons[1].style.fill).toBe('#a6a6a6');
        expect(icons[2].style.fill).toBe('#a6a6a6');

        // Control + Click legend item, should just select current and clear others
        (<any>icons.last()).d3Click(0, 0, powerbitests.helpers.ClickEventType.CtrlKey);
        expect(icons[0].style.fill).toBe('#a6a6a6');
        expect(icons[1].style.fill).toBe('#a6a6a6');
        expect(icons[2].style.fill).toBe('#00ff00');

        // Click the container should clear the legend selection
        (<any>element.first()).d3Click(0, 0);
        expect(icons[0].style.fill).toBe('#ff0000');
        expect(icons[1].style.fill).toBe('#0000ff');
        expect(icons[2].style.fill).toBe('#00ff00');
        
    });

    function validateLegendDOM(expectedData: powerbi.visuals.LegendDataPoint[]): void {
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

    function getLotsOfLegendData(): powerbi.visuals.LegendDataPoint[]{
        var states = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO',
            'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID',
            'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD',
            'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
            'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR',
            'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT',
            'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY', 'AE', 'AA',
            'AP'];

        var colors = d3.scale.category20c();
        var legendData: powerbi.visuals.LegendDataPoint[] = [];
        for (var i = 0; i < states.length; i++) {
            legendData.push({ label: states[i], color: colors(i), icon: LegendIcon.Line, identity: powerbi.visuals.SelectionId.createNull(), selected: false });
        }

        return legendData;
    }
});

describe("interactive legend DOM validation", () => {
    var element: JQuery;
    var viewport: powerbi.IViewport;
    var legend: ILegend;
    var colorStyle = 'color: {0};';
    var defaultLegendHeight = 65;
    var interactivityService: IInteractivityService;

    beforeEach(() => {
        powerbi.common.localize = powerbi.common.createLocalizationService();
    });

    beforeEach(() => {
        element = powerbitests.helpers.testDom('500', '500');
        var hostServices = powerbitests.mocks.createVisualHostServices();
        interactivityService = powerbi.visuals.createInteractivityService(hostServices);
        legend = powerbi.visuals.createLegend(element, true,interactivityService);
    });

    it('legend dom validation one legend item count validation', (done) => {
        var legendData: powerbi.visuals.LegendDataPoint[] = [
            { category: 'state', label: 'California', color: 'red', icon: LegendIcon.Line, measure: 5, identity: powerbi.visuals.SelectionId.createNull(), selected: false }
        ];
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(() => {
            expect($('.interactive-legend .title').length).toBe(1);
            expect($('.interactive-legend .item').length).toBe(1);
            done();
        }, DefaultWaitForRender);
    });

    it('legend dom validation three legend items count validation', (done) => {
        var legendData: powerbi.visuals.LegendDataPoint[] = [
            { category: 'state', label: 'California', color: 'red', icon: LegendIcon.Line, measure: 5, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { category: 'state', label: 'Texas', color: 'blue', icon: LegendIcon.Line, measure: 10, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { category: 'state', label: 'Washington', color: 'green', icon: LegendIcon.Line, measure: 15, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
        ];
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(() => {
            expect($('.interactive-legend .title').length).toBe(1);
            expect($('.interactive-legend .item').length).toBe(3);
            done();
        }, DefaultWaitForRender);
    });

    it('legend dom validation incremental build', (done) => {
        // Draw the legend once with the 3 states
        var initialData: powerbi.visuals.LegendDataPoint[] = [
            { category: 'state', label: 'California', color: 'red', icon: LegendIcon.Box, measure: 5, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { category: 'state', label: 'Texas', color: 'blue', icon: LegendIcon.Box, measure: 10, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { category: 'state', label: 'Washington', color: 'green', icon: LegendIcon.Box, measure: 15, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
        ];

        legend.drawLegend({ dataPoints: initialData }, viewport);
        setTimeout(() => {
            validateLegendDOM(initialData);

            // Draw the legend against with a new state at the start
            var legendData: powerbi.visuals.LegendDataPoint[] = [
                { category: 'state', label: 'Alaska', color: 'red', icon: LegendIcon.Box, measure: 0, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
                { category: 'state', label: 'California', color: 'blue', icon: LegendIcon.Box, measure: 5, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
                { category: 'state', label: 'Texas', color: 'green', icon: LegendIcon.Box, measure: 10, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
                { category: 'state', label: 'Washington', color: 'orange', icon: LegendIcon.Box, measure: 15, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            ];
            legend.reset();
            legend.drawLegend({ dataPoints: legendData }, viewport);
            setTimeout(() => {
                validateLegendDOM(legendData);
                done();
            }, DefaultWaitForRender);
        }, DefaultWaitForRender);
    });

    it('legend dom validation three legend items first item name and measure', (done) => {
        var legendData: powerbi.visuals.LegendDataPoint[] = [
            { category: 'state', label: 'Alaska', color: 'red', icon: LegendIcon.Box, measure: 0, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { category: 'state', label: 'California', color: 'blue', icon: LegendIcon.Box, measure: 5, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { category: 'state', label: 'Texas', color: 'green', icon: LegendIcon.Box, measure: 10, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
        ];
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(() => {
            expect($('.interactive-legend .title').text()).toBe(legendData[0].category);
            expect($('.interactive-legend .item').first().find('.itemName').text().trim()).toBe('Alaska');
            expect($('.interactive-legend .item').first().find('.itemMeasure').text().trim()).toBe('0');
            done();
        }, DefaultWaitForRender);
    });

    it('legend dom validation three legend items last item name and measure', (done) => {
        var legendData: powerbi.visuals.LegendDataPoint[] = [
            { category: 'state', label: 'Alaska', color: 'red', icon: LegendIcon.Box, measure: 0, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { category: 'state', label: 'California', color: 'blue', icon: LegendIcon.Box, measure: 5, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { category: 'state', label: 'Texas', color: 'green', icon: LegendIcon.Box, measure: 10, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
        ];
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(() => {
            expect($('.interactive-legend .title').text()).toBe(legendData[0].category);
            // last item is actually the second item since values should be placed in a two-row table.
            expect($('.interactive-legend .item').last().find('.itemName').text().trim()).toBe('California');
            expect($('.interactive-legend .item').last().find('.itemMeasure').text().trim()).toBe('5');
            done();
        }, DefaultWaitForRender);
    });

    it('legend dom validation three legend items colors count', (done) => {
        var legendData: powerbi.visuals.LegendDataPoint[] = [
            { category: 'state', label: 'Alaska', color: 'red', icon: LegendIcon.Box, measure: 0, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { category: 'state', label: 'California', color: 'blue', icon: LegendIcon.Box, measure: 5, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            { category: 'state', label: 'Texas', color: 'green', icon: LegendIcon.Box, measure: 10, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
        ];
        legend.drawLegend({ dataPoints: legendData }, viewport);
        setTimeout(() => {
            expect($('.interactive-legend .icon').length).toBe(3);
            done();
        }, DefaultWaitForRender);
    });

    // Legend Height tests - legend height is constant regardless of data.

    it('legend getHeight empty', () => {
        expect(legend.getMargins().height).toBe(defaultLegendHeight);
    });

    it('legend getHeight no data', () => {
        legend.drawLegend({ dataPoints: [] }, viewport);

        expect(legend.getMargins().height).toBe(defaultLegendHeight);
    });

    it('legend getHeight data', () => {
        legend.drawLegend({
            dataPoints: [
                { category: 'state', label: 'Alaska', color: 'red', icon: LegendIcon.Box, measure: 0, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
                { category: 'state', label: 'California', color: 'blue', icon: LegendIcon.Box, measure: 5, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
                { category: 'state', label: 'Texas', color: 'green', icon: LegendIcon.Box, measure: 10, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            ]
        }, viewport);

        expect(legend.getMargins().height).toBe(defaultLegendHeight);
    });

    it('legend getHeight one data point', () => {
        legend.drawLegend({
            dataPoints: [
                { category: 'state', label: 'Alaska', color: 'red', icon: LegendIcon.Box, measure: 0, identity: powerbi.visuals.SelectionId.createNull(), selected: false },
            ]
        }, viewport);

        expect(legend.getMargins().height).toBe(defaultLegendHeight);
    });

    function validateLegendDOM(expectedData: powerbi.visuals.LegendDataPoint[]): void {
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
