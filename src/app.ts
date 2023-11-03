import express from 'express';
import dotenv from 'dotenv';
import { northwindTradersModel } from './database';
import * as schemas from 'schemas';


const app = express();

app.use(express.json());

dotenv.config();

const PORT = process.env.PORT || 80;

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
    let suppliersObj: typeof schemas.suppliers.$inferSelect[];
    try {
        suppliersObj = await northwindTradersModel.getAllSuppliers();
    } catch (error) {
        res.status(500).send("something went wrong on the server side.");
        return;
    }

    const maxPageNumber = Math.ceil(suppliersObj.length / MAX_ITEMS_PER_PAGE);
    const pageNumber: number = Number(req.query.page || 1);
    if (pageNumber > maxPageNumber || pageNumber < 0) {
        res.status(200).send("No results");
        return;
    }

    const minIdx = (pageNumber - 1) * MAX_ITEMS_PER_PAGE;
    const maxIdx = pageNumber * MAX_ITEMS_PER_PAGE - 1;
    suppliersObj = suppliersObj.slice(minIdx, maxIdx + 1);

    const response = suppliersObj.map((supplierObj) => filterObject(supplierObj,
        ["supplierId", "companyName", "contactName", "contactTitle", "city", "country"],
        { "companyName": "Company", "contactName": "Contact", "contactTitle": "Title", "city": "City", "country": "Country" }))

    res.status(200).json(response);
})

app.get("/supplier/:supplier_id", async (req: express.Request, res: express.Response) => {
    const supplierId = Number(req.params.supplier_id);
    if (Number.isNaN(supplierId)) {
        res.status(400).send("wrong format of supplierId");
        return;
    }

    let supplierObj;
    try {
        supplierObj = await northwindTradersModel.getSupplierById(supplierId);
    } catch (error) {
        res.status(500).send("something went wrong on the server side.");
        return;
    }

    let response = filterObject(supplierObj,
        ["supplierId", "companyName", "contactName", "contactTitle", "address", "city", "region", "postalCode", "country", "phone"],
        {
            "companyName": "Company", "contactName": "Contact", "contactTitle": "Title",
            "city": "City", "country": "Country", "address": "Address", "region": "Region", "postalCode": "PostalCode", "phone": "Phone"
        });

    res.status(200).json(response);
})

app.get("/products", async (req: express.Request, res: express.Response) => {
    let productsObj: typeof schemas.products.$inferSelect[];
    try {
        productsObj = await northwindTradersModel.getAllProducts();
    } catch (error) {
        res.status(500).send("something went wrong on the server side.");
        return;
    }

    const maxPageNumber = Math.ceil(productsObj.length / MAX_ITEMS_PER_PAGE);
    const pageNumber: number = Number(req.query.page || 1);
    if (pageNumber > maxPageNumber || pageNumber < 0) {
        res.status(200).send("No results");
        return;
    }

    const minIdx = (pageNumber - 1) * MAX_ITEMS_PER_PAGE;
    const maxIdx = pageNumber * MAX_ITEMS_PER_PAGE - 1;
    productsObj = productsObj.slice(minIdx, maxIdx + 1);

    const response = productsObj.map((productObj) => filterObject(productObj,
        ["productId", "productName", "quantityPerUnit", "unitPrice", "unitsInStock", "unitsOnOrder"],
        { "productName": "Name", "quantityPerUnit": "Qt per unit", "unitPrice": "Price", "unitsInStock": "Stock", "unitsOnOrder": "Order" }))

    res.status(200).json(response);
})

app.get("/product/:product_id", async (req: express.Request, res: express.Response) => {
    const productId = Number(req.params.product_id);
    if (Number.isNaN(productId)) {
        res.status(400).send("wrong format of productId");
        return;
    }

    let productObj: typeof schemas.products.$inferSelect;
    try {
        productObj = await northwindTradersModel.getProductById(productId);
    } catch (error) {
        res.status(500).send("something went wrong on the server side.");
        return;
    }

    let supplierName: string | null;
    if (productObj.supplierId === null) supplierName = null;
    else {
        const supplierObj = await northwindTradersModel.getSupplierById(productObj.supplierId);
        supplierName = supplierObj.companyName;
    }

    let response = filterObject(productObj,
        ["productId", "supplierId", "productName", "quantityPerUnit", "unitPrice", "unitsInStock", "unitsOnOrder", "reorderLevel", "discontinued"],
        { "productName": "Name", "quantityPerUnit": "Qt per unit", "unitPrice": "Price", "unitsInStock": "Stock", "unitsOnOrder": "Order" });
    response = { ...response, supplierName };

    res.status(200).json(response);
})

