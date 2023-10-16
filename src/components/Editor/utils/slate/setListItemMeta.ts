import { Editor, Node, NodeEntry, Path, Text, Transforms } from "slate";
import { ElementType, ListItem, ListItemMeta, MetaType, Title, isListItemText } from "../../Slate";
import convertRomanNumber from "../convertRomanNumber";
import setMeta from "./setMeta";
import { forEachChild } from "typescript";

const setListItemMeta = (editor: Editor, node: ListItem, path: Path, meta: ListItemMeta) => {
    if (meta.type === MetaType.CHAPTER) {
        meta = {
            ...meta,
            romanNr: convertRomanNumber(meta.nr),
            nrType: 'roman',
        }
    } else if (node.meta?.type === MetaType.CHAPTER) {
        const { romanNr, nrType, ...reducedMeta } = meta;
        meta = reducedMeta;
    }

    setMeta(editor, path, meta);

    if (meta.title) {
        setListItemTitle(editor, node, path, meta);

    } else if (node.meta?.title) {
        removeListItemTitle(editor, node, path);
    }
}

const findListItemTitleNode = (editor: Editor, path: Path): NodeEntry<Title> | null => {
    const listItemTextPath = [...path, 0];
    const listItemText = Node.get(editor, listItemTextPath);

    if (!isListItemText(listItemText)) {
        throw new Error('Expected list item text node');
    }

    for (let i = 0; i < listItemText.children.length; i++) {
        const child = listItemText.children[i];
        if (!Text.isText(child) && child.type === ElementType.TITLE) {
            return [child, [...listItemTextPath, i]];
        }
    }

    return null;
}

const setListItemTitle = (editor: Editor, node: ListItem, path: number[], meta: ListItemMeta) => {
    let listItemText = node.children[0];

    if (!listItemText || !isListItemText(listItemText)) {
        listItemText = { type: ElementType.LIST_ITEM_TEXT, children: [{ text: '' }] };
        Transforms.insertNodes(editor, listItemText, { at: [...path, 0] });
    }

    const titleNode = findListItemTitleNode(editor, path);
    const previousTitle = titleNode && Node.string(titleNode[0]);
    const titlePath = [...path, 0, 0];

    if (meta.title) {
        if (previousTitle) {
            const at = {
                anchor: { path: titlePath, offset: 0 },
                focus: { path: titlePath, offset: previousTitle.length }
            };
            Transforms.insertNodes(editor, { text: meta.title }, { at });
        } else {
            Transforms.insertNodes(editor, { type: ElementType.TITLE, children: [{ text: meta.title }] }, { at: [...path, 0, 0], select: true });
        }
    }
}

const removeListItemTitle = (editor: Editor, node: ListItem, path: Path) => {
    const listItemText = node.children[0];

    if (listItemText && isListItemText(listItemText)) {
        const textNode = listItemText.children[0];

        if (!Text.isText(textNode) && textNode.type === ElementType.TITLE) {
            Transforms.removeNodes(editor, { at: [...path, 0, 0] });
            return true;
        }
    }

    return false;
}

export default setListItemMeta;