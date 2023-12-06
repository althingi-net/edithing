import { closeConnection, initConnection } from '../database/connection';
import seedTestDb from '../database/seedTestDb';


(async () => {
    await initConnection();
    await seedTestDb();
    await closeConnection();
    console.log('💥💥💥 Done 💥💥💥');
})();