import { Text } from 'slate';
import { ListItemText, ElementType } from '../../Slate';

const createListItemText = (children: Text[] = [{ text: '' }]) => {
    const textElement: ListItemText = {
        type: ElementType.LIST_ITEM_TEXT,
        children,
    };

    return textElement;
};

export default createListItemText;