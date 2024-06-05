import parseXml from './parseXml';

let id = 0;

jest.mock('./state/createId', () => {
    return {
        createId: () => String(id++),
    };
});

describe('parseXml', () => {
    it('simple hierarchy', () => {
        id = 0;
        const xml = `
            <?xml version='1.0' encoding='utf-8'?>
            <law>
                <chapter nr="1">
                    <art nr="1">
                        <subart nr="1" />
                    </art>
                </chapter>
            </law>
        `;
        const result = parseXml(xml);
        
        expect(result).toEqual([
            {
                id: '0',
                type: 'law',
                attributes: {},
                children: [
                    {
                        id: '1',
                        type: 'chapter',
                        attributes: {
                            nr: '1',
                        },
                        children: [
                            {
                                id: '2',
                                type: 'art',
                                attributes: {
                                    nr: '1',
                                },
                                children: [
                                    {
                                        id: '3',
                                        type: 'subart',
                                        attributes: {
                                            nr: '1',
                                        },
                                        children: [],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ]);
    });

    it('real law document', () => {
        id = 0;

        const xml = `
            <?xml version='1.0' encoding='utf-8'?>
            <law nr="68" year="2023" law-type="law">
                <name>Lög um framkvæmd alþjóðlegra þvingunaraðgerða og frystingu fjármuna</name>
                <num-and-date>
                    <date>2023-06-22</date>
                    <num>68</num>
                    <original>2023 nr. 68 22. júní</original>
                </num-and-date>
                <minister-clause>&lt;a href="https://www.althingi.is/thingstorf/thingmalalistar-eftir-thingum/ferill/?ltg=153&amp;amp;mnr=974"&gt; &lt;i&gt; Ferill málsins á Alþingi. &lt;/i&gt; &lt;/a&gt; &lt;a href="https://www.althingi.is/altext/153/s/1522.html"&gt; &lt;i&gt; Frumvarp til laga. &lt;/i&gt; &lt;/a&gt; &lt;br/&gt; &lt;br/&gt; &lt;small&gt; &lt;b&gt; Tóku gildi 8. júlí 2023. &lt;/b&gt; &lt;/small&gt; &lt;br/&gt; Ef í lögum þessum er getið um ráðherra eða ráðuneyti án þess að málefnasvið sé tilgreint sérstaklega eða til þess vísað, er átt við &lt;b&gt; utanríkisráðherra &lt;/b&gt; eða &lt;b&gt; utanríkisráðuneyti &lt;/b&gt; sem fer með lög þessi. Upplýsingar um málefnasvið ráðuneyta skv. forsetaúrskurði er að finna hér.</minister-clause>
                <chapter nr="1" nr-type="roman" roman-nr="I">
                    <nr-title>I. kafli.</nr-title>
                    <name>Markmið, gildissvið og orðskýringar.</name>
                    <art nr="1">
                    <nr-title>1. gr.</nr-title>
                    <name>Markmið.</name>
                    <subart nr="1">
                        <sen nr="1">Markmiðið með lögum þessum er að:</sen>
                        <numart nr="1" nr-type="numeric">
                        <nr-title>1.</nr-title>
                        <sen nr="1">Mæla fyrir um framkvæmd þvingunaraðgerða sem ákveðnar eru af öryggisráði Sameinuðu þjóðanna á grundvelli 41. gr. sáttmála Sameinuðu þjóðanna, af alþjóðastofnunum eða af ríkjahópum til að viðhalda friði og öryggi og/eða tryggja virðingu fyrir mannréttindum og mannfrelsi.</sen>
                        </numart>
                        <numart nr="2" nr-type="numeric">
                        <nr-title>2.</nr-title>
                        <sen nr="1">Hindra fjármögnun hryðjuverka, mannréttindabrota og brota á mannúðarrétti og útbreiðslu og fjármögnun gereyðingarvopna.</sen>
                        </numart>
                    </subart>
                    </art>
                    <art nr="2">
                    <nr-title>2. gr.</nr-title>
                    <name>Gildissvið.</name>
                    <subart nr="1">
                        <sen nr="1">Lög þessi gilda um íslenska ríkisborgara og útlendinga sem geta sætt refsiábyrgð samkvæmt ákvæðum almennra hegningarlaga um refsilögsögu.</sen>
                        <sen nr="2">Íslenskir ríkisborgarar bera auk þess refsiábyrgð fyrir verknað sem þeir fremja erlendis þrátt fyrir að verknaðurinn sé ekki refsiverður samkvæmt lögum þess ríkis þar sem brotið var framið.</sen>
                    </subart>
                    <subart nr="2">
                        <sen nr="1">Lög þessi gilda um lögaðila sem skráðir eru eða stofnað er til samkvæmt íslenskum lögum hvar sem þeir starfa eða eru staðsettir.</sen>
                        <sen nr="2">Ef lögaðili er skráður eða til hans stofnað erlendis taka lögin til starfsemi hans að því leyti sem hún á sér stað innan íslenskrar lögsögu.</sen>
                    </subart>
                    </art>
                    <art nr="3">
                    <nr-title>3. gr.</nr-title>
                    <name>Orðskýringar.</name>
                    <numart nr="1" nr-type="numeric">
                        <nr-title>1.</nr-title>
                        <name>Aðili:</name>
                        <sen nr="1">Einstaklingur eða lögaðili, þ.m.t. ríkisstjórnir, fyrirtæki, samsteypur, stofnanir, sjóðir og samtök.</sen>
                    </numart>
                    <numart nr="2" nr-type="numeric">
                        <nr-title>2.</nr-title>
                        <name>Efnahagslegur auður:</name>
                        <sen nr="1">Hvers kyns eignir, efnislegar jafnt sem óefnislegar, færanlegar eða ófæranlegar, sem eru ekki fjármunir en sem unnt er að nota til að afla fjármuna, vöru eða þjónustu.</sen>
                    </numart>
                    </art>
                </chapter>
            </law>
        `;
        const result = parseXml(xml);
        
        expect(result).toEqual([
            {
                id: '0',
                type: 'law',
                attributes: {
                    nr: '68',
                    year: '2023',
                    'law-type': 'law',
                },
                children: [
                    {
                        id: '1',
                        type: 'name',
                        attributes: {
                        },
                        children: [
                        ],
                        text: 'Lög um framkvæmd alþjóðlegra þvingunaraðgerða og frystingu fjármuna',
                    },
                    {
                        id: '2',
                        type: 'num-and-date',
                        attributes: {
                        },
                        children: [
                            {
                                id: '3',
                                type: 'date',
                                attributes: {
                                },
                                children: [
                                ],
                                text: '2023-06-22',
                            },
                            {
                                id: '4',
                                type: 'num',
                                attributes: {
                                },
                                children: [
                                ],
                                text: 68,
                            },
                            {
                                id: '5',
                                type: 'original',
                                attributes: {
                                },
                                children: [
                                ],
                                text: '2023 nr. 68 22. júní',
                            },
                        ],
                    },
                    {
                        id: '6',
                        type: 'minister-clause',
                        attributes: {
                        },
                        children: [
                        ],
                        text: '<a href="https://www.althingi.is/thingstorf/thingmalalistar-eftir-thingum/ferill/?ltg=153&amp;mnr=974"> <i> Ferill málsins á Alþingi. </i> </a> <a href="https://www.althingi.is/altext/153/s/1522.html"> <i> Frumvarp til laga. </i> </a> <br/> <br/> <small> <b> Tóku gildi 8. júlí 2023. </b> </small> <br/> Ef í lögum þessum er getið um ráðherra eða ráðuneyti án þess að málefnasvið sé tilgreint sérstaklega eða til þess vísað, er átt við <b> utanríkisráðherra </b> eða <b> utanríkisráðuneyti </b> sem fer með lög þessi. Upplýsingar um málefnasvið ráðuneyta skv. forsetaúrskurði er að finna hér.',
                    },
                    {
                        id: '7',
                        type: 'chapter',
                        attributes: {
                            nr: '1',
                            'nr-type': 'roman',
                            'roman-nr': 'I',
                        },
                        children: [
                            {
                                id: '8',
                                type: 'title',
                                attributes: {
                                },
                                children: [
                                ],
                                text: 'I. kafli.',
                            },
                            {
                                id: '9',
                                type: 'name',
                                attributes: {
                                },
                                children: [
                                ],
                                text: 'Markmið, gildissvið og orðskýringar.',
                            },
                            {
                                id: '10',
                                type: 'art',
                                attributes: {
                                    nr: '1',
                                },
                                children: [
                                    {
                                        id: '11',
                                        type: 'title',
                                        attributes: {
                                        },
                                        children: [
                                        ],
                                        text: '1. gr.',
                                    },
                                    {
                                        id: '12',
                                        type: 'name',
                                        attributes: {
                                        },
                                        children: [
                                        ],
                                        text: 'Markmið.',
                                    },
                                    {
                                        id: '13',
                                        type: 'subart',
                                        attributes: {
                                            nr: '1',
                                        },
                                        children: [
                                            {
                                                id: '14',
                                                type: 'sen',
                                                attributes: {
                                                    nr: '1',
                                                },
                                                children: [
                                                ],
                                                text: 'Markmiðið með lögum þessum er að:',
                                            },
                                            {
                                                id: '15',
                                                type: 'numart',
                                                attributes: {
                                                    nr: '1',
                                                    'nr-type': 'numeric',
                                                },
                                                children: [
                                                    {
                                                        id: '16',
                                                        type: 'title',
                                                        attributes: {
                                                        },
                                                        children: [
                                                        ],
                                                        text: '1.',
                                                    },
                                                    {
                                                        id: '17',
                                                        type: 'sen',
                                                        attributes: {
                                                            nr: '1',
                                                        },
                                                        children: [
                                                        ],
                                                        text: 'Mæla fyrir um framkvæmd þvingunaraðgerða sem ákveðnar eru af öryggisráði Sameinuðu þjóðanna á grundvelli 41. gr. sáttmála Sameinuðu þjóðanna, af alþjóðastofnunum eða af ríkjahópum til að viðhalda friði og öryggi og/eða tryggja virðingu fyrir mannréttindum og mannfrelsi.',
                                                    },
                                                ],
                                            },
                                            {
                                                id: '18',
                                                type: 'numart',
                                                attributes: {
                                                    nr: '2',
                                                    'nr-type': 'numeric',
                                                },
                                                children: [
                                                    {
                                                        id: '19',
                                                        type: 'title',
                                                        attributes: {
                                                        },
                                                        children: [
                                                        ],
                                                        text: '2.',
                                                    },
                                                    {
                                                        id: '20',
                                                        type: 'sen',
                                                        attributes: {
                                                            nr: '1',
                                                        },
                                                        children: [
                                                        ],
                                                        text: 'Hindra fjármögnun hryðjuverka, mannréttindabrota og brota á mannúðarrétti og útbreiðslu og fjármögnun gereyðingarvopna.',
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                id: '21',
                                type: 'art',
                                attributes: {
                                    nr: '2',
                                },
                                children: [
                                    {
                                        id: '22',
                                        type: 'title',
                                        attributes: {
                                        },
                                        children: [
                                        ],
                                        text: '2. gr.',
                                    },
                                    {
                                        id: '23',
                                        type: 'name',
                                        attributes: {
                                        },
                                        children: [
                                        ],
                                        text: 'Gildissvið.',
                                    },
                                    {
                                        id: '24',
                                        type: 'subart',
                                        attributes: {
                                            nr: '1',
                                        },
                                        children: [
                                            {
                                                id: '25',
                                                type: 'sen',
                                                attributes: {
                                                    nr: '1',
                                                },
                                                children: [
                                                ],
                                                text: 'Lög þessi gilda um íslenska ríkisborgara og útlendinga sem geta sætt refsiábyrgð samkvæmt ákvæðum almennra hegningarlaga um refsilögsögu.',
                                            },
                                            {
                                                id: '26',
                                                type: 'sen',
                                                attributes: {
                                                    nr: '2',
                                                },
                                                children: [
                                                ],
                                                text: 'Íslenskir ríkisborgarar bera auk þess refsiábyrgð fyrir verknað sem þeir fremja erlendis þrátt fyrir að verknaðurinn sé ekki refsiverður samkvæmt lögum þess ríkis þar sem brotið var framið.',
                                            },
                                        ],
                                    },
                                    {
                                        id: '27',
                                        type: 'subart',
                                        attributes: {
                                            nr: '2',
                                        },
                                        children: [
                                            {
                                                id: '28',
                                                type: 'sen',
                                                attributes: {
                                                    nr: '1',
                                                },
                                                children: [
                                                ],
                                                text: 'Lög þessi gilda um lögaðila sem skráðir eru eða stofnað er til samkvæmt íslenskum lögum hvar sem þeir starfa eða eru staðsettir.',
                                            },
                                            {
                                                id: '29',
                                                type: 'sen',
                                                attributes: {
                                                    nr: '2',
                                                },
                                                children: [
                                                ],
                                                text: 'Ef lögaðili er skráður eða til hans stofnað erlendis taka lögin til starfsemi hans að því leyti sem hún á sér stað innan íslenskrar lögsögu.',
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                id: '30',
                                type: 'art',
                                attributes: {
                                    nr: '3',
                                },
                                children: [
                                    {
                                        id: '31',
                                        type: 'title',
                                        attributes: {
                                        },
                                        children: [
                                        ],
                                        text: '3. gr.',
                                    },
                                    {
                                        id: '32',
                                        type: 'name',
                                        attributes: {
                                        },
                                        children: [
                                        ],
                                        text: 'Orðskýringar.',
                                    },
                                    {
                                        id: '33',
                                        type: 'numart',
                                        attributes: {
                                            nr: '1',
                                            'nr-type': 'numeric',
                                        },
                                        children: [
                                            {
                                                id: '34',
                                                type: 'title',
                                                attributes: {
                                                },
                                                children: [
                                                ],
                                                text: '1.',
                                            },
                                            {
                                                id: '35',
                                                type: 'name',
                                                attributes: {
                                                },
                                                children: [
                                                ],
                                                text: 'Aðili:',
                                            },
                                            {
                                                id: '36',
                                                type: 'sen',
                                                attributes: {
                                                    nr: '1',
                                                },
                                                children: [
                                                ],
                                                text: 'Einstaklingur eða lögaðili, þ.m.t. ríkisstjórnir, fyrirtæki, samsteypur, stofnanir, sjóðir og samtök.',
                                            },
                                        ],
                                    },
                                    {
                                        id: '37',
                                        type: 'numart',
                                        attributes: {
                                            nr: '2',
                                            'nr-type': 'numeric',
                                        },
                                        children: [
                                            {
                                                id: '38',
                                                type: 'title',
                                                attributes: {
                                                },
                                                children: [
                                                ],
                                                text: '2.',
                                            },
                                            {
                                                id: '39',
                                                type: 'name',
                                                attributes: {
                                                },
                                                children: [
                                                ],
                                                text: 'Efnahagslegur auður:',
                                            },
                                            {
                                                id: '40',
                                                type: 'sen',
                                                attributes: {
                                                    nr: '1',
                                                },
                                                children: [
                                                ],
                                                text: 'Hvers kyns eignir, efnislegar jafnt sem óefnislegar, færanlegar eða ófæranlegar, sem eru ekki fjármunir en sem unnt er að nota til að afla fjármuna, vöru eða þjónustu.',
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ]);
    });
});
