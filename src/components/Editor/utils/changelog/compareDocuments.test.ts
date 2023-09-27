import { Descendant } from "slate";
import { MetaType, createList, createListItem } from "../../Slate";
import compareDocuments from "./compareDocuments";
import { Event } from "./useEvents";
import Changelog from "../../../../models/Changelog";


// test('renaming a paragraph and adding the same one again with a different text', () => {
//     const inputA = `
//         <paragraph nr="1">Hello World</paragraph>
//     `;
//     const inputB: Node = createSlateRoot([
//         createList(MetaType.PARAGRAPH, [
//             createListItem(MetaType.PARAGRAPH, '1', 'New Text'),
//             createListItem(MetaType.PARAGRAPH, '2', 'Hello World'),
//         ]),
//     ]);

//     const output = [
//         'Paragraph 1. was renamed to Paragraph 2.',
//         'Paragraph 1. was created: "New Text"',
//     ];

//     expect(compareDocuments(inputA, inputB, [])).toStrictEqual(output);
// });

test('Removed paragraph 2', () => {
    const inputA: Descendant[] = [
        createList(MetaType.PARAGRAPH, [
            createListItem(MetaType.PARAGRAPH, '1', 'New Text'),
        ]),
        createList(MetaType.PARAGRAPH, [
            createListItem(MetaType.PARAGRAPH, '2', 'Hello World'),
        ]),
    ];
    const inputB: Descendant[] = [
        createList(MetaType.PARAGRAPH, [
            createListItem(MetaType.PARAGRAPH, '1', 'New Text'),
        ]),
    ];
    const events: Event[] = [
        { id: 'paragraph-2.title', type: 'remove_node' },
    ];

    const output: Changelog[] = [{
        id: "paragraph-2.title",
        type: "delete",
    }];

    expect(compareDocuments(inputA, inputB, events)).toStrictEqual(output);
});

test('Added paragraph 2', () => {
    const inputA: Descendant[] = [
        createList(MetaType.PARAGRAPH, [
            createListItem(MetaType.PARAGRAPH, '1', 'Hello World'),
        ]),
    ];
    const inputB: Descendant[] = [
        createList(MetaType.PARAGRAPH, [
            createListItem(MetaType.PARAGRAPH, '1', 'Hello World'),
            createListItem(MetaType.PARAGRAPH, '2', 'New Text'),
        ]),
    ];
    const events: Event[] = [
        { id: 'paragraph-2.title', type: 'insert_text' },
    ];

    const output: Changelog[] = [{
        id: "paragraph-2.title",
        type: "add",
        text: "New Text ",
    }];

    expect(compareDocuments(inputA, inputB, events)).toStrictEqual(output);
});

test('Changed paragraph 1', () => {
    const inputA: Descendant[] = [
        createList(MetaType.PARAGRAPH, [
            createListItem(MetaType.PARAGRAPH, '1', 'Hello World'),
        ]),
    ];
    const inputB: Descendant[] = [
        createList(MetaType.PARAGRAPH, [
            createListItem(MetaType.PARAGRAPH, '1', 'Hello z'),
        ]),
    ];
    const events: Event[] = [
        { id: 'paragraph-1.title', type: 'remove_text' },
        { id: 'paragraph-1.title', type: 'insert_text' },
    ];

    const output: Changelog[] = [{
        id: "paragraph-1.title",
        type: "change",
        text: "Hello z ",
        changes: [[
            0,
            "Hello ",
        ], [
            -1,
            "World",
        ], [
            1,
            "z",
        ], [
            0,
            " ",
        ]],
    }];

    expect(compareDocuments(inputA, inputB, events)).toStrictEqual(output);
});

test('Changed Chapter 1 Paragraph 2', () => {
    const inputA: Descendant[] = [
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '1', 'I.', undefined, [
                createList(MetaType.PARAGRAPH, [
                    createListItem(MetaType.PARAGRAPH, '1', 'Hello World'),
                    createListItem(MetaType.PARAGRAPH, '2', 'Hello World'),
                ]),
            ]),
        ]),
    ];
    const inputB: Descendant[] = [
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '1', 'I.', undefined, [
                createList(MetaType.PARAGRAPH, [
                    createListItem(MetaType.PARAGRAPH, '1', 'Hello World'),
                    createListItem(MetaType.PARAGRAPH, '2', 'Hello z'),
                ]),
            ]),
        ]),
    ];
    const events: Event[] = [
        { id: 'chapter-1.paragraph-2.title', type: 'remove_text' },
        { id: 'chapter-1.paragraph-2.title', type: 'insert_text' },
    ];

    const output: Changelog[] = [{
        id: "chapter-1.paragraph-2.title",
        type: "change",
        text: "Hello z ",
        changes: [[
            0,
            "Hello ",
        ], [
            -1,
            "World",
        ], [
            1,
            "z",
        ], [
            0,
            " ",
        ]],
    }];

    expect(compareDocuments(inputA, inputB, events)).toStrictEqual(output);
});

