import { Node } from "slate";
import { MetaType, createList, createListItem, createSlateRoot } from "../components/Editor/Slate";
import getParagraphId from "./getParagraphId";

test('getParagraphId 1 level deep', () => {
    const input: Node = createSlateRoot([
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '1', 'I.'),
            createListItem(MetaType.CHAPTER, '2', 'II.'),
        ]),
    ]);
    const output = `${MetaType.CHAPTER}-2`;

    expect(getParagraphId(input, [0, 1, 0])).toBe(output);
});

test('getParagraphId 2 levels deep', () => {
    const input: Node = createSlateRoot([
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '2', 'II.', [
                createList(MetaType.PARAGRAPH, [
                    createListItem(MetaType.PARAGRAPH, '1', 'one. two.'),
                ]),
            ]),
        ]),
    ]);
    const output = `${MetaType.CHAPTER}-2.${MetaType.PARAGRAPH}-1`;

    expect(getParagraphId(input, [0, 0, 1, 0, 0])).toBe(output);
});