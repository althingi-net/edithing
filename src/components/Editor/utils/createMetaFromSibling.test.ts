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

    expect(createMetaFromSibling(editor, editor.children[0], [0])).toEqual(output);
});

test('ListItem: sibling above', () => {
    const editor = createEditor();

    const node = createListItem(MetaType.CHAPTER, '2', 'II.');
    editor.children = [
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '1', 'I.'),
            node,
        ]),
    ];

    const output = {
        type: MetaType.CHAPTER,
        nrType: 'roman',
        nr: '2',
        romanNr: 'II',
    };

    expect(createMetaFromSibling(editor, node, [0, 1])).toEqual(output);
});
