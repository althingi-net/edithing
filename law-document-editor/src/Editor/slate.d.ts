import { LawEditor, LawElement, TextNode } from 'law-document';
import { ReactEditor } from 'slate-react';

declare module 'law-document' {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface LawEditor extends ReactEditor {}
}

declare module 'slate' {
    interface CustomTypes {
        Editor: LawEditor;
        Element: LawElement;
        Text: TextNode;
    }
}