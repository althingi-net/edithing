import { LoginResponse, OpenAPI, User } from 'client-sdk';
import { StateCreator } from 'zustand';
import { NavigationSlice } from './navigationSlice';

export interface Session extends LoginResponse {
    token: string;
    user: User;
}

export interface SessionSlice {
    session: Session | null;
    setSession: (session: Session | null) => void;
    isAuthenticated: () => boolean;
    logout: () => boolean; // Returns true if logout was successful
}

export const createSessionSlice: StateCreator<
    SessionSlice & NavigationSlice,
    [],
    [],
    SessionSlice
> = (set, get) => ({
    session: null,
    setSession: (session) => {
        console.log('setSession', session);
        set({ session });
        // Update OpenAPI headers when session changes
        OpenAPI.TOKEN = session?.token;
    },
    isAuthenticated: () => !!get().session,
    logout: () => {
        if (get().isNavigationBlocked) {
            // TODO: show confirmation dialog
            return false; // Logout was blocked
        }

        set({ session: null });
        OpenAPI.TOKEN = undefined;
        return true; // Logout was successful
    },
}); 