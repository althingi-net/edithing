import { Editor, Path, Text, Transforms } from "slate";
import { ListItem, ListItemMeta, MetaType, isListItemText } from "../../Slate";
import convertRomanNumber from "../convertRomanNumber";
import getListItemTitle from "./getListItemTitle";
import setMeta from "./setMeta";

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


const setListItemTitle = (editor: Editor, node: ListItem, path: number[], meta: ListItemMeta) => {
    const previousTitle = getListItemTitle(editor, path);
    const titlePath = [...path, 0, 0];

    if (meta.title) {
        const at = { anchor: { path: titlePath, offset: 0 }, focus: { path: titlePath, offset: 0 } };

        // replace existing title
        if (previousTitle) {
            at.focus.offset = previousTitle.length;
        }

        Transforms.insertNodes(editor, { text: meta.title, title: true }, { at, select: true });
    }
}

const removeListItemTitle = (editor: Editor, node: ListItem, path: Path) => {
    const listItemText = node.children[0];

    if (listItemText && isListItemText(listItemText)) {
        const textNode = listItemText.children[0];

        if (Text.isText(textNode) && textNode.title) {
            Transforms.removeNodes(editor, { at: [...path, 0, 0] });
            return true;
        }
    }

    return false;
}

export default setListItemMeta;