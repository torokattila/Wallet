import { Connection, createConnection } from 'typeorm';
import dotenv from 'dotenv';
import User from './src/entities/User';

dotenv.config();

const testUser: User = {
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

// @ts-ignore
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

// @ts-ignore
afterAll(async () => {
    connection.close();
    console.log('Database connection closed');
});
