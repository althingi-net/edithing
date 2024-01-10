import { createEditorWithPlugins as createLawEditor } from 'law-document';
import { withReact } from 'slate-react';

const createEditorWithPlugins = () => {
    return withReact(createLawEditor());
};

export default createEditorWithPlugins;