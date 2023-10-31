import { MetaType } from '../../Slate';
import convertRomanNumber from '../convertRomanNumber';

const createLawTitle = (nr: string, type: MetaType, previousTitle?: string | null) => {
    if (previousTitle) {
        if (type !== MetaType.CHAPTER) {
            const digit = nr.match(/\d+/)?.[0];
    
            if (!digit) {
                throw new Error('No digit found in nr');
            }
    
            return previousTitle.replace(/\d+/, digit);
        } else {
            return previousTitle.replace(/^([IVXLCDM]+)/, convertRomanNumber(nr));
        }
    }

    switch (type) {
    case MetaType.CHAPTER:
        return `${convertRomanNumber(nr)}. kafli. `;
    case MetaType.ART:
        return previousTitle ? previousTitle.replace(/\d+/, nr) :  `${nr}. gr. `;
    case MetaType.SUBART:
    case MetaType.PARAGRAPH:
    default:
        return '';
    }
};

export default createLawTitle;