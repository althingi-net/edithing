import { createEditor } from 'slate';
import { MetaType } from '../../Slate';
import createList from './createList';
import createListItem from './createListItem';
import createListItemMeta from './createListItemMeta';

test('ListItem: sibling above', () => {
    const editor = createEditor();

    const node = createListItem(MetaType.CHAPTER, '2');
    editor.children = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1'),
            node,
        ]),
    ];

    const output = {
        type: MetaType.CHAPTER,
        nrType: 'roman',
        nr: '2',
        romanNr: 'II',
    };

    expect(createListItemMeta(editor, [0, 1])).toEqual(output);
});
