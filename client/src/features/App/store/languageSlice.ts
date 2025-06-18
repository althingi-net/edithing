import { StateCreator } from 'zustand';
import { NavigationSlice } from './navigationSlice';
import { SessionSlice } from './sessionSlice';

export interface LanguageSlice {
    language: string;
    setLanguage: (language: string) => void;
}

export const createLanguageSlice: StateCreator<
    LanguageSlice & NavigationSlice & SessionSlice,
    [],
    [],
    LanguageSlice
> = (set) => {
    return {
        language: undefined as unknown as string, // undefined until rehydrated
        setLanguage: (language: string) => {
            set({ language });
        },
    };
}; 