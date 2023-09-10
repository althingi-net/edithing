import { Path, Node, Element } from "slate";
import { ListItem, ElementType } from "../components/Editor/Slate";

const getParagraphId = (root: Node, path: Path) => {
    return Array.from(Node.ancestors(root, path))
        .map(([node]) => {
            if (Element.isElementType<ListItem>(node, ElementType.LIST_ITEM)) {
                return `${node.meta.type}-${node.meta.nr}`;
            }

            return '';
        })
        .filter(Boolean)
        .join('.');
}

export default getParagraphId;