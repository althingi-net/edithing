import { Event, createEditorWithPlugins as createLawEditor } from 'law-document';
import { withReact } from 'slate-react';

const createEditorWithPlugins = (events?: Event[]) => {
    const editor = withReact(createLawEditor());

    editor.events = events || [];

    return editor;
};

export default createEditorWithPlugins;