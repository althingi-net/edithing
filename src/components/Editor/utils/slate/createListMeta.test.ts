import { createEditor } from "slate";
import { MetaType } from "../../Slate";
import createList from "./createList";
import createListItem from "./createListItem";
import createListMeta from "./createListMeta";

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

    expect(createListMeta(editor, [0])).toEqual(output);
});