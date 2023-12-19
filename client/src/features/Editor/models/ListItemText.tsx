import { Text } from 'slate';
import { ElementType } from '../Slate';

interface ListItemText {
    type: ElementType.LIST_ITEM_TEXT;
    children: Text[];
}

export default ListItemText;
