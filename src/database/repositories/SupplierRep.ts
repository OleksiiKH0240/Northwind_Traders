import { db, PRODUCT_VERSION } from "database/databaseConnection";
import suppliers from 'database/schemas/suppliers';
import { ModelTemplateReturnType, SupplierReturnType, SuppliersReturnType } from "database/RepReturnTypes";
import { eq } from "drizzle-orm";


class SupllierRep {
    dbClient

    constructor(dbClient = db) {
        this.dbClient = dbClient;
    }

    allSuppliers = async (): Promise<ModelTemplateReturnType<SuppliersReturnType>> => {
        const resultQuery = this.dbClient.select({
            supplierId: suppliers.supplierId,
            Company: suppliers.companyName,
            Contact: suppliers.contactName,
            Title: suppliers.contactTitle,
            City: suppliers.city,
            Country: suppliers.country
        }).from(suppliers);

        const start = Date.now();
        const result = await resultQuery;
        const end = Date.now();

        const sqlQuery = resultQuery.toSQL()["sql"];

        return { dt: new Date(), "PRODUCT_VERSION": `${PRODUCT_VERSION}`, queryTime: (end - start) / 1000, sqlQuery, result };
    }

    supplierById = async (supplierId: number): Promise<ModelTemplateReturnType<SupplierReturnType>> => {
        const resultQuery = this.dbClient.select({
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

        const start = Date.now();
        const result = await resultQuery;
        const end = Date.now();

        let { "sql": sqlObj, params } = resultQuery.toSQL();
        params.forEach((param: any) => { sqlObj = sqlObj.replace(/\$[1-9]+/, `${param}`) });
        const sqlQuery = sqlObj;

        return { dt: new Date(), "PRODUCT_VERSION": `${PRODUCT_VERSION}`, queryTime: (end - start) / 1000, sqlQuery, result: result[0] };
    }

}

export default new SupllierRep();
