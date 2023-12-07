import 'reflect-metadata';
import 'dotenv/config';
import { closeConnection, initConnection } from '../integration/database/connection';
import seedTestDb from '../integration/database/seedTestDb';

(async () => {
    await initConnection();
    await seedTestDb();
    await closeConnection();
    console.log('💥💥💥 Done 💥💥💥');
})();