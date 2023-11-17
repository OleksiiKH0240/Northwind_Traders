import { db, POSTGRES_DB, PRODUCT_VERSION } from "database/databaseConnection";
import suppliers from 'database/schemas/suppliers';
import { ModelTemplateReturnType, SupplierReturnType, SuppliersReturnType } from "database/RepReturnTypes";
import { eq } from "drizzle-orm";


class SupllierRep {
    dbClient

    constructor(dbClient = db) {
        this.dbClient = dbClient;
    }

    allSuppliers = async (): Promise<ModelTemplateReturnType<SuppliersReturnType>> => {
        const start = Date.now();
        const result = await this.dbClient.select({
            supplierId: suppliers.supplierId,
            Company: suppliers.companyName,
            Contact: suppliers.contactName,
            Title: suppliers.contactTitle,
            City: suppliers.city,
            Country: suppliers.country
        }).from(suppliers);
        const end = Date.now();

        const sqlQuery = `
        select supplier_id   as supplierId,
        company_name  as Company,
        contact_name  as Contact,
        contact_title as Title,
        city          as City,
        country       as Country
        from ${POSTGRES_DB}.suppliers;`

        return { dt: new Date(), "PRODUCT_VERSION": `${PRODUCT_VERSION}`, queryTime: (end - start) / 1000, sqlQuery, result };
    }

    supplierById = async (supplierId: number): Promise<ModelTemplateReturnType<SupplierReturnType>> => {
        const start = Date.now();
        const result = await this.dbClient.select({
            supplierId: suppliers.supplierId,
            "Company Name": suppliers.companyName,
            "Contact Name": suppliers.contactName,
            "Contact Title": suppliers.contactTitle,
            Address: suppliers.address,
            City: suppliers.city,
            Region: suppliers.region,
            "Postal Code": suppliers.postalCode,
            Country: suppliers.country,
            Phone: suppliers.phone,
            "Home Page": suppliers.homePage
        }).from(suppliers).where(eq(suppliers.supplierId, supplierId));
        const end = Date.now();

        const sqlQuery = `
        select supplier_id   as supplierId,
        company_name  as "Company Name",
        contact_name  as "Contact Name",
        contact_title as "Contact Title",
        city          as City,
        country       as Country,
        address       as Address,
        region        as Region,
        postal_code   as "Postal Code",
        home_page     as "Home Page",
        phone         as Phone
        from ${POSTGRES_DB}.suppliers
        where supplier_id = ${supplierId};`;

        return { dt: new Date(), "PRODUCT_VERSION": `${PRODUCT_VERSION}`, queryTime: (end - start) / 1000, sqlQuery, result: result[0] };
    }

}

export default new SupllierRep();
