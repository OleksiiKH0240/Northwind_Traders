import { serial, text } from 'drizzle-orm/pg-core';
import { mySchema } from "../schemasConfig";


const suppliers = mySchema.table('suppliers', {
    supplierId: serial('supplier_id').primaryKey(),
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
    homePage: text('home_page')
});

export default suppliers;
