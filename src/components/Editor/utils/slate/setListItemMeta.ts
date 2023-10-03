import { Editor, Path, Text, Transforms } from "slate";
import { ListItem, ListItemMeta, MetaType, isListItemText } from "../../Slate";
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
    const listItemText = node.children[0];

    if (!listItemText || !isListItemText(listItemText)) {
        throw new Error('setListItemTitle: child of ListItem is not a ListItemText');
    }

    const firstTextNode = listItemText.children[0];
    const previousTitle = Text.isText(firstTextNode) && firstTextNode.title ? firstTextNode.text : undefined;
    const titlePath = [...path, 0, 0];
    const title = createLawTitle(meta.nr, meta.type, previousTitle);

    if (title) {
        const at = { anchor: { path: titlePath, offset: 0 }, focus: { path: titlePath, offset: 0 } };

        if (previousTitle) {
            Transforms.delete(editor, { at, distance: previousTitle.length });
        }
        Transforms.insertNodes(editor, { text: title, title: true }, { at });
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