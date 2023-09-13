import { Editor } from "slate";
import { ElementType, MetaType, createList, createListItem } from "../Slate";
import createEditorWithPlugins from "./createEditorWithPlugins";

test('add missing meta data to List Element', async () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '1', 'I.', [
                {
                    type: ElementType.ORDERED_LIST,
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
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '1', 'I.', [
                createList(MetaType.ART, [
                    createListItem(MetaType.ART, '1', '1. gr.'),
                ]),
            ]),
        ]),
    ];

    expect(editor.children).toEqual(output);
});

test('add missing meta data to ListItem Element', async () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '1', 'I.'),
            createListItem(MetaType.CHAPTER, '2', 'II.'),
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
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '1', 'I.'),
            createListItem(MetaType.CHAPTER, '2', 'II.'),
            createListItem(MetaType.CHAPTER, '3', 'III.'),
        ]),
    ];

    expect(editor.children).toEqual(output);
});

test('increment following siblings nr and title', async () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '1', 'I.'),
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
            createListItem(MetaType.CHAPTER, '2', 'II.'),
        ]),
    ];

    editor.normalize({ force: true })

    const output = [
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '1', 'I.'),
            createListItem(MetaType.CHAPTER, '2', 'II.'),
            createListItem(MetaType.CHAPTER, '3', 'III.'),
        ]),
    ];

    expect(editor.children).toEqual(output);
});

test('when incrementing following siblings nr and title, retain selection on initiating node', async () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '1', 'I.'),
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
            createListItem(MetaType.CHAPTER, '2', 'II.'),
        ]),
    ];

    editor.selection = Editor.range(editor, [0, 1, 0]);
    editor.normalize({ force: true })

    const expectedRange = Editor.range(editor, [0, 1, 0]);
    expectedRange.anchor.offset = 3;
    expectedRange.focus.offset = 3;

    expect(editor.selection).toEqual(expectedRange);
});