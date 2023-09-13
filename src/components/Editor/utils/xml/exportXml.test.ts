import { Node } from "slate";
import { MetaType, createList, createListItem, createSlateRoot } from "../../Slate";
import exportXml from "./exportXml";
import beautify from "xml-beautifier";

test('export chapters', () => {
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

    expect(exportXml(input)).toBe(beautify(output));
});

test('export xml header', () => {
    const input: Node = createSlateRoot([]);
    const output = `
        <?xml version="1.0" encoding="utf-8"?>
    `;
    
    expect(exportXml(input, true)).toBe(beautify(output));
});

test('export document meta data', () => {
    const input: Node = createSlateRoot([
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '1', 'I.'),
        ]),
    ]);
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
            <chapter nr="1" nr-type="roman" roman-nr="I">
                <nr-title>I.</nr-title>
            </chapter>
        </law>
    `;

    expect(exportXml(input, false, documentMeta)).toBe(beautify(output));
});