import { Editor } from 'slate';
import findListItemAtSelection from '../../utils/slate/findListItemAtSelection';
import isAtEdgeOf from './isAtEdgeOf';
import isWithoutMarks from './isWithoutMarks';
import findTitleAndName from './findTitleAndName';

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