import { Editor, Path } from 'slate';
import { ListItem, ListItemMeta } from '../element/ListItem';
import { MetaType } from '../Slate';
import { convertRomanNumber } from '../number/convertRomanNumber';
import { setListItemTitleFromMeta } from './setListItemTitleFromMeta';
import { setMeta } from './setMeta';

interface Options {
    updateTitle?: boolean;
    select?: boolean;
}

export const setListItemMeta = (editor: Editor, node: ListItem, path: Path, meta: ListItemMeta, options: Options = {}) => {  
    const { updateTitle = true, select = true } = options;
    
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
        setListItemTitleFromMeta(editor, path, meta, select);
    }
};