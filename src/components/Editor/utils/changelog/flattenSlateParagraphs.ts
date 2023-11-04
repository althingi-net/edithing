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
            let title = '';
            let name = '';

            node.children.forEach((child, index) => {
                if (Text.isText(child)) {
                    if (child.title) {
                        title = child.text;
                        return;
                    }

                    if (child.name) {
                        name = child.text;
                        return;
                    }
                }
            });

            if (title || name) {
                const id = getParagraphId(root, path);

                if (!id) {
                    throw new Error('Could not get paragraph id');
                }

                list.push({
                    id,
                    content: title + name,
                    path,
                });
            }

            node.children.forEach((child, index) => {
                if (Text.isText(child) && !child.title && !child.name) {
                    const childPath = [...path, index];
                    const id = getParagraphId(root, childPath);

                    if (!id) {
                        throw new Error('Could not get paragraph id');
                    }

                    list.push({
                        id,
                        content: child.text,
                        path: childPath,
                    });
                }
            });
        }
    }

    return list;
};

export default flattenSlateParagraphs;