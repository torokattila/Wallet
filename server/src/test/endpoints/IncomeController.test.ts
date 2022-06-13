import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { testLoginDatas } from 'test/LoginRegistrationController.test';
import { login } from '../../../jest.setup';
import app from '../../app';

const testIncomeData = {
    id: '39caef44-eb57-11ec-8ea0-0242ac120002',
    userId: '123e4567-e89b-12d3-a456-426614174000',
    created: new Date(),
    modified: new Date(),
    amount: 1000,
};

const incomesUrl = '/incomes';

describe('POST /incomes test', () => {
    test('Successfully create income', async () => {
        const loginResponse = await login(testLoginDatas);

        const response = await request(app)
            .post(incomesUrl)
            .send(testIncomeData)
            .set('access_token', `${await loginResponse.body.token}`);

        expect(response.status).toBe(StatusCodes.CREATED);
        expect(response.body).not.toBeUndefined();
        expect(response.body.id).toEqual(testIncomeData.id);
    });
});
