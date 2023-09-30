import { Editor, Node, Text } from "slate";

const getListItemTitle = (editor: Editor, path: number[]) => {
    const node = Node.get(editor, [...path, 0, 0]);

    if (Text.isText(node) && node.title) {
        return node.text;
    }

    return null;
}

export default getListItemTitle;