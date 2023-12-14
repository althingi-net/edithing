import { Path } from 'slate';
import { MetaType } from '../../Slate';
import createEditorWithPlugins from '../../plugins/createEditorWithPlugins';
import createList from '../../utils/slate/createList';
import createListItem, { Options } from '../../utils/slate/createListItem';
import createSelectionWithDistance from '../../utils/slate/createSelectionWithDistance';
import showTitleFormatButton from './showTitleFormatButton';

const testShowTitleFormatButton = (path: Path, startOffset: number, distance: number, options: Options, expectTruthy: boolean) => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', options),
        ]),
    ];
    
    editor.selection = createSelectionWithDistance(editor, path, { distance, startOffset });
    
    if (expectTruthy) {
        expect(showTitleFormatButton(editor)).toBeTruthy();
    } else {
        expect(showTitleFormatButton(editor)).toBeFalsy();
    }
};

test('at beginning of sentence should show without any title', () => {
    testShowTitleFormatButton(
        [0, 0, 0, 0],
        0,
        3,
        { text: 'text' },
        true,
    );
});

test('hide in the middle of text', () => {
    testShowTitleFormatButton(
        [0, 0, 0, 0],
        1,
        2,
        { text: 'text' },
        false,
    );
});

test('hide in text if a name exists before text', () => {
    testShowTitleFormatButton(
        [0, 0, 0, 1],
        0,
        3,
        { name: 'name', text: 'text' },
        false,
    );
});

test('show at the start of name', () => {
    testShowTitleFormatButton(
        [0, 0, 0, 0],
        0,
        3,
        { name: 'name', text: 'text' },
        true,
    );
});

test('show when selecting part of title and name', () => {
    testShowTitleFormatButton(
        [0, 0, 0, 0],
        3,
        3,
        { title: 'title', name: 'name', text: 'text' },
        true,
    );
});

test('hide when not starting at name', () => {
    testShowTitleFormatButton(
        [0, 0, 0, 0],
        1,
        3,
        { name: 'name', text: 'text' },
        false,
    );
});
