import { Editor, Node, NodeEntry, Path } from "slate";
import { ListItem, isListItem } from "../../Slate";

/**
 * Retrieves the next list item in the hierarchy above the given path.
 * @param editor Editor
 * @param path path of list item
 * @returns ancestor list item or null
 */
const getParentListItem = (editor: Editor, path: Path): NodeEntry<ListItem> | null => {
    const parentParentPath = path.slice(0, -2);

    if (parentParentPath.length > 0) {
        const parentListItem = Node.get(editor, parentParentPath);
    
        if (isListItem(parentListItem)) {
            return [parentListItem, parentParentPath];
        }
    }

    return null;
}

export default getParentListItem;