import { Router } from 'express';
import customer from 'controlers/Customer';
import customerMiddleware from 'middlewares/CustomerMiddleware';

const customerRouter = Router();

customerRouter.get("/customers", customer.getAllCustomers);
customerRouter.get("/customer/:customer_id", customerMiddleware.idValidation, customer.getCustomerById);

export default customerRouter;
