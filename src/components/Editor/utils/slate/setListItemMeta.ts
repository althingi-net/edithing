import { Editor, Path, Text, Transforms } from "slate";
import { ElementType, ListItem, ListItemMeta, MetaType, isListItemText } from "../../Slate";
import convertRomanNumber from "../convertRomanNumber";
import createLawTitle from "./createLawTitle";
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
    let listItemText = node.children[0];

    if (!listItemText || !isListItemText(listItemText)) {
        listItemText = { type: ElementType.LIST_ITEM_TEXT, children: [{ text: '' }] };
        Transforms.insertNodes(editor, listItemText, { at: [...path, 0] });
    }

    const firstTextNode = listItemText.children[0];
    const previousTitle = Text.isText(firstTextNode) && firstTextNode.title ? firstTextNode.text : typeof meta.title === 'string' ? meta.title : '';
    const titlePath = [...path, 0, 0];
    const title = createLawTitle(meta.nr, meta.type, previousTitle);

    if (title) {
        const at = { anchor: { path: titlePath, offset: 0 }, focus: { path: titlePath, offset: 0 } };

        // replace existing title
        if (previousTitle) {
            at.focus.offset = previousTitle.length;
        }

        Transforms.insertNodes(editor, { text: title, title: true }, { at, select: true });
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