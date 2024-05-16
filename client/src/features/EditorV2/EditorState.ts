import { v4 as uuidv4 } from 'uuid';
import { Node } from './Node';
import { Config } from './Config';
import { Schema } from './Schema';
export enum EditorAction {
    ADD_SIBLING = 'ADD_SIBLING',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    MOVE = 'MOVE',
}

type EditorActionType = AddSiblingEditorAction | UpdateEditorAction;

interface AddSiblingEditorAction {
    type: EditorAction.ADD_SIBLING;
    payload: {
        id: Node['id'];
    };
}
interface UpdateEditorAction {
    type: EditorAction.UPDATE;
    payload: {
        id: Node['id'];
        node: FlattenedNode;
    };
}

export interface FlattenedNode extends Omit<Node, 'children'> {
    parent?: Node['id'];
    descendants?: Node['id'][];
}

export interface EditorState {
    config: Config;
    schema: Schema;
    nodes: {
        ids: Node['id'][];
        byId: Record<Node['id'], FlattenedNode>;
    };
}

export function editorReducer(state: EditorState, action: EditorActionType) {
    const { type, payload } = action;

    console.log('action', type, payload);

    switch (type) {
    case EditorAction.ADD_SIBLING: return applyAddSibling(state, payload.id);
    default:
        throw new Error('Invalid action type.');
    }
}

const applyAddSibling = (state: EditorState, id: Node['id']) => {
    const { nodes } = state;
    const node = findNode(nodes, id);
    const parent = findParentNode(nodes, id);

    if (!node) {
        throw new Error(`Node ${id} not found.`);
    }

    const newNode: FlattenedNode = {
        id: createId(),
        type: node.type,
        parent: parent?.id,
    };

    const newState = {
        ...state,
        nodes: {
            ids: [...nodes.ids, newNode.id],
            byId: {
                ...nodes.byId,
                [newNode.id]: newNode,
            },
        },
    };

    // update parent node
    if (parent) {
        const newParent: FlattenedNode = {
            ...parent,
            descendants: [...(parent.descendants || []), newNode.id],
        };

        newState.nodes.byId[parent.id] = newParent;
    }

    return newState;
};

export const initializeEditorState = (data: { config?: Config, schema?: Schema, nodes: Node[] }): EditorState => {
    const { config, schema, nodes } = data;
    const flattenedNodes = flattenNodes(nodes);

    return {
        config: config || {},
        schema: schema || {},
        nodes: {
            ids: flattenedNodes.map((node) => node.id),
            byId: flattenedNodes.reduce((map, node) => {
                map[node.id] = node;
                return map;
            }, {} as Record<Node['id'], FlattenedNode>),
        },
    };
};

const flattenNodes = (nodes: Node[], parent?: Node['id']): FlattenedNode[] => {
    return nodes.reduce((list, node) => {
        const { children, ...nodeWithoutChildren } = node;
        const flattenedNode: FlattenedNode = {
            ...nodeWithoutChildren,
            parent,
            descendants: children ? children.map((child) => child.id) : [],
        };

        return [
            ...list,
            flattenedNode,
            ...(children ? flattenNodes(children, node.id) : []),
        ];
    }, [] as FlattenedNode[]);
};

const findNode = (nodes: EditorState['nodes'], id: Node['id']) => {
    const node = nodes.byId[id];

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!node) {
        return;
    }

    return node;
};

const findParentNode = (nodes: EditorState['nodes'], id: Node['id']) => {
    const node = findNode(nodes, id);
    
    if (!node || !node.parent) {
        return;
    }

    return findNode(nodes, node.parent);
};

const createId = () => {
    return uuidv4();
};



