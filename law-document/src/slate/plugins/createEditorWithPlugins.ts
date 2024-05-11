import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { withEvents } from './withEvents';
import { withLawParagraphs } from './withLawParagraphs';

export const createEditorWithPlugins = (options = { events: true }) => {
    if (!options.events) {
        return withLawParagraphs(withHistory(createEditor()));
    }

    return withEvents(withLawParagraphs(withHistory(createEditor())));
};