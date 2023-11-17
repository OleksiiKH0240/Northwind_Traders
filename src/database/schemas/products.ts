import { serial, text, integer, numeric } from 'drizzle-orm/pg-core';
import { mySchema } from "../schemasConfig";
import suppliers from './suppliers';
import categories from './categories';


const products = mySchema.table('products', {
    productId: serial('product_id').primaryKey(),
    productName: text('product_name'),
    supplierId: integer('supplier_id').references(() => suppliers.supplierId),
    cattegoryId: integer('cattegory_id').references(() => categories.categoryId),
    quantityPerUnit: text('quantity_per_unit'),
    unitPrice: numeric('unit_price'),
    unitsInStock: integer('units_in_stock'),
    unitsOnOrder: integer('units_on_order'),
    reorderLevel: integer('reorder_level'),
    discontinued: integer('discontinued'),
});

export default products;
