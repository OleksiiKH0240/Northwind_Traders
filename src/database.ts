import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { sql, eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import * as schemas from './schemas';
import postgres from 'postgres';
import donenv from 'dotenv';


donenv.config();

const { POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, POSTGRES_HOST, POSTGRES_PORT, ENDPOINT_ID } = process.env;

const POSTGRES_URL = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;

const queryClientOptions: {
    ssl: boolean | object | "require" | "allow" | "prefer" | "verify-full" | undefined,
    connection: { options: string }
} = {
    ssl: 'require',
    connection: {
        options: `project=${ENDPOINT_ID}`,
    }
};

const migrationClientOptions: {
    max: number,
    ssl: boolean | object | "require" | "allow" | "prefer" | "verify-full" | undefined,
    connection: { options: string }
} = { max: 1, ...queryClientOptions };
const migrationClient = postgres(POSTGRES_URL, migrationClientOptions);


const queryClient = postgres(POSTGRES_URL, queryClientOptions);
const db = drizzle(queryClient);

const tablesFilesNames = [
    ["employees", "Employees.csv"],
    ["regions", "Regions.csv"],
    ["territories", "Territories.csv"],
    ["employee_territories", "EmployeeTerritories.csv"],
    ["suppliers", "Suppliers.csv"],
    ["categories", "Categories.csv"],
    ["products", "Products.csv"],
    ["shippers", "Shippers.csv"],
    ["customers", "Customers.csv"],
    ["orders", "Orders.csv"],
    ["order_details", "OrderDetails.csv"]
]

const tablesRowsCount: { [index: string]: number } = {
    "employees": 9,
    "regions": 4, "territories": 53, "employee_territories": 49,
    "suppliers": 29, "categories": 8, "products": 77, "shippers": 3,
    "customers": 93, "orders": 830, "order_details": 2155
}


class NorthwindTradersModel {
    dbClient: PostgresJsDatabase<Record<string, never>>

    constructor(dbClient = db) {
        this.dbClient = db;
    }

    async migrateDatabase() {
        await migrate(drizzle(migrationClient), { migrationsFolder: "./drizzle" });
        console.log("database migration was successfuly done");
    }

    async fillDatabase() {
        let result;
        for (const [tableName, fileName] of tablesFilesNames) {

            try {
                result = await this.dbClient.execute(sql.raw(`select count(*) from ${POSTGRES_DB}.${tableName};`));
                // console.log(tableName, result);

                if (result[0].count != tablesRowsCount[tableName]) {
                    // console.log(tableName, result);
                    if (result[0].count != 0) await this.dbClient.execute(sql.raw(`delete from ${POSTGRES_DB}.${tableName};`))

                    const sqlQuery = `
                    COPY ${POSTGRES_DB}.${tableName} 
                    FROM '/tables_data_example/${fileName}' 
                    DELIMITER ',' 
                    CSV HEADER;`;
                    result = await this.dbClient.execute(sql.raw(sqlQuery));
                    // console.log(result);
                    console.log(tableName, " was uploaded.");
                }
            }
            catch (error) {
                if (error instanceof postgres.PostgresError) {
                    // console.log(error);
                    continue;
                }
                else console.log(error);
            }
        }
    }

    async getAllEmployees(): Promise<Array<typeof schemas.employees.$inferSelect>> {
        const result = await this.dbClient.select().from(schemas.employees);
        return result;
    }

    async getEmployeeById(employeeId: number): Promise<typeof schemas.employees.$inferSelect> {
        const result = await this.dbClient.select().from(schemas.employees).where(eq(schemas.employees.employeeId, employeeId));
        return result[0];
    }

    async getAllCustomers(): Promise<Array<typeof schemas.customers.$inferSelect>> {
        const result = await this.dbClient.select().from(schemas.customers);
        return result;
    }

    async getCustomerById(customerId: string): Promise<typeof schemas.customers.$inferSelect> {
        const result = await this.dbClient.select().from(schemas.customers).where(eq(schemas.customers.customerId, customerId));
        return result[0];
    }

    async getAllSuppliers(): Promise<Array<typeof schemas.suppliers.$inferSelect>> {
        const result = await this.dbClient.select().from(schemas.suppliers);
        return result;
    }

    async getSupplierById(supplierId: number): Promise<typeof schemas.suppliers.$inferSelect> {
        const result = await this.dbClient.select().from(schemas.suppliers).where(eq(schemas.suppliers.supplierId, supplierId));
        return result[0];
    }
}


export const northwindTradersModel = new NorthwindTradersModel();
// console.log(await northwindTradersModel.getAllEmployees());
