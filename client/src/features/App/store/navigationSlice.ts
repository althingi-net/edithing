import { StateCreator } from 'zustand';
import { RehydrateEvent } from './useStore';
import { SessionSlice } from './sessionSlice';

export interface NavigationSlice {
    isNavigationBlocked: boolean;
    setNavigationBlocked: (blocked: boolean) => void;
    rehydrate: (state: RehydrateEvent) => void;
}

export const createNavigationSlice: StateCreator<
    NavigationSlice & SessionSlice,
    [],
    [],
    NavigationSlice
> = (set) => ({
    isNavigationBlocked: false,
    setNavigationBlocked: (blocked) => set({ isNavigationBlocked: blocked }),
    rehydrate: () => {
        // Navigation state is not persisted, so no rehydration needed
    },
}); 