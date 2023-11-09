import { Descendant, Element, Node, Path, Text } from 'slate';
import { ElementType, ListItemText, isListItemText } from '../../Slate';
import getParagraphId from './getParagraphId';
import findTitleAndName from '../../Toolbar/utils/findTitleAndName';

export interface FlattenedParagraph {
    path: Path;
    content: string;
    id: string;
    originId: string;
}

const flattenSlateParagraphs = (nodes: Descendant[]): FlattenedParagraph[] => {
    const list: FlattenedParagraph[] = [];
    const root = { children: nodes } as Node;

    for (const [node, path] of Node.nodes(root)) {
        if (isListItemText(node)) {
            const { title, name } = extractTitleAndName(node);

            if (title || name) {
                const id = getParagraphId(root, path);
                const originId = getParagraphId(root, path, true);

                if (!id || !originId) {
                    throw new Error('Could not get paragraph id');
                }

                list.push({
                    id,
                    originId,
                    content: title + name,
                    path,
                });
            }

            node.children.forEach((child, index) => {
                if (Text.isText(child) && !child.title && !child.name) {
                    const childPath = [...path, index];
                    const id = getParagraphId(root, childPath);
                    const originId = getParagraphId(root, childPath, true);

                    if (!id || !originId) {
                        throw new Error('Could not get paragraph id');
                    }

                    list.push({
                        id,
                        originId,
                        content: child.text,
                        path: childPath,
                    });
                }
            });
        }
    }

    return list;
};

const extractTitleAndName = (node: ListItemText) => {
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

    return { title, name };
};

export default flattenSlateParagraphs;