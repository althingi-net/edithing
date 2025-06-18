import { renderHook, act } from '@testing-library/react';
import { translations } from 'law-document';
import { useStore } from './useStore';
import { useTranslation } from './useTranslation';

describe('useTranslation', () => {
    beforeEach(() => {
        // Reset language to default before each test
        act(() => {
            useStore.getState().setLanguage('en');
        });
    });

    it('should translate known keys', () => {
        act(() => {
            useStore.getState().setLanguage('is');
        });
        const t = renderHook(() => useTranslation()).result.current;
        const key = Object.keys(translations['is'])[0];
        expect(t(key)).toBe(translations['is'][key]);
    });

    it('should return key for unknown translation', () => {
        act(() => {
            useStore.getState().setLanguage('is');
        });
        const t = renderHook(() => useTranslation()).result.current;
        expect(t('__unknown_key__')).toBe('__unknown_key__');
    });
}); 