app.get("/orders", async (req: express.Request, res: express.Response) => {
    let ordersObj: typeof schemas.orders.$inferSelect[];
    try {
        ordersObj = await northwindTradersModel.getAllOrders();
    } catch (error) {
        res.status(500).send("something went wrong on the server side.");
        return;
    }

    const maxPageNumber = Math.ceil(ordersObj.length / MAX_ITEMS_PER_PAGE);
    const pageNumber: number = Number(req.query.page || 1);
    if (pageNumber > maxPageNumber || pageNumber < 0) {
        res.status(200).send("No results");
        return;
    }

    const minIdx = (pageNumber - 1) * MAX_ITEMS_PER_PAGE;
    const maxIdx = pageNumber * MAX_ITEMS_PER_PAGE - 1;
    ordersObj = ordersObj.slice(minIdx, maxIdx + 1);
    console.log(ordersObj)

    const response = ordersObj.map((orderObj) => filterObject(orderObj,
        ["orderId", "quantityPerUnit", "unitPrice", "unitsInStock", "unitsOnOrder"]))

    res.status(200).json(response);
    // res.status(200).send("not_ready_yet");
})

app.get("/order/:order_id", (req: express.Request, res: express.Response) => {
    const orderId = req.params.order_id;
    res.status(200).send("not_ready_yet");
})

app.get("/employees", async (req: express.Request, res: express.Response) => {
    let employeesObj: typeof schemas.employees.$inferSelect[];
    try {
        employeesObj = await northwindTradersModel.getAllEmployees();
    } catch (error) {
        res.status(500).send("something went wrong on the server side.");
        return;
    }

    const maxPageNumber = Math.ceil(employeesObj.length / MAX_ITEMS_PER_PAGE);
    const pageNumber: number = Number(req.query.page || 1);
    if (pageNumber > maxPageNumber || pageNumber < 0) {
        res.status(200).send("No results");
        return;
    }

    const minIdx = (pageNumber - 1) * MAX_ITEMS_PER_PAGE;
    const maxIdx = pageNumber * MAX_ITEMS_PER_PAGE - 1;
    employeesObj = employeesObj.slice(minIdx, maxIdx + 1);

    const partResponse = employeesObj.map((employeeObj) => { return { ...employeeObj, Name: employeeObj.firstName + " " + employeeObj.lastName } });
    const response = partResponse.map((employeeObj) => filterObject(employeeObj,
        ["employeeId", "Name", "title", "homePhone", "city", "country"],
        { "title": "Title", "city": "City", "country": "Country", "homePhone": "Phone" }))
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

    const response = { ...employeeObj, reportsToEmployeeName };
    res.status(200).json(response);
})

app.get("/customers", async (req: express.Request, res: express.Response) => {
    let customersObj: typeof schemas.customers.$inferSelect[];
    try {
        customersObj = await northwindTradersModel.getAllCustomers();
    } catch (error) {
        res.status(500).send("something went wrong on the server side.");
        return;
    }

    const maxPageNumber = Math.ceil(customersObj.length / MAX_ITEMS_PER_PAGE);
    const pageNumber: number = Number(req.query.page || 1);
    if (pageNumber > maxPageNumber || pageNumber < 0) {
        res.status(200).send("No results");
        return;
    }

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

    res.status(200).json(customerObj);
})

app.get("/search", (req: express.Request, res: express.Response) => {
    res.status(200).send("not_ready_yet");
})



app.listen(PORT, "0.0.0.0", async () => {
    await northwindTradersModel.migrateDatabase();
    await northwindTradersModel.fillDatabase();

    console.log(`app is listening on ${PORT} port.`)
})

