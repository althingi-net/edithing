import { Editor } from 'slate';
import { isAtEdgeOf, isWithoutMarks, findListItemAtSelection } from 'law-document';

const showNameFormatButton = (editor: Editor) => {
    const [, listItemPath] = findListItemAtSelection(editor) ?? [];
    if (!listItemPath) {
        return false;
    }

    if (
        isAtEdgeOf(editor, 'title', 'end', listItemPath)
        || isAtEdgeOf(editor, 'sentence', 'start', listItemPath)
        || isWithoutMarks(editor)
    ) {
        return true;
    }

    return false;
};

export default showNameFormatButton;