import { DataSource } from 'typeorm';
import app from '../app';
import { initConnection } from '../integration/database/connection';
import seedTestDb from '../integration/database/seedTestDb';
import { Server, createServer } from 'http';

const setupIntegrationTestSuite = () => {
    const server: Server = createServer(app.callback());
    let db: DataSource | null = null;

    beforeAll(async () => {
        db = await initConnection();
        server.listen();
        await seedTestDb();
    });

    afterAll(async () => {
        await new Promise<void>((resolve, reject) => {
            server.close((error) => error ? reject(error) : resolve());
        });

        if (db) {
            await db.destroy();
        }
    });

    return server;
};

export default setupIntegrationTestSuite;