import { withEvents , withLawParagraphs } from 'law-document';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';

const plugins = [
    withLawParagraphs,
    withEvents,
    withHistory,
    withReact,
];

const createEditorWithPlugins = () => {
    return plugins.reduce((editor, plugin) => plugin(editor), createEditor());
};

export default createEditorWithPlugins;