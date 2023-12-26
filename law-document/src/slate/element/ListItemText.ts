import { Element, Node, Text } from 'slate';
import { ElementType } from '../../old/Slate';

export interface ListItemText {
    type: ElementType.LIST_ITEM_TEXT;
    children: Text[];
}

export const isListItemText = (node?: Node | null): node is ListItemText => {
    return Element.isElementType(node, ElementType.LIST_ITEM_TEXT);
};