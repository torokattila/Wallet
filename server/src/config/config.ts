import dotenv from 'dotenv';
import path from 'path';

const rootPath = path.join(__dirname, '..', '..');

dotenv.config();

const env = process.env.NODE_ENV || 'development';

const config: any = {
    default: {
        env: 'dev',
        protocol: 'http',
        hostname: 'localhost',
        apiHostName: 'localhost',
        logLevel: 'debug',
        logDir: path.join(rootPath, 'log'),
        accessLogFormat: 'tiny',
        projectName: 'wallet-backend',
        port: process.env.PORT,
        jwtTokenSecret: process.env.JWT_TOKEN_SECRET,
        tokenSecret: process.env.TOKEN_SECRET,
    },
    development: {
        env: 'dev',
        protocol: 'http',
        logToFile: false,
        hostname: 'localhost',
        enabledOrigins: ['http://localhost:3000'],
        clientUrl: 'http://localhost:3000',
    },
    production: {
        env: 'prod',
        protocol: 'https',
        hostname: 'localhost',
        logToFile: true,
        enabledOrigins: [
            'https://my-wallet-webapp.herokuapp.com',
            'http://localhost:8080',
            'http://localhost:3000',
        ],
        clientUrl: 'https://my-wallet-webapp.herokuapp.com',
    },
};

export default { ...config.default, ...config[env] } as typeof config.default;
