import { Node } from "slate";
import flattenSlateParagraphs from "./flattenSlateParagraphs";
import { createSlateRoot, createList, MetaType, createListItem } from "../../Slate";

test('flatten simple chapter>paragraph', () => {
    const inputA: Node = createSlateRoot([
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '1', 'I.', undefined, [
                createList(MetaType.PARAGRAPH, [
                    createListItem(MetaType.PARAGRAPH, '1', 'Hello World'),
                ]),
            ]),
        ]),
    ]);
    
    const output = [{
        id: 'chapter-1.title',
        content: 'I. ',
        path: [0, 0, 0, 0],
    }, {
        id: 'chapter-1.paragraph-1.title',
        content: 'Hello World ',
        path: [0, 0, 1, 0, 0, 0],
    }];

    expect(flattenSlateParagraphs(inputA)).toStrictEqual(output);
});

test('flatten chapter>paragraph>sen', () => {
    const inputA: Node = createSlateRoot([
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '1', 'I.', undefined, [
                createList(MetaType.PARAGRAPH, [
                    createListItem(MetaType.PARAGRAPH, '1', undefined, ['s1', 's2']),
                ]),
            ]),
        ]),
    ]);
    
    const output = [{
        id: 'chapter-1.title',
        content: 'I. ',
        path: [0, 0, 0, 0],
    }, {
        id: 'chapter-1.paragraph-1.sen-1',
        content: 's1',
        path: [0, 0, 1, 0, 0, 0],
    }, {
        id: 'chapter-1.paragraph-1.sen-2',
        content: 's2',
        path: [0, 0, 1, 0, 0, 1],
    }];

    expect(flattenSlateParagraphs(inputA)).toStrictEqual(output);
});

test('flatten multiple levels chapter>art>paragraph', () => {
    const inputA: Node = createSlateRoot([
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '1', 'I.', undefined, [
                createList(MetaType.ART, [
                    createListItem(MetaType.ART, '1', '1. gr.', undefined, [
                        createList(MetaType.PARAGRAPH, [
                            createListItem(MetaType.PARAGRAPH, '1', 'Hello World'),
                        ]),
                    ]),
                ]),
            ]),
        ]),
    ]);
    
    const output = [{
        id: 'chapter-1.title',
        content: 'I. ',
        path: [0, 0, 0, 0],
    }, {
        id: 'chapter-1.art-1.title',
        content: '1. gr. ',
        path: [0, 0, 1, 0, 0, 0],
    }, {
        id: 'chapter-1.art-1.paragraph-1.title',
        content: 'Hello World ',
        path: [0, 0, 1, 0, 1, 0, 0, 0],
    }];

    expect(flattenSlateParagraphs(inputA)).toStrictEqual(output);
});