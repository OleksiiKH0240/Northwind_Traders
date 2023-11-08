import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { northwindTradersModel } from './database';
import * as schemas from 'schemas';
import geoip from 'geoip-country';
import dns from 'dns';


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

const POSTRGRES_REGION = "Europe (Frankfurt)";


const PORT = Number(process.env.PORT) || 80;

type DatabaseModelType =
    | typeof schemas.categories.$inferSelect
    | typeof schemas.customers.$inferSelect
    | typeof schemas.employees.$inferSelect | typeof schemas.employees.$inferSelect & { Name: string }
    | typeof schemas.orderDetails.$inferSelect
    | typeof schemas.orders.$inferSelect
    | typeof schemas.products.$inferSelect
    | typeof schemas.regions.$inferSelect
    | typeof schemas.shippers.$inferSelect
    | typeof schemas.suppliers.$inferSelect
    | typeof schemas.territories.$inferSelect;

function filterObject(obj: DatabaseModelType, fieldsToInclude: string[], fieldsToChange: { [index: string]: string } = {}): { [index: string]: number | string | null } {
    const filteredEntries = Object.entries(obj).filter(([key, value]) => fieldsToInclude.includes(key));
    const changedEntries = filteredEntries.map(([key, value]) => (key in fieldsToChange) ? [fieldsToChange[key], value] : [key, value])
    const filteredObj = Object.fromEntries(changedEntries);
    return filteredObj;
}


app.get("/", async (req: express.Request, res: express.Response) => {
    res.status(200).send("healthy");
})

app.get("/dash", (req: express.Request, res: express.Response) => {
    const WorkerObj = {
        Colo: "KBP",
        Country: "UA"
    };

    const SQL_MetricsObj = {
        Query_count: 1,
        Results_count: 1,
        "SELECT": 0,
        "SELECT_WHERE": 0,
        "SELECT_LEFT_JOIN": 0
    };

    const Activity_LogObj = [
        {
            timestamp: "2023-10-30T13:18:55.885Z",
            version: "v0-dev",
            time_required: 0.2589,
            query: "SELECT COUNT(1) as total FROM Employee"
        }
    ];

    const response = {
        Worker: WorkerObj,
        SQL_Metrics: SQL_MetricsObj,
        Activity_Log: Activity_LogObj
    }

    res.status(200).json(response);
})

const MAX_ITEMS_PER_PAGE = 20;

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

    res.status(200).json({
        response: res,
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

    try {
        const orderObj = await northwindTradersModel.getOrderById(orderId);
        res.status(200).json(orderObj);
    } catch (error) {
        res.status(500).send("something went wrong on the server side.");
        console.log(error);
        return;
    }


})

app.get("/employees", async (req: express.Request, res: express.Response) => {
    let employeesObj: typeof schemas.employees.$inferSelect[];
    try {
        employeesObj = await northwindTradersModel.getAllEmployees();
    } catch (error) {
        res.status(500).send("something went wrong on the server side.");
        console.log(error);
        return;
    }

    const maxPageNumber = Math.ceil(employeesObj.length / MAX_ITEMS_PER_PAGE);
    const pageNumber: number = Number(req.query.page || 1);
    // if (pageNumber > maxPageNumber || pageNumber < 0) {
    //     res.status(200).send("No results");
    //     return;
    // }

    const minIdx = (pageNumber - 1) * MAX_ITEMS_PER_PAGE;
    const maxIdx = pageNumber * MAX_ITEMS_PER_PAGE - 1;
    // employeesObj = employeesObj.slice(minIdx, maxIdx + 1);

    const response = employeesObj.map((employeeObj) => {
        return {
            employeeId: employeeObj.employeeId, Name: employeeObj.firstName + " " + employeeObj.lastName,
            Title: employeeObj.title, City: employeeObj.city, Country: employeeObj.country, Phone: employeeObj.homePhone
        }
    });
    res.status(200).json(response);
})

