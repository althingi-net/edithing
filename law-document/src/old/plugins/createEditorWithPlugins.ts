import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { withEvents } from './withEvents';
import { withLawParagraphs } from './withLawParagraphs';

export const createEditorWithPlugins = () => {
    return withEvents(withLawParagraphs(withHistory(createEditor())));
};