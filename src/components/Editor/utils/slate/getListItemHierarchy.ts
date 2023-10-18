import { Node, NodeEntry, Path } from "slate";
import { ListItem, isListItem } from "../../Slate";
import findNode from "../findNode";

const getListItemHierarchy = (root: Node, path: Path): NodeEntry<ListItem>[] => {
    const listItems = Array.from(Node.ancestors(root, path))
        .map(([node, path]) => {
            if (isListItem(node)) {
                return [node, path];
            }

            return null;
        })
        .filter(Boolean) as NodeEntry<ListItem>[];

    const node = findNode(root, path);

    if (isListItem(node)) {
        listItems.push([node, path]);
    }

    return listItems;
}

export default getListItemHierarchy;