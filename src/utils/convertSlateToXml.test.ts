import { Node } from "slate";
import { MetaType, createList, createListItem, createSlateRoot } from "../components/Editor/Slate";
import minify from "minify-xml";
import convertSlateToXml from "./convertSlateToXml";

test('convert chapters', () => {
    const input: Node = createSlateRoot([
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '1', 'I.'),
            createListItem(MetaType.CHAPTER, '2', 'II.'),
        ]),
    ]);
    const output = `
        <chapter nr="1" nr-type="roman" roman-nr="I">
            <nr-title>I.</nr-title>
        </chapter>
        <chapter nr="2" nr-type="roman" roman-nr="II">
            <nr-title>II.</nr-title>
        </chapter>
    `

    expect(minify(convertSlateToXml(input))).toBe(minify(output));
});