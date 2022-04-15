import { NextFunction, Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PromiseRejectionHandler } from '../common';
import UserService from 'services/UserService';
import { Logger } from '../common';

const logger = Logger(__filename);

class RegistrationController {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.post('/', PromiseRejectionHandler(this.register));
    }

    private async register(req: Request, res: Response) {
        logger.info('POST /register called');

        const data = req.body;

        if (!data.password) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                errors: ['password_required'],
            });
        }

        if (!data.passwordConfirm) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                errors: ['password_confirm_required'],
            });
        }

        if (
            !UserService.validatePasswordMatch(
                data.password,
                data.passwordConfirm
            )
        ) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                errors: ['passwords_must_match'],
            });
        }

        if (!data.firstname.trim() || !data.lastname.trim()) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                errors: ['firstname_and_lastname_required'],
            });
        }

        const existingEmail = await UserService.findByEmail(data.email);

        if (existingEmail) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                errors: ['email_already_exists'],
            });
        }

        const user = await UserService.save(data);
        user.password = await UserService.generateHash(user.password);

        const result = await UserService.save(user);

        logger.info(`POST /register status code: ${StatusCodes.OK}`);
        return res.status(StatusCodes.OK).send(result);
    }
}

export default new RegistrationController().router;
