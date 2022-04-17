import { PromiseRejectionHandler } from 'common';
import { Request, Response, Router } from 'express';
import { Logger } from '../common';
import * as Yup from 'yup';
import { StatusCodes } from 'http-status-codes';
import IncomeService, { IncomeFilterOptions } from '../services/IncomeService';
import { validate as uuidValidate } from 'uuid';
import PaginationOptions from 'types/PaginationOptions';

const logger = Logger(__filename);

const IncomeSchema = Yup.object().shape({
    amount: Yup.string().required('amount_required'),
    userId: Yup.string().required('user_id_required'),
});

class IncomeController {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.get('/', PromiseRejectionHandler(this.listIncomes));
        this.router.post('/', PromiseRejectionHandler(this.createIncome));
        this.router.get('/:id', PromiseRejectionHandler(this.getIncome));
        this.router.put('/:id', PromiseRejectionHandler(this.updateIncome));
        this.router.delete('/:id', PromiseRejectionHandler(this.deleteIncome));
    }

    private async listIncomes(req: Request, res: Response) {
        logger.info(
            `GET /incomes called, query params: ${JSON.stringify(req.query)}`
        );

        const { page, size, from, to } = req.query;
        const filter = {} as IncomeFilterOptions;
        const pagination = {} as PaginationOptions;

        const userId = req.user.id;

        if (from) {
            filter.from = from as string;
        }

        if (to) {
            filter.to = to as string;
        }

        if (page) {
            pagination.page = Number(page as string);
        }

        if (size) {
            pagination.size = Number(size as string);
        }

        const [incomes, count] = await IncomeService.list(userId, {
            filter,
            pagination,
        });

        logger.info(`GET /incomes status code: ${StatusCodes.OK}`);
        return res
            .header({
                'X-Total-Count': count,
            })
            .status(StatusCodes.OK)
            .send(incomes);
    }

    private async createIncome(req: Request, res: Response) {
        logger.info(`POST /incomes called, body: ${JSON.stringify(req.body)}`);

        const income = req.body;

        try {
            await IncomeSchema.validate(income, { abortEarly: false });
        } catch (error: any) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                errors: error.errors,
            });
        }

        const result = await IncomeService.create(income);

        logger.info(`POST /incomes status code: ${StatusCodes.CREATED}`);
        return res.status(StatusCodes.CREATED).send(result);
    }

    private async getIncome(req: Request, res: Response) {
        logger.info(
            `GET /incomes/:id called, id param: ${JSON.stringify(
                req.params.id
            )}`
        );

        const id = req.params.id;

        if (!id || !uuidValidate(id)) {
            throw new Error('invalid_path_parameters');
        }

        const foundIncome = await IncomeService.findById(id);

        if (!foundIncome) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                errors: ['income_not_found'],
            });
        }

        logger.info(`GET /incomes/:id status code: ${StatusCodes.OK}`);
        return res.status(StatusCodes.OK).send(foundIncome);
    }

    private async updateIncome(req: Request, res: Response) {
        logger.info(`PUT /incomes/:id called, id param: ${JSON.stringify(
            req.params.id
        )}, 
        body: ${JSON.stringify(req.body)}`);

        const id = req.params.id;

        if (!id || !uuidValidate(id)) {
            throw new Error('invalid_path_parameters');
        }

        const editableIncome = req.body;

        try {
            await IncomeSchema.validate(editableIncome, { abortEarly: false });
        } catch (error: any) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                errors: error.errors,
            });
        }

        const updatedIncome = await IncomeService.update(id, editableIncome);

        logger.info(`PUT /incomes/:id status code: ${StatusCodes.OK}`);
        return res.status(StatusCodes.OK).send(updatedIncome);
    }

    private async deleteIncome(req: Request, res: Response) {
        logger.info(
            `DELETE /incomes/:id called, id param: ${JSON.stringify(
                req.params.id
            )}`
        );

        const id = req.params.id;

        if (!id || !uuidValidate(id)) {
            throw new Error('invalid_path_parameters');
        }

        await IncomeService.remove(id);

        logger.info(
            `DELETE /incomes/:id status code: ${StatusCodes.NO_CONTENT}`
        );
        return res.sendStatus(StatusCodes.NO_CONTENT);
    }
}

export default new IncomeController().router;
