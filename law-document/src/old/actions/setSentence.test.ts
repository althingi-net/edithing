import { MetaType } from '../Slate';
import { createEditorWithPlugins } from '../plugins/createEditorWithPlugins';
import { createList } from '../slate/createList';
import { createListItem } from '../slate/createListItem';
import { createSelectionWithDistance } from '../slate/createSelectionWithDistance';
import { setSentence } from './setSentence';

test('merge selection into a single sentence', () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, '1', { title: 'title ', text: ['text', 'some more'] }),
        ]),
    ];

    editor.selection = createSelectionWithDistance(editor, [0, 0, 0, 0], { startOffset: 0, distance: 21 });

    setSentence(editor);
    editor.normalize({ force: true });

    expect(editor.children).toStrictEqual([
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, '1', { text: ['title textsome more'] }),
        ]),
    ]);
});

test('split 1 sentence into 3', () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, '1', { text: 'some random text' }),
        ]),
    ];

    editor.selection = createSelectionWithDistance(editor, [0, 0, 0, 0], { startOffset: 5, distance: 6 });

    setSentence(editor);
    editor.normalize({ force: true });

    expect(editor.children).toStrictEqual([
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, '1', { text: ['some ', 'random', ' text'] }),
        ]),
    ]);
});