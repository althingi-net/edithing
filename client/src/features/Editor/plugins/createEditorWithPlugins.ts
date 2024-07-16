import { createEditorWithPlugins as createLawEditor } from 'law-document';
import { withReact } from 'slate-react';

const createEditorWithPlugins = () => {
    const editor = withReact(createLawEditor());

    return editor;
};

export default createEditorWithPlugins;