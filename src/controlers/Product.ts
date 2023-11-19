import productRep from "database/repositories/ProductRep";
import { Request, Response, NextFunction } from "express";

class Product {
    getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
        let productsObj, dbResponse;
        try {
            dbResponse = await productRep.allProducts();
            productsObj = dbResponse.result;

            res.status(200).json({
                response: productsObj,
                dt: dbResponse.dt,
                sqlQuery: dbResponse.sqlQuery,
                productVersion: dbResponse.PRODUCT_VERSION,
                queryTime: dbResponse.queryTime
            });
        } catch (error) {
            next(error);
        }
    }

    getProductById = async (req: Request, res: Response, next: NextFunction) => {
        const productId = Number(req.params.product_id);

        let productObj, dbResponse;
        try {
            dbResponse = await productRep.productById(productId);
            productObj = dbResponse.result;

            res.status(200).json({
                response: productObj,
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

export default new Product();
