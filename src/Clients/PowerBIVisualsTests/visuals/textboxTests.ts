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
    import Textbox = powerbi.visuals.Textbox;
    import TextboxDataViewObject = powerbi.visuals.TextboxDataViewObject;

    describe("Textbox",() => {
        it('Textbox no visual configuration',() => {
            var element = powerbitests.helpers.testDom('200', '300');
            var options: powerbi.VisualInitOptions = {
                element: element,
                host: mocks.createVisualHostServices(),
                style: powerbi.visuals.visualStyles.create(),
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
                style: powerbi.visuals.visualStyles.create(),
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
                style: powerbi.visuals.visualStyles.create(),
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
                style: powerbi.visuals.visualStyles.create(),
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