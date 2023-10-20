import { Editor, Element, Node, NodeEntry, Text, Transforms } from 'slate';
import { log } from '../../../logger';
import { isList, isListItem, isListItemText } from '../Slate';
import createListItemMeta from '../utils/slate/createListItemMeta';
import createListMeta from '../utils/slate/createListMeta';
import getParentListItem from '../utils/slate/getParentListItem';
import incrementFollowingSiblings from '../utils/slate/incrementFollowingSiblings';
import setListItemMeta from '../utils/slate/setListItemMeta';
import setMeta from '../utils/slate/setMeta';

const withLawParagraphs = (editor: Editor) => {
    const { normalizeNode } = editor;

    // normalizeNode will be called multiple times until there are no more changes caused by the normalization.
    editor.normalizeNode = (entry) => {
        if (
            normalizeMissingMeta(editor, entry)
            || normalizeMovedListItem(editor, entry)
            || normalizeSentences(editor, entry)
            // || enforceTitleNameSenLayout(editor, entry)
        ) {
            return;
        }

        // Continue with original `normalizeNode` to enforce other constraints.
        normalizeNode(entry);
    };

    return editor;
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

const normalizeMovedListItem = (editor: Editor, entry: NodeEntry) => {
    const [node, path] = entry;

    const grandParent = getParentListItem(editor, path);
    const isMovedDownListItem = isListItem(node) && grandParent && grandParent[0].meta?.type === node.meta?.type;

    if (isMovedDownListItem) {
        const meta = createListItemMeta(editor, path);
        log('update meta of moved list item', { node, path, meta });
        setListItemMeta(editor, node, path, meta);
        return true;
    }

    // if (isListItem(node) && node['meta']) {
    //     const [parent] = Editor.parent(editor, path);
    //     const newNr = `${path[path.length - 1] + 1}`;

    //     if (
    //         parent &&
    //         isList(parent) &&
    //         (!parent.meta || parent.meta.type === node.meta.type)
    //     ) {
    //         return false;
    //     }

    //     // Wrap missing List around ListItem
    //     if (!parent || !isList(parent)) {
    //         Transforms.wrapNodes(
    //             editor,
    //             createList(node.meta.type),
    //             { at: path },
    //         )
    //         log('wrap list item', {node, path, parent})
    //         return true;
    //     }

    //     const sibling = getPreviousSibling(editor, path);

    //     // copy sibling meta
    //     if (sibling && isListItem(sibling)) {
    //         const meta = createListItemMetaFromSibling(sibling);
    //         log('set list item meta via sibling', {node, path, sibling, from: node.meta, to: meta});

    //         setListItemMeta(editor, node, path, meta);

    //         return true;

    //     // copy parent meta
    //     } else if (parent && isList(parent) && parent.meta?.type !== node.meta.type) {
    //         const meta: ListItemMeta = {
    //             ...node.meta,
    //             nr: newNr,
    //             type: parent.meta?.type || node.meta.type, // TODO: check if this is correct
    //         }
    //         log('set list item meta via parent', {node, path, parent, from: node.meta, to: meta});

    //         setListItemMeta(editor, node, path, meta);

    //         return true;

    //     // default to CHAPTER
    //     } else {
    //         const newNr = path[path.length - 1] + 1;
    //         const meta: ListItemMeta = {
    //             ...node.meta,
    //             nr: `${newNr}`,
    //             romanNr: convertRomanNumber(newNr),
    //             nrType: 'roman',
    //             type: MetaType.CHAPTER,
    //         }
    //         log('set list item meta via default', {node, path, parent, from: node.meta, to: meta});

    //         setListItemMeta(editor, node, path, meta);

    //         return true;
    //     }
    // }
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

const enforceTitleNameSenLayout = (editor: Editor, entry: NodeEntry) => {
    const [node, path] = entry;

    if (!isListItemText(node)) {
        return false;
    }

    const listItem = Node.parent(editor, path);

    if (!isListItem(listItem) || !listItem.meta) {
        return false;
    }

    // remove empty text node in front of others
    if (node.children.length > 1 && node.children[0].text === '') {
        const at = [...path, 0];
        Transforms.removeNodes(editor, { at });
        return true;
    }

    const { meta: { title, name } } = listItem;
    // let hasChanges = false;

    // Editor.withoutNormalizing(editor, () => {
    node.children.forEach((child, index) => {
        const text = child.text;
        const hasTitle = title;
        const hasName = name;

        if (hasTitle) {
            if (index === 0 && (!child.title || child.name || child.nr)) {
                const at = [...path, index];
                log('enforce title', { node, path, child, index, title });
                Transforms.removeNodes(editor, { at });
                Transforms.insertNodes<Text>(editor, { text, title: true }, { at });
                return true;
            }

            if (index === 1 && hasName && (!child.name || child.title || child.nr)) {
                const at = [...path, index];
                log('enforce name', { node, path, child, index, name });
                Transforms.removeNodes(editor, { at });
                Transforms.insertNodes<Text>(editor, { text, name: true }, { at });
                return true;
            }
        } else {
            if (index === 0 && hasName && (!child.name || child.title || child.nr)) {
                const at = [...path, index];
                log('enforce name', { node, path, child, index, name });
                Transforms.removeNodes(editor, { at });
                Transforms.insertNodes<Text>(editor, { text, name: true }, { at });
                return true;
            }
        }

        const senStartIndex = hasTitle ? hasName ? 2 : 1 : hasName ? 1 : 0;
        const newNr = `${index - senStartIndex + 1}`;

        if (index >= senStartIndex && (!child.nr || child.title || child.name || child.nr !== newNr)) {
            const at = [...path, index];
            log('enforce sen', { node, path, child, index, senStartIndex, newNr });
            Transforms.removeNodes(editor, { at });
            Transforms.insertNodes<Text>(editor, { text, nr: newNr }, { at });
            return true;
        }
    });
    // });

    return false;
};

export default withLawParagraphs;