import { Node } from 'slate';
import { isListItem, ListItemWithMeta } from '../../elements/ListItem';

const isListItemWithMeta = (node: Node): node is ListItemWithMeta => {
    return isListItem(node) && Boolean(node.meta);
};

export default isListItemWithMeta;