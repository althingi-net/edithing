import { MetaType } from '../Slate';
import { createEditorWithPlugins } from '../plugins/createEditorWithPlugins';
import { createList } from '../transformations/createList';
import { Options, createListItem } from '../transformations/createListItem';
import { createSelectionWithDistance } from '../transformations/createSelectionWithDistance';
import { setName } from './setName';


const testSetName = (metaInput: Options, expectedMeta: Options, selectionOffset: number, selectionStart = 0) => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, '1', metaInput),
        ]),
    ];

    editor.selection = createSelectionWithDistance(editor, [0, 0, 0, 0], { startOffset: selectionStart, distance: selectionOffset });

    setName(editor);
    editor.normalize({ force: true });

    expect(editor.children).toStrictEqual([
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, '1', expectedMeta),
        ]),
    ]);
};

test('beginning of a list item text without prior title or name', () => {
    testSetName(
        { text: 'the first chapter' },
        { name: 'the first', text: ' chapter' },
        9,
    );
});

test('no change when calling on existing name', () => {
    testSetName(
        { name: 'the first', text: ' chapter' },
        { name: 'the first', text: ' chapter' },
        9,
    );
});

test('merge previous name with part of title', () => {
    testSetName(
        { title: 'the first', name: 'name', text: ' chapter' },
        { title: 'the fir', name: 'stname', text: ' chapter' },
        4,
        7,
    );
});

test('merge partly selected title with part of name', () => {
    testSetName(
        { title: 'the first', name: 'name', text: ' chapter' },
        { title: 'the f', name: 'irstname', text: ' chapter' },
        6,
        5
    );
});

test('merge entire title into name', () => {
    testSetName(
        { title: 'title', name: 'the first chapter', text: 'text' },
        { name: 'titlethe first chapter', text: 'text' },
        23,
    );
});

test('change title to name', () => {
    testSetName(
        { title: 'name', text: 'the first chapter' },
        { name: 'name', text: 'the first chapter' },
        4,
    );
});
