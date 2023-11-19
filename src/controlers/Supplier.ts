import supplierRep from "database/repositories/SupplierRep";
import { Request, Response, NextFunction } from "express";

class Supplier {
    getAllSuppliers = async (req: Request, res: Response, next: NextFunction) => {
        let dbResponse, suppliersObj;
        try {
            dbResponse = await supplierRep.allSuppliers();
            suppliersObj = dbResponse.result;

            res.status(200).json({
                response: suppliersObj,
                dt: dbResponse.dt,
                sqlQuery: dbResponse.sqlQuery,
                productVersion: dbResponse.PRODUCT_VERSION,
                queryTime: dbResponse.queryTime
            });
        } catch (error) {
            next(error);
        }
    }

    getSupplierById = async (req: Request, res: Response, next: NextFunction) => {
        const supplierId = Number(req.params.supplier_id);

        let dbResponse, supplierObj;
        try {
            dbResponse = await supplierRep.supplierById(supplierId);
            supplierObj = dbResponse.result;

            let response;
            if (supplierObj["Home Page"]) {
                response = supplierObj;
            }
            else {
                const { "Home Page": unUsed, ...rest } = supplierObj;
                response = rest;
            }

            res.status(200).json({
                response: response,
                dt: dbResponse.dt,
                sqlQuery: dbResponse.sqlQuery,
                productVersion: dbResponse.PRODUCT_VERSION,
                queryTime: dbResponse.queryTime
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new Supplier();
