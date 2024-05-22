import { Node } from '../../Node';
import { EditorState } from '../../EditorState';
import { findNode } from './findNode';


export const findParentNode = (nodes: EditorState['nodes'], id: Node['id']) => {
    const node = findNode(nodes, id);

    if (!node || !node.parent) {
        return;
    }

    return findNode(nodes, node.parent);
};
