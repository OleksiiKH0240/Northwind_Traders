import { Router } from 'express';
import customer from 'controlers/Customer';
import customerMiddleware from 'middlewares/CustomerMiddleware';

const customerRouter = Router();

customerRouter.get("/all", customer.getAllCustomers);
customerRouter.get("/by-id/:customer_id", customerMiddleware.idValidation, customer.getCustomerById);

export default customerRouter;
