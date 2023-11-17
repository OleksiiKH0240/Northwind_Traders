import { Request, Response, NextFunction } from "express";


class ProductMiddleware {
    idValidation = (req: Request, res: Response, next: NextFunction) => {
        const productId = Number(req.params.product_id);
        if (Number.isNaN(productId)) {
            return res.status(400).send("wrong format of productId");
        }
        next();
    }
}

export default new ProductMiddleware();
