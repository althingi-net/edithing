import { Node } from 'slate';
import { ListItemWithMeta, isListItem } from '../element/ListItem';

export const isListItemWithMeta = (node: Node): node is ListItemWithMeta => {
    return isListItem(node) && Boolean(node.meta);
};