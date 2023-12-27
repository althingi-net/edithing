import { createEditor } from 'slate';
import { withEvents } from './withEvents';
import { withLawParagraphs } from './withLawParagraphs';
import { withHistory } from 'slate-history';

export const createEditorWithPlugins = () => {
    return withEvents(withLawParagraphs(withHistory(createEditor())));
};