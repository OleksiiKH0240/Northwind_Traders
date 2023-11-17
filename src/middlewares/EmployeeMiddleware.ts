import { Request, Response, NextFunction } from "express";


class EmployeeMiddleware {
    idValidation = async (req: Request, res: Response, next: NextFunction) => {
        const employeeId = Number(req.params.employee_id);
        if (Number.isNaN(employeeId)) {
            return res.status(400).send("wrong format of employeeId");
        }
        next();
    }
}

export default new EmployeeMiddleware();
