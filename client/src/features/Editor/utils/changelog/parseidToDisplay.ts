import { Translator } from '../../../App/useLanguageContext';

const IGNORED_TAGS = ['paragraph'];

const parseIdToDisplay = (t: Translator, id: string) => {
    return id.split('.')
        .map(level => level.split('-'))
        .filter(([type]) => !IGNORED_TAGS.includes(type))
        .map(([type, nr]) => nr ? `${nr}. ${t(type)}.` : `${t(type)}.`)
        .reverse()
        .join(' ');
};

export default parseIdToDisplay;