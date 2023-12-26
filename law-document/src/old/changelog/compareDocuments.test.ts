import { Descendant, Transforms } from 'slate';
import { createEditorWithPlugins } from '../plugins/createEditorWithPlugins';
import { createList } from '../slate/createList';
import { createListItem } from '../slate/createListItem';
import { createSelectionWithDistance } from '../slate/createSelectionWithDistance';
import { compareDocuments } from './compareDocuments';
import { MetaType } from '../Slate';
import { createLawList } from '../actions/createLawList';
import { splitListItem } from '../actions/splitListItem';

const setupEditor = (document: Descendant[]) => {
    const editor = createEditorWithPlugins(); 
    editor.children = document;

    const originalDocument = document;

    return { editor, originalDocument };
};

test('Add new chapter via enter', () => {
    const { editor, originalDocument } = setupEditor([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: '1. Chapter' }, [
                createList(MetaType.ART, {}, [
                    createListItem(MetaType.ART, '1', { text: 'some text' }),
                ]),
            ]),
        ]),
    ]); 

    editor.selection = createSelectionWithDistance(editor, [0, 0, 0, 0], { startOffset: 10 });

    splitListItem(editor);

    const output = compareDocuments(editor, originalDocument);

    expect(output).toStrictEqual([{
        id: 'chapter-1',
        text: '1. Chapter',
        type: 'added',
    }, {
        id: 'chapter-2',
        type: 'changed',
        text: 'II. kafli. ',
        changes: [
            [
                -1,
                '1. Chapter',
            ],
            [
                1,
                'II. kafli. ',
            ],
        ],
    }]);
});

test('Change title', () => {
    const { editor, originalDocument } = setupEditor([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: '1. Chapter' }, [
                createList(MetaType.ART, {}, [
                    createListItem(MetaType.ART, '1', { text: 'some text' }),
                ]),
            ]),
        ]),
    ]);

    Transforms.insertText(editor, 'sd', { at: { path: [0, 0, 0, 0], offset: 10 } });
    
    const output = compareDocuments(editor, originalDocument);
    expect(output).toStrictEqual([{
        id: 'chapter-1',
        type: 'changed',
        text: '1. Chaptersd',
        changes: [
            [
                0,
                '1. Chapter',
            ],
            [
                1,
                'sd',
            ],
        ],
    }]);
});

test('Change name', () => {
    const { editor, originalDocument } = setupEditor([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: '1. Chapter ', name: 'name ' }, [
                createList(MetaType.ART, {}, [
                    createListItem(MetaType.ART, '1', { text: 'some text' }),
                ]),
            ]),
        ]),
    ]);

    Transforms.insertText(editor, 'sd', { at: { path: [0, 0, 0, 1], offset: 5 } });

    const output = compareDocuments(editor, originalDocument);
    expect(output).toStrictEqual([{
        id: 'chapter-1',
        type: 'changed',
        text: '1. Chapter name sd',
        changes: [
            [
                0,
                '1. Chapter name ',
            ],
            [
                1,
                'sd',
            ],
        ],
    }]);
});

test('Change text', () => {
    const { editor, originalDocument } = setupEditor([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: '1. Chapter ', name: 'name ' }, [
                createList(MetaType.ART, {}, [
                    createListItem(MetaType.ART, '1', { text: 'some text' }),
                ]),
            ]),
        ]),
    ]);

    Transforms.insertText(editor, ' sd', { at: { path: [0, 0, 1, 0, 0, 0], offset: 9 } });

    const output = compareDocuments(editor, originalDocument);
    expect(output).toStrictEqual([{
        id: 'chapter-1.art-1',
        type: 'changed',
        text: 'some text sd',
        changes: [
            [
                0,
                'some text',
            ],
            [
                1,
                ' sd',
            ],
        ],
    }]);
});

test('remove text', () => {
    const { editor, originalDocument } = setupEditor([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: '1. Chapter ', name: 'name ' }, [
                createList(MetaType.ART, {}, [
                    createListItem(MetaType.ART, '1', { text: 'some text' }),
                ]),
            ]),
        ]),
    ]);

    const at = createSelectionWithDistance(editor, [0, 0, 1, 0, 0, 0], { startOffset: 0, distance: 9 });
    Transforms.delete(editor, { at });

    const output = compareDocuments(editor, originalDocument);
    expect(output).toStrictEqual([{
        id: 'chapter-1.art-1',
        type: 'deleted',
        text: '',
        changes: [
            [
                -1,
                'some text',
            ]
        ],
    }]);
});

