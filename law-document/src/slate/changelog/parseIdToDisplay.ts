
const IGNORED_TAGS = ['paragraph'];

type Translator = (id: string) => string;

export const parseIdToDisplay = (t: Translator, id: string) => {
    return id.split('.')
        .map(level => level.split('-'))
        .filter(([type]) => !IGNORED_TAGS.includes(type))
        .map(([type, nr]) => nr ? `${nr}. ${t(type)}.` : `${t(type)}`)
        .reverse()
        .join(' ');
};
