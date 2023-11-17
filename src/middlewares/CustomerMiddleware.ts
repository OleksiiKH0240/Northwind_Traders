import { Request, Response, NextFunction } from "express";

class CustomerMiddleware {
    idValidation = async (req: Request, res: Response, next: NextFunction) => {
        const customerId = req.params.customer_id;
        if (customerId === undefined || customerId.length != 5) {
            return res.status(400).send("wrong format of customerId");
        }
        next();
    }
}

export default new CustomerMiddleware();
