import { Editor, Path } from 'slate';
import { ListItemMeta, isListItem } from '../../slate/element/ListItem';
import { MetaType } from '../Slate';
import { createLawTitle } from './createLawTitle';
import { createListItemMetaFromSibling } from './createListItemMetaFromSibling';
import { createListMeta } from './createListMeta';
import { getPreviousSibling } from './getPreviousSibling';

export const createListItemMeta = (editor: Editor, path: Path, type?: MetaType): ListItemMeta => {
    if (type) {
        const meta: ListItemMeta = {
            type,
            nr: '1',
            originNr: '1',
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
        const listMeta = createListMeta(editor, path);
        const meta: ListItemMeta = {
            ...listMeta,
            nr: '1',
            originNr: '1',
        };
    
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