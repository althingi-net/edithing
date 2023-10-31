import translations from '../../../../config/translations';

const IGNORED_TAGS = ['paragraph'];

const parseIdToDisplay = (id: string) => {
    return id.split('.')
        .map(level => level.split('-'))
        .filter(([type, nr]) => !IGNORED_TAGS.includes(type))
        .map(([type, nr]) => nr ? `${nr}. ${translate(type)}.` : `${translate(type)}.`)
        .reverse()
        .join(' ');
};

const translate = (word: string) => {
    if (translations[word]) {
        return translations[word];
    }

    return word;
};

export default parseIdToDisplay;