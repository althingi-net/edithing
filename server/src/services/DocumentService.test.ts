import setupIntegrationTestSuite from '../test/setupIntegrationTestSuite';
import { findOrImportDocument } from './DocumentService';

let xmlContent = '';
jest.mock('../integration/github/downloadFile', () => {
    return jest.fn(() => Promise.resolve(xmlContent));
});

describe('DocumentService', () => {
    setupIntegrationTestSuite();

    it('download same document twice in parallel', async () => {
        const identifier = '2023.65';
        xmlContent = '<xml></xml>';

        const [doc1, doc2] = await Promise.all([
            findOrImportDocument(identifier),
            findOrImportDocument(identifier),
        ]);

        expect(doc1).toEqual(doc2);
    });

    it('have importError for containing invalid nr attribute', async () => {
        const identifier = '2023.66';
        xmlContent = `
            <?xml version='1.0' encoding='utf-8'?>
            <law nr="116" year="2021" law-type="law">
            <name>Lög um verðbréfasjóði</name>
            <num-and-date>
                <date>2021-06-25</date>
                <num>116</num>
                <original>2021 nr. 116 25. júní</original>
            </num-and-date>
            <minister-clause>Ferill málsins á Alþingi.</minister-clause>
            <chapter nr="12" nr-type="roman" roman-nr="XII">
                <nr-title>XII. kafli.</nr-title>
                <name>Starfsemi yfir landamæri innan EES.</name>
                <art nr="100ads">
                <nr-title>100. gr. a.</nr-title>
                <name>Afturköllun ráðstafana seman EES.</name>
                <subart nr="2">
                    <sen nr="1">Upplýsingan.</sen>
                </subart>
                </art>
            </chapter>
            </law>
        `;

        const doc = await findOrImportDocument(identifier);

        expect(doc.importError).toEqual('Invalid nr attribute: {"type":"list-item","meta":{"type":"art","nr":"100ads","originNr":"100ads","title":true,"name":true}}');
    });
});