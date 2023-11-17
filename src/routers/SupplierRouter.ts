import { Router } from 'express';
import supplier from 'controlers/Supplier';
import supplierMiddleware from 'middlewares/SupplierMiddleware';

const supplierRouter = Router();

supplierRouter.get("/suppliers", supplier.getAllSuppliers);
supplierRouter.get("/supplier/:supplier_id", supplierMiddleware.idValidation, supplier.getSupplierById);

export default supplierRouter;
