import { Node, Path } from 'slate';

const findNode = (root: Node, path: Path) => {
    try {
        return Node.get(root, path);
    } catch (error) {
        return null;
    }
};

export default findNode;