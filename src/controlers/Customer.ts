import customerRep from "database/repositories/CustomerRep";
import { Request, Response } from "express";

class Customer {
    getAllCustomers = async (req: Request, res: Response) => {
        let customersObj, dbResponse;
        try {
            dbResponse = await customerRep.allCustomers();
            customersObj = dbResponse.result;
        } catch (error) {
            res.status(500).send("something went wrong on the server side.");
            console.log(error);
            return;
        }

        res.status(200).json({
            response: customersObj,
            dt: dbResponse.dt,
            sqlQuery: dbResponse.sqlQuery,
            productVersion: dbResponse.PRODUCT_VERSION,
            queryTime: dbResponse.queryTime
        });
    }

    getCustomerById = async (req: Request, res: Response) => {
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
            res.status(500).send("something went wrong on the server side.");
            console.log(error);
            return;
        }
    }
}

export default new Customer();
