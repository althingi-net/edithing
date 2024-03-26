/* eslint-disable @typescript-eslint/ban-ts-comment */
import 'dotenv/config';
import 'reflect-metadata';
import { initConnection } from '../integration/database/connection';
import connection from '../integration/messageQueue/connection';
import BillDocument from '../entities/BillDocument';
import BillDocumentUpdate, { UpdateStatus } from '../entities/BillDocumentUpdate';



void (async () => {
    await initConnection();
    
    await connection.consume('BillDocumentUpdate', async (msg) => {
        console.log('Received message', msg);

        const update = await BillDocumentUpdate.findOneBy({ id: msg });

        if (!update) {
            return;
        }

        const { billDocumentId, title, content, events } = update;

        await BillDocument.update({ id: billDocumentId }, {
            title,
            content,
            events,
        });

        await BillDocumentUpdate.update({ id: msg }, { status: UpdateStatus.SUCCESS });
    });
})();