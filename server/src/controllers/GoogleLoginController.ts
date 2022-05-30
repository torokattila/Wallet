import { Logger } from 'common';
import { sign } from 'jsonwebtoken';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PromiseRejectionHandler } from '../common';
import UserService from 'services/UserService';
import User from 'entities/User';

const logger = Logger(__filename);

class GoogleLoginController {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.post('/', PromiseRejectionHandler(this.googleLogin));
    }

    private async googleLogin(req: Request, res: Response) {
        logger.info(
            `POST /auth/google called, body: ${JSON.stringify(req.body)}`
        );

        const { firstname, lastname, google_id, email } = req.body;

        try {
            const foundUser = await UserService.findByGoogleId(google_id);

            if (!foundUser) {
                const newUser = new User();
                newUser.firstname = firstname;
                newUser.lastname = lastname;
                newUser.googleId = google_id;
                newUser.email = email;

                const savedUser = await UserService.save(newUser);

                const secret: string | undefined = process.env.JWT_TOKEN_SECRET;

                if (secret) {
                    const accessToken = sign(
                        {
                            id: savedUser.id,
                        },
                        secret
                    );

                    logger.info(
                        `POST /auth/google status code: ${StatusCodes.CREATED}`
                    );

                    return res.status(StatusCodes.OK).send({
                        token: accessToken,
                        user: savedUser,
                    });
                }
            } else {
                const secret: string | undefined = process.env.JWT_TOKEN_SECRET;

                if (secret) {
                    const accessToken = sign(
                        {
                            id: foundUser.id,
                        },
                        secret
                    );

                    logger.info(
                        `POST /auth/google status code: ${StatusCodes.CREATED}`
                    );

                    return res.status(StatusCodes.OK).send({
                        token: accessToken,
                        user: foundUser,
                    });
                }
            }
        } catch (error) {
            logger.info(`POST /auth/google status code ${StatusCodes.BAD_REQUEST}`);
            return res.sendStatus(StatusCodes.BAD_REQUEST);
        }
    }
}

export default new GoogleLoginController().router;
