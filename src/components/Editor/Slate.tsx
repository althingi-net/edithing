import { ListsSchema, ListType } from "@prezly/slate-lists";
import { Descendant, BaseEditor, Element, Node } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor, RenderElementProps } from "slate-react";
import convertRomanNumber from "../../utils/convertRomanNumber";


declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor & HistoryEditor
        Element: { type: ElementType; children: Descendant[] } | ListItem | OrderedList
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
        type: string;
        nrType?: string;
    }
}

export type ListItem = {
    type: ElementType.LIST_ITEM;
    children: Descendant[];
    meta: {
        type: MetaType;
        nr: string;
        nrType?: string;
        romanNr?: string;
    }
}

export enum MetaType {
    CHAPTER = 'chapter',
    ART = 'art',
    SUBART = 'subart',
    PARAGRAPH = 'paragraph',
}

export const LIST_TAGS = [
    'chapter',
    'art',
    'subart',
    'paragraph',
];

export function renderElement({ element, attributes, children }: RenderElementProps) {
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
            return <div {...attributes}>{children}</div>;
        case ElementType.PARAGRAPH:
        default:
            return <p {...attributes}>{children}</p>;
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

export const createListItem = (type: MetaType, nr: string, title = '', children: Descendant[] = []): ListItem => {
    const node: ListItem = {
        type: ElementType.LIST_ITEM,
        meta: {
            type: type,
            nr,
        },
        children: [
            {
                type: ElementType.LIST_ITEM_TEXT,
                children: [
                    { text: title ?? `${type === MetaType.CHAPTER ? convertRomanNumber(nr) : nr}.` },
                ],
            }, 
            ...children
        ],
    };

    if (type === MetaType.CHAPTER) {
        node.meta.nrType = 'roman';
        node.meta.romanNr = convertRomanNumber(nr);
    }

    return node;
};