//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
var powerbitests;
(function (powerbitests) {
    var RichTextbox = powerbi.visuals.RichTextbox;
    describe('Rich Textbox', function () {
        var viewport = {
            height: 500,
            width: 500
        };
        var style = powerbi.common.services.visualStyles.create();
        describe('capabilities', function () {
            it('should suppress title', function () {
                expect(RichTextbox.capabilities.suppressDefaultTitle).toBeTruthy();
            });
            // TODO: enable when we add this plugin
            //it('should register capabilities',() => {
            //    var pluginFactory = powerbi.visuals.visualPluginFactory.create();
            //    var plugin = pluginFactory.getPlugin('richtextbox');
            //    expect(plugin).toBeDefined();
            //    expect(plugin.capabilities).toBe(RichTextbox.capabilities);
            //});
        });
        // Chutzpah is configured to load the quill resources for these tests.
        powerbi.visuals.RichText.QuillWrapper.loadQuillResources = false;
        // ---- Sample data ----
        // 2 paragraphs, no formatting.
        var paragraphs1 = [
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
        var paragraphs2 = [
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
        var paragraphs3 = [
            {
                textRuns: [
                    { value: 'http://www.powerbi.com' },
                ]
            }
        ];
        describe('', function () {
            var host;
            var $element;
            var $toolbar;
            var initOptions;
            var textbox;
            var getViewModeSpy;
            var setToolbarSpy;
            beforeEach(function () {
                host = powerbitests.mocks.createVisualHostServices();
                $element = powerbitests.helpers.testDom('500', '500');
                initOptions = {
                    element: $element,
                    host: host,
                    viewport: viewport,
                    style: style
                };
                getViewModeSpy = spyOn(host, 'getViewMode');
                setToolbarSpy = spyOn(host, 'setToolbar');
                setToolbarSpy.and.callFake(function (t) { return $toolbar = t; });
            });
            describe('init in view mode', function () {
                beforeEach(function () {
                    getViewModeSpy.and.returnValue(0 /* View */);
                    textbox = new RichTextbox();
                    textbox.init(initOptions);
                });
                it('should not show editor', function () {
                    verifyEditor($element, false);
                });
                it('change to edit-mode should show editor', function () {
                    switchToViewMode(1 /* Edit */);
                    verifyEditor($element, true);
                });
                describe('on data changed', function () {
                    it('with non-empty dataview should set content', function () {
                        textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs1) });
                        var $divs = getViewModeParagraphDivs($element);
                        expect($divs.length).toBe(2);
                        var $paragraph1 = $divs.eq(0);
                        expect($paragraph1.text()).toEqual('foobar');
                        var $paragraph2 = $divs.eq(1);
                        expect($paragraph2.text()).toEqual('baz');
                    });
                    it('with empty dataview should clear content', function () {
                        textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs1) });
                        // Clear the content.
                        textbox.onDataChanged({ dataViews: [] });
                        var $divs = getViewModeParagraphDivs($element);
                        expect($divs.text()).toEqual('');
                    });
                    it('with formatted text should render correctly', function () {
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
                });
            });
            describe('init in edit mode', function () {
                beforeEach(function () {
                    getViewModeSpy.and.returnValue(1 /* Edit */);
                    textbox = new RichTextbox();
                    textbox.init(initOptions);
                });
                it('should show editor', function () {
                    verifyEditor($element, true);
                });
                it('change to view-mode should not show editor', function () {
                    switchToViewMode(0 /* View */);
                    verifyEditor($element, false);
                });
                it('change to view-mode should format any urls', function () {
                    textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs3) });
                    switchToViewMode(0 /* View */);
                    var $divs = getViewModeParagraphDivs($element);
                    var $urlRun = $divs.children('span').eq(0);
                    expect(getUrl($urlRun)).toEqual('http://www.powerbi.com');
                });
                it('change to view-mode should save content', function () {
                    var changes = [];
                    spyOn(host, 'persistProperties').and.callFake(function (c) { return changes = c; });
                    textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs2) });
                    switchToViewMode(0 /* View */);
                    expect(changes).toHaveLength(1);
                    var change = changes[0];
                    expect(change.objectName).toEqual('general');
                    var paragraphs = change.properties.paragraphs;
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
                describe('on data changed', function () {
                    it('with non-empty dataview should set content', function () {
                        textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs1) });
                        var $divs = getEditModeParagraphDivs($element);
                        var $paragraph1 = $divs.eq(0);
                        expect($paragraph1.text()).toEqual('foobar');
                        var $paragraph2 = $divs.eq(1);
                        expect($paragraph2.text()).toBe('baz');
                    });
                    it('with empty dataview should clear content', function () {
                        textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs1) });
                        // Clear the content.
                        textbox.onDataChanged({ dataViews: [] });
                        var $divs = getEditModeParagraphDivs($element);
                        expect($divs.text()).toEqual('');
                    });
                    it('with formatted text should render correctly', function () {
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
            describe('', function () {
                beforeEach(function () {
                    getViewModeSpy.and.returnValue(1 /* Edit */);
                    textbox = new RichTextbox();
                    textbox.init(initOptions);
                });
                it('toolbar should exist with formatting options', function () {
                    var $toolbar = getToolbar();
                    expect($toolbar).toBeDefined();
                    expect(boldButton($toolbar)).toBeDefined();
                    expect(italicButton($toolbar)).toBeDefined();
                    expect(underlineButton($toolbar)).toBeDefined();
                    expect(fontSelect($toolbar)).toBeDefined();
                    expect(fontSizeSelect($toolbar)).toBeDefined();
                    expect(textAlignmentSelect($toolbar)).toBeDefined();
                });
                describe('with selected text', function () {
                    beforeEach(function () {
                        textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs1) });
                        textbox.setSelection(0, 5);
                    });
                    describe('clicking bold', function () {
                        beforeEach(function () {
                            boldButton(getToolbar()).click();
                        });
                        it('should bold selection in editor', function () {
                            var $divs = getEditModeParagraphDivs($element);
                            var $paragraph1 = $divs.eq(0);
                            expect($paragraph1.text()).toBe('foobar');
                            var $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual('fooba');
                            expect(hasBold($spans.eq(0))).toBeTruthy();
                        });
                        it('should bold text in view-mode', function () {
                            switchToViewMode(0 /* View */);
                            var $divs = getViewModeParagraphDivs($element);
                            var $paragraph1 = $divs.eq(0);
                            expect($paragraph1.text()).toBe('foobar');
                            var $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual('fooba');
                            expect(hasBold($spans.eq(0))).toBeTruthy();
                        });
                    });
                    describe('clicking italic', function () {
                        beforeEach(function () {
                            italicButton(getToolbar()).click();
                        });
                        it('should italicize selection in editor', function () {
                            var $divs = getEditModeParagraphDivs($element);
                            var $paragraph1 = $divs.eq(0);
                            expect($paragraph1.text()).toBe('foobar');
                            var $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual('fooba');
                            expect(hasItalic($spans.eq(0))).toBeTruthy();
                        });
                        it('should italicize text in view-mode', function () {
                            switchToViewMode(0 /* View */);
                            var $divs = getViewModeParagraphDivs($element);
                            var $paragraph1 = $divs.eq(0);
                            expect($paragraph1.text()).toBe('foobar');
                            var $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual('fooba');
                            expect(hasItalic($spans.eq(0))).toBeTruthy();
                        });
                    });
                    describe('clicking underline', function () {
                        beforeEach(function () {
                            underlineButton(getToolbar()).click();
                        });
                        it('should underline selection in editor', function () {
                            var $divs = getEditModeParagraphDivs($element);
                            var $paragraph1 = $divs.eq(0);
                            expect($paragraph1.text()).toBe('foobar');
                            var $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual('fooba');
                            expect(hasUnderline($spans.eq(0))).toBeTruthy();
                        });
                        it('should underline text in view-mode', function () {
                            switchToViewMode(0 /* View */);
                            var $divs = getViewModeParagraphDivs($element);
                            var $paragraph1 = $divs.eq(0);
                            expect($paragraph1.text()).toBe('foobar');
                            var $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual('fooba');
                            expect(hasUnderline($spans.eq(0))).toBeTruthy();
                        });
                    });
                    describe('changing font', function () {
                        var fontFace = 'Symbol';
                        beforeEach(function () {
                            setSelectValue(fontSelect(getToolbar()), fontFace);
                        });
                        it('should change font in editor', function () {
                            var $divs = getEditModeParagraphDivs($element);
                            var $paragraph1 = $divs.eq(0);
                            expect($paragraph1.text()).toBe('foobar');
                            var $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual('fooba');
                            expect(getFont($spans.eq(0))).toEqual(fontFace);
                            expect(getSelectText(fontSelect(getToolbar()))).toEqual(fontFace);
                        });
                        it('should change font in view-mode', function () {
                            switchToViewMode(0 /* View */);
                            var $divs = getViewModeParagraphDivs($element);
                            var $paragraph1 = $divs.eq(0);
                            expect($paragraph1.text()).toBe('foobar');
                            var $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual('fooba');
                            expect(getFont($spans.eq(0))).toEqual(fontFace);
                        });
                    });
                    describe('changing font (embedded)', function () {
                        var fontFace = 'wf_segoe-ui_normal';
                        beforeEach(function () {
                            setSelectValue(fontSelect(getToolbar()), fontFace);
                        });
                        it('should change font in editor', function () {
                            var $divs = getEditModeParagraphDivs($element);
                            var $paragraph1 = $divs.eq(0);
                            expect($paragraph1.text()).toBe('foobar');
                            var $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual('fooba');
                            expect(getFont($spans.eq(0))).toEqual(fontFace);
                            expect(getSelectText(fontSelect(getToolbar()))).toEqual('Segoe UI');
                        });
                        it('should change font in view-mode', function () {
                            switchToViewMode(0 /* View */);
                            var $divs = getViewModeParagraphDivs($element);
                            var $paragraph1 = $divs.eq(0);
                            expect($paragraph1.text()).toBe('foobar');
                            var $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual('fooba');
                            expect(getFont($spans.eq(0))).toEqual(fontFace);
                        });
                    });
                    describe('changing font size', function () {
                        var fontSize = '24px';
                        beforeEach(function () {
                            setSelectValue(fontSizeSelect(getToolbar()), fontSize);
                        });
                        it('should change font size in editor', function () {
                            var $divs = getEditModeParagraphDivs($element);
                            var $paragraph1 = $divs.eq(0);
                            expect($paragraph1.text()).toBe('foobar');
                            var $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual('fooba');
                            expect(getFontSize($spans.eq(0))).toEqual(fontSize);
                            expect(getSelectText(fontSizeSelect(getToolbar()))).toEqual('24');
                        });
                        it('should change font size in view-mode', function () {
                            switchToViewMode(0 /* View */);
                            var $divs = getViewModeParagraphDivs($element);
                            var $paragraph1 = $divs.eq(0);
                            expect($paragraph1.text()).toBe('foobar');
                            var $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual('fooba');
                            expect(getFontSize($spans.eq(0))).toEqual(fontSize);
                        });
                    });
                    describe('changing text alignment', function () {
                        var alignment = 'center';
                        beforeEach(function () {
                            setSelectValue(textAlignmentSelect(getToolbar()), alignment);
                        });
                        it('should change text alignment in editor', function () {
                            var $divs = getEditModeParagraphDivs($element);
                            var $paragraph1 = $divs.eq(0);
                            // NOTE: Changes alignment for the entire paragraph.
                            expect($paragraph1.text()).toEqual('foobar');
                            expect(getTextAlignment($paragraph1)).toEqual(alignment);
                            expect(getSelectText(textAlignmentSelect(getToolbar()))).toEqual('Center');
                        });
                        it('should change text alignment in view-mode', function () {
                            switchToViewMode(0 /* View */);
                            var $divs = getViewModeParagraphDivs($element);
                            var $paragraph1 = $divs.eq(0);
                            // NOTE: Changes alignment for the entire paragraph.
                            expect($paragraph1.text()).toEqual('foobar');
                            expect(getTextAlignment($paragraph1)).toEqual(alignment);
                        });
                    });
                });
                function getToolbar() {
                    return $toolbar;
                }
                function boldButton($toolbar) {
                    return $toolbar.find('.ql-bold');
                }
                function italicButton($toolbar) {
                    return $toolbar.find('.ql-italic');
                }
                function underlineButton($toolbar) {
                    return $toolbar.find('.ql-underline');
                }
                function fontSelect($toolbar) {
                    return $toolbar.find('.ql-font');
                }
                function fontSizeSelect($toolbar) {
                    return $toolbar.find('.ql-size');
                }
                function textAlignmentSelect($toolbar) {
                    return $toolbar.find('.ql-align');
                }
                function setSelectValue($select, value) {
                    // See powerbi.visuals.RichText.Toolbar.setSelectValue() for description.
                    // NOTE: For unit tests case we have to use document.createEvent() because PhantomJS does
                    // not appear to support new UIEvent (https://github.com/ariya/phantomjs/issues/11289).
                    $select.val(value);
                    var evt = document.createEvent('UIEvent');
                    evt.initUIEvent('change', false, false, null, 0);
                    $select.get(0).dispatchEvent(evt);
                }
                function getSelectText($select) {
                    return $select.children('option:selected').text();
                }
            });
            function switchToViewMode(viewMode) {
                getViewModeSpy.and.returnValue(viewMode);
                textbox.onViewModeChanged(viewMode);
            }
            function verifyEditor($element, present) {
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
        function getTagName($element) {
            return $element.get(0).tagName.toLowerCase();
        }
        function hasBold($element) {
            return getTagName($element) === 'b' || $element.css('font-weight') === 'bold';
        }
        function hasItalic($element) {
            return getTagName($element) === 'i' || $element.css('font-style') === 'italic';
        }
        function hasUnderline($element) {
            return getTagName($element) === 'u' || $element.css('text-decoration') === 'underline';
        }
        function getUrl($element) {
            var $anchor = (getTagName($element) === 'a') ? $element : $element.find('a');
            return $anchor.attr('href');
        }
        function getFont($element) {
            return $element.css('font-family');
        }
        function getFontSize($element) {
            return $element.css('font-size');
        }
        function getTextAlignment($element) {
            return $element.css('text-align');
        }
        function buildParagraphsDataView(paragraphs) {
            return [{ metadata: { columns: [], objects: { general: { paragraphs: paragraphs } } } }];
        }
        function getViewModeParagraphDivs($element) {
            return $element.children('div');
        }
        function getEditModeParagraphDivs($element) {
            var $editor = $element.find('.ql-editor');
            expect($editor.length).toBe(1);
            return $editor.children('div');
        }
    });
})(powerbitests || (powerbitests = {}));
