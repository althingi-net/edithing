import { create, StoreApi } from 'zustand';
import { createNavigationSlice } from './navigationSlice';
import { createSessionSlice } from './sessionSlice';
import { Store } from './useStore';

describe('Navigation Store', () => {
    let store: StoreApi<Store>;

    beforeEach(() => {
        store = create<Store>()((...store) => ({
            ...createSessionSlice(...store),
            ...createNavigationSlice(...store),
        }));
    });

    it('should start with navigation not blocked', () => {
        const { isNavigationBlocked } = store.getState();
        expect(isNavigationBlocked).toBe(false);
    });

    it('should allow blocking navigation', () => {
        const { setNavigationBlocked } = store.getState();
        
        setNavigationBlocked(true);
        
        const { isNavigationBlocked } = store.getState();
        expect(isNavigationBlocked).toBe(true);
    });

    it('should allow unblocking navigation', () => {
        const { setNavigationBlocked } = store.getState();
        
        // First block navigation
        setNavigationBlocked(true);
        expect(store.getState().isNavigationBlocked).toBe(true);
        
        // Then unblock it
        setNavigationBlocked(false);
        expect(store.getState().isNavigationBlocked).toBe(false);
    });
}); 