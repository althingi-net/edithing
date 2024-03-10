import { join } from 'path';
import { DataSourceOptions } from 'typeorm';

const isTestEnv = process.env.NODE_ENV === 'test';
const isNotProduction = process.env.NODE_ENV !== 'production';

const database: DataSourceOptions = {
    type: 'mysql',
    driver: require('mysql2'),
    host: 'localhost',
    port: isTestEnv ? 3307 : 3306,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: isNotProduction,
    entities: [
        isTestEnv
            ? '**/entities/!(*.test).ts'
            : join(__dirname, '..', '**', 'entities', '!(*.test).{ts,js}')
    ],
    logging: true,
};

export default database;