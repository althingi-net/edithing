import { Transforms } from 'slate';
import { MetaType } from '../Slate';
import createLawList from '../actions/createLawList';
import splitListItem from '../actions/splitListItem';
import createList from '../utils/slate/createList';
import createListItem from '../utils/slate/createListItem';
import createSelectionWithDistance from '../utils/slate/createSelectionWithDistance';
import createEditorWithPlugins from './createEditorWithPlugins';

test('split at end of title', () => {
    const editor = createEditorWithPlugins(); 
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: '1. Chapter' }, [
                createList(MetaType.ART, {}, [
                    createListItem(MetaType.ART, '1', { text: 'some text' }),
                ]),
            ]),
        ]),
    ];

    editor.selection = createSelectionWithDistance(editor, [0, 0, 0, 0], { startOffset: 10 });

    splitListItem(editor);

    expect(editor.events).toEqual([{
        id: 'chapter-1',
        originId: 'chapter-1',
        type: 'added',
    }, {
        id: 'chapter-2',
        originId: 'chapter-1',
        type: 'changed',
    }]);
});

test('add new entry as sibling', () => {
    const editor = createEditorWithPlugins(); 
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: '1. Chapter' }, [
                createList(MetaType.ART, {}, [
                    createListItem(MetaType.ART, '1', { text: 'some text' }),
                ]),
            ]),
            createListItem(MetaType.CHAPTER, '2', { title: '2. Chapter' }, [
                createList(MetaType.ART, {}, [
                    createListItem(MetaType.ART, '1', { text: 'some text' }),
                ]),
            ]),
        ]),
    ];

    editor.selection = createSelectionWithDistance(editor, [0, 0, 0, 0], { startOffset: 10 });

    createLawList(editor, MetaType.CHAPTER, [0, 0], { bumpVersionNumber: true });

    expect(editor.events).toEqual([{
        id: 'chapter-2',
        originId: '',
        type: 'added',
    }, {
        id: 'chapter-3',
        originId: 'chapter-2',
        type: 'changed',
    }]);
});

test('delete text', () => {
    const editor = createEditorWithPlugins(); 
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: '1. Chapter' }, [
                createList(MetaType.ART, {}, [
                    createListItem(MetaType.ART, '1', { text: 'some text' }),
                ]),
            ]),
            createListItem(MetaType.CHAPTER, '2', { title: '2. Chapter' }, [
                createList(MetaType.ART, {}, [
                    createListItem(MetaType.ART, '1', { text: 'some text' }),
                ]),
            ]),
        ]),
    ];

    editor.selection = createSelectionWithDistance(editor, [0, 0, 1, 0, 0, 0], { distance: 9 });
    Transforms.delete(editor);

    expect(editor.events).toEqual([{
        id: 'chapter-1.art-1',
        originId: 'chapter-1.art-1',
        type: 'changed',
    }]);
});

test('delete entry', () => {
    const editor = createEditorWithPlugins(); 
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: '1. Chapter' }, [
                createList(MetaType.ART, {}, [
                    createListItem(MetaType.ART, '1', { text: 'some text' }),
                    createListItem(MetaType.ART, '2', { text: 'some more text' }),
                ]),
            ]),
        ]),
    ];

    Transforms.removeNodes(editor, { at: [0, 0, 1, 0] });

    expect(editor.events).toEqual([{
        id: 'chapter-1.art-1',
        originId: 'chapter-1.art-2',
        type: 'changed',
    }]);
});


test('maintain originId across splits', () => {
    const editor = createEditorWithPlugins(); 
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: '1. Chapter', text: 'the first chapter' }),
        ]),
    ];
    editor.selection = createSelectionWithDistance(editor, [0, 0, 0, 1], { startOffset: 17 });
    
    splitListItem(editor);
    splitListItem(editor);
    
    expect(editor.events).toEqual([{
        id: 'chapter-1',
        originId: 'chapter-1',
        type: 'added',
    }, {
        id: 'chapter-2',
        originId: 'chapter-1',
        type: 'added',
    }, {
        id: 'chapter-3',
        originId: 'chapter-1',
        type: 'changed',
    }]);
});

test('maintain originId across splits with multiple original list items', () => {
    const editor = createEditorWithPlugins(); 
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli. ', text: 'the first chapter' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli. ', text: 'the second chapter' }),
        ]),
    ];
    editor.selection = createSelectionWithDistance(editor, [0, 0, 0, 1], { startOffset: 17 });
    
    splitListItem(editor);
    splitListItem(editor);
    
    expect(editor.events).toEqual([{
        id: 'chapter-1',
        originId: 'chapter-1',
        type: 'added',
    }, {
        id: 'chapter-2',
        originId: 'chapter-1',
        type: 'added',
    }, {
        id: 'chapter-3',
        originId: 'chapter-1',
        type: 'changed',
    }, {
        id: 'chapter-4',
        originId: 'chapter-2',
        type: 'changed',
    }]);
});

test('add new entry and then undo', () => {
    const editor = createEditorWithPlugins(); 
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: '1. Chapter' }),
        ]),
    ];

    createLawList(editor, MetaType.CHAPTER, [0, 0], { bumpVersionNumber: true });
    editor.undo();

    expect(editor.events).toEqual([]);
});

test('add new entry and then remove it', () => {
    const editor = createEditorWithPlugins(); 
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. Chapter ', name: 'name ' }, [
                createList(MetaType.ART, {}, [
                    createListItem(MetaType.ART, '1', { title: '1. gr.' }),
                    createListItem(MetaType.ART, '2', { title: '2. gr.' }, [
                        createList(MetaType.SUBART, {}, [
                            createListItem(MetaType.SUBART, '1', { text: 'some text of II. Chapter' }),
                        ]),
                    ]),
                ]),
            ]),
        ]),
    ];

    createLawList(editor, MetaType.ART, [0, 0, 1, 0], { bumpVersionNumber: true });
    Transforms.removeNodes(editor, { at: [0, 0, 1, 1] });

    expect(editor.events).toEqual([
        {
            id: 'chapter-1.art-2',
            originId: 'chapter-1.art-2',
            type: 'changed',
        },
    ]);
});

