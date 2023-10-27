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
    type: MetaType;
    nr: string;
    nrType?: 'roman' | 'numeric' | 'alphabet'; // roman, numeric, alphabet, mixed
    romanNr?: string;
    
    /** 
     * Redudant to the first child of the list-item-text slate node.  
     * Export will ignore the content of this field 
     * but uses it as flag, when set, that the node 
     * will generate a XML tag "title" in the export.  
     */
    title?: boolean;

    /** Same behavior as the title, displayed right afterwards */
    name?: boolean;

    /**
     * Defines display of this node
     */
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

// export const schema: ListsSchema = {
//     isConvertibleToListTextNode(node) {
//         return Element.isElementType(node, ElementType.PARAGRAPH);
//     },
//     isDefaultTextNode(node) {
//         return Element.isElementType(node, ElementType.PARAGRAPH);
//     },
//     isListNode(node) {
//         return Element.isElementType(node, ElementType.LIST);
//     },
//     isListItemNode(node) {
//         return Element.isElementType(node, ElementType.LIST_ITEM);
//     },
//     isListItemTextNode(node) {
//         return Element.isElementType(node, ElementType.LIST_ITEM_TEXT);
//     },
//     createDefaultTextNode(props = {}) {
//         return { children: [{ text: '' }], ...props, type: ElementType.PARAGRAPH };
//     },
//     createListNode(type = ListType.UNORDERED, props = {}) {
//         // Note: There is only one list type in this editor
//         const nodeType = type === ListType.ORDERED ? ElementType.LIST : ElementType.LIST;
//         return { children: [{ text: '' }], ...props, type: nodeType };
//     },
//     createListItemNode(props = {}) {
//         return { children: [{ text: '' }], ...props, type: ElementType.LIST_ITEM };
//     },
//     createListItemTextNode(props = {}) {
//         return { children: [{ text: '' }], ...props, type: ElementType.LIST_ITEM_TEXT };
//     },
// };

export const isList = (node?: Node | null): node is List => {
    return Element.isElementType(node, ElementType.LIST);
};

export const isListItem = (node?: Node | null): node is ListItem => {
    return Element.isElementType(node, ElementType.LIST_ITEM);
};

export const isListItemText = (node?: Node | null): node is ListItemText => {
    return Element.isElementType(node, ElementType.LIST_ITEM_TEXT);
};

/**
 * Create empty root node, for testing purposes only. This would usually be an instance of Editor.
 * @param children 
 * @returns root node
 */
export const wrapRootNode = (children: Node[]): Node => {
    return { children } as Node;
};