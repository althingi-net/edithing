import { Node, Path, Text } from "slate";
import { log } from "../../../../logger";
import getListItemHierarchy from "../slate/getListItemHierarchy";


const getParagraphId = (root: Node, path: Path) => {
    try {
        const ids = getListItemHierarchy(root, path)
            .map(([listItem]) => `${listItem.meta?.type}-${listItem.meta?.nr}`);

        const node = Node.get(root, path);

        if (Text.isText(node)) {
            const tag = node.title ? 'title' : node.name ? 'name' : 'sen';

            if (node.nr) {
                ids.push(`${tag}-${node.nr}`);
            } else {
                ids.push(`${tag}`);
            }
        }

        return ids.join('.');
    } catch (error) {
        log('editor state before error', JSON.stringify(root, null, 2));
        throw error;
    }
}

export default getParagraphId;