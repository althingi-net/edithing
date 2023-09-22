import { Descendant } from "slate";
import { createList, MetaType, createListItem, createNumericNumart, createLetterNumart, createInlineLetterNumart } from "../../Slate";
import importXml from "./importXml";
import createEditorWithPlugins from "../../plugins/createEditorWithPlugins";

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
                <sen>Sendiráð skulu.</sen>
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
                createListItem(MetaType.CHAPTER, '1', 'I.', 'Sendiráð skulu.'),
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
            createListItem(MetaType.PARAGRAPH, '1', undefined, ['one.', 'two.']),
        ]),
    ];

    expect(importXml(input).slate).toStrictEqual(output);
});

test('multiple <paragraph> to <ol><li>', () => {
    const input = `
        <law>
            <paragraph nr="1"><sen nr="1">first</sen></paragraph>
            <paragraph nr="2"><sen nr="1">second</sen></paragraph>
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
                        <sen nr="1">Sendiráðin í Genf.</sen>
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
                            createListItem(MetaType.PARAGRAPH, '1', 'a.', 'Sendiráðin í Genf.'),
                        ]),
                    ]),
                ]),
            ]),
        ]),
    ];

    expect(importXml(input).slate).toStrictEqual(output);
});

test('multiple sen', () => {
    const input = `
        <law>
            <paragraph nr="1">
                <nr-title>a.</nr-title>
                <sen nr="1">Sendiráð skulu.</sen>
                <sen nr="2">Sendiráðin í Genf.</sen>
            </paragraph>
        </law>
    `;
    const output: Descendant[] = [
        createList(MetaType.PARAGRAPH, [
            createListItem(MetaType.PARAGRAPH, '1', 'a.', ['Sendiráð skulu.', 'Sendiráðin í Genf.']),
        ]),
    ];

    expect(importXml(input).slate).toStrictEqual(output);
});

test('title+sen+numart need to become one ListItem', () => {
    const input = `
        <law>
            <paragraph nr="1">
                <nr-title>2.</nr-title>
                <sen nr="1">Umdæmi sendiráða skulu vera sem hér segir:</sen>
                <numart nr="a" type="alphabet">
                    <paragraph nr="1">
                        <nr-title>a.</nr-title>
                        <sen nr="1">Berlín.</sen>
                    </paragraph>
                </numart>
            </paragraph>
        </law>
    `;
    const output: Descendant[] = [
        createList(MetaType.PARAGRAPH, [
            createListItem(MetaType.PARAGRAPH, '1', '2.', 'Umdæmi sendiráða skulu vera sem hér segir:', [
                createList(MetaType.NUMART, [
                    createLetterNumart('a', undefined, undefined, [
                        createList(MetaType.PARAGRAPH, [
                            createListItem(MetaType.PARAGRAPH, '1', 'a.', ['Berlín.']),
                        ]),
                    ]),
                ]),
            ]),
        ]),
    ];

    expect(importXml(input).slate).toStrictEqual(output);
});

test('sen link', () => {
    const input = `
        <law>
            <paragraph nr="1">
                <sen nr="1">Úrskurður þessi öðlast þegar gildi.</sen>
                <sen nr="2">
                    <a href="http://www.althingi.is/lagasafn/leidbeiningar" title="Hér hefur annaðhvort verið fellt brott ákvæði um breytingar á öðrum lögum eða um brottfall þeirra, eða úrelt ákvæði til bráðabirgða. Sjá 7. lið í leiðbeiningum um notkun lagasafns.">…</a>
                </sen>
            </paragraph>
        </law>
    `;
    const output: Descendant[] = [
        createList(MetaType.PARAGRAPH, [
            createListItem(MetaType.PARAGRAPH, '1', undefined, 'Úrskurður þessi öðlast þegar gildi.'),
        ]),
    ];

    expect(importXml(input).slate).toStrictEqual(output);
});

test('ensure after editor normalization, content stays the same (if not it means there is a bug in the import)', () => {
    const input = `
        <law>
            <paragraph nr="1">
                <nr-title>a.</nr-title>
                <sen nr="1">Sendiráð skulu.</sen>
                <sen nr="2">Sendiráðin í Genf.</sen>
            </paragraph>
        </law>
    `;
    const inputSlate = importXml(input).slate;

    const editor = createEditorWithPlugins();
    editor.children = inputSlate;
    editor.normalize({ force: true })

    expect(inputSlate).toStrictEqual(editor.children);
});

// TODO: fix this test, properly its the list plugin normalization which merges the two root lists.. maybe need to have meta object flattened into the node object
// test('ensure after editor normalization, content stays the same (if not it means there is a bug in the import)', () => {
//     const input = `
//         <?xml version="1.0" encoding="utf-8"?>
//         <law nr="93" year="2022">
//             <name>Forsetaúrskurður um sendiráð, fastanefndir hjá alþjóðastofnunum og aðalræðisskrifstofur</name>
//             <num-and-date>
//                 <date>2022-08-18</date>
//                 <num>93</num>
//                 <original>2022 nr. 93 18. ágúst</original>
//             </num-and-date>
//             <minister-clause>&lt;small&gt; &lt;b&gt; Tók gildi 20. ágúst 2022. &lt;/b&gt; &lt;/small&gt;</minister-clause>
//             <numart nr="2" type="numeric">
//                 <paragraph nr="1">
//                     <nr-title>2.</nr-title>
//                     <sen nr="1">Umdæmi sendiráða skulu vera sem hér segir:</sen>
//                     <numart nr="a" type="alphabet">
//                         <paragraph nr="1">
//                             <nr-title>a.</nr-title>
//                             <sen nr="1">&lt;b&gt; Berlín.</sen>
//                             <sen nr="2">&lt;/b&gt; Auk Þýskalands skal umdæmi sendiráðsins vera Tékkland.</sen>
//                         </paragraph>
//                     </numart>
//                 </paragraph>
//             </numart>
//             <numart nr="5" type="numeric">
//                 <paragraph nr="1">
//                     <nr-title>5.</nr-title>
//                     <sen nr="1">Utanríkisráðuneytið fer með fyrirsvar gagnvart öðrum alþjóðastofnunum og ríkjum sem Ísland hefur stjórnmálasamband við, m.a. með skipun sendiherra eða fastafulltrúa með búsetu í Reykjavík eftir því sem ástæða er til.</sen>
//                 </paragraph>
//             </numart>
//             <paragraph nr="1">
//                 <sen nr="1">Úrskurður þessi öðlast þegar gildi.</sen>
//                 <sen nr="2">
//                     <a href="http://www.althingi.is/lagasafn/leidbeiningar" title="Hér hefur annaðhvort verið fellt brott ákvæði um breytingar á öðrum lögum eða um brottfall þeirra, eða úrelt ákvæði til bráðabirgða. Sjá 7. lið í leiðbeiningum um notkun lagasafns.">…</a>
//                 </sen>
//             </paragraph>
//         </law>    
//     `;
//     const inputSlate = importXml(input).slate;

//     const editor = createEditorWithPlugins();
//     editor.children = inputSlate;
//     editor.normalize({ force: true })

//     expect(inputSlate).toStrictEqual(editor.children);
// });
