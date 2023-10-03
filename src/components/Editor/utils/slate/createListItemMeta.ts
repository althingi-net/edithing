import { Editor, Path } from "slate";
import { ListItemMeta, isListItem } from "../../Slate";
import createListItemMetaFromSibling from "./createListItemMetaFromSibling";
import createListMeta from "./createListMeta";
import getPreviousSibling from "./getPreviousSibling";

const createListItemMeta = (editor: Editor, path: Path): ListItemMeta => {
    const sibling = getPreviousSibling(editor, path);
    if (sibling && isListItem(sibling)) {
        return createListItemMetaFromSibling(sibling);
    } else {
        const meta = createListMeta(editor, path) as ListItemMeta;

        meta.nr = '1';
    
        if (meta.nrType === 'roman') {
            meta.romanNr = 'I';
        }

        return meta;
    }
}

export default createListItemMeta;