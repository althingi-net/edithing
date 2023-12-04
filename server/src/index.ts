import 'reflect-metadata';
import { setupDatabase } from './config/database';
import server from './config/server';
import app from './app';

setupDatabase().then(() => {
    app.listen(server.port, () => {
        console.log(`🚀 Server is running at ${server.host}`);
    });
});