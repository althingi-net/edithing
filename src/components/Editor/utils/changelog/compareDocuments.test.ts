import { Descendant, Operation } from "slate";
import { MetaType, createList, createListItem } from "../../Slate";
import compareDocuments from "./compareDocuments";
import { Event } from "./useEvents";


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
        { id: 'paragraph-2', type: 'remove_node' },
    ];

    const output = [
        ' of the law was removed.',
    ];

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
        { id: 'paragraph-2', type: 'insert_text' },
    ];

    const output = [
        ' of the law was added: New Text',
    ];

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
        { id: 'paragraph-1', type: 'remove_text' },
        { id: 'paragraph-1', type: 'insert_text' },
    ];

    const output = [
        ' of the law shall be: Hello z',
    ];

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
        { id: 'chapter-1.paragraph-2', type: 'remove_text' },
        { id: 'chapter-1.paragraph-2', type: 'insert_text' },
    ];

    const output = [
        '1. chapter. of the law shall be: Hello z',
    ];

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
        { id: 'chapter-1.paragraph-2', type: 'insert_text' },
    ];

    const output = [
        '1. chapter. of the law shall be: Hello z',
    ];

    expect(compareDocuments(inputA, inputB, events)).toStrictEqual(output);
});