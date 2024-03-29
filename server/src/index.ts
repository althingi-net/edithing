import { exec } from 'child_process';
import 'dotenv/config';
import 'reflect-metadata';
import { initConnection } from './integration/database/connection';
import app from './app';
import server from './config/server';

// Start the server
void (async () => {
    await initConnection();
    app.listen(server.port);
    console.log(`🚀 Server is running at ${server.host}`);

    if (process.env.NODE_ENV !== 'production') {
        console.log('Generating Client SDK...');
        exec('npm run build:sdk');
    }
})();