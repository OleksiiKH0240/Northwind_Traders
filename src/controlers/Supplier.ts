import supplierRep from "database/repositories/SupplierRep";
import { Request, Response } from "express";

class Supplier {
    getAllSuppliers = async (req: Request, res: Response) => {
        let dbResponse, suppliersObj;
        try {
            dbResponse = await supplierRep.allSuppliers();
            suppliersObj = dbResponse.result;
        } catch (error) {
            res.status(500).send("something went wrong on the server side.");
            console.log(error);
            return;
        }

        res.status(200).json({
            response: suppliersObj,
            dt: dbResponse.dt,
            sqlQuery: dbResponse.sqlQuery,
            productVersion: dbResponse.PRODUCT_VERSION,
            queryTime: dbResponse.queryTime
        });
    }

    getSupplierById = async (req: Request, res: Response) => {
        const supplierId = Number(req.params.supplier_id);

        let dbResponse, supplierObj;
        try {
            dbResponse = await supplierRep.supplierById(supplierId);
            supplierObj = dbResponse.result;
        } catch (error) {
            res.status(500).send("something went wrong on the server side.");
            console.log(error);
            return;
        }


        let response;
        if (supplierObj["Home Page"]) {
            response = supplierObj;
        }
        else {
            const { "Home Page": unUsed, ...rest } = supplierObj;
            response = rest;
        }

        // res.status(200).send();
        res.status(200).json({
            response: response,
            dt: dbResponse.dt,
            sqlQuery: dbResponse.sqlQuery,
            productVersion: dbResponse.PRODUCT_VERSION,
            queryTime: dbResponse.queryTime
        });
    }
}

export default new Supplier();
