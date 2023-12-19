import { BaseEditor, Descendant, Node } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';
import { EventsEditor } from './plugins/withEvents';
import ListItem from './models/ListItem';
import List from './models/List';
import TextNode from './models/TextNode';
import { YjsEditor } from '@slate-yjs/core';
import DocumentMetaElement from './models/DocumentMeta';

// List items have either 1 or 2 children, always in the following order:
// 0 - list item text
// 1 - nested list (optional)
export const TEXT_PATH_INDEX = 0;
export const NESTED_LIST_PATH_INDEX = 1;

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor & HistoryEditor & EventsEditor & YjsEditor
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Element: { type: ElementType; children: Descendant[], meta?: any } | ListItem | List | DocumentMetaElement
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