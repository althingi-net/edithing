import { translations } from 'law-document';
import { useStore } from './useStore';

export const useTranslation = () => {
    const language = useStore((state) => state.language);

    return (key: string) => {
        if (language in translations && key in translations[language]) {
            return translations[language][key];
        }

        if (!language.includes('en')) {
            console.warn(`Key '${key}' does not exist!`);
        }

        return key;
    };
};