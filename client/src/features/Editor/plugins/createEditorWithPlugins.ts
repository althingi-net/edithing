import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';
import withEvents from './withEvents';
import withLawParagraphs from './withLawParagraphs';

const createEditorWithPlugins = () => withLawParagraphs(
    withEvents(
        withHistory(
            withReact(createEditor())
        )
    )
);

export default createEditorWithPlugins;