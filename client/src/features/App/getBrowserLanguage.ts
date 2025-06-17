import { LANGUAGES, DEFAULT_LANGUAGE } from 'law-document';

export const getBrowserLanguage = () => {
    let language = window.navigator.language;

    if (language.includes('-')) {
        [language] = language.split('-');
    }

    if (!LANGUAGES.includes(language)) {
        language = DEFAULT_LANGUAGE;
    }

    return language;
};
