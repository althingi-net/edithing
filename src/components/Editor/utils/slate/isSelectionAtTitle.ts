import { Editor } from 'slate';
import findListItemMarkedText from '../../Toolbar/utils/findListItemMarkedText';

const isSelectionAtTitle = (editor: Editor) => {
    return findListItemMarkedText(editor, 'title');
};

export default isSelectionAtTitle;