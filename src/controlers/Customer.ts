import customerRep from "database/repositories/CustomerRep";
import { NextFunction, Request, Response } from "express";

class Customer {
    getAllCustomers = async (req: Request, res: Response, next: NextFunction) => {
        let customersObj, dbResponse;

        try {
            dbResponse = await customerRep.allCustomers();
            customersObj = dbResponse.result;

            res.status(200).json({
                response: customersObj,
                dt: dbResponse.dt,
                sqlQuery: dbResponse.sqlQuery,
                productVersion: dbResponse.PRODUCT_VERSION,
                queryTime: dbResponse.queryTime
            });
        } catch (error) {
            next(error);
        }
    }

    getCustomerById = async (req: Request, res: Response, next: NextFunction) => {
        const customerId = req.params.customer_id;
        let customerObj, dbResponse;
        try {
            dbResponse = await customerRep.customerById(customerId);
            customerObj = dbResponse.result;
            
            res.status(200).json({
                response: customerObj,
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

export default new Customer();
