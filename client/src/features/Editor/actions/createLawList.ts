import { Editor, Node, Path } from 'slate';
import { MetaType } from '../Slate';
import { isListItem } from '../elements/ListItem';
import ListItem from '../elements/ListItem';
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
            insertNestedList(editor, newListItemPath, type);
        } else {
            insertNestedListItem(editor, newListItemPath, type, bumpVersionNumber);
        }
    } else {
        addListItem(editor, node, path, type, bumpVersionNumber);
    }
};

const insertNestedList = (editor: Editor, newListItemPath: Path, type: MetaType) => {
    const meta = createListItemMeta(editor, newListItemPath, type);
    const title = createLawTitle(meta.nr, meta.type);
    const listItem = createListItem(meta.type, meta.nr, { ...meta, title, text: '', originNr: '' });
    const list = createList(meta.type, {}, [listItem]);
    
    flatInsertNodeChildren(editor, list, newListItemPath.slice(0, -1), true);
};

const insertNestedListItem = (editor: Editor, newListItemPath: Path, type: MetaType, bumpVersionNumber?: boolean) => {
    const meta = createListItemMeta(editor, newListItemPath, type);
    const title = createLawTitle(meta.nr, meta.type);
    const listItem = createListItem(meta.type, meta.nr, { ...meta, title, text: '', originNr: '' });
    
    flatInsertNodeChildren(editor, listItem, newListItemPath, true);
    
    if (bumpVersionNumber) {
        incrementFollowingSiblings(editor, newListItemPath);
    }
};

const addListItem = (editor: Editor, listItem: ListItem, path: Path, type: MetaType, bumpVersionNumber?: boolean) => {
    const meta = createListItemMetaFromSibling(listItem);
    const siblingTitle = getListItemTitle(editor, path);
    const title = meta.title && createLawTitle(meta.nr, meta.type, siblingTitle);
    const newNode = createListItem(type, meta.nr, { ...meta, title, text: '', originNr: '' });
    const newPath = path.slice(0, -1).concat([path.slice(-1)[0] + 1]);

    flatInsertNodeChildren(editor, newNode, newPath, true);
    
    if (bumpVersionNumber) {
        incrementFollowingSiblings(editor, newPath);
    }
};


/**
 * Traverse all children about to be inserted and call insertNode for each of them.
 * This will result in a flat array of operations, beneficial for the changelog to have correct results from getPargraphId().
 */
const flatInsertNodeChildren = (editor: Editor, node: Node, at: Path, select = false) => {
    const hasChildren = 'children' in node && node.children.length > 0;

    if (!hasChildren) {
        return editor.insertNode(node, { at });
    }
    
    const { children, ...pureNode } = node;

    editor.insertNode({ ...pureNode, children: [{ text: '', nr: '1' }] }, { at });

    for (let index = 0; index < node.children.length; index++) {
        const child = node.children[index];
        at = [...at, index];
        flatInsertNodeChildren(editor, child, at);
    }

    // Will only be true at the root of the recursive calls and after all nodes were inserted
    if (select) {
        const end = editor.end(at);
        editor.select(end);
    }
};


export default createLawList;