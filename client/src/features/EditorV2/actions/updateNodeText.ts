/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { FlattenedNode, EditorState } from '../EditorState';
import { Node } from '../Node';
import { findNode } from '../state/selectors/findNode';

const TYPE = 'UPDATE_NODE_TEXT' as const;

export type UpdateNodeTextEditorAction = ReturnType<typeof createUpdateNodeTextAction>;

export const createUpdateNodeTextAction = (id: Node['id'], text: FlattenedNode['text']) => {
    return {
        type: TYPE,
        payload: { id, text },
    };
};

export const matchUpdateNodeText = (action: any): action is UpdateNodeTextEditorAction => {
    return action.type === TYPE;
};

export const applyUpdateNodeText = (state: EditorState, id: Node['id'], text: FlattenedNode['text']) => {
    const { nodes } = state;
    const oldNode = findNode(nodes, id);

    if (!oldNode) {
        throw new Error(`Node ${id} not found.`);
    }

    const newState = {
        ...state,
        nodes: {
            ...nodes,
            byId: {
                ...nodes.byId,
                [id]: {
                    ...oldNode,
                    text,
                },
            },
        },
    };

    return newState;
};