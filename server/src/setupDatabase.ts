import { DataSource } from 'typeorm';
import User from './entities/User';

const setupDatabase = async () => {
    const source = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root_password',
        database: 'test',
        entities: ['**/entities/*.ts', '**/entities/*.js', User],
        synchronize: process.env.NODE_ENV === 'development' ? true : false,
        logging: false,
    });
    
    // to initialize the initial connection with the database, register all entities
    // and "synchronize" database schema
    return source.initialize();
};

export default setupDatabase;