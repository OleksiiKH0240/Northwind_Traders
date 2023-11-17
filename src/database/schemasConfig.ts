import { pgSchema } from 'drizzle-orm/pg-core';
import "dotenv/config";


const POSTGRES_DB = process.env.POSTGRES_DB;
if (POSTGRES_DB === undefined) {
    console.log("postgres_db is not specified. it's unable to find a right schema.")
    process.exit(1);
}

export const mySchema = pgSchema(POSTGRES_DB);


// export const sqlMetrics = mySchema.table('sql_metrics', {
//     queryCount: numeric('query_count'),
//     resultsCount: numeric('results_count'),
//     select: text('select'),
//     selectWhere: text('select_where'),
//     selectWhereJoin: text('select_where_join')
// })

// export const ActivityLog = mySchema.table('activity_log', {
//     logId: serial('log_id').primaryKey(),
//     dt: timestamp('dt'),
//     productVersion: text('product_version'),
//     queryTime: time('query_time')
// })
