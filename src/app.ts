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
    | typeof schemas.employees.$inferSelect
    | typeof schemas.orderDetails.$inferSelect
    | typeof schemas.orders.$inferSelect
    | typeof schemas.products.$inferSelect
    | typeof schemas.regions.$inferSelect
    | typeof schemas.shippers.$inferSelect
    | typeof schemas.suppliers.$inferSelect
    | typeof schemas.territories.$inferSelect;

function filterObject(obj: DatabaseModelType, fieldsToInclude: string[]): { [index: string]: number | string | null } {
    const filteredEntries = Object.entries(obj).filter(([key, value]) => fieldsToInclude.includes(key));
    const filteredObj = Object.fromEntries(filteredEntries);
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
    let suppliersObj;
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


    // const response = suppliersObj.map((supplierObj) => {
    //     return {
    //         supplierId: supplierObj.supplierId,
    //         companyName: supplierObj.companyName,
    //         contactName: supplierObj.contactName,
    //         contactTitle: supplierObj.contactTitle,
    //         city: supplierObj.city,
    //         country: supplierObj.country,
    //     };
    // });

    const response = suppliersObj.map((supplierObj) => filterObject(supplierObj, ["supplierId", "companyName", "contactName", "contactTitle", "city", "country"]))

    res.status(200).json(response);
})

app.get("/supplier/:supplier_id", async (req: express.Request, res: express.Response) => {
    const supplierId = Number(req.params.employee_id);
    if (Number.isNaN(supplierId)) {
        res.status(400).send("wrong format of employeeId");
        return;
    }

    let supplierObj;
    try {
        supplierObj = await northwindTradersModel.getSupplierById(supplierId);
    } catch (error) {
        res.status(500).send("something went wrong on the server side.");
        return;
    }

    res.status(200).json(supplierObj);
})

app.get("/products", (req: express.Request, res: express.Response) => {

})

app.get("/product/:product_id", (req: express.Request, res: express.Response) => {
    const productId = req.params.product_id;
})

app.get("/orders", (req: express.Request, res: express.Response) => {

})

app.get("/order/:order_id", (req: express.Request, res: express.Response) => {
    const orderId = req.params.order_id;
})

app.get("/employees", async (req: express.Request, res: express.Response) => {
    let employeesObj;
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

    const response = employeesObj.map((employeeObj) => {
        return {
            employeeId: employeeObj.employeeId,
            name: (employeeObj.firstName + " " + employeeObj.lastName),
            title: employeeObj.title,
            city: employeeObj.city,
            country: employeeObj.country,
            phone: employeeObj.homePhone
        };
    });
    res.status(200).json(response);
})

app.get("/employee/:employee_id", async (req: express.Request, res: express.Response) => {
    const employeeId = Number(req.params.employee_id);
    if (Number.isNaN(employeeId)) {
        res.status(400).send("wrong format of employeeId");
        return;
    }

    let employeeObj;
    try {
        employeeObj = await northwindTradersModel.getEmployeeById(employeeId);
    } catch (error) {
        res.status(500).send("something went wrong on the server side.");
        return;
    }

    res.status(200).json(employeeObj);
})

app.get("/customers", async (req: express.Request, res: express.Response) => {
    let customersObj;
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

    const response = customersObj.map((customerObj) => {
        return {
            customerId: customerObj.customerId,
            companyName: customerObj.companyName,
            contactName: customerObj.contactName,
            city: customerObj.city,
            country: customerObj.country,
            contactTitle: customerObj.contactTitle
        };
    });
    res.status(200).json(response);
})

app.get("/customer/:customer_id", async (req: express.Request, res: express.Response) => {
    const customerId = req.params.customer_id;
    if (customerId === undefined || customerId.length != 5) {
        res.status(400).send("wrong format of customerId");
        return;
    }

    let customerObj;
    try {
        customerObj = await northwindTradersModel.getCustomerById(customerId);
    } catch (error) {
        res.status(500).send("something went wrong on the server side.");
        return;
    }

    res.status(200).json(customerObj);
})

app.get("/search", (req: express.Request, res: express.Response) => {

})



app.listen(PORT, "0.0.0.0", async () => {
    await northwindTradersModel.migrateDatabase();
    await northwindTradersModel.fillDatabase();

    console.log(`app is listening on ${PORT} port.`)
})

