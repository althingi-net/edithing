import { Editor, Node, Text, Transforms } from "slate";
import { ListItem } from "../Slate";
import getParentListItem from "../utils/slate/getParentListItem";
import setListItemMeta from "../utils/slate/setListItemMeta";
import setMeta from "../utils/slate/setMeta";

/**
 * 
 * @param editor Editor to apply changes to
 * @param at location to set name at, defaults to the current selection
 * @returns true if changes were applied to the editor
 */
const setName = (
    editor: Editor,
    at = editor.selection,
) => {
    if (!at) {
        return false;
    }

    const entry = getParentListItem(editor, at);

    if (!entry) {
        return false;
    }
    const [listItem, path] = entry;

    Transforms.setNodes<Text>(
        editor,
        { name: true, nr: undefined, title: undefined },
        { at, match: Text.isText, split: true }
    );

    let meta = { ...listItem.meta, name: true }
    
    // Remove title from meta
    if (meta.title) {
        const titleNode = Node.get(editor, [...path, 0, 0]);

        if (!titleNode || (Text.isText(titleNode) && !titleNode.title)) {
            delete meta.title;
        }
    }

    setMeta(editor, path, meta);

    return true;
}

export default setName;