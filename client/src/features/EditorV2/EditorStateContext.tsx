import { FC, PropsWithChildren, createContext, useContext, useReducer } from 'react';
import { EditorAction, EditorState, editorReducer, initializeEditorState } from './EditorState';
import { Node } from './Node';

export type InitialPayload = Omit<EditorState, 'nodes'> & {
    nodes: Node[];
}

type EditorStateContextType = EditorState & {
    addSibling: (id: string) => void;
};

const EditorStateContext = createContext<EditorStateContextType | null>(null);

export const EditorStateContextProvider: FC<PropsWithChildren & { initialState: InitialPayload }> = ({ children, initialState }) => {
    const [state, dispatch] = useReducer(editorReducer, initialState, initializeEditorState);
    
    return (
        <EditorStateContext.Provider value={{
            ...state,
            addSibling: (id: string) => {
                dispatch({ type: EditorAction.ADD_SIBLING, payload: { id } });
            },
        }}>
            {children}
        </EditorStateContext.Provider>
    );
};

export const useEditorState = () => {
    const context = useContext(EditorStateContext);

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!context) {
        throw new Error('useEditorStateContext must be used within a EditorStateContextProvider');
    }

    return context;
};