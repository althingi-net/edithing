import { createEditor } from "slate";
import createMeta from "./createMeta"
import { MetaType, OrderedList } from "../Slate";
import createList from "./slate/createList";
import createListItem from "./slate/createListItem";

test('List: sibling above', () => {
    const editor = createEditor();

    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1'),
        ]),
    ];

    const output = {
        type: MetaType.CHAPTER,
        nrType: 'roman',
    };

    expect(createMeta(editor, editor.children[0] as OrderedList, [0])).toEqual(output);
});

test('ListItem: sibling above', () => {
    const editor = createEditor();

    const node = createListItem(MetaType.CHAPTER, '2');
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1'),
            node,
        ]),
    ];

    const output = {
        type: MetaType.CHAPTER,
        nrType: 'roman',
        nr: '2',
        romanNr: 'II',
    };

    expect(createMeta(editor, node, [0, 1])).toEqual(output);
});
