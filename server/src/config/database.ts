import { DataSource, createConnection } from 'typeorm';

// Note: Using new DataSource() does not work, because 3rd party libs are still using getConnection('default')
let database = null as unknown as DataSource;

export const setupDatabase = async () => {
    database = await createConnection({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root_password',
        database: 'test',
        entities: ['**/entities/*.ts'],
        logging: true,
    });

    if (!database.isInitialized) {
        await database.initialize();
    }
    
    if (process.env.NODE_ENV !== 'production') {
        await database.synchronize();
    }
};

export default database;