import { serial, text } from 'drizzle-orm/pg-core';
import { mySchema } from "../schemasConfig";


const shippers = mySchema.table('shippers', {
    shipperId: serial('shipper_id').primaryKey(),
    companyName: text('company_name'),
    phone: text('phone')
});

export default shippers;
