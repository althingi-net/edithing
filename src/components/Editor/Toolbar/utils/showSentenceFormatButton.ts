import { Editor } from 'slate';
import findListItemAtSelection from '../../utils/slate/findListItemAtSelection';
import isAtEdgeOf from './isAtEdgeOf';
import isWithoutMarks from './isWithoutMarks';
import findTitleAndName from './findTitleAndName';
import findListItemMarkedText from './findListItemMarkedText';

const showSentenceFormatButton = (editor: Editor) => {
    const [, listItemPath] = findListItemAtSelection(editor) ?? [];
    if (!listItemPath || !editor.selection) {
        return false;
    }
    
    const { name } = findTitleAndName(editor, listItemPath);

    if (
        isAtEdgeOf(editor, 'name', 'end', listItemPath)
        || (isAtEdgeOf(editor, 'title', 'end', listItemPath) && !name)
        || findListItemMarkedText(editor, 'sentence', editor.selection)
        || isWithoutMarks(editor)
    ) {
        return true;
    }

    return false;
};

export default showSentenceFormatButton;