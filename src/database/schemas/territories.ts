import { serial, text, integer } from 'drizzle-orm/pg-core';
import { mySchema } from "../schemasConfig";
import regions from './regions';


const territories = mySchema.table('territories', {
    territoryId: serial('territory_id').primaryKey(),
    territoryDescription: text('territory_description'),
    regionId: integer('region_id').references(() => regions.regionId),
});

export default territories;
