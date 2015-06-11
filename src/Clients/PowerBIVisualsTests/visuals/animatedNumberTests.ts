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