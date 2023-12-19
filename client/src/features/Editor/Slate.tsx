import { YjsEditor } from '@slate-yjs/core';
import { BaseEditor, Node } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';
import DocumentMetaElement from './elements/DocumentMeta';
import List from './elements/List';
import ListItem from './elements/ListItem';
import ListItemText from './elements/ListItemText';
import Paragraph from './elements/Paragraph';
import TextNode from './elements/TextNode';
import { EventsEditor } from './plugins/withEvents';

// List items have either 1 or 2 children, always in the following order:
// 0 - list item text
// 1 - nested list (optional)
export const TEXT_PATH_INDEX = 0;
export const NESTED_LIST_PATH_INDEX = 1;

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor & HistoryEditor & EventsEditor & YjsEditor
        Element: DocumentMetaElement | List | ListItem | ListItemText | Paragraph
        Text: TextNode
    }
}

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

export const isMetaType = (type: string): type is MetaType => {
    return Object.values(MetaType).includes(type as MetaType);
};

/**
 * Create empty root node, for testing purposes only. This would usually be an instance of Editor.
 * @param children 
 * @returns root node
 */
export const wrapRootNode = (children: Node[]): Node => {
    return { children } as Node;
};