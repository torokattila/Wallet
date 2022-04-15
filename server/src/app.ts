import config from './config';
import morgan from 'morgan';
import express, { Application } from 'express';
import cors from 'cors';
import RegistrationController from 'controllers/RegistrationController';

class App {
    public express: Application;

    constructor() {
        this.init();
    }

    private init() {
        this.express = express();
        this.middlewares();
        this.routes();
    }

    private routes() {
        this.express.use('/register', RegistrationController);
    }

    private middlewares() {
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: true }));
        this.express.use(morgan(config.accessLogFormat));
        this.express.use(
            cors({
                origin: config.enabledOrigins,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                optionsSuccessStatus: 200,
                exposedHeaders: [
                    'X-Total-Count',
                    'X-Pagination-Page',
                    'X-Pagination-Limit',
                ],
            })
        );
    }
}

export default new App().express;
