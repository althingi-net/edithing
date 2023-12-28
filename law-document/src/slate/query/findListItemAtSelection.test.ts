import { MetaType } from '../Slate';
import { createEditorWithPlugins } from '../plugins/createEditorWithPlugins';
import { createList } from '../transformations/createList';
import { createListItem } from '../transformations/createListItem';
import { findListItemAtSelection } from './findListItemAtSelection';

const firstListItem = createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.', text: 'the first chapter' });
const secondListItem = createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.', text:  'the second chapter' });

const editor = createEditorWithPlugins();
editor.children = [
    createList(MetaType.CHAPTER, {}, [
        firstListItem,
        secondListItem,
    ]),
];

test('selection in text node', () => {
    editor.selection = {
        anchor: {
            path: [0, 1, 0, 0],
            offset: 0,
        },
        focus: {
            path: [0, 1, 0, 0],
            offset: 0,
        },
    };

    const result = findListItemAtSelection(editor, MetaType.CHAPTER);

    expect(result).toStrictEqual([
        secondListItem,
        [0, 1],
    ]);
});

test('selection in text node without specified tag', () => {
    editor.selection = {
        anchor: {
            path: [0, 1, 0, 0],
            offset: 0,
        },
        focus: {
            path: [0, 1, 0, 0],
            offset: 0,
        },
    };

    const result = findListItemAtSelection(editor);

    expect(result).toStrictEqual([
        secondListItem,
        [0, 1],
    ]);
});

test('selection in list item', () => {
    editor.selection = {
        anchor: {
            path: [0, 1],
            offset: 0,
        },
        focus: {
            path: [0, 1],
            offset: 0,
        },
    };

    const result = findListItemAtSelection(editor, MetaType.CHAPTER);

    expect(result).toStrictEqual([
        secondListItem,
        [0, 1],
    ]);
});

test('selection in list returns last list item', () => {
    editor.selection = {
        anchor: {
            path: [0],
            offset: 0,
        },
        focus: {
            path: [0],
            offset: 0,
        },
    };

    const result = findListItemAtSelection(editor, MetaType.CHAPTER);

    expect(result).toStrictEqual([
        secondListItem,
        [0, 1],
    ]);
});

test('selection in editor return null', () => {
    editor.selection = {
        anchor: {
            path: [],
            offset: 0,
        },
        focus: {
            path: [],
            offset: 0,
        },
    };

    const result = findListItemAtSelection(editor, MetaType.CHAPTER);

    expect(result).toBeNull();
});

test('return null if cant find anything', () => {
    editor.selection = {
        anchor: {
            path: [0],
            offset: 0,
        },
        focus: {
            path: [0],
            offset: 0,
        },
    };

    const result = findListItemAtSelection(editor, MetaType.ART);

    expect(result).toBeNull();
});

test('selection across two list items will return the last one', () => {
    editor.selection = {
        anchor: {
            path: [0, 0],
            offset: 0,
        },
        focus: {
            path: [0, 1],
            offset: 0,
        },
    };

    const result = findListItemAtSelection(editor, MetaType.CHAPTER);

    expect(result).toStrictEqual([
        secondListItem,
        [0, 1],
    ]);
});