import { serial, text } from 'drizzle-orm/pg-core';
import { mySchema } from "../schemasConfig";


const categories = mySchema.table('categories', {
    categoryId: serial('category_id').primaryKey(),
    categoryName: text('category_name'),
    description: text('description'),
});

export default categories;
