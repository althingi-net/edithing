import { Text } from 'slate';
import { ElementType } from '../../Slate';
import ListItemText from '../../elements/ListItemText';

const createListItemText = (children: Text[] = [{ text: '' }]) => {
    const textElement: ListItemText = {
        type: ElementType.LIST_ITEM_TEXT,
        children,
    };

    return textElement;
};

export default createListItemText;