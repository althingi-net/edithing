import { Editor, Text, Transforms } from 'slate';
import findNode from '../utils/findNode';
import getParentListItem from '../utils/slate/getParentListItem';
import setListItemMeta from '../utils/slate/setListItemMeta';

const setSentence = (
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
        { nr: '', title: undefined, name: undefined },
        { at, match: Text.isText, split: true },
    );

    const meta = { ...listItem.meta };

    if (meta.title) {
        const titleNode = findNode(editor, [...path, 0, 0]);

        if (!titleNode || (Text.isText(titleNode) && !titleNode.title)) {
            delete meta.title;
        }
    }

    if (meta.name) {
        const nameNode = findNode(editor, [...path, 0, meta.title ? 1 : 0]);

        if (!nameNode || (Text.isText(nameNode) && !nameNode.name)) {
            delete meta.name;
        }
    }

    setListItemMeta(editor, listItem, path, meta, false);

    return true;
};

export default setSentence;