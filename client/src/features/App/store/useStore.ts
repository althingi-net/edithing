import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { createNavigationSlice, NavigationSlice } from './navigationSlice';
import { createSessionSlice, SessionSlice } from './sessionSlice';
import { createLanguageSlice, LanguageSlice } from './languageSlice';

export type Store = SessionSlice & NavigationSlice & LanguageSlice;

export interface RehydrateEvent {
    type: 'REHYDRATE';
    state: Partial<SessionSlice & NavigationSlice & LanguageSlice>;
}

type PersistedState = Pick<Store, 'session' | 'language'>;

const persistOptions: PersistOptions<Store, PersistedState> = {
    name: 'app-store',
    partialize: (state) => ({
        session: state.session,
        language: state.language,
    }),
    onRehydrateStorage: () => (state) => {
        // Send rehydrate event to all slices to allow them to handle side effects when the app starts with a persisted state
        if (state) {
            const event: RehydrateEvent = {
                type: 'REHYDRATE',
                state: {
                    session: state.session,
                    language: state.language,
                },
            };
            state.rehydrate(event);
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
 