import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { northwindTradersModel } from './database';


const app = express();

app.use(express.json());
app.use(cors());
// app.use(session({
//     secret: "some secret",
//     resave: true,
//     saveUninitialized: true,
//     unset: 'destroy',
//     cookie: { path: "/", httpOnly: true, sameSite: 'lax' }
// }));


dotenv.config();


const PORT = Number(process.env.PORT) || 80;


app.get("/", async (req: express.Request, res: express.Response) => {
    res.status(200).send("healthy");
})


app.get("/suppliers", async (req: express.Request, res: express.Response) => {
    let dbResponse, suppliersObj;
    try {
        dbResponse = await northwindTradersModel.getAllSuppliers();
        suppliersObj = dbResponse.result;
    } catch (error) {
        res.status(500).send("something went wrong on the server side.");
        console.log(error);
        return;
    }

    res.status(200).json({
        response: suppliersObj,
        dt: dbResponse.dt,
        sqlQuery: dbResponse.sqlQuery,
        productVersion: dbResponse.PRODUCT_VERSION,
        queryTime: dbResponse.queryTime
    });


})


app.get("/supplier/:supplier_id", async (req: express.Request, res: express.Response) => {
    const supplierId = Number(req.params.supplier_id);
    if (Number.isNaN(supplierId)) {
        res.status(400).send("wrong format of supplierId");
        return;
    }

    let dbResponse, supplierObj;
    try {
        dbResponse = await northwindTradersModel.getSupplierById(supplierId);
        supplierObj = dbResponse.result;
    } catch (error) {
        res.status(500).send("something went wrong on the server side.");
        console.log(error);
        return;
    }


    let response;
    if (supplierObj["Home Page"]) {
        response = supplierObj;
    }
    else {
        const { "Home Page": unused, ...rest } = supplierObj;
        response = rest;
    }

    // res.status(200).send();
    res.status(200).json({
        response: response,
        dt: dbResponse.dt,
        sqlQuery: dbResponse.sqlQuery,
        productVersion: dbResponse.PRODUCT_VERSION,
        queryTime: dbResponse.queryTime
    });
})


app.get("/products", async (req: express.Request, res: express.Response) => {
    let productsObj, dbResponse;
    try {
        dbResponse = await northwindTradersModel.getAllProducts();
        productsObj = dbResponse.result;
    } catch (error) {
        res.status(500).send("something went wrong on the server side.");
        console.log(error);
        return;
    }

    res.status(200).json({
        response: productsObj,
        dt: dbResponse.dt,
        sqlQuery: dbResponse.sqlQuery,
        productVersion: dbResponse.PRODUCT_VERSION,
        queryTime: dbResponse.queryTime
    });


})


app.get("/product/:product_id", async (req: express.Request, res: express.Response) => {
    const productId = Number(req.params.product_id);
    if (Number.isNaN(productId)) {
        res.status(400).send("wrong format of productId");
        return;
    }

    let productObj, dbResponse;
    try {
        dbResponse = await northwindTradersModel.getProductById(productId);
        productObj = dbResponse.result;
    } catch (error) {
        res.status(500).send("something went wrong on the server side.");
        console.log(error);
        return;
    }

    res.status(200).json({
        response: productObj,
        dt: dbResponse.dt,
        sqlQuery: dbResponse.sqlQuery,
        productVersion: dbResponse.PRODUCT_VERSION,
        queryTime: dbResponse.queryTime
    });
})


app.get("/orders", async (req: express.Request, res: express.Response) => {
    let ordersObj, dbResponse;
    try {
        dbResponse = await northwindTradersModel.getAllOrders();
        ordersObj = dbResponse.result;
    } catch (error) {
        res.status(500).send("something went wrong on the server side.");
        console.log(error);
        return;
    }

    res.status(200).json({
        response: ordersObj,
        dt: dbResponse.dt,
        sqlQuery: dbResponse.sqlQuery,
        productVersion: dbResponse.PRODUCT_VERSION,
        queryTime: dbResponse.queryTime
    });
})


app.get("/order/:order_id", async (req: express.Request, res: express.Response) => {
    const orderId = Number(req.params.order_id);
    if (Number.isNaN(orderId)) {
        res.status(400).send("wrong format of orderId");
        return;
    }

    let orderObj, dbResponse;
    try {
        dbResponse = await northwindTradersModel.getOrderById(orderId);
        orderObj = dbResponse.result;
    } catch (error) {
        res.status(500).send("something went wrong on the server side.");
        console.log(error);
        return;
    }

    res.status(200).json({
        response: orderObj,
        dt: dbResponse.dt,
        sqlQuery: dbResponse.sqlQuery,
        productVersion: dbResponse.PRODUCT_VERSION,
        queryTime: dbResponse.queryTime
    });
})


