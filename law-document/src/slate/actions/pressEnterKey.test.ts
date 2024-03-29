import { MetaType } from '../Slate';
import { createEditorWithPlugins } from '../plugins/createEditorWithPlugins';
import { createList } from '../transformations/createList';
import { createListItem } from '../transformations/createListItem';
import { createSelectionWithDistance } from '../transformations/createSelectionWithDistance';
import { pressEnterKey } from './pressEnterKey';

test('create new list item at middle of text', () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, '1', { title: '1. Chapter', name: 'a name', text: 'some text' }),
        ]),
    ];
    editor.selection = createSelectionWithDistance(editor, [0, 0, 0, 2], { distance: 4 });
    pressEnterKey(editor);

    expect(editor.children).toEqual([
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, '1', { title: '1. Chapter', name: 'a name', text: 'some text' }),
            createListItem(MetaType.ART, '2', { title: '2. Chapter', originNr: '' }),
        ]),
    ]);
});

test('create new list item at the end of text', () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, '1', { title: '1. Chapter', name: 'a name', text: 'some text' }),
        ]),
    ];
    editor.selection = createSelectionWithDistance(editor, [0, 0, 0, 2], { distance: 9 });
    pressEnterKey(editor);

    expect(editor.children).toEqual([
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, '1', { title: '1. Chapter', name: 'a name', text: 'some text' }),
            createListItem(MetaType.ART, '2', { title: '2. Chapter', originNr: '' }),
        ]),
    ]);
});