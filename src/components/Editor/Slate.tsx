import { ListsSchema, ListType } from "@prezly/slate-lists";
import { BaseEditor, Descendant, Element, Node, Text } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";
import { EventsEditor } from "./plugins/withEvents";

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor & HistoryEditor & EventsEditor
        Element: { type: ElementType; children: Descendant[], meta?: any } | ListItem | OrderedList
        Text: { text: string, title?: boolean, name?: boolean, nr?: string, bold?: boolean }
    }
}

export enum ElementType {
    EDITOR = 'editor',
    PARAGRAPH = 'paragraph',
    ORDERED_LIST = 'ordered-list',
    UNORDERED_LIST = 'unordered-list',
    LIST_ITEM = 'list-item',
    LIST_ITEM_TEXT = 'list-item-text',
}

export type OrderedList = {
    type: ElementType.ORDERED_LIST;
    children: Descendant[],
    meta: {
        type: MetaType;
        nrType?: string;
    }
}

export type ListItem = {
    type: ElementType.LIST_ITEM;
    children: Descendant[];
    meta: {
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
        title?: string;

        /** Same behavior as the title, displayed right afterwards */
        name?: string;

        /**
         * Defines display of this node
         */
        styleNote?: string; // inline-with-parent
    }
}

export type ListItemText = {
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

export const schema: ListsSchema = {
    isConvertibleToListTextNode(node) {
        return Element.isElementType(node, ElementType.PARAGRAPH);
    },
    isDefaultTextNode(node) {
        return Element.isElementType(node, ElementType.PARAGRAPH);
    },
    isListNode(node, type) {
        if (type === ListType.ORDERED) {
            return Element.isElementType(node, ElementType.ORDERED_LIST);
        }
        if (type === ListType.UNORDERED) {
            return Element.isElementType(node, ElementType.UNORDERED_LIST);
        }
        return (
            Element.isElementType(node, ElementType.ORDERED_LIST) ||
            Element.isElementType(node, ElementType.UNORDERED_LIST)
        );
    },
    isListItemNode(node) {
        return Element.isElementType(node, ElementType.LIST_ITEM);
    },
    isListItemTextNode(node) {
        return Element.isElementType(node, ElementType.LIST_ITEM_TEXT);
    },
    createDefaultTextNode(props = {}) {
        return { children: [{ text: '' }], ...props, type: ElementType.PARAGRAPH };
    },
    createListNode(type = ListType.UNORDERED, props = {}) {
        const nodeType = type === ListType.ORDERED ? ElementType.ORDERED_LIST : ElementType.UNORDERED_LIST;
        return { children: [{ text: '' }], ...props, type: nodeType };
    },
    createListItemNode(props = {}) {
        return { children: [{ text: '' }], ...props, type: ElementType.LIST_ITEM };
    },
    createListItemTextNode(props = {}) {
        return { children: [{ text: '' }], ...props, type: ElementType.LIST_ITEM_TEXT };
    },
};

export const isList = (node: Node): node is OrderedList => {
    return Element.isElementType(node, ElementType.ORDERED_LIST);
}

export const isListItem = (node: Node): node is ListItem => {
    return Element.isElementType(node, ElementType.LIST_ITEM);
}

export const isListItemText = (node: Node): node is ListItemText => {
    return Element.isElementType(node, ElementType.LIST_ITEM_TEXT);
}

export const createSlateRoot = (children: Descendant[]): Node => ({
    type: ElementType.EDITOR,
    children,
});
