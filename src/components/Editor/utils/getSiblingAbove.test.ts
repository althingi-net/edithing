import { createEditor } from "slate";
import getSiblingAbove from "./getSiblingAbove";
import { createListItem, MetaType, createList } from "../Slate";

test('get first sibling with 3 nodes', () => {
    const editor = createEditor();

    const firstChild = createListItem(MetaType.CHAPTER, '1', 'I.');
    editor.children = [
        createList(MetaType.CHAPTER, [
            firstChild,
            createListItem(MetaType.CHAPTER, '2', 'II.'),
            createListItem(MetaType.CHAPTER, '3', 'III.'),
        ]),
    ];

    expect(getSiblingAbove(editor, [0, 1])).toEqual(firstChild);
});

test('get second sibling with 3 nodes', () => {
    const editor = createEditor();

    const secondChild = createListItem(MetaType.CHAPTER, '2', 'II.');
    editor.children = [
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '1', 'I.'),
            secondChild,
            createListItem(MetaType.CHAPTER, '3', 'III.'),
        ]),
    ];

    expect(getSiblingAbove(editor, [0, 2])).toEqual(secondChild);
});