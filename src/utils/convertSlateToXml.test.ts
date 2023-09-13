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

test('add xml header', () => {
    const input: Node = createSlateRoot([]);
    const output = `
        <?xml version="1.0" encoding="utf-8"?>
    `;
    
    expect(convertSlateToXml(input, true)).toBe(beautify(output));
});

test('add document meta data', () => {
    const input: Node = createSlateRoot([]);
    const documentMeta = {
        nr: '33',
        year: '1944',
        name: 'Stjórnarskrá lýðveldisins Íslands',
        date: '1944-06-17',
        original: '1944 nr. 33 17. júní',
        ministerClause: '&lt;a href=&quot;http://www.althingi.is//dba-bin/fe&quot;&gt;',
    };
    const output = `
        <law nr="33" year="1944">
            <name>Stjórnarskrá lýðveldisins Íslands</name>
            <num-and-date>
            <date>1944-06-17</date>
            <num>33</num>
            <original>1944 nr. 33 17. júní</original>
            </num-and-date>
            <minister-clause>&lt;a href=&quot;http://www.althingi.is//dba-bin/fe&quot;&gt;</minister-clause>
        </law>
    `;

    expect(convertSlateToXml(input, false, documentMeta)).toBe(beautify(output));
});