test('sort by id ascending', () => {
    const { editor, originalDocument } = setupEditor([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: '1. Chapter ', name: 'name ' }, [
                createList(MetaType.ART, {}, [
                    createListItem(MetaType.ART, '1', { text: 'some text' }),
                ]),
            ]),
        ]),
    ]);

    const at = createSelectionWithDistance(editor, [0, 0, 1, 0, 0, 0], { startOffset: 0, distance: 9 });
    Transforms.delete(editor, { at });
    Transforms.insertText(editor, 'sd', { at: { path: [0, 0, 0, 1], offset: 5 } });

    const output = compareDocuments(editor, originalDocument);
    expect(output).toStrictEqual([{
        id: 'chapter-1',
        type: 'changed',
        text: '1. Chapter name sd',
        changes: [
            [
                0,
                '1. Chapter name ',
            ],
            [
                1,
                'sd',
            ],
        ],
    }, {
        id: 'chapter-1.art-1',
        type: 'deleted',
        text: '',
        changes: [
            [
                -1,
                'some text',
            ]
        ],
    }]);
});

test('moved nested items dont change and dont appear as new when they are edited', () => {
    const { editor, originalDocument } = setupEditor([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: '1. Chapter' }, [
                createList(MetaType.ART, {}, [
                    createListItem(MetaType.ART, '1', { text: 'some text' }),
                    createListItem(MetaType.ART, '2', { text: 'some other text' }),
                ]),
            ]),
        ]),
    ]); 

    editor.selection = createSelectionWithDistance(editor, [0, 0, 0, 0], { startOffset: 10 });

    splitListItem(editor);
    Transforms.insertText(editor, ' sd', { at: { path: [0, 1, 1, 1, 0, 0], offset: 15 } });

    const output = compareDocuments(editor, originalDocument);

    expect(output).toStrictEqual([{
        id: 'chapter-1',
        text: '1. Chapter',
        type: 'added',
    }, {
        id: 'chapter-2',
        type: 'changed',
        text: 'II. kafli. ',
        changes: [
            [
                -1,
                '1. Chapter',
            ],
            [
                1,
                'II. kafli. ',
            ],
        ],
    }, {
        id: 'chapter-2.art-2',
        type: 'changed',
        text: 'some other text sd',
        changes: [
            [
                0,
                'some other text',
            ],
            [
                1,
                ' sd',
            ],
        ],
    }]);
});

test('repeatedly split to ensure consistent behavior', () => {
    const { editor, originalDocument } = setupEditor([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli. ', text: 'the first chapter' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli. ', text: 'the second chapter' }, [
                createList(MetaType.ART, {}, [
                    createListItem(MetaType.ART, '1', { text: 'some text' }),
                    createListItem(MetaType.ART, '2', { text: 'some other text' }),
                ]),
            ]),
        ]),
    ]); 
    editor.selection = createSelectionWithDistance(editor, [0, 0, 0, 1]);
    
    Transforms.insertText(editor, ' sd', { at: { path: [0, 1, 1, 1, 0, 0], offset: 15 } });
    splitListItem(editor);
    splitListItem(editor);
    splitListItem(editor);
    
    const output = compareDocuments(editor, originalDocument);

    expect(output).toStrictEqual([
        {
            id: 'chapter-1',
            type: 'added',
            text: 'I. kafli. ',
        },
        {
            id: 'chapter-2',
            type: 'added',
            text: 'II. kafli. ',
        },
        {
            id: 'chapter-3',
            type: 'added',
            text: 'III. kafli. ',
        },
        {
            id: 'chapter-4',
            type: 'changed',
            text: 'IV. kafli. the first chapter',
            changes: [
                [
                    0,
                    'I',
                ],
                [
                    1,
                    'V',
                ],
                [
                    0,
                    '. kafli. the first chapter',
                ],
            ],
        },
        {
            id: 'chapter-5',
            type: 'changed',
            text: 'V. kafli. the second chapter',
            changes: [
                [
                    -1,
                    'II',
                ],
                [
                    1,
                    'V',
                ],
                [
                    0,
                    '. kafli. the second chapter',
                ],
            ],
        },
        {
            id: 'chapter-5.art-2',
            type: 'changed',
            text: 'some other text sd',
            changes: [
                [
                    0,
                    'some other text',
                ],
                [
                    1,
                    ' sd',
                ],
            ],
        },
    ]);
});

