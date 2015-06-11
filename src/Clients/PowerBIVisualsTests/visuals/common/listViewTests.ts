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
    import ListViewFactory = powerbi.visuals.ListViewFactory;
    import ListViewOptions = powerbi.visuals.ListViewOptions;

    var DefaultRenderTime = 10;

    describe("List view tests", () => {
        var element: JQuery;

        var rowExit = (rowSelection: D3.Selection) => {
            rowSelection.remove();
        };

        beforeEach(() => {
            element = powerbitests.helpers.testDom('200', '200');
        });

        function generateNestedData(tuples: any[]) {
            var testData = [];

            for (var i = 0; i < tuples.length; i++) {
                testData.push({
                    id: i,
                    children: [{ name: tuples[i].first }, { name: tuples[i].second }]
                });
            }

            return testData;
        }

        function createHTMLListViewOptions(): ListViewOptions {
            var rowEnter = (rowSelection: D3.Selection) => {
                rowSelection
                    .append('div')
                    .style('height', '30px')
                    .classed('item', true)
                    .selectAll('span')
                    .data(d => {
                        return d.children;
                    })
                    .enter()
                    .append("span");
            };

            var rowUpdate = (rowSelection: D3.Selection) => {
                rowSelection
                    .selectAll('.item')
                    .selectAll('span')
                    .text(d => {
                        return '-->' + d.name;
                    });
            };

            return {
                enter: rowEnter,
                exit: rowExit,
                update: rowUpdate,
                loadMoreData: () => { },
                baseContainer: d3.select(element.get(0)),
                rowHeight: 30,
                viewport: { height: 200, width: 200 }
            };
        }

        function createSVGListViewOptions(): ListViewOptions {
            var rowEnterSVG = (rowSelection: D3.Selection) => {
                rowSelection
                    .append('g')
                    .style('height', '30px')
                    .classed('item', true)
                    .selectAll('g')
                    .data(d => {
                        return d.children;
                    })
                    .enter()
                    .append("span")
                    .classed('column', true);
            };

            var rowUpdateSVG = (rowSelection: D3.Selection) => {
                rowSelection
                    .selectAll('.item')
                    .selectAll('.column')
                    .text(d => {
                        return '-->' + d.name;
                    });
            };

            return {
                enter: rowEnterSVG,
                exit: rowExit,
                update: rowUpdateSVG,
                loadMoreData: () => { },
                baseContainer: d3.select(element.get(0)),
                rowHeight: 30,
                viewport: { height: 200, width: 200 }
            };
        }

        function createHTMLListView(options: ListViewOptions) {
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
            listView.data(data, d => d.id)
                .render(true);
        }

        function createSVGLListView(options: ListViewOptions) {
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
            listView.data(data, d => { return d.id; })
                .render(true);
        }

        it('Create HTML List View Correctly', (done) => {
            createHTMLListView(createHTMLListViewOptions());
            setTimeout(() => {
                var itemCount = element.find('.item').length;
                expect(itemCount).toBeGreaterThan(0);
                expect(itemCount).toBeLessThan(9); // Some should be virtualized, so shouldn't show all 9 items
                done();
            }, DefaultRenderTime);
        });

        it('Create SVG List View Correctly', (done) => {
            createSVGLListView(createSVGListViewOptions());
            setTimeout(() => {
                var itemCount = element.find('.item').length;
                expect(itemCount).toBeGreaterThan(0);
                expect(itemCount).toBeLessThan(9); // Some should be virtualized, so shouldn't show all 9 items
                done();
            }, DefaultRenderTime);
        });

        it('Scroll to last to check if items come in view HTML', (done) => {
            var options = createHTMLListViewOptions();
            var spy = spyOn(options, "loadMoreData");
            createHTMLListView(options);
            var lastElem = element.find('.item').last().text();

            expect(lastElem).not.toEqual('-->Sachin-->Patney');
            element.scrollTop(1000);
            setTimeout(() => {
                var lastElem2 = element.find('.item').last().text();
                expect(lastElem2).toEqual('-->Sachin-->Patney');
                expect(spy).toHaveBeenCalled();
                done();
            }, DefaultRenderTime);
        });

        it('Scroll to last to check if items come in view SVG', (done) => {
            var options = createSVGListViewOptions();
            var spy = spyOn(options, "loadMoreData");
            createSVGLListView(options);
            var lastElem = element.find('.item').last().text();

            expect(lastElem).not.toEqual('-->Sachin-->Patney');
            element.scrollTop(1000);
            setTimeout(() => {
                var lastElem2 = element.find('.item').last().text();
                expect(lastElem2).toEqual('-->Sachin-->Patney');
                expect(spy).toHaveBeenCalled();
                done();
            }, DefaultRenderTime);
        });

        it('Reset scrollbar position when ResetScrollbar flag is set',(done) => {
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
            listView.data(data, d => d.id)
                .render(true);

            element.scrollTop(1000);
           
            setTimeout(() => {
                expect(element.find('.scrollRegion').first().parent().scrollTop()).toBe(40);

                listView.data(data, d => d.id)
                    .render(true, false);
                expect(element.find('.scrollRegion').first().parent().scrollTop()).toBe(40);
                
                listView.data(data, d => d.id)
                    .render(true, true);
                expect(element.find('.scrollRegion').first().parent().scrollTop()).toBe(0);
                done();
            }, DefaultRenderTime);
        });
    });
}