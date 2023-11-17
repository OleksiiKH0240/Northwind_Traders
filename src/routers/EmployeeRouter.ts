import { Router } from "express";
import employee from "controlers/Employee";
import employeeMiddleware from "middlewares/EmployeeMiddleware";


const employeeRouter = Router();

employeeRouter.get("/employees", employee.getAllEmployees);
employeeRouter.get("/employee/:employee_id", employeeMiddleware.idValidation, employee.getEmployeeById);

export default employeeRouter;
