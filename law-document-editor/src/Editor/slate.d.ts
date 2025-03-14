import { LawEditor, LawElement, TextNode } from "law-document";
import { ReactEditor } from "slate-react";

declare module 'law-document' {
    interface LawEditor extends ReactEditor {}
}

declare module 'slate' {
    interface CustomTypes {
        Editor: LawEditor;
        Element: LawElement;
        Text: TextNode;
    }
}