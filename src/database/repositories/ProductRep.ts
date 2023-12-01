import { db, PRODUCT_VERSION } from "database/databaseConnection";
import products from 'database/schemas/products';
import suppliers from "database/schemas/suppliers";
import { ModelTemplateReturnType, ProductReturnType, ProductsReturnType, ProductsSearchReturnType } from "types/RepReturnTypes";
import { eq, sql } from "drizzle-orm";


class ProductRep {
    dbClient

    constructor(dbClient = db) {
        this.dbClient = dbClient;
    }

    allProducts = async (): Promise<ModelTemplateReturnType<ProductsReturnType>> => {
        const resultQuery = this.dbClient.select({
            productId: products.productId,
            Name: products.productName,
            "Qt per unit": products.quantityPerUnit,
            Price: products.unitPrice,
            Stock: products.unitsInStock,
            Order: products.unitsOnOrder
        }).from(products);

        const start = Date.now();
        const result = await resultQuery;
        const end = Date.now();

        const sqlQuery = resultQuery.toSQL()["sql"];

        return { dt: new Date(), "PRODUCT_VERSION": `${PRODUCT_VERSION}`, queryTime: (end - start) / 1000, sqlQuery, result };
    }

    productById = async (productId: number): Promise<ModelTemplateReturnType<ProductReturnType>> => {
        const resultQuery = this.dbClient.select({
            productId: products.productId,
            "Supplier": suppliers.companyName,
            "Product Name": products.productName,
            supplierId: products.supplierId,
            "Quantity Per Unit": products.quantityPerUnit,
            "Unit Price": products.unitPrice,
            "Units In Stock": products.unitsInStock,
            "Units In Order": products.unitsOnOrder,
            "Reorder Level": products.reorderLevel,
            Discontinued: products.discontinued
        }).from(products).
            innerJoin(suppliers, eq(products.supplierId, suppliers.supplierId)).
            where(eq(products.productId, productId));

        const start = Date.now();
        const result = await resultQuery;
        const end = Date.now();

        let { "sql": sqlObj, params } = resultQuery.toSQL();
        params.forEach((param: any) => { sqlObj = sqlObj.replace(/\$[1-9]+/, `${param}`) });
        const sqlQuery = sqlObj;

        return { dt: new Date(), "PRODUCT_VERSION": `${PRODUCT_VERSION}`, queryTime: (end - start) / 1000, sqlQuery, result: result[0] };
    }

    productsByName = async (productName: string): Promise<ModelTemplateReturnType<ProductsSearchReturnType>> => {
        const resultQuery = this.dbClient.select({
            productId: products.productId,
            productName: products.productName,
            quantityPerUnit: products.quantityPerUnit,
            unitPrice: products.unitPrice,
            unitsInStock: products.unitsInStock
        }).from(products).
            where(sql.raw(`lower(product_name) like '%${productName}%'`));

        const start = Date.now();
        const result = await resultQuery;
        const end = Date.now();

        const sqlQuery = resultQuery.toSQL()["sql"];

        return { dt: new Date(), "PRODUCT_VERSION": `${PRODUCT_VERSION}`, queryTime: (end - start) / 1000, sqlQuery, result: result };
    }
}

export default new ProductRep();
