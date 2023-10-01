import { Descendant } from "slate";
import importXml from "./importXml";
import createEditorWithPlugins from "../../plugins/createEditorWithPlugins";
import { MetaType } from "../../Slate";
import createList from "../slate/createList";
import createListItem from "../slate/createListItem";
import { TAGS } from "../../../../config/tags";

test('import meta and law chapters', () => {
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
            createList(MetaType.CHAPTER, {}, [
                createListItem(MetaType.CHAPTER, '1', { title: 'I.', text: 'Sendiráð skulu.' }),
            ]),
        ],
    };

    expect(importXml(input)).toStrictEqual(expected);
});


test('roman list item', () => {
    const input = `
        <law>
            <chapter nr="1" nr-type="roman" roman-nr="I">
                <nr-title>I.</nr-title>
            </chapter>
        </law>
    `;
    const output: Descendant[] = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I.' }),
        ]),
    ];

    expect(importXml(input).slate).toStrictEqual(output);
});

test('list item with title', () => {
    const input = `
        <law>
            <art nr="1">
                <nr-title>1. gr.</nr-title>
            </art>
        </law>
    `;
    const output: Descendant[] = [
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, '1', { title: '1. gr.' }),
        ]),
    ];

    expect(importXml(input).slate).toStrictEqual(output);
});

test('empty list item', () => {
    const input = `
        <law>
            <art nr="1"></art>
        </law>
    `;
    const output: Descendant[] = [
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, '1'),
        ]),
    ];

    expect(importXml(input).slate).toStrictEqual(output);
});

test('list item with title+name+sen', () => {
    const input = `
        <law>
            <art nr="1">
                <nr-title>1. gr.</nr-title>
                <name>Markmið.</name>
                <sen nr="1">text</sen>
            </art>
        </law>
    `;
    const output: Descendant[] = [
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, '1', { title: '1. gr.', name: 'Markmið.', text: 'text' }),
        ]),
    ];

    expect(importXml(input).slate).toStrictEqual(output);
});

test('list item with 2 sentences', () => {
    const input = `
        <law>
            <art nr="1">
                <sen nr="1">one.</sen>
                <sen nr="2">two.</sen>
            </art>
        </law>
    `;
    const output: Descendant[] = [
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, '1', { text: ['one.', 'two.'] }),
        ]),
    ];

    expect(importXml(input).slate).toStrictEqual(output);
});

test('multiple list items with text', () => {
    const input = `
        <law>
            <art nr="1"><sen nr="1">first</sen></art>
            <art nr="2"><sen nr="1">second</sen></art>
        </law>
    `;
    const output: Descendant[] = [
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, '1', { text: 'first' }),
            createListItem(MetaType.ART, '2', { text: 'second' }),
        ]),
    ];

    expect(importXml(input).slate).toStrictEqual(output);
});

test('multiple nested numart', () => {
    const input = `
        <law>
            <numart nr="1" type="numeric">
                <numart nr="a" style-note="inline-with-parent" type="alphabet">
                    <art nr="1">
                        <nr-title>a.</nr-title>
                        <sen nr="1">Sendiráðin í Genf.</sen>
                    </art>
                </numart>
            </numart>
        </law>
    `;
    const output: Descendant[] = [
        createList(MetaType.NUMART, {}, [
            createListItem(MetaType.NUMART, '1', { nrType: 'numeric' }, [
                createList(MetaType.NUMART, {}, [
                    createListItem(MetaType.NUMART, 'a', { nrType: 'alphabet', styleNote: 'inline-with-parent' }, [
                        createList(MetaType.ART, {}, [
                            createListItem(MetaType.ART, '1', { title: 'a.', text: 'Sendiráðin í Genf.' }),
                        ]),
                    ]),
                ]),
            ]),
        ]),
    ];

    expect(importXml(input).slate).toStrictEqual(output);
});

test('list item with title and 2 sentences', () => {
    const input = `
        <law>
            <art nr="1">
                <nr-title>a.</nr-title>
                <sen nr="1">Sendiráð skulu.</sen>
                <sen nr="2">Sendiráðin í Genf.</sen>
            </art>
        </law>
    `;
    const output: Descendant[] = [
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, '1', { title: 'a.', text: ['Sendiráð skulu.', 'Sendiráðin í Genf.'] }),
        ]),
    ];

    expect(importXml(input).slate).toStrictEqual(output);
});

