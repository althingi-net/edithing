import { Node } from "slate";
import { MetaType, createList, createListItem, createSlateRoot } from "../components/Editor/Slate";
import flattenSlateParagraphs from "./flattenSlateParagraphs";

test('flatten simple chapter>paragraph', () => {
    const inputA: Node = createSlateRoot([
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '1', 'I.', [
                createList(MetaType.PARAGRAPH, [
                    createListItem(MetaType.PARAGRAPH, '1', 'Hello World'),
                ]),
            ]),
        ]),
    ]);
    
    const output = [{
        id: 'chapter-1',
        content: 'I.',
        path: [0, 0, 0],
    }, {
        id: 'chapter-1.paragraph-1',
        content: 'Hello World',
        path: [0, 0, 1, 0, 0],
    }];

    expect(flattenSlateParagraphs(inputA)).toStrictEqual(output);
});

test('flatten multiple levels chapter>art>paragraph', () => {
    const inputA: Node = createSlateRoot([
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '1', 'I.', [
                createList(MetaType.ART, [
                    createListItem(MetaType.ART, '1', '1. gr.', [
                        createList(MetaType.PARAGRAPH, [
                            createListItem(MetaType.PARAGRAPH, '1', 'Hello World'),
                        ]),
                    ]),
                ]),
            ]),
        ]),
    ]);
    
    const output = [{
        id: 'chapter-1',
        content: 'I.',
        path: [0, 0, 0],
    }, {
        id: 'chapter-1.art-1',
        content: '1. gr.',
        path: [0, 0, 1, 0, 0],
    }, {
        id: 'chapter-1.art-1.paragraph-1',
        content: 'Hello World',
        path: [0, 0, 1, 0, 1, 0, 0],
    }];

    expect(flattenSlateParagraphs(inputA)).toStrictEqual(output);
});