//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

module powerbi.visuals {
    export interface TextRunStyle {
        fontFamily?: string;
        fontSize?: string;
        fontStyle?: string;
        fontWeight?: string;
        textDecoration?: string;
    }

    export interface TextRunContext {
        textStyle?: TextRunStyle;
        url?: string;
        value: string;
    }

    export interface ParagraphContext {
        horizontalTextAlignment?: string;
        textRuns: TextRunContext[];
    }

    export interface TextboxDataViewObjects extends DataViewObjects {
        general: TextboxDataViewObject;
    }

    export interface TextboxDataViewObject extends DataViewObject {
        paragraphs: ParagraphContext[];
    }

    export class Textbox implements IVisual {
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

        private element: JQuery;

        private static translateFontFamily(fontFamily: string): string {
            // TODO support themes.
            return fontFamily === "Heading" ? "Segoe UI Light" : fontFamily;
        }

        public init(options: VisualInitOptions) {
            this.element = options.element;
        }

        public onResizing(viewport: IViewport, duration: number): void {
        }

        public onDataChanged(options: VisualDataChangedOptions): void {
            this.element.empty();

            var dataViews = options.dataViews;
            if (!dataViews || dataViews.length === 0)
                return;

            var objects = <TextboxDataViewObjects>dataViews[0].metadata.objects;
            if (!objects || !objects.general)
                return;

            var paragraphs: ParagraphContext[] = objects.general.paragraphs;
            if (!paragraphs)
                return;

            var textboxDiv = $("<div class='textbox'></div>");
            for (var i = 0, len = paragraphs.length; i < len; ++i) {
                var paraDef = paragraphs[i];
                var paraDiv = $("<div />");

                if (paraDef.horizontalTextAlignment) {
                    paraDiv.css('textAlign', paraDef.horizontalTextAlignment);
                }

                for (var j = 0, jlen = paraDef.textRuns.length; j < jlen; ++j) {
                    var textRunDef = paraDef.textRuns[j];
                    var textRunSpan = $("<span/>");

                    var styleDef = textRunDef.textStyle;
                    if (styleDef) {
                        if (styleDef.fontFamily) {
                            textRunSpan.css('fontFamily', Textbox.translateFontFamily(styleDef.fontFamily));
                        }

                        if (styleDef.fontSize) {
                            textRunSpan.css('fontSize', styleDef.fontSize);
                        }

                        if (styleDef.fontStyle) {
                            textRunSpan.css('fontStyle', styleDef.fontStyle);
                        }

                        if (styleDef.fontWeight) {
                            textRunSpan.css('fontWeight', styleDef.fontWeight);
                        }

                        if (styleDef.textDecoration) {
                            textRunSpan.css('textDecoration', styleDef.textDecoration);
                        }
                    }

                    textRunSpan.text(textRunDef.value);
                    textRunSpan.appendTo(paraDiv);
                }
                paraDiv.appendTo(textboxDiv);
            }

            textboxDiv.appendTo(this.element);
        }
    }
}