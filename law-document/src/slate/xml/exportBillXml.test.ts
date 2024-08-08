import xmlFormat from 'xml-formatter';
import { Descendant, Text } from 'slate';
import { createEmptyDocumentMeta } from '../transformations/createDocumentMeta';
import { LawEditor, MetaType, createList, createListItem, exportXml, findNode, isList } from '../..';
import { exportBillXml } from './exportBillXml';

test('export changed article', () => {
    const slate: Descendant[] = [
        createEmptyDocumentMeta(),
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, '1', { title: '1. gr. ', name: 'Markmið. ' }, [
                createList(MetaType.SUBART, {}, [
                    createListItem(MetaType.SUBART, '1', { text: 'Markmið laga þessara er að kveða á um skilyrði fyrir stofnsetningu, rekstri og markaðssetningu peningamarkaðssjóða.' }),
                ]),
            ]),
        ]),
    ];

    const originalXml = exportXml({ children: slate } as LawEditor);

    const node = findNode(slate[1], [0, 1, 0, 0, 0]);
    if (Text.isText(node)) {
        node.text += ' appended change';
    }

    const result = exportBillXml('bill title', [{
        originalXml,
        content: JSON.stringify(slate),
        identifier: '1232.12',
        title: 'document 1',
    }]);

    expect(result).toBe(xmlFormat(`
        <bill>
            <title>
                bill title
            </title>
            <law nr="undefined" year="undefined" law-type="law">
                <art nr="1">
                    <nr-title>
                        1. gr.
                    </nr-title>
                    <name>
                        Markmið.
                    </name>
                    <subart nr="1">
                        <sen nr="1">
                            Markmið laga þessara er að kveða á um skilyrði fyrir stofnsetningu, rekstri og markaðssetningu peningamarkaðssjóða. appended change
                        </sen>
                    </subart>
                </art>
            </law>
        </bill>
    `));
});

test('export removed article', () => {
    const slate: Descendant[] = [
        createEmptyDocumentMeta(),
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, '1', { title: '1. gr. ', name: 'Markmið. ' }, [
                createList(MetaType.SUBART, {}, [
                    createListItem(MetaType.SUBART, '1', { text: 'Markmið laga þessara er að kveða á um skilyrði fyrir stofnsetningu, rekstri og markaðssetningu peningamarkaðssjóða.' }),
                ]),
            ]),
        ]),
    ];

    const originalXml = exportXml({ children: slate } as LawEditor);

    const node = findNode(slate[1], [0, 1]);
    if (isList(node)) {
        node.children = [];
    }

    const result = exportBillXml('bill title', [{
        originalXml,
        content: JSON.stringify(slate),
        identifier: '1232.12',
        title: 'document 1',
    }]);

    expect(result).toBe(xmlFormat(`
        <bill>
            <title>
                bill title
            </title>
            <law nr="undefined" year="undefined" law-type="law">
                <art nr="1">
                    <nr-title>
                        1. gr.
                    </nr-title>
                    <name>
                        Markmið.
                    </name>
                </art>
            </law>
        </bill>
    `));
});

test('export added article', () => {
    const slate: Descendant[] = [
        createEmptyDocumentMeta(),
        createList(MetaType.ART, {}, [
            createListItem(MetaType.ART, '1', { title: '1. gr. ', name: 'Markmið. ' }, [
                createList(MetaType.SUBART, {}, [
                    createListItem(MetaType.SUBART, '1', { text: 'Markmið laga þessara er að kveða á um skilyrði fyrir stofnsetningu, rekstri og markaðssetningu peningamarkaðssjóða.' }),
                ]),
            ]),
        ]),
    ];

    const originalXml = exportXml({ children: slate } as LawEditor);

    const node = findNode(slate[1], [0, 1]);
    if (isList(node)) {
        node.children.push(createListItem(MetaType.SUBART, '2', { text: 'added article' }));
    }

    const result = exportBillXml('bill title', [{
        originalXml,
        content: JSON.stringify(slate),
        identifier: '1232.12',
        title: 'document 1',
    }]);

    expect(result).toBe(xmlFormat(`
        <bill>
            <title>
                bill title
            </title>
            <law nr="undefined" year="undefined" law-type="law">
                <art nr="1">
                    <nr-title>
                        1. gr.
                    </nr-title>
                    <name>
                        Markmið.
                    </name>
                    <subart nr="1">
                        <sen nr="1">
                            Markmið laga þessara er að kveða á um skilyrði fyrir stofnsetningu, rekstri og markaðssetningu peningamarkaðssjóða.
                        </sen>
                    </subart>
                    <subart nr="2">
                        <sen nr="1">
                            added article
                        </sen>
                    </subart>
                </art>
            </law>
        </bill>
    `));
});
