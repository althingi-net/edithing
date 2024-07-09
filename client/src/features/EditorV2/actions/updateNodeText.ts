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

export const applyUpdateNodeText = (
    state: EditorState,
    id: Node['id'],
    text: FlattenedNode['text'],
): Partial<EditorState> => {
    const { nodesById } = state;
    const oldNode = findNode(nodesById, id);

    if (!oldNode) {
        throw new Error(`Node ${id} not found.`);
    }

    const newState = {
        nodesById: {
            ...nodesById,
            [id]: {
                ...oldNode,
                text,
            },
        },
    };

    return newState;
};