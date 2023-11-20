import { TAGS } from '../../../../config/tags';
import { MetaType } from '../../Slate';
import convertRomanNumber from '../number/convertRomanNumber';

const createLawTitle = (nr: string, type: MetaType, previousTitle?: string | null) => {
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

export default createLawTitle;