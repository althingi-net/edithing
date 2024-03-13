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
        events: `[{
            "id": "art-1.subart-1",
            "originId": "art-1.subart-1",
            "type": "changed"
        }]`,
        identifier: '1232.12',
        title: 'document 1',
    }]);

    expect(result).toBe(xmlFormat(`
        <bill>
            <title>
                bill title
            </title>
            <chapter nr="1" identifier="1232.12">
                <title>
                    Breyting á document 1, no. 12/1232.
                </title>
                <art nr="1">
                    <subart nr="1">
                        <sen nr="1" change-type="changed" origin-id="art-1.subart-1">
                            Markmið laga þessara er að kveða á um skilyrði fyrir stofnsetningu, rekstri og markaðssetningu peningamarkaðssjóða. appended change
                        </sen>
                    </subart>
                </art>
            </chapter>
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
        events: `[{
            "id": "art-1.subart-1",
            "originId": "art-1.subart-1",
            "type": "removed"
        }]`,
        identifier: '1232.12',
        title: 'document 1',
    }]);

    expect(result).toBe(xmlFormat(`
        <bill>
            <title>
                bill title
            </title>
            <chapter nr="1" identifier="1232.12">
                <title>
                    Breyting á document 1, no. 12/1232.
                </title>
                <art nr="1">
                    <subart nr="1">
                        <sen nr="1" change-type="deleted" origin-id="art-1.subart-1">
                            Markmið laga þessara er að kveða á um skilyrði fyrir stofnsetningu, rekstri og markaðssetningu peningamarkaðssjóða.
                        </sen>
                    </subart>
                </art>
            </chapter>
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
        events: `[{
            "id": "art-1.subart-2",
            "originId": "art-1.subart-2",
            "type": "added"
        }]`,
        identifier: '1232.12',
        title: 'document 1',
    }]);

    expect(result).toBe(xmlFormat(`
        <bill>
            <title>
                bill title
            </title>
            <chapter nr="1" identifier="1232.12">
                <title>
                    Breyting á document 1, no. 12/1232.
                </title>
                <art nr="1">
                    <subart nr="1">
                        <sen nr="1" change-type="added" origin-id="art-1.subart-2">
                            added article
                        </sen>
                    </subart>
                </art>
            </chapter>
        </bill>
    `));
});
