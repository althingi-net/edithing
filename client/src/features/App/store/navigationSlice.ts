import { StateCreator } from 'zustand';
import { SessionSlice } from './sessionSlice';

export interface NavigationSlice {
    isNavigationBlocked: boolean;
    setNavigationBlocked: (blocked: boolean) => void;
}

export const createNavigationSlice: StateCreator<
    NavigationSlice & SessionSlice,
    [],
    [],
    NavigationSlice
> = (set) => ({
    isNavigationBlocked: false,
    setNavigationBlocked: (blocked) => set({ isNavigationBlocked: blocked }),
}); 