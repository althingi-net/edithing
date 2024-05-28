import { FC, PropsWithChildren, createContext, useContext } from 'react';
import { temporal } from 'zundo';
import { createStore } from 'zustand';
import { devtools, redux } from 'zustand/middleware';
import { EditorState, FlattenedNode, initializeEditorState } from './EditorState';
import { Node } from './Node';
import { createAddSiblingAction } from './actions/addSibling';
import { createUpdateNodeAction } from './actions/updateNode';
import { createUpdateNodeTextAction } from './actions/updateNodeText';
import reducer from './state/reducer';

export type InitialPayload = Omit<EditorState, 'nodes'> & {
    nodes: Node[];
}

type EditorStateContextType = ReturnType<typeof createContextValue>;

const EditorStateContext = createContext<EditorStateContextType | null>(null);

const createContextValue = (initialState: InitialPayload) => {
    const store = createStoreComposer(initialState);
    const { dispatch } = store;
        
    return {
        store,
        addSibling: (id: string) => {
            dispatch(createAddSiblingAction(id));
        },
        updateNode: (id: string, node: FlattenedNode) => {
            dispatch(createUpdateNodeAction(id, node));
        },
        updateNodeText: (id: string, text: FlattenedNode['text']) => {
            dispatch(createUpdateNodeTextAction(id, text));
        },
    };

};

const createStoreComposer = (initialState: InitialPayload) => {
    // const { config: { undoable, reduxDevTools } } = initialState;

    // if (!reduxDevTools && !undoable) {
    //     return createStore(
    //         redux(reducer, initializeEditorState(initialState)),
    //     );
    // }

    // if (!undoable) {
    //     return createStore(
    //         devtools(
    //             redux(reducer, initializeEditorState(initialState)),
    //         )
    //     );
    // }

    // if (!reduxDevTools) {
    //     return createStore(
    //         temporal(
    //             redux(reducer, initializeEditorState(initialState)),
    //         )
    //     );
    // }

    return createStore(
        devtools(
            temporal(
                redux(reducer, initializeEditorState(initialState)),
            )
        )
    );
};

export const EditorStateContextProvider: FC<PropsWithChildren & { initialState: InitialPayload }> = ({ children, initialState }) => {
    return (
        <EditorStateContext.Provider value={createContextValue(initialState)}>
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