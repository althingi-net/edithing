import { Editor, Node, Path } from 'slate';
import { isListItem } from '../../models/ListItem';
import { isListItemText } from '../../models/ListItemText';
import { isTitle } from '../../models/TextNode';

const getListItemTitle = (editor: Editor, path: Path) => {
    const listItem = Node.get(editor, path);

    if (!isListItem(listItem)) {
        return null;
    }

    const listItemText = listItem.children[0];
    if (!isListItemText(listItemText)) {
        return null;
    }
    const firstTextNode = listItemText.children[0];
    return isTitle(firstTextNode) ? firstTextNode.text : null;
};

export default getListItemTitle;