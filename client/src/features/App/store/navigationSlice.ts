import { StateCreator } from 'zustand';
import { SessionSlice } from './sessionSlice';
import { RehydrateEvent } from './useStore';

export interface NavigationSlice {
    isNavigationBlocked: boolean;
    setNavigationBlocked: (blocked: boolean) => void;
    rehydrate: (event: RehydrateEvent) => void;
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