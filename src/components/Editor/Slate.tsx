import { ListsSchema, ListType } from "@prezly/slate-lists";
import { Descendant, BaseEditor, Element, Node, Text } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor, RenderElementProps } from "slate-react";
import convertRomanNumber from "./utils/convertRomanNumber";
import { TAGS } from "./Tags";


declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor & HistoryEditor
        Element: { type: ElementType; children: Descendant[], meta?: any } | ListItem | OrderedList
        Text: { text: string }
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
        nrType?: string; // roman, numeric, alphabet, mixed
        romanNr?: string;
        
        /** 
         * Redudant to the first child of the list-item-text slate node.  
         * Export will ignore the content of this field 
         * but uses it as flag, when set, that the node 
         * will generate a XML tag "title" in the export.  
         */
        title?: string;

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

export function renderElement({ element, attributes, children }: RenderElementProps) {
    const config = TAGS[element.meta?.type];

    if (config) {
        if (config.display === 'inline' || element.meta?.styleNote === 'inline-with-parent') {
            return <span {...attributes}>{children}</span>;
        }

        if (config.display === 'block') {
            return <div {...attributes}>{children}</div>;
        }
    }

    switch (element.type) {
        case ElementType.ORDERED_LIST:
            // @ts-ignore
            return <ul {...attributes}>{children}</ul>;
        case ElementType.UNORDERED_LIST:
            return <ul {...attributes}>{children}</ul>;
        case ElementType.LIST_ITEM:
            // @ts-ignore
            return <li value={element.value} {...attributes}>{children}</li>;
        case ElementType.LIST_ITEM_TEXT:
            return <span {...attributes}>{children}</span>;
        case ElementType.PARAGRAPH:
        default:
            return <span {...attributes}>{children}</span>;
    }
}

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

export const createList = (type: MetaType, children: Descendant[]): Descendant => {
    const node: OrderedList = {
        type: ElementType.ORDERED_LIST,
        meta: {
            type: type,
        },
        children,
    }

    if (type === MetaType.CHAPTER) {
        node.meta.nrType = 'roman';
    }

    return node;
};

export const createListItem = (type: MetaType, nr: string, title?: string, text?: string | string[], children: Descendant[] = []): ListItem => {
    const textNode: ListItemText = {
        type: ElementType.LIST_ITEM_TEXT,
        children: Array.isArray(text) ? text.map(text => ({ text })) : [{ text: text ?? '' }],
    }
    
    const node: ListItem = {
        type: ElementType.LIST_ITEM,
        meta: {
            type: type,
            nr,
        },
        children: [
            textNode,
            ...children
        ],
    };

    if (title) {
        node.meta.title = title;

        textNode.children.unshift({ text: title });
    }

    if (textNode.children.length > 1) {
        textNode.children = textNode.children.filter((item => item.text !== ''));
    }

    if (type === MetaType.CHAPTER) {
        node.meta.nrType = 'roman';
        node.meta.romanNr = convertRomanNumber(nr);
    }

    return node;
};

export const createNumericNumart = (nr: string, title?: string, text?: string, children: Descendant[] = []): ListItem => {
    const node = createListItem(MetaType.NUMART, nr, title, text, children);

    node.meta.nrType = 'numeric';

    return node;
}

export const createInlineLetterNumart = (nr: string, title?: string, text?: string, children: Descendant[] = []): ListItem => {
    const node = createListItem(MetaType.NUMART, nr, title, text, children);

    node.meta.nrType = 'alphabet';
    node.meta.styleNote = 'inline-with-parent';

    return node;
}

export const createLetterNumart = (nr: string, title?: string, text?: string, children: Descendant[] = []): ListItem => {
    const node = createListItem(MetaType.NUMART, nr, title, text, children);

    node.meta.nrType = 'alphabet';

    return node;
}
