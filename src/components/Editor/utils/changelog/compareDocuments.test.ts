import { Descendant, Node } from "slate";
import { MetaType, createList, createListItem, createSlateRoot } from "../../Slate";
import compareDocuments from "./compareDocuments";


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

//     expect(compareDocuments(inputA, inputB)).toStrictEqual(output);
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
    const inputB: Node = createSlateRoot([
        createList(MetaType.PARAGRAPH, [
            createListItem(MetaType.PARAGRAPH, '1', 'New Text'),
        ]),
    ]);

    const output = [
        'Paragraph 2. was removed',
    ];

    expect(compareDocuments(inputA, inputB)).toStrictEqual(output);
});

test('Added paragraph 2', () => {
    const inputA: Descendant[] = [
        createList(MetaType.PARAGRAPH, [
            createListItem(MetaType.PARAGRAPH, '1', 'Hello World'),
        ]),
    ];
    const inputB: Node = createSlateRoot([
        createList(MetaType.PARAGRAPH, [
            createListItem(MetaType.PARAGRAPH, '1', 'Hello World'),
            createListItem(MetaType.PARAGRAPH, '2', 'New Text'),
        ]),
    ]);

    const output = [
        'Paragraph 2. was added with "New Text"',
    ];

    expect(compareDocuments(inputA, inputB)).toStrictEqual(output);
});

test('Changed paragraph 1', () => {
    const inputA: Descendant[] = [
        createList(MetaType.PARAGRAPH, [
            createListItem(MetaType.PARAGRAPH, '1', 'Hello World'),
        ]),
    ];
    const inputB: Node = createSlateRoot([
        createList(MetaType.PARAGRAPH, [
            createListItem(MetaType.PARAGRAPH, '1', 'Hello z'),
        ]),
    ]);

    const output = [
        'Paragraph 1. was changed from "Hello World" to "Hello z"',
    ];

    expect(compareDocuments(inputA, inputB)).toStrictEqual(output);
});

test('Changed Chapter 1 Paragraph 2', () => {
    const inputA: Descendant[] = [
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '1', 'I.', [
                createList(MetaType.PARAGRAPH, [
                    createListItem(MetaType.PARAGRAPH, '1', 'Hello World'),
                    createListItem(MetaType.PARAGRAPH, '2', 'Hello World'),
                ]),
            ]),
        ]),
    ];
    const inputB: Node = createSlateRoot([
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '1', 'I.', [
                createList(MetaType.PARAGRAPH, [
                    createListItem(MetaType.PARAGRAPH, '1', 'Hello World'),
                    createListItem(MetaType.PARAGRAPH, '2', 'Hello z'),
                ]),
            ]),
        ]),
    ]);

    const output = [
        'Chapter 1. Paragraph 2. was changed from "Hello World" to "Hello z"',
    ];

    expect(compareDocuments(inputA, inputB)).toStrictEqual(output);
});