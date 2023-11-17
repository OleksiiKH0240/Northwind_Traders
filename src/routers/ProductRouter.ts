import { Router } from 'express';
import product from 'controlers/Product';
import productMiddleware from 'middlewares/ProductMiddleware';


const productRouter = Router();

productRouter.get("/products", product.getAllProducts);
productRouter.get("/product/:product_id", productMiddleware.idValidation, product.getProductById);

export default productRouter;
