import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PromiseRejectionHandler } from '../common';
import { Logger } from '../common';
import { validate as uuidValidate } from 'uuid';
import UserService from 'services/UserService';
import * as Yup from 'yup';
import User from 'entities/User';

const logger = Logger(__filename);

const UserUpdateSchema = Yup.object().shape({
    email: Yup.string().required('email_required'),
    firstname: Yup.string().required('firstname_required'),
    lastname: Yup.string().required('lastname_required'),
});

class UserController {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.get('/:id', PromiseRejectionHandler(this.getUser));
        this.router.put('/:id', PromiseRejectionHandler(this.updateUser));
        this.router.put(
            '/:id/password/update',
            PromiseRejectionHandler(this.updatePassword)
        );
        this.router.delete('/:id', PromiseRejectionHandler(this.deleteUser));
    }

    private async getUser(req: Request, res: Response) {
        logger.info(
            `GET /users/:id called, id param: ${JSON.stringify(req.params.id)}`
        );

        const id = req.params.id;

        if (!id || !uuidValidate(id)) {
            throw new Error('invalid_path_parameters');
        }

        let user: User;

        try {
            user = await UserService.findById(id);
        } catch (error: any) {
            logger.error('Find user by id operation failed in UserService');

            return res.status(StatusCodes.BAD_REQUEST).send({
                errors: ['user_not_found'],
            });
        }

        logger.info(`GET /users/:id status code: ${StatusCodes.OK}`);
        return res.status(StatusCodes.OK).send(user);
    }

    private async updateUser(req: Request, res: Response) {
        logger.info(`PUT /users/:id called, id param: ${JSON.stringify(
            req.params.id
        )},
        body: ${JSON.stringify(req.body)}`);

        const id = req.params.id;

        if (!id || !uuidValidate(id)) {
            throw new Error('invalid_path_parameters');
        }

        const editableUser = req.body;

        try {
            await UserUpdateSchema.validate(editableUser, {
                abortEarly: false,
            });
        } catch (error: any) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                errors: error.errors,
            });
        }

        const foundUserByEmail = await UserService.findByEmail(req.body.email);

        if (foundUserByEmail && foundUserByEmail.id !== req.user.id) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                errors: ['existing_email'],
            });
        }

        const updatedUser = await UserService.update(id, editableUser);

        logger.info(`PUT /users/:id status code: ${StatusCodes.OK}`);
        return res.status(StatusCodes.OK).send(updatedUser);
    }

    private async updatePassword(req: Request, res: Response) {
        logger.info(
            `PUT /users/:id/password/update called, id param: ${JSON.stringify(
                req.params.id
            )}`
        );

        const id = req.params.id;

        if (!id || !uuidValidate(id)) {
            throw new Error('invalid_path_parameters');
        }

        const { currentPassword, newPassword, newPasswordConfirm } = req.body;

        if (currentPassword) {
            const userByEmail = await UserService.findByEmail(req.user.email);
            const isValidPassword = await UserService.comparePassword(
                currentPassword,
                userByEmail.password
            );

            if (!isValidPassword) {
                return res.status(StatusCodes.BAD_REQUEST).send({
                    errors: ['invalid_current_password'],
                });
            }
        }

        if (!newPassword) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                errors: ['password_is_required'],
            });
        }

        if (!newPasswordConfirm) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                errors: ['password_confirm_is_required'],
            });
        }

        if (
            !UserService.validatePasswordMatch(newPassword, newPasswordConfirm)
        ) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                errors: ['passwords_must_match'],
            });
        }

        const result = await UserService.updatePassword(id, newPassword);

        logger.info(
            `PUT /users/:id/password/update status code: ${StatusCodes.OK}`
        );
        return res.status(StatusCodes.OK).send(result);
    }

    private async deleteUser(req: Request, res: Response) {
        logger.info(
            `DELETE /users/:id called, id param: ${JSON.stringify(
                req.params.id
            )}`
        );

        const id = req.params.id;

        if (!id || !uuidValidate(id)) {
            throw new Error('invalid_path_parameters');
        }

        await UserService.remove(id);

        logger.info(`DELETE /users/:id status code: ${StatusCodes.NO_CONTENT}`);
        return res.sendStatus(StatusCodes.NO_CONTENT);
    }
}

export default new UserController().router;
