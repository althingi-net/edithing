import { Editor } from 'slate';
import findListItemAtSelection from '../utils/slate/findListItemAtSelection';
import createLawList from './createLawList';

const pressEnterKey = (editor: Editor) => {
    const [listItem, path] = findListItemAtSelection(editor) ?? [];

    if (!listItem || !path || !listItem.meta) {
        return false;
    }

    const { type } = listItem.meta;

    createLawList(editor, type, path, { bumpVersionNumber: true });

    return true;
};

export default pressEnterKey;