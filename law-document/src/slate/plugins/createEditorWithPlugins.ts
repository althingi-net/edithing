import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { withLawParagraphs } from './withLawParagraphs';

export const createEditorWithPlugins = () => {
    return withLawParagraphs(withHistory(createEditor()));
};