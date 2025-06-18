import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { OpenAPI } from 'client-sdk';
import { getBrowserLanguage } from '../getBrowserLanguage';
import { createLanguageSlice, LanguageSlice } from './languageSlice';
import { createNavigationSlice, NavigationSlice } from './navigationSlice';
import { createSessionSlice, SessionSlice } from './sessionSlice';

export type Store = SessionSlice & NavigationSlice & LanguageSlice;

export type PersistedState = Pick<Store, 'session' | 'language'>;

export type RehydrateEvent = Partial<Store>;

const persistOptions: PersistOptions<Store, PersistedState> = {
    name: 'app-store',
    partialize: (state) => ({
        session: state.session,
        language: state.language,
    }),
    onRehydrateStorage: () => (state) => {
        console.log('onRehydrateStorage', state);
        // Send rehydrate event to all slices to allow them to handle side effects when the app starts with a persisted state
        if (state) {
            const partialState: RehydrateEvent = {
                session: state.session,
                language: state.language,
            };
            
            // Set browser language if no language is persisted
            if (partialState.language === undefined) {
                state.language = getBrowserLanguage();
            }

            // Set OpenAPI token if session is persisted
            if (partialState.session) {
                OpenAPI.TOKEN = partialState.session.token;
            }
        }
    },
};

export const useStore = create<Store>()(
    persist(
        (...store) => ({
            ...createSessionSlice(...store),
            ...createNavigationSlice(...store),
            ...createLanguageSlice(...store),
        }),
        persistOptions
    )
);
 