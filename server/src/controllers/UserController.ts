import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PromiseRejectionHandler } from '../common';
import { Logger } from '../common';
import { validate as uuidValidate } from 'uuid';
import UserService from 'services/UserService';

const logger = Logger(__filename);

class UserController {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.get('/:id', PromiseRejectionHandler(this.getUser));
    }

    private async getUser(req: Request, res: Response) {
        logger.info(
            `GET /users/:id called, id param: ${JSON.stringify(req.params.id)}`
        );

        const id = req.params.id;

        if (!id || !uuidValidate(id)) {
            throw new Error('invalid_path_parameters');
        }

        const user = await UserService.findById(id);

        if (!user) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                errors: ['user_not_found'],
            });
        }

        delete user.password;

        logger.info(`GET /users/:id status code: ${StatusCodes.OK}`);
        return res.status(StatusCodes.OK).send(user);
    }
}

export default new UserController().router;
