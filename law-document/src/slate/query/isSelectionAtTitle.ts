import { Editor } from 'slate';
import { findListItemMarkedText } from './findListItemMarkedText';

export const isSelectionAtTitle = (editor: Editor) => {
    return findListItemMarkedText(editor, 'title');
};