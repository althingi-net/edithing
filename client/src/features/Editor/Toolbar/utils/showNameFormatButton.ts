import { findListItemAtSelection, isAtEdgeOf, isWithoutMarks } from 'law-document';
import { Editor } from 'slate';

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