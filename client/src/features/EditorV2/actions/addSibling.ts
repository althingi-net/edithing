import { EditorState, FlattenedNode } from '../EditorState';
import { createId } from '../state/createId';
import { findParentNode } from '../state/selectors/findParentNode';
import { findNode } from '../state/selectors/findNode';
import { Node } from '../Node';

const TYPE = 'ADD_SIBLING' as const;

export type AddSiblingEditorAction = ReturnType<typeof createAddSiblingAction>;

export const createAddSiblingAction = (id: Node['id']) => {
    return {
        type: TYPE,
        payload: { id },
    };
};

export const matchAddSibling = (action: any): action is AddSiblingEditorAction => {
    return action.type === TYPE;
};

export const applyAddSibling = (state: EditorState, id: Node['id']): Partial<EditorState> => {
    const { nodes, nodesById, rootNodes } = state;
    const node = findNode(nodesById, id);
    const parent = findParentNode(nodesById, id);

    if (!node) {
        throw new Error(`Node ${id} not found.`);
    }

    const newNode: FlattenedNode = {
        id: createId(),
        type: node.type,
        parent: parent?.id,
    };

    const newState = {
        nodes: [...nodes, newNode.id],
        nodesById: {
            ...nodesById,
            [newNode.id]: newNode,
        },
        rootNodes: rootNodes,
    };

    // update parent node
    if (parent) {
        const newParent: FlattenedNode = {
            ...parent,
            descendants: [...(parent.descendants || []), newNode.id],
        };

        newState.nodesById[parent.id] = newParent;
    }

    // add root node
    if (!parent) {
        newState.rootNodes = [...(rootNodes || []), newNode.id];
    }

    return newState;
};

