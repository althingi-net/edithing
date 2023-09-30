import { MetaType } from "../Slate";
import createEditorWithPlugins from "../plugins/createEditorWithPlugins";
import createList from "../utils/slate/createList";
import createListItem from "../utils/slate/createListItem";
import createLawList from "./createLawList";

test('create new list item and increment following siblings', () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.', text: 'the first chapter' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.', text: 'the second chapter' }),
        ]),
    ];
    editor.selection = {
        anchor: {
            path: [0, 0, 0, 0],
            offset: 0,
        },
        focus: {
            path: [0, 0, 0, 0],
            offset: 0,
        },
    };

    createLawList(editor, MetaType.CHAPTER);

    editor.normalize({ force: true })

    expect(editor.children).toStrictEqual([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.', text: 'the first chapter' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.' }),
            createListItem(MetaType.CHAPTER, '3', { title: 'III. kafli.', text: 'the second chapter' }),
        ]),
    ]);
});
