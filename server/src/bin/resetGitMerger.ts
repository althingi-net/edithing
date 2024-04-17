import 'dotenv/config';
import 'reflect-metadata';
import { rm } from 'fs/promises';
import { IsNull, Not } from 'typeorm';
import { closeConnection, initConnection } from '../integration/database/connection';
import BillDocument from '../entities/BillDocument';
import BillDocumentUpdate from '../entities/BillDocumentUpdate';
import connection from '../integration/messageQueue/connection';

void (async () => {
    await Promise.all([
        initConnection(),
        connection.connect(),
    ]);

    await Promise.all([
        BillDocument.update({ gitHash: Not(IsNull()) }, { gitHash: '' }),
        BillDocumentUpdate.update({ gitHash: Not(IsNull()) }, { gitHash: '' }),
        rm('./tmp', { recursive: true, force: true }),
        connection.purge('BillDocumentUpdate'),
    ]);
    
    await Promise.all([
        closeConnection(),
        connection.close(),
    ]);
    console.log('💥💥💥 Done 💥💥💥');
})();