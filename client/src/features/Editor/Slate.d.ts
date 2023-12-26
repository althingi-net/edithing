// import { YjsEditor } from '@slate-yjs/core';
import { Element, TextNode } from 'law-document';
import { BaseEditor } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

/*
    HACK: This is a workaround for the following error: EventsEditor resolves to 'any' when imported from 'law-document'.
*/
interface EventsEditor extends BaseEditor { 
    events: Event[];
}

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & EventsEditor /* & YjsEditor */ & ReactEditor & HistoryEditor;
        Element: Element;
        Text: TextNode;
    }
}
