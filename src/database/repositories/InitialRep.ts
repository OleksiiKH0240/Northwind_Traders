import { db, migrationClient, POSTGRES_DB } from "database/databaseConnection";
import { sql } from "drizzle-orm";
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from "postgres";


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

class InitialRep {
    dbClient
    migrationClient

    constructor() {
        this.dbClient = db;
        this.migrationClient = migrationClient;
    }

    migrateDatabase = async () => {
        await migrate(drizzle(this.migrationClient), { migrationsFolder: "drizzle" });
        console.log("database migration was successfuly done");
    }

    fillDatabase = async () => {
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
}

export default new InitialRep();
