import { Descendant, Element, Node, Path, Text } from 'slate';
import { ElementType } from '../../Slate';
import getParagraphId from './getParagraphId';

export interface FlattenedParagraph {
    path: Path;
    content: string;
    id: string;
}

const flattenSlateParagraphs = (nodes: Descendant[]): FlattenedParagraph[] => {
    const list: { path: Path, content: string, id: string }[] = [];
    const root = { children: nodes } as Node;

    for (const [node, path] of Node.nodes(root)) {
        if (Element.isElementType(node, ElementType.LIST_ITEM_TEXT)) {
            node.children.forEach((child, index) => {
                if (Text.isText(child) && child.text) {
                    let text = child.text;
                    const childPath = [...path, index];

                    if (child.title || child.name) {
                        text += ' ';
                    }

                    const id = getParagraphId(root, childPath);

                    if (!id) {
                        throw new Error('Could not get paragraph id');
                    }

                    list.push({
                        id,
                        content: text,
                        path: childPath,
                    });
                }
            });
        }
    }

    return list;
};

export default flattenSlateParagraphs;