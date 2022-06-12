import User from 'entities/User';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import app from '../../app';

const testLoginDatas: Partial<User> = {
    firstname: 'Test',
    lastname: 'User',
    email: 'test@test.com',
    password: 'test',
};

describe('POST /login', () => {
    test('Successful login with correct login credentials', async () => {
        const response = await request(app).post('/login').send(testLoginDatas);

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).not.toBeNull();
        expect(response.body.user.email).toEqual(testLoginDatas.email);
    });
});
