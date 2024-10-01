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

        const digit = nr.match(/\d+/)?.[0];

        if (digit) {
            return title.replace(/\d+/, digit);
        }

        const letter = nr.match(/[A-Za-z]+/)?.[0];

        if (letter) {
            return title.replace(/[A-Za-z]+/, letter);
        }

        return title;
    }

    return '';
};