app.get("/employees", async (req: express.Request, res: express.Response) => {
    let employeesObj, dbResponse;
    try {
        dbResponse = await northwindTradersModel.getAllEmployees();
        employeesObj = dbResponse.result;
    } catch (error) {
        res.status(500).send("something went wrong on the server side.");
        console.log(error);
        return;
    }

    res.status(200).json({
        response: employeesObj,
        dt: dbResponse.dt,
        sqlQuery: dbResponse.sqlQuery,
        productVersion: dbResponse.PRODUCT_VERSION,
        queryTime: dbResponse.queryTime
    });
})


app.get("/employee/:employee_id", async (req: express.Request, res: express.Response) => {
    const employeeId = Number(req.params.employee_id);
    if (Number.isNaN(employeeId)) {
        res.status(400).send("wrong format of employeeId");
        return;
    }

    let employeeObj, dbResponse;
    try {
        dbResponse = await northwindTradersModel.getEmployeeById(employeeId);
        employeeObj = dbResponse.result;
    } catch (error) {
        res.status(500).send("something went wrong on the server side.");
        console.log(error);
        return;
    }

    let response;
    if (employeeObj.reportsTo) {
        response = employeeObj;
    }
    else {
        const { "Reports To": unUsed1, "reportsTo": unUsed2, ...rest } = employeeObj;
        response = rest;
    }

    res.status(200).json({
        response: response,
        dt: dbResponse.dt,
        sqlQuery: dbResponse.sqlQuery,
        productVersion: dbResponse.PRODUCT_VERSION,
        queryTime: dbResponse.queryTime
    });
})


app.get("/customers", async (req: express.Request, res: express.Response) => {
    let customersObj, dbResponse;
    try {
        dbResponse = await northwindTradersModel.getAllCustomers();
        customersObj = dbResponse.result;
    } catch (error) {
        res.status(500).send("something went wrong on the server side.");
        console.log(error);
        return;
    }

    res.status(200).json({
        response: customersObj,
        dt: dbResponse.dt,
        sqlQuery: dbResponse.sqlQuery,
        productVersion: dbResponse.PRODUCT_VERSION,
        queryTime: dbResponse.queryTime
    });
})


app.get("/customer/:customer_id", async (req: express.Request, res: express.Response) => {
    const customerId = req.params.customer_id;
    if (customerId === undefined || customerId.length != 5) {
        res.status(400).send("wrong format of customerId");
        return;
    }

    let customerObj, dbResponse;
    try {
        dbResponse = await northwindTradersModel.getCustomerById(customerId);
        customerObj = dbResponse.result;
    } catch (error) {
        res.status(500).send("something went wrong on the server side.");
        console.log(error);
        return;
    }

    res.status(200).json({
        response: customerObj,
        dt: dbResponse.dt,
        sqlQuery: dbResponse.sqlQuery,
        productVersion: dbResponse.PRODUCT_VERSION,
        queryTime: dbResponse.queryTime
    });
})


app.get("/search", async (req: express.Request, res: express.Response) => {
    const tableName = String(req.query.tblName);
    const searchText = String(req.query.SearchText).toLowerCase();

    let result, dbResponse;
    if (tableName == "Customers" && searchText != "undefined") {
        dbResponse = await northwindTradersModel.getCustomersByCompanyName(searchText);
        result = dbResponse.result;
    }
    else if (tableName == "Products" && searchText != "undefined") {
        dbResponse = await northwindTradersModel.getProductsByName(searchText);
        result = dbResponse.result;
    }
    else {
        res.status(200).json({});
        return;
    }

    res.status(200).json({
        response: result,
        dt: dbResponse.dt,
        sqlQuery: dbResponse.sqlQuery,
        productVersion: dbResponse.PRODUCT_VERSION,
        queryTime: dbResponse.queryTime
    });
})



app.listen(PORT, "0.0.0.0", async () => {
    await northwindTradersModel.migrateDatabase();
    await northwindTradersModel.fillDatabase();

    console.log(`app is listening on ${PORT} port.`)
})

