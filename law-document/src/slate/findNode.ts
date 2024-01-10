import { Node, Path } from 'slate';

export const findNode = (root: Node, path: Path) => {
    try {
        return Node.get(root, path);
    } catch (error) {
        return null;
    }
};