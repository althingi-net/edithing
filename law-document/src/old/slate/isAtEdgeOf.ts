import { Editor, Path, Range } from 'slate';
import { findListItemMarkedText } from './findListItemMarkedText';

export const isAtEdgeOf = (
    editor: Editor,
    type: 'title' | 'name' | 'sentence',
    edge: 'start' | 'end',
    listItemPath: Path,
) => {
    const selection = editor.selection;
    if (!selection) {
        return false;
    }

    const entry = findListItemMarkedText(editor, type, listItemPath);
    if (!entry) {
        return false;
    }

    const [, path] = entry;
    
    if (edge === 'start') {
        const start = Editor.start(editor, path);
        return Range.includes(selection, start);
    }
    
    const end = Editor.end(editor, path);
    return Range.includes(selection, end);
};