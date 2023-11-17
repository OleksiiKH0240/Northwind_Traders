import { db, POSTGRES_DB, PRODUCT_VERSION } from "database/databaseConnection";
import customers from 'database/schemas/customers';
import { ModelTemplateReturnType, CustomerReturnType, CustomersReturnType, CustomersSearchReturnType } from "database/RepReturnTypes";
import { eq, sql } from "drizzle-orm";


class CustomerRep {
    dbClient

    constructor(dbClient = db) {
        this.dbClient = db;
    }

    allCustomers = async (): Promise<ModelTemplateReturnType<CustomersReturnType>> => {
        const start = Date.now();
        const result = await this.dbClient.select({
            customerId: customers.customerId,
            Company: customers.companyName,
            Contact: customers.contactName,
            Title: customers.contactTitle,
            City: customers.city,
            Country: customers.country
        }).from(customers);
        const end = Date.now();

        const sqlQuery = `
        select customer_id   as "customerId",
        company_name  as "Company",
        contact_name  as "Contact",
        contact_title as "Title",
        city          as "City",
        country       as "Country"
        from ${POSTGRES_DB}.customers;`;

        return { dt: new Date(), "PRODUCT_VERSION": `${PRODUCT_VERSION}`, queryTime: (end - start) / 1000, sqlQuery, result };
    }

    customerById = async (customerId: string): Promise<ModelTemplateReturnType<CustomerReturnType>> => {
        const start = Date.now();
        const result = await this.dbClient.select({
            customerId: customers.customerId,
            "Company Name": customers.companyName,
            "Contact Name": customers.contactName,
            "Contact Title": customers.contactTitle,
            Address: customers.address,
            City: customers.city,
            "Postal Code": customers.postalCode,
            Region: customers.region,
            Country: customers.country,
            Phone: customers.phone,
            Fax: customers.fax
        }).from(customers).where(eq(customers.customerId, customerId));
        const end = Date.now();

        const sqlQuery = `
        select customer_id   as "customerId",
        company_name  as "Company Name",
        contact_name  as "Contact Name",
        contact_title as "Contact Title",
        address as "Address",
        city          as "City",
        postal_code as "Postal Code",
        region as "Region",
        country as "Country",
        phone as "Phone",
        fax as "Fax"
        from ${POSTGRES_DB}.customers
        where customer_id='${customerId}';`;

        return { dt: new Date(), "PRODUCT_VERSION": `${PRODUCT_VERSION}`, queryTime: (end - start) / 1000, sqlQuery, result: result[0] };
    }

    customersByCompanyName = async (companyName: string): Promise<ModelTemplateReturnType<CustomersSearchReturnType>> => {
        const sqlQuery = `
        select customer_id, company_name, contact_name, contact_title, phone
        from ${POSTGRES_DB}.customers
        where lower(company_name) like '%${companyName}%';`;

        const start = Date.now();
        const queryResult = await this.dbClient.execute(sql.raw(sqlQuery));
        const end = Date.now();

        const result = queryResult.map((customerObj) => {
            return {
                customerId: String(customerObj.customer_id),
                companyName: String(customerObj.company_name),
                contactName: String(customerObj.contact_name),
                contactTitle: String(customerObj.contact_title),
                phone: String(customerObj.phone)
            };
        })

        return { dt: new Date(), "PRODUCT_VERSION": `${PRODUCT_VERSION}`, queryTime: (end - start) / 1000, sqlQuery, result: result };
    }
}

export default new CustomerRep();
