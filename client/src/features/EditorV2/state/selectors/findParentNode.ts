import { Node } from '../../Node';
import { EditorState } from '../../EditorState';
import { findNode } from './findNode';


export const findParentNode = (nodesById: EditorState['nodesById'], id: Node['id']) => {
    const node = findNode(nodesById, id);

    if (!node || !node.parent) {
        return;
    }

    return findNode(nodesById, node.parent);
};
