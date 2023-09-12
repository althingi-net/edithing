import { ElementType, MetaType, createList, createListItem } from "../Slate";
import createEditorWithPlugins from "./createEditorWithPlugins";

test('add missing meta data to ListItem', async () => {
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