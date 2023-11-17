import { Request, Response, NextFunction } from "express";

class SupplierMiddleware {
    idValidation = async (req: Request, res: Response, next: NextFunction) => {
        const supplierId = Number(req.params.supplier_id);
        if (Number.isNaN(supplierId)) {
            return res.status(400).send("wrong format of supplierId");
        }
        next();
    }
}

export default new SupplierMiddleware();
