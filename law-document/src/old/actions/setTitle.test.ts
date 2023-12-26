import { MetaType } from '../Slate';
import { createEditorWithPlugins } from '../plugins/createEditorWithPlugins';
import { createList } from '../slate/createList';
import { Options, createListItem } from '../slate/createListItem';
import { createSelectionWithDistance } from '../slate/createSelectionWithDistance';
import { setTitle } from './setTitle';

const testSetTitle = (metaInput: Options, expectedMeta: Options, selectionOffset: number, selectionStart = 0) => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, '1', metaInput),
        ]),
    ];

    editor.selection = createSelectionWithDistance(editor, [0, 0, 0, 0], { startOffset: selectionStart, distance: selectionOffset });

    setTitle(editor);
    editor.normalize({ force: true });

    expect(editor.children).toStrictEqual([
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, '1', expectedMeta),
        ]),
    ]);
};

test('beginning of a list item text without prior title or name', () => {
    testSetTitle(
        { text: 'the first chapter' },
        { title: 'the first', text: ' chapter' },
        9,
    );
});

test('no change when calling on existing title', () => {
    testSetTitle(
        { title: 'the first', text: ' chapter' },
        { title: 'the first', text: ' chapter' },
        9,
    );
});

test('merge previous title with part of name', () => {
    testSetTitle(
        { title: 'the first', name: 'name', text: ' chapter' },
        { title: 'the firstna', name: 'me', text: ' chapter' },
        12,
    );
});

test('merge partly selected title with part of name', () => {
    testSetTitle(
        { title: 'the first', name: 'name', text: ' chapter' },
        { title: 'the firstna', name: 'me', text: ' chapter' },
        8,
        4
    );
});

test('merge entire name into title', () => {
    testSetTitle(
        { title: 'title', name: 'the first chapter', text: 'text' },
        { title: 'titlethe first chapter', text: 'text' },
        23,
    );
});

test('change name to title', () => {
    testSetTitle(
        { name: 'name', text: 'the first chapter' },
        { title: 'name', text: 'the first chapter' },
        4,
    );
});
