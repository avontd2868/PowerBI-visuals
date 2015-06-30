//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbitests;
(function (powerbitests) {
    var AnimatedNumber = powerbi.visuals.AnimatedNumber;
    describe("AnimatedNumber", function () {
        it('AnimatedNumber registered capabilities', function () {
            expect(powerbi.visuals.visualPluginFactory.create().getPlugin('animatedNumber').capabilities).toBe(AnimatedNumber.capabilities);
        });
        it('FormatString property should match calculated', function () {
            expect(powerbi.data.DataViewObjectDescriptors.findFormatString(AnimatedNumber.capabilities.objects)).toEqual(AnimatedNumber.formatStringProp);
        });
    });
    describe("AnimatedNumber DOM tests", function () {
        var v, element;
        beforeEach(function () {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
            element = powerbitests.helpers.testDom('200', '300');
            v = new AnimatedNumber();
        });
        it('AnimatedText onDataChanged sets text (no settings)', function () {
            var dataViewMetadata = {
                columns: [{ name: 'col1', isMeasure: true }],
            };
            var dataView = {
                metadata: dataViewMetadata,
                single: { value: 123.456 }
            };
            var initOptions = {
                element: element,
                host: powerbitests.mocks.createVisualHostServices(),
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width(),
                },
                animation: {
                    transitionImmediate: true,
                }
            };
            v.init(initOptions);
            v.onDataChanged({ dataViews: [dataView] });
            expect($('.animatedNumber')).toBeInDOM();
            expect($('.mainText')).toBeInDOM();
        });
    });
})(powerbitests || (powerbitests = {}));
