//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {

    /** Represents a rich text box that supports view & edit mode. */
    export class RichTextbox implements IVisual {
        private editor: RichText.QuillWrapper;
        private element: JQuery;
        private host: IVisualHostServices;
        private viewPort: IViewport;
        private readOnly: boolean;
        private paragraphs: ParagraphContext[];

        public static capabilities: VisualCapabilities = {
            objects: {
                general: {
                    properties: {
                        paragraphs: {
                            type: { /* ParagraphContext */ }
                        }
                    }
                }
            },
            suppressDefaultTitle: true,
        };

        public init(options: VisualInitOptions) {
            this.element = options.element;
            this.host = options.host;
            this.viewPort = options.viewport;
            this.element.addClass('richtextbox');
            this.element.css({
                'font-family': RichText.defaultFont,
                'font-size': RichText.defaultFontSize,
            });

            this.readOnly = (this.host.getViewMode() === ViewMode.View);
            this.paragraphs = [];
            this.refreshView();
        }

        public onResizing(viewport: IViewport, duration: number): void {
            this.viewPort = viewport;
            this.updateSize();
        }

        public onDataChanged(options: VisualDataChangedOptions): void {
            debug.assertValue(options, 'options');
            var dataViews = options.dataViews;

            this.paragraphs = [];
            if (dataViews && dataViews.length > 0) {
                var objects = <TextboxDataViewObjects>dataViews[0].metadata.objects;

                if (objects && objects.general)
                    this.paragraphs = objects.general.paragraphs;
            }

            this.refreshView();
        }

        public destroy(): void {
        }

        public onViewModeChanged(viewMode: ViewMode): void {
            this.readOnly = (viewMode === ViewMode.View);
            this.refreshView();
        }

        public setSelection(start: number, end: number): void {
            debug.assertValue(this.editor, 'editor');

            if (this.editor)
                this.editor.setSelection(start, end);
        }

        private refreshView() {
            if (this.readOnly) {
                // Showing just HTML, no editor.
                // If we are in view-mode and we have an editor, we can remove it (after saving).
                if (this.editor) {
                    this.editor.formatUrls();
                    this.saveContents();
                    this.editor = null;
                }

                this.element.empty();
                this.element.append(RichTextbox.convertParagraphsToHtml(this.paragraphs));
            }
            else {
                // Showing the Quill editor.
                // If we are in edit-mode and we don't have an editor we need to create it.
                if (!this.editor) {
                    this.editor = new RichText.QuillWrapper(this.readOnly, this.host);
                    this.editor.textChanged = (delta, source) => this.saveContents();

                    this.element.empty();
                    this.element.append(this.editor.getElement());
                }

                this.editor.setContents(RichTextbox.convertParagraphsToOps(this.paragraphs));
            }

            this.updateSize();
        }

        private saveContents(): void {
            // It's possible to get here via a throttled text-changed event after a view-mode change has occured and
            // we are now in view mode. Since we save changes on view-mode change it is safe to ignore this call.
            if (!this.editor)
                return;

            var contents: quill.Delta = this.editor.getContents();
            this.paragraphs = RichTextbox.convertDeltaToParagraphs(contents);

            var changes: VisualObjectInstance[] = [{
                objectName: 'general',
                properties: {
                    paragraphs: this.paragraphs
                },
                selector: null,  // TODO: need something here?
            }];

            this.host.persistProperties(changes);
        }

        private updateSize(): void {
            if (this.editor)
                this.editor.resize(this.viewPort);
        }

        private static convertDeltaToParagraphs(contents: quill.Delta): ParagraphContext[]{
            var paragraphs: ParagraphContext[] = [];
            var paragraph: ParagraphContext = { textRuns: [] };

            for (var i = 0, len = contents.ops.length; i < len; i++) {
                var insertOp = <quill.InsertOp>contents.ops[i];
                debug.assertValue(insertOp, "operation should be an insert");

                if (typeof insertOp.insert === "string") {
                    // string insert values represent text.
                    var text = <string>insertOp.insert;
                    var attributes: quill.FormatAttributes = insertOp.attributes;

                    if (attributes && attributes.align) {
                        // Sometimes horizontal alignment is set after the first "insert" of the paragraph, which is likely a bug
                        // in Quill. In any case we should never see different horizontal alignments in a single paragraph.
                        debug.assert(
                            paragraph.horizontalTextAlignment === undefined || paragraph.horizontalTextAlignment === attributes.align,
                            'paragraph should not have more than one horizontal alignment');
                        paragraph.horizontalTextAlignment = attributes.align;
                    }

                    // Quill gives us back text runs that may have \n's in them. We want to create a new paragraph for each \n we see.
                    var spans = text.split('\n');
                    for (var spanIndex = 0, spanLen = spans.length; spanIndex < spanLen; spanIndex++) {
                        var span = spans[spanIndex];

                        if (span.length > 0) {
                            var textRun: TextRunContext = { value: span };
                            if (attributes) {
                                if (attributes.link !== undefined)
                                    textRun.url = attributes.link;

                                var textStyle = RichTextbox.convertFormatAttributesToTextStyle(attributes);
                                if (textStyle)
                                    textRun.textStyle = textStyle;
                            }

                            paragraph.textRuns.push(textRun);
                        }

                        // For every span but the last we create a new paragraph.
                        if (spanIndex < spanLen - 1) {
                            if (paragraph.textRuns.length > 0)
                                paragraphs.push(paragraph);

                            paragraph = { textRuns: [] };
                        }
                    }
                }
                else {
                    // numeric insert values represent embeds.
                    debug.assertFail("embeds not supported");
                }
            }

            if (paragraph.textRuns.length > 0)
                paragraphs.push(paragraph);

            return paragraphs;
        }

        private static convertParagraphsToHtml(paragraphs: ParagraphContext[]): JQuery {
            var $paragraphs: JQuery = $();

            for (var paragraphIndex = 0, len = paragraphs.length; paragraphIndex < len; ++paragraphIndex) {
                var paragraphDef = paragraphs[paragraphIndex];
                var isParagraphEmpty = true;

                var $paragraph = $('<div>');

                if (paragraphDef.horizontalTextAlignment)
                    $paragraph.css('text-align', paragraphDef.horizontalTextAlignment);

                for (var textRunIndex = 0, jlen = paragraphDef.textRuns.length; textRunIndex < jlen; ++textRunIndex) {
                    var textRunDef = paragraphDef.textRuns[textRunIndex];

                    var $textRun = $('<span>');

                    var styleDef = textRunDef.textStyle;
                    if (styleDef) {
                        var css = {};
                        if (styleDef.fontFamily) {
                            css['font-family'] = RichText.getFontFamily(styleDef.fontFamily);
                        }

                        if (styleDef.fontSize) {
                            css['font-size'] = styleDef.fontSize;
                        }

                        if (styleDef.fontStyle) {
                            css['font-style'] = styleDef.fontStyle;
                        }

                        if (styleDef.fontWeight) {
                            css['font-weight'] = styleDef.fontWeight;
                        }

                        if (styleDef.textDecoration) {
                            css['text-decoration'] = styleDef.textDecoration;
                        }

                        $textRun.css(css);
                    }

                    var text = textRunDef.value;
                    if (!jsCommon.StringExtensions.isNullOrEmpty(text))
                        isParagraphEmpty = false;

                    if (textRunDef.url !== undefined) {
                        var $link = $('<a>')
                            .attr('href', textRunDef.url)
                            .text(text);

                        $textRun.append($link);
                    }
                    else {
                        $textRun.text(text);
                    }

                    $paragraph.append($textRun);
                }

                // If the entire paragraph is empty we need to make sure we enforce a line-break.
                if (isParagraphEmpty)
                    $paragraph.append($('<br>'));

                $paragraphs = $paragraphs.add($paragraph);
            }

            return $paragraphs;
        }

        private static convertParagraphsToOps(paragraphs: ParagraphContext[]): quill.Op[] {
            var ops: quill.InsertOp[] = [];

            for (var paragraphIndex = 0, len = paragraphs.length; paragraphIndex < len; ++paragraphIndex) {
                var paragraphDef = paragraphs[paragraphIndex];

                for (var textRunIndex = 0, jlen = paragraphDef.textRuns.length; textRunIndex < jlen; ++textRunIndex) {
                    var textRunDef = paragraphDef.textRuns[textRunIndex];
                    var formats: quill.FormatAttributes = {};

                    if (paragraphDef.horizontalTextAlignment)
                        formats.align = paragraphDef.horizontalTextAlignment;

                    var styleDef = textRunDef.textStyle;
                    if (styleDef) {
                        if (styleDef.fontFamily) {
                            formats.font = RichText.getFontFamily(styleDef.fontFamily);
                        }

                        if (styleDef.fontSize) {
                            formats.size = styleDef.fontSize;
                        }

                        formats.italic = (styleDef.fontStyle === 'italic');
                        formats.bold = (styleDef.fontWeight === 'bold');
                        formats.underline = (styleDef.textDecoration === 'underline');
                    }

                    var text = textRunDef.value;

                    var op: quill.InsertOp = {
                        insert: text,
                        attributes: formats,
                    };

                    ops.push(op);

                    // The last text run of the paragraph needs to end with '\n' to get Quill to handle the text alignment correctly.
                    if (textRunIndex === (jlen - 1) && !jsCommon.StringExtensions.endsWith(text, '\n')) {
                        ops.push({
                            insert: '\n',
                            attributes: formats,
                        });
                    }
                }
            }

            return ops;
        }

        private static convertFormatAttributesToTextStyle(attributes: quill.FormatAttributes): TextRunStyle {
            var style: TextRunStyle = {};

            // NOTE: Align is taken care of when converting to paragraphs.
            if (attributes.bold) {
                style.fontWeight = 'bold';
            }
            if (attributes.font) {
                // TODO: "Heading"?
                style.fontFamily = attributes.font;
            }
            if (attributes.italic) {
                style.fontStyle = 'italic';
            }
            if (attributes.size) {
                style.fontSize = attributes.size;
            }
            if (attributes.underline) {
                style.textDecoration = 'underline';
            }
            /*
            TODO:
            if (attributes.background) {
            }
            if (attributes.color) {
            }
            */

            return style;
        }
    }

    export module RichText {
        interface ListValueOption {
            label: string;
            value: string;
        }

        // These fonts are embedded using CSS, or are aliases to other fonts.
        var fontMap = {
            'Segoe (Bold)': 'wf_segoe-ui_bold',
            'Segoe UI': 'wf_segoe-ui_normal',
            'Segoe UI Light': 'wf_segoe-ui_light',
            'Heading': 'wf_segoe-ui_light',
            'Body': 'wf_segoe-ui_normal',
        };

        var fonts: ListValueOption[] = [
            'Arial',
            'Arial Black',
            'Arial Unicode MS',
            'Calibri',
            'Cambria',
            'Cambria Math',
            'Candara',
            'Comic Sans MS',
            'Consolas',
            'Constantia',
            'Corbel',
            'Courier New',
            'Georgia',
            'Lucida Sans Unicode',
            'Segoe (Bold)',
            'Segoe UI',
            'Segoe UI Light',
            'Symbol',
            'Tahoma',
            'Times New Roman',
            'Trebuchet MS',
            'Verdana',
            'Wingdings',
            'Wingdings 2',
            'Wingdings 3',
        ].map((font) => <ListValueOption> { label: font, value: getFontFamily(font) });
        export var defaultFont = getFontFamily('Segoe UI Light');

        var fontSizes: ListValueOption[] = [
            '8', '9', '10', '10.5', '11', '12', '14', '16', '18', '20', '24', '28', '32', '36', '40', '42', '44', '54', '60', '66', '72', '80', '88', '96'
        ].map((size) => <ListValueOption> { label: size, value: size + 'px' });
        export var defaultFontSize = '14px';

        var textAlignments: ListValueOption[] = [
            'Left',
            'Center',
            'Right',
        ].map((alignment) => <ListValueOption> { label: alignment, value: alignment.toLowerCase() });

        export function getFontFamily(font: string): string {
            var family = fontMap[font];
            return (family !== undefined) ? family : font;
        }

        export class QuillWrapper {
            private editor: quill.Quill;
            private $editorDiv: JQuery;
            private $toolbarDiv: JQuery;
            private $container: JQuery;
            private dependenciesLoaded: JQueryDeferred<void>;
            private localizationProvider: jsCommon.IStringResourceProvider;
            private host: IVisualHostServices;
            private static textChangeThrottle = 200; // ms
            private static formatUrlThrottle = 1000; // ms

            public static loadQuillResources: boolean = true;

            // TODO: How to choose between minified/unminified?
            // TODO: Consider loading this from the CDN.
            private static quillJsFiles = [ powerbi.build + '/externals/quill.min.js' ];
            private static quillCssFiles = [ powerbi.build + '/externals/quill.base.css' ];
            private QuillPackage: jsCommon.IDependency = {
                javaScriptFiles: QuillWrapper.quillJsFiles,
                cssFiles: QuillWrapper.quillCssFiles,
            };

            public initialized: boolean;
            public readOnly: boolean;
            public textChanged: (delta, source) => void = (d, s) => { };

            /*
             * JavaScript and CSS resources are typically resolved asynchronously. This means we potentially defer certain
             * events which typically occur synchronously until resources are loaded. Setting the global loadQuillResources
             * flag to true will override this behavior and cause the wrapper to assume these resources are already loaded
             * and not try to load them asynchronously (e.g. for use in unit tests).
             */
            constructor(readOnly: boolean, host: IVisualHostServices) {
                this.host = host;
                this.$container = $('<div>');
                this.readOnly = readOnly;

                this.localizationProvider = {
                    get: (stringId: string) => this.host.getLocalizedString(stringId)
                };

                if (QuillWrapper.loadQuillResources) {
                    // Defer creation of the editor until after resources are loaded.
                    this.initialized = false;
                    this.dependenciesLoaded = $.Deferred<void>();
                    this.dependenciesLoaded.done(() => {
                        this.rebuildQuillEditor();
                        this.initialized = true;
                    });

                    jsCommon.requires(this.QuillPackage,() => this.dependenciesLoaded.resolve());
                }
                else {
                    this.rebuildQuillEditor();
                    this.initialized = true;
                }
            }

            public getElement(): JQuery {
                return this.$container;
            }

            public getToolbar(): JQuery {
                return this.$toolbarDiv;
            }

            public getContents(): quill.Delta {
                return this.editor.getContents();
            }

            public setContents(contents: quill.Delta | quill.Op[]): void {
                // If we haven't loaded the editor yet, defer this call until we do
                // TODO: prevent these from stacking up?
                if (!this.initialized) {
                    this.dependenciesLoaded.done(() => this.setContents(contents));
                    return;
                }

                this.editor.setHTML('', 'api');  // Clear contents
                if (contents)
                this.editor.setContents(contents, 'api');
                this.formatUrls();
            }

            public resize(viewport: IViewport): void {
                if (!this.initialized)
                    return;

                this.$container.width(viewport.width);
                this.$container.height(viewport.height);
            }

            public setReadOnly(readOnly: boolean): void {
                var readOnlyChanged = readOnly !== this.readOnly;
                this.readOnly = readOnly;

                if (this.initialized && readOnlyChanged) {
                    this.rebuildQuillEditor();
                }
            }

            public formatUrls(): void {
                var text = this.editor.getText();
                var urlRegex = /http[s]?:\/\/(\S)+/gi;

                // Remove existing links, then find and format all urls in the text.
                // TODO: This can be a bit expensive, maybe include a cap here for text with many urls?
                this.editor.formatText(0, text.length, 'link', false, 'api');
                var matches;
                while ((matches = urlRegex.exec(text)) !== null) {
                    var url = matches[0];
                    var start = matches.index;
                    var end = urlRegex.lastIndex;
                    this.editor.formatText(start, end, 'link', url, 'api');
                }
            }

            public setSelection(start: number, end: number): void {
                this.editor.setSelection(start, end, 'api');
            }

            public getSelection(): quill.Range {
                return this.editor.getSelection();
            }

            private rebuildQuillEditor(): void {
                // Preserve contents if we already have an editor.
                var contents: quill.Delta = null;
                if (this.editor) {
                    this.editor.removeAllListeners();
                    contents = this.editor.getContents();
                }

                this.$container.empty();

                // Prevent canvas from handling keyboard shortcuts like ctrl+a that the browser will handle.
                this.$container.keydown((e) => e.stopPropagation());

                var $editorDiv = this.$editorDiv = $('<div>');

                // HACK: Quill does not apply the correct default styling if you clear all the content and add new content.
                $editorDiv.css('font-family', defaultFont);
                $editorDiv.css('font-size', defaultFontSize);

                var configs = {
                    readOnly: this.readOnly,
                    formats: ['bold', 'italic', 'underline', 'font', 'size', 'link', 'align', /* TODO: 'color', 'background' */],
                };
                this.editor = new Quill($editorDiv.get(0), configs);

                // If not readonly we add a toolbar and disable drag/resize
                if (!this.readOnly) {
                    var $toolbarDiv = this.$toolbarDiv;
                    if (!$toolbarDiv) {
                        var toolbar = new Toolbar.Toolbar(this.editor, this.localizationProvider);
                        this.$toolbarDiv = $toolbarDiv = toolbar.$container;
                    }

                    $toolbarDiv.addClass('unselectable');
                    this.host.setToolbar($toolbarDiv);
                    this.editor.addModule('toolbar', { container: $toolbarDiv.get(0) });

                    // Disable this so we can select text in the editor.
                    $editorDiv.attr('drag-resize-disabled', 'true');
                }

                this.$container.append($editorDiv);

                if (contents)
                    this.setContents(contents);

                // Throttle text-changed events to not more frequent than once per 200ms
                var textChangeThrottler = new jsCommon.ThrottleUtility(QuillWrapper.textChangeThrottle);
                this.editor.on('text-change',(delta, source) => {
                    if (source !== 'api')
                        textChangeThrottler.run(() => this.onTextChanged(delta, source));
                });

                // TODO: Actually, probably want something that continually defers until you stop typing, this is probably fine for now though.
                var formatUrlThrottler = new jsCommon.ThrottleUtility(QuillWrapper.formatUrlThrottle);
                this.editor.on('text-change',(delta, source) => {
                    if (source !== 'api')
                        formatUrlThrottler.run(() => this.formatUrls());
                });

                try {
                    this.editor.focus();
                }
                catch (e) {
                    // IE can throw an exception in this case because of the way Quill sets the selected range internally, just ignore any exceptions here.
                }
            }

            private onTextChanged(delta, source): void {
                this.textChanged(delta, source);
            }
        }

        module Toolbar {

            export function setSelectValue($select: JQuery, value: any): void {
                $select.val(value);
                // NOTE: The 'change' event is not raised when the value of the SELECT element is changed programatically,
                // and Quill uses it's own, non-JQuery, method to hook up to the 'change' event, therefore, we need to dispatch
                // this event manually on the SELECT element.
                var evt = document.createEvent('UIEvent');
                evt.initUIEvent('change', false, false, null, 0);
                $select.get(0).dispatchEvent(evt);
            }

            function formatGroup(): JQuery {
                return span()
                    .addClass('ql-format-group')
                    .attr('drag-resize-disabled', 'true');
            }

            function label(text: string): JQuery {
                return $('<label>').text(text);
            }

            function div(): JQuery {
                return $('<div>');
            }

            function span(): JQuery {
                return $('<span>');
            }

            export class Toolbar {
                private localizationProvider: jsCommon.IStringResourceProvider;

                public $container: JQuery;

                constructor(editor: quill.Quill, localizationProvider: jsCommon.IStringResourceProvider) {
                    this.localizationProvider = localizationProvider;

                    var fontPicker = this.picker('Font', fonts, 'font', defaultFont,
                        // Show the fonts in their own font face.
                        ($option, option) => { $option.css('font-family', option.value); return $option; }
                        );

                    this.$container = div()
                        .addClass('toolbar ql-toolbar')
                        .append(
                            formatGroup()
                            .append(label(localizationProvider.get('RichTextbox_Font_Label')))
                            .append(fontPicker)
                            .append(this.picker('Size', fontSizes, 'size', defaultFontSize).addClass('ql-size'))
                        )
                        .append(
                            formatGroup()
                            .append(this.formatButton(this.getLocalizationString('Bold'), 'bold').text('B'))
                            .append(this.formatButton(this.getLocalizationString('Italic'), 'italic').text('I'))
                            .append(this.formatButton(this.getLocalizationString('Underline'), 'underline').text('U'))
                        )
                        .append(
                            formatGroup()
                            .append(this.toggleGroup('Text Alignment', textAlignments, 'align', 'Left'))
                        );
                }

                private toggleGroup(title: string, list: ListValueOption[], format: string, defaultValue: string): JQuery {
                    var $group = span()
                        .attr('localize-tooltip', this.getLocalizationString(title))
                        .addClass('ql-toggle-group');

                    // Hidden selector that Quill will use to hook up change listeners.
                    var $select = this.selector(title, list, defaultValue)
                        .addClass('ql-picker ql-' + format)
                        .css('display', 'none');

                    var $buttons = list.map((option) => {
                        var $button = this.formatButton(this.getLocalizationString(option.label))
                            .attr('data-value', option.value)
                            .click((e) => setSelectValue($select, option.value));
                        return $button;
                    });

                    // Quill will change the value of the selector when the text selection changes, so we need to set the state of the buttons to match.
                    $select.change((e) => {
                        var newValue = $select.val();
                        for (var i = 0; i < $buttons.length; i++) {
                            $buttons[i].toggleClass('ql-active', $buttons[i].attr('data-value') === newValue);
                        }
                    });

                    $group.append($select);
                    $group.append($buttons);

                    return $group;
                }

                private picker(title: string, list: ListValueOption[], format: string, defaultValue: string, optionModifier?: (JQuery, ListValueOption) => JQuery): JQuery {
                    var $selector = this.selector(title, list, defaultValue, optionModifier)
                        .addClass('ql-picker ql-' + format);

                    return $selector;
                }

                private selector(title: string, list: ListValueOption[], defaultValue?: string, optionModifier?: (JQuery, ListValueOption) => JQuery): JQuery {
                    var $selector = $('<select>')
                        .attr('localize-tooltip', this.getLocalizationString(title));

                    for (var i = 0; i < list.length; i++) {
                        var option = list[i];
                        var $option = $('<option>')
                            .attr('value', option.value)
                            .text(option.label);

                        if (option.value === defaultValue)
                            $option.attr('selected', 'selected');

                        if (optionModifier !== undefined)
                            $option = optionModifier($option, option);

                        $selector.append($option);
                    }

                    return $selector;
                }

                private formatButton(tooltip?: string, format?: string) {
                    var $button = span()
                        .addClass('ql-format-button');

                    if (tooltip != null)
                        $button.attr('localize-tooltip', tooltip);

                    if (format != null)
                        $button.addClass('ql-' + format);

                    // Swallow this so that mouse down on a button does not steal selection from the editor.
                    $button.on('selectstart', () => false);

                    return $button;
                }

                private getLocalizationString(title: string): string {
                    return 'RichTextbox_' + title + '_ToolTip';
                }
            }
        }
    }
}