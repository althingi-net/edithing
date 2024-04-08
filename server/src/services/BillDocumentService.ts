import { GitJsonMerger } from 'git-json-merger';
import BillDocument from '../entities/BillDocument';
import BillDocumentUpdate, { UpdateStatus } from '../entities/BillDocumentUpdate';
import connection from '../integration/messageQueue/connection';

export const subscribeBillDocumentUpdateQueue = async () => {
    await connection.consume('BillDocumentUpdate', async (msg) => {
        console.log('BillDocumentUpdate', msg);

        const update = await BillDocumentUpdate.findOne({
            where: { id: msg },
            select: ['billDocumentId', 'title', 'content', 'events'],
        });

        if (!update) {
            return;
        }

        const { billDocumentId, title, content, events } = update;
        const originalDocument = await BillDocument.findOne({
            where: { id: billDocumentId },
            select: ['content', 'events'],
        });

        if (!originalDocument) {
            return;
        }

        // Merge the changes
        const merger = new GitJsonMerger(billDocumentId.toString());
        await merger.init({
            content: originalDocument.content,
            events: originalDocument.events,
        });
        const result = await merger.merge({
            content,
            events,
        });

        // Save new document state
        if (result.error) {
            await BillDocumentUpdate.update({ id: msg }, { status: UpdateStatus.ERROR });
        } else {
            const { content, events } = result.document;

            await BillDocument.update({ id: billDocumentId }, {
                title,
                content,
                events,
            });
    
            await BillDocumentUpdate.update({ id: msg }, { status: UpdateStatus.SUCCESS });
        }
    });
};