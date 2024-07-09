import { HocuspocusProvider } from '@hocuspocus/provider';
import { FC, PropsWithChildren, createContext, useContext } from 'react';
import { createStore } from 'zustand';
import yjsMiddleware from 'zustand-middleware-yjs';
import { Doc } from 'yjs';
import { EditorState, FlattenedNode, initializeEditorState } from './EditorState';
import { Node } from './Node';
import { applyAddSibling } from './actions/addSibling';
import { applySetEditMenu } from './actions/setEditMenu';
import { applyUpdateNode } from './actions/updateNode';
import { applyUpdateNodeText } from './actions/updateNodeText';

export type InitialPayload = Omit<EditorState, 'nodes'> & {
    nodes: Node[];
}

type EditorStateContextType = ReturnType<typeof createContextValue>;

const EditorStateContext = createContext<EditorStateContextType | null>(null);

interface EditorStore extends EditorState {
    addSibling: (id: string) => void;
    updateNode: (id: string, node: FlattenedNode) => void;
    updateNodeText: (id: string, text: FlattenedNode['text']) => void;
    setEditMenu: (enabled: boolean) => void;
}

const createContextValue = (initialState: InitialPayload) => {

    const ydoc = new Doc();

    const provider = new HocuspocusProvider({
        url: 'ws://' + window.location.host + ':4523',
        name: 'editorState',
        document: ydoc,

        onOpen() {
            console.log('onOpen');
        },
        onConnect() {
            console.log('onConnect');
        },
        onAuthenticated() {
            console.log('onAuthenticated');
        },
        onAuthenticationFailed: ({ reason }) => {
            console.log('onAuthenticationFailed', { reason });
        },
        onStatus: ({ status }) => {
            console.log('onStatus', { status });
        },
        onMessage: ({ event, message }) => {
            console.log('onMessage', { event, message });
        },
        onOutgoingMessage: ({ message }) => {
            console.log('onOutgoingMessage', { message });
        },
        onSynced: ({ state }) => {
            console.log('onSynced', { state });
        },
        onClose: ({ event }) => {
            console.log('onClose', { event });
        },
        onDisconnect: ({ event }) => {
            console.log('onDisconnect', { event });
        },
        onDestroy() {
            console.log('onDestroy');
        },
        onAwarenessUpdate: (...args) => {
            console.log('onAwarenessUpdate', ...args);
        },
        onAwarenessChange: ({ states }) => {
            console.log('onAwarenessChange', { states });
        },
        onStateless: ({ payload }) => {
            console.log('onStateless', { payload });
            // the provider can also send a custom message to the server: provider.sendStateless('any string payload')
        }
    });

    provider.on('message', (...args: any[]) => {
        console.log('onMessage', args);
    });



    const store = createStore<EditorStore>(
        yjsMiddleware(
            ydoc,
            'shared',
            (set) => ({
                ...initializeEditorState(initialState),
                addSibling: (id: string) => {
                    console.log('addSibling', id);
                    set(state => applyAddSibling(state, id));
                },
                updateNode: (id: string, node: FlattenedNode) => {
                    console.log('updateNode', id, node);
                    set(state => applyUpdateNode(state, id, node));
                },
                updateNodeText: (id: string, text: FlattenedNode['text']) => {
                    console.log('updateNodeText', id, text);
                    set(state => applyUpdateNodeText(state, id, text));
                },
                setEditMenu: (enabled: boolean) => {
                    console.log('setEditMenu', enabled);
                    set(state => applySetEditMenu(state, enabled));
                },
            }),
        )
    );

    return {
        store,
        addSibling: (id: string) => {
            store.getState().addSibling(id);
        },
        updateNode: (id: string, node: FlattenedNode) => {
            store.getState().updateNode(id, node);
        },
        updateNodeText: (id: string, text: FlattenedNode['text']) => {
            store.getState().updateNodeText(id, text);
        },
        setEditMenu: (enabled: boolean) => {
            store.getState().setEditMenu(enabled);
        },
    };

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
