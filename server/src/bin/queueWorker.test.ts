import Bill from '../entities/Bill';
import BillDocument from '../entities/BillDocument';
import BillDocumentUpdate from '../entities/BillDocumentUpdate';
import connection from '../integration/messageQueue/connection';
import { subscribeBillDocumentUpdateQueue } from '../services/BillDocumentService';
import setupIntegrationTestSuite from '../test/setupIntegrationTestSuite';

describe('queue worker', () => {
    setupIntegrationTestSuite();
    
    test('simple BillDocumentUpdate', async () => {
        await subscribeBillDocumentUpdateQueue();
    
        await Bill.save({
            id: 1,
            title: 'title',
        });
        await BillDocument.save({
            id: 2,
            identifier: 'identifier',
            bill: { id: 1 },
            title: 'title',
            content: 'content',
            originalXml: 'originalXml',
            events: '[]',
        });
        const update = await BillDocumentUpdate.save({
            id: 3,
            billDocumentId: 2,
            title: 'title',
            content: 'new content',
            events: '[]',
        });
    
        await connection.sendToQueue('BillDocumentUpdate', update.id!);
    
        await new Promise((resolve) => setTimeout(resolve, 1000));
    
        const billDocument = await BillDocument.findOne({
            where: { id: 2 },
            select: ['content', 'events'],
        });
    
        expect(billDocument).toEqual({
            content: 'new content',
            events: '[]',
        });
    });
    
    test('parallel BillDocumentUpdate`s', async () => {
        await Bill.save({
            id: 10,
            title: 'title',
        });
        await BillDocument.save({
            id: 20,
            identifier: 'identifier',
            bill: { id: 10 },
            title: 'title',
            content: JSON.stringify({ a: 1, b: 1 }),
            originalXml: 'originalXml',
            events: '[]',
        });
    
        const update1 = await BillDocumentUpdate.save({
            id: 30,
            billDocumentId: 20,
            title: 'title',
            content: JSON.stringify({ a: 2, b: 1 }),
            events: '[]',
        });
    
        const update2 = await BillDocumentUpdate.save({
            id: 40,
            billDocumentId: 20,
            title: 'title',
            content: JSON.stringify({ a: 1, b: 2 }),
            events: '[]',
        });
    
        await connection.sendToQueue('BillDocumentUpdate', update1.id!);
        await connection.sendToQueue('BillDocumentUpdate', update2.id!);
    
        await subscribeBillDocumentUpdateQueue();
    
        await new Promise((resolve) => setTimeout(resolve, 1000));
    
        const billDocument = await BillDocument.findOne({
            where: { id: 20 },
            select: ['content', 'events'],
        });
    
        expect(billDocument).toEqual({
            content: JSON.stringify({ a: 2, b: 2 }),
            events: '[]',
        });
    
        await connection.close();
    });
});