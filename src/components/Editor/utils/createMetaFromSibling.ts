import { Editor, Node, Path } from 'slate';
import increaseRomanNumber from '../../../utils/increaseRomanNumber';
import { isList, isListItem } from '../Slate';
import getSiblingAbove from './getSiblingAbove';

const createMetaFromSibling = (editor: Editor, path: Path) => {
    const aboveSibling = getSiblingAbove(editor, path);
    const meta: any = {};

    if (aboveSibling) {
        if (isList(aboveSibling)) {
            const { type, nrType } = aboveSibling.meta;

            meta.type = type;
            meta.nrType = nrType;
        }

        if (isListItem(aboveSibling)) {
            const { nr, romanNr, nrType, type } = aboveSibling.meta;

            meta.type = type;
            meta.nr = `${(Number(nr) ?? 0) + 1}`;

            if (nrType) {
                meta.nrType = nrType;
            }

            if (romanNr) {
                meta.romanNr = increaseRomanNumber(romanNr);
            }
        }
    }

    return meta;
}


export default createMetaFromSibling;