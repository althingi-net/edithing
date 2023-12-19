import { Editor, Node, Path, Range } from 'slate';
import { isListItemText } from '../../models/ListItemText';

const isSelectionAtEdgeOfListItemText = (editor: Editor, path: Path) => {
    const { selection } = editor;
    if (!selection) {
        return false;
    }

    if (!Range.isCollapsed(selection)) {
        return false;
    }

    const listItemText = Node.get(editor, path);

    if (!isListItemText(listItemText)) {
        throw new Error('isSelectionAtEdgeOfListItemText: node is not a ListItemText');
    }

    const [start, end] = Range.edges(selection);
    const isStart = start.offset === 0 && !Path.hasPrevious(start.path);

    const [lastTextNode, lastTextPath] = Node.last(editor, path);
    const isEnd = Path.equals(end.path, lastTextPath) && end.offset === Node.string(lastTextNode).length;

    return isStart || isEnd;
};

export default isSelectionAtEdgeOfListItemText;