import { Editor, Node, Path, Text, Transforms } from 'slate';
import { isListItemText } from '../../Slate';
import createListItemText from './createListItemText';
import isListItemWithMeta from './isListItemWithMeta';
import setListItemTitleFromMeta from './setListItemTitleFromMeta';

const normalizeListItem = (editor: Editor, path: Path) => {
    const listItem = Node.get(editor, path);

    if (!isListItemWithMeta(listItem)) {
        throw new Error('normalizeListItem: listItem is not a ListItemWithMeta');
    }

    if ((listItem.children.length === 1 && !isListItemText(listItem.children[0])) || listItem.children.length === 0) {
        const listItemText = createListItemText();
        Transforms.insertNodes(editor, listItemText, { at: [...path, 0] });

        setListItemTitleFromMeta(editor, path, listItem.meta);
        return true;
    }

    const listItemText = listItem.children[0];

    if (!isListItemText(listItemText)) {
        return false;
    }

    const hasTitleText = listItemText.children.find(n => Text.isText(n) && n.title);
    
    if (listItem.meta.title && (!hasTitleText || hasTitleText.text === '')) {
        setListItemTitleFromMeta(editor, path, listItem.meta);
        return true;
    }

    return false;
};

export default normalizeListItem;