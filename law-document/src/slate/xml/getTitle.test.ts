import { Descendant } from 'slate';
import { MetaType } from '../Slate';
import { createDocumentMeta } from '../transformations/createDocumentMeta';
import { createList } from '../transformations/createList';
import { createListItem } from '../transformations/createListItem';
import { getTitle } from './getTitle';

test('return existing title', () => {
    const input: Descendant[] = [
        createDocumentMeta({
            nr: '33',
            year: '1944',
            name: 'Stjórnarskrá lýðveldisins Íslands',
            date: '1944-06-17',
            original: '1944 nr. 33 17. júní',
            ministerClause: '&lt;a href=&quot;http://www.althingi.is//dba-bin/fe&quot;&gt;',
        }),
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. ' }),
        ]),
    ];
    
    const expected = 'Stjórnarskrá lýðveldisins Íslands';
    
    expect(getTitle(input)).toStrictEqual(expected);
});

test('return empty title if not exists', () => {
    const input: Descendant[] = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I. ' }),
        ]),
    ];
    
    const expected = '';
    
    expect(getTitle(input)).toStrictEqual(expected);
});