import { StatusCodes } from 'http-status-codes';
import UserService from 'services/UserService';
import request from 'supertest';
import app from '../../app';

const testRegisterData = {
    firstname: 'Test',
    lastname: 'User',
    email: 'test@test.com',
    password: 'test',
    passwordConfirm: 'test',
};

const registerUrl = '/register';

describe('POST /register', () => {
    test('Failed registration with incorrent registration credentials', async () => {
        const response = await request(app).post(registerUrl).send({
            email: testRegisterData.email,
            lastname: testRegisterData.lastname,
            firstName: testRegisterData.firstname,
            password: testRegisterData.password,
        });
        const { errors } = response.body;

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.body).not.toBeNull();
        expect(errors[0]).toBe('password_confirm_required');
    });

    test('Successful registration with correct registration credentials', async () => {
        const response = await request(app)
            .post('/register')
            .send(testRegisterData);

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).not.toBeNull();

        const createdUser = await UserService.findByEmail(
            testRegisterData.email
        );
        expect(response.body.user.email).toEqual(createdUser.email);
    });
});
