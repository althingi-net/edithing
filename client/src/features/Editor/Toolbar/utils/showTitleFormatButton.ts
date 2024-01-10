import { Editor } from 'slate';
import { isAtEdgeOf , isWithoutMarks , findTitleAndName, findListItemAtSelection } from 'law-document';

const showTitleFormatButton = (editor: Editor) => {
    const [, listItemPath] = findListItemAtSelection(editor) ?? [];
    if (!listItemPath) {
        return false;
    }
    
    const { name } = findTitleAndName(editor, listItemPath);

    if (
        isAtEdgeOf(editor, 'title', 'end', listItemPath)
        || (isAtEdgeOf(editor, 'sentence', 'start', listItemPath) && !name)
        || isAtEdgeOf(editor, 'name', 'start', listItemPath)
        || isWithoutMarks(editor)
    ) {
        return true;
    }

    return false;
};

export default showTitleFormatButton;