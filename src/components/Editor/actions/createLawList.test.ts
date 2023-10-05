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

    createLawList(editor, MetaType.CHAPTER, [0, 0], { bumpVersionNumber: true });

    editor.normalize({ force: true })

    expect(editor.children).toStrictEqual([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.', text: 'the first chapter' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.' }),
            createListItem(MetaType.CHAPTER, '3', { title: 'III. kafli.', text: 'the second chapter' }),
        ]),
    ]);
});

test('create new list item and do not increment following siblings', () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.', text: 'the first chapter' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.', text: 'the second chapter' }),
        ]),
    ];

    createLawList(editor, MetaType.CHAPTER, [0, 0], { bumpVersionNumber: false });

    editor.normalize({ force: true })

    expect(editor.children).toStrictEqual([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.', text: 'the first chapter' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.', text: 'the second chapter' }),
        ]),
    ]);
});

test('create new list item and nest it', () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.', text: 'the first chapter' }),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.', text: 'the second chapter' }),
        ]),
    ];

    createLawList(editor, MetaType.CHAPTER, [0, 0], { nested: true });

    editor.normalize({ force: true })

    expect(editor.children).toStrictEqual([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.', text: 'the first chapter' }, [
                createList(MetaType.ART, {}, [
                    createListItem(MetaType.ART, '1', { title: '1. gr.' }),
                ]),
            ]),
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.', text: 'the second chapter' }),
        ]),
    ]);
});
