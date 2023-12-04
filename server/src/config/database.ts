import { DataSource, createConnection } from 'typeorm';

// Note: Using new DataSource() does not work, because 3rd party libs are still using getConnection('default')
let database: DataSource | null = null;

export const setupDatabase = async () => {
    database = await createConnection({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root_password',
        database: process.env.NODE_ENV === 'test' ? 'test' : 'app',
        entities: ['**/entities/**/!(*.test.ts)'],
        logging: true,
    });

    if (!database.isInitialized) {
        await database.initialize();
    }

    await database.runMigrations();

    return database;
};

export const getConnection = () => database;