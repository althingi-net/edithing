import { Editor, Node, Text, Transforms } from "slate";
import { ListItem } from "../Slate";
import getParentListItem from "../utils/slate/getParentListItem";
import getListItemTitle from "../utils/slate/getListItemTitle";
import setMeta from "../utils/slate/setMeta";
import setListItemMeta from "../utils/slate/setListItemMeta";

/**
 * 
 * @param editor Editor to apply changes to
 * @param at location to set title at, defaults to the current selection
 * @returns true if changes were applied to the editor
 */
const setTitle = (
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
        { title: true, nr: undefined, name: undefined },
        { at, match: Text.isText, split: true }
    );

    const text = getListItemTitle(editor, path);

    if (!text) {
        throw new Error('no title text found');
    }

    let meta = { ...listItem.meta, title: true };
    
    if (meta.name) {
        const nameNode = Node.get(editor, [...path, 0, 1]);

        if (!nameNode || (Text.isText(nameNode) && !nameNode.name)) {
            delete meta.name;
        }
    }

    setListItemMeta(editor, listItem, path, meta);

    return true;
}

export default setTitle;