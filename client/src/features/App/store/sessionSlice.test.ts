import { User } from 'client-sdk';
import { create, StoreApi } from 'zustand';
import { createSessionSlice } from './sessionSlice';
import { createNavigationSlice } from './navigationSlice';
import { Store } from './useStore';

// Mock the OpenAPI object
jest.mock('client-sdk', () => ({
    OpenAPI: {
        TOKEN: undefined
    }
}));

describe('Session Store', () => {
    let store: StoreApi<Store>;
    const mockUser = {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User'
    } as User;

    beforeEach(() => {
        store = create<Store>()((...store) => ({
            ...createSessionSlice(...store),
            ...createNavigationSlice(...store),
        }));
    });

    it('should start with no authenticated user', () => {
        const { isAuthenticated } = store.getState();
        expect(isAuthenticated()).toBe(false);
    });

    it('should allow user to log in', () => {
        const { setSession, isAuthenticated } = store.getState();
        
        setSession({
            token: 'test-token',
            user: mockUser
        });

        const { session } = store.getState();
        expect(session?.user).toEqual(mockUser);
        expect(isAuthenticated()).toBe(true);
    });

    it('should allow user to log out', () => {
        const { setSession, logout, isAuthenticated } = store.getState();
        
        // First log in
        setSession({
            token: 'test-token',
            user: mockUser
        });
        expect(isAuthenticated()).toBe(true);

        // Then log out
        const logoutResult = logout();
        expect(logoutResult).toBe(true);

        expect(isAuthenticated()).toBe(false);
    });

    it('should prevent logout when navigation is blocked', () => {
        const { setSession, logout, setNavigationBlocked } = store.getState();
        
        // First log in
        setSession({
            token: 'test-token',
            user: mockUser
        });

        // Block navigation
        setNavigationBlocked(true);
        
        // Try to log out
        const logoutResult = logout();
        expect(logoutResult).toBe(false);
        
        // Session should still be active
        const { isAuthenticated } = store.getState();
        expect(isAuthenticated()).toBe(true);
    });
}); 