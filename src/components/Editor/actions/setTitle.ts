import { Editor, Text, Transforms } from "slate";
import { ListItem } from "../Slate";
import getParentListItem from "../utils/slate/getParentListItem";
import getListItemTitle from "../utils/slate/getListItemTitle";

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

    const parentListItem = getParentListItem(editor, at);

    if (!parentListItem) {
        return false;
    }

    Transforms.setNodes<Text>(
        editor,
        { title: true, nr: undefined, name: undefined },
        { at, match: Text.isText, split: true }
    );

    const text = getListItemTitle(editor, parentListItem[1]);
    const {name, ...meta} = parentListItem[0].meta

    if (!text) {
        throw new Error('no title text found');
    }

    Transforms.setNodes<ListItem>(
        editor,
        { meta: { ...meta, title: text } },
        { at: parentListItem[1] }
    );

    return true;
}

export default setTitle;