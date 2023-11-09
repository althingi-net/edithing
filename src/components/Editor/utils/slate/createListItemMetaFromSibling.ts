import { ListItem, ListItemMeta } from '../../Slate';
import incrementLetter from '../incrementLetter';
import incrementMixedNumber from '../incrementMixedNumber';
import incrementRomanNumber from '../incrementRomanNumber';

interface Options {
    isNodeSplit?: boolean;
}

const createListItemMetaFromSibling = (sibling: ListItem, options: Options = {}) => {
    if (!sibling.meta) {
        throw new Error('createListItemMetaFromSibling: sibling.meta is undefined');
    }

    const { isNodeSplit } = options;
    const { nr, originNr, romanNr, nrType, type, title, styleNote } = sibling.meta;
            
    const newNr = incrementMixedNumber(nr);
    const meta: ListItemMeta = {
        type,
        nr: newNr,
        originNr: isNodeSplit ? originNr : newNr,
    };

    if (nrType) {
        meta.nrType = nrType;

        if (nrType === 'roman' && romanNr) {
            meta.romanNr = incrementRomanNumber(romanNr);
        }

        if (nrType === 'alphabet') {
            meta.nr = incrementLetter(nr);
        }
    }

    if (title) {
        meta.title = true;
    }

    if (styleNote) {
        meta.styleNote = styleNote;
    }

    return meta;
};

export default createListItemMetaFromSibling;