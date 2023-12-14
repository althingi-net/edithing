import { Node } from 'slate';
import { ListItemWithMeta, isListItem } from '../../Slate';

const isListItemWithMeta = (node: Node): node is ListItemWithMeta => {
    return isListItem(node) && Boolean(node.meta);
};

export default isListItemWithMeta;