import { Editor, Node, Path } from 'slate';
import { isListItem } from '../../elements/ListItem';
import { isListItemText } from '../../elements/ListItemText';
import { isTitle } from '../../elements/TextNode';

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