import { Editor, Text } from 'slate';

export const isWithoutMarks = (editor: Editor) => {
    const [entryWithMark] = editor.nodes<Text>({
        match: node => Text.isText(node) && Object.keys(node).length > 1,
    });

    return !entryWithMark;
};