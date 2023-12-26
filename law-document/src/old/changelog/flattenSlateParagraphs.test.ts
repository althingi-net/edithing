import { Descendant } from 'slate';
import { createList } from '../slate/createList';
import { createListItem } from '../slate/createListItem';
import { flattenSlateParagraphs } from './flattenSlateParagraphs';
import { MetaType } from '../Slate';

test('flatten simple chapter>paragraph', () => {
    const input: Descendant[] = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I.' }, [
                createList(MetaType.PARAGRAPH, {}, [
                    createListItem(MetaType.PARAGRAPH, '1', { title: 'Hello World' }),
                ]),
            ]),
        ]),
    ];
    
    const output = [{
        id: 'chapter-1',
        originId: 'chapter-1',
        content: 'I.',
        path: [0, 0, 0],
    }, {
        id: 'chapter-1.paragraph-1',
        originId: 'chapter-1.paragraph-1',
        content: 'Hello World',
        path: [0, 0, 1, 0, 0],
    }];

    expect(flattenSlateParagraphs(input)).toStrictEqual(output);
});

test('flatten chapter>paragraph>sen', () => {
    const input: Descendant[] = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I.' }, [
                createList(MetaType.PARAGRAPH, {}, [
                    createListItem(MetaType.PARAGRAPH, '1', { text: ['s1', 's2'] }),
                ]),
            ]),
        ]),
    ];
    
    const output = [{
        id: 'chapter-1',
        originId: 'chapter-1',
        content: 'I.',
        path: [0, 0, 0],
    }, {
        id: 'chapter-1.paragraph-1',
        originId: 'chapter-1.paragraph-1',
        content: 's1s2',
        path: [0, 0, 1, 0, 0],
    }];

    expect(flattenSlateParagraphs(input)).toStrictEqual(output);
});

test('flatten multiple levels chapter>art>paragraph', () => {
    const input: Descendant[] = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I.' }, [
                createList(MetaType.ART, {}, [
                    createListItem(MetaType.ART, '1', { title: '1. gr.' }, [
                        createList(MetaType.PARAGRAPH, {}, [
                            createListItem(MetaType.PARAGRAPH, '1', { title: 'Hello World' }),
                        ]),
                    ]),
                ]),
            ]),
        ]),
    ];
    
    const output = [{
        id: 'chapter-1',
        originId: 'chapter-1',
        content: 'I.',
        path: [0, 0, 0],
    }, {
        id: 'chapter-1.art-1',
        originId: 'chapter-1.art-1',
        content: '1. gr.',
        path: [0, 0, 1, 0, 0],
    }, {
        id: 'chapter-1.art-1.paragraph-1',
        originId: 'chapter-1.art-1.paragraph-1',
        content: 'Hello World',
        path: [0, 0, 1, 0, 1, 0, 0],
    }];

    expect(flattenSlateParagraphs(input)).toStrictEqual(output);
});

test('in order: title + name, text', () => {
    const input: Descendant[] = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I.', name: 'kafli', text: 'text' }),
        ]),
    ];
    
    const output = [{
        id: 'chapter-1',
        originId: 'chapter-1',
        content: 'I.kaflitext',
        path: [0, 0, 0],
    }];

    expect(flattenSlateParagraphs(input)).toStrictEqual(output);
});