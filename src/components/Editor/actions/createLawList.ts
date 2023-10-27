import { Editor, Node, Path } from 'slate';
import { MetaType, isListItem } from '../Slate';
import createListItem from '../utils/slate/createListItem';
import createListItemMetaFromSibling from '../utils/slate/createListItemMetaFromSibling';
import incrementFollowingSiblings from '../utils/slate/incrementFollowingSiblings';
import createLawTitle from '../utils/slate/createLawTitle';
import getListItemTitle from '../utils/slate/getListItemTitle';
import createList from '../utils/slate/createList';
import createListItemMeta from '../utils/slate/createListItemMeta';
import { log } from '../../../logger';

interface CreateLawListOptions {
    nested?: boolean;
    bumpVersionNumber?: boolean;
}

const createLawList = (editor: Editor, type: MetaType, path: Path, options: CreateLawListOptions = {}) => {
    const { nested, bumpVersionNumber } = options;
    const node = Node.get(editor, path);

    log('createLawList', { type, path, bumpVersionNumber, nested, node });

    if (!isListItem(node)) {
        throw new Error('createLawList: node at path is not a list item');
    }

    if (nested) {
        const hasNestedList = node.children.length >= 2;
        const newListItemPath = [...path, 1, 0];

        if (!hasNestedList) {
            const meta = createListItemMeta(editor, newListItemPath, type);
            const title = createLawTitle(meta.nr, meta.type);
            const listItem = createListItem(meta.type, meta.nr, { ...meta, title, text: '' });
            const list = createList(meta.type, {}, [listItem]);
            
            editor.insertNode(list, { at: newListItemPath.slice(0, -1), select: true });
        } else {
            const meta = createListItemMeta(editor, newListItemPath, type);
            const title = createLawTitle(meta.nr, meta.type);
            const listItem = createListItem(meta.type, meta.nr, { ...meta, title, text: '' });
            
            editor.insertNode(listItem, { at: newListItemPath, select: true });
            
            if (bumpVersionNumber) {
                incrementFollowingSiblings(editor, newListItemPath);
            }
        }
        
    } else {
        const meta = createListItemMetaFromSibling(node);
        const siblingTitle = getListItemTitle(editor, path);
        const title = meta.title && createLawTitle(meta.nr, meta.type, siblingTitle);
        const newNode = createListItem(type, meta.nr, { ...meta, title, text: '' });
        const newPath = path.slice(0, -1).concat([path.slice(-1)[0] + 1]);
    
        editor.insertNode(newNode, { at: newPath, select: true });
        
        if (bumpVersionNumber) {
            incrementFollowingSiblings(editor, newPath);
        }
    }
};

export default createLawList;