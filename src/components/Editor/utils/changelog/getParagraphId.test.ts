import { Node } from "slate";
import { createSlateRoot, MetaType } from "../../Slate";
import createList from "../slate/createList";
import createListItem from "../slate/createListItem";
import getParagraphId from "./getParagraphId";

test('getParagraphId 1 level deep', () => {
    const input: Node = createSlateRoot([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title:  'I.' }),
            createListItem(MetaType.CHAPTER, '2', { title:  'II.' }),
        ]),
    ]);
    const output = `${MetaType.CHAPTER}-2`;

    expect(getParagraphId(input, [0, 1, 0])).toBe(output);
});

test('getParagraphId 2 levels deep', () => {
    const input: Node = createSlateRoot([
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
    const input: Node = createSlateRoot([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '2', { title:  'II.' }, [
                createList(MetaType.PARAGRAPH, {}, [
                    createListItem(MetaType.PARAGRAPH, '1', { name: 'one. two.' }),
                ]),
            ]),
        ]),
    ]);
    const output = `${MetaType.CHAPTER}-2.${MetaType.PARAGRAPH}-1.name`;

    expect(getParagraphId(input, [0, 0, 1, 0, 0, 0])).toBe(output);
});

test('title', () => {
    const input: Node = createSlateRoot([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '2', { title:  'II.' }, [
                createList(MetaType.PARAGRAPH, {}, [
                    createListItem(MetaType.PARAGRAPH, '1', { title:  'one. two.' }),
                ]),
            ]),
        ]),
    ]);
    const output = `${MetaType.CHAPTER}-2.${MetaType.PARAGRAPH}-1.title`;

    expect(getParagraphId(input, [0, 0, 1, 0, 0, 0])).toBe(output);
});

test('sentence', () => {
    const input: Node = createSlateRoot([
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '2', { title:  'II.' }, [
                createList(MetaType.PARAGRAPH, {}, [
                    createListItem(MetaType.PARAGRAPH, '1', { text: 'one. two.' }),
                ]),
            ]),
        ]),
    ]);
    const output = `${MetaType.CHAPTER}-2.${MetaType.PARAGRAPH}-1.sen-1`;

    expect(getParagraphId(input, [0, 0, 1, 0, 0, 0])).toBe(output);
});