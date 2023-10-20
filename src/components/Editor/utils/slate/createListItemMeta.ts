import { Editor, Path } from 'slate';
import { ListItemMeta, isListItem } from '../../Slate';
import createListItemMetaFromSibling from './createListItemMetaFromSibling';
import createListMeta from './createListMeta';
import getPreviousSibling from './getPreviousSibling';
import createLawTitle from './createLawTitle';

const createListItemMeta = (editor: Editor, path: Path): ListItemMeta => {
    const [sibling] = getPreviousSibling(editor, path) ?? [];
    if (isListItem(sibling)) {
        return createListItemMetaFromSibling(sibling);
    } else {
        const meta = createListMeta(editor, path) as ListItemMeta;

        meta.nr = '1';
    
        if (meta.nrType === 'roman') {
            meta.romanNr = 'I';
        }

        const title = createLawTitle(meta.nr, meta.type);

        if (title) {
            meta.title = true;
        }

        return meta;
    }
};

export default createListItemMeta;