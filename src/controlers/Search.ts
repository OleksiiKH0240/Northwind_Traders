import productRep from "database/repositories/ProductRep";
import customerRep from "database/repositories/CustomerRep";
import { Request, Response } from "express";

class Search {
    getSearchResult = async (req: Request, res: Response) => {
        const tableName = String(req.query.tblName);
        const searchText = String(req.query.SearchText).toLowerCase();

        let result, dbResponse;
        if (tableName == "Customers") {
            dbResponse = await customerRep.customersByCompanyName(searchText);
            result = dbResponse.result;
        }
        else {
            // tableName == "Products"
            dbResponse = await productRep.productsByName(searchText);
            result = dbResponse.result;
        }

        res.status(200).json({
            response: result,
            dt: dbResponse.dt,
            sqlQuery: dbResponse.sqlQuery,
            productVersion: dbResponse.PRODUCT_VERSION,
            queryTime: dbResponse.queryTime
        });
    }
}

export default new Search();