app.get("/employee/:employee_id", async (req: express.Request, res: express.Response) => {
    const employeeId = Number(req.params.employee_id);
    if (Number.isNaN(employeeId)) {
        res.status(400).send("wrong format of employeeId");
        return;
    }

    let employeeObj: typeof schemas.employees.$inferSelect;
    try {
        employeeObj = await northwindTradersModel.getEmployeeById(employeeId);
    } catch (error) {
        res.status(500).send("something went wrong on the server side.");
        return;
    }

    let reportsToEmployeeName: string | null;
    if (employeeObj.reportsTo === null) reportsToEmployeeName = null;
    else {
        const reportsToEmployee = await northwindTradersModel.getEmployeeById(employeeObj.reportsTo);
        reportsToEmployeeName = reportsToEmployee.firstName + " " + reportsToEmployee.lastName;
    }

    const partResponse = {
        employeeId: employeeObj.employeeId,
        Name: employeeObj.firstName + " " + employeeObj.lastName,
        Title: employeeObj.title,
        "Title Of Courtesy": employeeObj.titleOfCourtesy,
        "Birth Date": employeeObj.birthDate,
        "Hire Date": employeeObj.hireDate,
        Address: employeeObj.address,
        City: employeeObj.city,
        "Postal Code": employeeObj.postalCode,
        "Country": employeeObj.country,
        "Home Phone": employeeObj.homePhone,
        Extension: employeeObj.extension,
        Notes: employeeObj.notes
    };

    let response;
    if (employeeObj.reportsTo) {
        response = {
            ...partResponse,
            "Reports To": reportsToEmployeeName,
            reportsId: employeeObj.reportsTo
        }
    }
    else {
        response = partResponse;
    }

    // console.log(response);
    res.status(200).json(response);
})

app.get("/customers", async (req: express.Request, res: express.Response) => {
    let customersObj: typeof schemas.customers.$inferSelect[];
    try {
        customersObj = await northwindTradersModel.getAllCustomers();
    } catch (error) {
        res.status(500).send("something went wrong on the server side.");
        console.log(error);
        return;
    }

    const maxPageNumber = Math.ceil(customersObj.length / MAX_ITEMS_PER_PAGE);
    const pageNumber: number = Number(req.query.page || 1);
    // if (pageNumber > maxPageNumber || pageNumber < 0) {
    //     res.status(200).send("No results");
    //     return;
    // }

    const response = customersObj.map((customerObj) => filterObject(customerObj,
        ["customerId", "companyName", "contactName", "contactTitle", "city", "country"],
        { "companyName": "Company", "contactName": "Contact", "contactTitle": "Title", "city": "City", "country": "Country" }))
    res.status(200).json(response);
})

app.get("/customer/:customer_id", async (req: express.Request, res: express.Response) => {
    const customerId = req.params.customer_id;
    if (customerId === undefined || customerId.length != 5) {
        res.status(400).send("wrong format of customerId");
        return;
    }

    let customerObj: typeof schemas.customers.$inferSelect;
    try {
        customerObj = await northwindTradersModel.getCustomerById(customerId);
    } catch (error) {
        res.status(500).send("something went wrong on the server side.");
        return;
    }
    const response = {
        customerId: customerObj.customerId,
        "Company Name": customerObj.companyName,
        "Contact Name": customerObj.contactName,
        "Contact Title": customerObj.contactTitle,
        Address: customerObj.address,
        City: customerObj.city,
        "Postal Code": customerObj.postalCode,
        Region: customerObj.region,
        Country: customerObj.country,
        Phone: customerObj.phone,
        Fax: customerObj.fax
    }

    res.status(200).json(response);
})

app.get("/search", async (req: express.Request, res: express.Response) => {
    const tableName = String(req.query.tblName);
    const searchText = String(req.query.SearchText).toLowerCase();

    let result;
    if (tableName == "Customers" && searchText != "undefined") {
        result = await northwindTradersModel.getCustomersByCompanyName(searchText);
    }
    else if (tableName == "Products" && searchText != "undefined") {
        result = await northwindTradersModel.getProductsByName(searchText);
    }
    else {
        res.sendStatus(200);
        return;
    }

    res.status(200).json(result);

    // res.status(200).send("not_ready_yet");
})



app.listen(PORT, "0.0.0.0", async () => {
    await northwindTradersModel.migrateDatabase();
    await northwindTradersModel.fillDatabase();

    // await northwindTradersModel.getProductsByName("ch");
    // console.log(await northwindTradersModel.getCustomersByCompanyName("an"))
    // await northwindTradersModel.getAllOrders();

    console.log(`app is listening on ${PORT} port.`)
})

