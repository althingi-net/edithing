import { createContext, FC, PropsWithChildren, useContext } from 'react';
import { useStore } from 'zustand';
import { EditorConfig, EditorConfigState } from 'law-document';

const EditorConfigContext = createContext(EditorConfigState);

export const EditorConfigContextProvider: FC<PropsWithChildren> = ({ children }) => {
    return (
        <EditorConfigContext.Provider value={EditorConfigState}>
            { children }
        </EditorConfigContext.Provider>
    );
};

export function useEditorConfig <T>(selector: (state: EditorConfig) => T): T {
    const store = useContext(EditorConfigContext);

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!store) {
        throw new Error('useEditorConfigContext must be used within a EditorConfigContextProvider');
    }

    return useStore(store, selector);
}
