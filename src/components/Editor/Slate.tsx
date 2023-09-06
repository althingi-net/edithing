import { ListsSchema, ListType } from "@prezly/slate-lists";
import { Descendant, BaseEditor, Element } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor, RenderElementProps } from "slate-react";

type CustomElement = { type: Type; children: Descendant[] }
type CustomText = { text: string }

export type ListItem = { type: Type.LIST_ITEM; children: Descendant[], listItemValue?: number }
export type OrderedList = { type: Type.ORDERED_LIST; children: Descendant[], listType?: 'I' }

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor & HistoryEditor
        Element: CustomElement | ListItem | OrderedList
        Text: CustomText
    }
}

export enum Type {
    PARAGRAPH = 'paragraph',
    ORDERED_LIST = 'ordered-list',
    UNORDERED_LIST = 'unordered-list',
    LIST_ITEM = 'list-item',
    LIST_ITEM_TEXT = 'list-item-text',
}

export function renderElement({ element, attributes, children }: RenderElementProps) {
    console.log('renderElement', { element, attributes, children })
    switch (element.type) {
        case Type.ORDERED_LIST:
            // @ts-ignore
            return <ol type={element.listType} {...attributes}>{children}</ol>;
        case Type.UNORDERED_LIST:
            return <ul {...attributes}>{children}</ul>;
        case Type.LIST_ITEM:
            // @ts-ignore
            return <li value={element.value} {...attributes}>{children}</li>;
        case Type.LIST_ITEM_TEXT:
            return <div {...attributes}>{children}</div>;
        case Type.PARAGRAPH:
        default:
            return <p {...attributes}>{children}</p>;
    }
}

export const schema: ListsSchema = {
    isConvertibleToListTextNode(node) {
        return Element.isElementType(node, Type.PARAGRAPH);
    },
    isDefaultTextNode(node) {
        return Element.isElementType(node, Type.PARAGRAPH);
    },
    isListNode(node, type) {
        if (type === ListType.ORDERED) {
            return Element.isElementType(node, Type.ORDERED_LIST);
        }
        if (type === ListType.UNORDERED) {
            return Element.isElementType(node, Type.UNORDERED_LIST);
        }
        return (
            Element.isElementType(node, Type.ORDERED_LIST) ||
            Element.isElementType(node, Type.UNORDERED_LIST)
        );
    },
    isListItemNode(node) {
        return Element.isElementType(node, Type.LIST_ITEM);
    },
    isListItemTextNode(node) {
        return Element.isElementType(node, Type.LIST_ITEM_TEXT);
    },
    createDefaultTextNode(props = {}) {
        return { children: [{ text: '' }], ...props, type: Type.PARAGRAPH };
    },
    createListNode(type = ListType.UNORDERED, props = {}) {
        console.log('createListNode', type, props)
        const nodeType = type === ListType.ORDERED ? Type.ORDERED_LIST : Type.UNORDERED_LIST;
        return { children: [{ text: '' }], ...props, type: nodeType };
    },
    createListItemNode(props = {}) {
        console.log('createListItemNode', props)
        return { children: [{ text: '' }], ...props, type: Type.LIST_ITEM };
    },
    createListItemTextNode(props = {}) {
        console.log('createListItemTextNode', props)
        return { children: [{ text: '' }], ...props, type: Type.LIST_ITEM_TEXT };
    },
};
