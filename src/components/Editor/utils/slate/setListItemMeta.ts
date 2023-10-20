import { Editor, Path } from 'slate';
import { ListItem, ListItemMeta, MetaType } from '../../Slate';
import convertRomanNumber from '../convertRomanNumber';
import setListItemTitleFromMeta from './setListItemTitleFromMeta';
import setMeta from './setMeta';

const setListItemMeta = (editor: Editor, node: ListItem, path: Path, meta: ListItemMeta, updateTitle = true) => {  
    // Add romanNr and nrType
    if (meta.type === MetaType.CHAPTER) {
        meta = {
            ...meta,
            romanNr: convertRomanNumber(meta.nr),
            nrType: 'roman',
        };

    // Remove romanNr and nrType
    } else if (node.meta?.type === MetaType.CHAPTER) {
        const { romanNr, nrType, ...reducedMeta } = meta;
        meta = reducedMeta;
    }

    setMeta(editor, path, meta);

    if (updateTitle) {
        setListItemTitleFromMeta(editor, path, meta);
    }
};

export default setListItemMeta;