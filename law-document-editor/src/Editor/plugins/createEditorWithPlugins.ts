import { createEditorWithPlugins as createLawEditor } from 'law-document';
import { withReact } from 'slate-react';

export const createEditorWithPlugins = () => {
    const editor = withReact(createLawEditor());

    return editor;
};