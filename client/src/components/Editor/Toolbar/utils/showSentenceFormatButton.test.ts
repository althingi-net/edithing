import { Path } from 'slate';
import { MetaType } from '../../Slate';
import createEditorWithPlugins from '../../plugins/createEditorWithPlugins';
import createList from '../../utils/slate/createList';
import createListItem, { Options } from '../../utils/slate/createListItem';
import createSelectionWithDistance from '../../utils/slate/createSelectionWithDistance';
import showSentenceFormatButton from './showSentenceFormatButton';

const testShowSentenceFormatButton = (path: Path, startOffset: number, distance: number, options: Options, expectTruthy: boolean) => {
    const editor = createEditorWithPlugins();
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', options),
        ]),
    ];
    
    editor.selection = createSelectionWithDistance(editor, path, { distance, startOffset });
    
    if (expectTruthy) {
        expect(showSentenceFormatButton(editor)).toBeTruthy();
    } else {
        expect(showSentenceFormatButton(editor)).toBeFalsy();
    }
};

test('show in the middle of a sentence', () => {
    testShowSentenceFormatButton(
        [0, 0, 0, 2],
        1,
        1,
        { title: 'title', name: 'name', text: 'text' },
        true,
    );
});

test('hide when between title and name', () => {
    testShowSentenceFormatButton(
        [0, 0, 0, 0],
        1,
        6,
        { title: 'title', name: 'name', text: 'text' },
        false,
    );
});

test('end of name should show', () => {
    testShowSentenceFormatButton(
        [0, 0, 0, 0],
        1,
        3,
        { name: 'name', text: 'text' },
        true,
    );
});

test('end of title without a name should show', () => {
    testShowSentenceFormatButton(
        [0, 0, 0, 0],
        1,
        4,
        { title: 'title', text: 'text' },
        true,
    );
});