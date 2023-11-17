import { serial, text } from 'drizzle-orm/pg-core';
import { mySchema } from "../schemasConfig";


const regions = mySchema.table('regions', {
    regionId: serial('region_id').primaryKey(),
    regionDescription: text('region_description'),
});

export default regions;
