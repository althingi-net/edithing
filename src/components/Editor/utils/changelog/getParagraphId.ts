import { Node, Path, Text } from "slate";
import findNode from "../findNode";
import getListItemHierarchy from "../slate/getListItemHierarchy";

/**
 * Return an id to identify a law paragraph down to the sentence level.
 * @param root Editor root node.
 * @param path Path to the lowest level node.
 * @returns Example: 'chapter-1.art-2.subart-1.sen-1' or null if the path is invalid.
 */
const getParagraphId = (root: Node, path: Path) => {
    const node = findNode(root, path);

    // Return null to signal that the node was not found and the path is not valid.
    if (!node) {
        return null;
    }

    const ids = getListItemHierarchy(root, path)
        .map(([listItem]) => `${listItem.meta?.type}-${listItem.meta?.nr}`);

    if (Text.isText(node)) {
        const tag = node.title ? 'title' : node.name ? 'name' : 'sen';

        if (node.nr) {
            ids.push(`${tag}-${node.nr}`);
        } else {
            ids.push(`${tag}`);
        }
    }

    return ids.join('.');
}

export default getParagraphId;