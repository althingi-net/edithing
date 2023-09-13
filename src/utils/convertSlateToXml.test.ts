import { Node } from "slate";
import { MetaType, createList, createListItem, createSlateRoot } from "../components/Editor/Slate";
import convertSlateToXml from "./convertSlateToXml";
import beautify from "xml-beautifier";

test('convert chapters', () => {
    const input: Node = createSlateRoot([
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '1', 'I.', [
                createList(MetaType.PARAGRAPH, [
                    createListItem(MetaType.PARAGRAPH, '1', 'one.'),
                    createListItem(MetaType.PARAGRAPH, '2', 'two.'),
                ]),
            ]),
            createListItem(MetaType.CHAPTER, '2', 'II.'),
        ]),
    ]);
    const output = `
        <?xml version="1.0" encoding="utf-8"?>
        <chapter nr="1" nr-type="roman" roman-nr="I">
            <nr-title>I.</nr-title>
            <paragraph nr="1">one.</paragraph>
            <paragraph nr="2">two.</paragraph>
        </chapter>
        <chapter nr="2" nr-type="roman" roman-nr="II">
            <nr-title>II.</nr-title>
        </chapter>
    `

    expect(convertSlateToXml(input)).toBe(beautify(output));
});