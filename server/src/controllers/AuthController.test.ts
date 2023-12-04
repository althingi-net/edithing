import { Server } from 'http';
import supertest from 'supertest';
import app from '../app';
import { setupDatabase } from '../config/database';
import seedTestDb from '../database/seedTestDb';
import { DataSource } from 'typeorm';

let server: Server | null = null;
let db: DataSource | null = null;

beforeAll(async () => {
    db = await setupDatabase();
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