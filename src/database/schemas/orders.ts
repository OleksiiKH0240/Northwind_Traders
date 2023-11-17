import { serial, text, varchar, integer, numeric, date } from 'drizzle-orm/pg-core';
import { mySchema } from "../schemasConfig";
import customers from './customers';
import employees from './employees';


const orders = mySchema.table('orders', {
    orderId: serial('order_id').primaryKey(),
    customerId: varchar('customer_id', { length: 5 }).references(() => customers.customerId),
    employeeId: integer('employee_id').references(() => employees.employeeId),
    orderDate: date('order_date'),
    requiredDate: date('required_date'),
    shippedDate: date('shipped_date'),
    shipVia: integer('ship_via'),
    freight: numeric('freight'),
    shipName: text('ship_name'),
    shipAddress: text('ship_address'),
    shipCity: text('ship_city'),
    shipRegion: text('ship_region'),
    shipPostalCode: text('ship_postal_code'),
    shipCountry: text('ship_country'),
});

export default orders;
