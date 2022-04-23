import { PromiseRejectionHandler } from "common";
import { Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class MeController {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.get('/', PromiseRejectionHandler(this.getUserData));
    }

    private async getUserData(req: Request, res: Response) {
        const user = req.user;

        if (!user) return res.sendStatus(StatusCodes.UNAUTHORIZED);

        return res.status(StatusCodes.OK).send(user);
    }
}

export default new MeController().router;