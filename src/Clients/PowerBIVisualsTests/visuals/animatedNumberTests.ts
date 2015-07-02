//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbitests {
    import AnimatedNumber = powerbi.visuals.AnimatedNumber;

    describe("AnimatedNumber",() => {

        it('AnimatedNumber registered capabilities',() => {
            expect(powerbi.visuals.visualPluginFactory.create().getPlugin('animatedNumber').capabilities).toBe(AnimatedNumber.capabilities);
        });

        it('FormatString property should match calculated',() => {
            expect(powerbi.data.DataViewObjectDescriptors.findFormatString(AnimatedNumber.capabilities.objects)).toEqual(AnimatedNumber.formatStringProp);
        });
    });

    describe("AnimatedNumber DOM tests",() => {
        var v: AnimatedNumber, element: JQuery;

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());

            element = powerbitests.helpers.testDom('200', '300');
            v = new AnimatedNumber();
        });

        it('AnimatedText onDataChanged sets text (no settings)',() => {
            var dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [{ displayName: 'col1', isMeasure: true }],
            };
            var dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                single: { value: 123.456 }
            };

            var initOptions: powerbi.VisualInitOptions = {
                element: element,
                host: powerbitests.mocks.createVisualHostServices(),
                style: powerbi.visuals.visualStyles.create(),
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
}