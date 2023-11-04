import { Descendant, Point, Transforms } from 'slate';
import { MetaType } from '../../Slate';
import splitListItem from '../../actions/splitListItem';
import createEditorWithPlugins from '../../plugins/createEditorWithPlugins';
import createList from '../slate/createList';
import createListItem from '../slate/createListItem';
import createSelectionWithDistance from '../slate/createSelectionWithDistance';
import compareDocuments from './compareDocuments';

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
        id: 'chapter-1.art-1.sen-1',
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
        id: 'chapter-1.art-1.sen-1',
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
        id: 'chapter-1.art-1.sen-1',
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
