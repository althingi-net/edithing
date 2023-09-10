import { Path, Node, Element } from "slate";
import { ElementType } from "../components/Editor/Slate";
import getParagraphId from "./getParagraphId";

const flattenSlateParagraphs = (root: Node) => {
    const list: { path: Path, content: string, id: string }[] = [];

    Array.from(Node.nodes(root)).forEach(([node, path]) => {
        if (Element.isElementType(node, ElementType.LIST_ITEM_TEXT)) {
            const text = Node.string(node);

            if (text) {
                list.push({
                    id: getParagraphId(root, path),
                    content: text,
                    path,
                });
            }
        }
        console.log(node);
    });

    return list;
}

export default flattenSlateParagraphs;