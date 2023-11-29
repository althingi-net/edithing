import { DataSource } from 'typeorm';

const setupDatabase = async () => {
    const source = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root_password',
        database: 'test',
        entities: ['**/entities/*.ts'],
        synchronize: process.env.NODE_ENV === 'development' ? true : false,
        logging: false,
    });
    
    // to initialize the initial connection with the database, register all entities
    // and "synchronize" database schema
    await source.initialize();

    return source;
};

export default setupDatabase;