import { Editor, Node, Path, Text, Transforms } from 'slate';
import { log } from '../../../logger';
import { isListItemText } from '../Slate';
import createListItemMetaFromSibling from '../utils/slate/createListItemMetaFromSibling';
import getParentListItem from '../utils/slate/getParentListItem';
import incrementFollowingSiblings from '../utils/slate/incrementFollowingSiblings';
import isListItemWithMeta from '../utils/slate/isListItemWithMeta';
import normalizeListItem from '../utils/slate/normalizeListItem';
import setMeta from '../utils/slate/setMeta';

const splitListItem = (editor : Editor) => {
    if (!editor.selection) {
        return false;
    }

    const { path } = Editor.start(editor, editor.selection);
    const node = Node.get(editor, path);
    
    if (Text.isText(node)) {
        const [listItemText] = Editor.parent(editor, path);
        const [listItem, listItemPath] = getParentListItem(editor, path) ?? [];
        
        log('splitListItem', { listItem, listItemPath, node, path });
        
        if (isListItemText(listItemText) && listItemPath && listItem) {  
            const newListItemPath = [...listItemPath.slice(0, -1), listItemPath.slice(-1)[0] + 1]; 
            
            Transforms.splitNodes(editor, {
                mode: 'highest',
                always: true,
                match: n => n === listItem || n === listItemText,
            });

            const newListItem = Node.get(editor, newListItemPath);
            if (!isListItemWithMeta(newListItem)) {
                throw new Error('splitListItem: newListItem is not a list item');
            }
            const meta = createListItemMetaFromSibling(listItem);
            setMeta(editor, newListItemPath, { ...newListItem.meta, ...meta });

            normalizeListItem(editor, listItemPath, false);
            normalizeListItem(editor, newListItemPath);

            updateMetaAfterContentChanged(editor, listItemPath);
            updateMetaAfterContentChanged(editor, newListItemPath);

            incrementFollowingSiblings(editor, newListItemPath);
            
            return true;
        }
    }

    return false;
};

const updateMetaAfterContentChanged = (editor: Editor, path: Path) => {
    const listItem = Node.get(editor, path);
    const listItemText = Node.get(editor, [...path, 0]);

    if (!isListItemWithMeta(listItem) || !isListItemText(listItemText)) {
        return false;
    }

    const titleNode = listItemText.children.find(n => Text.isText(n) && n.title);
    const nameNode = listItemText.children.find(n => Text.isText(n) && n.name);
    const meta = { ...listItem.meta };
    let hasChanged = false;

    if (listItem.meta.title && !titleNode) {
        delete meta.title;
        hasChanged = true;
    }

    if (listItem.meta.name && !nameNode) {
        delete meta.name;
        hasChanged = true;
    }

    if (hasChanged) {
        setMeta(editor, path, meta);
        return true;
    }

    return false;
};

export default splitListItem;
