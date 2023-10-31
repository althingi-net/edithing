import { Editor, Path } from 'slate';
import { ListItemMeta, MetaType, isListItem } from '../../Slate';
import createListItemMetaFromSibling from './createListItemMetaFromSibling';
import createListMeta from './createListMeta';
import getPreviousSibling from './getPreviousSibling';
import createLawTitle from './createLawTitle';

const createListItemMeta = (editor: Editor, path: Path, type?: MetaType): ListItemMeta => {
    if (type) {
        const meta: ListItemMeta = {
            type,
            nr: '1',
        };

        if (type === MetaType.CHAPTER) {
            meta.nrType = 'roman';
            meta.romanNr = 'I';
        }

        return meta;
    }

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