test('title+sen+numart needs to become one ListItem', () => {
    const input = `
        <law>
            <art nr="1">
                <nr-title>2.</nr-title>
                <sen nr="1">Umdæmi sendiráða skulu vera sem hér segir:</sen>
                <numart nr="a" type="alphabet">
                    <art nr="1">
                        <nr-title>a.</nr-title>
                        <sen nr="1">Berlín.</sen>
                    </art>
                </numart>
            </art>
        </law>
    `;
    const output: Descendant[] = [
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, '1', { title: '2.', text: 'Umdæmi sendiráða skulu vera sem hér segir:' }, [
                createList(MetaType.NUMART, {}, [
                    createListItem(MetaType.NUMART, 'a', { nrType: 'alphabet' }, [
                        createList(MetaType.ART, {}, [
                            createListItem(MetaType.ART, '1', { title: 'a.', text: 'Berlín.' }),
                        ]),
                    ]),
                ]),
            ]),
        ]),
    ];

    expect(importXml(input).slate).toStrictEqual(output);
});

// TODO: implement link handling
test('sen link', () => {
    const input = `
        <law>
            <art nr="1">
                <sen nr="1">Úrskurður þessi öðlast þegar gildi.</sen>
                <sen nr="2">
                    <a href="http://www.althingi.is/lagasafn/leidbeiningar" title="Hér hefur annaðhvort verið fellt brott ákvæði um breytingar á öðrum lögum eða um brottfall þeirra, eða úrelt ákvæði til bráðabirgða. Sjá 7. lið í leiðbeiningum um notkun lagasafns.">…</a>
                </sen>
            </art>
        </law>
    `;
    const output: Descendant[] = [
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, '1', { text: 'Úrskurður þessi öðlast þegar gildi.' }),
        ]),
    ];

    expect(importXml(input).slate).toStrictEqual(output);
});

test('ensure after editor normalization, content stays the same (if not it means import is not clean, but previously was implemented to match the desired structure)', () => {
    const input = `
        <law>
            <art nr="1">
                <nr-title>a.</nr-title>
                <sen nr="1">Sendiráð skulu.</sen>
                <sen nr="2">Sendiráðin í Genf.</sen>
            </art>
        </law>
    `;
    const inputSlate = importXml(input).slate;

    const editor = createEditorWithPlugins();
    editor.children = inputSlate;
    editor.normalize({ force: true })

    expect(inputSlate).toStrictEqual(editor.children);
});

test('ignore virtual tags but still import their children', () => {
    const input = `
        <law>
            <chapter nr="1" nr-type="roman" roman-nr="I">
                <nr-title>I.</nr-title>
                <numart nr="a" type="alphabet">
                    <nr-title>a.</nr-title>
                    <art nr="1">
                        <sen nr="1">Sendiráðin í Genf.</sen>
                    </art>
                </numart>
            </chapter>
        </law>
    `;
    const output: Descendant[] = [
        createList(MetaType.CHAPTER, {}, [
            createListItem(MetaType.CHAPTER, '1', { title: 'I.' }, [
                createList(MetaType.NUMART, {}, [
                    createListItem(MetaType.NUMART, 'a', { nrType: 'alphabet',  title: 'a.', text: 'Sendiráðin í Genf.' }),
                ]),
            ]),
        ]),
    ];

    // change art to be virtual
    const oldDisplay = TAGS.art.display
    TAGS.art.display = 'virtual';

    expect(importXml(input).slate).toStrictEqual(output);
    
    // restore art
    TAGS.art.display = oldDisplay;
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
//                 <art nr="1">
//                     <nr-title>2.</nr-title>
//                     <sen nr="1">Umdæmi sendiráða skulu vera sem hér segir:</sen>
//                     <numart nr="a" type="alphabet">
//                         <art nr="1">
//                             <nr-title>a.</nr-title>
//                             <sen nr="1">&lt;b&gt; Berlín.</sen>
//                             <sen nr="2">&lt;/b&gt; Auk Þýskalands skal umdæmi sendiráðsins vera Tékkland.</sen>
//                         </art>
//                     </numart>
//                 </art>
//             </numart>
//             <numart nr="5" type="numeric">
//                 <art nr="1">
//                     <nr-title>5.</nr-title>
//                     <sen nr="1">Utanríkisráðuneytið fer með fyrirsvar gagnvart öðrum alþjóðastofnunum og ríkjum sem Ísland hefur stjórnmálasamband við, m.a. með skipun sendiherra eða fastafulltrúa með búsetu í Reykjavík eftir því sem ástæða er til.</sen>
//                 </art>
//             </numart>
//             <art nr="1">
//                 <sen nr="1">Úrskurður þessi öðlast þegar gildi.</sen>
//                 <sen nr="2">
//                     <a href="http://www.althingi.is/lagasafn/leidbeiningar" title="Hér hefur annaðhvort verið fellt brott ákvæði um breytingar á öðrum lögum eða um brottfall þeirra, eða úrelt ákvæði til bráðabirgða. Sjá 7. lið í leiðbeiningum um notkun lagasafns.">…</a>
//                 </sen>
//             </art>
//         </law>    
//     `;
//     const inputSlate = importXml(input).slate;

//     const editor = createEditorWithPlugins();
//     editor.children = inputSlate;
//     editor.normalize({ force: true })

//     expect(inputSlate).toStrictEqual(editor.children);
// });
