import { text, varchar } from 'drizzle-orm/pg-core';
import { mySchema } from "../schemasConfig";


const customers = mySchema.table('customers', {
    customerId: varchar('customer_id', { length: 5 }).primaryKey(),
    companyName: text('company_name'),
    contactName: text('contact_name'),
    contactTitle: text('contact_title'),
    address: text('address'),
    city: text('city'),
    region: text('region'),
    postalCode: text('postal_code'),
    country: text('country'),
    phone: text('phone'),
    fax: text('fax'),
});

export default customers;
