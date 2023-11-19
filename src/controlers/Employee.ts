// import { northwindTradersModel } from "database";
import employeeRep from "database/repositories/EmployeeRep";
import { Request, Response, NextFunction } from "express";


class Employee {
    getAllEmployees = async (req: Request, res: Response, next: NextFunction) => {
        let employeesObj, dbResponse;
        try {
            dbResponse = await employeeRep.allEmployees();
            employeesObj = dbResponse.result;

            res.status(200).json({
                response: employeesObj,
                dt: dbResponse.dt,
                sqlQuery: dbResponse.sqlQuery,
                productVersion: dbResponse.PRODUCT_VERSION,
                queryTime: dbResponse.queryTime
            });
        } catch (error) {
            next(error);
        }
    }

    getEmployeeById = async (req: Request, res: Response, next: NextFunction) => {
        const employeeId = Number(req.params.employee_id);

        let employeeObj, dbResponse;
        try {
            dbResponse = await employeeRep.employeeById(employeeId);
            employeeObj = dbResponse.result;

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
        } catch (error) {
            next(error);
        }
    }
}

export default new Employee();
