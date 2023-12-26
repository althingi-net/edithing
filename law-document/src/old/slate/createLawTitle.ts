import { MetaType } from '../Slate';
import { TAGS } from '../config/tags';
import { convertRomanNumber } from '../number/convertRomanNumber';

export const createLawTitle = (nr: string, type: MetaType, previousTitle?: string | null) => {
    const defaultTitle = TAGS[type].defaultTitle;
    const title = previousTitle || defaultTitle;

    if (title) {
        if (type === MetaType.CHAPTER) {
            return title.replace(/^([IVXLCDM]+)/, convertRomanNumber(nr));
        }

        const digit = extractDigitFromNr(nr);
        return title.replace(/\d+/, digit);
    }

    return '';
};

const extractDigitFromNr = (nr: string) => {
    const digit = nr.match(/\d+/)?.[0];

    if (!digit) {
        throw new Error('No digit found in nr');
    }

    return digit;
};