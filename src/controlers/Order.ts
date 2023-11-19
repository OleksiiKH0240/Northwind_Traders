import orderRep from "database/repositories/OrderRep";
import { Request, Response, NextFunction } from "express"


class Order {
    getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
        let ordersObj, dbResponse;
        try {
            dbResponse = await orderRep.allOrders();
            ordersObj = dbResponse.result;

            res.status(200).json({
                response: ordersObj,
                dt: dbResponse.dt,
                sqlQuery: dbResponse.sqlQuery,
                productVersion: dbResponse.PRODUCT_VERSION,
                queryTime: dbResponse.queryTime
            });
        } catch (error) {
            next(error);
        }
    }

    getOrderById = async (req: Request, res: Response, next: NextFunction) => {
        const orderId = Number(req.params.order_id);

        let orderObj, dbResponse;
        try {
            dbResponse = await orderRep.orderById(orderId);
            orderObj = dbResponse.result;

            res.status(200).json({
                response: orderObj,
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

export default new Order();
