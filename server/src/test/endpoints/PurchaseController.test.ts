import { testLoginDatas } from 'test/LoginRegistrationController.test';
import request from 'supertest';
import { login } from '../../../jest.setup';
import app from '../../app';
import PurchaseCategory from 'enums/PurchaseCategory';
import { StatusCodes } from 'http-status-codes';
import PurchaseService from 'services/PurchaseService';

const purchasesUrl = '/purchases';

const successfulPostedPurchase = {
    id: 'de57018a-431d-4064-b5a1-95891eabdb91',
    userId: '123e4567-e89b-12d3-a456-426614174000',
    category: PurchaseCategory.ENTERTAINMENT,
    amount: 12000,
    created: new Date(),
    modified: new Date(),
};

describe('POST /purchases test', () => {
    test('Create purchase fails due to lack of amount', async () => {
        const loginResponse = await login(testLoginDatas);
        const token = await loginResponse.body.token;

        const response = await request(app)
            .post(purchasesUrl)
            .send({
                id: 'de57018a-431d-4064-b5a1-95891eabdb91',
                userId: '123e4567-e89b-12d3-a456-426614174000',
                category: PurchaseCategory.ENTERTAINMENT,
                created: new Date(),
                modified: new Date(),
            })
            .set('access_token', token);

        const { errors } = response.body;

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(errors).not.toBeUndefined();
        expect(errors[0]).toBe('amount_required');

        // Check if wrong test data is not in the db
        const storedPurchase = await PurchaseService.findById(
            'de57018a-431d-4064-b5a1-95891eabdb91'
        );
        expect(storedPurchase).toBeNull();
    });

    test('Create purchase fails due to lack of category', async () => {
        const loginResponse = await login(testLoginDatas);
        const token = await loginResponse.body.token;

        const response = await request(app)
            .post(purchasesUrl)
            .send({
                id: 'de57018a-431d-4064-b5a1-95891eabdb91',
                userId: '123e4567-e89b-12d3-a456-426614174000',
                amount: 12000,
                created: new Date(),
                modified: new Date(),
            })
            .set('access_token', token);

        const { errors } = response.body;

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(errors).not.toBeUndefined();
        expect(errors[0]).toBe('category_required');

        // Check if wrong test data is not in the db
        const storedPurchase = await PurchaseService.findById(
            'de57018a-431d-4064-b5a1-95891eabdb91'
        );
        expect(storedPurchase).toBeNull();
    });

    test('Successfully create purchase', async () => {
        const loginResponse = await login(testLoginDatas);
        const token = await loginResponse.body.token;

        const response = await request(app)
            .post(purchasesUrl)
            .send(successfulPostedPurchase)
            .set('access_token', token);

        console.log(response);

        expect(response.status).toBe(StatusCodes.CREATED);
        expect(response.body).not.toBeUndefined();
        expect(response.body.id).toEqual(successfulPostedPurchase.id);

        // Check if created purchase is in the db
        const storedIncome = await PurchaseService.findById(
            successfulPostedPurchase.id
        );
        expect(storedIncome).not.toBeNull();
    });
});
