import 'dotenv/config';
import 'reflect-metadata';
import { rm } from 'fs/promises';
import { IsNull, Not } from 'typeorm';
import { closeConnection, initConnection } from '../integration/database/connection';
import BillDocument from '../entities/BillDocument';
import BillDocumentUpdate from '../entities/BillDocumentUpdate';

void (async () => {
    await initConnection();

    await Promise.all([
        BillDocument.update({ gitHash: Not(IsNull()) }, { gitHash: undefined }),
        BillDocumentUpdate.update({ gitHash: Not(IsNull()) }, { gitHash: undefined }),
        rm('./tmp', { recursive: true, force: true }),
    ]);
    
    await closeConnection();
    console.log('💥💥💥 Done 💥💥💥');
})();