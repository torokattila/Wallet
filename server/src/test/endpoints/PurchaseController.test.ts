import { testLoginDatas } from 'test/LoginRegistrationController.test';
import request from 'supertest';
import { login, testUser } from '../../../jest.setup';
import app from '../../app';
import PurchaseCategory from 'enums/PurchaseCategory';
import { StatusCodes } from 'http-status-codes';
import PurchaseService from 'services/PurchaseService';
import { v4 as uuidv4 } from 'uuid';
import Purchase from 'entities/Purchase';

const purchasesUrl = '/purchases';

const newPurchasesArray: any[] = [];

for (let i = 1; i <= 3; i++) {
    newPurchasesArray.push({
        id: uuidv4(),
        userId: '123e4567-e89b-12d3-a456-426614174000',
        created: new Date(),
        modified: new Date(),
        category: PurchaseCategory.FOOD,
        amount: i * 1000,
    });
}

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

describe(`GET /purchases/${successfulPostedPurchase.id} test`, () => {
    test('Get specific purchase fails because id query param is not a valid UUID', async () => {
        const loginResponse = await login(testLoginDatas);
        const token = await loginResponse.body.token;

        const response = await request(app)
            .get(`${purchasesUrl}/12345`)
            .set('access_token', token);

        expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(response.body).not.toEqual(successfulPostedPurchase);
        expect(response.body).toEqual({});
    });

    test('Get specific purchase fails because purchase not found with provided id param', async () => {
        const loginResponse = await login(testLoginDatas);
        const token = await loginResponse.body.token;

        const response = await request(app)
            .get(`${purchasesUrl}/${testUser.id}`)
            .set('access_token', token);

        const { errors } = response.body;

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(errors).not.toBeUndefined();
        expect(errors[0]).toEqual('purchase_not_found');
        expect(response.body).not.toEqual(successfulPostedPurchase);
    });

    test('Get specific purchase successfully', async () => {
        const loginResponse = await login(testLoginDatas);
        const token = await loginResponse.body.token;

        const response = await request(app)
            .get(`${purchasesUrl}/${successfulPostedPurchase.id}`)
            .set('access_token', token);

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).not.toBeUndefined();

        // Check if created purchase is in the db
        const storedPurchase = await PurchaseService.findById(
            successfulPostedPurchase.id
        );
        expect(storedPurchase).not.toBeNull();
        expect(response.body.id).toEqual(storedPurchase.id);
    });
});

describe('GET /purchases test', () => {
    test('Successfully list all purchases', async () => {
        for (const purchase of newPurchasesArray) {
            await PurchaseService.create(purchase);
        }

        const loginResponse = await login(testLoginDatas);
        const token = await loginResponse.body.token;

        const response = await request(app)
            .get(purchasesUrl)
            .set('access_token', token);

        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).not.toBeUndefined();
        expect(response.body.length).toBe(4);
    });
});
