import { ListItemText, ElementType } from '../../Slate';

const createListItemText = () => {
    const textElement: ListItemText = {
        type: ElementType.LIST_ITEM_TEXT,
        children: [{ text: '' }],
    };

    return textElement;
};

export default createListItemText;