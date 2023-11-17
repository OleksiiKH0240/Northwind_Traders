import { integer, numeric } from 'drizzle-orm/pg-core';
import { mySchema } from "../schemasConfig";
import orders from './orders';
import products from './products';


const orderDetails = mySchema.table('order_details', {
    orderId: integer('order_id').references(() => orders.orderId),
    productId: integer('product_id').references(() => products.productId),
    unitPrice: numeric('unit_price'),
    quantity: integer('quantity'),
    discount: numeric('discount')
});

export default orderDetails;
