// import { YjsEditor } from '@slate-yjs/core';
import { LawElement, TextNode, EventsEditor } from 'law-document';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';
import { BaseEditor } from 'slate';

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & EventsEditor & HistoryEditor /* & YjsEditor */ & ReactEditor;
        Element: LawElement;
        Text: TextNode;
    }
}