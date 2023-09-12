import { createEditor } from "slate";
import { createListItem, MetaType, createList } from "../Slate";
import createMetaFromSibling from "./createMetaFromSibling"

test('List: sibling above', () => {
    const editor = createEditor();

    editor.children = [
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '1', 'I.'),
        ]),
    ];

    const output = {
        type: MetaType.CHAPTER,
        nrType: 'roman',
    };

    expect(createMetaFromSibling(editor, [1])).toEqual(output);
});

test('ListItem: sibling above', () => {
    const editor = createEditor();

    editor.children = [
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '1', 'I.'),
        ]),
    ];

    const output = {
        type: MetaType.CHAPTER,
        nrType: 'roman',
        nr: '2',
        romanNr: 'II',
    };

    expect(createMetaFromSibling(editor, [0, 1])).toEqual(output);
});
