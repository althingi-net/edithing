import { FlattenedNode, EditorState } from '../EditorState';
import { Node } from '../Node';
import { findNode } from '../state/selectors/findNode';

const TYPE = 'UPDATE_NODE' as const;

export type UpdateNodeEditorAction = ReturnType<typeof createUpdateNodeAction>;

export const createUpdateNodeAction = (id: Node['id'], node: FlattenedNode) => {
    return {
        type: TYPE,
        payload: { id, node },
    };
};

export const matchUpdateNode = (action: any): action is UpdateNodeEditorAction => {
    return action.type === TYPE;
};

export const applyUpdateNode = (state: EditorState, id: Node['id'], node: FlattenedNode): Partial<EditorState> => {
    const { nodesById } = state;
    const oldNode = findNode(nodesById, id);

    if (!oldNode) {
        throw new Error(`Node ${id} not found.`);
    }

    const newState = {
        nodesById: {
            ...nodesById,
            [id]: node,
        },
    };

    return newState;
};