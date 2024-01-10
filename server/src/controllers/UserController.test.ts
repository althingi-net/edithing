import HttpStatus from 'http-status-codes';
import supertest from 'supertest';
import generateJwtToken from '../authentication/generateJwtToken';
import User from '../entities/User';
import setupIntegrationTestSuite from '../test/setupIntegrationTestSuite';

const adminUserToken = generateJwtToken({ id: 1 } as User);
// const editorUserToken = generateJwtToken({ id: 2 } as User);

const server = setupIntegrationTestSuite();

test('get users', async () => {
    return supertest(server)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminUserToken}`)
        .expect(HttpStatus.OK)
        .expect('Content-Type', /json/)
        .expect((res) => {
            expect(res.body.length).toBeGreaterThanOrEqual(2);
            expect(res.body[0].role).toEqual('admin');
        });
});

test('get user', async () => {
    return supertest(server)
        .get('/api/users/2')
        .set('Authorization', `Bearer ${adminUserToken}`)
        .expect(HttpStatus.OK)
        .expect('Content-Type', /json/)
        .expect((res) => {
            expect(res.body.id).toEqual(2);
            expect(res.body.firstName).toEqual('Editor');
        });
});

// test('save user', async () => {
//     await supertest(server)
//         .post('/api/users')
//         .set('Authorization', `Bearer ${user1Token}`)
//         .send({
//             firstName: 'New',
//             lastName: 'User',
//             email: 'new@edithing.x',
//             password: '123456',
//         })
//         .expect(HttpStatus.OK)
//         .expect('Content-Type', /json/)
//         .expect((res) => {
//             expect(res.body.id).toEqual(3);
//             expect(res.body.firstName).toEqual('New');
//         });

//     await supertest(server)
//         .post('/api/users')
//         .set('Authorization', `Bearer ${user1Token}`)
//         .send({
//             active: true,
//         })
//         .expect(HttpStatus.OK)
//         .expect('Content-Type', /json/)
//         .expect((res) => {
//             expect(res.body.id).toEqual(3);
//             expect(res.body.firstName).toEqual('New');
//             expect(res.body.active).toBeTruthy();
//         });
// });

// test('refuse non admin user to update users', async () => {
//     return supertest(server)
//         .post('/api/users')
//         .set('Authorization', `Bearer ${editorUserToken}`)
//         .send({
//             active: true,
//         })
//         .expect(HttpStatus.FORBIDDEN);
// });

test('refuse public access', async () => {
    return supertest(server)
        .get('/api/users')
        .expect(HttpStatus.UNAUTHORIZED);
});