test('remove list item', () => {
    const { editor, originalDocument } = setupEditor([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. Chapter ', name: 'name ' }, [
                createList(MetaType.ART, {}, [
                    createListItem(MetaType.ART, '1', { text: 'some text of I. Chapter' }),
                ]),
            ]),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. Chapter ', name: 'name ' }, [
                createList(MetaType.ART, {}, [
                    createListItem(MetaType.ART, '1', { text: 'some text of II. Chapter' }),
                ]),
            ]),
            createListItem(MetaType.CHAPTER, '3', { title: 'III. Chapter ', name: 'name ' }, [
                createList(MetaType.ART, {}, [
                    createListItem(MetaType.ART, '1', { text: 'some text of III. Chapter' }),
                ]),
            ]),
        ]),
    ]);

    const at = createSelectionWithDistance(editor, [0, 1, 0, 0], { startOffset: 0, distance: 43 });
    Transforms.delete(editor, { at });

    const output = compareDocuments(editor, originalDocument);
    expect(output).toStrictEqual([
        {
            id: 'chapter-2',
            type: 'deleted',
            text: '',
            changes: [
                [
                    -1,
                    'II. Chapter name ',
                ],
            ],
        },
        {
            id: 'chapter-2.art-1',
            type: 'deleted',
            text: 'some text of II. Chapter',
        },
    ]);
});

// test('remove list item and add new one in same place', () => {
//     const { editor, originalDocument } = setupEditor([
//         createList(MetaType.CHAPTER, {}, [
//             createListItem(MetaType.CHAPTER, '1', { title: 'I. Chapter ', name: 'name ' }, [
//                 createList(MetaType.ART, {}, [
//                     createListItem(MetaType.ART, '1', { text: 'some text of I. Chapter' }),
//                 ]),
//             ]),
//             createListItem(MetaType.CHAPTER, '2', { title: 'II. Chapter ', name: 'name ' }, [
//                 createList(MetaType.ART, {}, [
//                     createListItem(MetaType.ART, '1', { text: 'some text of II. Chapter' }),
//                 ]),
//             ]),
//             createListItem(MetaType.CHAPTER, '3', { title: 'III. Chapter ', name: 'name ' }, [
//                 createList(MetaType.ART, {}, [
//                     createListItem(MetaType.ART, '1', { text: 'some text of III. Chapter' }),
//                 ]),
//             ]),
//         ]),
//     ]);

//     const at = createSelectionWithDistance(editor, [0, 1, 0, 0], { startOffset: 0, distance: 43 });
//     Transforms.delete(editor, { at });
//     Transforms.removeNodes(editor, { at: [0, 1] });

//     createLawList(editor, MetaType.CHAPTER, [0, 0], { bumpVersionNumber: true });
//     createLawList(editor, MetaType.ART, [0, 1], { nested: true, bumpVersionNumber: true });

//     const output = compareDocuments(editor, originalDocument);
//     expect(output).toStrictEqual([
//         {
//             id: 'chapter-1',
//             type: 'added',
//             text: 'I. Chapter name ',
//         },
//         {
//             id: 'chapter-2',
//             type: 'added',
//             text: undefined,
//         },
//         {
//             id: 'chapter-2.art-1',
//             type: 'added',
//             text: undefined,
//         },
//     ]);
// });

test('add list item and then remove', () => {
    const { editor, originalDocument } = setupEditor([
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
    ]);

    createLawList(editor, MetaType.ART, [0, 0, 1, 0], { bumpVersionNumber: true });

    Transforms.removeNodes(editor, { at: [0, 0, 1, 1] });

    const output = compareDocuments(editor, originalDocument);
    expect(output).toStrictEqual([]);
});

// test('remove big chunk', () => {
//     const { editor, originalDocument } = setupEditor([
//         createList(MetaType.CHAPTER, {}, [
//             createListItem(MetaType.CHAPTER, '1', { title: 'I. Chapter ', name: 'name ' }),
//             createListItem(MetaType.CHAPTER, '2', { title: 'II. Chapter ', name: 'name ' }, [
//                 createList(MetaType.ART, {}, [
//                     createListItem(MetaType.ART, '1', { title: '1. gr.' }),
//                     createListItem(MetaType.ART, '2', { title: '2. gr.' }, [
//                         createList(MetaType.SUBART, {}, [
//                             createListItem(MetaType.SUBART, '1', { text: 'some text of II. Chapter' }),
//                         ]),
//                     ]),
//                 ]),
//             ]),
//             createListItem(MetaType.CHAPTER, '3', { title: 'III. Chapter ', name: 'name ' }, [
//                 createList(MetaType.ART, {}, [
//                     createListItem(MetaType.ART, '1', { title: '1. gr.' }),
//                     createListItem(MetaType.ART, '2', { title: '2. gr.' }, [
//                         createList(MetaType.SUBART, {}, [
//                             createListItem(MetaType.SUBART, '1', { text: 'some text of II. Chapter' }),
//                         ]),
//                     ]),
//                 ]),
//             ]),
//         ]),
//     ]);

//     Transforms.removeNodes(editor, { at: [0, 1] });

//     const output = compareDocuments(editor, originalDocument);
//     expect(output).toStrictEqual([]);
// });
