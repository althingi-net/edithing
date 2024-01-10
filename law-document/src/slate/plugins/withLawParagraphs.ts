import { Editor, Node, NodeEntry, Text, Transforms } from 'slate';
import { isDocumentMeta } from '../element/DocumentMetaElement';
import { isList } from '../element/List';
import { isListItem } from '../element/ListItem';
import { isListItemText } from '../element/ListItemText';
import { log } from '../../logger';
import { ElementType } from '../Slate';
import { createListItemMeta } from '../transformations/createListItemMeta';
import { createListMeta } from '../transformations/createListMeta';
import { incrementFollowingSiblings } from '../transformations/incrementFollowingSiblings';
import { setListItemMeta } from '../transformations/setListItemMeta';
import { setMeta } from '../transformations/setMeta';
import { normalizeNode } from './normalizeNode';

export const withLawParagraphs = (editor: Editor) => {
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

    if (isList(node) && !node['meta']) {
        const meta = createListMeta(editor, path);
        log('add missing meta to list', { node, path, meta });
        setMeta(editor, path, meta);
        return true;
    }

    if (isListItem(node) && !node['meta']) {
        const meta = createListItemMeta(editor, path);
        log('add missing meta to list item', { node, path, meta });

        setListItemMeta(editor, node, path, meta);
        incrementFollowingSiblings(editor, path);

        return true;
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