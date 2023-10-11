import { ListItemMeta, MetaType } from "../../Slate";
import createEditorWithPlugins from "../../plugins/createEditorWithPlugins";
import createList from "./createList";
import createListItem from "./createListItem";
import setListItemMeta from "./setListItemMeta";

test('insert title in empty list item', () => {
    const editor = createEditorWithPlugins();
    const node = createListItem(MetaType.CHAPTER, '1');
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            node,
        ]),
    ];
    const output = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.' }),
        ]),
    ];

    const path = [0, 0];
    const meta: ListItemMeta = { nr: '2', type: MetaType.CHAPTER, title: 'II. kafli.' };
    setListItemMeta(editor, node, path, meta);

    expect(editor.children).toEqual(output);
});

test('update existing title', () => {
    const editor = createEditorWithPlugins();
    const node = createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.' });
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            node,
        ]),
    ];
    const output = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.' }),
        ]),
    ];

    const path = [0, 0];
    const meta: ListItemMeta = { nr: '2', type: MetaType.CHAPTER, title: 'II. kafli.' };
    setListItemMeta(editor, node, path, meta);

    expect(editor.children).toEqual(output);
});

test('remove existing title', () => {
    const editor = createEditorWithPlugins();
    const node = createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.', text: 'text' });
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            node,
        ]),
    ];
    const output = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '2', { text: 'text' }),
        ]),
    ];

    const path = [0, 0];
    const meta: ListItemMeta = { nr: '2', type: MetaType.CHAPTER };
    setListItemMeta(editor, node, path, meta);

    expect(editor.children).toEqual(output);
});

test('prepend title above existing text', () => {
    const editor = createEditorWithPlugins();
    const node = createListItem(MetaType.CHAPTER, '1', { text: 'text' });
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            node,
        ]),
    ];
    const output = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.', text: 'text' }),
        ]),
    ];

    const path = [0, 0];
    const meta: ListItemMeta = { nr: '2', type: MetaType.CHAPTER, title: 'II. kafli.' };
    setListItemMeta(editor, node, path, meta);

    expect(editor.children).toEqual(output);
});

test('update title of existing title+name+text', () => {
    const editor = createEditorWithPlugins();
    const node = createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.', name: 'name', text: 'text' });
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            node,
        ]),
    ];
    const output = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.', name: 'name', text: 'text' }),
        ]),
    ];

    const path = [0, 0];
    const meta: ListItemMeta = { nr: '2', type: MetaType.CHAPTER, title: 'II. kafli.', name: 'name' };
    setListItemMeta(editor, node, path, meta);

    expect(editor.children).toEqual(output);
});