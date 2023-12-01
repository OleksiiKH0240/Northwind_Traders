import { db, PRODUCT_VERSION } from "database/databaseConnection";
import employees from 'database/schemas/employees';
import { ModelTemplateReturnType, EmployeeReturnType, EmployeesReturnType } from "types/RepReturnTypes";
import { eq, sql, aliasedTable } from "drizzle-orm";


class EmployeeRep {
    dbClient

    constructor(dbClient = db) {
        this.dbClient = dbClient;
    }

    allEmployees = async (): Promise<ModelTemplateReturnType<EmployeesReturnType>> => {
        const resultQuery = this.dbClient.select({
            employeeId: employees.employeeId,
            Name: sql<string>`concat(${employees.firstName}, ' ', ${employees.lastName})`,
            Title: employees.title,
            City: employees.city,
            Country: employees.country,
            Phone: employees.homePhone
        }).from(employees);

        const start = Date.now();
        const result = await resultQuery;
        const end = Date.now();

        const sqlQuery = resultQuery.toSQL()["sql"];

        return { dt: new Date(), "PRODUCT_VERSION": `${PRODUCT_VERSION}`, queryTime: (end - start) / 1000, sqlQuery, result };
    }

    employeeById = async (employeeId: number): Promise<ModelTemplateReturnType<EmployeeReturnType>> => {
        const e = aliasedTable(employees, "e");
        const resultQuery = this.dbClient.select({
            employeeId: employees.employeeId,
            Name: sql<string>`concat(${employees.firstName}, ' ', ${employees.lastName})`,
            Title: employees.title,
            "Title Of Courtesy": employees.titleOfCourtesy,
            "Birth Date": employees.birthDate,
            "Hire Date": employees.hireDate,
            Address: employees.address,
            City: employees.city,
            "Postal Code": employees.postalCode,
            "Country": employees.country,
            "Home Phone": employees.homePhone,
            Extension: employees.extension,
            Notes: employees.notes,
            "Reports To": sql<string>`concat(${e.firstName}, ' ', ${e.lastName})`,
            "reportsTo": employees.reportsTo
        }).from(employees).
            leftJoin(e, eq(employees.reportsTo, e.employeeId)).
            where(eq(employees.employeeId, employeeId));

        const start = Date.now();
        const result = await resultQuery;
        const end = Date.now();

        let { "sql": sqlObj, params } = resultQuery.toSQL();
        params.forEach((param: any) => { sqlObj = sqlObj.replace(/\$[1-9]+/, `${param}`) });
        const sqlQuery = sqlObj;

        return { dt: new Date(), "PRODUCT_VERSION": `${PRODUCT_VERSION}`, queryTime: (end - start) / 1000, sqlQuery, result: result[0] };
    }
}

export default new EmployeeRep();
