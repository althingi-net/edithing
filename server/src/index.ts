import 'reflect-metadata';
import server from './config/server';
import app from './app';
import { initConnection } from './integration/database/connection';
import dotenv from 'dotenv'; 

// Load .env file
dotenv.config();

// Start the server
(async () => {
    await initConnection();
    await app.listen(server.port);

    console.log(`🚀 Server is running at ${server.host}`);
})();