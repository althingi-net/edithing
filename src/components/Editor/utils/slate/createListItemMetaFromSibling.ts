import { ListItem } from "../../Slate";
import incrementLetter from "../incrementLetter";
import incrementMixedNumber from "../incrementMixedNumber";
import incrementRomanNumber from "../incrementRomanNumber";

const createListItemMetaFromSibling = (sibling: ListItem) => {
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
        if (romanNr && meta.romanNr) {
            meta.title = `${title.replace(romanNr, meta.romanNr)}`;
        } else {
            meta.title = `${title.replace(nr, meta.nr)}`;
        }
    }

    if (styleNote) {
        meta.styleNote = styleNote;
    }

    return meta;
}

export default createListItemMetaFromSibling;