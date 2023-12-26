import { createEditor } from 'slate';
import { withEvents } from './withEvents';
import { withLawParagraphs } from './withLawParagraphs';

const plugins = [
    withLawParagraphs,
    withEvents,
];

export const createEditorWithPlugins = () => {
    return plugins.reduce((editor, plugin) => plugin(editor), createEditor());
};