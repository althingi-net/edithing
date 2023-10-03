import { Editor } from "slate";
import { ElementType, MetaType } from "../Slate";
import createList from "../utils/slate/createList";
import createListItem from "../utils/slate/createListItem";
import createEditorWithPlugins from "./createEditorWithPlugins";
import { onKeyDown } from "@prezly/slate-lists";

test('add missing meta data to List Element', async () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I.', text: '1' }, [
                {
                    type: ElementType.LIST,
                    children: [
                        {
                            type: ElementType.LIST_ITEM,
                            children: [
                                {
                                    type: ElementType.LIST_ITEM_TEXT,
                                    children: [
                                        { text: '' },
                                    ],
                                },
                            ],
                        },
                    ],
                },   
            ]),
        ]),
    ];

    editor.normalize({ force: true })

    const output = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I.', text: '1' }, [
                createList(MetaType.ART, {}, [
                    createListItem(MetaType.ART, '1'),
                ]),
            ]),
        ]),
    ];

    expect(editor.children).toEqual(output);
});

test('add missing meta data to ListItem Element', async () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I.' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II.', text: '2' }),
            {
                type: ElementType.LIST_ITEM,
                children: [
                    {
                        type: ElementType.LIST_ITEM_TEXT,
                        children: [
                            { text: '' },
                        ],
                    },
                ],
            },
        ]),
    ];

    editor.normalize({ force: true })

    const output = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I.' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II.', text: '2' }),
            createListItem(MetaType.CHAPTER, '3', { title: 'III.' }),
        ]),
    ];

    expect(editor.children).toEqual(output);
});

test('increment following siblings nr and title', async () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I.' }),
            {
                type: ElementType.LIST_ITEM,
                children: [
                    {
                        type: ElementType.LIST_ITEM_TEXT,
                        children: [
                            { text: '' },
                        ],
                    },
                ],
            },
            createListItem(MetaType.CHAPTER, '2', { title: 'II.', text: '3' }),
        ]),
    ];

    editor.normalize({ force: true })

    const output = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I.' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II.' }),
            createListItem(MetaType.CHAPTER, '3', { title: 'III.', text: '3' }),
        ]),
    ];

    expect(editor.children).toEqual(output);
});

test('when incrementing following siblings nr and title, retain selection on initiating node', async () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I.' }),
            {
                type: ElementType.LIST_ITEM,
                children: [
                    {
                        type: ElementType.LIST_ITEM_TEXT,
                        children: [
                            { text: '' },
                        ],
                    },
                ],
            },
            createListItem(MetaType.CHAPTER, '2', { title: 'II.' }),
        ]),
    ];

    editor.selection = Editor.range(editor, [0, 1, 0]);
    editor.normalize({ force: true })

    const expectedRange = Editor.range(editor, [0, 1, 0]);
    expectedRange.anchor.offset = 3;
    expectedRange.focus.offset = 3;

    expect(editor.selection).toEqual(expectedRange);
});

test('increment following siblings nr and title but retain letters after digits', async () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, '1', { title: '1. gr.' }),
            {
                type: ElementType.LIST_ITEM,
                children: [
                    {
                        type: ElementType.LIST_ITEM_TEXT,
                        children: [
                            { text: '' },
                        ],
                    },
                ],
            },
            createListItem(MetaType.ART, '1a', { title: '1. gr. a.' }),
            createListItem(MetaType.ART, '2', { title: '2. gr.' }),
        ]),
    ];

    editor.normalize({ force: true })

    const output = [
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, '1', { title: '1. gr.' }),
            createListItem(MetaType.ART, '2', { title: '2. gr.' }),
            createListItem(MetaType.ART, '2a', { title: '2. gr. a.' }),
            createListItem(MetaType.ART, '3', { title: '3. gr.' }),
        ]),
    ];

    expect(editor.children).toEqual(output);
});

test('increment following siblings nr and title with roman nr and retain previous text', async () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.' }),
            {
                type: ElementType.LIST_ITEM,
                children: [
                    {
                        type: ElementType.LIST_ITEM_TEXT,
                        children: [
                            { text: '' },
                        ],
                    },
                ],
            },
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.' }),
        ]),
    ];

    editor.normalize({ force: true })

    const output = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.' }),
            createListItem(MetaType.CHAPTER, '3', { title: 'III. kafli.' }),
        ]),
    ];

    expect(editor.children).toEqual(output);
});

test('tab of list item will nest it and change the MetaType from Chapter to Art', async () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.' }),
        ]),
    ];
    const output = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.' }, [
                createList(MetaType.ART, {}, [
                    createListItem(MetaType.ART, '1', { title: '1. gr.' }),
                ]),
            ]),
        ]),
    ];

    editor.selection = Editor.range(editor, [0, 1, 0]);

    // @ts-ignore
    onKeyDown.onTabIncreaseListDepth(editor, new KeyboardEvent('keydown', { shiftKey: true, key: 'Tab' }));

    expect(editor.children).toEqual(output);
});

// test('tab+shift at the root will do nothing', async () => {
//     const editor = createEditorWithPlugins();
//     editor.children = [
//         createList(MetaType.CHAPTER, {}, [
//             createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.' }),
//             createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.' }),
//         ]),
//     ];
//     const output = [
//         createList(MetaType.CHAPTER, {}, [
//             createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.' }),
//             createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.' }),
//         ]),
//     ];

//     editor.selection = Editor.range(editor, [0, 1, 0]);

//     // @ts-ignore
//     onKeyDown.onShiftTabDecreaseListDepth(editor, new KeyboardEvent('keydown', { shiftKey: true, key: 'Tab' }));

//     expect(editor.children).toEqual(output);
// });
