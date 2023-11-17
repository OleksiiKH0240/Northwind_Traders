import orderRep from "database/repositories/OrderRep";
import { Request, Response } from "express"


class Order {
    getAllOrders = async (req: Request, res: Response) => {
        let ordersObj, dbResponse;
        try {
            dbResponse = await orderRep.allOrders();
            ordersObj = dbResponse.result;
        } catch (error) {
            res.status(500).send("something went wrong on the server side.");
            console.log(error);
            return;
        }

        res.status(200).json({
            response: ordersObj,
            dt: dbResponse.dt,
            sqlQuery: dbResponse.sqlQuery,
            productVersion: dbResponse.PRODUCT_VERSION,
            queryTime: dbResponse.queryTime
        });
    }

    getOrderById = async (req: Request, res: Response) => {
        const orderId = Number(req.params.order_id);

        let orderObj, dbResponse;
        try {
            dbResponse = await orderRep.orderById(orderId);
            orderObj = dbResponse.result;
        } catch (error) {
            res.status(500).send("something went wrong on the server side.");
            console.log(error);
            return;
        }

        res.status(200).json({
            response: orderObj,
            dt: dbResponse.dt,
            sqlQuery: dbResponse.sqlQuery,
            productVersion: dbResponse.PRODUCT_VERSION,
            queryTime: dbResponse.queryTime
        });
    }
}

export default new Order();
