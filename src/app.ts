import express from 'express';
import dotenv from 'dotenv';
import { northwindTradersModel } from './database';


const app = express();

app.use(express.json());

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT || 8000;


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

app.get("/suppliers", (req: express.Request, res: express.Response) => {
    const MAX_SUPPLIERS_PER_PAGE = 20;
    const rawPageNumber = req.query.page || 1;
    const pageNumber: number = typeof rawPageNumber === 'string' ? parseInt(rawPageNumber) : 1;
    const minId = (pageNumber - 1) * MAX_SUPPLIERS_PER_PAGE + 1;
    const maxId = pageNumber * MAX_SUPPLIERS_PER_PAGE
})

app.get("/supplier/:supplier_id", (req: express.Request, res: express.Response) => {
    const supplierId = req.params.supplier_id;
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
    const employeesObj = await northwindTradersModel.getAllEmployees();
    res.status(200).json(employeesObj);
})

app.get("/employee/:employee_id", async (req: express.Request, res: express.Response) => {
    let employeeId;
    try {
        employeeId = parseInt(req.params.employee_id);
    }
    catch (error) {
        res.send(error);
        return;
    }

    const employeeObj = await northwindTradersModel.getEmployeeById(employeeId);
    res.status(200).json(employeeObj);
})

app.get("/customers", (req: express.Request, res: express.Response) => {

})

app.get("/customer/:customer_id", (req: express.Request, res: express.Response) => {
    const customerId = req.params.customer_id;
})

app.get("/search", (req: express.Request, res: express.Response) => {

})



app.listen(SERVER_PORT, async () => {
    await northwindTradersModel.migrateDatabase();
    await northwindTradersModel.fillDatabase();

    console.log(`app is listening on ${SERVER_PORT} port.`)
})

