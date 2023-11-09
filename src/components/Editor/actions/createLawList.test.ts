import { MetaType } from '../Slate';
import createEditorWithPlugins from '../plugins/createEditorWithPlugins';
import createList from '../utils/slate/createList';
import createListItem from '../utils/slate/createListItem';
import createLawList from './createLawList';

test('create new list item and increment following siblings', () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.', text: 'the first chapter' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.', text: 'the second chapter' }),
        ]),
    ];

    createLawList(editor, MetaType.CHAPTER, [0, 0], { bumpVersionNumber: true });

    editor.normalize({ force: true });

    expect(editor.children).toStrictEqual([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.', text: 'the first chapter' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.', originNr: '1' }),
            createListItem(MetaType.CHAPTER, '3', { title: 'III. kafli.', text: 'the second chapter', originNr: '2' }),
        ]),
    ]);
});

test('create new list item and do not increment following siblings', () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.', text: 'the first chapter' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.', text: 'the second chapter' }),
        ]),
    ];

    createLawList(editor, MetaType.CHAPTER, [0, 0], { bumpVersionNumber: false });

    editor.normalize({ force: true });

    expect(editor.children).toStrictEqual([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.', text: 'the first chapter' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.', originNr: '1' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.', text: 'the second chapter', originNr: '2' }),
        ]),
    ]);
});

test('nest art under chapter', () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.', text: 'the first chapter' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.', text: 'the second chapter' }),
        ]),
    ];

    createLawList(editor, MetaType.ART, [0, 0], { nested: true });

    editor.normalize({ force: true });

    expect(editor.children).toStrictEqual([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.', text: 'the first chapter' }, [
                createList(MetaType.ART, {}, [
                    createListItem(MetaType.ART, '1', { title: '1. gr. ' }),
                ]),
            ]),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.', text: 'the second chapter' }),
        ]),
    ]);
});

test('nest subart under art', () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, '1', { title: 'I. kafli.', text: 'the first chapter' }),
            createListItem(MetaType.ART, '2', { title: 'II. kafli.', text: 'the second chapter' }),
        ]),
    ];

    createLawList(editor, MetaType.SUBART, [0, 0], { nested: true });

    editor.normalize({ force: true });

    expect(editor.children).toStrictEqual([
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, '1', { title: 'I. kafli.', text: 'the first chapter' }, [
                createList(MetaType.SUBART, {}, [
                    createListItem(MetaType.SUBART, '1', { text: '', title: '' }),
                ]),
            ]),
            createListItem(MetaType.ART, '2', { title: 'II. kafli.', text: 'the second chapter' }),
        ]),
    ]);
});

test('nest numart under art', () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, '1', { title: 'I. kafli.', text: 'the first chapter' }),
            createListItem(MetaType.ART, '2', { title: 'II. kafli.', text: 'the second chapter' }),
        ]),
    ];

    createLawList(editor, MetaType.NUMART, [0, 0], { nested: true });

    editor.normalize({ force: true });

    expect(editor.children).toStrictEqual([
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, '1', { title: 'I. kafli.', text: 'the first chapter' }, [
                createList(MetaType.NUMART, {}, [
                    createListItem(MetaType.NUMART, '1', { text: '', title: '' }),
                ]),
            ]),
            createListItem(MetaType.ART, '2', { title: 'II. kafli.', text: 'the second chapter' }),
        ]),
    ]);
});

test('nest numart under numart', () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.NUMART, {}, [
            createListItem(MetaType.NUMART, '1', { title: 'I. kafli.', text: 'the first chapter' }),
            createListItem(MetaType.NUMART, '2', { title: 'II. kafli.', text: 'the second chapter' }),
        ]),
    ];

    createLawList(editor, MetaType.NUMART, [0, 0], { nested: true });

    editor.normalize({ force: true });

    expect(editor.children).toStrictEqual([
        createList(MetaType.NUMART, {}, [
            createListItem(MetaType.NUMART, '1', { title: 'I. kafli.', text: 'the first chapter' }, [
                createList(MetaType.NUMART, {}, [
                    createListItem(MetaType.NUMART, '1', { text: '', title: '' }),
                ]),
            ]),
            createListItem(MetaType.NUMART, '2', { title: 'II. kafli.', text: 'the second chapter' }),
        ]),
    ]);
});