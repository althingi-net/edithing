import { createEditor } from "slate";
import getPreviousSibling from "./getPreviousSibling";
import { MetaType } from "../../Slate";
import createList from "./createList";
import createListItem from "./createListItem";

test('get first sibling with 3 nodes', () => {
    const editor = createEditor();

    const firstChild = createListItem(MetaType.CHAPTER, '1');
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            firstChild,
            createListItem(MetaType.CHAPTER, '2'),
            createListItem(MetaType.CHAPTER, '3'),
        ]),
    ];
    const output = getPreviousSibling(editor, [0, 1]);

    expect(output).toEqual([firstChild, [0, 0]]);
});

test('get second sibling with 3 nodes', () => {
    const editor = createEditor();

    const secondChild = createListItem(MetaType.CHAPTER, '2');
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1'),
            secondChild,
            createListItem(MetaType.CHAPTER, '3'),
        ]),
    ];
    const output = getPreviousSibling(editor, [0, 2]);

    expect(output).toEqual([secondChild, [0, 1]]);
});