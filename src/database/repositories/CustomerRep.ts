import { db, PRODUCT_VERSION } from "database/databaseConnection";
import customers from 'database/schemas/customers';
import { ModelTemplateReturnType, CustomerReturnType, CustomersReturnType, CustomersSearchReturnType } from "database/RepReturnTypes";
import { eq, sql } from "drizzle-orm";


class CustomerRep {
    dbClient

    constructor(dbClient = db) {
        this.dbClient = dbClient;
    }

    allCustomers = async (): Promise<ModelTemplateReturnType<CustomersReturnType>> => {
        const start = Date.now();
        const resultQuery = this.dbClient.select({
            customerId: customers.customerId,
            Company: customers.companyName,
            Contact: customers.contactName,
            Title: customers.contactTitle,
            City: customers.city,
            Country: customers.country
        }).from(customers);
        const result = await resultQuery;
        const end = Date.now();

        const sqlQuery = resultQuery.toSQL()["sql"];

        return { dt: new Date(), "PRODUCT_VERSION": `${PRODUCT_VERSION}`, queryTime: (end - start) / 1000, sqlQuery, result };
    }

    customerById = async (customerId: string): Promise<ModelTemplateReturnType<CustomerReturnType>> => {
        const resultQuery = this.dbClient.select({
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

        const start = Date.now();
        const result = await resultQuery;
        const end = Date.now();

        let { sql, params } = resultQuery.toSQL();
        params.forEach((param: any) => { sql = sql.replace(/\$[1-9]+/, `'${param}'`) });
        const sqlQuery = sql;

        return { dt: new Date(), "PRODUCT_VERSION": `${PRODUCT_VERSION}`, queryTime: (end - start) / 1000, sqlQuery, result: result[0] };
    }

    customersByCompanyName = async (companyName: string): Promise<ModelTemplateReturnType<CustomersSearchReturnType>> => {
        const resultQuery = this.dbClient.select({
            customerId: customers.customerId,
            companyName: customers.companyName,
            contactName: customers.contactName,
            contactTitle: customers.contactTitle,
            phone: customers.phone
        }).from(customers).
            where(sql.raw(`lower(company_name) like '%${companyName}%'`));

        const start = Date.now();
        const result = await resultQuery;
        const end = Date.now();

        const sqlQuery = resultQuery.toSQL()["sql"];

        return { dt: new Date(), "PRODUCT_VERSION": `${PRODUCT_VERSION}`, queryTime: (end - start) / 1000, sqlQuery, result: result };
    }
}

export default new CustomerRep();
