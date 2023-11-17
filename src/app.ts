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

// app.use("/customers", customerRouter);
app.use(customerRouter);
app.use(supplierRouter);
app.use(productRouter);
app.use(orderRouter);
app.use(employeeRouter);
app.use(searchRouter);


const PORT = Number(process.env.PORT) || 80;


app.get("/", async (req: express.Request, res: express.Response) => {
    res.status(200).send("healthy");
})


app.listen(PORT, "0.0.0.0", async () => {
    await initialRep.migrateDatabase();
    await initialRep.fillDatabase();

    console.log(`app is listening on ${PORT} port.`)
})
