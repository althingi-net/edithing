import { MetaType } from '../Slate';
import { createEditorWithPlugins } from '../plugins/createEditorWithPlugins';
import { createList } from '../transformations/createList';
import { createListItem } from '../transformations/createListItem';
import { createSelectionWithDistance } from '../transformations/createSelectionWithDistance';
import { isSelectionAtEdgeOfListItemText } from './isSelectionAtEdgeOfListItemText';

test('start', () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.', name: 'first', text: 'the first chapter' }),
        ]),
    ];
    editor.selection = createSelectionWithDistance(editor, [0, 0, 0, 0]);

    const result = isSelectionAtEdgeOfListItemText(editor, [0, 0, 0]);

    expect(result).toBeTruthy();
});

test('middle', () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.', name: 'first', text: 'the first chapter' }),
        ]),
    ];
    editor.selection = createSelectionWithDistance(editor, [0, 0, 0, 1]);

    const result = isSelectionAtEdgeOfListItemText(editor, [0, 0, 0]);

    expect(result).toBeFalsy();
});

test('end', () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. kafli.', name: 'first' }),
        ]),
    ];
    editor.selection = createSelectionWithDistance(editor, [0, 0, 0, 1], { startOffset: 5 });

    const result = isSelectionAtEdgeOfListItemText(editor, [0, 0, 0]);

    expect(result).toBeTruthy();
});