//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbitests;
(function (powerbitests) {
    var MultiRowCard = powerbi.visuals.MultiRowCard;
    var ValueType = powerbi.ValueType;
    describe("MultiRowCard", function () {
        it('MultiRowCard_registered_capabilities', function () {
            expect(powerbi.visuals.visualPluginFactory.create().getPlugin('multiRowCard').capabilities).toBe(MultiRowCard.capabilities);
        });
        it('Capabilities should include dataViewMappings', function () {
            expect(MultiRowCard.capabilities.dataViewMappings).toBeDefined();
        });
        it('Capabilities should include dataRoles', function () {
            expect(MultiRowCard.capabilities.dataRoles).toBeDefined();
        });
        it('Capabilities should suppressDefaultTitle', function () {
            expect(MultiRowCard.capabilities.suppressDefaultTitle).toBe(true);
        });
        it('FormatString property should match calculated', function () {
            expect(powerbi.data.DataViewObjectDescriptors.findFormatString(MultiRowCard.capabilities.objects)).toEqual(MultiRowCard.formatStringProp);
        });
    });
    describe("MultiRowCard DOM tests", function () {
        var v, element;
        var defaultTimeout = 30;
        var hostServices = powerbitests.mocks.createVisualHostServices();
        var dataViewMetadata = {
            columns: [
                { name: 'value', type: ValueType.fromDescriptor({ numeric: true }) },
                { name: 'date', type: ValueType.fromDescriptor({ dateTime: true }) },
                { name: 'category', type: ValueType.fromDescriptor({ text: true }) },
            ],
        };
        var data = {
            metadata: dataViewMetadata,
            table: {
                rows: [
                    [123456.789, new Date(1999, 7, 31, 6, 15), 'category1'],
                    [12345, new Date(2014, 7, 1), 'category2']
                ],
                columns: dataViewMetadata.columns
            },
        };
        var dataViewMetadataWithTitle = {
            columns: [
                { name: 'value', type: ValueType.fromDescriptor({ numeric: true }), isMeasure: true },
                { name: 'genre', type: ValueType.fromDescriptor({ text: true }) },
            ],
        };
        var dataWithTitle = {
            metadata: dataViewMetadataWithTitle,
            table: {
                rows: [
                    [123456.789, 'Action'],
                    [12345, 'Adventure']
                ],
                columns: dataViewMetadataWithTitle.columns
            },
        };
        beforeEach(function () {
            createMultiRowCard();
        });
        function createMultiRowCard() {
            element = powerbitests.helpers.testDom('200', '300');
            v = powerbi.visuals.visualPluginFactory.create().getPlugin('multiRowCard').create();
            var settings;
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                settings: settings,
            });
        }
        it('Validate multiRowCard DOM without Title', function (done) {
            v.onDataChanged({ dataViews: [data] });
            setTimeout(function () {
                expect($('.card')).toBeInDOM();
                expect($('.card .title')).not.toBeInDOM();
                expect($('.card .cardItemContainer')).toBeInDOM();
                expect($('.card .cardItemContainer .caption')).toBeInDOM();
                expect($('.card .cardItemContainer .details')).toBeInDOM();
                expect($('.card').length).toBe(2);
                expect($('.card')[0].childElementCount).toBe(3);
                expect($('.cardItemContainer')[0].childElementCount).toBe(2);
                expect($('.caption').last().text()).toBe('category2');
                expect($('.details').last().text()).toBe('category');
                done();
            }, defaultTimeout);
        });
        it('Validate multiRowCard DOM with Title', function (done) {
            v.onDataChanged({ dataViews: [dataWithTitle] });
            setTimeout(function () {
                expect($('.card')).toBeInDOM();
                expect($('.card .cardItemContainer')).toBeInDOM();
                expect($('.card .cardItemContainer .caption')).toBeInDOM();
                expect($('.card .cardItemContainer .details')).toBeInDOM();
                expect($('.card .title')).toBeInDOM();
                expect($('.card').length).toBe(2);
                expect($('.card')[0].childElementCount).toBe(2);
                expect($('.cardItemContainer')[0].childElementCount).toBe(2);
                expect($('.title').last().text()).toBe('Adventure');
                expect($('.caption').last().text()).toBe('12,345.00');
                expect($('.details').last().text()).toBe('value');
                done();
            }, defaultTimeout);
        });
        it('Validate that multiRowCard item long caption should be truncated', function (done) {
            var dataViewMetadata = {
                columns: [
                    { name: 'Label', type: ValueType.fromDescriptor({ text: true }) },
                    { name: 'Category', type: ValueType.fromDescriptor({ text: true }) }
                ],
            };
            var data = {
                metadata: dataViewMetadata,
                table: {
                    rows: [
                        ['this is the label that never ends, it just goes on and on my friends.Some axis started rendering it not knowing what it was, and now it keeps on rendering forever just because this the label that never ends...', 'Category1']
                    ],
                    columns: dataViewMetadata.columns
                },
            };
            v.onDataChanged({ dataViews: [data] });
            setTimeout(function () {
                // Note: the exact text will be different depending on the environment in which the test is run, so we can't do an exact match.
                // Just check that the text is truncated with ellipses.
                var labelText = $('.caption').first().text();
                expect(labelText.substr(labelText.length - 3)).toBe('...');
                done();
            }, defaultTimeout);
        });
        it('Validate multiRowCard converter without Title', function (done) {
            setTimeout(function () {
                var cardData = MultiRowCard.converter(data, data.metadata.columns.length, data.table.rows.length);
                expect(cardData.length).toBe(2);
                expect(cardData).toEqual([
                    { title: undefined, cardItemsData: [{ caption: '123,456.79', details: 'value' }, { caption: '8/31/1999', details: 'date' }, { caption: 'category1', details: 'category' }] },
                    { title: undefined, cardItemsData: [{ caption: '12,345.00', details: 'value' }, { caption: '8/1/2014', details: 'date' }, { caption: 'category2', details: 'category' }] }
                ]);
                done();
            }, defaultTimeout);
        });
        it('Validate multiRowCard converter With Title', function (done) {
            setTimeout(function () {
                var cardData = MultiRowCard.converter(dataWithTitle, dataWithTitle.metadata.columns.length, dataWithTitle.table.rows.length);
                expect(cardData.length).toBe(2);
                expect(cardData).toEqual([
                    { title: 'Action', cardItemsData: [{ caption: '123,456.79', details: 'value' }] },
                    { title: 'Adventure', cardItemsData: [{ caption: '12,345.00', details: 'value' }] }
                ]);
                done();
            }, defaultTimeout);
        });
        it('Validate multiRowCard last card styling on dashboard', function (done) {
            element = powerbitests.helpers.testDom('400', '400');
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { overflow: 'hidden' }
            });
            v.onDataChanged({ dataViews: [data] });
            setTimeout(function () {
                var cardItemBottomBorderWidth = parseInt(element.find('.card').last().css('border-bottom-width'), 10);
                var cardItemBottomPadding = parseInt(element.find('.card').last().css('padding-bottom'), 10);
                var cardItemTopPadding = parseInt(element.find('.card').last().css('padding-top'), 10);
                expect(cardItemBottomBorderWidth).toEqual(0);
                expect(cardItemBottomPadding).toEqual(0);
                expect(cardItemTopPadding).toEqual(5);
                done();
            }, defaultTimeout);
        });
        it('Validate multiRowCard first card styling on canvas', function (done) {
            element = powerbitests.helpers.testDom('100', '100');
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
            });
            var dataViewMetadata = {
                columns: [
                    { name: 'value', type: ValueType.fromDescriptor({ numeric: true }) },
                ],
            };
            var singleRowdata = {
                metadata: dataViewMetadata,
                table: {
                    rows: [
                        [123456.789],
                    ],
                    columns: dataViewMetadata.columns
                },
            };
            v.onDataChanged({ dataViews: [singleRowdata] });
            setTimeout(function () {
                var cardBottomMargin = parseInt(element.find('.card').last().css('margin-bottom'), 10);
                expect(cardBottomMargin).toEqual(0);
                v.onDataChanged({ dataViews: [dataWithTitle] });
                cardBottomMargin = parseInt(element.find('.card').last().css('margin-bottom'), 10);
                expect(cardBottomMargin).toEqual(20);
                v.onDataChanged({ dataViews: [data] });
                cardBottomMargin = parseInt(element.find('.card').last().css('margin-bottom'), 10);
                expect(cardBottomMargin).toEqual(20);
                done();
            }, defaultTimeout);
        });
        it('Validate multiRowCard card styling on dashboard', function (done) {
            element = powerbitests.helpers.testDom('400', '400');
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { overflow: 'hidden' }
            });
            v.onDataChanged({ dataViews: [data] });
            setTimeout(function () {
                var cardItemBottomBorderWidth = parseInt(element.find('.card').first().css('border-bottom-width'), 10);
                var cardItemBottomPadding = parseInt(element.find('.card').first().css('padding-bottom'), 10);
                var cardItemTopPadding = parseInt(element.find('.card').first().css('padding-top'), 10);
                expect($('.card .title')).not.toBeInDOM();
                expect(cardItemBottomBorderWidth).toEqual(1);
                expect(cardItemBottomPadding).toEqual(5);
                expect(cardItemTopPadding).toEqual(5);
                done();
            }, defaultTimeout);
        });
        it('Validate multiRowCard card styling', function (done) {
            element = powerbitests.helpers.testDom('400', '400');
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                }
            });
            v.onDataChanged({ dataViews: [data] });
            setTimeout(function () {
                var cardItemBottomBorderWidth = parseInt(element.find('.card').first().css('border-bottom-width'), 10);
                var cardItemBottomPadding = parseInt(element.find('.card').first().css('padding-bottom'), 10);
                var cardItemTopPadding = parseInt(element.find('.card').first().css('padding-top'), 10);
                expect(cardItemBottomBorderWidth).toEqual(0);
                expect(cardItemBottomPadding).toEqual(0);
                expect(cardItemTopPadding).toEqual(0);
                done();
            }, defaultTimeout);
        });
        it('Validate multiRowCard styling when there is a single card item', function (done) {
            var dataViewMetadata = {
                columns: [
                    { name: 'value', type: ValueType.fromDescriptor({ numeric: true }) },
                ],
            };
            var singleRowdata = {
                metadata: dataViewMetadata,
                table: {
                    rows: [
                        [123456.789],
                    ],
                    columns: dataViewMetadata.columns
                },
            };
            v.onDataChanged({ dataViews: [singleRowdata] });
            setTimeout(function () {
                var cardItemRightMargin = parseInt(element.find('.cardItemContainer').first().css('margin-right'), 10);
                expect(cardItemRightMargin).toEqual(0);
                done();
            }, defaultTimeout);
        });
        it('Verify number of cards and card items in smallTile ', function (done) {
            element = powerbitests.helpers.testDom('150', '230');
            var data = powerbitests.tableDataViewHelper.getDataWithColumns(10, 10);
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { overflow: 'hidden' }
            });
            v.onDataChanged({ dataViews: [data] });
            setTimeout(function () {
                expect($('.card')).toBeInDOM();
                expect($('.card .cardItemContainer')).toBeInDOM();
                expect($('.card').length).toBe(1);
                expect($('.card')[0].childElementCount).toBe(4);
                done();
            }, defaultTimeout);
        });
        it('Verify number of cards and card items in MediumTile ', function (done) {
            element = powerbitests.helpers.testDom('300', '470');
            var data = powerbitests.tableDataViewHelper.getDataWithColumns(10, 10);
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { overflow: 'hidden' }
            });
            v.onDataChanged({ dataViews: [data] });
            setTimeout(function () {
                expect($('.card')).toBeInDOM();
                expect($('.card .cardItemContainer')).toBeInDOM();
                expect($('.card').length).toBe(3);
                expect($('.card')[0].childElementCount).toBe(6);
                done();
            }, defaultTimeout);
        });
        it('Verify number of cards and card items in LargeTile ', function (done) {
            element = powerbitests.helpers.testDom('450', '750');
            var data = powerbitests.tableDataViewHelper.getDataWithColumns(10, 10);
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                interactivity: { overflow: 'hidden' }
            });
            v.onDataChanged({ dataViews: [data] });
            setTimeout(function () {
                expect($('.card')).toBeInDOM();
                expect($('.card .cardItemContainer')).toBeInDOM();
                expect($('.card').length).toBe(9);
                expect($('.card')[0].childElementCount).toBe(6);
                done();
            }, defaultTimeout);
        });
        it('Validate multiRowCard cardrow column width for default width', function (done) {
            element = powerbitests.helpers.testDom('100', '760');
            var data = powerbitests.tableDataViewHelper.getDataWithColumns(15, 15);
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                }
            });
            v.onDataChanged({ dataViews: [data] });
            setTimeout(function () {
                expect($('.card')).toBeInDOM();
                expect($('.card .cardItemContainer')).toBeInDOM();
                expect(element.find('.cardItemContainer').last().innerWidth()).toEqual(86);
                done();
            }, defaultTimeout);
        });
        it('Validate multiRowCard card height', function (done) {
            element = powerbitests.helpers.testDom('400', '400');
            v.init({
                element: element,
                host: hostServices,
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                }
            });
            v.onDataChanged({ dataViews: [data] });
            setTimeout(function () {
                var cardItemHeight = element.find('.cardItemContainer').height();
                var cardItemBottompadding = parseInt(element.find('.card').css('padding-bottom'), 10);
                var cardItemTopPadding = parseInt(element.find('.card').css('padding-bottom'), 10);
                expect(element.find('.card').first().innerHeight()).toEqual(cardItemHeight + cardItemBottompadding + cardItemTopPadding);
                done();
            }, defaultTimeout);
        });
        it('Card should be cleared when there is a empty dataview ', function (done) {
            var dataViewMetadata = {
                columns: [
                    { name: 'value', type: ValueType.fromDescriptor({ numeric: true }) }
                ],
            };
            var data = {
                metadata: dataViewMetadata,
                table: {
                    rows: [
                        [123456.789]
                    ],
                    columns: dataViewMetadata.columns
                },
            };
            v.onDataChanged({ dataViews: [data] });
            setTimeout(function () {
                expect($('.card').length).toBe(1);
                dataViewMetadata = {
                    columns: [],
                };
                data = {
                    metadata: dataViewMetadata,
                    table: {
                        rows: [],
                        columns: dataViewMetadata.columns
                    },
                };
                v.onDataChanged({ dataViews: [data] });
                expect($('.card').length).toBe(0);
                done();
            }, defaultTimeout);
        });
        it('Card should format values', function (done) {
            var dataViewMetadata = {
                columns: [
                    { name: 'value', type: ValueType.fromDescriptor({ numeric: true }), objects: { general: { formatString: '0%' } } }
                ],
            };
            var data = {
                metadata: dataViewMetadata,
                table: {
                    rows: [
                        [.22]
                    ],
                    columns: dataViewMetadata.columns
                },
            };
            v.onDataChanged({ dataViews: [data] });
            setTimeout(function () {
                expect($('.card').length).toBe(1);
                expect($('.card .caption').last().text()).toBe('22%');
                done();
            }, defaultTimeout);
        });
        it('Card should not call loadMoreData ', function () {
            var data = {
                metadata: { columns: [] },
                table: { rows: [[1]], columns: [] }
            };
            v.onDataChanged({ dataViews: [data] });
            var listViewOptions = v['listView']['options'];
            var loadMoreSpy = spyOn(hostServices, "loadMoreData");
            listViewOptions.loadMoreData();
            expect(loadMoreSpy).not.toHaveBeenCalled();
        });
        it('Card should call loadMoreData ', function () {
            var data = {
                metadata: { columns: [], segment: {} },
                table: { rows: [[1]], columns: [] }
            };
            v.onDataChanged({ dataViews: [data] });
            var listViewOptions = v['listView']['options'];
            var loadMoreSpy = spyOn(hostServices, "loadMoreData");
            listViewOptions.loadMoreData();
            expect(loadMoreSpy).toHaveBeenCalled();
        });
        it('Card already called loadMoreData', function () {
            var data = {
                metadata: { columns: [], segment: {} },
                table: { rows: [[1]], columns: [] }
            };
            v.onDataChanged({ dataViews: [data] });
            var listViewOptions = v['listView']['options'];
            var loadMoreSpy = spyOn(hostServices, "loadMoreData");
            listViewOptions.loadMoreData();
            listViewOptions.loadMoreData();
            expect(loadMoreSpy.calls.all().length).toBe(1);
        });
    });
})(powerbitests || (powerbitests = {}));
