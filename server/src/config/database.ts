import { join } from 'path';
import { DataSourceOptions } from 'typeorm';

const isTestEnv = process.env.NODE_ENV === 'test';
const isNotProduction = process.env.NODE_ENV !== 'production';
const port = process.env.DATABASE_PORT ?? isTestEnv ? 3307 : 3306;

const database: DataSourceOptions = {
    type: 'mysql',
    host: '127.0.0.1',
    port: port,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: isNotProduction,
    entities: [
        isTestEnv
            ? '**/entities/!(*.test).ts'
            : join(__dirname, '..', '**', 'entities', '!(*.test).{ts,js}')
    ],
    logging: false,
};

export default database;