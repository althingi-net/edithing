import { join } from 'path';
import { DataSourceOptions } from 'typeorm';

const database: DataSourceOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database:
        process.env.NODE_ENV === 'test'
            ? process.env.DATABASE_NAME + '_test'
            : process.env.DATABASE_NAME,
    synchronize: process.env.NODE_ENV !== 'production',
    entities: [
        process.env.NODE_ENV === 'test'
            ? '**/entities/!(*.test).ts'
            : join(__dirname, '..', '**', 'entities', '!(*.test).{ts,js}')
    ],
    logging: true,
};

export default database;