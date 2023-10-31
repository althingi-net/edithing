import { Editor } from 'slate';
import findListItemAtSelection from '../../utils/slate/findListItemAtSelection';
import isAtEdgeOf from './isAtEdgeOf';
import isWithoutMarks from './isWithoutMarks';

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