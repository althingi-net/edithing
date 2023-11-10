import { Descendant, Node, Path } from 'slate';
import { isListItemText } from '../../Slate';
import getParagraphId from './getParagraphId';

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
            const id = getParagraphId(root, path);
            const originId = getParagraphId(root, path, true);
            
            if (!id || !originId) {
                throw new Error('Could not get paragraph id');
            }
            
            const text = Node.string(node);

            list.push({
                id,
                originId,
                content: text,
                path,
            });
        }
    }

    return list;
};

export default flattenSlateParagraphs;