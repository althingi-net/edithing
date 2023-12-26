import { Node, Editor, Path, NodeEntry } from 'slate';

/**
 * Get the previous sibling of a node.
 */
export const getPreviousSibling = (editor: Editor, path: Path): NodeEntry | null => {
    const parentPath = path.slice(0, -1);
    const siblingIndex = path.slice(-1)[0] - 1;

    if (siblingIndex < 0) {
        return null;
    }
  
    const siblingPath = [...parentPath, siblingIndex];
    const node = Node.get(editor, siblingPath);
    
    return [node, siblingPath];
};