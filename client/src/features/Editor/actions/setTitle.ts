import { Editor, Node, Text, Transforms } from 'slate';
import getParentListItem from '../utils/slate/getParentListItem';
import setListItemMeta from '../utils/slate/setListItemMeta';
import { isName } from '../Slate';

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

    const meta = { ...listItem.meta, title: true };
    if (meta.name) {
        const nameNode = Node.get(editor, [...path, 0, 1]);

        if (!isName(nameNode)) {
            delete meta.name;
        }
    }

    setListItemMeta(editor, listItem, path, meta, { updateTitle: false });

    return true;
};

export default setTitle;