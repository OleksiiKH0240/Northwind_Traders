import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { sql, eq, like } from 'drizzle-orm';
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

    async getCustomersByCompanyName(companyName: string): Promise<{
        customerId: string,
        companyName: string,
        contactName: string,
        contactTitle: string,
        phone: string
    }[]> {
        const queryResult = await this.dbClient.execute(sql.raw(`
        select customer_id, company_name, contact_name, contact_title, phone
        from ${POSTGRES_DB}.customers
        where lower(company_name) like '%${companyName}%';`));

        const result = queryResult.map((customerObj) => {
            return {
                customerId: String(customerObj.customer_id),
                companyName: String(customerObj.company_name),
                contactName: String(customerObj.contact_name),
                contactTitle: String(customerObj.contact_title),
                phone: String(customerObj.phone)
            };
        })

        return result;
    }

    async getAllSuppliers(): Promise<Array<typeof schemas.suppliers.$inferSelect>> {
        const result = await this.dbClient.select().from(schemas.suppliers);
        return result;
    }

    async getSupplierById(supplierId: number): Promise<typeof schemas.suppliers.$inferSelect> {
        const result = await this.dbClient.select().from(schemas.suppliers).where(eq(schemas.suppliers.supplierId, supplierId));
        return result[0];
    }

    async getAllProducts(): Promise<Array<typeof schemas.products.$inferSelect>> {
        const result = await this.dbClient.select().from(schemas.products);
        return result;
    }

    async getProductById(productId: number): Promise<typeof schemas.products.$inferSelect> {
        const result = await this.dbClient.select().from(schemas.products).where(eq(schemas.products.productId, productId));
        return result[0];
    }

    async getProductsByName(productName: string): Promise<{
        productId: number,
        productName: string,
        quantityPerUnit: string,
        unitPrice: number,
        unitsInStock: number
    }[]> {
        const queryResult = await this.dbClient.execute(sql.raw(`
        select product_id, product_name, quantity_per_unit, units_in_stock
        from ${POSTGRES_DB}.products
        where lower(product_name) like '%${productName}%';`));
        const result = queryResult.map((productObj) => {
            return {
                productId: Number(productObj.product_id),
                productName: String(productObj.product_name),
                quantityPerUnit: String(productObj.quantity_per_unit),
                unitPrice: Number(productObj.unit_price),
                unitsInStock: Number(productObj.units_in_stock)
            };
        })

        return result;
    }

    async getAllOrders(): Promise<{
        orderId: number,
        TotalPrice: number,
        Products: number,
        Quantity: number,
        Shipped: string,
        ShipName: string,
        City: string,
        Country: string
    }[]> {
        const queryResult = await this.dbClient.execute(sql.raw(`
        select orders.order_id,
            total_price,
            products,
            quantity,
            shipped_date,
            ship_name,
            ship_city,
            ship_country
        from (select order_id,
            sum(order_details.unit_price * order_details.quantity) AS total_price,
            count(order_details.order_id)                                            AS products,
            sum(order_details.quantity)                                              AS quantity

            from ${POSTGRES_DB}.order_details
            group by ${POSTGRES_DB}.order_details.order_id) orders_numbers
        left join ${POSTGRES_DB}.orders on orders_numbers.order_id = orders.order_id;`))
        // console.log(queryResult);
        const result = queryResult.map((orderObj) => {
            return {
                orderId: Number(orderObj.order_id),
                TotalPrice: Number(orderObj.total_price),
                Products: Number(orderObj.products),
                Quantity: Number(orderObj.quantity),
                Shipped: String(orderObj.shipped_date),
                ShipName: String(orderObj.ship_name),
                City: String(orderObj.ship_city),
                Country: String(orderObj.ship_country)
            }
        })

        return result;
    }

    async getOrderById(orderId: number): Promise<{
        orderId: number,
        TotalPrice: number,
        TotalProducts: number,
        TotalQuantity: number,
        TotalDiscount: number,
        customerId: string,
        ShippedDate: string,
        ShipName: string,
        ShipCity: string,
        ShipRegion: string,
        ShipPostalCode: string,
        ShipCountry: string,
        ProductsInOrder: {
            productId: number,
            Product: string,
            Quantity: number,
            OrderPrice: number,
            TotalPrice: number,
            Discount: number
        }[]
    }[] | {}> {
        const queryResult = await this.dbClient.execute(sql.raw(`
        select orders.order_id,
        total_price,
        total_products,
        total_quantity,
        total_discount,
        orders.customer_id,
        shipped_date,
        ship_name,
        ship_city,
        (case when (ship_region is not null) then ship_region else region end) as ship_region,
        ship_postal_code,
        ship_country,
        p.product_id,
        product_name,
        quantity,
        od.unit_price               as order_price,
        od.unit_price * od.quantity as price,
        od.discount

        from (select order_id,
              sum(order_details.unit_price * order_details.quantity) AS total_price,
              sum(order_details.unit_price * order_details.quantity *
                 order_details.discount)                            AS total_discount,
              count(order_details.order_id)                          AS total_products,
              sum(order_details.quantity)                            AS total_quantity

              from ${POSTGRES_DB}.order_details
              group by ${POSTGRES_DB}.order_details.order_id) orders_numbers
         left join ${POSTGRES_DB}.orders on orders_numbers.order_id = orders.order_id
         left join ${POSTGRES_DB}.order_details od on orders.order_id = od.order_id
         left join ${POSTGRES_DB}.products p on p.product_id = od.product_id
         left join ${POSTGRES_DB}.customers c on c.customer_id = orders.customer_id
        where orders.order_id = ${orderId};`));

        if (queryResult.length == 0) return {};

        const orderObj = queryResult[0];
        const orderResult = {
            orderId: Number(orderObj.order_id),
            TotalPrice: Number(orderObj.total_price),
            TotalProducts: Number(orderObj.total_products),
            TotalQuantity: Number(orderObj.total_quantity),
            TotalDiscount: Number(orderObj.total_discount),
            customerId: String(orderObj.customer_id),
            ShippedDate: String(orderObj.shipped_date),
            ShipName: String(orderObj.ship_name),
            ShipCity: String(orderObj.ship_city),
            ShipRegion: String(orderObj.ship_region),
            ShipPostalCode: String(orderObj.ship_postal_code),
            ShipCountry: String(orderObj.ship_country)
        };

        const productsInOrder = queryResult.map((orderObj) => {
            return {
                productId: Number(orderObj.product_id),
                Product: String(orderObj.product_name),
                Quantity: Number(orderObj.quantity),
                OrderPrice: Number(orderObj.order_price),
                TotalPrice: Number(orderObj.price),
                Discount: Number(orderObj.discount)
            };
        });

        const result = { ...orderResult, ProductsInOrder: productsInOrder };
        return result;
    }
}


export const northwindTradersModel = new NorthwindTradersModel();


