import { MetaType } from '../Slate';
import { createEditorWithPlugins } from '../plugins/createEditorWithPlugins';
import { createList } from '../transformations/createList';
import { createListItem } from '../transformations/createListItem';
import { createSelectionWithDistance } from '../transformations/createSelectionWithDistance';
import { splitListItem } from './splitListItem';

test('split and create new sibling list item', () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli. ', text: 'the first chapter' }),
        ]),
    ];
    editor.selection = createSelectionWithDistance(editor, [0, 0, 0, 1]);

    splitListItem(editor);
    editor.normalize({ force: true });

    expect(editor.children).toStrictEqual([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli. ' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli. ', text: 'the first chapter', originNr: '1' }),
        ]),
    ]);
});

test('move nested list with cursor at the end of listItemText', () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli. ', name: 'name' }, [
                createList(MetaType.ART, {}, [
                    createListItem(MetaType.ART, '1', { title: '1. gr.', name: 'Gildissvið. ' }, [
                        createList(MetaType.SUBART, {}, [
                            createListItem(MetaType.SUBART, '1', { text: ['Lög þessi gilda', 'Lögin gilda ekki'] }),
                        ]),
                    ]),
                ]),
            ]),
        ]),
    ];
    editor.selection = createSelectionWithDistance(editor, [0, 0, 0, 1], { startOffset: 4 });

    splitListItem(editor);
    editor.normalize({ force: true });

    expect(editor.children).toStrictEqual([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli. ', name: 'name' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli. ', originNr: '1' }, [
                createList(MetaType.ART, {}, [
                    createListItem(MetaType.ART, '1', { title: '1. gr.', name: 'Gildissvið. ' }, [
                        createList(MetaType.SUBART, {}, [
                            createListItem(MetaType.SUBART, '1', { text: ['Lög þessi gilda', 'Lögin gilda ekki'] }),
                        ]),
                    ]),
                ]),
            ]),
        ]),
    ]);
});


test('split nested list item and increase sibling numbers in title and meta', () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli. ', text: 'the first chapter' }, [
                createList(MetaType.ART, {}, [
                    createListItem(MetaType.ART, '1', { title: '1. gr.', name: 'first'/** cursor here */, text: 'the first article' }),
                    createListItem(MetaType.ART, '2', { title: '2. gr.', name: 'second', text: 'the second article' }),
                ]),
            ]),
        ]),
    ];
    editor.selection = createSelectionWithDistance(editor, [0, 0, 1, 0, 0, 1], { startOffset: 5 });

    splitListItem(editor);
    editor.normalize({ force: true });

    expect(editor.children).toStrictEqual([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli. ', text: 'the first chapter' }, [
                createList(MetaType.ART, {}, [
                    createListItem(MetaType.ART, '1', { title: '1. gr.', name: 'first', text: '' }),
                    createListItem(MetaType.ART, '2', { title: '2. gr.', text: 'the first article', originNr: '1' }),
                    createListItem(MetaType.ART, '3', { title: '3. gr.', name: 'second', text: 'the second article', originNr: '2' }),
                ]),
            ]),
        ]),
    ]);
});

test('split between title and name', () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli. ', name: 'first', text: 'the first chapter' }),
        ]),
    ];
    editor.selection = createSelectionWithDistance(editor, [0, 0, 0, 0], { startOffset: 10 });

    splitListItem(editor);
    editor.normalize({ force: true });

    expect(editor.children).toStrictEqual([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli. ', text: '' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli. ', name: 'first', text: 'the first chapter', originNr: '1' }),
        ]),
    ]);
});

test('split before title', () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli. ', name: 'first', text: 'the first chapter' }),
        ]),
    ];
    editor.selection = createSelectionWithDistance(editor, [0, 0, 0, 0]);

    splitListItem(editor);
    editor.normalize({ force: true });

    expect(editor.children).toStrictEqual([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli. ' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli. ', name: 'first', text: 'the first chapter', originNr: '1' }),
        ]),
    ]);
});

test('split at end of listItemText', () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli. ', name: 'first' }),
        ]),
    ];
    editor.selection = createSelectionWithDistance(editor, [0, 0, 0, 1], { startOffset: 5 });

    splitListItem(editor);
    editor.normalize({ force: true });

    expect(editor.children).toStrictEqual([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli. ', name: 'first' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli. ', originNr: '1' }),
        ]),
    ]);
});


test('repeatedly split to ensure consistent behavior', () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli. ', text: 'the first chapter' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli. ', text: 'the second chapter' }),
        ]),
    ];
    editor.selection = createSelectionWithDistance(editor, [0, 0, 0, 1]);

    splitListItem(editor);
    splitListItem(editor);
    splitListItem(editor);
    editor.normalize({ force: true });

    expect(editor.children).toStrictEqual([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli. ' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli. ', originNr: '1' }),
            createListItem(MetaType.CHAPTER, '3', { title: 'III. kafli. ', originNr: '1' }),
            createListItem(MetaType.CHAPTER, '4', { title: 'IV. kafli. ', text: 'the first chapter', originNr: '1' }),
            createListItem(MetaType.CHAPTER, '5', { title: 'V. kafli. ', text: 'the second chapter', originNr: '2' }),
        ]),
    ]);
});

