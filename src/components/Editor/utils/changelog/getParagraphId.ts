import { Node, Path, Text } from "slate";
import { isListItem } from "../../Slate";

const getParagraphId = (root: Node, path: Path) => {
    const ids =  Array.from(Node.ancestors(root, path))
        .map(([node]) => {
            if (isListItem(node)) {
                return `${node.meta.type}-${node.meta.nr}`;
            }

            return '';
        })
        .filter(Boolean);

    const node = Node.get(root, path);

    if (isListItem(node)) {
        ids.push(`${node.meta.type}-${node.meta.nr}`);
    }

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