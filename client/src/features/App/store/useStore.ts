import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { createNavigationSlice, NavigationSlice } from './navigationSlice';
import { createSessionSlice, SessionSlice } from './sessionSlice';

export type Store = SessionSlice & NavigationSlice;

export interface RehydrateEvent {
    type: 'REHYDRATE';
    state: Partial<SessionSlice & NavigationSlice>;
}

type PersistedState = Pick<Store, 'session'>;

const persistOptions: PersistOptions<Store, PersistedState> = {
    name: 'app-store',
    partialize: (state) => ({
        session: state.session,
    }),
    onRehydrateStorage: () => (state) => {
        // Send rehydrate event to all slices to allow them to handle side effects when the app starts with a persisted state
        if (state) {
            const event: RehydrateEvent = {
                type: 'REHYDRATE',
                state: {
                    session: state.session,
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
        }),
        persistOptions
    )
);
 