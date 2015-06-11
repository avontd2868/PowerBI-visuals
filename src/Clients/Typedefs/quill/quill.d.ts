declare var Quill: quill.QuillStatic;
declare var Delta: quill.DeltaStatic;

declare module quill {
    interface EventEmitter2 {
        on(event: string, listener: Function);
        off(event: string, listener: Function);
        removeAllListeners(event?: string);
    }

    interface Range {
        start: number;
        end: number;
    }

    interface Quill extends EventEmitter2 {
        root: HTMLElement;
        getText(start?: number, end?: number): string;
        getLength(): number;
        getContents(start?: number, end?: number): Delta;
        getHTML(): string;
        
        insertText(index: number, text: string)
        insertText(index: number, text: string, name: string, value: string)
        insertText(index: number, text: string, formats: FormatAttributes)
        insertText(index: number, text: string, source: string)
        insertText(index: number, text: string, name: string, value: string, source: string)
        insertText(index: number, text: string, formats: FormatAttributes, source: string)

        deleteText(start, end, source): void;
        formatText(start: number, end: number, name: string, value: any, source: string): void;
        formatText(range: any, name: string, value: any, source: string): void;
        insertEmbed(index, type, url, source): void;
        updateContents(delta, source): void;
        setContents(delta, source): void;
        setHTML(html, source): void;
        setText(text, source): void;
        
        getSelection(): Range;

        setSelection(start: number, end: number, source?: string): void;
        setSelection(range: Range, source?: string): void;

        prepareFormat(name, value, source): any;
        focus(): any;
        
        addModule(name, options): any;
        getModule(name): any;
        onModuleLoad(name, callback): any;
        addFormat(name, config): any;
        addContainer(className, before): any;
    }

    interface FormatAttributes {
        bold?: boolean;
        italic?: boolean;
        strike?: boolean;
        underline?: boolean;
        font?: string;
        size?: string;
        color?: string;
        background?: string;
        image?: string;
        link?: string;
        bullet?: boolean;
        list?: boolean;
        align?: string
    }

    interface QuillStatic {
        new (container: any): Quill;
        new (container: any, configs: any): Quill;
    }

    interface Delta {
        ops?: Op[];

        insert(text: string, attributes?: FormatAttributes): Delta;
        insert(embed: number, attributes?: FormatAttributes): Delta;

        delete(length: number): Delta;

        retain(length: number, attributes?: FormatAttributes): Delta;

        length(): number;

        slice(): Delta;
        slice(start: number): Delta;
        slice(start: number, end: number): Delta;

        compose(other: Delta): Delta;

        transform(other: Delta, priority: boolean): Delta;
        transform(index: number): number;

        transformPosition(index: number): number;

        diff(other: Delta): Delta;
    }

    interface DeltaStatic {
        new (): Delta;
    }

    type Op = InsertOp | DeleteOp | RetainOp;

    interface InsertOp {
        insert: string | number;
        attributes?: FormatAttributes;
    }

    interface DeleteOp {
        delete: number;
    }

    interface RetainOp {
        retain: number;
        attributes?: FormatAttributes;
    }
}