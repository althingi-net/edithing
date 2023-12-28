import { Editor, Node, Path, Text } from 'slate';

export const getListItemName = (editor: Editor, path: Path) => {
    const textNodes = Array.from(Node.children(editor, [...path, 0]));
    const [name] = textNodes.find<[Text, Path]>(
        (node): node is [Text, Path] => 
            Text.isText(node[0]) && Boolean(node[0].name)
    ) ?? [];

    if (!name) {
        return '';
    }

    return name.text;
};