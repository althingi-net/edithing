import { Descendant } from "slate";
import compareDocuments from "./compareDocuments";
import Changelog from "../../../../models/Changelog";
import { MetaType } from "../../Slate";
import createList from "../slate/createList";
import createListItem from "../slate/createListItem";
import { Event } from "../../plugins/withEvents";

// test('renaming a paragraph and adding the same one again with a different text', () => {
//     const inputA = `
//         <paragraph nr="1">Hello World</paragraph>
//     `;
//     const inputB: Node = createSlateRoot([
//         createList(MetaType.PARAGRAPH, {}, [
//             createListItem(MetaType.PARAGRAPH, '1', { title: 'New Text' }),
//             createListItem(MetaType.PARAGRAPH, '2', { title: 'Hello World' }),
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
        createList(MetaType.PARAGRAPH, {}, [
            createListItem(MetaType.PARAGRAPH, '1', { title: 'New Text' }),
        ]),
        createList(MetaType.PARAGRAPH, {}, [
            createListItem(MetaType.PARAGRAPH, '2', { title: 'Hello World' }),
        ]),
    ];
    const inputB: Descendant[] = [
        createList(MetaType.PARAGRAPH, {}, [
            createListItem(MetaType.PARAGRAPH, '1', { title: 'New Text' }),
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
        createList(MetaType.PARAGRAPH, {}, [
            createListItem(MetaType.PARAGRAPH, '1', { title: 'Hello World' }),
        ]),
    ];
    const inputB: Descendant[] = [
        createList(MetaType.PARAGRAPH, {}, [
            createListItem(MetaType.PARAGRAPH, '1', { title: 'Hello World' }),
            createListItem(MetaType.PARAGRAPH, '2', { title: 'New Text' }),
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
        createList(MetaType.PARAGRAPH, {}, [
            createListItem(MetaType.PARAGRAPH, '1', { title: 'Hello World' }),
        ]),
    ];
    const inputB: Descendant[] = [
        createList(MetaType.PARAGRAPH, {}, [
            createListItem(MetaType.PARAGRAPH, '1', { title: 'Hello z' }),
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
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I.' }, [
                createList(MetaType.PARAGRAPH, {}, [
                    createListItem(MetaType.PARAGRAPH, '1', { title: 'Hello World' }),
                    createListItem(MetaType.PARAGRAPH, '2', { title: 'Hello World' }),
                ]),
            ]),
        ]),
    ];
    const inputB: Descendant[] = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I.' }, [
                createList(MetaType.PARAGRAPH, {}, [
                    createListItem(MetaType.PARAGRAPH, '1', { title: 'Hello World' }),
                    createListItem(MetaType.PARAGRAPH, '2', { title: 'Hello z' }),
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
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I.' }, [
                createList(MetaType.PARAGRAPH, {}, [
                    createListItem(MetaType.PARAGRAPH, '1', { title: 'Hello World' }),
                    createListItem(MetaType.PARAGRAPH, '2', { title: 'Hello World' }),
                ]),
            ]),
        ]),
    ];
    const inputB: Descendant[] = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I.' }, [
                createList(MetaType.PARAGRAPH, {}, [
                    createListItem(MetaType.PARAGRAPH, '1', { title: 'Hello World' }),
                    createListItem(MetaType.PARAGRAPH, '2', { title: 'Hello z' }),
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
        createList(MetaType.PARAGRAPH, {}, [
            createListItem(MetaType.PARAGRAPH, '1', { title: 'Hello World' }),
            createListItem(MetaType.PARAGRAPH, '2', { title: 'Hello World' }),
            createListItem(MetaType.PARAGRAPH, '3', { title: 'Hello World' }),
        ]),
    ];
    const inputB: Descendant[] = [
        createList(MetaType.PARAGRAPH, {}, [
            createListItem(MetaType.PARAGRAPH, '1', { title: 'Hello World' }),
            createListItem(MetaType.PARAGRAPH, '2', { title: 'Hello 2' }),
            createListItem(MetaType.PARAGRAPH, '3', { title: 'Hello 3' }),
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
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I.' }, [
                createList(MetaType.PARAGRAPH, {}, [
                    createListItem(MetaType.PARAGRAPH, '1', { title: 'title 1', text: ['sen1', 'sen2'] }),
                    createListItem(MetaType.PARAGRAPH, '2', { title: 'title 2', text: ['sen1', 'sen2'] }),
                ]),
            ]),
        ]),
    ];
    const inputB: Descendant[] = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I.' }, [
                createList(MetaType.PARAGRAPH, {}, [
                    createListItem(MetaType.PARAGRAPH, '1', { title: 'title 1', text: ['sen1', 'sen2 hello'] }),
                    createListItem(MetaType.PARAGRAPH, '2', { title: 'title 2', text: ['sen1', 'sen2 newword'] }),
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