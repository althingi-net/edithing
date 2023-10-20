import { Operation, createEditor } from 'slate';
import { MetaType } from '../Slate';
import createList from '../utils/slate/createList';
import createListItem from '../utils/slate/createListItem';
import withEvents from './withEvents';

const setupEditor = () => {
    const editor = withEvents(createEditor());
    
    const node = createListItem(MetaType.CHAPTER, '2', { title: 'II. kafli.' });

    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.' }),
            node,
            createListItem(MetaType.CHAPTER, '3', { title: 'III. kafli.' }),
        ]),
    ];

    return {editor, node};
};

test('withEvents remove_text', () => {
    const { editor } = setupEditor();
    const operation: Operation = { type: 'remove_text', path: [0, 0, 0, 0], offset: 0, text: 'Chapter 1' };

    editor.apply(operation);

    expect(editor.events).toEqual([{ id: 'chapter-1.title', type: 'remove_text', original: operation }]);
});

test('withEvents split_node', () => {
    const { editor } = setupEditor();
    const operation: Operation = { type: 'split_node', path: [0, 0, 0, 0], position: 5, properties: { nr: '1' } };
    
    editor.apply(operation);

    expect(editor.events).toEqual([{ id: 'chapter-1.title', type: 'split_node', original: operation }]);
});

test('withEvents merge_node', () => {
    const { editor } = setupEditor();
    const operation: Operation = { type: 'merge_node', path: [0, 1], position: 5, properties: { nr: '2' } };
    
    editor.apply(operation);

    expect(editor.events).toEqual([{ id: 'chapter-2', type: 'merge_node', original: operation }]);
});

test('withEvents move_node', () => {
    const { editor } = setupEditor();
    const operation: Operation = { type: 'move_node', path: [0, 0, 0], newPath: [0, 0, 3] };
    
    editor.apply(operation);

    expect(editor.events).toEqual([{ id: 'chapter-1',  type: 'move_node', original: operation }]);
});

test('withEvents set_node', async () => {
    const { editor } = setupEditor();
    const operation: Operation = { type: 'set_node', path: [0, 0, 0],  properties: { nr: '1' }, newProperties: { nr: '5' } };
    
    editor.apply(operation);

    // Wait for the next tick to allow the editor to update the events array.
    await Promise.resolve();

    expect(editor.events).toEqual([
        { id: 'chapter-1', type: 'set_node', original: operation },
        { id: 'chapter-1', type: 'set_node', original: operation }
    ]);
});

test('withEvents remove_node', () => {
    const { editor, node } = setupEditor();
    const operation: Operation = { type: 'remove_node', path: [0, 2], node: node };
    
    editor.apply(operation);

    expect(editor.events).toEqual([{ id: 'chapter-3', type: 'remove_node', original: operation }]);
});

test('withEvents insert_text', () => {
    const { editor } = setupEditor();
    const operation: Operation = { type: 'insert_text', path: [0, 0, 0, 0], offset: 9, text: ' lalala' };
    
    editor.apply(operation);

    expect(editor.events).toEqual([{ id: 'chapter-1.title', type: 'insert_text', original: operation }]);
});

test('withEvents insert_node', async () => {
    const { editor } = setupEditor();
    const node = createListItem(MetaType.CHAPTER, '4', { title: 'IV. kafli.' });
    const operation: Operation = { type: 'insert_node', path: [0, 3], node };
    
    editor.apply(operation);

    // Wait for the next tick to allow the editor to update the events array.
    await Promise.resolve();

    expect(editor.events).toEqual([{ id: 'chapter-4', type: 'insert_node', original: operation }]);
});

test('withEvents set_node with missing meta', async () => {
    const { editor, node } = setupEditor();
    const meta = node.meta;
    delete node.meta;
    const operation: Operation = { type: 'set_node', path: [0, 1],  properties: { }, newProperties: { meta } };
    
    editor.apply(operation);

    // Wait for the next tick to allow the editor to update the events array.
    await Promise.resolve();

    expect(editor.events).toEqual([{ id: 'chapter-2', type: 'set_node', original: operation }]);
});