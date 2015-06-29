//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbitests {
    import AnimatedText = powerbi.visuals.AnimatedText;

    describe("AnimatedText",() => {

        beforeEach(() => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());
        });

        it('AnimatedText_getSeedFontHeight does not exceed style maximum',() => {
            var animatedText = new AnimatedText('animatedText');
            animatedText.style = powerbi.common.services.visualStyles.create();

            expect(animatedText.getSeedFontHeight(100, 90)).toBeLessThan(100);
        });

        it('AnimatedText_getSeedFontHeight returns a smaller number than the height',() => {
            var animatedText = new AnimatedText('animatedText');
            animatedText.style = powerbi.common.services.visualStyles.create();

            expect(animatedText.getSeedFontHeight(100, 90)).toBeLessThan(100);
        });

        it('AnimatedText_getTextAnchor when the aligment is "left"',() => {
            var animatedText = new AnimatedText('animatedText');
            animatedText.visualConfiguration = {
                align: 'left'
            };
            expect(animatedText.getTextAnchor()).toBe('start');
        });

        it('AnimatedText_getTextAnchor when the aligment is "right"',() => {
            var animatedText = new AnimatedText('animatedText');

            animatedText.visualConfiguration = {
                align: 'right'
            };
            expect(animatedText.getTextAnchor()).toBe('end');
        });

        it('AnimatedText_getTextAnchor when the aligment is undefined',() => {
            var animatedText = new AnimatedText('animatedText');
            animatedText.visualConfiguration = undefined;
            expect(animatedText.getTextAnchor()).toBe('middle');

            animatedText.visualConfiguration = {
                align: 'center'
            };
            expect(animatedText.getTextAnchor()).toBe('middle');
        });

        it('AnimatedText_getTranslateX alignment is "left"',() => {
            var animatedText = new AnimatedText('animatedText');
            animatedText.visualConfiguration = {
                align: 'left'
            };
            expect(animatedText.getTranslateX(0)).toBe(0);
            expect(animatedText.getTranslateX(100)).toBe(0);
        });

        it('AnimatedText_getTranslateX alignment is "right"',() => {
            var animatedText = new AnimatedText('animatedText');
            animatedText.visualConfiguration = {
                align: 'right'
            };
            expect(animatedText.getTranslateX(0)).toBe(0);
            expect(animatedText.getTranslateX(100)).toBe(100);
        });

        it('AnimatedText_getTranslateX when alignment is undefined, returns the center',() => {
            var animatedText = new AnimatedText('animatedText');
            animatedText.visualConfiguration = undefined;
            expect(animatedText.getTranslateX(0)).toBe(0);
            expect(animatedText.getTranslateX(100)).toBe(50);
        });
    });

    describe("AnimatedText DOM tests",() => {
        var v: AnimatedText, element: JQuery;
        var defaultTimeout: number = 500;

        beforeEach((done) => {
            powerbitests.mocks.setLocale(powerbi.common.createLocalizationService());

            element = powerbitests.helpers.testDom('200', '300');
            v = new AnimatedText('animatedText');

            v.currentViewport = {
                height: element.height(),
                width: element.width()
            };

            v.hostServices = powerbitests.mocks.createVisualHostServices();
            v.svg = d3.select(element.get(0)).append('svg');
            v.graphicsContext = v.svg.append('g');
            v.style = powerbi.common.services.visualStyles.create();
            done();
        });

        it('AnimatedText_getAdjustedFontHeight when seed font width is bigger than the width',() => {
            // parameters are availableWidth, textToMeasure, seedFontHeight
            // When the measured text with the seed height is bigger than availableWidth, decrease the font height
            expect(v.getAdjustedFontHeight(4, "text", 10)).toBeLessThan(10);
        });

        it('AnimatedText_getAdjustedFontHeight when seed font width is smaller or equal to the width',() => {
            // parameters are availableWidth, textToMeasure, seedFontHeight
            // When the measured text with the seed height is equal/smaller than availableWidth, return the font height
            expect(v.getAdjustedFontHeight(30, "text", 3)).toBe(3);
        });

        it('AnimatedText doValueTransition sets text',(done) => {
            v.doValueTransition(3, 4, null, null, 0, false);
            expect($('.animatedText')).toBeInDOM();
            expect($('.mainText')).toBeInDOM();
            setTimeout(() => {
                expect($('.mainText').text()).toEqual('4');
                done();
            }, defaultTimeout);
        });

        it('AnimatedText doValueTransition formats number > 10000',(done) => {
            v.doValueTransition(3, 4534353, null, null, 0, false);
            expect($('.animatedText')).toBeInDOM();
            expect($('.mainText')).toBeInDOM();
            setTimeout(() => {
                expect($('.mainText').text()).toEqual('4.53M');
                done();
            }, defaultTimeout);
        });

        it('AnimatedText doValueTransition sets translateY correctly',(done) => {
            v.doValueTransition(3, 4, null, null, 0, false);
            expect($('.animatedText')).toBeInDOM();
            expect($('.mainText')).toBeInDOM();
            setTimeout(() => {
                // IE and Chrome represent the transform differently
                expect(v.graphicsContext.attr('transform')).toMatch(/translate\(\d+(,| )130\)/);
                done();
            }, defaultTimeout);
        });

        it('AnimatedText doValueTransition to 0',(done) => {
            v.doValueTransition(null, 0, null, null, 0, false);
            expect($('.animatedText')).toBeInDOM();
            expect($('.mainText')).toBeInDOM();
            setTimeout(() => {
                expect($('.mainText').text()).toEqual('0');
                done();
            }, defaultTimeout);
        });
    });
}