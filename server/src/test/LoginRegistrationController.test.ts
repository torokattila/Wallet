import { login } from '../../jest.setup';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import app from '../app';
import UserService from 'services/UserService';

const testRegisterData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    firstname: 'Test',
    lastname: 'User',
    email: 'test@test.com',
    password: 'test',
    passwordConfirm: 'test',
};

export const testLoginDatas = {
    email: 'test@test.com',
    password: 'test',
};

const wrongTestLoginData = {
    email: 'testuser2@test.com',
    password: 'test',
};

const registerUrl = '/register';

describe('POST /register test', () => {
    test('Failed registration with incorrent registration credentials', async () => {
        const response = await request(app).post(registerUrl).send({
            email: testRegisterData.email,
            lastname: testRegisterData.lastname,
            firstName: testRegisterData.firstname,
            password: testRegisterData.password,
        });
        const { errors } = response.body;

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(errors).not.toBeUndefined();
        expect(errors[0]).toBe('password_confirm_required');
    });

    test('Successful registration with correct registration credentials', async () => {
        const response = await request(app)
            .post('/register')
            .send(testRegisterData);

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).not.toBeNull();
        expect(response.body.token).not.toBeUndefined();

        const createdUser = await UserService.findByEmail(
            testRegisterData.email
        );
        expect(response.body.user.email).toEqual(createdUser.email);
    });
});

describe('POST /login test', () => {
    test('Successful login with correct login credentials', async () => {
        const response = await login(testLoginDatas);

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).not.toBeNull();
        expect(response.body.user.email).toEqual(testLoginDatas.email);
        expect(response.body.token).not.toBeNull();
    });

    test('Failed login with wrong credentials', async () => {
        const response = await login(wrongTestLoginData);

        const { errors } = response.body;

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(errors).not.toBeUndefined();
        expect(response.body.token).toBeUndefined();
        expect(errors[0]).toEqual('user_not_found');
    });
});
