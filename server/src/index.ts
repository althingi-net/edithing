import 'reflect-metadata';
import server from './config/server';
import app from './app';
import { initConnection } from './database/connection';

initConnection().then(() => {
    app.listen(server.port, () => {
        console.log(`🚀 Server is running at ${server.host}`);
    });
});