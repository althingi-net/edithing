import { Editor } from 'slate';
import { MetaType } from '../../Slate';
import createEditorWithPlugins from '../../plugins/createEditorWithPlugins';
import createList from './createList';
import createListItem from './createListItem';
import decrementFollowingSiblings from './decrementFollowingSiblings';
import incrementFollowingSiblings from './incrementFollowingSiblings';

test('one sibling', () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.', text: 'the first chapter' }),
            createListItem(MetaType.CHAPTER, '3', { title: 'III. kafli.', text: 'the second chapter' }),
        ]),
    ];

    decrementFollowingSiblings(editor, [0, 0]);
    editor.normalize({ force: true });

    expect(editor.children).toStrictEqual([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.', text: 'the first chapter' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.', text: 'the second chapter', originNr: '3' }),
        ]),
    ]);
});

test('two sibling', () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.' }),
            createListItem(MetaType.CHAPTER, '3', { title: 'III. kafli.' }),
            createListItem(MetaType.CHAPTER, '4', { title: 'IV. kafli.' }),
        ]),
    ];

    decrementFollowingSiblings(editor, [0, 0]);
    editor.normalize({ force: true });

    expect(editor.children).toStrictEqual([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.', originNr: '3' }),
            createListItem(MetaType.CHAPTER, '3', { title: 'III. kafli.', originNr: '4' }),
        ]),
    ]);
});

test('inbetween', () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.' }),
            createListItem(MetaType.CHAPTER, '4', { title: 'IV. kafli.' }),
        ]),
    ];

    decrementFollowingSiblings(editor, [0, 1]);
    editor.normalize({ force: true });

    expect(editor.children).toStrictEqual([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.' }),
            createListItem(MetaType.CHAPTER, '3', { title: 'III. kafli.', originNr: '4' }),
        ]),
    ]);
});

test('retain selection on initiating node', async () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.' }),
            createListItem(MetaType.CHAPTER, '4', { title: 'IV. kafli.' }),
        ]),
    ];

    editor.selection = Editor.range(editor, [0, 1, 0]);
    decrementFollowingSiblings(editor, [0, 1]);
    editor.normalize({ force: true });

    const expectedRange = Editor.range(editor, [0, 1, 0]);
    expectedRange.anchor.offset = 0;
    expectedRange.focus.offset = 10;

    expect(editor.selection).toEqual(expectedRange);
});

test('decrease & increase', () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.' }),
            createListItem(MetaType.CHAPTER, '3', { title: 'III. kafli.' }),
            createListItem(MetaType.CHAPTER, '4', { title: 'IV. kafli.' }),
        ]),
    ];

    decrementFollowingSiblings(editor, [0, 0]);
    incrementFollowingSiblings(editor, [0, 0]);
    editor.normalize({ force: true });

    expect(editor.children).toStrictEqual([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.' }),
            createListItem(MetaType.CHAPTER, '3', { title: 'III. kafli.' }),
            createListItem(MetaType.CHAPTER, '4', { title: 'IV. kafli.' }),
        ]),
    ]);
});