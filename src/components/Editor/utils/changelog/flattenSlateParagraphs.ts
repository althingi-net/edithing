import { Path, Node, Element, Text } from "slate";
import { ElementType } from "../../Slate";
import getParagraphId from "./getParagraphId";

export interface FlattenedParagraph {
    path: Path;
    content: string;
    id: string;
}

const flattenSlateParagraphs = (root: Node): FlattenedParagraph[] => {
    const list: { path: Path, content: string, id: string }[] = [];

    Array.from(Node.nodes(root)).forEach(([node, path]) => {
        if (Element.isElementType(node, ElementType.LIST_ITEM_TEXT)) {
            node.children.forEach((child, index) => {
                if (Text.isText(child) && child.text) {
                    let text = child.text;
                    const childPath = [...path, index];

                    if (child.title || child.name) {
                        text += ' ';
                    }

                    list.push({
                        id: getParagraphId(root, childPath),
                        content: text,
                        path: childPath,
                    });
                }
            });
        }
    });

    return list;
}

export default flattenSlateParagraphs;