import { DataSource } from 'typeorm';
import { createDatabase } from 'typeorm-extension';
import database from '../../config/database';

let connection: DataSource | null = null;

export const setConnection = (ds: DataSource) => {
    connection = ds;
};

export const initConnection = async () => {
    await createDatabase({ ifNotExist: true, options: database });

    if (!connection) {
        connection = new DataSource(database);
    }

    if (!connection.isInitialized) {
        await connection.initialize();
        // @ts-expect-error port is not defined in DataSourceOptions
        console.log(`Database connection initialized at port ${database.port}`);
    }

    connection.entityMetadatas.forEach(metadata => {
        console.log(`Loaded db entity: ${metadata.name}`);
    });

    await connection.runMigrations();
    
    connection.setOptions({ debug: true });
    
    return connection;
};

export const getConnection = () => {
    if (!connection || !connection.isInitialized) {
        throw new Error('Database connection not initialized');
    }

    return connection;
};

export const closeConnection = async () => {
    if (connection) {
        await connection.destroy();
        console.log('Database connection closed');
    }
};