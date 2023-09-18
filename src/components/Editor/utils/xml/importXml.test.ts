import { Descendant } from "slate";
import { createList, MetaType, createListItem, createNumericNumart, createInlineLetterNumart } from "../../Slate";
import importXml from "./importXml";

test('import xml', () => {
    const input = `
        <?xml version="1.0" encoding="utf-8"?>
        <law nr="33" year="1944">
            <name>Stjórnarskrá lýðveldisins Íslands</name>
            <num-and-date>
                <date>1944-06-17</date>
                <num>33</num>
                <original>1944 nr. 33 17. júní</original>
            </num-and-date>
            <minister-clause>links</minister-clause>
            <chapter nr="1" nr-type="roman" roman-nr="I">
                <nr-title>I.</nr-title>
            </chapter>
        </law>
    `;

    const expected = {
        meta: {
            nr: '33',
            year: '1944',
            name: 'Stjórnarskrá lýðveldisins Íslands',
            date: '1944-06-17',
            original: '1944 nr. 33 17. júní',
            ministerClause: 'links',
        },
        slate: [
            createList(MetaType.CHAPTER, [
                createListItem(MetaType.CHAPTER, '1', 'I.'),
            ]),
        ],
    };

    expect(importXml(input)).toStrictEqual(expected);
});


test('<chapter> to <ol><li>', () => {
    const input = `
        <law>
            <chapter nr="1" nr-type="roman" roman-nr="I">
                <nr-title>I.</nr-title>
            </chapter>
        </law>
    `;
    const output: Descendant[] = [
        createList(MetaType.CHAPTER, [
            createListItem(MetaType.CHAPTER, '1', 'I.'),
        ]),
    ];

    expect(importXml(input).slate).toStrictEqual(output);
});

test('<art> to <ol><li>', () => {
    const input = `
        <law>
            <art nr="1">
                <nr-title>1. gr.</nr-title>
            </art>
        </law>
    `;
    const output: Descendant[] = [
        createList(MetaType.ART, [
            createListItem(MetaType.ART, '1', '1. gr.'),
        ]),
    ];

    expect(importXml(input).slate).toStrictEqual(output);
});

test('<subart> to <ol><li>', () => {
    const input = `
        <law>
            <subart nr="1"></subart>
        </law>
    `;
    const output: Descendant[] = [
        createList(MetaType.SUBART, [
            createListItem(MetaType.SUBART, '1'),
        ]),
    ];

    expect(importXml(input).slate).toStrictEqual(output);
});

test('<title>', () => {
    const input = `
        <law>
            <subart nr="1">
                <nr-title>1. gr.</nr-title>
            </subart>
        </law>
    `;
    const output: Descendant[] = [
        createList(MetaType.SUBART, [
            createListItem(MetaType.SUBART, '1', '1. gr.'),
        ]),
    ];

    expect(importXml(input).slate).toStrictEqual(output);
});

test('<paragraph> to <ol><li>', () => {
    const input = `
        <law>
            <paragraph nr="1"></paragraph>
        </law>
    `;
    const output: Descendant[] = [
        createList(MetaType.PARAGRAPH, [
            createListItem(MetaType.PARAGRAPH, '1'),
        ]),
    ];

    expect(importXml(input).slate).toStrictEqual(output);
});

test('<paragraph><sen><sen> to <ol><li><p>', () => {
    const input = `
        <law>
            <paragraph nr="1">
                <sen nr="1">one.</sen>
                <sen nr="2">two.</sen>
            </paragraph>
        </law>
    `;
    const output: Descendant[] = [
        createList(MetaType.PARAGRAPH, [
            createListItem(MetaType.PARAGRAPH, '1', undefined, 'one. two.'),
        ]),
    ];

    expect(importXml(input).slate).toStrictEqual(output);
});

test('multiple <paragraph> to <ol><li>', () => {
    const input = `
        <law>
            <paragraph nr="1">first</paragraph>
            <paragraph nr="2">second</paragraph>
        </law>
    `;
    const output: Descendant[] = [
        createList(MetaType.PARAGRAPH, [
            createListItem(MetaType.PARAGRAPH, '1', undefined, 'first'),
            createListItem(MetaType.PARAGRAPH, '2', undefined, 'second'),
        ]),
    ];

    expect(importXml(input).slate).toStrictEqual(output);
});

test('numart', () => {
    const input = `
        <law>
            <numart nr="1" type="numeric">
                <numart nr="a" style-note="inline-with-parent" type="alphabet">
                    <paragraph nr="1">
                        <nr-title>a.</nr-title>
                        <sen nr="1">Sendiráð skulu.</sen>
                        <sen nr="2">Sendiráðin í Genf.</sen>
                    </paragraph>
                </numart>
            </numart>
        </law>
    `;
    const output: Descendant[] = [
        createList(MetaType.NUMART, [
            createNumericNumart('1', undefined, undefined, [
                createList(MetaType.NUMART, [
                    createInlineLetterNumart('a', undefined, undefined, [
                        createList(MetaType.PARAGRAPH, [
                            createListItem(MetaType.PARAGRAPH, '1', 'a.', 'Sendiráð skulu. Sendiráðin í Genf.'),
                        ]),
                    ]),
                ]),
            ]),
        ]),
    ];

    expect(importXml(input).slate).toStrictEqual(output);
});
