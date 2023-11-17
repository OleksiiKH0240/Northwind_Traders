import { Request, Response, NextFunction } from "express";

class OrderMiddleware {
    idValidation = (req: Request, res: Response, next: NextFunction) => {
        const orderId = Number(req.params.order_id);
        if (Number.isNaN(orderId)) {
            return res.status(400).send("wrong format of orderId");
        }
        next();
    }
}

export default new OrderMiddleware();
