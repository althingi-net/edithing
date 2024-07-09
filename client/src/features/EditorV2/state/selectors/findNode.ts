import { Node } from '../../Node';
import { EditorState } from '../../EditorState';


export const findNode = (nodesById: EditorState['nodesById'], id: Node['id']) => {
    const node = nodesById[id];

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!node) {
        return;
    }

    return node;
};
