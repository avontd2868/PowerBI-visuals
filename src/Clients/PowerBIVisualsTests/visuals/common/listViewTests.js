//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbitests;
(function (powerbitests) {
    var ListViewFactory = powerbi.visuals.ListViewFactory;
    var DefaultRenderTime = 10;
    describe("List view tests", function () {
        var element;
        var rowExit = function (rowSelection) {
            rowSelection.remove();
        };
        beforeEach(function () {
            element = powerbitests.helpers.testDom('200', '200');
        });
        function generateNestedData(tuples) {
            var testData = [];
            for (var i = 0; i < tuples.length; i++) {
                testData.push({
                    id: i,
                    children: [{ name: tuples[i].first }, { name: tuples[i].second }]
                });
            }
            return testData;
        }
        function createHTMLListViewOptions() {
            var rowEnter = function (rowSelection) {
                rowSelection.append('div').style('height', '30px').classed('item', true).selectAll('span').data(function (d) {
                    return d.children;
                }).enter().append("span");
            };
            var rowUpdate = function (rowSelection) {
                rowSelection.selectAll('.item').selectAll('span').text(function (d) {
                    return '-->' + d.name;
                });
            };
            return {
                enter: rowEnter,
                exit: rowExit,
                update: rowUpdate,
                loadMoreData: function () {
                },
                baseContainer: d3.select(element.get(0)),
                rowHeight: 30,
                viewport: { height: 200, width: 200 }
            };
        }
        function createSVGListViewOptions() {
            var rowEnterSVG = function (rowSelection) {
                rowSelection.append('g').style('height', '30px').classed('item', true).selectAll('g').data(function (d) {
                    return d.children;
                }).enter().append("span").classed('column', true);
            };
            var rowUpdateSVG = function (rowSelection) {
                rowSelection.selectAll('.item').selectAll('.column').text(function (d) {
                    return '-->' + d.name;
                });
            };
            return {
                enter: rowEnterSVG,
                exit: rowExit,
                update: rowUpdateSVG,
                loadMoreData: function () {
                },
                baseContainer: d3.select(element.get(0)),
                rowHeight: 30,
                viewport: { height: 200, width: 200 }
            };
        }
        function createHTMLListView(options) {
            var data = generateNestedData([
                { first: 'Mickey', second: 'Mouse' },
                { first: 'Mini', second: 'Mouse' },
                { first: 'Daffy', second: 'Duck' },
                { first: 'Captain', second: 'Planet' },
                { first: 'Russell', second: 'Wilson' },
                { first: 'Jack', second: 'Sparrow' },
                { first: 'James', second: 'Bond' },
                { first: 'Sea', second: 'Hawks' },
                { first: 'Sachin', second: 'Patney' },
            ]);
            var listView = ListViewFactory.createHTMLListView(options);
            listView.data(data, function (d) { return d.id; }).render(true);
        }
        function createSVGLListView(options) {
            var data = generateNestedData([
                { first: 'Mickey', second: 'Mouse' },
                { first: 'Mini', second: 'Mouse' },
                { first: 'Daffy', second: 'Duck' },
                { first: 'Captain', second: 'Planet' },
                { first: 'Russell', second: 'Wilson' },
                { first: 'Jack', second: 'Sparrow' },
                { first: 'James', second: 'Bond' },
                { first: 'Sea', second: 'Hawks' },
                { first: 'Sachin', second: 'Patney' },
            ]);
            var listView = ListViewFactory.createSVGListView(options);
            listView.data(data, function (d) {
                return d.id;
            }).render(true);
        }
        it('Create HTML List View Correctly', function (done) {
            createHTMLListView(createHTMLListViewOptions());
            setTimeout(function () {
                var itemCount = element.find('.item').length;
                expect(itemCount).toBeGreaterThan(0);
                expect(itemCount).toBeLessThan(9); // Some should be virtualized, so shouldn't show all 9 items
                done();
            }, DefaultRenderTime);
        });
        it('Create SVG List View Correctly', function (done) {
            createSVGLListView(createSVGListViewOptions());
            setTimeout(function () {
                var itemCount = element.find('.item').length;
                expect(itemCount).toBeGreaterThan(0);
                expect(itemCount).toBeLessThan(9); // Some should be virtualized, so shouldn't show all 9 items
                done();
            }, DefaultRenderTime);
        });
        it('Scroll to last to check if items come in view HTML', function (done) {
            var options = createHTMLListViewOptions();
            var spy = spyOn(options, "loadMoreData");
            createHTMLListView(options);
            var lastElem = element.find('.item').last().text();
            expect(lastElem).not.toEqual('-->Sachin-->Patney');
            element.scrollTop(1000);
            setTimeout(function () {
                var lastElem2 = element.find('.item').last().text();
                expect(lastElem2).toEqual('-->Sachin-->Patney');
                expect(spy).toHaveBeenCalled();
                done();
            }, DefaultRenderTime);
        });
        it('Scroll to last to check if items come in view SVG', function (done) {
            var options = createSVGListViewOptions();
            var spy = spyOn(options, "loadMoreData");
            createSVGLListView(options);
            var lastElem = element.find('.item').last().text();
            expect(lastElem).not.toEqual('-->Sachin-->Patney');
            element.scrollTop(1000);
            setTimeout(function () {
                var lastElem2 = element.find('.item').last().text();
                expect(lastElem2).toEqual('-->Sachin-->Patney');
                expect(spy).toHaveBeenCalled();
                done();
            }, DefaultRenderTime);
        });
        it('Reset scrollbar position when ResetScrollbar flag is set', function (done) {
            var options = createHTMLListViewOptions();
            var data = generateNestedData([
                { first: 'Mickey', second: 'Mouse' },
                { first: 'Mini', second: 'Mouse' },
                { first: 'Daffy', second: 'Duck' },
                { first: 'Captain', second: 'Planet' },
                { first: 'Russell', second: 'Wilson' },
                { first: 'Jack', second: 'Sparrow' },
                { first: 'James', second: 'Bond' },
                { first: 'Sea', second: 'Hawks' },
            ]);
            var listView = ListViewFactory.createHTMLListView(options);
            listView.data(data, function (d) { return d.id; }).render(true);
            element.scrollTop(1000);
            setTimeout(function () {
                expect(element.find('.scrollRegion').first().parent().scrollTop()).toBe(40);
                listView.data(data, function (d) { return d.id; }).render(true, false);
                expect(element.find('.scrollRegion').first().parent().scrollTop()).toBe(40);
                listView.data(data, function (d) { return d.id; }).render(true, true);
                expect(element.find('.scrollRegion').first().parent().scrollTop()).toBe(0);
                done();
            }, DefaultRenderTime);
        });
    });
})(powerbitests || (powerbitests = {}));
