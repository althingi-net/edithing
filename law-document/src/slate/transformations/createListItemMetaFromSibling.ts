import { ListItem, ListItemMeta } from '../element/ListItem';
import { incrementLetter } from '../number/incrementLetter';
import { incrementMixedNumber } from '../number/incrementMixedNumber';
import { incrementRomanNumber } from '../number/incrementRomanNumber';

interface Options {
    isNodeSplit?: boolean;
}

export const createListItemMetaFromSibling = (sibling: ListItem, options: Options = {}) => {
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