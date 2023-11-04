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
        type: 'added',
    }, {
        id: 'chapter-2',
        moved: true,
        type: 'changed',
        from: 'chapter-1',
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
        type: 'added',
    }, {
        id: 'chapter-3',
        moved: true,
        type: 'changed',
        from: 'chapter-2',
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
        id: 'chapter-1.art-1.sen-1',
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

    // Simulate user selecting the first paragraph and pressing delete.
    Transforms.delete(editor, { at: [0, 0, 1, 0, 0, 0], distance: 9 });

    expect(editor.events).toEqual([{
        id: 'chapter-1.art-1.sen-1',
        type: 'removed',
    }]);
});


// test('delete > add = changed', () => {
//     const editor = createEditorWithPlugins(); 
//     editor.children = [
//         createList(MetaType.CHAPTER, {}, [
//             createListItem(MetaType.CHAPTER, '1', { title: '1. Chapter' }, [
//                 createList(MetaType.ART, {}, [
//                     createListItem(MetaType.ART, '1', { text: 'some text' }),
//                     createListItem(MetaType.ART, '2', { text: 'some more text' }),
//                 ]),
//             ]),
//         ]),
//     ];

//     // Simulate user selecting the first paragraph and pressing delete.
//     Transforms.delete(editor, { at: [0, 0, 1, 0, 0, 0], distance: 9 });

//     // Simulate user typing 'a'.
//     editor.insertText('a', { at: [0, 0, 1, 0, 0, 0] });

//     expect(editor.events).toEqual([{
//         id: 'chapter-1.art-1.sen-1',
//         type: 'changed',
//     }]);
// });
// test('add > delete = delete');
// test('add > move = add');
