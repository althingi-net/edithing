import { Editor, Node, Path, Text } from "slate";
import { isListItem, isListItemText } from "../../Slate";

const getListItemTitle = (editor: Editor, path: Path) => {
    const listItem = Node.get(editor, path);

    if (!isListItem(listItem)) {
        return null;
    }

    let listItemText = listItem.children[0];
    if (!isListItemText(listItemText)) {
        return null;
    }
    const firstTextNode = listItemText.children[0];
    return Text.isText(firstTextNode) && firstTextNode.title ? firstTextNode.text : null;
}

export default getListItemTitle;