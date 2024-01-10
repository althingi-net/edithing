import { BaseEditor } from 'slate';
import { HistoryEditor } from 'slate-history';
import { List } from './element/List';
import { ListItem } from './element/ListItem';
import { ListItemText } from './element/ListItemText';
import { DocumentMetaElement } from './element/DocumentMetaElement';
import { Paragraph } from './element/Paragraph';
import { TextNode } from './element/TextNode';
import { EventsEditor } from './plugins/withEvents';

declare module 'slate' {
    interface CustomTypes {
        Editor: LawEditor;
        Element: LawElement;
        Text: TextNode;
    }
}

export interface LawEditor extends BaseEditor, EventsEditor, HistoryEditor {}

export type LawElement = List | ListItem | ListItemText | DocumentMetaElement | Paragraph;

export enum ElementType {
    DOCUMENT_META = 'document-meta',
    PARAGRAPH = 'paragraph',
    LIST = 'list',
    LIST_ITEM = 'list-item',
    LIST_ITEM_TEXT = 'list-item-text',
}

export enum MetaType {
    CHAPTER = 'chapter',
    ART = 'art',
    SUBART = 'subart',
    PARAGRAPH = 'paragraph',
    NUMART = 'numart',
    SEN = 'sen',
}

export const LIST_TAGS = [
    'chapter',
    'art',
    'subart',
    'numart',
    'paragraph',
];