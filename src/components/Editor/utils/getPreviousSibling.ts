import { Node, Editor, Path } from 'slate';

/**
 * Get the previous sibling of a node.
 */
const getPreviousSibling = (editor: Editor, path: Path): Node | null => {
    const parentPath = path.slice(0, -1);
    const siblingPath = path.slice(-1)[0] - 1;

    if (siblingPath < 0) {
        return null;
    }
  
    return Node.get(editor, [...parentPath, siblingPath]);
};

export default getPreviousSibling;