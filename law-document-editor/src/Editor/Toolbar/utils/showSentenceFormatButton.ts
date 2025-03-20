import { isWithoutMarks , findTitleAndName , findListItemMarkedText, findListItemAtSelection , isAtEdgeOf } from 'law-document';
import { Editor } from 'slate';

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