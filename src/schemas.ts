import { serial, text, varchar, integer, numeric, date, timestamp, time, pgSchema } from 'drizzle-orm/pg-core';
import dotenv from 'dotenv';



dotenv.config();

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

export const employees = mySchema.table('employees', {
    employeeId: serial('employee_id').primaryKey(),
    lastName: text('last_name'),
    firstName: text('first_name'),
    title: text('title'),
    titleOfCourtesy: text('title_of_courtesy'),
    birthDate: date('birth_date'),
    hireDate: date('hire_date'),
    address: text('address'),
    city: text('city'),
    region: text('region'),
    postalCode: text('postal_code'),
    country: text('country'),
    homePhone: text('home_phone'),
    extension: integer('extension'),
    notes: text('notes'),
    reportsTo: integer('reports_to')
});

export const regions = mySchema.table('regions', {
    regionId: serial('region_id').primaryKey(),
    regionDescription: text('region_description'),
});

export const territories = mySchema.table('territories', {
    territoryId: serial('territory_id').primaryKey(),
    territoryDescription: text('territory_description'),
    regionId: integer('region_id').references(() => regions.regionId),
});

export const employeeTerritories = mySchema.table('employee_territories', {
    employeeId: serial('employee_id').references(() => employees.employeeId),
    territoryId: integer('territory_id').references(() => territories.territoryId),
});

export const suppliers = mySchema.table('suppliers', {
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

export const categories = mySchema.table('categories', {
    categoryId: serial('category_id').primaryKey(),
    categoryName: text('category_name'),
    description: text('description'),
});

export const products = mySchema.table('products', {
    productId: serial('product_id').primaryKey(),
    productName: text('product_name'),
    supplierId: integer('supplier_id').references(() => suppliers.supplierId),
    cattegoryId: integer('cattegory_id').references(() => categories.categoryId),
    quantityPerUnit: text('quantity_per_unit'),
    unitPrice: numeric('unit_price'),
    unitsInStock: integer('units_in_stock'),
    unitsOnOrder: integer('units_on_order'),
    reorderLevel: integer('reorder_level'),
    discontinued: integer('discontinued'),
});

export const shippers = mySchema.table('shippers', {
    shipperId: serial('shipper_id').primaryKey(),
    companyName: text('company_name'),
    phone: text('phone')
});

export const customers = mySchema.table('customers', {
    customerId: varchar('customer_id', { length: 5 }).primaryKey(),
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
});

export const orders = mySchema.table('orders', {
    orderId: serial('order_id').primaryKey(),
    customerId: varchar('customer_id', { length: 5 }).references(() => customers.customerId),
    employeeId: integer('employee_id').references(() => employees.employeeId),
    orderDate: date('order_date'),
    requiredDate: date('required_date'),
    shippedDate: date('shipped_date'),
    shipVia: integer('ship_via'),
    freight: numeric('freight'),
    shipName: text('ship_name'),
    shipAddress: text('ship_address'),
    shipCity: text('ship_city'),
    shipRegion: text('ship_region'),
    shipPostalCode: text('ship_postal_code'),
    shipCountry: text('ship_country'),
});

export const orderDetails = mySchema.table('order_details', {
    orderId: integer('order_id').references(() => orders.orderId),
    productId: integer('product_id').references(() => products.productId),
    unitPrice: numeric('unit_price'),
    quantity: integer('quantity'),
    discount: numeric('discount')
});

