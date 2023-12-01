import express from 'express';
import cors from 'cors';

import initialRep from 'database/repositories/InitialRep';

import customerRouter from 'routers/CustomerRouter';
import supplierRouter from 'routers/SupplierRouter';
import productRouter from 'routers/ProductRouter';
import orderRouter from 'routers/OrderRouter';
import employeeRouter from 'routers/EmployeeRouter';
import searchRouter from 'routers/SearchRouter';

import 'dotenv/config';
import errorHandler from 'middlewares/ErrorHandlers';


const app = express();

app.use(express.json());
app.use(cors());

app.use("api/v1/customers/", customerRouter);
app.use("api/v2/customers/", customerRouter);
app.use(supplierRouter);
app.use(productRouter);
app.use(orderRouter);
app.use(employeeRouter);
app.use(searchRouter);

app.use(errorHandler.errorLogger);
app.use(errorHandler.errorResponder);


const PORT = Number(process.env.PORT) || 80;


app.get("/", async (req: express.Request, res: express.Response) => {
    res.status(200).send("healthy");
})


app.listen(PORT, "0.0.0.0", async () => {
    await initialRep.migrateDatabase();
    await initialRep.fillDatabase();

    console.log(`app is listening on ${PORT} port.`)
})