test('Merge events for the same id', () => {
    const inputA: Descendant[] = [
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '1', 'I.', undefined, [
                createList(MetaType.PARAGRAPH, [
                    createListItem(MetaType.PARAGRAPH, '1', 'Hello World'),
                    createListItem(MetaType.PARAGRAPH, '2', 'Hello World'),
                ]),
            ]),
        ]),
    ];
    const inputB: Descendant[] = [
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '1', 'I.', undefined, [
                createList(MetaType.PARAGRAPH, [
                    createListItem(MetaType.PARAGRAPH, '1', 'Hello World'),
                    createListItem(MetaType.PARAGRAPH, '2', 'Hello z'),
                ]),
            ]),
        ]),
    ];
    const events: Event[] = [
        { id: 'chapter-1.paragraph-2', type: 'remove_node' },
        { id: 'chapter-1.paragraph-2', type: 'set_node' },
        { id: 'chapter-1.paragraph-2.title', type: 'insert_text' },
    ];

    const output: Changelog[] = [{
        id: "chapter-1.paragraph-2.title",
        type: "change",
        text: "Hello z ",
        changes: [[
            0,
            "Hello ",
        ], [
            -1,
            "World",
        ], [
            1,
            "z",
        ], [
            0,
            " ",
        ]],
    }];

    expect(compareDocuments(inputA, inputB, events)).toStrictEqual(output);
});

test('Sort entries by ascending id', () => {
    const inputA: Descendant[] = [
        createList(MetaType.PARAGRAPH, [
            createListItem(MetaType.PARAGRAPH, '1', 'Hello World'),
            createListItem(MetaType.PARAGRAPH, '2', 'Hello World'),
            createListItem(MetaType.PARAGRAPH, '3', 'Hello World'),
        ]),
    ];
    const inputB: Descendant[] = [
        createList(MetaType.PARAGRAPH, [
            createListItem(MetaType.PARAGRAPH, '1', 'Hello World'),
            createListItem(MetaType.PARAGRAPH, '2', 'Hello 2'),
            createListItem(MetaType.PARAGRAPH, '3', 'Hello 3'),
        ]),
    ];
    const events: Event[] = [
        { id: 'paragraph-3.title', type: 'insert_text' },
        { id: 'paragraph-2.title', type: 'insert_text' },
    ];

    const output: Changelog[] = [{
        id: "paragraph-2.title",
        type: "change",
        text: "Hello 2 ",
        changes: [[
            0,
            "Hello ",
        ], [
            -1,
            "World",
        ], [
            1,
            "2",
        ], [
            0,
            " ",
        ]],
    }, {
        id: "paragraph-3.title",
        type: "change",
        text: "Hello 3 ",
        changes: [[
            0,
            "Hello ",
        ], [
            -1,
            "World",
        ], [
            1,
            "3",
        ], [
            0,
            " ",
        ]],
    }];

    expect(compareDocuments(inputA, inputB, events)).toStrictEqual(output);
});

test('Added word in sen 2', () => {
    const inputA: Descendant[] = [
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '1', 'I.', undefined, [
                createList(MetaType.PARAGRAPH, [
                    createListItem(MetaType.PARAGRAPH, '1', 'title 1', ['sen1', 'sen2']),
                    createListItem(MetaType.PARAGRAPH, '2', 'title 2', ['sen1', 'sen2']),
                ]),
            ]),
        ]),
    ];
    const inputB: Descendant[] = [
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '1', 'I.', undefined, [
                createList(MetaType.PARAGRAPH, [
                    createListItem(MetaType.PARAGRAPH, '1', 'title 1', ['sen1', 'sen2 hello']),
                    createListItem(MetaType.PARAGRAPH, '2', 'title 2', ['sen1', 'sen2 newword']),
                ]),
            ]),
        ]),
    ];
    const events: Event[] = [
        { id: 'chapter-1.paragraph-2.sen-2', type: 'insert_text' },
    ];

    const output: Changelog[] = [{
        id: "chapter-1.paragraph-2.sen-2",
        type: "change",
        text: "sen2 newword",
        changes: [[
            0,
            "sen2",
        ], [
            1,
            " newword",
        ]],
    }];

    expect(compareDocuments(inputA, inputB, events)).toStrictEqual(output);
});