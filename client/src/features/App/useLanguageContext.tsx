import { LANGUAGES, DEFAULT_LANGUAGE, translations } from 'law-document';
import { FC, PropsWithChildren, createContext, useCallback, useContext, useState } from 'react';

export type Translator = (key: string) => string;

const getBrowserLanguage = () => {
    const storedLanguage = localStorage.getItem('language');

    if (storedLanguage) {
        return storedLanguage;
    }

    let language = window.navigator.language;

    if (language.includes('-')) {
        [language] = language.split('-');
    }

    if (!LANGUAGES.includes(language)) {
        language = DEFAULT_LANGUAGE;
    }

    return language;
};

interface LanguageContextType {
    language: string;
    setLanguage: (language: string) => void;
    t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const [language, setLanguage] = useState(getBrowserLanguage());

    const handleSetLanguage = useCallback((language: string) => {
        setLanguage(language);
        localStorage.setItem('language', language);
    }, []);

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
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

const useLanguageContext = () => {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error('useLanguageContext must be used within a LanguageContextProvider');
    }

    return context;
};

export default useLanguageContext;