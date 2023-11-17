import productRep from "database/repositories/ProductRep";
import { Request, Response } from "express";

class Product {
    getAllProducts = async (req: Request, res: Response) => {
        let productsObj, dbResponse;
        try {
            dbResponse = await productRep.allProducts();
            productsObj = dbResponse.result;
        } catch (error) {
            res.status(500).send("something went wrong on the server side.");
            console.log(error);
            return;
        }

        res.status(200).json({
            response: productsObj,
            dt: dbResponse.dt,
            sqlQuery: dbResponse.sqlQuery,
            productVersion: dbResponse.PRODUCT_VERSION,
            queryTime: dbResponse.queryTime
        });

    }

    getProductById = async (req: Request, res: Response) => {
        const productId = Number(req.params.product_id);

        let productObj, dbResponse;
        try {
            dbResponse = await productRep.productById(productId);
            productObj = dbResponse.result;
        } catch (error) {
            res.status(500).send("something went wrong on the server side.");
            console.log(error);
            return;
        }

        res.status(200).json({
            response: productObj,
            dt: dbResponse.dt,
            sqlQuery: dbResponse.sqlQuery,
            productVersion: dbResponse.PRODUCT_VERSION,
            queryTime: dbResponse.queryTime
        });
    }
}

export default new Product();
