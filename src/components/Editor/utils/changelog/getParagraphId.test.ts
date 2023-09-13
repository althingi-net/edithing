import { Node } from "slate";
import getParagraphId from "./getParagraphId";
import { createSlateRoot, createList, MetaType, createListItem } from "../../Slate";

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