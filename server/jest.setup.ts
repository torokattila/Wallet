import { Connection, createConnection } from 'typeorm';
import dotenv from 'dotenv';
import User from './src/entities/User';
import request from 'supertest';
import app from './src/app';
import UserService from 'services/UserService';

dotenv.config();

export const testUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    googleId: '',
    balance: 0,
    created: new Date(),
    modified: new Date(),
    firstname: 'Test',
    lastname: 'User',
    password: 'test',
    email: 'test@test.com',
    purchases: [],
    incomes: [],
};

let connection: Connection;

beforeAll(async () => {
    try {
        connection = await createConnection({
            name: 'default',
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            entities: ['src/entities/*.ts'],
            synchronize: true,
            logging: false,
        });

        console.log('Database connection esablished');
    } catch (error) {
        console.log(error);
    }
});

afterAll(async () => {
    try {
        // Remove test user after all tests
        await UserService.remove(testUser.id);
    } catch (error) {
        console.log(error);
    } finally {
        await connection.close();
        console.log('Database connection closed');
    }
});

const login = async (credentials: { email: string; password: string }) => {
    const response = await request(app).post('/login').send(credentials);

    return response;
};

export { login };
