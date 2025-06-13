import { GitJsonMerger } from 'git-json-merger';
import Bill from '../entities/Bill';
import BillDocument from '../entities/BillDocument';
import BillDocumentUpdate, { UpdateStatus } from '../entities/BillDocumentUpdate';
import { runBillDocumentUpdate } from '../services/BillDocumentService';
import setupIntegrationTestSuite from '../test/setupIntegrationTestSuite';

describe('queue worker', () => {
    setupIntegrationTestSuite();

    test('simple update', async () => {
        const merger = new GitJsonMerger('1-2');
        await merger.git.destroy();
    
        await Bill.save({
            id: 1,
            title: 'title',
            lagasafnId: 1,
            description: 'description',
        });
        await BillDocument.save({
            id: 2,
            identifier: 'identifier',
            bill: { id: 1 },
            title: 'title',
            content: JSON.stringify({ a: 1, b: 1 }),
            originalXml: 'originalXml',
        });

        const update = await BillDocumentUpdate.save({
            id: 3,
            billDocumentId: 2,
            title: 'title',
            content: JSON.stringify({ a: 2, b: 2 }),
        });
    
        await runBillDocumentUpdate(update.id!);
    
        const billDocument = await BillDocument.findOne({
            where: { id: 2 },
            select: ['content'],
        });
        const billDocumentUpdate = await BillDocumentUpdate.findOne({
            where: { id: 3 },
            select: ['status'],
        });
    
        expect(billDocumentUpdate).toEqual({ status: UpdateStatus.SUCCESS });
        expect(billDocument).toEqual({
            content: JSON.stringify({ a: 2, b: 2 }),
        });
    });

    test('parallel updates', async () => {
        const git = new GitJsonMerger('10-20');
        await git.git.destroy();

        await Bill.save({
            id: 10,
            title: 'title',
            lagasafnId: 2,
            description: 'description',
        });
        await BillDocument.save({
            id: 20,
            identifier: 'identifier',
            bill: { id: 10 },
            title: 'title',
            content: JSON.stringify({ a: 1, b: 1, c: 1 }),
            originalXml: 'originalXml',
        });
    
        const update1 = await BillDocumentUpdate.save({
            id: 30,
            billDocumentId: 20,
            title: 'title',
            content: JSON.stringify({ a: 2, b: 1, c: 1 }),
        });
    
        const update2 = await BillDocumentUpdate.save({
            id: 40,
            billDocumentId: 20,
            title: 'title',
            content: JSON.stringify({ a: 1, b: 1, c: 2 }),
        });

        await runBillDocumentUpdate(update1.id!);
        await runBillDocumentUpdate(update2.id!);
    
        const billDocument = await BillDocument.findOne({
            where: { id: 20 },
            select: ['content'],
        });
        const billDocumentUpdate1 = await BillDocumentUpdate.findOne({
            where: { id: 30 },
            select: ['status'],
        });
        const billDocumentUpdate2 = await BillDocumentUpdate.findOne({
            where: { id: 40 },
            select: ['status'],
        });
    
        expect(billDocumentUpdate1).toEqual({ status: UpdateStatus.SUCCESS });
        expect(billDocumentUpdate2).toEqual({ status: UpdateStatus.SUCCESS });
        expect(billDocument).toEqual({
            content: JSON.stringify({ a: 2, b: 1, c: 2 }),
        });
    });

    test('sequential updates', async () => {
        const git = new GitJsonMerger('10-20');
        await git.git.destroy();

        // Create bill and document
        await Bill.save({
            id: 10,
            title: 'title',
            lagasafnId: 3,
            description: 'description',
        });
        await BillDocument.save({
            id: 20,
            identifier: 'identifier',
            bill: { id: 10 },
            title: 'title',
            content: JSON.stringify({ a: 1 }),
            originalXml: 'originalXml',
        });
    
        // Create first update
        const update1 = await BillDocumentUpdate.save({
            id: 30,
            billDocumentId: 20,
            title: 'title',
            content: JSON.stringify({ a: 2 }),
        });

        await runBillDocumentUpdate(update1.id!);
        const documentAfterUpdate1 = await BillDocument.findOne({
            where: { id: 20 },
            select: ['gitHash'],
        });

        // Create second update
        const update2 = await BillDocumentUpdate.save({
            id: 40,
            billDocumentId: 20,
            title: 'title',
            content: JSON.stringify({ a: 3 }),
            gitHash: documentAfterUpdate1?.gitHash,
        });

        await runBillDocumentUpdate(update2.id!);
    
        // Check results
        const billDocument = await BillDocument.findOne({
            where: { id: 20 },
            select: ['content'],
        });
        const billDocumentUpdate1 = await BillDocumentUpdate.findOne({
            where: { id: 30 },
            select: ['status'],
        });
        const billDocumentUpdate2 = await BillDocumentUpdate.findOne({
            where: { id: 40 },
            select: ['status'],
        });
    
        expect(billDocumentUpdate1?.status).toEqual(UpdateStatus.SUCCESS);
        expect(billDocumentUpdate2?.status).toEqual(UpdateStatus.SUCCESS);
        expect(billDocument).toEqual({
            content: JSON.stringify({ a: 3 }),
        });
    });
});