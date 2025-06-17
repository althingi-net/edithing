import { DEFAULT_LANGUAGE, translations } from 'law-document';
import { StateCreator } from 'zustand';
import { Translator } from 'law-document-editor';
import { getBrowserLanguage } from '../getBrowserLanguage';
import { NavigationSlice } from './navigationSlice';
import { SessionSlice } from './sessionSlice';
import { RehydrateEvent } from './useStore';

export interface LanguageSlice {
    language: string;
    setLanguage: (language: string) => void;
    t: Translator;
    rehydrate: (event: RehydrateEvent) => void;
}

export const createLanguageSlice: StateCreator<
    LanguageSlice & NavigationSlice & SessionSlice,
    [],
    [],
    LanguageSlice
> = (set, get) => {
    return {
        language: DEFAULT_LANGUAGE,
        setLanguage: (language: string) => {
            set({ language });
        },
        /**
         * Returns the translation for a given key.
         * If the key does not exist in the current language, return the key.
         */
        t: (key: string) => {
            const language = get().language;

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
                console.warn(`Key '${key}' does not exist!`);
            }

            return key;
        },
        /**
         * Set browser language if no language is persisted.
         */
        rehydrate: (event: RehydrateEvent) => {
            if (event.state.language === undefined) {
                set({ language: getBrowserLanguage() });
            }
        },
    };
}; 