import { Node } from 'slate';
import { isListItem } from '../../models/ListItem';
import { ListItemWithMeta } from '../../models/ListItem';

const isListItemWithMeta = (node: Node): node is ListItemWithMeta => {
    return isListItem(node) && Boolean(node.meta);
};

export default isListItemWithMeta;