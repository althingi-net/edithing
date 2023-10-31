import { ListItem } from '../../Slate';
import incrementLetter from '../incrementLetter';
import incrementMixedNumber from '../incrementMixedNumber';
import incrementRomanNumber from '../incrementRomanNumber';

const createListItemMetaFromSibling = (sibling: ListItem) => {
    if (!sibling.meta) {
        throw new Error('createListItemMetaFromSibling: sibling.meta is undefined');
    }

    const { nr, romanNr, nrType, type, title, styleNote } = sibling.meta;
            
    const meta: ListItem['meta'] = {
        type,
        nr: `${incrementMixedNumber(nr)}`
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