import { MetaType, createList , createListItem , createSelectionWithDistance } from 'law-document';
import createEditorWithPlugins from '../../plugins/createEditorWithPlugins';
import showNameFormatButton from './showNameFormatButton';

test('at beginning of title should hide', () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'title' }),
        ]),
    ];
    
    editor.selection = createSelectionWithDistance(editor, [0, 0, 0, 0], { distance: 3 });
    
    expect(showNameFormatButton(editor)).toBeFalsy();
});

test('at end of title should show', () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'title' }),
        ]),
    ];
    
    editor.selection = createSelectionWithDistance(editor, [0, 0, 0, 0], { distance: 3, startOffset: 2 });
    
    expect(showNameFormatButton(editor)).toBeTruthy();
});

test('at beginning of sentence should show', () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'title', text: 'text' }),
        ]),
    ];
    
    editor.selection = createSelectionWithDistance(editor, [0, 0, 0, 1], { distance: 3 });
    
    expect(showNameFormatButton(editor)).toBeTruthy();
});

test('in middle of sentence should hide', () => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'title', text: 'text' }),
        ]),
    ];
    
    editor.selection = createSelectionWithDistance(editor, [0, 0, 0, 1], { startOffset: 1, distance: 3 });
    
    expect(showNameFormatButton(editor)).toBeFalsy();
});