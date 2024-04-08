import 'dotenv/config';
import 'reflect-metadata';
import { initConnection } from '../integration/database/connection';
import connection from '../integration/messageQueue/connection';
import { subscribeBillDocumentUpdateQueue } from '../services/BillDocumentService';

void (async () => {
    await Promise.all([
        initConnection(),
        connection.connect(),
    ]);
    
    await subscribeBillDocumentUpdateQueue();
})();