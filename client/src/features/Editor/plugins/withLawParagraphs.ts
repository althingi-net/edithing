import { Editor, Element, Node, NodeEntry, Text, Transforms } from 'slate';
import { log } from '../../../logger';
import { ElementType } from '../Slate';
import { isList } from '../models/List';
import { isListItem } from '../models/ListItem';
import { isListItemText } from '../models/ListItemText';
import createListItemMeta from '../utils/slate/createListItemMeta';
import createListMeta from '../utils/slate/createListMeta';
import incrementFollowingSiblings from '../utils/slate/incrementFollowingSiblings';
import setListItemMeta from '../utils/slate/setListItemMeta';
import setMeta from '../utils/slate/setMeta';
import normalizeNode from './normalizeNode';
import { isDocumentMeta } from '../models/DocumentMeta';

const withLawParagraphs = (editor: Editor) => {
    // normalizeNode will be called multiple times until there are no more changes caused by the normalization.
    editor.normalizeNode = (entry) => {
        if (
            normalizeEmptyEditor(editor, entry)
            || normalizeNode(editor, entry)
            || normalizeMissingMeta(editor, entry)
            || normalizeSentences(editor, entry)
        ) {
            return;
        }
    };

    editor.isVoid = (element) => {
        if (isDocumentMeta(element)) {
            return true;
        }

        return false;
    };

    return editor;
};

/**
 * Required to prevent an empty editor for yjs realtime collaboration
 * @param editor 
 * @param entry 
 * @returns 
 */
const normalizeEmptyEditor = (editor: Editor, entry: NodeEntry) => {
    const [node] = entry;

    if (!Editor.isEditor(node) || node.children.length > 0) {
        return false;
    }
    
    Transforms.insertNodes(
        editor,
        {
            type: ElementType.PARAGRAPH,
            children: [{ text: '' }],
        },
        { at: [0] }
    );

    return true;
};

const normalizeMissingMeta = (editor: Editor, entry: NodeEntry) => {
    const [node, path] = entry;

    if (Element.isElement(node) && !node['meta']) {
        if (isList(node)) {
            const meta = createListMeta(editor, path);
            log('add missing meta to list', { node, path, meta });
            setMeta(editor, path, meta);
            return true;
        }

        if (isListItem(node)) {
            const meta = createListItemMeta(editor, path);
            log('add missing meta to list item', { node, path, meta });

            setListItemMeta(editor, node, path, meta);
            incrementFollowingSiblings(editor, path);

            return true;
        }
    }

    return false;
};

const normalizeSentences = (editor: Editor, entry: NodeEntry) => {
    const [node, path] = entry;

    if (!isListItemText(node)) {
        return false;
    }

    const listItem = Node.parent(editor, path);

    if (!isListItem(listItem) || !listItem.meta) {
        return false;
    }

    let nr = 1;

    node.children.forEach((child, index) => {
        if (child.nr != null) {
            const at = [...path, index];
            const newNr = `${nr}`;
            
            if (child.nr !== newNr) {
                Transforms.setNodes<Text>(editor, { nr: newNr }, { at });
            }

            nr++;
        }
    });

    return false;
};

export default withLawParagraphs;