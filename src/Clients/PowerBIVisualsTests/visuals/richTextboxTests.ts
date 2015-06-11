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
    import RichTextbox = powerbi.visuals.RichTextbox;
    import IVisualHostServices = powerbi.IVisualHostServices;
    import ParagraphContext = powerbi.visuals.ParagraphContext;

    describe('Rich Textbox',() => {
        var viewport: powerbi.IViewport = {
            height: 500,
            width: 500,
        };
        var style = powerbi.visuals.visualStyles.create();

        describe('capabilities',() => {
            it('should suppress title',() => {
                expect(RichTextbox.capabilities.suppressDefaultTitle).toBeTruthy();
            });

            it('should register capabilities',() => {
                var pluginFactory = powerbi.visuals.visualPluginFactory.create();
                var plugin = pluginFactory.getPlugin('textbox');
                expect(plugin).toBeDefined();
                expect(plugin.capabilities).toBe(RichTextbox.capabilities);
            });
        });

        // Chutzpah is configured to load the quill resources for these tests.
        powerbi.visuals.RichText.QuillWrapper.loadQuillResources = false;

        // ---- Sample data ----
        // 2 paragraphs, no formatting.
        var paragraphs1: ParagraphContext[] = [
            {
                textRuns: [
                    { value: 'foo' },
                    { value: 'bar' },
                ]
            },
            {
                textRuns: [
                    { value: 'baz' }
                ]
            }
        ];

        // 2 paragraphs, with formatting
        var paragraphs2: ParagraphContext[] = [
            {
                textRuns: [
                    { value: 'foo', textStyle: { fontWeight: 'bold' } },
                    { value: 'bar', textStyle: { fontStyle: 'italic' } },
                    { value: 'baz', textStyle: { textDecoration: 'underline' } },
                ]
            },
            {
                textRuns: [
                    { value: 'http://www.powerbi.com', url: 'http://www.powerbi.com' }
                ],
                horizontalTextAlignment: 'center'
            }
        ];

        // 1 paragraph with an unformatted url.
        var paragraphs3: ParagraphContext[] = [
            {
                textRuns: [
                    { value: 'http://www.powerbi.com' },
                ]
            }
        ];

        describe('',() => {
            var host: IVisualHostServices;
            var $element: JQuery;
            var $toolbar: JQuery;
            var initOptions: powerbi.VisualInitOptions;

            var textbox: RichTextbox;
            var getViewModeSpy: jasmine.Spy;
            var setToolbarSpy: jasmine.Spy;

            beforeEach(() => {
                host = mocks.createVisualHostServices();
                $element = powerbitests.helpers.testDom('500', '500');

                initOptions = {
                    element: $element,
                    host: host,
                    viewport: viewport,
                    style: style,
                };

                getViewModeSpy = spyOn(host, 'getViewMode');
                setToolbarSpy = spyOn(host, 'setToolbar');
                setToolbarSpy.and.callFake((t) => $toolbar = t);
            });

            describe('init in view mode',() => {
                beforeEach(() => {
                    getViewModeSpy.and.returnValue(powerbi.ViewMode.View);

                    textbox = new RichTextbox();
                    textbox.init(initOptions);
                });

                it('should not show editor',() => {
                    verifyEditor($element, false);
                });

                it('change to edit-mode should show editor',() => {
                    switchToViewMode(powerbi.ViewMode.Edit);

                    verifyEditor($element, true);
                });

                describe('on data changed',() => {
                    it('with non-empty dataview should set content',() => {
                        textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs1) });

                        var $divs = getViewModeParagraphDivs($element);

                        expect($divs.length).toBe(2);

                        var $paragraph1 = $divs.eq(0);
                        expect($paragraph1.text()).toEqual('foobar');

                        var $paragraph2 = $divs.eq(1);
                        expect($paragraph2.text()).toEqual('baz');
                    });

                    it('with empty dataview should clear content',() => {
                        textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs1) });

                        // Clear the content.
                        textbox.onDataChanged({ dataViews: [] });

                        var $divs = getViewModeParagraphDivs($element);
                        expect($divs.text()).toEqual('');
                    });

                    it('with formatted text should render correctly',() => {
                        textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs2) });

                        var $divs = getViewModeParagraphDivs($element);

                        expect($divs.length).toBe(2);

                        var $paragraph1 = $divs.eq(0);
                        var $paragraph1Spans = $paragraph1.children();
                        expect($paragraph1Spans.length).toBe(3);

                        var $fooRun = $paragraph1Spans.eq(0);
                        expect(hasBold($fooRun)).toBeTruthy();
                        
                        var $barRun = $paragraph1Spans.eq(1);
                        expect(hasItalic($barRun)).toBeTruthy();

                        var $bazRun = $paragraph1Spans.eq(2);
                        expect(hasUnderline($bazRun)).toBeTruthy();

                        var $paragraph2 = $divs.eq(1);
                        var $paragraph2Spans = $paragraph2.children();
                        expect($paragraph2Spans.length).toBe(1);

                        var $urlRun = $paragraph2Spans.eq(0);
                        expect(getUrl($urlRun)).toEqual('http://www.powerbi.com');
                    });

                    describe('theme font',() => {
                        it('"Heading" should render correctly',() => {
                            var paragraphsWithHeading: ParagraphContext[] = [
                                {
                                    textRuns: [
                                        { value: 'Some text', textStyle: { fontFamily: 'Heading' } },
                                    ]
                                }
                            ];

                            textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphsWithHeading) });

                            var $divs = getViewModeParagraphDivs($element);
                            var $span = $divs.children('span').eq(0);

                            expect(getFont($span)).toEqual('wf_segoe-ui_light');
                        });

                        it('"Body" should render correctly',() => {
                            var paragraphsWithBody: ParagraphContext[] = [
                                {
                                    textRuns: [
                                        { value: 'Some text', textStyle: { fontFamily: 'Body' } },
                                    ]
                                }
                            ];

                            textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphsWithBody) });

                            var $divs = getViewModeParagraphDivs($element);
                            var $span = $divs.children('span').eq(0);

                            expect(getFont($span)).toEqual('wf_segoe-ui_normal');
                        });
                    });
                });
            });

            describe('init in edit mode',() => {
                beforeEach(() => {
                    getViewModeSpy.and.returnValue(powerbi.ViewMode.Edit);

                    textbox = new RichTextbox();
                    textbox.init(initOptions);
                });

                it('should show editor',() => {
                    verifyEditor($element, true);
                });

                it('change to view-mode should not show editor',() => {
                    switchToViewMode(powerbi.ViewMode.View);

                    verifyEditor($element, false);
                });

                it('change to view-mode should format any urls',() => {
                    textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs3) });

                    switchToViewMode(powerbi.ViewMode.View);

                    var $divs = getViewModeParagraphDivs($element);
                    var $urlRun = $divs.children('span').eq(0);
                    expect(getUrl($urlRun)).toEqual('http://www.powerbi.com');
                });

                it('change to view-mode should save content',() => {
                    var changes: powerbi.VisualObjectInstance[] = [];
                    spyOn(host, 'persistProperties').and.callFake((c) => changes = c);

                    textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs2) });

                    switchToViewMode(powerbi.ViewMode.View);

                    expect(changes).toHaveLength(1);

                    var change = changes[0];
                    expect(change.objectName).toEqual('general');

                    var paragraphs: ParagraphContext[] = (<any>change.properties).paragraphs;
                    expect(paragraphs.length).toBe(2);
                    expect(paragraphs[0].horizontalTextAlignment).toBeFalsy();
                    expect(paragraphs[0].textRuns.length).toBe(3);

                    expect(paragraphs[0].textRuns[0].value).toBe('foo');
                    expect(paragraphs[0].textRuns[0].textStyle).toEqual({ fontWeight: 'bold' });
                    expect(paragraphs[0].textRuns[0].url).toBeFalsy();

                    expect(paragraphs[0].textRuns[1].value).toBe('bar');
                    expect(paragraphs[0].textRuns[1].textStyle).toEqual({ fontStyle: 'italic' });
                    expect(paragraphs[0].textRuns[1].url).toBeFalsy();

                    expect(paragraphs[0].textRuns[2].value).toBe('baz');
                    expect(paragraphs[0].textRuns[2].textStyle).toEqual({ textDecoration: 'underline' });
                    expect(paragraphs[0].textRuns[2].url).toBeFalsy();

                    expect(paragraphs[1].horizontalTextAlignment).toEqual('center');
                    expect(paragraphs[1].textRuns[0].value).toBe('http://www.powerbi.com');
                    expect(paragraphs[1].textRuns[0].textStyle).toEqual({});
                    expect(paragraphs[1].textRuns[0].url).toEqual('http://www.powerbi.com');
                });

                it('change to view-mode should preserve empty lines',() => {
                    var paragraphs: ParagraphContext[] = [
                        {
                            textRuns: [
                                { value: 'line 1' },
                            ]
                        }, {
                            textRuns: [
                                { value: '' },
                            ]
                        }, {
                            textRuns: [
                                { value: 'line 2' },
                            ]
                        }
                    ];

                    textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs) });

                    switchToViewMode(powerbi.ViewMode.View);

                    var $divs = getViewModeParagraphDivs($element);

                    expect($divs.length).toBe(3);

                    expect($divs.eq(0).text()).toEqual('line 1');
                    expect($divs.eq(1).text()).toEqual('');
                    expect($divs.eq(2).text()).toEqual('line 2');
                });

                describe('on data changed',() => {
                    it('with non-empty dataview should set content',() => {
                        textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs1) });

                        var $divs = getEditModeParagraphDivs($element);

                        var $paragraph1 = $divs.eq(0);
                        expect($paragraph1.text()).toEqual('foobar');

                        var $paragraph2 = $divs.eq(1);
                        expect($paragraph2.text()).toBe('baz');
                    });

                    it('with empty dataview should clear content',() => {
                        textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs1) });

                        // Clear the content.
                        textbox.onDataChanged({ dataViews: [] });

                        var $divs = getEditModeParagraphDivs($element);
                        expect($divs.text()).toEqual('');
                    });

                    it('with formatted text should render correctly',() => {
                        textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs2) });

                        var $divs = getEditModeParagraphDivs($element);

                        expect($divs.length).toBe(2);

                        var $paragraph1 = $divs.eq(0);
                        var $paragraph1Spans = $paragraph1.children();
                        expect($paragraph1Spans.length).toBe(3);

                        var $fooRun = $paragraph1Spans.eq(0);
                        expect(hasBold($fooRun)).toBeTruthy();

                        var $barRun = $paragraph1Spans.eq(1);
                        expect(hasItalic($barRun)).toBeTruthy();

                        var $bazRun = $paragraph1Spans.eq(2);
                        expect(hasUnderline($bazRun)).toBeTruthy();

                        var $paragraph2 = $divs.eq(1);
                        var $urlRun = $paragraph2;
                        expect(getUrl($urlRun)).toEqual('http://www.powerbi.com');
                    });
                });
            });

            describe('',() => {
                beforeEach(() => {
                    getViewModeSpy.and.returnValue(powerbi.ViewMode.Edit);

                    textbox = new RichTextbox();
                    textbox.init(initOptions);
                });

                it('toolbar should exist with formatting options',() => {
                    var $toolbar = getToolbar();
                    expect($toolbar).toBeDefined();

                    expect(boldButton($toolbar)).toBeDefined();
                    expect(italicButton($toolbar)).toBeDefined();
                    expect(underlineButton($toolbar)).toBeDefined();

                    expect(fontSelect($toolbar)).toBeDefined();
                    expect(fontSizeSelect($toolbar)).toBeDefined();

                    expect(textAlignmentSelect($toolbar)).toBeDefined();
                });

                describe('with selected text',() => {
                    beforeEach(() => {
                        textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs1) });
                        textbox.setSelection(0, 5);
                    });

                    describe('clicking bold',() => {
                        beforeEach(() => {
                            boldButton(getToolbar()).click();
                        });

                        it('should bold selection in editor',() => {
                            var $divs = getEditModeParagraphDivs($element);
                            var $paragraph1 = $divs.eq(0);
                            expect($paragraph1.text()).toBe('foobar');

                            var $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual('fooba');
                            expect(hasBold($spans.eq(0))).toBeTruthy();
                        });

                        it('should bold text in view-mode',() => {
                            switchToViewMode(powerbi.ViewMode.View);

                            var $divs = getViewModeParagraphDivs($element);
                            var $paragraph1 = $divs.eq(0);
                            expect($paragraph1.text()).toBe('foobar');

                            var $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual('fooba');
                            expect(hasBold($spans.eq(0))).toBeTruthy();
                        });
                    });

                    describe('clicking italic',() => {
                        beforeEach(() => {
                            italicButton(getToolbar()).click();
                        });

                        it('should italicize selection in editor',() => {
                            var $divs = getEditModeParagraphDivs($element);
                            var $paragraph1 = $divs.eq(0);
                            expect($paragraph1.text()).toBe('foobar');

                            var $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual('fooba');
                            expect(hasItalic($spans.eq(0))).toBeTruthy();
                        });

                        it('should italicize text in view-mode',() => {
                            switchToViewMode(powerbi.ViewMode.View);

                            var $divs = getViewModeParagraphDivs($element);
                            var $paragraph1 = $divs.eq(0);
                            expect($paragraph1.text()).toBe('foobar');

                            var $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual('fooba');
                            expect(hasItalic($spans.eq(0))).toBeTruthy();
                        });
                    });

                    describe('clicking underline',() => {
                        beforeEach(() => {
                            underlineButton(getToolbar()).click();
                        });

                        it('should underline selection in editor',() => {
                            var $divs = getEditModeParagraphDivs($element);
                            var $paragraph1 = $divs.eq(0);
                            expect($paragraph1.text()).toBe('foobar');

                            var $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual('fooba');
                            expect(hasUnderline($spans.eq(0))).toBeTruthy();
                        });

                        it('should underline text in view-mode',() => {
                            switchToViewMode(powerbi.ViewMode.View);

                            var $divs = getViewModeParagraphDivs($element);
                            var $paragraph1 = $divs.eq(0);
                            expect($paragraph1.text()).toBe('foobar');

                            var $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual('fooba');
                            expect(hasUnderline($spans.eq(0))).toBeTruthy();
                        });
                    });

                    describe('changing font',() => {
                        var fontFace = 'Symbol';

                        beforeEach(() => {
                            setSelectValue(fontSelect(getToolbar()), fontFace);
                        });

                        it('should change font in editor',() => {
                            var $divs = getEditModeParagraphDivs($element);
                            var $paragraph1 = $divs.eq(0);
                            expect($paragraph1.text()).toBe('foobar');

                            var $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual('fooba');
                            expect(getFont($spans.eq(0))).toEqual(fontFace);

                            expect(getSelectText(fontSelect(getToolbar()))).toEqual(fontFace);
                        });

                        it('should change font in view-mode',() => {
                            switchToViewMode(powerbi.ViewMode.View);

                            var $divs = getViewModeParagraphDivs($element);
                            var $paragraph1 = $divs.eq(0);
                            expect($paragraph1.text()).toBe('foobar');

                            var $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual('fooba');
                            expect(getFont($spans.eq(0))).toEqual(fontFace);
                        });
                    });

                    describe('changing font (embedded)',() => {
                        var fontFace = 'wf_segoe-ui_normal';

                        beforeEach(() => {
                            setSelectValue(fontSelect(getToolbar()), fontFace);
                        });

                        it('should change font in editor',() => {
                            var $divs = getEditModeParagraphDivs($element);
                            var $paragraph1 = $divs.eq(0);
                            expect($paragraph1.text()).toBe('foobar');

                            var $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual('fooba');
                            expect(getFont($spans.eq(0))).toEqual(fontFace);

                            expect(getSelectText(fontSelect(getToolbar()))).toEqual('Segoe UI');
                        });

                        it('should change font in view-mode',() => {
                            switchToViewMode(powerbi.ViewMode.View);

                            var $divs = getViewModeParagraphDivs($element);
                            var $paragraph1 = $divs.eq(0);
                            expect($paragraph1.text()).toBe('foobar');

                            var $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual('fooba');
                            expect(getFont($spans.eq(0))).toEqual(fontFace);
                        });
                    });

                    describe('changing font size',() => {
                        var fontSize = '24px';

                        beforeEach(() => {
                            setSelectValue(fontSizeSelect(getToolbar()), fontSize);
                        });

                        it('should change font size in editor',() => {
                            var $divs = getEditModeParagraphDivs($element);
                            var $paragraph1 = $divs.eq(0);
                            expect($paragraph1.text()).toBe('foobar');

                            var $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual('fooba');
                            expect(getFontSize($spans.eq(0))).toEqual(fontSize);

                            expect(getSelectText(fontSizeSelect(getToolbar()))).toEqual('24');
                        });

                        it('should change font size in view-mode',() => {
                            switchToViewMode(powerbi.ViewMode.View);

                            var $divs = getViewModeParagraphDivs($element);
                            var $paragraph1 = $divs.eq(0);
                            expect($paragraph1.text()).toBe('foobar');

                            var $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual('fooba');
                            expect(getFontSize($spans.eq(0))).toEqual(fontSize);
                        });
                    });

                    describe('changing text alignment',() => {
                        var alignment = 'center';

                        beforeEach(() => {
                            setSelectValue(textAlignmentSelect(getToolbar()), alignment);
                        });

                        it('should change text alignment in editor',() => {
                            var $divs = getEditModeParagraphDivs($element);
                            var $paragraph1 = $divs.eq(0);

                            // NOTE: Changes alignment for the entire paragraph.
                            expect($paragraph1.text()).toEqual('foobar');
                            expect(getTextAlignment($paragraph1)).toEqual(alignment);

                            expect(getSelectText(textAlignmentSelect(getToolbar()))).toEqual('Center');
                        });

                        it('should change text alignment in view-mode',() => {
                            switchToViewMode(powerbi.ViewMode.View);

                            var $divs = getViewModeParagraphDivs($element);
                            var $paragraph1 = $divs.eq(0);
                            
                            // NOTE: Changes alignment for the entire paragraph.
                            expect($paragraph1.text()).toEqual('foobar');
                            expect(getTextAlignment($paragraph1)).toEqual(alignment);
                        });
                    });
                });

                function getToolbar(): JQuery {
                    return $toolbar;
                }

                function boldButton($toolbar: JQuery): JQuery {
                    return $toolbar.find('.ql-bold');
                }

                function italicButton($toolbar: JQuery): JQuery {
                    return $toolbar.find('.ql-italic');
                }

                function underlineButton($toolbar: JQuery): JQuery {
                    return $toolbar.find('.ql-underline');
                }

                function fontSelect($toolbar: JQuery): JQuery {
                    return $toolbar.find('.ql-font');
                }

                function fontSizeSelect($toolbar: JQuery): JQuery {
                    return $toolbar.find('.ql-size');
                }

                function textAlignmentSelect($toolbar: JQuery): JQuery {
                    return $toolbar.find('.ql-align');
                }

                function setSelectValue($select: JQuery, value: any): void {
                    // See powerbi.visuals.RichText.Toolbar.setSelectValue() for description.
                    // NOTE: For unit tests case we have to use document.createEvent() because PhantomJS does
                    // not appear to support new UIEvent (https://github.com/ariya/phantomjs/issues/11289).
                    $select.val(value);
                    var evt = document.createEvent('UIEvent');
                    evt.initUIEvent('change', false, false, null, 0);
                    $select.get(0).dispatchEvent(evt);
                }

                function getSelectText($select: JQuery): string {
                    return $select.children('option:selected').text();
                }
            });

            function switchToViewMode(viewMode: powerbi.ViewMode): void {
                getViewModeSpy.and.returnValue(viewMode);
                textbox.onViewModeChanged(viewMode);
            }

            function verifyEditor($element: JQuery, present: boolean): void {
                expect($element).toHaveClass('richtextbox');

                if (present) {
                    var $container = $element.children('div').eq(0);
                    expect($container).toBeDefined();

                    expect(setToolbarSpy).toHaveBeenCalled();
                    expect($toolbar).toBeDefined();
                    expect($toolbar.hasClass('ql-toolbar')).toBeTruthy();

                    var $editorContainer = $container.find('.ql-container');
                    expect($editorContainer.length).toBe(1);

                    var $editor = $editorContainer.find('.ql-editor');
                    expect($editor.length).toBe(1);
                }
                else {
                    expect($element.find('.ql-editor').length).toBe(0);
                }
            }
        });

        function getTagName($element: JQuery): string {
            return $element.get(0).tagName.toLowerCase();
        }

        function hasBold($element: JQuery): boolean {
            return getTagName($element) === 'b' || $element.css('font-weight') === 'bold';
        }

        function hasItalic($element: JQuery): boolean {
            return getTagName($element) === 'i' || $element.css('font-style') === 'italic';
        }

        function hasUnderline($element: JQuery): boolean {
            return getTagName($element) === 'u' || $element.css('text-decoration') === 'underline';
        }

        function getUrl($element: JQuery): string {
            var $anchor = (getTagName($element) === 'a') ? $element : $element.find('a');
            return $anchor.attr('href');
        }

        function getFont($element: JQuery): string {
            return $element.css('font-family');
        }

        function getFontSize($element: JQuery): string {
            return $element.css('font-size');
        }

        function getTextAlignment($element: JQuery): string {
            return $element.css('text-align');
        }

        function buildParagraphsDataView(paragraphs: powerbi.visuals.ParagraphContext[]): powerbi.DataView[] {
            return [{ metadata: { columns: [], objects: { general: { paragraphs: paragraphs } } } }];
        }

        function getViewModeParagraphDivs($element: JQuery): JQuery {
            return $element.children('div');
        }

        function getEditModeParagraphDivs($element: JQuery): JQuery {
            var $editor = $element.find('.ql-editor');
            expect($editor.length).toBe(1);

            return $editor.children('div');
        }
    });
}