import { FC, PropsWithChildren, createContext, useCallback, useContext, useState } from 'react';
import translations, { DEFAULT_LANGUAGE, LANGUAGES } from '../../config/translations';

export type Translator = (key: string) => string;

const getBrowserLanguage = () => {
    let language = window.navigator.language;

    if (language.includes('-')) {
        [language] = language.split('-');
    }

    if (!LANGUAGES.includes(language)) {
        language = DEFAULT_LANGUAGE;
    }

    return language;
};

export const LanguageContext = createContext({
    language: getBrowserLanguage(),
    setLanguage: (language: string) => { return; },
    t: (key: string) => { return key; },
});

export const LanguageContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const [language, setLanguage] = useState(getBrowserLanguage());
    const t = useCallback((key: string) => {
        if (language.includes('-')) {
            const [languagePart] = language.split('-');
            if (languagePart in translations && key in translations[languagePart]) {
                return translations[languagePart][key];
            }
        }

        if (language in translations && key in translations[language]) {
            return translations[language][key];
        }

        if (!language.includes('en')) {
            console.warn(`Missing translation for ${language} and key ${key}`);
        }

        return key;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

const useLanguageContext = () => {
    return useContext(LanguageContext);
};

export default useLanguageContext;