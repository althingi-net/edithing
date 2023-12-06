import { DataSourceOptions } from 'typeorm';

const database: DataSourceOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root_password',
    database: process.env.NODE_ENV === 'test' ? 'test' : 'app',
    synchronize: process.env.NODE_ENV !== 'production',
    entities: ['**/entities/!(*.test).ts'],
    logging: true,
};

export default database;