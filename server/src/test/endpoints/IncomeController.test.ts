import { StatusCodes } from 'http-status-codes';
import IncomeService from 'services/IncomeService';
import request from 'supertest';
import { testLoginDatas } from 'test/LoginRegistrationController.test';
import { login, testUser } from '../../../jest.setup';
import app from '../../app';

const successfulPostIncomeData = {
    id: '39caef44-eb57-11ec-8ea0-0242ac120002',
    userId: '123e4567-e89b-12d3-a456-426614174000',
    created: new Date(),
    modified: new Date(),
    amount: 1000,
};

const updatedIncomeData = {
    id: '39caef44-eb57-11ec-8ea0-0242ac120002',
    userId: '123e4567-e89b-12d3-a456-426614174000',
    created: new Date(),
    modified: new Date(),
    amount: 2500,
};

const wrongUpdatedIncomeData = {
    id: '39caef44-eb57-11ec-8ea0-0242ac120002',
    userId: '123e4567-e89b-12d3-a456-426614174000',
    created: new Date(),
    modified: new Date(),
};

const wrongPostIncomeData = {
    id: '39caef44-eb57-11ec-8ea0-0242ac120002',
    userId: '123e4567-e89b-12d3-a456-426614174000',
    created: new Date(),
    modified: new Date(),
};

const incomesUrl = '/incomes';
const updateIncomesUrl = `/incomes/${successfulPostIncomeData.id}`;

describe('POST /incomes test', () => {
    test('Create income fails due to lack of amount', async () => {
        const loginResponse = await login(testLoginDatas);
        const token = await loginResponse.body.token;

        const response = await request(app)
            .post(incomesUrl)
            .send(wrongPostIncomeData)
            .set('access_token', token);

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
        const token = await loginResponse.body.token;
        const response = await request(app)
            .post(incomesUrl)
            .send(successfulPostIncomeData)
            .set('access_token', token);

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

describe(`GET /incomes/${successfulPostIncomeData.id} test`, () => {
    test('Get specific income fails because id is not a uuid', async () => {
        const loginResponse = await login(testLoginDatas);
        const token = await loginResponse.body.token;
        const response = await request(app)
            .get('/incomes/12345')
            .set('access_token', token);

        expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(response.body).not.toEqual(successfulPostIncomeData);
        expect(response.body).toEqual({});
    });

    test('Get specific income fails because income not found with incoming id param', async () => {
        const loginResponse = await login(testLoginDatas);
        const token = await loginResponse.body.token;
        const response = await request(app)
            .get(`/incomes/${testUser.id}`)
            .set('access_token', token);

        const { errors } = response.body;

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(errors).not.toBeUndefined();
        expect(errors[0]).toEqual('income_not_found');
        expect(response.body).not.toEqual(successfulPostIncomeData);
    });

    test('Get specific income successfully', async () => {
        const loginResponse = await login(testLoginDatas);
        const token = await loginResponse.body.token;
        const response = await request(app)
            .get(`/incomes/${successfulPostIncomeData.id}`)
            .set('access_token', token);

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).not.toBeUndefined();

        // Check if created income is in the db
        const storedIncome = await IncomeService.findById(
            successfulPostIncomeData.id
        );
        expect(storedIncome).not.toBeNull();
        expect(response.body.id).toEqual(storedIncome.id);
    });
});

describe(`PUT /incomes/${successfulPostIncomeData.id} test`, () => {
    test('Update income fails because income id is not a uuid', async () => {
        const loginResponse = await login(testLoginDatas);
        const token = await loginResponse.body.token;
        const response = await request(app)
            .put('/incomes/12345')
            .send(updatedIncomeData)
            .set('access_token', token);

        expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(response.body).not.toEqual(updatedIncomeData);

        // Check if income with updated income id does not changed
        const storedIncome = await IncomeService.findById(updatedIncomeData.id);
        expect(storedIncome.amount).not.toEqual(updatedIncomeData.amount);
    });

    test('Update income fails because updated income does not have an amount property', async () => {
        const loginResponse = await login(testLoginDatas);
        const token = await loginResponse.body.token;
        const response = await request(app)
            .put(updateIncomesUrl)
            .send(wrongUpdatedIncomeData)
            .set('access_token', token);

        const { errors } = response.body;

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(errors).not.toBeUndefined();
        expect(errors[0]).toBe('amount_required');

        // Check if income with updated income id does not changed
        const storedIncome = await IncomeService.findById(
            wrongUpdatedIncomeData.id
        );
        expect(storedIncome.amount).toEqual(successfulPostIncomeData.amount);
    });

    test('Update income fails because updated income does not have a userId property', async () => {
        const loginResponse = await login(testLoginDatas);
        const token = await loginResponse.body.token;
        const response = await request(app)
            .put(updateIncomesUrl)
            .send({
                id: '39caef44-eb57-11ec-8ea0-0242ac120002',
                created: new Date(),
                modified: new Date(),
                amount: 2500,
            })
            .set('access_token', token);

        const { errors } = response.body;

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(errors).not.toBeUndefined();
        expect(errors[0]).toBe('user_id_required');

        // Check if income with updated income id does not changed
        const storedIncome = await IncomeService.findById(updatedIncomeData.id);
        expect(storedIncome.amount).toEqual(successfulPostIncomeData.amount);
    });

    test('Successful income update', async () => {
        const loginResponse = await login(testLoginDatas);
        const token = await loginResponse.body.token;
        const response = await request(app)
            .put(updateIncomesUrl)
            .send(updatedIncomeData)
            .set('access_token', token);

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).not.toBeUndefined();

        // Check if posted income data updated successfully in the db
        const storedIncome = await IncomeService.findById(
            successfulPostIncomeData.id
        );
        expect(storedIncome.amount).toEqual(updatedIncomeData.amount);
    });
});
