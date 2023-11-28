import { BaseEditor, Descendant, Element, Node, Text } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';
import { EventsEditor } from './plugins/withEvents';

// List items have either 1 or 2 children, always in the following order:
// 0 - list item text
// 1 - nested list (optional)
export const TEXT_PATH_INDEX = 0;
export const NESTED_LIST_PATH_INDEX = 1;

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor & HistoryEditor & EventsEditor
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Element: { type: ElementType; children: Descendant[], meta?: any } | ListItem | List
        Text: { text: string, title?: boolean, name?: boolean, nr?: string, bold?: boolean }
    }
}

export enum ElementType {
    PARAGRAPH = 'paragraph',
    LIST = 'list',
    LIST_ITEM = 'list-item',
    LIST_ITEM_TEXT = 'list-item-text',
}

export interface ListMeta {
    type: MetaType;
    nrType?: 'roman' | 'numeric' | 'alphabet'; // roman, numeric, alphabet, mixed
}

export interface ListItemWithMeta extends ListItem {
    meta: ListItemMeta;
}

export interface List  {
    type: ElementType.LIST;
    children: Descendant[],
    meta?: ListMeta
}

export interface ListWithMeta extends List {
    meta: ListMeta;
}

export interface ListItemMeta extends ListMeta {
    /** LawParagraph tag */
    type: MetaType;

    /** List Item Number. See nrType */
    nr: string;

    /** Nr at import or when first created, used by compareDocuments() to find the original paragraphId */
    originNr: string;

    nrType?: 'roman' | 'numeric' | 'alphabet'; // roman, numeric, alphabet, mixed. By default empty (which means numeric)

    /** Only set when nrType=roman, should always have the numeric value of nr */
    romanNr?: string;
    
    /** Determines if the listItemText node should contain a title node */
    title?: boolean;
    
    /** Determines if the listItemText node should contain a name node */
    name?: boolean;

    /** Defines display style of this node */
    styleNote?: string; // inline-with-parent
}

export interface ListItem {
    type: ElementType.LIST_ITEM;
    children: Descendant[];
    meta?: ListItemMeta;
}

export interface ListItemText {
    type: ElementType.LIST_ITEM_TEXT;
    children: Text[];
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

export const isListItemMeta = (meta: object): meta is ListItemMeta => {
    return 'nr' in meta && 'type' in meta;
};

export const isList = (node?: Node | null): node is List => {
    return Element.isElementType(node, ElementType.LIST);
};

export const isListItem = (node?: Partial<Node> | null): node is ListItem => {
    return Element.isElementType(node, ElementType.LIST_ITEM);
};

export const isListItemText = (node?: Node | null): node is ListItemText => {
    return Element.isElementType(node, ElementType.LIST_ITEM_TEXT);
};

export const isTitle = (node?: Node | null): node is Text => {
    return Text.isText(node) && Boolean(node.title);
};

export const isName = (node?: Node | null): node is Text => {
    return Text.isText(node) && Boolean(node.name);
};

/**
 * Create empty root node, for testing purposes only. This would usually be an instance of Editor.
 * @param children 
 * @returns root node
 */
export const wrapRootNode = (children: Node[]): Node => {
    return { children } as Node;
};