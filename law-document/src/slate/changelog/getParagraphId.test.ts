import { Node } from 'slate';
import { MetaType } from '../Slate';
import { createList } from '../transformations/createList';
import { createListItem } from '../transformations/createListItem';
import { getParagraphId } from './getParagraphId';

/**
 * Create empty root node, for testing purposes only. This would usually be an instance of Editor.
 * @param children 
 * @returns root node
 */
const wrapRootNode = (children: Node[]): Node => {
    return { children } as Node;
};

test('getParagraphId 1 level deep', () => {
    const input = wrapRootNode([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title:  'I.' }),
            createListItem(MetaType.CHAPTER, '2', { title:  'II.' }),
        ]),
    ]);
    const output = `${MetaType.CHAPTER}-2`;

    expect(getParagraphId(input, [0, 1, 0])).toBe(output);
});

test('getParagraphId 2 levels deep', () => {
    const input: Node = wrapRootNode([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '2', { title:  'II.' }, [
                createList(MetaType.PARAGRAPH, {}, [
                    createListItem(MetaType.PARAGRAPH, '1', { title:  'one. two.' }),
                ]),
            ]),
        ]),
    ]);
    const output = `${MetaType.CHAPTER}-2.${MetaType.PARAGRAPH}-1`;

    expect(getParagraphId(input, [0, 0, 1, 0, 0])).toBe(output);
});

test('name', () => {
    const input: Node = wrapRootNode([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '2', { title:  'II.' }, [
                createList(MetaType.PARAGRAPH, {}, [
                    createListItem(MetaType.PARAGRAPH, '1', { name: 'one. two.' }),
                ]),
            ]),
        ]),
    ]);
    const output = `${MetaType.CHAPTER}-2.${MetaType.PARAGRAPH}-1`;

    expect(getParagraphId(input, [0, 0, 1, 0, 0, 0])).toBe(output);
});

test('title', () => {
    const input: Node = wrapRootNode([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '2', { title:  'II.' }, [
                createList(MetaType.PARAGRAPH, {}, [
                    createListItem(MetaType.PARAGRAPH, '1', { title:  'one. two.' }),
                ]),
            ]),
        ]),
    ]);
    const output = `${MetaType.CHAPTER}-2.${MetaType.PARAGRAPH}-1`;

    expect(getParagraphId(input, [0, 0, 1, 0, 0, 0])).toBe(output);
});

test('sentence', () => {
    const input: Node = wrapRootNode([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '2', { title:  'II.' }, [
                createList(MetaType.PARAGRAPH, {}, [
                    createListItem(MetaType.PARAGRAPH, '1', { text: 'one. two.' }),
                ]),
            ]),
        ]),
    ]);
    const output = `${MetaType.CHAPTER}-2.${MetaType.PARAGRAPH}-1`;

    expect(getParagraphId(input, [0, 0, 1, 0, 0, 0])).toBe(output);
});

test('include target node itself if its a listItem', () => {
    const input: Node = wrapRootNode([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '2', { title:  'II.' }, [
                createList(MetaType.PARAGRAPH, {}, [
                    createListItem(MetaType.PARAGRAPH, '1', { text: 'one. two.' }),
                ]),
            ]),
        ]),
    ]);
    const output = `${MetaType.CHAPTER}-2.${MetaType.PARAGRAPH}-1`;

    expect(getParagraphId(input, [0, 0, 1, 0])).toBe(output);
});