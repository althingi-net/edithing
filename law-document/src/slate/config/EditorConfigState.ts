import { createStore } from 'zustand';
import { persist } from 'zustand/middleware';

export interface EditorConfig {
    /**
     * Display different colors to highlight title, name and sen content
     */
    highlightStructure: boolean;
    setHighlightStructure: (enabled: boolean) => void;

    /**
     * Automatically increment and decrement numbers of list items when being inserted or removed
     */
    autoNumberIncrements: boolean;
    setAutoNumberIncrements: (enabled: boolean) => void;
}

const createContextValue = () => {
    const store = createStore<EditorConfig>()(
        persist(
            (set) => ({
                highlightStructure: false,
                autoNumberIncrements: false,
                setHighlightStructure: (enabled: boolean) => {
                    set({ highlightStructure: enabled });
                },
                setAutoNumberIncrements: (enabled: boolean) => {
                    set({ autoNumberIncrements: enabled });
                },
            }),
            {
                name: 'editorConfig',
            },
        ),
    );

    return store;
};

export const EditorConfigState = createContextValue();
