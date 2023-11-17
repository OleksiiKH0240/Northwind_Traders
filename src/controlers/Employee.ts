// import { northwindTradersModel } from "database";
import employeeRep from "database/repositories/EmployeeRep";
import { Request, Response } from "express";


class Employee {
    getAllEmployees = async (req: Request, res: Response) => {
        let employeesObj, dbResponse;
        try {
            dbResponse = await employeeRep.allEmployees();
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
    }

    getEmployeeById = async (req: Request, res: Response) => {
        const employeeId = Number(req.params.employee_id);

        let employeeObj, dbResponse;
        try {
            dbResponse = await employeeRep.employeeById(employeeId);
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
    }
}

export default new Employee();
