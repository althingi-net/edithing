import { FC, PropsWithChildren, createContext, useContext, useReducer } from 'react';
import { EditorState, FlattenedNode, initializeEditorState } from './EditorState';
import { Node } from './Node';
import { createAddSiblingAction } from './actions/addSibling';
import reducer from './state/reducer';
import { createUpdateNodeAction } from './actions/updateNode';
import { createUpdateNodeTextAction } from './actions/updateNodeText';

export type InitialPayload = Omit<EditorState, 'nodes'> & {
    nodes: Node[];
}

type EditorStateContextType = EditorState & {
    addSibling: (id: string) => void;
    updateNode: (id: string, node: FlattenedNode) => void;
    updateNodeText: (id: string, text: FlattenedNode['text']) => void;
};

const EditorStateContext = createContext<EditorStateContextType | null>(null);

export const EditorStateContextProvider: FC<PropsWithChildren & { initialState: InitialPayload }> = ({ children, initialState }) => {
    const [state, dispatch] = useReducer(reducer, initialState, initializeEditorState);
    
    return (
        <EditorStateContext.Provider value={{
            ...state,
            addSibling: (id: string) => {
                dispatch(createAddSiblingAction(id));
            },
            updateNode: (id: string, node: FlattenedNode) => {
                dispatch(createUpdateNodeAction(id, node));
            },
            updateNodeText: (id: string, text: FlattenedNode['text']) => {
                dispatch(createUpdateNodeTextAction(id, text));
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