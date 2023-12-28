import { Text } from 'slate';
import { ListItemText } from '../element/ListItemText';
import { ElementType } from '../Slate';

export const createListItemText = (children: Text[] = [{ text: '' }]) => {
    const textElement: ListItemText = {
        type: ElementType.LIST_ITEM_TEXT,
        children,
    };

    return textElement;
};