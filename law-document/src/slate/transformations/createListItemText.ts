import { Text } from 'slate';
import { ListItemText, ListItemTextMeta } from '../element/ListItemText';
import { ElementType } from '../Slate';

export const createListItemText = (children: Text[] = [{ text: '', nr: '1' }], textMeta?: ListItemTextMeta) => {
    const textElement: ListItemText = {
        type: ElementType.LIST_ITEM_TEXT,
        children,
    };

    if (textMeta && children.length > 0) {
        children[0] = {
            ...children[0],
            ...textMeta,
        };
    }

    return textElement;
};