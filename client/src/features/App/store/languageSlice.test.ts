import { DEFAULT_LANGUAGE } from 'law-document';
import { create, StoreApi } from 'zustand';
import { createLanguageSlice } from './languageSlice';
import { createNavigationSlice } from './navigationSlice';
import { createSessionSlice } from './sessionSlice';
import { Store } from './useStore';

describe('Language Store', () => {
    let store: StoreApi<Store>;

    beforeEach(() => {
        // Clear localStorage to avoid test pollution
        localStorage.clear();
        store = create<Store>()((...store) => ({
            ...createSessionSlice(...store),
            ...createNavigationSlice(...store),
            ...createLanguageSlice(...store),
        }));
    });

    it('should set language', () => {
        const { setLanguage } = store.getState();
        setLanguage('is');
        expect(store.getState().language).toBe('is');
    });

    it('should set browser language on rehydrate if persisted language is undefined', () => {
        // Simulate a different browser language
        const originalLanguage = window.navigator.language;
        Object.defineProperty(window.navigator, 'language', {
            value: 'is',
            configurable: true,
        });

        // Rehydrate
        store.getState().rehydrate({});
        expect(store.getState().language).toBe('is');

        // Restore original navigator
        Object.defineProperty(window.navigator, 'language', {
            value: originalLanguage,
            configurable: true,
        });
    });

    it('should not set browser language on rehydrate if persisted language is defined', () => {
        // Mock browser language to 'is'
        const originalLanguage = window.navigator.language;
        Object.defineProperty(window.navigator, 'language', {
            value: 'is',
            configurable: true,
        });

        // Persisted language is 'en'
        store.getState().rehydrate({ language: 'en' });
        expect(store.getState().language).toBe(undefined); // its undefined because the actual rehydration of state is not done in this test

        // Restore original navigator
        Object.defineProperty(window.navigator, 'language', {
            value: originalLanguage,
            configurable: true,
        });
    });

    it('should use default language if browser language is not supported', () => {
        // Simulate a different browser language
        const originalLanguage = window.navigator.language;
        Object.defineProperty(window.navigator, 'language', {
            value: 'xx',
            configurable: true,
        });

        // Rehydrate
        store.getState().rehydrate({});
        expect(store.getState().language).toBe(DEFAULT_LANGUAGE);

        // Restore original navigator
        Object.defineProperty(window.navigator, 'language', {
            value: originalLanguage,
            configurable: true,
        });
    });
}); 