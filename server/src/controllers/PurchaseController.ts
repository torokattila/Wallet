import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { PromiseRejectionHandler } from '../common';
import { Logger } from '../common';
import * as Yup from 'yup';
import PurchaseService, {
    PurchaseFilterOptions,
} from 'services/PurchaseService';
import { validate as uuidValidate } from 'uuid';
import PaginationOptions from 'types/PaginationOptions';
import User from 'entities/User';

const logger = Logger(__filename);

const PurchaseSchema = Yup.object().shape({
    amount: Yup.number().required('amount_required'),
    currency: Yup.string().required('currency_required'),
    category: Yup.string().required('category_required'),
    userId: Yup.string().required('user_id_required'),
});

class PurchaseController {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.get('/', PromiseRejectionHandler(this.listPurchases));
        this.router.post('/', PromiseRejectionHandler(this.createPurchase));
        this.router.get('/:id', PromiseRejectionHandler(this.getPurchase));
        this.router.put('/:id', PromiseRejectionHandler(this.updatePurchase));
        this.router.delete(
            '/:id',
            PromiseRejectionHandler(this.deletePurchase)
        );
    }

    private async listPurchases(req: Request, res: Response) {
        logger.info(
            `GET /purchases called, query params: ${JSON.stringify(req.query)}`
        );

        const { page, size, from, to, category } = req.query;
        const filter = {} as PurchaseFilterOptions;
        const pagination = {} as PaginationOptions;

        const testUser = new User();
        testUser.id = 'aa514990-1b91-451e-af7f-b21057155555';
        testUser.email = 'torcsiattila93@gmail.com';
        testUser.firstname = 'Attila';
        testUser.lastname = 'Török';

        req.user = testUser;

        const userId = req.user.id;

        if (from) {
            filter.from = from as string;
        }

        if (to) {
            filter.to = to as string;
        }

        if (category) {
            filter.category = category as string;
        }

        if (page) {
            pagination.page = Number(page as string);
        }

        if (size) {
            pagination.size = Number(size as string);
        }

        const [purchases, count] = await PurchaseService.list(userId, {
            filter,
            pagination,
        });

        logger.info(`GET /purchases status code: ${StatusCodes.OK}`);
        return res
            .header({
                'X-Total-Count': count,
            })
            .status(StatusCodes.OK)
            .send(purchases);
    }

    private async createPurchase(req: Request, res: Response) {
        logger.info(`POST /purcases called, body: ${JSON.stringify(req.body)}`);

        const purchase = req.body;

        try {
            await PurchaseSchema.validate(purchase, {
                abortEarly: false,
            });
        } catch (error: any) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                errors: error.errors,
            });
        }

        const result = await PurchaseService.create(purchase);

        logger.info(`POST /purchases status code: ${StatusCodes.CREATED}`);
        return res.status(StatusCodes.CREATED).send(result);
    }

    private async getPurchase(req: Request, res: Response) {
        logger.info(
            `GET /puchases/:id called, id param: ${JSON.stringify(
                req.params.id
            )}`
        );

        const id = req.params.id;

        if (!id || !uuidValidate(id)) {
            throw new Error('invalid_path_parameters');
        }

        const purchase = await PurchaseService.findById(id);

        if (!purchase) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                errors: ['purchase_not_found'],
            });
        }

        logger.info(`GET /purchases/:id status code: ${StatusCodes.OK}`);
        return res.status(StatusCodes.OK).send(purchase);
    }

    private async updatePurchase(req: Request, res: Response) {
        logger.info(`PUT /purchases/:id called, id param: ${JSON.stringify(
            req.params.id
        )}, 
        body: ${JSON.stringify(req.body)}`);

        const id = req.params.id;

        if (!id || !uuidValidate(id)) {
            throw new Error('invalid_path_parameters');
        }

        const editablePurchase = req.body;

        try {
            await PurchaseSchema.validate(editablePurchase, {
                abortEarly: false,
            });
        } catch (error: any) {
            return res.status(StatusCodes.BAD_REQUEST).send({
                errors: error.errors,
            });
        }

        const updatedPurchase = await PurchaseService.update(
            id,
            editablePurchase
        );

        logger.info(`PUT /purchases/:id status code: ${StatusCodes.OK}`);
        return res.status(StatusCodes.OK).send(updatedPurchase);
    }

    private async deletePurchase(req: Request, res: Response) {
        logger.info(
            `DELETE /purchases/:id called, id param: ${JSON.stringify(
                req.params.id
            )}`
        );

        const id = req.params.id;

        if (!id || !uuidValidate(id)) {
            throw new Error('invalid_path_parameters');
        }

        await PurchaseService.remove(id);

        logger.info(
            `DELETE /purchases/:id status code: ${StatusCodes.NO_CONTENT}`
        );
        return res.sendStatus(StatusCodes.NO_CONTENT);
    }
}

export default new PurchaseController().router;
