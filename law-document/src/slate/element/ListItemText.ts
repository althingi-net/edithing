import { Element, Node, Text } from 'slate';
import { ElementType } from '../Slate';



export interface ListItemText {
    type: ElementType.LIST_ITEM_TEXT;
    children: Text[];
    meta?: ListItemTextMeta;
}

export interface ListItemTextWithMeta extends ListItemText {
    meta: ListItemTextMeta;
}

export interface ListItemTextMeta {
    nothing?: string; // TODO: remove this
    expirySymbolOffset?: string;
}

export const isListItemText = (node?: Node | null): node is ListItemText => {
    return Element.isElementType(node, ElementType.LIST_ITEM_TEXT);
};