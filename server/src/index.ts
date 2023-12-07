import 'reflect-metadata';
import 'dotenv/config';
import server from './config/server';
import app from './app';
import { initConnection } from './integration/database/connection';

// Start the server
(async () => {
    await initConnection();
    await app.listen(server.port);

    console.log(`🚀 Server is running at ${server.host}`);
})();