import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { sql, eq, like } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import * as schemas from './schemas';
import postgres from 'postgres';
import donenv from 'dotenv';


donenv.config();

const { POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, POSTGRES_HOST, POSTGRES_PORT, ENDPOINT_ID, PRODUCT_VERSION } = process.env;

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

    async getAllSuppliers(): Promise<{
        dt: Date, "PRODUCT_VERSION": string, queryTime: number, sqlQuery: string, result: {
            supplierId: number,
            Company: string | null,
            Contact: string | null,
            Title: string | null,
            City: string | null,
            Country: string | null
        }[]
    }> {
        const start = Date.now();
        const result = await this.dbClient.select({
            supplierId: schemas.suppliers.supplierId,
            Company: schemas.suppliers.companyName,
            Contact: schemas.suppliers.contactName,
            Title: schemas.suppliers.contactTitle,
            City: schemas.suppliers.city,
            Country: schemas.suppliers.country
        }).from(schemas.suppliers);
        const end = Date.now();

        const sqlQuery = `
        select supplier_id as supplierId, company_name as Company, contact_name as Contact, contact_title as Title, 
        city as City, country as Country from ${POSTGRES_DB}.suppliers;`
        return { dt: new Date(), "PRODUCT_VERSION": `${PRODUCT_VERSION}`, queryTime: (end - start) / 1000, sqlQuery, result };
    }

    async getSupplierById(supplierId: number): Promise<{
        dt: Date, "PRODUCT_VERSION": string, queryTime: number, sqlQuery: string, result: {
            supplierId: number,
            "Company Name": string | null,
            "Contact Name": string | null,
            "Contact Title": string | null,
            Address: string | null,
            City: string | null,
            Region: string | null,
            "Postal Code": string | null,
            Country: string | null,
            Phone: string | null,
            "Home Page": string | null
        }
    }> {
        const start = Date.now();
        const result = await this.dbClient.select({
            supplierId: schemas.suppliers.supplierId,
            "Company Name": schemas.suppliers.companyName,
            "Contact Name": schemas.suppliers.contactName,
            "Contact Title": schemas.suppliers.contactTitle,
            Address: schemas.suppliers.address,
            City: schemas.suppliers.city,
            Region: schemas.suppliers.region,
            "Postal Code": schemas.suppliers.postalCode,
            Country: schemas.suppliers.country,
            Phone: schemas.suppliers.phone,
            "Home Page": schemas.suppliers.homePage
        }).from(schemas.suppliers).where(eq(schemas.suppliers.supplierId, supplierId));
        const end = Date.now();

        const sqlQuery = `
        select supplier_id as supplierId, company_name as "Company Name", contact_name as "Contact Name", 
        contact_title as "Contact Title", city as City, country as Country, address as Address, region as Region, 
        postal_code as "Postal Code", home_page as "Home Page", phone as Phone from ${POSTGRES_DB}.suppliers where supplier_id=${supplierId};`;
        return { dt: new Date(), "PRODUCT_VERSION": `${PRODUCT_VERSION}`, queryTime: (end - start) / 1000, sqlQuery, result: result[0] };
    }

    async getAllProducts(): Promise<{
        dt: Date, "PRODUCT_VERSION": string, queryTime: number, sqlQuery: string, result: {
            productId: number,
            Name: string | null,
            "Qt per unit": string | null,
            Price: string | null,
            Stock: number | null,
            Order: number | null
        }[]
    }> {
        const start = Date.now();
        const result = await this.dbClient.select({
            productId: schemas.products.productId,
            Name: schemas.products.productName,
            "Qt per unit": schemas.products.quantityPerUnit,
            Price: schemas.products.unitPrice,
            Stock: schemas.products.unitsInStock,
            Order: schemas.products.unitsOnOrder
        }).from(schemas.products);
        const end = Date.now();

        const sqlQuery = `select product_id as productId, product_name as Name, quantity_per_unit as "Qt per unit", unit_price as Price, units_in_stock as Stock, units_on_order as Order from ${POSTGRES_DB}.products;`
        return { dt: new Date(), "PRODUCT_VERSION": `${PRODUCT_VERSION}`, queryTime: (end - start) / 1000, sqlQuery, result };
    }

    async getProductById(productId: number): Promise<{
        dt: Date, "PRODUCT_VERSION": string, queryTime: number, sqlQuery: string, result: {
            productId: number,
            "Supplier": string | null,
            "Product Name": string | null,
            supplierId: number | null,
            "Quantity Per Unit": string | null,
            "Unit Price": string | null,
            "Units In Stock": number | null,
            "Units In Order": number | null,
            "Reorder Level": number | null,
            Discontinued: number | null
        }
    }> {
        const start = Date.now();
        const result = await this.dbClient.select({
            productId: schemas.products.productId,
            "Supplier": schemas.suppliers.companyName,
            "Product Name": schemas.products.productName,
            supplierId: schemas.products.supplierId,
            "Quantity Per Unit": schemas.products.quantityPerUnit,
            "Unit Price": schemas.products.unitPrice,
            "Units In Stock": schemas.products.unitsInStock,
            "Units In Order": schemas.products.unitsOnOrder,
            "Reorder Level": schemas.products.reorderLevel,
            Discontinued: schemas.products.discontinued
        }).from(schemas.products).
            innerJoin(schemas.suppliers, eq(schemas.products.supplierId, schemas.suppliers.supplierId)).
            where(eq(schemas.products.productId, productId));
        const end = Date.now();

        const sqlQuery = `
        select product_id as productId, company_name as Supplier, product_name as "Product Name", 
        products.supplierId, quantity_per_unit as "Quantity Per Unit", unit_price as "Unit Price", 
        units_in_stock as "Stock", units_on_order as "Units In Order", reorder_level as "Reorder Level", discontinued as Discontinued from ${POSTGRES_DB}.products 
        inner join ${POSTGRES_DB}.suppliers s on s.supplier_id = products.supplier_id
        where product_id = ${productId};`
        return { dt: new Date(), "PRODUCT_VERSION": `${PRODUCT_VERSION}`, queryTime: (end - start) / 1000, sqlQuery, result: result[0] };
    }

    async getProductsByName(productName: string): Promise<{
        productId: number,
        productName: string,
        quantityPerUnit: string,
        unitPrice: number,
        unitsInStock: number
    }[]> {
        const queryResult = await this.dbClient.execute(sql.raw(`
        select product_id, product_name, quantity_per_unit, unit_price, units_in_stock
        from ${POSTGRES_DB}.products
        where lower(product_name) like '%${productName}%';`));
        console.log(queryResult);
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
        dt: Date, "PRODUCT_VERSION": string, queryTime: number, sqlQuery: string, result: {
            Id: number,
            "Total Price": number,
            Products: number,
            Quantity: number,
            Shipped: string,
            "Ship Name": string,
            City: string,
            Country: string
        }[]
    }> {
        const sqlQuery = `
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
        left join ${POSTGRES_DB}.orders on orders_numbers.order_id = orders.order_id;`;

        const start = Date.now();
        const queryResult = await this.dbClient.execute(sql.raw(sqlQuery));
        const end = Date.now();

        const result = queryResult.map((orderObj) => {
            return {
                Id: Number(orderObj.order_id),
                "Total Price": Number(orderObj.total_price),
                Products: Number(orderObj.products),
                Quantity: Number(orderObj.quantity),
                Shipped: String(orderObj.shipped_date),
                "Ship Name": String(orderObj.ship_name),
                City: String(orderObj.ship_city),
                Country: String(orderObj.ship_country)
            }
        })

        return { dt: new Date(), "PRODUCT_VERSION": `${PRODUCT_VERSION}`, queryTime: (end - start) / 1000, sqlQuery, result };
    }

    async getOrderById(orderId: number): Promise<{
        dt: Date, "PRODUCT_VERSION": string, queryTime: number, sqlQuery: string, result: {
            "Total Price": number,
            "Total Products": number,
            "Total Quantity": number,
            "Total Discount": number,
            "Customer Id": string,
            "Shipped Date": string,
            "Ship Via": string,
            "Freight": string,
            "Required Date": string,
            "Order Date": string,
            "Ship Name": string,
            "Ship City": string,
            "Ship Region": string,
            "Ship Postal Code": string,
            "Ship Country": string,
            ProductsInOrder: {
                productId: number,
                Product: string,
                Quantity: number,
                "Order Price": number,
                "Total Price": number,
                Discount: number
            }[]
        } | {}
    }> {
        const sqlQuery = `
        select orders.order_id,
        total_price,
        total_products,
        total_quantity,
        total_discount,
        orders.customer_id,
        s.company_name as ship_via_name,
        freight,
        order_date,
        shipped_date,
        required_date,
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
         left join ${POSTGRES_DB}.shippers s on s.shipper_id = orders.ship_via
        where orders.order_id = ${orderId};`

        const start = Date.now();
        const queryResult = await this.dbClient.execute(sql.raw(sqlQuery));
        const end = Date.now();

        if (queryResult.length == 0) return { dt: new Date(), "PRODUCT_VERSION": `${PRODUCT_VERSION}`, queryTime: (end - start) / 1000, sqlQuery, result: {} };

        const orderObj = queryResult[0];
        const orderResult = {
            "Customer Id": String(orderObj.customer_id),
            "Ship Name": String(orderObj.ship_name),
            "Total Products": Number(orderObj.total_products),
            "Total Quantity": Number(orderObj.total_quantity),
            "Total Price": Number(orderObj.total_price),
            "Total Discount": Number(orderObj.total_discount),
            "Ship Via": String(orderObj.ship_via_name),
            "Freight": String(orderObj.freight),
            "Order Date": String(orderObj.order_date),
            "Required Date": String(orderObj.required_date),
            "Shipped Date": String(orderObj.shipped_date),
            "Ship City": String(orderObj.ship_city),
            "Ship Region": String(orderObj.ship_region),
            "Ship Postal Code": String(orderObj.ship_postal_code),
            "Ship Country": String(orderObj.ship_country)
        };

        const productsInOrder = queryResult.map((orderObj) => {
            return {
                productId: Number(orderObj.product_id),
                Product: String(orderObj.product_name),
                Quantity: Number(orderObj.quantity),
                "Order Price": Number(orderObj.order_price),
                "Total Price": Number(orderObj.price),
                Discount: Number(orderObj.discount)
            };
        });

        const result = { ...orderResult, ProductsInOrder: productsInOrder };
        return { dt: new Date(), "PRODUCT_VERSION": `${PRODUCT_VERSION}`, queryTime: (end - start) / 1000, sqlQuery, result };
    }
}


export const northwindTradersModel = new NorthwindTradersModel();


