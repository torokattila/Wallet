import { StatusCodes } from 'http-status-codes';
import {
    testLoginDatas,
    testRegisterData,
} from 'test/LoginRegistrationController.test';
import { login } from '../../../jest.setup';
import request from 'supertest';
import app from '../../app';

describe(`GET /users/${testRegisterData.id} test`, () => {
    test('Get specific user fails because of invalid UUID', async () => {
        const loginResponse = await login(testLoginDatas);
        const token = await loginResponse.body.token;

        const response = await request(app)
            .get('/users/12345')
            .set('access_token', token);

        expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(response.body).not.toEqual(testRegisterData);
        expect(response.body).toEqual({});
        expect(response.body).not.toContain(testRegisterData.id);
    });

    test('Get specific user fails because of not existing user ID', async () => {
        const loginResponse = await login(testLoginDatas);
        const token = await loginResponse.body.token;

        const response = await request(app)
            .get('/users/39caef44-eb57-11ec-8ea0-0242ac120002')
            .set('access_token', token);

        const { errors } = response.body;

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(errors).not.toBeUndefined();
        expect(errors[0]).toBe('user_not_found');
    });

    test('Get user with specific ID successfully', async () => {
        const loginResponse = await login(testLoginDatas);
        const token = await loginResponse.body.token;

        const response = await request(app)
            .get(`/users/${testRegisterData.id}`)
            .set('access_token', token);

        const { body } = response;

        expect(response.status).toBe(StatusCodes.OK);
        expect(body.id).toEqual(testRegisterData.id);
        expect(body.email).toEqual(testRegisterData.email);
        expect(body.firstname).toEqual(testRegisterData.firstname);
        expect(body.lastname).toEqual(testRegisterData.lastname);
    });
});
