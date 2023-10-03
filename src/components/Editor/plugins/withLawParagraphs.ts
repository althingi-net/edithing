import { Editor, Element, NodeEntry, Transforms } from "slate";
import { log } from "../../../logger";
import { ListItemMeta, MetaType, isList, isListItem } from "../Slate";
import convertRomanNumber from "../utils/convertRomanNumber";
import createList from "../utils/slate/createList";
import createListItemMeta from "../utils/slate/createListItemMeta";
import createListItemMetaFromSibling from "../utils/slate/createListItemMetaFromSibling";
import createListMeta from "../utils/slate/createListMeta";
import getPreviousSibling from "../utils/slate/getPreviousSibling";
import incrementFollowingSiblings from "../utils/slate/incrementFollowingSiblings";
import setListItemMeta from "../utils/slate/setListItemMeta";
import setMeta from "../utils/slate/setMeta";

const withLawParagraphs = (editor: Editor) => {
    const { normalizeNode } = editor

    editor.normalizeNode = (entry) => {
        if (normalizeMissingMeta(editor, entry)) {
            return;
        }

        if (normalizeMovedListItem(editor, entry)) {
            return;
        }

        // Continue with original `normalizeNode` to enforce other constraints.
        normalizeNode(entry)
    }

    return editor
};

const normalizeMissingMeta = (editor: Editor, entry: NodeEntry) => {
    const [node, path] = entry

    if (Element.isElement(node) && !node['meta']) {
        if (isList(node)) {
            const meta = createListMeta(editor, path);
            log('add missing meta to list', {node, path, meta})
            setMeta(editor, path, meta);
            return true;
        }

        if (isListItem(node)) {
            const meta = createListItemMeta(editor, path);
            log('add missing meta to list item', {node, path, meta})
            
            setListItemMeta(editor, node, path, meta);
            incrementFollowingSiblings(editor, path);

            return true;
        }
    }

    return false;
}

const normalizeMovedListItem = (editor: Editor, entry: NodeEntry) => {
    const [node, path] = entry

    if (isListItem(node) && node['meta']) {
        const [parent] = Editor.parent(editor, path);
        const newNr = `${path[path.length - 1] + 1}`;

        if (
            parent &&
            isList(parent) &&
            (!parent.meta || parent.meta.type === node.meta.type)
        ) {
            return false;
        }

        // Wrap missing List around ListItem
        if (!parent || !isList(parent)) {
            Transforms.wrapNodes(
                editor,
                createList(node.meta.type),
                { at: path },
            )
            log('wrap list item', {node, path, parent})
            return true;
        }

        const sibling = getPreviousSibling(editor, path);

        // copy sibling meta
        if (sibling && isListItem(sibling)) {
            const meta = createListItemMetaFromSibling(sibling);
            log('set list item meta via sibling', {node, path, sibling, from: node.meta, to: meta});

            setListItemMeta(editor, node, path, meta);

            return true;
            
        // copy parent meta
        } else if (parent && isList(parent) && parent.meta?.type !== node.meta.type) {
            const meta: ListItemMeta = {
                ...node.meta,
                nr: newNr,
                type: parent.meta?.type || node.meta.type, // TODO: check if this is correct
            }
            log('set list item meta via parent', {node, path, parent, from: node.meta, to: meta});

            setListItemMeta(editor, node, path, meta);

            return true;

        // default to CHAPTER
        } else {
            const newNr = path[path.length - 1] + 1;
            const meta: ListItemMeta = {
                ...node.meta,
                nr: `${newNr}`,
                romanNr: convertRomanNumber(newNr),
                nrType: 'roman',
                type: MetaType.CHAPTER,
            }
            log('set list item meta via default', {node, path, parent, from: node.meta, to: meta});
            
            setListItemMeta(editor, node, path, meta);

            return true;
        }
    }
}


export default withLawParagraphs;