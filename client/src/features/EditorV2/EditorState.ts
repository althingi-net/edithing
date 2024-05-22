import { v4 as uuidv4 } from 'uuid';
import { Config } from './Config';
import { Node } from './Node';
import { Schema } from './Schema';

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
        roots?: Node['id'][];
    };
}

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
            roots: flattenedNodes.filter((node) => !node.parent).map((node) => node.id),
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

export const createId = () => {
    return uuidv4();
};



