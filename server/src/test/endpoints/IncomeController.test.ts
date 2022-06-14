import { StatusCodes } from 'http-status-codes';
import IncomeService from 'services/IncomeService';
import request from 'supertest';
import { testLoginDatas } from 'test/LoginRegistrationController.test';
import { login } from '../../../jest.setup';
import app from '../../app';

const successfulPostIncomeData = {
    id: '39caef44-eb57-11ec-8ea0-0242ac120002',
    userId: '123e4567-e89b-12d3-a456-426614174000',
    created: new Date(),
    modified: new Date(),
    amount: 1000,
};

const wrongPostIncomeData = {
    id: '39caef44-eb57-11ec-8ea0-0242ac120002',
    userId: '123e4567-e89b-12d3-a456-426614174000',
    created: new Date(),
    modified: new Date(),
};

const incomesUrl = '/incomes';

describe('POST /incomes test', () => {
    test('Create income fails due to lack of amount', async () => {
        const loginResponse = await login(testLoginDatas);

        const response = await request(app)
            .post(incomesUrl)
            .send(wrongPostIncomeData)
            .set('access_token', `${await loginResponse.body.token}`);

        const { errors } = response.body;

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(errors).not.toBeUndefined();
        expect(errors[0]).toBe('amount_required');

        // Check if wrong test data is not in the db
        const storedIncome = await IncomeService.findById(
            wrongPostIncomeData.id
        );
        expect(storedIncome).toBeNull();
    });

    test('Successfully create income', async () => {
        const loginResponse = await login(testLoginDatas);

        const response = await request(app)
            .post(incomesUrl)
            .send(successfulPostIncomeData)
            .set('access_token', `${await loginResponse.body.token}`);

        expect(response.status).toBe(StatusCodes.CREATED);
        expect(response.body).not.toBeUndefined();
        expect(response.body.id).toEqual(successfulPostIncomeData.id);

        // Check if created income is in the db
        const storedIncome = await IncomeService.findById(
            successfulPostIncomeData.id
        );
        expect(storedIncome).not.toBeNull();
    });
});
