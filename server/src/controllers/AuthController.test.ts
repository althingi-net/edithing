import supertest from 'supertest';
import generateJwtToken from '../authentication/generateJwtToken';
import User from '../entities/User';
import setupIntegrationTestSuite from '../test/setupIntegrationTestSuite';

const server = setupIntegrationTestSuite();

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