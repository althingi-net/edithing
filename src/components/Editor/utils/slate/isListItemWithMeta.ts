import { ListItem, ListItemWithMeta } from "../../Slate";

const isListItemWithMeta = (node: ListItem): node is ListItemWithMeta => {
    return Boolean(node.meta);
}

export default isListItemWithMeta;