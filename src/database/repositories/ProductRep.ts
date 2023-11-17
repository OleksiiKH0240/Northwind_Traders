import { db, POSTGRES_DB, PRODUCT_VERSION } from "database/databaseConnection";
import products from 'database/schemas/products';
import suppliers from "database/schemas/suppliers";
import { ModelTemplateReturnType, ProductReturnType, ProductsReturnType, ProductsSearchReturnType } from "database/RepReturnTypes";
import { eq, sql, aliasedTable } from "drizzle-orm";


class ProductRep{
    dbClient

    constructor(dbClient = db) {
        this.dbClient = dbClient;
    }

    allProducts = async (): Promise<ModelTemplateReturnType<ProductsReturnType>> => {
        const start = Date.now();
        const result = await this.dbClient.select({
            productId: products.productId,
            Name: products.productName,
            "Qt per unit": products.quantityPerUnit,
            Price: products.unitPrice,
            Stock: products.unitsInStock,
            Order: products.unitsOnOrder
        }).from(products);
        const end = Date.now();

        const sqlQuery = `
        select product_id        as productId,
        product_name      as Name,
        quantity_per_unit as "Qt per unit",
        unit_price        as Price,
        units_in_stock    as Stock,
        units_on_order    as Order
        from ${POSTGRES_DB}.products;`;

        return { dt: new Date(), "PRODUCT_VERSION": `${PRODUCT_VERSION}`, queryTime: (end - start) / 1000, sqlQuery, result };
    }

    productById = async (productId: number): Promise<ModelTemplateReturnType<ProductReturnType>> => {
        const start = Date.now();
        const result = await this.dbClient.select({
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
        const end = Date.now();

        const sqlQuery = `
        select product_id        as productId,
        company_name      as Supplier,
        product_name      as "Product Name",
        products.supplierId,
        quantity_per_unit as "Quantity Per Unit",
        unit_price        as "Unit Price",
        units_in_stock    as "Stock",
        units_on_order    as "Units In Order",
        reorder_level     as "Reorder Level",
        discontinued      as Discontinued
        from ${POSTGRES_DB}.products
          inner join ${POSTGRES_DB}.suppliers s on s.supplier_id = products.supplier_id
        where product_id = ${productId};`;

        return { dt: new Date(), "PRODUCT_VERSION": `${PRODUCT_VERSION}`, queryTime: (end - start) / 1000, sqlQuery, result: result[0] };
    }

    productsByName = async (productName: string): Promise<ModelTemplateReturnType<ProductsSearchReturnType>> => {
        const sqlQuery = `
        select product_id, product_name, quantity_per_unit, unit_price, units_in_stock
        from ${POSTGRES_DB}.products
        where lower(product_name) like '%${productName}%';`;

        const start = Date.now();
        const queryResult = await this.dbClient.execute(sql.raw(sqlQuery));
        const end = Date.now();

        const result = queryResult.map((productObj) => {
            return {
                productId: Number(productObj.product_id),
                productName: String(productObj.product_name),
                quantityPerUnit: String(productObj.quantity_per_unit),
                unitPrice: Number(productObj.unit_price),
                unitsInStock: Number(productObj.units_in_stock)
            };
        })

        return { dt: new Date(), "PRODUCT_VERSION": `${PRODUCT_VERSION}`, queryTime: (end - start) / 1000, sqlQuery, result: result };
    }
}

export default new ProductRep();
