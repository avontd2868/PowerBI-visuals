//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbitests {
    import Textbox = powerbi.visuals.Textbox;
    import TextboxDataViewObject = powerbi.visuals.TextboxDataViewObject;

    describe("Textbox",() => {

        it('Textbox registered capabilities',() => {
            expect(powerbi.visuals.visualPluginFactory.create().getPlugin('textbox').capabilities).toBe(Textbox.capabilities);
        });

        it('Capabilities should suppressDefaultTitle',() => {
            expect(Textbox.capabilities.suppressDefaultTitle).toBe(true);
        });

        it('Textbox no visual configuration',() => {
            var element = powerbitests.helpers.testDom('200', '300');
            var options: powerbi.VisualInitOptions = {
                element: element,
                host: mocks.createVisualHostServices(),
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                }
            };

            var textbox = new Textbox();
            textbox.init(options);

            expect(element.children().length).toBe(0);
        });

        it('Textbox basic text',() => {
            var content: TextboxDataViewObject = {
                paragraphs: [{
                    textRuns: [{
                        value: "Text"
                    }]
                }]
            };

            var element = powerbitests.helpers.testDom('200', '300');
            var options: powerbi.VisualInitOptions = {
                element: element,
                host: mocks.createVisualHostServices(),
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
            };

            var textbox = new Textbox();
            textbox.init(options);

            textbox.onDataChanged({ dataViews: [dataView(content)] });

            expect($('.textbox span').length).toBe(1);
            expect($('.textbox span')[0].innerText).toBe('Text');
        });

        it('Textbox all styles',() => {
            var content: TextboxDataViewObject = {
                paragraphs: [{
                    horizontalTextAlignment: "center",
                    textRuns: [{
                        value: "Text",
                        textStyle: {
                            fontFamily: "Heading",
                            fontSize: "12px",
                            textDecoration: "underline",
                            fontWeight: "300",
                            fontStyle: "italic"
                        }
                    }]
                }]
            };

            var element = powerbitests.helpers.testDom('200', '300');
            var options: powerbi.VisualInitOptions = {
                element: element,
                host: mocks.createVisualHostServices(),
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
            };

            var textbox = new Textbox();
            textbox.init(options);
            textbox.onDataChanged({ dataViews: [dataView(content)] });

            expect($('.textbox div').length).toBe(1);
            expect($('.textbox div')[0].style.textAlign).toBe('center');
            var spans = $('.textbox span');
            expect(spans.length).toBe(1);
            var firstSpan = spans[0];
            expect(firstSpan.innerText).toBe('Text');
            var firstSpanStyle = firstSpan.style;
            expect(firstSpanStyle.fontFamily).toBe("'Segoe UI Light'");
            expect(firstSpanStyle.fontSize).toBe('12px');
            expect(firstSpanStyle.fontStyle).toBe('italic');
            expect(firstSpanStyle.fontWeight).toBe('300');
            expect(firstSpanStyle.textDecoration).toBe('underline');
        });

        it('Textbox all styles',() => {
            var content: TextboxDataViewObject = {
                paragraphs: [{
                    textRuns: [{
                        value: "Text",
                        textStyle: {
                            fontFamily: "Arial",
                        }
                    }]
                }]
            };

            var element = powerbitests.helpers.testDom('200', '300');
            var options: powerbi.VisualInitOptions = {
                element: element,
                host: mocks.createVisualHostServices(),
                style: powerbi.common.services.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
            };

            var textbox = new Textbox();
            textbox.init(options);
            textbox.onDataChanged({ dataViews: [dataView(content)] });

            expect($('.textbox span')[0].style.fontFamily).toBe("Arial");
        });

        function dataView(content: TextboxDataViewObject): powerbi.DataView {
            return {
                metadata: {
                    columns: [],
                    objects: { general: content },
                }
            };
        }
    });
}