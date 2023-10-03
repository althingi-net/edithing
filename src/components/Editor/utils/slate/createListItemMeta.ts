import { Editor, Path } from "slate";
import { ListItemMeta, MetaType, isList, isListItem } from "../../Slate";
import getPreviousSibling from "./getPreviousSibling";
import createListItemMetaFromSibling from "./createListItemMetaFromSibling";
import createListMeta from "./createListMeta";

const createListItemMeta = (editor: Editor, path: Path): ListItemMeta => {
    const sibling = getPreviousSibling(editor, path);
    if (sibling && isListItem(sibling)) {
        return createListItemMetaFromSibling(sibling);
    } else {
        const nextParent = Editor.above(editor, { at: path, match: n => isList(n) && !!n.meta });

        const meta = nextParent ? createListMeta(editor, nextParent[1]) as ListItemMeta : {
            type: MetaType.CHAPTER,
            nrType: 'roman',
        } as ListItemMeta;

        meta.nr = '1';
    
        if (meta.nrType === 'roman') {
            meta.romanNr = 'I';
        }

        return meta;
    }
}

export default createListItemMeta;