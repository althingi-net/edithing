import { BaseEditor } from 'slate';
import { EventsEditor } from './plugins/withEvents';
import { List } from '../slate/element/List';
import { ListItem } from '../slate/element/ListItem';
import { ListItemText } from '../slate/element/ListItemText';
import { DocumentMetaElement } from '../slate/element/DocumentMetaElement';
import { Paragraph } from '../slate/element/Paragraph';
import { TextNode } from '../slate/element/TextNode';
import { HistoryEditor } from 'slate-history';

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