import { db, PRODUCT_VERSION } from "database/databaseConnection";
import orders from 'database/schemas/orders';
import { ModelTemplateReturnType, OrderReturnType, OrdersReturnType } from "database/RepReturnTypes";
import { sql, eq } from "drizzle-orm";
import orderDetails from "database/schemas/orderDetails";
import products from "database/schemas/products";
import customers from "database/schemas/customers";
import shippers from "database/schemas/shippers";


class OrderRep {
    dbClient

    constructor(dbClient = db) {
        this.dbClient = dbClient
    }

    allOrders = async (): Promise<ModelTemplateReturnType<OrdersReturnType>> => {
        const resultQuery = this.dbClient.select({
            Id: orders.orderId,
            "Total Price": sql<number>`cast(sum(${orderDetails.quantity} * ${orderDetails.unitPrice}) as double precision)`,
            Products: sql<number>`cast(count(${orderDetails.orderId}) as int)`,
            Quantity: sql<number>`cast(sum(${orderDetails.quantity}) as int)`,
            Shipped: orders.shippedDate,
            "Ship Name": orders.shipName,
            City: orders.shipCity,
            Country: orders.shipCountry
        })
            .from(orderDetails)
            .leftJoin(orders, eq(orders.orderId, orderDetails.orderId))
            .groupBy(orders.orderId)
            .orderBy(orders.orderId);

        const start = Date.now();
        const result = await resultQuery;
        const end = Date.now();

        const sqlQuery = resultQuery.toSQL()["sql"];

        return { dt: new Date(), "PRODUCT_VERSION": `${PRODUCT_VERSION}`, queryTime: (end - start) / 1000, sqlQuery, result };
    }

    orderById = async (orderId: number): Promise<ModelTemplateReturnType<OrderReturnType>> => {
        const order_metrics = this.dbClient.select({
            orderId: orderDetails.orderId,
            "Total Price": sql<number>`cast(sum(${orderDetails.quantity} * ${orderDetails.unitPrice}) as double precision)`.as("Total Price"),
            "Total Products": sql<number>`cast(count(${orderDetails.orderId}) as int)`.as("Total Products"),
            "Total Quantity": sql<number>`cast(sum(${orderDetails.quantity}) as int)`.as ("Total Quantity"),
            "Total Discount": sql<number>`cast(sum(${orderDetails.unitPrice} * ${orderDetails.quantity} * ${orderDetails.discount}) as double precision)`.as("Total Discount"),
        })
            .from(orderDetails)
            .groupBy(orderDetails.orderId).as("order_metrics");

        const resultQuery = this.dbClient.select({
            "Customer Id": orders.customerId,
            "Ship Name": orders.shipName,
            "Total Products": order_metrics["Total Products"],
            "Total Quantity": order_metrics["Total Quantity"],
            "Total Price": order_metrics["Total Price"],
            "Total Discount": order_metrics["Total Discount"],
            "Ship Via": shippers.companyName,
            "Freight": orders.freight,
            "Order Date": orders.orderDate,
            "Required Date": orders.requiredDate,
            "Shipped Date": orders.shippedDate,
            "Ship City": orders.shipCity,
            "Ship Region": sql<string>`(case when (${orders.shipRegion} is not null) then ${orders.shipRegion} else ${customers.region} end)`,
            "Ship Postal Code": orders.shipPostalCode,
            "Ship Country": orders.shipCountry,
            productId: products.productId,
            Product: products.productName,
            Quantity: orderDetails.quantity,
            "Order Price": sql<number>`cast(${orderDetails.unitPrice} as double precision)`,
            "Price": sql<number>`cast(${orderDetails.unitPrice} * ${orderDetails.quantity} as double precision)`,
            Discount: sql<number>`cast(${orderDetails.discount} as double precision)`
        })
            .from(order_metrics)
            .innerJoin(orders, eq(orders.orderId, order_metrics.orderId))
            .innerJoin(orderDetails, eq(orderDetails.orderId, order_metrics.orderId))
            .innerJoin(products, eq(products.productId, orderDetails.productId))
            .innerJoin(customers, eq(customers.customerId, orders.customerId))
            .innerJoin(shippers, eq(shippers.shipperId, orders.shipVia))
            .where(eq(orders.orderId, orderId));

        const start = Date.now();
        const rawResult = await resultQuery;
        const end = Date.now();

        let { "sql": sqlObj, params } = resultQuery.toSQL();
        params.forEach((param: any) => { sqlObj = sqlObj.replace(/\$[1-9]+/, `${param}`) });
        const sqlQuery = sqlObj;

        console.log(sqlQuery);

        if (rawResult.length == 0) return { dt: new Date(), "PRODUCT_VERSION": `${PRODUCT_VERSION}`, queryTime: (end - start) / 1000, sqlQuery, result: {} };

        const orderObj = rawResult[0];
        const orderResult = {
            "Customer Id": orderObj["Customer Id"],
            "Ship Name": orderObj["Ship Name"],
            "Total Products": orderObj["Total Products"],
            "Total Quantity": orderObj["Total Quantity"],
            "Total Price": orderObj["Total Price"],
            "Total Discount": orderObj["Total Discount"],
            "Ship Via": orderObj["Ship Via"],
            "Freight": orderObj.Freight,
            "Order Date": orderObj["Order Date"],
            "Required Date": orderObj["Required Date"],
            "Shipped Date": orderObj["Shipped Date"],
            "Ship City": orderObj["Ship City"],
            "Ship Region": String(orderObj["Ship Region"]),
            "Ship Postal Code": orderObj["Ship Postal Code"],
            "Ship Country": orderObj["Ship Country"]
        };

        const productsInOrder = rawResult.map((orderObj) => {
            return {
                productId: orderObj.productId,
                Product: orderObj.Product,
                Quantity: orderObj.Quantity,
                "Order Price": orderObj["Order Price"],
                "Total Price": orderObj.Price,
                Discount: orderObj.Discount
            };
        });

        const result = { ...orderResult, ProductsInOrder: productsInOrder };
        return { dt: new Date(), "PRODUCT_VERSION": `${PRODUCT_VERSION}`, queryTime: (end - start) / 1000, sqlQuery, result };
    }
}

export default new OrderRep();
