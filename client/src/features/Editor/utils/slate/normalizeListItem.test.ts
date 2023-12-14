import { MetaType } from '../../Slate';
import createEditorWithPlugins from '../../plugins/createEditorWithPlugins';
import createList from './createList';
import createListItem from './createListItem';
import normalizeListItem from './normalizeListItem';

test('missing title', () => {
    const listItem = createListItem(MetaType.CHAPTER, '1', { title: true, text: 'the first chapter' });
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            listItem,
        ]),
    ];

    normalizeListItem(editor, [0, 0]);

    expect(editor.children).toStrictEqual([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli. ', text: 'the first chapter' }),
        ]),
    ]);
});

test('empty title', () => {
    const listItem = createListItem(MetaType.CHAPTER, '1', { title: '', text: 'the first chapter' });
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            listItem,
        ]),
    ];

    normalizeListItem(editor, [0, 0]);

    expect(editor.children).toStrictEqual([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli. ', text: 'the first chapter' }),
        ]),
    ]);
});

test('missing title with sibling having one', () => {
    const listItem = createListItem(MetaType.CHAPTER, '2', { title: true, text: 'the second chapter' });
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.', text: 'the first chapter' }),
            listItem,
        ]),
    ];
    
    normalizeListItem(editor, [0, 1]);

    expect(editor.children).toStrictEqual([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.', text: 'the first chapter' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.', text: 'the second chapter' }),
        ]),
    ]);
});

test('missing listItemText node', () => {
    const listItem = createListItem(MetaType.CHAPTER, '2', { title: true });
    listItem.children = [];
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.', text: 'the first chapter' }),
            listItem,
        ]),
    ];
    
    normalizeListItem(editor, [0, 1]);

    expect(editor.children).toStrictEqual([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.', text: 'the first chapter' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.' }),
        ]),
    ]);
});