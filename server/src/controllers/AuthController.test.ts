import { Server } from 'http';
import supertest from 'supertest';
import { DataSource } from 'typeorm';
import app from '../app';
import generateJwtToken from '../authentication/generateJwtToken';
import { initConnection } from '../integration/database/connection';
import seedTestDb from '../integration/database/seedTestDb';
import User from '../entities/User';

let server: Server | null = null;
let db: DataSource | null = null;

beforeAll(async () => {
    db = await initConnection();
    await seedTestDb();
    server = app.listen();
});

afterAll(async () => {
    if (server) {
        await new Promise<void>((resolve, reject) => {
            server?.close((error) => error ? reject(error) : resolve());
        });
    }

    if (db) {
        await db.destroy();
    }
});

test('login', async () => {
    return supertest(server)
        .post('/api/auth/login')
        .send({
            email: 'admin@edithing.x',
            password: '123456',
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
            expect(res.body).toHaveProperty('token');
            expect(res.body.user.id).toEqual(1);
        });
});

test('send jwt in header', async () => {
    const user = { id: 1 } as User;
    const token = generateJwtToken(user);

    return supertest(server)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
            expect(res.body.id).toEqual(1);
            expect(res.body.firstName).toEqual('Admin');
        });
});