import { Request, Response, NextFunction } from "express";

class SearchMiddleware {
    queryParamsValidation = async (req: Request, res: Response, next: NextFunction) => {
        const searchText = String(req.query.SearchText).toLowerCase();
        const tableName = String(req.query.tblName);
        if (["undefined", ""].includes(searchText) || !["Customers", "Products"].includes(tableName)) {
            return res.status(200).json({});
        }
        next();
    }
}

export default new SearchMiddleware();
