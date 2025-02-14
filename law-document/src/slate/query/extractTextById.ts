import { Editor, Descendant, Text } from 'slate';
import { LawEditor } from '../Slate';
import { getNodeByParagraphId } from './getNodeByParagraphId';

export const extractTextById = (editor: Editor, id: string) => {
    const node = getNodeByParagraphId(editor, id);
    const texts = node ? extractSlateText(node) : [];
    
    return texts;
};

const extractSlateText = (node: Descendant | LawEditor): string[] => {
    if (Text.isText(node)) {
        return [node.text];
    }

    return node.children.flatMap(extractSlateText);
};