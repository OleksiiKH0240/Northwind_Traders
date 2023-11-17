import { db, POSTGRES_DB, PRODUCT_VERSION } from "database/databaseConnection";
import orders from 'database/schemas/orders';
import { ModelTemplateReturnType, OrderReturnType, OrdersReturnType } from "database/RepReturnTypes";
import { sql } from "drizzle-orm";


class OrderRep {
    dbClient

    constructor(dbClient = db) {
        this.dbClient = dbClient
    }

    allOrders = async (): Promise<ModelTemplateReturnType<OrdersReturnType>> => {
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
             count(order_details.order_id)                          AS products,
             sum(order_details.quantity)                            AS quantity

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

    orderById = async (orderId: number): Promise<ModelTemplateReturnType<OrderReturnType>> => {
        const sqlQuery = `select orders.order_id,
        total_price,
        total_products,
        total_quantity,
        total_discount,
        orders.customer_id,
        s.company_name                                                         as ship_via_name,
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
        od.unit_price                                                          as order_price,
        od.unit_price * od.quantity                                            as price,
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
        where orders.order_id = ${orderId};`;

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

export default new OrderRep();
