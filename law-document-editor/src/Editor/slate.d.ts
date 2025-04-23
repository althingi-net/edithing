import { LawEditor, LawElement, TextNode } from 'law-document';
import { DOMEditor, ReactEditor } from 'slate-react';

declare module 'law-document' {
    interface LawEditor extends ReactEditor, DOMEditor {}
}

declare module 'slate' {
    interface CustomTypes {
        Editor: LawEditor;
        Element: LawElement;
        Text: TextNode;
    }
}