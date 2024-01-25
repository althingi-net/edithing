import 'reflect-metadata';
import 'dotenv/config';
import { dropDatabase } from 'typeorm-extension';
import { closeConnection, initConnection } from '../integration/database/connection';
import seedTestDb from '../integration/database/seedTestDb';
import database from '../config/database';

void (async () => {
    await dropDatabase({ options: database });
    await initConnection();
    await seedTestDb();
    await closeConnection();
    console.log('💥💥💥 Done 💥💥💥');
})();