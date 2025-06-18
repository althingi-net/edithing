import { StateCreator } from 'zustand';
import { getBrowserLanguage } from '../getBrowserLanguage';
import { NavigationSlice } from './navigationSlice';
import { SessionSlice } from './sessionSlice';
import { RehydrateEvent } from './useStore';

export interface LanguageSlice {
    language: string;
    setLanguage: (language: string) => void;
    rehydrate: (state: RehydrateEvent) => void;
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
        /**
         * Set browser language if no language is persisted.
         */
        rehydrate: (state) => {
            if (state.language === undefined) {
                set({ language: getBrowserLanguage() });
            }
        },
    };
}; 