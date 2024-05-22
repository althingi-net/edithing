import { Node } from '../../Node';
import { EditorState } from '../../EditorState';


export const findNode = (nodes: EditorState['nodes'], id: Node['id']) => {
    const node = nodes.byId[id];

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!node) {
        return;
    }

    return node;
};
