import { Router } from "express";
import order from "controlers/Order";
import orderMiddleware from "middlewares/OrderMiddleware";


const orderRouter = Router();

orderRouter.get("/orders", order.getAllOrders);
orderRouter.get("/order/:order_id", orderMiddleware.idValidation, order.getOrderById);

export default orderRouter;
